"""VM0042 v2.2 quantification engine (Verra, 21 Oct 2025) — pure functions, frozen dataclasses.

No database, no clock, no randomness: the same inputs and rule set always give the same result.
Only physical constants live here (44/12, 44/28 via the emissions module, π). Every methodology
value comes from the approved rule set through ``RuleSet.require`` (fail closed). Equation
numbers refer to VM0042 v2.2 as extracted in docs/VM0042_v2.2_REQUIREMENTS.md.

Pipeline
--------
1. Layer mass & SOC (§8.2.1.6)
   * Eq. 3 when the sample carries fine-soil mass (g), probe inner diameter (mm) and cores composited:
     ``M(t/ha) = M_sample / (π (D/2)² N) × 10 000`` and ``SOC(t C/ha) = M × OC(g/kg) / 1000``.
   * otherwise the bulk-density mass correction: ``M = BD × thickness × 100 × (1 − coarse)``.
2. Equivalent soil mass (§8.2.1.3(7), §8.2.1.6). For every project stratum and its control
   stratum the reference mass is the highest cumulative fine-soil mass to the reporting depth
   (≥ 30 cm) among all compared samples (both campaigns). Each sample's SOC is read off its
   cumulative SOC–mass curve at that mass. Interpolation follows the ``esm_interpolation`` rule:
   ``pchip`` (monotone piecewise-cubic Hermite, the shape-preserving form of Wendt & Hauser's cubic
   spline — cumulative SOC can never decrease with mass, which a natural cubic spline can violate),
   ``cubic_spline`` (natural cubic spline, Wendt & Hauser 2013) or ``linear``. Extrapolation is
   refused; a shallow (bedrock) sample flagged in the field is reported to its sampled depth.
   ``fixed_depth_with_mass_correction`` applies the Ellert & Bettany single-layer correction instead
   (mass added at the concentration of the layer at the reporting depth) and is flagged.
3. Stratum change, QA2 (§8.6.2.1): Eq. 71 ``s²_ΔSOC,wp,h = s²_f + s²_s − 2 COV(f,s)`` (paired points;
   independent designs have no covariance), controls add ``s²_bsl,h`` without covariance (Eq. 70),
   area-weighted with the project stratum area.
4. Eq. 46/47 ``ΔCO2_soil = Σ_i (SOC_i,t − SOC_i,t−x) / x × A_i × 44/12`` (annualised by the
   measurement interval x; the period is credited ``rate × min(period, x)`` so a period longer than
   the interval is never credited more than was measured). Biochar organic carbon is subtracted
   from the project change (§4 cond. 7).
5. Eq. 74 ``UNC = √s²_mean / |mean| × t_(conf, df)`` (df by Welch–Satterthwaite across strata),
   applied per source: Eq. 44/45 multiplier ``(1 − UNC × I_soil)`` on both soil changes; CH4/N2O soil
   fluxes only when QA1-modelled (Eq. 37).
6. Emission reductions ΣΔE from the emissions module (QA3, Eq. 6–32, 52–59), plus approved
   ``TermEstimate`` values (QA1 model outputs, legacy aggregates), each tagged with its source.
7. Leakage: Eq. 33 organic amendments (emissions module) + LE_BR + LK_disp (+ legacy leakage term),
   allocated with Eq. 39/42.
8. Per vintage (calendar year): Eq. 37 ER, Eq. 40 CR, Eq. 38/41/43 nets, Eq. 75/76 buffer (stock
   changes only), Eq. 77–79 VCUs. Negative results are never floored.
"""

from __future__ import annotations

import math
from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass, field, replace
from datetime import date
from typing import Any

import numpy as np
from scipy import stats
from scipy.interpolate import CubicSpline, PchipInterpolator

from app.core.errors import Blocked, RuleMissing, ValidationFailed
from app.modules.calculation import multistage as appendix6
from app.modules.emissions import domain as em
from app.modules.methodology.ruleset import RuleSet

CO2_PER_C: float = 44.0 / 12.0
STOCK_METHODS = ("esm", "fixed_depth_with_mass_correction")

# Approved TermEstimate kinds the engine understands (keep in sync with calculation.models.TERMS).
ENGINE_TERMS: tuple[str, ...] = (
    "baseline_scenario",  # ΔCO2_soil,bsl from a model (QA1) or QA2 without control sites — MODELLED
    "project_emissions",  # legacy aggregate project emissions (t CO2e) — subtracted in ΣΔE
    "baseline_emissions",  # legacy aggregate baseline emissions (t CO2e) — added in ΣΔE
    "leakage",  # legacy / other leakage (t CO2e), allocated by Eq. 39/42
    "soc_project_modelled",  # ΔCO2_soil,wp from a QA1 model (Eq. 45) — MODELLED
    "ch4_soil",  # ΔCH4_soil reduction from a QA1 model (Eq. 10, 37) — MODELLED
    "n2o_soil",  # ΔN2O_soil reduction from a QA1 model (Eq. 15, 37) — MODELLED
    "leakage_biomass_residues",  # LE_BR (CDM TOOL16, §8.4.4)
    "leakage_displacement",  # LK_disp (VMD0054 Eq. 36, §8.4.2–8.4.3)
    "woody_biomass_project",  # ΔC_TREE,wp + ΔC_SHRUB,wp (Eq. 45, 48–51)
    "woody_biomass_baseline",  # ΔC_TREE,bsl + ΔC_SHRUB,bsl (Eq. 44, 48–51)
)
MODELLED_TERMS = ("baseline_scenario", "soc_project_modelled", "ch4_soil", "n2o_soil")
LEGACY_TERMS = ("project_emissions", "baseline_emissions", "leakage")
_TOL = 1e-6


# =============================================================== inputs
@dataclass(frozen=True)
class Layer:
    """One depth increment of a sample with its accepted lab values."""

    code: str
    depth_from_cm: float
    depth_to_cm: float
    bulk_density_g_cm3: float | None
    soc_pct: float
    coarse_fraction: float | None = None
    fine_soil_mass_g: float | None = None  # Eq. 3: oven-dry < 2 mm mass of the composited increment


@dataclass(frozen=True)
class Point:
    """One (composite) sample at a permanent point in one campaign."""

    site_id: str
    layers: tuple[Layer, ...]
    sample_code: str = ""
    probe_diameter_mm: float | None = None  # Eq. 3 D
    cores_composited: int | None = None  # Eq. 3 N
    shallow: bool = False  # stopped by bedrock/hardpan with a documented reason and the rule allowing it


@dataclass(frozen=True)
class StratumData:
    code: str
    area_ha: float
    baseline: tuple[Point, ...]
    monitoring: tuple[Point, ...]
    role: str = "project"  # project | control
    control_for_code: str | None = None
    quantification_unit: str | None = None


@dataclass(frozen=True)
class Term:
    """An approved TermEstimate in t CO2e for the period, with its variance and degrees of freedom."""

    value_t_co2e: float
    variance: float = 0.0
    df: float | None = None
    source: str = ""


@dataclass(frozen=True)
class Vintage:
    year: int
    weight: float  # share of the calendar year inside the period (0 < w ≤ 1)


@dataclass(frozen=True)
class EngineInput:
    design: str  # paired | independent
    strata: tuple[StratumData, ...]
    terms: Mapping[str, Term] = field(default_factory=dict)
    measurement_interval_years: float | None = None  # x in Eq. 46/47
    vintages: tuple[Vintage, ...] = ()
    emissions: em.EmissionsInput | None = None
    # Σ ΔCO2_wp credited in earlier periods (for the indicator I of Eq. 37/40/75/76).
    prior_cumulative_stock_change_t_co2e: float = 0.0
    # VM0042 v2.2 Appendix 6 multi-stage design; None = stratified random sampling (Eq. 70–71).
    multistage: appendix6.MultiStageDesign | None = None


# =============================================================== outputs
@dataclass(frozen=True)
class LayerStock:
    code: str
    depth_from_cm: float
    depth_to_cm: float
    fine_mass_t_ha: float
    stock_t_c_ha: float
    mass_method: str  # eq3 | bulk_density


@dataclass(frozen=True)
class PointStock:
    site_id: str
    sample_code: str
    method: str
    stock_t_c_ha: float
    fine_mass_t_ha: float  # soil mass the stock refers to (the reference mass unless shallow)
    mass_to_depth_t_ha: float | None
    reference_mass_t_ha: float
    reported_to_sampled_depth: bool
    extrapolated: bool
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
    measured_variance: float  # variance of the mean change (t C/ha)²
    measured_df: float
    delta_t_c_ha: float  # project minus control (equals measured when no control)
    variance: float  # (t C/ha)²
    se: float
    df: float
    reference_mass_t_ha: float
    s2_f: float  # Eq. 71, (t C)², scaled by A_h²
    s2_s: float
    cov_fs: float
    s2_wp: float  # Eq. 71
    s2_bsl: float  # control-site variance (Eq. 70), 0 when no control
    s2_dsoc: float  # Eq. 70 s²_ΔSOC,h
    annual_delta_t_c_ha: float | None = None
    quantification_unit: str | None = None
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
    status: str  # supplied | not_required_by_rules | measured_at_control_sites | not_supplied | not_applicable
    data_class: str = "CALCULATED"
    used_as: str = ""


