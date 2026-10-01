"""Activity data (VM0042 v2.2 §6 Table 4, Box 1), farmer attestations, the baseline schedule of
activities and the §4 condition 2 practice-change test.

Activity records are append-only and versioned: a correction or void is a new row with the same
``record_id`` and ``version + 1``. Every read uses the latest version of each record.
"""

from __future__ import annotations

import io
import uuid
from collections import defaultdict
from datetime import date
from typing import Any

from sqlalchemy import and_, func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.config import get_settings
from app.core.db import utcnow
from app.core.errors import Blocked, IllegalTransition, NotFound, RuleMissing, ValidationFailed
from app.core.tenancy import audit, get_owned, scoped
from app.modules.baseline import domain
from app.modules.baseline.models import ACTIVITY_CATEGORIES, DATA_TIERS, ActivityRecord, BaselineAttestation
from app.modules.evidence import service as evidence_service
from app.modules.evidence.models import EvidenceFile
from app.modules.farmers.models import Farmer
from app.modules.identity.models import User
from app.modules.land.models import Enrolment, Farm, Field
from app.modules.land.service import project_start
from app.modules.programmes.models import Project

STATEMENT_LANGS = {"en": "English", "kn": "Kannada", "hi": "Hindi", "ta": "Tamil", "te": "Telugu", "mr": "Marathi",
                   "ml": "Malayalam"}
STATEMENT = ("I confirm that the land-management activities listed below are a true and complete account of how "
             "this field was managed in the years stated, to the best of my knowledge. I understand that this "
             "statement will be used to set the baseline for a soil-carbon project under Verra VM0042 and may be "
             "checked by an independent verifier against other evidence.")


def _fail(message: str, code: str = "INVALID_ACTIVITY", **details: Any) -> ValidationFailed:
    return ValidationFailed(message, code=code, details=details)


def start_year(project: Project) -> int:
    start = project_start(project)
    if start is None:
        raise RuleMissing("Set the project's crediting start (or baseline start) date before recording or "
                          "reviewing baseline activity data.", code="PROJECT_START_MISSING")
    return start.year


# ------------------------------------------------------------------ validation
def _evidence_ids(db: Session, user: CurrentUser, ids: list[str]) -> list[str]:
    out, bad = [], []
    for raw in ids:
        try:
            ev = db.get(EvidenceFile, uuid.UUID(str(raw)))
        except ValueError:
            ev = None
        if ev is None or ev.org_id != user.org_id:
            bad.append(str(raw))
        elif str(ev.id) not in out:
            out.append(str(ev.id))
    if bad:
        raise _fail("Some attached files could not be found. Upload them again.", evidence_ids=bad)
    return out


def _attestation(db: Session, user: CurrentUser, attestation_id: str | None, f: Field, year: int,
                 scenario: str) -> uuid.UUID | None:
    if not attestation_id:
        return None
    try:
        ev = db.get(EvidenceFile, uuid.UUID(str(attestation_id)))
    except ValueError:
        ev = None
    if ev is None or ev.org_id != user.org_id:
        raise _fail("The attestation file could not be found.", attestation_id=str(attestation_id))
    if ev.kind != domain.ATTESTATION_KIND:
        raise _fail("The attestation must be a signed farmer attestation (evidence of kind 'attestation').",
                    attestation_id=str(ev.id))
    att = db.scalar(select(BaselineAttestation).where(BaselineAttestation.evidence_id == ev.id))
    if att is not None:
        if att.field_id != f.id:
            raise _fail("This attestation was signed for a different field.", attestation_id=str(ev.id))
        if scenario == "baseline" and year not in (att.years or []):
            raise _fail(f"This attestation covers {', '.join(map(str, att.years))}, not {year}.",
                        attestation_id=str(ev.id))
    return ev.id


