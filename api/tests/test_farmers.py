import pytest

from app.core.errors import ValidationFailed
from app.modules.farmers.domain import normalise_phone
from app.modules.farmers.member_directory import MemberDirectory
from tests.conftest import login, make_org, make_user


def mk_farmer(client, h, phone="9812345670", name="Ravi Kumar", **extra):
    r = client.post("/api/farmers", headers=h, json={"full_name": name, "phone": phone, "village": "Madapura", **extra})
    assert r.status_code == 201, r.text
    return r.json()


# ------------------------------------------------------------------ phone numbers (pure)
@pytest.mark.parametrize("raw", ["9812345678", "09812345678", "919812345678", "+91 98123-45678", "+91(981)2345678",
                                 "0091 9812345678"])
def test_indian_numbers_normalise(raw):
    assert normalise_phone(raw) == "+919812345678"


def test_international_number_kept():
    assert normalise_phone("+44 20 7946 0958") == "+442079460958"


@pytest.mark.parametrize("raw", ["", "12345", "5812345678", "98123456789", "+91 12345 67890", "98x2345678",
                                 "+0123456789", "+1234567890123456"])
def test_invalid_numbers_rejected(raw):
    with pytest.raises(ValidationFailed):
        normalise_phone(raw)


# ------------------------------------------------------------------ member directory (pure)
def test_member_directory_is_deterministic():
    d = MemberDirectory()
    rec = d.lookup("+919812345670")
    assert rec.is_member and rec.member_id == "VP-345670"
    assert 1 <= len(rec.farms) <= 2
    assert rec == d.lookup("+919812345670")
    assert all(f.external_farm_id.startswith("VP-345670-F") for f in rec.farms)
    assert not d.lookup("+919812345671").is_member


# ------------------------------------------------------------------ FPOs
def test_fpo_crud(client, as_role):
    h = as_role("programme_admin")
    r = client.post("/api/fpos", headers=h, json={"name": "Kodagu Growers FPO", "district": "Kodagu",
                                                  "contact_phone": "98450 12345"})
    assert r.status_code == 201, r.text
    fpo = r.json()
    assert fpo["contact_phone"] == "+919845012345"
    upd = client.patch(f"/api/fpos/{fpo['id']}", headers=h, json={"state": "Karnataka"})
    assert upd.json()["state"] == "Karnataka"
    assert client.get("/api/fpos?q=kodagu", headers=h).json()[0]["id"] == fpo["id"]
    bad = client.post("/api/fpos", headers=h, json={"name": "Bad phone FPO", "contact_phone": "123"})
    assert bad.status_code == 422


# ------------------------------------------------------------------ farmers
def test_create_farmer_code_and_phone(client, as_role):
    h = as_role("programme_admin")
    a = mk_farmer(client, h, phone="98123 45670")
    b = mk_farmer(client, h, phone="+91 9812345672", name="Lakshmi Devi")
    assert a["phone"] == "+919812345670" and a["code"] == "FRM-000001"
    assert b["code"] == "FRM-000002"
    assert a["status"] == "active" and a["kyc_status"] == "not_started"
    assert any(x["action"] == "farmer.create" for x in client.get("/api/audit", headers=h).json())


def test_duplicate_phone_is_rejected(client, as_role):
    h = as_role("programme_admin")
    mk_farmer(client, h, phone="9812345670")
    r = client.post("/api/farmers", headers=h, json={"full_name": "Someone Else", "phone": "+91-98123-45670"})
    assert r.status_code == 409 and r.json()["code"] == "DUPLICATE_FARMER"
    assert "FRM-000001" in r.json()["message"]
    other = mk_farmer(client, h, phone="9812345672", name="Other Person")
    upd = client.patch(f"/api/farmers/{other['id']}", headers=h, json={"phone": "9812345670"})
    assert upd.status_code == 409 and upd.json()["code"] == "DUPLICATE_FARMER"


def test_invalid_phone_rejected(client, as_role):
    r = client.post("/api/farmers", headers=as_role("programme_admin"), json={"full_name": "Ravi K", "phone": "12345678"})
    assert r.status_code == 422 and r.json()["code"] == "INVALID_PHONE"


def test_same_phone_allowed_in_another_org(client, as_role):
    mk_farmer(client, as_role("programme_admin"), phone="9812345670")
    other = login(client, make_user(make_org("Rival"), "programme_admin"))
    mk_farmer(client, other, phone="9812345670")


def test_search_filter_and_paginate(client, as_role):
    h = as_role("programme_admin")
    fpo = client.post("/api/fpos", headers=h, json={"name": "Hassan FPO"}).json()
    mk_farmer(client, h, phone="9812345670", name="Ravi Kumar", village="Madapura")
    mk_farmer(client, h, phone="9812345672", name="Lakshmi Devi", village="Sakleshpur", fpo_id=fpo["id"])
    mk_farmer(client, h, phone="9900011122", name="Anand Rao", village="Sakleshpur", fpo_id=fpo["id"])

    def search(qs):
        return client.get(f"/api/farmers?{qs}", headers=h).json()

    assert search("q=lakshmi")["total"] == 1
    assert search("q=sakleshpur")["total"] == 2
    assert search("q=98123")["total"] == 2
    assert search(f"fpo_id={fpo['id']}")["total"] == 2
    page = search("limit=2&offset=0")
    assert page["total"] == 3 and len(page["items"]) == 2
    assert len(search("limit=2&offset=2")["items"]) == 1
    anand = search("q=anand")["items"][0]
    client.patch(f"/api/farmers/{anand['id']}", headers=h, json={"status": "exited"})
    assert search("status=active")["total"] == 2
    assert client.get("/api/farmers?limit=0", headers=h).status_code == 422


