import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';

/* ------------------------------------------------------------------ API shapes */
export interface RunSummary {
  id: string;
  run_id: string;
  project_id: string;
  period_label: string;
  period_start: string;
  period_end: string;
  gross_t_co2e: number;
  uncertainty_deduction_t_co2e: number;
  buffer_t_co2e: number;
  net_t_co2e: number;
  reductions_t_co2e: number;
  removals_t_co2e: number;
  status: string;
  engine_version: string;
  snapshot_sha256: string;
  supersedes_run_id: string | null;
  flags: Record<string, boolean>;
  created_at: string;
  created_by: string | null;
  data_class: string;
}

export interface StatusEvent { status: string; note: string; at: string; by_id: string | null; by: string }

export interface StratumResult {
  code: string;
  role: string;
  area_ha: number;
  design: string;
  n_baseline: number;
  n_monitoring: number;
  n_used: number;
  mean_baseline_t_c_ha: number;
  mean_monitoring_t_c_ha: number;
  measured_delta_t_c_ha: number;
  delta_t_c_ha: number;
  variance: number;
  se: number;
  df: number;
  excluded_sites: string[];
  control_code: string | null;
  control_delta_t_c_ha: number | null;
  /* VM0042 v2.2 (Eq. 70–71, ESM) — absent on runs made before engine v2.2 */

  reference_mass_t_ha?: number;
  s2_f?: number;
  s2_s?: number;
  cov_fs?: number;
  s2_wp?: number;
  s2_bsl?: number;
  s2_dsoc?: number;
  annual_delta_t_c_ha?: number | null;
  quantification_unit?: string | null;
}

export interface TermResult {
  term: string; value_t_co2e: number; variance: number; df: number | null; source: string; status: string;
  data_class?: string; used_as?: string;
}

/** One line of the engine's equation trail (VM0042 v2.2 equation numbers). */
export interface EquationRow { eq: string; label: string; value: number | null; unit: string }

export interface VintageRow {
  year: number; weight: number; share: number; indicator: number; cumulative_d_wp_t_co2e: number;
  sum_delta_e_t_co2e: number; delta_e: Record<string, number>; d_wp_t_co2e: number; d_bsl_t_co2e: number;
  gross_t_co2e: number; er_t_co2e: number; cr_t_co2e: number; leakage_t_co2e: number; lk_er_t_co2e: number;
  lk_cr_t_co2e: number; er_net_t_co2e: number; cr_net_t_co2e: number; err_net_t_co2e: number;
  buffer_er_t_co2e: number; buffer_cr_t_co2e: number; buffer_er_eq75_t_co2e: number; buffer_cr_eq76_t_co2e: number;
  vcu_er: number; vcu_cr: number; vcu: number;
}

export interface SocOut {
  approach: string; stock_method: string; measurement_interval_years: number | null; period_years: number;
  credited_years: number; reporting_depth_cm: number; soil_wp_t_co2e: number; biochar_t_co2e: number;
  soil_wp_after_biochar_t_co2e: number; soil_bsl_t_co2e: number; tree_wp_t_co2e: number; tree_bsl_t_co2e: number;
  unc_co2: number; i_soil: number; multiplier: number; d_wp_t_co2e: number; d_bsl_t_co2e: number;
  prior_cumulative_d_wp_t_co2e: number; source: string;
  multistage?: MultistageSummary;
}

/** VM0042 Appendix 6 design summary carried on results.soc when the campaign used a multi-stage design. */
export interface MultistageSummary {
  design_id: string; version: number; stage1_unit: string; stage1_selection: string; description: string; estimator: string;
  population_area_ha: number; total_start_t_c: number; total_final_t_c: number; delta_t_c: number;
  variance_project_t_c2: number; variance_control_t_c2: number; df: number | null;
  units: { key: string; label: string; field_selection: string; k: number; probability: number; draws: number; total_start_t_c: number;
    total_final_t_c: number; s2_start: number; s2_final: number; cov: number; s2_change: number; df: number | null; eq: string }[];
}

