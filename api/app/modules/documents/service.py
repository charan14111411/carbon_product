"""Controlled documents, their versions and approvals, and retention reporting.

Retention is *reported*, never enforced by deletion: evidence files are immutable and a document
whose retention period has passed is only listed for a person to review. VM0042 v2.2 §9.3 requires
project data to be kept for at least two years after the end of the last crediting period, so an
``after_crediting_end`` policy can't be set below two years.
"""

from __future__ import annotations

import uuid
from collections import Counter
from datetime import date, timedelta
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, ensure_not_author
from app.core.errors import Conflict, IllegalTransition, NotFound, ValidationFailed
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.documents.models import Document, DocumentApproval, DocumentVersion, RetentionPolicy
from app.modules.documents.schemas import DocumentIn, DocumentPatch, PolicyIn, PolicyPatch
from app.modules.evidence.models import EvidenceFile
from app.modules.programmes.models import Project

VM0042_MIN_YEARS = 2
VM0042_SOURCE = "VM0042 v2.2 §9.3: keep data at least 2 years after the end of the last crediting period"


def today() -> date:
    return date.today()


def add_years(d: date, years: int) -> date:
    try:
        return d.replace(year=d.year + years)
    except ValueError:
        return d.replace(year=d.year + years, day=28)


# ------------------------------------------------------------------ policies
def policy_out(p: RetentionPolicy) -> dict[str, Any]:
    return {"id": str(p.id), "kind": p.kind, "rule": p.rule, "years": p.years, "source": p.source,
            "status": p.status, "notes": p.notes, "created_at": p.created_at.isoformat()}


def _check_policy(rule: str, years: int) -> None:
    if rule == "after_crediting_end" and years < VM0042_MIN_YEARS:
        raise ValidationFailed(f"Project records must be kept at least {VM0042_MIN_YEARS} years after the crediting "
                               "period ends (VM0042 v2.2 §9.3).", code="RETENTION_TOO_SHORT")


def _retire_active(db: Session, user: CurrentUser, kind: str, keep: uuid.UUID | None = None) -> None:
    for prev in db.scalars(scoped(RetentionPolicy, user).where(RetentionPolicy.kind == kind,
                                                               RetentionPolicy.status == "active")).all():
        if prev.id == keep:
            continue
        before = snapshot(prev)
        prev.status = "retired"
        audit(db, user, "retention_policy.retire", prev, before=before)


def create_policy(db: Session, user: CurrentUser, body: PolicyIn) -> RetentionPolicy:
    _check_policy(body.rule, body.years)
    _retire_active(db, user, body.kind)
    p = RetentionPolicy(org_id=user.org_id, created_by=user.id, kind=body.kind, rule=body.rule, years=body.years,
                        source=body.source, notes=body.notes, status="active")
    db.add(p)
    audit(db, user, "retention_policy.create", p)
    return p


def update_policy(db: Session, user: CurrentUser, policy_id: str, body: PolicyPatch) -> RetentionPolicy:
    p = get_owned(db, RetentionPolicy, policy_id, user, "Retention policy")
    before = snapshot(p)
    data = body.model_dump(exclude_unset=True)
    _check_policy(p.rule, data.get("years") if data.get("years") is not None else p.years)
    if data.get("status") == "active" and p.status != "active":
        _retire_active(db, user, p.kind, keep=p.id)
    for k, v in data.items():
        if v is not None:
            setattr(p, k, v)
    audit(db, user, "retention_policy.update", p, before=before)
    return p


def install_default_policies(db: Session, user: CurrentUser) -> dict[str, Any]:
    exists = db.scalar(scoped(RetentionPolicy, user).where(RetentionPolicy.kind == "*",
                                                           RetentionPolicy.status == "active"))
    if exists:
        return {"installed": 0, "policies": []}
    p = RetentionPolicy(org_id=user.org_id, created_by=user.id, kind="*", rule="after_crediting_end",
                        years=VM0042_MIN_YEARS, source=VM0042_SOURCE, status="active",
                        notes="Methodology minimum for project records. Legal, tax or contract rules may require "
                              "longer periods for some kinds; add a policy per kind where they do.")
    db.add(p)
    audit(db, user, "retention_policy.install_default", p)
    return {"installed": 1, "policies": [policy_out(p)]}


def list_policies(db: Session, user: CurrentUser) -> list[RetentionPolicy]:
    return list(db.scalars(scoped(RetentionPolicy, user).order_by(RetentionPolicy.kind,
                                                                  RetentionPolicy.created_at.desc())).all())


