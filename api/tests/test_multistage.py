"""VM0042 v2.2 Appendix 6 — multi-stage sampling designs and estimators (Eq. A6.1–A6.9).

Every expected number below is worked out by hand in the comments (small datasets), and where useful cross-checked
against an independent numpy computation."""

from __future__ import annotations

import uuid
from datetime import date

import numpy as np
import pytest
from sqlalchemy import select

from app.core import db as dbmod
from app.core.errors import Blocked, ValidationFailed
from app.modules.calculation import engine as E
from app.modules.calculation import multistage as M
from app.modules.identity.models import AuditEntry
from app.modules.sampling import domain
from app.modules.sampling.models import Campaign, SamplePlan, SamplingPoint, Site
from tests._p2_factories import build_project, run_body
from tests.conftest import login, make_org, make_user
from tests.test_engine import control, pt, rules, stratum

C = 44 / 12


# =============================================================== A6.1 / A6.2 (QA1 analytical)
def _qa1_farmers() -> list[M.FarmerSample]:
    # Farmer 1, A_f = 10 ha
    #   field 1a: A=4, one stratum (4 ha) points [2, 4] → total 4·3 = 12 → Δ* = 10/4 · 12 = 30
    #   field 1b: A=5, strata 2 ha [1, 3] (→ 2·2 = 4) and 3 ha [4] (→ 12) → 16 → Δ* = 10/5 · 16 = 32
    #   Δ*_f = 31, s²_f = ((30−31)² + (32−31)²) / (2·1) = 1
    f1 = M.FarmerSample("F1", 10.0, (
        M.FieldSample("1a", 4.0, (M.Cell(4.0, (2.0, 4.0), "Z1"),)),
        M.FieldSample("1b", 5.0, (M.Cell(2.0, (1.0, 3.0), "Z1"), M.Cell(3.0, (4.0,), "Z2"))),
    ))
    # Farmer 2, A_f = 6 ha: Δ* = 6/3·3 = 6, 6/2·4 = 12, 6/1·6 = 36 → mean 18,
    #   s²_f = (144 + 36 + 324) / (3·2) = 84
    f2 = M.FarmerSample("F2", 6.0, (
        M.FieldSample("2a", 3.0, (M.Cell(3.0, (1.0, 1.0)),)),
        M.FieldSample("2b", 2.0, (M.Cell(2.0, (2.0,)),)),
        M.FieldSample("2c", 1.0, (M.Cell(1.0, (5.0, 7.0)),)),
    ))
    return [f1, f2]


def test_a6_1_field_estimates_farmer_variance_and_project_sum():
    f1, f2 = _qa1_farmers()
    assert M.a6_1_field_estimate(f1.fields[0], f1.area_ha) == pytest.approx(30.0)
    assert M.a6_1_field_estimate(f1.fields[1], f1.area_ha) == pytest.approx(32.0)
    r1 = M.a6_1_farmer(f1)
    assert r1["mean"] == pytest.approx(31.0) and r1["s2_sampling"] == pytest.approx(1.0) and r1["df"] == 1
    r2 = M.a6_1_farmer(f2)
    assert r2["field_estimates"] == pytest.approx([6.0, 12.0, 36.0])
    assert r2["mean"] == pytest.approx(18.0) and r2["s2_sampling"] == pytest.approx(84.0)
    total = M.a6_1([f1, f2])
    assert total["total"] == pytest.approx(49.0) and total["s2_sampling"] == pytest.approx(85.0)
    # independent check of the Hansen–Hurwitz variance with numpy (ddof=1 variance / k)
    assert np.var([6, 12, 36], ddof=1) / 3 == pytest.approx(84.0)


def test_a6_1_equal_probability_override_and_too_few_draws():
    # equal-probability draws from K_f = 4 fields: p = 1/4 → Δ* = 4 × field total
    fs = M.FieldSample("e", 2.0, (M.Cell(2.0, (1.5,)),), probability=0.25)
    assert M.a6_1_field_estimate(fs, 10.0) == pytest.approx(4 * 3.0)
    with pytest.raises(Blocked) as e:
        M.a6_1_farmer(M.FarmerSample("F", 10.0, (fs,)))
    assert e.value.code == "MULTISTAGE_TOO_FEW_DRAWS"
    with pytest.raises(ValidationFailed):
        M.a6_1_field_estimate(M.FieldSample("bad", 2.0, (M.Cell(2.0, (1.0,)),), probability=1.5), 10.0)
    with pytest.raises(Blocked) as e:  # stratum with area but no points
        M.a6_1_field_estimate(M.FieldSample("x", 2.0, (M.Cell(2.0, ()),)), 10.0)
    assert e.value.code == "MULTISTAGE_EMPTY_STRATUM"


def test_a6_2_combines_sampling_and_model_error():
    # s²_Δ̄ = 85 / 16² + 0.01 = 0.33203125 + 0.01
    assert M.a6_2(85.0, 16.0, 0.01) == pytest.approx(0.34203125)
    with pytest.raises(ValidationFailed):
        M.a6_2(1.0, 0.0, 0.0)


