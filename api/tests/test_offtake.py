import uuid
from datetime import timedelta

from app.modules.offtake.models import Offer
from app.modules.offtake.service import today as app_today
from tests import _p345_factories as fx
from tests.conftest import login, make_org, make_user

TODAY = app_today()  # UTC date, as the app uses


def _market(client, org, as_role):
    w = fx.world(org)
    admin = as_role("programme_admin")
    batch = fx.issued_batch(client, admin, fx.approved_run(org, w))  # 60 t removals, 40 t reductions (less buffer)
    buyer_email = make_user(org, "buyer")
    buyer = fx.buyer(client, admin, name="Acme Foods", user_id=str(fx.uid(buyer_email)))
    return w, batch, buyer, login(client, buyer_email)


def _offer(client, h, batch, buyer, **kw):
    body = {"buyer_id": buyer["id"], "batch_id": batch["id"], "credit_type": "removal", "quantity": 10,
            "unit_price": "1500.00", "valid_until": (TODAY + timedelta(days=30)).isoformat(), **kw}
    return client.post("/api/offers", headers=h, json=body)


def test_offer_lifecycle_visibility_and_expiry(client, org, as_role):
    w, batch, buyer, bh = _market(client, org, as_role)
    admin = as_role("programme_admin")
    too_much = _offer(client, admin, batch, buyer, quantity=10_000)
    assert too_much.status_code == 409 and too_much.json()["code"] == "INSUFFICIENT_CREDITS"
    past = _offer(client, admin, batch, buyer, valid_until=(TODAY - timedelta(days=1)).isoformat())
    assert past.status_code == 422 and past.json()["code"] == "INVALID_VALIDITY"
    assert _offer(client, bh, batch, buyer).status_code == 403
    o = _offer(client, admin, batch, buyer)
    assert o.status_code == 201, o.text
    offer = o.json()
    assert offer["status"] == "draft" and offer["value"] == "15000.00" and offer["seller_name"]
    assert client.get("/api/offers", headers=bh).json() == []  # drafts are not shown to the buyer
    assert client.get(f"/api/offers/{offer['id']}", headers=bh).status_code == 404
    assert client.post(f"/api/offers/{offer['id']}/accept", headers=bh, json={}).status_code == 404
    assert client.patch(f"/api/offers/{offer['id']}", headers=admin, json={"unit_price": "1600.00"}).json()["value"] == "16000.00"
    sent = client.post(f"/api/offers/{offer['id']}/send", headers=admin).json()
    assert sent["status"] == "sent"
    assert client.patch(f"/api/offers/{offer['id']}", headers=admin, json={"quantity": 5}).status_code == 409
    assert [x["id"] for x in client.get("/api/offers", headers=bh).json()] == [offer["id"]]
    other_buyer = login(client, make_user(org, "buyer"))
    assert client.get(f"/api/offers/{offer['id']}", headers=other_buyer).status_code == 404
    assert client.post(f"/api/offers/{offer['id']}/accept", headers=other_buyer, json={}).status_code == 404
    acc = client.post(f"/api/offers/{offer['id']}/accept", headers=bh, json={"note": "Agreed"})
    assert acc.status_code == 200 and acc.json()["status"] == "accepted"
    assert client.post(f"/api/offers/{offer['id']}/reject", headers=bh, json={}).status_code == 409

    late = _offer(client, admin, batch, buyer, valid_until=TODAY.isoformat()).json()
    client.post(f"/api/offers/{late['id']}/send", headers=admin)
    with fx.session() as s:
        s.get(Offer, uuid.UUID(late["id"])).valid_until = TODAY - timedelta(days=1)
        s.commit()
    assert client.get(f"/api/offers/{late['id']}", headers=bh).json()["status"] == "expired"
    exp = client.post(f"/api/offers/{late['id']}/accept", headers=bh, json={})
    assert exp.status_code == 409 and exp.json()["code"] == "OFFER_EXPIRED"
    assert client.post("/api/offers/expire-due", headers=admin).json()["expired"] == 1
    assert [x["status"] for x in client.get("/api/offers?status=expired", headers=admin).json()] == ["expired"]
    rival = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/offers/{offer['id']}", headers=rival).status_code == 404


