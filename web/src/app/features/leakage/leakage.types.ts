/* Leakage records: biomass residues diverted (VM0042 §8.4.4, CDM TOOL16) and displacement / production declines
   (§8.4.2–8.4.3, VMD0054, Eq. 34–36). Shapes returned by api/app/modules/leakage. */

export interface Residue {
  id: string; record_id: string; version: number; status: 'active' | 'voided'; project_id: string; period_label: string;
  residue_type: string; baseline_energy_use: string; quantity_t_dry: number; ncv_gj_per_t_dry: number | null;
  ef_co2_t_per_gj: number | null; factor_source: string; leakage_ruled_out: boolean; ruled_out_reason: string;
  evidence_ids: string[]; note: string; created_by: string | null; created_at: string; data_class: string;
}

export interface ResidueResult {
  term: string; period_label: string; le_br_t_co2e: number; value_t_co2e: number; variance: number; df: null;
  items: { record_id: string; residue_type: string; quantity_t_dry: number; ncv_gj_per_t_dry?: number; ef_co2_t_per_gj?: number; leakage_ruled_out: boolean; energy_gj: number | null; le_br_t_co2e: number }[];
  records: Residue[]; sign_convention: string; method_notes: string[]; data_class: string;
}

export interface Commodity { commodity: string; unit: string; baseline_production: number; project_production: number; lm?: number | null; inl_ha?: number | null }
export interface Livestock { livestock_type: string; baseline_head: number; project_head: number }

export interface Displacement {
  id: string; record_id: string; version: number; status: 'active' | 'voided'; project_id: string; year: number;
  mode: 'vmd0054' | 'no_decrease'; commodities: Commodity[]; livestock: Livestock[]; ef_t_co2e_per_ha: number | null; ef_source: string;
  statement: string; evidence_ids: string[]; note: string; created_by: string | null; created_at: string; data_class: string;
}

export interface YearResult {
  year: number; mode: string; record_id: string; eq: string; al_ha: number; ef_t_co2e_per_ha?: number | null; leakage_t_co2e: number;
  commodities: (Commodity & { fp?: number; l?: number })[]; livestock: (Livestock & { decline: boolean })[]; warnings?: string[];
}

export interface DisplacementResult {
  term: string; period_label: string; period_start: string; period_end: string; project_start: string;
  years: YearResult[]; lk_t_t_co2e: number; lk_prior_t_co2e: number; verification_years: number; lk_disp_annual_t_co2e: number;
  value_t_co2e: number; warnings: string[]; all_no_decrease: boolean; variance: number; df: null; records: Displacement[];
  sign_convention: string; method_notes: string[]; data_class: string;
}
