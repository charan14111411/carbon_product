"""Independent audit of the platform against the original VM0042 v2.2 text (Verra, 21 Oct 2025).

Two kinds of test live here:

1. Worked examples printed in the methodology (footnote 8, the §7 additionality example, the
   §8.6.3 EF_Ndirect range, the Eq. 74 t-value, Figure 3 / Wendt & Hauser ESM numbers, Appendix 5
   slope classes, the fixed constants), reproduced through the platform's pure functions.
2. Hand calculations of Eq. 37–47 and Eq. 70/71/74–79 on a small made-up dataset. The reference
   implementation below (``ref_*``) was written by the auditor from the PDF text only (printed pages
   cited); it does not import or copy engine code. The engine must agree to 1e-9.

A test that fails because the platform deviates from the PDF is kept and marked
``xfail(strict=True, reason="AUDIT: …")`` — application code is not changed here.
Page numbers are the PDF's printed page numbers (they equal the PDF page index for this file).
"""

from __future__ import annotations

import math
from datetime import date
from statistics import mean

import pytest
from scipy import stats

from app.core.errors import Blocked
from app.modules.additionality import domain as add
from app.modules.baseline import domain as bl
from app.modules.calculation import engine as E
from app.modules.controlsites import domain as cs
from app.modules.emissions import domain as em
from app.modules.land import domain as land
from app.modules.methodology.definitions import BY_KEY, EXAMPLE_FACTORS, RULES
from app.modules.methodology.ruleset import from_values
from app.modules.sampling import domain as smp

TOL = 1e-9

# ---------------------------------------------------------------------------------------------------
# Auditor's reference implementation — from the PDF text only
# ---------------------------------------------------------------------------------------------------
CO2_C = 44.0 / 12.0  # Eq. 9, 33; note under Eq. 47 p.59
N2O_N = 44.0 / 28.0  # Eq. 18, 22–24, 27, 30–31
GWP_N2O_PDF = 265  # §9.1 p.89
EF_DIESEL_PDF = 0.002886  # §9.2 p.102 (t CO2e / L)
RETENTION_PDF = 0.12  # Eq. 33 p.51–52


def ref_soc_stock(soc_pct: float, bd: float = 1.2, depth_cm: float = 30.0) -> float:
    """t C/ha of a single fixed layer: soil mass (BD g/cm³ × depth cm × 100 = t/ha, Eq. 4 factor p.37) × SOC fraction."""
    return bd * depth_cm * 100.0 * soc_pct / 100.0


def ref_eq71(start: list[float], final: list[float], area_h: float) -> float:
    """Eq. 71 p.77: s²_Δ,h = s²_f + s²_s − 2 COV(f, s), each = A_h²/(n_h(n_h−1)) × Σ(...) over the same points."""
    n = len(start)
    assert n == len(final)
    ms, mf = mean(start), mean(final)
    k = area_h**2 / (n * (n - 1))
    s2_f = k * sum((x - mf) ** 2 for x in final)
    s2_s = k * sum((x - ms) ** 2 for x in start)
    cov = k * sum((s - ms) * (f - mf) for s, f in zip(start, final))
    return s2_f + s2_s - 2.0 * cov


def ref_satterthwaite(components: list[tuple[float, float]]) -> float:
    """Effective df of a sum of independent variance estimates (Satterthwaite). VM0042 p.82 only says "df
    appropriate to the sampling design"; this is the auditor's choice of a standard design-based df."""
    tot = sum(v for v, _ in components)
    return tot**2 / sum(v**2 / d for v, d in components if v > 0)


def ref_eq74(s2_mean: float, mean_err: float, t_value: float) -> float:
    """Eq. 74 p.82 as a fraction: (√s² / mean ERR × 100) × t_0.667 / 100."""
    return math.sqrt(s2_mean) / abs(mean_err) * t_value


def ref_eq37(sum_de, d_wp, d_bsl, i):
    """Eq. 37 p.54."""
    a = sum_de + min(0.0, d_wp) - min(0.0, d_bsl)
    b = sum_de + min(0.0, d_wp) - min(0.0, d_bsl) + max(0.0, d_wp) - max(0.0, d_bsl)
    return i * a + (1 - i) * b


def ref_eq40(d_wp, d_bsl, i):
    """Eq. 40 p.56."""
    return i * (max(0.0, d_wp) - max(0.0, d_bsl))


def ref_eq39_42(le_oa, le_br, er, cr):
    """Eq. 39 p.56 and Eq. 42 p.57 — literal."""
    lk = le_oa + le_br
    if lk == 0:
        return 0.0, 0.0
    return lk * er / (er + cr), lk * cr / (er + cr)


def ref_eq75(d_wp, d_bsl, i, npr_pct):
    """Eq. 75 p.84 — literal (can be negative)."""
    p = npr_pct / 100.0
    return (i * (min(0.0, d_wp) - min(0.0, d_bsl)) * p
            + (1 - i) * (min(0.0, d_wp) - min(0.0, d_bsl) + max(0.0, d_wp) - max(0.0, d_bsl)) * p)


def ref_eq76(d_wp, d_bsl, i, npr_pct):
    """Eq. 76 p.85 — literal."""
    return i * (max(0.0, d_wp) - max(0.0, d_bsl)) * npr_pct / 100.0


def ref_fert_n2o_total(fsn_t_n: float, fon_t_n: float, f: dict) -> float:
    """Eq. 17–23 p.43–45, total t CO2e for the QU (areal mean × A_i)."""
    direct = (fsn_t_n + fon_t_n) * f["EF_Ndirect"] * N2O_N * GWP_N2O_PDF  # Eq. 18 × A_i
    volat = (fsn_t_n * f["Frac_GASF"] + fon_t_n * f["Frac_GASM"]) * f["EF_Nvolat"] * N2O_N * GWP_N2O_PDF  # Eq. 22
    leach = (fsn_t_n + fon_t_n) * f["Frac_LEACH"] * f["EF_Nleach"] * N2O_N * GWP_N2O_PDF  # Eq. 23
    return direct + volat + leach  # Eq. 17 (Eq. 21 × A_i = volat + leach)


