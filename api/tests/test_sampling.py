import uuid
from datetime import UTC, date, datetime, timedelta

import pytest

from app.core import db as dbmod
from app.core import geo
from app.core.errors import IllegalTransition, ImmutableRecord, ValidationFailed
from app.modules.sampling import domain
from app.modules.sampling.domain import CustodyStep
from app.modules.sampling.models import Sample
from tests._p1b_factories import Flow, full_values, make_pack, make_project, set_project_pack
from tests.conftest import login, make_org, make_user


# ------------------------------------------------------------------ pure domain
def test_sample_size_formula():
    n, z = domain.sample_size(1.2, 0.3, 10, 0.90)
    assert round(z, 4) == 1.6449
    assert n == 17  # (1.6449*0.3/0.12)^2 = 16.9 -> 17
    assert domain.sample_size(1.2, 0.3, 10, 0.95)[0] == 25
    with pytest.raises(ValidationFailed):
        domain.sample_size(0, 0.3, 10)


def test_layer_problems():
    assert domain.layer_problems([(0, 15), (15, 30)], 0) == []
    assert domain.layer_problems([(15, 30), (0, 15)], 0) == []  # order doesn't matter
    assert "gap" in domain.layer_problems([(0, 10), (15, 30)], 0)[0]
    assert "overlap" in domain.layer_problems([(0, 20), (15, 30)], 0)[0]
    assert "start" in domain.layer_problems([(5, 30)], 0)[0]
    assert domain.layer_problems([(0, 10.0000000001), (10, 30)], 0) == []  # tolerance


def _chain(*events):
    t = datetime(2024, 1, 1, tzinfo=UTC)
    return [CustodyStep(str(i), e, t + timedelta(hours=i)) for i, e in enumerate(events)]


def test_custody_policy():
    later = datetime(2024, 1, 2, tzinfo=UTC)
    with pytest.raises(IllegalTransition):
        domain.check_custody([], event="packed", occurred_at=later)
    domain.check_custody([], event="collected", occurred_at=later)
    chain = _chain("collected", "packed")
    domain.check_custody(chain, event="courier_received", occurred_at=later)  # skipping forward is fine
    with pytest.raises(IllegalTransition):
        domain.check_custody(chain, event="packed", occurred_at=later)  # repeat
    with pytest.raises(IllegalTransition):
        domain.check_custody(_chain("collected", "dispatched"), event="packed", occurred_at=later)  # backwards
    with pytest.raises(ValidationFailed):
        domain.check_custody(chain, event="dispatched", occurred_at=datetime(2023, 1, 1, tzinfo=UTC))  # time
    with pytest.raises(ValidationFailed):
        domain.check_custody(chain, event="lab_received", occurred_at=later)  # seal/count required
    domain.check_custody(chain, event="lab_received", occurred_at=later, seal_intact=True, count_matches=True)
    with pytest.raises(IllegalTransition):
        domain.check_custody(chain, event="analysed", occurred_at=later)  # never received
    with pytest.raises(ValidationFailed):
        domain.check_custody(chain, event="correction", occurred_at=later, corrects_event_id="1", notes="x")
    with pytest.raises(ValidationFailed):
        domain.check_custody(chain, event="correction", occurred_at=later, corrects_event_id="99",
                             notes="wrong time entered")
    domain.check_custody(chain, event="correction", occurred_at=later, corrects_event_id="1",
                         notes="wrong time entered")
    assert domain.custody_status(_chain("collected", "packed", "correction")) == "packed"


def test_interval_years_is_calendar_aware():
    assert domain.interval_years(date(2021, 2, 1), date(2024, 2, 1)) == 3.0
    assert domain.interval_years(date(2020, 2, 29), date(2023, 2, 28)) == 3.0
    assert 2.99 < domain.interval_years(date(2021, 2, 2), date(2024, 2, 1)) < 3.0


def test_campaign_transitions():
    domain.check_campaign_transition("planned", "fieldwork")
    with pytest.raises(IllegalTransition):
        domain.check_campaign_transition("planned", "lab")
    with pytest.raises(IllegalTransition):
        domain.check_campaign_transition("complete", "planned")


# ------------------------------------------------------------------ strata
def test_stratum_requires_enrolled_fields_and_sums_area(client, org):
    f = Flow(client, org)
    st = f.stratum()
    assert st["area_ha"] == pytest.approx(8.0, rel=0.01) and st["version"] == 1
    other = make_project(org, enrol=False)
    r = client.post(f"/api/projects/{f.pid}/strata", headers=f.planner, json={
        "code": "B", "name": "Zone B", "field_ids": other["field_ids"], "effective_from": "2024-01-01", "criteria": {"soil_type": "red"}})
    assert r.status_code == 422 and r.json()["code"] == "FIELD_NOT_ENROLLED"


