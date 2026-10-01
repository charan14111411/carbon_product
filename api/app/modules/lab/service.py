"""Laboratories, shipments (batches), results and their review, and spectral calibrations.

A result can be corrected while pending. Once reviewed (accepted / rejected / voided) its
measured fields are frozen; a correction is a new version that supersedes it.
"""

from __future__ import annotations

import csv
import io
import uuid
from collections import Counter, defaultdict
from datetime import date
from typing import Any

from pydantic import ValidationError as PydanticValidationError
from sqlalchemy import event, func, select
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import get_history

from app.core.auth import CurrentUser, ensure_not_author
from app.core.db import utcnow
from app.core.errors import (
    AppError, Blocked, Conflict, Forbidden, IllegalTransition, ImmutableRecord, NotFound, ValidationFailed,
)
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.identity.models import AuditEntry, User
from app.modules.lab.models import (
    ANALYTES, NOT_RECOMMENDED_METHODS, SPECTRO_METHODS, Lab, LabBatch, LabChange, LabResult, SpectralCalibration,
)
from app.modules.lab.schemas import (
    BatchIn, CalibrationIn, CalibrationPatch, LabChangeIn, LabIn, LabPatch, ResultIn, ResultPatch, SupersedeIn,
)
from app.modules.programmes.models import Project
from app.modules.sampling.models import Campaign, Sample, Site, SoilLayer

RANGES: dict[str, tuple[float, float]] = {
    "soc_pct": (0.0, 60.0),
    "bulk_density_g_cm3": (0.1, 2.65),
    "coarse_fraction": (0.0, 0.95),
    "ph": (0.0, 14.0),
    "texture_clay_pct": (0.0, 100.0),
    "fine_soil_mass_g": (0.0, 100_000.0),
    "texture_sand_pct": (0.0, 100.0),
    "inorganic_c_pct": (0.0, 20.0),
}
# canonical unit first; accepted spellings map to it
UNITS: dict[str, tuple[str, set[str]]] = {
    "soc_pct": ("%", {"%", "pct", "percent", "% w/w"}),
    "bulk_density_g_cm3": ("g/cm3", {"g/cm3", "g/cm³", "g cm-3", "g/cc", "mg/m3", "t/m3"}),
    "coarse_fraction": ("fraction", {"fraction", "g/g", "ratio", "0-1"}),
    "ph": ("pH", {"ph", "", "unitless", "-"}),
    "texture_clay_pct": ("%", {"%", "pct", "percent"}),
    "fine_soil_mass_g": ("g", {"g", "grams", "gram"}),
    "texture_sand_pct": ("%", {"%", "pct", "percent"}),
    "inorganic_c_pct": ("%", {"%", "pct", "percent", "% w/w"}),
}
METHOD_RULE = {"soc_pct": "permitted_soc_methods", "bulk_density_g_cm3": "permitted_bd_methods"}
MIR = "mir_spectroscopy"
DRY_COMBUSTION = "dry_combustion"
REF_METHODS = "VM0042 v2.2 §8.2.1.4 p.35"
REF_LAB = "VM0042 v2.2 §8.2.1.4 p.35-36"
REF_SPECTRO = "VM0042 v2.2 §8.6.2.1 Eq. 73 p.78 and Appendix 4 p.152-157"
MIN_PEER_REVIEWED_REFS = 3  # Appendix 4: technology proven in at least three peer-reviewed articles
LIVE = ("pending", "accepted")
FROZEN_FIELDS = ("layer_id", "lab_id", "analyte", "value", "unit", "method", "analysed_on", "uncertainty",
                 "certificate_id", "calibration_id", "version", "supersedes_id", "detection_limit",
                 "below_detection_limit", "method_justification", "purpose")
CSV_COLUMNS = ("bag_code", "analyte", "value", "unit", "method", "analysed_on")
CSV_OPTIONAL = ("uncertainty", "detection_limit", "method_justification", "purpose")


# ------------------------------------------------------------------ frozen results guard
@event.listens_for(Session, "before_flush")
def _refuse_frozen_result_change(session: Session, _ctx, _instances) -> None:
    for obj in session.dirty:
        if not isinstance(obj, LabResult):
            continue
        status_hist = get_history(obj, "status")
        committed_status = status_hist.deleted[0] if status_hist.deleted else obj.status
        if committed_status == "pending":
            continue
        changed = [f for f in FROZEN_FIELDS if get_history(obj, f).has_changes()]
        if changed:
            raise ImmutableRecord(
                "This lab result has been reviewed and its values are frozen. Supersede it with a new version.",
                code="RESULT_FROZEN", details={"fields": changed},
            )


# ------------------------------------------------------------------ helpers
def _uuid(value: Any, what: str) -> uuid.UUID:
    if isinstance(value, uuid.UUID):
        return value
    try:
        return uuid.UUID(str(value))
    except (TypeError, ValueError) as exc:
        raise NotFound(f"{what} not found.") from exc


def _names(db: Session, org_id: uuid.UUID, ids: set) -> dict:
    wanted = {i for i in ids if i is not None}
    if not wanted:
        return {}
    return {r[0]: r[1] for r in db.execute(
        select(User.id, User.full_name).where(User.org_id == org_id, User.id.in_(wanted))).all()}


def _editors(db: Session, org_id: uuid.UUID, entity_type: str, entity_id: uuid.UUID) -> set[uuid.UUID]:
    rows = db.scalars(select(AuditEntry.created_by).where(
        AuditEntry.org_id == org_id, AuditEntry.entity_type == entity_type, AuditEntry.entity_id == str(entity_id)))
    return {r for r in rows if r is not None}


def lab_scope(user: CurrentUser) -> uuid.UUID | None:
    raw = (user.scope or {}).get("lab_id")
    if not raw:
        return None
    try:
        return uuid.UUID(str(raw))
    except ValueError:
        return None


