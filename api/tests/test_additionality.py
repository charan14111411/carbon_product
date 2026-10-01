"""Additionality (VM0042 v2.2 §7): regulatory surplus, barriers (VT0008 Step 2), common practice (Step 4c)."""

import pytest

from app.modules.additionality import domain
from tests.conftest import login, make_org, make_user


def mk_project(client, h, code="AD-1"):
    prog = client.post("/api/programmes", headers=h, json={"code": f"PG-{code}", "name": "Programme"}).json()
    r = client.post("/api/projects", headers=h, json={"programme_id": prog["id"], "code": code, "name": "Project",
                                                       "crediting_start": "2025-01-01", "crediting_end": "2034-12-31"})
    assert r.status_code == 201, r.text
    return r.json()


def ev(client, h, name="doc.pdf"):
    r = client.post("/api/evidence", headers=h, files={"file": (name, b"%PDF-1.4 " + name.encode(), "application/pdf")},
                    data={"kind": "document"})
    return r.json()["id"]


def full_body(e, **practice):
    return {
        "regulatory_surplus": {"statement": "No Indian or Karnataka law requires reduced tillage or cover crops.",
                               "legally_required": False, "evidence_ids": [e]},
        "barriers": [{"type": "investment", "description": "Smallholders lack credit for no-till seed drills.",
                      "evidence_ids": [e]}],
        "common_practice": [{"practice": "No-till + cover crops", "region": "Karnataka", "adoption_pct": 4.5,
                             "source_type": "census", "evidence_ids": [e], **practice}],
    }


# ------------------------------------------------------------------ pure rules
def test_worked_example_f_15_percent_passes():
    """§7 example: N_all 2 M ha, N_diff 1.7 M ha -> F = 15 % -> not common practice."""
    assert domain.f_share(2_000_000, 1_700_000) == pytest.approx(0.15)
    r = domain.common_practice([{"practice": "Cover crops", "region": "Karnataka", "adoption_pct": 35,
                                 "source_type": "census", "evidence_ids": ["x"],
                                 "essential_distinction": {"n_all_ha": 2_000_000, "n_diff_ha": 1_700_000,
                                                           "description": "Legume cover crop after rice"}}])
    row = r["details"]["practices"][0]
    assert r["status"] == "pass" and row["step"] == "3.2" and row["step32"]["f_pct"] == pytest.approx(15.0)


def test_f_at_or_above_20_percent_fails():
    for n_diff in (1_600_000, 1_000_000):  # F = 20 %, 50 %
        r = domain.common_practice([{"practice": "Cover crops", "region": "KA", "adoption_pct": None,
                                     "essential_distinction": {"n_all_ha": 2_000_000, "n_diff_ha": n_diff,
                                                               "description": "distinction"}}])
        assert r["status"] == "fail", n_diff


def test_adoption_thresholds():
    base = {"practice": "No-till", "region": "Karnataka", "source_type": "peer_reviewed", "evidence_ids": ["x"]}
    assert domain.common_practice([{**base, "adoption_pct": 19.9}])["status"] == "pass"
    at20 = domain.common_practice([{**base, "adoption_pct": 20}])
    assert at20["status"] == "incomplete" and "4c" in at20["details"]["practices"][0]["problems"][0]  # needs step 3.2
    unknown = domain.common_practice([{"practice": "No-till", "region": "Karnataka", "adoption_pct": None}])
    assert unknown["status"] == "incomplete" and unknown["details"]["practices"][0]["step"] == "3.2"
    no_region = domain.common_practice([{**base, "region": "", "adoption_pct": 5}])
    assert no_region["status"] == "incomplete"
    no_source = domain.common_practice([{**base, "evidence_ids": [], "adoption_pct": 5}])
    assert no_source["status"] == "incomplete"
    bad_ed = domain.common_practice([{**base, "adoption_pct": 30, "essential_distinction": {
        "n_all_ha": 100, "n_diff_ha": 150, "description": "x"}}])
    assert bad_ed["status"] == "incomplete"


def test_expert_attestation_needs_details():
    p = {"practice": "Mulching", "region": "Karnataka", "adoption_pct": 8, "source_type": "expert_attestation",
         "expert": {"name": "Dr A", "qualifications": "", "method": "survey"}}
    r = domain.common_practice([p])
    assert r["status"] == "incomplete" and "qualifications" in r["details"]["practices"][0]["problems"][0]
    p["expert"] = {"name": "Dr A", "qualifications": "PhD agronomy, 20 yrs", "method": "survey of 40 villages",
                   "attestation_evidence_id": "x"}
    assert domain.common_practice([p])["status"] == "pass"


def test_steps_1_and_2():
    assert domain.regulatory_surplus({})["status"] == "incomplete"
    ok = {"statement": "Not required by any law or regulation.", "legally_required": False, "evidence_ids": ["x"]}
    assert domain.regulatory_surplus(ok)["status"] == "pass"
    assert domain.regulatory_surplus({**ok, "legally_required": True})["status"] == "fail"
    assert domain.regulatory_surplus({**ok, "evidence_ids": []})["status"] == "incomplete"
    assert domain.regulatory_surplus({**ok, "legally_required": None})["status"] == "incomplete"
    assert domain.barrier_analysis([])["status"] == "incomplete"
    b = {"type": "technological", "description": "No local supply of cover-crop seed.", "evidence_ids": ["x"]}
    assert domain.barrier_analysis([b])["status"] == "pass"
    assert domain.barrier_analysis([{**b, "evidence_ids": []}])["status"] == "incomplete"
    assert domain.barrier_analysis([{**b, "type": "weather"}])["status"] == "incomplete"


