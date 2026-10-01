"""Leakage terms LE_BR (§8.4.4, CDM TOOL16) and LK_disp (§8.4.2–8.4.3, VMD0054, Eq. 34–36); see ``domain.py``.

Outputs are DRAFT ``TermEstimate`` rows (``leakage_biomass_residues`` / ``leakage_displacement``) with their frozen
computation, approved by a second person through ``POST /terms/{id}/approve``. Positive values are leakage emissions
(t CO2e for the period); the engine subtracts them via Eq. 38/41 after allocating with Eq. 39/42.
"""

from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.errors import Blocked, Conflict, IllegalTransition, NotFound, RuleMissing
from app.core.tenancy import audit, scoped, snapshot
from app.modules.biomass import service as shared
from app.modules.calculation import service as calc
from app.modules.land.service import project_start
from app.modules.leakage import domain
from app.modules.leakage.models import DisplacementRecord, ResidueDiversion


def _latest(rows: list[Any]) -> list[Any]:
    best: dict[uuid.UUID, Any] = {}
    for r in rows:
        cur = best.get(r.record_id)
        if cur is None or r.version > cur.version:
            best[r.record_id] = r
    return list(best.values())


def _latest_record(db: Session, user: CurrentUser, model: type, record_id: str, what: str) -> Any:
    try:
        rid = uuid.UUID(str(record_id))
    except ValueError as exc:
        raise NotFound(f"{what} not found.") from exc
    rows = list(db.scalars(scoped(model, user).where(model.record_id == rid)).all())
    if not rows:
        raise NotFound(f"{what} not found.")
    cur = max(rows, key=lambda r: r.version)
    return cur


# ================================================================ residues (TOOL16)
def residue_out(r: ResidueDiversion) -> dict[str, Any]:
    return {"id": str(r.id), "record_id": str(r.record_id), "version": r.version, "status": r.status,
            "project_id": str(r.project_id), "period_label": r.period_label, "residue_type": r.residue_type,
            "baseline_energy_use": r.baseline_energy_use, "quantity_t_dry": r.quantity_t_dry,
            "ncv_gj_per_t_dry": r.ncv_gj_per_t_dry, "ef_co2_t_per_gj": r.ef_co2_t_per_gj,
            "factor_source": r.factor_source, "leakage_ruled_out": r.leakage_ruled_out,
            "ruled_out_reason": r.ruled_out_reason, "evidence_ids": list(r.evidence_ids or []), "note": r.note,
            "created_by": str(r.created_by) if r.created_by else None, "created_at": r.created_at,
            "data_class": "RECORDED"}


def _residue_fields(db: Session, user: CurrentUser, body: dict[str, Any]) -> dict[str, Any]:
    return {"residue_type": body["residue_type"].strip(), "baseline_energy_use": body["baseline_energy_use"].strip(),
            "quantity_t_dry": body["quantity_t_dry"], "ncv_gj_per_t_dry": body.get("ncv_gj_per_t_dry"),
            "ef_co2_t_per_gj": body.get("ef_co2_t_per_gj"), "factor_source": (body.get("factor_source") or "").strip(),
            "leakage_ruled_out": bool(body.get("leakage_ruled_out")),
            "ruled_out_reason": (body.get("ruled_out_reason") or "").strip(),
            "evidence_ids": shared.evidence_ids(db, user, body["evidence_ids"], required=True,
                                                what="the residue diversion")}


def create_residue(db: Session, user: CurrentUser, project_id: str, body: dict[str, Any]) -> ResidueDiversion:
    project = calc.get_project(db, user, project_id)
    r = ResidueDiversion(org_id=user.org_id, created_by=user.id, record_id=uuid.uuid4(), version=1, status="active",
                         project_id=project.id, period_label=body["period_label"].strip(),
                         note=body.get("note") or "", **_residue_fields(db, user, body))
    db.add(r)
    audit(db, user, "leakage_residue.create", r)
    return r


