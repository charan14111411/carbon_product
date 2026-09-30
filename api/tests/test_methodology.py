import uuid

from app.core import db as dbmod
from app.modules.methodology.definitions import RULES, outstanding
from app.modules.methodology.models import RulePack
from tests._p1b_factories import full_values, make_pack, make_project
from tests.conftest import login, make_org, make_user


def _pack(client, h, **kw):
    body = {"methodology_code": "VM0042", "methodology_version": "2.2", "title": "VM0042 v2.2 India", **kw}
    r = client.post("/api/rule-packs", headers=h, json=body)
    assert r.status_code == 201, r.text
    return r.json()


def _fill(client, h, pack_id, values=None):
    for k, v in (values or full_values()).items():
        r = client.put(f"/api/rule-packs/{pack_id}/rules/{k}", headers=h,
                       json={"value": v, "source_document": "VM0042 v2.2", "source_section": "§8"})
        assert r.status_code == 200, (k, r.text)


def test_example_values_cover_every_required_rule():
    assert outstanding(full_values()) == []


def test_definitions_grouped(client, as_role):
    r = client.get("/api/methodology/definitions", headers=as_role("methodology_owner"))
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == len(RULES)
    stock = next(g for g in body["groups"] if g["key"] == "stock")
    assert stock["label"] == "Soil carbon stock"
    depth = next(x for x in stock["rules"] if x["key"] == "stock_depth_cm")
    assert depth["unit"] == "cm" and depth["kind"] == "number"


def test_revision_increments_and_based_on_copies_rules(client, as_role):
    h = as_role("methodology_owner")
    p1 = _pack(client, h)
    assert p1["revision"] == 1 and p1["status"] == "draft"
    client.put(f"/api/rule-packs/{p1['id']}/rules/stock_depth_cm", headers=h,
               json={"value": 30, "source_document": "VM0042 v2.2", "source_page": "41"})
    p2 = _pack(client, h, based_on_id=p1["id"])
    assert p2["revision"] == 2
    assert [r["key"] for r in p2["rules"]] == ["stock_depth_cm"]
    assert p2["rules"][0]["value"] == 30 and "p. 41" in p2["rules"][0]["source"]
    other = _pack(client, h, methodology_version="2.1")
    assert other["revision"] == 1


def test_rule_validation_and_unknown_key(client, as_role):
    h = as_role("methodology_owner")
    p = _pack(client, h)
    bad = client.put(f"/api/rule-packs/{p['id']}/rules/stock_depth_cm", headers=h,
                     json={"value": 2, "source_document": "VM0042"})
    assert bad.status_code == 422 and bad.json()["code"] == "INVALID_RULE_VALUE"
    unknown = client.put(f"/api/rule-packs/{p['id']}/rules/made_up", headers=h,
                         json={"value": 2, "source_document": "VM0042"})
    assert unknown.status_code == 404
    short_source = client.put(f"/api/rule-packs/{p['id']}/rules/stock_depth_cm", headers=h,
                              json={"value": 30, "source_document": "V"})
    assert short_source.status_code == 422


def test_detail_shows_entered_by_and_outstanding(client, as_role):
    h = as_role("methodology_owner")
    p = _pack(client, h)
    r = client.put(f"/api/rule-packs/{p['id']}/rules/required_photos", headers=h,
                   json={"value": 3, "source_document": "Field SOP", "notes": "three angles"})
    rule = r.json()["rules"][0]
    assert rule["label"] == "Photos per core" and rule["kind"] == "integer"
    assert rule["entered_by"] == "Methodology Owner"
    assert "required_photos" not in r.json()["outstanding"]
    assert "stock_depth_cm" in r.json()["outstanding"]
    ready = client.get(f"/api/rule-packs/{p['id']}/readiness", headers=h).json()
    assert ready["answered"] == 1 and ready["total"] == len(RULES) and ready["can_approve"] is False


def test_approval_four_eyes_outstanding_and_freeze(client, as_role, org):
    author = as_role("methodology_owner")
    p = _pack(client, author)
    _fill(client, author, p["id"], {k: v for k, v in full_values().items() if k != "required_photos"})
    # the author can't approve
    selfish = client.post(f"/api/rule-packs/{p['id']}/approve", headers=author)
    assert selfish.status_code == 403 and selfish.json()["code"] == "SELF_APPROVAL_REJECTED"
    # a colleague who edited one rule can't approve either
    editor = login(client, make_user(org, "methodology_owner"))
    client.put(f"/api/rule-packs/{p['id']}/rules/gps_accuracy_max_m", headers=editor,
               json={"value": 4, "source_document": "Field SOP"})
    assert client.post(f"/api/rule-packs/{p['id']}/approve", headers=editor).status_code == 403
    approver = login(client, make_user(org, "methodology_owner"))
    missing = client.post(f"/api/rule-packs/{p['id']}/approve", headers=approver)
    assert missing.status_code == 409 and missing.json()["code"] == "RULE_MISSING"
    assert missing.json()["details"]["outstanding"] == ["required_photos"]
    client.put(f"/api/rule-packs/{p['id']}/rules/required_photos", headers=author,
               json={"value": 3, "source_document": "Field SOP"})
    ok = client.post(f"/api/rule-packs/{p['id']}/approve", headers=approver)
    assert ok.status_code == 200 and ok.json()["status"] == "approved"
    assert ok.json()["approved_by"] == "Methodology Owner"
    frozen = client.put(f"/api/rule-packs/{p['id']}/rules/required_photos", headers=author,
                        json={"value": 4, "source_document": "Field SOP"})
    assert frozen.status_code == 409 and frozen.json()["code"] == "PACK_APPROVED"
    assert client.delete(f"/api/rule-packs/{p['id']}/rules/required_photos", headers=author).status_code == 409
    log = client.get("/api/audit", headers=as_role("programme_admin"), params={"entity_type": "RulePack"}).json()
    assert any(e["action"] == "rule_pack.approve" for e in log)


