import uuid
from dataclasses import replace
from datetime import date

import pytest

from app.core import db as dbmod
from app.core import geo
from app.modules.programmes.models import Project
from app.modules.qa import engine
from app.modules.qa import service as qa_service
from tests._p1b_factories import Flow, full_values
from tests.conftest import login, make_org, make_user

RULES = full_values()
FIELD = geo.square(12.42, 75.74, 200)


def sample_ctx(**kw) -> engine.SampleCtx:
    base = engine.SampleCtx(
        entity_id="s1", code="ST-A-001-BL", latitude=12.42, longitude=75.74, gps_accuracy_m=3.0,
        distance_from_site_m=2.0, depth_reached_cm=30, photo_count=3, deviation_reason=None,
        field_boundary=FIELD, field_code="F1", campaign_depth_from_cm=0, campaign_depth_to_cm=30,
        layers=[(0, 15), (15, 30)], custody_events=["collected"], has_lab_results=False, rules=dict(RULES),
    )
    return replace(base, **kw)


def result_ctx(**kw) -> engine.ResultCtx:
    base = engine.ResultCtx(
        entity_id="r1", layer_code="ST-A-001-BL-D1", analyte="soc_pct", value=1.4, method="dry_combustion",
        status="accepted", analysed_on=date(2024, 3, 5), collected_on=date(2024, 2, 10), has_certificate=True,
        rules=dict(RULES),
    )
    return replace(base, **kw)


def layer_ctx(accepted=("soc_pct", "bulk_density_g_cm3", "coarse_fraction"), **kw) -> engine.LayerCtx:
    return engine.LayerCtx(entity_id="l1", code="ST-A-001-BL-D1", accepted_analytes=set(accepted),
                           rules=kw.pop("rules", dict(RULES)))


def check(code, ctx):
    return engine.BY_CODE[code].check(ctx)


# ------------------------------------------------------------------ pure rule tests (pass + fail each)
def test_sample_outside_field():
    assert check("SAMPLE_OUTSIDE_FIELD", sample_ctx()) is None
    f = check("SAMPLE_OUTSIDE_FIELD", sample_ctx(latitude=12.45))
    assert f.severity == "blocking" and "outside" in f.message


def test_gps_accuracy():
    assert check("GPS_ACCURACY_LOW", sample_ctx()) is None
    assert check("GPS_ACCURACY_LOW", sample_ctx(gps_accuracy_m=9)).severity == "warning"
    assert check("GPS_ACCURACY_LOW", sample_ctx(gps_accuracy_m=None)).severity == "warning"
    missing = {k: v for k, v in RULES.items() if k != "gps_accuracy_max_m"}
    nc = check("GPS_ACCURACY_LOW", sample_ctx(rules=missing))
    assert nc.severity == "info" and "rule not configured" in nc.message


def test_too_far_from_site():
    assert check("TOO_FAR_FROM_SITE", sample_ctx(distance_from_site_m=14.9)) is None
    assert check("TOO_FAR_FROM_SITE", sample_ctx(distance_from_site_m=40)).severity == "warning"
    assert check("TOO_FAR_FROM_SITE", sample_ctx(rules={})).severity == "info"


def test_missing_photos():
    assert check("MISSING_PHOTOS", sample_ctx()) is None
    assert check("MISSING_PHOTOS", sample_ctx(photo_count=1)).severity == "blocking"
    assert check("MISSING_PHOTOS", sample_ctx(rules={})).severity == "info"


def test_shallow_core():
    assert check("SHALLOW_CORE", sample_ctx()) is None
    shallow = dict(depth_reached_cm=20, layers=[(0, 20)])
    assert check("SHALLOW_CORE", sample_ctx(**shallow, deviation_reason="rock")).severity == "error"
    allowed = {**RULES, "shallow_soil_allowed": True}
    assert check("SHALLOW_CORE", sample_ctx(**shallow, deviation_reason="rock", rules=allowed)).severity == "info"
    assert check("SHALLOW_CORE", sample_ctx(**shallow, rules=allowed)).severity == "error"  # no reason
    assert check("SHALLOW_CORE", sample_ctx(**shallow, deviation_reason="rock", rules={})).severity == "error"


def test_depth_gap():
    assert check("DEPTH_GAP", sample_ctx()) is None
    assert check("DEPTH_GAP", sample_ctx(layers=[(0, 10), (15, 30)])).severity == "blocking"
    short = check("DEPTH_GAP", sample_ctx(layers=[(0, 15)]))
    assert short.severity == "blocking" and "stop at 15" in short.message


def test_custody_gap():
    assert check("CUSTODY_GAP", sample_ctx()) is None
    assert check("CUSTODY_GAP", sample_ctx(has_lab_results=True, custody_events=["collected", "lab_received"])) \
        is None
    assert check("CUSTODY_GAP", sample_ctx(has_lab_results=True)).severity == "warning"