def sees_nothing(user: CurrentUser) -> bool:
    """A lab technician must be tied to one lab. Without that scope they see nothing (fail closed)."""
    return user.role == "lab_technician" and lab_scope(user) is None


def _check_visible_lab(user: CurrentUser, lab_id: uuid.UUID, what: str) -> None:
    if sees_nothing(user):
        raise NotFound(f"{what} not found.")
    scope = lab_scope(user)
    if scope is not None and scope != lab_id:
        raise NotFound(f"{what} not found.")


def _layer_chain(db: Session, layer: SoilLayer) -> tuple[Sample, Campaign, Project]:
    sample = db.get(Sample, layer.sample_id)
    campaign = db.get(Campaign, sample.campaign_id)
    return sample, campaign, db.get(Project, campaign.project_id)


def _batches_with_layer(db: Session, org_id: uuid.UUID, layer_id: uuid.UUID) -> list[LabBatch]:
    rows = db.scalars(select(LabBatch).where(LabBatch.org_id == org_id))
    return [b for b in rows if str(layer_id) in (b.layer_ids or [])]


# ------------------------------------------------------------------ labs
def lab_out(lab: Lab) -> dict:
    return {
        "id": str(lab.id), "code": lab.code, "name": lab.name, "accreditation": lab.accreditation,
        "accreditation_valid_until": lab.accreditation_valid_until.isoformat()
        if lab.accreditation_valid_until else None,
        "accreditation_current": bool(lab.accreditation_valid_until and lab.accreditation_valid_until >= date.today()),
        "city": lab.city, "contact_email": lab.contact_email,
        "iso17025": lab.iso17025, "proficiency_program": lab.proficiency_program,
        "analytical_error_report_id": str(lab.analytical_error_report_id) if lab.analytical_error_report_id else None,
        "qc_evidence_missing": lab_qc_gaps(lab),
    }


def lab_qc_gaps(lab: Lab) -> list[str]:
    """What the lab has not yet shown under VM0042 v2.2 §8.2.1.4 (empty = all shown)."""
    gaps = []
    if lab.iso17025 is not True:
        gaps.append("iso17025")
    if lab.proficiency_program in (None, "none"):
        gaps.append("proficiency_program")
    if lab.analytical_error_report_id is None:
        gaps.append("analytical_error_report")
    return gaps


def _evidence_id(db: Session, user: CurrentUser, raw: str | None) -> uuid.UUID | None:
    from app.modules.evidence.models import EvidenceFile

    if not raw:
        return None
    return get_owned(db, EvidenceFile, raw, user, "Evidence file").id


def create_lab(db: Session, user: CurrentUser, body: LabIn) -> Lab:
    if db.scalar(select(Lab.id).where(Lab.org_id == user.org_id, Lab.code == body.code)):
        raise Conflict(f"A lab with code {body.code} already exists.", code="DUPLICATE_CODE")
    data = body.model_dump()
    data["analytical_error_report_id"] = _evidence_id(db, user, data.get("analytical_error_report_id"))
    lab = Lab(org_id=user.org_id, created_by=user.id, **data)
    db.add(lab)
    audit(db, user, "lab.create", lab)
    return lab


def list_labs(db: Session, user: CurrentUser) -> list[Lab]:
    if sees_nothing(user):
        return []
    q = scoped(Lab, user).order_by(Lab.name)
    scope = lab_scope(user)
    if scope is not None:
        q = q.where(Lab.id == scope)
    return list(db.scalars(q))


def get_lab(db: Session, user: CurrentUser, lab_id: str) -> Lab:
    lab = get_owned(db, Lab, lab_id, user, "Lab")
    _check_visible_lab(user, lab.id, "Lab")
    return lab


def update_lab(db: Session, user: CurrentUser, lab: Lab, body: LabPatch) -> Lab:
    before = snapshot(lab)
    for k, v in body.model_dump(exclude_unset=True).items():
        if k in ("name", "city") and v is None:
            continue
        if k == "analytical_error_report_id":
            v = _evidence_id(db, user, v)
        setattr(lab, k, v)
    audit(db, user, "lab.update", lab, before=before)
    return lab


def delete_lab(db: Session, user: CurrentUser, lab: Lab) -> None:
    used = db.scalar(select(func.count()).select_from(LabBatch).where(LabBatch.lab_id == lab.id)) or 0
    used += db.scalar(select(func.count()).select_from(LabResult).where(LabResult.lab_id == lab.id)) or 0
    if used:
        raise Conflict("This lab has batches or results and can't be deleted.", code="LAB_IN_USE")
    audit(db, user, "lab.delete", lab, before=snapshot(lab))
    db.delete(lab)
    db.flush()


# ------------------------------------------------------------------ batches
def create_batch(db: Session, user: CurrentUser, body: BatchIn) -> LabBatch:
    lab = get_owned(db, Lab, body.lab_id, user, "Lab")
    campaign = get_owned(db, Campaign, body.campaign_id, user, "Campaign")
    ids = list(dict.fromkeys(_uuid(x, "Layer") for x in body.layer_ids))
    rows = db.execute(select(SoilLayer, Sample).join(Sample, Sample.id == SoilLayer.sample_id).where(
        SoilLayer.org_id == user.org_id, SoilLayer.id.in_(ids))).all()
    found = {lay.id: s for lay, s in rows}
    missing = [str(i) for i in ids if i not in found]
    if missing:
        raise NotFound("Some layers were not found.", details={"layer_ids": missing})
    wrong = [str(i) for i, s in found.items() if s.campaign_id != campaign.id]
    if wrong:
        raise ValidationFailed("Every layer in a batch must come from the batch's campaign.",
                               code="LAYER_WRONG_CAMPAIGN", details={"layer_ids": wrong})
    taken: dict[str, str] = {}
    for b in db.scalars(select(LabBatch).where(LabBatch.org_id == user.org_id)):
        for lid in b.layer_ids or []:
            taken[lid] = b.code
    clash = {str(i): taken[str(i)] for i in ids if str(i) in taken}
    if clash:
        raise Conflict("Some layers are already in another batch.", code="LAYER_IN_BATCH", details={"layers": clash})
    n = (db.scalar(select(func.count()).select_from(LabBatch).where(LabBatch.org_id == user.org_id,
                                                                     LabBatch.campaign_id == campaign.id)) or 0) + 1
    code = f"LB-{campaign.code}-{n:02d}"
    while db.scalar(select(LabBatch.id).where(LabBatch.org_id == user.org_id, LabBatch.code == code)):
        n += 1
        code = f"LB-{campaign.code}-{n:02d}"
    batch = LabBatch(org_id=user.org_id, created_by=user.id, lab_id=lab.id, campaign_id=campaign.id, code=code,
                     layer_ids=[str(i) for i in ids], status="open")
    db.add(batch)
    audit(db, user, "lab_batch.create", batch)
    return batch


