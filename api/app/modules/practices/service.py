"""Practice records: append-only and versioned. A correction or void is a new version."""

from __future__ import annotations

import uuid
from datetime import date
from typing import Any

from sqlalchemy import and_, func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.errors import IllegalTransition, NotFound, ValidationFailed
from app.core.events import emit
from app.core.tenancy import audit, get_owned, scoped
from app.modules.catalogue.models import PracticeType
from app.modules.catalogue.service import get_practice_type, validate_attributes
from app.modules.evidence.models import EvidenceFile
from app.modules.land.models import Enrolment, Farm, Field
from app.modules.practices.models import PracticeRecord

RESERVED_DETAIL_KEYS = ("client_ref",)
AREA_TOLERANCE = 1.001  # rounding slack when a practice covers the whole field


def _fail(message: str, **details: Any) -> ValidationFailed:
    return ValidationFailed(message, code="INVALID_PRACTICE", details=details)


def _evidence_ids(db: Session, user: CurrentUser, ids: list[str]) -> list[str]:
    bad: list[str] = []
    out: list[str] = []
    for raw in ids:
        try:
            ev = db.get(EvidenceFile, uuid.UUID(str(raw)))
        except ValueError:
            ev = None
        if ev is None or ev.org_id != user.org_id:
            bad.append(str(raw))
        elif str(ev.id) not in out:
            out.append(str(ev.id))
    if bad:
        raise _fail("Some attached files could not be found. Upload them again.", evidence_ids=bad)
    return out


def _validate(db: Session, user: CurrentUser, data: dict[str, Any], *, new_code: bool,
              new_field: bool) -> tuple[Field, PracticeType, dict[str, Any]]:
    """Check a full practice record. Returns the field, practice type and cleaned values."""
    f = get_owned(db, Field, data["field_id"], user, "Field")
    if new_field and f.status != "active":
        raise _fail("This field is retired, so new practices can't be recorded on it.")

    pt = get_practice_type(db, user.org_id, data["practice_code"])
    if pt is None or (new_code and not pt.is_active):
        raise _fail(f"'{data['practice_code']}' is not an active practice in your catalogue.",
                    practice_code=data["practice_code"])
    if pt.crop_codes and f.crop_code not in pt.crop_codes:
        raise _fail(f"{pt.name} only applies to {', '.join(pt.crop_codes)}; field {f.code} is "
                    f"{f.crop_code or 'not assigned a crop'}.", practice_code=pt.code)

    if data.get("scenario") not in ("baseline", "project"):
        raise _fail("Say whether this is a baseline or a project practice.")

    performed_on: date = data["performed_on"]
    if performed_on > date.today():
        raise _fail("The practice date can't be in the future.")
    ended_on: date | None = data.get("ended_on")
    if ended_on and ended_on < performed_on:
        raise _fail("The end date can't be before the start date.")

    quantity, unit = data.get("quantity"), data.get("unit")
    if pt.requires_quantity and quantity is None:
        raise _fail(f"{pt.name} needs a quantity in {pt.unit}.")
    if quantity is not None:
        if quantity < 0:
            raise _fail("The quantity can't be negative.")
        if pt.unit and unit and unit != pt.unit:
            raise _fail(f"{pt.name} is recorded in {pt.unit}, not {unit}.")
        unit = unit or pt.unit
    else:
        unit = None

    area = data.get("area_ha")
    if area is not None and (area <= 0 or area > f.area_ha * AREA_TOLERANCE):
        raise _fail(f"The practice area must be more than 0 and no more than the field's {f.area_ha} ha.")

    extra = dict(data.get("extra") or {})
    clash = [k for k in RESERVED_DETAIL_KEYS if k in extra]
    if clash:
        raise _fail(f"'{clash[0]}' can't be used as a practice detail.")
    errors = validate_attributes(pt.fields or [], extra)
    if errors:
        raise ValidationFailed(" ".join(errors), code="INVALID_ATTRIBUTES", details={"errors": errors})

    cleaned = {
        "field_id": f.id, "practice_code": pt.code, "scenario": data["scenario"], "performed_on": performed_on,
        "ended_on": ended_on, "quantity": quantity, "unit": unit, "area_ha": area, "extra": extra,
        "evidence_ids": _evidence_ids(db, user, data.get("evidence_ids") or []),
    }
    return f, pt, cleaned


