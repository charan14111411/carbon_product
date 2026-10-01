"""Real public-data providers (NASA POWER, ISRIC SoilGrids, Planetary Computer Sentinel-2/Landsat, Copernicus DEM).

Offline: every HTTP call goes to an ``httpx.MockTransport`` that answers with bodies recorded from the live APIs
(demo point lat 12.4, lon 75.7, trimmed). Ported from services/data-sources/tests where the old tests existed.
"""

from __future__ import annotations

import copy
import io
import json
import math
from datetime import date

import httpx
import numpy as np
import pytest

from app.core.errors import ProviderUnavailable
from app.core.http import JsonHttp
from app.core.planetary_computer import PlanetaryComputerClient
from app.modules.intelligence.planetary_computer import PlanetaryComputer, s2_expressions
from app.modules.intelligence.providers import CLOUD_LIMIT_PCT, FieldRef, register_satellite_provider
from app.modules.land.models import Field
from app.modules.supporting import resolver, terrain
from app.modules.supporting.copernicus_dem import CopernicusDEM, sample
from app.modules.supporting.nasa_power import NasaPower
from app.modules.supporting.providers import (
    Providers, SimulatedDeviceProvider, SimulatedSoilGrids, register_soil_provider, register_weather_provider,
)
from app.modules.supporting.soilgrids import SoilGrids
from tests import _p345_factories as fx

LAT, LON = 12.4, 75.7


@pytest.fixture(autouse=True)
def _fresh_caches():
    NasaPower.cache_clear()
    SoilGrids.cache_clear()
    CopernicusDEM.cache_clear()
    yield
    NasaPower.cache_clear()
    SoilGrids.cache_clear()
    CopernicusDEM.cache_clear()


class Recorder:
    """A MockTransport handler that records the requests it answered."""

    def __init__(self, handler):
        self.handler, self.requests = handler, []

    def __call__(self, request: httpx.Request) -> httpx.Response:
        self.requests.append(request)
        return self.handler(request)


def http(handler, provider="test", retries=2) -> JsonHttp:
    return JsonHttp(provider, timeout_s=5, retries=retries, client=httpx.Client(transport=httpx.MockTransport(handler)),
                    sleep=lambda s: None)


# ------------------------------------------------------------------ NASA POWER
POWER_BODY = {  # recorded 2026-10-01: daily point 12.4, 75.7, 2025-09-01..05, community AG
    "type": "Feature", "geometry": {"type": "Point", "coordinates": [75.7, 12.4, 601.03]},
    "header": {"title": "NASA/POWER Source Native Resolution Daily Data", "fill_value": -999.0,
               "time_standard": "LST", "start": "20250901", "end": "20250905"},
    "parameters": {"PRECTOTCORR": {"units": "mm/day"}, "T2M": {"units": "C"}, "RH2M": {"units": "%"},
                   "WS2M": {"units": "m/s"}, "ALLSKY_SFC_SW_DWN": {"units": "MJ/m^2/day"}},
    "properties": {"parameter": {
        "PRECTOTCORR": {"20250901": 3.7, "20250902": 10.3, "20250903": 19.66, "20250904": 14.94, "20250905": -999.0},
        "T2M": {"20250901": 23.03, "20250902": 22.78, "20250903": 22.97, "20250904": 23.15, "20250905": -999.0},
        "RH2M": {"20250901": 92.19, "20250902": 91.83, "20250903": 92.7, "20250904": 92.06, "20250905": -999.0},
        "WS2M": {"20250901": 0.99, "20250902": 1.01, "20250903": 1.03, "20250904": 0.96, "20250905": -999.0},
        "ALLSKY_SFC_SW_DWN": {"20250901": 12.45, "20250902": 14.55, "20250903": 8.19, "20250904": 11.81,
                              "20250905": -999.0}}},
}


def power(body=POWER_BODY, status=200):
    rec = Recorder(lambda r: httpx.Response(status, json=body))
    return NasaPower(http=http(rec, "NASA POWER")), rec


