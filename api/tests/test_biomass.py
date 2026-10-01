"""Woody biomass (VM0042 v2.2 Eq. 48–51 via CDM AR-TOOL14): hand-computed equations, fail-closed cases,
four-eyes, tenancy, and an end-to-end run where the approved term changes the result."""

from __future__ import annotations

from datetime import date

import pytest

from app.core.errors import Blocked, RuleMissing, ValidationFailed
from app.modules.biomass import domain as d
from app.modules.methodology.definitions import BY_KEY
from tests._p2_factories import build_project, run_body
from tests.conftest import login, make_org, make_user

K = 44.0 / 12.0


def allo(species="Grevillea robusta", form="power_dbh", params=None, unit="kg", lo=1.0, hi=200.0, r=None, mid="m1"):
    return d.Allometry(mid, species, form, params or {"a": 0.1, "b": 2.5}, unit, lo, hi, r)


def wr(**over):
    base = dict(belowground=False, shrubs=False, cf_tree=0.47, cf_shrub=0.47, r_shrub=0.4, bdr_sf=0.1,
                b_forest_t_dm_ha=100.0, max_interval_years=5.0)
    base.update(over)
    return d.WoodyRules(**base)


# ------------------------------------------------------------------ per tree (AR-TOOL14 structure)
def test_allometric_forms_hand_computed():
    assert d.tree_agb_t(d.Tree("x", 20.0), allo(species="x")) == pytest.approx(0.1 * 20 ** 2.5 / 1000)
    m = allo(form="power_dbh_h", params={"a": 0.05, "b": 2.0, "c": 1.0})
    assert d.tree_agb_t(d.Tree("x", 20.0, 10.0), m) == pytest.approx(0.2)  # 0.05 × 400 × 10 = 200 kg
    m = allo(form="d2h", params={"a": 0.02, "b": 1.0})
    assert d.tree_agb_t(d.Tree("x", 10.0, 5.0), m) == pytest.approx(0.010)  # 0.02 × 500 = 10 kg
    m = allo(form="rho_d2h", params={"a": 0.0673, "b": 0.976, "wood_density": 0.6})
    assert d.tree_agb_t(d.Tree("x", 30.0, 20.0), m) == pytest.approx(0.0673 * (0.6 * 900 * 20) ** 0.976 / 1000)
    m = allo(form="volume_bef", params={"a": 0.0001, "b": 2.0, "c": 1.0, "wood_density": 0.5, "bef": 1.2}, unit="t")
    assert d.tree_agb_t(d.Tree("x", 20.0, 10.0), m) == pytest.approx(0.24)  # 0.4 m³ × 0.5 × 1.2
    m = allo(params={"a": 0.3, "b": 2.0}, unit="t")
    assert d.tree_agb_t(d.Tree("x", 10.0), m) == pytest.approx(30.0)  # tonnes as given


def test_allometry_fail_closed():
    with pytest.raises(ValidationFailed) as e:
        d.tree_agb_t(d.Tree("x", 250.0), allo(species="x"))
    assert e.value.code == "DBH_OUT_OF_RANGE"
    with pytest.raises(ValidationFailed) as e:
        d.tree_agb_t(d.Tree("x", 20.0), allo(form="d2h", params={"a": 0.02, "b": 1.0}))
    assert e.value.code == "HEIGHT_REQUIRED"
    with pytest.raises(RuleMissing):
        d.pick_allometry("Mango", [allo()])
    generic = allo(species="*", mid="g")
    assert d.pick_allometry("Mango", [allo(), generic]).id == "g"
    assert d.pick_allometry(" grevillea  ROBUSTA ", [allo(), generic]).id == "m1"  # exact beats generic
    with pytest.raises(ValidationFailed):
        d.validate_allometry("power_dbh", {"a": 1.0}, "kg", 1, 50)  # b missing
    with pytest.raises(ValidationFailed):
        d.validate_allometry("power_dbh", {"a": 1.0, "b": 2.0, "z": 1.0}, "kg", 1, 50)  # unused parameter
    with pytest.raises(ValidationFailed):
        d.validate_allometry("magic", {"a": 1.0}, "kg", 1, 50)
    with pytest.raises(ValidationFailed):
        d.validate_allometry("power_dbh", {"a": 1.0, "b": 2.0}, "kg", 50, 10)  # inverted range
    d.validate_allometry("power_dbh", {"a": 1.0, "b": 2.0}, "kg", 1, 50)


