"""Leakage: LE_BR (VM0042 §8.4.4, CDM TOOL16) and LK_disp (§8.4.2–8.4.3, VMD0054, Eq. 34–36) — hand-computed
equations, fail-closed cases, four-eyes, tenancy, and runs where approved terms change the result."""

from __future__ import annotations

import pytest

from app.core.errors import RuleMissing, ValidationFailed
from app.modules.leakage import domain as d
from tests._p2_factories import build_project, run_body
from tests.conftest import login, make_org, make_user


# ------------------------------------------------------------------ TOOL16
def test_tool16_le_br_hand_computed():
    r = d.tool16_le_br([d.Residue("a", "rice husk", 10.0, 15.0, 0.0741),
                        d.Residue("b", "coffee pulp", 5.0, None, None, leakage_ruled_out=True),
                        d.Residue("c", "maize stover", 2.0, 16.0, 0.0961)])
    assert r["le_br_t_co2e"] == pytest.approx(10 * 15 * 0.0741 + 2 * 16 * 0.0961)
    assert r["items"][0]["energy_gj"] == pytest.approx(150.0) and r["items"][1]["le_br_t_co2e"] == 0.0
    with pytest.raises(RuleMissing):
        d.tool16_le_br([d.Residue("a", "rice husk", 10.0, None, 0.07)])
    with pytest.raises(ValidationFailed):
        d.tool16_le_br([d.Residue("a", "rice husk", -1.0, 15.0, 0.07)])


# ------------------------------------------------------------------ Eq. 34–36
def test_eq34_35_36_hand_computed():
    assert d.eq34_production_change(100 - 80, 5) == 15
    assert d.eq34_production_change(50 - 60, 0) == -10  # production increase: land sparing, not floored
    assert d.eq35_area([3.0, -1.0]) == 2.0
    assert d.eq35_area([-3.0, 1.0]) == 0.0
    assert d.eq36_lk_disp(10.0, 4.0, 2.0) == 3.0
    assert d.eq36_lk_disp(3.0, 4.0, 2.0) == 0.0
    with pytest.raises(ValidationFailed):
        d.eq36_lk_disp(1.0, 0.0, 0.0)


def _y21():
    return d.DisplacementYear(2021, "vmd0054", (
        d.Commodity("milk", "t", 100.0, 80.0, 5.0, 2.0),
        d.Commodity("maize", "t", 50.0, 60.0, 0.0, -0.5)), (d.Livestock("dairy cattle", 40, 30),), 100.0, "r21")


def _y22():
    return d.DisplacementYear(2022, "no_decrease", (d.Commodity("milk", "t", 100.0, 105.0),), (), None, "r22")


def _y23():
    return d.DisplacementYear(2023, "vmd0054", (d.Commodity("milk", "t", 100.0, 90.0, 0.0, 1.0),), (), 100.0, "r23")


def test_year_leakage_and_period_hand_computed():
    y = d.year_leakage(_y21())
    assert [c["l"] for c in y["commodities"]] == [15.0, -10.0]
    assert y["al_ha"] == 1.5 and y["leakage_t_co2e"] == 150.0 and y["livestock"][0]["decline"] is True
    recs = {2021: _y21(), 2022: _y22(), 2023: _y23()}
    p = d.lk_disp_period(recs, 2021, 2023, 2023, 1.0)
    assert p["lk_t_t_co2e"] == 250.0 and p["lk_prior_t_co2e"] == 150.0
    assert p["lk_disp_annual_t_co2e"] == 100.0 and p["value_t_co2e"] == 100.0
    p = d.lk_disp_period(recs, 2021, 2021, 2022, 2.0)
    assert p["lk_t_t_co2e"] == 150.0 and p["lk_prior_t_co2e"] == 0.0 and p["lk_disp_annual_t_co2e"] == 75.0
    assert p["value_t_co2e"] == 150.0 and any("§8.4.2(a)" in w for w in p["warnings"])
    only = d.lk_disp_period({2022: _y22()}, 2022, 2022, 2022, 1.0)
    assert only["value_t_co2e"] == 0.0 and only["all_no_decrease"] is True


