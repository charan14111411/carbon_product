"""Satellite adapters.

``SimulatedSentinel`` produces deterministic per-field NDVI / NDMI series (Sentinel-2-like,
5-day revisit) and land-surface temperature (Landsat-like, 8-day revisit). It knows nothing
about what farmers reported: each field's behaviour comes from its own seed, so practice
checks against simulated data are a realistic exercise, not a foregone conclusion.

Choose with ``VC_SATELLITE_PROVIDER`` (default ``simulated_sentinel``). To add a real
provider (e.g. Sentinel Hub, Google Earth Engine) implement ``SatelliteProvider.indices``
and call ``register_satellite_provider("sentinel_hub", factory)``.
"""

from __future__ import annotations

import math
import os
from collections.abc import Callable
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Protocol

from app.modules.supporting.providers import normal, uniform, wetness

CLOUD_LIMIT_PCT = 40.0
PERENNIAL = {"coffee", "tea", "mango", "banana", "agroforestry", "sugarcane", "coconut", "arecanut", "rubber",
             "cocoa", "pepper", "cashew", "orchard", "citrus", "grapes"}


@dataclass(frozen=True)
class FieldRef:
    id: str
    latitude: float
    longitude: float
    crop_code: str | None


@dataclass(frozen=True)
class SatObs:
    index_name: str  # ndvi | ndmi | lst
    observed_on: date
    value: float
    cloud_pct: float
    source: str


class SatelliteProvider(Protocol):
    name: str

    def indices(self, f: FieldRef, start: date, end: date) -> list[SatObs]: ...


def _bell(doy: float, centre: float, width: float) -> float:
    d = min(abs(doy - centre), 365.25 - abs(doy - centre))
    return math.exp(-0.5 * (d / width) ** 2)


class SimulatedSentinel:
    name = "simulated_sentinel"
    S2 = "sentinel2 (simulated)"
    LANDSAT = "landsat (simulated)"
    EPOCH = date(2020, 1, 1)

    def _ndvi(self, f: FieldRef, day: date) -> float:
        seed = f.id
        doy = day.timetuple().tm_yday + (0 if f.latitude >= 0 else 182)
        shift = (f.latitude - 15) * 0.8 + (uniform(seed, "phase") - 0.5) * 20
        w = wetness(f.latitude, day)
        crop = (f.crop_code or "").lower()
        if crop in PERENNIAL:
            v = 0.58 + 0.12 * w + (uniform(seed, "base") - 0.5) * 0.1
        else:
            v = 0.16 + 0.55 * _bell(doy, 240 + shift, 32)
            if uniform(seed, "rabi") < 0.6:
                v += 0.42 * _bell(doy, 40 + shift, 26)
            if uniform(seed, "cover") < 0.3:
                v += 0.3 * _bell(doy, 330 + shift, 16)
        return max(-0.1, min(0.95, v + 0.02 * normal(seed, "ndvi", day)))

    def indices(self, f: FieldRef, start: date, end: date) -> list[SatObs]:
        out: list[SatObs] = []
        offset = int(uniform(f.id, "orbit") * 5)
        awd = (f.crop_code or "").lower() == "rice" and uniform(f.id, "awd") < 0.5
        day = start + timedelta(days=(offset - (start - self.EPOCH).days) % 5)
        while day <= end:
            w = wetness(f.latitude, day)
            cloudy = uniform(f.id, "cloud?", day) < 0.08 + 0.45 * w
            cloud = 45 + 55 * uniform(f.id, "cloud", day) if cloudy else 30 * uniform(f.id, "cloud", day)
            ndvi = self._ndvi(f, day)
            ndmi = (ndvi - 0.25) * 0.8 + 0.15 * w + 0.02 * normal(f.id, "ndmi", day)
            if awd:
                ndmi += 0.12 * math.sin(2 * math.pi * (day - self.EPOCH).days / 14)
            if cloudy:  # clouds depress optical indices; such passes are stored but excluded
                ndvi, ndmi = ndvi * 0.4, ndmi * 0.4
            out.append(SatObs("ndvi", day, round(ndvi, 4), round(cloud, 1), self.S2))
            out.append(SatObs("ndmi", day, round(ndmi, 4), round(cloud, 1), self.S2))
            day += timedelta(days=5)
        day = start + timedelta(days=(3 - (start - self.EPOCH).days) % 8)
        while day <= end:
            w = wetness(f.latitude, day)
            cloudy = uniform(f.id, "lst-cloud?", day) < 0.08 + 0.45 * w
            cloud = 45 + 55 * uniform(f.id, "lst-cloud", day) if cloudy else 25 * uniform(f.id, "lst-cloud", day)
            lst = 24 + 12 * (1 - self._ndvi(f, day)) + 4 * (1 - w) + 1.5 * normal(f.id, "lst", day)
            out.append(SatObs("lst", day, round(lst, 2), round(cloud, 1), self.LANDSAT))
            day += timedelta(days=8)
        return out


_REGISTRY: dict[str, Callable[[], SatelliteProvider]] = {"simulated_sentinel": SimulatedSentinel}


def register_satellite_provider(name: str, factory: Callable[[], SatelliteProvider]) -> None:
    _REGISTRY[name] = factory


def get_satellite_provider() -> SatelliteProvider:
    name = os.environ.get("VC_SATELLITE_PROVIDER", "simulated_sentinel")
    if name not in _REGISTRY:
        raise RuntimeError(f"Unknown satellite provider '{name}'. Registered: {sorted(_REGISTRY)}")
    return _REGISTRY[name]()
