"""Partner API keys, the Partner API, webhooks and the outbox dispatcher, forecasts and the results assistant."""

from __future__ import annotations

import hashlib
import hmac
import json
import re
import secrets
import uuid
from collections.abc import Callable
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any
from urllib.parse import urlparse

from fastapi import Depends, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.config import get_settings
from app.core.db import get_db, utcnow
from app.core.errors import Forbidden, NotFound, Unauthorized, ValidationFailed
from app.core.events import emit
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.calculation.models import CalculationRun, RunStatusEvent
from app.modules.catalogue.models import PracticeType
from app.modules.land.models import Field
from app.modules.partners.models import EVENTS, ApiKey, DomainEvent, Webhook, WebhookDelivery
from app.modules.partners.schemas import PartnerPracticeIn, WebhookIn, WebhookPatch
from app.modules.practices.models import PracticeRecord
from app.modules.programmes.models import Project
from app.modules.verification.models import VerificationPackage

KEY_RE = re.compile(r"^vcp_([0-9a-f]{8})_([A-Za-z0-9_-]{20,})$")
MAX_ATTEMPTS = 8


def _sha(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


# ------------------------------------------------------------------ API keys
def key_out(k: ApiKey) -> dict[str, Any]:
    return {"id": str(k.id), "name": k.name, "prefix": k.prefix, "scopes": k.scopes, "is_active": k.is_active,
            "last_used_at": k.last_used_at.isoformat() if k.last_used_at else None,
            "created_at": k.created_at.isoformat()}


def create_key(db: Session, user: CurrentUser, name: str, scopes: list[str]) -> tuple[ApiKey, str]:
    prefix = secrets.token_hex(4)
    raw = f"vcp_{prefix}_{secrets.token_urlsafe(32)}"
    k = ApiKey(org_id=user.org_id, created_by=user.id, name=name, prefix=prefix, key_sha256=_sha(raw),
               scopes=sorted(set(scopes)), is_active=True)
    db.add(k)
    audit(db, user, "api_key.create", k)
    return k, raw


def revoke_key(db: Session, user: CurrentUser, key_id: str) -> ApiKey:
    k = get_owned(db, ApiKey, key_id, user, "API key")
    before = snapshot(k)
    k.is_active = False
    audit(db, user, "api_key.revoke", k, before=before)
    return k


@dataclass(frozen=True)
class PartnerContext:
    key_id: uuid.UUID
    org_id: uuid.UUID
    prefix: str
    scopes: frozenset[str]


def partner_key(request: Request, db: Session = Depends(get_db)) -> PartnerContext:
    raw = request.headers.get("x-api-key", "").strip()
    m = KEY_RE.match(raw)
    if not m:
        raise Unauthorized("Send a valid partner key in the X-API-Key header.", code="INVALID_API_KEY")
    k = db.scalar(select(ApiKey).where(ApiKey.key_sha256 == _sha(raw)))
    if k is None or not k.is_active or not hmac.compare_digest(k.prefix, m.group(1)):
        raise Unauthorized("This partner key is not valid or has been revoked.", code="INVALID_API_KEY")
    k.last_used_at = utcnow()
    return PartnerContext(k.id, k.org_id, k.prefix, frozenset(k.scopes or []))


def partner_scope(scope: str):
    def dep(ctx: PartnerContext = Depends(partner_key)) -> PartnerContext:
        if scope not in ctx.scopes:
            raise Forbidden(f"This key doesn't have the '{scope}' scope.", details={"needs": [scope]})
        return ctx

    return dep


# ------------------------------------------------------------------ Partner API
def _run_status(db: Session, run_id: uuid.UUID) -> str | None:
    ev = db.scalars(select(RunStatusEvent).where(RunStatusEvent.run_id == run_id)
                    .order_by(RunStatusEvent.created_at.desc())).first()
    return ev.status if ev else None


def approved_runs(db: Session, org_id: uuid.UUID, project_id: uuid.UUID) -> list[CalculationRun]:
    runs = db.scalars(select(CalculationRun).where(CalculationRun.org_id == org_id,
                                                   CalculationRun.project_id == project_id)
                      .order_by(CalculationRun.period_end)).all()
    return [r for r in runs if _run_status(db, r.id) == "approved"]


def _partner_project(db: Session, ctx: PartnerContext, project_id: str) -> Project:
    try:
        p = db.get(Project, uuid.UUID(project_id))
    except ValueError as exc:
        raise NotFound("Project not found.") from exc
    if p is None or p.org_id != ctx.org_id:
        raise NotFound("Project not found.")
    return p


def partner_projects(db: Session, ctx: PartnerContext) -> list[dict[str, Any]]:
    rows = db.scalars(select(Project).where(Project.org_id == ctx.org_id).order_by(Project.code)).all()
    return [{"id": str(p.id), "code": p.code, "name": p.name, "status": p.status} for p in rows]


def partner_results(db: Session, ctx: PartnerContext, project_id: str) -> dict[str, Any]:
    p = _partner_project(db, ctx, project_id)
    out = []
    for r in approved_runs(db, ctx.org_id, p.id):
        pkg = db.scalars(select(VerificationPackage).where(VerificationPackage.run_id == r.id)
                         .order_by(VerificationPackage.version.desc())).first()
        out.append({"run_id": str(r.id), "period_label": r.period_label, "period_start": r.period_start.isoformat(),
                    "period_end": r.period_end.isoformat(), "net_t_co2e": r.net_t_co2e,
                    "reductions_t_co2e": r.reductions_t_co2e, "removals_t_co2e": r.removals_t_co2e,
                    "package_sha256": pkg.sha256 if pkg else None, "data_class": "CALCULATED"})
    return {"project_id": str(p.id), "code": p.code, "results": out}


def partner_practice(db: Session, ctx: PartnerContext, body: PartnerPracticeIn) -> tuple[PracticeRecord, bool]:
    try:
        fld = db.get(Field, uuid.UUID(body.field_id))
    except ValueError:
        fld = None
    if fld is None or fld.org_id != ctx.org_id:
        raise NotFound("Field not found.")
    existing = db.scalars(select(PracticeRecord).where(PracticeRecord.org_id == ctx.org_id,
                                                       PracticeRecord.field_id == fld.id,
                                                       PracticeRecord.source == "partner")).all()
    for r in existing:
        if (r.details or {}).get("client_ref") == body.client_ref:
            return r, False
    pt = db.scalar(select(PracticeType).where(PracticeType.org_id == ctx.org_id,
                                              PracticeType.code == body.practice_code))
    if pt is None or not pt.is_active:
        raise ValidationFailed(f"'{body.practice_code}' is not an active practice in the catalogue.",
                               code="UNKNOWN_PRACTICE")
    if body.performed_on > datetime.now(UTC).date():
        raise ValidationFailed("A practice can't be recorded in the future.")
    if body.ended_on and body.ended_on < body.performed_on:
        raise ValidationFailed("The end date can't be before the start date.")
    if pt.requires_quantity and body.quantity is None:
        raise ValidationFailed(f"{pt.name} needs a quantity.", code="QUANTITY_REQUIRED")
    rec = PracticeRecord(
        org_id=ctx.org_id, created_by=None, record_id=uuid.uuid4(), version=1, field_id=fld.id,
        practice_code=pt.code, scenario=body.scenario, performed_on=body.performed_on, ended_on=body.ended_on,
        quantity=body.quantity, unit=body.unit or pt.unit, area_ha=body.area_ha,
        details={**body.details, "client_ref": body.client_ref, "api_key_prefix": ctx.prefix},
        evidence_ids=[], source="partner", status="active", reason="Recorded through the Partner API",
    )
    db.add(rec)
    audit(db, None, "practice.create", rec, org_id=ctx.org_id, reason=f"Partner API key {ctx.prefix}")
    emit(db, None, "practice.recorded", rec, {"field_id": fld.id, "practice_code": pt.code,
                                              "performed_on": body.performed_on, "source": "partner"})
    return rec, True


def practice_out(r: PracticeRecord) -> dict[str, Any]:
    return {"id": str(r.id), "record_id": str(r.record_id), "version": r.version, "field_id": str(r.field_id),
            "practice_code": r.practice_code, "scenario": r.scenario, "performed_on": r.performed_on.isoformat(),
            "ended_on": r.ended_on.isoformat() if r.ended_on else None, "quantity": r.quantity, "unit": r.unit,
            "area_ha": r.area_ha, "details": r.details, "source": r.source, "status": r.status,
            "data_class": "RECORDED"}


# ------------------------------------------------------------------ webhooks
def _check_url(url: str) -> str:
    u = urlparse(url)
    local = u.hostname in ("localhost", "127.0.0.1", "::1")
    if u.scheme == "https" and u.hostname:
        return url
    if u.scheme == "http" and local and not get_settings().is_production:
        return url
    raise ValidationFailed("Webhook addresses must use https:// (http is allowed only for localhost while testing).",
                           code="INSECURE_WEBHOOK_URL")


def _check_events(events: list[str]) -> list[str]:
    unknown = sorted(set(events) - set(EVENTS))
    if unknown:
        raise ValidationFailed(f"Unknown event(s): {', '.join(unknown)}.", code="UNKNOWN_EVENT",
                               details={"unknown": unknown, "known": list(EVENTS)})
    return sorted(set(events))


def webhook_out(w: Webhook, secret: bool = False) -> dict[str, Any]:
    out = {"id": str(w.id), "url": w.url, "events": w.events, "is_active": w.is_active, "description": w.description,
           "created_at": w.created_at.isoformat()}
    if secret:
        out["secret"] = w.secret
    return out


def _redacted(w: Webhook) -> dict[str, Any]:
    return {**snapshot(w), "secret": "[redacted]"}


def _audit_webhook(db: Session, user: CurrentUser, action: str, w: Webhook, before: dict | None = None) -> None:
    """Like ``audit`` but keeps the signing secret out of the immutable audit trail."""
    from app.modules.identity.models import AuditEntry

    db.flush()
    db.add(AuditEntry(org_id=user.org_id, created_by=user.id, action=action, entity_type="Webhook",
                      entity_id=str(w.id), before=before, after=_redacted(w)))


def create_webhook(db: Session, user: CurrentUser, body: WebhookIn) -> Webhook:
    w = Webhook(org_id=user.org_id, created_by=user.id, url=_check_url(body.url), events=_check_events(body.events),
                secret=secrets.token_hex(32), description=body.description, is_active=True)
    db.add(w)
    _audit_webhook(db, user, "webhook.create", w)
    return w


def update_webhook(db: Session, user: CurrentUser, webhook_id: str, body: WebhookPatch) -> Webhook:
    w = get_owned(db, Webhook, webhook_id, user, "Webhook")
    before = _redacted(w)
    if body.url is not None:
        w.url = _check_url(body.url)
    if body.events is not None:
        w.events = _check_events(body.events)
    if body.description is not None:
        w.description = body.description
    if body.is_active is not None:
        w.is_active = body.is_active
    _audit_webhook(db, user, "webhook.update", w, before=before)
    return w


Sender = Callable[[str, bytes, dict[str, str]], int]


def default_sender(url: str, body: bytes, headers: dict[str, str]) -> int:
    import httpx

    return httpx.post(url, content=body, headers=headers, timeout=5.0).status_code


def sign(secret: str, body: bytes) -> str:
    return "sha256=" + hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest()


def event_body(ev: DomainEvent) -> bytes:
    return json.dumps({"id": str(ev.id), "event": ev.event, "entity_type": ev.entity_type, "entity_id": ev.entity_id,
                       "payload": ev.payload, "occurred_at": ev.created_at.isoformat(), "org_id": str(ev.org_id)},
                      sort_keys=True, separators=(",", ":")).encode("utf-8")


def dispatch_pending(db: Session, sender: Sender | None = None, *, org_id: uuid.UUID | None = None,
                     limit: int = 500) -> dict[str, int]:
    """Deliver every undelivered outbox event to each subscribed, active webhook.

    A webhook receives events raised after it was created. Each attempt is a new
    ``WebhookDelivery`` row; after ``MAX_ATTEMPTS`` failures an event is no longer retried."""
    sender = sender or default_sender
    stats = {"attempted": 0, "delivered": 0, "failed": 0, "gave_up": 0}
    q = select(Webhook).where(Webhook.is_active == True)
    if org_id:
        q = q.where(Webhook.org_id == org_id)
    for hook in db.scalars(q.order_by(Webhook.created_at)).all():
        events = db.scalars(select(DomainEvent).where(
            DomainEvent.org_id == hook.org_id, DomainEvent.event.in_(hook.events or []),
            DomainEvent.created_at >= hook.created_at).order_by(DomainEvent.created_at).limit(limit)).all()
        for ev in events:
            prior = db.scalars(select(WebhookDelivery).where(WebhookDelivery.webhook_id == hook.id,
                                                             WebhookDelivery.event_id == ev.id)).all()
            if any(d.ok for d in prior):
                continue
            if len(prior) >= MAX_ATTEMPTS:
                stats["gave_up"] += 1
                continue
            body = event_body(ev)
            attempt = len(prior) + 1
            headers = {"Content-Type": "application/json", "X-Event-Id": str(ev.id), "X-Event-Type": ev.event,
                       "X-Signature": sign(hook.secret, body), "X-Attempt": str(attempt)}
            code: int | None = None
            error = None
            try:
                code = int(sender(hook.url, body, headers))
            except Exception as exc:  # network errors are recorded, never raised
                error = f"{type(exc).__name__}: {exc}"[:500]
            ok = code is not None and 200 <= code < 300
            if not ok and error is None:
                error = f"Receiver answered HTTP {code}."
            db.add(WebhookDelivery(org_id=hook.org_id, webhook_id=hook.id, event_id=ev.id, status_code=code, ok=ok,
                                   attempt=attempt, error=error))
            stats["attempted"] += 1
            stats["delivered" if ok else "failed"] += 1
    db.flush()
    return stats


def deliveries(db: Session, user: CurrentUser, webhook_id: str) -> list[dict[str, Any]]:
    w = get_owned(db, Webhook, webhook_id, user, "Webhook")
    rows = db.scalars(select(WebhookDelivery).where(WebhookDelivery.webhook_id == w.id)
                      .order_by(WebhookDelivery.created_at.desc()).limit(200)).all()
    return [{"id": str(d.id), "event_id": str(d.event_id), "attempt": d.attempt, "ok": d.ok,
             "status_code": d.status_code, "error": d.error, "at": d.created_at.isoformat()} for d in rows]


def recent_events(db: Session, user: CurrentUser, event: str | None, limit: int) -> list[dict[str, Any]]:
    q = scoped(DomainEvent, user).order_by(DomainEvent.created_at.desc()).limit(max(1, min(limit, 500)))
    if event:
        q = q.where(DomainEvent.event == event)
    return [{"id": str(e.id), "event": e.event, "entity_type": e.entity_type, "entity_id": e.entity_id,
             "payload": e.payload, "at": e.created_at.isoformat()} for e in db.scalars(q).all()]


# ------------------------------------------------------------------ forecast
def forecast(db: Session, user: CurrentUser, project_id: str, years: int) -> dict[str, Any]:
    if not 1 <= years <= 20:
        raise ValidationFailed("Forecast between 1 and 20 years.")
    project = get_owned(db, Project, project_id, user, "Project")
    runs = approved_runs(db, user.org_id, project.id)
    base = {"project_id": str(project.id), "data_class": "MODELLED",
            "note": "A projection from past approved results, not a promise of future credits."}
    if not runs:
        return {**base, "method": None, "history": [], "years": [],
                "message": "There are no approved results yet, so no forecast can be made."}
    hist = []
    for r in runs:
        days = max(1, (r.period_end - r.period_start).days + 1)
        annual = r.net_t_co2e * 365.25 / days
        rel = (r.uncertainty_deduction_t_co2e / r.gross_t_co2e) if r.gross_t_co2e and r.gross_t_co2e > 0 else 0.0
        hist.append({"run_id": str(r.id), "year": r.period_end.year, "annualised_net_t_co2e": round(annual, 4),
                     "relative_uncertainty": round(rel, 4)})
    xs = [h["year"] for h in hist]
    ys = [h["annualised_net_t_co2e"] for h in hist]
    n = len(xs)
    if n >= 2 and len(set(xs)) >= 2:
        mx, my = sum(xs) / n, sum(ys) / n
        slope = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs)
        intercept = my - slope * mx
        method = "linear trend of annualised net"
    else:
        slope, intercept = 0.0, sum(ys) / n
        method = "flat: average annualised net (one period of history)"
    resid_sd = 0.0
    if n >= 3:
        res = [y - (intercept + slope * x) for x, y in zip(xs, ys)]
        resid_sd = (sum(e * e for e in res) / (n - 2)) ** 0.5
    rel_unc = sum(h["relative_uncertainty"] for h in hist) / n
    last = max(xs)
    out = []
    for y in range(last + 1, last + 1 + years):
        proj = max(0.0, intercept + slope * y)
        spread = proj * rel_unc + resid_sd
        out.append({"year": y, "projected_t_co2e": round(proj, 3), "low_t_co2e": round(max(0.0, proj - spread), 3),
                    "high_t_co2e": round(proj + spread, 3)})
    return {**base, "method": method, "slope_t_per_year": round(slope, 4), "relative_uncertainty": round(rel_unc, 4),
            "residual_sd_t": round(resid_sd, 4), "history": hist, "years": out}


