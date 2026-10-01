"""Calculation workflow: term estimates, runs (Gate 1), review/approval, claims,
provenance and project readiness.

Every input to a run is read from the database here and frozen into the run's
``inputs_snapshot``; the engine itself (``engine.py``) never touches the database.
"""

from __future__ import annotations

import dataclasses
import hashlib
import json
import uuid
from collections import defaultdict
from datetime import date
from typing import Any

from sqlalchemy import func, inspect, or_, select
from sqlalchemy.orm import Session

from app.core import geo
from app.core.auth import CurrentUser, ensure_not_author
from app.core.config import get_settings
from app.core.db import utcnow
from app.core.errors import Blocked, Conflict, IllegalTransition, NotFound, ValidationFailed
from app.core.events import emit
from app.core.tenancy import audit, get_owned, scoped
from app.modules.calculation import engine
from app.modules.calculation.models import CalculationRun, Claim, RunStatusEvent, TermEstimate
from app.modules.calculation.schemas import RunIn, TermIn, TermOut
from app.modules.emissions import domain as emissions_domain
from app.modules.emissions import service as emissions_svc
from app.modules.evidence.models import EvidenceFile
from app.modules.identity.models import User
from app.modules.lab.models import LabResult
from app.modules.land.models import Enrolment, Field
from app.modules.methodology import ruleset as rs
from app.modules.methodology.definitions import BY_KEY
from app.modules.methodology.models import RulePack
from app.modules.programmes.models import Project
from app.modules.qa.models import QAFinding
from app.modules.sampling import service as sampling_svc
from app.modules.sampling.models import (
    Campaign, CustodyEvent, Sample, SamplePlan, SamplingPoint, Site, SoilLayer, Stratum,
)

REQUIRED_ANALYTES = ("soc_pct", "bulk_density_g_cm3")
# Spectroscopy dry-combustion check results (purpose "spectroscopy_check") never feed the stock calculation.
_PRIMARY = or_(LabResult.purpose == "primary", LabResult.purpose.is_(None))
POOL = "soc"
# An acknowledged blocking finding still blocks (same rule as the QA module): only fixing the data clears it.
BLOCKING_STATUSES = ("open", "acknowledged")


# ================================================================ helpers
def canonical_json(obj: Any) -> str:
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), default=str)


def sha256_json(obj: Any) -> str:
    return hashlib.sha256(canonical_json(obj).encode("utf-8")).hexdigest()


def _uuid(value: str | uuid.UUID, what: str) -> uuid.UUID:
    if isinstance(value, uuid.UUID):
        return value
    try:
        return uuid.UUID(str(value))
    except ValueError as exc:
        raise NotFound(f"{what} not found.") from exc


def _names(db: Session, org_id: uuid.UUID) -> dict[uuid.UUID, str]:
    return {u.id: u.full_name for u in db.scalars(select(User).where(User.org_id == org_id)).all()}


def get_project(db: Session, user: CurrentUser, project_id: str) -> Project:
    return get_owned(db, Project, project_id, user, "Project")


def open_blocking_findings(db: Session, org_id: uuid.UUID, project_id: uuid.UUID) -> list[QAFinding]:
    return list(db.scalars(
        select(QAFinding).where(
            QAFinding.org_id == org_id, QAFinding.project_id == project_id,
            QAFinding.status.in_(BLOCKING_STATUSES), QAFinding.severity == "blocking",
        ).order_by(QAFinding.created_at)
    ).all())


def _finding_brief(f: QAFinding) -> dict[str, Any]:
    return {"id": str(f.id), "rule_code": f.rule_code, "entity_type": f.entity_type, "entity_id": f.entity_id,
            "message": f.message}


def _run_quality_checks(db: Session, user: CurrentUser, project: Project) -> None:
    """Run the QA module's project checks if that module provides them."""
    try:
        from app.modules.qa.service import run_project_checks  # type: ignore[attr-defined]
    except (ImportError, AttributeError):
        return
    run_project_checks(db, user, project)
    db.flush()


def _refuse_if_blocking(db: Session, org_id: uuid.UUID, project_id: uuid.UUID, action: str) -> None:
    blocking = open_blocking_findings(db, org_id, project_id)
    if blocking:
        raise Blocked(
            f"{len(blocking)} blocking quality issue(s) must be resolved before you can {action}.",
            code="QA_BLOCKING", details={"findings": [_finding_brief(f) for f in blocking]},
        )


# ================================================================ terms
def term_out(t: TermEstimate) -> TermOut:
    return TermOut(
        id=str(t.id), project_id=str(t.project_id), period_label=t.period_label, term=t.term,
        value_t_co2e=t.value_t_co2e, variance=t.variance, df=t.df, source=t.source, version=t.version,
        status=t.status, created_by=str(t.created_by) if t.created_by else None,
        approved_by=str(t.approved_by) if t.approved_by else None, approved_at=t.approved_at, created_at=t.created_at,
    )


def create_term(db: Session, user: CurrentUser, project_id: str, body: TermIn) -> TermEstimate:
    project = get_project(db, user, project_id)
    current = db.scalar(
        select(func.max(TermEstimate.version)).where(
            TermEstimate.org_id == user.org_id, TermEstimate.project_id == project.id,
            TermEstimate.period_label == body.period_label, TermEstimate.term == body.term,
        )
    )
    t = TermEstimate(
        org_id=user.org_id, created_by=user.id, project_id=project.id, period_label=body.period_label,
        term=body.term, value_t_co2e=body.value_t_co2e, variance=body.variance, df=body.df,
        source=body.source.strip(), version=(current or 0) + 1, status="draft",
    )
    db.add(t)
    audit(db, user, "term.create", t)
    return t


def approve_term(db: Session, user: CurrentUser, term_id: str) -> TermEstimate:
    t = get_owned(db, TermEstimate, term_id, user, "Term estimate")
    if t.status != "draft":
        raise IllegalTransition(f"Only a draft estimate can be approved; this one is {t.status}.")
    ensure_not_author(user.id, t.created_by, what="a term estimate")
    before = {"status": t.status}
    previous = db.scalars(
        select(TermEstimate).where(
            TermEstimate.org_id == user.org_id, TermEstimate.project_id == t.project_id,
            TermEstimate.period_label == t.period_label, TermEstimate.term == t.term,
            TermEstimate.status == "approved", TermEstimate.id != t.id,
        )
    ).all()
    for old in previous:
        old.status = "superseded"
        audit(db, user, "term.supersede", old, before={"status": "approved"}, reason=f"Replaced by version {t.version}")
    t.status = "approved"
    t.approved_by = user.id
    t.approved_at = utcnow()
    audit(db, user, "term.approve", t, before=before)
    return t


def list_terms(db: Session, user: CurrentUser, project_id: str, period_label: str | None) -> list[TermEstimate]:
    project = get_project(db, user, project_id)
    q = scoped(TermEstimate, user).where(TermEstimate.project_id == project.id)
    if period_label:
        q = q.where(TermEstimate.period_label == period_label)
    return list(db.scalars(q.order_by(TermEstimate.period_label, TermEstimate.term, TermEstimate.version)).all())


def approved_terms(db: Session, org_id: uuid.UUID, project_id: uuid.UUID, period_label: str) -> dict[str, TermEstimate]:
    rows = db.scalars(
        select(TermEstimate).where(
            TermEstimate.org_id == org_id, TermEstimate.project_id == project_id,
            TermEstimate.period_label == period_label, TermEstimate.status == "approved",
        ).order_by(TermEstimate.version)
    ).all()
    return {r.term: r for r in rows}  # highest version wins


