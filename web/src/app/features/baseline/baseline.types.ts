/* API shapes for VM0042 v2.2 activity data (§6 Table 4, Box 1) — api/app/modules/baseline. */

export interface SchemaFlag { key: string; label: string; required: boolean; requires_when_yes: string[][] }
export interface SchemaValue { key: string; unit: string; kind: 'number' | 'date' | 'text' | 'list' | string; max: number | null }
export interface CategorySchema {
  label: string; table4: boolean; appendix1: boolean; always: string[]; flags: SchemaFlag[]; values: SchemaValue[];
}
export interface ActivitySchema {
  categories: Record<string, CategorySchema>;
  data_tiers: Record<string, string>;
  appendix1_practices: Record<string, string[]>;
}

export interface ActivityRecord {
  id: string; record_id: string; version: number; project_id: string; field_id: string; scenario: 'baseline' | 'project' | string;
  year: number; category: string; attributes: Record<string, unknown>; data_tier: number; data_tier_label: string;
  source_note: string; census_release_interval_years?: number | null; evidence_ids: string[]; attestation_id: string | null; status: string; reason: string;
  created_by: string | null; created_at: string; data_class: string;
}
export interface ActivityPage { items: ActivityRecord[]; total: number; limit: number; offset: number }

export interface Attestation {
  id: string; project_id: string; field_id: string; farmer_id: string; evidence_id: string; years: number[];
  statement_lang: string; method: string; witness_user_id: string | null;
  records: { record_id: string; version: number; year: number; category: string }[];
  declarations: { year: number; category: string; attributes: Record<string, unknown> }[];
  created_by: string | null; created_at: string; data_class: string;
}

export interface Rotation { pattern: string; length: number | null; complete: boolean; reason: string }
export interface ScheduleField {
  field_id: string; field_code: string; years_with_records: number[]; lookback_years: number[]; lookback_length: number;
  meets_min_years: boolean; rotation: Rotation; lookback_ok: boolean;
  completeness: { year: number; t: number; complete: boolean; missing: string[] }[];
  missing_items: string[]; complete: boolean; tier_summary: Record<string, number>;
  schedule: { t: number; year: number; source_year: number; source_t: number; crops: string[]; categories: string[] }[];
  warnings: string[]; ready: boolean;
}
export interface Schedule {
  project_id: string; start_year: number; baseline_period_years: number; rotation_rule: string;
  reassessment: { due_on: string | null; recommended_on: string | null; status: string; message: string };
  fields: ScheduleField[]; fields_ready: number; data_class: string;
}

export interface Change {
  kind: 'quantitative' | 'qualitative'; key: string; unit?: string; lookback_average?: number; project_value?: number;
  change_pct?: number | null; introduced?: boolean; qualifying: boolean; note: string;
  lookback_state?: boolean; project_state?: boolean; new_crops?: string[];
}
export interface CropYield {
  crop: string; project_years: number[]; status: 'ok' | 'watch' | 'decline' | 'not_compared' | string;
  lookback_mean_t_ha?: number; project_mean_t_ha?: number; change_pct?: number | null; note?: string;
}
export interface Productivity { status: 'ok' | 'watch' | 'warning' | 'no_data' | string; threshold_pct: number; message: string; crops: CropYield[] }
export interface PracticeField {
  field_id: string; field_code: string; lookback_years: number[]; project_years: number[]; qualifies: boolean;
  productivity?: Productivity;
  status: 'qualifies' | 'no_qualifying_change' | 'insufficient_data' | string; message: string;
  categories: {
    category: string; label: string; appendix1: boolean; appendix1_practices: string[]; lookback_years_used: number[];
    years: { year: number; changes: Change[]; qualifying: boolean }[]; qualifying: boolean;
  }[];
}
export interface PracticeChange {
  project_id: string; start_year: number; threshold_pct: number; fields: PracticeField[]; fields_qualifying: number; data_class: string;
  fields_productivity_warning?: number; productivity_threshold_pct?: number;
}

export interface FieldLite { id: string; code: string; name: string; area_ha: number; farm_id: string; status: string }

export const TABLE4 = ['crop', 'n_fertilizer', 'tillage_residue', 'water', 'grazing', 'liming'];

export const TIER_HINT: Record<number, { short: string; needs: string }> = {
  1: { short: 'Records with evidence', needs: 'Attach at least one evidence file — logs, receipts, equipment or sensor files, or remote sensing.' },
  2: { short: 'Management plan', needs: 'Attach the historical management plan as evidence. Where it gives a range, record the conservative value.' },
  3: { short: 'Farmer attestation', needs: 'Link a signed farmer attestation covering this field and year. The verifier compares it with other evidence.' },
  4: { short: 'Regional census', needs: 'Link a signed attestation, name the census dataset and its year, and say how often it is published. VM0042 Box 1: census within 20 years or the 10 most recent releases, whichever is more recent.' },
};

/**
 * Field labels for the itemised inputs the QA3 emission equations read (the API schema lists the keys; these add labels).
 * Kept here so the form records them in the exact shape api/app/modules/emissions/domain.py expects.
 */
export interface ItemField { key: string; label: string; unit: string; kind: 'number' | 'text' | 'bool'; required?: boolean; placeholder?: string }
export interface ItemList { key: string; label: string; help: string; fields: ItemField[] }

const FERT_ITEM: ItemField[] = [
  { key: 'type', label: 'Product', unit: '', kind: 'text', placeholder: 'e.g. urea' },
  { key: 'mass_t', label: 'Mass', unit: 't', kind: 'number', required: true },
  { key: 'n_content', label: 'N content', unit: 'fraction', kind: 'number', required: true, placeholder: '0.46' },
];