def residue_version(db: Session, user: CurrentUser, record_id: str, body: dict[str, Any], *,
                    void: bool = False) -> ResidueDiversion:
    cur = _latest_record(db, user, ResidueDiversion, record_id, "Residue record")
    if cur.status != "active":
        raise IllegalTransition("This record has been voided.")
    fields = ({k: getattr(cur, k) for k in ("residue_type", "baseline_energy_use", "quantity_t_dry",
                                            "ncv_gj_per_t_dry", "ef_co2_t_per_gj", "factor_source",
                                            "leakage_ruled_out", "ruled_out_reason", "evidence_ids")}
              if void else _residue_fields(db, user, body))
    r = ResidueDiversion(org_id=user.org_id, created_by=user.id, record_id=cur.record_id, version=cur.version + 1,
                         status="voided" if void else "active", project_id=cur.project_id,
                         period_label=cur.period_label, note=body.get("reason") or "", **fields)
    db.add(r)
    audit(db, user, "leakage_residue.void" if void else "leakage_residue.correct", r, before=snapshot(cur),
          reason=body.get("reason"))
    return r


def list_residues(db: Session, user: CurrentUser, project_id: str, period_label: str | None = None,
                  include_voided: bool = False) -> list[ResidueDiversion]:
    project = calc.get_project(db, user, project_id)
    q = scoped(ResidueDiversion, user).where(ResidueDiversion.project_id == project.id)
    if period_label:
        q = q.where(ResidueDiversion.period_label == period_label)
    rows = _latest(list(db.scalars(q).all()))
    if not include_voided:
        rows = [r for r in rows if r.status == "active"]
    return sorted(rows, key=lambda r: (r.period_label, r.residue_type, str(r.record_id)))


def compute_residues(db: Session, user: CurrentUser, project_id: str, period_label: str) -> dict[str, Any]:
    project = calc.get_project(db, user, project_id)
    rows = list_residues(db, user, project_id, period_label)
    if not rows:
        raise RuleMissing(f"No biomass-residue diversion records exist for period {period_label}. Record each residue "
                          "previously used for energy (or rule its leakage out with evidence).",
                          details={"rule_key": "residue_records", "period_label": period_label})
    res = domain.tool16_le_br([domain.Residue(str(r.record_id), r.residue_type, r.quantity_t_dry, r.ncv_gj_per_t_dry,
                                              r.ef_co2_t_per_gj, r.leakage_ruled_out) for r in rows])
    return {"term": "leakage_biomass_residues", "project_id": str(project.id), "period_label": period_label,
            **res, "value_t_co2e": res["le_br_t_co2e"], "variance": 0.0, "df": None, "data_class": "CALCULATED",
            "records": [residue_out(r) for r in rows],
            "sign_convention": "positive = leakage emission, subtracted after Eq. 39/42 allocation",
            "method_notes": ["VM0042 v2.2 §8.4.4 (p.53) requires CDM TOOL16 'Leakage due to diversion of biomass "
                             "residues from other applications'.",
                             "TOOL16 structure: LE_BR = Σ_k BR_LE,k × NCV_k × EF_CO2,LE; categories whose leakage is "
                             "ruled out with evidence contribute zero."]}


def publish_residues(db: Session, user: CurrentUser, project_id: str, period_label: str) -> dict[str, Any]:
    res = compute_residues(db, user, project_id, period_label)
    project = calc.get_project(db, user, project_id)
    n_out = sum(1 for i in res["items"] if i["leakage_ruled_out"])
    summary = (f"VM0042 v2.2 §8.4.4 (p.53) LE_BR via CDM TOOL16 (Σ BR × NCV × EF_CO2,LE); {len(res['items'])} residue "
               f"record(s), {n_out} ruled out with evidence; records "
               f"{', '.join(i['record_id'] for i in res['items'])}; LE_BR {res['le_br_t_co2e']:.6f} t CO2e.")
    inputs = {"period_label": period_label, "records": res["records"]}
    results = {k: res[k] for k in ("items", "le_br_t_co2e", "value_t_co2e", "variance", "df", "method_notes")}
    t, comp = shared.publish_term(db, user, project, term="leakage_biomass_residues", period_label=period_label,
                                  value=res["value_t_co2e"], variance=0.0, df=None, method="LE_BR / CDM TOOL16",
                                  summary=summary, inputs=inputs, results=results,
                                  rule_pack_id=str(project.rule_pack_id) if project.rule_pack_id else None)
    return {"term": calc.term_out(t).model_dump(), "computation": shared.computation_out(comp), "result": res}


# ================================================================ displacement (VMD0054, Eq. 34–36)
def displacement_out(r: DisplacementRecord) -> dict[str, Any]:
    return {"id": str(r.id), "record_id": str(r.record_id), "version": r.version, "status": r.status,
            "project_id": str(r.project_id), "year": r.year, "mode": r.mode, "commodities": list(r.commodities or []),
            "livestock": list(r.livestock or []), "ef_t_co2e_per_ha": r.ef_t_co2e_per_ha, "ef_source": r.ef_source,
            "statement": r.statement, "evidence_ids": list(r.evidence_ids or []), "note": r.note,
            "created_by": str(r.created_by) if r.created_by else None, "created_at": r.created_at,
            "data_class": "RECORDED"}


