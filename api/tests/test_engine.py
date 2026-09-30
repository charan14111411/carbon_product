"""Hand-computed reference cases for the pure quantification engine."""

from __future__ import annotations

import math

import numpy as np
import pytest
from scipy import stats

from app.core.errors import Blocked, RuleMissing, ValidationFailed
from app.modules.calculation import engine as E
from app.modules.calculation.models import TERMS
from app.modules.methodology.definitions import RULES
from app.modules.methodology.ruleset import from_values

BASE_RULES = {r.key: r.example for r in RULES}
BASE_RULES.update({
    "coarse_fragment_correction": False,
    "baseline_scenario_required": False, "project_emissions_required": False,
    "baseline_emissions_required": False, "leakage_required": False,
})


def rules(**over):
    v = dict(BASE_RULES)
    v.update(over)
    return from_values({k: x for k, x in v.items() if x is not None})


def one_layer(site: str, soc: float, bd: float = 1.2, depth: float = 30, cf: float | None = None) -> E.Point:
    return E.Point(site, (E.Layer(f"{site}-D1", 0, depth, bd, soc, cf),), sample_code=f"S-{site}")


def stratum(code="Z1", area=10.0, base=(1.0, 1.1, 1.2), mon=(1.1, 1.25, 1.3), role="project", control_for=None,
            base_sites=None, mon_sites=None):
    bs = base_sites or [f"{code}-{i}" for i in range(len(base))]
    ms = mon_sites or [f"{code}-{i}" for i in range(len(mon))]
    return E.StratumData(code, area, tuple(one_layer(s, v) for s, v in zip(bs, base)),
                         tuple(one_layer(s, v) for s, v in zip(ms, mon)), role, control_for)


# ------------------------------------------------------------------ stocks
def test_terms_constant_matches_model():
    assert E.ENGINE_TERMS == TERMS


def test_one_layer_fixed_depth_reference_values():
    r = rules()
    assert E.point_stock(one_layer("a", 1.5, 1.2), r).stock_t_c_ha == pytest.approx(54.0)
    assert E.point_stock(one_layer("b", 1.82, 1.21), r).stock_t_c_ha == pytest.approx(66.066)


def test_fixed_depth_prorates_straddling_layer():
    p = E.Point("a", (E.Layer("L1", 0, 20, 1.0, 1.0), E.Layer("L2", 20, 40, 1.5, 0.5)))
    # 0-20: 1.0*20*100*0.01 = 20; 20-30 of 20-40: 1.5*20*100*0.005 = 15 → half = 7.5
    assert E.point_stock(p, rules(stock_depth_cm=30)).stock_t_c_ha == pytest.approx(27.5)


def test_short_profile_is_blocked():
    with pytest.raises(Blocked) as e:
        E.point_stock(one_layer("a", 1.0, depth=20), rules(stock_depth_cm=30))
    assert e.value.code == "DEPTH_MISMATCH"


def test_layer_gap_is_blocked():
    p = E.Point("a", (E.Layer("L1", 0, 10, 1.0, 1.0), E.Layer("L2", 12, 30, 1.0, 1.0)))
    with pytest.raises(Blocked) as e:
        E.point_stock(p, rules())
    assert e.value.code == "LAYER_GAP"


def test_coarse_fraction_correction():
    r = rules(coarse_fragment_correction=True)
    # 1.2*30*100*(1-0.25) = 2700 t/ha; *1.5% = 40.5
    assert E.point_stock(one_layer("a", 1.5, cf=0.25), r).stock_t_c_ha == pytest.approx(40.5)
    with pytest.raises(RuleMissing) as e:
        E.point_stock(one_layer("a", 1.5), r)
    assert e.value.details["rule_key"] == "coarse_fraction"
    # When the correction is not required the fraction is ignored.
    assert E.point_stock(one_layer("a", 1.5, cf=0.25), rules()).stock_t_c_ha == pytest.approx(54.0)


