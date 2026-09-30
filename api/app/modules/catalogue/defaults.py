"""The starter catalogue installed by ``POST /catalogue/install-defaults``.

Organisations edit these freely afterwards; installing again only adds what is missing.
"""

from __future__ import annotations

from typing import Any


def _choice(key: str, label: str, choices: list[str], required: bool = False) -> dict[str, Any]:
    return {"key": key, "label": label, "type": "choice", "required": required, "choices": choices}


def _text(key: str, label: str, required: bool = False) -> dict[str, Any]:
    return {"key": key, "label": label, "type": "text", "required": required}


def _number(key: str, label: str, unit: str | None = None, required: bool = False,
            min_: float | None = None, max_: float | None = None) -> dict[str, Any]:
    d: dict[str, Any] = {"key": key, "label": label, "type": "number", "required": required}
    if unit:
        d["unit"] = unit
    if min_ is not None:
        d["min"] = min_
    if max_ is not None:
        d["max"] = max_
    return d


DEFAULT_CROPS: list[dict[str, Any]] = [
    {"code": "rice", "name": "Rice", "category": "rice", "attributes": [
        _choice("water_regime", "Water regime", ["continuous", "awd", "rainfed"], required=True),
        _text("variety", "Variety"),
    ]},
    {"code": "wheat", "name": "Wheat", "category": "field", "attributes": [
        _text("variety", "Variety"), _choice("season", "Season", ["rabi", "kharif"]),
    ]},
    {"code": "maize", "name": "Maize", "category": "field", "attributes": [
        _text("variety", "Variety"), _choice("season", "Season", ["kharif", "rabi", "zaid"]),
    ]},
    {"code": "sugarcane", "name": "Sugarcane", "category": "field", "attributes": [
        _choice("crop_stage", "Crop", ["plant", "ratoon"]), _text("variety", "Variety"),
    ]},
    {"code": "cotton", "name": "Cotton", "category": "field", "attributes": [
        _choice("irrigation", "Irrigation", ["rainfed", "irrigated"]), _text("variety", "Variety"),
    ]},
    {"code": "coffee", "name": "Coffee", "category": "plantation", "attributes": [
        _choice("variety", "Variety", ["arabica", "robusta"], required=True),
        _choice("shade_type", "Shade type", ["native_shade", "silver_oak", "mixed", "none"]),
        _number("plant_age_years", "Plant age", unit="years", min_=0),
    ]},
    {"code": "tea", "name": "Tea", "category": "plantation", "attributes": [
        _number("bush_age_years", "Bush age", unit="years", min_=0),
        _choice("shade_type", "Shade type", ["shade", "none"]),
    ]},
    {"code": "banana", "name": "Banana", "category": "horticulture", "attributes": [
        _text("variety", "Variety"), _choice("irrigation", "Irrigation", ["drip", "flood", "rainfed"]),
    ]},
    {"code": "mango", "name": "Mango", "category": "horticulture", "attributes": [
        _text("variety", "Variety"), _number("tree_count", "Number of trees", min_=0),
    ]},
    {"code": "pulses", "name": "Pulses", "category": "field", "attributes": [
        _choice("pulse_type", "Pulse", ["tur", "chana", "moong", "urad", "other"]),
    ]},
    {"code": "millets", "name": "Millets", "category": "field", "attributes": [
        _choice("millet_type", "Millet", ["ragi", "jowar", "bajra", "other"]),
    ]},
    {"code": "vegetables", "name": "Vegetables", "category": "horticulture", "attributes": [
        _text("main_crop", "Main vegetable"),
    ]},
    {"code": "agroforestry", "name": "Agroforestry", "category": "agroforestry", "attributes": [
        _text("tree_species", "Main tree species"),
        _number("trees_per_ha", "Trees per hectare", min_=0),
    ]},
]


DEFAULT_PRACTICES: list[dict[str, Any]] = [
    {"code": "compost", "name": "Compost application", "category": "nutrient", "unit": "t",
     "requires_quantity": True, "required_evidence": ["photo"],
     "fields": [_text("source", "Compost source")]},
    {"code": "farmyard_manure", "name": "Farmyard manure", "category": "nutrient", "unit": "t",
     "requires_quantity": True, "required_evidence": ["photo"],
     "fields": [_choice("animal", "Animal source", ["cattle", "poultry", "goat", "mixed"])]},
    {"code": "cover_crop", "name": "Cover crop", "category": "soil", "unit": "ha",
     "required_evidence": ["photo"], "fields": [_text("species", "Cover crop species", required=True)]},
    {"code": "reduced_tillage", "name": "Reduced tillage", "category": "tillage",
     "fields": [_number("passes", "Tillage passes", min_=0)]},
    {"code": "zero_tillage", "name": "Zero tillage", "category": "tillage", "required_evidence": ["photo"]},
    {"code": "residue_retention", "name": "Crop residue retained", "category": "residue",
     "fields": [_number("retained_pct", "Residue retained", unit="%", min_=0, max_=100)]},
    {"code": "mulching", "name": "Mulching", "category": "residue", "unit": "t",
     "fields": [_text("material", "Mulch material")]},
    {"code": "agroforestry_planting", "name": "Tree planting", "category": "trees", "unit": "trees",
     "requires_quantity": True, "required_evidence": ["photo"],
     "fields": [_text("species", "Tree species", required=True)]},
    {"code": "biochar", "name": "Biochar application", "category": "soil", "unit": "t",
     "requires_quantity": True, "required_evidence": ["invoice"],
     "fields": [_text("feedstock", "Feedstock")]},
    {"code": "awd_irrigation", "name": "Alternate wetting and drying", "category": "water", "unit": "days",
     "crop_codes": ["rice"], "fields": [_number("dry_events", "Number of drying events", min_=0)]},
    {"code": "synthetic_fertiliser", "name": "Synthetic fertiliser", "category": "nutrient", "unit": "kg",
     "requires_quantity": True, "required_evidence": ["invoice"], "emission_factor_keys": ["synthetic_n_kg"],
     "fields": [
         _text("product", "Product", required=True),
         _number("n_content_pct", "Nitrogen content", unit="%", required=True, min_=0, max_=100),
     ]},
    {"code": "organic_fertiliser", "name": "Organic fertiliser", "category": "nutrient", "unit": "kg",
     "requires_quantity": True, "fields": [_text("product", "Product")]},
    {"code": "drip_irrigation", "name": "Drip irrigation", "category": "water", "unit": "ha"},
    {"code": "crop_rotation", "name": "Crop rotation", "category": "soil",
     "fields": [_text("rotation_crop", "Rotation crop", required=True)]},
]
