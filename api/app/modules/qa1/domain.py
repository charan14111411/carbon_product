"""VM0042 v2.2 Quantification Approach 1 ("Measure and Model") — pure functions, no database, no clock.

Every equation below is transcribed from the VM0042 v2.2 PDF (Verra, 21 Oct 2025); page numbers are the
printed PDF pages. Randomness only enters through an explicit integer ``seed`` (reproducible Monte Carlo).

Model inputs
------------
* Eq. 4 (§8.2.1.6 p.37): ``SOC_model = 100 × BD_corr × d × OC_n,dl`` — SOC stock as model input (t/ha);
  BD_corr = bulk density of the fine soil after subtracting the coarse-fragment mass proportion (g/cm³),
  d = soil depth (cm), 100 = g/cm² → t/ha. Dimensional check: 100 × g/cm³ × cm = t soil/ha, so OC must be a
  mass fraction (g C/g soil); a lab ``soc_pct`` is divided by 100.
* Eq. 5 (p.37–38) / Eq. 10 (p.40) / Eq. 15 (p.42): SOC, soil CH4 and soil N2O are model outputs ``ʄ(·)``.
  Eq. 10 multiplies ʄ(CH4_soil) by GWP_CH4 and Eq. 15 multiplies ʄ(N2O_soil) (t N2O/ha) by GWP_N2O, so the
  platform imports fluxes in t CH4/ha and t N2O/ha. (The PDF labels ʄ(CH4_soil) "t CO2e/ha" although it is
  multiplied by a GWP in t CO2e/t CH4; the mass unit is the only one consistent with the equation.)
* Eq. 46/47 (p.58–59): ``ΔCO2_soil = Σ_i ((SOC_i,t − SOC_i,t−x) × 1/x) × A_i``; SOC changes are converted
  with 44/12 (note on p.59). Eq. 54 / Eq. 58 (p.61–62): reductions = baseline − project emissions.

Uncertainty, analytical (§8.6.1.1, p.64–69)
--------------------------------------------
* Eq. 60  ``s²_model,Δ• = s²(Δ•̂_bsl − Δ•̂_pr) = 2[s²_model,• − cov(Δ•̂_wp, Δ•̂_bsl)]``
* Eq. 61  ``ρ = cov(Δ•̂_wp, Δ•̂_bsl) / √(s²_model,•wp × s²_model,•bsl)``, then ``s²_model,Δ• = 2 s²_model,• (1 − ρ)``
* Eq. 62  ``s²_sampling,Δ•,t = Σ_h s²_sampling,Δ•,h,t``, ``s²_sampling,Δ•,h,t = A_h²/(n_h(n_h − 1)) Σ_ip (Δ•_h,ip,t − Δ•̄_h,t)²``
* Eq. 63  ``s²_Δ•̄,t = s²_sampling,Δ•,t / A² + s²_model``
* Eq. 64  ``s²_model = Σ_h (A_h²/A²) s²_model,h``

Uncertainty, Monte Carlo (§8.6.1.2, p.69–74)
--------------------------------------------
* Eq. 65  ``ỹ_h,ip,l = z̃_bsl,h,ip,l − z̃_wp,h,ip,l`` (z = emissions; for SOC z = −1 × the stock change)
* Eq. 66  ``μ̂ = τ̂ / A``, ``τ̂ = Σ_h τ̂_h``, ``τ̂_h = A_h/(n_h L) Σ_ip (Σ_l ỹ_h,ip,l)``
* Eq. 67  ``Var(τ̂) = E[Var(τ̂|s)] + Var(E[τ̂|s])``
* Eq. 68  ``Var̂(τ̂) = s²_sampling + s²_model = {Σ_h s²_sampling,h} + s²_model`` with
  ``s²_sampling,h = A_h²/(n_h(n_h − 1)) Σ_ip (ŷ_h,ip − μ̂_h)²``, ``ŷ_h,ip = 1/L Σ_l ỹ_h,ip,l``, ``μ̂_h = τ̂_h/A_h``,
  ``s²_model = 1/(L − 1) Σ_l (τ̃_l − τ̂)²``, ``τ̃_l = Σ_h τ̃_h,l``, ``τ̃_h,l = A_h/n_h Σ_ip ỹ_h,ip,l``
* Eq. 69  ``Var̂(μ̂) = s²_Δ•̄ = (s²_sampling + s²_model) / A²``
* §8.6.1.2.3 (p.74): the MC error inflates the standard error by ``√(1 + 1/L)``.

Variance handed to the calculation engine
-----------------------------------------
``calculation.engine`` treats a term's ``variance`` as the variance of the period total in (t CO2e)² and
applies Eq. 74 as ``√variance / |total| × t``, which equals ``√s²_Δ•̄ / |Δ•̄| × t`` because the total is
``A × Δ•̄`` and its variance ``A² × s²_Δ•̄``. Degrees of freedom are Welch–Satterthwaite across the variance
components (sampling per stratum with n_h − 1; model error with the validation dataset size − 1, or L − 1).

True-up (§8.6.1.3, p.74–75)
---------------------------
Re-measured project SOC re-estimates model prediction error: ``error = SOC_model − SOC_observed`` and the
error variance is the variance of the errors across points (p.64: "model uncertainty is estimated as the
variance of error_Δ• across all sites"; same estimator form as Eq. 73 p.80). The PDF prescribes no
numeric adjustment to issued credits: "VCUs that have been issued in previous verifications will remain
unchanged"; the updated error term (in an updated model validation report) and a re-run from t0 apply to
future vintages.
"""