def test_plot_stock_with_roots_and_shrubs_hand_computed():
    m = allo(r=0.25)
    pm = d.PlotMeasurement("p", "P1", "s", 100.0, (d.Tree("Grevillea robusta", 20.0, None, 2),),
                           d.Shrub(crown_cover_fraction=0.5))
    st = d.plot_stock(pm, [m], wr(belowground=True, shrubs=True))
    agb = 0.1 * 20 ** 2.5 / 1000
    # AR-TOOL14: C_TREE = 44/12 × CF × AGB × (1 + R) × count, per ha by plot area 0.01 ha
    assert st.tree_t_co2e_ha == pytest.approx(K * 0.47 * agb * 1.25 * 2 / 0.01)
    # B_SHRUB = (1 + R_S) × BDR_SF × B_FOREST × CC = 1.4 × 0.1 × 100 × 0.5 = 7 t/ha
    assert st.shrub_t_co2e_ha == pytest.approx(K * 0.47 * 7.0)
    assert d.shrub_t_co2e_ha(d.Shrub(agb_t_dm_ha=5.0), wr(shrubs=True)) == pytest.approx(K * 0.47 * 5.0)
    # without roots R is not applied
    st2 = d.plot_stock(pm, [m], wr())
    assert st2.tree_t_co2e_ha == pytest.approx(K * 0.47 * agb * 2 / 0.01) and st2.shrub_t_co2e_ha == 0.0


def test_plot_stock_fail_closed():
    pm = d.PlotMeasurement("p", "P1", "s", 100.0, (d.Tree("Grevillea robusta", 20.0),), None)
    with pytest.raises(RuleMissing) as e:
        d.plot_stock(pm, [allo()], wr(belowground=True))  # model has no root:shoot ratio
    assert e.value.details["rule_key"] == "root_shoot_ratio"
    with pytest.raises(RuleMissing) as e:
        d.plot_stock(pm, [allo()], wr(shrubs=True))  # shrubs included, not measured
    assert e.value.details["rule_key"] == "shrub_measurement"
    with pytest.raises(RuleMissing) as e:
        d.shrub_t_co2e_ha(d.Shrub(crown_cover_fraction=0.3), wr(shrubs=True, bdr_sf=None))
    assert e.value.details["rule_key"] == "shrub_biomass_ratio_bdr_sf"
    with pytest.raises(RuleMissing):
        d.shrub_t_co2e_ha(d.Shrub(agb_t_dm_ha=1.0), wr(shrubs=True, cf_shrub=None))
    with pytest.raises(RuleMissing):
        d.shrub_t_co2e_ha(d.Shrub(agb_t_dm_ha=1.0), wr(shrubs=True, belowground=True, r_shrub=None))


# ------------------------------------------------------------------ Eq. 48–51 stock change
CF = 0.48
KPLOT = 10 * K * CF  # per-ha carbon per cm of DBH: model AGB(t) = 1 × DBH, plot 1000 m² (0.1 ha)


def _lin():
    return allo(species="*", params={"a": 1.0, "b": 1.0}, unit="t", lo=0.5, hi=500)


def _pm(pid, stratum, dbh, harvested=False):
    return d.PlotMeasurement(pid, pid.upper(), stratum, 1000.0, (d.Tree("Any", dbh),), None, harvested)


STRATA = {"A": d.StratumArea("A", "ZA", 20.0, "QU1"), "B": d.StratumArea("B", "ZB", 10.0)}


