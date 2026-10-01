"""FPOs, farmers, Varsapradaya member linking and the farmer 360 view."""

from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.errors import Conflict, ValidationFailed
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.farmers.domain import normalise_phone, phone_digits
from app.modules.farmers.member_directory import MemberDirectoryProtocol, MemberRecord
from app.modules.farmers.models import FPO, Farmer

CODE_PREFIX = "FRM-"


# ------------------------------------------------------------------ FPOs
def list_fpos(db: Session, user: CurrentUser, q: str | None = None) -> list[FPO]:
    stmt = scoped(FPO, user).order_by(FPO.name)
    if q:
        stmt = stmt.where(FPO.name.ilike(f"%{q.strip()}%"))
    return list(db.scalars(stmt).all())


def create_fpo(db: Session, user: CurrentUser, data: dict[str, Any]) -> FPO:
    if data.get("contact_phone"):
        data["contact_phone"] = normalise_phone(data["contact_phone"])
    fpo = FPO(org_id=user.org_id, created_by=user.id, **data)
    db.add(fpo)
    audit(db, user, "fpo.create", fpo)
    return fpo


def update_fpo(db: Session, user: CurrentUser, fpo_id: str, changes: dict[str, Any]) -> FPO:
    fpo = get_owned(db, FPO, fpo_id, user, "FPO")
    before = snapshot(fpo)
    if changes.get("contact_phone"):
        changes["contact_phone"] = normalise_phone(changes["contact_phone"])
    for k, v in changes.items():
        if v is None and k in ("name", "district", "state"):
            continue
        setattr(fpo, k, v)
    audit(db, user, "fpo.update", fpo, before=before)
    return fpo


# ------------------------------------------------------------------ farmers
def next_farmer_code(db: Session, org_id: uuid.UUID) -> str:
    last = db.scalar(select(func.max(Farmer.code)).where(Farmer.org_id == org_id, Farmer.code.like(f"{CODE_PREFIX}%")))
    n = int(last[len(CODE_PREFIX):]) + 1 if last and last[len(CODE_PREFIX):].isdigit() else 1
    return f"{CODE_PREFIX}{n:06d}"


def _ensure_unique_phone(db: Session, org_id: uuid.UUID, phone: str, exclude: uuid.UUID | None = None) -> None:
    q = select(Farmer).where(Farmer.org_id == org_id, Farmer.phone == phone)
    if exclude:
        q = q.where(Farmer.id != exclude)
    other = db.scalar(q)
    if other:
        raise Conflict(f"{other.full_name} ({other.code}) is already registered with this phone number.",
                       code="DUPLICATE_FARMER", details={"farmer_id": str(other.id), "code": other.code})


def _fpo_id(db: Session, user: CurrentUser, value: str | None) -> uuid.UUID | None:
    return None if value is None else get_owned(db, FPO, value, user, "FPO").id


def create_farmer(db: Session, user: CurrentUser, data: dict[str, Any]) -> Farmer:
    data["phone"] = normalise_phone(data["phone"])
    _ensure_unique_phone(db, user.org_id, data["phone"])
    data["fpo_id"] = _fpo_id(db, user, data.get("fpo_id"))
    farmer = Farmer(org_id=user.org_id, created_by=user.id, code=next_farmer_code(db, user.org_id), **data)
    db.add(farmer)
    audit(db, user, "farmer.create", farmer)
    return farmer


def update_farmer(db: Session, user: CurrentUser, farmer_id: str, changes: dict[str, Any]) -> Farmer:
    farmer = get_owned(db, Farmer, farmer_id, user, "Farmer")
    before = snapshot(farmer)
    if changes.get("phone"):
        changes["phone"] = normalise_phone(changes["phone"])
        _ensure_unique_phone(db, user.org_id, changes["phone"], exclude=farmer.id)
    if "fpo_id" in changes:
        changes["fpo_id"] = _fpo_id(db, user, changes["fpo_id"])
    for k, v in changes.items():
        if v is None and k != "fpo_id":
            continue
        setattr(farmer, k, v)
    audit(db, user, "farmer.update", farmer, before=before)
    return farmer


def search_farmers(
    db: Session, user: CurrentUser, *, q: str | None = None, fpo_id: str | None = None,
    status: str | None = None, limit: int = 50, offset: int = 0,
) -> tuple[list[Farmer], int]:
    stmt = scoped(Farmer, user)
    if q and q.strip():
        term = q.strip()
        conds = [Farmer.full_name.ilike(f"%{term}%"), Farmer.village.ilike(f"%{term}%"),
                 Farmer.code.ilike(f"%{term}%")]
        digits = phone_digits(term)
        if len(digits) >= 3:
            conds.append(Farmer.phone.like(f"%{digits}%"))
        stmt = stmt.where(or_(*conds))
    if fpo_id:
        stmt = stmt.where(Farmer.fpo_id == get_owned(db, FPO, fpo_id, user, "FPO").id)
    if status:
        stmt = stmt.where(Farmer.status == status)
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    rows = db.scalars(stmt.order_by(Farmer.full_name, Farmer.code).limit(limit).offset(offset)).all()
    return list(rows), total


