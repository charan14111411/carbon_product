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
