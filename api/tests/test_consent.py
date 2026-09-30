import hashlib
import uuid
from datetime import date, timedelta

import pytest

from app.core import db as dbmod
from app.core.config import get_settings
from app.core.errors import ImmutableRecord
from app.modules.consent.models import ConsentEvent
from app.modules.consent.service import has_consent
from app.modules.farmers.models import Farmer
from tests.conftest import login, make_org, make_user
from tests.test_farmers import mk_farmer

BODY = {"en": "I agree to take part in the programme.", "kn": "ನಾನು ಒಪ್ಪುತ್ತೇನೆ."}


def mk_template(client, h, code="PART", purposes=("sampling", "data_use"), publish=True):
    r = client.post("/api/agreement-templates", headers=h, json={
        "code": code, "title": "Participation agreement", "body": BODY, "purposes": list(purposes)})
    assert r.status_code == 201, r.text
    t = r.json()
    if publish:
        t = client.post(f"/api/agreement-templates/{t['id']}/publish", headers=h).json()
    return t


def sign(client, h, farmer_id, template_id, **extra):
    body = {"template_id": template_id, "language": "en", "method": "otp", "otp_code": "123456", **extra}
    return client.post(f"/api/farmers/{farmer_id}/agreements", headers=h, json=body)


# ------------------------------------------------------------------ templates
def test_template_lifecycle(client, as_role):
    h = as_role("programme_admin")
    t = mk_template(client, h, publish=False)
    assert t["status"] == "draft" and t["version"] == 1
    edited = client.patch(f"/api/agreement-templates/{t['id']}", headers=h, json={"title": "Updated title"})
    assert edited.status_code == 200 and edited.json()["title"] == "Updated title"
    pub = client.post(f"/api/agreement-templates/{t['id']}/publish", headers=h).json()
    assert pub["status"] == "published"
    locked = client.patch(f"/api/agreement-templates/{t['id']}", headers=h, json={"title": "Sneaky edit"})
    assert locked.status_code == 409 and locked.json()["code"] == "IMMUTABLE_RECORD"
    assert client.post(f"/api/agreement-templates/{t['id']}/publish", headers=h).status_code == 409

    v2 = client.post(f"/api/agreement-templates/{t['id']}/new-version", headers=h)
    assert v2.status_code == 201 and v2.json()["version"] == 2 and v2.json()["status"] == "draft"
    assert v2.json()["body"] == BODY
    again = client.post(f"/api/agreement-templates/{t['id']}/new-version", headers=h)
    assert again.status_code == 409 and again.json()["code"] == "DRAFT_EXISTS"
    client.post(f"/api/agreement-templates/{v2.json()['id']}/publish", headers=h)
    statuses = {x["version"]: x["status"] for x in client.get("/api/agreement-templates?code=PART", headers=h).json()}
    assert statuses == {1: "retired", 2: "published"}


def test_template_validation(client, as_role):
    h = as_role("programme_admin")
    base = {"code": "T1", "title": "Agreement", "body": BODY, "purposes": ["sampling"]}
    assert client.post("/api/agreement-templates", headers=h, json={**base, "purposes": ["mind_reading"]}).status_code == 422
    assert client.post("/api/agreement-templates", headers=h, json={**base, "purposes": []}).status_code == 422
    assert client.post("/api/agreement-templates", headers=h, json={**base, "body": {}}).status_code == 422
    assert client.post("/api/agreement-templates", headers=h, json={**base, "body": {"en": "  "}}).status_code == 422
    assert client.post("/api/agreement-templates", headers=h, json=base).status_code == 201
    dup = client.post("/api/agreement-templates", headers=h, json=base)
    assert dup.status_code == 409 and dup.json()["code"] == "DUPLICATE_CODE"


