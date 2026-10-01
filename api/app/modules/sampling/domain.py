"""Pure sampling logic: no database. Easy to test, same answer every time."""

from __future__ import annotations

import hashlib
import math
from collections.abc import Sequence
from dataclasses import dataclass
from datetime import UTC, date, datetime

from app.core.errors import IllegalTransition, ValidationFailed

DEPTH_TOLERANCE = 1e-6

# ------------------------------------------------------------------ campaign status
CAMPAIGN_FLOW: dict[str, str] = {"planned": "fieldwork", "fieldwork": "lab", "lab": "complete"}
CAMPAIGN_STATUSES = ("planned", "fieldwork", "lab", "complete")


def check_campaign_transition(current: str, new: str) -> None:
    if CAMPAIGN_FLOW.get(current) != new:
        allowed = CAMPAIGN_FLOW.get(current)
        raise IllegalTransition(
            f"A campaign that is {current} can't move to {new}."
            + (f" The next step is {allowed}." if allowed else " It is already complete."),
            details={"from": current, "to": new, "allowed": [allowed] if allowed else []},
        )


# ------------------------------------------------------------------ sample size
def z_for_confidence(confidence: float) -> float:
    from scipy.stats import norm

    return float(norm.ppf((1 + confidence) / 2))


def sample_size(prior_mean: float, prior_sd: float, target_error_pct: float, confidence: float = 0.90) -> tuple[int, float]:
    """n = ceil((z · sd / (e · mean))²), with e the target error as a fraction of the mean."""
    if prior_mean <= 0:
        raise ValidationFailed("The prior mean must be greater than zero.", code="INVALID_PLAN_INPUTS")
    if prior_sd < 0:
        raise ValidationFailed("The prior standard deviation can't be negative.", code="INVALID_PLAN_INPUTS")
    if not 0 < target_error_pct <= 100:
        raise ValidationFailed("The target error must be between 0 and 100 percent.", code="INVALID_PLAN_INPUTS")
    if not 0 < confidence < 1:
        raise ValidationFailed("Confidence must be between 0 and 1 (for example 0.90).", code="INVALID_PLAN_INPUTS")
    z = z_for_confidence(confidence)
    raw = (z * prior_sd / ((target_error_pct / 100.0) * prior_mean)) ** 2
    # Guard against float noise such as 4.000000000001 becoming 5.
    n = math.ceil(round(raw, 9))
    return max(n, 1), z


# ------------------------------------------------------------------ placement
def stratum_seed_offset(stratum_code: str) -> int:
    """A stable per-zone offset so each zone gets its own reproducible random stream."""
    return int.from_bytes(hashlib.sha256(stratum_code.encode("utf-8")).digest()[:4], "big") % (2**31)


def site_code(stratum_code: str, number: int) -> str:
    return f"ST-{stratum_code}-{number:03d}"


def campaign_token(kind: str, monitoring_ordinal: int | None = None) -> str:
    if kind == "baseline":
        return "BL"
    if not monitoring_ordinal or monitoring_ordinal < 1:
        raise ValueError("monitoring campaigns need an ordinal starting at 1")
    return f"M{monitoring_ordinal}"


def _add_years(d: date, n: int) -> date:
    try:
        return d.replace(year=d.year + n)
    except ValueError:  # 29 February in a non-leap year
        return d.replace(year=d.year + n, day=28)


def interval_years(start: date, end: date) -> float:
    """Calendar years between two dates: 1 Feb 2021 → 1 Feb 2024 is exactly 3.0."""
    if end < start:
        return -interval_years(end, start)
    whole = end.year - start.year
    if _add_years(start, whole) > end:
        whole -= 1
    anniversary = _add_years(start, whole)
    following = _add_years(start, whole + 1)
    return whole + (end - anniversary).days / (following - anniversary).days


