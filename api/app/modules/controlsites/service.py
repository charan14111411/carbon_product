"""Baseline control sites for QA2 (VM0042 v2.2 §8.2, Table 7, Appendix 5): links and assessments."""

from __future__ import annotations

import uuid
from collections import defaultdict
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core import geo
from app.core.auth import CurrentUser
from app.core.errors import NotFound, ValidationFailed
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.baseline.service import active_records
from app.modules.controlsites import domain
from app.modules.controlsites.models import ControlSiteAssessment, ControlSiteLink
from app.modules.evidence.models import EvidenceFile
from app.modules.lab.models import LabResult
from app.modules.land.models import Field, LandUseRecord
from app.modules.land.service import project_start
from app.modules.programmes.models import Project
from app.modules.sampling.models import Campaign, Sample, Site, SoilLayer, Stratum
from app.modules.sampling.service import approved_rules as sampling_approved_rules


def _project(db: Session, user: CurrentUser, project_id: str) -> Project:
    return get_owned(db, Project, project_id, user, "Project")


def _open_strata(db: Session, user: CurrentUser, project: Project) -> list[Stratum]:
    return list(db.scalars(scoped(Stratum, user).where(Stratum.project_id == project.id,
                                                       Stratum.effective_to.is_(None))
                           .order_by(Stratum.code)).all())


def _qu(s: Stratum) -> str:
    return s.quantification_unit or s.code


def _stratum(db: Session, user: CurrentUser, project: Project, sid: str, role: str) -> Stratum:
    s = get_owned(db, Stratum, sid, user, "Stratum")
    if s.project_id != project.id:
        raise NotFound("Stratum not found.")
    if s.effective_to is not None:
        raise ValidationFailed(f"Stratum {s.code} has been replaced by a newer version. Use the current one.")
    if (s.role or "project") != role:
        raise ValidationFailed(f"Stratum {s.code} is a {s.role or 'project'} stratum, not a {role} stratum.",
                               code="WRONG_STRATUM_ROLE")
    return s


def _fields(db: Session, org_id: uuid.UUID, strata: list[Stratum]) -> list[Field]:
    ids = {uuid.UUID(str(i)) for s in strata for i in (s.field_ids or [])}
    if not ids:
        return []
    return list(db.scalars(select(Field).where(Field.org_id == org_id, Field.id.in_(ids)).order_by(Field.code)).all())


def _conversions(db: Session, org_id: uuid.UUID, fields: list[Field], start_year: int) -> dict[str, Any]:
    rows = db.execute(select(LandUseRecord.field_id, LandUseRecord.from_year, LandUseRecord.to_year,
                             LandUseRecord.land_use)
                      .where(LandUseRecord.org_id == org_id, LandUseRecord.field_id.in_([f.id for f in fields]))
                      ).all() if fields else []
    by_field: dict[uuid.UUID, list[tuple[int, int, str]]] = defaultdict(list)
    for fid, a, b, use in rows:
        by_field[fid].append((a, b, use))
    return {f.code: domain.conversion(by_field[f.id], start_year) for f in fields}


def _site(f: Field) -> domain.Site:
    return domain.Site(f.code, f.area_ha, f.centroid_lat, f.centroid_lon, f.slope_pct, f.aspect_deg,
                       f.soil_texture_class, f.wrb_soil_group, f.ecoregion, f.climate_zone, f.mean_annual_precip_mm)


