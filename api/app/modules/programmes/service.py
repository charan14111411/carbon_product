"""Programmes (the commercial wrapper) and projects (the MRV unit inside one)."""

from __future__ import annotations

import uuid
from typing import Any

from shapely.geometry import mapping
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core import geo
from app.core.auth import CurrentUser
from app.core.errors import Blocked, Conflict, ValidationFailed
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.catalogue.service import unknown_crop_codes
from app.modules.land.models import Enrolment, Field
from app.modules.programmes.domain import PROGRAMME_TRANSITIONS, PROJECT_TRANSITIONS, check_transition
from app.modules.programmes.models import Programme, Project
from app.modules.programmes.schemas import ProgrammeIn, ProgrammePatch, ProjectIn, ProjectPatch


def _clean_boundary(boundary: dict | None) -> dict | None:
    return None if boundary is None else mapping(geo.parse_polygon(boundary))


def _check_crops(db: Session, org_id: uuid.UUID, codes: list[str]) -> list[str]:
    missing = unknown_crop_codes(db, org_id, codes)
    if missing:
        raise ValidationFailed(f"These crops are not in your catalogue: {', '.join(missing)}.",
                               code="UNKNOWN_CROP", details={"crop_codes": missing})
    return sorted(set(codes))


def _check_lookback(terms: dict[str, Any]) -> None:
    lb = terms.get("lookback_years")
    if lb is not None and (isinstance(lb, bool) or not isinstance(lb, int) or not 1 <= lb <= 50):
        raise ValidationFailed("The land-use look-back must be a whole number of years between 1 and 50.")


# ------------------------------------------------------------------ programmes
def list_programmes(db: Session, user: CurrentUser, status: str | None = None) -> list[Programme]:
    q = scoped(Programme, user).order_by(Programme.created_at.desc())
    if status:
        q = q.where(Programme.status == status)
    return list(db.scalars(q).all())


def create_programme(db: Session, user: CurrentUser, body: ProgrammeIn) -> Programme:
    if db.scalar(scoped(Programme, user).where(Programme.code == body.code)):
        raise Conflict(f"A programme with the code '{body.code}' already exists.", code="DUPLICATE_CODE")
    _check_lookback(body.commercial_terms)
    p = Programme(
        org_id=user.org_id, created_by=user.id, code=body.code, name=body.name, description=body.description,
        region=body.region, boundary=_clean_boundary(body.boundary),
        eligible_crops=_check_crops(db, user.org_id, body.eligible_crops),
        start_date=body.start_date, end_date=body.end_date, commercial_terms=body.commercial_terms,
    )
    db.add(p)
    audit(db, user, "programme.create", p)
    return p


def update_programme(db: Session, user: CurrentUser, programme_id: str, body: ProgrammePatch) -> Programme:
    p = get_owned(db, Programme, programme_id, user, "Programme")
    if p.status == "closed":
        raise Blocked("This programme is closed and can no longer be changed.")
    before = snapshot(p)
    changes = body.model_dump(exclude_unset=True)
    if "boundary" in changes:
        changes["boundary"] = _clean_boundary(changes["boundary"])
    if changes.get("eligible_crops") is not None:
        changes["eligible_crops"] = _check_crops(db, user.org_id, changes["eligible_crops"])
    if changes.get("commercial_terms") is not None:
        _check_lookback(changes["commercial_terms"])
    for k, v in changes.items():
        if v is None and k in ("name", "region", "eligible_crops", "commercial_terms"):
            continue
        setattr(p, k, v)
    if p.start_date and p.end_date and p.end_date < p.start_date:
        raise ValidationFailed("The programme end date can't be before its start date.")
    audit(db, user, "programme.update", p, before=before)
    return p


def change_programme_status(db: Session, user: CurrentUser, programme_id: str, target: str,
                            reason: str | None) -> Programme:
    p = get_owned(db, Programme, programme_id, user, "Programme")
    check_transition(PROGRAMME_TRANSITIONS, p.status, target, "programme")
    before = snapshot(p)
    p.status = target
    audit(db, user, f"programme.{target}", p, before=before, reason=reason)
    return p


