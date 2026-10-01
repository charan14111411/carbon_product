"""Farms, fields (with computed geometry), land-use history, land tenure and project enrolment
(with the VM0042 v2.2 §4 applicability checks)."""

from __future__ import annotations

import uuid
from datetime import date
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core import geo
from app.core.auth import CurrentUser, ensure_not_author
from app.core.db import utcnow
from app.core.errors import Blocked, Conflict, IllegalTransition, NotFound, ValidationFailed
from app.core.events import emit
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.catalogue.service import require_active_crop, validate_attributes
from app.modules.consent.service import has_consent
from app.modules.evidence.models import EvidenceFile
from app.modules.farmers.models import Farmer
from app.modules.identity.models import AuditEntry
from app.modules.land.domain import (
    WETLAND_EXEMPTION_EVIDENCE_KIND, Check, LandUseSpan, land_cover_checks, land_use_check, lookback_activity_check,
    native_clearing_check, uncovered_periods,
)
from app.modules.land.models import Enrolment, Farm, Field, FieldBoundaryVersion, LandTenure, LandUseRecord
from app.modules.programmes.domain import periods_overlap
from app.modules.programmes.models import Programme, Project

FIELD_PREFIX = "FLD-"
DEFAULT_LOOKBACK_YEARS = 10
REQUIRED_CONSENTS = ("sampling", "data_use")
SITE_ATTRIBUTES = ("slope_pct", "aspect_deg", "soil_texture_class", "wrb_soil_group", "ecoregion", "climate_zone",
                   "mean_annual_precip_mm")


def project_start(project: Project) -> date | None:
    """VM0042 project start: the crediting start, else the baseline start."""
    return project.crediting_start or project.baseline_start


# ------------------------------------------------------------------ farms
def list_farms(db: Session, user: CurrentUser, farmer_id: str | None = None) -> list[Farm]:
    q = scoped(Farm, user).order_by(Farm.name)
    if farmer_id:
        q = q.where(Farm.farmer_id == get_owned(db, Farmer, farmer_id, user, "Farmer").id)
    return list(db.scalars(q).all())


def _ensure_unique_external_farm(db: Session, user: CurrentUser, external_farm_id: str | None,
                                 exclude: uuid.UUID | None = None) -> None:
    if not external_farm_id:
        return
    q = scoped(Farm, user).where(Farm.external_farm_id == external_farm_id)
    if exclude:
        q = q.where(Farm.id != exclude)
    other = db.scalar(q)
    if other:
        raise Conflict(f"The Varsapradaya farm {external_farm_id} is already recorded as {other.name}.",
                       code="DUPLICATE_MEMBER_FARM", details={"farm_id": str(other.id)})


def create_farm(db: Session, user: CurrentUser, data: dict[str, Any]) -> Farm:
    farmer = get_owned(db, Farmer, data.pop("farmer_id"), user, "Farmer")
    _ensure_unique_external_farm(db, user, data.get("external_farm_id"))
    farm = Farm(org_id=user.org_id, created_by=user.id, farmer_id=farmer.id, **data)
    db.add(farm)
    audit(db, user, "farm.create", farm)
    return farm


def update_farm(db: Session, user: CurrentUser, farm_id: str, changes: dict[str, Any]) -> Farm:
    farm = get_owned(db, Farm, farm_id, user, "Farm")
    before = snapshot(farm)
    if changes.get("external_farm_id"):
        _ensure_unique_external_farm(db, user, changes["external_farm_id"], exclude=farm.id)
    for k, v in changes.items():
        if v is None and k not in ("external_farm_id", "postal_code"):
            continue
        setattr(farm, k, v)
    audit(db, user, "farm.update", farm, before=before)
    return farm


# ------------------------------------------------------------------ fields
def next_field_code(db: Session, org_id: uuid.UUID) -> str:
    last = db.scalar(select(func.max(Field.code)).where(Field.org_id == org_id, Field.code.like(f"{FIELD_PREFIX}%")))
    n = int(last[len(FIELD_PREFIX):]) + 1 if last and last[len(FIELD_PREFIX):].isdigit() else 1
    return f"{FIELD_PREFIX}{n:06d}"


