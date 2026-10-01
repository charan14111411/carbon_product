"""Baseline activity data (VM0042 v2.2 §6, Table 4, Box 1), attestations, schedule and practice change."""

from datetime import date

import pytest

from app.core import db as dbmod
from app.core.errors import ImmutableRecord
from app.modules.baseline import domain
from app.modules.baseline.models import ActivityRecord
from tests.conftest import login, make_org, make_user
from tests.test_land import east, farm_for, mk_field, ready_field

START = 2025  # crediting start year of the test project


def mk_project(client, h, code="BL-1", baseline_start="2024-06-01", start="2025-01-01", end="2034-12-31"):
    prog = client.post("/api/programmes", headers=h, json={"code": f"PG-{code}", "name": "Programme"})
    assert prog.status_code == 201, prog.text
    body = {"programme_id": prog.json()["id"], "code": code, "name": "Project", "baseline_start": baseline_start,
            "crediting_start": start, "crediting_end": end}
    r = client.post("/api/projects", headers=h, json=body)
    assert r.status_code == 201, r.text
    return r.json()


def evidence(client, h, kind="document", name="log.pdf"):
    r = client.post("/api/evidence", headers=h, files={"file": (name, b"%PDF-1.4 " + name.encode(), "application/pdf")},
                    data={"kind": kind})
    assert r.status_code == 201, r.text
    return r.json()["id"]


def rec(client, h, pid, fid, year, category, attributes, tier=1, evidence_ids=None, expect=201, **kw):
    body = {"project_id": pid, "field_id": fid, "scenario": kw.pop("scenario", "baseline"), "year": year,
            "category": category, "attributes": attributes, "data_tier": tier,
            "evidence_ids": evidence_ids if evidence_ids is not None else [], **kw}
    r = client.post("/api/activity-records", headers=h, json=body)
    assert r.status_code == expect, r.text
    return r.json()


CROP = {"crop_type": "maize", "planting_date": "2022-06-15", "harvest_date": "2022-10-20", "yield_t_ha": 4.2}


def crop(name="maize", year=2022):
    return {**CROP, "crop_type": name, "planting_date": f"{year}-06-15", "harvest_date": f"{year}-10-20"}


def fert(rate=100.0):
    return {"manure": False, "compost": False, "synthetic_n": rate > 0,
            **({"synthetic_n_rate_kg_n_ha": rate} if rate > 0 else {})}


def till(on=True, depth=20.0):
    return {"tillage": on, "residue_removal": False,
            **({"tillage_depth_cm": depth, "tillage_frequency_per_yr": 2, "soil_disturbed_pct": 100} if on else {})}


NEG = {"manure": False, "compost": False, "synthetic_n": True, "synthetic_n_rate_kg_n_ha": -5}
NO_WATER = {"irrigation": False, "flooding": False}
NO_GRAZING = {"grazing": False, "harvesting_mowing": False}
NO_LIME = {"limestone": False, "dolomite": False}


def full_year(client, h, pid, fid, year, ev, crop_name="maize", rate=100.0, tillage=True, scenario="baseline",
              skip=()):
    parts = {"crop": crop(crop_name, year), "n_fertilizer": fert(rate), "tillage_residue": till(tillage),
             "water": NO_WATER, "grazing": NO_GRAZING, "liming": NO_LIME}
    for cat, attrs in parts.items():
        if cat not in skip:
            rec(client, h, pid, fid, year, cat, attrs, evidence_ids=[ev], scenario=scenario)


@pytest.fixture()
def setup(client, as_role):
    h = as_role("programme_admin")
    _, farm = farm_for(client, h)
    f = mk_field(client, h, farm["id"])
    p = mk_project(client, h)
    return h, p, f, evidence(client, h)


