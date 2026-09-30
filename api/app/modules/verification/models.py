from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel, TenantModel


class VerificationPackage(LedgerModel):
    """A sealed evidence bundle for one approved run. Its SHA-256 covers every section."""

    __tablename__ = "verification_packages"
    run_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("calculation_runs.id"), index=True)
    project_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("projects.id"), index=True)
    version: Mapped[int] = mapped_column(Integer)
    sha256: Mapped[str] = mapped_column(String(64))
    json_file_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("evidence_files.id"))
    pdf_file_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("evidence_files.id"), nullable=True)
    summary: Mapped[dict] = mapped_column(JSON, default=dict)


class VerifierAccess(TenantModel):
    """Time-limited, revocable, read-only access to one package for a named verifier."""

    __tablename__ = "verifier_access"
    package_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("verification_packages.id"), index=True)
    verifier_name: Mapped[str] = mapped_column(String(200))
    verifier_email: Mapped[str] = mapped_column(String(200))
    organisation: Mapped[str] = mapped_column(String(200), default="")
    token_sha256: Mapped[str] = mapped_column(String(64), unique=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_opened_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="in_review")  # in_review | verified | findings


class VerifierQuery(TenantModel):
    """A question a verifier raises on the package, and the team's answer."""

    __tablename__ = "verifier_queries"
    access_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("verifier_access.id"), index=True)
    subject_type: Mapped[str] = mapped_column(String(40), default="package")
    subject_id: Mapped[str] = mapped_column(String(64), default="")
    question: Mapped[str] = mapped_column(Text)
    answer: Mapped[str | None] = mapped_column(Text, nullable=True)
    answered_by: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("users.id"), nullable=True)
    answered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(12), default="open")  # open | answered | closed
