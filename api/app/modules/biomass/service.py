"""Tree/shrub inventory and the woody-biomass terms (VM0042 v2.2 Eq. 48–51 via CDM AR-TOOL14, see ``domain.py``).

The output is a DRAFT ``TermEstimate`` (``woody_biomass_project`` / ``woody_biomass_baseline``) created through the
calculation module, with the frozen computation stored in ``TermComputation``. A second person approves it with the
existing ``POST /terms/{id}/approve`` (four-eyes), after which the engine uses it in Eq. 44/45.
"""

from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, ensure_not_author
from app.core.db import utcnow
from app.core.errors import Blocked, Conflict, IllegalTransition, NotFound, RuleMissing, ValidationFailed
from app.core.events import emit
from app.core.tenancy import _plain, audit, get_owned, scoped, snapshot
from app.modules.biomass import domain
from app.modules.biomass.models import (
    AllometricModel, BiomassCampaign, BiomassPlot, PlotMeasurement, TermComputation,
)
from app.modules.calculation import engine
from app.modules.calculation import service as calc
from app.modules.calculation.models import TermEstimate
from app.modules.calculation.schemas import TermIn
from app.modules.evidence.models import EvidenceFile
from app.modules.land.models import Field
from app.modules.methodology import ruleset as rs
from app.modules.programmes.models import Project
from app.modules.sampling.models import Stratum


# ================================================================ shared helpers (also used by leakage)
def evidence_ids(db: Session, user: CurrentUser, ids: list[str], *, required: bool = False,
                 what: str = "this record") -> list[str]:
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
        raise ValidationFailed("Some attached files could not be found. Upload them again.", code="INVALID_EVIDENCE",
                               details={"evidence_ids": bad})
    if required and not out:
        raise ValidationFailed(f"Attach at least one file as evidence for {what}.", code="EVIDENCE_REQUIRED")
    return out


def period_years(start, end) -> float:
    """Length of the period as the engine counts it (sum of calendar-year shares)."""
    return float(sum(v.weight for v in engine.vintages_for(start, end)))


def publish_term(db: Session, user: CurrentUser, project: Project, *, term: str, period_label: str, value: float,
                 variance: float, df: float | None, method: str, summary: str, inputs: dict[str, Any],
                 results: dict[str, Any], rule_pack_id: str | None) -> tuple[TermEstimate, TermComputation]:
    """Freeze a computation and create the matching DRAFT term estimate (approved later by someone else)."""
    comp_id = uuid.uuid4()
    inputs, results = _plain(inputs), _plain(results)
    sha = calc.sha256_json({"inputs": inputs, "results": results, "term": term, "period_label": period_label})
    source = (f"Platform computation {comp_id} ({method}). {summary} Rule pack {rule_pack_id or '—'}. "
              f"Snapshot sha256 {sha}.")
    if len(source) > 5000:
        source = source[:4990] + " …"
    t = calc.create_term(db, user, str(project.id), TermIn(
        period_label=period_label, term=term, value_t_co2e=float(value), variance=float(max(variance, 0.0)),
        df=float(df) if df and variance > 0 else None, source=source))
    db.flush()
    comp = TermComputation(
        id=comp_id, org_id=user.org_id, created_by=user.id, project_id=project.id, term=term,
        period_label=period_label, method=method[:200], inputs=inputs, results=results,
        rule_pack_id=uuid.UUID(rule_pack_id) if rule_pack_id and rule_pack_id != "test" else None,
        term_estimate_id=t.id, snapshot_sha256=sha)
    db.add(comp)
    audit(db, user, "term_computation.create", comp)
    emit(db, user, "term.computed", t, {"term": term, "period_label": period_label, "computation_id": str(comp_id),
                                        "value_t_co2e": float(value)})
    return t, comp


def computation_out(c: TermComputation) -> dict[str, Any]:
    return {"id": str(c.id), "project_id": str(c.project_id), "term": c.term, "period_label": c.period_label,
            "method": c.method, "inputs": c.inputs, "results": c.results,
            "rule_pack_id": str(c.rule_pack_id) if c.rule_pack_id else None,
            "term_estimate_id": str(c.term_estimate_id), "snapshot_sha256": c.snapshot_sha256,
            "created_by": str(c.created_by) if c.created_by else None, "created_at": c.created_at}


