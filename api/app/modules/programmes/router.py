from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.programmes import service
from app.modules.programmes.models import Programme, Project
from app.modules.programmes.schemas import (
    ProgrammeIn, ProgrammeOut, ProgrammePatch, ProgrammeSummary, ProjectIn, ProjectOut, ProjectPatch, StatusChange,
)

router = APIRouter(tags=["Programmes"])
_read = require(P.READ)
_write = require(P.MANAGE_PROGRAMMES)


# ------------------------------------------------------------------ programmes
@router.get("/programmes", response_model=list[ProgrammeOut])
def list_programmes(status: str | None = None, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.list_programmes(db, user, status)


@router.post("/programmes", response_model=ProgrammeOut, status_code=201)
def create_programme(body: ProgrammeIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.create_programme(db, user, body)


@router.get("/programmes/{programme_id}", response_model=ProgrammeOut)
def get_programme(programme_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return get_owned(db, Programme, programme_id, user, "Programme")


@router.patch("/programmes/{programme_id}", response_model=ProgrammeOut)
def update_programme(programme_id: str, body: ProgrammePatch, user: CurrentUser = Depends(_write),
                     db: Session = Depends(get_db)):
    return service.update_programme(db, user, programme_id, body)


@router.post("/programmes/{programme_id}/status", response_model=ProgrammeOut)
def change_programme_status(programme_id: str, body: StatusChange, user: CurrentUser = Depends(_write),
                            db: Session = Depends(get_db)):
    return service.change_programme_status(db, user, programme_id, body.status, body.reason)


@router.get("/programmes/{programme_id}/summary", response_model=ProgrammeSummary)
def programme_summary(programme_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.programme_summary(db, user, programme_id)


# ------------------------------------------------------------------ projects
@router.get("/projects", response_model=list[ProjectOut])
def list_projects(programme_id: str | None = None, status: str | None = None,
                  user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.list_projects(db, user, programme_id, status)


@router.post("/projects", response_model=ProjectOut, status_code=201)
def create_project(body: ProjectIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.create_project(db, user, body)


@router.get("/projects/{project_id}", response_model=ProjectOut)
def get_project(project_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return get_owned(db, Project, project_id, user, "Project")


@router.patch("/projects/{project_id}", response_model=ProjectOut)
def update_project(project_id: str, body: ProjectPatch, user: CurrentUser = Depends(_write),
                   db: Session = Depends(get_db)):
    return service.update_project(db, user, project_id, body)


@router.post("/projects/{project_id}/status", response_model=ProjectOut)
def change_project_status(project_id: str, body: StatusChange, user: CurrentUser = Depends(_write),
                          db: Session = Depends(get_db)):
    return service.change_project_status(db, user, project_id, body.status, body.reason)