# ================================================================ run status
def status_events(db: Session, run_id: uuid.UUID) -> list[RunStatusEvent]:
    return list(db.scalars(
        select(RunStatusEvent).where(RunStatusEvent.run_id == run_id).order_by(RunStatusEvent.created_at)
    ).all())


def run_status(db: Session, run_id: uuid.UUID) -> str:
    ev = status_events(db, run_id)
    return ev[-1].status if ev else "calculated"


def _add_status(db: Session, user: CurrentUser, run: CalculationRun, status: str, note: str = "") -> RunStatusEvent:
    ev = RunStatusEvent(org_id=run.org_id, created_by=user.id, run_id=run.id, status=status, note=note)
    db.add(ev)
    audit(db, user, f"calculation.{status}", ev, reason=note or None)
    return ev


def _current_approved(db: Session, org_id: uuid.UUID, project_id: uuid.UUID, period_label: str) -> list[CalculationRun]:
    runs = db.scalars(
        select(CalculationRun).where(
            CalculationRun.org_id == org_id, CalculationRun.project_id == project_id,
            CalculationRun.period_label == period_label,
        )
    ).all()
    return [r for r in runs if run_status(db, r.id) == "approved"]


# ================================================================ inputs (Gate 1)
def _effective(s: Stratum, on: date) -> bool:
    return s.effective_from <= on and (s.effective_to is None or s.effective_to > on)


def _mean_date(samples: list[Sample]) -> float | None:
    if not samples:
        return None
    return sum(s.collected_at.timestamp() for s in samples) / len(samples)


def _prior_cumulative(db: Session, project: Project, period_start: date) -> tuple[float, list[str]]:
    """Σ ΔCO2_wp credited by earlier approved runs (indicator I of Eq. 37/40 is cumulative)."""
    runs = db.scalars(select(CalculationRun).where(
        CalculationRun.org_id == project.org_id, CalculationRun.project_id == project.id,
        CalculationRun.period_end < period_start)).all()
    total, used = 0.0, []
    for r in runs:
        if run_status(db, r.id) != "approved":
            continue
        soc = (r.results or {}).get("soc") or {}
        if isinstance(soc.get("d_wp_t_co2e"), (int, float)):
            total += float(soc["d_wp_t_co2e"])
            used.append(str(r.id))
    return total, used


def _control_site_gates(db: Session, rules: rs.RuleSet, current: list[Stratum]) -> dict[str, Any]:
    """VM0042 §8.2: ≥ min control sites across the project, ≥ 1 per stratum, within the maximum distance."""
    controls = [s for s in current if s.role == "control"]
    projects = [s for s in current if s.role == "project"]
    if not controls:
        return {"control_sites": 0}
    min_sites = int(rules.require("min_control_sites"))
    max_km = float(rules.require("control_site_max_km"))
    ctrl_fields = sorted({str(f) for c in controls for f in (c.field_ids or [])})
    if len(ctrl_fields) < min_sites:
        raise Blocked(f"The project has {len(ctrl_fields)} baseline control site(s); VM0042 §8.2 requires at least "
                      f"{min_sites}.", code="CONTROL_SITES_INSUFFICIENT",
                      details={"rule_key": "min_control_sites", "control_sites": len(ctrl_fields), "required": min_sites})
    linked = {c.control_for_code for c in controls}
    missing = sorted(p.code for p in projects if p.code not in linked)
    if missing:
        raise Blocked("Every stratum needs at least one baseline control site (VM0042 §8.2).",
                      code="CONTROL_SITES_INSUFFICIENT", details={"strata_without_control": missing})
    all_ids = [uuid.UUID(f) for s in current for f in (s.field_ids or [])]
    fields = {str(f.id): f for f in db.scalars(select(Field).where(Field.id.in_(all_ids))).all()} if all_ids else {}
    too_far = []
    for c in controls:
        target = next((p for p in projects if p.code == c.control_for_code), None)
        if target is None:
            continue
        pf = [fields[str(f)] for f in (target.field_ids or []) if str(f) in fields]
        for cf_id in c.field_ids or []:
            cf = fields.get(str(cf_id))
            if cf is None or not pf:
                continue
            km = min(geo.distance_m(cf.centroid_lat, cf.centroid_lon, f.centroid_lat, f.centroid_lon) for f in pf) / 1000
            if km > max_km:
                too_far.append({"control_field": cf.code, "stratum": target.code, "km": round(km, 1)})
    if too_far:
        raise Blocked(f"Some control sites are more than {max_km:g} km from their quantification unit.",
                      code="CONTROL_SITE_TOO_FAR", details={"rule_key": "control_site_max_km", "sites": too_far})
    return {"control_sites": len(ctrl_fields), "max_km": max_km}


