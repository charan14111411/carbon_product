"""Supporting data: devices, the tiered source resolver, sync into observations, coverage."""

from __future__ import annotations

import uuid
from collections import defaultdict
from datetime import UTC, date, datetime, timedelta
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.db import utcnow
from app.core.errors import Conflict, IllegalTransition, ValidationFailed
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.land.models import Enrolment, Farm, Field
from app.modules.programmes.models import Project
from app.modules.supporting import resolver
from app.modules.supporting.models import PARAMETERS, Device, Observation, SyncRun
from app.modules.supporting.providers import Providers, default_parameters, get_providers
from app.modules.supporting.schemas import MAX_SYNC_DAYS, DeviceIn, DevicePatch

COVERAGE_PARAMETERS = ("rain_mm", "air_temp_c", "soil_moisture_20cm_pct")
TIER_LABELS = {1: "Own device", 2: "Nearby station", 3: "External source", 0: "Not available"}


def today() -> date:
    return datetime.now(UTC).date()


def _aware(dt: datetime | None) -> datetime | None:
    return None if dt is None else (dt if dt.tzinfo else dt.replace(tzinfo=UTC))


def _check_parameters(params: list[str]) -> list[str]:
    unknown = sorted(set(params) - set(PARAMETERS))
    if unknown:
        raise ValidationFailed(
            f"Unknown parameter(s): {', '.join(unknown)}.", code="UNKNOWN_PARAMETER",
            details={"unknown": unknown, "known": sorted(PARAMETERS)},
        )
    return list(dict.fromkeys(params))


# ------------------------------------------------------------------ lookups shared with other modules
def enrolled_fields(db: Session, org_id: uuid.UUID, project_id: uuid.UUID) -> list[Field]:
    q = (
        select(Field)
        .join(Enrolment, Enrolment.field_id == Field.id)
        .where(Enrolment.project_id == project_id, Enrolment.org_id == org_id, Enrolment.status == "enrolled",
               Field.org_id == org_id)
        .order_by(Field.code)
    )
    return list(db.scalars(q).unique().all())


def get_project(db: Session, user: CurrentUser, project_id: str) -> Project:
    return get_owned(db, Project, project_id, user, "Project")


def get_field(db: Session, user: CurrentUser, field_id: str) -> Field:
    return get_owned(db, Field, field_id, user, "Field")


# ------------------------------------------------------------------ devices
def _link(db: Session, user: CurrentUser, farm_id: str | None, field_id: str | None) -> tuple[Farm | None, Field | None]:
    fld = get_owned(db, Field, field_id, user, "Field") if field_id else None
    farm = get_owned(db, Farm, farm_id, user, "Farm") if farm_id else None
    if fld and farm and fld.farm_id != farm.id:
        raise ValidationFailed("The field doesn't belong to the chosen farm.", code="FIELD_FARM_MISMATCH")
    if fld and farm is None:
        farm = db.get(Farm, fld.farm_id)
    return farm, fld


def list_devices(db: Session, user: CurrentUser, *, field_id: str | None = None, status: str | None = None) -> list[Device]:
    q = scoped(Device, user).order_by(Device.name)
    if field_id:
        q = q.where(Device.field_id == uuid.UUID(field_id))
    if status:
        q = q.where(Device.status == status)
    return list(db.scalars(q).all())


def create_device(db: Session, user: CurrentUser, body: DeviceIn) -> Device:
    if db.scalar(scoped(Device, user).where(Device.external_id == body.external_id)):
        raise Conflict("A device with this ID is already registered.", code="DUPLICATE_DEVICE")
    farm, fld = _link(db, user, body.farm_id, body.field_id)
    lat, lon, elev = body.latitude, body.longitude, body.elevation_m
    if lat is None or lon is None:
        if fld is None:
            raise ValidationFailed("Give the device's location, or link it to a field.", code="LOCATION_REQUIRED")
        lat, lon = fld.centroid_lat, fld.centroid_lon
    if elev is None and fld is not None:
        elev = fld.elevation_m
    params = _check_parameters(body.parameters) if body.parameters is not None else default_parameters(body.kind)
    if not params:
        raise ValidationFailed("A device must measure at least one parameter.")
    d = Device(
        org_id=user.org_id, created_by=user.id, kind=body.kind, external_id=body.external_id, name=body.name,
        farm_id=farm.id if farm else None, field_id=fld.id if fld else None, latitude=lat, longitude=lon,
        elevation_m=elev, parameters=params, status=body.status, calibrated_on=body.calibrated_on,
    )
    db.add(d)
    audit(db, user, "device.create", d)
    return d


def update_device(db: Session, user: CurrentUser, device_id: str, body: DevicePatch) -> Device:
    d = get_owned(db, Device, device_id, user, "Device")
    if d.status == "retired":
        raise IllegalTransition("This device is retired and can't be changed. Register a new device instead.")
    before = snapshot(d)
    data = body.model_dump(exclude_unset=True)
    if "farm_id" in data or "field_id" in data:
        farm, fld = _link(db, user, data.pop("farm_id", None), data.pop("field_id", None))
        d.farm_id, d.field_id = (farm.id if farm else None), (fld.id if fld else None)
    if data.get("parameters") is not None:
        data["parameters"] = _check_parameters(data["parameters"])
        if not data["parameters"]:
            raise ValidationFailed("A device must measure at least one parameter.")
    for k, v in data.items():
        if v is not None or k in ("elevation_m", "calibrated_on"):
            setattr(d, k, v)
    audit(db, user, "device.update", d, before=before)
    return d


