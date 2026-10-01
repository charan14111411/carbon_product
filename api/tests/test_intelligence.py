import uuid
from datetime import date, timedelta

from app.modules.intelligence import domain
from app.modules.intelligence.models import PracticeDetection
from app.modules.intelligence.providers import FieldRef, SimulatedSentinel
from app.modules.land.models import Field
from app.modules.practices.models import PracticeRecord
from tests import _p345_factories as fx
from tests.conftest import login, make_org, make_user


def _fields(w):
    return [str(x) for x in w["field_ids"]]


# ------------------------------------------------------------------ satellite
def test_simulated_sentinel_is_deterministic_and_flags_clouds():
    f = FieldRef(str(uuid.uuid4()), 12.5, 75.8, "rice")
    a = SimulatedSentinel().indices(f, date(2025, 1, 1), date(2025, 12, 31))
    assert a == SimulatedSentinel().indices(f, date(2025, 1, 1), date(2025, 12, 31))
    ndvi = [o for o in a if o.index_name == "ndvi"]
    assert 70 <= len(ndvi) <= 75 and any(o.cloud_pct > 40 for o in ndvi) and any(o.cloud_pct <= 40 for o in ndvi)
    assert all("(simulated)" in o.source for o in a)
    assert {o.index_name for o in a} == {"ndvi", "ndmi", "ndwi", "lst"}  # LAI is derived by the platform
    coffee = SimulatedSentinel().indices(FieldRef(f.id, 12.5, 75.8, "coffee"), date(2025, 1, 1), date(2025, 12, 31))
    clear = [o.value for o in coffee if o.index_name == "ndvi" and o.cloud_pct <= 40]
    assert min(clear) > 0.45  # perennial canopy never looks like bare soil


def test_satellite_refresh_series_and_cloud_exclusion(client, org, as_role):
    w = fx.world(org)
    h = as_role("mrv_analyst")
    fid = _fields(w)[0]
    r = client.post(f"/api/fields/{fid}/satellite/refresh", headers=h, json={"start": "2025-01-01", "end": "2025-06-30"})
    assert r.status_code == 201, r.text
    assert r.json()["written"]["ndvi"] > 30 and r.json()["cloudy_excluded"] > 0
    again = client.post(f"/api/fields/{fid}/satellite/refresh", headers=h, json={"start": "2025-01-01", "end": "2025-06-30"})
    assert again.json()["written"] == {} and again.json()["skipped_existing"] > 0
    s = client.get(f"/api/fields/{fid}/satellite?index=ndvi", headers=h).json()
    assert s["data_class"] == "OBSERVED" and all(p["cloud_pct"] <= 40 for p in s["points"])
    full = client.get(f"/api/fields/{fid}/satellite?index=ndvi&include_cloudy=true", headers=h).json()
    assert len(full["points"]) == len(s["points"]) + s["cloudy_excluded"]
    assert any(p["excluded"] for p in full["points"])
    assert client.get(f"/api/fields/{fid}/satellite?index=evi", headers=h).status_code == 422
    assert client.post(f"/api/fields/{fid}/satellite/refresh", headers=as_role("verifier"),
                       json={"start": "2025-01-01", "end": "2025-01-10"}).status_code == 403
    other = login(client, make_user(make_org("Rival"), "mrv_analyst"))
    assert client.get(f"/api/fields/{fid}/satellite", headers=other).status_code == 404


def test_ndvi_drop_alerts(client, org, as_role):
    w = fx.world(org)
    a, b = w["field_ids"]
    with fx.session() as s:
        for i in range(8):
            d = date(2025, 5, 1) + timedelta(days=5 * i)
            fx.satellite(s, org, s.get(Field, a), "ndvi", d, 0.70)
            fx.satellite(s, org, s.get(Field, b), "ndvi", d, 0.70)
        fx.satellite(s, org, s.get(Field, a), "ndvi", date(2025, 6, 15), 0.40)  # -43%
        fx.satellite(s, org, s.get(Field, b), "ndvi", date(2025, 6, 15), 0.60)  # -14%
        fx.satellite(s, org, s.get(Field, b), "ndvi", date(2025, 6, 20), 0.05, cloud=90)  # cloudy, ignored
        s.commit()
    r = client.get(f"/api/projects/{w['project_id']}/satellite/alerts", headers=as_role("mrv_analyst")).json()
    assert [x["field_id"] for x in r["alerts"]] == [str(a)]
    assert r["alerts"][0]["drop_pct"] > 40 and r["alerts"][0]["severity"] == "warning"