def assemble_inputs(
    db: Session, project: Project, base: Campaign, mon: Campaign, rules: rs.RuleSet, period_label: str,
    period_start: date | None = None, period_end: date | None = None,
) -> tuple[engine.EngineInput, dict[str, Any]]:
    """Read every engine input from the database and apply the VM0042 gate checks. Returns the engine
    input and a ``sources`` map recording which rows each value came from."""
    org = project.org_id
    on = mon.planned_start
    period_start = period_start or base.planned_start
    period_end = period_end or mon.planned_end
    all_strata = db.scalars(select(Stratum).where(Stratum.org_id == org, Stratum.project_id == project.id)).all()
    current = sorted((s for s in all_strata if _effective(s, on)), key=lambda s: s.code)
    if not current:
        raise Blocked(f"No zones are in effect on {on.isoformat()} (the monitoring campaign start).", code="NO_STRATA")
    code_of = {s.id: s.code for s in all_strata}
    current_codes = {s.code for s in current}

    stock_method = rules.require("stock_method")
    soc_approach = rules.require("qa_soc")
    if stock_method == "fixed_depth":
        raise Blocked("The rule pack uses plain fixed-depth stocks, which VM0042 v2.2 §8.2.1.3(7) does not allow. "
                      "Use equivalent soil mass (a new pack revision).", code="ESM_REQUIRED",
                      details={"rule_key": "stock_method", "value": stock_method})
    if soc_approach == "qa1" and not rules.require("modelled_soc_permitted"):
        raise Blocked("SOC is quantified with a model (QA1) but the rules don't allow crediting modelled values.",
                      code="MODELLED_DATA_NOT_PERMITTED", details={"rule_key": "modelled_soc_permitted"})
    control_info = _control_site_gates(db, rules, current) if soc_approach == "qa2" else {"control_sites": 0}

    sites = db.scalars(select(Site).where(Site.org_id == org, Site.project_id == project.id)).all()
    site_code_stratum = {s.id: code_of.get(s.stratum_id) for s in sites}
    site_by_id = {s.id: s for s in sites}

    samples = db.scalars(
        select(Sample).where(Sample.org_id == org, Sample.campaign_id.in_([base.id, mon.id])).order_by(Sample.code)
    ).all()
    samples = [s for s in samples if site_code_stratum.get(s.site_id) in current_codes]
    sample_ids = [s.id for s in samples]
    layers = db.scalars(select(SoilLayer).where(SoilLayer.sample_id.in_(sample_ids))).all() if sample_ids else []
    layer_ids = [lyr.id for lyr in layers]
    results = db.scalars(
        select(LabResult).where(LabResult.org_id == org, LabResult.layer_id.in_(layer_ids),
                                LabResult.status == "accepted", _PRIMARY)
    ).all() if layer_ids else []
    latest: dict[tuple[uuid.UUID, str], LabResult] = {}
    for r in results:
        k = (r.layer_id, r.analyte)
        cur = latest.get(k)
        if cur is None or (r.version, r.created_at) > (cur.version, cur.created_at):
            latest[k] = r

    coarse = bool(rules.require("coarse_fragment_correction"))
    shallow_ok = rules.get("shallow_soil_allowed") is True
    camp_depth = {base.id: base.depth_to_cm, mon.id: mon.depth_to_cm}
    min_increments = int(rules.get("resample_min_depth_increments") or 2)

    layers_by_sample: dict[uuid.UUID, list[SoilLayer]] = defaultdict(list)
    for lyr in layers:
        layers_by_sample[lyr.sample_id].append(lyr)

    missing: list[dict[str, Any]] = []
    too_few_increments: list[str] = []
    src_layers: dict[str, Any] = {}
    points: dict[tuple[str, str], list[engine.Point]] = defaultdict(list)  # (stratum code, campaign kind)
    src_samples: dict[str, Any] = {}
    for smp in samples:
        stratum_code = site_code_stratum[smp.site_id]
        kind = "baseline" if smp.campaign_id == base.id else "monitoring"
        eq3_ready = bool(smp.probe_diameter_mm and smp.cores_composited)
        eng_layers: list[engine.Layer] = []
        for lyr in sorted(layers_by_sample.get(smp.id, []), key=lambda x: x.depth_from_cm):
            soc = latest.get((lyr.id, "soc_pct"))
            fsm = latest.get((lyr.id, "fine_soil_mass_g")) if eq3_ready else None
            bd = latest.get((lyr.id, "bulk_density_g_cm3"))
            cf = latest.get((lyr.id, "coarse_fraction"))
            absent = [] if soc is not None else ["soc_pct"]
            if fsm is None:
                if bd is None:
                    absent.append("bulk_density_g_cm3")
                if coarse and cf is None:
                    absent.append("coarse_fraction")
            if absent:
                missing.append({"layer": lyr.code, "analytes": absent})
                continue
            used = {"soc_pct": soc}
            if fsm is not None:
                used["fine_soil_mass_g"] = fsm
            else:
                used["bulk_density_g_cm3"] = bd
                if cf is not None:
                    used["coarse_fraction"] = cf
            eng_layers.append(engine.Layer(
                code=lyr.code, depth_from_cm=lyr.depth_from_cm, depth_to_cm=lyr.depth_to_cm,
                bulk_density_g_cm3=bd.value if bd is not None and fsm is None else None, soc_pct=soc.value,
                coarse_fraction=cf.value if cf is not None and fsm is None else None,
                fine_soil_mass_g=fsm.value if fsm is not None else None,
            ))
            src_layers[lyr.code] = {
                "layer_id": str(lyr.id), "sample_id": str(smp.id), "mass_method": "eq3" if fsm else "bulk_density",
                "results": {a: {"id": str(v.id), "value": v.value, "unit": v.unit, "method": v.method,
                                "version": v.version} for a, v in used.items()},
            }
        if not layers_by_sample.get(smp.id):
            missing.append({"layer": f"{smp.code} (no layers)", "analytes": ["soc_pct"]})
        shallow = bool(shallow_ok and (smp.deviation_reason or "").strip()
                       and smp.depth_reached_cm + 0.5 < camp_depth[smp.campaign_id])
        if (stock_method == "esm" and kind == "monitoring" and not shallow
                and len(layers_by_sample.get(smp.id, [])) < min_increments):
            too_few_increments.append(smp.code)
        points[(stratum_code, kind)].append(engine.Point(
            str(smp.site_id), tuple(eng_layers), smp.code, probe_diameter_mm=smp.probe_diameter_mm,
            cores_composited=smp.cores_composited, shallow=shallow))
        site = site_by_id[smp.site_id]
        src_samples[smp.code] = {"sample_id": str(smp.id), "site_id": str(smp.site_id), "site_code": site.code,
                                 "campaign": kind, "campaign_id": str(smp.campaign_id), "shallow": shallow,
                                 "probe_diameter_mm": smp.probe_diameter_mm, "cores_composited": smp.cores_composited,
                                 "intended": {"latitude": site.latitude, "longitude": site.longitude},
                                 "actual": {"latitude": smp.latitude, "longitude": smp.longitude},
                                 "collected_at": smp.collected_at.isoformat()}
    if missing:
        raise Blocked(
            f"{len(missing)} soil layer(s) are missing accepted lab results needed for the calculation.",
            code="MISSING_LAB_RESULT", details={"layers": missing},
        )
    if too_few_increments:
        raise Blocked(
            f"Equivalent soil mass needs at least {min_increments} depth increments at re-sampling (VM0042 "
            f"§8.2.1.3(7)); {len(too_few_increments)} monitoring sample(s) have fewer.", code="ESM_INCREMENTS_REQUIRED",
            details={"samples": too_few_increments[:50]},
        )

    b_samples = [s for s in samples if s.campaign_id == base.id]
    m_samples = [s for s in samples if s.campaign_id == mon.id]
    tb, tm = _mean_date(b_samples), _mean_date(m_samples)
    interval = (tm - tb) / (365.25 * 86400) if tb is not None and tm is not None else None

    # activity data (Table 4 / QA3) — the project must have it; emissions are never assumed zero
    y0 = min((s.collected_at.year for s in b_samples), default=base.planned_start.year)
    y1 = max((s.collected_at.year for s in m_samples), default=mon.planned_start.year)
    emis_inp, records = emissions_svc.emissions_input(db, project, period_start, period_end,
                                                      biochar_years=tuple(range(y0, y1 + 1)), on=on)
    if not records:
        raise Blocked(
            "No activity data (baseline schedule and project practices, VM0042 Table 4) is recorded for this project, "
            "so emissions can't be quantified.", code="ACTIVITY_DATA_MISSING", details={"project_id": str(project.id)})

    terms = approved_terms(db, org, project.id, period_label)
    # §8.4.2 (a): a livestock decline needs an approved displacement-leakage estimate before crediting
    emis_inp = dataclasses.replace(emis_inp, displacement_leakage_available="leakage_displacement" in terms)
    for key in engine.MODELLED_TERMS:
        if key in terms and key != "baseline_scenario" and not rules.get("modelled_soc_permitted"):
            raise Blocked(f"An approved modelled estimate (“{key.replace('_', ' ')}”) exists, but the rules don't "
                          "allow crediting modelled values.", code="MODELLED_DATA_NOT_PERMITTED",
                          details={"rule_key": "modelled_soc_permitted", "term": key})
    prior, prior_runs = _prior_cumulative(db, project, period_start)
    ms_design, ms_source = sampling_svc.multistage_input_for_run(db, org, project.id, base, mon)  # Appendix 6
    eng_strata = tuple(
        engine.StratumData(
            code=s.code, area_ha=s.area_ha, role=s.role, control_for_code=s.control_for_code,
            quantification_unit=s.quantification_unit or s.code,
            baseline=tuple(points.get((s.code, "baseline"), [])),
            monitoring=tuple(points.get((s.code, "monitoring"), [])),
        )
        for s in current
    )
    inp = engine.EngineInput(
        design=mon.design, strata=eng_strata,
        terms={k: engine.Term(t.value_t_co2e, t.variance, t.df, t.source) for k, t in sorted(terms.items())},
        measurement_interval_years=round(interval, 6) if interval is not None else None,
        vintages=engine.vintages_for(period_start, period_end), emissions=emis_inp,
        prior_cumulative_stock_change_t_co2e=prior, multistage=ms_design,
    )
    sources = {
        "campaigns": {
            "baseline": {"id": str(base.id), "code": base.code, "design": base.design,
                         "planned_start": base.planned_start.isoformat()},
            "monitoring": {"id": str(mon.id), "code": mon.code, "design": mon.design,
                           "planned_start": mon.planned_start.isoformat()},
        },
        "strata": [
            {"id": str(s.id), "code": s.code, "name": s.name, "role": s.role, "control_for_code": s.control_for_code,
             "quantification_unit": s.quantification_unit or s.code, "version": s.version, "area_ha": s.area_ha,
             "field_ids": sorted(str(f) for f in (s.field_ids or []))}
            for s in current
        ],
        "samples": src_samples,
        "layers": src_layers,
        "terms": {k: {"id": str(t.id), "version": t.version, "value_t_co2e": t.value_t_co2e,
                      "variance": t.variance, "df": t.df, "source": t.source}
                  for k, t in sorted(terms.items())},
        "activity_records": [
            {"id": str(r.id), "record_id": str(r.record_id), "version": r.version, "field_id": str(r.field_id),
             "scenario": r.scenario, "year": r.year, "category": r.category, "data_tier": r.data_tier}
            for r in records
        ],
        "measurement_interval_years": interval,
        "control_sites": control_info,
        "prior_runs": prior_runs,
    }
    if ms_source is not None:
        sources["sampling_design"] = ms_source
    return inp, sources