def _ensure_no_overlap(db: Session, org_id: uuid.UUID, fp: geo.Footprint, exclude: uuid.UUID | None = None) -> None:
    q = select(Field).where(
        Field.org_id == org_id, Field.status == "active",
        Field.min_lat <= fp.max_lat, Field.max_lat >= fp.min_lat,
        Field.min_lon <= fp.max_lon, Field.max_lon >= fp.min_lon,
    )
    if exclude:
        q = q.where(Field.id != exclude)
    for other in db.scalars(q.order_by(Field.code)).all():
        if geo.overlaps(fp.geojson, other.boundary):
            raise Conflict(
                f"This boundary overlaps field {other.code} ({other.name}). "
                "Adjust the boundary so fields don't overlap.",
                code="OVERLAPPING_FIELD", details={"field_id": str(other.id), "field_code": other.code},
            )


def _apply_footprint(f: Field, fp: geo.Footprint) -> None:
    f.boundary, f.area_ha = fp.geojson, fp.area_ha
    f.centroid_lat, f.centroid_lon = fp.centroid_lat, fp.centroid_lon
    f.min_lat, f.max_lat, f.min_lon, f.max_lon = fp.min_lat, fp.max_lat, fp.min_lon, fp.max_lon


def _check_crop(db: Session, org_id: uuid.UUID, crop_code: str | None, attributes: dict) -> None:
    if crop_code is None:
        if attributes:
            raise ValidationFailed("Choose a crop before recording crop details.")
        return
    crop = require_active_crop(db, org_id, crop_code)
    errors = validate_attributes(crop.attributes, attributes)
    if errors:
        raise ValidationFailed(" ".join(errors), code="INVALID_ATTRIBUTES", details={"errors": errors})


def create_field(db: Session, user: CurrentUser, data: dict[str, Any]) -> Field:
    farm = get_owned(db, Farm, data["farm_id"], user, "Farm")
    fp = geo.footprint(data["boundary"])
    _check_crop(db, user.org_id, data.get("crop_code"), data.get("crop_attributes") or {})
    _ensure_no_overlap(db, user.org_id, fp)
    f = Field(
        org_id=user.org_id, created_by=user.id, farm_id=farm.id, code=next_field_code(db, user.org_id),
        name=data["name"], crop_code=data.get("crop_code"), crop_attributes=data.get("crop_attributes") or {},
        soil_type=data.get("soil_type"), elevation_m=data.get("elevation_m"), version=1, status="active",
        land_cover=data.get("land_cover") or "cropland", **{k: data.get(k) for k in SITE_ATTRIBUTES},
    )
    _apply_footprint(f, fp)
    db.add(f)
    audit(db, user, "field.create", f)
    db.add(FieldBoundaryVersion(org_id=user.org_id, created_by=user.id, field_id=f.id, version=1,
                                boundary=f.boundary, area_ha=f.area_ha, reason="Initial boundary"))
    return f


def _enrolled_in(db: Session, field_id: uuid.UUID) -> list[str]:
    return list(db.scalars(
        select(Project.code).join(Enrolment, Enrolment.project_id == Project.id)
        .where(Enrolment.field_id == field_id, Enrolment.status == "enrolled")
    ).all())


