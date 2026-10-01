"""The FarmFuture (Varsapradaya) integration, against responses recorded from their live API.

Every HTTP call goes through ``httpx.MockTransport``: nothing here reaches api.farmfuture.io (the recorded
phone number belongs to a real customer). Things pinned down, each of which was wrong at some point:

* a 400 is not an answer about the customer, and an outage is never stored as "not a member";
* a number must be in E.164 before it is sent;
* ``-1`` is their "no reading", not a reading;
* the tier comes from readings that arrived, never from their flags, and never from a forecast;
* the token and the phone number never appear in a log line.
"""

from __future__ import annotations

import copy
import logging
import uuid
from datetime import UTC, date, datetime, timedelta

import httpx
import pytest

from app.main import app
from app.modules.farmers.member_directory import (
    MemberDirectory, MemberDirectoryUnavailable, get_member_directory,
)
from app.modules.farmfuture import devices as ff_devices
from app.modules.farmfuture.client import FarmFutureClient, FarmFutureError
from app.modules.farmfuture.config import FarmFutureConfig
from app.modules.farmfuture.directory import FarmFutureDirectory
from app.modules.farmfuture.lookup import TIER_FULL, TIER_NONE, TIER_PARTIAL, lookup_customer, tier_for
from app.modules.farmfuture.parsing import FarmFutureFarm, SensorSnapshot
from app.modules.farmfuture.session import TokenStore, to_e164
from app.modules.farmfuture.trace import EMPTY, FAIL, YES, mask_phone, mask_token
from app.modules.supporting import providers as sp
from tests.conftest import login, make_org, make_user
from tests.fixtures.farmfuture_responses import (
    ESTATE_ID, ESTATES, FARM_ID, PHONE, SENSORS_HEALTHY, SENSORS_NONE, SENSORS_SENTINELS, TOKEN,
    VALIDATE_BAD_REQUEST, VALIDATE_KNOWN, VALIDATE_UNKNOWN, WEATHER_FORECAST, WEATHER_NONE, WEATHER_STATION,
)

CONFIG = FarmFutureConfig(base_url="https://farmfuture.test/api", timeout_s=5, token_ttl_s=900)
PHONE_DIGITS = "7799661222"


class Routes:
    """A fake FarmFuture: serves the recorded responses and remembers what it was asked."""

    def __init__(self, *, validate=VALIDATE_KNOWN, validate_status=200, estates=ESTATES, estates_status=200,
                 sensors=SENSORS_HEALTHY, sensors_status=200, weather=WEATHER_STATION, weather_status=200,
                 down=False):
        self.validate, self.validate_status = validate, validate_status
        self.estates, self.estates_status = estates, estates_status
        self.sensors, self.sensors_status = sensors, sensors_status
        self.weather, self.weather_status = weather, weather_status
        self.down = down
        self.bodies: list[str] = []
        self.weather_farms: list[str | None] = []
        self.auth: list[str | None] = []
        self.paths: list[str] = []

    def __call__(self, request: httpx.Request) -> httpx.Response:
        assert request.url.host == "farmfuture.test", "a test tried to reach a real host"
        if self.down:
            raise httpx.ConnectError("connection refused")
        path = request.url.path
        self.paths.append(path)
        self.auth.append(request.headers.get("Authorization"))
        if path.endswith("ValidateMobileNumber"):
            self.bodies.append(request.read().decode())
            return httpx.Response(self.validate_status, json=self.validate)
        if path.endswith("GetUserEstatesAndFarmsList"):
            return httpx.Response(self.estates_status, json=self.estates)
        if "GetAllSensorsLatestData" in path:
            return httpx.Response(self.sensors_status, json=self.sensors)
        if path.endswith("GetAllWeatherData"):
            self.weather_farms.append(request.url.params.get("farmId"))
            return httpx.Response(self.weather_status, json=self.weather)
        return httpx.Response(404, json={})

    @property
    def transport(self) -> httpx.MockTransport:
        return httpx.MockTransport(self)


def _client(routes: Routes) -> FarmFutureClient:
    return FarmFutureClient(CONFIG, transport=routes.transport)


def _directory(routes: Routes, tokens: TokenStore | None = None) -> FarmFutureDirectory:
    return FarmFutureDirectory(CONFIG, transport=routes.transport, tokens=tokens or TokenStore())


def _fresh(payload: dict, *, utc_field: str, when: datetime, local_offset=timedelta(0)) -> dict:
    out = copy.deepcopy(payload)
    for row in out["data"]:
        row[utc_field] = (when + local_offset).strftime("%Y-%m-%d %H:%M:%S")
        if utc_field == "utc_updatedat":
            row["updateAt"] = (when + timedelta(hours=5, minutes=30)).strftime("%Y-%m-%d %H:%M:%S")
    return out


# ================================================================== the 400 that lied
def test_a_bad_request_is_not_reported_as_not_a_customer():
    result = lookup_customer(PHONE, client=_client(Routes(validate=VALIDATE_BAD_REQUEST, validate_status=400)))
    assert result.lookup_failed is True and result.is_existing_customer is False
    call = result.trace.calls[0]
    assert call.data == FAIL
    assert "not a FarmFuture customer" not in call.detail
    assert "phoneNumber" in call.detail
    assert "UNKNOWN" in result.summary()