def create_run(db: Session, user: CurrentUser, project_id: str, body: RunIn) -> CalculationRun:
    project = get_project(db, user, project_id)
    rules = rs.for_project(db, project, require_approved=True)
    if body.period_end <= body.period_start:
        raise ValidationFailed("The period must end after it starts.", code="INVALID_PERIOD")
    base = get_owned(db, Campaign, body.baseline_campaign_id, user, "Baseline campaign")
    mon = get_owned(db, Campaign, body.monitoring_campaign_id, user, "Monitoring campaign")
    if base.project_id != project.id or mon.project_id != project.id:
        raise ValidationFailed("Both campaigns must belong to this project.", code="CAMPAIGN_MISMATCH")
    if base.kind != "baseline":
        raise ValidationFailed(f"Campaign {base.code} is not a baseline campaign.", code="CAMPAIGN_MISMATCH")
    if mon.kind != "monitoring":
        raise ValidationFailed(f"Campaign {mon.code} is not a monitoring campaign.", code="CAMPAIGN_MISMATCH")
    if mon.design == "paired" and mon.revisits_campaign_id not in (None, base.id):
        raise ValidationFailed(f"Campaign {mon.code} re-visits a different baseline campaign.",
                               code="CAMPAIGN_MISMATCH")
    supersedes: CalculationRun | None = None
    if body.supersedes_run_id:
        supersedes = get_owned(db, CalculationRun, body.supersedes_run_id, user, "Calculation")
        if supersedes.project_id != project.id or supersedes.period_label != body.period_label:
            raise ValidationFailed("A run can only replace a run of the same project and period.",
                                   code="SUPERSEDE_MISMATCH")

    _run_quality_checks(db, user, project)
    _refuse_if_blocking(db, user.org_id, project.id, "run a calculation")

    inp, sources = assemble_inputs(db, project, base, mon, rules, body.period_label, body.period_start,
                                   body.period_end)
    result = engine.calculate(inp, rules)

    inputs_snapshot = {
        "period": {"label": body.period_label, "start": body.period_start.isoformat(),
                   "end": body.period_end.isoformat()},
        "engine_input": engine.input_to_dict(inp),
        "sources": sources,
    }
    rules_snapshot = rules.snapshot()
    digest = sha256_json({"inputs": inputs_snapshot, "rules": rules_snapshot})
    run = CalculationRun(
        org_id=user.org_id, created_by=user.id, project_id=project.id, period_label=body.period_label,
        period_start=body.period_start, period_end=body.period_end, baseline_campaign_id=base.id,
        monitoring_campaign_id=mon.id, rule_pack_id=uuid.UUID(rules.pack_id),
        engine_version=get_settings().engine_version, inputs_snapshot=inputs_snapshot,
        rules_snapshot=rules_snapshot, results=result.to_dict(), gross_t_co2e=result.gross_t_co2e,
        uncertainty_deduction_t_co2e=result.uncertainty_deduction_t_co2e, buffer_t_co2e=result.buffer_t_co2e,
        net_t_co2e=result.credits_t_co2e, reductions_t_co2e=result.reductions_t_co2e,
        removals_t_co2e=result.removals_t_co2e, supersedes_run_id=supersedes.id if supersedes else None,
        snapshot_sha256=digest,
    )
    db.add(run)
    audit(db, user, "calculation.create", run)
    _add_status(db, user, run, "calculated")
    _post_run_findings(db, user, project, run, result)
    return run


def _post_run_findings(db: Session, user: CurrentUser, project: Project, run: CalculationRun,
                       result: engine.CalculationResult) -> None:
    def add(rule_code: str, severity: str, message: str, details: dict[str, Any]) -> None:
        f = QAFinding(org_id=user.org_id, created_by=user.id, project_id=project.id, entity_type="calculation_run",
                      entity_id=str(run.id), rule_code=rule_code, severity=severity, message=message, details=details)
        db.add(f)
        audit(db, user, "qa.finding.create", f)

    if result.net_before_uncertainty_t_co2e <= 0:
        add("NET_RESULT_NOT_POSITIVE", "info",
            "The greenhouse-gas benefit did not increase over this period, so no credits arise. The result is "
            "reported as measured.", {"net_before_uncertainty_t_co2e": result.net_before_uncertainty_t_co2e})
    if result.flags.get("high_uncertainty"):
        add("HIGH_UNCERTAINTY", "warning",
            "The uncertainty deduction is more than 15% of the result. More samples would reduce it.",
            {"deduction_t_co2e": result.uncertainty_deduction_t_co2e, "gross_t_co2e": result.gross_t_co2e})
    if result.flags.get("fixed_depth_with_mass_correction"):
        add("ESM_MASS_CORRECTION", "warning",
            "Stocks use fixed-depth sampling with a mass correction; VM0042 prefers equivalent soil mass from two or "
            "more depth increments.", {"stock_method": result.stock_method})
    if result.de_minimis.get("candidates"):
        add("DE_MINIMIS_SOURCES", "info",
            "Some emission sources or leakage are below the de minimis threshold: "
            + ", ".join(result.de_minimis["candidates"]) + ".", {"de_minimis": result.de_minimis})


# ================================================================ workflow
def submit_run(db: Session, user: CurrentUser, run_id: str) -> CalculationRun:
    run = get_owned(db, CalculationRun, run_id, user, "Calculation")
    status = run_status(db, run.id)
    if status != "calculated":
        raise IllegalTransition(f"Only a calculated run can be sent for review; this one is {status.replace('_', ' ')}.")
    _add_status(db, user, run, "under_review")
    return run


def reject_run(db: Session, user: CurrentUser, run_id: str, note: str) -> CalculationRun:
    run = get_owned(db, CalculationRun, run_id, user, "Calculation")
    status = run_status(db, run.id)
    if status != "under_review":
        raise IllegalTransition(f"Only a run under review can be rejected; this one is {status.replace('_', ' ')}.")
    _add_status(db, user, run, "rejected", note.strip())
    return run


