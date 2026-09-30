"""Calculation API: terms, Gate 1, runs, four-eyes approval, claims, provenance, readiness."""

from __future__ import annotations

import uuid

import pytest

from app.core import db as dbmod
from app.modules.calculation.models import CalculationRun, Claim
from app.modules.methodology.models import Rule
from app.modules.partners.models import DomainEvent
from app.modules.qa.models import QAFinding
from tests._p2_factories import build_project, run_body
from tests.conftest import login, make_org, make_user


@pytest.fixture()
def built(client, org):
    return build_project(org)


@pytest.fixture()
def analyst(as_role):
    return as_role("mrv_analyst")


@pytest.fixture()
def manager(as_role):
    return as_role("programme_admin")


def _run(client, h, b, **kw):
    return client.post(f"/api/projects/{b.project_id}/calculations", headers=h, json=run_body(b, **kw))


def _approved_run(client, analyst, manager, b, **kw):
    r = _run(client, analyst, b, **kw)
    assert r.status_code == 201, r.text
    rid = r.json()["id"]
    assert client.post(f"/api/calculations/{rid}/submit", headers=analyst).status_code == 200
    a = client.post(f"/api/calculations/{rid}/approve", headers=manager, json={"note": "Checked"})
    assert a.status_code == 200, a.text
    return rid


# ------------------------------------------------------------------ terms
def test_terms_versioning_and_four_eyes(client, built, as_role):
    analyst, owner = as_role("mrv_analyst"), as_role("methodology_owner")
    body = {"period_label": "P2", "term": "leakage", "value_t_co2e": 1.5, "variance": 0.1,
            "source": "Leakage tool v4 applied to displaced grazing"}
    t1 = client.post(f"/api/projects/{built.project_id}/terms", headers=analyst, json=body)
    assert t1.status_code == 201 and t1.json()["version"] == 1 and t1.json()["status"] == "draft"
    ok = client.post(f"/api/terms/{t1.json()['id']}/approve", headers=owner)
    assert ok.status_code == 200 and ok.json()["status"] == "approved"
    t2 = client.post(f"/api/projects/{built.project_id}/terms", headers=analyst, json={**body, "value_t_co2e": 2.0})
    assert t2.json()["version"] == 2
    # previous stays approved until the new one is approved
    rows = client.get(f"/api/projects/{built.project_id}/terms?period_label=P2", headers=analyst).json()
    assert [r["status"] for r in rows] == ["approved", "draft"]
    client.post(f"/api/terms/{t2.json()['id']}/approve", headers=owner)
    rows = client.get(f"/api/projects/{built.project_id}/terms?period_label=P2", headers=analyst).json()
    assert [r["status"] for r in rows] == ["superseded", "approved"]
    # four-eyes: a methodology owner can't approve their own estimate
    own = client.post(f"/api/projects/{built.project_id}/terms", headers=as_role("platform_admin"), json=body)
    self_ok = client.post(f"/api/terms/{own.json()['id']}/approve", headers=as_role("platform_admin"))
    assert self_ok.status_code == 403 and self_ok.json()["code"] == "SELF_APPROVAL_REJECTED"


def test_term_validation(client, built, analyst):
    base = {"period_label": "P1", "term": "leakage", "value_t_co2e": 1, "variance": 0, "source": "A valid source"}
    assert client.post(f"/api/projects/{built.project_id}/terms", headers=analyst,
                       json={**base, "term": "magic"}).status_code == 422
    assert client.post(f"/api/projects/{built.project_id}/terms", headers=analyst,
                       json={**base, "variance": -1}).status_code == 422
    assert client.post(f"/api/projects/{built.project_id}/terms", headers=analyst,
                       json={**base, "source": "abc"}).status_code == 422


