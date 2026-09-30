import uuid
from datetime import date

import pytest

from app.core.errors import Conflict, ImmutableRecord
from app.modules.credits import service
from app.modules.credits.models import InventoryMove
from app.modules.credits.schemas import SaleIn
from app.modules.partners.models import DomainEvent
from tests import _p345_factories as fx
from tests.conftest import login, make_org, make_user


def _conserved(client, h, bid):
    b = client.get(f"/api/credit-batches/{bid}", headers=h).json()
    for t in ("reduction", "removal"):
        assert abs(sum(b["balances"][t].values()) - b["issued_total"][t]) < 1e-9
    return b


def test_batch_needs_an_approved_positive_run(client, org, as_role):
    h = as_role("programme_admin")
    w = fx.world(org)
    pending = fx.approved_run(org, w, status="under_review")
    r = client.post(f"/api/calculations/{pending}/credit-batch", headers=h)
    assert r.status_code == 409 and r.json()["code"] == "RUN_NOT_APPROVED"
    negative = fx.approved_run(org, w, reductions=-5, removals=2)
    assert client.post(f"/api/calculations/{negative}/credit-batch", headers=h).json()["code"] == "NET_NOT_POSITIVE"
    # a superseded run (approved earlier, superseded later) is not approved any more
    with fx.session() as s:
        from datetime import UTC, datetime, timedelta
        from app.modules.calculation.models import RunStatusEvent
        old = fx.approved_run(org, w)
        s.add(RunStatusEvent(org_id=org, run_id=old, status="superseded",
                             created_at=datetime.now(UTC) + timedelta(seconds=5)))
        s.commit()
    assert client.post(f"/api/calculations/{old}/credit-batch", headers=h).json()["code"] == "RUN_NOT_APPROVED"

    ok_run = fx.approved_run(org, w, reductions=40, removals=60, period_end=date(2025, 12, 31))
    assert client.post(f"/api/calculations/{ok_run}/credit-batch", headers=as_role("mrv_analyst")).status_code == 403
    r = client.post(f"/api/calculations/{ok_run}/credit-batch", headers=h)
    assert r.status_code == 201, r.text
    b = r.json()
    assert b["code"] == f"CB-{date.today().year}-001" and b["vintage"] == 2025 and b["status"] == "provisional"
    assert b["balances"]["reduction"]["available"] == 40 and b["balances"]["removal"]["available"] == 60
    assert [m["from"] for m in b["moves"]] == ["none", "none"]
    dup = client.post(f"/api/calculations/{ok_run}/credit-batch", headers=h)
    assert dup.status_code == 409 and dup.json()["code"] == "BATCH_EXISTS"
    other = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.post(f"/api/calculations/{ok_run}/credit-batch", headers=other).status_code == 404
    assert client.get(f"/api/credit-batches/{b['id']}", headers=other).status_code == 404


def test_batch_lifecycle_and_issue_event(client, org, as_role):
    h = as_role("programme_admin")
    w = fx.world(org)
    b = client.post(f"/api/calculations/{fx.approved_run(org, w)}/credit-batch", headers=h).json()
    early = client.post(f"/api/credit-batches/{b['id']}/issue", headers=h, json={
        "registry_name": "Verra", "registry_project_ref": "X", "serial_start": "1", "serial_end": "2",
        "issued_on": "2025-01-01"})
    assert early.status_code == 409 and early.json()["code"] == "ILLEGAL_STATE_TRANSITION"
    assert client.post(f"/api/credit-batches/{b['id']}/verify", headers=h).json()["status"] == "verified"
    assert client.post(f"/api/credit-batches/{b['id']}/verify", headers=h).status_code == 409
    issued = client.post(f"/api/credit-batches/{b['id']}/issue", headers=h, json={
        "registry_name": "Gold Standard", "registry_project_ref": "GS-1", "serial_start": "GS-1",
        "serial_end": "GS-100", "issued_on": "2025-12-01"}).json()
    assert issued["status"] == "issued" and issued["registry_name"] == "Gold Standard"
    with fx.session() as s:
        ev = s.query(DomainEvent).filter_by(event="credits.issued").one()
        assert ev.entity_id == b["id"] and ev.payload["code"] == b["code"]
    listed = client.get("/api/credit-batches", headers=h).json()
    assert listed[0]["totals"]["available"] == 100


