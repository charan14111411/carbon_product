"""Responses recorded from the live FarmFuture API on 2026-09-28.

Trimmed, with the account's own identifiers kept because they are what the
calls are keyed by. These are the real shapes -- the envelope, the nesting and
the sentinel values -- so a test that passes here is testing the integration
against what their platform actually sends, not against what we assumed.

Ported unchanged from the first integration (organic_carbon/backend/tests/fixtures).
PHONE belongs to a real customer: tests serve these through ``httpx.MockTransport``
and must never send it to the live API.
"""

from __future__ import annotations

PHONE = "+917799661222"
FARM_ID = "0c1e6f77-9b1d-441e-bda5-6531d8724f48"
ESTATE_ID = "b2e3a2aa-3a6b-43fe-a4b8-bee5fa26ddf9"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.recorded.signature"

#: A number they hold. Note the envelope: the token is at ``data.token``.
VALIDATE_KNOWN = {
    "succeeded": True,
    "data": {
        "message": "User Already Exist.",
        "onBoardStatus": 1,
        "token": TOKEN,
    },
}

#: A number they do not hold -- HTTP 200, ``succeeded: false``.
#: A *badly formatted* number gets this same reply, which is why the number is
#: put in E.164 before it is sent.
VALIDATE_UNKNOWN = {
    "succeeded": False,
    "data": {"message": "User does not exist, please register."},
}

#: What a wrong field name gets: an ASP.NET problem document. This is the one
#: that was being reported as "not a FarmFuture customer".
VALIDATE_BAD_REQUEST = {
    "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
    "title": "One or more validation errors occurred.",
    "status": 400,
    "errors": {"phoneNumber": ["The phoneNumber field is required."]},
    "traceId": "00-50314f9522f26d9a013fc11e6211fec9-39bf81d9b0f84f85-01",
}

ESTATES = {
    "succeeded": True,
    "data": [
        {
            "estateId": ESTATE_ID,
            "estateName": "Palthope estate",
            "zipCode": "571250",
            "isFpo": False,
            "farms": [
                {
                    "farmId": FARM_ID,
                    # Trailing spaces are theirs, not a typo here.
                    "farmName": "Palthope estate ",
                    "postalCode": "571250",
                    "isOwnerEstate": False,
                    "cropIds": ["d1a2624a-408e-41ee-91f0-9b0003630baa"],
                    "crops": [
                        {
                            "id": "d1a2624a-408e-41ee-91f0-9b0003630baa",
                            "name": "Coffee-Arabica",
                        }
                    ],
                    "plantsPerHectare": 4000,
                    "role": 0,
                    "read": True,
                    "write": True,
                    "edit": True,
                    "flag": 0,
                    "sensor": True,
                    "weather": True,
                    "airQuality": False,
                    "rainSense": False,
                    "rain": False,
                    "moisture": False,
                    "isActiveSubscription": True,
                    "isSurveyForm": False,
                    "isAnalogWeather": False,
                }
            ],
        }
    ],
}

#: A healthy soil probe. Readings are nested, not at the top level.
SENSORS_HEALTHY = {
    "succeeded": True,
    "data": [
        {
            "tenantId": "d5806199-0f07-47e0-b41d-6a336c5fd283",
            "macId": "A0B765293650",
            "lat": 12.001157,
            "long": 76.056699,
            "deviceName": "Soilsync Hub",
            "updateAt": "2026-09-21 18:25:48",
            "utc_updatedat": "2026-09-21 12:55:48",
            "installationDate": "2025-06-16T18:14:34.289513Z",
            "crops": [],
            "soilProperties": {
                "electricalConductivity": 39,
                "humidity": 26.29999924,
                "ph": 6.540000140226044,
                "soilMoisturePercentage1": 26.29999924,
                "soilMoisturePercentage2": 23.79999924,
                "soilMoistureValue": 263,
                "temperature": 23.39999962,
                "voltage": 100,
            },
            "soilNutrients": {"nitrogen": 360, "phosphorous": 45, "potassium": 370},
            "extraParameters": {"lux": 0, "solarRadiation": 0},
            "addOnId": 0,
            "moistureThresholdsResponse": {
                "isNpkDisplayed": True,
                "displayMessage": "",
            },
        }
    ],
}

#: The same device with nothing to report. Their firmware sends -1, including
#: a pH of -1.84, which is not a pH.
SENSORS_SENTINELS = {
    "succeeded": True,
    "data": [
        {
            "tenantId": "205b4815-61cd-42ff-919c-be9917b95211",
            "macId": "3C8A1FAEC164",
            "lat": 11.99778,
            "long": 76.050937,
            "deviceName": "Farmfuture Soilsync",
            "updateAt": "2026-09-28 10:26:12",
            "utc_updatedat": "2026-09-28 04:56:12",
            "installationDate": "2025-06-20T10:12:42.497626Z",
            "crops": [],
            "soilProperties": {
                "electricalConductivity": -1,
                "humidity": -1,
                "ph": -1.8399999737739563,
                "soilMoisturePercentage1": -0.100000001,
                "soilMoisturePercentage2": 25.5,
                "soilMoistureValue": -1,
                "temperature": -1,
                "voltage": 100,
            },
            "soilNutrients": {"nitrogen": 237, "phosphorous": 23, "potassium": 165},
            "extraParameters": {"lux": 0, "solarRadiation": 0},
            "addOnId": 0,
        }
    ],
}

SENSORS_NONE: dict = {"succeeded": True, "data": []}

#: A MicroClime station, from ``GetAllWeatherData``. Note the shape: these
#: fields are flat, where the soil probe nests its readings -- and there is no
#: ``utc_updatedat``, so the timestamp is in the local time of the station.
WEATHER_STATION = {
    "succeeded": True,
    "data": [
        {
            "tenantId": "a7ada15e-a289-40ff-8233-655707dfad89",
            "macId": "78421CA2A790",
            "lat": 12.001163,
            "long": 76.05557,
            "deviceName": "Farmfuture MicroClime",
            "isWeatherForecast": False,
            "airHumidity": 78.9,
            "airPressure": 909.87,
            "airTemperature": 26.4,
            "leafWetness": 0,
            "rainfall": 0,
            "windDirection": "S",
            "windSpeed": 0,
            "voltage": 100,
            "lux": 11748,
            "updateAt": "2026-09-28 14:30:47",
            "addOnId": 2,
        }
    ],
}

#: The same row marked as a prediction rather than a measurement.
WEATHER_FORECAST = {
    "succeeded": True,
    "data": [{**WEATHER_STATION["data"][0], "isWeatherForecast": True}],
}

#: A farm their platform flags ``weather: false``. Verified live: the endpoint
#: answers 200 with an empty list, so the flag and the data agree.
WEATHER_NONE: dict = {"succeeded": True, "data": []}
