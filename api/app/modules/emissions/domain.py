"""QA3 default-factor emissions and organic-amendment leakage — VM0042 v2.2 §8.2.3–8.2.11, §8.4.1.

Pure functions only: no database, no clock. Every emission factor comes from the approved rule
pack (fail closed: a missing factor raises ``RuleMissing`` naming it). Equation numbers refer
to VM0042 v2.2 (docs/VM0042_v2.2_REQUIREMENTS.md §8–9).

Units
-----
* Every per-record result is a total in t CO2e for one field, one scenario, one calendar year.
* Areal means (Eq. 6, 8, 11, 12, 14, 18, 21, 24, 26–32) are totals ÷ the area A_i (ha) of the
  quantification unit; reductions are Σ_i (baseline mean − project mean) × A_i (Eq. 52–59).

Conservative factor choice (§8.6.3 p.81)
----------------------------------------
Each factor in the ``emission_factors`` rule may be ``{value, low, high}``. Per source, both
scenarios are first computed with the central value; if project emissions are lower than
baseline emissions the *low* end is then used for both scenarios, otherwise the *high* end.

Baseline schedule (§6 p.14, footnote 8)
---------------------------------------
Baseline activity records for a field are its look-back years (before the project start year).
For a project year Y the baseline year is Y itself if a baseline record exists for Y, otherwise
the look-back schedule repeats: index ``(Y − start) mod x`` into the ascending look-back years.

Activity attributes read (``ActivityRecord.attributes``)
--------------------------------------------------------
* fossil_fuel      ``fuels: [{fuel, litres}]`` or ``diesel_l`` / ``gasoline_l``
* liming           ``limestone_t``, ``dolomite_t``
* n_fertilizer     ``synthetic_fertilizers`` / ``organic_fertilizers: [{type, mass_t, n_content}]``
                   (or ``synthetic_n_t`` / ``organic_n_t`` directly as t N)
* n_fixing         ``species: [{name, dry_matter_t, n_content}]``
* livestock        ``animals: [{type, population, weight_kg, awms, ms?, days_on_site?, vs_rate?, nex_kg_n?}]``
* biomass_burning  ``burns: [{residue, mass_t, combustion_factor?}]``
* organic_amendment_import ``amendments: [{type, mass_t, carbon_content, produced_on_site?,
                   diverted_from_anaerobic_storage?, not_previously_used_as_amendment?}]``
* biochar          ``organic_carbon_t`` or ``mass_t`` × ``organic_carbon_fraction``
"""

from __future__ import annotations

import math
from collections import defaultdict
from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
from typing import Any

from app.core.errors import Blocked, RuleMissing, ValidationFailed
from app.modules.methodology.ruleset import RuleSet

CO2_PER_C = 44.0 / 12.0
N2O_PER_N = 44.0 / 28.0

# source -> (activity category, equations, label, symbol in Eq. 37)
SOURCES: dict[str, tuple[str, str, str, str]] = {
    "co2_fossil_fuel": ("fossil_fuel", "Eq. 6–7", "Fossil fuel CO2", "ΔCO2_ff"),
    "co2_liming": ("liming", "Eq. 8–9", "Liming CO2", "ΔCO2_lime"),
    "ch4_enteric": ("livestock", "Eq. 11", "Enteric fermentation CH4", "ΔCH4_ent"),
    "ch4_manure": ("livestock", "Eq. 12–13", "Manure CH4", "ΔCH4_md"),
    "ch4_biomass_burning": ("biomass_burning", "Eq. 14", "Biomass burning CH4", "ΔCH4_bb"),
    "n2o_fertilizer": ("n_fertilizer", "Eq. 17–23", "Fertiliser N2O", "ΔN2O_soil"),
    "n2o_n_fixing": ("n_fixing", "Eq. 24–25", "N-fixing species N2O", "ΔN2O_soil"),
    "n2o_manure": ("livestock", "Eq. 26–31", "Manure deposition N2O", "ΔN2O_soil"),
    "n2o_biomass_burning": ("biomass_burning", "Eq. 32", "Biomass burning N2O", "ΔN2O_bb"),
}
QA_RULE = {
    "co2_fossil_fuel": "qa_fossil_fuel", "co2_liming": "qa_liming", "ch4_enteric": "qa_enteric_ch4",
    "ch4_manure": "qa_manure", "n2o_manure": "qa_n2o_soil", "ch4_biomass_burning": "qa_biomass_burning",
    "n2o_biomass_burning": "qa_biomass_burning", "n2o_fertilizer": "qa_n2o_soil", "n2o_n_fixing": "qa_n2o_soil",
}
SOIL_N2O_SOURCES = ("n2o_fertilizer", "n2o_n_fixing", "n2o_manure")
# Categories whose baseline data make a matching project record mandatory (non-conservative gap otherwise).
EMISSION_CATEGORIES = ("fossil_fuel", "liming", "n_fertilizer", "n_fixing", "livestock", "biomass_burning")
TABLE4_CATEGORIES = ("crop", "n_fertilizer", "tillage_residue", "water", "grazing", "liming")


# ================================================================ inputs
@dataclass(frozen=True)
class Activity:
    field_id: str
    scenario: str  # baseline | project
    year: int
    category: str
    attributes: Mapping[str, Any]
    data_tier: int = 0
    record_id: str = ""
    version: int = 1


@dataclass(frozen=True)
class QuantUnit:
    code: str
    area_ha: float
    field_ids: tuple[str, ...]


