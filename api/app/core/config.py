"""Application settings, read from environment variables (or api/.env)."""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

API_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=API_ROOT / ".env", extra="ignore")

    app_name: str = "Varsapradaya Carbon"
    environment: str = "development"  # development | test | staging | production

    # Set in api/.env (copy api/.env.example). SQL Server example:
    # mssql+pyodbc://@localhost\SQL_LOCAL/carbon_latest?driver=ODBC+Driver+18+for+SQL+Server&trusted_connection=yes&TrustServerCertificate=yes
    database_url: str = ""
    # The schema is owned by the Alembic migrations (api/migrations). Only tests and throw-away databases set this.
    auto_create_schema: bool = False

    jwt_secret: str = "dev-only-secret-change-me-0123456789abcdef"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 12 * 60

    # Roles that must pass a second factor (TOTP) before a full session is issued.
    mfa_required_roles: tuple[str, ...] = ("platform_admin", "methodology_owner", "finance_checker")
    enforce_mfa: bool = False  # enabled automatically in production

    evidence_dir: Path = API_ROOT / "var" / "evidence"
    cors_origins: tuple[str, ...] = ("http://localhost:4200", "http://127.0.0.1:4200")

    engine_version: str = "1.0.0"

    # Varsapradaya member platform (FarmFuture). "simulated" (default) or "farmfuture" (the live API).
    vc_member_directory: str = "simulated"
    farmfuture_base_url: str = "https://api.farmfuture.io/api"
    farmfuture_timeout_s: float = 30.0
    farmfuture_token_ttl_s: float = 900.0  # tokens are held in memory only, for at most this long
    farmfuture_verify_tls: bool = True
    farmfuture_country_code: str = "+91"  # added to numbers typed without a country code
    # With VC_DEVICE_PROVIDER=farmfuture the API reads every member farm's devices this often (minutes) and keeps
    # each reading as the device's own history. 0 turns the automatic reading off.
    varsapradaya_poll_minutes: int = 60

    # Public data services used by the real providers (VC_WEATHER_PROVIDER=nasa_power, VC_SOIL_PROVIDER=soilgrids,
    # VC_SATELLITE_PROVIDER=planetary_computer, VC_TERRAIN_PROVIDER=copernicus_dem). No keys are needed.
    nasa_power_url: str = "https://power.larc.nasa.gov/api/temporal/daily/point"
    soilgrids_url: str = "https://rest.isric.org/soilgrids/v2.0/properties/query"
    stac_url: str = "https://planetarycomputer.microsoft.com/api/stac/v1"
    pc_data_api_url: str = "https://planetarycomputer.microsoft.com/api/data/v1"
    http_timeout_s: float = 60.0
    http_retries: int = 2  # extra attempts on 429 / 5xx, with exponential backoff

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def mfa_enforced(self) -> bool:
        return self.enforce_mfa or self.is_production


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    if not settings.database_url:
        raise RuntimeError(
            f"DATABASE_URL is not set. Copy {API_ROOT / '.env.example'} to {API_ROOT / '.env'} and put your "
            "database address in it.")
    return settings


def provider_choice(env: str, default: str) -> str:
    """The provider named by ``env`` (e.g. ``VC_WEATHER_PROVIDER``): the process environment first, then api/.env,
    then ``default``. Read on every call so a change in api/.env applies at the next request."""
    import os

    value = os.environ.get(env)
    if not value:
        env_file = API_ROOT / ".env"
        if env_file.is_file():
            from dotenv import dotenv_values

            value = dotenv_values(env_file).get(env)
    return (value or default).strip()
