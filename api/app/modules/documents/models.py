from __future__ import annotations

import uuid

from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel


class Document(TenantModel):
    """A controlled document (policy, contract, report, SOP, monitoring plan...). Its content lives in
    immutable evidence files, one per version."""

    __tablename__ = "documents"
    __table_args__ = (UniqueConstraint("org_id", "code"),)
    code: Mapped[str] = mapped_column(String(60))
    title: Mapped[str] = mapped_column(String(300))
    kind: Mapped[str] = mapped_column(String(20))  # policy | contract | report | sop | monitoring_plan | other
    classification: Mapped[str] = mapped_column(String(20), default="internal")  # public | internal | confidential
    entity_type: Mapped[str | None] = mapped_column(String(60), nullable=True, index=True)
    entity_id: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    project_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("projects.id"), nullable=True, index=True)
    retention_policy_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("retention_policies.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(12), default="active")  # active | archived
    description: Mapped[str] = mapped_column(Text, default="")


class DocumentVersion(LedgerModel):
    """One version of a document: which evidence file, and why it changed. Append-only."""

    __tablename__ = "document_versions"
    __table_args__ = (UniqueConstraint("document_id", "version"),)
    document_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("documents.id"), index=True)
    version: Mapped[int] = mapped_column(Integer)
    evidence_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("evidence_files.id"))
    sha256: Mapped[str] = mapped_column(String(64))
    change_note: Mapped[str] = mapped_column(Text, default="")


class DocumentApproval(LedgerModel):
    """A second person's approval (or rejection) of a document version. Append-only."""

    __tablename__ = "document_approvals"
    __table_args__ = (UniqueConstraint("version_id"),)
    version_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("document_versions.id"), index=True)
    decision: Mapped[str] = mapped_column(String(10))  # approved | rejected
    note: Mapped[str] = mapped_column(Text, default="")


class RetentionPolicy(TenantModel):
    """How long a kind of document must be kept. Reporting only: nothing is ever deleted automatically."""

    __tablename__ = "retention_policies"
    kind: Mapped[str] = mapped_column(String(20), index=True)  # document kind, or "*" for all kinds
    rule: Mapped[str] = mapped_column(String(30))  # fixed_years | after_crediting_end
    years: Mapped[int] = mapped_column(Integer)
    source: Mapped[str] = mapped_column(String(300))  # legal / methodology basis
    status: Mapped[str] = mapped_column(String(12), default="active")  # active | retired
    notes: Mapped[str] = mapped_column(Text, default="")