# =============================================================== A6.3–A6.7 (QA1 Monte Carlo)
def test_a6_3_point_draws_are_baseline_minus_project():
    assert M.a6_3([[1, 2], [3, 4]], [[0.5, 1], [1, 5]]) == ((0.5, 1.0), (2.0, -1.0))
    with pytest.raises(ValidationFailed):
        M.a6_3([[1, 2]], [[1, 2, 3]])


def _mc_farmers() -> list[M.McFarmer]:
    # Farmer 1, A_f = 10, L = 2 draws
    #   G1: A=5, 2 points ỹ = [[1,3],[3,5]] → Σ_i per l: 4, 8 → ×(5/2) → 10, 20 → ×(10/5) → τ̃ = 20, 40; τ̂_fj = 30
    #   G2: A=2, 1 point ỹ = [[3,5]] → ×2 → 6, 10 → ×(10/2) → 30, 50; τ̂_fj = 40
    #   τ̂_f = 35, s²_f = (25 + 25)/2 = 25; τ̃_fl = 25, 45
    f1 = M.McFarmer("F1", 10.0, (
        M.McField("G1", 5.0, (M.McCell(5.0, ((1, 3), (3, 5))),)),
        M.McField("G2", 2.0, (M.McCell(2.0, ((3, 5),)),)),
    ))
    # Farmer 2, A_f = 4
    #   H1: A=2, ỹ = [[1,2]] → ×2 → 2, 4 → ×2 → 4, 8; τ̂ = 6
    #   H2: A=4, ỹ = [[0.5,1.5]] → ×4 → 2, 6 → ×1 → 2, 6; τ̂ = 4
    #   τ̂_f = 5, s²_f = (1 + 1)/2 = 1; τ̃_fl = 3, 7
    f2 = M.McFarmer("F2", 4.0, (
        M.McField("H1", 2.0, (M.McCell(2.0, ((1, 2),)),)),
        M.McField("H2", 4.0, (M.McCell(4.0, ((0.5, 1.5),)),)),
    ))
    return [f1, f2]


def test_a6_4_monte_carlo_totals_and_mean():
    r = M.a6_4(_mc_farmers(), 14.0)
    assert [f["tau_fj"] for f in r["farmers"]] == [pytest.approx([30.0, 40.0]), pytest.approx([6.0, 4.0])]
    assert [f["tau_f"] for f in r["farmers"]] == pytest.approx([35.0, 5.0])
    assert r["tau"] == pytest.approx(40.0) and r["mu"] == pytest.approx(40.0 / 14.0) and r["L"] == 2


def test_a6_5_a6_6_variance_decomposition():
    r = M.a6_6(_mc_farmers(), 14.0)
    # τ̃_l = 25 + 3 = 28 and 45 + 7 = 52; s²_model = ((28−40)² + (52−40)²) / (2−1) = 288
    assert r["tau_l"] == pytest.approx([28.0, 52.0])
    assert r["s2_model"] == pytest.approx(288.0)
    assert [f["s2_sampling"] for f in r["farmers"]] == pytest.approx([25.0, 1.0])
    assert r["var_tau"] == pytest.approx(25 + 1 + 288)
    assert r["decomposition"] == {"variance_of_conditional_expectation": pytest.approx(26.0),
                                  "expected_conditional_variance": pytest.approx(288.0)}


def test_a6_7_variance_of_the_mean():
    assert M.a6_7(_mc_farmers(), 14.0)["var_mu"] == pytest.approx(314.0 / 14.0**2)


# =============================================================== A6.8 / A6.9 (QA2)
def _qa2_design(unit_selection="census", u1p=1.0, u1d=1, u2p=1.0, u2d=1) -> M.MultiStageDesign:
    l1 = M.DesignUnit("L1", 10.0, "pps_wr", (
        M.DesignField("J1", 4.0, {"Z1": 4.0}, probability=0.4),
        M.DesignField("J2", 5.0, {"Z1": 2.0, "Z2": 3.0}, probability=0.5),
    ), probability=u1p, draws=u1d)
    l2 = M.DesignUnit("L2", 6.0, "census", (
        M.DesignField("K1", 2.0, {"Z1": 2.0}),
        M.DesignField("K2", 4.0, {"Z2": 4.0}),
    ), probability=u2p, draws=u2d)
    sites = {"a1": "J1", "a2": "J1", "b1": "J2", "b2": "J2", "b3": "J2", "c1": "K1", "c2": "K1", "c3": "K1",
             "d1": "K2", "d2": "K2"}
    return M.MultiStageDesign("landowner", unit_selection, 16.0, (l1, l2), sites)


