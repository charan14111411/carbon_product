"""Satellite indices, practice detection, the SOC prediction model, SOC maps and the sampling optimiser."""

from __future__ import annotations

import statistics
import uuid
from collections import defaultdict
from datetime import UTC, date, datetime, timedelta
from typing import Any

import numpy as np
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, ensure_not_author
from app.core.db import utcnow
from app.core.errors import Blocked, IllegalTransition, NotFound, RuleMissing, ValidationFailed
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.catalogue.models import PracticeType
from app.modules.intelligence import domain
from app.modules.intelligence import features as fstore
from app.modules.intelligence.models import (
    DriftReport, FeatureSet, FieldFeature, ModelVersion, PracticeDetection, SatelliteIndex, SocMap,
)
from app.modules.intelligence.domain import wall
from app.modules.intelligence.providers import (
    CLOUD_LIMIT_PCT, INDEX_CLASSES, INDICES, LAI_METHOD, FieldRef, SatObs, get_satellite_provider, lai_from_ndvi,
)
from app.modules.lab.models import LabResult
from app.modules.land.models import Field
from app.modules.methodology import ruleset
from app.modules.practices.models import PracticeRecord
from app.modules.programmes.models import Project
from app.modules.sampling.models import Sample, Site, SoilLayer, Stratum
from app.modules.supporting import service as supporting
from app.modules.supporting.providers import get_providers

MAX_WINDOW_DAYS = 400
MIN_TRAINING_ROWS = 12
MIN_TRAINING_FARMS = 3
ALERT_DROP = 0.25
ALERT_BASELINE_DAYS = 60


def today() -> date:
    return datetime.now(UTC).date()


def _window(start: date, end: date, max_days: int = MAX_WINDOW_DAYS) -> None:
    if end < start:
        raise ValidationFailed("The end date can't be before the start date.")
    if (end - start).days + 1 > max_days:
        raise ValidationFailed(f"Choose a window of at most {max_days} days.", code="WINDOW_TOO_LONG")


def latest_active_practices(db: Session, org_id: uuid.UUID, field_ids: list[uuid.UUID]) -> list[PracticeRecord]:
    """The latest version of every practice record, keeping only those still active."""
    if not field_ids:
        return []
    rows = db.scalars(select(PracticeRecord).where(PracticeRecord.org_id == org_id,
                                                   PracticeRecord.field_id.in_(field_ids))).all()
    latest: dict[uuid.UUID, PracticeRecord] = {}
    for r in rows:
        if r.record_id not in latest or r.version > latest[r.record_id].version:
            latest[r.record_id] = r
    return [r for r in latest.values() if r.status == "active"]


# ------------------------------------------------------------------ satellite
def refresh_satellite(db: Session, user: CurrentUser, fld: Field, start: date, end: date) -> dict[str, Any]:
    _window(start, end)
    if end > today():
        raise ValidationFailed("Satellite data can't be requested for future dates.", code="FUTURE_WINDOW")
    provider = get_satellite_provider()
    obs = provider.indices(FieldRef(str(fld.id), fld.centroid_lat, fld.centroid_lon, fld.crop_code), start, end)
    if not any(o.index_name == "lai" for o in obs):  # LAI is DERIVED from each pass's NDVI
        obs = obs + [SatObs("lai", o.observed_on, lai_from_ndvi(o.value), o.cloud_pct, o.source)
                     for o in obs if o.index_name == "ndvi"]
    existing = set(db.execute(
        select(SatelliteIndex.index_name, SatelliteIndex.observed_on, SatelliteIndex.source).where(
            SatelliteIndex.field_id == fld.id, SatelliteIndex.observed_on >= start, SatelliteIndex.observed_on <= end)
    ).all())
    written: dict[str, int] = defaultdict(int)
    cloudy = skipped = 0
    for o in obs:
        key = (o.index_name, o.observed_on, o.source[:40])
        if key in existing:
            skipped += 1
            continue
        existing.add(key)
        db.add(SatelliteIndex(org_id=fld.org_id, created_by=user.id, field_id=fld.id, index_name=o.index_name,
                              observed_on=o.observed_on, value=o.value, cloud_pct=o.cloud_pct, source=o.source[:40]))
        written[o.index_name] += 1
        cloudy += o.cloud_pct > CLOUD_LIMIT_PCT
    audit(db, user, "satellite.refresh", fld, reason=f"{start}..{end} via {provider.name}")
    return {"field_id": str(fld.id), "provider": provider.name, "written": dict(written),
            "skipped_existing": skipped, "cloudy_excluded": cloudy}


def clear_series(db: Session, field_id: uuid.UUID, index: str, start: date | None = None,
                 end: date | None = None) -> domain.Series:
    q = select(SatelliteIndex.observed_on, SatelliteIndex.value).where(
        SatelliteIndex.field_id == field_id, SatelliteIndex.index_name == index,
        SatelliteIndex.cloud_pct <= CLOUD_LIMIT_PCT)
    if start:
        q = q.where(SatelliteIndex.observed_on >= start)
    if end:
        q = q.where(SatelliteIndex.observed_on <= end)
    by_day: dict[date, list[float]] = defaultdict(list)
    for d, v in db.execute(q).all():
        by_day[d].append(v)
    return sorted((d, sum(v) / len(v)) for d, v in by_day.items())


def satellite_series(db: Session, fld: Field, index: str, start: date | None, end: date | None,
                     include_cloudy: bool) -> dict[str, Any]:
    if index not in INDICES:
        raise ValidationFailed("Index must be one of: " + ", ".join(INDICES) + ".", code="UNKNOWN_INDEX")
    q = select(SatelliteIndex).where(SatelliteIndex.field_id == fld.id, SatelliteIndex.index_name == index)
    if start:
        q = q.where(SatelliteIndex.observed_on >= start)
    if end:
        q = q.where(SatelliteIndex.observed_on <= end)
    rows = db.scalars(q.order_by(SatelliteIndex.observed_on)).all()
    points = []
    excluded = 0
    for r in rows:
        cloudy = r.cloud_pct > CLOUD_LIMIT_PCT
        excluded += cloudy
        if cloudy and not include_cloudy:
            continue
        points.append({"date": r.observed_on.isoformat(), "value": r.value, "cloud_pct": r.cloud_pct,
                       "source": r.source, "excluded": cloudy})
    out = {"field_id": str(fld.id), "index": index, **wall(INDEX_CLASSES[index]),
           "cloud_limit_pct": CLOUD_LIMIT_PCT, "cloudy_excluded": excluded, "points": points}
    if index == "lai":
        out["method"] = LAI_METHOD
    return out


