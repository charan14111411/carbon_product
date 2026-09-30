"""Verification packages and the verifier portal, end to end."""

from __future__ import annotations

import hashlib
import json
import uuid
from datetime import timedelta

import pytest

from app.core import db as dbmod
from app.core.db import utcnow
from app.modules.calculation.models import Claim
from app.modules.evidence.models import EvidenceFile
from app.modules.partners.models import DomainEvent
from app.modules.verification import service as vsvc
from app.modules.verification.models import VerificationPackage, VerifierAccess
from tests._p2_factories import build_project, run_body
from tests.conftest import login, make_org, make_user


@pytest.fixture()
def built(client, org):
    return build_project(org)


def _approved(client, as_role, b, **kw):
    analyst, manager = as_role("mrv_analyst"), as_role("programme_admin")
    r = client.post(f"/api/projects/{b.project_id}/calculations", headers=analyst, json=run_body(b, **kw))
    assert r.status_code == 201, r.text
    rid = r.json()["id"]
    client.post(f"/api/calculations/{rid}/submit", headers=analyst)
    a = client.post(f"/api/calculations/{rid}/approve", headers=manager)
    assert a.status_code == 200, a.text
    return rid


def _pkg(client, h, rid):
    r = client.post(f"/api/calculations/{rid}/package", headers=h)
    assert r.status_code == 201, r.text
    return r.json()


def _stored_json(pkg_row: dict) -> dict:
    from app.modules.evidence import service as evidence

    with dbmod.session_factory()() as s:
        f = s.get(EvidenceFile, uuid.UUID(pkg_row["json_file_id"]))
        return json.loads(evidence.read_bytes(f))