def _run_field_ids(run: CalculationRun) -> list[uuid.UUID]:
    out: set[uuid.UUID] = set()
    for s in (run.inputs_snapshot or {}).get("sources", {}).get("strata", []):
        if s.get("role") == "project":
            out.update(uuid.UUID(f) for f in s.get("field_ids", []))
    return sorted(out)


def credited_pools(run: CalculationRun) -> list[str]:
    """Carbon pools / gases this run credits (claims prevent double counting per pool)."""
    res = run.results or {}
    comps = ((res.get("emissions") or {}).get("components") or {})
    pools = {POOL}
    for key, value in comps.items():
        if not value:
            continue
        if key.startswith("co2_"):
            pools.add("co2")
        elif key.startswith("ch4_") or key == "ch4_soil":
            pools.add("ch4")
        elif key.startswith("n2o_") or key == "n2o_soil":
            pools.add("n2o")
        elif key == "legacy_terms":
            pools.add("co2")
    soc = res.get("soc") or {}
    if soc.get("tree_wp_t_co2e") or soc.get("tree_bsl_t_co2e"):
        pools.add("biomass")
    return sorted(pools)


def active_claims(db: Session, org_id: uuid.UUID, field_ids: list[uuid.UUID], pool: str | None = POOL,
                  pools: list[str] | None = None) -> list[Claim]:
    if not field_ids:
        return []
    q = select(Claim).where(Claim.org_id == org_id, Claim.field_id.in_(field_ids))
    wanted = pools if pools is not None else ([pool] if pool else None)
    if wanted is not None:
        q = q.where(Claim.pool.in_(wanted))
    rows = db.scalars(q).all()
    released = {str((c.meta or {}).get("releases_claim_id")) for c in rows if c.released_by_run_id is not None}
    return [c for c in rows if c.released_by_run_id is None and str(c.id) not in released]


def _release_claims(db: Session, user: CurrentUser, old: CalculationRun, new: CalculationRun) -> int:
    """Claims are append-only, so a release is recorded as a marker row pointing at the claim."""
    n = 0
    for c in active_claims(db, old.org_id, _run_field_ids(old), pool=None):
        if c.run_id != old.id:
            continue
        marker = Claim(
            org_id=old.org_id, created_by=user.id, field_id=c.field_id, pool=c.pool, period_start=c.period_start,
            period_end=c.period_end, run_id=old.id, released_by_run_id=new.id,
            meta={"kind": "release", "releases_claim_id": str(c.id)},
        )
        db.add(marker)
        audit(db, user, "claim.release", marker)
        n += 1
    return n


def approve_run(db: Session, user: CurrentUser, run_id: str, note: str = "") -> CalculationRun:
    run = get_owned(db, CalculationRun, run_id, user, "Calculation")
    ensure_not_author(user.id, run.created_by, what="a calculation")
    status = run_status(db, run.id)
    if status != "under_review":
        raise IllegalTransition(f"Only a run under review can be approved; this one is {status.replace('_', ' ')}.")
    _refuse_if_blocking(db, user.org_id, run.project_id, "approve this calculation")

    approved = [r for r in _current_approved(db, user.org_id, run.project_id, run.period_label) if r.id != run.id]
    superseded: list[CalculationRun] = []
    for old in approved:
        if run.supersedes_run_id != old.id:
            raise Conflict(
                f"A calculation for period {run.period_label} is already approved. Create a new run that "
                "replaces it instead.",
                code="PERIOD_ALREADY_APPROVED", details={"approved_run_id": str(old.id)},
            )
        superseded.append(old)
    for old in superseded:
        _add_status(db, user, old, "superseded", f"Replaced by run {run.id}")
        _release_claims(db, user, old, run)
    db.flush()

    field_ids = _run_field_ids(run)
    if not field_ids:
        raise Blocked("The calculation covers no fields, so nothing can be claimed.", code="NO_FIELDS")
    known = set(db.scalars(select(Field.id).where(Field.org_id == user.org_id, Field.id.in_(field_ids))).all())
    unknown = [str(f) for f in field_ids if f not in known]
    if unknown:
        raise ValidationFailed("Some zone fields no longer exist.", code="UNKNOWN_FIELD", details={"fields": unknown})
    pools = credited_pools(run)
    overlaps = [
        c for c in active_claims(db, user.org_id, field_ids, pools=pools)
        if c.run_id != run.id and c.period_start <= run.period_end and run.period_start <= c.period_end
    ]
    if overlaps:
        raise Conflict(
            "Some fields are already credited for an overlapping period by another calculation.",
            code="CLAIM_OVERLAP",
            details={"claims": [{"field_id": str(c.field_id), "run_id": str(c.run_id), "pool": c.pool,
                                 "period_start": c.period_start.isoformat(), "period_end": c.period_end.isoformat()}
                                for c in overlaps]},
        )
    for pool in pools:
        for fid in field_ids:
            claim = Claim(org_id=user.org_id, created_by=user.id, field_id=fid, pool=pool,
                          period_start=run.period_start, period_end=run.period_end, run_id=run.id,
                          meta={"period_label": run.period_label})
            db.add(claim)
            audit(db, user, "claim.create", claim)
    _add_status(db, user, run, "approved", note.strip())
    emit(db, user, "result.approved", run, totals(run))
    for old in superseded:
        emit(db, user, "result.superseded", old, {"run_id": str(old.id), "superseded_by": str(run.id)})
    return run


# ================================================================ read models
def totals(run: CalculationRun) -> dict[str, Any]:
    return {
        "run_id": str(run.id), "project_id": str(run.project_id), "period_label": run.period_label,
        "period_start": run.period_start.isoformat(), "period_end": run.period_end.isoformat(),
        "gross_t_co2e": run.gross_t_co2e, "uncertainty_deduction_t_co2e": run.uncertainty_deduction_t_co2e,
        "buffer_t_co2e": run.buffer_t_co2e, "net_t_co2e": run.net_t_co2e,
        "reductions_t_co2e": run.reductions_t_co2e, "removals_t_co2e": run.removals_t_co2e,
    }


def status_history(db: Session, run: CalculationRun) -> list[dict[str, Any]]:
    names = _names(db, run.org_id)
    return [
        {"status": e.status, "note": e.note, "at": e.created_at.isoformat(),
         "by_id": str(e.created_by) if e.created_by else None, "by": names.get(e.created_by, "System")}
        for e in status_events(db, run.id)
    ]


def run_summary(db: Session, run: CalculationRun) -> dict[str, Any]:
    return {
        "id": str(run.id), **totals(run), "status": run_status(db, run.id),
        "engine_version": run.engine_version, "snapshot_sha256": run.snapshot_sha256,
        "supersedes_run_id": str(run.supersedes_run_id) if run.supersedes_run_id else None,
        "flags": (run.results or {}).get("flags", {}), "created_at": run.created_at.isoformat(),
        "created_by": str(run.created_by) if run.created_by else None, "data_class": "CALCULATED",
    }


def list_runs(db: Session, user: CurrentUser, project_id: str) -> list[dict[str, Any]]:
    project = get_project(db, user, project_id)
    runs = db.scalars(
        scoped(CalculationRun, user).where(CalculationRun.project_id == project.id)
        .order_by(CalculationRun.created_at.desc())
    ).all()
    return [run_summary(db, r) for r in runs]


