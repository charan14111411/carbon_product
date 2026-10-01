"""VM0042 v2.2 Quantification Approach 1 (Measure and Model): pure equations (Eq. 4, 46/47, 60–69, true-up),
model registry with four-eyes approval, model-run imports, analyses → draft terms → calculation run,
true-up overdue blocking, tenancy and fail-closed rules."""

from __future__ import annotations

import math
import uuid

import numpy as np
import pytest
from scipy import stats

from app.core import db as dbmod
from app.core.errors import ValidationFailed
from app.modules.calculation.engine import welch_df
from app.modules.evidence import service as evidence
from app.modules.identity.models import User
from app.modules.methodology.definitions import BY_KEY
from app.modules.qa1 import domain as d
from tests._p2_factories import as_current, build_project, run_body
from tests.conftest import login, make_org, make_user

QA1_RULES = {"qa_soc": "qa1", "modelled_soc_permitted": True, "baseline_scenario_required": True,
             "qa1_uncertainty_method": "analytical"}
AREA_TOL = 1e-9


# =============================================================== pure equations (hand-computed)
def test_eq4_model_input_stock():
    # 100 × BD_corr × d × OC: BD 1.2 with 5 % stones → 1.14 g/cm³, 30 cm, 1.0 % OC → 34.2 t C/ha
    assert d.bd_corrected(1.2, 0.05) == pytest.approx(1.14)
    assert d.eq4_soc_model_t_ha(1.14, 30, 0.01) == pytest.approx(34.2)
    assert d.bd_corrected(1.3, None) == 1.3
    with pytest.raises(ValidationFailed):
        d.eq4_soc_model_t_ha(1.14, 30, 1.5)  # OC must be a fraction
    with pytest.raises(ValidationFailed):
        d.bd_corrected(1.2, 1.0)


def test_period_change_flux_and_interpolation():
    stocks = {2020: 30.0, 2021: 31.0, 2022: 33.0}
    assert d.period_change(stocks, [(2021, 1.0), (2022, 0.5)]) == pytest.approx(1.0 + 0.5 * 2.0)
    assert d.period_flux({2021: 0.2, 2022: 0.4}, [(2021, 1.0), (2022, 0.5)]) == pytest.approx(0.4)
    assert d.stock_at({2023: 40.0, 2024: 44.0}, 2024.25) == pytest.approx(41.0)
    with pytest.raises(ValidationFailed) as e:
        d.period_change(stocks, [(2023, 1.0)])
    assert e.value.code == "MODEL_RUN_INCOMPLETE"


def test_eq60_eq61_model_prediction_error():
    assert d.eq60_model_variance_delta(0.5, 0.3) == pytest.approx(0.4)  # 2[s² − cov]
    assert d.eq61_rho(0.3, 0.5, 0.5) == pytest.approx(0.6)
    assert d.eq61_model_variance_delta(0.5, 0.6) == pytest.approx(0.4)  # 2 s² (1 − ρ) — same as Eq. 60
    with pytest.raises(ValidationFailed):
        d.eq61_model_variance_delta(0.5, 1.2)
    with pytest.raises(ValidationFailed):
        d.eq60_model_variance_delta(0.5, 0.9)


def test_eq62_to_eq64_analytical_hand_example():
    a = d.StratumPoints("A", 10.0, (1.0, 2.0, 3.0))  # mean 2, Σdev² 2
    b = d.StratumPoints("B", 20.0, (2.0, 4.0))  # mean 3, Σdev² 2
    total, per = d.eq62_sampling_variance([a, b])
    assert per["A"] == pytest.approx(100 / 6 * 2)  # A²/(n(n−1)) Σdev² = 33.333
    assert per["B"] == pytest.approx(400 / 2 * 2)  # 400
    assert total == pytest.approx(433.3333333)
    s2m = d.eq64_model_variance({"A": 10, "B": 20}, {"A": 0.4, "B": 0.3}, 30)
    assert s2m == pytest.approx(100 / 900 * 0.4 + 400 / 900 * 0.3)  # 0.177778
    assert d.eq63_variance_of_mean(total, 30, s2m) == pytest.approx(433.3333333 / 900 + 0.1777778)
    r = d.analytical([a, b], {"A": 0.4, "B": 0.3}, {"A": 9, "B": 19})
    assert r.total_t_co2e == pytest.approx(80.0) and r.mean_t_co2e_ha == pytest.approx(80 / 30)
    assert r.s2_mean == pytest.approx(0.6592593, rel=1e-6)
    assert r.variance_total == pytest.approx(593.33333, rel=1e-6)  # A² × s²_mean, (t CO2e)²
    assert r.df == pytest.approx(welch_df([(100 / 3, 2), (400, 1), (100 * 0.4, 9), (400 * 0.3, 19)]))
    with pytest.raises(ValidationFailed) as e:
        d.eq62_sampling_variance([d.StratumPoints("C", 5, (1.0,))])
    assert e.value.code == "INSUFFICIENT_POINTS"
    with pytest.raises(ValidationFailed) as e:
        d.analytical([a, b], {"A": 0.4}, {"A": 9})
    assert e.value.code == "MODEL_ERROR_MISSING"


