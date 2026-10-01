from datetime import UTC, date, datetime, timedelta

from app.modules.land.models import Field
from app.modules.supporting import resolver
from app.modules.supporting.models import Device, Observation, SyncRun
from app.modules.supporting.providers import (
    SimulatedDeviceProvider, SimulatedNasaPower, SimulatedSoilGrids, get_providers,
)
from tests import _p345_factories as fx
from tests.conftest import login, make_org, make_user

START, END = date(2025, 6, 1), date(2025, 6, 30)


def _device(client, h, **kw):
    body = {"kind": "microclime", "external_id": f"MC-{fx._n()}", "name": "Station", **kw}
    r = client.post("/api/devices", headers=h, json=body)
    assert r.status_code == 201, r.text
    return r.json()


def _field(org, w, i=0):
    with fx.session() as s:
        return s.get(Field, w["field_ids"][i])


# ------------------------------------------------------------------ devices
def test_device_crud_defaults_and_permissions(client, org, as_role):
    w = fx.world(org)
    h = as_role("mrv_analyst")
    d = _device(client, h, field_id=str(w["field_ids"][0]))
    assert d["parameters"] == ["rain_mm", "air_temp_c", "rel_humidity_pct", "solar_mj_m2", "wind_m_s"]
    assert d["farm_id"] is not None and d["status"] == "online"
    soil = _device(client, h, kind="soilsync", latitude=12.5, longitude=75.8)
    assert "soil_ph" in soil["parameters"]
    dup = client.post("/api/devices", headers=h, json={"kind": "microclime", "external_id": d["external_id"],
                                                        "name": "Again", "latitude": 1, "longitude": 1})
    assert dup.status_code == 409
    no_loc = client.post("/api/devices", headers=h, json={"kind": "microclime", "external_id": "X-1", "name": "No loc"})
    assert no_loc.status_code == 422 and no_loc.json()["code"] == "LOCATION_REQUIRED"
    bad = client.post("/api/devices", headers=h, json={"kind": "microclime", "external_id": "X-2", "name": "Bad",
                                                        "latitude": 1, "longitude": 1, "parameters": ["co2_ppm"]})
    assert bad.status_code == 422 and bad.json()["code"] == "UNKNOWN_PARAMETER"
    assert client.post("/api/devices", headers=as_role("farmer"), json={}).status_code in (403, 422)
    assert client.post("/api/devices", headers=as_role("verifier"),
                       json={"kind": "microclime", "external_id": "Z", "name": "Zed", "latitude": 1,
                             "longitude": 1}).status_code == 403
    assert len(client.get("/api/devices", headers=as_role("programme_admin")).json()) == 2

    p = client.patch(f"/api/devices/{d['id']}", headers=h, json={"status": "offline", "name": "Renamed"})
    assert p.json()["status"] == "offline" and p.json()["name"] == "Renamed"
    hb = client.post(f"/api/devices/{d['id']}/heartbeat", headers=h).json()
    assert hb["status"] == "online" and hb["last_seen_at"]
    client.patch(f"/api/devices/{d['id']}", headers=h, json={"status": "retired"})
    again = client.patch(f"/api/devices/{d['id']}", headers=h, json={"status": "online"})
    assert again.status_code == 409 and again.json()["code"] == "ILLEGAL_STATE_TRANSITION"
    audit = client.get("/api/audit", headers=as_role("programme_admin")).json()
    assert {"device.create", "device.update", "device.heartbeat"} <= {a["action"] for a in audit}


def test_device_isolation(client, org, as_role):
    d = _device(client, as_role("mrv_analyst"), latitude=12, longitude=75)
    other = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.get(f"/api/devices/{d['id']}", headers=other).status_code == 404
    assert client.post(f"/api/devices/{d['id']}/heartbeat", headers=other).status_code == 404
    assert client.get("/api/devices", headers=other).json() == []


def test_device_health_flags_stale(client, org, as_role):
    h = as_role("mrv_analyst")
    d1 = _device(client, h, latitude=12, longitude=75)
    d2 = _device(client, h, latitude=12, longitude=75)
    client.post(f"/api/devices/{d2['id']}/heartbeat", headers=h)
    with fx.session() as s:
        s.get(Device, __import__("uuid").UUID(d1["id"])).last_seen_at = datetime.now(UTC) - timedelta(days=5)
        s.commit()
    health = {x["id"]: x for x in client.get("/api/devices/health", headers=h).json()}
    assert health[d1["id"]]["stale"] and health[d1["id"]]["suggest_offline"]
    assert not health[d2["id"]]["stale"] and not health[d2["id"]]["suggest_offline"]