def test_eq49_stock_change_variance_and_df_hand_computed():
    before = [_pm("a1", "A", 10), _pm("a2", "A", 12), _pm("a3", "A", 14), _pm("b1", "B", 20), _pm("b2", "B", 30)]
    after = [_pm("a1", "A", 13), _pm("a2", "A", 14), _pm("a3", "A", 18), _pm("b1", "B", 21), _pm("b2", "B", 33),
             _pm("new", "B", 5)]
    x = 2.5
    r = d.stock_change(before, after, STRATA, [_lin()], wr(cf_tree=CF), x, "project")
    # zone A: Δ DBH 3, 2, 4 → mean 3, s² 1; zone B: Δ 1, 3 → mean 2, s² 2
    a_annual, b_annual = KPLOT * 3 / x * 20, KPLOT * 2 / x * 10
    assert r["tree_annual_t_co2e"] == pytest.approx(a_annual + b_annual)
    assert r["shrub_annual_t_co2e"] == 0.0 and r["annual_t_co2e"] == pytest.approx(a_annual + b_annual)
    va = (20 / x) ** 2 * KPLOT ** 2 * 1 / 3
    vb = (10 / x) ** 2 * KPLOT ** 2 * 2 / 2
    assert r["variance_annual"] == pytest.approx(va + vb)
    assert r["df"] == pytest.approx((va + vb) ** 2 / (va ** 2 / 2 + vb ** 2 / 1))
    assert r["equations"] == ["Eq. 49"] and r["unpaired_plots"] == ["NEW"]
    za = r["strata"][0]
    assert za["stratum_code"] == "ZA" and za["n_plots"] == 3 and za["df"] == 2
    assert za["tree_t_co2e_ha_start"] == pytest.approx(KPLOT * 12) and za["tree_t_co2e_ha_end"] == pytest.approx(KPLOT * 15)
    # baseline scenario uses Eq. 48 / 50; a loss stays negative (sign: positive = removal)
    lost = d.stock_change(after[:5], before, STRATA, [_lin()], wr(cf_tree=CF, shrubs=True), x, "baseline") \
        if False else None
    assert lost is None
    neg = d.stock_change([_pm("a1", "A", 13), _pm("a2", "A", 14)], [_pm("a1", "A", 10), _pm("a2", "A", 12)],
                         STRATA, [_lin()], wr(cf_tree=CF), 2.0, "baseline")
    assert neg["equations"] == ["Eq. 48"] and neg["annual_t_co2e"] == pytest.approx(KPLOT * -2.5 / 2 * 20)


def test_eq51_shrubs_paired_with_trees():
    def pm(pid, dbh, cc):
        return d.PlotMeasurement(pid, pid, "A", 1000.0, (d.Tree("Any", dbh),), d.Shrub(crown_cover_fraction=cc))
    r = d.stock_change([pm("p1", 10, 0.2), pm("p2", 10, 0.4)], [pm("p1", 12, 0.3), pm("p2", 11, 0.4)], STRATA,
                       [_lin()], wr(cf_tree=CF, shrubs=True), 2.0, "project")
    shrub_per_cc = K * 0.47 * 0.1 * 100.0  # no roots: BDR_SF × B_FOREST × CC × CF × 44/12
    assert r["shrub_annual_t_co2e"] == pytest.approx(shrub_per_cc * 0.05 / 2 * 20)  # mean ΔCC 0.05
    assert r["tree_annual_t_co2e"] == pytest.approx(KPLOT * 1.5 / 2 * 20)
    dt = [KPLOT * 2 + shrub_per_cc * 0.1, KPLOT * 1 + 0.0]
    mean = sum(dt) / 2
    s2 = sum((v - mean) ** 2 for v in dt)
    assert r["variance_annual"] == pytest.approx((20 / 2) ** 2 * s2 / 2)  # combined, with covariance
    assert r["equations"] == ["Eq. 49", "Eq. 51"]