from __future__ import annotations

import math
from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field

import numpy as np

from app.core.errors import ValidationFailed
from app.modules.calculation.engine import welch_df

CO2_PER_C: float = 44.0 / 12.0  # note to Eq. 46/47, p.59

# Applicability condition 1 (§4 p.9) practice categories, used for the model validation domain (VMD0053
# validates "per practice category"; the categories themselves are VM0042's).
PRACTICE_CATEGORIES: tuple[str, ...] = (
    "fertilizer_management",   # 1(a)
    "water_management",        # 1(b)
    "tillage_residue",         # 1(c)
    "crop_planting_harvest",   # 1(d)
    "grazing",                 # 1(e)
)
POOLS: tuple[str, ...] = ("soc", "ch4_soil", "n2o_soil")


# =============================================================== model inputs (Eq. 4)
def bd_corrected(bulk_density_g_cm3: float, coarse_fraction: float | None) -> float:
    """BD_corr (§9 parameter table p.98): fine-soil bulk density after subtracting the coarse-fragment mass
    proportion. ``coarse_fraction`` None means the lab bulk density is already fine-soil only."""
    if bulk_density_g_cm3 is None or bulk_density_g_cm3 <= 0:
        raise ValidationFailed("Bulk density must be a positive number.", code="INVALID_MODEL_INPUT")
    if coarse_fraction is None:
        return float(bulk_density_g_cm3)
    if not 0 <= coarse_fraction < 1:
        raise ValidationFailed("The coarse fraction must be between 0 and 1.", code="INVALID_MODEL_INPUT")
    return float(bulk_density_g_cm3) * (1.0 - float(coarse_fraction))


def eq4_soc_model_t_ha(bd_corr_g_cm3: float, depth_cm: float, oc_fraction: float) -> float:
    """Eq. 4 (p.37): SOC_model = 100 × BD_corr × d × OC (t C/ha). ``oc_fraction`` is g C per g soil."""
    if depth_cm <= 0:
        raise ValidationFailed("Soil depth must be positive.", code="INVALID_MODEL_INPUT")
    if oc_fraction < 0 or oc_fraction > 1:
        raise ValidationFailed("Organic carbon must be a fraction between 0 and 1.", code="INVALID_MODEL_INPUT")
    if bd_corr_g_cm3 <= 0:
        raise ValidationFailed("Corrected bulk density must be positive.", code="INVALID_MODEL_INPUT")
    return 100.0 * bd_corr_g_cm3 * depth_cm * oc_fraction