def test_nasa_power_maps_parameters_units_and_classes():
    w, rec = power()
    d1, d5 = date(2025, 9, 1), date(2025, 9, 5)
    rain = w.daily(LAT, LON, "rain_mm", d1, d5)
    assert rain[d1] == 3.7 and rain[date(2025, 9, 3)] == 19.66
    assert d5 not in rain  # fill value -> left out (not available), never guessed
    assert w.daily(LAT, LON, "air_temp_c", d1, d5)[d1] == 23.03
    assert w.daily(LAT, LON, "rel_humidity_pct", d1, d5)[d1] == 92.19
    assert w.daily(LAT, LON, "wind_m_s", d1, d5)[d1] == 0.99
    assert w.daily(LAT, LON, "solar_mj_m2", d1, d5)[d1] == 12.45  # already MJ/m²/day: not converted again
    assert {w.data_class(p) for p in ("rain_mm", "air_temp_c", "rel_humidity_pct", "solar_mj_m2", "wind_m_s")} \
        == {"MODELLED"}
    # GWET is relative wetness (0-1), not % vol; TS is skin temperature: not offered
    for p in ("soil_moisture_20cm_pct", "soil_moisture_60cm_pct", "soil_temp_c", "soil_ec_ds_m", "soil_ph"):
        assert w.data_class(p) is None and w.daily(LAT, LON, p, d1, d5) == {}
    assert len(rec.requests) == 1  # one request for every parameter, then the cache
    q = rec.requests[0].url.params
    assert q["community"] == "AG" and q["start"] == "20250901" and q["end"] == "20250905"
    assert set(q["parameters"].split(",")) == {"PRECTOTCORR", "T2M", "RH2M", "WS2M", "ALLSKY_SFC_SW_DWN"}
    assert "simulated" not in w.source_ref(LAT, LON) and "nasa_power" in w.source_ref(LAT, LON)


def test_nasa_power_solar_in_kwh_is_converted_and_unknown_units_dropped():
    body = copy.deepcopy(POWER_BODY)
    body["parameters"]["ALLSKY_SFC_SW_DWN"]["units"] = "kW-hr/m^2/day"
    body["properties"]["parameter"]["ALLSKY_SFC_SW_DWN"]["20250901"] = 6.0
    body["parameters"]["T2M"]["units"] = "K"
    w, _ = power(body)
    assert abs(w.daily(LAT, LON, "solar_mj_m2", date(2025, 9, 1), date(2025, 9, 5))[date(2025, 9, 1)] - 21.6) < 1e-9
    assert w.daily(LAT, LON, "air_temp_c", date(2025, 9, 1), date(2025, 9, 5)) == {}  # never converted by guesswork


def test_http_retries_server_errors_then_succeeds_but_not_client_errors():
    answers = [httpx.Response(503), httpx.Response(429, headers={"Retry-After": "1"}), httpx.Response(200, json={"ok": 1})]
    rec = Recorder(lambda r: answers.pop(0))
    slept = []
    h = JsonHttp("x", timeout_s=5, retries=2, client=httpx.Client(transport=httpx.MockTransport(rec)),
                 sleep=slept.append)
    assert h.get("https://example.test/a") == {"ok": 1} and len(rec.requests) == 3 and slept == [1.0, 2.0]
    rec404 = Recorder(lambda r: httpx.Response(404))
    with pytest.raises(ProviderUnavailable) as e:
        http(rec404).get("https://example.test/b")
    assert len(rec404.requests) == 1 and e.value.status == 503 and "HTTP 404" in e.value.message

    def boom(r):
        raise httpx.ConnectTimeout("slow")

    with pytest.raises(ProviderUnavailable) as e:
        http(boom).get("https://example.test/c")
    assert e.value.code == "PROVIDER_UNAVAILABLE" and "timed out" in e.value.reason


def test_nasa_power_outage_is_remembered_briefly():
    w, rec = power(status=500)
    with pytest.raises(ProviderUnavailable):
        w.daily(LAT, LON, "rain_mm", date(2025, 9, 1), date(2025, 9, 5))
    assert len(rec.requests) == 3  # first try + 2 retries
    with pytest.raises(ProviderUnavailable):
        w.daily(LAT, LON, "air_temp_c", date(2025, 9, 1), date(2025, 9, 5))
    assert len(rec.requests) == 3  # the next parameter does not hammer a service that is down


