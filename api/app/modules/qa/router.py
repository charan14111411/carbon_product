from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned, scoped
from app.modules.identity.models import User
from app.modules.programmes.models import Project
from app.modules.qa import service
from app.modules.qa.models import QAFinding
from app.modules.qa.schemas import NoteIn

router = APIRouter(tags=["Quality checks"])


def _names(db: Session, user: CurrentUser) -> dict:
    return {r[0]: r[1] for r in db.execute(select(User.id, User.full_name).where(User.org_id == user.org_id)).all()}


@router.post("/projects/{project_id}/qa/run")
def run(
    project_id: str,
    user: CurrentUser = Depends(require(P.RESOLVE_QA, P.RUN_CALCULATION, P.PLAN_SAMPLING)),
    db: Session = Depends(get_db),
):
    project = get_owned(db, Project, project_id, user, "Project")
    return service.run_project_checks(db, user, project)


@router.get("/projects/{project_id}/qa/findings")
def findings(
    project_id: str,
    severity: str | None = None,
    status: str | None = None,
    rule: str | None = None,
    entity_type: str | None = None,
    entity_id: str | None = None,
    limit: int = Query(500, ge=1, le=2000),
    user: CurrentUser = Depends(require(P.READ)),
    db: Session = Depends(get_db),
):
    project = get_owned(db, Project, project_id, user, "Project")
    q = scoped(QAFinding, user).where(QAFinding.project_id == project.id)
    if severity:
        q = q.where(QAFinding.severity == severity)
    if status:
        q = q.where(QAFinding.status == status)
    if rule:
        q = q.where(QAFinding.rule_code == rule)
    if entity_type:
        q = q.where(QAFinding.entity_type == entity_type)
    if entity_id:
        q = q.where(QAFinding.entity_id == entity_id)
    rows = db.scalars(q.order_by(QAFinding.created_at.desc()).limit(limit)).all()
    names = _names(db, user)
    return [service.finding_out(f, names) for f in rows]


@router.get("/projects/{project_id}/qa/summary")
def summary(project_id: str, user: CurrentUser = Depends(require(P.READ)), db: Session = Depends(get_db)):
    return service.summary(db, get_owned(db, Project, project_id, user, "Project"))


@router.post("/qa/findings/{finding_id}/resolve")
def resolve(
    finding_id: str, body: NoteIn, user: CurrentUser = Depends(require(P.RESOLVE_QA)), db: Session = Depends(get_db)
):
    f = service.resolve(db, user, get_owned(db, QAFinding, finding_id, user, "Finding"), body.note)
    return service.finding_out(f, _names(db, user))


@router.post("/qa/findings/{finding_id}/acknowledge")
def acknowledge(
    finding_id: str, body: NoteIn, user: CurrentUser = Depends(require(P.RESOLVE_QA)), db: Session = Depends(get_db)
):
    f = service.acknowledge(db, user, get_owned(db, QAFinding, finding_id, user, "Finding"), body.note)
    return service.finding_out(f, _names(db, user))
