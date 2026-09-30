"""Verification packages (sealed evidence bundles) and time-limited verifier access.

The package JSON is built only from database records that already exist when the
package is issued. Its fingerprints:

* ``content_sha256`` – every section except ``metadata``: identical evidence gives an
  identical content fingerprint, whichever version or person generated it.
* ``sha256``         – the whole document except ``metadata.sha256`` itself: unique to
  this version. This is the package fingerprint shown on every PDF page.

No timestamp of the generation itself is inside the hashed document; the time of
issue lives on the database row.
"""

from __future__ import annotations

import hashlib
import json
import secrets
import uuid
from datetime import UTC, date, datetime, timedelta
from decimal import Decimal
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, ensure_not_author
from app.core.config import get_settings
from app.core.db import utcnow
from app.core.errors import IllegalTransition, NotFound, Unauthorized, ValidationFailed
from app.core.events import emit
from app.core.tenancy import audit, get_owned, scoped
from app.modules.calculation import service as calc
from app.modules.calculation.models import CalculationRun, TermEstimate
from app.modules.evidence import service as evidence
from app.modules.evidence.models import EvidenceFile
from app.modules.identity.models import User
from app.modules.lab.models import Lab, LabResult
from app.modules.land.models import Enrolment, Field, LandUseRecord
from app.modules.methodology.definitions import BY_KEY
from app.modules.methodology.models import Rule, RulePack
from app.modules.practices.models import PracticeRecord
from app.modules.programmes.models import Programme, Project
from app.modules.qa.models import QAFinding
from app.modules.sampling.models import Campaign, CustodyEvent, Sample, Site, SoilLayer, Stratum
from app.modules.verification.models import VerificationPackage, VerifierAccess, VerifierQuery
from app.modules.verification.schemas import DecisionIn, VerifierAccessIn, VerifierQueryIn

PACKAGE_SCHEMA = "vcarbon.verification-package/1"
_VOLATILE = ("updated_at",)


# ================================================================ hashing
def canonical(obj: Any) -> bytes:
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), default=str).encode("utf-8")


def _sha(obj: Any) -> str:
    return hashlib.sha256(canonical(obj)).hexdigest()


def content_sha256(pkg: dict[str, Any]) -> str:
    return _sha({k: v for k, v in pkg.items() if k != "metadata"})


def package_sha256(pkg: dict[str, Any]) -> str:
    meta = {k: v for k, v in (pkg.get("metadata") or {}).items() if k != "sha256"}
    return _sha({**pkg, "metadata": meta})


def _val(v: Any) -> Any:
    if isinstance(v, datetime):
        return _aware(v).isoformat()  # same text whatever the database driver returns
    if isinstance(v, date):
        return v.isoformat()
    if isinstance(v, uuid.UUID):
        return str(v)
    if isinstance(v, Decimal):
        return float(v)
    if isinstance(v, dict):
        return {str(k): _val(x) for k, x in v.items()}
    if isinstance(v, (list, tuple)):
        return [_val(x) for x in v]
    return v


def _row(obj: Any, *drop: str) -> dict[str, Any]:
    """Column values as JSON-safe data, without fields that change when nothing of substance does."""
    skip = {*_VOLATILE, *drop}
    return {c.key: _val(getattr(obj, c.key)) for c in obj.__table__.columns if c.key not in skip}


def _ids(values: Any) -> list[uuid.UUID]:
    out = []
    for v in values or []:
        try:
            out.append(uuid.UUID(str(v)))
        except ValueError:
            continue
    return out