def dispatch_batch(db: Session, user: CurrentUser, batch: LabBatch, on: date | None) -> LabBatch:
    if batch.status != "open":
        raise IllegalTransition(f"Only an open batch can be dispatched (this one is {batch.status}).")
    before = snapshot(batch)
    batch.status = "dispatched"
    batch.dispatched_on = on or date.today()
    audit(db, user, "lab_batch.dispatch", batch, before=before)
    return batch


def list_batches(db: Session, user: CurrentUser, *, campaign_id: str | None = None) -> list[LabBatch]:
    if sees_nothing(user):
        return []
    q = scoped(LabBatch, user).order_by(LabBatch.created_at)
    if lab_scope(user) is not None:
        q = q.where(LabBatch.lab_id == lab_scope(user))
    if campaign_id:
        q = q.where(LabBatch.campaign_id == _uuid(campaign_id, "Campaign"))
    return list(db.scalars(q))


def get_batch(db: Session, user: CurrentUser, batch_id: str) -> LabBatch:
    b = get_owned(db, LabBatch, batch_id, user, "Batch")
    _check_visible_lab(user, b.lab_id, "Batch")
    return b


def batch_out(db: Session, b: LabBatch, *, manifest: bool = False) -> dict:
    lab = db.get(Lab, b.lab_id)
    camp = db.get(Campaign, b.campaign_id)
    out = {
        "id": str(b.id), "code": b.code, "lab_id": str(b.lab_id), "lab_name": lab.name if lab else None,
        "campaign_id": str(b.campaign_id), "campaign_code": camp.code if camp else None, "status": b.status,
        "dispatched_on": b.dispatched_on.isoformat() if b.dispatched_on else None,
        "bag_count": len(b.layer_ids or []),
    }
    if manifest:
        ids = [uuid.UUID(x) for x in b.layer_ids or []]
        rows = db.execute(select(SoilLayer, Sample, Site).join(Sample, Sample.id == SoilLayer.sample_id)
                          .join(Site, Site.id == Sample.site_id).where(SoilLayer.id.in_(ids))
                          .order_by(SoilLayer.code)).all() if ids else []
        out["manifest"] = [
            {"layer_id": str(lay.id), "bag_code": lay.code, "label_qr": lay.label_qr,
             "depth_from_cm": lay.depth_from_cm, "depth_to_cm": lay.depth_to_cm, "sample_code": s.code,
             "site_code": site.code, "collected_at": s.collected_at.isoformat()}
            for lay, s, site in rows
        ]
    return out


# ------------------------------------------------------------------ results: validation
def _canonical_unit(analyte: str, unit: str) -> str:
    canonical, accepted = UNITS[analyte]
    if unit.strip().lower() not in {u.lower() for u in accepted} and unit.strip() != canonical:
        raise ValidationFailed(
            f"{analyte} must be reported in {canonical}.", code="UNIT_MISMATCH",
            details={"unit": unit, "expected": canonical},
        )
    return canonical


def _check_calibration(db: Session, user: CurrentUser, analyte: str, value: float, method: str,
                       calibration_id: str | uuid.UUID | None) -> uuid.UUID | None:
    if method not in SPECTRO_METHODS:
        if calibration_id:
            raise ValidationFailed("A calibration only applies to spectroscopy (proximal sensing) results.",
                                   code="CALIBRATION_NOT_APPLICABLE")
        return None
    if not calibration_id:
        raise ValidationFailed("Spectroscopy (proximal sensing) results need an approved calibration.",
                               code="CALIBRATION_REQUIRED", details={"reference": REF_SPECTRO})
    cal = get_owned(db, SpectralCalibration, calibration_id, user, "Calibration")
    if cal.status != "approved":
        raise ValidationFailed("This calibration is not approved.", code="CALIBRATION_NOT_APPROVED")
    if cal.analyte != analyte:
        raise ValidationFailed(f"This calibration is for {cal.analyte}, not {analyte}.",
                               code="CALIBRATION_WRONG_ANALYTE")
    lo, hi = (cal.valid_range or {}).get("min"), (cal.valid_range or {}).get("max")
    if lo is None or hi is None:
        raise ValidationFailed("The calibration has no valid range.", code="CALIBRATION_RANGE_MISSING")
    if not lo <= value <= hi:
        raise ValidationFailed(
            f"{value:g} is outside the calibration's valid range ({lo:g}–{hi:g}).", code="OUTSIDE_CALIBRATION_RANGE",
            details={"min": lo, "max": hi},
        )
    return cal.id