def ref_period(project, controls, x, years, npr, sum_de_by_year, le_oa_by_year, prior_cum=0.0, conf=0.667):
    """Hand calculation of Eq. 46/47, 70/71, 74, 44/45, 37–43, 75–79 for a QA2 paired design.

    ``project`` / ``controls``: {code: (area_ha, [start SOC %], [final SOC %])}; controls keyed by the project
    stratum they serve (one project-site/control-site combination per stratum, §8.5.1 p.59)."""
    out: dict = {}
    A = sum(a for a, _, _ in project.values())
    soil_wp_annual = soil_bsl_annual = 0.0
    s2_sum = 0.0
    comps = []
    mean_num = 0.0
    for code, (a_h, s_pct, f_pct) in project.items():
        s = [ref_soc_stock(v) for v in s_pct]
        f = [ref_soc_stock(v) for v in f_pct]
        _, cs_pct, cf_pct = controls[code]
        c_s = [ref_soc_stock(v) for v in cs_pct]
        c_f = [ref_soc_stock(v) for v in cf_pct]
        d_wp_h = mean(f) - mean(s)  # t C/ha over the interval
        d_bsl_h = mean(c_f) - mean(c_s)
        soil_wp_annual += d_wp_h / x * a_h * CO2_C  # Eq. 47 p.59
        soil_bsl_annual += d_bsl_h / x * a_h * CO2_C  # Eq. 46 p.58 (control site change, project stratum area)
        s2_wp = ref_eq71(s, f, a_h)  # Eq. 71
        s2_bsl = ref_eq71(c_s, c_f, a_h)  # Eq. 70 note p.77: weighted by the project stratum area
        s2_sum += s2_wp + s2_bsl  # Eq. 70 s²_ΔSOC,h = s²_wp,h + s²_bsl,h (no covariance)
        comps += [(s2_wp, len(s) - 1), (s2_bsl, len(c_s) - 1)]
        mean_num += (d_wp_h - d_bsl_h) * a_h
    s2_mean = s2_sum / A**2  # Eq. 70 p.76
    mean_err = mean_num / A  # mean ERR (t C/ha)
    df = ref_satterthwaite(comps)
    t = float(stats.t.ppf(conf, df))
    unc = ref_eq74(s2_mean, mean_err, t)
    i_soil = 1 if soil_wp_annual - soil_bsl_annual >= 0 else -1  # p.57
    d_wp_t = soil_wp_annual * (1 - unc * i_soil)  # Eq. 45 p.58 (no woody biomass)
    d_bsl_t = soil_bsl_annual * (1 - unc * i_soil)  # Eq. 44 p.57
    out.update(s2_mean=s2_mean, mean=mean_err, df=df, t=t, unc=unc, i_soil=i_soil,
               soil_wp_annual=soil_wp_annual, soil_bsl_annual=soil_bsl_annual)
    cum = prior_cum
    rows = []
    for y in years:
        cum += d_wp_t
        i = 1 if cum > 0 else 0  # indicator p.55
        er = ref_eq37(sum_de_by_year[y], d_wp_t, d_bsl_t, i)
        cr = ref_eq40(d_wp_t, d_bsl_t, i)
        lk_er, lk_cr = ref_eq39_42(le_oa_by_year[y], 0.0, er, cr)
        er_net, cr_net = er - lk_er, cr - lk_cr  # Eq. 38, 41
        bu_er, bu_cr = ref_eq75(d_wp_t, d_bsl_t, i, npr), ref_eq76(d_wp_t, d_bsl_t, i, npr)
        vcu_er, vcu_cr = er_net - bu_er, cr_net - bu_cr  # Eq. 77, 78
        rows.append(dict(year=y, indicator=i, d_wp=d_wp_t, d_bsl=d_bsl_t, sum_de=sum_de_by_year[y], er=er, cr=cr,
                         lk_er=lk_er, lk_cr=lk_cr, er_net=er_net, cr_net=cr_net, err_net=er_net + cr_net,  # Eq. 43
                         bu_er=bu_er, bu_cr=bu_cr, vcu_er=vcu_er, vcu_cr=vcu_cr, vcu=vcu_er + vcu_cr))  # Eq. 79
    out["rows"] = rows
    return out


# ---------------------------------------------------------------------------------------------------
# Platform fixtures
# ---------------------------------------------------------------------------------------------------
SCALAR_FACTORS = {"EF_Ndirect": 0.01, "EF_Nvolat": 0.01, "EF_Nleach": 0.011, "Frac_GASF": 0.11,
                  "Frac_GASM": 0.21, "Frac_LEACH": 0.24, "EF_ent_cattle": 60.0}


def rules(**over):
    v = {r.key: r.example for r in RULES}
    v.update({r.key: r.vm0042_default for r in RULES if r.vm0042_default is not None})
    v.update({"coarse_fragment_correction": False, "non_permanence_risk_pct": 20,
              "emission_factors": SCALAR_FACTORS})
    v.update(over)
    return from_values({k: x for k, x in v.items() if x is not None})


def _pt(site: str, soc: float) -> E.Point:
    return E.Point(site, (E.Layer(f"{site}-0-30", 0, 30, 1.2, soc),), sample_code=f"S-{site}")


def _stratum(code, area, start, final, role="project", control_for=None):
    return E.StratumData(code, area, tuple(_pt(f"{code}-{k}", v) for k, v in enumerate(start)),
                         tuple(_pt(f"{code}-{k}", v) for k, v in enumerate(final)), role, control_for)


