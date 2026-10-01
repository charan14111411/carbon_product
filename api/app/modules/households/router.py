from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, require
from app.core.db import get_db
from app.core.errors import NotFound
from app.core.permissions import P
from app.core.tenancy import get_owned
from app.modules.households import service
from app.modules.households.models import Household
from app.modules.households.schemas import HouseholdIn, HouseholdPatch, MemberIn

router = APIRouter(tags=["Households"])
_write = require(P.MANAGE_FARMERS)
_read = require(P.READ, P.MANAGE_FARMERS)


@router.get("/households")
def list_households(village: str | None = None, farmer_id: str | None = None, status: str | None = None,
                    user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return [service.household_out(db, user, h) for h in service.list_households(db, user, village, farmer_id, status)]


@router.post("/households", status_code=201)
def create_household(body: HouseholdIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.household_out(db, user, service.create_household(db, user, body))


@router.get("/households/{household_id}")
def get_household(household_id: str, user: CurrentUser = Depends(_read), db: Session = Depends(get_db)):
    return service.household_out(db, user, get_owned(db, Household, household_id, user, "Household"))


@router.patch("/households/{household_id}")
def update_household(household_id: str, body: HouseholdPatch, user: CurrentUser = Depends(_write),
                     db: Session = Depends(get_db)):
    return service.household_out(db, user, service.update_household(db, user, household_id, body))


@router.post("/households/{household_id}/members", status_code=201)
def add_member(household_id: str, body: MemberIn, user: CurrentUser = Depends(_write), db: Session = Depends(get_db)):
    return service.household_out(db, user, service.add_member(db, user, household_id, body))


@router.delete("/households/{household_id}/members/{member_id}")
def remove_member(household_id: str, member_id: str, user: CurrentUser = Depends(_write),
                  db: Session = Depends(get_db)):
    return service.household_out(db, user, service.remove_member(db, user, household_id, member_id))


@router.get("/farmers/{farmer_id}/household")
def farmer_household(farmer_id: str, user: CurrentUser = Depends(require(P.READ, P.MANAGE_FARMERS, P.FARMER_SELF)),
                     db: Session = Depends(get_db)):
    """Staff with read access, or the farmer themself (role farmer, scope.farmer_id)."""
    staff = user.can(P.READ) or user.can(P.MANAGE_FARMERS)
    if not staff and str(user.scope.get("farmer_id")) != str(farmer_id):
        raise NotFound("Farmer not found.")
    return service.household_out(db, user, service.farmer_household(db, user, farmer_id))
