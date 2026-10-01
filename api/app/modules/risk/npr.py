"""Non-permanence risk (NPR) worksheet, structured like the VCS AFOLU Non-Permanence Risk Tool.

This is a *structured worksheet*, not the tool itself. The analyst enters the score for every
factor exactly as read from the tool's tables (internal: project management, financial viability,
opportunity cost, project longevity; external: land/resource tenure, community engagement,
political risk; natural: one row per hazard with its likelihood, significance and the resulting
score, and any mitigation multiplier). Nothing is defaulted: a missing factor is an error.

The worksheet adds the scores the way the tool does (category totals are not allowed below zero;
overall = internal + external + natural; an overall below the tool minimum is raised to it; an
overall above the failure threshold fails the analysis). The result is advisory: the final NPR
percentage is entered and approved by a methodology owner who did not prepare the worksheet.
Check the constants below against the tool version named in ``TOOL_VERSION`` before relying on them.
"""

from __future__ import annotations

from typing import Any

TOOL_VERSION = "VCS AFOLU Non-Permanence Risk Tool v4.0"
INTERNAL_FACTORS = ("project_management", "financial_viability", "opportunity_cost", "project_longevity")
EXTERNAL_FACTORS = ("land_tenure", "community_engagement", "political")
MIN_RATING = 10.0  # tool minimum overall risk rating
FAIL_ABOVE = 60.0  # an overall rating above this fails the analysis


def _num(v: Any) -> float | None:
    if isinstance(v, bool):
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


def validate(inputs: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    for cat, names in (("internal", INTERNAL_FACTORS), ("external", EXTERNAL_FACTORS)):
        block = inputs.get(cat)
        if not isinstance(block, dict):
            errors.append(f"Enter the {cat} risk factors.")
            continue
        for n in names:
            if _num(block.get(n)) is None:
                errors.append(f"{cat.title()} risk: enter the score for {n.replace('_', ' ')}.")
        unknown = sorted(set(block) - set(names))
        if unknown:
            errors.append(f"{cat.title()} risk: unknown factor(s) {', '.join(unknown)}.")
    natural = inputs.get("natural")
    if not isinstance(natural, list) or not natural:
        errors.append("Enter at least one natural hazard (with its likelihood, significance and score).")
    else:
        for i, h in enumerate(natural):
            if not isinstance(h, dict) or not str(h.get("hazard", "")).strip():
                errors.append(f"Natural hazard {i + 1}: name the hazard.")
                continue
            for k in ("likelihood", "significance"):
                if h.get(k) in (None, ""):
                    errors.append(f"Natural hazard '{h['hazard']}': enter the {k}.")
            if _num(h.get("score")) is None:
                errors.append(f"Natural hazard '{h['hazard']}': enter the score from the tool's table.")
            m = h.get("mitigation", 1)
            if _num(m) is None or not 0 <= float(m) <= 1:
                errors.append(f"Natural hazard '{h['hazard']}': the mitigation multiplier must be between 0 and 1.")
    return errors


def compute(inputs: dict[str, Any]) -> dict[str, Any]:
    """Assumes ``validate(inputs)`` returned no errors."""
    internal = {n: float(inputs["internal"][n]) for n in INTERNAL_FACTORS}
    external = {n: float(inputs["external"][n]) for n in EXTERNAL_FACTORS}
    hazards = []
    for h in inputs["natural"]:
        score, mit = float(h["score"]), float(h.get("mitigation", 1))
        hazards.append({"hazard": h["hazard"], "likelihood": h["likelihood"], "significance": h["significance"],
                        "score": score, "mitigation": mit, "weighted": round(score * mit, 6)})
    it = max(0.0, sum(internal.values()))
    et = max(0.0, sum(external.values()))
    nt = max(0.0, sum(h["weighted"] for h in hazards))
    overall = round(it + et + nt, 6)
    return {
        "tool_version": TOOL_VERSION,
        "internal": {"factors": internal, "total": round(it, 6)},
        "external": {"factors": external, "total": round(et, 6)},
        "natural": {"hazards": hazards, "total": round(nt, 6)},
        "overall_score": overall,
        "advisory_rating_pct": max(MIN_RATING, overall),
        "minimum_rating_pct": MIN_RATING, "fail_above": FAIL_ABOVE, "fails": overall > FAIL_ABOVE,
        "note": "Structured worksheet following the tool's layout. The final NPR must be entered and approved "
                "by a methodology owner.",
        "data_class": "CALCULATED",
    }
