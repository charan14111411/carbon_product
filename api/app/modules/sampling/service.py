"""Sampling: zones, campaigns, sample plans, point placement, field collection and custody."""

from __future__ import annotations

import secrets
import uuid
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core import geo
from app.core.auth import CurrentUser, ensure_not_author
from app.core.db import utcnow
from app.core.errors import (
    Blocked, Conflict, Forbidden, IllegalTransition, ImmutableRecord, NotFound, RuleMissing, ValidationFailed,
)
from app.core.permissions import P
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.identity.models import AuditEntry, User
from app.modules.land.models import Enrolment, Field
from app.modules.programmes.models import Project
from app.modules.sampling import domain
from app.modules.sampling.models import (
    Campaign, CustodyEvent, Sample, SamplePlan, SamplingPoint, Site, SoilLayer, Stratum,
)
from app.modules.sampling.schemas import (
    AssignIn, CampaignIn, CustodyIn, PlanIn, PlanPatch, SampleIn, StratumIn,
)


# ------------------------------------------------------------------ helpers
def _uuid(value: Any, what: str = "Record") -> uuid.UUID:
    if isinstance(value, uuid.UUID):
        return value
    try:
        return uuid.UUID(str(value))
    except (ValueError, TypeError) as exc:
        raise NotFound(f"{what} not found.") from exc


def _iso(v: date | datetime | None) -> str | None:
    if v is None:
        return None
    if isinstance(v, datetime):
        return domain.aware(v).isoformat()
    return v.isoformat()


def names(db: Session, org_id: uuid.UUID, ids: set) -> dict[uuid.UUID, str]:
    wanted = {i for i in ids if i is not None}
    if not wanted:
        return {}
    return {r[0]: r[1] for r in db.execute(
        select(User.id, User.full_name).where(User.org_id == org_id, User.id.in_(wanted))).all()}


def approved_rules(db: Session, project: Project) -> dict[str, Any] | None:
    """Values of the project's approved rule pack, or None if there is no approved pack."""
    from app.modules.methodology import ruleset

    if project.rule_pack_id is None:
        return None
    try:
        return dict(ruleset.for_project(db, project, require_approved=True).values)
    except RuleMissing:
        return None


def editors_from_audit(db: Session, org_id: uuid.UUID, entity_type: str, entity_id: uuid.UUID) -> set[uuid.UUID]:
    rows = db.scalars(select(AuditEntry.created_by).where(
        AuditEntry.org_id == org_id, AuditEntry.entity_type == entity_type, AuditEntry.entity_id == str(entity_id)))
    return {r for r in rows if r is not None}


def get_project(db: Session, user: CurrentUser, project_id: str) -> Project:
    return get_owned(db, Project, project_id, user, "Project")


def get_campaign(db: Session, user: CurrentUser, campaign_id: str) -> Campaign:
    return get_owned(db, Campaign, campaign_id, user, "Campaign")


def _project_of(db: Session, campaign: Campaign) -> Project:
    return db.get(Project, campaign.project_id)


# ------------------------------------------------------------------ strata
def open_strata(db: Session, org_id: uuid.UUID, project_id: uuid.UUID) -> list[Stratum]:
    return list(db.scalars(select(Stratum).where(
        Stratum.org_id == org_id, Stratum.project_id == project_id, Stratum.effective_to.is_(None)
    ).order_by(Stratum.code)))


def create_stratum(db: Session, user: CurrentUser, project: Project, body: StratumIn) -> Stratum:
    ids: list[uuid.UUID] = []
    for raw in body.field_ids:
        try:
            fid = uuid.UUID(raw)
        except ValueError as exc:
            raise ValidationFailed("One of the field ids is not valid.", code="INVALID_FIELD",
                                   details={"field_id": raw}) from exc
        if fid not in ids:
            ids.append(fid)
    enrolled = set(db.scalars(select(Enrolment.field_id).where(
        Enrolment.org_id == user.org_id, Enrolment.project_id == project.id, Enrolment.status == "enrolled")))
    missing = [str(f) for f in ids if f not in enrolled]
    if missing:
        raise ValidationFailed("Every field in a zone must be enrolled in this project.", code="FIELD_NOT_ENROLLED",
                               details={"field_ids": missing})
    fields = list(db.scalars(select(Field).where(Field.org_id == user.org_id, Field.id.in_(ids))))
    if len(fields) != len(ids):
        raise ValidationFailed("Some fields could not be found.", code="FIELD_NOT_ENROLLED")

    current = open_strata(db, user.org_id, project.id)
    previous = next((s for s in current if s.code == body.code), None)
    if body.role == "control":
        if body.control_for_code and not any(
            s.code == body.control_for_code and s.role == "project" for s in current
        ):
            raise ValidationFailed(f"There is no project zone with code {body.control_for_code}.",
                                   code="CONTROL_TARGET_MISSING")
    elif body.control_for_code:
        raise ValidationFailed("Only a control zone can name the zone it is a control for.", code="INVALID_STRATUM")
    if previous is not None and body.effective_from <= previous.effective_from:
        raise ValidationFailed(
            f"A new version of zone {body.code} must start after {previous.effective_from.isoformat()}.",
            code="STRATUM_DATE",
        )
    wanted = {str(f) for f in ids}
    clashes = []
    for s in current:
        if s is previous:
            continue
        shared = wanted & {str(x) for x in (s.field_ids or [])}
        if shared:
            clashes.append({"stratum": s.code, "field_ids": sorted(shared)})
    if clashes:
        raise Conflict("A field can belong to only one current zone.", code="FIELD_IN_OTHER_STRATUM",
                       details={"clashes": clashes})

    version = 1
    if previous is not None:
        before = snapshot(previous)
        previous.effective_to = body.effective_from - timedelta(days=1)
        audit(db, user, "stratum.close", previous, before=before)
        version = previous.version + 1
    s = Stratum(
        org_id=user.org_id, created_by=user.id, project_id=project.id, code=body.code, name=body.name,
        role=body.role, control_for_code=body.control_for_code, criteria=body.criteria,
        field_ids=[str(f) for f in ids], area_ha=round(sum(f.area_ha for f in fields), 4), version=version,
        effective_from=body.effective_from, effective_to=None,
    )
    db.add(s)
    audit(db, user, "stratum.create", s)
    return s


