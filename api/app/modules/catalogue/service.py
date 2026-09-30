"""Crop and practice-type catalogue: per-organisation, configurable, any crop."""

from __future__ import annotations

import copy
import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.errors import Conflict, ValidationFailed
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.catalogue.defaults import DEFAULT_CROPS, DEFAULT_PRACTICES
from app.modules.catalogue.domain import validate_attributes, validate_schema
from app.modules.catalogue.models import Crop, PracticeType
from app.modules.catalogue.schemas import CropIn, CropPatch, PracticeTypeIn, PracticeTypePatch

__all__ = [
    "validate_attributes", "get_crop", "get_practice_type", "list_crops", "create_crop", "update_crop",
    "list_practice_types", "create_practice_type", "update_practice_type", "install_defaults",
]


# ------------------------------------------------------------------ lookups used by other modules
def get_crop(db: Session, org_id: uuid.UUID, code: str) -> Crop | None:
    return db.scalar(select(Crop).where(Crop.org_id == org_id, Crop.code == code))


def get_practice_type(db: Session, org_id: uuid.UUID, code: str) -> PracticeType | None:
    return db.scalar(select(PracticeType).where(PracticeType.org_id == org_id, PracticeType.code == code))


def require_active_crop(db: Session, org_id: uuid.UUID, code: str) -> Crop:
    crop = get_crop(db, org_id, code)
    if crop is None or not crop.is_active:
        raise ValidationFailed(f"'{code}' is not an active crop in your catalogue.", code="UNKNOWN_CROP",
                               details={"crop_code": code})
    return crop


def unknown_crop_codes(db: Session, org_id: uuid.UUID, codes: list[str]) -> list[str]:
    if not codes:
        return []
    known = set(db.scalars(select(Crop.code).where(Crop.org_id == org_id, Crop.code.in_(codes))).all())
    return sorted(set(codes) - known)


def _check_schema(defs: list[dict[str, Any]]) -> None:
    errors = validate_schema(defs)
    if errors:
        raise ValidationFailed(" ".join(errors), details={"errors": errors})


# ------------------------------------------------------------------ crops
def list_crops(db: Session, user: CurrentUser, include_inactive: bool = False) -> list[Crop]:
    q = scoped(Crop, user).order_by(Crop.name)
    if not include_inactive:
        q = q.where(Crop.is_active.is_(True))
    return list(db.scalars(q).all())


def create_crop(db: Session, user: CurrentUser, body: CropIn) -> Crop:
    if get_crop(db, user.org_id, body.code):
        raise Conflict(f"A crop with the code '{body.code}' already exists.", code="DUPLICATE_CODE")
    attrs = [a.model_dump(exclude_none=True) for a in body.attributes]
    _check_schema(attrs)
    crop = Crop(org_id=user.org_id, created_by=user.id, code=body.code, name=body.name,
                local_name=body.local_name, category=body.category, attributes=attrs)
    db.add(crop)
    audit(db, user, "crop.create", crop)
    return crop


def update_crop(db: Session, user: CurrentUser, crop_id: str, body: CropPatch) -> Crop:
    crop = get_owned(db, Crop, crop_id, user, "Crop")
    before = snapshot(crop)
    changes = body.model_dump(exclude_unset=True)
    if "attributes" in changes and body.attributes is not None:
        changes["attributes"] = [a.model_dump(exclude_none=True) for a in body.attributes]
        _check_schema(changes["attributes"])
    for k, v in changes.items():
        if v is not None or k == "local_name":
            setattr(crop, k, v)
    audit(db, user, "crop.update", crop, before=before)
    return crop


# ------------------------------------------------------------------ practice types
def list_practice_types(
    db: Session, user: CurrentUser, include_inactive: bool = False, crop_code: str | None = None
) -> list[PracticeType]:
    q = scoped(PracticeType, user).order_by(PracticeType.name)
    if not include_inactive:
        q = q.where(PracticeType.is_active.is_(True))
    rows = list(db.scalars(q).all())
    if crop_code:
        rows = [p for p in rows if not p.crop_codes or crop_code in p.crop_codes]
    return rows


def _check_crop_codes(db: Session, org_id: uuid.UUID, codes: list[str]) -> None:
    missing = unknown_crop_codes(db, org_id, codes)
    if missing:
        raise ValidationFailed(f"These crops are not in your catalogue: {', '.join(missing)}.",
                               code="UNKNOWN_CROP", details={"crop_codes": missing})


def create_practice_type(db: Session, user: CurrentUser, body: PracticeTypeIn) -> PracticeType:
    if get_practice_type(db, user.org_id, body.code):
        raise Conflict(f"A practice with the code '{body.code}' already exists.", code="DUPLICATE_CODE")
    _check_crop_codes(db, user.org_id, body.crop_codes)
    fields = [f.model_dump(exclude_none=True) for f in body.fields]
    _check_schema(fields)
    pt = PracticeType(
        org_id=user.org_id, created_by=user.id, code=body.code, name=body.name, category=body.category,
        description=body.description, crop_codes=sorted(set(body.crop_codes)), unit=body.unit,
        requires_quantity=body.requires_quantity, required_evidence=body.required_evidence, fields=fields,
        emission_factor_keys=body.emission_factor_keys,
    )
    db.add(pt)
    audit(db, user, "practice_type.create", pt)
    return pt


def update_practice_type(db: Session, user: CurrentUser, pt_id: str, body: PracticeTypePatch) -> PracticeType:
    pt = get_owned(db, PracticeType, pt_id, user, "Practice")
    before = snapshot(pt)
    changes = body.model_dump(exclude_unset=True)
    if changes.get("crop_codes") is not None:
        _check_crop_codes(db, user.org_id, changes["crop_codes"])
        changes["crop_codes"] = sorted(set(changes["crop_codes"]))
    if "fields" in changes and body.fields is not None:
        changes["fields"] = [f.model_dump(exclude_none=True) for f in body.fields]
        _check_schema(changes["fields"])
    for k, v in changes.items():
        if v is not None or k == "unit":
            setattr(pt, k, v)
    if pt.requires_quantity and not pt.unit:
        raise ValidationFailed("A practice that needs a quantity must say which unit it is measured in.")
    audit(db, user, "practice_type.update", pt, before=before)
    return pt


# ------------------------------------------------------------------ defaults
def install_defaults(db: Session, user: CurrentUser) -> dict[str, list[str]]:
    """Add any default crop or practice the organisation doesn't have yet. Safe to run repeatedly."""
    crops_added: list[str] = []
    for spec in DEFAULT_CROPS:
        if get_crop(db, user.org_id, spec["code"]) is None:
            crop = Crop(org_id=user.org_id, created_by=user.id, **copy.deepcopy(spec))
            db.add(crop)
            audit(db, user, "crop.create", crop, reason="Installed from defaults")
            crops_added.append(spec["code"])
    practices_added: list[str] = []
    for spec in DEFAULT_PRACTICES:
        if get_practice_type(db, user.org_id, spec["code"]) is None:
            data = {"crop_codes": [], "required_evidence": [], "fields": [], "emission_factor_keys": [],
                    "requires_quantity": False, "unit": None, **copy.deepcopy(spec)}
            pt = PracticeType(org_id=user.org_id, created_by=user.id, **data)
            db.add(pt)
            audit(db, user, "practice_type.create", pt, reason="Installed from defaults")
            practices_added.append(spec["code"])
    return {"crops_added": crops_added, "practice_types_added": practices_added}
