import uuid
from datetime import UTC, date, datetime, timedelta

import pytest

from app.core import db as dbmod
from app.core import geo
from app.core.errors import ImmutableRecord
from app.modules.land.domain import LandUseSpan, land_use_check, lookback_window
from app.modules.land.models import Farm, Field, LandTenure, LandUseRecord
from app.modules.partners.models import DomainEvent
from tests.conftest import login, make_org, make_user
from tests.test_farmers import mk_farmer

YEAR = date.today().year
LAT, LON = 12.40, 75.70
SIDE = 100  # metres -> 1 ha squares


def east(n: float) -> float:
    """Longitude of the n-th square east of LON (squares touch edge to edge)."""
    import math
    return LON + n * SIDE / (111_320.0 * math.cos(math.radians(LAT)))


def farm_for(client, h, phone="9812345670"):
    client.post("/api/catalogue/install-defaults", headers=h)
    farmer = mk_farmer(client, h, phone=phone)
    farm = client.post("/api/farms", headers=h, json={"farmer_id": farmer["id"], "name": "Hill Estate"})
    assert farm.status_code == 201, farm.text
    return farmer, farm.json()


def mk_field(client, h, farm_id, lat=LAT, lon=LON, side=SIDE, crop="coffee", attrs=None, expect=201, **extra):
    r = client.post("/api/fields", headers=h, json={
        "farm_id": farm_id, "name": "Block A", "boundary": geo.square(lat, lon, side), "crop_code": crop,
        "crop_attributes": {"variety": "arabica"} if attrs is None else attrs, **extra})
    assert r.status_code == expect, r.text
    return r.json()


def add_history(client, h, field_id, start=YEAR - 10, end=YEAR - 1, use="cropland", evidence_id=None):
    r = client.post(f"/api/fields/{field_id}/land-use", headers=h, json={
        "from_year": start, "to_year": end, "land_use": use, "evidence_id": evidence_id, "source": "farmer interview"})
    assert r.status_code == 201, r.text
    return r.json()


def consent(client, h, farmer_id, purposes=("sampling", "data_use"), granted=True):
    for p in purposes:
        assert client.post(f"/api/farmers/{farmer_id}/consents", headers=h,
                           json={"purpose": p, "granted": granted}).status_code == 201


def mk_project(client, h, code="PRJ-1", programme=None, start="2025-01-01", end="2034-12-31", **prog):
    if programme is None:
        body = {"code": f"PG-{code}", "name": "Programme", **prog}
        r = client.post("/api/programmes", headers=h, json=body)
        assert r.status_code == 201, r.text
        programme = r.json()
    r = client.post("/api/projects", headers=h, json={"programme_id": programme["id"], "code": code, "name": "Project",
                                                       "crediting_start": start, "crediting_end": end})
    assert r.status_code == 201, r.text
    return programme, r.json()


def grant_tenure(field_id, valid_from=date(2000, 1, 1), valid_to=None, status="verified", kind="owned"):
    """Seed-free factory: a tenure record for the field's farmer, written straight to the database."""
    with dbmod.session_factory()() as s:
        f = s.get(Field, uuid.UUID(field_id))
        farm = s.get(Farm, f.farm_id)
        s.add(LandTenure(org_id=f.org_id, field_id=f.id, holder_farmer_id=farm.farmer_id, kind=kind,
                         document_evidence_ids=[], valid_from=valid_from, valid_to=valid_to, status=status))
        s.commit()


def ready_field(client, h, phone="9812345670", **field_kw):
    farmer, farm = farm_for(client, h, phone)
    field = mk_field(client, h, farm["id"], **field_kw)
    add_history(client, h, field["id"])
    consent(client, h, farmer["id"])
    grant_tenure(field["id"])
    return farmer, farm, field


def enrol(client, h, project_id, field_id):
    r = client.post(f"/api/projects/{project_id}/enrolments", headers=h, json={"field_id": field_id})
    assert r.status_code == 201, r.text
    return r.json()


def checks_of(enrolment):
    return {c["code"]: c for c in enrolment["eligibility"]["checks"]}


# ------------------------------------------------------------------ land-use rules (pure)
def _span(a, b, use, t=0, ev=True):
    return LandUseSpan(a, b, use, datetime(2025, 1, 1, tzinfo=UTC) + timedelta(seconds=t), ev)


def test_lookback_window():
    assert lookback_window(2026, 10) == (2016, 2025)


def test_land_use_full_cover_passes():
    c = land_use_check([_span(2010, 2025, "cropland")], 2026, 10)
    assert c.passed and c.details["missing_years"] == []


def test_land_use_gap_fails():
    c = land_use_check([_span(2016, 2019, "cropland"), _span(2022, 2025, "cropland")], 2026, 10)
    assert not c.passed and c.details["missing_years"] == [2020, 2021] and "2020–2021" in c.message


def test_land_use_conversion_fails():
    c = land_use_check([_span(2016, 2018, "forest"), _span(2019, 2025, "cropland")], 2026, 10)
    assert not c.passed and c.details["converted_years"] == [2016, 2017, 2018] and "forest" in c.message


def test_land_use_forest_before_window_is_fine():
    assert land_use_check([_span(2000, 2014, "forest"), _span(2015, 2025, "cropland")], 2026, 10).passed