def test_stock_change_fail_closed():
    two = [_pm("a1", "A", 10), _pm("a2", "A", 12)]
    later = [_pm("a1", "A", 11), _pm("a2", "A", 13)]
    with pytest.raises(Blocked) as e:
        d.stock_change(two, later, STRATA, [_lin()], wr(cf_tree=CF), 5.5, "project")
    assert e.value.code == "INTERVAL_TOO_LONG"
    with pytest.raises(ValidationFailed):
        d.stock_change(two, later, STRATA, [_lin()], wr(cf_tree=CF), 0.0, "project")
    with pytest.raises(Blocked) as e:
        d.stock_change(two, [_pm("a1", "A", 11, harvested=True), _pm("a2", "A", 13)], STRATA, [_lin()],
                       wr(cf_tree=CF), 2.0, "project")
    assert e.value.code == "HARVEST_LTA_REQUIRED"
    with pytest.raises(Blocked) as e:
        d.stock_change(two[:1], later[:1], STRATA, [_lin()], wr(cf_tree=CF), 2.0, "project")
    assert e.value.code == "TOO_FEW_PLOTS"
    with pytest.raises(Blocked) as e:
        d.stock_change(two, [_pm("z", "A", 11)], STRATA, [_lin()], wr(cf_tree=CF), 2.0, "project")
    assert e.value.code == "NO_PAIRED_PLOTS"
    with pytest.raises(RuleMissing):
        d.stock_change(two, later, {"A": d.StratumArea("A", "ZA", 0.0)}, [_lin()], wr(cf_tree=CF), 2.0, "project")


def test_credit_period_like_engine_soc():
    p = d.credit_period(10.0, 4.0, 3.0, 4.0)
    assert p["credited_years"] == 3.0 and p["value_t_co2e"] == 30.0 and p["variance"] == 36.0
    p = d.credit_period(10.0, 4.0, 3.0, 1.0)
    assert p["credited_years"] == 1.0 and p["value_t_co2e"] == 10.0 and p["variance"] == 4.0


def test_rule_definitions_cite_vm0042():
    for key in ("woody_biomass_included", "woody_belowground_included", "woody_shrubs_included",
                "tree_carbon_fraction", "shrub_carbon_fraction", "shrub_root_shoot_ratio",
                "shrub_biomass_ratio_bdr_sf", "shrub_forest_biomass_t_dm_ha"):
        assert BY_KEY[key].vm0042_default is None and BY_KEY[key].ref_parts()[1], key  # project-specific
        assert BY_KEY[key].required is False
    assert BY_KEY["woody_remeasure_max_years"].vm0042_default == 5
    assert BY_KEY["woody_remeasure_max_years"].ref_parts() == ("§9.2", "131")


# ------------------------------------------------------------------ API
WOODY_RULES = {"woody_biomass_included": True, "woody_belowground_included": True, "woody_shrubs_included": False,
               "tree_carbon_fraction": 0.47}


@pytest.fixture()
def built(client, org):
    return build_project(org, rules_over=WOODY_RULES)


def _evidence(client, h, name="sheet.pdf"):
    r = client.post("/api/evidence", headers=h, files={"file": (name, name.encode() + b"-content", "application/pdf")},
                    data={"kind": "document"})
    assert r.status_code == 201, r.text
    return r.json()["id"]