def stratum_out(s: Stratum, field_codes: dict[str, str] | None = None) -> dict:
    return {
        "id": str(s.id), "project_id": str(s.project_id), "code": s.code, "name": s.name, "role": s.role,
        "control_for_code": s.control_for_code, "criteria": s.criteria or {}, "field_ids": list(s.field_ids or []),
        "field_codes": [field_codes.get(f) for f in (s.field_ids or [])] if field_codes else None,
        "area_ha": s.area_ha, "area_data_class": "DERIVED", "version": s.version,
        "effective_from": _iso(s.effective_from), "effective_to": _iso(s.effective_to),
        "is_current": s.effective_to is None,
    }


def list_strata(db: Session, user: CurrentUser, project: Project, *, include_history: bool) -> list[dict]:
    q = scoped(Stratum, user).where(Stratum.project_id == project.id)
    if not include_history:
        q = q.where(Stratum.effective_to.is_(None))
    rows = list(db.scalars(q.order_by(Stratum.code, Stratum.version)))
    fids = {uuid.UUID(f) for s in rows for f in (s.field_ids or [])}
    codes = {str(f.id): f.code for f in db.scalars(select(Field).where(Field.id.in_(fids)))} if fids else {}
    return [stratum_out(s, codes) for s in rows]


# ------------------------------------------------------------------ campaigns
def create_campaign(db: Session, user: CurrentUser, project: Project, body: CampaignIn) -> Campaign:
    if db.scalar(select(Campaign.id).where(Campaign.org_id == user.org_id, Campaign.code == body.code)):
        raise Conflict(f"A campaign with code {body.code} already exists.", code="DUPLICATE_CODE")
    if body.planned_end < body.planned_start:
        raise ValidationFailed("The planned end must be on or after the planned start.", code="INVALID_DATES")
    if body.depth_to_cm <= body.depth_from_cm:
        raise ValidationFailed("The sampling depth must end deeper than it starts.", code="INVALID_DEPTH")

    paired_monitoring = body.kind == "monitoring" and body.design == "paired"
    revisited: Campaign | None = None
    if body.revisits_campaign_id:
        if body.kind == "baseline":
            raise ValidationFailed("A baseline campaign can't re-visit another campaign.", code="INVALID_REVISIT")
        revisited = get_owned(db, Campaign, body.revisits_campaign_id, user, "Campaign")
        if revisited.project_id != project.id or revisited.kind != "baseline":
            raise ValidationFailed("The re-visited campaign must be a baseline campaign of the same project.",
                                   code="INVALID_REVISIT")
    elif paired_monitoring:
        raise ValidationFailed("A paired monitoring campaign must name the baseline campaign it re-visits.",
                               code="REVISIT_REQUIRED")

    rules = approved_rules(db, project)
    if rules:
        design_rule = rules.get("sampling_design")
        if body.kind == "monitoring" and design_rule in ("paired", "independent") and design_rule != body.design:
            raise ValidationFailed(f"The methodology requires a {design_rule} monitoring design.",
                                   code="DESIGN_NOT_PERMITTED", details={"sampling_design": design_rule})
        stock_depth = rules.get("stock_depth_cm")
        if stock_depth is not None and body.depth_to_cm < stock_depth:
            raise ValidationFailed(f"The methodology requires sampling to at least {stock_depth:g} cm.",
                                   code="DEPTH_BELOW_RULE", details={"stock_depth_cm": stock_depth})
        if body.kind == "monitoring":
            reference = revisited or db.scalar(select(Campaign).where(
                Campaign.org_id == user.org_id, Campaign.project_id == project.id, Campaign.kind == "baseline"
            ).order_by(Campaign.planned_start))
            if reference is not None:
                years = domain.interval_years(reference.planned_start, body.planned_start)
                lo, hi = rules.get("monitoring_interval_min_years"), rules.get("monitoring_interval_max_years")
                if (lo is not None and years < lo) or (hi is not None and years > hi):
                    raise ValidationFailed(
                        f"This campaign starts {years:.1f} years after {reference.code}; the methodology allows "
                        f"{lo:g}–{hi:g} years." if lo is not None and hi is not None else
                        f"This campaign starts {years:.1f} years after {reference.code}, outside the allowed interval.",
                        code="MONITORING_INTERVAL",
                        details={"years": round(years, 2), "min_years": lo, "max_years": hi,
                                 "reference_campaign": reference.code},
                    )

    c = Campaign(
        org_id=user.org_id, created_by=user.id, project_id=project.id, code=body.code, name=body.name,
        kind=body.kind, design=body.design, revisits_campaign_id=revisited.id if revisited else None,
        planned_start=body.planned_start, planned_end=body.planned_end, depth_from_cm=body.depth_from_cm,
        depth_to_cm=body.depth_to_cm,
        placement_seed=body.placement_seed if body.placement_seed is not None else secrets.randbelow(2**31),
        status="planned",
    )
    db.add(c)
    audit(db, user, "campaign.create", c)
    return c