# ------------------------------------------------------------------ assistant (rule-based, no LLM)
def _num(v: Any) -> str:
    return f"{v:,.3f}".rstrip("0").rstrip(".") if isinstance(v, (int, float)) else str(v)


def _find_samples(obj: Any, path: str = "") -> list[str]:
    found: list[str] = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            here = f"{path}.{k}" if path else k
            if "sample" in k.lower() and isinstance(v, list):
                for item in v:
                    if isinstance(item, dict):
                        code = item.get("code") or item.get("sample_code") or item.get("sample_id") or item.get("id")
                        if code:
                            found.append(str(code))
                    elif isinstance(item, (str, int)):
                        found.append(str(item))
            else:
                found.extend(_find_samples(v, here))
    elif isinstance(obj, list):
        for item in obj:
            found.extend(_find_samples(item, path))
    return list(dict.fromkeys(found))


def _rule_values(rules_snapshot: dict) -> tuple[dict[str, Any], dict[str, str], str | None]:
    if isinstance(rules_snapshot.get("values"), dict):
        return rules_snapshot["values"], rules_snapshot.get("sources") or {}, rules_snapshot.get("methodology")
    return {k: v for k, v in rules_snapshot.items() if not isinstance(v, (dict, list))}, {}, None


def ask(db: Session, user: CurrentUser, question: str, run_id: str | None) -> dict[str, Any]:
    q = question.lower()
    intent = None
    if re.search(r"\bsamples?\b|\bcores?\b", q):
        intent = "samples"
    elif re.search(r"deduct|buffer|uncertaint|why was", q):
        intent = "deductions"
    elif re.search(r"\brules?\b|methodolog|parameter|factor", q):
        intent = "rules"
    elif re.search(r"come from|where did|how (was|is|did)|calculat|net|number|result|total", q):
        intent = "numbers"
    base = {"question": question, "run_id": run_id, "method": "rule-based lookup of the saved calculation (no AI model)"}
    if intent is None:
        return {**base, "answered": False, "intent": None, "citations": [],
                "answer": "I can't answer that from the recorded data. I can explain where a result came from, "
                          "why deductions were made, which samples were used and which rules applied."}
    if not run_id:
        return {**base, "answered": False, "intent": intent, "citations": [],
                "answer": "Tell me which calculation run you mean (run_id) and I'll answer from its saved record."}
    run = get_owned(db, CalculationRun, run_id, user, "Calculation run")
    status = _run_status(db, run.id)
    cite_run = {"type": "calculation_run", "id": str(run.id), "snapshot_sha256": run.snapshot_sha256}
    values, sources, methodology = _rule_values(run.rules_snapshot or {})

    if intent == "numbers":
        parts = [f"The net result of {_num(run.net_t_co2e)} t CO2e for {run.period_label} "
                 f"({run.period_start.isoformat()} to {run.period_end.isoformat()}) comes from calculation run "
                 f"{run.id}, status {status or 'unknown'}.",
                 f"Gross change {_num(run.gross_t_co2e)} t, minus the uncertainty deduction "
                 f"{_num(run.uncertainty_deduction_t_co2e)} t, minus the buffer {_num(run.buffer_t_co2e)} t."]
        expected = run.gross_t_co2e - run.uncertainty_deduction_t_co2e - run.buffer_t_co2e
        if abs(expected - run.net_t_co2e) > 1e-6:
            parts.append(f"Note: those three figures give {_num(expected)} t, not the recorded net; the run's "
                         "saved results should be checked for other terms.")
        parts.append(f"Of the net, reductions are {_num(run.reductions_t_co2e)} t and removals "
                     f"{_num(run.removals_t_co2e)} t. It used engine {run.engine_version}"
                     + (f" and rules {methodology}." if methodology else "."))
        scalars = {k: v for k, v in (run.results or {}).items() if isinstance(v, (int, float))}
        if scalars:
            parts.append("Saved results: " + ", ".join(f"{k} = {_num(v)}" for k, v in list(scalars.items())[:10]) + ".")
        cites = [cite_run, {"type": "rule_pack", "id": str(run.rule_pack_id)},
                 {"type": "campaign", "id": str(run.baseline_campaign_id), "role": "baseline"},
                 {"type": "campaign", "id": str(run.monitoring_campaign_id), "role": "monitoring"}]
        return {**base, "answered": True, "intent": intent, "answer": " ".join(parts), "citations": cites}

    if intent == "deductions":
        related = {k: v for k, v in values.items() if re.search(r"buffer|uncertaint|confidence|deduct", k)}
        parts = [f"Two deductions were made from the gross {_num(run.gross_t_co2e)} t: an uncertainty deduction of "
                 f"{_num(run.uncertainty_deduction_t_co2e)} t and a buffer (non-permanence) contribution of "
                 f"{_num(run.buffer_t_co2e)} t."]
        if related:
            parts.append("The rules that set them: " + "; ".join(
                f"{k} = {_num(v)}" + (f" (source: {sources[k]})" if sources.get(k) else "") for k, v in related.items())
                + ".")
        else:
            parts.append("The saved rules don't name the buffer or uncertainty rules, so I can't say which values "
                         "set these deductions.")
        cites = [cite_run] + [{"type": "rule", "key": k, "source": sources.get(k)} for k in related]
        return {**base, "answered": True, "intent": intent, "answer": " ".join(parts), "citations": cites}

    if intent == "samples":
        codes = _find_samples(run.inputs_snapshot or {})
        if not codes:
            return {**base, "answered": False, "intent": intent, "citations": [cite_run],
                    "answer": "The saved inputs of this run don't list individual samples, so I can't say which "
                              "samples were used."}
        shown = ", ".join(codes[:25]) + (f" and {len(codes) - 25} more" if len(codes) > 25 else "")
        return {**base, "answered": True, "intent": intent, "citations": [cite_run] + [
            {"type": "sample", "ref": c} for c in codes],
                "answer": f"This run used {len(codes)} samples, as saved in its inputs: {shown}."}

    if not values:
        return {**base, "answered": False, "intent": intent, "citations": [cite_run],
                "answer": "The saved rules snapshot of this run is empty, so I can't list the rules."}
    listed = "; ".join(f"{k} = {_num(v) if not isinstance(v, (list, dict)) else json.dumps(v)}"
                       + (f" ({sources[k]})" if sources.get(k) else "") for k, v in sorted(values.items()))
    return {**base, "answered": True, "intent": intent,
            "answer": f"This run applied {len(values)} approved rules" + (f" from {methodology}" if methodology else "")
                      + f": {listed}.",
            "citations": [cite_run, {"type": "rule_pack", "id": str(run.rule_pack_id)}]
                         + [{"type": "rule", "key": k, "source": sources.get(k)} for k in sorted(values)]}
