import uuid
from datetime import date

from app.modules.catalogue.models import PracticeType
from app.modules.land.models import Field
from app.modules.practices.models import PracticeRecord
from tests import _p345_factories as fx
from tests.conftest import login, make_org, make_user

Y = date.today().year


def _world(org, n_farmers=1):
    w = fx.world(org, n_farmers=n_farmers)
    with fx.session() as s:
        fx.practice_type(s, org, "cover_crop")
        pt = fx.practice_type(s, org, "compost")
        pt.unit = "t"
        fx.practice_type(s, org, "no_till")
        s.commit()
    return w


def _body(w, i=0, **over):
    return {"project_id": str(w["project_id"]), "field_id": str(w["field_ids"][i]),
            "commitments": over.pop("commitments", [
                {"practice_code": "cover_crop", "start_year": Y - 2, "end_year": Y - 1},
                {"practice_code": "compost", "start_year": Y - 1, "end_year": Y - 1, "expected_quantity": 5},
                {"practice_code": "no_till", "start_year": Y + 1},
            ]), **over}


def _active_plan(client, as_role, w, i=0, **over):
    fc = as_role("field_collector")
    r = client.post("/api/intervention-plans", headers=fc, json=_body(w, i, **over))
    assert r.status_code == 201, r.text
    admin = as_role("programme_admin")
    a = client.post(f"/api/intervention-plans/{r.json()['id']}/agree", headers=admin,
                    json={"method": "assisted"})
    assert a.status_code == 200, a.text
    act = client.post(f"/api/intervention-plans/{r.json()['id']}/activate", headers=admin)
    assert act.status_code == 200, act.text
    return act.json()


def test_plan_validation_permissions_and_isolation(client, org, as_role):
    w = _world(org)
    h = as_role("programme_admin")
    bad = client.post("/api/intervention-plans", headers=h, json=_body(w, commitments=[
        {"practice_code": "magic", "start_year": Y}]))
    assert bad.status_code == 422 and bad.json()["code"] == "UNKNOWN_PRACTICE"
    overlap = client.post("/api/intervention-plans", headers=h, json=_body(w, commitments=[
        {"practice_code": "compost", "start_year": Y - 2, "end_year": Y},
        {"practice_code": "compost", "start_year": Y, "end_year": Y + 2}]))
    assert overlap.status_code == 422 and overlap.json()["code"] == "OVERLAPPING_COMMITMENTS"
    wrong_unit = client.post("/api/intervention-plans", headers=h, json=_body(w, commitments=[
        {"practice_code": "compost", "start_year": Y, "expected_quantity": 3, "unit": "kg"}]))
    assert wrong_unit.status_code == 422
    backwards = client.post("/api/intervention-plans", headers=h, json=_body(w, commitments=[
        {"practice_code": "compost", "start_year": Y, "end_year": Y - 1}]))
    assert backwards.status_code == 422
    other = fx.world(org)
    not_enrolled = client.post("/api/intervention-plans", headers=h, json={
        "project_id": str(w["project_id"]), "field_id": str(other["field_ids"][0]),
        "commitments": [{"practice_code": "compost", "start_year": Y}]})
    assert not_enrolled.status_code == 409 and not_enrolled.json()["code"] == "FIELD_NOT_ENROLLED"
    assert client.post("/api/intervention-plans", headers=as_role("mrv_analyst"), json=_body(w)).status_code == 403

    ok = client.post("/api/intervention-plans", headers=h, json=_body(w))
    assert ok.status_code == 201, ok.text
    plan = ok.json()
    assert plan["status"] == "draft" and plan["version"] == 1 and len(plan["commitments"]) == 3
    compost = next(c for c in plan["commitments"] if c["practice_code"] == "compost")
    assert compost["unit"] == "t"  # taken from the catalogue
    dup = client.post("/api/intervention-plans", headers=h, json=_body(w))
    assert dup.status_code == 409 and dup.json()["code"] == "PLAN_EXISTS"
    edited = client.patch(f"/api/intervention-plans/{plan['id']}", headers=h, json={"notes": "Starts after harvest"})
    assert edited.status_code == 200 and edited.json()["notes"] == "Starts after harvest"

    rival = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/intervention-plans/{plan['id']}", headers=rival).status_code == 404
    assert client.get("/api/intervention-plans", headers=rival).json() == []
    assert client.get(f"/api/projects/{w['project_id']}/interventions/compliance", headers=rival).status_code == 404
    actions = {a["action"] for a in client.get("/api/audit", headers=h).json()}
    assert {"intervention_plan.create", "intervention_plan.update"} <= actions


