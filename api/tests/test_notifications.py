import uuid
from datetime import date

from app.modules.land.models import Enrolment, Field
from app.modules.notifications.models import DeliveryAttempt, Notification, ProcessedEvent
from app.modules.notifications.service import parse_command, render
from app.modules.partners.models import DomainEvent
from app.modules.practices.models import PracticeRecord
from app.modules.risk.models import Grievance
from tests import _p345_factories as fx
from tests.conftest import login, make_org, make_user

OK_PHONE, FAIL_PHONE = "+919800000001", "+919800000010"


def _install(client, as_role):
    r = client.post("/api/notifications/templates/install-defaults", headers=as_role("programme_admin"))
    assert r.status_code == 200, r.text
    return r.json()


def _enrolled_events(org, w):
    with fx.session() as s:
        for e in s.query(Enrolment).filter(Enrolment.project_id == w["project_id"]).all():
            s.add(DomainEvent(org_id=org, event="farmer.enrolled", entity_type="Enrolment", entity_id=str(e.id),
                              payload={"project_id": str(e.project_id), "field_id": str(e.field_id),
                                       "farmer_id": str(e.farmer_id), "area_ha": 1.5}))
        s.commit()


def test_render_and_parse_rules():
    assert render("Hi {farmer_name}", {"farmer_name": "Ravi"}) == "Hi Ravi"
    for bad in ("Hi {farmer.name}", "Hi {0}", "Hi {x!r}", "Hi {", "Hi {x:>5}"):
        try:
            render(bad, {"x": 1, "farmer": 1})
        except Exception as exc:  # noqa: BLE001
            assert getattr(exc, "code", "") == "INVALID_TEMPLATE", bad
        else:
            raise AssertionError(bad)
    try:
        render("Paid {amount}", {})
    except Exception as exc:  # noqa: BLE001
        assert exc.code == "MISSING_PLACEHOLDER"
    assert parse_command("practice Compost 2025-06-01 2.5") == {
        "command": "PRACTICE", "practice_code": "compost", "performed_on": "2025-06-01", "quantity": 2.5}
    assert parse_command("PRACTICE compost 01/06/2025")["performed_on"] == "2025-06-01"
    assert "error" in parse_command("PRACTICE compost yesterday")
    assert "error" in parse_command("PRACTICE compost 2999-01-01")
    assert parse_command("HELP my payment is late")["message"] == "my payment is late"
    assert parse_command("hello")["command"] is None


def test_templates_defaults_versioning_and_four_eyes(client, org, as_role):
    out = _install(client, as_role)
    assert out["installed"] == 12  # 3 messages x (sms, whatsapp) x (en, kn)
    assert _install(client, as_role)["installed"] == 0
    assert client.post("/api/notifications/templates/install-defaults",
                       headers=as_role("field_collector")).status_code == 403
    a1 = login(client, make_user(org, "platform_admin"))
    a2 = login(client, make_user(org, "platform_admin"))
    bad = client.post("/api/notifications/templates", headers=a1, json={
        "code": "welcome", "channel": "sms", "language": "en", "body": "Hello {farmer.name}"})
    assert bad.status_code == 422 and bad.json()["code"] == "INVALID_TEMPLATE"
    t = client.post("/api/notifications/templates", headers=a1, json={
        "code": "welcome", "channel": "sms", "language": "en", "body": "Welcome {farmer_name} to {project_name}!"})
    assert t.status_code == 201 and t.json()["version"] == 2 and t.json()["placeholders"] == ["farmer_name", "project_name"]
    own = client.post(f"/api/notifications/templates/{t.json()['id']}/approve", headers=a1)
    assert own.status_code == 403 and own.json()["code"] == "SELF_APPROVAL_REJECTED"
    ok = client.post(f"/api/notifications/templates/{t.json()['id']}/approve", headers=a2)
    assert ok.json()["status"] == "approved"
    frozen = client.patch(f"/api/notifications/templates/{t.json()['id']}", headers=a1, json={"body": "x"})
    assert frozen.status_code == 409 and frozen.json()["code"] == "TEMPLATE_FROZEN"
    rows = client.get("/api/notifications/templates?code=welcome", headers=a1).json()
    sms_en = {r["version"]: r["status"] for r in rows if r["channel"] == "sms" and r["language"] == "en"}
    assert sms_en == {1: "retired", 2: "approved"}