# ------------------------------------------------------------------ practice detection
def test_heuristics_pass_and_fail():
    d0 = date(2025, 11, 1)
    green = [(d0 + timedelta(days=5 * i), 0.5) for i in range(6)]
    bare = [(d0 + timedelta(days=5 * i), 0.2) for i in range(6)]
    assert domain.check_cover_crop(green, d0, d0 + timedelta(days=40)).detected is True
    assert domain.check_cover_crop(bare, d0, d0 + timedelta(days=40)).detected is False
    assert domain.check_cover_crop(green[:1], d0, d0 + timedelta(days=40)).detected is None
    dip = [(d0, 0.45), (d0 + timedelta(days=5), 0.1), (d0 + timedelta(days=10), 0.2)]
    assert domain.check_no_tillage(dip, d0, d0 + timedelta(days=20)).detected is False
    flat = [(d0, 0.3), (d0 + timedelta(days=5), 0.25), (d0 + timedelta(days=10), 0.28)]
    assert domain.check_no_tillage(flat, d0, d0 + timedelta(days=20)).detected is True
    osc = [(d0 + timedelta(days=5 * i), 0.3 if i % 2 else 0.05) for i in range(8)]
    steady = [(d0 + timedelta(days=5 * i), 0.3) for i in range(8)]
    assert domain.check_awd(osc, d0, d0 + timedelta(days=60)).detected is True
    assert domain.check_awd(steady, d0, d0 + timedelta(days=60)).detected is False
    assert domain.check_residue(flat, [], d0, d0 + timedelta(days=20)).detected is True
    assert domain.check_residue(dip, [], d0, d0 + timedelta(days=20)).detected is False


def test_practice_detection_run(client, org, as_role):
    w = fx.world(org, n_farmers=5)
    f = w["field_ids"]
    d0 = date(2025, 11, 1)
    with fx.session() as s:
        F = [s.get(Field, x) for x in f]
        # 0: reported cover crop, green -> confirmed
        fx.practice(s, org, F[0], "cover_crop", d0, ended_on=d0 + timedelta(days=45))
        # 1: reported cover crop, bare -> mismatch
        fx.practice(s, org, F[1], "cover_crop", d0, ended_on=d0 + timedelta(days=45))
        # 2: reported zero tillage, sharp dip -> mismatch
        fx.practice(s, org, F[2], "zero_tillage", d0 + timedelta(days=10))
        # 3: residue retention without clear imagery -> inconclusive
        fx.practice(s, org, F[3], "residue_retention", d0)
        # 4: voided record is ignored; green fallow -> unreported cover crop
        v1 = fx.practice(s, org, F[4], "cover_crop", d0)
        s.add(PracticeRecord(org_id=org, record_id=v1.record_id, version=2, field_id=F[4].id,
                             practice_code="cover_crop", scenario="project", performed_on=d0, status="voided"))
        for i in range(9):
            day = d0 + timedelta(days=5 * i)
            fx.satellite(s, org, F[0], "ndvi", day, 0.55)
            fx.satellite(s, org, F[1], "ndvi", day, 0.2)
            fx.satellite(s, org, F[2], "ndvi", day, 0.1 if i == 3 else 0.3)
            fx.satellite(s, org, F[3], "ndvi", day, 0.3, cloud=80)
            fx.satellite(s, org, F[4], "ndvi", day, 0.6)
        s.commit()
    h = as_role("mrv_analyst")
    r = client.post(f"/api/projects/{w['project_id']}/practice-detection/run", headers=h, json={
        "season_start": "2025-10-01", "season_end": "2026-01-31", "fallow_start": "2025-11-01",
        "fallow_end": "2025-12-15"})
    assert r.status_code == 201, r.text
    body = r.json()
    by_field = {(x["field_id"], x["practice_code"]): x for x in body["items"]}
    assert by_field[(str(f[0]), "cover_crop")]["outcome"] == "confirmed"
    assert by_field[(str(f[1]), "cover_crop")]["outcome"] == "mismatch"
    assert by_field[(str(f[2]), "zero_tillage")]["outcome"] == "mismatch"
    assert by_field[(str(f[2]), "zero_tillage")]["evidence"]["bare_soil_dips"]
    assert by_field[(str(f[3]), "residue_retention")]["outcome"] == "inconclusive"
    unrep = by_field[(str(f[4]), "cover_crop")]
    assert unrep["practice_record_id"] is None and unrep["detected"] and unrep["evidence"]["unreported"]
    assert body["unreported"] == 1
    assert (str(f[1]), "cover_crop") in by_field and not any(
        x["field_id"] == str(f[0]) and x["practice_record_id"] is None for x in body["items"])
    latest = client.get(f"/api/projects/{w['project_id']}/practice-detection", headers=h).json()
    assert len(latest) == 5
    client.post(f"/api/projects/{w['project_id']}/practice-detection/run", headers=h,
                json={"season_start": "2025-10-01", "season_end": "2026-01-31"})
    assert len(client.get(f"/api/fields/{f[0]}/practice-detection", headers=h).json()) == 2
    assert len(client.get(f"/api/projects/{w['project_id']}/practice-detection", headers=h).json()) == 5
    with fx.session() as s:  # the practice records themselves are never touched
        assert s.query(PracticeRecord).count() == 6
        assert s.query(PracticeDetection).count() == 9
    bad = client.post(f"/api/projects/{w['project_id']}/practice-detection/run", headers=h,
                      json={"season_start": "2025-10-01", "season_end": "2026-01-31", "fallow_start": "2025-11-01"})
    assert bad.status_code == 422


