"""Hand-computed VM0042 v2.2 reference cases for the pure quantification engine."""

from __future__ import annotations

import math
from datetime import date

import numpy as np
import pytest
from scipy import stats
from scipy.interpolate import PchipInterpolator

from app.core.errors import Blocked, RuleMissing, ValidationFailed
from app.modules.calculation import engine as E
from app.modules.calculation.models import TERMS
from app.modules.emissions import domain as em
from app.modules.methodology.definitions import RULES
from app.modules.methodology.ruleset import from_values

BASE_RULES = {r.key: r.example for r in RULES}
BASE_RULES.update({r.key: r.vm0042_default for r in RULES if r.vm0042_default is not None})
BASE_RULES.update({"coarse_fragment_correction": False, "non_permanence_risk_pct": 20})
C = 44 / 12
ONE_YEAR = (E.Vintage(2024, 1.0),)


def rules(**over):
    v = dict(BASE_RULES)
    v.update(over)
    return from_values({k: x for k, x in v.items() if x is not None})


def pt(site: str, soc: float, bd: float = 1.2, lower: float | None = None, shallow: bool = False) -> E.Point:
    """0–30 cm at ``soc`` % plus (optionally) 30–50 cm at ``lower`` %."""
    layers = [E.Layer(f"{site}-D1", 0, 30, bd, soc)]
    if lower is not None:
        layers.append(E.Layer(f"{site}-D2", 30, 50, bd, lower))
    return E.Point(site, tuple(layers), sample_code=f"S-{site}", shallow=shallow)


def stratum(code="Z1", area=10.0, base=(1.0, 1.1, 1.2), mon=(1.1, 1.25, 1.3), role="project", control_for=None):
    return E.StratumData(code, area, tuple(pt(f"{code}-{i}", v) for i, v in enumerate(base)),
                         tuple(pt(f"{code}-{i}", v) for i, v in enumerate(mon)), role, control_for)


def control(code="C1", for_code="Z1", base=(1.0, 1.05, 1.1), mon=(1.0, 1.06, 1.1)):
    return stratum(code, 1.0, base, mon, role="control", control_for=for_code)


def inp(*strata, x=1.0, vintages=ONE_YEAR, **kw):
    return E.EngineInput("paired", tuple(strata), measurement_interval_years=x, vintages=vintages, **kw)


# ------------------------------------------------------------------ Eq. 3 and soil mass
def test_terms_constant_matches_model():
    assert E.ENGINE_TERMS == TERMS


def test_eq3_reproduces_wendt_hauser_example():
    # VM0042 v2.2 p.36–37: 283.2 g, D = 21.5 mm, N = 4 cores, OC = 24.29 g/kg
    mass = E.eq3_fine_soil_mass_t_ha(283.2, 21.5, 4)
    assert mass == pytest.approx(283.2 / (math.pi * 10.75**2 * 4) * 10_000)
    assert mass == pytest.approx(1950, abs=1)  # ~1950 Mg/ha
    assert E.eq3_soc_t_ha(mass, 24.29) == pytest.approx(47.36, abs=0.02)  # ~47.36 Mg C/ha


def test_layer_uses_eq3_when_core_mass_is_known_otherwise_mass_correction():
    lyr = E.Layer("L", 0, 30, 1.2, 2.429, fine_soil_mass_g=283.2)
    with_core = E.layer_stock(lyr, E.Point("a", (lyr,), probe_diameter_mm=21.5, cores_composited=4), rules())
    assert with_core.mass_method == "eq3" and with_core.stock_t_c_ha == pytest.approx(47.36, abs=0.02)
    no_core = E.layer_stock(lyr, E.Point("a", (lyr,)), rules())
    assert no_core.mass_method == "bulk_density" and no_core.fine_mass_t_ha == pytest.approx(3600)
    # coarse-fragment mass correction: 1.2 × 30 × 100 × (1 − 0.25) = 2700 t/ha; × 1.5 % = 40.5 t C/ha
    r = rules(coarse_fragment_correction=True)
    cf = E.Layer("L", 0, 30, 1.2, 1.5, 0.25)
    assert E.layer_stock(cf, E.Point("a", (cf,)), r).stock_t_c_ha == pytest.approx(40.5)
    with pytest.raises(RuleMissing) as e:
        E.layer_stock(E.Layer("L", 0, 30, 1.2, 1.5), E.Point("a", ()), r)
    assert e.value.details["rule_key"] == "coarse_fraction"