# ------------------------------------------------------------------ layers
def layer_problems(layers: Sequence[tuple[float, float]], start_cm: float) -> list[str]:
    """Problems with a core's depth increments: must start at ``start_cm``, be contiguous, no overlaps."""
    problems: list[str] = []
    if not layers:
        return ["At least one soil layer is needed."]
    ordered = sorted(layers, key=lambda x: x[0])
    for f, t in ordered:
        if t <= f + DEPTH_TOLERANCE:
            problems.append(f"The layer {f:g}–{t:g} cm must end deeper than it starts.")
    if abs(ordered[0][0] - start_cm) > DEPTH_TOLERANCE:
        problems.append(f"The first layer must start at {start_cm:g} cm (it starts at {ordered[0][0]:g} cm).")
    for (f1, t1), (f2, _t2) in zip(ordered, ordered[1:]):
        if f2 > t1 + DEPTH_TOLERANCE:
            problems.append(f"There is a gap between {t1:g} cm and {f2:g} cm.")
        elif f2 < t1 - DEPTH_TOLERANCE:
            problems.append(f"The layers {f1:g}–{t1:g} cm and {f2:g} cm onwards overlap.")
    return problems


def coverage_to(layers: Sequence[tuple[float, float]]) -> float:
    return max((t for _f, t in layers), default=0.0)


# ------------------------------------------------------------------ custody
CUSTODY_ORDER = (
    "collected", "packed", "dispatched", "courier_received", "lab_received", "opened", "prepared", "analysed",
    "archived",
)
# "prepared" = sample preparation at the lab: drying, 2 mm sieving, grinding (VM0042 v2.2 §8.2.1.3(3)).
STORAGE_CONDITIONS = ("dried", "refrigerated", "frozen", "ambient")
CORRECTION = "correction"
CUSTODY_EVENTS = (*CUSTODY_ORDER, CORRECTION)


@dataclass(frozen=True)
class CustodyStep:
    id: str
    event: str
    occurred_at: datetime


def aware(dt: datetime) -> datetime:
    return dt if dt.tzinfo is not None else dt.replace(tzinfo=UTC)


def check_custody(
    chain: Sequence[CustodyStep],
    *,
    event: str,
    occurred_at: datetime,
    seal_intact: bool | None = None,
    count_matches: bool | None = None,
    notes: str = "",
    corrects_event_id: str | None = None,
) -> None:
    """Raise if ``event`` can't be appended to ``chain`` (which is in recorded order)."""
    if event not in CUSTODY_EVENTS:
        raise ValidationFailed(
            f"Unknown custody step “{event}”.", code="UNKNOWN_CUSTODY_EVENT", details={"allowed": list(CUSTODY_EVENTS)}
        )
    when = aware(occurred_at)
    if chain and when < max(aware(s.occurred_at) for s in chain):
        raise ValidationFailed(
            "This step is dated before an earlier step in the chain. Custody times can't go backwards.",
            code="CUSTODY_TIME_ORDER",
        )
    steps = [s for s in chain if s.event != CORRECTION]
    if event == CORRECTION:
        if not chain:
            raise IllegalTransition("There is nothing to correct yet.", code="CUSTODY_ORDER")
        if not corrects_event_id or corrects_event_id not in {s.id for s in chain}:
            raise ValidationFailed("A correction must name a step in this sample's custody chain.",
                                   code="CUSTODY_CORRECTION")
        if len((notes or "").strip()) < 5:
            raise ValidationFailed("Explain the correction in at least 5 characters.", code="CUSTODY_CORRECTION")
        return
    if corrects_event_id:
        raise ValidationFailed("Only a correction step may refer to another step.", code="CUSTODY_CORRECTION")
    if not steps:
        if event != "collected":
            raise IllegalTransition("The first custody step must be “collected”.", code="CUSTODY_ORDER")
        return
    done = {s.event for s in steps}
    if event in done:
        raise IllegalTransition(f"“{event}” has already been recorded for this sample.", code="CUSTODY_REPEAT")
    last_idx = max(CUSTODY_ORDER.index(s.event) for s in steps)
    idx = CUSTODY_ORDER.index(event)
    if idx <= last_idx:
        raise IllegalTransition(
            f"“{event}” can't come after “{CUSTODY_ORDER[last_idx]}”.", code="CUSTODY_ORDER",
            details={"last": CUSTODY_ORDER[last_idx]},
        )
    if event == "lab_received" and (seal_intact is None or count_matches is None):
        raise ValidationFailed(
            "When the lab receives a sample, record whether the seal was intact and the bag count matched.",
            code="CUSTODY_RECEIPT_CHECKS",
        )
    if event in ("opened", "prepared", "analysed") and "lab_received" not in done:
        raise IllegalTransition(
            f"The lab must record receiving the sample before it is {event}.", code="CUSTODY_NOT_RECEIVED"
        )


