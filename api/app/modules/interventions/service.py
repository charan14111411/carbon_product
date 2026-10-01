"""Intervention plans: what each farmer commits to on each enrolled field, the farmer's agreement,
compliance against recorded practices and deviations.

Compliance only reads practice records (the latest active version of each record, project scenario);
it never writes them. A plan change is a new version that the farmer agrees to again and a second
staff member activates.
"""

from __future__ import annotations

import hashlib
import json
import uuid
from collections import Counter
from datetime import date
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, ensure_not_author
from app.core.config import get_settings
from app.core.db import utcnow
from app.core.errors import Blocked, Conflict, Forbidden, IllegalTransition, NotFound, ValidationFailed
from app.core.permissions import P
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.catalogue.service import get_practice_type
from app.modules.farmers.models import Farmer
from app.modules.identity.models import AuditEntry
from app.modules.interventions.models import Commitment, Deviation, InterventionPlan
from app.modules.interventions.schemas import CommitmentIn, DeviationIn, PlanIn, PlanPatch, ReviseIn
from app.modules.land.models import Enrolment, Field
from app.modules.portfolio.masking import farmer_public
from app.modules.practices.models import PracticeRecord
from app.modules.programmes.models import Project

DEMO_OTP = "123456"
OPEN_STATUSES = ("draft", "agreed", "active")
CURRENT_STATUSES = ("agreed", "active", "completed", "withdrawn")
STAFF_READ = (P.READ, P.MANAGE_FARMERS, P.RECORD_PRACTICE)
STAFF_WRITE = (P.MANAGE_FARMERS, P.RECORD_PRACTICE)
RANK = {"met": 0, "partially": 1, "not_met": 2}


def today() -> date:
    return date.today()


# ------------------------------------------------------------------ access
def _is_staff(user: CurrentUser, perms=STAFF_READ) -> bool:
    return any(user.can(p) for p in perms)


def _own_farmer(user: CurrentUser) -> str | None:
    return str((user.scope or {}).get("farmer_id") or "") or None


def _check_read(user: CurrentUser, plan: InterventionPlan) -> None:
    if _is_staff(user):
        return
    if user.can(P.FARMER_SELF) and _own_farmer(user) == str(plan.farmer_id):
        return
    raise NotFound("Intervention plan not found.")


def get_plan(db: Session, user: CurrentUser, plan_row_id: str) -> InterventionPlan:
    plan = get_owned(db, InterventionPlan, plan_row_id, user, "Intervention plan")
    _check_read(user, plan)
    return plan


def farmer_for(db: Session, user: CurrentUser, farmer_id: str) -> Farmer:
    farmer = get_owned(db, Farmer, farmer_id, user, "Farmer")
    if _is_staff(user) or (user.can(P.FARMER_SELF) and _own_farmer(user) == str(farmer.id)):
        return farmer
    raise NotFound("Farmer not found.")


# ------------------------------------------------------------------ helpers
def commitments_of(db: Session, plan: InterventionPlan) -> list[Commitment]:
    return list(db.scalars(select(Commitment).where(Commitment.plan_row_id == plan.id)
                           .order_by(Commitment.practice_code, Commitment.start_year)).all())


def _versions(db: Session, plan: InterventionPlan) -> list[InterventionPlan]:
    return list(db.scalars(select(InterventionPlan).where(InterventionPlan.plan_id == plan.plan_id)
                           .order_by(InterventionPlan.version)).all())


