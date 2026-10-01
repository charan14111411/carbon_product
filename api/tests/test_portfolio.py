from app.modules.farmers.models import Farmer
from app.modules.land.models import Field
from app.modules.programmes.models import Project
from app.modules.risk.models import Grievance
from tests import _p345_factories as fx
from tests.conftest import login, make_org, make_user
from tests.test_risk import _risk


def _portfolio(client, org, as_role):
    w = fx.world(org, n_farmers=2)
    admin = as_role("programme_admin")
    batch = fx.issued_batch(client, admin, fx.approved_run(org, w))
    buyer = fx.buyer(client, admin)
    fx.delivered_sale(client, admin, batch["id"], buyer["id"], quantity=10, retire=True)
    with fx.session() as s:
        f0 = s.get(Field, w["field_ids"][0])
        p = s.get(Project, w["project_id"])
        fx.soc_sample(s, org, proj=p, fld=f0, camp=fx.campaign(s, org, p), strat=fx.stratum(s, org, p, [f0.id]),
                      lab_row=fx.lab(s, org), soc=1.2)
        s.add(Grievance(org_id=org, code="G-00001", farmer_id=w["farmer_ids"][0], category="payment",
                        subject="Late", description="Payment is late", due_on=fx.date(2030, 1, 1)))
        s.commit()
    _risk(client, admin, w)
    return w


def test_overview_and_project_detail_for_staff(client, org, as_role):
    w = _portfolio(client, org, as_role)
    h = as_role("programme_admin")
    ov = client.get("/api/portfolio/overview", headers=h)
    assert ov.status_code == 200, ov.text
    body = ov.json()
    assert body["pii_masked"] is False
    proj = body["programmes"][0]["projects"][0]
    assert proj["farmers_enrolled"] == 2 and proj["fields_enrolled"] == 2 and proj["samples"] == 1
    assert proj["latest_approved_result"]["net_t_co2e"] == 100
    assert proj["credits"]["issued"] == 100 and proj["credits"]["retired"] == 10
    assert proj["open_risk_events"] == 1 and proj["open_grievances"] == 1 and proj["payouts"]["paid_amount"] == "0.00"
    assert body["totals"]["open_grievances"] == 1 and body["totals"]["credits_retired"] == 10
    detail = client.get(f"/api/portfolio/projects/{w['project_id']}", headers=h).json()
    with fx.session() as s:
        real = {f.full_name for f in s.query(Farmer).all()}
    assert {p["farmer"]["name"] for p in detail["participants"]} == real
    assert all(p["farmer"]["phone"] and not p["farmer"]["masked"] for p in detail["participants"])
    assert detail["credit_batches"][0]["status"] == "issued"


def test_client_viewer_and_buyer_see_masked_data(client, org, as_role):
    w = _portfolio(client, org, as_role)
    viewer = login(client, make_user(org, "client_viewer"))
    detail = client.get(f"/api/portfolio/projects/{w['project_id']}", headers=viewer)
    assert detail.status_code == 200 and detail.json()["pii_masked"] is True
    for p in detail.json()["participants"]:
        assert p["farmer"]["name"] == f"Farmer {p['farmer']['code']}" and p["farmer"]["phone"] is None
    text = detail.text
    with fx.session() as s:
        for f in s.query(Farmer).all():
            assert f.phone not in text and f.full_name not in text
    ov = client.get("/api/portfolio/overview", headers=viewer).json()
    assert ov["pii_masked"] is True and "payouts" in ov["programmes"][0]["projects"][0]
    buyer = login(client, make_user(org, "buyer"))
    b = client.get("/api/portfolio/overview", headers=buyer).json()
    assert "payouts" not in b["programmes"][0]["projects"][0] and "payouts_paid" not in b["totals"]
    assert client.get(f"/api/portfolio/projects/{w['project_id']}", headers=buyer).json()["pii_masked"] is True
    assert client.get("/api/portfolio/overview", headers=as_role("farmer")).status_code == 403
    rival = login(client, make_user(make_org("Rival"), "client_viewer"))
    assert client.get(f"/api/portfolio/projects/{w['project_id']}", headers=rival).status_code == 404
    assert client.get("/api/portfolio/overview", headers=rival).json()["programmes"] == []