# ------------------------------------------------------------------ links
def create_link(db: Session, user: CurrentUser, project_id: str, data: dict[str, Any]) -> ControlSiteLink:
    project = _project(db, user, project_id)
    control = _stratum(db, user, project, data["control_stratum_id"], "control")
    target_id, qu_code = None, None
    if data.get("project_stratum_id"):
        target_id = _stratum(db, user, project, data["project_stratum_id"], "project").id
    else:
        qu_code = data["qu_code"].strip()
        if not any(_qu(s) == qu_code for s in _open_strata(db, user, project) if (s.role or "project") == "project"):
            raise ValidationFailed(f"No project stratum belongs to quantification unit '{qu_code}'.",
                                   code="UNKNOWN_QU")
    duplicate = db.scalar(scoped(ControlSiteLink, user).where(
        ControlSiteLink.control_stratum_id == control.id, ControlSiteLink.status == "active",
        ControlSiteLink.project_stratum_id.is_(None) if target_id is None
        else ControlSiteLink.project_stratum_id == target_id,
        ControlSiteLink.qu_code.is_(None) if qu_code is None else ControlSiteLink.qu_code == qu_code))
    if duplicate:
        raise ValidationFailed("This control site is already linked to that stratum or quantification unit.",
                               code="DUPLICATE_LINK")
    plan = None
    if data.get("management_plan_evidence_id"):
        plan = get_owned(db, EvidenceFile, data["management_plan_evidence_id"], user, "Evidence file").id
    c = domain.centroid([_site(f) for f in _fields(db, user.org_id, [control])])
    if c is None:
        raise ValidationFailed(f"Control stratum {control.code} has no fields, so its location can't be fixed.")
    link = ControlSiteLink(org_id=user.org_id, created_by=user.id, project_id=project.id,
                           control_stratum_id=control.id, project_stratum_id=target_id, qu_code=qu_code,
                           managed_by=data["managed_by"].strip(), management_plan_evidence_id=plan,
                           fixed_lat=c[0], fixed_lon=c[1], status="active", notes=data.get("notes", ""),
                           crop_group_justification=(data.get("crop_group_justification") or "").strip())
    db.add(link)
    audit(db, user, "control_site.link", link)
    return link


def update_link(db: Session, user: CurrentUser, project_id: str, link_id: str, data: dict[str, Any]) -> ControlSiteLink:
    project = _project(db, user, project_id)
    link = get_owned(db, ControlSiteLink, link_id, user, "Control-site link")
    if link.project_id != project.id:
        raise NotFound("Control-site link not found.")
    before = snapshot(link)
    if "management_plan_evidence_id" in data:
        eid = data.pop("management_plan_evidence_id")
        link.management_plan_evidence_id = get_owned(db, EvidenceFile, eid, user, "Evidence file").id if eid else None
    for key in ("managed_by", "notes", "crop_group_justification", "status"):
        if data.get(key) is not None:
            setattr(link, key, data[key].strip() if isinstance(data[key], str) else data[key])
    audit(db, user, "control_site.update", link, before=before)
    return link


def list_links(db: Session, user: CurrentUser, project_id: str) -> list[ControlSiteLink]:
    project = _project(db, user, project_id)
    return list(db.scalars(scoped(ControlSiteLink, user).where(ControlSiteLink.project_id == project.id)
                           .order_by(ControlSiteLink.created_at)).all())


# ------------------------------------------------------------------ data gathering
TABLE7_MIN_DEPTH_CM = 30.0  # Table 7: SOC and texture averaged to the project-boundary depth (minimum 30 cm)


def _depth(project: Project, db: Session) -> float:
    rules = sampling_approved_rules(db, project) or {}
    return max(TABLE7_MIN_DEPTH_CM, float(rules.get("stock_depth_cm") or TABLE7_MIN_DEPTH_CM))