# =============================================================== period aggregation (Eq. 46/47, 54, 58)
def period_change(stocks_by_year: Mapping[int, float], vintages: Sequence[tuple[int, float]]) -> float:
    """Stock change over a crediting period from end-of-year modelled stocks (Eq. 5 / 46 / 47).

    ``vintages`` are (calendar year, share of that year inside the period). The change credited for year y
    is ``share_y × (SOC_y − SOC_{y−1})`` — whole years give exactly ``SOC_end − SOC_start``."""
    total = 0.0
    for year, w in vintages:
        for needed in (year - 1, year):
            if needed not in stocks_by_year:
                raise ValidationFailed(
                    f"The model run has no SOC stock for the end of {needed}, which is needed for the {year} change.",
                    code="MODEL_RUN_INCOMPLETE", details={"year": needed})
        total += w * (stocks_by_year[year] - stocks_by_year[year - 1])
    return float(total)


def period_flux(flux_by_year: Mapping[int, float], vintages: Sequence[tuple[int, float]]) -> float:
    """Sum of annual modelled fluxes over the period (share-weighted for part years)."""
    total = 0.0
    for year, w in vintages:
        if year not in flux_by_year:
            raise ValidationFailed(f"The model run has no flux for {year}.", code="MODEL_RUN_INCOMPLETE",
                                   details={"year": year})
        total += w * flux_by_year[year]
    return float(total)


def stock_at(stocks_by_year: Mapping[int, float], year_fraction: float) -> float:
    """Modelled stock at a date given as a fractional year (e.g. 2024.04), linear between end-of-year stocks
    (the stock at the end of year y−1 is the stock at time y.0)."""
    y = math.floor(year_fraction)
    frac = year_fraction - y
    a, b = stocks_by_year.get(y - 1), stocks_by_year.get(y)
    if a is None or b is None:
        raise ValidationFailed(f"The model run does not cover the date {year_fraction:.2f}.",
                               code="MODEL_RUN_INCOMPLETE", details={"year": y})
    return float(a + frac * (b - a))


# =============================================================== analytical (Eq. 60–64)
def eq60_model_variance_delta(s2_model: float, cov_wp_bsl: float) -> float:
    """Eq. 60 (p.65): s²_model,Δ• = 2[s²_model,• − cov(Δ•̂_wp, Δ•̂_bsl)] — (t CO2e/ha)²."""
    if s2_model < 0:
        raise ValidationFailed("A model error variance can't be negative.", code="INVALID_MODEL_METRIC")
    out = 2.0 * (s2_model - cov_wp_bsl)
    if out < 0:
        raise ValidationFailed("The covariance exceeds the model error variance (Eq. 60 would be negative).",
                               code="INVALID_MODEL_METRIC")
    return out


def eq61_rho(cov_wp_bsl: float, s2_model_wp: float, s2_model_bsl: float) -> float:
    """Eq. 61 (p.66): ρ = cov(Δ•̂_wp, Δ•̂_bsl) / √(s²_model,•wp × s²_model,•bsl)."""
    if s2_model_wp <= 0 or s2_model_bsl <= 0:
        raise ValidationFailed("Both model error variances must be positive to compute ρ.",
                               code="INVALID_MODEL_METRIC")
    return cov_wp_bsl / math.sqrt(s2_model_wp * s2_model_bsl)


def eq61_model_variance_delta(s2_model: float, rho: float) -> float:
    """Eq. 61 (p.66): s²_model,Δ• = 2 s²_model,• (1 − ρ)."""
    if s2_model < 0:
        raise ValidationFailed("A model error variance can't be negative.", code="INVALID_MODEL_METRIC")
    if not -1.0 <= rho <= 1.0:
        raise ValidationFailed("The error correlation ρ must be between −1 and 1.", code="INVALID_MODEL_METRIC")
    return 2.0 * s2_model * (1.0 - rho)


