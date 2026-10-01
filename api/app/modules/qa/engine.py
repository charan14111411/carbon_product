"""Quality-check rules. Each rule is a small class that looks at one entity's context and
returns a ``Finding`` or ``None``. The engine has no database access: the service builds
the contexts, so every rule can be tested with plain data.

Thresholds come from the project's approved methodology rule set (``ctx.rules``). When a
threshold a rule needs is missing, the rule reports an *info* finding saying so instead of
guessing a value.
"""

from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Any, ClassVar

from app.modules.lab.models import NOT_RECOMMENDED_METHODS, SPECTRO_METHODS
from app.modules.sampling.domain import (
    DEPTH_TOLERANCE, REF, aware, interval_years, layer_problems, stratification_problems,
)

INFO, WARNING, ERROR, BLOCKING = "info", "warning", "error", "blocking"
SEVERITY_ORDER = {INFO: 0, WARNING: 1, ERROR: 2, BLOCKING: 3}


@dataclass(frozen=True)
class Finding:
    rule_code: str
    severity: str
    entity_type: str
    entity_id: str
    message: str
    details: dict = field(default_factory=dict)


# ------------------------------------------------------------------ contexts
@dataclass
class SampleCtx:
    entity_id: str
    code: str
    latitude: float
    longitude: float
    gps_accuracy_m: float | None
    distance_from_site_m: float
    depth_reached_cm: float
    photo_count: int
    deviation_reason: str | None
    field_boundary: dict | None
    field_code: str | None
    campaign_depth_from_cm: float
    campaign_depth_to_cm: float
    layers: list[tuple[float, float]]
    custody_events: list[str]
    has_lab_results: bool
    rules: dict[str, Any]
    # VM0042 v2.2 checks (defaults keep older callers working)
    campaign_kind: str = "baseline"
    campaign_code: str = ""
    collected_at: datetime | None = None
    custody_times: dict[str, datetime] = field(default_factory=dict)  # first time of each custody step
    storage_conditions: list[str] = field(default_factory=list)
    campaign_last_collected_at: datetime | None = None
    first_analysed_on: date | None = None
    depth_limit: str | None = None
    baseline_collected_at: datetime | None = None  # earliest baseline sample at the same site
    near_duplicates: list[str] = field(default_factory=list)  # other samples of the campaign within 1 m
    entity_type: ClassVar[str] = "sample"


@dataclass
class LayerCtx:
    entity_id: str
    code: str
    accepted_analytes: set[str]
    rules: dict[str, Any]
    has_fine_soil_mass: bool = False
    probe_diameter_mm: float | None = None
    cores_composited: int | None = None
    entity_type: ClassVar[str] = "soil_layer"


@dataclass
class ResultCtx:
    entity_id: str
    layer_code: str
    analyte: str
    value: float
    method: str
    status: str
    analysed_on: date
    collected_on: date
    has_certificate: bool
    rules: dict[str, Any]
    unit: str | None = None
    unit_ok: bool = True
    canonical_unit: str | None = None
    method_justification: str | None = None
    detection_limit: float | None = None
    below_detection_limit: bool = False
    purpose: str = "primary"
    entity_type: ClassVar[str] = "lab_result"


@dataclass
class PlanCtx:
    entity_id: str
    stratum_code: str
    campaign_code: str
    plan_status: str
    plan_n: int
    collected: int
    rules: dict[str, Any]
    entity_type: ClassVar[str] = "sample_plan"


@dataclass
class PairCtx:
    entity_id: str
    site_code: str
    campaign_code: str
    campaign_status: str
    point_status: str
    baseline_collected: bool
    rules: dict[str, Any]
    entity_type: ClassVar[str] = "sampling_point"


@dataclass
class CampaignCtx:
    entity_id: str
    code: str
    kind: str
    rules: dict[str, Any]
    season_reference: str | None = None
    season_gap_days: int | None = None
    season_window_days: int | None = None
    season_override_reason: str | None = None
    reference_labs: list[str] = field(default_factory=list)
    labs_used: list[str] = field(default_factory=list)
    unjustified_labs: list[str] = field(default_factory=list)
    n_spectroscopy: int = 0
    n_spectroscopy_checked: int = 0
    entity_type: ClassVar[str] = "campaign"


