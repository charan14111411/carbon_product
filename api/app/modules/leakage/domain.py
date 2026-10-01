"""Leakage calculators — pure functions, no database.

1. LE_BR — diversion of biomass residues from energy applications (VM0042 v2.2 §8.4.4 p.53)
------------------------------------------------------------------------------------------
VM0042 text: "Leakage emissions LE_BR,Div,t must be determined following procedures in the CDM's TOOL16: Project and
leakage emissions from biomass, Section 6.2 Leakage due to diversion of biomass residues from other applications in
year y" (the subscript t replaces y). LE_BR,t enters Eq. 39/42 (p.56–57) together with LE_OA,t.

External tool structure (CDM TOOL16, leakage from diverted biomass residues): for each residue category k for which
leakage cannot be ruled out (the tool lets the proponent rule it out with evidence, e.g. the residue was not used,
or there is a surplus), the energy the residue supplied is assumed to be replaced by fossil fuel::

    LE_BR = EF_CO2,LE × Σ_k BR_LE,k × NCV_k

with BR_LE,k the quantity of residue k diverted (t dry matter), NCV_k its net calorific value (GJ/t dry matter) and
EF_CO2,LE the CO2 emission factor of the replacing fuel (t CO2/GJ; TOOL16 prescribes which fuel — the most
carbon-intensive fuel used in the country unless a documented alternative is allowed). The platform takes NCV and
EF per category as user-entered values with their source and evidence; it never supplies them.

2. LK_disp — livestock displacement and production declines (VM0042 v2.2 §8.4.2–8.4.3 p.52–53, VMD0054)
-----------------------------------------------------------------------------------------------------
VM0042 text, quoted exactly::

    l_j,t   = FP_j,t − LM_j,t                              (34)   "production change", may be negative
    AL_t    = MAX( Σ_{j=1..T} INL_j,t , 0 )                (35)
    LK_disp,t = MAX(0, LK_t − LK_prior) / years            (36)

LK_t is the cumulative leakage up to year t from VMD0054 Eq. 10, LK_prior the cumulative leakage between y = 0 and
the previous verification, and "years" the duration of the verification period. §8.4.2(b): where the proponent
demonstrates that commodity production did not decrease and livestock was slaughtered, not displaced,
LK_disp,t = 0.

Here FP_j,t is taken as baseline production − project production of commodity j (VM0042 reads "production change"
for VMD0054's "foregone production"; positive = a decline). LM_j,t is VMD0054's leakage-mitigation production.

External tool parts NOT reproduced by VM0042 (VMD0054 Eq. 6 and Eq. 8–10) are taken as evidenced inputs from the
proponent's VMD0054 worksheet: INL_j,t (ha) per commodity and the leakage emission factor per hectare of net land
conversion EF_t (t CO2e/ha). The platform composes VMD0054's cumulative leakage as LK_t = Σ_{y ≤ t} AL_y × EF_y.
This composition is the platform's reading of VMD0054 and must be confirmed against the version in force.
"""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from typing import Any

from app.core.errors import RuleMissing, ValidationFailed


# =============================================================== TOOL16 (LE_BR)
@dataclass(frozen=True)
class Residue:
    record_id: str
    residue_type: str
    quantity_t_dry: float
    ncv_gj_per_t_dry: float | None
    ef_co2_t_per_gj: float | None
    leakage_ruled_out: bool = False