def _to_domain(year: int, mode: str, commodities: list[dict], livestock: list[dict], ef: float | None,
               record_id: str = "") -> domain.DisplacementYear:
    return domain.DisplacementYear(
        year=year, mode=mode,
        commodities=tuple(domain.Commodity(c["commodity"], c["unit"], c["baseline_production"],
                                           c["project_production"], c.get("lm"), c.get("inl_ha"))
                          for c in commodities),
        livestock=tuple(domain.Livestock(lv["livestock_type"], lv["baseline_head"], lv["project_head"])
                        for lv in livestock),
        ef_t_co2e_per_ha=ef, record_id=record_id)


def _displacement_fields(db: Session, user: CurrentUser, body: dict[str, Any], year: int) -> dict[str, Any]:
    commodities = [dict(c) for c in body.get("commodities") or []]
    livestock = [dict(lv) for lv in body.get("livestock") or []]
    y = _to_domain(year, body["mode"], commodities, livestock, body.get("ef_t_co2e_per_ha"))
    if y.mode == "no_decrease":
        domain.check_no_decrease(y.commodities)
    else:
        domain.check_vmd0054(y)
    return {"mode": body["mode"], "commodities": commodities, "livestock": livestock,
            "ef_t_co2e_per_ha": body.get("ef_t_co2e_per_ha") if body["mode"] == "vmd0054" else None,
            "ef_source": (body.get("ef_source") or "").strip(), "statement": body["statement"].strip(),
            "evidence_ids": shared.evidence_ids(db, user, body["evidence_ids"], required=True,
                                                what="the livestock / production record")}


def _active_displacement(db: Session, org_id: uuid.UUID, project_id: uuid.UUID) -> list[DisplacementRecord]:
    rows = db.scalars(select(DisplacementRecord).where(DisplacementRecord.org_id == org_id,
                                                       DisplacementRecord.project_id == project_id)).all()
    return [r for r in _latest(list(rows)) if r.status == "active"]


def create_displacement(db: Session, user: CurrentUser, project_id: str, body: dict[str, Any]) -> DisplacementRecord:
    project = calc.get_project(db, user, project_id)
    if any(r.year == body["year"] for r in _active_displacement(db, user.org_id, project.id)):
        raise Conflict(f"A livestock / production record for {body['year']} already exists. Correct it with a new "
                       "version instead.", code="DUPLICATE_YEAR")
    r = DisplacementRecord(org_id=user.org_id, created_by=user.id, record_id=uuid.uuid4(), version=1, status="active",
                           project_id=project.id, year=body["year"], note=body.get("note") or "",
                           **_displacement_fields(db, user, body, body["year"]))
    db.add(r)
    audit(db, user, "leakage_displacement.create", r)
    return r


def displacement_version(db: Session, user: CurrentUser, record_id: str, body: dict[str, Any], *,
                         void: bool = False) -> DisplacementRecord:
    cur = _latest_record(db, user, DisplacementRecord, record_id, "Livestock / production record")
    if cur.status != "active":
        raise IllegalTransition("This record has been voided.")
    fields = ({k: getattr(cur, k) for k in ("mode", "commodities", "livestock", "ef_t_co2e_per_ha", "ef_source",
                                            "statement", "evidence_ids")}
              if void else _displacement_fields(db, user, body, cur.year))
    r = DisplacementRecord(org_id=user.org_id, created_by=user.id, record_id=cur.record_id, version=cur.version + 1,
                           status="voided" if void else "active", project_id=cur.project_id, year=cur.year,
                           note=body.get("reason") or "", **fields)
    db.add(r)
    audit(db, user, "leakage_displacement.void" if void else "leakage_displacement.correct", r,
          before=snapshot(cur), reason=body.get("reason"))
    return r


def list_displacement(db: Session, user: CurrentUser, project_id: str,
                      include_voided: bool = False) -> list[DisplacementRecord]:
    project = calc.get_project(db, user, project_id)
    rows = _latest(list(db.scalars(scoped(DisplacementRecord, user).where(
        DisplacementRecord.project_id == project.id)).all()))
    if not include_voided:
        rows = [r for r in rows if r.status == "active"]
    return sorted(rows, key=lambda r: (r.year, str(r.record_id)))