def test_update_farmer(client, as_role):
    h = as_role("programme_admin")
    f = mk_farmer(client, h)
    r = client.patch(f"/api/farmers/{f['id']}", headers=h, json={"kyc_status": "verified", "phone": "9812345674"})
    assert r.status_code == 200 and r.json()["kyc_status"] == "verified" and r.json()["phone"] == "+919812345674"
    assert client.patch(f"/api/farmers/{f['id']}", headers=h, json={"status": "gone"}).status_code == 422


# ------------------------------------------------------------------ member lookup
def test_member_lookup_and_link(client, as_role):
    h = as_role("programme_admin")
    f = mk_farmer(client, h, phone="9812345670")
    look = client.post("/api/farmers/member-lookup", headers=h, json={"phone": "98123 45670"}).json()
    assert look["is_member"] and look["member_id"] == "VP-345670" and look["existing_farmer_id"] == f["id"]
    assert look["linked_farmer_id"] is None and look["farms"]
    assert {"has_soilsync", "has_microclime", "name"} <= set(look["farms"][0])
    linked = client.post("/api/farmers/member-lookup", headers=h, json={"phone": "9812345670", "farmer_id": f["id"]})
    assert linked.status_code == 200 and linked.json()["linked_farmer_id"] == f["id"]
    assert client.get(f"/api/farmers/{f['id']}", headers=h).json()["member_id"] == "VP-345670"
    assert any(a["action"] == "farmer.link_member" for a in client.get("/api/audit", headers=h).json())


def test_member_lookup_non_member_and_mismatch(client, as_role):
    h = as_role("programme_admin")
    odd = mk_farmer(client, h, phone="9812345671")
    look = client.post("/api/farmers/member-lookup", headers=h, json={"phone": "9812345671"}).json()
    assert look["is_member"] is False and look["member_id"] is None and look["farms"] == []
    r = client.post("/api/farmers/member-lookup", headers=h, json={"phone": "9812345671", "farmer_id": odd["id"]})
    assert r.status_code == 422 and r.json()["code"] == "NOT_A_MEMBER"
    mismatch = client.post("/api/farmers/member-lookup", headers=h, json={"phone": "9812345670", "farmer_id": odd["id"]})
    assert mismatch.status_code == 422 and mismatch.json()["code"] == "PHONE_MISMATCH"
    assert client.post("/api/farmers/member-lookup", headers=h, json={"phone": "123456"}).status_code == 422


# ------------------------------------------------------------------ overview
def test_farmer_overview(client, as_role):
    from app.core import geo

    h = as_role("programme_admin")
    client.post("/api/catalogue/install-defaults", headers=h)
    f = mk_farmer(client, h)
    farm = client.post("/api/farms", headers=h, json={"farmer_id": f["id"], "name": "Hill Estate"}).json()
    field = client.post("/api/fields", headers=h, json={
        "farm_id": farm["id"], "name": "Block A", "boundary": geo.square(12.40, 75.70, 100),
        "crop_code": "coffee", "crop_attributes": {"variety": "arabica"}}).json()
    client.post(f"/api/farmers/{f['id']}/consents", headers=h, json={"purpose": "sampling", "granted": True})
    client.post("/api/practices", headers=h, json={
        "field_id": field["id"], "practice_code": "zero_tillage", "scenario": "project", "performed_on": "2025-06-01"})
    ov = client.get(f"/api/farmers/{f['id']}/overview", headers=h)
    assert ov.status_code == 200, ov.text
    body = ov.json()
    assert body["farmer"]["id"] == f["id"] and body["fpo"] is None
    assert body["farms"][0]["fields"][0]["code"] == field["code"]
    assert body["total_area_ha"] == pytest.approx(1.0, rel=0.01)
    consents = {c["purpose"]: c["state"] for c in body["consents"]}
    assert consents["sampling"] == "granted" and consents["data_use"] == "not_given"
    assert body["practice_records"] == 1 and body["enrolments"] == []


# ------------------------------------------------------------------ permissions & isolation
def test_farmer_permissions(client, as_role):
    for role in ("field_collector", "mrv_analyst", "farmer"):
        r = client.post("/api/farmers", headers=as_role(role), json={"full_name": "No One", "phone": "9812345670"})
        assert r.status_code == 403, role
        assert client.post("/api/farmers/member-lookup", headers=as_role(role), json={"phone": "9812345670"}).status_code == 403
    assert client.get("/api/farmers", headers=as_role("mrv_analyst")).status_code == 200
    assert client.get("/api/farmers", headers=as_role("farmer")).status_code == 403


def test_farmer_tenant_isolation(client, as_role):
    h = as_role("programme_admin")
    f = mk_farmer(client, h)
    fpo = client.post("/api/fpos", headers=h, json={"name": "Our FPO"}).json()
    other = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/farmers/{f['id']}", headers=other).status_code == 404
    assert client.get(f"/api/farmers/{f['id']}/overview", headers=other).status_code == 404
    assert client.patch(f"/api/farmers/{f['id']}", headers=other, json={"full_name": "Hijack"}).status_code == 404
    assert client.get(f"/api/fpos/{fpo['id']}", headers=other).status_code == 404
    assert client.get("/api/farmers", headers=other).json()["total"] == 0
    r = client.post("/api/farmers", headers=other, json={"full_name": "Mine Now", "phone": "9812345672",
                                                         "fpo_id": fpo["id"]})
    assert r.status_code == 404
    r = client.post("/api/farmers/member-lookup", headers=other, json={"phone": f["phone"], "farmer_id": f["id"]})
    assert r.status_code == 404