# ------------------------------------------------------------------ providers
def test_simulated_providers_are_deterministic_and_labelled():
    w = SimulatedNasaPower()
    a = w.daily(12.5, 75.8, "rain_mm", START, END)
    assert a == w.daily(12.5, 75.8, "rain_mm", START, END) and len(a) == 30
    assert all(v >= 0 for v in a.values())
    assert "(simulated)" in w.source_ref(12.5, 75.8)
    assert w.data_class("soil_moisture_20cm_pct") == "MODELLED" and w.data_class("rain_mm") == "OBSERVED"
    assert w.data_class("soil_ec_ds_m") is None
    t = w.daily(12.5, 75.8, "air_temp_c", START, END)
    assert all(15 < v < 40 for v in t.values())
    soil = SimulatedSoilGrids().properties(12.5, 75.8)
    assert 5 <= soil["clay_pct"] <= 65 and "(simulated)" in SimulatedSoilGrids().source_ref(12.5, 75.8)
    dev = SimulatedDeviceProvider()
    ref = resolver.DeviceRef("A1", "microclime", 12.5, 75.8, "online", ("rain_mm",))
    assert dev.daily(ref, "rain_mm", START, END) == dev.daily(ref, "rain_mm", START, END)
    off = resolver.DeviceRef("A1", "microclime", 12.5, 75.8, "offline", ("rain_mm",))
    assert dev.daily(off, "rain_mm", START, END) == {}
    seen = resolver.DeviceRef("A1", "microclime", 12.5, 75.8, "online", ("rain_mm",),
                              last_seen_at=datetime(2025, 6, 10, tzinfo=UTC))
    assert max(dev.daily(seen, "rain_mm", START, END)) == date(2025, 6, 10)


# ------------------------------------------------------------------ resolver tiers
def test_tier1_own_device(client, org, as_role):
    w = fx.world(org)
    h = as_role("mrv_analyst")
    d = _device(client, h, field_id=str(w["field_ids"][0]))
    client.post(f"/api/devices/{d['id']}/heartbeat", headers=h)
    with fx.session() as s:
        f = s.get(Field, w["field_ids"][0])
        r = resolver.resolve_value(s, f, "rain_mm", START)
    assert r.tier == 1 and r.data_class == "MEASURED" and r.quality == 1.0 and r.provider == "microclime"
    assert "(simulated)" in r.source_ref


def test_tier2_nearby_station_quality_uses_distance(client, org, as_role):
    w = fx.world(org)
    f = _field(org, w)
    _device(client, as_role("mrv_analyst"), latitude=f.centroid_lat + 0.1, longitude=f.centroid_lon)
    with fx.session() as s:
        r = resolver.resolve_value(s, s.get(Field, f.id), "air_temp_c", START)
    assert r.tier == 2 and 10 < r.distance_km < 12
    expected = round(0.8 * max(0.5, 1 - r.distance_km / 50) * 0.9, 3)
    assert r.quality == expected and r.data_class == "MEASURED"


def test_tier2_excluded_by_elevation_falls_to_external(client, org, as_role):
    w = fx.world(org)
    with fx.session() as s:
        f = s.get(Field, w["field_ids"][0])
        f.elevation_m = 900
        s.commit()
        lat, lon = f.centroid_lat, f.centroid_lon
    _device(client, as_role("mrv_analyst"), latitude=lat + 0.05, longitude=lon, elevation_m=1300)
    with fx.session() as s:
        r = resolver.resolve_value(s, s.get(Field, w["field_ids"][0]), "air_temp_c", START)
    assert r.tier == 3 and r.provider == "nasa_power" and r.data_class == "OBSERVED" and r.quality == 0.5
    # within tolerance -> tier 2
    _device(client, as_role("mrv_analyst"), latitude=lat + 0.06, longitude=lon, elevation_m=1100)
    with fx.session() as s:
        assert resolver.resolve_value(s, s.get(Field, w["field_ids"][0]), "air_temp_c", START).tier == 2


def test_station_too_far_is_not_tier2(client, org, as_role):
    w = fx.world(org)
    f = _field(org, w)
    _device(client, as_role("mrv_analyst"), latitude=f.centroid_lat + 0.3, longitude=f.centroid_lon)  # ~33 km
    with fx.session() as s:
        assert resolver.resolve_value(s, s.get(Field, f.id), "wind_m_s", START).tier == 3


def test_offline_device_falls_back(client, org, as_role):
    w = fx.world(org)
    h = as_role("mrv_analyst")
    d = _device(client, h, field_id=str(w["field_ids"][0]))
    client.patch(f"/api/devices/{d['id']}", headers=h, json={"status": "offline"})
    with fx.session() as s:
        r = resolver.resolve_value(s, s.get(Field, w["field_ids"][0]), "rain_mm", START)
    assert r.tier == 3 and not r.bias_corrected  # offline stations are never used for correction either