def test_land_use_later_record_corrects_earlier():
    spans = [_span(2016, 2025, "wetland", t=0), _span(2016, 2025, "cropland", t=10)]
    assert land_use_check(spans, 2026, 10).passed


def test_land_use_flags_missing_evidence():
    c = land_use_check([_span(2016, 2025, "cropland", ev=False)], 2026, 10)
    assert c.passed and len(c.details["unevidenced_years"]) == 10 and "Evidence is still missing" in c.message


# ------------------------------------------------------------------ farms
def test_farm_crud(client, as_role):
    h = as_role("programme_admin")
    farmer, farm = farm_for(client, h)
    assert client.get(f"/api/farms?farmer_id={farmer['id']}", headers=h).json()[0]["id"] == farm["id"]
    r = client.patch(f"/api/farms/{farm['id']}", headers=h, json={"village": "Madapura", "external_farm_id": "VP-1"})
    assert r.json()["village"] == "Madapura" and r.json()["external_farm_id"] == "VP-1"
    assert client.post("/api/farms", headers=h, json={"farmer_id": str(uuid.uuid4()), "name": "X"}).status_code == 404


# ------------------------------------------------------------------ fields
def test_create_field_computes_area_and_code(client, as_role):
    h = as_role("programme_admin")
    _, farm = farm_for(client, h)
    f = mk_field(client, h, farm["id"], area_ha=999)  # a client-sent area is ignored
    assert f["code"] == "FLD-000001" and f["version"] == 1 and f["data_class"] == "CALCULATED"
    assert f["area_ha"] == pytest.approx(1.0, rel=0.01)
    assert f["centroid_lat"] == pytest.approx(LAT, abs=1e-6)
    g = mk_field(client, h, farm["id"], lon=east(3))
    assert g["code"] == "FLD-000002"
    hist = client.get(f"/api/fields/{f['id']}/history", headers=h).json()
    assert len(hist) == 1 and hist[0]["version"] == 1
    assert any(a["action"] == "field.create" for a in client.get("/api/audit", headers=h).json())


def test_invalid_boundary_rejected(client, as_role):
    h = as_role("programme_admin")
    _, farm = farm_for(client, h)
    bowtie = {"type": "Polygon", "coordinates": [[[75.7, 12.4], [75.701, 12.401], [75.701, 12.4], [75.7, 12.401],
                                                  [75.7, 12.4]]]}
    r = client.post("/api/fields", headers=h, json={"farm_id": farm["id"], "name": "Bad", "boundary": bowtie})
    assert r.status_code == 422 and r.json()["code"] == "INVALID_GEOMETRY"
    tiny = client.post("/api/fields", headers=h, json={"farm_id": farm["id"], "name": "Tiny",
                                                       "boundary": geo.square(LAT, LON, 1)})
    assert tiny.status_code == 422


def test_crop_attributes_validated(client, as_role):
    h = as_role("programme_admin")
    _, farm = farm_for(client, h)
    r = mk_field(client, h, farm["id"], attrs={}, expect=422)
    assert r["code"] == "INVALID_ATTRIBUTES" and "Variety is required." in r["message"]
    assert mk_field(client, h, farm["id"], attrs={"variety": "liberica"}, expect=422)["code"] == "INVALID_ATTRIBUTES"
    assert mk_field(client, h, farm["id"], crop="kiwi", attrs={}, expect=422)["code"] == "UNKNOWN_CROP"
    assert mk_field(client, h, farm["id"], crop=None, attrs={"variety": "x"}, expect=422)
    mk_field(client, h, farm["id"], crop="rice", attrs={"water_regime": "awd"})


def test_overlapping_field_rejected(client, as_role):
    h = as_role("programme_admin")
    _, farm = farm_for(client, h)
    first = mk_field(client, h, farm["id"])
    r = mk_field(client, h, farm["id"], lon=east(0.5), expect=409)
    assert r["code"] == "OVERLAPPING_FIELD" and first["code"] in r["message"]
    assert r["details"]["field_code"] == first["code"]
    mk_field(client, h, farm["id"], lon=east(1))  # sharing an edge is fine


def test_overlap_checked_across_farmers_but_not_orgs(client, as_role):
    h = as_role("programme_admin")
    _, farm = farm_for(client, h)
    mk_field(client, h, farm["id"])
    neighbour = mk_farmer(client, h, phone="9812345672", name="Neighbour")
    farm2 = client.post("/api/farms", headers=h, json={"farmer_id": neighbour["id"], "name": "N"}).json()
    assert mk_field(client, h, farm2["id"], expect=409)["code"] == "OVERLAPPING_FIELD"
    other = login(client, make_user(make_org("Rival"), "programme_admin"))
    _, their_farm = farm_for(client, other, phone="9812345674")
    mk_field(client, other, their_farm["id"])


def test_retired_field_does_not_block_and_reactivation_checks_overlap(client, as_role):
    h = as_role("programme_admin")
    _, farm = farm_for(client, h)
    old = mk_field(client, h, farm["id"])
    assert client.patch(f"/api/fields/{old['id']}", headers=h, json={"status": "retired"}).json()["status"] == "retired"
    mk_field(client, h, farm["id"])
    r = client.patch(f"/api/fields/{old['id']}", headers=h, json={"status": "active"})
    assert r.status_code == 409 and r.json()["code"] == "OVERLAPPING_FIELD"


