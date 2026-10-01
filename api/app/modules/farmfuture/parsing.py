"""Normalised shapes for FarmFuture responses, plus the tolerant field picking that produces them.

Ported from the first integration, where every mapping below was written against a live response.
Their field names are not published. Rather than guess one spelling and fail silently on another,
``pick`` tries several. Anything not recognised is kept in ``raw`` -- nothing their API returned is
thrown away before we have read it.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


def pick(source: dict, *names: str, default: Any = None) -> Any:
    """First matching key, compared case- and separator-insensitively."""
    if not isinstance(source, dict):
        return default
    flat = {str(k).lower().replace("_", "").replace(" ", ""): v for k, v in source.items()}
    for name in names:
        key = name.lower().replace("_", "").replace(" ", "")
        if key in flat and flat[key] not in (None, ""):
            return flat[key]
    return default


def rows(payload: Any, *names: str) -> list[dict]:
    """The list inside a response, whether it is the body or nested in it.

    Their endpoints do not share an envelope, and a bare list is as likely as ``{"data": [...]}``.
    """
    if isinstance(payload, list):
        return [r for r in payload if isinstance(r, dict)]
    if isinstance(payload, dict):
        for name in (*names, "data", "result", "items", "list", "response"):
            value = pick(payload, name)
            if isinstance(value, list):
                return [r for r in value if isinstance(r, dict)]
            if isinstance(value, dict):
                nested = rows(value, *names)
                if nested:
                    return nested
    return []


@dataclass(frozen=True)
class FarmFutureFarm:
    """One farm as their platform holds it.

    ``farm_id`` is the GUID their sensor endpoint is keyed by -- the value stored as our
    ``Farm.external_farm_id``. **No boundary, no area and no coordinates come back for a farm**: their
    record identifies the land, and we still have to map it.
    """

    farm_id: str
    name: str | None = None
    estate_id: str | None = None
    estate_name: str | None = None
    postal_code: str | None = None
    #: Their crop labels. Not imported as-is: our crop is a catalogue entry with an attributes schema.
    crops: list[str] = field(default_factory=list)
    plants_per_hectare: float | None = None
    #: What their platform says is installed. A *prior* only -- the tier is decided on readings that
    #: actually arrived, because ``sensor: true`` on a farm whose probe reports nothing is not a source.
    has_sensor: bool = False
    has_weather: bool = False
    has_rain: bool = False
    has_air_quality: bool = False
    subscription_active: bool = True
    raw: dict = field(default_factory=dict)

    @classmethod
    def parse(cls, row: dict, estate_id=None, estate_name=None) -> FarmFutureFarm:
        crops = pick(row, "crops") or []
        return cls(
            farm_id=str(pick(row, "farmId", "farmGuid", "id", "guid", default="")),
            name=_clean(pick(row, "farmName", "name", "title")),
            estate_id=estate_id or _str_or_none(pick(row, "estateId", "estateGuid")),
            estate_name=_clean(estate_name or pick(row, "estateName")),
            postal_code=_str_or_none(pick(row, "postalCode", "zipCode")),
            crops=[str(c.get("name")).strip() for c in crops if isinstance(c, dict) and c.get("name")],
            plants_per_hectare=_float_or_none(pick(row, "plantsPerHectare")),
            has_sensor=bool(pick(row, "sensor", default=False)),
            has_weather=bool(pick(row, "weather", default=False)),
            has_rain=bool(pick(row, "rain", "rainSense", default=False)),
            has_air_quality=bool(pick(row, "airQuality", default=False)),
            subscription_active=bool(pick(row, "isActiveSubscription", default=True)),
            raw=row,
        )


@dataclass(frozen=True)
class FarmFutureEstate:
    estate_id: str
    name: str | None = None
    postal_code: str | None = None
    #: Farmer producer organisation: one FPO estate can cover many growers.
    is_fpo: bool = False
    farms: list[FarmFutureFarm] = field(default_factory=list)
    raw: dict = field(default_factory=dict)


@dataclass(frozen=True)
class SensorSnapshot:
    """The latest reading from one device.

    Deliberately not a daily series: these endpoints return *latest only*, so the values carry no
    history and must not flow into a calculation that needs a series.
    """

    device_id: str
    device_type: str | None
    parameters: dict[str, Any] = field(default_factory=dict)
    observed_at: str | None = None
    #: Their devices carry their own position (a farm-level coordinate is not returned at all).
    latitude: float | None = None
    longitude: float | None = None
    installed_on: str | None = None
    #: Readings this device reported as a "no reading" sentinel (-1).
    missing: list[str] = field(default_factory=list)
    #: soil | weather -- which endpoint it came from.
    kind: str = "soil"
    #: Non-numeric readings, such as a compass wind direction.
    text_values: dict[str, str] = field(default_factory=dict)
    #: True when the row is a *forecast*. A prediction is never recorded as an observation.
    is_forecast: bool = False
    #: True when ``observed_at`` is UTC (soil rows carry ``utc_updatedat``; weather rows do not).
    observed_at_is_utc: bool = False
    raw: dict = field(default_factory=dict)

    @classmethod
    def parse(cls, row: dict) -> SensorSnapshot:
        utc = _str_or_none(pick(row, "utc_updatedat"))
        return cls(
            # macId is the device identity on their platform. There is no sensorId or deviceId field.
            device_id=str(pick(row, "macId", "sensorId", "deviceId", default="")),
            device_type=pick(row, "deviceName", "sensorType", "deviceType"),
            parameters=_parameters(row),
            # Two timestamps come back: `updateAt` in their local time and `utc_updatedat` in UTC.
            observed_at=utc or _str_or_none(pick(row, "updateAt", "lastUpdated", "timestamp")),
            observed_at_is_utc=utc is not None,
            latitude=_float_or_none(pick(row, "lat", "latitude")),
            longitude=_float_or_none(pick(row, "long", "lng", "longitude")),
            installed_on=_str_or_none(pick(row, "installationDate")),
            missing=dropped_parameters(row),
            kind="soil",
            raw=row,
        )

    @classmethod
    def parse_weather(cls, row: dict) -> SensorSnapshot:
        """A MicroClime station row from ``GetAllWeatherData``: flat fields, local-time ``updateAt`` only."""
        utc = _str_or_none(pick(row, "utc_updatedat"))
        return cls(
            device_id=str(pick(row, "macId", "deviceId", default="")),
            device_type=pick(row, "deviceName", "deviceType"),
            parameters=_flat_parameters(row, WEATHER_FIELDS),
            observed_at=utc or _str_or_none(pick(row, "updateAt")),
            observed_at_is_utc=utc is not None,
            latitude=_float_or_none(pick(row, "lat", "latitude")),
            longitude=_float_or_none(pick(row, "long", "lng", "longitude")),
            installed_on=_str_or_none(pick(row, "installationDate")),
            missing=_flat_dropped(row, WEATHER_FIELDS),
            kind="weather",
            text_values={
                name: str(pick(row, key)).strip()
                for key, name in WEATHER_TEXT_FIELDS.items()
                if pick(row, key) not in (None, "")
            },
            is_forecast=bool(pick(row, "isWeatherForecast", default=False)),
            raw=row,
        )


#: Their sensor field names -> ours, per nesting block. Written from a live response: the readings are
#: not at the top level of a sensor row but inside ``soilProperties``, ``soilNutrients`` and
#: ``extraParameters``.
SOIL_PROPERTIES = {
    "ph": ("soil_ph", "pH"),
    "temperature": ("soil_temperature", "°C"),
    "humidity": ("soil_humidity", "%"),
    "electricalconductivity": ("soil_ec", "µS/cm"),
    "soilmoisturepercentage1": ("soil_moisture_1", "% vol"),
    "soilmoisturepercentage2": ("soil_moisture_2", "% vol"),
    "soilmoisturevalue": ("soil_moisture_raw", "count"),
    "voltage": ("device_voltage", "%"),
}
SOIL_NUTRIENTS = {
    "nitrogen": ("soil_nitrogen", "mg/kg"),
    "phosphorous": ("soil_phosphorus", "mg/kg"),
    "potassium": ("soil_potassium", "mg/kg"),
}
EXTRA_PARAMETERS = {
    "lux": ("illuminance", "lx"),
    "solarradiation": ("solar_radiation", "W/m²"),
}

#: MicroClime weather stations, from ``GetAllWeatherData``. Flat, unlike the soil probes.
WEATHER_FIELDS = {
    "airtemperature": ("air_temperature", "°C"),
    "airhumidity": ("relative_humidity", "%"),
    "airpressure": ("air_pressure", "hPa"),
    "rainfall": ("rain_mm", "mm"),
    "windspeed": ("wind_speed", "m/s"),
    "leafwetness": ("leaf_wetness", "%"),
    "lux": ("illuminance", "lx"),
    "voltage": ("device_voltage", "%"),
}

#: Wind direction comes back as a compass letter ("S"), so it is kept apart from the readings.
WEATHER_TEXT_FIELDS = {"winddirection": "wind_direction"}

SENSOR_BLOCKS = (
    ("soilProperties", SOIL_PROPERTIES),
    ("soilNutrients", SOIL_NUTRIENTS),
    ("extraParameters", EXTRA_PARAMETERS),
)

#: Every FarmFuture parameter name -> unit, for display.
UNITS: dict[str, str] = {
    name: unit
    for mapping in (SOIL_PROPERTIES, SOIL_NUTRIENTS, EXTRA_PARAMETERS, WEATHER_FIELDS)
    for name, unit in mapping.values()
}

#: Parameters their firmware reports as ``-1`` when the probe has no reading. A pH of -1.84 is not a
#: measurement. ``voltage`` is excluded: it is a device-health figure, not a reading.
NEGATIVE_MEANS_MISSING = frozenset({
    "air_temperature", "relative_humidity", "air_pressure", "rain_mm", "wind_speed", "leaf_wetness",
    "soil_ph", "soil_temperature", "soil_humidity", "soil_ec", "soil_moisture_1", "soil_moisture_2",
    "soil_moisture_raw", "soil_nitrogen", "soil_phosphorus", "soil_potassium",
})


def normalise_key(key: str) -> str:
    """Lowercase, letters and digits only."""
    return "".join(c for c in str(key).lower() if c.isalnum())


def _keep(name: str, value: Any) -> bool:
    number = _float_or_none(value)
    return not (name in NEGATIVE_MEANS_MISSING and (number is None or number < 0))


def _parameters(row: dict) -> dict[str, Any]:
    """The readings on one sensor row, flattened out of their nested blocks; sentinels dropped."""
    found: dict[str, Any] = {}
    for block_name, mapping in SENSOR_BLOCKS:
        block = pick(row, block_name)
        if not isinstance(block, dict):
            continue
        for key, value in block.items():
            target = mapping.get(normalise_key(key))
            if target is None or value in (None, ""):
                continue
            if _keep(target[0], value):
                found[target[0]] = value
    return found


def _flat_parameters(row: dict, mapping: dict) -> dict[str, Any]:
    found: dict[str, Any] = {}
    for key, value in row.items():
        target = mapping.get(normalise_key(key))
        if target is None or value in (None, ""):
            continue
        if _keep(target[0], value):
            found[target[0]] = value
    return found


def _flat_dropped(row: dict, mapping: dict) -> list[str]:
    dropped: list[str] = []
    for key, value in row.items():
        target = mapping.get(normalise_key(key))
        if target is None or value in (None, ""):
            continue
        if not _keep(target[0], value):
            dropped.append(target[0])
    return sorted(dropped)


def dropped_parameters(row: dict) -> list[str]:
    """Readings this row carried but that were sentinels. Reported, not silently discarded: "the probe
    is reporting nothing" is a different situation from "there is no probe"."""
    dropped: list[str] = []
    for block_name, mapping in SENSOR_BLOCKS:
        block = pick(row, block_name)
        if not isinstance(block, dict):
            continue
        for key, value in block.items():
            target = mapping.get(normalise_key(key))
            if target is None or value in (None, ""):
                continue
            if not _keep(target[0], value):
                dropped.append(target[0])
    return sorted(dropped)


def _float_or_none(value: Any) -> float | None:
    if isinstance(value, bool):
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _str_or_none(value: Any) -> str | None:
    return None if value in (None, "") else str(value)


def _clean(value: Any) -> str | None:
    """Their names carry trailing spaces -- "Biccode ", "Harley estate "."""
    if value in (None, ""):
        return None
    return str(value).strip() or None
