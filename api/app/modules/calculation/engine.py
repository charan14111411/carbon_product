"""Soil organic carbon quantification engine.

Pure functions only: no database, no clock, no randomness. Given the same inputs and
the same rule set, the engine returns exactly the same result.

The only constant in this file is the molecular-weight ratio CO2/C (44/12). Every
methodology choice and parameter comes from the approved rule set via
``RuleSet.require`` which fails closed (raises ``RuleMissing`` naming the key).

Units
-----
* bulk density            g/cm³
* layer thickness         cm
* fine-soil mass          t/ha         (bd × thickness × 100 × (1 − coarse fraction))
* SOC concentration       % (mass)
* SOC stock               t C/ha
* project figures         t CO2e (variances in (t CO2e)²)

Structure (VM0042 v2.2, measure-and-remeasure)
----------------------------------------------
layer stock → point stock (fixed depth or equivalent soil mass) → stratum change
(paired or independent design, optionally netted against control sites) → project
change (area-weighted, converted to CO2e) → project terms → uncertainty deduction
(Eq. 74 style, one-sided t) → non-permanence buffer → split into reductions and
removals (Eq. 37–43 style).
"""

from __future__ import annotations

import math
from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass, field
from typing import Any

import numpy as np
from scipy import stats

from app.core.errors import Blocked, RuleMissing, ValidationFailed
from app.modules.methodology.ruleset import RuleSet

CO2_PER_C: float = 44.0 / 12.0

ENGINE_TERMS: tuple[str, ...] = ("baseline_scenario", "project_emissions", "baseline_emissions", "leakage")
_TOL = 1e-6


# =============================================================== inputs
@dataclass(frozen=True)
class Layer:
    """One depth increment of a core, with its accepted lab values."""

    code: str
    depth_from_cm: float
    depth_to_cm: float
    bulk_density_g_cm3: float
    soc_pct: float
    coarse_fraction: float | None = None


@dataclass(frozen=True)
class Point:
    """One core (all its layers) at a permanent site in one campaign."""

    site_id: str
    layers: tuple[Layer, ...]
    sample_code: str = ""


@dataclass(frozen=True)
class StratumData:
    code: str
    area_ha: float
    baseline: tuple[Point, ...]
    monitoring: tuple[Point, ...]
    role: str = "project"  # project | control
    control_for_code: str | None = None


@dataclass(frozen=True)
class Term:
    """A project-level term in t CO2e with its variance (and optional degrees of freedom)."""

    value_t_co2e: float
    variance: float = 0.0
    df: float | None = None
    source: str = ""


@dataclass(frozen=True)
class EngineInput:
    design: str  # paired | independent
    strata: tuple[StratumData, ...]
    terms: Mapping[str, Term] = field(default_factory=dict)
    # Cumulative project stock change used for the removal indicator (I). Defaults to this period's change.
    cumulative_project_stock_change_t_co2e: float | None = None


# =============================================================== outputs
@dataclass(frozen=True)
class LayerStock:
    code: str
    depth_from_cm: float
    depth_to_cm: float
    fine_mass_t_ha: float
    stock_t_c_ha: float


@dataclass(frozen=True)
class PointStock:
    site_id: str
    sample_code: str
    method: str
    stock_t_c_ha: float
    fine_mass_t_ha: float
    layers: tuple[LayerStock, ...]


@dataclass(frozen=True)
class StratumResult:
    code: str
    role: str
    area_ha: float
    design: str
    n_baseline: int
    n_monitoring: int
    n_used: int
    mean_baseline_t_c_ha: float
    mean_monitoring_t_c_ha: float
    measured_delta_t_c_ha: float
    measured_variance: float
    measured_df: float
    delta_t_c_ha: float  # after control netting (equals measured when no control)
    variance: float  # variance of delta (t C/ha)²
    se: float
    df: float
    excluded_sites: tuple[str, ...] = ()
    control_code: str | None = None
    control_delta_t_c_ha: float | None = None
    control_variance: float | None = None
    baseline_points: tuple[PointStock, ...] = ()
    monitoring_points: tuple[PointStock, ...] = ()


