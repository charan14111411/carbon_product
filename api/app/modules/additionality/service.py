"""Additionality assessments (VM0042 v2.2 §7): versioned, submitted by one person, approved by another."""

from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, ensure_not_author
from app.core.db import utcnow
from app.core.errors import Blocked, Conflict, IllegalTransition, NotFound, ValidationFailed
from app.core.tenancy import _plain, audit, get_owned, scoped, snapshot
from app.modules.additionality import domain
from app.modules.additionality.models import AdditionalityAssessment
from app.modules.evidence.models import EvidenceFile
from app.modules.identity.models import AuditEntry
from app.modules.programmes.models import Project

OPEN = ("draft", "submitted")


def _evidence_refs(data: dict[str, Any]) -> list[str]:
    refs = list((data.get("regulatory_surplus") or {}).get("evidence_ids") or [])
    for b in data.get("barriers") or []:
        refs += b.get("evidence_ids") or []
    for p in data.get("common_practice") or []:
        refs += p.get("evidence_ids") or []
        if (p.get("expert") or {}).get("attestation_evidence_id"):
            refs.append(p["expert"]["attestation_evidence_id"])
        refs += (p.get("essential_distinction") or {}).get("evidence_ids") or []
    return refs


def _check_evidence(db: Session, user: CurrentUser, data: dict[str, Any]) -> None:
    bad = []
    for raw in _evidence_refs(data):
        try:
            ev = db.get(EvidenceFile, uuid.UUID(str(raw)))
        except ValueError:
            ev = None
        if ev is None or ev.org_id != user.org_id:
            bad.append(str(raw))
    if bad:
        raise ValidationFailed("Some attached files could not be found. Upload them again.",
                               code="INVALID_EVIDENCE", details={"evidence_ids": bad})


def _project(db: Session, user: CurrentUser, project_id: str) -> Project:
    return get_owned(db, Project, project_id, user, "Project")


def get(db: Session, user: CurrentUser, project_id: str, assessment_id: str) -> AdditionalityAssessment:
    project = _project(db, user, project_id)
    a = get_owned(db, AdditionalityAssessment, assessment_id, user, "Additionality assessment")
    if a.project_id != project.id:
        raise NotFound("Additionality assessment not found.")
    return a


def versions(db: Session, user: CurrentUser, project_id: str) -> list[AdditionalityAssessment]:
    project = _project(db, user, project_id)
    return list(db.scalars(scoped(AdditionalityAssessment, user).where(
        AdditionalityAssessment.project_id == project.id).order_by(AdditionalityAssessment.version.desc())).all())


def latest(db: Session, user: CurrentUser, project_id: str) -> AdditionalityAssessment:
    rows = versions(db, user, project_id)
    if not rows:
        raise NotFound("No additionality assessment has been started for this project.")
    return rows[0]


def evaluate(a: AdditionalityAssessment) -> dict[str, Any]:
    return domain.evaluate(a.regulatory_surplus or {}, a.barriers or [], a.common_practice or [])


def out(a: AdditionalityAssessment) -> dict[str, Any]:
    from app.modules.additionality.schemas import AssessmentOut

    o = AssessmentOut.model_validate(a).model_dump()
    if a.status == "draft":  # live evaluation while editing; frozen at submission
        o["result"] = evaluate(a)
    return o


def create(db: Session, user: CurrentUser, project_id: str, data: dict[str, Any] | None) -> AdditionalityAssessment:
    project = _project(db, user, project_id)
    rows = versions(db, user, project_id)
    open_ = next((r for r in rows if r.status in OPEN), None)
    if open_:
        raise Conflict(f"Version {open_.version} is still {open_.status}. Finish or reject it first.",
                       code="OPEN_VERSION_EXISTS", details={"assessment_id": str(open_.id)})
    prev = rows[0] if rows else None
    if data is None:
        data = ({"regulatory_surplus": dict(prev.regulatory_surplus or {}), "barriers": list(prev.barriers or []),
                 "common_practice": list(prev.common_practice or [])} if prev else {})
    data = _plain(data)
    _check_evidence(db, user, data)
    top = db.scalar(select(func.max(AdditionalityAssessment.version)).where(
        AdditionalityAssessment.project_id == project.id)) or 0
    a = AdditionalityAssessment(
        org_id=user.org_id, created_by=user.id, project_id=project.id, version=top + 1, status="draft",
        regulatory_surplus=data.get("regulatory_surplus") or {}, barriers=data.get("barriers") or [],
        common_practice=data.get("common_practice") or [], result={}, supersedes_id=prev.id if prev else None,
    )
    db.add(a)
    audit(db, user, "additionality.create", a)
    return a


