"""VM0042 v2.2 Appendix 6 — staged (multi-stage) sampling designs and their estimators (Eq. A6.1–A6.9).

Pure functions and frozen dataclasses: no database, no clock, no randomness.

Source: Verra VM0042 v2.2 (21 Oct 2025), Appendix 6 "Additional uncertainty examples", PDF pp. 159–165.
The example design (p. 159) has four stages:

1. landowners f = 1..F (all enrolled — a census at this stage; Eq. A6.1/A6.6/A6.8 sum over every f),
2. fields j = 1..k_f per landowner, drawn with probability proportional to size, with replacement,
3. within-field strata h = 1..H_fj,
4. points i = 1..n_fhj per stratum, simple random sampling with replacement.

Index conventions used throughout (the PDF text extraction loses sub/superscripts; this is how they are
read here, consistently with Eq. 62/68/70/71 that Appendix 6 generalises, pp. 68, 72, 76–77):

* ``f`` farmer/landowner (primary quantification unit), ``j`` field draw, ``h`` stratum, ``i`` point,
  ``l`` Monte Carlo draw, ``s``/``x`` start/final time of the verification period (A6.9, p. 164 note).
* ``A`` total project area, ``A_f`` landowner area, ``A_fj`` field area, ``A_fhj`` area of stratum h in field j.
* Field-level expansion (A6.1, p. 160; A6.4, p. 162; A6.9, p. 165)::

      Δ*_fj = (A_f / A_fj) · Σ_h (A_fhj / n_fhj) · Σ_i Δ_fhji

  i.e. the stratified estimate of the field total ``Σ_h A_fhj · mean_i(Δ_fhji)`` (t, from t/ha points)
  divided by the PPS selection probability ``p_fj = A_fj / A_f``. This is the Hansen–Hurwitz estimator
  of the landowner total. Where a design draws fields with equal probability the same estimator applies
  with ``p_fj = 1 / K_f`` (K_f fields of the landowner) — a documented generalisation, flagged in the trail.

Ambiguities resolved (each documented where implemented):

* A6.6 (p. 163) prints ``s²_sampling,f = A_f² / (k_f(k_f−1)) Σ(τ̂_fj − τ̂_f)²``. ``τ̂_fj`` is already a
  landowner total in t CO2e (A6.4), so the extra ``A_f²`` would give (t CO2e)²·ha², contradicting the stated
  unit (t CO2e)² and A6.7, which divides by A² to obtain the variance of a per-area mean. It is evidently
  carried over from Eq. 68 (where the point values are per hectare). This module uses
  ``1 / (k_f(k_f−1)) Σ(τ̂_fj − τ̂_f)²`` — the same form as A6.1 (p. 160) and A6.9 (p. 164).
* A6.9 covariance (p. 165) is extracted with a trailing ``²`` on the final bracket; Eq. 71 (p. 77), which
  A6.9 restates per farmer, has the plain cross-product. The cross-product is used.
* A6.8 (p. 164) labels the per-farmer term ``s²_ΔSOC,ht`` under "Where:" — a typo for ``s²_ΔSOC,ft``.

Extensions beyond the Appendix 6 example (needed so the platform's design metadata is complete; each is
flagged in the calculation trail so a verifier can see when one is used):

* **Fields measured in full (census of fields)** — the field stage then contributes no sampling variance and
  each (field, stratum) cell is an ordinary stratum: the Eq. 71 estimator (p. 77) per cell, summed. A
  single-stage census of fields therefore reduces exactly to the stratified Eq. 70–71 result.
* **Landowners sampled** (PPS or equal probability, with replacement) — the Hansen–Hurwitz (ultimate cluster)
  estimator is applied at stage 1 in the same form as A6.1/A6.9: ``z_g = T̂_g / p_g``,
  ``τ̂ = mean(z_g)``, ``s² = 1/(m(m−1)) Σ(z_g − z̄)²`` (Cochran 1977 §11.9; Som 1995 Ch. 10).
"""

from __future__ import annotations

import math
from collections import defaultdict
from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
from typing import Any

import numpy as np

from app.core.errors import Blocked, ValidationFailed

SELECTIONS: tuple[str, ...] = ("census", "pps_wr", "equal_wr")
STAGE1_UNITS: tuple[str, ...] = ("landowner", "farm", "field")
_REL_TOL = 1e-6

SELECTION_LABEL = {
    "census": "all measured (census)",
    "pps_wr": "probability proportional to size, with replacement",
    "equal_wr": "equal probability, with replacement",
}


