"""Pure baseline rules (no database): VM0042 v2.2 §6 Table 4 attribute schema, Box 1 data tiers,
the look-back / crop-rotation rule, the repeating schedule of activities (footnote 8) and the
§4 condition 2 practice-change test (> 5 %).
"""

from __future__ import annotations

import math

import re
from dataclasses import dataclass, field
from datetime import date
from typing import Any

from app.modules.baseline.models import ACTIVITY_CATEGORIES, DATA_TIERS

SCENARIOS = ("baseline", "project")
MIN_LOOKBACK_YEARS = 3             # §6 p.14: x ≥ 3 years incl. ≥ 1 complete crop rotation
CENSUS_MAX_AGE_YEARS = 20          # Box 1 tier 4: census data within 20 years …
CENSUS_MAX_ITERATIONS = 10         # … or the 10 most recent iterations of the dataset, whichever is more recent
BASELINE_REASSESS_YEARS = 10       # §6 / §1 fn 1: reassess every 10 years
BASELINE_REASSESS_RECOMMENDED = 5  # recommended every 5 years
BASELINE_PERIOD_YEARS = 10         # first baseline period, repeated schedule t = 1 … N
PRACTICE_CHANGE_THRESHOLD_PCT = 5.0  # §4 cond. 2: adjustments must exceed 5 %
PRODUCTIVITY_DECLINE_PCT = 5.0       # §4 cond. 6: not applicable if productivity falls by more than 5 % (sustained)
PRODUCTIVITY_MIN_PROJECT_YEARS = 2   # "sustained": judged on at least two project years
ATTESTATION_KIND = "attestation"


# ------------------------------------------------------------------ Table 4 attribute schema
@dataclass(frozen=True)
class Qty:
    """A value recorded for an activity. Numbers are never negative."""

    key: str
    unit: str
    kind: str = "number"  # number | date | text | list
    max: float | None = None
    item_keys: tuple[str, ...] = ()  # for kind == "list": required numeric keys of each item
    compare: bool = True  # False: a field total that repeats a per-hectare rate, left out of practice change


@dataclass(frozen=True)
class Flag:
    """A qualitative Y/N answer. When true, one of ``requires`` (alternative key sets) must be present."""

    key: str
    label: str
    requires: tuple[tuple[str, ...], ...] = ()
    required: bool = True  # must be answered every year


@dataclass(frozen=True)
class CategorySpec:
    label: str
    flags: tuple[Flag, ...] = ()
    always: tuple[str, ...] = ()  # keys required whatever the flags say
    values: tuple[Qty, ...] = ()
    table4: bool = False          # part of the Table 4 minimum per-year specification
    appendix1: bool = False       # a VM0042 Appendix 1 practice category (§4 cond. 1)


