import hashlib
import hmac
import json
import re
import uuid
from datetime import date

from app.core import db as dbmod
from app.modules.evidence.models import EvidenceFile
from app.modules.identity.models import AuditEntry
from app.modules.partners import service
from app.modules.partners.models import ApiKey, DomainEvent, WebhookDelivery
from app.modules.practices.models import PracticeRecord
from app.modules.verification.models import VerificationPackage
from tests import _p345_factories as fx
from tests.conftest import login, make_org, make_user


def _key(client, h, scopes=("read",)):
    r = client.post("/api/partners/api-keys", headers=h, json={"name": "Agri ERP", "scopes": list(scopes)})
    assert r.status_code == 201, r.text
    return r.json()


# ------------------------------------------------------------------ keys & auth
def test_api_key_shown_once_hashed_and_revocable(client, org, as_role):
    h = as_role("programme_admin")
    k = _key(client, h)
    assert re.fullmatch(r"vcp_[0-9a-f]{8}_[A-Za-z0-9_-]{20,}", k["key"]) and k["key"].startswith(f"vcp_{k['prefix']}_")
    listed = client.get("/api/partners/api-keys", headers=h).json()
    assert "key" not in listed[0] and "key_sha256" not in listed[0]
    with fx.session() as s:
        row = s.query(ApiKey).one()
        assert row.key_sha256 == hashlib.sha256(k["key"].encode()).hexdigest() and k["key"] not in str(row.__dict__)
        assert all(k["key"] not in str(a.after) for a in s.query(AuditEntry).all())
    ph = {"X-API-Key": k["key"]}
    assert client.get("/api/partner/v1/projects", headers=ph).status_code == 200
    assert client.get("/api/partner/v1/projects").status_code == 401
    assert client.get("/api/partner/v1/projects", headers={"X-API-Key": k["key"][:-1] + "x"}).status_code == 401
    assert client.get("/api/partner/v1/projects", headers={"X-API-Key": "nonsense"}).json()["code"] == "INVALID_API_KEY"
    assert client.post(f"/api/partners/api-keys/{k['id']}/revoke", headers=h).json()["is_active"] is False
    assert client.get("/api/partner/v1/projects", headers=ph).status_code == 401
    assert client.post("/api/partners/api-keys", headers=as_role("mrv_analyst"),
                       json={"name": "x y", "scopes": ["read"]}).status_code == 403
    assert client.post("/api/partners/api-keys", headers=h, json={"name": "bad", "scopes": ["admin"]}).status_code == 422


def test_partner_projects_and_results_are_org_scoped(client, org, as_role):
    w = fx.world(org)
    run_id = fx.approved_run(org, w, reductions=10, removals=20)
    fx.approved_run(org, w, status="rejected")
    with fx.session() as s:
        ev = EvidenceFile(org_id=org, sha256="a" * 64, kind="package", filename="p.json", mime_type="application/json",
                          size_bytes=2, storage_key="k")
        s.add(ev)
        s.flush()
        s.add(VerificationPackage(org_id=org, run_id=run_id, project_id=w["project_id"], version=1, sha256="b" * 64,
                                  json_file_id=ev.id))
        s.commit()
    rival_org = make_org("Rival")
    rival = fx.world(rival_org)
    ph = {"X-API-Key": _key(client, as_role("programme_admin"))["key"]}
    projects = client.get("/api/partner/v1/projects", headers=ph).json()
    assert [p["id"] for p in projects] == [str(w["project_id"])] and set(projects[0]) == {"id", "code", "name", "status"}
    res = client.get(f"/api/partner/v1/projects/{w['project_id']}/results", headers=ph).json()["results"]
    assert len(res) == 1 and res[0]["net_t_co2e"] == 30 and res[0]["package_sha256"] == "b" * 64
    assert client.get(f"/api/partner/v1/projects/{rival['project_id']}/results", headers=ph).status_code == 404
    assert client.get("/api/partner/v1/projects/not-a-uuid/results", headers=ph).status_code == 404