def test_a_bad_request_raises_rather_than_returning_none():
    with pytest.raises(FarmFutureError) as exc:
        _client(Routes(validate=VALIDATE_BAD_REQUEST, validate_status=400)).validate_mobile_number(PHONE)
    assert "400" in str(exc.value) and exc.value.status == 400


def test_an_outage_and_a_server_error_are_unknown_not_tier_none():
    for routes in (Routes(down=True), Routes(validate={"oops": 1}, validate_status=502)):
        result = lookup_customer(PHONE, client=_client(routes))
        assert result.lookup_failed is True
        assert result.trace.calls[0].data == FAIL
        assert "Not a Varsapradaya customer" not in result.summary()


# ================================================================== the number on the wire
@pytest.mark.parametrize("typed", ["7799661222", "917799661222", "+91 77996 61222", "+917799661222", "07799661222"])
def test_a_number_typed_any_way_goes_out_in_e164_under_their_field_name(typed):
    routes = Routes()
    lookup_customer(typed, client=_client(routes), with_readings=False)
    assert routes.bodies == ['{"phoneNumber":"+917799661222"}']
    assert to_e164(typed) == "+917799661222"


def test_an_explicit_country_code_is_not_overwritten_and_the_default_is_configurable():
    assert to_e164("+15550100") == "+15550100"
    assert to_e164("2079460958", "+44") == "+442079460958"
    # a ten-digit Indian number that happens to start with 91 is still given the country code
    assert to_e164("9123456789") == "+919123456789"


# ================================================================== the happy path
def test_a_known_customer_is_parsed_out_of_their_envelope():
    routes = Routes()
    result = lookup_customer(PHONE, client=_client(routes))
    assert result.is_existing_customer is True
    assert [c.data for c in result.trace.calls] == [YES, YES, YES, YES]
    farm = result.candidates[0].farm
    assert farm.farm_id == FARM_ID and farm.estate_id == ESTATE_ID
    assert farm.name == "Palthope estate"  # their trailing space removed
    assert farm.estate_name == "Palthope estate"
    assert farm.postal_code == "571250"
    assert farm.crops == ["Coffee-Arabica"]
    assert farm.plants_per_hectare == 4000
    assert farm.has_sensor and farm.has_weather and farm.subscription_active
    # the token is sent to the estate and readings calls, never in the URL
    assert routes.auth[1:] == ["Bearer " + TOKEN] * 3
    assert all(TOKEN not in p for p in routes.paths)


def test_an_unknown_number_is_their_answer_not_a_failure():
    result = lookup_customer(PHONE, client=_client(Routes(validate=VALIDATE_UNKNOWN)))
    assert result.is_existing_customer is False and result.lookup_failed is False
    assert result.trace.calls[0].data == EMPTY
    assert "does not exist" in result.trace.calls[0].detail
    assert len(result.trace.calls) == 1


@pytest.mark.parametrize("payload", [
    # flat list, alternative key spellings, nested envelope
    [{"estateGuid": "e-1", "name": "Hill ", "farmList": [{"farmGuid": "f-1", "title": "Upper ", "zipCode": "560001"}]}],
    {"result": {"estateList": [{"id": "e-1", "title": "Hill", "farmsList": [{"guid": "f-1", "name": "Upper"}]}]}},
    # farms at the top level, no estate wrapper
    {"data": [{"farmId": "f-1", "farmName": "Upper", "estateId": "e-1", "estateName": "Hill"}]},
])
def test_estates_are_parsed_tolerantly(payload):
    result = lookup_customer(PHONE, client=_client(Routes(estates=payload)), with_readings=False)
    farm = result.candidates[0].farm
    assert farm.farm_id == "f-1"
    assert farm.name == "Upper"
    assert farm.estate_name == "Hill"


def test_a_customer_with_no_estates_is_known_but_has_no_farms():
    result = lookup_customer(PHONE, client=_client(Routes(estates={"succeeded": True, "data": []})))
    assert result.is_existing_customer and not result.lookup_failed and result.candidates == []
    assert result.trace.calls[1].data == EMPTY
    assert any("holds no farms" in w for w in result.warnings)


def test_a_rejected_estate_list_is_not_reported_as_no_land():
    result = lookup_customer(PHONE, client=_client(Routes(estates={}, estates_status=403)))
    assert result.lookup_failed is True


def test_a_stale_cached_token_is_replaced_once():
    tokens = TokenStore()
    tokens.put(PHONE, "expired-token-xxxxxxxxxxxxxxxxxxxxxxxx")

    class Flaky(Routes):
        def __call__(self, request):
            if request.url.path.endswith("GetUserEstatesAndFarmsList") and \
                    request.headers.get("Authorization") != "Bearer " + TOKEN:
                return httpx.Response(401, json={})
            return super().__call__(request)

    routes = Flaky()
    result = lookup_customer(PHONE, client=_client(routes), tokens=tokens, with_readings=False)
    assert result.is_existing_customer and not result.lookup_failed
    assert result.candidates[0].farm.farm_id == FARM_ID
    assert tokens.get(PHONE) == TOKEN
    assert len(routes.bodies) == 1  # re-validated exactly once