_FERT_ITEM = ("mass_t", "n_content")
SCHEMA: dict[str, CategorySpec] = {
    "crop": CategorySpec(
        "Crop planting & harvesting", table4=True, appendix1=True,
        always=("crop_type", "planting_date", "harvest_date", "yield_t_ha"),
        flags=(Flag("cover_crop", "Cover crop", requires=(("cover_crop_type",),), required=False),
               Flag("n_fixing", "N-fixing crop", required=False)),
        values=(Qty("crop_type", "", "text"), Qty("planting_date", "", "date"), Qty("harvest_date", "", "date"),
                Qty("yield_t_ha", "t/ha"), Qty("cover_crop_type", "", "text"), Qty("area_share_pct", "%", max=100),
                # rotation length stated by the farmer/agronomist (attested record), §6 p.14
                Qty("rotation_length_years", "years", max=20, compare=False)),
    ),
    "n_fertilizer": CategorySpec(
        "Nitrogen fertilizer", table4=True, appendix1=True,
        flags=(Flag("manure", "Manure applied", requires=(("manure_rate_t_ha",), ("organic_fertilizers",))),
               Flag("compost", "Compost applied", requires=(("compost_rate_t_ha",), ("organic_fertilizers",))),
               Flag("synthetic_n", "Synthetic N applied",
                    requires=(("synthetic_n_rate_kg_n_ha",), ("synthetic_fertilizers",)))),
        values=(Qty("manure_rate_t_ha", "t/ha"), Qty("compost_rate_t_ha", "t/ha"),
                Qty("synthetic_n_rate_kg_n_ha", "kg N/ha"),
                Qty("synthetic_fertilizers", "t", "list", item_keys=_FERT_ITEM),
                Qty("organic_fertilizers", "t", "list", item_keys=_FERT_ITEM)),
    ),
    "tillage_residue": CategorySpec(
        "Tillage & residue management", table4=True, appendix1=True,
        flags=(Flag("tillage", "Tillage", requires=(("tillage_depth_cm", "tillage_frequency_per_yr",
                                                       "soil_disturbed_pct"),)),
               Flag("residue_removal", "Residue removal", requires=(("residue_removed_pct",),))),
        values=(Qty("tillage_type", "", "text"), Qty("tillage_depth_cm", "cm"),
                Qty("tillage_frequency_per_yr", "passes/yr"), Qty("soil_disturbed_pct", "%", max=100),
                Qty("residue_removed_pct", "%", max=100)),
    ),
    "water": CategorySpec(
        "Water management", table4=True, appendix1=True,
        flags=(Flag("irrigation", "Irrigation", requires=(("irrigation_rate_mm",),)),
               Flag("flooding", "Flooding")),
        values=(Qty("irrigation_rate_mm", "mm/yr"), Qty("irrigation_method", "", "text"),
                Qty("flooded_days", "days", max=366)),
    ),
    "grazing": CategorySpec(
        "Grazing management", table4=True, appendix1=True,
        flags=(Flag("grazing", "Grazing", requires=(("animal_type", "stocking_rate_head_ha"),)),
               Flag("harvesting_mowing", "Harvesting / mowing", requires=(("harvest_frequency_per_yr",),))),
        values=(Qty("animal_type", "", "text"), Qty("stocking_rate_head_ha", "head/ha"),
                Qty("grazing_days", "days", max=366), Qty("harvest_frequency_per_yr", "cuts/yr")),
    ),
    # Each category below accepts either flat values (one entry, rates per hectare as in Table 4) or an
    # itemised list (several entries, field totals). emissions/domain.py reads both; a list wins when both
    # are given, so nothing is counted twice.
    "liming": CategorySpec(
        "Liming", table4=True,
        flags=(Flag("limestone", "Limestone applied", requires=(("limestone_t_ha",), ("limestone_t",))),
               Flag("dolomite", "Dolomite applied", requires=(("dolomite_t_ha",), ("dolomite_t",)))),
        values=(Qty("limestone_t_ha", "t/ha"), Qty("dolomite_t_ha", "t/ha"),
                Qty("limestone_t", "t", compare=False), Qty("dolomite_t", "t", compare=False)),
    ),
    "fossil_fuel": CategorySpec(
        "Fossil fuel use",
        flags=(Flag("fuel_used", "Fossil fuel used", requires=(("diesel_l",), ("gasoline_l",), ("fuels",))),),
        values=(Qty("diesel_l", "L"), Qty("gasoline_l", "L"), Qty("fuels", "L", "list", item_keys=("litres",))),
    ),
    "biomass_burning": CategorySpec(
        "Biomass burning",
        flags=(Flag("burning", "Residue burned", requires=(("residue_type", "mass_burned_t"), ("burns",))),),
        values=(Qty("residue_type", "", "text"), Qty("mass_burned_t", "t dm"),
                Qty("combustion_factor", "fraction", max=1), Qty("burns", "t dm", "list", item_keys=("mass_t",))),
    ),
    "livestock": CategorySpec(
        "Livestock",
        flags=(Flag("livestock", "Livestock kept", requires=(("animal_type", "population_head"), ("animals",))),
               # §8.4.2 (b): fewer animals, but production kept and animals slaughtered, not displaced (evidence)
               Flag("production_maintained_slaughtered", "Production maintained; animals slaughtered, not displaced",
                    required=False)),
        values=(Qty("animal_type", "", "text"), Qty("population_head", "head"), Qty("avg_weight_kg", "kg"),
                Qty("days_on_site", "days", max=366), Qty("productivity_system", "", "text"),
                Qty("awms", "fraction", max=1),  # share of manure managed on site (Eq. 12, 27)
                Qty("animals", "head", "list", item_keys=("population",))),
    ),
    "n_fixing": CategorySpec(
        "N-fixing species",
        flags=(Flag("n_fixing", "N-fixing species grown",
                    requires=(("dry_matter_t_ha", "n_content"), ("species",))),),
        values=(Qty("species_name", "", "text"), Qty("dry_matter_t_ha", "t/ha"), Qty("n_content", "fraction", max=1),
                Qty("species", "t dm", "list", item_keys=("dry_matter_t", "n_content"))),
    ),
    "organic_amendment_import": CategorySpec(
        "Imported organic amendments",
        flags=(Flag("imported", "Amendment imported",
                    requires=(("amendment_type", "mass_t", "carbon_content"), ("amendments",))),),
        values=(Qty("amendment_type", "", "text"), Qty("mass_t", "t"), Qty("carbon_content", "fraction", max=1),
                Qty("exemption", "", "text"), Qty("amendments", "t", "list", item_keys=("mass_t",))),
    ),
    "biochar": CategorySpec(
        "Biochar",
        flags=(Flag("biochar", "Biochar applied", requires=(("mass_t", "organic_carbon_fraction"),)),),
        values=(Qty("mass_t", "t"), Qty("organic_carbon_fraction", "fraction", max=1)),
    ),
}
assert set(SCHEMA) == set(ACTIVITY_CATEGORIES)
TABLE4_CATEGORIES = tuple(c for c, s in SCHEMA.items() if s.table4)
APPENDIX1_CATEGORIES = tuple(c for c, s in SCHEMA.items() if s.appendix1)