@dataclass(frozen=True)
class StratumPoints:
    """Per-point reductions/removals Δ•_h,ip (t CO2e/ha) of one stratum with its area A_h (ha)."""

    code: str
    area_ha: float
    values: tuple[float, ...]

    @property
    def n(self) -> int:
        return len(self.values)

    @property
    def mean(self) -> float:
        return float(np.mean(self.values))


def _check_strata(strata: Sequence[StratumPoints]) -> None:
    if not strata:
        raise ValidationFailed("There are no strata with modelled points.", code="NO_STRATA")
    for s in strata:
        if s.area_ha is None or s.area_ha <= 0:
            raise ValidationFailed(f"Stratum {s.code} has no area.", code="INVALID_STRATUM",
                                   details={"stratum": s.code})
        if s.n < 2:
            raise ValidationFailed(f"Stratum {s.code} has {s.n} modelled point(s); the sampling variance (Eq. 62) "
                                   "needs at least 2.", code="INSUFFICIENT_POINTS", details={"stratum": s.code})


def eq62_sampling_variance(strata: Sequence[StratumPoints]) -> tuple[float, dict[str, float]]:
    """Eq. 62 (p.68): Σ_h A_h²/(n_h(n_h − 1)) Σ_ip (Δ•_h,ip − Δ•̄_h)² — (t CO2e)²."""
    _check_strata(strata)
    per: dict[str, float] = {}
    for s in strata:
        v = np.asarray(s.values, float)
        per[s.code] = float(s.area_ha**2 / (s.n * (s.n - 1)) * np.sum((v - v.mean()) ** 2))
    return float(sum(per.values())), per


def eq64_model_variance(areas: Mapping[str, float], s2_model_h: Mapping[str, float], total_area: float) -> float:
    """Eq. 64 (p.69): s²_model = Σ_h (A_h²/A²) s²_model,h — (t CO2e/ha)²."""
    missing = sorted(set(areas) - set(s2_model_h))
    if missing:
        raise ValidationFailed("A model prediction error is missing for some strata.", code="MODEL_ERROR_MISSING",
                               details={"strata": missing})
    return float(sum(areas[h] ** 2 / total_area**2 * s2_model_h[h] for h in areas))


def eq63_variance_of_mean(s2_sampling: float, total_area: float, s2_model: float) -> float:
    """Eq. 63 (p.69): s²_Δ•̄,t = s²_sampling,Δ•,t / A² + s²_model — (t CO2e/ha)²."""
    if total_area <= 0:
        raise ValidationFailed("The total project area must be positive.", code="INVALID_STRATUM")
    return s2_sampling / total_area**2 + s2_model


@dataclass(frozen=True)
class UncertaintyResult:
    method: str  # analytical | monte_carlo
    total_t_co2e: float  # Σ_h A_h Δ•̄_h (analytical) or τ̂ (MC)
    mean_t_co2e_ha: float  # Δ•̄ or μ̂
    total_area_ha: float
    s2_sampling: float  # (t CO2e)²
    s2_sampling_by_stratum: dict[str, float]
    s2_model: float  # analytical: (t CO2e/ha)² (Eq. 64); MC: (t CO2e)² (Eq. 68)
    s2_mean: float  # Eq. 63 / 69, (t CO2e/ha)²
    variance_total: float  # (t CO2e)², what the engine's term variance means
    df: float
    df_components: tuple[tuple[float, float], ...]
    by_stratum: dict[str, dict[str, float]] = field(default_factory=dict)
    mc_draws: int | None = None
    mc_error_factor: float | None = None

    def to_dict(self) -> dict:
        return {
            "method": self.method, "total_t_co2e": self.total_t_co2e, "mean_t_co2e_ha": self.mean_t_co2e_ha,
            "total_area_ha": self.total_area_ha, "s2_sampling": self.s2_sampling,
            "s2_sampling_by_stratum": self.s2_sampling_by_stratum, "s2_model": self.s2_model,
            "s2_mean": self.s2_mean, "variance_total": self.variance_total, "df": self.df,
            "df_components": [list(c) for c in self.df_components], "by_stratum": self.by_stratum,
            "mc_draws": self.mc_draws, "mc_error_factor": self.mc_error_factor,
        }