def test_boundary_change_needs_reason_and_versions(client, as_role):
    h = as_role("programme_admin")
    _, farm = farm_for(client, h)
    f = mk_field(client, h, farm["id"])
    bigger = geo.square(LAT, LON, 200)
    no_reason = client.patch(f"/api/fields/{f['id']}", headers=h, json={"boundary": bigger})
    assert no_reason.status_code == 422 and no_reason.json()["code"] == "REASON_REQUIRED"
    r = client.patch(f"/api/fields/{f['id']}", headers=h, json={"boundary": bigger, "reason": "Resurveyed with RTK GPS"})
    assert r.status_code == 200, r.text
    assert r.json()["version"] == 2 and r.json()["area_ha"] == pytest.approx(4.0, rel=0.01)
    hist = client.get(f"/api/fields/{f['id']}/history", headers=h).json()
    assert [v["version"] for v in hist] == [2, 1] and hist[0]["reason"] == "Resurveyed with RTK GPS"
    same = client.patch(f"/api/fields/{f['id']}", headers=h, json={"boundary": bigger, "name": "Renamed"})
    assert same.status_code == 200 and same.json()["version"] == 2 and same.json()["name"] == "Renamed"


def test_boundary_change_cannot_overlap(client, as_role):
    h = as_role("programme_admin")
    _, farm = farm_for(client, h)
    a = mk_field(client, h, farm["id"])
    b = mk_field(client, h, farm["id"], lon=east(2))
    r = client.patch(f"/api/fields/{a['id']}", headers=h, json={"boundary": geo.square(LAT, east(1), 150),
                                                                "reason": "Expanded east"})
    assert r.status_code == 409 and b["code"] in r.json()["message"]


def test_list_filters_geojson_and_contains(client, as_role):
    h = as_role("programme_admin")
    farmer, farm = farm_for(client, h)
    a = mk_field(client, h, farm["id"])
    mk_field(client, h, farm["id"], lon=east(2), crop="rice", attrs={"water_regime": "awd"})
    assert client.get("/api/fields", headers=h).json()["total"] == 2
    assert client.get("/api/fields?crop_code=rice", headers=h).json()["total"] == 1
    assert client.get(f"/api/fields?farmer_id={farmer['id']}", headers=h).json()["total"] == 2
    assert client.get(f"/api/fields?farm_id={farm['id']}&limit=1", headers=h).json()["items"][0]["code"] == "FLD-000001"
    fc = client.get("/api/fields/geojson", headers=h).json()
    assert fc["type"] == "FeatureCollection" and len(fc["features"]) == 2
    assert fc["features"][0]["geometry"]["type"] == "Polygon"
    assert fc["features"][0]["properties"]["farmer_id"] == farmer["id"]
    inside = client.get(f"/api/fields/{a['id']}/contains?lat={LAT}&lon={LON}", headers=h).json()
    outside = client.get(f"/api/fields/{a['id']}/contains?lat={LAT}&lon={east(2)}", headers=h).json()
    assert inside["inside"] is True and outside["inside"] is False
    assert client.get(f"/api/fields/{a['id']}/contains?lat=100&lon=0", headers=h).status_code == 422


# ------------------------------------------------------------------ land use
def test_land_use_records(client, as_role):
    h = as_role("programme_admin")
    _, farm = farm_for(client, h)
    f = mk_field(client, h, farm["id"])
    ev = client.post("/api/evidence", headers=h, files={"file": ("rtc.pdf", b"%PDF-1.4 record", "application/pdf")},
                     data={"kind": "document"}).json()
    no_ev = add_history(client, h, f["id"], YEAR - 10, YEAR - 6)
    with_ev = add_history(client, h, f["id"], YEAR - 5, YEAR - 1, evidence_id=ev["id"])
    assert no_ev["evidence_missing"] is True and with_ev["evidence_missing"] is False
    listed = client.get(f"/api/fields/{f['id']}/land-use", headers=h).json()
    assert [r["from_year"] for r in listed] == [YEAR - 10, YEAR - 5]
    bad_order = client.post(f"/api/fields/{f['id']}/land-use", headers=h,
                            json={"from_year": 2020, "to_year": 2019, "land_use": "cropland"})
    assert bad_order.status_code == 422
    future = client.post(f"/api/fields/{f['id']}/land-use", headers=h,
                         json={"from_year": YEAR, "to_year": YEAR + 1, "land_use": "cropland"})
    assert future.status_code == 422
    bad_use = client.post(f"/api/fields/{f['id']}/land-use", headers=h,
                          json={"from_year": 2019, "to_year": 2019, "land_use": "moon"})
    assert bad_use.status_code == 422
    missing_ev = client.post(f"/api/fields/{f['id']}/land-use", headers=h, json={
        "from_year": 2019, "to_year": 2019, "land_use": "cropland", "evidence_id": str(uuid.uuid4())})
    assert missing_ev.status_code == 404


def test_land_use_is_append_only(client, as_role):
    h = as_role("programme_admin")
    _, farm = farm_for(client, h)
    f = mk_field(client, h, farm["id"])
    add_history(client, h, f["id"])
    with dbmod.session_factory()() as s:
        rec = s.query(LandUseRecord).first()
        rec.land_use = "forest"
        with pytest.raises(ImmutableRecord):
            s.flush()