def _providers(weather=None, soil=None) -> Providers:
    from app.modules.supporting.providers import SimulatedNasaPower

    return Providers(device=SimulatedDeviceProvider(), weather=weather or SimulatedNasaPower(),
                     soil=soil or SimulatedSoilGrids())


def test_resolver_uses_real_power_as_modelled_tier3(client, org):
    w = fx.world(org, lat=LAT, lon=LON)
    weather, _ = power()
    with fx.session() as s:
        f = s.get(Field, w["field_ids"][0])
        rows = resolver.resolve_series(s, f, "rain_mm", date(2025, 9, 1), date(2025, 9, 5),
                                       providers=_providers(weather), today=date(2026, 10, 1))
        sm = resolver.resolve_value(s, f, "soil_moisture_20cm_pct", date(2025, 9, 1), providers=_providers(weather))
    assert [r.value for r in rows[:4]] == [3.7, 10.3, 19.66, 14.94]
    assert {(r.tier, r.provider, r.data_class) for r in rows[:4]} == {(3, "nasa_power", "MODELLED")}
    assert "Modelled by an external source" in rows[0].note
    assert rows[4].tier == 0 and rows[4].value is None and "no value for this day" in rows[4].note
    assert sm.tier == 0 and "no external source offers soil moisture" in sm.note.lower()


def test_power_outage_falls_back_to_not_available_and_sync_completes(client, org, as_role, monkeypatch):
    w = fx.world(org, lat=LAT, lon=LON)
    register_weather_provider("nasa_power_down", lambda: power(status=503)[0])
    monkeypatch.setenv("VC_WEATHER_PROVIDER", "nasa_power_down")
    h = as_role("mrv_analyst")
    fid = w["field_ids"][0]
    r = client.post(f"/api/fields/{fid}/supporting/sync", headers=h,
                    json={"start": "2025-09-01", "end": "2025-09-03", "parameters": ["rain_mm", "soil_ph"]})
    assert r.status_code in (200, 201), r.text
    assert r.json()["parameters"]["rain_mm"]["tier"] == 0
    assert r.json()["parameters"]["soil_ph"]["tier"] == 3  # the (simulated) soil map still works
    pts = client.get(f"/api/fields/{fid}/supporting?parameter=rain_mm", headers=h).json()["points"]
    assert len(pts) == 3 and all(p["value"] is None and "external source unavailable" in p["note"] for p in pts)
    assert "NASA POWER" in pts[0]["note"]


# ------------------------------------------------------------------ SoilGrids
SOILGRIDS_BODY = {  # recorded 2026-10-01: properties/query lon 75.7 lat 12.4, depths 0-5/5-15/15-30 cm, mean
    "type": "Feature", "geometry": {"type": "Point", "coordinates": [75.7, 12.4]},
    "properties": {"layers": [
        {"name": n, "unit_measure": {"d_factor": f, "mapped_units": mu, "target_units": tu},
         "depths": [{"range": {"top_depth": t, "bottom_depth": b, "unit_depth": "cm"}, "label": f"{t}-{b}cm",
                     "values": {"mean": v}} for (t, b), v in zip(((0, 5), (5, 15), (15, 30)), vals, strict=True)]}
        for n, f, mu, tu, vals in (
            ("bdod", 100, "cg/cm³", "kg/dm³", (119, 118, 119)),
            ("clay", 10, "g/kg", "%", (337, 329, 346)),
            ("phh2o", 10, "pH*10", "-", (56, 56, 56)),
            ("sand", 10, "g/kg", "%", (407, 417, 400)),
            ("silt", 10, "g/kg", "%", (256, 254, 255)),
            ("soc", 10, "dg/kg", "g/kg", (374, 320, 227)))]},
    "query_time_s": 6.84,
}
WRB_BODY = {"type": "Point", "coordinates": [75.7, 12.4], "wrb_class_name": "Cambisols", "wrb_class_value": 6,
            "wrb_class_probability": [["Cambisols", 15]]}


def soilgrids(props=SOILGRIDS_BODY, wrb=WRB_BODY, wrb_status=200):
    def handler(r):
        if r.url.path.endswith("/classification/query"):
            return httpx.Response(wrb_status, json=wrb)
        return httpx.Response(200, json=props)

    rec = Recorder(handler)
    return SoilGrids(http=http(rec, "ISRIC SoilGrids")), rec