def campaign_progress(db: Session, c: Campaign) -> dict:
    from app.modules.lab.models import LabResult

    counts = Counter(dict(db.execute(select(SamplingPoint.status, func.count()).where(
        SamplingPoint.campaign_id == c.id).group_by(SamplingPoint.status)).all()))
    layer_ids = list(db.scalars(select(SoilLayer.id).join(Sample, Sample.id == SoilLayer.sample_id).where(
        Sample.campaign_id == c.id)))
    soc = 0
    if layer_ids:
        soc = db.scalar(select(func.count(func.distinct(LabResult.layer_id))).where(
            LabResult.layer_id.in_(layer_ids), LabResult.analyte == "soc_pct", LabResult.status == "accepted")) or 0
    total = sum(counts.values())
    return {
        "points_total": total, "points_planned": counts.get("planned", 0),
        "points_collected": counts.get("collected", 0), "points_skipped": counts.get("skipped", 0),
        "layers_total": len(layer_ids), "layers_with_accepted_soc": soc,
    }


def campaign_out(db: Session, c: Campaign, *, progress: bool = True) -> dict:
    out = {
        "id": str(c.id), "project_id": str(c.project_id), "code": c.code, "name": c.name, "kind": c.kind,
        "design": c.design, "revisits_campaign_id": str(c.revisits_campaign_id) if c.revisits_campaign_id else None,
        "planned_start": _iso(c.planned_start), "planned_end": _iso(c.planned_end),
        "depth_from_cm": c.depth_from_cm, "depth_to_cm": c.depth_to_cm, "placement_seed": c.placement_seed,
        "status": c.status, "next_status": domain.CAMPAIGN_FLOW.get(c.status),
    }
    if progress:
        out["progress"] = campaign_progress(db, c)
    return out


def set_campaign_status(db: Session, user: CurrentUser, c: Campaign, status: str) -> Campaign:
    domain.check_campaign_transition(c.status, status)
    if status == "fieldwork" and not db.scalar(select(SamplingPoint.id).where(SamplingPoint.campaign_id == c.id)):
        raise Blocked("Place the sampling points before starting fieldwork.", code="NO_POINTS")
    before = snapshot(c)
    c.status = status
    audit(db, user, "campaign.status", c, before=before)
    return c


# ------------------------------------------------------------------ sample plans
def _compute_n(method: str, n_required: int | None, inputs: dict) -> tuple[int, dict]:
    if method == "manual":
        if n_required is None:
            raise ValidationFailed("Enter the number of samples required.", code="INVALID_PLAN_INPUTS")
        return n_required, dict(inputs)
    try:
        mean = float(inputs["prior_mean"])
        sd = float(inputs["prior_sd"])
        err = float(inputs["target_error_pct"])
        conf = float(inputs.get("confidence", 0.90))
    except KeyError as exc:
        raise ValidationFailed(f"The sample-size formula needs “{exc.args[0]}”.", code="INVALID_PLAN_INPUTS",
                               details={"required": ["prior_mean", "prior_sd", "target_error_pct"]}) from exc
    except (TypeError, ValueError) as exc:
        raise ValidationFailed("The sample-size inputs must be numbers.", code="INVALID_PLAN_INPUTS") from exc
    n, z = domain.sample_size(mean, sd, err, conf)
    stored = {"prior_mean": mean, "prior_sd": sd, "target_error_pct": err, "confidence": conf,
              "z": round(z, 6), "n_formula": n}
    return max(n, n_required or 0), stored


def _floor(db: Session, project: Project) -> tuple[int | None, list[dict]]:
    """(minimum samples per zone, warnings). The floor is only known from an approved pack."""
    from app.modules.methodology import ruleset

    if project.rule_pack_id is None:
        return None, [{"code": "NO_RULE_PACK",
                       "message": "The project has no methodology rule pack, so the minimum samples per zone "
                                  "was not checked."}]
    try:
        rs = ruleset.for_project(db, project, require_approved=True)
    except RuleMissing:
        return None, [{"code": "RULE_PACK_NOT_APPROVED",
                       "message": "The project's methodology rules are not approved yet, so the minimum samples "
                                  "per zone was not checked."}]
    return int(rs.require("min_samples_per_stratum")), []


def _apply_floor(method: str, n: int, inputs: dict, floor: int | None) -> tuple[int, dict]:
    if floor is None or n >= floor:
        return n, inputs
    if method == "manual":
        raise ValidationFailed(
            f"The methodology requires at least {floor} samples per zone.", code="BELOW_MINIMUM_SAMPLES",
            details={"min_samples_per_stratum": floor, "n_required": n},
        )
    return floor, {**inputs, "floor_applied": floor}


def create_plan(db: Session, user: CurrentUser, campaign: Campaign, body: PlanIn) -> tuple[SamplePlan, list[dict]]:
    stratum = get_owned(db, Stratum, body.stratum_id, user, "Zone")
    if stratum.project_id != campaign.project_id:
        raise ValidationFailed("The zone belongs to a different project.", code="INVALID_STRATUM")
    if stratum.effective_to is not None:
        raise ValidationFailed("This zone version has been replaced. Use the current version.", code="STRATUM_CLOSED")
    if db.scalar(select(SamplePlan.id).where(SamplePlan.campaign_id == campaign.id,
                                             SamplePlan.stratum_id == stratum.id)):
        raise Conflict(f"Zone {stratum.code} already has a sample plan in this campaign.", code="PLAN_EXISTS")
    n, inputs = _compute_n(body.method, body.n_required, body.inputs)
    floor, warnings = _floor(db, _project_of(db, campaign))
    n, inputs = _apply_floor(body.method, n, inputs, floor)
    plan = SamplePlan(
        org_id=user.org_id, created_by=user.id, campaign_id=campaign.id, stratum_id=stratum.id, n_required=n,
        method=body.method, inputs=inputs, justification=body.justification, status="draft",
    )
    db.add(plan)
    audit(db, user, "sample_plan.create", plan)
    return plan, warnings


