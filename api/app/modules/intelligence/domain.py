"""Pure logic for the intelligence module: practice heuristics and the SOC ridge model.

Nothing here touches the database, so every number can be reproduced from its inputs.
"""

from __future__ import annotations

import hashlib
import statistics
from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Any

import numpy as np

Series = list[tuple[date, float]]

# ------------------------------------------------------------------ informing wall
INFORMING_WALL_REASON = ("VM0042 v2.2 Appendix 4 fn.59 / §8.2.1.4: remote-sensing SOC only via VT0014 "
                         "digital soil mapping")


def wall(data_class: str, reason: str | None = None) -> dict[str, Any]:
    """Labels every intelligence output: what kind of value it is and that it is not creditable.
    Intelligence informs sampling, QA and context; credited SOC comes only from measured lab results
    (or a VT0014-validated digital soil map, which this platform does not implement)."""
    return {"data_class": data_class, "credit_eligible": False,
            "credit_eligible_reason": reason or INFORMING_WALL_REASON}

# ------------------------------------------------------------------ practice heuristics
COVER_CROP_NDVI = 0.35
BARE_SOIL_NDVI = 0.15
SHARP_DROP = 0.10
RESIDUE_MIN_NDVI = 0.18
RESIDUE_MIN_NDMI = -0.20
AWD_AMPLITUDE = 0.12

TILLAGE_CODES = ("zero_tillage", "reduced_tillage")
CHECKED_CODES = ("cover_crop", "residue_retention", "awd_irrigation", *TILLAGE_CODES)


@dataclass
class Check:
    detected: bool | None  # None = not enough clear observations
    confidence: float
    evidence: dict[str, Any] = field(default_factory=dict)

    @property
    def outcome_if_reported(self) -> str:
        if self.detected is None:
            return "inconclusive"
        return "confirmed" if self.detected else "mismatch"


def _in(series: Series, start: date, end: date) -> Series:
    return sorted((d, v) for d, v in series if start <= d <= end)


def _confidence(margin: float, n: int) -> float:
    return round(min(0.95, 0.5 + min(0.3, abs(margin) * 1.5) + min(0.15, 0.03 * n)), 3)


def _window_evidence(start: date, end: date, pts: Series) -> dict[str, Any]:
    return {"window": [start.isoformat(), end.isoformat()], "clear_observations": len(pts),
            "values": [[d.isoformat(), round(v, 4)] for d, v in pts]}


def check_cover_crop(ndvi: Series, start: date, end: date) -> Check:
    """Detected when the median clear NDVI during the fallow window is above 0.35."""
    pts = _in(ndvi, start, end)
    ev = {"rule": f"median NDVI in fallow window > {COVER_CROP_NDVI}", **_window_evidence(start, end, pts)}
    if len(pts) < 2:
        return Check(None, 0.2, {**ev, "reason": "Fewer than 2 clear observations in the window."})
    med = statistics.median(v for _, v in pts)
    ev["median_ndvi"] = round(med, 4)
    return Check(med > COVER_CROP_NDVI, _confidence(med - COVER_CROP_NDVI, len(pts)), ev)


def check_no_tillage(ndvi: Series, start: date, end: date) -> Check:
    """Detected (no tillage) when there is no sharp dip to bare soil (NDVI < 0.15 after a drop ≥ 0.10)."""
    pts = _in(ndvi, start, end)
    ev = {"rule": f"no drop of ≥ {SHARP_DROP} to NDVI < {BARE_SOIL_NDVI}", **_window_evidence(start, end, pts)}
    if len(pts) < 3:
        return Check(None, 0.2, {**ev, "reason": "Fewer than 3 clear observations around the operation."})
    dips = [
        {"date": pts[i][0].isoformat(), "ndvi": round(pts[i][1], 4), "drop": round(pts[i - 1][1] - pts[i][1], 4)}
        for i in range(1, len(pts))
        if pts[i][1] < BARE_SOIL_NDVI and pts[i - 1][1] - pts[i][1] >= SHARP_DROP
    ]
    min_v = min(v for _, v in pts)
    ev.update({"min_ndvi": round(min_v, 4), "bare_soil_dips": dips})
    margin = (min_v - BARE_SOIL_NDVI) if not dips else max(d["drop"] for d in dips)
    return Check(not dips, _confidence(margin, len(pts)), ev)