@dataclass(frozen=True)
class CalculationResult:
    stock_method: str
    design: str
    soc_approach: str
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
    soc: dict[str, Any]
    emissions: dict[str, Any]
    leakage: dict[str, Any]
    uncertainty: dict[str, Any]
    vintages: tuple[dict[str, Any], ...]
    equations: tuple[dict[str, Any], ...]
    de_minimis: dict[str, Any]
    warnings: tuple[str, ...]
    rules_snapshot: dict[str, Any]

    def to_dict(self) -> dict[str, Any]:
        return _jsonable(asdict(self))


def _jsonable(v: Any) -> Any:
    if isinstance(v, dict):
        return {str(k): _jsonable(x) for k, x in v.items()}
    if isinstance(v, (list, tuple)):
        return [_jsonable(x) for x in v]
    if isinstance(v, np.floating):
        return float(v)
    if isinstance(v, np.integer):
        return int(v)
    if isinstance(v, np.bool_):
        return bool(v)
    if isinstance(v, float) and (math.isinf(v) or math.isnan(v)):
        return None
    return v


# =============================================================== helpers
def welch_df(components: Sequence[tuple[float, float | None]]) -> float:
    """Welch–Satterthwaite effective degrees of freedom for a sum of independent variances.

    ``components`` are ``(variance, df)`` pairs. When every variance is zero the answer is the
    smallest df (conservative). A component with variance but no usable df gives 0 (missing)."""
    if not components:
        return 0.0
    total = sum(v for v, _ in components)
    if total <= 0:
        return float(min((d for _, d in components if d is not None), default=0.0))
    denom = 0.0
    for v, d in components:
        if v <= 0:
            continue
        if d is None or d <= 0:
            return 0.0
        denom += v * v / d
    return float(total * total / denom) if denom > 0 else 0.0


def t_one_sided(confidence: float, df: float) -> float:
    """One-sided Student t at ``confidence`` (Eq. 74; ≈ 0.4316 at 66.7 % and large df)."""
    return float(stats.t.ppf(confidence, df))


def vintages_for(start: date, end: date) -> tuple[Vintage, ...]:
    """Calendar-year shares of an inclusive period (per-year results, §8.1)."""
    if end < start:
        raise ValidationFailed("The period must end after it starts.", code="INVALID_PERIOD")
    out = []
    for y in range(start.year, end.year + 1):
        a, b = max(start, date(y, 1, 1)), min(end, date(y, 12, 31))
        days_in_year = (date(y, 12, 31) - date(y, 1, 1)).days + 1
        out.append(Vintage(y, round(((b - a).days + 1) / days_in_year, 10)))
    return tuple(out)


def eq3_fine_soil_mass_t_ha(sample_mass_g: float, probe_diameter_mm: float, cores: int) -> float:
    """Eq. 3 soil-mass part: M / (π (D/2)² N) in g/mm², × 10 000 → t (Mg)/ha."""
    if sample_mass_g < 0 or probe_diameter_mm <= 0 or cores <= 0:
        raise ValidationFailed("Eq. 3 needs a non-negative sample mass, a probe diameter and at least one core.",
                               code="INVALID_LAYER")
    return sample_mass_g / (math.pi * (probe_diameter_mm / 2.0) ** 2 * cores) * 10_000.0


def eq3_soc_t_ha(fine_mass_t_ha: float, oc_g_kg: float) -> float:
    """Eq. 3: M_SOC = soil mass × OC (g/kg). In t/ha: mass(t/ha) × OC / 1000 (kg/ha ÷ 1000)."""
    return fine_mass_t_ha * oc_g_kg / 1000.0


def layer_stock(layer: Layer, point: Point, rules: RuleSet) -> LayerStock:
    """Fine-soil mass (t/ha) and SOC stock (t C/ha) of one increment (Eq. 3 or mass correction)."""
    thickness = layer.depth_to_cm - layer.depth_from_cm
    if thickness <= 0:
        raise ValidationFailed(f"Layer {layer.code} has a depth range that is empty or reversed.",
                               code="INVALID_LAYER", details={"layer": layer.code})
    if layer.soc_pct is None or layer.soc_pct < 0:
        raise ValidationFailed(f"Layer {layer.code} has no valid SOC value.", code="INVALID_LAYER",
                               details={"layer": layer.code})
    if layer.fine_soil_mass_g is not None and point.probe_diameter_mm and point.cores_composited:
        mass = eq3_fine_soil_mass_t_ha(layer.fine_soil_mass_g, point.probe_diameter_mm, point.cores_composited)
        how = "eq3"
    else:
        if layer.bulk_density_g_cm3 is None or layer.bulk_density_g_cm3 <= 0:
            raise ValidationFailed(
                f"Layer {layer.code} has neither a core soil mass with probe diameter and core count (Eq. 3) nor "
                "a valid bulk density.", code="INVALID_LAYER", details={"layer": layer.code})
        factor = 1.0
        if rules.require("coarse_fragment_correction"):
            cf = layer.coarse_fraction
            if cf is None:
                raise RuleMissing(
                    f"The rules require stones (> 2 mm) to be excluded but layer {layer.code} has no accepted "
                    "coarse-fraction result.", details={"rule_key": "coarse_fraction", "layer": layer.code})
            if not 0 <= cf < 1:
                raise ValidationFailed(f"Coarse fraction for layer {layer.code} must be between 0 and 1.",
                                       code="INVALID_LAYER", details={"layer": layer.code, "value": cf})
            factor = 1.0 - cf
        mass = layer.bulk_density_g_cm3 * thickness * 100.0 * factor
        how = "bulk_density"
    return LayerStock(layer.code, float(layer.depth_from_cm), float(layer.depth_to_cm), float(mass),
                      float(eq3_soc_t_ha(mass, layer.soc_pct * 10.0)), how)


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


@dataclass(frozen=True)
class Profile:
    point: Point
    layers: tuple[LayerStock, ...]
    cum_mass: tuple[float, ...]  # knots, starting at 0
    cum_c: tuple[float, ...]

    @property
    def bottom_cm(self) -> float:
        return self.layers[-1].depth_to_cm

    def to_depth(self, depth: float) -> tuple[float, float] | None:
        """(cumulative mass, cumulative SOC) to ``depth`` (linear within the layer), None if not reached."""
        if depth > self.bottom_cm + _TOL:
            return None
        m = c = 0.0
        for ls in self.layers:
            if ls.depth_from_cm >= depth - _TOL:
                break
            share = min(1.0, (depth - ls.depth_from_cm) / (ls.depth_to_cm - ls.depth_from_cm))
            m += ls.fine_mass_t_ha * share
            c += ls.stock_t_c_ha * share
        return m, c

    def concentration_at(self, depth: float) -> float:
        """SOC per unit soil mass of the layer that contains ``depth`` (Ellert & Bettany correction)."""
        last = next((ls for ls in reversed(self.layers) if ls.depth_from_cm < depth - _TOL), self.layers[0])
        return last.stock_t_c_ha / last.fine_mass_t_ha if last.fine_mass_t_ha > 0 else 0.0


def profile(point: Point, rules: RuleSet) -> Profile:
    layers = tuple(layer_stock(lyr, point, rules) for lyr in _ordered_layers(point))
    cm = tuple(float(x) for x in np.concatenate([[0.0], np.cumsum([s.fine_mass_t_ha for s in layers])]))
    cc = tuple(float(x) for x in np.concatenate([[0.0], np.cumsum([s.stock_t_c_ha for s in layers])]))
    return Profile(point, layers, cm, cc)


def interpolate_esm(cum_mass: Sequence[float], cum_c: Sequence[float], m_ref: float, how: str) -> float:
    """Cumulative SOC at the reference mass (§8.2.1.6). Never extrapolates."""
    xs, ys = np.asarray(cum_mass, float), np.asarray(cum_c, float)
    if m_ref > xs[-1] + _TOL:
        raise ValueError("reference mass beyond the sampled mass")
    m_ref = min(m_ref, xs[-1])
    if how == "linear" or len(xs) < 3:
        return float(np.interp(m_ref, xs, ys))
    if how == "pchip":
        return float(PchipInterpolator(xs, ys)(m_ref))
    if how == "cubic_spline":
        return float(CubicSpline(xs, ys, bc_type="natural")(m_ref))
    raise ValidationFailed(f"Unknown ESM interpolation “{how}”.", code="UNSUPPORTED_RULE_VALUE",
                           details={"rule_key": "esm_interpolation", "value": how})


