"""SoilSync probes and MicroClime stations from Varsapradaya, as a device provider.

Select with ``VC_DEVICE_PROVIDER=farmfuture``. What the platform offers, and so what this does:

* ``GetAllSensorsLatestData`` / ``GetAllWeatherData`` return **the latest value only -- no history**.
  ``daily()`` therefore returns nothing, so the resolver's daily series falls back to tier 2 (a nearby
  station) or tier 3 (external sources) exactly as it does today. Inventing a day's value from one
  reading would be a measurement nobody made.
* ``latest_for_farm()`` fetches those latest readings; ``refresh_farm_devices()`` registers or updates our
  ``Device`` rows from them (external id = their ``macId``, status from the reading's age, last seen =
  the reading's time) and keeps the latest values on the device, labelled MEASURED and latest-only.

The token used for the calls is the farmer's own (see ``session.py``): memory only, never stored or logged.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, date, datetime, timedelta, timezone
from typing import Any

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.db import utcnow
from app.core.errors import Conflict, ValidationFailed
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.farmers.member_directory import MemberDirectoryUnavailable
from app.modules.farmers.models import Farmer
from app.modules.farmfuture.client import FarmFutureClient, FarmFutureError
from app.modules.farmfuture.config import FarmFutureConfig
from app.modules.farmfuture.lookup import (
    LATEST_ONLY_NOTE, FarmCandidate, fill_readings,
)
from app.modules.farmfuture.parsing import UNITS, FarmFutureFarm, SensorSnapshot
from app.modules.farmfuture.session import TokenStore, to_e164, token_store
from app.modules.farmfuture.trace import RunTrace
from app.modules.land.models import Farm, Field
from app.modules.supporting.models import PARAMETERS, Device
from app.modules.supporting.providers import DeviceRef, register_device_provider
from app.modules.supporting.resolver import STALE_DEVICE_DAYS, Resolved

PROVIDER_NAME = "farmfuture"

#: Their parameter -> (our supporting parameter, conversion). Only parameters with the same meaning are
#: mapped. Not mapped, and kept as source values only: soil moisture 1/2 (their probe does not report the
#: depth, and ours are 20 cm / 60 cm), solar radiation (instantaneous W/m², ours is a daily MJ/m² total),
#: nutrients, illuminance and device voltage.
TO_OURS: dict[str, tuple[str, Any]] = {
    "soil_ph": ("soil_ph", lambda v: v),
    "soil_temperature": ("soil_temp_c", lambda v: v),
    "soil_ec": ("soil_ec_ds_m", lambda v: v / 1000.0),  # µS/cm -> dS/m
    "air_temperature": ("air_temp_c", lambda v: v),
    "relative_humidity": ("rel_humidity_pct", lambda v: v),
    "rain_mm": ("rain_mm", lambda v: v),
    "wind_speed": ("wind_m_s", lambda v: v),
}

KIND = {"soil": "soilsync", "weather": "microclime"}
KIND_LABEL = {"soilsync": "SoilSync", "microclime": "MicroClime"}

#: Their local time, used only for weather rows (which carry no UTC field) when the same response holds no
#: soil row to measure the offset from. Their soil rows carry both and show +05:30.
DEFAULT_LOCAL_OFFSET = timedelta(hours=5, minutes=30)


class NotACustomer(Exception):
    """The farmer's phone number is not (or no longer) known to Varsapradaya."""


@dataclass
class FarmLatest:
    external_farm_id: str
    sensors: list[SensorSnapshot] = field(default_factory=list)
    stations: list[SensorSnapshot] = field(default_factory=list)
    tier: str = "none"
    notes: list[str] = field(default_factory=list)
    readings_incomplete: bool = False
    trace: RunTrace = field(default_factory=RunTrace)