def _weighted(a, b, c, factor):
    return (a * 5 + b * 10 + c * 15) / 30 / factor


def test_soilgrids_depth_weighted_topsoil_and_unit_conversion():
    s, rec = soilgrids()
    p = s.properties(LAT, LON)
    assert set(p) == {"clay_pct", "sand_pct", "silt_pct", "ph", "soc_g_kg", "bdod_g_cm3"}
    assert p["clay_pct"] == pytest.approx(_weighted(337, 329, 346, 10), abs=0.06)  # g/kg -> %
    assert p["sand_pct"] == pytest.approx(_weighted(407, 417, 400, 10), abs=0.06)
    assert p["ph"] == 5.6  # pH*10 -> pH
    assert p["soc_g_kg"] == pytest.approx(_weighted(374, 320, 227, 10), abs=0.06)  # dg/kg -> g/kg
    assert p["bdod_g_cm3"] == pytest.approx(_weighted(119, 118, 119, 100), abs=0.005)  # cg/cm³ -> g/cm³
    q = rec.requests[0].url.params
    assert q.get_list("property") == ["clay", "sand", "silt", "phh2o", "soc", "bdod"]
    assert q.get_list("depth") == ["0-5cm", "5-15cm", "15-30cm"] and q["value"] == "mean"
    assert s.wrb_group(LAT, LON) == ("Cambisols", 0.15)
    s.properties(LAT, LON)
    s.wrb_group(LAT, LON)
    assert len(rec.requests) == 2  # cached: the maps are static
    assert "soilgrids" in s.source_ref(LAT, LON) and "CC-BY" in s.source_ref(LAT, LON)


def test_soilgrids_null_layers_are_skipped_and_all_null_is_not_available():
    body = copy.deepcopy(SOILGRIDS_BODY)
    ph = next(layer for layer in body["properties"]["layers"] if layer["name"] == "phh2o")
    ph["depths"][0]["values"]["mean"] = None  # ported: SoilGrids answers 200 with a null where it has no estimate
    ph["depths"][1]["values"]["mean"] = 62
    ph["depths"][2]["values"]["mean"] = 62
    bd = next(layer for layer in body["properties"]["layers"] if layer["name"] == "bdod")
    bd["unit_measure"]["d_factor"] = 10  # a wrong factor in the answer: bdod is always cg/cm³ -> ÷ 100
    s, _ = soilgrids(body)
    p = s.properties(LAT, LON)
    assert p["ph"] == 6.2 and 1.1 < p["bdod_g_cm3"] < 1.3
    SoilGrids.cache_clear()
    for layer in body["properties"]["layers"]:
        if layer["name"] == "clay":
            for d in layer["depths"]:
                d["values"]["mean"] = None
    s, _ = soilgrids(body)
    with pytest.raises(ProviderUnavailable) as e:
        s.properties(LAT, LON)
    assert e.value.details["missing"] == ["clay_pct"] and "no value for this location" in e.value.message


def test_soilgrids_wrb_failure_is_optional():
    s, _ = soilgrids(wrb_status=500)
    assert s.wrb_group(LAT, LON) is None
    assert s.properties(LAT, LON)["clay_pct"] > 0