def test_displacement_fail_closed():
    with pytest.raises(RuleMissing) as e:
        d.lk_disp_period({2021: _y21(), 2023: _y23()}, 2021, 2023, 2023, 1.0)
    assert e.value.details["years"] == [2022]
    with pytest.raises(ValidationFailed) as e:
        d.check_no_decrease([d.Commodity("milk", "t", 100.0, 90.0)])
    assert e.value.code == "PRODUCTION_DECREASED"
    with pytest.raises(ValidationFailed):
        d.check_no_decrease([])
    with pytest.raises(RuleMissing):
        d.check_vmd0054(d.DisplacementYear(2021, "vmd0054", (d.Commodity("milk", "t", 1, 0, None, 1.0),), (), 1.0))
    with pytest.raises(RuleMissing):
        d.check_vmd0054(d.DisplacementYear(2021, "vmd0054", (d.Commodity("milk", "t", 1, 0, 0, 1.0),), (), None))
    with pytest.raises(ValidationFailed):
        d.lk_disp_period({2020: _y21()}, 2021, 2020, 2020, 1.0)  # period before project start


# ------------------------------------------------------------------ API
@pytest.fixture()
def built(client, org):
    return build_project(org)


def _evidence(client, h, name="records.pdf"):
    r = client.post("/api/evidence", headers=h, files={"file": (name, name.encode() + b"-x", "application/pdf")},
                    data={"kind": "document"})
    assert r.status_code == 201, r.text
    return r.json()["id"]


def _residue(ev, **over):
    return {"period_label": "P1", "residue_type": "coffee husk", "baseline_energy_use": "Fuel for the village dryer",
            "quantity_t_dry": 20.0, "ncv_gj_per_t_dry": 15.0, "ef_co2_t_per_gj": 0.0741,
            "factor_source": "NCV: lab report 2021; EF: IPCC 2006 Vol 2 Table 1.4 (diesel)", "evidence_ids": [ev],
            **over}


def _disp(ev, year, mode="vmd0054", **over):
    body = {"year": year, "mode": mode, "statement": "Herd and dairy sales records for the year are attached.",
            "evidence_ids": [ev]}
    if mode == "vmd0054":
        body.update(commodities=[{"commodity": "milk", "unit": "t", "baseline_production": 100,
                                  "project_production": 80, "lm": 5, "inl_ha": 2}],
                    livestock=[{"livestock_type": "dairy cattle", "baseline_head": 40, "project_head": 30}],
                    ef_t_co2e_per_ha=10.0, ef_source="VMD0054 worksheet, regional land-conversion factor")
    else:
        body.update(commodities=[{"commodity": "milk", "unit": "t", "baseline_production": 100,
                                  "project_production": 101}])
    body.update(over)
    return body