def test_analysis_before_collection():
    assert check("ANALYSIS_BEFORE_COLLECTION", result_ctx()) is None
    assert check("ANALYSIS_BEFORE_COLLECTION", result_ctx(analysed_on=date(2024, 1, 1))).severity == "blocking"
    assert check("ANALYSIS_BEFORE_COLLECTION", result_ctx(analysed_on=date(2024, 1, 1), status="voided")) is None


def test_missing_certificate():
    assert check("MISSING_CERTIFICATE", result_ctx()) is None
    assert check("MISSING_CERTIFICATE", result_ctx(has_certificate=False)).severity == "warning"
    assert check("MISSING_CERTIFICATE", result_ctx(has_certificate=False, status="pending")) is None


def test_method_not_permitted():
    assert check("METHOD_NOT_PERMITTED", result_ctx()) is None
    assert check("METHOD_NOT_PERMITTED", result_ctx(method="walkley_black")).severity == "blocking"
    assert check("METHOD_NOT_PERMITTED", result_ctx(analyte="bulk_density_g_cm3", value=1.3,
                                                    method="clod")).severity == "blocking"
    assert check("METHOD_NOT_PERMITTED", result_ctx(analyte="ph", value=6, method="anything")) is None
    assert check("METHOD_NOT_PERMITTED", result_ctx(rules={})).severity == "info"


def test_implausible_value():
    assert check("IMPLAUSIBLE_VALUE", result_ctx()) is None
    assert check("IMPLAUSIBLE_VALUE", result_ctx(value=22)).severity == "warning"
    assert check("IMPLAUSIBLE_VALUE", result_ctx(analyte="bulk_density_g_cm3", value=0.4)).severity == "warning"
    assert check("IMPLAUSIBLE_VALUE", result_ctx(analyte="bulk_density_g_cm3", value=1.3)) is None


def test_missing_layer_analytes():
    assert check("MISSING_SOC", layer_ctx()) is None
    assert check("MISSING_SOC", layer_ctx(accepted=())).severity == "blocking"
    assert check("MISSING_BULK_DENSITY", layer_ctx()) is None
    assert check("MISSING_BULK_DENSITY", layer_ctx(accepted=("soc_pct",))).severity == "blocking"
    assert check("MISSING_COARSE_FRACTION", layer_ctx()) is None
    assert check("MISSING_COARSE_FRACTION", layer_ctx(accepted=("soc_pct",))).severity == "blocking"
    off = {**RULES, "coarse_fragment_correction": False}
    assert check("MISSING_COARSE_FRACTION", layer_ctx(accepted=(), rules=off)) is None
    assert check("MISSING_COARSE_FRACTION", layer_ctx(accepted=(), rules={})).severity == "info"


def test_too_few_samples():
    ctx = engine.PlanCtx(entity_id="p1", stratum_code="A", campaign_code="BL", plan_status="approved", plan_n=8,
                         collected=8, rules=dict(RULES))
    assert check("TOO_FEW_SAMPLES", ctx) is None
    assert check("TOO_FEW_SAMPLES", replace(ctx, collected=6)).severity == "blocking"  # below plan n
    assert check("TOO_FEW_SAMPLES", replace(ctx, plan_n=2, collected=4)).severity == "blocking"  # below floor
    assert check("TOO_FEW_SAMPLES", replace(ctx, rules={})).severity == "info"


def test_unpaired_site():
    ctx = engine.PairCtx(entity_id="pt", site_code="ST-A-001", campaign_code="M1", campaign_status="fieldwork",
                         point_status="collected", baseline_collected=True, rules=dict(RULES))
    assert check("UNPAIRED_SITE", ctx) is None
    assert check("UNPAIRED_SITE", replace(ctx, point_status="planned")) is None  # fieldwork still open
    assert check("UNPAIRED_SITE", replace(ctx, point_status="skipped")).severity == "warning"
    assert check("UNPAIRED_SITE", replace(ctx, point_status="planned", campaign_status="lab")).severity == "warning"
    assert check("UNPAIRED_SITE", replace(ctx, baseline_collected=False)).severity == "warning"
    block = {**RULES, "unpaired_points_policy": "block"}
    assert check("UNPAIRED_SITE", replace(ctx, point_status="skipped", rules=block)).severity == "blocking"


def test_registry_is_complete():
    codes = {r.code for r in engine.REGISTRY}
    assert {"SAMPLE_OUTSIDE_FIELD", "GPS_ACCURACY_LOW", "TOO_FAR_FROM_SITE", "MISSING_PHOTOS", "SHALLOW_CORE",
            "DEPTH_GAP", "CUSTODY_GAP", "ANALYSIS_BEFORE_COLLECTION", "MISSING_CERTIFICATE", "MISSING_SOC",
            "MISSING_BULK_DENSITY", "MISSING_COARSE_FRACTION", "METHOD_NOT_PERMITTED", "IMPLAUSIBLE_VALUE",
            "TOO_FEW_SAMPLES", "UNPAIRED_SITE"} <= codes
    assert all(r.severity in ("info", "warning", "error", "blocking") for r in engine.REGISTRY)