START = [("a1", "Z1", 10), ("a2", "Z1", 12), ("b1", "Z1", 20), ("b2", "Z2", 10), ("b3", "Z2", 14),
         ("c1", "Z1", 5), ("c2", "Z1", 6), ("c3", "Z1", 7), ("d1", "Z2", 8), ("d2", "Z2", 10)]
FINAL = [("a1", "Z1", 11), ("a2", "Z1", 14), ("b1", "Z1", 21), ("b2", "Z2", 12), ("b3", "Z2", 14),
         ("c1", "Z1", 6), ("c2", "Z1", 8), ("c3", "Z1", 7), ("d1", "Z2", 9), ("d2", "Z2", 13)]


def test_a6_9_pps_fields_with_covariance_and_census_fields():
    r = M.qa2_change(_qa2_design(), START, FINAL, paired=True)
    u1, u2 = r.units
    # L1 (PPS): J1 totals 4·11 = 44 → /0.4 = 110 (s), 4·12.5 = 50 → 125 (x)
    #           J2 totals 2·20 + 3·12 = 76 → /0.5 = 152 (s), 2·21 + 3·13 = 81 → 162 (x)
    assert u1.total_start_t == pytest.approx(131.0) and u1.total_final_t == pytest.approx(143.5)
    assert u1.s2_start == pytest.approx(441.0)  # ((−21)² + 21²) / (2·1)
    assert u1.s2_final == pytest.approx(342.25)  # ((−18.5)² + 18.5²) / 2
    assert u1.cov == pytest.approx(388.5)  # (21·18.5 + 21·18.5) / 2
    assert u1.s2_change == pytest.approx(6.25)  # 342.25 + 441 − 2·388.5; = var of d = (15, 10) mean
    assert u1.eq == "Eq. A6.9" and u1.df == 1
    # L2 (census of fields): K1 cell factor 2²/(3·2) = 2/3: s² = 4/3, 4/3, COV 2/3 → 4/3;
    #                        K2 cell factor 4²/(2·1) = 8: s² = 16, 64, COV 32 → 16
    assert u2.total_start_t == pytest.approx(2 * 6 + 4 * 9) and u2.total_final_t == pytest.approx(2 * 7 + 4 * 11)
    assert u2.s2_start == pytest.approx(4 / 3 + 16) and u2.s2_final == pytest.approx(4 / 3 + 64)
    assert u2.cov == pytest.approx(2 / 3 + 32) and u2.s2_change == pytest.approx(4 / 3 + 16)
    # A6.8 numerator and per-hectare mean
    assert r.total_start_t == pytest.approx(179.0) and r.total_final_t == pytest.approx(201.5)
    assert r.delta_t == pytest.approx(22.5)
    assert r.variance_t2 == pytest.approx(6.25 + 52 / 3)
    assert r.mean_delta_per_ha == pytest.approx(22.5 / 16) and r.variance_mean_per_ha == pytest.approx(
        (6.25 + 52 / 3) / 256)
    comps = [(6.25, 1.0), (4 / 3, 2.0), (16.0, 1.0)]  # L1 (k−1 = 1), then the two census cells (n−1)
    assert [tuple(c) for c in r.df_components] == [pytest.approx(c) for c in comps]
    assert r.df == pytest.approx(E.welch_df(comps))


def test_a6_9_independent_points_keep_field_level_covariance_only():
    r = M.qa2_change(_qa2_design(), START, FINAL, paired=False)
    u1, u2 = r.units
    assert u1.s2_change == pytest.approx(6.25)  # field-level COV still applies (same fields re-visited)
    assert u2.cov == 0.0 and u2.s2_change == pytest.approx((4 / 3 + 4 / 3) + (16 + 64))


def test_a6_9_matches_variance_of_field_differences():
    # algebraic identity: s²_x + s²_s − 2 COV = Var-of-mean of the per-draw differences
    r = M.qa2_change(_qa2_design(), START, FINAL, paired=True)
    d = np.array([125 - 110, 162 - 152], float)
    assert r.units[0].s2_change == pytest.approx(np.var(d, ddof=1) / len(d))


def test_stage1_sampled_landowners_use_hansen_hurwitz():
    # L1 p=0.5 drawn once, L2 p=0.25 drawn twice: z_s = 262, 192, 192; z_x = 287, 232, 232
    # differences 25, 40, 40 → τ̂_Δ = 35, Var = ((−10)² + 5² + 5²) / (3·2) = 25
    r = M.qa2_change(_qa2_design("pps_wr", 0.5, 1, 0.25, 2), START, FINAL, paired=True)
    assert r.total_start_t == pytest.approx((262 + 192 + 192) / 3)
    assert r.delta_t == pytest.approx(35.0) and r.variance_t2 == pytest.approx(25.0)
    assert r.unit_s2_final + r.unit_s2_start - 2 * r.unit_cov == pytest.approx(25.0)
    assert r.df == pytest.approx(2.0)