def test_layer_gap_and_short_profile_are_blocked():
    gap = E.Point("a", (E.Layer("L1", 0, 10, 1.0, 1.0), E.Layer("L2", 12, 30, 1.0, 1.0)))
    with pytest.raises(Blocked) as e:
        E.profile(gap, rules())
    assert e.value.code == "LAYER_GAP"
    short = E.profile(E.Point("a", (E.Layer("L1", 0, 20, 1.0, 1.0),)), rules())
    with pytest.raises(Blocked) as e:
        E.reference_mass([short], 30, rules())
    assert e.value.code == "DEPTH_MISMATCH"


# ------------------------------------------------------------------ equivalent soil mass
def test_esm_reference_is_heaviest_mass_to_30_cm_and_interpolates():
    light = E.profile(pt("A", 1.0, bd=1.0, lower=0.5), rules())  # 3000 t (30 t C) + 2000 t (10 t C)
    dense = E.profile(pt("B", 1.0, bd=1.2, lower=0.5), rules())  # 3600 t (36 t C) + 2400 t (12 t C)
    m_ref = E.reference_mass([light, dense], 30, rules())
    assert m_ref == pytest.approx(3600)
    lin = E.point_stock(light, rules(esm_interpolation="linear"), m_ref, 30)
    assert lin.stock_t_c_ha == pytest.approx(30 + 600 / 2000 * 10)  # 33 t C/ha at 3600 t/ha
    pchip = E.point_stock(light, rules(esm_interpolation="pchip"), m_ref, 30)
    assert pchip.stock_t_c_ha == pytest.approx(float(PchipInterpolator([0, 3000, 5000], [0, 30, 40])(3600)))
    assert 30 < pchip.stock_t_c_ha < 36  # monotone between the knots
    assert E.point_stock(dense, rules(), m_ref, 30).stock_t_c_ha == pytest.approx(36)  # at a knot: exact
    # a larger override wins; the reference never shrinks below the heaviest sample
    assert E.reference_mass([light, dense], 30, rules(esm_reference_mass_t_ha=4000)) == 4000
    assert E.reference_mass([light, dense], 30, rules(esm_reference_mass_t_ha=100)) == pytest.approx(3600)


def test_esm_never_extrapolates_but_shallow_soil_is_reported_to_sampled_depth():
    only30 = E.profile(pt("A", 1.0, bd=1.0), rules())  # 3000 t/ha
    with pytest.raises(Blocked) as e:
        E.point_stock(only30, rules(), 3600, 30)
    assert e.value.code == "DEPTH_MISMATCH"
    shallow = E.profile(E.Point("S", (E.Layer("S1", 0, 20, 1.0, 1.0),), shallow=True), rules())
    ps = E.point_stock(shallow, rules(), 3600, 30)
    assert ps.reported_to_sampled_depth and ps.stock_t_c_ha == pytest.approx(20.0)
    assert E.reference_mass([shallow, E.profile(pt("B", 1.0, lower=0.5), rules())], 30, rules()) == \
        pytest.approx(3600)  # a shallow sample doesn't set the reference


def test_fixed_depth_with_mass_correction_ellert_bettany():
    r = rules(stock_method="fixed_depth_with_mass_correction")
    light = E.profile(pt("A", 1.0, bd=1.0), rules())  # 3000 t/ha, 30 t C/ha, 0.01 t C per t soil
    ps = E.point_stock(light, r, 3600, 30)
    assert ps.stock_t_c_ha == pytest.approx(30 + 600 * 0.01) and ps.extrapolated
    res = E.calculate(inp(stratum(), control()), r)
    assert res.flags["fixed_depth_with_mass_correction"] and res.warnings


def test_plain_fixed_depth_is_rejected():
    with pytest.raises(ValidationFailed) as e:
        E.calculate(inp(stratum(), control()), rules(stock_method="fixed_depth"))
    assert e.value.code == "UNSUPPORTED_RULE_VALUE" and e.value.details["rule_key"] == "stock_method"