# ------------------------------------------------------------------ enrolment
def test_enrolment_happy_path(client, as_role):
    h = as_role("programme_admin")
    farmer, _, field = ready_field(client, h)
    programme, project = mk_project(client, h, boundary=geo.square(LAT, LON, 50_000), eligible_crops=["coffee"])
    e = enrol(client, h, project["id"], field["id"])
    assert e["status"] == "eligible", e["eligibility"]
    assert set(checks_of(e)) == {"inside_programme_boundary", "crop_eligible", "land_use_history",
                                 "not_double_enrolled", "farmer_consent", "no_native_clearing", "land_cover",
                                 "not_wetland", "lookback_activity_records", "land_tenure"}
    lookback = checks_of(e)["lookback_activity_records"]
    assert lookback["severity"] == "warning" and lookback["passed"] and lookback["details"]["missing_years"]
    assert e["farmer_id"] == farmer["id"] and e["field_code"] == field["code"]
    c = client.post(f"/api/projects/{project['id']}/enrolments/{e['id']}/confirm", headers=h)
    assert c.status_code == 200, c.text
    assert c.json()["status"] == "enrolled" and c.json()["enrolled_on"] == date.today().isoformat()
    with dbmod.session_factory()() as s:
        events = s.query(DomainEvent).filter_by(event="farmer.enrolled").all()
        assert len(events) == 1 and events[0].entity_id == e["id"]
    s = client.get(f"/api/programmes/{programme['id']}/summary", headers=h).json()
    assert s["farmers_enrolled"] == 1 and s["fields_enrolled"] == 1
    assert s["hectares_enrolled"] == pytest.approx(1.0, rel=0.01)
    listed = client.get(f"/api/projects/{project['id']}/enrolments", headers=h).json()
    assert [x["status"] for x in listed] == ["enrolled"]
    again = client.post(f"/api/projects/{project['id']}/enrolments", headers=h, json={"field_id": field["id"]})
    assert again.status_code == 409 and again.json()["code"] == "ALREADY_ENROLLED"
    fc = client.get(f"/api/fields/geojson?project_id={project['id']}", headers=h).json()
    assert fc["features"][0]["properties"]["enrolment_status"] == "enrolled"
    assert client.get(f"/api/fields?project_id={project['id']}", headers=h).json()["total"] == 1


def test_outside_programme_boundary(client, as_role):
    h = as_role("programme_admin")
    _, _, field = ready_field(client, h)
    _, project = mk_project(client, h, boundary=geo.square(20.0, 78.0, 10_000))
    e = enrol(client, h, project["id"], field["id"])
    assert e["status"] == "ineligible" and not checks_of(e)["inside_programme_boundary"]["passed"]


def test_crop_not_eligible(client, as_role):
    h = as_role("programme_admin")
    _, _, field = ready_field(client, h)
    _, project = mk_project(client, h, eligible_crops=["rice", "wheat"])
    e = enrol(client, h, project["id"], field["id"])
    assert e["status"] == "ineligible" and not checks_of(e)["crop_eligible"]["passed"]
    assert checks_of(e)["inside_programme_boundary"]["passed"]  # no boundary = anywhere


def test_missing_land_use_history(client, as_role):
    h = as_role("programme_admin")
    farmer, farm = farm_for(client, h)
    field = mk_field(client, h, farm["id"])
    add_history(client, h, field["id"], YEAR - 5, YEAR - 1)
    consent(client, h, farmer["id"])
    _, project = mk_project(client, h)
    e = enrol(client, h, project["id"], field["id"])
    check = checks_of(e)["land_use_history"]
    assert e["status"] == "ineligible" and not check["passed"] and len(check["details"]["missing_years"]) == 5


def test_lookback_years_from_programme_terms(client, as_role):
    h = as_role("programme_admin")
    farmer, farm = farm_for(client, h)
    field = mk_field(client, h, farm["id"])
    add_history(client, h, field["id"], YEAR - 5, YEAR - 1)
    consent(client, h, farmer["id"])
    grant_tenure(field["id"])
    _, project = mk_project(client, h, commercial_terms={"lookback_years": 5})
    e = enrol(client, h, project["id"], field["id"])
    assert e["status"] == "eligible" and checks_of(e)["land_use_history"]["details"]["lookback_years"] == 5


def test_forest_conversion_is_ineligible(client, as_role):
    h = as_role("programme_admin")
    farmer, farm = farm_for(client, h)
    field = mk_field(client, h, farm["id"])
    add_history(client, h, field["id"], YEAR - 10, YEAR - 4, use="forest")
    add_history(client, h, field["id"], YEAR - 3, YEAR - 1)
    consent(client, h, farmer["id"])
    _, project = mk_project(client, h)
    e = enrol(client, h, project["id"], field["id"])
    assert e["status"] == "ineligible" and "forest" in checks_of(e)["land_use_history"]["message"]


