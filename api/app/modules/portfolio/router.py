from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.modules.portfolio import service

router = APIRouter(tags=["Portfolio"])
_read = require(P.READ, P.BUYER_READ)


@router.get("/portfolio/overview")
def overview(user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.overview(db, user)


@router.get("/portfolio/projects/{project_id}")
def project(project_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.project_detail(db, user, project_id)