def custody_status(chain: Sequence[CustodyStep]) -> str:
    steps = [s for s in chain if s.event != CORRECTION]
    if not steps:
        return "none"
    return max(steps, key=lambda s: CUSTODY_ORDER.index(s.event)).event


# ------------------------------------------------------------------ VM0042 v2.2 references
REF = {
    "stratification": "VM0042 v2.2 §8.2.1.2 p.29-30",
    "composites": "VM0042 v2.2 §8.2.1.2 p.30",
    "power": "VM0042 v2.2 §8.2.1.3(11) Eq. 1-2 p.33-34",
    "season": "VM0042 v2.2 §8.2.1.1 p.28",
    "georeference": "VM0042 v2.2 §8.2.1.1 p.28",
    "shipping": "VM0042 v2.2 §8.2.1.3(5) p.32",
    "storage": "VM0042 v2.2 §8.2.1.3(5) p.32",
    "depth": "VM0042 v2.2 §8.2.1.3(7b) p.32",
    "increments": "VM0042 v2.2 §8.2.1.3(7)(c) p.33",
    "esm": "VM0042 v2.2 §8.2.1.6 Eq. 3 p.36",
    "methods": "VM0042 v2.2 §8.2.1.4 p.34-35",
    "lab": "VM0042 v2.2 §8.2.1.4 p.34-35",
    "remeasure": "VM0042 v2.2 §8.1 p.20 and §9.2",
    "spectroscopy": "VM0042 v2.2 §8.6.2 Eq. 73 p.80 and Appendix 4 p.152-157",
    "annex": "VM0042 v2.2 §8.2.1.2 p.29 (strata and points annex at every verification)",
}

# ------------------------------------------------------------------ stratification factors (§8.2.1.2)
STRATIFICATION_FACTORS = (
    "climate", "topography", "slope_class", "land_use_history", "parent_material", "soil_texture", "soil_type",
    "crop", "management",
)


def stratification_problems(criteria: dict) -> list[str]:
    if not isinstance(criteria, dict) or not criteria:
        return ["Report the stratification factors used for this zone (for example soil_type, crop, climate)."]
    unknown = sorted(k for k in criteria if k not in STRATIFICATION_FACTORS)
    problems = []
    if unknown:
        problems.append(f"Unknown stratification factor(s): {', '.join(unknown)}. "
                        f"Allowed: {', '.join(STRATIFICATION_FACTORS)}.")
    empty = sorted(k for k, v in criteria.items() if k in STRATIFICATION_FACTORS and v in (None, "", [], {}))
    if empty:
        problems.append(f"Give a value for: {', '.join(empty)}.")
    return problems


# ------------------------------------------------------------------ season (§8.2.1.2)
SEASON_WINDOW_DAYS = 45
"""Platform definition of "same season": planned start day-of-year within ±45 days of the re-visited
baseline's planned start (wrapping around the new year). A project rule ``season_window_days`` overrides it."""


def day_of_year_gap(a: date, b: date) -> int:
    """Smallest distance in days between the two dates' positions in the year (wraps around 31 Dec)."""
    da, db_ = a.timetuple().tm_yday, b.timetuple().tm_yday
    d = abs(da - db_)
    return min(d, 365 - d)


# ------------------------------------------------------------------ power analysis (Eq. 1-2)
def _t_terms(alpha: float, power: float, df: int) -> tuple[float, float]:
    from scipy.stats import t

    return float(t.ppf(1 - alpha / 2, df)), float(t.ppf(power, df))


def _check_power_inputs(s: float, alpha: float, power: float) -> None:
    if s <= 0:
        raise ValidationFailed("The standard deviation of the difference must be greater than zero.",
                               code="INVALID_PLAN_INPUTS")
    if not 0 < alpha < 1:
        raise ValidationFailed("Alpha must be between 0 and 1 (for example 0.05).", code="INVALID_PLAN_INPUTS")
    if not 0 < power < 1:
        raise ValidationFailed("Power must be between 0 and 1 (for example 0.90).", code="INVALID_PLAN_INPUTS")


