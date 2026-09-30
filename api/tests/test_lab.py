import uuid

import pytest

from app.core import db as dbmod
from app.core.errors import ImmutableRecord
from app.modules.lab.models import LabResult
from tests._p1b_factories import Flow, full_values, make_pack, set_project_pack
from tests.conftest import login, make_org, make_user

PDF = b"%PDF-1.4\n% test certificate\n"


class LabFlow(Flow):
    def __init__(self, client, org_id, **kw):
        super().__init__(client, org_id, **kw)
        self.camp, self.points = self.placed_campaign(n=5)
        self.sample = self.submit(self.points[0]).json()["sample"]
        self.layers = self.sample["layers"]
        self.manager_email = make_user(org_id, "lab_manager")
        self.manager = login(client, self.manager_email)
        self.reviewer = login(client, make_user(org_id, "lab_manager"))
        r = client.post("/api/labs", headers=self.planner, json={
            "code": f"LAB-{uuid.uuid4().hex[:4]}", "name": "Soil Lab Mysuru", "city": "Mysuru",
            "accreditation": "NABL", "accreditation_valid_until": "2030-01-01"})
        assert r.status_code == 201, r.text
        self.lab = r.json()

    def batch(self, layer_ids=None, lab_id=None):
        return self.c.post("/api/lab-batches", headers=self.planner, json={
            "lab_id": lab_id or self.lab["id"], "campaign_id": self.camp["id"],
            "layer_ids": layer_ids or [x["id"] for x in self.layers]})

    def result(self, headers=None, **kw):
        body = {"layer_id": self.layers[0]["id"], "analyte": "soc_pct", "value": 1.4, "unit": "%",
                "method": "dry_combustion", "analysed_on": "2024-03-05", "lab_id": self.lab["id"], **kw}
        return self.c.post("/api/lab-results", headers=headers or self.manager, json=body)

    def certify(self, result_id, headers=None):
        r = self.c.post(f"/api/lab-results/{result_id}/certificate", headers=headers or self.manager,
                        files={"file": ("cert.pdf", PDF + uuid.uuid4().bytes, "application/pdf")})
        assert r.status_code == 200, r.text
        return r.json()


def test_lab_crud_permissions_and_isolation(client, org, as_role):
    f = LabFlow(client, org)
    assert f.lab["accreditation_current"] is True
    upd = client.put(f"/api/labs/{f.lab['id']}", headers=f.planner, json={"city": "Bengaluru"})
    assert upd.status_code == 200 and upd.json()["city"] == "Bengaluru"
    assert client.post("/api/labs", headers=as_role("lab_manager"),
                       json={"code": "X1", "name": "Nope"}).status_code == 403
    dup = client.post("/api/labs", headers=f.planner, json={"code": f.lab["code"], "name": "Again"})
    assert dup.status_code == 409
    rival = login(client, make_user(make_org("Rival"), "platform_admin"))
    assert client.get(f"/api/labs/{f.lab['id']}", headers=rival).status_code == 404
    assert client.get("/api/labs", headers=rival).json() == []


def test_batch_manifest_and_dispatch(client, org):
    f = LabFlow(client, org)
    r = f.batch()
    assert r.status_code == 201, r.text
    b = r.json()
    assert b["code"] == f"LB-{f.camp['code']}-01" and b["bag_count"] == 2
    assert [m["bag_code"] for m in b["manifest"]] == [x["code"] for x in f.layers]
    again = f.batch()
    assert again.status_code == 409 and again.json()["code"] == "LAYER_IN_BATCH"
    d = client.post(f"/api/lab-batches/{b['id']}/dispatch", headers=f.planner, json={"dispatched_on": "2024-02-12"})
    assert d.status_code == 200 and d.json()["status"] == "dispatched" and d.json()["dispatched_on"] == "2024-02-12"
    assert client.post(f"/api/lab-batches/{b['id']}/dispatch", headers=f.planner).status_code == 409
    other = f.campaign("OTHER-C")
    wrong = client.post("/api/lab-batches", headers=f.planner, json={
        "lab_id": f.lab["id"], "campaign_id": other["id"], "layer_ids": [f.layers[0]["id"]]})
    assert wrong.status_code == 422 and wrong.json()["code"] == "LAYER_WRONG_CAMPAIGN"


