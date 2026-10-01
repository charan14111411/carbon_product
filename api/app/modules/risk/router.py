from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.risk import permanence, service
from app.modules.risk.models import RiskEvent, RiskProfile
from app.modules.risk.schemas import (
    AssignIn, GrievanceIn, GrievanceStatusIn, ObligationDoneIn, ObligationIn, ObligationRulesIn, RemediationIn,
    RemediationStatusIn, RiskEventIn, RiskEventPatch, RiskProfileApproveIn, RiskProfileIn, RiskProfilePatch,
    RiskStatusIn,
)

router = APIRouter(tags=["Risk & grievances"])
_risk_write = require(P.MANAGE_RISK)
_risk_read = require(P.READ, P.MANAGE_RISK)
_grv_staff = require(P.HANDLE_GRIEVANCE)
_grv_any = require(P.HANDLE_GRIEVANCE, P.MANAGE_RISK, P.FARMER_SELF)
_npr_approve = require(P.APPROVE_RULES)


# ------------------------------------------------------------------ risk events
@router.get("/risk-events")
def list_risks(project_id: str | None = None, status: str | None = None, kind: str | None = None,
               user: CurrentUser = Depends(_risk_read), db: Session = Depends(get_db)):
    return [service.risk_out(r) for r in service.list_risks(db, user, project_id, status, kind)]


@router.post("/risk-events", status_code=201)
def create_risk(body: RiskEventIn, user: CurrentUser = Depends(_risk_write), db: Session = Depends(get_db)):
    return service.risk_out(service.create_risk(db, user, body))


@router.get("/risk-events/{risk_id}")
def get_risk(risk_id: str, user: CurrentUser = Depends(_risk_read), db: Session = Depends(get_db)):
    return service.risk_out(get_owned(db, RiskEvent, risk_id, user, "Risk event"))


@router.patch("/risk-events/{risk_id}")
def update_risk(risk_id: str, body: RiskEventPatch, user: CurrentUser = Depends(_risk_write),
                db: Session = Depends(get_db)):
    return service.risk_out(service.update_risk(db, user, risk_id, body))


@router.post("/risk-events/{risk_id}/status")
def move_risk(risk_id: str, body: RiskStatusIn, user: CurrentUser = Depends(_risk_write),
              db: Session = Depends(get_db)):
    return service.risk_out(service.move_risk(db, user, risk_id, body.status, body.note, body.resolution))


@router.get("/projects/{project_id}/risk/summary")
def risk_summary(project_id: str, user: CurrentUser = Depends(_risk_read), db: Session = Depends(get_db)):
    return service.risk_summary(db, user, project_id)


# ------------------------------------------------------------------ grievances
@router.post("/grievances", status_code=201)
def create_grievance(body: GrievanceIn, user: CurrentUser = Depends(_grv_any), db: Session = Depends(get_db)):
    return service.grievance_out(service.create_grievance(db, user, body))


@router.get("/grievances")
def list_grievances(status: str | None = None, category: str | None = None, priority: str | None = None,
                    farmer_id: str | None = None, assigned_to: str | None = None, overdue: bool | None = None,
                    user: CurrentUser = Depends(_grv_any), db: Session = Depends(get_db)):
    rows = service.list_grievances(db, user, status=status, category=category, priority=priority,
                                   farmer_id=farmer_id, assigned_to=assigned_to, overdue=overdue)
    return [service.grievance_out(g) for g in rows]


@router.get("/grievances/{grievance_id}")
def get_grievance(grievance_id: str, user: CurrentUser = Depends(_grv_any), db: Session = Depends(get_db)):
    return service.grievance_out(service.get_grievance(db, user, grievance_id))


@router.post("/grievances/{grievance_id}/assign")
def assign(grievance_id: str, body: AssignIn, user: CurrentUser = Depends(_grv_staff), db: Session = Depends(get_db)):
    return service.grievance_out(service.assign_grievance(db, user, grievance_id, body.user_id, body.note))


@router.post("/grievances/{grievance_id}/status")
def move_grievance(grievance_id: str, body: GrievanceStatusIn, user: CurrentUser = Depends(_grv_staff),
                   db: Session = Depends(get_db)):
    return service.grievance_out(
        service.move_grievance(db, user, grievance_id, body.status, body.note, body.resolution))


# ------------------------------------------------------------------ permanence: NPR profile

@router.get("/projects/{project_id}/risk-profiles")
def list_profiles(project_id: str, user: CurrentUser = Depends(_risk_read), db: Session = Depends(get_db)):
    return [permanence.profile_out(p) for p in permanence.list_profiles(db, user, project_id)]


