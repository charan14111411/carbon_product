"""Woody biomass (trees and shrubs) — pure functions, no database.

What follows VM0042 v2.2 text
-----------------------------
* §5 Table 2 (p.12): above-ground woody biomass is required where the project significantly reduces it,
  otherwise optional; below-ground woody biomass is optional (rules ``woody_biomass_included``,
  ``woody_belowground_included``).
* §8.2.2 (p.38) and Table 5 note ** (p.20): stocks are estimated with the CDM A/R tool "Estimation of carbon
  stocks and change in carbon stocks of trees and shrubs in A/R CDM project activities" (AR-TOOL14).
* Eq. 48–51 (p.59–60), quoted exactly::

      ΔC_TREE,bsl,t  = Σ_i (ΔC_TREE,bsl,i,t  − ΔC_TREE,bsl,i,t−x)  × 1/x × A_i     (48)
      ΔC_TREE,wp,t   = Σ_i (ΔC_TREE,wp,i,t   − ΔC_TREE,wp,i,t−x)   × 1/x × A_i     (49)
      ΔC_SHRUB,bsl,t = Σ_i (ΔC_SHRUB,bsl,i,t − ΔC_SHRUB,bsl,i,t−x) × 1/x × A_i     (50)
      ΔC_SHRUB,wp,t  = Σ_i (ΔC_SHRUB,wp,i,t  − ΔC_SHRUB,wp,i,t−x)  × 1/x × A_i     (51)

  where the ΔC_•,i,t terms are areal means for quantification unit i (t CO2e/ha) at the end of year t and
  year t − x, x is the time between the measurements (years) and A_i the area (ha). The result is an
  annual stock change (t CO2e/yr); a positive value is a stock gain (removal), matching Eq. 44/45.
* §9.2 (p.131–133): monitoring at least every five years (rule ``woody_remeasure_max_years``).
* Harvested woody biomass needs the VCS long-term-average benefit (§8.2.2 p.38) — not implemented here, so a
  measurement flagged as harvested blocks the calculation.

What follows the external tool (CDM AR-TOOL14) structure
--------------------------------------------------------
* Trees: per-tree above-ground biomass from an allometric equation of DBH (and height), or the
  volume × wood density × BEF method; B_TREE = AGB × (1 + R_j) when roots are included;
  C_TREE = 44/12 × CF_TREE × B_TREE. Plot values are scaled to a hectare by the plot area.
* Shrubs: B_SHRUB = (1 + R_S) × BDR_SF × B_FOREST × CC_SHRUB per hectare (crown-cover method), or measured
  shrub biomass per hectare × (1 + R_S); C_SHRUB = 44/12 × CF_S × B_SHRUB.
* Every coefficient (equation parameters, R_j, CF, R_S, BDR_SF, B_FOREST) is an approved allometric model
  or a rule-pack value: nothing is defaulted here.

Sampling statistics (platform choice, consistent with VM0042 §8.6 for SOC)
-------------------------------------------------------------------------
Permanent plots re-measured in both campaigns are paired: d_p = c_p,t − c_p,t−x. For stratum i the mean
change is d̄_i with s²(d̄_i) = s²_d / n_i and df n_i − 1. The annual total is Σ_i d̄_i / x × A_i with variance
Σ_i (A_i / x)² s²_d,i / n_i and Welch–Satterthwaite degrees of freedom across strata. Tree and shrub carbon
are paired per plot together, so the combined variance includes their covariance.
"""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
from typing import Any

from app.core.errors import Blocked, RuleMissing, ValidationFailed

CO2_PER_C: float = 44.0 / 12.0
M2_PER_HA: float = 10_000.0
KG_PER_T: float = 1_000.0

# Allometric forms. DBH in cm, height in m; the output is in the model's ``output_unit`` (kg or t dry matter),
# except volume_bef whose volume equation gives m³ and whose result is t dry matter.
FORMS: dict[str, dict[str, Any]] = {
    "power_dbh": {"label": "AGB = a × DBH^b", "params": ("a", "b"), "height": False},
    "power_dbh_h": {"label": "AGB = a × DBH^b × H^c", "params": ("a", "b", "c"), "height": True},
    "d2h": {"label": "AGB = a × (DBH² × H)^b", "params": ("a", "b"), "height": True},
    "rho_d2h": {"label": "AGB = a × (ρ × DBH² × H)^b", "params": ("a", "b", "wood_density"), "height": True},
    "volume_bef": {"label": "AGB (t) = (a × DBH^b × H^c) m³ × wood density (t/m³) × BEF",
                   "params": ("a", "b", "c", "wood_density", "bef"), "height": True},
}
OUTPUT_UNITS = ("kg", "t")


