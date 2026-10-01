"""Pure Table 7 similarity rules for QA2 baseline control sites (VM0042 v2.2 §8.2 p.25–27, Appendix 5).

Every criterion returns ``pass``, ``fail``, ``pending`` (data missing — never assumed to pass) or
``not_applicable``.
"""

from __future__ import annotations

import math
from collections import Counter
from collections.abc import Mapping
from dataclasses import dataclass
from typing import Any

from app.modules.land.domain import HILLY_OR_STEEPER, slope_class

MAX_DISTANCE_KM = 250.0       # §8.2 p.25
MAX_ASPECT_DIFF_DEG = 30.0    # Table 7 topography
SOC_CONFIDENCE = 0.90         # Table 7: not significantly different at 90 %
MAX_PRECIP_DIFF_MM = 100.0    # Table 7 climate
ALM_YEARS = 5                 # Table 7: historical ALM the same for ≥ 5 years before start
CONVERSION_LOOKBACK_YEARS = 50  # Table 7: historical land cover — conversions ≤ 50 years before start count
CONVERSION_YEAR_TOLERANCE = 10  # … and must have happened within ±10 years of each other
MIN_CONTROL_SITES = 3         # §8.2: at least 3 control sites across the project
LOCATION_TOLERANCE_M = 50.0   # control site location must stay fixed

# Crop functional groups (Table 7: crop type may differ within the same functional group).
FUNCTIONAL_GROUPS: dict[str, frozenset[str]] = {
    "grasses_cereals": frozenset({
        "rice", "paddy", "wheat", "maize", "corn", "millets", "millet", "ragi", "finger_millet", "pearl_millet",
        "sorghum", "jowar", "bajra", "barley", "oats", "rye", "sugarcane", "grass", "pasture", "fodder_grass",
    }),
    "legumes": frozenset({
        "soybean", "soya", "groundnut", "peanut", "chickpea", "pigeonpea", "tur", "lentil", "beans", "bean",
        "cowpea", "green_gram", "black_gram", "horse_gram", "pea", "alfalfa", "lucerne", "clover", "vetch",
    }),
    "non_legume_broadleaf": frozenset({
        "cotton", "sunflower", "mustard", "rapeseed", "canola", "potato", "tomato", "onion", "chilli", "vegetables",
        "tobacco", "sesame", "safflower", "cassava", "sugar_beet", "brassica",
    }),
    "perennial_tree": frozenset({
        "coffee", "tea", "rubber", "cocoa", "cacao", "arecanut", "areca", "coconut", "mango", "cashew", "pepper",
        "banana", "orchard", "oil_palm", "citrus", "agroforestry",
    }),
}


def functional_group(crop: str) -> str:
    key = "_".join(crop.strip().lower().split())
    for group, crops in FUNCTIONAL_GROUPS.items():
        if key in crops:
            return group
    return f"crop:{key}"  # unknown crops only match the same crop


def crit(code: str, status: str, message: str, **details: Any) -> dict[str, Any]:
    return {"code": code, "status": status, "message": message, "details": details}


def overall(criteria: list[dict[str, Any]]) -> str:
    statuses = {c["status"] for c in criteria}
    if "fail" in statuses:
        return "fail"
    if "pending" in statuses:
        return "pending"
    return "pass"


@dataclass(frozen=True)
class Site:
    """The Table 7 attributes of one field."""

    code: str
    area_ha: float
    lat: float
    lon: float
    slope_pct: float | None
    aspect_deg: float | None
    texture: str | None
    wrb: str | None
    ecoregion: str | None
    climate_zone: str | None
    precip_mm: float | None


def centroid(sites: list[Site]) -> tuple[float, float] | None:
    total = sum(s.area_ha for s in sites)
    if not sites or total <= 0:
        return None
    return (sum(s.lat * s.area_ha for s in sites) / total, sum(s.lon * s.area_ha for s in sites) / total)


def most_frequent(values: list[Any], weights: list[float] | None = None) -> Any:
    """Most frequent value (ties broken by total area, then alphabetically) — Table 7 "most frequent"."""
    count, area = Counter(values), Counter()
    for v, w in zip(values, weights or [1.0] * len(values)):
        area[v] += w
    return sorted(count, key=lambda v: (-count[v], -area[v], str(v)))[0]