def update_plan(db: Session, user: CurrentUser, plan: SamplePlan, body: PlanPatch) -> tuple[SamplePlan, list[dict]]:
    if plan.status != "draft":
        raise ImmutableRecord("This sample plan is approved and can't be changed.", code="PLAN_APPROVED")
    method = body.method or plan.method
    inputs = body.inputs if body.inputs is not None else dict(plan.inputs or {})
    n_in = body.n_required if body.n_required is not None else (plan.n_required if method == "manual" else None)
    n, inputs = _compute_n(method, n_in, inputs)
    campaign = db.get(Campaign, plan.campaign_id)
    floor, warnings = _floor(db, _project_of(db, campaign))
    n, inputs = _apply_floor(method, n, inputs, floor)
    before = snapshot(plan)
    plan.method, plan.n_required, plan.inputs = method, n, inputs
    if body.justification is not None:
        plan.justification = body.justification
    audit(db, user, "sample_plan.update", plan, before=before)
    return plan, warnings


def approve_plan(db: Session, user: CurrentUser, plan: SamplePlan) -> SamplePlan:
    if plan.status != "draft":
        raise IllegalTransition("This sample plan is already approved.")
    ensure_not_author(user.id, plan.created_by, *editors_from_audit(db, user.org_id, "SamplePlan", plan.id),
                      what="a sample plan")
    campaign = db.get(Campaign, plan.campaign_id)
    floor, _ = _floor(db, _project_of(db, campaign))
    if floor is not None and plan.n_required < floor:
        raise Blocked(f"The methodology requires at least {floor} samples per zone.", code="BELOW_MINIMUM_SAMPLES")
    before = snapshot(plan)
    plan.status = "approved"
    plan.approved_by = user.id
    plan.approved_at = utcnow()
    audit(db, user, "sample_plan.approve", plan, before=before)
    return plan


def plan_out(db: Session, plan: SamplePlan, warnings: list[dict] | None = None) -> dict:
    st = db.get(Stratum, plan.stratum_id)
    nm = names(db, plan.org_id, {plan.created_by, plan.approved_by})
    return {
        "id": str(plan.id), "campaign_id": str(plan.campaign_id), "stratum_id": str(plan.stratum_id),
        "stratum_code": st.code if st else None, "n_required": plan.n_required, "method": plan.method,
        "inputs": plan.inputs or {}, "justification": plan.justification, "status": plan.status,
        "created_by": nm.get(plan.created_by), "approved_by": nm.get(plan.approved_by),
        "approved_at": _iso(plan.approved_at), "warnings": warnings or [],
        "floor_checked": not any(w["code"] in ("NO_RULE_PACK", "RULE_PACK_NOT_APPROVED") for w in (warnings or [])),
    }


def list_plans(db: Session, user: CurrentUser, campaign: Campaign) -> list[dict]:
    rows = db.scalars(scoped(SamplePlan, user).where(SamplePlan.campaign_id == campaign.id))
    return [plan_out(db, p) for p in rows]


# ------------------------------------------------------------------ point placement
def _next_site_number(db: Session, org_id: uuid.UUID, stratum_code: str) -> int:
    prefix = f"ST-{stratum_code}-"
    codes = db.scalars(select(Site.code).where(Site.org_id == org_id, Site.code.like(f"{prefix}%")))
    nums = [int(c[len(prefix):]) for c in codes if c[len(prefix):].isdigit()]
    return max(nums, default=0) + 1


def place_points(db: Session, user: CurrentUser, campaign: Campaign) -> dict:
    if db.scalar(select(SamplingPoint.id).where(SamplingPoint.campaign_id == campaign.id)):
        raise Conflict("Points have already been placed for this campaign.", code="POINTS_EXIST")
    if campaign.status != "planned":
        raise IllegalTransition("Points can only be placed while the campaign is planned.")
    strata = open_strata(db, user.org_id, campaign.project_id)
    if not strata:
        raise Blocked("Draw the project's zones before placing points.", code="NO_STRATA")
    plans = {p.stratum_id: p for p in db.scalars(select(SamplePlan).where(
        SamplePlan.campaign_id == campaign.id, SamplePlan.status == "approved"))}
    missing = [s.code for s in strata if s.id not in plans]
    if missing:
        raise Blocked("Every zone needs an approved sample plan for this campaign before points are placed.",
                      code="PLAN_MISSING", details={"strata": missing})

    created: list[SamplingPoint] = []
    if campaign.kind == "monitoring" and campaign.design == "paired":
        base = list(db.scalars(select(SamplingPoint).where(
            SamplingPoint.campaign_id == campaign.revisits_campaign_id).order_by(SamplingPoint.sequence)))
        if not base:
            raise Blocked("The baseline campaign has no placed points to re-visit.", code="BASELINE_NOT_PLACED")
        for i, bp in enumerate(base, start=1):
            pt = SamplingPoint(org_id=user.org_id, created_by=user.id, campaign_id=campaign.id, site_id=bp.site_id,
                               sequence=i, status="planned")
            db.add(pt)
            created.append(pt)
    else:
        seq = 0
        for s in strata:
            fields = [f for f in (db.get(Field, uuid.UUID(fid)) for fid in s.field_ids) if f is not None]
            if not fields:
                raise Blocked(f"Zone {s.code} has no fields.", code="NO_FIELDS")
            n = plans[s.id].n_required
            seed = campaign.placement_seed + domain.stratum_seed_offset(s.code)
            coords = geo.random_points([f.boundary for f in fields], n, seed)
            number = _next_site_number(db, user.org_id, s.code)
            for lat, lon in coords:
                fld = next((f for f in fields if geo.contains(f.boundary, lat, lon)), fields[0])
                site = Site(org_id=user.org_id, created_by=user.id, project_id=campaign.project_id, field_id=fld.id,
                            stratum_id=s.id, code=domain.site_code(s.code, number), latitude=lat, longitude=lon)
                db.add(site)
                db.flush()
                number += 1
                seq += 1
                pt = SamplingPoint(org_id=user.org_id, created_by=user.id, campaign_id=campaign.id, site_id=site.id,
                                   sequence=seq, status="planned")
                db.add(pt)
                created.append(pt)
    db.flush()
    audit(db, user, "campaign.place_points", campaign, reason=f"{len(created)} points placed")
    return {"campaign_id": str(campaign.id), "points_created": len(created), "seed": campaign.placement_seed}