def _bad(message: str, **details: Any) -> ValidationFailed:
    return ValidationFailed(message, code="INVALID_SAMPLING_DESIGN", details=details)


def _check_probability(p: float, what: str) -> float:
    if p is None or not (0.0 < float(p) <= 1.0 + 1e-12) or math.isnan(float(p)):
        raise _bad(f"The selection probability of {what} must be greater than 0 and at most 1.", unit=what,
                   probability=p)
    return min(float(p), 1.0)


def _hh_moments(values: Sequence[float]) -> tuple[float, float]:
    """Hansen–Hurwitz mean and variance of the mean: (ē, 1/(k(k−1)) Σ(e − ē)²). Needs k ≥ 2 for the variance."""
    e = np.asarray(values, float)
    k = len(e)
    mean = float(e.mean())
    var = float(np.sum((e - mean) ** 2) / (k * (k - 1))) if k >= 2 else float("nan")
    return mean, var


def _hh_cov(a: Sequence[float], b: Sequence[float]) -> float:
    """1/(k(k−1)) Σ(a − ā)(b − b̄) — the A6.9 covariance (p. 165) with the plain cross-product (see module doc)."""
    x, y = np.asarray(a, float), np.asarray(b, float)
    k = len(x)
    return float(np.sum((x - x.mean()) * (y - y.mean())) / (k * (k - 1)))


# =============================================================== QA1 — analytical (A6.1, A6.2)
@dataclass(frozen=True)
class Cell:
    """Stratum h inside field j: its area A_fhj (ha) and the point values (t CO2e/ha, or t C/ha)."""

    area_ha: float
    values: tuple[float, ...]
    code: str = ""


@dataclass(frozen=True)
class FieldSample:
    """One field draw j. ``probability`` None ⇒ the Appendix 6 PPS probability A_fj / A_f.
    A field drawn twice (with replacement) is listed twice."""

    key: str
    area_ha: float
    cells: tuple[Cell, ...]
    probability: float | None = None


@dataclass(frozen=True)
class FarmerSample:
    """Landowner f with total area A_f and the k_f field draws."""

    key: str
    area_ha: float
    fields: tuple[FieldSample, ...]


def field_probability(fs: FieldSample, farmer_area_ha: float) -> float:
    """p_fj: the recorded probability, or A_fj / A_f (PPS, Appendix 6 p. 159 stage 2)."""
    if fs.probability is not None:
        return _check_probability(fs.probability, f"field {fs.key}")
    if fs.area_ha <= 0 or farmer_area_ha <= 0:
        raise _bad(f"Field {fs.key} and its landowner need positive areas.", field=fs.key)
    return _check_probability(fs.area_ha / farmer_area_ha, f"field {fs.key}")


def stratified_field_total(cells: Sequence[Cell], key: str = "") -> float:
    """Σ_h (A_fhj / n_fhj) Σ_i y_fhji — the within-field stratified estimate of the field total."""
    total = 0.0
    for c in cells:
        if c.area_ha < 0:
            raise _bad(f"A stratum area in field {key} is negative.", field=key, stratum=c.code)
        if c.area_ha == 0:
            continue
        if not c.values:
            raise Blocked(f"Stratum {c.code or '?'} in field {key} has area but no sample points.",
                          code="MULTISTAGE_EMPTY_STRATUM", details={"field": key, "stratum": c.code})
        total += c.area_ha / len(c.values) * float(np.sum(c.values))
    return float(total)


def a6_1_field_estimate(fs: FieldSample, farmer_area_ha: float) -> float:
    """Eq. A6.1 (p. 160): Δ*_fj = (A_f / A_fj) Σ_h (A_fhj / n_fhj) Σ_i Δ_fhji  (t CO2e), generalised to 1/p_fj."""
    return stratified_field_total(fs.cells, fs.key) / field_probability(fs, farmer_area_ha)


def a6_1_farmer(fm: FarmerSample) -> dict[str, Any]:
    """Eq. A6.1 (p. 160) for one landowner: Δ*_f = (1/k_f) Σ_j Δ*_fj and
    s²_sampling,f = 1/(k_f(k_f−1)) Σ_j (Δ*_fj − Δ*_f)²  (t CO2e)²."""
    if len(fm.fields) < 2:
        raise Blocked(f"Landowner {fm.key} has {len(fm.fields)} field draw(s); the Appendix 6 estimator needs at "
                      "least 2 to estimate the sampling variance.", code="MULTISTAGE_TOO_FEW_DRAWS",
                      details={"unit": fm.key, "draws": len(fm.fields)})
    est = [a6_1_field_estimate(fs, fm.area_ha) for fs in fm.fields]
    mean, var = _hh_moments(est)
    return {"key": fm.key, "k": len(est), "field_estimates": est, "mean": mean, "s2_sampling": var,
            "df": len(est) - 1}


