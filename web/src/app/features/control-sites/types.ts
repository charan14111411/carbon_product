/* Baseline control sites for QA2 (VM0042 v2.2 §8.2 p.25–27, Table 7, Appendix 5 Table 10). */

export type CritStatus = 'pass' | 'fail' | 'pending' | 'not_applicable';

export interface ControlLink {
  id: string;
  project_id: string;
  control_stratum_id: string;
  project_stratum_id: string | null;
  qu_code: string | null;
  managed_by: string;
  management_plan_evidence_id: string | null;
  fixed_lat: number;
  fixed_lon: number;
  status: 'active' | 'retired';
  notes: string;
  crop_group_justification?: string;
  created_by: string | null;
  created_at: string;
}

export interface Criterion {
  code: string;
  status: CritStatus;
  message: string;
  details: Record<string, unknown>;
}

export interface LinkAssessment {
  link_id: string;
  overall: 'pass' | 'fail' | 'pending';
  criteria: Criterion[];
  control_stratum?: string;
  targets?: string[];
  qu_code?: string | null;
  control_fields?: string[];
  quantification_unit_fields?: string[];
}

export interface Assessment {
  run_id: string;
  project_id: string;
  assessed_at: string;
  assessed_by: string | null;
  overall: 'pass' | 'fail' | 'pending';
  project_checks: Criterion[];
  links: LinkAssessment[];
  data_class: string;
}

export interface ControlRules {
  max_distance_km: number;
  max_aspect_diff_deg: number;
  soc_confidence: number;
  max_precip_diff_mm: number;
  alm_years: number;
  min_control_sites: number;
  reference: string;
}

export interface Stratum {
  id: string;
  code: string;
  name: string;
  role: 'project' | 'control';
  quantification_unit: string;
  control_for_code: string | null;
  field_ids: string[];
  field_codes: (string | null)[] | null;
  area_ha: number;
  is_current: boolean;
}

export interface UserLite { id: string; full_name: string }

/** Matrix rows: Table 7 criteria in the order the methodology lists them, then the §8.2 site conditions. */
export interface CritRow { code: string; label: string; hint: string; ref: string; group: 'table7' | 'site' }

export function critRows(r: ControlRules | null): CritRow[] {
  const km = r?.max_distance_km ?? 250, deg = r?.max_aspect_diff_deg ?? 30, mm = r?.max_precip_diff_mm ?? 100;
  const conf = Math.round((r?.soc_confidence ?? 0.9) * 100), yrs = r?.alm_years ?? 5;
  return [
    { code: 'slope_class', label: 'Slope class', hint: 'Same most-frequent slope class (Appendix 5 Table 10).', ref: 'Table 7 · App. 5 Table 10', group: 'table7' },
    { code: 'aspect', label: 'Aspect', hint: `On hilly, steep or very steep land the mean aspect must be within ${deg}°.`, ref: 'Table 7', group: 'table7' },
    { code: 'soil_texture', label: 'Soil texture', hint: 'Same FAO textural class in the top 30 cm.', ref: 'Table 7', group: 'table7' },
    { code: 'wrb_soil_group', label: 'WRB soil group', hint: 'Same WRB reference soil group.', ref: 'Table 7', group: 'table7' },
    { code: 'soc_mean', label: `SOC mean (${conf} % CI)`, hint: `Mean SOC % (0–30 cm) not significantly different at ${conf} % confidence (Welch t-test).`, ref: 'Table 7', group: 'table7' },
    { code: 'historical_alm', label: `Historical ALM (${yrs} yrs)`, hint: `Tillage, residue removal, crop functional group, manure, compost and irrigation the same for the ${yrs} years before the start.`, ref: 'Table 7', group: 'table7' },
    { code: 'historical_land_cover', label: 'Historical land cover', hint: 'If converted in the 50 years before the start, converted from the same major land cover within ±10 years.', ref: 'Table 7', group: 'table7' },
    { code: 'ecoregion', label: 'Ecoregion', hint: 'Same WWF terrestrial ecoregion.', ref: 'Table 7', group: 'table7' },
    { code: 'climate_zone', label: 'Climate zone', hint: 'Same IPCC climate zone.', ref: 'Table 7', group: 'table7' },
    { code: 'precipitation', label: `Precipitation ±${mm} mm`, hint: `Mean annual precipitation within ±${mm} mm (station ≤ 50 km or synthetic station).`, ref: 'Table 7 note c', group: 'table7' },
    { code: 'distance', label: `Distance ≤ ${km} km`, hint: `The control site must be within ${km} km of the quantification unit.`, ref: '§8.2 p.25', group: 'table7' },
    { code: 'location_fixed', label: 'Location fixed', hint: 'The control site stays where it was when linked, for the whole project.', ref: '§8.2 p.26', group: 'site' },
    { code: 'management_plan', label: 'Management plan', hint: 'Managed per the baseline schedule of activities, with a written plan.', ref: '§8.2 p.26', group: 'site' },
  ];
}