def test_the_token_cache_expires_and_never_shows_tokens():
    tokens = TokenStore(ttl_s=900)
    tokens.put(PHONE, TOKEN, ttl_s=-1)  # an already-expired entry is not stored
    assert tokens.get(PHONE) is None
    tokens.put("+91 77996 61222", TOKEN)
    assert tokens.get("917799661222") == TOKEN  # keyed by digits
    assert TOKEN not in repr(tokens)
    tokens.drop(PHONE)
    assert tokens.get(PHONE) is None


# ================================================================== readings
def test_readings_are_read_out_of_the_nested_blocks():
    sensor = SensorSnapshot.parse(SENSORS_HEALTHY["data"][0])
    assert sensor.device_id == "A0B765293650" and sensor.device_type == "Soilsync Hub"
    assert sensor.observed_at == "2026-09-21 12:55:48" and sensor.observed_at_is_utc  # the UTC field
    assert sensor.latitude == 12.001157 and sensor.longitude == 76.056699
    assert sensor.parameters["soil_ph"] == pytest.approx(6.54, abs=0.01)
    assert sensor.parameters["soil_nitrogen"] == 360
    assert sensor.missing == []


def test_minus_one_is_dropped_rather_than_carried_as_a_reading():
    sensor = SensorSnapshot.parse(SENSORS_SENTINELS["data"][0])
    for gone in ("soil_ph", "soil_ec", "soil_temperature", "soil_moisture_1"):
        assert gone not in sensor.parameters
    assert sensor.parameters["soil_moisture_2"] == pytest.approx(25.5)
    assert "soil_ph" in sensor.missing
    assert sensor.parameters["device_voltage"] == 100  # device health, not a soil reading
    assert tier_for([sensor]) == TIER_PARTIAL  # nutrients and moisture 2 remain


def test_a_device_reporting_nothing_and_a_flag_without_readings_are_said_out_loud():
    notes = " ".join(lookup_customer(PHONE, client=_client(Routes(sensors=SENSORS_SENTINELS))).candidates[0].notes)
    assert "sent as -1" in notes and "treated as missing, not as data" in notes
    notes = " ".join(lookup_customer(PHONE, client=_client(Routes(sensors=SENSORS_NONE, weather=WEATHER_NONE)))
                     .candidates[0].notes)
    assert "flags this farm as having a sensor, but no readings came back" in notes
    assert "flags this farm as having weather, but no station readings" in notes


def test_the_weather_call_is_keyed_by_a_query_parameter():
    routes = Routes()
    lookup_customer(PHONE, client=_client(routes))
    assert routes.weather_farms == [FARM_ID]


def test_a_station_is_parsed_from_its_flat_fields():
    station = SensorSnapshot.parse_weather(WEATHER_STATION["data"][0])
    assert station.kind == "weather" and station.device_id == "78421CA2A790"
    assert station.parameters["air_temperature"] == 26.4
    assert station.parameters["relative_humidity"] == 78.9
    assert station.parameters["rain_mm"] == 0
    assert station.text_values == {"wind_direction": "S"} and "wind_direction" not in station.parameters
    assert station.observed_at == "2026-09-28 14:30:47" and not station.observed_at_is_utc


def test_the_latest_only_limit_and_local_time_are_recorded():
    notes = " ".join(lookup_customer(PHONE, client=_client(Routes())).candidates[0].notes)
    assert "no history" in notes and "local time" in notes


# ================================================================== tiers
def test_tier_decision():
    soil = SensorSnapshot.parse(SENSORS_HEALTHY["data"][0])
    station = SensorSnapshot.parse_weather(WEATHER_STATION["data"][0])
    forecast = SensorSnapshot.parse_weather(WEATHER_FORECAST["data"][0])
    bare = SensorSnapshot.parse_weather({"macId": "x", "deviceName": "MicroClime", "lux": 900, "voltage": 100})
    assert tier_for([soil], [station]) == TIER_FULL
    assert tier_for([soil], []) == TIER_PARTIAL
    assert tier_for([], [station]) == TIER_PARTIAL
    assert tier_for([soil], [forecast]) == TIER_PARTIAL  # a predicted rainfall is not a measured one
    assert tier_for([soil], [bare]) == TIER_PARTIAL  # light and battery alone are not weather
    # flags say sensor + weather, but nothing arrived: none
    farm = FarmFutureFarm.parse(ESTATES["data"][0]["farms"][0])
    assert farm.has_sensor and farm.has_weather
    assert tier_for([], []) == TIER_NONE


def test_overall_tier_and_a_failed_readings_call():
    assert lookup_customer(PHONE, client=_client(Routes())).tier == TIER_FULL
    result = lookup_customer(PHONE, client=_client(Routes(weather={}, weather_status=400)))
    assert result.tier == TIER_PARTIAL and not result.lookup_failed
    c = result.candidates[0]
    assert c.readings_incomplete and any("Weather station call failed" in n for n in c.notes)


# ================================================================== masking
def test_the_number_and_the_token_never_appear_in_logs_or_the_trace(caplog):
    client = _client(Routes())
    with caplog.at_level(logging.DEBUG):
        lookup_customer(PHONE, client=client)
        lookup_customer(PHONE, client=_client(Routes(validate=VALIDATE_BAD_REQUEST, validate_status=400)))
        lookup_customer(PHONE, client=_client(Routes(down=True)))
    text = "\n".join(r.getMessage() for r in caplog.records) + client.trace.table()
    assert PHONE_DIGITS not in text and TOKEN not in text
    assert mask_phone(PHONE) == "+9177****1222" and mask_phone(PHONE) in text
    assert mask_token(TOKEN) in text
    ff_lines = [r for r in caplog.records if r.name == "vcarbon.farmfuture"]
    assert len(ff_lines) == 4 + 1 + 1  # each call logged once, with its final verdict