def run_detail(db: Session, user: CurrentUser, run_id: str) -> dict[str, Any]:
    run = get_owned(db, CalculationRun, run_id, user, "Calculation")
    names = _names(db, run.org_id)
    return {
        **run_summary(db, run), "created_by_name": names.get(run.created_by, "System"),
        "baseline_campaign_id": str(run.baseline_campaign_id),
        "monitoring_campaign_id": str(run.monitoring_campaign_id), "rule_pack_id": str(run.rule_pack_id),
        "results": run.results, "inputs_snapshot": run.inputs_snapshot, "rules_snapshot": run.rules_snapshot,
        "status_history": status_history(db, run),
    }


def _evidence_brief(db: Session, org_id: uuid.UUID, ids: list[Any]) -> list[dict[str, Any]]:
    out = []
    for raw in ids or []:
        try:
            eid = uuid.UUID(str(raw))
        except ValueError:
            out.append({"id": str(raw), "sha256": None, "missing": True})
            continue
        e = db.get(EvidenceFile, eid)
        if e is None or e.org_id != org_id:
            out.append({"id": str(raw), "sha256": None, "missing": True})
        else:
            out.append({"id": str(e.id), "sha256": e.sha256, "filename": e.filename, "kind": e.kind,
                        "mime_type": e.mime_type})
    return out


def provenance(db: Session, run: CalculationRun) -> dict[str, Any]:
    """The full chain behind a run: rules → terms → zones → sites → samples → layers → lab results → custody."""
    org = run.org_id
    snap = run.inputs_snapshot or {}
    sources = snap.get("sources", {})
    rules_snap = run.rules_snapshot or {}
    rules = [
        {"key": k, "label": BY_KEY[k].label if k in BY_KEY else k, "value": v,
         "source": (rules_snap.get("sources") or {}).get(k)}
        for k, v in sorted((rules_snap.get("values") or {}).items())
    ]
    results_by_code = {s["code"]: s for s in (run.results or {}).get("strata", [])}
    results_by_code.update({s["code"]: s for s in (run.results or {}).get("control_strata", [])})

    sample_ids = [uuid.UUID(v["sample_id"]) for v in sources.get("samples", {}).values()]
    samples = {s.id: s for s in db.scalars(select(Sample).where(Sample.org_id == org, Sample.id.in_(sample_ids))).all()} \
        if sample_ids else {}
    sites = {s.id: s for s in db.scalars(select(Site).where(Site.org_id == org, Site.id.in_(
        [s.site_id for s in samples.values()]))).all()} if samples else {}
    layers_by_sample: dict[uuid.UUID, list[SoilLayer]] = defaultdict(list)
    custody_by_sample: dict[uuid.UUID, list[CustodyEvent]] = defaultdict(list)
    results_by_layer: dict[uuid.UUID, list[LabResult]] = defaultdict(list)
    if samples:
        for lyr in db.scalars(select(SoilLayer).where(SoilLayer.sample_id.in_(list(samples)))).all():
            layers_by_sample[lyr.sample_id].append(lyr)
        for ev in db.scalars(select(CustodyEvent).where(CustodyEvent.sample_id.in_(list(samples)))
                             .order_by(CustodyEvent.occurred_at)).all():
            custody_by_sample[ev.sample_id].append(ev)
        all_layer_ids = [lyr.id for ls in layers_by_sample.values() for lyr in ls]
        if all_layer_ids:
            for r in db.scalars(select(LabResult).where(LabResult.org_id == org,
                                                        LabResult.layer_id.in_(all_layer_ids))).all():
                results_by_layer[r.layer_id].append(r)
    used_result_ids = {res["id"] for lv in sources.get("layers", {}).values() for res in lv["results"].values()}

    def layer_node(lyr: SoilLayer) -> dict[str, Any]:
        return {
            "id": str(lyr.id), "code": lyr.code, "depth_from_cm": lyr.depth_from_cm, "depth_to_cm": lyr.depth_to_cm,
            "used_in_calculation": lyr.code in sources.get("layers", {}),
            "lab_results": [
                {"id": str(r.id), "analyte": r.analyte, "value": r.value, "unit": r.unit, "method": r.method,
                 "status": r.status, "version": r.version, "analysed_on": r.analysed_on.isoformat(),
                 "used_in_calculation": str(r.id) in used_result_ids, "data_class": "MEASURED",
                 "certificate": (_evidence_brief(db, org, [r.certificate_id])[0] if r.certificate_id else None)}
                for r in sorted(results_by_layer.get(lyr.id, []), key=lambda x: (x.analyte, x.version))
            ],
        }

    def sample_node(s: Sample, campaign: str) -> dict[str, Any]:
        return {
            "id": str(s.id), "code": s.code, "campaign": campaign, "collected_at": s.collected_at.isoformat(),
            "gps": {"latitude": s.latitude, "longitude": s.longitude, "accuracy_m": s.gps_accuracy_m,
                    "distance_from_site_m": s.distance_from_site_m},
            "depth_reached_cm": s.depth_reached_cm, "photos": _evidence_brief(db, org, s.photo_ids),
            "layers": [layer_node(lyr) for lyr in sorted(layers_by_sample.get(s.id, []), key=lambda x: x.depth_from_cm)],
            "custody": [
                {"id": str(e.id), "event": e.event, "occurred_at": e.occurred_at.isoformat(), "location": e.location,
                 "seal_intact": e.seal_intact, "count_matches": e.count_matches, "notes": e.notes}
                for e in custody_by_sample.get(s.id, [])
            ],
        }

    # Sites may point at an earlier version of a zone, so zones are matched by code.
    stratum_codes = {s.id: s.code for s in db.scalars(
        select(Stratum).where(Stratum.org_id == org, Stratum.project_id == run.project_id)).all()}
    by_stratum_site: dict[str, dict[uuid.UUID, list[tuple[Sample, str]]]] = defaultdict(lambda: defaultdict(list))
    for meta in sources.get("samples", {}).values():
        smp = samples.get(uuid.UUID(meta["sample_id"]))
        if smp is None or smp.site_id not in sites:
            continue
        strat = stratum_codes.get(sites[smp.site_id].stratum_id, "unknown")
        by_stratum_site[strat][smp.site_id].append((smp, meta["campaign"]))

    strata_nodes = []
    for st in sources.get("strata", []):
        res = results_by_code.get(st["code"], {})
        strata_nodes.append({
            **st,
            "result": {k: res.get(k) for k in ("n_used", "mean_baseline_t_c_ha", "mean_monitoring_t_c_ha",
                                               "delta_t_c_ha", "variance", "se", "df", "excluded_sites",
                                               "control_code")},
            "sites": [
                {"id": str(site_id), "code": sites[site_id].code if site_id in sites else None,
                 "latitude": sites[site_id].latitude if site_id in sites else None,
                 "longitude": sites[site_id].longitude if site_id in sites else None,
                 "samples": [sample_node(s, c) for s, c in sorted(items, key=lambda x: x[1])]}
                for site_id, items in sorted(by_stratum_site.get(st["code"], {}).items(),
                                             key=lambda kv: sites[kv[0]].code if kv[0] in sites else "")
            ],
        })
    return {
        "run": {**run_summary(db, run), "rule_pack_id": str(run.rule_pack_id)},
        "rules": rules,
        "terms": [{"term": k, **v} for k, v in sorted(sources.get("terms", {}).items())],
        "term_results": (run.results or {}).get("terms", []),
        "strata": strata_nodes,
    }


# ================================================================ readiness
def _dim(key: str, label: str, status: str, detail: str) -> dict[str, str]:
    return {"key": key, "label": label, "status": status, "detail": detail}