def test_soil_suggestion_from_real_soilgrids_and_outage_message(client, org, as_role, monkeypatch):
    w = fx.world(org, lat=LAT, lon=LON)
    register_soil_provider("soilgrids_recorded", lambda: soilgrids()[0])
    monkeypatch.setenv("VC_SOIL_PROVIDER", "soilgrids_recorded")
    h = as_role("mrv_analyst")
    fid = w["field_ids"][0]
    r = client.post(f"/api/fields/{fid}/soil-properties/refresh", headers=h)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["provider"] == "soilgrids" and body["data_class"] == "MODELLED" and body["credit_eligible"] is False
    assert body["soil_texture_class"] == "clay_loam" and body["wrb_soil_group"] == "Cambisols"
    assert body["wrb_probability"] == 0.15

    def down():
        return SoilGrids(http=http(lambda r: httpx.Response(502), "ISRIC SoilGrids"))

    register_soil_provider("soilgrids_down", down)
    monkeypatch.setenv("VC_SOIL_PROVIDER", "soilgrids_down")
    SoilGrids.cache_clear()
    bad = client.post(f"/api/fields/{fid}/soil-properties/refresh", headers=h)
    assert bad.status_code == 503 and bad.json()["code"] == "PROVIDER_UNAVAILABLE"
    assert "ISRIC SoilGrids" in bad.json()["message"]
    # the resolver falls back instead of failing the sync
    with fx.session() as s:
        ph = resolver.resolve_value(s, s.get(Field, fid), "soil_ph", date(2025, 9, 1), providers=_providers(soil=down()))
    assert ph.tier == 0 and "external source unavailable" in ph.note


# ------------------------------------------------------------------ Planetary Computer (Sentinel-2 / Landsat)
BOX = {"type": "Polygon", "coordinates": [[[75.6985, 12.3985], [75.7015, 12.3985], [75.7015, 12.4015],
                                           [75.6985, 12.4015], [75.6985, 12.3985]]]}
S2_ITEMS = [  # recorded STAC search features (fields: datetime, eo:cloud_cover, s2:processing_baseline)
    {"id": "S2A_MSIL2A_20250105T052221_R062_T43PEP_20250107T095049",
     "properties": {"datetime": "2025-01-05T05:22:21.024000Z", "eo:cloud_cover": 0.001304,
                    "s2:processing_baseline": "05.11"}},
    {"id": "S2A_MSIL2A_20250105T052221_R062_T43PEP_20250105T082050",  # same acquisition, reprocessed
     "properties": {"datetime": "2025-01-05T05:22:21.024000Z", "eo:cloud_cover": 0.001543,
                    "s2:processing_baseline": "05.11"}},
    {"id": "S2B_MSIL2A_20250729T051649_R062_T43PEP_X",  # monsoon: the field is under cloud
     "properties": {"datetime": "2025-07-29T05:16:49.024000Z", "eo:cloud_cover": 73.4,
                    "s2:processing_baseline": "05.11"}},
    {"id": "S2C_MSIL2A_20250505T051711_R062_T43PEP_X",  # partly cloudy over the field
     "properties": {"datetime": "2025-05-05T05:17:11.025000Z", "eo:cloud_cover": 41.8,
                    "s2:processing_baseline": "05.11"}},
    {"id": "S2A_MSIL2A_20211201T052221_R062_T43PEP_OLD",  # before the +1000 offset
     "properties": {"datetime": "2021-12-01T05:22:21.024000Z", "eo:cloud_cover": 3.0,
                    "s2:processing_baseline": "03.01"}},
]
LANDSAT_ITEMS = [
    {"id": "LC09_L2SP_145051_20250328_02_T1", "properties": {"datetime": "2025-03-28T05:16:55.148459Z",
                                                            "eo:cloud_cover": 1.4, "platform": "landsat-9"}},
    {"id": "LC09_L2SP_145052_20250328_02_T1", "properties": {"datetime": "2025-03-28T05:17:19.056419Z",
                                                            "eo:cloud_cover": 3.31, "platform": "landsat-9"}},
    {"id": "LC08_L2SP_145052_20250710_02_T1", "properties": {"datetime": "2025-07-10T05:17:07Z",
                                                            "eo:cloud_cover": 55.17, "platform": "landsat-8"}},
    {"id": "LC08_L2SP_145052_BAD", "properties": {"datetime": "2025-08-11T05:17:07Z",
                                                 "eo:cloud_cover": 5.0, "platform": "landsat-8"}},
]
# per item: clear share, then the clear-masked index means (mean of index × clear), as the Data API returns them
S2_STATS = {
    "S2A_MSIL2A_20250105T052221_R062_T43PEP_20250107T095049": (1.0, 0.8518, 0.3420, -0.7510),
    "S2B_MSIL2A_20250729T051649_R062_T43PEP_X": (0.0, 0.0, 0.0, 0.0),
    "S2C_MSIL2A_20250505T051711_R062_T43PEP_X": (0.75, 0.6, 0.24, -0.54),
    "S2A_MSIL2A_20211201T052221_R062_T43PEP_OLD": (1.0, 0.70, 0.30, -0.65),
}
LANDSAT_STATS = {"LC09_L2SP_145051_20250328_02_T1": (1.0, 30.57), "LC08_L2SP_145052_20250710_02_T1": (0.0, 0.0),
                 "LC08_L2SP_145052_BAD": (1.0, -120.0)}


