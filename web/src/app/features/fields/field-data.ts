/** Shapes and small lookups shared by the land screens (fields, practices, catalogue). */

export interface AttrDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'choice';
  required: boolean;
  choices: string[];
  unit?: string | null;
  min?: number | null;
  max?: number | null;
}

export interface Crop {
  id: string;
  code: string;
  name: string;
  local_name: string | null;
  category: string;
  attributes: AttrDef[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PracticeType {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  crop_codes: string[];
  unit: string | null;
  requires_quantity: boolean;
  required_evidence: string[];
  fields: AttrDef[];
  emission_factor_keys: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FieldRec {
  id: string;
  farm_id: string;
  code: string;
  name: string;
  boundary: GeoJSON.Geometry;
  area_ha: number;
  centroid_lat: number;
  centroid_lon: number;
  crop_code: string | null;
  crop_attributes: Record<string, unknown>;
  soil_type: string | null;
  elevation_m: number | null;
  version: number;
  status: string;
  created_at: string;
  updated_at: string;
  data_class: string;
}

export interface FieldFeatureProps {
  id: string;
  code: string;
  name: string;
  area_ha: number;
  crop_code: string | null;
  status: string;
  farm_id: string;
  farmer_id: string | null;
  enrolment_status: string | null;
}

export interface Farm {
  id: string;
  farmer_id: string;
  name: string;
  village: string;
  district: string;
  state: string;
  external_farm_id: string | null;
}

export interface FarmerLite {
  id: string;
  code: string;
  full_name: string;
  village: string;
  district: string;
}

export interface Practice {
  id: string;
  record_id: string;
  version: number;
  field_id: string;
  practice_code: string;
  scenario: 'baseline' | 'project';
  performed_on: string;
  ended_on: string | null;
  quantity: number | null;
  unit: string | null;
  area_ha: number | null;
  details: Record<string, unknown>;
  evidence_ids: string[];
  source: string;
  status: string;
  reason: string;
  created_by: string | null;
  created_at: string;
  missing_evidence: boolean;
  data_class: string;
}

/** Distinct, calm colours for crops on maps (tokens can't be read by MapLibre, so hex here). */
export const CROP_COLORS = [
  '#2f7249', '#c76329', '#1f5f99', '#9a6200', '#5b47a8', '#0e7280', '#8f3f17', '#4f9168',
  '#2a4d8f', '#b3261e', '#86b797', '#e7a57b',
];
export const NO_CROP_COLOR = '#737c76';

export function cropColorMap(codes: (string | null | undefined)[]): Map<string, string> {
  const uniq = [...new Set(codes.filter((c): c is string => !!c))].sort();
  return new Map(uniq.map((c, i) => [c, CROP_COLORS[i % CROP_COLORS.length]]));
}

export const CROP_CATEGORIES = ['field', 'horticulture', 'plantation', 'agroforestry', 'rice'] as const;
export const PRACTICE_CATEGORIES = ['soil', 'nutrient', 'water', 'residue', 'tillage', 'trees', 'livestock', 'energy'] as const;

export const CATEGORY_TONE: Record<string, string> = {
  field: 'amber', horticulture: 'teal', plantation: 'forest', agroforestry: 'forest', rice: 'sky',
  soil: 'clay', nutrient: 'forest', water: 'sky', residue: 'amber', tillage: 'clay', trees: 'forest',
  livestock: 'violet', energy: 'teal',
};

export const SOURCE_LABEL: Record<string, string> = {
  field_app: 'Field app', farmer_app: 'Farmer app', whatsapp: 'WhatsApp', import: 'Import', partner: 'Partner',
};

export const LAND_USES = ['cropland', 'grassland', 'forest', 'wetland', 'settlement', 'other'] as const;
export const LAND_USE_COLOR: Record<string, string> = {
  cropland: 'var(--amber-600)', grassland: 'var(--forest-400)', forest: 'var(--forest-700)',
  wetland: 'var(--sky-600)', settlement: 'var(--stone-500)', other: 'var(--violet-600)',
};

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/** Upload one evidence file and return its id. */
export function evidenceForm(file: File, kind: string, entityType?: string, entityId?: string): FormData {
  const f = new FormData();
  f.append('file', file);
  f.append('kind', kind);
  if (entityType) f.append('entity_type', entityType);
  if (entityId) f.append('entity_id', entityId);
  return f;
}