@dataclass(frozen=True)
class TermResult:
    term: str
    value_t_co2e: float
    variance: float
    df: float | None
    source: str
    status: str  # supplied | not_required_by_rules | measured_at_control_sites


@dataclass(frozen=True)
class CalculationResult:
    stock_method: str
    design: str
    strata: tuple[StratumResult, ...]
    control_strata: tuple[StratumResult, ...]
    controls_used: bool
    dsoc_t_c: float
    dsoc_variance_t_c: float
    dsoc_t_co2e: float
    dsoc_variance_t_co2e: float
    terms: tuple[TermResult, ...]
    gross_t_co2e: float
    net_before_uncertainty_t_co2e: float
    total_variance: float
    se_t_co2e: float
    df_effective: float
    confidence: float
    t_value: float | None
    uncertainty_deduction_t_co2e: float
    net_after_uncertainty_t_co2e: float
    non_permanence_risk_pct: float
    buffer_t_co2e: float
    credits_t_co2e: float
    reductions_t_co2e: float
    removals_t_co2e: float
    split: dict[str, float]
    flags: dict[str, bool]
    rules_snapshot: dict[str, Any]

    def to_dict(self) -> dict[str, Any]:
        return _jsonable(asdict(self))


def _jsonable(v: Any) -> Any:
    if isinstance(v, dict):
        return {str(k): _jsonable(x) for k, x in v.items()}
    if isinstance(v, (list, tuple)):
        return [_jsonable(x) for x in v]
    if isinstance(v, (np.floating,)):
        return float(v)
    if isinstance(v, (np.integer,)):
        return int(v)
    if isinstance(v, np.bool_):
        return bool(v)
    return v


# =============================================================== helpers
def welch_df(components: Sequence[tuple[float, float]]) -> float:
    """Welch–Satterthwaite effective degrees of freedom for a sum of independent variances.

    ``components`` are ``(variance, df)`` pairs. When every variance is zero the answer
    is the smallest df (conservative). A component with variance but no usable df gives 0,
    which callers treat as missing."""
    if not components:
        return 0.0
    total = sum(v for v, _ in components)
    if total <= 0:
        return float(min(d for _, d in components))
    denom = 0.0
    for v, d in components:
        if v <= 0:
            continue
        if d is None or d <= 0:
            return 0.0
        denom += v * v / d
    return float(total * total / denom) if denom > 0 else 0.0


def layer_stock(layer: Layer, rules: RuleSet) -> LayerStock:
    """Fine-soil mass and SOC stock (t C/ha) of one layer."""
    thickness = layer.depth_to_cm - layer.depth_from_cm
    if thickness <= 0:
        raise ValidationFailed(
            f"Layer {layer.code} has a depth range that is empty or reversed.",
            code="INVALID_LAYER", details={"layer": layer.code},
        )
    if layer.bulk_density_g_cm3 is None or layer.bulk_density_g_cm3 <= 0:
        raise ValidationFailed(f"Layer {layer.code} has no valid bulk density.", code="INVALID_LAYER",
                               details={"layer": layer.code})
    if layer.soc_pct is None or layer.soc_pct < 0:
        raise ValidationFailed(f"Layer {layer.code} has no valid SOC value.", code="INVALID_LAYER",
                               details={"layer": layer.code})
    factor = 1.0
    if rules.require("coarse_fragment_correction"):
        cf = layer.coarse_fraction
        if cf is None:
            raise RuleMissing(
                f"The rules require a stone (coarse fragment) correction but layer {layer.code} has no "
                "accepted coarse-fraction result.",
                details={"rule_key": "coarse_fraction", "layer": layer.code},
            )
        if not 0 <= cf < 1:
            raise ValidationFailed(f"Coarse fraction for layer {layer.code} must be between 0 and 1.",
                                   code="INVALID_LAYER", details={"layer": layer.code, "value": cf})
        factor = 1.0 - cf
    fine_mass = layer.bulk_density_g_cm3 * thickness * 100.0 * factor
    return LayerStock(layer.code, float(layer.depth_from_cm), float(layer.depth_to_cm), float(fine_mass),
                      float(fine_mass * layer.soc_pct / 100.0))