@dataclass(frozen=True)
class EmissionsInput:
    activities: tuple[Activity, ...]
    units: tuple[QuantUnit, ...]
    field_areas: Mapping[str, float]
    project_start_year: int
    # calendar year -> fraction of that year inside the period (0 < w ≤ 1)
    year_weights: Mapping[int, float]
    # years whose biochar applications are subtracted from the measured SOC change (§4 cond. 7)
    biochar_years: tuple[int, ...] = ()
    # §8.4.2 option (a) needs displacement leakage (VMD0054 Eq. 36). True/False when a calculation run
    # knows whether an approved LK_disp term exists (False blocks); None for a stand-alone breakdown (warns).
    displacement_leakage_available: bool | None = None


# ================================================================ pure equations
def eq7_fossil_fuel(litres: float, ef_t_co2_per_l: float) -> float:
    """Eq. 7  EFF_j = FFC_j × EF_CO2,j  (t CO2e)."""
    return litres * ef_t_co2_per_l


def eq9_liming(limestone_t: float, dolomite_t: float, ef_limestone: float, ef_dolomite: float) -> float:
    """Eq. 9  EL = (M_limestone × EF_limestone + M_dolomite × EF_dolomite) × 44/12  (t CO2e)."""
    return (limestone_t * ef_limestone + dolomite_t * ef_dolomite) * CO2_PER_C


def areal(total_t_co2e: float, area_ha: float) -> float:
    """Eq. 6 / 8 / 11 / 12 / 14 / 18 / 21 / 24 / 26 / 32: areal mean = total ÷ A_i (t CO2e/ha)."""
    if area_ha <= 0:
        raise ValidationFailed("A quantification unit has no area.", code="INVALID_AREA")
    return total_t_co2e / area_ha


def eq11_enteric(population: float, ef_ent_kg_ch4: float, gwp_ch4: float) -> float:
    """Eq. 11 (numerator)  GWP_CH4 × Pop_l × EF_ent,l / 1000  (t CO2e; EF in kg CH4/head/yr)."""
    return gwp_ch4 * population * ef_ent_kg_ch4 / 1000.0


def eq13_vs(vs_rate: float, weight_kg: float) -> float:
    """Eq. 13  VS = VS_rate × W/1000 × 365  (kg VS/animal/yr)."""
    return vs_rate * weight_kg / 1000.0 * 365.0


def eq12_manure_ch4(population: float, vs_kg: float, awms: float, ef_g_ch4_per_kg_vs: float, gwp_ch4: float) -> float:
    """Eq. 12 (numerator)  GWP_CH4 × Pop × VS × AWMS × EF_CH4,md / 10⁶  (t CO2e)."""
    return gwp_ch4 * population * vs_kg * awms * ef_g_ch4_per_kg_vs / 1e6


def eq14_burning_ch4(mass_kg_dm: float, cf: float, ef_g_per_kg: float, gwp_ch4: float) -> float:
    """Eq. 14 (numerator)  GWP_CH4 × MB × CF × EF_CH4 / 10⁶  (MB in kg d.m., EF g/kg d.m.; t CO2e)."""
    return gwp_ch4 * mass_kg_dm * cf * ef_g_per_kg / 1e6


def eq19_fsn(items: Sequence[tuple[float, float]]) -> float:
    """Eq. 19  FSN = Σ M_SF × NC_SF  (t N)."""
    return float(sum(m * nc for m, nc in items))


def eq20_fon(items: Sequence[tuple[float, float]]) -> float:
    """Eq. 20  FON = Σ M_OF × NC_OF  (t N)."""
    return float(sum(m * nc for m, nc in items))


def eq18_direct(fsn: float, fon: float, ef_ndirect: float, gwp_n2o: float) -> float:
    """Eq. 18 (numerator)  (FSN + FON) × EF_Ndirect × 44/28 × GWP_N2O  (t CO2e)."""
    return (fsn + fon) * ef_ndirect * N2O_PER_N * gwp_n2o


def eq22_volat(fsn: float, fon: float, frac_gasf: float, frac_gasm: float, ef_nvolat: float, gwp_n2o: float) -> float:
    """Eq. 22  (FSN × Frac_GASF + FON × Frac_GASM) × EF_Nvolat × 44/28 × GWP_N2O  (t CO2e)."""
    return (fsn * frac_gasf + fon * frac_gasm) * ef_nvolat * N2O_PER_N * gwp_n2o


def eq23_leach(fsn: float, fon: float, frac_leach: float, ef_nleach: float, gwp_n2o: float) -> float:
    """Eq. 23  (FSN + FON) × Frac_LEACH × EF_Nleach × 44/28 × GWP_N2O  (t CO2e)."""
    return (fsn + fon) * frac_leach * ef_nleach * N2O_PER_N * gwp_n2o


def eq17_fertilizer(fsn: float, fon: float, f: Mapping[str, float], gwp_n2o: float) -> dict[str, float]:
    """Eq. 17 = Eq. 18 direct + Eq. 21 indirect (Eq. 22 volatilisation + Eq. 23 leaching)."""
    direct = eq18_direct(fsn, fon, f["EF_Ndirect"], gwp_n2o)
    volat = eq22_volat(fsn, fon, f["Frac_GASF"], f["Frac_GASM"], f["EF_Nvolat"], gwp_n2o)
    leach = eq23_leach(fsn, fon, f["Frac_LEACH"], f["EF_Nleach"], gwp_n2o)
    return {"direct": direct, "volatilisation": volat, "leaching": leach, "indirect": volat + leach,
            "total": direct + volat + leach}


def eq25_fcr(items: Sequence[tuple[float, float]]) -> float:
    """Eq. 25  F_CR = Σ MB_g × N_content,g  (t N)."""
    return float(sum(m * n for m, n in items))


def eq24_n_fixing(f_cr: float, ef_ndirect: float, gwp_n2o: float) -> float:
    """Eq. 24 (numerator)  F_CR × EF_Ndirect × 44/28 × GWP_N2O  (t CO2e)."""
    return f_cr * ef_ndirect * N2O_PER_N * gwp_n2o


