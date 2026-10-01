"""Pure land rules: land-use history, VM0042 v2.2 §4 applicability, Appendix 5 slope classes and
land-tenure coverage (no database)."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import date, datetime, timedelta
from typing import Any

# "grassland" is managed grassland (pasture, meadow); "native_grassland" is a native ecosystem (§4 cond. 5).
LAND_USES = ("cropland", "grassland", "native_grassland", "forest", "wetland", "settlement", "other")
# Converting these to farmland within the look-back makes a field ineligible (no credit for clearing).
PROTECTED_PRIOR_USES = frozenset({"forest", "wetland"})


@dataclass(frozen=True)
class Check:
    code: str
    passed: bool
    message: str
    details: dict[str, Any] = field(default_factory=dict)
    # "blocking" checks decide eligibility; a "warning" always passes but is shown to the user.
    severity: str = "blocking"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True)
class LandUseSpan:
    from_year: int
    to_year: int
    land_use: str
    recorded_at: datetime
    has_evidence: bool


def lookback_window(current_year: int, lookback_years: int) -> tuple[int, int]:
    """The completed years that must be covered, e.g. 2026 with 10 years -> (2016, 2025)."""
    return current_year - lookback_years, current_year - 1


def resolve_by_year(spans: list[LandUseSpan], start: int, end: int) -> dict[int, LandUseSpan]:
    """Land use per year. Records are append-only, so a later record for a year corrects an earlier one."""
    out: dict[int, LandUseSpan] = {}
    for s in sorted(spans, key=lambda s: s.recorded_at):
        for y in range(max(s.from_year, start), min(s.to_year, end) + 1):
            out[y] = s
    return out


def _ranges(years: list[int]) -> str:
    if not years:
        return ""
    parts, lo, prev = [], years[0], years[0]
    for y in years[1:] + [None]:  # type: ignore[list-item]
        if y is not None and y == prev + 1:
            prev = y
            continue
        parts.append(str(lo) if lo == prev else f"{lo}–{prev}")
        if y is not None:
            lo = prev = y
    return ", ".join(parts)


def land_use_check(spans: list[LandUseSpan], current_year: int, lookback_years: int) -> Check:
    start, end = lookback_window(current_year, lookback_years)
    by_year = resolve_by_year(spans, start, end)
    missing = [y for y in range(start, end + 1) if y not in by_year]
    converted = sorted(y for y, s in by_year.items() if s.land_use in PROTECTED_PRIOR_USES)
    unevidenced = sorted(y for y, s in by_year.items() if not s.has_evidence)
    details = {"window": [start, end], "lookback_years": lookback_years, "missing_years": missing,
               "converted_years": converted, "unevidenced_years": unevidenced}
    if converted:
        uses = sorted({by_year[y].land_use for y in converted})
        return Check("land_use_history", False,
                     f"The land was {' or '.join(uses)} in {_ranges(converted)}, within the {lookback_years}-year "
                     f"look-back. Converted land can't be enrolled.", details)
    if missing:
        return Check("land_use_history", False,
                     f"Land-use history is missing for {_ranges(missing)}. Record what the land was used for "
                     f"in every year from {start} to {end}.", details)
    msg = f"Land-use history covers {start}–{end} with no forest or wetland conversion."
    if unevidenced:
        msg += f" Evidence is still missing for {_ranges(unevidenced)}."
    return Check("land_use_history", True, msg, details)


# ------------------------------------------------------------------ VM0042 §4 applicability
NATIVE_CLEARING_YEARS = 10  # §4 condition 5
# What counts as clearing a native ecosystem: forest or wetland turned into any farmland, or native
# grassland turned into cropland. (Native grassland that is grazed stays grassland and is not a clearing.)
CLEARING_TARGETS = {
    "forest": frozenset({"cropland", "grassland"}),
    "wetland": frozenset({"cropland", "grassland"}),
    "native_grassland": frozenset({"cropland"}),
}


def native_clearing_check(spans: list[LandUseSpan], start_year: int,
                          window: int = NATIVE_CLEARING_YEARS) -> Check:
    """§4 cond. 5: no clearing of native ecosystems within ``window`` years before the project start.

    A clearing is a change between consecutive recorded years from a native ecosystem to farmland,
    where the first farmland year falls in ``[start_year - window, start_year]``.
    """
    lo, hi = start_year - window, start_year
    by_year = resolve_by_year(spans, lo - 1, hi)
    conversions = []
    for y in range(lo, hi + 1):
        prev, cur = by_year.get(y - 1), by_year.get(y)
        if prev and cur and cur.land_use in CLEARING_TARGETS.get(prev.land_use, frozenset()):
            conversions.append({"year": y, "from": prev.land_use, "to": cur.land_use})
    details = {"window": [lo, hi], "conversions": conversions}
    if conversions:
        c = conversions[0]
        return Check("no_native_clearing", False,
                     f"Native {c['from'].replace('_', ' ')} was converted to {c['to']} in {c['year']}, within "
                     f"{window} years of the project start. VM0042 doesn't allow land cleared of native "
                     f"ecosystems in that period.", details)
    return Check("no_native_clearing", True,
                 f"No clearing of native ecosystems is recorded between {lo} and {hi}.", details)


LAND_COVERS = ("cropland", "grassland", "wetland", "other")
FLOODED_RICE_REGIMES = frozenset({"continuous", "awd"})
WETLAND_EXEMPTION_EVIDENCE_KIND = "no_wetland_hydrology_impact"


def land_cover_checks(land_cover: str | None, crop_code: str | None, crop_attributes: dict | None,
                      has_hydrology_evidence: bool) -> list[Check]:
    """§4 cond. 3 (cropland or grassland at start) and cond. 8 (not a wetland, except artificially
    flooded crops that leave nearby wetland hydrology unaffected)."""
    cover = land_cover or "cropland"
    flooded_rice = crop_code == "rice" and (crop_attributes or {}).get("water_regime") in FLOODED_RICE_REGIMES
    exempt = cover == "wetland" and flooded_rice and has_hydrology_evidence
    details = {"land_cover": cover, "flooded_rice": flooded_rice, "hydrology_evidence": has_hydrology_evidence}
    if cover in ("cropland", "grassland"):
        cover_check = Check("land_cover", True, f"The field is {cover} at the project start.", details)
    elif exempt:
        cover_check = Check("land_cover", True, "The field is artificially flooded rice land, treated as cropland.",
                            details)
    else:
        cover_check = Check("land_cover", False,
                            f"The field is recorded as {cover}. Only cropland or grassland can join a VM0042 "
                            f"project.", details)
    if cover != "wetland":
        wet = Check("not_wetland", True, "The field is not a wetland.", details)
    elif exempt:
        wet = Check("not_wetland", True, "Artificially flooded rice, with evidence that nearby wetland hydrology "
                                         "is not affected.", details)
    elif flooded_rice:
        wet = Check("not_wetland", False,
                    "The field is a wetland. Flooded rice is allowed only with evidence that nearby wetland "
                    f"hydrology isn't affected. Upload it as evidence of kind '{WETLAND_EXEMPTION_EVIDENCE_KIND}' "
                    "linked to this field.", details)
    else:
        wet = Check("not_wetland", False, "The field is a wetland. VM0042 doesn't apply to wetlands.", details)
    return [cover_check, wet]


def lookback_activity_check(years_with_records: list[int], start_year: int, min_years: int = 3) -> Check:
    """§6: look-back of ≥ 3 years. Only a warning at enrolment; the baseline schedule blocks later."""
    expected = list(range(start_year - min_years, start_year))
    missing = [y for y in expected if y not in set(years_with_records)]
    details = {"expected_years": expected, "missing_years": missing}
    if missing:
        return Check("lookback_activity_records", True,
                     f"Baseline activity records are missing for {_ranges(missing)}. At least {min_years} years "
                     f"before the project start are needed before the baseline can be used.", details,
                     severity="warning")
    return Check("lookback_activity_records", True,
                 f"Baseline activity records exist for {_ranges(expected)}.", details, severity="warning")


# ------------------------------------------------------------------ Appendix 5 Table 10
# Table 10 gives whole-number ranges with gaps (0–3, 4–8, 9–16, 17–30, 31–45, > 45). Continuous slopes are
# binned at the half-way points, lower-inclusive: [0, 3.5) nearly level, [3.5, 8.5) gently sloping, … ≥ 45.5
# very steep. The DEM terrain service (supporting/terrain.py) uses this same table.
SLOPE_CLASSES = (  # (upper bound % exclusive, code, label)
    (3.5, "nearly_level", "Nearly level (0–3 %)"),
    (8.5, "gently_sloping", "Gently sloping / undulating (4–8 %)"),
    (16.5, "strongly_sloping", "Strongly sloping / rolling (9–16 %)"),
    (30.5, "moderately_steep", "Moderately steep / hilly (17–30 %)"),
    (45.5, "steep", "Steep (31–45 %)"),
    (float("inf"), "very_steep", "Very steep (> 45 %)"),
)
HILLY_OR_STEEPER = frozenset({"moderately_steep", "steep", "very_steep"})


def slope_class(slope_pct: float | None) -> str | None:
    """Appendix 5 Table 10 class (3.2 % is nearly level, 3.5 % gently sloping)."""
    if slope_pct is None:
        return None
    s = max(0.0, slope_pct)
    for upper, code, _ in SLOPE_CLASSES:
        if s < upper:
            return code
    return "very_steep"


TEXTURE_CLASSES = (
    "sand", "loamy_sand", "sandy_loam", "loam", "silt_loam", "silt", "sandy_clay_loam", "clay_loam",
    "silty_clay_loam", "sandy_clay", "silty_clay", "clay",
)
WRB_SOIL_GROUPS = (
    "Histosols", "Anthrosols", "Technosols", "Cryosols", "Leptosols", "Solonetz", "Vertisols", "Solonchaks",
    "Gleysols", "Andosols", "Podzols", "Plinthosols", "Nitisols", "Ferralsols", "Planosols", "Stagnosols",
    "Chernozems", "Kastanozems", "Phaeozems", "Umbrisols", "Durisols", "Gypsisols", "Calcisols", "Retisols",
    "Acrisols", "Lixisols", "Alisols", "Luvisols", "Cambisols", "Arenosols", "Fluvisols", "Regosols",
)
IPCC_CLIMATE_ZONES = (
    "tropical_montane", "tropical_wet", "tropical_moist", "tropical_dry", "warm_temperate_moist",
    "warm_temperate_dry", "cool_temperate_moist", "cool_temperate_dry", "boreal_moist", "boreal_dry",
    "polar_moist", "polar_dry",
)


def normalise_code(value: str) -> str:
    return "_".join(value.strip().lower().replace("-", " ").split())


# ------------------------------------------------------------------ land tenure
TENURE_KINDS = ("owned", "leased", "shared", "community", "other")


def uncovered_periods(intervals: list[tuple[date, date | None]], start: date, end: date) -> list[tuple[date, date]]:
    """Parts of ``[start, end]`` not covered by the union of ``intervals`` (an end of ``None`` = open-ended)."""
    gaps: list[tuple[date, date]] = []
    cursor = start  # first day not yet known to be covered
    for lo, hi in sorted(intervals, key=lambda i: i[0]):
        if cursor > end:
            break
        if hi is not None and hi < cursor:
            continue
        if lo > cursor:
            gaps.append((cursor, min(end, lo - timedelta(days=1))))
        if hi is None or hi >= end:
            cursor = end + timedelta(days=1)
        else:
            cursor = max(cursor, hi + timedelta(days=1))
    if cursor <= end:
        gaps.append((cursor, end))
    return [g for g in gaps if g[0] <= g[1]]