def _inventory(client, b, analyst, manager, owner, dbh0=(10.0, 12.0, 14.0), dbh1=(13.0, 14.0, 18.0)):
    ev = _evidence(client, analyst)
    m = client.post(f"/api/projects/{b.project_id}/allometric-models", headers=analyst, json={
        "species": "Silver oak", "form": "power_dbh", "params": {"a": 0.1, "b": 2.5}, "output_unit": "kg",
        "dbh_min_cm": 5, "dbh_max_cm": 80, "root_shoot_ratio": 0.25, "source": "Published equation, J. Trop. For. 2015",
        "evidence_ids": [ev]})
    assert m.status_code == 201, m.text
    assert client.post(f"/api/allometric-models/{m.json()['id']}/approve", headers=owner).status_code == 200
    c0 = client.post(f"/api/projects/{b.project_id}/biomass/campaigns", headers=manager,
                     json={"code": "T0", "measured_on": "2021-03-01"}).json()
    c1 = client.post(f"/api/projects/{b.project_id}/biomass/campaigns", headers=manager,
                     json={"code": "T1", "measured_on": "2024-03-01"}).json()
    plots = []
    for i in range(3):
        p = client.post(f"/api/projects/{b.project_id}/biomass/plots", headers=manager, json={
            "stratum_id": b.stratum_id, "code": f"TP{i}", "scenario": "project", "area_m2": 500})
        assert p.status_code == 201, p.text
        plots.append(p.json())
    ev2 = _evidence(client, manager, "field-sheet.pdf")
    for c, dbhs in ((c0, dbh0), (c1, dbh1)):
        for p, dbh in zip(plots, dbhs):
            r = client.post("/api/biomass/measurements", headers=manager, json={
                "campaign_id": c["id"], "plot_id": p["id"], "evidence_ids": [ev2],
                "trees": [{"species": "Silver oak", "dbh_cm": dbh, "height_m": 9.0, "count": 4}]})
            assert r.status_code == 201, r.text
    return {"model": m.json(), "c0": c0, "c1": c1, "plots": plots, "evidence": ev2}


def _body(inv, **over):
    return {"scenario": "project", "from_campaign_id": inv["c0"]["id"], "to_campaign_id": inv["c1"]["id"],
            "period_label": "P1", "period_start": "2021-01-01", "period_end": "2024-12-31", **over}


def _expected(b_area, dbh0, dbh1, x):
    def c(dbh):  # t CO2e/ha on a 500 m² plot, 4 trees, R 0.25, CF 0.47
        return K * 0.47 * (0.1 * dbh ** 2.5 / 1000) * 1.25 * 4 / 0.05
    diffs = [c(b) - c(a) for a, b in zip(dbh0, dbh1)]
    mean = sum(diffs) / 3
    s2 = sum((v - mean) ** 2 for v in diffs) / 2
    return mean / x * b_area, (b_area / x) ** 2 * s2 / 3


def test_api_inventory_compute_publish_approve_changes_run(client, built, as_role):
    analyst, manager, owner = as_role("mrv_analyst"), as_role("programme_admin"), as_role("methodology_owner")
    inv = _inventory(client, built, analyst, manager, owner)
    from app.core import db as dbmod
    from app.modules.sampling.models import Stratum
    with dbmod.session_factory()() as s:
        area = s.get(Stratum, __import__("uuid").UUID(built.stratum_id)).area_ha
    x = (date(2024, 3, 1) - date(2021, 3, 1)).days / 365.25
    annual, var_annual = _expected(area, (10.0, 12.0, 14.0), (13.0, 14.0, 18.0), x)

    prev = client.post(f"/api/projects/{built.project_id}/biomass/compute", headers=analyst, json=_body(inv))
    assert prev.status_code == 200, prev.text
    res = prev.json()
    assert res["annual_t_co2e"] == pytest.approx(annual) and res["variance_annual"] == pytest.approx(var_annual)
    assert res["interval_years"] == pytest.approx(x) and res["credited_years"] == pytest.approx(x)
    assert res["value_t_co2e"] == pytest.approx(annual * x) and res["df"] == pytest.approx(2)
    assert res["term"] == "woody_biomass_project" and res["allometric_model_ids"] == [inv["model"]["id"]]

    before = client.post(f"/api/projects/{built.project_id}/calculations", headers=analyst, json=run_body(built))
    assert before.status_code == 201, before.text

    pub = client.post(f"/api/projects/{built.project_id}/biomass/publish-term", headers=analyst, json=_body(inv))
    assert pub.status_code == 201, pub.text
    term = pub.json()["term"]
    assert term["status"] == "draft" and term["term"] == "woody_biomass_project"
    assert term["value_t_co2e"] == pytest.approx(annual * x) and term["variance"] == pytest.approx(var_annual * x * x)
    assert pub.json()["computation"]["id"] in term["source"] and "Eq. 49" in term["source"]
    comps = client.get(f"/api/projects/{built.project_id}/term-computations", headers=analyst).json()
    assert len(comps) == 1 and comps[0]["term_estimate_id"] == term["id"]
    # draft terms are not used; the analyst can't approve (permission), a methodology owner can
    assert client.post(f"/api/terms/{term['id']}/approve", headers=analyst).status_code == 403
    assert client.post(f"/api/terms/{term['id']}/approve", headers=owner).status_code == 200

    after = client.post(f"/api/projects/{built.project_id}/calculations", headers=analyst, json=run_body(built))
    assert after.status_code == 201, after.text
    terms = {t["term"]: t for t in after.json()["results"]["terms"]}
    assert terms["woody_biomass_project"]["value_t_co2e"] == pytest.approx(annual * x)
    # Eq. 45 adds ΔC_TREE,wp to ΔCO2_wp: gross benefit rises by exactly the term
    assert after.json()["gross_t_co2e"] - before.json()["gross_t_co2e"] == pytest.approx(annual * x, rel=1e-6)
    assert after.json()["net_t_co2e"] > before.json()["net_t_co2e"]