def _validate(db: Session, user: CurrentUser, data: dict[str, Any], *, new_field: bool) -> dict[str, Any]:
    project = get_owned(db, Project, data["project_id"], user, "Project")
    f = get_owned(db, Field, data["field_id"], user, "Field")
    if new_field and f.status != "active":
        raise _fail("This field is retired, so new activity data can't be recorded on it.")
    category = data["category"]
    if category not in ACTIVITY_CATEGORIES:
        raise _fail(f"Unknown activity category '{category}'. Use one of: {', '.join(ACTIVITY_CATEGORIES)}.",
                    code="UNKNOWN_CATEGORY")
    scenario = data["scenario"]
    if scenario not in domain.SCENARIOS:
        raise _fail("Say whether this is baseline or project activity data.")
    sy, year = start_year(project), int(data["year"])
    if year > date.today().year:
        raise _fail("Activity data can't be recorded for a future year.")
    if scenario == "baseline" and year >= sy:
        raise _fail(f"Baseline (look-back) data must be for years before the project start ({sy}).")
    if scenario == "project" and year < sy:
        raise _fail(f"Project data must be for {sy} or later; earlier years are baseline look-back.")
    attrs = dict(data.get("attributes") or {})
    errors = domain.validate_attributes(category, attrs)
    if errors:
        raise ValidationFailed(" ".join(errors), code="INVALID_ATTRIBUTES", details={"errors": errors})
    evidence = _evidence_ids(db, user, data.get("evidence_ids") or [])
    att = _attestation(db, user, data.get("attestation_id"), f, year, scenario)
    tier = int(data["data_tier"])
    source_note = (data.get("source_note") or "").strip()
    interval = data.get("census_release_interval_years")
    errors = domain.tier_errors(tier, len(evidence), att is not None, source_note, sy,
                                float(interval) if interval is not None else None)
    if errors:
        raise ValidationFailed(" ".join(errors), code="INVALID_DATA_TIER", details={"errors": errors})
    return {"project_id": project.id, "field_id": f.id, "scenario": scenario, "year": year, "category": category,
            "attributes": attrs, "data_tier": tier, "source_note": source_note,
            "census_release_interval_years": float(interval) if tier == 4 and interval is not None else None,
            "evidence_ids": evidence,
            "attestation_id": att}


def _row(user: CurrentUser, record_id: uuid.UUID, version: int, c: dict[str, Any], status: str,
         reason: str) -> ActivityRecord:
    return ActivityRecord(org_id=user.org_id, created_by=user.id, record_id=record_id, version=version,
                          status=status, reason=reason, **c)


# ------------------------------------------------------------------ reads
def latest(db: Session, user: CurrentUser, record_id: str | uuid.UUID) -> ActivityRecord:
    try:
        rid = record_id if isinstance(record_id, uuid.UUID) else uuid.UUID(str(record_id))
    except ValueError as exc:
        raise NotFound("Activity record not found.") from exc
    rec = db.scalar(scoped(ActivityRecord, user).where(ActivityRecord.record_id == rid)
                    .order_by(ActivityRecord.version.desc()).limit(1))
    if rec is None:
        raise NotFound("Activity record not found.")
    return rec


def versions(db: Session, user: CurrentUser, record_id: str) -> list[ActivityRecord]:
    rec = latest(db, user, record_id)
    return list(db.scalars(scoped(ActivityRecord, user).where(ActivityRecord.record_id == rec.record_id)
                           .order_by(ActivityRecord.version.desc())).all())


def _latest_stmt(org_id: uuid.UUID):
    top = (select(ActivityRecord.record_id, func.max(ActivityRecord.version).label("v"))
           .where(ActivityRecord.org_id == org_id).group_by(ActivityRecord.record_id).subquery())
    return select(ActivityRecord).where(ActivityRecord.org_id == org_id).join(
        top, and_(ActivityRecord.record_id == top.c.record_id, ActivityRecord.version == top.c.v))


