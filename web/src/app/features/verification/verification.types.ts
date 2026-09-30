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
  { key: 'document_index', label: 'Document index', text: 'Every referenced file with its SHA-256 fingerprint.' },
];
