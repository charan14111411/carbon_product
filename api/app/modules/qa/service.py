"""Run the quality checks for a project and keep the findings table in step with them.

Public API for other modules:
* ``run_project_checks(db, user_or_none, project)`` – run every rule, return counts.
* ``blocking_findings(db, project_id)`` – open/acknowledged blocking findings (stop calculation).
"""

from __future__ import annotations

import uuid
from collections import Counter, defaultdict
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.db import utcnow
from app.core.errors import Blocked, IllegalTransition
from app.core.tenancy import audit, snapshot
from app.modules.qa import engine
from app.modules.qa.models import SEVERITIES, QAFinding

AUTO_RESOLVED_NOTE = "Resolved automatically: check now passes"
ACTIVE = ("open", "acknowledged")


# ------------------------------------------------------------------ rules for a project
def project_rules(db: Session, project) -> dict[str, Any]:
    """Values of the project's *approved* rule pack, or {} (every threshold then reads as not configured)."""
    from app.core.errors import RuleMissing
    from app.modules.methodology import ruleset

    if getattr(project, "rule_pack_id", None) is None:
        return {}
    try:
        return dict(ruleset.for_project(db, project, require_approved=True).values)
    except RuleMissing:
        return {}


# ------------------------------------------------------------------ context building
def _contexts(db: Session, project, *, sample_ids: set[uuid.UUID] | None = None) -> list[Any]:
    from app.modules.lab.models import LabResult
    from app.modules.land.models import Field
    from app.modules.sampling.models import (
        Campaign, CustodyEvent, Sample, SamplePlan, SamplingPoint, Site, SoilLayer, Stratum,
    )

    rules = project_rules(db, project)
    org = project.org_id
    campaigns = {c.id: c for c in db.scalars(select(Campaign).where(Campaign.org_id == org,
                                                                    Campaign.project_id == project.id))}
    if not campaigns:
        return []
    sq = select(Sample).where(Sample.org_id == org, Sample.campaign_id.in_(list(campaigns)))
    if sample_ids is not None:
        sq = sq.where(Sample.id.in_(list(sample_ids)))
    samples = list(db.scalars(sq))
    sample_by_id = {s.id: s for s in samples}
    sites = {s.id: s for s in db.scalars(select(Site).where(Site.org_id == org, Site.project_id == project.id))}
    field_ids = {s.field_id for s in sites.values()}
    fields = {f.id: f for f in db.scalars(select(Field).where(Field.id.in_(list(field_ids))))} if field_ids else {}
    layers_by_sample: dict[uuid.UUID, list] = defaultdict(list)
    custody_by_sample: dict[uuid.UUID, list] = defaultdict(list)
    results_by_layer: dict[uuid.UUID, list] = defaultdict(list)
    if samples:
        ids = list(sample_by_id)
        for layer in db.scalars(select(SoilLayer).where(SoilLayer.sample_id.in_(ids))):
            layers_by_sample[layer.sample_id].append(layer)
        for ev in db.scalars(select(CustodyEvent).where(CustodyEvent.sample_id.in_(ids))
                             .order_by(CustodyEvent.created_at)):
            custody_by_sample[ev.sample_id].append(ev.event)
        layer_ids = [lay.id for ls in layers_by_sample.values() for lay in ls]
        if layer_ids:
            for r in db.scalars(select(LabResult).where(LabResult.org_id == org, LabResult.layer_id.in_(layer_ids))):
                results_by_layer[r.layer_id].append(r)

    ctxs: list[Any] = []
    for s in samples:
        site = sites.get(s.site_id)
        fld = fields.get(site.field_id) if site else None
        camp = campaigns[s.campaign_id]
        layers = layers_by_sample.get(s.id, [])
        has_results = any(results_by_layer.get(lay.id) for lay in layers)
        ctxs.append(engine.SampleCtx(
            entity_id=str(s.id), code=s.code, latitude=s.latitude, longitude=s.longitude,
            gps_accuracy_m=s.gps_accuracy_m, distance_from_site_m=s.distance_from_site_m,
            depth_reached_cm=s.depth_reached_cm, photo_count=len(s.photo_ids or []),
            deviation_reason=s.deviation_reason, field_boundary=fld.boundary if fld else None,
            field_code=fld.code if fld else None, campaign_depth_from_cm=camp.depth_from_cm,
            campaign_depth_to_cm=camp.depth_to_cm, layers=[(lay.depth_from_cm, lay.depth_to_cm) for lay in layers],
            custody_events=custody_by_sample.get(s.id, []), has_lab_results=has_results, rules=rules,
        ))
    if sample_ids is not None:
        return ctxs  # a sync only re-checks the samples just received

    for s in samples:
        collected_on = s.collected_at.date()
        for lay in layers_by_sample.get(s.id, []):
            results = results_by_layer.get(lay.id, [])
            ctxs.append(engine.LayerCtx(
                entity_id=str(lay.id), code=lay.code,
                accepted_analytes={r.analyte for r in results if r.status == "accepted"}, rules=rules,
            ))
            for r in results:
                ctxs.append(engine.ResultCtx(
                    entity_id=str(r.id), layer_code=lay.code, analyte=r.analyte, value=r.value, method=r.method,
                    status=r.status, analysed_on=r.analysed_on, collected_on=collected_on,
                    has_certificate=r.certificate_id is not None, rules=rules,
                ))

    # zones: collected samples per stratum code per campaign
    strata = {st.id: st for st in db.scalars(select(Stratum).where(Stratum.org_id == org,
                                                                   Stratum.project_id == project.id))}
    collected: Counter = Counter()
    for s in samples:
        site = sites.get(s.site_id)
        st = strata.get(site.stratum_id) if site else None
        if st is not None:
            collected[(s.campaign_id, st.code)] += 1
    plans = db.scalars(select(SamplePlan).where(SamplePlan.org_id == org,
                                                SamplePlan.campaign_id.in_(list(campaigns))))
    for p in plans:
        st = strata.get(p.stratum_id)
        if st is None:
            continue
        ctxs.append(engine.PlanCtx(
            entity_id=str(p.id), stratum_code=st.code, campaign_code=campaigns[p.campaign_id].code,
            plan_status=p.status, plan_n=p.n_required, collected=collected[(p.campaign_id, st.code)], rules=rules,
        ))

    # pairing in paired monitoring campaigns
    for camp in campaigns.values():
        if camp.kind != "monitoring" or camp.design != "paired" or camp.revisits_campaign_id is None:
            continue
        base_collected = {
            p.site_id for p in db.scalars(select(SamplingPoint).where(
                SamplingPoint.campaign_id == camp.revisits_campaign_id, SamplingPoint.status == "collected"))
        }
        for pt in db.scalars(select(SamplingPoint).where(SamplingPoint.campaign_id == camp.id)):
            site = sites.get(pt.site_id)
            ctxs.append(engine.PairCtx(
                entity_id=str(pt.id), site_code=site.code if site else "?", campaign_code=camp.code,
                campaign_status=camp.status, point_status=pt.status,
                baseline_collected=pt.site_id in base_collected, rules=rules,
            ))
    return ctxs


