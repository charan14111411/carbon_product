from datetime import date

from tests import _p345_factories as fx
from tests.conftest import login, make_org, make_user
from tests.test_risk import _risk

NPR = {"internal": {"project_management": 6, "financial_viability": 2, "opportunity_cost": 4, "project_longevity": 0},
       "external": {"land_tenure": 2, "community_engagement": -5, "political": 2},
       "natural": [{"hazard": "fire", "likelihood": "once every 25-50 years", "significance": "minor",
                    "score": 2, "mitigation": 0.5},
                   {"hazard": "drought", "likelihood": "once every 10-25 years", "significance": "minor", "score": 3}]}


# ------------------------------------------------------------------ NPR worksheet
def test_npr_worksheet_and_four_eyes_approval(client, org, as_role):
    w = fx.world(org)
    h = as_role("programme_admin")
    pid = w["project_id"]
    missing = client.post(f"/api/projects/{pid}/risk-profiles", headers=h,
                          json={"inputs": {"internal": {"project_management": 2}, "natural": []}})
    assert missing.status_code == 422 and missing.json()["code"] == "INVALID_NPR_INPUTS"
    assert len(missing.json()["details"]["errors"]) >= 4
    r = client.post(f"/api/projects/{pid}/risk-profiles", headers=h, json={"inputs": NPR})
    assert r.status_code == 201, r.text
    p = r.json()
    c = p["computed"]
    assert c["internal"]["total"] == 12 and c["external"]["total"] == 0  # a category can't go below zero
    assert c["natural"]["total"] == 4 and c["overall_score"] == 16 and p["computed_rating_pct"] == 16
    assert c["tool_version"].startswith("VCS AFOLU Non-Permanence Risk Tool")
    tiny = {**NPR, "internal": {k: 0 for k in NPR["internal"]}, "natural": [{**NPR["natural"][0], "score": 1}]}
    low = client.post(f"/api/projects/{pid}/risk-profiles", headers=h, json={"inputs": tiny}).json()
    assert low["computed"]["overall_score"] == 0.5 and low["computed_rating_pct"] == 10  # tool minimum
    mo = login(client, make_user(org, "methodology_owner"))
    draft = client.post(f"/api/risk-profiles/{p['id']}/approve", headers=mo, json={"final_npr_pct": 16})
    assert draft.status_code == 409
    client.post(f"/api/risk-profiles/{p['id']}/submit", headers=h)
    frozen = client.patch(f"/api/risk-profiles/{p['id']}", headers=h, json={"notes": "x"})
    assert frozen.json()["code"] == "PROFILE_FROZEN"
    assert client.post(f"/api/risk-profiles/{p['id']}/approve", headers=h,
                       json={"final_npr_pct": 16}).status_code == 403  # needs rule-approval permission
    admin = login(client, make_user(org, "platform_admin"))
    own = client.post(f"/api/projects/{pid}/risk-profiles", headers=admin, json={"inputs": NPR}).json()
    client.post(f"/api/risk-profiles/{own['id']}/submit", headers=admin)
    selfie = client.post(f"/api/risk-profiles/{own['id']}/approve", headers=admin, json={"final_npr_pct": 16})
    assert selfie.status_code == 403 and selfie.json()["code"] == "SELF_APPROVAL_REJECTED"
    below = client.post(f"/api/risk-profiles/{p['id']}/approve", headers=mo, json={"final_npr_pct": 8})
    assert below.status_code == 422 and below.json()["code"] == "NPR_BELOW_MINIMUM"
    differs = client.post(f"/api/risk-profiles/{p['id']}/approve", headers=mo, json={"final_npr_pct": 20})
    assert differs.status_code == 422 and differs.json()["code"] == "JUSTIFICATION_REQUIRED"
    ok = client.post(f"/api/risk-profiles/{p['id']}/approve", headers=mo,
                     json={"final_npr_pct": 20, "justification": "Tenure evidence incomplete for 3 fields."})
    assert ok.status_code == 200 and ok.json()["status"] == "approved" and ok.json()["final_npr_pct"] == 20
    second = client.post(f"/api/risk-profiles/{own['id']}/approve", headers=mo, json={"final_npr_pct": 16}).json()
    assert second["status"] == "approved" and second["version"] == 3
    versions = {x["version"]: x["status"] for x in client.get(f"/api/projects/{pid}/risk-profiles", headers=h).json()}
    assert versions == {1: "superseded", 2: "draft", 3: "approved"}
    summary = client.get(f"/api/projects/{pid}/risk/permanence", headers=h).json()
    assert summary["npr"]["approved_pct"] == 16 and summary["npr"]["version"] == 3

    risky = {**NPR, "internal": {**NPR["internal"], "project_management": 60}}
    bad = client.post(f"/api/projects/{pid}/risk-profiles", headers=h, json={"inputs": risky}).json()
    assert bad["computed"]["fails"] is True
    client.post(f"/api/risk-profiles/{bad['id']}/submit", headers=h)
    fails = client.post(f"/api/risk-profiles/{bad['id']}/approve", headers=mo,
                        json={"final_npr_pct": 50, "justification": "x" * 20})
    assert fails.status_code == 409 and fails.json()["code"] == "NPR_FAILS"
    rival = login(client, make_user(make_org("Rival"), "methodology_owner"))
    assert client.get(f"/api/risk-profiles/{p['id']}", headers=rival).status_code == 404


