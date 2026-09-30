from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.calculation import service
from app.modules.calculation.models import CalculationRun
from app.modules.calculation.schemas import NoteIn, OptionalNoteIn, RunIn, TermIn, TermOut

router = APIRouter(tags=["Calculation"])
_read = require(P.READ)


# ------------------------------------------------------------------ terms
@router.post("/projects/{project_id}/terms", response_model=TermOut, status_code=201)
def create_term(project_id: str, body: TermIn, user: CurrentUser = Depends(require(P.RUN_CALCULATION, P.EDIT_RULES)),
                db: Session = Depends(get_db)):
    return service.term_out(service.create_term(db, user, project_id, body))


@router.get("/projects/{project_id}/terms", response_model=list[TermOut])
def list_terms(project_id: str, period_label: str | None = None, user: CurrentUser = Depends(_read),
               db: Session = Depends(get_db)):
    return [service.term_out(t) for t in service.list_terms(db, user, project_id, period_label)]


@router.post("/terms/{term_id}/approve", response_model=TermOut)
def approve_term(term_id: str, user: CurrentUser = Depends(require(P.APPROVE_RULES)), db: Session = Depends(get_db)):
    return service.term_out(service.approve_term(db, user, term_id))


# ------------------------------------------------------------------ runs
@router.post("/projects/{project_id}/calculations", status_code=201)
def create_run(project_id: str, body: RunIn, user: CurrentUser = Depends(require(P.RUN_CALCULATION)),
               db: Session = Depends(get_db)) -> dict[str, Any]:
    run = service.create_run(db, user, project_id, body)
    db.flush()
    return service.run_detail(db, user, str(run.id))


@router.get("/projects/{project_id}/calculations")
def list_runs(project_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    return service.list_runs(db, user, project_id)


@router.get("/calculations/{run_id}")
def run_detail(run_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.run_detail(db, user, run_id)


@router.get("/calculations/{run_id}/provenance")
def run_provenance(run_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.provenance(db, get_owned(db, CalculationRun, run_id, user, "Calculation"))


@router.post("/calculations/{run_id}/submit")
def submit_run(run_id: str, user: CurrentUser = Depends(require(P.RUN_CALCULATION)),
               db: Session = Depends(get_db)) -> dict[str, Any]:
    run = service.submit_run(db, user, run_id)
    db.flush()
    return service.run_summary(db, run)


@router.post("/calculations/{run_id}/approve")
def approve_run(run_id: str, body: OptionalNoteIn | None = None,
                user: CurrentUser = Depends(require(P.APPROVE_CALCULATION)),
                db: Session = Depends(get_db)) -> dict[str, Any]:
    run = service.approve_run(db, user, run_id, body.note if body else "")
    db.flush()
    return service.run_summary(db, run)


@router.post("/calculations/{run_id}/reject")
def reject_run(run_id: str, body: NoteIn, user: CurrentUser = Depends(require(P.APPROVE_CALCULATION)),
               db: Session = Depends(get_db)) -> dict[str, Any]:
    run = service.reject_run(db, user, run_id, body.note)
    db.flush()
    return service.run_summary(db, run)


# ------------------------------------------------------------------ readiness
@router.get("/projects/{project_id}/readiness")
def readiness(project_id: str, period_label: str | None = None, user: CurrentUser = Depends(_read),
              db: Session = Depends(get_db)) -> dict[str, Any]:
    return service.readiness(db, user, project_id, period_label)