def list_latest(db: Session, user: CurrentUser, *, project_id: str | None = None, field_id: str | None = None,
                scenario: str | None = None, category: str | None = None, year: int | None = None,
                include_voided: bool = False, limit: int = 50, offset: int = 0) -> tuple[list[ActivityRecord], int]:
    stmt = _latest_stmt(user.org_id)
    if project_id:
        stmt = stmt.where(ActivityRecord.project_id == get_owned(db, Project, project_id, user, "Project").id)
    if field_id:
        stmt = stmt.where(ActivityRecord.field_id == get_owned(db, Field, field_id, user, "Field").id)
    if scenario:
        stmt = stmt.where(ActivityRecord.scenario == scenario)
    if category:
        stmt = stmt.where(ActivityRecord.category == category)
    if year is not None:
        stmt = stmt.where(ActivityRecord.year == year)
    if not include_voided:
        stmt = stmt.where(ActivityRecord.status == "active")
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    rows = db.scalars(stmt.order_by(ActivityRecord.year.desc(), ActivityRecord.category,
                                    ActivityRecord.created_at).limit(limit).offset(offset)).all()
    return list(rows), total


def active_records(db: Session, org_id: uuid.UUID, *, project_id: uuid.UUID | None = None,
                   field_ids: list[uuid.UUID] | None = None, scenario: str | None = None) -> list[ActivityRecord]:
    """Latest, non-voided activity records (for other modules: schedule, control sites, emissions)."""
    stmt = _latest_stmt(org_id).where(ActivityRecord.status == "active")
    if project_id is not None:
        stmt = stmt.where(ActivityRecord.project_id == project_id)
    if field_ids is not None:
        if not field_ids:
            return []
        stmt = stmt.where(ActivityRecord.field_id.in_(field_ids))
    if scenario:
        stmt = stmt.where(ActivityRecord.scenario == scenario)
    return list(db.scalars(stmt.order_by(ActivityRecord.year, ActivityRecord.created_at)).all())


def out(rec: ActivityRecord) -> dict[str, Any]:
    from app.modules.baseline.schemas import ActivityOut

    o = ActivityOut.model_validate(rec)
    o.data_tier_label = DATA_TIERS.get(rec.data_tier, "")
    return o.model_dump()


# ------------------------------------------------------------------ writes
def create(db: Session, user: CurrentUser, data: dict[str, Any]) -> ActivityRecord:
    c = _validate(db, user, data, new_field=True)
    rec = _row(user, uuid.uuid4(), 1, c, "active", "Recorded")
    db.add(rec)
    audit(db, user, "activity_record.create", rec)
    return rec


def _as_input(rec: ActivityRecord) -> dict[str, Any]:
    return {"project_id": str(rec.project_id), "field_id": str(rec.field_id), "scenario": rec.scenario,
            "year": rec.year, "category": rec.category, "attributes": dict(rec.attributes or {}),
            "data_tier": rec.data_tier, "source_note": rec.source_note,
            "census_release_interval_years": rec.census_release_interval_years,
            "evidence_ids": list(rec.evidence_ids or []),
            "attestation_id": str(rec.attestation_id) if rec.attestation_id else None}


def correct(db: Session, user: CurrentUser, record_id: str, changes: dict[str, Any]) -> ActivityRecord:
    """A new version. Project, field, scenario and category can't change: void and re-record instead."""
    prev = latest(db, user, record_id)
    if prev.status == "voided":
        raise IllegalTransition("This record has been voided and can't be corrected.")
    reason = changes.pop("reason").strip()
    if len(reason) < 5:
        raise ValidationFailed("Say why the record is being corrected (at least 5 characters).")
    current = _as_input(prev)
    merged = {**current, **{k: v for k, v in changes.items() if v is not None or k == "attestation_id"}}
    if merged == current:
        raise ValidationFailed("Nothing has changed. Edit at least one value to save a correction.")
    c = _validate(db, user, merged, new_field=False)
    rec = _row(user, prev.record_id, prev.version + 1, c, "active", reason)
    db.add(rec)
    audit(db, user, "activity_record.correct", rec, reason=reason)
    return rec


