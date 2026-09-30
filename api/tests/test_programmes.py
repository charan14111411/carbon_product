from datetime import date

import pytest

from app.core import geo
from app.core.errors import IllegalTransition
from app.modules.programmes.domain import PROGRAMME_TRANSITIONS, PROJECT_TRANSITIONS, check_transition, periods_overlap
from tests.conftest import login, make_org, make_user


def mk_programme(client, h, code="COF-KA", **extra):
    body = {"code": code, "name": "Coffee Soils Karnataka", "region": "Karnataka, India", **extra}
    r = client.post("/api/programmes", headers=h, json=body)
    assert r.status_code == 201, r.text
    return r.json()


def mk_project(client, h, programme_id, code="PRJ-1", **extra):
    r = client.post("/api/projects", headers=h, json={"programme_id": programme_id, "code": code,
                                                        "name": "Project one", **extra})
    assert r.status_code == 201, r.text
    return r.json()


def set_status(client, h, kind, obj_id, status):
    return client.post(f"/api/{kind}/{obj_id}/status", headers=h, json={"status": status})


# ------------------------------------------------------------------ pure rules
def test_transition_tables():
    check_transition(PROGRAMME_TRANSITIONS, "draft", "active", "programme")
    check_transition(PROJECT_TRANSITIONS, "active", "monitoring", "project")
    with pytest.raises(IllegalTransition):
        check_transition(PROGRAMME_TRANSITIONS, "closed", "active", "programme")
    with pytest.raises(IllegalTransition):
        check_transition(PROJECT_TRANSITIONS, "design", "monitoring", "project")
    with pytest.raises(IllegalTransition):
        check_transition(PROJECT_TRANSITIONS, "design", "nonsense", "project")


def test_periods_overlap():
    d = date
    assert periods_overlap(d(2024, 1, 1), d(2024, 12, 31), d(2024, 6, 1), d(2025, 6, 1))
    assert not periods_overlap(d(2024, 1, 1), d(2024, 12, 31), d(2025, 1, 1), None)
    assert periods_overlap(None, None, d(2030, 1, 1), d(2031, 1, 1))


# ------------------------------------------------------------------ programmes
def test_create_programme_and_read(client, as_role):
    h = as_role("programme_admin")
    p = mk_programme(client, h, boundary=geo.square(12.4, 75.7, 50_000), commercial_terms={"lookback_years": 10})
    assert p["status"] == "draft" and p["boundary"]["type"] == "Polygon"
    assert client.get(f"/api/programmes/{p['id']}", headers=as_role("mrv_analyst")).json()["code"] == "COF-KA"
    assert len(client.get("/api/programmes", headers=h).json()) == 1
    dup = client.post("/api/programmes", headers=h, json={"code": "COF-KA", "name": "Again"})
    assert dup.status_code == 409 and dup.json()["code"] == "DUPLICATE_CODE"
    assert any(a["action"] == "programme.create" for a in client.get("/api/audit", headers=h).json())


def test_programme_validation(client, as_role):
    h = as_role("programme_admin")
    bad_dates = client.post("/api/programmes", headers=h, json={
        "code": "P1", "name": "Bad dates", "start_date": "2025-01-01", "end_date": "2024-01-01"})
    assert bad_dates.status_code == 422
    bad_geo = client.post("/api/programmes", headers=h, json={
        "code": "P2", "name": "Bad shape", "boundary": {"type": "Point", "coordinates": [75, 12]}})
    assert bad_geo.status_code == 422 and bad_geo.json()["code"] == "INVALID_GEOMETRY"
    unknown_crop = client.post("/api/programmes", headers=h, json={
        "code": "P3", "name": "Crops", "eligible_crops": ["unobtainium"]})
    assert unknown_crop.status_code == 422 and unknown_crop.json()["code"] == "UNKNOWN_CROP"
    bad_lookback = client.post("/api/programmes", headers=h, json={
        "code": "P4", "name": "Lookback", "commercial_terms": {"lookback_years": "ten"}})
    assert bad_lookback.status_code == 422
    client.post("/api/catalogue/install-defaults", headers=h)
    ok = client.post("/api/programmes", headers=h, json={"code": "P3", "name": "Crops", "eligible_crops": ["rice"]})
    assert ok.status_code == 201 and ok.json()["eligible_crops"] == ["rice"]


def test_update_programme(client, as_role):
    h = as_role("programme_admin")
    p = mk_programme(client, h)
    r = client.patch(f"/api/programmes/{p['id']}", headers=h, json={"name": "Renamed", "end_date": "2030-12-31"})
    assert r.status_code == 200 and r.json()["name"] == "Renamed"
    bad = client.patch(f"/api/programmes/{p['id']}", headers=h, json={"start_date": "2031-01-01"})
    assert bad.status_code == 422


def test_programme_status_machine(client, as_role):
    h = as_role("programme_admin")
    p = mk_programme(client, h)
    assert set_status(client, h, "programmes", p["id"], "suspended").json()["code"] == "ILLEGAL_STATE_TRANSITION"
    assert set_status(client, h, "programmes", p["id"], "active").json()["status"] == "active"
    assert set_status(client, h, "programmes", p["id"], "suspended").json()["status"] == "suspended"
    assert set_status(client, h, "programmes", p["id"], "active").json()["status"] == "active"
    assert set_status(client, h, "programmes", p["id"], "closed").json()["status"] == "closed"
    r = set_status(client, h, "programmes", p["id"], "active")
    assert r.status_code == 409 and r.json()["code"] == "ILLEGAL_STATE_TRANSITION"
    assert client.patch(f"/api/programmes/{p['id']}", headers=h, json={"name": "X Y"}).status_code == 409
    actions = [a["action"] for a in client.get("/api/audit", headers=h).json()]
    assert "programme.closed" in actions and "programme.suspended" in actions


