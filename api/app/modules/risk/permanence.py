"""Permanence: the non-permanence risk profile, monitoring obligations and remediation actions."""

from __future__ import annotations

import uuid
from collections import Counter
from datetime import date, timedelta
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, ensure_not_author
from app.core.db import utcnow
from app.core.errors import Blocked, IllegalTransition, ValidationFailed
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.identity.models import AuditEntry, User
from app.modules.methodology.models import Rule
from app.modules.programmes.models import Project
from app.modules.risk import npr
from app.modules.risk.models import MonitoringObligation, RemediationAction, RiskEvent, RiskProfile
from app.modules.risk.schemas import (
    ObligationDoneIn, ObligationIn, ObligationRulesIn, RemediationIn, RiskProfileIn, RiskProfilePatch,
)
from app.modules.sampling.models import Campaign, Sample

DUE_WINDOW_DAYS = 90
RULE_KEYS = {
    "soc_remeasurement": "soc_remeasurement_interval_years",
    "baseline_reassessment": "baseline_reassessment_interval_years",
    "data_retention": "data_retention_years_after_crediting",
}


def today() -> date:
    return date.today()


def add_years(d: date, years: int) -> date:
    try:
        return d.replace(year=d.year + years)
    except ValueError:  # 29 February
        return d.replace(year=d.year + years, day=28)


def _evidence(db: Session, user: CurrentUser, ids: list[str]) -> list[str]:
    from app.modules.evidence.models import EvidenceFile

    return [str(get_owned(db, EvidenceFile, i, user, "Evidence file").id) for i in ids]


def _user_id(db: Session, user: CurrentUser, value: str | None) -> uuid.UUID | None:
    if not value:
        return None
    u = get_owned(db, User, value, user, "User")
    if not u.is_active:
        raise ValidationFailed("That user is not active.")
    return u.id


# ------------------------------------------------------------------ risk profile (NPR)
def profile_out(p: RiskProfile) -> dict[str, Any]:
    return {"id": str(p.id), "project_id": str(p.project_id), "version": p.version, "tool_version": p.tool_version,
            "inputs": p.inputs, "computed": p.computed, "computed_rating_pct": p.computed_rating_pct,
            "final_npr_pct": p.final_npr_pct, "justification": p.justification, "status": p.status,
            "submitted_by": str(p.submitted_by) if p.submitted_by else None,
            "approved_by": str(p.approved_by) if p.approved_by else None,
            "approved_at": p.approved_at.isoformat() if p.approved_at else None, "notes": p.notes,
            "created_by": str(p.created_by) if p.created_by else None, "created_at": p.created_at.isoformat()}


def _computed(inputs: dict) -> dict:
    errors = npr.validate(inputs)
    if errors:
        raise ValidationFailed(" ".join(errors), code="INVALID_NPR_INPUTS", details={"errors": errors})
    return npr.compute(inputs)


def create_profile(db: Session, user: CurrentUser, project_id: str, body: RiskProfileIn) -> RiskProfile:
    project = get_owned(db, Project, project_id, user, "Project")
    computed = _computed(body.inputs)
    version = (db.scalar(select(func.max(RiskProfile.version)).where(
        RiskProfile.org_id == user.org_id, RiskProfile.project_id == project.id)) or 0) + 1
    p = RiskProfile(org_id=user.org_id, created_by=user.id, project_id=project.id, version=version,
                    tool_version=npr.TOOL_VERSION, inputs=body.inputs, computed=computed,
                    computed_rating_pct=computed["advisory_rating_pct"], status="draft", notes=body.notes)
    db.add(p)
    audit(db, user, "risk_profile.create", p)
    return p


