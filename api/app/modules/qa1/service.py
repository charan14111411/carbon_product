"""VM0042 v2.2 Quantification Approach 1 workflow: model registry (§4 cond. 4), model-run imports (Eq. 4–5,
10, 15; Tables 6 and 8), QA1 quantification with the §8.6.1 uncertainty (Eq. 60–69), publication of draft
``TermEstimate`` rows for the calculation engine, and SOC true-up (§8.6.1.3).

Where VM0042 delegates to VCS Module VMD0053 (calibration, validation datasets, bias tests, the independent
modelling expert), this module records the evidence VM0042 asks for — the model validation report, the IME
assessment, the validation domain and the per-practice-category prediction error and bias — and does not
invent VMD0053 thresholds.
"""

from __future__ import annotations

import csv
import hashlib
import io
import json
import math
import uuid
from collections import defaultdict
from datetime import UTC, date, datetime, timedelta
from typing import Any

import numpy as np
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser, ensure_not_author
from app.core.db import utcnow
from app.core.errors import Blocked, Conflict, IllegalTransition, NotFound, RuleMissing, ValidationFailed
from app.core.events import emit
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.baseline.service import active_records
from app.modules.calculation import engine
from app.modules.calculation import service as calc_service
from app.modules.calculation.schemas import TermIn
from app.modules.evidence import service as evidence
from app.modules.evidence.models import EvidenceFile
from app.modules.lab.models import SPECTRO_METHODS, LabResult
from app.modules.land.models import Field
from app.modules.land.service import project_start
from app.modules.methodology import ruleset as rs
from app.modules.programmes.models import Project
from app.modules.qa1 import domain
from app.modules.qa1.models import Qa1Analysis, Qa1Model, Qa1Publication, Qa1RunImport, Qa1RunRow, Qa1TrueUp
from app.modules.qa1.schemas import AnalysisIn, ModelIn, ModelPatch, RunImportIn, TrueUpIn
from app.modules.sampling.models import Campaign, Sample, Site, SoilLayer, Stratum

REF_COND4 = "VM0042 v2.2 §4 cond. 4 p.10–11"
REF_TRUEUP = "VM0042 v2.2 §8.2.1 p.27; §8.6.1.3 p.74–75"
FLUX_COLUMNS = {"ch4_soil": "ch4_t_ch4_ha", "n2o_soil": "n2o_t_n2o_ha"}
POOL_COLUMN = {"soc": "soc_t_c_ha", **FLUX_COLUMNS}
POOL_RULE = {"soc": "qa_soc", "ch4_soil": "qa_ch4_soil", "n2o_soil": "qa_n2o_soil"}
_PRIMARY = or_(LabResult.purpose == "primary", LabResult.purpose.is_(None))
_TOL = 1e-6


# ================================================================ helpers
def _canonical(obj: Any) -> str:
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), default=str)


def sha256_of(obj: Any) -> str:
    return hashlib.sha256(_canonical(obj).encode("utf-8")).hexdigest()


def parameter_fingerprint(parameter_set: dict[str, Any]) -> str:
    """SHA-256 of the canonical JSON parameter set (§4 cond. 4c: fully reported parameter values)."""
    return sha256_of(parameter_set or {})


def _uuid(value: str | uuid.UUID | None, what: str) -> uuid.UUID:
    if isinstance(value, uuid.UUID):
        return value
    try:
        return uuid.UUID(str(value))
    except (ValueError, TypeError) as exc:
        raise NotFound(f"{what} not found.") from exc


def _aware(dt: datetime | None) -> datetime | None:
    if dt is None:
        return None
    return dt if dt.tzinfo else dt.replace(tzinfo=UTC)


def _evidence(db: Session, user: CurrentUser, value: str | None, what: str) -> uuid.UUID | None:
    if not value:
        return None
    ev = db.get(EvidenceFile, _uuid(value, what))
    if ev is None or ev.org_id != user.org_id:
        raise ValidationFailed(f"The {what} file could not be found. Upload it again.", code="EVIDENCE_NOT_FOUND",
                               details={"field": what})
    return ev.id


def _project(db: Session, user: CurrentUser, project_id: str) -> Project:
    return get_owned(db, Project, project_id, user, "Project")


def _years_after(d: date, years: float) -> date:
    return d + timedelta(days=round(years * 365.25))


def _t0_year(project: Project) -> int:
    start = project_start(project)
    if start is None:
        raise RuleMissing("Set the project's start date first: QA1 model runs start from the SOC stock at t = 0.",
                          code="PROJECT_START_MISSING", details={"project_id": str(project.id)})
    return start.year - 1


# ================================================================ models (§4 cond. 4)
def model_out(m: Qa1Model) -> dict[str, Any]:
    d = snapshot(m)
    d["approval_problems"] = model_problems(m) if m.status == "draft" else []
    d["data_class"] = "MODELLED"
    return d


def _metric_dicts(metrics: list) -> list[dict[str, Any]]:
    return [x.model_dump() for x in metrics]


def _check_trueups(db: Session, user: CurrentUser, ids: list[str]) -> list[str]:
    out = []
    for raw in ids:
        t = db.get(Qa1TrueUp, _uuid(raw, "True-up"))
        if t is None or t.org_id != user.org_id:
            raise ValidationFailed("A listed true-up could not be found.", code="TRUEUP_NOT_FOUND",
                                   details={"trueup_id": raw})
        out.append(str(t.id))
    return out


def create_model(db: Session, user: CurrentUser, body: ModelIn) -> Qa1Model:
    current = db.scalar(select(func.max(Qa1Model.revision)).where(
        Qa1Model.org_id == user.org_id, Qa1Model.name == body.name.strip(), Qa1Model.version == body.version.strip()))
    supersedes = None
    if body.supersedes_id:
        supersedes = get_owned(db, Qa1Model, body.supersedes_id, user, "Model")
    m = Qa1Model(
        org_id=user.org_id, created_by=user.id, name=body.name.strip(), version=body.version.strip(),
        revision=(current or 0) + 1, public_source=body.public_source.strip(),
        source_accessed_on=body.source_accessed_on, publicly_available=body.publicly_available,
        documentation_ref=body.documentation_ref.strip(), peer_review_refs=body.peer_review_refs,
        parameter_set=body.parameter_set, parameter_sources=body.parameter_sources.strip(),
        parameter_fingerprint=parameter_fingerprint(body.parameter_set),
        validation_report_evidence_id=_evidence(db, user, body.validation_report_evidence_id,
                                                "model validation report"),
        ime_report_evidence_id=_evidence(db, user, body.ime_report_evidence_id, "IME assessment report"),
        validation_domain=body.validation_domain.model_dump(), pools=sorted(set(body.pools)),
        validation_metrics=_metric_dicts(body.validation_metrics), trueup_ids=_check_trueups(db, user, body.trueup_ids),
        notes=body.notes, status="draft", editors=[str(user.id)], supersedes_id=supersedes.id if supersedes else None,
    )
    db.add(m)
    audit(db, user, "qa1_model.create", m)
    return m


def update_model(db: Session, user: CurrentUser, model_id: str, body: ModelPatch) -> Qa1Model:
    m = get_owned(db, Qa1Model, model_id, user, "Model")
    if m.status != "draft":
        raise IllegalTransition("An approved or retired model can't be changed. Create a new revision instead.",
                                code="MODEL_LOCKED")
    before = snapshot(m)
    data = body.model_dump(exclude_unset=True)
    for key in ("public_source", "source_accessed_on", "publicly_available", "documentation_ref", "parameter_set",
                "parameter_sources", "notes"):
        if key in data and data[key] is not None:
            setattr(m, key, data[key].strip() if isinstance(data[key], str) else data[key])
    if body.peer_review_refs is not None:
        m.peer_review_refs = body.peer_review_refs
    if "validation_report_evidence_id" in data:
        m.validation_report_evidence_id = _evidence(db, user, body.validation_report_evidence_id,
                                                    "model validation report")
    if "ime_report_evidence_id" in data:
        m.ime_report_evidence_id = _evidence(db, user, body.ime_report_evidence_id, "IME assessment report")
    if body.validation_domain is not None:
        m.validation_domain = body.validation_domain.model_dump()
    if body.pools is not None:
        m.pools = sorted(set(body.pools))
    if body.validation_metrics is not None:
        m.validation_metrics = _metric_dicts(body.validation_metrics)
    if body.trueup_ids is not None:
        m.trueup_ids = _check_trueups(db, user, body.trueup_ids)
    m.parameter_fingerprint = parameter_fingerprint(m.parameter_set)
    if str(user.id) not in (m.editors or []):
        m.editors = [*(m.editors or []), str(user.id)]
    audit(db, user, "qa1_model.update", m, before=before)
    return m


