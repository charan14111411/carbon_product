from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.risk import service
from app.modules.risk.models import RiskEvent
from app.modules.risk.schemas import (
    AssignIn, GrievanceIn, GrievanceStatusIn, RiskEventIn, RiskEventPatch, RiskStatusIn,
)

router = APIRouter(tags=["Risk & grievances"])
_risk_write = require(P.MANAGE_RISK)
_risk_read = require(P.READ, P.MANAGE_RISK)
_grv_staff = require(P.HANDLE_GRIEVANCE)
_grv_any = require(P.HANDLE_GRIEVANCE, P.MANAGE_RISK, P.FARMER_SELF)


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