def update_profile(db: Session, user: CurrentUser, profile_id: str, body: RiskProfilePatch) -> RiskProfile:
    p = get_owned(db, RiskProfile, profile_id, user, "Risk profile")
    if p.status != "draft":
        raise IllegalTransition("Only a draft risk profile can be changed. Create a new version instead.",
                                code="PROFILE_FROZEN")
    before = snapshot(p)
    if body.inputs is not None:
        p.computed = _computed(body.inputs)
        p.inputs, p.computed_rating_pct = body.inputs, p.computed["advisory_rating_pct"]
    if body.notes is not None:
        p.notes = body.notes
    p.updated_at = utcnow()
    audit(db, user, "risk_profile.update", p, before=before)
    return p


def submit_profile(db: Session, user: CurrentUser, profile_id: str) -> RiskProfile:
    p = get_owned(db, RiskProfile, profile_id, user, "Risk profile")
    if p.status != "draft":
        raise IllegalTransition(f"Only a draft risk profile can be submitted; this one is {p.status}.")
    before = snapshot(p)
    p.status, p.submitted_by, p.submitted_at = "submitted", user.id, utcnow()
    audit(db, user, "risk_profile.submit", p, before=before)
    return p


def approve_profile(db: Session, user: CurrentUser, profile_id: str, final: float, justification: str) -> RiskProfile:
    p = get_owned(db, RiskProfile, profile_id, user, "Risk profile")
    if p.status != "submitted":
        raise IllegalTransition(f"Only a submitted risk profile can be approved; this one is {p.status}.")
    editors = db.scalars(select(AuditEntry.created_by).where(
        AuditEntry.org_id == user.org_id, AuditEntry.entity_id == str(p.id),
        AuditEntry.action == "risk_profile.update")).all()
    ensure_not_author(user.id, p.created_by, p.submitted_by, *editors, what="a risk profile")
    if p.computed.get("fails") or final > npr.FAIL_ABOVE:
        raise Blocked(f"A non-permanence risk rating above {npr.FAIL_ABOVE:g} fails the analysis; the project "
                      "can't be credited on this profile.", code="NPR_FAILS")
    if final < npr.MIN_RATING:
        raise ValidationFailed(f"The NPR can't be below the tool minimum of {npr.MIN_RATING:g}%.",
                               code="NPR_BELOW_MINIMUM")
    if abs(final - (p.computed_rating_pct or 0)) > 1e-6 and len(justification.strip()) < 10:
        raise ValidationFailed("Explain why the final NPR differs from the worksheet result.",
                               code="JUSTIFICATION_REQUIRED")
    for prev in db.scalars(scoped(RiskProfile, user).where(RiskProfile.project_id == p.project_id,
                                                           RiskProfile.status == "approved")).all():
        pb = snapshot(prev)
        prev.status = "superseded"
        audit(db, user, "risk_profile.supersede", prev, before=pb, reason=f"Replaced by version {p.version}")
    before = snapshot(p)
    p.status, p.final_npr_pct, p.justification = "approved", final, justification
    p.approved_by, p.approved_at = user.id, utcnow()
    audit(db, user, "risk_profile.approve", p, before=before)
    return p


def list_profiles(db: Session, user: CurrentUser, project_id: str) -> list[RiskProfile]:
    project = get_owned(db, Project, project_id, user, "Project")
    return list(db.scalars(scoped(RiskProfile, user).where(RiskProfile.project_id == project.id)
                           .order_by(RiskProfile.version.desc())).all())


# ------------------------------------------------------------------ monitoring obligations
def obligation_status(o: MonitoringObligation, on: date | None = None) -> str:
    if o.status in ("done", "cancelled"):
        return o.status
    on = on or today()
    if o.due_on < on:
        return "overdue"
    if o.due_on <= on + timedelta(days=DUE_WINDOW_DAYS):
        return "due"
    return "upcoming"