# ------------------------------------------------------------------ runs
def test_run_is_calculated_from_database_and_is_deterministic(client, built, analyst):
    r = _run(client, analyst, built)
    assert r.status_code == 201, r.text
    run = r.json()
    assert run["status"] == "calculated"
    assert run["net_t_co2e"] > 0 and run["uncertainty_deduction_t_co2e"] > 0 and run["buffer_t_co2e"] > 0
    assert run["reductions_t_co2e"] + run["removals_t_co2e"] == pytest.approx(run["net_t_co2e"])
    res = run["results"]
    assert res["strata"][0]["n_used"] == 5 and res["stock_method"] == "fixed_depth"
    # 1.2 g/cm3 x 30 cm x 100 x (1 - 0.05) = 3420 t/ha fine soil
    first = res["strata"][0]["baseline_points"][0]
    assert first["fine_mass_t_ha"] == pytest.approx(3420.0)
    terms = {t["term"]: t for t in res["terms"]}
    assert terms["baseline_emissions"]["source"] == "not_required_by_rules"
    assert terms["leakage"]["value_t_co2e"] == 0.2
    again = _run(client, analyst, built).json()
    assert again["snapshot_sha256"] == run["snapshot_sha256"] and again["id"] != run["id"]
    listing = client.get(f"/api/projects/{built.project_id}/calculations", headers=analyst).json()
    assert len(listing) == 2 and all(x["status"] == "calculated" for x in listing)
    detail = client.get(f"/api/calculations/{run['id']}", headers=analyst).json()
    assert detail["status_history"][0]["status"] == "calculated" and detail["status_history"][0]["by"]


def test_provenance_tree(client, built, analyst):
    rid = _run(client, analyst, built).json()["id"]
    p = client.get(f"/api/calculations/{rid}/provenance", headers=analyst).json()
    assert any(r["key"] == "stock_method" and r["source"] for r in p["rules"])
    assert {t["term"] for t in p["terms"]} == {"baseline_scenario", "project_emissions", "leakage"}
    site = p["strata"][0]["sites"][0]
    assert len(site["samples"]) == 2
    smp = site["samples"][0]
    assert smp["gps"]["latitude"] and smp["photos"][0]["sha256"]
    lr = smp["layers"][0]["lab_results"]
    assert {x["analyte"] for x in lr} == {"soc_pct", "bulk_density_g_cm3", "coarse_fraction"}
    assert all(x["certificate"]["sha256"] for x in lr)
    assert [c["event"] for c in smp["custody"]] == ["collected", "dispatched", "lab_received"]


def test_gate_requires_approved_rules(client, org, analyst):
    b = build_project(org, pack_status="draft")
    r = _run(client, analyst, b)
    assert r.status_code == 409 and r.json()["code"] == "RULE_MISSING"


def test_missing_rule_fails_closed(client, built, analyst):
    with dbmod.session_factory()() as s:
        s.query(Rule).filter_by(pack_id=uuid.UUID(built.pack_id), key="uncertainty_confidence").delete()
        s.commit()
    r = _run(client, analyst, built)
    assert r.status_code == 409 and r.json()["details"]["rule_key"] == "uncertainty_confidence"


def test_required_term_without_approval_is_refused(client, org, analyst):
    b = build_project(org, approve_terms=False)
    r = _run(client, analyst, b)
    assert r.status_code == 409 and r.json()["code"] == "RULE_MISSING"
    assert r.json()["details"]["rule_key"] in ("baseline_scenario", "project_emissions", "leakage")


def test_campaign_and_period_checks(client, built, analyst):
    swapped = run_body(built)
    swapped["baseline_campaign_id"], swapped["monitoring_campaign_id"] = built.monitoring_id, built.baseline_id
    r = client.post(f"/api/projects/{built.project_id}/calculations", headers=analyst, json=swapped)
    assert r.status_code == 422 and r.json()["code"] == "CAMPAIGN_MISMATCH"
    r = _run(client, analyst, built, start="2024-12-31", end="2021-01-01")
    assert r.status_code == 422 and r.json()["code"] == "INVALID_PERIOD"


def test_missing_lab_result_blocks(client, org, analyst, monkeypatch):
    b = build_project(org, skip_result_for_site=1)
    r = _run(client, analyst, b)  # the QA checks catch it first
    assert r.status_code == 409 and r.json()["code"] == "QA_BLOCKING"
    assert any(f["rule_code"] == "MISSING_SOC" for f in r.json()["details"]["findings"])
    # Even without the QA module the calculation refuses to run on incomplete data.
    import app.modules.qa.service as qa_service

    monkeypatch.setattr(qa_service, "run_project_checks", lambda *a, **k: None)
    r = _run(client, analyst, b)
    assert r.status_code == 409 and r.json()["code"] == "MISSING_LAB_RESULT"
    assert r.json()["details"]["layers"][0]["analytes"] == ["soc_pct"]