def test_agreement_otp_self_service_and_four_eyes(client, org, as_role):
    w = _world(org, n_farmers=2)
    f0, f1 = (str(x) for x in w["farmer_ids"])
    admin = as_role("programme_admin")
    plan = client.post("/api/intervention-plans", headers=admin, json=_body(w)).json()
    me = login(client, make_user(org, "farmer", scope={"farmer_id": f0}))
    other = login(client, make_user(org, "farmer", scope={"farmer_id": f1}))
    assert client.get(f"/api/intervention-plans/{plan['id']}", headers=other).status_code == 404
    assert client.post(f"/api/intervention-plans/{plan['id']}/agree", headers=other,
                       json={"method": "otp", "otp_code": "123456"}).status_code == 404
    wrong = client.post(f"/api/intervention-plans/{plan['id']}/agree", headers=me,
                        json={"method": "otp", "otp_code": "000000"})
    assert wrong.status_code == 422 and wrong.json()["code"] == "OTP_INVALID"
    assisted = client.post(f"/api/intervention-plans/{plan['id']}/agree", headers=me, json={"method": "assisted"})
    assert assisted.status_code == 422 and assisted.json()["code"] == "WITNESS_REQUIRED"
    early = client.post(f"/api/intervention-plans/{plan['id']}/activate", headers=admin)
    assert early.status_code == 409  # not agreed yet
    ok = client.post(f"/api/intervention-plans/{plan['id']}/agree", headers=me, json={"method": "otp", "otp_code": "123456"})
    assert ok.status_code == 200 and ok.json()["status"] == "agreed" and len(ok.json()["agreed_text_sha256"]) == 64
    frozen = client.patch(f"/api/intervention-plans/{plan['id']}", headers=admin, json={"notes": "late"})
    assert frozen.status_code == 409 and frozen.json()["code"] == "PLAN_FROZEN"
    own = client.post(f"/api/intervention-plans/{plan['id']}/activate", headers=admin)
    assert own.status_code == 403 and own.json()["code"] == "SELF_APPROVAL_REJECTED"
    other_admin = login(client, make_user(org, "programme_admin"))
    act = client.post(f"/api/intervention-plans/{plan['id']}/activate", headers=other_admin)
    assert act.status_code == 200 and act.json()["status"] == "active"
    mine = client.get(f"/api/farmers/{f0}/intervention-plans", headers=me)
    assert mine.status_code == 200 and [p["code"] for p in mine.json()] == [plan["code"]]
    assert client.get(f"/api/farmers/{f0}/intervention-plans", headers=other).status_code == 404
    assert client.post(f"/api/intervention-plans/{plan['id']}/withdraw", headers=other_admin,
                       json={"reason": ""}).json()["code"] == "REASON_REQUIRED"


