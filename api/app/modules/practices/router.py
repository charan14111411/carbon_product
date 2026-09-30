from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, Header, Query, Response
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.modules.practices import service
from app.modules.practices.models import PracticeRecord
from app.modules.practices.schemas import (
    PracticeIn, PracticeOut, PracticePage, PracticeVersionIn, Scenario, VoidIn,
)

router = APIRouter(prefix="/practices", tags=["Practices"])
# People who record practices can also see them.
_read = require(P.READ, P.RECORD_PRACTICE)
_write = require(P.RECORD_PRACTICE)


def _out(db: Session, user: CurrentUser, rows: list[PracticeRecord]) -> list[PracticeOut]:
    reqs = service.evidence_requirements(db, user, {r.practice_code for r in rows})
    out = []
    for r in rows:
        o = PracticeOut.model_validate(r)
        o.missing_evidence = service.missing_evidence(r, reqs)
        out.append(o)
    return out


@router.post("", response_model=PracticeOut, status_code=201)
def record_practice(
    body: PracticeIn, response: Response,
    idempotency_key: str | None = Header(default=None, alias="Idempotency-Key"),
    user: CurrentUser = Depends(_write), db: Session = Depends(get_db),
):
    """Record a practice (version 1). Re-sending the same client reference returns the original (200)."""
    rec, created = service.create(db, user, body.model_dump(), idempotency_key)
    if not created:
        response.status_code = 200
    return _out(db, user, [rec])[0]


@router.get("", response_model=PracticePage)
def list_practices(
    field_id: str | None = None, farmer_id: str | None = None, project_id: str | None = None,
    practice_code: str | None = None, scenario: Scenario | None = None,
    date_from: date | None = None, date_to: date | None = None, include_voided: bool = False,
    limit: int = Query(50, ge=1, le=500), offset: int = Query(0, ge=0),
    user: CurrentUser = Depends(_read), db: Session = Depends(get_db),
):
    """The latest version of each practice record."""
    rows, total = service.list_latest(
        db, user, field_id=field_id, farmer_id=farmer_id, project_id=project_id, practice_code=practice_code,
        scenario=scenario, date_from=date_from, date_to=date_to, include_voided=include_voided,
        limit=limit, offset=offset,
    )
    return {"items": _out(db, user, rows), "total": total, "limit": limit, "offset": offset}


@router.get("/{record_id}", response_model=PracticeOut)
def get_practice(record_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return _out(db, user, [service.latest(db, user, record_id)])[0]


@router.get("/{record_id}/versions", response_model=list[PracticeOut])
def list_versions(record_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return _out(db, user, service.versions(db, user, record_id))


@router.post("/{record_id}/versions", response_model=PracticeOut, status_code=201)
def correct_practice(record_id: str, body: PracticeVersionIn, user: CurrentUser = Depends(_write),
                     db: Session = Depends(get_db)):
    return _out(db, user, [service.correct(db, user, record_id, body.model_dump(exclude_unset=True))])[0]


@router.post("/{record_id}/void", response_model=PracticeOut, status_code=201)
def void_practice(record_id: str, body: VoidIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return _out(db, user, [service.void(db, user, record_id, body.reason)])[0]