def model_problems(m: Qa1Model) -> list[str]:
    """What stops approval, in plain words (VM0042 §4 cond. 4 a–e, p.10–11)."""
    p: list[str] = []
    if not m.publicly_available or len((m.public_source or "").strip()) < 5:
        p.append("4a: the model must be publicly available; give the hyperlink (with access date) or citation.")
    if not m.peer_review_refs:
        p.append("4b: cite at least one peer-reviewed study showing the model simulates the SOC and trace-gas "
                 "changes from these practices.")
    if not (m.version or "").strip():
        p.append("4c: the model needs a clear version.")
    if not m.parameter_set:
        p.append("4c: report every parameter value used with this model version.")
    if len((m.parameter_sources or "").strip()) < 5:
        p.append("4c: give the sources of the parameter values and the datasets/statistics used to set them.")
    if m.validation_report_evidence_id is None:
        p.append("4d: attach the model validation report (VMD0053 §5.2).")
    if m.ime_report_evidence_id is None:
        p.append("4d: attach the independent modelling expert (IME) assessment of the validation report.")
    dom = m.validation_domain or {}
    for key, label in (("crop_functional_groups", "crop functional groups"),
                       ("practice_categories", "practice categories"), ("climate_zones", "climate zones"),
                       ("soil_textures", "soil textures")):
        if not dom.get(key):
            p.append(f"Validation domain: list the {label} the model was validated for.")
    if not m.pools:
        p.append("Say which pools/fluxes the model is used for (SOC, soil CH4, soil N2O).")
    metrics = m.validation_metrics or []
    for pool in m.pools or []:
        for cat in dom.get("practice_categories") or []:
            if not any(x["pool"] == pool and x["practice_category"] == cat for x in metrics):
                p.append(f"4d: no model prediction error is given for {pool} under {cat.replace('_', ' ')}.")
    for x in metrics:
        if x["pool"] not in (m.pools or []):
            p.append(f"A validation metric is given for {x['pool']}, which is not one of the model's pools.")
        if x["practice_category"] not in (dom.get("practice_categories") or []):
            p.append(f"A validation metric is given for {x['practice_category'].replace('_', ' ')}, which is not in "
                     "the validation domain.")
        if not x.get("bias_test_passed"):
            p.append(f"{x['pool']} / {x['practice_category'].replace('_', ' ')}: the validation report must show the "
                     "model is unbiased (VM0042 §8.6.1.1.1 assumes an unbiased model).")
    return p


def approve_model(db: Session, user: CurrentUser, model_id: str) -> Qa1Model:
    m = get_owned(db, Qa1Model, model_id, user, "Model")
    if m.status != "draft":
        raise IllegalTransition(f"Only a draft model can be approved; this one is {m.status}.")
    ensure_not_author(user.id, m.created_by, *[_uuid(e, "User") for e in (m.editors or [])], what="a model")
    problems = model_problems(m)
    if problems:
        raise ValidationFailed("The model doesn't meet the VM0042 model requirements yet.", code="MODEL_NOT_VALID",
                               details={"problems": problems, "reference": REF_COND4})
    for tid in m.trueup_ids or []:
        t = db.get(Qa1TrueUp, _uuid(tid, "True-up"))
        if t is None or t.org_id != m.org_id or t.status != "approved":
            raise Blocked("A true-up this validation report incorporates is not approved yet.",
                          code="TRUEUP_NOT_APPROVED", details={"trueup_id": tid})
    before = {"status": m.status}
    m.status = "approved"
    m.approved_by = user.id
    m.approved_at = utcnow()
    audit(db, user, "qa1_model.approve", m, before=before)
    emit(db, user, "qa1.model.approved", m, {"name": m.name, "version": m.version, "revision": m.revision})
    return m


def retire_model(db: Session, user: CurrentUser, model_id: str, reason: str) -> Qa1Model:
    m = get_owned(db, Qa1Model, model_id, user, "Model")
    if m.status != "approved":
        raise IllegalTransition(f"Only an approved model can be retired; this one is {m.status}.")
    before = {"status": m.status}
    m.status = "retired"
    audit(db, user, "qa1_model.retire", m, before=before, reason=reason)
    return m


def list_models(db: Session, user: CurrentUser, status: str | None = None) -> list[Qa1Model]:
    q = scoped(Qa1Model, user)
    if status:
        q = q.where(Qa1Model.status == status)
    return list(db.scalars(q.order_by(Qa1Model.name, Qa1Model.version, Qa1Model.revision)).all())


def _usable_model(db: Session, user: CurrentUser, model_id: str | uuid.UUID) -> Qa1Model:
    m = get_owned(db, Qa1Model, model_id, user, "Model")
    if m.status != "approved":
        raise Blocked(f"Model {m.name} v{m.version} is {m.status}; only an approved model can be used (VM0042 §4 "
                      "cond. 4).", code="MODEL_NOT_APPROVED", details={"model_id": str(m.id), "status": m.status})
    if m.parameter_fingerprint != parameter_fingerprint(m.parameter_set):
        raise Blocked("The model's parameter set no longer matches its approved fingerprint.",
                      code="MODEL_PARAMETERS_CHANGED", details={"model_id": str(m.id)})
    return m


# ================================================================ lab values (Eq. 4, true-up)
def _latest_results(db: Session, org_id: uuid.UUID, layer_ids: list[uuid.UUID]) -> dict[tuple[uuid.UUID, str],
                                                                                      LabResult]:
    if not layer_ids:
        return {}
    rows = db.scalars(select(LabResult).where(LabResult.org_id == org_id, LabResult.layer_id.in_(layer_ids),
                                              LabResult.status == "accepted", _PRIMARY)).all()
    latest: dict[tuple[uuid.UUID, str], LabResult] = {}
    for r in rows:
        k = (r.layer_id, r.analyte)
        cur = latest.get(k)
        if cur is None or (r.version, _aware(r.created_at)) > (cur.version, _aware(cur.created_at)):
            latest[k] = r
    return latest


def _campaign_samples(db: Session, org_id: uuid.UUID, campaign_id: uuid.UUID) -> tuple[list[Sample],
                                                                                       dict[uuid.UUID, list[SoilLayer]],
                                                                                       dict]:
    samples = list(db.scalars(select(Sample).where(Sample.org_id == org_id, Sample.campaign_id == campaign_id)
                              .order_by(Sample.code)).all())
    ids = [s.id for s in samples]
    layers = list(db.scalars(select(SoilLayer).where(SoilLayer.sample_id.in_(ids))).all()) if ids else []
    by_sample: dict[uuid.UUID, list[SoilLayer]] = defaultdict(list)
    for lyr in layers:
        by_sample[lyr.sample_id].append(lyr)
    return samples, by_sample, _latest_results(db, org_id, [lyr.id for lyr in layers])


def _eq4_for_sample(smp: Sample, layers: list[SoilLayer], latest: dict, depth: float,
                    coarse: bool) -> tuple[float | None, list[str], list[dict[str, Any]], bool]:
    """Eq. 4 summed over the layers down to the reporting depth. Returns (t C/ha, missing, per-layer, spectro)."""
    total, missing, detail, spectro = 0.0, [], [], False
    covered = 0.0
    for lyr in sorted(layers, key=lambda x: x.depth_from_cm):
        if lyr.depth_from_cm >= depth - _TOL:
            break
        d = min(lyr.depth_to_cm, depth) - lyr.depth_from_cm
        soc = latest.get((lyr.id, "soc_pct"))
        bd = latest.get((lyr.id, "bulk_density_g_cm3"))
        cf = latest.get((lyr.id, "coarse_fraction"))
        fsm = latest.get((lyr.id, "fine_soil_mass_g"))
        if soc is None:
            missing.append(f"{lyr.code}: soc_pct")
            continue
        spectro = spectro or soc.method in SPECTRO_METHODS
        thickness = lyr.depth_to_cm - lyr.depth_from_cm
        if bd is not None:
            if coarse and cf is None:
                missing.append(f"{lyr.code}: coarse_fraction")
                continue
            bd_corr = domain.bd_corrected(bd.value, cf.value if (coarse and cf is not None) else None)
            how = "bulk_density"
        elif fsm is not None and smp.probe_diameter_mm and smp.cores_composited:
            # Eq. 3 fine-soil mass (t/ha) over the increment = 100 × BD_corr × thickness ⇒ BD_corr
            bd_corr = engine.eq3_fine_soil_mass_t_ha(fsm.value, smp.probe_diameter_mm, smp.cores_composited) / (
                100.0 * thickness)
            how = "eq3_fine_soil_mass"
        else:
            missing.append(f"{lyr.code}: bulk_density_g_cm3")
            continue
        stock = domain.eq4_soc_model_t_ha(bd_corr, d, soc.value / 100.0)
        total += stock
        covered = max(covered, lyr.depth_from_cm + d)
        detail.append({"layer": lyr.code, "depth_cm": d, "bd_corr_g_cm3": bd_corr, "oc_fraction": soc.value / 100.0,
                       "soc_t_c_ha": stock, "bd_from": how, "soc_result_id": str(soc.id),
                       "soc_method": soc.method})
    if not missing and covered + _TOL < depth and not (smp.deviation_reason or "").strip():
        missing.append(f"{smp.code}: layers reach {covered:g} cm, the model input needs {depth:g} cm")
    return (None if missing else total), missing, detail, spectro


# ================================================================ run imports
REQUIRED_COLUMNS = ("site_code", "scenario", "year", "practice_category", "crop_functional_group")
OPTIONAL_COLUMNS = ("draw", "soc_t_c_ha", "ch4_t_ch4_ha", "n2o_t_n2o_ha")