# VM0042 Appendix 1 — eligible improved ALM practices, by practice category.
APPENDIX_1_PRACTICES: dict[str, tuple[str, ...]] = {
    "n_fertilizer": (
        "Reduced synthetic N fertilizer application rate",
        "Improved fertilizer timing, placement or formulation (4R nutrient stewardship)",
        "Replacing synthetic fertilizer with organic amendments (manure, compost)",
        "Use of enhanced-efficiency fertilizers or nitrification inhibitors",
    ),
    "water": (
        "Improved irrigation management (e.g. drip, deficit irrigation)",
        "Alternate wetting and drying or reduced flooding of rice",
        "Improved drainage management",
    ),
    "tillage_residue": (
        "Reduced tillage (less depth, frequency or soil disturbed)",
        "No-till",
        "Residue retention instead of removal or burning",
    ),
    "crop": (
        "Cover crops",
        "Improved or diversified crop rotations, including N-fixing crops",
        "Agroforestry, intercropping or alley cropping",
        "Conversion to perennial crops",
        "Reduced bare fallow",
    ),
    "grazing": (
        "Rotational, adaptive or planned grazing",
        "Adjusted stocking rate or grazing duration",
        "Improved harvesting / mowing regime",
    ),
}


def _is_number(v: Any) -> bool:
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def _negatives(value: Any, path: str) -> list[str]:
    if _is_number(value):
        return [path] if value < 0 else []
    if isinstance(value, dict):
        return [p for k, v in value.items() for p in _negatives(v, f"{path}.{k}" if path else str(k))]
    if isinstance(value, list):
        return [p for i, v in enumerate(value) for p in _negatives(v, f"{path}[{i}]")]
    return []


def _present(attrs: dict, key: str) -> bool:
    v = attrs.get(key)
    return v is not None and v != "" and v != []