# ------------------------------------------------------------------ API
def test_lifecycle_versioning_and_four_eyes(client, as_role):
    h = as_role("programme_admin")
    p = mk_project(client, h)
    base = f"/api/projects/{p['id']}/additionality"
    assert client.get(base, headers=h).status_code == 404
    e = ev(client, h)
    r = client.post(base, headers=h, json={"barriers": []})
    assert r.status_code == 201 and r.json()["version"] == 1 and r.json()["status"] == "draft"
    a = r.json()
    assert a["result"]["complete"] is False and a["result"]["additional"] is False
    assert client.post(base, headers=h, json={}).json()["code"] == "OPEN_VERSION_EXISTS"
    blocked = client.post(f"{base}/{a['id']}/submit", headers=h)
    assert blocked.status_code == 409 and blocked.json()["code"] == "ASSESSMENT_INCOMPLETE"
    up = client.patch(f"{base}/{a['id']}", headers=h, json=full_body(e))
    assert up.status_code == 200 and up.json()["result"]["additional"] is True
    sub = client.post(f"{base}/{a['id']}/submit", headers=h)
    assert sub.status_code == 200 and sub.json()["status"] == "submitted" and sub.json()["result"]["additional"]
    assert client.patch(f"{base}/{a['id']}", headers=h, json={"barriers": []}).status_code == 409
    assert client.post(f"{base}/{a['id']}/approve", headers=h).status_code == 403  # programme admin lacks rights
    sci = as_role("methodology_owner")
    ok = client.post(f"{base}/{a['id']}/approve", headers=sci, json={"note": "Checked against census"})
    assert ok.status_code == 200 and ok.json()["status"] == "approved" and ok.json()["approved_by"]
    # a second version copies the first; approving it supersedes version 1
    v2 = client.post(base, headers=h)
    assert v2.status_code == 201 and v2.json()["version"] == 2 and v2.json()["supersedes_id"] == a["id"]
    assert v2.json()["barriers"] == ok.json()["barriers"]
    client.post(f"{base}/{v2.json()['id']}/submit", headers=h)
    client.post(f"{base}/{v2.json()['id']}/approve", headers=sci)
    vs = client.get(f"{base}/versions", headers=h).json()
    assert [(v["version"], v["status"]) for v in vs] == [(2, "approved"), (1, "superseded")]
    assert client.get(base, headers=h).json()["version"] == 2


def test_author_cannot_approve(client, as_role):
    admin = as_role("platform_admin")  # may both write and approve, but never their own work
    p = mk_project(client, admin)
    base = f"/api/projects/{p['id']}/additionality"
    e = ev(client, admin)
    a = client.post(base, headers=admin, json=full_body(e)).json()
    client.post(f"{base}/{a['id']}/submit", headers=admin)
    r = client.post(f"{base}/{a['id']}/approve", headers=admin)
    assert r.status_code == 403 and r.json()["code"] == "SELF_APPROVAL_REJECTED"
    sci = as_role("methodology_owner")
    assert client.post(f"{base}/{a['id']}/reject", headers=sci, json={"note": "no"}).status_code == 422
    rej = client.post(f"{base}/{a['id']}/reject", headers=sci, json={"note": "Census source is outdated"})
    assert rej.status_code == 200 and rej.json()["status"] == "rejected"
    assert client.post(f"{base}/{a['id']}/approve", headers=sci).status_code == 409
    assert client.post(base, headers=admin).status_code == 201  # rejected versions don't block a new one


def test_not_additional_when_common_practice(client, as_role):
    h = as_role("programme_admin")
    p = mk_project(client, h)
    e = ev(client, h)
    body = full_body(e, adoption_pct=45, essential_distinction={"n_all_ha": 2_000_000, "n_diff_ha": 1_000_000,
                                                               "description": "Mechanised no-till"})
    a = client.post(f"/api/projects/{p['id']}/additionality", headers=h, json=body).json()
    res = a["result"]
    assert res["complete"] and res["additional"] is False
    assert any("Common practice" in r for r in res["reasons"])
    # the worked example passes
    body = full_body(e, adoption_pct=None, source_type=None,
                     essential_distinction={"n_all_ha": 2_000_000, "n_diff_ha": 1_700_000, "description": "x"})
    a = client.patch(f"/api/projects/{p['id']}/additionality/{a['id']}", headers=h, json=body).json()
    assert a["result"]["additional"] is True
    cp = a["result"]["steps"][2]["details"]["practices"][0]
    assert cp["step32"]["f_pct"] == pytest.approx(15.0)


def test_evidence_validation_permissions_isolation(client, as_role):
    h = as_role("programme_admin")
    p = mk_project(client, h)
    base = f"/api/projects/{p['id']}/additionality"
    bad = client.post(base, headers=h, json=full_body("00000000-0000-0000-0000-000000000000"))
    assert bad.status_code == 422 and bad.json()["code"] == "INVALID_EVIDENCE"
    assert client.post(base, headers=h, json={"barriers": [{"type": "weather", "description": "x"}]}
                       ).status_code == 422
    a = client.post(base, headers=h, json=full_body(ev(client, h))).json()
    assert client.get(base, headers=as_role("mrv_analyst")).status_code == 200
    assert client.post(base, headers=as_role("mrv_analyst"), json={}).status_code == 403
    rival = login(client, make_user(make_org("Rival"), "platform_admin"))
    assert client.get(base, headers=rival).status_code == 404
    assert client.get(f"{base}/{a['id']}", headers=rival).status_code == 404
    rp = mk_project(client, rival, code="RIV")
    assert client.get(f"/api/projects/{rp['id']}/additionality/{a['id']}", headers=rival).status_code == 404
    assert client.post(f"/api/projects/{rp['id']}/additionality", headers=rival,
                       json=full_body(ev(client, h, "ours.pdf"))).status_code == 422
