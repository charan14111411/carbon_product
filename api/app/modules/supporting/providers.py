"""Adapters for supporting data sources (devices, external weather, soil maps).

Every external integration sits behind a small interface so a real provider can be
plugged in without touching the resolver or the API. No credentials exist in this
environment, so the default providers are deterministic *simulations*:

* ``SimulatedDeviceProvider``  – plausible daily readings for SoilSync / MicroClime devices.
* ``SimulatedNasaPower``       – regional daily weather (+ coarse modelled soil moisture).
* ``SimulatedSoilGrids``       – static soil properties (MODELLED).

Simulated values always say so: their ``source_ref`` contains "(simulated)".

Choosing a provider (environment variables, read on each call):

* ``VC_DEVICE_PROVIDER``   default ``simulated``
* ``VC_WEATHER_PROVIDER``  default ``simulated_nasa_power``
* ``VC_SOIL_PROVIDER``     default ``simulated_soilgrids``

To plug in a real provider, implement the protocol and register a factory, e.g.
``register_weather_provider("nasa_power", lambda: NasaPowerClient(api_url=...))``,
then set ``VC_WEATHER_PROVIDER=nasa_power``.
"""

from __future__ import annotations

import hashlib
import math
import os
from collections.abc import Callable
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from typing import Protocol

# ---------------------------------------------------------------- deterministic randomness


def uniform(*parts: object) -> float:
    """A reproducible number in [0, 1) derived from ``parts``."""
    digest = hashlib.sha256("|".join(str(p) for p in parts).encode("utf-8")).digest()
    return int.from_bytes(digest[:8], "big") / 2**64


def normal(*parts: object) -> float:
    """A reproducible standard-normal number (Box–Muller) derived from ``parts``."""
    u1 = max(uniform(*parts, "a"), 1e-12)
    u2 = uniform(*parts, "b")
    return math.sqrt(-2.0 * math.log(u1)) * math.cos(2 * math.pi * u2)


def days(start: date, end: date) -> list[date]:
    return [start + timedelta(days=i) for i in range((end - start).days + 1)]


def _clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def wetness(lat: float, day: date) -> float:
    """0..1 seasonal wetness. Peaks in July in the northern hemisphere (monsoon-like), January in the south."""
    doy = day.timetuple().tm_yday
    peak = 200 if lat >= 0 else 18
    c = math.cos(2 * math.pi * (doy - peak) / 365.25)
    return max(0.0, c) ** 1.5


# ---------------------------------------------------------------- interfaces


@dataclass(frozen=True)
class DeviceRef:
    """What a device provider needs to know about a device (no ORM dependency)."""

    external_id: str
    kind: str
    latitude: float
    longitude: float
    status: str
    parameters: tuple[str, ...]
    last_seen_at: datetime | None = None
    calibrated_on: date | None = None


class DeviceProvider(Protocol):
    name: str

    def daily(self, device: DeviceRef, parameter: str, start: date, end: date) -> dict[date, float]:
        """Daily values for one parameter. Days without a reading are simply absent."""

    def source_ref(self, device: DeviceRef) -> str: ...


class ExternalWeatherProvider(Protocol):
    name: str

    def data_class(self, parameter: str) -> str | None:
        """OBSERVED / MODELLED if this provider offers ``parameter``, else ``None``."""

    def daily(self, lat: float, lon: float, parameter: str, start: date, end: date) -> dict[date, float]: ...

    def source_ref(self, lat: float, lon: float) -> str: ...


class SoilGridsProvider(Protocol):
    name: str

    def properties(self, lat: float, lon: float) -> dict[str, float]:
        """Static soil properties (MODELLED): clay_pct, sand_pct, silt_pct, ph, soc_g_kg, bdod_g_cm3."""

    def wrb_group(self, lat: float, lon: float) -> tuple[str, float] | None:
        """Most probable WRB reference soil group and its probability (MODELLED), if offered."""

    def source_ref(self, lat: float, lon: float) -> str: ...


# ---------------------------------------------------------------- simulated weather (regional)

WEATHER_CLASSES = {
    "rain_mm": "OBSERVED",
    "air_temp_c": "OBSERVED",
    "rel_humidity_pct": "OBSERVED",
    "solar_mj_m2": "OBSERVED",
    "wind_m_s": "OBSERVED",
    "soil_moisture_20cm_pct": "MODELLED",
    "soil_moisture_60cm_pct": "MODELLED",
    "soil_temp_c": "MODELLED",
}