def a6_1(farmers: Sequence[FarmerSample]) -> dict[str, Any]:
    """Eq. A6.1 (p. 160): s²_sampling,Δ•,t = Σ_f s²_sampling,Δ•,f,t ; total Δ• = Σ_f Δ*_f (t CO2e)."""
    rows = [a6_1_farmer(f) for f in farmers]
    return {"farmers": rows, "total": float(sum(r["mean"] for r in rows)),
            "s2_sampling": float(sum(r["s2_sampling"] for r in rows))}


def a6_2(s2_sampling: float, total_area_ha: float, s2_model: float) -> float:
    """Eq. A6.2 (p. 161): s²_Δ̄• = s²_sampling / A² + s²_model  ((t CO2e/ha)²; s²_model already per area, as Eq. 63)."""
    if total_area_ha <= 0:
        raise _bad("The total project area must be positive.")
    if s2_model < 0 or s2_sampling < 0:
        raise _bad("Variances can't be negative.")
    return float(s2_sampling / total_area_ha**2 + s2_model)


# =============================================================== QA1 — Monte Carlo (A6.3–A6.7)
@dataclass(frozen=True)
class McCell:
    """Stratum h in field j with an (n_fhj × L) matrix of draws ỹ_fhjil (t CO2e/ha)."""

    area_ha: float
    draws: tuple[tuple[float, ...], ...]
    code: str = ""


@dataclass(frozen=True)
class McField:
    key: str
    area_ha: float
    cells: tuple[McCell, ...]
    probability: float | None = None


@dataclass(frozen=True)
class McFarmer:
    key: str
    area_ha: float
    fields: tuple[McField, ...]


def a6_3(z_bsl: Sequence[Sequence[float]], z_pr: Sequence[Sequence[float]]) -> tuple[tuple[float, ...], ...]:
    """Eq. A6.3 (p. 161): ỹ_fhjil = z̃_bsl,fhjil − z̃_pr,fhjil, per point (rows) and draw l (columns).

    Sign convention (pp. 161–162): z̃ are emissions to the atmosphere, so for SOC z̃ = −(predicted stock change)."""
    a, b = np.asarray(z_bsl, float), np.asarray(z_pr, float)
    if a.shape != b.shape or a.ndim != 2:
        raise _bad("Baseline and project draws must be matrices of the same shape (points × draws).")
    return tuple(tuple(float(v) for v in row) for row in (a - b))


def _mc_field_draws(fd: McField, farmer_area_ha: float, n_draws: int) -> np.ndarray:
    """τ̃_fjl = (A_f / A_fj) Σ_h (A_fhj / n_fhj) Σ_i ỹ_fhjil, for every l (A6.6, p. 163)."""
    p = field_probability(FieldSample(fd.key, fd.area_ha, (), fd.probability), farmer_area_ha)
    acc = np.zeros(n_draws)
    for c in fd.cells:
        if c.area_ha == 0:
            continue
        y = np.asarray(c.draws, float)
        if y.ndim != 2 or y.shape[0] == 0:
            raise Blocked(f"Stratum {c.code or '?'} in field {fd.key} has area but no sample points.",
                          code="MULTISTAGE_EMPTY_STRATUM", details={"field": fd.key, "stratum": c.code})
        if y.shape[1] != n_draws:
            raise _bad("Every point must have the same number of Monte Carlo draws L.", field=fd.key)
        acc += c.area_ha / y.shape[0] * y.sum(axis=0)
    return acc / p


def _n_draws(farmers: Sequence[McFarmer]) -> int:
    for fm in farmers:
        for fd in fm.fields:
            for c in fd.cells:
                if c.draws:
                    return len(c.draws[0])
    raise _bad("No Monte Carlo draws were supplied.")


def a6_4(farmers: Sequence[McFarmer], total_area_ha: float) -> dict[str, Any]:
    """Eq. A6.4 (p. 162): τ̂_fj = (A_f/A_fj) Σ_h (A_fhj/n_fhj) Σ_i (1/L) Σ_l ỹ_fhjil ; τ̂_f = (1/k_f) Σ_j τ̂_fj ;
    τ̂ = Σ_f τ̂_f ; μ̂ = τ̂ / A."""
    if total_area_ha <= 0:
        raise _bad("The total project area must be positive.")
    L = _n_draws(farmers)
    rows = []
    for fm in farmers:
        per_field = [_mc_field_draws(fd, fm.area_ha, L) for fd in fm.fields]
        tau_fj = [float(d.mean()) for d in per_field]  # mean over l commutes with the linear expansion
        rows.append({"key": fm.key, "k": len(tau_fj), "tau_fj": tau_fj, "tau_f": float(np.mean(tau_fj)),
                     "draws_fjl": per_field})
    tau = float(sum(r["tau_f"] for r in rows))
    return {"farmers": rows, "tau": tau, "mu": tau / total_area_ha, "L": L}


