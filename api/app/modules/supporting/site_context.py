"""Site context for VM0042 v2.2: terrain (Table 7 / Appendix 5 Table 10), soil-map suggestions and the
weather-station distance check for climate-model inputs (Table 6 / QA1, station ≤ 50 km).

Field rows are owned by the land module; this service only writes the terrain columns
(``slope_pct``, ``aspect_deg``, ``elevation_m``) when they are empty or ``force`` is set, and the
soil columns (``soil_texture_class``, ``wrb_soil_group``) only when a person applies a suggestion.
Every write is audited.
"""

from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from app.core.auth import CurrentUser
from app.core.db import utcnow
from app.core.errors import Conflict, NotFound, ValidationFailed
from app.core.tenancy import audit, get_owned, scoped, snapshot
from app.modules.intelligence.domain import wall
from app.modules.land.domain import normalise_code
from app.modules.land.models import Field
from app.modules.programmes.models import Project
from app.modules.supporting import resolver, terrain
from app.modules.supporting.models import Device, SoilPropertyApplication, SoilPropertySuggestion, TerrainSummary
from app.modules.supporting.providers import get_providers
from app.modules.supporting.service import enrolled_fields
from app.modules.supporting.soil import usda_texture_class

TERRAIN_COLUMNS = ("slope_pct", "aspect_deg", "elevation_m")
SOIL_COLUMNS = ("soil_texture_class", "wrb_soil_group")
STATION_MAX_KM = 50.0
STATION_PARAMETERS = ("rain_mm", "air_temp_c")
STATION_RULE = ("VM0042 v2.2 Table 6 (QA1 climate model inputs) and Table 7 note c: use the closest weather station "
                "with continuous records within 50 km of the field, otherwise a synthetic station.")


# ------------------------------------------------------------------ terrain
def terrain_out(t: TerrainSummary) -> dict[str, Any]:
    return {
        "id": str(t.id), "field_id": str(t.field_id), "provider": t.provider, "source_ref": t.source_ref,
        "cell_size_m": t.cell_size_m, "n_cells": t.n_cells, "elevation_mean_m": t.elevation_mean_m,
        "slope_mean_pct": t.slope_mean_pct, "aspect_deg": t.aspect_deg,
        "dominant_slope_class": t.dominant_slope_class,
        "dominant_slope_class_label": terrain.slope_class_label(t.dominant_slope_class),
        "aspect_relevant": t.dominant_slope_class in terrain.ASPECT_RELEVANT,
        "histogram": t.histogram, "stats": t.stats, "applied": t.applied, "created_at": t.created_at.isoformat(),
        **wall("DERIVED"),
        "method": "Horn (1981) 3×3 gradient on a DEM grid over the field; most frequent class per VM0042 v2.2 "
                  "Appendix 5 Table 10 (lower-inclusive bins at 3.5 / 8.5 / 16.5 / 30.5 / 45.5 %).",
    }


def refresh_terrain(db: Session, user: CurrentUser, fld: Field, force: bool = False,
                    provider: terrain.TerrainProvider | None = None) -> dict[str, Any]:
    provider = provider or terrain.get_terrain_provider()
    res = terrain.compute_terrain(fld.boundary, provider)
    computed = {"slope_pct": res.slope_mean_pct, "aspect_deg": res.aspect_deg, "elevation_m": res.elevation_mean_m}
    before = snapshot(fld)
    applied: dict[str, Any] = {}
    for col in TERRAIN_COLUMNS:
        old, new = getattr(fld, col), computed[col]
        write = new is not None and (old is None or force)
        applied[col] = {"written": write, "before": old, "after": new if write else old, "computed": new}
        if write:
            setattr(fld, col, new)
    ts = TerrainSummary(
        org_id=fld.org_id, created_by=user.id, field_id=fld.id, provider=provider.name,
        source_ref=provider.source_ref(fld.centroid_lat, fld.centroid_lon)[:120], cell_size_m=res.cell_size_m,
        n_cells=res.n_cells, elevation_mean_m=res.elevation_mean_m, slope_mean_pct=res.slope_mean_pct,
        aspect_deg=res.aspect_deg, dominant_slope_class=res.dominant_class, histogram=res.histogram,
        stats={"elevation_min_m": res.elevation_min_m, "elevation_max_m": res.elevation_max_m,
               "slope_p50_pct": res.slope_p50_pct, "slope_max_pct": res.slope_max_pct, "grid": list(res.grid),
               "force": force},
        applied=applied,
    )
    db.add(ts)
    audit(db, user, "terrain.refresh", ts)
    if any(a["written"] for a in applied.values()):
        audit(db, user, "field.terrain_update", fld, before=before,
              reason=f"DEM terrain via {provider.name}" + (" (forced overwrite)" if force else ""))
    return terrain_out(ts)