def _validate_commitments(db: Session, user: CurrentUser, field: Field, items: list[CommitmentIn]) -> list[dict]:
    out: list[dict] = []
    for i, c in enumerate(items):
        pt = get_practice_type(db, user.org_id, c.practice_code)
        if pt is None or not pt.is_active:
            raise ValidationFailed(f"'{c.practice_code}' is not an active practice in your catalogue.",
                                   code="UNKNOWN_PRACTICE", details={"index": i, "practice_code": c.practice_code})
        if pt.crop_codes and field.crop_code not in pt.crop_codes:
            raise ValidationFailed(f"{pt.name} only applies to {', '.join(pt.crop_codes)}; field {field.code} is "
                                   f"{field.crop_code or 'not assigned a crop'}.", code="INTERVENTION_NOT_ELIGIBLE",
                                   details={"index": i, "practice_code": pt.code})
        unit = c.unit
        if c.expected_quantity is not None:
            if pt.unit and unit and unit != pt.unit:
                raise ValidationFailed(f"{pt.name} is recorded in {pt.unit}, not {unit}.",
                                       details={"index": i})
            unit = unit or pt.unit
        else:
            unit = None
        for prev in out:
            if prev["practice_code"] == pt.code:
                a0, a1 = prev["start_year"], prev["end_year"] or 9999
                b0, b1 = c.start_year, c.end_year or 9999
                if a0 <= b1 and b0 <= a1:
                    raise ValidationFailed(f"{pt.name} is committed twice for overlapping years. Combine them.",
                                           code="OVERLAPPING_COMMITMENTS", details={"index": i})
        out.append({"practice_code": pt.code, "start_year": c.start_year, "start_season": c.start_season,
                    "end_year": c.end_year, "end_season": c.end_season, "times_per_year": c.times_per_year,
                    "expected_quantity": c.expected_quantity, "unit": unit, "notes": c.notes})
    return out


def _write_commitments(db: Session, user: CurrentUser, plan: InterventionPlan, rows: list[dict]) -> None:
    for old in commitments_of(db, plan):
        db.delete(old)
    db.flush()
    for r in rows:
        db.add(Commitment(org_id=user.org_id, created_by=user.id, plan_row_id=plan.id, **r))
    db.flush()


def plan_text(db: Session, plan: InterventionPlan) -> str:
    """The canonical text the farmer agrees to; its SHA-256 is stored with the agreement."""
    items = [{k: getattr(c, k) for k in ("practice_code", "start_year", "start_season", "end_year", "end_season",
                                         "times_per_year", "expected_quantity", "unit")}
             for c in commitments_of(db, plan)]
    return json.dumps({"plan": plan.code, "version": plan.version, "field_id": str(plan.field_id),
                       "commitments": items, "notes": plan.notes}, sort_keys=True)


def _editors(db: Session, org_id: uuid.UUID, plan: InterventionPlan) -> list[uuid.UUID | None]:
    return list(db.scalars(select(AuditEntry.created_by).where(
        AuditEntry.org_id == org_id, AuditEntry.entity_id == str(plan.id),
        AuditEntry.action.in_(("intervention_plan.create", "intervention_plan.update", "intervention_plan.revise")))
    ).all())


def _next_code(db: Session, org_id: uuid.UUID) -> str:
    n = db.scalar(select(func.count(func.distinct(InterventionPlan.plan_id))).where(
        InterventionPlan.org_id == org_id)) or 0
    return f"IP-{n + 1:05d}"


# ------------------------------------------------------------------ outputs
def commitment_out(c: Commitment) -> dict[str, Any]:
    return {"id": str(c.id), "practice_code": c.practice_code, "start_year": c.start_year,
            "start_season": c.start_season, "end_year": c.end_year, "end_season": c.end_season,
            "times_per_year": c.times_per_year, "expected_quantity": c.expected_quantity, "unit": c.unit,
            "notes": c.notes}


def plan_out(db: Session, user: CurrentUser, p: InterventionPlan, detail: bool = True) -> dict[str, Any]:
    fld = db.get(Field, p.field_id)
    out = {
        "id": str(p.id), "plan_id": str(p.plan_id), "code": p.code, "version": p.version, "status": p.status,
        "project_id": str(p.project_id), "enrolment_id": str(p.enrolment_id), "field_id": str(p.field_id),
        "field_code": fld.code if fld else None, "farmer_id": str(p.farmer_id),
        "farmer": farmer_public(user, db.get(Farmer, p.farmer_id)),
        "supersedes_id": str(p.supersedes_id) if p.supersedes_id else None, "change_reason": p.change_reason,
        "notes": p.notes, "agreed_at": p.agreed_at.isoformat() if p.agreed_at else None,
        "agreed_method": p.agreed_method, "agreed_text_sha256": p.agreed_text_sha256,
        "activated_by": str(p.activated_by) if p.activated_by else None,
        "activated_at": p.activated_at.isoformat() if p.activated_at else None,
        "closed_on": p.closed_on.isoformat() if p.closed_on else None, "close_reason": p.close_reason,
        "created_by": str(p.created_by) if p.created_by else None, "created_at": p.created_at.isoformat(),
    }
    if detail:
        out["commitments"] = [commitment_out(c) for c in commitments_of(db, p)]
        out["versions"] = [{"id": str(v.id), "version": v.version, "status": v.status,
                            "change_reason": v.change_reason} for v in _versions(db, p)]
    return out


