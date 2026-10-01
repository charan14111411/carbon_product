"""Real satellite indices from Microsoft Planetary Computer (``VC_SATELLITE_PROVIDER=planetary_computer``).

Free and open data (Sentinel-2 and Landsat, commercial use included); statistics are computed server-side by the
Planetary Computer Data API inside the field polygon, so nothing is downloaded. Intelligence only: these values
inform sampling, QA and practice checks and are never credit-eligible (``wall()`` labels every output).

Sentinel-2 L2A (``sentinel-2-l2a``, 10–20 m, ~5-day revisit) — OBSERVED
* NDVI = (B08 − B04) / (B08 + B04)
* NDMI = (B8A − B11) / (B8A + B11)
* NDWI = (B03 − B08) / (B03 + B08)   (McFeeters 1996)
* Processing baseline ≥ 04.00 (scenes from 25 Jan 2022) stores reflectance × 10000 **+ 1000**; the offset is
  removed (denominator − 2000) so indices are comparable across years. Without it NDVI is badly underestimated.
* Clouds: the scene classification layer (SCL) is read with the bands. Pixels that are cloud shadow (3),
  cloud medium/high (8, 9), thin cirrus (10), no data (0) or saturated/defective (1) are left out of the means
  (each index is the mean over the remaining clear pixels), and ``cloud_pct`` is the share of the *field* (not the
  scene) that was left out. The platform then excludes passes above ``CLOUD_LIMIT_PCT`` (40 %).
* Scenes with more than 80 % scene-level cloud are not checked; same-day duplicates (overlapping tiles,
  reprocessed items) are reduced to one pass per day (the least cloudy).

Landsat 8/9 Collection 2 Level-2 (``landsat-c2-l2``, thermal 100 m resampled to 30 m, ~8-day combined) — OBSERVED
* LST °C = lwir11 × 0.00341802 + 149.0 − 273.15 (USGS C2 ST scale/offset, Kelvin → °C)
* Clouds: QA_PIXEL bits 0–4 (fill, dilated cloud, cirrus, cloud, cloud shadow) are left out; ``cloud_pct`` is the
  share of the field left out. Values outside −30…75 °C are dropped as implausible.

LAI is not requested from the provider: the platform derives it (DERIVED) from each pass's NDVI with the documented
empirical relation in ``providers.lai_from_ndvi``.

Failures: if Sentinel-2 or Landsat cannot be reached the other is still returned; if neither can be reached the
refresh fails with "provider unavailable" (503) and nothing is written. A single scene that fails is skipped.
"""

from __future__ import annotations

import logging
import math
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime

from app.core.errors import ProviderUnavailable
from app.core.planetary_computer import PROVIDER_LABEL, PlanetaryComputerClient
from app.modules.intelligence.providers import FieldRef, SatObs

log = logging.getLogger("app.providers")

S2_COLLECTION = "sentinel-2-l2a"
LANDSAT_COLLECTION = "landsat-c2-l2"
S2_SOURCE = "sentinel-2-l2a (planetary computer)"
LANDSAT_SOURCE = "landsat-c2-l2 (planetary computer)"
MAX_SCENE_CLOUD_PCT = 80
OFFSET_BASELINE = "04.00"
OFFSET_FROM = date(2022, 1, 25)
POINT_HALF_DEG = 0.0003  # ~33 m: a small square around the centroid when the field has no boundary
WORKERS = 4
LST_RANGE_C = (-30.0, 75.0)

S2_INVALID = "(SCL==0)|(SCL==1)|(SCL==3)|(SCL==8)|(SCL==9)|(SCL==10)"
LANDSAT_INVALID = "((qa_pixel % 32)>0)"  # bits 0-4: fill, dilated cloud, cirrus, cloud, cloud shadow
LANDSAT_LST = "lwir11*0.00341802+149.0-273.15"


def s2_expressions(offset: bool) -> list[str]:
    """[clear-pixel share, NDVI·clear, NDMI·clear, NDWI·clear]; dividing by the share gives clear-pixel means."""
    d = "-2000" if offset else ""
    return [
        f"where({S2_INVALID},0,1)",
        f"where({S2_INVALID},0,(B08-B04)/(B08+B04{d}))",
        f"where({S2_INVALID},0,(B8A-B11)/(B8A+B11{d}))",
        f"where({S2_INVALID},0,(B03-B08)/(B03+B08{d}))",
    ]


LANDSAT_EXPRESSIONS = [f"where({LANDSAT_INVALID},0,1)", f"where({LANDSAT_INVALID},0,{LANDSAT_LST})"]


def field_geometry(f: FieldRef) -> dict:
    b = f.boundary
    if isinstance(b, dict) and b.get("type") in ("Polygon", "MultiPolygon") and b.get("coordinates"):
        return b
    lat, lon, d = f.latitude, f.longitude, POINT_HALF_DEG
    return {"type": "Polygon", "coordinates": [[[lon - d, lat - d], [lon + d, lat - d], [lon + d, lat + d],
                                                [lon - d, lat + d], [lon - d, lat - d]]]}


def _day(item: dict) -> date:
    return datetime.fromisoformat(item["properties"]["datetime"].replace("Z", "+00:00")).date()


