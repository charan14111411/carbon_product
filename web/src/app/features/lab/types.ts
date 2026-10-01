/** Shapes returned by the lab API (api/app/modules/lab/service.py). */

export interface Lab {
  id: string;
  code: string;
  name: string;
  accreditation: string | null;
  accreditation_valid_until: string | null;
  accreditation_current: boolean;
  city: string;
  contact_email: string | null;
  iso17025: boolean | null;
  proficiency_program: Proficiency | null;
  analytical_error_report_id: string | null;
  /** What the lab has not yet shown under VM0042 §8.2.1.4: iso17025 | proficiency_program | analytical_error_report. */
  qc_evidence_missing: string[];
}

export type Proficiency = 'NAPT' | 'GLOSOLAN' | 'other' | 'none';
export const PROFICIENCY: { key: Proficiency; label: string }[] = [
  { key: 'NAPT', label: 'NAPT (North American Proficiency Testing)' },
  { key: 'GLOSOLAN', label: 'GLOSOLAN (FAO Global Soil Laboratory Network)' },
  { key: 'other', label: 'Another round-robin programme' },
  { key: 'none', label: 'None' },
];
export const QC_GAP_LABEL: Record<string, string> = {
  iso17025: 'ISO/IEC 17025 accreditation',
  proficiency_program: 'Proficiency (round-robin) programme',
  analytical_error_report: 'Analytical error report',
};

export interface LabChange {
  id: string;
  project_id: string;
  from_lab_id: string;
  from_lab_code: string | null;
  to_lab_id: string;
  to_lab_code: string | null;
  justification: string;
  sop_consistency_statement: string;
  evidence_ids: string[];
  effective_from: string | null;
  recorded_by: string | null;
  recorded_at: string | null;
  reference: string;
}

export interface SpectroscopyCheck {
  campaign_id: string;
  campaign_code: string;
  n_spectroscopy_samples: number;
  n_dry_combustion_checked: number;
  checked_pct: number | null;
  required_min_pct: number | null;
  required_max_pct: number | null;
  recommended_range_pct: [number, number];
  status: 'ok' | 'too_few' | 'not_applicable' | 'rule_not_configured';
  model_error: { tvd: number; s2_model: number | null; mean_error: number | null; rmse: number | null; reason?: string };
  pairs: { layer_id: string; bag_code: string; predicted: number; method: string; dry_combustion: number; error: number }[];
  equation: string;
  reference: string;
  data_class: string;
}

export interface Batch {
  id: string;
  code: string;
  lab_id: string;
  lab_name: string | null;
  campaign_id: string;
  campaign_code: string | null;
  status: string;
  dispatched_on: string | null;
  bag_count: number;
  manifest?: {
    layer_id: string; bag_code: string; label_qr: string; depth_from_cm: number; depth_to_cm: number;
    sample_code: string; site_code: string; collected_at: string;
  }[];
}

export interface LabResult {
  id: string;
  layer_id: string;
  bag_code: string | null;
  label_qr: string | null;
  lab_id: string;
  analyte: string;
  value: number;
  unit: string;
  method: string;
  analysed_on: string;
  uncertainty: number | null;
  certificate_id: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'voided';
  version: number;
  supersedes_id: string | null;
  calibration_id: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_note: string;
  entered_by: string | null;
  detection_limit: number | null;
  below_detection_limit: boolean;
  method_justification: string | null;
  method_recommended: boolean;
  purpose: Purpose;
  data_class: string;
}

export type Purpose = 'primary' | 'spectroscopy_check';
export const PURPOSES: { key: Purpose; label: string; hint: string }[] = [
  { key: 'primary', label: 'Primary result', hint: 'The value used for this bag in the carbon calculation.' },
  { key: 'spectroscopy_check', label: 'Spectroscopy check', hint: 'A dry-combustion SOC re-run of a bag that was measured by spectroscopy (Eq. 73).' },
];

export interface ResultPage { items: LabResult[]; total: number; page: number; page_size: number }

export interface Calibration {
  id: string;
  code: string;
  analyte: string;
  reference_method: string;
  n_samples: number;
  rmse: number;
  r2: number;
  bias: number;
  valid_range: { min?: number; max?: number };
  status: 'draft' | 'approved' | 'retired';
  notes: string;
  rpiq: number | null;
  lin_ccc: number | null;
  split_method: string | null;
  n_peer_reviewed_refs: number | null;
  spectral_range: string | null;
  instrument: string | null;
  /** Appendix 4 details still missing before approval (draft only). */
  approval_gaps: string[];
  created_by: string | null;
  approved_by: string | null;
}

