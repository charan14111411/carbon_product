"""Feature store: versioned feature definitions and point-in-time feature vectors per field.

Point-in-time rule
------------------
A vector "as of D" uses only data whose *event date* is on or before D: supporting observations
with ``observed_on ≤ D``, satellite passes with ``observed_on ≤ D`` (clear passes only), practice
records with ``performed_on ≤ D``. Windows end on D and reach back ``window_days`` (inclusive).
Terrain / soil-map / location attributes are static site attributes and are treated as
time-invariant (documented, not versioned in time).

Every column carries a data class (DERIVED for computed windows, OBSERVED for satellite means,
DERIVED for LAI, MODELLED for soil-map texture, RECORDED for practice counts, DERIVED for DEM
terrain) and the whole vector carries a SHA-256 fingerprint of every input it used, so two
materialisations with identical inputs are provably identical.
"""

from __future__ import annotations

import hashlib
import json
import math
import uuid
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.errors import ValidationFailed
from app.modules.intelligence.models import SatelliteIndex
from app.modules.intelligence.providers import CLOUD_LIMIT_PCT, INDEX_CLASSES
from app.modules.land.models import Field
from app.modules.practices.models import PracticeRecord
from app.modules.supporting import derived
from app.modules.supporting import service as supporting
from app.modules.supporting.providers import get_providers

MAX_WINDOW_DAYS = 730
MIN_SAT_PASSES = 3
MIN_TREND_PASSES = 4

# feature -> (group, needs_window, unit, data_class, description)
CATALOGUE: dict[str, tuple[str, bool, str, str, str]] = {
    # SoilSync / MicroClime derived (supporting.derived)
    "sm20_mean": ("sensor", True, "% vol", "DERIVED", "Mean soil moisture at 20 cm"),
    "sm20_min": ("sensor", True, "% vol", "DERIVED", "Minimum soil moisture at 20 cm"),
    "sm20_max": ("sensor", True, "% vol", "DERIVED", "Maximum soil moisture at 20 cm"),
    "sm60_mean": ("sensor", True, "% vol", "DERIVED", "Mean soil moisture at 60 cm"),
    "sm60_min": ("sensor", True, "% vol", "DERIVED", "Minimum soil moisture at 60 cm"),
    "sm60_max": ("sensor", True, "% vol", "DERIVED", "Maximum soil moisture at 60 cm"),
    "sm_gradient": ("sensor", True, "% vol", "DERIVED", "Mean SM20 − SM60"),
    "dry_down_rate": ("sensor", True, "% vol/day", "DERIVED", "Mean drying rate over rain-free spells"),
    "wetness_days": ("sensor", True, "days", "DERIVED", "Days with SM20 at or above the field-capacity proxy"),
    "vpd_mean": ("weather", True, "kPa", "DERIVED", "Mean vapour-pressure deficit (Tetens)"),
    "vpd_max": ("weather", True, "kPa", "DERIVED", "Maximum daily vapour-pressure deficit (Tetens)"),
    "rain_total": ("weather", True, "mm", "DERIVED", "Rain total over the window"),
    "heavy_rain_days": ("weather", True, "days", "DERIVED", "Days with rain > 25 mm"),
    "temp_mean": ("weather", True, "°C", "DERIVED", "Mean daily air temperature"),
    "gdd_base10": ("weather", True, "°C·day", "DERIVED", "Growing degree days, base 10 °C"),
    # satellite (clear passes only)
    "ndvi_mean": ("satellite", True, "", "OBSERVED", "Mean NDVI"),
    "ndvi_trend": ("satellite", True, "per 30 days", "DERIVED", "OLS slope of NDVI"),
    "ndmi_mean": ("satellite", True, "", "OBSERVED", "Mean NDMI"),
    "ndwi_mean": ("satellite", True, "", "OBSERVED", "Mean NDWI (McFeeters)"),
    "lai_mean": ("satellite", True, "m²/m²", "DERIVED", "Mean LAI (derived from NDVI)"),
    "lst_mean": ("satellite", True, "°C", "OBSERVED", "Mean land-surface temperature"),
    # terrain / site (static)
    "elevation_m": ("terrain", False, "m", "DERIVED", "Field elevation (DEM or field record)"),
    "slope_pct": ("terrain", False, "%", "DERIVED", "Field mean slope (DEM)"),
    "aspect_northness": ("terrain", False, "", "DERIVED", "cos(aspect): +1 north-facing, −1 south-facing"),
    "aspect_eastness": ("terrain", False, "", "DERIVED", "sin(aspect): +1 east-facing, −1 west-facing"),
    "mean_annual_precip_mm": ("site", False, "mm", "RECORDED", "Mean annual precipitation on the field record"),
    # soil map
    "clay_pct": ("soil", False, "%", "MODELLED", "Soil-map clay content"),
    "sand_pct": ("soil", False, "%", "MODELLED", "Soil-map sand content"),
    # management
    "practice_count": ("management", False, "records", "RECORDED",
                       "Project-scenario practice records performed on or before the date (window optional)"),
}
SENSOR_WEATHER = {k for k, v in CATALOGUE.items() if v[0] in ("sensor", "weather")}