def test_partner_practice_write_validation_and_idempotency(client, org, as_role):
    w = fx.world(org)
    with fx.session() as s:
        fx.practice_type(s, org, "cover_crop")
        s.commit()
    h = as_role("programme_admin")
    read_only = {"X-API-Key": _key(client, h)["key"]}
    ph = {"X-API-Key": _key(client, h, scopes=("read", "write_practices"))["key"]}
    body = {"field_id": str(w["field_ids"][0]), "practice_code": "cover_crop", "performed_on": "2025-06-01",
            "client_ref": "erp-0001", "details": {"species": "sunn hemp"}}
    assert client.post("/api/partner/v1/practices", headers=read_only, json=body).status_code == 403
    rival_field = fx.world(make_org("Rival"))["field_ids"][0]
    assert client.post("/api/partner/v1/practices", headers=ph, json={**body, "field_id": str(rival_field)}).status_code == 404
    unknown = client.post("/api/partner/v1/practices", headers=ph, json={**body, "practice_code": "moon_dance"})
    assert unknown.status_code == 422 and unknown.json()["code"] == "UNKNOWN_PRACTICE"
    fut = client.post("/api/partner/v1/practices", headers=ph, json={**body, "performed_on": "2099-01-01"})
    assert fut.status_code == 422
    r = client.post("/api/partner/v1/practices", headers=ph, json=body)
    assert r.status_code == 201, r.text
    rec = r.json()
    assert rec["source"] == "partner" and rec["version"] == 1 and rec["details"]["client_ref"] == "erp-0001"
    again = client.post("/api/partner/v1/practices", headers=ph, json={**body, "details": {"species": "changed"}})
    assert again.status_code == 200 and again.json()["id"] == rec["id"] and again.json()["replayed"]
    with fx.session() as s:
        assert s.query(PracticeRecord).count() == 1
        assert s.query(DomainEvent).filter_by(event="practice.recorded").count() == 1
        assert s.query(AuditEntry).filter_by(action="practice.create").one().reason.startswith("Partner API key")


# ------------------------------------------------------------------ webhooks
def test_webhook_url_and_event_rules(client, org, as_role):
    h = as_role("programme_admin")
    bad = client.post("/api/partners/webhooks", headers=h, json={"url": "http://example.com/hook", "events": ["sale.created"]})
    assert bad.status_code == 422 and bad.json()["code"] == "INSECURE_WEBHOOK_URL"
    ev = client.post("/api/partners/webhooks", headers=h, json={"url": "https://example.com/h", "events": ["nope"]})
    assert ev.status_code == 422 and ev.json()["code"] == "UNKNOWN_EVENT"
    local = client.post("/api/partners/webhooks", headers=h, json={"url": "http://localhost:9000/h", "events": ["sale.created"]})
    assert local.status_code == 201
    ok = client.post("/api/partners/webhooks", headers=h, json={"url": "https://erp.example.com/h",
                                                                 "events": ["credits.issued", "sale.created"]}).json()
    assert len(ok["secret"]) == 64
    assert all("secret" not in x for x in client.get("/api/partners/webhooks", headers=h).json())
    with fx.session() as s:
        assert all(ok["secret"] not in json.dumps(a.after) for a in s.query(AuditEntry).all())
    patched = client.patch(f"/api/partners/webhooks/{ok['id']}", headers=h, json={"url": "http://evil.example.com"})
    assert patched.status_code == 422
    off = client.delete(f"/api/partners/webhooks/{ok['id']}", headers=h).json()
    assert off["is_active"] is False
    rival = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/partners/webhooks/{ok['id']}", headers=rival).status_code == 404