def satellite_alerts(db: Session, user: CurrentUser, project: Project) -> dict[str, Any]:
    alerts = []
    for f in supporting.enrolled_fields(db, user.org_id, project.id):
        pts = clear_series(db, f.id, "ndvi")
        if len(pts) < 2:
            continue
        last_day, last = pts[-1]
        base = [v for d, v in pts[:-1] if last_day - timedelta(days=ALERT_BASELINE_DAYS) <= d < last_day]
        if not base:
            continue
        med = statistics.median(base)
        if med <= 0:
            continue
        drop = (med - last) / med
        if drop > ALERT_DROP:
            alerts.append({
                "field_id": str(f.id), "field_code": f.code, "latest_date": last_day.isoformat(),
                "latest_ndvi": round(last, 4), "median_60d": round(med, 4), "drop_pct": round(drop * 100, 1),
                "severity": "warning",
                "message": f"Vegetation on {f.code} fell {drop * 100:.0f}% below its 60-day median. "
                           "Check for harvest, damage or land-use change.",
            })
    alerts.sort(key=lambda a: -a["drop_pct"])
    return {"project_id": str(project.id), "threshold_pct": ALERT_DROP * 100, "alerts": alerts, **wall("DERIVED")}


# ------------------------------------------------------------------ practice detection
def _season_label(start: date, end: date) -> str:
    return f"{start:%Y%m%d}-{end:%Y%m%d}"


def run_detection(db: Session, user: CurrentUser, project: Project, season_start: date, season_end: date,
                  fallow_start: date | None = None, fallow_end: date | None = None) -> dict[str, Any]:
    _window(season_start, season_end, 550)
    if (fallow_start is None) != (fallow_end is None):
        raise ValidationFailed("Give both the fallow start and end dates, or neither.")
    if fallow_start and fallow_end and fallow_end < fallow_start:
        raise ValidationFailed("The fallow window ends before it starts.")
    season = _season_label(season_start, season_end)
    fields = supporting.enrolled_fields(db, user.org_id, project.id)
    records = latest_active_practices(db, user.org_id, [f.id for f in fields])
    created: list[PracticeDetection] = []
    by_field: dict[uuid.UUID, list[PracticeRecord]] = defaultdict(list)
    for r in records:
        if r.practice_code in domain.CHECKED_CODES and r.scenario == "project":
            if r.performed_on <= season_end and (r.ended_on or r.performed_on) >= season_start:
                by_field[r.field_id].append(r)

    def add(f: Field, rec: PracticeRecord | None, code: str, check: domain.Check, outcome: str, detected: bool,
            extra: dict | None = None) -> None:
        det = PracticeDetection(
            org_id=user.org_id, created_by=user.id, field_id=f.id, practice_record_id=rec.record_id if rec else None,
            practice_code=code, season=season, detected=detected, confidence=check.confidence, outcome=outcome,
            evidence={**check.evidence, **(extra or {}),
                      "record_version": rec.version if rec else None, "unreported": rec is None},
        )
        db.add(det)
        created.append(det)

    for f in fields:
        ndvi = clear_series(db, f.id, "ndvi", season_start - timedelta(days=45), season_end + timedelta(days=45))
        ndmi = clear_series(db, f.id, "ndmi", season_start - timedelta(days=45), season_end + timedelta(days=45))
        reported_codes = set()
        for rec in by_field.get(f.id, []):
            reported_codes.add(rec.practice_code)
            ws, we = domain.practice_window(rec.practice_code, rec.performed_on, rec.ended_on)
            check = domain.run_check(rec.practice_code, ndvi, ndmi, ws, we)
            add(f, rec, rec.practice_code, check, check.outcome_if_reported, bool(check.detected))
        if fallow_start and fallow_end and "cover_crop" not in reported_codes:
            check = domain.check_cover_crop(ndvi, fallow_start, fallow_end)
            if check.detected:
                add(f, None, "cover_crop", check, "mismatch", True,
                    {"note": "Green cover seen in the fallow window but no cover crop was reported."})
        if (f.crop_code or "").lower() == "rice" and "awd_irrigation" not in reported_codes:
            check = domain.check_awd(ndmi, season_start, season_end)
            if check.detected:
                add(f, None, "awd_irrigation", check, "mismatch", True,
                    {"note": "Wet/dry cycles seen but alternate wetting and drying was not reported."})
    db.flush()
    for d in created:
        audit(db, user, "practice_detection.create", d)
    counts: dict[str, int] = defaultdict(int)
    for d in created:
        counts[d.outcome] += 1
    return {"project_id": str(project.id), "season": season, "fields": len(fields), "detections": len(created),
            "by_outcome": dict(counts), "unreported": sum(1 for d in created if d.practice_record_id is None),
            "items": [detection_out(d) for d in created]}


def detection_out(d: PracticeDetection) -> dict[str, Any]:
    return {"id": str(d.id), "field_id": str(d.field_id),
            "practice_record_id": str(d.practice_record_id) if d.practice_record_id else None,
            "practice_code": d.practice_code, "season": d.season, "detected": d.detected, "confidence": d.confidence,
            "outcome": d.outcome, "evidence": d.evidence, "created_at": d.created_at.isoformat(),
            **wall("DERIVED"),
            "needs_review": d.outcome != "confirmed"}


def project_detections(db: Session, user: CurrentUser, project: Project) -> list[dict[str, Any]]:
    ids = [f.id for f in supporting.enrolled_fields(db, user.org_id, project.id)]
    if not ids:
        return []
    rows = db.scalars(scoped(PracticeDetection, user).where(PracticeDetection.field_id.in_(ids))
                      .order_by(PracticeDetection.created_at)).all()
    latest: dict[tuple, PracticeDetection] = {}
    for r in rows:
        latest[(r.field_id, r.practice_code)] = r
    return [detection_out(d) for d in sorted(latest.values(), key=lambda d: (str(d.field_id), d.practice_code))]


