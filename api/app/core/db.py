"""Database engine, session and the base model classes every module builds on.

Conventions (followed by every module):

* ``TenantModel``   – mutable master data owned by one organisation (``org_id``).
                      Has ``updated_at`` and soft-delete via ``is_active``/``status``.
* ``LedgerModel``   – append-only evidence. Inserts only: any UPDATE or DELETE
                      raises ``ImmutableRecord`` before it reaches the database.
                      Corrections are written as new rows that reference the old one.
"""

from __future__ import annotations

import uuid
from collections.abc import Iterator
from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, Unicode, Uuid, create_engine, event
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.sql.elements import BindParameter
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, declared_attr, mapped_column, sessionmaker

from app.core.config import get_settings
from app.core.errors import ImmutableRecord


def utcnow() -> datetime:
    return datetime.now(UTC)


class Base(DeclarativeBase):
    pass


class IdMixin:
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)


class TenantMixin:
    @declared_attr
    def org_id(cls) -> Mapped[uuid.UUID]:  # noqa: N805
        return mapped_column(Uuid, ForeignKey("organizations.id"), index=True, nullable=False)

    @declared_attr
    def created_by(cls) -> Mapped[uuid.UUID | None]:  # noqa: N805
        return mapped_column(Uuid, ForeignKey("users.id"), nullable=True)


class TenantModel(IdMixin, TenantMixin, Base):
    __abstract__ = True
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )


class LedgerModel(IdMixin, TenantMixin, Base):
    """Append-only. See module docstring."""

    __abstract__ = True
    __append_only__ = True


@event.listens_for(Session, "before_flush")
def _refuse_ledger_mutation(session: Session, _ctx, _instances) -> None:
    for obj in list(session.dirty) + list(session.deleted):
        if getattr(type(obj), "__append_only__", False):
            if obj in session.deleted or session.is_modified(obj, include_collections=False):
                raise ImmutableRecord(
                    f"{type(obj).__name__} is append-only; write a new record instead of changing this one."
                )


# ---------------------------------------------------------------- engine
_engine = None
_SessionLocal: sessionmaker[Session] | None = None


# SQL Server: VARCHAR/TEXT hold only the database code page (Latin-1 by default), which would turn Kannada,
# "₹" or "²" into "?". Every string column is created as NVARCHAR (Unicode) instead.
@compiles(String, "mssql")
def _mssql_string(type_: String, compiler, **kw) -> str:
    return f"NVARCHAR({type_.length})" if type_.length and type_.length <= 4000 else "NVARCHAR(max)"


@compiles(Text, "mssql")
def _mssql_text(type_: Text, compiler, **kw) -> str:
    return "NVARCHAR(max)"


# SQL Server accepts at most 2,100 parameters per statement, and ``col.in_(ids)`` sends one per id. On SQL Server,
# IN lists are rendered as literal values when the statement runs (SQLAlchemy's "literal_execute", which quotes them
# with the column type's own literal rules), so any list length works.
@compiles(BindParameter, "mssql")
def _mssql_bindparam(element: BindParameter, compiler, **kw) -> str:
    if element.expanding and not element.literal_execute:
        element = element._clone()
        element.literal_execute = True
        if isinstance(element.type, String) and not isinstance(element.type, Unicode):
            element.type = Unicode(element.type.length)  # N'…' literals, so non-Latin text isn't lost
    return compiler.visit_bindparam(element, **kw)


def _make_engine(url: str):
    kwargs: dict = {"pool_pre_ping": True}
    if url.startswith("mssql"):
        kwargs["pool_size"] = 10
        kwargs["max_overflow"] = 20
    if url.startswith("sqlite"):
        kwargs["connect_args"] = {"check_same_thread": False}
        if url in ("sqlite://", "sqlite:///:memory:"):
            from sqlalchemy.pool import StaticPool

            kwargs["poolclass"] = StaticPool
    return create_engine(url, **kwargs)


def configure(url: str | None = None) -> None:
    global _engine, _SessionLocal
    _engine = _make_engine(url or get_settings().database_url)
    _SessionLocal = sessionmaker(bind=_engine, autoflush=False, expire_on_commit=False)


def engine():
    if _engine is None:
        configure()
    return _engine


def session_factory() -> sessionmaker[Session]:
    if _SessionLocal is None:
        configure()
    assert _SessionLocal is not None
    return _SessionLocal


def get_db() -> Iterator[Session]:
    db = session_factory()()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def new_id() -> uuid.UUID:
    return uuid.uuid4()


ShortStr = String(120)