def test_outbox_dispatch_signs_retries_and_never_redelivers(client, org, as_role):
    h = as_role("programme_admin")
    w = fx.world(org)
    fx.issued_batch(client, h, fx.approved_run(org, w))  # event raised BEFORE the webhook exists
    hook = client.post("/api/partners/webhooks", headers=h, json={"url": "https://erp.example.com/h",
                                                                   "events": ["credits.issued"]}).json()
    other = client.post("/api/partners/webhooks", headers=h, json={"url": "https://crm.example.com/h",
                                                                    "events": ["sale.created"]}).json()
    batch = fx.issued_batch(client, h, fx.approved_run(org, w))
    rival_org = make_org("Rival")
    fx.issued_batch(client, login(client, make_user(rival_org, "programme_admin")), fx.approved_run(rival_org, fx.world(rival_org)))

    calls = []

    def failing(url, body, headers):
        calls.append((url, body, headers))
        return 503

    with dbmod.session_factory()() as s:
        stats = service.dispatch_pending(s, sender=failing)
        s.commit()
    assert stats == {"attempted": 1, "delivered": 0, "failed": 1, "gave_up": 0}
    url, body, headers = calls[0]
    assert url == "https://erp.example.com/h"
    payload = json.loads(body)
    assert payload["event"] == "credits.issued" and payload["entity_id"] == batch["id"]
    assert headers["X-Event-Id"] == payload["id"]
    expected = "sha256=" + hmac.new(hook["secret"].encode(), body, hashlib.sha256).hexdigest()
    assert headers["X-Signature"] == expected

    def boom(url, body, headers):
        raise ConnectionError("receiver down")

    with dbmod.session_factory()() as s:
        assert service.dispatch_pending(s, sender=boom)["failed"] == 1
        s.commit()
    ok_calls = []
    with dbmod.session_factory()() as s:
        assert service.dispatch_pending(s, sender=lambda u, b, hd: ok_calls.append(hd) or 200)["delivered"] == 1
        s.commit()
    assert ok_calls[0]["X-Attempt"] == "3"
    with dbmod.session_factory()() as s:
        assert service.dispatch_pending(s, sender=lambda u, b, hd: 200)["attempted"] == 0
        rows = s.query(WebhookDelivery).order_by(WebhookDelivery.attempt).all()
        assert [(d.attempt, d.ok) for d in rows] == [(1, False), (2, False), (3, True)]
        assert rows[1].error.startswith("ConnectionError") and rows[0].status_code == 503
    assert client.get(f"/api/partners/webhooks/{hook['id']}/deliveries", headers=h).json()[0]["ok"] is True
    assert client.get(f"/api/partners/webhooks/{other['id']}/deliveries", headers=h).json() == []
    evs = client.get("/api/partners/events?event=credits.issued", headers=h).json()
    assert len(evs) == 2  # only this organisation's events


def test_dispatch_endpoint_uses_default_sender(client, org, as_role, monkeypatch):
    h = as_role("programme_admin")
    client.post("/api/partners/webhooks", headers=h, json={"url": "https://erp.example.com/h", "events": ["sale.created"]})
    w = fx.world(org)
    batch = fx.issued_batch(client, h, fx.approved_run(org, w))
    buyer = fx.buyer(client, h)
    client.post("/api/sales", headers=h, json={"buyer_id": buyer["id"], "batch_id": batch["id"],
                                               "credit_type": "removal", "quantity": 1, "unit_price": "10"})
    sent = []
    monkeypatch.setattr(service, "default_sender", lambda u, b, hd: sent.append(u) or 202)
    r = client.post("/api/partners/webhooks/dispatch", headers=h)
    assert r.status_code == 200 and r.json()["delivered"] == 1 and sent == ["https://erp.example.com/h"]
    assert client.post("/api/partners/webhooks/dispatch", headers=as_role("mrv_analyst")).status_code == 403