def eq27_f_manure(population: float, nex_kg_n: float, awms: float, ms: float) -> float:
    """Eq. 28  F_manure = Pop × Nex × AWMS × MS  (kg N)."""
    return population * nex_kg_n * awms * ms


def eq26_31_manure_n2o(f_manure_kg_n: float, f: Mapping[str, float], gwp_n2o: float) -> dict[str, float]:
    """Eq. 26 total = Eq. 27 direct F × EF_N2O,md × 44/28 × GWP / 1000 + Eq. 29 indirect: Eq. 30 volatilisation
    (F × Frac_GASM × EF_Nvolat) and Eq. 31 leaching (F × Frac_LEACH × EF_Nleach), × 44/28 × GWP / 1000 (t CO2e).
    Eq. 30/31 are printed without the /1000 of Eq. 27; F is in kg N, so /1000 is kept for t (audit, p.46–47)."""
    k = N2O_PER_N * gwp_n2o / 1000.0
    direct = f_manure_kg_n * f["EF_N2O_md"] * k
    volat = f_manure_kg_n * f["Frac_GASM"] * f["EF_Nvolat"] * k
    leach = f_manure_kg_n * f["Frac_LEACH"] * f["EF_Nleach"] * k
    return {"direct": direct, "volatilisation": volat, "leaching": leach, "total": direct + volat + leach}


def eq32_burning_n2o(mass_kg_dm: float, cf: float, ef_g_per_kg: float, gwp_n2o: float) -> float:
    """Eq. 32 (numerator)  GWP_N2O × MB × CF × EF_N2O / 10⁶  (t CO2e)."""
    return gwp_n2o * mass_kg_dm * cf * ef_g_per_kg / 1e6


def eq33_leakage_oa(mass_t: float, carbon_content: float, retention: float) -> float:
    """Eq. 33  LE_OA = M_OA × CC_oa × 0.12 × 44/12  (t CO2e; 0.12 = manure C retention)."""
    return mass_t * carbon_content * retention * CO2_PER_C


def eq16_soil_n2o(fert: float, md: float, nfix: float) -> float:
    """Eq. 16  N2O_soil = N2O_fert + N2O_md + N2O_Nfix."""
    return fert + md + nfix


# ================================================================ factor access
class Factors:
    """Emission factors from the rule pack with conservative range selection."""

    def __init__(self, rules: RuleSet, mode: str = "value"):
        self.rules = rules
        self.mode = mode  # value | low | high
        self.used: dict[str, dict[str, Any]] = {}

    def table(self) -> Mapping[str, Any]:
        t = self.rules.get("emission_factors")
        return t if isinstance(t, dict) else {}

    def get(self, key: str) -> float:
        raw = self.table().get(key)
        if raw is None:
            raise RuleMissing(
                f"The approved emission factors don't include “{key}”, which the activity data needs. "
                "Nothing is assumed.", details={"rule_key": "emission_factors", "factor_key": key,
                                                "pack_id": self.rules.pack_id})
        if isinstance(raw, dict):
            val = raw.get(self.mode) if self.mode in ("low", "high") else None
            chosen = self.mode if val is not None else "value"
            val = raw.get("value") if val is None else val
        else:
            val, chosen = raw, "value"
        self.used[key] = {"value": float(val), "end": chosen}
        if self.mode in ("low", "high") and chosen == "value":
            self.used[key]["range_missing"] = True  # §8.6.3 p.81: conservative end needed, no range in the pack
        return float(val)

    def fixed(self, key: str) -> float:
        v = float(self.rules.require(key))
        self.used[key] = {"value": v, "end": "fixed"}
        return v


def _num(d: Mapping[str, Any], key: str, what: str, *, default: float | None = None) -> float:
    v = d.get(key)
    if v is None:
        if default is not None:
            return default
        raise ValidationFailed(f"Activity data for {what} is missing “{key}”.", code="ACTIVITY_DATA_INCOMPLETE",
                               details={"attribute": key, "what": what})
    if isinstance(v, bool) or not isinstance(v, (int, float)) or v < 0 or math.isnan(float(v)):
        raise ValidationFailed(f"Activity data for {what}: “{key}” must be a non-negative number.",
                               code="ACTIVITY_DATA_INVALID", details={"attribute": key, "what": what, "value": v})
    return float(v)


def _items(attrs: Mapping[str, Any], key: str) -> list[Mapping[str, Any]]:
    v = attrs.get(key) or []
    if not isinstance(v, list) or not all(isinstance(x, dict) for x in v):
        raise ValidationFailed(f"Activity attribute “{key}” must be a list of entries.", code="ACTIVITY_DATA_INVALID",
                               details={"attribute": key})
    return v


def _entries(attrs: Mapping[str, Any], list_key: str, flat: Mapping[str, str], when: str) -> list[Mapping[str, Any]]:
    """The itemised ``list_key`` entries, or - when there is no list - one entry built from the flat Table 4
    attributes (``flat``: item key -> attribute key), provided ``when`` is recorded. A list wins over flat
    values, so a record carrying both is counted once."""
    items = _items(attrs, list_key)
    if items or attrs.get(when) is None:
        return items
    return [{ik: attrs[ak] for ik, ak in flat.items() if attrs.get(ak) is not None}]


def _field_total(attrs: Mapping[str, Any], total_key: str | None, rate_key: str, area_ha: float | None, what: str,
                 *, scale: float = 1.0) -> float | None:
    """A whole-field quantity: ``total_key`` if recorded, else ``rate_key`` (per hectare) x field area x scale."""
    if total_key and attrs.get(total_key) is not None:
        return _num(attrs, total_key, what)
    if attrs.get(rate_key) is None:
        return None
    rate = _num(attrs, rate_key, what)
    if not area_ha or area_ha <= 0:
        raise ValidationFailed(f"Activity data for {what} is per hectare, but the field has no area.",
                               code="ACTIVITY_DATA_INCOMPLETE", details={"attribute": rate_key})
    return rate * area_ha * scale