def validate_attributes(category: str, attrs: dict[str, Any]) -> list[str]:
    """Errors (plain language) for ``attrs`` against the category schema. Unknown extra keys are kept but
    must still be non-negative."""
    spec = SCHEMA.get(category)
    if spec is None:
        return [f"Unknown activity category '{category}'."]
    if not isinstance(attrs, dict):
        return ["Activity details must be an object of named values."]
    errors: list[str] = []
    values = {q.key: q for q in spec.values}
    for fl in spec.flags:
        v = attrs.get(fl.key)
        if v is None:
            if fl.required:
                errors.append(f"Answer yes or no for '{fl.label}' ({fl.key}).")
            continue
        if not isinstance(v, bool):
            errors.append(f"'{fl.label}' ({fl.key}) must be true or false.")
            continue
        if v and fl.requires and not any(all(_present(attrs, k) for k in alt) for alt in fl.requires):
            options = " or ".join(", ".join(alt) for alt in fl.requires)
            errors.append(f"'{fl.label}' is yes, so record {options}.")
    for k in spec.always:
        if not _present(attrs, k):
            errors.append(f"'{k}' is required for {spec.label.lower()}.")
    for k, v in attrs.items():
        q = values.get(k)
        if q is None or v is None:
            continue
        if q.kind == "number":
            if not _is_number(v):
                errors.append(f"'{k}' must be a number ({q.unit}).")
            elif q.max is not None and v > q.max:
                errors.append(f"'{k}' can't be more than {q.max:g} {q.unit}.".replace("  ", " "))
        elif q.kind == "text":
            if not isinstance(v, str) or not v.strip():
                errors.append(f"'{k}' must be text.")
        elif q.kind == "date":
            try:
                date.fromisoformat(str(v))
            except ValueError:
                errors.append(f"'{k}' must be a date (YYYY-MM-DD).")
        elif q.kind == "list":
            if not isinstance(v, list) or not v:
                errors.append(f"'{k}' must be a non-empty list.")
                continue
            for i, item in enumerate(v):
                if not isinstance(item, dict) or not all(_is_number(item.get(ik)) for ik in q.item_keys):
                    errors.append(f"Each entry of '{k}' needs numeric {', '.join(q.item_keys)} (entry {i + 1}).")
    if category == "crop" and not errors:
        if date.fromisoformat(str(attrs["harvest_date"])) < date.fromisoformat(str(attrs["planting_date"])):
            errors.append("The harvest/termination date can't be before the planting date.")
    for p in _negatives(attrs, ""):
        errors.append(f"'{p}' can't be negative.")
    return errors


def numeric_keys(category: str) -> tuple[str, ...]:
    """Numeric keys compared for practice change (§4 cond. 2)."""
    return tuple(q.key for q in SCHEMA[category].values if q.kind == "number" and q.compare)


def units(category: str) -> dict[str, str]:
    return {q.key: q.unit for q in SCHEMA[category].values if q.unit}


# ------------------------------------------------------------------ Box 1 tiers
YEAR_RE = re.compile(r"\b(19\d{2}|20\d{2}|2100)\b")


def census_year(source_note: str) -> int | None:
    years = [int(y) for y in YEAR_RE.findall(source_note or "")]
    return max(years) if years else None


def census_window_start(start_year: int, release_interval_years: float) -> int:
    """Box 1 (4), p.16: within the 20 years before the start *or* the 10 most recent iterations of the dataset,
    whichever is more recent — the oldest acceptable census year."""
    by_iterations = start_year - math.ceil(CENSUS_MAX_ITERATIONS * release_interval_years)
    return max(start_year - CENSUS_MAX_AGE_YEARS, by_iterations)