def _parse(body: RunImportIn) -> tuple[list[dict[str, Any]], bytes]:
    if body.format == "csv":
        text = (body.csv or "").lstrip("﻿")
        reader = csv.DictReader(io.StringIO(text))
        headers = [h.strip() for h in (reader.fieldnames or [])]
        missing = [c for c in REQUIRED_COLUMNS if c not in headers]
        if missing:
            raise ValidationFailed(f"The CSV is missing the column(s): {', '.join(missing)}.", code="INVALID_IMPORT",
                                   details={"missing_columns": missing, "required": list(REQUIRED_COLUMNS),
                                            "optional": list(OPTIONAL_COLUMNS)})
        rows = [{(k or "").strip(): (v.strip() if isinstance(v, str) else v) for k, v in r.items()} for r in reader]
        return rows, text.encode("utf-8")
    rows = [dict(r) for r in (body.rows or [])]
    return rows, _canonical(rows).encode("utf-8")


def _num(v: Any) -> float | None:
    if v is None or (isinstance(v, str) and not v.strip()):
        return None
    if isinstance(v, bool):
        raise ValueError("not a number")
    x = float(v)
    if not math.isfinite(x):
        raise ValueError("not finite")
    return x


def _clean_rows(raw: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], list[str]]:
    rows, errors = [], []
    for i, r in enumerate(raw, start=2 if raw else 1):  # CSV row 1 is the header
        try:
            site = str(r.get("site_code") or "").strip()
            scenario = str(r.get("scenario") or "").strip().lower()
            year = int(float(str(r.get("year")).strip()))
            draw_raw = r.get("draw")
            draw = 0 if draw_raw in (None, "") else int(float(str(draw_raw)))
            vals = {c: _num(r.get(c)) for c in ("soc_t_c_ha", "ch4_t_ch4_ha", "n2o_t_n2o_ha")}
        except (ValueError, TypeError):
            errors.append(f"Row {i}: year, draw and the modelled values must be numbers.")
            continue
        if not site:
            errors.append(f"Row {i}: site_code is empty.")
        if scenario not in ("baseline", "project"):
            errors.append(f"Row {i}: scenario must be baseline or project.")
        if not 1900 <= year <= 2200:
            errors.append(f"Row {i}: year {year} is not a calendar year.")
        if draw < 0:
            errors.append(f"Row {i}: draw must be blank (central run) or 1, 2, 3 …")
        if vals["soc_t_c_ha"] is not None and vals["soc_t_c_ha"] < 0:
            errors.append(f"Row {i}: a SOC stock can't be negative.")
        rows.append({"row": i, "site_code": site, "scenario": scenario, "year": year, "draw": draw, **vals,
                     "practice_category": str(r.get("practice_category") or "").strip(),
                     "crop_functional_group": str(r.get("crop_functional_group") or "").strip()})
        if len(errors) >= 50:
            break
    return rows, errors


def _validate_structure(rows: list[dict[str, Any]], model: Qa1Model, t0_year: int) -> tuple[list[str], list[str], int]:
    """Row-level VM0042 checks. Returns (pools present, errors, L)."""
    errors: list[str] = []
    dom = model.validation_domain or {}
    cats, cfgs = set(dom.get("practice_categories") or []), {x.lower() for x in dom.get("crop_functional_groups") or []}
    seen: set[tuple] = set()
    for r in rows:
        key = (r["site_code"], r["scenario"], r["year"], r["draw"])
        if key in seen:
            errors.append(f"Row {r['row']}: duplicate site/scenario/year/draw.")
        seen.add(key)
        if r["practice_category"] not in domain.PRACTICE_CATEGORIES:
            errors.append(f"Row {r['row']}: practice_category must be one of {', '.join(domain.PRACTICE_CATEGORIES)}.")
        elif r["practice_category"] not in cats:
            errors.append(f"Row {r['row']}: the model is not validated for "
                          f"{r['practice_category'].replace('_', ' ')} (validation domain).")
        if r["crop_functional_group"].lower() not in cfgs:
            errors.append(f"Row {r['row']}: crop functional group “{r['crop_functional_group']}” is outside the "
                          "model's validation domain.")
        if len(errors) >= 50:
            return [], errors, 0
    # pools: a column is either filled for every row that needs it, or absent
    pools = []
    for pool, col in POOL_COLUMN.items():
        needs = [r for r in rows if pool == "soc" or r["year"] > t0_year]
        filled = [r for r in needs if r[col] is not None]
        if filled and len(filled) != len(needs):
            errors.append(f"Column {col} is filled for some rows but not all of them.")
        elif filled:
            pools.append(pool)
    if not pools:
        errors.append("No modelled values were found (soc_t_c_ha, ch4_t_ch4_ha or n2o_t_n2o_ha).")
    missing_pools = sorted(set(pools) - set(model.pools or []))
    if missing_pools:
        errors.append(f"The model is not validated for {', '.join(missing_pools)}.")
    # per site: one practice category / crop group, both scenarios, same contiguous years, t0 row
    by_site: dict[str, list[dict]] = defaultdict(list)
    for r in rows:
        by_site[r["site_code"]].append(r)
    draws_all: set[int] = set()
    for site, rs_ in by_site.items():
        if len({r["practice_category"] for r in rs_}) > 1 or len({r["crop_functional_group"] for r in rs_}) > 1:
            errors.append(f"Site {site}: one practice category and crop functional group per point.")
        years = {(r["scenario"], r["draw"]): set() for r in rs_}
        for r in rs_:
            years[(r["scenario"], r["draw"])].add(r["year"])
        draws = {d for _, d in years}
        draws_all |= {d for d in draws if d > 0}
        if 0 not in draws:
            errors.append(f"Site {site}: the central model run (blank draw) is missing.")
        ref = years.get(("baseline", 0)) or set()
        for sc in ("baseline", "project"):
            for d in draws:
                ys = years.get((sc, d))
                if ys is None:
                    errors.append(f"Site {site}: the {sc} scenario is missing{f' for draw {d}' if d else ''} — baseline "
                                  "and project must be modelled with the same model and parameters (§4 cond. 4e).")
                    continue
                if ys != ref:
                    errors.append(f"Site {site}: baseline and project runs must cover the same years.")
        if ref:
            if min(ref) != t0_year:
                errors.append(f"Site {site}: the run must start at t0 (the end of {t0_year}, the year before the "
                              "project start).")
            if set(range(min(ref), max(ref) + 1)) != ref:
                errors.append(f"Site {site}: the run has missing years.")
        if "soc" in pools:
            t0 = {(r["scenario"], r["draw"]): r["soc_t_c_ha"] for r in rs_ if r["year"] == t0_year}
            for d in draws:
                b, p = t0.get(("baseline", d)), t0.get(("project", d))
                if b is not None and p is not None and abs(b - p) > _TOL * max(1.0, abs(b)):
                    errors.append(f"Site {site}: the t0 SOC stock differs between baseline ({b:g}) and project ({p:g}); "
                                  "VM0042 requires SOC_wp,i,0 = SOC_bsl,i,0 (§8.2.1 p.27).")
        if len(errors) >= 50:
            break
    big_l = 0
    if draws_all:
        big_l = max(draws_all)
        if draws_all != set(range(1, big_l + 1)):
            errors.append("Monte Carlo draws must be numbered 1, 2, … L without gaps.")
        for site, rs_ in by_site.items():
            got = {r["draw"] for r in rs_ if r["draw"] > 0}
            if got != draws_all:
                errors.append(f"Site {site}: every point needs the same {big_l} Monte Carlo draws.")
                break
    return pools, errors[:50], big_l


