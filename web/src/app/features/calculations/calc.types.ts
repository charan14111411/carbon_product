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
}

export interface TermResult { term: string; value_t_co2e: number; variance: number; df: number | null; source: string; status: string }

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
};

export const TERM_HELP: Record<string, string> = {
  baseline_scenario: 'Soil-carbon change that would have happened anyway without the project. Subtracted.',
  baseline_emissions: 'Emissions (fertiliser N₂O, fuel, burning) that the old practice would have caused. Added back.',
  project_emissions: 'Emissions the new practice causes, such as extra machinery passes. Subtracted.',
  leakage: 'Emissions pushed outside the project area, for example displaced grazing. Subtracted.',
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
