"""Terrain from a digital elevation model: slope, aspect, elevation and the VM0042 slope class.

Provider
--------
``TerrainProvider.elevation(lat, lon) -> metres``. The default ``SimulatedDEM`` is a smooth,
deterministic surface (a regional base plus a few sinusoidal hill systems whose amplitude varies
smoothly in space), so neighbouring fields get consistent terrain and some regions are hilly
while others are nearly level. Its ``source_ref`` contains "(simulated)". A real DEM
(Copernicus GLO-30 via Planetary Computer, ``copernicus_dem.py``) is chosen with
``VC_TERRAIN_PROVIDER=copernicus_dem`` (process environment or api/.env); others plug in via
``register_terrain_provider``.

Method
------
1. Lay a regular grid over the field's bounding box plus one cell of buffer, in local metres
   (equirectangular around the box centre; errors are negligible at field scale). Cell size is
   ``clamp(max(width, height) / 20, 10 m, 30 m)`` (the resolution of common global DEMs), coarsened
   if needed so the grid is at most 80 × 80.
2. Sample the DEM at every node and compute the gradient at interior nodes with **Horn's (1981)
   3 × 3 finite-difference method**:

       dz/dx = ((z[i+1,j+1] + 2 z[i,j+1] + z[i-1,j+1]) − (z[i+1,j-1] + 2 z[i,j-1] + z[i-1,j-1])) / (8 Δx)
       dz/dy = ((z[i+1,j-1] + 2 z[i+1,j] + z[i+1,j+1]) − (z[i-1,j-1] + 2 z[i-1,j] + z[i-1,j+1])) / (8 Δy)

   (rows run south→north, columns west→east). Slope % = 100 · √(dz/dx² + dz/dy²);
   aspect ° = atan2(−dz/dx, −dz/dy), clockwise from north (the direction the slope faces).
3. Keep nodes whose centre lies inside the field polygon (the node nearest the centroid if none do).
   Field slope = mean node slope; field aspect = aspect of the mean gradient vector; elevation = mean.
4. **Most frequent slope class** (VM0042 v2.2 Appendix 5 Table 10) = the class with most nodes
   (ties go to the gentler class). Table 10 gives integer ranges (0–3, 4–8, 9–16, 17–30, 31–45, > 45)
   with gaps between them; continuous slopes are binned lower-inclusive at the half-way points:
   [0, 3.5) nearly level, [3.5, 8.5) gently sloping/undulating, [8.5, 16.5) strongly sloping/rolling,
   [16.5, 30.5) moderately steep/hilly, [30.5, 45.5) steep, ≥ 45.5 very steep.
"""

from __future__ import annotations

import math
from collections.abc import Callable
from dataclasses import dataclass
from typing import Protocol

import numpy as np
from shapely.geometry import Point

from app.core.config import provider_choice
from app.core.geo import parse_polygon
from app.modules.land.domain import SLOPE_CLASSES as _LAND_SLOPES
from app.modules.land.domain import slope_class as _land_slope_class

# (code, label, lower %, upper %) — derived from the single Appendix 5 Table 10 definition in land/domain.py.
SLOPE_CLASSES: tuple[tuple[str, str, float, float], ...] = tuple(
    (code, label, _LAND_SLOPES[i - 1][0] if i else 0.0, upper) for i, (upper, code, label) in enumerate(_LAND_SLOPES))
ASPECT_RELEVANT = ("moderately_steep", "steep", "very_steep")  # Table 7: aspect within 30° when hilly or steeper
MAX_GRID = 80
M_PER_DEG_LAT = 110_574.0
M_PER_DEG_LON_EQ = 111_320.0


def slope_class(slope_pct: float) -> str:
    return _land_slope_class(slope_pct) or SLOPE_CLASSES[0][0]


def slope_class_label(code: str) -> str:
    return next(label for c, label, _, _ in SLOPE_CLASSES if c == code)


# ------------------------------------------------------------------ providers
class TerrainProvider(Protocol):
    name: str

    def elevation(self, lat: float, lon: float) -> float: ...

    def source_ref(self, lat: float, lon: float) -> str: ...


class SimulatedDEM:
    name = "simulated_dem"
    # (amplitude m, wavelength lat °, wavelength lon °, phase lat, phase lon)
    HILLS = ((110.0, 0.047, 0.061, 0.3, 1.1), (45.0, 0.019, 0.023, 2.0, 0.4),
             (22.0, 0.0085, 0.011, 4.1, 2.7), (8.0, 0.0041, 0.0037, 1.7, 5.2))

    @staticmethod
    def hilliness(lat: float, lon: float) -> float:
        return 0.15 + 0.85 * (0.5 + 0.5 * math.sin(lat * 3.1 + 1.3) * math.cos(lon * 2.7 + 0.4))

    def elevation(self, lat: float, lon: float) -> float:
        base = 650.0 + 400.0 * math.sin(math.radians(lat * 9.0)) * math.cos(math.radians(lon * 7.0))
        h = self.hilliness(lat, lon)
        local = sum(a * math.sin(2 * math.pi * lat / wl + pl) * math.cos(2 * math.pi * lon / wn + pn)
                    for a, wl, wn, pl, pn in self.HILLS)
        return base + h * local

    def source_ref(self, lat: float, lon: float) -> str:
        return f"dem (simulated) around {lat:.4f},{lon:.4f}"


