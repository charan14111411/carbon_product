"""The four FarmFuture calls, ported from the first (live-tested) integration.

Flow (their design, not ours)::

    ValidateMobileNumber(phone)        -> token at data.token (200 without one = not a customer)
    GetUserEstatesAndFarmsList(token)  -> estates, each with farms
    GetAllSensorsLatestData/{farm_id}  -> latest value per SoilSync probe on that farm
    GetAllWeatherData?farmId=...       -> latest value per MicroClime station on that farm

Things worth stating where they will be read:

* The token is derived from a farmer's phone number, so it is a personal credential. It is held in
  memory only and never written to the database or a log. If Varsapradaya can issue a service account,
  this class should move to it.
* A status of 400 or more from ``ValidateMobileNumber`` is **not** "not a customer". Reading it that
  way was the bug that reported a field-name mistake as a farmer who does not exist -- and stored it.
* The sensor and weather endpoints return the latest value only. They prove a device exists and is
  alive; they cannot supply the series a baseline needs.
"""

from __future__ import annotations

import time

import httpx

from app.modules.farmfuture.config import (
    ESTATES_AND_FARMS, SENSORS_LATEST, VALIDATE_MOBILE, WEATHER_LATEST, FarmFutureConfig,
)
from app.modules.farmfuture.parsing import FarmFutureEstate, FarmFutureFarm, SensorSnapshot, pick, rows
from app.modules.farmfuture.session import to_e164
from app.modules.farmfuture.trace import EMPTY, FAIL, YES, CallTrace, RunTrace, mask_phone, mask_token


class FarmFutureError(RuntimeError):
    """Their API could not be reached, or answered with an error status. Never an answer about a customer."""

    def __init__(self, message: str, status: int | None = None):
        super().__init__(message)
        self.status = status


