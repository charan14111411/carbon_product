"""Reversal risk events and the farmer grievance process."""

from __future__ import annotations

import uuid
from collections import defaultdict
from datetime import UTC, date, datetime, timedelta
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.db import utcnow
from app.core.errors import Forbidden, IllegalTransition, NotFound, ValidationFailed
from app.core.permissions import P
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.calculation.models import CalculationRun, RunStatusEvent
from app.modules.evidence.models import EvidenceFile
from app.modules.farmers.models import Farmer
from app.modules.identity.models import User
from app.modules.land.models import Enrolment, Field
from app.modules.programmes.models import Project
from app.modules.risk.models import Grievance, RiskEvent
from app.modules.risk.schemas import GrievanceIn, RiskEventIn, RiskEventPatch

RISK_FLOW = {"open": "assessing", "assessing": "action", "action": "resolved"}
GRIEVANCE_FLOW = {
    "open": {"in_progress"},
    "in_progress": {"resolved"},
    "resolved": {"closed", "appealed"},
    "appealed": {"in_progress"},
    "closed": set(),
}
DUE_DAYS = {"high": 3, "normal": 7, "low": 14}


def today() -> date:
    return datetime.now(UTC).date()


# ------------------------------------------------------------------ risk events
def _evidence(db: Session, user: CurrentUser, ids: list[str]) -> list[str]:
    return [str(get_owned(db, EvidenceFile, i, user, "Evidence file").id) for i in ids]


def risk_out(r: RiskEvent) -> dict[str, Any]:
    return {"id": str(r.id), "project_id": str(r.project_id), "field_id": str(r.field_id) if r.field_id else None,
            "kind": r.kind, "occurred_on": r.occurred_on.isoformat(), "description": r.description,
            "severity": r.severity, "estimated_impact_t": r.estimated_impact_t, "status": r.status,
            "resolution": r.resolution, "evidence_ids": r.evidence_ids or [], "created_at": r.created_at.isoformat(),
            "updated_at": r.updated_at.isoformat()}


def create_risk(db: Session, user: CurrentUser, body: RiskEventIn) -> RiskEvent:
    project = get_owned(db, Project, body.project_id, user, "Project")
    field_id = None
    if body.field_id:
        fld = get_owned(db, Field, body.field_id, user, "Field")
        if not db.scalar(select(Enrolment).where(Enrolment.project_id == project.id, Enrolment.field_id == fld.id)):
            raise ValidationFailed("This field is not part of the project.", code="FIELD_NOT_IN_PROJECT")
        field_id = fld.id
    if body.occurred_on > today():
        raise ValidationFailed("A risk event can't be dated in the future.")
    r = RiskEvent(org_id=user.org_id, created_by=user.id, project_id=project.id, field_id=field_id, kind=body.kind,
                  occurred_on=body.occurred_on, description=body.description, severity=body.severity,
                  estimated_impact_t=body.estimated_impact_t, status="open",
                  evidence_ids=_evidence(db, user, body.evidence_ids))
    db.add(r)
    audit(db, user, "risk_event.create", r)
    return r


def update_risk(db: Session, user: CurrentUser, risk_id: str, body: RiskEventPatch) -> RiskEvent:
    r = get_owned(db, RiskEvent, risk_id, user, "Risk event")
    if r.status == "resolved":
        raise IllegalTransition("A resolved risk event can't be edited. Record a new event instead.")
    before = snapshot(r)
    data = body.model_dump(exclude_unset=True)
    if "evidence_ids" in data and data["evidence_ids"] is not None:
        r.evidence_ids = _evidence(db, user, data.pop("evidence_ids"))
    for k, v in data.items():
        if v is not None or k == "estimated_impact_t":
            setattr(r, k, v)
    audit(db, user, "risk_event.update", r, before=before)
    return r


def move_risk(db: Session, user: CurrentUser, risk_id: str, status: str, note: str, resolution: str | None) -> RiskEvent:
    r = get_owned(db, RiskEvent, risk_id, user, "Risk event")
    if RISK_FLOW.get(r.status) != status:
        nxt = RISK_FLOW.get(r.status)
        raise IllegalTransition(
            f"A risk event that is {r.status} can't move to {status}."
            + (f" The next step is {nxt}." if nxt else " It is already resolved."),
            details={"from": r.status, "to": status, "allowed": [nxt] if nxt else []})
    if status == "resolved" and not (resolution or "").strip():
        raise ValidationFailed("Describe how the risk was resolved.", code="RESOLUTION_REQUIRED")
    before = snapshot(r)
    r.status = status
    if resolution:
        r.resolution = resolution
    audit(db, user, "risk_event.status", r, before=before, reason=note or None)
    return r