def field_detections(db: Session, user: CurrentUser, fld: Field) -> list[dict[str, Any]]:
    rows = db.scalars(scoped(PracticeDetection, user).where(PracticeDetection.field_id == fld.id)
                      .order_by(PracticeDetection.created_at.desc())).all()
    return [detection_out(d) for d in rows]


# ------------------------------------------------------------------ features
def build_features(db: Session, fld: Field, as_of: date, features: list[str], *, clay_lab: float | None = None,
                   practices: list[PracticeRecord] | None = None) -> tuple[dict[str, float | None], dict[str, str]]:
    """Feature values for one field as of a date, with where each came from."""
    vals: dict[str, float | None] = {}
    src: dict[str, str] = {}
    start = as_of - timedelta(days=365)
    for f in features:
        if f in ("ndvi_mean", "ndmi_mean"):
            pts = clear_series(db, fld.id, f.split("_")[0], start, as_of)
            vals[f] = round(sum(v for _, v in pts) / len(pts), 5) if len(pts) >= 3 else None
            src[f] = f"satellite ({len(pts)} clear passes)"
        elif f in ("rain_365d", "temp_mean"):
            param = "rain_mm" if f == "rain_365d" else "air_temp_c"
            rows = [o.value for o in supporting.best_rows(db, fld.id, param, start, as_of).values() if o.value is not None]
            if len(rows) >= 180:
                vals[f] = round(sum(rows) / len(rows) * (365 if f == "rain_365d" else 1), 3)
            else:
                vals[f] = None
            src[f] = f"supporting observations ({len(rows)} days)"
        elif f == "elevation_m":
            vals[f] = fld.elevation_m
            src[f] = "field record"
        elif f == "clay_pct":
            if clay_lab is not None:
                vals[f], src[f] = clay_lab, "lab (MEASURED)"
            else:
                soil = get_providers().soil
                vals[f] = soil.properties(fld.centroid_lat, fld.centroid_lon).get("clay_pct")
                src[f] = f"{soil.source_ref(fld.centroid_lat, fld.centroid_lon)} (MODELLED)"
        elif f == "practice_count":
            recs = practices if practices is not None else latest_active_practices(db, fld.org_id, [fld.id])
            vals[f] = float(sum(1 for r in recs if r.field_id == fld.id and r.scenario == "project"
                                and r.performed_on <= as_of))
            src[f] = "practice records"
        else:
            raise ValidationFailed(f"Unknown feature {f}.")
    return vals, src


# ------------------------------------------------------------------ SOC model
def _training_rows(db: Session, org_id: uuid.UUID, project_id: uuid.UUID | None) -> list[dict[str, Any]]:
    q = (
        select(LabResult, SoilLayer, Sample, Site, Field)
        .join(SoilLayer, SoilLayer.id == LabResult.layer_id)
        .join(Sample, Sample.id == SoilLayer.sample_id)
        .join(Site, Site.id == Sample.site_id)
        .join(Field, Field.id == Site.field_id)
        .where(LabResult.org_id == org_id, LabResult.status == "accepted",
               LabResult.analyte.in_(("soc_pct", "texture_clay_pct")))
    )
    if project_id:
        q = q.where(Site.project_id == project_id)
    rows = db.execute(q).all()
    superseded = {r.LabResult.supersedes_id for r in rows if r.LabResult.supersedes_id}
    latest: dict[tuple, Any] = {}
    for r in rows:
        if r.LabResult.id in superseded:
            continue
        k = (r.SoilLayer.id, r.LabResult.analyte)
        if k not in latest or r.LabResult.version > latest[k].LabResult.version:
            latest[k] = r
    samples: dict[uuid.UUID, dict[str, Any]] = {}
    for (layer_id, analyte), r in latest.items():
        s = samples.setdefault(r.Sample.id, {"sample": r.Sample, "field": r.Field, "layers": {}})
        s["layers"].setdefault(layer_id, {"depth": r.SoilLayer.depth_from_cm})[analyte] = r.LabResult.value
    out = []
    for s in samples.values():
        soc_layers = [lay for lay in s["layers"].values() if "soc_pct" in lay]
        if not soc_layers:
            continue
        top = min(soc_layers, key=lambda lay: lay["depth"])
        clay = top.get("texture_clay_pct")
        if clay is None:
            clays = [lay for lay in s["layers"].values() if "texture_clay_pct" in lay]
            clay = min(clays, key=lambda lay: lay["depth"])["texture_clay_pct"] if clays else None
        out.append({"sample": s["sample"], "field": s["field"], "soc": top["soc_pct"], "clay": clay})
    return sorted(out, key=lambda r: r["sample"].code)


def _aware(dt: datetime) -> datetime:
    return dt if dt.tzinfo else dt.replace(tzinfo=UTC)


