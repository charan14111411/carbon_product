from datetime import date, timedelta

import pytest

from app.core import db as dbmod
from app.core.errors import ImmutableRecord
from app.modules.partners.models import DomainEvent
from app.modules.practices.models import PracticeRecord
from tests.conftest import login, make_org, make_user
from tests.test_land import east, farm_for, mk_field, mk_project, ready_field

TODAY = date.today()


@pytest.fixture()
def world(client, as_role):
    h = as_role("programme_admin")
    farmer, farm = farm_for(client, h)
    field = mk_field(client, h, farm["id"])  # coffee, 1 ha
    return {"h": h, "farmer": farmer, "farm": farm, "field": field}


def body(field_id, **kw):
    return {"field_id": field_id, "practice_code": "compost", "scenario": "project",
            "performed_on": (TODAY - timedelta(days=30)).isoformat(), "quantity": 2.5, **kw}


def post(client, h, payload, headers=None):
    return client.post("/api/practices", headers={**h, **(headers or {})}, json=payload)


def upload(client, h):
    r = client.post("/api/evidence", headers=h, files={"file": ("pile.jpg", b"\xff\xd8compost", "image/jpeg")},
                    data={"kind": "photo"})
    assert r.status_code == 201
    return r.json()["id"]


# ------------------------------------------------------------------ create
def test_record_practice(client, world):
    h, f = world["h"], world["field"]
    r = post(client, h, body(f["id"], extra={"source": "own pit"}))
    assert r.status_code == 201, r.text
    p = r.json()
    assert p["version"] == 1 and p["record_id"] and p["unit"] == "t" and p["status"] == "active"
    assert p["details"] == {"source": "own pit"} and p["data_class"] == "RECORDED"
    assert p["missing_evidence"] is True  # compost needs a photo
    with dbmod.session_factory()() as s:
        assert s.query(DomainEvent).filter_by(event="practice.recorded").count() == 1
    assert any(a["action"] == "practice.record" for a in client.get("/api/audit", headers=h).json())


def test_evidence_clears_missing_flag(client, world):
    h, f = world["h"], world["field"]
    ev = upload(client, h)
    p = post(client, h, body(f["id"], evidence_ids=[ev])).json()
    assert p["missing_evidence"] is False and p["evidence_ids"] == [ev]
    bogus = post(client, h, body(f["id"], evidence_ids=["not-a-uuid"]))
    assert bogus.status_code == 422
    other = login(client, make_user(make_org("Rival"), "programme_admin"))
    theirs = upload(client, other)
    assert post(client, h, body(f["id"], evidence_ids=[theirs])).status_code == 422


def test_practice_without_evidence_requirement_never_flagged(client, world):
    p = post(client, world["h"], body(world["field"]["id"], practice_code="reduced_tillage", quantity=None)).json()
    assert p["missing_evidence"] is False and p["unit"] is None


def test_scenario_is_required(client, world):
    payload = body(world["field"]["id"])
    del payload["scenario"]
    assert post(client, world["h"], payload).status_code == 422
    assert post(client, world["h"], body(world["field"]["id"], scenario="maybe")).status_code == 422
    assert post(client, world["h"], body(world["field"]["id"], scenario="baseline")).status_code == 201


def test_dates_validated(client, world):
    h, fid = world["h"], world["field"]["id"]
    future = post(client, h, body(fid, performed_on=(TODAY + timedelta(days=1)).isoformat()))
    assert future.status_code == 422 and "future" in future.json()["message"]
    backwards = post(client, h, body(fid, ended_on=(TODAY - timedelta(days=60)).isoformat()))
    assert backwards.status_code == 422
    assert post(client, h, body(fid, performed_on=TODAY.isoformat(), ended_on=TODAY.isoformat())).status_code == 201


def test_quantity_rules(client, world):
    h, fid = world["h"], world["field"]["id"]
    assert post(client, h, body(fid, quantity=None)).json()["code"] == "INVALID_PRACTICE"
    neg = post(client, h, body(fid, quantity=-1))
    assert neg.status_code == 422 and "negative" in neg.json()["message"]
    assert post(client, h, body(fid, unit="kg")).status_code == 422
    assert post(client, h, body(fid, unit="t", quantity=0)).status_code == 201


def test_extra_fields_validated(client, world):
    h, fid = world["h"], world["field"]["id"]
    synth = dict(practice_code="synthetic_fertiliser", quantity=50)
    missing = post(client, h, body(fid, **synth))
    assert missing.status_code == 422 and missing.json()["code"] == "INVALID_ATTRIBUTES"
    too_high = post(client, h, body(fid, **synth, extra={"product": "Urea", "n_content_pct": 146}))
    assert too_high.status_code == 422
    unknown = post(client, h, body(fid, **synth, extra={"product": "Urea", "n_content_pct": 46, "colour": "white"}))
    assert unknown.status_code == 422
    reserved = post(client, h, body(fid, extra={"client_ref": "x"}))
    assert reserved.status_code == 422
    ok = post(client, h, body(fid, **synth, extra={"product": "Urea", "n_content_pct": 46}))
    assert ok.status_code == 201 and ok.json()["unit"] == "kg"