# ------------------------------------------------------------------ Eq. 70–71, 74
def test_eq71_variance_with_covariance_matches_hand_values():
    v = E.eq71_variance([10, 12, 11], [12, 13, 14], 10.0, paired=True)
    k = 100 / (3 * 2)
    assert v["s2_f"] == pytest.approx(k * 2) and v["s2_s"] == pytest.approx(k * 2)
    assert v["cov"] == pytest.approx(k * 1)  # (−1)(−1) + (1)(0) + (0)(1)
    assert v["s2_wp"] == pytest.approx(k * 2 + k * 2 - 2 * k)
    assert v["s2_wp"] == pytest.approx(100 * np.var([2, 1, 3], ddof=1) / 3)  # = A² s²_d / n
    indep = E.eq71_variance([10, 12, 11], [12, 13, 14], 10.0, paired=False)
    assert indep["cov"] == 0 and indep["s2_wp"] == pytest.approx(k * 4)


def test_eq74_t_value():
    assert E.t_one_sided(0.667, 10**7) == pytest.approx(stats.norm.ppf(0.667), abs=1e-5)
    assert E.t_one_sided(0.667, 10**7) == pytest.approx(0.4316, abs=5e-4)
    assert E.t_one_sided(2 / 3, 10**7) == pytest.approx(0.4307, abs=5e-4)  # the value quoted on p.82
    assert E.eq74_unc(4.0, 10.0, 0.5) == pytest.approx(0.1)
    assert E.eq74_unc(4.0, -10.0, 0.5) == pytest.approx(0.1)  # |mean|
    assert E.eq74_unc(0.0, 10.0, 0.5) == 0


def test_full_qa2_reference_case_with_controls():
    s, c = stratum(area=10.0), control()
    res = E.calculate(inp(s, c, x=2.0, vintages=(E.Vintage(2023, 1.0), E.Vintage(2024, 1.0))), rules())
    st = res.strata[0]
    # stocks: 1 % SOC = 36 t C/ha (BD 1.2, 30 cm); project Δ = mean(0.1, 0.15, 0.1) % ; control Δ = mean(0, .01, 0) %
    d_wp, d_bsl = np.mean([0.1, 0.15, 0.1]) * 36, np.mean([0.0, 0.01, 0.0]) * 36
    assert st.measured_delta_t_c_ha == pytest.approx(d_wp) and st.control_delta_t_c_ha == pytest.approx(d_bsl)
    s2_wp = E.eq71_variance([36, 39.6, 43.2], [39.6, 45, 46.8], 10, True)["s2_wp"]
    s2_bsl = E.eq71_variance([36, 37.8, 39.6], [36, 38.16, 39.6], 10, True)["s2_wp"]  # project area (Eq. 70)
    assert st.s2_wp == pytest.approx(s2_wp) and st.s2_bsl == pytest.approx(s2_bsl)
    assert st.s2_dsoc == pytest.approx(s2_wp + s2_bsl)
    df = E.welch_df([(s2_wp, 2), (s2_bsl, 2)])
    assert res.df_effective == pytest.approx(df)
    s2_mean = (s2_wp + s2_bsl) / 100  # Eq. 70, A = 10 ha
    mean = d_wp - d_bsl
    unc = math.sqrt(s2_mean) / mean * stats.t.ppf(0.667, df)  # Eq. 74
    assert res.uncertainty["soc"]["unc_pct"] == pytest.approx(unc * 100)
    soil_wp, soil_bsl = d_wp / 2 * 10 * C * 2, d_bsl / 2 * 10 * C * 2  # Eq. 46/47 annualised × 2 years
    assert res.soc["soil_wp_t_co2e"] == pytest.approx(soil_wp)
    assert res.soc["d_wp_t_co2e"] == pytest.approx(soil_wp * (1 - unc))  # Eq. 45, I_soil = +1
    assert res.soc["d_bsl_t_co2e"] == pytest.approx(soil_bsl * (1 - unc))  # Eq. 44
    cr = (soil_wp - soil_bsl) * (1 - unc)  # Eq. 40, I = 1, no emissions
    assert res.removals_t_co2e + res.buffer_t_co2e == pytest.approx(cr)
    assert res.buffer_t_co2e == pytest.approx(cr * 0.20)  # Eq. 76
    assert res.uncertainty_deduction_t_co2e == pytest.approx((soil_wp - soil_bsl) * unc)
    assert res.reductions_t_co2e == pytest.approx(0)
    assert res.credits_t_co2e == pytest.approx(cr * 0.8)
    assert sum(v["vcu"] for v in res.vintages) == pytest.approx(res.credits_t_co2e)
    assert [e["eq"] for e in res.equations][-1] == "Eq. 79"