# ------------------------------------------------------------------ pure rules
def test_table4_schema_validation():
    assert domain.validate_attributes("n_fertilizer", fert(120)) == []
    assert any("synthetic_n" in e for e in domain.validate_attributes("n_fertilizer", {"manure": False,
                                                                                       "compost": False}))
    errs = domain.validate_attributes("n_fertilizer", {"manure": True, "compost": False, "synthetic_n": False})
    assert errs and "manure_rate_t_ha" in errs[0]
    alt = {"manure": False, "compost": False, "synthetic_n": True,
           "synthetic_fertilizers": [{"type": "urea", "mass_t": 0.25, "n_content": 0.46}]}
    assert domain.validate_attributes("n_fertilizer", alt) == []
    bad_list = {**alt, "synthetic_fertilizers": [{"type": "urea"}]}
    assert domain.validate_attributes("n_fertilizer", bad_list)
    assert any("negative" in e for e in domain.validate_attributes("n_fertilizer", NEG))
    assert any("more than 100" in e for e in domain.validate_attributes(
        "tillage_residue", {"tillage": False, "residue_removal": True, "residue_removed_pct": 140}))
    assert domain.validate_attributes("tillage_residue", {"tillage": "yes", "residue_removal": False})
    assert domain.validate_attributes("crop", {**CROP, "harvest_date": "2022-01-01"})
    assert domain.validate_attributes("crop", {"crop_type": "maize"})  # dates and yield are required
    assert domain.validate_attributes("water", {"irrigation": True, "flooding": False})
    assert domain.validate_attributes("water", {"irrigation": True, "flooding": False, "irrigation_rate_mm": 300}) == []
    assert any("negative" in e for e in domain.validate_attributes("water", {**NO_WATER, "note_value": -1}))
    assert domain.validate_attributes("nope", {})


def test_tier_rules():
    assert domain.tier_errors(1, 0, False, "", 2025)
    assert domain.tier_errors(1, 1, False, "", 2025) == []
    assert domain.tier_errors(2, 1, False, "", 2025) == []
    assert domain.tier_errors(3, 5, False, "", 2025)
    assert domain.tier_errors(3, 0, True, "", 2025) == []
    assert domain.tier_errors(4, 0, True, "Census", 2025, 5)  # no year
    assert domain.tier_errors(4, 0, True, "Agricultural Census 2004, Karnataka", 2025, 5)  # 21 years old
    assert domain.tier_errors(4, 0, True, "Agricultural Census 2005, Karnataka", 2025, 5) == []
    assert domain.tier_errors(4, 0, True, "Agricultural Census 2026 projection", 2025, 5)  # after start
    assert domain.tier_errors(4, 0, False, "Agricultural Census 2015-16", 2025, 5)  # no attestation
    assert domain.tier_errors(4, 0, True, "Agricultural Census 2015-16", 2025)  # release interval unknown
    # Box 1 (4) p.16: 20 years or the 10 most recent releases, whichever is more recent
    assert domain.census_window_start(2025, 5) == 2005 and domain.census_window_start(2025, 1) == 2015
    assert domain.tier_errors(4, 0, True, "Crop survey 2012", 2025, 1)  # annual: older than its 10 latest
    assert domain.tier_errors(4, 0, True, "Crop survey 2016", 2025, 1) == []
    assert domain.tier_errors(5, 1, True, "", 2025)


def test_rotation_rule():
    m, s, w = ("maize",), ("soybean",), ("wheat",)
    # §6 p.14: one complete rotation; an attested 3-year rotation is complete with 3 look-back years
    assert not domain.detect_rotation([m, s, w])["complete"]
    assert domain.detect_rotation([m, s, w], attested_length=3)["complete"]
    assert not domain.detect_rotation([m, s, w], attested_length=4)["complete"]  # look-back shorter than stated
    assert not domain.detect_rotation([m, s, m, w], attested_length=2)["complete"]  # inconsistent with the period
    assert domain.detect_rotation([m, m, m]) == {"pattern": "continuous", "length": 1, "complete": True,
                                                 "reason": "Continuous maize."}
    r = domain.detect_rotation([m, s, m])
    assert r["pattern"] == "rotation" and r["length"] == 2 and r["complete"]
    r = domain.detect_rotation([m, s, w])
    assert r["length"] == 3 and not r["complete"]
    r = domain.detect_rotation([m, s, w, m])
    assert r["length"] == 3 and r["complete"]
    assert not domain.detect_rotation([m, (), m])["complete"]
    assert not domain.detect_rotation([])["complete"]