def test_missing_consent_is_ineligible(client, as_role):
    h = as_role("programme_admin")
    farmer, farm = farm_for(client, h)
    field = mk_field(client, h, farm["id"])
    add_history(client, h, field["id"])
    consent(client, h, farmer["id"], purposes=("sampling",))
    grant_tenure(field["id"])
    _, project = mk_project(client, h)
    e = enrol(client, h, project["id"], field["id"])
    assert e["status"] == "ineligible" and checks_of(e)["farmer_consent"]["details"]["missing"] == ["data_use"]
    # grant the missing consent and re-check the same enrolment
    consent(client, h, farmer["id"], purposes=("data_use",))
    again = enrol(client, h, project["id"], field["id"])
    assert again["id"] == e["id"] and again["status"] == "eligible"


def test_double_enrolment_for_overlapping_period(client, as_role):
    h = as_role("programme_admin")
    _, _, field = ready_field(client, h)
    programme, a = mk_project(client, h, code="PA", start="2025-01-01", end="2029-12-31")
    _, b = mk_project(client, h, code="PB", programme=programme, start="2028-01-01", end="2032-12-31")
    _, c = mk_project(client, h, code="PC", programme=programme, start="2030-01-01", end="2034-12-31")
    ea = enrol(client, h, a["id"], field["id"])
    client.post(f"/api/projects/{a['id']}/enrolments/{ea['id']}/confirm", headers=h)
    eb = enrol(client, h, b["id"], field["id"])
    assert eb["status"] == "ineligible" and checks_of(eb)["not_double_enrolled"]["details"]["projects"] == ["PA"]
    assert enrol(client, h, c["id"], field["id"])["status"] == "eligible"


def test_confirm_rules(client, as_role):
    h = as_role("programme_admin")
    farmer, _, field = ready_field(client, h)
    _, bad_project = mk_project(client, h, code="BAD", eligible_crops=["rice"])
    bad = enrol(client, h, bad_project["id"], field["id"])
    r = client.post(f"/api/projects/{bad_project['id']}/enrolments/{bad['id']}/confirm", headers=h)
    assert r.status_code == 409 and r.json()["code"] == "ILLEGAL_STATE_TRANSITION"

    _, project = mk_project(client, h, code="GOOD")
    e = enrol(client, h, project["id"], field["id"])
    consent(client, h, farmer["id"], purposes=("data_use",), granted=False)  # withdrawn after the check
    r = client.post(f"/api/projects/{project['id']}/enrolments/{e['id']}/confirm", headers=h)
    assert r.status_code == 409 and r.json()["code"] == "NO_LONGER_ELIGIBLE"
    # enrolment id under the wrong project is not found
    assert client.post(f"/api/projects/{bad_project['id']}/enrolments/{e['id']}/confirm", headers=h).status_code == 404


def test_withdraw_and_re_enrol(client, as_role):
    h = as_role("programme_admin")
    _, _, field = ready_field(client, h)
    _, project = mk_project(client, h)
    e = enrol(client, h, project["id"], field["id"])
    client.post(f"/api/projects/{project['id']}/enrolments/{e['id']}/confirm", headers=h)
    blocked = client.patch(f"/api/fields/{field['id']}", headers=h, json={"status": "retired"})
    assert blocked.status_code == 409 and blocked.json()["code"] == "BLOCKED"
    url = f"/api/projects/{project['id']}/enrolments/{e['id']}/withdraw"
    assert client.post(url, headers=h, json={"reason": "no"}).status_code == 422
    w = client.post(url, headers=h, json={"reason": "Farmer sold the land"})
    assert w.status_code == 200 and w.json()["status"] == "withdrawn" and w.json()["withdrawn_on"]
    assert w.json()["eligibility"]["withdrawal"]["reason"] == "Farmer sold the land"
    assert client.post(url, headers=h, json={"reason": "Twice over"}).status_code == 409
    assert any(a["action"] == "enrolment.withdraw" and a["reason"] == "Farmer sold the land"
               for a in client.get("/api/audit", headers=h).json())
    back = enrol(client, h, project["id"], field["id"])
    assert back["id"] == e["id"] and back["status"] == "eligible" and back["withdrawn_on"] is None


def test_retired_field_and_closed_project_cannot_enrol(client, as_role):
    h = as_role("programme_admin")
    _, _, field = ready_field(client, h)
    programme, project = mk_project(client, h)
    client.patch(f"/api/fields/{field['id']}", headers=h, json={"status": "retired"})
    r = client.post(f"/api/projects/{project['id']}/enrolments", headers=h, json={"field_id": field["id"]})
    assert r.status_code == 422
    client.patch(f"/api/fields/{field['id']}", headers=h, json={"status": "active"})
    client.post(f"/api/programmes/{programme['id']}/status", headers=h, json={"status": "active"})
    for s in ("active", "closed"):
        client.post(f"/api/projects/{project['id']}/status", headers=h, json={"status": s})
    r = client.post(f"/api/projects/{project['id']}/enrolments", headers=h, json={"field_id": field["id"]})
    assert r.status_code == 409 and r.json()["code"] == "BLOCKED"


# ------------------------------------------------------------------ permissions & isolation
def test_land_permissions(client, as_role):
    admin = as_role("programme_admin")
    _, farm = farm_for(client, admin)
    collector = as_role("field_collector")
    f = mk_field(client, collector, farm["id"])  # collectors map fields
    assert client.get(f"/api/fields/{f['id']}", headers=collector).status_code == 200
    add_history(client, collector, f["id"])
    analyst = as_role("mrv_analyst")
    assert client.get("/api/fields", headers=analyst).status_code == 200
    r = client.post("/api/fields", headers=analyst, json={"farm_id": farm["id"], "name": "X",
                                                          "boundary": geo.square(LAT, east(3), SIDE)})
    assert r.status_code == 403
    assert client.get("/api/fields", headers=as_role("farmer")).status_code == 403
    _, project = mk_project(client, admin)
    assert client.post(f"/api/projects/{project['id']}/enrolments", headers=analyst,
                       json={"field_id": f["id"]}).status_code == 403