def test_eq65_to_eq69_monte_carlo_hand_example():
    # Eq. 65: SOC z = −ΔSOC; baseline gains 0.5, project gains 1.5 → reduction/removal 1.0
    assert float(d.eq65_point_draws(np.array(-0.5), np.array(-1.5))) == pytest.approx(1.0)
    one = [d.StratumDraws("A", 10.0, np.array([[1.0, 2.0, 3.0], [3.0, 4.0, 5.0]]))]
    tau, tau_h, mu = d.eq66_totals(one)
    assert tau == pytest.approx(30.0) and mu == pytest.approx(3.0)  # 10/(2·3) × 18
    s2s, per, s2m, tau_l = d.eq68_variance(one)
    assert s2s == pytest.approx(100.0)  # 100/2 × ((2−3)² + (4−3)²)
    assert list(tau_l) == pytest.approx([20.0, 30.0, 40.0]) and s2m == pytest.approx(100.0)
    assert d.eq69_variance_of_mean(s2s, s2m, 10.0) == pytest.approx(2.0)
    res = d.monte_carlo(one, apply_error_factor=True)
    assert res.mc_error_factor == pytest.approx(math.sqrt(4 / 3))
    assert res.s2_mean == pytest.approx(2.0 * 4 / 3) and res.variance_total == pytest.approx(200 * 4 / 3)

    two = [d.StratumDraws("A", 10.0, np.array([[1.0, 3.0], [3.0, 5.0]])),
           d.StratumDraws("B", 20.0, np.array([[2.0, 2.0], [4.0, 6.0]]))]
    tau, tau_h, mu = d.eq66_totals(two)
    assert tau_h == pytest.approx({"A": 30.0, "B": 70.0}) and tau == pytest.approx(100.0)
    s2s, per, s2m, tau_l = d.eq68_variance(two)
    assert per == pytest.approx({"A": 100.0, "B": 900.0})
    assert list(tau_l) == pytest.approx([80.0, 120.0]) and s2m == pytest.approx(800.0)
    r = d.monte_carlo(two, apply_error_factor=False)
    assert r.s2_mean == pytest.approx(1800 / 900) and r.variance_total == pytest.approx(1800.0)
    assert r.df == pytest.approx(1800**2 / (100**2 + 900**2 + 800**2))
    assert d.mc_error_factor(100) == pytest.approx(1.005, abs=5e-5)  # §8.6.1.2.3: "a factor of only 1.005"
    with pytest.raises(ValidationFailed):
        d.eq66_totals([d.StratumDraws("A", 10.0, np.array([[1.0, 2.0], [1.0, 2.0]])),
                       d.StratumDraws("B", 10.0, np.array([[1.0, 2.0, 3.0], [1.0, 2.0, 3.0]]))])


def test_meta_model_draws_are_seeded_reproducible_and_consistent_with_eq63():
    pts = [d.StratumPoints("A", 10.0, (1.0, 2.0, 3.0)), d.StratumPoints("B", 20.0, (2.0, 4.0))]
    sig = {"A": math.sqrt(0.4), "B": math.sqrt(0.3)}
    r1 = d.monte_carlo(d.meta_model_draws(pts, sig, 500, seed=42), apply_error_factor=False)
    r2 = d.monte_carlo(d.meta_model_draws(pts, sig, 500, seed=42), apply_error_factor=False)
    r3 = d.monte_carlo(d.meta_model_draws(pts, sig, 500, seed=43), apply_error_factor=False)
    assert r1.to_dict() == r2.to_dict() and r1.s2_model != r3.s2_model
    z = d.standard_normal_draws(500, 42)
    assert abs(z.mean()) < 1e-12
    # centred draws: the MC mean is the central run and the sampling part equals Eq. 62
    assert r1.total_t_co2e == pytest.approx(80.0)
    assert r1.s2_sampling == pytest.approx(d.eq62_sampling_variance(pts)[0])
    # one shared error parameter per draw: s²_model = (Σ_h A_h σ_h)² × Σz²/(L−1)
    expect = (10 * sig["A"] + 20 * sig["B"]) ** 2 * float(np.sum(z**2)) / 499
    assert r1.s2_model == pytest.approx(expect)


def test_trueup_error_statistics():
    s = d.trueup_stats([10.0, 12.0, 11.0], [9.0, 12.0, 13.0])  # errors 1, 0, −2
    assert s.errors == pytest.approx((1.0, 0.0, -2.0)) and s.mean_error == pytest.approx(-1 / 3)
    assert s.s2_error == pytest.approx(((4 / 3) ** 2 + (1 / 3) ** 2 + (5 / 3) ** 2) / 2)
    assert s.rmse == pytest.approx(math.sqrt(5 / 3))
    with pytest.raises(ValidationFailed):
        d.trueup_stats([1.0], [1.0])


def test_rule_definitions_cite_vm0042():
    for key in ("qa1_uncertainty_method", "qa1_mc_min_draws", "qa1_mc_error_factor"):
        r = BY_KEY[key]
        assert r.ref_parts()[0] and r.ref_parts()[1], key
        assert r.vm0042_default is None  # project choices, never defaulted
    assert BY_KEY["qa1_uncertainty_method"].choices == ("analytical", "monte_carlo")