def _stat(mean):
    return {"min": mean, "max": mean, "mean": mean, "count": 1156.0, "std": 0.0, "median": mean,
            "valid_percent": 100.0}


def pc_handler(search_fail=(), stats_fail=()):
    def handler(r: httpx.Request) -> httpx.Response:
        if r.url.path.endswith("/search"):
            body = json.loads(r.content)
            coll = body["collections"][0]
            if coll in search_fail:
                return httpx.Response(503)
            lo, hi = (x[:10] for x in body["datetime"].split("/"))
            items = [i for i in (S2_ITEMS if coll == "sentinel-2-l2a" else LANDSAT_ITEMS)
                     if lo <= i["properties"]["datetime"][:10] <= hi]
            return httpx.Response(200, json={"type": "FeatureCollection", "features": items, "links": []})
        if r.url.path.endswith("/item/statistics"):
            item, exprs = r.url.params["item"], r.url.params["expression"].split(";")
            if item in stats_fail or r.url.params["collection"] in stats_fail:
                return httpx.Response(500)
            vals = S2_STATS.get(item) or LANDSAT_STATS[item]
            assert len(vals) == len(exprs)
            return httpx.Response(200, json={"type": "Feature", "properties": {
                "statistics": {e: _stat(v) for e, v in zip(exprs, vals, strict=True)}}})
        return httpx.Response(404)

    return Recorder(handler)


def pc_provider(rec) -> PlanetaryComputer:
    return PlanetaryComputer(PlanetaryComputerClient(http(rec, "Microsoft Planetary Computer")), workers=1)


def test_planetary_computer_indices_cloud_masking_offset_and_lst():
    rec = pc_handler()
    obs = pc_provider(rec).indices(FieldRef("f1", LAT, LON, "coffee", BOX), date(2021, 11, 1), date(2025, 9, 30))
    by = {(o.index_name, o.observed_on): o for o in obs}
    jan = date(2025, 1, 5)
    assert by[("ndvi", jan)].value == 0.8518 and by[("ndvi", jan)].cloud_pct == 0.0
    assert by[("ndmi", jan)].value == 0.342 and by[("ndwi", jan)].value == -0.751
    assert by[("ndvi", jan)].source == "sentinel-2-l2a (planetary computer)"
    # partly cloudy: mean over the clear pixels only, and the field's invalid share as cloud_pct
    may = date(2025, 5, 5)
    assert by[("ndvi", may)].value == 0.8 and by[("ndmi", may)].value == 0.32 and by[("ndvi", may)].cloud_pct == 25.0
    assert by[("ndvi", may)].cloud_pct <= CLOUD_LIMIT_PCT
    # fully clouded field: nothing to report (no guessed value)
    assert ("ndvi", date(2025, 7, 29)) not in by
    # one pass per day even when the archive has duplicates
    assert sum(1 for o in obs if o.index_name == "ndvi" and o.observed_on == jan) == 1
    assert not any(o.index_name == "lai" for o in obs)  # LAI is DERIVED by the platform from NDVI
    # LST: one per day, implausible values dropped, clouded field skipped
    lst = sorted((o.observed_on, o.value) for o in obs if o.index_name == "lst")
    assert lst == [(date(2025, 3, 28), 30.57)]
    # the +1000 reflectance offset is removed only for processing baseline >= 04.00
    sent = {r.url.params["item"]: r.url.params["expression"] for r in rec.requests if "statistics" in r.url.path}
    assert sent["S2A_MSIL2A_20250105T052221_R062_T43PEP_20250107T095049"] == ";".join(s2_expressions(True))
    assert "-2000" in sent["S2A_MSIL2A_20250105T052221_R062_T43PEP_20250107T095049"]
    assert "-2000" not in sent["S2A_MSIL2A_20211201T052221_R062_T43PEP_OLD"]
    assert "SCL==8" in sent["S2C_MSIL2A_20250505T051711_R062_T43PEP_X"]
    assert "lwir11*0.00341802+149.0-273.15" in sent["LC09_L2SP_145051_20250328_02_T1"]
    search = json.loads(next(r for r in rec.requests if r.url.path.endswith("/search")).content)
    assert search["intersects"] == BOX and search["query"]["eo:cloud_cover"]["lt"] == 80


