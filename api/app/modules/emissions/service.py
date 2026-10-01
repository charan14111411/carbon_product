"""Emissions (QA3) read model: activity data from the baseline module's ``ActivityRecord`` table
(latest active version per record) → the pure equations in ``domain.py``.

The calculation service uses ``emissions_input`` so a run and the stand-alone breakdown read
exactly the same rows.
"""

from __future__ import annotations

import uuid
from datetime import date
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.errors import ValidationFailed
from app.core.tenancy import get_owned
from app.modules.baseline.models import ActivityRecord
from app.modules.emissions import domain
from app.modules.land.models import Field
from app.modules.methodology import ruleset as rs
from app.modules.programmes.models import Project
from app.modules.sampling.models import Stratum


def _effective(s: Stratum, on: date) -> bool:
    return s.effective_from <= on and (s.effective_to is None or s.effective_to > on)


def latest_records(db: Session, org_id: uuid.UUID, project_id: uuid.UUID) -> list[ActivityRecord]:
    """Latest version of every activity record of the project; voided records are dropped."""
    rows = db.scalars(select(ActivityRecord).where(ActivityRecord.org_id == org_id,
                                                   ActivityRecord.project_id == project_id)).all()
    best: dict[uuid.UUID, ActivityRecord] = {}
    for r in rows:
        cur = best.get(r.record_id)
        if cur is None or r.version > cur.version:
            best[r.record_id] = r
    return sorted((r for r in best.values() if r.status == "active"),
                  key=lambda r: (str(r.field_id), r.scenario, r.year, r.category, str(r.record_id)))


def to_activity(r: ActivityRecord) -> domain.Activity:
    return domain.Activity(field_id=str(r.field_id), scenario=r.scenario, year=int(r.year), category=r.category,
                           attributes=dict(r.attributes or {}), data_tier=int(r.data_tier or 0),
                           record_id=str(r.record_id), version=int(r.version))


def project_units(db: Session, project: Project, on: date) -> tuple[tuple[domain.QuantUnit, ...], dict[str, float]]:
    """Quantification units (§8.1): project strata grouped by ``quantification_unit`` (default: the stratum)."""
    strata = [s for s in db.scalars(select(Stratum).where(Stratum.org_id == project.org_id,
                                                          Stratum.project_id == project.id)).all()
              if _effective(s, on) and s.role == "project"]
    grouped: dict[str, dict[str, Any]] = {}
    for s in sorted(strata, key=lambda x: x.code):
        qu = s.quantification_unit or s.code
        g = grouped.setdefault(qu, {"area": 0.0, "fields": []})
        g["area"] += float(s.area_ha or 0.0)
        for f in s.field_ids or []:
            if str(f) not in g["fields"]:
                g["fields"].append(str(f))
    units = tuple(domain.QuantUnit(code, g["area"], tuple(g["fields"])) for code, g in sorted(grouped.items()))
    ids = [uuid.UUID(f) for u in units for f in u.field_ids]
    areas = {str(f.id): float(f.area_ha) for f in db.scalars(select(Field).where(Field.id.in_(ids))).all()} \
        if ids else {}
    return units, areas


def start_year(project: Project, fallback: date) -> int:
    d = project.crediting_start or project.baseline_start or fallback
    return d.year


def year_weights(start: date, end: date) -> dict[int, float]:
    from app.modules.calculation.engine import vintages_for

    return {v.year: v.weight for v in vintages_for(start, end)}


def emissions_input(db: Session, project: Project, start: date, end: date, *,
                    biochar_years: tuple[int, ...] = (), on: date | None = None) -> tuple[domain.EmissionsInput,
                                                                                          list[ActivityRecord]]:
    records = latest_records(db, project.org_id, project.id)
    units, areas = project_units(db, project, on or end)
    inp = domain.EmissionsInput(
        activities=tuple(to_activity(r) for r in records), units=units, field_areas=areas,
        project_start_year=start_year(project, start), year_weights=year_weights(start, end),
        biochar_years=biochar_years,
    )
    return inp, records


def breakdown(db: Session, user: CurrentUser, project_id: str, start: date, end: date) -> dict[str, Any]:
    project = get_owned(db, Project, project_id, user, "Project")
    if end < start:
        raise ValidationFailed("The end date can't be before the start date.", code="INVALID_PERIOD")
    rules = rs.for_project(db, project, require_approved=True)
    inp, records = emissions_input(db, project, start, end, biochar_years=tuple(range(start.year, end.year + 1)))
    res = domain.quantify(inp, rules)
    out = res.to_dict()
    total_reduction = sum(s["reduction_t_co2e"] for s in res.sources.values())
    return {
        "project_id": str(project.id), "start": start.isoformat(), "end": end.isoformat(),
        "project_start_year": inp.project_start_year,
        "quantification_units": [{"code": u.code, "area_ha": u.area_ha, "field_ids": list(u.field_ids)} for u in inp.units],
        "records_used": len(records),
        "total_reduction_t_co2e": total_reduction,
        "leakage_oa_t_co2e": float(sum(res.leakage_oa_by_year.values())),
        **out,
        "equations": [
            {"eq": "Eq. 6–7", "label": "Fossil fuel CO2: Σ FFC × EF_CO2 / A_i"},
            {"eq": "Eq. 8–9", "label": "Liming CO2: (M_limestone × 0.12 + M_dolomite × 0.13) × 44/12 / A_i"},
            {"eq": "Eq. 11", "label": "Enteric CH4: GWP × Σ Pop × EF_ent / 1000 / A_i"},
            {"eq": "Eq. 12–13", "label": "Manure CH4: GWP × Σ Pop × VS × AWMS × EF / 10⁶ / A_i"},
            {"eq": "Eq. 14", "label": "Burning CH4: GWP × Σ MB × CF × EF / 10⁶ / A_i"},
            {"eq": "Eq. 17–23", "label": "Fertiliser N2O: direct + volatilisation + leaching"},
            {"eq": "Eq. 24–25", "label": "N-fixing N2O: F_CR × EF_Ndirect × 44/28 × GWP / A_i"},
            {"eq": "Eq. 26–31", "label": "Manure deposition N2O: direct + indirect"},
            {"eq": "Eq. 32", "label": "Burning N2O: GWP × Σ MB × CF × EF / 10⁶ / A_i"},
            {"eq": "Eq. 33", "label": "Organic-amendment leakage: M × CC × 0.12 × 44/12"},
            {"eq": "Eq. 52–59", "label": "Reduction = Σ_i (baseline − project areal mean) × A_i"},
        ],
        "rule_pack": rules.snapshot()["methodology"],
        "data_class": "CALCULATED",
        "note": "Emission factors: the low or high end of each range is chosen conservatively (§8.6.3).",
    }