def test_stratum_versioning_and_single_membership(client, org):
    f = Flow(client, org, n_fields=3)
    a1 = f.stratum("A", f.p["field_ids"][:2])
    clash = client.post(f"/api/projects/{f.pid}/strata", headers=f.planner, json={
        "code": "B", "name": "Zone B", "field_ids": f.p["field_ids"][1:], "effective_from": "2024-01-01", "criteria": {"soil_type": "red"}})
    assert clash.status_code == 409 and clash.json()["code"] == "FIELD_IN_OTHER_STRATUM"
    too_early = client.post(f"/api/projects/{f.pid}/strata", headers=f.planner, json={
        "code": "A", "name": "Zone A", "field_ids": f.p["field_ids"], "effective_from": "2024-01-01", "criteria": {"soil_type": "red"}})
    assert too_early.status_code == 422 and too_early.json()["code"] == "STRATUM_DATE"
    a2 = f.stratum("A", f.p["field_ids"], effective_from="2025-01-01")
    assert a2["version"] == 2
    current = client.get(f"/api/projects/{f.pid}/strata", headers=f.planner).json()
    assert [s["id"] for s in current] == [a2["id"]]
    history = client.get(f"/api/projects/{f.pid}/strata", headers=f.planner, params={"all": "true"}).json()
    old = next(s for s in history if s["id"] == a1["id"])
    assert old["effective_to"] == "2024-12-31" and old["is_current"] is False


def test_control_stratum_must_name_existing_zone(client, org):
    f = Flow(client, org, n_fields=2)
    f.stratum("A", f.p["field_ids"][:1])
    bad = client.post(f"/api/projects/{f.pid}/strata", headers=f.planner, json={
        "code": "C", "name": "Control", "role": "control", "control_for_code": "Z",
        "field_ids": f.p["field_ids"][1:], "effective_from": "2024-01-01", "criteria": {"soil_type": "red"}})
    assert bad.status_code == 422 and bad.json()["code"] == "CONTROL_TARGET_MISSING"
    ok = f.stratum("C", f.p["field_ids"][1:], role="control", control_for_code="A")
    assert ok["role"] == "control"


# ------------------------------------------------------------------ campaigns
def test_campaign_seed_and_revisit_rules(client, org):
    f = Flow(client, org)
    body = {"code": "BL-AUTO", "name": "Baseline", "kind": "baseline", "design": "paired",
            "planned_start": "2024-02-01", "planned_end": "2024-03-01", "depth_to_cm": 30}
    r = client.post(f"/api/projects/{f.pid}/campaigns", headers=f.planner, json=body)
    assert r.status_code == 201 and isinstance(r.json()["placement_seed"], int)
    assert client.post(f"/api/projects/{f.pid}/campaigns", headers=f.planner, json=body).status_code == 409
    no_revisit = client.post(f"/api/projects/{f.pid}/campaigns", headers=f.planner, json={
        **body, "code": "M1", "kind": "monitoring", "planned_start": "2027-02-01", "planned_end": "2027-03-01"})
    assert no_revisit.status_code == 422 and no_revisit.json()["code"] == "REVISIT_REQUIRED"


def test_monitoring_interval_checked_against_rule_pack(client, org):
    f = Flow(client, org)
    bl = f.campaign("BL-1")
    base = {"name": "Monitoring 1", "kind": "monitoring", "design": "paired", "revisits_campaign_id": bl["id"],
            "depth_to_cm": 30}
    early = client.post(f"/api/projects/{f.pid}/campaigns", headers=f.planner, json={
        **base, "code": "M-EARLY", "planned_start": "2025-02-01", "planned_end": "2025-03-01"})
    assert early.status_code == 422 and early.json()["code"] == "MONITORING_INTERVAL"
    late = client.post(f"/api/projects/{f.pid}/campaigns", headers=f.planner, json={
        **base, "code": "M-LATE", "planned_start": "2031-02-01", "planned_end": "2031-03-01"})
    assert late.status_code == 422
    ok = client.post(f"/api/projects/{f.pid}/campaigns", headers=f.planner, json={
        **base, "code": "M-OK", "planned_start": "2027-02-01", "planned_end": "2027-03-01"})
    assert ok.status_code == 201, ok.text
    shallow = client.post(f"/api/projects/{f.pid}/campaigns", headers=f.planner, json={
        **base, "code": "M-SH", "planned_start": "2027-02-01", "planned_end": "2027-03-01", "depth_to_cm": 20})
    assert shallow.status_code == 422 and shallow.json()["code"] == "DEPTH_BELOW_RULE"


def test_campaign_status_transitions(client, org):
    f = Flow(client, org)
    camp, _ = f.placed_campaign(n=5)
    bad = client.post(f"/api/campaigns/{camp['id']}/status", headers=f.planner, json={"status": "lab"})
    assert bad.status_code == 409 and bad.json()["code"] == "ILLEGAL_STATE_TRANSITION"
    for s in ("fieldwork", "lab", "complete"):
        r = client.post(f"/api/campaigns/{camp['id']}/status", headers=f.planner, json={"status": s})
        assert r.status_code == 200 and r.json()["status"] == s


def test_fieldwork_needs_points(client, org):
    f = Flow(client, org)
    camp = f.campaign()
    r = client.post(f"/api/campaigns/{camp['id']}/status", headers=f.planner, json={"status": "fieldwork"})
    assert r.status_code == 409 and r.json()["code"] == "NO_POINTS"


