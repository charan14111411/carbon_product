"""Application settings, read from environment variables (or api/.env)."""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

API_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=API_ROOT / ".env", extra="ignore")

    app_name: str = "Varsapradaya Carbon"
    environment: str = "development"  # development | test | staging | production

    database_url: str = "postgresql+psycopg://vcarbon:vcarbon_dev@localhost:5433/vcarbon"
    auto_create_schema: bool = True

    jwt_secret: str = "dev-only-secret-change-me-0123456789abcdef"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 12 * 60

    # Roles that must pass a second factor (TOTP) before a full session is issued.
    mfa_required_roles: tuple[str, ...] = ("platform_admin", "methodology_owner", "finance_checker")
    enforce_mfa: bool = False  # enabled automatically in production

    evidence_dir: Path = API_ROOT / "var" / "evidence"
    cors_origins: tuple[str, ...] = ("http://localhost:4200", "http://127.0.0.1:4200")

    engine_version: str = "1.0.0"

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def mfa_enforced(self) -> bool:
        return self.enforce_mfa or self.is_production


@lru_cache
def get_settings() -> Settings:
    return Settings()