def _act(scenario, year, category, attrs):
    return em.Activity("F1", scenario, year, category, attrs, 1, f"{scenario}-{year}-{category}", 1)


def _fert(mass_t):
    return {"synthetic_fertilizers": [{"type": "urea", "mass_t": mass_t, "n_content": 0.46}]}


START = 2024  # project start year; look-back t = −1 … −3 is 2023 … 2021
LOOKBACK = (2021, 2022, 2023)
FERT_B, FERT_P = 2.0, {2024: 1.0, 2025: 1.2}  # t urea per year
DIESEL_B, DIESEL_P = 500.0, {2024: 400.0, 2025: 450.0}  # L per year
MANURE_IMPORT = (10.0, 0.30)  # 2024: t, t C/t — not produced on site, no exemption (§8.4.1)


def _emissions_input() -> em.EmissionsInput:
    acts = []
    for y in LOOKBACK:
        acts += [_act("baseline", y, "n_fertilizer", _fert(FERT_B)), _act("baseline", y, "fossil_fuel",
                                                                          {"diesel_l": DIESEL_B})]
    for y in (2024, 2025):
        acts += [_act("project", y, "n_fertilizer", _fert(FERT_P[y])),
                 _act("project", y, "fossil_fuel", {"diesel_l": DIESEL_P[y]})]
    acts.append(_act("project", 2024, "organic_amendment_import",
                     {"amendments": [{"type": "cattle_manure", "mass_t": MANURE_IMPORT[0],
                                      "carbon_content": MANURE_IMPORT[1]}]}))
    return em.EmissionsInput(tuple(acts), (em.QuantUnit("QU1", 30.0, ("F1",)),), {"F1": 30.0}, START,
                             {2024: 1.0, 2025: 1.0})


def _ref_sum_de_and_leakage():
    f = SCALAR_FACTORS
    sum_de = {}
    for y in (2024, 2025):
        fert = ref_fert_n2o_total(FERT_B * 0.46, 0, f) - ref_fert_n2o_total(FERT_P[y] * 0.46, 0, f)  # Eq. 58
        ff = (DIESEL_B - DIESEL_P[y]) * EF_DIESEL_PDF  # Eq. 6, 7, 52
        sum_de[y] = fert + ff
    le = {2024: MANURE_IMPORT[0] * MANURE_IMPORT[1] * RETENTION_PDF * CO2_C, 2025: 0.0}  # Eq. 33
    return sum_de, le


# Project gains, control sites lose carbon (the usual case).
PROJECT_A = {"Z1": (10.0, [1.00, 1.10, 1.20, 1.05], [1.08, 1.21, 1.27, 1.12]),
             "Z2": (20.0, [0.90, 0.95, 1.02, 0.88], [0.97, 1.01, 1.12, 0.93])}
CONTROL_A = {"Z1": (1.0, [1.02, 1.08, 1.15, 1.00], [1.00, 1.05, 1.14, 0.97]),
             "Z2": (1.0, [0.92, 0.97, 1.00, 0.90], [0.90, 0.96, 0.97, 0.89])}
# Project loses carbon faster than its control sites (I_soil = −1, cumulative stock change negative).
PROJECT_C = {"Z1": (10.0, [1.20, 1.30, 1.25, 1.40], [1.10, 1.22, 1.13, 1.31])}
CONTROL_C = {"Z1": (1.0, [1.20, 1.25, 1.30, 1.35], [1.18, 1.24, 1.27, 1.34])}
# Both gain, control sites gain more (CR < 0 while I = 1).
PROJECT_D = {"Z1": (10.0, [1.00, 1.10, 1.20, 1.05], [1.020, 1.121, 1.219, 1.071])}
CONTROL_D = {"Z1": (1.0, [1.00, 1.08, 1.15, 1.02], [1.021, 1.102, 1.172, 1.041])}


def _engine(project, controls, *, prior=0.0, emissions=True, x=2.0):
    strata = []
    for code, (a, s, f) in project.items():
        strata.append(_stratum(code, a, s, f))
        ca, c_s, c_f = controls[code]
        strata.append(_stratum(f"C-{code}", ca, c_s, c_f, role="control", control_for=code))
    inp = E.EngineInput("paired", tuple(strata), measurement_interval_years=x,
                        vintages=(E.Vintage(2024, 1.0), E.Vintage(2025, 1.0)),
                        emissions=_emissions_input() if emissions else None,
                        prior_cumulative_stock_change_t_co2e=prior)
    return E.calculate(inp, rules())


def _compare_rows(res, ref, keys=("indicator", "d_wp", "d_bsl", "sum_de", "er", "cr", "lk_er", "lk_cr", "er_net",
                                  "cr_net", "err_net")):
    eng_key = {"indicator": "indicator", "d_wp": "d_wp_t_co2e", "d_bsl": "d_bsl_t_co2e",
               "sum_de": "sum_delta_e_t_co2e", "er": "er_t_co2e", "cr": "cr_t_co2e", "lk_er": "lk_er_t_co2e",
               "lk_cr": "lk_cr_t_co2e", "er_net": "er_net_t_co2e", "cr_net": "cr_net_t_co2e",
               "err_net": "err_net_t_co2e", "bu_er": "buffer_er_eq75_t_co2e", "bu_cr": "buffer_cr_eq76_t_co2e",
               "vcu_er": "vcu_er", "vcu_cr": "vcu_cr", "vcu": "vcu"}
    assert len(res.vintages) == len(ref["rows"])
    for row, r in zip(res.vintages, ref["rows"]):
        for k in keys:
            assert row[eng_key[k]] == pytest.approx(r[k], abs=TOL, rel=TOL), (row["year"], k)


