"""Portfolio view for programme owners and their clients: progress and results across programmes
and projects. Farmer personal data is masked for client and buyer roles (see ``masking``)."""

from __future__ import annotations

import uuid
from collections import defaultdict
from decimal import Decimal
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.tenancy import get_owned, scoped
from app.modules.calculation.models import CalculationRun, RunStatusEvent
from app.modules.credits.models import CreditBatch, Sale
from app.modules.credits.service import balances, issued_total
from app.modules.farmers.models import Farmer
from app.modules.land.models import Enrolment, Field
from app.modules.payments.models import BenefitPool, Payout, PayoutBatch
from app.modules.portfolio.masking import farmer_public, masks_pii
from app.modules.programmes.models import Programme, Project
from app.modules.risk.models import Grievance, RiskEvent
from app.modules.sampling.models import Campaign, Sample

FINANCE_HIDDEN_ROLES = frozenset({"buyer"})


def _run_status(db: Session, run_id: uuid.UUID) -> str | None:
    ev = db.scalars(select(RunStatusEvent).where(RunStatusEvent.run_id == run_id)
                    .order_by(RunStatusEvent.created_at.desc())).first()
    return ev.status if ev else None


def _latest_approved(db: Session, org_id: uuid.UUID, project_id: uuid.UUID) -> dict[str, Any] | None:
    runs = db.scalars(select(CalculationRun).where(CalculationRun.org_id == org_id,
                                                   CalculationRun.project_id == project_id)
                      .order_by(CalculationRun.period_end.desc(), CalculationRun.created_at.desc())).all()
    for r in runs:
        if _run_status(db, r.id) == "approved":
            return {"run_id": str(r.id), "period": [r.period_start.isoformat(), r.period_end.isoformat()],
                    "net_t_co2e": r.net_t_co2e, "reductions_t_co2e": r.reductions_t_co2e,
                    "removals_t_co2e": r.removals_t_co2e, "buffer_t_co2e": r.buffer_t_co2e,
                    "data_class": "CALCULATED"}
    return None


def _credits(db: Session, org_id: uuid.UUID, project_id: uuid.UUID) -> dict[str, float]:
    tot: dict[str, float] = defaultdict(float)
    for b in db.scalars(select(CreditBatch).where(CreditBatch.org_id == org_id,
                                                  CreditBatch.project_id == project_id)).all():
        if b.status == "cancelled":
            continue
        # provisional/verified batches come from approved results but are not registry-issued yet
        tot["issued" if b.status == "issued" else "pending_issuance"] += sum(issued_total(db, b.id).values())
        for states in balances(db, b.id).values():
            for k in ("available", "reserved", "sold", "retired", "buffer"):
                tot[k] += states.get(k, 0.0)
    return {k: round(tot.get(k, 0.0), 6)
            for k in ("issued", "pending_issuance", "available", "reserved", "sold", "retired", "buffer")}


def _payouts(db: Session, org_id: uuid.UUID, project_id: uuid.UUID) -> dict[str, Any]:
    rows = db.execute(
        select(Payout.status, func.count(), func.coalesce(func.sum(Payout.amount), 0))
        .join(PayoutBatch, PayoutBatch.id == Payout.batch_id)
        .join(BenefitPool, BenefitPool.id == PayoutBatch.pool_id)
        .join(Sale, Sale.id == BenefitPool.sale_id)
        .join(CreditBatch, CreditBatch.id == Sale.batch_id)
        .where(Payout.org_id == org_id, CreditBatch.project_id == project_id)
        .group_by(Payout.status)).all()
    by = {s: {"count": int(n), "amount": str(Decimal(str(a)).quantize(Decimal("0.01")))} for s, n, a in rows}
    return {"paid_amount": by.get("paid", {}).get("amount", "0.00"), "by_status": by}


def _enrolled(db: Session, org_id: uuid.UUID, project_id: uuid.UUID) -> tuple[list[Enrolment], dict[uuid.UUID, Field]]:
    ens = db.scalars(select(Enrolment).where(Enrolment.org_id == org_id, Enrolment.project_id == project_id,
                                             Enrolment.status == "enrolled")).all()
    fields = {f.id: f for f in db.scalars(select(Field).where(Field.id.in_([e.field_id for e in ens]))).all()} \
        if ens else {}
    return list(ens), fields