# ================================================================ package build
def build_package(db: Session, run: CalculationRun, *, version: int, generated_by: str) -> dict[str, Any]:
    org = run.org_id
    project = db.get(Project, run.project_id)
    programme = db.get(Programme, project.programme_id) if project else None
    snap = run.inputs_snapshot or {}
    sources = snap.get("sources", {})
    docs: dict[uuid.UUID, set[str]] = {}

    def ref(evidence_id: Any, by: str) -> None:
        for eid in _ids([evidence_id]):
            docs.setdefault(eid, set()).add(by)

    # methodology
    pack = db.get(RulePack, run.rule_pack_id)
    rules = db.scalars(select(Rule).where(Rule.pack_id == run.rule_pack_id).order_by(Rule.key)).all()
    if pack and pack.source_document_id:
        ref(pack.source_document_id, f"rule_pack:{pack.id}")
    methodology = {
        "pack": _row(pack) if pack else None,
        "rules": [
            {"key": r.key, "label": BY_KEY[r.key].label if r.key in BY_KEY else r.key,
             "value": (r.value or {}).get("value"), "source_document": r.source_document,
             "source_section": r.source_section, "source_page": r.source_page, "notes": r.notes}
            for r in rules
        ],
    }

    # strata, fields
    stratum_ids = _ids(s["id"] for s in sources.get("strata", []))
    strata = db.scalars(select(Stratum).where(Stratum.org_id == org, Stratum.id.in_(stratum_ids))
                        .order_by(Stratum.code)).all() if stratum_ids else []
    enrolments = db.scalars(select(Enrolment).where(Enrolment.org_id == org, Enrolment.project_id == run.project_id)
                            .order_by(Enrolment.field_id)).all()
    field_ids = sorted({f for s in strata for f in _ids(s.field_ids)} | {e.field_id for e in enrolments})
    fields = db.scalars(select(Field).where(Field.org_id == org, Field.id.in_(field_ids))
                        .order_by(Field.code)).all() if field_ids else []
    land_use = db.scalars(select(LandUseRecord).where(LandUseRecord.org_id == org,
                                                      LandUseRecord.field_id.in_(field_ids))
                          .order_by(LandUseRecord.field_id, LandUseRecord.from_year)).all() if field_ids else []
    for lu in land_use:
        ref(lu.evidence_id, f"land_use:{lu.id}")
    practices_all = db.scalars(select(PracticeRecord).where(PracticeRecord.org_id == org,
                                                            PracticeRecord.field_id.in_(field_ids))).all() \
        if field_ids else []
    latest_practice: dict[uuid.UUID, PracticeRecord] = {}
    for p in practices_all:
        cur = latest_practice.get(p.record_id)
        if cur is None or p.version > cur.version:
            latest_practice[p.record_id] = p
    practices = sorted(latest_practice.values(), key=lambda p: (str(p.field_id), p.performed_on, str(p.record_id)))
    for p in practices:
        for e in p.evidence_ids or []:
            ref(e, f"practice:{p.id}")

    # campaigns, sites, samples, layers, custody, lab
    campaigns = [c for c in (db.get(Campaign, run.baseline_campaign_id), db.get(Campaign, run.monitoring_campaign_id))
                 if c is not None]
    sample_ids = _ids(v["sample_id"] for v in sources.get("samples", {}).values())
    samples = db.scalars(select(Sample).where(Sample.org_id == org, Sample.id.in_(sample_ids))
                         .order_by(Sample.code)).all() if sample_ids else []
    site_ids = sorted({s.site_id for s in samples})
    sites = db.scalars(select(Site).where(Site.org_id == org, Site.id.in_(site_ids)).order_by(Site.code)).all() \
        if site_ids else []
    for s in samples:
        for pid in s.photo_ids or []:
            ref(pid, f"sample:{s.code}")
    layers = db.scalars(select(SoilLayer).where(SoilLayer.sample_id.in_(sample_ids)).order_by(SoilLayer.code)).all() \
        if sample_ids else []
    custody = db.scalars(select(CustodyEvent).where(CustodyEvent.sample_id.in_(sample_ids))
                         .order_by(CustodyEvent.sample_id, CustodyEvent.occurred_at, CustodyEvent.id)).all() \
        if sample_ids else []
    layer_ids = [lyr.id for lyr in layers]
    lab_results = db.scalars(select(LabResult).where(LabResult.org_id == org, LabResult.layer_id.in_(layer_ids))
                             .order_by(LabResult.layer_id, LabResult.analyte, LabResult.version)).all() \
        if layer_ids else []
    used = {res["id"] for lv in sources.get("layers", {}).values() for res in lv["results"].values()}
    lab_ids = sorted({r.lab_id for r in lab_results})
    labs = db.scalars(select(Lab).where(Lab.id.in_(lab_ids)).order_by(Lab.code)).all() if lab_ids else []
    layer_code = {lyr.id: lyr.code for lyr in layers}
    lab_rows = []
    for r in lab_results:
        ref(r.certificate_id, f"lab_result:{r.id}")
        lab_rows.append(_row(r) | {"layer_code": layer_code.get(r.layer_id), "used_in_calculation": str(r.id) in used})

    term_ids = _ids(t["id"] for t in sources.get("terms", {}).values())
    terms = db.scalars(select(TermEstimate).where(TermEstimate.org_id == org, TermEstimate.id.in_(term_ids))
                       .order_by(TermEstimate.term)).all() if term_ids else []

    findings = db.scalars(select(QAFinding).where(QAFinding.org_id == org, QAFinding.project_id == run.project_id)
                          .order_by(QAFinding.created_at, QAFinding.id)).all()

    history = [{"status": e.status, "note": e.note, "at": _val(e.created_at),
                "by_id": str(e.created_by) if e.created_by else None}
               for e in calc.status_events(db, run.id)]

    # document index
    evid = db.scalars(select(EvidenceFile).where(EvidenceFile.org_id == org, EvidenceFile.id.in_(list(docs)))).all() \
        if docs else []
    found = {e.id: e for e in evid}
    index = []
    for eid in sorted(docs, key=str):
        e = found.get(eid)
        entry: dict[str, Any] = {"id": str(eid), "referenced_by": sorted(docs[eid])}
        if e is None:
            entry["missing"] = True
        else:
            entry.update({"sha256": e.sha256, "kind": e.kind, "filename": e.filename, "mime_type": e.mime_type,
                          "size_bytes": e.size_bytes})
        index.append(entry)

    results = run.results or {}
    pkg: dict[str, Any] = {
        "metadata": {
            "schema": PACKAGE_SCHEMA, "package_version": version, "run_id": str(run.id),
            "project_code": project.code if project else None, "project_name": project.name if project else None,
            "period_label": run.period_label, "period_start": run.period_start.isoformat(),
            "period_end": run.period_end.isoformat(), "engine_version": run.engine_version,
            "platform_version": get_settings().engine_version, "generated_by": generated_by,
        },
        "project": {"project": _row(project) if project else None, "programme": _row(programme) if programme else None},
        "methodology": methodology,
        "fields": [
            {"id": str(f.id), "code": f.code, "name": f.name, "area_ha": f.area_ha, "boundary": f.boundary,
             "crop_code": f.crop_code, "soil_type": f.soil_type, "version": f.version, "status": f.status}
            for f in fields
        ],
        "enrolments": [_row(e) for e in enrolments],
        "land_use": [_row(x) for x in land_use],
        "practices": [_row(p) for p in practices],
        "strata": [_row(s) for s in strata],
        "campaigns": [_row(c) for c in campaigns],
        "sites": [_row(s) for s in sites],
        "samples": [_row(s) | {"photos": [{"id": str(i), "sha256": found[i].sha256 if i in found else None}
                                           for i in _ids(s.photo_ids)]} for s in samples],
        "soil_layers": [_row(lyr) for lyr in layers],
        "custody_events": [_row(e) for e in custody],
        "labs": [_row(lab) for lab in labs],
        "lab_results": lab_rows,
        "terms": [_row(t) for t in terms],
        "calculation": {
            "run": {k: v for k, v in _row(run).items() if k not in ("inputs_snapshot", "results", "rules_snapshot")},
            "inputs_snapshot": run.inputs_snapshot, "rules_snapshot": run.rules_snapshot, "results": results,
            "status_history": history,
            "headline": {
                "net_credits_t_co2e": run.net_t_co2e, "reductions_t_co2e": run.reductions_t_co2e,
                "removals_t_co2e": run.removals_t_co2e, "gross_t_co2e": run.gross_t_co2e,
                "uncertainty_deduction_t_co2e": run.uncertainty_deduction_t_co2e,
                "buffer_t_co2e": run.buffer_t_co2e,
                "net_before_uncertainty_t_co2e": results.get("net_before_uncertainty_t_co2e"),
            },
        },
        "qa_findings": [_row(f) for f in findings],
        "document_index": index,
    }
    pkg["metadata"]["content_sha256"] = content_sha256(pkg)
    pkg["metadata"]["sha256"] = package_sha256(pkg)
    return pkg