def _profile_means(db: Session, org_id: uuid.UUID, strata: list[Stratum], depth: float,
                   analytes: tuple[str, ...]) -> list[dict[str, Any]]:
    """Per baseline sample in ``strata``: the average of each analyte over 0 → ``depth`` cm (Table 7 "average …
    to depth of project boundary"). Layers are weighted by fine-soil mass (bulk density × thickness × (1 − coarse
    fraction)) when every layer has bulk density, otherwise by thickness. A sample whose accepted layers don't
    cover 0 → depth without gaps is left out for that analyte."""
    ids = [s.id for s in strata]
    if not ids:
        return []
    rows = db.execute(
        select(Sample.id, Site.field_id, SoilLayer.id, SoilLayer.depth_from_cm, SoilLayer.depth_to_cm)
        .join(Site, Site.id == Sample.site_id).join(Campaign, Campaign.id == Sample.campaign_id)
        .join(SoilLayer, SoilLayer.sample_id == Sample.id)
        .where(Sample.org_id == org_id, Site.stratum_id.in_(ids), Campaign.kind == "baseline")).all()
    layers: dict[uuid.UUID, list[tuple[float, float, uuid.UUID]]] = defaultdict(list)
    field_of: dict[uuid.UUID, uuid.UUID] = {}
    for sample_id, field_id, layer_id, d0, d1 in rows:
        layers[sample_id].append((float(d0), float(d1), layer_id))
        field_of[sample_id] = field_id
    layer_ids = [lid for ls in layers.values() for *_, lid in ls]
    if not layer_ids:
        return []
    wanted = set(analytes) | {"bulk_density_g_cm3", "coarse_fraction"}
    results = db.scalars(select(LabResult).where(
        LabResult.org_id == org_id, LabResult.layer_id.in_(layer_ids), LabResult.analyte.in_(wanted))).all()
    superseded = {r.supersedes_id for r in results if r.supersedes_id}
    vals: dict[tuple[uuid.UUID, str], list[float]] = defaultdict(list)
    for r in results:
        if r.status == "accepted" and r.id not in superseded:
            vals[(r.layer_id, r.analyte)].append(float(r.value))
    mean = {k: sum(v) / len(v) for k, v in vals.items()}
    out = []
    for sample_id, ls in layers.items():
        ls = sorted(ls)
        row: dict[str, Any] = {"sample_id": sample_id, "field_id": field_of[sample_id]}
        for an in analytes:
            covered, total_w, acc, ok = 0.0, 0.0, 0.0, True
            use_mass = all((lid, "bulk_density_g_cm3") in mean for d0, _, lid in ls if d0 < depth)
            for d0, d1, lid in ls:
                if d0 >= depth:
                    break
                if abs(d0 - covered) > 1e-6 or (lid, an) not in mean:
                    ok = False
                    break
                thick = min(d1, depth) - d0
                w = thick
                if use_mass:
                    w = thick * mean[(lid, "bulk_density_g_cm3")] * (1 - mean.get((lid, "coarse_fraction"), 0.0))
                acc += mean[(lid, an)] * w
                total_w += w
                covered = min(d1, depth)
            if ok and covered + 1e-6 >= depth and total_w > 0:
                row[an] = acc / total_w
        out.append(row)
    return out


def _soc_values(db: Session, org_id: uuid.UUID, strata: list[Stratum], depth: float) -> list[float]:
    """One average SOC % (0 → depth) per baseline sample in ``strata`` (Table 7)."""
    return [r["soc_pct"] for r in _profile_means(db, org_id, strata, depth, ("soc_pct",)) if "soc_pct" in r]


def _texture_means(db: Session, org_id: uuid.UUID, strata: list[Stratum], fields: list[Field],
                   depth: float) -> dict[str, tuple[float, float]] | None:
    """Field code -> measured (sand %, clay %) averaged 0 → depth over its samples; None unless every field has it."""
    rows = _profile_means(db, org_id, strata, depth, ("texture_sand_pct", "texture_clay_pct"))
    per: dict[uuid.UUID, list[tuple[float, float]]] = defaultdict(list)
    for r in rows:
        if "texture_sand_pct" in r and "texture_clay_pct" in r:
            per[r["field_id"]].append((r["texture_sand_pct"], r["texture_clay_pct"]))
    if not fields or any(f.id not in per for f in fields):
        return None
    return {f.code: (sum(x for x, _ in per[f.id]) / len(per[f.id]), sum(y for _, y in per[f.id]) / len(per[f.id]))
            for f in fields}


def _alm_grid(db: Session, org_id: uuid.UUID, project: Project, fields: list[Field]):
    grid: dict[str, dict[int, dict[str, list[dict]]]] = {
        f.code: defaultdict(lambda: defaultdict(list)) for f in fields}
    code = {f.id: f.code for f in fields}
    for r in active_records(db, org_id, project_id=project.id, field_ids=[f.id for f in fields],
                            scenario="baseline"):
        grid[code[r.field_id]][r.year][r.category].append(r.attributes or {})
    return grid