AMENDMENT_EXEMPTIONS = ("produced_on_site", "diverted_from_anaerobic_storage", "not_previously_used_as_amendment")


def amendment_entries(attrs: Mapping[str, Any]) -> list[Mapping[str, Any]]:
    """Imported amendments (Eq. 33): the ``amendments`` list, or the flat Table 4 form, where ``exemption``
    names one of :data:`AMENDMENT_EXEMPTIONS`."""
    if _items(attrs, "amendments"):
        return _items(attrs, "amendments")
    items = _entries(attrs, "amendments", {"type": "amendment_type", "mass_t": "mass_t",
                                           "carbon_content": "carbon_content"}, "mass_t")
    ex = _slug(attrs.get("exemption"))
    return [{**it, **({ex: True} if ex in AMENDMENT_EXEMPTIONS else {})} for it in items]


def _slug(s: Any) -> str:
    return str(s or "").strip().lower().replace(" ", "_").replace("-", "_")


# ================================================================ per-record source totals
def source_total(source: str, acts: Sequence[Activity], F: Factors,
                 area_ha: float | None = None) -> tuple[float, dict[str, Any]]:
    """Total (t CO2e) of one source for one field/scenario/year, with the inputs used. ``area_ha`` converts
    per-hectare Table 4 rates to field totals."""
    cat = SOURCES[source][0]
    recs = [a for a in acts if a.category == cat]
    if not recs:
        return 0.0, {}
    total = 0.0
    detail: dict[str, Any] = {}
    if source == "co2_fossil_fuel":
        litres: dict[str, float] = defaultdict(float)
        for a in recs:
            for it in _items(a.attributes, "fuels"):
                litres[_slug(it.get("fuel"))] += _num(it, "litres", "fossil fuel")
            for k, fuel in (("diesel_l", "diesel"), ("gasoline_l", "gasoline"), ("petrol_l", "gasoline")):
                if a.attributes.get(k) is not None:
                    litres[fuel] += _num(a.attributes, k, "fossil fuel")
        for fuel, l_ in sorted(litres.items()):
            fuel = "gasoline" if fuel == "petrol" else fuel
            ef = F.fixed(f"ef_{fuel}") if fuel in ("diesel", "gasoline") else F.get(f"EF_CO2_{fuel}")
            total += eq7_fossil_fuel(l_, ef)
        detail = {"litres": dict(sorted(litres.items()))}
    elif source == "co2_liming":
        mass = {"limestone": 0.0, "dolomite": 0.0}
        for a in recs:
            for kind in mass:
                v = _field_total(a.attributes, f"{kind}_t", f"{kind}_t_ha", area_ha, "liming")
                if v is None and a.attributes.get(kind) is True:
                    _num(a.attributes, f"{kind}_t", "liming")  # says yes but gives no amount: refused
                mass[kind] += v or 0.0
        ls, dol = mass["limestone"], mass["dolomite"]
        if ls or dol:
            total = eq9_liming(ls, dol, F.fixed("ef_limestone"), F.fixed("ef_dolomite"))
        detail = {"limestone_t": ls, "dolomite_t": dol}
    elif source == "n2o_fertilizer":
        sf: list[tuple[float, float]] = []
        of: list[tuple[float, float]] = []
        for a in recs:
            at = a.attributes
            for it in _items(at, "synthetic_fertilizers"):
                sf.append((_num(it, "mass_t", "synthetic fertiliser"), _num(it, "n_content", "synthetic fertiliser")))
            for it in _items(at, "organic_fertilizers"):
                of.append((_num(it, "mass_t", "organic fertiliser"), _num(it, "n_content", "organic fertiliser")))
            if at.get("synthetic_n_t") is not None:
                sf.append((_num(at, "synthetic_n_t", "synthetic fertiliser"), 1.0))
            elif not _items(at, "synthetic_fertilizers") and at.get("synthetic_n_rate_kg_n_ha") is not None:
                # Table 4 rate (kg N/ha) x field area -> t N
                sf.append((_field_total(at, None, "synthetic_n_rate_kg_n_ha", area_ha, "synthetic fertiliser",
                                        scale=0.001), 1.0))
            if at.get("organic_n_t") is not None:
                of.append((_num(at, "organic_n_t", "organic fertiliser"), 1.0))
            elif not _items(at, "organic_fertilizers"):
                for kind in ("manure", "compost"):  # Table 4 rate (t/ha) x area x N content from the rule pack
                    if at.get(kind) is True and at.get(f"{kind}_rate_t_ha") is not None:
                        of.append((_field_total(at, None, f"{kind}_rate_t_ha", area_ha, kind),
                                   F.get(f"N_content_{kind}")))
            if at.get("synthetic_n") is True and not _items(at, "synthetic_fertilizers") \
                    and at.get("synthetic_n_t") is None and at.get("synthetic_n_rate_kg_n_ha") is None:
                raise ValidationFailed("A fertiliser record says synthetic N was applied but gives no amounts.",
                                       code="ACTIVITY_DATA_INCOMPLETE", details={"record_id": a.record_id})
            if any(at.get(k) is True and at.get(f"{k}_rate_t_ha") is None for k in ("manure", "compost")) \
                    and not _items(at, "organic_fertilizers") and at.get("organic_n_t") is None:
                raise ValidationFailed("A fertiliser record says manure/compost was applied but gives no amounts.",
                                       code="ACTIVITY_DATA_INCOMPLETE", details={"record_id": a.record_id})
        fsn, fon = eq19_fsn(sf), eq20_fon(of)
        if fsn or fon:
            fac = {k: F.get(k) for k in ("EF_Ndirect", "EF_Nvolat", "EF_Nleach", "Frac_GASF", "Frac_GASM",
                                         "Frac_LEACH")}
            parts = eq17_fertilizer(fsn, fon, fac, F.fixed("gwp_n2o"))
            total = parts["total"]
            detail = {"FSN_t_n": fsn, "FON_t_n": fon, **{f"{k}_t_co2e": v for k, v in parts.items()}}
        else:
            detail = {"FSN_t_n": 0.0, "FON_t_n": 0.0}
    elif source == "n2o_n_fixing":
        items = []
        for a in recs:
            at = a.attributes
            listed = _items(at, "species") if isinstance(at.get("species"), list) else []
            for it in listed:
                items.append((_num(it, "dry_matter_t", "N-fixing species"), _num(it, "n_content", "N-fixing species")))
            if not listed and at.get("dry_matter_t_ha") is not None:
                items.append((_field_total(at, None, "dry_matter_t_ha", area_ha, "N-fixing species"),
                              _num(at, "n_content", "N-fixing species")))
        fcr = eq25_fcr(items)
        if fcr:
            total = eq24_n_fixing(fcr, F.get("EF_Ndirect"), F.fixed("gwp_n2o"))
        detail = {"F_CR_t_n": fcr}
    elif source in ("ch4_enteric", "ch4_manure", "n2o_manure"):
        animals = [it for a in recs for it in _entries(
            a.attributes, "animals", {"type": "animal_type", "population": "population_head",
                                      "weight_kg": "avg_weight_kg", "awms": "awms", "days_on_site": "days_on_site"},
            "population_head")]
        per: list[dict[str, Any]] = []
        for it in animals:
            kind = _slug(it.get("type"))
            if not kind:
                raise ValidationFailed("A livestock entry has no animal type.", code="ACTIVITY_DATA_INCOMPLETE")
            pop = _num(it, "population", f"livestock ({kind})")
            pop *= _num(it, "days_on_site", f"livestock ({kind})", default=365.0) / 365.0
            if pop == 0:
                continue
            if source == "ch4_enteric":
                v = eq11_enteric(pop, F.get(f"EF_ent_{kind}"), F.fixed("gwp_ch4"))
            elif source == "ch4_manure":
                vs_rate = _num(it, "vs_rate", kind) if it.get("vs_rate") is not None else F.get(f"VS_rate_{kind}")
                vs = eq13_vs(vs_rate, _num(it, "weight_kg", f"livestock ({kind})"))
                v = eq12_manure_ch4(pop, vs, _num(it, "awms", f"livestock ({kind})"), F.get(f"EF_CH4_md_{kind}"),
                                    F.fixed("gwp_ch4"))
            else:
                nex = _num(it, "nex_kg_n", kind) if it.get("nex_kg_n") is not None else F.get(f"Nex_{kind}")
                # MS: a default of 1 is allowed by the methodology (§8.2.9).
                fm = eq27_f_manure(pop, nex, _num(it, "awms", f"livestock ({kind})"),
                                   _num(it, "ms", kind, default=1.0))
                ef_key = f"EF_N2O_md_{kind}" if f"EF_N2O_md_{kind}" in F.table() else "EF_N2O_md"
                fac = {"EF_N2O_md": F.get(ef_key), "Frac_GASM": F.get("Frac_GASM"), "EF_Nvolat": F.get("EF_Nvolat"),
                       "Frac_LEACH": F.get("Frac_LEACH"), "EF_Nleach": F.get("EF_Nleach")}
                v = eq26_31_manure_n2o(fm, fac, F.fixed("gwp_n2o"))["total"]
            per.append({"type": kind, "population": pop, "t_co2e": v})
            total += v
        detail = {"animals": per}
    elif source in ("ch4_biomass_burning", "n2o_biomass_burning"):
        per = []
        for a in recs:
            for it in _entries(a.attributes, "burns", {"residue": "residue_type", "mass_t": "mass_burned_t",
                                                       "combustion_factor": "combustion_factor"}, "mass_burned_t"):
                res = _slug(it.get("residue"))
                mass_kg = _num(it, "mass_t", f"burning ({res})") * 1000.0
                cf = _num(it, "combustion_factor", res) if it.get("combustion_factor") is not None \
                    else F.get(f"CF_{res}")
                if source == "ch4_biomass_burning":
                    v = eq14_burning_ch4(mass_kg, cf, F.get(f"EF_CH4_bb_{res}"), F.fixed("gwp_ch4"))
                else:
                    v = eq32_burning_n2o(mass_kg, cf, F.get(f"EF_N2O_bb_{res}"), F.fixed("gwp_n2o"))
                per.append({"residue": res, "mass_kg_dm": mass_kg, "cf": cf, "t_co2e": v})
                total += v
        detail = {"burns": per}
    return float(total), detail