def update_field(db: Session, user: CurrentUser, field_id: str, changes: dict[str, Any]) -> Field:
    f = get_owned(db, Field, field_id, user, "Field")
    before = snapshot(f)
    reason = (changes.pop("reason", None) or "").strip()
    new_boundary = changes.pop("boundary", None)
    status = changes.pop("status", None)

    crop_code = changes["crop_code"] if "crop_code" in changes else f.crop_code
    attrs = changes["crop_attributes"] if changes.get("crop_attributes") is not None else f.crop_attributes
    if "crop_code" in changes or "crop_attributes" in changes:
        _check_crop(db, user.org_id, crop_code, attrs or {})
        f.crop_code, f.crop_attributes = crop_code, attrs or {}
    for k in ("name", "soil_type", "elevation_m", "land_cover", *SITE_ATTRIBUTES):
        if k in changes and (changes[k] is not None or k not in ("name", "land_cover")):
            setattr(f, k, changes[k])

    if status == "retired" and f.status != "retired":
        projects = _enrolled_in(db, f.id)
        if projects:
            raise Blocked(f"This field is enrolled in {', '.join(projects)}. Withdraw it before retiring the field.")
        f.status = "retired"
    elif status == "active" and f.status != "active":
        _ensure_no_overlap(db, user.org_id, geo.footprint(f.boundary), exclude=f.id)
        f.status = "active"

    if new_boundary is not None:
        fp = geo.footprint(new_boundary)
        if fp.geojson != geo.footprint(f.boundary).geojson:
            if len(reason) < 5:
                raise ValidationFailed("Say why the boundary is changing (at least 5 characters).",
                                       code="REASON_REQUIRED")
            if f.status == "active":
                _ensure_no_overlap(db, user.org_id, fp, exclude=f.id)
            _apply_footprint(f, fp)
            f.version += 1
            db.add(FieldBoundaryVersion(org_id=user.org_id, created_by=user.id, field_id=f.id, version=f.version,
                                        boundary=f.boundary, area_ha=f.area_ha, reason=reason))
    audit(db, user, "field.update", f, before=before, reason=reason or None)
    return f


def _fields_query(db: Session, user: CurrentUser, *, farm_id: str | None = None, farmer_id: str | None = None,
                  project_id: str | None = None, crop_code: str | None = None, status: str | None = None,
                  q: str | None = None):
    stmt = scoped(Field, user)
    if farm_id:
        stmt = stmt.where(Field.farm_id == get_owned(db, Farm, farm_id, user, "Farm").id)
    if farmer_id:
        fid = get_owned(db, Farmer, farmer_id, user, "Farmer").id
        stmt = stmt.where(Field.farm_id.in_(select(Farm.id).where(Farm.farmer_id == fid)))
    if project_id:
        pid = get_owned(db, Project, project_id, user, "Project").id
        stmt = stmt.where(Field.id.in_(
            select(Enrolment.field_id).where(Enrolment.project_id == pid, Enrolment.status != "withdrawn")))
    if crop_code:
        stmt = stmt.where(Field.crop_code == crop_code)
    if status:
        stmt = stmt.where(Field.status == status)
    if q and q.strip():
        stmt = stmt.where(Field.name.ilike(f"%{q.strip()}%") | Field.code.ilike(f"%{q.strip()}%"))
    return stmt


def list_fields(db: Session, user: CurrentUser, *, limit: int = 50, offset: int = 0, **filters: Any):
    stmt = _fields_query(db, user, **filters)
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    rows = db.scalars(stmt.order_by(Field.code).limit(limit).offset(offset)).all()
    return list(rows), total


def fields_geojson(db: Session, user: CurrentUser, project_id: str | None = None,
                   farmer_id: str | None = None) -> dict[str, Any]:
    stmt = _fields_query(db, user, project_id=project_id, farmer_id=farmer_id,
                         status=None if project_id else "active")
    fields = db.scalars(stmt.order_by(Field.code)).all()
    statuses: dict[uuid.UUID, str] = {}
    if project_id:
        pid = get_owned(db, Project, project_id, user, "Project").id
        statuses = dict(db.execute(
            select(Enrolment.field_id, Enrolment.status).where(Enrolment.project_id == pid)).all())
    farms = {f.id: f for f in db.scalars(scoped(Farm, user).where(Farm.id.in_({f.farm_id for f in fields}))).all()}
    features = []
    for f in fields:
        farm = farms.get(f.farm_id)
        features.append({
            "type": "Feature", "id": str(f.id), "geometry": f.boundary,
            "properties": {
                "id": str(f.id), "code": f.code, "name": f.name, "area_ha": f.area_ha, "crop_code": f.crop_code,
                "status": f.status, "farm_id": str(f.farm_id), "farmer_id": str(farm.farmer_id) if farm else None,
                "enrolment_status": statuses.get(f.id),
            },
        })
    return {"type": "FeatureCollection", "features": features}


