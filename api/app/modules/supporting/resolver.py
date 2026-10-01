"""Choose the best available source for a field's daily supporting value.

Tiers (best first):

1. A Varsapradaya device on this field (or on its farm) that measures the parameter and is online.
2. A Varsapradaya device within 25 km horizontally *and* within 300 m elevation (when both
   elevations are known), nearest first.
3. An external provider (regional weather reanalysis, soil maps).
0. Not available – the value is ``None`` and the note says why (including "external source unavailable"
   when a real provider could not be reached; the sync carries on).

Quality (0..1) = tier base (1: 1.0, 2: 0.8, 3: 0.5) × distance factor (tier 2 only:
max(0.5, 1 − d/50 km)) × freshness (1.0 normally; 0.9 for a device that has never sent a
heartbeat; 0.8 for a device silent for more than 2 days or a preliminary external value
from the last 3 days).

Tier-3 rainfall and air temperature are bias-corrected when a Varsapradaya station within
50 km has at least 14 days overlapping with the external source (ratio for rain,
difference for temperature).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, date, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.errors import ProviderUnavailable
from app.core.geo import distance_m
from app.modules.land.models import Field
from app.modules.supporting.models import PARAMETERS, Device
from app.modules.supporting.providers import DeviceRef, Providers, get_providers

TIER_BASE = {1: 1.0, 2: 0.8, 3: 0.5, 0: 0.0}
NEARBY_KM = 25.0
ELEVATION_TOLERANCE_M = 300.0
BIAS_RADIUS_KM = 50.0
BIAS_MIN_OVERLAP_DAYS = 14
BIAS_LOOKBACK_DAYS = 90
BIAS_METHODS = {"rain_mm": "ratio", "air_temp_c": "difference"}
RATIO_LIMITS = (0.5, 2.0)
STALE_DEVICE_DAYS = 2
SOIL_MAP_PARAMETERS = {"soil_ph": "ph"}


@dataclass
class Resolved:
    parameter: str
    observed_on: date
    value: float | None
    unit: str
    tier: int
    provider: str
    source_ref: str
    quality: float
    data_class: str | None
    distance_km: float | None = None
    bias_corrected: bool = False
    note: str = ""
    device_id: str | None = None


@dataclass
class BiasCorrection:
    method: str
    factor: float
    station: str
    distance_km: float
    overlap_days: int

    def apply(self, v: float) -> float:
        if self.method == "ratio":
            return round(max(0.0, v * self.factor), 2)
        return round(v + self.factor, 2)

    def describe(self) -> str:
        what = f"ratio {self.factor:.3f}" if self.method == "ratio" else f"difference {self.factor:+.2f}"
        return (f"Bias-corrected against station {self.station} ({self.distance_km:.1f} km away): "
                f"{what} over {self.overlap_days} overlapping days.")


@dataclass
class _Candidates:
    tier1: list[tuple[Device, float]] = field(default_factory=list)
    tier2: list[tuple[Device, float]] = field(default_factory=list)
    excluded: list[str] = field(default_factory=list)


def _aware(dt: datetime | None) -> datetime | None:
    if dt is None:
        return None
    return dt if dt.tzinfo else dt.replace(tzinfo=UTC)


def device_ref(d: Device) -> DeviceRef:
    return DeviceRef(
        external_id=d.external_id, kind=d.kind, latitude=d.latitude, longitude=d.longitude, status=d.status,
        parameters=tuple(d.parameters or ()), last_seen_at=_aware(d.last_seen_at), calibrated_on=d.calibrated_on,
    )


def km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    return distance_m(lat1, lon1, lat2, lon2) / 1000.0


def _device_freshness(d: Device, today: date) -> tuple[float, str]:
    seen = _aware(d.last_seen_at)
    if seen is None:
        return 0.9, "Device has not sent a heartbeat yet."
    age = (today - seen.date()).days
    if age <= STALE_DEVICE_DAYS:
        return 1.0, ""
    return 0.8, f"Device last seen {age} days ago."


def _org_devices(db: Session, f: Field, parameter: str) -> list[Device]:
    rows = db.scalars(select(Device).where(Device.org_id == f.org_id, Device.status != "retired")).all()
    return [d for d in rows if parameter in (d.parameters or [])]


def _has_kept_readings(db: Session, d: Device, parameter: str) -> bool:
    from app.modules.supporting.models import DeviceReading

    return db.scalar(select(DeviceReading.id).where(DeviceReading.device_id == d.id,
                                                    DeviceReading.parameter == parameter).limit(1)) is not None


def candidates(db: Session, f: Field, parameter: str) -> _Candidates:
    out = _Candidates()
    for d in _org_devices(db, f, parameter):
        dist = km(f.centroid_lat, f.centroid_lon, d.latitude, d.longitude)
        if d.status != "online" and not (d.status == "offline" and _has_kept_readings(db, d, parameter)):
            # An offline device is skipped, unless real readings it sent earlier were kept (Varsapradaya
            # devices): those are still measurements for the days they cover.
            out.excluded.append(f"{d.name} is {d.status}")
            continue
        if d.field_id == f.id or (d.farm_id is not None and d.farm_id == f.farm_id):
            out.tier1.append((d, dist))
            continue
        if dist > NEARBY_KM:
            continue
        if d.elevation_m is not None and f.elevation_m is not None:
            if abs(d.elevation_m - f.elevation_m) > ELEVATION_TOLERANCE_M:
                out.excluded.append(f"{d.name} is within {NEARBY_KM:.0f} km but more than "
                                    f"{ELEVATION_TOLERANCE_M:.0f} m higher or lower")
                continue
        out.tier2.append((d, dist))
    out.tier1.sort(key=lambda t: (t[0].field_id != f.id, t[1], t[0].external_id))
    out.tier2.sort(key=lambda t: (t[1], t[0].external_id))
    return out


def bias_correction(
    db: Session, f: Field, parameter: str, start: date, end: date, providers: Providers,
) -> BiasCorrection | None:
    method = BIAS_METHODS.get(parameter)
    if method is None:
        return None
    stations = []
    for d in _org_devices(db, f, parameter):
        if d.status != "online":
            continue
        dist = km(f.centroid_lat, f.centroid_lon, d.latitude, d.longitude)
        if dist <= BIAS_RADIUS_KM:
            stations.append((dist, d))
    stations.sort(key=lambda t: (t[0], t[1].external_id))
    window_start = start - timedelta(days=BIAS_LOOKBACK_DAYS)
    for dist, d in stations:
        station = providers.device.daily(device_ref(d), parameter, window_start, end)
        if len(station) < BIAS_MIN_OVERLAP_DAYS:
            continue
        try:
            external = providers.weather.daily(d.latitude, d.longitude, parameter, window_start, end)
        except ProviderUnavailable:
            return None  # no correction without the external series; the outage is noted on the values
        overlap = sorted(set(station) & set(external))
        if len(overlap) < BIAS_MIN_OVERLAP_DAYS:
            continue
        if method == "ratio":
            ext_sum = sum(external[x] for x in overlap)
            if ext_sum <= 0:
                continue
            factor = sum(station[x] for x in overlap) / ext_sum
            factor = min(RATIO_LIMITS[1], max(RATIO_LIMITS[0], factor))
        else:
            factor = sum(station[x] - external[x] for x in overlap) / len(overlap)
        return BiasCorrection(method, round(factor, 4), d.external_id, round(dist, 2), len(overlap))
    return None


def resolve_series(
    db: Session,
    f: Field,
    parameter: str,
    start: date,
    end: date,
    *,
    providers: Providers | None = None,
    today: date | None = None,
) -> list[Resolved]:
    """One resolved value per day in ``[start, end]``."""
    if parameter not in PARAMETERS:
        raise KeyError(parameter)
    providers = providers or get_providers()
    today = today or datetime.now(UTC).date()
    label, unit = PARAMETERS[parameter]
    cand = candidates(db, f, parameter)

    tier1 = [(d, dist, providers.device.daily(device_ref(d), parameter, start, end)) for d, dist in cand.tier1]
    tier2 = [(d, dist, providers.device.daily(device_ref(d), parameter, start, end)) for d, dist in cand.tier2]

    ext_class = providers.weather.data_class(parameter)
    external: dict[date, float] = {}
    ext_provider, ext_ref = providers.weather.name, ""
    static_value: float | None = None
    ext_down: str | None = None  # a real provider that could not be reached: the values fall back to tier 0
    if ext_class:
        ext_ref = providers.weather.source_ref(f.centroid_lat, f.centroid_lon)
        try:
            external = providers.weather.daily(f.centroid_lat, f.centroid_lon, parameter, start, end)
        except ProviderUnavailable as e:
            ext_down = e.message
    elif parameter in SOIL_MAP_PARAMETERS:
        ext_class, ext_provider = "MODELLED", providers.soil.name
        ext_ref = providers.soil.source_ref(f.centroid_lat, f.centroid_lon)
        try:
            props = providers.soil.properties(f.centroid_lat, f.centroid_lon)
            static_value = props.get(SOIL_MAP_PARAMETERS[parameter])
        except ProviderUnavailable as e:
            ext_down = e.message

    correction: BiasCorrection | None = None
    correction_checked = False
    out: list[Resolved] = []
    day = start
    while day <= end:
        picked: Resolved | None = None
        for tier, group in ((1, tier1), (2, tier2)):
            for d, dist, series in group:
                if day not in series:
                    continue
                fresh, fresh_note = _device_freshness(d, today)
                dist_factor = max(0.5, 1 - dist / 50.0) if tier == 2 else 1.0
                note = "Own device on this field." if d.field_id == f.id else "Device on the same farm."
                if tier == 2:
                    elev = ""
                    if d.elevation_m is not None and f.elevation_m is not None:
                        elev = f", {abs(d.elevation_m - f.elevation_m):.0f} m elevation difference"
                    note = f"Nearby station {d.name} {dist:.1f} km away{elev}."
                picked = Resolved(
                    parameter, day, series[day], unit, tier, d.kind, providers.device.source_ref(device_ref(d)),
                    round(TIER_BASE[tier] * dist_factor * fresh, 3), "MEASURED",
                    distance_km=round(dist, 2) if tier == 2 else None,
                    note=" ".join(x for x in (note, fresh_note) if x), device_id=str(d.id),
                )
                break
            if picked:
                break
        if picked is None and ext_class:
            value = external.get(day, static_value)
            if value is not None:
                if not correction_checked:
                    correction = bias_correction(db, f, parameter, start, end, providers)
                    correction_checked = True
                fresh = 0.8 if (today - day).days < 4 and static_value is None else 1.0
                note = "Regional estimate from an external source."
                if static_value is not None:
                    note = "Static soil-map estimate (not a measurement)."
                if ext_class == "MODELLED" and static_value is None:
                    note = "Modelled by an external source (not a measurement)."
                if fresh < 1.0:
                    note += " Preliminary value (last 3 days)."
                bias = False
                if correction is not None:
                    value = correction.apply(value)
                    note += " " + correction.describe()
                    bias = True
                picked = Resolved(
                    parameter, day, value, unit, 3, ext_provider, ext_ref, round(TIER_BASE[3] * fresh, 3), ext_class,
                    bias_corrected=bias, note=note,
                )
        if picked is None:
            reasons = []
            if not cand.tier1:
                reasons.append("no device on this field or farm")
            if not cand.tier2:
                reasons.append(f"no station within {NEARBY_KM:.0f} km")
            if cand.tier1 or cand.tier2:
                reasons.append("devices had no reading for this day")
            reasons.extend(cand.excluded)
            reasons.append(f"no external source offers {label.lower()}" if not ext_class
                           else f"external source unavailable: {ext_down.rstrip('.')}" if ext_down
                           else "the external source had no value for this day")
            picked = Resolved(
                parameter, day, None, unit, 0, "not_available", "", 0.0, None,
                note="Not available: " + "; ".join(reasons) + ".",
            )
        out.append(picked)
        day += timedelta(days=1)
    return out


def resolve_value(db: Session, f: Field, parameter: str, day: date, **kw) -> Resolved:
    return resolve_series(db, f, parameter, day, day, **kw)[0]
