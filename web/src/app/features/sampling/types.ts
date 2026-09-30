/** Shapes returned by the sampling API (api/app/modules/sampling/service.py). */

export interface Stratum {
  id: string;
  project_id: string;
  code: string;
  name: string;
  role: 'project' | 'control';
  control_for_code: string | null;
  criteria: Record<string, unknown>;
  field_ids: string[];
  field_codes: (string | null)[] | null;
  area_ha: number;
  area_data_class: string;
  version: number;
  effective_from: string;
  effective_to: string | null;
  is_current: boolean;
}

export interface CampaignProgress {
  points_total: number;
  points_planned: number;
  points_collected: number;
  points_skipped: number;
  layers_total: number;
  layers_with_accepted_soc: number;
}

export type CampaignStatus = 'planned' | 'fieldwork' | 'lab' | 'complete';

export interface Campaign {
  id: string;
  project_id: string;
  code: string;
  name: string;
  kind: 'baseline' | 'monitoring';
  design: 'paired' | 'independent';
  revisits_campaign_id: string | null;
  planned_start: string;
  planned_end: string;
  depth_from_cm: number;
  depth_to_cm: number;
  placement_seed: number;
  status: CampaignStatus;
  next_status: CampaignStatus | null;
  progress?: CampaignProgress;
  plans?: SamplePlan[];
}

export interface PlanWarning { code: string; message: string }

export interface SamplePlan {
  id: string;
  campaign_id: string;
  stratum_id: string;
  stratum_code: string | null;
  n_required: number;
  method: 'manual' | 'variance_formula';
  inputs: Record<string, number>;
  justification: string;
  status: 'draft' | 'approved';
  created_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  warnings: PlanWarning[];
  floor_checked: boolean;
}

export interface SamplingPoint {
  id: string;
  campaign_id: string;
  site_id: string;
  site_code: string;
  latitude: number;
  longitude: number;
  field_id: string;
  field_code: string;
  stratum_code: string | null;
  sequence: number;
  status: 'planned' | 'collected' | 'skipped';
  skip_reason: string | null;
  assigned_to: string | null;
  assigned_to_name: string | null;
}

export interface SampleSummary {
  id: string;
  code: string;
  campaign_id: string;
  point_id: string;
  site_id: string;
  site_code: string | null;
  collected_at: string;
  latitude: number;
  longitude: number;
  gps_accuracy_m: number | null;
  distance_from_site_m: number;
  depth_reached_cm: number;
  deviation_reason: string | null;
  device_id: string | null;
  client_ref: string;
  photo_ids: string[];
  status: string;
  data_class: string;
}

export interface LayerResult {
  id: string;
  analyte: string;
  value: number;
  unit: string;
  method: string;
  status: string;
  version: number;
  analysed_on: string;
  data_class: string;
}

export interface SampleLayer {
  id: string;
  code: string;
  label_qr: string;
  depth_from_cm: number;
  depth_to_cm: number;
  lab_results: LayerResult[];
}

export interface CustodyEvent {
  id: string;
  event: string;
  occurred_at: string;
  location: string;
  seal_intact: boolean | null;
  count_matches: boolean | null;
  notes: string;
  corrects_event_id: string | null;
  recorded_by: string | null;
  recorded_at: string;
}

export interface ContextBlock {
  status: 'available' | 'not_available';
  reason?: string;
  values?: Record<string, unknown>[];
}

export interface SampleDetail extends SampleSummary {
  context: {
    location?: { latitude: number; longitude: number; gps_accuracy_m: number | null };
    time?: string;
    collector?: { id: string; name: string };
    distance_m?: number;
    weather?: ContextBlock;
    sensor?: ContextBlock;
    satellite?: ContextBlock;
  };
  layers: SampleLayer[];
  custody: CustodyEvent[];
  photos: { id: string; filename: string; sha256: string; latitude: number | null; longitude: number | null }[];
  collected_by: string | null;
}

export interface Trace {
  matched: 'sample' | 'bag';
  query: string;
  bag: { id: string; code: string; label_qr: string } | null;
  project: { id: string; code: string; name: string };
  campaign: Campaign;
  stratum: { id: string; code: string; name: string } | null;
  site: { id: string; code: string; latitude: number; longitude: number };
  field: { id: string; code: string; name: string };
  point: { id: string; status: string; assigned_to: string | null };
  sample: SampleDetail;
  lab_batches: { id: string; code: string; status: string; lab_id: string; layer_ids: string[] }[];
}

export interface Finding {
  id: string;
  entity_type: string;
  entity_id: string;
  rule_code: string;
  severity: string;
  message: string;
  status: string;
}

export interface Enrolment {
  id: string;
  field_id: string;
  field_code: string;
  field_area_ha: number;
  farmer_name: string;
  status: string;
}

export interface UserLite {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

export const STATUS_COLOR: Record<string, string> = {
  planned: '#737c76',
  collected: '#2f7249',
  skipped: '#c76329',
};

export const CUSTODY_LABEL: Record<string, string> = {
  collected: 'Collected in the field', packed: 'Packed and sealed', dispatched: 'Dispatched',
  courier_received: 'Received by courier', lab_received: 'Received at the lab', opened: 'Opened at the lab',
  analysed: 'Analysed', archived: 'Archived', correction: 'Correction',
};

export const ANALYTE_LABEL: Record<string, string> = {
  soc_pct: 'Soil organic carbon', bulk_density_g_cm3: 'Bulk density', coarse_fraction: 'Coarse fraction',
  ph: 'pH', texture_clay_pct: 'Clay content',
};

/** Two-sided z for a confidence level (normal quantile), matching scipy.stats.norm.ppf((1+c)/2). */
export function zFor(confidence: number): number {
  const p = (1 + confidence) / 2;
  // Acklam's rational approximation of the inverse normal CDF (error < 1.2e-9).
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  let q: number, r: number;
  if (p < pl) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p <= 1 - pl) {
    q = p - 0.5;
    r = q * q;
    return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

export function sampleSize(mean: number, sd: number, errPct: number, confidence: number): { n: number; z: number; raw: number } | null {
  if (!(mean > 0) || !(sd >= 0) || !(errPct > 0 && errPct <= 100) || !(confidence > 0 && confidence < 1)) return null;
  const z = zFor(confidence);
  const raw = ((z * sd) / ((errPct / 100) * mean)) ** 2;
  return { n: Math.max(1, Math.ceil(Math.round(raw * 1e9) / 1e9)), z, raw };
}
