from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, model_validator

Relation = Literal["head", "spouse", "son", "daughter", "parent", "sibling", "grandparent", "grandchild",
                   "in_law", "other"]


class MemberIn(BaseModel):
    farmer_id: str | None = None
    name: str | None = Field(default=None, min_length=2, max_length=200)
    relation: Relation

    @model_validator(mode="after")
    def _who(self) -> "MemberIn":
        if bool(self.farmer_id) == bool(self.name):
            raise ValueError("Give either a registered farmer or the member's name.")
        if self.relation == "head":
            raise ValueError("The head of the household is set on the household itself.")
        return self


class HouseholdIn(BaseModel):
    head_farmer_id: str
    name: str = Field(default="", max_length=200)
    village: str | None = Field(default=None, max_length=120)
    district: str | None = Field(default=None, max_length=120)
    state: str | None = Field(default=None, max_length=120)
    notes: str = Field(default="", max_length=4000)
    members: list[MemberIn] = Field(default_factory=list, max_length=50)


class HouseholdPatch(BaseModel):
    name: str | None = Field(default=None, max_length=200)
    head_farmer_id: str | None = None
    village: str | None = Field(default=None, max_length=120)
    district: str | None = Field(default=None, max_length=120)
    state: str | None = Field(default=None, max_length=120)
    status: Literal["active", "inactive"] | None = None
    notes: str | None = Field(default=None, max_length=4000)