# ------------------------------------------------------------------ upsert
def run_checks(
    db: Session, user: CurrentUser | None, project, *, sample_ids: set[uuid.UUID] | None = None
) -> list[QAFinding]:
    """Evaluate rules, upsert findings, auto-resolve those that now pass. Returns active findings checked."""
    contexts = _contexts(db, project, sample_ids=sample_ids)
    found, checked = engine.evaluate(contexts)
    by_key = {(f.entity_type, f.entity_id, f.rule_code): f for f in found}

    existing: dict[tuple[str, str, str], QAFinding] = {}
    entity_ids = list({k[1] for k in checked})
    if entity_ids:
        rows = db.scalars(
            select(QAFinding).where(QAFinding.org_id == project.org_id, QAFinding.project_id == project.id,
                                    QAFinding.entity_id.in_(entity_ids)).order_by(QAFinding.created_at)
        )
        for row in rows:
            existing[(row.entity_type, row.entity_id, row.rule_code)] = row  # latest wins

    now = utcnow()
    active: list[QAFinding] = []
    for key in sorted(checked):
        f = by_key.get(key)
        row = existing.get(key)
        if f is not None:
            if row is not None and row.status in ACTIVE:
                if (row.severity, row.message, row.details) != (f.severity, f.message, f.details):
                    before = snapshot(row)
                    row.severity, row.message, row.details = f.severity, f.message, dict(f.details)
                    audit(db, user, "qa.finding.update", row, before=before, org_id=project.org_id)
                active.append(row)
            elif (row is not None and row.status == "resolved" and row.resolved_by is not None
                  and row.severity == f.severity):
                continue  # a person already reviewed and resolved this; don't nag again
            else:
                new = QAFinding(
                    org_id=project.org_id, created_by=user.id if user else None, project_id=project.id,
                    entity_type=f.entity_type, entity_id=f.entity_id, rule_code=f.rule_code, severity=f.severity,
                    message=f.message, details=dict(f.details), status="open",
                )
                db.add(new)
                audit(db, user, "qa.finding.create", new, org_id=project.org_id)
                active.append(new)
        elif row is not None and row.status in ACTIVE:
            before = snapshot(row)
            row.status = "resolved"
            row.resolution_note = AUTO_RESOLVED_NOTE
            row.resolved_by = None
            row.resolved_at = now
            audit(db, user, "qa.finding.auto_resolve", row, before=before, org_id=project.org_id)
    db.flush()
    return active


