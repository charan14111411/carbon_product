export interface PackageSummary {
  content_sha256: string;
  project_code: string;
  period_label: string;
  period_start: string;
  period_end: string;
  generated_by: string;
  generated_at: string;
  documents: number;
  samples: number;
  lab_results: number;
  net_credits_t_co2e: number;
  reductions_t_co2e: number;
  removals_t_co2e: number;
  gross_t_co2e: number;
  uncertainty_deduction_t_co2e: number;
  buffer_t_co2e: number;
  net_before_uncertainty_t_co2e: number | null;
}

export interface Package {
  id: string;
  run_id: string;
  project_id: string;
  version: number;
  sha256: string;
  json_file_id: string;
  pdf_file_id: string | null;
  summary: PackageSummary;
  created_at: string;
  created_by: string | null;
}

export interface Integrity {
  package_id: string;
  sha256: string;
  recomputed_sha256: string | null;
  content_sha256: string | null;
  json_file_intact: boolean;
  pdf_file_intact: boolean | null;
  intact: boolean;
}

export interface VerifierAccess {
  id: string;
  package_id: string;
  verifier_name: string;
  verifier_email: string;
  organisation: string;
  expires_at: string;
  revoked_at: string | null;
  last_opened_at: string | null;
  review_status: string;
  link_status: string;
}

export interface VerifierQuery {
  id: string;
  access_id: string;
  subject_type: string;
  subject_id: string;
  question: string;
  answer: string | null;
  status: string;
  answered_by: string | null;
  answered_at: string | null;
  created_at: string;
}

/** Sections of the sealed package, in document order, with plain-English descriptions. */
export const PACKAGE_SECTIONS: { key: string; label: string; text: string }[] = [
  { key: 'metadata', label: 'Metadata', text: 'Schema, versions, period and the two fingerprints.' },
  { key: 'project', label: 'Project and programme', text: 'The project record and the programme it belongs to.' },
  { key: 'methodology', label: 'Methodology rules', text: 'The approved rule pack and every rule with its source section and page.' },
  { key: 'fields', label: 'Fields', text: 'Boundaries, areas, crops and soil types of every field in scope.' },
  { key: 'enrolments', label: 'Enrolments', text: 'Eligibility and enrolment decisions for each field.' },
  { key: 'land_use', label: 'Land-use history', text: 'Prior land use with supporting evidence.' },
  { key: 'practices', label: 'Practices', text: 'Latest version of every recorded management practice.' },
  { key: 'strata', label: 'Zones', text: 'Stratification in effect for the monitoring campaign.' },
  { key: 'campaigns', label: 'Sampling campaigns', text: 'Baseline and monitoring campaigns and their design.' },
  { key: 'sites', label: 'Sampling sites', text: 'Permanent sites and their locations.' },
  { key: 'samples', label: 'Samples', text: 'Every core with GPS, depth and photo fingerprints.' },
  { key: 'soil_layers', label: 'Soil layers', text: 'Depth increments of each core.' },
  { key: 'custody_events', label: 'Chain of custody', text: 'Every hand-over from field to lab, with seal checks.' },
  { key: 'labs', label: 'Laboratories', text: 'Labs that analysed the samples.' },
  { key: 'lab_results', label: 'Lab results', text: 'All results, marking the exact versions used in the calculation.' },
  { key: 'terms', label: 'Decided terms', text: 'Project-level estimates with variance and source.' },
  { key: 'calculation', label: 'Calculation', text: 'Frozen inputs, rules, full results and status history.' },
  { key: 'qa_findings', label: 'Quality findings', text: 'Every quality finding raised for the project, open or resolved.' },
  { key: 'activity_data', label: 'Activity data', text: 'Baseline and project activity records with their Box 1 data tier and attestations (§6).' },
  { key: 'emissions', label: 'Emissions', text: 'QA3 baseline and project emissions per source, field and year (Eq. 6–32, 52–59).' },
  { key: 'leakage', label: 'Leakage', text: 'Organic-amendment leakage (Eq. 33) and its split between reductions and removals (Eq. 39/42).' },
  { key: 'uncertainty', label: 'Uncertainty', text: 'Uncertainty deduction per source (Eq. 70–74) and the multipliers applied.' },
  { key: 'vintages', label: 'Vintages', text: 'ER, CR, buffer and VCUs per calendar year (Eq. 37–43, 75–79).' },
  { key: 'equations', label: 'Equation trail', text: 'Every step of the calculation with its VM0042 v2.2 equation number.' },
  { key: 'annex', label: 'Strata & points annex', text: 'Strata, areas and sample points with intended and actual coordinates (§8.2.1.2).' },
  { key: 'supporting_data', label: 'Supporting data', text: 'Weather and satellite summaries that inform the review only — never used for credits.' },
  { key: 'conformance', label: 'VM0042 conformance', text: 'Each requirement the package can evidence: met, not met or not applicable.' },
  { key: 'document_index', label: 'Document index', text: 'Every referenced file with its SHA-256 fingerprint.' },
];