def analytical(strata: Sequence[StratumPoints], s2_model_h: Mapping[str, float],
               df_model_h: Mapping[str, float]) -> UncertaintyResult:
    """§8.6.1.1: Eq. 62 + Eq. 64 combined by Eq. 63, scaled to the period total (× A²)."""
    s2_sampling, per = eq62_sampling_variance(strata)
    areas = {s.code: float(s.area_ha) for s in strata}
    a = float(sum(areas.values()))
    s2_model = eq64_model_variance(areas, s2_model_h, a)
    s2_mean = eq63_variance_of_mean(s2_sampling, a, s2_model)
    total = float(sum(s.area_ha * s.mean for s in strata))
    comps: list[tuple[float, float]] = [(per[s.code], float(s.n - 1)) for s in strata]
    for h, area in areas.items():
        v = area**2 * s2_model_h[h]  # the stratum's Eq. 64 share on the period-total scale (× A²)
        if v > 0:
            dfh = df_model_h.get(h)
            if dfh is None or dfh <= 0:
                raise ValidationFailed(f"The model prediction error for stratum {h} has no validation sample size, "
                                       "so its degrees of freedom are unknown.", code="MODEL_ERROR_MISSING",
                                       details={"stratum": h})
            comps.append((v, float(dfh)))
    df = welch_df(comps)
    return UncertaintyResult(
        method="analytical", total_t_co2e=total, mean_t_co2e_ha=total / a, total_area_ha=a,
        s2_sampling=s2_sampling, s2_sampling_by_stratum=per, s2_model=s2_model, s2_mean=s2_mean,
        variance_total=s2_mean * a**2, df=df, df_components=tuple(comps),
        by_stratum={s.code: {"area_ha": s.area_ha, "n": s.n, "mean_t_co2e_ha": s.mean,
                             "s2_sampling": per[s.code], "s2_model_h": float(s2_model_h[s.code])} for s in strata},
    )


# =============================================================== Monte Carlo (Eq. 65–69)
def eq65_point_draws(z_bsl: np.ndarray, z_wp: np.ndarray) -> np.ndarray:
    """Eq. 65 (p.71): ỹ = z̃_bsl − z̃_wp (emissions convention; for SOC z = −ΔSOC)."""
    zb, zw = np.asarray(z_bsl, float), np.asarray(z_wp, float)
    if zb.shape != zw.shape:
        raise ValidationFailed("Baseline and project draws must have the same shape.", code="MC_SHAPE_MISMATCH")
    return zb - zw


@dataclass(frozen=True)
class StratumDraws:
    """ỹ_h,ip,l for one stratum: array (n_h points × L draws), t CO2e/ha."""

    code: str
    area_ha: float
    draws: np.ndarray

    @property
    def n(self) -> int:
        return int(self.draws.shape[0])

    @property
    def L(self) -> int:  # noqa: N802 — the PDF's symbol
        return int(self.draws.shape[1])