def _ordered_layers(point: Point) -> list[Layer]:
    if not point.layers:
        raise Blocked(f"Sample {point.sample_code or point.site_id} has no soil layers.", code="DEPTH_MISMATCH",
                      details={"sample": point.sample_code, "site_id": point.site_id})
    layers = sorted(point.layers, key=lambda x: x.depth_from_cm)
    expected = 0.0
    for lyr in layers:
        if abs(lyr.depth_from_cm - expected) > _TOL:
            raise Blocked(
                f"The layers of sample {point.sample_code or point.site_id} are not continuous from the surface "
                f"(expected a layer starting at {expected:g} cm, found {lyr.depth_from_cm:g} cm).",
                code="LAYER_GAP", details={"sample": point.sample_code, "site_id": point.site_id, "layer": lyr.code},
            )
        expected = lyr.depth_to_cm
    return layers


def point_stock(point: Point, rules: RuleSet) -> PointStock:
    """SOC stock of one core by the method the rules require."""
    method = rules.require("stock_method")
    layers = _ordered_layers(point)
    stocks = [layer_stock(lyr, rules) for lyr in layers]
    label = point.sample_code or point.site_id

    if method == "fixed_depth":
        depth = float(rules.require("stock_depth_cm"))
        bottom = layers[-1].depth_to_cm
        if bottom + _TOL < depth:
            raise Blocked(
                f"Sample {label} reaches {bottom:g} cm but the rules require {depth:g} cm.",
                code="DEPTH_MISMATCH", details={"sample": point.sample_code, "reached_cm": bottom, "required_cm": depth},
            )
        total_c = 0.0
        total_m = 0.0
        for ls in stocks:
            if ls.depth_from_cm >= depth - _TOL:
                break
            share = min(1.0, (depth - ls.depth_from_cm) / (ls.depth_to_cm - ls.depth_from_cm))
            total_c += ls.stock_t_c_ha * share
            total_m += ls.fine_mass_t_ha * share
        return PointStock(point.site_id, point.sample_code, method, float(total_c), float(total_m), tuple(stocks))

    if method == "esm":
        ref = float(rules.require("esm_reference_mass_t_ha"))
        cum_m = np.concatenate([[0.0], np.cumsum([s.fine_mass_t_ha for s in stocks])])
        cum_c = np.concatenate([[0.0], np.cumsum([s.stock_t_c_ha for s in stocks])])
        if cum_m[-1] + _TOL < ref:
            raise Blocked(
                f"Sample {label} holds {cum_m[-1]:.0f} t/ha of fine soil, less than the reference mass of "
                f"{ref:.0f} t/ha. Sample deeper to use equivalent soil mass.",
                code="DEPTH_MISMATCH", details={"sample": point.sample_code, "mass_t_ha": float(cum_m[-1]),
                                                "reference_t_ha": ref},
            )
        stock = float(np.interp(ref, cum_m, cum_c))
        return PointStock(point.site_id, point.sample_code, method, stock, ref, tuple(stocks))

    raise ValidationFailed(f"Unknown stock method “{method}” in the rules.", code="UNSUPPORTED_RULE_VALUE",
                           details={"rule_key": "stock_method", "value": method})


def _index(points: Sequence[PointStock], stratum: str, campaign: str) -> dict[str, PointStock]:
    out: dict[str, PointStock] = {}
    for p in points:
        if p.site_id in out:
            raise ValidationFailed(
                f"Site {p.site_id} was sampled twice in the {campaign} campaign of zone {stratum}.",
                code="DUPLICATE_SITE", details={"stratum": stratum, "site_id": p.site_id},
            )
        out[p.site_id] = p
    return out