def _copernicus_dem() -> TerrainProvider:
    from app.modules.supporting.copernicus_dem import CopernicusDEM  # real GLO-30 via Planetary Computer

    return CopernicusDEM()


_TERRAIN: dict[str, Callable[[], TerrainProvider]] = {"simulated_dem": SimulatedDEM, "copernicus_dem": _copernicus_dem}


def register_terrain_provider(name: str, factory: Callable[[], TerrainProvider]) -> None:
    _TERRAIN[name] = factory


def get_terrain_provider() -> TerrainProvider:
    name = provider_choice("VC_TERRAIN_PROVIDER", "simulated_dem")
    if name not in _TERRAIN:
        raise RuntimeError(f"Unknown terrain provider '{name}'. Registered: {sorted(_TERRAIN)}")
    return _TERRAIN[name]()


# ------------------------------------------------------------------ computation
@dataclass
class TerrainResult:
    elevation_mean_m: float
    elevation_min_m: float
    elevation_max_m: float
    slope_mean_pct: float
    slope_p50_pct: float
    slope_max_pct: float
    aspect_deg: float | None
    dominant_class: str
    histogram: dict[str, dict]
    n_cells: int
    cell_size_m: float
    grid: tuple[int, int]


def horn(z: np.ndarray, dx: float, dy: float) -> tuple[np.ndarray, np.ndarray]:
    """dz/dx (east) and dz/dy (north) at interior nodes; rows south→north, columns west→east."""
    a, b, c = z[:-2, :-2], z[:-2, 1:-1], z[:-2, 2:]      # south row
    d, f = z[1:-1, :-2], z[1:-1, 2:]                     # middle row
    g, h, i = z[2:, :-2], z[2:, 1:-1], z[2:, 2:]          # north row
    dzdx = ((c + 2 * f + i) - (a + 2 * d + g)) / (8 * dx)
    dzdy = ((g + 2 * h + i) - (a + 2 * b + c)) / (8 * dy)
    return dzdx, dzdy


def aspect_of(dzdx: float, dzdy: float) -> float:
    return round(math.degrees(math.atan2(-dzdx, -dzdy)) % 360.0, 2)


def compute_terrain(boundary: dict, provider: TerrainProvider) -> TerrainResult:
    geom = parse_polygon(boundary)
    minx, miny, maxx, maxy = geom.bounds
    lat0, lon0 = (miny + maxy) / 2, (minx + maxx) / 2
    mx = M_PER_DEG_LON_EQ * math.cos(math.radians(lat0))
    width, height = (maxx - minx) * mx, (maxy - miny) * M_PER_DEG_LAT
    cell = min(30.0, max(10.0, max(width, height) / 20.0))
    nx, ny = int(math.ceil(width / cell)) + 3, int(math.ceil(height / cell)) + 3
    if max(nx, ny) > MAX_GRID:
        cell *= max(nx, ny) / MAX_GRID
        nx, ny = int(math.ceil(width / cell)) + 3, int(math.ceil(height / cell)) + 3
    # node (i, j): y = -cell + i·cell from the south edge, x likewise from the west edge
    xs = -cell + np.arange(nx) * cell + (width - (nx - 3) * cell) / 2
    ys = -cell + np.arange(ny) * cell + (height - (ny - 3) * cell) / 2
    lons = minx + xs / mx
    lats = miny + ys / M_PER_DEG_LAT
    z = np.array([[provider.elevation(float(la), float(lo)) for lo in lons] for la in lats])
    dzdx, dzdy = horn(z, cell, cell)
    inner_lats, inner_lons = lats[1:-1], lons[1:-1]
    mask = np.array([[geom.covers(Point(float(lo), float(la))) for lo in inner_lons] for la in inner_lats])
    if not mask.any():
        c = geom.centroid
        i = int(np.argmin(np.abs(inner_lats - c.y)))
        j = int(np.argmin(np.abs(inner_lons - c.x)))
        mask[i, j] = True
    gx, gy = dzdx[mask], dzdy[mask]
    slopes = 100.0 * np.hypot(gx, gy)
    elev = z[1:-1, 1:-1][mask]
    counts = {code: 0 for code, *_ in SLOPE_CLASSES}
    for s in slopes:
        counts[slope_class(float(s))] += 1
    n = int(mask.sum())
    order = [code for code, *_ in SLOPE_CLASSES]
    dominant = max(order, key=lambda c: (counts[c], -order.index(c)))
    mean_gx, mean_gy = float(gx.mean()), float(gy.mean())
    aspect = aspect_of(mean_gx, mean_gy) if math.hypot(mean_gx, mean_gy) > 1e-9 else None
    hist = {code: {"label": slope_class_label(code), "cells": counts[code], "share": round(counts[code] / n, 4)}
            for code in order}
    return TerrainResult(
        elevation_mean_m=round(float(elev.mean()), 2), elevation_min_m=round(float(elev.min()), 2),
        elevation_max_m=round(float(elev.max()), 2), slope_mean_pct=round(float(slopes.mean()), 3),
        slope_p50_pct=round(float(np.median(slopes)), 3), slope_max_pct=round(float(slopes.max()), 3),
        aspect_deg=aspect, dominant_class=dominant, histogram=hist, n_cells=n, cell_size_m=round(cell, 2),
        grid=(ny, nx),
    )