# =============================================================== API fixtures
def _evidence(org) -> str:
    with dbmod.session_factory()() as s:
        u = s.query(User).filter_by(org_id=org).first()
        ev = evidence.store(s, as_current(u), data=uuid.uuid4().bytes, filename="report.pdf",
                            mime_type="application/pdf", kind="document")
        s.commit()
        return str(ev.id)


def model_body(org, **over) -> dict:
    body = {
        "name": "DayCent", "version": "4.5",
        "public_source": "https://www2.nrel.colostate.edu/projects/daycent/ (accessed 2025-01-10)",
        "source_accessed_on": "2025-01-10", "publicly_available": True,
        "documentation_ref": "DayCent 4.5 user manual and scientific basis",
        "peer_review_refs": ["Parton et al. (1998) Global and Planetary Change 19:35–48"],
        "parameter_set": {"dec1(1)": 3.9, "teff": [15.4, 11.75, 29.7, 0.031], "fix.100": "default-2020"},
        "parameter_sources": "DayCent 4.5 defaults with Bayesian calibration (Gurung et al. 2020)",
        "validation_report_evidence_id": _evidence(org), "ime_report_evidence_id": _evidence(org),
        "validation_domain": {"crop_functional_groups": ["grasses", "legumes"],
                              "practice_categories": ["crop_planting_harvest", "tillage_residue"],
                              "climate_zones": ["tropical_dry"], "soil_textures": ["sandy loam", "loam"]},
        "pools": ["soc"],
        "validation_metrics": [
            {"pool": "soc", "practice_category": "crop_planting_harvest", "n_sites": 21,
             "median_duration_years": 6, "bias": 0.05, "bias_test_passed": True, "s2_model": 0.8, "rho": 0.5},
            {"pool": "soc", "practice_category": "tillage_residue", "n_sites": 15, "median_duration_years": 6,
             "bias": -0.02, "bias_test_passed": True, "s2_model_delta": 0.6},
        ],
    }
    body.update(over)
    return body


@pytest.fixture()
def owner(as_role):
    return as_role("methodology_owner")


@pytest.fixture()
def checker(client, org):
    return login(client, make_user(org, "methodology_owner"))


@pytest.fixture()
def analyst(as_role):
    return as_role("mrv_analyst")


def approved_model(client, org, owner, checker, **over) -> dict:
    r = client.post("/api/qa1/models", headers=owner, json=model_body(org, **over))
    assert r.status_code == 201, r.text
    a = client.post(f"/api/qa1/models/{r.json()['id']}/approve", headers=checker)
    assert a.status_code == 200, a.text
    return a.json()


def build(org, **rules):
    tag = uuid.uuid4().hex[:6]
    b = build_project(org, controls=False, tag=tag, rules_over={**QA1_RULES, **rules})
    return b, [f"S-{tag}-{i}" for i in range(5)]


BASE_SOC = (1.00, 1.10, 1.05, 1.20, 1.12)  # % in the 0–30 cm layer of the baseline campaign (factory)


def run_csv(codes, *, bsl_rate=-0.1, wp_rate=0.3, t0=None, years=range(2020, 2025), draws=0, skip=None,
            category="crop_planting_harvest", t0_project_shift=0.0, extra_rate=0.0) -> str:
    lines = ["site_code,scenario,year,draw,soc_t_c_ha,practice_category,crop_functional_group"]
    for i, c in enumerate(codes):
        s0 = t0[i] if t0 else 34.2 * BASE_SOC[i]  # Eq. 4 of the factory's initial sample
        for sc, rate in (("baseline", bsl_rate), ("project", wp_rate + 0.05 * i + extra_rate)):
            if skip == (c, sc):
                continue
            for dr in range(0, draws + 1):
                for y in years:
                    shift = t0_project_shift if (sc == "project" and y == 2020) else 0.0
                    jitter = 0.0 if dr == 0 else (dr - (draws + 1) / 2) * 0.02 * (1 if sc == "project" else -1)
                    v = s0 + shift + (rate + jitter) * (y - 2020)
                    lines.append(f"{c},{sc},{y},{dr or ''},{v:.6f},{category},legumes")
    return "\n".join(lines)


def do_import(client, h, b, model_id, csv, **over):
    body = {"model_id": model_id, "label": "DayCent runs", "initial_campaign_id": b.baseline_id, "format": "csv",
            "csv": csv, **over}
    return client.post(f"/api/projects/{b.project_id}/qa1/run-imports", headers=h, json=body)


def analyse(client, h, b, import_ids, **over):
    body = {"period_label": "P1", "period_start": "2021-01-01", "period_end": "2024-12-31",
            "import_ids": import_ids, **over}
    return client.post(f"/api/projects/{b.project_id}/qa1/analyses", headers=h, json=body)