# ===================================================================================================
# 1. Worked examples printed in VM0042 v2.2
# ===================================================================================================
def test_footnote_8_schedule_of_activities_p14():
    """p.14 fn 8: tillage in t = −3 and −1, none in t = −2 → first baseline period T, N, T, T, N, T, T, N, T, T."""
    tillage = {2021: "T", 2022: "N", 2023: "T"}  # t = −3, −2, −1 for a 2024 start
    expected = ["T", "N", "T", "T", "N", "T", "T", "N", "T", "T"]
    sched = bl.repeating_schedule(list(LOOKBACK), START, 10)
    assert [tillage[r["source_year"]] for r in sched] == expected
    assert [r["source_t"] for r in sched[:3]] == [-3, -2, -1]  # "beginning with year t = −x" (p.14)
    via_emissions = [em.baseline_year_for(y, list(LOOKBACK), START) for y in range(START, START + 10)]
    assert [tillage[y] for y in via_emissions] == expected


def test_additionality_cover_crop_example_p19():
    """§7 p.18–19: adoption 22 % (> 20 %) → Step 3.2 / VT0008 4c; N_all 2 M ha, N_diff 1.7 M ha → F = 15 % → not
    common practice; N_all − N_diff > 3 does not apply."""
    assert add.f_share(2_000_000, 1_700_000) == pytest.approx(0.15, abs=TOL)
    res = add.common_practice([{
        "practice": "Cover crops", "region": "Project region", "adoption_pct": 22, "source_type": "census",
        "evidence_ids": ["census-2022"],
        "essential_distinction": {"n_all_ha": 2_000_000, "n_diff_ha": 1_700_000,
                                  "description": "Cover-crop seed subsidy accessed on 1.7 M ha"}}])
    row = res["details"]["practices"][0]
    assert res["status"] == "pass" and row["step"] == "3.2"
    assert row["step32"]["f_pct"] == pytest.approx(15.0, abs=1e-6) and row["step32"]["passed"]


def test_additionality_threshold_is_strictly_below_20_pct_p17_18():
    """Step 3.1 p.18: adoption must be *lower than* 20 %; F of exactly 20 % is not below 20 %."""
    ok = add.common_practice([{"practice": "No-till", "region": "R", "adoption_pct": 19.99,
                               "source_type": "census", "evidence_ids": ["e"]}])
    assert ok["status"] == "pass"
    at20 = add._practice({"practice": "No-till", "region": "R", "adoption_pct": 20, "source_type": "census",
                          "evidence_ids": ["e"]}, 1)
    assert at20["step"] == "3.2" and at20["status"] == "incomplete"  # 20 % is not "lower than 20 %"
    f20 = add._practice({"practice": "X", "region": "R", "adoption_pct": None,
                         "essential_distinction": {"n_all_ha": 100, "n_diff_ha": 80, "description": "d"}}, 1)
    assert f20["step32"]["f_pct"] == pytest.approx(20.0) and not f20["passed"]


def _fert_run(base_t: float, proj_t: float, ef):
    r = rules(emission_factors={**SCALAR_FACTORS, "EF_Ndirect": ef})
    acts = [_act("baseline", 2023, "n_fertilizer", _fert(base_t)), _act("project", 2024, "n_fertilizer", _fert(proj_t))]
    inp = em.EmissionsInput(tuple(acts), (em.QuantUnit("QU1", 10.0, ("F1",)),), {"F1": 10.0}, START, {2024: 1.0})
    return em.quantify(inp, r)


def test_ef_ndirect_conservative_range_p81():
    """§8.6.3 p.81: EF_Ndirect 0.016 (0.013–0.019). Project emissions decrease → 0.013 in BOTH scenarios;
    increase → 0.019 in both."""
    ef = {"value": 0.016, "low": 0.013, "high": 0.019}
    f = dict(SCALAR_FACTORS)
    down = _fert_run(2.0, 1.0, ef)
    assert down.factors_used["n2o_fertilizer:EF_Ndirect"] == {"value": 0.013, "end": "low"}
    exp_b = ref_fert_n2o_total(2.0 * 0.46, 0, {**f, "EF_Ndirect": 0.013})
    exp_p = ref_fert_n2o_total(1.0 * 0.46, 0, {**f, "EF_Ndirect": 0.013})
    s = down.sources["n2o_fertilizer"]
    assert s["baseline_t_co2e"] == pytest.approx(exp_b, abs=TOL) and s["project_t_co2e"] == pytest.approx(exp_p, abs=TOL)
    up = _fert_run(1.0, 2.0, ef)
    assert up.factors_used["n2o_fertilizer:EF_Ndirect"] == {"value": 0.019, "end": "high"}
    assert up.sources["n2o_fertilizer"]["reduction_t_co2e"] == pytest.approx(
        ref_fert_n2o_total(0.46, 0, {**f, "EF_Ndirect": 0.019}) - ref_fert_n2o_total(0.92, 0, {**f, "EF_Ndirect": 0.019}),
        abs=TOL)


def test_eq74_t_value_p82():
    """p.82: one-sided t at 0.667 with large df ≈ 0.4307. (Exactly 0.4307 is the 2/3 quantile; the rule default
    0.667 gives 0.4316 — 0.2 % more conservative; see audit report.)"""
    assert BY_KEY["uncertainty_confidence"].vm0042_default == 0.667
    assert E.t_one_sided(0.667, 1e9) == pytest.approx(0.4307, abs=1e-3)
    assert E.t_one_sided(2.0 / 3.0, 1e9) == pytest.approx(0.4307, abs=5e-5)
    # Eq. 74 itself: (√s² / mean × 100) × t
    assert E.eq74_unc(4.0, 20.0, 0.4307) == pytest.approx(ref_eq74(4.0, 20.0, 0.4307), abs=TOL)