# ------------------------------------------------------------------ assessment
def _assess_link(db: Session, org_id: uuid.UUID, project: Project, link: ControlSiteLink,
                 strata: dict[uuid.UUID, Stratum]) -> dict[str, Any]:
    control = strata.get(link.control_stratum_id)
    if control is None:  # the control stratum was redrawn: a new version must be linked
        return {"link_id": str(link.id), "overall": "fail", "criteria": [domain.crit(
            "control_stratum_current", "fail", "The linked control stratum has been replaced. Link the new version.")],
            "summary": {}}
    if link.project_stratum_id:
        targets = [s for s in strata.values() if s.id == link.project_stratum_id]
    else:
        targets = [s for s in strata.values() if (s.role or "project") == "project" and _qu(s) == link.qu_code]
    c_fields, q_fields = _fields(db, org_id, [control]), _fields(db, org_id, targets)
    cs, qs = [_site(f) for f in c_fields], [_site(f) for f in q_fields]
    criteria = []
    if not targets:
        criteria.append(domain.crit("target_current", "fail", "The linked project stratum no longer exists."))
    c_now = domain.centroid(cs)
    moved = geo.distance_m(link.fixed_lat, link.fixed_lon, *c_now) if c_now else None
    criteria.append(domain.crit(
        "location_fixed", "pending" if moved is None else "pass" if moved <= domain.LOCATION_TOLERANCE_M else "fail",
        "The control site has no fields." if moved is None else
        f"The control site has moved {moved:.0f} m since it was linked; its location must stay fixed."
        if moved > domain.LOCATION_TOLERANCE_M else "The control site is where it was when linked.",
        moved_m=None if moved is None else round(moved, 1)))
    criteria.append(domain.crit(
        "management_plan", "pass" if link.management_plan_evidence_id else "pending",
        "A management plan is attached." if link.management_plan_evidence_id
        else "Attach the control-site management plan (managed per the baseline schedule of activities)."))
    criteria.append(domain.distance_check(cs, qs, geo.distance_m))
    slope = domain.slope_check(cs, qs)
    depth = _depth(project, db)
    criteria += [slope, domain.aspect_check(cs, qs, slope),
                 domain.texture_check(cs, qs, _texture_means(db, org_id, [control], c_fields, depth),
                                      _texture_means(db, org_id, targets, q_fields, depth)),
                 domain.wrb_check(cs, qs),
                 domain.soc_check(_soc_values(db, org_id, [control], depth), _soc_values(db, org_id, targets, depth),
                                  depth_cm=depth)]
    start = project_start(project)
    if start is None:
        criteria.append(domain.crit("historical_alm", "pending", "Set the project start date first."))
        criteria.append(domain.crit("historical_land_cover", "pending", "Set the project start date first."))
    else:
        years = list(range(start.year - domain.ALM_YEARS, start.year))
        criteria.append(domain.alm_check(_alm_grid(db, org_id, project, c_fields),
                                         _alm_grid(db, org_id, project, q_fields), years,
                                         crop_group_justification=link.crop_group_justification))
        criteria.append(domain.land_cover_check(_conversions(db, org_id, c_fields, start.year),
                                                _conversions(db, org_id, q_fields, start.year)))
    criteria += [domain.ecoregion_check(cs, qs), domain.climate_check(cs, qs), domain.precip_check(cs, qs)]
    return {"link_id": str(link.id), "overall": domain.overall(criteria), "criteria": criteria,
            "summary": {"control_stratum": control.code, "targets": [s.code for s in targets],
                        "qu_code": link.qu_code, "control_fields": [f.code for f in c_fields],
                        "quantification_unit_fields": [f.code for f in q_fields]}}