def test_land_tenant_isolation(client, as_role):
    h = as_role("programme_admin")
    _, farm, field = ready_field(client, h)
    _, project = mk_project(client, h)
    other = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/fields/{field['id']}", headers=other).status_code == 404
    assert client.get(f"/api/farms/{farm['id']}", headers=other).status_code == 404
    assert client.get(f"/api/fields/{field['id']}/history", headers=other).status_code == 404
    assert client.get(f"/api/fields/{field['id']}/land-use", headers=other).status_code == 404
    assert client.patch(f"/api/fields/{field['id']}", headers=other, json={"name": "Hijack"}).status_code == 404
    assert client.post("/api/fields", headers=other, json={"farm_id": farm["id"], "name": "X",
                                                           "boundary": geo.square(0, 0, SIDE)}).status_code == 404
    assert client.get("/api/fields/geojson", headers=other).json()["features"] == []
    _, their_project = mk_project(client, other)
    r = client.post(f"/api/projects/{their_project['id']}/enrolments", headers=other, json={"field_id": field["id"]})
    assert r.status_code == 404
    assert client.get(f"/api/projects/{project['id']}/enrolments", headers=other).status_code == 404


# ------------------------------------------------------------------ VM0042 §4 applicability (pure)
from app.modules.land.domain import (  # noqa: E402
    land_cover_checks, native_clearing_check, slope_class, uncovered_periods,
)


@pytest.mark.parametrize("pct,cls", [(0, "nearly_level"), (3, "nearly_level"), (3.5, "gently_sloping"),
                                     (4, "gently_sloping"), (8, "gently_sloping"), (9, "strongly_sloping"),
                                     (16, "strongly_sloping"), (17, "moderately_steep"), (30, "moderately_steep"),
                                     (31, "steep"), (45, "steep"), (46, "very_steep"), (None, None)])
def test_slope_classes_appendix5_table10(pct, cls):
    assert slope_class(pct) == cls


def test_native_clearing_within_10_years_fails():
    c = native_clearing_check([_span(2000, 2017, "forest"), _span(2018, 2025, "cropland")], 2025)
    assert not c.passed and c.details["conversions"] == [{"year": 2018, "from": "forest", "to": "cropland"}]
    assert "2018" in c.message


def test_native_clearing_before_window_passes():
    assert native_clearing_check([_span(1990, 2013, "forest"), _span(2014, 2025, "cropland")], 2025).passed


def test_native_grassland_to_cropland_is_clearing_but_managed_grassland_is_not():
    assert not native_clearing_check([_span(2000, 2019, "native_grassland"), _span(2020, 2025, "cropland")],
                                     2025).passed
    assert native_clearing_check([_span(2000, 2019, "grassland"), _span(2020, 2025, "cropland")], 2025).passed
    # grazing native grassland is not a clearing
    assert native_clearing_check([_span(2000, 2019, "native_grassland"), _span(2020, 2025, "grassland")],
                                 2025).passed


def test_land_cover_rules():
    ok = {c.code: c.passed for c in land_cover_checks("cropland", "coffee", {}, False)}
    assert ok == {"land_cover": True, "not_wetland": True}
    assert all(c.passed for c in land_cover_checks("grassland", None, {}, False))
    other = {c.code: c.passed for c in land_cover_checks("other", None, {}, False)}
    assert other["land_cover"] is False
    wet = {c.code: c.passed for c in land_cover_checks("wetland", "coffee", {}, True)}
    assert wet == {"land_cover": False, "not_wetland": False}
    rice_no_ev = {c.code: c.passed for c in land_cover_checks("wetland", "rice", {"water_regime": "continuous"},
                                                              False)}
    assert rice_no_ev["not_wetland"] is False
    assert all(c.passed for c in land_cover_checks("wetland", "rice", {"water_regime": "awd"}, True))
    assert not all(c.passed for c in land_cover_checks("wetland", "rice", {"water_regime": "rainfed"}, True))


def test_uncovered_periods():
    d = date
    assert uncovered_periods([(d(2020, 1, 1), None)], d(2025, 1, 1), d(2034, 12, 31)) == []
    assert uncovered_periods([], d(2025, 1, 1), d(2025, 12, 31)) == [(d(2025, 1, 1), d(2025, 12, 31))]
    gaps = uncovered_periods([(d(2025, 1, 1), d(2027, 12, 31)), (d(2029, 1, 1), d(2040, 1, 1))],
                             d(2025, 1, 1), d(2034, 12, 31))
    assert gaps == [(d(2028, 1, 1), d(2028, 12, 31))]
    assert uncovered_periods([(d(2026, 1, 1), None)], d(2025, 1, 1), d(2030, 1, 1)) == [
        (d(2025, 1, 1), d(2025, 12, 31))]
    assert uncovered_periods([(d(2020, 1, 1), d(2030, 6, 30)), (d(2030, 7, 1), None)],
                             d(2025, 1, 1), d(2034, 12, 31)) == []