def test_silent_device_falls_back_after_last_seen(client, org, as_role):
    w = fx.world(org)
    d = _device(client, as_role("mrv_analyst"), field_id=str(w["field_ids"][0]))
    with fx.session() as s:
        s.get(Device, __import__("uuid").UUID(d["id"])).last_seen_at = datetime(2025, 6, 10, tzinfo=UTC)
        s.commit()
        rows = resolver.resolve_series(s, s.get(Field, w["field_ids"][0]), "air_temp_c", START, END)
    assert {r.tier for r in rows if r.observed_on <= date(2025, 6, 10)} == {1}
    assert {r.tier for r in rows if r.observed_on > date(2025, 6, 10)} == {3}
    assert rows[0].quality == 0.8  # silent for > 2 days lowers freshness


def test_tier0_and_modelled_classes(client, org):
    w = fx.world(org)
    with fx.session() as s:
        f = s.get(Field, w["field_ids"][0])
        ec = resolver.resolve_value(s, f, "soil_ec_ds_m", START)
        sm = resolver.resolve_value(s, f, "soil_moisture_20cm_pct", START)
        ph = resolver.resolve_value(s, f, "soil_ph", START)
    assert ec.tier == 0 and ec.value is None and "no external source" in ec.note.lower()
    assert sm.tier == 3 and sm.data_class == "MODELLED"
    assert ph.tier == 3 and ph.provider == "soilgrids" and ph.data_class == "MODELLED"


def test_bias_correction_from_station_within_50km(client, org, as_role):
    w = fx.world(org)
    f = _field(org, w)
    d = _device(client, as_role("mrv_analyst"), latitude=f.centroid_lat + 0.32, longitude=f.centroid_lon)
    with fx.session() as s:
        rows = resolver.resolve_series(s, s.get(Field, f.id), "rain_mm", START, END)
        corr = resolver.bias_correction(s, s.get(Field, f.id), "rain_mm", START, END, get_providers())
    assert all(r.tier == 3 and r.bias_corrected for r in rows)
    assert corr.station == d["external_id"] and corr.overlap_days >= 14 and 0.5 <= corr.factor <= 2.0
    assert "ratio" in rows[0].note
    raw = SimulatedNasaPower().daily(f.centroid_lat, f.centroid_lon, "rain_mm", START, END)
    for r in rows:
        assert abs(r.value - round(raw[r.observed_on] * corr.factor, 2)) < 1e-6
    with fx.session() as s:
        t = resolver.resolve_value(s, s.get(Field, f.id), "air_temp_c", START)
    assert t.bias_corrected and "difference" in t.note


def test_no_bias_correction_without_enough_overlap(client, org, as_role):
    w = fx.world(org)
    f = _field(org, w)
    _device(client, as_role("mrv_analyst"), latitude=f.centroid_lat + 0.32, longitude=f.centroid_lon,
            calibrated_on=(END - timedelta(days=5)).isoformat())
    with fx.session() as s:
        r = resolver.resolve_value(s, s.get(Field, f.id), "rain_mm", START)
    assert r.tier == 3 and not r.bias_corrected


# ------------------------------------------------------------------ sync & reads
def test_sync_writes_and_skips_existing(client, org, as_role):
    w = fx.world(org)
    h = as_role("mrv_analyst")
    fid = w["field_ids"][0]
    _device(client, h, kind="soilsync", field_id=str(fid))
    r = client.post(f"/api/fields/{fid}/supporting/sync", headers=h, json={"start": "2025-06-01", "end": "2025-06-10"})
    assert r.status_code == 201, r.text
    body = r.json()["parameters"]
    assert body["soil_moisture_20cm_pct"]["tier"] == 1 and body["rain_mm"]["tier"] == 3
    assert body["rain_mm"]["written"] == 10
    again = client.post(f"/api/fields/{fid}/supporting/sync", headers=h,
                        json={"start": "2025-06-05", "end": "2025-06-12"}).json()["parameters"]
    assert again["rain_mm"]["written"] == 2 and again["rain_mm"]["skipped_existing"] == 6
    with fx.session() as s:
        assert s.query(Observation).filter_by(field_id=fid, parameter="rain_mm").count() == 12
        assert s.query(SyncRun).filter_by(field_id=fid).count() == 2

    ser = client.get(f"/api/fields/{fid}/supporting?parameter=soil_moisture_20cm_pct&start=2025-06-01&end=2025-06-03",
                     headers=h).json()
    assert len(ser["points"]) == 3 and ser["points"][0]["data_class"] == "MEASURED"
    assert ser["points"][0]["tier"] == 1 and "(simulated)" in ser["points"][0]["source_ref"]
    rain = client.get(f"/api/fields/{fid}/supporting?parameter=rain_mm", headers=h).json()
    assert all("nasa_power (simulated)" in p["source_ref"] for p in rain["points"])
    ec_summary = {p["parameter"]: p for p in client.get(f"/api/fields/{fid}/supporting/summary", headers=h).json()["parameters"]}
    assert ec_summary["soil_ph"]["tier"] == 1 and ec_summary["rain_mm"]["tier"] == 3
    assert ec_summary["rain_mm"]["avg_quality"] == 0.5 and ec_summary["rain_mm"]["last_date"] == "2025-06-12"
    bad = client.get(f"/api/fields/{fid}/supporting?parameter=nope", headers=h)
    assert bad.status_code == 422