def check_residue(ndvi: Series, ndmi: Series, start: date, end: date) -> Check:
    """Detected when the soil never shows bare / burnt (NDVI ≥ 0.18 and NDMI > −0.20)."""
    pts = _in(ndvi, start, end)
    mpts = _in(ndmi, start, end)
    ev = {"rule": f"min NDVI ≥ {RESIDUE_MIN_NDVI} and min NDMI > {RESIDUE_MIN_NDMI}",
          **_window_evidence(start, end, pts)}
    if len(pts) < 2:
        return Check(None, 0.2, {**ev, "reason": "Fewer than 2 clear observations after harvest."})
    min_v = min(v for _, v in pts)
    min_m = min((v for _, v in mpts), default=None)
    ev.update({"min_ndvi": round(min_v, 4), "min_ndmi": None if min_m is None else round(min_m, 4)})
    ok = min_v >= RESIDUE_MIN_NDVI and (min_m is None or min_m > RESIDUE_MIN_NDMI)
    return Check(ok, _confidence(min_v - RESIDUE_MIN_NDVI, len(pts)), ev)


def check_awd(ndmi: Series, start: date, end: date) -> Check:
    """Detected when NDMI oscillates (p90 − p10 amplitude > 0.12): repeated wetting and drying."""
    pts = _in(ndmi, start, end)
    ev = {"rule": f"NDMI p90 − p10 > {AWD_AMPLITUDE}", **_window_evidence(start, end, pts)}
    if len(pts) < 4:
        return Check(None, 0.2, {**ev, "reason": "Fewer than 4 clear observations in the irrigation window."})
    vals = np.array([v for _, v in pts])
    amp = float(np.percentile(vals, 90) - np.percentile(vals, 10))
    diffs = np.sign(np.diff(vals))
    turns = int(np.sum(diffs[1:] * diffs[:-1] < 0)) if len(diffs) > 1 else 0
    ev.update({"amplitude": round(amp, 4), "direction_changes": turns})
    return Check(amp > AWD_AMPLITUDE, _confidence(amp - AWD_AMPLITUDE, len(pts)), ev)


def practice_window(code: str, performed_on: date, ended_on: date | None) -> tuple[date, date]:
    if code in TILLAGE_CODES:
        return performed_on - timedelta(days=30), performed_on + timedelta(days=30)
    if code == "residue_retention":
        return performed_on, ended_on or performed_on + timedelta(days=45)
    return performed_on, ended_on or performed_on + timedelta(days=90)


def run_check(code: str, ndvi: Series, ndmi: Series, start: date, end: date) -> Check:
    if code == "cover_crop":
        return check_cover_crop(ndvi, start, end)
    if code in TILLAGE_CODES:
        return check_no_tillage(ndvi, start, end)
    if code == "residue_retention":
        return check_residue(ndvi, ndmi, start, end)
    if code == "awd_irrigation":
        return check_awd(ndmi, start, end)
    raise KeyError(code)


# ------------------------------------------------------------------ ridge regression
SOC_FEATURES = ("ndvi_mean", "ndmi_mean", "rain_365d", "temp_mean", "elevation_m", "clay_pct", "practice_count")
Z90 = 1.645


@dataclass
class Ridge:
    means: np.ndarray
    sds: np.ndarray
    coef: np.ndarray  # on standardised features
    intercept: float
    lam: float
    ainv: np.ndarray

    def predict(self, X: np.ndarray) -> np.ndarray:
        return self.intercept + ((X - self.means) / self.sds) @ self.coef

    def leverage(self, X: np.ndarray) -> np.ndarray:
        Z = (X - self.means) / self.sds
        return np.einsum("ij,jk,ik->i", Z, self.ainv, Z)


def fit_ridge(X: np.ndarray, y: np.ndarray, lam: float) -> Ridge:
    means = X.mean(axis=0)
    sds = X.std(axis=0)
    sds[sds == 0] = 1.0
    Z = (X - means) / sds
    ym = float(y.mean())
    A = Z.T @ Z + lam * np.eye(X.shape[1])
    ainv = np.linalg.inv(A)
    coef = ainv @ Z.T @ (y - ym)
    return Ridge(means, sds, coef, ym, lam, ainv)