def compute_displacement(db: Session, user: CurrentUser, project_id: str, body: dict[str, Any]) -> dict[str, Any]:
    project = calc.get_project(db, user, project_id)
    start = project_start(project)
    if start is None:
        raise RuleMissing("Set the project's crediting start (or baseline start) date first: LK_prior in Eq. 36 counts "
                          "from the project start.", details={"rule_key": "project_start"})
    ps, pe = body["period_start"], body["period_end"]
    years = shared.period_years(ps, pe)
    rows = _active_displacement(db, user.org_id, project.id)
    records = {r.year: _to_domain(r.year, r.mode, r.commodities or [], r.livestock or [], r.ef_t_co2e_per_ha,
                                  str(r.record_id)) for r in rows}
    res = domain.lk_disp_period(records, start.year, ps.year, pe.year, years)
    used = [displacement_out(r) for r in sorted(rows, key=lambda r: r.year) if start.year <= r.year <= pe.year]
    return {"term": "leakage_displacement", "project_id": str(project.id), "period_label": body["period_label"],
            "period_start": ps, "period_end": pe, "project_start": start, **res, "variance": 0.0, "df": None,
            "data_class": "CALCULATED", "records": used,
            "sign_convention": "positive = leakage emission, subtracted after Eq. 39/42 allocation",
            "method_notes": [
                "Eq. 34 l_j,t = FP_j,t − LM_j,t; Eq. 35 AL_t = MAX(Σ_j INL_j,t, 0); "
                "Eq. 36 LK_disp,t = MAX(0, LK_t − LK_prior) / years (VM0042 v2.2 §8.4.3 p.53).",
                "FP = baseline − project production (VM0042 reads 'production change' for VMD0054's foregone "
                "production).",
                "INL_j,t and the per-hectare emission factor are entered from the VMD0054 worksheet; LK_t = "
                "Σ_{y ≤ t} AL_y × EF_y is the platform's composition of VMD0054 Eq. 8–10.",
                "§8.4.2(b): a year shown with no production decrease (with evidence) contributes 0.",
                "Period value = LK_disp,t × years = MAX(0, LK_t − LK_prior).",
            ]}


def publish_displacement(db: Session, user: CurrentUser, project_id: str, body: dict[str, Any]) -> dict[str, Any]:
    res = compute_displacement(db, user, project_id, body)
    project = calc.get_project(db, user, project_id)
    if res["warnings"] and any("INL has the opposite sign" in w for w in res["warnings"]):
        raise Blocked("Some commodities have a VMD0054 land area (INL) of the opposite sign to their production "
                      "change (Eq. 34). Check the worksheet before publishing.", code="INL_SIGN_MISMATCH",
                      details={"warnings": res["warnings"]})
    summary = (f"VM0042 v2.2 §8.4.2–8.4.3 (p.52–53) Eq. 34–36 with VMD0054 inputs; years "
               f"{res['years'][0]['year'] if res['years'] else '—'}–{body['period_end'].year}; LK_t "
               f"{res['lk_t_t_co2e']:.6f}, LK_prior {res['lk_prior_t_co2e']:.6f} t CO2e, years "
               f"{res['verification_years']:.4f}; LK_disp,t {res['lk_disp_annual_t_co2e']:.6f} t CO2e/yr; records "
               f"{', '.join(r['record_id'] for r in res['records'])}"
               + ("; §8.4.2(b) no production decrease shown for every period year." if res["all_no_decrease"] else "."))
    inputs = {"period_label": body["period_label"], "period_start": body["period_start"],
              "period_end": body["period_end"], "project_start": res["project_start"], "records": res["records"]}
    results = {k: res[k] for k in ("years", "lk_t_t_co2e", "lk_prior_t_co2e", "verification_years",
                                   "lk_disp_annual_t_co2e", "value_t_co2e", "warnings", "all_no_decrease",
                                   "method_notes")}
    t, comp = shared.publish_term(db, user, project, term="leakage_displacement", period_label=body["period_label"],
                                  value=res["value_t_co2e"], variance=0.0, df=None,
                                  method="LK_disp / VMD0054 Eq. 34–36", summary=summary, inputs=inputs,
                                  results=results,
                                  rule_pack_id=str(project.rule_pack_id) if project.rule_pack_id else None)
    return {"term": calc.term_out(t).model_dump(), "computation": shared.computation_out(comp), "result": res}