def tier_errors(tier: int, evidence_count: int, has_attestation: bool, source_note: str,
                start_year: int | None, release_interval_years: float | None = None) -> list[str]:
    if tier not in DATA_TIERS:
        return ["The data tier must be 1, 2, 3 or 4 (VM0042 Box 1)."]
    errors: list[str] = []
    if tier in (1, 2) and evidence_count < 1:
        errors.append(f"Tier {tier} ({DATA_TIERS[tier].lower()}) needs at least one evidence file.")
    if tier in (3, 4) and not has_attestation:
        errors.append(f"Tier {tier} needs a signed farmer attestation (attestation_id).")
    if tier == 4:
        year = census_year(source_note)
        if len((source_note or "").strip()) < 10 or year is None:
            errors.append("Tier 4 needs a source note naming the census dataset and its year, "
                          "e.g. 'Agricultural Census 2015-16, Karnataka'.")
        elif start_year is None:
            errors.append("Set the project start date so the age of the census data can be checked.")
        elif release_interval_years is None or release_interval_years <= 0:
            errors.append("Tier 4 needs how often the census dataset is published (census_release_interval_years, "
                          "e.g. 5 for a five-yearly census, 1 for an annual survey).")
        else:
            oldest = census_window_start(start_year, release_interval_years)
            if not (oldest <= year <= start_year):
                errors.append(f"The census year {year} must be {oldest} or later: VM0042 Box 1 allows the "
                              f"{CENSUS_MAX_AGE_YEARS} years before the project start ({start_year}) or the "
                              f"{CENSUS_MAX_ITERATIONS} most recent releases, whichever is more recent.")
    return errors


# ------------------------------------------------------------------ look-back, rotation, schedule
def crop_key(crop_attrs: list[dict]) -> tuple[str, ...]:
    return tuple(sorted({str(a.get("crop_type", "")).strip().lower() for a in crop_attrs if a.get("crop_type")}))


def lookback_run(years: set[int], start_year: int) -> list[int]:
    """The consecutive years ending at ``start_year - 1`` (t = −1, −2 …) that have records."""
    run, y = [], start_year - 1
    while y in years:
        run.append(y)
        y -= 1
    return sorted(run)


def detect_rotation(sequence: list[tuple[str, ...]], attested_length: int | None = None) -> dict[str, Any]:
    """Crop-rotation rule used for the look-back (§6 p.14: ≥ 1 complete crop rotation).

    ``sequence`` is the crop set per year, oldest first. The rotation length ``p`` is the smallest period
    with ``sequence[i] == sequence[i - p]`` for every ``i ≥ p``.

    * If every year has the same crops, the crop is **continuous** (p = 1); one year is a complete rotation.
    * Otherwise a rotation is **complete** only once the cycle has been seen to restart, i.e. the look-back
      holds at least ``p + 1`` years (M, S, M is a complete 2-year rotation; M, S, W is not confirmed yet,
      because the next year could be a fourth crop).
    * With a rotation length stated on an attested/evidenced crop record (``attested_length`` = p), ``p`` years
      consistent with that period are a complete rotation (§6 asks for one complete rotation, not a restart).
    """
    n = len(sequence)
    if n == 0 or any(not s for s in sequence):
        return {"pattern": "unknown", "length": None, "complete": False,
                "reason": "Crop type is missing for at least one look-back year."}
    if all(s == sequence[0] for s in sequence):
        return {"pattern": "continuous", "length": 1, "complete": True,
                "reason": f"Continuous {' + '.join(sequence[0])}."}
    if attested_length and attested_length >= 2 and n >= attested_length             and all(sequence[i] == sequence[i - attested_length] for i in range(attested_length, n)):
        return {"pattern": "rotation", "length": attested_length, "complete": True,
                "reason": f"{attested_length}-year rotation stated on the attested crop records and covered by the "
                          "look-back."}
    for p in range(2, n + 1):
        if all(sequence[i] == sequence[i - p] for i in range(p, n)):
            complete = n >= p + 1
            return {"pattern": "rotation", "length": p, "complete": complete,
                    "reason": (f"{p}-year rotation observed and restarted." if complete else
                               f"Possible {p}-year rotation, but the cycle hasn't been seen to restart. "
                               "Add an earlier look-back year.")}
    return {"pattern": "rotation", "length": None, "complete": False, "reason": "No repeating crop pattern found."}


def repeating_schedule(lookback_years: list[int], start_year: int, n_years: int) -> list[dict[str, Any]]:
    """Footnote 8: the schedule for t = 1 … N begins with the activities of year t = −x and repeats every
    x years (x = look-back length)."""
    x = len(lookback_years)
    if x == 0:
        return []
    first = start_year - x  # calendar year of t = −x
    out = []
    for t in range(1, n_years + 1):
        src = first + (t - 1) % x
        out.append({"t": t, "year": start_year + t - 1, "source_year": src, "source_t": src - start_year})
    return out