# ================================================================== directory
def test_farmfuture_directory_known_member():
    rec = _directory(Routes()).lookup("+917799661222")
    assert rec.is_member and rec.source == "farmfuture" and rec.member_id == "FF-917799661222"
    assert rec.tier == "full"
    f = rec.farms[0]
    assert f.external_farm_id == FARM_ID and f.name == "Palthope estate" and f.estate_name == "Palthope estate"
    assert f.postal_code == "571250" and f.crops == ["Coffee-Arabica"] and f.plants_per_hectare == 4000
    assert f.has_soilsync and f.has_microclime and f.has_sensor and f.has_weather and f.subscription_active
    assert f.tier == "full" and any("no history" in n for n in f.notes)


def test_farmfuture_directory_partial_and_none_tiers():
    rec = _directory(Routes(weather=WEATHER_FORECAST)).lookup(PHONE)
    assert rec.farms[0].tier == "partial" and rec.farms[0].has_soilsync and not rec.farms[0].has_microclime
    rec = _directory(Routes(sensors=SENSORS_NONE, weather=WEATHER_NONE)).lookup(PHONE)
    assert rec.tier == "none" and not rec.farms[0].has_soilsync and rec.farms[0].has_sensor


def test_farmfuture_directory_not_a_member_vs_unavailable():
    rec = _directory(Routes(validate=VALIDATE_UNKNOWN)).lookup(PHONE)
    assert rec.is_member is False and rec.member_id is None and rec.farms == []
    for routes in (Routes(down=True), Routes(validate=VALIDATE_BAD_REQUEST, validate_status=400)):
        with pytest.raises(MemberDirectoryUnavailable) as exc:
            _directory(routes).lookup(PHONE)
        assert exc.value.status == 503 and exc.value.code == "MEMBER_DIRECTORY_UNAVAILABLE"
        assert PHONE_DIGITS not in str(exc.value.details)


def test_directory_is_chosen_by_setting(monkeypatch):
    from app.core.config import get_settings

    s = get_settings()
    monkeypatch.setattr(s, "vc_member_directory", "simulated")
    assert isinstance(get_member_directory(), MemberDirectory)
    monkeypatch.setattr(s, "vc_member_directory", "farmfuture")
    assert isinstance(get_member_directory(), FarmFutureDirectory)
    monkeypatch.setattr(s, "vc_member_directory", "nonsense")
    with pytest.raises(MemberDirectoryUnavailable):
        get_member_directory()


# ================================================================== API: lookup and import
@pytest.fixture()
def use_directory():
    def _use(directory):
        app.dependency_overrides[get_member_directory] = lambda: directory
    yield _use
    app.dependency_overrides.pop(get_member_directory, None)


def _farmer(client, h, phone=PHONE_DIGITS):
    r = client.post("/api/farmers", headers=h, json={"full_name": "Palthope Owner", "phone": phone})
    assert r.status_code == 201, r.text
    return r.json()


def _link(client, h, farmer):
    r = client.post("/api/farmers/member-lookup", headers=h, json={"phone": farmer["phone"], "farmer_id": farmer["id"]})
    assert r.status_code == 200, r.text
    return r.json()


def test_member_lookup_api_returns_the_rich_farm_list(client, as_role, use_directory):
    use_directory(_directory(Routes()))
    h = as_role("programme_admin")
    body = client.post("/api/farmers/member-lookup", headers=h, json={"phone": PHONE_DIGITS}).json()
    assert body["is_member"] and body["source"] == "farmfuture" and body["tier"] == "full"
    farm = body["farms"][0]
    assert farm["external_farm_id"] == FARM_ID and farm["estate_name"] == "Palthope estate"
    assert farm["crops"] == ["Coffee-Arabica"] and farm["tier"] == "full" and farm["imported_farm_id"] is None


def test_member_lookup_api_unavailable_is_503_and_nothing_is_stored(client, as_role, use_directory):
    h = as_role("programme_admin")
    farmer = _farmer(client, h)
    use_directory(_directory(Routes(down=True)))
    r = client.post("/api/farmers/member-lookup", headers=h, json={"phone": farmer["phone"], "farmer_id": farmer["id"]})
    assert r.status_code == 503
    assert r.json()["code"] == "MEMBER_DIRECTORY_UNAVAILABLE" and set(r.json()) == {"code", "message", "details"}
    assert client.get(f"/api/farmers/{farmer['id']}", headers=h).json()["member_id"] is None
    assert not any(a["action"] == "farmer.link_member" for a in client.get("/api/audit", headers=h).json())
    # a 400 from their validator is also "unavailable", never NOT_A_MEMBER
    use_directory(_directory(Routes(validate=VALIDATE_BAD_REQUEST, validate_status=400)))
    r = client.post("/api/farmers/member-lookup", headers=h, json={"phone": farmer["phone"], "farmer_id": farmer["id"]})
    assert r.status_code == 503
    # their real "no" is a normal answer
    use_directory(_directory(Routes(validate=VALIDATE_UNKNOWN)))
    r = client.post("/api/farmers/member-lookup", headers=h, json={"phone": farmer["phone"]})
    assert r.status_code == 200 and r.json()["is_member"] is False
    r = client.post("/api/farmers/member-lookup", headers=h, json={"phone": farmer["phone"], "farmer_id": farmer["id"]})
    assert r.status_code == 422 and r.json()["code"] == "NOT_A_MEMBER"