# =============================================================== registry, validation, four-eyes
def test_model_registry_validation_and_four_eyes(client, org, owner, checker, analyst):
    assert client.post("/api/qa1/models", headers=analyst, json=model_body(org)).status_code == 403
    bad = client.post("/api/qa1/models", headers=owner,
                      json=model_body(org, publicly_available=False, peer_review_refs=[],
                                      validation_report_evidence_id=None, parameter_set={}))
    assert bad.status_code == 201
    probs = bad.json()["approval_problems"]
    assert any(p.startswith("4a") for p in probs) and any(p.startswith("4b") for p in probs)
    assert any("validation report" in p for p in probs) and any("parameter value" in p for p in probs)
    r = client.post(f"/api/qa1/models/{bad.json()['id']}/approve", headers=checker)
    assert r.status_code == 422 and r.json()["code"] == "MODEL_NOT_VALID"

    m = client.post("/api/qa1/models", headers=owner, json=model_body(org)).json()
    assert m["approval_problems"] == [] and m["status"] == "draft" and len(m["parameter_fingerprint"]) == 64
    assert m["revision"] == 2  # same name + version as the invalid draft
    self_ok = client.post(f"/api/qa1/models/{m['id']}/approve", headers=owner)
    assert self_ok.status_code == 403 and self_ok.json()["code"] == "SELF_APPROVAL_REJECTED"
    # an editor can't approve either
    edited = client.patch(f"/api/qa1/models/{m['id']}", headers=checker, json={"notes": "checked parameters"})
    assert edited.status_code == 200
    assert client.post(f"/api/qa1/models/{m['id']}/approve", headers=checker).json()["code"] == \
        "SELF_APPROVAL_REJECTED"
    third = login(client, make_user(org, "methodology_owner"))
    ok = client.post(f"/api/qa1/models/{m['id']}/approve", headers=third)
    assert ok.status_code == 200 and ok.json()["status"] == "approved"
    locked = client.patch(f"/api/qa1/models/{m['id']}", headers=owner, json={"parameter_set": {"x": 1}})
    assert locked.status_code == 409 and locked.json()["code"] == "MODEL_LOCKED"
    # metric with no usable error form is rejected at input
    body = model_body(org)
    body["validation_metrics"][0].pop("rho")
    assert client.post("/api/qa1/models", headers=owner, json=body).status_code == 422
    # unbiasedness is required (§8.6.1.1.1)
    body = model_body(org)
    body["validation_metrics"][1]["bias_test_passed"] = False
    biased = client.post("/api/qa1/models", headers=owner, json=body).json()
    assert any("unbiased" in p for p in biased["approval_problems"])


def test_tenancy_other_org_gets_404(client, org, owner, checker, analyst):
    m = approved_model(client, org, owner, checker)
    b, codes = build(org)
    other = make_org("Other Org")
    oh = login(client, make_user(other, "methodology_owner"))
    oa = login(client, make_user(other, "mrv_analyst"))
    assert client.get(f"/api/qa1/models/{m['id']}", headers=oh).status_code == 404
    assert client.post(f"/api/qa1/models/{m['id']}/retire", headers=oh, json={"reason": "not ours"}).status_code == 404
    assert do_import(client, oa, b, m["id"], run_csv(codes)).status_code == 404
    imp = do_import(client, analyst, b, m["id"], run_csv(codes))
    assert imp.status_code == 201, imp.text
    assert client.get(f"/api/qa1/run-imports/{imp.json()['id']}", headers=oa).status_code == 404
    assert client.get(f"/api/projects/{b.project_id}/qa1/analyses", headers=oa).status_code == 404


# =============================================================== imports
def test_import_validation_same_model_and_inputs(client, org, owner, checker, analyst):
    b, codes = build(org)
    draft = client.post("/api/qa1/models", headers=owner, json=model_body(org)).json()
    r = do_import(client, analyst, b, draft["id"], run_csv(codes))
    assert r.status_code == 409 and r.json()["code"] == "MODEL_NOT_APPROVED"
    m = approved_model(client, org, owner, checker)

    missing_wp = do_import(client, analyst, b, m["id"], run_csv(codes, skip=(codes[1], "project")))
    assert missing_wp.status_code == 422 and missing_wp.json()["code"] == "INVALID_IMPORT"
    assert any("§4 cond. 4e" in e for e in missing_wp.json()["details"]["errors"])
    t0_diff = do_import(client, analyst, b, m["id"], run_csv(codes, t0_project_shift=0.5))
    assert t0_diff.status_code == 422 and any("SOC_wp,i,0 = SOC_bsl,i,0" in e
                                              for e in t0_diff.json()["details"]["errors"])
    outside = do_import(client, analyst, b, m["id"], run_csv(codes, category="grazing"))
    assert outside.status_code == 422 and any("not validated for grazing" in e
                                              for e in outside.json()["details"]["errors"])
    late = do_import(client, analyst, b, m["id"], run_csv(codes, years=range(2021, 2025)))
    assert late.status_code == 422 and any("start at t0" in e for e in late.json()["details"]["errors"])
    unknown = do_import(client, analyst, b, m["id"], run_csv(["NOPE-1", "NOPE-2"]))
    assert unknown.status_code == 422
    no_init = do_import(client, analyst, b, m["id"], run_csv(codes), initial_campaign_id=None)
    assert no_init.status_code == 409 and no_init.json()["code"] == "INITIAL_MEASUREMENT_MISSING"

    ok = do_import(client, analyst, b, m["id"], run_csv(codes))
    assert ok.status_code == 201, ok.text
    body = ok.json()
    assert body["data_class"] == "MODELLED" and body["pools"] == ["soc"] and body["row_count"] == 50
    assert body["t0_year"] == 2020 and body["eq4_points"] == 5 and body["warnings"] == []
    assert body["activity_records_used"] > 0 and len(body["sha256"]) == 64
    detail = client.get(f"/api/qa1/run-imports/{body['id']}?include_rows=true", headers=analyst).json()
    eq4 = detail["inputs"]["eq4"][codes[0]]
    assert eq4["soc_model_t_c_ha"] == pytest.approx(34.2)  # 100 × 1.2 × 0.95 × 30 × 0.01
    assert len(detail["rows"]) == 50
    dup = do_import(client, analyst, b, m["id"], run_csv(codes))
    assert dup.status_code == 409 and dup.json()["code"] == "DUPLICATE_IMPORT"
    mism = do_import(client, analyst, b, m["id"], run_csv(codes, t0=[30, 31, 32, 33, 34]))
    assert mism.status_code == 201 and len(mism.json()["warnings"]) == 5  # model t0 ≠ Eq. 4 value is reported

    # same model version and parameters across the runs used together (§4 cond. 4e)
    m2 = approved_model(client, org, owner, checker, parameter_set={"dec1(1)": 4.1})
    b2, codes2 = build(org)
    i1 = do_import(client, analyst, b2, m["id"], run_csv(codes2[:3]))
    i2 = do_import(client, analyst, b2, m2["id"], run_csv(codes2[3:]))
    assert i1.status_code == 201 and i2.status_code == 201
    r = analyse(client, analyst, b2, [i1.json()["id"], i2.json()["id"]])
    assert r.status_code == 409 and r.json()["code"] == "MODEL_MISMATCH"


