"""Households: a head farmer, the other members (registered farmers or named people) and location.
A registered farmer belongs to at most one active household."""

from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.errors import Conflict, IllegalTransition, NotFound, ValidationFailed
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.farmers.models import Farmer
from app.modules.households.models import Household, HouseholdMember
from app.modules.households.schemas import HouseholdIn, HouseholdPatch, MemberIn
from app.modules.portfolio.masking import farmer_public, masks_pii


def _members(db: Session, h: Household, active_only: bool = True) -> list[HouseholdMember]:
    q = select(HouseholdMember).where(HouseholdMember.household_id == h.id)
    if active_only:
        q = q.where(HouseholdMember.is_active.is_(True))
    return list(db.scalars(q.order_by(HouseholdMember.created_at)).all())


def _current_household(db: Session, org_id: uuid.UUID, farmer_id: uuid.UUID) -> Household | None:
    return db.scalars(select(Household).join(HouseholdMember, HouseholdMember.household_id == Household.id).where(
        Household.org_id == org_id, Household.status == "active", HouseholdMember.farmer_id == farmer_id,
        HouseholdMember.is_active.is_(True))).first()


def _ensure_free(db: Session, org_id: uuid.UUID, farmer: Farmer, household_id: uuid.UUID | None = None) -> None:
    other = _current_household(db, org_id, farmer.id)
    if other is not None and other.id != household_id:
        raise Conflict(f"Farmer {farmer.code} already belongs to household {other.code}.",
                       code="FARMER_IN_HOUSEHOLD", details={"household_id": str(other.id)})


def household_out(db: Session, user: CurrentUser, h: Household) -> dict[str, Any]:
    masked = masks_pii(user)
    members = []
    for m in _members(db, h):
        f = db.get(Farmer, m.farmer_id) if m.farmer_id else None
        pub = farmer_public(user, f) if f else None
        members.append({"id": str(m.id), "relation": m.relation,
                        "farmer_id": str(m.farmer_id) if m.farmer_id else None, "farmer": pub,
                        "name": pub["name"] if pub else ("Household member" if masked else m.name)})
    return {"id": str(h.id), "code": h.code, "name": "" if masked else h.name, "status": h.status,
            "head_farmer_id": str(h.head_farmer_id), "head": farmer_public(user, db.get(Farmer, h.head_farmer_id)),
            "village": h.village, "district": h.district, "state": h.state, "notes": "" if masked else h.notes,
            "members": members, "member_count": len(members), "created_at": h.created_at.isoformat()}


def _add_member(db: Session, user: CurrentUser, h: Household, body: MemberIn) -> HouseholdMember:
    fid = None
    if body.farmer_id:
        f = get_owned(db, Farmer, body.farmer_id, user, "Farmer")
        if any(m.farmer_id == f.id for m in _members(db, h)):
            raise Conflict(f"Farmer {f.code} is already a member of this household.", code="ALREADY_MEMBER")
        _ensure_free(db, user.org_id, f, h.id)
        fid = f.id
    m = HouseholdMember(org_id=user.org_id, created_by=user.id, household_id=h.id, farmer_id=fid,
                        name=body.name, relation=body.relation, is_active=True)
    db.add(m)
    db.flush()
    return m


def create_household(db: Session, user: CurrentUser, body: HouseholdIn) -> Household:
    head = get_owned(db, Farmer, body.head_farmer_id, user, "Farmer")
    _ensure_free(db, user.org_id, head)
    n = db.scalar(select(func.count()).select_from(Household).where(Household.org_id == user.org_id)) or 0
    h = Household(org_id=user.org_id, created_by=user.id, code=f"HH-{n + 1:05d}", name=body.name,
                  head_farmer_id=head.id, village=body.village if body.village is not None else head.village,
                  district=body.district if body.district is not None else head.district,
                  state=body.state if body.state is not None else head.state, notes=body.notes, status="active")
    db.add(h)
    db.flush()
    db.add(HouseholdMember(org_id=user.org_id, created_by=user.id, household_id=h.id, farmer_id=head.id,
                           relation="head", is_active=True))
    db.flush()
    for m in body.members:
        if m.farmer_id and m.farmer_id == str(head.id):
            raise ValidationFailed("The head of the household is already a member.")
        _add_member(db, user, h, m)
    audit(db, user, "household.create", h)
    return h


def update_household(db: Session, user: CurrentUser, household_id: str, body: HouseholdPatch) -> Household:
    h = get_owned(db, Household, household_id, user, "Household")
    before = snapshot(h)
    data = body.model_dump(exclude_unset=True)
    if data.get("status") == "active" and h.status != "active":
        for m in _members(db, h):
            if m.farmer_id:
                _ensure_free(db, user.org_id, db.get(Farmer, m.farmer_id), h.id)
    new_head_id = data.pop("head_farmer_id", None)
    if new_head_id:
        if h.status != "active":
            raise IllegalTransition("Reactivate the household before changing its head.")
        new_head = get_owned(db, Farmer, new_head_id, user, "Farmer")
        if new_head.id != h.head_farmer_id:
            _ensure_free(db, user.org_id, new_head, h.id)
            rows = _members(db, h)
            for m in rows:
                if m.relation == "head":
                    m.relation = "other"
            mine = next((m for m in rows if m.farmer_id == new_head.id), None)
            if mine is None:
                db.add(HouseholdMember(org_id=user.org_id, created_by=user.id, household_id=h.id,
                                       farmer_id=new_head.id, relation="head", is_active=True))
            else:
                mine.relation = "head"
            h.head_farmer_id = new_head.id
    for k, v in data.items():
        if v is not None:
            setattr(h, k, v)
    db.flush()
    audit(db, user, "household.update", h, before=before)
    return h


def add_member(db: Session, user: CurrentUser, household_id: str, body: MemberIn) -> Household:
    h = get_owned(db, Household, household_id, user, "Household")
    if h.status != "active":
        raise IllegalTransition("Members can only be added to an active household.")
    m = _add_member(db, user, h, body)
    audit(db, user, "household.member_add", m)
    return h


def remove_member(db: Session, user: CurrentUser, household_id: str, member_id: str) -> Household:
    h = get_owned(db, Household, household_id, user, "Household")
    m = get_owned(db, HouseholdMember, member_id, user, "Member")
    if m.household_id != h.id or not m.is_active:
        raise NotFound("Member not found.")
    if m.relation == "head":
        raise ValidationFailed("Choose a new head of household before removing the current one.",
                               code="HEAD_REQUIRED")
    before = snapshot(m)
    m.is_active = False
    audit(db, user, "household.member_remove", m, before=before)
    return h


def list_households(db: Session, user: CurrentUser, village: str | None, farmer_id: str | None,
                    status: str | None) -> list[Household]:
    q = scoped(Household, user).order_by(Household.code)
    if village:
        q = q.where(func.lower(Household.village) == village.lower())
    if status:
        q = q.where(Household.status == status)
    if farmer_id:
        f = get_owned(db, Farmer, farmer_id, user, "Farmer")
        q = q.where(Household.id.in_(select(HouseholdMember.household_id).where(
            HouseholdMember.farmer_id == f.id, HouseholdMember.is_active.is_(True))))
    return list(db.scalars(q).all())


def farmer_household(db: Session, user: CurrentUser, farmer_id: str) -> Household:
    f = get_owned(db, Farmer, farmer_id, user, "Farmer")
    h = _current_household(db, user.org_id, f.id)
    if h is None:
        raise NotFound("This farmer is not part of a household yet.")
    return h