# ================================================================ livestock floor (§8.3 p.48, §8.4.2 p.52)
LIVESTOCK_SLAUGHTER_FLAG = "production_maintained_slaughtered"  # §8.4.2 (b), set only with evidence


def _herd(acts: Sequence[Activity]) -> dict[str, tuple[float, Mapping[str, Any]]]:
    """Effective head (population × days/365) per animal type, with one entry kept as the attribute template."""
    out: dict[str, tuple[float, Mapping[str, Any]]] = {}
    for a in acts:
        if a.category != "livestock":
            continue
        for it in _entries(a.attributes, "animals", {"type": "animal_type", "population": "population_head",
                                                      "weight_kg": "avg_weight_kg", "awms": "awms",
                                                      "days_on_site": "days_on_site"}, "population_head"):
            kind = _slug(it.get("type"))
            if not kind:
                continue
            pop = _num(it, "population", f"livestock ({kind})") * \
                _num(it, "days_on_site", f"livestock ({kind})", default=365.0) / 365.0
            prev = out.get(kind)
            out[kind] = ((prev[0] if prev else 0.0) + pop, prev[1] if prev else it)
    return out


def livestock_floor(project_acts: Sequence[Activity], lookback: Sequence[Sequence[Activity]], field_id: str,
                    year: int) -> tuple[list[Activity], list[dict[str, Any]]]:
    """§8.3 (p.48): where livestock are in the baseline, the project uses at least the look-back average
    population. §8.4.2 (p.52): when the population declines, either (a) use the baseline population in the
    project emissions and quantify displacement leakage (VMD0054, Eq. 36), or (b) show production did not
    decrease and the animals were slaughtered, not displaced (``production_maintained_slaughtered`` on the
    project record) — then the project population is used and LK_disp = 0. Returns the project activities to
    use (option (a) adds the missing head at the look-back attributes) and one item per animal type that fell."""
    years = [_herd(y) for y in lookback if any(a.category == "livestock" for a in y)]
    if not years:
        return list(project_acts), []
    kinds = sorted({k for y in years for k in y})
    avg = {k: sum(y.get(k, (0.0, {}))[0] for y in years) / len(years) for k in kinds}
    proj = _herd(project_acts)
    option_b = any(a.category == "livestock" and a.attributes.get(LIVESTOCK_SLAUGHTER_FLAG) is True
                   for a in project_acts)
    out, items, extra = list(project_acts), [], []
    for k in kinds:
        have = proj.get(k, (0.0, {}))[0]
        if have + _TOL >= avg[k]:
            continue
        template = next(y[k][1] for y in years if k in y)
        item = {"field_id": field_id, "year": year, "type": k, "lookback_average_head": round(avg[k], 6),
                "project_head": round(have, 6), "option": "b" if option_b else "a"}
        if not option_b:
            extra.append({**{kk: v for kk, v in template.items() if kk not in ("population", "days_on_site")},
                          "type": k, "population": avg[k] - have})
        items.append(item)
    if extra:
        out.append(Activity(field_id, "project", year, "livestock", {"animals": extra}, 0, f"floor:{field_id}:{year}"))
    return out, items


