from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import scoped
from app.modules.interventions import service
from app.modules.interventions.models import InterventionPlan
from app.modules.interventions.schemas import (
    AgreeIn, CloseIn, DeviationIn, DeviationStatusIn, PlanIn, PlanPatch, ReviseIn,
)

router = APIRouter(tags=["Intervention plans"])
_write = require(P.MANAGE_FARMERS, P.RECORD_PRACTICE)
_manage = require(P.MANAGE_FARMERS)
_read = require(P.READ, P.MANAGE_FARMERS, P.RECORD_PRACTICE)
_read_self = require(P.READ, P.MANAGE_FARMERS, P.RECORD_PRACTICE, P.FARMER_SELF)


@router.post("/intervention-plans", status_code=201)
def create_plan(body: PlanIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.plan_out(db, user, service.create_plan(db, user, body))


@router.get("/intervention-plans")
def list_plans(project_id: str | None = None, field_id: str | None = None, farmer_id: str | None = None,
               status: str | None = None, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    rows = service.list_plans(db, user, project_id=project_id, field_id=field_id, farmer_id=farmer_id, status=status)
    return [service.plan_out(db, user, p, detail=False) for p in rows]


@router.get("/intervention-plans/{plan_row_id}")
def get_plan(plan_row_id: str, user: CurrentUser = Depends(_read_self), db: Session = Depends(get_db)):
    return service.plan_out(db, user, service.get_plan(db, user, plan_row_id))


@router.patch("/intervention-plans/{plan_row_id}")
def update_plan(plan_row_id: str, body: PlanPatch, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.plan_out(db, user, service.update_plan(db, user, plan_row_id, body))


@router.post("/intervention-plans/{plan_row_id}/agree")
def agree(plan_row_id: str, body: AgreeIn, user: CurrentUser = Depends(require(P.MANAGE_FARMERS, P.RECORD_PRACTICE,
                                                                                 P.FARMER_SELF)),
          db: Session = Depends(get_db)):
    return service.plan_out(db, user, service.agree_plan(db, user, plan_row_id, body.method, body.otp_code))


@router.post("/intervention-plans/{plan_row_id}/activate")
def activate(plan_row_id: str, user: CurrentUser = Depends(_manage), db: Session = Depends(get_db)):
    return service.plan_out(db, user, service.activate_plan(db, user, plan_row_id))


@router.post("/intervention-plans/{plan_row_id}/complete")
def complete(plan_row_id: str, body: CloseIn, user: CurrentUser = Depends(_manage), db: Session = Depends(get_db)):
    return service.plan_out(db, user, service.close_plan(db, user, plan_row_id, "completed", body.reason))


@router.post("/intervention-plans/{plan_row_id}/withdraw")
def withdraw(plan_row_id: str, body: CloseIn, user: CurrentUser = Depends(_manage), db: Session = Depends(get_db)):
    return service.plan_out(db, user, service.close_plan(db, user, plan_row_id, "withdrawn", body.reason))


@router.post("/intervention-plans/{plan_row_id}/revise", status_code=201)
def revise(plan_row_id: str, body: ReviseIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.plan_out(db, user, service.revise_plan(db, user, plan_row_id, body))


@router.get("/intervention-plans/{plan_row_id}/compliance")
def compliance(plan_row_id: str, user: CurrentUser = Depends(_read_self), db: Session = Depends(get_db)):
    return service.plan_compliance(db, user, service.get_plan(db, user, plan_row_id))


@router.get("/intervention-plans/{plan_row_id}/deviations")
def deviations(plan_row_id: str, user: CurrentUser = Depends(_read_self), db: Session = Depends(get_db)):
    plan = service.get_plan(db, user, plan_row_id)
    return [service.deviation_out(d) for d in service.list_deviations(db, user, plan)]


@router.post("/intervention-plans/{plan_row_id}/deviations", status_code=201)
def create_deviation(plan_row_id: str, body: DeviationIn, user: CurrentUser = Depends(_write),
                     db: Session = Depends(get_db)):
    return service.deviation_out(service.create_deviation(db, user, plan_row_id, body))


@router.post("/intervention-plans/{plan_row_id}/detect-deviations")
def detect(plan_row_id: str, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    plan = service.get_plan(db, user, plan_row_id)
    created = service.detect_deviations(db, user, plan)
    return {"created": len(created), "deviations": [service.deviation_out(d) for d in created]}


@router.post("/intervention-deviations/{deviation_id}/status")
def move_deviation(deviation_id: str, body: DeviationStatusIn, user: CurrentUser = Depends(_manage),
                   db: Session = Depends(get_db)):
    return service.deviation_out(service.move_deviation(db, user, deviation_id, body.status, body.impact,
                                                        body.corrective_action, body.note))


@router.get("/projects/{project_id}/interventions/compliance")
def project_compliance(project_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.project_compliance(db, user, project_id)


@router.post("/projects/{project_id}/interventions/detect-deviations")
def project_detect(project_id: str, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.detect_project(db, user, project_id)


@router.get("/farmers/{farmer_id}/intervention-plans")
def farmer_plans(farmer_id: str, user: CurrentUser = Depends(_read_self), db: Session = Depends(get_db)):
    farmer = service.farmer_for(db, user, farmer_id)
    rows = db.scalars(scoped(InterventionPlan, user).where(InterventionPlan.farmer_id == farmer.id)
                      .order_by(InterventionPlan.code, InterventionPlan.version)).all()
    return [service.plan_out(db, user, p) for p in rows]