def test_planetary_computer_partial_and_full_outage():
    # Sentinel-2 search down: Landsat still delivered
    obs = pc_provider(pc_handler(search_fail=("sentinel-2-l2a",))).indices(
        FieldRef("f1", LAT, LON, None, BOX), date(2025, 1, 1), date(2025, 9, 30))
    assert {o.index_name for o in obs} == {"lst"}
    # one scene failing is skipped, the others are kept
    obs = pc_provider(pc_handler(stats_fail=("S2C_MSIL2A_20250505T051711_R062_T43PEP_X",))).indices(
        FieldRef("f1", LAT, LON, None, BOX), date(2025, 1, 1), date(2025, 9, 30))
    assert date(2025, 5, 5) not in {o.observed_on for o in obs} and any(o.index_name == "ndvi" for o in obs)
    # everything down: provider unavailable
    with pytest.raises(ProviderUnavailable):
        pc_provider(pc_handler(search_fail=("sentinel-2-l2a", "landsat-c2-l2"))).indices(
            FieldRef("f1", LAT, LON, None, BOX), date(2025, 1, 1), date(2025, 9, 30))
    with pytest.raises(ProviderUnavailable):
        pc_provider(pc_handler(stats_fail=("sentinel-2-l2a", "landsat-c2-l2"))).indices(
            FieldRef("f1", LAT, LON, None, BOX), date(2025, 1, 1), date(2025, 9, 30))


def test_planetary_computer_without_boundary_uses_a_small_square():
    rec = pc_handler()
    pc_provider(rec).indices(FieldRef("f1", LAT, LON, None), date(2025, 1, 1), date(2025, 1, 31))
    geom = json.loads(rec.requests[0].content)["intersects"]
    xs = [p[0] for p in geom["coordinates"][0]]
    assert geom["type"] == "Polygon" and 0 < max(xs) - min(xs) < 0.001


def test_satellite_refresh_with_planetary_computer_derives_lai_and_keeps_wall(client, org, as_role, monkeypatch):
    w = fx.world(org, lat=LAT, lon=LON)
    register_satellite_provider("planetary_computer_recorded", lambda: pc_provider(pc_handler()))
    monkeypatch.setenv("VC_SATELLITE_PROVIDER", "planetary_computer_recorded")
    h = as_role("mrv_analyst")
    fid = w["field_ids"][0]
    r = client.post(f"/api/fields/{fid}/satellite/refresh", headers=h, json={"start": "2025-01-01", "end": "2025-09-30"})
    assert r.status_code == 201, r.text
    assert r.json()["provider"] == "planetary_computer"
    assert r.json()["written"] == {"ndvi": 2, "ndmi": 2, "ndwi": 2, "lst": 1, "lai": 2}
    lai = client.get(f"/api/fields/{fid}/satellite?index=lai", headers=h).json()
    assert lai["data_class"] == "DERIVED" and lai["credit_eligible"] is False and len(lai["points"]) == 2
    ndvi = client.get(f"/api/fields/{fid}/satellite?index=ndvi", headers=h).json()
    assert ndvi["data_class"] == "OBSERVED" and ndvi["credit_eligible"] is False

    register_satellite_provider("planetary_computer_down",
                                lambda: pc_provider(pc_handler(search_fail=("sentinel-2-l2a", "landsat-c2-l2"))))
    monkeypatch.setenv("VC_SATELLITE_PROVIDER", "planetary_computer_down")
    bad = client.post(f"/api/fields/{fid}/satellite/refresh", headers=h, json={"start": "2025-01-01", "end": "2025-09-30"})
    assert bad.status_code == 503 and bad.json()["code"] == "PROVIDER_UNAVAILABLE"
    assert "Planetary Computer" in bad.json()["message"]


