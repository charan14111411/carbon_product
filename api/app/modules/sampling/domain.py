"""Pure sampling logic: no database. Easy to test, same answer every time."""

from __future__ import annotations

import hashlib
import math
from collections.abc import Sequence
from dataclasses import dataclass
from datetime import UTC, date, datetime

from app.core.errors import IllegalTransition, ValidationFailed

DEPTH_TOLERANCE = 1e-6

# ------------------------------------------------------------------ campaign status
CAMPAIGN_FLOW: dict[str, str] = {"planned": "fieldwork", "fieldwork": "lab", "lab": "complete"}
CAMPAIGN_STATUSES = ("planned", "fieldwork", "lab", "complete")


def check_campaign_transition(current: str, new: str) -> None:
    if CAMPAIGN_FLOW.get(current) != new:
        allowed = CAMPAIGN_FLOW.get(current)
        raise IllegalTransition(
            f"A campaign that is {current} can't move to {new}."
            + (f" The next step is {allowed}." if allowed else " It is already complete."),
            details={"from": current, "to": new, "allowed": [allowed] if allowed else []},
        )


# ------------------------------------------------------------------ sample size
def z_for_confidence(confidence: float) -> float:
    from scipy.stats import norm

    return float(norm.ppf((1 + confidence) / 2))


def sample_size(prior_mean: float, prior_sd: float, target_error_pct: float, confidence: float = 0.90) -> tuple[int, float]:
    """n = ceil((z · sd / (e · mean))²), with e the target error as a fraction of the mean."""
    if prior_mean <= 0:
        raise ValidationFailed("The prior mean must be greater than zero.", code="INVALID_PLAN_INPUTS")
    if prior_sd < 0:
        raise ValidationFailed("The prior standard deviation can't be negative.", code="INVALID_PLAN_INPUTS")
    if not 0 < target_error_pct <= 100:
        raise ValidationFailed("The target error must be between 0 and 100 percent.", code="INVALID_PLAN_INPUTS")
    if not 0 < confidence < 1:
        raise ValidationFailed("Confidence must be between 0 and 1 (for example 0.90).", code="INVALID_PLAN_INPUTS")
    z = z_for_confidence(confidence)
    raw = (z * prior_sd / ((target_error_pct / 100.0) * prior_mean)) ** 2
    # Guard against float noise such as 4.000000000001 becoming 5.
    n = math.ceil(round(raw, 9))
    return max(n, 1), z


# ------------------------------------------------------------------ placement
def stratum_seed_offset(stratum_code: str) -> int:
    """A stable per-zone offset so each zone gets its own reproducible random stream."""
    return int.from_bytes(hashlib.sha256(stratum_code.encode("utf-8")).digest()[:4], "big") % (2**31)


def site_code(stratum_code: str, number: int) -> str:
    return f"ST-{stratum_code}-{number:03d}"


def campaign_token(kind: str, monitoring_ordinal: int | None = None) -> str:
    if kind == "baseline":
        return "BL"
    if not monitoring_ordinal or monitoring_ordinal < 1:
        raise ValueError("monitoring campaigns need an ordinal starting at 1")
    return f"M{monitoring_ordinal}"


def _add_years(d: date, n: int) -> date:
    try:
        return d.replace(year=d.year + n)
    except ValueError:  # 29 February in a non-leap year
        return d.replace(year=d.year + n, day=28)


def interval_years(start: date, end: date) -> float:
    """Calendar years between two dates: 1 Feb 2021 → 1 Feb 2024 is exactly 3.0."""
    if end < start:
        return -interval_years(end, start)
    whole = end.year - start.year
    if _add_years(start, whole) > end:
        whole -= 1
    anniversary = _add_years(start, whole)
    following = _add_years(start, whole + 1)
    return whole + (end - anniversary).days / (following - anniversary).days