# =============================================================== analysis → terms → calculation
def test_analysis_publishes_terms_that_flow_into_a_calculation_run(client, org, owner, checker, analyst):
    m = approved_model(client, org, owner, checker)
    b, codes = build(org)
    imp = do_import(client, analyst, b, m["id"], run_csv(codes))
    assert imp.status_code == 201, imp.text
    r = analyse(client, analyst, b, [imp.json()["id"]])
    assert r.status_code == 201, r.text
    an = r.json()
    soc = an["results"]["pools"]["soc"]
    area = soc["uncertainty"]["total_area_ha"]
    # per point: removal = (wp rate − bsl rate) × 4 years × 44/12
    red = [((0.3 + 0.05 * i) - (-0.1)) * 4 * 44 / 12 for i in range(5)]
    assert [p["reduction_t_co2e_ha"] for p in soc["points"]["Z1"]] == pytest.approx(red)
    assert soc["reduction_total_t_co2e"] == pytest.approx(area * float(np.mean(red)))
    wp_total = area * float(np.mean([(0.3 + 0.05 * i) * 4 * 44 / 12 for i in range(5)]))
    bsl_total = area * (-0.1 * 4 * 44 / 12)
    assert soc["terms"]["soc_project_modelled"]["value_t_co2e"] == pytest.approx(wp_total)
    assert soc["terms"]["baseline_scenario"]["value_t_co2e"] == pytest.approx(bsl_total)
    # Eq. 62/63 with Eq. 61 (crop planting: s² 0.8, ρ 0.5 → 0.8)
    s2_samp = area**2 / (5 * 4) * float(np.sum((np.array(red) - np.mean(red)) ** 2))
    s2_mean = s2_samp / area**2 + 0.8
    assert soc["uncertainty"]["s2_mean"] == pytest.approx(s2_mean)
    assert soc["terms"]["soc_project_modelled"]["variance"] == pytest.approx(s2_mean * area**2)
    assert soc["terms"]["baseline_scenario"]["variance"] == 0.0
    df = welch_df([(s2_samp, 4), (area**2 * 0.8, 20)])
    assert soc["terms"]["soc_project_modelled"]["df"] == pytest.approx(df)
    assert an["trueup"]["overdue"] is False and an["trueup"]["problems"] == []

    pub = client.post(f"/api/qa1/analyses/{an['id']}/publish", headers=analyst)
    assert pub.status_code == 201, pub.text
    terms = {t["term"]: t for t in pub.json()["terms"]}
    assert set(terms) == {"soc_project_modelled", "baseline_scenario"}
    assert all(t["status"] == "draft" for t in terms.values())
    assert "Eq. 60–64" in terms["soc_project_modelled"]["source"]
    again = client.post(f"/api/qa1/analyses/{an['id']}/publish", headers=analyst)
    assert again.status_code == 409 and again.json()["code"] == "ALREADY_PUBLISHED"
    # a run before approval fails closed (terms are drafts)
    pre = client.post(f"/api/projects/{b.project_id}/calculations", headers=analyst, json=run_body(b))
    assert pre.status_code == 409 and pre.json()["code"] == "RULE_MISSING"
    for t in terms.values():
        assert client.post(f"/api/terms/{t['id']}/approve", headers=checker).status_code == 200
    run = client.post(f"/api/projects/{b.project_id}/calculations", headers=analyst, json=run_body(b))
    assert run.status_code == 201, run.text
    res = run.json()["results"]
    used = {t["term"]: t for t in res["terms"]}
    assert used["soc_project_modelled"]["value_t_co2e"] == pytest.approx(wp_total)
    assert used["baseline_scenario"]["value_t_co2e"] == pytest.approx(bsl_total)
    assert used["soc_project_modelled"]["data_class"] == "MODELLED"
    # the engine's Eq. 74 on the totals equals Eq. 74 on the per-hectare mean and its variance (Eq. 63)
    t = stats.t.ppf(0.667, df)
    expect = math.sqrt(s2_mean) / (soc["reduction_total_t_co2e"] / area) * t * 100
    assert res["uncertainty"]["soc"]["unc_pct"] == pytest.approx(expect)
    assert res["soc"]["source"] == "qa1_model"