def test_import_member_farms_is_idempotent_and_audited(client, as_role, use_directory):
    use_directory(_directory(Routes()))
    h = as_role("programme_admin")
    farmer = _farmer(client, h)
    assert _link(client, h, farmer)["linked_farmer_id"] == farmer["id"]
    url = f"/api/farmers/{farmer['id']}/import-member-farms"
    r = client.post(url, headers=h, json={"external_farm_ids": [FARM_ID]})
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["fields_created"] == 0 and "no fields were created" in body["note"]
    assert body["skipped"] == [] and len(body["created"]) == 1
    made = body["created"][0]
    assert made["name"] == "Palthope estate" and made["external_farm_id"] == FARM_ID and made["postal_code"] == "571250"
    assert "Palthope estate" in made["notes"] and "Coffee-Arabica" in made["notes"]
    farm = client.get(f"/api/farms/{made['id']}", headers=h).json()
    assert farm["farmer_id"] == farmer["id"] and farm["postal_code"] == "571250" and "Estate:" in farm["notes"]
    # again: skipped, nothing new
    again = client.post(url, headers=h, json={"external_farm_ids": [FARM_ID, FARM_ID]}).json()
    assert again["created"] == [] and again["skipped"][0]["farm_id"] == made["id"]
    assert again["skipped"][0]["reason"] == "Already imported."
    assert len(client.get(f"/api/farms?farmer_id={farmer['id']}", headers=h).json()) == 1
    assert any(a["action"] == "farm.import_member" for a in client.get("/api/audit", headers=h).json())
    # the lookup now says it is imported
    look = client.post("/api/farmers/member-lookup", headers=h, json={"phone": farmer["phone"]}).json()
    assert look["farms"][0]["imported_farm_id"] == made["id"]
    # a hand-made duplicate is refused with a clear message
    dup = client.post("/api/farms", headers=h, json={"farmer_id": farmer["id"], "name": "Copy", "external_farm_id": FARM_ID})
    assert dup.status_code == 409 and dup.json()["code"] == "DUPLICATE_MEMBER_FARM"


def test_import_member_farms_rules(client, as_role, use_directory):
    use_directory(_directory(Routes()))
    h = as_role("programme_admin")
    farmer = _farmer(client, h)
    url = f"/api/farmers/{farmer['id']}/import-member-farms"
    r = client.post(url, headers=h, json={"external_farm_ids": [FARM_ID]})
    assert r.status_code == 422 and r.json()["code"] == "NOT_LINKED_MEMBER"
    _link(client, h, farmer)
    r = client.post(url, headers=h, json={"external_farm_ids": ["not-their-farm"]})
    assert r.status_code == 422 and r.json()["code"] == "UNKNOWN_MEMBER_FARM"
    assert client.post(url, headers=h, json={"external_farm_ids": []}).status_code == 422
    use_directory(_directory(Routes(down=True)))
    r = client.post(url, headers=h, json={"external_farm_ids": [FARM_ID]})
    assert r.status_code == 503 and r.json()["code"] == "MEMBER_DIRECTORY_UNAVAILABLE"
    assert client.get(f"/api/farms?farmer_id={farmer['id']}", headers=h).json() == []


def test_import_member_farms_tenancy_and_permission(client, as_role, use_directory):
    use_directory(_directory(Routes()))
    h = as_role("programme_admin")
    farmer = _farmer(client, h)
    _link(client, h, farmer)
    url = f"/api/farmers/{farmer['id']}/import-member-farms"
    other = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.post(url, headers=other, json={"external_farm_ids": [FARM_ID]}).status_code == 404
    for role in ("field_collector", "mrv_analyst", "verifier", "farmer"):
        assert client.post(url, headers=as_role(role), json={"external_farm_ids": [FARM_ID]}).status_code == 403, role
    assert client.get(f"/api/farms?farmer_id={farmer['id']}", headers=h).json() == []


def test_import_works_with_the_simulated_directory(client, as_role):
    h = as_role("programme_admin")
    farmer = _farmer(client, h, phone="9812345670")
    look = _link(client, h, farmer)
    assert look["source"] == "simulated"
    ids = [f["external_farm_id"] for f in look["farms"]]
    body = client.post(f"/api/farmers/{farmer['id']}/import-member-farms", headers=h,
                       json={"external_farm_ids": ids}).json()
    assert [c["external_farm_id"] for c in body["created"]] == ids


# ================================================================== API: devices
@pytest.fixture()
def ff_devices_provider(monkeypatch):
    """Selects ``VC_DEVICE_PROVIDER=farmfuture`` with a fake FarmFuture behind it."""
    state = {"routes": Routes()}
    tokens = TokenStore()
    monkeypatch.setenv("VC_DEVICE_PROVIDER", "farmfuture")
    monkeypatch.setitem(sp._DEVICE, "farmfuture", lambda: ff_devices.FarmFutureDeviceProvider(
        CONFIG, transport=state["routes"].transport, tokens=tokens))
    return state