# ------------------------------------------------------------------ sample plans
def test_variance_plan_with_floor_and_four_eyes(client, org):
    f = Flow(client, org)
    st = f.stratum()
    camp = f.campaign()
    r = client.post(f"/api/campaigns/{camp['id']}/sample-plans", headers=f.planner, json={
        "stratum_id": st["id"], "method": "variance_formula", "justification": "Pilot data 2023",
        "inputs": {"prior_mean": 1.2, "prior_sd": 0.05, "target_error_pct": 10}})
    assert r.status_code == 201, r.text
    plan = r.json()
    assert plan["inputs"]["n_formula"] == 1 and plan["n_required"] == 5  # raised to min_samples_per_stratum
    assert plan["inputs"]["floor_applied"] == 5 and plan["floor_checked"] is True
    selfish = client.post(f"/api/sample-plans/{plan['id']}/approve", headers=f.planner)
    assert selfish.status_code == 403  # programme_admin lacks APPROVE_SAMPLING
    owner = login(client, make_user(org, "platform_admin"))
    upd = client.put(f"/api/sample-plans/{plan['id']}", headers=owner, json={"justification": "Updated pilot"})
    assert upd.status_code == 200
    assert client.post(f"/api/sample-plans/{plan['id']}/approve", headers=owner).json()["code"] == \
        "SELF_APPROVAL_REJECTED"
    ok = client.post(f"/api/sample-plans/{plan['id']}/approve", headers=f.approver)
    assert ok.status_code == 200 and ok.json()["status"] == "approved"
    frozen = client.put(f"/api/sample-plans/{plan['id']}", headers=f.planner, json={"n_required": 9})
    assert frozen.status_code == 409 and frozen.json()["code"] == "PLAN_APPROVED"


def test_manual_plan_below_floor_rejected(client, org):
    f = Flow(client, org)
    st = f.stratum()
    camp = f.campaign()
    r = client.post(f"/api/campaigns/{camp['id']}/sample-plans", headers=f.planner, json={
        "stratum_id": st["id"], "n_required": 3, "method": "manual", "justification": "Budget"})
    assert r.status_code == 422 and r.json()["code"] == "BELOW_MINIMUM_SAMPLES"


def test_plan_without_approved_pack_warns(client, org):
    f = Flow(client, org)
    set_project_pack(f.pid, make_pack(org, status="draft"))
    st = f.stratum()
    camp = f.campaign()
    r = client.post(f"/api/campaigns/{camp['id']}/sample-plans", headers=f.planner, json={
        "stratum_id": st["id"], "n_required": 2, "method": "manual", "justification": "Pilot only"})
    assert r.status_code == 201
    assert r.json()["floor_checked"] is False and r.json()["warnings"][0]["code"] == "RULE_PACK_NOT_APPROVED"


# ------------------------------------------------------------------ placement
def test_place_points_requires_approved_plans(client, org):
    f = Flow(client, org)
    st = f.stratum()
    camp = f.campaign()
    f.plan(camp["id"], st["id"], 5, approve=False)
    r = client.post(f"/api/campaigns/{camp['id']}/place-points", headers=f.planner)
    assert r.status_code == 409 and r.json()["code"] == "PLAN_MISSING"
    assert r.json()["details"]["strata"] == ["A"]


def test_place_points_reproducible_and_idempotent(client, org):
    f = Flow(client, org)
    camp, points = f.placed_campaign(n=6)
    assert len(points) == 6
    assert [p["site_code"] for p in points] == [f"ST-A-{i:03d}" for i in range(1, 7)]
    fields = {fid: None for fid in f.p["field_ids"]}
    with dbmod.session_factory()() as s:
        from app.modules.land.models import Field
        for fid in fields:
            fields[fid] = s.get(Field, uuid.UUID(fid)).boundary
    expected = geo.random_points(list(fields.values()), 6, 12345 + domain.stratum_seed_offset("A"))
    assert [(p["latitude"], p["longitude"]) for p in points] == expected
    for p in points:
        assert geo.contains(fields[p["field_id"]], p["latitude"], p["longitude"])
    again = client.post(f"/api/campaigns/{camp['id']}/place-points", headers=f.planner)
    assert again.status_code == 409 and again.json()["code"] == "POINTS_EXIST"
    # same seed & same geometry in another organisation -> identical coordinates
    f2 = Flow(client, make_org("Twin"))
    _, points2 = f2.placed_campaign(n=6)
    assert [(p["latitude"], p["longitude"]) for p in points2] == expected
    gj = client.get(f"/api/campaigns/{camp['id']}/points.geojson", headers=f.planner).json()
    assert gj["type"] == "FeatureCollection" and len(gj["features"]) == 6
    assert gj["features"][0]["properties"]["site_code"] == "ST-A-001"


def test_paired_monitoring_reuses_sites_and_codes_samples_m1(client, org):
    f = Flow(client, org)
    bl, points = f.placed_campaign(n=5, planned_start="2021-02-01", planned_end="2021-03-01")
    first = f.submit(points[0], collected_at="2021-02-10T09:00:00+00:00")
    assert first.json()["sample"]["code"] == "ST-A-001-BL"
    m = f.campaign("MON-1", kind="monitoring", revisits_campaign_id=bl["id"], planned_start="2024-02-01",
                   planned_end="2024-03-01")
    st = client.get(f"/api/projects/{f.pid}/strata", headers=f.planner).json()[0]
    f.plan(m["id"], st["id"], 5)
    r = client.post(f"/api/campaigns/{m['id']}/place-points", headers=f.planner)
    assert r.status_code == 201 and r.json()["points_created"] == 5
    mp = client.get(f"/api/campaigns/{m['id']}/points", headers=f.planner).json()
    assert {p["site_id"] for p in mp} == {p["site_id"] for p in points}
    body = f.sample_body(mp[0], collected_at="2024-02-10T09:00:00+00:00")
    s = client.post("/api/samples", headers=login(client, make_user(org, "platform_admin")), json=body)
    assert s.status_code == 201, s.text
    assert s.json()["sample"]["code"] == "ST-A-001-M1"