/** Sections added in package schema v2 (VM0042 v2.2). */
export const V2_SECTIONS = ['activity_data', 'emissions', 'leakage', 'uncertainty', 'vintages', 'equations', 'annex', 'supporting_data', 'conformance'];

export interface ConformanceItem { ref: string; requirement: string; status: 'met' | 'not_met' | 'n/a' | string; evidence: string }

export interface AnnexStratum {
  code: string; name: string | null; role: string | null; quantification_unit: string; control_for_code: string | null;
  area_ha: number | null; n_used: number | null; reference_mass_t_ha: number | null; field_ids: string[];
}
export interface AnnexPoint {
  stratum: string | null; site_code: string | null; campaign: string | null; sample_code: string;
  intended_latitude: number | null; intended_longitude: number | null; actual_latitude: number | null; actual_longitude: number | null;
  distance_from_intended_m: number | null; gps_accuracy_m: number | null; collected_at: string | null; depth_reached_cm: number | null; shallow: boolean;
}
export interface Annex { strata: AnnexStratum[]; points: AnnexPoint[]; note?: string }

const ANNEX_COLUMNS = ['record_type', 'stratum', 'quantification_unit', 'role', 'area_ha', 'control_for', 'site_code',
  'campaign', 'sample_code', 'intended_latitude', 'intended_longitude', 'actual_latitude', 'actual_longitude',
  'distance_from_intended_m', 'gps_accuracy_m', 'collected_at', 'depth_reached_cm', 'shallow'];

/** The §8.2.1.2 annex as CSV, built from the sealed package — same columns as GET /packages/{id}/annex.csv. */
export function annexCsv(annex: Annex): string {
  const cell = (v: unknown) => {
    if (v === null || v === undefined) return '';
    const s = typeof v === 'boolean' ? (v ? 'True' : 'False') : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows: Record<string, unknown>[] = [
    ...annex.strata.map(s => ({ record_type: 'stratum', stratum: s.code, quantification_unit: s.quantification_unit, role: s.role, area_ha: s.area_ha, control_for: s.control_for_code ?? '' })),
    ...annex.points.map(p => ({ record_type: 'point', ...p })),
  ];
  return [ANNEX_COLUMNS.join(','), ...rows.map(r => ANNEX_COLUMNS.map(c => cell(r[c])).join(','))].join('\n') + '\n';
}

/** Count what a section holds, for the contents list. */
export function sectionCount(doc: Record<string, unknown>, key: string): number | null {
  const v = doc[key] as unknown;
  if (v === undefined || v === null) return null;
  if (Array.isArray(v)) return v.length;
  if (typeof v !== 'object') return 1;
  const o = v as Record<string, unknown>;
  switch (key) {
    case 'methodology': return (o['rules'] as unknown[] | undefined)?.length ?? 0;
    case 'activity_data': return (o['records'] as unknown[] | undefined)?.length ?? 0;
    case 'emissions': return Object.keys(((o['qa3'] as Record<string, unknown> | null)?.['sources'] as object | undefined) ?? o['components'] ?? {}).length;
    case 'leakage': return (o['le_oa_items'] as unknown[] | undefined)?.length ?? 0;
    case 'annex': return ((o['strata'] as unknown[] | undefined)?.length ?? 0) + ((o['points'] as unknown[] | undefined)?.length ?? 0);
    case 'supporting_data': return ((o['observations'] as unknown[] | undefined)?.length ?? 0) + ((o['satellite_indices'] as unknown[] | undefined)?.length ?? 0);
    default: return Object.keys(o).length;
  }
}

export const SECTION_UNIT: Record<string, string> = {
  methodology: 'rules', activity_data: 'records', emissions: 'sources', leakage: 'imports', uncertainty: 'sources', vintages: 'years',
  equations: 'steps', annex: 'rows', supporting_data: 'summaries', conformance: 'checks', document_index: 'files',
};