# ------------------------------------------------------------------ monitoring obligations
def test_monitoring_obligations_from_rule_pack(client, org, as_role):
    from app.modules.programmes.models import Project
    from app.modules.sampling.models import Campaign

    h = as_role("programme_admin")
    bare = fx.world(org)
    none = client.post(f"/api/projects/{bare['project_id']}/monitoring-obligations/generate", headers=h, json={}).json()
    assert none["created"] == [] and {s["code"] for s in none["skipped"]} == {"RULE_MISSING"}
    no_source = client.post(f"/api/projects/{bare['project_id']}/monitoring-obligations/generate", headers=h,
                            json={"soc_remeasurement_interval_years": 5})
    assert no_source.status_code == 422 and no_source.json()["code"] == "SOURCE_REQUIRED"
    given = client.post(f"/api/projects/{bare['project_id']}/monitoring-obligations/generate", headers=h,
                        json={"soc_remeasurement_interval_years": 5, "source": "VM0042 v2.2 §8"}).json()
    assert given["created"] == [] and {s["code"] for s in given["skipped"]} == {"RULE_MISSING", "ANCHOR_MISSING"}

    w = fx.world(org, rule_values={"soc_remeasurement_interval_years": 5, "baseline_reassessment_interval_years": 10,
                                   "data_retention_years_after_crediting": 2})
    with fx.session() as s:
        proj = s.get(Project, w["project_id"])
        proj.baseline_start, proj.crediting_end = date(2020, 1, 1), date(2040, 12, 31)
        s.add(Campaign(org_id=org, project_id=proj.id, code="BL-1", name="Baseline", kind="baseline", design="paired",
                       planned_start=date(2019, 1, 1), planned_end=date(2019, 3, 1), depth_to_cm=30, placement_seed=1))
        s.commit()
    gen = client.post(f"/api/projects/{w['project_id']}/monitoring-obligations/generate", headers=h, json={})
    assert gen.status_code == 200, gen.text
    by = {o["kind"]: o for o in gen.json()["created"]}
    assert by["soc_remeasurement"]["due_on"] == "2024-03-01" and by["soc_remeasurement"]["status"] == "overdue"
    assert by["baseline_reassessment"]["due_on"] == "2030-01-01"
    assert by["data_retention"]["due_on"] == "2042-12-31" and by["data_retention"]["status"] == "upcoming"
    assert by["data_retention"]["rule_ref"]["key"] == "data_retention_years_after_crediting"
    again = client.post(f"/api/projects/{w['project_id']}/monitoring-obligations/generate", headers=h, json={}).json()
    assert again["created"] == [] and again["updated"] == []
    soc = by["soc_remeasurement"]
    need = client.post(f"/api/monitoring-obligations/{soc['id']}/complete", headers=h, json={})
    assert need.status_code == 422 and need.json()["code"] == "EVIDENCE_REQUIRED"
    ev = fx.evidence_id(org, "lab report 2024")
    done = client.post(f"/api/monitoring-obligations/{soc['id']}/complete", headers=h,
                       json={"evidence_ids": [ev], "done_on": "2024-02-15"})
    assert done.json()["status"] == "done"
    nxt = client.post(f"/api/projects/{w['project_id']}/monitoring-obligations/generate", headers=h, json={}).json()
    assert [o["due_on"] for o in nxt["created"]] == ["2029-02-15"]  # counted from the last completed check
    assert client.post(f"/api/monitoring-obligations/{soc['id']}/cancel", headers=h, json={}).status_code == 409
    manual = client.post("/api/monitoring-obligations", headers=h, json={
        "project_id": str(w["project_id"]), "title": "Verifier site visit", "due_on": "2040-06-01"})
    assert manual.status_code == 201 and manual.json()["generated"] is False
    assert client.post(f"/api/monitoring-obligations/{manual.json()['id']}/cancel", headers=h,
                       json={}).json()["code"] == "NOTE_REQUIRED"
    listing = client.get(f"/api/projects/{w['project_id']}/monitoring-obligations?status=upcoming", headers=h).json()
    assert {o["kind"] for o in listing} >= {"data_retention", "other"}
    assert client.post(f"/api/projects/{w['project_id']}/monitoring-obligations/generate",
                       headers=as_role("mrv_analyst"), json={}).status_code == 403