def document_ids(pkg: dict[str, Any]) -> set[str]:
    return {d["id"] for d in pkg.get("document_index", [])}


# ================================================================ packages
def issue_package(db: Session, user: CurrentUser, run_id: str) -> VerificationPackage:
    run = get_owned(db, CalculationRun, run_id, user, "Calculation")
    status = calc.run_status(db, run.id)
    if status != "approved":
        raise IllegalTransition(f"Only an approved calculation can be packaged; this one is {status.replace('_', ' ')}.")
    ensure_not_author(user.id, run.created_by, what="a verification package for a calculation")
    version = (db.scalar(select(func.max(VerificationPackage.version)).where(
        VerificationPackage.org_id == user.org_id, VerificationPackage.run_id == run.id)) or 0) + 1
    pkg = build_package(db, run, version=version, generated_by=user.full_name)
    from app.modules.verification.pdf import render_pdf

    project_code = pkg["metadata"]["project_code"] or "project"
    base_name = f"{project_code}_{run.period_label}_v{version}"
    json_bytes = json.dumps(pkg, sort_keys=True, indent=2, default=str).encode("utf-8")
    jf = evidence.store(db, user, data=json_bytes, filename=f"{base_name}.json", mime_type="application/json",
                        kind="package", entity_type="calculation_run", entity_id=str(run.id))
    pf = evidence.store(db, user, data=render_pdf(pkg), filename=f"{base_name}.pdf", mime_type="application/pdf",
                        kind="package", entity_type="calculation_run", entity_id=str(run.id))
    head = pkg["calculation"]["headline"]
    vp = VerificationPackage(
        org_id=user.org_id, created_by=user.id, run_id=run.id, project_id=run.project_id, version=version,
        sha256=pkg["metadata"]["sha256"], json_file_id=jf.id, pdf_file_id=pf.id,
        summary={
            "content_sha256": pkg["metadata"]["content_sha256"], "project_code": project_code,
            "period_label": run.period_label, "period_start": run.period_start.isoformat(),
            "period_end": run.period_end.isoformat(), "generated_by": user.full_name,
            "generated_at": utcnow().isoformat(), "documents": len(pkg["document_index"]),
            "samples": len(pkg["samples"]), "lab_results": len(pkg["lab_results"]), **head,
        },
    )
    db.add(vp)
    audit(db, user, "package.issue", vp)
    emit(db, user, "package.issued", vp, {"package_id": str(vp.id), "run_id": str(run.id), "version": version,
                                          "sha256": vp.sha256})
    return vp


