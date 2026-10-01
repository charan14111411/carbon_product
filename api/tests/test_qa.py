import uuid
from dataclasses import replace
from datetime import UTC, date, datetime, timedelta

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


# ------------------------------------------------------------------ VM0042 v2.2 rules (pass + fail each)
T0 = datetime(2024, 2, 10, 9, 0, tzinfo=UTC)


def _ref(f):
    return f.details.get("reference", "")


def test_shipped_late():
    ctx = sample_ctx(campaign_last_collected_at=T0, custody_times={"dispatched": T0 + timedelta(days=4)})
    assert check("SHIPPED_LATE", ctx) is None
    late = check("SHIPPED_LATE", replace(ctx, custody_times={"dispatched": T0 + timedelta(days=6)}))
    assert late.severity == "blocking" and "§8.2.1.3(5)" in _ref(late)
    assert check("SHIPPED_LATE", sample_ctx()) is None  # not dispatched yet
    assert check("SHIPPED_LATE", replace(ctx, rules={})).severity == "info"


def test_storage_too_long_and_frozen():
    times = {"lab_received": T0, "analysed": T0 + timedelta(days=60)}
    ctx = sample_ctx(custody_times=times, storage_conditions=["refrigerated"])
    assert check("STORAGE_TOO_LONG", ctx) is None
    long = replace(ctx, custody_times={"lab_received": T0, "analysed": T0 + timedelta(days=120)})
    assert check("STORAGE_TOO_LONG", long).severity == "warning"
    assert check("STORAGE_TOO_LONG", replace(long, storage_conditions=["dried"])) is None
    by_result = replace(ctx, custody_times={"lab_received": T0}, first_analysed_on=date(2024, 7, 1))
    assert check("STORAGE_TOO_LONG", by_result).severity == "warning"
    assert check("STORAGE_TOO_LONG", replace(long, rules={})).severity == "info"
    assert check("FROZEN_STORAGE", ctx) is None
    frozen = check("FROZEN_STORAGE", replace(ctx, storage_conditions=["frozen"]))
    assert frozen.severity == "warning" and "p.32" in _ref(frozen)


def test_resample_increments():
    mon = sample_ctx(campaign_kind="monitoring")
    assert check("RESAMPLE_INCREMENTS", mon) is None
    assert check("RESAMPLE_INCREMENTS", replace(mon, layers=[(0, 30)])).severity == "blocking"
    assert check("RESAMPLE_INCREMENTS", sample_ctx(layers=[(0, 30)])) is None  # baseline
    assert check("RESAMPLE_INCREMENTS", replace(mon, rules={})).severity == "info"


def test_reporting_depth_shallow():
    assert check("REPORTING_DEPTH_SHALLOW", sample_ctx()) is None
    shallow = sample_ctx(depth_reached_cm=20, layers=[(0, 20)])
    assert check("REPORTING_DEPTH_SHALLOW", shallow).severity == "blocking"
    documented = replace(shallow, depth_limit="bedrock", deviation_reason="Granite at 20 cm")
    assert check("REPORTING_DEPTH_SHALLOW", documented).severity == "info"
    assert check("REPORTING_DEPTH_SHALLOW", replace(shallow, depth_limit="stones",
                                                    deviation_reason="stones")).severity == "blocking"
    assert check("REPORTING_DEPTH_SHALLOW", replace(shallow, rules={})).severity == "info"


def test_duplicate_gps():
    assert check("DUPLICATE_GPS", sample_ctx()) is None
    assert check("DUPLICATE_GPS", sample_ctx(near_duplicates=["ST-A-002-BL"])).severity == "warning"


def test_monitoring_before_baseline_and_stale():
    mon = sample_ctx(campaign_kind="monitoring", collected_at=T0, baseline_collected_at=T0 - timedelta(days=3 * 365))
    assert check("MONITORING_BEFORE_BASELINE", mon) is None
    early = replace(mon, baseline_collected_at=T0 + timedelta(days=30))
    assert check("MONITORING_BEFORE_BASELINE", early).severity == "blocking"
    assert check("MONITORING_BEFORE_BASELINE", sample_ctx(collected_at=T0)) is None  # baseline sample
    assert check("STALE_REMEASUREMENT", mon) is None
    stale = replace(mon, baseline_collected_at=T0 - timedelta(days=6 * 365))
    assert check("STALE_REMEASUREMENT", stale).severity == "blocking"
    fallback = {k: v for k, v in RULES.items() if k != "remeasure_max_years"}
    assert check("STALE_REMEASUREMENT", replace(stale, rules=fallback)).details["rule_key"] == \
        "monitoring_interval_max_years"
    assert check("STALE_REMEASUREMENT", replace(stale, rules={})).severity == "info"