@dataclass
class LabCtx:
    entity_id: str
    code: str
    iso17025: bool | None
    proficiency_program: str | None
    has_error_report: bool
    rules: dict[str, Any]
    entity_type: ClassVar[str] = "lab"


@dataclass
class StratumCtx:
    entity_id: str
    code: str
    criteria: dict
    rules: dict[str, Any]
    entity_type: ClassVar[str] = "stratum"


# ------------------------------------------------------------------ base
class QARule:
    code: ClassVar[str]
    severity: ClassVar[str]
    entity_type: ClassVar[str]
    title: ClassVar[str]

    def check(self, ctx: Any) -> Finding | None:  # pragma: no cover - interface
        raise NotImplementedError

    def finding(self, ctx: Any, message: str, severity: str | None = None, **details: Any) -> Finding:
        return Finding(self.code, severity or self.severity, self.entity_type, ctx.entity_id, message, details)

    def not_configured(self, ctx: Any, *keys: str) -> Finding:
        return self.finding(
            ctx,
            f"Check “{self.title}” could not run: rule not configured ({', '.join(keys)}). "
            "Enter and approve it in the project's methodology rule pack.",
            INFO, not_configured=list(keys),
        )


# ------------------------------------------------------------------ sample rules
class SampleOutsideField(QARule):
    code, severity, entity_type, title = "SAMPLE_OUTSIDE_FIELD", BLOCKING, "sample", "Sample inside its field"

    def check(self, ctx: SampleCtx) -> Finding | None:
        from app.core import geo

        if not ctx.field_boundary:
            return self.finding(ctx, f"Sample {ctx.code} has no field boundary to check against.")
        if geo.contains(ctx.field_boundary, ctx.latitude, ctx.longitude):
            return None
        return self.finding(
            ctx, f"Sample {ctx.code} was taken outside the boundary of field {ctx.field_code}.",
            latitude=ctx.latitude, longitude=ctx.longitude, field_code=ctx.field_code,
        )


class GpsAccuracyLow(QARule):
    code, severity, entity_type, title = "GPS_ACCURACY_LOW", WARNING, "sample", "GPS accuracy"

    def check(self, ctx: SampleCtx) -> Finding | None:
        limit = ctx.rules.get("gps_accuracy_max_m")
        if limit is None:
            return self.not_configured(ctx, "gps_accuracy_max_m")
        if ctx.gps_accuracy_m is None:
            return self.finding(ctx, f"Sample {ctx.code} has no GPS accuracy recorded.", limit_m=limit)
        if ctx.gps_accuracy_m > limit:
            return self.finding(
                ctx, f"GPS accuracy for sample {ctx.code} was {ctx.gps_accuracy_m:g} m; the limit is {limit:g} m.",
                gps_accuracy_m=ctx.gps_accuracy_m, limit_m=limit,
            )
        return None


class TooFarFromSite(QARule):
    code, severity, entity_type, title = "TOO_FAR_FROM_SITE", WARNING, "sample", "Distance from planned site"

    def check(self, ctx: SampleCtx) -> Finding | None:
        limit = ctx.rules.get("max_distance_from_site_m")
        if limit is None:
            return self.not_configured(ctx, "max_distance_from_site_m")
        if ctx.distance_from_site_m > limit:
            return self.finding(
                ctx, f"Sample {ctx.code} was taken {ctx.distance_from_site_m:.1f} m from its planned site "
                f"(limit {limit:g} m).", distance_m=round(ctx.distance_from_site_m, 2), limit_m=limit,
            )
        return None


class MissingPhotos(QARule):
    code, severity, entity_type, title = "MISSING_PHOTOS", BLOCKING, "sample", "Photos per core"

    def check(self, ctx: SampleCtx) -> Finding | None:
        need = ctx.rules.get("required_photos")
        if need is None:
            return self.not_configured(ctx, "required_photos")
        if ctx.photo_count < need:
            return self.finding(
                ctx, f"Sample {ctx.code} has {ctx.photo_count} photo(s); {int(need)} are required.",
                photos=ctx.photo_count, required=need,
            )
        return None