# ------------------------------------------------------------------ assignment & bundle
def test_assignment_and_bundle(client, org):
    f = Flow(client, org)
    camp, points = f.placed_campaign(n=5)
    analyst = make_user(org, "mrv_analyst")
    from tests._p1b_factories import user_id
    bad = client.post(f"/api/campaigns/{camp['id']}/assign", headers=f.planner,
                      json={"user_id": str(user_id(analyst)), "point_ids": [points[0]["id"]]})
    assert bad.status_code == 422 and bad.json()["code"] == "NOT_A_COLLECTOR"
    mine = client.get("/api/me/assignments", headers=f.collector).json()
    assert len(mine) == 1 and len(mine[0]["points"]) == 5 and mine[0]["remaining"] == 5
    assert mine[0]["points"][0]["assigned_to_name"] == "Field Collector"
    b = client.get(f"/api/campaigns/{camp['id']}/bundle", headers=f.collector).json()
    assert b["rules"]["gps_accuracy_max_m"] == 5 and b["rules"]["required_photos"] == 3
    assert b["depth"] == {"from_cm": 0.0, "to_cm": 30.0}
    assert len(b["points"]) == 5 and len(b["fields"]["features"]) == 2
    other = login(client, make_user(org, "field_collector"))
    assert client.get(f"/api/campaigns/{camp['id']}/bundle", headers=other).json()["points"] == []


def test_bundle_without_pack_has_null_thresholds(client, org):
    f = Flow(client, org, with_pack=False)
    camp = f.campaign()
    b = client.get(f"/api/campaigns/{camp['id']}/bundle", headers=f.planner).json()
    assert b["rules"]["approved"] is False and b["rules"]["gps_accuracy_max_m"] is None


# ------------------------------------------------------------------ samples
def test_submit_sample_creates_layers_custody_and_findings(client, org):
    f = Flow(client, org)
    camp, points = f.placed_campaign(n=5)
    r = f.submit(points[0])
    assert r.status_code == 201, r.text
    body = r.json()
    s = body["sample"]
    assert s["code"] == "ST-A-001-BL" and body["replayed"] is False
    assert [lay["code"] for lay in s["layers"]] == ["ST-A-001-BL-D1", "ST-A-001-BL-D2"]
    assert [e["event"] for e in s["custody"]] == ["collected"]
    assert s["distance_from_site_m"] == pytest.approx(0, abs=0.01)
    assert s["context"]["weather"] == {"status": "not_available", "reason": "supporting data not synced"}
    assert s["context"]["collector"]["name"] == "Field Collector"
    assert body["findings"] == []  # everything within the rules
    pts = client.get(f"/api/campaigns/{camp['id']}/points", headers=f.planner).json()
    assert pts[0]["status"] == "collected"
    prog = client.get(f"/api/campaigns/{camp['id']}", headers=f.planner).json()["progress"]
    assert prog["points_collected"] == 1 and prog["points_planned"] == 4 and prog["layers_total"] == 2


def test_sample_sync_is_idempotent(client, org):
    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    body = f.sample_body(points[0])
    first = client.post("/api/samples", headers=f.collector, json=body)
    again = client.post("/api/samples", headers=f.collector, json=body)
    assert first.status_code == 201 and again.status_code == 200
    assert again.json()["replayed"] is True and again.json()["sample"]["id"] == first.json()["sample"]["id"]
    with dbmod.session_factory()() as s:
        assert s.query(Sample).count() == 1
    other_point = client.post("/api/samples", headers=f.collector, json={**body, "point_id": points[1]["id"]})
    assert other_point.status_code == 409 and other_point.json()["code"] == "IDEMPOTENCY_KEY_REUSED"


def test_sample_validation_failures(client, org):
    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    p = points[0]
    gap = f.submit(p, layers=[{"depth_from_cm": 0, "depth_to_cm": 10, "label_qr": "QR-g1"},
                              {"depth_from_cm": 15, "depth_to_cm": 30, "label_qr": "QR-g2"}])
    assert gap.status_code == 422 and gap.json()["code"] == "LAYER_DEPTHS"
    shallow = f.submit(p, depth_reached_cm=20,
                       layers=[{"depth_from_cm": 0, "depth_to_cm": 20, "label_qr": "QR-s1"}])
    assert shallow.status_code == 422 and shallow.json()["code"] == "SHALLOW_CORE"
    dup = f.submit(p, layers=[{"depth_from_cm": 0, "depth_to_cm": 15, "label_qr": "QR-d"},
                              {"depth_from_cm": 15, "depth_to_cm": 30, "label_qr": "QR-d"}])
    assert dup.status_code == 422 and dup.json()["code"] == "DUPLICATE_LABEL"
    doc = client.post("/api/evidence", headers=f.collector,
                      files={"file": ("x.pdf", b"%PDF-1.4 x", "application/pdf")}, data={"kind": "document"})
    not_photo = f.submit(p, photo_ids=[doc.json()["id"]])
    assert not_photo.status_code == 422 and not_photo.json()["code"] == "NOT_A_PHOTO"
    stranger = login(client, make_user(org, "field_collector"))
    assert f.submit(p, headers=stranger).json()["code"] == "NOT_ASSIGNED"
    future = f.submit(p, collected_at=(datetime.now(UTC) + timedelta(days=3)).isoformat())
    assert future.status_code == 422
    ok = f.submit(p)
    assert ok.status_code == 201
    used_label = ok.json()["sample"]["layers"][0]["label_qr"]
    again = f.submit(points[1], layers=[{"depth_from_cm": 0, "depth_to_cm": 30, "label_qr": used_label}])
    assert again.status_code == 409 and again.json()["code"] == "DUPLICATE_LABEL"
    collected_again = f.submit(p)
    assert collected_again.status_code == 409 and collected_again.json()["code"] == "POINT_NOT_PLANNED"