def tool16_le_br(items: Sequence[Residue]) -> dict[str, Any]:
    """LE_BR (t CO2e) = Σ_k BR_LE,k × NCV_k × EF_CO2,LE over categories where leakage is not ruled out."""
    rows, total = [], 0.0
    for r in items:
        if r.quantity_t_dry < 0:
            raise ValidationFailed("Residue quantities can't be negative.", code="INVALID_RESIDUE")
        if r.leakage_ruled_out:
            rows.append({"record_id": r.record_id, "residue_type": r.residue_type, "quantity_t_dry": r.quantity_t_dry,
                         "leakage_ruled_out": True, "energy_gj": None, "le_br_t_co2e": 0.0})
            continue
        if r.ncv_gj_per_t_dry is None or r.ef_co2_t_per_gj is None:
            raise RuleMissing(f"The residue “{r.residue_type}” needs its net calorific value and the emission factor of "
                              "the replacing fuel (TOOL16).", details={"rule_key": "tool16_factors",
                                                                       "record_id": r.record_id})
        energy = r.quantity_t_dry * r.ncv_gj_per_t_dry
        le = energy * r.ef_co2_t_per_gj
        total += le
        rows.append({"record_id": r.record_id, "residue_type": r.residue_type, "quantity_t_dry": r.quantity_t_dry,
                     "ncv_gj_per_t_dry": r.ncv_gj_per_t_dry, "ef_co2_t_per_gj": r.ef_co2_t_per_gj,
                     "leakage_ruled_out": False, "energy_gj": energy, "le_br_t_co2e": le})
    return {"le_br_t_co2e": total, "items": rows}


# =============================================================== VMD0054 / Eq. 34–36 (LK_disp)
@dataclass(frozen=True)
class Commodity:
    commodity: str
    unit: str
    baseline_production: float
    project_production: float
    lm: float | None = None  # LM_j,t leakage-mitigation production (same unit)
    inl_ha: float | None = None  # INL_j,t from the VMD0054 worksheet (ha)


@dataclass(frozen=True)
class Livestock:
    livestock_type: str
    baseline_head: float
    project_head: float


@dataclass(frozen=True)
class DisplacementYear:
    year: int
    mode: str  # vmd0054 | no_decrease
    commodities: tuple[Commodity, ...]
    livestock: tuple[Livestock, ...] = ()
    ef_t_co2e_per_ha: float | None = None
    record_id: str = ""


def eq34_production_change(fp: float, lm: float) -> float:
    """Eq. 34: l_j,t = FP_j,t − LM_j,t (no floor at zero: a negative value is land sparing)."""
    return fp - lm


def eq35_area(inl: Sequence[float]) -> float:
    """Eq. 35: AL_t = MAX(Σ_j INL_j,t, 0)."""
    return max(float(sum(inl)), 0.0)


def eq36_lk_disp(lk_t: float, lk_prior: float, years: float) -> float:
    """Eq. 36: LK_disp,t = MAX(0, LK_t − LK_prior) / years."""
    if years <= 0:
        raise ValidationFailed("The verification period must be longer than zero.", code="INVALID_PERIOD")
    return max(0.0, lk_t - lk_prior) / years


def check_no_decrease(commodities: Sequence[Commodity]) -> None:
    """§8.4.2(b): production must not have decreased for any commodity."""
    if not commodities:
        raise ValidationFailed("List the commodities produced (baseline and project) to show production did not "
                               "decrease.", code="NO_DECREASE_UNPROVEN")
    fell = [c.commodity for c in commodities if c.project_production < c.baseline_production]
    if fell:
        raise ValidationFailed(f"Production decreased for: {', '.join(fell)}. Leakage must then be quantified with "
                               "VMD0054 (Eq. 34–36) instead.", code="PRODUCTION_DECREASED",
                               details={"commodities": fell})


def check_vmd0054(y: DisplacementYear) -> None:
    if not y.commodities:
        raise ValidationFailed("List at least one commodity for the VMD0054 calculation.", code="INVALID_DISPLACEMENT")
    for c in y.commodities:
        if c.lm is None or c.inl_ha is None:
            raise RuleMissing(f"Commodity “{c.commodity}” needs its leakage-mitigation production (LM) and the new land "
                              "area INL from the VMD0054 worksheet (enter 0 where none).",
                              details={"rule_key": "vmd0054_inputs", "commodity": c.commodity})
    if y.ef_t_co2e_per_ha is None:
        raise RuleMissing("Enter the VMD0054 leakage emission factor per hectare of net land conversion, with its "
                          "source.", details={"rule_key": "vmd0054_emission_factor"})