def _imported_farm(client, h, use_directory):
    use_directory(_directory(Routes()))
    farmer = _farmer(client, h)
    _link(client, h, farmer)
    made = client.post(f"/api/farmers/{farmer['id']}/import-member-farms", headers=h,
                       json={"external_farm_ids": [FARM_ID]}).json()["created"][0]
    return farmer, made


def test_device_refresh_registers_and_updates_devices(client, as_role, use_directory, ff_devices_provider, caplog):
    h = as_role("programme_admin")
    _, farm = _imported_farm(client, h, use_directory)
    now = datetime.now(UTC).replace(microsecond=0)
    fresh_soil = _fresh(SENSORS_HEALTHY, utc_field="utc_updatedat", when=now - timedelta(hours=3))
    old_weather = _fresh(WEATHER_STATION, utc_field="updateAt", when=now - timedelta(days=5),
                         local_offset=timedelta(hours=5, minutes=30))
    ff_devices_provider["routes"] = Routes(sensors=fresh_soil, weather=old_weather)
    url = f"/api/farms/{farm['id']}/devices/refresh"
    with caplog.at_level(logging.DEBUG):
        r = client.post(url, headers=h)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["registered"] == 2 and body["updated"] == 0 and body["tier"] == "full" and body["latest_only"]
    assert "tier 2 / 3" in body["history_note"]
    by_kind = {d["kind"]: d for d in body["devices"]}
    soil, station = by_kind["soilsync"], by_kind["microclime"]
    assert soil["external_id"] == "A0B765293650" and soil["status"] == "online"
    assert station["external_id"] == "78421CA2A790" and station["status"] == "offline"
    # local station time read as UTC+05:30, measured from the soil row
    assert station["last_seen_at"].startswith((now - timedelta(days=5)).strftime("%Y-%m-%dT%H:%M"))
    values = {x["parameter"]: x for x in soil["readings"]}
    assert values["soil_ph"]["value"] == pytest.approx(6.54, abs=0.01)
    assert values["soil_ec_ds_m"]["value"] == pytest.approx(0.039)  # 39 µS/cm
    assert values["soil_temp_c"]["data_class"] == "MEASURED" and "no history" in values["soil_temp_c"]["note"]
    assert "soil_moisture_20cm_pct" not in values  # their probe reports no depth: not mapped
    assert {x["parameter"] for x in station["readings"]} >= {"air_temp_c", "rel_humidity_pct", "rain_mm", "wind_m_s"}

    devs = {d["external_id"]: d for d in client.get("/api/devices", headers=h).json()}
    assert devs["A0B765293650"]["farm_id"] == farm["id"] and devs["A0B765293650"]["latitude"] == 12.001157
    assert "soil_ph" in devs["A0B765293650"]["parameters"]
    assert devs["A0B765293650"]["latest_readings"]["data_class"] == "MEASURED"
    audits = [a["action"] for a in client.get("/api/audit", headers=h).json()]
    assert audits.count("device.import_member") == 2

    # second refresh updates in place
    again = client.post(url, headers=h).json()
    assert again["registered"] == 0 and again["updated"] == 2
    assert len(client.get("/api/devices", headers=h).json()) == 2
    assert "device.refresh_member" in [a["action"] for a in client.get("/api/audit", headers=h).json()]

    text = "\n".join(rec.getMessage() for rec in caplog.records)
    assert PHONE_DIGITS not in text and TOKEN not in text


def test_device_refresh_daily_series_falls_back_and_latest_is_measured(client, as_role, use_directory,
                                                                        ff_devices_provider):
    from app.core import geo
    from app.core.db import session_factory
    from app.modules.land.models import Field
    from app.modules.supporting import resolver

    h = as_role("programme_admin")
    client.post("/api/catalogue/install-defaults", headers=h)
    _, farm = _imported_farm(client, h, use_directory)
    fld = client.post("/api/fields", headers=h, json={
        "farm_id": farm["id"], "name": "Block A", "boundary": geo.square(12.0012, 76.0567, 100),
        "crop_code": "coffee", "crop_attributes": {"variety": "arabica"}})
    assert fld.status_code == 201, fld.text
    fld = fld.json()
    now = datetime.now(UTC).replace(microsecond=0)
    ff_devices_provider["routes"] = Routes(
        sensors=_fresh(SENSORS_HEALTHY, utc_field="utc_updatedat", when=now - timedelta(hours=1)))
    assert client.post(f"/api/farms/{farm['id']}/devices/refresh", headers=h).status_code == 200

    with session_factory()() as db:
        f = db.get(Field, uuid.UUID(fld["id"]))
        providers = sp.Providers(device=sp.get_providers().device, weather=sp.SimulatedNasaPower(),
                                 soil=sp.SimulatedSoilGrids())
        end = date.today() - timedelta(days=1)
        series = resolver.resolve_series(db, f, "soil_temp_c", end - timedelta(days=6), end, providers=providers)
        # the device is tier 1 for this field, but has no history: every day comes from elsewhere
        assert all(r.tier != 1 for r in series)
        assert {r.tier for r in series} <= {2, 3}
    latest = client.get(f"/api/fields/{fld['id']}/supporting/latest", headers=h).json()
    assert latest["latest_only"] is True
    temp = next(v for v in latest["values"] if v["parameter"] == "soil_temp_c")
    assert temp["tier"] == 1 and temp["data_class"] == "MEASURED" and temp["value"] == pytest.approx(23.4, abs=0.01)