def a6_6(farmers: Sequence[McFarmer], total_area_ha: float) -> dict[str, Any]:
    """Eq. A6.5–A6.6 (pp. 162–163): Var̂(τ̂) = Σ_f s²_sampling,f + s²_model.

    * s²_sampling,f = 1/(k_f(k_f−1)) Σ_j (τ̂_fj − τ̂_f)²  (the printed extra A_f² is dropped — see module doc);
      this is Var(E[τ̂|s]), the sampling-design component of the A6.5 decomposition.
    * s²_model = 1/(L−1) Σ_l (τ̃_l − τ̂)², τ̃_l = Σ_f τ̃_fl, τ̃_fl = (1/k_f) Σ_j τ̃_fjl; this is E[Var(τ̂|s)]."""
    base = a6_4(farmers, total_area_ha)
    L = base["L"]
    if L < 2:
        raise _bad("At least two Monte Carlo draws are needed for the model variance.")
    s2_f = []
    tau_l = np.zeros(L)
    for r in base["farmers"]:
        if r["k"] < 2:
            raise Blocked(f"Landowner {r['key']} has {r['k']} field draw(s); at least 2 are needed.",
                          code="MULTISTAGE_TOO_FEW_DRAWS", details={"unit": r["key"], "draws": r["k"]})
        s2_f.append(_hh_moments(r["tau_fj"])[1])
        tau_l += np.mean(np.vstack(r["draws_fjl"]), axis=0)  # τ̃_fl
    s2_model = float(np.sum((tau_l - base["tau"]) ** 2) / (L - 1))
    s2_sampling = float(sum(s2_f))
    return {**{k: v for k, v in base.items() if k != "farmers"},
            "farmers": [{"key": r["key"], "k": r["k"], "tau_f": r["tau_f"], "tau_fj": r["tau_fj"],
                         "s2_sampling": v} for r, v in zip(base["farmers"], s2_f, strict=True)],
            "tau_l": [float(v) for v in tau_l], "s2_sampling": s2_sampling, "s2_model": s2_model,
            "var_tau": s2_sampling + s2_model,
            "decomposition": {"variance_of_conditional_expectation": s2_sampling,
                              "expected_conditional_variance": s2_model}}


def a6_7(farmers: Sequence[McFarmer], total_area_ha: float) -> dict[str, Any]:
    """Eq. A6.7 (p. 163): Var̂(μ̂) = Σ_f s²_sampling,f / A² + s²_model / A²  ((t CO2e/ha)²)."""
    r = a6_6(farmers, total_area_ha)
    a2 = total_area_ha**2
    return {**r, "var_mu": float(sum(f["s2_sampling"] for f in r["farmers"]) / a2 + r["s2_model"] / a2)}


# =============================================================== QA2 — design input (A6.8, A6.9)
@dataclass(frozen=True)
class DesignField:
    """A selected field: area A_fj, its stratum areas A_fhj (stratum code → ha), per-draw probability p_fj."""

    key: str
    area_ha: float
    stratum_areas_ha: Mapping[str, float]
    probability: float = 1.0
    draws: int = 1
    label: str = ""


@dataclass(frozen=True)
class DesignUnit:
    """A selected stage-1 unit (landowner/farm, or the whole project when fields are the first stage)."""

    key: str
    area_ha: float
    field_selection: str  # census | pps_wr | equal_wr
    fields: tuple[DesignField, ...]
    probability: float = 1.0
    draws: int = 1
    label: str = ""


@dataclass(frozen=True)
class MultiStageDesign:
    """A frozen multi-stage design as declared on the sampling side (see sampling.models.SamplingDesign)."""

    stage1_unit: str  # landowner | farm | field
    unit_selection: str  # census | pps_wr | equal_wr
    population_area_ha: float  # A
    units: tuple[DesignUnit, ...]
    site_fields: Mapping[str, str] = field(default_factory=dict)  # site id → field key
    design_id: str = ""
    version: int = 1


