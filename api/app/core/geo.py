"""Geometry in Python so the same answers come out on any database.

Coordinates are GeoJSON order: [longitude, latitude] (WGS84).
Areas are geodesic (on the ellipsoid), so they are correct anywhere, not just in one map zone.
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass

from pyproj import Geod
from shapely.geometry import Point, mapping, shape
from shapely.geometry.base import BaseGeometry
from shapely.validation import explain_validity

from app.core.errors import ValidationFailed

_GEOD = Geod(ellps="WGS84")
EARTH_RADIUS_M = 6_371_008.8


@dataclass(frozen=True)
class Footprint:
    geojson: dict
    area_ha: float
    centroid_lat: float
    centroid_lon: float
    min_lat: float
    max_lat: float
    min_lon: float
    max_lon: float


def parse_polygon(geojson: dict) -> BaseGeometry:
    if not isinstance(geojson, dict) or geojson.get("type") not in ("Polygon", "MultiPolygon"):
        raise ValidationFailed("The boundary must be a GeoJSON Polygon or MultiPolygon.", code="INVALID_GEOMETRY")
    try:
        geom = shape(geojson)
    except Exception as exc:  # malformed coordinates
        raise ValidationFailed("The boundary coordinates could not be read.", code="INVALID_GEOMETRY") from exc
    if geom.is_empty:
        raise ValidationFailed("The boundary is empty.", code="INVALID_GEOMETRY")
    if not geom.is_valid:
        raise ValidationFailed(
            f"The boundary is not a valid shape ({explain_validity(geom)}). Check that the edges don't cross.",
            code="INVALID_GEOMETRY",
        )
    minx, miny, maxx, maxy = geom.bounds
    if not (-180 <= minx <= maxx <= 180 and -90 <= miny <= maxy <= 90):
        raise ValidationFailed("Coordinates must be longitude/latitude in degrees.", code="INVALID_GEOMETRY")
    return geom


def area_ha(geom: BaseGeometry) -> float:
    area_m2, _ = _GEOD.geometry_area_perimeter(geom)
    return abs(area_m2) / 10_000.0


def footprint(geojson: dict) -> Footprint:
    geom = parse_polygon(geojson)
    ha = area_ha(geom)
    if ha <= 0.001:
        raise ValidationFailed("The boundary is too small to be a field.", code="INVALID_GEOMETRY")
    c = geom.representative_point() if not geom.centroid.within(geom) else geom.centroid
    minx, miny, maxx, maxy = geom.bounds
    return Footprint(mapping(geom), round(ha, 4), c.y, c.x, miny, maxy, minx, maxx)


def contains(geojson: dict, lat: float, lon: float) -> bool:
    return parse_polygon(geojson).covers(Point(lon, lat))


def overlaps(a: dict, b: dict) -> bool:
    """True if the shapes share area. Fields that only touch along an edge do not overlap."""
    ga, gb = parse_polygon(a), parse_polygon(b)
    if not ga.intersects(gb):
        return False
    inter = ga.intersection(gb)
    return inter.area > 1e-12 and area_ha(inter) > 0.0001


def distance_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lon2 - lon1)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * EARTH_RADIUS_M * math.asin(math.sqrt(h))


def random_points(geojsons: list[dict], n: int, seed: int, max_tries: int = 5000) -> list[tuple[float, float]]:
    """``n`` reproducible random points (lat, lon) inside the union of the polygons."""
    if n <= 0:
        return []
    geoms = [parse_polygon(g) for g in geojsons]
    weights = [area_ha(g) for g in geoms]
    rng = random.Random(seed)
    out: list[tuple[float, float]] = []
    tries = 0
    while len(out) < n:
        tries += 1
        if tries > max_tries * n:
            raise ValidationFailed("Couldn't place enough points inside the zone. Check the field boundaries.")
        g = rng.choices(geoms, weights=weights, k=1)[0]
        minx, miny, maxx, maxy = g.bounds
        x, y = rng.uniform(minx, maxx), rng.uniform(miny, maxy)
        if g.covers(Point(x, y)):
            out.append((round(y, 7), round(x, 7)))
    return out


def square(lat: float, lon: float, side_m: float) -> dict:
    """A square GeoJSON polygon centred on a point. Handy for demo data and tests."""
    dlat = (side_m / 2) / 111_320.0
    dlon = (side_m / 2) / (111_320.0 * math.cos(math.radians(lat)))
    ring = [
        [lon - dlon, lat - dlat], [lon + dlon, lat - dlat], [lon + dlon, lat + dlat],
        [lon - dlon, lat + dlat], [lon - dlon, lat - dlat],
    ]
    return {"type": "Polygon", "coordinates": [ring]}