def _validate(
    db: Session, user: CurrentUser, *, layer: SoilLayer, analyte: str, value: float, unit: str, method: str,
    analysed_on: date, calibration_id: Any, exclude_id: uuid.UUID | None = None,
    method_justification: str | None = None, purpose: str = "primary",
) -> tuple[str, uuid.UUID | None]:
    if analyte not in ANALYTES:
        raise ValidationFailed(f"Unknown analyte “{analyte}”.", code="UNKNOWN_ANALYTE",
                               details={"allowed": list(ANALYTES)})
    lo, hi = RANGES[analyte]
    if not lo <= value <= hi:
        raise ValidationFailed(f"{analyte} must be between {lo:g} and {hi:g} (got {value:g}).",
                               code="VALUE_OUT_OF_RANGE", details={"min": lo, "max": hi})
    canonical = _canonical_unit(analyte, unit)
    sample = db.get(Sample, layer.sample_id)
    collected_on = sample.collected_at.date()
    if analysed_on < collected_on:
        raise ValidationFailed(
            f"The analysis date {analysed_on.isoformat()} is before the sample was collected "
            f"({collected_on.isoformat()}).", code="ANALYSIS_BEFORE_COLLECTION",
        )
    if analysed_on > date.today():
        raise ValidationFailed("The analysis date is in the future.", code="ANALYSIS_IN_FUTURE")
    if method in NOT_RECOMMENDED_METHODS and len((method_justification or "").strip()) < 20:
        raise ValidationFailed(
            f"“{method}” is not recommended by VM0042 and may only be used where no other method is available. "
            "Explain why (at least 20 characters).", code="METHOD_JUSTIFICATION_REQUIRED",
            details={"method": method, "reference": REF_METHODS},
        )
    if purpose == "spectroscopy_check" and (analyte != "soc_pct" or method != DRY_COMBUSTION):
        raise ValidationFailed("A spectroscopy check must be a dry-combustion SOC result.",
                               code="INVALID_SPECTROSCOPY_CHECK", details={"reference": REF_SPECTRO})
    cal = _check_calibration(db, user, analyte, value, method, calibration_id)
    q = select(LabResult.id).where(LabResult.layer_id == layer.id, LabResult.analyte == analyte,
                                   LabResult.status.in_(LIVE), LabResult.purpose == purpose)
    if exclude_id is not None:
        q = q.where(LabResult.id != exclude_id)
    if db.scalar(q):
        raise Conflict(
            f"Layer {layer.code} already has a {analyte} result. Supersede it instead of adding another.",
            code="RESULT_EXISTS",
        )
    return canonical, cal


def _resolve_lab(db: Session, user: CurrentUser, layer: SoilLayer, lab_id: str | None) -> uuid.UUID:
    if sees_nothing(user):
        raise Forbidden("Your account is not linked to a lab. Ask an administrator to set your lab.",
                        code="NO_LAB_SCOPE")
    scope = lab_scope(user)
    batches = _batches_with_layer(db, user.org_id, layer.id)
    if scope is not None:
        if not any(b.lab_id == scope for b in batches):
            raise NotFound("This bag was not sent to your lab.")
        return scope
    if lab_id:
        return get_owned(db, Lab, lab_id, user, "Lab").id
    if batches:
        return batches[0].lab_id
    raise ValidationFailed("Say which lab produced this result.", code="LAB_REQUIRED")


def _layer(db: Session, user: CurrentUser, layer_id: str) -> SoilLayer:
    return get_owned(db, SoilLayer, layer_id, user, "Layer")


# ------------------------------------------------------------------ results: write
def create_result(db: Session, user: CurrentUser, body: ResultIn) -> LabResult:
    layer = _layer(db, user, body.layer_id)
    lab_id = _resolve_lab(db, user, layer, body.lab_id)
    unit, cal = _validate(db, user, layer=layer, analyte=body.analyte, value=body.value, unit=body.unit,
                          method=body.method, analysed_on=body.analysed_on, calibration_id=body.calibration_id,
                          method_justification=body.method_justification, purpose=body.purpose)
    r = LabResult(
        org_id=user.org_id, created_by=user.id, layer_id=layer.id, lab_id=lab_id, analyte=body.analyte,
        value=body.value, unit=unit, method=body.method, analysed_on=body.analysed_on,
        uncertainty=body.uncertainty, status="pending", version=1, calibration_id=cal,
        detection_limit=body.detection_limit, below_detection_limit=_below(body.value, body.detection_limit),
        method_justification=(body.method_justification or None), purpose=body.purpose,
    )
    db.add(r)
    audit(db, user, "lab_result.create", r)
    return r


def _below(value: float, detection_limit: float | None) -> bool:
    return detection_limit is not None and value < detection_limit


def get_result(db: Session, user: CurrentUser, result_id: str) -> LabResult:
    r = get_owned(db, LabResult, result_id, user, "Result")
    _check_visible_lab(user, r.lab_id, "Result")
    return r


def update_result(db: Session, user: CurrentUser, r: LabResult, body: ResultPatch) -> LabResult:
    if r.status != "pending":
        raise ImmutableRecord("Only a pending result can be edited. Supersede it instead.", code="RESULT_FROZEN")
    data = body.model_dump(exclude_unset=True)
    value = data.get("value", r.value)
    method = data.get("method", r.method)
    unit = data.get("unit", r.unit)
    analysed_on = data.get("analysed_on", r.analysed_on)
    calibration = data.get("calibration_id", r.calibration_id)
    dl = data.get("detection_limit", r.detection_limit)
    justification = data.get("method_justification", r.method_justification)
    layer = db.get(SoilLayer, r.layer_id)
    canonical, cal = _validate(db, user, layer=layer, analyte=r.analyte, value=value, unit=unit, method=method,
                               analysed_on=analysed_on, calibration_id=calibration, exclude_id=r.id,
                               method_justification=justification, purpose=r.purpose)
    before = snapshot(r)
    r.value, r.unit, r.method, r.analysed_on, r.calibration_id = value, canonical, method, analysed_on, cal
    r.detection_limit, r.below_detection_limit = dl, _below(value, dl)
    r.method_justification = justification or None
    if "uncertainty" in data:
        r.uncertainty = data["uncertainty"]
    audit(db, user, "lab_result.update", r, before=before)
    return r