@dataclass
class Spec:
    feature: str
    window_days: int | None
    column: str
    options: dict[str, Any] = field(default_factory=dict)


def parse_definition(definition: dict[str, Any]) -> list[Spec]:
    items = definition.get("features") if isinstance(definition, dict) else None
    if not isinstance(items, list) or not items:
        raise ValidationFailed("A feature set needs a non-empty 'features' list.", code="INVALID_FEATURE_SET")
    specs: list[Spec] = []
    errors: list[str] = []
    for i, it in enumerate(items):
        if isinstance(it, str):
            it = {"feature": it}
        if not isinstance(it, dict) or it.get("feature") not in CATALOGUE:
            errors.append(f"item {i}: unknown feature {it.get('feature') if isinstance(it, dict) else it!r}")
            continue
        name = it["feature"]
        needs_window = CATALOGUE[name][1]
        w = it.get("window_days")
        if needs_window and w is None:
            errors.append(f"{name}: window_days is required")
            continue
        if w is not None and (not isinstance(w, int) or isinstance(w, bool) or not 1 <= w <= MAX_WINDOW_DAYS):
            errors.append(f"{name}: window_days must be a whole number from 1 to {MAX_WINDOW_DAYS}")
            continue
        if w is not None and not needs_window and name != "practice_count":
            errors.append(f"{name}: is a static attribute and takes no window")
            continue
        opts = {k: v for k, v in it.items() if k not in ("feature", "window_days", "column")}
        if "wet_threshold_pct" in opts:
            v = opts["wet_threshold_pct"]
            if name != "wetness_days" or not isinstance(v, (int, float)) or not 0 < v <= 100:
                errors.append(f"{name}: wet_threshold_pct applies to wetness_days only and must be in (0, 100]")
                continue
        unknown_opts = set(opts) - {"wet_threshold_pct"}
        if unknown_opts:
            errors.append(f"{name}: unknown option(s) {sorted(unknown_opts)}")
            continue
        column = it.get("column") or (f"{name}_{w}d" if w else name)
        specs.append(Spec(name, w, str(column), opts))
    cols = [s.column for s in specs]
    dups = sorted({c for c in cols if cols.count(c) > 1})
    if dups:
        errors.append("duplicate columns: " + ", ".join(dups))
    if errors:
        raise ValidationFailed("The feature set definition is not valid: " + "; ".join(errors) + ".",
                               code="INVALID_FEATURE_SET", details={"errors": errors, "known": sorted(CATALOGUE)})
    return specs


def canonical(obj: Any) -> str:
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), default=str)


def sha256(obj: Any) -> str:
    return hashlib.sha256(canonical(obj).encode("utf-8")).hexdigest()


@dataclass
class Vector:
    values: dict[str, float | None]
    details: dict[str, dict[str, Any]]
    data_classes: dict[str, str]
    fingerprint: str
    inputs: dict[str, Any]


def _sat_rows(db: Session, field_id: uuid.UUID, start: date, end: date) -> list[SatelliteIndex]:
    return list(db.scalars(select(SatelliteIndex).where(
        SatelliteIndex.field_id == field_id, SatelliteIndex.observed_on >= start, SatelliteIndex.observed_on <= end,
        SatelliteIndex.cloud_pct <= CLOUD_LIMIT_PCT)).all())


def _ols_per_30d(pts: list[tuple[date, float]]) -> float:
    d0 = pts[0][0]
    return derived.ols_slope([float((d - d0).days) for d, _ in pts], [v for _, v in pts]) * 30.0