def test_equal_probability_field_draws():
    # K_f = 5 fields, two drawn with p = 1/5: expansions 5·t_j
    u = M.DesignUnit("U", 10.0, "equal_wr", (
        M.DesignField("A", 2.0, {"Z": 2.0}, probability=0.2),
        M.DesignField("B", 3.0, {"Z": 3.0}, probability=0.2)))
    d = M.MultiStageDesign("landowner", "census", 10.0, (u,), {"a": "A", "b": "B"})
    r = M.qa2_change(d, [("a", "Z", 1.0), ("b", "Z", 2.0)], [("a", "Z", 2.0), ("b", "Z", 2.0)], paired=True)
    # s: 5·2·1 = 10, 5·3·2 = 30 → 20; x: 20, 30 → 25; Δ = 5; d = (10, 0) → var = 50/2 = 25
    assert r.delta_t == pytest.approx(5.0) and r.variance_t2 == pytest.approx(25.0)
    assert r.units[0].eq == "Eq. A6.9 (equal-probability draws)"


def test_single_stage_census_of_fields_reduces_to_eq71():
    # each field is a stratum: the census estimator equals Σ_h Eq. 71
    u = M.DesignUnit("project", 7.0, "census", (M.DesignField("F1", 3.0, {"Z1": 3.0}),
                                                 M.DesignField("F2", 4.0, {"Z2": 4.0})))
    d = M.MultiStageDesign("field", "census", 7.0, (u,), {"p": "F1", "q": "F1", "r": "F1", "s": "F2", "t": "F2"})
    b1, m1, b2, m2 = [1.0, 1.2, 1.1], [1.3, 1.25, 1.5], [2.0, 2.4], [2.2, 2.3]
    start = [("p", "Z1", b1[0]), ("q", "Z1", b1[1]), ("r", "Z1", b1[2]), ("s", "Z2", b2[0]), ("t", "Z2", b2[1])]
    final = [("p", "Z1", m1[0]), ("q", "Z1", m1[1]), ("r", "Z1", m1[2]), ("s", "Z2", m2[0]), ("t", "Z2", m2[1])]
    r = M.qa2_change(d, start, final, paired=True)
    e1, e2 = E.eq71_variance(b1, m1, 3.0, True), E.eq71_variance(b2, m2, 4.0, True)
    assert r.variance_t2 == pytest.approx(e1["s2_wp"] + e2["s2_wp"])
    assert r.delta_t == pytest.approx(3 * (np.mean(m1) - np.mean(b1)) + 4 * (np.mean(m2) - np.mean(b2)))


def test_qa2_design_failures():
    d = _qa2_design()
    with pytest.raises(Blocked) as e:  # a point in a field the design did not select
        M.qa2_change(d, START + [("zz", "Z1", 1.0)], FINAL, paired=False)
    assert e.value.code == "MULTISTAGE_POINT_OUTSIDE_DESIGN"
    with pytest.raises(Blocked) as e:  # selected field never measured
        M.qa2_change(d, [p for p in START if p[0] not in ("a1", "a2")], FINAL, paired=False)
    assert e.value.code == "MULTISTAGE_FIELD_NOT_SAMPLED"
    with pytest.raises(Blocked) as e:  # point in a stratum the field has no area for
        M.qa2_change(d, [("a1", "Z2", 1.0) if p[0] == "a1" else p for p in START], FINAL, paired=False)
    assert e.value.code == "MULTISTAGE_STRATUM_NOT_IN_FIELD"
    one = M.DesignUnit("L1", 10.0, "pps_wr", (M.DesignField("J1", 4.0, {"Z1": 4.0}, probability=0.4),))
    with pytest.raises(Blocked) as e:  # one field draw for a landowner measured in full at stage 1
        M.qa2_change(M.MultiStageDesign("landowner", "census", 10.0, (one,), {"a1": "J1", "a2": "J1"}),
                     START[:2], FINAL[:2], paired=True)
    assert e.value.code == "MULTISTAGE_TOO_FEW_DRAWS"
    for bad in (
        M.MultiStageDesign("landowner", "census", 10.0, (M.DesignUnit("U", 10.0, "pps_wr", (
            M.DesignField("A", 2.0, {"Z": 1.0}, probability=0.2),)),)),  # stratum areas don't add up
        M.MultiStageDesign("landowner", "census", 10.0, (M.DesignUnit("U", 10.0, "pps_wr", (
            M.DesignField("A", 2.0, {"Z": 2.0}, probability=0.0),)),)),  # probability 0
        M.MultiStageDesign("landowner", "magic", 10.0, ()),
        M.MultiStageDesign("landowner", "census", 10.0, (M.DesignUnit("U", 10.0, "census", (
            M.DesignField("A", 2.0, {"Z": 2.0}, probability=0.5),)),)),  # census with p < 1
    ):
        with pytest.raises(ValidationFailed) as e:
            M.validate_design(bad)
        assert e.value.code == "INVALID_SAMPLING_DESIGN"