def list_computations(db: Session, user: CurrentUser, project_id: str, term: str | None = None) -> list[TermComputation]:
    project = calc.get_project(db, user, project_id)
    q = scoped(TermComputation, user).where(TermComputation.project_id == project.id)
    if term:
        q = q.where(TermComputation.term == term)
    return list(db.scalars(q.order_by(TermComputation.created_at)).all())


def _uuid(raw: str, what: str) -> uuid.UUID:
    try:
        return uuid.UUID(str(raw))
    except ValueError as exc:
        raise NotFound(f"{what} not found.") from exc


# ================================================================ allometric models
def allometry_out(m: AllometricModel) -> dict[str, Any]:
    return {"id": str(m.id), "project_id": str(m.project_id), "species": m.species, "form": m.form,
            "form_label": domain.FORMS.get(m.form, {}).get("label"), "params": m.params,
            "output_unit": "t" if m.form == "volume_bef" else m.output_unit, "dbh_min_cm": m.dbh_min_cm,
            "dbh_max_cm": m.dbh_max_cm, "root_shoot_ratio": m.root_shoot_ratio, "source": m.source,
            "evidence_ids": list(m.evidence_ids or []), "status": m.status,
            "created_by": str(m.created_by) if m.created_by else None,
            "approved_by": str(m.approved_by) if m.approved_by else None, "approved_at": m.approved_at,
            "created_at": m.created_at}


def create_allometry(db: Session, user: CurrentUser, project_id: str, body: dict[str, Any]) -> AllometricModel:
    project = calc.get_project(db, user, project_id)
    form = body["form"]
    output_unit = "t" if form == "volume_bef" else body["output_unit"]
    domain.validate_allometry(form, body["params"], output_unit, body["dbh_min_cm"], body["dbh_max_cm"])
    m = AllometricModel(
        org_id=user.org_id, created_by=user.id, project_id=project.id, species=body["species"].strip(), form=form,
        params=dict(body["params"]), output_unit=output_unit, dbh_min_cm=body["dbh_min_cm"],
        dbh_max_cm=body["dbh_max_cm"], root_shoot_ratio=body.get("root_shoot_ratio"), source=body["source"].strip(),
        evidence_ids=evidence_ids(db, user, body.get("evidence_ids") or [], required=True,
                                  what="the allometric equation (its publication)"),
        status="draft")
    db.add(m)
    audit(db, user, "allometric_model.create", m)
    return m


def list_allometry(db: Session, user: CurrentUser, project_id: str) -> list[AllometricModel]:
    project = calc.get_project(db, user, project_id)
    return list(db.scalars(scoped(AllometricModel, user).where(AllometricModel.project_id == project.id)
                           .order_by(AllometricModel.species, AllometricModel.created_at)).all())


def approve_allometry(db: Session, user: CurrentUser, model_id: str) -> AllometricModel:
    m = get_owned(db, AllometricModel, model_id, user, "Allometric equation")
    if m.status != "draft":
        raise IllegalTransition(f"Only a draft equation can be approved; this one is {m.status}.")
    ensure_not_author(user.id, m.created_by, what="an allometric equation")
    clash = db.scalars(select(AllometricModel).where(
        AllometricModel.org_id == user.org_id, AllometricModel.project_id == m.project_id,
        AllometricModel.status == "approved", AllometricModel.id != m.id)).all()
    if any(domain._norm(c.species) == domain._norm(m.species) for c in clash):
        raise Conflict(f"An approved equation for “{m.species}” already exists. Retire it first.",
                       code="ALLOMETRY_EXISTS")
    before = {"status": m.status}
    m.status, m.approved_by, m.approved_at = "approved", user.id, utcnow()
    audit(db, user, "allometric_model.approve", m, before=before)
    return m


def retire_allometry(db: Session, user: CurrentUser, model_id: str, reason: str) -> AllometricModel:
    m = get_owned(db, AllometricModel, model_id, user, "Allometric equation")
    if m.status == "retired":
        raise IllegalTransition("This equation is already retired.")
    before = {"status": m.status}
    m.status = "retired"
    audit(db, user, "allometric_model.retire", m, before=before, reason=reason)
    return m


# ================================================================ plots & campaigns
def plot_out(p: BiomassPlot) -> dict[str, Any]:
    return {"id": str(p.id), "project_id": str(p.project_id), "stratum_id": str(p.stratum_id),
            "field_id": str(p.field_id) if p.field_id else None, "code": p.code, "scenario": p.scenario,
            "area_m2": p.area_m2, "latitude": p.latitude, "longitude": p.longitude, "status": p.status,
            "created_at": p.created_at}