def deviation_out(d: Deviation) -> dict[str, Any]:
    return {"id": str(d.id), "plan_id": str(d.plan_id), "plan_row_id": str(d.plan_row_id),
            "commitment_id": str(d.commitment_id) if d.commitment_id else None, "year": d.year,
            "source": d.source, "kind": d.kind, "reason": d.reason, "corrective_action": d.corrective_action,
            "impact": d.impact, "status": d.status, "detail": d.detail or {}, "history": d.history or [],
            "created_at": d.created_at.isoformat()}


# ------------------------------------------------------------------ writes
def create_plan(db: Session, user: CurrentUser, body: PlanIn) -> InterventionPlan:
    project = get_owned(db, Project, body.project_id, user, "Project")
    fld = get_owned(db, Field, body.field_id, user, "Field")
    enrolment = db.scalar(select(Enrolment).where(Enrolment.project_id == project.id, Enrolment.field_id == fld.id))
    if enrolment is None or enrolment.status not in ("eligible", "enrolled"):
        raise Blocked("An intervention plan needs a field that is eligible for or enrolled in this project.",
                      code="FIELD_NOT_ENROLLED", details={"enrolment_status": enrolment.status if enrolment else None})
    existing = db.scalar(scoped(InterventionPlan, user).where(
        InterventionPlan.project_id == project.id, InterventionPlan.field_id == fld.id,
        InterventionPlan.status.in_(OPEN_STATUSES)))
    if existing:
        raise Conflict(f"Field {fld.code} already has plan {existing.code}. Revise that plan instead.",
                       code="PLAN_EXISTS", details={"plan_id": str(existing.id)})
    rows = _validate_commitments(db, user, fld, body.commitments)
    plan = InterventionPlan(org_id=user.org_id, created_by=user.id, plan_id=uuid.uuid4(), version=1,
                            code=_next_code(db, user.org_id), project_id=project.id, enrolment_id=enrolment.id,
                            field_id=fld.id, farmer_id=enrolment.farmer_id, status="draft", notes=body.notes)
    db.add(plan)
    db.flush()
    _write_commitments(db, user, plan, rows)
    audit(db, user, "intervention_plan.create", plan)
    return plan


def update_plan(db: Session, user: CurrentUser, plan_row_id: str, body: PlanPatch) -> InterventionPlan:
    plan = get_owned(db, InterventionPlan, plan_row_id, user, "Intervention plan")
    if plan.status != "draft":
        raise IllegalTransition("Only a draft plan can be edited. Revise the plan to change its commitments.",
                                code="PLAN_FROZEN")
    before = snapshot(plan)
    if body.notes is not None:
        plan.notes = body.notes
    if body.commitments is not None:
        _write_commitments(db, user, plan, _validate_commitments(db, user, db.get(Field, plan.field_id),
                                                                 body.commitments))
    plan.updated_at = utcnow()
    audit(db, user, "intervention_plan.update", plan, before=before)
    return plan


def _check_otp(code: str | None) -> None:
    if get_settings().is_production:
        raise ValidationFailed("OTP signing isn't connected to an SMS provider yet. Use assisted signing.",
                               code="OTP_UNAVAILABLE")
    if (code or "").strip() != DEMO_OTP:
        raise ValidationFailed("That code didn't work. Check the SMS and try again.", code="OTP_INVALID")