def obligation_out(o: MonitoringObligation) -> dict[str, Any]:
    return {"id": str(o.id), "project_id": str(o.project_id), "kind": o.kind, "title": o.title,
            "due_on": o.due_on.isoformat(), "status": obligation_status(o), "basis": o.basis, "rule_ref": o.rule_ref,
            "anchor_date": o.anchor_date.isoformat() if o.anchor_date else None, "generated": o.generated,
            "responsible_user_id": str(o.responsible_user_id) if o.responsible_user_id else None,
            "done_on": o.done_on.isoformat() if o.done_on else None, "evidence_ids": o.evidence_ids or [],
            "notes": o.notes}


def _rule_values(db: Session, project: Project) -> dict[str, dict[str, Any]]:
    if not project.rule_pack_id:
        return {}
    rows = db.scalars(select(Rule).where(Rule.pack_id == project.rule_pack_id,
                                         Rule.key.in_(list(RULE_KEYS.values())))).all()
    return {r.key: {"value": (r.value or {}).get("value"), "source": " ".join(
        x for x in (r.source_document, r.source_section, r.source_page and f"p.{r.source_page}") if x)} for r in rows}


def _latest_measurement(db: Session, project: Project) -> tuple[date | None, str]:
    camps = db.scalars(select(Campaign).where(Campaign.project_id == project.id)
                       .order_by(Campaign.planned_end.desc())).all()
    for c in camps:
        last = db.scalar(select(func.max(Sample.collected_at)).where(Sample.campaign_id == c.id))
        if last is not None:
            return last.date(), f"last sample collected in campaign {c.code}"
    if camps:
        return camps[0].planned_end, f"planned end of campaign {camps[0].code} (no samples collected yet)"
    return None, ""


def generate_obligations(db: Session, user: CurrentUser, project_id: str, body: ObligationRulesIn) -> dict[str, Any]:
    """Work out due dates from the rule pack (or values given with their source). Nothing is assumed:
    an obligation whose rule or anchor date is missing is reported as skipped."""
    project = get_owned(db, Project, project_id, user, "Project")
    from_pack = _rule_values(db, project)
    given = body.model_dump()
    created, updated, skipped = [], [], []
    for kind, key in RULE_KEYS.items():
        if given.get(key) is not None:
            if not body.source.strip():
                raise ValidationFailed("Say where the values you entered come from (source).", code="SOURCE_REQUIRED")
            years, source = int(given[key]), body.source.strip()
        elif from_pack.get(key) is not None and isinstance(from_pack[key]["value"], (int, float)):
            years, source = int(from_pack[key]["value"]), from_pack[key]["source"]
        else:
            skipped.append({"kind": kind, "code": "RULE_MISSING",
                            "reason": f"No value for '{key}' in the project's rule pack."})
            continue
        if kind == "soc_remeasurement":
            anchor, what = _latest_measurement(db, project)
            title = "SOC re-measurement due"
        elif kind == "baseline_reassessment":
            anchor = project.baseline_start or project.crediting_start
            what = "baseline start" if project.baseline_start else "crediting start"
            title = "Baseline reassessment due"
        else:
            anchor, what, title = project.crediting_end, "end of the crediting period", "Keep project data until"
        if anchor is None:
            skipped.append({"kind": kind, "code": "ANCHOR_MISSING",
                            "reason": "The date to count from is not recorded for this project."})
            continue
        done = db.scalar(select(func.max(MonitoringObligation.done_on)).where(
            MonitoringObligation.project_id == project.id, MonitoringObligation.kind == kind,
            MonitoringObligation.status == "done"))
        if kind != "data_retention" and done and done > anchor:
            anchor, what = done, "last completed obligation"
        due = add_years(anchor, years)
        basis = f"{years} year(s) after the {what} ({anchor.isoformat()})."
        ref = {"key": key, "value": years, "source": source}
        cur = db.scalars(scoped(MonitoringObligation, user).where(
            MonitoringObligation.project_id == project.id, MonitoringObligation.kind == kind,
            MonitoringObligation.generated.is_(True), MonitoringObligation.status == "open")).first()
        if cur is None:
            o = MonitoringObligation(org_id=user.org_id, created_by=user.id, project_id=project.id, kind=kind,
                                     title=title, due_on=due, basis=basis, rule_ref=ref, anchor_date=anchor,
                                     generated=True, status="open")
            db.add(o)
            audit(db, user, "monitoring_obligation.create", o)
            created.append(o)
        elif cur.due_on != due or cur.rule_ref != ref:
            before = snapshot(cur)
            cur.due_on, cur.basis, cur.rule_ref, cur.anchor_date = due, basis, ref, anchor
            audit(db, user, "monitoring_obligation.update", cur, before=before)
            updated.append(cur)
    return {"created": [obligation_out(o) for o in created], "updated": [obligation_out(o) for o in updated],
            "skipped": skipped}