def test_sync_window_rules(client, org, as_role):
    w = fx.world(org)
    h = as_role("mrv_analyst")
    fid = w["field_ids"][0]
    long = client.post(f"/api/fields/{fid}/supporting/sync", headers=h, json={"start": "2024-01-01", "end": "2025-06-01"})
    assert long.status_code == 422
    backwards = client.post(f"/api/fields/{fid}/supporting/sync", headers=h, json={"start": "2025-06-02", "end": "2025-06-01"})
    assert backwards.status_code == 422
    future = (date.today() + timedelta(days=3)).isoformat()
    fut = client.post(f"/api/fields/{fid}/supporting/sync", headers=h, json={"start": date.today().isoformat(), "end": future})
    assert fut.status_code == 422 and fut.json()["code"] == "FUTURE_WINDOW"
    assert client.post(f"/api/fields/{fid}/supporting/sync", headers=as_role("verifier"),
                       json={"start": "2025-06-01", "end": "2025-06-02"}).status_code == 403
    other = login(client, make_user(make_org("Rival"), "mrv_analyst"))
    assert client.post(f"/api/fields/{fid}/supporting/sync", headers=other,
                       json={"start": "2025-06-01", "end": "2025-06-02"}).status_code == 404
    assert client.get(f"/api/fields/{fid}/supporting/summary", headers=other).status_code == 404


def test_project_sync_and_coverage(client, org, as_role):
    w = fx.world(org, n_farmers=3)
    h = as_role("mrv_analyst")
    _device(client, h, field_id=str(w["field_ids"][0]))
    r = client.post(f"/api/projects/{w['project_id']}/supporting/sync", headers=h,
                    json={"start": "2025-06-01", "end": "2025-06-03", "parameters": ["rain_mm"]})
    assert r.status_code == 201 and r.json()["fields"] == 3 and r.json()["observations_written"] == 9
    cov = client.get(f"/api/projects/{w['project_id']}/supporting/coverage?on=2025-06-02", headers=h).json()
    assert cov["fields"] == 3
    # the device on field 0 is 1-2 km from the others, so they get tier 2
    assert cov["by_best_tier"]["1"] == 1 and cov["by_best_tier"]["2"] == 2
    far = fx.world(org, n_farmers=2, lat=20.0, lon=78.0)
    cov2 = client.get(f"/api/projects/{far['project_id']}/supporting/coverage?on=2025-06-02", headers=h).json()
    assert cov2["by_best_tier"]["3"] == 2 and len(cov2["device_would_help_most"]) == 2
    assert cov2["device_would_help_most"][0]["area_ha"] >= cov2["device_would_help_most"][1]["area_ha"]


# ================================================================== derived features (pure)
from app.modules.supporting import derived as dv  # noqa: E402
from app.modules.supporting import terrain as tr  # noqa: E402
from app.modules.supporting.soil import usda_texture_class  # noqa: E402


def _series(start, values, tier=1, provider="soilsync", quality=1.0, data_class="MEASURED"):
    return {start + timedelta(days=i): dv.Daily(start + timedelta(days=i), v, tier, provider, quality, data_class)
            for i, v in enumerate(values) if v is not None}


def test_vpd_tetens_and_field_capacity():
    es25 = 0.6108 * __import__("math").exp(17.27 * 25 / (25 + 237.3))
    assert abs(dv.saturation_vapour_pressure_kpa(25) - es25) < 1e-12 and abs(es25 - 3.1676) < 1e-3
    assert abs(dv.vpd_kpa(25, 50) - es25 / 2) < 1e-12
    assert dv.vpd_kpa(30, 100) == 0.0 and dv.vpd_kpa(30, 120) == 0.0  # RH clipped
    assert dv.vpd_kpa(35, 30) > dv.vpd_kpa(20, 30) > 0
    loam = dv.field_capacity_pct(40, 20, 2.5)
    sand = dv.field_capacity_pct(90, 5, 0.5)
    clay = dv.field_capacity_pct(20, 50, 2.5)
    assert 5 < sand < loam < clay < 50