def one_per_day(items: list[dict]) -> list[dict]:
    best: dict[date, dict] = {}
    for it in items:
        try:
            d = _day(it)
        except (KeyError, TypeError, ValueError):
            continue
        cc = float(it["properties"].get("eo:cloud_cover", 100) or 0)
        if d not in best or cc < float(best[d]["properties"].get("eo:cloud_cover", 100) or 0):
            best[d] = it
    return [best[d] for d in sorted(best)]


def needs_offset(item: dict) -> bool:
    baseline = item["properties"].get("s2:processing_baseline")
    if baseline:
        try:
            return float(baseline) >= float(OFFSET_BASELINE)
        except ValueError:
            pass
    return _day(item) >= OFFSET_FROM


def clear_means(stats: list[dict]) -> tuple[float, list[float | None]]:
    """(invalid share %, clear-pixel mean of each following expression)."""
    share = float(stats[0].get("mean") or 0.0)
    cloud_pct = round(100.0 * (1.0 - share), 1)
    if share <= 0:
        return cloud_pct, [None] * (len(stats) - 1)
    out: list[float | None] = []
    for s in stats[1:]:
        m = s.get("mean")
        v = None if m is None else float(m) / share
        out.append(v if v is not None and math.isfinite(v) else None)
    return cloud_pct, out


class PlanetaryComputer:
    name = "planetary_computer"

    def __init__(self, client: PlanetaryComputerClient | None = None, workers: int = WORKERS):
        self.pc = client or PlanetaryComputerClient()
        self.workers = workers

    def indices(self, f: FieldRef, start: date, end: date) -> list[SatObs]:
        geom = field_geometry(f)
        out: list[SatObs] = []
        failures: list[ProviderUnavailable] = []
        for label, fn in (("Sentinel-2", self._sentinel2), ("Landsat", self._landsat)):
            try:
                out += fn(geom, start, end)
            except ProviderUnavailable as e:
                log.warning("%s via Planetary Computer failed for field %s: %s", label, f.id, e.reason)
                failures.append(e)
        if len(failures) == 2:
            raise ProviderUnavailable(PROVIDER_LABEL, failures[0].reason)
        return out

    # ------------------------------------------------------------------ helpers
    def _map(self, collection: str, fn, items: list[dict]) -> list[SatObs]:
        """Run ``fn`` per scene (a few in parallel). ``fn`` returns None when the scene's statistics failed."""
        if self.workers <= 1 or len(items) <= 1:
            results = [fn(it) for it in items]
        else:
            with ThreadPoolExecutor(max_workers=self.workers) as pool:
                results = list(pool.map(fn, items))
        if items and all(r is None for r in results):
            raise ProviderUnavailable(PROVIDER_LABEL, f"{collection} statistics failed for every scene")
        return [o for r in results if r for o in r]

    def _scene_stats(self, collection: str, item: dict, geom: dict, expressions: list[str]) -> list[dict] | None:
        try:
            return self.pc.statistics(collection, item["id"], geom, expressions)
        except ProviderUnavailable as e:
            log.info("skipping %s scene %s: %s", collection, item.get("id"), e.reason)
            return None

    def _sentinel2(self, geom: dict, start: date, end: date) -> list[SatObs]:
        items = one_per_day(self.pc.search(
            S2_COLLECTION, geom, start, end, query={"eo:cloud_cover": {"lt": MAX_SCENE_CLOUD_PCT}},
            fields=["properties.datetime", "properties.eo:cloud_cover", "properties.s2:processing_baseline"]))

        def one(it: dict) -> list[SatObs] | None:
            stats = self._scene_stats(S2_COLLECTION, it, geom, s2_expressions(needs_offset(it)))
            if stats is None:
                return None
            cloud, (ndvi, ndmi, ndwi) = clear_means(stats)
            day = _day(it)
            return [SatObs(name, day, round(max(-1.0, min(1.0, v)), 4), cloud, S2_SOURCE)
                    for name, v in (("ndvi", ndvi), ("ndmi", ndmi), ("ndwi", ndwi)) if v is not None]

        return self._map(S2_COLLECTION, one, items)

    def _landsat(self, geom: dict, start: date, end: date) -> list[SatObs]:
        items = one_per_day(self.pc.search(
            LANDSAT_COLLECTION, geom, start, end,
            query={"eo:cloud_cover": {"lt": MAX_SCENE_CLOUD_PCT}, "platform": {"in": ["landsat-8", "landsat-9"]}},
            fields=["properties.datetime", "properties.eo:cloud_cover", "properties.platform"]))

        def one(it: dict) -> list[SatObs] | None:
            stats = self._scene_stats(LANDSAT_COLLECTION, it, geom, LANDSAT_EXPRESSIONS)
            if stats is None:
                return None
            cloud, (lst,) = clear_means(stats)
            if lst is None or not (LST_RANGE_C[0] <= lst <= LST_RANGE_C[1]):
                return []
            return [SatObs("lst", _day(it), round(lst, 2), cloud, LANDSAT_SOURCE)]

        return self._map(LANDSAT_COLLECTION, one, items)