def _project_checks(links: list[ControlSiteLink], results: dict[str, dict], project_strata: list[Stratum]) -> list:
    by_control: dict[uuid.UUID, list[str]] = defaultdict(list)
    for link in links:
        by_control[link.control_stratum_id].append(results[str(link.id)]["overall"])
    passing = sum(1 for v in by_control.values() if "pass" in v)
    n = len(by_control)
    status = "pass" if passing >= domain.MIN_CONTROL_SITES else "fail" if n < domain.MIN_CONTROL_SITES else "pending"
    checks = [domain.crit("min_control_sites", status,
                          f"{passing} of {n} linked control site(s) meet Table 7; at least "
                          f"{domain.MIN_CONTROL_SITES} are needed across the project.",
                          linked=n, passing=passing, required=domain.MIN_CONTROL_SITES)]
    coverage = []
    for s in project_strata:
        statuses = [results[str(link.id)]["overall"] for link in links
                    if link.project_stratum_id == s.id or (link.qu_code and link.qu_code == _qu(s))]
        st = "pass" if "pass" in statuses else "pending" if "pending" in statuses else "fail"
        coverage.append({"stratum": s.code, "quantification_unit": _qu(s), "status": st, "links": len(statuses)})
    uncovered = [c["stratum"] for c in coverage if c["status"] == "fail"]
    waiting = [c["stratum"] for c in coverage if c["status"] == "pending"]
    status = "fail" if uncovered or not coverage else "pending" if waiting else "pass"
    msg = ("No project strata to cover." if not coverage else
           f"No suitable control site for: {', '.join(uncovered)}." if uncovered else
           f"Control sites for {', '.join(waiting)} still have pending checks." if waiting else
           "Every project stratum has at least one suitable control site.")
    checks.append(domain.crit("control_site_per_stratum", status, msg, strata=coverage))
    return checks


def assess(db: Session, user: CurrentUser, project_id: str) -> dict[str, Any]:
    project = _project(db, user, project_id)
    strata_list = _open_strata(db, user, project)
    strata = {s.id: s for s in strata_list}
    links = [lk for lk in list_links(db, user, project_id) if lk.status == "active"]
    run_id = uuid.uuid4()
    results = {str(lk.id): _assess_link(db, user.org_id, project, lk, strata) for lk in links}
    for lk in links:
        r = results[str(lk.id)]
        db.add(ControlSiteAssessment(org_id=user.org_id, created_by=user.id, project_id=project.id, run_id=run_id,
                                     scope="link", link_id=lk.id, overall=r["overall"], criteria=r["criteria"],
                                     summary=r["summary"]))
    project_strata = [s for s in strata_list if (s.role or "project") == "project"]
    checks = _project_checks(links, results, project_strata)
    row = ControlSiteAssessment(org_id=user.org_id, created_by=user.id, project_id=project.id, run_id=run_id,
                                scope="project", link_id=None, overall=domain.overall(checks), criteria=checks,
                                summary={"links": len(links)})
    db.add(row)
    audit(db, user, "control_site.assess", row)
    return latest(db, user, project_id)


def latest(db: Session, user: CurrentUser, project_id: str) -> dict[str, Any]:
    project = _project(db, user, project_id)
    head = db.scalar(scoped(ControlSiteAssessment, user).where(
        ControlSiteAssessment.project_id == project.id, ControlSiteAssessment.scope == "project")
        .order_by(ControlSiteAssessment.created_at.desc()).limit(1))
    if head is None:
        raise NotFound("Control sites haven't been assessed for this project yet.")
    rows = db.scalars(scoped(ControlSiteAssessment, user).where(ControlSiteAssessment.run_id == head.run_id,
                                                                ControlSiteAssessment.scope == "link")
                      .order_by(ControlSiteAssessment.created_at)).all()
    return {
        "run_id": str(head.run_id), "project_id": str(project.id), "assessed_at": head.created_at,
        "assessed_by": str(head.created_by) if head.created_by else None, "overall": head.overall,
        "project_checks": head.criteria,
        "links": [{"link_id": str(r.link_id), "overall": r.overall, "criteria": r.criteria, **r.summary}
                  for r in rows],
        "data_class": "DERIVED",
    }