class FarmFutureClient:
    def __init__(
        self,
        config: FarmFutureConfig | None = None,
        *,
        transport: httpx.BaseTransport | None = None,
        trace: RunTrace | None = None,
    ) -> None:
        self.config = config or FarmFutureConfig.from_settings()
        self.trace = trace or RunTrace()
        self._http = httpx.Client(
            base_url=self.config.base_url.rstrip("/"),
            timeout=self.config.timeout_s,
            verify=self.config.verify_tls,
            transport=transport,
            headers={"Accept": "application/json"},
        )

    def close(self) -> None:
        self._http.close()

    def __enter__(self) -> FarmFutureClient:
        return self

    def __exit__(self, *exc: object) -> None:
        self.close()

    def __repr__(self) -> str:
        return f"FarmFutureClient({self.config.base_url})"

    # ------------------------------------------------------------------ 1/4
    def validate_mobile_number(self, phone: str) -> str | None:
        """Their customer check. Returns a token, or ``None`` if the number is unknown to them.

        A number they do not hold is the *expected* answer for an outside customer, not an error.
        """
        # Their field is `phoneNumber` and the value must be E.164: anything else is answered with
        # HTTP 200 and "User does not exist", indistinguishable from an unknown customer.
        wire = to_e164(phone, self.config.country_code)
        masked = mask_phone(wire)
        payload, call = self._send("POST", VALIDATE_MOBILE, name="ValidateMobileNumber",
                                   json={"phoneNumber": wire}, detail="phone=" + masked)
        token = _token_from(payload)
        if token:
            call.data, call.count = YES, 1
            call.detail = f"phone={masked} token={mask_token(token)}"
        elif call.status is not None and call.status < 400:
            # A 200 without a token is their answer, not a failure: succeeded=false and a message.
            call.data = EMPTY
            call.detail = f"phone={masked} not a FarmFuture customer ({_message_from(payload)})"
        else:
            call.data = FAIL
            reason = _message_from(payload) or "no message"
            call.detail = f"phone={masked} rejected ({call.status}) -- {reason}. Not an answer about this customer."
            self.trace.settle(call)
            raise FarmFutureError(f"ValidateMobileNumber returned {call.status}: {reason}", call.status)
        self.trace.settle(call)
        return token

    # ------------------------------------------------------------------ 2/4
    def estates_and_farms(self, token: str) -> list[FarmFutureEstate]:
        """Their estates, each carrying the farm GUIDs we store as ``external_farm_id``."""
        payload, call = self._send("GET", ESTATES_AND_FARMS, name="GetUserEstatesAndFarmsList", token=token)
        estates = _parse_estates(payload)
        farm_count = sum(len(e.farms) for e in estates)
        if estates:
            call.data, call.count = YES, farm_count
            call.detail = f"{len(estates)} estate(s), {farm_count} farm(s)"
        elif call.status is not None and call.status < 400:
            call.data = EMPTY
            call.detail = "customer exists but holds no estates or farms"
        else:
            # 401/403 on a reused token. Saying "no farms" here is how an expired credential would be
            # recorded as a customer owning no land.
            call.detail = f"rejected ({call.status}) -- token stale or invalid"
            self.trace.settle(call)
            raise FarmFutureError(f"GetUserEstatesAndFarmsList returned {call.status}", call.status)
        self.trace.settle(call)
        return estates

    # ------------------------------------------------------------------ 3/4
    def sensors_latest(self, farm_id: str, token: str | None = None) -> list[SensorSnapshot]:
        """Latest value per SoilSync probe on one of *their* farms (keyed by their farm GUID)."""
        payload, call = self._send("GET", SENSORS_LATEST.format(farm_id=farm_id), name="GetAllSensorsLatestData",
                                   token=token)
        sensors = [SensorSnapshot.parse(r) for r in rows(payload, "sensors", "sensorData")]
        sensors = [s for s in sensors if s.device_id or s.parameters]
        short = farm_id[:8]
        if sensors:
            mapped = sum(len(s.parameters) for s in sensors)
            call.data, call.count = YES, len(sensors)
            call.detail = f"farm={short} {len(sensors)} sensor(s), {mapped} mapped value(s)"
        elif call.status is not None and call.status < 400:
            call.data = EMPTY
            call.detail = f"farm={short} no sensors -> fallback sources"
        else:
            call.detail = f"farm={short} rejected ({call.status}) -- not an absence"
            self.trace.settle(call)
            raise FarmFutureError(f"GetAllSensorsLatestData returned {call.status}", call.status)
        self.trace.settle(call)
        return sensors

    # ------------------------------------------------------------------ 4/4
    def weather_latest(self, farm_id: str, token: str | None = None) -> list[SensorSnapshot]:
        """Latest reading from each MicroClime station on one of their farms.

        ``GetAllSensorsLatestData`` returns soil probes and nothing else, so this is the only way to
        reach a station. The farm is a query parameter here, where the sensor call takes a path segment.
        """
        payload, call = self._send("GET", WEATHER_LATEST, name="GetAllWeatherData", token=token,
                                   params={"farmId": farm_id})
        stations = [SensorSnapshot.parse_weather(r) for r in rows(payload, "weather", "weatherData")]
        stations = [s for s in stations if s.device_id or s.parameters]
        short = farm_id[:8]
        if stations:
            measured = [s for s in stations if not s.is_forecast]
            mapped = sum(len(s.parameters) for s in measured)
            call.data, call.count = YES, len(stations)
            forecast = f", {len(stations) - len(measured)} forecast" if len(measured) != len(stations) else ""
            call.detail = f"farm={short} {len(stations)} station(s){forecast}, {mapped} measured value(s)"
        elif call.status is not None and call.status < 400:
            call.data = EMPTY
            call.detail = f"farm={short} no weather station -> gridded fallback"
        else:
            call.detail = f"farm={short} rejected ({call.status}) -- not an absence"
            self.trace.settle(call)
            raise FarmFutureError(f"GetAllWeatherData returned {call.status}", call.status)
        self.trace.settle(call)
        return stations

    # ------------------------------------------------------------------ transport
    def _send(self, method: str, path: str, *, name: str, token: str | None = None, detail: str = "", **kw):
        """Sends, times, parses and records one trace line whatever happens.

        A transport failure or a 5xx is traced and raised as ``FarmFutureError``: their platform being
        down must never look like a customer having no farms -- those lead to opposite decisions.
        """
        headers = {"Authorization": "Bearer " + token} if token else {}
        call = CallTrace(endpoint=name, detail=detail)
        started = time.monotonic()
        try:
            response = self._http.request(method, path, headers=headers, **kw)
        except httpx.HTTPError as exc:
            call.elapsed_s = time.monotonic() - started
            call.data = FAIL
            # The exception text can carry the URL; never the token (it is a header, not in the URL).
            call.detail = (detail + " " if detail else "") + f"unreachable -- {type(exc).__name__}"
            self.trace.settle(self.trace.add(call))
            raise FarmFutureError(f"{name} unreachable ({type(exc).__name__})") from None
        call.status = response.status_code
        call.elapsed_s = time.monotonic() - started
        if response.status_code >= 500:
            call.detail = (detail + " " if detail else "") + "server error"
            self.trace.settle(self.trace.add(call))
            raise FarmFutureError(f"{name} returned {response.status_code}", response.status_code)
        payload = _json_or_none(response)
        if payload is None and response.status_code < 400:
            call.detail = (detail + " " if detail else "") + "non-JSON body " + str(response.headers.get("content-type"))
        self.trace.add(call)
        return payload, call


