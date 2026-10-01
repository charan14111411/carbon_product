"""ISRIC SoilGrids v2.0 REST API: global 250 m soil property maps, CC-BY 4.0, no key
(``VC_SOIL_PROVIDER=soilgrids``).

Background soil context only: these are **MODELLED** map estimates and never replace laboratory results.
Attribution (CC-BY 4.0): "SoilGrids 2.0, ISRIC – World Soil Information (Poggio et al. 2021)".

Properties (``properties``), as the platform's ``SoilGridsProvider`` returns them: the depth-weighted mean of the
0–5, 5–15 and 15–30 cm layers (weights 5 / 10 / 15 cm), i.e. the 0–30 cm topsoil.

SoilGrids stores integers in "mapped units"; dividing by ``unit_measure.d_factor`` gives the target unit:

* ``clay_pct`` / ``sand_pct`` / ``silt_pct`` ← clay / sand / silt   g/kg ÷ 10 → %
* ``ph``          ← phh2o   pH×10 ÷ 10 → pH (in water)
* ``soc_g_kg``    ← soc     dg/kg ÷ 10 → g/kg
* ``bdod_g_cm3``  ← bdod    cg/cm³ ÷ 100 → g/cm³ (always 100, as in the previous client: cg/cm³ → g/cm³)

SoilGrids answers 200 with ``null`` where it has no estimate (water, built-up land, rock). A null is never turned
into a value: if a property has no value in any of the three layers the whole lookup is "not available".

WRB group (``wrb_group``): the classification endpoint's most probable reference soil group and its probability
(SoilGrids gives percent; returned here as 0–1). Optional: if it fails the suggestion simply has no WRB group.

ISRIC asks for at most ~5 requests a minute, and answers can take 10–40 s; results are cached in-process for a
week (the maps are static) and rate limits are retried with backoff.
"""

from __future__ import annotations

import logging

from app.core.config import get_settings
from app.core.errors import ProviderUnavailable
from app.core.http import JsonHttp, TtlCache

log = logging.getLogger("app.providers")

PROVIDER_LABEL = "ISRIC SoilGrids"
PROPERTIES = {  # SoilGrids property -> platform key
    "clay": "clay_pct", "sand": "sand_pct", "silt": "silt_pct", "phh2o": "ph", "soc": "soc_g_kg",
    "bdod": "bdod_g_cm3",
}
DEPTHS = ("0-5cm", "5-15cm", "15-30cm")
FIXED_D_FACTOR = {"bdod": 100}
DEFAULT_D_FACTOR = 10
ROUND = {"ph": 2, "bdod_g_cm3": 2}
_CACHE = TtlCache(ttl_s=7 * 24 * 3600, max_items=2048)


class SoilGrids:
    name = "soilgrids"

    def __init__(self, http: JsonHttp | None = None):
        s = get_settings()
        self.url = s.soilgrids_url
        self.classification_url = (s.soilgrids_url.replace("/properties/query", "/classification/query")
                                   if s.soilgrids_url.endswith("/properties/query") else None)
        self.http = http or JsonHttp(PROVIDER_LABEL, timeout_s=s.http_timeout_s, retries=s.http_retries,
                                     backoff_s=5.0)

    @staticmethod
    def cache_clear() -> None:
        _CACHE.clear()

    @staticmethod
    def _point(lat: float, lon: float) -> tuple[float, float]:
        return round(lat, 4), round(lon, 4)  # ~10 m; the map cells are 250 m

    def source_ref(self, lat: float, lon: float) -> str:
        la, lo = self._point(lat, lon)
        return f"soilgrids v2.0 250 m, 0-30 cm mean at {la:.4f},{lo:.4f} (ISRIC, CC-BY 4.0)"

    def properties(self, lat: float, lon: float) -> dict[str, float]:
        la, lo = self._point(lat, lon)
        key = ("props", la, lo)
        hit = _CACHE.get(key)
        if hit is not None:
            return dict(hit)
        params = [("lon", lo), ("lat", la), ("value", "mean")]
        params += [("property", p) for p in PROPERTIES] + [("depth", d) for d in DEPTHS]
        props = parse_properties(self.http.get(self.url, params=params))
        _CACHE.put(key, props)
        return dict(props)

    def wrb_group(self, lat: float, lon: float) -> tuple[str, float] | None:
        if not self.classification_url:
            return None
        la, lo = self._point(lat, lon)
        key = ("wrb", la, lo)
        hit = _CACHE.get(key)
        if hit is not None:
            return hit or None
        try:
            body = self.http.get(self.classification_url, params={"lon": lo, "lat": la, "number_classes": 1})
        except ProviderUnavailable as e:
            log.warning("SoilGrids WRB classification unavailable: %s", e.reason)
            return None
        result = parse_wrb(body)
        _CACHE.put(key, result or ())
        return result


def parse_properties(body: dict) -> dict[str, float]:
    try:
        layers = body["properties"]["layers"]
    except (KeyError, TypeError) as e:
        raise ProviderUnavailable(PROVIDER_LABEL, "unexpected answer format") from e
    out: dict[str, float] = {}
    for layer in layers:
        prop = layer.get("name")
        if prop not in PROPERTIES:
            continue
        factor = FIXED_D_FACTOR.get(prop) or (layer.get("unit_measure") or {}).get("d_factor") or DEFAULT_D_FACTOR
        total = weight = 0.0
        for dep in layer.get("depths", []):
            if dep.get("label") not in DEPTHS:
                continue
            v = (dep.get("values") or {}).get("mean")
            if v is None:
                continue  # SoilGrids has no estimate in this layer
            rng = dep.get("range") or {}
            thickness = float(rng.get("bottom_depth", 0)) - float(rng.get("top_depth", 0))
            if thickness <= 0:
                continue
            total += float(v) / float(factor) * thickness
            weight += thickness
        if weight > 0:
            key = PROPERTIES[prop]
            out[key] = round(total / weight, ROUND.get(key, 1))
    missing = sorted(set(PROPERTIES.values()) - set(out))
    if missing:
        raise ProviderUnavailable(PROVIDER_LABEL, "the soil map has no estimate here (water, built-up land or rock?)",
                                  details={"missing": missing}, no_data=True)
    return out


def parse_wrb(body: dict) -> tuple[str, float] | None:
    try:
        probs = body.get("wrb_class_probability") or []
        if probs:
            name, pct = probs[0][0], float(probs[0][1])
        else:
            name, pct = body.get("wrb_class_name"), None
    except (AttributeError, IndexError, TypeError, ValueError):
        return None
    if not name or pct is None:
        return None
    return str(name), round(pct / 100.0, 2)