def test_event_dispatch_consent_language_failures_and_idempotency(client, org, as_role):
    w = fx.world(org, n_farmers=3)
    f0, f1, f2 = w["farmer_ids"]
    fx.set_phone(f0, OK_PHONE, language="kn")
    fx.set_phone(f1, "+919800000002", language="en")
    fx.set_phone(f2, FAIL_PHONE, language="en")
    with fx.session() as s:
        fx.consent(s, org, f0)
        fx.consent(s, org, f2)
        fx.consent(s, org, f1, granted=True, effective_on=date(2024, 1, 1))
        fx.consent(s, org, f1, granted=False, effective_on=date(2024, 6, 1))  # withdrawn
        fx.practice_type(s, org, "compost")
        rec = fx.practice(s, org, s.get(Field, w["field_ids"][0]), "compost", date(2025, 6, 1))
        s.add(DomainEvent(org_id=org, event="practice.recorded", entity_type="PracticeRecord", entity_id=str(rec.id),
                          payload={}))
        s.add(DomainEvent(org_id=org, event="sale.created", entity_type="Sale", entity_id=str(uuid.uuid4()),
                          payload={}))  # not a notification trigger
        s.commit()
    _install(client, as_role)
    _enrolled_events(org, w)
    h = as_role("programme_admin")
    r = client.post("/api/notifications/dispatch-events", headers=h)
    assert r.status_code == 200, r.text
    assert r.json()["events_processed"] == 4 and r.json()["by_status"] == {"delivered": 2, "skipped": 1, "failed": 1}
    again = client.post("/api/notifications/dispatch-events", headers=h).json()
    assert again["events_processed"] == 0 and again["notifications"] == 0

    rows = client.get("/api/notifications", headers=h).json()
    by = {(n["farmer_id"], n["trigger"]): n for n in rows}
    welcome0 = by[(str(f0), "farmer.enrolled")]
    assert welcome0["status"] == "delivered" and welcome0["language"] == "kn" and "ನಮಸ್ಕಾರ" in welcome0["body"]
    assert welcome0["provider_ref"].startswith("SIMMSG-") and welcome0["address"] == "+91******0001"
    thanks = by[(str(f0), "practice.recorded")]
    assert thanks["status"] == "delivered" and "2025-06-01" in thanks["body"]
    skipped = by[(str(f1), "farmer.enrolled")]
    assert skipped["status"] == "skipped" and skipped["skip_reason"] == "NO_CONSENT" and skipped["body"] == ""
    failed = by[(str(f2), "farmer.enrolled")]
    assert failed["status"] == "failed" and "simulated" in failed["last_error"] and failed["language"] == "en"
    retry = client.post(f"/api/notifications/{failed['id']}/retry", headers=h).json()
    assert retry["status"] == "failed" and retry["attempts"] == 2
    assert client.post(f"/api/notifications/{welcome0['id']}/retry", headers=h).status_code == 409
    assert len(client.get("/api/notifications?status=skipped", headers=h).json()) == 1
    with fx.session() as s:
        assert s.query(ProcessedEvent).count() == 4
        assert s.query(DeliveryAttempt).count() == 4  # 2 delivered + 1 failed + 1 retry
    rival = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get("/api/notifications", headers=rival).json() == []
    assert client.get(f"/api/notifications/{welcome0['id']}", headers=rival).status_code == 404
    assert client.post("/api/notifications/dispatch-events", headers=rival).json()["events_processed"] == 0
    assert client.get("/api/notifications", headers=as_role("mrv_analyst")).status_code == 403


def test_payout_completed_sends_payment_statement(client, org, as_role):
    from tests.test_payments import _approved_pool, _approved_rule, _profile, _setup

    w, sale = _setup(client, org, as_role, n_farmers=3, unit_price="1000.00")
    _approved_rule(client, as_role, w["programme_id"], min_payout="0")
    pool = _approved_pool(client, as_role, sale["id"])
    maker = as_role("finance_maker")
    f0, f1, f2 = w["farmer_ids"]
    _profile(client, maker, str(f2), "two@okbank")
    fx.set_phone(f0, OK_PHONE, language="en")
    with fx.session() as s:
        fx.consent(s, org, f0)
        s.commit()
    _profile(client, maker, str(f0), "zero@okbank")
    _profile(client, maker, str(f1), "one@okbank")
    b = client.post(f"/api/benefit-pools/{pool['id']}/payout-batch", headers=maker).json()
    client.post(f"/api/payout-batches/{b['id']}/approve", headers=as_role("finance_checker"))
    done = client.post(f"/api/payout-batches/{b['id']}/submit", headers=maker).json()
    assert done["status"] == "completed"
    _install(client, as_role)
    h = as_role("programme_admin")
    client.post("/api/notifications/dispatch-events", headers=h)
    rows = client.get("/api/notifications?trigger=payout.completed", headers=h).json()
    line = next(x for x in done["lines"] if x["farmer_id"] == str(f0))
    sent = next(n for n in rows if n["farmer_id"] == str(f0))
    assert sent["status"] == "delivered" and line["amount"] in sent["body"] and done["code"] in sent["body"]
    assert next(n for n in rows if n["farmer_id"] == str(f1))["skip_reason"] == "NO_CONSENT"