# ------------------------------------------------------------------ service / API
def _findings(client, f, **params):
    r = client.get(f"/api/projects/{f.pid}/qa/findings", headers=f.planner, params=params)
    assert r.status_code == 200, r.text
    return r.json()


def test_sync_reports_findings_for_bad_sample(client, org):
    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    p = points[0]
    r = f.submit(p, photo_ids=[], gps_accuracy_m=12, latitude=p["latitude"] + 0.0003)
    assert r.status_code == 201, r.text
    codes = {x["rule_code"]: x["severity"] for x in r.json()["findings"]}
    assert codes == {"MISSING_PHOTOS": "blocking", "GPS_ACCURACY_LOW": "warning", "TOO_FAR_FROM_SITE": "warning"}


def test_run_upserts_auto_resolves_and_blocks(client, org):
    f = Flow(client, org)
    camp, points = f.placed_campaign(n=5)
    sample = f.submit(points[0], photo_ids=[]).json()["sample"]
    analyst = login(client, make_user(org, "mrv_analyst"))
    run = client.post(f"/api/projects/{f.pid}/qa/run", headers=analyst)
    assert run.status_code == 200, run.text
    counts = run.json()["counts"]
    assert counts["blocking"] > 0
    open_rules = {x["rule_code"] for x in _findings(client, f, status="open")}
    assert {"MISSING_PHOTOS", "MISSING_SOC", "MISSING_BULK_DENSITY", "MISSING_COARSE_FRACTION",
            "TOO_FEW_SAMPLES"} <= open_rules
    before = len(_findings(client, f))
    client.post(f"/api/projects/{f.pid}/qa/run", headers=analyst)
    assert len(_findings(client, f)) == before  # re-running doesn't duplicate
    with dbmod.session_factory()() as s:
        project = s.get(Project, uuid.UUID(f.pid))
        blocking = qa_service.blocking_findings(s, project.id)
        assert blocking and all(b.severity == "blocking" for b in blocking)

    # fewer samples than planned -> collect the remaining four and TOO_FEW_SAMPLES auto-resolves
    for p in points[1:]:
        assert f.submit(p).status_code == 201
    client.post(f"/api/projects/{f.pid}/qa/run", headers=analyst)
    tfs = _findings(client, f, rule="TOO_FEW_SAMPLES")
    assert tfs[0]["status"] == "resolved"
    assert tfs[0]["resolution_note"] == "Resolved automatically: check now passes"

    # a blocking finding can't be resolved by hand, only acknowledged, and stays blocking
    photo = next(x for x in _findings(client, f, rule="MISSING_PHOTOS") if x["entity_id"] == sample["id"])
    res = client.post(f"/api/qa/findings/{photo['id']}/resolve", headers=analyst, json={"note": "Photos lost"})
    assert res.status_code == 409 and res.json()["code"] == "BLOCKING_FINDING"
    ack = client.post(f"/api/qa/findings/{photo['id']}/acknowledge", headers=analyst,
                      json={"note": "Photos lost; re-sampling planned"})
    assert ack.status_code == 200 and ack.json()["status"] == "acknowledged"
    assert ack.json()["blocks_calculation"] is True
    summary = client.get(f"/api/projects/{f.pid}/qa/summary", headers=f.planner).json()
    assert summary["can_calculate"] is False and summary["by_status"]["acknowledged"] == 1


def test_warning_resolution_is_sticky(client, org):
    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    f.submit(points[0], gps_accuracy_m=12)
    analyst = login(client, make_user(org, "mrv_analyst"))
    gps = _findings(client, f, rule="GPS_ACCURACY_LOW")[0]
    short = client.post(f"/api/qa/findings/{gps['id']}/resolve", headers=analyst, json={"note": "ok"})
    assert short.status_code == 422
    ok = client.post(f"/api/qa/findings/{gps['id']}/resolve", headers=analyst,
                     json={"note": "Canopy cover; point checked on satellite image"})
    assert ok.status_code == 200 and ok.json()["status"] == "resolved" and ok.json()["resolved_by"] == "Mrv Analyst"
    client.post(f"/api/projects/{f.pid}/qa/run", headers=analyst)
    assert [x["status"] for x in _findings(client, f, rule="GPS_ACCURACY_LOW")] == ["resolved"]
    assert client.post(f"/api/qa/findings/{gps['id']}/resolve", headers=f.collector,
                       json={"note": "I say it's fine"}).status_code == 403