def agree_plan(db: Session, user: CurrentUser, plan_row_id: str, method: str, otp_code: str | None) -> InterventionPlan:
    plan = get_plan(db, user, plan_row_id)
    is_self = user.can(P.FARMER_SELF) and _own_farmer(user) == str(plan.farmer_id)
    if not is_self and not _is_staff(user, STAFF_WRITE):
        raise Forbidden("You don't have permission to do this.")
    if plan.status != "draft":
        raise IllegalTransition(f"Only a draft plan can be agreed; this one is {plan.status}.",
                                details={"from": plan.status, "to": "agreed"})
    farmer = db.get(Farmer, plan.farmer_id)
    if farmer.status != "active":
        raise Blocked("Only an active farmer can agree to a plan.")
    witness = None
    if method == "otp":
        _check_otp(otp_code)
    else:
        if not user.can(P.MANAGE_FARMERS):
            raise ValidationFailed("Assisted agreement must be witnessed by a staff member.", code="WITNESS_REQUIRED")
        witness = user.id
    before = snapshot(plan)
    plan.status, plan.agreed_at, plan.agreed_method, plan.witness_user_id = "agreed", utcnow(), method, witness
    plan.agreed_text_sha256 = hashlib.sha256(plan_text(db, plan).encode("utf-8")).hexdigest()
    audit(db, user, "intervention_plan.agree", plan, before=before)
    return plan


def activate_plan(db: Session, user: CurrentUser, plan_row_id: str) -> InterventionPlan:
    plan = get_owned(db, InterventionPlan, plan_row_id, user, "Intervention plan")
    if plan.status != "agreed":
        raise IllegalTransition(f"Only an agreed plan can be activated; this one is {plan.status}.",
                                details={"from": plan.status, "to": "active"})
    ensure_not_author(user.id, plan.created_by, *_editors(db, user.org_id, plan), what="an intervention plan")
    enrolment = db.get(Enrolment, plan.enrolment_id)
    if enrolment is None or enrolment.status != "enrolled":
        raise Blocked("The field must be enrolled before its plan becomes active.", code="FIELD_NOT_ENROLLED")
    before = snapshot(plan)
    if plan.supersedes_id:
        prev = db.get(InterventionPlan, plan.supersedes_id)
        if prev is not None and prev.status in ("agreed", "active"):
            pb = snapshot(prev)
            prev.status = "superseded"
            audit(db, user, "intervention_plan.supersede", prev, before=pb, reason=f"Replaced by version {plan.version}")
        db.add(Deviation(org_id=user.org_id, created_by=user.id, plan_id=plan.plan_id, plan_row_id=plan.id,
                         source="manual", kind="changed", reason=plan.change_reason, status="closed",
                         impact="unassessed", detail={"from_version": plan.version - 1, "to_version": plan.version},
                         history=[{"at": utcnow().isoformat(), "by": str(user.id), "status": "closed",
                                   "note": "Approved change: new plan version activated."}]))
    plan.status, plan.activated_by, plan.activated_at = "active", user.id, utcnow()
    audit(db, user, "intervention_plan.activate", plan, before=before)
    return plan


def close_plan(db: Session, user: CurrentUser, plan_row_id: str, to: str, reason: str) -> InterventionPlan:
    plan = get_owned(db, InterventionPlan, plan_row_id, user, "Intervention plan")
    allowed = {"completed": ("active",), "withdrawn": ("draft", "agreed", "active")}[to]
    if plan.status not in allowed:
        raise IllegalTransition(f"A plan that is {plan.status} can't be marked {to}.",
                                details={"from": plan.status, "to": to, "allowed_from": list(allowed)})
    if to == "withdrawn" and not reason.strip():
        raise ValidationFailed("Say why the plan is being withdrawn.", code="REASON_REQUIRED")
    before = snapshot(plan)
    plan.status, plan.closed_on, plan.close_reason = to, today(), reason or None
    audit(db, user, f"intervention_plan.{to}", plan, before=before, reason=reason or None)
    return plan


