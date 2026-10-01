"""Derived sensor / weather features (pure functions, no database).

Every output value is ``DERIVED``: computed from MEASURED / OBSERVED / MODELLED daily inputs.
Each value carries the tiers and providers of the inputs it used and a quality equal to the
*minimum* quality of those inputs (a derived number is never better than its weakest input).

Formulas
--------
* ``sm20_* / sm60_*``  mean, min, max of daily soil moisture at 20 / 60 cm (% vol).
* ``sm_gradient``      mean over days with both depths of (SM20 − SM60), percentage points.
* ``dry_down_rate``    over *rain-free spells* (≥ ``SPELL_MIN_DAYS`` consecutive days with rain
                       < ``RAIN_FREE_MM``, SM20 present every day), the ordinary-least-squares slope of
                       SM20 against day number. Spells whose slope is negative (drying) contribute;
                       the feature is the mean of −slope, in % vol per day (positive = drying).
* ``wetness_days``     days with SM20 ≥ the wetness threshold (field-capacity proxy, % vol).
                       ``wetness_hours`` = days × 24: inputs are daily, so this is a daily-resolution
                       approximation, labelled as such.
* ``vpd``              Tetens: es = 0.6108 · exp(17.27·T / (T + 237.3)) kPa; VPD = es · (1 − RH/100).
                       Computed per day from daily mean air temperature and relative humidity.
* ``rain_total``       sum of daily rain in the period; ``heavy_rain_days`` days with rain > 25 mm.
* ``rain_7d/30d/90d``  trailing totals ending on the period's last day (needs ≥ 80 % of the window's
                       days, else ``None``).
* ``gdd_base10``       Σ max(0, T_mean − 10 °C) over the period (daily mean temperature; no Tmin/Tmax
                       exist in the daily store, so this is the mean-temperature method).

Field-capacity proxy (default wetness threshold)
------------------------------------------------
Saxton & Rawls (2006), water content at −33 kPa from sand S, clay C (fractions) and organic
matter OM (% weight):

    θ33t = −0.251 S + 0.195 C + 0.011 OM + 0.006 S·OM − 0.027 C·OM + 0.452 S·C + 0.299
    θ33  = θ33t + (1.283 θ33t² − 0.374 θ33t − 0.015)

With soil-map (MODELLED) texture this is only a *proxy*; callers can pass their own threshold.
"""

from __future__ import annotations

import math
from collections.abc import Iterable
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Any

HEAVY_RAIN_MM = 25.0
RAIN_FREE_MM = 1.0
SPELL_MIN_DAYS = 3
GDD_BASE_C = 10.0
WINDOW_COMPLETENESS = 0.8
RAIN_WINDOWS = (7, 30, 90)
WINDOWS = ("daily", "weekly", "monthly", "season")


@dataclass(frozen=True)
class Daily:
    """One daily input value with its provenance."""

    day: date
    value: float
    tier: int
    provider: str
    quality: float
    data_class: str | None


Series = dict[date, Daily]


# ------------------------------------------------------------------ formulas
def saturation_vapour_pressure_kpa(t_c: float) -> float:
    return 0.6108 * math.exp(17.27 * t_c / (t_c + 237.3))


def vpd_kpa(t_c: float, rh_pct: float) -> float:
    """Vapour-pressure deficit (Tetens), kPa. RH is clipped to 0..100 %."""
    rh = max(0.0, min(100.0, rh_pct))
    return saturation_vapour_pressure_kpa(t_c) * (1.0 - rh / 100.0)


def field_capacity_pct(sand_pct: float, clay_pct: float, om_pct: float) -> float:
    """Saxton & Rawls (2006) θ at −33 kPa, % vol."""
    s, c, om = sand_pct / 100.0, clay_pct / 100.0, om_pct
    t = -0.251 * s + 0.195 * c + 0.011 * om + 0.006 * s * om - 0.027 * c * om + 0.452 * s * c + 0.299
    return round((t + (1.283 * t * t - 0.374 * t - 0.015)) * 100.0, 2)