def test_shallow_core_with_reason_is_recorded_with_finding(client, org):
    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    r = f.submit(points[0], depth_reached_cm=20, deviation_reason="Hit laterite rock", depth_limit="bedrock",
                 layers=[{"depth_from_cm": 0, "depth_to_cm": 20, "label_qr": f"QR-{uuid.uuid4().hex[:6]}"}])
    assert r.status_code == 201, r.text
    codes = {x["rule_code"]: x["severity"] for x in r.json()["findings"]}
    # shallow_soil_allowed is False in the pack; bedrock is documented so the reporting depth is only noted
    assert codes == {"SHALLOW_CORE": "error", "REPORTING_DEPTH_SHALLOW": "info"}


def test_context_snapshot_includes_supporting_data(client, org):
    from app.modules.supporting.models import Observation

    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    with dbmod.session_factory()() as s:
        s.add(Observation(org_id=org, field_id=uuid.UUID(points[0]["field_id"]), parameter="rain_mm",
                          observed_on=date(2024, 2, 10), value=4.2, unit="mm", tier=3, provider="nasa_power",
                          quality=0.8, data_class="MODELLED"))
        s.commit()
    ctx = f.submit(points[0]).json()["sample"]["context"]
    assert ctx["weather"]["status"] == "available" and ctx["weather"]["values"][0]["value"] == 4.2
    assert ctx["sensor"]["status"] == "not_available"


def test_skip_point(client, org):
    f = Flow(client, org)
    camp, points = f.placed_campaign(n=5)
    r = client.post(f"/api/points/{points[1]['id']}/skip", headers=f.collector, json={"reason": "Flooded field"})
    assert r.status_code == 200 and r.json()["status"] == "skipped"
    assert client.post(f"/api/points/{points[1]['id']}/skip", headers=f.collector,
                       json={"reason": "Flooded field"}).status_code == 409
    assert f.submit(points[1]).status_code == 409


def test_samples_are_append_only(client, org):
    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    f.submit(points[0])
    with dbmod.session_factory()() as s:
        sample = s.query(Sample).one()
        sample.depth_reached_cm = 10
        with pytest.raises(ImmutableRecord):
            s.flush()


# ------------------------------------------------------------------ custody & reads
def test_custody_chain_via_api_and_trace(client, org, as_role):
    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    s = f.submit(points[0]).json()["sample"]
    lab = as_role("lab_manager")
    url = f"/api/samples/{s['id']}/custody"
    t0 = datetime(2024, 2, 11, tzinfo=UTC)
    assert client.post(url, headers=f.collector, json={
        "event": "packed", "occurred_at": t0.isoformat(), "location": "Village"}).status_code == 201
    no_seal = client.post(url, headers=lab, json={"event": "lab_received",
                                                  "occurred_at": (t0 + timedelta(days=2)).isoformat()})
    assert no_seal.status_code == 422 and no_seal.json()["code"] == "CUSTODY_RECEIPT_CHECKS"
    early = client.post(url, headers=lab, json={"event": "analysed",
                                                "occurred_at": (t0 + timedelta(days=2)).isoformat()})
    assert early.status_code == 409 and early.json()["code"] == "CUSTODY_NOT_RECEIVED"
    ok = client.post(url, headers=lab, json={"event": "lab_received", "seal_intact": True, "count_matches": True,
                                             "occurred_at": (t0 + timedelta(days=2)).isoformat()})
    assert ok.status_code == 201 and ok.json()["status"] == "lab_received"
    back = client.post(url, headers=f.collector, json={"event": "dispatched",
                                                       "occurred_at": (t0 + timedelta(days=3)).isoformat()})
    assert back.status_code == 409 and back.json()["code"] == "CUSTODY_ORDER"
    packed_id = ok.json()["events"][1]["id"]
    corr = client.post(url, headers=lab, json={"event": "correction", "corrects_event_id": packed_id,
                                               "notes": "Packed a day later than recorded",
                                               "occurred_at": (t0 + timedelta(days=3)).isoformat()})
    assert corr.status_code == 201
    assert client.post(url, headers=as_role("verifier"), json={
        "event": "opened", "occurred_at": (t0 + timedelta(days=4)).isoformat()}).status_code == 403
    listed = client.get("/api/samples", headers=f.planner, params={"status": "lab_received"}).json()
    assert [x["code"] for x in listed] == [s["code"]]
    bag = s["layers"][1]["label_qr"]
    tr = client.get(f"/api/samples/by-code/{bag}/trace", headers=lab)
    assert tr.status_code == 200 and tr.json()["matched"] == "bag"
    assert tr.json()["site"]["code"] == "ST-A-001" and len(tr.json()["sample"]["custody"]) == 4
    assert client.get("/api/samples/by-code/NOPE/trace", headers=lab).status_code == 404