# =============================================================== engine integration
def _eng(*strata, design=None, **kw):
    return E.EngineInput("paired", tuple(strata), measurement_interval_years=2.0,
                         vintages=(E.Vintage(2023, 1.0), E.Vintage(2024, 1.0)), multistage=design, **kw)


def _census_design(*pairs: tuple[E.StratumData, str]) -> M.MultiStageDesign:
    fields = tuple(M.DesignField(f"F-{s.code}", s.area_ha, {s.code: s.area_ha}) for s, _ in pairs)
    sites = {p.site_id: f"F-{s.code}" for s, _ in pairs for p in (*s.baseline, *s.monitoring)}
    area = sum(s.area_ha for s, _ in pairs)
    return M.MultiStageDesign("field", "census", area, (M.DesignUnit("project", area, "census", fields),), sites)


@pytest.mark.parametrize("with_controls", [True, False])
def test_engine_degenerate_census_design_equals_stratified_eq70_71(with_controls):
    z1 = stratum("Z1", 10.0)
    z2 = stratum("Z2", 6.0, base=(2.0, 2.1, 2.3), mon=(2.2, 2.2, 2.5))
    strata = [z1, z2]
    kw = {}
    if with_controls:
        strata += [control("C1", "Z1"), control("C2", "Z2", base=(1.5, 1.6, 1.4), mon=(1.55, 1.6, 1.5))]
        r = rules()
    else:
        r = rules(baseline_scenario_required=True, modelled_soc_permitted=True)
        kw["terms"] = {"baseline_scenario": E.Term(1.0, 0.04, 9.0)}
    plain = E.calculate(_eng(*strata, **kw), r)
    staged = E.calculate(_eng(*strata, design=_census_design((z1, "F1"), (z2, "F2")), **kw), r)
    for attr in ("dsoc_t_c", "dsoc_variance_t_c", "dsoc_t_co2e", "dsoc_variance_t_co2e", "credits_t_co2e",
                 "uncertainty_deduction_t_co2e", "total_variance", "df_effective"):
        assert getattr(staged, attr) == pytest.approx(getattr(plain, attr), rel=1e-9), attr
    for key in ("s2_mean", "mean", "df", "unc_pct"):
        assert staged.uncertainty["soc"][key] == pytest.approx(plain.uncertainty["soc"][key], rel=1e-9), key
    eqs = {e["eq"] for e in staged.equations}
    assert {"App. 6", "Eq. A6.8", "Eq. A6.9 / Eq. 71 (fields in full)"} <= eqs and "Eq. 71" not in eqs
    assert "Eq. 71" in {e["eq"] for e in plain.equations} and "multistage" not in plain.soc
    assert staged.soc["multistage"]["estimator"] == "VM0042 v2.2 Appendix 6, Eq. A6.8–A6.9"


def test_engine_input_snapshot_unchanged_without_design():
    d = E.input_to_dict(_eng(stratum()))
    assert "multistage" not in d
    staged = E.input_to_dict(_eng(stratum(), design=_census_design((stratum(), "F"))))
    assert staged["multistage"]["stage1_unit"] == "field"


def test_engine_pps_design_uses_appendix6_totals_with_controls():
    # Z1 (one zone) spread over two fields; PPS draws of both fields, controls kept on the stratified estimator
    z1 = E.StratumData("Z1", 10.0, tuple(pt(f"s{i}", v) for i, v in enumerate((1.0, 1.1, 1.2, 1.3))),
                       tuple(pt(f"s{i}", v) for i, v in enumerate((1.1, 1.25, 1.3, 1.5))))
    c1 = control("C1", "Z1")
    fields = (M.DesignField("FA", 4.0, {"Z1": 4.0}, probability=0.4),
              M.DesignField("FB", 6.0, {"Z1": 6.0}, probability=0.6))
    design = M.MultiStageDesign("field", "census", 10.0, (M.DesignUnit("project", 10.0, "pps_wr", fields),),
                                {"s0": "FA", "s1": "FA", "s2": "FB", "s3": "FB"})
    res = E.calculate(_eng(z1, c1, design=design), rules())
    plain = E.calculate(_eng(z1, c1), rules())
    stocks_b = {p.site_id: p.stock_t_c_ha for p in res.strata[0].baseline_points}
    stocks_m = {p.site_id: p.stock_t_c_ha for p in res.strata[0].monitoring_points}
    # field estimates e_j = (A_j · mean_j) / p_j = 10 · mean_j
    ea_s, eb_s = 10 * np.mean([stocks_b["s0"], stocks_b["s1"]]), 10 * np.mean([stocks_b["s2"], stocks_b["s3"]])
    ea_x, eb_x = 10 * np.mean([stocks_m["s0"], stocks_m["s1"]]), 10 * np.mean([stocks_m["s2"], stocks_m["s3"]])
    delta = (ea_x + eb_x) / 2 - (ea_s + eb_s) / 2
    v_pr = np.var([ea_x - ea_s, eb_x - eb_s], ddof=1) / 2
    ms = res.soc["multistage"]
    assert ms["delta_t_c"] == pytest.approx(delta) and ms["variance_project_t_c2"] == pytest.approx(v_pr)
    ctrl = res.control_strata[0]
    assert ms["variance_control_t_c2"] == pytest.approx(ctrl.measured_variance * 100)
    # Eq. 46/47 totals and Eq. 70/A6.8 per-hectare variance
    assert res.soc["soil_wp_t_co2e"] == pytest.approx(delta / 2.0 * C * 2.0)
    assert res.soc["soil_bsl_t_co2e"] == pytest.approx(ctrl.measured_delta_t_c_ha * 10 / 2.0 * C * 2.0)
    assert res.uncertainty["soc"]["s2_mean"] == pytest.approx((v_pr + ctrl.measured_variance * 100) / 100)
    assert res.uncertainty["soc"]["s2_mean"] != pytest.approx(plain.uncertainty["soc"]["s2_mean"])
    assert any(e["eq"] == "Eq. A6.9" for e in res.equations)