def project_summary(db: Session, user: CurrentUser, p: Project) -> dict[str, Any]:
    ens, fields = _enrolled(db, user.org_id, p.id)
    farmer_ids = {e.farmer_id for e in ens}
    samples = db.scalar(select(func.count()).select_from(Sample).join(Campaign, Campaign.id == Sample.campaign_id)
                        .where(Sample.org_id == user.org_id, Campaign.project_id == p.id)) or 0
    open_risks = db.scalar(select(func.count()).select_from(RiskEvent).where(
        RiskEvent.org_id == user.org_id, RiskEvent.project_id == p.id, RiskEvent.status != "resolved")) or 0
    open_grv = db.scalar(select(func.count()).select_from(Grievance).where(
        Grievance.org_id == user.org_id, Grievance.farmer_id.in_(farmer_ids or {uuid.uuid4()}),
        Grievance.status.not_in(("resolved", "closed")))) or 0
    out = {"id": str(p.id), "code": p.code, "name": p.name, "status": p.status,
           "methodology": f"{p.methodology_code} v{p.methodology_version}",
           "crediting_period": [p.crediting_start.isoformat() if p.crediting_start else None,
                                p.crediting_end.isoformat() if p.crediting_end else None],
           "farmers_enrolled": len(farmer_ids), "fields_enrolled": len(fields),
           "area_ha": round(sum(f.area_ha for f in fields.values()), 4), "samples": int(samples),
           "latest_approved_result": _latest_approved(db, user.org_id, p.id),
           "credits": _credits(db, user.org_id, p.id), "open_risk_events": int(open_risks),
           "open_grievances": int(open_grv)}
    if user.role not in FINANCE_HIDDEN_ROLES:
        out["payouts"] = _payouts(db, user.org_id, p.id)
    return out


def overview(db: Session, user: CurrentUser) -> dict[str, Any]:
    progs = db.scalars(scoped(Programme, user).order_by(Programme.code)).all()
    projects = db.scalars(scoped(Project, user).order_by(Project.code)).all()
    by_prog: dict[uuid.UUID, list[dict]] = defaultdict(list)
    for p in projects:
        by_prog[p.programme_id].append(project_summary(db, user, p))
    totals: dict[str, float] = defaultdict(float)
    for items in by_prog.values():
        for s in items:
            for k in ("farmers_enrolled", "fields_enrolled", "area_ha", "samples", "open_risk_events"):
                totals[k] += s[k]
            for k, v in s["credits"].items():
                totals[f"credits_{k}"] += v
            if "payouts" in s:
                totals["payouts_paid"] += float(s["payouts"]["paid_amount"])
    open_grv = db.scalar(select(func.count()).select_from(Grievance).where(
        Grievance.org_id == user.org_id, Grievance.status.not_in(("resolved", "closed")))) or 0
    t = {k: round(v, 4) for k, v in totals.items()}
    t["open_grievances"] = int(open_grv)
    if user.role in FINANCE_HIDDEN_ROLES:
        t.pop("payouts_paid", None)
    else:
        t["payouts_paid"] = f"{Decimal(str(totals.get('payouts_paid', 0))).quantize(Decimal('0.01'))}"
    return {"programmes": [{"id": str(g.id), "code": g.code, "name": g.name, "status": g.status,
                            "region": g.region, "projects": by_prog.get(g.id, [])} for g in progs],
            "totals": t, "pii_masked": masks_pii(user)}


def project_detail(db: Session, user: CurrentUser, project_id: str) -> dict[str, Any]:
    p = get_owned(db, Project, project_id, user, "Project")
    prog = db.get(Programme, p.programme_id)
    ens, fields = _enrolled(db, user.org_id, p.id)
    farmers = {f.id: f for f in db.scalars(select(Farmer).where(
        Farmer.id.in_([e.farmer_id for e in ens]))).all()} if ens else {}
    per_farmer: dict[uuid.UUID, dict[str, Any]] = {}
    for e in ens:
        f = fields.get(e.field_id)
        x = per_farmer.setdefault(e.farmer_id, {"farmer": farmer_public(user, farmers.get(e.farmer_id)),
                                                "fields": [], "area_ha": 0.0})
        if f:
            x["fields"].append({"code": f.code, "area_ha": f.area_ha, "crop_code": f.crop_code,
                                "enrolled_on": e.enrolled_on.isoformat() if e.enrolled_on else None})
            x["area_ha"] = round(x["area_ha"] + f.area_ha, 4)
    batches = db.scalars(scoped(CreditBatch, user).where(CreditBatch.project_id == p.id)
                         .order_by(CreditBatch.vintage)).all()
    return {"programme": {"id": str(prog.id), "code": prog.code, "name": prog.name} if prog else None,
            "project": project_summary(db, user, p),
            "credit_batches": [{"code": b.code, "vintage": b.vintage, "status": b.status,
                                "registry": b.registry_name, "serial_start": b.serial_start,
                                "serial_end": b.serial_end} for b in batches],
            "participants": sorted(per_farmer.values(), key=lambda x: x["farmer"]["code"] if x["farmer"] else ""),
            "pii_masked": masks_pii(user)}