# =============================================================== inputs
@dataclass(frozen=True)
class Allometry:
    id: str
    species: str  # "*" = generic equation chosen explicitly for species without their own model
    form: str
    params: Mapping[str, float]
    output_unit: str  # kg | t  (ignored for volume_bef: always t)
    dbh_min_cm: float
    dbh_max_cm: float
    root_shoot_ratio: float | None = None
    source: str = ""


@dataclass(frozen=True)
class Tree:
    species: str
    dbh_cm: float
    height_m: float | None = None
    count: int = 1


@dataclass(frozen=True)
class Shrub:
    crown_cover_fraction: float | None = None  # CC_SHRUB (0–1)
    agb_t_dm_ha: float | None = None  # measured shrub above-ground biomass per hectare


@dataclass(frozen=True)
class PlotMeasurement:
    plot_id: str
    plot_code: str
    stratum_id: str
    area_m2: float
    trees: tuple[Tree, ...]
    shrub: Shrub | None = None
    harvested: bool = False
    record_id: str = ""


@dataclass(frozen=True)
class StratumArea:
    id: str
    code: str
    area_ha: float
    quantification_unit: str = ""


@dataclass(frozen=True)
class WoodyRules:
    belowground: bool
    shrubs: bool
    cf_tree: float
    cf_shrub: float | None = None
    r_shrub: float | None = None
    bdr_sf: float | None = None
    b_forest_t_dm_ha: float | None = None
    max_interval_years: float | None = None


@dataclass
class PlotStock:
    plot_id: str
    plot_code: str
    stratum_id: str
    tree_t_co2e_ha: float
    shrub_t_co2e_ha: float
    trees: list[dict[str, Any]] = field(default_factory=list)

    @property
    def total(self) -> float:
        return self.tree_t_co2e_ha + self.shrub_t_co2e_ha


# =============================================================== per tree (AR-TOOL14 structure)
def _norm(species: str) -> str:
    return " ".join(species.strip().lower().split())


def pick_allometry(species: str, models: Sequence[Allometry]) -> Allometry:
    """The approved model for this species, else an explicit generic ("*") model; RuleMissing otherwise."""
    key = _norm(species)
    exact = [m for m in models if _norm(m.species) == key]
    generic = [m for m in models if m.species.strip() == "*"]
    pool = exact or generic
    if not pool:
        raise RuleMissing(f"No approved allometric equation covers the species “{species}”. Add one (with its "
                          "published source) and have a colleague approve it.",
                          details={"rule_key": "allometric_model", "species": species})
    if len(pool) > 1:
        raise ValidationFailed(f"More than one approved allometric equation applies to “{species}”. Retire one.",
                               code="AMBIGUOUS_ALLOMETRY", details={"species": species,
                                                                    "models": [m.id for m in pool]})
    return pool[0]


def validate_allometry(form: str, params: Mapping[str, Any], output_unit: str, dbh_min: float, dbh_max: float) -> None:
    if form not in FORMS:
        raise ValidationFailed(f"Unknown equation form “{form}”. Choose one of: {', '.join(FORMS)}.",
                               code="INVALID_ALLOMETRY")
    missing = [p for p in FORMS[form]["params"] if not isinstance(params.get(p), (int, float))
               or isinstance(params.get(p), bool)]
    if missing:
        raise ValidationFailed(f"The equation “{FORMS[form]['label']}” needs the parameter(s): {', '.join(missing)}.",
                               code="INVALID_ALLOMETRY", details={"missing": missing})
    extra = sorted(set(params) - set(FORMS[form]["params"]))
    if extra:
        raise ValidationFailed(f"Parameter(s) not used by this equation form: {', '.join(extra)}.",
                               code="INVALID_ALLOMETRY", details={"extra": extra})
    if params["a"] <= 0:
        raise ValidationFailed("The coefficient a must be positive.", code="INVALID_ALLOMETRY")
    for p in ("wood_density", "bef"):
        if p in params and params[p] <= 0:
            raise ValidationFailed(f"The parameter {p} must be positive.", code="INVALID_ALLOMETRY")
    if form != "volume_bef" and output_unit not in OUTPUT_UNITS:
        raise ValidationFailed("Say whether the equation gives kilograms (kg) or tonnes (t) of dry matter.",
                               code="INVALID_ALLOMETRY")
    if not 0 < dbh_min < dbh_max:
        raise ValidationFailed("Give the DBH range (cm) the equation was fitted for, with minimum below maximum.",
                               code="INVALID_ALLOMETRY")