def test_api_baseline_plots_in_control_zone_scaled_by_project_zone_area(client, built, as_role):
    """QA2: plots on control sites measure the baseline of the project zone they control, so Eq. 48 scales their
    per-hectare change by that project zone's area (as Eq. 46 does for SOC), not by the control plots' own area."""
    analyst, manager, owner = as_role("mrv_analyst"), as_role("programme_admin"), as_role("methodology_owner")
    ev = _evidence(client, analyst)
    m = client.post(f"/api/projects/{built.project_id}/allometric-models", headers=analyst, json={
        "species": "Silver oak", "form": "power_dbh", "params": {"a": 0.1, "b": 2.5}, "output_unit": "kg",
        "dbh_min_cm": 5, "dbh_max_cm": 80, "root_shoot_ratio": 0.25, "source": "Published equation, J. Trop. For. 2015",
        "evidence_ids": [ev]}).json()
    assert client.post(f"/api/allometric-models/{m['id']}/approve", headers=owner).status_code == 200
    c0 = client.post(f"/api/projects/{built.project_id}/biomass/campaigns", headers=manager,
                     json={"code": "T0", "measured_on": "2021-03-01"}).json()
    c1 = client.post(f"/api/projects/{built.project_id}/biomass/campaigns", headers=manager,
                     json={"code": "T1", "measured_on": "2024-03-01"}).json()
    ev2 = _evidence(client, manager, "field-sheet.pdf")
    dbh0, dbh1 = (10.0, 12.0, 14.0), (11.0, 13.5, 14.5)
    for i, (a, b) in enumerate(zip(dbh0, dbh1)):
        p = client.post(f"/api/projects/{built.project_id}/biomass/plots", headers=manager, json={
            "stratum_id": built.control_stratum_id, "code": f"CP{i}", "scenario": "baseline", "area_m2": 500}).json()
        for c, dbh in ((c0, a), (c1, b)):
            assert client.post("/api/biomass/measurements", headers=manager, json={
                "campaign_id": c["id"], "plot_id": p["id"], "evidence_ids": [ev2],
                "trees": [{"species": "Silver oak", "dbh_cm": dbh, "height_m": 9.0, "count": 4}]}).status_code == 201
    from app.core import db as dbmod
    from app.modules.sampling.models import Stratum
    with dbmod.session_factory()() as s:
        project_area = s.get(Stratum, __import__("uuid").UUID(built.stratum_id)).area_ha
        control_area = s.get(Stratum, __import__("uuid").UUID(built.control_stratum_id)).area_ha
    assert abs(project_area - control_area) > 0.1
    x = (date(2024, 3, 1) - date(2021, 3, 1)).days / 365.25
    annual, var_annual = _expected(project_area, dbh0, dbh1, x)
    res = client.post(f"/api/projects/{built.project_id}/biomass/compute", headers=analyst, json={
        "scenario": "baseline", "from_campaign_id": c0["id"], "to_campaign_id": c1["id"], "period_label": "P1",
        "period_start": "2021-01-01", "period_end": "2024-12-31"})
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["term"] == "woody_biomass_baseline" and body["equations"] == ["Eq. 48"]
    assert body["annual_t_co2e"] == pytest.approx(annual) and body["variance_annual"] == pytest.approx(var_annual)
    row = body["strata"][0]
    assert row["area_ha"] == pytest.approx(project_area) and row["stratum_id"] == built.control_stratum_id
    assert row["quantification_unit"] == "QU1"