def _row(user: CurrentUser, record_id: uuid.UUID, version: int, c: dict[str, Any], *, source: str,
         status: str, reason: str, client_ref: str | None) -> PracticeRecord:
    details = dict(c["extra"])
    if client_ref:
        details["client_ref"] = client_ref
    return PracticeRecord(
        org_id=user.org_id, created_by=user.id, record_id=record_id, version=version, field_id=c["field_id"],
        practice_code=c["practice_code"], scenario=c["scenario"], performed_on=c["performed_on"],
        ended_on=c["ended_on"], quantity=c["quantity"], unit=c["unit"], area_ha=c["area_ha"], details=details,
        evidence_ids=c["evidence_ids"], source=source, status=status, reason=reason,
    )


def _emit(db: Session, user: CurrentUser, rec: PracticeRecord) -> None:
    emit(db, user, "practice.recorded", rec, {
        "record_id": rec.record_id, "version": rec.version, "field_id": rec.field_id,
        "practice_code": rec.practice_code, "scenario": rec.scenario, "status": rec.status,
    })


# ------------------------------------------------------------------ reads
def latest(db: Session, user: CurrentUser, record_id: str | uuid.UUID) -> PracticeRecord:
    try:
        rid = record_id if isinstance(record_id, uuid.UUID) else uuid.UUID(str(record_id))
    except ValueError as exc:
        raise NotFound("Practice record not found.") from exc
    rec = db.scalar(scoped(PracticeRecord, user).where(PracticeRecord.record_id == rid)
                    .order_by(PracticeRecord.version.desc()).limit(1))
    if rec is None:
        raise NotFound("Practice record not found.")
    return rec


def versions(db: Session, user: CurrentUser, record_id: str) -> list[PracticeRecord]:
    rec = latest(db, user, record_id)
    return list(db.scalars(scoped(PracticeRecord, user).where(PracticeRecord.record_id == rec.record_id)
                           .order_by(PracticeRecord.version.desc())).all())


def find_by_client_ref(db: Session, user: CurrentUser, client_ref: str) -> PracticeRecord | None:
    first = db.scalar(scoped(PracticeRecord, user).where(
        PracticeRecord.version == 1, PracticeRecord.details["client_ref"].as_string() == client_ref).limit(1))
    return latest(db, user, first.record_id) if first else None


def list_latest(
    db: Session, user: CurrentUser, *, field_id: str | None = None, farmer_id: str | None = None,
    project_id: str | None = None, practice_code: str | None = None, scenario: str | None = None,
    date_from: date | None = None, date_to: date | None = None, include_voided: bool = False,
    limit: int = 50, offset: int = 0,
) -> tuple[list[PracticeRecord], int]:
    top = (select(PracticeRecord.record_id, func.max(PracticeRecord.version).label("v"))
           .where(PracticeRecord.org_id == user.org_id).group_by(PracticeRecord.record_id).subquery())
    stmt = scoped(PracticeRecord, user).join(
        top, and_(PracticeRecord.record_id == top.c.record_id, PracticeRecord.version == top.c.v))
    if field_id:
        stmt = stmt.where(PracticeRecord.field_id == get_owned(db, Field, field_id, user, "Field").id)
    if farmer_id:
        from app.modules.farmers.models import Farmer

        fid = get_owned(db, Farmer, farmer_id, user, "Farmer").id
        stmt = stmt.where(PracticeRecord.field_id.in_(
            select(Field.id).join(Farm, Farm.id == Field.farm_id).where(Farm.farmer_id == fid)))
    if project_id:
        from app.modules.programmes.models import Project

        pid = get_owned(db, Project, project_id, user, "Project").id
        stmt = stmt.where(PracticeRecord.field_id.in_(
            select(Enrolment.field_id).where(Enrolment.project_id == pid, Enrolment.status == "enrolled")))
    if practice_code:
        stmt = stmt.where(PracticeRecord.practice_code == practice_code)
    if scenario:
        stmt = stmt.where(PracticeRecord.scenario == scenario)
    if date_from:
        stmt = stmt.where(PracticeRecord.performed_on >= date_from)
    if date_to:
        stmt = stmt.where(PracticeRecord.performed_on <= date_to)
    if not include_voided:
        stmt = stmt.where(PracticeRecord.status == "active")
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    rows = db.scalars(stmt.order_by(PracticeRecord.performed_on.desc(), PracticeRecord.created_at.desc())
                      .limit(limit).offset(offset)).all()
    return list(rows), total