def attach_certificate(db: Session, user: CurrentUser, r: LabResult, *, data: bytes, filename: str,
                       mime_type: str) -> LabResult:
    from app.modules.evidence import service as evidence

    if r.status != "pending":
        raise ImmutableRecord("A certificate can only be attached while the result is pending.",
                              code="RESULT_FROZEN")
    if mime_type != "application/pdf" or not data.startswith(b"%PDF"):
        raise ValidationFailed("The certificate must be a PDF file.", code="NOT_A_PDF")
    ev = evidence.store(db, user, data=data, filename=filename, mime_type="application/pdf", kind="certificate",
                        entity_type="lab_result", entity_id=str(r.id))
    before = snapshot(r)
    r.certificate_id = ev.id
    audit(db, user, "lab_result.certificate", r, before=before)
    return r


def accept(db: Session, user: CurrentUser, r: LabResult, note: str | None) -> LabResult:
    from app.modules.methodology import ruleset

    if r.status != "pending":
        raise IllegalTransition(f"Only a pending result can be accepted (this one is {r.status}).")
    ensure_not_author(user.id, r.created_by, *_editors(db, user.org_id, "LabResult", r.id), what="a lab result")
    if r.certificate_id is None:
        raise Blocked("Attach the lab certificate before accepting this result.", code="CERTIFICATE_MISSING")
    layer = db.get(SoilLayer, r.layer_id)
    _sample, _campaign, project = _layer_chain(db, layer)
    key = METHOD_RULE.get(r.analyte)
    if key is not None:
        rs = ruleset.for_project(db, project, require_approved=True)
        permitted = rs.require(key)
        if r.method not in permitted:
            raise Blocked(
                f"The methodology doesn't permit “{r.method}” for {r.analyte}. Permitted: {', '.join(permitted)}.",
                code="METHOD_NOT_PERMITTED", details={"method": r.method, "permitted": list(permitted)},
            )
    if r.method in SPECTRO_METHODS:
        _check_calibration(db, user, r.analyte, r.value, r.method, r.calibration_id)
    before = snapshot(r)
    r.status = "accepted"
    r.reviewed_by = user.id
    r.reviewed_at = utcnow()
    r.review_note = note or ""
    audit(db, user, "lab_result.accept", r, before=before, reason=note)
    return r


def reject(db: Session, user: CurrentUser, r: LabResult, note: str) -> LabResult:
    if r.status != "pending":
        raise IllegalTransition(f"Only a pending result can be rejected (this one is {r.status}).")
    before = snapshot(r)
    r.status, r.reviewed_by, r.reviewed_at, r.review_note = "rejected", user.id, utcnow(), note
    audit(db, user, "lab_result.reject", r, before=before, reason=note)
    return r


def void(db: Session, user: CurrentUser, r: LabResult, note: str) -> LabResult:
    if r.status != "accepted":
        raise IllegalTransition(f"Only an accepted result can be voided (this one is {r.status}).")
    before = snapshot(r)
    r.status, r.reviewed_by, r.reviewed_at, r.review_note = "voided", user.id, utcnow(), note
    audit(db, user, "lab_result.void", r, before=before, reason=note)
    return r


def supersede(db: Session, user: CurrentUser, r: LabResult, body: SupersedeIn) -> LabResult:
    from app.core.permissions import P

    if r.status == "voided":
        raise IllegalTransition("This result is already voided; supersede its latest version instead.")
    if r.status == "accepted" and not user.can(P.REVIEW_LAB):
        raise Forbidden("Only a lab reviewer can supersede an accepted result.",
                        details={"needs": [P.REVIEW_LAB.value]})
    layer = db.get(SoilLayer, r.layer_id)
    unit, cal = _validate(db, user, layer=layer, analyte=r.analyte, value=body.value, unit=body.unit or r.unit,
                          method=body.method, analysed_on=body.analysed_on, calibration_id=body.calibration_id,
                          exclude_id=r.id, method_justification=body.method_justification, purpose=r.purpose)
    before = snapshot(r)
    r.status = "voided"
    r.reviewed_by = user.id
    r.reviewed_at = utcnow()
    r.review_note = f"Superseded: {body.reason}"
    audit(db, user, "lab_result.void", r, before=before, reason=body.reason)
    db.flush()
    new = LabResult(
        org_id=user.org_id, created_by=user.id, layer_id=r.layer_id, lab_id=r.lab_id, analyte=r.analyte,
        value=body.value, unit=unit, method=body.method, analysed_on=body.analysed_on,
        uncertainty=body.uncertainty if body.uncertainty is not None else None, status="pending",
        version=r.version + 1, supersedes_id=r.id, calibration_id=cal, detection_limit=body.detection_limit,
        below_detection_limit=_below(body.value, body.detection_limit),
        method_justification=body.method_justification or None, purpose=r.purpose,
    )
    db.add(new)
    audit(db, user, "lab_result.supersede", new, reason=body.reason)
    return new


# ------------------------------------------------------------------ CSV import
def _find_bag(db: Session, user: CurrentUser, code: str) -> SoilLayer:
    layer = db.scalar(scoped(SoilLayer, user).where((SoilLayer.label_qr == code) | (SoilLayer.code == code)))
    if layer is None:
        raise NotFound(f"No bag with code {code}.")
    return layer