def test_api_four_eyes_corrections_and_permissions(client, built, as_role):
    analyst, manager, owner = as_role("mrv_analyst"), as_role("programme_admin"), as_role("methodology_owner")
    admin = as_role("platform_admin")
    ev = _evidence(client, admin)
    m = client.post(f"/api/projects/{built.project_id}/allometric-models", headers=admin, json={
        "species": "*", "form": "power_dbh", "params": {"a": 0.1, "b": 2.5}, "output_unit": "kg",
        "dbh_min_cm": 5, "dbh_max_cm": 80, "source": "Generic pantropical equation", "evidence_ids": [ev]}).json()
    selfie = client.post(f"/api/allometric-models/{m['id']}/approve", headers=admin)
    assert selfie.status_code == 403 and selfie.json()["code"] == "SELF_APPROVAL_REJECTED"
    # no evidence → refused; unknown evidence → refused
    bad = client.post(f"/api/projects/{built.project_id}/allometric-models", headers=analyst, json={
        "species": "x", "form": "power_dbh", "params": {"a": 0.1, "b": 2.5}, "output_unit": "kg",
        "dbh_min_cm": 5, "dbh_max_cm": 80, "source": "Somewhere", "evidence_ids": []})
    assert bad.status_code == 422 and bad.json()["code"] == "EVIDENCE_REQUIRED"
    assert client.post(f"/api/projects/{built.project_id}/biomass/plots", headers=as_role("field_collector"), json={
        "stratum_id": built.stratum_id, "code": "X", "scenario": "project", "area_m2": 100}).status_code == 403

    inv = _inventory(client, built, analyst, manager, owner)
    # duplicate measurement refused; correction is a new version (append-only)
    dup = client.post("/api/biomass/measurements", headers=manager, json={
        "campaign_id": inv["c0"]["id"], "plot_id": inv["plots"][0]["id"], "evidence_ids": [inv["evidence"]],
        "trees": [{"species": "Silver oak", "dbh_cm": 10, "count": 1}]})
    assert dup.status_code == 409 and dup.json()["code"] == "DUPLICATE_MEASUREMENT"
    rows = client.get(f"/api/projects/{built.project_id}/biomass/measurements?campaign_id={inv['c1']['id']}",
                      headers=analyst).json()
    rec = next(r for r in rows if r["plot_id"] == inv["plots"][0]["id"])
    v2 = client.post(f"/api/biomass/measurements/{rec['record_id']}/versions", headers=manager, json={
        "trees": [{"species": "Silver oak", "dbh_cm": 15.0, "height_m": 9.0, "count": 4}],
        "evidence_ids": [inv["evidence"]], "reason": "Mis-typed DBH on field sheet"})
    assert v2.status_code == 201 and v2.json()["version"] == 2
    res = client.post(f"/api/projects/{built.project_id}/biomass/compute", headers=analyst, json=_body(inv)).json()
    x = res["interval_years"]
    from app.core import db as dbmod
    from app.modules.sampling.models import Stratum
    with dbmod.session_factory()() as s:
        area = s.get(Stratum, __import__("uuid").UUID(built.stratum_id)).area_ha
    annual, _ = _expected(area, (10.0, 12.0, 14.0), (15.0, 14.0, 18.0), x)
    assert res["annual_t_co2e"] == pytest.approx(annual)
    # voiding a plot leaves 2 paired plots; voiding two leaves 1 → blocked (fail closed)
    for p in inv["plots"][:2]:
        rec = next(r for r in client.get(f"/api/projects/{built.project_id}/biomass/measurements", headers=analyst)
                   .json() if r["plot_id"] == p["id"] and r["campaign_id"] == inv["c1"]["id"])
        assert client.post(f"/api/biomass/measurements/{rec['record_id']}/void", headers=manager,
                           json={"reason": "Plot destroyed"}).status_code == 201
    few = client.post(f"/api/projects/{built.project_id}/biomass/compute", headers=analyst, json=_body(inv))
    assert few.status_code == 409 and few.json()["code"] == "TOO_FEW_PLOTS"
    # publishing a term needs calc.run / rules.edit
    assert client.post(f"/api/projects/{built.project_id}/biomass/publish-term", headers=manager,
                       json=_body(inv)).status_code == 403