def _insufficient(stratum: str, what: str, n: int) -> Blocked:
    return Blocked(
        f"Zone {stratum} has only {n} usable {what}; at least 2 are needed to estimate uncertainty.",
        code="INSUFFICIENT_SAMPLES", details={"stratum": stratum, "n": n, "what": what},
    )


def stratum_change(s: StratumData, design: str, rules: RuleSet) -> StratumResult:
    """Mean SOC stock change (t C/ha) and its variance for one zone."""
    base = [point_stock(p, rules) for p in s.baseline]
    mon = [point_stock(p, rules) for p in s.monitoring]
    b_idx, m_idx = _index(base, s.code, "baseline"), _index(mon, s.code, "monitoring")

    if design == "paired":
        policy = rules.require("unpaired_points_policy")
        paired = sorted(set(b_idx) & set(m_idx))
        unpaired = sorted(set(b_idx) ^ set(m_idx))
        if unpaired and policy == "block":
            raise Blocked(
                f"Zone {s.code} has {len(unpaired)} site(s) sampled in only one campaign, and the rules say "
                "unpaired sites block the calculation.",
                code="UNPAIRED_POINTS", details={"stratum": s.code, "sites": unpaired},
            )
        if unpaired and policy != "exclude_and_report":
            raise ValidationFailed(f"Unknown unpaired-points policy “{policy}”.", code="UNSUPPORTED_RULE_VALUE",
                                   details={"rule_key": "unpaired_points_policy", "value": policy})
        n = len(paired)
        if n < 2:
            raise _insufficient(s.code, "paired sites", n)
        b = np.array([b_idx[k].stock_t_c_ha for k in paired], dtype=float)
        m = np.array([m_idx[k].stock_t_c_ha for k in paired], dtype=float)
        d = m - b
        delta = float(np.mean(d))
        var = float(np.var(d, ddof=1) / n)
        df = float(n - 1)
        mean_b, mean_m, excluded = float(np.mean(b)), float(np.mean(m)), tuple(unpaired)
        n_used = n
    elif design == "independent":
        if len(base) < 2:
            raise _insufficient(s.code, "baseline samples", len(base))
        if len(mon) < 2:
            raise _insufficient(s.code, "monitoring samples", len(mon))
        b = np.array([p.stock_t_c_ha for p in sorted(base, key=lambda x: x.site_id)], dtype=float)
        m = np.array([p.stock_t_c_ha for p in sorted(mon, key=lambda x: x.site_id)], dtype=float)
        vb, vm = float(np.var(b, ddof=1) / len(b)), float(np.var(m, ddof=1) / len(m))
        mean_b, mean_m = float(np.mean(b)), float(np.mean(m))
        delta = mean_m - mean_b
        var = vb + vm
        df = welch_df([(vb, len(b) - 1), (vm, len(m) - 1)])
        excluded = ()
        n_used = len(b) + len(m)
    else:
        raise ValidationFailed(f"Unknown monitoring design “{design}”.", code="UNSUPPORTED_DESIGN",
                               details={"design": design})

    return StratumResult(
        code=s.code, role=s.role, area_ha=float(s.area_ha), design=design,
        n_baseline=len(base), n_monitoring=len(mon), n_used=n_used,
        mean_baseline_t_c_ha=mean_b, mean_monitoring_t_c_ha=mean_m,
        measured_delta_t_c_ha=delta, measured_variance=var, measured_df=df,
        delta_t_c_ha=delta, variance=var, se=math.sqrt(var), df=df, excluded_sites=excluded,
        baseline_points=tuple(sorted(base, key=lambda x: x.site_id)),
        monitoring_points=tuple(sorted(mon, key=lambda x: x.site_id)),
    )