def refresh_project_terrain(db: Session, user: CurrentUser, project: Project, force: bool = False) -> dict[str, Any]:
    provider = terrain.get_terrain_provider()
    rows = [refresh_terrain(db, user, f, force, provider) for f in enrolled_fields(db, user.org_id, project.id)]
    classes: dict[str, int] = {}
    for r in rows:
        classes[r["dominant_slope_class"]] = classes.get(r["dominant_slope_class"], 0) + 1
    return {"project_id": str(project.id), "fields": len(rows), "by_slope_class": classes,
            "fields_updated": sum(1 for r in rows if any(a["written"] for a in r["applied"].values())),
            "items": rows, **wall("DERIVED")}


def terrain_history(db: Session, user: CurrentUser, fld: Field) -> list[dict[str, Any]]:
    rows = db.scalars(scoped(TerrainSummary, user).where(TerrainSummary.field_id == fld.id)
                      .order_by(TerrainSummary.created_at.desc())).all()
    return [terrain_out(t) for t in rows]


# ------------------------------------------------------------------ soil-map suggestions
def suggestion_out(s: SoilPropertySuggestion, fld: Field | None = None) -> dict[str, Any]:
    out = {"id": str(s.id), "field_id": str(s.field_id), "provider": s.provider, "source_ref": s.source_ref,
           "properties": s.properties, "soil_texture_class": s.soil_texture_class, "wrb_soil_group": s.wrb_soil_group,
           "wrb_probability": s.wrb_probability, "created_at": s.created_at.isoformat(), **wall(s.data_class),
           "note": "A soil-map suggestion (MODELLED). It is not applied to the field until a person applies it."}
    if fld is not None:
        out["current"] = {c: getattr(fld, c) for c in SOIL_COLUMNS}
    return out


def refresh_soil_properties(db: Session, user: CurrentUser, fld: Field) -> dict[str, Any]:
    soil = get_providers().soil
    props = soil.properties(fld.centroid_lat, fld.centroid_lon)
    # stored in the field-column code form ("sandy_clay_loam") so Apply compares like with like
    texture = normalise_code(usda_texture_class(props["sand_pct"], props["silt_pct"], props["clay_pct"]))
    wrb_fn = getattr(soil, "wrb_group", None)
    wrb = wrb_fn(fld.centroid_lat, fld.centroid_lon) if callable(wrb_fn) else None
    s = SoilPropertySuggestion(
        org_id=fld.org_id, created_by=user.id, field_id=fld.id, provider=soil.name,
        source_ref=soil.source_ref(fld.centroid_lat, fld.centroid_lon)[:120], properties=props,
        soil_texture_class=texture, wrb_soil_group=wrb[0] if wrb else None, wrb_probability=wrb[1] if wrb else None,
    )
    db.add(s)
    audit(db, user, "soil_suggestion.create", s)
    return suggestion_out(s, fld)


def list_soil_suggestions(db: Session, user: CurrentUser, fld: Field) -> list[dict[str, Any]]:
    rows = db.scalars(scoped(SoilPropertySuggestion, user).where(SoilPropertySuggestion.field_id == fld.id)
                      .order_by(SoilPropertySuggestion.created_at.desc())).all()
    return [suggestion_out(s, fld) for s in rows]