def revise_plan(db: Session, user: CurrentUser, plan_row_id: str, body: ReviseIn) -> InterventionPlan:
    cur = get_owned(db, InterventionPlan, plan_row_id, user, "Intervention plan")
    if cur.status not in ("agreed", "active"):
        raise IllegalTransition(f"Only an agreed or active plan can be revised; this one is {cur.status}.")
    latest = _versions(db, cur)[-1]
    if latest.id != cur.id:
        raise Conflict(f"Version {latest.version} of this plan already exists ({latest.status}).",
                       code="REVISION_PENDING", details={"plan_row_id": str(latest.id)})
    rows = _validate_commitments(db, user, db.get(Field, cur.field_id), body.commitments)
    new = InterventionPlan(org_id=user.org_id, created_by=user.id, plan_id=cur.plan_id, version=cur.version + 1,
                           code=cur.code, project_id=cur.project_id, enrolment_id=cur.enrolment_id,
                           field_id=cur.field_id, farmer_id=cur.farmer_id, status="draft", supersedes_id=cur.id,
                           change_reason=body.reason, notes=cur.notes if body.notes is None else body.notes)
    db.add(new)
    db.flush()
    _write_commitments(db, user, new, rows)
    audit(db, user, "intervention_plan.revise", new, reason=body.reason)
    return new


# ------------------------------------------------------------------ compliance
def _latest_project_records(db: Session, org_id: uuid.UUID, field_ids: list[uuid.UUID]) -> list[PracticeRecord]:
    if not field_ids:
        return []
    latest: dict[uuid.UUID, PracticeRecord] = {}
    for r in db.scalars(select(PracticeRecord).where(PracticeRecord.org_id == org_id,
                                                     PracticeRecord.field_id.in_(field_ids))).all():
        if r.record_id not in latest or r.version > latest[r.record_id].version:
            latest[r.record_id] = r
    return [r for r in latest.values() if r.status == "active" and r.scenario == "project"]


def _year_status(year: int, count: int, qty: float, c: Commitment, on: date) -> str:
    met = count >= c.times_per_year and (c.expected_quantity is None or qty + 1e-9 >= c.expected_quantity)
    if year > on.year:
        return "upcoming"
    if year == on.year:  # the year is still running: nothing recorded yet is not a failure
        return "met" if met else ("partially" if count else "upcoming")
    if count == 0:
        return "not_met"
    return "met" if met else "partially"


def commitment_compliance(c: Commitment, plan: InterventionPlan, records: list[PracticeRecord],
                          on: date | None = None) -> dict[str, Any]:
    on = on or today()
    last = c.end_year or max(on.year, c.start_year)
    if plan.closed_on:
        last = min(last, plan.closed_on.year)
    years = []
    for y in range(c.start_year, last + 1):
        recs = [r for r in records if r.field_id == plan.field_id and r.practice_code == c.practice_code
                and r.performed_on.year == y]
        qty = round(sum(r.quantity or 0 for r in recs), 6)
        years.append({"year": y, "expected_times": c.times_per_year, "recorded_times": len(recs),
                      "expected_quantity": c.expected_quantity, "recorded_quantity": qty if recs else 0,
                      "unit": c.unit, "record_ids": [str(r.record_id) for r in recs],
                      "status": _year_status(y, len(recs), qty, c, on)})
    evaluated = [y["status"] for y in years if y["status"] != "upcoming"]
    if not evaluated:
        overall = "upcoming"
    elif all(s == "met" for s in evaluated):
        overall = "met"
    elif all(s == "not_met" for s in evaluated):
        overall = "not_met"
    else:
        overall = "partially"
    return {"commitment": commitment_out(c), "status": overall, "years": years, "data_class": "DERIVED"}


def plan_compliance(db: Session, user: CurrentUser, plan: InterventionPlan) -> dict[str, Any]:
    records = _latest_project_records(db, user.org_id, [plan.field_id])
    items = [commitment_compliance(c, plan, records) for c in commitments_of(db, plan)]
    counts = Counter(i["status"] for i in items)
    return {"plan_row_id": str(plan.id), "code": plan.code, "version": plan.version, "status": plan.status,
            "counts": dict(counts), "commitments": items,
            "basis": "Latest active project-scenario practice records on the plan's field, counted per calendar year."}