class ShallowCore(QARule):
    code, severity, entity_type, title = "SHALLOW_CORE", ERROR, "sample", "Core depth"

    def check(self, ctx: SampleCtx) -> Finding | None:
        if ctx.depth_reached_cm >= ctx.campaign_depth_to_cm - DEPTH_TOLERANCE:
            return None
        allowed = ctx.rules.get("shallow_soil_allowed")
        base = (f"Sample {ctx.code} reached {ctx.depth_reached_cm:g} cm; the campaign needs "
                f"{ctx.campaign_depth_to_cm:g} cm.")
        details = {"depth_reached_cm": ctx.depth_reached_cm, "required_cm": ctx.campaign_depth_to_cm,
                   "shallow_soil_allowed": allowed}
        if allowed is True and (ctx.deviation_reason or "").strip():
            return self.finding(ctx, base + " Accepted as shallow soil with the recorded reason.", INFO, **details)
        if allowed is None:
            # Fail closed: without the rule, a shallow core is not accepted.
            return self.finding(ctx, base + " The rule for shallow soil is not configured, so it is not accepted.",
                                **details)
        return self.finding(ctx, base, **details)


class DepthGap(QARule):
    code, severity, entity_type, title = "DEPTH_GAP", BLOCKING, "sample", "Continuous depth layers"

    def check(self, ctx: SampleCtx) -> Finding | None:
        problems = layer_problems(ctx.layers, ctx.campaign_depth_from_cm)
        needed = min(ctx.depth_reached_cm, ctx.campaign_depth_to_cm)
        covered = max((t for _f, t in ctx.layers), default=ctx.campaign_depth_from_cm)
        if covered < needed - DEPTH_TOLERANCE:
            problems.append(f"The layers stop at {covered:g} cm but the core reached {needed:g} cm.")
        if problems:
            return self.finding(ctx, f"Sample {ctx.code}: " + " ".join(problems), problems=problems)
        return None


class CustodyGap(QARule):
    code, severity, entity_type, title = "CUSTODY_GAP", WARNING, "sample", "Lab receipt recorded"

    def check(self, ctx: SampleCtx) -> Finding | None:
        analysed = "analysed" in ctx.custody_events or ctx.has_lab_results
        if analysed and "lab_received" not in ctx.custody_events:
            return self.finding(
                ctx, f"Sample {ctx.code} has lab results but the lab never recorded receiving it.",
                events=ctx.custody_events,
            )
        return None


# ------------------------------------------------------------------ result rules
_METHOD_RULE = {"soc_pct": "permitted_soc_methods", "bulk_density_g_cm3": "permitted_bd_methods"}
_LIVE = ("pending", "accepted")


class AnalysisBeforeCollection(QARule):
    code, severity, entity_type, title = "ANALYSIS_BEFORE_COLLECTION", BLOCKING, "lab_result", "Analysis date"

    def check(self, ctx: ResultCtx) -> Finding | None:
        if ctx.status in _LIVE and ctx.analysed_on < ctx.collected_on:
            return self.finding(
                ctx, f"The {ctx.analyte} result for {ctx.layer_code} is dated {ctx.analysed_on.isoformat()}, "
                f"before the sample was collected ({ctx.collected_on.isoformat()}).",
                analysed_on=ctx.analysed_on.isoformat(), collected_on=ctx.collected_on.isoformat(),
            )
        return None


class MissingCertificate(QARule):
    code, severity, entity_type, title = "MISSING_CERTIFICATE", WARNING, "lab_result", "Lab certificate"

    def check(self, ctx: ResultCtx) -> Finding | None:
        if ctx.status == "accepted" and not ctx.has_certificate:
            return self.finding(ctx, f"The accepted {ctx.analyte} result for {ctx.layer_code} has no certificate.")
        return None


class MethodNotPermitted(QARule):
    code, severity, entity_type, title = "METHOD_NOT_PERMITTED", BLOCKING, "lab_result", "Permitted lab method"

    def check(self, ctx: ResultCtx) -> Finding | None:
        key = _METHOD_RULE.get(ctx.analyte)
        if key is None or ctx.status not in _LIVE:
            return None
        permitted = ctx.rules.get(key)
        if permitted is None:
            return self.not_configured(ctx, key)
        if ctx.method not in permitted:
            return self.finding(
                ctx, f"The {ctx.analyte} result for {ctx.layer_code} used “{ctx.method}”, which the methodology "
                f"does not permit ({', '.join(permitted)}).", method=ctx.method, permitted=list(permitted),
            )
        return None