def _missing(sites: list[Site], attr: str) -> list[str]:
    return [s.code for s in sites if getattr(s, attr) is None]


def _same_mode(code: str, label: str, control: list[Site], qu: list[Site], attr: str,
               transform=lambda v: v) -> dict[str, Any]:
    missing = {"control": _missing(control, attr), "quantification_unit": _missing(qu, attr)}
    if not control or not qu:
        return crit(code, "pending", "The control site or the quantification unit has no fields.")
    if missing["control"] or missing["quantification_unit"]:
        return crit(code, "pending", f"{label} is missing for some fields.", missing=missing)
    c = most_frequent([transform(getattr(s, attr)) for s in control], [s.area_ha for s in control])
    q = most_frequent([transform(getattr(s, attr)) for s in qu], [s.area_ha for s in qu])
    return crit(code, "pass" if c == q else "fail",
                f"{label}: control {c}, quantification unit {q}." + ("" if c == q else " They must be the same."),
                control=c, quantification_unit=q)


def distance_check(control: list[Site], qu: list[Site], distance_m) -> dict[str, Any]:
    a, b = centroid(control), centroid(qu)
    if a is None or b is None:
        return crit("distance", "pending", "The control site or the quantification unit has no fields.")
    km = distance_m(a[0], a[1], b[0], b[1]) / 1000.0
    ok = km <= MAX_DISTANCE_KM
    return crit("distance", "pass" if ok else "fail",
                f"The control site is {km:.1f} km from the quantification unit (limit {MAX_DISTANCE_KM:g} km).",
                distance_km=round(km, 3), limit_km=MAX_DISTANCE_KM)


def slope_check(control: list[Site], qu: list[Site]) -> dict[str, Any]:
    return _same_mode("slope_class", "Most frequent slope class (Appendix 5 Table 10)", control, qu, "slope_pct",
                      slope_class)


def circular_mean(degrees: list[float]) -> float:
    s = sum(math.sin(math.radians(d)) for d in degrees)
    c = sum(math.cos(math.radians(d)) for d in degrees)
    return math.degrees(math.atan2(s, c)) % 360.0


def angle_diff(a: float, b: float) -> float:
    d = abs(a - b) % 360.0
    return min(d, 360.0 - d)


def aspect_check(control: list[Site], qu: list[Site], slope: dict[str, Any]) -> dict[str, Any]:
    if slope["status"] == "pending":
        return crit("aspect", "pending", "The slope class is needed first.")
    classes = {slope["details"].get("control"), slope["details"].get("quantification_unit")}
    if not classes & HILLY_OR_STEEPER:
        return crit("aspect", "not_applicable", "Aspect only matters on hilly, steep or very steep land.")
    missing = {"control": _missing(control, "aspect_deg"), "quantification_unit": _missing(qu, "aspect_deg")}
    if missing["control"] or missing["quantification_unit"]:
        return crit("aspect", "pending", "Aspect is missing for some fields on sloping land.", missing=missing)
    c, q = circular_mean([s.aspect_deg for s in control]), circular_mean([s.aspect_deg for s in qu])
    d = angle_diff(c, q)
    return crit("aspect", "pass" if d <= MAX_ASPECT_DIFF_DEG else "fail",
                f"Mean aspect differs by {d:.0f}° (limit {MAX_ASPECT_DIFF_DEG:g}°).",
                control_deg=round(c, 1), quantification_unit_deg=round(q, 1), difference_deg=round(d, 1))


def _avg_texture(sites: list[Site], measured: Mapping[str, tuple[float, float]]) -> tuple[str, float, float, float]:
    from app.modules.land.domain import normalise_code
    from app.modules.supporting.soil import usda_texture_class

    area = sum(s.area_ha for s in sites) or float(len(sites))
    w = [(s.area_ha or 1.0) / area for s in sites]
    sand = sum(wi * measured[s.code][0] for wi, s in zip(w, sites))
    clay = sum(wi * measured[s.code][1] for wi, s in zip(w, sites))
    silt = max(0.0, 100.0 - sand - clay)
    return normalise_code(usda_texture_class(sand, silt, clay)), sand, silt, clay