def test_esm_interpolation():
    p = E.Point("a", (E.Layer("L1", 0, 10, 1.0, 2.0), E.Layer("L2", 10, 30, 1.5, 1.0)))
    # cum mass: 0, 1000, 4000; cum C: 0, 20, 20+30=50. Reference 2500 → 20 + 0.5*30 = 35
    r = rules(stock_method="esm", esm_reference_mass_t_ha=2500)
    ps = E.point_stock(p, r)
    assert ps.stock_t_c_ha == pytest.approx(35.0) and ps.fine_mass_t_ha == 2500
    assert ps.stock_t_c_ha == pytest.approx(float(np.interp(2500, [0, 1000, 4000], [0, 20, 50])))
    with pytest.raises(Blocked) as e:
        E.point_stock(p, rules(stock_method="esm", esm_reference_mass_t_ha=5000))
    assert e.value.code == "DEPTH_MISMATCH"
    with pytest.raises(RuleMissing) as e:
        E.point_stock(p, rules(stock_method="esm", esm_reference_mass_t_ha=None))
    assert e.value.details["rule_key"] == "esm_reference_mass_t_ha"


# ------------------------------------------------------------------ strata
def test_paired_stratum_change():
    s = stratum(base=(1.0, 1.1, 1.2), mon=(1.1, 1.25, 1.3))
    r = E.stratum_change(s, "paired", rules())
    d = np.array([1.1 - 1.0, 1.25 - 1.1, 1.3 - 1.2]) * 36  # 1% SOC == 36 t C/ha at bd 1.2, 30 cm
    assert r.delta_t_c_ha == pytest.approx(d.mean())
    assert r.variance == pytest.approx(d.var(ddof=1) / 3)
    assert r.df == 2 and r.n_used == 3


def test_unpaired_points_policies():
    s = stratum(base=(1.0, 1.1, 1.2, 1.0), mon=(1.1, 1.25, 1.3), base_sites=["a", "b", "c", "x"],
                mon_sites=["a", "b", "c"])
    r = E.stratum_change(s, "paired", rules(unpaired_points_policy="exclude_and_report"))
    assert r.excluded_sites == ("x",) and r.n_used == 3
    with pytest.raises(Blocked) as e:
        E.stratum_change(s, "paired", rules(unpaired_points_policy="block"))
    assert e.value.code == "UNPAIRED_POINTS" and e.value.details["sites"] == ["x"]


def test_insufficient_samples():
    with pytest.raises(Blocked) as e:
        E.stratum_change(stratum(base=(1.0,), mon=(1.1,)), "paired", rules())
    assert e.value.code == "INSUFFICIENT_SAMPLES"
    with pytest.raises(Blocked):
        E.stratum_change(stratum(base=(1.0, 1.1), mon=(1.1,)), "independent", rules())


def test_independent_stratum_change_and_welch_df():
    base, mon = (1.0, 1.2, 1.1, 0.9), (1.3, 1.1, 1.4)
    s = stratum(base=base, mon=mon, mon_sites=["m1", "m2", "m3"])
    r = E.stratum_change(s, "independent", rules(sampling_design="either"))
    b, m = np.array(base) * 36, np.array(mon) * 36
    vb, vm = b.var(ddof=1) / 4, m.var(ddof=1) / 3
    assert r.delta_t_c_ha == pytest.approx(m.mean() - b.mean())
    assert r.variance == pytest.approx(vb + vm)
    assert r.df == pytest.approx((vb + vm) ** 2 / (vb**2 / 3 + vm**2 / 2))


def test_welch_formula():
    assert E.welch_df([(4.0, 10), (1.0, 5)]) == pytest.approx(25 / (16 / 10 + 1 / 5))
    assert E.welch_df([(0.0, 3), (0.0, 7)]) == 3
    assert E.welch_df([(1.0, 0)]) == 0


def test_design_must_be_permitted():
    inp = E.EngineInput("independent", (stratum(),))
    with pytest.raises(Blocked) as e:
        E.calculate(inp, rules(sampling_design="paired"))
    assert e.value.code == "DESIGN_NOT_PERMITTED"


