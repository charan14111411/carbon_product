import random
import uuid
from datetime import date
from decimal import Decimal

from app.modules.identity.models import AuditEntry
from app.modules.land.models import Field
from app.modules.partners.models import DomainEvent
from app.modules.payments import domain
from app.modules.payments.models import Entitlement, PaymentProfile, Payout
from tests import _p345_factories as fx
from tests.conftest import login, make_org, make_user

RULE = {"farmer_share_pct": "60", "weights": {"area": 0.5, "practices": 0.5},
        "deductions": [{"name": "Verification fee", "pct": 5}, {"name": "Registry fee", "pct": 2.5}],
        "min_payout": "50.00"}


def _setup(client, org, as_role, n_farmers=3, unit_price="1000.01", quantity=10):
    w = fx.world(org, n_farmers=n_farmers)
    with fx.session() as s:
        F = [s.get(Field, x) for x in w["field_ids"]]
        fx.practice(s, org, F[0], "cover_crop", date(2024, 6, 1))
        fx.practice(s, org, F[0], "compost", date(2024, 7, 1))
        fx.practice(s, org, F[1], "compost", date(2024, 7, 1))
        fx.practice(s, org, F[2], "compost", date(2023, 7, 1))  # outside the credited period
        fx.practice(s, org, F[2], "compost", date(2024, 7, 1), scenario="baseline")  # baseline doesn't count
        s.commit()
    admin = as_role("programme_admin")
    batch = fx.issued_batch(client, admin, fx.approved_run(org, w))
    buyer = fx.buyer(client, admin)
    sale = fx.delivered_sale(client, admin, batch["id"], buyer["id"], quantity=quantity, unit_price=unit_price)
    return w, sale


def _approved_rule(client, as_role, programme_id, **over):
    r = client.post("/api/benefit-rules", headers=as_role("finance_maker"),
                    json={**RULE, **over, "programme_id": str(programme_id)})
    assert r.status_code == 201, r.text
    ok = client.post(f"/api/benefit-rules/{r.json()['id']}/approve", headers=as_role("finance_checker"))
    assert ok.status_code == 200, ok.text
    return ok.json()


def _approved_pool(client, as_role, sale_id):
    p = client.post(f"/api/sales/{sale_id}/benefit-pool", headers=as_role("finance_maker"))
    assert p.status_code == 201, p.text
    a = client.post(f"/api/benefit-pools/{p.json()['id']}/approve", headers=as_role("finance_checker"))
    assert a.status_code == 200, a.text
    return a.json()


# ------------------------------------------------------------------ rules
def test_benefit_rule_validation(client, org, as_role):
    w = fx.world(org)
    h = as_role("finance_maker")
    base = {**RULE, "programme_id": str(w["programme_id"])}
    for bad in ({"weights": {"area": 0.5, "practices": 0.4}}, {"weights": {"area": 0.5, "luck": 0.5}},
                {"farmer_share_pct": "101"}, {"deductions": [{"name": "Big", "pct": 70}, {"name": "Bigger", "pct": 40}]},
                {"weights": {}}):
        r = client.post("/api/benefit-rules", headers=h, json={**base, **bad})
        assert r.status_code == 422, bad
    ok = client.post("/api/benefit-rules", headers=h, json={**base, "weights": {"credits": 0.3, "area": 0.7000001}})
    assert ok.status_code == 201 and ok.json()["version"] == 1 and ok.json()["status"] == "draft"
    assert client.post("/api/benefit-rules", headers=as_role("finance_checker"), json=base).status_code == 403