def create_plot(db: Session, user: CurrentUser, project_id: str, body: dict[str, Any]) -> BiomassPlot:
    project = calc.get_project(db, user, project_id)
    stratum = get_owned(db, Stratum, body["stratum_id"], user, "Zone")
    if stratum.project_id != project.id:
        raise ValidationFailed("The zone belongs to another project.", code="INVALID_PLOT")
    field_id = None
    if body.get("field_id"):
        field_id = get_owned(db, Field, body["field_id"], user, "Field").id
    code = body["code"].strip()
    dup = db.scalar(scoped(BiomassPlot, user).where(BiomassPlot.project_id == project.id, BiomassPlot.code == code))
    if dup is not None:
        raise Conflict(f"A plot with the code {code} already exists in this project.", code="DUPLICATE_PLOT")
    p = BiomassPlot(org_id=user.org_id, created_by=user.id, project_id=project.id, stratum_id=stratum.id,
                    field_id=field_id, code=code, scenario=body["scenario"], area_m2=body["area_m2"],
                    latitude=body.get("latitude"), longitude=body.get("longitude"), status="active")
    db.add(p)
    audit(db, user, "biomass_plot.create", p)
    return p


def list_plots(db: Session, user: CurrentUser, project_id: str) -> list[BiomassPlot]:
    project = calc.get_project(db, user, project_id)
    return list(db.scalars(scoped(BiomassPlot, user).where(BiomassPlot.project_id == project.id)
                           .order_by(BiomassPlot.code)).all())


def campaign_out(c: BiomassCampaign) -> dict[str, Any]:
    return {"id": str(c.id), "project_id": str(c.project_id), "code": c.code, "measured_on": c.measured_on,
            "note": c.note, "created_at": c.created_at}


def create_campaign(db: Session, user: CurrentUser, project_id: str, body: dict[str, Any]) -> BiomassCampaign:
    project = calc.get_project(db, user, project_id)
    code = body["code"].strip()
    dup = db.scalar(scoped(BiomassCampaign, user).where(BiomassCampaign.project_id == project.id,
                                                        BiomassCampaign.code == code))
    if dup is not None:
        raise Conflict(f"A campaign with the code {code} already exists in this project.", code="DUPLICATE_CAMPAIGN")
    c = BiomassCampaign(org_id=user.org_id, created_by=user.id, project_id=project.id, code=code,
                        measured_on=body["measured_on"], note=body.get("note") or "")
    db.add(c)
    audit(db, user, "biomass_campaign.create", c)
    return c


def list_campaigns(db: Session, user: CurrentUser, project_id: str) -> list[BiomassCampaign]:
    project = calc.get_project(db, user, project_id)
    return list(db.scalars(scoped(BiomassCampaign, user).where(BiomassCampaign.project_id == project.id)
                           .order_by(BiomassCampaign.measured_on)).all())


# ================================================================ measurements (append-only)
def measurement_out(m: PlotMeasurement) -> dict[str, Any]:
    return {"id": str(m.id), "record_id": str(m.record_id), "version": m.version, "status": m.status,
            "project_id": str(m.project_id), "campaign_id": str(m.campaign_id), "plot_id": str(m.plot_id),
            "trees": list(m.trees or []), "shrub": m.shrub, "harvested": m.harvested,
            "evidence_ids": list(m.evidence_ids or []), "note": m.note,
            "created_by": str(m.created_by) if m.created_by else None, "created_at": m.created_at,
            "data_class": "MEASURED"}


def _latest_by_record(rows: list[PlotMeasurement]) -> list[PlotMeasurement]:
    best: dict[uuid.UUID, PlotMeasurement] = {}
    for r in rows:
        cur = best.get(r.record_id)
        if cur is None or r.version > cur.version:
            best[r.record_id] = r
    return list(best.values())


def _active_for(db: Session, org_id: uuid.UUID, campaign_id: uuid.UUID,
                plot_id: uuid.UUID | None = None) -> list[PlotMeasurement]:
    q = select(PlotMeasurement).where(PlotMeasurement.org_id == org_id, PlotMeasurement.campaign_id == campaign_id)
    if plot_id is not None:
        q = q.where(PlotMeasurement.plot_id == plot_id)
    return [r for r in _latest_by_record(list(db.scalars(q).all())) if r.status == "active"]