def update(db: Session, user: CurrentUser, project_id: str, assessment_id: str,
           changes: dict[str, Any]) -> AdditionalityAssessment:
    a = get(db, user, project_id, assessment_id)
    if a.status != "draft":
        raise IllegalTransition(f"Only a draft can be edited (this version is {a.status}). Start a new version.")
    changes = _plain({k: v for k, v in changes.items() if v is not None})
    _check_evidence(db, user, changes)
    before = snapshot(a)
    for k, v in changes.items():
        setattr(a, k, v)
    audit(db, user, "additionality.update", a, before=before)
    return a


def submit(db: Session, user: CurrentUser, project_id: str, assessment_id: str) -> AdditionalityAssessment:
    a = get(db, user, project_id, assessment_id)
    if a.status != "draft":
        raise IllegalTransition(f"Only a draft can be submitted (this version is {a.status}).",
                                details={"from": a.status, "to": "submitted"})
    result = evaluate(a)
    if not result["complete"]:
        raise Blocked("The assessment is incomplete: " + " ".join(
            s["message"] for s in result["steps"] if s["status"] == "incomplete"),
            code="ASSESSMENT_INCOMPLETE", details={"result": result})
    before = snapshot(a)
    a.status, a.result, a.submitted_by, a.submitted_at = "submitted", result, user.id, utcnow()
    audit(db, user, "additionality.submit", a, before=before)
    return a


def _editors(db: Session, org_id: uuid.UUID, a: AdditionalityAssessment) -> set[uuid.UUID]:
    rows = db.scalars(select(AuditEntry.created_by).where(
        AuditEntry.org_id == org_id, AuditEntry.entity_type == "AdditionalityAssessment",
        AuditEntry.entity_id == str(a.id)))
    return {r for r in rows if r is not None}


def approve(db: Session, user: CurrentUser, project_id: str, assessment_id: str, note: str) -> AdditionalityAssessment:
    a = get(db, user, project_id, assessment_id)
    if a.status != "submitted":
        raise IllegalTransition(f"Only a submitted assessment can be approved (this version is {a.status}).",
                                details={"from": a.status, "to": "approved"})
    ensure_not_author(user.id, a.created_by, a.submitted_by, *_editors(db, user.org_id, a),
                      what="an additionality assessment")
    for old in db.scalars(scoped(AdditionalityAssessment, user).where(
            AdditionalityAssessment.project_id == a.project_id, AdditionalityAssessment.status == "approved")).all():
        b = snapshot(old)
        old.status = "superseded"
        audit(db, user, "additionality.supersede", old, before=b, reason=f"Replaced by version {a.version}")
    before = snapshot(a)
    a.status, a.approved_by, a.approved_at, a.review_note = "approved", user.id, utcnow(), note.strip()
    audit(db, user, "additionality.approve", a, before=before, reason=note.strip() or None)
    return a


def reject(db: Session, user: CurrentUser, project_id: str, assessment_id: str, note: str) -> AdditionalityAssessment:
    a = get(db, user, project_id, assessment_id)
    if a.status != "submitted":
        raise IllegalTransition(f"Only a submitted assessment can be rejected (this version is {a.status}).",
                                details={"from": a.status, "to": "rejected"})
    if len(note.strip()) < 5:
        raise ValidationFailed("Say why the assessment is rejected (at least 5 characters).")
    ensure_not_author(user.id, a.created_by, a.submitted_by, what="an additionality assessment")
    before = snapshot(a)
    a.status, a.review_note = "rejected", note.strip()
    audit(db, user, "additionality.reject", a, before=before, reason=note.strip())
    return a