def texture_check(control: list[Site], qu: list[Site], control_measured: Mapping[str, tuple[float, float]] | None = None,
                  qu_measured: Mapping[str, tuple[float, float]] | None = None) -> dict[str, Any]:
    """Table 7: the *average* soil texture (to the project-boundary depth) of the control site must be in the same
    FAO textural class as the average of the linked QU. With measured sand/clay on every field the area-weighted
    averages are classified on the texture triangle. Without them, the recorded field classes decide only when
    each side has a single class (its average is then that class); mixed classes need measurements."""
    if not control or not qu:
        return crit("soil_texture", "pending", "The control site or the quantification unit has no fields.")
    if control_measured and qu_measured:
        c, q = _avg_texture(control, control_measured), _avg_texture(qu, qu_measured)
        same = c[0] == q[0]
        return crit("soil_texture", "pass" if same else "fail",
                    f"Average texture (measured): control {c[0].replace('_', ' ')}, quantification unit "
                    f"{q[0].replace('_', ' ')}." + ("" if same else " They must be in the same class."),
                    control=c[0], quantification_unit=q[0], basis="measured",
                    control_sand_silt_clay=[round(x, 1) for x in c[1:]],
                    quantification_unit_sand_silt_clay=[round(x, 1) for x in q[1:]])
    missing = {"control": _missing(control, "texture"), "quantification_unit": _missing(qu, "texture")}
    if missing["control"] or missing["quantification_unit"]:
        return crit("soil_texture", "pending", "Soil textural class is missing for some fields.", missing=missing)
    classes = {"control": sorted({s.texture for s in control}), "quantification_unit": sorted({s.texture for s in qu})}
    if len(classes["control"]) > 1 or len(classes["quantification_unit"]) > 1:
        return crit("soil_texture", "pending",
                    "Fields have different textural classes, so the average texture can't be known from the classes "
                    "alone. Record measured sand and clay (0–30 cm or deeper) for these fields.", classes=classes)
    c, q = classes["control"][0], classes["quantification_unit"][0]
    return crit("soil_texture", "pass" if c == q else "fail",
                f"Soil textural class: control {c}, quantification unit {q}." + ("" if c == q else
                                                                              " They must be the same."),
                control=c, quantification_unit=q, basis="field_class")


def wrb_check(control: list[Site], qu: list[Site]) -> dict[str, Any]:
    return _same_mode("wrb_soil_group", "WRB reference soil group", control, qu, "wrb")


def ecoregion_check(control: list[Site], qu: list[Site]) -> dict[str, Any]:
    return _same_mode("ecoregion", "Terrestrial ecoregion", control, qu, "ecoregion")


def climate_check(control: list[Site], qu: list[Site]) -> dict[str, Any]:
    return _same_mode("climate_zone", "IPCC climate zone", control, qu, "climate_zone")


def precip_check(control: list[Site], qu: list[Site]) -> dict[str, Any]:
    missing = {"control": _missing(control, "precip_mm"), "quantification_unit": _missing(qu, "precip_mm")}
    if not control or not qu:
        return crit("precipitation", "pending", "The control site or the quantification unit has no fields.")
    if missing["control"] or missing["quantification_unit"]:
        return crit("precipitation", "pending", "Mean annual precipitation is missing for some fields.",
                    missing=missing)
    c = sum(s.precip_mm for s in control) / len(control)
    q = sum(s.precip_mm for s in qu) / len(qu)
    d = abs(c - q)
    return crit("precipitation", "pass" if d <= MAX_PRECIP_DIFF_MM else "fail",
                f"Mean annual precipitation differs by {d:.0f} mm (limit ±{MAX_PRECIP_DIFF_MM:g} mm).",
                control_mm=round(c, 1), quantification_unit_mm=round(q, 1), difference_mm=round(d, 1))