class ImplausibleValue(QARule):
    code, severity, entity_type, title = "IMPLAUSIBLE_VALUE", WARNING, "lab_result", "Plausible value"
    SOC_MAX = 15.0
    BD_RANGE = (0.6, 2.0)

    def check(self, ctx: ResultCtx) -> Finding | None:
        if ctx.status not in _LIVE:
            return None
        if ctx.analyte == "soc_pct" and ctx.value > self.SOC_MAX:
            return self.finding(ctx, f"SOC of {ctx.value:g}% for {ctx.layer_code} is unusually high "
                                     f"(above {self.SOC_MAX:g}%). Please double-check.", value=ctx.value)
        lo, hi = self.BD_RANGE
        if ctx.analyte == "bulk_density_g_cm3" and not lo <= ctx.value <= hi:
            return self.finding(ctx, f"Bulk density of {ctx.value:g} g/cm³ for {ctx.layer_code} is outside the "
                                     f"usual {lo:g}–{hi:g} range. Please double-check.", value=ctx.value)
        return None


# ------------------------------------------------------------------ layer rules
class _MissingAnalyte(QARule):
    entity_type = "soil_layer"
    severity = BLOCKING
    analyte: ClassVar[str]
    label: ClassVar[str]

    def check(self, ctx: LayerCtx) -> Finding | None:
        if self.analyte in ctx.accepted_analytes:
            return None
        return self.finding(ctx, f"Layer {ctx.code} has no accepted {self.label} result.", analyte=self.analyte)


class MissingSoc(_MissingAnalyte):
    code, title, analyte, label = "MISSING_SOC", "SOC result", "soc_pct", "soil organic carbon"


class MissingBulkDensity(_MissingAnalyte):
    code, title, analyte, label = "MISSING_BULK_DENSITY", "Bulk density result", "bulk_density_g_cm3", "bulk density"


class MissingCoarseFraction(_MissingAnalyte):
    code, title, analyte, label = "MISSING_COARSE_FRACTION", "Stone fraction result", "coarse_fraction", "stone fraction"

    def check(self, ctx: LayerCtx) -> Finding | None:
        needed = ctx.rules.get("coarse_fragment_correction")
        if needed is None:
            return self.not_configured(ctx, "coarse_fragment_correction")
        if needed is not True:
            return None
        return super().check(ctx)


# ------------------------------------------------------------------ plan rules
class TooFewSamples(QARule):
    code, severity, entity_type, title = "TOO_FEW_SAMPLES", BLOCKING, "sample_plan", "Samples per zone"

    def check(self, ctx: PlanCtx) -> Finding | None:
        floor = ctx.rules.get("min_samples_per_stratum")
        need = ctx.plan_n if ctx.plan_status == "approved" else 0
        if floor is not None:
            need = max(need, int(floor))
        if ctx.collected < need:
            return self.finding(
                ctx, f"Zone {ctx.stratum_code} in {ctx.campaign_code} has {ctx.collected} collected sample(s); "
                f"{need} are needed.", collected=ctx.collected, required=need, plan_n=ctx.plan_n,
                min_samples_per_stratum=floor,
            )
        if floor is None:
            return self.not_configured(ctx, "min_samples_per_stratum")
        return None


# ------------------------------------------------------------------ pairing rules
class UnpairedSite(QARule):
    code, severity, entity_type, title = "UNPAIRED_SITE", WARNING, "sampling_point", "Paired re-visit"

    def check(self, ctx: PairCtx) -> Finding | None:
        reason = None
        if ctx.point_status == "skipped":
            reason = "was skipped in the monitoring campaign"
        elif ctx.point_status == "planned" and ctx.campaign_status in ("lab", "complete"):
            reason = "was not re-visited before fieldwork closed"
        elif not ctx.baseline_collected:
            reason = "has no baseline sample to pair with"
        if reason is None:
            return None
        policy = ctx.rules.get("unpaired_points_policy")
        sev = BLOCKING if policy == "block" else WARNING
        return self.finding(ctx, f"Site {ctx.site_code} {reason} ({ctx.campaign_code}).", sev, policy=policy)