export interface UncSource {
  approach?: string; eq?: string; method?: string; s2_mean?: number; mean?: number; df?: number | null; t?: number | null;
  unc_pct?: number; i_soil?: number; multiplier?: number; confidence?: number; source?: string; variance?: number;
  value_t_co2e?: number; after_uncertainty?: number; ef_end?: string;
}

/** QA3 per-source summary (emissions module). */
export interface Qa3Source {
  label: string; eq: string; symbol: string; approach: string; ef_end: 'central' | 'low' | 'high' | string;
  baseline_t_co2e: number; project_t_co2e: number; reduction_t_co2e: number;
  per_year: { year: number; baseline_t_co2e: number; project_t_co2e: number; reduction_t_co2e: number }[];
}

export interface LeakageItem {
  field_id: string; year: number; type: string; mass_t: number; additional_t: number; carbon_content: number | null;
  exemption: string | null; weight: number; le_oa_t_co2e: number; eq: string;
}

export interface Qa3Result {
  years: number[]; year_weights: Record<string, number>; sources: Record<string, Qa3Source>;
  by_year: Record<string, Record<string, number>>; leakage_oa_by_year: Record<string, number>;
  leakage_items: LeakageItem[]; biochar_t_co2e: number; biochar_items: { field_id: string; year: number; organic_carbon_t: number; t_co2e: number }[];
  units: { source: string; unit: string; year: number; area_ha: number; baseline_t_co2e_ha: number; project_t_co2e_ha: number; weight: number; reduction_t_co2e: number }[];
  fields: { field_id: string; unit: string; year: number; baseline_data_year: number | null; area_ha: number; baseline_t_co2e: number; project_t_co2e: number; baseline_t_co2e_ha: number | null; project_t_co2e_ha: number | null }[];
  trail: { source: string; eq: string; field_id: string; scenario: string; year: number; data_year: number; t_co2e: number; inputs: Record<string, unknown>; factor_end: string }[];
  tiers: Record<string, number>; skipped_sources: string[]; warnings: string[];
  factors_used: Record<string, { value: number; end: string; range_missing?: boolean }>;
  /** §8.3 / §8.4.2 livestock floor adjustments, one per field-year-type. */
  livestock_floor?: LivestockFloorItem[];
  /** Option (a) applied somewhere: displacement leakage (VMD0054, Eq. 36) must be quantified. */
  displacement_leakage_required?: boolean;
}

export interface LivestockFloorItem { field_id: string; year: number; type: string; lookback_average_head: number; project_head: number; option: 'a' | 'b' }

export interface EmissionsOut {
  qa3: Qa3Result | null; sum_delta_e_t_co2e: number; sum_delta_e_before_uncertainty_t_co2e: number;
  components: Record<string, number>; symbols: Record<string, string>; excluded_de_minimis: string[];
}

export interface LeakageOut {
  le_oa_t_co2e: number; le_oa_by_year: Record<string, number>; le_oa_items: LeakageItem[]; le_br_t_co2e: number;
  lk_disp_t_co2e: number; other_t_co2e: number; total_t_co2e: number; lk_er_t_co2e: number; lk_cr_t_co2e: number;
}

export interface DeMinimis {
  threshold_pct: number; total_benefit_t_co2e: number; candidates: string[]; excluded: string[];
  shares_pct: Record<string, number | null>;
}

export interface EngineResult {
  stock_method: string;
  design: string;
  strata: StratumResult[];
  control_strata: StratumResult[];
  controls_used: boolean;
  dsoc_t_c: number;
  dsoc_t_co2e: number;
  dsoc_variance_t_co2e: number;
  terms: TermResult[];
  gross_t_co2e: number;
  net_before_uncertainty_t_co2e: number;
  total_variance: number;
  se_t_co2e: number;
  df_effective: number;
  confidence: number;
  t_value: number | null;
  uncertainty_deduction_t_co2e: number;
  net_after_uncertainty_t_co2e: number;
  non_permanence_risk_pct: number;
  buffer_t_co2e: number;
  credits_t_co2e: number;
  reductions_t_co2e: number;
  removals_t_co2e: number;
  split: Record<string, number>;
  flags: Record<string, boolean>;
  /* VM0042 v2.2 — absent on runs made before engine v2.2 */
  soc_approach?: string;
  soc?: SocOut;
  emissions?: EmissionsOut;
  leakage?: LeakageOut;
  uncertainty?: Record<string, UncSource | Record<string, UncSource>>;
  vintages?: VintageRow[];
  equations?: EquationRow[];
  de_minimis?: DeMinimis;
  warnings?: string[];
}

