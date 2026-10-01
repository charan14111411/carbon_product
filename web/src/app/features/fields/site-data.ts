/**
 * VM0042 v2.2 site characteristics, land tenure and eligibility shapes and lists.
 *
 * The allowed values mirror the API validators — keep them in step with:
 *   api/app/modules/land/domain.py  (TEXTURE_CLASSES, WRB_SOIL_GROUPS, IPCC_CLIMATE_ZONES, SLOPE_CLASSES,
 *                                    LAND_COVERS, TENURE_KINDS, check codes)
 *   api/app/modules/land/schemas.py (SiteAttributes ranges, LandCover, TenureKind, TenureIn, TenureVerifyIn)
 * The API has no endpoint that lists these, so they are mirrored here.
 */

/** Same rule as land/domain.py `normalise_code`. */
export function normCode(v: string | null | undefined): string {
  return (v ?? '').trim().toLowerCase().replace(/-/g, ' ').split(/\s+/).filter(Boolean).join('_');
}

export const TEXTURE_CLASSES = [
  'sand', 'loamy_sand', 'sandy_loam', 'loam', 'silt_loam', 'silt', 'sandy_clay_loam', 'clay_loam',
  'silty_clay_loam', 'sandy_clay', 'silty_clay', 'clay',
] as const;

export const WRB_SOIL_GROUPS = [
  'Histosols', 'Anthrosols', 'Technosols', 'Cryosols', 'Leptosols', 'Solonetz', 'Vertisols', 'Solonchaks',
  'Gleysols', 'Andosols', 'Podzols', 'Plinthosols', 'Nitisols', 'Ferralsols', 'Planosols', 'Stagnosols',
  'Chernozems', 'Kastanozems', 'Phaeozems', 'Umbrisols', 'Durisols', 'Gypsisols', 'Calcisols', 'Retisols',
  'Acrisols', 'Lixisols', 'Alisols', 'Luvisols', 'Cambisols', 'Arenosols', 'Fluvisols', 'Regosols',
] as const;

export const IPCC_CLIMATE_ZONES = [
  'tropical_montane', 'tropical_wet', 'tropical_moist', 'tropical_dry', 'warm_temperate_moist',
  'warm_temperate_dry', 'cool_temperate_moist', 'cool_temperate_dry', 'boreal_moist', 'boreal_dry',
  'polar_moist', 'polar_dry',
] as const;

/** Appendix 5 Table 10, as land/domain.py SLOPE_CLASSES (upper bound inclusive). */
export const SLOPE_CLASSES: { code: string; label: string; upper: number }[] = [
  { code: 'nearly_level', label: 'Nearly level (0–3 %)', upper: 3 },
  { code: 'gently_sloping', label: 'Gently sloping / undulating (4–8 %)', upper: 8 },
  { code: 'strongly_sloping', label: 'Strongly sloping / rolling (9–16 %)', upper: 16 },
  { code: 'moderately_steep', label: 'Moderately steep / hilly (17–30 %)', upper: 30 },
  { code: 'steep', label: 'Steep (31–45 %)', upper: 45 },
  { code: 'very_steep', label: 'Very steep (> 45 %)', upper: Infinity },
];
/** Table 7: aspect must be within 30° only when the slope class is hilly or steeper. */
export const ASPECT_RELEVANT = new Set(['moderately_steep', 'steep', 'very_steep']);

export function slopeClassOf(pct: number | null | undefined): string | null {
  if (pct === null || pct === undefined || Number.isNaN(pct)) return null;
  return SLOPE_CLASSES.find(c => pct <= c.upper)?.code ?? 'very_steep';
}
export function slopeClassLabel(code: string | null | undefined): string {
  return SLOPE_CLASSES.find(c => c.code === code)?.label ?? '—';
}