# ------------------------------------------------------------------ member lookup
def member_lookup(db: Session, user: CurrentUser, directory: MemberDirectoryProtocol, phone: str,
                  farmer_id: str | None = None) -> dict[str, Any]:
    """Ask the member platform about a number; optionally link the answer to a farmer.

    If the platform can't be reached, ``MemberDirectoryUnavailable`` (503) propagates and nothing is
    written: an unanswered question is never stored as "not a member".
    """
    e164 = normalise_phone(phone)
    record = directory.lookup(e164)
    existing = db.scalar(scoped(Farmer, user).where(Farmer.phone == e164))
    linked: Farmer | None = None
    if farmer_id:
        linked = get_owned(db, Farmer, farmer_id, user, "Farmer")
        if linked.phone != e164:
            raise ValidationFailed("This phone number doesn't match the farmer's registered number.",
                                   code="PHONE_MISMATCH")
        if not record.is_member:
            raise ValidationFailed("This phone number isn't registered on the Varsapradaya platform.",
                                   code="NOT_A_MEMBER")
        clash = db.scalar(scoped(Farmer, user).where(Farmer.member_id == record.member_id, Farmer.id != linked.id))
        if clash:
            raise Conflict(f"This member is already linked to {clash.full_name} ({clash.code}).",
                           code="MEMBER_ALREADY_LINKED", details={"farmer_id": str(clash.id)})
        if linked.member_id != record.member_id:
            before = snapshot(linked)
            linked.member_id = record.member_id
            audit(db, user, "farmer.link_member", linked, before=before)
    out = record.to_dict()
    imported = _imported_farms(db, user, [f.external_farm_id for f in record.farms])
    for farm in out["farms"]:
        hit = imported.get(farm["external_farm_id"])
        farm["imported_farm_id"] = str(hit.id) if hit else None
    return {
        **out,
        "phone": e164,
        "existing_farmer_id": str(existing.id) if existing else None,
        "linked_farmer_id": str(linked.id) if linked else None,
    }


def _imported_farms(db: Session, user: CurrentUser, external_ids: list[str]) -> dict[str, Any]:
    from app.modules.land.models import Farm

    ids = [x for x in external_ids if x]
    if not ids:
        return {}
    rows = db.scalars(scoped(Farm, user).where(Farm.external_farm_id.in_(ids))).all()
    return {f.external_farm_id: f for f in rows}


# ------------------------------------------------------------------ member farm import
NO_FIELDS_NOTE = ("Varsapradaya holds no boundary, area or coordinates for a farm, so no fields were created. "
                  "Map each field's boundary under Fields & map before it can be enrolled.")


def _farm_notes(farm: Any) -> str:
    parts = ["Imported from Varsapradaya."]
    if farm.estate_name:
        parts.append(f"Estate: {farm.estate_name}.")
    if farm.crops:
        parts.append("Crops on Varsapradaya: " + ", ".join(farm.crops) + ".")
    if farm.plants_per_hectare:
        parts.append(f"Plants per hectare (as reported): {farm.plants_per_hectare:g}.")
    return " ".join(parts)