def test_result_validation(client, org):
    f = LabFlow(client, org)
    assert f.result(value=75).json()["code"] == "VALUE_OUT_OF_RANGE"
    assert f.result(analyte="bulk_density_g_cm3", value=3.0, unit="g/cm3").json()["code"] == "VALUE_OUT_OF_RANGE"
    assert f.result(analyte="coarse_fraction", value=0.99, unit="fraction").json()["code"] == "VALUE_OUT_OF_RANGE"
    assert f.result(analyte="ph", value=15, unit="pH").json()["code"] == "VALUE_OUT_OF_RANGE"
    assert f.result(analyte="nitrogen").json()["code"] == "UNKNOWN_ANALYTE"
    assert f.result(unit="g/kg").json()["code"] == "UNIT_MISMATCH"
    early = f.result(analysed_on="2024-02-01")
    assert early.status_code == 422 and early.json()["code"] == "ANALYSIS_BEFORE_COLLECTION"
    ok = f.result()
    assert ok.status_code == 201 and ok.json()["status"] == "pending" and ok.json()["unit"] == "%"
    dup = f.result(value=1.5)
    assert dup.status_code == 409 and dup.json()["code"] == "RESULT_EXISTS"
    edited = client.put(f"/api/lab-results/{ok.json()['id']}", headers=f.manager, json={"value": 1.45})
    assert edited.status_code == 200 and edited.json()["value"] == 1.45
    bd = f.result(analyte="bulk_density_g_cm3", value=1.3, unit="Mg/m3", method="core_ring")
    assert bd.status_code == 201 and bd.json()["unit"] == "g/cm3"


def test_technician_scope_fails_closed(client, org):
    f = LabFlow(client, org)
    assert f.batch().status_code == 201
    other_lab = client.post("/api/labs", headers=f.planner, json={"code": "LAB-OTHER", "name": "Other"}).json()
    unscoped = login(client, make_user(org, "lab_technician"))
    assert client.get("/api/lab-results", headers=unscoped).json()["items"] == []
    assert client.get("/api/labs", headers=unscoped).json() == []
    assert f.result(headers=unscoped).json()["code"] == "NO_LAB_SCOPE"
    mine = login(client, make_user(org, "lab_technician", scope={"lab_id": f.lab["id"]}))
    r = f.result(headers=mine, lab_id=other_lab["id"])  # lab_id is forced to the technician's lab
    assert r.status_code == 201 and r.json()["lab_id"] == f.lab["id"]
    theirs = login(client, make_user(org, "lab_technician", scope={"lab_id": other_lab["id"]}))
    assert f.result(headers=theirs, layer_id=f.layers[1]["id"]).status_code == 404  # bag not sent to that lab
    assert client.get("/api/lab-results", headers=theirs).json()["total"] == 0
    assert client.get(f"/api/lab-results/{r.json()['id']}", headers=theirs).status_code == 404
    assert client.get("/api/lab-results", headers=mine).json()["total"] == 1
    assert [x["id"] for x in client.get("/api/labs", headers=mine).json()] == [f.lab["id"]]


def test_accept_requires_four_eyes_certificate_and_permitted_method(client, org):
    f = LabFlow(client, org)
    r = f.result().json()
    no_cert = client.post(f"/api/lab-results/{r['id']}/accept", headers=f.reviewer)
    assert no_cert.status_code == 409 and no_cert.json()["code"] == "CERTIFICATE_MISSING"
    bad_pdf = client.post(f"/api/lab-results/{r['id']}/certificate", headers=f.manager,
                          files={"file": ("cert.pdf", b"not a pdf", "application/pdf")})
    assert bad_pdf.status_code == 422
    f.certify(r["id"])
    selfish = client.post(f"/api/lab-results/{r['id']}/accept", headers=f.manager)
    assert selfish.status_code == 403 and selfish.json()["code"] == "SELF_APPROVAL_REJECTED"
    tech = login(client, make_user(org, "lab_technician", scope={"lab_id": f.lab["id"]}))
    assert client.post(f"/api/lab-results/{r['id']}/accept", headers=tech).status_code == 403
    ok = client.post(f"/api/lab-results/{r['id']}/accept", headers=f.reviewer, json={"note": "Checked"})
    assert ok.status_code == 200 and ok.json()["status"] == "accepted"
    frozen = client.put(f"/api/lab-results/{r['id']}", headers=f.manager, json={"value": 2.0})
    assert frozen.status_code == 409
    with dbmod.session_factory()() as s:
        row = s.get(LabResult, uuid.UUID(r["id"]))
        row.value = 9.9
        with pytest.raises(ImmutableRecord):
            s.flush()
    wb = f.result(layer_id=f.layers[1]["id"], method="walkley_black").json()
    f.certify(wb["id"])
    refused = client.post(f"/api/lab-results/{wb['id']}/accept", headers=f.reviewer)
    assert refused.status_code == 409 and refused.json()["code"] == "METHOD_NOT_PERMITTED"