def _point_rows(db: Session, user: CurrentUser, campaign: Campaign, *, assigned_to: uuid.UUID | None = None) -> list:
    q = (select(SamplingPoint, Site, Field)
         .join(Site, Site.id == SamplingPoint.site_id)
         .join(Field, Field.id == Site.field_id)
         .where(SamplingPoint.org_id == user.org_id, SamplingPoint.campaign_id == campaign.id)
         .order_by(SamplingPoint.sequence))
    if assigned_to is not None:
        q = q.where(SamplingPoint.assigned_to == assigned_to)
    return list(db.execute(q).all())


def point_out(pt: SamplingPoint, site: Site, fld: Field, nm: dict, stratum_codes: dict | None = None) -> dict:
    return {
        "id": str(pt.id), "campaign_id": str(pt.campaign_id), "site_id": str(site.id), "site_code": site.code,
        "latitude": site.latitude, "longitude": site.longitude, "field_id": str(fld.id), "field_code": fld.code,
        "stratum_code": (stratum_codes or {}).get(site.stratum_id), "sequence": pt.sequence, "status": pt.status,
        "skip_reason": pt.skip_reason, "assigned_to": str(pt.assigned_to) if pt.assigned_to else None,
        "assigned_to_name": nm.get(pt.assigned_to),
    }


def list_points(db: Session, user: CurrentUser, campaign: Campaign, *, assigned_to: uuid.UUID | None = None) -> list:
    rows = _point_rows(db, user, campaign, assigned_to=assigned_to)
    nm = names(db, user.org_id, {r[0].assigned_to for r in rows})
    sc = {s.id: s.code for s in db.scalars(select(Stratum).where(Stratum.project_id == campaign.project_id))}
    return [point_out(p, s, f, nm, sc) for p, s, f in rows]


def points_geojson(db: Session, user: CurrentUser, campaign: Campaign) -> dict:
    return {
        "type": "FeatureCollection",
        "features": [
            {"type": "Feature", "geometry": {"type": "Point", "coordinates": [p["longitude"], p["latitude"]]},
             "properties": {k: v for k, v in p.items() if k not in ("latitude", "longitude")}}
            for p in list_points(db, user, campaign)
        ],
    }


# ------------------------------------------------------------------ assignment
def assign(db: Session, user: CurrentUser, campaign: Campaign, body: AssignIn) -> dict:
    collector = get_owned(db, User, body.user_id, user, "User")
    if collector.role != "field_collector" or not collector.is_active:
        raise ValidationFailed("Points can only be assigned to an active field collector.", code="NOT_A_COLLECTOR")
    ids = {_uuid(p, "Point") for p in body.point_ids}
    points = list(db.scalars(select(SamplingPoint).where(
        SamplingPoint.org_id == user.org_id, SamplingPoint.campaign_id == campaign.id, SamplingPoint.id.in_(ids))))
    if len(points) != len(ids):
        raise NotFound("Some points were not found in this campaign.")
    done = [str(p.id) for p in points if p.status != "planned"]
    if done:
        raise Conflict("Only points that are still planned can be assigned.", code="POINT_NOT_PLANNED",
                       details={"point_ids": done})
    for p in points:
        before = snapshot(p)
        p.assigned_to = collector.id
        audit(db, user, "sampling_point.assign", p, before=before)
    return {"assigned": len(points), "user_id": str(collector.id), "user_name": collector.full_name}


def my_assignments(db: Session, user: CurrentUser) -> list[dict]:
    camp_ids = set(db.scalars(select(SamplingPoint.campaign_id).where(
        SamplingPoint.org_id == user.org_id, SamplingPoint.assigned_to == user.id)))
    out = []
    for c in db.scalars(select(Campaign).where(Campaign.id.in_(camp_ids)).order_by(Campaign.planned_start)):
        pts = list_points(db, user, c, assigned_to=user.id)
        out.append({**campaign_out(db, c, progress=False), "points": pts,
                    "remaining": sum(1 for p in pts if p["status"] == "planned")})
    return out


def bundle(db: Session, user: CurrentUser, campaign: Campaign) -> dict:
    project = _project_of(db, campaign)
    rules = approved_rules(db, project) or {}
    if user.can(P.PLAN_SAMPLING):
        pts = list_points(db, user, campaign)
    else:
        pts = list_points(db, user, campaign, assigned_to=user.id)
    field_ids = {uuid.UUID(fid) for s in open_strata(db, user.org_id, project.id) for fid in s.field_ids}
    field_ids |= {uuid.UUID(p["field_id"]) for p in pts}
    fields = list(db.scalars(select(Field).where(Field.org_id == user.org_id, Field.id.in_(field_ids)))) \
        if field_ids else []
    return {
        "generated_at": utcnow().isoformat(),
        "campaign": campaign_out(db, campaign, progress=False),
        "project": {"id": str(project.id), "code": project.code, "name": project.name},
        "depth": {"from_cm": campaign.depth_from_cm, "to_cm": campaign.depth_to_cm},
        "rules": {
            "approved": bool(rules),
            "gps_accuracy_max_m": rules.get("gps_accuracy_max_m"),
            "max_distance_from_site_m": rules.get("max_distance_from_site_m"),
            "required_photos": rules.get("required_photos"),
            "shallow_soil_allowed": rules.get("shallow_soil_allowed"),
        },
        "points": pts,
        "fields": {"type": "FeatureCollection", "features": [
            {"type": "Feature", "geometry": f.boundary,
             "properties": {"id": str(f.id), "code": f.code, "name": f.name, "area_ha": f.area_ha}}
            for f in fields
        ]},
    }