def list_risks(db: Session, user: CurrentUser, project_id: str | None, status: str | None,
               kind: str | None) -> list[RiskEvent]:
    q = scoped(RiskEvent, user).order_by(RiskEvent.occurred_on.desc())
    if project_id:
        q = q.where(RiskEvent.project_id == get_owned(db, Project, project_id, user, "Project").id)
    if status:
        q = q.where(RiskEvent.status == status)
    if kind:
        q = q.where(RiskEvent.kind == kind)
    return list(db.scalars(q).all())


def _run_status(db: Session, run_id: uuid.UUID) -> str | None:
    ev = db.scalars(select(RunStatusEvent).where(RunStatusEvent.run_id == run_id)
                    .order_by(RunStatusEvent.created_at.desc())).first()
    return ev.status if ev else None


def risk_summary(db: Session, user: CurrentUser, project_id: str) -> dict[str, Any]:
    project = get_owned(db, Project, project_id, user, "Project")
    events = db.scalars(scoped(RiskEvent, user).where(RiskEvent.project_id == project.id)).all()
    open_ = [e for e in events if e.status != "resolved"]
    by_kind: dict[str, int] = defaultdict(int)
    by_sev: dict[str, int] = defaultdict(int)
    for e in open_:
        by_kind[e.kind] += 1
        by_sev[e.severity] += 1
    impact = round(sum(e.estimated_impact_t or 0 for e in open_), 6)
    unestimated = sum(1 for e in open_ if e.estimated_impact_t is None)
    runs = db.scalars(select(CalculationRun).where(CalculationRun.org_id == user.org_id,
                                                   CalculationRun.project_id == project.id)).all()
    approved = [r for r in runs if _run_status(db, r.id) == "approved"]
    buffer = round(sum(r.buffer_t_co2e or 0 for r in approved), 6)
    ratio = round(impact / buffer, 4) if buffer > 0 else None
    if impact == 0:
        message = "No estimated reversal impact from open risk events."
    elif buffer <= 0:
        message = "Open risks have an estimated impact but there is no buffer from approved results yet."
    elif impact > buffer:
        message = "Estimated impact of open risks is larger than the buffer. Review urgently."
    else:
        message = f"Open risks would use {ratio:.0%} of the buffer if they all reversed."
    return {
        "project_id": str(project.id), "open": len(open_), "resolved": len(events) - len(open_),
        "open_by_kind": dict(by_kind), "open_by_severity": dict(by_sev),
        "estimated_impact_t": impact, "events_without_estimate": unestimated,
        "buffer_t_co2e": buffer, "approved_runs": len(approved), "impact_to_buffer_ratio": ratio,
        "buffer_sufficient": impact <= buffer, "message": message,
    }


# ------------------------------------------------------------------ grievances
def _is_staff(user: CurrentUser) -> bool:
    return user.can(P.HANDLE_GRIEVANCE) or user.can(P.MANAGE_RISK)


def _own_farmer_id(user: CurrentUser) -> uuid.UUID:
    fid = (user.scope or {}).get("farmer_id")
    try:
        return uuid.UUID(str(fid))
    except (TypeError, ValueError) as exc:
        raise Forbidden("Your account is not linked to a farmer record.") from exc


def _entry(user: CurrentUser, status: str, note: str, **extra: Any) -> dict[str, Any]:
    return {"at": utcnow().isoformat(), "by": str(user.id), "by_name": user.full_name, "status": status,
            "note": note, **extra}


def grievance_out(g: Grievance) -> dict[str, Any]:
    overdue = g.status not in ("resolved", "closed") and g.due_on < today()
    return {"id": str(g.id), "code": g.code, "farmer_id": str(g.farmer_id) if g.farmer_id else None,
            "category": g.category, "subject": g.subject, "description": g.description, "channel": g.channel,
            "priority": g.priority, "status": g.status,
            "assigned_to": str(g.assigned_to) if g.assigned_to else None, "due_on": g.due_on.isoformat(),
            "overdue": overdue, "resolution": g.resolution,
            "resolved_at": g.resolved_at.isoformat() if g.resolved_at else None, "history": g.history or [],
            "created_at": g.created_at.isoformat()}