def void(db: Session, user: CurrentUser, record_id: str, reason: str) -> ActivityRecord:
    prev = latest(db, user, record_id)
    if prev.status == "voided":
        raise IllegalTransition("This record has already been voided.")
    reason = reason.strip()
    if len(reason) < 5:
        raise ValidationFailed("Say why the record is being voided (at least 5 characters).")
    c = {k: getattr(prev, k) for k in ("project_id", "field_id", "scenario", "year", "category", "data_tier",
                                       "source_note", "census_release_interval_years", "attestation_id")}
    c["attributes"], c["evidence_ids"] = dict(prev.attributes or {}), list(prev.evidence_ids or [])
    rec = _row(user, prev.record_id, prev.version + 1, c, "voided", reason)
    db.add(rec)
    audit(db, user, "activity_record.void", rec, reason=reason)
    return rec


# ------------------------------------------------------------------ attestations
def _check_otp(code: str | None) -> None:
    from app.modules.consent.service import DEMO_OTP

    if get_settings().is_production:
        raise ValidationFailed("OTP signing isn't connected to an SMS provider yet. Use e-sign or assisted signing.",
                               code="OTP_UNAVAILABLE")
    if (code or "").strip() != DEMO_OTP:
        raise ValidationFailed("That code didn't work. Check the SMS and try again.", code="OTP_INVALID")


def _summary(attrs: dict) -> str:
    parts = []
    for k, v in attrs.items():
        if isinstance(v, bool):
            parts.append(f"{k.replace('_', ' ')}: {'yes' if v else 'no'}")
        elif isinstance(v, list):
            parts.append(f"{k.replace('_', ' ')}: {len(v)} item(s)")
        else:
            parts.append(f"{k.replace('_', ' ')}: {v}")
    return "; ".join(parts)


def _attestation_pdf(*, project: Project, f: Field, farmer: Farmer, years: list[int], lang: str, method: str,
                     witness: str | None, records: list[ActivityRecord], declarations: list[dict]) -> bytes:
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib.units import mm
    from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

    def esc(v: Any) -> str:
        return str(v).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    st = getSampleStyleSheet()
    body, small = st["BodyText"], st["BodyText"].clone("small", fontSize=8, leading=10)
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm,
                            bottomMargin=16 * mm, title="Farmer baseline attestation")
    story: list[Any] = [
        Paragraph("Farmer attestation of baseline land management", st["Title"]),
        Paragraph(esc(f"Project {project.code} — {project.name} (VM0042 v2.2, Box 1)"), body),
        Paragraph(esc(f"Field {f.code} ({f.name}), {f.area_ha:.2f} ha · Farmer {farmer.full_name} ({farmer.code})"),
                  body),
        Paragraph(esc(f"Years attested: {', '.join(map(str, years))}"), body),
        Spacer(1, 4 * mm),
        Paragraph(esc(STATEMENT), body),
    ]
    if lang != "en":
        story.append(Paragraph(esc(f"This statement was read to the farmer in {STATEMENT_LANGS[lang]}."), small))
    rows = [["Year", "Category", "Details", "Tier"]]
    for r in sorted(records, key=lambda r: (r.year, r.category)):
        rows.append([str(r.year), domain.SCHEMA[r.category].label, Paragraph(esc(_summary(r.attributes)), small),
                     str(r.data_tier)])
    for d in sorted(declarations, key=lambda d: (d["year"], d["category"])):
        rows.append([str(d["year"]), domain.SCHEMA[d["category"]].label,
                     Paragraph(esc(_summary(d["attributes"])), small), "declared"])
    table = Table(rows, colWidths=[16 * mm, 42 * mm, 98 * mm, 18 * mm], repeatRows=1)
    table.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.3, colors.grey), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                               ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f0f4f8")),
                               ("FONTSIZE", (0, 0), (-1, -1), 8)]))
    story += [Spacer(1, 4 * mm), table, Spacer(1, 6 * mm),
              Paragraph(esc(f"Signed by {method.upper()} on {utcnow().strftime('%Y-%m-%d %H:%M UTC')}"
                            + (f", witnessed by {witness}" if witness else "") + "."), body)]
    doc.build(story)
    return buf.getvalue()