def soc_check(control: list[float], qu: list[float], depth_cm: float = 30.0) -> dict[str, Any]:
    """Welch's two-sample t-test on each sample's average SOC % to the project-boundary depth (Table 7,
    minimum 30 cm); similar if p ≥ 0.10 (not different at 90 %)."""
    if len(control) < 2 or len(qu) < 2:
        return crit("soc_mean", "pending", f"At least two samples with accepted SOC over 0–{depth_cm:g} cm are needed on each side.",
                    n_control=len(control), n_quantification_unit=len(qu))
    from scipy import stats

    mc, mq = sum(control) / len(control), sum(qu) / len(qu)
    if len(set(control)) == 1 and len(set(qu)) == 1:
        p = 1.0 if mc == mq else 0.0
        t = 0.0 if mc == mq else float("inf")
    else:
        res = stats.ttest_ind(control, qu, equal_var=False)
        t, p = float(res.statistic), float(res.pvalue)
    ok = p >= 1 - SOC_CONFIDENCE
    return crit("soc_mean", "pass" if ok else "fail",
                f"Mean SOC 0–{depth_cm:g} cm {mc:.2f} % (control) vs {mq:.2f} % (quantification unit); Welch p = {p:.3f} "
                + ("— not significantly different at 90 %." if ok else "— significantly different at 90 %."),
                control_mean_pct=round(mc, 4), quantification_unit_mean_pct=round(mq, 4), p_value=round(p, 6),
                t_statistic=None if math.isinf(t) else round(t, 4), n_control=len(control),
                n_quantification_unit=len(qu), test="welch_t", depth_cm=depth_cm)


# ------------------------------------------------------------------ historical land cover (Table 7)
def conversion(records: list[tuple[int, int, str]], start_year: int) -> tuple[str, int] | None | str:
    """One field's most recent land-cover conversion in the 50 years before the start, from its land-use
    records ``(from_year, to_year, land_use)``. Returns ``(converted_from, year)``, ``None`` when the records
    show no conversion in that window, or ``"unknown"`` when the field has no land-use records."""
    if not records:
        return "unknown"
    rows = sorted(records, key=lambda r: (r[0], r[1]))
    found = None
    for prev, cur in zip(rows, rows[1:]):
        if prev[2] != cur[2] and start_year - CONVERSION_LOOKBACK_YEARS <= cur[0] < start_year:
            found = (prev[2], cur[0])
    return found


def land_cover_check(control: dict[str, Any], qu: dict[str, Any]) -> dict[str, Any]:
    """``control``/``qu``: field code -> :func:`conversion` result. If land was converted ≤ 50 years before the
    start, both must have been converted from the same major land cover within ±10 years (Table 7)."""
    if not control or not qu:
        return crit("historical_land_cover", "pending", "The control site or the quantification unit has no fields.")
    unknown = {side: sorted(c for c, v in group.items() if v == "unknown")
               for side, group in (("control", control), ("quantification_unit", qu))}
    if unknown["control"] or unknown["quantification_unit"]:
        return crit("historical_land_cover", "pending", "Land-use history is missing for some fields.",
                    missing=unknown)
    summary = {}
    for side, group in (("control", control), ("quantification_unit", qu)):
        cover = most_frequent([v[0] if v else "none" for v in group.values()])
        years = [v[1] for v in group.values() if v and v[0] == cover]
        summary[side] = {"converted_from": None if cover == "none" else cover,
                         "year": round(sum(years) / len(years)) if years else None}
    c, q = summary["control"], summary["quantification_unit"]
    if c["converted_from"] is None and q["converted_from"] is None:
        return crit("historical_land_cover", "pass",
                    f"No land-cover conversion in the {CONVERSION_LOOKBACK_YEARS} years before the start on either "
                    "side (per the land-use records).", **summary)
    if c["converted_from"] != q["converted_from"]:
        return crit("historical_land_cover", "fail",
                    f"Converted from different land cover: control {c['converted_from'] or 'not converted'}, "
                    f"quantification unit {q['converted_from'] or 'not converted'}.", **summary)
    gap = abs(c["year"] - q["year"])
    ok = gap <= CONVERSION_YEAR_TOLERANCE
    return crit("historical_land_cover", "pass" if ok else "fail",
                f"Both converted from {c['converted_from']} ({c['year']} vs {q['year']}, {gap} years apart"
                + (")." if ok else f"; limit ±{CONVERSION_YEAR_TOLERANCE} years)."), difference_years=gap, **summary)


# ------------------------------------------------------------------ historical ALM (≥ 5 years)
ALM_ITEMS = (  # (item, category)
    ("tillage", "tillage_residue"), ("tillage_type", "tillage_residue"), ("residue_removal", "tillage_residue"),
    ("crop_type", "crop"), ("manure", "n_fertilizer"), ("compost", "n_fertilizer"), ("irrigation", "water"),
)