# ------------------------------------------------------------------ forecast
def test_forecast_is_modelled_and_trends(client, org, as_role):
    w = fx.world(org)
    h = as_role("programme_admin")
    empty = client.get(f"/api/projects/{w['project_id']}/forecast", headers=h).json()
    assert empty["years"] == [] and empty["data_class"] == "MODELLED"
    fx.approved_run(org, w, reductions=40, removals=60, uncertainty=10, gross=120,
                    period_start=date(2023, 1, 1), period_end=date(2023, 12, 31))
    fx.approved_run(org, w, reductions=50, removals=70, uncertainty=12, gross=142,
                    period_start=date(2024, 1, 1), period_end=date(2024, 12, 31))
    fx.approved_run(org, w, reductions=500, removals=500, status="rejected",
                    period_start=date(2025, 1, 1), period_end=date(2025, 12, 31))
    f = client.get(f"/api/projects/{w['project_id']}/forecast?years=3", headers=h).json()
    assert f["data_class"] == "MODELLED" and f["method"].startswith("linear") and len(f["history"]) == 2
    assert [y["year"] for y in f["years"]] == [2025, 2026, 2027]
    assert f["years"][0]["projected_t_co2e"] > f["history"][-1]["annualised_net_t_co2e"]
    assert all(y["low_t_co2e"] <= y["projected_t_co2e"] <= y["high_t_co2e"] for y in f["years"])
    assert client.get(f"/api/projects/{w['project_id']}/forecast?years=50", headers=h).status_code == 422


# ------------------------------------------------------------------ assistant
def test_assistant_answers_from_the_saved_run_and_admits_limits(client, org, as_role):
    w = fx.world(org)
    run_id = fx.approved_run(
        org, w, reductions=30, removals=50, buffer=8, uncertainty=12, gross=100,
        inputs={"strata": [{"code": "Z1", "samples": [{"code": "S-001"}, {"code": "S-002"}]}]},
        rules={"pack_id": "p1", "methodology": "VM0042 v2.2 rev 1",
               "values": {"buffer_pct": 10, "uncertainty_confidence": 0.9, "stock_depth_cm": 30},
               "sources": {"buffer_pct": "VM0042 §9.1", "stock_depth_cm": "VM0042 §8.1"}})
    h = as_role("mrv_analyst")

    def ask(q, rid=str(run_id)):
        r = client.post("/api/assistant/ask", headers=h, json={"question": q, "run_id": rid})
        assert r.status_code == 200, r.text
        return r.json()

    a = ask("Where did this number come from?")
    assert a["answered"] and a["intent"] == "numbers" and "80" in a["answer"] and "100" in a["answer"]
    assert a["citations"][0] == {"type": "calculation_run", "id": str(run_id), "snapshot_sha256": "0" * 64}
    d = ask("Why was the buffer deduction taken?")
    assert d["intent"] == "deductions" and "buffer_pct = 10" in d["answer"] and "VM0042 §9.1" in d["answer"]
    assert {"type": "rule", "key": "buffer_pct", "source": "VM0042 §9.1"} in d["citations"]
    s = ask("Which samples were used?")
    assert s["answered"] and "S-001" in s["answer"] and {"type": "sample", "ref": "S-002"} in s["citations"]
    r = ask("What rules applied?")
    assert r["answered"] and "stock_depth_cm = 30" in r["answer"]
    unknown = ask("What's the weather tomorrow?")
    assert unknown["answered"] is False and "can't answer" in unknown["answer"]
    no_run = ask("Where did this number come from?", rid=None)
    assert no_run["answered"] is False and "which calculation" in no_run["answer"].lower()
    bare = fx.approved_run(org, w)
    assert ask("which samples?", rid=str(bare))["answered"] is False
    rival = login(client, make_user(make_org("Rival"), "mrv_analyst"))
    assert client.post("/api/assistant/ask", headers=rival,
                       json={"question": "where did this come from", "run_id": str(run_id)}).status_code == 404
    assert client.post("/api/assistant/ask", headers=as_role("farmer"), json={"question": "rules?"}).status_code == 403
    assert uuid.UUID(a["run_id"])