def describe(design: MultiStageDesign) -> str:
    if design.stage1_unit == "field":
        return f"fields ({SELECTION_LABEL[design.units[0].field_selection]}) → strata → points"
    sel2 = sorted({u.field_selection for u in design.units})
    return (f"{design.stage1_unit}s ({SELECTION_LABEL[design.unit_selection]}) → fields "
            f"({', '.join(SELECTION_LABEL[s] for s in sel2)}) → strata → points")


def validate_design(design: MultiStageDesign) -> None:
    """Structural checks the estimators rely on (the sampling module validates against the population)."""
    if design.unit_selection not in SELECTIONS:
        raise _bad(f"Unknown stage-1 selection “{design.unit_selection}”.")
    if design.population_area_ha is None or design.population_area_ha <= 0:
        raise _bad("The design's total project area must be positive.")
    if not design.units:
        raise _bad("The design selects no units.")
    seen_units, seen_fields = set(), set()
    for u in design.units:
        if u.key in seen_units:
            raise _bad(f"Unit {u.key} is listed twice; record repeated draws with “draws”.", unit=u.key)
        seen_units.add(u.key)
        if u.field_selection not in SELECTIONS:
            raise _bad(f"Unknown field selection “{u.field_selection}”.", unit=u.key)
        if u.draws < 1 or u.area_ha <= 0:
            raise _bad(f"Unit {u.key} needs at least one draw and a positive area.", unit=u.key)
        if design.unit_selection == "census" and (u.draws != 1 or abs(u.probability - 1.0) > 1e-12):
            raise _bad("Units measured in full (census) have one draw and probability 1.", unit=u.key)
        _check_probability(u.probability, f"unit {u.label or u.key}")
        if not u.fields:
            raise _bad(f"Unit {u.key} selects no fields.", unit=u.key)
        for f in u.fields:
            if f.key in seen_fields:
                raise _bad(f"Field {f.key} is listed twice.", field=f.key)
            seen_fields.add(f.key)
            if f.draws < 1 or f.area_ha <= 0:
                raise _bad(f"Field {f.label or f.key} needs at least one draw and a positive area.", field=f.key)
            if u.field_selection == "census" and (f.draws != 1 or abs(f.probability - 1.0) > 1e-12):
                raise _bad("Fields measured in full (census) have one draw and probability 1.", field=f.key)
            _check_probability(f.probability, f"field {f.label or f.key}")
            areas = dict(f.stratum_areas_ha)
            if not areas or any(a < 0 for a in areas.values()):
                raise _bad(f"Field {f.label or f.key} needs non-negative stratum areas.", field=f.key)
            if abs(sum(areas.values()) - f.area_ha) > _REL_TOL * max(1.0, f.area_ha):
                raise _bad(f"The stratum areas of field {f.label or f.key} must add up to the field area "
                           "(Σ_h A_fhj = A_fj).", field=f.key, field_area_ha=f.area_ha,
                           stratum_areas_ha=areas)


# =============================================================== QA2 — estimators (A6.8, A6.9)
@dataclass(frozen=True)
class UnitChange:
    key: str
    label: str
    field_selection: str
    k: int  # field draws (or fields, for a census)
    total_start_t: float
    total_final_t: float
    s2_start: float  # (t)²
    s2_final: float
    cov: float
    s2_change: float  # A6.9
    df: float
    probability: float
    draws: int
    eq: str


@dataclass(frozen=True)
class Qa2Change:
    """Project-level change in totals (t, same unit as the point values × ha) and its variance."""

    total_start_t: float
    total_final_t: float
    delta_t: float
    variance_t2: float  # Σ_f s²_ΔSOC,pr,f — the numerator of A6.8 for the project plots
    df: float
    df_components: tuple[tuple[float, float], ...]
    area_ha: float
    mean_delta_per_ha: float
    variance_mean_per_ha: float
    units: tuple[UnitChange, ...]
    unit_s2_start: float = 0.0  # stage-1 HH components (only when units are sampled)
    unit_s2_final: float = 0.0
    unit_cov: float = 0.0


def _welch(components: Sequence[tuple[float, float]]) -> float:
    total = sum(v for v, _ in components)
    if total <= 0:
        return float(min((d for _, d in components), default=0.0))
    denom = 0.0
    for v, d in components:
        if v <= 0:
            continue
        if d <= 0:
            return 0.0
        denom += v * v / d
    return float(total * total / denom) if denom > 0 else 0.0


