"""Run the Alembic migrations from code (used by the demo seed). Same as ``alembic upgrade head``."""

from __future__ import annotations

from pathlib import Path

from alembic import command
from alembic.config import Config
from sqlalchemy import inspect, text

from app.core import db as dbmod

API_ROOT = Path(__file__).resolve().parents[2]


def alembic_config() -> Config:
    return Config(str(API_ROOT / "alembic.ini"))


def upgrade_head() -> None:
    command.upgrade(alembic_config(), "head")


def drop_all_tables() -> None:
    """Drop every app table and the migration history (the database itself stays)."""
    engine = dbmod.engine()
    dbmod.Base.metadata.drop_all(engine)
    with engine.begin() as conn:
        if inspect(conn).has_table("alembic_version"):
            conn.execute(text("DROP TABLE alembic_version"))