def test_dry_down_rate_uses_rain_free_spells_only():
    d0 = date(2025, 6, 1)
    # days 0-4 dry and drying 1 %/day; day 5 rains; days 6-9 dry but wetting (ignored); day 10-11 too short
    sm = _series(d0, [30, 29, 28, 27, 26, 35, 30, 31, 32, 33, 28, 27])
    rain = _series(d0, [0, 0, 0.5, 0, 0, 20, 0, 0, 0, 0, 12, 0], provider="microclime")
    rate, spells, used = dv.dry_down_rate(rain, sm, d0, d0 + timedelta(days=11))
    assert rate == 1.0
    assert [s["days"] for s in spells] == [5, 4] and spells[1]["slope_pct_per_day"] > 0
    assert len(used) == 10  # 5 SM + 5 rain rows of the drying spell
    assert dv.dry_down_rate({}, sm, d0, d0 + timedelta(days=11))[0] is None  # no rain data: unknown


def test_periods_weekly_monthly_season():
    assert dv.periods(date(2025, 6, 4), date(2025, 6, 17), "weekly") == [
        (date(2025, 6, 4), date(2025, 6, 8)), (date(2025, 6, 9), date(2025, 6, 15)),
        (date(2025, 6, 16), date(2025, 6, 17))]
    assert dv.periods(date(2025, 1, 20), date(2025, 3, 3), "monthly") == [
        (date(2025, 1, 20), date(2025, 1, 31)), (date(2025, 2, 1), date(2025, 2, 28)),
        (date(2025, 3, 1), date(2025, 3, 3))]
    assert dv.periods(date(2025, 12, 30), date(2026, 1, 2), "monthly")[1] == (date(2026, 1, 1), date(2026, 1, 2))
    assert len(dv.periods(date(2025, 1, 1), date(2025, 1, 10), "daily")) == 10
    assert dv.periods(date(2025, 1, 1), date(2025, 5, 1), "season") == [(date(2025, 1, 1), date(2025, 5, 1))]


def test_period_features_values_provenance_and_quality():
    d0 = date(2025, 6, 1)
    inputs = {
        "soil_moisture_20cm_pct": _series(d0, [30, 32, 34, 20]),
        "soil_moisture_60cm_pct": _series(d0, [25, 25, 25, 25], tier=2, provider="soilsync", quality=0.7),
        "rain_mm": _series(d0 - timedelta(days=89), [0.0] * 89 + [30, 0, 26, 1]),  # d0-89 .. d0+3
        "air_temp_c": _series(d0, [20, 12, 8, 25], tier=3, provider="nasa_power", quality=0.5, data_class="OBSERVED"),
        "rel_humidity_pct": _series(d0, [50, 60, 70, 80], tier=3, provider="nasa_power", quality=0.5,
                                    data_class="OBSERVED"),
    }
    f = dv.period_features(inputs, d0, d0 + timedelta(days=3), wet_threshold_pct=31.0)
    assert f["sm20_mean"]["value"] == 29.0 and f["sm20_min"]["value"] == 20 and f["sm20_max"]["value"] == 34
    assert f["sm20_mean"]["data_class"] == "DERIVED" and f["sm20_mean"]["source_tiers"] == [1]
    g = f["sm_gradient"]
    assert g["value"] == 4.0 and g["source_tiers"] == [1, 2] and g["quality"] == 0.7  # min of inputs
    assert f["wetness_days"]["value"] == 2 and f["wetness_hours"]["value"] == 48
    assert f["gdd_base10"]["value"] == 10 + 2 + 0 + 15 and f["gdd_base10"]["quality"] == 0.5
    vpd = [dv.vpd_kpa(t, h) for t, h in ((20, 50), (12, 60), (8, 70), (25, 80))]
    assert abs(f["vpd_mean"]["value"] - round(sum(vpd) / 4, 4)) < 1e-9
    assert f["vpd_mean"]["input_data_classes"] == ["OBSERVED"] and f["vpd_mean"]["providers"] == ["nasa_power"]
    assert f["rain_total"]["value"] == 57 and f["heavy_rain_days"]["value"] == 2
    assert f["rain_7d"]["value"] == 57 and f["rain_7d"]["completeness"] == 1.0
    assert f["rain_90d"]["value"] == 57 and f["rain_90d"]["window"] == ["2025-03-07", "2025-06-04"]
    sparse = dv.period_features({"rain_mm": _series(d0, [5, 5])}, d0, d0 + timedelta(days=1), None)
    assert sparse["rain_7d"]["value"] is None and sparse["rain_7d"]["completeness"] == round(2 / 7, 3)
    assert sparse["wetness_days"]["value"] is None and sparse["sm20_mean"]["value"] is None
    assert sparse["sm20_mean"]["quality"] == 0.0