def ols_slope(xs: list[float], ys: list[float]) -> float:
    n = len(xs)
    mx, my = sum(xs) / n, sum(ys) / n
    sxx = sum((x - mx) ** 2 for x in xs)
    if sxx == 0:
        return 0.0
    return sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sxx


def rain_free_spells(rain: Series, sm: Series, start: date, end: date) -> list[list[date]]:
    """Runs of consecutive days (≥ SPELL_MIN_DAYS) with rain < RAIN_FREE_MM and SM present."""
    spells: list[list[date]] = []
    cur: list[date] = []
    d = start
    while d <= end:
        r, m = rain.get(d), sm.get(d)
        if r is not None and m is not None and r.value < RAIN_FREE_MM:
            cur.append(d)
        else:
            if len(cur) >= SPELL_MIN_DAYS:
                spells.append(cur)
            cur = []
        d += timedelta(days=1)
    if len(cur) >= SPELL_MIN_DAYS:
        spells.append(cur)
    return spells


def dry_down_rate(rain: Series, sm: Series, start: date, end: date) -> tuple[float | None, list[dict[str, Any]], list[Daily]]:
    spells = rain_free_spells(rain, sm, start, end)
    rates, detail, used = [], [], []
    for sp in spells:
        xs = [float((d - sp[0]).days) for d in sp]
        ys = [sm[d].value for d in sp]
        slope = ols_slope(xs, ys)
        detail.append({"start": sp[0].isoformat(), "end": sp[-1].isoformat(), "days": len(sp),
                       "slope_pct_per_day": round(slope, 4)})
        if slope < 0:
            rates.append(-slope)
            used.extend(sm[d] for d in sp)
            used.extend(rain[d] for d in sp)
    return (round(sum(rates) / len(rates), 4) if rates else None), detail, used


# ------------------------------------------------------------------ value wrapper
def value(v: float | None, unit: str, inputs: Iterable[Daily], **extra: Any) -> dict[str, Any]:
    inputs = list(inputs)
    return {
        "value": None if v is None else round(v, 4),
        "unit": unit,
        "data_class": "DERIVED",
        "source_tiers": sorted({i.tier for i in inputs}),
        "providers": sorted({i.provider for i in inputs}),
        "input_data_classes": sorted({i.data_class for i in inputs if i.data_class}),
        "quality": round(min((i.quality for i in inputs), default=0.0), 3) if v is not None else 0.0,
        "n_days": len({i.day for i in inputs}),
        **extra,
    }


def _in(s: Series, start: date, end: date) -> list[Daily]:
    return [s[d] for d in sorted(s) if start <= d <= end]


def _stats(prefix: str, rows: list[Daily], unit: str) -> dict[str, dict[str, Any]]:
    vals = [r.value for r in rows]
    return {
        f"{prefix}_mean": value(sum(vals) / len(vals) if vals else None, unit, rows),
        f"{prefix}_min": value(min(vals) if vals else None, unit, rows),
        f"{prefix}_max": value(max(vals) if vals else None, unit, rows),
    }


# ------------------------------------------------------------------ periods
def periods(start: date, end: date, window: str) -> list[tuple[date, date]]:
    """Split [start, end] into daily, ISO-weekly (Mon–Sun), calendar-monthly or one 'season' period.
    Partial first/last periods are clipped to the requested window."""
    if window not in WINDOWS:
        raise ValueError(window)
    if window == "season":
        return [(start, end)]
    out: list[tuple[date, date]] = []
    d = start
    while d <= end:
        if window == "daily":
            e = d
        elif window == "weekly":
            e = d + timedelta(days=6 - d.weekday())
        else:
            nxt = date(d.year + (d.month == 12), d.month % 12 + 1, 1)
            e = nxt - timedelta(days=1)
        e = min(e, end)
        out.append((d, e))
        d = e + timedelta(days=1)
    return out