def test_delete_rule_in_draft(client, as_role):
    h = as_role("methodology_owner")
    p = _pack(client, h)
    client.put(f"/api/rule-packs/{p['id']}/rules/required_photos", headers=h,
               json={"value": 3, "source_document": "Field SOP"})
    r = client.delete(f"/api/rule-packs/{p['id']}/rules/required_photos", headers=h)
    assert r.status_code == 200 and r.json()["rules"] == []
    assert client.delete(f"/api/rule-packs/{p['id']}/rules/required_photos", headers=h).status_code == 404


def test_permissions(client, as_role):
    p = _pack(client, as_role("methodology_owner"))
    assert client.post("/api/rule-packs", headers=as_role("field_collector"),
                       json={"methodology_code": "X", "methodology_version": "1", "title": "Nope"}).status_code == 403
    assert client.put(f"/api/rule-packs/{p['id']}/rules/required_photos", headers=as_role("programme_admin"),
                      json={"value": 3, "source_document": "Field SOP"}).status_code == 403
    assert client.post(f"/api/rule-packs/{p['id']}/approve", headers=as_role("mrv_analyst")).status_code == 403
    assert client.get(f"/api/rule-packs/{p['id']}", headers=as_role("mrv_analyst")).status_code == 200


def test_tenant_isolation(client, as_role):
    p = _pack(client, as_role("methodology_owner"))
    rival = login(client, make_user(make_org("Rival"), "methodology_owner"))
    assert client.get(f"/api/rule-packs/{p['id']}", headers=rival).status_code == 404
    assert client.get("/api/rule-packs", headers=rival).json() == []
    assert client.put(f"/api/rule-packs/{p['id']}/rules/required_photos", headers=rival,
                      json={"value": 3, "source_document": "Field SOP"}).status_code == 404


def test_assign_to_project_and_retire(client, as_role, org):
    author = as_role("methodology_owner")
    p = _pack(client, author)
    proj = make_project(org)
    admin = as_role("programme_admin")
    draft = client.post(f"/api/projects/{proj['project_id']}/rule-pack", headers=admin, json={"pack_id": p["id"]})
    assert draft.status_code == 422 and draft.json()["code"] == "PACK_NOT_APPROVED"
    _fill(client, author, p["id"])
    approver = login(client, make_user(org, "methodology_owner"))
    assert client.post(f"/api/rule-packs/{p['id']}/approve", headers=approver).status_code == 200
    ok = client.post(f"/api/projects/{proj['project_id']}/rule-pack", headers=admin, json={"pack_id": p["id"]})
    assert ok.status_code == 200 and ok.json()["rule_pack_id"] == p["id"]
    assert client.post(f"/api/projects/{proj['project_id']}/rule-pack", headers=as_role("field_collector"),
                       json={"pack_id": p["id"]}).status_code == 403
    in_use = client.post(f"/api/rule-packs/{p['id']}/retire", headers=approver)
    assert in_use.status_code == 409 and in_use.json()["code"] == "PACK_IN_USE"
    other = _pack(client, author, methodology_version="2.1")
    retired = client.post(f"/api/rule-packs/{other['id']}/retire", headers=approver)
    assert retired.status_code == 200 and retired.json()["status"] == "retired"
    edit = client.put(f"/api/rule-packs/{other['id']}/rules/required_photos", headers=author,
                      json={"value": 3, "source_document": "Field SOP"})
    assert edit.status_code == 409 and edit.json()["code"] == "PACK_RETIRED"


def test_methodology_mismatch(client, as_role, org):
    proj = make_project(org)
    pack_id = make_pack(org)
    with dbmod.session_factory()() as s:
        s.get(RulePack, uuid.UUID(pack_id)).methodology_version = "9.9"
        s.commit()
    r = client.post(f"/api/projects/{proj['project_id']}/rule-pack", headers=as_role("programme_admin"),
                    json={"pack_id": pack_id})
    assert r.status_code == 422 and r.json()["code"] == "METHODOLOGY_MISMATCH"