def net_against_control(project: StratumResult, control: StratumResult) -> StratumResult:
    """Project change minus control change. Variances add (covariance ignored: conservative)."""
    var = project.measured_variance + control.measured_variance
    df = welch_df([(project.measured_variance, project.measured_df), (control.measured_variance, control.measured_df)])
    delta = project.measured_delta_t_c_ha - control.measured_delta_t_c_ha
    return StratumResult(**{
        **{f: getattr(project, f) for f in project.__dataclass_fields__},
        "delta_t_c_ha": delta, "variance": var, "se": math.sqrt(var), "df": df,
        "control_code": control.code, "control_delta_t_c_ha": control.measured_delta_t_c_ha,
        "control_variance": control.measured_variance,
    })


def _check_design(design: str, rules: RuleSet) -> None:
    allowed = rules.require("sampling_design")
    if allowed not in ("either", design):
        raise Blocked(
            f"The monitoring campaign uses a {design} design but the rules allow only {allowed}.",
            code="DESIGN_NOT_PERMITTED", details={"rule_key": "sampling_design", "allowed": allowed, "design": design},
        )


def _terms(inp: EngineInput, rules: RuleSet, controls_used: bool) -> dict[str, TermResult]:
    unknown = sorted(set(inp.terms) - set(ENGINE_TERMS))
    if unknown:
        raise ValidationFailed("Unknown project terms were supplied.", code="UNKNOWN_TERM", details={"terms": unknown})
    out: dict[str, TermResult] = {}
    for term in ENGINE_TERMS:
        supplied = inp.terms.get(term)
        if supplied is not None and supplied.variance < 0:
            raise ValidationFailed(f"The variance of {term} can't be negative.", code="INVALID_TERM",
                                   details={"term": term})
        if term == "baseline_scenario" and controls_used:
            if supplied is not None:
                raise ValidationFailed(
                    "The baseline-scenario change is already measured at the control sites. Supplying it as "
                    "a separate term would count it twice.",
                    code="DOUBLE_COUNTING", details={"term": term},
                )
            out[term] = TermResult(term, 0.0, 0.0, None, "measured_at_control_sites", "measured_at_control_sites")
            continue
        required = rules.require(f"{term}_required")
        if required:
            if supplied is None:
                raise RuleMissing(
                    f"The rules require the “{term.replace('_', ' ')}” term, but no approved estimate exists "
                    "for this period.",
                    details={"rule_key": term, "term": term},
                )
            out[term] = TermResult(term, float(supplied.value_t_co2e), float(supplied.variance),
                                   None if supplied.df is None else float(supplied.df), supplied.source, "supplied")
        else:
            out[term] = TermResult(term, 0.0, 0.0, None, "not_required_by_rules", "not_required_by_rules")
    return out


def split_reductions_removals(
    *, d_wp: float, d_bsl: float, baseline_emissions: float, project_emissions: float, leakage: float,
    deduction: float, buffer: float, cumulative_stock_change: float,
) -> dict[str, float]:
    """Split a positive net result into emission reductions (ER) and carbon removals (CR).

    VM0042 v2.2 Eq. 37–43 style: SOC losses and gains that don't lead to a cumulative
    stock increase count as reductions; gains with a cumulative increase are removals.
    Leakage, deduction and buffer are shared in proportion to the positive parts, so
    the two figures always sum to the credited total."""
    indicator = 1.0 if cumulative_stock_change > 0 else 0.0
    losses = min(0.0, d_wp) - min(0.0, d_bsl)
    gains = max(0.0, d_wp) - max(0.0, d_bsl)
    er = (baseline_emissions - project_emissions) + losses + (1.0 - indicator) * gains
    cr = indicator * gains

    def shares(a: float, b: float, what: str) -> tuple[float, float]:
        pa, pb = max(0.0, a), max(0.0, b)
        if pa + pb <= 0:
            raise Blocked(f"There is nothing positive to share the {what} against.", code="SPLIT_NOT_POSSIBLE",
                          details={"reductions": a, "removals": b})
        return pa / (pa + pb), pb / (pa + pb)

    leak_er = leak_cr = 0.0
    if leakage != 0:
        w_er, w_cr = shares(er, cr, "leakage")
        leak_er, leak_cr = leakage * w_er, leakage * w_cr
    er_net, cr_net = er - leak_er, cr - leak_cr
    w_er, w_cr = shares(er_net, cr_net, "uncertainty deduction and buffer")
    ded_er, ded_cr = deduction * w_er, deduction * w_cr
    buf_er, buf_cr = buffer * w_er, buffer * w_cr
    return {
        "removal_indicator": indicator, "losses": losses, "gains": gains,
        "er_gross": er, "cr_gross": cr, "leakage_er": leak_er, "leakage_cr": leak_cr,
        "er_net": er_net, "cr_net": cr_net, "deduction_er": ded_er, "deduction_cr": ded_cr,
        "buffer_er": buf_er, "buffer_cr": buf_cr,
        "reductions_t_co2e": er_net - ded_er - buf_er, "removals_t_co2e": cr_net - ded_cr - buf_cr,
    }