def test_device_refresh_rules(client, as_role, use_directory, ff_devices_provider):
    h = as_role("programme_admin")
    farmer, farm = _imported_farm(client, h, use_directory)
    url = f"/api/farms/{farm['id']}/devices/refresh"
    plain = client.post("/api/farms", headers=h, json={"farmer_id": farmer["id"], "name": "Own farm"}).json()
    r = client.post(f"/api/farms/{plain['id']}/devices/refresh", headers=h)
    assert r.status_code == 422 and r.json()["code"] == "NOT_A_MEMBER_FARM"
    # outage: 503, nothing registered
    ff_devices_provider["routes"] = Routes(down=True)
    r = client.post(url, headers=h)
    assert r.status_code == 503 and r.json()["code"] == "MEMBER_DIRECTORY_UNAVAILABLE"
    assert client.get("/api/devices", headers=h).json() == []
    # not (any longer) a customer
    ff_devices_provider["routes"] = Routes(validate=VALIDATE_UNKNOWN)
    r = client.post(url, headers=h)
    assert r.status_code == 422 and r.json()["code"] == "NOT_A_MEMBER"
    # tenancy and permission
    ff_devices_provider["routes"] = Routes()
    other = login(client, make_user(make_org("Rival"), "programme_admin"))
    assert client.post(url, headers=other).status_code == 404
    for role in ("verifier", "farmer", "field_collector"):
        assert client.post(url, headers=as_role(role)).status_code == 403, role
    assert client.get("/api/devices", headers=h).json() == []


def test_device_refresh_needs_the_farmfuture_provider(client, as_role, use_directory, monkeypatch):
    monkeypatch.setenv("VC_DEVICE_PROVIDER", "simulated")
    h = as_role("programme_admin")
    _, farm = _imported_farm(client, h, use_directory)
    r = client.post(f"/api/farms/{farm['id']}/devices/refresh", headers=h)
    assert r.status_code == 409 and r.json()["code"] == "DEVICE_PROVIDER_NOT_FARMFUTURE"


def test_the_farmfuture_device_provider_daily_comes_only_from_kept_readings(client):
    """No call to their API: the daily series is built from readings already kept (none here)."""
    provider = ff_devices.FarmFutureDeviceProvider(CONFIG, transport=Routes().transport, tokens=TokenStore())
    ref = sp.DeviceRef("A0B765293650", "soilsync", 12.0, 76.0, "online", ("soil_ph",))
    assert provider.daily(ref, "soil_ph", date(2026, 9, 1), date(2026, 9, 30)) == {}
    assert "latest value only" in provider.source_ref(ref)


# ================================================================== bring-up script (offline)
def test_check_script_runs_read_only_and_masks(monkeypatch, capsys):
    from scripts import farmfuture_check

    monkeypatch.setattr(farmfuture_check, "configure_logging", lambda verbose: None)  # keep pytest's handlers
    routes = Routes()
    monkeypatch.setattr(farmfuture_check, "FarmFutureClient", lambda config: FarmFutureClient(
        CONFIG, transport=routes.transport))
    assert farmfuture_check.main([PHONE, "--keys"]) == 0
    out = capsys.readouterr().out
    assert "OK -- every endpoint returned data." in out and FARM_ID in out
    assert PHONE_DIGITS not in out and TOKEN not in out
    assert all(p.endswith(("ValidateMobileNumber", "GetUserEstatesAndFarmsList", "GetAllWeatherData"))
               or "GetAllSensorsLatestData" in p for p in routes.paths)
    monkeypatch.setattr(farmfuture_check, "FarmFutureClient", lambda config: FarmFutureClient(
        CONFIG, transport=Routes(down=True).transport))
    assert farmfuture_check.main([PHONE]) == 1


def test_device_provider_partial_failure_and_stale_token():
    tokens = TokenStore()
    provider = ff_devices.FarmFutureDeviceProvider(CONFIG, transport=Routes(weather={}, weather_status=500).transport,
                                                   tokens=tokens)
    latest = provider.latest_for_farm(FARM_ID, PHONE)
    assert latest.readings_incomplete and latest.sensors and not latest.stations and latest.tier == "partial"
    assert tokens.get(PHONE) == TOKEN  # cached, in memory only

    class Expired(Routes):
        def __call__(self, request):
            if "GetAll" in request.url.path and request.headers.get("Authorization") != "Bearer " + TOKEN:
                return httpx.Response(401, json={})
            return super().__call__(request)

    tokens.put(PHONE, "expired-token-xxxxxxxxxxxxxxxxxxxxxxxx")
    routes = Expired()
    provider = ff_devices.FarmFutureDeviceProvider(CONFIG, transport=routes.transport, tokens=tokens)
    latest = provider.latest_for_farm(FARM_ID, PHONE)
    assert latest.sensors and latest.stations and len(routes.bodies) == 1
    with pytest.raises(FarmFutureError):
        ff_devices.FarmFutureDeviceProvider(CONFIG, transport=Routes(sensors={}, sensors_status=503, weather={},
                                            weather_status=503).transport, tokens=TokenStore()).latest_for_farm(
            FARM_ID, PHONE)