def _check_draws(strata: Sequence[StratumDraws]) -> int:
    if not strata:
        raise ValidationFailed("There are no strata with Monte Carlo draws.", code="NO_STRATA")
    ls = {s.L for s in strata}
    if len(ls) != 1:
        raise ValidationFailed("Every point must have the same number of Monte Carlo draws (L).",
                               code="MC_SHAPE_MISMATCH", details={"L": sorted(ls)})
    big_l = ls.pop()
    if big_l < 2:
        raise ValidationFailed("Monte Carlo needs at least 2 draws.", code="MC_TOO_FEW_DRAWS")
    for s in strata:
        if s.area_ha is None or s.area_ha <= 0:
            raise ValidationFailed(f"Stratum {s.code} has no area.", code="INVALID_STRATUM",
                                   details={"stratum": s.code})
        if s.n < 2:
            raise ValidationFailed(f"Stratum {s.code} has {s.n} point(s); Eq. 68 needs at least 2.",
                                   code="INSUFFICIENT_POINTS", details={"stratum": s.code})
    return big_l


def eq66_totals(strata: Sequence[StratumDraws]) -> tuple[float, dict[str, float], float]:
    """Eq. 66 (p.71–72): τ̂_h = A_h/(n_h L) Σ_ip Σ_l ỹ; τ̂ = Σ_h τ̂_h; μ̂ = τ̂/A. Returns (τ̂, τ̂_h, μ̂)."""
    big_l = _check_draws(strata)
    tau_h = {s.code: float(s.area_ha / (s.n * big_l) * np.sum(s.draws)) for s in strata}
    tau = float(sum(tau_h.values()))
    a = float(sum(s.area_ha for s in strata))
    return tau, tau_h, tau / a


def eq68_variance(strata: Sequence[StratumDraws]) -> tuple[float, dict[str, float], float, np.ndarray]:
    """Eq. 68 (p.72–73): (s²_sampling, s²_sampling,h, s²_model, τ̃_l), all on the total scale (t CO2e)²."""
    big_l = _check_draws(strata)
    tau, tau_h, _ = eq66_totals(strata)
    per: dict[str, float] = {}
    tau_l = np.zeros(big_l)
    for s in strata:
        y_hat = s.draws.mean(axis=1)  # ŷ_h,ip = 1/L Σ_l ỹ
        mu_h = tau_h[s.code] / s.area_ha  # μ̂_h = τ̂_h / A_h
        per[s.code] = float(s.area_ha**2 / (s.n * (s.n - 1)) * np.sum((y_hat - mu_h) ** 2))
        tau_l += s.area_ha / s.n * s.draws.sum(axis=0)  # τ̃_h,l = A_h/n_h Σ_ip ỹ_h,ip,l
    s2_model = float(np.sum((tau_l - tau) ** 2) / (big_l - 1))
    return float(sum(per.values())), per, s2_model, tau_l


def eq69_variance_of_mean(s2_sampling: float, s2_model: float, total_area: float) -> float:
    """Eq. 69 (p.73): Var̂(μ̂) = (s²_sampling + s²_model) / A²."""
    if total_area <= 0:
        raise ValidationFailed("The total project area must be positive.", code="INVALID_STRATUM")
    return (s2_sampling + s2_model) / total_area**2


def mc_error_factor(draws: int) -> float:
    """§8.6.1.2.3 (p.74, Gelman et al. 2014 p.267): MC error inflates the standard error by √(1 + 1/L)."""
    if draws < 1:
        raise ValidationFailed("L must be at least 1.", code="MC_TOO_FEW_DRAWS")
    return math.sqrt(1.0 + 1.0 / draws)