def create_obligation(db: Session, user: CurrentUser, body: ObligationIn) -> MonitoringObligation:
    project = get_owned(db, Project, body.project_id, user, "Project")
    o = MonitoringObligation(org_id=user.org_id, created_by=user.id, project_id=project.id, kind=body.kind,
                             title=body.title, due_on=body.due_on, basis=body.basis,
                             responsible_user_id=_user_id(db, user, body.responsible_user_id), generated=False,
                             status="open", notes=body.notes)
    db.add(o)
    audit(db, user, "monitoring_obligation.create", o)
    return o


def close_obligation(db: Session, user: CurrentUser, obligation_id: str, to: str, body: ObligationDoneIn) -> MonitoringObligation:
    o = get_owned(db, MonitoringObligation, obligation_id, user, "Obligation")
    if o.status != "open":
        raise IllegalTransition(f"This obligation is already {o.status}.")
    if to == "cancelled" and not body.note.strip():
        raise ValidationFailed("Say why the obligation no longer applies.", code="NOTE_REQUIRED")
    if to == "done" and o.kind != "data_retention" and not body.evidence_ids:
        raise ValidationFailed("Attach the evidence that the obligation was met.", code="EVIDENCE_REQUIRED")
    before = snapshot(o)
    o.status = to
    if to == "done":
        o.done_on = body.done_on or today()
        if o.done_on > today():
            raise ValidationFailed("The completion date can't be in the future.")
        o.evidence_ids = _evidence(db, user, body.evidence_ids)
    if body.note:
        o.notes = (o.notes + "\n" if o.notes else "") + body.note
    audit(db, user, f"monitoring_obligation.{to}", o, before=before, reason=body.note or None)
    return o


def list_obligations(db: Session, user: CurrentUser, project_id: str, status: str | None) -> list[MonitoringObligation]:
    project = get_owned(db, Project, project_id, user, "Project")
    rows = db.scalars(scoped(MonitoringObligation, user).where(MonitoringObligation.project_id == project.id)
                      .order_by(MonitoringObligation.due_on)).all()
    return [o for o in rows if obligation_status(o) == status] if status else list(rows)


# ------------------------------------------------------------------ remediation actions
REMEDIATION_FLOW = {"open": {"in_progress", "done", "cancelled"}, "in_progress": {"done", "cancelled", "open"},
                    "done": set(), "cancelled": set()}


def remediation_out(a: RemediationAction) -> dict[str, Any]:
    overdue = a.status in ("open", "in_progress") and a.due_on < today()
    return {"id": str(a.id), "risk_event_id": str(a.risk_event_id), "title": a.title, "description": a.description,
            "owner_user_id": str(a.owner_user_id) if a.owner_user_id else None, "due_on": a.due_on.isoformat(),
            "status": a.status, "overdue": overdue, "completed_on": a.completed_on.isoformat() if a.completed_on else None,
            "evidence_ids": a.evidence_ids or [], "history": a.history or [], "created_at": a.created_at.isoformat()}