def _cell_eq71(start: Mapping[str, float], final: Mapping[str, float], area: float, paired: bool,
               where: str) -> tuple[float, float, float, list[tuple[float, float]]]:
    """Eq. 71 (p. 77) for one (field, stratum) cell: s² = A²/(n(n−1)) Σ(y − ȳ)² at each time,
    COV = A²/(n(n−1)) Σ(s − s̄)(x − x̄) when the same points are re-measured."""
    a2 = area**2
    if paired:
        sites = sorted(set(start) & set(final))
        if set(start) != set(final):
            raise ValidationFailed(f"{where}: paired points must be measured at both times.",
                                   code="UNPAIRED_POINTS", details={"cell": where})
        n = len(sites)
        if n < 2:
            raise Blocked(f"{where} has {n} re-measured point(s); a field measured in full needs at least 2 per "
                          "stratum to estimate its variance (Eq. 71).", code="MULTISTAGE_TOO_FEW_POINTS",
                          details={"cell": where, "n": n})
        s = np.asarray([start[k] for k in sites], float)
        x = np.asarray([final[k] for k in sites], float)
        f = a2 / (n * (n - 1))
        s2s, s2x = f * float(np.sum((s - s.mean()) ** 2)), f * float(np.sum((x - x.mean()) ** 2))
        cov = f * float(np.sum((s - s.mean()) * (x - x.mean())))
        return s2s, s2x, cov, [(s2s + s2x - 2 * cov, float(n - 1))]
    out = []
    for vals in (start, final):
        n = len(vals)
        if n < 2:
            raise Blocked(f"{where} has {n} point(s) at one time; a field measured in full needs at least 2 per "
                          "stratum (Eq. 71).", code="MULTISTAGE_TOO_FEW_POINTS", details={"cell": where, "n": n})
        v = np.asarray(list(vals.values()), float)
        out.append((a2 / (n * (n - 1)) * float(np.sum((v - v.mean()) ** 2)), float(n - 1)))
    (s2s, dfs), (s2x, dfx) = out
    return s2s, s2x, 0.0, [(s2s, dfs), (s2x, dfx)]


