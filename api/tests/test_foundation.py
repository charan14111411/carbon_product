import pyotp
import pytest

from app.core import db as dbmod
from app.core.errors import ImmutableRecord
from app.modules.identity.models import AuditEntry, User
from tests.conftest import PASSWORD, login, make_org, make_user


def test_health(client):
    assert client.get("/health").json()["status"] == "ok"


def test_login_success_returns_profile_and_permissions(client, org):
    email = make_user(org, "programme_admin")
    r = client.post("/api/auth/login", json={"email": email, "password": PASSWORD})
    body = r.json()
    assert r.status_code == 200 and body["status"] == "ok"
    assert "land.manage" in body["user"]["permissions"]
    me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {body['access_token']}"})
    assert me.json()["email"] == email


def test_login_wrong_password_is_uniform(client, org):
    email = make_user(org, "farmer")
    a = client.post("/api/auth/login", json={"email": email, "password": "wrong-password"})
    b = client.post("/api/auth/login", json={"email": "nobody@example.com", "password": "wrong-password"})
    assert a.status_code == b.status_code == 401
    assert a.json()["message"] == b.json()["message"]


def test_protected_route_needs_token(client):
    r = client.get("/api/auth/me")
    assert r.status_code == 401 and r.json()["code"] == "UNAUTHORIZED"


def test_permission_is_enforced(client, as_role):
    r = client.get("/api/users", headers=as_role("farmer"))
    assert r.status_code == 403 and r.json()["code"] == "FORBIDDEN"


def test_admin_creates_user_and_it_is_audited(client, as_role):
    h = as_role("programme_admin")
    r = client.post("/api/users", headers=h, json={
        "email": "collector1@example.com", "full_name": "Asha Collector", "role": "field_collector",
        "password": "Collector-Pass-1",
    })
    assert r.status_code == 201, r.text
    log = client.get("/api/audit", headers=h).json()
    assert any(e["action"] == "user.create" for e in log)
    dup = client.post("/api/users", headers=h, json={
        "email": "collector1@example.com", "full_name": "Again", "role": "field_collector", "password": "Collector-Pass-1",
    })
    assert dup.status_code == 409


def test_tenant_isolation_hides_other_orgs_users(client, org):
    other = make_org("Other Org")
    make_user(other, "field_collector", email="theirs@example.com")
    h = login(client, make_user(org, "programme_admin"))
    emails = [u["email"] for u in client.get("/api/users", headers=h).json()]
    assert "theirs@example.com" not in emails
    theirs_id = None
    with dbmod.session_factory()() as s:
        theirs_id = str(s.query(User).filter_by(email="theirs@example.com").one().id)
    r = client.patch(f"/api/users/{theirs_id}", headers=h, json={"full_name": "Hijacked"})
    assert r.status_code == 404


def test_audit_entries_are_append_only(client, as_role):
    h = as_role("programme_admin")
    client.post("/api/users", headers=h, json={
        "email": "x1@example.com", "full_name": "X One", "role": "farmer", "password": "Farmer-Pass-12",
    })
    with dbmod.session_factory()() as s:
        entry = s.query(AuditEntry).first()
        entry.action = "tampered"
        with pytest.raises(ImmutableRecord):
            s.flush()
        s.rollback()
        entry = s.query(AuditEntry).first()
        s.delete(entry)
        with pytest.raises(ImmutableRecord):
            s.flush()


def test_mfa_enrolment_and_login(client, org):
    email = make_user(org, "methodology_owner")
    with dbmod.session_factory()() as s:
        s.query(User).filter_by(email=email).one().mfa_enabled = True
        s.commit()
    r = client.post("/api/auth/login", json={"email": email, "password": PASSWORD}).json()
    assert r["status"] == "mfa_required" and r["access_token"] is None
    setup = client.post("/api/auth/mfa/setup", json={"challenge": r["challenge"]}).json()
    bad = client.post("/api/auth/mfa/verify", json={"challenge": r["challenge"], "code": "000000"})
    assert bad.status_code == 401
    code = pyotp.TOTP(setup["secret"]).now()
    ok = client.post("/api/auth/mfa/verify", json={"challenge": r["challenge"], "code": code})
    assert ok.status_code == 200 and ok.json()["access_token"]


def test_evidence_upload_fingerprint_and_isolation(client, org, as_role):
    h = as_role("field_collector")
    r = client.post("/api/evidence", headers=h, files={"file": ("hole.jpg", b"\xff\xd8fake-jpeg", "image/jpeg")},
                    data={"kind": "photo", "latitude": "12.4", "longitude": "75.7"})
    assert r.status_code == 201, r.text
    ev = r.json()
    import hashlib
    assert ev["sha256"] == hashlib.sha256(b"\xff\xd8fake-jpeg").hexdigest()
    assert client.get(f"/api/evidence/{ev['id']}/verify", headers=h).json()["intact"] is True
    other = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/evidence/{ev['id']}", headers=other).status_code == 404
    bad = client.post("/api/evidence", headers=h, files={"file": ("x.exe", b"MZ", "application/x-msdownload")})
    assert bad.status_code == 422