def farmer_of_field(db: Session, f: Field) -> Farmer:
    farm = db.get(Farm, f.farm_id)
    return db.get(Farmer, farm.farmer_id)


def create_attestation(db: Session, user: CurrentUser, project_id: str, field_id: str,
                       data: dict[str, Any]) -> BaselineAttestation:
    project = get_owned(db, Project, project_id, user, "Project")
    f = get_owned(db, Field, field_id, user, "Field")
    farmer = farmer_of_field(db, f)
    if farmer.status != "active":
        raise Blocked("Only an active farmer can sign an attestation.")
    lang = data["statement_lang"].strip().lower()
    if lang not in STATEMENT_LANGS:
        raise _fail(f"The statement isn't available in '{lang}'. Available: {', '.join(STATEMENT_LANGS)}.",
                    code="LANGUAGE_UNAVAILABLE")
    years = sorted(set(int(y) for y in data["years"]))
    sy = start_year(project)
    if any(y >= sy for y in years):
        raise _fail(f"Baseline attestations cover look-back years before the project start ({sy}).")
    declarations = []
    for d in data.get("declarations") or []:
        if d["year"] not in years:
            raise _fail(f"The declaration for {d['year']} is outside the attested years.")
        errors = domain.validate_attributes(d["category"], d.get("attributes") or {})
        if errors:
            raise ValidationFailed(" ".join(errors), code="INVALID_ATTRIBUTES", details={"errors": errors})
        declarations.append({"year": d["year"], "category": d["category"], "attributes": d.get("attributes") or {}})
    records = [r for r in active_records(db, user.org_id, project_id=project.id, field_ids=[f.id],
                                         scenario="baseline") if r.year in years]
    if not records and not declarations:
        raise _fail("There is nothing to attest: record the baseline activities for these years, or add the "
                    "farmer's declarations.", code="NOTHING_TO_ATTEST")
    method = data["method"]
    if method == "otp":
        _check_otp(data.get("otp_code"))
    witness_id = user.id if method == "assisted" else None
    witness_name = db.get(User, user.id).full_name if witness_id else None
    pdf = _attestation_pdf(project=project, f=f, farmer=farmer, years=years, lang=lang, method=method,
                           witness=witness_name, records=records, declarations=declarations)
    ev = evidence_service.store(
        db, user, data=pdf, filename=f"attestation-{project.code}-{f.code}-{years[0]}-{years[-1]}.pdf",
        mime_type="application/pdf", kind=domain.ATTESTATION_KIND, entity_type="field", entity_id=str(f.id),
        meta={"project_id": str(project.id), "farmer_id": str(farmer.id), "years": years, "method": method,
              "statement_lang": lang, "witness_user_id": str(witness_id) if witness_id else None},
    )
    att = BaselineAttestation(
        org_id=user.org_id, created_by=user.id, project_id=project.id, field_id=f.id, farmer_id=farmer.id,
        evidence_id=ev.id, years=years, statement_lang=lang, method=method, witness_user_id=witness_id,
        records=[{"record_id": str(r.record_id), "version": r.version, "year": r.year, "category": r.category}
                 for r in records],
        declarations=declarations,
    )
    db.add(att)
    audit(db, user, "baseline_attestation.sign", att)
    return att


def list_attestations(db: Session, user: CurrentUser, project_id: str, field_id: str) -> list[BaselineAttestation]:
    project = get_owned(db, Project, project_id, user, "Project")
    f = get_owned(db, Field, field_id, user, "Field")
    return list(db.scalars(scoped(BaselineAttestation, user).where(
        BaselineAttestation.project_id == project.id, BaselineAttestation.field_id == f.id)
        .order_by(BaselineAttestation.created_at.desc())).all())