def test_sales_cannot_oversell_or_double_allocate_and_conserve(client, org, as_role):
    h = as_role("programme_admin")
    w = fx.world(org)
    batch = fx.issued_batch(client, h, fx.approved_run(org, w, reductions=40, removals=60))
    buyer = fx.buyer(client, h)
    base = {"buyer_id": buyer["id"], "batch_id": batch["id"], "credit_type": "removal", "unit_price": "1250.50"}
    too_much = client.post("/api/sales", headers=h, json={**base, "quantity": 60.5})
    assert too_much.status_code == 409 and too_much.json()["code"] == "INVENTORY_INSUFFICIENT"
    s1 = client.post("/api/sales", headers=h, json={**base, "quantity": 35})
    assert s1.status_code == 201 and s1.json()["code"] == f"S-{date.today().year}-001"
    assert s1.json()["total_amount"] == "43767.50"
    s2 = client.post("/api/sales", headers=h, json={**base, "quantity": 30})  # 35 + 30 > 60
    assert s2.status_code == 409 and s2.json()["code"] == "INVENTORY_INSUFFICIENT"
    assert client.post("/api/sales", headers=h, json={**base, "quantity": 25}).status_code == 201
    b = _conserved(client, h, batch["id"])
    assert b["balances"]["removal"] == {"available": 0.0, "reserved": 60.0, "sold": 0.0, "retired": 0.0,
                                        "buffer": 0.0, "cancelled": 0.0}
    assert b["balances"]["reduction"]["available"] == 40
    bad = client.post("/api/sales", headers=h, json={**base, "quantity": 0})
    assert bad.status_code == 422
    assert client.post("/api/sales", headers=h, json={**base, "quantity": 1, "unit_price": "0"}).status_code == 422

    sid = s1.json()["id"]
    assert client.post(f"/api/sales/{sid}/deliver", headers=h).status_code == 409  # must be contracted first
    assert client.post(f"/api/sales/{sid}/contract", headers=h, json={"contract_ref": "PO-77"}).json()["status"] == "contracted"
    assert client.post(f"/api/sales/{sid}/retire", headers=h, json={"beneficiary": "Acme"}).status_code == 409
    assert client.post(f"/api/sales/{sid}/deliver", headers=h).json()["status"] == "delivered"
    assert client.post(f"/api/sales/{sid}/cancel", headers=h).status_code == 409
    assert client.post(f"/api/sales/{sid}/retire", headers=h, json={"beneficiary": "Acme"}).json()["status"] == "retired"
    b = _conserved(client, h, batch["id"])
    assert b["balances"]["removal"]["retired"] == 35 and b["balances"]["removal"]["reserved"] == 25

    other_sale = client.get("/api/sales?status=reserved", headers=h).json()[0]
    assert client.post(f"/api/sales/{other_sale['id']}/cancel", headers=h, json={"reason": "Buyer withdrew"}).json()["status"] == "cancelled"
    b = _conserved(client, h, batch["id"])
    assert b["balances"]["removal"]["available"] == 25
    with fx.session() as s:
        sale_ids = [m.sale_id for m in s.query(InventoryMove).filter(InventoryMove.sale_id.isnot(None))]
        assert len(sale_ids) == 5
    events = {a["action"] for a in client.get("/api/audit", headers=h).json()}
    assert {"sale.create", "sale.contract", "sale.deliver", "sale.retire", "sale.cancel"} <= events


def test_double_allocation_in_one_transaction_is_refused(client, org, as_role):
    h = as_role("programme_admin")
    w = fx.world(org)
    batch = fx.issued_batch(client, h, fx.approved_run(org, w, reductions=0, removals=10))
    buyer = fx.buyer(client, h)
    from app.core.auth import CurrentUser
    from app.core.permissions import permissions_for
    email = make_user(org, "programme_admin")
    user = CurrentUser(fx.uid(email), org, "programme_admin", email, "PA", permissions_for("programme_admin"))
    body = SaleIn(buyer_id=buyer["id"], batch_id=batch["id"], credit_type="removal", quantity=7, unit_price="10")
    with fx.session() as s:
        service.create_sale(s, user, body)
        with pytest.raises(Conflict):
            service.create_sale(s, user, body)
        s.rollback()


def test_sale_requires_issued_batch_and_batch_cancel_rules(client, org, as_role):
    h = as_role("programme_admin")
    w = fx.world(org)
    b = client.post(f"/api/calculations/{fx.approved_run(org, w)}/credit-batch", headers=h).json()
    buyer = fx.buyer(client, h)
    r = client.post("/api/sales", headers=h, json={"buyer_id": buyer["id"], "batch_id": b["id"],
                                                   "credit_type": "removal", "quantity": 1, "unit_price": "10"})
    assert r.status_code == 409 and r.json()["code"] == "BATCH_NOT_ISSUED"
    issued = fx.issued_batch(client, h, fx.approved_run(org, w))
    client.post("/api/sales", headers=h, json={"buyer_id": buyer["id"], "batch_id": issued["id"],
                                               "credit_type": "removal", "quantity": 1, "unit_price": "10"})
    blocked = client.post(f"/api/credit-batches/{issued['id']}/cancel", headers=h, json={"reason": "Registry error"})
    assert blocked.status_code == 409 and blocked.json()["code"] == "BATCH_IN_USE"
    ok = client.post(f"/api/credit-batches/{b['id']}/cancel", headers=h, json={"reason": "Registry error"})
    assert ok.json()["status"] == "cancelled" and ok.json()["totals"]["cancelled"] == 100
    _conserved(client, h, b["id"])