# =============================================================== main entry
def calculate(inp: EngineInput, rules: RuleSet, *, high_uncertainty_ratio: float = 0.15) -> CalculationResult:
    """Run the full quantification. Raises ``RuleMissing`` / ``Blocked`` / ``ValidationFailed``
    rather than assume anything.

    ``high_uncertainty_ratio`` only sets a review flag; it never changes a credited figure."""
    stock_method = rules.require("stock_method")
    _check_design(inp.design, rules)

    project_in = [s for s in inp.strata if s.role == "project"]
    control_in = [s for s in inp.strata if s.role == "control"]
    bad_roles = sorted({s.role for s in inp.strata} - {"project", "control"})
    if bad_roles:
        raise ValidationFailed("Zones must have the role project or control.", code="INVALID_STRATUM",
                               details={"roles": bad_roles})
    if not project_in:
        raise Blocked("There are no project zones to calculate.", code="NO_STRATA")
    codes = [s.code for s in inp.strata]
    if len(codes) != len(set(codes)):
        raise ValidationFailed("Zone codes must be unique.", code="INVALID_STRATUM")
    for s in project_in:
        if s.area_ha is None or s.area_ha <= 0:
            raise ValidationFailed(f"Zone {s.code} has no area.", code="INVALID_STRATUM", details={"stratum": s.code})

    controls = {s.code: stratum_change(s, inp.design, rules) for s in control_in}
    by_target: dict[str, StratumResult] = {}
    for s in control_in:
        if not s.control_for_code:
            raise ValidationFailed(f"Control zone {s.code} doesn't say which project zone it controls.",
                                   code="INVALID_STRATUM", details={"stratum": s.code})
        if s.control_for_code in by_target:
            raise ValidationFailed(f"Project zone {s.control_for_code} has more than one control zone.",
                                   code="INVALID_STRATUM", details={"stratum": s.control_for_code})
        by_target[s.control_for_code] = controls[s.code]
    controls_used = bool(control_in)

    results: list[StratumResult] = []
    for s in sorted(project_in, key=lambda x: x.code):
        r = stratum_change(s, inp.design, rules)
        if controls_used:
            ctrl = by_target.get(s.code)
            if ctrl is None:
                raise RuleMissing(
                    f"Control sites are in use but project zone {s.code} has no control zone.",
                    details={"rule_key": "control_site", "stratum": s.code},
                )
            r = net_against_control(r, ctrl)
        results.append(r)
    orphan = sorted(set(by_target) - {s.code for s in project_in})
    if orphan:
        raise ValidationFailed("A control zone points to a project zone that doesn't exist.", code="INVALID_STRATUM",
                               details={"control_for": orphan})

    dsoc_c = float(sum(r.delta_t_c_ha * r.area_ha for r in results))
    var_c = float(sum(r.variance * r.area_ha**2 for r in results))
    dsoc = dsoc_c * CO2_PER_C
    var_dsoc = var_c * CO2_PER_C**2
    components: list[tuple[float, float]] = [(r.variance * r.area_ha**2 * CO2_PER_C**2, r.df) for r in results]

    terms = _terms(inp, rules, controls_used)
    for t in terms.values():
        if t.variance > 0 and t.df is not None:
            components.append((t.variance, t.df))
    df_eff = welch_df(components)

    tv = {k: t.value_t_co2e for k, t in terms.items()}
    gross = dsoc - tv["baseline_scenario"] + tv["baseline_emissions"] - tv["project_emissions"]
    net_before = gross - tv["leakage"]
    total_var = var_dsoc + sum(t.variance for t in terms.values())
    se = math.sqrt(total_var)

    method = rules.require("uncertainty_method")
    if method != "vm0042_eq74":
        raise ValidationFailed(f"Uncertainty method “{method}” is not supported by this engine.",
                               code="UNSUPPORTED_RULE_VALUE", details={"rule_key": "uncertainty_method"})
    conf = float(rules.require("uncertainty_confidence"))
    npr = float(rules.require("non_permanence_risk_pct"))

    carbon_lost = net_before <= 0
    t_value: float | None = None
    if not carbon_lost:
        if df_eff <= 0:
            raise RuleMissing("The degrees of freedom for the uncertainty deduction could not be determined.",
                              details={"rule_key": "degrees_of_freedom"})
        t_value = float(stats.t.ppf(conf, df_eff))
        deduction = t_value * se
        net_after = net_before - deduction
        buffer = net_after * npr / 100.0 if net_after > 0 else 0.0
        credits = net_after - buffer
        d_wp = dsoc
        split = split_reductions_removals(
            d_wp=d_wp, d_bsl=tv["baseline_scenario"], baseline_emissions=tv["baseline_emissions"],
            project_emissions=tv["project_emissions"], leakage=tv["leakage"], deduction=deduction, buffer=buffer,
            cumulative_stock_change=(d_wp if inp.cumulative_project_stock_change_t_co2e is None
                                     else inp.cumulative_project_stock_change_t_co2e),
        )
        reductions, removals = split["reductions_t_co2e"], split["removals_t_co2e"]
        if abs(reductions + removals - credits) > 1e-6 * max(1.0, abs(credits)):
            raise AssertionError("Reductions and removals do not add up to the credited total.")
    else:
        deduction = 0.0
        net_after = net_before
        buffer = 0.0
        credits = net_before
        reductions, removals = credits, 0.0
        split = {"reductions_t_co2e": reductions, "removals_t_co2e": removals, "unsplit": 1.0}

    flags = {
        "carbon_lost": carbon_lost,
        "high_uncertainty": (not carbon_lost) and net_before > 0 and deduction / net_before > high_uncertainty_ratio,
        "controls_used": controls_used,
        "unpaired_sites_excluded": any(r.excluded_sites for r in results) or any(
            c.excluded_sites for c in controls.values()),
        "net_after_uncertainty_not_positive": net_after <= 0,
    }
    return CalculationResult(
        stock_method=stock_method, design=inp.design, strata=tuple(results),
        control_strata=tuple(controls[k] for k in sorted(controls)), controls_used=controls_used,
        dsoc_t_c=dsoc_c, dsoc_variance_t_c=var_c, dsoc_t_co2e=dsoc, dsoc_variance_t_co2e=var_dsoc,
        terms=tuple(terms[k] for k in ENGINE_TERMS), gross_t_co2e=gross, net_before_uncertainty_t_co2e=net_before,
        total_variance=total_var, se_t_co2e=se, df_effective=df_eff, confidence=conf, t_value=t_value,
        uncertainty_deduction_t_co2e=deduction, net_after_uncertainty_t_co2e=net_after,
        non_permanence_risk_pct=npr, buffer_t_co2e=buffer, credits_t_co2e=credits,
        reductions_t_co2e=reductions, removals_t_co2e=removals, split=split, flags=flags,
        rules_snapshot=rules.snapshot(),
    )


def input_to_dict(inp: EngineInput) -> dict[str, Any]:
    """Plain-JSON form of the engine input (for snapshots and hashing)."""
    d = asdict(inp)
    d["terms"] = {k: asdict(v) for k, v in sorted(inp.terms.items())}
    return _jsonable(d)
