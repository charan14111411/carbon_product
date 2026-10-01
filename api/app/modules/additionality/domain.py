"""Pure additionality rules (VM0042 v2.2 §7 p.17–19; VT0008 Steps 2 and 4c). No database."""

from __future__ import annotations

from typing import Any

COMMON_PRACTICE_THRESHOLD_PCT = 20.0  # §7: adoption < 20 % in the region; VT0008 4c: F < 20 %
BARRIER_TYPES = ("investment", "technological", "institutional", "other")
SOURCE_TYPES = ("census", "peer_reviewed", "research", "industry", "expert_attestation")
MIN_STATEMENT_CHARS = 20


def _crit(code: str, passed: bool | None, message: str, **details: Any) -> dict[str, Any]:
    return {"code": code, "status": "pass" if passed else "fail" if passed is False else "incomplete",
            "passed": bool(passed), "message": message, "details": details}


def regulatory_surplus(step: dict[str, Any]) -> dict[str, Any]:
    """Step 1: the practices are not required by law or regulation (VCS Standard regulatory surplus)."""
    statement = (step.get("statement") or "").strip()
    if not step or not statement:
        return _crit("regulatory_surplus", None, "Explain why the practices aren't required by any law or "
                                                 "regulation (regulatory surplus).")
    if step.get("legally_required") is True:
        return _crit("regulatory_surplus", False, "The practices are required by law, so the project isn't "
                                                  "regulatory surplus.")
    if len(statement) < MIN_STATEMENT_CHARS:
        return _crit("regulatory_surplus", None, f"The regulatory surplus statement needs at least "
                                                 f"{MIN_STATEMENT_CHARS} characters.")
    if step.get("legally_required") is None:
        return _crit("regulatory_surplus", None, "Say whether any law or regulation requires the practices.")
    if not step.get("evidence_ids"):
        return _crit("regulatory_surplus", None, "Attach evidence for regulatory surplus (e.g. a legal review).")
    return _crit("regulatory_surplus", True, "The practices are not required by law or regulation.")


def barrier_analysis(barriers: list[dict[str, Any]]) -> dict[str, Any]:
    """Step 2 (VT0008 Step 2): at least one documented barrier that the project activity overcomes."""
    if not barriers:
        return _crit("barrier_analysis", None, "Describe at least one barrier (investment, technological, "
                                               "institutional or other) with evidence.")
    problems = []
    for i, b in enumerate(barriers, 1):
        if b.get("type") not in BARRIER_TYPES:
            problems.append(f"Barrier {i}: type must be one of {', '.join(BARRIER_TYPES)}.")
        if len((b.get("description") or "").strip()) < MIN_STATEMENT_CHARS:
            problems.append(f"Barrier {i}: describe it in at least {MIN_STATEMENT_CHARS} characters.")
        if not b.get("evidence_ids"):
            problems.append(f"Barrier {i}: attach evidence.")
    if problems:
        return _crit("barrier_analysis", None, " ".join(problems), problems=problems)
    return _crit("barrier_analysis", True, f"{len(barriers)} documented barrier(s): "
                                           f"{', '.join(sorted({b['type'] for b in barriers}))}.")


def f_share(n_all_ha: float, n_diff_ha: float) -> float:
    """VT0008 Step 4c: F = 1 − N_diff / N_all (land-area basis)."""
    return 1.0 - n_diff_ha / n_all_ha


