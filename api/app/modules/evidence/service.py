from __future__ import annotations

import re
import uuid
from pathlib import Path

from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.config import get_settings
from app.core.errors import NotFound, ValidationFailed
from app.core.security import sha256_bytes
from app.modules.evidence.models import EvidenceFile

ALLOWED_TYPES = {
    "image/jpeg", "image/png", "image/webp", "application/pdf", "text/csv", "application/json",
}
MAX_BYTES = 25 * 1024 * 1024
_SAFE = re.compile(r"[^A-Za-z0-9._-]+")


def _root() -> Path:
    root = get_settings().evidence_dir
    root.mkdir(parents=True, exist_ok=True)
    return root


def store(
    db: Session,
    user: CurrentUser,
    *,
    data: bytes,
    filename: str,
    mime_type: str,
    kind: str = "document",
    entity_type: str | None = None,
    entity_id: str | None = None,
    latitude: float | None = None,
    longitude: float | None = None,
    meta: dict | None = None,
    org_id: uuid.UUID | None = None,
) -> EvidenceFile:
    if not data:
        raise ValidationFailed("The file is empty.")
    if len(data) > MAX_BYTES:
        raise ValidationFailed("Files must be 25 MB or smaller.")
    if mime_type not in ALLOWED_TYPES:
        raise ValidationFailed(f"Files of type {mime_type} can't be stored as evidence.")

    digest = sha256_bytes(data)
    owner = org_id or user.org_id
    key = f"{owner}/{digest[:2]}/{digest}"
    path = _root() / key
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)

    record = EvidenceFile(
        org_id=owner,
        created_by=user.id,
        sha256=digest,
        kind=kind,
        filename=_SAFE.sub("_", filename)[:255] or "file",
        mime_type=mime_type,
        size_bytes=len(data),
        storage_key=key,
        entity_type=entity_type,
        entity_id=entity_id,
        latitude=latitude,
        longitude=longitude,
        meta=meta or {},
    )
    db.add(record)
    db.flush()
    return record


def read_bytes(record: EvidenceFile) -> bytes:
    path = _root() / record.storage_key
    if not path.exists():
        raise NotFound("The stored file is missing.")
    return path.read_bytes()


def verify(record: EvidenceFile) -> bool:
    """True if the stored bytes still match the fingerprint recorded at upload."""
    try:
        return sha256_bytes(read_bytes(record)) == record.sha256
    except NotFound:
        return False