# Figure 3 (p.36–37, Wendt & Hauser 2013 spreadsheet): probe 21.5 mm, 4 cores; (g, g/kg) per increment.
FIG3 = {"VM42point1": ((283.2, 24.29), (189.2, 12.68)),
        "VM42point2": ((222.7, 28.77), (144.3, 10.65)),
        "VM42point3": ((217.5, 20.68), (143.5, 11.28))}
FIG3_ESM_0_1950 = {"VM42point1": 47.36, "VM42point2": 49.9, "VM42point3": 36.8}  # column J/M, p.36


def _fig3_point(name):
    (g1, oc1), (g2, oc2) = FIG3[name]
    return E.Point(name, (E.Layer(f"{name}-1", 0, 30, None, oc1 / 10, fine_soil_mass_g=g1),
                          E.Layer(f"{name}-2", 30, 50, None, oc2 / 10, fine_soil_mass_g=g2)),
                   sample_code=name, probe_diameter_mm=21.5, cores_composited=4)


def test_fig3_eq3_masses_and_cumulative_oc_p36():
    """Eq. 3 p.36 against Figure 3 columns E/G: soil mass and OC mass of each increment."""
    expected = {"VM42point1": ((1950, 47.36), (1303, 16.52)), "VM42point2": ((1534, 44.1), (994, 10.6)),
                "VM42point3": ((1498, 31.0), (988, 11.1))}
    for name, incs in FIG3.items():
        for (g, oc), (m_exp, c_exp) in zip(incs, expected[name]):
            m = E.eq3_fine_soil_mass_t_ha(g, 21.5, 4)
            assert m == pytest.approx(m_exp, abs=0.5)
            assert E.eq3_soc_t_ha(m, oc) == pytest.approx(c_exp, abs=0.051)
    # p.36: the reference ESM layer is 0–1950 Mg/ha = heaviest 0–30 cm soil mass among the samples
    profs = [E.profile(_fig3_point(n), rules()) for n in FIG3]
    assert E.reference_mass(profs, 30, rules()) == pytest.approx(1950, abs=0.5)


def test_fig3_esm_stocks_with_wendt_hauser_cubic_spline_p36():
    """p.36: at the 0–1950 Mg/ha reference the three points hold 47.36, 49.9 and 36.8 Mg C/ha (cubic spline)."""
    r = rules(esm_interpolation="cubic_spline")
    profs = {n: E.profile(_fig3_point(n), r) for n in FIG3}
    m_ref = E.reference_mass(list(profs.values()), 30, r)
    for n, exp in FIG3_ESM_0_1950.items():
        assert E.point_stock(profs[n], r, m_ref, 30).stock_t_c_ha == pytest.approx(exp, abs=0.05 if n != "VM42point1"
                                                                                    else 0.01)


# fixed after the audit (was xfail): the recommended interpolation is now Wendt & Hauser's cubic spline
def test_fig3_esm_point3_with_platform_default_interpolation_p36():
    r = rules()  # esm_interpolation = RULES example
    assert r.require("esm_interpolation") == "cubic_spline"
    profs = {n: E.profile(_fig3_point(n), r) for n in FIG3}
    m_ref = E.reference_mass(list(profs.values()), 30, r)
    assert E.point_stock(profs["VM42point3"], r, m_ref, 30).stock_t_c_ha == pytest.approx(36.8, abs=0.05)


def test_appendix5_table10_slope_classes_p158():
    cases = {0: "nearly_level", 3: "nearly_level", 4: "gently_sloping", 8: "gently_sloping", 9: "strongly_sloping",
             16: "strongly_sloping", 17: "moderately_steep", 30: "moderately_steep", 31: "steep", 45: "steep",
             46: "very_steep", 120: "very_steep"}
    assert {s: land.slope_class(s) for s in cases} == cases
    # Table 7 p.26: aspect only matters for hilly (= moderately steep), steep and very steep
    assert land.HILLY_OR_STEEPER == {"moderately_steep", "steep", "very_steep"}


def test_fixed_constants_match_pdf():
    """Values VM0042 fixes, with the page they are printed on."""
    d = {r.key: r.vm0042_default for r in RULES}
    assert d["gwp_ch4"] == 28  # p.87
    assert d["gwp_n2o"] == 265  # p.89
    assert (d["ef_gasoline"], d["ef_diesel"]) == (0.002810, 0.002886)  # p.102
    assert (d["ef_limestone"], d["ef_dolomite"]) == (0.12, 0.13)  # p.39, p.103
    assert d["manure_c_retention"] == 0.12  # p.51–52
    assert d["uncertainty_confidence"] == 0.667  # p.82
    assert d["de_minimis_pct"] == 5  # p.12, p.50
    assert d["common_practice_threshold_pct"] == 20  # p.17–18
    assert d["practice_change_threshold_pct"] == 5  # p.6, p.9
    assert d["native_clearing_exclusion_years"] == 10  # p.11
    assert d["lookback_min_years"] == 3  # p.7, p.14
    assert d["baseline_reassess_years"] == 10  # p.5 fn 1, p.14
    assert d["remeasure_max_years"] == 5  # p.6, p.20
    assert (d["control_site_max_km"], d["min_control_sites"]) == (250, 3)  # p.25
    assert d["weather_station_max_km"] == 50  # p.25, p.27
    assert d["precip_similarity_mm"] == 100  # p.27
    assert d["stock_depth_cm"] == 30  # p.32
    assert d["resample_min_depth_increments"] == 2  # p.33
    assert d["ship_within_days"] == 5  # p.32
    assert d["storage_max_days"] == 90  # p.32 ("3 months")
    assert (d["spectroscopy_check_fraction_min"], d["spectroscopy_check_fraction_max"]) == (0.10, 0.15)  # p.78
    assert d["data_retention_years_after_crediting"] == 2  # p.137
    assert d["min_composites_per_stratum"] == 3  # p.30 ("at least 3–5 … should")
    assert EXAMPLE_FACTORS["Frac_LEACH"]["value"] == 0.24  # p.121
    assert (cs.MAX_DISTANCE_KM, cs.MAX_ASPECT_DIFF_DEG, cs.SOC_CONFIDENCE, cs.MAX_PRECIP_DIFF_MM) == (250, 30, 0.90, 100)
    assert (cs.ALM_YEARS, cs.CONVERSION_LOOKBACK_YEARS, cs.CONVERSION_YEAR_TOLERANCE, cs.MIN_CONTROL_SITES) == \
        (5, 50, 10, 3)  # Table 7 p.26–27, §8.2 p.25
    assert (bl.MIN_LOOKBACK_YEARS, bl.CENSUS_MAX_AGE_YEARS, bl.PRACTICE_CHANGE_THRESHOLD_PCT) == (3, 20, 5.0)