def test_derived_features_endpoint(client, org, as_role):
    w = fx.world(org)
    h = as_role("mrv_analyst")
    fid = w["field_ids"][0]
    _device(client, h, kind="soilsync", field_id=str(fid))
    r = client.post(f"/api/fields/{fid}/supporting/sync", headers=h, json={"start": "2025-03-01", "end": "2025-06-30"})
    assert r.status_code == 201, r.text
    out = client.get(f"/api/fields/{fid}/derived-features?start=2025-06-01&end=2025-06-30&window=weekly", headers=h)
    assert out.status_code == 200, out.text
    body = out.json()
    assert body["data_class"] == "DERIVED" and len(body["periods"]) == 6  # Jun 1 (Sun), 4 full weeks, Jun 30
    assert "Saxton" in body["wetness_threshold"]["source"]
    wk = body["periods"][1]["features"]
    for k in ("sm20_mean", "sm60_mean", "sm_gradient", "vpd_mean", "rain_total", "gdd_base10", "rain_30d"):
        assert wk[k]["data_class"] == "DERIVED" and wk[k]["value"] is not None, k
    assert wk["sm20_mean"]["source_tiers"] == [1] and wk["vpd_mean"]["source_tiers"] == [3]
    assert wk["vpd_mean"]["quality"] <= 0.5 and wk["sm20_mean"]["quality"] <= 1.0
    assert abs(wk["sm_gradient"]["value"] - (wk["sm20_mean"]["value"] - wk["sm60_mean"]["value"])) < 0.01
    assert body["periods"][-1]["features"]["rain_90d"]["value"] is not None  # look-back reaches into March
    season = client.get(f"/api/fields/{fid}/derived-features?start=2025-06-01&end=2025-06-30&window=season"
                        "&wet_threshold_pct=5", headers=h).json()
    assert len(season["periods"]) == 1 and season["wetness_threshold"]["value_pct"] == 5
    assert season["periods"][0]["features"]["wetness_days"]["value"] == 30
    assert client.get(f"/api/fields/{fid}/derived-features?start=2025-06-01&end=2025-06-30&window=hourly",
                      headers=h).json()["code"] == "UNKNOWN_WINDOW"
    assert client.get(f"/api/fields/{fid}/derived-features?start=2025-06-30&end=2025-06-01",
                      headers=h).status_code == 422
    other = login(client, make_user(make_org("Rival"), "mrv_analyst"))
    assert client.get(f"/api/fields/{fid}/derived-features?start=2025-06-01&end=2025-06-30",
                      headers=other).status_code == 404


# ================================================================== soil texture
def test_usda_texture_classes():
    cases = {(40, 40, 20): "loam", (90, 5, 5): "sand", (20, 20, 60): "clay", (10, 85, 5): "silt",
             (60, 10, 30): "sandy clay loam", (30, 35, 35): "clay loam", (10, 55, 35): "silty clay loam",
             (5, 45, 50): "silty clay", (50, 5, 45): "sandy clay", (65, 25, 10): "sandy loam",
             (82, 12, 6): "loamy sand", (20, 65, 15): "silt loam"}
    for (sa, si, cl), cls in cases.items():
        assert usda_texture_class(sa, si, cl) == cls, (sa, si, cl)
    assert usda_texture_class(80, 80, 40) == usda_texture_class(40, 40, 20)  # renormalised


# ================================================================== terrain
class _Plane:
    """z = z0 + gx · east_m + gy · north_m (exact slope and aspect)."""

    name = "plane"

    def __init__(self, gx, gy, lat0=12.5, lon0=75.8):
        self.gx, self.gy, self.lat0, self.lon0 = gx, gy, lat0, lon0

    def elevation(self, lat, lon):
        import math
        east = (lon - self.lon0) * tr.M_PER_DEG_LON_EQ * math.cos(math.radians(self.lat0))
        north = (lat - self.lat0) * tr.M_PER_DEG_LAT
        return 500 + self.gx * east + self.gy * north

    def source_ref(self, lat, lon):
        return "plane (test)"


def test_slope_classes_table10_bins():
    expect = {0: "nearly_level", 3.0: "nearly_level", 3.49: "nearly_level", 3.5: "gently_sloping",
              8.49: "gently_sloping", 8.5: "strongly_sloping", 16.49: "strongly_sloping", 16.5: "moderately_steep",
              30.49: "moderately_steep", 30.5: "steep", 45.49: "steep", 45.5: "very_steep", 90: "very_steep"}
    for s, c in expect.items():
        assert tr.slope_class(s) == c, s