def _clean_trees(trees: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [{"species": t["species"].strip(), "dbh_cm": float(t["dbh_cm"]),
             "height_m": float(t["height_m"]) if t.get("height_m") is not None else None, "count": int(t["count"])}
            for t in trees]


def _clean_shrub(s: dict[str, Any] | None) -> dict[str, Any] | None:
    if not s:
        return None
    return {k: v for k, v in s.items() if v is not None}


def create_measurement(db: Session, user: CurrentUser, body: dict[str, Any]) -> PlotMeasurement:
    campaign = get_owned(db, BiomassCampaign, body["campaign_id"], user, "Campaign")
    plot = get_owned(db, BiomassPlot, body["plot_id"], user, "Plot")
    if plot.project_id != campaign.project_id:
        raise ValidationFailed("The plot and the campaign belong to different projects.", code="INVALID_MEASUREMENT")
    if plot.status != "active":
        raise IllegalTransition("This plot is retired.")
    if _active_for(db, user.org_id, campaign.id, plot.id):
        raise Conflict(f"Plot {plot.code} already has a measurement in campaign {campaign.code}. Correct it with a "
                       "new version instead.", code="DUPLICATE_MEASUREMENT")
    m = PlotMeasurement(
        org_id=user.org_id, created_by=user.id, record_id=uuid.uuid4(), version=1, status="active",
        project_id=plot.project_id, campaign_id=campaign.id, plot_id=plot.id, trees=_clean_trees(body["trees"]),
        shrub=_clean_shrub(body.get("shrub")), harvested=bool(body.get("harvested")),
        evidence_ids=evidence_ids(db, user, body["evidence_ids"], required=True, what="the plot measurement"),
        note=body.get("note") or "")
    db.add(m)
    audit(db, user, "biomass_measurement.create", m)
    return m


def latest_measurement(db: Session, user: CurrentUser, record_id: str) -> PlotMeasurement:
    rid = _uuid(record_id, "Measurement")
    rows = list(db.scalars(scoped(PlotMeasurement, user).where(PlotMeasurement.record_id == rid)).all())
    if not rows:
        raise NotFound("Measurement not found.")
    return max(rows, key=lambda r: r.version)


def new_version(db: Session, user: CurrentUser, record_id: str, body: dict[str, Any], *,
                void: bool = False) -> PlotMeasurement:
    cur = latest_measurement(db, user, record_id)
    if cur.status != "active":
        raise IllegalTransition("This measurement has been voided.")
    if void:
        trees, shrub, harvested, ev = list(cur.trees or []), cur.shrub, cur.harvested, list(cur.evidence_ids or [])
    else:
        trees, shrub = _clean_trees(body["trees"]), _clean_shrub(body.get("shrub"))
        harvested = bool(body.get("harvested"))
        ev = evidence_ids(db, user, body["evidence_ids"], required=True, what="the corrected measurement")
    m = PlotMeasurement(
        org_id=user.org_id, created_by=user.id, record_id=cur.record_id, version=cur.version + 1,
        status="voided" if void else "active", project_id=cur.project_id, campaign_id=cur.campaign_id,
        plot_id=cur.plot_id, trees=trees, shrub=shrub, harvested=harvested, evidence_ids=ev,
        note=body.get("reason") or "")
    db.add(m)
    audit(db, user, "biomass_measurement.void" if void else "biomass_measurement.correct", m,
          before=snapshot(cur), reason=body.get("reason"))
    return m


def list_measurements(db: Session, user: CurrentUser, project_id: str, campaign_id: str | None = None,
                      include_voided: bool = False) -> list[PlotMeasurement]:
    project = calc.get_project(db, user, project_id)
    q = scoped(PlotMeasurement, user).where(PlotMeasurement.project_id == project.id)
    if campaign_id:
        q = q.where(PlotMeasurement.campaign_id == _uuid(campaign_id, "Campaign"))
    rows = _latest_by_record(list(db.scalars(q).all()))
    if not include_voided:
        rows = [r for r in rows if r.status == "active"]
    return sorted(rows, key=lambda r: (str(r.campaign_id), str(r.plot_id)))


# ================================================================ computation
def _woody_rules(rules: rs.RuleSet) -> domain.WoodyRules:
    if not rules.require("woody_biomass_included"):
        raise Blocked("Woody biomass is not in this project's boundary (rule “Woody biomass in the project "
                      "boundary” is No), so no tree or shrub term can be computed.", code="WOODY_NOT_INCLUDED",
                      details={"rule_key": "woody_biomass_included"})
    below = bool(rules.require("woody_belowground_included"))
    shrubs = bool(rules.require("woody_shrubs_included"))
    return domain.WoodyRules(
        belowground=below, shrubs=shrubs, cf_tree=float(rules.require("tree_carbon_fraction")),
        cf_shrub=float(rules.require("shrub_carbon_fraction")) if shrubs else None,
        r_shrub=float(rules.require("shrub_root_shoot_ratio")) if shrubs and below else None,
        bdr_sf=rules.get("shrub_biomass_ratio_bdr_sf"), b_forest_t_dm_ha=rules.get("shrub_forest_biomass_t_dm_ha"),
        max_interval_years=float(rules.require("woody_remeasure_max_years")))


def _plot_measurements(db: Session, org_id: uuid.UUID, campaign: BiomassCampaign,
                       plots: dict[uuid.UUID, BiomassPlot]) -> list[domain.PlotMeasurement]:
    out = []
    for r in _active_for(db, org_id, campaign.id):
        p = plots.get(r.plot_id)
        if p is None:
            continue
        shrub = domain.Shrub(**r.shrub) if r.shrub else None
        out.append(domain.PlotMeasurement(
            plot_id=str(p.id), plot_code=p.code, stratum_id=str(p.stratum_id), area_m2=p.area_m2,
            trees=tuple(domain.Tree(t["species"], t["dbh_cm"], t.get("height_m"), t["count"]) for t in r.trees or []),
            shrub=shrub, harvested=r.harvested, record_id=str(r.record_id)))
    return out


def _scaling_area(db: Session, s: Stratum) -> domain.StratumArea:
    """A_i for Eq. 48–51. Plots in a QA2 control zone measure the baseline of the project zone they control, so
    their per-hectare change is scaled by that project zone's area (and quantification unit), exactly as the SOC
    engine scales control-site changes (Eq. 46) — never by the small area of the control plots themselves."""
    if (s.role or "project") != "control":
        return domain.StratumArea(str(s.id), s.code, float(s.area_ha or 0.0), s.quantification_unit or "")
    target = db.scalar(select(Stratum).where(
        Stratum.org_id == s.org_id, Stratum.project_id == s.project_id, Stratum.code == s.control_for_code,
        Stratum.role == "project", Stratum.effective_to.is_(None)).order_by(Stratum.version.desc()))
    if target is None:
        raise RuleMissing(f"Control zone {s.code} doesn't point to a current project zone, so its plots can't be "
                          "scaled to a quantification-unit area (Eq. 48/50 A_i).",
                          details={"rule_key": "stratum_area", "stratum": s.code})
    return domain.StratumArea(str(s.id), f"{s.code} (baseline of {target.code})", float(target.area_ha or 0.0),
                              target.quantification_unit or target.code)


def compute_woody(db: Session, user: CurrentUser, project_id: str, body: dict[str, Any]) -> dict[str, Any]:
    """Preview (no writes): ΔC_TREE + ΔC_SHRUB for one scenario between two campaigns, and its period value."""
    project = calc.get_project(db, user, project_id)
    rules = rs.for_project(db, project)
    wr = _woody_rules(rules)
    c0 = get_owned(db, BiomassCampaign, body["from_campaign_id"], user, "Campaign")
    c1 = get_owned(db, BiomassCampaign, body["to_campaign_id"], user, "Campaign")
    if c0.project_id != project.id or c1.project_id != project.id:
        raise ValidationFailed("Both campaigns must belong to this project.", code="INVALID_CAMPAIGN")
    if body["period_end"] < body["period_start"]:
        raise ValidationFailed("The period must end after it starts.", code="INVALID_PERIOD")
    x = (c1.measured_on - c0.measured_on).days / 365.25
    plots = {p.id: p for p in db.scalars(scoped(BiomassPlot, user).where(
        BiomassPlot.project_id == project.id, BiomassPlot.scenario == body["scenario"],
        BiomassPlot.status == "active")).all()}
    if not plots:
        raise Blocked(f"There are no active {body['scenario']} plots in this project.", code="NO_PLOTS")
    strata = {str(s.id): _scaling_area(db, s)
              for s in db.scalars(select(Stratum).where(Stratum.id.in_({p.stratum_id for p in plots.values()}))).all()}
    models = [domain.Allometry(str(m.id), m.species, m.form, dict(m.params), m.output_unit, m.dbh_min_cm,
                               m.dbh_max_cm, m.root_shoot_ratio, m.source)
              for m in db.scalars(scoped(AllometricModel, user).where(
                  AllometricModel.project_id == project.id, AllometricModel.status == "approved")).all()]
    before = _plot_measurements(db, user.org_id, c0, plots)
    after = _plot_measurements(db, user.org_id, c1, plots)
    res = domain.stock_change(before, after, strata, models, wr, x, body["scenario"])
    py = period_years(body["period_start"], body["period_end"])
    per = domain.credit_period(res["annual_t_co2e"], res["variance_annual"], x, py)
    used_models = sorted({t["model_id"] for st in res["strata"] for p in st["plots"] for t in p["trees_end"]})
    term = "woody_biomass_project" if body["scenario"] == "project" else "woody_biomass_baseline"
    return {
        "term": term, "project_id": str(project.id), "period_label": body["period_label"],
        "period_start": body["period_start"], "period_end": body["period_end"],
        "from_campaign": campaign_out(c0), "to_campaign": campaign_out(c1),
        "rule_pack": {"id": rules.pack_id, "revision": rules.revision},
        "rules_used": {k: rules.get(k) for k in (
            "woody_biomass_included", "woody_belowground_included", "woody_shrubs_included",
            "woody_remeasure_max_years", "tree_carbon_fraction", "shrub_carbon_fraction", "shrub_root_shoot_ratio",
            "shrub_biomass_ratio_bdr_sf", "shrub_forest_biomass_t_dm_ha")},
        "allometric_model_ids": used_models,
        "measurement_record_ids": sorted({m.record_id for m in before + after}),
        **res, **per, "data_class": "CALCULATED",
        "sign_convention": "positive = woody carbon stock gain (removal), as Eq. 44/45 add it to ΔCO2",
        "method_notes": [
            "Eq. 48–51 (VM0042 v2.2 p.59–60): Σ_i (C̄_i,t − C̄_i,t−x) × 1/x × A_i.",
            "Per-tree biomass, root:shoot, carbon fraction and shrub cover method follow CDM AR-TOOL14.",
            "Sampling variance from paired permanent plots (s²_d / n per zone), Welch–Satterthwaite df.",
            "Period value = annual rate × min(period, x), as the engine treats SOC.",
        ],
    }


def publish_woody(db: Session, user: CurrentUser, project_id: str, body: dict[str, Any]) -> dict[str, Any]:
    res = compute_woody(db, user, project_id, body)
    project = calc.get_project(db, user, project_id)
    eqs = "/".join(res["equations"])
    n_plots = sum(st["n_plots"] for st in res["strata"])
    summary = (f"VM0042 v2.2 {eqs} (§8.5.1 p.59–60) with CDM AR-TOOL14 plot biomass; scenario {res['scenario']}; "
               f"campaigns {res['from_campaign']['code']} ({res['from_campaign']['measured_on']}) → "
               f"{res['to_campaign']['code']} ({res['to_campaign']['measured_on']}), x = {res['interval_years']:.4f} yr; "
               f"{n_plots} paired plots in {len(res['strata'])} zone(s); allometric models "
               f"{', '.join(res['allometric_model_ids']) or '—'}; ΔC_TREE {res['tree_annual_t_co2e']:.6f} + "
               f"ΔC_SHRUB {res['shrub_annual_t_co2e']:.6f} t CO2e/yr × {res['credited_years']:.4f} yr credited.")
    inputs = {k: res[k] for k in ("scenario", "period_start", "period_end", "from_campaign", "to_campaign", "rule_pack",
                                  "rules_used", "allometric_model_ids", "measurement_record_ids")}
    results = {k: v for k, v in res.items() if k not in inputs}
    t, comp = publish_term(db, user, project, term=res["term"], period_label=body["period_label"],
                           value=res["value_t_co2e"], variance=res["variance"], df=res["df"],
                           method=f"Woody biomass {eqs} / AR-TOOL14", summary=summary, inputs=inputs,
                           results=results, rule_pack_id=res["rule_pack"]["id"])
    return {"term": calc.term_out(t).model_dump(), "computation": computation_out(comp), "result": res}
