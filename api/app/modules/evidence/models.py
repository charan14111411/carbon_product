from __future__ import annotations

from sqlalchemy import JSON, BigInteger, Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import LedgerModel


class EvidenceFile(LedgerModel):
    """A stored file (photo, certificate, document) with its SHA-256 fingerprint.

    The bytes live in the evidence store under their hash, so a file can never be
    replaced silently: different bytes mean a different fingerprint and a new record.
    """

    __tablename__ = "evidence_files"
    sha256: Mapped[str] = mapped_column(String(64), index=True)
    kind: Mapped[str] = mapped_column(String(40), index=True)  # photo | certificate | document | package | other
    filename: Mapped[str] = mapped_column(String(255))
    mime_type: Mapped[str] = mapped_column(String(100))
    size_bytes: Mapped[int] = mapped_column(BigInteger)
    storage_key: Mapped[str] = mapped_column(String(300))
    # Optional link to what the file proves, e.g. ("sample", "<uuid>").
    entity_type: Mapped[str | None] = mapped_column(String(60), nullable=True, index=True)
    entity_id: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    meta: Mapped[dict] = mapped_column(JSON, default=dict)