def train_soc(db: Session, user: CurrentUser, *, name: str, features: list[str] | None, project_id: str | None,
              ridge_lambda: float, feature_set_id: str | None = None) -> ModelVersion:
    """Train a ridge SOC model. Features come either from the built-in list (``features``) or from a
    feature-set version (``feature_set_id``), computed point-in-time as of each sample's collection date."""
    fs: FeatureSet | None = None
    specs: list[fstore.Spec] = []
    if feature_set_id:
        fs = get_owned(db, FeatureSet, feature_set_id, user, "Feature set")
        if fs.status != "active":
            raise Blocked("This feature set is retired. Choose an active version.", code="FEATURE_SET_RETIRED")
        specs = fstore.parse_definition(fs.definition)
        if features and list(features) != [sp.column for sp in specs]:
            raise ValidationFailed("Give either a feature set or a list of features, not both.",
                                   code="FEATURES_AND_FEATURE_SET")
        features = [sp.column for sp in specs]
    else:
        features = list(features or [])
        unknown = sorted(set(features) - set(domain.SOC_FEATURES))
        if unknown or not features:
            raise ValidationFailed("Choose features from: " + ", ".join(domain.SOC_FEATURES) + ".",
                                   code="UNKNOWN_FEATURE", details={"unknown": unknown})
        features = list(dict.fromkeys(features))
    project = get_owned(db, Project, project_id, user, "Project") if project_id else None
    rows = _training_rows(db, user.org_id, project.id if project else None)
    field_ids = list({r["field"].id for r in rows})
    practices = latest_active_practices(db, user.org_id, field_ids)
    X, y, groups, used, excluded = [], [], [], [], []
    fingerprints: dict[str, str] = {}
    clay_sources: dict[str, int] = defaultdict(int)
    for r in rows:
        as_of = _aware(r["sample"].collected_at).date()
        if fs is not None:
            vec = fstore.compute_vector(db, r["field"], as_of, specs, practices=practices)
            vals = vec.values
        else:
            vals, _ = build_features(db, r["field"], as_of, features, clay_lab=r["clay"], practices=practices)
        missing = [f for f, v in vals.items() if v is None]
        if missing:
            excluded.append({"sample_code": r["sample"].code, "missing_features": missing})
            continue
        if fs is not None:
            fingerprints[r["sample"].code] = vec.fingerprint
        elif "clay_pct" in features:
            clay_sources["lab" if r["clay"] is not None else "soilgrids"] += 1
        X.append([float(vals[f]) for f in features])
        y.append(float(r["soc"]))
        groups.append(str(r["field"].farm_id))
        used.append(r["sample"].code)
    n_farms = len(set(groups))
    if len(y) < MIN_TRAINING_ROWS or n_farms < MIN_TRAINING_FARMS:
        raise ValidationFailed(
            f"Not enough data to train and validate a model: {len(y)} usable lab results from {n_farms} farms. "
            f"At least {MIN_TRAINING_ROWS} results from {MIN_TRAINING_FARMS} different farms are needed so whole "
            "farms can be held out for validation.",
            code="NOT_ENOUGH_DATA",
            details={"rows": len(y), "farms": n_farms, "min_rows": MIN_TRAINING_ROWS, "min_farms": MIN_TRAINING_FARMS,
                     "excluded": excluded[:50]},
        )
    Xa, ya = np.array(X), np.array(y)
    cv = domain.grouped_cv(Xa, ya, groups, ridge_lambda)
    model = domain.fit_ridge(Xa, ya, ridge_lambda)
    params = domain.portable_params(model, features, Xa, cv)
    fs_info = None
    if fs is not None:
        fs_info = {"id": str(fs.id), "name": fs.name, "version": fs.version, "definition": fs.definition,
                   "definition_sha256": fstore.sha256(fs.definition)}
        params.update({"feature_set_id": str(fs.id), "feature_set_name": fs.name, "feature_set_version": fs.version})
    n_prev = db.scalar(select(func.count()).select_from(ModelVersion).where(
        ModelVersion.org_id == user.org_id, ModelVersion.name == name)) or 0
    summary = {
        "target": "soc_pct of the top layer of each sample (accepted lab results, MEASURED)",
        "project_id": str(project.id) if project else None, "rows": len(y), "farms": n_farms,
        "fields": len({g for g in groups}), "samples": used, "excluded": excluded,
        "clay_sources": dict(clay_sources), "target_range": [float(ya.min()), float(ya.max())],
    }
    if fs_info:
        summary.update({"feature_set": fs_info, "feature_fingerprints": fingerprints,
                        "point_in_time": "features as of each sample's collection date"})
    mv = ModelVersion(
        org_id=user.org_id, created_by=user.id, name=name, version=str(n_prev + 1), kind="soc_prediction",
        algorithm="ridge_regression_closed_form", features=features, training_summary=summary,
        metrics={k: cv[k] for k in ("rmse", "mae", "bias", "r2", "coverage_90", "k", "folds")},
        validation="grouped_kfold_by_farm", status="candidate", params=params,
        notes=f"Ridge λ={ridge_lambda}; validation holds out whole farms (K={cv['k']})."
              + (f" Features from feature set {fs.name} v{fs.version}." if fs else ""),
    )
    db.add(mv)
    audit(db, user, "model.train", mv)
    return mv


def model_vector(db: Session, mv: ModelVersion, fld: Field, as_of: date, practices: list[PracticeRecord] | None,
                 clay_lab: float | None = None) -> tuple[dict[str, float | None], dict[str, Any]]:
    """Feature values for a model: via its feature set when it has one, else the built-in builder."""
    fs_id = (mv.params or {}).get("feature_set_id")
    if fs_id:
        fs = db.get(FeatureSet, uuid.UUID(fs_id))
        if fs is None:
            raise RuleMissing("The model's feature set no longer exists.", details={"feature_set_id": fs_id})
        vec = fstore.compute_vector(db, fld, as_of, fstore.parse_definition(fs.definition), practices=practices)
        return vec.values, {"feature_set": f"{fs.name} v{fs.version}", "fingerprint": vec.fingerprint,
                            "data_classes": vec.data_classes}
    return build_features(db, fld, as_of, list(mv.features), clay_lab=clay_lab, practices=practices)


def approve_model(db: Session, user: CurrentUser, model_id: str) -> ModelVersion:
    mv = get_owned(db, ModelVersion, model_id, user, "Model")
    if mv.status != "candidate":
        raise IllegalTransition(f"Only candidate models can be approved; this one is {mv.status}.")
    ensure_not_author(user.id, mv.created_by, what="a model")
    before = snapshot(mv)
    for prev in db.scalars(scoped(ModelVersion, user).where(ModelVersion.name == mv.name,
                                                            ModelVersion.status == "approved")).all():
        pb = snapshot(prev)
        prev.status = "retired"
        audit(db, user, "model.retire", prev, before=pb, reason=f"Replaced by version {mv.version}")
    mv.status, mv.approved_by, mv.approved_at = "approved", user.id, utcnow()
    audit(db, user, "model.approve", mv, before=before)
    return mv


def model_out(m: ModelVersion, full: bool = False) -> dict[str, Any]:
    out = {
        "id": str(m.id), "name": m.name, "version": m.version, "kind": m.kind, "algorithm": m.algorithm,
        "features": m.features, "metrics": m.metrics, "validation": m.validation, "status": m.status,
        "created_by": str(m.created_by) if m.created_by else None,
        "approved_by": str(m.approved_by) if m.approved_by else None,
        "approved_at": m.approved_at.isoformat() if m.approved_at else None, "created_at": m.created_at.isoformat(),
        "notes": m.notes, **wall("MODELLED"),
        "training_rows": (m.training_summary or {}).get("rows"),
        "feature_set_id": (m.params or {}).get("feature_set_id"),
        "review_required": review_required(m),
        "latest_drift": (m.metrics or {}).get("latest_drift"),
    }
    if full:
        out.update({"training_summary": m.training_summary, "params": m.params})
    return out