def _weather_value(cell: str, lat: float, parameter: str, day: date, region_wet: float) -> float:
    w = wetness(lat, day)
    doy = day.timetuple().tm_yday
    if parameter == "rain_mm":
        p_rain = 0.08 + 0.72 * w
        if uniform(cell, "rain?", day) >= p_rain:
            return 0.0
        mean = (3.0 + 16.0 * w) * region_wet
        return round(-mean * math.log(1.0 - uniform(cell, "rain", day) * 0.999), 1)
    if parameter == "air_temp_c":
        base = 28.0 - 0.35 * max(0.0, abs(lat) - 10.0)
        pre_monsoon = 3.0 * math.sin(2 * math.pi * (doy - (45 if lat >= 0 else 227)) / 365.25)
        return round(base + pre_monsoon - 2.0 * w + 1.2 * normal(cell, "t", day), 1)
    if parameter == "rel_humidity_pct":
        return round(_clamp(45.0 + 45.0 * w + 5.0 * normal(cell, "rh", day), 12.0, 100.0), 1)
    if parameter == "solar_mj_m2":
        return round(_clamp(22.0 - 8.0 * w + 2.0 * normal(cell, "sr", day), 4.0, 32.0), 1)
    if parameter == "wind_m_s":
        return round(_clamp(1.8 + 2.4 * w + abs(0.8 * normal(cell, "ws", day)), 0.2, 15.0), 1)
    if parameter in ("soil_moisture_20cm_pct", "soil_moisture_60cm_pct"):
        lagged = wetness(lat, day - timedelta(days=20 if parameter.endswith("20cm_pct") else 40))
        base, amp = (12.0, 24.0) if parameter.endswith("20cm_pct") else (16.0, 18.0)
        return round(_clamp(base + amp * lagged * region_wet ** 0.5 + 1.5 * normal(cell, parameter, day), 3.0, 55.0), 1)
    if parameter == "soil_temp_c":
        return round(_weather_value(cell, lat, "air_temp_c", day, region_wet) + 1.5, 1)
    raise KeyError(parameter)


class SimulatedNasaPower:
    """Deterministic regional daily weather on a 0.5° grid, in the spirit of NASA POWER."""

    name = "nasa_power"

    @staticmethod
    def _cell(lat: float, lon: float) -> tuple[str, float, float]:
        glat, glon = round(lat * 2) / 2, round(lon * 1.6) / 1.6
        return f"{glat:.2f},{glon:.3f}", glat, glon

    def data_class(self, parameter: str) -> str | None:
        return WEATHER_CLASSES.get(parameter)

    def daily(self, lat: float, lon: float, parameter: str, start: date, end: date) -> dict[date, float]:
        if parameter not in WEATHER_CLASSES:
            return {}
        cell, glat, _ = self._cell(lat, lon)
        region_wet = 0.6 + 1.0 * uniform(cell, "region")
        return {d: _weather_value(cell, glat, parameter, d, region_wet) for d in days(start, end)}

    def source_ref(self, lat: float, lon: float) -> str:
        cell, _, _ = self._cell(lat, lon)
        return f"nasa_power (simulated) grid {cell}"


# ---------------------------------------------------------------- simulated devices

_DEVICE_PARAMS = {
    "microclime": ("rain_mm", "air_temp_c", "rel_humidity_pct", "solar_mj_m2", "wind_m_s"),
    "soilsync": ("soil_moisture_20cm_pct", "soil_moisture_60cm_pct", "soil_temp_c", "soil_ec_ds_m", "soil_ph"),
}


def default_parameters(kind: str) -> list[str]:
    return list(_DEVICE_PARAMS.get(kind, ()))


class SimulatedDeviceProvider:
    """Readings that follow the regional weather with a device-specific local bias.

    * ``offline`` / ``retired`` devices return nothing (so the resolver falls back).
    * No readings after the device was last seen, or before it was calibrated.
    """

    name = "varsapradaya_devices"

    def __init__(self, weather: SimulatedNasaPower | None = None):
        self._weather = weather or SimulatedNasaPower()

    def source_ref(self, device: DeviceRef) -> str:
        return f"{device.kind} (simulated) {device.external_id}"[:120]

    def daily(self, device: DeviceRef, parameter: str, start: date, end: date) -> dict[date, float]:
        if device.status != "online" or parameter not in device.parameters:
            return {}
        first, last = start, end
        if device.calibrated_on and device.calibrated_on > first:
            first = device.calibrated_on
        if device.last_seen_at is not None and device.last_seen_at.date() < last:
            last = device.last_seen_at.date()
        if first > last:
            return {}
        seed = device.external_id
        out: dict[date, float] = {}
        if parameter in ("soil_ec_ds_m", "soil_ph"):
            base = 0.25 + 1.1 * uniform(seed, "ec") if parameter == "soil_ec_ds_m" else 5.4 + 2.4 * uniform(seed, "ph")
            for d in days(first, last):
                noise = normal(seed, parameter, d) * (0.03 if parameter == "soil_ph" else 0.04)
                out[d] = round(max(0.01, base + noise), 2)
            return out
        regional = self._weather.daily(device.latitude, device.longitude, parameter, first, last)
        if parameter == "rain_mm":
            factor = 0.85 + 0.5 * uniform(seed, "rain-bias")
            for d, v in regional.items():
                out[d] = round(max(0.0, v * factor * (1 + 0.05 * normal(seed, "r", d))), 1) if v > 0 else 0.0
        else:
            offset = (uniform(seed, parameter, "bias") - 0.5) * 3.0
            for d, v in regional.items():
                out[d] = round(v + offset + 0.4 * normal(seed, parameter, d), 1)
        return out