def create_import(db: Session, user: CurrentUser, project_id: str, body: RunImportIn) -> Qa1RunImport:
    project = _project(db, user, project_id)
    model = _usable_model(db, user, body.model_id)
    rules = rs.for_project(db, project, require_approved=True)
    t0_year = _t0_year(project)
    raw, raw_bytes = _parse(body)
    digest = hashlib.sha256(raw_bytes).hexdigest()
    dup = db.scalar(select(Qa1RunImport).where(Qa1RunImport.org_id == user.org_id,
                                               Qa1RunImport.project_id == project.id, Qa1RunImport.sha256 == digest))
    if dup is not None:
        raise Conflict("This exact model output was already imported.", code="DUPLICATE_IMPORT",
                       details={"import_id": str(dup.id)})
    if not raw:
        raise ValidationFailed("The import has no rows.", code="INVALID_IMPORT")
    rows, errors = _clean_rows(raw)
    if not errors:
        pools, errors, big_l = _validate_structure(rows, model, t0_year)
    if errors:
        raise ValidationFailed(f"The model output has {len(errors)} problem(s); nothing was imported.",
                               code="INVALID_IMPORT", details={"errors": errors})

    supersedes = None
    if body.supersedes_id:
        supersedes = get_owned(db, Qa1RunImport, body.supersedes_id, user, "Model run import")
        if supersedes.project_id != project.id:
            raise ValidationFailed("An import can only replace an import of the same project.",
                                   code="SUPERSEDE_MISMATCH")

    codes = sorted({r["site_code"] for r in rows})
    sites = {s.code: s for s in db.scalars(select(Site).where(Site.org_id == user.org_id,
                                                              Site.project_id == project.id,
                                                              Site.code.in_(codes))).all()}
    unknown = [c for c in codes if c not in sites]
    if unknown:
        raise ValidationFailed("Some site codes are not sampling points of this project.", code="UNKNOWN_SITE",
                               details={"site_codes": unknown[:50]})
    strata = {s.id: s for s in db.scalars(select(Stratum).where(
        Stratum.id.in_([s.stratum_id for s in sites.values()]))).all()}
    control = sorted(c for c, s in sites.items() if strata[s.stratum_id].role != "project")
    if control:
        raise ValidationFailed("QA1 points must lie in project strata, not baseline control sites.",
                               code="CONTROL_SITE_MODELLED", details={"site_codes": control})

    inputs: dict[str, Any] = {"eq4": {}, "activity_records": [], "stock_depth_cm": None}
    warnings: list[str] = []
    spectro = False
    initial_campaign = None
    initial_date = None
    if "soc" in pools:
        if not body.initial_campaign_id:
            raise RuleMissing("QA1 SOC runs must be initialised from directly measured SOC at t0 (Table 6, §8.2.1 "
                              "p.27): choose the baseline sampling campaign.", code="INITIAL_MEASUREMENT_MISSING",
                              details={"rule_key": "initial_campaign_id"})
        initial_campaign = get_owned(db, Campaign, body.initial_campaign_id, user, "Campaign")
        if initial_campaign.project_id != project.id or initial_campaign.kind != "baseline":
            raise ValidationFailed("The initial measurements must come from a baseline campaign of this project.",
                                   code="CAMPAIGN_MISMATCH")
        depth = float(rules.require("stock_depth_cm"))
        coarse = bool(rules.require("coarse_fragment_correction"))
        inputs["stock_depth_cm"] = depth
        samples, layers_by, latest = _campaign_samples(db, user.org_id, initial_campaign.id)
        by_site = {s.site_id: s for s in samples}
        missing: list[dict[str, Any]] = []
        for code in codes:
            smp = by_site.get(sites[code].id)
            if smp is None:
                missing.append({"site_code": code, "missing": ["no sample in the initial campaign"]})
                continue
            value, miss, detail, sp = _eq4_for_sample(smp, layers_by.get(smp.id, []), latest, depth, coarse)
            spectro = spectro or sp
            if miss:
                missing.append({"site_code": code, "missing": miss})
                continue
            inputs["eq4"][code] = {"sample_id": str(smp.id), "sample_code": smp.code,
                                   "collected_at": smp.collected_at.isoformat(), "soc_model_t_c_ha": value,
                                   "layers": detail}
        if missing:
            raise Blocked(f"{len(missing)} point(s) have no complete initial SOC measurement for the model input "
                          "(Eq. 4).", code="INITIAL_MEASUREMENT_MISSING", details={"points": missing[:50]})
        dates = [by_site[sites[c].id].collected_at for c in codes]
        initial_date = datetime.fromtimestamp(sum(_aware(d).timestamp() for d in dates) / len(dates), UTC).date()
        start = project_start(project)
        if abs((initial_date - start).days) > round(5 * 365.25):
            raise Blocked("The initial SOC measurements are more than 5 years from the project start; VM0042 allows "
                          "t = 0 measurements or back-modelling from measurements within ±5 years (Table 6 p.24).",
                          code="INITIAL_MEASUREMENT_TOO_FAR",
                          details={"measured_on": initial_date.isoformat(), "project_start": start.isoformat()})
        for code in codes:
            t0 = next(r["soc_t_c_ha"] for r in rows if r["site_code"] == code and r["year"] == t0_year
                      and r["draw"] == 0 and r["scenario"] == "baseline")
            measured = inputs["eq4"][code]["soc_model_t_c_ha"]
            inputs["eq4"][code]["model_t0_soc_t_c_ha"] = t0
            if abs(t0 - measured) > _TOL * max(1.0, abs(measured)):
                warnings.append(f"Site {code}: the model's t0 SOC ({t0:.3f} t C/ha) differs from the Eq. 4 value of "
                                f"the initial measurement ({measured:.3f} t C/ha). Back-modelling to t0 must be "
                                "documented (Table 6).")
    # management inputs: the baseline schedule of activities (§6, Box 1) and project activity data (Table 8)
    field_ids = sorted({sites[c].field_id for c in codes}, key=str)
    recs = active_records(db, user.org_id, project_id=project.id, field_ids=field_ids)
    no_schedule = [str(f) for f in field_ids if not any(r.field_id == f and r.scenario == "baseline" for r in recs)]
    if no_schedule:
        raise Blocked("The baseline schedule of activities (model management inputs, §6 / Box 1) is missing for some "
                      "fields.", code="BASELINE_SCHEDULE_MISSING", details={"field_ids": no_schedule})
    inputs["activity_records"] = [{"id": str(r.id), "record_id": str(r.record_id), "version": r.version,
                                   "field_id": str(r.field_id), "scenario": r.scenario, "year": r.year,
                                   "category": r.category} for r in recs]
    de_minimis = _evidence(db, user, body.spectroscopy_de_minimis_evidence_id, "spectroscopy de minimis evidence")

    years = [r["year"] for r in rows]
    evidence_file = evidence.store(db, user, data=raw_bytes, filename=f"qa1-run-{digest[:12]}.{body.format}",
                                   mime_type="text/csv" if body.format == "csv" else "application/json",
                                   kind="document", entity_type="qa1_run_import")
    imp = Qa1RunImport(
        org_id=user.org_id, created_by=user.id, project_id=project.id, model_id=model.id,
        model_fingerprint=model.parameter_fingerprint, label=body.label.strip(), source_format=body.format,
        sha256=digest, evidence_id=evidence_file.id, initial_campaign_id=initial_campaign.id if initial_campaign else None,
        initial_measurement_date=initial_date, t0_year=t0_year, row_count=len(rows), site_codes=codes,
        first_year=min(years), last_year=max(years), pools=pools, mc_draws=big_l, inputs=inputs, warnings=warnings,
        spectroscopy_used=spectro, spectroscopy_de_minimis_evidence_id=de_minimis, data_class="MODELLED",
        supersedes_id=supersedes.id if supersedes else None, notes=body.notes,
    )
    db.add(imp)
    db.flush()
    db.add_all([Qa1RunRow(org_id=user.org_id, created_by=user.id, import_id=imp.id, site_id=sites[r["site_code"]].id,
                          site_code=r["site_code"], scenario=r["scenario"], year=r["year"], draw=r["draw"],
                          soc_t_c_ha=r["soc_t_c_ha"], ch4_t_ch4_ha=r["ch4_t_ch4_ha"], n2o_t_n2o_ha=r["n2o_t_n2o_ha"],
                          practice_category=r["practice_category"], crop_functional_group=r["crop_functional_group"])
                for r in rows])
    audit(db, user, "qa1_import.create", imp)
    emit(db, user, "qa1.run_import.created", imp, {"project_id": str(project.id), "rows": len(rows), "pools": pools})
    return imp


def import_out(imp: Qa1RunImport) -> dict[str, Any]:
    d = snapshot(imp)
    d.pop("inputs", None)
    d["eq4_points"] = len((imp.inputs or {}).get("eq4") or {})
    d["activity_records_used"] = len((imp.inputs or {}).get("activity_records") or [])
    return d


def import_detail(db: Session, user: CurrentUser, import_id: str, include_rows: bool = False) -> dict[str, Any]:
    imp = get_owned(db, Qa1RunImport, import_id, user, "Model run import")
    d = snapshot(imp)
    if include_rows:
        rows = db.scalars(select(Qa1RunRow).where(Qa1RunRow.import_id == imp.id)
                          .order_by(Qa1RunRow.site_code, Qa1RunRow.scenario, Qa1RunRow.draw, Qa1RunRow.year)).all()
        d["rows"] = [{k: v for k, v in snapshot(r).items() if k not in ("org_id", "created_by", "import_id")}
                     for r in rows]
    return d


def list_imports(db: Session, user: CurrentUser, project_id: str) -> list[Qa1RunImport]:
    project = _project(db, user, project_id)
    return list(db.scalars(scoped(Qa1RunImport, user).where(Qa1RunImport.project_id == project.id)
                           .order_by(Qa1RunImport.created_at)).all())


# ================================================================ true-up state
def _approved_trueups(db: Session, project: Project) -> list[Qa1TrueUp]:
    return list(db.scalars(select(Qa1TrueUp).where(
        Qa1TrueUp.org_id == project.org_id, Qa1TrueUp.project_id == project.id, Qa1TrueUp.status == "approved")
        .order_by(Qa1TrueUp.measured_on)).all())