# ------------------------------------------------------------------ project
def test_full_project_reference_case():
    r = rules()
    s = stratum(area=10.0)
    res = E.calculate(E.EngineInput("paired", (s,)), r)
    sr = E.stratum_change(s, "paired", r)
    dsoc = sr.delta_t_c_ha * 10 * 44 / 12
    var = sr.variance * 100 * (44 / 12) ** 2
    t = stats.t.ppf(0.667, 2)
    ded = t * math.sqrt(var)
    net_after = dsoc - ded
    buf = net_after * 0.15
    assert res.dsoc_t_co2e == pytest.approx(dsoc)
    assert res.total_variance == pytest.approx(var)
    assert res.df_effective == pytest.approx(2)
    assert res.uncertainty_deduction_t_co2e == pytest.approx(ded)
    assert res.buffer_t_co2e == pytest.approx(buf)
    assert res.credits_t_co2e == pytest.approx(net_after - buf)
    assert res.reductions_t_co2e + res.removals_t_co2e == pytest.approx(res.credits_t_co2e)
    assert res.removals_t_co2e == pytest.approx(res.credits_t_co2e)  # pure SOC gain → all removals
    d = res.to_dict()
    assert d["strata"][0]["code"] == "Z1" and d["rules_snapshot"]["values"]["stock_method"] == "fixed_depth"


def test_terms_are_applied_and_required_terms_fail_closed():
    r = rules(baseline_scenario_required=True, project_emissions_required=True, leakage_required=True,
              baseline_emissions_required=True)
    s = stratum(area=10.0)
    terms = {
        "baseline_scenario": E.Term(5.0, 1.0, 10, "model"), "project_emissions": E.Term(3.0, 0.5, None, "calc"),
        "baseline_emissions": E.Term(2.0, 0.0, None, "calc"), "leakage": E.Term(1.0, 0.0, None, "calc"),
    }
    res = E.calculate(E.EngineInput("paired", (s,), terms), r)
    assert res.gross_t_co2e == pytest.approx(res.dsoc_t_co2e - 5 + 2 - 3)
    assert res.net_before_uncertainty_t_co2e == pytest.approx(res.gross_t_co2e - 1)
    assert res.total_variance == pytest.approx(res.dsoc_variance_t_co2e + 1.5)
    assert res.reductions_t_co2e + res.removals_t_co2e == pytest.approx(res.credits_t_co2e, abs=1e-6)
    missing = dict(terms)
    missing.pop("leakage")
    with pytest.raises(RuleMissing) as e:
        E.calculate(E.EngineInput("paired", (s,), missing), r)
    assert e.value.details["rule_key"] == "leakage"
    # Not required → zero with a clear source.
    res2 = E.calculate(E.EngineInput("paired", (s,)), rules())
    assert all(t.status == "not_required_by_rules" and t.value_t_co2e == 0 for t in res2.terms)


def test_missing_rule_fails_closed_naming_the_key():
    for key in ("stock_method", "uncertainty_confidence", "non_permanence_risk_pct", "leakage_required",
                "unpaired_points_policy", "stock_depth_cm"):
        with pytest.raises(RuleMissing) as e:
            E.calculate(E.EngineInput("paired", (stratum(),)), rules(**{key: None}))
        assert e.value.details["rule_key"] == key


def test_negative_result_is_not_floored():
    s = stratum(base=(1.3, 1.25, 1.4), mon=(1.1, 1.1, 1.2))
    res = E.calculate(E.EngineInput("paired", (s,)), rules())
    assert res.net_before_uncertainty_t_co2e < 0
    assert res.flags["carbon_lost"] is True
    assert res.credits_t_co2e == pytest.approx(res.net_before_uncertainty_t_co2e)
    assert res.uncertainty_deduction_t_co2e == 0 and res.buffer_t_co2e == 0
    assert res.reductions_t_co2e == res.credits_t_co2e and res.removals_t_co2e == 0


