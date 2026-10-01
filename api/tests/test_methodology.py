import uuid

from app.core import db as dbmod
from app.modules.methodology.definitions import BY_KEY, RULES, VM0042_DOCUMENT, WITH_VM0042_DEFAULT, outstanding
from app.modules.methodology.models import RulePack
from tests._p1b_factories import full_values, make_pack, make_project
from tests.conftest import login, make_org, make_user


def _pack(client, h, **kw):
    body = {"methodology_code": "VM0042", "methodology_version": "2.2", "title": "VM0042 v2.2 India", **kw}
    r = client.post("/api/rule-packs", headers=h, json=body)
    assert r.status_code == 201, r.text
    return r.json()


def vm_values(**over) -> dict:
    """Example values with the VM0042 v2.2 stock method (the shared factory still uses a legacy fixed depth)."""
    return full_values(stock_method="esm", **over)


def _fill(client, h, pack_id, values=None):
    for k, v in (values or vm_values()).items():
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
    _fill(client, author, p["id"], {k: v for k, v in vm_values().items() if k != "required_photos"})
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


# ------------------------------------------------------------------ VM0042 v2.2 catalogue
def test_every_rule_cites_vm0042_where_it_fixes_a_value():
    assert outstanding(vm_values()) == []
    for r in WITH_VM0042_DEFAULT:
        assert r.vm0042_ref and r.ref_parts()[1], r.key  # section and page
    fixed = {r.key: r.vm0042_default for r in WITH_VM0042_DEFAULT}
    assert fixed["uncertainty_confidence"] == 0.667 and fixed["gwp_ch4"] == 28 and fixed["gwp_n2o"] == 265
    assert fixed["ef_limestone"] == 0.12 and fixed["ef_dolomite"] == 0.13
    assert fixed["ef_gasoline"] == 0.002810 and fixed["ef_diesel"] == 0.002886
    assert fixed["stock_method"] == "esm" and fixed["stock_depth_cm"] == 30 and fixed["min_control_sites"] == 3
    for key in ("non_permanence_risk_pct", "emission_factors", "qa_soc", "qa_n2o_soil"):
        assert BY_KEY[key].vm0042_default is None, key  # left for the owner
    assert BY_KEY["uncertainty_confidence"].ref_parts() == ("§8.6.4 Eq. 74", "82")


def test_definitions_expose_vm0042_references(client, as_role):
    body = client.get("/api/methodology/definitions", headers=as_role("methodology_owner")).json()
    assert body["vm0042_document"] == VM0042_DOCUMENT and body["with_vm0042_default"] == len(WITH_VM0042_DEFAULT)
    rules = {x["key"]: x for g in body["groups"] for x in g["rules"]}
    assert rules["gwp_n2o"]["vm0042_default"] == 265 and rules["gwp_n2o"]["vm0042_ref"] == "§9.1 p.89"
    assert rules["stock_method"]["warning_choices"] == ["fixed_depth_with_mass_correction"]


def test_apply_vm0042_defaults(client, as_role, org):
    h = as_role("methodology_owner")
    p = _pack(client, h)
    client.put(f"/api/rule-packs/{p['id']}/rules/min_composites_per_stratum", headers=h,
               json={"value": 5, "source_document": "Project SOP"})
    r = client.post(f"/api/rule-packs/{p['id']}/apply-vm0042-defaults", headers=h)
    assert r.status_code == 200, r.text
    summary = r.json()["vm0042_defaults"]
    assert "gwp_ch4" in summary["applied"] and "min_composites_per_stratum" in summary["kept"]
    assert {"non_permanence_risk_pct", "emission_factors", "qa_soc"} <= set(summary["left_for_owner"])
    rules = {x["key"]: x for x in r.json()["rules"]}
    g = rules["gwp_ch4"]
    assert g["value"] == 28 and g["source_document"] == VM0042_DOCUMENT
    assert g["source_section"] == "§9.1" and g["source_page"] == "87" and g["matches_vm0042_default"] is True
    assert rules["min_composites_per_stratum"]["value"] == 5  # the owner's stricter value is kept
    assert "non_permanence_risk_pct" in r.json()["outstanding"] and "qa_soc" in r.json()["outstanding"]
    over = client.post(f"/api/rule-packs/{p['id']}/apply-vm0042-defaults?overwrite=true", headers=h).json()
    assert {x["key"]: x for x in over["rules"]}["min_composites_per_stratum"]["value"] == 3
    assert client.post(f"/api/rule-packs/{p['id']}/apply-vm0042-defaults",
                       headers=as_role("programme_admin")).status_code == 403
    # still four-eyes: whoever applied the defaults can't approve
    _fill(client, h, p["id"], {k: v for k, v in vm_values().items() if k not in {d.key for d in WITH_VM0042_DEFAULT}})
    assert client.post(f"/api/rule-packs/{p['id']}/approve", headers=h).status_code == 403
    approver = login(client, make_user(org, "methodology_owner"))
    assert client.post(f"/api/rule-packs/{p['id']}/approve", headers=approver).status_code == 200
    frozen = client.post(f"/api/rule-packs/{p['id']}/apply-vm0042-defaults", headers=h)
    assert frozen.status_code == 409 and frozen.json()["code"] == "PACK_APPROVED"


def test_stock_method_and_factor_validation(client, as_role):
    h = as_role("methodology_owner")
    p = _pack(client, h)
    legacy = client.put(f"/api/rule-packs/{p['id']}/rules/stock_method", headers=h,
                        json={"value": "fixed_depth", "source_document": "VM0042 v2.2"})
    assert legacy.status_code == 422
    ok = client.put(f"/api/rule-packs/{p['id']}/rules/stock_method", headers=h,
                    json={"value": "fixed_depth_with_mass_correction", "source_document": "VM0042 v2.2"})
    assert ok.status_code == 200 and ok.json()["warnings"][0]["key"] == "stock_method"
    shallow = client.put(f"/api/rule-packs/{p['id']}/rules/stock_depth_cm", headers=h,
                         json={"value": 20, "source_document": "VM0042 v2.2"})
    assert shallow.status_code == 422  # VM0042 reports to at least 30 cm
    bad_range = client.put(f"/api/rule-packs/{p['id']}/rules/emission_factors", headers=h, json={
        "value": {"EF_Ndirect": {"value": 0.01, "low": 0.02}}, "source_document": "IPCC 2019 Table 11.1"})
    assert bad_range.status_code == 422
    good = client.put(f"/api/rule-packs/{p['id']}/rules/emission_factors", headers=h, json={
        "value": {"EF_Ndirect": {"value": 0.016, "low": 0.013, "high": 0.019}, "Frac_LEACH": 0},
        "source_document": "IPCC 2019 Table 11.1"})
    assert good.status_code == 200