# ------------------------------------------------------------------ SOC map
def soc_map(db: Session, user: CurrentUser, project: Project, model_id: str, top_n: int) -> SocMap:
    mv = get_owned(db, ModelVersion, model_id, user, "Model")
    if mv.status != "approved":
        raise Blocked("Only an approved model can be used to map soil carbon. Ask a reviewer to approve it first.",
                      code="MODEL_NOT_APPROVED", details={"status": mv.status})
    fields = supporting.enrolled_fields(db, user.org_id, project.id)
    if not fields:
        raise Blocked("This project has no enrolled fields to map.", code="NO_FIELDS")
    as_of = today()
    practices = latest_active_practices(db, user.org_id, [f.id for f in fields])
    cells = []
    for f in fields:
        vals, src = model_vector(db, mv, f, as_of, practices)
        missing = [k for k, v in vals.items() if v is None]
        cell: dict[str, Any] = {"field_id": str(f.id), "field_code": f.code, "farm_id": str(f.farm_id),
                                "area_ha": f.area_ha, "features": vals, "feature_sources": src,
                                "data_class": "MODELLED"}
        if missing:
            cell.update({"predicted_soc_pct": None, "lower": None, "upper": None, "interval_width": None,
                         "in_domain": False, "out_of_domain_features": [], "missing_features": missing})
        else:
            cell.update(domain.predict_interval(mv.params, {k: float(v) for k, v in vals.items()}))
            cell["missing_features"] = []
        cells.append(cell)
    widths = [c["interval_width"] for c in cells if c["interval_width"] is not None]
    max_w = max(widths) if widths else 1.0
    for c in cells:
        if c["interval_width"] is None:
            c["priority"] = 1.5
            c["reasons"] = ["No prediction possible: missing " + ", ".join(c["missing_features"])]
        else:
            norm = c["interval_width"] / max_w if max_w > 0 else 1.0
            c["priority"] = round(norm * (1.0 if c["in_domain"] else 1.5), 4)
            reasons = [f"Interval width {c['interval_width']:.3f} % SOC ({norm:.0%} of the widest)"]
            if not c["in_domain"]:
                reasons.append("Outside the training data for " + ", ".join(c["out_of_domain_features"]))
            c["reasons"] = reasons
    ranked = sorted(cells, key=lambda c: (-c["priority"], c["field_code"]))
    for i, c in enumerate(ranked):
        c["sample_next"] = i < top_n
        c["rank"] = i + 1
    predicted = [c["predicted_soc_pct"] for c in cells if c["predicted_soc_pct"] is not None]
    sm = SocMap(
        org_id=user.org_id, created_by=user.id, project_id=project.id, model_id=mv.id, generated_on=as_of,
        cells=ranked,
        summary={"model": f"{mv.name} v{mv.version}", "fields": len(cells), "predicted": len(predicted),
                 "out_of_domain": sum(1 for c in cells if not c["in_domain"]),
                 "mean_predicted_soc_pct": round(sum(predicted) / len(predicted), 4) if predicted else None,
                 "sample_next": [c["field_code"] for c in ranked[:top_n]], "data_class": "MODELLED",
                 "note": "Model predictions guide sampling; they are not measurements and are not credited.",
                 "model_review_required": review_required(mv)},
    )
    db.add(sm)
    audit(db, user, "soc_map.create", sm)
    return sm


def soc_map_out(sm: SocMap) -> dict[str, Any]:
    return {"id": str(sm.id), "project_id": str(sm.project_id), "model_id": str(sm.model_id),
            "generated_on": sm.generated_on.isoformat(), **wall("MODELLED"), "summary": sm.summary,
            "cells": [{**c, **wall(c.get("data_class", "MODELLED"))} for c in sm.cells]}


def latest_soc_map(db: Session, user: CurrentUser, project: Project) -> SocMap | None:
    return db.scalars(scoped(SocMap, user).where(SocMap.project_id == project.id)
                      .order_by(SocMap.created_at.desc())).first()


def sampling_optimiser(db: Session, user: CurrentUser, project: Project, budget: int) -> dict[str, Any]:
    if budget < 1:
        raise ValidationFailed("The budget must be at least one sample.")
    sm = latest_soc_map(db, user, project)
    if sm is None:
        raise Blocked("Generate a soil-carbon map for this project first; the optimiser ranks fields from it.",
                      code="NO_SOC_MAP")
    providers = get_providers()
    fields = {str(f.id): f for f in supporting.enrolled_fields(db, user.org_id, project.id)}
    on = today() - timedelta(days=7)
    strata = db.scalars(scoped(Stratum, user).where(Stratum.project_id == project.id,
                                                    Stratum.effective_to.is_(None))).all()
    stratum_of: dict[str, Stratum] = {}
    for st in strata:
        for fid in st.field_ids or []:
            stratum_of[str(fid)] = st
    recs = []
    for c in sm.cells:
        f = fields.get(c["field_id"])
        if f is None:
            continue
        tier = supporting.field_coverage(db, f, on, providers)["best_tier"]
        reasons = list(c.get("reasons", []))
        extra = 0
        if tier == 3:
            reasons.append("Only external (regional) supporting data: add a sample to reduce uncertainty")
            extra = 1
        if not c.get("in_domain", False):
            if extra == 0:
                reasons.append("Outside the model's training data: add a sample to extend it")
            extra = 1
        st = stratum_of.get(c["field_id"])
        recs.append({"field_id": c["field_id"], "field_code": c["field_code"], "priority": c["priority"],
                     "predicted_soc_pct": c.get("predicted_soc_pct"), "supporting_tier": tier,
                     "in_domain": c.get("in_domain", False), "suggested_samples": 1 + extra,
                     "stratum": st.code if st else None, "reasons": reasons})
    recs.sort(key=lambda r: (-r["priority"], -r["suggested_samples"], r["field_code"]))
    chosen = recs[:budget]
    per_stratum: dict[str, dict[str, Any]] = {}
    for r in chosen:
        key = r["stratum"] or "unstratified"
        s = per_stratum.setdefault(key, {"stratum": key, "fields": 0, "suggested_samples": 0, "extra_samples": 0})
        s["fields"] += 1
        s["suggested_samples"] += r["suggested_samples"]
        s["extra_samples"] += r["suggested_samples"] - 1
    return {"project_id": str(project.id), "budget": budget, "soc_map_id": str(sm.id), **wall("MODELLED"),
            "recommendations": chosen, "per_stratum": sorted(per_stratum.values(), key=lambda s: s["stratum"]),
            "total_suggested_samples": sum(r["suggested_samples"] for r in chosen)}