def trueup_state(db: Session, project: Project, rules: rs.RuleSet, *, as_of: date,
                 model: Qa1Model | None = None, imports: list[Qa1RunImport] | None = None) -> dict[str, Any]:
    """SOC re-measurement status (§8.2.1 p.27, §8.6.1.3 p.74–75). ``as_of`` is the end of the period credited.

    * Overdue when ``as_of`` is later than the last direct SOC measurement (initial t0 measurement or an approved
      true-up) plus ``remeasure_max_years``.
    * After an approved true-up measured before ``as_of``, the model must be an approved updated validation report
      that lists that true-up, and the runs must have been re-run (imported) after the true-up was approved."""
    max_years = float(rules.require("remeasure_max_years"))
    initial = [i.initial_measurement_date for i in (imports or []) if i.initial_measurement_date]
    base = max(initial) if initial else project_start(project)
    if base is None:
        _t0_year(project)  # raises PROJECT_START_MISSING
    trueups = [t for t in _approved_trueups(db, project) if t.measured_on <= as_of]
    last_t = trueups[-1] if trueups else None
    last = max(base, last_t.measured_on) if last_t else base
    due = _years_after(last, max_years)
    problems: list[dict[str, Any]] = []
    if as_of > due:
        problems.append({"code": "TRUEUP_OVERDUE",
                         "message": f"SOC was last measured directly on {last.isoformat()}; VM0042 requires "
                                    f"re-measurement at least every {max_years:g} years, so a true-up was due by "
                                    f"{due.isoformat()}."})
    if last_t is not None and model is not None:
        if str(last_t.id) not in (model.trueup_ids or []) or _aware(model.approved_at) < _aware(last_t.approved_at):
            problems.append({"code": "TRUEUP_MVR_REQUIRED",
                             "message": "After the true-up the model validation must be repeated with the re-measured "
                                        "data and an updated model validation report approved (§8.6.1.3)."})
        stale = [str(i.id) for i in (imports or []) if _aware(i.created_at) < _aware(last_t.approved_at)]
        if stale:
            problems.append({"code": "TRUEUP_RERUN_REQUIRED",
                             "message": "After the true-up the baseline and project simulations must be re-run from t0 "
                                        "with the updated model (§8.6.1.3).", "import_ids": stale})
    return {"rule_key": "remeasure_max_years", "max_years": max_years, "last_measured_on": last.isoformat(),
            "due_by": due.isoformat(), "as_of": as_of.isoformat(), "overdue": as_of > due,
            "latest_trueup_id": str(last_t.id) if last_t else None, "problems": problems, "reference": REF_TRUEUP}


def project_status(db: Session, user: CurrentUser, project_id: str) -> dict[str, Any]:
    project = _project(db, user, project_id)
    rules = rs.for_project(db, project, require_approved=False)
    imports = list_imports(db, user, project_id)
    soc_imports = [i for i in imports if "soc" in (i.pools or [])]
    state = None
    if soc_imports or project_start(project):
        try:
            state = trueup_state(db, project, rules, as_of=date.today(), imports=soc_imports)
        except RuleMissing as exc:
            state = {"error": exc.message, "details": exc.details}
    trueups = list(db.scalars(scoped(Qa1TrueUp, user).where(Qa1TrueUp.project_id == project.id)
                              .order_by(Qa1TrueUp.measured_on)).all())
    return {
        "project_id": str(project.id),
        "approaches": {pool: rules.get(rule) for pool, rule in POOL_RULE.items()},
        "uncertainty_method": rules.get("qa1_uncertainty_method"),
        "imports": [import_out(i) for i in imports],
        "trueups": [trueup_out(t) for t in trueups],
        "trueup_state": state,
    }


# ================================================================ analysis (Eq. 46/47, 54, 58, 60–69)
def _metric(model: Qa1Model, pool: str, category: str) -> dict[str, Any]:
    for x in model.validation_metrics or []:
        if x["pool"] == pool and x["practice_category"] == category:
            return x
    raise Blocked(f"Model {model.name} v{model.version} has no validated prediction error for {pool} under "
                  f"{category.replace('_', ' ')}.", code="OUTSIDE_VALIDATION_DOMAIN",
                  details={"pool": pool, "practice_category": category})


def _s2_model_delta(m: dict[str, Any]) -> tuple[float, str]:
    """s²_model,Δ• for a metric: direct side-by-side estimate, else Eq. 61 (ρ) or Eq. 60 (cov)."""
    if m.get("s2_model_delta") is not None:
        return float(m["s2_model_delta"]), "side-by-side s²_model,Δ• (§8.6.1.1.1)"
    if m.get("rho") is not None:
        return domain.eq61_model_variance_delta(float(m["s2_model"]), float(m["rho"])), "Eq. 61 2 s²_model (1 − ρ)"
    return domain.eq60_model_variance_delta(float(m["s2_model"]), float(m["cov"])), "Eq. 60 2[s²_model − cov]"


def _analysis_imports(db: Session, user: CurrentUser, project: Project, ids: list[str]) -> list[Qa1RunImport]:
    imps = []
    for raw in dict.fromkeys(ids):
        imp = get_owned(db, Qa1RunImport, raw, user, "Model run import")
        if imp.project_id != project.id:
            raise ValidationFailed("Every import must belong to this project.", code="IMPORT_MISMATCH")
        newer = db.scalar(select(Qa1RunImport.id).where(Qa1RunImport.supersedes_id == imp.id))
        if newer is not None:
            raise Conflict(f"Import “{imp.label}” has been replaced by a newer import.", code="IMPORT_SUPERSEDED",
                           details={"import_id": str(imp.id), "replaced_by": str(newer)})
        imps.append(imp)
    if len({i.model_id for i in imps}) != 1 or len({i.model_fingerprint for i in imps}) != 1:
        raise Blocked("All model runs must use the same model version and parameter set (VM0042 §4 cond. 4e).",
                      code="MODEL_MISMATCH", details={"model_ids": sorted({str(i.model_id) for i in imps})})
    seen: dict[str, str] = {}
    for imp in imps:
        for code in imp.site_codes or []:
            if code in seen:
                raise Conflict(f"Point {code} appears in more than one import.", code="DUPLICATE_POINT",
                               details={"site_code": code, "imports": [seen[code], str(imp.id)]})
            seen[code] = str(imp.id)
    if len({i.t0_year for i in imps}) != 1:
        raise ValidationFailed("The imports start from different t0 years.", code="IMPORT_MISMATCH")
    return imps


def _series(rows: list[Qa1RunRow], col: str) -> dict[tuple[str, str, int], dict[int, float]]:
    out: dict[tuple[str, str, int], dict[int, float]] = defaultdict(dict)
    for r in rows:
        v = getattr(r, col)
        if v is not None:
            out[(r.site_code, r.scenario, r.draw)][r.year] = float(v)
    return out


def _check_domain_fields(db: Session, model: Qa1Model, sites: dict[str, Site]) -> None:
    dom = model.validation_domain or {}
    zones = {x.lower() for x in dom.get("climate_zones") or []}
    textures = {x.lower() for x in dom.get("soil_textures") or []}
    fields = {f.id: f for f in db.scalars(select(Field).where(Field.id.in_({s.field_id for s in sites.values()})))}
    unknown, outside = [], []
    for code, s in sorted(sites.items()):
        f = fields.get(s.field_id)
        cz, tx = (f.climate_zone if f else None), (f.soil_texture_class if f else None)
        if not cz or not tx:
            unknown.append({"site_code": code, "field": f.code if f else None,
                            "missing": [k for k, v in (("climate_zone", cz), ("soil_texture_class", tx)) if not v]})
            continue
        bad = [k for k, v, allowed in (("climate_zone", cz, zones), ("soil_texture_class", tx, textures))
               if v.lower() not in allowed]
        if bad:
            outside.append({"site_code": code, "field": f.code, "outside": bad, "climate_zone": cz,
                            "soil_texture_class": tx})
    if unknown:
        raise Blocked("The climate zone or soil texture of some fields is not recorded, so the model's validation "
                      "domain can't be checked.", code="DOMAIN_UNVERIFIABLE", details={"points": unknown[:50]})
    if outside:
        raise Blocked("Some points lie outside the model's validation domain (climate zone or soil texture).",
                      code="OUTSIDE_VALIDATION_DOMAIN", details={"points": outside[:50]})