def heartbeat(db: Session, user: CurrentUser, device_id: str) -> Device:
    d = get_owned(db, Device, device_id, user, "Device")
    if d.status == "retired":
        raise IllegalTransition("This device is retired.")
    before = {"status": d.status, "last_seen_at": d.last_seen_at.isoformat() if d.last_seen_at else None}
    d.last_seen_at = utcnow()
    d.status = "online"
    audit(db, user, "device.heartbeat", d, before=before)
    return d


def device_health(db: Session, user: CurrentUser) -> list[dict[str, Any]]:
    now = utcnow()
    out = []
    for d in db.scalars(scoped(Device, user).where(Device.status != "retired").order_by(Device.name)).all():
        seen = _aware(d.last_seen_at)
        age = None if seen is None else round((now - seen).total_seconds() / 86400, 2)
        stale = age is None or age > resolver.STALE_DEVICE_DAYS
        suggestion = None
        if stale and d.status == "online":
            suggestion = ("This device has never reported. Check it is installed and powered."
                          if seen is None else
                          f"No heartbeat for {age:.0f} days. Consider marking it offline; "
                          "fields fall back to nearby or external data automatically.")
        out.append({
            "id": str(d.id), "name": d.name, "external_id": d.external_id, "kind": d.kind, "status": d.status,
            "last_seen_at": seen.isoformat() if seen else None, "days_since_seen": age, "stale": stale,
            "suggest_offline": bool(suggestion), "suggestion": suggestion,
        })
    return out


# ------------------------------------------------------------------ sync
def sync_field(
    db: Session, user: CurrentUser, fld: Field, start: date, end: date,
    parameters: list[str] | None = None, providers: Providers | None = None,
) -> dict[str, Any]:
    if end < start:
        raise ValidationFailed("The end date can't be before the start date.")
    if (end - start).days + 1 > MAX_SYNC_DAYS:
        raise ValidationFailed(f"Sync at most {MAX_SYNC_DAYS} days at a time.", code="WINDOW_TOO_LONG")
    if end > today():
        raise ValidationFailed("Supporting data can't be synced for future dates.", code="FUTURE_WINDOW")
    params = _check_parameters(parameters) if parameters else list(PARAMETERS)
    providers = providers or get_providers()
    existing = {
        (p, d, prov)
        for p, d, prov in db.execute(
            select(Observation.parameter, Observation.observed_on, Observation.provider).where(
                Observation.field_id == fld.id, Observation.observed_on >= start, Observation.observed_on <= end)
        ).all()
    }
    summary: dict[str, Any] = {}
    for param in params:
        series = resolver.resolve_series(db, fld, param, start, end, providers=providers)
        tiers: dict[str, int] = defaultdict(int)
        provs: set[str] = set()
        written = skipped = 0
        bias = False
        for r in series:
            tiers[str(r.tier)] += 1
            provs.add(r.provider)
            bias = bias or r.bias_corrected
            key = (param, r.observed_on, r.provider)
            if key in existing:
                skipped += 1
                continue
            existing.add(key)
            db.add(Observation(
                org_id=fld.org_id, created_by=user.id if user else None, field_id=fld.id, parameter=param,
                observed_on=r.observed_on, value=r.value, unit=r.unit, tier=r.tier, provider=r.provider,
                source_ref=r.source_ref[:120], distance_km=r.distance_km, quality=r.quality,
                data_class=r.data_class or "NONE", bias_corrected=r.bias_corrected, note=r.note,
            ))
            written += 1
        best = min((int(t) for t in tiers if t != "0"), default=0)
        summary[param] = {
            "tier": best, "providers": sorted(provs), "count": len(series), "written": written,
            "skipped_existing": skipped, "tiers": dict(tiers), "bias_corrected": bias,
        }
    run = SyncRun(org_id=fld.org_id, created_by=user.id if user else None, field_id=fld.id,
                  window_start=start, window_end=end, summary=summary)
    db.add(run)
    audit(db, user, "supporting.sync", run)
    return {"sync_run_id": str(run.id), "field_id": str(fld.id), "start": start.isoformat(),
            "end": end.isoformat(), "parameters": summary}


def sync_project(db: Session, user: CurrentUser, project: Project, start: date, end: date,
                 parameters: list[str] | None = None) -> dict[str, Any]:
    fields = enrolled_fields(db, user.org_id, project.id)
    providers = get_providers()
    runs = [sync_field(db, user, f, start, end, parameters, providers) for f in fields]
    return {
        "project_id": str(project.id), "fields": len(fields),
        "observations_written": sum(p["written"] for r in runs for p in r["parameters"].values()),
        "runs": [{"field_id": r["field_id"], "sync_run_id": r["sync_run_id"]} for r in runs],
    }