def test_benefit_rule_four_eyes_frozen_and_versioned(client, org, as_role):
    w = fx.world(org)
    maker = as_role("finance_maker")
    r = client.post("/api/benefit-rules", headers=maker, json={**RULE, "programme_id": str(w["programme_id"])}).json()
    assert client.patch(f"/api/benefit-rules/{r['id']}", headers=maker, json={"farmer_share_pct": "65"}).json()["farmer_share_pct"] == "65.00"
    assert client.post(f"/api/benefit-rules/{r['id']}/approve", headers=maker).status_code == 403  # no permission
    a1 = login(client, make_user(org, "platform_admin"))
    a2 = login(client, make_user(org, "platform_admin"))
    own = client.post("/api/benefit-rules", headers=a1, json={**RULE, "programme_id": str(w["programme_id"])}).json()
    assert client.post(f"/api/benefit-rules/{own['id']}/approve", headers=a1).json()["code"] == "SELF_APPROVAL_REJECTED"
    client.patch(f"/api/benefit-rules/{own['id']}", headers=a2, json={"notes": "tweaked"})
    assert client.post(f"/api/benefit-rules/{own['id']}/approve", headers=a2).json()["code"] == "SELF_APPROVAL_REJECTED"

    checker = as_role("finance_checker")
    assert client.post(f"/api/benefit-rules/{r['id']}/approve", headers=checker).json()["status"] == "approved"
    frozen = client.patch(f"/api/benefit-rules/{r['id']}", headers=maker, json={"notes": "late change"})
    assert frozen.status_code == 409 and frozen.json()["code"] == "RULE_FROZEN"
    assert client.post(f"/api/benefit-rules/{r['id']}/approve", headers=checker).status_code == 409
    assert client.post(f"/api/benefit-rules/{own['id']}/approve", headers=checker).json()["version"] == 2
    rules = {x["version"]: x["status"] for x in client.get(
        f"/api/benefit-rules?programme_id={w['programme_id']}", headers=maker).json()}
    assert rules == {1: "retired", 2: "approved"}


# ------------------------------------------------------------------ pools
def test_pool_requirements(client, org, as_role):
    w = fx.world(org)
    admin = as_role("programme_admin")
    batch = fx.issued_batch(client, admin, fx.approved_run(org, w))
    buyer = fx.buyer(client, admin)
    reserved = client.post("/api/sales", headers=admin, json={"buyer_id": buyer["id"], "batch_id": batch["id"],
                                                              "credit_type": "removal", "quantity": 1,
                                                              "unit_price": "100"}).json()
    r = client.post(f"/api/sales/{reserved['id']}/benefit-pool", headers=as_role("finance_maker"))
    assert r.status_code == 409 and r.json()["code"] == "SALE_NOT_DELIVERED"
    sale = fx.delivered_sale(client, admin, batch["id"], buyer["id"], quantity=2)
    missing = client.post(f"/api/sales/{sale['id']}/benefit-pool", headers=as_role("finance_maker"))
    assert missing.status_code == 409 and missing.json()["code"] == "BENEFIT_RULE_MISSING"
    # a draft rule is not enough
    client.post("/api/benefit-rules", headers=as_role("finance_maker"), json={**RULE, "programme_id": str(w["programme_id"])})
    assert client.post(f"/api/sales/{sale['id']}/benefit-pool",
                       headers=as_role("finance_maker")).json()["code"] == "BENEFIT_RULE_MISSING"


def test_pool_split_is_exact_and_explained(client, org, as_role):
    w, sale = _setup(client, org, as_role, unit_price="1000.01", quantity=10)
    _approved_rule(client, as_role, w["programme_id"])
    r = client.post(f"/api/sales/{sale['id']}/benefit-pool", headers=as_role("finance_maker"))
    assert r.status_code == 201, r.text
    pool = r.json()
    assert pool["gross_amount"] == "10000.10"
    assert pool["deductions_amount"] == "750.01"  # 500.01 (5%) + 250.00 (2.5%)
    assert pool["farmer_pool_amount"] == "5550.05"  # 60% of 9250.09
    ents = pool["entitlements"]
    assert len(ents) == 3
    assert sum(Decimal(e["amount"]) for e in ents) == Decimal(pool["farmer_pool_amount"])
    by_farmer = {e["farmer_id"]: e for e in ents}
    f0, f1, f2 = (str(x) for x in w["farmer_ids"])
    assert by_farmer[f0]["inputs"]["practices"] == 2 and by_farmer[f1]["inputs"]["practices"] == 1
    assert by_farmer[f2]["inputs"]["practices"] == 0
    assert by_farmer[f2]["inputs"]["area_ha"] > by_farmer[f1]["inputs"]["area_ha"] > by_farmer[f0]["inputs"]["area_ha"]
    assert by_farmer[f0]["inputs"]["rule_version"] == 1 and by_farmer[f0]["inputs"]["weights"] == RULE["weights"]
    # area shares 1:4:9 (of 14), practice shares 2:1:0 (of 3)
    expected0 = Decimal("5550.05") * (Decimal(1) / 14 * Decimal("0.5") + Decimal(2) / 3 * Decimal("0.5"))
    assert abs(Decimal(by_farmer[f0]["amount"]) - expected0) <= Decimal("0.01")
    assert client.post(f"/api/sales/{sale['id']}/benefit-pool", headers=as_role("finance_maker")).json()["code"] == "POOL_EXISTS"

    self_approve = login(client, make_user(org, "platform_admin"))
    w2, sale2 = _setup(client, org, as_role)
    _approved_rule(client, as_role, w2["programme_id"])
    own = client.post(f"/api/sales/{sale2['id']}/benefit-pool", headers=self_approve).json()
    assert client.post(f"/api/benefit-pools/{own['id']}/approve", headers=self_approve).json()["code"] == "SELF_APPROVAL_REJECTED"
    ok = client.post(f"/api/benefit-pools/{pool['id']}/approve", headers=as_role("finance_checker"))
    assert ok.json()["status"] == "approved"
    assert client.post(f"/api/benefit-pools/{pool['id']}/approve", headers=as_role("finance_checker")).status_code == 409
    other = login(client, make_user(make_org("Rival"), "finance_checker"))
    assert client.get(f"/api/benefit-pools/{pool['id']}", headers=other).status_code == 404


