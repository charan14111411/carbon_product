"""VM0042 v2.2 sections of the verification package, built only from records that exist at issue time:
activity data & Box 1 tiers, emissions with their equation trail, leakage, uncertainty per source,
vintages, the §8.2.1.2 strata/points annex, supporting data (informing only) and the methodology
conformance checklist."""

from __future__ import annotations

import csv
import io
import uuid
from collections import Counter, defaultdict
from datetime import date, datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.baseline.models import DATA_TIERS, ActivityRecord
from app.modules.calculation.models import CalculationRun

MET, NOT_MET, NA = "met", "not_met", "n/a"


def _ids(values: Any) -> list[uuid.UUID]:
    out = []
    for v in values or []:
        try:
            out.append(uuid.UUID(str(v)))
        except ValueError:
            continue
    return out


# ================================================================ activity data
def activity_section(db: Session, run: CalculationRun, row) -> dict[str, Any]:
    sources = (run.inputs_snapshot or {}).get("sources", {})
    ids = _ids(a["id"] for a in sources.get("activity_records", []))
    recs = db.scalars(select(ActivityRecord).where(ActivityRecord.org_id == run.org_id, ActivityRecord.id.in_(ids))
                      .order_by(ActivityRecord.field_id, ActivityRecord.scenario, ActivityRecord.year,
                                ActivityRecord.category, ActivityRecord.record_id)).all() if ids else []
    tiers = Counter((r.scenario, int(r.data_tier or 0)) for r in recs)
    by_tier = [{"scenario": sc, "tier": t, "label": DATA_TIERS.get(t, "Not stated"), "records": n}
               for (sc, t), n in sorted(tiers.items())]
    attest_needed = [r for r in recs if int(r.data_tier or 0) in (3, 4)]
    return {
        "records": [row(r) for r in recs],
        "box1_tiers": by_tier,
        "box1_hierarchy": {str(k): v for k, v in DATA_TIERS.items()},
        "attestations": {"needed": len(attest_needed),
                         "present": sum(1 for r in attest_needed if r.attestation_id)},
        "note": "Baseline values record the Box 1 tier they came from (VM0042 §6 Box 1).",
    }


# ================================================================ annex (§8.2.1.2)
def annex_section(pkg_like: dict[str, Any], run: CalculationRun) -> dict[str, Any]:
    sources = (run.inputs_snapshot or {}).get("sources", {})
    results = run.results or {}
    res_by_code = {s["code"]: s for s in [*results.get("strata", []), *results.get("control_strata", [])]}
    sites = {s["id"]: s for s in pkg_like.get("sites", [])}
    samples = {s["id"]: s for s in pkg_like.get("samples", [])}
    strata = []
    for st in sources.get("strata", []):
        r = res_by_code.get(st["code"], {})
        strata.append({"code": st["code"], "name": st.get("name"), "role": st.get("role"),
                       "quantification_unit": st.get("quantification_unit") or st["code"],
                       "control_for_code": st.get("control_for_code"), "area_ha": st.get("area_ha"),
                       "n_used": r.get("n_used"), "reference_mass_t_ha": r.get("reference_mass_t_ha"),
                       "field_ids": st.get("field_ids", [])})
    stratum_of_site = {}
    for s in pkg_like.get("strata", []):
        for site in pkg_like.get("sites", []):
            if site.get("stratum_id") == s.get("id"):
                stratum_of_site[site["id"]] = s.get("code")
    points = []
    for code, meta in sorted(sources.get("samples", {}).items()):
        smp = samples.get(meta.get("sample_id"), {})
        site = sites.get(meta.get("site_id"), {})
        intended = meta.get("intended") or {"latitude": site.get("latitude"), "longitude": site.get("longitude")}
        actual = meta.get("actual") or {"latitude": smp.get("latitude"), "longitude": smp.get("longitude")}
        points.append({
            "stratum": stratum_of_site.get(meta.get("site_id")), "site_code": meta.get("site_code"),
            "campaign": meta.get("campaign"), "sample_code": code,
            "intended_latitude": intended.get("latitude"), "intended_longitude": intended.get("longitude"),
            "actual_latitude": actual.get("latitude"), "actual_longitude": actual.get("longitude"),
            "distance_from_intended_m": smp.get("distance_from_site_m"), "gps_accuracy_m": smp.get("gps_accuracy_m"),
            "collected_at": smp.get("collected_at") or meta.get("collected_at"),
            "depth_reached_cm": smp.get("depth_reached_cm"), "shallow": meta.get("shallow", False),
        })
    return {"strata": strata, "points": points,
            "note": "VM0042 §8.2.1.2: strata, their areas and sampling points are reported at every verification."}