def boundary_history(db: Session, user: CurrentUser, field_id: str) -> list[FieldBoundaryVersion]:
    f = get_owned(db, Field, field_id, user, "Field")
    return list(db.scalars(scoped(FieldBoundaryVersion, user).where(FieldBoundaryVersion.field_id == f.id)
                           .order_by(FieldBoundaryVersion.version.desc())).all())


# ------------------------------------------------------------------ land use
def add_land_use(db: Session, user: CurrentUser, field_id: str, data: dict[str, Any]) -> LandUseRecord:
    f = get_owned(db, Field, field_id, user, "Field")
    if data["to_year"] > date.today().year:
        raise ValidationFailed("Land-use history can't include future years.")
    evidence_id = None
    if data.get("evidence_id"):
        evidence_id = get_owned(db, EvidenceFile, data["evidence_id"], user, "Evidence file").id
    rec = LandUseRecord(org_id=user.org_id, created_by=user.id, field_id=f.id, from_year=data["from_year"],
                        to_year=data["to_year"], land_use=data["land_use"], evidence_id=evidence_id,
                        source=data.get("source", ""), notes=data.get("notes", ""))
    db.add(rec)
    audit(db, user, "land_use.record", rec)
    return rec


def list_land_use(db: Session, user: CurrentUser, field_id: str) -> list[LandUseRecord]:
    f = get_owned(db, Field, field_id, user, "Field")
    return list(db.scalars(scoped(LandUseRecord, user).where(LandUseRecord.field_id == f.id)
                           .order_by(LandUseRecord.from_year, LandUseRecord.created_at)).all())


# ------------------------------------------------------------------ enrolment
def _farmer_of(db: Session, f: Field) -> Farmer:
    farm = db.get(Farm, f.farm_id)
    return db.get(Farmer, farm.farmer_id)


def evaluate_eligibility(db: Session, project: Project, f: Field, farmer: Farmer,
                         lookback_years: int | None = None, today: date | None = None) -> list[Check]:
    """Run every eligibility check for ``f`` joining ``project``. Nothing is skipped."""
    today = today or date.today()
    programme = db.get(Programme, project.programme_id)
    checks: list[Check] = []

    if programme.boundary:
        inside = geo.contains(programme.boundary, f.centroid_lat, f.centroid_lon)
        checks.append(Check("inside_programme_boundary", inside,
                            "The field is inside the programme area." if inside
                            else "The field's centre is outside the programme area."))
    else:
        checks.append(Check("inside_programme_boundary", True, "The programme has no area limit."))

    eligible = programme.eligible_crops or []
    if not eligible:
        checks.append(Check("crop_eligible", True, "The programme accepts all crops."))
    elif f.crop_code in eligible:
        checks.append(Check("crop_eligible", True, f"{f.crop_code} is an eligible crop."))
    else:
        checks.append(Check("crop_eligible", False,
                            f"{f.crop_code or 'No crop recorded'} is not eligible. "
                            f"Eligible crops: {', '.join(eligible)}.", {"eligible_crops": eligible}))

    lb = lookback_years if lookback_years is not None else (programme.commercial_terms or {}).get(
        "lookback_years", DEFAULT_LOOKBACK_YEARS)
    records = db.scalars(select(LandUseRecord).where(LandUseRecord.field_id == f.id)).all()
    spans = [LandUseSpan(r.from_year, r.to_year, r.land_use, r.created_at, r.evidence_id is not None)
             for r in records]
    checks.append(land_use_check(spans, today.year, int(lb)))

    # VM0042 v2.2 §4 applicability
    start = project_start(project)
    start_year = start.year if start else today.year
    checks.append(native_clearing_check(spans, start_year))
    hydrology = db.scalar(select(EvidenceFile.id).where(
        EvidenceFile.org_id == f.org_id, EvidenceFile.kind == WETLAND_EXEMPTION_EVIDENCE_KIND,
        EvidenceFile.entity_type == "field", EvidenceFile.entity_id == str(f.id)).limit(1)) is not None
    checks.extend(land_cover_checks(f.land_cover, f.crop_code, f.crop_attributes, hydrology))
    checks.append(lookback_activity_check(_baseline_years(db, project, f), start_year))
    checks.append(tenure_check(db, project, f, farmer))

    clashes = []
    for other_enrolment, other in db.execute(
        select(Enrolment, Project).join(Project, Project.id == Enrolment.project_id).where(
            Enrolment.field_id == f.id, Enrolment.status == "enrolled", Enrolment.project_id != project.id,
            Project.status != "closed",
        )
    ).all():
        if periods_overlap(project.crediting_start, project.crediting_end, other.crediting_start, other.crediting_end):
            clashes.append(other.code)
    checks.append(Check(
        "not_double_enrolled", not clashes,
        "The field isn't enrolled in another project for the same period." if not clashes
        else f"The field is already enrolled in {', '.join(sorted(clashes))} for an overlapping period.",
        {"projects": sorted(clashes)},
    ))

    missing = [p for p in REQUIRED_CONSENTS if not has_consent(db, f.org_id, farmer.id, p, today)]
    checks.append(Check(
        "farmer_consent", not missing,
        "The farmer has given consent for sampling and data use." if not missing
        else f"The farmer hasn't given consent for: {', '.join(m.replace('_', ' ') for m in missing)}.",
        {"missing": missing},
    ))
    return checks