# ------------------------------------------------------------------ projects
def test_project_crud_and_status(client, as_role):
    h = as_role("programme_admin")
    p = mk_programme(client, h)
    pr = mk_project(client, h, p["id"], crediting_start="2025-01-01", crediting_end="2034-12-31")
    assert pr["status"] == "design" and pr["methodology_code"] == "VM0042"
    assert [x["id"] for x in client.get(f"/api/projects?programme_id={p['id']}", headers=h).json()] == [pr["id"]]
    # programme must be active first
    blocked = set_status(client, h, "projects", pr["id"], "active")
    assert blocked.status_code == 409 and blocked.json()["code"] == "BLOCKED"
    set_status(client, h, "programmes", p["id"], "active")
    assert set_status(client, h, "projects", pr["id"], "closed").json()["code"] == "ILLEGAL_STATE_TRANSITION"
    assert set_status(client, h, "projects", pr["id"], "active").json()["status"] == "active"
    assert set_status(client, h, "projects", pr["id"], "design").status_code == 409
    assert set_status(client, h, "projects", pr["id"], "monitoring").json()["status"] == "monitoring"
    assert set_status(client, h, "projects", pr["id"], "closed").json()["status"] == "closed"
    assert client.patch(f"/api/projects/{pr['id']}", headers=h, json={"name": "Nope nope"}).status_code == 409


def test_project_validation(client, as_role):
    h = as_role("programme_admin")
    p = mk_programme(client, h)
    bad = client.post("/api/projects", headers=h, json={
        "programme_id": p["id"], "code": "PX", "name": "Bad", "crediting_start": "2025-01-01",
        "crediting_end": "2024-01-01"})
    assert bad.status_code == 422
    mk_project(client, h, p["id"], code="PX")
    dup = client.post("/api/projects", headers=h, json={"programme_id": p["id"], "code": "PX", "name": "Again"})
    assert dup.status_code == 409
    missing = client.post("/api/projects", headers=h, json={
        "programme_id": "00000000-0000-0000-0000-000000000000", "code": "PY", "name": "Orphan"})
    assert missing.status_code == 404
    pr = client.get("/api/projects", headers=h).json()[0]
    patch = client.patch(f"/api/projects/{pr['id']}", headers=h, json={"crediting_start": "2026-01-01",
                                                                        "crediting_end": "2025-01-01"})
    assert patch.status_code == 422
    ok = client.patch(f"/api/projects/{pr['id']}", headers=h, json={"methodology_version": "2.3"})
    assert ok.status_code == 200 and ok.json()["methodology_version"] == "2.3"


def test_closed_programme_rejects_new_projects(client, as_role):
    h = as_role("programme_admin")
    p = mk_programme(client, h)
    set_status(client, h, "programmes", p["id"], "active")
    set_status(client, h, "programmes", p["id"], "closed")
    r = client.post("/api/projects", headers=h, json={"programme_id": p["id"], "code": "LATE", "name": "Too late"})
    assert r.status_code == 409 and r.json()["code"] == "BLOCKED"


def test_summary_empty(client, as_role):
    h = as_role("programme_admin")
    p = mk_programme(client, h)
    mk_project(client, h, p["id"])
    s = client.get(f"/api/programmes/{p['id']}/summary", headers=h).json()
    assert s["projects"] == 1 and s["projects_by_status"] == {"design": 1}
    assert s["farmers_enrolled"] == 0 and s["fields_enrolled"] == 0 and s["hectares_enrolled"] == 0


def test_programme_permissions(client, as_role):
    h = as_role("programme_admin")
    p = mk_programme(client, h)
    for role in ("mrv_analyst", "field_collector", "methodology_owner", "farmer"):
        assert client.post("/api/programmes", headers=as_role(role), json={"code": "Z1", "name": "No way"}).status_code == 403
        assert set_status(client, as_role(role), "programmes", p["id"], "active").status_code == 403
    assert client.get("/api/programmes", headers=as_role("field_collector")).status_code == 403
    assert client.get("/api/programmes", headers=as_role("verifier")).status_code == 403
    assert client.get("/api/programmes", headers=as_role("mrv_analyst")).status_code == 200


def test_programme_tenant_isolation(client, as_role):
    h = as_role("programme_admin")
    p = mk_programme(client, h)
    pr = mk_project(client, h, p["id"])
    other = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/programmes/{p['id']}", headers=other).status_code == 404
    assert client.get(f"/api/programmes/{p['id']}/summary", headers=other).status_code == 404
    assert client.get(f"/api/projects/{pr['id']}", headers=other).status_code == 404
    assert set_status(client, other, "programmes", p["id"], "active").status_code == 404
    assert client.get("/api/programmes", headers=other).json() == []
    # can't attach a project to someone else's programme
    r = client.post("/api/projects", headers=other, json={"programme_id": p["id"], "code": "STEAL", "name": "Steal"})
    assert r.status_code == 404