export interface RulesSnapshot {
  pack_id: string;
  methodology: string;
  values: Record<string, unknown>;
  sources: Record<string, unknown>;
}

export interface RunDetail extends RunSummary {
  created_by_name: string;
  baseline_campaign_id: string;
  monitoring_campaign_id: string;
  rule_pack_id: string;
  results: EngineResult;
  inputs_snapshot: {
    period: { label: string; start: string; end: string };
    sources: {
      campaigns: { baseline: { id: string; code: string; design: string }; monitoring: { id: string; code: string; design: string; planned_start: string } };
      strata: { id: string; code: string; name: string; role: string; control_for_code: string | null; version: number; area_ha: number; field_ids: string[] }[];
      samples: Record<string, unknown>;
      layers: Record<string, unknown>;
      terms: Record<string, { id: string; version: number; value_t_co2e: number; variance: number; df: number | null; source: string }>;
    };
  };
  rules_snapshot: RulesSnapshot;
  status_history: StatusEvent[];
}

export interface Term {
  id: string;
  project_id: string;
  period_label: string;
  term: string;
  value_t_co2e: number;
  variance: number;
  df: number | null;
  source: string;
  version: number;
  status: string;
  created_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface ReadinessDim { key: string; label: string; status: 'ok' | 'warning' | 'blocking'; detail: string }
export interface Readiness { project_id: string; dimensions: ReadinessDim[]; score_pct: number; ready: boolean }

export interface Campaign {
  id: string;
  code: string;
  name: string;
  kind: string;
  design: string;
  status: string;
  planned_start: string | null;
  planned_end: string | null;
  revisits_campaign_id: string | null;
}

/* ------------------------------------------------------------------ provenance */
export interface EvidenceBrief { id: string; sha256: string | null; filename?: string; kind?: string; mime_type?: string; missing?: boolean }
export interface ProvLabResult {
  id: string; analyte: string; value: number; unit: string; method: string; status: string; version: number;
  analysed_on: string; used_in_calculation: boolean; data_class: string; certificate: EvidenceBrief | null;
}
export interface ProvLayer { id: string; code: string; depth_from_cm: number; depth_to_cm: number; used_in_calculation: boolean; lab_results: ProvLabResult[] }
export interface ProvCustody { id: string; event: string; occurred_at: string; location: string | null; seal_intact: boolean | null; count_matches: boolean | null; notes: string | null }
export interface ProvSample {
  id: string; code: string; campaign: string; collected_at: string;
  gps: { latitude: number | null; longitude: number | null; accuracy_m: number | null; distance_from_site_m: number | null };
  depth_reached_cm: number | null; photos: EvidenceBrief[]; layers: ProvLayer[]; custody: ProvCustody[];
}
export interface ProvSite { id: string; code: string | null; latitude: number | null; longitude: number | null; samples: ProvSample[] }
export interface ProvStratum {
  id: string; code: string; name: string; role: string; control_for_code: string | null; version: number; area_ha: number;
  field_ids: string[]; result: Record<string, unknown>; sites: ProvSite[];
}
export interface Provenance {
  run: RunSummary & { rule_pack_id: string };
  rules: { key: string; label: string; value: unknown; source: unknown }[];
  terms: { term: string; id: string; version: number; value_t_co2e: number; variance: number; df: number | null; source: string }[];
  term_results: TermResult[];
  strata: ProvStratum[];
}

/* ------------------------------------------------------------------ copy */
export const TERM_LABELS: Record<string, string> = {
  baseline_scenario: 'Baseline-scenario change',
  baseline_emissions: 'Baseline emissions',
  project_emissions: 'Project emissions',
  leakage: 'Leakage',
  soc_project_modelled: 'Project SOC change (modelled, QA1)',
  ch4_soil: 'Soil CH₄ reduction (modelled, QA1)',
  n2o_soil: 'Soil N₂O reduction (modelled, QA1)',
  leakage_biomass_residues: 'Leakage: biomass residues (LE_BR)',
  leakage_displacement: 'Leakage: displacement (LK_disp)',
  woody_biomass_project: 'Trees & shrubs, project',
  woody_biomass_baseline: 'Trees & shrubs, baseline',
};

/** Terms a person may record by hand; the others are published by the QA1, woody-biomass and leakage screens. */
export const MANUAL_TERMS = ['baseline_scenario', 'baseline_emissions', 'project_emissions', 'leakage'];

export const TERM_HELP: Record<string, string> = {
  baseline_scenario: 'Soil-carbon change that would have happened anyway without the project. Subtracted.',
  baseline_emissions: 'Emissions (fertiliser N₂O, fuel, burning) that the old practice would have caused. Added back.',
  project_emissions: 'Emissions the new practice causes, such as extra machinery passes. Subtracted.',
  leakage: 'Emissions pushed outside the project area, for example displaced grazing. Subtracted.',
  soc_project_modelled: 'Project soil-carbon change from an approved biogeochemical model run (QA1, Eq. 47). Published from the Process model (QA1) screen.',
  ch4_soil: 'Modelled reduction in soil methane (Eq. 10, 54). Published from the Process model (QA1) screen.',
  n2o_soil: 'Modelled reduction in soil nitrous oxide (Eq. 15, 58). Published from the Process model (QA1) screen.',
  leakage_biomass_residues: 'Residues that used to be burnt for energy and are now kept on the field (§8.4.4, CDM TOOL16). Subtracted.',
  leakage_displacement: 'Livestock or production moved elsewhere because of the project (Eq. 34–36, VMD0054). Subtracted.',
  woody_biomass_project: 'Tree and shrub carbon change in the project scenario (Eq. 49/51). Added through Eq. 45.',
  woody_biomass_baseline: 'Tree and shrub carbon change in the baseline scenario (Eq. 48/50). Added through Eq. 44.',
};

export const TERM_STATUS: Record<string, string> = {
  supplied: 'Approved estimate used',
  not_required_by_rules: 'Not required by the rules',
  measured_at_control_sites: 'Measured at control sites',
};

export function termLabel(t: string): string {
  return TERM_LABELS[t] ?? t.replace(/_/g, ' ');
}

export function ruleValue(v: unknown): string {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (Array.isArray(v)) return v.map(x => String(x).replace(/_/g, ' ')).join(', ');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v).replace(/_/g, ' ');
}