def test_compliance_deviations_and_project_summary(client, org, as_role):
    w = _world(org, n_farmers=2)
    with fx.session() as s:
        f0 = s.get(Field, w["field_ids"][0])
        fx.practice(s, org, f0, "cover_crop", date(Y - 2, 11, 1))  # met
        fx.practice(s, org, f0, "cover_crop", date(Y - 1, 11, 1), scenario="baseline")  # doesn't count
        v1 = fx.practice(s, org, f0, "cover_crop", date(Y - 1, 10, 1))  # later voided
        s.add(PracticeRecord(org_id=org, record_id=v1.record_id, version=2, field_id=f0.id, practice_code="cover_crop",
                             scenario="project", performed_on=v1.performed_on, status="voided"))
        fx.practice(s, org, f0, "compost", date(Y - 1, 6, 1), quantity=3)  # 3 of 5 t
        s.commit()
    plan = _active_plan(client, as_role, w)
    h = as_role("programme_admin")
    comp = client.get(f"/api/intervention-plans/{plan['id']}/compliance", headers=h).json()
    by = {c["commitment"]["practice_code"]: c for c in comp["commitments"]}
    assert [y["status"] for y in by["cover_crop"]["years"]] == ["met", "not_met"]
    assert by["cover_crop"]["status"] == "partially"
    assert by["compost"]["status"] == "partially" and by["compost"]["years"][0]["recorded_quantity"] == 3
    assert by["no_till"]["status"] == "upcoming"
    assert comp["counts"] == {"partially": 2, "upcoming": 1}

    d = client.post(f"/api/intervention-plans/{plan['id']}/detect-deviations", headers=h).json()
    assert d["created"] == 2 and {x["kind"] for x in d["deviations"]} == {"missed", "partial"}
    assert client.post(f"/api/intervention-plans/{plan['id']}/detect-deviations", headers=h).json()["created"] == 0
    manual = client.post(f"/api/intervention-plans/{plan['id']}/deviations", headers=h,
                         json={"reason": "Heavy rain delayed sowing", "kind": "other"})
    assert manual.status_code == 201
    dev = d["deviations"][0]
    no_impact = client.post(f"/api/intervention-deviations/{dev['id']}/status", headers=h, json={"status": "closed"})
    assert no_impact.status_code == 422 and no_impact.json()["code"] == "IMPACT_REQUIRED"
    closed = client.post(f"/api/intervention-deviations/{dev['id']}/status", headers=h,
                         json={"status": "closed", "impact": "minor", "note": "Farmer will add a second crop"})
    assert closed.json()["status"] == "closed" and len(closed.json()["history"]) == 2
    assert client.post(f"/api/intervention-deviations/{dev['id']}/status", headers=h,
                       json={"status": "acknowledged"}).status_code == 409

    summary = client.get(f"/api/projects/{w['project_id']}/interventions/compliance", headers=h).json()
    assert summary["plans_by_status"] == {"active": 1}
    assert summary["open_deviations"] == 2 and summary["plans"][0]["overall"] == "partially"
    assert summary["plans"][0]["farmer"]["name"].startswith("Farmer ")
    viewer = login(client, make_user(org, "client_viewer"))
    masked = client.get(f"/api/projects/{w['project_id']}/interventions/compliance", headers=viewer).json()
    code = masked["plans"][0]["farmer"]["code"]
    assert masked["plans"][0]["farmer"]["name"] == f"Farmer {code}" and masked["plans"][0]["farmer"]["phone"] is None


def test_revision_is_a_new_version_agreed_and_activated(client, org, as_role):
    w = _world(org)
    plan = _active_plan(client, as_role, w)
    fc, admin = as_role("field_collector"), as_role("programme_admin")
    rev = client.post(f"/api/intervention-plans/{plan['id']}/revise", headers=fc, json={
        "reason": "Farmer switches to mulching next year",
        "commitments": [{"practice_code": "cover_crop", "start_year": Y - 2, "end_year": Y + 2}]})
    assert rev.status_code == 201, rev.text
    new = rev.json()
    assert new["version"] == 2 and new["status"] == "draft" and new["supersedes_id"] == plan["id"]
    assert new["code"] == plan["code"] and new["plan_id"] == plan["plan_id"]
    again = client.post(f"/api/intervention-plans/{plan['id']}/revise", headers=fc, json={
        "reason": "Another change", "commitments": [{"practice_code": "compost", "start_year": Y}]})
    assert again.status_code == 409 and again.json()["code"] == "REVISION_PENDING"
    client.post(f"/api/intervention-plans/{new['id']}/agree", headers=admin, json={"method": "assisted"})
    act = client.post(f"/api/intervention-plans/{new['id']}/activate", headers=admin)
    assert act.status_code == 200, act.text
    versions = {v["version"]: v["status"] for v in act.json()["versions"]}
    assert versions == {1: "superseded", 2: "active"}
    devs = client.get(f"/api/intervention-plans/{new['id']}/deviations", headers=admin).json()
    assert [d["kind"] for d in devs] == ["changed"] and devs[0]["reason"].startswith("Farmer switches")
    rows = client.get(f"/api/intervention-plans?project_id={w['project_id']}", headers=admin).json()
    assert sorted((r["version"], r["status"]) for r in rows) == [(1, "superseded"), (2, "active")]
    done = client.post(f"/api/intervention-plans/{new['id']}/complete", headers=admin, json={})
    assert done.json()["status"] == "completed"
    assert client.post(f"/api/intervention-plans/{new['id']}/complete", headers=admin, json={}).status_code == 409
    with fx.session() as s:
        assert s.query(PracticeType).count() == 3
        assert uuid.UUID(new["id"])