def test_analysis_blocks_outside_domain_duration_and_fail_closed(client, org, owner, checker, analyst):
    m = approved_model(client, org, owner, checker)
    b, codes = build(org, qa1_uncertainty_method=None)
    imp = do_import(client, analyst, b, m["id"], run_csv(codes)).json()
    r = analyse(client, analyst, b, [imp["id"]])
    assert r.status_code == 409 and r.json()["code"] == "RULE_MISSING"
    assert r.json()["details"]["rule_key"] == "qa1_uncertainty_method"

    b, codes = build(org, modelled_soc_permitted=False)
    imp = do_import(client, analyst, b, m["id"], run_csv(codes)).json()
    assert analyse(client, analyst, b, [imp["id"]]).json()["code"] == "MODELLED_DATA_NOT_PERMITTED"

    short = approved_model(client, org, owner, checker, validation_metrics=[
        {"pool": "soc", "practice_category": "crop_planting_harvest", "n_sites": 12, "median_duration_years": 3,
         "bias": 0.0, "bias_test_passed": True, "s2_model_delta": 0.5},
        {"pool": "soc", "practice_category": "tillage_residue", "n_sites": 12, "median_duration_years": 3,
         "bias": 0.0, "bias_test_passed": True, "s2_model_delta": 0.5}])
    b, codes = build(org)
    imp = do_import(client, analyst, b, short["id"], run_csv(codes)).json()
    r = analyse(client, analyst, b, [imp["id"]])
    assert r.status_code == 409 and r.json()["code"] == "MODEL_ERROR_DURATION"  # 4-year period > 3-year median

    clay = approved_model(client, org, owner, checker, validation_domain={
        "crop_functional_groups": ["legumes"], "practice_categories": ["crop_planting_harvest", "tillage_residue"],
        "climate_zones": ["tropical_dry"], "soil_textures": ["clay"]})
    b, codes = build(org)
    imp = do_import(client, analyst, b, clay["id"], run_csv(codes)).json()
    r = analyse(client, analyst, b, [imp["id"]])
    assert r.status_code == 409 and r.json()["code"] == "OUTSIDE_VALIDATION_DOMAIN"

    b, codes = build(org)
    imp = do_import(client, analyst, b, m["id"], run_csv(codes[:1])).json()
    r = analyse(client, analyst, b, [imp["id"]])
    assert r.status_code == 409 and r.json()["code"] == "INSUFFICIENT_POINTS"


def test_monte_carlo_meta_model_and_imported_draws(client, org, owner, checker, analyst):
    m = approved_model(client, org, owner, checker)
    b, codes = build(org, qa1_uncertainty_method="monte_carlo", qa1_mc_min_draws=200, qa1_mc_error_factor=True)
    imp = do_import(client, analyst, b, m["id"], run_csv(codes)).json()
    no_seed = analyse(client, analyst, b, [imp["id"]])
    assert no_seed.status_code == 422 and no_seed.json()["code"] == "SEED_REQUIRED"
    a1 = analyse(client, analyst, b, [imp["id"]], seed=7).json()
    a2 = analyse(client, analyst, b, [imp["id"]], seed=7).json()
    u1, u2 = a1["results"]["pools"]["soc"]["uncertainty"], a2["results"]["pools"]["soc"]["uncertainty"]
    assert u1 == u2 and u1["mc_draws"] == 200 and u1["mc_error_factor"] == pytest.approx(math.sqrt(1 + 1 / 200))
    area = u1["total_area_ha"]
    z = d.standard_normal_draws(200, 7)
    assert u1["s2_model"] == pytest.approx(area**2 * 0.8 * float(np.sum(z**2)) / 199)
    assert u1["variance_total"] == pytest.approx((u1["s2_sampling"] + u1["s2_model"]) * (1 + 1 / 200))
    assert a1["seed"] == 7 and a1["method"] == "monte_carlo"

    # imported posterior predictive draws (L = 4) — needs at least qa1_mc_min_draws
    b2, codes2 = build(org, qa1_uncertainty_method="monte_carlo", qa1_mc_min_draws=4, qa1_mc_error_factor=False)
    imp2 = do_import(client, analyst, b2, m["id"], run_csv(codes2, draws=4))
    assert imp2.status_code == 201, imp2.text
    assert imp2.json()["mc_draws"] == 4
    r = analyse(client, analyst, b2, [imp2.json()["id"]])
    assert r.status_code == 201, r.text
    soc = r.json()["results"]["pools"]["soc"]
    assert soc["draws_source"] == "imported posterior predictive draws"
    assert soc["uncertainty"]["mc_error_factor"] is None and soc["uncertainty"]["s2_model"] > 0
    terms = soc["terms"]
    assert terms["soc_project_modelled"]["value_t_co2e"] - terms["baseline_scenario"]["value_t_co2e"] == \
        pytest.approx(soc["reduction_total_t_co2e"])
    b3, codes3 = build(org, qa1_uncertainty_method="monte_carlo", qa1_mc_min_draws=10, qa1_mc_error_factor=False)
    imp3 = do_import(client, analyst, b3, m["id"], run_csv(codes3, draws=4)).json()
    r = analyse(client, analyst, b3, [imp3["id"]])
    assert r.status_code == 409 and r.json()["code"] == "MC_TOO_FEW_DRAWS"