def mdd_for_n(s: float, n: int, alpha: float, power: float) -> dict:
    """Eq. 1: MDD = S/sqrt(n) x (t_alpha,v + t_beta,v), v = n - 1, t_alpha two-sided, t_beta one-sided."""
    _check_power_inputs(s, alpha, power)
    if n < 2:
        raise ValidationFailed("At least 2 samples are needed.", code="INVALID_PLAN_INPUTS")
    ta, tb = _t_terms(alpha, power, n - 1)
    return {"n": n, "df": n - 1, "t_alpha": round(ta, 6), "t_beta": round(tb, 6),
            "mdd": s / math.sqrt(n) * (ta + tb)}


def n_for_mdd(s: float, mdd: float, alpha: float, power: float, max_n: int = 10_000) -> dict:
    """Eq. 2: smallest n with n >= (S (t_alpha + t_beta) / MDD)^2, solved iteratively with v = n - 1."""
    _check_power_inputs(s, alpha, power)
    if mdd <= 0:
        raise ValidationFailed("The minimum detectable difference must be greater than zero.",
                               code="INVALID_PLAN_INPUTS")
    n, iterations = 2, 0
    while n <= max_n:
        iterations += 1
        ta, tb = _t_terms(alpha, power, n - 1)
        need = (s * (ta + tb) / mdd) ** 2
        if n >= math.ceil(round(need, 9)):
            return {"n": n, "df": n - 1, "t_alpha": round(ta, 6), "t_beta": round(tb, 6),
                    "n_formula": round(need, 4), "iterations": iterations}
        n += 1  # need(n) falls as n grows, so the first n that satisfies Eq. 2 is the smallest
    raise ValidationFailed("The required number of samples is unrealistically large; check the inputs.",
                           code="INVALID_PLAN_INPUTS")


# ------------------------------------------------------------------ multi-stage design (VM0042 Appendix 6)
DESIGN_SELECTIONS = ("census", "pps_wr", "equal_wr")
PROBABILITY_TOLERANCE = 1e-6


def selection_probability(selection: str, size: float, total_size: float, count: int) -> float:
    """Per-draw selection probability p: census 1; PPS size / total size (Appendix 6 p. 159: fields drawn with
    probability proportional to size); equal probability 1 / count."""
    if selection == "census":
        return 1.0
    if selection == "pps_wr":
        return size / total_size if total_size > 0 else 0.0
    if selection == "equal_wr":
        return 1.0 / count if count > 0 else 0.0
    raise ValidationFailed(f"Unknown selection method “{selection}”.", code="INVALID_SAMPLING_DESIGN")


def inclusion_probability(p: float, total_draws: int, selection: str) -> float:
    """π = 1 − (1 − p)^m for m independent draws with replacement; 1 for a census."""
    if selection == "census":
        return 1.0
    return 1.0 - (1.0 - p) ** total_draws