def reference_mass(profiles: Sequence[Profile], depth: float, rules: RuleSet) -> float:
    """Highest cumulative fine-soil mass to the reporting depth among compared samples (§8.2.1.6)."""
    masses = []
    for p in profiles:
        reached = p.to_depth(depth)
        if reached is None:
            if not p.point.shallow:
                raise Blocked(
                    f"Sample {p.point.sample_code or p.point.site_id} reaches {p.bottom_cm:g} cm but SOC must be "
                    f"reported to at least {depth:g} cm.", code="DEPTH_MISMATCH",
                    details={"sample": p.point.sample_code, "reached_cm": p.bottom_cm, "required_cm": depth})
            continue
        masses.append(reached[0])
    if not masses:
        masses = [p.cum_mass[-1] for p in profiles]
    ref = max(masses) if masses else 0.0
    override = rules.get("esm_reference_mass_t_ha")
    if override is not None:
        ref = max(ref, float(override))
    return float(ref)


def point_stock(prof: Profile, rules: RuleSet, m_ref: float, depth: float) -> PointStock:
    """SOC stock of one sample on an equivalent-soil-mass basis at ``m_ref``."""
    method = rules.require("stock_method")
    p = prof.point
    label = p.sample_code or p.site_id
    reached = prof.to_depth(depth)
    mass_to_depth = reached[0] if reached else None
    shallow_short = p.shallow and prof.cum_mass[-1] + _TOL < m_ref
    if method == "esm":
        how = rules.require("esm_interpolation")
        if prof.cum_mass[-1] + _TOL < m_ref:
            if not p.shallow:
                raise Blocked(
                    f"Sample {label} holds {prof.cum_mass[-1]:.0f} t/ha of fine soil, less than the equivalent-soil-"
                    f"mass reference of {m_ref:.0f} t/ha. Sample deeper (e.g. a 30–50 cm increment) so no "
                    "extrapolation is needed.", code="DEPTH_MISMATCH",
                    details={"sample": p.sample_code, "mass_t_ha": prof.cum_mass[-1], "reference_t_ha": m_ref})
            return PointStock(p.site_id, p.sample_code, method, prof.cum_c[-1], prof.cum_mass[-1], mass_to_depth,
                              m_ref, True, False, prof.layers)
        stock = interpolate_esm(prof.cum_mass, prof.cum_c, m_ref, how)
        return PointStock(p.site_id, p.sample_code, method, stock, m_ref, mass_to_depth, m_ref, False, False,
                          prof.layers)
    if method == "fixed_depth_with_mass_correction":
        if reached is None or shallow_short:
            if not p.shallow:
                raise Blocked(f"Sample {label} does not reach {depth:g} cm.", code="DEPTH_MISMATCH",
                              details={"sample": p.sample_code})
            return PointStock(p.site_id, p.sample_code, method, prof.cum_c[-1], prof.cum_mass[-1], mass_to_depth,
                              m_ref, True, False, prof.layers)
        m_d, c_d = reached
        conc = prof.concentration_at(depth)
        stock = c_d + (m_ref - m_d) * conc  # Ellert & Bettany (1995) single-layer mass correction
        return PointStock(p.site_id, p.sample_code, method, float(stock), m_ref, m_d, m_ref, False,
                          m_ref > m_d + _TOL, prof.layers)
    if method == "fixed_depth":
        raise ValidationFailed(
            "Plain fixed-depth stocks are not allowed by VM0042 v2.2 §8.2.1.3(7): use equivalent soil mass, or "
            "fixed depth with a mass correction. Create a new revision of the rule pack.",
            code="UNSUPPORTED_RULE_VALUE", details={"rule_key": "stock_method", "value": method})
    raise ValidationFailed(f"Unknown stock method “{method}” in the rules.", code="UNSUPPORTED_RULE_VALUE",
                           details={"rule_key": "stock_method", "value": method})


def _index(points: Sequence[PointStock], stratum: str, campaign: str) -> dict[str, PointStock]:
    out: dict[str, PointStock] = {}
    for p in points:
        if p.site_id in out:
            raise ValidationFailed(f"Site {p.site_id} was sampled twice in the {campaign} campaign of zone {stratum}.",
                                   code="DUPLICATE_SITE", details={"stratum": stratum, "site_id": p.site_id})
        out[p.site_id] = p
    return out


def _insufficient(stratum: str, what: str, n: int, need: int) -> Blocked:
    return Blocked(
        f"Zone {stratum} has only {n} usable {what}; VM0042 needs at least {need} composite samples per stratum.",
        code="INSUFFICIENT_SAMPLES", details={"stratum": stratum, "n": n, "what": what, "required": need},
    )


def eq71_variance(base: Sequence[float], mon: Sequence[float], area_ha: float, paired: bool) -> dict[str, float]:
    """Eq. 71: s²_f and s²_s = A²/(n(n−1)) Σ(x − x̄)², COV = A²/(n(n−1)) Σ(s − s̄)(f − f̄) (paired only);
    s²_ΔSOC,wp,h = s²_f + s²_s − 2 COV. Values in (t C)² for the stratum."""
    b, m = np.asarray(base, float), np.asarray(mon, float)
    a2 = area_ha**2
    nb, nm = len(b), len(m)
    s2_s = a2 / (nb * (nb - 1)) * float(np.sum((b - b.mean()) ** 2))
    s2_f = a2 / (nm * (nm - 1)) * float(np.sum((m - m.mean()) ** 2))
    cov = a2 / (nb * (nb - 1)) * float(np.sum((b - b.mean()) * (m - m.mean()))) if paired else 0.0
    return {"s2_f": s2_f, "s2_s": s2_s, "cov": cov, "s2_wp": s2_f + s2_s - 2.0 * cov}


def stratum_change(s: StratumData, design: str, rules: RuleSet, m_ref: float, depth: float,
                   variance_area_ha: float | None = None) -> StratumResult:
    """Mean SOC change (t C/ha over the measurement interval) and Eq. 71 variance for one stratum."""
    area_v = float(variance_area_ha if variance_area_ha is not None else s.area_ha)
    need = int(rules.require("min_composites_per_stratum"))
    base = [point_stock(profile(p, rules), rules, m_ref, depth) for p in s.baseline]
    mon = [point_stock(profile(p, rules), rules, m_ref, depth) for p in s.monitoring]
    b_idx, m_idx = _index(base, s.code, "baseline"), _index(mon, s.code, "monitoring")

    if design == "paired":
        policy = rules.require("unpaired_points_policy")
        paired = sorted(set(b_idx) & set(m_idx))
        unpaired = sorted(set(b_idx) ^ set(m_idx))
        if unpaired and policy == "block":
            raise Blocked(
                f"Zone {s.code} has {len(unpaired)} site(s) sampled in only one campaign, and the rules say "
                "unpaired sites block the calculation.", code="UNPAIRED_POINTS",
                details={"stratum": s.code, "sites": unpaired})
        if unpaired and policy != "exclude_and_report":
            raise ValidationFailed(f"Unknown unpaired-points policy “{policy}”.", code="UNSUPPORTED_RULE_VALUE",
                                   details={"rule_key": "unpaired_points_policy", "value": policy})
        n = len(paired)
        if n < max(2, need):
            raise _insufficient(s.code, "paired sites", n, max(2, need))
        b = [b_idx[k].stock_t_c_ha for k in paired]
        m = [m_idx[k].stock_t_c_ha for k in paired]
        v = eq71_variance(b, m, area_v, paired=True)
        df = float(n - 1)
        excluded, n_used = tuple(unpaired), n
    elif design == "independent":
        for what, pts in (("baseline samples", base), ("monitoring samples", mon)):
            if len(pts) < max(2, need):
                raise _insufficient(s.code, what, len(pts), max(2, need))
        b = [p.stock_t_c_ha for p in sorted(base, key=lambda x: x.site_id)]
        m = [p.stock_t_c_ha for p in sorted(mon, key=lambda x: x.site_id)]
        v = eq71_variance(b, m, area_v, paired=False)
        df = welch_df([(v["s2_s"], len(b) - 1), (v["s2_f"], len(m) - 1)])
        excluded, n_used = (), len(b) + len(m)
    else:
        raise ValidationFailed(f"Unknown monitoring design “{design}”.", code="UNSUPPORTED_DESIGN",
                               details={"design": design})
    mean_b, mean_m = float(np.mean(b)), float(np.mean(m))
    delta = mean_m - mean_b
    var_ha = v["s2_wp"] / area_v**2
    return StratumResult(
        code=s.code, role=s.role, area_ha=float(s.area_ha), design=design, n_baseline=len(base),
        n_monitoring=len(mon), n_used=n_used, mean_baseline_t_c_ha=mean_b, mean_monitoring_t_c_ha=mean_m,
        measured_delta_t_c_ha=delta, measured_variance=var_ha, measured_df=df, delta_t_c_ha=delta,
        variance=var_ha, se=math.sqrt(max(var_ha, 0.0)), df=df, reference_mass_t_ha=m_ref,
        s2_f=v["s2_f"], s2_s=v["s2_s"], cov_fs=v["cov"], s2_wp=v["s2_wp"], s2_bsl=0.0, s2_dsoc=v["s2_wp"],
        quantification_unit=s.quantification_unit, excluded_sites=excluded,
        baseline_points=tuple(sorted(base, key=lambda x: x.site_id)),
        monitoring_points=tuple(sorted(mon, key=lambda x: x.site_id)),
    )