ANNEX_COLUMNS = ("record_type", "stratum", "quantification_unit", "role", "area_ha", "control_for", "site_code",
                 "campaign", "sample_code", "intended_latitude", "intended_longitude", "actual_latitude",
                 "actual_longitude", "distance_from_intended_m", "gps_accuracy_m", "collected_at",
                 "depth_reached_cm", "shallow")


def annex_csv(annex: dict[str, Any]) -> str:
    buf = io.StringIO()
    w = csv.DictWriter(buf, fieldnames=ANNEX_COLUMNS, extrasaction="ignore", lineterminator="\n")
    w.writeheader()
    for s in annex.get("strata", []):
        w.writerow({"record_type": "stratum", "stratum": s["code"], "quantification_unit": s["quantification_unit"],
                    "role": s["role"], "area_ha": s["area_ha"], "control_for": s.get("control_for_code") or ""})
    for p in annex.get("points", []):
        w.writerow({"record_type": "point", **p})
    return buf.getvalue()


# ================================================================ supporting data (informing only)
def supporting_section(db: Session, run: CalculationRun, field_ids: list[uuid.UUID]) -> dict[str, Any]:
    out: dict[str, Any] = {"note": "Supporting data informs the review only; it is never used to calculate credits.",
                           "observations": [], "satellite_indices": []}
    if not field_ids:
        return out
    try:
        from app.modules.supporting.models import Observation

        rows = db.scalars(select(Observation).where(
            Observation.org_id == run.org_id, Observation.field_id.in_(field_ids),
            Observation.observed_on >= run.period_start, Observation.observed_on <= run.period_end)).all()
        agg: dict[tuple, list] = defaultdict(list)
        for o in rows:
            if o.value is not None:
                agg[(str(o.field_id), o.parameter, o.unit, o.data_class, o.provider)].append(o.value)
        out["observations"] = [
            {"field_id": f, "parameter": p, "unit": u, "data_class": dc, "provider": pr, "count": len(v),
             "mean": sum(v) / len(v), "min": min(v), "max": max(v)}
            for (f, p, u, dc, pr), v in sorted(agg.items())]
    except Exception:  # noqa: BLE001 — optional module
        out["observations_unavailable"] = True
    try:
        from app.modules.intelligence.models import SatelliteIndex

        rows = db.scalars(select(SatelliteIndex).where(
            SatelliteIndex.org_id == run.org_id, SatelliteIndex.field_id.in_(field_ids),
            SatelliteIndex.observed_on >= run.period_start, SatelliteIndex.observed_on <= run.period_end)).all()
        agg2: dict[tuple, list] = defaultdict(list)
        for s in rows:
            agg2[(str(s.field_id), s.index_name, s.source)].append(s.value)
        out["satellite_indices"] = [
            {"field_id": f, "index": i, "source": src, "data_class": "OBSERVED", "count": len(v),
             "mean": sum(v) / len(v), "min": min(v), "max": max(v)} for (f, i, src), v in sorted(agg2.items())]
    except Exception:  # noqa: BLE001 — optional module
        out["satellite_unavailable"] = True
    return out


# ================================================================ conformance checklist
def _item(ref: str, requirement: str, status: str, evidence: str) -> dict[str, str]:
    return {"ref": ref, "requirement": requirement, "status": status, "evidence": evidence}


def _to_dt(v: Any) -> datetime | None:
    if isinstance(v, datetime):
        return v
    if isinstance(v, str):
        try:
            return datetime.fromisoformat(v)
        except ValueError:
            return None
    return None