def test_open_blocking_qa_refuses_run(client, built, analyst):
    with dbmod.session_factory()() as s:
        s.add(QAFinding(org_id=built.org_id, project_id=uuid.UUID(built.project_id), entity_type="sample",
                        entity_id="x", rule_code="GPS_TOO_FAR", severity="blocking", message="Too far"))
        s.commit()
    r = _run(client, analyst, built)
    assert r.status_code == 409 and r.json()["code"] == "QA_BLOCKING"
    assert r.json()["details"]["findings"][0]["rule_code"] == "GPS_TOO_FAR"


def test_negative_result_is_reported_not_floored(client, org, analyst):
    b = build_project(org, base_soc=(1.3, 1.25, 1.4, 1.35, 1.3), mon_soc=(1.1, 1.1, 1.2, 1.15, 1.12))
    run = _run(client, analyst, b).json()
    assert run["net_t_co2e"] < 0 and run["flags"]["carbon_lost"] is True
    assert run["uncertainty_deduction_t_co2e"] == 0 and run["buffer_t_co2e"] == 0
    with dbmod.session_factory()() as s:
        f = s.query(QAFinding).filter_by(entity_id=run["id"], rule_code="NET_RESULT_NOT_POSITIVE").one()
        assert f.severity == "info"


# ------------------------------------------------------------------ workflow
def test_workflow_approval_claims_and_events(client, built, analyst, manager):
    rid = _run(client, analyst, built).json()["id"]
    early = client.post(f"/api/calculations/{rid}/approve", headers=manager)
    assert early.status_code == 409 and early.json()["code"] == "ILLEGAL_STATE_TRANSITION"
    assert client.post(f"/api/calculations/{rid}/submit", headers=analyst).json()["status"] == "under_review"
    assert client.post(f"/api/calculations/{rid}/approve", headers=analyst).status_code == 403
    ok = client.post(f"/api/calculations/{rid}/approve", headers=manager)
    assert ok.status_code == 200 and ok.json()["status"] == "approved"
    with dbmod.session_factory()() as s:
        claims = s.query(Claim).filter_by(run_id=uuid.UUID(rid)).all()
        assert sorted(str(c.field_id) for c in claims) == sorted(built.field_ids)
        assert all(c.pool == "soc" for c in claims)
        assert s.query(DomainEvent).filter_by(event="result.approved", entity_id=rid).count() == 1
    hist = client.get(f"/api/calculations/{rid}", headers=analyst).json()["status_history"]
    assert [h["status"] for h in hist] == ["calculated", "under_review", "approved"]


def test_self_approval_is_refused(client, built, as_role):
    admin = as_role("platform_admin")
    rid = _run(client, admin, built).json()["id"]
    client.post(f"/api/calculations/{rid}/submit", headers=admin)
    r = client.post(f"/api/calculations/{rid}/approve", headers=admin)
    assert r.status_code == 403 and r.json()["code"] == "SELF_APPROVAL_REJECTED"


def test_second_approval_same_period_refused_then_superseded(client, built, analyst, manager):
    first = _approved_run(client, analyst, manager, built)
    second = _run(client, analyst, built).json()["id"]
    client.post(f"/api/calculations/{second}/submit", headers=analyst)
    r = client.post(f"/api/calculations/{second}/approve", headers=manager)
    assert r.status_code == 409 and r.json()["code"] == "PERIOD_ALREADY_APPROVED"

    third = _approved_run(client, analyst, manager, built, supersedes_run_id=first)
    assert client.get(f"/api/calculations/{first}", headers=analyst).json()["status"] == "superseded"
    assert client.get(f"/api/calculations/{third}", headers=analyst).json()["status"] == "approved"
    from app.modules.calculation.service import active_claims

    with dbmod.session_factory()() as s:
        active = active_claims(s, built.org_id, [uuid.UUID(f) for f in built.field_ids])
        assert {str(c.run_id) for c in active} == {third}
        assert s.query(DomainEvent).filter_by(event="result.superseded", entity_id=first).count() == 1