def test_api_residues_publish_approve_changes_run(client, built, as_role):
    analyst, manager, owner = as_role("mrv_analyst"), as_role("programme_admin"), as_role("methodology_owner")
    ev = _evidence(client, manager)
    pid = built.project_id
    assert client.post(f"/api/projects/{pid}/leakage/residues", headers=manager, json=_residue(ev)).status_code == 201
    out = client.post(f"/api/projects/{pid}/leakage/residues", headers=manager, json=_residue(
        ev, residue_type="prunings", ncv_gj_per_t_dry=None, ef_co2_t_per_gj=None, leakage_ruled_out=True,
        ruled_out_reason="Prunings were left in the field before the project (photos, farmer survey)."))
    assert out.status_code == 201, out.text
    # missing factors are refused with a plain message
    bad = client.post(f"/api/projects/{pid}/leakage/residues", headers=manager,
                      json=_residue(ev, ncv_gj_per_t_dry=None))
    assert bad.status_code == 422
    expected = 20 * 15 * 0.0741
    prev = client.post(f"/api/projects/{pid}/leakage/residues/compute", headers=analyst, json={"period_label": "P1"})
    assert prev.status_code == 200 and prev.json()["value_t_co2e"] == pytest.approx(expected)
    none = client.post(f"/api/projects/{pid}/leakage/residues/compute", headers=analyst, json={"period_label": "P9"})
    assert none.status_code == 409 and none.json()["code"] == "RULE_MISSING"

    before = client.post(f"/api/projects/{pid}/calculations", headers=analyst, json=run_body(built)).json()
    pub = client.post(f"/api/projects/{pid}/leakage/residues/publish-term", headers=analyst, json={"period_label": "P1"})
    assert pub.status_code == 201, pub.text
    term = pub.json()["term"]
    assert term["term"] == "leakage_biomass_residues" and term["status"] == "draft" and "TOOL16" in term["source"]
    assert client.post(f"/api/terms/{term['id']}/approve", headers=owner).status_code == 200
    after = client.post(f"/api/projects/{pid}/calculations", headers=analyst, json=run_body(built)).json()
    assert after["results"]["leakage"]["le_br_t_co2e"] == pytest.approx(expected)
    lk = after["results"]["leakage"]["total_t_co2e"] - before["results"]["leakage"]["total_t_co2e"]
    assert lk == pytest.approx(expected)
    assert after["net_t_co2e"] < before["net_t_co2e"]


def test_api_displacement_publish_approve_and_no_decrease(client, built, as_role):
    analyst, manager, owner = as_role("mrv_analyst"), as_role("programme_admin"), as_role("methodology_owner")
    ev = _evidence(client, manager)
    pid = built.project_id
    for y in (2021, 2022):
        assert client.post(f"/api/projects/{pid}/leakage/displacement", headers=manager,
                           json=_disp(ev, y)).status_code == 201
    body = {"period_label": "P1", "period_start": "2021-01-01", "period_end": "2024-12-31"}
    miss = client.post(f"/api/projects/{pid}/leakage/displacement/compute", headers=analyst, json=body)
    assert miss.status_code == 409 and miss.json()["details"]["years"] == [2023, 2024]
    # §8.4.2(b): a decrease can't be declared as "no decrease"
    lie = client.post(f"/api/projects/{pid}/leakage/displacement", headers=manager, json=_disp(
        ev, 2023, "no_decrease", commodities=[{"commodity": "milk", "unit": "t", "baseline_production": 100,
                                               "project_production": 90}]))
    assert lie.status_code == 422 and lie.json()["code"] == "PRODUCTION_DECREASED"
    for y in (2023, 2024):
        assert client.post(f"/api/projects/{pid}/leakage/displacement", headers=manager,
                           json=_disp(ev, y, "no_decrease")).status_code == 201
    dup = client.post(f"/api/projects/{pid}/leakage/displacement", headers=manager, json=_disp(ev, 2024, "no_decrease"))
    assert dup.status_code == 409
    res = client.post(f"/api/projects/{pid}/leakage/displacement/compute", headers=analyst, json=body).json()
    # 2021, 2022: l = 20 − 5 = 15, AL = 2 ha × 10 t CO2e/ha = 20 each; 2023–24 no decrease → 0

    assert res["lk_t_t_co2e"] == 40.0 and res["lk_prior_t_co2e"] == 0.0
    assert res["verification_years"] == pytest.approx(4.0)
    assert res["lk_disp_annual_t_co2e"] == pytest.approx(10.0) and res["value_t_co2e"] == pytest.approx(40.0)

    before = client.post(f"/api/projects/{pid}/calculations", headers=analyst, json=run_body(built)).json()
    pub = client.post(f"/api/projects/{pid}/leakage/displacement/publish-term", headers=analyst, json=body)
    assert pub.status_code == 201, pub.text
    term = pub.json()["term"]
    assert term["term"] == "leakage_displacement" and "Eq. 34–36" in term["source"]
    assert client.post(f"/api/terms/{term['id']}/approve", headers=owner).status_code == 200
    after = client.post(f"/api/projects/{pid}/calculations", headers=analyst, json=run_body(built)).json()
    assert after["results"]["leakage"]["lk_disp_t_co2e"] == pytest.approx(40.0)
    assert after["results"]["leakage"]["total_t_co2e"] - before["results"]["leakage"]["total_t_co2e"] == \
        pytest.approx(40.0)

    # a later period: correcting 2021 to "no decrease" (new version) — LK_prior counts from the project start
    rows = client.get(f"/api/projects/{pid}/leakage/displacement", headers=analyst).json()
    r21 = next(r for r in rows if r["year"] == 2021)
    v2 = client.post(f"/api/leakage/displacement/{r21['record_id']}/versions", headers=manager,
                     json={**_disp(ev, 2021, "no_decrease"), "reason": "Sales ledger found: production rose"})
    assert v2.status_code == 201 and v2.json()["version"] == 2
    p2 = client.post(f"/api/projects/{pid}/leakage/displacement/compute", headers=analyst,
                     json={"period_label": "P2", "period_start": "2022-01-01", "period_end": "2022-12-31"}).json()
    assert p2["lk_prior_t_co2e"] == 0.0 and p2["lk_t_t_co2e"] == 20.0 and p2["value_t_co2e"] == pytest.approx(20.0)


