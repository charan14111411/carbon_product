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
  data_class: string;
}

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

export interface AnalyteDef { key: string; label: string; unit: string; min: number; max: number; methods: string[] }

/** Mirrors RANGES / UNITS in the lab service, so the form can warn before the server refuses. */
export const ANALYTES: AnalyteDef[] = [
  { key: 'soc_pct', label: 'Soil organic carbon', unit: '%', min: 0, max: 60, methods: ['dry_combustion', 'walkley_black', 'mir_spectroscopy'] },
  { key: 'bulk_density_g_cm3', label: 'Bulk density', unit: 'g/cm3', min: 0.1, max: 2.65, methods: ['core_ring', 'clod', 'excavation', 'mir_spectroscopy'] },
  { key: 'coarse_fraction', label: 'Coarse fraction', unit: 'fraction', min: 0, max: 0.95, methods: ['gravimetric', 'sieving', 'mir_spectroscopy'] },
  { key: 'ph', label: 'pH', unit: 'pH', min: 0, max: 14, methods: ['ph_water_1_2_5', 'ph_cacl2', 'mir_spectroscopy'] },
  { key: 'texture_clay_pct', label: 'Clay content', unit: '%', min: 0, max: 100, methods: ['hydrometer', 'pipette', 'laser_diffraction', 'mir_spectroscopy'] },
];

export const analyteLabel = (k: string) => ANALYTES.find(a => a.key === k)?.label ?? k;

export const MIR = 'mir_spectroscopy';

export const CSV_TEMPLATE = [
  'bag_code,analyte,value,unit,method,analysed_on,uncertainty',
  'ST-Z1-001-BL-D1,soc_pct,1.42,%,dry_combustion,2026-09-18,0.05',
  'ST-Z1-001-BL-D1,bulk_density_g_cm3,1.31,g/cm3,core_ring,2026-09-18,',
  'ST-Z1-001-BL-D2,soc_pct,0.98,%,dry_combustion,2026-09-18,0.04',
].join('\n');