export interface ImportRow {
  row: number;
  status: 'created' | 'error';
  message: string;
  code?: string;
  result_id?: string;
  bag_code: string | null;
  analyte: string | null;
}

export interface ImportReport { file_id: string; sha256: string; rows: ImportRow[]; created: number; errors: number }

export interface LabProgress {
  campaign_id: string;
  layers_total: number;
  analytes: Record<string, { accepted: number; pending: number; missing: number }>;
  matrix: ({ layer_id: string; bag_code: string } & Record<string, string>)[];
}

export interface AnalyteDef { key: string; label: string; unit: string; units: string[]; min: number; max: number; methods: string[] }

const SPECTRO_LIST = ['mir_spectroscopy', 'nir_spectroscopy', 'vis_nir_spectroscopy', 'libs', 'ins'];

/** Mirrors RANGES / UNITS in the lab service, so the form can warn before the server refuses. */
export const ANALYTES: AnalyteDef[] = [
  { key: 'soc_pct', label: 'Soil organic carbon', unit: '%', units: ['%', 'pct', 'percent', '% w/w'], min: 0, max: 60,
    methods: ['dry_combustion', ...SPECTRO_LIST, 'walkley_black', 'loss_on_ignition'] },
  { key: 'bulk_density_g_cm3', label: 'Bulk density', unit: 'g/cm3', units: ['g/cm3', 'g/cm³', 'g cm-3', 'g/cc', 'mg/m3', 't/m3'], min: 0.1, max: 2.65,
    methods: ['core_ring', 'clod', 'excavation', 'mir_spectroscopy'] },
  { key: 'coarse_fraction', label: 'Coarse fraction', unit: 'fraction', units: ['fraction', 'g/g', 'ratio', '0-1'], min: 0, max: 0.95,
    methods: ['gravimetric', 'sieving', 'mir_spectroscopy'] },
  { key: 'fine_soil_mass_g', label: 'Fine soil mass', unit: 'g', units: ['g', 'grams', 'gram'], min: 0, max: 100000, methods: ['gravimetric', 'sieving'] },
  { key: 'ph', label: 'pH', unit: 'pH', units: ['ph', '', 'unitless', '-'], min: 0, max: 14, methods: ['ph_water_1_2_5', 'ph_cacl2', 'mir_spectroscopy'] },
  { key: 'texture_clay_pct', label: 'Clay content', unit: '%', units: ['%', 'pct', 'percent'], min: 0, max: 100,
    methods: ['hydrometer', 'pipette', 'laser_diffraction', 'mir_spectroscopy'] },
  { key: 'texture_sand_pct', label: 'Sand content', unit: '%', units: ['%', 'pct', 'percent'], min: 0, max: 100,
    methods: ['hydrometer', 'pipette', 'laser_diffraction', 'mir_spectroscopy'] },
  { key: 'inorganic_c_pct', label: 'Inorganic carbon', unit: '%', units: ['%', 'pct', 'percent', '% w/w'], min: 0, max: 20,
    methods: ['calcimeter', 'acid_neutralisation', 'dry_combustion'] },
];

/** Proximal sensing methods (VM0042 Appendix 4): results are MODELLED and need an approved calibration. */
export const SPECTRO_METHODS = new Set([...SPECTRO_LIST, 'nir', 'vis_nir']);
/** VM0042 §8.2.1.4: not recommended; only where no other method is available. */
export const NOT_RECOMMENDED_METHODS = new Set(['walkley_black', 'loss_on_ignition', 'loi']);
export const NOT_RECOMMENDED_NOTE = 'Not recommended by VM0042 §8.2.1.4; only where no other method is available.';
export const DRY_COMBUSTION = 'dry_combustion';
export const MIN_PEER_REVIEWED_REFS = 3;

export const analyteLabel = (k: string) => ANALYTES.find(a => a.key === k)?.label ?? k;

export const MIR = 'mir_spectroscopy';

export const CSV_TEMPLATE = [
  'bag_code,analyte,value,unit,method,analysed_on,uncertainty,detection_limit,method_justification,purpose',
  'ST-Z1-001-BL-D1,soc_pct,1.42,%,dry_combustion,2026-09-18,0.05,0.02,,primary',
  'ST-Z1-001-BL-D1,bulk_density_g_cm3,1.31,g/cm3,core_ring,2026-09-18,,,,primary',
  'ST-Z1-001-BL-D2,soc_pct,0.98,%,dry_combustion,2026-09-18,0.04,0.02,,primary',
].join('\n');