def run_project_checks(db: Session, user: CurrentUser | None, project) -> dict:
    active = run_checks(db, user, project)
    counts = Counter(f.severity for f in active)
    return {
        "project_id": str(project.id),
        "checked_at": utcnow().isoformat(),
        "counts": {s: counts.get(s, 0) for s in SEVERITIES},
        "total_open": len(active),
        "blocking": counts.get("blocking", 0),
    }


def blocking_findings(db: Session, project_id: uuid.UUID) -> list[QAFinding]:
    """Blocking findings that are still open or only acknowledged. Calculation must not proceed while any exist."""
    return list(db.scalars(
        select(QAFinding).where(QAFinding.project_id == project_id, QAFinding.severity == "blocking",
                                QAFinding.status.in_(ACTIVE)).order_by(QAFinding.created_at)
    ))


# ------------------------------------------------------------------ manual review
def resolve(db: Session, user: CurrentUser, finding: QAFinding, note: str) -> QAFinding:
    if finding.status == "resolved":
        raise IllegalTransition("This finding is already resolved.")
    if finding.severity == "blocking":
        raise Blocked(
            "Blocking findings can't be resolved by hand. Fix the underlying data and re-run the checks, "
            "or acknowledge the finding with a note.", code="BLOCKING_FINDING",
        )
    before = snapshot(finding)
    finding.status = "resolved"
    finding.resolution_note = note
    finding.resolved_by = user.id
    finding.resolved_at = utcnow()
    audit(db, user, "qa.finding.resolve", finding, before=before, reason=note)
    return finding


def acknowledge(db: Session, user: CurrentUser, finding: QAFinding, note: str) -> QAFinding:
    if finding.status != "open":
        raise IllegalTransition(f"Only an open finding can be acknowledged (this one is {finding.status}).")
    before = snapshot(finding)
    finding.status = "acknowledged"
    finding.resolution_note = note
    finding.resolved_by = user.id
    finding.resolved_at = utcnow()
    audit(db, user, "qa.finding.acknowledge", finding, before=before, reason=note)
    return finding


def finding_out(f: QAFinding, names: dict | None = None) -> dict:
    return {
        "id": str(f.id), "project_id": str(f.project_id) if f.project_id else None, "entity_type": f.entity_type,
        "entity_id": f.entity_id, "rule_code": f.rule_code, "severity": f.severity, "message": f.message,
        "details": f.details or {}, "status": f.status, "resolution_note": f.resolution_note,
        "resolved_by": (names or {}).get(f.resolved_by) if f.resolved_by else None,
        "resolved_at": f.resolved_at.isoformat() if f.resolved_at else None,
        "created_at": f.created_at.isoformat() if f.created_at else None,
        "blocks_calculation": f.severity == "blocking" and f.status in ACTIVE,
    }


def summary(db: Session, project) -> dict:
    rows = list(db.scalars(select(QAFinding).where(QAFinding.org_id == project.org_id,
                                                   QAFinding.project_id == project.id)))
    active = [r for r in rows if r.status in ACTIVE]
    by_sev = Counter(r.severity for r in active)
    by_rule = Counter(r.rule_code for r in active)
    by_status = Counter(r.status for r in rows)
    return {
        "project_id": str(project.id),
        "open_by_severity": {s: by_sev.get(s, 0) for s in SEVERITIES},
        "open_by_rule": dict(sorted(by_rule.items())),
        "by_status": {s: by_status.get(s, 0) for s in ("open", "acknowledged", "resolved")},
        "blocking": by_sev.get("blocking", 0),
        "can_calculate": by_sev.get("blocking", 0) == 0,
        "rules": [{"code": r.code, "title": r.title, "severity": r.severity, "entity_type": r.entity_type}
                  for r in engine.REGISTRY],
    }
