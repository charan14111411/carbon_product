/* VM0042 v2.2 Quantification Approach 1 (measure and model): shapes returned by api/app/modules/qa1. */

export type Pool = 'soc' | 'ch4_soil' | 'n2o_soil';
export const POOLS: Pool[] = ['soc', 'ch4_soil', 'n2o_soil'];

export const POOL_LABEL: Record<string, string> = { soc: 'Soil organic carbon', ch4_soil: 'Soil CH₄', n2o_soil: 'Soil N₂O' };
export const POOL_SHORT: Record<string, string> = { soc: 'SOC', ch4_soil: 'CH₄', n2o_soil: 'N₂O' };

/** VM0042 §4 condition 1 (Appendix 1) practice categories. */
export const PRACTICES: { key: string; label: string; ref: string }[] = [
  { key: 'fertilizer_management', label: 'Fertiliser management', ref: '1(a)' },
  { key: 'water_management', label: 'Water management', ref: '1(b)' },
  { key: 'tillage_residue', label: 'Tillage & residue', ref: '1(c)' },
  { key: 'crop_planting_harvest', label: 'Crop planting & harvest', ref: '1(d)' },
  { key: 'grazing', label: 'Grazing', ref: '1(e)' },
];
export function practiceLabel(k: string): string {
  return PRACTICES.find(p => p.key === k)?.label ?? k.replace(/_/g, ' ');
}

export const CLIMATE_ZONES = [
  'tropical_wet', 'tropical_moist', 'tropical_dry', 'tropical_montane', 'warm_temperate_moist', 'warm_temperate_dry',
  'cool_temperate_moist', 'cool_temperate_dry', 'boreal_moist', 'boreal_dry', 'polar_moist', 'polar_dry',
];
export const SOIL_TEXTURES = [
  'sand', 'loamy_sand', 'sandy_loam', 'loam', 'silt_loam', 'silt', 'sandy_clay_loam', 'clay_loam', 'silty_clay_loam',
  'sandy_clay', 'silty_clay', 'clay',
];
export const CROP_GROUPS = ['grasses_cereals', 'legumes', 'non_legume_broadleaf', 'perennial_tree'];

export interface ValidationDomain {
  crop_functional_groups: string[];
  practice_categories: string[];
  climate_zones: string[];
  soil_textures: string[];
}

export interface ValidationMetric {
  pool: Pool;
  practice_category: string;
  n_sites: number;
  median_duration_years: number;
  bias: number;
  bias_test_passed: boolean;
  s2_model_delta: number | null;
  s2_model: number | null;
  rho: number | null;
  cov: number | null;
  rmse: number | null;
  notes: string;
}

export interface Qa1Model {
  id: string;
  name: string;
  version: string;
  revision: number;
  public_source: string;
  source_accessed_on: string | null;
  publicly_available: boolean;
  documentation_ref: string;
  peer_review_refs: string[];
  parameter_set: Record<string, unknown>;
  parameter_sources: string;
  parameter_fingerprint: string;
  validation_report_evidence_id: string | null;
  ime_report_evidence_id: string | null;
  validation_domain: ValidationDomain;
  pools: Pool[];
  validation_metrics: ValidationMetric[];
  trueup_ids: string[];
  notes: string;
  status: 'draft' | 'approved' | 'retired';
  editors: string[];
  approved_by: string | null;
  approved_at: string | null;
  supersedes_id: string | null;
  created_by: string | null;
  created_at: string;
  approval_problems: string[];
  data_class: string;
}

export interface RunImport {
  id: string;
  project_id: string;
  model_id: string;
  model_fingerprint: string;
  label: string;
  source_format: 'csv' | 'json';
  sha256: string;
  evidence_id: string;
  initial_campaign_id: string | null;
  initial_measurement_date: string | null;
  t0_year: number;
  row_count: number;
  site_codes: string[];
  first_year: number;
  last_year: number;
  pools: Pool[];
  mc_draws: number;
  warnings: string[];
  spectroscopy_used: boolean;
  spectroscopy_de_minimis_evidence_id: string | null;
  supersedes_id: string | null;
  notes: string;
  created_by: string | null;
  created_at: string;
  eq4_points?: number;
  activity_records_used?: number;
  data_class: string;
}

