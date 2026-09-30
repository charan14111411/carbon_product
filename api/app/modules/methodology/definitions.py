"""Every rule a methodology pack can hold. Values are NEVER defaulted in code:
the methodology owner enters each one with its source, and a second person approves.

``required`` rules must be answered before a pack can be approved. ``required_if``
makes a rule required only when another rule has a given value.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


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


GROUPS = {
    "approach": "Quantification approach",
    "stock": "Soil carbon stock",
    "sampling": "Sampling design",
    "eligibility": "Eligibility",
    "lab": "Laboratory",
    "terms": "Project terms",
    "uncertainty": "Uncertainty & buffer",
    "field": "Field quality checks",
}

RULES: tuple[RuleDef, ...] = (
    RuleDef("quantification_approach", "Quantification approach", "approach", "choice",
            "How carbon change is quantified: re-measuring soil, or a validated model.",
            choices=("measure_and_remeasure", "measure_and_model"), example="measure_and_remeasure"),
    RuleDef("modelled_soc_permitted", "Modelled SOC may be credited", "approach", "boolean",
            "Whether model predictions may be used for crediting. Normally No.", example=False),

    RuleDef("stock_method", "Stock method", "stock", "choice",
            "Fixed depth, or equivalent soil mass (compares the same mass of soil).",
            choices=("fixed_depth", "esm"), example="fixed_depth"),
    RuleDef("stock_depth_cm", "Required sampling depth", "stock", "number",
            "How deep each core must reach.", unit="cm", min=5, max=200, example=30),
    RuleDef("esm_reference_mass_t_ha", "ESM reference soil mass", "stock", "number",
            "Reference fine-soil mass for equivalent-soil-mass comparison.", unit="t/ha", min=100,
            required=False, required_if=("stock_method", "esm"), example=4000),
    RuleDef("coarse_fragment_correction", "Correct for stones (coarse fragments)", "stock", "boolean",
            "Whether a measured stone fraction must be subtracted from soil mass.", example=True),
    RuleDef("shallow_soil_allowed", "Accept shallow cores with evidence", "stock", "boolean",
            "Whether a core stopped by rock may be accepted with photo evidence.", example=False),

    RuleDef("min_samples_per_stratum", "Minimum samples per zone", "sampling", "integer",
            "The floor on cores per zone in every campaign.", min=2, max=500, example=5),
    RuleDef("sample_size_procedure", "Sample size procedure", "sampling", "text",
            "How the number of samples per zone is determined (section reference).",
            example="Per VM0042 §8.2: n based on prior variance for 90% CI"),
    RuleDef("sampling_design", "Monitoring design", "sampling", "choice",
            "Paired re-visits the same sites; independent draws new ones.",
            choices=("paired", "independent", "either"), example="paired"),
    RuleDef("unpaired_points_policy", "Unpaired points", "sampling", "choice",
            "What happens to a baseline site that was not re-visited.",
            choices=("block", "exclude_and_report"), example="exclude_and_report"),
    RuleDef("monitoring_interval_min_years", "Minimum years between campaigns", "sampling", "number",
            "Shortest allowed gap between baseline and monitoring.", unit="years", min=0, max=20, example=3),
    RuleDef("monitoring_interval_max_years", "Maximum years between campaigns", "sampling", "number",
            "Longest allowed gap between campaigns.", unit="years", min=0, max=30, example=5),

    RuleDef("lookback_years", "Land-use look-back", "eligibility", "integer",
            "How many years of land-use history must be shown.", unit="years", min=0, max=50, example=10),
    RuleDef("excluded_conversions", "Disqualifying land uses", "eligibility", "list",
            "Land uses within the look-back that make a field ineligible.",
            example=["forest", "wetland"]),

    RuleDef("permitted_soc_methods", "Permitted SOC lab methods", "lab", "list",
            "Laboratory methods accepted for soil organic carbon.", example=["dry_combustion"]),
    RuleDef("permitted_bd_methods", "Permitted bulk-density methods", "lab", "list",
            "Methods accepted for bulk density.", example=["core_ring"]),

    RuleDef("baseline_scenario_required", "Subtract baseline-scenario change", "terms", "boolean",
            "Whether the counterfactual carbon change must be subtracted.", example=True),
    RuleDef("project_emissions_required", "Subtract project emissions", "terms", "boolean",
            "Whether project N2O/CH4/fuel emissions must be subtracted.", example=True),
    RuleDef("baseline_emissions_required", "Add avoided baseline emissions", "terms", "boolean",
            "Whether avoided baseline emissions may be added.", example=False),
    RuleDef("leakage_required", "Subtract leakage", "terms", "boolean",
            "Whether displaced emissions must be subtracted.", example=True),

    RuleDef("uncertainty_method", "Uncertainty deduction method", "uncertainty", "choice",
            "Equation converting uncertainty into withheld tonnes.",
            choices=("vm0042_eq74",), example="vm0042_eq74"),
    RuleDef("uncertainty_confidence", "One-sided confidence for deduction", "uncertainty", "number",
            "Confidence level used by the deduction (VM0042 v2.2 uses 0.667).", min=0.5, max=0.999,
            example=0.667),
    RuleDef("non_permanence_risk_pct", "Non-permanence risk rating", "uncertainty", "number",
            "Share of credits withheld into the buffer pool (AFOLU risk tool).", unit="%", min=0.01, max=99.99,
            example=15),

    RuleDef("emission_factors", "Emission factors", "terms", "factors",
            "Default emission factors used to estimate other greenhouse gases from recorded practices "
            "(tCO2e per unit, GWP applied). Only needed where the methodology uses default factors.",
            required=False, example={"synthetic_n_kg": 0.00598}),

    RuleDef("gps_accuracy_max_m", "Maximum GPS error", "field", "number",
            "Samples with worse GPS accuracy are flagged.", unit="m", min=1, max=100, example=5),
    RuleDef("max_distance_from_site_m", "Maximum distance from planned site", "field", "number",
            "Cores taken further than this from the planned point are flagged.", unit="m", min=1, max=500,
            example=15),
    RuleDef("required_photos", "Photos per core", "field", "integer",
            "Number of photographs required for every soil core.", min=1, max=10, example=3),
)

BY_KEY = {r.key: r for r in RULES}


def validate_value(rule: RuleDef, value: Any) -> str | None:
    """Return an error message, or None if the value is acceptable for this rule."""
    k = rule.kind
    if value is None:
        return "A value is required."
    if k == "boolean":
        return None if isinstance(value, bool) else "Choose Yes or No."
    if k in ("number", "integer"):
        if isinstance(value, bool) or not isinstance(value, (int, float)):
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
            if isinstance(v, bool) or not isinstance(v, (int, float)) or v <= 0:
                return f"Factor “{key}” must be a positive number."
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