def monte_carlo(strata: Sequence[StratumDraws], *, apply_error_factor: bool) -> UncertaintyResult:
    """§8.6.1.2: Eq. 66 totals, Eq. 68 decomposition, Eq. 69 variance of the mean; optionally inflated by the
    MC error factor (variance × (1 + 1/L))."""
    big_l = _check_draws(strata)
    tau, tau_h, mu = eq66_totals(strata)
    s2_sampling, per, s2_model, _ = eq68_variance(strata)
    a = float(sum(s.area_ha for s in strata))
    factor = mc_error_factor(big_l) if apply_error_factor else 1.0
    s2_mean = eq69_variance_of_mean(s2_sampling, s2_model, a) * factor**2
    comps: list[tuple[float, float]] = [(per[s.code], float(s.n - 1)) for s in strata]
    if s2_model > 0:
        comps.append((s2_model, float(big_l - 1)))
    df = welch_df(comps)
    return UncertaintyResult(
        method="monte_carlo", total_t_co2e=tau, mean_t_co2e_ha=mu, total_area_ha=a, s2_sampling=s2_sampling,
        s2_sampling_by_stratum=per, s2_model=s2_model, s2_mean=s2_mean, variance_total=s2_mean * a**2, df=df,
        df_components=tuple(comps), mc_draws=big_l, mc_error_factor=factor if apply_error_factor else None,
        by_stratum={s.code: {"area_ha": s.area_ha, "n": s.n, "tau_h": tau_h[s.code],
                             "mu_h": tau_h[s.code] / s.area_ha, "s2_sampling": per[s.code]} for s in strata},
    )


def standard_normal_draws(draws: int, seed: int) -> np.ndarray:
    """L standard-normal values from a seeded PCG64 generator, centred to mean zero (reproducible)."""
    if draws < 2:
        raise ValidationFailed("Monte Carlo needs at least 2 draws.", code="MC_TOO_FEW_DRAWS")
    z = np.random.Generator(np.random.PCG64(int(seed))).standard_normal(int(draws))
    return z - z.mean()


def meta_model_draws(strata: Sequence[StratumPoints], sigma_h: Mapping[str, float], draws: int,
                     seed: int) -> list[StratumDraws]:
    """§8.6.1.2 p.70 "simplest implementation": a single parameter representing residual model prediction error
    (a meta-model). Draw l adds ``σ_h × z_l`` to every point's central reduction, with one z_l per draw shared by
    all strata because model errors "may not be independent across strata due to shared calibration parameters"
    (p.73–74). ``σ_h = √s²_model,Δ•`` of the stratum's practice category (Eq. 60/61). The z are centred, so
    the MC mean equals the central model run (unbiased model, p.64)."""
    z = standard_normal_draws(draws, seed)
    out = []
    for s in strata:
        sig = sigma_h.get(s.code)
        if sig is None or sig < 0:
            raise ValidationFailed(f"No model prediction error is available for stratum {s.code}.",
                                   code="MODEL_ERROR_MISSING", details={"stratum": s.code})
        vals = np.asarray(s.values, float)[:, None]
        out.append(StratumDraws(s.code, s.area_ha, vals + sig * z[None, :]))
    return out


# =============================================================== true-up (§8.6.1.3)
@dataclass(frozen=True)
class TrueUpStats:
    n: int
    errors: tuple[float, ...]  # SOC_model − SOC_observed, t CO2e/ha
    mean_error: float
    s2_error: float  # (t CO2e/ha)²
    rmse: float

    def to_dict(self) -> dict:
        return {"n": self.n, "errors": list(self.errors), "mean_error": self.mean_error, "s2_error": self.s2_error,
                "rmse": self.rmse}


def trueup_stats(modelled: Sequence[float], observed: Sequence[float]) -> TrueUpStats:
    """Re-estimated model prediction error from re-measured points (§8.6.1.1.1 p.64, §8.6.1.3 p.74–75):
    error = modelled − observed (Eq. 73 form, p.80); s² = Σ(error − mean error)²/(n − 1)."""
    m, o = np.asarray(modelled, float), np.asarray(observed, float)
    if m.shape != o.shape:
        raise ValidationFailed("Each re-measured point needs one modelled value.", code="TRUEUP_MISMATCH")
    n = int(m.size)
    if n < 2:
        raise ValidationFailed("A true-up needs at least 2 re-measured points.", code="INSUFFICIENT_POINTS")
    e = m - o
    return TrueUpStats(n=n, errors=tuple(float(x) for x in e), mean_error=float(e.mean()),
                       s2_error=float(np.sum((e - e.mean()) ** 2) / (n - 1)), rmse=float(math.sqrt(np.mean(e**2))))
