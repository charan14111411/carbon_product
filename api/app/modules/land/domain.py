"""Pure land rules: land-use history evaluation and eligibility check results (no database)."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime
from typing import Any

LAND_USES = ("cropland", "grassland", "forest", "wetland", "settlement", "other")
# Converting these to farmland within the look-back makes a field ineligible (no credit for clearing).
PROTECTED_PRIOR_USES = frozenset({"forest", "wetland"})


@dataclass(frozen=True)
class Check:
    code: str
    passed: bool
    message: str
    details: dict[str, Any] = field(default_factory=dict)

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
