from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core import geo
from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.land import service
from app.modules.land.models import Enrolment, Farm, Field
from app.modules.land.schemas import (
    BoundaryVersionOut, ContainsOut, EnrolmentIn, EnrolmentOut, FarmIn, FarmOut, FarmPatch, FieldIn, FieldOut,
    FieldPage, FieldPatch, FieldStatus, LandUseIn, LandUseOut, TenureIn, TenureOut, TenureVerifyIn, WithdrawIn,
)

router = APIRouter(tags=["Land"])
# Field collectors map fields, so land writers may also read land data.
_read = require(P.READ, P.MANAGE_LAND)
_write = require(P.MANAGE_LAND)
# Verifying land tenure is a programme-manager decision (four-eyes: never the person who recorded it).
_verify = require(P.MANAGE_PROGRAMMES)


# ------------------------------------------------------------------ farms
@router.get("/farms", response_model=list[FarmOut])
def list_farms(farmer_id: str | None = None, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.list_farms(db, user, farmer_id)


@router.post("/farms", response_model=FarmOut, status_code=201)
def create_farm(body: FarmIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.create_farm(db, user, body.model_dump())


@router.get("/farms/{farm_id}", response_model=FarmOut)
def get_farm(farm_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return get_owned(db, Farm, farm_id, user, "Farm")


@router.patch("/farms/{farm_id}", response_model=FarmOut)
def update_farm(farm_id: str, body: FarmPatch, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.update_farm(db, user, farm_id, body.model_dump(exclude_unset=True))


# ------------------------------------------------------------------ fields
@router.get("/fields", response_model=FieldPage)
def list_fields(
    farm_id: str | None = None, farmer_id: str | None = None, project_id: str | None = None,
    crop_code: str | None = None, status: FieldStatus | None = None, q: str | None = None,
    limit: int = Query(50, ge=1, le=500), offset: int = Query(0, ge=0),
    user: CurrentUser = Depends(_read), db: Session = Depends(get_db),
):
    items, total = service.list_fields(db, user, farm_id=farm_id, farmer_id=farmer_id, project_id=project_id,
                                       crop_code=crop_code, status=status, q=q, limit=limit, offset=offset)
    return {"items": items, "total": total, "limit": limit, "offset": offset}


@router.post("/fields", response_model=FieldOut, status_code=201)
def create_field(body: FieldIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.create_field(db, user, body.model_dump())


@router.get("/fields/geojson")
def fields_geojson(project_id: str | None = None, farmer_id: str | None = None,
                   user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    """A GeoJSON FeatureCollection of field boundaries for maps."""
    return service.fields_geojson(db, user, project_id, farmer_id)


@router.get("/fields/{field_id}", response_model=FieldOut)
def get_field(field_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return get_owned(db, Field, field_id, user, "Field")


@router.patch("/fields/{field_id}", response_model=FieldOut)
def update_field(field_id: str, body: FieldPatch, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.update_field(db, user, field_id, body.model_dump(exclude_unset=True))


@router.get("/fields/{field_id}/history", response_model=list[BoundaryVersionOut])
def field_history(field_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.boundary_history(db, user, field_id)


@router.get("/fields/{field_id}/contains", response_model=ContainsOut)
def field_contains(field_id: str, lat: float = Query(ge=-90, le=90), lon: float = Query(ge=-180, le=180),
                   user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    f = get_owned(db, Field, field_id, user, "Field")
    return {"field_id": str(f.id), "lat": lat, "lon": lon, "inside": geo.contains(f.boundary, lat, lon)}


@router.get("/fields/{field_id}/land-use", response_model=list[LandUseOut])
def list_land_use(field_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.list_land_use(db, user, field_id)


@router.post("/fields/{field_id}/land-use", response_model=LandUseOut, status_code=201)
def add_land_use(field_id: str, body: LandUseIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.add_land_use(db, user, field_id, body.model_dump())


# ------------------------------------------------------------------ land tenure
@router.get("/fields/{field_id}/tenure", response_model=list[TenureOut])
def list_tenure(field_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.list_tenure(db, user, field_id)


@router.post("/fields/{field_id}/tenure", response_model=TenureOut, status_code=201)
def add_tenure(field_id: str, body: TenureIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    """Record who controls the field (owned, leased...) with the supporting documents. Starts as pending."""
    return service.add_tenure(db, user, field_id, body.model_dump())


@router.post("/tenure/{tenure_id}/verify", response_model=TenureOut)
def verify_tenure(tenure_id: str, body: TenureVerifyIn, user: CurrentUser = Depends(_verify),
                  db: Session = Depends(get_db)):
    """Verify or reject a tenure record. The person who recorded it can't verify it."""
    return service.verify_tenure(db, user, tenure_id, body.decision, body.note)


# ------------------------------------------------------------------ enrolment
@router.get("/projects/{project_id}/enrolments", response_model=list[EnrolmentOut])
def list_enrolments(project_id: str, status: str | None = None, user: CurrentUser = Depends(_read),
                    db: Session = Depends(get_db)):
    return service.enrolment_views(db, service.list_enrolments(db, user, project_id, status))


@router.post("/projects/{project_id}/enrolments", response_model=EnrolmentOut, status_code=201)
def request_enrolment(project_id: str, body: EnrolmentIn, user: CurrentUser = Depends(_write),
                      db: Session = Depends(get_db)):
    """Check a field's eligibility for the project and record the result."""
    return service.enrolment_views(db, [service.request_enrolment(db, user, project_id, body.field_id)])[0]


@router.get("/projects/{project_id}/enrolments/{enrolment_id}", response_model=EnrolmentOut)
def get_enrolment(project_id: str, enrolment_id: str, user: CurrentUser = Depends(_read),
                  db: Session = Depends(get_db)):
    _, e = service.get_enrolment(db, user, project_id, enrolment_id)
    return service.enrolment_views(db, [e])[0]


@router.post("/projects/{project_id}/enrolments/{enrolment_id}/confirm", response_model=EnrolmentOut)
def confirm_enrolment(project_id: str, enrolment_id: str, user: CurrentUser = Depends(_write),
                      db: Session = Depends(get_db)):
    return service.enrolment_views(db, [service.confirm_enrolment(db, user, project_id, enrolment_id)])[0]


@router.post("/projects/{project_id}/enrolments/{enrolment_id}/withdraw", response_model=EnrolmentOut)
def withdraw_enrolment(project_id: str, enrolment_id: str, body: WithdrawIn, user: CurrentUser = Depends(_write),
                       db: Session = Depends(get_db)):
    e: Enrolment = service.withdraw_enrolment(db, user, project_id, enrolment_id, body.reason)
    return service.enrolment_views(db, [e])[0]
