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
from datetime import date
from typing import Any, ClassVar

from app.modules.sampling.domain import DEPTH_TOLERANCE, layer_problems

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
    entity_type: ClassVar[str] = "sample"


@dataclass
class LayerCtx:
    entity_id: str
    code: str
    accepted_analytes: set[str]
    rules: dict[str, Any]
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


REGISTRY: tuple[QARule, ...] = (
    SampleOutsideField(), GpsAccuracyLow(), TooFarFromSite(), MissingPhotos(), ShallowCore(), DepthGap(), CustodyGap(),
    AnalysisBeforeCollection(), MissingCertificate(), MethodNotPermitted(), ImplausibleValue(),
    MissingSoc(), MissingBulkDensity(), MissingCoarseFraction(),
    TooFewSamples(),
    UnpairedSite(),
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