def qa2_change(design: MultiStageDesign, start: Sequence[tuple[str, str, float]],
               final: Sequence[tuple[str, str, float]], paired: bool) -> Qa2Change:
    """Eq. A6.8–A6.9 (pp. 164–165) for the project plots.

    ``start``/``final`` are ``(site id, stratum code, value per ha)`` at t_start (s) and t_final (x). Per field
    draw j of unit f and time t::

        SOC*_ftj = (1/p_fj) Σ_h (A_fhtj / n_fhtj) Σ_i SOC_fhtji            (A6.9, p. 165; p_fj = A_fj/A_f for PPS)
        SOC*_ft  = (1/k_f) Σ_j SOC*_ftj
        s²_SOC,ft = 1/(k_f(k_f−1)) Σ_j (SOC*_ftj − SOC*_ft)²
        COV       = 1/(k_f(k_f−1)) Σ_j (SOC*_fsj − SOC*_fs)(SOC*_fxj − SOC*_fx)
        s²_ΔSOC,pr,f = s²_SOC,fx + s²_SOC,fs − 2 COV                         (A6.9)

    and ``Σ_f s²_ΔSOC,pr,f`` is the project-plot part of the A6.8 numerator (division by A² gives the variance of
    the per-hectare mean). The field-level covariance applies to independent point designs too — the same fields
    are visited at both times, so field-level estimates are correlated even when the points are new.
    """
    validate_design(design)
    fields_by_key: dict[str, tuple[DesignUnit, DesignField]] = {}
    for u in design.units:
        for f in u.fields:
            fields_by_key[f.key] = (u, f)
    # (field key, time) -> stratum -> site -> value
    data: dict[tuple[str, str], dict[str, dict[str, float]]] = defaultdict(lambda: defaultdict(dict))
    outside, wrong_stratum = [], []
    for t, pts in (("s", start), ("x", final)):
        for site, stratum, value in pts:
            fk = design.site_fields.get(site)
            if fk is None or fk not in fields_by_key:
                outside.append(site)
                continue
            if stratum not in fields_by_key[fk][1].stratum_areas_ha:
                wrong_stratum.append({"site": site, "field": fk, "stratum": stratum})
                continue
            data[(fk, t)][stratum][site] = float(value)
    if outside:
        raise Blocked(f"{len(set(outside))} sample point(s) lie in fields that the multi-stage design did not select. "
                      "Every measured point must belong to a selected field (VM0042 Appendix 6).",
                      code="MULTISTAGE_POINT_OUTSIDE_DESIGN", details={"sites": sorted(set(outside))[:50]})
    if wrong_stratum:
        raise Blocked("Some points are in a stratum the design has no area for in that field.",
                      code="MULTISTAGE_STRATUM_NOT_IN_FIELD", details={"points": wrong_stratum[:50]})

    def field_total(f: DesignField, t: str) -> float:
        cells = data.get((f.key, t), {})
        if not cells:
            raise Blocked(f"Selected field {f.label or f.key} has no measured points at "
                          f"{'the start' if t == 's' else 'the end'} of the period.",
                          code="MULTISTAGE_FIELD_NOT_SAMPLED", details={"field": f.key, "time": t})
        return stratified_field_total(
            [Cell(a, tuple(cells.get(h, {}).values()), h) for h, a in sorted(f.stratum_areas_ha.items())],
            f.label or f.key)

    units: list[UnitChange] = []
    comps: list[tuple[float, float]] = []
    for u in design.units:
        if u.field_selection == "census":
            ts = sum(field_total(f, "s") for f in u.fields)
            tx = sum(field_total(f, "x") for f in u.fields)
            s2s = s2x = cov = 0.0
            u_comps: list[tuple[float, float]] = []
            for f in u.fields:
                for h, a in sorted(f.stratum_areas_ha.items()):
                    if a == 0:
                        continue
                    cs, cx, cc, cp = _cell_eq71(data[(f.key, "s")].get(h, {}), data[(f.key, "x")].get(h, {}), a,
                                                paired, f"Stratum {h} in field {f.label or f.key}")
                    s2s, s2x, cov = s2s + cs, s2x + cx, cov + cc
                    u_comps.extend(cp)
            v = s2x + s2s - 2 * cov
            units.append(UnitChange(u.key, u.label, "census", len(u.fields), ts, tx, s2s, s2x, cov, v,
                                    _welch(u_comps), u.probability, u.draws, "Eq. A6.9 / Eq. 71 (fields in full)"))
            comps.extend(u_comps)
            continue
        es, ex = [], []
        for f in u.fields:
            p = _check_probability(f.probability, f"field {f.label or f.key}")
            vs, vx = field_total(f, "s") / p, field_total(f, "x") / p
            es.extend([vs] * f.draws)
            ex.extend([vx] * f.draws)
        k = len(es)
        ts, s2s = _hh_moments(es)
        tx, s2x = _hh_moments(ex)
        if k >= 2:
            cov = _hh_cov(es, ex)
            v = s2x + s2s - 2 * cov
        elif design.unit_selection == "census":
            raise Blocked(f"Unit {u.label or u.key} has {k} field draw; Appendix 6 needs at least 2 field draws per "
                          "landowner to estimate the sampling variance (Eq. A6.9).",
                          code="MULTISTAGE_TOO_FEW_DRAWS", details={"unit": u.key, "draws": k})
        else:  # ultimate-cluster: the stage-1 variance captures all later stages
            s2s = s2x = cov = v = 0.0
        eq = "Eq. A6.9" + ("" if u.field_selection == "pps_wr" else " (equal-probability draws)")
        units.append(UnitChange(u.key, u.label, u.field_selection, k, ts, tx, s2s, s2x, cov, v, float(k - 1),
                                u.probability, u.draws, eq))
        comps.append((v, float(k - 1)))

    area = float(design.population_area_ha)
    if design.unit_selection == "census":
        total_s = float(sum(x.total_start_t for x in units))
        total_x = float(sum(x.total_final_t for x in units))
        var = float(sum(x.s2_change for x in units))
        extra = {}
    else:
        zs, zx = [], []
        for uc, u in zip(units, design.units, strict=True):
            p = _check_probability(u.probability, f"unit {u.label or u.key}")
            zs.extend([uc.total_start_t / p] * u.draws)
            zx.extend([uc.total_final_t / p] * u.draws)
        m = len(zs)
        if m < 2:
            raise Blocked(f"The design has {m} stage-1 draw; at least 2 are needed to estimate the sampling variance.",
                          code="MULTISTAGE_TOO_FEW_DRAWS", details={"draws": m})
        total_s, us2s = _hh_moments(zs)
        total_x, us2x = _hh_moments(zx)
        ucov = _hh_cov(zs, zx)
        var = us2x + us2s - 2 * ucov
        comps = [(var, float(m - 1))]
        extra = {"unit_s2_start": us2s, "unit_s2_final": us2x, "unit_cov": ucov}
    delta = total_x - total_s
    return Qa2Change(total_s, total_x, delta, var, _welch(comps), tuple(comps), area, delta / area, var / area**2,
                     tuple(units), **extra)