def test_control_site_netting():
    proj = stratum("Z1", 10.0, base=(1.0, 1.1, 1.2), mon=(1.2, 1.3, 1.45))
    ctrl = stratum("C1", 1.0, base=(1.0, 1.05, 1.1), mon=(1.02, 1.1, 1.12), role="control", control_for="Z1")
    r = rules(baseline_scenario_required=True)
    res = E.calculate(E.EngineInput("paired", (proj, ctrl)), r)
    p = E.stratum_change(proj, "paired", r)
    c = E.stratum_change(ctrl, "paired", r)
    s0 = res.strata[0]
    assert s0.delta_t_c_ha == pytest.approx(p.delta_t_c_ha - c.delta_t_c_ha)
    assert s0.variance == pytest.approx(p.variance + c.variance)
    assert s0.df == pytest.approx(E.welch_df([(p.variance, 2), (c.variance, 2)]))
    bs = next(t for t in res.terms if t.term == "baseline_scenario")
    assert bs.source == "measured_at_control_sites" and bs.value_t_co2e == 0
    assert res.dsoc_t_co2e == pytest.approx(s0.delta_t_c_ha * 10 * E.CO2_PER_C)  # control area not credited
    with pytest.raises(ValidationFailed) as e:
        E.calculate(E.EngineInput("paired", (proj, ctrl), {"baseline_scenario": E.Term(1.0)}), r)
    assert e.value.code == "DOUBLE_COUNTING"
    other = stratum("Z2", 5.0)
    with pytest.raises(RuleMissing) as e:
        E.calculate(E.EngineInput("paired", (proj, ctrl, other)), r)
    assert e.value.details["rule_key"] == "control_site"


def test_reductions_removals_split_sums():
    sp = E.split_reductions_removals(d_wp=100, d_bsl=-20, baseline_emissions=10, project_emissions=4, leakage=6,
                                     deduction=12, buffer=9, cumulative_stock_change=100)
    # losses = 0 - (-20) = 20; gains = 100; ER = 6 + 20 = 26; CR = 100
    assert sp["er_gross"] == pytest.approx(26) and sp["cr_gross"] == pytest.approx(100)
    assert sp["reductions_t_co2e"] + sp["removals_t_co2e"] == pytest.approx(126 - 6 - 12 - 9)
    assert sp["leakage_er"] == pytest.approx(6 * 26 / 126)
    no_cum = E.split_reductions_removals(d_wp=100, d_bsl=0, baseline_emissions=0, project_emissions=0, leakage=0,
                                         deduction=0, buffer=0, cumulative_stock_change=-5)
    assert no_cum["removals_t_co2e"] == 0 and no_cum["reductions_t_co2e"] == pytest.approx(100)


def test_deduction_increases_as_n_shrinks():
    rng = np.random.default_rng(7)
    base = 1.0 + rng.normal(0, 0.05, 12)
    mon = base + 0.15 + rng.normal(0, 0.05, 12)
    small = E.calculate(E.EngineInput("paired", (stratum(base=tuple(base[:4]), mon=tuple(mon[:4])),)), rules())
    large = E.calculate(E.EngineInput("paired", (stratum(base=tuple(base), mon=tuple(mon)),)), rules())
    rel_small = small.uncertainty_deduction_t_co2e / small.net_before_uncertainty_t_co2e
    rel_large = large.uncertainty_deduction_t_co2e / large.net_before_uncertainty_t_co2e
    assert rel_small > rel_large


def test_high_uncertainty_flag():
    noisy = stratum(base=(1.0, 1.5, 0.8), mon=(1.4, 1.2, 1.1))
    res = E.calculate(E.EngineInput("paired", (noisy,)), rules())
    assert res.flags["high_uncertainty"] is True


def test_project_df_across_strata():
    a, b = stratum("A", 10.0), stratum("B", 4.0, base=(1.0, 1.2, 1.1, 1.3), mon=(1.2, 1.3, 1.3, 1.35))
    r = rules()
    res = E.calculate(E.EngineInput("paired", (a, b)), r)
    ra, rb = E.stratum_change(a, "paired", r), E.stratum_change(b, "paired", r)
    k = E.CO2_PER_C**2
    assert res.df_effective == pytest.approx(E.welch_df([(ra.variance * 100 * k, 2), (rb.variance * 16 * k, 3)]))
    assert res.dsoc_t_c == pytest.approx(ra.delta_t_c_ha * 10 + rb.delta_t_c_ha * 4)


def test_determinism():
    inp = E.EngineInput("paired", (stratum("A", 10.0), stratum("B", 3.0)))
    assert E.calculate(inp, rules()).to_dict() == E.calculate(inp, rules()).to_dict()
    assert E.input_to_dict(inp) == E.input_to_dict(inp)
