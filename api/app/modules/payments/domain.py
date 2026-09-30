"""Pure money logic for benefit sharing. All amounts are Decimal, rounded to paise."""

from __future__ import annotations

from decimal import ROUND_DOWN, ROUND_HALF_UP, Decimal
from typing import Any

CENT = Decimal("0.01")
WEIGHT_KEYS = ("area", "practices", "credits")


def money(v: Any) -> Decimal:
    return Decimal(str(v)).quantize(CENT, rounding=ROUND_HALF_UP)


def validate_weights(weights: dict[str, Any]) -> list[str]:
    errors = []
    if not weights:
        return ["Give at least one weight (area, practices or credits)."]
    unknown = sorted(set(weights) - set(WEIGHT_KEYS))
    if unknown:
        errors.append(f"Unknown weight(s): {', '.join(unknown)}. Use area, practices or credits.")
    try:
        vals = [float(v) for v in weights.values()]
    except (TypeError, ValueError):
        return errors + ["Weights must be numbers."]
    if any(v < 0 for v in vals):
        errors.append("Weights can't be negative.")
    if abs(sum(vals) - 1.0) > 1e-6:
        errors.append(f"Weights must add up to 1.0 (they add up to {sum(vals):g}).")
    return errors


def validate_deductions(deductions: list[dict[str, Any]]) -> list[str]:
    errors = []
    total = Decimal(0)
    for i, d in enumerate(deductions):
        if not isinstance(d, dict) or not str(d.get("name", "")).strip():
            errors.append(f"Deduction {i + 1} needs a name.")
            continue
        try:
            pct = Decimal(str(d.get("pct")))
        except Exception:
            errors.append(f"Deduction '{d.get('name')}' needs a percentage.")
            continue
        if pct < 0 or pct > 100:
            errors.append(f"Deduction '{d['name']}' must be between 0 and 100%.")
        total += pct
    if total > 100:
        errors.append("Deductions can't add up to more than 100% of the sale.")
    return errors


def pool_amounts(gross: Decimal, deductions: list[dict[str, Any]], share_pct: Decimal) -> dict[str, Any]:
    lines = []
    total = Decimal("0.00")
    for d in deductions:
        amt = money(gross * Decimal(str(d["pct"])) / 100)
        lines.append({"name": d["name"], "pct": str(Decimal(str(d["pct"]))), "amount": amt})
        total += amt
    net = gross - total
    pool = money(net * Decimal(str(share_pct)) / 100)
    return {"gross": gross, "deductions": lines, "deductions_total": money(total), "net": money(net), "farmer_pool": pool}


def allocate(pool: Decimal, scores: dict[str, Decimal]) -> dict[str, Decimal]:
    """Split ``pool`` by ``scores`` to the paisa. The sum always equals ``pool`` exactly.

    Each share is rounded down to the paisa; the leftover paise go one each to the largest
    fractional remainders (ties broken by key, so the result is deterministic)."""
    total = sum(scores.values(), Decimal(0))
    if total <= 0:
        raise ValueError("No positive scores to allocate by.")
    raw = {k: pool * s / total for k, s in scores.items()}
    floored = {k: v.quantize(CENT, rounding=ROUND_DOWN) for k, v in raw.items()}
    leftover = int(((pool - sum(floored.values(), Decimal(0))) / CENT).to_integral_value())
    order = sorted(raw, key=lambda k: (-(raw[k] - floored[k]), k))
    for k in order[:leftover]:
        floored[k] += CENT
    return floored


def scores(inputs: dict[str, dict[str, float]], weights: dict[str, float]) -> tuple[dict[str, Decimal], dict[str, dict]]:
    """Weighted share per farmer. A component whose total is zero is left out and the rest renormalised."""
    totals = {k: sum(Decimal(str(v.get(k, 0))) for v in inputs.values()) for k in weights}
    used = {k: Decimal(str(w)) for k, w in weights.items() if totals[k] > 0 and Decimal(str(w)) > 0}
    weight_sum = sum(used.values(), Decimal(0))
    out: dict[str, Decimal] = {}
    parts: dict[str, dict] = {}
    for fid, x in inputs.items():
        comp = {k: (Decimal(str(x.get(k, 0))) / totals[k]) for k in used}
        score = sum((used[k] / weight_sum) * comp[k] for k in used) if weight_sum > 0 else Decimal(0)
        out[fid] = score
        parts[fid] = {"component_shares": {k: float(round(v, 8)) for k, v in comp.items()},
                      "share": float(round(score, 10))}
    return out, {"totals": {k: float(v) for k, v in totals.items()},
                 "weights_used": {k: float(v / weight_sum) for k, v in used.items()} if weight_sum else {},
                 "per_farmer": parts}