def test_allocation_always_sums_exactly():
    rng = random.Random(7)
    for _ in range(300):
        pool = Decimal(rng.randint(0, 10_000_000)) / 100
        scores = {f"f{i:03d}": Decimal(str(rng.random() + 0.0001)) for i in range(rng.randint(1, 40))}
        split = domain.allocate(pool, scores)
        assert sum(split.values(), Decimal(0)) == pool
        assert all(v >= 0 and v == v.quantize(Decimal("0.01")) for v in split.values())
    even = domain.allocate(Decimal("100.00"), {"a": Decimal(1), "b": Decimal(1), "c": Decimal(1)})
    assert even == {"a": Decimal("33.34"), "b": Decimal("33.33"), "c": Decimal("33.33")}


# ------------------------------------------------------------------ payment profiles
def test_payment_profile_validation_masking_and_self_service(client, org, as_role):
    w = fx.world(org)
    f0, f1 = (str(x) for x in w["farmer_ids"])
    h = as_role("finance_maker")
    for bad in ({"method": "upi", "upi_id": "not-an-upi", "account_name": "Ravi"},
                {"method": "bank", "account_number": "12345", "ifsc": "SBIN0001234", "account_name": "Ravi"},
                {"method": "bank", "account_number": "123456789012", "ifsc": "SBIN1234", "account_name": "Ravi"}):
        assert client.put(f"/api/farmers/{f0}/payment-profile", headers=h, json=bad).status_code == 422
    r = client.put(f"/api/farmers/{f0}/payment-profile", headers=h, json={
        "method": "bank", "account_number": "123456789012", "ifsc": "sbin0001234", "account_name": "Ravi Kumar"})
    assert r.status_code == 200 and r.json()["account_masked"] == "XXXXXX9012" and r.json()["ifsc"] == "SBIN0001234"
    assert "123456789012" not in r.text
    with fx.session() as s:
        for a in s.query(AuditEntry).all():
            assert "123456789012" not in str(a.after) + str(a.before)
        assert s.query(PaymentProfile).one().account_masked == "XXXXXX9012"
    v = client.post(f"/api/farmers/{f0}/payment-profile/verify", headers=h)
    assert v.json()["verified"] is True
    # changing details clears verification
    again = client.put(f"/api/farmers/{f0}/payment-profile", headers=h,
                       json={"method": "upi", "upi_id": "ravi@okbank", "account_name": "Ravi Kumar"})
    assert again.json()["verified"] is False and again.json()["account_masked"] is None

    me = login(client, make_user(org, "farmer", scope={"farmer_id": f1}))
    own = client.put(f"/api/farmers/{f1}/payment-profile", headers=me,
                     json={"method": "upi", "upi_id": "lakshmi@upi", "account_name": "Lakshmi"})
    assert own.status_code == 200
    assert client.put(f"/api/farmers/{f0}/payment-profile", headers=me,
                      json={"method": "upi", "upi_id": "xy@upi", "account_name": "Hacker"}).status_code == 404
    assert client.get(f"/api/farmers/{f0}/payment-profile", headers=me).status_code == 404
    assert client.post(f"/api/farmers/{f1}/payment-profile/verify", headers=me).status_code == 403
    other = login(client, make_user(make_org("Rival"), "finance_maker"))
    assert client.put(f"/api/farmers/{f0}/payment-profile", headers=other,
                      json={"method": "upi", "upi_id": "xy@upi", "account_name": "X Y"}).status_code == 404