def _activity_dimension(db: Session, project: Project, rules: rs.RuleSet | None, enrol: list) -> dict[str, str]:
    """VM0042 Table 4: every enrolled field has the minimum annual data for >= x look-back years (Box 1 tiered)."""
    label = "Activity data complete (Table 4)"
    records = emissions_svc.latest_records(db, project.org_id, project.id)
    if not records:
        return _dim("activity_data_complete", label, "blocking",
                    "No baseline schedule or project activity data is recorded.")
    need_years = int(rules.get("lookback_min_years") or 3) if rules else 3
    start = project.crediting_start or project.baseline_start
    if start is not None:
        start_year = start.year
    else:
        proj_years = [r.year for r in records if r.scenario == "project"]
        start_year = min(proj_years) if proj_years else max(r.year for r in records) + 1
    fields = sorted({e.field_id for e in enrol if e.status == "enrolled"})
    gaps: list[str] = []
    for fid in fields:
        base = [r for r in records if r.field_id == fid and r.scenario == "baseline" and r.year < start_year]
        years = sorted({r.year for r in base})
        if len(years) < need_years:
            gaps.append(f"{len(years)} of {need_years} look-back year(s)")
            continue
        for y in years[-need_years:]:
            cats = {r.category for r in base if r.year == y}
            lacking = [c for c in emissions_domain.TABLE4_CATEGORIES if c not in cats]
            if lacking:
                gaps.append(f"{y}: {', '.join(lacking)}")
                break
    untiered = sum(1 for r in records if not r.data_tier)
    if untiered:
        gaps.append(f"{untiered} record(s) without a Box 1 data tier")
    if not gaps:
        return _dim("activity_data_complete", label, "ok",
                    f"{len(records)} record(s); every enrolled field has {need_years} complete look-back year(s).")
    return _dim("activity_data_complete", label, "warning",
                f"{len(gaps)} gap(s): " + "; ".join(gaps[:5]) + ("..." if len(gaps) > 5 else ""))


def _control_dimension(rules: rs.RuleSet | None, strata: list[Stratum], today: date) -> dict[str, str]:
    label = "Baseline control sites (QA2)"
    if rules is None:
        return _dim("control_sites", label, "blocking", "Approve the rules first.")
    if rules.get("qa_soc") != "qa2":
        return _dim("control_sites", label, "ok", "Not needed: SOC is not quantified with QA2.")
    current = [s for s in strata if _effective(s, today)]
    controls = [s for s in current if s.role == "control"]
    projects = [s for s in current if s.role == "project"]
    if not controls:
        allowed = rules.get("baseline_scenario_required") is True
        return _dim("control_sites", label, "warning" if allowed else "blocking",
                    "No control zones; the baseline comes from a modelled term." if allowed else
                    "QA2 needs baseline control sites (VM0042 §8.2).")
    n_sites = len({str(f) for c in controls for f in (c.field_ids or [])})
    need = int(rules.get("min_control_sites") or 3)
    linked = {c.control_for_code for c in controls}
    without = [p.code for p in projects if p.code not in linked]
    ok = n_sites >= need and not without
    detail = f"{n_sites} control site(s) (need {need})"
    detail += f"; strata without control: {', '.join(without)}" if without else "; every stratum has one."
    return _dim("control_sites", label, "ok" if ok else "blocking", detail)


def _metadata_table(name: str):
    from app.core import db as dbmod

    return dbmod.Base.metadata.tables.get(name)


def _table_dimension(db: Session, project: Project, table: str, key: str, label: str, hint: str,
                     where: dict[str, Any] | None = None, approved_status: str | None = "approved") -> dict[str, str]:
    """Read a table another module owns, only if it exists (skip gracefully otherwise).
    With a ``status`` column, only rows in ``approved_status`` count as done."""
    t = _metadata_table(table)
    if t is None or "project_id" not in t.c:
        return _dim(key, label, "warning", f"Not recorded on the platform yet. {hint}")
    try:
        if not inspect(db.get_bind()).has_table(table):
            return _dim(key, label, "warning", f"Not recorded on the platform yet. {hint}")
        q = select(t.c.status if "status" in t.c else t.c.project_id).where(t.c.project_id == project.id)
        if "org_id" in t.c:
            q = q.where(t.c.org_id == project.org_id)
        for col, val in (where or {}).items():
            q = q.where(t.c[col] == val)
        rows = list(db.execute(q).scalars())
    except Exception:  # noqa: BLE001 - another module's table; never break readiness
        return _dim(key, label, "warning", f"Could not be read. {hint}")
    if not rows:
        return _dim(key, label, "blocking", f"None recorded. {hint}")
    if "status" in t.c and approved_status is not None:
        done = sum(1 for r in rows if r == approved_status)
        if not done:
            return _dim(key, label, "warning", f"{len(rows)} record(s), none {approved_status} yet.")
        return _dim(key, label, "ok", f"{done} {approved_status} record(s).")
    return _dim(key, label, "ok", f"{len(rows)} record(s).")


def _monitoring_plan_dimension(db: Session, project: Project) -> dict[str, str]:
    label = "Monitoring plan (§9)"
    hint = ("VM0042 §9: tasks, boundary, parameters, sample designs, control-site plans, 10-year baseline "
            "re-evaluation, QA/QC, archiving (>= 2 years after crediting).")
    docs = _metadata_table("documents")
    if docs is not None and "kind" in docs.c and "project_id" in docs.c:
        d = _table_dimension(db, project, "documents", "monitoring_plan", label, hint,
                             where={"kind": "monitoring_plan"}, approved_status="active")
        if d["status"] == "ok":
            return d
    n = db.scalar(select(func.count()).select_from(EvidenceFile).where(
        EvidenceFile.org_id == project.org_id, EvidenceFile.kind == "monitoring_plan",
        EvidenceFile.entity_id == str(project.id))) or 0
    return _dim("monitoring_plan", label, "ok" if n else "warning",
                f"{n} monitoring-plan document(s) attached." if n else f"No monitoring plan recorded. {hint}")