def import_csv(db: Session, user: CurrentUser, *, data: bytes, filename: str, lab_id: str | None) -> dict:
    from app.modules.evidence import service as evidence

    if sees_nothing(user):
        raise Forbidden("Your account is not linked to a lab. Ask an administrator to set your lab.",
                        code="NO_LAB_SCOPE")
    try:
        text = data.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise ValidationFailed("The file must be UTF-8 text (CSV).", code="INVALID_CSV") from exc
    reader = csv.DictReader(io.StringIO(text))
    header = [h.strip().lower() for h in (reader.fieldnames or [])]
    missing = [c for c in CSV_COLUMNS if c not in header]
    if missing:
        raise ValidationFailed("The CSV is missing required columns.", code="INVALID_CSV",
                               details={"missing": missing, "expected": [*CSV_COLUMNS, *CSV_OPTIONAL]})
    ev = evidence.store(db, user, data=data, filename=filename or "lab-results.csv", mime_type="text/csv",
                        kind="document", entity_type="lab_import")
    rows_out: list[dict] = []
    for i, raw in enumerate(reader, start=2):  # row 1 is the header
        row = {(k or "").strip().lower(): (v or "").strip() for k, v in raw.items() if k is not None}
        try:
            try:
                value = float(row["value"])
            except ValueError as exc:
                raise ValidationFailed(f"“{row['value']}” is not a number.") from exc
            try:
                analysed_on = date.fromisoformat(row["analysed_on"])
            except ValueError as exc:
                raise ValidationFailed(f"“{row['analysed_on']}” is not a date (use YYYY-MM-DD).") from exc
            nums: dict[str, float | None] = {}
            for col in ("uncertainty", "detection_limit"):
                nums[col] = None
                if row.get(col):
                    try:
                        nums[col] = float(row[col])
                    except ValueError as exc:
                        raise ValidationFailed(f"“{row[col]}” is not a number.") from exc
            body = ResultIn(
                layer_id=str(_find_bag(db, user, row["bag_code"]).id), analyte=row["analyte"], value=value,
                unit=row["unit"] or "-", method=row["method"], analysed_on=analysed_on,
                uncertainty=nums["uncertainty"], detection_limit=nums["detection_limit"],
                method_justification=row.get("method_justification") or None,
                purpose=row.get("purpose") or "primary", lab_id=lab_id,
            )
            r = create_result(db, user, body)
            db.flush()
            rows_out.append({"row": i, "status": "created", "message": "Created", "result_id": str(r.id),
                             "bag_code": row["bag_code"], "analyte": row["analyte"]})
        except AppError as exc:
            rows_out.append({"row": i, "status": "error", "message": exc.message, "code": exc.code,
                             "bag_code": row.get("bag_code"), "analyte": row.get("analyte")})
        except PydanticValidationError as exc:
            problems = "; ".join(f"{'.'.join(str(p) for p in e['loc'])}: {e['msg']}" for e in exc.errors())
            rows_out.append({"row": i, "status": "error", "message": f"This row could not be read ({problems}).",
                             "bag_code": row.get("bag_code"), "analyte": row.get("analyte")})
    created = sum(1 for r in rows_out if r["status"] == "created")
    return {"file_id": str(ev.id), "sha256": ev.sha256, "rows": rows_out, "created": created,
            "errors": len(rows_out) - created}


# ------------------------------------------------------------------ results: read
def result_out(db: Session, r: LabResult, nm: dict | None = None) -> dict:
    layer = db.get(SoilLayer, r.layer_id)
    return {
        "id": str(r.id), "layer_id": str(r.layer_id), "bag_code": layer.code if layer else None,
        "label_qr": layer.label_qr if layer else None, "lab_id": str(r.lab_id), "analyte": r.analyte,
        "value": r.value, "unit": r.unit, "method": r.method, "analysed_on": r.analysed_on.isoformat(),
        "uncertainty": r.uncertainty, "certificate_id": str(r.certificate_id) if r.certificate_id else None,
        "status": r.status, "version": r.version, "supersedes_id": str(r.supersedes_id) if r.supersedes_id else None,
        "calibration_id": str(r.calibration_id) if r.calibration_id else None,
        "reviewed_by": (nm or {}).get(r.reviewed_by), "reviewed_at": r.reviewed_at.isoformat() if r.reviewed_at else None,
        "review_note": r.review_note, "entered_by": (nm or {}).get(r.created_by),
        "detection_limit": r.detection_limit, "below_detection_limit": bool(r.below_detection_limit),
        "method_justification": r.method_justification, "method_recommended": r.method not in NOT_RECOMMENDED_METHODS,
        "purpose": r.purpose or "primary",
        "data_class": "MODELLED" if r.method in SPECTRO_METHODS else "MEASURED",
    }


def list_results(
    db: Session, user: CurrentUser, *, campaign_id: str | None, status: str | None, analyte: str | None,
    lab_id: str | None, page: int, page_size: int,
) -> dict:
    if sees_nothing(user):
        return {"items": [], "total": 0, "page": page, "page_size": page_size}
    q = scoped(LabResult, user)
    scope = lab_scope(user)
    if scope is not None:
        q = q.where(LabResult.lab_id == scope)
    if lab_id:
        q = q.where(LabResult.lab_id == _uuid(lab_id, "Lab"))
    if status:
        q = q.where(LabResult.status == status)
    if analyte:
        q = q.where(LabResult.analyte == analyte)
    if campaign_id:
        cid = _uuid(campaign_id, "Campaign")
        q = q.join(SoilLayer, SoilLayer.id == LabResult.layer_id).join(Sample, Sample.id == SoilLayer.sample_id) \
            .where(Sample.campaign_id == cid)
    total = db.scalar(select(func.count()).select_from(q.subquery())) or 0
    rows = list(db.scalars(q.order_by(LabResult.created_at, LabResult.id).offset((page - 1) * page_size)
                           .limit(page_size)))
    nm = _names(db, user.org_id, {r.created_by for r in rows} | {r.reviewed_by for r in rows})
    return {"items": [result_out(db, r, nm) for r in rows], "total": total, "page": page, "page_size": page_size}