def test_engine_staged_design_skips_unsampled_zone_without_control():
    z1 = stratum("Z1", 10.0)
    empty = E.StratumData("Z2", 5.0, (), ())
    design = _census_design((z1, "F1"))
    design = M.MultiStageDesign("field", "census", 15.0, design.units, design.site_fields)
    r = rules(baseline_scenario_required=True, modelled_soc_permitted=True)
    res = E.calculate(_eng(z1, empty, design=design, terms={"baseline_scenario": E.Term(0.0)}), r)
    assert [s.code for s in res.strata] == ["Z1"]
    with pytest.raises(Blocked):  # without a design the empty zone still blocks, as before
        E.calculate(_eng(z1, empty, terms={"baseline_scenario": E.Term(0.0)}), r)


# =============================================================== design validation (sampling domain)
def _population():
    return {"area_ha": 20.0, "units": {
        "L1": {"label": "F-001", "area_ha": 12.0, "fields": {
            "a": {"label": "A", "area_ha": 4.0, "strata": {"Z1": 4.0}},
            "b": {"label": "B", "area_ha": 8.0, "strata": {"Z1": 8.0}}}},
        "L2": {"label": "F-002", "area_ha": 8.0, "fields": {
            "c": {"label": "C", "area_ha": 8.0, "strata": {"Z2": 8.0}}}},
    }}


def _spec(**over):
    s = {"stage1_unit": "landowner", "stage1_selection": "census", "stage2_selection": "pps_wr", "units": [
        {"unit_id": "L1", "draws": 1, "selection_probability": None, "fields": [
            {"field_id": "a", "draws": 1, "selection_probability": None},
            {"field_id": "b", "draws": 1, "selection_probability": 8 / 12}]},
        {"unit_id": "L2", "draws": 1, "selection_probability": None, "fields": [
            {"field_id": "c", "draws": 2, "selection_probability": None}]}]}
    s.update(over)
    return s


def test_design_validation_computes_probabilities():
    norm, problems = domain.validate_multistage_design(_spec(), _population())
    assert problems == []
    l1, l2 = norm["units"]
    assert l1["selection_probability"] == 1.0 and l1["inclusion_probability"] == 1.0
    assert [f["selection_probability"] for f in l1["fields"]] == pytest.approx([4 / 12, 8 / 12])
    # π = 1 − (1 − p)^m with m = 2 draws in landowner L1
    assert l1["fields"][0]["inclusion_probability"] == pytest.approx(1 - (1 - 1 / 3) ** 2)
    assert l2["fields"][0]["selection_probability"] == 1.0 and l2["population_count"] == 1
    assert norm["population_area_ha"] == 20.0 and norm["population_unit_count"] == 2
    # stage 1 by PPS: p = A_f / A
    norm, problems = domain.validate_multistage_design(
        _spec(stage1_selection="pps_wr", units=[{**_spec()["units"][0], "draws": 2}]), _population())
    assert problems == [] and norm["units"][0]["selection_probability"] == pytest.approx(0.6)
    assert norm["units"][0]["inclusion_probability"] == pytest.approx(1 - 0.4**2)