def test_api_four_eyes_permissions_tenancy(client, built, as_role):
    admin, manager = as_role("platform_admin"), as_role("programme_admin")
    ev = _evidence(client, admin)
    pid = built.project_id
    client.post(f"/api/projects/{pid}/leakage/residues", headers=admin, json=_residue(ev))
    pub = client.post(f"/api/projects/{pid}/leakage/residues/publish-term", headers=admin, json={"period_label": "P1"})
    selfie = client.post(f"/api/terms/{pub.json()['term']['id']}/approve", headers=admin)
    assert selfie.status_code == 403 and selfie.json()["code"] == "SELF_APPROVAL_REJECTED"
    assert client.post(f"/api/projects/{pid}/leakage/residues/publish-term", headers=manager,
                       json={"period_label": "P1"}).status_code == 403
    assert client.post(f"/api/projects/{pid}/leakage/residues", headers=as_role("verifier"),
                       json=_residue(ev)).status_code == 403
    no_ev = client.post(f"/api/projects/{pid}/leakage/residues", headers=manager, json=_residue(ev, evidence_ids=[]))
    assert no_ev.status_code == 422
    rival_org = make_org("Rival Leakage")
    rival = login(client, make_user(rival_org, "mrv_analyst"))
    rival_ev = _evidence(client, rival, "rival.pdf")
    assert client.get(f"/api/projects/{pid}/leakage/residues", headers=rival).status_code == 404
    assert client.post(f"/api/projects/{pid}/leakage/residues", headers=rival,
                       json=_residue(rival_ev)).status_code == 404
    assert client.post(f"/api/projects/{pid}/leakage/displacement/compute", headers=rival, json={
        "period_label": "P1", "period_start": "2021-01-01", "period_end": "2021-12-31"}).status_code == 404
    # another org's evidence can't be attached
    foreign = client.post(f"/api/projects/{pid}/leakage/residues", headers=manager, json=_residue(rival_ev))
    assert foreign.status_code == 422 and foreign.json()["code"] == "INVALID_EVIDENCE"
    rec = client.get(f"/api/projects/{pid}/leakage/residues", headers=manager).json()[0]
    assert client.post(f"/api/leakage/residues/{rec['record_id']}/void", headers=rival,
                       json={"reason": "Not ours"}).status_code == 404
    v = client.post(f"/api/leakage/residues/{rec['record_id']}/void", headers=manager, json={"reason": "Entered twice"})
    assert v.status_code == 201 and v.json()["status"] == "voided"
    assert client.get(f"/api/projects/{pid}/leakage/residues", headers=manager).json() == []