def test_tenant_isolation(client, org):
    f = Flow(client, org)
    camp, points = f.placed_campaign(n=5)
    s = f.submit(points[0]).json()["sample"]
    rival_org = make_org("Rival")
    rival = login(client, make_user(rival_org, "platform_admin"))
    assert client.get(f"/api/campaigns/{camp['id']}", headers=rival).status_code == 404
    assert client.get(f"/api/campaigns/{camp['id']}/points", headers=rival).status_code == 404
    assert client.get(f"/api/samples/{s['id']}", headers=rival).status_code == 404
    assert client.get("/api/samples", headers=rival).json() == []
    assert client.get(f"/api/projects/{f.pid}/strata", headers=rival).status_code == 404
    assert client.post(f"/api/samples/{s['id']}/custody", headers=rival, json={
        "event": "packed", "occurred_at": "2024-03-01T00:00:00+00:00"}).status_code == 404
    rival_body = f.sample_body(points[1])
    assert client.post("/api/samples", headers=rival, json=rival_body).status_code == 404
    assert client.get(f"/api/samples/by-code/{s['code']}/trace", headers=rival).status_code == 404


def test_permissions(client, org, as_role):
    f = Flow(client, org)
    assert client.post(f"/api/projects/{f.pid}/strata", headers=f.collector, json={
        "code": "A", "name": "Zone A", "field_ids": f.p["field_ids"], "effective_from": "2024-01-01"}
    ).status_code == 403
    camp = f.campaign()
    assert client.post(f"/api/campaigns/{camp['id']}/place-points", headers=f.collector).status_code == 403
    assert client.post("/api/samples", headers=as_role("verifier"), json={}).status_code in (403, 422)
    assert client.get("/api/me/assignments", headers=as_role("verifier")).status_code == 403


def test_full_values_helper_matches_pack_min():
    assert full_values()["min_samples_per_stratum"] == 5


# ------------------------------------------------------------------ VM0042 v2.2 conformance
def test_power_analysis_domain():
    n = domain.n_for_mdd(0.3, 0.2, 0.05, 0.90)
    assert n["n"] == 26 and n["df"] == 25  # (0.3 x (2.0595 + 1.3163) / 0.2)^2 = 25.6 -> 26
    back = domain.mdd_for_n(0.3, 26, 0.05, 0.90)
    assert back["mdd"] == pytest.approx(0.1986, abs=1e-4) and back["mdd"] <= 0.2
    smaller = domain.n_for_mdd(0.3, 0.2, 0.05, 0.80)
    assert smaller["n"] < n["n"]
    with pytest.raises(ValidationFailed):
        domain.n_for_mdd(0.3, 0.2, 1.5, 0.9)


def test_mdd_endpoint(client, org):
    f = Flow(client, org)
    r = client.post("/api/sample-plans/mdd", headers=f.planner, json={"s": 0.3, "mdd": 0.2, "alpha": 0.05,
                                                                        "power": 0.9})
    assert r.status_code == 200, r.text
    assert r.json()["n"] == 26 and r.json()["solved_for"] == "n" and "Eq. 1-2" in r.json()["reference"]
    inv = client.post("/api/sample-plans/mdd", headers=f.planner, json={"s": 0.3, "n": 26, "alpha": 0.05,
                                                                          "power": 0.9})
    assert inv.status_code == 200 and inv.json()["mdd"] == pytest.approx(0.1986, abs=1e-4)
    both = client.post("/api/sample-plans/mdd", headers=f.planner, json={"s": 0.3, "n": 26, "mdd": 0.2,
                                                                           "alpha": 0.05, "power": 0.9})
    assert both.status_code == 422 and both.json()["code"] == "INVALID_PLAN_INPUTS"
    no_alpha = client.post("/api/sample-plans/mdd", headers=f.planner, json={"s": 0.3, "mdd": 0.2, "power": 0.9})
    assert no_alpha.status_code == 422  # alpha must be chosen explicitly


def test_stratum_needs_known_stratification_factors_and_qu(client, org):
    f = Flow(client, org, n_fields=3)
    base = {"name": "Zone", "effective_from": "2024-01-01"}
    none = client.post(f"/api/projects/{f.pid}/strata", headers=f.planner,
                       json={**base, "code": "A", "field_ids": f.p["field_ids"][:1]})
    assert none.status_code == 422 and none.json()["code"] == "STRATIFICATION_FACTORS_REQUIRED"
    assert "soil_texture" in none.json()["details"]["allowed"]
    bad = client.post(f"/api/projects/{f.pid}/strata", headers=f.planner, json={
        **base, "code": "A", "field_ids": f.p["field_ids"][:1], "criteria": {"district": "Hassan"}})
    assert bad.status_code == 422 and "district" in bad.json()["message"]
    a = f.stratum("A", f.p["field_ids"][:1], criteria={"soil_texture": "clay loam", "slope_class": "0-3"})
    assert a["quantification_unit"] == "A" and a["stratification_factors"] == ["slope_class", "soil_texture"]
    b = f.stratum("B", f.p["field_ids"][1:], quantification_unit="QU-1")
    assert b["quantification_unit"] == "QU-1"