# ------------------------------------------------------------------ layers
def layer_problems(layers: Sequence[tuple[float, float]], start_cm: float) -> list[str]:
    """Problems with a core's depth increments: must start at ``start_cm``, be contiguous, no overlaps."""
    problems: list[str] = []
    if not layers:
        return ["At least one soil layer is needed."]
    ordered = sorted(layers, key=lambda x: x[0])
    for f, t in ordered:
        if t <= f + DEPTH_TOLERANCE:
            problems.append(f"The layer {f:g}–{t:g} cm must end deeper than it starts.")
    if abs(ordered[0][0] - start_cm) > DEPTH_TOLERANCE:
        problems.append(f"The first layer must start at {start_cm:g} cm (it starts at {ordered[0][0]:g} cm).")
    for (f1, t1), (f2, _t2) in zip(ordered, ordered[1:]):
        if f2 > t1 + DEPTH_TOLERANCE:
            problems.append(f"There is a gap between {t1:g} cm and {f2:g} cm.")
        elif f2 < t1 - DEPTH_TOLERANCE:
            problems.append(f"The layers {f1:g}–{t1:g} cm and {f2:g} cm onwards overlap.")
    return problems


def coverage_to(layers: Sequence[tuple[float, float]]) -> float:
    return max((t for _f, t in layers), default=0.0)


# ------------------------------------------------------------------ custody
CUSTODY_ORDER = (
    "collected", "packed", "dispatched", "courier_received", "lab_received", "opened", "analysed", "archived",
)
CORRECTION = "correction"
CUSTODY_EVENTS = (*CUSTODY_ORDER, CORRECTION)


@dataclass(frozen=True)
class CustodyStep:
    id: str
    event: str
    occurred_at: datetime


def aware(dt: datetime) -> datetime:
    return dt if dt.tzinfo is not None else dt.replace(tzinfo=UTC)


def check_custody(
    chain: Sequence[CustodyStep],
    *,
    event: str,
    occurred_at: datetime,
    seal_intact: bool | None = None,
    count_matches: bool | None = None,
    notes: str = "",
    corrects_event_id: str | None = None,
) -> None:
    """Raise if ``event`` can't be appended to ``chain`` (which is in recorded order)."""
    if event not in CUSTODY_EVENTS:
        raise ValidationFailed(
            f"Unknown custody step “{event}”.", code="UNKNOWN_CUSTODY_EVENT", details={"allowed": list(CUSTODY_EVENTS)}
        )
    when = aware(occurred_at)
    if chain and when < max(aware(s.occurred_at) for s in chain):
        raise ValidationFailed(
            "This step is dated before an earlier step in the chain. Custody times can't go backwards.",
            code="CUSTODY_TIME_ORDER",
        )
    steps = [s for s in chain if s.event != CORRECTION]
    if event == CORRECTION:
        if not chain:
            raise IllegalTransition("There is nothing to correct yet.", code="CUSTODY_ORDER")
        if not corrects_event_id or corrects_event_id not in {s.id for s in chain}:
            raise ValidationFailed("A correction must name a step in this sample's custody chain.",
                                   code="CUSTODY_CORRECTION")
        if len((notes or "").strip()) < 5:
            raise ValidationFailed("Explain the correction in at least 5 characters.", code="CUSTODY_CORRECTION")
        return
    if corrects_event_id:
        raise ValidationFailed("Only a correction step may refer to another step.", code="CUSTODY_CORRECTION")
    if not steps:
        if event != "collected":
            raise IllegalTransition("The first custody step must be “collected”.", code="CUSTODY_ORDER")
        return
    done = {s.event for s in steps}
    if event in done:
        raise IllegalTransition(f"“{event}” has already been recorded for this sample.", code="CUSTODY_REPEAT")
    last_idx = max(CUSTODY_ORDER.index(s.event) for s in steps)
    idx = CUSTODY_ORDER.index(event)
    if idx <= last_idx:
        raise IllegalTransition(
            f"“{event}” can't come after “{CUSTODY_ORDER[last_idx]}”.", code="CUSTODY_ORDER",
            details={"last": CUSTODY_ORDER[last_idx]},
        )
    if event == "lab_received" and (seal_intact is None or count_matches is None):
        raise ValidationFailed(
            "When the lab receives a sample, record whether the seal was intact and the bag count matched.",
            code="CUSTODY_RECEIPT_CHECKS",
        )
    if event in ("opened", "analysed") and "lab_received" not in done:
        raise IllegalTransition(
            f"The lab must record receiving the sample before it is {event}.", code="CUSTODY_NOT_RECEIVED"
        )


def custody_status(chain: Sequence[CustodyStep]) -> str:
    steps = [s for s in chain if s.event != CORRECTION]
    if not steps:
        return "none"
    return max(steps, key=lambda s: CUSTODY_ORDER.index(s.event)).event