@router.post("/projects/{project_id}/risk-profiles", status_code=201)
def create_profile(project_id: str, body: RiskProfileIn, user: CurrentUser = Depends(_risk_write),
                   db: Session = Depends(get_db)):
    return permanence.profile_out(permanence.create_profile(db, user, project_id, body))


@router.get("/risk-profiles/{profile_id}")
def get_profile(profile_id: str, user: CurrentUser = Depends(require(P.READ, P.MANAGE_RISK, P.APPROVE_RULES)),
                db: Session = Depends(get_db)):
    return permanence.profile_out(get_owned(db, RiskProfile, profile_id, user, "Risk profile"))


@router.patch("/risk-profiles/{profile_id}")
def update_profile(profile_id: str, body: RiskProfilePatch, user: CurrentUser = Depends(_risk_write),
                   db: Session = Depends(get_db)):
    return permanence.profile_out(permanence.update_profile(db, user, profile_id, body))


@router.post("/risk-profiles/{profile_id}/submit")
def submit_profile(profile_id: str, user: CurrentUser = Depends(_risk_write), db: Session = Depends(get_db)):
    return permanence.profile_out(permanence.submit_profile(db, user, profile_id))


@router.post("/risk-profiles/{profile_id}/approve")
def approve_profile(profile_id: str, body: RiskProfileApproveIn, user: CurrentUser = Depends(_npr_approve),
                    db: Session = Depends(get_db)):
    return permanence.profile_out(permanence.approve_profile(db, user, profile_id, body.final_npr_pct,
                                                             body.justification))


# ------------------------------------------------------------------ permanence: monitoring obligations
@router.get("/projects/{project_id}/monitoring-obligations")
def list_obligations(project_id: str, status: str | None = None, user: CurrentUser = Depends(_risk_read),
                     db: Session = Depends(get_db)):
    return [permanence.obligation_out(o) for o in permanence.list_obligations(db, user, project_id, status)]


@router.post("/projects/{project_id}/monitoring-obligations/generate")
def generate_obligations(project_id: str, body: ObligationRulesIn, user: CurrentUser = Depends(_risk_write),
                         db: Session = Depends(get_db)):
    return permanence.generate_obligations(db, user, project_id, body)


@router.post("/monitoring-obligations", status_code=201)
def create_obligation(body: ObligationIn, user: CurrentUser = Depends(_risk_write), db: Session = Depends(get_db)):
    return permanence.obligation_out(permanence.create_obligation(db, user, body))


@router.post("/monitoring-obligations/{obligation_id}/complete")
def complete_obligation(obligation_id: str, body: ObligationDoneIn, user: CurrentUser = Depends(_risk_write),
                        db: Session = Depends(get_db)):
    return permanence.obligation_out(permanence.close_obligation(db, user, obligation_id, "done", body))


@router.post("/monitoring-obligations/{obligation_id}/cancel")
def cancel_obligation(obligation_id: str, body: ObligationDoneIn, user: CurrentUser = Depends(_risk_write),
                      db: Session = Depends(get_db)):
    return permanence.obligation_out(permanence.close_obligation(db, user, obligation_id, "cancelled", body))


# ------------------------------------------------------------------ permanence: remediation
@router.get("/risk-events/{risk_id}/remediation-actions")
def list_remediations(risk_id: str, user: CurrentUser = Depends(_risk_read), db: Session = Depends(get_db)):
    return [permanence.remediation_out(a) for a in permanence.list_remediations(db, user, risk_id)]


@router.post("/risk-events/{risk_id}/remediation-actions", status_code=201)
def create_remediation(risk_id: str, body: RemediationIn, user: CurrentUser = Depends(_risk_write),
                       db: Session = Depends(get_db)):
    return permanence.remediation_out(permanence.create_remediation(db, user, risk_id, body))


@router.post("/remediation-actions/{action_id}/status")
def move_remediation(action_id: str, body: RemediationStatusIn, user: CurrentUser = Depends(_risk_write),
                     db: Session = Depends(get_db)):
    return permanence.remediation_out(permanence.move_remediation(db, user, action_id, body.status, body.note,
                                                                  body.evidence_ids))


@router.get("/projects/{project_id}/risk/permanence")
def permanence_summary(project_id: str, user: CurrentUser = Depends(_risk_read), db: Session = Depends(get_db)):
    return permanence.permanence_summary(db, user, project_id)