def net_against_control(project: StratumResult, control: StratumResult) -> StratumResult:
    """Eq. 70: s²_ΔSOC,h = s²_wp,h + s²_bsl,h (project/control covariance excluded — independent)."""
    s2 = project.s2_wp + control.s2_wp
    var_ha = s2 / project.area_ha**2
    df = welch_df([(project.s2_wp, project.measured_df), (control.s2_wp, control.measured_df)])
    return replace(project, delta_t_c_ha=project.measured_delta_t_c_ha - control.measured_delta_t_c_ha,
                   variance=var_ha, se=math.sqrt(max(var_ha, 0.0)), df=df, s2_bsl=control.s2_wp, s2_dsoc=s2,
                   control_code=control.code, control_delta_t_c_ha=control.measured_delta_t_c_ha,
                   control_variance=control.measured_variance)


def _check_design(design: str, rules: RuleSet) -> None:
    allowed = rules.require("sampling_design")
    if allowed not in ("either", design):
        raise Blocked(
            f"The monitoring campaign uses a {design} design but the rules allow only {allowed}.",
            code="DESIGN_NOT_PERMITTED", details={"rule_key": "sampling_design", "allowed": allowed, "design": design},
        )


# =============================================================== VM0042 net equations (pure)
def eq37_er(sum_de: float, d_wp: float, d_bsl: float, indicator: float) -> float:
    """Eq. 37 emission reductions for one year."""
    losses = min(0.0, d_wp) - min(0.0, d_bsl)
    gains = max(0.0, d_wp) - max(0.0, d_bsl)
    return indicator * (sum_de + losses) + (1.0 - indicator) * (sum_de + losses + gains)


def eq40_cr(d_wp: float, d_bsl: float, indicator: float) -> float:
    """Eq. 40 carbon removals for one year."""
    return indicator * (max(0.0, d_wp) - max(0.0, d_bsl))


def eq39_42_allocate(leakage: float, er: float, cr: float) -> tuple[float, float]:
    """Eq. 39/42: LK_ER = LK × ER/(ER+CR), LK_CR = LK × CR/(ER+CR).

    When ER or CR is negative the shares use their positive parts; when neither is positive the whole
    leakage is charged to reductions (it can never vanish)."""
    if leakage == 0:
        return 0.0, 0.0
    if er >= 0 and cr >= 0 and er + cr > 0:
        return leakage * er / (er + cr), leakage * cr / (er + cr)
    pe, pc = max(0.0, er), max(0.0, cr)
    if pe + pc <= 0:
        return leakage, 0.0
    return leakage * pe / (pe + pc), leakage * pc / (pe + pc)


def eq75_buffer_er(d_wp: float, d_bsl: float, indicator: float, npr_pct: float) -> float:
    """Eq. 75 buffer on reductions: stock-change part only (never on ΣΔE)."""
    losses = min(0.0, d_wp) - min(0.0, d_bsl)
    gains = max(0.0, d_wp) - max(0.0, d_bsl)
    return (indicator * losses + (1.0 - indicator) * (losses + gains)) * npr_pct / 100.0


def eq76_buffer_cr(d_wp: float, d_bsl: float, indicator: float, npr_pct: float) -> float:
    """Eq. 76 buffer on removals."""
    return indicator * (max(0.0, d_wp) - max(0.0, d_bsl)) * npr_pct / 100.0


def eq44_45_multiplier(unc: float, i_soil: int) -> float:
    """Eq. 44/45 factor (1 − UNC × I_soil); I_soil = +1 when the project does at least as well as the baseline."""
    return 1.0 - unc * i_soil


def eq74_unc(s2_mean: float, mean: float, t_value: float) -> float:
    """Eq. 74 as a fraction: √s²_mean / |mean| × t. Zero when the mean change is zero."""
    if mean == 0 or s2_mean <= 0:
        return 0.0
    return math.sqrt(s2_mean) / abs(mean) * t_value


def _sign_aware(value: float, unc: float) -> float:
    """Eq. 37 (1 − UNC) on a modelled flux reduction; for a negative reduction (project emits more) the
    factor is (1 + UNC) so uncertainty can only make the result more conservative."""
    return value * (1.0 - unc) if value >= 0 else value * (1.0 + unc)


# =============================================================== main entry
class _Trail:
    def __init__(self) -> None:
        self.rows: list[dict[str, Any]] = []

    def __call__(self, eq: str, label: str, value: float | None, unit: str) -> None:
        self.rows.append({"eq": eq, "label": label, "value": None if value is None else float(value), "unit": unit})


def _term(inp: EngineInput, key: str) -> Term | None:
    t = inp.terms.get(key)
    if t is not None and t.variance < 0:
        raise ValidationFailed(f"The variance of {key} can't be negative.", code="INVALID_TERM", details={"term": key})
    return t


def _term_unc(terms: Sequence[tuple[str, Term]], conf: float) -> tuple[float, float, float | None, float | None]:
    """(value, variance, df, t) for a sum of approved terms; RuleMissing when variance lacks df."""
    value = sum(t.value_t_co2e for _, t in terms)
    var = sum(t.variance for _, t in terms)
    comps = []
    for k, t in terms:
        if t.variance > 0 and (t.df is None or t.df <= 0):
            raise RuleMissing(f"The approved estimate “{k.replace('_', ' ')}” has a variance but no degrees of "
                              "freedom, so its uncertainty deduction (Eq. 74) can't be computed.",
                              details={"rule_key": "degrees_of_freedom", "term": k})
        comps.append((t.variance, t.df))
    if var <= 0:
        return value, 0.0, None, None
    df = welch_df(comps)
    return value, var, df, t_one_sided(conf, df)