def test_accept_needs_approved_rule_pack(client, org):
    f = LabFlow(client, org)
    set_project_pack(f.pid, make_pack(org, status="draft"))
    r = f.result().json()
    f.certify(r["id"])
    blocked = client.post(f"/api/lab-results/{r['id']}/accept", headers=f.reviewer)
    assert blocked.status_code == 409 and blocked.json()["code"] == "RULE_MISSING"
    ph = f.result(analyte="ph", value=6.5, unit="pH", method="glass_electrode").json()
    f.certify(ph["id"])
    assert client.post(f"/api/lab-results/{ph['id']}/accept", headers=f.reviewer).status_code == 200


def test_reject_void_and_supersede(client, org):
    f = LabFlow(client, org)
    r = f.result().json()
    short = client.post(f"/api/lab-results/{r['id']}/reject", headers=f.reviewer, json={"note": "no"})
    assert short.status_code == 422
    assert client.post(f"/api/lab-results/{r['id']}/void", headers=f.reviewer,
                       json={"note": "Wrong sample"}).status_code == 409  # only accepted can be voided
    f.certify(r["id"])
    client.post(f"/api/lab-results/{r['id']}/accept", headers=f.reviewer)
    tech = login(client, make_user(org, "lab_technician", scope={"lab_id": f.lab["id"]}))
    f.batch()
    denied = client.post(f"/api/lab-results/{r['id']}/supersede", headers=tech, json={
        "value": 1.6, "method": "dry_combustion", "analysed_on": "2024-03-09", "reason": "Re-run after drift"})
    assert denied.status_code == 403
    sup = client.post(f"/api/lab-results/{r['id']}/supersede", headers=f.manager, json={
        "value": 1.6, "method": "dry_combustion", "analysed_on": "2024-03-09", "reason": "Re-run after drift"})
    assert sup.status_code == 201, sup.text
    new = sup.json()
    assert new["version"] == 2 and new["supersedes_id"] == r["id"] and new["status"] == "pending"
    old = client.get(f"/api/lab-results/{r['id']}", headers=f.manager).json()
    assert old["status"] == "voided" and old["value"] == 1.4
    f.certify(new["id"])
    client.post(f"/api/lab-results/{new['id']}/accept", headers=f.reviewer)
    v = client.post(f"/api/lab-results/{new['id']}/void", headers=f.reviewer, json={"note": "Contaminated bag"})
    assert v.status_code == 200 and v.json()["status"] == "voided"
    b = f.result(layer_id=f.layers[1]["id"]).json()
    rej = client.post(f"/api/lab-results/{b['id']}/reject", headers=f.reviewer, json={"note": "Bad duplicate"})
    assert rej.status_code == 200 and rej.json()["status"] == "rejected"
    assert client.put(f"/api/lab-results/{b['id']}", headers=f.manager, json={"value": 1.0}).status_code == 409