# ------------------------------------------------------------------ payouts
def _profile(client, h, farmer_id, upi, verify=True):
    client.put(f"/api/farmers/{farmer_id}/payment-profile", headers=h,
               json={"method": "upi", "upi_id": upi, "account_name": "Farmer"})
    if verify:
        assert client.post(f"/api/farmers/{farmer_id}/payment-profile/verify", headers=h).status_code == 200


def test_payout_batch_holds_failures_retry_and_no_double_pay(client, org, as_role):
    w, sale = _setup(client, org, as_role, n_farmers=4, unit_price="100.00", quantity=10)
    _approved_rule(client, as_role, w["programme_id"], min_payout="100.00")
    maker, checker = as_role("finance_maker"), as_role("finance_checker")
    early = client.post(f"/api/sales/{sale['id']}/benefit-pool", headers=maker).json()
    blocked = client.post(f"/api/benefit-pools/{early['id']}/payout-batch", headers=maker)
    assert blocked.status_code == 409 and blocked.json()["code"] == "POOL_NOT_APPROVED"
    client.post(f"/api/benefit-pools/{early['id']}/approve", headers=checker)
    ents = {e["farmer_id"]: Decimal(e["amount"]) for e in client.get(f"/api/benefit-pools/{early['id']}", headers=maker).json()["entitlements"]}
    f0, f1, f2, f3 = (str(x) for x in w["farmer_ids"])
    _profile(client, maker, f0, "willfail@okbank")
    _profile(client, maker, f1, "one@okbank")
    _profile(client, maker, f2, "two@okbank")
    _profile(client, maker, f3, "three@okbank", verify=False)

    b = client.post(f"/api/benefit-pools/{early['id']}/payout-batch", headers=maker)
    assert b.status_code == 201, b.text
    batch = b.json()
    lines = {x["farmer_id"]: x for x in batch["lines"]}
    assert lines[f3]["status"] == "on_hold" and "verified" in lines[f3]["failure_reason"]
    assert ents[f2] < Decimal("100.00") <= ents[f1]  # 9 ha, no practices: below the minimum
    assert lines[f2]["status"] == "on_hold" and "minimum" in lines[f2]["failure_reason"]
    assert Decimal(batch["total_amount"]) == sum(ents.values()) == Decimal("555.00")
    assert client.post(f"/api/benefit-pools/{early['id']}/payout-batch", headers=maker).status_code == 409

    assert client.post(f"/api/payout-batches/{batch['id']}/submit", headers=maker).status_code == 409  # not approved
    assert client.post(f"/api/payout-batches/{batch['id']}/approve", headers=maker).status_code == 403
    assert client.post(f"/api/payout-batches/{batch['id']}/approve", headers=checker).json()["status"] == "approved"

    sub = client.post(f"/api/payout-batches/{batch['id']}/submit", headers=maker).json()
    lines = {x["farmer_id"]: x for x in sub["lines"]}
    assert sub["status"] == "partially_failed"
    assert lines[f1]["status"] == "paid" and lines[f1]["provider_ref"].startswith("SIMPAY-") and lines[f1]["attempts"] == 1
    assert lines[f0]["status"] == "failed" and "simulated" in lines[f0]["failure_reason"]
    assert lines[f2]["attempts"] == 0 and lines[f3]["attempts"] == 0
    again = client.post(f"/api/payout-batches/{batch['id']}/submit", headers=maker)
    assert again.status_code == 409
    assert client.post(f"/api/payouts/{lines[f1]['id']}/retry", headers=maker).status_code == 409
    assert client.post(f"/api/payouts/{lines[f3]['id']}/retry", headers=maker).status_code == 409
    with fx.session() as s:
        assert s.query(Payout).filter_by(id=uuid.UUID(lines[f1]["id"])).one().attempts == 1
        assert s.query(DomainEvent).filter_by(event="payout.completed").count() == 0

    still = client.post(f"/api/payouts/{lines[f0]['id']}/retry", headers=maker).json()
    assert still["status"] == "partially_failed"
    _profile(client, maker, f0, "fixed@okbank")
    done = client.post(f"/api/payouts/{lines[f0]['id']}/retry", headers=maker).json()
    fixed = {x["farmer_id"]: x for x in done["lines"]}
    assert done["status"] == "completed" and fixed[f0]["status"] == "paid" and fixed[f0]["attempts"] == 3
    assert fixed[f1]["attempts"] == 1 and fixed[f1]["provider_ref"] == lines[f1]["provider_ref"]
    assert done["paid_amount"] == str(ents[f0] + ents[f1])
    with fx.session() as s:
        assert s.query(DomainEvent).filter_by(event="payout.completed").count() == 1
        assert s.query(Entitlement).count() == 4