export const LAND_COVERS = ['cropland', 'grassland', 'wetland', 'other'] as const;
export const TENURE_KINDS = ['owned', 'leased', 'shared', 'community', 'other'] as const;
export const TENURE_KIND_HINT: Record<string, string> = {
  owned: 'Title deed, RTC / land record in the farmer’s name',
  leased: 'Registered or notarised lease for the period',
  shared: 'Sharecropping or joint cultivation agreement',
  community: 'Community or customary rights recognised locally',
  other: 'Describe the arrangement in the notes',
};

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
export function compass(deg: number | null | undefined): string {
  if (deg === null || deg === undefined) return '';
  return COMPASS[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
}

// ------------------------------------------------------------------ API shapes
export interface SiteFields {
  slope_pct: number | null;
  aspect_deg: number | null;
  soil_texture_class: string | null;
  wrb_soil_group: string | null;
  ecoregion: string | null;
  climate_zone: string | null;
  mean_annual_precip_mm: number | null;
  land_cover: string;
  slope_class: string | null;
}

export interface TerrainApplied { written: boolean; before: number | null; after: number | null; computed: number | null }

/** GET /fields/{id}/terrain item (supporting/site_context.py terrain_out). */
export interface TerrainSummary {
  id: string;
  field_id: string;
  provider: string;
  source_ref: string;
  cell_size_m: number;
  n_cells: number;
  elevation_mean_m: number | null;
  slope_mean_pct: number | null;
  aspect_deg: number | null;
  dominant_slope_class: string;
  dominant_slope_class_label: string;
  aspect_relevant: boolean;
  histogram: Record<string, { label: string; cells: number; share: number }>;
  stats: Record<string, unknown>;
  applied: Record<'slope_pct' | 'aspect_deg' | 'elevation_m', TerrainApplied>;
  created_at: string;
  data_class: string;
  method: string;
}

/** GET /fields/{id}/soil-properties item (supporting/site_context.py suggestion_out). */
export interface SoilSuggestion {
  id: string;
  field_id: string;
  provider: string;
  source_ref: string;
  properties: Record<string, number>;
  soil_texture_class: string | null;
  wrb_soil_group: string | null;
  wrb_probability: number | null;
  created_at: string;
  data_class: string;
  note: string;
  current?: { soil_texture_class: string | null; wrb_soil_group: string | null };
}

export interface SoilConflict { column: string; current: string; suggested: string }

export interface Tenure {
  id: string;
  field_id: string;
  holder_farmer_id: string;
  kind: string;
  document_evidence_ids: string[];
  valid_from: string;
  valid_to: string | null;
  notes: string;
  status: 'pending' | 'verified' | 'rejected' | string;
  verified_by: string | null;
  verified_at: string | null;
  review_note: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  data_class: string;
}

export interface EligibilityCheck {
  code: string;
  passed: boolean;
  message: string;
  details?: Record<string, unknown>;
  severity?: 'blocking' | 'warning' | string;
}

export interface Enrolment {
  id: string;
  project_id: string;
  field_id: string;
  field_code: string;
  status: string;
  eligibility: { checks?: EligibilityCheck[]; decided_at?: string; withdrawal?: { reason: string; on: string } };
  enrolled_on: string | null;
  withdrawn_on: string | null;
  updated_at: string;
}

export interface UserLite { id: string; full_name: string; role?: string }

/** Plain-English titles and VM0042 references for the eligibility checks in land/service.py. */
export const CHECK_INFO: Record<string, { title: string; ref?: string }> = {
  inside_programme_boundary: { title: 'Inside the programme area' },
  crop_eligible: { title: 'Crop accepted by the programme' },
  land_use_history: { title: 'Land-use history complete' },
  no_native_clearing: { title: 'No native ecosystem cleared in 10 years', ref: '§4 cond. 5' },
  land_cover: { title: 'Cropland or grassland at the start', ref: '§4 cond. 3' },
  not_wetland: { title: 'Not a wetland', ref: '§4 cond. 8' },
  lookback_activity_records: { title: 'Baseline look-back records (3 years)', ref: '§6' },
  land_tenure: { title: 'Verified land tenure for the crediting period' },
  not_double_enrolled: { title: 'Not enrolled in another project' },
  farmer_consent: { title: 'Farmer consent on file' },
};

export function checkState(c: EligibilityCheck): 'pass' | 'fail' | 'warn' {
  if (!c.passed) return 'fail';
  if (c.severity === 'warning' && ((c.details?.['missing_years'] as unknown[] | undefined)?.length ?? 0) > 0) return 'warn';
  return 'pass';
}