def test_end_to_end_package_and_verifier_portal(client, built, as_role):
    manager = as_role("programme_admin")
    rid = _approved(client, as_role, built)
    with dbmod.session_factory()() as s:
        assert s.query(Claim).filter_by(run_id=uuid.UUID(rid)).count() == len(built.field_ids)

    # a second approval for the same period is refused
    analyst = as_role("mrv_analyst")
    dup = client.post(f"/api/projects/{built.project_id}/calculations", headers=analyst, json=run_body(built)).json()
    client.post(f"/api/calculations/{dup['id']}/submit", headers=analyst)
    assert client.post(f"/api/calculations/{dup['id']}/approve", headers=manager).json()["code"] == \
        "PERIOD_ALREADY_APPROVED"

    # package: two generations of identical evidence
    p1 = _pkg(client, manager, rid)
    p2 = _pkg(client, as_role("programme_admin", fresh=True), rid)
    assert (p1["version"], p2["version"]) == (1, 2)
    assert p1["sha256"] != p2["sha256"]  # the version is part of the package fingerprint
    assert p1["summary"]["content_sha256"] == p2["summary"]["content_sha256"]  # evidence hashes identically
    j1 = _stored_json(p1)
    assert vsvc.package_sha256(j1) == p1["sha256"] == j1["metadata"]["sha256"]
    for section in ("project", "methodology", "fields", "enrolments", "land_use", "practices", "strata",
                    "campaigns", "sites", "samples", "custody_events", "lab_results", "terms", "calculation",
                    "document_index"):
        assert j1[section], section
    assert isinstance(j1["qa_findings"], list)  # clean data: nothing found, but the section is always present
    assert j1["calculation"]["headline"]["net_credits_t_co2e"] > 0
    assert all(r["source_document"] for r in j1["methodology"]["rules"])
    index_ids = {d["id"] for d in j1["document_index"]}
    assert set(built.certificate_ids) <= index_ids and set(built.photo_ids) <= index_ids
    assert built.unrelated_evidence_id not in index_ids
    assert all(d.get("sha256") for d in j1["document_index"])
    assert "generated_at" not in json.dumps(j1)

    listing = client.get(f"/api/projects/{built.project_id}/packages", headers=manager).json()
    assert {p["version"] for p in listing} == {1, 2}
    detail = client.get(f"/api/packages/{p1['id']}", headers=manager).json()
    assert detail["pdf_file_id"] and detail["json_file_id"]
    check = client.get(f"/api/packages/{p1['id']}/verify", headers=manager).json()
    assert check["intact"] is True and check["recomputed_sha256"] == p1["sha256"]
    pdf = client.get(f"/api/evidence/{p1['pdf_file_id']}/content", headers=manager)
    assert pdf.content.startswith(b"%PDF")
    with dbmod.session_factory()() as s:
        assert s.query(DomainEvent).filter_by(event="package.issued").count() == 2

    # verifier access
    g = client.post(f"/api/packages/{p1['id']}/verifier-access", headers=manager, json={
        "verifier_name": "Dr. Meera Rao", "verifier_email": "meera@vvb.example", "organisation": "Green VVB",
        "days": 30})
    assert g.status_code == 201, g.text
    token, access = g.json()["token"], g.json()["access"]
    with dbmod.session_factory()() as s:
        row = s.get(VerifierAccess, uuid.UUID(access["id"]))
        assert row.token_sha256 == hashlib.sha256(token.encode()).hexdigest() and token not in json.dumps(access)
    vh = {"X-Verifier-Token": token}
    sess = client.get("/api/verifier/session", headers=vh)
    assert sess.status_code == 200 and sess.json()["package"]["id"] == p1["id"]
    assert sess.json()["integrity"]["intact"] is True
    assert client.get(f"/api/packages/{p1['id']}/verifier-access", headers=manager).json()[0]["last_opened_at"]
    full = client.get("/api/verifier/package", headers=vh).json()
    assert full["metadata"]["sha256"] == p1["sha256"]
    f_ok = client.get(f"/api/verifier/files/{built.certificate_ids[0]}", headers=vh)
    assert f_ok.status_code == 200 and f_ok.headers["X-Content-SHA256"]
    assert client.get(f"/api/verifier/files/{built.unrelated_evidence_id}", headers=vh).status_code == 404
    assert client.get(f"/api/verifier/files/{p1['pdf_file_id']}", headers=vh).status_code == 200
    prov = client.get(f"/api/verifier/provenance/{rid}", headers=vh)
    assert prov.status_code == 200 and prov.json()["strata"][0]["sites"]
    assert client.get(f"/api/verifier/provenance/{dup['id']}", headers=vh).status_code == 404

    # questions and answers
    q = client.post("/api/verifier/queries", headers=vh, json={
        "question": "Please explain the bulk density method for site 1.", "subject_type": "lab_result",
        "subject_id": "x"})
    assert q.status_code == 201
    assert client.post("/api/verifier/queries", headers=vh, json={"question": "why"}).status_code == 422
    team_q = client.get(f"/api/packages/{p1['id']}/queries", headers=manager).json()
    assert team_q[0]["status"] == "open"
    ans = client.post(f"/api/verifier-queries/{team_q[0]['id']}/answer", headers=analyst,
                      json={"answer": "Core ring method, 100 cm3 rings."})
    assert ans.status_code == 200 and ans.json()["status"] == "answered"
    assert client.get("/api/verifier/queries", headers=vh).json()[0]["answer"].startswith("Core ring")
    d = client.post("/api/verifier/decision", headers=vh, json={"status": "verified", "note": "All good"})
    assert d.status_code == 200 and d.json()["review_status"] == "verified"

    # revoked link
    assert client.post(f"/api/verifier-access/{access['id']}/revoke", headers=manager).status_code == 200
    r = client.get("/api/verifier/session", headers=vh)
    assert r.status_code == 401 and r.json()["code"] == "VERIFIER_LINK_REVOKED"


