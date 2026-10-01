"""Soil classification helpers (pure).

``usda_texture_class`` follows the USDA soil texture triangle (Soil Survey Manual, USDA 2017),
the same class names FAO uses. Sand/silt/clay are renormalised to 100 % first.
"""

from __future__ import annotations

TEXTURE_CLASSES = (
    "sand", "loamy sand", "sandy loam", "loam", "silt loam", "silt", "sandy clay loam", "clay loam",
    "silty clay loam", "sandy clay", "silty clay", "clay",
)


def usda_texture_class(sand_pct: float, silt_pct: float, clay_pct: float) -> str:
    total = sand_pct + silt_pct + clay_pct
    if total <= 0:
        raise ValueError("Sand, silt and clay can't all be zero.")
    sand, silt, clay = (100.0 * x / total for x in (sand_pct, silt_pct, clay_pct))
    if silt + 1.5 * clay < 15:
        return "sand"
    if silt + 2 * clay < 30:
        return "loamy sand"
    if clay >= 40:
        if silt >= 40:
            return "silty clay"
        if sand <= 45:
            return "clay"
        return "sandy clay"
    if clay >= 35 and sand > 45:
        return "sandy clay"
    if clay >= 27:
        if sand <= 20:
            return "silty clay loam"
        if sand <= 45:
            return "clay loam"
        return "sandy clay loam"
    if clay >= 20 and silt < 28 and sand > 45:
        return "sandy clay loam"
    if silt >= 80 and clay < 12:
        return "silt"
    if silt >= 50:
        return "silt loam"
    if clay >= 7 and silt >= 28 and sand <= 52:
        return "loam"
    return "sandy loam"