def _baseline_years(db: Session, project: Project, f: Field) -> list[int]:
    """Years with at least one active (latest-version) baseline activity record for the field in the project."""
    from app.modules.baseline.models import ActivityRecord

    latest: dict[uuid.UUID, ActivityRecord] = {}
    for r in db.scalars(select(ActivityRecord).where(
            ActivityRecord.org_id == f.org_id, ActivityRecord.project_id == project.id,
            ActivityRecord.field_id == f.id, ActivityRecord.scenario == "baseline")).all():
        if r.record_id not in latest or r.version > latest[r.record_id].version:
            latest[r.record_id] = r
    return sorted({r.year for r in latest.values() if r.status == "active"})


def tenure_check(db: Session, project: Project, f: Field, farmer: Farmer) -> Check:
    """The farmer must hold verified tenure / land control covering the whole crediting period."""
    if project.crediting_start is None or project.crediting_end is None:
        return Check("land_tenure", False, "Set the project's crediting period so land tenure can be checked "
                                           "against it.")
    rows = db.scalars(select(LandTenure).where(
        LandTenure.org_id == f.org_id, LandTenure.field_id == f.id, LandTenure.holder_farmer_id == farmer.id)).all()
    verified = [(t.valid_from, t.valid_to) for t in rows if t.status == "verified"]
    gaps = uncovered_periods(verified, project.crediting_start, project.crediting_end)
    pending = sum(1 for t in rows if t.status == "pending")
    details = {"period": [project.crediting_start.isoformat(), project.crediting_end.isoformat()],
               "verified_records": len(verified), "pending_records": pending,
               "gaps": [[a.isoformat(), b.isoformat()] for a, b in gaps]}
    if not verified:
        tail = (f"{pending} record(s) are waiting for verification." if pending
                else "Add the ownership or lease documents and ask a colleague to verify them.")
        return Check("land_tenure", False, "No verified land-tenure record for this farmer and field. " + tail,
                     details)
    if gaps:
        a, b = gaps[0]
        return Check("land_tenure", False,
                     f"Verified land tenure doesn't cover the whole crediting period: {a.isoformat()} to "
                     f"{b.isoformat()} is not covered.", details)
    return Check("land_tenure", True, "Verified land tenure covers the whole crediting period.", details)