def _to_date(v: Any) -> date | None:
    if isinstance(v, date) and not isinstance(v, datetime):
        return v
    dt = _to_dt(v)
    return dt.date() if dt else None


def conformance(pkg: dict[str, Any], run: CalculationRun, extra: dict[str, Any]) -> list[dict[str, str]]:
    """Each VM0042 v2.2 requirement the package can evidence: met / not_met / n/a with the evidence."""
    res = run.results or {}
    rules = (run.rules_snapshot or {}).get("values", {})
    sources = (run.inputs_snapshot or {}).get("sources", {})
    items: list[dict[str, str]] = []
    add = items.append
    sm = res.get("stock_method")
    add(_item("§8.2.1.3(7) p.32", "SOC stock changes on an equivalent-soil-mass basis",
              MET if sm in ("esm", "fixed_depth_with_mass_correction") else NOT_MET,
              f"Stock method: {sm}" + (" (mass correction, warning)" if sm == "fixed_depth_with_mass_correction" else "")))
    depth = rules.get("stock_depth_cm")
    shallow = [s for s in sources.get("samples", {}).values() if s.get("shallow")]
    short = [s for s in pkg.get("samples", []) if (s.get("depth_reached_cm") or 0) + 0.5 < (depth or 30)]
    add(_item("§8.2.1.3(7b) p.32", "SOC reported to ≥ 30 cm (or bedrock, documented)",
              MET if (depth or 0) >= 30 and len(short) <= len(shallow) else NOT_MET,
              f"Reporting depth {depth} cm; {len(short)} sample(s) shallower, {len(shallow)} documented as shallow."))
    mon_ids = {s["sample_id"] for s in sources.get("samples", {}).values() if s.get("campaign") == "monitoring"}
    layers_per = Counter(lyr.get("sample_id") for lyr in pkg.get("soil_layers", []))
    one = [sid for sid in mon_ids if layers_per.get(sid, 0) < 2]
    add(_item("§8.2.1.3(7) p.32", "At re-sampling, at least two depth increments",
              MET if not one else NOT_MET, f"{len(mon_ids) - len(one)} of {len(mon_ids)} monitoring sample(s)."))
    strata = res.get("strata", [])
    need = rules.get("min_composites_per_stratum") or 3
    few = [s["code"] for s in [*strata, *res.get("control_strata", [])] if (s.get("n_used") or 0) < need]
    add(_item("§8.2.1.2 p.30", f"≥ {need} composite samples per stratum", MET if strata and not few else NOT_MET,
              "All strata meet it." if not few else f"Below: {', '.join(few)}"))
    add(_item("§8.2.1.2 p.30", "Stratified sampling; strata, areas and points in an annex",
              MET if extra.get("annex", {}).get("strata") else NOT_MET,
              f"{len(extra.get('annex', {}).get('strata', []))} strata, "
              f"{len(extra.get('annex', {}).get('points', []))} points in the annex (CSV available)."))
    pts = extra.get("annex", {}).get("points", [])
    both = [p for p in pts if None not in (p.get("intended_latitude"), p.get("actual_latitude"))]
    add(_item("§8.2.1.2 p.30", "Intended and actual sample locations georeferenced",
              MET if pts and len(both) == len(pts) else NOT_MET, f"{len(both)} of {len(pts)} point(s)."))
    by_camp: dict[str, list[int]] = defaultdict(list)
    for s in sources.get("samples", {}).values():
        dt = _to_dt(s.get("collected_at"))
        if dt:
            by_camp[s.get("campaign")].append(dt.timetuple().tm_yday)
    if by_camp.get("baseline") and by_camp.get("monitoring"):
        d = abs(sum(by_camp["baseline"]) / len(by_camp["baseline"]) - sum(by_camp["monitoring"]) /
                len(by_camp["monitoring"]))
        d = min(d, 365 - d)
        add(_item("§8.2.1.2 p.29", "Sampling and re-sampling in the same season", MET if d <= 45 else NOT_MET,
                  f"Mean collection dates differ by {d:.0f} days."))
    ship = rules.get("ship_within_days")
    store = rules.get("storage_max_days")
    custody = defaultdict(dict)
    for e in pkg.get("custody_events", []):
        custody[e.get("sample_id")].setdefault(e.get("event"), e.get("occurred_at"))
    camp_end: dict[str, datetime] = {}
    for s in pkg.get("samples", []):
        dt = _to_dt(s.get("collected_at"))
        if dt and (s.get("campaign_id") not in camp_end or dt > camp_end[s.get("campaign_id")]):
            camp_end[s.get("campaign_id")] = dt
    late = 0
    checked = 0
    for s in pkg.get("samples", []):
        disp = _to_dt(custody.get(s.get("id"), {}).get("dispatched"))
        end = camp_end.get(s.get("campaign_id"))
        if disp and end:
            checked += 1
            late += (disp - end).total_seconds() > (ship or 5) * 86400
    add(_item("§8.2.1.3(5) p.32", f"Samples shipped within {ship or 5} days of campaign completion",
              NA if not checked else (MET if not late else NOT_MET), f"{late} of {checked} sample(s) late."))
    long_store = 0
    n_store = 0
    recv = {sid: _to_date(ev.get("lab_received")) for sid, ev in custody.items()}
    layer_sample = {lyr.get("id"): lyr.get("sample_id") for lyr in pkg.get("soil_layers", [])}
    used = [r for r in pkg.get("lab_results", []) if r.get("used_in_calculation")]
    for r in used:
        rd = recv.get(layer_sample.get(r.get("layer_id")))
        ad = _to_date(r.get("analysed_on"))
        if rd and ad:
            n_store += 1
            long_store += (ad - rd).days > (store or 90)
    add(_item("§8.2.1.3(5) p.32", f"Storage before analysis ≤ {store or 90} days",
              NA if not n_store else (MET if not long_store else NOT_MET),
              f"{long_store} of {n_store} result(s) analysed later."))
    soc_methods = sorted({r.get("method") for r in used if r.get("analyte") == "soc_pct"})
    discouraged = [m for m in soc_methods if m in ("walkley_black", "loss_on_ignition", "loi")]
    add(_item("§8.2.1.4 p.33", "SOC by dry combustion (Walkley-Black / LOI not recommended)",
              MET if soc_methods and not discouraged else NOT_MET, f"Methods: {', '.join(soc_methods) or '—'}"))
    labs = sorted({r.get("lab_id") for r in used if r.get("analyte") == "soc_pct"})
    add(_item("§8.2.1.4 p.33", "Same laboratory for the project lifetime", MET if len(labs) <= 1 else NOT_MET,
              f"{len(labs)} lab(s) analysed SOC."))
    certs = sum(1 for r in used if r.get("certificate_id"))
    add(_item("§8.2.1.4 p.33", "Lab reports with certificates for results used", MET if used and certs == len(used)
              else NOT_MET, f"{certs} of {len(used)} result(s) carry a certificate."))
    soc = res.get("soc") or {}
    x = soc.get("measurement_interval_years")
    add(_item("§8.1 p.20; §9.2", f"SOC re-measured at least every {rules.get('remeasure_max_years', 5)} years",
              NA if x is None else (MET if x <= (rules.get("remeasure_max_years") or 5) + 1 / 365 else NOT_MET),
              f"Measurement interval {x:.2f} years." if isinstance(x, (int, float)) else "QA1 model."))
    if res.get("soc_approach") == "qa2":
        cs = sources.get("control_sites") or {}
        add(_item("§8.2 p.25", "≥ 3 baseline control sites, ≥ 1 per stratum, ≤ 250 km",
                  MET if res.get("controls_used") and cs.get("control_sites", 0) >= (rules.get("min_control_sites") or 3)
                  else NOT_MET, f"{cs.get('control_sites', 0)} control site(s)."))
    else:
        add(_item("§8.2 p.25", "Baseline control sites (QA2 only)", NA, "SOC quantified with QA1."))
    add(_item("§8.6.4 Eq. 74 p.82", "Uncertainty deduction per source at 66.7 % one-sided t",
              MET if rules.get("uncertainty_confidence") == 0.667 and rules.get("uncertainty_method") == "vm0042_eq74"
              else NOT_MET, f"Confidence {rules.get('uncertainty_confidence')}; UNC_CO2 "
                            f"{(res.get('uncertainty', {}).get('soc', {}) or {}).get('unc_pct', 0):.2f} %."))
    add(_item("§9.1 p.87–89", "GWP CH4 28 and N2O 265 (IPCC AR5)",
              MET if rules.get("gwp_ch4") == 28 and rules.get("gwp_n2o") == 265 else NOT_MET,
              f"CH4 {rules.get('gwp_ch4')}, N2O {rules.get('gwp_n2o')}."))
    add(_item("§8.7 Eq. 75–76 p.84", "Buffer on carbon-stock changes only", MET,
              f"Buffer {res.get('buffer_t_co2e', 0):.3f} t CO2e at NPR {res.get('non_permanence_risk_pct')} %."))
    add(_item("§8.5 p.54–62", "Negative results reported, not floored", MET,
              f"Net {res.get('credits_t_co2e', 0):.3f} t CO2e."))
    add(_item("§8.1", "Results per vintage when the period spans calendar years",
              MET if res.get("vintages") else NOT_MET, f"{len(res.get('vintages', []))} vintage(s)."))
    act = extra.get("activity_data", {})
    recs = act.get("records", [])
    look = rules.get("lookback_min_years") or 3
    base_years: dict[str, set] = defaultdict(set)
    for r in recs:
        if r.get("scenario") == "baseline":
            base_years[r.get("field_id")].add(r.get("year"))
    short_fields = [f for f, ys in base_years.items() if len(ys) < look]
    add(_item("§6 p.14, Table 4", f"Baseline look-back of ≥ {look} years of activity data per field",
              MET if base_years and not short_fields else NOT_MET,
              f"{len(base_years)} field(s) with baseline data; {len(short_fields)} short."))
    untiered = sum(1 for r in recs if not r.get("data_tier"))
    add(_item("§6 Box 1 p.15", "Every activity value records its Box 1 data tier",
              MET if recs and not untiered else NOT_MET, f"{untiered} of {len(recs)} record(s) without a tier."))
    att = act.get("attestations", {})
    add(_item("§6 Box 1 p.15", "Signed attestation for attested / regional values (tiers 3–4)",
              NA if not att.get("needed") else (MET if att.get("present") == att.get("needed") else NOT_MET),
              f"{att.get('present', 0)} of {att.get('needed', 0)}."))
    bio = soc.get("biochar_t_co2e") or 0.0
    add(_item("§4 cond. 7 p.10", "Biochar organic carbon subtracted from the project SOC change",
              MET if bio else NA, f"{bio:.3f} t CO2e subtracted." if bio else "No biochar applied."))
    lk = res.get("leakage") or {}
    add(_item("§8.4.1 Eq. 33 p.51", "Organic-amendment leakage assessed (with exemptions)", MET,
              f"LE_OA {lk.get('le_oa_t_co2e', 0):.3f} t CO2e from {len(lk.get('le_oa_items', []))} import(s)."))
    wet = [f.get("code") for f in pkg.get("fields", []) if f.get("land_cover") == "wetland"]
    add(_item("§4 cond. 8 p.11", "No wetlands in the project area", MET if not wet else NOT_MET,
              "None." if not wet else ", ".join(wet)))
    excl = set(rules.get("excluded_conversions") or ["forest", "wetland"])
    lu = pkg.get("land_use", [])
    start_year = run.period_start.year
    years = rules.get("native_clearing_exclusion_years") or 10
    bad = [x for x in lu if x.get("land_use") in excl and (x.get("to_year") or 0) >= start_year - years]
    add(_item("§4 cond. 5 p.10", f"No native-ecosystem clearing within {years} years", NA if not lu else
              (MET if not bad else NOT_MET), f"{len(lu)} land-use record(s); {len(bad)} disqualifying."))
    for key, label, ref in (("additionality", "Additionality demonstrated (VT0008 steps; common practice < 20 %)",
                             "§7 p.17–19"), ("monitoring_plan", "Monitoring plan", "§9")):
        st = extra.get("readiness", {}).get(key)
        add(_item(ref, label, MET if st == "ok" else NOT_MET, f"Platform record: {st or 'not recorded'}."))
    return items