def create_grievance(db: Session, user: CurrentUser, body: GrievanceIn) -> Grievance:
    if _is_staff(user):
        farmer_id = get_owned(db, Farmer, body.farmer_id, user, "Farmer").id if body.farmer_id else None
    else:
        farmer_id = _own_farmer_id(user)
        if body.farmer_id and uuid.UUID(body.farmer_id) != farmer_id:
            raise NotFound("Farmer not found.")
        get_owned(db, Farmer, farmer_id, user, "Farmer")
    n = db.scalar(select(func.count()).select_from(Grievance).where(Grievance.org_id == user.org_id)) or 0
    g = Grievance(
        org_id=user.org_id, created_by=user.id, code=f"G-{n + 1:05d}", farmer_id=farmer_id, category=body.category,
        subject=body.subject, description=body.description, channel=body.channel, priority=body.priority,
        status="open", due_on=today() + timedelta(days=DUE_DAYS[body.priority]),
        history=[_entry(user, "open", "Grievance received.")],
    )
    db.add(g)
    audit(db, user, "grievance.create", g)
    return g


def get_grievance(db: Session, user: CurrentUser, grievance_id: str) -> Grievance:
    g = get_owned(db, Grievance, grievance_id, user, "Grievance")
    if not _is_staff(user) and g.farmer_id != _own_farmer_id(user):
        raise NotFound("Grievance not found.")
    return g


def list_grievances(db: Session, user: CurrentUser, *, status: str | None = None, category: str | None = None,
                    priority: str | None = None, farmer_id: str | None = None, assigned_to: str | None = None,
                    overdue: bool | None = None) -> list[Grievance]:
    q = scoped(Grievance, user).order_by(Grievance.due_on, Grievance.code)
    if not _is_staff(user):
        q = q.where(Grievance.farmer_id == _own_farmer_id(user))
    try:
        if farmer_id:
            q = q.where(Grievance.farmer_id == uuid.UUID(farmer_id))
        if assigned_to:
            q = q.where(Grievance.assigned_to == uuid.UUID(assigned_to))
    except ValueError as exc:
        raise ValidationFailed("Invalid id filter.") from exc
    if status:
        q = q.where(Grievance.status == status)
    if category:
        q = q.where(Grievance.category == category)
    if priority:
        q = q.where(Grievance.priority == priority)
    rows = list(db.scalars(q).all())
    if overdue is not None:
        rows = [g for g in rows if grievance_out(g)["overdue"] == overdue]
    return rows


def assign_grievance(db: Session, user: CurrentUser, grievance_id: str, assignee_id: str, note: str) -> Grievance:
    g = get_owned(db, Grievance, grievance_id, user, "Grievance")
    if g.status == "closed":
        raise IllegalTransition("A closed grievance can't be reassigned.")
    assignee = get_owned(db, User, assignee_id, user, "User")
    if not assignee.is_active:
        raise ValidationFailed("That user is not active.")
    before = snapshot(g)
    g.assigned_to = assignee.id
    g.history = [*(g.history or []), _entry(user, g.status, note or f"Assigned to {assignee.full_name}.",
                                            assigned_to=str(assignee.id))]
    audit(db, user, "grievance.assign", g, before=before)
    return g


def move_grievance(db: Session, user: CurrentUser, grievance_id: str, status: str, note: str,
                   resolution: str | None) -> Grievance:
    g = get_owned(db, Grievance, grievance_id, user, "Grievance")
    allowed = GRIEVANCE_FLOW.get(g.status, set())
    if status not in allowed:
        raise IllegalTransition(f"A grievance that is {g.status.replace('_', ' ')} can't move to "
                                f"{status.replace('_', ' ')}.",
                                details={"from": g.status, "to": status, "allowed": sorted(allowed)})
    if status == "resolved" and not (resolution or "").strip():
        raise ValidationFailed("Explain the resolution so the farmer can understand it.", code="RESOLUTION_REQUIRED")
    if status == "appealed" and not note.strip():
        raise ValidationFailed("Record why the resolution is being appealed.", code="NOTE_REQUIRED")
    before = snapshot(g)
    g.status = status
    if status == "resolved":
        g.resolution, g.resolved_at = resolution, utcnow()
    g.history = [*(g.history or []), _entry(user, status, note or (resolution or ""))]
    audit(db, user, "grievance.status", g, before=before, reason=note or None)
    return g