def test_payout_batch_four_eyes(client, org, as_role):
    w, sale = _setup(client, org, as_role)
    _approved_rule(client, as_role, w["programme_id"])
    pool = _approved_pool(client, as_role, sale["id"])
    admin = login(client, make_user(org, "platform_admin"))
    b = client.post(f"/api/benefit-pools/{pool['id']}/payout-batch", headers=admin).json()
    r = client.post(f"/api/payout-batches/{b['id']}/approve", headers=admin)
    assert r.status_code == 403 and r.json()["code"] == "SELF_APPROVAL_REJECTED"


def test_farmer_statement(client, org, as_role):
    w, sale = _setup(client, org, as_role, unit_price="1000.00")
    _approved_rule(client, as_role, w["programme_id"], min_payout="0")
    pool = _approved_pool(client, as_role, sale["id"])
    maker = as_role("finance_maker")
    f0, f1, f2 = (str(x) for x in w["farmer_ids"])
    _profile(client, maker, f2, "big@okbank")
    b = client.post(f"/api/benefit-pools/{pool['id']}/payout-batch", headers=maker).json()
    client.post(f"/api/payout-batches/{b['id']}/approve", headers=as_role("finance_checker"))
    client.post(f"/api/payout-batches/{b['id']}/submit", headers=maker)
    st = client.get(f"/api/farmers/{f2}/statement", headers=maker).json()
    item = st["items"][0]
    assert item["sale_code"] == sale["code"] and item["rule_version"] == 1 and item["payout_status"] == "paid"
    assert any("Paid on" in line for line in item["lines"]) and st["total_paid"] == item["amount"]
    held = client.get(f"/api/farmers/{f0}/statement", headers=maker).json()["items"][0]
    assert held["payout_status"] == "on_hold" and any("On hold" in line for line in held["lines"])
    me = login(client, make_user(org, "farmer", scope={"farmer_id": f0}))
    assert client.get(f"/api/farmers/{f0}/statement", headers=me).status_code == 200
    assert client.get(f"/api/farmers/{f1}/statement", headers=me).status_code == 404


def test_pool_excludes_control_site_fields(client, org, as_role):
    """QA2 control-site fields are enrolled for stratification only: their hosts don't share the credit revenue."""
    w = fx.world(org, n_farmers=3)
    f0, f1, f2 = (str(x) for x in w["field_ids"])
    inputs = {"sources": {"strata": [{"code": "Z1", "role": "project", "field_ids": [f0, f1]},
                                     {"code": "C1", "role": "control", "control_for_code": "Z1", "field_ids": [f2]}]}}
    admin = as_role("programme_admin")
    batch = fx.issued_batch(client, admin, fx.approved_run(org, w, inputs=inputs))
    sale = fx.delivered_sale(client, admin, batch["id"], fx.buyer(client, admin)["id"], quantity=5)
    _approved_rule(client, as_role, w["programme_id"], weights={"area": 1.0})
    r = client.post(f"/api/sales/{sale['id']}/benefit-pool", headers=as_role("finance_maker"))
    assert r.status_code == 201, r.text
    paid = {e["farmer_id"] for e in r.json()["entitlements"]}
    assert paid == {str(w["farmer_ids"][0]), str(w["farmer_ids"][1])}