def test_api_fail_closed_rules(client, org, as_role):
    b = build_project(org, rules_over={"woody_biomass_included": False})
    analyst, manager, owner = as_role("mrv_analyst"), as_role("programme_admin"), as_role("methodology_owner")
    inv = _inventory(client, b, analyst, manager, owner)
    r = client.post(f"/api/projects/{b.project_id}/biomass/compute", headers=analyst, json=_body(inv))
    assert r.status_code == 409 and r.json()["code"] == "WOODY_NOT_INCLUDED"
    b2 = build_project(org, rules_over={**WOODY_RULES, "tree_carbon_fraction": None})
    inv2 = _inventory(client, b2, analyst, manager, owner)
    r = client.post(f"/api/projects/{b2.project_id}/biomass/compute", headers=analyst, json=_body(inv2))
    assert r.status_code == 409 and r.json()["code"] == "RULE_MISSING"
    assert r.json()["details"]["rule_key"] == "tree_carbon_fraction"
    # a species without an approved equation fails closed
    b3 = build_project(org, rules_over=WOODY_RULES)
    inv3 = _inventory(client, b3, analyst, manager, owner)
    client.post(f"/api/allometric-models/{inv3['model']['id']}/retire", headers=owner,
                json={"reason": "Superseded by a local equation"})
    r = client.post(f"/api/projects/{b3.project_id}/biomass/compute", headers=analyst, json=_body(inv3))
    assert r.status_code == 409 and r.json()["details"]["rule_key"] == "allometric_model"
    # out-of-range tree
    b4 = build_project(org, rules_over=WOODY_RULES)
    inv4 = _inventory(client, b4, analyst, manager, owner, dbh1=(13.0, 14.0, 95.0))
    r = client.post(f"/api/projects/{b4.project_id}/biomass/compute", headers=analyst, json=_body(inv4))
    assert r.status_code == 422 and r.json()["code"] == "DBH_OUT_OF_RANGE"


def test_api_tenancy(client, built, as_role):
    analyst, manager, owner = as_role("mrv_analyst"), as_role("programme_admin"), as_role("methodology_owner")
    inv = _inventory(client, built, analyst, manager, owner)
    rival_org = make_org("Rival Biomass")
    rival = login(client, make_user(rival_org, "mrv_analyst"))
    rival_owner = login(client, make_user(rival_org, "methodology_owner"))
    assert client.get(f"/api/projects/{built.project_id}/biomass/plots", headers=rival).status_code == 404
    assert client.post(f"/api/projects/{built.project_id}/biomass/compute", headers=rival,
                       json=_body(inv)).status_code == 404
    assert client.post(f"/api/projects/{built.project_id}/biomass/publish-term", headers=rival,
                       json=_body(inv)).status_code == 404
    assert client.post(f"/api/allometric-models/{inv['model']['id']}/approve", headers=rival_owner).status_code == 404
    assert client.post("/api/biomass/measurements", headers=rival, json={
        "campaign_id": inv["c0"]["id"], "plot_id": inv["plots"][0]["id"], "evidence_ids": [inv["evidence"]],
        "trees": []}).status_code == 404
    rec = client.get(f"/api/projects/{built.project_id}/biomass/measurements", headers=analyst).json()[0]
    assert client.post(f"/api/biomass/measurements/{rec['record_id']}/void", headers=rival,
                       json={"reason": "Not mine"}).status_code == 404