def test_sample_probe_and_composite_validation(client, org):
    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    p = points[0]
    assert f.submit(p, probe_diameter_mm=0).status_code == 422
    assert f.submit(p, probe_diameter_mm=250).status_code == 422
    assert f.submit(p, cores_composited=0).status_code == 422
    mixed = f.submit(p, cores_composited=3, core_depths_reached_cm=[30, 30, 22])
    assert mixed.status_code == 422 and mixed.json()["code"] == "COMPOSITE_DEPTHS"
    count = f.submit(p, cores_composited=3, core_depths_reached_cm=[30, 30])
    assert count.status_code == 422 and count.json()["code"] == "COMPOSITE_DEPTHS"
    ok = f.submit(p, cores_composited=3, core_depths_reached_cm=[30, 31, 30], probe_diameter_mm=48,
                  latitude=p["latitude"] + 0.00002)
    assert ok.status_code == 201, ok.text
    s = ok.json()["sample"]
    assert s["probe_diameter_mm"] == 48 and s["cores_composited"] == 3
    assert s["intended_latitude"] == p["latitude"] and s["actual_latitude"] == p["latitude"] + 0.00002
    assert s["context"]["core_depths_reached_cm"] == [30, 31, 30]


def test_reporting_depth_needs_bedrock_or_hardpan(client, org):
    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    layers = [{"depth_from_cm": 0, "depth_to_cm": 20, "label_qr": f"QR-{uuid.uuid4().hex[:6]}"}]
    stones = f.submit(points[0], depth_reached_cm=20, deviation_reason="Stony layer", depth_limit="stones",
                      layers=layers)
    assert stones.status_code == 422 and stones.json()["code"] == "REPORTING_DEPTH_SHALLOW"
    assert "§8.2.1.3(7b)" in stones.json()["details"]["reference"]
    hardpan = f.submit(points[0], depth_reached_cm=20, deviation_reason="Plough pan", depth_limit="hardpan",
                       layers=layers)
    assert hardpan.status_code == 201 and hardpan.json()["sample"]["depth_limit"] == "hardpan"


def test_campaign_reporting_depth_rule(client, org):
    f = Flow(client, org)
    r = client.post(f"/api/projects/{f.pid}/campaigns", headers=f.planner, json={
        "code": "BL-20", "name": "Baseline", "kind": "baseline", "design": "paired", "planned_start": "2024-02-01",
        "planned_end": "2024-03-01", "depth_to_cm": 20})
    assert r.status_code == 422 and r.json()["code"] == "DEPTH_BELOW_RULE"
    assert f.campaign("BL-30", depth_to_cm=30)["depth_to_cm"] == 30


def _paired(f, client, **kw):
    bl, points = f.placed_campaign(n=5, planned_start="2021-02-01", planned_end="2021-03-01")
    body = {"code": "MON-1", "name": "Monitoring 1", "kind": "monitoring", "design": "paired",
            "revisits_campaign_id": bl["id"], "planned_start": "2024-02-01", "planned_end": "2024-03-01",
            "depth_to_cm": 50, **kw}
    return bl, points, client.post(f"/api/projects/{f.pid}/campaigns", headers=f.planner, json=body)


def test_season_mismatch_needs_override(client, org):
    f = Flow(client, org)
    bl, _, off = _paired(f, client, planned_start="2024-06-15", planned_end="2024-07-15")
    assert off.status_code == 422 and off.json()["code"] == "SEASON_MISMATCH"
    assert off.json()["details"]["gap_days"] > 45 and off.json()["details"]["window_days"] == 45
    ok = client.post(f"/api/projects/{f.pid}/campaigns", headers=f.planner, json={
        "code": "MON-2", "name": "Monitoring", "kind": "monitoring", "design": "paired",
        "revisits_campaign_id": bl["id"],
        "planned_start": "2024-06-15", "planned_end": "2024-07-15", "depth_to_cm": 50, "season": "kharif",
        "season_override_reason": "Monsoon flooding prevented access in February"})
    assert ok.status_code == 201, ok.text
    assert ok.json()["season_override_reason"].startswith("Monsoon") and ok.json()["season"] == "kharif"
    near_new_year = domain.day_of_year_gap(date(2023, 12, 20), date(2024, 1, 15))
    assert near_new_year == 26