def reassessment(baseline_start: date | None, today: date) -> dict[str, Any]:
    if baseline_start is None:
        return {"due_on": None, "recommended_on": None, "status": "unknown",
                "message": "Set the project baseline start date to schedule the baseline reassessment."}

    def plus(d: date, years: int) -> date:
        try:
            return d.replace(year=d.year + years)
        except ValueError:  # 29 February
            return d.replace(year=d.year + years, day=28)

    due, rec = plus(baseline_start, BASELINE_REASSESS_YEARS), plus(baseline_start, BASELINE_REASSESS_RECOMMENDED)
    if today >= due:
        status, msg = "overdue", f"The baseline reassessment was due on {due.isoformat()} (every 10 years)."
    elif today >= rec:
        status, msg = "recommended", (f"A baseline reassessment is recommended now (every 5 years); it is "
                                      f"required by {due.isoformat()}.")
    else:
        status, msg = "not_due", f"Reassessment recommended from {rec.isoformat()}, required by {due.isoformat()}."
    return {"due_on": due.isoformat(), "recommended_on": rec.isoformat(), "status": status, "message": msg}


# ------------------------------------------------------------------ practice change (§4 cond. 2)
@dataclass
class YearValues:
    """Per-year aggregate of one category for one field: summed numbers and the Y/N answers."""

    numbers: dict[str, float] = field(default_factory=dict)
    flags: dict[str, bool] = field(default_factory=dict)
    crops: set[str] = field(default_factory=set)


def aggregate_year(category: str, attrs_list: list[dict]) -> YearValues:
    spec = SCHEMA[category]
    yv = YearValues()
    nums = numeric_keys(category)
    for attrs in attrs_list:
        for fl in spec.flags:
            if isinstance(attrs.get(fl.key), bool):
                yv.flags[fl.key] = yv.flags.get(fl.key, False) or attrs[fl.key]
        for k in nums:
            v = attrs.get(k)
            if _is_number(v):
                yv.numbers[k] = yv.numbers.get(k, 0.0) + float(v)
        if category == "crop" and attrs.get("crop_type"):
            yv.crops.add(str(attrs["crop_type"]).strip().lower())
    # a "no" answer means the dependent quantities are zero that year (e.g. no tillage -> depth 0)
    for fl in spec.flags:
        if yv.flags.get(fl.key) is False:
            for alt in fl.requires:
                for k in alt:
                    if k in nums:
                        yv.numbers.setdefault(k, 0.0)
    return yv


def pct_change(base: float, new: float) -> float | None:
    if base == 0:
        return None if new == 0 else float("inf")
    return (new - base) / base * 100.0


def compare_practice(category: str, lookback: list[YearValues], project: YearValues,
                     threshold: float = PRACTICE_CHANGE_THRESHOLD_PCT) -> list[dict[str, Any]]:
    """Changes in one category for one project year vs the look-back average."""
    out: list[dict[str, Any]] = []
    if not lookback:
        return out
    for k in numeric_keys(category):
        base_vals = [y.numbers[k] for y in lookback if k in y.numbers]
        if k not in project.numbers or not base_vals:
            continue
        base = sum(base_vals) / len(base_vals)
        ch = pct_change(base, project.numbers[k])
        if ch is None:
            continue
        qualifying = ch == float("inf") or abs(ch) > threshold
        out.append({"kind": "quantitative", "key": k, "unit": units(category).get(k, ""),
                    "lookback_average": round(base, 6), "project_value": project.numbers[k],
                    "change_pct": None if ch == float("inf") else round(ch, 3), "introduced": ch == float("inf"),
                    "qualifying": qualifying,
                    "note": ("New practice (not used in the look-back)." if ch == float("inf") else
                             f"Change of {ch:+.1f} % " + ("exceeds" if qualifying else "does not exceed")
                             + f" the {threshold:g} % threshold.")})
    for fl in SCHEMA[category].flags:
        answers = [y.flags[fl.key] for y in lookback if fl.key in y.flags]
        if fl.key not in project.flags or not answers:
            continue
        yes = sum(answers)
        if yes * 2 == len(answers):
            continue  # mixed look-back (as many yes as no years): no clear pre-existing practice
        base_state = yes * 2 > len(answers)
        if project.flags[fl.key] != base_state:
            out.append({"kind": "qualitative", "key": fl.key, "lookback_state": base_state,
                        "project_state": project.flags[fl.key], "qualifying": True,
                        "note": f"{fl.label}: {'started' if project.flags[fl.key] else 'stopped'} in the project."})
    if category == "crop":
        seen = set().union(*(y.crops for y in lookback))
        new = sorted(project.crops - seen)
        if new:
            out.append({"kind": "qualitative", "key": "crop_type", "new_crops": new, "qualifying": True,
                        "note": f"New crop(s) not grown in the look-back: {', '.join(new)}."})
    return out