def readiness(db: Session, user: CurrentUser, project_id: str, period_label: str | None = None) -> dict[str, Any]:
    project = get_project(db, user, project_id)
    org = user.org_id
    dims: list[dict[str, str]] = []

    pack = db.get(RulePack, project.rule_pack_id) if project.rule_pack_id else None
    rules: rs.RuleSet | None = None
    if pack is None:
        dims.append(_dim("rules_approved", "Methodology rules approved", "blocking", "No rule pack is assigned."))
    elif pack.status != "approved":
        dims.append(_dim("rules_approved", "Methodology rules approved", "blocking",
                         f"The rule pack is {pack.status}; it must be approved."))
    else:
        rules = rs.load_pack(db, pack.id, require_approved=True)
        dims.append(_dim("rules_approved", "Methodology rules approved", "ok",
                         f"{pack.methodology_code} v{pack.methodology_version} rev {pack.revision} is approved."))

    enrol = db.scalars(select(Enrolment).where(Enrolment.org_id == org, Enrolment.project_id == project.id)).all()
    n_enrolled = sum(1 for e in enrol if e.status == "enrolled")
    n_pending = sum(1 for e in enrol if e.status in ("pending", "eligible"))
    dims.append(_dim("fields_enrolled", "Fields enrolled",
                     "ok" if n_enrolled and not n_pending else ("warning" if n_enrolled else "blocking"),
                     f"{n_enrolled} enrolled, {n_pending} awaiting a decision."))

    today = utcnow().date()
    strata = db.scalars(select(Stratum).where(Stratum.org_id == org, Stratum.project_id == project.id)).all()
    current = [s for s in strata if _effective(s, today) and s.role == "project"]
    no_area = [s.code for s in current if not s.area_ha or s.area_ha <= 0]
    dims.append(_dim("strata_defined", "Zones defined",
                     "blocking" if not current or no_area else "ok",
                     f"{len(current)} project zone(s) in effect" + (f"; without area: {', '.join(no_area)}" if no_area else ".")))

    campaigns = db.scalars(select(Campaign).where(Campaign.org_id == org, Campaign.project_id == project.id)).all()
    camp_ids = [c.id for c in campaigns]
    plans = db.scalars(select(SamplePlan).where(SamplePlan.org_id == org, SamplePlan.campaign_id.in_(camp_ids))).all() \
        if camp_ids else []
    n_plan_ok = sum(1 for p in plans if p.status == "approved")
    dims.append(_dim("sample_plans_approved", "Sample plans approved",
                     "blocking" if not plans else ("ok" if n_plan_ok == len(plans) else "warning"),
                     f"{n_plan_ok} of {len(plans)} plan(s) approved."))

    def collected(kind: str) -> tuple[int, int]:
        ids = [c.id for c in campaigns if c.kind == kind]
        if not ids:
            return 0, 0
        pts = db.scalar(select(func.count()).select_from(SamplingPoint).where(
            SamplingPoint.org_id == org, SamplingPoint.campaign_id.in_(ids))) or 0
        smp = db.scalar(select(func.count()).select_from(Sample).where(
            Sample.org_id == org, Sample.campaign_id.in_(ids))) or 0
        return smp, pts

    b_smp, b_pts = collected("baseline")
    dims.append(_dim("baseline_samples_collected", "Baseline samples collected",
                     "blocking" if b_smp == 0 else ("ok" if b_smp >= b_pts else "warning"),
                     f"{b_smp} of {b_pts} planned baseline core(s) collected."))

    samples = db.scalars(select(Sample).where(Sample.org_id == org, Sample.campaign_id.in_(camp_ids))).all() \
        if camp_ids else []
    sample_ids = [s.id for s in samples]
    layers = db.scalars(select(SoilLayer).where(SoilLayer.sample_id.in_(sample_ids))).all() if sample_ids else []
    layer_ids = [lyr.id for lyr in layers]
    results = db.scalars(select(LabResult).where(LabResult.org_id == org, LabResult.layer_id.in_(layer_ids))).all() \
        if layer_ids else []
    accepted = [r for r in results if r.status == "accepted" and (r.purpose or "primary") == "primary"]
    needed = set(REQUIRED_ANALYTES)
    if rules is not None and rules.get("coarse_fragment_correction"):
        needed.add("coarse_fraction")
    have: dict[uuid.UUID, set[str]] = defaultdict(set)
    for r in accepted:
        have[r.layer_id].add(r.analyte)
    eq3 = {"soc_pct", "fine_soil_mass_g"}
    complete = sum(1 for lid in layer_ids if needed <= have.get(lid, set()) or eq3 <= have.get(lid, set()))
    dims.append(_dim("lab_results_accepted", "Lab results accepted",
                     "blocking" if not layer_ids or complete == 0 else ("ok" if complete == len(layer_ids) else "warning"),
                     f"{complete} of {len(layer_ids)} layer(s) have all accepted results."))

    with_cert = sum(1 for r in accepted if r.certificate_id)
    dims.append(_dim("certificates_attached", "Lab certificates attached",
                     "blocking" if not accepted else ("ok" if with_cert == len(accepted) else "warning"),
                     f"{with_cert} of {len(accepted)} accepted result(s) have a certificate."))

    custody = db.scalars(select(CustodyEvent).where(CustodyEvent.sample_id.in_(sample_ids))).all() if sample_ids else []
    events: dict[uuid.UUID, set[str]] = defaultdict(set)
    for e in custody:
        events[e.sample_id].add(e.event)
    chain_ok = sum(1 for sid in sample_ids if {"collected", "lab_received"} <= events.get(sid, set()))
    dims.append(_dim("custody_complete", "Chain of custody complete",
                     "blocking" if not sample_ids else ("ok" if chain_ok == len(sample_ids) else "warning"),
                     f"{chain_ok} of {len(sample_ids)} sample(s) have a complete chain from field to lab."))

    blocking = open_blocking_findings(db, org, project.id)
    dims.append(_dim("open_blocking_qa", "No blocking quality issues", "blocking" if blocking else "ok",
                     f"{len(blocking)} open blocking issue(s)."))

    m_smp, m_pts = collected("monitoring")
    has_mon = any(c.kind == "monitoring" for c in campaigns)
    dims.append(_dim("monitoring_campaign", "Monitoring campaign",
                     "ok" if m_smp and m_smp >= m_pts else ("warning" if has_mon else "blocking"),
                     f"{m_smp} of {m_pts} monitoring core(s) collected." if has_mon else "No monitoring campaign yet."))

    term_q = select(TermEstimate).where(TermEstimate.org_id == org, TermEstimate.project_id == project.id,
                                        TermEstimate.status == "approved")
    if period_label:
        term_q = term_q.where(TermEstimate.period_label == period_label)
    approved_t = {t.term for t in db.scalars(term_q).all()}
    rule_terms = ("baseline_scenario", "project_emissions", "baseline_emissions", "leakage")
    if rules is None:
        dims.append(_dim("terms_approved", "Project terms approved", "blocking", "Approve the rules first."))
    else:
        needed_terms = [t for t in rule_terms if rules.get(f"{t}_required") is True]
        undecided = [t for t in rule_terms if rules.get(f"{t}_required") is None]
        missing_t = [t for t in needed_terms if t not in approved_t]
        status = "blocking" if undecided else ("warning" if missing_t else "ok")
        detail = ("Missing approved estimates: " + ", ".join(missing_t)) if missing_t else "All required terms approved."
        if undecided:
            detail = "The rules don't say whether these terms are needed: " + ", ".join(undecided)
        dims.append(_dim("terms_approved", "Project terms approved", status, detail))

    dims.append(_activity_dimension(db, project, rules, enrol))
    dims.append(_control_dimension(rules, strata, today))
    dims.append(_table_dimension(db, project, "additionality_assessments", "additionality",
                                 "Additionality assessment recorded",
                                 "VM0042 §7: regulatory surplus, barrier analysis and common practice (< 20 %)."))
    dims.append(_monitoring_plan_dimension(db, project))

    runs = db.scalars(select(CalculationRun).where(CalculationRun.org_id == org,
                                                   CalculationRun.project_id == project.id)).all()
    statuses = {r.id: run_status(db, r.id) for r in runs}
    n_approved = sum(1 for s in statuses.values() if s == "approved")
    dims.append(_dim("calculation_approved", "Calculation approved",
                     "ok" if n_approved else ("warning" if runs else "blocking"),
                     f"{n_approved} approved of {len(runs)} run(s)."))

    from app.modules.verification.models import VerificationPackage

    n_pkg = db.scalar(select(func.count()).select_from(VerificationPackage).where(
        VerificationPackage.org_id == org, VerificationPackage.project_id == project.id)) or 0
    dims.append(_dim("package_issued", "Verification package issued", "ok" if n_pkg else "warning",
                     f"{n_pkg} package(s) issued."))

    weight = {"ok": 1.0, "warning": 0.5, "blocking": 0.0}
    score = round(100.0 * sum(weight[d["status"]] for d in dims) / len(dims), 1)
    return {"project_id": str(project.id), "dimensions": dims, "score_pct": score,
            "ready": all(d["status"] != "blocking" for d in dims)}