# ------------------------------------------------------------------ project fields
def project_fields(db: Session, user: CurrentUser, project: Project) -> list[Field]:
    """Fields taking part (enrolment not withdrawn) plus any field with activity data in the project."""
    enrolled = set(db.scalars(select(Enrolment.field_id).where(
        Enrolment.org_id == user.org_id, Enrolment.project_id == project.id, Enrolment.status != "withdrawn")).all())
    with_data = set(db.scalars(select(ActivityRecord.field_id).where(
        ActivityRecord.org_id == user.org_id, ActivityRecord.project_id == project.id)).all())
    ids = enrolled | with_data
    if not ids:
        return []
    return list(db.scalars(scoped(Field, user).where(Field.id.in_(ids)).order_by(Field.code)).all())


def _by_field_year(records: list[ActivityRecord]) -> dict[uuid.UUID, dict[int, dict[str, list[dict]]]]:
    out: dict[uuid.UUID, dict[int, dict[str, list[dict]]]] = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    for r in records:
        out[r.field_id][r.year][r.category].append(r.attributes or {})
    return out


# ------------------------------------------------------------------ schedule of activities (§6)
def schedule(db: Session, user: CurrentUser, project_id: str, today: date | None = None) -> dict[str, Any]:
    today = today or date.today()
    project = get_owned(db, Project, project_id, user, "Project")
    sy = start_year(project)
    if project.crediting_start and project.crediting_end:
        n_years = min(domain.BASELINE_PERIOD_YEARS, project.crediting_end.year - project.crediting_start.year + 1)
    else:
        n_years = domain.BASELINE_PERIOD_YEARS
    fields = project_fields(db, user, project)
    records = active_records(db, user.org_id, project_id=project.id, field_ids=[f.id for f in fields],
                             scenario="baseline")
    grid = _by_field_year(records)
    tiers: dict[uuid.UUID, dict[int, int]] = defaultdict(lambda: {t: 0 for t in DATA_TIERS})
    for r in records:
        tiers[r.field_id][r.data_tier] += 1

    out_fields = []
    for f in fields:
        years = grid.get(f.id, {})
        run = domain.lookback_run(set(years), sy)
        seq = [domain.crop_key(years[y].get("crop", [])) for y in run]
        stated = [int(a["rotation_length_years"]) for y in run for a in years[y].get("crop", [])
                  if isinstance(a.get("rotation_length_years"), (int, float))]
        rotation = domain.detect_rotation(seq, max(stated) if stated else None)
        completeness, missing_items = [], []
        for y in run:
            missing = [c for c in domain.TABLE4_CATEGORIES if c not in years[y]]
            completeness.append({"year": y, "t": y - sy, "complete": not missing, "missing": missing})
            missing_items += [f"{y}: {domain.SCHEMA[c].label}" for c in missing]
        warnings = []
        if len(run) < domain.MIN_LOOKBACK_YEARS:
            warnings.append(f"The look-back has {len(run)} consecutive year(s) before {sy}; at least "
                            f"{domain.MIN_LOOKBACK_YEARS} are needed.")
        if not rotation["complete"]:
            warnings.append(rotation["reason"])
        elif rotation["length"] and rotation["length"] > 1 and len(run) % rotation["length"]:
            warnings.append(f"The look-back ({len(run)} years) isn't a whole number of {rotation['length']}-year "
                            "rotations, so the repeated schedule shifts the rotation.")
        gaps = sorted(y for y in years if y < sy and y not in run)
        if gaps:
            warnings.append(f"Records for {', '.join(map(str, gaps))} are not used: they are not part of the "
                            "unbroken run of years before the project start.")
        lookback_ok = len(run) >= domain.MIN_LOOKBACK_YEARS and rotation["complete"]
        complete = bool(run) and not missing_items
        sched = []
        for row in domain.repeating_schedule(run, sy, n_years):
            src = years.get(row["source_year"], {})
            sched.append({**row, "crops": list(domain.crop_key(src.get("crop", []))),
                          "categories": sorted(src)})
        out_fields.append({
            "field_id": str(f.id), "field_code": f.code, "years_with_records": sorted(years),
            "lookback_years": run, "lookback_length": len(run), "meets_min_years": len(run) >= domain.MIN_LOOKBACK_YEARS,
            "rotation": rotation, "lookback_ok": lookback_ok, "completeness": completeness,
            "missing_items": missing_items, "complete": complete,
            "tier_summary": {str(k): v for k, v in tiers[f.id].items()}, "schedule": sched,
            "warnings": warnings, "ready": lookback_ok and complete,
        })
    return {
        "project_id": str(project.id), "start_year": sy, "baseline_period_years": n_years,
        "rotation_rule": domain.detect_rotation.__doc__.strip().splitlines()[0],
        "reassessment": domain.reassessment(project.baseline_start, today),
        "fields": out_fields, "fields_ready": sum(1 for x in out_fields if x["ready"]),
        "data_class": "DERIVED",
    }