export const ITEM_LISTS: Record<string, ItemList[]> = {
  n_fertilizer: [
    { key: 'synthetic_fertilizers', label: 'Synthetic fertilisers applied', help: 'Eq. 19: nitrogen = mass × N content.', fields: FERT_ITEM },
    { key: 'organic_fertilizers', label: 'Manure / compost applied', help: 'Eq. 20: nitrogen = mass × N content.', fields: FERT_ITEM },
  ],
  fossil_fuel: [
    { key: 'fuels', label: 'Other fuels', help: 'Eq. 7 for fuels other than diesel and petrol (needs EF_CO2_<fuel> in the rule pack).', fields: [
      { key: 'fuel', label: 'Fuel', unit: '', kind: 'text', required: true, placeholder: 'e.g. lpg' },
      { key: 'litres', label: 'Volume', unit: 'L', kind: 'number', required: true },
    ] },
  ],
  livestock: [
    { key: 'animals', label: 'Animals on the field', help: 'Eq. 11–13 and 26–31. Factors come from the rule pack by animal type (EF_ent_<type>, VS_rate_<type>, Nex_<type>).', fields: [
      { key: 'type', label: 'Animal type', unit: '', kind: 'text', required: true, placeholder: 'dairy_cattle' },
      { key: 'population', label: 'Head', unit: 'head', kind: 'number', required: true },
      { key: 'days_on_site', label: 'Days on site', unit: 'days', kind: 'number', placeholder: '365' },
      { key: 'weight_kg', label: 'Average weight', unit: 'kg', kind: 'number' },
      { key: 'awms', label: 'Manure share on site', unit: 'fraction', kind: 'number', placeholder: '1' },
    ] },
  ],
  n_fixing: [
    { key: 'species', label: 'N-fixing biomass returned', help: 'Eq. 25: F_CR = dry matter × N content.', fields: [
      { key: 'name', label: 'Species', unit: '', kind: 'text', placeholder: 'e.g. sunn hemp' },
      { key: 'dry_matter_t', label: 'Dry matter', unit: 't', kind: 'number', required: true },
      { key: 'n_content', label: 'N content', unit: 'fraction', kind: 'number', required: true },
    ] },
  ],
  biomass_burning: [
    { key: 'burns', label: 'Residue burnt', help: 'Eq. 14 and 32. Combustion factor defaults to CF_<residue> in the rule pack.', fields: [
      { key: 'residue', label: 'Residue', unit: '', kind: 'text', required: true, placeholder: 'rice_straw' },
      { key: 'mass_t', label: 'Mass burnt', unit: 't dm', kind: 'number', required: true },
      { key: 'combustion_factor', label: 'Combustion factor', unit: 'fraction', kind: 'number' },
    ] },
  ],
  organic_amendment_import: [
    { key: 'amendments', label: 'Amendments imported', help: 'Eq. 33 leakage. Tick an exemption only with evidence (§8.4.1).', fields: [
      { key: 'type', label: 'Type', unit: '', kind: 'text', required: true, placeholder: 'cattle_manure' },
      { key: 'mass_t', label: 'Mass', unit: 't', kind: 'number', required: true },
      { key: 'carbon_content', label: 'C content', unit: 'fraction', kind: 'number', placeholder: '0.3' },
      { key: 'produced_on_site', label: 'Produced on-site', unit: '', kind: 'bool' },
      { key: 'diverted_from_anaerobic_storage', label: 'Diverted from lagoon/pit', unit: '', kind: 'bool' },
      { key: 'not_previously_used_as_amendment', label: 'Not used as amendment before', unit: '', kind: 'bool' },
    ] },
  ],
};

/** Extra flat quantities the emission equations read (whole-field totals). */
export const EXTRA_VALUES: Record<string, SchemaValue[]> = {
  liming: [{ key: 'limestone_t', unit: 't', kind: 'number', max: null }, { key: 'dolomite_t', unit: 't', kind: 'number', max: null }],
};

export function human(v: string | null | undefined): string {
  if (!v) return '—';
  const s = String(v).replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** A value key without its unit suffix, e.g. yield_t_ha → "Yield". */
/** Labels and help for values whose key alone reads badly. */
export const VALUE_HELP: Record<string, { label: string; hint: string }> = {
  rotation_length_years: { label: 'Rotation length', hint: 'Years in one complete crop rotation, as stated by the farmer or agronomist. Lets a rotation count as complete without seeing it restart (§6 p.14).' },
  area_share_pct: { label: 'Share of the field', hint: '' },
};

/** Help shown under a yes/no question. */
export const FLAG_HELP: Record<string, string> = {
  production_maintained_slaughtered: 'Answer Yes only with evidence that production did not fall and the animals were sold for slaughter, not moved elsewhere. Then the project herd is used and no displacement leakage is needed (VM0042 §8.4.2 b).',
};

export function keyLabel(k: string): string {
  if (VALUE_HELP[k]) return VALUE_HELP[k].label;
  return human(k.replace(/_(t_ha|kg_n_ha|t_dm|t|kg|mm|cm|pct|per_yr|head_ha|head|l|days)$/, '').replace(/_n_rate/, ' N rate'));
}

/** Short summary of a record's attributes for tables. */
export function summarise(attrs: Record<string, unknown>): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(attrs ?? {})) {
    if (v === null || v === undefined || v === '') continue;
    if (typeof v === 'boolean') { if (v) parts.push(human(k)); continue; }
    if (Array.isArray(v)) { parts.push(`${human(k)}: ${v.length}`); continue; }
    parts.push(`${keyLabel(k)} ${v}`);
  }
  return parts.join(' · ') || 'No details';
}