# ------------------------------------------------------------------ Copernicus DEM (terrain)
def _npy(arr: np.ndarray) -> bytes:
    buf = io.BytesIO()
    np.save(buf, arr)
    return buf.getvalue()


def dem_handler(slope=0.10, sea=False):
    """A plane rising northwards by ``slope`` (m/m) on the requested window, plus an all-valid mask band."""

    def handler(r: httpx.Request) -> httpx.Response:
        if r.url.path.endswith("/search"):
            feats = [] if sea else [{"id": "Copernicus_DSM_COG_10_N12_00_E075_00_DEM", "properties": {}}]
            return httpx.Response(200, json={"features": feats, "links": []})
        if "/item/bbox/" in r.url.path:
            bbox, size = r.url.path.split("/item/bbox/")[1].split("/")
            minx, miny, maxx, maxy = map(float, bbox.split(","))
            wpx, hpx = map(int, size.removesuffix(".npy").split("x"))
            lat_c = maxy - (np.arange(hpx) + 0.5) * (maxy - miny) / hpx  # rows north -> south
            z = 500.0 + slope * (lat_c - 12.0) * 110_574.0
            data = np.repeat(z[:, None], wpx, axis=1).astype("float32")
            return httpx.Response(200, content=_npy(np.stack([data, np.full_like(data, 255.0)])))
        return httpx.Response(404)

    return Recorder(handler)


def test_dem_sample_bilinear_and_mask():
    data = np.array([[10.0, 20.0], [30.0, 40.0]], dtype="float32")
    arr = np.stack([data, np.full_like(data, 255.0)])
    bounds = (0.0, 0.0, 2.0, 2.0)  # pixel centres at x 0.5/1.5, y 1.5 (row 0) / 0.5 (row 1)
    assert sample(arr, bounds, 1.0, 1.0) == pytest.approx(25.0)
    assert sample(arr, bounds, 1.5, 0.5) == pytest.approx(10.0)
    assert sample(arr, bounds, 1.5, 1.0) == pytest.approx(15.0)
    arr[1][0, 0] = 0  # a masked pixel is left out, never read as a height
    assert sample(arr, bounds, 1.0, 1.0) == pytest.approx(30.0)
    with pytest.raises(ProviderUnavailable):
        sample(arr, bounds, 1.5, 0.5)
    arr[1][:] = 0
    with pytest.raises(ProviderUnavailable):
        sample(arr, bounds, 1.0, 1.0)


def test_copernicus_dem_terrain_slope_class_and_aspect():
    rec = dem_handler(slope=0.10)
    dem = CopernicusDEM(PlanetaryComputerClient(http(rec, "Copernicus DEM")))
    d = 0.003
    box = {"type": "Polygon", "coordinates": [[[LON - d, LAT - d], [LON + d, LAT - d], [LON + d, LAT + d],
                                               [LON - d, LAT + d], [LON - d, LAT - d]]]}
    res = terrain.compute_terrain(box, dem)
    assert res.slope_mean_pct == pytest.approx(10.0, abs=0.3)
    assert res.dominant_class == "strongly_sloping"
    assert res.aspect_deg == pytest.approx(180.0, abs=1.0)  # rising north = facing south
    assert res.elevation_mean_m == pytest.approx(500 + 0.10 * (LAT - 12.0) * 110_574.0, abs=2.0)
    windows = [r for r in rec.requests if "/item/bbox/" in r.url.path]
    assert 1 <= len(windows) <= 4 and all(r.url.path.endswith("/74x74.npy") for r in windows)
    assert sum(1 for r in rec.requests if r.url.path.endswith("/search")) == 1
    assert "copernicus" in dem.source_ref(LAT, LON) and "N12_E075" in dem.source_ref(LAT, LON)


def test_copernicus_dem_no_tile_is_not_available():
    dem = CopernicusDEM(PlanetaryComputerClient(http(dem_handler(sea=True), "Copernicus DEM")))
    with pytest.raises(ProviderUnavailable) as e:
        dem.elevation(LAT, LON)
    assert "no DEM tile" in e.value.reason and math.isfinite(e.value.status)