# ------------------------------------------------------------------ practice change (§4 cond. 2)
def practice_change(db: Session, user: CurrentUser, project_id: str) -> dict[str, Any]:
    project = get_owned(db, Project, project_id, user, "Project")
    sy = start_year(project)
    fields = project_fields(db, user, project)
    records = active_records(db, user.org_id, project_id=project.id, field_ids=[f.id for f in fields])
    base = _by_field_year([r for r in records if r.scenario == "baseline"])
    proj = _by_field_year([r for r in records if r.scenario == "project"])
    out_fields = []
    for f in fields:
        b_years, p_years = base.get(f.id, {}), proj.get(f.id, {})
        run = domain.lookback_run(set(b_years), sy)
        categories = []
        for cat in ACTIVITY_CATEGORIES:
            lb = [domain.aggregate_year(cat, b_years[y][cat]) for y in run if cat in b_years[y]]
            year_rows = []
            for y in sorted(p_years):
                if cat not in p_years[y]:
                    continue
                changes = domain.compare_practice(cat, lb, domain.aggregate_year(cat, p_years[y][cat]))
                year_rows.append({"year": y, "changes": changes, "qualifying": any(c["qualifying"] for c in changes)})
            if not year_rows:
                continue
            spec = domain.SCHEMA[cat]
            categories.append({
                "category": cat, "label": spec.label, "appendix1": spec.appendix1,
                "appendix1_practices": list(domain.APPENDIX_1_PRACTICES.get(cat, ())),
                "lookback_years_used": [y for y in run if cat in b_years[y]], "years": year_rows,
                "qualifying": spec.appendix1 and any(r["qualifying"] for r in year_rows),
            })
        qualifies = any(c["qualifying"] for c in categories)
        if not run:
            status, msg = "insufficient_data", "No baseline look-back data to compare against."
        elif not p_years:
            status, msg = "insufficient_data", "No project-year activity data yet."
        elif qualifies:
            cats = ", ".join(c["label"] for c in categories if c["qualifying"])
            status, msg = "qualifies", f"Qualifying practice change in: {cats}."
        else:
            status, msg = "no_qualifying_change", ("No change of more than 5 % (or new practice) in an Appendix 1 "
                                                   "category. The field doesn't meet VM0042 §4 condition 2.")
        productivity = domain.productivity_check(
            [domain.crop_yields(b_years[y]["crop"]) for y in run if "crop" in b_years[y]],
            {y: cy for y in sorted(p_years) if "crop" in p_years[y] and (cy := domain.crop_yields(p_years[y]["crop"]))})
        out_fields.append({"field_id": str(f.id), "field_code": f.code, "lookback_years": run,
                           "project_years": sorted(p_years), "categories": categories, "qualifies": qualifies,
                           "status": status, "message": msg, "productivity": productivity})
    return {"project_id": str(project.id), "start_year": sy,
            "threshold_pct": domain.PRACTICE_CHANGE_THRESHOLD_PCT, "fields": out_fields,
            "fields_qualifying": sum(1 for x in out_fields if x["qualifies"]),
            "fields_productivity_warning": sum(1 for x in out_fields if x["productivity"]["status"] == "warning"),
            "productivity_threshold_pct": domain.PRODUCTIVITY_DECLINE_PCT, "data_class": "DERIVED"}
