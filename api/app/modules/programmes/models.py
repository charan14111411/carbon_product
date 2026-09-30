from __future__ import annotations

import uuid
from datetime import date

from sqlalchemy import JSON, Date, ForeignKey, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import TenantModel


class Programme(TenantModel):
    """The commercial / participant-facing wrapper. Holds one or more MRV projects."""

    __tablename__ = "programmes"
    __table_args__ = (UniqueConstraint("org_id", "code"),)
    code: Mapped[str] = mapped_column(String(40))
    name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    region: Mapped[str] = mapped_column(String(200), default="")  # e.g. "Karnataka, India"
    boundary: Mapped[dict | None] = mapped_column(JSON, nullable=True)  # GeoJSON Polygon/MultiPolygon
    eligible_crops: Mapped[list] = mapped_column(JSON, default=list)  # crop codes
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="draft")  # draft | active | suspended | closed
    commercial_terms: Mapped[dict] = mapped_column(JSON, default=dict)


class Project(TenantModel):
    """The methodology / MRV unit inside a programme."""

    __tablename__ = "projects"
    __table_args__ = (UniqueConstraint("org_id", "code"),)
    programme_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("programmes.id"), index=True)
    code: Mapped[str] = mapped_column(String(40))
    name: Mapped[str] = mapped_column(String(200))
    methodology_code: Mapped[str] = mapped_column(String(40), default="VM0042")
    methodology_version: Mapped[str] = mapped_column(String(20), default="2.2")
    rule_pack_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("rule_packs.id"), nullable=True)
    baseline_start: Mapped[date | None] = mapped_column(Date, nullable=True)
    crediting_start: Mapped[date | None] = mapped_column(Date, nullable=True)
    crediting_end: Mapped[date | None] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="design")  # design | active | monitoring | closed