def lab_progress(db: Session, user: CurrentUser, campaign: Campaign) -> dict:
    layers = list(db.scalars(select(SoilLayer).join(Sample, Sample.id == SoilLayer.sample_id).where(
        Sample.org_id == user.org_id, Sample.campaign_id == campaign.id).order_by(SoilLayer.code)))
    status: dict[uuid.UUID, dict[str, str]] = defaultdict(dict)
    if layers:
        for r in db.scalars(select(LabResult).where(LabResult.layer_id.in_([lay.id for lay in layers]),
                                                    LabResult.status.in_(LIVE), LabResult.purpose == "primary")):
            status[r.layer_id][r.analyte] = r.status
    summary = {a: Counter() for a in ANALYTES}
    matrix = []
    for lay in layers:
        cells = {a: status[lay.id].get(a, "missing") for a in ANALYTES}
        for a, s in cells.items():
            summary[a][s] += 1
        matrix.append({"layer_id": str(lay.id), "bag_code": lay.code, **cells})
    return {
        "campaign_id": str(campaign.id), "layers_total": len(layers),
        "analytes": {a: {k: summary[a].get(k, 0) for k in ("accepted", "pending", "missing")} for a in ANALYTES},
        "matrix": matrix,
    }


# ------------------------------------------------------------------ calibrations
def _check_range(valid_range: dict) -> dict:
    lo, hi = valid_range.get("min"), valid_range.get("max")
    if not isinstance(lo, (int, float)) or not isinstance(hi, (int, float)) or lo >= hi:
        raise ValidationFailed("The valid range needs a numeric min below max.", code="INVALID_RANGE")
    return {"min": float(lo), "max": float(hi)}


def create_calibration(db: Session, user: CurrentUser, body: CalibrationIn) -> SpectralCalibration:
    if body.analyte not in ANALYTES:
        raise ValidationFailed(f"Unknown analyte “{body.analyte}”.", code="UNKNOWN_ANALYTE")
    cal = SpectralCalibration(
        org_id=user.org_id, created_by=user.id, code=body.code, analyte=body.analyte,
        reference_method=body.reference_method, n_samples=body.n_samples, rmse=body.rmse, r2=body.r2,
        bias=body.bias, valid_range=_check_range(body.valid_range), status="draft", notes=body.notes,
        rpiq=body.rpiq, lin_ccc=body.lin_ccc, split_method=body.split_method,
        n_peer_reviewed_refs=body.n_peer_reviewed_refs, spectral_range=body.spectral_range,
        instrument=body.instrument,
    )
    db.add(cal)
    audit(db, user, "calibration.create", cal)
    return cal


def update_calibration(db: Session, user: CurrentUser, cal: SpectralCalibration,
                       body: CalibrationPatch) -> SpectralCalibration:
    if cal.status != "draft":
        raise ImmutableRecord("Only a draft calibration can be changed.", code="CALIBRATION_FROZEN")
    before = snapshot(cal)
    for k, v in body.model_dump(exclude_unset=True).items():
        if v is None:
            continue
        setattr(cal, k, _check_range(v) if k == "valid_range" else v)
    audit(db, user, "calibration.update", cal, before=before)
    return cal


def approve_calibration(db: Session, user: CurrentUser, cal: SpectralCalibration) -> SpectralCalibration:
    if cal.status != "draft":
        raise IllegalTransition(f"Only a draft calibration can be approved (this one is {cal.status}).")
    ensure_not_author(user.id, cal.created_by, *_editors(db, user.org_id, "SpectralCalibration", cal.id),
                      what="a calibration")
    missing = calibration_gaps(cal)
    if missing:
        raise Blocked(
            "The calibration can't be approved until its Appendix 4 details are complete: " + ", ".join(missing) + ".",
            code="CALIBRATION_INCOMPLETE", details={"missing": missing, "reference": REF_SPECTRO},
        )
    before = snapshot(cal)
    cal.status = "approved"
    cal.approved_by = user.id
    audit(db, user, "calibration.approve", cal, before=before)
    return cal


def calibration_gaps(cal: SpectralCalibration) -> list[str]:
    missing = [k for k in ("rpiq", "lin_ccc", "split_method", "n_peer_reviewed_refs", "spectral_range", "instrument")
               if getattr(cal, k) in (None, "")]
    if cal.n_peer_reviewed_refs is not None and cal.n_peer_reviewed_refs < MIN_PEER_REVIEWED_REFS:
        missing.append(f"n_peer_reviewed_refs (at least {MIN_PEER_REVIEWED_REFS} peer-reviewed articles)")
    return missing


def retire_calibration(db: Session, user: CurrentUser, cal: SpectralCalibration) -> SpectralCalibration:
    if cal.status == "retired":
        raise IllegalTransition("This calibration is already retired.")
    before = snapshot(cal)
    cal.status = "retired"
    audit(db, user, "calibration.retire", cal, before=before)
    return cal


def calibration_out(db: Session, cal: SpectralCalibration) -> dict:
    nm = _names(db, cal.org_id, {cal.created_by, cal.approved_by})
    return {
        "id": str(cal.id), "code": cal.code, "analyte": cal.analyte, "reference_method": cal.reference_method,
        "n_samples": cal.n_samples, "rmse": cal.rmse, "r2": cal.r2, "bias": cal.bias,
        "valid_range": cal.valid_range or {}, "status": cal.status, "notes": cal.notes,
        "rpiq": cal.rpiq, "lin_ccc": cal.lin_ccc, "split_method": cal.split_method,
        "n_peer_reviewed_refs": cal.n_peer_reviewed_refs, "spectral_range": cal.spectral_range,
        "instrument": cal.instrument, "approval_gaps": calibration_gaps(cal) if cal.status == "draft" else [],
        "created_by": nm.get(cal.created_by), "approved_by": nm.get(cal.approved_by),
    }