# ------------------------------------------------------------------ signing
def test_sign_agreement_with_otp_grants_consents(client, as_role):
    h = as_role("programme_admin")
    f = mk_farmer(client, h)
    t = mk_template(client, h)
    r = sign(client, h, f["id"], t["id"])
    assert r.status_code == 201, r.text
    ag = r.json()["agreement"]
    assert ag["signed_text_sha256"] == hashlib.sha256(BODY["en"].encode("utf-8")).hexdigest()
    assert ag["template_version"] == 1 and ag["method"] == "otp" and ag["witness_user_id"] is None
    assert {c["purpose"] for c in r.json()["consents"]} == {"sampling", "data_use"}
    state = {c["purpose"]: c for c in client.get(f"/api/farmers/{f['id']}/consents", headers=h).json()["current"]}
    assert state["sampling"]["state"] == "granted" and state["sampling"]["agreement_id"] == ag["id"]
    assert state["payments"]["state"] == "not_given"
    assert len(client.get(f"/api/farmers/{f['id']}/agreements", headers=h).json()) == 1
    actions = [a["action"] for a in client.get("/api/audit", headers=h).json()]
    assert "agreement.sign" in actions and actions.count("consent.granted") == 2


def test_sign_in_other_language_hashes_that_text(client, as_role):
    h = as_role("programme_admin")
    f = mk_farmer(client, h)
    t = mk_template(client, h)
    ag = sign(client, h, f["id"], t["id"], language="kn", method="assisted", otp_code=None).json()["agreement"]
    assert ag["signed_text_sha256"] == hashlib.sha256(BODY["kn"].encode("utf-8")).hexdigest()
    assert ag["witness_user_id"] is not None
    missing = sign(client, h, f["id"], t["id"], language="hi")
    assert missing.status_code == 422 and missing.json()["code"] == "LANGUAGE_UNAVAILABLE"


def test_wrong_otp_rejected(client, as_role):
    h = as_role("programme_admin")
    f = mk_farmer(client, h)
    t = mk_template(client, h)
    r = sign(client, h, f["id"], t["id"], otp_code="000000")
    assert r.status_code == 422 and r.json()["code"] == "OTP_INVALID"
    assert sign(client, h, f["id"], t["id"], otp_code=None).status_code == 422
    assert client.get(f"/api/farmers/{f['id']}/agreements", headers=h).json() == []


def test_otp_disabled_in_production(client, as_role, monkeypatch):
    h = as_role("programme_admin")
    f = mk_farmer(client, h)
    t = mk_template(client, h)
    monkeypatch.setattr(get_settings(), "environment", "production")
    r = sign(client, h, f["id"], t["id"])
    assert r.status_code == 422 and r.json()["code"] == "OTP_UNAVAILABLE"
    assert sign(client, h, f["id"], t["id"], method="esign", otp_code=None).status_code == 201


def test_only_published_templates_can_be_signed(client, as_role):
    h = as_role("programme_admin")
    f = mk_farmer(client, h)
    draft = mk_template(client, h, publish=False)
    r = sign(client, h, f["id"], draft["id"])
    assert r.status_code == 409 and r.json()["code"] == "BLOCKED"


def test_exited_farmer_cannot_sign(client, as_role):
    h = as_role("programme_admin")
    f = mk_farmer(client, h)
    t = mk_template(client, h)
    client.patch(f"/api/farmers/{f['id']}", headers=h, json={"status": "exited"})
    assert sign(client, h, f["id"], t["id"]).status_code == 409


# ------------------------------------------------------------------ consent events
def test_grant_and_withdraw_latest_wins(client, as_role):
    h = as_role("programme_admin")
    f = mk_farmer(client, h)
    g = client.post(f"/api/farmers/{f['id']}/consents", headers=h, json={"purpose": "sampling", "granted": True,
                                                                         "channel": "paper"})
    assert g.status_code == 201 and g.json()["channel"] == "paper"
    w = client.post(f"/api/farmers/{f['id']}/consents", headers=h, json={
        "purpose": "sampling", "granted": False, "channel": "whatsapp", "notes": "Farmer asked to stop"})
    assert w.status_code == 201
    out = client.get(f"/api/farmers/{f['id']}/consents", headers=h).json()
    state = {c["purpose"]: c["state"] for c in out["current"]}
    assert state["sampling"] == "withdrawn"
    assert [e["granted"] for e in out["history"]] == [False, True]
    assert any(a["action"] == "consent.withdrawn" for a in client.get("/api/audit", headers=h).json())


