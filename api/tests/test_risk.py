from datetime import date, timedelta

from app.modules.risk.models import Grievance
from tests import _p345_factories as fx
from tests.conftest import login, make_org, make_user


def _risk(client, h, w, **kw):
    body = {"project_id": str(w["project_id"]), "kind": "fire", "occurred_on": "2025-04-01",
            "description": "Grass fire on the boundary", "severity": "high", "estimated_impact_t": 12.5, **kw}
    r = client.post("/api/risk-events", headers=h, json=body)
    assert r.status_code == 201, r.text
    return r.json()


def test_risk_event_flow_and_validation(client, org, as_role):
    w = fx.world(org)
    h = as_role("programme_admin")
    r = _risk(client, h, w, field_id=str(w["field_ids"][0]))
    assert r["status"] == "open"
    skip = client.post(f"/api/risk-events/{r['id']}/status", headers=h, json={"status": "action"})
    assert skip.status_code == 409 and skip.json()["code"] == "ILLEGAL_STATE_TRANSITION"
    assert skip.json()["details"]["allowed"] == ["assessing"]
    assert client.post(f"/api/risk-events/{r['id']}/status", headers=h, json={"status": "assessing"}).json()["status"] == "assessing"
    assert client.patch(f"/api/risk-events/{r['id']}", headers=h, json={"estimated_impact_t": 20}).json()["estimated_impact_t"] == 20
    assert client.post(f"/api/risk-events/{r['id']}/status", headers=h, json={"status": "action"}).status_code == 200
    no_res = client.post(f"/api/risk-events/{r['id']}/status", headers=h, json={"status": "resolved"})
    assert no_res.status_code == 422 and no_res.json()["code"] == "RESOLUTION_REQUIRED"
    done = client.post(f"/api/risk-events/{r['id']}/status", headers=h,
                       json={"status": "resolved", "resolution": "Fire break built; soil unaffected."})
    assert done.json()["status"] == "resolved"
    assert client.post(f"/api/risk-events/{r['id']}/status", headers=h, json={"status": "open"}).status_code == 409
    assert client.patch(f"/api/risk-events/{r['id']}", headers=h, json={"severity": "low"}).status_code == 409

    other = fx.world(org)
    wrong = client.post("/api/risk-events", headers=h, json={
        "project_id": str(w["project_id"]), "field_id": str(other["field_ids"][0]), "kind": "flood",
        "occurred_on": "2025-01-01", "description": "Flooded field"})
    assert wrong.status_code == 422 and wrong.json()["code"] == "FIELD_NOT_IN_PROJECT"
    future = client.post("/api/risk-events", headers=h, json={
        "project_id": str(w["project_id"]), "kind": "flood", "description": "Future flood",
        "occurred_on": (date.today() + timedelta(days=2)).isoformat()})
    assert future.status_code == 422
    assert client.post("/api/risk-events", headers=as_role("mrv_analyst"), json={
        "project_id": str(w["project_id"]), "kind": "flood", "occurred_on": "2025-01-01",
        "description": "Flooded field"}).status_code == 403
    rival = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/risk-events/{r['id']}", headers=rival).status_code == 404
    assert client.get(f"/api/projects/{w['project_id']}/risk/summary", headers=rival).status_code == 404
    actions = {a["action"] for a in client.get("/api/audit", headers=h).json()}
    assert {"risk_event.create", "risk_event.status", "risk_event.update"} <= actions


def test_risk_summary_against_buffer(client, org, as_role):
    w = fx.world(org)
    h = as_role("programme_admin")
    fx.approved_run(org, w, buffer=15.0)
    fx.approved_run(org, w, buffer=5.0)
    fx.approved_run(org, w, buffer=100.0, status="rejected")
    _risk(client, h, w, estimated_impact_t=8)
    _risk(client, h, w, kind="farmer_exit", severity="medium", estimated_impact_t=None)
    resolved = _risk(client, h, w, estimated_impact_t=500)
    for st in ("assessing", "action"):
        client.post(f"/api/risk-events/{resolved['id']}/status", headers=h, json={"status": st})
    client.post(f"/api/risk-events/{resolved['id']}/status", headers=h, json={"status": "resolved", "resolution": "ok"})
    s = client.get(f"/api/projects/{w['project_id']}/risk/summary", headers=h).json()
    assert s["open"] == 2 and s["resolved"] == 1
    assert s["open_by_kind"] == {"fire": 1, "farmer_exit": 1} and s["open_by_severity"] == {"high": 1, "medium": 1}
    assert s["estimated_impact_t"] == 8 and s["events_without_estimate"] == 1
    assert s["buffer_t_co2e"] == 20.0 and s["approved_runs"] == 2 and s["buffer_sufficient"]
    _risk(client, h, w, estimated_impact_t=30)
    s2 = client.get(f"/api/projects/{w['project_id']}/risk/summary", headers=h).json()
    assert not s2["buffer_sufficient"] and "Review urgently" in s2["message"]