def test_eq44_sign_flip_when_project_underperforms():
    assert E.eq44_45_multiplier(0.1, 1) == pytest.approx(0.9)
    assert E.eq44_45_multiplier(0.1, -1) == pytest.approx(1.1)
    loss = stratum(base=(1.3, 1.25, 1.4), mon=(1.1, 1.1, 1.2))
    res = E.calculate(inp(loss, control()), rules())
    unc = res.uncertainty["soc"]["unc_pct"] / 100
    assert res.uncertainty["soc"]["i_soil"] == -1
    assert res.soc["d_wp_t_co2e"] == pytest.approx(res.soc["soil_wp_t_co2e"] * (1 + unc))
    # Not floored: the loss is reported (and made more conservative by the uncertainty); no buffer is released
    assert res.credits_t_co2e < res.net_before_uncertainty_t_co2e < 0
    assert res.flags["carbon_lost"] and res.buffer_t_co2e == 0 and res.removals_t_co2e == 0
    assert res.uncertainty_deduction_t_co2e > 0


# ------------------------------------------------------------------ Eq. 37–43, 75–79
@pytest.mark.parametrize("ind,wp,bsl,er,cr", [
    (1, 10, 2, 3, 8),  # I = 1, gains → removals
    (1, -4, -6, 3 + (-4) - (-6), 0),  # I = 1, losses → reductions
    (0, 10, 2, 3 + 8, 0),  # I = 0, gains count as reductions
    (0, -4, -6, 3 + 2, 0),  # I = 0, losses
])
def test_eq37_eq40_four_cases(ind, wp, bsl, er, cr):
    assert E.eq37_er(3.0, wp, bsl, ind) == pytest.approx(er)
    assert E.eq40_cr(wp, bsl, ind) == pytest.approx(cr)


def test_eq75_76_buffer_excludes_emission_reductions():
    assert E.eq75_buffer_er(10, 2, 1, 20) == 0  # I = 1: gains are removals
    assert E.eq76_buffer_cr(10, 2, 1, 20) == pytest.approx(1.6)
    assert E.eq75_buffer_er(10, 2, 0, 20) == pytest.approx(1.6)  # I = 0: stock gains buffered as reductions
    assert E.eq75_buffer_er(-4, -6, 1, 20) == pytest.approx(0.4)  # avoided loss
    # full run: large emission reductions add to VCUs without any buffer
    ef = emissions_input(base_litres=10_000, proj_litres=0)
    res = E.calculate(inp(stratum(), control(), emissions=ef), rules())
    de = res.emissions["sum_delta_e_t_co2e"]
    assert de == pytest.approx(10_000 * 0.002886)
    assert res.buffer_t_co2e == pytest.approx(0.20 * res.split["cr_gross"])
    assert res.reductions_t_co2e == pytest.approx(de)  # ER_NET − Bu_ER with Bu_ER = 0


def test_eq39_42_leakage_allocation():
    assert E.eq39_42_allocate(6, 26, 100) == pytest.approx((6 * 26 / 126, 6 * 100 / 126))
    assert E.eq39_42_allocate(6, -5, 10) == pytest.approx((0, 6))  # positive parts
    assert E.eq39_42_allocate(6, -5, 0) == pytest.approx((6, 0))  # never lost
    assert E.eq39_42_allocate(0, 5, 5) == (0.0, 0.0)


def test_indicator_uses_cumulative_project_stock_change():
    res = E.calculate(inp(stratum(), control(), prior_cumulative_stock_change_t_co2e=-1e6), rules())
    assert res.vintages[0]["indicator"] == 0.0
    assert res.removals_t_co2e == 0 and res.reductions_t_co2e > 0