# ------------------------------------------------------------------ documents
def versions(db: Session, doc: Document) -> list[DocumentVersion]:
    return list(db.scalars(select(DocumentVersion).where(DocumentVersion.document_id == doc.id)
                           .order_by(DocumentVersion.version)).all())


def _approval(db: Session, v: DocumentVersion) -> DocumentApproval | None:
    return db.scalar(select(DocumentApproval).where(DocumentApproval.version_id == v.id))


def document_out(db: Session, d: Document, detail: bool = True) -> dict[str, Any]:
    vs = versions(db, d)
    rows = []
    approved = None
    for v in vs:
        a = _approval(db, v)
        if a and a.decision == "approved":
            approved = v.version
        rows.append({"id": str(v.id), "version": v.version, "evidence_id": str(v.evidence_id), "sha256": v.sha256,
                     "change_note": v.change_note, "created_by": str(v.created_by) if v.created_by else None,
                     "created_at": v.created_at.isoformat(),
                     "approval": None if a is None else {"decision": a.decision, "note": a.note,
                                                         "by": str(a.created_by) if a.created_by else None,
                                                         "at": a.created_at.isoformat()}})
    out = {"id": str(d.id), "code": d.code, "title": d.title, "kind": d.kind, "classification": d.classification,
           "entity_type": d.entity_type, "entity_id": d.entity_id,
           "project_id": str(d.project_id) if d.project_id else None,
           "retention_policy_id": str(d.retention_policy_id) if d.retention_policy_id else None,
           "status": d.status, "description": d.description, "current_version": vs[-1].version if vs else None,
           "approved_version": approved, "created_at": d.created_at.isoformat()}
    if detail:
        out["versions"] = rows
        out["retention"] = retention_of(db, d)
    return out


def _policy_ref(db: Session, user: CurrentUser, policy_id: str | None) -> uuid.UUID | None:
    if not policy_id:
        return None
    p = get_owned(db, RetentionPolicy, policy_id, user, "Retention policy")
    if p.status != "active":
        raise ValidationFailed("That retention policy is retired.")
    return p.id


def _evidence(db: Session, user: CurrentUser, evidence_id: str) -> EvidenceFile:
    return get_owned(db, EvidenceFile, evidence_id, user, "Evidence file")


def create_document(db: Session, user: CurrentUser, body: DocumentIn) -> Document:
    project_id = get_owned(db, Project, body.project_id, user, "Project").id if body.project_id else None
    n = db.scalar(select(func.count()).select_from(Document).where(Document.org_id == user.org_id)) or 0
    code = body.code or f"DOC-{n + 1:05d}"
    if db.scalar(scoped(Document, user).where(Document.code == code)):
        raise Conflict(f"Document code {code} is already used.", code="CODE_TAKEN")
    if bool(body.entity_type) != bool(body.entity_id):
        raise ValidationFailed("Give both the linked record type and its id, or neither.")
    d = Document(org_id=user.org_id, created_by=user.id, code=code, title=body.title, kind=body.kind,
                 classification=body.classification, entity_type=body.entity_type, entity_id=body.entity_id,
                 project_id=project_id, retention_policy_id=_policy_ref(db, user, body.retention_policy_id),
                 description=body.description, status="active")
    db.add(d)
    db.flush()
    audit(db, user, "document.create", d)
    if body.evidence_id:
        add_version(db, user, str(d.id), body.evidence_id, body.change_note)
    return d


def update_document(db: Session, user: CurrentUser, document_id: str, body: DocumentPatch) -> Document:
    d = get_owned(db, Document, document_id, user, "Document")
    before = snapshot(d)
    data = body.model_dump(exclude_unset=True)
    if "retention_policy_id" in data:
        d.retention_policy_id = _policy_ref(db, user, data.pop("retention_policy_id"))
    for k, v in data.items():
        if v is not None:
            setattr(d, k, v)
    audit(db, user, "document.update", d, before=before)
    return d


def add_version(db: Session, user: CurrentUser, document_id: str, evidence_id: str, note: str) -> DocumentVersion:
    d = get_owned(db, Document, document_id, user, "Document")
    if d.status != "active":
        raise IllegalTransition("An archived document can't get new versions.")
    ev = _evidence(db, user, evidence_id)
    vs = versions(db, d)
    if vs and vs[-1].sha256 == ev.sha256:
        raise Conflict("This file is identical to the current version.", code="VERSION_UNCHANGED")
    v = DocumentVersion(org_id=user.org_id, created_by=user.id, document_id=d.id,
                        version=(vs[-1].version + 1) if vs else 1, evidence_id=ev.id, sha256=ev.sha256,
                        change_note=note)
    db.add(v)
    audit(db, user, "document.version", v)
    return v