# ------------------------------------------------------------------ VM0042 v2.2 sampling & custody rules
LIVE = _LIVE
SAME_POINT_M = 1.0  # platform definition: two cores within 1 m in one campaign are the same location


def _days(later: datetime, earlier: datetime) -> float:
    return (aware(later) - aware(earlier)).total_seconds() / 86400.0


class ShippedLate(QARule):
    code, severity, entity_type, title = "SHIPPED_LATE", BLOCKING, "sample", "Shipped within the allowed days"

    def check(self, ctx: SampleCtx) -> Finding | None:
        dispatched = ctx.custody_times.get("dispatched")
        if dispatched is None or ctx.campaign_last_collected_at is None:
            return None
        limit = ctx.rules.get("ship_within_days")
        if limit is None:
            return self.not_configured(ctx, "ship_within_days")
        days = _days(dispatched, ctx.campaign_last_collected_at)
        if days > float(limit):
            return self.finding(
                ctx, f"Sample {ctx.code} was dispatched {days:.1f} days after the campaign's last collection; "
                f"samples must be shipped within {float(limit):g} days.", days=round(days, 2), limit_days=limit,
                reference=REF["shipping"])
        return None


def _analysed_at(ctx: SampleCtx) -> datetime | None:
    if "analysed" in ctx.custody_times:
        return ctx.custody_times["analysed"]
    if ctx.first_analysed_on is not None:
        return datetime(ctx.first_analysed_on.year, ctx.first_analysed_on.month, ctx.first_analysed_on.day)
    return None


class StorageTooLong(QARule):
    code, severity, entity_type, title = "STORAGE_TOO_LONG", WARNING, "sample", "Refrigerated storage time"

    def check(self, ctx: SampleCtx) -> Finding | None:
        received = ctx.custody_times.get("lab_received")
        analysed = _analysed_at(ctx)
        if "refrigerated" not in ctx.storage_conditions or received is None or analysed is None:
            return None
        limit = ctx.rules.get("storage_max_days")
        if limit is None:
            return self.not_configured(ctx, "storage_max_days")
        days = _days(analysed, received)
        if days > float(limit):
            return self.finding(
                ctx, f"Sample {ctx.code} was kept refrigerated for {days:.0f} days before analysis; the limit is "
                f"{float(limit):g} days.", days=round(days, 1), limit_days=limit, reference=REF["storage"])
        return None


class FrozenStorage(QARule):
    code, severity, entity_type, title = "FROZEN_STORAGE", WARNING, "sample", "Samples not frozen"

    def check(self, ctx: SampleCtx) -> Finding | None:
        if "frozen" in ctx.storage_conditions:
            return self.finding(ctx, f"Sample {ctx.code} was stored frozen. Samples should be refrigerated or dried, "
                                     "not frozen.", reference=REF["storage"])
        return None


class ResampleIncrements(QARule):
    code, severity, entity_type, title = "RESAMPLE_INCREMENTS", BLOCKING, "sample", "Depth increments at re-sampling"

    def check(self, ctx: SampleCtx) -> Finding | None:
        if ctx.campaign_kind != "monitoring":
            return None
        need = ctx.rules.get("resample_min_depth_increments")
        if need is None:
            return self.not_configured(ctx, "resample_min_depth_increments")
        if len(ctx.layers) < int(need):
            return self.finding(
                ctx, f"Re-sampled core {ctx.code} has {len(ctx.layers)} depth increment(s); at least {int(need)} "
                "are required at re-sampling.", layers=len(ctx.layers), required=int(need),
                reference=REF["increments"])
        return None


class ReportingDepthShallow(QARule):
    code, severity, entity_type, title = "REPORTING_DEPTH_SHALLOW", BLOCKING, "sample", "Reporting depth"

    def check(self, ctx: SampleCtx) -> Finding | None:
        need = ctx.rules.get("stock_depth_cm")  # "Minimum reporting depth" in the rule pack
        if need is None:
            return self.not_configured(ctx, "stock_depth_cm")
        covered = max((t for _f, t in ctx.layers), default=0.0)
        if covered >= float(need) - DEPTH_TOLERANCE:
            return None
        details = {"reported_to_cm": covered, "required_cm": need, "depth_limit": ctx.depth_limit,
                   "reference": REF["depth"]}
        if ctx.depth_limit in ("bedrock", "hardpan") and (ctx.deviation_reason or "").strip():
            return self.finding(ctx, f"Sample {ctx.code} is reported to {covered:g} cm, stopped by "
                                     f"{ctx.depth_limit} (documented).", INFO, **details)
        return self.finding(
            ctx, f"Sample {ctx.code} is reported only to {covered:g} cm; SOC must be reported to at least "
            f"{float(need):g} cm unless bedrock or a hardpan is documented.", **details)