def test_horn_on_planes_gives_exact_slope_and_aspect():
    from app.core.geo import square
    b = square(12.5, 75.8, 300)
    west = tr.compute_terrain(b, _Plane(0.10, 0.0))  # rises to the east -> faces west
    assert abs(west.slope_mean_pct - 10.0) < 0.05 and abs(west.aspect_deg - 270.0) < 0.5
    assert west.dominant_class == "strongly_sloping" and west.histogram["strongly_sloping"]["share"] == 1.0
    north = tr.compute_terrain(b, _Plane(0.0, -0.05))  # falls to the north -> faces north
    assert abs(north.slope_mean_pct - 5.0) < 0.05 and (north.aspect_deg < 0.5 or north.aspect_deg > 359.5)
    se = tr.compute_terrain(b, _Plane(-0.2, 0.2))  # falls to the east, rises to the north -> faces south-east
    assert abs(se.slope_mean_pct - 28.28) < 0.1 and abs(se.aspect_deg - 135.0) < 0.5
    assert se.dominant_class == "moderately_steep"
    flat = tr.compute_terrain(b, _Plane(0.0, 0.0))
    assert flat.slope_mean_pct == 0 and flat.aspect_deg is None and flat.dominant_class == "nearly_level"
    assert sum(v["cells"] for v in west.histogram.values()) == west.n_cells > 50
    assert 10 <= west.cell_size_m <= 30


def test_simulated_dem_deterministic_and_varied():
    from app.core.geo import square
    dem = tr.SimulatedDEM()
    assert dem.elevation(12.5, 75.8) == tr.SimulatedDEM().elevation(12.5, 75.8)
    results = [tr.compute_terrain(square(12.0 + 0.37 * i, 75.0 + 0.41 * i, 400), dem) for i in range(12)]
    slopes = [r.slope_mean_pct for r in results]
    assert min(slopes) < max(slopes) and all(0 <= s < 100 for s in slopes)
    assert len({r.dominant_class for r in results}) >= 2
    assert "(simulated)" in dem.source_ref(12.5, 75.8)


def test_terrain_refresh_writes_only_empty_columns_unless_forced(client, org, as_role):
    w = fx.world(org, n_farmers=2)
    with fx.session() as s:
        s.get(Field, w["field_ids"][0]).elevation_m = 123.0
        s.commit()
    h = as_role("mrv_analyst")
    fid = str(w["field_ids"][0])
    r = client.post(f"/api/fields/{fid}/terrain/refresh", headers=h)
    assert r.status_code == 201, r.text
    t = r.json()
    assert t["data_class"] == "DERIVED" and t["credit_eligible"] is False
    assert t["applied"]["elevation_m"]["written"] is False and t["applied"]["slope_pct"]["written"] is True
    assert sum(v["cells"] for v in t["histogram"].values()) == t["n_cells"]
    assert t["dominant_slope_class"] in {c for c, *_ in tr.SLOPE_CLASSES}
    with fx.session() as s:
        f = s.get(Field, w["field_ids"][0])
        assert f.elevation_m == 123.0 and f.slope_pct == t["slope_mean_pct"] and f.aspect_deg == t["aspect_deg"]
    again = client.post(f"/api/fields/{fid}/terrain/refresh", headers=h, json={"force": False}).json()
    assert not any(a["written"] for a in again["applied"].values())
    forced = client.post(f"/api/fields/{fid}/terrain/refresh", headers=h, json={"force": True}).json()
    assert forced["applied"]["elevation_m"]["written"] and forced["applied"]["elevation_m"]["before"] == 123.0
    with fx.session() as s:
        assert s.get(Field, w["field_ids"][0]).elevation_m == forced["elevation_mean_m"]
    assert len(client.get(f"/api/fields/{fid}/terrain", headers=h).json()) == 3
    proj = client.post(f"/api/projects/{w['project_id']}/terrain/refresh", headers=h)
    assert proj.status_code == 201 and proj.json()["fields"] == 2 and proj.json()["fields_updated"] == 1
    assert sum(proj.json()["by_slope_class"].values()) == 2
    audit = [a for a in client.get("/api/audit", headers=as_role("programme_admin")).json()]
    actions = [a["action"] for a in audit]
    assert "terrain.refresh" in actions and actions.count("field.terrain_update") == 3  # first, forced, project
    assert client.post(f"/api/fields/{fid}/terrain/refresh", headers=as_role("verifier")).status_code == 403
    other = login(client, make_user(make_org("Rival"), "mrv_analyst"))
    assert client.post(f"/api/fields/{fid}/terrain/refresh", headers=other).status_code == 404


