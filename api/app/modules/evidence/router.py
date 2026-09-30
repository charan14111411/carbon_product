from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends, File, Form, UploadFile
from fastapi.responses import Response
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, current_user
from app.core.db import get_db
from app.core.tenancy import get_owned
from app.modules.evidence import service
from app.modules.evidence.models import EvidenceFile

router = APIRouter(prefix="/evidence", tags=["Evidence"])


class EvidenceOut(BaseModel):
    id: str
    sha256: str
    kind: str
    filename: str
    mime_type: str
    size_bytes: int
    entity_type: str | None
    entity_id: str | None
    latitude: float | None
    longitude: float | None
    created_at: datetime

    @classmethod
    def of(cls, e: EvidenceFile) -> "EvidenceOut":
        return cls(
            id=str(e.id), sha256=e.sha256, kind=e.kind, filename=e.filename, mime_type=e.mime_type,
            size_bytes=e.size_bytes, entity_type=e.entity_type, entity_id=e.entity_id,
            latitude=e.latitude, longitude=e.longitude, created_at=e.created_at,
        )


@router.post("", response_model=EvidenceOut, status_code=201)
async def upload(
    file: UploadFile = File(...),
    kind: str = Form("document"),
    entity_type: str | None = Form(None),
    entity_id: str | None = Form(None),
    latitude: float | None = Form(None),
    longitude: float | None = Form(None),
    user: CurrentUser = Depends(current_user),
    db: Session = Depends(get_db),
):
    data = await file.read()
    rec = service.store(
        db, user, data=data, filename=file.filename or "file", mime_type=file.content_type or "",
        kind=kind, entity_type=entity_type, entity_id=entity_id, latitude=latitude, longitude=longitude,
    )
    return EvidenceOut.of(rec)


@router.get("/{evidence_id}", response_model=EvidenceOut)
def detail(evidence_id: str, user: CurrentUser = Depends(current_user), db: Session = Depends(get_db)):
    return EvidenceOut.of(get_owned(db, EvidenceFile, evidence_id, user, "File"))


@router.get("/{evidence_id}/content")
def content(evidence_id: str, user: CurrentUser = Depends(current_user), db: Session = Depends(get_db)):
    rec = get_owned(db, EvidenceFile, evidence_id, user, "File")
    return Response(
        service.read_bytes(rec), media_type=rec.mime_type,
        headers={"Content-Disposition": f'inline; filename="{rec.filename}"', "X-Content-SHA256": rec.sha256},
    )


@router.get("/{evidence_id}/verify")
def verify(evidence_id: str, user: CurrentUser = Depends(current_user), db: Session = Depends(get_db)):
    rec = get_owned(db, EvidenceFile, evidence_id, user, "File")
    return {"id": str(rec.id), "sha256": rec.sha256, "intact": service.verify(rec)}
