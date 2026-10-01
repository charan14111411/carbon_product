from decimal import Decimal

from app.core.errors import ImmutableRecord
from app.modules.partners.models import DomainEvent
from app.modules.payments.models import PaymentAttempt
from tests import _p345_factories as fx
from tests.conftest import login, make_user
from tests.test_payments import _approved_pool, _approved_rule, _profile, _setup


def _paid_batch(client, org, as_role, n_farmers=4, verify_last=True, min_payout="0"):
    w, sale = _setup(client, org, as_role, n_farmers=n_farmers, unit_price="1000.00")
    _approved_rule(client, as_role, w["programme_id"], min_payout=min_payout)
    pool = _approved_pool(client, as_role, sale["id"])
    maker, checker = as_role("finance_maker"), as_role("finance_checker")
    fids = [str(x) for x in w["farmer_ids"]]
    for i, f in enumerate(fids):
        _profile(client, maker, f, f"farmer{i}@okbank", verify=verify_last or i < len(fids) - 1)
    b = client.post(f"/api/benefit-pools/{pool['id']}/payout-batch", headers=maker).json()
    client.post(f"/api/payout-batches/{b['id']}/approve", headers=checker)
    return w, pool, b, fids


def _csv(rows):
    return "provider_ref,amount,status\n" + "".join(f"{r},{a},{s}\n" for r, a, s in rows)


def _upload(client, h, batch_id, text):
    return client.post(f"/api/payout-batches/{batch_id}/reconcile", headers=h,
                       files={"file": ("statement.csv", text.encode(), "text/csv")})


def test_attempts_are_recorded_and_append_only(client, org, as_role):
    w, pool, b, fids = _paid_batch(client, org, as_role, n_farmers=3)
    maker = as_role("finance_maker")
    _profile(client, maker, fids[0], "willfail@okbank")
    sub = client.post(f"/api/payout-batches/{b['id']}/submit", headers=maker).json()
    failed = next(x for x in sub["lines"] if x["status"] == "failed")
    _profile(client, maker, fids[0], "fixed@okbank")
    client.post(f"/api/payouts/{failed['id']}/retry", headers=maker)
    rows = client.get(f"/api/payout-batches/{b['id']}/attempts", headers=maker).json()
    assert len(rows) == 4
    mine = [r for r in rows if r["payout_id"] == failed["id"]]
    assert [(r["attempt_no"], r["status"]) for r in mine] == [(1, "failed"), (2, "paid")]
    assert mine[0]["error"] and mine[1]["provider_ref"].startswith("SIMPAY-") and mine[1]["provider"] == "simulated"
    with fx.session() as s:
        a = s.query(PaymentAttempt).first()
        a.provider_ref = "TAMPERED"
        try:
            s.flush()
        except ImmutableRecord:
            s.rollback()
        else:
            raise AssertionError("payment attempts must be append-only")