def test_qa3_equations_hand_numbers():
    """Eq. 7, 9, 11, 12–13, 14, 18, 22–25, 27–31, 32, 33 on hand-picked numbers (p.39–52)."""
    assert em.eq7_fossil_fuel(1000, EF_DIESEL_PDF) == pytest.approx(2.886, abs=TOL)
    assert em.eq9_liming(1.0, 1.0, 0.12, 0.13) == pytest.approx(0.25 * CO2_C, abs=TOL)
    assert em.eq11_enteric(100, 60, 28) == pytest.approx(28 * 100 * 60 / 1000, abs=TOL)
    vs = em.eq13_vs(8.4, 500)  # kg VS/(1000 kg mass·day) × kg/head /1000 × 365
    assert vs == pytest.approx(8.4 * 500 / 1000 * 365, abs=TOL)
    assert em.eq12_manure_ch4(10, vs, 0.5, 1.0, 28) == pytest.approx(28 * 10 * vs * 0.5 * 1.0 / 1e6, abs=TOL)
    assert em.eq14_burning_ch4(5000, 0.8, 2.7, 28) == pytest.approx(28 * 5000 * 0.8 * 2.7 / 1e6, abs=TOL)
    assert em.eq32_burning_n2o(5000, 0.8, 0.07, 265) == pytest.approx(265 * 5000 * 0.8 * 0.07 / 1e6, abs=TOL)
    parts = em.eq17_fertilizer(0.92, 0.3, SCALAR_FACTORS, 265)
    assert parts["total"] == pytest.approx(ref_fert_n2o_total(0.92, 0.3, SCALAR_FACTORS), abs=TOL)
    assert em.eq24_n_fixing(em.eq25_fcr([(4.0, 0.03)]), 0.01, 265) == pytest.approx(0.12 * 0.01 * N2O_N * 265, abs=TOL)
    fm = em.eq27_f_manure(50, 60, 1.0, 1.0)  # Eq. 28: kg N
    f = {"EF_N2O_md": 0.004, "Frac_GASM": 0.21, "EF_Nvolat": 0.01, "Frac_LEACH": 0.24, "EF_Nleach": 0.011}
    # Eq. 27 divides by 1000 (kg → t). Eq. 30/31 as printed omit /1000 although F is in kg N — the platform divides
    # all three by 1000, the dimensionally consistent reading (see audit report).
    exp = fm * (0.004 + 0.21 * 0.01 + 0.24 * 0.011) * N2O_N * 265 / 1000
    assert em.eq26_31_manure_n2o(fm, f, 265)["total"] == pytest.approx(exp, abs=TOL)
    assert em.eq33_leakage_oa(10, 0.3, 0.12) == pytest.approx(1.32, abs=TOL)


def test_practice_change_must_exceed_5_pct_p9():
    lb = [bl.YearValues(numbers={"synthetic_n_rate_kg_n_ha": 100.0})] * 3
    exactly = bl.compare_practice("n_fertilizer", lb, bl.YearValues(numbers={"synthetic_n_rate_kg_n_ha": 95.0}))
    above = bl.compare_practice("n_fertilizer", lb, bl.YearValues(numbers={"synthetic_n_rate_kg_n_ha": 94.9}))
    assert not exactly[0]["qualifying"] and above[0]["qualifying"]


def test_table7_thresholds_are_inclusive_limits_p25_27():
    def site(code, lat=0.0, lon=0.0, precip=1000.0, slope=20.0, aspect=0.0):
        return cs.Site(code, 1.0, lat, lon, slope, aspect, "loam", "Luvisols", "eco", "tropical_moist", precip)

    assert cs.precip_check([site("c", precip=1100)], [site("q", precip=1000)])["status"] == "pass"  # ±100 mm
    assert cs.precip_check([site("c", precip=1100.5)], [site("q", precip=1000)])["status"] == "fail"
    dist = lambda a, b, c, d: 250_000.0  # noqa: E731 — exactly 250 km
    assert cs.distance_check([site("c")], [site("q")], dist)["status"] == "pass"
    slope = cs.slope_check([site("c")], [site("q")])  # 20 % → hilly → aspect applies
    assert cs.aspect_check([site("c", aspect=30)], [site("q", aspect=0)], slope)["status"] == "pass"
    assert cs.aspect_check([site("c", aspect=31)], [site("q", aspect=0)], slope)["status"] == "fail"
    ok = cs.land_cover_check({"c": ("forest", 1990)}, {"q": ("forest", 2000)})  # ±10 years
    bad = cs.land_cover_check({"c": ("forest", 1989)}, {"q": ("forest", 2000)})
    assert ok["status"] == "pass" and bad["status"] == "fail"
    assert cs.conversion([(1950, 1973, "forest"), (1974, 2023, "cropland")], 2024) == ("forest", 1974)  # 50 years
    assert cs.conversion([(1950, 1972, "forest"), (1973, 2023, "cropland")], 2024) is None  # 51 years: not counted