# ------------------------------------------------------------------ SOC model
def _training_world(org, n_farms=4, per_farm=4, elevations=(500, 600, 750, 900)):
    with fx.session() as s:
        prog = fx.programme(s, org)
        proj = fx.project(s, org, prog)
        camp = fx.campaign(s, org, proj)
        lab = fx.lab(s, org)
        fields = []
        for i in range(n_farms):
            fr = fx.farmer(s, org)
            fm = fx.farm(s, org, fr)
            fl = fx.field(s, org, fm, 12.5 + 0.02 * i, 75.8, elevation_m=elevations[i % len(elevations)])
            fx.enrol(s, org, proj, fl)
            fields.append(fl)
        st = fx.stratum(s, org, proj, [x.id for x in fields], code="Z1")
        for i, fl in enumerate(fields):
            for j in range(per_farm):
                clay = 15 + 10 * j + i
                soc = 0.3 + 0.02 * clay + 0.001 * fl.elevation_m + (0.03 if (i + j) % 2 else -0.03)
                fx.soc_sample(s, org, proj=proj, fld=fl, camp=camp, strat=st, lab_row=lab, soc=soc, clay=clay)
        s.commit()
        return {"project_id": str(proj.id), "field_ids": [str(x.id) for x in fields], "stratum": "Z1",
                "programme_id": prog.id}


def test_train_requires_enough_data(client, org, as_role):
    w = _training_world(org, n_farms=2, per_farm=8)
    h = as_role("methodology_owner")
    r = client.post("/api/models/soc/train", headers=h, json={"name": "soc", "features": ["elevation_m", "clay_pct"],
                                                              "project_id": w["project_id"]})
    assert r.status_code == 422 and r.json()["code"] == "NOT_ENOUGH_DATA"
    assert r.json()["details"]["farms"] == 2 and "farms" in r.json()["message"]
    bad = client.post("/api/models/soc/train", headers=h, json={"name": "soc", "features": ["magic"]})
    assert bad.status_code == 422 and bad.json()["code"] == "UNKNOWN_FEATURE"
    assert client.post("/api/models/soc/train", headers=as_role("mrv_analyst"),
                       json={"name": "soc", "features": ["clay_pct"]}).status_code == 403


def test_train_validate_approve_four_eyes(client, org, as_role):
    w = _training_world(org)
    author = as_role("methodology_owner")
    r = client.post("/api/models/soc/train", headers=author, json={
        "name": "soc-hassan", "features": ["elevation_m", "clay_pct", "practice_count"], "project_id": w["project_id"]})
    assert r.status_code == 201, r.text
    m = r.json()
    assert m["status"] == "candidate" and m["version"] == "1" and m["validation"] == "grouped_kfold_by_farm"
    assert m["metrics"]["k"] == 4 and m["training_summary"]["rows"] == 16 and m["training_summary"]["farms"] == 4
    assert m["metrics"]["r2"] > 0.5 and m["metrics"]["rmse"] < 0.2
    assert 0 <= m["metrics"]["coverage_90"] <= 1
    assert set(m["params"]["coefficients"]) == {"elevation_m", "clay_pct", "practice_count"}
    assert m["params"]["coefficients"]["clay_pct"] > 0 and m["training_summary"]["clay_sources"] == {"lab": 16}
    # every fold holds out whole farms
    held = [farm for fold in m["metrics"]["folds"] for farm in fold["farms"]]
    assert len(held) == len(set(held)) == 4

    self_ok = client.post(f"/api/models/{m['id']}/approve", headers=author)
    assert self_ok.status_code == 403 and self_ok.json()["code"] == "SELF_APPROVAL_REJECTED"
    assert client.post(f"/api/models/{m['id']}/approve", headers=as_role("mrv_analyst")).status_code == 403
    reviewer = as_role("methodology_owner", fresh=True)
    ok = client.post(f"/api/models/{m['id']}/approve", headers=reviewer)
    assert ok.status_code == 200 and ok.json()["status"] == "approved"
    assert client.post(f"/api/models/{m['id']}/approve", headers=reviewer).status_code == 409

    m2 = client.post("/api/models/soc/train", headers=author, json={
        "name": "soc-hassan", "features": ["elevation_m", "clay_pct"], "project_id": w["project_id"]}).json()
    assert m2["version"] == "2"
    client.post(f"/api/models/{m2['id']}/approve", headers=reviewer)
    statuses = {x["version"]: x["status"] for x in client.get("/api/models?name=soc-hassan", headers=author).json()}
    assert statuses == {"1": "retired", "2": "approved"}
    other = login(client, make_user(make_org("Rival"), "methodology_owner"))
    assert client.get(f"/api/models/{m['id']}", headers=other).status_code == 404
    audit = {a["action"] for a in client.get("/api/audit", headers=as_role("programme_admin")).json()}
    assert {"model.train", "model.approve", "model.retire"} <= audit


def _approved_model(client, as_role, w, features):
    m = client.post("/api/models/soc/train", headers=as_role("methodology_owner"), json={
        "name": "map-model", "features": features, "project_id": w["project_id"]}).json()
    client.post(f"/api/models/{m['id']}/approve", headers=as_role("methodology_owner", fresh=True))
    return m