def test_reconciliation_flags_every_mismatch(client, org, as_role):
    w, pool, b, fids = _paid_batch(client, org, as_role, n_farmers=4)
    maker = as_role("finance_maker")
    assert _upload(client, maker, b["id"], _csv([("X", "1", "paid")])).json()["code"] == "BATCH_NOT_SUBMITTED"
    sub = client.post(f"/api/payout-batches/{b['id']}/submit", headers=maker).json()
    assert sub["status"] == "completed"
    lines = sorted(sub["lines"], key=lambda x: x["provider_ref"])
    l0, l1, l2, l3 = lines
    assert client.get(f"/api/payout-batches/{b['id']}/reconciliation", headers=maker).status_code == 404
    bad = _upload(client, maker, b["id"], "reference,amount\nX,1\n")
    assert bad.status_code == 422 and bad.json()["code"] == "INVALID_STATEMENT"
    bad_amount = _upload(client, maker, b["id"], _csv([(l0["provider_ref"], "lots", "paid")]))
    assert bad_amount.status_code == 422 and bad_amount.json()["details"]["errors"][0]["row"] == 2
    wrong = str(Decimal(l1["amount"]) + Decimal("1.00"))
    text = _csv([(l0["provider_ref"], l0["amount"], "SUCCESS"), (l1["provider_ref"], wrong, "success"),
                 (l2["provider_ref"], l2["amount"], "returned"), (l0["provider_ref"], l0["amount"], "success"),
                 ("SIMPAY-UNKNOWN", "10.00", "success")])
    r = _upload(client, maker, b["id"], text)
    assert r.status_code == 201, r.text
    run = r.json()
    assert run["status"] == "mismatches" and run["rows"] == 5
    assert run["counts"] == {"matched": 1, "amount_mismatch": 1, "status_mismatch": 1, "duplicate_in_statement": 1,
                             "unknown_ref": 1, "missing_in_statement": 1}
    by = {i["outcome"]: i for i in run["items"]}
    assert by["amount_mismatch"]["payout_id"] == l1["id"] and by["amount_mismatch"]["statement_amount"] == wrong
    assert by["missing_in_statement"]["payout_id"] == l3["id"]
    assert len(run["exceptions"]) == 5
    # the statement itself is kept as immutable evidence
    ev = client.get(f"/api/evidence/{run['statement_evidence_id']}", headers=maker)
    assert ev.status_code == 200 and ev.json()["entity_id"] == b["id"]
    # payouts are never changed by reconciliation
    after = client.get(f"/api/payout-batches/{b['id']}", headers=maker).json()
    assert {x["status"] for x in after["lines"]} == {"paid"}

    clean = _csv([(x["provider_ref"], x["amount"], "settled") for x in lines])
    ok = _upload(client, as_role("finance_checker"), b["id"], clean).json()
    assert ok["status"] == "reconciled" and ok["counts"] == {"matched": 4}
    rep = client.get(f"/api/payout-batches/{b['id']}/reconciliation", headers=maker).json()
    assert rep["latest"]["id"] == ok["id"] and len(rep["history"]) == 2
    assert _upload(client, as_role("programme_admin"), b["id"], clean).status_code == 403


def test_release_held_payout_after_verification(client, org, as_role):
    w, pool, b, fids = _paid_batch(client, org, as_role, n_farmers=3, verify_last=False)
    maker, checker = as_role("finance_maker"), as_role("finance_checker")
    held = next(x for x in b["lines"] if x["status"] == "on_hold")
    early = client.post(f"/api/payouts/{held['id']}/release", headers=checker)
    assert early.status_code == 409 and early.json()["code"] == "PROFILE_NOT_VERIFIED"
    sub = client.post(f"/api/payout-batches/{b['id']}/submit", headers=maker).json()
    assert sub["status"] == "completed"
    assert client.get(f"/api/benefit-pools/{pool['id']}", headers=maker).json()["status"] == "approved"  # still held
    paid_line = next(x for x in sub["lines"] if x["status"] == "paid")
    assert client.post(f"/api/payouts/{paid_line['id']}/release", headers=checker).status_code == 409
    admin = login(client, make_user(org, "platform_admin"))
    assert client.post(f"/api/farmers/{held['farmer_id']}/payment-profile/verify", headers=admin).status_code == 200
    assert client.post(f"/api/payouts/{held['id']}/release", headers=maker).status_code == 403  # no permission
    selfie = client.post(f"/api/payouts/{held['id']}/release", headers=admin)
    assert selfie.status_code == 403 and selfie.json()["code"] == "SELF_APPROVAL_REJECTED"  # verified the details
    rel = client.post(f"/api/payouts/{held['id']}/release", headers=checker)
    assert rel.status_code == 200, rel.text
    line = next(x for x in rel.json()["lines"] if x["id"] == held["id"])
    assert line["status"] == "paid" and line["attempts"] == 1 and rel.json()["status"] == "completed"
    assert client.get(f"/api/benefit-pools/{pool['id']}", headers=maker).json()["status"] == "paid"
    with fx.session() as s:
        evs = s.query(DomainEvent).filter_by(event="payout.completed").order_by(DomainEvent.created_at).all()
        assert len(evs) == 2 and evs[1].payload["payout_ids"] == [held["id"]] and evs[1].payload["released"] is True


def test_release_respects_minimum_and_draft_batches(client, org, as_role):
    w, pool, b, fids = _paid_batch(client, org, as_role, n_farmers=3, min_payout="100000.00")
    held = b["lines"][0]
    assert held["status"] == "on_hold"
    r = client.post(f"/api/payouts/{held['id']}/release", headers=as_role("finance_checker"))
    assert r.status_code == 409 and r.json()["code"] == "BELOW_MINIMUM"