def test_inventory_moves_are_append_only(client, org, as_role):
    w = fx.world(org)
    client.post(f"/api/calculations/{fx.approved_run(org, w)}/credit-batch", headers=as_role("programme_admin"))
    with fx.session() as s:
        m = s.query(InventoryMove).first()
        m.quantity = 1_000_000
        with pytest.raises(ImmutableRecord):
            s.flush()


def test_buyers_portfolio_and_report(client, org, as_role):
    h = as_role("programme_admin")
    w = fx.world(org)
    buyer_email = make_user(org, "buyer")
    bh = login(client, buyer_email)
    not_buyer = client.post("/api/buyers", headers=h, json={"name": "Wrong", "user_id": str(fx.uid(make_user(org, "farmer")))})
    assert not_buyer.status_code == 422 and not_buyer.json()["code"] == "NOT_A_BUYER_USER"
    mine = fx.buyer(client, h, name="Acme", user_id=str(fx.uid(buyer_email)), contact_email="a@acme.example")
    theirs = fx.buyer(client, h, name="Other Corp")
    assert client.patch(f"/api/buyers/{mine['id']}", headers=h, json={"country": "UK"}).json()["country"] == "UK"
    assert client.post("/api/buyers", headers=as_role("finance_maker"), json={"name": "X Y"}).status_code == 403
    assert client.get("/api/buyer/portfolio", headers=bh).json()["sales"] == []

    batch = fx.issued_batch(client, h, fx.approved_run(org, w))
    with fx.session() as s:
        from app.modules.calculation.models import CalculationRun
        from app.modules.land.models import Field
        fx.claim(s, org, s.get(Field, w["field_ids"][0]), s.get(CalculationRun, uuid.UUID(batch["run_id"])))
        s.commit()
    sale = fx.delivered_sale(client, h, batch["id"], mine["id"], quantity=10, retire=True)
    other = fx.delivered_sale(client, h, batch["id"], theirs["id"], quantity=5)
    pf = client.get("/api/buyer/portfolio", headers=bh).json()
    assert pf["buyer"]["name"] == "Acme" and len(pf["sales"]) == 1
    item = pf["sales"][0]
    assert item["serial_start"] == "VCS-1-0001" and item["retirement"]["beneficiary"] == "Acme Foods Ltd"
    assert item["vintage"] == 2024
    rep = client.get(f"/api/sales/{sale['id']}/report", headers=bh)
    assert rep.status_code == 200
    body = rep.json()
    assert body["footprint"] == {"fields": 1, "area_ha": body["footprint"]["area_ha"],
                                 "basis": "fields credited by the calculation run"}
    assert body["verification_package"] is None and body["project"]["methodology"] == "VM0042 v2.2"
    text = rep.text
    with fx.session() as s:
        from app.modules.farmers.models import Farmer
        for f in s.query(Farmer).all():
            assert f.full_name not in text and f.phone not in text
    assert client.get(f"/api/sales/{other['id']}/report", headers=bh).status_code == 404
    assert client.get("/api/sales", headers=bh).status_code == 403
    assert client.get("/api/buyer/portfolio", headers=h).status_code == 403


def test_negative_reductions_are_netted_against_removals(client, org, as_role):
    """Net project emissions (negative reductions) reduce removals; nothing negative is issued."""
    h = as_role("programme_admin")
    w = fx.world(org)
    run_id = fx.approved_run(org, w, reductions=-21.0, removals=121.0)
    r = client.post(f"/api/calculations/{run_id}/credit-batch", headers=h)
    assert r.status_code == 201, r.text
    b = r.json()
    assert b["balances"]["removal"]["available"] == 100
    assert b["balances"].get("reduction", {}).get("available", 0) == 0
    assert all(m["quantity"] > 0 for m in b["moves"])
    # still refused when netting leaves nothing to credit
    none_left = fx.approved_run(org, w, reductions=-30.0, removals=20.0)
    assert client.post(f"/api/calculations/{none_left}/credit-batch", headers=h).json()["code"] == "NET_NOT_POSITIVE"