def test_soc_map_and_sampling_optimiser(client, org, as_role):
    w = _training_world(org)
    h = as_role("methodology_owner")
    cand = client.post("/api/models/soc/train", headers=h, json={
        "name": "draft", "features": ["elevation_m"], "project_id": w["project_id"]}).json()
    blocked = client.post(f"/api/projects/{w['project_id']}/soc-map", headers=h, json={"model_id": cand["id"]})
    assert blocked.status_code == 409 and blocked.json()["code"] == "MODEL_NOT_APPROVED"
    assert client.get(f"/api/projects/{w['project_id']}/sampling-optimiser?budget=2",
                      headers=as_role("programme_admin")).json()["code"] == "NO_SOC_MAP"

    m = _approved_model(client, as_role, w, ["elevation_m", "practice_count"])
    # a new field far outside the training elevations
    with fx.session() as s:
        fr = fx.farmer(s, org)
        fl = fx.field(s, org, fx.farm(s, org, fr), 12.7, 75.9, elevation_m=1500)
        from app.modules.programmes.models import Project
        fx.enrol(s, org, s.get(Project, uuid.UUID(w["project_id"])), fl)
        s.commit()
        outside = str(fl.id)
    r = client.post(f"/api/projects/{w['project_id']}/soc-map", headers=h, json={"model_id": m["id"], "top_n": 2})
    assert r.status_code == 201, r.text
    sm = r.json()
    assert sm["data_class"] == "MODELLED" and sm["summary"]["fields"] == 5 and sm["summary"]["out_of_domain"] == 1
    cells = {c["field_id"]: c for c in sm["cells"]}
    top = sm["cells"][0]
    assert top["field_id"] == outside and not top["in_domain"] and top["sample_next"]
    assert top["out_of_domain_features"] == ["elevation_m"] and top["priority"] > 1.0
    assert sum(c["sample_next"] for c in sm["cells"]) == 2
    inside = cells[w["field_ids"][1]]
    assert inside["in_domain"] and inside["lower"] < inside["predicted_soc_pct"] < inside["upper"]
    assert all(c["data_class"] == "MODELLED" for c in sm["cells"])
    latest = client.get(f"/api/projects/{w['project_id']}/soc-maps/latest", headers=h).json()
    assert latest["id"] == sm["id"]

    opt = client.get(f"/api/projects/{w['project_id']}/sampling-optimiser?budget=3",
                     headers=as_role("programme_admin")).json()
    assert len(opt["recommendations"]) == 3
    first = opt["recommendations"][0]
    assert first["field_id"] == outside and first["suggested_samples"] == 2  # out of domain / tier-3 -> +1
    assert any("training data" in x or "external" in x for x in first["reasons"])
    assert opt["total_suggested_samples"] == sum(x["suggested_samples"] for x in opt["recommendations"])
    assert {p["stratum"] for p in opt["per_stratum"]} <= {"Z1", "unstratified"}
    assert client.get(f"/api/projects/{w['project_id']}/sampling-optimiser?budget=0",
                      headers=as_role("programme_admin")).status_code == 422


# ------------------------------------------------------------------ other gases
def test_emissions_estimate_fails_closed_then_works(client, org, as_role):
    h = as_role("programme_admin")
    w = fx.world(org, rule_values={"buffer_pct": 10})
    url = f"/api/projects/{w['project_id']}/emissions-estimate?start=2025-01-01&end=2025-12-31"
    no_type = client.get(url, headers=h)
    assert no_type.status_code == 409 and no_type.json()["code"] == "RULE_MISSING"
    with fx.session() as s:
        fx.practice_type(s, org, "synthetic_fertiliser", ["synthetic_n_kg"])
        fl = s.get(Field, w["field_ids"][0])
        fx.practice(s, org, fl, "synthetic_fertiliser", date(2025, 7, 1), quantity=200, details={"n_kg": 92})
        fx.practice(s, org, fl, "synthetic_fertiliser", date(2025, 8, 1), quantity=100, details={"n_pct": 46})
        fx.practice(s, org, fl, "synthetic_fertiliser", date(2025, 9, 1), quantity=50)  # no N content
        s.commit()
    missing = client.get(url, headers=h)
    assert missing.status_code == 409 and missing.json()["details"]["factor_keys"] == ["synthetic_n_kg"]
    w2 = fx.world(org, rule_values={"emission_factors": {"synthetic_n_kg": 0.005}})
    with fx.session() as s:
        fx.practice(s, org, s.get(Field, w2["field_ids"][0]), "synthetic_fertiliser", date(2025, 7, 1),
                    details={"n_kg": 100})
        s.commit()
    ok = client.get(f"/api/projects/{w2['project_id']}/emissions-estimate?start=2025-01-01&end=2025-12-31", headers=h)
    assert ok.status_code == 200, ok.text
    assert ok.json()["by_scenario"]["project"]["t_co2e"] == 0.5 and ok.json()["data_class"] == "MODELLED"
    unapproved = fx.world(org)
    with fx.session() as s:
        from app.modules.programmes.models import Project
        p = s.get(Project, unapproved["project_id"])
        p.rule_pack_id = fx.rule_pack(s, org, {"emission_factors": {"synthetic_n_kg": 1}}, status="draft").id
        s.commit()
    r = client.get(f"/api/projects/{unapproved['project_id']}/emissions-estimate?start=2025-01-01&end=2025-12-31",
                   headers=h)
    assert r.status_code == 409 and r.json()["code"] == "RULE_MISSING"


def test_emissions_estimate_counts_n_from_percentage(client, org, as_role):
    w = fx.world(org, rule_values={"emission_factors": {"synthetic_n_kg": {"value": 0.01, "unit": "tCO2e/kg N"}}})
    with fx.session() as s:
        fx.practice_type(s, org, "synthetic_fertiliser", ["synthetic_n_kg"])
        fl = s.get(Field, w["field_ids"][0])
        fx.practice(s, org, fl, "synthetic_fertiliser", date(2025, 8, 1), quantity=100, details={"n_pct": 46})
        fx.practice(s, org, fl, "synthetic_fertiliser", date(2025, 9, 1), quantity=50)
        s.commit()
    r = client.get(f"/api/projects/{w['project_id']}/emissions-estimate?start=2025-01-01&end=2025-12-31",
                   headers=as_role("programme_admin")).json()
    assert r["by_scenario"]["project"]["n_kg"] == 46.0 and len(r["records_missing_n"]) == 1
    assert abs(r["by_scenario"]["project"]["t_co2e"] - 0.46) < 1e-9


