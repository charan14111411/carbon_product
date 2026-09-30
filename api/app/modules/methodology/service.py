"""Methodology rule packs: enter each value with its source, approve with a second person."""

from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, ensure_not_author
from app.core.db import utcnow
from app.core.errors import Conflict, IllegalTransition, ImmutableRecord, NotFound, RuleMissing, ValidationFailed
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.identity.models import User
from app.modules.methodology import definitions as defs
from app.modules.methodology.models import Rule, RulePack
from app.modules.methodology.schemas import RulePackIn, RulePackPatch, RuleValueIn


# ------------------------------------------------------------------ helpers
def _uuid(value: Any) -> uuid.UUID | None:
    if value is None:
        return None
    if isinstance(value, uuid.UUID):
        return value
    try:
        return uuid.UUID(str(value))
    except ValueError:
        return None


def user_names(db: Session, org_id: uuid.UUID, ids: set[uuid.UUID | None]) -> dict[uuid.UUID, str]:
    wanted = {i for i in ids if i is not None}
    if not wanted:
        return {}
    rows = db.execute(select(User.id, User.full_name).where(User.org_id == org_id, User.id.in_(wanted))).all()
    return {r[0]: r[1] for r in rows}


def rules_of(db: Session, pack: RulePack) -> list[Rule]:
    return list(db.scalars(select(Rule).where(Rule.pack_id == pack.id, Rule.org_id == pack.org_id).order_by(Rule.key)))


def values_of(rules: list[Rule]) -> dict[str, Any]:
    return {r.key: (r.value or {}).get("value") for r in rules}


def _ensure_draft(pack: RulePack) -> None:
    if pack.status == "approved":
        raise ImmutableRecord(
            "This rule pack is approved and frozen. Create a new revision based on it to make changes.",
            code="PACK_APPROVED",
        )
    if pack.status != "draft":
        raise ImmutableRecord("This rule pack is retired and can't be changed.", code="PACK_RETIRED")


# ------------------------------------------------------------------ definitions
def definitions() -> dict:
    groups = []
    for gkey, glabel in defs.GROUPS.items():
        items = [
            {
                "key": r.key, "label": r.label, "kind": r.kind, "help": r.help, "required": r.required,
                "required_if": ({"key": r.required_if[0], "equals": r.required_if[1]} if r.required_if else None),
                "choices": list(r.choices), "unit": r.unit, "min": r.min, "max": r.max, "example": r.example,
            }
            for r in defs.RULES if r.group == gkey
        ]
        groups.append({"key": gkey, "label": glabel, "rules": items})
    return {"groups": groups, "total": len(defs.RULES)}


# ------------------------------------------------------------------ packs
def create_pack(db: Session, user: CurrentUser, body: RulePackIn) -> RulePack:
    base: RulePack | None = None
    if body.based_on_id:
        base = get_owned(db, RulePack, body.based_on_id, user, "Rule pack")
    current = db.scalar(
        select(func.max(RulePack.revision)).where(
            RulePack.org_id == user.org_id,
            RulePack.methodology_code == body.methodology_code,
            RulePack.methodology_version == body.methodology_version,
        )
    )
    pack = RulePack(
        org_id=user.org_id, created_by=user.id, methodology_code=body.methodology_code,
        methodology_version=body.methodology_version, revision=(current or 0) + 1, title=body.title,
        source_url=body.source_url, status="draft", based_on_id=base.id if base else None,
    )
    db.add(pack)
    db.flush()
    if base is not None:
        for r in rules_of(db, base):
            db.add(Rule(
                org_id=user.org_id, created_by=user.id, pack_id=pack.id, key=r.key, value=dict(r.value or {}),
                source_document=r.source_document, source_section=r.source_section, source_page=r.source_page,
                notes=r.notes or "", last_modified_by=r.last_modified_by,
                # Everyone who shaped the copied values keeps counting as an author for the four-eyes rule.
                editors=sorted({*(r.editors or []), str(user.id)}),
            ))
    audit(db, user, "rule_pack.create", pack)
    return pack