def tree_agb_t(tree: Tree, m: Allometry) -> float:
    """Above-ground dry biomass of ONE tree (t d.m.) from its allometric model (AR-TOOL14 structure)."""
    if tree.dbh_cm <= 0:
        raise ValidationFailed("Tree DBH must be positive.", code="INVALID_TREE", details={"species": tree.species})
    if not m.dbh_min_cm <= tree.dbh_cm <= m.dbh_max_cm:
        raise ValidationFailed(
            f"A {tree.species} tree of DBH {tree.dbh_cm:g} cm is outside the range the equation was fitted for "
            f"({m.dbh_min_cm:g}–{m.dbh_max_cm:g} cm). Use an equation valid for this size.",
            code="DBH_OUT_OF_RANGE", details={"species": tree.species, "dbh_cm": tree.dbh_cm, "model_id": m.id})
    spec = FORMS[m.form]
    h = tree.height_m
    if spec["height"] and (h is None or h <= 0):
        raise ValidationFailed(f"The equation for {tree.species} needs tree height, which is missing.",
                               code="HEIGHT_REQUIRED", details={"species": tree.species, "model_id": m.id})
    p, d = m.params, tree.dbh_cm
    if m.form == "power_dbh":
        y = p["a"] * d ** p["b"]
    elif m.form == "power_dbh_h":
        y = p["a"] * d ** p["b"] * h ** p["c"]  # type: ignore[operator]
    elif m.form == "d2h":
        y = p["a"] * (d * d * h) ** p["b"]  # type: ignore[operator]
    elif m.form == "rho_d2h":
        y = p["a"] * (p["wood_density"] * d * d * h) ** p["b"]  # type: ignore[operator]
    elif m.form == "volume_bef":
        volume_m3 = p["a"] * d ** p["b"] * h ** p["c"]  # type: ignore[operator]
        return float(volume_m3 * p["wood_density"] * p["bef"])
    else:  # pragma: no cover - validated on entry
        raise ValidationFailed(f"Unknown equation form “{m.form}”.", code="INVALID_ALLOMETRY")
    return float(y / KG_PER_T if m.output_unit == "kg" else y)


def plot_stock(pm: PlotMeasurement, models: Sequence[Allometry], rules: WoodyRules) -> PlotStock:
    """Tree and shrub carbon of one plot measurement in t CO2e/ha."""
    if pm.area_m2 <= 0:
        raise ValidationFailed(f"Plot {pm.plot_code} needs a positive area.", code="INVALID_PLOT")
    area_ha = pm.area_m2 / M2_PER_HA
    rows = []
    c_tree = 0.0
    for t in pm.trees:
        if t.count < 1:
            raise ValidationFailed("Tree count must be at least 1.", code="INVALID_TREE")
        m = pick_allometry(t.species, models)
        agb = tree_agb_t(t, m)
        if rules.belowground:
            if m.root_shoot_ratio is None:
                raise RuleMissing(f"Below-ground biomass is included but the allometric model for {t.species} has no "
                                  "root-to-shoot ratio.", details={"rule_key": "root_shoot_ratio", "model_id": m.id})
            b = agb * (1.0 + m.root_shoot_ratio)
        else:
            b = agb
        c = CO2_PER_C * rules.cf_tree * b * t.count  # AR-TOOL14: C_TREE = 44/12 × CF_TREE × B_TREE
        c_tree += c
        rows.append({"species": t.species, "dbh_cm": t.dbh_cm, "height_m": t.height_m, "count": t.count,
                     "model_id": m.id, "agb_t_dm_per_tree": agb, "biomass_t_dm_per_tree": b, "c_t_co2e": c})
    shrub_c = 0.0
    if rules.shrubs:
        shrub_c = shrub_t_co2e_ha(pm.shrub, rules, pm.plot_code)
    return PlotStock(pm.plot_id, pm.plot_code, pm.stratum_id, c_tree / area_ha, shrub_c, rows)