def programme_summary(db: Session, user: CurrentUser, programme_id: str) -> dict[str, Any]:
    p = get_owned(db, Programme, programme_id, user, "Programme")
    by_status = dict(
        db.execute(
            select(Project.status, func.count()).where(Project.org_id == user.org_id, Project.programme_id == p.id)
            .group_by(Project.status)
        ).all()
    )
    enrolled = db.execute(
        select(Enrolment.field_id, Enrolment.farmer_id, Field.area_ha)
        .join(Project, Project.id == Enrolment.project_id)
        .join(Field, Field.id == Enrolment.field_id)
        .where(Enrolment.org_id == user.org_id, Project.programme_id == p.id, Enrolment.status == "enrolled")
    ).all()
    fields = {row.field_id: row.area_ha for row in enrolled}
    return {
        "programme_id": str(p.id),
        "status": p.status,
        "projects": sum(by_status.values()),
        "projects_by_status": by_status,
        "farmers_enrolled": len({row.farmer_id for row in enrolled}),
        "fields_enrolled": len(fields),
        "hectares_enrolled": round(sum(fields.values()), 4),
    }


# ------------------------------------------------------------------ projects
def list_projects(db: Session, user: CurrentUser, programme_id: str | None = None,
                  status: str | None = None) -> list[Project]:
    q = scoped(Project, user).order_by(Project.created_at.desc())
    if programme_id:
        q = q.where(Project.programme_id == get_owned(db, Programme, programme_id, user, "Programme").id)
    if status:
        q = q.where(Project.status == status)
    return list(db.scalars(q).all())


def _rule_pack_id(db: Session, user: CurrentUser, value: str | None) -> uuid.UUID | None:
    if value is None:
        return None
    from app.modules.methodology.models import RulePack

    return get_owned(db, RulePack, value, user, "Rule pack").id


def create_project(db: Session, user: CurrentUser, body: ProjectIn) -> Project:
    programme = get_owned(db, Programme, body.programme_id, user, "Programme")
    if programme.status == "closed":
        raise Blocked("Projects can't be added to a closed programme.")
    if db.scalar(scoped(Project, user).where(Project.code == body.code)):
        raise Conflict(f"A project with the code '{body.code}' already exists.", code="DUPLICATE_CODE")
    pr = Project(
        org_id=user.org_id, created_by=user.id, programme_id=programme.id, code=body.code, name=body.name,
        methodology_code=body.methodology_code, methodology_version=body.methodology_version,
        rule_pack_id=_rule_pack_id(db, user, body.rule_pack_id), baseline_start=body.baseline_start,
        crediting_start=body.crediting_start, crediting_end=body.crediting_end,
    )
    db.add(pr)
    audit(db, user, "project.create", pr)
    return pr


def update_project(db: Session, user: CurrentUser, project_id: str, body: ProjectPatch) -> Project:
    pr = get_owned(db, Project, project_id, user, "Project")
    if pr.status == "closed":
        raise Blocked("This project is closed and can no longer be changed.")
    before = snapshot(pr)
    changes = body.model_dump(exclude_unset=True)
    if "rule_pack_id" in changes:
        changes["rule_pack_id"] = _rule_pack_id(db, user, changes["rule_pack_id"])
    for k, v in changes.items():
        if v is None and k in ("name", "methodology_code", "methodology_version"):
            continue
        setattr(pr, k, v)
    if pr.crediting_start and pr.crediting_end and pr.crediting_end < pr.crediting_start:
        raise ValidationFailed("The crediting period end date can't be before its start date.")
    audit(db, user, "project.update", pr, before=before)
    return pr


def change_project_status(db: Session, user: CurrentUser, project_id: str, target: str,
                          reason: str | None) -> Project:
    pr = get_owned(db, Project, project_id, user, "Project")
    check_transition(PROJECT_TRANSITIONS, pr.status, target, "project")
    if target == "active":
        programme = db.get(Programme, pr.programme_id)
        if programme is None or programme.status != "active":
            raise Blocked("Activate the programme before activating one of its projects.")
    before = snapshot(pr)
    pr.status = target
    audit(db, user, f"project.{target}", pr, before=before, reason=reason)
    return pr