def update_pack(db: Session, user: CurrentUser, pack: RulePack, body: RulePackPatch) -> RulePack:
    _ensure_draft(pack)
    before = snapshot(pack)
    for k, v in body.model_dump(exclude_unset=True).items():
        if k == "title" and v is None:
            continue
        setattr(pack, k, v)
    audit(db, user, "rule_pack.update", pack, before=before)
    return pack


def list_packs(db: Session, user: CurrentUser, *, status: str | None = None, code: str | None = None) -> list[dict]:
    q = scoped(RulePack, user).order_by(RulePack.methodology_code, RulePack.methodology_version, RulePack.revision)
    if status:
        q = q.where(RulePack.status == status)
    if code:
        q = q.where(RulePack.methodology_code == code)
    packs = list(db.scalars(q))
    names = user_names(db, user.org_id, {p.created_by for p in packs} | {p.approved_by for p in packs})
    out = []
    for p in packs:
        vals = values_of(rules_of(db, p))
        out.append({**_pack_head(p, names), "outstanding_count": len(defs.outstanding(vals))})
    return out


def _pack_head(p: RulePack, names: dict) -> dict:
    return {
        "id": str(p.id), "methodology_code": p.methodology_code, "methodology_version": p.methodology_version,
        "revision": p.revision, "title": p.title, "source_url": p.source_url, "status": p.status,
        "based_on_id": str(p.based_on_id) if p.based_on_id else None,
        "created_by": names.get(p.created_by), "created_at": p.created_at.isoformat(),
        "approved_by": names.get(p.approved_by), "approved_at": p.approved_at.isoformat() if p.approved_at else None,
        "label": f"{p.methodology_code} v{p.methodology_version} rev {p.revision}",
    }


def pack_detail(db: Session, user: CurrentUser, pack: RulePack) -> dict:
    rules = rules_of(db, pack)
    ids: set = {pack.created_by, pack.approved_by}
    for r in rules:
        ids |= {r.created_by, r.last_modified_by}
    names = user_names(db, user.org_id, ids)
    items = []
    for r in rules:
        d = defs.BY_KEY.get(r.key)
        items.append({
            "key": r.key,
            "label": d.label if d else r.key,
            "kind": d.kind if d else "unknown",
            "group": d.group if d else None,
            "unit": d.unit if d else "",
            "value": (r.value or {}).get("value"),
            "source_document": r.source_document,
            "source_section": r.source_section,
            "source_page": r.source_page,
            "source": ", ".join(
                x for x in (r.source_document, r.source_section, f"p. {r.source_page}" if r.source_page else None) if x
            ),
            "notes": r.notes,
            "entered_by": names.get(r.created_by),
            "last_modified_by": names.get(r.last_modified_by),
            "updated_at": r.updated_at.isoformat() if r.updated_at else None,
            "data_class": "RECORDED",
        })
    return {**_pack_head(pack, names), "rules": items, "outstanding": defs.outstanding(values_of(rules))}


def readiness(db: Session, pack: RulePack) -> dict:
    vals = values_of(rules_of(db, pack))
    missing = defs.outstanding(vals)
    answered = sum(1 for r in defs.RULES if vals.get(r.key) is not None)
    return {
        "outstanding": missing,
        "outstanding_labels": [defs.BY_KEY[k].label for k in missing],
        "answered": answered,
        "total": len(defs.RULES),
        "can_approve": pack.status == "draft" and not missing,
    }


def set_rule(db: Session, user: CurrentUser, pack: RulePack, key: str, body: RuleValueIn) -> Rule:
    _ensure_draft(pack)
    d = defs.BY_KEY.get(key)
    if d is None:
        raise NotFound(f"There is no methodology rule called “{key}”.", details={"key": key})
    err = defs.validate_value(d, body.value)
    if err:
        raise ValidationFailed(f"{d.label}: {err}", code="INVALID_RULE_VALUE", details={"key": key, "message": err})
    rule = db.scalar(select(Rule).where(Rule.pack_id == pack.id, Rule.key == key))
    uid = str(user.id)
    if rule is None:
        rule = Rule(
            org_id=user.org_id, created_by=user.id, pack_id=pack.id, key=key, value={"value": body.value},
            source_document=body.source_document, source_section=body.source_section, source_page=body.source_page,
            notes=body.notes or "", last_modified_by=user.id, editors=[uid],
        )
        db.add(rule)
        audit(db, user, "rule.create", rule)
        return rule
    before = snapshot(rule)
    rule.value = {"value": body.value}
    rule.source_document = body.source_document
    rule.source_section = body.source_section
    rule.source_page = body.source_page
    rule.notes = body.notes or ""
    rule.last_modified_by = user.id
    if uid not in (rule.editors or []):
        rule.editors = [*(rule.editors or []), uid]  # new list so the JSON change is detected
    audit(db, user, "rule.update", rule, before=before)
    return rule