def test_repeating_schedule_footnote8():
    sched = domain.repeating_schedule([2022, 2023, 2024], 2025, 7)
    assert [r["source_year"] for r in sched] == [2022, 2023, 2024, 2022, 2023, 2024, 2022]
    assert sched[0] == {"t": 1, "year": 2025, "source_year": 2022, "source_t": -3}
    assert domain.repeating_schedule([], 2025, 5) == []


def test_reassessment_dates():
    r = domain.reassessment(date(2020, 3, 1), date(2024, 1, 1))
    assert r["due_on"] == "2030-03-01" and r["recommended_on"] == "2025-03-01" and r["status"] == "not_due"
    assert domain.reassessment(date(2020, 3, 1), date(2026, 1, 1))["status"] == "recommended"
    assert domain.reassessment(date(2014, 3, 1), date(2026, 1, 1))["status"] == "overdue"
    assert domain.reassessment(None, date(2026, 1, 1))["status"] == "unknown"
    assert domain.reassessment(date(2020, 2, 29), date(2021, 1, 1))["due_on"] == "2030-02-28"


def test_practice_change_threshold_pure():
    lb = [domain.aggregate_year("n_fertilizer", [fert(100)]) for _ in range(3)]
    small = domain.compare_practice("n_fertilizer", lb, domain.aggregate_year("n_fertilizer", [fert(95)]))
    assert small and not any(c["qualifying"] for c in small) and small[0]["change_pct"] == -5.0
    big = domain.compare_practice("n_fertilizer", lb, domain.aggregate_year("n_fertilizer", [fert(94)]))
    assert any(c["qualifying"] for c in big)
    stopped = domain.compare_practice("n_fertilizer", lb, domain.aggregate_year("n_fertilizer", [fert(0)]))
    assert {c["key"] for c in stopped if c["qualifying"]} == {"synthetic_n_rate_kg_n_ha", "synthetic_n"}
    lb0 = [domain.aggregate_year("tillage_residue", [till(False)])]
    new = domain.compare_practice("tillage_residue", lb0, domain.aggregate_year("tillage_residue", [till(True)]))
    assert any(c.get("introduced") for c in new)
    assert set(domain.APPENDIX1_CATEGORIES) == set(domain.APPENDIX_1_PRACTICES)


# ------------------------------------------------------------------ API: create & validate
def test_create_activity_record(setup, client):
    h, p, f, ev = setup
    r = rec(client, h, p["id"], f["id"], 2022, "n_fertilizer", fert(110), evidence_ids=[ev, ev])
    assert r["version"] == 1 and r["status"] == "active" and r["evidence_ids"] == [ev]
    assert r["data_tier_label"].startswith("Historical") and r["data_class"] == "RECORDED"
    assert any(a["action"] == "activity_record.create" for a in client.get("/api/audit", headers=h).json())


def test_create_rejections(setup, client):
    h, p, f, ev = setup
    pid, fid = p["id"], f["id"]
    assert rec(client, h, pid, fid, 2022, "weather", {}, evidence_ids=[ev], expect=422)["code"] == "UNKNOWN_CATEGORY"
    assert rec(client, h, pid, fid, 2022, "n_fertilizer", {"manure": True, "compost": False, "synthetic_n": False},
               evidence_ids=[ev], expect=422)["code"] == "INVALID_ATTRIBUTES"
    assert rec(client, h, pid, fid, 2022, "n_fertilizer", NEG, evidence_ids=[ev], expect=422)["code"] == \
        "INVALID_ATTRIBUTES"
    assert rec(client, h, pid, fid, 2025, "n_fertilizer", fert(), evidence_ids=[ev], expect=422)  # baseline >= start
    assert rec(client, h, pid, fid, 2024, "n_fertilizer", fert(), evidence_ids=[ev], scenario="project", expect=422)
    assert rec(client, h, pid, fid, date.today().year + 1, "n_fertilizer", fert(), evidence_ids=[ev],
               scenario="project", expect=422)
    assert rec(client, h, pid, fid, 2022, "n_fertilizer", fert(), scenario="future", evidence_ids=[ev], expect=422)
    assert rec(client, h, pid, fid, 2022, "n_fertilizer", fert(), tier=5, evidence_ids=[ev], expect=422)
    assert rec(client, h, pid, fid, 2022, "n_fertilizer", fert(), evidence_ids=["not-a-file"],
               expect=422)["code"] == "INVALID_ACTIVITY"