# ================================================================== LAI / NDWI
from app.modules.intelligence import features as fstore  # noqa: E402
from app.modules.intelligence.domain import INFORMING_WALL_REASON  # noqa: E402
from app.modules.intelligence.models import DriftReport, FieldFeature, ModelVersion  # noqa: E402
from app.modules.intelligence.providers import lai_from_ndvi  # noqa: E402


def test_lai_relation_and_ndwi_behaviour():
    import math
    assert lai_from_ndvi(0.5) == round(0.57 * math.exp(2.33 * 0.5), 4)
    assert lai_from_ndvi(-0.1) == 0.0 and lai_from_ndvi(0.0) == 0.0
    assert lai_from_ndvi(0.2) < lai_from_ndvi(0.6) <= 8.0
    coffee = SimulatedSentinel().indices(FieldRef(str(uuid.uuid4()), 12.5, 75.8, "coffee"),
                                         date(2025, 1, 1), date(2025, 12, 31))
    ndwi = [o.value for o in coffee if o.index_name == "ndwi" and o.cloud_pct <= 40]
    assert ndwi and all(-1 <= v <= 1 for v in ndwi) and sum(ndwi) / len(ndwi) < 0  # dense canopy: negative NDWI


def test_satellite_refresh_adds_derived_lai_and_ndwi(client, org, as_role):
    w = fx.world(org)
    h = as_role("mrv_analyst")
    fid = _fields(w)[0]
    r = client.post(f"/api/fields/{fid}/satellite/refresh", headers=h, json={"start": "2025-01-01", "end": "2025-03-31"})
    written = r.json()["written"]
    assert written["lai"] == written["ndvi"] == written["ndwi"] > 10
    ndvi = client.get(f"/api/fields/{fid}/satellite?index=ndvi&include_cloudy=true", headers=h).json()
    lai = client.get(f"/api/fields/{fid}/satellite?index=lai&include_cloudy=true", headers=h).json()
    assert lai["data_class"] == "DERIVED" and "exp" in lai["method"] and ndvi["data_class"] == "OBSERVED"
    by_day = {p["date"]: p["value"] for p in ndvi["points"]}
    assert all(p["value"] == lai_from_ndvi(by_day[p["date"]]) for p in lai["points"])
    nd = client.get(f"/api/fields/{fid}/satellite?index=ndwi", headers=h).json()
    assert nd["data_class"] == "OBSERVED" and nd["points"] and nd["credit_eligible"] is False
    assert nd["credit_eligible_reason"] == INFORMING_WALL_REASON
    alerts = client.get(f"/api/projects/{w['project_id']}/satellite/alerts", headers=h).json()
    assert alerts["credit_eligible"] is False


# ================================================================== feature store
def test_feature_set_definition_validation_and_versions(client, org, as_role):
    h = as_role("methodology_owner")
    good = {"features": [{"feature": "sm20_mean", "window_days": 30}, {"feature": "rain_total", "window_days": 90},
                         {"feature": "elevation_m"}, "slope_pct",
                         {"feature": "wetness_days", "window_days": 30, "wet_threshold_pct": 28}]}
    r = client.post("/api/feature-sets", headers=h, json={"name": "soil-core", "definition": good})
    assert r.status_code == 201, r.text
    fs = r.json()
    assert fs["version"] == 1 and fs["status"] == "active"
    assert fs["columns"] == ["sm20_mean_30d", "rain_total_90d", "elevation_m", "slope_pct", "wetness_days_30d"]
    assert len(fs["definition_sha256"]) == 64
    v2 = client.post("/api/feature-sets", headers=h, json={"name": "soil-core", "definition": {"features": ["slope_pct"]}})
    assert v2.json()["version"] == 2
    bad_defs = [
        {"features": []},
        {"features": [{"feature": "magic"}]},
        {"features": [{"feature": "sm20_mean"}]},  # window required
        {"features": [{"feature": "slope_pct", "window_days": 30}]},  # static takes no window
        {"features": [{"feature": "rain_total", "window_days": 0}]},
        {"features": [{"feature": "rain_total", "window_days": 30}, {"feature": "rain_total", "window_days": 30}]},
        {"features": [{"feature": "rain_total", "window_days": 30, "wet_threshold_pct": 20}]},
    ]
    for d in bad_defs:
        b = client.post("/api/feature-sets", headers=h, json={"name": "bad", "definition": d})
        assert b.status_code == 422 and b.json()["code"] == "INVALID_FEATURE_SET", d
    assert client.post("/api/feature-sets", headers=as_role("mrv_analyst"),
                       json={"name": "x", "definition": good}).status_code == 403
    cat = client.get("/api/feature-sets/catalogue", headers=h).json()
    assert {c["feature"] for c in cat} >= {"dry_down_rate", "vpd_mean", "lai_mean", "ndwi_mean", "slope_pct"}
    assert {x["version"] for x in client.get("/api/feature-sets?name=soil-core", headers=h).json()} == {1, 2}
    ret = client.post(f"/api/feature-sets/{fs['id']}/retire", headers=h)
    assert ret.json()["status"] == "retired"
    assert client.post(f"/api/feature-sets/{fs['id']}/retire", headers=h).status_code == 409
    other = login(client, make_user(make_org("Rival"), "methodology_owner"))
    assert client.get(f"/api/feature-sets/{fs['id']}", headers=other).status_code == 404