class DuplicateGps(QARule):
    code, severity, entity_type, title = "DUPLICATE_GPS", WARNING, "sample", "Distinct sample locations"

    def check(self, ctx: SampleCtx) -> Finding | None:
        if ctx.near_duplicates:
            return self.finding(
                ctx, f"Sample {ctx.code} is within {SAME_POINT_M:g} m of {', '.join(ctx.near_duplicates)} in the same "
                "campaign. Check that the coordinates were not copied.", others=list(ctx.near_duplicates),
                within_m=SAME_POINT_M, reference=REF["georeference"])
        return None


class MonitoringBeforeBaseline(QARule):
    code, severity, entity_type, title = "MONITORING_BEFORE_BASELINE", BLOCKING, "sample", "Baseline first"

    def check(self, ctx: SampleCtx) -> Finding | None:
        if ctx.campaign_kind != "monitoring" or ctx.baseline_collected_at is None or ctx.collected_at is None:
            return None
        if aware(ctx.collected_at) < aware(ctx.baseline_collected_at):
            return self.finding(
                ctx, f"Monitoring sample {ctx.code} was collected before the baseline sample of the same site "
                f"({aware(ctx.baseline_collected_at).date().isoformat()}).",
                collected_at=aware(ctx.collected_at).isoformat(),
                baseline_collected_at=aware(ctx.baseline_collected_at).isoformat(), reference=REF["remeasure"])
        return None


class StaleRemeasurement(QARule):
    code, severity, entity_type, title = "STALE_REMEASUREMENT", BLOCKING, "sample", "Time between measurements"

    def check(self, ctx: SampleCtx) -> Finding | None:
        if ctx.campaign_kind != "monitoring" or ctx.baseline_collected_at is None or ctx.collected_at is None:
            return None
        key = "remeasure_max_years"
        limit = ctx.rules.get(key)
        if limit is None:
            key = "monitoring_interval_max_years"
            limit = ctx.rules.get(key)
        if limit is None:
            return self.not_configured(ctx, "remeasure_max_years")
        years = interval_years(aware(ctx.baseline_collected_at).date(), aware(ctx.collected_at).date())
        if years > float(limit) + 1e-9:
            return self.finding(
                ctx, f"Sample {ctx.code} was re-measured {years:.1f} years after its baseline; SOC must be "
                f"re-measured at least every {float(limit):g} years.", years=round(years, 2), limit_years=limit,
                rule_key=key, reference=REF["remeasure"])
        return None


# ------------------------------------------------------------------ VM0042 v2.2 lab rules
class UnitMismatch(QARule):
    code, severity, entity_type, title = "UNIT_MISMATCH", BLOCKING, "lab_result", "Canonical unit"

    def check(self, ctx: ResultCtx) -> Finding | None:
        if ctx.status in LIVE and not ctx.unit_ok:
            return self.finding(
                ctx, f"The {ctx.analyte} result for {ctx.layer_code} is in “{ctx.unit}”, which can't be converted to "
                f"{ctx.canonical_unit or 'the unit this analyte needs'}.", unit=ctx.unit, expected=ctx.canonical_unit,
                reference=REF["esm"])
        return None


class MethodNotRecommended(QARule):
    code, severity, entity_type, title = "METHOD_NOT_RECOMMENDED", WARNING, "lab_result", "Recommended SOC method"

    def check(self, ctx: ResultCtx) -> Finding | None:
        if ctx.status in LIVE and ctx.method in NOT_RECOMMENDED_METHODS:
            return self.finding(
                ctx, f"The {ctx.analyte} result for {ctx.layer_code} used “{ctx.method}”, which VM0042 does not "
                "recommend (dry combustion is recommended). Keep the justification with the verification file.",
                method=ctx.method, justification=ctx.method_justification, reference=REF["methods"])
        return None