# ------------------------------------------------------------------ samples
def _monitoring_ordinal(db: Session, campaign: Campaign) -> int:
    rows = list(db.scalars(select(Campaign).where(
        Campaign.org_id == campaign.org_id, Campaign.project_id == campaign.project_id,
        Campaign.kind == "monitoring").order_by(Campaign.planned_start, Campaign.created_at)))
    return next(i for i, c in enumerate(rows, start=1) if c.id == campaign.id)


def _context_snapshot(db: Session, sample_in: SampleIn, site: Site, user: CurrentUser, distance: float) -> dict:
    from app.modules.intelligence.models import SatelliteIndex
    from app.modules.supporting.models import Observation

    day = domain.aware(sample_in.collected_at).date()
    na = {"status": "not_available", "reason": "supporting data not synced"}
    obs = list(db.scalars(select(Observation).where(
        Observation.org_id == user.org_id, Observation.field_id == site.field_id, Observation.observed_on == day)))

    def pack(rows: list) -> dict:
        if not rows:
            return dict(na)
        return {"status": "available", "values": [
            {"parameter": o.parameter, "value": o.value, "unit": o.unit, "provider": o.provider, "tier": o.tier,
             "quality": o.quality, "data_class": o.data_class} for o in rows]}

    sat = list(db.scalars(select(SatelliteIndex).where(
        SatelliteIndex.org_id == user.org_id, SatelliteIndex.field_id == site.field_id,
        SatelliteIndex.observed_on == day)))
    return {
        "location": {"latitude": sample_in.latitude, "longitude": sample_in.longitude,
                     "gps_accuracy_m": sample_in.gps_accuracy_m},
        "time": domain.aware(sample_in.collected_at).isoformat(),
        "collector": {"id": str(user.id), "name": user.full_name},
        "distance_m": round(distance, 2),
        "weather": pack([o for o in obs if not o.parameter.startswith("soil_")]),
        "sensor": pack([o for o in obs if o.parameter.startswith("soil_")]),
        "satellite": ({"status": "available", "values": [
            {"index": s.index_name, "value": s.value, "cloud_pct": s.cloud_pct, "source": s.source,
             "data_class": "OBSERVED"} for s in sat]} if sat else dict(na)),
    }


def submit_sample(db: Session, user: CurrentUser, body: SampleIn) -> tuple[Sample, bool, list]:
    """Record a core from the field app. Returns (sample, replayed, findings)."""
    from app.modules.evidence.models import EvidenceFile
    from app.modules.qa import service as qa

    existing = db.scalar(select(Sample).where(Sample.client_ref == body.client_ref))
    if existing is not None:
        if existing.org_id != user.org_id:
            raise Conflict("This sync reference has already been used. The app must generate a new one.",
                           code="IDEMPOTENCY_KEY_REUSED")
        if str(existing.point_id) != body.point_id:
            raise Conflict("This sync reference was already used for a different point.",
                           code="IDEMPOTENCY_KEY_REUSED")
        return existing, True, sample_findings(db, existing)

    point = get_owned(db, SamplingPoint, body.point_id, user, "Point")
    if point.status != "planned":
        raise Conflict(f"This point is already {point.status}.", code="POINT_NOT_PLANNED")
    if point.assigned_to != user.id and not user.can(P.PLAN_SAMPLING):
        raise Forbidden("This point is not assigned to you.", code="NOT_ASSIGNED")
    campaign = db.get(Campaign, point.campaign_id)
    if campaign.status == "complete":
        raise Blocked("This campaign is complete and no longer accepts samples.", code="CAMPAIGN_CLOSED")
    site = db.get(Site, point.site_id)

    collected_at = domain.aware(body.collected_at)
    if collected_at > utcnow() + timedelta(hours=1):
        raise ValidationFailed("The collection time is in the future. Check the device clock.",
                               code="COLLECTED_IN_FUTURE")

    layers = [(lay.depth_from_cm, lay.depth_to_cm) for lay in body.layers]
    problems = domain.layer_problems(layers, campaign.depth_from_cm)
    if domain.coverage_to(layers) > body.depth_reached_cm + domain.DEPTH_TOLERANCE:
        problems.append("A layer goes deeper than the core reached.")
    if problems:
        raise ValidationFailed("The soil layers don't fit together: " + " ".join(problems), code="LAYER_DEPTHS",
                               details={"problems": problems})
    if body.depth_reached_cm < campaign.depth_to_cm - domain.DEPTH_TOLERANCE and not (body.deviation_reason or "").strip():
        raise ValidationFailed(
            f"The core reached {body.depth_reached_cm:g} cm but the campaign needs {campaign.depth_to_cm:g} cm. "
            "Give the reason (for example: rock).", code="SHALLOW_CORE",
        )
    labels = [lay.label_qr for lay in body.layers]
    if len(set(labels)) != len(labels):
        raise ValidationFailed("Each bag must have its own label.", code="DUPLICATE_LABEL")
    used = list(db.scalars(select(SoilLayer.label_qr).where(SoilLayer.label_qr.in_(labels))))
    if used:
        raise Conflict("Some bag labels have already been used.", code="DUPLICATE_LABEL", details={"labels": used})

    photo_ids = []
    for pid in dict.fromkeys(body.photo_ids):
        ev = get_owned(db, EvidenceFile, pid, user, "Photo")
        if ev.kind != "photo":
            raise ValidationFailed("Only photos can be attached to a core.", code="NOT_A_PHOTO",
                                   details={"evidence_id": pid})
        photo_ids.append(str(ev.id))

    distance = geo.distance_m(site.latitude, site.longitude, body.latitude, body.longitude)
    token = domain.campaign_token(campaign.kind, _monitoring_ordinal(db, campaign)
                                  if campaign.kind == "monitoring" else None)
    code = f"{site.code}-{token}"
    if db.scalar(select(Sample.id).where(Sample.code == code)):
        raise Conflict(f"A sample with code {code} already exists.", code="DUPLICATE_SAMPLE")

    sample = Sample(
        org_id=user.org_id, created_by=user.id, point_id=point.id, campaign_id=campaign.id, site_id=site.id,
        code=code, collected_at=collected_at, latitude=body.latitude, longitude=body.longitude,
        gps_accuracy_m=body.gps_accuracy_m, distance_from_site_m=round(distance, 3),
        depth_reached_cm=body.depth_reached_cm, photo_ids=photo_ids, deviation_reason=body.deviation_reason,
        device_id=body.device_id, client_ref=body.client_ref,
        context=_context_snapshot(db, body, site, user, distance),
    )
    db.add(sample)
    db.flush()
    for i, lay in enumerate(sorted(body.layers, key=lambda x: x.depth_from_cm), start=1):
        db.add(SoilLayer(org_id=user.org_id, created_by=user.id, sample_id=sample.id, code=f"{code}-D{i}",
                         label_qr=lay.label_qr, depth_from_cm=lay.depth_from_cm, depth_to_cm=lay.depth_to_cm))
    db.add(CustodyEvent(org_id=user.org_id, created_by=user.id, sample_id=sample.id, event="collected",
                        occurred_at=collected_at, location=f"{body.latitude:.6f},{body.longitude:.6f}",
                        notes="Recorded by the field app"))
    before = snapshot(point)
    point.status = "collected"
    audit(db, user, "sampling_point.collected", point, before=before)
    audit(db, user, "sample.create", sample)
    findings = qa.run_checks(db, user, _project_of(db, campaign), sample_ids={sample.id})
    return sample, False, [qa.finding_out(f) for f in findings]