def shrub_t_co2e_ha(s: Shrub | None, rules: WoodyRules, plot_code: str = "") -> float:
    """AR-TOOL14 shrub carbon per hectare: crown-cover method or measured biomass."""
    if s is None or (s.crown_cover_fraction is None and s.agb_t_dm_ha is None):
        raise RuleMissing(f"Shrubs are included but plot {plot_code} has no shrub measurement.",
                          details={"rule_key": "shrub_measurement", "plot": plot_code})
    if rules.cf_shrub is None:
        raise RuleMissing("The methodology rule “Carbon fraction of shrub biomass (CF_S)” has not been entered and "
                          "approved, so this can't continue.", details={"rule_key": "shrub_carbon_fraction"})
    rs_ = 0.0
    if rules.belowground:
        if rules.r_shrub is None:
            raise RuleMissing("The methodology rule “Root-to-shoot ratio of shrubs (R_S)” has not been entered and "
                              "approved, so this can't continue.", details={"rule_key": "shrub_root_shoot_ratio"})
        rs_ = rules.r_shrub
    if s.crown_cover_fraction is not None:
        if not 0 <= s.crown_cover_fraction <= 1:
            raise ValidationFailed("Shrub crown cover must be a fraction between 0 and 1.", code="INVALID_SHRUB")
        for key, val in (("shrub_biomass_ratio_bdr_sf", rules.bdr_sf),
                         ("shrub_forest_biomass_t_dm_ha", rules.b_forest_t_dm_ha)):
            if val is None:
                raise RuleMissing(f"Shrubs measured as crown cover need the rule “{key}”, which has not been entered "
                                  "and approved.", details={"rule_key": key})
        b = (1.0 + rs_) * rules.bdr_sf * rules.b_forest_t_dm_ha * s.crown_cover_fraction  # type: ignore[operator]
    else:
        if s.agb_t_dm_ha < 0:  # type: ignore[operator]
            raise ValidationFailed("Shrub biomass can't be negative.", code="INVALID_SHRUB")
        b = (1.0 + rs_) * s.agb_t_dm_ha  # type: ignore[operator]
    return CO2_PER_C * rules.cf_shrub * b


# =============================================================== stock change (Eq. 48–51)
def _mean_var(xs: Sequence[float]) -> tuple[float, float]:
    n = len(xs)
    mean = sum(xs) / n
    s2 = sum((x - mean) ** 2 for x in xs) / (n - 1) if n > 1 else 0.0
    return mean, s2


def welch_df(components: Sequence[tuple[float, float]]) -> float | None:
    total = sum(v for v, _ in components)
    if total <= 0:
        return None
    denom = sum(v * v / d for v, d in components if v > 0)
    return total * total / denom if denom > 0 else None


