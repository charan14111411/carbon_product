from __future__ import annotations

from datetime import date
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.modules.emissions import service

router = APIRouter(tags=["Emissions"])


@router.get("/projects/{project_id}/emissions")
def emissions(project_id: str, start: date, end: date, user: CurrentUser = Depends(require(P.READ)),
              db: Session = Depends(get_db)) -> dict[str, Any]:
    """VM0042 v2.2 QA3 baseline and project emissions (Eq. 6–33) per source, field, QU and year."""
    return service.breakdown(db, user, project_id, start, end)