@pytest.mark.parametrize("spec, fragment", [
    (_spec(units=[_spec()["units"][0]]), "census must list every"),  # landowner census missing L2
    (_spec(units=[{**_spec()["units"][0], "fields": [{"field_id": "a", "draws": 1, "selection_probability": None}]},
                  _spec()["units"][1]]), "at least 2 draws"),
    (_spec(units=[{**_spec()["units"][0], "fields": [{"field_id": "a", "draws": 1, "selection_probability": 0.9},
                                                     {"field_id": "b", "draws": 1, "selection_probability": None}]},
                  _spec()["units"][1]]), "does not match"),
    (_spec(units=[*_spec()["units"], {"unit_id": "L9", "draws": 1, "fields": []}]), "not part of the sampled"),
    (_spec(stage2_selection=None), "stage2_selection"),
    (_spec(stage1_unit="field", stage2_selection=None, units=[{"unit_id": "a", "draws": 1, "fields": [
        {"field_id": "a", "draws": 1}]}]), "no nested fields"),
    (_spec(stage2_selection="census", units=[{**_spec()["units"][0], "fields": [
        {"field_id": "a", "draws": 2, "selection_probability": None},
        {"field_id": "b", "draws": 1, "selection_probability": None}]}, _spec()["units"][1]]), "every “draws” must be 1"),
    (_spec(units=[{**_spec()["units"][0], "fields": [{"field_id": "a", "draws": 1}, {"field_id": "a", "draws": 1}]},
                  _spec()["units"][1]]), "more than once"),
])
def test_design_validation_failures(spec, fragment):
    _, problems = domain.validate_multistage_design(spec, _population())
    assert any(fragment in p for p in problems), problems


# =============================================================== API
def _set_status(campaign_id: str, status: str) -> None:
    with dbmod.session_factory()() as s:
        s.get(Campaign, uuid.UUID(campaign_id)).status = status
        s.commit()


@pytest.fixture()
def analyst(as_role):
    return as_role("mrv_analyst")


def _pps_body(b, **over):
    return {"stage1_unit": "field", "stage1_selection": "pps_wr",
            "units": [{"unit_id": f, "draws": 1} for f in b.field_ids],
            "justification": "Fields drawn by PPS with replacement (VM0042 Appendix 6).", **over}


def test_api_design_crud_lock_audit_and_permissions(client, org, as_role, analyst):
    b = build_project(org)
    url = f"/api/campaigns/{b.monitoring_id}/sampling-design"
    assert client.get(url, headers=analyst).status_code == 404
    # locked while the campaign is not planned
    r = client.post(url, headers=analyst, json=_pps_body(b))
    assert r.status_code == 409 and r.json()["code"] == "DESIGN_LOCKED"
    _set_status(b.monitoring_id, "planned")
    pop = client.get(f"/api/projects/{b.project_id}/sampling-design/population?stage1_unit=landowner",
                     headers=analyst).json()
    assert pop["unit_count"] == 1 and len(pop["units"][0]["fields"]) == 2  # project fields only, not controls
    assert client.post(url, headers=as_role("field_collector"), json=_pps_body(b)).status_code == 403
    bad = client.post(url, headers=analyst, json=_pps_body(b, units=[{"unit_id": b.field_ids[0], "draws": 1}]))
    assert bad.status_code == 422 and bad.json()["code"] == "INVALID_SAMPLING_DESIGN"
    ok = client.post(url, headers=analyst, json=_pps_body(b))
    assert ok.status_code == 201, ok.text
    d = ok.json()
    assert d["status"] == "draft" and d["version"] == 1 and d["stage1_draws"] == 2
    total = pop["area_ha"]
    assert sum(u["selection_probability"] for u in d["units"]) == pytest.approx(1.0)
    assert d["units"][0]["selection_probability"] == pytest.approx(d["units"][0]["area_ha"] / total)
    assert client.post(url, headers=analyst, json=_pps_body(b)).json()["code"] == "DESIGN_EXISTS"
    upd = client.put(url, headers=analyst, json=_pps_body(b, units=[{"unit_id": f, "draws": 2} for f in b.field_ids]))
    assert upd.status_code == 200 and upd.json()["version"] == 2 and upd.json()["stage1_draws"] == 4
    # other organisation: not found
    other = login(client, make_user(make_org("Other Org"), "mrv_analyst"))
    assert client.get(url, headers=other).status_code == 404
    _set_status(b.monitoring_id, "fieldwork")
    locked = client.put(url, headers=analyst, json=_pps_body(b))
    assert locked.status_code == 409 and locked.json()["code"] == "DESIGN_LOCKED"
    assert client.delete(url, headers=analyst).status_code == 409
    got = client.get(url, headers=analyst).json()
    assert got["locked"] is True and got["status"] == "locked"
    with dbmod.session_factory()() as s:
        actions = set(s.scalars(select(AuditEntry.action).where(AuditEntry.entity_type == "SamplingDesign")))
    assert {"sampling_design.create", "sampling_design.update"} <= actions


def test_api_delete_while_planned(client, org, analyst):
    b = build_project(org)
    _set_status(b.monitoring_id, "planned")
    url = f"/api/campaigns/{b.monitoring_id}/sampling-design"
    assert client.post(url, headers=analyst, json=_pps_body(b)).status_code == 201
    assert client.delete(url, headers=analyst).status_code == 204
    assert client.get(url, headers=analyst).status_code == 404