def test_project_without_start_fails_closed(client, as_role):
    h = as_role("programme_admin")
    _, farm = farm_for(client, h)
    f = mk_field(client, h, farm["id"])
    p = mk_project(client, h, code="NOSTART", baseline_start=None, start=None, end=None)
    r = rec(client, h, p["id"], f["id"], 2022, "n_fertilizer", fert(), evidence_ids=[evidence(client, h)], expect=409)
    assert r["code"] == "PROJECT_START_MISSING"
    assert client.get(f"/api/projects/{p['id']}/baseline-schedule", headers=h).status_code == 409


def test_tier_evidence_rules_via_api(setup, client):
    h, p, f, ev = setup
    pid, fid = p["id"], f["id"]
    assert rec(client, h, pid, fid, 2022, "liming", NO_LIME, tier=1, expect=422)["code"] == "INVALID_DATA_TIER"
    assert rec(client, h, pid, fid, 2022, "liming", NO_LIME, tier=2, evidence_ids=[ev])["data_tier"] == 2
    assert rec(client, h, pid, fid, 2022, "liming", NO_LIME, tier=3, evidence_ids=[ev], expect=422)["code"] == \
        "INVALID_DATA_TIER"
    plain = evidence(client, h, kind="document", name="note.pdf")
    assert rec(client, h, pid, fid, 2022, "liming", NO_LIME, tier=3, attestation_id=plain, expect=422)
    att = evidence(client, h, kind="attestation", name="signed.pdf")  # a hand-signed scan uploaded directly
    assert rec(client, h, pid, fid, 2022, "liming", NO_LIME, tier=3, attestation_id=att)["attestation_id"] == att
    assert rec(client, h, pid, fid, 2022, "liming", NO_LIME, tier=4, attestation_id=att, expect=422)
    assert rec(client, h, pid, fid, 2022, "liming", NO_LIME, tier=4, attestation_id=att,
               source_note="Agricultural Census 2003, Karnataka district tables", expect=422)
    assert rec(client, h, pid, fid, 2022, "liming", NO_LIME, tier=4, attestation_id=att,
               source_note="Agricultural Census 2015-16, Karnataka district tables", expect=422)  # interval unknown
    ok = rec(client, h, pid, fid, 2022, "liming", NO_LIME, tier=4, attestation_id=att,
             source_note="Agricultural Census 2015-16, Karnataka district tables", census_release_interval_years=5)
    assert ok["data_tier"] == 4 and ok["census_release_interval_years"] == 5