# ------------------------------------------------------------------ QA3 through the engine
def emissions_input(base_litres=0.0, proj_litres=0.0, extra_base=(), extra_proj=(), years=(2024,)):
    acts = [em.Activity("F1", "baseline", 2020, "fossil_fuel", {"diesel_l": base_litres}, 1, "b")]
    acts += [em.Activity("F1", "project", y, "fossil_fuel", {"diesel_l": proj_litres}, 1, f"p{y}") for y in years]
    acts += list(extra_base) + list(extra_proj)
    return em.EmissionsInput(tuple(acts), (em.QuantUnit("QU1", 10.0, ("F1",)),), {"F1": 10.0}, years[0],
                             {y: 1.0 for y in years})


def test_liming_fossil_and_fertiliser_hand_values_through_engine():
    extra_b = [em.Activity("F1", "baseline", 2020, "liming", {"limestone_t": 10}, 1, "l"),
               em.Activity("F1", "baseline", 2020, "n_fertilizer", {"synthetic_fertilizers": [
                   {"type": "urea", "mass_t": 1.0, "n_content": 0.46}]}, 1, "n")]
    extra_p = [em.Activity("F1", "project", 2024, "liming", {"limestone_t": 0}, 1, "lp"),
               em.Activity("F1", "project", 2024, "n_fertilizer", {"synthetic_n": False}, 1, "np")]
    ef = emissions_input(base_litres=1000, proj_litres=0, extra_base=extra_b, extra_proj=extra_p)
    factors = {"EF_Ndirect": 0.01, "EF_Nvolat": 0.01, "EF_Nleach": 0.011, "Frac_GASF": 0.11, "Frac_GASM": 0.21,
               "Frac_LEACH": 0.24}
    res = E.calculate(inp(stratum(), control(), emissions=ef), rules(emission_factors=factors))
    comp = res.emissions["components"]
    assert comp["co2_fossil_fuel"] == pytest.approx(2.886)  # Eq. 7: 1000 L × 0.002886
    assert comp["co2_liming"] == pytest.approx(4.4)  # Eq. 9: 10 × 0.12 × 44/12
    gwp, k = 265, 44 / 28
    direct = 0.46 * 0.01 * k * gwp
    volat = 0.46 * 0.11 * 0.01 * k * gwp
    leach = 0.46 * 0.24 * 0.011 * k * gwp
    assert comp["n2o_fertilizer"] == pytest.approx(direct + volat + leach)  # Eq. 17–23
    assert res.emissions["sum_delta_e_t_co2e"] == pytest.approx(2.886 + 4.4 + direct + volat + leach)


def test_biochar_is_subtracted_from_project_soc_change():
    bio = [em.Activity("F1", "project", 2024, "biochar", {"organic_carbon_t": 2.0}, 1, "bc")]
    ef = em.EmissionsInput((*emissions_input().activities, *bio), (em.QuantUnit("QU1", 10.0, ("F1",)),),
                           {"F1": 10.0}, 2024, {2024: 1.0}, biochar_years=(2024,))
    with_bc = E.calculate(inp(stratum(), control(), emissions=ef), rules())
    without = E.calculate(inp(stratum(), control(), emissions=emissions_input()), rules())
    assert with_bc.soc["biochar_t_co2e"] == pytest.approx(2.0 * C)
    assert with_bc.soc["soil_wp_after_biochar_t_co2e"] == pytest.approx(without.soc["soil_wp_t_co2e"] - 2.0 * C)
    assert with_bc.flags["biochar_subtracted"] and with_bc.credits_t_co2e < without.credits_t_co2e


def test_vintage_split_sums_to_period_totals():
    v = E.vintages_for(date(2021, 7, 1), date(2023, 6, 30))
    assert [x.year for x in v] == [2021, 2022, 2023]
    assert v[0].weight == pytest.approx(184 / 365) and v[1].weight == 1 and v[2].weight == pytest.approx(181 / 365)
    years = (2021, 2022, 2023)
    ef = emissions_input(base_litres=365, proj_litres=0, years=years)
    res = E.calculate(inp(stratum(), control(), x=2.0, vintages=v, emissions=ef), rules())
    rows = res.vintages
    assert sum(r["vcu"] for r in rows) == pytest.approx(res.credits_t_co2e)
    assert sum(r["buffer_er_t_co2e"] + r["buffer_cr_t_co2e"] for r in rows) == pytest.approx(res.buffer_t_co2e)
    assert sum(r["d_wp_t_co2e"] for r in rows) == pytest.approx(res.soc["d_wp_t_co2e"])
    # stock change pro rata to days; emissions per year from activity data × share of the year
    assert rows[1]["d_wp_t_co2e"] / rows[0]["d_wp_t_co2e"] == pytest.approx(365 / 184)
    assert rows[0]["sum_delta_e_t_co2e"] == pytest.approx(365 * 0.002886 * 184 / 365)
    assert rows[1]["sum_delta_e_t_co2e"] == pytest.approx(365 * 0.002886)
    # period (2 years) equals the measurement interval, so the whole measured change is credited
    assert res.soc["credited_years"] == pytest.approx(2.0)