class BelowDetectionLimit(QARule):
    code, severity, entity_type, title = "BELOW_DETECTION_LIMIT", WARNING, "lab_result", "Above detection limit"

    def check(self, ctx: ResultCtx) -> Finding | None:
        if ctx.status in LIVE and ctx.below_detection_limit:
            return self.finding(
                ctx, f"The {ctx.analyte} result for {ctx.layer_code} ({ctx.value:g}) is below the lab's detection "
                f"limit ({ctx.detection_limit or 0:g}). It is stored as reported.", value=ctx.value,
                detection_limit=ctx.detection_limit, reference=REF["lab"])
        return None


class MissingSoilMassInputs(QARule):
    code, severity, entity_type, title = "MISSING_SOIL_MASS_INPUTS", INFO, "soil_layer", "Soil mass inputs (Eq. 3)"

    def check(self, ctx: LayerCtx) -> Finding | None:
        missing = []
        if not ctx.has_fine_soil_mass:
            missing.append("fine_soil_mass_g")
        if ctx.probe_diameter_mm is None:
            missing.append("probe_diameter_mm")
        if ctx.cores_composited is None:
            missing.append("cores_composited")
        if missing:
            return self.finding(
                ctx, f"Layer {ctx.code} lacks {', '.join(missing)}, so the equivalent-soil-mass stock will be derived "
                "from bulk density with a mass correction instead of Eq. 3.", missing=missing, reference=REF["esm"])
        return None


# ------------------------------------------------------------------ campaign / lab / stratum rules
class SeasonMismatch(QARule):
    code, severity, entity_type, title = "SEASON_MISMATCH", BLOCKING, "campaign", "Same season as baseline"

    def check(self, ctx: CampaignCtx) -> Finding | None:
        if ctx.kind != "monitoring" or ctx.season_gap_days is None or ctx.season_window_days is None:
            return None
        if ctx.season_gap_days <= ctx.season_window_days:
            return None
        details = {"gap_days": ctx.season_gap_days, "window_days": ctx.season_window_days,
                   "reference_campaign": ctx.season_reference, "override_reason": ctx.season_override_reason,
                   "reference": REF["season"]}
        msg = (f"Campaign {ctx.code} starts {ctx.season_gap_days} days (by time of year) away from "
               f"{ctx.season_reference}; re-sampling must be in the same season (±{ctx.season_window_days} days).")
        if (ctx.season_override_reason or "").strip():
            return self.finding(ctx, msg + " An override reason is recorded.", WARNING, **details)
        return self.finding(ctx, msg, **details)


class LabChangeUnjustified(QARule):
    code, severity, entity_type, title = "LAB_CHANGE_UNJUSTIFIED", BLOCKING, "campaign", "Same lab or justified change"

    def check(self, ctx: CampaignCtx) -> Finding | None:
        if ctx.unjustified_labs:
            return self.finding(
                ctx, f"Campaign {ctx.code} uses lab(s) {', '.join(ctx.unjustified_labs)} instead of "
                f"{', '.join(ctx.reference_labs) or 'the first campaign’s lab'}. Record a justified lab change with an "
                "SOP-consistency statement.", unjustified_labs=list(ctx.unjustified_labs),
                reference_labs=list(ctx.reference_labs), reference=REF["lab"])
        return None


class SpectroscopyCheckLow(QARule):
    code, severity, entity_type, title = "SPECTROSCOPY_CHECK_LOW", BLOCKING, "campaign", "Dry-combustion check"

    def check(self, ctx: CampaignCtx) -> Finding | None:
        if ctx.n_spectroscopy == 0:
            return None
        frac = ctx.rules.get("spectroscopy_check_fraction_min")
        if frac is None:
            return self.not_configured(ctx, "spectroscopy_check_fraction_min")
        need = 100.0 * float(frac)
        pct = 100.0 * ctx.n_spectroscopy_checked / ctx.n_spectroscopy
        if pct < float(need) - 1e-9:
            return self.finding(
                ctx, f"Only {ctx.n_spectroscopy_checked} of {ctx.n_spectroscopy} spectroscopy samples in {ctx.code} "
                f"({pct:.1f}%) were also analysed by dry combustion; at least {float(need):g}% (10–15% recommended) "
                "are needed to estimate the model error (Eq. 73).", checked=ctx.n_spectroscopy_checked,
                total=ctx.n_spectroscopy, checked_pct=round(pct, 2), required_pct=need,
                reference=REF["spectroscopy"])
        return None