def test_versions_and_void(setup, client):
    h, p, f, ev = setup
    r = rec(client, h, p["id"], f["id"], 2022, "n_fertilizer", fert(100), evidence_ids=[ev])
    url = f"/api/activity-records/{r['record_id']}"
    same = client.post(f"{url}/versions", headers=h, json={"reason": "No real change", "attributes": fert(100)})
    assert same.status_code == 422
    bad = client.post(f"{url}/versions", headers=h, json={"reason": "Typo in rate", "attributes": NEG})
    assert bad.status_code == 422
    v2 = client.post(f"{url}/versions", headers=h, json={"reason": "Typo in rate", "attributes": fert(120)})
    assert v2.status_code == 201 and v2.json()["version"] == 2 and v2.json()["reason"] == "Typo in rate"
    assert client.post(f"{url}/versions", headers=h, json={"reason": "no"}).status_code == 422
    listed = client.get(f"/api/activity-records?project_id={p['id']}", headers=h).json()
    assert listed["total"] == 1 and listed["items"][0]["version"] == 2
    assert listed["items"][0]["attributes"]["synthetic_n_rate_kg_n_ha"] == 120
    assert [x["version"] for x in client.get(f"{url}/versions", headers=h).json()] == [2, 1]
    assert client.post(f"{url}/void", headers=h, json={"reason": "bad"}).status_code == 422
    v = client.post(f"{url}/void", headers=h, json={"reason": "Duplicate entry"})
    assert v.status_code == 201 and v.json()["status"] == "voided" and v.json()["version"] == 3
    assert client.get(f"/api/activity-records?project_id={p['id']}", headers=h).json()["total"] == 0
    assert client.get(f"/api/activity-records?project_id={p['id']}&include_voided=true", headers=h).json()["total"] == 1
    assert client.post(f"{url}/void", headers=h, json={"reason": "Twice over"}).status_code == 409
    assert client.post(f"{url}/versions", headers=h, json={"reason": "Revive it", "attributes": fert(1)}
                       ).status_code == 409
    with dbmod.session_factory()() as s:
        row = s.query(ActivityRecord).first()
        row.year = 2020
        with pytest.raises(ImmutableRecord):
            s.flush()


def test_list_filters(setup, client):
    h, p, f, ev = setup
    g = mk_field(client, h, f["farm_id"], lon=east(3))
    rec(client, h, p["id"], f["id"], 2022, "n_fertilizer", fert(), evidence_ids=[ev])
    rec(client, h, p["id"], f["id"], 2023, "water", NO_WATER, evidence_ids=[ev])
    rec(client, h, p["id"], g["id"], 2023, "water", NO_WATER, evidence_ids=[ev])
    rec(client, h, p["id"], g["id"], 2025, "water", NO_WATER, evidence_ids=[ev], scenario="project")

    def total(qs):
        r = client.get(f"/api/activity-records?{qs}", headers=h)
        assert r.status_code == 200, r.text
        return r.json()["total"]

    assert total(f"project_id={p['id']}") == 4
    assert total(f"field_id={f['id']}") == 2
    assert total("scenario=project") == 1
    assert total("category=water") == 3
    assert total("year=2023") == 2
    assert total(f"field_id={g['id']}&scenario=baseline&category=water&year=2023") == 1
    schema = client.get("/api/activity-records/schema", headers=h).json()
    assert schema["categories"]["n_fertilizer"]["table4"] and "crop" in schema["appendix1_practices"]


def test_permissions_and_isolation(setup, client, as_role):
    h, p, f, ev = setup
    collector = as_role("field_collector")
    r = rec(client, collector, p["id"], f["id"], 2022, "water", NO_WATER, evidence_ids=[ev])
    assert client.get(f"/api/activity-records/{r['record_id']}", headers=collector).status_code == 200
    analyst = as_role("mrv_analyst")
    assert client.get("/api/activity-records", headers=analyst).status_code == 200
    assert rec(client, analyst, p["id"], f["id"], 2022, "water", NO_WATER, evidence_ids=[ev], expect=403)
    assert client.get("/api/activity-records", headers=as_role("farmer")).status_code == 403
    rival = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/activity-records/{r['record_id']}", headers=rival).status_code == 404
    assert client.get("/api/activity-records", headers=rival).json()["total"] == 0
    assert client.post(f"/api/activity-records/{r['record_id']}/void", headers=rival,
                       json={"reason": "Hijack attempt"}).status_code == 404
    assert rec(client, rival, p["id"], f["id"], 2022, "water", NO_WATER, evidence_ids=[ev], expect=404)
    assert client.get(f"/api/projects/{p['id']}/baseline-schedule", headers=rival).status_code == 404
    assert client.get(f"/api/projects/{p['id']}/practice-change", headers=rival).status_code == 404
    rival_ev = evidence(client, rival)
    assert rec(client, h, p["id"], f["id"], 2022, "water", NO_WATER, evidence_ids=[rival_ev], expect=422)