def test_period_longer_than_interval_is_not_overcredited():
    long = E.calculate(inp(stratum(), control(), x=1.0, vintages=(E.Vintage(2023, 1.0), E.Vintage(2024, 1.0))),
                       rules())
    one = E.calculate(inp(stratum(), control(), x=1.0), rules())
    assert long.soc["soil_wp_t_co2e"] == pytest.approx(one.soc["soil_wp_t_co2e"])


def test_de_minimis_flags_but_does_not_drop_unless_rule_says_so():
    ef = emissions_input(base_litres=10, proj_litres=0)  # 0.029 t CO2e ≪ 5 % of the SOC benefit
    res = E.calculate(inp(stratum(), control(), emissions=ef), rules())
    assert "co2_fossil_fuel" in res.de_minimis["candidates"] and res.flags["de_minimis_candidates"]
    assert res.emissions["sum_delta_e_t_co2e"] == pytest.approx(10 * 0.002886)
    dropped = E.calculate(inp(stratum(), control(), emissions=ef), rules(de_minimis_exclude=True))
    assert dropped.de_minimis["excluded"] == ["co2_fossil_fuel"]
    assert dropped.emissions["sum_delta_e_t_co2e"] == pytest.approx(0)


# ------------------------------------------------------------------ gates and fail-closed
def test_qa2_needs_control_sites_or_an_allowed_modelled_baseline():
    with pytest.raises(Blocked) as e:
        E.calculate(inp(stratum()), rules())
    assert e.value.code == "CONTROL_SITES_REQUIRED"
    r = rules(baseline_scenario_required=True)
    with pytest.raises(RuleMissing) as e:
        E.calculate(inp(stratum()), r)
    assert e.value.details["rule_key"] == "baseline_scenario"
    with pytest.raises(Blocked) as e:
        E.calculate(inp(stratum(), terms={"baseline_scenario": E.Term(1.0, 0.0)}), r)
    assert e.value.code == "MODELLED_DATA_NOT_PERMITTED"
    ok = E.calculate(inp(stratum(), terms={"baseline_scenario": E.Term(1.0, 0.0)}),
                     rules(baseline_scenario_required=True, modelled_soc_permitted=True))
    assert ok.soc["soil_bsl_t_co2e"] == 1.0 and ok.flags["modelled_values_used"]


def test_control_netting_errors():
    with pytest.raises(ValidationFailed) as e:
        E.calculate(inp(stratum(), control(), terms={"baseline_scenario": E.Term(1.0)}), rules())
    assert e.value.code == "DOUBLE_COUNTING"
    with pytest.raises(RuleMissing) as e:
        E.calculate(inp(stratum(), stratum("Z2", 5.0), control()), rules())
    assert e.value.details["rule_key"] == "control_site"


def test_qa1_uses_modelled_terms_only_when_permitted():
    terms = {"soc_project_modelled": E.Term(50.0, 25.0, 30), "baseline_scenario": E.Term(10.0, 0.0)}
    with pytest.raises(Blocked) as e:
        E.calculate(inp(terms=terms), rules(qa_soc="qa1"))
    assert e.value.code == "MODELLED_DATA_NOT_PERMITTED"
    res = E.calculate(inp(terms=terms), rules(qa_soc="qa1", modelled_soc_permitted=True))
    unc = math.sqrt(25.0) / 40.0 * stats.t.ppf(0.667, 30)
    assert res.uncertainty["soc"]["unc_pct"] == pytest.approx(unc * 100)
    assert res.soc["d_wp_t_co2e"] == pytest.approx(50 * (1 - unc))
    with pytest.raises(RuleMissing):
        E.calculate(inp(terms={"soc_project_modelled": E.Term(5.0)}), rules(qa_soc="qa1", modelled_soc_permitted=True))