# ------------------------------------------------------------------ reading
def _rank(o: Observation) -> tuple:
    return (99 if o.tier == 0 else o.tier, -o.quality, o.provider)


def best_rows(db: Session, field_id: uuid.UUID, parameter: str | None = None,
              start: date | None = None, end: date | None = None) -> dict[tuple[str, date], Observation]:
    q = select(Observation).where(Observation.field_id == field_id)
    if parameter:
        q = q.where(Observation.parameter == parameter)
    if start:
        q = q.where(Observation.observed_on >= start)
    if end:
        q = q.where(Observation.observed_on <= end)
    best: dict[tuple[str, date], Observation] = {}
    for o in db.scalars(q).all():
        k = (o.parameter, o.observed_on)
        if k not in best or _rank(o) < _rank(best[k]):
            best[k] = o
    return best


def obs_out(o: Observation) -> dict[str, Any]:
    return {
        "date": o.observed_on.isoformat(), "value": o.value, "unit": o.unit, "tier": o.tier,
        "tier_label": TIER_LABELS.get(o.tier, ""), "provider": o.provider, "source_ref": o.source_ref,
        "quality": o.quality, "data_class": None if o.data_class == "NONE" else o.data_class,
        "bias_corrected": o.bias_corrected, "distance_km": o.distance_km, "note": o.note,
    }


def series(db: Session, fld: Field, parameter: str, start: date | None, end: date | None) -> dict[str, Any]:
    _check_parameters([parameter])
    rows = best_rows(db, fld.id, parameter, start, end)
    label, unit = PARAMETERS[parameter]
    points = [obs_out(rows[k]) for k in sorted(rows, key=lambda k: k[1])]
    return {"field_id": str(fld.id), "parameter": parameter, "label": label, "unit": unit, "points": points}


def summary(db: Session, fld: Field) -> dict[str, Any]:
    rows = best_rows(db, fld.id)
    by_param: dict[str, list[Observation]] = defaultdict(list)
    for (param, _), o in rows.items():
        by_param[param].append(o)
    out = []
    for param, (label, unit) in PARAMETERS.items():
        obs = sorted(by_param.get(param, []), key=lambda o: o.observed_on)
        if not obs:
            out.append({"parameter": param, "label": label, "unit": unit, "synced": False, "tier": None,
                        "provider": None, "avg_quality": None, "last_value": None, "last_date": None,
                        "data_class": None})
            continue
        last = obs[-1]
        recent = [o for o in obs if o.observed_on > last.observed_on - timedelta(days=30)]
        with_value = [o for o in reversed(obs) if o.value is not None]
        lv = with_value[0] if with_value else None
        out.append({
            "parameter": param, "label": label, "unit": unit, "synced": True, "tier": last.tier,
            "tier_label": TIER_LABELS.get(last.tier, ""), "provider": last.provider,
            "avg_quality": round(sum(o.quality for o in recent) / len(recent), 3),
            "last_value": lv.value if lv else None, "last_date": lv.observed_on.isoformat() if lv else None,
            "data_class": None if last.data_class == "NONE" else last.data_class,
        })
    return {"field_id": str(fld.id), "field_code": fld.code, "parameters": out}


def field_coverage(db: Session, fld: Field, on: date, providers: Providers) -> dict[str, Any]:
    """Live resolution of the key parameters for one day (no writes)."""
    res = [resolver.resolve_value(db, fld, p, on, providers=providers) for p in COVERAGE_PARAMETERS]
    tiers = [r.tier for r in res if r.tier > 0]
    return {
        "field_id": str(fld.id), "field_code": fld.code, "area_ha": fld.area_ha,
        "best_tier": min(tiers) if tiers else 0,
        "worst_tier": max(tiers) if len(tiers) == len(res) else 0,
        "avg_quality": round(sum(r.quality for r in res) / len(res), 3),
        "parameters": {r.parameter: {"tier": r.tier, "provider": r.provider, "quality": r.quality} for r in res},
    }


def coverage(db: Session, user: CurrentUser, project: Project, on: date | None = None) -> dict[str, Any]:
    on = on or today() - timedelta(days=7)
    providers = get_providers()
    rows = [field_coverage(db, f, on, providers) for f in enrolled_fields(db, user.org_id, project.id)]
    counts = {str(t): 0 for t in (1, 2, 3, 0)}
    for r in rows:
        counts[str(r["best_tier"])] += 1
    tier3 = sorted((r for r in rows if r["best_tier"] == 3), key=lambda r: (r["avg_quality"], -r["area_ha"], r["field_code"]))
    return {
        "project_id": str(project.id), "as_of": on.isoformat(), "fields": len(rows),
        "by_best_tier": counts, "tier_labels": {str(k): v for k, v in TIER_LABELS.items()},
        "device_would_help_most": [
            {**r, "reason": "Only external (regional) data is available here; a device would raise quality "
                            f"from {r['avg_quality']:.2f}."} for r in tier3[:10]
        ],
        "field_details": rows,
    }