def _eligibility_doc(checks: list[Check], extra: dict | None = None) -> dict[str, Any]:
    return {"checks": [c.to_dict() for c in checks], "decided_at": utcnow().isoformat(), **(extra or {})}


def request_enrolment(db: Session, user: CurrentUser, project_id: str, field_id: str) -> Enrolment:
    project = get_owned(db, Project, project_id, user, "Project")
    if project.status == "closed":
        raise Blocked("This project is closed to new fields.")
    f = get_owned(db, Field, field_id, user, "Field")
    if f.status != "active":
        raise ValidationFailed("This field is retired and can't be enrolled.")
    farmer = _farmer_of(db, f)
    checks = evaluate_eligibility(db, project, f, farmer)
    status = "eligible" if all(c.passed for c in checks) else "ineligible"

    e = db.scalar(select(Enrolment).where(Enrolment.project_id == project.id, Enrolment.field_id == f.id))
    if e is not None:
        if e.status == "enrolled":
            raise Conflict(f"Field {f.code} is already enrolled in this project.", code="ALREADY_ENROLLED")
        before = snapshot(e)
        e.farmer_id, e.status, e.eligibility = farmer.id, status, _eligibility_doc(checks)
        e.enrolled_on = e.withdrawn_on = None
        audit(db, user, "enrolment.recheck", e, before=before)
        return e
    e = Enrolment(org_id=user.org_id, created_by=user.id, project_id=project.id, field_id=f.id,
                  farmer_id=farmer.id, status=status, eligibility=_eligibility_doc(checks))
    db.add(e)
    audit(db, user, "enrolment.request", e)
    return e


def get_enrolment(db: Session, user: CurrentUser, project_id: str, enrolment_id: str) -> tuple[Project, Enrolment]:
    project = get_owned(db, Project, project_id, user, "Project")
    e = get_owned(db, Enrolment, enrolment_id, user, "Enrolment")
    if e.project_id != project.id:
        raise NotFound("Enrolment not found.")
    return project, e


def confirm_enrolment(db: Session, user: CurrentUser, project_id: str, enrolment_id: str) -> Enrolment:
    project, e = get_enrolment(db, user, project_id, enrolment_id)
    if e.status != "eligible":
        raise IllegalTransition(f"Only an eligible field can be enrolled (this one is {e.status}).",
                                details={"from": e.status, "to": "enrolled"})
    if project.status == "closed":
        raise Blocked("This project is closed to new fields.")
    f = db.get(Field, e.field_id)
    if f.status != "active":
        raise Blocked("This field has been retired and can't be enrolled.")
    farmer = db.get(Farmer, e.farmer_id)
    checks = evaluate_eligibility(db, project, f, farmer)
    failed = [c for c in checks if not c.passed]
    if failed:  # something changed since the check (e.g. consent withdrawn) — re-run the request to refresh
        raise Blocked("The field no longer passes every eligibility check: " + " ".join(c.message for c in failed),
                      code="NO_LONGER_ELIGIBLE", details={"checks": [c.to_dict() for c in checks]})
    before = snapshot(e)
    e.status, e.enrolled_on = "enrolled", date.today()
    e.eligibility = _eligibility_doc(checks)
    audit(db, user, "enrolment.confirm", e, before=before)
    emit(db, user, "farmer.enrolled", e, {"project_id": e.project_id, "field_id": e.field_id,
                                          "farmer_id": e.farmer_id, "area_ha": f.area_ha,
                                          "enrolled_on": e.enrolled_on})
    return e


def withdraw_enrolment(db: Session, user: CurrentUser, project_id: str, enrolment_id: str, reason: str) -> Enrolment:
    _, e = get_enrolment(db, user, project_id, enrolment_id)
    if e.status == "withdrawn":
        raise IllegalTransition("This field has already been withdrawn.", details={"from": e.status, "to": "withdrawn"})
    before = snapshot(e)
    e.status, e.withdrawn_on = "withdrawn", date.today()
    e.eligibility = {**(e.eligibility or {}), "withdrawal": {"reason": reason, "on": date.today().isoformat(),
                                                            "by": str(user.id)}}
    audit(db, user, "enrolment.withdraw", e, before=before, reason=reason)
    return e