def test_feature_store_is_point_in_time(client, org, as_role):
    w = fx.world(org, n_farmers=1)
    fid = w["field_ids"][0]
    as_of = date(2025, 6, 30)
    with fx.session() as s:
        f = s.get(Field, fid)
        f.slope_pct, f.aspect_deg = 6.0, 90.0
        fx.daily_observations(s, org, f, "soil_moisture_20cm_pct", date(2025, 6, 1), [20.0] * 30)  # ≤ as_of
        fx.daily_observations(s, org, f, "rain_mm", date(2025, 6, 1), [2.0] * 30, provider="microclime")
        fx.daily_observations(s, org, f, "soil_moisture_20cm_pct", date(2025, 7, 1), [45.0] * 10)  # after
        fx.daily_observations(s, org, f, "rain_mm", date(2025, 7, 1), [80.0] * 10, provider="microclime")
        for i in range(6):
            fx.satellite(s, org, f, "ndvi", date(2025, 6, 1) + timedelta(days=5 * i), 0.4)
        fx.satellite(s, org, f, "ndvi", date(2025, 7, 5), 0.9)  # after as_of
        fx.practice(s, org, f, "cover_crop", date(2025, 5, 1))
        fx.practice(s, org, f, "mulching", date(2025, 7, 10))  # after as_of
        s.commit()
    h = as_role("methodology_owner")
    fs = client.post("/api/feature-sets", headers=h, json={"name": "pit", "definition": {"features": [
        {"feature": "sm20_mean", "window_days": 30}, {"feature": "rain_total", "window_days": 30},
        {"feature": "ndvi_mean", "window_days": 60}, {"feature": "practice_count"},
        {"feature": "aspect_eastness"}, {"feature": "slope_pct"}]}}).json()
    body = {"project_id": str(w["project_id"]), "as_of_date": as_of.isoformat()}
    m = client.post(f"/api/feature-sets/{fs['id']}/materialize", headers=h, json=body)
    assert m.status_code == 201, m.text
    item = m.json()["items"][0]
    assert item["status"] == "new" and item["credit_eligible"] is False
    v = item["values"]
    assert v == {"sm20_mean_30d": 20.0, "rain_total_30d": 60.0, "ndvi_mean_60d": 0.4, "practice_count": 1.0,
                 "aspect_eastness": 1.0, "slope_pct": 6.0}
    assert item["data_classes"]["sm20_mean_30d"] == "DERIVED" and item["data_classes"]["ndvi_mean_60d"] == "OBSERVED"
    assert item["data_classes"]["practice_count"] == "RECORDED"
    assert item["details"]["sm20_mean_30d"]["source_tiers"] == [1]
    fp = item["input_fingerprint"]
    # more data *after* as_of changes nothing: same fingerprint, no new row
    with fx.session() as s:
        f = s.get(Field, fid)
        fx.observation(s, org, f, "soil_moisture_20cm_pct", date(2025, 8, 1), 50.0)
        fx.satellite(s, org, f, "ndvi", date(2025, 8, 1), 0.95)
        s.commit()
    again = client.post(f"/api/feature-sets/{fs['id']}/materialize", headers=h, json=body).json()
    assert again["written"] == 0 and again["unchanged"] == 1 and again["items"][0]["input_fingerprint"] == fp
    # a late-arriving observation *before* as_of is a new, appended row (the old one is kept)
    with fx.session() as s:
        fx.observation(s, org, s.get(Field, fid), "soil_moisture_20cm_pct", date(2025, 5, 31), 99.0)  # outside 30d
        fx.observation(s, org, s.get(Field, fid), "rain_mm", date(2025, 6, 15), 10.0, provider="imd", tier=3,
                       quality=0.5, data_class="OBSERVED")  # worse than the device reading: not used
        fx.satellite(s, org, s.get(Field, fid), "ndvi", date(2025, 6, 29), 0.1)
        s.commit()
    third = client.post(f"/api/feature-sets/{fs['id']}/materialize", headers=h, json=body).json()
    assert third["written"] == 1 and third["items"][0]["status"] == "recomputed"
    v3 = third["items"][0]["values"]
    assert v3["sm20_mean_30d"] == 20.0 and v3["rain_total_30d"] == 60.0
    assert abs(v3["ndvi_mean_60d"] - round((0.4 * 6 + 0.1) / 7, 5)) < 1e-9
    with fx.session() as s:
        assert s.query(FieldFeature).count() == 2
    got = client.get(f"/api/fields/{fid}/features?feature_set=pit&as_of=2025-07-15", headers=h).json()
    assert got["as_of_date"] == "2025-06-30" and got["values"] == v3 and got["feature_set"] == "pit v1"
    assert "on or before 2025-06-30" in got["point_in_time"]
    early = client.get(f"/api/fields/{fid}/features?feature_set={fs['id']}&as_of=2025-06-01", headers=h)
    assert early.status_code == 404
    # materialising as of a later date sees the later data
    later = client.post(f"/api/feature-sets/{fs['id']}/materialize", headers=h,
                        json={**body, "as_of_date": "2025-07-10"}).json()["items"][0]["values"]
    assert later["sm20_mean_30d"] > 20 and later["practice_count"] == 2.0
    fut = client.post(f"/api/feature-sets/{fs['id']}/materialize", headers=h,
                      json={**body, "as_of_date": (date.today() + timedelta(days=2)).isoformat()})
    assert fut.status_code == 422 and fut.json()["code"] == "FUTURE_AS_OF"
    assert client.post(f"/api/feature-sets/{fs['id']}/materialize", headers=as_role("verifier"),
                       json=body).status_code == 403


