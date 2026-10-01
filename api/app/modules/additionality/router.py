from __future__ import annotations

from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.modules.additionality import domain, service
from app.modules.additionality.schemas import AssessmentIn, AssessmentOut, AssessmentPatch, ReviewIn

router = APIRouter(prefix="/projects/{project_id}/additionality", tags=["Additionality"])
_read = require(P.READ)
_write = require(P.MANAGE_PROGRAMMES)
_approve = require(P.APPROVE_RULES)


@router.get("", response_model=AssessmentOut)
def latest(project_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    """The latest version of the project's additionality assessment (VM0042 §7)."""
    return service.out(service.latest(db, user, project_id))


@router.get("/rules")
def rules(project_id: str, user: CurrentUser = Depends(_read)):
    return {"common_practice_threshold_pct": domain.COMMON_PRACTICE_THRESHOLD_PCT,
            "barrier_types": domain.BARRIER_TYPES, "source_types": domain.SOURCE_TYPES,
            "reference": "VM0042 v2.2 §7 p.17–19; VT0008 Step 2 and Step 4c"}


@router.get("/versions", response_model=list[AssessmentOut])
def list_versions(project_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return [service.out(a) for a in service.versions(db, user, project_id)]


@router.post("", response_model=AssessmentOut, status_code=201)
def create(project_id: str, body: AssessmentIn | None = Body(default=None), user: CurrentUser = Depends(_write),
           db: Session = Depends(get_db)):
    """Start a new draft version. Without a body, the latest version is copied."""
    return service.out(service.create(db, user, project_id, body.model_dump() if body else None))


@router.get("/{assessment_id}", response_model=AssessmentOut)
def get_one(project_id: str, assessment_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.out(service.get(db, user, project_id, assessment_id))


@router.patch("/{assessment_id}", response_model=AssessmentOut)
def update(project_id: str, assessment_id: str, body: AssessmentPatch, user: CurrentUser = Depends(_write),
           db: Session = Depends(get_db)):
    return service.out(service.update(db, user, project_id, assessment_id, body.model_dump(exclude_unset=True)))


@router.post("/{assessment_id}/submit", response_model=AssessmentOut)
def submit(project_id: str, assessment_id: str, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.out(service.submit(db, user, project_id, assessment_id))


@router.post("/{assessment_id}/approve", response_model=AssessmentOut)
def approve(project_id: str, assessment_id: str, body: ReviewIn = Body(default_factory=ReviewIn),
            user: CurrentUser = Depends(_approve), db: Session = Depends(get_db)):
    """Approve a submitted assessment. The author and submitter can't approve it."""
    return service.out(service.approve(db, user, project_id, assessment_id, body.note))


@router.post("/{assessment_id}/reject", response_model=AssessmentOut)
def reject(project_id: str, assessment_id: str, body: ReviewIn, user: CurrentUser = Depends(_approve),
           db: Session = Depends(get_db)):
    return service.out(service.reject(db, user, project_id, assessment_id, body.note))