export function ruleSource(v: unknown): string {
  if (v === null || v === undefined || v === '') return '—';
  if (typeof v === 'string') return v;
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>;
    const parts = [o['document'] ?? o['source_document'], o['section'] ?? o['source_section'],
      o['page'] ?? o['source_page'] ? `p. ${o['page'] ?? o['source_page']}` : null].filter(Boolean);
    return parts.length ? parts.join(' · ') : JSON.stringify(v);
  }
  return String(v);
}

/** Save a blob as a download. */
export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Open a blob in a new tab (images, PDFs). */
export function openBlob(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

/* ------------------------------------------------------------------ people directory */
/** Resolves user ids to names (the run list only carries ids). */
@Injectable({ providedIn: 'root' })
export class People {
  private api = inject(ApiService);
  private loaded = false;
  readonly names = signal<Record<string, string>>({});

  load(): void {
    if (this.loaded) return;
    this.loaded = true;
    this.api.get<{ id: string; full_name: string }[]>('/users').subscribe({
      next: list => this.names.set(Object.fromEntries(list.map(u => [u.id, u.full_name]))),
      error: () => (this.loaded = false),
    });
  }

  name(id: string | null | undefined, fallback = '—'): string {
    if (!id) return fallback;
    return this.names()[id] ?? fallback;
  }
}