# ---------------------------------------------------------------- simulated soil grids


WRB_COMMON = ("Luvisols", "Acrisols", "Cambisols", "Ferralsols", "Nitisols", "Lixisols", "Fluvisols")


class SimulatedSoilGrids:
    """Static soil properties on a ~250 m grid, in the spirit of ISRIC SoilGrids (MODELLED)."""

    name = "soilgrids"

    @staticmethod
    def _cell(lat: float, lon: float) -> str:
        return f"{round(lat * 400) / 400:.4f},{round(lon * 400) / 400:.4f}"

    def properties(self, lat: float, lon: float) -> dict[str, float]:
        region = f"{round(lat, 1)},{round(lon, 1)}"
        cell = self._cell(lat, lon)
        clay = _clamp(18 + 22 * uniform(region, "clay") + 4 * normal(cell, "clay"), 5, 65)
        sand = _clamp(70 - clay - 10 * uniform(cell, "sand"), 5, 85)
        return {
            "clay_pct": round(clay, 1),
            "sand_pct": round(sand, 1),
            "silt_pct": round(max(0.0, 100 - clay - sand), 1),
            "ph": round(_clamp(5.2 + 2.6 * uniform(region, "ph") + 0.2 * normal(cell, "ph"), 4.0, 9.0), 2),
            "soc_g_kg": round(_clamp(6 + 14 * uniform(region, "soc") + 2 * normal(cell, "soc"), 1, 60), 1),
            "bdod_g_cm3": round(_clamp(1.2 + 0.35 * uniform(region, "bd"), 0.9, 1.7), 2),
        }

    def wrb_group(self, lat: float, lon: float) -> tuple[str, float] | None:
        """Most probable WRB group, consistent with the simulated texture (Vertisols when very clayey,
        Arenosols when very sandy, otherwise a regional mix of common tropical/temperate groups)."""
        p = self.properties(lat, lon)
        cell = self._cell(lat, lon)
        if p["clay_pct"] >= 45:
            return "Vertisols", round(0.55 + 0.3 * uniform(cell, "wrb-p"), 2)
        if p["sand_pct"] >= 70:
            return "Arenosols", round(0.5 + 0.3 * uniform(cell, "wrb-p"), 2)
        region = f"{round(lat, 1)},{round(lon, 1)}"
        groups = WRB_COMMON
        return groups[int(uniform(region, "wrb") * len(groups))], round(0.3 + 0.4 * uniform(cell, "wrb-p"), 2)

    def source_ref(self, lat: float, lon: float) -> str:
        return f"soilgrids (simulated) cell {self._cell(lat, lon)}"


# ---------------------------------------------------------------- registry

_DEVICE: dict[str, Callable[[], DeviceProvider]] = {"simulated": SimulatedDeviceProvider}
_WEATHER: dict[str, Callable[[], ExternalWeatherProvider]] = {"simulated_nasa_power": SimulatedNasaPower}
_SOIL: dict[str, Callable[[], SoilGridsProvider]] = {"simulated_soilgrids": SimulatedSoilGrids}


def register_device_provider(name: str, factory: Callable[[], DeviceProvider]) -> None:
    _DEVICE[name] = factory


def register_weather_provider(name: str, factory: Callable[[], ExternalWeatherProvider]) -> None:
    _WEATHER[name] = factory


def register_soil_provider(name: str, factory: Callable[[], SoilGridsProvider]) -> None:
    _SOIL[name] = factory


def _pick(registry: dict, env: str, default: str):
    name = os.environ.get(env, default)
    if name not in registry:
        raise RuntimeError(f"Unknown provider '{name}' in {env}. Registered: {sorted(registry)}")
    return registry[name]()


@dataclass
class Providers:
    device: DeviceProvider
    weather: ExternalWeatherProvider
    soil: SoilGridsProvider


def get_providers() -> Providers:
    return Providers(
        device=_pick(_DEVICE, "VC_DEVICE_PROVIDER", "simulated"),
        weather=_pick(_WEATHER, "VC_WEATHER_PROVIDER", "simulated_nasa_power"),
        soil=_pick(_SOIL, "VC_SOIL_PROVIDER", "simulated_soilgrids"),
    )