# ------------------------------------------------------------------ other gases (helper)
N_KEYS = ("n_kg", "nitrogen_kg")


def _n_kg(rec: PracticeRecord) -> float | None:
    d = rec.details or {}
    for k in N_KEYS:
        if isinstance(d.get(k), (int, float)):
            return float(d[k])
    if isinstance(d.get("n_pct"), (int, float)) and rec.quantity is not None and (rec.unit or "kg") == "kg":
        return float(rec.quantity) * float(d["n_pct"]) / 100.0
    return None


def emissions_estimate(db: Session, user: CurrentUser, project: Project, start: date, end: date) -> dict[str, Any]:
    if end < start:
        raise ValidationFailed("The end date can't be before the start date.")
    pt = db.scalar(select(PracticeType).where(PracticeType.org_id == user.org_id,
                                              PracticeType.code == "synthetic_fertiliser"))
    keys = list(pt.emission_factor_keys or []) if pt else []
    if not keys:
        raise RuleMissing(
            "No emission-factor key is set for synthetic fertiliser in the practice catalogue, so no estimate "
            "can be made.", details={"practice_code": "synthetic_fertiliser", "factor_keys": []})
    rules = ruleset.for_project(db, project)
    factors = rules.get("emission_factors")
    missing = [k for k in keys if not isinstance(factors, dict) or factors.get(k) is None]
    if missing:
        raise RuleMissing(
            "The approved methodology rules don't include the emission factors needed for this estimate: "
            + ", ".join(missing) + ". Nothing is assumed.",
            details={"rule_key": "emission_factors", "factor_keys": missing, "pack_id": rules.pack_id},
        )
    factor_values: dict[str, float] = {}
    for k in keys:
        v = factors[k]
        v = v.get("value") if isinstance(v, dict) else v
        if not isinstance(v, (int, float)) or v < 0:
            raise RuleMissing(f"The emission factor {k} in the rule pack is not a valid number.",
                              details={"rule_key": "emission_factors", "factor_keys": [k]})
        factor_values[k] = float(v)
    fields = supporting.enrolled_fields(db, user.org_id, project.id)
    recs = [r for r in latest_active_practices(db, user.org_id, [f.id for f in fields])
            if r.practice_code == "synthetic_fertiliser" and start <= r.performed_on <= end]
    by_scenario: dict[str, dict[str, Any]] = {}
    missing_n = []
    for r in recs:
        n = _n_kg(r)
        if n is None:
            missing_n.append(str(r.record_id))
            continue
        s = by_scenario.setdefault(r.scenario, {"records": 0, "n_kg": 0.0, "t_co2e": 0.0})
        s["records"] += 1
        s["n_kg"] += n
        s["t_co2e"] += sum(n * fv for fv in factor_values.values())
    for s in by_scenario.values():
        s["n_kg"], s["t_co2e"] = round(s["n_kg"], 3), round(s["t_co2e"], 6)
    return {
        "project_id": str(project.id), "start": start.isoformat(), "end": end.isoformat(),
        "factors": {k: {"value": v, "source": rules.sources.get("emission_factors", "")} for k, v in factor_values.items()},
        "by_scenario": by_scenario, "records_missing_n": missing_n,
        **wall("MODELLED", "An estimate only: project emissions are credited solely through project terms entered "
                           "and approved under the rule pack."),
        "note": "An estimate to inform project term entries. It does not create or change any term.",
        "rule_pack": rules.snapshot()["methodology"],
    }


# ------------------------------------------------------------------ feature store
def feature_set_out(fs: FeatureSet) -> dict[str, Any]:
    return {"id": str(fs.id), "name": fs.name, "version": fs.version, "definition": fs.definition,
            "columns": fs.columns, "status": fs.status, "description": fs.description,
            "definition_sha256": fstore.sha256(fs.definition), "created_at": fs.created_at.isoformat(),
            "created_by": str(fs.created_by) if fs.created_by else None,
            "credit_eligible": False}  # model inputs inform sampling only; credits come from lab results


def feature_catalogue() -> list[dict[str, Any]]:
    return [{"feature": k, "group": g, "window_required": w, "unit": u, "data_class": dc, "description": d}
            for k, (g, w, u, dc, d) in fstore.CATALOGUE.items()]


def create_feature_set(db: Session, user: CurrentUser, name: str, definition: dict[str, Any],
                       description: str = "") -> FeatureSet:
    specs = fstore.parse_definition(definition)
    n_prev = db.scalar(select(func.max(FeatureSet.version)).where(
        FeatureSet.org_id == user.org_id, FeatureSet.name == name)) or 0
    items = []
    for sp in specs:
        item: dict[str, Any] = {"feature": sp.feature, "column": sp.column, **sp.options}
        if sp.window_days:
            item["window_days"] = sp.window_days
        items.append(item)
    fs = FeatureSet(org_id=user.org_id, created_by=user.id, name=name, version=n_prev + 1,
                    definition={"features": items}, columns=[sp.column for sp in specs], status="active",
                    description=description)
    db.add(fs)
    audit(db, user, "feature_set.create", fs)
    return fs


def retire_feature_set(db: Session, user: CurrentUser, fs_id: str) -> FeatureSet:
    fs = get_owned(db, FeatureSet, fs_id, user, "Feature set")
    if fs.status != "active":
        raise IllegalTransition("This feature set is already retired.")
    before = snapshot(fs)
    fs.status = "retired"
    audit(db, user, "feature_set.retire", fs, before=before)
    return fs