def _stage(selection: str, listed: list[dict], population: dict, *, parent: str, what: str, need_two: bool,
           problems: list[str]) -> list[dict]:
    """Validate one selection stage. ``listed``: [{"ref", "draws", "selection_probability"}];
    ``population``: {ref: {"label", "area_ha", ...}}. Returns rows with computed probabilities."""
    refs = [x["ref"] for x in listed]
    dupes = sorted({r for r in refs if refs.count(r) > 1})
    if dupes:
        problems.append(f"{what} listed more than once in {parent}: {', '.join(dupes)}. Record repeated draws "
                        "with “draws”.")
    unknown = [r for r in refs if r not in population]
    if unknown:
        problems.append(f"{len(unknown)} {what} in {parent} are not part of the sampled population (fields in the "
                        "project's current zones).")
    total_size = float(sum(v["area_ha"] for v in population.values()))
    count = len(population)
    m = int(sum(x["draws"] for x in listed))
    if selection == "census":
        if any(x["draws"] != 1 for x in listed):
            problems.append(f"A census measures each {what[:-1]} once: every “draws” must be 1 in {parent}.")
        missing = sorted(set(population) - set(refs))
        if missing:
            problems.append(f"A census must list every {what[:-1]} of {parent}: {len(missing)} are missing.")
    elif need_two and m < 2:
        problems.append(f"{parent} has {m} draw(s) of {what}; at least 2 draws are needed to estimate the sampling "
                        "variance (VM0042 Appendix 6, Eq. A6.1/A6.9).")
    out = []
    for x in listed:
        pop = population.get(x["ref"])
        if pop is None:
            continue
        p = selection_probability(selection, pop["area_ha"], total_size, count)
        if not 0 < p <= 1 + 1e-12:
            problems.append(f"The selection probability of {pop['label']} must be in (0, 1]; it is {p:g}.")
        given = x.get("selection_probability")
        if given is not None and abs(given - p) > PROBABILITY_TOLERANCE * max(1.0, p):
            problems.append(f"The selection probability given for {pop['label']} ({given:g}) does not match the "
                            f"design ({p:.6g}).")
        out.append({"ref": x["ref"], "label": pop["label"], "draws": int(x["draws"]), "area_ha": pop["area_ha"],
                    "selection_probability": min(p, 1.0),
                    "inclusion_probability": inclusion_probability(min(p, 1.0), m, selection)})
    return out


def validate_multistage_design(spec: dict, population: dict) -> tuple[dict, list[str]]:
    """Check a multi-stage design against the population and compute every probability (pure).

    ``spec`` is the request (see ``SamplingDesignIn``). ``population`` is
    ``{"area_ha": A, "units": {ref: {"label", "area_ha", "fields": {field ref: {"label", "area_ha", "strata"}}}}}``
    where, for ``stage1_unit == "field"``, every field is its own unit. Returns the normalised design and the list
    of problems (empty when valid)."""
    problems: list[str] = []
    unit_kind = spec["stage1_unit"]
    s1, s2 = spec["stage1_selection"], spec.get("stage2_selection")
    units_pop = population["units"]
    if not units_pop:
        problems.append("The project has no fields in its current project zones, so there is nothing to sample.")
    if unit_kind == "field":
        if s2 is not None:
            problems.append("When fields are the first stage there is no second stage: leave stage2_selection empty.")
        if any(u.get("fields") for u in spec["units"]):
            problems.append("When fields are the first stage, list the fields as units (no nested fields).")
    elif s2 is None:
        problems.append("Say how fields are selected within each selected unit (stage2_selection).")
    listed1 = [{"ref": u["unit_id"], "draws": u["draws"], "selection_probability": u.get("selection_probability")}
               for u in spec["units"]]
    what1 = {"landowner": "landowners", "farm": "farms", "field": "fields"}[unit_kind]
    rows1 = _stage(s1, listed1, units_pop, parent="the project", what=what1,
                   need_two=s1 != "census", problems=problems)
    units_out = []
    by_ref = {u["unit_id"]: u for u in spec["units"]}
    for row in rows1:
        pop = units_pop[row["ref"]]
        if unit_kind == "field":
            only = pop["fields"][row["ref"]]
            units_out.append({**row, "population_count": None, "stratum_areas": dict(only["strata"]), "fields": []})
            continue
        req = by_ref[row["ref"]]
        if not req.get("fields"):
            problems.append(f"Select at least one field for {pop['label']}.")
            continue
        listed2 = [{"ref": f["field_id"], "draws": f["draws"], "selection_probability": f.get("selection_probability")}
                   for f in req["fields"]]
        rows2 = _stage(s2 or "census", listed2, pop["fields"], parent=pop["label"], what="fields",
                       need_two=s1 == "census", problems=problems) if s2 else []
        fields_out = [{**f, "stratum_areas": dict(pop["fields"][f["ref"]]["strata"])} for f in rows2]
        units_out.append({**row, "population_count": len(pop["fields"]), "stratum_areas": {}, "fields": fields_out})
    norm = {"stage1_unit": unit_kind, "stage1_selection": s1, "stage2_selection": s2,
            "population_area_ha": float(population["area_ha"]), "population_unit_count": len(units_pop),
            "units": units_out}
    return norm, list(dict.fromkeys(problems))