class LabQcEvidenceMissing(QARule):
    code, severity, entity_type, title = "LAB_QC_EVIDENCE_MISSING", INFO, "lab", "Lab quality evidence"

    def check(self, ctx: LabCtx) -> Finding | None:
        missing = []
        if ctx.iso17025 is not True:
            missing.append("ISO/IEC 17025 accreditation")
        if ctx.proficiency_program in (None, "none"):
            missing.append("proficiency testing (NAPT, GLOSOLAN or other)")
        if not ctx.has_error_report:
            missing.append("analytical error / internal QC report")
        if missing:
            return self.finding(ctx, f"Lab {ctx.code} has not shown: {'; '.join(missing)}.", missing=missing,
                                reference=REF["lab"])
        return None


class StratificationFactorsMissing(QARule):
    code, severity, entity_type, title = "STRATIFICATION_FACTORS_MISSING", WARNING, "stratum", "Stratification factors"

    def check(self, ctx: StratumCtx) -> Finding | None:
        problems = stratification_problems(ctx.criteria or {})
        if problems:
            return self.finding(ctx, f"Zone {ctx.code}: " + " ".join(problems), problems=problems,
                                reference=REF["stratification"])
        return None


class TooFewComposites(QARule):
    code, severity, entity_type, title = "TOO_FEW_COMPOSITES", BLOCKING, "sample_plan", "Composite samples per zone"

    def check(self, ctx: PlanCtx) -> Finding | None:
        key = "min_composites_per_stratum"
        floor = ctx.rules.get(key)
        if floor is None:
            key = "min_samples_per_stratum"
            floor = ctx.rules.get(key)
        if floor is None:
            return self.not_configured(ctx, "min_composites_per_stratum")
        if ctx.collected < int(floor):
            return self.finding(
                ctx, f"Zone {ctx.stratum_code} in {ctx.campaign_code} has {ctx.collected} composite sample(s); "
                f"at least {int(floor)} are required per zone.", collected=ctx.collected, required=int(floor),
                rule_key=key, reference=REF["composites"])
        return None


REGISTRY: tuple[QARule, ...] = (
    SampleOutsideField(), GpsAccuracyLow(), TooFarFromSite(), MissingPhotos(), ShallowCore(), DepthGap(), CustodyGap(),
    AnalysisBeforeCollection(), MissingCertificate(), MethodNotPermitted(), ImplausibleValue(),
    MissingSoc(), MissingBulkDensity(), MissingCoarseFraction(),
    TooFewSamples(),
    UnpairedSite(),
    # VM0042 v2.2 conformance
    ShippedLate(), StorageTooLong(), FrozenStorage(), ResampleIncrements(), ReportingDepthShallow(), DuplicateGps(),
    MonitoringBeforeBaseline(), StaleRemeasurement(),
    UnitMismatch(), MethodNotRecommended(), BelowDetectionLimit(), MissingSoilMassInputs(),
    SeasonMismatch(), LabChangeUnjustified(), SpectroscopyCheckLow(), LabQcEvidenceMissing(),
    StratificationFactorsMissing(), TooFewComposites(),
)
BY_CODE = {r.code: r for r in REGISTRY}


def rules_for(entity_type: str) -> list[QARule]:
    return [r for r in REGISTRY if r.entity_type == entity_type]


def evaluate(contexts: Sequence[Any]) -> tuple[list[Finding], set[tuple[str, str, str]]]:
    """Run every applicable rule. Returns the findings and the (entity_type, entity_id, rule) keys checked."""
    findings: list[Finding] = []
    checked: set[tuple[str, str, str]] = set()
    for ctx in contexts:
        for rule in rules_for(ctx.entity_type):
            checked.add((ctx.entity_type, ctx.entity_id, rule.code))
            f = rule.check(ctx)
            if f is not None:
                findings.append(f)
    return findings, checked