# ------------------------------------------------------------------ Table 7 attributes on fields
def test_field_site_attributes_and_slope_class(client, as_role):
    h = as_role("programme_admin")
    _, farm = farm_for(client, h)
    f = mk_field(client, h, farm["id"])
    assert f["slope_class"] is None and f["land_cover"] == "cropland"
    r = client.patch(f"/api/fields/{f['id']}", headers=h, json={
        "slope_pct": 22.5, "aspect_deg": 135, "soil_texture_class": "Sandy Clay Loam", "wrb_soil_group": "nitisol",
        "ecoregion": "South Western Ghats moist deciduous forests", "climate_zone": "Tropical Moist",
        "mean_annual_precip_mm": 1850, "land_cover": "grassland"})
    assert r.status_code == 200, r.text
    b = r.json()
    assert b["slope_class"] == "moderately_steep" and b["soil_texture_class"] == "sandy_clay_loam"
    assert b["wrb_soil_group"] == "Nitisols" and b["climate_zone"] == "tropical_moist"
    assert b["land_cover"] == "grassland" and b["mean_annual_precip_mm"] == 1850
    assert client.get(f"/api/fields/{f['id']}", headers=h).json()["slope_class"] == "moderately_steep"
    for bad in ({"slope_pct": -1}, {"aspect_deg": 360}, {"soil_texture_class": "gravel"},
                {"wrb_soil_group": "Moonsols"}, {"climate_zone": "martian"}, {"mean_annual_precip_mm": -5},
                {"land_cover": "forest"}):
        assert client.patch(f"/api/fields/{f['id']}", headers=h, json=bad).status_code == 422, bad
    cleared = client.patch(f"/api/fields/{f['id']}", headers=h, json={"slope_pct": None}).json()
    assert cleared["slope_pct"] is None and cleared["slope_class"] is None
    created = mk_field(client, h, farm["id"], lon=east(3), slope_pct=2, land_cover="grassland")
    assert created["slope_class"] == "nearly_level" and created["land_cover"] == "grassland"


# ------------------------------------------------------------------ land tenure
def _doc(client, h, name="deed.pdf", kind="document", **data):
    r = client.post("/api/evidence", headers=h,
                    files={"file": (name, b"%PDF-1.4 " + name.encode(), "application/pdf")},
                    data={"kind": kind, **data})
    assert r.status_code == 201, r.text
    return r.json()


def test_tenure_create_verify_four_eyes(client, as_role):
    h = as_role("programme_admin")
    farmer, farm = farm_for(client, h)
    f = mk_field(client, h, farm["id"])
    doc = _doc(client, h)
    url = f"/api/fields/{f['id']}/tenure"

    def post(**kw):
        body = {"holder_farmer_id": farmer["id"], "kind": "owned", "document_evidence_ids": [doc["id"]],
                "valid_from": "2010-01-01", **kw}
        return client.post(url, headers=h, json=body)

    assert post(document_evidence_ids=[]).status_code == 422
    assert post(kind="other").status_code == 422  # 'other' needs notes
    assert post(kind="leased", valid_from="2030-01-01", valid_to="2020-01-01").status_code == 422
    assert post(document_evidence_ids=[str(uuid.uuid4())]).status_code == 404
    r = post()
    assert r.status_code == 201, r.text
    t = r.json()
    assert t["status"] == "pending" and t["document_evidence_ids"] == [doc["id"]]
    own = client.post(f"/api/tenure/{t['id']}/verify", headers=h, json={"decision": "verified"})
    assert own.status_code == 403 and own.json()["code"] == "SELF_APPROVAL_REJECTED"
    collector = as_role("field_collector")
    assert client.post(f"/api/tenure/{t['id']}/verify", headers=collector,
                       json={"decision": "verified"}).status_code == 403
    other = as_role("programme_admin", fresh=True)
    assert client.post(f"/api/tenure/{t['id']}/verify", headers=other,
                       json={"decision": "rejected"}).status_code == 422  # rejection needs a note
    ok = client.post(f"/api/tenure/{t['id']}/verify", headers=other, json={"decision": "verified", "note": "Deed seen"})
    assert ok.status_code == 200 and ok.json()["status"] == "verified" and ok.json()["verified_by"]
    assert client.post(f"/api/tenure/{t['id']}/verify", headers=other, json={"decision": "verified"}).status_code == 409
    assert [x["id"] for x in client.get(url, headers=collector).json()] == [t["id"]]
    assert any(a["action"] == "land_tenure.verified" for a in client.get("/api/audit", headers=h).json())


