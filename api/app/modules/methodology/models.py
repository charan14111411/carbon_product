from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import TenantModel


class RulePack(TenantModel):
    """A versioned set of methodology rules (e.g. VM0042 v2.2, revision 3).

    Approved packs are frozen. A change is a new revision."""

    __tablename__ = "rule_packs"
    __table_args__ = (UniqueConstraint("org_id", "methodology_code", "methodology_version", "revision"),)
    methodology_code: Mapped[str] = mapped_column(String(40))
    methodology_version: Mapped[str] = mapped_column(String(20))
    revision: Mapped[int] = mapped_column(Integer, default=1)
    title: Mapped[str] = mapped_column(String(200))
    source_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    source_document_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("evidence_files.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="draft")  # draft | approved | retired
    approved_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    based_on_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("rule_packs.id"), nullable=True)


class Rule(TenantModel):
    """One methodology value with the place it came from."""

    __tablename__ = "rules"
    __table_args__ = (UniqueConstraint("pack_id", "key"),)
    pack_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("rule_packs.id"), index=True)
    key: Mapped[str] = mapped_column(String(80))
    value: Mapped[dict] = mapped_column(JSON)  # {"value": <any>}
    source_document: Mapped[str] = mapped_column(String(300))
    source_section: Mapped[str | None] = mapped_column(String(120), nullable=True)
    source_page: Mapped[str | None] = mapped_column(String(40), nullable=True)
    notes: Mapped[str] = mapped_column(Text, default="")
    last_modified_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    editors: Mapped[list] = mapped_column(JSON, default=list)  # every user id that ever edited this rule