# ================================================================== soil-map suggestions
def test_soil_suggestions_are_never_auto_applied(client, org, as_role):
    w = fx.world(org)
    h = as_role("mrv_analyst")
    fid = str(w["field_ids"][0])
    r = client.post(f"/api/fields/{fid}/soil-properties/refresh", headers=h)
    assert r.status_code == 201, r.text
    sug = r.json()
    assert sug["data_class"] == "MODELLED" and sug["credit_eligible"] is False
    p = sug["properties"]
    assert sug["soil_texture_class"] == usda_texture_class(p["sand_pct"], p["silt_pct"], p["clay_pct"]).replace(" ", "_")
    assert sug["wrb_soil_group"] and 0 < sug["wrb_probability"] <= 1
    assert sug["current"] == {"soil_texture_class": None, "wrb_soil_group": None}
    with fx.session() as s:  # nothing written to the field
        f = s.get(Field, w["field_ids"][0])
        assert f.soil_texture_class is None and f.wrb_soil_group is None
    body = {"suggestion_id": sug["id"]}
    assert client.post(f"/api/fields/{fid}/soil-properties/apply", headers=h, json=body).status_code == 403
    admin = as_role("programme_admin")
    ok = client.post(f"/api/fields/{fid}/soil-properties/apply", headers=admin, json=body)
    assert ok.status_code == 200, ok.text
    assert ok.json()["current"] == {"soil_texture_class": sug["soil_texture_class"],
                                    "wrb_soil_group": sug["wrb_soil_group"]}
    with fx.session() as s:
        s.get(Field, w["field_ids"][0]).wrb_soil_group = "Histosols"  # a person recorded something else
        s.commit()
    clash = client.post(f"/api/fields/{fid}/soil-properties/apply", headers=admin, json=body)
    assert clash.status_code == 409 and clash.json()["code"] == "FIELD_VALUE_EXISTS"
    over = client.post(f"/api/fields/{fid}/soil-properties/apply", headers=admin,
                       json={**body, "columns": ["wrb_soil_group"], "overwrite": True, "note": "checked in field"})
    assert over.json()["changes"] == {"wrb_soil_group": {"before": "Histosols", "after": sug["wrb_soil_group"]}}
    assert len(client.get(f"/api/fields/{fid}/soil-properties", headers=h).json()) == 1
    other_field = str(w["field_ids"][1])
    assert client.post(f"/api/fields/{other_field}/soil-properties/apply", headers=admin,
                       json=body).status_code == 404
    actions = [a["action"] for a in client.get("/api/audit", headers=admin).json()]
    assert "soil_suggestion.create" in actions and actions.count("soil_suggestion.apply") == 2
    assert actions.count("field.soil_update") == 2


# ================================================================== weather-station check (QA1)
def test_weather_station_check_50km_rule(client, org, as_role):
    w = fx.world(org, n_farmers=1)
    far = fx.world(org, n_farmers=1, lat=14.0, lon=75.8)  # ~166 km north
    h = as_role("mrv_analyst")
    # enrol the far field into the first project
    from app.modules.programmes.models import Project
    with fx.session() as s:
        fx.enrol(s, org, s.get(Project, w["project_id"]), s.get(Field, far["field_ids"][0]))
        s.commit()
    st = _device(client, h, latitude=12.59, longitude=75.8)  # ~10 km from the first field
    client.post(f"/api/devices/{st['id']}/heartbeat", headers=h)
    off = _device(client, h, latitude=14.02, longitude=75.8, status="offline")  # near the far field, offline
    r = client.get(f"/api/projects/{w['project_id']}/weather-station-check", headers=h)
    assert r.status_code == 200, r.text
    body = r.json()
    items = {i["field_id"]: i for i in body["items"]}
    near = items[str(w["field_ids"][0])]
    assert near["decision"] == "station" and near["tier"] == 2 and near["passes"]
    assert 9 < near["station"]["distance_km"] < 11 and near["station"]["provider"] == "Varsapradaya MicroClime"
    remote = items[str(far["field_ids"][0])]
    assert remote["decision"] == "synthetic_station" and remote["tier"] == 3 and not remote["passes"]
    assert "use synthetic station" in remote["message"] and remote["synthetic_source"]
    assert [x["external_id"] for x in remote["excluded_stations"]] == [off["external_id"]]
    assert body["max_distance_km"] == 50 and "Table 6" in body["rule"]
    assert body["with_station"] == 1 and body["synthetic_station"] == 1
    # a never-reporting station is not "continuous"
    _device(client, h, latitude=14.01, longitude=75.8)
    again = {i["field_id"]: i for i in client.get(f"/api/projects/{w['project_id']}/weather-station-check",
                                                   headers=h).json()["items"]}
    assert again[str(far["field_ids"][0])]["decision"] == "synthetic_station"
    other = login(client, make_user(make_org("Rival"), "mrv_analyst"))
    assert client.get(f"/api/projects/{w['project_id']}/weather-station-check", headers=other).status_code == 404