def year_leakage(y: DisplacementYear) -> dict[str, Any]:
    """One year: Eq. 34 per commodity, Eq. 35 area, and the year's leakage AL_t × EF_t (VMD0054, see module doc)."""
    pop = [{"livestock_type": lv.livestock_type, "baseline_head": lv.baseline_head, "project_head": lv.project_head,
            "decline": lv.project_head < lv.baseline_head} for lv in y.livestock]
    if y.mode == "no_decrease":
        check_no_decrease(y.commodities)
        return {"year": y.year, "mode": y.mode, "record_id": y.record_id, "commodities": [
            {"commodity": c.commodity, "unit": c.unit, "baseline_production": c.baseline_production,
             "project_production": c.project_production} for c in y.commodities],
            "livestock": pop, "al_ha": 0.0, "leakage_t_co2e": 0.0, "eq": "§8.4.2(b): LK_disp = 0"}
    if y.mode != "vmd0054":
        raise ValidationFailed("Choose VMD0054 or 'production did not decrease'.", code="INVALID_DISPLACEMENT")
    check_vmd0054(y)
    rows, warnings = [], []
    for c in y.commodities:
        fp = c.baseline_production - c.project_production
        lv = eq34_production_change(fp, c.lm)  # type: ignore[arg-type]
        if (lv > 0 > c.inl_ha) or (lv < 0 < c.inl_ha):  # type: ignore[operator]
            warnings.append(f"{y.year} {c.commodity}: INL has the opposite sign of the production change l.")
        rows.append({"commodity": c.commodity, "unit": c.unit, "baseline_production": c.baseline_production,
                     "project_production": c.project_production, "fp": fp, "lm": c.lm, "l": lv, "inl_ha": c.inl_ha})
    al = eq35_area([c.inl_ha for c in y.commodities])  # type: ignore[misc]
    return {"year": y.year, "mode": y.mode, "record_id": y.record_id, "commodities": rows, "livestock": pop,
            "al_ha": al, "ef_t_co2e_per_ha": y.ef_t_co2e_per_ha, "leakage_t_co2e": al * y.ef_t_co2e_per_ha,  # type: ignore[operator]
            "warnings": warnings, "eq": "Eq. 34, Eq. 35"}


def lk_disp_period(records: Mapping[int, DisplacementYear], first_year: int, period_first: int, period_last: int,
                   period_years: float) -> dict[str, Any]:
    """Eq. 36 for one verification period. Every calendar year from the project start to the period end needs a
    record (fail closed)."""
    if period_first < first_year:
        raise ValidationFailed("The period starts before the project start.", code="INVALID_PERIOD")
    needed = list(range(first_year, period_last + 1))
    missing = [y for y in needed if y not in records]
    if missing:
        raise RuleMissing("Livestock / production records are missing for year(s) "
                          f"{', '.join(map(str, missing))}. Record each year (VMD0054, or show production did not "
                          "decrease).", details={"rule_key": "displacement_years", "years": missing})
    yrs = [year_leakage(records[y]) for y in needed]
    lk_t = sum(r["leakage_t_co2e"] for r in yrs)
    lk_prior = sum(r["leakage_t_co2e"] for r in yrs if r["year"] < period_first)
    annual = eq36_lk_disp(lk_t, lk_prior, period_years)
    warnings = [w for r in yrs for w in r.get("warnings", [])]
    declines = sorted({lv["livestock_type"] for r in yrs if r["year"] >= period_first and r["mode"] == "vmd0054"
                       for lv in r["livestock"] if lv["decline"]})
    if declines:
        warnings.append("Livestock population fell for " + ", ".join(declines) + ": under §8.4.2(a) the baseline "
                        "population must be used to calculate with-project livestock emissions.")
    return {"years": yrs, "lk_t_t_co2e": lk_t, "lk_prior_t_co2e": lk_prior, "verification_years": period_years,
            "lk_disp_annual_t_co2e": annual, "value_t_co2e": annual * period_years, "warnings": warnings,
            "all_no_decrease": all(r["mode"] == "no_decrease" for r in yrs if r["year"] >= period_first)}