def _practice(p: dict[str, Any], i: int) -> dict[str, Any]:
    name = (p.get("practice") or "").strip() or f"Practice {i}"
    region = (p.get("region") or "").strip()
    out: dict[str, Any] = {"practice": name, "region": region, "adoption_pct": p.get("adoption_pct")}
    problems: list[str] = []
    if not region:
        problems.append("Name the region (state or province) the adoption rate applies to.")
    adoption = p.get("adoption_pct")
    needs_32 = adoption is None or adoption >= COMMON_PRACTICE_THRESHOLD_PCT
    if adoption is not None:
        src = p.get("source_type")
        if src not in SOURCE_TYPES:
            problems.append(f"Say where the adoption rate comes from ({', '.join(SOURCE_TYPES)}).")
        elif src == "expert_attestation":
            ex = p.get("expert") or {}
            missing = [k for k in ("name", "qualifications", "method", "attestation_evidence_id") if not ex.get(k)]
            if missing:
                problems.append("An expert attestation needs the expert's " + ", ".join(missing).replace("_", " ")
                                + ".")
        elif not p.get("evidence_ids"):
            problems.append("Attach the source of the adoption rate.")
    step32 = None
    if needs_32:
        ed = p.get("essential_distinction") or {}
        n_all, n_diff = ed.get("n_all_ha"), ed.get("n_diff_ha")
        text = (ed.get("description") or "").strip()
        if n_all is None or n_diff is None or not text:
            problems.append("Adoption is 20 % or more (or unknown): give the essential distinction with N_all "
                            "and N_diff in hectares (VT0008 Step 4c).")
        elif n_all <= 0 or n_diff < 0 or n_diff > n_all:
            problems.append("N_all must be more than 0 and N_diff between 0 and N_all.")
        else:
            f_pct = round(f_share(float(n_all), float(n_diff)) * 100, 9)  # rounded so 20 % is exactly 20 %
            step32 = {"n_all_ha": n_all, "n_diff_ha": n_diff, "f_pct": round(f_pct, 4),
                      "passed": f_pct < COMMON_PRACTICE_THRESHOLD_PCT, "essential_distinction": text}
    if problems:
        return {**out, "status": "incomplete", "passed": False, "step": "3.2" if needs_32 else "3.1",
                "problems": problems, "step32": step32}
    if not needs_32:
        return {**out, "status": "pass", "passed": True, "step": "3.1", "step32": None,
                "message": f"Adoption {adoption:g} % is below {COMMON_PRACTICE_THRESHOLD_PCT:g} %."}
    passed = step32["passed"]
    reason = "unknown" if adoption is None else f"{adoption:g} %"
    return {**out, "status": "pass" if passed else "fail", "passed": passed, "step": "3.2", "step32": step32,
            "message": (f"Adoption is {reason}; with the essential distinction F = {step32['f_pct']:g} % "
                        + ("is below" if passed else "is not below") + f" {COMMON_PRACTICE_THRESHOLD_PCT:g} %.")}


def common_practice(practices: list[dict[str, Any]]) -> dict[str, Any]:
    """Step 3: each individual or stacked practice is not common practice in its region."""
    if not practices:
        return _crit("common_practice", None, "Add the adoption rate of each practice (or stacked practice) in "
                                              "the region.", practices=[])
    rows = [_practice(p, i) for i, p in enumerate(practices, 1)]
    if any(r["status"] == "fail" for r in rows):
        bad = [r["practice"] for r in rows if r["status"] == "fail"]
        return _crit("common_practice", False, f"Common practice in the region: {', '.join(bad)}.", practices=rows)
    if any(r["status"] == "incomplete" for r in rows):
        return _crit("common_practice", None, "Some practices need more information.", practices=rows)
    return _crit("common_practice", True, "None of the practices is common practice in its region.", practices=rows)


def evaluate(regulatory: dict[str, Any], barriers: list[dict[str, Any]],
             practices: list[dict[str, Any]]) -> dict[str, Any]:
    steps = [regulatory_surplus(regulatory or {}), barrier_analysis(barriers or []), common_practice(practices or [])]
    complete = all(s["status"] != "incomplete" for s in steps)
    additional = all(s["passed"] for s in steps)
    reasons = [s["message"] for s in steps if not s["passed"]] or ["All three steps pass (VM0042 §7)."]
    return {"additional": additional, "complete": complete, "steps": steps, "reasons": reasons}
