"""Alembic environment. The database comes from DATABASE_URL (api/.env), the schema from the app's models."""

from __future__ import annotations

from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.core import db as dbmod  # noqa: F401  (registers the SQL Server NVARCHAR type rules)
from app.core.config import get_settings
from app.main import load_models

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name, disable_existing_loggers=False)

load_models()
target_metadata = dbmod.Base.metadata
# Offline (--sql) runs may pass the dialect via "-x url=mssql+pyodbc://" so no database is needed.
URL = context.get_x_argument(as_dictionary=True).get("url") or get_settings().database_url


def run_migrations_offline() -> None:
    """Write the SQL to stdout (e.g. ``alembic upgrade head --sql``) — for running in SSMS."""
    context.configure(url=URL, target_metadata=target_metadata, literal_binds=True, compare_type=True,
                      dialect_opts={"paramstyle": "named"})
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    section = config.get_section(config.config_ini_section, {})
    section["sqlalchemy.url"] = URL
    connectable = engine_from_config(section, prefix="sqlalchemy.", poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata, compare_type=True)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