def _str(value) -> str | None:
    return None if value in (None, "") else str(value)


def _json_or_none(response: httpx.Response):
    try:
        return response.json()
    except ValueError:
        return None


def _message_from(payload) -> str:
    """Their human-readable reason, wherever they put it this time.

    ``ValidateMobileNumber`` replies ``{"succeeded":false,"data":{"message":...}}`` on a rejected number
    and an RFC 9110 problem document on a bad request, with the useful part under ``errors``.
    """
    if not isinstance(payload, dict):
        return ""
    errors = pick(payload, "errors")
    if isinstance(errors, dict) and errors:
        field, problems = next(iter(errors.items()))
        first = problems[0] if isinstance(problems, list) and problems else problems
        return f"{field}: {first}"
    for key in ("message", "title", "detail", "error"):
        value = pick(payload, key)
        if isinstance(value, str) and value:
            return value.strip()
    for nested in ("data", "result", "response"):
        inner = pick(payload, nested)
        if isinstance(inner, dict):
            found = _message_from(inner)
            if found:
                return found
    return ""


def _token_from(payload) -> str | None:
    """Their token, which lives at ``data.token`` behind a ``succeeded`` flag."""
    if isinstance(payload, str) and len(payload) > 20:
        return payload
    if not isinstance(payload, dict):
        return None
    # succeeded=false is a definite "no", whatever else the body holds.
    if pick(payload, "succeeded") is False:
        return None
    token = pick(payload, "token", "accessToken", "access_token", "jwt", "bearerToken")
    if isinstance(token, str) and token:
        return token
    for nested in ("data", "result", "response"):
        inner = pick(payload, nested)
        if isinstance(inner, dict):
            found = _token_from(inner)
            if found:
                return found
    return None


def _parse_estates(payload) -> list[FarmFutureEstate]:
    estates: list[FarmFutureEstate] = []
    for row in rows(payload, "estates", "estateList", "userEstates"):
        estate_id = str(pick(row, "estateId", "estateGuid", "id", "guid", default=""))
        estate_name = pick(row, "estateName", "name", "title")
        farms = [FarmFutureFarm.parse(f, estate_id, estate_name) for f in rows(row, "farms", "farmList", "farmsList")]
        # A flat response -- farms at the top level, no estate wrapper -- is recognised by the farm keys.
        if not farms and pick(row, "farmId", "farmGuid", "farmName"):
            farms = [FarmFutureFarm.parse(row, estate_id, estate_name)]
        estates.append(FarmFutureEstate(
            estate_id=estate_id,
            name=(str(estate_name or "")).strip() or None,
            postal_code=_str(pick(row, "zipCode", "postalCode")),
            is_fpo=bool(pick(row, "isFpo", default=False)),
            farms=farms,
            raw=row,
        ))
    return estates