def sample_findings(db: Session, sample: Sample) -> list[dict]:
    from app.modules.qa import service as qa
    from app.modules.qa.models import QAFinding

    rows = db.scalars(select(QAFinding).where(QAFinding.org_id == sample.org_id,
                                              QAFinding.entity_id == str(sample.id),
                                              QAFinding.status.in_(qa.ACTIVE)))
    return [qa.finding_out(f) for f in rows]


def skip_point(db: Session, user: CurrentUser, point: SamplingPoint, reason: str) -> SamplingPoint:
    if point.status != "planned":
        raise Conflict(f"This point is already {point.status}.", code="POINT_NOT_PLANNED")
    if point.assigned_to != user.id and not user.can(P.PLAN_SAMPLING):
        raise Forbidden("This point is not assigned to you.", code="NOT_ASSIGNED")
    before = snapshot(point)
    point.status = "skipped"
    point.skip_reason = reason
    audit(db, user, "sampling_point.skip", point, before=before, reason=reason)
    return point


# ------------------------------------------------------------------ custody
def chain_of(db: Session, sample: Sample) -> list[CustodyEvent]:
    return list(db.scalars(select(CustodyEvent).where(CustodyEvent.sample_id == sample.id)
                           .order_by(CustodyEvent.created_at, CustodyEvent.occurred_at)))


def _steps(chain: list[CustodyEvent]) -> list[domain.CustodyStep]:
    return [domain.CustodyStep(str(e.id), e.event, e.occurred_at) for e in chain]


def add_custody(db: Session, user: CurrentUser, sample: Sample, body: CustodyIn) -> CustodyEvent:
    chain = chain_of(db, sample)
    domain.check_custody(
        _steps(chain), event=body.event, occurred_at=body.occurred_at, seal_intact=body.seal_intact,
        count_matches=body.count_matches, notes=body.notes, corrects_event_id=body.corrects_event_id,
    )
    ev = CustodyEvent(
        org_id=user.org_id, created_by=user.id, sample_id=sample.id, event=body.event,
        occurred_at=domain.aware(body.occurred_at), location=body.location, seal_intact=body.seal_intact,
        count_matches=body.count_matches, notes=body.notes,
        corrects_event_id=uuid.UUID(body.corrects_event_id) if body.corrects_event_id else None,
    )
    db.add(ev)
    audit(db, user, "custody.record", ev)
    return ev


def custody_out(e: CustodyEvent, nm: dict) -> dict:
    return {
        "id": str(e.id), "event": e.event, "occurred_at": _iso(e.occurred_at), "location": e.location,
        "seal_intact": e.seal_intact, "count_matches": e.count_matches, "notes": e.notes,
        "corrects_event_id": str(e.corrects_event_id) if e.corrects_event_id else None,
        "recorded_by": nm.get(e.created_by), "recorded_at": _iso(e.created_at),
    }


def custody_list(db: Session, user: CurrentUser, sample: Sample) -> dict:
    chain = chain_of(db, sample)
    nm = names(db, user.org_id, {e.created_by for e in chain})
    return {"sample_id": str(sample.id), "sample_code": sample.code, "status": domain.custody_status(_steps(chain)),
            "events": [custody_out(e, nm) for e in chain]}


# ------------------------------------------------------------------ reads
def _layers(db: Session, sample: Sample) -> list[SoilLayer]:
    return list(db.scalars(select(SoilLayer).where(SoilLayer.sample_id == sample.id)
                           .order_by(SoilLayer.depth_from_cm)))