export interface Uncertainty {
  method: 'analytical' | 'monte_carlo';
  total_t_co2e: number;
  mean_t_co2e_ha: number;
  total_area_ha: number;
  s2_sampling: number;
  s2_sampling_by_stratum: Record<string, number>;
  s2_model: number;
  s2_mean: number;
  variance_total: number;
  df: number;
  df_components: [number, number][];
  by_stratum: Record<string, { area_ha: number; n: number; mean_t_co2e_ha?: number; s2_sampling: number; s2_model_h?: number; tau_h?: number; mu_h?: number }>;
  mc_draws: number | null;
  mc_error_factor: number | null;
}

export interface PoolResult {
  pool: Pool;
  uncertainty: Uncertainty;
  terms: Record<string, { value_t_co2e: number; variance: number; df: number | null }>;
  equations: string[];
  project_total_t_co2e: number;
  baseline_total_t_co2e: number;
  reduction_total_t_co2e: number;
  model_error_by_stratum: Record<string, { practice_category: string; s2_model_delta: number; how: string; n_sites: number; bias: number; median_duration_years: number }>;
  draws_source: string | null;
  unit_note: string;
  points: Record<string, { site_code: string; reduction_t_co2e_ha: number; project_t_co2e_ha: number; baseline_t_co2e_ha: number }[]>;
}

export interface TrueUpState {
  rule_key?: string;
  max_years: number;
  last_measured_on: string;
  due_by: string;
  as_of: string;
  overdue: boolean;
  latest_trueup_id: string | null;
  problems: { code: string; message: string; import_ids?: string[] }[];
  reference: string;
  error?: string;
}

export interface Analysis {
  id: string;
  project_id: string;
  period_label: string;
  period_start: string;
  period_end: string;
  model_id: string;
  import_ids: string[];
  method: 'analytical' | 'monte_carlo';
  seed: number | null;
  rule_pack_id: string;
  rules_used: Record<string, unknown>;
  results: {
    pools: Record<string, PoolResult>;
    period_years: number;
    vintages: [number, number][];
    mc_draws: number | null;
    model: { id: string; name: string; version: string; revision: number; parameter_fingerprint: string };
    data_class: string;
  };
  trueup: TrueUpState | Record<string, never>;
  sha256: string;
  created_by: string | null;
  created_at: string;
  published_term_ids: string[];
}

export interface TrueUp {
  id: string;
  project_id: string;
  model_id: string;
  import_id: string;
  campaign_id: string;
  measured_on: string;
  points: { site_code: string; stratum: string; sample_code: string; collected_at: string; measured_soc_t_c_ha: number; modelled_soc_t_c_ha: number; reference_mass_t_ha: number; error_t_co2e_ha: number }[];
  stats: { n: number; errors: number[]; mean_error: number; s2_error: number; rmse: number; unit: string; error_definition: string; validated_soc_metrics: ValidationMetric[]; reference: string; next_steps: string[] };
  evidence_ids: string[];
  notes: string;
  status: 'draft' | 'approved';
  approved_by: string | null;
  approved_at: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Qa1Status {
  project_id: string;
  approaches: Record<string, string | null>;
  uncertainty_method: string | null;
  imports: RunImport[];
  trueups: TrueUp[];
  trueup_state: TrueUpState | null;
}

export interface CampaignLite { id: string; code: string; name: string; kind: 'baseline' | 'monitoring'; status: string; planned_start: string; planned_end: string }

export function modelLabel(m: { name: string; version: string; revision: number } | null | undefined): string {
  return m ? `${m.name} ${ver(m.version)} · rev ${m.revision}` : '—';
}

/** "v4.5" for numeric versions, the text as-is otherwise. */
export function ver(v: string | null | undefined): string {
  if (!v) return '';
  return /^\d/.test(v) ? `v${v}` : v;
}