def test_grievance_lifecycle_and_history(client, org, as_role):
    w = fx.world(org)
    h = as_role("programme_admin")
    fid = str(w["farmer_ids"][0])
    r = client.post("/api/grievances", headers=h, json={
        "farmer_id": fid, "category": "payment", "subject": "Payment not received",
        "description": "My share for last season has not arrived.", "channel": "whatsapp", "priority": "high"})
    assert r.status_code == 201, r.text
    g = r.json()
    assert g["code"] == "G-00001" and g["due_on"] == (date.today() + timedelta(days=3)).isoformat()
    low = client.post("/api/grievances", headers=h, json={"category": "data", "subject": "Wrong area",
                                                           "description": "The map shows the wrong area.",
                                                           "priority": "low"}).json()
    assert low["code"] == "G-00002" and low["due_on"] == (date.today() + timedelta(days=14)).isoformat()
    normal = client.post("/api/grievances", headers=h, json={"category": "other", "subject": "Question",
                                                              "description": "When is the next visit?"}).json()
    assert normal["due_on"] == (date.today() + timedelta(days=7)).isoformat()

    handler = make_user(org, "programme_admin")
    a = client.post(f"/api/grievances/{g['id']}/assign", headers=h, json={"user_id": str(fx.uid(handler))})
    assert a.json()["assigned_to"] == str(fx.uid(handler))
    bad = client.post(f"/api/grievances/{g['id']}/status", headers=h, json={"status": "closed"})
    assert bad.status_code == 409 and bad.json()["details"]["allowed"] == ["in_progress"]
    client.post(f"/api/grievances/{g['id']}/status", headers=h, json={"status": "in_progress", "note": "Checking with finance"})
    need = client.post(f"/api/grievances/{g['id']}/status", headers=h, json={"status": "resolved"})
    assert need.status_code == 422 and need.json()["code"] == "RESOLUTION_REQUIRED"
    client.post(f"/api/grievances/{g['id']}/status", headers=h,
                json={"status": "resolved", "resolution": "Payment was on hold for missing UPI; now paid."})
    no_note = client.post(f"/api/grievances/{g['id']}/status", headers=h, json={"status": "appealed"})
    assert no_note.status_code == 422
    client.post(f"/api/grievances/{g['id']}/status", headers=h, json={"status": "appealed", "note": "Amount is wrong"})
    client.post(f"/api/grievances/{g['id']}/status", headers=h, json={"status": "in_progress"})
    client.post(f"/api/grievances/{g['id']}/status", headers=h, json={"status": "resolved", "resolution": "Recalculated."})
    final = client.post(f"/api/grievances/{g['id']}/status", headers=h, json={"status": "closed"}).json()
    assert final["status"] == "closed"
    assert [x["status"] for x in final["history"]] == [
        "open", "open", "in_progress", "resolved", "appealed", "in_progress", "resolved", "closed"]
    assert all(x["at"] and x["by"] for x in final["history"])
    assert client.post(f"/api/grievances/{g['id']}/status", headers=h, json={"status": "in_progress"}).status_code == 409


def test_grievance_overdue_filter(client, org, as_role):
    h = as_role("programme_admin")
    g = client.post("/api/grievances", headers=h, json={"category": "other", "subject": "Old issue",
                                                         "description": "Nobody replied."}).json()
    client.post("/api/grievances", headers=h, json={"category": "other", "subject": "New issue",
                                                     "description": "Just raised."})
    with fx.session() as s:
        s.get(Grievance, __import__("uuid").UUID(g["id"])).due_on = date.today() - timedelta(days=1)
        s.commit()
    over = client.get("/api/grievances?overdue=true", headers=h).json()
    assert [x["id"] for x in over] == [g["id"]] and over[0]["overdue"]
    assert len(client.get("/api/grievances?overdue=false", headers=h).json()) == 1
    assert len(client.get("/api/grievances?category=other", headers=h).json()) == 2


def test_farmers_raise_and_see_only_their_own(client, org, as_role):
    w = fx.world(org)
    mine, theirs = (str(x) for x in w["farmer_ids"])
    me = login(client, make_user(org, "farmer", scope={"farmer_id": mine}))
    r = client.post("/api/grievances", headers=me, json={"category": "sampling", "subject": "Holes not filled",
                                                         "description": "The sampling team left holes open."})
    assert r.status_code == 201 and r.json()["farmer_id"] == mine
    spoof = client.post("/api/grievances", headers=me, json={"farmer_id": theirs, "category": "other",
                                                             "subject": "Spoof", "description": "Pretending to be someone"})
    assert spoof.status_code == 404
    staff = as_role("programme_admin")
    other = client.post("/api/grievances", headers=staff, json={"farmer_id": theirs, "category": "other",
                                                                "subject": "Theirs", "description": "Other farmer issue"}).json()
    listed = client.get("/api/grievances", headers=me).json()
    assert [x["farmer_id"] for x in listed] == [mine]
    assert client.get(f"/api/grievances/{other['id']}", headers=me).status_code == 404
    assert client.get(f"/api/grievances/{r.json()['id']}", headers=me).status_code == 200
    assert client.post(f"/api/grievances/{r.json()['id']}/status", headers=me, json={"status": "in_progress"}).status_code == 403
    unlinked = login(client, make_user(org, "farmer"))
    assert client.post("/api/grievances", headers=unlinked, json={"category": "other", "subject": "Hi there",
                                                                  "description": "No farmer link"}).status_code == 403
    assert client.get("/api/grievances", headers=as_role("lab_technician")).status_code == 403
    rival = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/grievances/{other['id']}", headers=rival).status_code == 404