def test_rule_not_configured_reports_info(client, org):
    f = Flow(client, org, rules=full_values(), with_pack=False)
    _, points = f.placed_campaign(n=2)
    r = f.submit(points[0])
    findings = r.json()["findings"]
    assert {x["rule_code"] for x in findings if x["severity"] == "info"} >= {
        "GPS_ACCURACY_LOW", "TOO_FAR_FROM_SITE", "MISSING_PHOTOS"}
    assert all("rule not configured" in x["message"] for x in findings if x["severity"] == "info")


def test_lab_result_findings_and_resolution(client, org):
    from tests.test_lab import LabFlow

    f = LabFlow(client, org)
    r = f.result(value=18.0).json()  # implausibly high SOC
    analyst = login(client, make_user(org, "mrv_analyst"))
    client.post(f"/api/projects/{f.pid}/qa/run", headers=analyst)
    implausible = _findings(client, f, rule="IMPLAUSIBLE_VALUE", status="open")
    assert [x["entity_id"] for x in implausible] == [r["id"]]
    gap = _findings(client, f, rule="CUSTODY_GAP", status="open")
    assert [x["entity_id"] for x in gap] == [f.sample["id"]]
    client.put(f"/api/lab-results/{r['id']}", headers=f.manager, json={"value": 1.8})
    client.post(f"/api/projects/{f.pid}/qa/run", headers=analyst)
    assert _findings(client, f, rule="IMPLAUSIBLE_VALUE")[0]["status"] == "resolved"


def test_qa_permissions_and_isolation(client, org, as_role):
    f = Flow(client, org)
    assert client.post(f"/api/projects/{f.pid}/qa/run", headers=as_role("field_collector")).status_code == 403
    assert client.post(f"/api/projects/{f.pid}/qa/run", headers=f.planner).status_code == 200
    rival = login(client, make_user(make_org("Rival"), "platform_admin"))
    assert client.post(f"/api/projects/{f.pid}/qa/run", headers=rival).status_code == 404
    assert client.get(f"/api/projects/{f.pid}/qa/findings", headers=rival).status_code == 404
    _, points = f.placed_campaign(n=5)
    f.submit(points[0], photo_ids=[])
    fid = _findings(client, f)[0]["id"]
    assert client.post(f"/api/qa/findings/{fid}/acknowledge", headers=rival,
                       json={"note": "not mine at all"}).status_code == 404


def test_run_project_checks_public_api_without_user(client, org):
    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    f.submit(points[0])
    with dbmod.session_factory()() as s:
        project = s.get(Project, uuid.UUID(f.pid))
        out = qa_service.run_project_checks(s, None, project)
        s.commit()
    assert out["blocking"] >= 1 and set(out["counts"]) == {"info", "warning", "error", "blocking"}


@pytest.mark.parametrize("severity", ["blocking", "warning"])
def test_findings_filter_by_severity(client, org, severity):
    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    f.submit(points[0], photo_ids=[], gps_accuracy_m=50)
    rows = _findings(client, f, severity=severity)
    assert rows and all(x["severity"] == severity for x in rows)


def test_depth_gap_found_when_layers_stop_short(client, org):
    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    r = f.submit(points[0], layers=[{"depth_from_cm": 0, "depth_to_cm": 15, "label_qr": f"QR-{uuid.uuid4().hex[:6]}"}])
    assert r.status_code == 201, r.text
    gap = [x for x in r.json()["findings"] if x["rule_code"] == "DEPTH_GAP"]
    assert gap and gap[0]["severity"] == "blocking"


def test_unpaired_site_in_paired_monitoring(client, org):
    f = Flow(client, org)
    bl, points = f.placed_campaign(n=5, planned_start="2021-02-01", planned_end="2021-03-01")
    for p in points:
        assert f.submit(p, collected_at="2021-02-10T09:00:00+00:00").status_code == 201
    m = f.campaign("MON-1", kind="monitoring", revisits_campaign_id=bl["id"], planned_start="2024-02-01",
                   planned_end="2024-03-01")
    st = client.get(f"/api/projects/{f.pid}/strata", headers=f.planner).json()[0]
    f.plan(m["id"], st["id"], 5)
    client.post(f"/api/campaigns/{m['id']}/place-points", headers=f.planner)
    mp = client.get(f"/api/campaigns/{m['id']}/points", headers=f.planner).json()
    client.post(f"/api/points/{mp[2]['id']}/skip", headers=f.planner, json={"reason": "Farmer refused access"})
    client.post(f"/api/projects/{f.pid}/qa/run", headers=f.planner)
    rows = _findings(client, f, rule="UNPAIRED_SITE")
    assert [(x["entity_id"], x["severity"]) for x in rows] == [(mp[2]["id"], "warning")]