def test_compute_vector_ignores_future_data_directly(client, org):
    w = fx.world(org, n_farmers=1)
    specs = fstore.parse_definition({"features": [{"feature": "vpd_mean", "window_days": 10},
                                                  {"feature": "gdd_base10", "window_days": 10}]})
    with fx.session() as s:
        f = s.get(Field, w["field_ids"][0])
        fx.daily_observations(s, org, f, "air_temp_c", date(2025, 3, 1), [20.0] * 10, provider="microclime")
        fx.daily_observations(s, org, f, "rel_humidity_pct", date(2025, 3, 1), [50.0] * 10, provider="microclime")
        s.commit()
        a = fstore.compute_vector(s, f, date(2025, 3, 10), specs)
        fx.daily_observations(s, org, f, "air_temp_c", date(2025, 3, 11), [40.0] * 5, provider="microclime")
        s.commit()
        b = fstore.compute_vector(s, f, date(2025, 3, 10), specs)
        c = fstore.compute_vector(s, f, date(2025, 3, 12), specs)
    from app.modules.supporting.derived import vpd_kpa
    assert a.values == b.values and a.fingerprint == b.fingerprint
    assert a.values["gdd_base10_10d"] == 100.0 and abs(a.values["vpd_mean_10d"] - round(vpd_kpa(20, 50), 4)) < 1e-9
    assert c.fingerprint != a.fingerprint and c.values["gdd_base10_10d"] > 100


# ================================================================== training with a feature set
def test_train_with_feature_set_and_map(client, org, as_role):
    w = _training_world(org)
    h = as_role("methodology_owner")
    fs = client.post("/api/feature-sets", headers=h, json={"name": "static", "definition": {"features": [
        "elevation_m", "practice_count"]}}).json()
    r = client.post("/api/models/soc/train", headers=h, json={"name": "fs-model", "feature_set_id": fs["id"],
                                                              "project_id": w["project_id"]})
    assert r.status_code == 201, r.text
    m = r.json()
    assert m["features"] == ["elevation_m", "practice_count"] and m["feature_set_id"] == fs["id"]
    assert m["params"]["feature_set_version"] == 1 and m["training_summary"]["feature_set"]["name"] == "static"
    assert len(m["training_summary"]["feature_fingerprints"]) == m["training_summary"]["rows"] == 16
    assert m["credit_eligible"] is False and "VT0014" in m["credit_eligible_reason"]
    # built-in features still work (backward compatible) and both-at-once is refused
    legacy = client.post("/api/models/soc/train", headers=h, json={"name": "legacy", "features": ["elevation_m"],
                                                                   "project_id": w["project_id"]})
    assert legacy.status_code == 201 and legacy.json()["feature_set_id"] is None
    both = client.post("/api/models/soc/train", headers=h, json={"name": "xx", "features": ["clay_pct"],
                                                                 "feature_set_id": fs["id"]})
    assert both.status_code == 422 and both.json()["code"] == "FEATURES_AND_FEATURE_SET", both.text
    assert client.post("/api/models/soc/train", headers=h, json={"name": "xx"}).status_code == 422
    client.post(f"/api/models/{m['id']}/approve", headers=as_role("methodology_owner", fresh=True))
    sm = client.post(f"/api/projects/{w['project_id']}/soc-map", headers=h, json={"model_id": m["id"]})
    assert sm.status_code == 201, sm.text
    cell = sm.json()["cells"][0]
    assert cell["predicted_soc_pct"] is not None and cell["feature_sources"]["feature_set"] == "static v1"
    assert cell["credit_eligible"] is False and sm.json()["credit_eligible"] is False
    client.post(f"/api/feature-sets/{fs['id']}/retire", headers=h)
    retired = client.post("/api/models/soc/train", headers=h, json={"name": "fs-model", "feature_set_id": fs["id"]})
    assert retired.status_code == 409 and retired.json()["code"] == "FEATURE_SET_RETIRED"


# ================================================================== drift
def _add_samples(org, w, offset: float, per_field: int = 2):
    from app.modules.programmes.models import Project
    from app.modules.sampling.models import Stratum
    with fx.session() as s:
        proj = s.get(Project, uuid.UUID(w["project_id"]))
        camp = fx.campaign(s, org, proj, "monitoring")
        lab = fx.lab(s, org)
        st = s.query(Stratum).filter_by(project_id=proj.id).first()
        for i, fid in enumerate(w["field_ids"]):
            fl = s.get(Field, uuid.UUID(fid))
            for j in range(per_field):
                clay = 20 + 10 * j + i
                soc = 0.3 + 0.02 * clay + 0.001 * fl.elevation_m + offset
                fx.soc_sample(s, org, proj=proj, fld=fl, camp=camp, strat=st, lab_row=lab, soc=soc, clay=clay)
        s.commit()