# ------------------------------------------------------------------ lab changes (§8.2.1.4)
def create_lab_change(db: Session, user: CurrentUser, project: Project, body: LabChangeIn) -> LabChange:
    from app.modules.evidence.models import EvidenceFile

    frm = get_owned(db, Lab, body.from_lab_id, user, "Lab")
    to = get_owned(db, Lab, body.to_lab_id, user, "Lab")
    if frm.id == to.id:
        raise ValidationFailed("The new lab must be different from the previous lab.", code="INVALID_LAB_CHANGE")
    evidence = [str(get_owned(db, EvidenceFile, e, user, "Evidence file").id) for e in dict.fromkeys(body.evidence_ids)]
    lc = LabChange(org_id=user.org_id, created_by=user.id, project_id=project.id, from_lab_id=frm.id,
                   to_lab_id=to.id, justification=body.justification,
                   sop_consistency_statement=body.sop_consistency_statement, evidence_ids=evidence,
                   effective_from=body.effective_from)
    db.add(lc)
    audit(db, user, "lab_change.create", lc)
    return lc


def lab_change_out(db: Session, lc: LabChange) -> dict:
    frm, to = db.get(Lab, lc.from_lab_id), db.get(Lab, lc.to_lab_id)
    return {
        "id": str(lc.id), "project_id": str(lc.project_id), "from_lab_id": str(lc.from_lab_id),
        "from_lab_code": frm.code if frm else None, "to_lab_id": str(lc.to_lab_id),
        "to_lab_code": to.code if to else None, "justification": lc.justification,
        "sop_consistency_statement": lc.sop_consistency_statement, "evidence_ids": list(lc.evidence_ids or []),
        "effective_from": lc.effective_from.isoformat() if lc.effective_from else None,
        "recorded_by": _names(db, lc.org_id, {lc.created_by}).get(lc.created_by),
        "recorded_at": lc.created_at.isoformat() if lc.created_at else None, "reference": REF_LAB,
    }


def list_lab_changes(db: Session, user: CurrentUser, project: Project) -> list[dict]:
    rows = db.scalars(scoped(LabChange, user).where(LabChange.project_id == project.id)
                      .order_by(LabChange.created_at))
    return [lab_change_out(db, lc) for lc in rows]


# ------------------------------------------------------------------ spectroscopy check (Eq. 73)
def spectroscopy_pairs(db: Session, org_id: uuid.UUID, campaign_id: uuid.UUID) -> dict:
    """Layers of a campaign with a live spectroscopy SOC result, and those also run by dry combustion."""
    layers = list(db.scalars(select(SoilLayer).join(Sample, Sample.id == SoilLayer.sample_id).where(
        Sample.org_id == org_id, Sample.campaign_id == campaign_id)))
    by_id = {lay.id: lay for lay in layers}
    spectro: dict[uuid.UUID, LabResult] = {}
    dc: dict[uuid.UUID, LabResult] = {}
    if layers:
        for r in db.scalars(select(LabResult).where(LabResult.org_id == org_id,
                                                    LabResult.layer_id.in_(list(by_id)),
                                                    LabResult.analyte == "soc_pct", LabResult.status.in_(LIVE))):
            if r.method in SPECTRO_METHODS:
                spectro[r.layer_id] = r
            elif r.method == DRY_COMBUSTION:
                dc[r.layer_id] = r
    pairs = [{"layer_id": str(lid), "bag_code": by_id[lid].code, "predicted": spectro[lid].value,
              "method": spectro[lid].method, "dry_combustion": dc[lid].value,
              "error": round(spectro[lid].value - dc[lid].value, 6)}
             for lid in sorted(spectro, key=lambda x: by_id[x].code) if lid in dc]
    return {"n_spectroscopy": len(spectro), "pairs": pairs}


def eq73_model_error(errors: list[float]) -> dict:
    """VM0042 v2.2 Eq. 73: s2_model = 1/(tvd-1) x sum (error_pvd - mean error)^2 (before area weighting A^2)."""
    n = len(errors)
    if n < 2:
        return {"tvd": n, "s2_model": None, "mean_error": errors[0] if errors else None, "rmse": None,
                "reason": "At least 2 paired samples are needed."}
    mean = sum(errors) / n
    s2 = sum((e - mean) ** 2 for e in errors) / (n - 1)
    rmse = (sum(e * e for e in errors) / n) ** 0.5
    return {"tvd": n, "s2_model": round(s2, 8), "mean_error": round(mean, 6), "rmse": round(rmse, 6)}


def spectroscopy_check(db: Session, user: CurrentUser, campaign: Campaign) -> dict:
    from app.modules.qa.service import project_rules

    project = db.get(Project, campaign.project_id)
    rules = project_rules(db, project)
    data = spectroscopy_pairs(db, user.org_id, campaign.id)
    n, k = data["n_spectroscopy"], len(data["pairs"])
    pct = round(100.0 * k / n, 2) if n else None
    frac_min, frac_max = rules.get("spectroscopy_check_fraction_min"), rules.get("spectroscopy_check_fraction_max")
    min_pct = round(100.0 * float(frac_min), 4) if frac_min is not None else None
    if n == 0:
        status = "not_applicable"
    elif min_pct is None:
        status = "rule_not_configured"
    else:
        status = "ok" if pct >= float(min_pct) else "too_few"
    return {
        "campaign_id": str(campaign.id), "campaign_code": campaign.code, "n_spectroscopy_samples": n,
        "n_dry_combustion_checked": k, "checked_pct": pct, "required_min_pct": min_pct,
        "required_max_pct": round(100.0 * float(frac_max), 4) if frac_max is not None else None,
        "recommended_range_pct": [10, 15], "status": status,
        "model_error": eq73_model_error([p["error"] for p in data["pairs"]]),
        "pairs": data["pairs"], "equation": "Eq. 73 s2_model = A^2/(tvd-1) x sum(error_pvd - mean error)^2; "
        "s2_model here is before the A^2 area factor, error = spectroscopy - dry combustion (SOC %)",
        "reference": REF_SPECTRO, "data_class": "CALCULATED",
    }