def package_out(vp: VerificationPackage) -> dict[str, Any]:
    return {
        "id": str(vp.id), "run_id": str(vp.run_id), "project_id": str(vp.project_id), "version": vp.version,
        "sha256": vp.sha256, "json_file_id": str(vp.json_file_id),
        "pdf_file_id": str(vp.pdf_file_id) if vp.pdf_file_id else None, "summary": vp.summary,
        "created_at": vp.created_at.isoformat(), "created_by": str(vp.created_by) if vp.created_by else None,
    }


def list_packages(db: Session, user: CurrentUser, project_id: str) -> list[VerificationPackage]:
    project = get_owned(db, Project, project_id, user, "Project")
    return list(db.scalars(scoped(VerificationPackage, user).where(VerificationPackage.project_id == project.id)
                           .order_by(VerificationPackage.created_at.desc())).all())


def load_json(db: Session, vp: VerificationPackage) -> dict[str, Any]:
    f = db.get(EvidenceFile, vp.json_file_id)
    if f is None:
        raise NotFound("The package file is missing.")
    return json.loads(evidence.read_bytes(f).decode("utf-8"))


def verify_package(db: Session, vp: VerificationPackage) -> dict[str, Any]:
    jf = db.get(EvidenceFile, vp.json_file_id)
    pf = db.get(EvidenceFile, vp.pdf_file_id) if vp.pdf_file_id else None
    file_ok = bool(jf and evidence.verify(jf))
    try:
        pkg = load_json(db, vp)
        recomputed = package_sha256(pkg)
        content = content_sha256(pkg)
    except (NotFound, ValueError):
        pkg, recomputed, content = None, None, None
    intact = bool(file_ok and recomputed == vp.sha256 and pkg and pkg["metadata"].get("sha256") == vp.sha256)
    return {
        "package_id": str(vp.id), "sha256": vp.sha256, "recomputed_sha256": recomputed,
        "content_sha256": content, "json_file_intact": file_ok,
        "pdf_file_intact": bool(pf and evidence.verify(pf)) if vp.pdf_file_id else None, "intact": intact,
    }


