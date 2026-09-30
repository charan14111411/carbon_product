export interface ModelMetrics {
  rmse: number; mae: number; bias: number; r2: number; coverage_90: number; k: number;
  folds?: { fold: number; n_test: number; farms: string[]; rmse?: number; mae?: number; bias?: number }[];
}
export interface ModelVersion {
  id: string; name: string; version: string; kind: string; algorithm: string; features: string[]; metrics: ModelMetrics;
  validation: string; status: 'candidate' | 'approved' | 'retired' | string; created_by: string | null; approved_by: string | null;
  approved_at: string | null; created_at: string; notes: string | null; data_class: string; training_rows: number | null;
  training_summary?: {
    target: string; project_id: string | null; rows: number; farms: number; fields: number; samples: string[];
    excluded: { sample_code: string; missing_features: string[] }[]; clay_sources: Record<string, number>; target_range: [number, number];
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