def test_api_run_with_multistage_design(client, org, analyst):
    b = build_project(org)
    _set_status(b.monitoring_id, "planned")
    url = f"/api/campaigns/{b.monitoring_id}/sampling-design"
    d = client.post(url, headers=analyst, json=_pps_body(b)).json()
    _set_status(b.monitoring_id, "complete")
    plain_b = build_project(org)  # identical project without a design, for comparison
    r = client.post(f"/api/projects/{b.project_id}/calculations", headers=analyst, json=run_body(b))
    assert r.status_code == 201, r.text
    res = r.json()["results"]
    ms = res["soc"]["multistage"]
    assert ms["design_id"] == d["id"] and ms["stage1_unit"] == "field"
    assert any(e["eq"] == "Eq. A6.9" for e in res["equations"])
    assert any(e["eq"] == "Eq. A6.8" for e in res["equations"])
    assert any(e["eq"] == "App. 6" and "probability proportional to size" in e["label"] for e in res["equations"])
    # hand computation from the point stocks: e_j = (A_j · mean_j) / p_j
    with dbmod.session_factory()() as s:
        field_of = {str(x.id): str(x.field_id) for x in s.scalars(select(Site).where(
            Site.project_id == uuid.UUID(b.project_id)))}
    p = {u["id"]: u["selection_probability"] for u in d["units"]}
    area = {u["id"]: u["area_ha"] for u in d["units"]}
    st = res["strata"][0]

    def est(points):
        by = {}
        for q in points:
            by.setdefault(field_of[q["site_id"]], []).append(q["stock_t_c_ha"])
        return {f: area[f] * np.mean(v) / p[f] for f, v in by.items()}

    es, ex = est(st["baseline_points"]), est(st["monitoring_points"])
    diffs = [ex[f] - es[f] for f in b.field_ids]
    assert ms["delta_t_c"] == pytest.approx(np.mean(diffs))
    assert ms["variance_project_t_c2"] == pytest.approx(np.var(diffs, ddof=1) / 2)
    snap = client.get(f"/api/calculations/{r.json()['id']}", headers=analyst).json()["inputs_snapshot"]
    assert snap["sources"]["sampling_design"]["id"] == d["id"]
    assert snap["engine_input"]["multistage"]["units"][0]["field_selection"] == "pps_wr"
    # the same project without a design keeps the stratified path
    plain = client.post(f"/api/projects/{plain_b.project_id}/calculations", headers=analyst,
                        json=run_body(plain_b)).json()["results"]
    assert "multistage" not in plain["soc"] and any(e["eq"] == "Eq. 71" for e in plain["equations"])


def test_api_mismatched_campaign_designs_block_the_run(client, org, analyst):
    b = build_project(org)
    for cid, draws in ((b.baseline_id, 1), (b.monitoring_id, 2)):
        _set_status(cid, "planned")
        body = _pps_body(b, units=[{"unit_id": f, "draws": draws} for f in b.field_ids])
        assert client.post(f"/api/campaigns/{cid}/sampling-design", headers=analyst, json=body).status_code == 201
        _set_status(cid, "complete")
    r = client.post(f"/api/projects/{b.project_id}/calculations", headers=analyst, json=run_body(b))
    assert r.status_code == 409 and r.json()["code"] == "DESIGN_MISMATCH", r.text


def test_point_placement_uses_only_selected_fields(client, org, analyst):
    b = build_project(org)
    with dbmod.session_factory()() as s:
        mon = s.get(Campaign, uuid.UUID(b.monitoring_id))
        c = Campaign(org_id=mon.org_id, created_by=mon.created_by, project_id=mon.project_id, code="BL-MS",
                     name="Staged baseline", kind="baseline", design="independent", planned_start=date(2026, 1, 1),
                     planned_end=date(2026, 3, 1), depth_to_cm=50, placement_seed=7, status="planned")
        s.add(c)
        s.flush()
        for sid in (b.stratum_id, b.control_stratum_id):
            s.add(SamplePlan(org_id=mon.org_id, created_by=mon.created_by, campaign_id=c.id,
                             stratum_id=uuid.UUID(sid), n_required=3, status="approved"))
        s.commit()
        cid = str(c.id)
    chosen = b.field_ids[0]
    body = _pps_body(b, units=[{"unit_id": chosen, "draws": 2}])
    assert client.post(f"/api/campaigns/{cid}/sampling-design", headers=analyst, json=body).status_code == 201
    r = client.post(f"/api/campaigns/{cid}/place-points", headers=analyst)
    assert r.status_code == 201, r.text
    with dbmod.session_factory()() as s:
        rows = s.execute(select(Site.field_id, Site.stratum_id).join(SamplingPoint, SamplingPoint.site_id == Site.id)
                         .where(SamplingPoint.campaign_id == uuid.UUID(cid))).all()
    project_fields = {str(f) for f, st in rows if str(st) == b.stratum_id}
    assert project_fields == {chosen}
    assert sum(1 for _, st in rows if str(st) == b.stratum_id) == 3
    assert {str(f) for f, st in rows if str(st) == b.control_stratum_id} <= set(b.control_field_ids)
    assert any(str(st) == b.control_stratum_id for _, st in rows)  # controls still placed