def alm_values(by_category: dict[str, list[dict]]) -> dict[str, Any]:
    """One field-year: the practices Table 7 compares. Missing categories give ``None``."""
    out: dict[str, Any] = {}
    till = by_category.get("tillage_residue")
    out["tillage"] = any(a.get("tillage") for a in till) if till else None
    types = sorted({str(a["tillage_type"]).strip().lower() for a in till or [] if a.get("tillage_type")})
    out["tillage_type"] = ",".join(types) if types else None
    out["residue_removal"] = any(a.get("residue_removal") for a in till) if till else None
    crops = by_category.get("crop")
    out["crop_type"] = ",".join(sorted({"_".join(str(a["crop_type"]).strip().lower().split()) for a in crops
                                        if a.get("crop_type")})) if crops else None
    out["crop_group"] = ",".join(sorted({functional_group(str(a["crop_type"])) for a in crops if a.get("crop_type")})) \
        if crops else None
    fert = by_category.get("n_fertilizer")
    out["manure"] = any(a.get("manure") for a in fert) if fert else None
    out["compost"] = any(a.get("compost") for a in fert) if fert else None
    water = by_category.get("water")
    out["irrigation"] = any(a.get("irrigation") for a in water) if water else None
    return out


def alm_check(control: dict[str, dict[int, dict[str, list[dict]]]], qu: dict[str, dict[int, dict[str, list[dict]]]],
              years: list[int], crop_group_justification: str = "") -> dict[str, Any]:
    """``control``/``qu``: field code -> year -> category -> [attributes]. Compares the majority practice of each
    group per year for tillage (and type, where both record it), residue removal, crop type, manure, compost and
    irrigation. Table 7 note e: the crop *functional group* is compared instead only where the crop type can't be
    matched and the link records why (``crop_group_justification``)."""
    group_matches: list[dict[str, Any]] = []
    if not control or not qu:
        return crit("historical_alm", "pending", "The control site or the quantification unit has no fields.")
    missing, differences = [], []
    for y in years:
        side_vals = {}
        for side, group in (("control", control), ("quantification_unit", qu)):
            vals = {code: alm_values(group.get(code, {}).get(y, {})) for code in group}
            side_vals[side] = vals
        for item, cat in ALM_ITEMS:
            per_side = {}
            for side, vals in side_vals.items():
                values = [v[item] for v in vals.values()]
                if item == "tillage_type":
                    values = [v for v in values if v is not None]
                    per_side[side] = most_frequent(values) if values else None
                    continue
                if any(v is None for v in values):
                    missing.append(f"{y}: {cat} ({side.replace('_', ' ')})")
                    per_side[side] = None
                else:
                    per_side[side] = most_frequent(values)
            c, q = per_side["control"], per_side["quantification_unit"]
            if c is None or q is None:
                continue
            if c != q and item == "crop_type" and crop_group_justification.strip():
                cg = most_frequent([v["crop_group"] for v in side_vals["control"].values()])
                qg = most_frequent([v["crop_group"] for v in side_vals["quantification_unit"].values()])
                if cg == qg:
                    group_matches.append({"year": y, "control": c, "quantification_unit": q, "group": cg})
                    continue
            if c != q:
                differences.append({"year": y, "practice": item, "control": c, "quantification_unit": q})
    missing = sorted(set(missing))
    if differences:
        d = differences[0]
        return crit("historical_alm", "fail",
                    f"Historical management differs: {d['practice'].replace('_', ' ')} in {d['year']} "
                    f"(control {d['control']}, quantification unit {d['quantification_unit']}).",
                    years=years, differences=differences, missing=missing)
    if missing:
        return crit("historical_alm", "pending", "Baseline activity records are missing for the last "
                                                 f"{ALM_YEARS} years before the start.", years=years, missing=missing)
    if group_matches:
        return crit("historical_alm", "pass",
                    f"Management was the same for {years[0]}–{years[-1]}; crop types differ in "
                    f"{len(group_matches)} year(s) but are in the same functional group (Table 7 note e: "
                    f"{crop_group_justification.strip()}).", years=years, crop_group_matches=group_matches)
    return crit("historical_alm", "pass", f"Management was the same for {years[0]}–{years[-1]}.", years=years)