def compute_analysis(db: Session, user: CurrentUser, project_id: str, body: AnalysisIn) -> Qa1Analysis:
    project = _project(db, user, project_id)
    rules = rs.for_project(db, project, require_approved=True)
    if body.period_end <= body.period_start:
        raise ValidationFailed("The period must end after it starts.", code="INVALID_PERIOD")
    pools = [p for p, key in POOL_RULE.items() if rules.require(key) == "qa1"]
    if not pools:
        raise Blocked("None of SOC, soil CH4 or soil N2O is quantified with QA1 in the project's rules.",
                      code="NO_QA1_SOURCES", details={"rule_keys": list(POOL_RULE.values())})
    if not rules.require("modelled_soc_permitted"):
        raise Blocked("The rules don't allow crediting modelled (QA1) values.", code="MODELLED_DATA_NOT_PERMITTED",
                      details={"rule_key": "modelled_soc_permitted"})
    method = rules.require("qa1_uncertainty_method")
    if method not in ("analytical", "monte_carlo"):
        raise ValidationFailed(f"Unknown QA1 uncertainty method “{method}”.", code="UNSUPPORTED_RULE_VALUE",
                               details={"rule_key": "qa1_uncertainty_method"})
    imps = _analysis_imports(db, user, project, body.import_ids)
    model = _usable_model(db, user, imps[0].model_id)
    if imps[0].model_fingerprint != model.parameter_fingerprint:
        raise Blocked("The runs were produced with a different parameter set from the approved model.",
                      code="MODEL_MISMATCH")
    t0_year = imps[0].t0_year
    if body.period_start.year <= t0_year:
        raise ValidationFailed("The period starts before the project start (t0).", code="INVALID_PERIOD")
    for pool in pools:
        lacking = [i.label for i in imps if pool not in (i.pools or [])]
        if lacking:
            raise RuleMissing(f"The rules quantify {pool.replace('_', ' ')} with QA1, but the import(s) {lacking} "
                              "have no modelled values for it.", details={"rule_key": POOL_RULE[pool], "pool": pool})

    vint = [(v.year, v.weight) for v in engine.vintages_for(body.period_start, body.period_end)]
    period_years = float(sum(w for _, w in vint))
    rows = list(db.scalars(select(Qa1RunRow).where(Qa1RunRow.import_id.in_([i.id for i in imps]))).all())
    codes = sorted({r.site_code for r in rows})
    sites = {s.code: s for s in db.scalars(select(Site).where(Site.org_id == user.org_id,
                                                              Site.project_id == project.id,
                                                              Site.code.in_(codes))).all()}
    # strata in effect at the end of the period (areas A_h)
    all_strata = list(db.scalars(select(Stratum).where(Stratum.org_id == user.org_id,
                                                       Stratum.project_id == project.id)).all())
    code_of = {s.id: s.code for s in all_strata}
    effective = {s.code: s for s in all_strata
                 if s.role == "project" and s.effective_from <= body.period_end
                 and (s.effective_to is None or s.effective_to > body.period_end)}
    site_stratum = {c: code_of.get(sites[c].stratum_id) for c in codes}
    outside = sorted(c for c, h in site_stratum.items() if h not in effective)
    if outside:
        raise Blocked("Some modelled points are not in a project stratum in effect for this period.",
                      code="INVALID_STRATUM", details={"site_codes": outside[:50]})
    unmodelled = sorted(set(effective) - set(site_stratum.values()))
    if unmodelled:
        raise Blocked("Every project stratum needs modelled points: the total area A in Eq. 63/69 is the whole "
                      "project.", code="STRATUM_NOT_MODELLED", details={"strata": unmodelled})
    need = int(rules.require("min_composites_per_stratum"))
    points_by_h: dict[str, list[str]] = defaultdict(list)
    for c in codes:
        points_by_h[site_stratum[c]].append(c)
    few = {h: len(v) for h, v in points_by_h.items() if len(v) < max(2, need)}
    if few:
        raise Blocked(f"Each stratum needs at least {max(2, need)} modelled sampling points.",
                      code="INSUFFICIENT_POINTS", details={"strata": few, "rule_key": "min_composites_per_stratum"})
    _check_domain_fields(db, model, sites)
    # Table 8 (p.49): project ALM activities monitored for each project year t
    field_ids = sorted({s.field_id for s in sites.values()}, key=str)
    recs = active_records(db, user.org_id, project_id=project.id, field_ids=field_ids, scenario="project")
    have = {(r.field_id, r.year) for r in recs}
    gaps = [{"field_id": str(f), "year": y} for f in field_ids for y, _ in vint if (f, y) not in have]
    if gaps:
        raise Blocked("Project activity data (model inputs, Table 8) is missing for some fields and years.",
                      code="PROJECT_ACTIVITY_MISSING", details={"missing": gaps[:50]})

    category = {}
    for r in rows:
        category.setdefault(site_stratum[r.site_code], set()).add(r.practice_category)
    mixed = {h: sorted(v) for h, v in category.items() if len(v) > 1}
    if mixed:
        raise Blocked("Each stratum must have one practice category so its model prediction error can be chosen "
                      "(Eq. 64).", code="MIXED_PRACTICE_CATEGORIES", details={"strata": mixed})
    cat_h = {h: next(iter(v)) for h, v in category.items()}
    areas = {h: float(effective[h].area_ha) for h in points_by_h}
    bad_area = [h for h, a in areas.items() if not a or a <= 0]
    if bad_area:
        raise ValidationFailed("Some strata have no area.", code="INVALID_STRATUM", details={"strata": bad_area})

    spectro = any(i.spectroscopy_used and i.spectroscopy_de_minimis_evidence_id is None for i in imps)
    use_ppd = method == "monte_carlo" and all(i.mc_draws > 0 for i in imps)
    big_l = None
    apply_factor = False
    if method == "analytical" and spectro:
        raise Blocked("Initial SOC was measured with soil spectroscopy: VM0042 requires the Monte Carlo method unless "
                      "its measurement error is shown to be unbiased and de minimis (§8.6.1.1.2 p.67).",
                      code="MONTE_CARLO_REQUIRED", details={"rule_key": "qa1_uncertainty_method"})
    if method == "monte_carlo":
        min_l = int(rules.require("qa1_mc_min_draws"))
        apply_factor = bool(rules.require("qa1_mc_error_factor"))
        if use_ppd:
            ls = {i.mc_draws for i in imps}
            if len(ls) != 1:
                raise ValidationFailed("All imports must have the same number of Monte Carlo draws.",
                                       code="MC_SHAPE_MISMATCH", details={"L": sorted(ls)})
            big_l = ls.pop()
            if big_l < min_l:
                raise Blocked(f"The runs have {big_l} Monte Carlo draws; the rules require at least {min_l}.",
                              code="MC_TOO_FEW_DRAWS", details={"rule_key": "qa1_mc_min_draws"})
        else:
            if spectro:
                raise Blocked("Initial SOC was measured with soil spectroscopy, so its measurement error must be "
                              "propagated with posterior predictive draws from the model (§8.6.1.2.2 p.74); import "
                              "runs with draws.", code="PPD_DRAWS_REQUIRED")
            if body.seed is None:
                raise ValidationFailed("Give a seed so the Monte Carlo draws can be reproduced.", code="SEED_REQUIRED")
            big_l = min_l

    gwp = {"ch4_soil": float(rules.require("gwp_ch4")) if "ch4_soil" in pools else None,
           "n2o_soil": float(rules.require("gwp_n2o")) if "n2o_soil" in pools else None}
    results: dict[str, Any] = {}
    for pool in pools:
        col = POOL_COLUMN[pool]
        series = _series(rows, col)

        def per_ha(code: str, scenario: str, draw: int) -> float:
            s = series[(code, scenario, draw)]
            if pool == "soc":  # Eq. 46/47 with 44/12 (p.59): removal-positive stock change
                return domain.period_change(s, vint) * domain.CO2_PER_C
            return domain.period_flux(s, vint) * gwp[pool]  # Eq. 10 / Eq. 15: GWP × ʄ(·)

        def reduction(code: str, draw: int) -> tuple[float, float, float]:
            wp, bsl = per_ha(code, "project", draw), per_ha(code, "baseline", draw)
            # Eq. 65 emissions convention: z = −ΔSOC for SOC, z = emission for fluxes; y = z_bsl − z_wp
            z_b, z_w = (-bsl, -wp) if pool == "soc" else (bsl, wp)
            return float(domain.eq65_point_draws(np.array(z_b), np.array(z_w))), wp, bsl

        hs = sorted(points_by_h)
        central = {h: [reduction(c, 0) for c in sorted(points_by_h[h])] for h in hs}
        strata_pts = [domain.StratumPoints(h, areas[h], tuple(x[0] for x in central[h])) for h in hs]
        metric_used: dict[str, Any] = {}
        s2_h: dict[str, float] = {}
        df_h: dict[str, float] = {}
        if not use_ppd:
            for h in hs:
                m = _metric(model, pool, cat_h[h])
                if period_years > float(m["median_duration_years"]) + _TOL:
                    raise Blocked(
                        f"The period is {period_years:.2f} years but the {pool} prediction error for "
                        f"{cat_h[h].replace('_', ' ')} was validated on experiments with a median length of "
                        f"{m['median_duration_years']:g} years; a mixed-duration error is only acceptable for periods "
                        "up to that median (§8.6.1.1.1 p.65).", code="MODEL_ERROR_DURATION",
                        details={"pool": pool, "stratum": h})
                s2_h[h], how = _s2_model_delta(m)
                df_h[h] = float(m["n_sites"]) - 1.0
                metric_used[h] = {"practice_category": cat_h[h], "s2_model_delta": s2_h[h], "how": how,
                                  "n_sites": m["n_sites"], "bias": m["bias"],
                                  "median_duration_years": m["median_duration_years"]}
        if method == "analytical":
            unc = domain.analytical(strata_pts, s2_h, df_h)
            wp_total = sum(areas[h] * float(np.mean([x[1] for x in central[h]])) for h in hs)
            bsl_total = sum(areas[h] * float(np.mean([x[2] for x in central[h]])) for h in hs)
            eqs = ["Eq. 46/47" if pool == "soc" else ("Eq. 10, 54" if pool == "ch4_soil" else "Eq. 15, 58"),
                   "Eq. 60/61", "Eq. 62", "Eq. 63", "Eq. 64"]
            draws_source = None
        elif use_ppd:
            assert big_l is not None
            draws, wp_d, bsl_d = [], {}, {}
            for h in hs:
                arr = np.array([[reduction(c, l_) for l_ in range(1, big_l + 1)] for c in sorted(points_by_h[h])])
                draws.append(domain.StratumDraws(h, areas[h], arr[:, :, 0]))
                wp_d[h], bsl_d[h] = arr[:, :, 1], arr[:, :, 2]
            unc = domain.monte_carlo(draws, apply_error_factor=apply_factor)
            wp_total = sum(areas[h] * float(wp_d[h].mean()) for h in hs)
            bsl_total = sum(areas[h] * float(bsl_d[h].mean()) for h in hs)
            eqs = ["Eq. 46/47" if pool == "soc" else ("Eq. 10, 54" if pool == "ch4_soil" else "Eq. 15, 58"),
                   "Eq. 65", "Eq. 66", "Eq. 67", "Eq. 68", "Eq. 69", "§8.6.1.2.3"]
            draws_source = "imported posterior predictive draws"
        else:
            assert big_l is not None and body.seed is not None
            draws = domain.meta_model_draws(strata_pts, {h: math.sqrt(s2_h[h]) for h in hs}, big_l, body.seed)
            unc = domain.monte_carlo(draws, apply_error_factor=apply_factor)
            wp_total = sum(areas[h] * float(np.mean([x[1] for x in central[h]])) for h in hs)
            bsl_total = sum(areas[h] * float(np.mean([x[2] for x in central[h]])) for h in hs)
            eqs = ["Eq. 46/47" if pool == "soc" else ("Eq. 10, 54" if pool == "ch4_soil" else "Eq. 15, 58"),
                   "Eq. 60/61", "Eq. 65", "Eq. 66", "Eq. 67", "Eq. 68", "Eq. 69", "§8.6.1.2.3"]
            draws_source = "residual-error meta-model (§8.6.1.2 p.70), seeded"
        if pool == "soc":
            wp_total, bsl_total = float(wp_total), float(bsl_total)
            terms = {"soc_project_modelled": {"value_t_co2e": wp_total, "variance": unc.variance_total,
                                              "df": unc.df if unc.variance_total > 0 else None},
                     "baseline_scenario": {"value_t_co2e": bsl_total, "variance": 0.0, "df": None}}
        else:
            terms = {pool: {"value_t_co2e": unc.total_t_co2e, "variance": unc.variance_total,
                            "df": unc.df if unc.variance_total > 0 else None}}
        results[pool] = {
            "pool": pool, "uncertainty": unc.to_dict(), "terms": terms, "equations": eqs,
            "project_total_t_co2e": float(wp_total), "baseline_total_t_co2e": float(bsl_total),
            "reduction_total_t_co2e": unc.total_t_co2e, "model_error_by_stratum": metric_used,
            "draws_source": draws_source, "unit_note": ("SOC t C/ha × 44/12 → t CO2e" if pool == "soc"
                                                        else f"t {'CH4' if pool == 'ch4_soil' else 'N2O'}/ha × GWP "
                                                             f"{gwp[pool]:g} → t CO2e"),
            "points": {h: [{"site_code": c, "reduction_t_co2e_ha": x[0], "project_t_co2e_ha": x[1],
                            "baseline_t_co2e_ha": x[2]} for c, x in zip(sorted(points_by_h[h]), central[h])]
                       for h in hs},
        }
    state = trueup_state(db, project, rules, as_of=body.period_end, model=model,
                         imports=[i for i in imps if "soc" in (i.pools or [])]) if "soc" in pools else {}
    rules_used = {k: rules.get(k) for k in ("qa_soc", "qa_ch4_soil", "qa_n2o_soil", "modelled_soc_permitted",
                                            "qa1_uncertainty_method", "qa1_mc_min_draws", "qa1_mc_error_factor",
                                            "remeasure_max_years", "min_composites_per_stratum", "gwp_ch4", "gwp_n2o",
                                            "stock_depth_cm", "uncertainty_confidence")}
    payload = {"project_id": str(project.id), "period": [body.period_label, body.period_start.isoformat(),
                                                         body.period_end.isoformat()],
               "model": {"id": str(model.id), "fingerprint": model.parameter_fingerprint},
               "imports": sorted((str(i.id), i.sha256) for i in imps), "method": method, "seed": body.seed,
               "rules": rules_used, "results": results}
    an = Qa1Analysis(
        org_id=user.org_id, created_by=user.id, project_id=project.id, period_label=body.period_label,
        period_start=body.period_start, period_end=body.period_end, model_id=model.id,
        import_ids=[str(i.id) for i in imps], method=method, seed=body.seed if method == "monte_carlo" else None,
        rule_pack_id=uuid.UUID(rules.pack_id), rules_used=rules_used,
        results={"pools": results, "period_years": period_years, "vintages": vint, "mc_draws": big_l,
                 "model": {"id": str(model.id), "name": model.name, "version": model.version,
                           "revision": model.revision, "parameter_fingerprint": model.parameter_fingerprint},
                 "data_class": "MODELLED"},
        trueup=state, sha256=sha256_of(payload),
    )
    db.add(an)
    audit(db, user, "qa1_analysis.create", an)
    return an