# ------------------------------------------------------------------ §4 cond. 6 productivity
def crop_yields(attrs_list: list[dict]) -> dict[str, list[float]]:
    """Yield (t/ha) by crop from one field-year's crop records."""
    out: dict[str, list[float]] = {}
    for a in attrs_list:
        if a.get("crop_type") and _is_number(a.get("yield_t_ha")):
            out.setdefault(str(a["crop_type"]).strip().lower(), []).append(float(a["yield_t_ha"]))
    return out


def productivity_check(lookback: list[dict[str, list[float]]], project: dict[int, dict[str, list[float]]],
                       threshold: float = PRODUCTIVITY_DECLINE_PCT) -> dict[str, Any]:
    """Mean project yield per crop vs its look-back mean. A decline of more than ``threshold`` % over at least
    :data:`PRODUCTIVITY_MIN_PROJECT_YEARS` project years is flagged (VM0042 §4 condition 6; production declines
    also need VMD0054 leakage, §8.4.3). A warning for the verifier to judge, never a silent pass."""
    def mean(v: list[float]) -> float:
        return sum(v) / len(v)

    base: dict[str, list[float]] = {}
    for yr in lookback:
        for crop, v in yr.items():
            base.setdefault(crop, []).append(mean(v))
    crops = []
    for crop in sorted({c for yr in project.values() for c in yr}):
        years = sorted(y for y, yr in project.items() if crop in yr)
        row: dict[str, Any] = {"crop": crop, "project_years": years}
        if crop not in base:
            crops.append({**row, "status": "not_compared", "note": "Not grown in the look-back period."})
            continue
        b = mean(base[crop])
        pv = mean([mean(project[y][crop]) for y in years])
        ch = pct_change(b, pv) if b else None
        row.update(lookback_mean_t_ha=round(b, 4), project_mean_t_ha=round(pv, 4),
                   change_pct=None if ch is None or ch == float("inf") else round(ch, 3))
        if ch is None or ch >= -threshold:
            crops.append({**row, "status": "ok"})
        elif len(years) < PRODUCTIVITY_MIN_PROJECT_YEARS:
            crops.append({**row, "status": "watch", "note": "Lower yield in one project year; not yet sustained."})
        else:
            crops.append({**row, "status": "decline",
                          "note": f"Yield {ch:+.1f} % vs the look-back over {len(years)} project years."})
    declines = [c for c in crops if c["status"] == "decline"]
    status = "warning" if declines else "watch" if any(c["status"] == "watch" for c in crops) else         "ok" if crops else "no_data"
    msg = {"warning": "Sustained yield decline of more than "
                      f"{threshold:g} % for {', '.join(c['crop'] for c in declines)} (VM0042 §4 condition 6). "
                      "Explain it to the verifier and assess production-decline leakage (VMD0054, §8.4.3).",
           "watch": "A lower yield in a single project year; it becomes a finding if it continues.",
           "ok": f"No yield decline of more than {threshold:g} % against the look-back.",
           "no_data": "No yields recorded to compare."}[status]
    return {"status": status, "threshold_pct": threshold, "message": msg, "crops": crops}