def test_consent_validation(client, as_role):
    h = as_role("programme_admin")
    f = mk_farmer(client, h)
    assert client.post(f"/api/farmers/{f['id']}/consents", headers=h, json={
        "purpose": "telepathy", "granted": True}).status_code == 422
    assert client.post(f"/api/farmers/{f['id']}/consents", headers=h, json={
        "purpose": "sampling", "granted": True, "channel": "pigeon"}).status_code == 422


def test_has_consent_respects_dates_and_latest_event(client, as_role):
    h = as_role("programme_admin")
    f = mk_farmer(client, h)
    client.post(f"/api/farmers/{f['id']}/consents", headers=h, json={"purpose": "data_use", "granted": True})
    with dbmod.session_factory()() as s:
        farmer = s.get(Farmer, uuid.UUID(f["id"]))
        assert has_consent(s, farmer.org_id, farmer.id, "data_use")
        assert not has_consent(s, farmer.org_id, farmer.id, "sampling")
        assert not has_consent(s, farmer.org_id, farmer.id, "data_use", on_date=date.today() - timedelta(days=1))
    client.post(f"/api/farmers/{f['id']}/consents", headers=h, json={"purpose": "data_use", "granted": False})
    with dbmod.session_factory()() as s:
        farmer = s.get(Farmer, uuid.UUID(f["id"]))
        assert not has_consent(s, farmer.org_id, farmer.id, "data_use")


def test_consent_events_are_append_only(client, as_role):
    h = as_role("programme_admin")
    f = mk_farmer(client, h)
    client.post(f"/api/farmers/{f['id']}/consents", headers=h, json={"purpose": "sampling", "granted": True})
    with dbmod.session_factory()() as s:
        ev = s.query(ConsentEvent).first()
        ev.granted = False
        with pytest.raises(ImmutableRecord):
            s.flush()


# ------------------------------------------------------------------ permissions & isolation
def test_consent_permissions(client, as_role, org):
    h = as_role("programme_admin")
    f = mk_farmer(client, h)
    t = mk_template(client, h)
    for role in ("field_collector", "mrv_analyst"):
        assert client.post(f"/api/farmers/{f['id']}/consents", headers=as_role(role), json={
            "purpose": "sampling", "granted": True}).status_code == 403
        assert client.post("/api/agreement-templates", headers=as_role(role), json={
            "code": "X", "title": "Nope", "body": BODY, "purposes": ["sampling"]}).status_code == 403
    assert client.get(f"/api/farmers/{f['id']}/consents", headers=as_role("mrv_analyst")).status_code == 200

    # a farmer can manage only their own consent
    me = login(client, make_user(org, "farmer", scope={"farmer_id": f["id"]}))
    assert client.get(f"/api/farmers/{f['id']}/consents", headers=me).status_code == 200
    assert sign(client, me, f["id"], t["id"]).status_code == 201
    assert sign(client, me, f["id"], t["id"], method="assisted").status_code == 422
    assert client.post(f"/api/farmers/{f['id']}/consents", headers=me, json={
        "purpose": "share_with_buyers", "granted": False}).status_code == 201
    someone = mk_farmer(client, h, phone="9812345672", name="Someone Else")
    assert client.get(f"/api/farmers/{someone['id']}/consents", headers=me).status_code == 404
    assert client.post(f"/api/farmers/{someone['id']}/consents", headers=me, json={
        "purpose": "sampling", "granted": True}).status_code == 404


def test_consent_tenant_isolation(client, as_role):
    h = as_role("programme_admin")
    f = mk_farmer(client, h)
    t = mk_template(client, h)
    other = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/farmers/{f['id']}/consents", headers=other).status_code == 404
    assert client.get(f"/api/agreement-templates/{t['id']}", headers=other).status_code == 404
    assert client.patch(f"/api/agreement-templates/{t['id']}", headers=other, json={"title": "Hijack"}).status_code == 404
    theirs = mk_farmer(client, other, phone="9812345676")
    assert sign(client, other, theirs["id"], t["id"]).status_code == 404