def test_csv_import_row_by_row(client, org):
    f = LabFlow(client, org)
    l1, l2 = f.layers[0]["label_qr"], f.layers[1]["code"]
    csv_text = (
        "bag_code,analyte,value,unit,method,analysed_on,uncertainty\n"
        f"{l1},soc_pct,1.21,%,dry_combustion,2024-03-05,0.05\n"
        f"{l2},soc_pct,abc,%,dry_combustion,2024-03-05,\n"
        f"UNKNOWN-BAG,soc_pct,1.0,%,dry_combustion,2024-03-05,\n"
        f"{l2},bulk_density_g_cm3,1.31,g/cm3,core_ring,2024-03-06,\n"
        f"{l1},soc_pct,1.30,%,dry_combustion,2024-03-05,\n"
    )
    r = client.post("/api/lab-results/import", headers=f.manager, data={"lab_id": f.lab["id"]},
                    files={"file": ("results.csv", csv_text.encode(), "text/csv")})
    assert r.status_code == 200, r.text
    body = r.json()
    assert [x["status"] for x in body["rows"]] == ["created", "error", "error", "created", "error"]
    assert [x["row"] for x in body["rows"]] == [2, 3, 4, 5, 6]
    assert body["rows"][4]["code"] == "RESULT_EXISTS" and body["created"] == 2
    ev = client.get(f"/api/evidence/{body['file_id']}", headers=f.manager).json()
    assert ev["mime_type"] == "text/csv"
    bad = client.post("/api/lab-results/import", headers=f.manager,
                      files={"file": ("x.csv", b"foo,bar\n1,2\n", "text/csv")})
    assert bad.status_code == 422 and "bag_code" in bad.json()["details"]["missing"]
    listed = client.get("/api/lab-results", headers=f.manager,
                        params={"campaign_id": f.camp["id"], "analyte": "soc_pct", "page_size": 1}).json()
    assert listed["total"] == 1 and len(listed["items"]) == 1
    prog = client.get(f"/api/campaigns/{f.camp['id']}/lab-progress", headers=f.manager).json()
    assert prog["layers_total"] == 2
    assert prog["analytes"]["soc_pct"] == {"accepted": 0, "pending": 1, "missing": 1}
    assert prog["analytes"]["bulk_density_g_cm3"]["pending"] == 1


def test_spectral_calibration_workflow(client, org):
    f = LabFlow(client, org, rules=full_values(permitted_soc_methods=["dry_combustion", "mir_spectroscopy"]))
    no_cal = f.result(method="mir_spectroscopy")
    assert no_cal.status_code == 422 and no_cal.json()["code"] == "CALIBRATION_REQUIRED"
    cal = client.post("/api/spectral-calibrations", headers=f.manager, json={
        "code": "MIR-SOC-1", "analyte": "soc_pct", "reference_method": "dry_combustion", "n_samples": 240,
        "rmse": 0.12, "r2": 0.91, "valid_range": {"min": 0.2, "max": 4.5}}).json()
    draft = f.result(method="mir_spectroscopy", calibration_id=cal["id"])
    assert draft.json()["code"] == "CALIBRATION_NOT_APPROVED"
    assert client.post(f"/api/spectral-calibrations/{cal['id']}/approve", headers=f.manager).status_code == 403
    ok = client.post(f"/api/spectral-calibrations/{cal['id']}/approve", headers=f.reviewer)
    assert ok.status_code == 200 and ok.json()["status"] == "approved"
    assert client.put(f"/api/spectral-calibrations/{cal['id']}", headers=f.manager,
                      json={"rmse": 0.2}).status_code == 409
    out = f.result(method="mir_spectroscopy", calibration_id=cal["id"], value=6.0)
    assert out.json()["code"] == "OUTSIDE_CALIBRATION_RANGE"
    good = f.result(method="mir_spectroscopy", calibration_id=cal["id"], value=1.8)
    assert good.status_code == 201 and good.json()["data_class"] == "MODELLED"
    f.certify(good.json()["id"])
    assert client.post(f"/api/lab-results/{good.json()['id']}/accept", headers=f.reviewer).status_code == 200


def test_lab_results_tenant_isolation(client, org):
    f = LabFlow(client, org)
    r = f.result().json()
    rival = login(client, make_user(make_org("Rival"), "platform_admin"))
    assert client.get(f"/api/lab-results/{r['id']}", headers=rival).status_code == 404
    assert client.post(f"/api/lab-results/{r['id']}/accept", headers=rival).status_code == 404
    assert client.get("/api/lab-results", headers=rival).json()["total"] == 0
    assert client.post("/api/lab-results", headers=rival, json={
        "layer_id": f.layers[0]["id"], "analyte": "soc_pct", "value": 1.0, "unit": "%",
        "method": "dry_combustion", "analysed_on": "2024-03-05"}).status_code == 404