_TOL = 1e-9


# ================================================================ result
@dataclass(frozen=True)
class EmissionsResult:
    years: tuple[int, ...]
    year_weights: dict[int, float]
    sources: dict[str, dict[str, Any]]  # per source: totals, mode, per-year
    by_year: dict[int, dict[str, float]]  # year -> source -> reduction (t CO2e, weighted)
    leakage_oa_by_year: dict[int, float]
    leakage_items: tuple[dict[str, Any], ...]
    biochar_t_co2e: float
    biochar_items: tuple[dict[str, Any], ...]
    units: tuple[dict[str, Any], ...]
    fields: tuple[dict[str, Any], ...]
    trail: tuple[dict[str, Any], ...]
    tiers: dict[str, int]
    skipped_sources: tuple[str, ...]
    warnings: tuple[str, ...]
    factors_used: dict[str, dict[str, Any]] = field(default_factory=dict)
    livestock_floor: tuple[dict[str, Any], ...] = ()  # §8.3/§8.4.2 adjustments, one per field-year-type
    displacement_leakage_required: bool = False  # option (a) applied somewhere: LK_disp must be quantified

    def reduction(self, source: str, year: int | None = None) -> float:
        if year is None:
            return float(self.sources.get(source, {}).get("reduction_t_co2e", 0.0))
        return float(self.by_year.get(year, {}).get(source, 0.0))

    def to_dict(self) -> dict[str, Any]:
        return {
            "years": list(self.years), "year_weights": {str(k): v for k, v in self.year_weights.items()},
            "sources": self.sources, "by_year": {str(k): v for k, v in self.by_year.items()},
            "leakage_oa_by_year": {str(k): v for k, v in self.leakage_oa_by_year.items()},
            "leakage_items": list(self.leakage_items), "biochar_t_co2e": self.biochar_t_co2e,
            "biochar_items": list(self.biochar_items), "units": list(self.units), "fields": list(self.fields),
            "trail": list(self.trail), "tiers": self.tiers, "skipped_sources": list(self.skipped_sources),
            "warnings": list(self.warnings), "factors_used": self.factors_used,
            "livestock_floor": list(self.livestock_floor),
            "displacement_leakage_required": self.displacement_leakage_required,
        }


def latest_versions(acts: Sequence[Activity]) -> list[Activity]:
    """Highest version per record id (the caller removes voided rows)."""
    best: dict[str, Activity] = {}
    for a in acts:
        k = a.record_id or f"{a.field_id}:{a.scenario}:{a.year}:{a.category}:{id(a)}"
        if k not in best or a.version > best[k].version:
            best[k] = a
    return list(best.values())


def baseline_year_for(year: int, baseline_years: Sequence[int], project_start_year: int) -> int | None:
    """Baseline schedule year for a project year (§6 p.14 fn 8: the look-back schedule repeats every x years)."""
    if year in baseline_years:
        return year
    lookback = sorted(y for y in set(baseline_years) if y < project_start_year)
    if not lookback:
        return None
    return lookback[(year - project_start_year) % len(lookback)]