def calculate(inp: EngineInput, rules: RuleSet, *, high_uncertainty_ratio: float = 0.15) -> CalculationResult:
    """Run the full VM0042 v2.2 quantification. Raises ``RuleMissing`` / ``Blocked`` / ``ValidationFailed``
    rather than assume anything. ``high_uncertainty_ratio`` only sets a review flag."""
    eqs = _Trail()
    warnings: list[str] = []
    stock_method = rules.require("stock_method")
    if stock_method == "fixed_depth":
        raise ValidationFailed(
            "Plain fixed-depth stocks are not allowed by VM0042 v2.2 §8.2.1.3(7): use equivalent soil mass, or "
            "fixed depth with a mass correction. Create a new revision of the rule pack.",
            code="UNSUPPORTED_RULE_VALUE", details={"rule_key": "stock_method", "value": stock_method})
    if stock_method not in STOCK_METHODS:
        raise ValidationFailed(f"Unknown stock method “{stock_method}” in the rules.", code="UNSUPPORTED_RULE_VALUE",
                               details={"rule_key": "stock_method", "value": stock_method})
    if stock_method == "fixed_depth_with_mass_correction":
        warnings.append("Fixed-depth sampling with a mass correction is accepted with a warning; VM0042 prefers "
                        "equivalent soil mass from ≥ 2 increments (§8.2.1.3(7)).")
    soc_approach = rules.require("qa_soc")
    method = rules.require("uncertainty_method")
    if method != "vm0042_eq74":
        raise ValidationFailed(f"Uncertainty method “{method}” is not supported by this engine.",
                               code="UNSUPPORTED_RULE_VALUE", details={"rule_key": "uncertainty_method"})
    conf = float(rules.require("uncertainty_confidence"))
    npr = float(rules.require("non_permanence_risk_pct"))
    unknown = sorted(set(inp.terms) - set(ENGINE_TERMS))
    if unknown:
        raise ValidationFailed("Unknown project terms were supplied.", code="UNKNOWN_TERM", details={"terms": unknown})

    vint = tuple(sorted(inp.vintages, key=lambda v: v.year))
    if not vint:
        raise ValidationFailed("The calculation needs the calendar years (vintages) of the period.",
                               code="INVALID_PERIOD")
    if len({v.year for v in vint}) != len(vint) or any(not 0 < v.weight <= 1 for v in vint):
        raise ValidationFailed("Each vintage year must appear once with a share between 0 and 1.",
                               code="INVALID_PERIOD")
    period_years = float(sum(v.weight for v in vint))
    share = {v.year: v.weight / period_years for v in vint}

    term_rows: dict[str, TermResult] = {}

    # ------------------------------------------------------------ SOC (Eq. 3, ESM, 44–47, 70–74)
    project_in = [s for s in inp.strata if s.role == "project"]
    control_in = [s for s in inp.strata if s.role == "control"]
    bad_roles = sorted({s.role for s in inp.strata} - {"project", "control"})
    if bad_roles:
        raise ValidationFailed("Zones must have the role project or control.", code="INVALID_STRATUM",
                               details={"roles": bad_roles})
    codes = [s.code for s in inp.strata]
    if len(codes) != len(set(codes)):
        raise ValidationFailed("Zone codes must be unique.", code="INVALID_STRATUM")
    results: list[StratumResult] = []
    control_results: list[StratumResult] = []
    controls_used = bool(control_in)
    soc_s2_c = 0.0  # Σ_h s²_ΔSOC,h (t C)²
    soc_df_components: list[tuple[float, float]] = []
    x = inp.measurement_interval_years
    bsl_term = _term(inp, "baseline_scenario")
    wp_term = _term(inp, "soc_project_modelled")
    soc_unc = 0.0
    soc_t: float | None = None
    soc_df = 0.0
    soc_source = ""
    ms: appendix6.EngineQA2 | None = None  # Appendix 6 estimators, when the run's design is multi-stage
    depth = float(rules.require("stock_depth_cm"))
    total_area = float(sum(s.area_ha for s in project_in))

    if soc_approach == "qa2":
        _check_design(inp.design, rules)
        if not project_in:
            raise Blocked("There are no project zones to calculate.", code="NO_STRATA")
        for s in project_in:
            if s.area_ha is None or s.area_ha <= 0:
                raise ValidationFailed(f"Zone {s.code} has no area.", code="INVALID_STRATUM",
                                       details={"stratum": s.code})
        if x is None or x <= 0:
            raise ValidationFailed("The time between the two measurements is unknown, so the SOC change can't be "
                                   "annualised (Eq. 46/47).", code="INVALID_PERIOD")
        max_years = float(rules.require("remeasure_max_years"))
        if x > max_years + 1.0 / 365.0:
            raise Blocked(f"The two SOC measurements are {x:.2f} years apart; VM0042 requires re-measurement at "
                          f"least every {max_years:g} years.", code="REMEASUREMENT_OVERDUE",
                          details={"rule_key": "remeasure_max_years", "years": round(x, 3)})
        by_target: dict[str, StratumData] = {}
        for c in control_in:
            if not c.control_for_code:
                raise ValidationFailed(f"Control zone {c.code} doesn't say which project zone it controls.",
                                       code="INVALID_STRATUM", details={"stratum": c.code})
            if c.control_for_code in by_target:
                raise ValidationFailed(f"Project zone {c.control_for_code} has more than one control zone.",
                                       code="INVALID_STRATUM", details={"stratum": c.control_for_code})
            by_target[c.control_for_code] = c
        orphan = sorted(set(by_target) - {s.code for s in project_in})
        if orphan:
            raise ValidationFailed("A control zone points to a project zone that doesn't exist.",
                                   code="INVALID_STRATUM", details={"control_for": orphan})
        if controls_used and bsl_term is not None:
            raise ValidationFailed(
                "The baseline SOC change is already measured at the control sites. Supplying it as a separate "
                "term would count it twice.", code="DOUBLE_COUNTING", details={"term": "baseline_scenario"})
        for s in sorted(project_in, key=lambda z: z.code):
            ctrl = by_target.get(s.code)
            if controls_used and ctrl is None:
                raise RuleMissing(f"Control sites are in use but project zone {s.code} has no control zone "
                                  "(VM0042 §8.2: at least one control site per stratum).",
                                  details={"rule_key": "control_site", "stratum": s.code})
            if inp.multistage is not None and ctrl is None and not s.baseline and not s.monitoring:
                continue  # Appendix 6: a stratum with no selected field has no points; the design weights carry it
            group = [*s.baseline, *s.monitoring, *((ctrl.baseline + ctrl.monitoring) if ctrl else ())]
            m_ref = reference_mass([profile(p, rules) for p in group], depth, rules)
            r = stratum_change(s, inp.design, rules, m_ref, depth)
            if ctrl is not None:
                c_res = stratum_change(ctrl, inp.design, rules, m_ref, depth, variance_area_ha=s.area_ha)
                control_results.append(replace(c_res, annual_delta_t_c_ha=c_res.measured_delta_t_c_ha / x))
                r = net_against_control(r, c_res)
            r = replace(r, annual_delta_t_c_ha=r.delta_t_c_ha / x)
            results.append(r)
            soc_s2_c += r.s2_dsoc
            soc_df_components.append((r.s2_dsoc, r.df))
            if inp.multistage is None:
                eqs("Eq. 71", f"s²_ΔSOC,wp stratum {s.code} (with covariance)", r.s2_wp, "(t C)²")
            if ctrl is not None:
                eqs("Eq. 70", f"s²_bsl control {ctrl.code} for stratum {s.code}", r.s2_bsl, "(t C)²")
        if inp.multistage is not None:  # Appendix 6 (Eq. A6.8–A6.9) replaces the stratified Eq. 70–71 totals
            ms = appendix6.engine_qa2(inp.multistage, results, control_results, inp.design == "paired")
            total_area, soc_s2_c, soc_df_components = ms.area_ha, ms.s2_total_t_c, list(ms.df_components)
            for row in ms.equations:
                eqs(*row)
        credited_years = min(period_years, x)
        k = credited_years / x
        wp_annual = sum(r.measured_delta_t_c_ha / x * r.area_ha for r in results) * CO2_PER_C
        bsl_annual = sum((r.control_delta_t_c_ha or 0.0) / x * r.area_ha for r in results) * CO2_PER_C
        if ms is not None:
            wp_annual, bsl_annual = ms.wp_delta_t_c / x * CO2_PER_C, ms.bsl_delta_t_c / x * CO2_PER_C
        soil_wp = wp_annual * credited_years
        eqs("Eq. 47", "ΔCO2_soil,wp annualised (project strata)", wp_annual, "t CO2e/yr")
        if controls_used:
            soil_bsl = bsl_annual * credited_years
            soc_source = "measured_at_control_sites"
            eqs("Eq. 46", "ΔCO2_soil,bsl annualised (control sites)", bsl_annual, "t CO2e/yr")
            term_rows["baseline_scenario"] = TermResult("baseline_scenario", soil_bsl, 0.0, None,
                                                        "measured_at_control_sites", "measured_at_control_sites",
                                                        "MEASURED", "ΔCO2_soil,bsl")
        else:
            if not rules.require("baseline_scenario_required"):
                raise Blocked(
                    "QA2 measures the baseline at control sites (VM0042 §8.2), but this project has no control "
                    "zones and the rules don't allow a modelled baseline instead.", code="CONTROL_SITES_REQUIRED",
                    details={"rule_key": "baseline_scenario_required"})
            if bsl_term is None:
                raise RuleMissing("The rules require a modelled baseline SOC change, but no approved estimate "
                                  "exists for this period.", details={"rule_key": "baseline_scenario",
                                                                      "term": "baseline_scenario"})
            if not rules.require("modelled_soc_permitted"):
                raise Blocked("The baseline SOC change would come from a model, but the rules don't allow crediting "
                              "modelled values.", code="MODELLED_DATA_NOT_PERMITTED",
                              details={"rule_key": "modelled_soc_permitted", "term": "baseline_scenario"})
            soil_bsl = bsl_term.value_t_co2e
            soc_source = "modelled_baseline_term"
            term_rows["baseline_scenario"] = TermResult("baseline_scenario", soil_bsl, bsl_term.variance, bsl_term.df,
                                                        bsl_term.source, "supplied", "MODELLED", "ΔCO2_soil,bsl")
            if bsl_term.variance > 0:
                if bsl_term.df is None:
                    raise RuleMissing("The baseline estimate has a variance but no degrees of freedom.",
                                      details={"rule_key": "degrees_of_freedom", "term": "baseline_scenario"})
                soc_df_components.append((bsl_term.variance / (CO2_PER_C * k) ** 2, bsl_term.df))
        # Eq. 70 (per-ha) and the same in total t CO2e
        mean_c = sum(r.delta_t_c_ha * r.area_ha for r in results) / total_area if (controls_used and ms is None) \
            else (soil_wp - soil_bsl) / (CO2_PER_C * k) / total_area
        s2_mean = soc_s2_c / total_area**2
        if not controls_used and bsl_term is not None:
            s2_mean += bsl_term.variance / (CO2_PER_C * k) ** 2 / total_area**2
        dsoc_c = mean_c * total_area
        dsoc_var_co2 = s2_mean * total_area**2 * (CO2_PER_C * k) ** 2
        soc_df = welch_df(soc_df_components)
        eqs("Eq. 70", "s²_mean (area-weighted, per ha)", s2_mean, "(t C/ha)²")
        eqs("Eq. 46–47", "Mean SOC change project − baseline (interval)", mean_c, "t C/ha")
        if s2_mean > 0:
            if soc_df <= 0:
                raise RuleMissing("The degrees of freedom for the uncertainty deduction could not be determined.",
                                  details={"rule_key": "degrees_of_freedom"})
            soc_t = t_one_sided(conf, soc_df)
        soc_unc = eq74_unc(s2_mean, mean_c, soc_t or 0.0)
    elif soc_approach == "qa1":
        if not rules.require("modelled_soc_permitted"):
            raise Blocked("SOC is quantified with a model (QA1) but the rules don't allow crediting modelled values.",
                          code="MODELLED_DATA_NOT_PERMITTED", details={"rule_key": "modelled_soc_permitted"})
        for key, t in (("soc_project_modelled", wp_term), ("baseline_scenario", bsl_term)):
            if t is None:
                raise RuleMissing(f"QA1 needs an approved “{key.replace('_', ' ')}” model estimate for this period.",
                                  details={"rule_key": key, "term": key})
        soil_wp, soil_bsl = wp_term.value_t_co2e, bsl_term.value_t_co2e
        for key, t, sym in (("soc_project_modelled", wp_term, "ΔCO2_soil,wp"), ("baseline_scenario", bsl_term,
                                                                                  "ΔCO2_soil,bsl")):
            term_rows[key] = TermResult(key, t.value_t_co2e, t.variance, t.df, t.source, "supplied", "MODELLED", sym)
        _, var, soc_df_opt, soc_t = _term_unc([("soc_project_modelled", wp_term), ("baseline_scenario", bsl_term)],
                                              conf)
        soc_df = soc_df_opt or 0.0
        dsoc_var_co2 = var
        s2_mean = var
        mean_c = soil_wp - soil_bsl
        soc_unc = eq74_unc(var, mean_c, soc_t or 0.0)
        dsoc_c = (soil_wp - soil_bsl) / CO2_PER_C
        credited_years = period_years
        soc_source = "qa1_model"
        warnings.append("SOC is modelled (QA1): remeasure SOC at least every 5 years for true-up (§8.6.1.3).")
    else:
        raise ValidationFailed(f"Unknown SOC approach “{soc_approach}”.", code="UNSUPPORTED_RULE_VALUE",
                               details={"rule_key": "qa_soc", "value": soc_approach})
    eqs("Eq. 74", "UNC_CO2 (SOC)", soc_unc * 100.0, "%")
    if soc_unc > 1:
        warnings.append("The SOC uncertainty exceeds 100 % of the mean change; more samples are needed.")

    # ------------------------------------------------------------ emissions module (QA3) & biochar
    emis: em.EmissionsResult | None = None
    if inp.emissions is not None:
        emis = em.quantify(replace(inp.emissions, year_weights={v.year: v.weight for v in vint}), rules)
    else:
        warnings.append("No activity data was supplied: QA3 emission reductions and organic-amendment leakage are "
                        "zero.")
    biochar = emis.biochar_t_co2e if emis else 0.0
    soil_wp_adj = soil_wp - biochar
    if biochar:
        eqs("§4 cond. 7", "Biochar organic carbon subtracted from ΔCO2_soil,wp", biochar, "t CO2e")
    i_soil = 1 if soil_wp_adj - soil_bsl >= 0 else -1
    mult = eq44_45_multiplier(soc_unc, i_soil)
    tree_wp_t, tree_bsl_t = _term(inp, "woody_biomass_project"), _term(inp, "woody_biomass_baseline")
    tree_wp = tree_wp_t.value_t_co2e if tree_wp_t else 0.0
    tree_bsl = tree_bsl_t.value_t_co2e if tree_bsl_t else 0.0
    for key, t, sym in (("woody_biomass_project", tree_wp_t, "ΔC_TREE+SHRUB,wp"),
                        ("woody_biomass_baseline", tree_bsl_t, "ΔC_TREE+SHRUB,bsl")):
        if t is not None:
            term_rows[key] = TermResult(key, t.value_t_co2e, t.variance, t.df, t.source, "supplied", "CALCULATED", sym)
    d_bsl = soil_bsl * mult + tree_bsl  # Eq. 44
    d_wp = soil_wp_adj * mult + tree_wp  # Eq. 45
    eqs("Eq. 45", "ΔCO2_soil,wp (period, before uncertainty)", soil_wp_adj, "t CO2e")
    eqs("Eq. 44", "ΔCO2_soil,bsl (period, before uncertainty)", soil_bsl, "t CO2e")
    eqs("Eq. 44/45", "I_soil", i_soil, "")
    eqs("Eq. 45", "ΔCO2_wp = ΔCO2_soil,wp × (1 − UNC × I_soil) + ΔC_TREE,wp", d_wp, "t CO2e")
    eqs("Eq. 44", "ΔCO2_bsl = ΔCO2_soil,bsl × (1 − UNC × I_soil) + ΔC_TREE,bsl", d_bsl, "t CO2e")

    # ------------------------------------------------------------ QA1 soil fluxes & legacy terms (ΣΔE parts)
    uncertainty: dict[str, Any] = {
        "soc": {"approach": soc_approach,
                "eq": ("App. 6 Eq. A6.8–A6.9, Eq. 74" if ms is not None else
                       "Eq. 60–64 / 65–69, Eq. 74 (QA1 terms)" if soc_approach == "qa1" else "Eq. 70–74"),
                "s2_mean": s2_mean, "mean": mean_c,
                "df": soc_df, "t": soc_t, "unc_pct": soc_unc * 100.0, "i_soil": i_soil, "multiplier": mult,
                "confidence": conf, "source": soc_source},
    }
    extra_de_raw: dict[str, float] = {}
    extra_de_adj: dict[str, float] = {}
    total_var = dsoc_var_co2
    df_components: list[tuple[float, float | None]] = [(dsoc_var_co2, soc_df)] if dsoc_var_co2 > 0 else []

    def modelled_flux(key: str, rule_key: str, label: str) -> None:
        nonlocal total_var
        qa = rules.require(rule_key)
        t = _term(inp, key)
        if qa == "qa1":
            if not rules.require("modelled_soc_permitted"):
                raise Blocked(f"{label} is modelled (QA1) but the rules don't allow crediting modelled values.",
                              code="MODELLED_DATA_NOT_PERMITTED", details={"rule_key": "modelled_soc_permitted",
                                                                           "term": key})
            if t is None:
                raise RuleMissing(f"{label} is quantified with a model (QA1) but no approved estimate exists for "
                                  "this period.", details={"rule_key": key, "term": key})
            value, var, df, tv = _term_unc([(key, t)], conf)
            unc = eq74_unc(var, value, tv or 0.0)
            extra_de_raw[key] = value
            extra_de_adj[key] = _sign_aware(value, unc)
            total_var += var
            if var > 0:
                df_components.append((var, df))
            uncertainty[key] = {"approach": "qa1", "eq": "Eq. 74 / 37", "variance": var, "df": df, "t": tv,
                                "unc_pct": unc * 100.0, "value_t_co2e": value, "after_uncertainty": extra_de_adj[key]}
            term_rows[key] = TermResult(key, value, var, df, t.source, "supplied", "MODELLED", "Δ" + key.upper())
            eqs("Eq. 74", f"UNC {label}", unc * 100.0, "%")
        else:
            if t is not None and key == "ch4_soil":
                warnings.append("An approved soil-CH4 estimate exists but the rules mark soil methanogenesis as not "
                                "applicable; it was not used.")
            if t is not None and key == "n2o_soil":
                raise ValidationFailed("Soil N2O is quantified with default factors (QA3) from activity data; an "
                                       "approved model term would count it twice.", code="DOUBLE_COUNTING",
                                       details={"term": key})
            uncertainty[key] = {"approach": qa, "method": ("conservative emission-factor range (§8.6.3)"
                                                           if qa == "qa3" else "not applicable")}
            term_rows[key] = TermResult(key, 0.0, 0.0, None, "not_applicable" if qa != "qa3" else "qa3_activity_data",
                                        "not_applicable", "CALCULATED", "")

    modelled_flux("ch4_soil", "qa_ch4_soil", "Soil methanogenesis CH4")
    modelled_flux("n2o_soil", "qa_n2o_soil", "Soil N2O")

    legacy_used = False
    legacy_parts: list[tuple[str, Term]] = []
    for key in ("baseline_emissions", "project_emissions"):
        t = _term(inp, key)
        if rules.require(f"{key}_required"):
            if t is None:
                raise RuleMissing(f"The rules require the “{key.replace('_', ' ')}” term, but no approved estimate "
                                  "exists for this period.", details={"rule_key": key, "term": key})
            legacy_parts.append((key, t))
            term_rows[key] = TermResult(key, t.value_t_co2e, t.variance, t.df, t.source, "supplied", "CALCULATED",
                                        "ΣΔE (legacy)")
        else:
            term_rows[key] = TermResult(key, 0.0, 0.0, None, "not_required_by_rules", "not_required_by_rules")
    if legacy_parts:
        legacy_used = True
        be = next((t.value_t_co2e for k, t in legacy_parts if k == "baseline_emissions"), 0.0)
        pe = next((t.value_t_co2e for k, t in legacy_parts if k == "project_emissions"), 0.0)
        signed = [(k, Term(t.value_t_co2e, t.variance, t.df, t.source)) for k, t in legacy_parts]
        _, var, df, tv = _term_unc(signed, conf)
        value = be - pe
        unc = eq74_unc(var, value, tv or 0.0)
        extra_de_raw["legacy_terms"] = value
        extra_de_adj["legacy_terms"] = _sign_aware(value, unc)
        total_var += var
        if var > 0:
            df_components.append((var, df))
        uncertainty["legacy_terms"] = {"approach": "approved_term", "variance": var, "df": df, "t": tv,
                                       "unc_pct": unc * 100.0, "value_t_co2e": value}
        warnings.append("Legacy aggregate emission terms were used in addition to activity data; check they don't "
                        "duplicate QA3 sources.")

    qa3_sources = dict(emis.sources) if emis else {}
    for src, row in qa3_sources.items():
        uncertainty.setdefault("qa3", {})[src] = {"method": "conservative emission-factor range (§8.6.3)",
                                                  "ef_end": row["ef_end"], "unc_pct": 0.0}

    # ------------------------------------------------------------ leakage
    leak_terms: dict[str, float] = {}
    for key in ("leakage_biomass_residues", "leakage_displacement"):
        t = _term(inp, key)
        if t is not None:
            leak_terms[key] = t.value_t_co2e
            term_rows[key] = TermResult(key, t.value_t_co2e, t.variance, t.df, t.source, "supplied", "CALCULATED",
                                        {"leakage_biomass_residues": "LE_BR", "leakage_displacement": "LK_disp"}[key])
    t = _term(inp, "leakage")
    if rules.require("leakage_required"):
        if t is None:
            raise RuleMissing("The rules require the “leakage” term, but no approved estimate exists for this period.",
                              details={"rule_key": "leakage", "term": "leakage"})
        leak_terms["leakage"] = t.value_t_co2e
        term_rows["leakage"] = TermResult("leakage", t.value_t_co2e, t.variance, t.df, t.source, "supplied",
                                          "CALCULATED", "LK (other)")
    else:
        term_rows["leakage"] = TermResult("leakage", 0.0, 0.0, None, "not_required_by_rules", "not_required_by_rules")
    le_oa_by_year = dict(emis.leakage_oa_by_year) if emis else {v.year: 0.0 for v in vint}

    # ------------------------------------------------------------ de minimis (§5 p.12, §8.4 p.50)
    de_pct = float(rules.require("de_minimis_pct"))
    de_exclude = bool(rules.require("de_minimis_exclude"))
    contrib: dict[str, float] = {src: row["reduction_t_co2e"] for src, row in qa3_sources.items()}
    contrib.update({k: v for k, v in extra_de_raw.items()})
    leak_contrib = {"le_oa": float(sum(le_oa_by_year.values())), **leak_terms}
    gross_ref = float(sum(contrib.values()) + (soil_wp_adj - soil_bsl) + (tree_wp - tree_bsl))
    candidates: list[str] = []
    if gross_ref != 0:
        running = 0.0
        for name, v in sorted([*contrib.items(), *leak_contrib.items()], key=lambda kv: abs(kv[1])):
            if v == 0:
                continue
            if (running + abs(v)) / abs(gross_ref) * 100.0 < de_pct:
                running += abs(v)
                candidates.append(name)
    excluded = candidates if de_exclude else []
    de_minimis = {"threshold_pct": de_pct, "total_benefit_t_co2e": gross_ref, "candidates": candidates,
                  "excluded": excluded,
                  "shares_pct": {k: (abs(v) / abs(gross_ref) * 100.0 if gross_ref else None)
                                 for k, v in {**contrib, **leak_contrib}.items()}}

    # ------------------------------------------------------------ per vintage (Eq. 37–43, 75–79)
    vint_rows: list[dict[str, Any]] = []
    cum = float(inp.prior_cumulative_stock_change_t_co2e)
    totals = {k: 0.0 for k in ("sum_de", "sum_de_raw", "d_wp", "d_bsl", "gross", "er", "cr", "lk", "lk_er", "lk_cr",
                               "er_net", "cr_net", "bu_er", "bu_cr", "bu_er_raw", "bu_cr_raw", "vcu_er", "vcu_cr")}
    negative_buffer = False
    for v in vint:
        s_y = share[v.year]
        qa3_y = {src: (0.0 if src in excluded else (emis.reduction(src, v.year) if emis else 0.0))
                 for src in qa3_sources}
        extra_adj = {k: (0.0 if k in excluded else val * s_y) for k, val in extra_de_adj.items()}
        extra_raw = {k: (0.0 if k in excluded else val * s_y) for k, val in extra_de_raw.items()}
        sum_de = float(sum(qa3_y.values()) + sum(extra_adj.values()))
        sum_de_raw = float(sum(qa3_y.values()) + sum(extra_raw.values()))
        dwp_y, dbsl_y = d_wp * s_y, d_bsl * s_y
        raw_wp_y = (soil_wp_adj + tree_wp) * s_y
        raw_bsl_y = (soil_bsl + tree_bsl) * s_y
        lk_y = (0.0 if "le_oa" in excluded else le_oa_by_year.get(v.year, 0.0)) + \
            sum(0.0 if k in excluded else val * s_y for k, val in leak_terms.items())
        cum += dwp_y
        ind = 1.0 if cum > 0 else 0.0
        er = eq37_er(sum_de, dwp_y, dbsl_y, ind)
        cr = eq40_cr(dwp_y, dbsl_y, ind)
        gross_y = sum_de_raw + raw_wp_y - raw_bsl_y
        lk_er, lk_cr = eq39_42_allocate(lk_y, er, cr)
        er_net, cr_net = er - lk_er, cr - lk_cr  # Eq. 38, 41
        bu_er_raw = eq75_buffer_er(dwp_y, dbsl_y, ind, npr)
        bu_cr_raw = eq76_buffer_cr(dwp_y, dbsl_y, ind, npr)
        bu_er, bu_cr = max(0.0, bu_er_raw), max(0.0, bu_cr_raw)
        negative_buffer = negative_buffer or bu_er_raw < 0 or bu_cr_raw < 0
        vcu_er, vcu_cr = er_net - bu_er, cr_net - bu_cr  # Eq. 77, 78
        row = {"year": v.year, "weight": v.weight, "share": s_y, "indicator": ind, "cumulative_d_wp_t_co2e": cum,
               "sum_delta_e_t_co2e": sum_de, "delta_e": {**qa3_y, **extra_adj}, "d_wp_t_co2e": dwp_y,
               "d_bsl_t_co2e": dbsl_y, "gross_t_co2e": gross_y, "er_t_co2e": er, "cr_t_co2e": cr,
               "leakage_t_co2e": lk_y, "lk_er_t_co2e": lk_er, "lk_cr_t_co2e": lk_cr, "er_net_t_co2e": er_net,
               "cr_net_t_co2e": cr_net, "err_net_t_co2e": er_net + cr_net, "buffer_er_t_co2e": bu_er,
               "buffer_cr_t_co2e": bu_cr, "buffer_er_eq75_t_co2e": bu_er_raw, "buffer_cr_eq76_t_co2e": bu_cr_raw,
               "vcu_er": vcu_er, "vcu_cr": vcu_cr, "vcu": vcu_er + vcu_cr}
        vint_rows.append(row)
        for k2, val in (("sum_de", sum_de), ("sum_de_raw", sum_de_raw), ("d_wp", dwp_y), ("d_bsl", dbsl_y),
                        ("gross", gross_y), ("er", er), ("cr", cr), ("lk", lk_y), ("lk_er", lk_er), ("lk_cr", lk_cr),
                        ("er_net", er_net), ("cr_net", cr_net), ("bu_er", bu_er), ("bu_cr", bu_cr),
                        ("bu_er_raw", bu_er_raw), ("bu_cr_raw", bu_cr_raw), ("vcu_er", vcu_er), ("vcu_cr", vcu_cr)):
            totals[k2] += val
    if negative_buffer:
        warnings.append("Eq. 75/76 gave a negative buffer contribution (a stock loss); it is not released — the "
                        "buffer is never negative (reversals are handled by the VCS buffer rules).")

    gross = totals["gross"]
    er_cr = totals["er"] + totals["cr"]
    deduction = gross - er_cr
    net_before = gross - totals["lk"]
    net_after = totals["er_net"] + totals["cr_net"]  # Eq. 43
    buffer = totals["bu_er"] + totals["bu_cr"]
    vcu = totals["vcu_er"] + totals["vcu_cr"]  # Eq. 79
    se = math.sqrt(max(total_var, 0.0))
    df_eff = welch_df(df_components) if df_components else soc_df

    eqs("Eq. 37", "ΣΔE emission reductions (after uncertainty)", totals["sum_de"], "t CO2e")
    eqs("Eq. 37", "ER emission reductions", totals["er"], "t CO2e")
    eqs("Eq. 40", "CR carbon removals", totals["cr"], "t CO2e")
    eqs("Eq. 33", "LE_OA organic-amendment leakage", leak_contrib["le_oa"], "t CO2e")
    eqs("Eq. 39", "LK_ER leakage charged to reductions", totals["lk_er"], "t CO2e")
    eqs("Eq. 42", "LK_CR leakage charged to removals", totals["lk_cr"], "t CO2e")
    eqs("Eq. 38", "ER_NET", totals["er_net"], "t CO2e")
    eqs("Eq. 41", "CR_NET", totals["cr_net"], "t CO2e")
    eqs("Eq. 43", "ERR_NET", net_after, "t CO2e")
    eqs("Eq. 75", "Bu_ER buffer on reductions (stock change only)", totals["bu_er"], "t CO2e")
    eqs("Eq. 76", "Bu_CR buffer on removals", totals["bu_cr"], "t CO2e")
    eqs("Eq. 77", "VCU_ER", totals["vcu_er"], "t CO2e")
    eqs("Eq. 78", "VCU_CR", totals["vcu_cr"], "t CO2e")
    eqs("Eq. 79", "VCU total", vcu, "t CO2e")

    ordered_terms = tuple(term_rows.get(k) or TermResult(k, 0.0, 0.0, None, "not_supplied", "not_supplied")
                          for k in ENGINE_TERMS)
    shallow = any(p.reported_to_sampled_depth for r in [*results, *control_results]
                  for p in (*r.baseline_points, *r.monitoring_points))
    extrap = any(p.extrapolated for r in [*results, *control_results] for p in (*r.baseline_points,
                                                                                   *r.monitoring_points))
    flags = {
        "carbon_lost": net_before <= 0,
        "high_uncertainty": gross > 0 and deduction / gross > high_uncertainty_ratio,
        "controls_used": controls_used,
        "unpaired_sites_excluded": any(r.excluded_sites for r in [*results, *control_results]),
        "net_after_uncertainty_not_positive": net_after <= 0,
        "soc_uncertainty_exceeds_100pct": soc_unc > 1,
        "shallow_soil_points": shallow,
        "mass_correction_extrapolated": extrap,
        "fixed_depth_with_mass_correction": stock_method == "fixed_depth_with_mass_correction",
        "biochar_subtracted": biochar > 0,
        "negative_buffer_not_released": negative_buffer,
        "de_minimis_candidates": bool(candidates),
        "de_minimis_excluded": bool(excluded),
        "legacy_terms_used": legacy_used,
        "modelled_values_used": any(r.data_class == "MODELLED" and r.status == "supplied" for r in ordered_terms),
        "no_activity_data": emis is None,
    }
    if emis:
        warnings.extend(emis.warnings)
    split = {
        "removal_indicator": vint_rows[-1]["indicator"] if vint_rows else 0.0,
        "losses": min(0.0, totals["d_wp"]) - min(0.0, totals["d_bsl"]),
        "gains": max(0.0, totals["d_wp"]) - max(0.0, totals["d_bsl"]),
        "sum_delta_e": totals["sum_de"], "er_gross": totals["er"], "cr_gross": totals["cr"],
        "leakage_er": totals["lk_er"], "leakage_cr": totals["lk_cr"], "er_net": totals["er_net"],
        "cr_net": totals["cr_net"], "deduction_er": 0.0, "deduction_cr": 0.0,
        "buffer_er": totals["bu_er"], "buffer_cr": totals["bu_cr"],
        "reductions_t_co2e": totals["vcu_er"], "removals_t_co2e": totals["vcu_cr"],
    }
    soc_out = {
        "approach": soc_approach, "stock_method": stock_method, "measurement_interval_years": x,
        "period_years": period_years, "credited_years": credited_years, "reporting_depth_cm": depth,
        "soil_wp_t_co2e": soil_wp, "biochar_t_co2e": biochar, "soil_wp_after_biochar_t_co2e": soil_wp_adj,
        "soil_bsl_t_co2e": soil_bsl, "tree_wp_t_co2e": tree_wp, "tree_bsl_t_co2e": tree_bsl,
        "unc_co2": soc_unc, "i_soil": i_soil, "multiplier": mult, "d_wp_t_co2e": d_wp, "d_bsl_t_co2e": d_bsl,
        "prior_cumulative_d_wp_t_co2e": inp.prior_cumulative_stock_change_t_co2e, "source": soc_source,
        **({"multistage": ms.summary} if ms is not None else {}),
    }
    emissions_out = {
        "qa3": emis.to_dict() if emis else None,
        "sum_delta_e_t_co2e": totals["sum_de"], "sum_delta_e_before_uncertainty_t_co2e": totals["sum_de_raw"],
        "components": {**{src: row["reduction_t_co2e"] for src, row in qa3_sources.items()}, **extra_de_adj},
        "symbols": {src: row["symbol"] for src, row in qa3_sources.items()},
        "excluded_de_minimis": excluded,
    }
    leakage_out = {
        "le_oa_t_co2e": leak_contrib["le_oa"], "le_oa_by_year": {str(k): v for k, v in le_oa_by_year.items()},
        "le_oa_items": list(emis.leakage_items) if emis else [], "le_br_t_co2e": leak_terms.get(
            "leakage_biomass_residues", 0.0), "lk_disp_t_co2e": leak_terms.get("leakage_displacement", 0.0),
        "other_t_co2e": leak_terms.get("leakage", 0.0), "total_t_co2e": totals["lk"],
        "lk_er_t_co2e": totals["lk_er"], "lk_cr_t_co2e": totals["lk_cr"],
    }
    return CalculationResult(
        stock_method=stock_method, design=inp.design, soc_approach=soc_approach, strata=tuple(results),
        control_strata=tuple(sorted(control_results, key=lambda r: r.code)), controls_used=controls_used,
        dsoc_t_c=dsoc_c, dsoc_variance_t_c=dsoc_var_co2 / CO2_PER_C**2, dsoc_t_co2e=soil_wp_adj - soil_bsl,
        dsoc_variance_t_co2e=dsoc_var_co2, terms=ordered_terms, gross_t_co2e=gross,
        net_before_uncertainty_t_co2e=net_before, total_variance=total_var, se_t_co2e=se, df_effective=df_eff,
        confidence=conf, t_value=soc_t, uncertainty_deduction_t_co2e=deduction,
        net_after_uncertainty_t_co2e=net_after, non_permanence_risk_pct=npr, buffer_t_co2e=buffer,
        credits_t_co2e=vcu, reductions_t_co2e=totals["vcu_er"], removals_t_co2e=totals["vcu_cr"], split=split,
        flags=flags, soc=soc_out, emissions=emissions_out, leakage=leakage_out, uncertainty=uncertainty,
        vintages=tuple(vint_rows), equations=tuple(eqs.rows), de_minimis=de_minimis,
        warnings=tuple(dict.fromkeys(warnings)), rules_snapshot=rules.snapshot(),
    )


def input_to_dict(inp: EngineInput) -> dict[str, Any]:
    """Plain-JSON form of the engine input (for snapshots and hashing)."""
    d = asdict(inp)
    d["terms"] = {k: asdict(v) for k, v in sorted(inp.terms.items())}
    if d.get("multistage") is None:
        d.pop("multistage", None)  # stratified runs keep their pre-Appendix-6 snapshot (and hash) unchanged
    return _jsonable(d)