def stock_change(
    before: Sequence[PlotMeasurement],
    after: Sequence[PlotMeasurement],
    strata: Mapping[str, StratumArea],
    models: Sequence[Allometry],
    rules: WoodyRules,
    interval_years: float,
    scenario: str,
) -> dict[str, Any]:
    """Annual tree and shrub stock change (t CO2e/yr) per Eq. 48/50 (baseline) or 49/51 (project)."""
    eq_tree, eq_shrub = ("Eq. 48", "Eq. 50") if scenario == "baseline" else ("Eq. 49", "Eq. 51")
    x = interval_years
    if x <= 0:
        raise ValidationFailed("The later campaign must be measured after the earlier one.", code="INVALID_INTERVAL")
    if rules.max_interval_years is not None and x > rules.max_interval_years + 1e-9:
        raise Blocked(f"The campaigns are {x:.2f} years apart; VM0042 requires woody biomass to be re-measured at "
                      f"least every {rules.max_interval_years:g} years (§9.2 p.131).", code="INTERVAL_TOO_LONG",
                      details={"interval_years": x, "max_years": rules.max_interval_years})
    harvested = sorted({m.plot_code for m in after if m.harvested})
    if harvested:
        raise Blocked("Woody biomass was harvested on some plots. VM0042 §8.2.2 then requires the long-term average "
                      "GHG benefit (VCS Methodology Requirements §3.6), which this calculator does not compute.",
                      code="HARVEST_LTA_REQUIRED", details={"plots": harvested})
    b_map = {m.plot_id: m for m in before}
    a_map = {m.plot_id: m for m in after}
    paired = sorted(set(b_map) & set(a_map), key=lambda pid: a_map[pid].plot_code)
    unpaired = sorted({(b_map.get(p) or a_map[p]).plot_code for p in set(b_map) ^ set(a_map)})
    by_stratum: dict[str, list[tuple[PlotStock, PlotStock]]] = {}
    for pid in paired:
        s0, s1 = plot_stock(b_map[pid], models, rules), plot_stock(a_map[pid], models, rules)
        by_stratum.setdefault(a_map[pid].stratum_id, []).append((s0, s1))
    if not by_stratum:
        raise Blocked("No permanent plot was measured in both campaigns, so no stock change can be calculated.",
                      code="NO_PAIRED_PLOTS", details={"unpaired_plots": unpaired})
    rows = []
    tree_annual = shrub_annual = 0.0
    var_total = var_tree = var_shrub = 0.0
    comps: list[tuple[float, float]] = []
    comps_tree: list[tuple[float, float]] = []
    comps_shrub: list[tuple[float, float]] = []
    for sid, pairs in sorted(by_stratum.items(), key=lambda kv: strata[kv[0]].code if kv[0] in strata else kv[0]):
        st = strata.get(sid)
        if st is None or st.area_ha <= 0:
            raise RuleMissing("A plot's zone has no area, so Eq. 48–51 can't be scaled (A_i).",
                              details={"rule_key": "stratum_area", "stratum_id": sid})
        n = len(pairs)
        if n < 2:
            raise Blocked(f"Zone {st.code} has only {n} re-measured plot; at least 2 are needed to estimate the "
                          "sampling uncertainty.", code="TOO_FEW_PLOTS", details={"stratum": st.code, "n": n})
        d_tree = [p1.tree_t_co2e_ha - p0.tree_t_co2e_ha for p0, p1 in pairs]
        d_shrub = [p1.shrub_t_co2e_ha - p0.shrub_t_co2e_ha for p0, p1 in pairs]
        d_tot = [a + b for a, b in zip(d_tree, d_shrub)]
        mt, s2t = _mean_var(d_tree)
        ms, s2s = _mean_var(d_shrub)
        _, s2 = _mean_var(d_tot)
        k = st.area_ha / x
        mean_t0 = sum(p0.tree_t_co2e_ha for p0, _ in pairs) / n
        mean_t1 = sum(p1.tree_t_co2e_ha for _, p1 in pairs) / n
        mean_s0 = sum(p0.shrub_t_co2e_ha for p0, _ in pairs) / n
        mean_s1 = sum(p1.shrub_t_co2e_ha for _, p1 in pairs) / n
        tree_i, shrub_i = mt * k, ms * k
        v_i, vt_i, vs_i = k * k * s2 / n, k * k * s2t / n, k * k * s2s / n
        tree_annual += tree_i
        shrub_annual += shrub_i
        var_total += v_i
        var_tree += vt_i
        var_shrub += vs_i
        comps.append((v_i, n - 1))
        comps_tree.append((vt_i, n - 1))
        comps_shrub.append((vs_i, n - 1))
        rows.append({
            "stratum_id": sid, "stratum_code": st.code, "quantification_unit": st.quantification_unit or st.code,
            "area_ha": st.area_ha, "n_plots": n,
            "tree_t_co2e_ha_start": mean_t0, "tree_t_co2e_ha_end": mean_t1,
            "shrub_t_co2e_ha_start": mean_s0, "shrub_t_co2e_ha_end": mean_s1,
            "tree_change_t_co2e_ha": mt, "shrub_change_t_co2e_ha": ms,
            "tree_annual_t_co2e": tree_i, "shrub_annual_t_co2e": shrub_i,
            "variance_annual": v_i, "df": n - 1,
            "plots": [{"plot_id": p1.plot_id, "plot_code": p1.plot_code,
                       "tree_t_co2e_ha_start": p0.tree_t_co2e_ha, "tree_t_co2e_ha_end": p1.tree_t_co2e_ha,
                       "shrub_t_co2e_ha_start": p0.shrub_t_co2e_ha, "shrub_t_co2e_ha_end": p1.shrub_t_co2e_ha,
                       "trees_end": p1.trees} for p0, p1 in pairs],
        })
    return {
        "scenario": scenario, "interval_years": x, "equations": [eq_tree, eq_shrub] if rules.shrubs else [eq_tree],
        "tree_annual_t_co2e": tree_annual, "shrub_annual_t_co2e": shrub_annual,
        "annual_t_co2e": tree_annual + shrub_annual, "variance_annual": var_total, "df": welch_df(comps),
        "tree_variance_annual": var_tree, "tree_df": welch_df(comps_tree),
        "shrub_variance_annual": var_shrub, "shrub_df": welch_df(comps_shrub),
        "strata": rows, "unpaired_plots": unpaired,
        "belowground_included": rules.belowground, "shrubs_included": rules.shrubs,
    }


def credit_period(annual: float, variance_annual: float, interval_years: float, period_years: float) -> dict[str, float]:
    """Period value as the engine treats SOC: annual rate × min(period, x), so a period longer than the measurement
    interval is never credited more than was measured. Variance scales with the square."""
    if period_years <= 0:
        raise ValidationFailed("The period must be longer than zero.", code="INVALID_PERIOD")
    credited = min(period_years, interval_years)
    return {"period_years": period_years, "credited_years": credited, "value_t_co2e": annual * credited,
            "variance": variance_annual * credited * credited}