def evidence_requirements(db: Session, user: CurrentUser, codes: set[str]) -> dict[str, list[str]]:
    if not codes:
        return {}
    rows = db.scalars(scoped(PracticeType, user).where(PracticeType.code.in_(codes))).all()
    return {pt.code: list(pt.required_evidence or []) for pt in rows}


def missing_evidence(rec: PracticeRecord, requirements: dict[str, list[str]]) -> bool:
    return bool(requirements.get(rec.practice_code)) and not rec.evidence_ids


# ------------------------------------------------------------------ writes
def create(db: Session, user: CurrentUser, data: dict[str, Any],
           idempotency_key: str | None = None) -> tuple[PracticeRecord, bool]:
    """Record a practice. Returns ``(record, created)``; a repeated client reference returns the original."""
    body_ref = data.pop("client_ref", None)
    if idempotency_key and body_ref and idempotency_key != body_ref:
        raise ValidationFailed("The Idempotency-Key header and client_ref must match when both are sent.")
    client_ref = (idempotency_key or body_ref or "").strip() or None
    if client_ref:
        if len(client_ref) > 80:
            raise ValidationFailed("The idempotency key must be 80 characters or fewer.")
        existing = find_by_client_ref(db, user, client_ref)
        if existing:
            return existing, False

    _, _, cleaned = _validate(db, user, data, new_code=True, new_field=True)
    rec = _row(user, uuid.uuid4(), 1, cleaned, source=data.get("source", "field_app"), status="active",
               reason="Recorded", client_ref=client_ref)
    db.add(rec)
    audit(db, user, "practice.record", rec)
    _emit(db, user, rec)
    return rec, True


def _as_input(rec: PracticeRecord) -> dict[str, Any]:
    return {
        "field_id": str(rec.field_id), "practice_code": rec.practice_code, "scenario": rec.scenario,
        "performed_on": rec.performed_on, "ended_on": rec.ended_on, "quantity": rec.quantity, "unit": rec.unit,
        "area_ha": rec.area_ha, "evidence_ids": list(rec.evidence_ids or []),
        "extra": {k: v for k, v in (rec.details or {}).items() if k not in RESERVED_DETAIL_KEYS},
    }


def correct(db: Session, user: CurrentUser, record_id: str, changes: dict[str, Any]) -> PracticeRecord:
    prev = latest(db, user, record_id)
    if prev.status == "voided":
        raise IllegalTransition("This record has been voided and can't be corrected.")
    reason = changes.pop("reason").strip()
    if len(reason) < 5:
        raise ValidationFailed("Say why the record is being corrected (at least 5 characters).")
    for k in ("field_id", "practice_code", "scenario", "performed_on", "extra", "evidence_ids"):
        if k in changes and changes[k] is None:
            del changes[k]  # these can't be cleared, only changed
    current = _as_input(prev)
    merged = {**current, **changes}
    if merged == current:
        raise ValidationFailed("Nothing has changed. Edit at least one value to save a correction.")
    _, _, cleaned = _validate(db, user, merged, new_code=merged["practice_code"] != prev.practice_code,
                              new_field=merged["field_id"] != current["field_id"])
    rec = _row(user, prev.record_id, prev.version + 1, cleaned, source=prev.source, status="active",
               reason=reason, client_ref=(prev.details or {}).get("client_ref"))
    db.add(rec)
    audit(db, user, "practice.correct", rec, reason=reason)
    _emit(db, user, rec)
    return rec


def void(db: Session, user: CurrentUser, record_id: str, reason: str) -> PracticeRecord:
    prev = latest(db, user, record_id)
    if prev.status == "voided":
        raise IllegalTransition("This record has already been voided.")
    reason = reason.strip()
    if len(reason) < 5:
        raise ValidationFailed("Say why the record is being voided (at least 5 characters).")
    rec = PracticeRecord(
        org_id=user.org_id, created_by=user.id, record_id=prev.record_id, version=prev.version + 1,
        field_id=prev.field_id, practice_code=prev.practice_code, scenario=prev.scenario,
        performed_on=prev.performed_on, ended_on=prev.ended_on, quantity=prev.quantity, unit=prev.unit,
        area_ha=prev.area_ha, details=dict(prev.details or {}), evidence_ids=list(prev.evidence_ids or []),
        source=prev.source, status="voided", reason=reason,
    )
    db.add(rec)
    audit(db, user, "practice.void", rec, reason=reason)
    _emit(db, user, rec)
    return rec