def create_remediation(db: Session, user: CurrentUser, risk_id: str, body: RemediationIn) -> RemediationAction:
    r = get_owned(db, RiskEvent, risk_id, user, "Risk event")
    if r.status == "resolved":
        raise IllegalTransition("This risk event is resolved. Record a new event instead.")
    a = RemediationAction(org_id=user.org_id, created_by=user.id, risk_event_id=r.id, title=body.title,
                          description=body.description, owner_user_id=_user_id(db, user, body.owner_user_id),
                          due_on=body.due_on, status="open",
                          history=[{"at": utcnow().isoformat(), "by": str(user.id), "status": "open", "note": ""}])
    db.add(a)
    audit(db, user, "remediation_action.create", a)
    return a


def move_remediation(db: Session, user: CurrentUser, action_id: str, status: str, note: str,
                     evidence_ids: list[str]) -> RemediationAction:
    a = get_owned(db, RemediationAction, action_id, user, "Remediation action")
    allowed = REMEDIATION_FLOW[a.status]
    if status not in allowed:
        raise IllegalTransition(f"An action that is {a.status.replace('_', ' ')} can't move to "
                                f"{status.replace('_', ' ')}.", details={"from": a.status, "to": status,
                                                                         "allowed": sorted(allowed)})
    if status == "cancelled" and not note.strip():
        raise ValidationFailed("Say why the action is cancelled.", code="NOTE_REQUIRED")
    before = snapshot(a)
    a.status = status
    if evidence_ids:
        a.evidence_ids = [*(a.evidence_ids or []), *_evidence(db, user, evidence_ids)]
    if status == "done":
        a.completed_on = today()
    a.history = [*(a.history or []), {"at": utcnow().isoformat(), "by": str(user.id), "status": status, "note": note}]
    audit(db, user, "remediation_action.status", a, before=before, reason=note or None)
    return a


def open_remediations(db: Session, risk_event_id: uuid.UUID) -> int:
    return db.scalar(select(func.count()).select_from(RemediationAction).where(
        RemediationAction.risk_event_id == risk_event_id,
        RemediationAction.status.in_(("open", "in_progress")))) or 0


def list_remediations(db: Session, user: CurrentUser, risk_id: str) -> list[RemediationAction]:
    r = get_owned(db, RiskEvent, risk_id, user, "Risk event")
    return list(db.scalars(scoped(RemediationAction, user).where(RemediationAction.risk_event_id == r.id)
                           .order_by(RemediationAction.due_on)).all())


# ------------------------------------------------------------------ summary
def permanence_summary(db: Session, user: CurrentUser, project_id: str) -> dict[str, Any]:
    project = get_owned(db, Project, project_id, user, "Project")
    profiles = list_profiles(db, user, project_id)
    approved = next((p for p in profiles if p.status == "approved"), None)
    obligations = list_obligations(db, user, project_id, None)
    events = db.scalars(scoped(RiskEvent, user).where(RiskEvent.project_id == project.id)).all()
    actions = db.scalars(scoped(RemediationAction, user).where(
        RemediationAction.risk_event_id.in_([e.id for e in events] or [uuid.uuid4()]))).all()
    acts = [remediation_out(a) for a in actions]
    ob_counts = Counter(obligation_status(o) for o in obligations)
    nxt = next((o for o in obligations if o.status == "open"), None)
    return {
        "project_id": str(project.id),
        "npr": {"approved_pct": approved.final_npr_pct if approved else None,
                "version": approved.version if approved else None,
                "pending_review": sum(1 for p in profiles if p.status == "submitted"),
                "message": None if approved else "No approved non-permanence risk rating yet."},
        "obligations": {"by_status": dict(ob_counts), "next": obligation_out(nxt) if nxt else None},
        "risk_events": {"open": sum(1 for e in events if e.status != "resolved"), "total": len(events)},
        "remediation": {"open": sum(1 for a in acts if a["status"] in ("open", "in_progress")),
                        "overdue": sum(1 for a in acts if a["overdue"])},
    }