def _qa_checks(rules: RuleSet) -> tuple[list[str], list[str]]:
    active, skipped = [], []
    for src, rule_key in QA_RULE.items():
        qa = rules.require(rule_key)
        if src in SOIL_N2O_SOURCES and qa == "qa1":
            skipped.append(src)  # quantified by the QA1 model term (Eq. 15)
            continue
        if qa != "qa3":
            raise Blocked(f"VM0042 v2.2 Table 5 requires default factors (QA3) for {SOURCES[src][2]}.",
                          code="APPROACH_NOT_PERMITTED", details={"rule_key": rule_key, "value": qa})
        active.append(src)
    return active, skipped


def quantify(inp: EmissionsInput, rules: RuleSet) -> EmissionsResult:
    """Baseline and project emissions per source, field, QU and year; reductions Σ_i (bsl − wp) × A_i."""
    active, skipped = _qa_checks(rules)
    years = tuple(sorted(inp.year_weights))
    field_unit: dict[str, QuantUnit] = {}
    for u in inp.units:
        for f in u.field_ids:
            field_unit.setdefault(f, u)
    acts = latest_versions(inp.activities)
    warnings: list[str] = []
    stray = sorted({a.field_id for a in acts} - set(field_unit))
    if stray:
        warnings.append(f"{len(stray)} field(s) with activity data are not in any project zone and were ignored.")
    acts = [a for a in acts if a.field_id in field_unit]
    tiers: dict[str, int] = defaultdict(int)
    for a in acts:
        tiers[str(a.data_tier)] += 1

    idx: dict[tuple[str, str, int], list[Activity]] = defaultdict(list)
    base_years: dict[str, set[int]] = defaultdict(set)
    for a in acts:
        idx[(a.field_id, a.scenario, a.year)].append(a)
        if a.scenario == "baseline":
            base_years[a.field_id].add(a.year)

    # §8.3 / §8.4.2: project livestock never below the look-back average unless option (b) is evidenced
    floor_items: list[dict[str, Any]] = []
    for (f, scen, y) in sorted(k for k in list(idx) if k[1] == "project"):
        lookback = [idx[(f, "baseline", by)] for by in sorted(base_years.get(f, ()))
                    if by < inp.project_start_year]
        idx[(f, scen, y)], items = livestock_floor(idx[(f, scen, y)], lookback, f, y)
        floor_items += items
    need_disp = any(i["option"] == "a" for i in floor_items)
    if need_disp:
        msg = (f"Livestock fell below the look-back average on {len({(i['field_id'], i['year']) for i in floor_items if i['option'] == 'a'})} "
               "field-year(s): project emissions use the look-back population and displacement leakage (VMD0054, "
               "Eq. 36) must be quantified (VM0042 §8.4.2 a).")
        if inp.displacement_leakage_available is False:
            raise Blocked(msg + " No approved displacement-leakage estimate exists for this period.",
                          code="DISPLACEMENT_LEAKAGE_REQUIRED",
                          details={"items": [i for i in floor_items if i["option"] == "a"]})
        if inp.displacement_leakage_available is None:
            warnings.append(msg)
    if any(i["option"] == "b" for i in floor_items):
        warnings.append("Livestock fell below the look-back average where the record states production was "
                        "maintained and animals were slaughtered, not displaced (§8.4.2 b): the verifier must see "
                        "the evidence.")

    # the (field, year) → baseline year actually used, and completeness of project data (non-conservative gaps)
    mapping: dict[tuple[str, int], int | None] = {}
    gaps = []
    for f in sorted(field_unit):
        for y in years:
            by = baseline_year_for(y, sorted(base_years.get(f, ())), inp.project_start_year)
            mapping[(f, y)] = by
            if by is None:
                continue
            bcats = {a.category for a in idx.get((f, "baseline", by), [])} & set(EMISSION_CATEGORIES)
            pcats = {a.category for a in idx.get((f, "project", y), [])}
            for c in sorted(bcats - pcats):
                gaps.append({"field_id": f, "year": y, "category": c, "baseline_year": by})
    if gaps:
        raise Blocked(
            f"{len(gaps)} project-year activity record(s) are missing for categories practised in the baseline. "
            "Record the project activity (zero if not practised) so emissions are not under-stated.",
            code="ACTIVITY_DATA_INCOMPLETE", details={"missing": gaps[:50]},
        )

    def run(mode_for: Mapping[str, str]) -> tuple[dict, list, dict]:
        per: dict[tuple[str, str, str, int], float] = {}
        trail: list[dict[str, Any]] = []
        used: dict[str, dict[str, Any]] = {}
        for src in active:
            F = Factors(rules, mode_for.get(src, "value"))
            for f in sorted(field_unit):
                for y in years:
                    for scen, yy in (("project", y), ("baseline", mapping[(f, y)])):
                        if yy is None:
                            per[(src, f, scen, y)] = 0.0
                            continue
                        v, det = source_total(src, idx.get((f, scen, yy), []), F, inp.field_areas.get(f))
                        per[(src, f, scen, y)] = v
                        if det and v:
                            trail.append({"source": src, "eq": SOURCES[src][1], "field_id": f, "scenario": scen,
                                          "year": y, "data_year": yy, "t_co2e": v, "inputs": det,
                                          "factor_end": F.mode})
            for k, u in F.used.items():
                used[f"{src}:{k}"] = u
        return per, trail, used

    central, _, _ = run({})
    modes: dict[str, str] = {}
    for src in active:
        wp = sum(central[(src, f, "project", y)] * inp.year_weights[y] for f in field_unit for y in years)
        bsl = sum(central[(src, f, "baseline", y)] * inp.year_weights[y] for f in field_unit for y in years)
        modes[src] = "value" if wp == bsl else ("low" if wp < bsl else "high")
    final, trail, used = run(modes)

    sources: dict[str, dict[str, Any]] = {}
    by_year: dict[int, dict[str, float]] = {y: {} for y in years}
    units_out: list[dict[str, Any]] = []
    for src in active:
        per_year = []
        tb = tw = 0.0
        for y in years:
            w = inp.year_weights[y]
            red_y = 0.0
            b_y = p_y = 0.0
            for u in inp.units:
                ub = sum(final[(src, f, "baseline", y)] for f in u.field_ids if field_unit.get(f) is u)
                up = sum(final[(src, f, "project", y)] for f in u.field_ids if field_unit.get(f) is u)
                mb, mp = areal(ub, u.area_ha), areal(up, u.area_ha)
                red = (mb - mp) * u.area_ha * w  # Eq. 52–59: Σ_i (bsl − wp) × A_i
                red_y += red
                b_y += ub * w
                p_y += up * w
                if ub or up:
                    units_out.append({"source": src, "unit": u.code, "year": y, "area_ha": u.area_ha,
                                      "baseline_t_co2e_ha": mb, "project_t_co2e_ha": mp, "weight": w,
                                      "reduction_t_co2e": red})
            by_year[y][src] = red_y
            per_year.append({"year": y, "baseline_t_co2e": b_y, "project_t_co2e": p_y, "reduction_t_co2e": red_y})
            tb += b_y
            tw += p_y
        sources[src] = {"label": SOURCES[src][2], "eq": SOURCES[src][1], "symbol": SOURCES[src][3],
                        "approach": "qa3", "ef_end": {"value": "central", "low": "low", "high": "high"}[modes[src]],
                        "baseline_t_co2e": tb, "project_t_co2e": tw, "reduction_t_co2e": tb - tw,
                        "per_year": per_year}

    fields_out = []
    for f in sorted(field_unit):
        area = float(inp.field_areas.get(f) or 0.0)
        for y in years:
            row: dict[str, Any] = {"field_id": f, "unit": field_unit[f].code, "year": y,
                                   "baseline_data_year": mapping[(f, y)], "area_ha": area}
            for scen in ("baseline", "project"):
                tot = sum(final[(src, f, scen, y)] for src in active)
                row[f"{scen}_t_co2e"] = tot
                row[f"{scen}_t_co2e_ha"] = tot / area if area > 0 else None
            fields_out.append(row)

    # ---- organic-amendment leakage (Eq. 33) with the three exemptions
    retention = None
    leak_by_year: dict[int, float] = {y: 0.0 for y in years}
    leak_items: list[dict[str, Any]] = []
    for f in sorted(field_unit):
        for y in years:
            proj = [it for a in idx.get((f, "project", y), []) if a.category == "organic_amendment_import"
                    for it in amendment_entries(a.attributes)]
            if not proj:
                continue
            by = mapping[(f, y)]
            base = [it for a in idx.get((f, "baseline", by), []) if a.category == "organic_amendment_import"
                    for it in amendment_entries(a.attributes)] if by is not None else []
            base_mass: dict[str, float] = defaultdict(float)
            for it in base:
                base_mass[_slug(it.get("type"))] += _num(it, "mass_t", "baseline amendment")
            for it in proj:
                kind = _slug(it.get("type"))
                mass = _num(it, "mass_t", f"amendment ({kind})")
                exempt = next((e for e in AMENDMENT_EXEMPTIONS if it.get(e) is True), None)
                additional = max(0.0, mass - base_mass.get(kind, 0.0))
                base_mass[kind] = max(0.0, base_mass.get(kind, 0.0) - mass)
                value = 0.0
                cc = None
                if exempt is None and additional > 0:
                    cc = _num(it, "carbon_content", f"amendment ({kind})")
                    if retention is None:
                        retention = float(rules.require("manure_c_retention"))
                    value = eq33_leakage_oa(additional, cc, retention) * inp.year_weights[y]
                leak_by_year[y] += value
                leak_items.append({"field_id": f, "year": y, "type": kind, "mass_t": mass, "additional_t": additional,
                                   "carbon_content": cc, "exemption": exempt, "weight": inp.year_weights[y],
                                   "le_oa_t_co2e": value, "eq": "Eq. 33"})

    # ---- biochar organic carbon to subtract from the project SOC change (§4 cond. 7)
    biochar = 0.0
    bio_items = []
    for a in acts:
        if a.category != "biochar" or a.scenario != "project" or a.year not in set(inp.biochar_years):
            continue
        at = a.attributes
        if at.get("organic_carbon_t") is not None:
            c = _num(at, "organic_carbon_t", "biochar")
        else:
            c = _num(at, "mass_t", "biochar") * _num(at, "organic_carbon_fraction", "biochar")
        biochar += c * CO2_PER_C
        bio_items.append({"field_id": a.field_id, "year": a.year, "organic_carbon_t": c, "t_co2e": c * CO2_PER_C})

    no_range = sorted({k.split(":", 1)[-1] for k, u in used.items() if u.get("range_missing")})
    if no_range:
        warnings.append("VM0042 §8.6.3 (p.81) requires the low/high end of each factor's uncertainty range, but the "
                        f"rule pack gives only a central value for: {', '.join(no_range)}. Enter the range, or "
                        "document that none is published.")
    return EmissionsResult(
        years=years, year_weights=dict(inp.year_weights), sources=sources, by_year=by_year,
        leakage_oa_by_year=leak_by_year, leakage_items=tuple(leak_items), biochar_t_co2e=biochar,
        biochar_items=tuple(sorted(bio_items, key=lambda x: (x["field_id"], x["year"]))),
        units=tuple(units_out), fields=tuple(fields_out), trail=tuple(trail), tiers=dict(sorted(tiers.items())),
        skipped_sources=tuple(skipped), warnings=tuple(warnings), factors_used=dict(sorted(used.items())),
        livestock_floor=tuple(floor_items), displacement_leakage_required=need_disp,
    )
