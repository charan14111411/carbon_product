"""Every rule a methodology pack can hold, aligned to Verra VM0042 v2.2 (21 Oct 2025).

Values are NEVER defaulted in code: the methodology owner enters each one with its source,
and a second person approves. Where VM0042 itself fixes a value, the rule carries it as
``vm0042_default`` together with the place it is written (``vm0042_ref``); the owner can
fill those in one step (``POST /rule-packs/{id}/apply-vm0042-defaults``) but they are still
stored in the pack, with their source, and approved by a second person. Rules without a
methodology-fixed value (e.g. the non-permanence risk rating from the AFOLU risk tool or
the emission-factor table) are always left to the owner.

``required`` rules must be answered before a pack can be approved. ``required_if``
makes a rule required only when another rule has a given value.

Reference: docs/VM0042_v2.2_REQUIREMENTS.md (section and printed page numbers).
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any

VM0042_DOCUMENT = "Verra VM0042 v2.2 (21 Oct 2025)"


@dataclass(frozen=True)
class RuleDef:
    key: str
    label: str
    group: str
    kind: str  # number | integer | boolean | choice | list | text | factors
    help: str
    required: bool = True
    choices: tuple[str, ...] = ()
    unit: str = ""
    min: float | None = None
    max: float | None = None
    required_if: tuple[str, Any] | None = None
    example: Any = None
    extra: dict = field(default_factory=dict)
    vm0042_ref: str = ""  # e.g. "§8.6.4 Eq. 74 p.82"
    vm0042_default: Any = None  # only where the methodology itself fixes the value
    warning_choices: tuple[str, ...] = ()  # allowed, but reported as a conformance warning

    def ref_parts(self) -> tuple[str | None, str | None]:
        """(section, page) parsed from ``vm0042_ref``: "§8.6.4 Eq. 74 p.82" → ("§8.6.4 Eq. 74", "82")."""
        if not self.vm0042_ref:
            return None, None
        m = re.search(r"\bp\.\s*([0-9][0-9–\-, ]*)\s*$", self.vm0042_ref)
        if not m:
            return self.vm0042_ref.strip(), None
        return self.vm0042_ref[: m.start()].strip(" ;,") or None, m.group(1).strip()


GROUPS = {
    "approach": "Quantification approach",
    "stock": "Soil carbon stock",
    "sampling": "Sampling design",
    "controls": "Baseline control sites",
    "eligibility": "Eligibility & baseline",
    "lab": "Laboratory",
    "emissions": "Emissions & leakage (QA3)",
    "terms": "Manual project terms",
    "woody": "Woody biomass (AR-TOOL14)",
    "uncertainty": "Uncertainty & buffer",
    "records": "Records",
    "field": "Field quality checks",
}

_QA3_ONLY = ("qa3",)

# IPCC 2019 Refinement Vol 4 Table 11.1/11.3 aggregated defaults with their uncertainty ranges.
# Only an *example* of what an owner enters — never used by code unless entered into a pack.
EXAMPLE_FACTORS: dict[str, Any] = {
    "EF_Ndirect": {"value": 0.010, "low": 0.001, "high": 0.018, "unit": "t N2O-N / t N"},
    "EF_Nvolat": {"value": 0.010, "low": 0.002, "high": 0.018, "unit": "t N2O-N / t N volatilised"},
    "EF_Nleach": {"value": 0.011, "low": 0.000, "high": 0.020, "unit": "t N2O-N / t N leached"},
    "Frac_GASF": {"value": 0.11, "low": 0.02, "high": 0.33, "unit": "fraction"},
    "Frac_GASM": {"value": 0.21, "low": 0.00, "high": 0.31, "unit": "fraction"},
    "Frac_LEACH": {"value": 0.24, "low": 0.01, "high": 0.73, "unit": "fraction"},
    "EF_N2O_md": {"value": 0.004, "low": 0.000, "high": 0.014, "unit": "kg N2O-N / kg N"},
    "EF_ent_dairy_cattle": {"value": 72, "low": 58, "high": 86, "unit": "kg CH4/head/yr"},
    "VS_rate_dairy_cattle": {"value": 8.4, "unit": "kg VS/1000 kg mass/day"},
    "EF_CH4_md_dairy_cattle": {"value": 0.47, "unit": "g CH4/kg VS"},
    "Nex_dairy_cattle": {"value": 60, "unit": "kg N/animal/yr"},
    "synthetic_n_kg": 0.00598,
}

RULES: tuple[RuleDef, ...] = (
    # ---------------------------------------------------------------- approach (Table 5)
    RuleDef("qa_soc", "SOC quantification approach", "approach", "choice",
            "QA2 re-measures soil at project and baseline control sites; QA1 uses a validated process model "
            "(VMD0053) with true-up measurements.",
            choices=("qa1", "qa2"), example="qa2", vm0042_ref="§8.1 Table 5 p.20"),
    RuleDef("qa_n2o_soil", "Soil N2O approach (fertiliser, N-fixing, manure)", "approach", "choice",
            "QA3 default factors (Eq. 16–31) or a QA1 model (Eq. 15).",
            choices=("qa1", "qa3"), example="qa3", vm0042_ref="§8.1 Table 5 p.20"),
    RuleDef("qa_ch4_soil", "Soil methanogenesis CH4 approach", "approach", "choice",
            "Only QA1 is allowed (Eq. 10). Choose 'not applicable' when soils are not flooded.",
            choices=("qa1", "not_applicable"), example="not_applicable", vm0042_ref="§8.1 Table 5 p.20"),
    RuleDef("qa_fossil_fuel", "Fossil fuel CO2 approach", "approach", "choice",
            "Fossil-fuel CO2 is always quantified with default factors (Eq. 6–7).",
            choices=_QA3_ONLY, example="qa3", vm0042_ref="§8.1 Table 5 p.20", vm0042_default="qa3"),
    RuleDef("qa_liming", "Liming CO2 approach", "approach", "choice",
            "Liming CO2 is always quantified with default factors (Eq. 8–9).",
            choices=_QA3_ONLY, example="qa3", vm0042_ref="§8.1 Table 5 p.20", vm0042_default="qa3"),
    RuleDef("qa_enteric_ch4", "Enteric CH4 approach", "approach", "choice",
            "Enteric fermentation CH4 is always quantified with default factors (Eq. 11).",
            choices=_QA3_ONLY, example="qa3", vm0042_ref="§8.1 Table 5 p.20", vm0042_default="qa3"),
    RuleDef("qa_manure", "Manure CH4 approach", "approach", "choice",
            "Manure CH4 (Eq. 12–13) uses default factors; manure-deposition N2O follows the soil N2O approach.",
            choices=_QA3_ONLY, example="qa3", vm0042_ref="§8.1 Table 5 p.20", vm0042_default="qa3"),
    RuleDef("qa_biomass_burning", "Biomass burning CH4/N2O approach", "approach", "choice",
            "Biomass burning CH4 (Eq. 14) and N2O (Eq. 32) use default factors.",
            choices=_QA3_ONLY, example="qa3", vm0042_ref="§8.1 Table 5 p.20", vm0042_default="qa3"),
    RuleDef("modelled_soc_permitted", "Modelled values may be credited", "approach", "boolean",
            "Whether model (QA1) predictions may be used for crediting. Needs a VMD0053-validated model; "
            "normally No for QA2 projects.", example=False, vm0042_ref="§4 cond. 4 p.10; §8.1 p.20"),

    # ---------------------------------------------------------------- stock
    RuleDef("stock_method", "Stock method", "stock", "choice",
            "VM0042 requires SOC stock changes on an equivalent-soil-mass (ESM) basis. Fixed-depth sampling is "
            "accepted only with a mass correction (Ellert & Bettany) and is reported as a warning.",
            choices=("esm", "fixed_depth_with_mass_correction"), example="esm",
            warning_choices=("fixed_depth_with_mass_correction",),
            vm0042_ref="§8.2.1.3(7) p.32", vm0042_default="esm"),
    RuleDef("esm_interpolation", "ESM interpolation", "stock", "choice",
            "How the cumulative SOC–soil-mass curve is interpolated at the reference mass. VM0042 cites Wendt & "
            "Hauser (2013), a cubic spline, which reproduces the Figure 3 example (47.36 / 49.9 / 36.8 t C/ha at "
            "1950 Mg/ha). 'pchip' (monotone) and 'linear' differ slightly and are reported as a deviation.",
            choices=("cubic_spline", "pchip", "linear"), example="cubic_spline", required=False,
            required_if=("stock_method", "esm"), vm0042_ref="§8.2.1.6 p.36–37",
            warning_choices=("pchip", "linear")),
    RuleDef("stock_depth_cm", "Minimum reporting depth", "stock", "number",
            "SOC is reported to at least this depth (or to bedrock/hardpan, documented).",
            unit="cm", min=30, max=200, example=30, vm0042_ref="§8.2.1.3(7b) p.32", vm0042_default=30),
    RuleDef("esm_reference_mass_t_ha", "ESM reference soil mass (override)", "stock", "number",
            "Leave empty: the reference mass is the highest cumulative fine-soil mass to the reporting depth "
            "among compared samples. If entered, the larger of the two is used.", unit="t/ha", min=100,
            required=False, vm0042_ref="§8.2.1.6 p.36"),
    RuleDef("coarse_fragment_correction", "Exclude stones (> 2 mm) from soil mass", "stock", "boolean",
            "Soil mass excludes particles > 2 mm; with bulk-density data the measured coarse fraction is "
            "subtracted.", example=True, vm0042_ref="§8.2.1.3(4) p.32", vm0042_default=True),
    RuleDef("shallow_soil_allowed", "Accept shallow cores with evidence", "stock", "boolean",
            "Whether a core stopped by bedrock/hardpan may be reported to the sampled depth with a documented "
            "reason.", example=False, vm0042_ref="§8.2.1.3(7b) p.32"),

    # ---------------------------------------------------------------- sampling
    RuleDef("min_samples_per_stratum", "Minimum samples per zone (plan)", "sampling", "integer",
            "The floor on cores per zone in every sample plan.", min=2, max=500, example=5,
            vm0042_ref="§8.2.1.2 p.30"),
    RuleDef("min_composites_per_stratum", "Minimum composite samples per stratum", "sampling", "integer",
            "VM0042 says at least 3–5 composite samples per stratum should be taken for QA2 or true-up (a \"should\"; the platform enforces the floor set here).", min=3, max=500,
            example=3, vm0042_ref="§8.2.1.2 p.30", vm0042_default=3),
    RuleDef("sample_size_procedure", "Sample size procedure", "sampling", "text",
            "How the number of samples per zone is determined (e.g. Eq. 1–2 power analysis).",
            example="VM0042 v2.2 §8.2.1.3(11) Eq. 2 with pre-sampling variance, α 0.05, power 90 %",
            vm0042_ref="§8.2.1.3(11) Eq. 1–2 p.33–34"),
    RuleDef("sampling_design", "Monitoring design", "sampling", "choice",
            "Paired re-visits the same points (Eq. 71 covariance); independent draws new ones.",
            choices=("paired", "independent", "either"), example="paired", vm0042_ref="§8.6.2 Eq. 71 p.77"),
    RuleDef("unpaired_points_policy", "Unpaired points", "sampling", "choice",
            "What happens to a baseline point that was not re-visited.",
            choices=("block", "exclude_and_report"), example="exclude_and_report", vm0042_ref="§8.6.2 p.77"),
    RuleDef("monitoring_interval_min_years", "Minimum years between campaigns", "sampling", "number",
            "Shortest allowed gap between baseline and monitoring.", unit="years", min=0, max=20, example=3),
    RuleDef("monitoring_interval_max_years", "Maximum years between campaigns", "sampling", "number",
            "Longest allowed gap between campaigns.", unit="years", min=0, max=30, example=5,
            vm0042_ref="§8.1 p.20"),
    RuleDef("resample_min_depth_increments", "Depth increments at re-sampling", "sampling", "integer",
            "At re-sampling each core is split into at least this many depth increments (ESM, e.g. 0–30 and "
            "30–50 cm).", min=2, max=10, example=2, vm0042_ref="§8.2.1.3(7)(c) p.33", vm0042_default=2),
    RuleDef("season_window_days", "Same-season window", "sampling", "integer",
            "Same season ±N days day-of-year (§8.2.1.1 p.28). A platform choice, not a VM0042 value: leave empty "
            "to use the platform's standard window.", unit="days", min=1, max=120, required=False, example=45,
            vm0042_ref="§8.2.1.1 p.28"),
    RuleDef("remeasure_max_years", "SOC re-measurement at least every", "sampling", "number",
            "SOC must be measured at least this often.", unit="years", min=0.5, max=5, example=5,
            vm0042_ref="§8.1; §9.2 p.20", vm0042_default=5),
    RuleDef("ship_within_days", "Ship samples within", "sampling", "integer",
            "Samples are shipped to the lab within this many days of campaign completion.", unit="days",
            min=1, max=30, example=5, vm0042_ref="§8.2.1.3(5) p.32", vm0042_default=5),
    RuleDef("storage_max_days", "Maximum refrigerated storage", "sampling", "integer",
            "Refrigerated storage before analysis must not exceed 3 months.", unit="days", min=1, max=365,
            example=90, vm0042_ref="§8.2.1.3(5) p.32", vm0042_default=90),

    # ---------------------------------------------------------------- control sites
    RuleDef("min_control_sites", "Minimum baseline control sites", "controls", "integer",
            "At least 3 control sites across the project and at least one per stratum (QA2).", min=3, max=100,
            example=3, vm0042_ref="§8.2 p.25", vm0042_default=3),
    RuleDef("control_site_max_km", "Maximum control-site distance", "controls", "number",
            "Control sites lie within this distance of their quantification unit.", unit="km", min=1, max=250,
            example=250, vm0042_ref="§8.2 p.25", vm0042_default=250),
    RuleDef("weather_station_max_km", "Maximum weather-station distance", "controls", "number",
            "Closest continuous weather station (or synthetic station).", unit="km", min=1, max=50, example=50,
            vm0042_ref="Table 6; Table 7 note c p.25, 27", vm0042_default=50),
    RuleDef("precip_similarity_mm", "Precipitation similarity", "controls", "number",
            "Mean annual precipitation of control site and QU within ± this value.", unit="mm", min=1, max=100,
            example=100, vm0042_ref="Table 7 p.27", vm0042_default=100),

    # ---------------------------------------------------------------- eligibility & baseline
    RuleDef("lookback_years", "Land-use look-back", "eligibility", "integer",
            "Years of land-use history that must be shown (native-ecosystem clearing exclusion).", unit="years",
            min=0, max=50, example=10, vm0042_ref="§4 cond. 5 p.11", vm0042_default=10),
    RuleDef("native_clearing_exclusion_years", "Native-ecosystem clearing exclusion", "eligibility", "integer",
            "Not applicable if native ecosystems were cleared within this many years before project start.",
            unit="years", min=10, max=50, example=10, vm0042_ref="§4 cond. 5 p.11", vm0042_default=10),
    RuleDef("excluded_conversions", "Disqualifying land uses", "eligibility", "list",
            "Land uses within the look-back that make a field ineligible.", example=["forest", "wetland"],
            vm0042_ref="§4 cond. 3, 5, 8 p.9–11"),
    RuleDef("lookback_min_years", "Baseline look-back period", "eligibility", "integer",
            "Historical look-back for the baseline schedule of activities: at least 3 years and one full rotation.",
            unit="years", min=3, max=30, example=3, vm0042_ref="§6 p.14", vm0042_default=3),
    RuleDef("practice_change_threshold_pct", "Practice-change threshold", "eligibility", "number",
            "A quantitative practice change must exceed this share of the look-back average.", unit="%",
            min=5, max=100, example=5, vm0042_ref="§4 cond. 2 p.9", vm0042_default=5),
    RuleDef("common_practice_threshold_pct", "Common-practice threshold", "eligibility", "number",
            "Adoption rate of the practice in the region must be below this value.", unit="%", min=0.1, max=20,
            example=20, vm0042_ref="§7 p.17", vm0042_default=20),
    RuleDef("baseline_reassess_years", "Baseline reassessment interval", "eligibility", "integer",
            "The baseline schedule is re-evaluated at least this often (5 recommended).", unit="years", min=1,
            max=10, example=10, vm0042_ref="§6; §1 fn 1 p.14", vm0042_default=10),

    # ---------------------------------------------------------------- lab
    RuleDef("permitted_soc_methods", "Permitted SOC lab methods", "lab", "list",
            "Laboratory methods accepted for soil organic carbon (dry combustion recommended).",
            example=["dry_combustion"], vm0042_ref="§8.2.1.4 p.33"),
    RuleDef("permitted_bd_methods", "Permitted bulk-density methods", "lab", "list",
            "Methods accepted for bulk density (core, excavation, clod — ISO 11272:2017).",
            example=["core_ring"], vm0042_ref="§8.2.1.5 p.34"),
    RuleDef("spectroscopy_check_fraction_min", "Spectroscopy dry-combustion check (min)", "lab", "number",
            "Share of proximal-sensing samples also analysed by dry combustion (lower bound).", min=0.10, max=1,
            example=0.10, vm0042_ref="§8.6.2 Eq. 73 p.80", vm0042_default=0.10),
    RuleDef("spectroscopy_check_fraction_max", "Spectroscopy dry-combustion check (max)", "lab", "number",
            "Share of proximal-sensing samples also analysed by dry combustion (upper bound).", min=0.10, max=1,
            example=0.15, vm0042_ref="§8.6.2 Eq. 73 p.80", vm0042_default=0.15),

    # ---------------------------------------------------------------- emissions (QA3)
    RuleDef("gwp_ch4", "GWP of CH4", "emissions", "number", "Global warming potential of methane (IPCC AR5).",
            unit="t CO2e/t CH4", min=1, max=100, example=28, vm0042_ref="§9.1 p.87", vm0042_default=28),
    RuleDef("gwp_n2o", "GWP of N2O", "emissions", "number", "Global warming potential of nitrous oxide (IPCC AR5).",
            unit="t CO2e/t N2O", min=1, max=400, example=265, vm0042_ref="§9.1 p.89", vm0042_default=265),
    RuleDef("ef_limestone", "EF limestone", "emissions", "number", "Carbon emission factor of limestone (Eq. 9).",
            unit="t C/t", min=0, max=1, example=0.12, vm0042_ref="§9.2 Eq. 9 p.103", vm0042_default=0.12),
    RuleDef("ef_dolomite", "EF dolomite", "emissions", "number", "Carbon emission factor of dolomite (Eq. 9).",
            unit="t C/t", min=0, max=1, example=0.13, vm0042_ref="§9.2 Eq. 9 p.103", vm0042_default=0.13),
    RuleDef("ef_gasoline", "EF gasoline", "emissions", "number", "CO2 emission factor of gasoline (Eq. 7).",
            unit="t CO2e/L", min=0, max=0.01, example=0.002810, vm0042_ref="§9.2 Eq. 7 p.102",
            vm0042_default=0.002810),
    RuleDef("ef_diesel", "EF diesel", "emissions", "number", "CO2 emission factor of diesel (Eq. 7).",
            unit="t CO2e/L", min=0, max=0.01, example=0.002886, vm0042_ref="§9.2 Eq. 7 p.102",
            vm0042_default=0.002886),
    RuleDef("manure_c_retention", "Manure carbon retention (leakage)", "emissions", "number",
            "Share of amendment carbon retained in soil, used for organic-amendment leakage (Maillard & Angers).",
            min=0, max=1, example=0.12, vm0042_ref="§8.4.1 Eq. 33 p.51–52", vm0042_default=0.12),
    RuleDef("emission_factors", "Emission factors", "emissions", "factors",
            "IPCC 2019 (or better) factors used by the QA3 equations, each as a number or {value, low, high}: "
            "EF_Ndirect, EF_Nvolat, EF_Nleach, Frac_GASF, Frac_GASM, Frac_LEACH, EF_N2O_md, EF_ent_<animal>, "
            "VS_rate_<animal>, EF_CH4_md_<animal>, Nex_<animal>, EF_CH4_bb_<residue>, EF_N2O_bb_<residue>, "
            "CF_<residue>, EF_CO2_<fuel>. The low/high end is chosen conservatively (§8.6.3).",
            required=False, example=EXAMPLE_FACTORS, vm0042_ref="§8.1 p.21–22; §8.3; §8.6.3 p.81; §9.2"),
    RuleDef("de_minimis_pct", "De minimis threshold", "emissions", "number",
            "Sources (and leakage) together below this share of the total GHG benefit may be set to zero.",
            unit="%", min=0, max=5, example=5, vm0042_ref="§5; §8.4 p.12, 50", vm0042_default=5),
    RuleDef("de_minimis_exclude", "Exclude de minimis sources", "emissions", "boolean",
            "Whether sources below the de minimis threshold are set to zero (they are always reported).",
            example=False, vm0042_ref="§5 p.12"),

    # ---------------------------------------------------------------- manual terms (TermEstimate)
    RuleDef("baseline_scenario_required", "Use a modelled baseline SOC change", "terms", "boolean",
            "Only for QA1, or QA2 without control sites: the baseline SOC change comes from an approved model "
            "term instead of control sites.", example=False, vm0042_ref="§8.5 Eq. 44 p.57"),
    RuleDef("project_emissions_required", "Require a manual project-emissions term", "terms", "boolean",
            "Legacy: an approved aggregate project-emissions term must exist in addition to activity data.",
            example=False),
    RuleDef("baseline_emissions_required", "Require a manual baseline-emissions term", "terms", "boolean",
            "Legacy: an approved aggregate baseline-emissions term must exist in addition to activity data.",
            example=False),
    RuleDef("leakage_required", "Require a manual leakage term", "terms", "boolean",
            "An approved leakage term (other than organic amendments) must exist, e.g. livestock displacement.",
            example=False, vm0042_ref="§8.4 p.50–53"),

    # ---------------------------------------------------------------- woody biomass (§5 Table 2, §8.2.2, Eq. 48–51)
    # Coefficients below come from CDM AR-TOOL14 or project sources; VM0042 does not fix them, so none has a
    # vm0042_default. Only the re-measurement interval is written in VM0042 itself.
    RuleDef("woody_biomass_included", "Woody biomass in the project boundary", "woody", "boolean",
            "Above-ground woody biomass (trees, shrubs) must be included where project activities significantly "
            "reduce it compared to the baseline; otherwise it is optional. When Yes, tree and shrub carbon stock "
            "changes are calculated from plot inventories (CDM AR-TOOL14) and reported with Eq. 48–51.",
            required=False, example=False, vm0042_ref="§5 Table 2 p.12"),
    RuleDef("woody_belowground_included", "Include below-ground woody biomass", "woody", "boolean",
            "Below-ground woody biomass (roots) may optionally be included where the project significantly increases "
            "it. When Yes, each allometric model's root-to-shoot ratio and the shrub root-to-shoot ratio are applied.",
            required=False, example=False, vm0042_ref="§5 Table 2 p.12"),
    RuleDef("woody_shrubs_included", "Include shrubs", "woody", "boolean",
            "Whether shrub biomass (Eq. 50–51) is quantified. When Yes, every plot measurement must record shrubs.",
            required=False, example=False, vm0042_ref="§8.5.1 Eq. 50–51 p.60"),
    RuleDef("woody_remeasure_max_years", "Woody biomass re-measurement at least every", "woody", "number",
            "Tree and shrub biomass must be monitored at least every five years, or before each verification if that "
            "is sooner.", unit="years", min=0.5, max=5, required=False, example=5, vm0042_ref="§9.2 p.131",
            vm0042_default=5),
    RuleDef("tree_carbon_fraction", "Carbon fraction of tree biomass (CF_TREE)", "woody", "number",
            "Carbon per tonne of tree dry matter, from CDM AR-TOOL14 or a documented species value. Not fixed by "
            "VM0042.", unit="t C/t d.m.", min=0.3, max=0.6, required=False, example=0.47,
            vm0042_ref="§8.2.2 p.38"),
    RuleDef("shrub_carbon_fraction", "Carbon fraction of shrub biomass (CF_S)", "woody", "number",
            "Carbon per tonne of shrub dry matter (CDM AR-TOOL14 or a documented value).", unit="t C/t d.m.",
            min=0.3, max=0.6, required=False, example=0.47, vm0042_ref="§8.2.2 p.38"),
    RuleDef("shrub_root_shoot_ratio", "Root-to-shoot ratio of shrubs (R_S)", "woody", "number",
            "Used only when below-ground woody biomass is included (CDM AR-TOOL14 or a documented value).",
            min=0, max=5, required=False, example=0.4, vm0042_ref="§8.2.2 p.38"),
    RuleDef("shrub_biomass_ratio_bdr_sf", "Shrub-to-forest biomass ratio at full cover (BDR_SF)", "woody", "number",
            "Ratio of shrub biomass per hectare at full crown cover to forest above-ground biomass per hectare "
            "(CDM AR-TOOL14). Needed only when shrubs are measured as crown cover.", min=0, max=1, required=False,
            example=0.1, vm0042_ref="§8.2.2 p.38"),
    RuleDef("shrub_forest_biomass_t_dm_ha", "Forest above-ground biomass in the region (B_FOREST)", "woody", "number",
            "Above-ground biomass of forest in the region (e.g. IPCC 2006 Vol 4 Table 4.7). Needed only when shrubs "
            "are measured as crown cover.", unit="t d.m./ha", min=0, max=1500, required=False,
            vm0042_ref="§8.2.2 p.38"),

    # ---------------------------------------------------------------- uncertainty & buffer
    RuleDef("uncertainty_method", "Uncertainty deduction method", "uncertainty", "choice",
            "Equation converting uncertainty into a deduction.", choices=("vm0042_eq74",), example="vm0042_eq74",
            vm0042_ref="§8.6.4 Eq. 74 p.82", vm0042_default="vm0042_eq74"),
    RuleDef("uncertainty_confidence", "One-sided confidence for deduction", "uncertainty", "number",
            "Confidence level of the one-sided Student t in Eq. 74 (66.7 %). At large df t(0.667) = 0.4316; the "
            "PDF's \"≈ 0.4307\" is t(2/3).", min=0.5, max=0.999,
            example=0.667, vm0042_ref="§8.6.4 Eq. 74 p.82", vm0042_default=0.667),
    RuleDef("qa1_uncertainty_method", "QA1 uncertainty method", "uncertainty", "choice",
            "How the QA1 (model) uncertainty is estimated for each source: analytical error propagation (Eq. 60–64) "
            "or Monte Carlo simulation (Eq. 65–69). Monte Carlo is required where initial SOC is measured with soil "
            "spectroscopy unless its error is shown to be de minimis (§8.6.1.1.2 p.67).",
            choices=("analytical", "monte_carlo"), required=False, required_if=("qa_soc", "qa1"),
            example="analytical", vm0042_ref="§8.6.1 p.64"),
    RuleDef("qa1_mc_min_draws", "QA1 Monte Carlo draws (L)", "uncertainty", "integer",
            "Minimum number of Monte Carlo draws L. VM0042 cites L between 100 and 2000 and suggests 500–1000 "
            "(§8.6.1.2.3); the project chooses.", unit="draws", min=2, max=100000, required=False,
            required_if=("qa1_uncertainty_method", "monte_carlo"), example=500, vm0042_ref="§8.6.1.2.3 p.74"),
    RuleDef("qa1_mc_error_factor", "Inflate Monte Carlo error by √(1 + 1/L)", "uncertainty", "boolean",
            "Whether the Monte Carlo standard error is inflated by the MC error factor √(1 + 1/L) (Gelman et al. 2014, "
            "cited in §8.6.1.2.3).", required=False, required_if=("qa1_uncertainty_method", "monte_carlo"),
            example=True, vm0042_ref="§8.6.1.2.3 p.74"),
    RuleDef("non_permanence_risk_pct", "Non-permanence risk rating", "uncertainty", "number",
            "Buffer share from the VCS AFOLU Non-Permanence Risk Tool (applies to stock changes only).",
            unit="%", min=0.01, max=99.99, example=15, vm0042_ref="§8.7 Eq. 75–76 p.84"),

    # ---------------------------------------------------------------- records
    RuleDef("data_retention_years_after_crediting", "Data retention after last crediting period", "records",
            "integer", "Monitoring data is archived at least this long after the last crediting period ends.",
            unit="years", min=2, max=50, example=2, vm0042_ref="§9.3 p.137", vm0042_default=2),
    RuleDef("soc_remeasurement_interval_years", "SOC re-measurement interval", "records", "integer",
            "Soil organic carbon is measured again at least this often (QA2: before each verification if that is "
            "sooner). Drives the monitoring obligations on the risk screen.", required=False,
            unit="years", min=1, max=5, example=5, vm0042_ref="§8.1 p.20", vm0042_default=5),
    RuleDef("baseline_reassessment_interval_years", "Baseline reassessment interval", "records", "integer",
            "The baseline is reassessed at least this often (every 5 years is recommended). Drives the monitoring "
            "obligations on the risk screen.", required=False,
            unit="years", min=1, max=10, example=10, vm0042_ref="§6 p.14", vm0042_default=10),

    # ---------------------------------------------------------------- field QA (platform)
    RuleDef("gps_accuracy_max_m", "Maximum GPS error", "field", "number",
            "Samples with worse GPS accuracy are flagged.", unit="m", min=1, max=100, example=5,
            vm0042_ref="§8.2.1.1 p.28; §8.2.1.3(9) p.33"),
    RuleDef("max_distance_from_site_m", "Maximum distance from planned site", "field", "number",
            "Cores taken further than this from the planned point are flagged.", unit="m", min=1, max=500,
            example=15, vm0042_ref="§8.2.1.1 p.28; §8.2.1.3(9) p.33"),
    RuleDef("required_photos", "Photos per core", "field", "integer",
            "Number of photographs required for every soil core.", min=1, max=10, example=3),
)

BY_KEY = {r.key: r for r in RULES}
WITH_VM0042_DEFAULT = tuple(r for r in RULES if r.vm0042_default is not None)


def _num(v: Any) -> bool:
    return not isinstance(v, bool) and isinstance(v, (int, float))


def validate_factor(key: str, v: Any) -> str | None:
    if _num(v):
        return None if v >= 0 else f"Factor “{key}” can't be negative."
    if isinstance(v, dict):
        val = v.get("value")
        if not _num(val) or val < 0:
            return f"Factor “{key}” needs a non-negative value."
        lo, hi = v.get("low"), v.get("high")
        for name, x in (("low", lo), ("high", hi)):
            if x is not None and (not _num(x) or x < 0):
                return f"Factor “{key}”: the {name} end of the range must be a non-negative number."
        if lo is not None and lo > val:
            return f"Factor “{key}”: the low end is above the value."
        if hi is not None and hi < val:
            return f"Factor “{key}”: the high end is below the value."
        return None
    return f"Factor “{key}” must be a number or {{value, low, high}}."


def validate_value(rule: RuleDef, value: Any) -> str | None:
    """Return an error message, or None if the value is acceptable for this rule."""
    k = rule.kind
    if value is None:
        return "A value is required."
    if k == "boolean":
        return None if isinstance(value, bool) else "Choose Yes or No."
    if k in ("number", "integer"):
        if not _num(value):
            return "Enter a number."
        if k == "integer" and int(value) != value:
            return "Enter a whole number."
        if rule.min is not None and value < rule.min:
            return f"Must be at least {rule.min:g}."
        if rule.max is not None and value > rule.max:
            return f"Must be at most {rule.max:g}."
        return None
    if k == "choice":
        return None if value in rule.choices else f"Choose one of: {', '.join(rule.choices)}."
    if k == "list":
        if not isinstance(value, list) or not all(isinstance(v, str) and v.strip() for v in value):
            return "Enter a list of values."
        return None
    if k == "factors":
        if not isinstance(value, dict) or not value:
            return "Enter at least one factor."
        for key, v in value.items():
            if not isinstance(key, str) or not key.strip():
                return "Every factor needs a key."
            err = validate_factor(key, v)
            if err:
                return err
        return None
    if k == "text":
        return None if isinstance(value, str) and len(value.strip()) >= 3 else "Enter at least 3 characters."
    return "Unknown rule type."


def outstanding(values: dict[str, Any]) -> list[str]:
    """Keys still missing before a pack with these values can be approved."""
    missing = []
    for r in RULES:
        needed = r.required
        if r.required_if is not None:
            other, expected = r.required_if
            needed = values.get(other) == expected
        if needed and values.get(r.key) is None:
            missing.append(r.key)
    return missing


def warnings_for(values: dict[str, Any]) -> list[dict[str, str]]:
    """Conformance warnings for values that are allowed but not the VM0042 preference."""
    out = []
    for r in RULES:
        v = values.get(r.key)
        if v is not None and v in r.warning_choices:
            out.append({"key": r.key, "value": str(v),
                        "message": f"{r.label}: “{v}” is accepted with a warning ({r.vm0042_ref})."})
    return out