# ------------------------------------------------------------------ one period
def period_features(inputs: dict[str, Series], start: date, end: date, wet_threshold_pct: float | None) -> dict[str, Any]:
    """All derived features for one period. ``inputs`` maps parameter -> Series; rain may extend
    up to 90 days before ``start`` (for trailing windows)."""
    sm20 = inputs.get("soil_moisture_20cm_pct", {})
    sm60 = inputs.get("soil_moisture_60cm_pct", {})
    rain = inputs.get("rain_mm", {})
    temp = inputs.get("air_temp_c", {})
    rh = inputs.get("rel_humidity_pct", {})
    out: dict[str, Any] = {}
    s20, s60 = _in(sm20, start, end), _in(sm60, start, end)
    out.update(_stats("sm20", s20, "% vol"))
    out.update(_stats("sm60", s60, "% vol"))

    both = [(sm20[d], sm60[d]) for d in sorted(sm20) if start <= d <= end and d in sm60]
    grads = [a.value - b.value for a, b in both]
    out["sm_gradient"] = value(sum(grads) / len(grads) if grads else None, "% vol (SM20 − SM60)",
                               [x for pair in both for x in pair])

    rate, spells, used = dry_down_rate(rain, sm20, start, end)
    out["dry_down_rate"] = value(rate, "% vol per day", used, spells=spells,
                                 method=f"OLS slope of SM20 over rain-free spells (rain < {RAIN_FREE_MM} mm, "
                                        f"≥ {SPELL_MIN_DAYS} days); mean of drying spells")

    if wet_threshold_pct is None or not s20:
        wet = None
    else:
        wet = sum(1 for r in s20 if r.value >= wet_threshold_pct)
    out["wetness_days"] = value(wet, "days", s20, threshold_pct=wet_threshold_pct)
    out["wetness_hours"] = value(None if wet is None else wet * 24, "hours", s20, threshold_pct=wet_threshold_pct,
                                 resolution="daily (days × 24)")

    vpd_rows = [(temp[d], rh[d]) for d in sorted(temp) if start <= d <= end and d in rh]
    vpds = [vpd_kpa(t.value, h.value) for t, h in vpd_rows]
    flat = [x for pair in vpd_rows for x in pair]
    out["vpd_mean"] = value(sum(vpds) / len(vpds) if vpds else None, "kPa", flat, formula="Tetens")
    out["vpd_max"] = value(max(vpds) if vpds else None, "kPa", flat, formula="Tetens")

    r_in = _in(rain, start, end)
    out["rain_total"] = value(sum(r.value for r in r_in) if r_in else None, "mm", r_in)
    out["heavy_rain_days"] = value(sum(1 for r in r_in if r.value > HEAVY_RAIN_MM) if r_in else None, "days", r_in,
                                   threshold_mm=HEAVY_RAIN_MM)
    for n in RAIN_WINDOWS:
        ws = end - timedelta(days=n - 1)
        rows = _in(rain, ws, end)
        complete = len(rows) / n
        v = sum(r.value for r in rows) if rows and complete >= WINDOW_COMPLETENESS else None
        out[f"rain_{n}d"] = value(v, "mm", rows, window=[ws.isoformat(), end.isoformat()],
                                  completeness=round(complete, 3))
    t_in = _in(temp, start, end)
    out["temp_mean"] = value(sum(t.value for t in t_in) / len(t_in) if t_in else None, "°C", t_in)
    out["gdd_base10"] = value(sum(max(0.0, t.value - GDD_BASE_C) for t in t_in) if t_in else None, "°C·day", t_in,
                              base_c=GDD_BASE_C, method="daily mean temperature")
    return out


def compute(inputs: dict[str, Series], start: date, end: date, window: str,
            wet_threshold_pct: float | None) -> list[dict[str, Any]]:
    return [{"period_start": s.isoformat(), "period_end": e.isoformat(),
             "features": period_features(inputs, s, e, wet_threshold_pct)} for s, e in periods(start, end, window)]
