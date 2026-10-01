"""NASA POWER daily point API: free gridded weather worldwide, no key (``VC_WEATHER_PROVIDER=nasa_power``).

Tier-3 regional weather when no Varsapradaya station is near. POWER meteorology comes from the MERRA-2
reanalysis (about 0.5° × 0.625°) and solar from CERES/SYN1deg (about 1°), so every value is **MODELLED**,
never a measurement. Recent days (roughly the last week) are not yet published and come back as the fill value;
they are left out, so the resolver records them as not available.

Platform parameter  ← POWER parameter (community AG)       unit
* ``rain_mm``          ← PRECTOTCORR (bias-corrected precipitation)  mm/day
* ``air_temp_c``       ← T2M (2 m air temperature, daily mean)        °C
* ``rel_humidity_pct`` ← RH2M (2 m relative humidity)                 %
* ``solar_mj_m2``      ← ALLSKY_SFC_SW_DWN (all-sky shortwave)        MJ/m²/day (the AG community already reports
  MJ; a kWh/m²/day answer is converted × 3.6 — the unit is read from the answer, never assumed)
* ``wind_m_s``         ← WS2M (2 m wind speed)                        m/s

Not offered (the resolver records "no external source offers ..."):
* soil moisture: POWER GWETTOP / GWETROOT are *relative wetness* (fraction 0–1 of saturation), NOT % volumetric
  water content, so they are not comparable with SoilSync readings or the platform's ``soil_moisture_*_pct``.
* soil temperature: POWER TS is the earth *skin* temperature, not soil temperature at depth.
* soil EC / pH: no public gridded source.

One request fetches all five parameters for a location and window; answers are cached in-process for 6 hours.
"""

from __future__ import annotations

from datetime import date, datetime

from app.core.config import get_settings
from app.core.errors import ProviderUnavailable
from app.core.http import JsonHttp, TtlCache

PROVIDER_LABEL = "NASA POWER"
POWER_PARAMETERS = {  # platform parameter -> (POWER parameter, accepted unit spellings)
    "rain_mm": ("PRECTOTCORR", ("mm/day",)),
    "air_temp_c": ("T2M", ("C", "°C", "degC")),
    "rel_humidity_pct": ("RH2M", ("%",)),
    "solar_mj_m2": ("ALLSKY_SFC_SW_DWN", ("MJ/m^2/day", "kW-hr/m^2/day")),
    "wind_m_s": ("WS2M", ("m/s",)),
}
KWH_TO_MJ = 3.6
_CACHE = TtlCache(ttl_s=6 * 3600, max_items=256)
_DOWN = TtlCache(ttl_s=120, max_items=8)  # remember an outage briefly so one sync does not retry per parameter


class NasaPower:
    name = "nasa_power"

    def __init__(self, http: JsonHttp | None = None):
        s = get_settings()
        self.url = s.nasa_power_url
        self.http = http or JsonHttp(PROVIDER_LABEL, timeout_s=s.http_timeout_s, retries=s.http_retries)

    @staticmethod
    def cache_clear() -> None:
        _CACHE.clear()
        _DOWN.clear()

    def data_class(self, parameter: str) -> str | None:
        return "MODELLED" if parameter in POWER_PARAMETERS else None

    def source_ref(self, lat: float, lon: float) -> str:
        return f"nasa_power daily point {lat:.3f},{lon:.3f} (MERRA-2 ~0.5°x0.625°, POWER AG community)"

    def daily(self, lat: float, lon: float, parameter: str, start: date, end: date) -> dict[date, float]:
        if parameter not in POWER_PARAMETERS:
            return {}
        return self._all(lat, lon, start, end).get(parameter, {})

    # ------------------------------------------------------------------ internals
    def _all(self, lat: float, lon: float, start: date, end: date) -> dict[str, dict[date, float]]:
        key = (round(lat, 4), round(lon, 4), start, end)
        hit = _CACHE.get(key)
        if hit is not None:
            return hit
        down = _DOWN.get(self.url)
        if down is not None:
            raise ProviderUnavailable(PROVIDER_LABEL, down)
        try:
            body = self.http.get(self.url, params={
                "parameters": ",".join(p for p, _ in POWER_PARAMETERS.values()), "community": "AG",
                "latitude": round(lat, 4), "longitude": round(lon, 4), "start": start.strftime("%Y%m%d"),
                "end": end.strftime("%Y%m%d"), "format": "JSON"})
            parsed = parse_power(body)
        except ProviderUnavailable as e:
            _DOWN.put(self.url, e.reason)
            raise
        return _CACHE.put(key, parsed)


def parse_power(body: dict) -> dict[str, dict[date, float]]:
    """POWER JSON -> {platform parameter: {day: value}}. Fill values are dropped (not guessed)."""
    try:
        fill = float(body.get("header", {}).get("fill_value", -999.0))
        units = body.get("parameters", {}) or {}
        series_by_power = body["properties"]["parameter"]
    except (AttributeError, KeyError, TypeError, ValueError) as e:
        raise ProviderUnavailable(PROVIDER_LABEL, "unexpected answer format") from e
    out: dict[str, dict[date, float]] = {}
    for param, (power_name, accepted) in POWER_PARAMETERS.items():
        series = series_by_power.get(power_name)
        if not isinstance(series, dict):
            continue
        unit = str((units.get(power_name) or {}).get("units", accepted[0]))
        if unit not in accepted:
            continue  # an unexpected unit is never converted by guesswork
        factor = KWH_TO_MJ if unit.startswith("kW") else 1.0
        values: dict[date, float] = {}
        for day, v in series.items():
            if v is None:
                continue
            try:
                v = float(v)
                d = datetime.strptime(str(day), "%Y%m%d").date()
            except ValueError:
                continue
            if v == fill or v <= -999.0:
                continue
            values[d] = round(v * factor, 3)
        out[param] = values
    return out