def test_resampling_needs_two_increments(client, org):
    f = Flow(client, org)
    bl, points, m = _paired(f, client)
    assert m.status_code == 201, m.text
    m = m.json()
    st = client.get(f"/api/projects/{f.pid}/strata", headers=f.planner).json()[0]
    f.plan(m["id"], st["id"], 5)
    client.post(f"/api/campaigns/{m['id']}/place-points", headers=f.planner)
    mp = client.get(f"/api/campaigns/{m['id']}/points", headers=f.planner).json()
    admin = login(client, make_user(org, "platform_admin"))
    tag = uuid.uuid4().hex[:6]
    one = f.sample_body(mp[0], collected_at="2024-02-10T09:00:00+00:00", depth_reached_cm=50,
                        layers=[{"depth_from_cm": 0, "depth_to_cm": 50, "label_qr": f"QR-{tag}-1"}])
    r = client.post("/api/samples", headers=admin, json=one)
    assert r.status_code == 422 and r.json()["code"] == "RESAMPLE_INCREMENTS"
    two = f.sample_body(mp[0], collected_at="2024-02-10T09:00:00+00:00", depth_reached_cm=50,
                        layers=[{"depth_from_cm": 0, "depth_to_cm": 30, "label_qr": f"QR-{tag}-2"},
                                {"depth_from_cm": 30, "depth_to_cm": 50, "label_qr": f"QR-{tag}-3"}])
    assert client.post("/api/samples", headers=admin, json=two).status_code == 201


def test_plan_approval_enforces_min_composites(client, org):
    f = Flow(client, org, rules=full_values(min_samples_per_stratum=2, min_composites_per_stratum=4))
    st = f.stratum()
    camp = f.campaign()
    r = client.post(f"/api/campaigns/{camp['id']}/sample-plans", headers=f.planner, json={
        "stratum_id": st["id"], "n_required": 3, "method": "manual", "justification": "Budget"})
    assert r.status_code == 422 and r.json()["details"]["min_samples_per_stratum"] == 4
    pack = f.pack_id
    set_project_pack(f.pid, make_pack(org, status="draft"))
    draft = client.post(f"/api/campaigns/{camp['id']}/sample-plans", headers=f.planner, json={
        "stratum_id": st["id"], "n_required": 3, "method": "manual", "justification": "Pilot only"}).json()
    set_project_pack(f.pid, pack)
    blocked = client.post(f"/api/sample-plans/{draft['id']}/approve", headers=f.approver)
    assert blocked.status_code == 409 and blocked.json()["code"] == "BELOW_MINIMUM_SAMPLES"
    assert blocked.json()["details"]["min_composites_per_stratum"] == 4


def test_custody_prepared_step_and_storage(client, org, as_role):
    chain = _chain("collected", "lab_received", "opened")
    later = datetime(2024, 1, 2, tzinfo=UTC)
    domain.check_custody(chain, event="prepared", occurred_at=later)
    with pytest.raises(IllegalTransition):
        domain.check_custody(_chain("collected", "lab_received", "analysed"), event="prepared", occurred_at=later)
    with pytest.raises(IllegalTransition):
        domain.check_custody(_chain("collected", "packed"), event="prepared", occurred_at=later)
    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    s = f.submit(points[0]).json()["sample"]
    lab = as_role("lab_manager")
    url = f"/api/samples/{s['id']}/custody"
    t0 = datetime(2024, 2, 11, tzinfo=UTC)
    rec = client.post(url, headers=lab, json={"event": "lab_received", "seal_intact": True, "count_matches": True,
                                              "occurred_at": t0.isoformat(), "storage": {"condition": "refrigerated"}})
    assert rec.status_code == 201 and rec.json()["events"][-1]["storage"] == {"condition": "refrigerated"}
    bad = client.post(url, headers=lab, json={"event": "prepared", "occurred_at": (t0 + timedelta(days=1)).isoformat(),
                                              "storage": {"condition": "wet"}})
    assert bad.status_code == 422
    prep = client.post(url, headers=lab, json={"event": "prepared", "occurred_at": (t0 + timedelta(days=1)).isoformat(),
                                               "notes": "Air-dried, 2 mm sieved", "storage": {"condition": "dried"}})
    assert prep.status_code == 201 and prep.json()["status"] == "prepared"


def test_sampling_annex_json_and_csv(client, org):
    f = Flow(client, org)
    _, points = f.placed_campaign(n=5)
    f.submit(points[0], latitude=points[0]["latitude"] + 0.00001)
    j = client.get(f"/api/projects/{f.pid}/sampling-annex.json", headers=f.planner)
    assert j.status_code == 200, j.text
    annex = j.json()
    assert annex["strata"][0]["quantification_unit"] == "A"
    assert annex["strata"][0]["stratification_factors"] == {"soil_type": "red", "crop": "maize"}
    assert len(annex["points"]) == 5
    done = next(p for p in annex["points"] if p["sample_code"])
    assert done["intended_latitude"] == points[0]["latitude"]
    assert done["actual_latitude"] == points[0]["latitude"] + 0.00001 and done["distance_from_site_m"] > 1
    assert [x["depth_to_cm"] for x in done["layers"]] == [15, 30]
    c = client.get(f"/api/projects/{f.pid}/sampling-annex.csv", headers=f.planner)
    assert c.status_code == 200 and c.headers["content-type"].startswith("text/csv")
    lines = c.text.strip().splitlines()
    assert lines[0].startswith("record_type,stratum_code") and len(lines) == 1 + 1 + 5
    assert "soil_type=red" in lines[1] and "ST-A-001-BL-D1:0-15" in c.text
    rival = login(client, make_user(make_org("Rival"), "platform_admin"))
    assert client.get(f"/api/projects/{f.pid}/sampling-annex.json", headers=rival).status_code == 404