def decide_version(db: Session, user: CurrentUser, document_id: str, version: int, decision: str,
                   note: str) -> DocumentApproval:
    d = get_owned(db, Document, document_id, user, "Document")
    v = db.scalar(select(DocumentVersion).where(DocumentVersion.document_id == d.id, DocumentVersion.version == version))
    if v is None:
        raise NotFound("Document version not found.")
    if _approval(db, v):
        raise Conflict("This version has already been reviewed.", code="ALREADY_REVIEWED")
    ensure_not_author(user.id, v.created_by, what="a document version")
    if decision == "rejected" and not note.strip():
        raise ValidationFailed("Say why the version is rejected.", code="NOTE_REQUIRED")
    a = DocumentApproval(org_id=user.org_id, created_by=user.id, version_id=v.id, decision=decision, note=note)
    db.add(a)
    audit(db, user, f"document.version_{decision}", a)
    return a


def list_documents(db: Session, user: CurrentUser, *, kind: str | None, entity_type: str | None,
                   entity_id: str | None, project_id: str | None, status: str | None) -> list[Document]:
    q = scoped(Document, user).order_by(Document.code)
    if project_id:
        q = q.where(Document.project_id == get_owned(db, Project, project_id, user, "Project").id)
    for col, v in ((Document.kind, kind), (Document.entity_type, entity_type), (Document.entity_id, entity_id),
                   (Document.status, status)):
        if v:
            q = q.where(col == v)
    return list(db.scalars(q).all())


# ------------------------------------------------------------------ retention report
def _policy_for(db: Session, d: Document) -> RetentionPolicy | None:
    if d.retention_policy_id:
        p = db.get(RetentionPolicy, d.retention_policy_id)
        if p is not None and p.status == "active":
            return p
    for kind in (d.kind, "*"):
        p = db.scalars(select(RetentionPolicy).where(RetentionPolicy.org_id == d.org_id, RetentionPolicy.kind == kind,
                                                     RetentionPolicy.status == "active")
                       .order_by(RetentionPolicy.created_at.desc())).first()
        if p is not None:
            return p
    return None


def retention_of(db: Session, d: Document, within_days: int = 365, on: date | None = None) -> dict[str, Any]:
    on = on or today()
    p = _policy_for(db, d)
    if p is None:
        return {"status": "no_policy", "retain_until": None, "policy": None,
                "reason": "No retention policy applies to this kind of document."}
    ref = {"id": str(p.id), "kind": p.kind, "rule": p.rule, "years": p.years, "source": p.source}
    if p.rule == "after_crediting_end":
        project = db.get(Project, d.project_id) if d.project_id else None
        if project is None:
            return {"status": "undetermined", "retain_until": None, "policy": ref,
                    "reason": "Link the document to a project so its crediting period can be used."}
        if project.crediting_end is None:
            return {"status": "undetermined", "retain_until": None, "policy": ref,
                    "reason": f"Project {project.code} has no crediting end date yet."}
        until = add_years(project.crediting_end, p.years)
        basis = f"{p.years} year(s) after project {project.code}'s crediting end ({project.crediting_end.isoformat()})."
    else:
        vs = versions(db, d)
        start = (vs[-1].created_at if vs else d.created_at).date()
        until = add_years(start, p.years)
        basis = f"{p.years} year(s) after the latest version ({start.isoformat()})."
    if until < on:
        status = "expired"
    elif until <= on + timedelta(days=within_days):
        status = "expiring"
    else:
        status = "retain"
    return {"status": status, "retain_until": until.isoformat(), "policy": ref, "basis": basis}


def retention_report(db: Session, user: CurrentUser, within_days: int = 365, status: str | None = None) -> dict[str, Any]:
    docs = db.scalars(scoped(Document, user).order_by(Document.code)).all()
    items = []
    for d in docs:
        r = retention_of(db, d, within_days)
        if status and r["status"] != status:
            continue
        items.append({"document_id": str(d.id), "code": d.code, "title": d.title, "kind": d.kind,
                      "project_id": str(d.project_id) if d.project_id else None,
                      "versions": len(versions(db, d)), **r})
    return {"as_of": today().isoformat(), "within_days": within_days,
            "counts": dict(Counter(i["status"] for i in items)), "items": items,
            "note": "Report only. Nothing is deleted automatically: evidence files are immutable, and any disposal "
                    "after the retention date needs a separate, recorded decision."}