def test_enrolment_requires_verified_tenure_covering_period(client, as_role):
    h = as_role("programme_admin")
    farmer, farm = farm_for(client, h)
    f = mk_field(client, h, farm["id"])
    add_history(client, h, f["id"])
    consent(client, h, farmer["id"])
    _, project = mk_project(client, h, start="2025-01-01", end="2034-12-31")
    e = enrol(client, h, project["id"], f["id"])
    c = checks_of(e)["land_tenure"]
    assert e["status"] == "ineligible" and not c["passed"] and "No verified land-tenure" in c["message"]
    grant_tenure(f["id"], status="pending")
    c = checks_of(enrol(client, h, project["id"], f["id"]))["land_tenure"]
    assert not c["passed"] and "waiting for verification" in c["message"]
    grant_tenure(f["id"], valid_from=date(2020, 1, 1), valid_to=date(2029, 12, 31))  # lease ends early
    c = checks_of(enrol(client, h, project["id"], f["id"]))["land_tenure"]
    assert not c["passed"] and "2030-01-01" in c["message"]
    assert c["details"]["gaps"] == [["2030-01-01", "2034-12-31"]]
    grant_tenure(f["id"], valid_from=date(2030, 1, 1), valid_to=None)  # renewal
    e = enrol(client, h, project["id"], f["id"])
    assert e["status"] == "eligible" and checks_of(e)["land_tenure"]["passed"]


def test_tenure_of_another_farmer_does_not_count(client, as_role):
    h = as_role("programme_admin")
    farmer, farm = farm_for(client, h)
    f = mk_field(client, h, farm["id"])
    add_history(client, h, f["id"])
    consent(client, h, farmer["id"])
    other = mk_farmer(client, h, phone="9812345679", name="Landlord")
    with dbmod.session_factory()() as s:
        fld = s.get(Field, uuid.UUID(f["id"]))
        s.add(LandTenure(org_id=fld.org_id, field_id=fld.id, holder_farmer_id=uuid.UUID(other["id"]), kind="owned",
                         document_evidence_ids=[], valid_from=date(2000, 1, 1), status="verified"))
        s.commit()
    _, project = mk_project(client, h)
    assert enrol(client, h, project["id"], f["id"])["status"] == "ineligible"


def test_project_without_crediting_period_fails_tenure(client, as_role):
    h = as_role("programme_admin")
    _, _, f = ready_field(client, h)
    prog = client.post("/api/programmes", headers=h, json={"code": "PG-X", "name": "Programme"}).json()
    project = client.post("/api/projects", headers=h, json={"programme_id": prog["id"], "code": "NODATE",
                                                             "name": "Project"}).json()
    c = checks_of(enrol(client, h, project["id"], f["id"]))["land_tenure"]
    assert not c["passed"] and "crediting period" in c["message"]


def test_tenure_tenant_isolation(client, as_role):
    h = as_role("programme_admin")
    farmer, farm = farm_for(client, h)
    f = mk_field(client, h, farm["id"])
    t = client.post(f"/api/fields/{f['id']}/tenure", headers=h, json={
        "holder_farmer_id": farmer["id"], "kind": "owned", "document_evidence_ids": [_doc(client, h)["id"]],
        "valid_from": "2010-01-01"}).json()
    rival = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/fields/{f['id']}/tenure", headers=rival).status_code == 404
    assert client.post(f"/api/tenure/{t['id']}/verify", headers=rival, json={"decision": "verified"}).status_code == 404
    _, rival_farm = farm_for(client, rival, phone="9812345677")
    rf = mk_field(client, rival, rival_farm["id"])
    assert client.post(f"/api/fields/{rf['id']}/tenure", headers=rival, json={
        "holder_farmer_id": farmer["id"], "kind": "owned", "document_evidence_ids": [_doc(client, rival)["id"]],
        "valid_from": "2010-01-01"}).status_code == 404


# ------------------------------------------------------------------ applicability through enrolment
def test_native_clearing_blocks_enrolment(client, as_role):
    h = as_role("programme_admin")
    farmer, farm = farm_for(client, h)
    f = mk_field(client, h, farm["id"])
    add_history(client, h, f["id"], 1990, 2019, use="native_grassland")
    add_history(client, h, f["id"], 2020, YEAR - 1, use="cropland")
    consent(client, h, farmer["id"])
    grant_tenure(f["id"])
    _, project = mk_project(client, h, commercial_terms={"lookback_years": 3})
    e = enrol(client, h, project["id"], f["id"])
    c = checks_of(e)["no_native_clearing"]
    assert e["status"] == "ineligible" and not c["passed"] and c["details"]["conversions"][0]["year"] == 2020
    assert checks_of(e)["land_use_history"]["passed"]  # the older rule alone would have let it through


def test_wetland_rice_needs_hydrology_evidence(client, as_role):
    h = as_role("programme_admin")
    _, _, f = ready_field(client, h, crop="rice", attrs={"water_regime": "continuous"})
    assert client.patch(f"/api/fields/{f['id']}", headers=h, json={"land_cover": "wetland"}).status_code == 200
    _, project = mk_project(client, h)
    e = enrol(client, h, project["id"], f["id"])
    assert e["status"] == "ineligible" and "no_wetland_hydrology_impact" in checks_of(e)["not_wetland"]["message"]
    _doc(client, h, "hydrology.pdf", kind="no_wetland_hydrology_impact", entity_type="field", entity_id=f["id"])
    e = enrol(client, h, project["id"], f["id"])
    assert e["status"] == "eligible", e["eligibility"]


def test_non_farmland_cover_is_ineligible(client, as_role):
    h = as_role("programme_admin")
    _, _, f = ready_field(client, h)
    client.patch(f"/api/fields/{f['id']}", headers=h, json={"land_cover": "other"})
    _, project = mk_project(client, h)
    e = enrol(client, h, project["id"], f["id"])
    assert e["status"] == "ineligible" and not checks_of(e)["land_cover"]["passed"]