# ------------------------------------------------------------------ attestations
def test_attestation_pdf_and_use(setup, client):
    h, p, f, ev = setup
    url = f"/api/projects/{p['id']}/fields/{f['id']}/attestations"
    body = {"years": [2022, 2023, 2024], "statement_lang": "kn", "method": "otp", "otp_code": "000000"}
    assert client.post(url, headers=h, json=body).json()["code"] == "NOTHING_TO_ATTEST"
    rec(client, h, p["id"], f["id"], 2022, "n_fertilizer", fert(), evidence_ids=[ev])
    assert client.post(url, headers=h, json=body).json()["code"] == "OTP_INVALID"
    assert client.post(url, headers=h, json={**body, "statement_lang": "xx", "otp_code": "123456"}).status_code == 422
    assert client.post(url, headers=h, json={**body, "years": [2025], "otp_code": "123456"}).status_code == 422
    decl = {"year": 2023, "category": "tillage_residue", "attributes": till(True)}
    r = client.post(url, headers=h, json={**body, "otp_code": "123456", "declarations": [decl]})
    assert r.status_code == 201, r.text
    att = r.json()
    assert att["method"] == "otp" and att["witness_user_id"] is None and att["years"] == [2022, 2023, 2024]
    assert len(att["records"]) == 1 and att["declarations"][0]["category"] == "tillage_residue"
    meta = client.get(f"/api/evidence/{att['evidence_id']}", headers=h).json()
    assert meta["kind"] == "attestation" and meta["mime_type"] == "application/pdf" and meta["entity_id"] == f["id"]
    pdf = client.get(f"/api/evidence/{att['evidence_id']}/content", headers=h)
    assert pdf.status_code == 200 and pdf.content.startswith(b"%PDF")
    # tier-3 records can now cite it, for attested years and this field only
    ok = rec(client, h, p["id"], f["id"], 2023, "tillage_residue", till(True), tier=3,
             attestation_id=att["evidence_id"])
    assert ok["attestation_id"] == att["evidence_id"]
    assert rec(client, h, p["id"], f["id"], 2021, "tillage_residue", till(True), tier=3,
               attestation_id=att["evidence_id"], expect=422)
    g = mk_field(client, h, f["farm_id"], lon=east(3))
    assert rec(client, h, p["id"], g["id"], 2023, "tillage_residue", till(True), tier=3,
               attestation_id=att["evidence_id"], expect=422)
    bad_decl = {"year": 2019, "category": "water", "attributes": NO_WATER}
    assert client.post(url, headers=h, json={**body, "otp_code": "123456", "declarations": [bad_decl]}
                       ).status_code == 422
    listed = client.get(url, headers=h).json()
    assert [a["id"] for a in listed] == [att["id"]]


def test_assisted_attestation_records_witness(setup, client, as_role):
    h, p, f, ev = setup
    rec(client, h, p["id"], f["id"], 2022, "water", NO_WATER, evidence_ids=[ev])
    collector = as_role("field_collector")
    r = client.post(f"/api/projects/{p['id']}/fields/{f['id']}/attestations", headers=collector,
                    json={"years": [2022], "statement_lang": "en", "method": "assisted"})
    assert r.status_code == 201, r.text
    assert r.json()["witness_user_id"] and r.json()["method"] == "assisted"
    assert client.post(f"/api/projects/{p['id']}/fields/{f['id']}/attestations", headers=as_role("mrv_analyst"),
                       json={"years": [2022], "statement_lang": "en", "method": "esign"}).status_code == 403