# =============================================================== true-up (§8.6.1.3)
def test_trueup_overdue_blocks_publishing_until_trueup_mvr_and_rerun(client, org, owner, checker, analyst):
    m = approved_model(client, org, owner, checker)
    b, codes = build(org, remeasure_max_years=2)
    imp = do_import(client, analyst, b, m["id"], run_csv(codes)).json()
    an = analyse(client, analyst, b, [imp["id"]]).json()
    assert an["trueup"]["overdue"] is True and an["trueup"]["problems"][0]["code"] == "TRUEUP_OVERDUE"
    pub = client.post(f"/api/qa1/analyses/{an['id']}/publish", headers=analyst)
    assert pub.status_code == 409 and pub.json()["code"] == "TRUEUP_OVERDUE"
    status = client.get(f"/api/projects/{b.project_id}/qa1/status", headers=analyst).json()
    assert status["trueup_state"]["overdue"] is True and status["approaches"]["soc"] == "qa1"

    # re-measurement (the factory's monitoring campaign, Jan 2024) compared with the model
    tu = client.post(f"/api/projects/{b.project_id}/qa1/trueups", headers=analyst,
                     json={"import_id": imp["id"], "campaign_id": b.monitoring_id, "notes": "Year-3 re-sampling"})
    assert tu.status_code == 201, tu.text
    tu = tu.json()
    assert tu["status"] == "draft" and tu["stats"]["n"] == 5 and len(tu["points"]) == 5
    p0 = tu["points"][0]
    assert p0["error_t_co2e_ha"] == pytest.approx((p0["modelled_soc_t_c_ha"] - p0["measured_soc_t_c_ha"]) * 44 / 12)
    errs = [p["error_t_co2e_ha"] for p in tu["points"]]
    assert tu["stats"]["s2_error"] == pytest.approx(float(np.var(errs, ddof=1)))
    assert client.post(f"/api/qa1/trueups/{tu['id']}/approve", headers=analyst).status_code == 403
    approved = client.post(f"/api/qa1/trueups/{tu['id']}/approve", headers=checker)
    assert approved.status_code == 200 and approved.json()["status"] == "approved"

    # a fresh analysis with the old model/run: not overdue any more, but the MVR and re-run are required
    an2 = analyse(client, analyst, b, [imp["id"]]).json()
    codes_now = [p["code"] for p in an2["trueup"]["problems"]]
    assert "TRUEUP_OVERDUE" not in codes_now and "TRUEUP_MVR_REQUIRED" in codes_now
    pub = client.post(f"/api/qa1/analyses/{an2['id']}/publish", headers=analyst)
    assert pub.status_code == 409 and pub.json()["code"] == "TRUEUP_MVR_REQUIRED"

    # updated model validation report incorporating the true-up, then re-run from t0
    m2 = approved_model(client, org, owner, checker, trueup_ids=[tu["id"]])
    assert m2["revision"] == 2
    imp2 = do_import(client, analyst, b, m2["id"], run_csv(codes, extra_rate=0.01), supersedes_id=imp["id"])
    assert imp2.status_code == 201, imp2.text
    stale = analyse(client, analyst, b, [imp["id"]])
    assert stale.status_code == 409 and stale.json()["code"] == "IMPORT_SUPERSEDED"
    an3 = analyse(client, analyst, b, [imp2.json()["id"]]).json()
    assert an3["trueup"]["problems"] == []
    pub = client.post(f"/api/qa1/analyses/{an3['id']}/publish", headers=analyst)
    assert pub.status_code == 201, pub.text
    listed = client.get(f"/api/projects/{b.project_id}/qa1/trueups", headers=analyst).json()
    assert [t["id"] for t in listed] == [tu["id"]]


# =============================================================== soil N2O (Eq. 15, 58) and spectroscopy
def n2o_rows(codes) -> list[dict]:
    """JSON rows with SOC and soil N2O; the t0-year flux is left blank (only stocks are needed at t0)."""
    rows = []
    for i, c in enumerate(codes):
        for sc in ("baseline", "project"):
            for y in range(2020, 2025):
                soc = 34.2 * BASE_SOC[i] + ((0.3 + 0.05 * i) if sc == "project" else -0.1) * (y - 2020)
                n2o = None if y == 2020 else (0.002 if sc == "baseline" else 0.0015 + 0.0001 * i)
                rows.append({"site_code": c, "scenario": sc, "year": y, "soc_t_c_ha": soc, "n2o_t_n2o_ha": n2o,
                             "practice_category": "fertilizer_management", "crop_functional_group": "legumes"})
    return rows