def test_power_analysis_eq1_eq2_p33_34():
    s, alpha, power = 4.0, 0.05, 0.90
    r = smp.n_for_mdd(s, 3.0, alpha, power)
    n = r["n"]
    need = lambda k: (s * (stats.t.ppf(1 - alpha / 2, k - 1) + stats.t.ppf(power, k - 1)) / 3.0) ** 2  # noqa: E731
    assert n >= need(n) and (n - 1 < need(n - 1) or n == 2)  # Eq. 2, smallest n
    m = smp.mdd_for_n(s, n, alpha, power)
    assert m["mdd"] == pytest.approx(s / math.sqrt(n) * (stats.t.ppf(0.975, n - 1) + stats.t.ppf(0.9, n - 1)), abs=TOL)


# ===================================================================================================
# 2. Independent hand calculations — Eq. 37–47, 70/71, 74–79
# ===================================================================================================
def test_eq71_and_eq70_against_reference():
    a_h = 10.0
    s, f = [36.0, 39.6, 43.2, 37.8], [38.88, 43.56, 45.72, 40.32]
    v = E.eq71_variance(s, f, a_h, paired=True)
    assert v["s2_wp"] == pytest.approx(ref_eq71(s, f, a_h), abs=TOL)


@pytest.mark.parametrize("sum_de", [0.0, 12.5, -3.0])
@pytest.mark.parametrize("d_wp,d_bsl", [(50, -20), (50, 10), (10, 50), (-30, -10), (-10, -30), (-15, 20), (20, -60),
                                        (0, 0)])
@pytest.mark.parametrize("i", [0, 1])
def test_eq37_40_75_76_pure_functions_all_sign_cases(sum_de, d_wp, d_bsl, i):
    assert E.eq37_er(sum_de, d_wp, d_bsl, i) == pytest.approx(ref_eq37(sum_de, d_wp, d_bsl, i), abs=TOL)
    assert E.eq40_cr(d_wp, d_bsl, i) == pytest.approx(ref_eq40(d_wp, d_bsl, i), abs=TOL)
    assert E.eq75_buffer_er(d_wp, d_bsl, i, 20) == pytest.approx(ref_eq75(d_wp, d_bsl, i, 20), abs=TOL)
    assert E.eq76_buffer_cr(d_wp, d_bsl, i, 20) == pytest.approx(ref_eq76(d_wp, d_bsl, i, 20), abs=TOL)


def test_eq44_45_multiplier_and_i_soil_p57_58():
    assert E.eq44_45_multiplier(0.1, 1) == pytest.approx(0.9, abs=TOL)
    assert E.eq44_45_multiplier(0.1, -1) == pytest.approx(1.1, abs=TOL)  # > 1 when the project does worse


def test_full_period_qa2_project_gains_control_loses():
    """Scenario A: 2 project strata, paired points, one control per stratum, x = 2 years, 2 vintages, QA3
    fertiliser + diesel reductions, organic-amendment leakage in 2024."""
    sum_de, le = _ref_sum_de_and_leakage()
    ref = ref_period(PROJECT_A, CONTROL_A, 2.0, (2024, 2025), 20, sum_de, le)
    res = _engine(PROJECT_A, CONTROL_A)
    u = res.uncertainty["soc"]
    assert u["s2_mean"] == pytest.approx(ref["s2_mean"], abs=TOL)  # Eq. 70
    assert u["mean"] == pytest.approx(ref["mean"], abs=TOL)
    assert u["df"] == pytest.approx(ref["df"], rel=TOL)
    assert u["t"] == pytest.approx(ref["t"], abs=TOL)
    assert u["unc_pct"] / 100 == pytest.approx(ref["unc"], abs=TOL)  # Eq. 74
    assert u["i_soil"] == ref["i_soil"] == 1
    assert res.soc["soil_wp_t_co2e"] == pytest.approx(2 * ref["soil_wp_annual"], abs=TOL)  # Eq. 47 × 2 years
    assert res.soc["soil_bsl_t_co2e"] == pytest.approx(2 * ref["soil_bsl_annual"], abs=TOL)  # Eq. 46 × 2 years
    assert ref["soil_bsl_annual"] < 0 < ref["soil_wp_annual"]
    _compare_rows(res, ref, keys=("indicator", "d_wp", "d_bsl", "sum_de", "er", "cr", "lk_er", "lk_cr", "er_net",
                                  "cr_net", "err_net", "bu_er", "bu_cr", "vcu_er", "vcu_cr", "vcu"))
    assert res.credits_t_co2e == pytest.approx(sum(r["vcu"] for r in ref["rows"]), abs=TOL)  # Eq. 79 summed
    assert res.leakage["le_oa_t_co2e"] == pytest.approx(1.32, abs=TOL)


def test_full_period_indicator_switches_when_cumulative_stock_turns_positive_p55():
    """Scenario B: same data, earlier periods left Σ ΔCO2_wp negative; year 1 stays I = 0, year 2 turns I = 1."""
    sum_de, le = _ref_sum_de_and_leakage()
    probe = ref_period(PROJECT_A, CONTROL_A, 2.0, (2024, 2025), 20, sum_de, le)
    prior = -1.5 * probe["rows"][0]["d_wp"]
    ref = ref_period(PROJECT_A, CONTROL_A, 2.0, (2024, 2025), 20, sum_de, le, prior_cum=prior)
    assert [r["indicator"] for r in ref["rows"]] == [0, 1]
    res = _engine(PROJECT_A, CONTROL_A, prior=prior)
    _compare_rows(res, ref, keys=("indicator", "d_wp", "d_bsl", "sum_de", "er", "cr", "lk_er", "lk_cr", "er_net",
                                  "cr_net", "err_net", "bu_er", "bu_cr", "vcu_er", "vcu_cr", "vcu"))