# ------------------------------------------------------------------ schedule of activities
def test_schedule_ready_continuous(setup, client):
    h, p, f, ev = setup
    for y in (2022, 2023, 2024):
        full_year(client, h, p["id"], f["id"], y, ev)
    s = client.get(f"/api/projects/{p['id']}/baseline-schedule", headers=h)
    assert s.status_code == 200, s.text
    body = s.json()
    assert body["start_year"] == START and body["baseline_period_years"] == 10
    assert body["reassessment"]["due_on"] == "2034-06-01" and body["reassessment"]["recommended_on"] == "2029-06-01"
    fld = body["fields"][0]
    assert fld["lookback_years"] == [2022, 2023, 2024] and fld["meets_min_years"] and fld["complete"]
    assert fld["rotation"]["pattern"] == "continuous" and fld["ready"] and fld["missing_items"] == []
    assert fld["tier_summary"] == {"1": 18, "2": 0, "3": 0, "4": 0}
    assert [r["source_year"] for r in fld["schedule"]][:4] == [2022, 2023, 2024, 2022]
    assert fld["schedule"][0]["crops"] == ["maize"] and len(fld["schedule"]) == 10
    assert body["fields_ready"] == 1


def test_schedule_rotation_and_gaps(setup, client):
    h, p, f, ev = setup
    full_year(client, h, p["id"], f["id"], 2022, ev, crop_name="maize")
    full_year(client, h, p["id"], f["id"], 2023, ev, crop_name="soybean")
    full_year(client, h, p["id"], f["id"], 2024, ev, crop_name="wheat", skip=("water", "liming"))
    fld = client.get(f"/api/projects/{p['id']}/baseline-schedule", headers=h).json()["fields"][0]
    assert not fld["rotation"]["complete"] and not fld["lookback_ok"] and not fld["ready"]
    assert fld["missing_items"] == ["2024: Water management", "2024: Liming"]
    assert fld["completeness"][-1] == {"year": 2024, "t": -1, "complete": False, "missing": ["water", "liming"]}
    full_year(client, h, p["id"], f["id"], 2021, ev, crop_name="wheat")  # W, M, S, W -> 3-year rotation restarts
    fld = client.get(f"/api/projects/{p['id']}/baseline-schedule", headers=h).json()["fields"][0]
    assert fld["rotation"]["length"] == 3 and fld["rotation"]["complete"] and fld["lookback_length"] == 4
    assert any("whole number" in w for w in fld["warnings"])


def test_schedule_too_short_lookback(setup, client):
    h, p, f, ev = setup
    full_year(client, h, p["id"], f["id"], 2024, ev)
    full_year(client, h, p["id"], f["id"], 2023, ev)
    full_year(client, h, p["id"], f["id"], 2020, ev)  # not contiguous with 2023-2024
    fld = client.get(f"/api/projects/{p['id']}/baseline-schedule", headers=h).json()["fields"][0]
    assert fld["lookback_years"] == [2023, 2024] and not fld["meets_min_years"] and not fld["ready"]
    assert any("2020" in w for w in fld["warnings"])


def test_enrolment_warns_on_missing_lookback_records(client, as_role):
    h = as_role("programme_admin")
    _, _, f = ready_field(client, h)
    p = mk_project(client, h, code="EN-1")
    ev = evidence(client, h)
    for y in (2023, 2024):
        full_year(client, h, p["id"], f["id"], y, ev)
    e = client.post(f"/api/projects/{p['id']}/enrolments", headers=h, json={"field_id": f["id"]}).json()
    chk = {c["code"]: c for c in e["eligibility"]["checks"]}["lookback_activity_records"]
    assert e["status"] == "eligible" and chk["severity"] == "warning" and chk["details"]["missing_years"] == [2022]
    full_year(client, h, p["id"], f["id"], 2022, ev)
    e = client.post(f"/api/projects/{p['id']}/enrolments", headers=h, json={"field_id": f["id"]}).json()
    chk = {c["code"]: c for c in e["eligibility"]["checks"]}["lookback_activity_records"]
    assert chk["details"]["missing_years"] == []


# ------------------------------------------------------------------ practice change
def _pc(client, h, p):
    r = client.get(f"/api/projects/{p['id']}/practice-change", headers=h)
    assert r.status_code == 200, r.text
    return r.json()