# =============================================================== engine glue (QA2 step 3)
@dataclass(frozen=True)
class EngineQA2:
    """What the engine's QA2 step needs, in t C over the measurement interval."""

    area_ha: float
    wp_delta_t_c: float
    bsl_delta_t_c: float
    s2_total_t_c: float  # (t C)²: project plots (A6.9 summed) + control plots
    s2_wp_t_c: float
    s2_bsl_t_c: float
    df_components: tuple[tuple[float, float], ...]
    equations: tuple[tuple[str, str, float | None, str], ...]
    summary: dict[str, Any]


def engine_qa2(design: MultiStageDesign, project_results: Sequence[Any], control_results: Sequence[Any],
               paired: bool) -> EngineQA2:
    """Project plots by Appendix 6 (A6.8–A6.9); control plots keep their own (stratified, Eq. 71) estimator as
    Appendix 6 p. 164 requires when the two designs differ, area-weighted by the project strata (Eq. 70 note, p. 77).

    ``project_results`` / ``control_results`` are the engine's per-stratum results (point stocks on the common
    ESM basis). For paired designs, sites excluded as unpaired are left out at both times, as in Eq. 71."""
    start, final = [], []
    for r in project_results:
        excluded = set(r.excluded_sites)
        start.extend((p.site_id, r.code, p.stock_t_c_ha) for p in r.baseline_points if p.site_id not in excluded)
        final.extend((p.site_id, r.code, p.stock_t_c_ha) for p in r.monitoring_points if p.site_id not in excluded)
    ch = qa2_change(design, start, final, paired)
    area = ch.area_ha
    ctrl_by_code = {c.code: c for c in control_results}
    with_ctrl = [r for r in project_results if r.control_code]
    bsl_ha, bsl_comps = 0.0, []
    if with_ctrl:
        weight_total = float(sum(r.area_ha for r in project_results))
        for r in with_ctrl:
            c = ctrl_by_code[r.control_code]
            w = r.area_ha / weight_total
            bsl_ha += w * c.measured_delta_t_c_ha
            bsl_comps.append((w * w * c.measured_variance * area**2, float(c.measured_df)))
    s2_bsl = float(sum(v for v, _ in bsl_comps))
    comps = (*ch.df_components, *bsl_comps)
    s2 = ch.variance_t2 + s2_bsl
    rows: list[tuple[str, str, float | None, str]] = [
        ("App. 6", f"Multi-stage design: {describe(design)}", None, ""),
    ]
    for uc in ch.units:
        rows.append((uc.eq, f"s²_ΔSOC,pr,f unit {uc.label or uc.key} = s²_fx + s²_fs − 2 COV (k={uc.k})",
                     uc.s2_change, "(t C)²"))
    if design.unit_selection != "census":
        rows.append(("Eq. A6.8–A6.9 (stage 1 sampled, Hansen–Hurwitz)",
                     "s²_ΔSOC,pr across sampled units = s²_x + s²_s − 2 COV", ch.variance_t2, "(t C)²"))
    rows += [
        ("Eq. A6.9", "Project-plot SOC change, design-weighted total (interval)", ch.delta_t, "t C"),
        ("Eq. A6.8", "Σ_f s²_ΔSOC,pr,f (project plots)", ch.variance_t2, "(t C)²"),
    ]
    if with_ctrl:
        rows.append(("Eq. A6.8", "s²_ΔSOC,bsl control plots (stratified estimator, area-weighted)", s2_bsl, "(t C)²"))
    rows.append(("Eq. A6.8", "s²_ΔSOC mean = (Σ_f s²_ΔSOC,f) / A²", s2 / area**2, "(t C/ha)²"))
    summary = {
        "design_id": design.design_id, "version": design.version, "stage1_unit": design.stage1_unit,
        "stage1_selection": design.unit_selection, "description": describe(design),
        "estimator": "VM0042 v2.2 Appendix 6, Eq. A6.8–A6.9", "population_area_ha": area,
        "total_start_t_c": ch.total_start_t, "total_final_t_c": ch.total_final_t, "delta_t_c": ch.delta_t,
        "variance_project_t_c2": ch.variance_t2, "variance_control_t_c2": s2_bsl, "df": _welch(list(comps)),
        "units": [{"key": u.key, "label": u.label, "field_selection": u.field_selection, "k": u.k,
                   "probability": u.probability, "draws": u.draws, "total_start_t_c": u.total_start_t,
                   "total_final_t_c": u.total_final_t, "s2_start": u.s2_start, "s2_final": u.s2_final,
                   "cov": u.cov, "s2_change": u.s2_change, "df": u.df, "eq": u.eq} for u in ch.units],
    }
    return EngineQA2(area, ch.delta_t, area * bsl_ha, s2, ch.variance_t2, s2_bsl, tuple(comps), tuple(rows), summary)
