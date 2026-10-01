"""Customer lookup: one phone number in, farms and a device tier out. Creates nothing.

    known + live readings  -> tier full / partial
    known, no readings     -> tier none; their farm records can still be imported
    not known              -> not a customer; register here
    could not ask          -> UNKNOWN -- never recorded as "not a customer"

The tier is decided on readings that actually arrived, never on their platform's ``sensor`` /
``weather`` flags. Forecast rows never count.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from app.modules.farmfuture.client import FarmFutureClient, FarmFutureError
from app.modules.farmfuture.parsing import FarmFutureFarm, SensorSnapshot
from app.modules.farmfuture.session import TokenStore
from app.modules.farmfuture.trace import RunTrace

TIER_FULL, TIER_PARTIAL, TIER_NONE = "full", "partial", "none"

#: Parameters only a soil probe supplies.
SOIL_PARAMETERS = frozenset({
    "soil_ph", "soil_temperature", "soil_humidity", "soil_ec", "soil_moisture_1", "soil_moisture_2",
    "soil_moisture_raw", "soil_nitrogen", "soil_phosphorus", "soil_potassium",
})
#: What a MicroClime station supplies. Illuminance and device voltage are excluded: a station that
#: reports only those has nothing to offer the supporting data and must not lift a farm's tier.
WEATHER_PARAMETERS = frozenset({
    "air_temperature", "relative_humidity", "air_pressure", "rain_mm", "wind_speed", "leaf_wetness",
})

LATEST_ONLY_NOTE = ("Latest values only: Varsapradaya returns no history, so these readings prove the devices "
                    "are alive but cannot supply a daily series.")


@dataclass
class FarmCandidate:
    """One of their farms, with what we learned about its instrumentation."""

    farm: FarmFutureFarm
    sensors: list[SensorSnapshot] = field(default_factory=list)
    stations: list[SensorSnapshot] = field(default_factory=list)
    tier: str = TIER_NONE
    notes: list[str] = field(default_factory=list)
    #: True when a sensor or weather call failed, so the tier may be lower than the truth.
    readings_incomplete: bool = False


@dataclass
class CustomerLookup:
    phone: str
    is_existing_customer: bool
    candidates: list[FarmCandidate] = field(default_factory=list)
    tier: str = TIER_NONE
    trace: RunTrace = field(default_factory=RunTrace)
    warnings: list[str] = field(default_factory=list)
    #: True when their platform could not be reached (or rejected the request), so "not a customer"
    #: was never established. The two lead to opposite actions.
    lookup_failed: bool = False
    used_cached_token: bool = False

    def summary(self) -> str:
        if self.lookup_failed:
            return ("Varsapradaya could not be reached, so whether this is an existing customer is UNKNOWN. "
                    "Retry before recording anything.")
        if not self.is_existing_customer:
            return "Not a Varsapradaya customer. Register the farmer and their land here."
        farms = len(self.candidates)
        soil = sum(1 for c in self.candidates if c.sensors)
        weather = sum(1 for c in self.candidates if any(not s.is_forecast for s in c.stations))
        return (f"Existing Varsapradaya customer: {farms} farm(s), {soil} with soil probes and {weather} with a "
                f"weather station. Overall device tier {self.tier}.")


def lookup_customer(
    phone: str,
    *,
    client: FarmFutureClient,
    with_readings: bool = True,
    tokens: TokenStore | None = None,
) -> CustomerLookup:
    """Run the calls and decide the tier. Failures are reported on the result, not raised."""
    result = CustomerLookup(phone=phone, is_existing_customer=False, trace=client.trace)
    token = tokens.get(phone) if tokens else None
    result.used_cached_token = token is not None
    if token is None:
        try:
            token = client.validate_mobile_number(phone)
        except FarmFutureError as exc:
            result.lookup_failed = True
            result.warnings.append(f"Customer check failed ({exc}). Membership is UNKNOWN, not 'no'.")
            return result
        if not token:
            return result
        if tokens:
            tokens.put(phone, token, client.config.token_ttl_s)
    result.is_existing_customer = True

    try:
        estates = client.estates_and_farms(token)
    except FarmFutureError as exc:
        if result.used_cached_token and exc.status in (401, 403):
            # A cached token their platform has since expired. Re-acquire once and retry, so a long-lived
            # process does not quietly report every customer as owning no land.
            if tokens:
                tokens.drop(phone)
            try:
                token = client.validate_mobile_number(phone)
                if not token:
                    result.lookup_failed = True
                    result.warnings.append("Re-validation returned no token. Membership is UNKNOWN.")
                    return result
                if tokens:
                    tokens.put(phone, token, client.config.token_ttl_s)
                estates = client.estates_and_farms(token)
            except FarmFutureError as again:
                result.lookup_failed = True
                result.warnings.append(f"Estate list failed ({again}).")
                return result
        else:
            result.lookup_failed = True
            result.warnings.append(f"Estate list failed ({exc}).")
            return result

    for farm in [f for e in estates for f in e.farms]:
        candidate = FarmCandidate(farm=farm)
        if not farm.farm_id:
            candidate.notes.append("No farm ID in their response -- this farm can't be imported or read.")
            result.candidates.append(candidate)
            continue
        if with_readings:
            fill_readings(candidate, client, token)
        result.candidates.append(candidate)

    result.tier = best_tier([c.tier for c in result.candidates])
    if not result.candidates:
        result.warnings.append("Customer exists but holds no farms on Varsapradaya; register their land here.")
    return result


def fill_readings(candidate: FarmCandidate, client: FarmFutureClient, token: str | None) -> int:
    """Calls the two latest-readings endpoints for one farm and decides its tier.

    Returns how many of the two calls failed (0, 1 or 2)."""
    farm = candidate.farm
    failed = 0
    try:
        candidate.sensors = client.sensors_latest(farm.farm_id, token)
    except FarmFutureError as exc:
        failed += 1
        candidate.readings_incomplete = True
        candidate.notes.append(f"Soil sensor call failed ({exc}); the tier may be understated.")
    try:
        candidate.stations = client.weather_latest(farm.farm_id, token)
    except FarmFutureError as exc:
        # A weather outage must not take the soil readings with it: separate endpoints, separate evidence.
        failed += 1
        candidate.readings_incomplete = True
        candidate.notes.append(f"Weather station call failed ({exc}); the tier may be understated.")
    candidate.tier = tier_for(candidate.sensors, candidate.stations)
    candidate.notes.extend(reading_notes(farm, candidate.sensors, candidate.stations))
    return failed


def reading_notes(farm: FarmFutureFarm | None, sensors: list[SensorSnapshot],
                  stations: list[SensorSnapshot]) -> list[str]:
    notes: list[str] = []
    if sensors or stations:
        notes.append(LATEST_ONLY_NOTE)
    stale = sorted({p for s in sensors for p in s.missing})
    if stale:
        notes.append("The soil probe is reporting no value for " + ", ".join(stale)
                     + " (sent as -1); treated as missing, not as data.")
    forecasts = [s for s in stations if s.is_forecast]
    if forecasts:
        notes.append(f"{len(forecasts)} of {len(stations)} weather row(s) are forecasts, not measurements; "
                     "excluded from the tier.")
    if stations:
        stale_w = sorted({p for s in stations for p in s.missing})
        if stale_w:
            notes.append("The weather station is reporting no value for " + ", ".join(stale_w)
                         + " (sent as -1); treated as missing, not as data.")
        if any(not s.observed_at_is_utc for s in stations):
            notes.append("Weather timestamps are the station's local time -- this endpoint returns no UTC field.")
    if farm is not None:
        if farm.has_weather and not stations:
            notes.append("Their platform flags this farm as having weather, but no station readings came back.")
        if farm.has_sensor and not sensors:
            notes.append("Their platform flags this farm as having a sensor, but no readings came back.")
        if not farm.subscription_active:
            notes.append("Subscription inactive on their platform; device data may stop without notice.")
    return notes


def tier_for(sensors: list[SensorSnapshot], stations: list[SensorSnapshot] | None = None) -> str:
    """Tier from what the farm actually reports. Forecast rows are excluded."""
    parameters = {p for s in sensors for p in s.parameters}
    has_soil = bool(parameters & SOIL_PARAMETERS)
    measured = [s for s in (stations or []) if not s.is_forecast]
    has_weather = bool({p for s in measured for p in s.parameters} & WEATHER_PARAMETERS)
    if has_soil and has_weather:
        return TIER_FULL
    if has_soil or has_weather:
        return TIER_PARTIAL
    return TIER_NONE


def has_soil_readings(sensors: list[SensorSnapshot]) -> bool:
    return bool({p for s in sensors for p in s.parameters} & SOIL_PARAMETERS)


def has_weather_readings(stations: list[SensorSnapshot]) -> bool:
    return bool({p for s in stations if not s.is_forecast for p in s.parameters} & WEATHER_PARAMETERS)


def best_tier(tiers: list[str]) -> str:
    order = [TIER_NONE, TIER_PARTIAL, TIER_FULL]
    return max(tiers, key=order.index) if tiers else TIER_NONE