def _current_rows(db: Session, user: CurrentUser, project_id: uuid.UUID) -> list[InterventionPlan]:
    rows = db.scalars(scoped(InterventionPlan, user).where(InterventionPlan.project_id == project_id)
                      .order_by(InterventionPlan.code, InterventionPlan.version)).all()
    cur: dict[uuid.UUID, InterventionPlan] = {}
    for r in rows:
        if r.status in CURRENT_STATUSES:
            cur[r.plan_id] = r  # ordered by version, so the latest current version wins
    return list(cur.values())


def project_compliance(db: Session, user: CurrentUser, project_id: str) -> dict[str, Any]:
    project = get_owned(db, Project, project_id, user, "Project")
    all_rows = db.scalars(scoped(InterventionPlan, user).where(InterventionPlan.project_id == project.id)).all()
    latest: dict[uuid.UUID, InterventionPlan] = {}
    for r in all_rows:
        if r.plan_id not in latest or r.version > latest[r.plan_id].version:
            latest[r.plan_id] = r
    plans = [p for p in _current_rows(db, user, project.id) if p.status in ("agreed", "active", "completed")]
    records = _latest_project_records(db, user.org_id, [p.field_id for p in plans])
    commitment_counts: Counter = Counter()
    rows = []
    for p in plans:
        items = [commitment_compliance(c, p, records) for c in commitments_of(db, p)]
        cc = Counter(i["status"] for i in items)
        commitment_counts.update(cc)
        evaluated = [i["status"] for i in items if i["status"] != "upcoming"]
        overall = max(evaluated, key=lambda s: RANK[s]) if evaluated else "upcoming"
        fld = db.get(Field, p.field_id)
        rows.append({"plan_row_id": str(p.id), "code": p.code, "version": p.version, "status": p.status,
                     "field_code": fld.code if fld else None, "farmer": farmer_public(user, db.get(Farmer, p.farmer_id)),
                     "overall": overall, "counts": dict(cc)})
    open_devs = db.scalar(select(func.count()).select_from(Deviation).where(
        Deviation.org_id == user.org_id, Deviation.status != "closed",
        Deviation.plan_id.in_([p.plan_id for p in latest.values()] or [uuid.uuid4()]))) or 0
    return {
        "project_id": str(project.id),
        "plans_by_status": dict(Counter(p.status for p in latest.values())),
        "commitments_by_status": dict(commitment_counts),
        "plans_with_not_met": sum(1 for r in rows if r["overall"] == "not_met"),
        "open_deviations": open_devs, "plans": rows, "data_class": "DERIVED",
    }


# ------------------------------------------------------------------ deviations
def _dev_entry(user: CurrentUser, status: str, note: str) -> dict[str, Any]:
    return {"at": utcnow().isoformat(), "by": str(user.id), "status": status, "note": note}


def detect_deviations(db: Session, user: CurrentUser, plan: InterventionPlan) -> list[Deviation]:
    """Record a deviation for every past year a commitment was missed or only partly done (once per year)."""
    if plan.status not in ("active", "completed", "withdrawn"):
        return []
    records = _latest_project_records(db, user.org_id, [plan.field_id])
    created = []
    for c in commitments_of(db, plan):
        comp = commitment_compliance(c, plan, records)
        for y in comp["years"]:
            if y["status"] not in ("not_met", "partially") or y["year"] >= today().year:
                continue
            exists = db.scalar(select(Deviation).where(Deviation.commitment_id == c.id, Deviation.year == y["year"],
                                                       Deviation.source == "auto"))
            if exists:
                continue
            kind = "missed" if y["status"] == "not_met" else "partial"
            d = Deviation(org_id=user.org_id, created_by=user.id, plan_id=plan.plan_id, plan_row_id=plan.id,
                          commitment_id=c.id, year=y["year"], source="auto", kind=kind,
                          reason=f"{c.practice_code}: {y['recorded_times']} of {y['expected_times']} recorded in "
                                 f"{y['year']}.",
                          status="open", detail={k: y[k] for k in ("expected_times", "recorded_times",
                                                                   "expected_quantity", "recorded_quantity", "unit")},
                          history=[_dev_entry(user, "open", "Detected from practice records.")])
            db.add(d)
            audit(db, user, "intervention_deviation.detect", d)
            created.append(d)
    return created