def test_manual_send_rules(client, org, as_role):
    w = fx.world(org, n_farmers=2)
    f0, f1 = w["farmer_ids"]
    fx.set_phone(f0, OK_PHONE)
    with fx.session() as s:
        fx.consent(s, org, f0)
        s.commit()
    h = as_role("programme_admin")
    no_consent = client.post("/api/notifications/send", headers=h,
                             json={"farmer_id": str(f1), "body": "Meeting on Friday"})
    assert no_consent.status_code == 409 and no_consent.json()["code"] == "NO_CONSENT"
    both = client.post("/api/notifications/send", headers=h,
                       json={"farmer_id": str(f0), "body": "x", "template_code": "welcome"})
    assert both.status_code == 422
    missing = client.post("/api/notifications/send", headers=h,
                          json={"farmer_id": str(f0), "body": "Paid {amount}"})
    assert missing.status_code == 422 and missing.json()["code"] == "MISSING_PLACEHOLDER"
    no_tpl = client.post("/api/notifications/send", headers=h,
                         json={"farmer_id": str(f0), "template_code": "welcome", "channel": "ivr"})
    assert no_tpl.status_code == 409 and no_tpl.json()["code"] == "TEMPLATE_MISSING"
    ok = client.post("/api/notifications/send", headers=h, json={
        "farmer_id": str(f0), "channel": "whatsapp", "body": "Dear {farmer_name}, meeting on {day}.",
        "context": {"day": "Friday"}})
    assert ok.status_code == 201 and ok.json()["status"] == "delivered" and ok.json()["body"].endswith("meeting on Friday.")
    no_email = client.post("/api/notifications/send", headers=h, json={"farmer_id": str(f0), "channel": "email",
                                                                       "body": "Hello"})
    assert no_email.status_code == 422 and no_email.json()["code"] == "NO_ADDRESS"
    uid = str(fx.uid(make_user(org, "finance_checker")))
    to_user = client.post("/api/notifications/send", headers=h,
                          json={"user_id": uid, "channel": "email", "body": "Batch ready for review"})
    assert to_user.status_code == 201 and to_user.json()["status"] == "delivered" and "@" in to_user.json()["address"]
    assert client.post("/api/notifications/send", headers=as_role("mrv_analyst"),
                       json={"farmer_id": str(f0), "body": "Hi"}).status_code == 403


def test_inbound_practice_review_and_help(client, org, as_role):
    w = fx.world(org, n_farmers=1)
    f0 = w["farmer_ids"][0]
    fx.set_phone(f0, OK_PHONE)
    with fx.session() as s:
        fx.practice_type(s, org, "compost")
        s.commit()
    h = as_role("programme_admin")
    r = client.post("/api/notifications/inbound", headers=h, json={"phone": "+91 98000 00001",
                                                                  "text": "PRACTICE compost 2025-06-01 2"})
    assert r.status_code == 201, r.text
    m = r.json()
    assert m["status"] == "pending_review" and m["farmer_id"] == str(f0)
    assert m["parsed"]["known_practice"] is True and m["parsed"]["suggested_field_id"] == str(w["field_ids"][0])
    with fx.session() as s:
        assert s.query(PracticeRecord).count() == 0  # never written directly
    bad = client.post("/api/notifications/inbound", headers=h, json={"phone": OK_PHONE, "text": "PRACTICE compost soon"})
    assert bad.json()["status"] == "unrecognised" and "date" in bad.json()["error"]
    stranger = client.post("/api/notifications/inbound", headers=h,
                           json={"phone": "+919812399999", "text": "PRACTICE compost 2025-06-01"})
    assert stranger.json()["status"] == "unmatched"
    help_ = client.post("/api/notifications/inbound", headers=h, json={"phone": OK_PHONE, "text": "HELP payment not received"})
    assert help_.json()["status"] == "processed" and help_.json()["grievance_id"]
    g = client.get(f"/api/grievances/{help_.json()['grievance_id']}", headers=h).json()
    assert g["channel"] == "whatsapp" and g["farmer_id"] == str(f0) and "payment not received" in g["description"]

    fc = as_role("field_collector")
    queue = client.get("/api/notifications/inbound?status=pending_review", headers=fc).json()
    assert [x["id"] for x in queue] == [m["id"]]
    reject = client.post(f"/api/notifications/inbound/{m['id']}/review", headers=fc, json={"decision": "reject"})
    assert reject.status_code == 422 and reject.json()["code"] == "NOTE_REQUIRED"
    other = fx.world(org)
    wrong_field = client.post(f"/api/notifications/inbound/{m['id']}/review", headers=fc,
                              json={"decision": "accept", "field_id": str(other["field_ids"][0])})
    assert wrong_field.status_code == 422 and wrong_field.json()["code"] == "FIELD_NOT_FARMERS"
    ok = client.post(f"/api/notifications/inbound/{m['id']}/review", headers=fc, json={"decision": "accept"})
    assert ok.status_code == 200, ok.text
    assert ok.json()["status"] == "accepted" and ok.json()["practice_record_id"]
    with fx.session() as s:
        rec = s.query(PracticeRecord).one()
        assert rec.source == "whatsapp" and rec.quantity == 2 and rec.details.get("client_ref") == f"inbound-{m['id']}"
        assert s.query(Grievance).count() == 1
    assert client.post(f"/api/notifications/inbound/{m['id']}/review", headers=fc,
                       json={"decision": "accept"}).status_code == 409
    assert client.post("/api/notifications/inbound", headers=as_role("mrv_analyst"),
                       json={"phone": OK_PHONE, "text": "HELP"}).status_code == 403
    with fx.session() as s:
        assert s.query(Notification).count() == 0