def test_overlapping_claim_from_other_period_is_refused(client, built, analyst, manager):
    _approved_run(client, analyst, manager, built)
    other = _run(client, analyst, built, period_label="P1b", start="2024-06-01", end="2025-06-01")
    # terms for P1b are not approved yet → fails closed
    assert other.status_code == 409 and other.json()["code"] == "RULE_MISSING"
    owner = login(client, make_user(built.org_id, "methodology_owner"))
    for term in ("baseline_scenario", "project_emissions", "leakage"):
        t = client.post(f"/api/projects/{built.project_id}/terms", headers=analyst, json={
            "period_label": "P1b", "term": term, "value_t_co2e": 0.1, "variance": 0, "source": "Project records"})
        client.post(f"/api/terms/{t.json()['id']}/approve", headers=owner)
    rid = _run(client, analyst, built, period_label="P1b", start="2024-06-01", end="2025-06-01").json()["id"]
    client.post(f"/api/calculations/{rid}/submit", headers=analyst)
    r = client.post(f"/api/calculations/{rid}/approve", headers=manager)
    assert r.status_code == 409 and r.json()["code"] == "CLAIM_OVERLAP"


def test_reject_needs_note(client, built, analyst, manager):
    rid = _run(client, analyst, built).json()["id"]
    client.post(f"/api/calculations/{rid}/submit", headers=analyst)
    assert client.post(f"/api/calculations/{rid}/reject", headers=manager, json={"note": ""}).status_code == 422
    r = client.post(f"/api/calculations/{rid}/reject", headers=manager, json={"note": "Bulk density looks off"})
    assert r.status_code == 200 and r.json()["status"] == "rejected"
    assert client.post(f"/api/calculations/{rid}/submit", headers=analyst).status_code == 409


def test_approval_blocked_by_new_blocking_finding(client, built, analyst, manager):
    rid = _run(client, analyst, built).json()["id"]
    client.post(f"/api/calculations/{rid}/submit", headers=analyst)
    with dbmod.session_factory()() as s:
        s.add(QAFinding(org_id=built.org_id, project_id=uuid.UUID(built.project_id), entity_type="lab_result",
                        entity_id="y", rule_code="LAB_OUTLIER", severity="blocking", message="Outlier"))
        s.commit()
    r = client.post(f"/api/calculations/{rid}/approve", headers=manager)
    assert r.status_code == 409 and r.json()["code"] == "QA_BLOCKING"


def test_run_records_are_append_only(client, built, analyst):
    rid = _run(client, analyst, built).json()["id"]
    from app.core.errors import ImmutableRecord

    with dbmod.session_factory()() as s:
        run = s.get(CalculationRun, uuid.UUID(rid))
        run.net_t_co2e = 1e9
        with pytest.raises(ImmutableRecord):
            s.flush()


def test_cross_org_is_not_found(client, built, analyst):
    rid = _run(client, analyst, built).json()["id"]
    other = login(client, make_user(make_org("Rival Org"), "mrv_analyst"))
    assert client.get(f"/api/calculations/{rid}", headers=other).status_code == 404
    assert client.get(f"/api/calculations/{rid}/provenance", headers=other).status_code == 404
    assert _run(client, other, built).status_code == 404
    assert client.get(f"/api/projects/{built.project_id}/readiness", headers=other).status_code == 404
    assert client.post(f"/api/calculations/{rid}/submit", headers=other).status_code == 404


def test_readiness(client, built, analyst, manager):
    r = client.get(f"/api/projects/{built.project_id}/readiness", headers=analyst).json()
    dims = {d["key"]: d for d in r["dimensions"]}
    assert len(dims) == 13
    for key in ("rules_approved", "fields_enrolled", "strata_defined", "sample_plans_approved",
                "baseline_samples_collected", "lab_results_accepted", "certificates_attached", "custody_complete",
                "open_blocking_qa", "monitoring_campaign", "terms_approved"):
        assert dims[key]["status"] == "ok", (key, dims[key])
    assert dims["calculation_approved"]["status"] == "blocking"
    before = r["score_pct"]
    _approved_run(client, analyst, manager, built)
    after = client.get(f"/api/projects/{built.project_id}/readiness", headers=analyst).json()
    assert after["score_pct"] > before