def test_soil_n2o_term_with_gwp_flows_into_the_engine(client, org, owner, checker, analyst):
    metrics = [{"pool": p, "practice_category": "fertilizer_management", "n_sites": 31, "median_duration_years": 5,
                "bias": 0.0, "bias_test_passed": True, "s2_model": s2, "cov": cov}
               for p, s2, cov in (("soc", 0.8, 0.4), ("n2o_soil", 0.02, 0.005))]
    m = approved_model(client, org, owner, checker, pools=["soc", "n2o_soil"], validation_metrics=metrics,
                       validation_domain={"crop_functional_groups": ["legumes"],
                                          "practice_categories": ["fertilizer_management"],
                                          "climate_zones": ["tropical_dry"], "soil_textures": ["sandy loam"]})
    b, codes = build(org, qa_n2o_soil="qa1")
    imp = client.post(f"/api/projects/{b.project_id}/qa1/run-imports", headers=analyst,
                      json={"model_id": m["id"], "label": "SOC + N2O", "initial_campaign_id": b.baseline_id,
                            "format": "json", "rows": n2o_rows(codes)})
    assert imp.status_code == 201, imp.text
    assert imp.json()["pools"] == ["soc", "n2o_soil"] and imp.json()["source_format"] == "json"
    an = analyse(client, analyst, b, [imp.json()["id"]])
    assert an.status_code == 201, an.text
    n2o = an.json()["results"]["pools"]["n2o_soil"]
    area = n2o["uncertainty"]["total_area_ha"]
    red = [(0.002 - (0.0015 + 0.0001 * i)) * 4 * 265 for i in range(5)]  # Eq. 15/58: GWP × (bsl − wp)
    assert n2o["terms"]["n2o_soil"]["value_t_co2e"] == pytest.approx(area * float(np.mean(red)))
    s2_samp = area**2 / 20 * float(np.sum((np.array(red) - np.mean(red)) ** 2))
    s2_model = d.eq60_model_variance_delta(0.02, 0.005)  # 0.03
    assert n2o["uncertainty"]["s2_mean"] == pytest.approx(s2_samp / area**2 + s2_model)
    assert n2o["unit_note"].endswith("GWP 265 → t CO2e")
    pub = client.post(f"/api/qa1/analyses/{an.json()['id']}/publish", headers=analyst).json()
    assert {t["term"] for t in pub["terms"]} == {"soc_project_modelled", "baseline_scenario", "n2o_soil"}
    for t in pub["terms"]:
        assert client.post(f"/api/terms/{t['id']}/approve", headers=checker).status_code == 200
    run = client.post(f"/api/projects/{b.project_id}/calculations", headers=analyst, json=run_body(b))
    assert run.status_code == 201, run.text
    res = run.json()["results"]
    var = n2o["terms"]["n2o_soil"]["variance"]
    t = stats.t.ppf(0.667, n2o["terms"]["n2o_soil"]["df"])
    unc = math.sqrt(var) / n2o["terms"]["n2o_soil"]["value_t_co2e"] * t
    assert res["uncertainty"]["n2o_soil"]["unc_pct"] == pytest.approx(unc * 100)
    assert res["uncertainty"]["n2o_soil"]["after_uncertainty"] == pytest.approx(
        n2o["terms"]["n2o_soil"]["value_t_co2e"] * (1 - unc))


def test_spectroscopy_initial_soc_requires_monte_carlo(client, org, owner, checker, analyst):
    from app.modules.lab.models import LabResult

    m = approved_model(client, org, owner, checker)
    b, codes = build(org)
    with dbmod.session_factory()() as s:
        for lr in s.query(LabResult).filter_by(analyte="soc_pct").all():  # a newer, spectroscopy version
            s.add(LabResult(org_id=lr.org_id, layer_id=lr.layer_id, lab_id=lr.lab_id, analyte="soc_pct",
                            value=lr.value, unit="%", method="mir_spectroscopy", analysed_on=lr.analysed_on,
                            status="accepted", version=lr.version + 1, supersedes_id=lr.id,
                            certificate_id=lr.certificate_id))
        s.commit()
    imp = do_import(client, analyst, b, m["id"], run_csv(codes)).json()
    assert imp["spectroscopy_used"] is True
    r = analyse(client, analyst, b, [imp["id"]])
    assert r.status_code == 409 and r.json()["code"] == "MONTE_CARLO_REQUIRED"
    # documented de minimis effect (§8.6.1.1.2) lets the analytical method be used
    imp2 = do_import(client, analyst, b, m["id"], run_csv(codes, extra_rate=0.01),
                     spectroscopy_de_minimis_evidence_id=_evidence(org))
    assert analyse(client, analyst, b, [imp2.json()["id"]]).status_code == 201