# ------------------------------------------------------------------ remediation
def test_remediation_blocks_resolution_until_done(client, org, as_role):
    w = fx.world(org)
    h = as_role("programme_admin")
    r = _risk(client, h, w)
    a = client.post(f"/api/risk-events/{r['id']}/remediation-actions", headers=h,
                    json={"title": "Replant boundary trees", "due_on": "2020-01-01"})
    assert a.status_code == 201 and a.json()["overdue"] is True
    for s in ("assessing", "action"):
        client.post(f"/api/risk-events/{r['id']}/status", headers=h, json={"status": s})
    blocked = client.post(f"/api/risk-events/{r['id']}/status", headers=h,
                          json={"status": "resolved", "resolution": "Trees replanted"})
    assert blocked.status_code == 409 and blocked.json()["code"] == "REMEDIATION_OPEN"
    summary = client.get(f"/api/projects/{w['project_id']}/risk/permanence", headers=h).json()
    assert summary["remediation"] == {"open": 1, "overdue": 1} and summary["npr"]["approved_pct"] is None
    act = a.json()
    assert client.post(f"/api/remediation-actions/{act['id']}/status", headers=h,
                       json={"status": "cancelled"}).json()["code"] == "NOTE_REQUIRED"
    done = client.post(f"/api/remediation-actions/{act['id']}/status", headers=h, json={"status": "done"}).json()
    assert done["status"] == "done" and done["overdue"] is False
    assert client.post(f"/api/remediation-actions/{act['id']}/status", headers=h,
                       json={"status": "open"}).status_code == 409
    ok = client.post(f"/api/risk-events/{r['id']}/status", headers=h,
                     json={"status": "resolved", "resolution": "Trees replanted"})
    assert ok.status_code == 200
    assert client.post(f"/api/risk-events/{r['id']}/remediation-actions", headers=h,
                       json={"title": "Too late", "due_on": "2030-01-01"}).status_code == 409
    rival = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/risk-events/{r['id']}/remediation-actions", headers=rival).status_code == 404
