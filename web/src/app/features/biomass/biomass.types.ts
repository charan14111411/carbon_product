/* Woody biomass (VM0042 v2.2 Eq. 48–51 via CDM AR-TOOL14): shapes returned by api/app/modules/biomass. */

export interface AllometryForm { key: string; label: string; params: string[]; needs_height: boolean }
export interface AllometryForms { forms: AllometryForm[]; output_units: string[] }

export interface Allometry {
  id: string; project_id: string; species: string; form: string; form_label: string | null; params: Record<string, number>;
  output_unit: 'kg' | 't'; dbh_min_cm: number; dbh_max_cm: number; root_shoot_ratio: number | null; source: string;
  evidence_ids: string[]; status: 'draft' | 'approved' | 'retired'; created_by: string | null; approved_by: string | null;
  approved_at: string | null; created_at: string;
}

export interface Plot {
  id: string; project_id: string; stratum_id: string; field_id: string | null; code: string; scenario: 'project' | 'baseline';
  area_m2: number; latitude: number | null; longitude: number | null; status: string; created_at: string;
}

export interface BCampaign { id: string; project_id: string; code: string; measured_on: string; note: string; created_at: string }

export interface Tree { species: string; dbh_cm: number; height_m: number | null; count: number }
export interface Shrub { crown_cover_fraction?: number | null; agb_t_dm_ha?: number | null }

export interface Measurement {
  id: string; record_id: string; version: number; status: 'active' | 'voided'; project_id: string; campaign_id: string; plot_id: string;
  trees: Tree[]; shrub: Shrub | null; harvested: boolean; evidence_ids: string[]; note: string; created_by: string | null;
  created_at: string; data_class: string;
}

export interface StratumLite { id: string; code: string; name: string; role: string; quantification_unit: string; field_ids: string[]; field_codes: (string | null)[] | null; area_ha: number; is_current: boolean }

export interface TreeRow { species: string; dbh_cm: number; height_m: number | null; count: number; model_id: string; agb_t_dm_per_tree: number; biomass_t_dm_per_tree: number; c_t_co2e: number }
export interface PlotResult {
  plot_id: string; plot_code: string; tree_t_co2e_ha_start: number; tree_t_co2e_ha_end: number; shrub_t_co2e_ha_start: number;
  shrub_t_co2e_ha_end: number; trees_end: TreeRow[];
}
export interface StratumResult {
  stratum_id: string; stratum_code: string; quantification_unit: string; area_ha: number; n_plots: number;
  tree_t_co2e_ha_start: number; tree_t_co2e_ha_end: number; shrub_t_co2e_ha_start: number; shrub_t_co2e_ha_end: number;
  tree_change_t_co2e_ha: number; shrub_change_t_co2e_ha: number; tree_annual_t_co2e: number; shrub_annual_t_co2e: number;
  variance_annual: number; df: number; plots: PlotResult[];
}
export interface WoodyResult {
  term: string; project_id: string; period_label: string; period_start: string; period_end: string;
  from_campaign: BCampaign; to_campaign: BCampaign; rule_pack: { id: string; revision: number }; rules_used: Record<string, unknown>;
  allometric_model_ids: string[]; measurement_record_ids: string[]; scenario: string; interval_years: number; equations: string[];
  tree_annual_t_co2e: number; shrub_annual_t_co2e: number; annual_t_co2e: number; variance_annual: number; df: number | null;
  tree_variance_annual: number; tree_df: number | null; shrub_variance_annual: number; shrub_df: number | null;
  strata: StratumResult[]; unpaired_plots: string[]; belowground_included: boolean; shrubs_included: boolean;
  period_years: number; credited_years: number; value_t_co2e: number; variance: number; data_class: string;
  sign_convention: string; method_notes: string[];
}

export const PARAM_LABEL: Record<string, string> = { a: 'a', b: 'b', c: 'c', wood_density: 'Wood density ρ (t/m³)', bef: 'Biomass expansion factor (BEF)' };