# ================================================================ verifier access (team side)
def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _aware(dt: datetime | None) -> datetime | None:
    if dt is None:
        return None
    return dt if dt.tzinfo else dt.replace(tzinfo=UTC)


def access_status(acc: VerifierAccess) -> str:
    if acc.revoked_at:
        return "revoked"
    if _aware(acc.expires_at) <= utcnow():
        return "expired"
    return "active"


def access_out(acc: VerifierAccess) -> dict[str, Any]:
    return {
        "id": str(acc.id), "package_id": str(acc.package_id), "verifier_name": acc.verifier_name,
        "verifier_email": acc.verifier_email, "organisation": acc.organisation,
        "expires_at": _aware(acc.expires_at).isoformat(),
        "revoked_at": _aware(acc.revoked_at).isoformat() if acc.revoked_at else None,
        "last_opened_at": _aware(acc.last_opened_at).isoformat() if acc.last_opened_at else None,
        "review_status": acc.status, "link_status": access_status(acc),
    }


def grant_access(db: Session, user: CurrentUser, package_id: str, body: VerifierAccessIn) -> tuple[VerifierAccess, str]:
    vp = get_owned(db, VerificationPackage, package_id, user, "Package")
    token = secrets.token_urlsafe(32)
    acc = VerifierAccess(
        org_id=user.org_id, created_by=user.id, package_id=vp.id, verifier_name=body.verifier_name.strip(),
        verifier_email=str(body.verifier_email).lower(), organisation=body.organisation.strip(),
        token_sha256=_hash_token(token), expires_at=utcnow() + timedelta(days=body.days),
    )
    db.add(acc)
    audit(db, user, "verifier_access.grant", acc)
    return acc, token


def list_access(db: Session, user: CurrentUser, package_id: str) -> list[VerifierAccess]:
    vp = get_owned(db, VerificationPackage, package_id, user, "Package")
    return list(db.scalars(scoped(VerifierAccess, user).where(VerifierAccess.package_id == vp.id)
                           .order_by(VerifierAccess.created_at)).all())


def revoke_access(db: Session, user: CurrentUser, access_id: str) -> VerifierAccess:
    acc = get_owned(db, VerifierAccess, access_id, user, "Verifier access")
    if acc.revoked_at:
        raise IllegalTransition("This link has already been revoked.")
    before = {"revoked_at": None}
    acc.revoked_at = utcnow()
    audit(db, user, "verifier_access.revoke", acc, before=before)
    return acc


def query_out(q: VerifierQuery, names: dict[uuid.UUID, str] | None = None) -> dict[str, Any]:
    return {
        "id": str(q.id), "access_id": str(q.access_id), "subject_type": q.subject_type, "subject_id": q.subject_id,
        "question": q.question, "answer": q.answer, "status": q.status,
        "answered_by": (names or {}).get(q.answered_by) if q.answered_by else None,
        "answered_at": _aware(q.answered_at).isoformat() if q.answered_at else None,
        "created_at": _aware(q.created_at).isoformat(),
    }


def package_queries(db: Session, user: CurrentUser, package_id: str) -> list[dict[str, Any]]:
    vp = get_owned(db, VerificationPackage, package_id, user, "Package")
    access_ids = [a.id for a in db.scalars(scoped(VerifierAccess, user).where(VerifierAccess.package_id == vp.id))]
    if not access_ids:
        return []
    names = {u.id: u.full_name for u in db.scalars(select(User).where(User.org_id == user.org_id))}
    rows = db.scalars(scoped(VerifierQuery, user).where(VerifierQuery.access_id.in_(access_ids))
                      .order_by(VerifierQuery.created_at)).all()
    return [query_out(q, names) for q in rows]


def answer_query(db: Session, user: CurrentUser, query_id: str, answer: str) -> VerifierQuery:
    q = get_owned(db, VerifierQuery, query_id, user, "Question")
    if q.subject_type == "decision":
        raise ValidationFailed("A verifier decision is not a question and can't be answered.")
    before = {"answer": q.answer, "status": q.status}
    q.answer = answer.strip()
    q.answered_by = user.id
    q.answered_at = utcnow()
    q.status = "answered"
    audit(db, user, "verifier_query.answer", q, before=before)
    return q