def test_practice_type_and_crop_rules(client, world):
    h, fid = world["h"], world["field"]["id"]
    assert post(client, h, body(fid, practice_code="moonwater")).status_code == 422
    awd = post(client, h, body(fid, practice_code="awd_irrigation", quantity=None))
    assert awd.status_code == 422 and "rice" in awd.json()["message"]
    rice = mk_field(client, h, world["farm"]["id"], lon=east(2), crop="rice", attrs={"water_regime": "awd"})
    assert post(client, h, body(rice["id"], practice_code="awd_irrigation", quantity=None)).status_code == 201
    pt = next(p for p in client.get("/api/catalogue/practice-types", headers=h).json() if p["code"] == "mulching")
    client.patch(f"/api/catalogue/practice-types/{pt['id']}", headers=h, json={"is_active": False})
    assert post(client, h, body(fid, practice_code="mulching", quantity=None)).status_code == 422


def test_area_cannot_exceed_field(client, world):
    h, fid = world["h"], world["field"]["id"]
    assert post(client, h, body(fid, area_ha=5)).status_code == 422
    assert post(client, h, body(fid, area_ha=0)).status_code == 422
    assert post(client, h, body(fid, area_ha=0.5)).status_code == 201


def test_retired_field_rejects_new_records(client, world):
    h, fid = world["h"], world["field"]["id"]
    client.patch(f"/api/fields/{fid}", headers=h, json={"status": "retired"})
    assert post(client, h, body(fid)).status_code == 422


# ------------------------------------------------------------------ idempotency
def test_idempotency_key_header(client, world):
    h, fid = world["h"], world["field"]["id"]
    first = post(client, h, body(fid), headers={"Idempotency-Key": "phone-42-001"})
    second = post(client, h, body(fid), headers={"Idempotency-Key": "phone-42-001"})
    assert first.status_code == 201 and second.status_code == 200
    assert first.json()["record_id"] == second.json()["record_id"]
    assert first.json()["details"]["client_ref"] == "phone-42-001"
    with dbmod.session_factory()() as s:
        assert s.query(PracticeRecord).count() == 1
        assert s.query(DomainEvent).filter_by(event="practice.recorded").count() == 1


def test_idempotency_client_ref_in_body(client, world):
    h, fid = world["h"], world["field"]["id"]
    a = post(client, h, body(fid, client_ref="offline-7"))
    b = post(client, h, body(fid, client_ref="offline-7"))
    c = post(client, h, body(fid, client_ref="offline-8"))
    assert (a.status_code, b.status_code, c.status_code) == (201, 200, 201)
    assert a.json()["id"] == b.json()["id"] != c.json()["id"]
    mismatch = post(client, h, body(fid, client_ref="x1"), headers={"Idempotency-Key": "x2"})
    assert mismatch.status_code == 422


def test_idempotency_is_per_org(client, world):
    post(client, world["h"], body(world["field"]["id"], client_ref="shared-ref"))
    other = login(client, make_user(make_org("Rival"), "programme_admin"))
    _, farm = farm_for(client, other, phone="9812345674")
    theirs = mk_field(client, other, farm["id"])
    r = post(client, other, body(theirs["id"], client_ref="shared-ref"))
    assert r.status_code == 201 and r.json()["field_id"] == theirs["id"]


# ------------------------------------------------------------------ versions & void
def test_correction_creates_new_version(client, world):
    h, fid = world["h"], world["field"]["id"]
    p = post(client, h, body(fid, client_ref="c-1")).json()
    url = f"/api/practices/{p['record_id']}/versions"
    assert client.post(url, headers=h, json={"quantity": 3.0, "reason": "typo"}).status_code == 422
    assert client.post(url, headers=h, json={"quantity": 2.5, "reason": "No real change"}).status_code == 422
    bad = client.post(url, headers=h, json={"quantity": -3, "reason": "Negative now"})
    assert bad.status_code == 422
    v2 = client.post(url, headers=h, json={"quantity": 3.0, "reason": "Weighed again at the pit"})
    assert v2.status_code == 201, v2.text
    assert v2.json()["version"] == 2 and v2.json()["quantity"] == 3.0 and v2.json()["reason"] == "Weighed again at the pit"
    assert v2.json()["details"]["client_ref"] == "c-1"
    versions = client.get(url, headers=h).json()
    assert [v["version"] for v in versions] == [2, 1] and versions[1]["quantity"] == 2.5
    listed = client.get("/api/practices", headers=h).json()
    assert listed["total"] == 1 and listed["items"][0]["version"] == 2
    assert client.get(f"/api/practices/{p['record_id']}", headers=h).json()["version"] == 2
    # a replay of the original submission returns the latest version, not a new record
    replay = post(client, h, body(fid, client_ref="c-1"))
    assert replay.status_code == 200 and replay.json()["version"] == 2