class FarmFutureDeviceProvider:
    """Device provider for ``VC_DEVICE_PROVIDER=farmfuture``."""

    name = PROVIDER_NAME

    def __init__(self, config: FarmFutureConfig | None = None, *, transport: httpx.BaseTransport | None = None,
                 tokens: TokenStore | None = None) -> None:
        self._config = config
        self.transport = transport
        self.tokens = tokens if tokens is not None else token_store

    @property
    def config(self) -> FarmFutureConfig:
        if self._config is None:
            self._config = FarmFutureConfig.from_settings()
        return self._config

    # -------------------------------------------------- DeviceProvider protocol
    def daily(self, device: DeviceRef, parameter: str, start: date, end: date) -> dict[date, float]:
        """Daily values from the readings this platform has kept for the device (``DeviceReading``).

        Their API returns only the latest value, so every fetched reading is stored and this series grows
        from the day the farm's devices are first read. Days without a stored reading are absent, so the
        resolver falls back to a nearby station or an external source for those days only."""
        return stored_daily(device.external_id, parameter, start, end)

    def source_ref(self, device: DeviceRef) -> str:
        return f"farmfuture {device.kind} {device.external_id} (latest value only)"[:120]

    # -------------------------------------------------- latest readings
    def latest_for_farm(self, external_farm_id: str, phone: str) -> FarmLatest:
        """Latest SoilSync and MicroClime readings for one of their farms.

        Raises ``NotACustomer`` or ``FarmFutureError`` (could not ask -- not an absence of devices).
        """
        e164 = to_e164(phone, self.config.country_code)
        with FarmFutureClient(self.config, transport=self.transport) as client:
            token = self.tokens.get(e164)
            cached = token is not None
            if token is None:
                token = self._validate(client, e164)
            candidate = FarmCandidate(farm=FarmFutureFarm(farm_id=external_farm_id))
            failed = fill_readings(candidate, client, token)
            if cached and failed and _rejected(client.trace):
                # A cached token their platform has since expired: re-acquire once and read again.
                self.tokens.drop(e164)
                token = self._validate(client, e164)
                candidate = FarmCandidate(farm=FarmFutureFarm(farm_id=external_farm_id))
                failed = fill_readings(candidate, client, token)
            if failed == 2:
                # Neither call answered: we don't know what devices the farm has. Not "no devices".
                raise FarmFutureError("both latest-readings calls failed")
            return FarmLatest(external_farm_id=external_farm_id, sensors=candidate.sensors,
                              stations=candidate.stations, tier=candidate.tier, notes=candidate.notes,
                              readings_incomplete=candidate.readings_incomplete, trace=client.trace)

    def _validate(self, client: FarmFutureClient, e164: str) -> str:
        token = client.validate_mobile_number(e164)
        if not token:
            raise NotACustomer()
        self.tokens.put(e164, token, self.config.token_ttl_s)
        return token


def _rejected(trace: RunTrace) -> bool:
    return any(c.status in (401, 403) for c in trace.calls)


register_device_provider(PROVIDER_NAME, FarmFutureDeviceProvider)


# ---------------------------------------------------------------- mapping helpers
def our_values(snap: SensorSnapshot) -> dict[str, float]:
    out: dict[str, float] = {}
    for theirs, value in snap.parameters.items():
        target = TO_OURS.get(theirs)
        if target is None:
            continue
        try:
            number = float(value)
        except (TypeError, ValueError):
            continue
        out[target[0]] = round(target[1](number), 4)
    return out


def _parse_time(text: str | None) -> datetime | None:
    if not text:
        return None
    try:
        return datetime.fromisoformat(str(text).strip().replace("Z", "+00:00"))
    except ValueError:
        return None


def local_offset(sensors: list[SensorSnapshot]) -> tuple[timedelta, bool]:
    """Their local-time offset, measured from a soil row carrying both ``updateAt`` and ``utc_updatedat``.
    Returns ``(offset, measured)``."""
    for s in sensors:
        local, utc = _parse_time(s.raw.get("updateAt")), _parse_time(s.raw.get("utc_updatedat"))
        if local and utc and local.tzinfo is None and utc.tzinfo is None:
            minutes = round((local - utc).total_seconds() / 900) * 15
            if abs(minutes) <= 14 * 60:
                return timedelta(minutes=minutes), True
    return DEFAULT_LOCAL_OFFSET, False


