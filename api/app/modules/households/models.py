from __future__ import annotations

import uuid

from sqlalchemy import Boolean, ForeignKey, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import TenantModel


class Household(TenantModel):
    """A farming household: a head farmer, other members and where they live."""

    __tablename__ = "households"
    __table_args__ = (UniqueConstraint("org_id", "code"),)
    code: Mapped[str] = mapped_column(String(40))
    name: Mapped[str] = mapped_column(String(200), default="")
    head_farmer_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("farmers.id"), index=True)
    village: Mapped[str] = mapped_column(String(120), default="")
    district: Mapped[str] = mapped_column(String(120), default="")
    state: Mapped[str] = mapped_column(String(120), default="")
    status: Mapped[str] = mapped_column(String(12), default="active")  # active | inactive
    notes: Mapped[str] = mapped_column(Text, default="")


class HouseholdMember(TenantModel):
    """A member: either a registered farmer (``farmer_id``) or a named person who is not registered."""

    __tablename__ = "household_members"
    household_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("households.id"), index=True)
    farmer_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, ForeignKey("farmers.id"), nullable=True, index=True)
    name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    relation: Mapped[str] = mapped_column(String(30))  # head | spouse | son | daughter | parent | sibling | other
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