def sample_summary(db: Session, s: Sample, *, status: str | None = None, site: Site | None = None) -> dict:
    site = site or db.get(Site, s.site_id)
    return {
        "id": str(s.id), "code": s.code, "campaign_id": str(s.campaign_id), "point_id": str(s.point_id),
        "site_id": str(s.site_id), "site_code": site.code if site else None, "collected_at": _iso(s.collected_at),
        "latitude": s.latitude, "longitude": s.longitude, "gps_accuracy_m": s.gps_accuracy_m,
        "distance_from_site_m": s.distance_from_site_m, "depth_reached_cm": s.depth_reached_cm,
        "deviation_reason": s.deviation_reason, "device_id": s.device_id, "client_ref": s.client_ref,
        "photo_ids": list(s.photo_ids or []),
        "status": status or domain.custody_status(_steps(chain_of(db, s))), "data_class": "MEASURED",
    }


def list_samples(db: Session, user: CurrentUser, *, campaign_id: str | None, status: str | None,
                 limit: int = 500) -> list[dict]:
    q = scoped(Sample, user).order_by(Sample.code)
    if campaign_id:
        q = q.where(Sample.campaign_id == _uuid(campaign_id, "Campaign"))
    rows = list(db.scalars(q.limit(5000)))
    chains: dict[uuid.UUID, list] = defaultdict(list)
    if rows:
        for e in db.scalars(select(CustodyEvent).where(CustodyEvent.sample_id.in_([s.id for s in rows]))):
            chains[e.sample_id].append(domain.CustodyStep(str(e.id), e.event, e.occurred_at))
    out = []
    for s in rows:
        st = domain.custody_status(chains.get(s.id, []))
        if status and st != status:
            continue
        out.append(sample_summary(db, s, status=st))
        if len(out) >= limit:
            break
    return out


def sample_detail(db: Session, user: CurrentUser, s: Sample) -> dict:
    from app.modules.evidence.models import EvidenceFile
    from app.modules.lab.models import LabResult

    layers = _layers(db, s)
    results = list(db.scalars(select(LabResult).where(
        LabResult.org_id == user.org_id, LabResult.layer_id.in_([lay.id for lay in layers])
    ).order_by(LabResult.analyte, LabResult.version))) if layers else []
    by_layer: dict[uuid.UUID, list] = defaultdict(list)
    for r in results:
        by_layer[r.layer_id].append({
            "id": str(r.id), "analyte": r.analyte, "value": r.value, "unit": r.unit, "method": r.method,
            "status": r.status, "version": r.version, "analysed_on": _iso(r.analysed_on), "data_class": "MEASURED",
        })
    photos = []
    for pid in s.photo_ids or []:
        ev = db.get(EvidenceFile, uuid.UUID(pid))
        if ev is not None and ev.org_id == user.org_id:
            photos.append({"id": str(ev.id), "filename": ev.filename, "sha256": ev.sha256,
                           "latitude": ev.latitude, "longitude": ev.longitude})
    custody = custody_list(db, user, s)
    return {
        **sample_summary(db, s, status=custody["status"]),
        "context": s.context or {},
        "layers": [{"id": str(lay.id), "code": lay.code, "label_qr": lay.label_qr,
                    "depth_from_cm": lay.depth_from_cm, "depth_to_cm": lay.depth_to_cm,
                    "lab_results": by_layer.get(lay.id, [])} for lay in layers],
        "custody": custody["events"],
        "photos": photos,
        "collected_by": names(db, user.org_id, {s.created_by}).get(s.created_by),
    }


def trace(db: Session, user: CurrentUser, code: str) -> dict:
    from app.modules.lab.models import LabBatch

    code = code.strip()
    sample = db.scalar(scoped(Sample, user).where(Sample.code == code))
    matched = "sample"
    layer = None
    if sample is None:
        layer = db.scalar(scoped(SoilLayer, user).where((SoilLayer.code == code) | (SoilLayer.label_qr == code)))
        if layer is None:
            raise NotFound("No sample or bag has this code.")
        sample = db.get(Sample, layer.sample_id)
        matched = "bag"
    site = db.get(Site, sample.site_id)
    fld = db.get(Field, site.field_id)
    campaign = db.get(Campaign, sample.campaign_id)
    project = db.get(Project, campaign.project_id)
    stratum = db.get(Stratum, site.stratum_id)
    point = db.get(SamplingPoint, sample.point_id)
    detail = sample_detail(db, user, sample)
    layer_ids = {lay["id"] for lay in detail["layers"]}
    batches = [
        {"id": str(b.id), "code": b.code, "status": b.status, "lab_id": str(b.lab_id),
         "layer_ids": [x for x in b.layer_ids if x in layer_ids]}
        for b in db.scalars(select(LabBatch).where(LabBatch.org_id == user.org_id,
                                                   LabBatch.campaign_id == campaign.id))
        if layer_ids & set(b.layer_ids or [])
    ]
    return {
        "matched": matched, "query": code, "bag": ({"id": str(layer.id), "code": layer.code,
                                                    "label_qr": layer.label_qr} if layer else None),
        "project": {"id": str(project.id), "code": project.code, "name": project.name},
        "campaign": campaign_out(db, campaign, progress=False),
        "stratum": {"id": str(stratum.id), "code": stratum.code, "name": stratum.name} if stratum else None,
        "site": {"id": str(site.id), "code": site.code, "latitude": site.latitude, "longitude": site.longitude},
        "field": {"id": str(fld.id), "code": fld.code, "name": fld.name},
        "point": {"id": str(point.id), "status": point.status,
                  "assigned_to": names(db, user.org_id, {point.assigned_to}).get(point.assigned_to)},
        "sample": detail,
        "lab_batches": batches,
    }


def get_sample(db: Session, user: CurrentUser, sample_id: str) -> Sample:
    return get_owned(db, Sample, sample_id, user, "Sample")


def get_point(db: Session, user: CurrentUser, point_id: str) -> SamplingPoint:
    return get_owned(db, SamplingPoint, point_id, user, "Point")