def find_feature_set(db: Session, user: CurrentUser, ref: str, version: int | None = None) -> FeatureSet:
    try:
        uuid.UUID(ref)
    except ValueError:
        q = scoped(FeatureSet, user).where(FeatureSet.name == ref)
        q = q.where(FeatureSet.version == version) if version else q.where(FeatureSet.status == "active")
        fs = db.scalars(q.order_by(FeatureSet.version.desc())).first()
        if fs is None:
            raise NotFound("Feature set not found.")
        return fs
    return get_owned(db, FeatureSet, ref, user, "Feature set")


def field_feature_out(r: FieldFeature, fs: FeatureSet) -> dict[str, Any]:
    return {"id": str(r.id), "field_id": str(r.field_id), "feature_set_id": str(fs.id),
            "feature_set": f"{fs.name} v{fs.version}", "as_of_date": r.as_of_date.isoformat(), "values": r.values,
            "data_classes": r.data_classes, "details": r.details, "input_fingerprint": r.input_fingerprint,
            "created_at": r.created_at.isoformat(), **wall("DERIVED"),
            "point_in_time": f"computed only from data observed on or before {r.as_of_date.isoformat()}"}


def materialize(db: Session, user: CurrentUser, fs_id: str, project_id: str, as_of: date) -> dict[str, Any]:
    fs = get_owned(db, FeatureSet, fs_id, user, "Feature set")
    if fs.status != "active":
        raise Blocked("This feature set is retired. Choose an active version.", code="FEATURE_SET_RETIRED")
    if as_of > today():
        raise ValidationFailed("Features can't be materialised for a future date.", code="FUTURE_AS_OF")
    project = get_owned(db, Project, project_id, user, "Project")
    specs = fstore.parse_definition(fs.definition)
    fields = supporting.enrolled_fields(db, user.org_id, project.id)
    practices = latest_active_practices(db, user.org_id, [f.id for f in fields])
    written, unchanged, items = 0, 0, []
    for f in fields:
        vec = fstore.compute_vector(db, f, as_of, specs, practices=practices)
        prev = db.scalars(select(FieldFeature).where(
            FieldFeature.field_id == f.id, FieldFeature.feature_set_id == fs.id, FieldFeature.as_of_date == as_of)
            .order_by(FieldFeature.created_at.desc())).first()
        if prev is not None and prev.input_fingerprint == vec.fingerprint:
            unchanged += 1
            items.append({**field_feature_out(prev, fs), "status": "unchanged"})
            continue
        row = FieldFeature(org_id=user.org_id, created_by=user.id, field_id=f.id, feature_set_id=fs.id,
                           project_id=project.id, as_of_date=as_of, values=vec.values, details=vec.details,
                           data_classes=vec.data_classes, input_fingerprint=vec.fingerprint)
        db.add(row)
        db.flush()
        written += 1
        items.append({**field_feature_out(row, fs), "status": "new" if prev is None else "recomputed"})
    audit(db, user, "feature_set.materialize", fs,
          reason=f"project {project.code} as of {as_of.isoformat()}: {written} written, {unchanged} unchanged")
    return {"feature_set_id": str(fs.id), "feature_set": f"{fs.name} v{fs.version}", "project_id": str(project.id),
            "as_of_date": as_of.isoformat(), "fields": len(fields), "written": written, "unchanged": unchanged,
            "items": items, **wall("DERIVED")}


def field_features(db: Session, user: CurrentUser, fld: Field, ref: str, version: int | None,
                   as_of: date | None) -> dict[str, Any]:
    fs = find_feature_set(db, user, ref, version)
    q = scoped(FieldFeature, user).where(FieldFeature.field_id == fld.id, FieldFeature.feature_set_id == fs.id)
    if as_of:
        q = q.where(FieldFeature.as_of_date <= as_of)
    row = db.scalars(q.order_by(FieldFeature.as_of_date.desc(), FieldFeature.created_at.desc())).first()
    if row is None:
        when = f" on or before {as_of.isoformat()}" if as_of else ""
        raise NotFound(f"No features have been materialised for this field and feature set{when}.")
    return field_feature_out(row, fs)


# ------------------------------------------------------------------ model drift
DRIFT_DEFAULTS = {
    "bias_sd": 1.0, "coverage_min": 0.80, "rmse_ratio": 1.5,                # drift
    "warn_bias_sd": 0.5, "warn_coverage_min": 0.85, "warn_rmse_ratio": 1.2,  # warning
    "min_rows": 3,
}


def drift_out(r: DriftReport) -> dict[str, Any]:
    return {"id": str(r.id), "model_id": str(r.model_id), "status": r.status, "n_new": r.n_new,
            "metrics": r.metrics, "baseline": r.baseline, "thresholds": r.thresholds, "reasons": r.reasons,
            "rows": r.rows, "action": r.action, "created_at": r.created_at.isoformat(),
            "created_by": str(r.created_by) if r.created_by else None, **wall("MODELLED")}


