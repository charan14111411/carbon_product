from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.modules.baseline import domain, service
from app.modules.baseline.schemas import (
    ActivityIn, ActivityOut, ActivityPage, ActivityVersionIn, AttestationIn, AttestationOut, Scenario, VoidIn,
)

router = APIRouter(tags=["Baseline"])
# Field collectors record activity data in the field, so recorders can also read it.
_read = require(P.READ, P.RECORD_PRACTICE)
_write = require(P.RECORD_PRACTICE, P.MANAGE_LAND, P.MANAGE_PROGRAMMES)


@router.get("/activity-records/schema")
def activity_schema(user: CurrentUser = Depends(_read)):
    """The Table 4 attribute schema per category, the Box 1 tiers and the Appendix 1 practices."""
    return {
        "categories": {
            c: {"label": s.label, "table4": s.table4, "appendix1": s.appendix1, "always": list(s.always),
                "flags": [{"key": f.key, "label": f.label, "required": f.required,
                           "requires_when_yes": [list(a) for a in f.requires]} for f in s.flags],
                "values": [{"key": q.key, "unit": q.unit, "kind": q.kind, "max": q.max} for q in s.values]}
            for c, s in domain.SCHEMA.items()
        },
        "data_tiers": service.DATA_TIERS,
        "appendix1_practices": domain.APPENDIX_1_PRACTICES,
    }


@router.post("/activity-records", response_model=ActivityOut, status_code=201)
def create_record(body: ActivityIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    """Record one category of activity for one field and year (version 1)."""
    return service.out(service.create(db, user, body.model_dump()))


@router.get("/activity-records", response_model=ActivityPage)
def list_records(
    project_id: str | None = None, field_id: str | None = None, scenario: Scenario | None = None,
    category: str | None = None, year: int | None = None, include_voided: bool = False,
    limit: int = Query(100, ge=1, le=1000), offset: int = Query(0, ge=0),
    user: CurrentUser = Depends(_read), db: Session = Depends(get_db),
):
    """The latest version of each activity record."""
    rows, total = service.list_latest(db, user, project_id=project_id, field_id=field_id, scenario=scenario,
                                      category=category, year=year, include_voided=include_voided,
                                      limit=limit, offset=offset)
    return {"items": [service.out(r) for r in rows], "total": total, "limit": limit, "offset": offset}


@router.get("/activity-records/{record_id}", response_model=ActivityOut)
def get_record(record_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.out(service.latest(db, user, record_id))


@router.get("/activity-records/{record_id}/versions", response_model=list[ActivityOut])
def list_versions(record_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return [service.out(r) for r in service.versions(db, user, record_id)]


@router.post("/activity-records/{record_id}/versions", response_model=ActivityOut, status_code=201)
def correct_record(record_id: str, body: ActivityVersionIn, user: CurrentUser = Depends(_write),
                   db: Session = Depends(get_db)):
    return service.out(service.correct(db, user, record_id, body.model_dump(exclude_unset=True)))


@router.post("/activity-records/{record_id}/void", response_model=ActivityOut, status_code=201)
def void_record(record_id: str, body: VoidIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.out(service.void(db, user, record_id, body.reason))


# ------------------------------------------------------------------ attestations
@router.post("/projects/{project_id}/fields/{field_id}/attestations", response_model=AttestationOut,
             status_code=201)
def sign_attestation(project_id: str, field_id: str, body: AttestationIn, user: CurrentUser = Depends(_write),
                     db: Session = Depends(get_db)):
    """The farmer signs a PDF summary of the field's baseline activities for the given years."""
    return service.create_attestation(db, user, project_id, field_id, body.model_dump())


@router.get("/projects/{project_id}/fields/{field_id}/attestations", response_model=list[AttestationOut])
def list_attestations(project_id: str, field_id: str, user: CurrentUser = Depends(_read),
                      db: Session = Depends(get_db)):
    return service.list_attestations(db, user, project_id, field_id)


# ------------------------------------------------------------------ schedule & practice change
@router.get("/projects/{project_id}/baseline-schedule")
def baseline_schedule(project_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    """VM0042 §6 schedule of activities per field: look-back, rotation, Table 4 completeness, repeating
    schedule and the reassessment date."""
    return service.schedule(db, user, project_id)


@router.get("/projects/{project_id}/practice-change")
def practice_change(project_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    """VM0042 §4 condition 2: project practices vs the look-back average (> 5 % change)."""
    return service.practice_change(db, user, project_id)