def analysis_out(db: Session, an: Qa1Analysis) -> dict[str, Any]:
    d = snapshot(an)
    pubs = db.scalars(select(Qa1Publication).where(Qa1Publication.analysis_id == an.id)).all()
    d["published_term_ids"] = [t for p in pubs for t in p.term_ids]
    return d


def list_analyses(db: Session, user: CurrentUser, project_id: str) -> list[Qa1Analysis]:
    project = _project(db, user, project_id)
    return list(db.scalars(scoped(Qa1Analysis, user).where(Qa1Analysis.project_id == project.id)
                           .order_by(Qa1Analysis.created_at)).all())


def _source(an: Qa1Analysis, model: Qa1Model, term: str, pool_res: dict[str, Any]) -> str:
    unc = pool_res["uncertainty"]
    method = ("analytical Eq. 60–64" if an.method == "analytical"
              else f"Monte Carlo Eq. 65–69, L = {unc['mc_draws']}"
                   + (f", seed {an.seed}" if an.seed is not None else "")
                   + (f", MC error factor √(1+1/L) = {unc['mc_error_factor']:.5f}" if unc.get("mc_error_factor") else ""))
    head = (f"QA1 (VM0042 v2.2 Measure and Model) analysis {an.id}, period {an.period_label} "
            f"{an.period_start.isoformat()}–{an.period_end.isoformat()}. Model {model.name} v{model.version} "
            f"rev {model.revision} (parameter set sha256 {model.parameter_fingerprint[:16]}…), run imports "
            f"{', '.join(an.import_ids)}. ")
    if term == "soc_project_modelled":
        body = ("ΔCO2_soil,wp = Σ_h A_h × mean point change of modelled SOC (Eq. 5, 47; t C × 44/12). Variance is "
                "the variance of the period total of SOC removals (project − baseline, so the Eq. 60 covariance is "
                f"included) by {method}; it is carried on this term only and the baseline term has variance 0.")
    elif term == "baseline_scenario":
        body = ("ΔCO2_soil,bsl = Σ_h A_h × mean point change of modelled baseline SOC (Eq. 5, 46; t C × 44/12). "
                "Same model version and parameters as the project scenario (§4 cond. 4e). Its uncertainty is part of "
                "the variance on soc_project_modelled.")
    elif term == "ch4_soil":
        body = f"ΔCH4_soil = Σ_h A_h × mean (baseline − project) GWP_CH4 × ʄ(CH4_soil) (Eq. 10, 54). Variance: {method}."
    else:
        body = f"ΔN2O_soil = Σ_h A_h × mean (baseline − project) GWP_N2O × ʄ(N2O_soil) (Eq. 15, 58). Variance: {method}."
    return (head + body + f" Analysis sha256 {an.sha256}.")[:5000]


def publish(db: Session, user: CurrentUser, analysis_id: str) -> tuple[Qa1Analysis, list]:
    an = get_owned(db, Qa1Analysis, analysis_id, user, "QA1 analysis")
    if db.scalar(select(Qa1Publication.id).where(Qa1Publication.analysis_id == an.id)) is not None:
        raise Conflict("This analysis has already been published. Compute a new analysis to publish again.",
                       code="ALREADY_PUBLISHED")
    project = db.get(Project, an.project_id)
    rules = rs.for_project(db, project, require_approved=True)
    model = _usable_model(db, user, an.model_id)
    pools = an.results.get("pools") or {}
    for pool in pools:
        if rules.require(POOL_RULE[pool]) != "qa1":
            raise Blocked(f"The project's rules no longer quantify {pool.replace('_', ' ')} with QA1.",
                          code="APPROACH_CHANGED", details={"rule_key": POOL_RULE[pool]})
    if "soc" in pools:
        imps = [db.get(Qa1RunImport, _uuid(i, "Import")) for i in an.import_ids]
        state = trueup_state(db, project, rules, as_of=an.period_end, model=model, imports=imps)
        if state["problems"]:
            first = state["problems"][0]
            raise Blocked(first["message"], code=first["code"], details=state)
    terms = []
    for pool, res in pools.items():
        for key, t in res["terms"].items():
            terms.append(calc_service.create_term(db, user, str(project.id), TermIn(
                period_label=an.period_label, term=key, value_t_co2e=t["value_t_co2e"], variance=t["variance"],
                df=t["df"], source=_source(an, model, key, res))))
    db.flush()
    pub = Qa1Publication(org_id=user.org_id, created_by=user.id, analysis_id=an.id,
                         term_ids=[str(t.id) for t in terms])
    db.add(pub)
    audit(db, user, "qa1_analysis.publish", pub)
    emit(db, user, "qa1.terms.published", an, {"term_ids": pub.term_ids, "period_label": an.period_label})
    return an, terms