def farm_folds(groups: list[str], k: int) -> dict[str, int]:
    """Deterministic assignment of whole farms to folds."""
    farms = sorted(set(groups), key=lambda g: hashlib.sha256(g.encode()).hexdigest())
    return {g: i % k for i, g in enumerate(farms)}


def metrics(y: np.ndarray, pred: np.ndarray) -> dict[str, float]:
    resid = y - pred
    ss_tot = float(np.sum((y - y.mean()) ** 2))
    return {
        "rmse": round(float(np.sqrt(np.mean(resid**2))), 4),
        "mae": round(float(np.mean(np.abs(resid))), 4),
        "bias": round(float(np.mean(pred - y)), 4),
        "r2": round(1 - float(np.sum(resid**2)) / ss_tot, 4) if ss_tot > 0 else 0.0,
    }


def grouped_cv(X: np.ndarray, y: np.ndarray, groups: list[str], lam: float) -> dict[str, Any]:
    k = min(5, len(set(groups)))
    folds = farm_folds(groups, k)
    fold_of = np.array([folds[g] for g in groups])
    oof = np.zeros_like(y)
    covered = np.zeros(len(y), dtype=bool)
    per_fold = []
    for f in range(k):
        test = fold_of == f
        train = ~test
        m = fit_ridge(X[train], y[train], lam)
        inner = y[train] - m.predict(X[train])
        q05, q95 = np.quantile(inner, 0.05), np.quantile(inner, 0.95)
        oof[test] = m.predict(X[test])
        covered[test] = (y[test] >= oof[test] + q05) & (y[test] <= oof[test] + q95)
        per_fold.append({"fold": f, "n_test": int(test.sum()),
                         "farms": sorted({g for g, fo in folds.items() if fo == f}),
                         **metrics(y[test], oof[test])})
    resid = y - oof
    out = metrics(y, oof)
    out.update({
        "coverage_90": round(float(covered.mean()), 4), "k": k, "folds": per_fold,
        "residual_sd": round(float(np.std(resid, ddof=1)), 6),
        "residual_q05": round(float(np.quantile(resid, 0.05)), 6),
        "residual_q95": round(float(np.quantile(resid, 0.95)), 6),
    })
    return out


def portable_params(m: Ridge, features: list[str], X: np.ndarray, cv: dict[str, Any]) -> dict[str, Any]:
    orig = m.coef / m.sds
    return {
        "features": features,
        "feature_means": [float(x) for x in m.means],
        "feature_sds": [float(x) for x in m.sds],
        "coefficients_standardised": [float(x) for x in m.coef],
        "intercept_standardised": m.intercept,
        "coefficients": {f: float(c) for f, c in zip(features, orig)},
        "intercept": float(m.intercept - float(np.sum(orig * m.means))),
        "lambda": m.lam,
        "xtx_inv": [[float(v) for v in row] for row in m.ainv],
        "residual_sd": cv["residual_sd"],
        "residual_q05": cv["residual_q05"],
        "residual_q95": cv["residual_q95"],
        "feature_ranges": {f: [float(X[:, i].min()), float(X[:, i].max())] for i, f in enumerate(features)},
    }


def from_params(p: dict[str, Any]) -> Ridge:
    return Ridge(np.array(p["feature_means"]), np.array(p["feature_sds"]), np.array(p["coefficients_standardised"]),
                 float(p["intercept_standardised"]), float(p["lambda"]), np.array(p["xtx_inv"]))


def predict_interval(p: dict[str, Any], x: dict[str, float]) -> dict[str, Any]:
    """Prediction with a 90% interval: ± 1.645 · residual sd · sqrt(1 + leverage)."""
    feats = p["features"]
    X = np.array([[x[f] for f in feats]])
    m = from_params(p)
    pred = float(m.predict(X)[0])
    h = float(m.leverage(X)[0])
    half = Z90 * float(p["residual_sd"]) * (1 + h) ** 0.5
    out_of_range = [f for f in feats if not (p["feature_ranges"][f][0] <= x[f] <= p["feature_ranges"][f][1])]
    return {
        "predicted_soc_pct": round(pred, 4), "lower": round(max(0.0, pred - half), 4), "upper": round(pred + half, 4),
        "interval_width": round(2 * half, 6), "leverage": round(h, 6), "in_domain": not out_of_range,
        "out_of_domain_features": out_of_range,
    }