def test_verifier_link_expiry_and_bad_tokens(client, built, as_role):
    manager = as_role("programme_admin")
    rid = _approved(client, as_role, built)
    p = _pkg(client, manager, rid)
    g = client.post(f"/api/packages/{p['id']}/verifier-access", headers=manager, json={
        "verifier_name": "Auditor", "verifier_email": "a@vvb.example", "days": 1}).json()
    assert client.post(f"/api/packages/{p['id']}/verifier-access", headers=manager, json={
        "verifier_name": "Auditor", "verifier_email": "a@vvb.example", "days": 91}).status_code == 422
    with dbmod.session_factory()() as s:
        s.get(VerifierAccess, uuid.UUID(g["access"]["id"])).expires_at = utcnow() - timedelta(minutes=1)
        s.commit()
    r = client.get("/api/verifier/session", headers={"X-Verifier-Token": g["token"]})
    assert r.status_code == 401 and r.json()["code"] == "VERIFIER_LINK_EXPIRED"
    assert client.get("/api/verifier/session").json()["code"] == "VERIFIER_TOKEN_REQUIRED"
    assert client.get("/api/verifier/session", headers={"X-Verifier-Token": "nope"}).json()["code"] == \
        "VERIFIER_LINK_INVALID"
    # a JWT is not a verifier token
    assert client.get("/api/verifier/package", headers=manager).status_code == 401


def test_package_rules(client, built, as_role):
    analyst, manager = as_role("mrv_analyst"), as_role("programme_admin")
    rid = client.post(f"/api/projects/{built.project_id}/calculations", headers=analyst,
                      json=run_body(built)).json()["id"]
    r = client.post(f"/api/calculations/{rid}/package", headers=manager)
    assert r.status_code == 409 and r.json()["code"] == "ILLEGAL_STATE_TRANSITION"
    # the person who ran the calculation can't issue its package
    admin = as_role("platform_admin")
    rid2 = client.post(f"/api/projects/{built.project_id}/calculations", headers=admin,
                       json=run_body(built, period_label="P9")).status_code
    assert rid2 == 409  # no approved terms for P9 → fails closed
    own = client.post(f"/api/projects/{built.project_id}/calculations", headers=admin, json=run_body(built)).json()
    client.post(f"/api/calculations/{own['id']}/submit", headers=admin)
    assert client.post(f"/api/calculations/{own['id']}/approve", headers=manager).status_code == 200
    s = client.post(f"/api/calculations/{own['id']}/package", headers=admin)
    assert s.status_code == 403 and s.json()["code"] == "SELF_APPROVAL_REJECTED"
    assert client.post(f"/api/calculations/{own['id']}/package", headers=analyst).status_code == 403


def test_tampered_package_is_detected(client, built, as_role):
    manager = as_role("programme_admin")
    p = _pkg(client, manager, _approved(client, as_role, built))
    from app.core.config import get_settings

    with dbmod.session_factory()() as s:
        f = s.get(EvidenceFile, uuid.UUID(p["json_file_id"]))
        path = get_settings().evidence_dir / f.storage_key
    original = path.read_bytes()
    try:
        doc = json.loads(original)
        doc["calculation"]["headline"]["net_credits_t_co2e"] = 1e9
        path.write_bytes(json.dumps(doc).encode())
        check = client.get(f"/api/packages/{p['id']}/verify", headers=manager).json()
        assert check["intact"] is False and check["json_file_intact"] is False
    finally:
        path.write_bytes(original)


def test_cross_org_packages_are_not_found(client, built, as_role):
    manager = as_role("programme_admin")
    p = _pkg(client, manager, _approved(client, as_role, built))
    other = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/packages/{p['id']}", headers=other).status_code == 404
    assert client.get(f"/api/packages/{p['id']}/verify", headers=other).status_code == 404
    assert client.post(f"/api/calculations/{p['run_id']}/package", headers=other).status_code == 404
    assert client.post(f"/api/packages/{p['id']}/verifier-access", headers=other, json={
        "verifier_name": "X Y", "verifier_email": "x@y.example", "days": 5}).status_code == 404
    assert client.get(f"/api/projects/{built.project_id}/packages", headers=other).status_code == 404
    with dbmod.session_factory()() as s:
        assert s.query(VerificationPackage).count() == 1
