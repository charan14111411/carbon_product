from datetime import date

from app.core.errors import ImmutableRecord
from app.modules.documents.models import DocumentVersion
from app.modules.programmes.models import Project
from tests import _p345_factories as fx
from tests.conftest import login, make_org, make_user


def test_policies_follow_vm0042_minimum(client, org, as_role):
    h = as_role("programme_admin")
    short = client.post("/api/documents/retention-policies", headers=h, json={
        "kind": "report", "rule": "after_crediting_end", "years": 1, "source": "Internal policy"})
    assert short.status_code == 422 and short.json()["code"] == "RETENTION_TOO_SHORT"
    assert client.post("/api/documents/retention-policies/install-defaults", headers=h).json()["installed"] == 1
    assert client.post("/api/documents/retention-policies/install-defaults", headers=h).json()["installed"] == 0
    first = client.post("/api/documents/retention-policies", headers=h, json={
        "kind": "contract", "rule": "fixed_years", "years": 8, "source": "Programme contract clause 14"}).json()
    second = client.post("/api/documents/retention-policies", headers=h, json={
        "kind": "contract", "rule": "fixed_years", "years": 10, "source": "Updated legal advice"}).json()
    states = {p["id"]: p["status"] for p in client.get("/api/documents/retention-policies", headers=h).json()}
    assert states[first["id"]] == "retired" and states[second["id"]] == "active"
    assert client.patch(f"/api/documents/retention-policies/{first['id']}", headers=h,
                        json={"years": 1}).status_code == 200  # fixed-year rules are not methodology-bound
    assert client.post("/api/documents/retention-policies", headers=as_role("mrv_analyst"), json={
        "kind": "sop", "rule": "fixed_years", "years": 3, "source": "x" * 5}).status_code == 403


def test_document_versions_are_append_only_and_four_eyes(client, org, as_role):
    w = fx.world(org)
    h = as_role("programme_admin")
    ev1, ev2 = fx.evidence_id(org, "plan v1"), fx.evidence_id(org, "plan v2")
    r = client.post("/api/documents", headers=h, json={
        "title": "Monitoring plan", "kind": "monitoring_plan", "project_id": str(w["project_id"]),
        "entity_type": "project", "entity_id": str(w["project_id"]), "evidence_id": ev1})
    assert r.status_code == 201, r.text
    doc = r.json()
    assert doc["code"] == "DOC-00001" and doc["current_version"] == 1 and doc["approved_version"] is None
    half = client.post("/api/documents", headers=h, json={"title": "Loose", "kind": "other", "entity_type": "farm"})
    assert half.status_code == 422
    same = client.post(f"/api/documents/{doc['id']}/versions", headers=h, json={"evidence_id": ev1,
                                                                              "change_note": "Same file"})
    assert same.status_code == 409 and same.json()["code"] == "VERSION_UNCHANGED"
    v2 = client.post(f"/api/documents/{doc['id']}/versions", headers=h, json={"evidence_id": ev2,
                                                                            "change_note": "Added strata map"})
    assert v2.status_code == 201 and v2.json()["current_version"] == 2
    own = client.post(f"/api/documents/{doc['id']}/versions/2/approve", headers=h, json={})
    assert own.status_code == 403 and own.json()["code"] == "SELF_APPROVAL_REJECTED"
    mo = login(client, make_user(org, "methodology_owner"))
    no_note = client.post(f"/api/documents/{doc['id']}/versions/1/approve", headers=mo, json={"decision": "rejected"})
    assert no_note.status_code == 422
    client.post(f"/api/documents/{doc['id']}/versions/1/approve", headers=mo,
                json={"decision": "rejected", "note": "Superseded before review"})
    ok = client.post(f"/api/documents/{doc['id']}/versions/2/approve", headers=mo, json={"note": "Reviewed"})
    assert ok.status_code == 200 and ok.json()["approved_version"] == 2
    assert [v["approval"]["decision"] for v in ok.json()["versions"]] == ["rejected", "approved"]
    twice = client.post(f"/api/documents/{doc['id']}/versions/2/approve", headers=mo, json={})
    assert twice.status_code == 409 and twice.json()["code"] == "ALREADY_REVIEWED"
    assert client.post(f"/api/documents/{doc['id']}/versions/9/approve", headers=mo, json={}).status_code == 404
    with fx.session() as s:
        v = s.query(DocumentVersion).first()
        v.change_note = "rewritten"
        try:
            s.flush()
        except ImmutableRecord:
            s.rollback()
        else:
            raise AssertionError("document versions must be append-only")
    archived = client.patch(f"/api/documents/{doc['id']}", headers=h, json={"status": "archived"}).json()
    assert archived["status"] == "archived"
    assert client.post(f"/api/documents/{doc['id']}/versions", headers=h,
                       json={"evidence_id": fx.evidence_id(org), "change_note": "late"}).status_code == 409
    assert [d["code"] for d in client.get(f"/api/documents?project_id={w['project_id']}", headers=h).json()] == ["DOC-00001"]
    rival = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/documents/{doc['id']}", headers=rival).status_code == 404
    other_ev = fx.evidence_id(org, "other org cannot use")
    assert client.post("/api/documents", headers=rival, json={"title": "Steal", "kind": "other",
                                                              "evidence_id": other_ev}).status_code == 404


def test_retention_report_never_deletes(client, org, as_role):
    h = as_role("programme_admin")
    ended, running = fx.world(org), fx.world(org)
    with fx.session() as s:
        s.get(Project, ended["project_id"]).crediting_end = date(2020, 12, 31)
        s.commit()

    def doc(title, kind, project=None):
        r = client.post("/api/documents", headers=h, json={
            "title": title, "kind": kind, "project_id": str(project) if project else None,
            "evidence_id": fx.evidence_id(org)})
        assert r.status_code == 201, r.text
        return r.json()

    old = doc("Old monitoring report", "report", ended["project_id"])
    live = doc("Current monitoring report", "report", running["project_id"])
    loose = doc("Field SOP", "sop")
    contract = doc("Buyer contract", "contract")
    before = client.get("/api/documents/retention", headers=h).json()
    assert before["counts"] == {"no_policy": 4}
    client.post("/api/documents/retention-policies/install-defaults", headers=h)
    client.post("/api/documents/retention-policies", headers=h, json={
        "kind": "contract", "rule": "fixed_years", "years": 10, "source": "Programme contract clause 14"})
    rep = client.get("/api/documents/retention", headers=h).json()
    by = {i["document_id"]: i for i in rep["items"]}
    assert by[old["id"]]["status"] == "expired" and by[old["id"]]["retain_until"] == "2022-12-31"
    assert "VM0042" in by[old["id"]]["policy"]["source"]
    assert by[live["id"]]["status"] == "undetermined" and "crediting end" in by[live["id"]]["reason"]
    assert by[loose["id"]]["status"] == "undetermined"
    assert by[contract["id"]]["status"] == "retain" and by[contract["id"]]["policy"]["rule"] == "fixed_years"
    assert "Nothing is deleted" in rep["note"]
    only = client.get("/api/documents/retention?status=expired", headers=h).json()
    assert [i["code"] for i in only["items"]] == [old["code"]]
    assert client.get(f"/api/documents/{old['id']}", headers=h).status_code == 200  # still there
    viewer = login(client, make_user(org, "client_viewer"))
    assert client.get("/api/documents/retention", headers=viewer).status_code == 200
    assert client.post("/api/documents", headers=viewer, json={"title": "x" * 5, "kind": "other"}).status_code == 403
