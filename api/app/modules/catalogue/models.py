from __future__ import annotations

from sqlalchemy import JSON, Boolean, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import TenantModel


class Crop(TenantModel):
    """Any crop. Attributes a field of this crop must record are configurable."""

    __tablename__ = "crops"
    __table_args__ = (UniqueConstraint("org_id", "code"),)
    code: Mapped[str] = mapped_column(String(40))
    name: Mapped[str] = mapped_column(String(120))
    local_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    category: Mapped[str] = mapped_column(String(40), default="field")  # field | horticulture | plantation | agroforestry | rice
    # [{"key": "variety", "label": "Variety", "type": "text|number|choice", "required": bool, "choices": [...]}]
    attributes: Mapped[list] = mapped_column(JSON, default=list)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class PracticeType(TenantModel):
    """A farming practice (compost, cover crop, reduced tillage...) and what it must record."""

    __tablename__ = "practice_types"
    __table_args__ = (UniqueConstraint("org_id", "code"),)
    code: Mapped[str] = mapped_column(String(40))
    name: Mapped[str] = mapped_column(String(120))
    category: Mapped[str] = mapped_column(String(40), default="soil")
    # soil | nutrient | water | residue | tillage | trees | livestock | energy
    description: Mapped[str] = mapped_column(Text, default="")
    crop_codes: Mapped[list] = mapped_column(JSON, default=list)  # empty = all crops
    unit: Mapped[str | None] = mapped_column(String(20), nullable=True)  # t, kg, ha, L, days
    requires_quantity: Mapped[bool] = mapped_column(Boolean, default=False)
    required_evidence: Mapped[list] = mapped_column(JSON, default=list)  # e.g. ["photo"], ["invoice"]
    fields: Mapped[list] = mapped_column(JSON, default=list)  # extra fields, same shape as Crop.attributes
    emission_factor_keys: Mapped[list] = mapped_column(JSON, default=list)  # e.g. ["synthetic_n_kg"]
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