def test_agreement_signing_deliveries_and_completion(client, org, as_role):
    w, batch, buyer, bh = _market(client, org, as_role)
    admin = as_role("programme_admin")
    offer = _offer(client, admin, batch, buyer).json()
    base = {"buyer_id": buyer["id"], "title": "Acme 2025-26 removals", "code": "OA-ACME-1",
            "credit_type": "removal", "total_volume_t": 20, "vintages": [2024], "price_type": "floor",
            "price": "1000.00", "delivery_schedule": [
                {"due_date": (TODAY - timedelta(days=10)).isoformat(), "quantity": 8},
                {"due_date": (TODAY + timedelta(days=200)).isoformat(), "quantity": 12}]}
    bad = client.post("/api/offtake-agreements", headers=admin,
                      json={**base, "delivery_schedule": [{"due_date": TODAY.isoformat(), "quantity": 5}]})
    assert bad.status_code == 422
    not_accepted = client.post("/api/offtake-agreements", headers=admin, json={**base, "offer_id": offer["id"]})
    assert not_accepted.status_code == 409 and not_accepted.json()["code"] == "OFFER_NOT_ACCEPTED"
    r = client.post("/api/offtake-agreements", headers=admin, json=base)
    assert r.status_code == 201, r.text
    ag = r.json()
    assert client.post("/api/offtake-agreements", headers=admin, json=base).json()["code"] == "CODE_TAKEN"
    assert client.get("/api/offtake-agreements", headers=bh).json() == []  # draft hidden from buyer
    no_doc = client.post(f"/api/offtake-agreements/{ag['id']}/sign", headers=admin,
                         json={"contract_evidence_id": str(uuid.uuid4()), "signed_on": TODAY.isoformat()})
    assert no_doc.status_code == 404
    doc = fx.evidence_id(org, "signed contract")
    own = client.post(f"/api/offtake-agreements/{ag['id']}/sign", headers=admin,
                      json={"contract_evidence_id": doc, "signed_on": TODAY.isoformat()})
    assert own.status_code == 403 and own.json()["code"] == "SELF_APPROVAL_REJECTED"
    other = login(client, make_user(org, "programme_admin"))
    signed = client.post(f"/api/offtake-agreements/{ag['id']}/sign", headers=other,
                         json={"contract_evidence_id": doc, "signed_on": TODAY.isoformat()})
    assert signed.status_code == 200 and signed.json()["status"] == "signed"
    assert client.patch(f"/api/offtake-agreements/{ag['id']}", headers=admin,
                        json={"title": "Changed"}).json()["code"] == "AGREEMENT_FROZEN"
    assert client.post(f"/api/offtake-agreements/{ag['id']}/activate", headers=admin).json()["status"] == "active"

    def sale(qty, price, deliver=True):
        s = client.post("/api/sales", headers=admin, json={"buyer_id": buyer["id"], "batch_id": batch["id"],
                                                           "credit_type": "removal", "quantity": qty,
                                                           "unit_price": price}).json()
        client.post(f"/api/sales/{s['id']}/contract", headers=admin, json={"contract_ref": "OA-ACME-1"})
        if deliver:
            client.post(f"/api/sales/{s['id']}/deliver", headers=admin)
        return s

    sale(5, "1200.00")
    sale(2, "900.00")  # below the floor price: flagged
    sale(4, "1000.00", deliver=False)
    rep = client.get(f"/api/offtake-agreements/{ag['id']}/deliveries", headers=admin).json()
    assert rep["delivered_t"] == 7 and rep["due_to_date_t"] == 8 and rep["shortfall_t"] == 1
    assert rep["on_track"] is False and [x["status"] for x in rep["schedule"]] == ["overdue", "upcoming"]
    assert rep["by_sale_status"] == {"delivered": 7, "contracted": 4} and rep["sales_with_issues"] == 1
    flagged = next(x for x in rep["sales"] if x["issues"])
    assert "floor" in flagged["issues"][0]
    early = client.post(f"/api/offtake-agreements/{ag['id']}/complete", headers=admin, json={})
    assert early.status_code == 409 and early.json()["code"] == "UNDER_DELIVERED"
    seen = client.get(f"/api/offtake-agreements/{ag['id']}", headers=bh)
    assert seen.status_code == 200 and seen.json()["deliveries"]["delivered_t"] == 7
    assert client.post(f"/api/offtake-agreements/{ag['id']}/terminate", headers=admin,
                       json={}).json()["code"] == "REASON_REQUIRED"
    term = client.post(f"/api/offtake-agreements/{ag['id']}/terminate", headers=admin,
                       json={"reason": "Buyer exited the market"})
    assert term.json()["status"] == "terminated" and term.json()["closed_on"] == TODAY.isoformat()

    # an accepted offer becomes an agreement once
    client.post(f"/api/offers/{offer['id']}/send", headers=admin)
    client.post(f"/api/offers/{offer['id']}/accept", headers=bh, json={})
    from_offer = client.post("/api/offtake-agreements", headers=admin, json={**base, "code": None,
                                                                            "offer_id": offer["id"]})
    assert from_offer.status_code == 201 and from_offer.json()["code"].startswith("OA-")
    again = client.post("/api/offtake-agreements", headers=admin, json={**base, "code": "OA-X", "offer_id": offer["id"]})
    assert again.json()["code"] == "AGREEMENT_EXISTS"
    rival = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/offtake-agreements/{ag['id']}", headers=rival).status_code == 404