def import_member_farms(db: Session, user: CurrentUser, directory: MemberDirectoryProtocol, farmer_id: str,
                        external_farm_ids: list[str]) -> dict[str, Any]:
    """Create our Farm records from the farmer's Varsapradaya farms. Idempotent per org + external id.

    The farm list is fetched again on the server: what the browser sends is only a choice of IDs, never
    the farm data itself.
    """
    from app.modules.land.models import Farm

    farmer = get_owned(db, Farmer, farmer_id, user, "Farmer")
    if not farmer.member_id:
        raise ValidationFailed("Link this farmer to their Varsapradaya membership first (Check membership).",
                               code="NOT_LINKED_MEMBER")
    wanted = list(dict.fromkeys(x.strip() for x in external_farm_ids if x and x.strip()))
    if not wanted:
        raise ValidationFailed("Choose at least one farm to import.", code="NOTHING_TO_IMPORT")
    record: MemberRecord = directory.lookup(farmer.phone)
    if not record.is_member:
        raise ValidationFailed("This farmer's phone number is no longer registered on Varsapradaya.",
                               code="NOT_A_MEMBER")
    if record.member_id != farmer.member_id:
        raise Conflict("Varsapradaya now reports a different membership for this phone number. Check membership "
                       "again before importing.", code="MEMBER_MISMATCH",
                       details={"linked": farmer.member_id, "reported": record.member_id})
    by_id = {f.external_farm_id: f for f in record.farms}
    unknown = [x for x in wanted if x not in by_id]
    if unknown:
        raise ValidationFailed("Some of these farms aren't on this farmer's Varsapradaya account.",
                               code="UNKNOWN_MEMBER_FARM", details={"unknown": unknown})
    existing = _imported_farms(db, user, wanted)
    created, skipped = [], []
    for ext in wanted:
        hit = existing.get(ext)
        if hit is not None:
            skipped.append({
                "external_farm_id": ext, "farm_id": str(hit.id), "farmer_id": str(hit.farmer_id),
                "reason": "Already imported." if hit.farmer_id == farmer.id
                else "Already imported for another farmer in your organisation.",
            })
            continue
        src = by_id[ext]
        farm = Farm(org_id=user.org_id, created_by=user.id, farmer_id=farmer.id, name=src.name[:200],
                    village="", district="", state="", external_farm_id=ext,
                    postal_code=src.postal_code[:20] if src.postal_code else None, notes=_farm_notes(src))
        db.add(farm)
        audit(db, user, "farm.import_member", farm, reason=f"Imported from Varsapradaya ({record.source})")
        created.append({"id": str(farm.id), "name": farm.name, "external_farm_id": ext,
                        "postal_code": farm.postal_code, "notes": farm.notes})
    return {"farmer_id": str(farmer.id), "member_id": farmer.member_id, "created": created, "skipped": skipped,
            "fields_created": 0, "note": NO_FIELDS_NOTE}


# ------------------------------------------------------------------ farmer 360
def overview(db: Session, user: CurrentUser, farmer_id: str) -> dict[str, Any]:
    from app.modules.consent.service import current_state
    from app.modules.land.models import Enrolment, Farm, Field
    from app.modules.practices.models import PracticeRecord
    from app.modules.programmes.models import Project

    farmer = get_owned(db, Farmer, farmer_id, user, "Farmer")
    fpo = db.get(FPO, farmer.fpo_id) if farmer.fpo_id else None
    farms = db.scalars(scoped(Farm, user).where(Farm.farmer_id == farmer.id).order_by(Farm.name)).all()
    fields = db.scalars(
        scoped(Field, user).where(Field.farm_id.in_([f.id for f in farms])).order_by(Field.code)
    ).all() if farms else []
    by_farm: dict[uuid.UUID, list[Field]] = {}
    for fl in fields:
        by_farm.setdefault(fl.farm_id, []).append(fl)
    field_codes = {fl.id: fl.code for fl in fields}

    enrolments = db.execute(
        select(Enrolment, Project.code).join(Project, Project.id == Enrolment.project_id)
        .where(Enrolment.org_id == user.org_id, Enrolment.farmer_id == farmer.id)
        .order_by(Enrolment.created_at)
    ).all()

    practice_count = 0
    if fields:
        rows = db.execute(
            select(PracticeRecord.record_id, PracticeRecord.version, PracticeRecord.status)
            .where(PracticeRecord.org_id == user.org_id, PracticeRecord.field_id.in_(list(field_codes)))
        ).all()
        latest: dict[uuid.UUID, tuple[int, str]] = {}
        for rid, ver, st in rows:
            if rid not in latest or ver > latest[rid][0]:
                latest[rid] = (ver, st)
        practice_count = sum(1 for _, st in latest.values() if st == "active")

    return {
        "farmer": farmer,
        "fpo": fpo,
        "farms": [
            {"id": str(f.id), "name": f.name, "village": f.village, "external_farm_id": f.external_farm_id,
             "postal_code": f.postal_code,
             "fields": [{"id": str(fl.id), "code": fl.code, "name": fl.name, "area_ha": fl.area_ha,
                         "crop_code": fl.crop_code, "status": fl.status} for fl in by_farm.get(f.id, [])]}
            for f in farms
        ],
        "total_area_ha": round(sum(fl.area_ha for fl in fields if fl.status == "active"), 4),
        "enrolments": [
            {"id": str(e.id), "project_id": str(e.project_id), "project_code": code, "field_id": str(e.field_id),
             "field_code": field_codes.get(e.field_id, ""), "status": e.status, "enrolled_on": e.enrolled_on}
            for e, code in enrolments
        ],
        "consents": [{"purpose": c["purpose"], "state": c["state"], "effective_on": c["effective_on"]}
                     for c in current_state(db, user.org_id, farmer.id)],
        "practice_records": practice_count,
    }