def test_void(client, world):
    h, fid = world["h"], world["field"]["id"]
    p = post(client, h, body(fid)).json()
    url = f"/api/practices/{p['record_id']}/void"
    assert client.post(url, headers=h, json={"reason": "no"}).status_code == 422
    v = client.post(url, headers=h, json={"reason": "Recorded on the wrong field"})
    assert v.status_code == 201 and v.json()["status"] == "voided" and v.json()["version"] == 2
    assert client.get("/api/practices", headers=h).json()["total"] == 0
    assert client.get("/api/practices?include_voided=true", headers=h).json()["total"] == 1
    assert client.post(url, headers=h, json={"reason": "Again please"}).status_code == 409
    fix = client.post(f"/api/practices/{p['record_id']}/versions", headers=h, json={"quantity": 1, "reason": "Fix it"})
    assert fix.status_code == 409


def test_practice_records_are_append_only(client, world):
    post(client, world["h"], body(world["field"]["id"]))
    with dbmod.session_factory()() as s:
        rec = s.query(PracticeRecord).first()
        rec.quantity = 99
        with pytest.raises(ImmutableRecord):
            s.flush()
        s.rollback()
        s.delete(s.query(PracticeRecord).first())
        with pytest.raises(ImmutableRecord):
            s.flush()


# ------------------------------------------------------------------ list filters
def test_list_filters(client, as_role):
    h = as_role("programme_admin")
    farmer, farm, field = ready_field(client, h)
    other_farmer = client.post("/api/farmers", headers=h, json={"full_name": "Other Farmer", "phone": "9812345672"}).json()
    farm2 = client.post("/api/farms", headers=h, json={"farmer_id": other_farmer["id"], "name": "Other"}).json()
    field2 = mk_field(client, h, farm2["id"], lon=east(3))
    old = (TODAY - timedelta(days=400)).isoformat()
    post(client, h, body(field["id"], scenario="baseline", performed_on=old))
    post(client, h, body(field["id"], practice_code="zero_tillage", quantity=None))
    post(client, h, body(field2["id"]))
    _, project = mk_project(client, h)
    e = client.post(f"/api/projects/{project['id']}/enrolments", headers=h, json={"field_id": field["id"]}).json()
    client.post(f"/api/projects/{project['id']}/enrolments/{e['id']}/confirm", headers=h)

    def total(qs):
        r = client.get(f"/api/practices?{qs}", headers=h)
        assert r.status_code == 200, r.text
        return r.json()["total"]

    assert total("") == 3
    assert total(f"field_id={field['id']}") == 2
    assert total(f"farmer_id={farmer['id']}") == 2
    assert total(f"project_id={project['id']}") == 2
    assert total("scenario=baseline") == 1
    assert total("practice_code=zero_tillage") == 1
    assert total(f"date_from={(TODAY - timedelta(days=100)).isoformat()}") == 2
    assert total(f"date_to={(TODAY - timedelta(days=100)).isoformat()}") == 1
    assert len(client.get("/api/practices?limit=2", headers=h).json()["items"]) == 2


# ------------------------------------------------------------------ permissions & isolation
def test_practice_permissions(client, world, as_role):
    fid = world["field"]["id"]
    collector = as_role("field_collector")
    r = post(client, collector, body(fid))
    assert r.status_code == 201
    assert client.get("/api/practices", headers=collector).status_code == 200
    analyst = as_role("mrv_analyst")
    assert post(client, analyst, body(fid)).status_code == 403
    assert client.post(f"/api/practices/{r.json()['record_id']}/void", headers=analyst,
                       json={"reason": "Not allowed"}).status_code == 403
    assert client.get("/api/practices", headers=analyst).status_code == 200
    assert client.get("/api/practices", headers=as_role("farmer")).status_code == 403


def test_practice_tenant_isolation(client, world):
    h, fid = world["h"], world["field"]["id"]
    p = post(client, h, body(fid)).json()
    other = login(client, make_user(make_org("Rival"), "programme_admin"))
    rid = p["record_id"]
    assert client.get(f"/api/practices/{rid}", headers=other).status_code == 404
    assert client.get(f"/api/practices/{rid}/versions", headers=other).status_code == 404
    assert client.post(f"/api/practices/{rid}/versions", headers=other,
                       json={"quantity": 1, "reason": "Hijack attempt"}).status_code == 404
    assert client.post(f"/api/practices/{rid}/void", headers=other, json={"reason": "Hijack attempt"}).status_code == 404
    assert post(client, other, body(fid)).status_code == 404
    assert client.get("/api/practices", headers=other).json()["total"] == 0
    assert client.get("/api/practices/not-a-uuid", headers=h).status_code == 404
