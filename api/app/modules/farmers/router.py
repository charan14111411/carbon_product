from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, current_user, require
from app.core.db import get_db
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.farmers import service
from app.modules.farmers.member_directory import MemberDirectoryProtocol, get_member_directory
from app.modules.farmers.models import FPO, Farmer
from app.modules.farmers.schemas import (
    FarmerIn, FarmerOut, FarmerOverview, FarmerPage, FarmerPatch, FarmerStatus, FPOIn, FPOOut, FPOPatch,
    MemberFarmImportIn, MemberFarmImportOut, MemberLookupIn, MemberLookupOut,
)

router = APIRouter(tags=["Farmers"])
_read = require(P.READ, P.MANAGE_FARMERS)
_write = require(P.MANAGE_FARMERS)


# ------------------------------------------------------------------ FPOs
@router.get("/fpos", response_model=list[FPOOut])
def list_fpos(q: str | None = None, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.list_fpos(db, user, q)


@router.post("/fpos", response_model=FPOOut, status_code=201)
def create_fpo(body: FPOIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.create_fpo(db, user, body.model_dump())


@router.get("/fpos/{fpo_id}", response_model=FPOOut)
def get_fpo(fpo_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return get_owned(db, FPO, fpo_id, user, "FPO")


@router.patch("/fpos/{fpo_id}", response_model=FPOOut)
def update_fpo(fpo_id: str, body: FPOPatch, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.update_fpo(db, user, fpo_id, body.model_dump(exclude_unset=True))


# ------------------------------------------------------------------ farmers
@router.get("/farmers", response_model=FarmerPage)
def list_farmers(
    q: str | None = None, fpo_id: str | None = None, status: FarmerStatus | None = None,
    limit: int = Query(50, ge=1, le=500), offset: int = Query(0, ge=0),
    user: CurrentUser = Depends(_read), db: Session = Depends(get_db),
):
    items, total = service.search_farmers(db, user, q=q, fpo_id=fpo_id, status=status, limit=limit, offset=offset)
    return {"items": items, "total": total, "limit": limit, "offset": offset}


@router.post("/farmers", response_model=FarmerOut, status_code=201)
def create_farmer(body: FarmerIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.create_farmer(db, user, body.model_dump())


@router.post("/farmers/member-lookup", response_model=MemberLookupOut)
def member_lookup(
    body: MemberLookupIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db),
    directory: MemberDirectoryProtocol = Depends(get_member_directory),
):
    """Is this number a Varsapradaya member, and what farms and devices do they have there?

    503 ``MEMBER_DIRECTORY_UNAVAILABLE`` when the platform can't be reached -- never "not a member"."""
    return service.member_lookup(db, user, directory, body.phone, body.farmer_id)


@router.post("/farmers/{farmer_id}/import-member-farms", response_model=MemberFarmImportOut)
def import_member_farms(
    farmer_id: str, body: MemberFarmImportIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db),
    directory: MemberDirectoryProtocol = Depends(get_member_directory),
):
    """Create farm records from the farmer's Varsapradaya farms (already-imported ones are skipped).
    No fields are created: the platform holds no boundaries."""
    return service.import_member_farms(db, user, directory, farmer_id, body.external_farm_ids)


@router.get("/farmers/{farmer_id}", response_model=FarmerOut)
def get_farmer(farmer_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return get_owned(db, Farmer, farmer_id, user, "Farmer")


@router.patch("/farmers/{farmer_id}", response_model=FarmerOut)
def update_farmer(farmer_id: str, body: FarmerPatch, user: CurrentUser = Depends(_write),
                  db: Session = Depends(get_db)):
    return service.update_farmer(db, user, farmer_id, body.model_dump(exclude_unset=True))


@router.get("/farmers/{farmer_id}/overview", response_model=FarmerOverview)
def farmer_overview(farmer_id: str, user: CurrentUser = Depends(current_user), db: Session = Depends(get_db)):
    """Staff with read access, or the farmer themself (role farmer, scope.farmer_id)."""
    staff = user.can(P.READ) or user.can(P.MANAGE_FARMERS)
    if not staff and not (user.can(P.FARMER_SELF) and str(user.scope.get("farmer_id")) == str(farmer_id)):
        from app.core.errors import NotFound
        raise NotFound("Farmer not found.")
    return service.overview(db, user, farmer_id)