# ================================================================== device history (kept readings)
def test_kept_readings_become_the_fields_tier1_daily_series(client, as_role, use_directory, ff_devices_provider):
    """Their API gives only the latest value; each fetched reading is kept, so the farm's own device supplies
    the daily series for the days it reported, and other days fall back (tier 2 / 3)."""
    from app.core import geo
    from app.core.db import session_factory
    from app.modules.land.models import Field
    from app.modules.supporting import resolver
    from app.modules.supporting.models import DeviceReading

    h = as_role("programme_admin")
    client.post("/api/catalogue/install-defaults", headers=h)
    _, farm = _imported_farm(client, h, use_directory)
    fld = client.post("/api/fields", headers=h, json={
        "farm_id": farm["id"], "name": "Block A", "boundary": geo.square(12.0012, 76.0567, 100),
        "crop_code": "coffee", "crop_attributes": {"variety": "arabica"}}).json()
    now = datetime.now(UTC).replace(hour=6, minute=0, second=0, microsecond=0)
    url = f"/api/farms/{farm['id']}/devices/refresh"
    for days_ago in (3, 2):  # two readings on two different days (06:00 UTC = 11:30 local)
        ff_devices_provider["routes"] = Routes(
            sensors=_fresh(SENSORS_HEALTHY, utc_field="utc_updatedat", when=now - timedelta(days=days_ago)))
        r = client.post(url, headers=h).json()
        assert r["readings_kept"] > 0 and "tier 1" in r["history_note"]
    again = client.post(url, headers=h).json()  # the same latest reading again: nothing duplicated
    assert again["readings_kept"] == 0
    with session_factory()() as db:
        assert db.query(DeviceReading).filter(DeviceReading.parameter == "soil_temp_c").count() == 2
        f = db.get(Field, uuid.UUID(fld["id"]))
        providers = sp.Providers(device=sp.get_providers().device, weather=sp.SimulatedNasaPower(),
                                 soil=sp.SimulatedSoilGrids())
        end = now.date() - timedelta(days=1)
        series = {r.observed_on: r for r in resolver.resolve_series(
            db, f, "soil_temp_c", end - timedelta(days=3), end, providers=providers)}
    for days_ago in (3, 2):
        day = (now - timedelta(days=days_ago)).date()
        assert series[day].tier == 1 and series[day].data_class == "MEASURED"
        assert series[day].value == pytest.approx(23.4, abs=0.01)
    assert series[end].tier != 1 and series[end - timedelta(days=3)].tier != 1  # no reading: falls back


def test_stored_daily_aggregates_per_day(client, as_role, use_directory, ff_devices_provider):
    from app.core.db import session_factory
    from app.modules.supporting.models import Device, DeviceReading

    h = as_role("programme_admin")
    _, farm = _imported_farm(client, h, use_directory)
    now = datetime.now(UTC).replace(hour=6, minute=0, second=0, microsecond=0)
    ff_devices_provider["routes"] = Routes(sensors=_fresh(SENSORS_HEALTHY, utc_field="utc_updatedat", when=now))
    client.post(f"/api/farms/{farm['id']}/devices/refresh", headers=h)
    day = date(2026, 1, 10)
    with session_factory()() as db:
        dev = db.query(Device).filter(Device.kind == "soilsync").one()
        for hour, temp, rain in ((6, 20.0, 1.0), (12, 24.0, 4.0)):
            for param, v in (("soil_temp_c", temp), ("rain_mm", rain)):
                db.add(DeviceReading(org_id=dev.org_id, device_id=dev.id, parameter=param, value=v, unit="",
                                     observed_at=datetime(2026, 1, 10, hour, tzinfo=UTC), observed_on=day))
        db.commit()
        ext = dev.external_id
    assert ff_devices.stored_daily(ext, "soil_temp_c", day, day) == {day: pytest.approx(22.0)}  # mean
    assert ff_devices.stored_daily(ext, "rain_mm", day, day) == {day: pytest.approx(4.0)}  # largest of the day
    assert ff_devices.stored_daily("UNKNOWN", "soil_temp_c", day, day) == {}


def test_poll_reads_every_member_farm(client, as_role, use_directory, ff_devices_provider, monkeypatch):
    from app.modules.farmfuture import poller

    h = as_role("programme_admin")
    _, farm = _imported_farm(client, h, use_directory)
    now = datetime.now(UTC).replace(microsecond=0)
    ff_devices_provider["routes"] = Routes(
        sensors=_fresh(SENSORS_HEALTHY, utc_field="utc_updatedat", when=now - timedelta(hours=2)))
    r = client.post("/api/varsapradaya/devices/poll", headers=h)
    assert r.status_code == 200, r.text
    assert r.json()["farms"] == 1 and r.json()["ok"] == 1 and r.json()["readings_kept"] > 0
    assert client.post("/api/varsapradaya/devices/poll", headers=as_role("field_collector")).status_code == 403
    ff_devices_provider["routes"] = Routes(
        sensors=_fresh(SENSORS_HEALTHY, utc_field="utc_updatedat", when=now - timedelta(hours=1)))
    total = poller.poll_all()  # the scheduled round, acting as the organisation's administrator
    assert total["farms"] == 1 and total["ok"] == 1 and total["failed"] == 0 and total["readings_kept"] > 0
    monkeypatch.setenv("VC_DEVICE_PROVIDER", "simulated")
    assert "skipped" in poller.poll_all()
    assert client.post("/api/varsapradaya/devices/poll", headers=h).status_code == 409