def drift_check(db: Session, user: CurrentUser, model_id: str,
                overrides: dict[str, float] | None = None) -> DriftReport:
    """Evaluate a model on accepted lab results that were NOT in its training set.

    drift   if |bias| > bias_sd × residual SD, or interval coverage < coverage_min, or
            RMSE > rmse_ratio × validation RMSE;
    warning if any of the softer warn_* thresholds is crossed; ok otherwise;
    insufficient when fewer than min_rows new results have complete features.
    An approved model with drift is flagged review_required; it is never retired automatically."""
    mv = get_owned(db, ModelVersion, model_id, user, "Model")
    if mv.kind != "soc_prediction" or not (mv.params or {}).get("features"):
        raise ValidationFailed("Drift checks apply to trained SOC prediction models only.")
    th = {**DRIFT_DEFAULTS, **{k: v for k, v in (overrides or {}).items() if v is not None}}
    ts = mv.training_summary or {}
    trained = set(ts.get("samples", []))
    proj_id = ts.get("project_id")
    rows = _training_rows(db, user.org_id, uuid.UUID(proj_id) if proj_id else None)
    new = [r for r in rows if r["sample"].code not in trained]
    practices = latest_active_practices(db, user.org_id, list({r["field"].id for r in new}))
    out_rows, skipped = [], []
    for r in new:
        as_of = _aware(r["sample"].collected_at).date()
        vals, _ = model_vector(db, mv, r["field"], as_of, practices, clay_lab=r["clay"])
        missing = [k for k, v in vals.items() if v is None]
        if missing:
            skipped.append({"sample_code": r["sample"].code, "missing_features": missing})
            continue
        p = domain.predict_interval(mv.params, {k: float(v) for k, v in vals.items()})
        y = float(r["soc"])
        out_rows.append({"sample_code": r["sample"].code, "field_id": str(r["field"].id), "lab_soc_pct": y,
                         "predicted_soc_pct": p["predicted_soc_pct"], "lower": p["lower"], "upper": p["upper"],
                         "residual": round(y - p["predicted_soc_pct"], 6), "in_domain": p["in_domain"],
                         "covered": p["lower"] <= y <= p["upper"]})
    base = {"validation_rmse": mv.metrics.get("rmse"), "validation_bias": mv.metrics.get("bias"),
            "validation_coverage_90": mv.metrics.get("coverage_90"), "residual_sd": mv.params.get("residual_sd")}
    reasons: list[str] = []
    n = len(out_rows)
    metrics: dict[str, Any] = {"skipped": skipped}
    if n < th["min_rows"]:
        status = "insufficient"
        reasons.append(f"Only {n} new accepted lab result(s) not used in training; at least {int(th['min_rows'])} "
                       "are needed for a drift check.")
    else:
        y = np.array([x["lab_soc_pct"] for x in out_rows])
        pred = np.array([x["predicted_soc_pct"] for x in out_rows])
        m = domain.metrics(y, pred)
        cov = float(np.mean([x["covered"] for x in out_rows]))
        sd = float(base["residual_sd"] or 0.0)
        vr = float(base["validation_rmse"] or 0.0)
        rmse_ratio = m["rmse"] / vr if vr > 0 else float("inf")
        bias_sd = abs(m["bias"]) / sd if sd > 0 else float("inf")
        metrics.update({"rmse": m["rmse"], "mae": m["mae"], "bias": m["bias"], "coverage": round(cov, 4),
                        "out_of_domain": sum(1 for x in out_rows if not x["in_domain"]),
                        "rmse_ratio": round(rmse_ratio, 4), "bias_in_residual_sd": round(bias_sd, 4)})
        status = "ok"
        checks = (
            (bias_sd > th["bias_sd"], bias_sd > th["warn_bias_sd"],
             f"|bias| {abs(m['bias']):.3f} is {bias_sd:.2f} residual SDs (drift above {th['bias_sd']})"),
            (cov < th["coverage_min"], cov < th["warn_coverage_min"],
             f"interval coverage {cov:.0%} (drift below {th['coverage_min']:.0%})"),
            (rmse_ratio > th["rmse_ratio"], rmse_ratio > th["warn_rmse_ratio"],
             f"RMSE {m['rmse']:.3f} is {rmse_ratio:.2f}x the validation RMSE (drift above {th['rmse_ratio']}x)"),
        )
        for is_drift, is_warn, text in checks:
            if is_drift:
                status = "drift"
                reasons.append(text)
            elif is_warn:
                if status == "ok":
                    status = "warning"
                reasons.append("warning: " + text)
    action = "review_required" if status == "drift" and mv.status == "approved" else "none"
    rep = DriftReport(org_id=user.org_id, created_by=user.id, model_id=mv.id, status=status, n_new=n,
                      metrics=metrics, baseline=base, thresholds=th, reasons=reasons, rows=out_rows, action=action)
    db.add(rep)
    audit(db, user, "model.drift_check", rep)
    before = snapshot(mv)
    new_metrics = {**(mv.metrics or {}), "latest_drift": {
        "report_id": str(rep.id), "status": status, "checked_at": utcnow().isoformat(), "n_new": n}}
    if action == "review_required":  # sticky: only a reviewer's decision clears it, never a later check
        new_metrics["review"] = {"required": True, "report_id": str(rep.id), "flagged_at": utcnow().isoformat()}
    mv.metrics = new_metrics
    if action == "review_required":
        mv.notes = (mv.notes + " " if mv.notes else "") + (
            f"Review required: drift found on {today().isoformat()} against {n} new lab results "
            f"(report {rep.id}). The model stays approved until a reviewer decides.")
        audit(db, user, "model.review_required", mv, before=before, reason="; ".join(reasons))
    else:
        audit(db, user, "model.drift_status", mv, before=before)
    return rep


def drift_reports(db: Session, user: CurrentUser, model_id: str) -> list[dict[str, Any]]:
    mv = get_owned(db, ModelVersion, model_id, user, "Model")
    rows = db.scalars(scoped(DriftReport, user).where(DriftReport.model_id == mv.id)
                      .order_by(DriftReport.created_at.desc())).all()
    return [drift_out(r) for r in rows]


def review_required(m: ModelVersion) -> bool:
    return bool(((m.metrics or {}).get("review") or {}).get("required"))


def resolve_drift_review(db: Session, user: CurrentUser, model_id: str, decision: str, note: str) -> ModelVersion:
    """A reviewer (neither the model's author nor whoever ran the flagging drift check) keeps or retires an approved model flagged by a drift check."""
    mv = get_owned(db, ModelVersion, model_id, user, "Model")
    if not review_required(mv):
        raise IllegalTransition("This model has no open drift review.")
    flagged_by = db.scalar(select(DriftReport.created_by).where(
        DriftReport.org_id == mv.org_id, DriftReport.model_id == mv.id, DriftReport.action == "review_required")
        .order_by(DriftReport.created_at.desc()).limit(1))
    ensure_not_author(user.id, mv.created_by, flagged_by, what="a drift review of a model")
    before = snapshot(mv)
    review = {**mv.metrics["review"], "required": False, "decision": decision, "note": note,
              "resolved_by": str(user.id), "resolved_at": utcnow().isoformat()}
    mv.metrics = {**mv.metrics, "review": review}
    if decision == "retire":
        mv.status = "retired"
    audit(db, user, "model.drift_review", mv, before=before, reason=f"{decision}: {note}")
    return mv