def enrolment_views(db: Session, rows: list[Enrolment]) -> list[dict[str, Any]]:
    fields = {f.id: f for f in db.scalars(select(Field).where(Field.id.in_({e.field_id for e in rows}))).all()}
    farmers = {f.id: f for f in db.scalars(select(Farmer).where(Farmer.id.in_({e.farmer_id for e in rows}))).all()}
    out = []
    for e in rows:
        f, fr = fields.get(e.field_id), farmers.get(e.farmer_id)
        out.append({
            "id": str(e.id), "project_id": str(e.project_id), "field_id": str(e.field_id),
            "field_code": f.code if f else "", "field_area_ha": f.area_ha if f else 0.0,
            "farmer_id": str(e.farmer_id), "farmer_name": fr.full_name if fr else "", "status": e.status,
            "eligibility": e.eligibility or {}, "enrolled_on": e.enrolled_on, "withdrawn_on": e.withdrawn_on,
            "created_at": e.created_at, "updated_at": e.updated_at,
        })
    return out


def list_enrolments(db: Session, user: CurrentUser, project_id: str, status: str | None = None) -> list[Enrolment]:
    project = get_owned(db, Project, project_id, user, "Project")
    q = scoped(Enrolment, user).where(Enrolment.project_id == project.id).order_by(Enrolment.created_at)
    if status:
        q = q.where(Enrolment.status == status)
    return list(db.scalars(q).all())


# ------------------------------------------------------------------ land tenure
def _evidence(db: Session, user: CurrentUser, ids: list[str]) -> list[str]:
    out: list[str] = []
    for raw in ids:
        ev = get_owned(db, EvidenceFile, raw, user, "Evidence file")
        if str(ev.id) not in out:
            out.append(str(ev.id))
    return out


def add_tenure(db: Session, user: CurrentUser, field_id: str, data: dict[str, Any]) -> LandTenure:
    f = get_owned(db, Field, field_id, user, "Field")
    holder = get_owned(db, Farmer, data["holder_farmer_id"], user, "Farmer")
    t = LandTenure(org_id=user.org_id, created_by=user.id, field_id=f.id, holder_farmer_id=holder.id,
                   kind=data["kind"], document_evidence_ids=_evidence(db, user, data["document_evidence_ids"]),
                   valid_from=data["valid_from"], valid_to=data.get("valid_to"), notes=data.get("notes", ""),
                   status="pending")
    db.add(t)
    audit(db, user, "land_tenure.create", t)
    return t


def list_tenure(db: Session, user: CurrentUser, field_id: str) -> list[LandTenure]:
    f = get_owned(db, Field, field_id, user, "Field")
    return list(db.scalars(scoped(LandTenure, user).where(LandTenure.field_id == f.id)
                           .order_by(LandTenure.valid_from, LandTenure.created_at)).all())


def verify_tenure(db: Session, user: CurrentUser, tenure_id: str, decision: str, note: str) -> LandTenure:
    t = get_owned(db, LandTenure, tenure_id, user, "Land tenure")
    if t.status != "pending":
        raise IllegalTransition(f"This tenure record is already {t.status}.",
                                details={"from": t.status, "to": decision})
    editors = set(db.scalars(select(AuditEntry.created_by).where(
        AuditEntry.org_id == user.org_id, AuditEntry.entity_type == "LandTenure",
        AuditEntry.entity_id == str(t.id))).all())
    ensure_not_author(user.id, t.created_by, *editors, what="a land-tenure record")
    before = snapshot(t)
    t.status, t.verified_by, t.verified_at, t.review_note = decision, user.id, utcnow(), note.strip()
    audit(db, user, f"land_tenure.{decision}", t, before=before, reason=note.strip() or None)
    return t