def test_practice_change_threshold_via_api(setup, client):
    h, p, f, ev = setup
    for y in (2022, 2023, 2024):
        full_year(client, h, p["id"], f["id"], y, ev, rate=100)
    assert _pc(client, h, p)["fields"][0]["status"] == "insufficient_data"
    full_year(client, h, p["id"], f["id"], 2025, ev, rate=96, scenario="project")  # -4 %
    fld = _pc(client, h, p)["fields"][0]
    assert not fld["qualifies"] and fld["status"] == "no_qualifying_change"
    nf = next(c for c in fld["categories"] if c["category"] == "n_fertilizer")
    assert nf["years"][0]["changes"][0]["change_pct"] == -4.0 and not nf["qualifying"]
    assert nf["appendix1_practices"]
    full_year(client, h, p["id"], f["id"], 2026, ev, rate=90, scenario="project")  # -10 %
    fld = _pc(client, h, p)["fields"][0]
    nf = next(c for c in fld["categories"] if c["category"] == "n_fertilizer")
    assert fld["qualifies"] and fld["status"] == "qualifies" and nf["qualifying"]
    assert [y["qualifying"] for y in nf["years"]] == [False, True]


def test_practice_change_no_till_and_non_appendix_category(setup, client):
    h, p, f, ev = setup
    for y in (2022, 2023, 2024):
        full_year(client, h, p["id"], f["id"], y, ev)
    # only liming changes: not an Appendix 1 category, so it doesn't qualify
    full_year(client, h, p["id"], f["id"], 2025, ev, scenario="project", skip=("liming",))
    rec(client, h, p["id"], f["id"], 2025, "liming", {"limestone": True, "dolomite": False, "limestone_t_ha": 2},
        evidence_ids=[ev], scenario="project")
    fld = _pc(client, h, p)["fields"][0]
    lime = next(c for c in fld["categories"] if c["category"] == "liming")
    assert any(ch["qualifying"] for ch in lime["years"][0]["changes"]) and not lime["qualifying"]
    assert not fld["qualifies"]
    # switching to no-till is a qualifying tillage change
    full_year(client, h, p["id"], f["id"], 2026, ev, scenario="project", tillage=False)
    fld = _pc(client, h, p)["fields"][0]
    tr = next(c for c in fld["categories"] if c["category"] == "tillage_residue")
    assert tr["qualifying"] and fld["qualifies"]


# ------------------------------------------------------------------ §4 condition 6: productivity
def test_productivity_check_pure():
    from app.modules.baseline.domain import productivity_check as pc
    lb = [{"maize": [4.0]}, {"maize": [4.4]}]  # look-back mean 4.2
    assert pc(lb, {2025: {"maize": [4.0]}})["status"] == "ok"  # −4.8 %
    one = pc(lb, {2025: {"maize": [3.5]}})
    assert one["status"] == "watch" and one["crops"][0]["status"] == "watch"  # a single year is not sustained
    two = pc(lb, {2025: {"maize": [3.6]}, 2026: {"maize": [3.8]}})
    assert two["status"] == "warning" and two["crops"][0]["change_pct"] == pytest.approx(-11.905, abs=1e-3)
    assert "VMD0054" in two["message"]
    new = pc(lb, {2025: {"soybean": [1.0]}, 2026: {"soybean": [1.0]}})
    assert new["status"] == "ok" and new["crops"][0]["status"] == "not_compared"
    assert pc([], {})["status"] == "no_data"


def test_productivity_decline_in_practice_change(setup, client):
    h, p, f, ev = setup
    for y in (2022, 2023, 2024):
        full_year(client, h, p["id"], f["id"], y, ev)  # yield 4.2 t/ha
    for y in (2025, 2026):
        full_year(client, h, p["id"], f["id"], y, ev, scenario="project", skip=("crop",))
        rec(client, h, p["id"], f["id"], y, "crop", {**crop("maize", y), "yield_t_ha": 3.7}, evidence_ids=[ev],
            scenario="project")
    out = _pc(client, h, p)
    prod = out["fields"][0]["productivity"]
    assert prod["status"] == "warning" and prod["crops"][0]["lookback_mean_t_ha"] == 4.2
    assert out["fields_productivity_warning"] == 1 and out["productivity_threshold_pct"] == 5.0