# ================================================================ true-up (§8.6.1.3)
def trueup_out(t: Qa1TrueUp) -> dict[str, Any]:
    return snapshot(t)


def create_trueup(db: Session, user: CurrentUser, project_id: str, body: TrueUpIn) -> Qa1TrueUp:
    project = _project(db, user, project_id)
    rules = rs.for_project(db, project, require_approved=True)
    imp = get_owned(db, Qa1RunImport, body.import_id, user, "Model run import")
    if imp.project_id != project.id or "soc" not in (imp.pools or []):
        raise ValidationFailed("Choose a SOC model run import of this project.", code="IMPORT_MISMATCH")
    if imp.initial_campaign_id is None:
        raise ValidationFailed("The import has no initial measurement campaign.", code="IMPORT_MISMATCH")
    camp = get_owned(db, Campaign, body.campaign_id, user, "Campaign")
    if camp.project_id != project.id or camp.kind != "monitoring":
        raise ValidationFailed("The re-measurement must be a monitoring campaign of this project.",
                               code="CAMPAIGN_MISMATCH")
    depth = float(rules.require("stock_depth_cm"))
    need = int(rules.require("min_composites_per_stratum"))
    sites = {s.code: s for s in db.scalars(select(Site).where(Site.org_id == user.org_id,
                                                              Site.project_id == project.id,
                                                              Site.code.in_(imp.site_codes or []))).all()}
    by_id = {s.id: s for s in sites.values()}
    code_of = {s.id: s.code for s in db.scalars(select(Stratum).where(Stratum.project_id == project.id)).all()}
    init_samples, init_layers, init_latest = _campaign_samples(db, user.org_id, imp.initial_campaign_id)
    re_samples, re_layers, re_latest = _campaign_samples(db, user.org_id, camp.id)
    re_samples = [s for s in re_samples if s.site_id in by_id]
    init_samples = [s for s in init_samples if s.site_id in by_id]
    if not re_samples:
        raise Blocked("The campaign has no samples at the modelled points.", code="TRUEUP_NO_POINTS")
    coarse = bool(rules.require("coarse_fragment_correction"))
    missing: list[dict[str, Any]] = []

    def to_point(smp: Sample, layers_by: dict, latest: dict) -> engine.Point | None:
        eng_layers = []
        absent = []
        for lyr in sorted(layers_by.get(smp.id, []), key=lambda x: x.depth_from_cm):
            soc, bd = latest.get((lyr.id, "soc_pct")), latest.get((lyr.id, "bulk_density_g_cm3"))
            cf, fsm = latest.get((lyr.id, "coarse_fraction")), latest.get((lyr.id, "fine_soil_mass_g"))
            eq3 = fsm is not None and smp.probe_diameter_mm and smp.cores_composited
            if soc is None or (not eq3 and (bd is None or (coarse and cf is None))):
                absent.append(lyr.code)
                continue
            eng_layers.append(engine.Layer(lyr.code, lyr.depth_from_cm, lyr.depth_to_cm,
                                           None if eq3 else bd.value, soc.value,
                                           None if eq3 else (cf.value if cf else None),
                                           fsm.value if eq3 else None))
        if absent or not eng_layers:
            missing.append({"sample": smp.code, "layers": absent or ["no layers"]})
            return None
        return engine.Point(str(smp.site_id), tuple(eng_layers), smp.code, smp.probe_diameter_mm,
                            smp.cores_composited)

    init_pts = {s.site_id: to_point(s, init_layers, init_latest) for s in init_samples}
    re_pts = {s.site_id: to_point(s, re_layers, re_latest) for s in re_samples}
    if missing:
        raise Blocked(f"{len(missing)} sample(s) are missing accepted lab results needed for the ESM stocks.",
                      code="MISSING_LAB_RESULT", details={"samples": missing[:50]})
    rows = db.scalars(select(Qa1RunRow).where(Qa1RunRow.import_id == imp.id, Qa1RunRow.scenario == "project",
                                              Qa1RunRow.draw == 0)).all()
    series: dict[str, dict[int, float]] = defaultdict(dict)
    for r in rows:
        series[r.site_code][r.year] = float(r.soc_t_c_ha)
    # equivalent soil mass per stratum, reference mass over initial + re-measurement samples (§8.2.1.6 p.36)
    by_h: dict[str, list[Sample]] = defaultdict(list)
    for s in re_samples:
        by_h[code_of.get(by_id[s.site_id].stratum_id, "?")].append(s)
    few = {h: len(v) for h, v in by_h.items() if len(v) < max(2, need)}
    if few:
        raise Blocked(f"A true-up needs at least {max(2, need)} re-measured points per stratum (§8.2.1.2).",
                      code="INSUFFICIENT_POINTS", details={"strata": few, "rule_key": "min_composites_per_stratum"})
    points, modelled, observed = [], [], []
    for h, smps in sorted(by_h.items()):
        group = [re_pts[s.site_id] for s in smps] + [init_pts[s.site_id] for s in init_samples
                                                     if code_of.get(by_id[s.site_id].stratum_id) == h
                                                     and init_pts.get(s.site_id) is not None]
        profiles = [engine.profile(p, rules) for p in group]
        m_ref = engine.reference_mass(profiles, depth, rules)
        for s in smps:
            ps = engine.point_stock(engine.profile(re_pts[s.site_id], rules), rules, m_ref, depth)
            when = _aware(s.collected_at)
            start_of_year = datetime(when.year, 1, 1, tzinfo=UTC)
            days = (datetime(when.year + 1, 1, 1, tzinfo=UTC) - start_of_year).total_seconds()
            frac = when.year + (when - start_of_year).total_seconds() / days
            code = by_id[s.site_id].code
            mod = domain.stock_at(series[code], frac)
            points.append({"site_code": code, "stratum": h, "sample_code": s.code,
                           "collected_at": s.collected_at.isoformat(), "measured_soc_t_c_ha": ps.stock_t_c_ha,
                           "modelled_soc_t_c_ha": mod, "reference_mass_t_ha": m_ref,
                           "error_t_co2e_ha": (mod - ps.stock_t_c_ha) * domain.CO2_PER_C})
            modelled.append(mod * domain.CO2_PER_C)
            observed.append(ps.stock_t_c_ha * domain.CO2_PER_C)
    stats = domain.trueup_stats(modelled, observed)
    dates = [_aware(s.collected_at).timestamp() for s in re_samples]
    measured_on = datetime.fromtimestamp(sum(dates) / len(dates), UTC).date()
    if imp.initial_measurement_date and measured_on <= imp.initial_measurement_date:
        raise ValidationFailed("The re-measurement must be later than the initial measurement.",
                               code="CAMPAIGN_MISMATCH")
    ev_ids = [str(_evidence(db, user, e, "true-up evidence")) for e in body.evidence_ids]
    soc_metrics = [x for x in (db.get(Qa1Model, imp.model_id).validation_metrics or []) if x["pool"] == "soc"]
    t = Qa1TrueUp(
        org_id=user.org_id, created_by=user.id, project_id=project.id, model_id=imp.model_id, import_id=imp.id,
        campaign_id=camp.id, measured_on=measured_on, points=points,
        stats={**stats.to_dict(), "unit": "t CO2e/ha", "error_definition": "modelled − measured (ESM)",
               "validated_soc_metrics": soc_metrics, "reference": REF_TRUEUP,
               "next_steps": ["Add the re-measured data to the calibration/validation dataset and repeat the VMD0053 "
                              "validation; submit the updated model validation report for IME assessment.",
                              "Approve the updated model (listing this true-up) and re-run baseline and project "
                              "simulations from t0; uncertainty deductions are recalculated for future vintages. "
                              "Issued VCUs remain unchanged (§8.6.1.3 p.75)."]},
        evidence_ids=ev_ids, notes=body.notes, status="draft",
    )
    db.add(t)
    audit(db, user, "qa1_trueup.create", t)
    return t


def approve_trueup(db: Session, user: CurrentUser, trueup_id: str) -> Qa1TrueUp:
    t = get_owned(db, Qa1TrueUp, trueup_id, user, "True-up")
    if t.status != "draft":
        raise IllegalTransition(f"Only a draft true-up can be approved; this one is {t.status}.")
    ensure_not_author(user.id, t.created_by, what="a true-up")
    before = {"status": t.status}
    t.status = "approved"
    t.approved_by = user.id
    t.approved_at = utcnow()
    audit(db, user, "qa1_trueup.approve", t, before=before)
    emit(db, user, "qa1.trueup.approved", t, {"project_id": str(t.project_id), "measured_on": t.measured_on})
    return t


def list_trueups(db: Session, user: CurrentUser, project_id: str) -> list[Qa1TrueUp]:
    project = _project(db, user, project_id)
    return list(db.scalars(scoped(Qa1TrueUp, user).where(Qa1TrueUp.project_id == project.id)
                           .order_by(Qa1TrueUp.measured_on)).all())