# ================================================================ verifier portal (token side)
def resolve_token(db: Session, token: str | None) -> VerifierAccess:
    if not token or not token.strip():
        raise Unauthorized("Open the review link your project team sent you.", code="VERIFIER_TOKEN_REQUIRED")
    acc = db.scalar(select(VerifierAccess).where(VerifierAccess.token_sha256 == _hash_token(token.strip())))
    if acc is None:
        raise Unauthorized("This review link is not valid.", code="VERIFIER_LINK_INVALID")
    if acc.revoked_at:
        raise Unauthorized("This review link has been withdrawn by the project team.", code="VERIFIER_LINK_REVOKED")
    if _aware(acc.expires_at) <= utcnow():
        raise Unauthorized("This review link has expired. Ask the project team for a new one.",
                           code="VERIFIER_LINK_EXPIRED")
    acc.last_opened_at = utcnow()
    return acc


def _package_for(db: Session, acc: VerifierAccess) -> VerificationPackage:
    vp = db.get(VerificationPackage, acc.package_id)
    if vp is None or vp.org_id != acc.org_id:
        raise NotFound("Package not found.")
    return vp


def verifier_session(db: Session, acc: VerifierAccess) -> dict[str, Any]:
    vp = _package_for(db, acc)
    return {"package": package_out(vp), "verifier": access_out(acc), "status": acc.status,
            "integrity": verify_package(db, vp)}


def verifier_package(db: Session, acc: VerifierAccess) -> dict[str, Any]:
    return load_json(db, _package_for(db, acc))


def verifier_file(db: Session, acc: VerifierAccess, evidence_id: str) -> EvidenceFile:
    vp = _package_for(db, acc)
    allowed = document_ids(load_json(db, vp)) | {str(vp.json_file_id)}
    if vp.pdf_file_id:
        allowed.add(str(vp.pdf_file_id))
    try:
        eid = uuid.UUID(evidence_id)
    except ValueError as exc:
        raise NotFound("File not found.") from exc
    if str(eid) not in allowed:
        raise NotFound("File not found.")
    f = db.get(EvidenceFile, eid)
    if f is None or f.org_id != acc.org_id:
        raise NotFound("File not found.")
    return f


def verifier_provenance(db: Session, acc: VerifierAccess, run_id: str) -> dict[str, Any]:
    vp = _package_for(db, acc)
    if run_id != str(vp.run_id):
        raise NotFound("Calculation not found.")
    run = db.get(CalculationRun, vp.run_id)
    if run is None:
        raise NotFound("Calculation not found.")
    return calc.provenance(db, run)


def verifier_ask(db: Session, acc: VerifierAccess, body: VerifierQueryIn) -> VerifierQuery:
    if acc.status != "in_review":
        raise IllegalTransition("The review has been concluded; questions can no longer be raised.")
    q = VerifierQuery(org_id=acc.org_id, created_by=None, access_id=acc.id, subject_type=body.subject_type,
                      subject_id=body.subject_id, question=body.question.strip(), status="open")
    db.add(q)
    audit(db, None, "verifier_query.create", q, reason=f"Raised by verifier {acc.verifier_name} <{acc.verifier_email}>")
    return q


def verifier_queries(db: Session, acc: VerifierAccess) -> list[VerifierQuery]:
    return list(db.scalars(select(VerifierQuery).where(VerifierQuery.access_id == acc.id)
                           .order_by(VerifierQuery.created_at)).all())


def verifier_decide(db: Session, acc: VerifierAccess, body: DecisionIn) -> VerifierAccess:
    if acc.status != "in_review":
        raise IllegalTransition(f"The review is already concluded ({acc.status}).")
    if body.status == "findings" and len(body.note.strip()) < 5:
        raise ValidationFailed("Describe the findings so the project team can act on them.")
    before = {"status": acc.status}
    acc.status = body.status
    record = VerifierQuery(org_id=acc.org_id, created_by=None, access_id=acc.id, subject_type="decision",
                           subject_id=body.status, question=body.note.strip() or body.status, status="closed")
    db.add(record)
    audit(db, None, "verifier_access.decision", acc, before=before,
          reason=f"{acc.verifier_name}: {body.status}. {body.note.strip()}".strip())
    return acc