def test_unit_method_and_detection_rules():
    assert check("UNIT_MISMATCH", result_ctx(unit="%")) is None
    assert check("UNIT_MISMATCH", result_ctx(unit="g/kg", unit_ok=False, canonical_unit="%")).severity == "blocking"
    assert check("UNIT_MISMATCH", result_ctx(unit_ok=False, status="voided")) is None
    assert check("METHOD_NOT_RECOMMENDED", result_ctx()) is None
    wb = check("METHOD_NOT_RECOMMENDED", result_ctx(method="walkley_black", method_justification="No analyser"))
    assert wb.severity == "warning" and "§8.2.1.4" in _ref(wb) and wb.details["justification"] == "No analyser"
    assert check("BELOW_DETECTION_LIMIT", result_ctx()) is None
    bdl = check("BELOW_DETECTION_LIMIT", result_ctx(value=0.05, detection_limit=0.1, below_detection_limit=True))
    assert bdl.severity == "warning"


def test_missing_soil_mass_inputs():
    full = engine.LayerCtx(entity_id="l1", code="L1", accepted_analytes=set(), rules=dict(RULES),
                           has_fine_soil_mass=True, probe_diameter_mm=50, cores_composited=5)
    assert check("MISSING_SOIL_MASS_INPUTS", full) is None
    f = check("MISSING_SOIL_MASS_INPUTS", replace(full, has_fine_soil_mass=False, probe_diameter_mm=None))
    assert f.severity == "info" and f.details["missing"] == ["fine_soil_mass_g", "probe_diameter_mm"]


def _camp(**kw) -> engine.CampaignCtx:
    base = engine.CampaignCtx(entity_id="c1", code="M1", kind="monitoring", rules=dict(RULES), season_reference="BL",
                              season_gap_days=10, season_window_days=45)
    return replace(base, **kw)


def test_campaign_rules():
    assert check("SEASON_MISMATCH", _camp()) is None
    assert check("SEASON_MISMATCH", _camp(season_gap_days=90)).severity == "blocking"
    assert check("SEASON_MISMATCH", _camp(season_gap_days=90,
                                          season_override_reason="Monsoon delayed access")).severity == "warning"
    assert check("SEASON_MISMATCH", _camp(kind="baseline", season_gap_days=90)) is None
    assert check("LAB_CHANGE_UNJUSTIFIED", _camp()) is None
    assert check("LAB_CHANGE_UNJUSTIFIED", _camp(unjustified_labs=["LAB-2"],
                                                 reference_labs=["LAB-1"])).severity == "blocking"
    assert check("SPECTROSCOPY_CHECK_LOW", _camp()) is None  # no spectroscopy
    assert check("SPECTROSCOPY_CHECK_LOW", _camp(n_spectroscopy=20, n_spectroscopy_checked=2)) is None
    low = check("SPECTROSCOPY_CHECK_LOW", _camp(n_spectroscopy=20, n_spectroscopy_checked=1))
    assert low.severity == "blocking" and "Eq. 73" in _ref(low)
    assert check("SPECTROSCOPY_CHECK_LOW", _camp(n_spectroscopy=20, rules={})).severity == "info"


def test_lab_and_stratum_rules():
    lab = engine.LabCtx(entity_id="lab", code="LAB-1", iso17025=True, proficiency_program="NAPT",
                        has_error_report=True, rules={})
    assert check("LAB_QC_EVIDENCE_MISSING", lab) is None
    gaps = check("LAB_QC_EVIDENCE_MISSING", replace(lab, iso17025=None, proficiency_program="none"))
    assert gaps.severity == "info" and len(gaps.details["missing"]) == 2
    st = engine.StratumCtx(entity_id="st", code="A", criteria={"soil_type": "red"}, rules={})
    assert check("STRATIFICATION_FACTORS_MISSING", st) is None
    assert check("STRATIFICATION_FACTORS_MISSING", replace(st, criteria={})).severity == "warning"
    assert check("STRATIFICATION_FACTORS_MISSING", replace(st, criteria={"district": "X"})).severity == "warning"


def test_too_few_composites():
    ctx = engine.PlanCtx(entity_id="p1", stratum_code="A", campaign_code="BL", plan_status="approved", plan_n=3,
                         collected=3, rules=dict(RULES))
    assert check("TOO_FEW_COMPOSITES", ctx) is None
    assert check("TOO_FEW_COMPOSITES", replace(ctx, collected=2)).severity == "blocking"
    only_samples = {k: v for k, v in RULES.items() if k != "min_composites_per_stratum"}
    assert check("TOO_FEW_COMPOSITES", replace(ctx, collected=4, rules=only_samples)).details["required"] == 5
    assert check("TOO_FEW_COMPOSITES", replace(ctx, rules={})).severity == "info"