def detect_project(db: Session, user: CurrentUser, project_id: str) -> dict[str, Any]:
    project = get_owned(db, Project, project_id, user, "Project")
    created = []
    for p in _current_rows(db, user, project.id):
        created += detect_deviations(db, user, p)
    return {"project_id": str(project.id), "created": len(created), "deviations": [deviation_out(d) for d in created]}


def create_deviation(db: Session, user: CurrentUser, plan_row_id: str, body: DeviationIn) -> Deviation:
    plan = get_owned(db, InterventionPlan, plan_row_id, user, "Intervention plan")
    if plan.status in ("draft", "superseded"):
        raise IllegalTransition("Deviations are recorded against the plan the farmer agreed to.")
    cid = None
    if body.commitment_id:
        c = get_owned(db, Commitment, body.commitment_id, user, "Commitment")
        if c.plan_row_id != plan.id:
            raise ValidationFailed("That commitment belongs to a different plan.", code="COMMITMENT_NOT_IN_PLAN")
        cid = c.id
    d = Deviation(org_id=user.org_id, created_by=user.id, plan_id=plan.plan_id, plan_row_id=plan.id,
                  commitment_id=cid, year=body.year, source="manual", kind=body.kind, reason=body.reason,
                  corrective_action=body.corrective_action, status="open",
                  history=[_dev_entry(user, "open", "Reported by staff.")])
    db.add(d)
    audit(db, user, "intervention_deviation.create", d)
    return d


def list_deviations(db: Session, user: CurrentUser, plan: InterventionPlan) -> list[Deviation]:
    return list(db.scalars(scoped(Deviation, user).where(Deviation.plan_id == plan.plan_id)
                           .order_by(Deviation.created_at)).all())


def move_deviation(db: Session, user: CurrentUser, deviation_id: str, status: str, impact: str | None,
                   corrective_action: str | None, note: str) -> Deviation:
    d = get_owned(db, Deviation, deviation_id, user, "Deviation")
    allowed = {"open": {"acknowledged", "closed"}, "acknowledged": {"closed"}, "closed": set()}[d.status]
    if status not in allowed:
        raise IllegalTransition(f"A deviation that is {d.status} can't move to {status}.",
                                details={"from": d.status, "to": status, "allowed": sorted(allowed)})
    if status == "closed" and (impact or d.impact) == "unassessed":
        raise ValidationFailed("Assess the impact (none, minor or major) before closing.", code="IMPACT_REQUIRED")
    before = snapshot(d)
    d.status = status
    if impact:
        d.impact = impact
    if corrective_action is not None:
        d.corrective_action = corrective_action
    d.history = [*(d.history or []), _dev_entry(user, status, note)]
    audit(db, user, "intervention_deviation.status", d, before=before, reason=note or None)
    return d


def list_plans(db: Session, user: CurrentUser, *, project_id: str | None = None, field_id: str | None = None,
               farmer_id: str | None = None, status: str | None = None) -> list[InterventionPlan]:
    q = scoped(InterventionPlan, user).order_by(InterventionPlan.code, InterventionPlan.version)
    try:
        if project_id:
            q = q.where(InterventionPlan.project_id == uuid.UUID(project_id))
        if field_id:
            q = q.where(InterventionPlan.field_id == uuid.UUID(field_id))
        if farmer_id:
            q = q.where(InterventionPlan.farmer_id == uuid.UUID(farmer_id))
    except ValueError as exc:
        raise ValidationFailed("Invalid id filter.") from exc
    if status:
        q = q.where(InterventionPlan.status == status)
    return list(db.scalars(q).all())