def observed_utc(snap: SensorSnapshot, offset: timedelta) -> datetime | None:
    t = _parse_time(snap.observed_at)
    if t is None:
        return None
    if t.tzinfo is not None:
        return t.astimezone(UTC)
    if snap.observed_at_is_utc:
        return t.replace(tzinfo=UTC)
    return t.replace(tzinfo=timezone(offset)).astimezone(UTC)


def _aware(dt: datetime | None) -> datetime | None:
    return None if dt is None else (dt if dt.tzinfo else dt.replace(tzinfo=UTC))


# How several readings on one day become the day's value. Rain: their field's period is undocumented, so the
# largest reading of the day is used (right for a running daily total; one reading per day otherwise).
DAILY_AGGREGATE = {"rain_mm": "max"}


def stored_daily(external_id: str, parameter: str, start: date, end: date) -> dict[date, float]:
    """Day -> value from the kept readings of the device(s) with this Varsapradaya id (mean per day; see
    ``DAILY_AGGREGATE``)."""
    from app.core import db as dbmod
    from app.modules.supporting.models import DeviceReading

    with dbmod.session_factory()() as s:
        ids = list(s.scalars(select(Device.id).where(Device.external_id == external_id,
                                                     Device.status != "retired")))
        if not ids:
            return {}
        rows = s.execute(select(DeviceReading.observed_on, DeviceReading.value).where(
            DeviceReading.device_id.in_(ids), DeviceReading.parameter == parameter,
            DeviceReading.observed_on >= start, DeviceReading.observed_on <= end)).all()
    by_day: dict[date, list[float]] = {}
    for day, value in rows:
        by_day.setdefault(day, []).append(float(value))
    how = DAILY_AGGREGATE.get(parameter, "mean")
    return {d: (max(v) if how == "max" else sum(v) / len(v)) for d, v in sorted(by_day.items())}


def keep_readings(db: Session, user: CurrentUser, device: Device, values: dict[str, float],
                  seen: datetime | None, offset: timedelta) -> int:
    """Append the reading to the device's history unless it was already kept (same parameter and time)."""
    from app.modules.supporting.models import DeviceReading

    if seen is None or not values:
        return 0
    seen = _aware(seen)
    local_day = (seen + offset).date()
    have = set(db.scalars(select(DeviceReading.parameter).where(
        DeviceReading.device_id == device.id, DeviceReading.observed_at == seen)))
    added = 0
    for param, value in values.items():
        if param in have or param not in PARAMETERS or value is None:
            continue
        db.add(DeviceReading(org_id=device.org_id, created_by=user.id, device_id=device.id, parameter=param,
                             observed_at=seen, observed_on=local_day, value=float(value),
                             unit=PARAMETERS[param][1], source=PROVIDER_NAME))
        added += 1
    return added


def readings_out(latest: dict | None, kind: str, external_id: str) -> list[dict[str, Any]]:
    """The stored latest values as display rows, each MEASURED and latest-only."""
    if not latest:
        return []
    rows = []
    for param, value in (latest.get("values") or {}).items():
        label, unit = PARAMETERS.get(param, (param, ""))
        rows.append({"parameter": param, "label": label, "value": value, "unit": unit,
                     "observed_at": latest.get("observed_at"), "data_class": "MEASURED", "tier": 1,
                     "provider": kind, "source_ref": f"farmfuture {kind} {external_id} (latest value only)"[:120],
                     "note": LATEST_ONLY_NOTE})
    return rows