def test_drift_check_ok_then_drift_flags_review(client, org, as_role):
    w = _training_world(org)
    h = as_role("methodology_owner")
    m = _approved_model(client, as_role, w, ["elevation_m", "clay_pct"])
    first = client.post(f"/api/models/{m['id']}/drift-check", headers=h)
    assert first.status_code == 201, first.text
    assert first.json()["status"] == "insufficient" and first.json()["n_new"] == 0
    _add_samples(org, w, offset=0.0)
    ok = client.post(f"/api/models/{m['id']}/drift-check", headers=h).json()
    assert ok["n_new"] == 8 and ok["status"] in ("ok", "warning"), ok
    assert ok["action"] == "none" and ok["baseline"]["validation_rmse"] == m["metrics"]["rmse"]
    assert ok["metrics"]["coverage"] >= 0.8 and ok["credit_eligible"] is False
    assert all(not r["sample_code"] in m["training_summary"]["samples"] for r in ok["rows"])
    _add_samples(org, w, offset=0.6)
    bad = client.post(f"/api/models/{m['id']}/drift-check", headers=h).json()
    assert bad["status"] == "drift" and bad["action"] == "review_required" and bad["n_new"] == 16
    assert any("residual SD" in x for x in bad["reasons"]) and bad["metrics"]["bias"] < 0  # model under-predicts
    got = client.get(f"/api/models/{m['id']}", headers=h).json()
    assert got["status"] == "approved" and got["review_required"] is True and "Review required" in got["notes"]
    assert [x["status"] for x in client.get(f"/api/models/{m['id']}/drift", headers=h).json()] == [
        "drift", ok["status"], "insufficient"]
    # thresholds can be set by governance per check (stored with the report)
    lax = client.post(f"/api/models/{m['id']}/drift-check", headers=h, json={
        "bias_sd": 1000, "coverage_min": 0.01, "rmse_ratio": 1000, "warn_bias_sd": 1000, "warn_coverage_min": 0.01,
        "warn_rmse_ratio": 1000}).json()
    assert lax["status"] == "ok" and lax["thresholds"]["bias_sd"] == 1000, lax["reasons"]
    assert client.get(f"/api/models/{m['id']}", headers=h).json()["review_required"] is True  # sticky
    # h trained the model: no self-review
    selfr = client.post(f"/api/models/{m['id']}/drift-review", headers=h, json={"decision": "keep", "note": "fine"})
    assert selfr.status_code == 403
    # whoever ran the check that flagged the drift can't resolve it either
    checker = as_role("methodology_owner", fresh=True)
    assert client.post(f"/api/models/{m['id']}/drift-check", headers=checker).json()["action"] == "review_required"
    assert client.post(f"/api/models/{m['id']}/drift-review", headers=checker,
                       json={"decision": "keep", "note": "mine"}).status_code == 403
    reviewer = as_role("methodology_owner", fresh=True)
    kept = client.post(f"/api/models/{m['id']}/drift-review", headers=reviewer,
                       json={"decision": "keep", "note": "offset explained by new lab method; recalibrating"})
    assert kept.status_code == 200 and kept.json()["review_required"] is False and kept.json()["status"] == "approved"
    assert client.post(f"/api/models/{m['id']}/drift-review", headers=reviewer,
                       json={"decision": "keep", "note": "again"}).status_code == 409
    with fx.session() as s:
        assert s.query(DriftReport).count() == 5
        assert s.get(ModelVersion, uuid.UUID(m["id"])).status == "approved"  # never auto-retired
    assert client.post(f"/api/models/{m['id']}/drift-check", headers=as_role("mrv_analyst")).status_code == 403
    audit = {a["action"] for a in client.get("/api/audit", headers=as_role("programme_admin")).json()}
    assert {"model.drift_check", "model.review_required"} <= audit


def test_drift_on_candidate_is_reported_without_action(client, org, as_role):
    w = _training_world(org)
    h = as_role("methodology_owner")
    m = client.post("/api/models/soc/train", headers=h, json={"name": "cand", "features": ["elevation_m", "clay_pct"],
                                                              "project_id": w["project_id"]}).json()
    _add_samples(org, w, offset=0.8)
    rep = client.post(f"/api/models/{m['id']}/drift-check", headers=h).json()
    assert rep["status"] == "drift" and rep["action"] == "none"


def test_every_intelligence_output_carries_the_informing_wall(client, org, as_role):
    w = _training_world(org)
    m = _approved_model(client, as_role, w, ["elevation_m"])
    h = as_role("methodology_owner")
    outs = [client.get(f"/api/models/{m['id']}", headers=h).json(),
            *client.get("/api/models", headers=h).json(),
            client.post(f"/api/projects/{w['project_id']}/soc-map", headers=h, json={"model_id": m["id"]}).json(),
            client.get(f"/api/projects/{w['project_id']}/sampling-optimiser?budget=2", headers=h).json()]
    for o in outs:
        assert o["credit_eligible"] is False and o["credit_eligible_reason"] == INFORMING_WALL_REASON
        assert o["data_class"] in ("MODELLED", "OBSERVED", "DERIVED")