def test_qa1_soil_n2o_term_gets_uncertainty_and_qa3_forbids_double_counting():
    r = rules(qa_n2o_soil="qa1", modelled_soc_permitted=True)
    res = E.calculate(inp(stratum(), control(), terms={"n2o_soil": E.Term(4.0, 1.0, 20)}), r)
    unc = 1.0 / 4.0 * stats.t.ppf(0.667, 20)
    assert res.emissions["components"]["n2o_soil"] == pytest.approx(4.0 * (1 - unc))
    with pytest.raises(ValidationFailed) as e:
        E.calculate(inp(stratum(), control(), terms={"n2o_soil": E.Term(4.0)}), rules())
    assert e.value.code == "DOUBLE_COUNTING"


def test_remeasurement_interval_and_composites():
    with pytest.raises(Blocked) as e:
        E.calculate(inp(stratum(), control(), x=5.5), rules())
    assert e.value.code == "REMEASUREMENT_OVERDUE"
    with pytest.raises(Blocked) as e:
        E.calculate(inp(stratum(base=(1.0, 1.1), mon=(1.1, 1.2)), control()), rules())
    assert e.value.code == "INSUFFICIENT_SAMPLES" and e.value.details["required"] == 3


def test_unpaired_points_policies():
    s = E.StratumData("Z1", 10, tuple(pt(k, v) for k, v in zip("abcx", (1.0, 1.1, 1.2, 1.0))),
                      tuple(pt(k, v) for k, v in zip("abc", (1.1, 1.25, 1.3))))
    r = E.stratum_change(s, "paired", rules(unpaired_points_policy="exclude_and_report"), 3600, 30)
    assert r.excluded_sites == ("x",) and r.n_used == 3
    with pytest.raises(Blocked) as e:
        E.stratum_change(s, "paired", rules(unpaired_points_policy="block"), 3600, 30)
    assert e.value.code == "UNPAIRED_POINTS"


def test_design_must_be_permitted_and_welch():
    with pytest.raises(Blocked) as e:
        E.calculate(E.EngineInput("independent", (stratum(), control()), measurement_interval_years=1,
                                  vintages=ONE_YEAR), rules(sampling_design="paired"))
    assert e.value.code == "DESIGN_NOT_PERMITTED"
    assert E.welch_df([(4.0, 10), (1.0, 5)]) == pytest.approx(25 / (16 / 10 + 1 / 5))
    assert E.welch_df([(0.0, 3), (0.0, 7)]) == 3
    assert E.welch_df([(1.0, 0)]) == 0


def test_missing_rule_fails_closed_naming_the_key():
    for key in ("stock_method", "uncertainty_confidence", "non_permanence_risk_pct", "leakage_required",
                "unpaired_points_policy", "stock_depth_cm", "qa_soc", "remeasure_max_years",
                "min_composites_per_stratum", "de_minimis_pct", "esm_interpolation"):
        with pytest.raises(RuleMissing) as e:
            E.calculate(inp(stratum(), control()), rules(**{key: None}))
        assert e.value.details["rule_key"] == key, key


def test_required_legacy_terms_fail_closed_and_are_tagged():
    r = rules(leakage_required=True, project_emissions_required=True)
    with pytest.raises(RuleMissing) as e:
        E.calculate(inp(stratum(), control(), terms={"leakage": E.Term(1.0)}), r)
    assert e.value.details["rule_key"] == "project_emissions"
    res = E.calculate(inp(stratum(), control(), terms={"leakage": E.Term(1.0), "project_emissions": E.Term(2.0)}), r)
    t = {x.term: x for x in res.terms}
    assert t["leakage"].status == "supplied" and t["project_emissions"].used_as == "ΣΔE (legacy)"
    assert res.leakage["total_t_co2e"] == pytest.approx(1.0) and res.flags["legacy_terms_used"]
    assert res.emissions["components"]["legacy_terms"] == pytest.approx(-2.0)


def test_determinism_and_snapshot():
    i = inp(stratum("A", 10.0), control("CA", "A"), stratum("B", 3.0), control("CB", "B"))
    assert E.calculate(i, rules()).to_dict() == E.calculate(i, rules()).to_dict()
    assert E.input_to_dict(i) == E.input_to_dict(i)
