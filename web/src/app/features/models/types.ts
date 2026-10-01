export interface ModelMetrics {
  rmse: number; mae: number; bias: number; r2: number; coverage_90: number; k: number;
  folds?: { fold: number; n_test: number; farms: string[]; rmse?: number; mae?: number; bias?: number }[];
}
export interface ModelVersion {
  id: string; name: string; version: string; kind: string; algorithm: string; features: string[]; metrics: ModelMetrics;
  validation: string; status: 'candidate' | 'approved' | 'retired' | string; created_by: string | null; approved_by: string | null;
  approved_at: string | null; created_at: string; notes: string | null; data_class: string; training_rows: number | null;
  credit_eligible?: boolean; credit_eligible_reason?: string; feature_set_id?: string | null; review_required?: boolean;
  latest_drift?: { report_id: string; status: string; checked_at: string; n_new: number } | null;
  training_summary?: {
    target: string; project_id: string | null; rows: number; farms: number; fields: number; samples: string[];
    excluded: { sample_code: string; missing_features: string[] }[]; clay_sources: Record<string, number>; target_range: [number, number];
    feature_set?: { id: string; name: string; version: number; definition_sha256: string };
  };
  params?: {
    features: string[]; coefficients: Record<string, number>; coefficients_standardised: number[]; intercept: number;
    lambda: number; residual_sd: number; feature_ranges: Record<string, [number, number]>;
  };
}

export interface SocCell {
  field_id: string; field_code: string; farm_id: string; area_ha: number; features: Record<string, number | null>;
  feature_sources: Record<string, string>; data_class: string; predicted_soc_pct: number | null; lower: number | null;
  upper: number | null; interval_width: number | null; in_domain: boolean; out_of_domain_features: string[];
  missing_features: string[]; priority: number; reasons: string[]; sample_next: boolean; rank: number;
}
export interface SocMap {
  id: string; project_id: string; model_id: string; generated_on: string; data_class: string;
  credit_eligible?: boolean; credit_eligible_reason?: string;
  summary: { model: string; fields: number; predicted: number; out_of_domain: number; mean_predicted_soc_pct: number | null; sample_next: string[]; note: string };
  cells: SocCell[];
}

export const FEATURES: { key: string; label: string; hint: string }[] = [
  { key: 'ndvi_mean', label: 'Mean NDVI (12 months)', hint: 'Average greenness from clear satellite passes' },
  { key: 'ndmi_mean', label: 'Mean NDMI (12 months)', hint: 'Average surface moisture from satellite' },
  { key: 'rain_365d', label: 'Rainfall, last 365 days', hint: 'From supporting data — needs 180+ days' },
  { key: 'temp_mean', label: 'Mean air temperature', hint: 'From supporting data — needs 180+ days' },
  { key: 'elevation_m', label: 'Elevation', hint: 'From the field record' },
  { key: 'clay_pct', label: 'Clay content', hint: 'Lab texture where measured, else SoilGrids (modelled)' },
  { key: 'practice_count', label: 'Practices adopted', hint: 'Number of project practices recorded' },
];
export function featureLabel(k: string): string {
  return FEATURES.find(f => f.key === k)?.label ?? k.replace(/_/g, ' ');
}

export function algorithmLabel(a: string): string {
  return ({ ridge_regression_closed_form: 'Ridge regression' } as Record<string, string>)[a] ?? a.replace(/_/g, ' ');
}
export function validationLabel(v: string, k?: number): string {
  if (v === 'grouped_kfold_by_farm') return `Held-out farms${k ? ` · ${k} folds` : ''}`;
  return v.replace(/_/g, ' ');
}

/** Interpolate along a list of hex stops, t in [0,1]. */
export function ramp(t: number, stops: string[]): string {
  const x = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0)) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(x));
  const f = x - i;
  const a = hex(stops[i]), b = hex(stops[i + 1]);
  const c = a.map((v, j) => Math.round(v + (b[j] - v) * f));
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
}
function hex(h: string): number[] {
  const s = h.replace('#', '');
  return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16));
}
/** Sequential ramps built from the design tokens. */
export const GREEN_RAMP = ['#e3eee6', '#86b797', '#2f7249', '#173826'];
export const CLAY_RAMP = ['#fcf3ec', '#e7a57b', '#c76329', '#8f3f17'];

/** Replace raw feature keys in API reason text with their plain-English labels. */
export function humanReason(s: string): string {
  return s.replace(/\b(ndvi_mean|ndmi_mean|rain_365d|temp_mean|elevation_m|clay_pct|practice_count)\b/g, k => featureLabel(k).toLowerCase());
}

/* ------------------------------------------------------------------ feature store */
export interface CatalogueItem {
  feature: string; group: string; window_required: boolean; unit: string; data_class: string; description: string;
}
export interface FeatureSetItem { feature: string; column: string; window_days?: number; wet_threshold_pct?: number }
export interface FeatureSet {
  id: string; name: string; version: number; definition: { features: FeatureSetItem[] }; columns: string[];
  status: 'active' | 'retired' | string; description: string; definition_sha256: string; created_at: string; created_by: string | null;
}
export interface FieldFeatures {
  id: string; field_id: string; feature_set_id: string; feature_set: string; as_of_date: string;
  values: Record<string, number | null>; data_classes: Record<string, string>; details: Record<string, Record<string, unknown>>;
  input_fingerprint: string; created_at: string; data_class: string; credit_eligible: boolean; credit_eligible_reason: string;
  point_in_time: string; status?: string;
}
export interface Materialized {
  feature_set_id: string; feature_set: string; project_id: string; as_of_date: string; fields: number; written: number;
  unchanged: number; items: FieldFeatures[]; credit_eligible: boolean; credit_eligible_reason: string;
}

/* ------------------------------------------------------------------ drift */
export interface DriftRow {
  sample_code: string; field_id: string; lab_soc_pct: number; predicted_soc_pct: number; lower: number; upper: number;
  residual: number; in_domain: boolean; covered: boolean;
}
export interface DriftReport {
  id: string; model_id: string; status: 'ok' | 'warning' | 'drift' | 'insufficient' | string; n_new: number;
  metrics: { rmse?: number; mae?: number; bias?: number; coverage?: number; out_of_domain?: number; rmse_ratio?: number;
    bias_in_residual_sd?: number; skipped?: { sample_code: string; missing_features: string[] }[] };
  baseline: { validation_rmse: number | null; validation_bias: number | null; validation_coverage_90: number | null; residual_sd: number | null };
  thresholds: Record<string, number>; reasons: string[]; rows: DriftRow[]; action: 'review_required' | 'none' | string;
  created_at: string; created_by: string | null; credit_eligible: boolean; credit_eligible_reason: string;
}
export const DRIFT_TONE: Record<string, string> = { ok: 'ok', warning: 'warning', drift: 'failed', insufficient: 'inconclusive' };
export const DRIFT_LABEL: Record<string, string> = { ok: 'No drift', warning: 'Warning', drift: 'Drift', insufficient: 'Not enough new data' };
