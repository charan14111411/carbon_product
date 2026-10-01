"""Real terrain: Copernicus DEM GLO-30 via Microsoft Planetary Computer (``VC_TERRAIN_PROVIDER=copernicus_dem``).

GLO-30 is a global 1 arc-second (~30 m) digital surface model, free to use (© DLR e.V. 2010-2014 and © Airbus
Defence and Space GmbH 2014-2018, provided under COPERNICUS by the European Union and ESA). Heights are metres
above the EGM2008 geoid. It is a *surface* model, so dense tree canopy and buildings raise it a little; slope
classes at field scale are still reliable. The values feed ``terrain.compute_terrain`` (DERIVED).

``elevation(lat, lon)`` is called for every node of the terrain grid, so the provider fetches small raster windows
instead of points: windows of 0.02° (72 × 72 one-arc-second pixels, plus one pixel of padding on each side) on a
fixed grid aligned with the 1° tiles, through the Data API ``item/bbox/...npy`` endpoint, and interpolates
bilinearly between pixel centres. A typical field needs one to four windows; windows are cached in-process.
No tile (open sea) or masked pixels → "not available" (``ProviderUnavailable``), never a guessed height.
"""

from __future__ import annotations

import math

import numpy as np

from app.core.errors import ProviderUnavailable
from app.core.http import TtlCache
from app.core.planetary_computer import PlanetaryComputerClient

PROVIDER_LABEL = "Copernicus DEM (Planetary Computer)"
COLLECTION = "cop-dem-glo-30"
ASSET = "data"
WINDOWS_PER_DEG = 50  # 0.02° windows; 50 per degree so a window never straddles two 1° tiles
PIXELS = 72  # one arc-second pixels per window side
PAD = 1
_WINDOWS = TtlCache(ttl_s=24 * 3600, max_items=256)
_TILES = TtlCache(ttl_s=24 * 3600, max_items=256)


class CopernicusDEM:
    name = "copernicus_dem"

    def __init__(self, client: PlanetaryComputerClient | None = None):
        self.pc = client or PlanetaryComputerClient()

    @staticmethod
    def cache_clear() -> None:
        _WINDOWS.clear()
        _TILES.clear()

    def source_ref(self, lat: float, lon: float) -> str:
        return f"copernicus dem glo-30 (planetary computer) tile {_tile_name(lat, lon)} around {lat:.4f},{lon:.4f}"

    def elevation(self, lat: float, lon: float) -> float:
        wi, wj = math.floor(lat * WINDOWS_PER_DEG), math.floor(lon * WINDOWS_PER_DEG)
        arr, bounds = self._window(wi, wj, lat, lon)
        return sample(arr, bounds, lat, lon)

    # ------------------------------------------------------------------ internals
    def _item(self, lat: float, lon: float) -> str:
        key = (math.floor(lat), math.floor(lon))
        hit = _TILES.get(key)
        if hit is not None:
            return hit
        cy, cx = key[0] + 0.5, key[1] + 0.5
        items = self.pc.search(COLLECTION, {"type": "Point", "coordinates": [cx, cy]}, limit=5)
        if not items:
            raise ProviderUnavailable(PROVIDER_LABEL, "no DEM tile covers this location (open sea?)", no_data=True)
        return _TILES.put(key, items[0]["id"])

    def _window(self, wi: int, wj: int, lat: float, lon: float) -> tuple[np.ndarray, tuple[float, float, float, float]]:
        key = (wi, wj)
        hit = _WINDOWS.get(key)
        if hit is not None:
            return hit
        px = 1.0 / (WINDOWS_PER_DEG * PIXELS)
        miny, minx = wi / WINDOWS_PER_DEG - PAD * px, wj / WINDOWS_PER_DEG - PAD * px
        maxy, maxx = (wi + 1) / WINDOWS_PER_DEG + PAD * px, (wj + 1) / WINDOWS_PER_DEG + PAD * px
        size = PIXELS + 2 * PAD
        arr = self.pc.bbox_array(COLLECTION, self._item(lat, lon), ASSET, (minx, miny, maxx, maxy), size, size)
        return _WINDOWS.put(key, (arr, (minx, miny, maxx, maxy)))


def _tile_name(lat: float, lon: float) -> str:
    la, lo = math.floor(lat), math.floor(lon)
    return f"{'N' if la >= 0 else 'S'}{abs(la):02d}_{'E' if lo >= 0 else 'W'}{abs(lo):03d}"


def sample(arr: np.ndarray, bounds: tuple[float, float, float, float], lat: float, lon: float) -> float:
    """Bilinear interpolation between pixel centres; rows run north→south; the last band is the mask."""
    minx, miny, maxx, maxy = bounds
    data, mask = arr[0], arr[-1]
    h, w = data.shape
    fx = (lon - minx) / (maxx - minx) * w - 0.5
    fy = (maxy - lat) / (maxy - miny) * h - 0.5
    fx, fy = min(max(fx, 0.0), w - 1.0), min(max(fy, 0.0), h - 1.0)
    j0, i0 = int(math.floor(fx)), int(math.floor(fy))
    j1, i1 = min(j0 + 1, w - 1), min(i0 + 1, h - 1)
    tx, ty = fx - j0, fy - i0
    total = weight = 0.0
    for i, j, wgt in ((i0, j0, (1 - tx) * (1 - ty)), (i0, j1, tx * (1 - ty)), (i1, j0, (1 - tx) * ty),
                      (i1, j1, tx * ty)):
        if mask[i, j] > 0 and math.isfinite(float(data[i, j])):
            total += wgt * float(data[i, j])
            weight += wgt
    if weight <= 1e-9:
        raise ProviderUnavailable(PROVIDER_LABEL, "the DEM has no valid height here", no_data=True)
    return total / weight