def test_vm0042_rules_registered_with_references():
    new = {"SHIPPED_LATE", "STORAGE_TOO_LONG", "FROZEN_STORAGE", "SEASON_MISMATCH", "RESAMPLE_INCREMENTS",
           "REPORTING_DEPTH_SHALLOW", "TOO_FEW_COMPOSITES", "DUPLICATE_GPS", "MONITORING_BEFORE_BASELINE",
           "UNIT_MISMATCH", "STALE_REMEASUREMENT", "MISSING_SOIL_MASS_INPUTS", "METHOD_NOT_RECOMMENDED",
           "LAB_CHANGE_UNJUSTIFIED", "SPECTROSCOPY_CHECK_LOW", "BELOW_DETECTION_LIMIT", "LAB_QC_EVIDENCE_MISSING",
           "STRATIFICATION_FACTORS_MISSING"}
    assert new <= set(engine.BY_CODE)


# ------------------------------------------------------------------ VM0042 v2.2 rules through the service
def _run(client, f):
    r = client.post(f"/api/projects/{f.pid}/qa/run", headers=f.planner)
    assert r.status_code == 200, r.text


def test_custody_timing_findings_via_api(client, org, as_role):
    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    s = f.submit(points[0]).json()["sample"]
    lab = as_role("lab_manager")
    url = f"/api/samples/{s['id']}/custody"
    t = datetime(2024, 2, 10, 9, 30, tzinfo=UTC)
    for ev, days, extra in (("dispatched", 8, {}),
                            ("lab_received", 9, {"seal_intact": True, "count_matches": True,
                                                 "storage": {"condition": "frozen"}})):
        r = client.post(url, headers=lab, json={"event": ev, "occurred_at": (t + timedelta(days=days)).isoformat(),
                                                **extra})
        assert r.status_code == 201, r.text
    _run(client, f)
    late = _findings(client, f, rule="SHIPPED_LATE")
    assert [(x["entity_id"], x["severity"]) for x in late] == [(s["id"], "blocking")]
    assert "VM0042 v2.2" in late[0]["details"]["reference"]
    assert _findings(client, f, rule="FROZEN_STORAGE")[0]["severity"] == "warning"


def test_layer_and_plan_findings_via_api(client, org):
    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    f.submit(points[0], probe_diameter_mm=None)
    _run(client, f)
    soil = _findings(client, f, rule="MISSING_SOIL_MASS_INPUTS")
    assert len(soil) == 2 and all(x["severity"] == "info" for x in soil)
    assert "probe_diameter_mm" in soil[0]["details"]["missing"]
    few = _findings(client, f, rule="TOO_FEW_COMPOSITES")
    assert few and few[0]["severity"] == "blocking" and few[0]["details"]["required"] == 3
    assert _findings(client, f, rule="STRATIFICATION_FACTORS_MISSING") == []


def test_season_mismatch_from_stored_data(client, org):
    from app.modules.sampling.models import Campaign

    f = Flow(client, org)
    bl, points = f.placed_campaign(n=5, planned_start="2021-02-01", planned_end="2021-03-01")
    m = f.campaign("MON-S", kind="monitoring", revisits_campaign_id=bl["id"], planned_start="2024-02-01",
                   planned_end="2024-03-01")
    _run(client, f)
    assert _findings(client, f, rule="SEASON_MISMATCH") == []
    with dbmod.session_factory()() as s:  # a later date change (imported data) moves it out of season
        s.get(Campaign, uuid.UUID(m["id"])).planned_start = date(2024, 7, 1)
        s.commit()
    _run(client, f)
    season = _findings(client, f, rule="SEASON_MISMATCH")
    assert [(x["entity_id"], x["severity"], x["status"]) for x in season] == [(m["id"], "blocking", "open")]


def test_duplicate_gps_and_monitoring_before_baseline_via_api(client, org):
    f = Flow(client, org)
    bl, points = f.placed_campaign(n=5, planned_start="2021-02-01", planned_end="2021-03-01")
    first = f.submit(points[0], collected_at="2021-02-10T09:00:00+00:00").json()["sample"]
    twin = f.submit(points[1], collected_at="2021-02-10T10:00:00+00:00", latitude=points[0]["latitude"],
                    longitude=points[0]["longitude"])
    assert twin.status_code == 201
    dup = {x["rule_code"] for x in twin.json()["findings"]}
    assert "DUPLICATE_GPS" in dup
    m = f.campaign("MON-B", kind="monitoring", revisits_campaign_id=bl["id"], planned_start="2024-02-01",
                   planned_end="2024-03-01")
    st = client.get(f"/api/projects/{f.pid}/strata", headers=f.planner).json()[0]
    f.plan(m["id"], st["id"], 5)
    client.post(f"/api/campaigns/{m['id']}/place-points", headers=f.planner)
    mp = client.get(f"/api/campaigns/{m['id']}/points", headers=f.planner).json()
    target = next(p for p in mp if p["site_id"] == first["site_id"])
    admin = login(client, make_user(org, "platform_admin"))
    early = client.post("/api/samples", headers=admin, json=f.sample_body(
        target, collected_at="2021-02-01T09:00:00+00:00"))
    assert early.status_code == 201, early.text
    codes = {x["rule_code"]: x["severity"] for x in early.json()["findings"]}
    assert codes.get("MONITORING_BEFORE_BASELINE") == "blocking"