# ---------------------------------------------------------------- service
def _provider(provider: Any | None) -> Any:
    if provider is None:
        from app.modules.supporting.providers import get_providers

        provider = get_providers().device
    if not hasattr(provider, "latest_for_farm"):
        raise Conflict("Refreshing devices from Varsapradaya needs the Varsapradaya device provider. Ask an "
                       "administrator to set VC_DEVICE_PROVIDER=farmfuture on the server.",
                       code="DEVICE_PROVIDER_NOT_FARMFUTURE", details={"provider": getattr(provider, "name", "")})
    return provider


def refresh_farm_devices(db: Session, user: CurrentUser, farm_id: str, provider: Any | None = None) -> dict[str, Any]:
    """Register or update the farm's Varsapradaya devices from their latest readings."""
    farm = get_owned(db, Farm, farm_id, user, "Farm")
    if not farm.external_farm_id:
        raise ValidationFailed("This farm isn't linked to a Varsapradaya farm, so there are no devices to fetch.",
                               code="NOT_A_MEMBER_FARM")
    provider = _provider(provider)
    farmer = db.get(Farmer, farm.farmer_id)
    if farmer is None or not farmer.phone:
        raise ValidationFailed("This farm's farmer has no phone number to look up on Varsapradaya.",
                               code="NO_MEMBER_PHONE")
    try:
        latest: FarmLatest = provider.latest_for_farm(farm.external_farm_id, farmer.phone)
    except NotACustomer:
        raise ValidationFailed("The farmer's phone number isn't registered on Varsapradaya, so their devices "
                               "can't be read.", code="NOT_A_MEMBER") from None
    except FarmFutureError as exc:
        raise MemberDirectoryUnavailable(
            "Varsapradaya couldn't be reached, so the devices weren't refreshed. Nothing was changed. "
            "Try again in a few minutes.", details={"reasons": [str(exc)]}) from None

    now = utcnow()
    fields = list(db.scalars(scoped(Field, user).where(Field.farm_id == farm.id, Field.status == "active")
                             .order_by(Field.code)).all())
    fallback = (fields[0].centroid_lat, fields[0].centroid_lon) if fields else None
    offset, measured_offset = local_offset(latest.sensors)
    notes = list(latest.notes)
    if latest.stations and not measured_offset:
        notes.append("Weather station times were read as UTC+05:30 (their platform's local time).")
    devices_out: list[dict[str, Any]] = []
    readings_kept = 0
    for snap in [*latest.sensors, *latest.stations]:
        kind = KIND[snap.kind]
        if snap.is_forecast:
            continue
        if not snap.device_id:
            notes.append(f"A {KIND_LABEL[kind]} row came back without a device ID and was skipped.")
            continue
        seen = observed_utc(snap, offset)
        values = our_values(snap)
        lat, lon = snap.latitude, snap.longitude
        position_note = ""
        if lat is None or lon is None:
            if fallback is None:
                notes.append(f"{KIND_LABEL[kind]} {snap.device_id} reported no position and the farm has no mapped "
                             "field yet, so it wasn't registered. Map a field and refresh again.")
                continue
            lat, lon = fallback
            position_note = "Position taken from the farm's first field (the device reported none)."
        stored = {
            "observed_at": seen.isoformat() if seen else None,
            "observed_at_as_sent": snap.observed_at,
            "values": values,
            "source_values": {k: v for k, v in snap.parameters.items()},
            "source_units": {k: UNITS.get(k, "") for k in snap.parameters},
            "text_values": dict(snap.text_values),
            "missing": list(snap.missing),
            "data_class": "MEASURED",
            "fetched_at": now.isoformat(),
            "note": LATEST_ONLY_NOTE,
        }
        age_days = None if seen is None else (now - seen).total_seconds() / 86400
        status = "online" if age_days is not None and age_days <= STALE_DEVICE_DAYS else "offline"
        device = db.scalar(scoped(Device, user).where(Device.external_id == snap.device_id))
        created = device is None
        if device is not None and device.status == "retired":
            notes.append(f"{device.name} ({device.external_id}) is retired here, so it wasn't updated.")
            continue
        if created:
            device = Device(
                org_id=user.org_id, created_by=user.id, kind=kind, external_id=snap.device_id,
                name=(f"{snap.device_type or KIND_LABEL[kind]} {snap.device_id[-4:]}").strip()[:200],
                farm_id=farm.id, field_id=None, latitude=lat, longitude=lon, parameters=sorted(values),
                status=status, last_seen_at=seen, latest_readings=stored,
            )
            db.add(device)
            audit(db, user, "device.import_member", device, reason="Registered from Varsapradaya latest readings")
        else:
            before = snapshot(device)
            if device.farm_id != farm.id:
                notes.append(f"{device.name} was linked to another farm; it is now linked to {farm.name}.")
                device.farm_id = farm.id
                device.field_id = None
            device.kind = kind
            if snap.latitude is not None and snap.longitude is not None:
                device.latitude, device.longitude = snap.latitude, snap.longitude
            device.parameters = sorted(set(device.parameters or []) | set(values))
            prev = _aware(device.last_seen_at)
            device.last_seen_at = max(d for d in (prev, seen) if d is not None) if (prev or seen) else None
            if seen is not None and (prev is None or seen >= prev):
                device.status = status
            device.latest_readings = stored
            audit(db, user, "device.refresh_member", device, before=before)
        db.flush()
        kept = keep_readings(db, user, device, values, seen, offset)
        readings_kept += kept
        devices_out.append({
            "id": str(device.id), "external_id": device.external_id, "kind": kind, "name": device.name,
            "status": device.status, "last_seen_at": seen.isoformat() if seen else None, "created": created,
            "readings": readings_out(stored, kind, device.external_id),
            "source_values": stored["source_values"], "missing": stored["missing"],
            "note": " ".join(x for x in (LATEST_ONLY_NOTE, position_note) if x),
        })
    if any(s.is_forecast for s in latest.stations):
        notes.append("Forecast rows were not registered as readings.")
    return {
        "farm_id": str(farm.id), "external_farm_id": farm.external_farm_id, "tier": latest.tier,
        "devices": devices_out, "registered": sum(1 for d in devices_out if d["created"]),
        "updated": sum(1 for d in devices_out if not d["created"]),
        "readings_incomplete": latest.readings_incomplete,
        "latest_only": True, "readings_kept": readings_kept,
        "history_note": LATEST_ONLY_NOTE + " Every reading fetched is kept, so this farm's own devices supply the "
        "daily supporting data (tier 1, MEASURED) for each day they reported; other days come from nearby "
        "stations or external sources (tier 2 / 3).",
        "notes": list(dict.fromkeys(notes)),
    }


def latest_resolved(db: Session, fld: Field) -> list[Resolved]:
    """The latest Varsapradaya readings from devices on this field or its farm, as resolver values
    (tier 1, MEASURED, latest only). Never a daily series."""
    rows = db.scalars(select(Device).where(Device.org_id == fld.org_id, Device.status != "retired")).all()
    out: list[Resolved] = []
    for d in rows:
        if not (d.field_id == fld.id or (d.farm_id is not None and d.farm_id == fld.farm_id)):
            continue
        latest = d.latest_readings or {}
        seen = _parse_time(latest.get("observed_at"))
        day = seen.date() if seen else None
        for param, value in (latest.get("values") or {}).items():
            if param not in PARAMETERS or day is None:
                continue
            out.append(Resolved(
                parameter=param, observed_on=day, value=value, unit=PARAMETERS[param][1], tier=1, provider=d.kind,
                source_ref=f"farmfuture {d.kind} {d.external_id} (latest value only)"[:120], quality=1.0,
                data_class="MEASURED", note=LATEST_ONLY_NOTE, device_id=str(d.id),
            ))
    return sorted(out, key=lambda r: (r.parameter, r.device_id or ""))
