"""FarmFuture (Varsapradaya) API settings, read from the app's Settings (environment or api/.env).

No secrets live here: the platform has no service account, so every token is derived from a farmer's
phone number at the moment it is needed and held in memory only (see ``session.py``).
"""

from __future__ import annotations

from dataclasses import dataclass

from app.core.config import get_settings


@dataclass(frozen=True)
class FarmFutureConfig:
    base_url: str = "https://api.farmfuture.io/api"
    #: Seconds. Their estate list can be large for a multi-estate customer.
    timeout_s: float = 30.0
    #: A token is reused for at most this long. They publish no expiry, so we re-validate conservatively.
    token_ttl_s: float = 900.0
    verify_tls: bool = True
    #: Numbers are sent in E.164. Their validator accepts nothing else and -- the dangerous part --
    #: answers a wrongly formatted number with a cheerful "User does not exist, please register." rather
    #: than an error. A number typed without a country code is therefore given this one.
    country_code: str = "+91"

    @classmethod
    def from_settings(cls) -> FarmFutureConfig:
        s = get_settings()
        return cls(
            base_url=s.farmfuture_base_url,
            timeout_s=s.farmfuture_timeout_s,
            token_ttl_s=s.farmfuture_token_ttl_s,
            verify_tls=s.farmfuture_verify_tls,
            country_code=s.farmfuture_country_code,
        )


#: Endpoint paths, kept in one place. These four are the only calls this integration makes, and all
#: of them are reads.
VALIDATE_MOBILE = "/controller/ValidateMobileNumber"
ESTATES_AND_FARMS = "/Estate/GetUserEstatesAndFarmsList"
SENSORS_LATEST = "/Data/GetAllSensorsLatestData/{farm_id}"
#: MicroClime weather stations. Note the shape difference: the farm is a query parameter (``farmId``)
#: here, not a path segment.
WEATHER_LATEST = "/Data/GetAllWeatherData"