def test_full_period_project_loses_more_than_control_branch_1_minus_i():
    """Scenario C: I_soil = −1 (multiplier 1 + UNC, p.58 note) and Σ ΔCO2_wp ≤ 0 (I = 0, second part of Eq. 37)."""
    sum_de, le = _ref_sum_de_and_leakage()
    ref = ref_period(PROJECT_C, CONTROL_C, 2.0, (2024, 2025), 20, sum_de, le)
    assert ref["i_soil"] == -1 and all(r["indicator"] == 0 for r in ref["rows"])
    res = _engine(PROJECT_C, CONTROL_C)
    assert res.uncertainty["soc"]["multiplier"] == pytest.approx(1 + ref["unc"], abs=TOL)
    _compare_rows(res, ref, keys=("indicator", "d_wp", "d_bsl", "sum_de", "er", "cr", "lk_er", "lk_cr", "er_net",
                                  "cr_net", "err_net", "bu_er", "bu_cr"))


@pytest.mark.xfail(strict=True, reason="AUDIT: engine floors a negative Eq. 75/76 buffer at 0 (engine.py "
                                       "bu_er = max(0, …)), so VCU_ER ≠ ER_NET − Bu_ER of Eq. 77 (conservative)")
def test_full_period_vcu_eq77_literal_when_buffer_is_negative():
    sum_de, le = _ref_sum_de_and_leakage()
    ref = ref_period(PROJECT_C, CONTROL_C, 2.0, (2024, 2025), 20, sum_de, le)
    assert ref["rows"][0]["bu_er"] < 0
    _compare_rows(_engine(PROJECT_C, CONTROL_C), ref, keys=("vcu_er", "vcu"))


def test_full_period_control_gains_more_than_project_reference_values():
    """Scenario D: both gain, control more (CR < 0 while I = 1). Everything except the leakage split agrees."""
    sum_de, le = _ref_sum_de_and_leakage()
    ref = ref_period(PROJECT_D, CONTROL_D, 2.0, (2024, 2025), 20, sum_de, le)
    r0 = ref["rows"][0]
    assert r0["indicator"] == 1 and r0["cr"] < 0 < r0["er"] + r0["cr"]
    res = _engine(PROJECT_D, CONTROL_D)
    _compare_rows(res, ref, keys=("indicator", "d_wp", "d_bsl", "sum_de", "er", "cr", "bu_er", "bu_cr"))
    # total net (Eq. 43) is unaffected by how leakage is split
    assert res.vintages[0]["err_net_t_co2e"] == pytest.approx(r0["err_net"], abs=TOL)


@pytest.mark.xfail(strict=True, reason="AUDIT: Eq. 39/42 allocate LK by ER/(ER+CR) and CR/(ER+CR) literally; "
                                       "engine eq39_42_allocate uses positive parts when CR < 0, changing the "
                                       "VCU_ER / VCU_CR split (p.56–57)")
def test_full_period_eq39_42_literal_split_when_cr_negative():
    sum_de, le = _ref_sum_de_and_leakage()
    ref = ref_period(PROJECT_D, CONTROL_D, 2.0, (2024, 2025), 20, sum_de, le)
    _compare_rows(_engine(PROJECT_D, CONTROL_D), ref, keys=("lk_er", "lk_cr", "er_net", "cr_net", "vcu_er", "vcu_cr"))


@pytest.mark.xfail(strict=True, reason="AUDIT: Eq. 37 applies (1 − UNC_N2O_soil) to ΔN2O_soil; engine "
                                       "_sign_aware uses (1 + UNC) when the modelled reduction is negative (p.54)")
def test_eq37_qa1_soil_n2o_uncertainty_literal_for_negative_reduction():
    r = rules(qa_soc="qa1", modelled_soc_permitted=True, qa_n2o_soil="qa1")
    terms = {"soc_project_modelled": E.Term(100.0, 0.0, None, "model"),
             "baseline_scenario": E.Term(20.0, 0.0, None, "model"),
             "n2o_soil": E.Term(-10.0, 4.0, 30.0, "model")}
    res = E.calculate(E.EngineInput("paired", (), terms=terms, vintages=(E.Vintage(2024, 1.0),)), r)
    unc = ref_eq74(4.0, -10.0, float(stats.t.ppf(0.667, 30)))
    assert res.vintages[0]["sum_delta_e_t_co2e"] == pytest.approx(-10.0 * (1 - unc), abs=TOL)


# §8.3 p.48 / §8.4.2 p.52 — fixed after the audit (was xfail): the look-back population floors the project's
def test_livestock_population_decline_is_not_credited_without_displacement_handling():
    herd = lambda n: {"animals": [{"type": "cattle", "population": n, "weight_kg": 400, "awms": 1.0}]}  # noqa: E731
    acts = [_act("baseline", y, "livestock", herd(100)) for y in LOOKBACK] + [_act("project", 2024, "livestock",
                                                                                   herd(50))]
    inp = em.EmissionsInput(tuple(acts), (em.QuantUnit("QU1", 10.0, ("F1",)),), {"F1": 10.0}, START, {2024: 1.0})
    try:
        res = em.quantify(inp, rules(emission_factors={**SCALAR_FACTORS, "VS_rate_cattle": 8.4,
                                                       "EF_CH4_md_cattle": 1.0, "Nex_cattle": 50.0,
                                                       "EF_N2O_md": 0.004}))
    except Blocked:
        return
    assert res.reduction("ch4_enteric") <= 0.0


def test_vintages_cover_calendar_years():
    """§8.1 p.19: results per year when a verification period spans several calendar years."""
    v = E.vintages_for(date(2024, 7, 1), date(2025, 6, 30))
    assert [x.year for x in v] == [2024, 2025]
    assert v[0].weight == pytest.approx(184 / 366, abs=1e-9) and v[1].weight == pytest.approx(181 / 365, abs=1e-9)