def apply_soil_suggestion(db: Session, user: CurrentUser, fld: Field, suggestion_id: str, columns: list[str],
                          overwrite: bool, note: str) -> dict[str, Any]:
    s = get_owned(db, SoilPropertySuggestion, suggestion_id, user, "Soil suggestion")
    if s.field_id != fld.id:
        raise NotFound("Soil suggestion not found for this field.")
    columns = list(dict.fromkeys(columns or SOIL_COLUMNS))
    bad = [c for c in columns if c not in SOIL_COLUMNS]
    if bad:
        raise ValidationFailed("Only soil_texture_class and wrb_soil_group can be applied.", details={"unknown": bad})
    before = snapshot(fld)
    changes: dict[str, Any] = {}
    conflicts = []
    for c in columns:
        new, old = getattr(s, c), getattr(fld, c)
        if new is None:
            continue
        if c == "soil_texture_class":
            new = normalise_code(new)  # suggestions stored before codes were normalised
        if old is not None and old != new and not overwrite:
            conflicts.append({"column": c, "current": old, "suggested": new})
            continue
        if old != new:
            changes[c] = {"before": old, "after": new}
    if conflicts:
        raise Conflict("The field already has a different value. Confirm the overwrite to replace it.",
                       code="FIELD_VALUE_EXISTS", details={"conflicts": conflicts})
    for c, ch in changes.items():
        setattr(fld, c, ch["after"])
    app_row = SoilPropertyApplication(org_id=fld.org_id, created_by=user.id, suggestion_id=s.id, field_id=fld.id,
                                      changes=changes, note=note)
    db.add(app_row)
    audit(db, user, "soil_suggestion.apply", app_row)
    if changes:
        audit(db, user, "field.soil_update", fld, before=before, reason=f"Applied soil-map suggestion {s.id}")
    return {"suggestion_id": str(s.id), "field_id": str(fld.id), "application_id": str(app_row.id),
            "changes": changes, "current": {c: getattr(fld, c) for c in SOIL_COLUMNS},
            "applied_by": str(user.id)}


# ------------------------------------------------------------------ weather-station check (QA1 inputs)
def _continuous(d: Device, now) -> tuple[bool, str]:
    if d.status != "online":
        return False, f"station is {d.status}"
    seen = resolver._aware(d.last_seen_at)
    if seen is None:
        return False, "station has never reported"
    age = (now - seen).total_seconds() / 86400
    if age > resolver.STALE_DEVICE_DAYS:
        return False, f"no report for {age:.0f} days"
    return True, ""


def weather_station_check(db: Session, user: CurrentUser, project: Project) -> dict[str, Any]:
    now = utcnow()
    stations = [d for d in db.scalars(scoped(Device, user).where(Device.kind == "microclime",
                                                                 Device.status != "retired")).all()
                if set(STATION_PARAMETERS) & set(d.parameters or [])]
    weather = get_providers().weather
    rows = []
    for f in enrolled_fields(db, user.org_id, project.id):
        cands = sorted(((resolver.km(f.centroid_lat, f.centroid_lon, d.latitude, d.longitude), d) for d in stations),
                       key=lambda t: (t[0], t[1].external_id))
        best = next(((km, d) for km, d in cands if _continuous(d, now)[0]), None)
        not_cont = [{"station": d.name, "external_id": d.external_id, "distance_km": round(km, 2),
                     "reason": _continuous(d, now)[1]}
                    for km, d in cands if km <= STATION_MAX_KM and not _continuous(d, now)[0]]
        row: dict[str, Any] = {"field_id": str(f.id), "field_code": f.code, "excluded_stations": not_cont}
        if best and best[0] <= STATION_MAX_KM:
            km, d = best
            own = d.field_id == f.id or (d.farm_id is not None and d.farm_id == f.farm_id)
            row.update({"decision": "station", "tier": 1 if own else 2,
                        "station": {"id": str(d.id), "name": d.name, "external_id": d.external_id,
                                    "provider": "Varsapradaya MicroClime", "distance_km": round(km, 2),
                                    "parameters": [p for p in STATION_PARAMETERS if p in (d.parameters or [])]},
                        "passes": True,
                        "message": f"Use station {d.name}, {km:.1f} km away (≤ {STATION_MAX_KM:.0f} km)."})
        else:
            nearest = {"name": best[1].name, "distance_km": round(best[0], 2)} if best else None
            row.update({"decision": "synthetic_station", "tier": 3, "station": None, "nearest_continuous": nearest,
                        "synthetic_source": weather.source_ref(f.centroid_lat, f.centroid_lon), "passes": False,
                        "message": "use synthetic station: no continuous station within "
                                   f"{STATION_MAX_KM:.0f} km" + (f" (nearest {best[0]:.1f} km)" if best else "") + "."})
        rows.append(row)
    return {
        "project_id": str(project.id), "max_distance_km": STATION_MAX_KM, "rule": STATION_RULE,
        "checked_at": now.isoformat(), "fields": len(rows),
        "with_station": sum(1 for r in rows if r["decision"] == "station"),
        "synthetic_station": sum(1 for r in rows if r["decision"] == "synthetic_station"),
        "items": rows, "continuous_definition": f"online and reported within {resolver.STALE_DEVICE_DAYS} days",
    }