def compute_vector(db: Session, fld: Field, as_of: date, specs: list[Spec],
                   practices: list[PracticeRecord] | None = None) -> Vector:
    """Point-in-time feature vector (see module docstring). Pure read: writes nothing."""
    values: dict[str, float | None] = {}
    details: dict[str, dict[str, Any]] = {}
    classes: dict[str, str] = {}
    inputs: dict[str, Any] = {"as_of": as_of.isoformat(), "field_id": str(fld.id)}

    max_w = max((s.window_days or 0) for s in specs)
    # ---- sensor / weather: one daily load up to as_of
    sw = [s for s in specs if s.feature in SENSOR_WEATHER]
    if sw:
        daily = supporting.daily_inputs(db, fld.id, as_of - timedelta(days=max_w - 1), as_of)
        inputs["daily"] = sorted([p, d.isoformat(), x.provider, x.tier, x.value, x.quality]
                                 for p, s in daily.items() for d, x in s.items())
        default_thr: dict[str, Any] | None = None
        cache: dict[tuple[int, float | None], dict[str, Any]] = {}
        for s in sw:
            thr = s.options.get("wet_threshold_pct")
            if s.feature == "wetness_days" and thr is None:
                default_thr = default_thr or supporting.wetness_threshold(fld, None)
                thr = default_thr["value_pct"]
                inputs["wet_threshold"] = default_thr
            start = as_of - timedelta(days=s.window_days - 1)  # type: ignore[operator]
            key = (s.window_days, thr)  # type: ignore[assignment]
            if key not in cache:
                sub = {p: {d: x for d, x in ser.items() if d >= start} for p, ser in daily.items()}
                cache[key] = derived.period_features(sub, start, as_of, thr)
            v = cache[key][s.feature]
            values[s.column] = v["value"]
            details[s.column] = {"window": [start.isoformat(), as_of.isoformat()], "n_days": v["n_days"],
                                 "source_tiers": v["source_tiers"], "providers": v["providers"],
                                 "input_data_classes": v["input_data_classes"], "quality": v["quality"],
                                 **({"threshold_pct": thr} if s.feature == "wetness_days" else {})}
            classes[s.column] = "DERIVED"
    # ---- satellite
    sat = [s for s in specs if CATALOGUE[s.feature][0] == "satellite"]
    if sat:
        rows = _sat_rows(db, fld.id, as_of - timedelta(days=max_w - 1), as_of)
        inputs["satellite"] = sorted([r.index_name, r.observed_on.isoformat(), r.source, r.value, r.cloud_pct]
                                     for r in rows)
        for s in sat:
            idx = s.feature.split("_")[0]
            start = as_of - timedelta(days=s.window_days - 1)  # type: ignore[operator]
            by_day: dict[date, list[float]] = defaultdict(list)
            for r in rows:
                if r.index_name == idx and r.observed_on >= start:
                    by_day[r.observed_on].append(r.value)
            pts = sorted((d, sum(v) / len(v)) for d, v in by_day.items())
            if s.feature.endswith("_trend"):
                val = round(_ols_per_30d(pts), 6) if len(pts) >= MIN_TREND_PASSES else None
            else:
                val = round(sum(v for _, v in pts) / len(pts), 5) if len(pts) >= MIN_SAT_PASSES else None
            values[s.column] = val
            details[s.column] = {"window": [start.isoformat(), as_of.isoformat()], "clear_passes": len(pts),
                                 "min_passes": MIN_TREND_PASSES if s.feature.endswith("_trend") else MIN_SAT_PASSES}
            classes[s.column] = "DERIVED" if s.feature.endswith("_trend") else INDEX_CLASSES.get(idx, "OBSERVED")
    # ---- static site / terrain / soil / management
    soil_props = None
    for s in specs:
        g = CATALOGUE[s.feature][0]
        if g == "terrain" or g == "site":
            if s.feature in ("aspect_northness", "aspect_eastness"):
                a = fld.aspect_deg
                val = None if a is None else round((math.cos if s.feature == "aspect_northness" else math.sin)(
                    math.radians(a)), 6)
                src = {"aspect_deg": a}
            else:
                val = getattr(fld, s.feature)
                src = {s.feature: val}
            values[s.column] = None if val is None else float(val)
            details[s.column] = {"source": "field record (static site attribute)", **src}
            classes[s.column] = CATALOGUE[s.feature][3]
            inputs.setdefault("field", {}).update(src)
        elif g == "soil":
            if soil_props is None:
                soil = get_providers().soil
                soil_props = soil.properties(fld.centroid_lat, fld.centroid_lon)
                inputs["soil_map"] = {"ref": soil.source_ref(fld.centroid_lat, fld.centroid_lon), **soil_props}
            values[s.column] = soil_props.get(s.feature)
            details[s.column] = {"source": inputs["soil_map"]["ref"]}
            classes[s.column] = "MODELLED"
        elif g == "management":
            recs = practices if practices is not None else _latest_practices(db, fld)
            start = as_of - timedelta(days=s.window_days - 1) if s.window_days else None
            used = [r for r in recs if r.field_id == fld.id and r.scenario == "project" and r.performed_on <= as_of
                    and (start is None or r.performed_on >= start)]
            values[s.column] = float(len(used))
            details[s.column] = {"source": "practice records", "records": len(used)}
            classes[s.column] = "RECORDED"
            inputs.setdefault("practices", {})[s.column] = sorted(
                [str(r.record_id), r.version, r.performed_on.isoformat()] for r in used)
    ordered = {s.column: values[s.column] for s in specs}
    return Vector(ordered, details, classes, sha256({"specs": [s.__dict__ for s in specs], "inputs": inputs}), inputs)


def _latest_practices(db: Session, fld: Field) -> list[PracticeRecord]:
    from app.modules.intelligence.service import latest_active_practices

    return latest_active_practices(db, fld.org_id, [fld.id])