def delete_rule(db: Session, user: CurrentUser, pack: RulePack, key: str) -> None:
    _ensure_draft(pack)
    rule = db.scalar(select(Rule).where(Rule.pack_id == pack.id, Rule.key == key))
    if rule is None:
        raise NotFound("This rule has not been entered in the pack.", details={"key": key})
    audit(db, user, "rule.delete", rule, before=snapshot(rule))
    db.delete(rule)
    db.flush()


def approve(db: Session, user: CurrentUser, pack: RulePack) -> RulePack:
    if pack.status != "draft":
        raise IllegalTransition(f"Only a draft rule pack can be approved (this one is {pack.status}).")
    rules = rules_of(db, pack)
    authors: list[uuid.UUID | None] = [pack.created_by]
    for r in rules:
        authors.append(r.created_by)
        authors.append(r.last_modified_by)
        authors.extend(_uuid(e) for e in (r.editors or []))
    ensure_not_author(user.id, *authors, what="a rule pack")
    vals = values_of(rules)
    missing = defs.outstanding(vals)
    if missing:
        raise RuleMissing(
            "Some required rules have not been entered yet, so this pack can't be approved.",
            details={"outstanding": missing, "labels": [defs.BY_KEY[k].label for k in missing]},
        )
    invalid = {}
    for r in rules:
        d = defs.BY_KEY.get(r.key)
        if d is not None:
            err = defs.validate_value(d, vals[r.key])
            if err:
                invalid[r.key] = err
    if invalid:
        raise ValidationFailed("Some rule values are no longer valid. Correct them first.", code="INVALID_RULES",
                               details={"invalid": invalid})
    before = snapshot(pack)
    pack.status = "approved"
    pack.approved_by = user.id
    pack.approved_at = utcnow()
    audit(db, user, "rule_pack.approve", pack, before=before)
    return pack


def retire(db: Session, user: CurrentUser, pack: RulePack) -> RulePack:
    from app.modules.programmes.models import Project

    if pack.status == "retired":
        raise IllegalTransition("This rule pack is already retired.")
    in_use = db.scalars(select(Project.code).where(Project.org_id == user.org_id, Project.rule_pack_id == pack.id)).all()
    if in_use:
        raise Conflict(
            "This rule pack is still assigned to projects. Assign a different pack to them first.",
            code="PACK_IN_USE", details={"projects": list(in_use)},
        )
    before = snapshot(pack)
    pack.status = "retired"
    audit(db, user, "rule_pack.retire", pack, before=before)
    return pack


def assign_to_project(db: Session, user: CurrentUser, project_id: str, pack_id: str) -> dict:
    from app.modules.programmes.models import Project

    project = get_owned(db, Project, project_id, user, "Project")
    pack = get_owned(db, RulePack, pack_id, user, "Rule pack")
    if pack.status != "approved":
        raise ValidationFailed("Only an approved rule pack can be assigned to a project.", code="PACK_NOT_APPROVED")
    if (pack.methodology_code, pack.methodology_version) != (project.methodology_code, project.methodology_version):
        raise ValidationFailed(
            f"This project follows {project.methodology_code} v{project.methodology_version}, "
            f"but the pack is for {pack.methodology_code} v{pack.methodology_version}.",
            code="METHODOLOGY_MISMATCH",
        )
    before = snapshot(project)
    project.rule_pack_id = pack.id
    audit(db, user, "project.assign_rule_pack", project, before=before)
    return {"project_id": str(project.id), "rule_pack_id": str(pack.id),
            "label": f"{pack.methodology_code} v{pack.methodology_version} rev {pack.revision}"}
