/* Additionality (VM0042 v2.2 §7; VT0008 Step 2 and Step 4c) — API shapes and labels. */

export type StepStatus = 'pass' | 'fail' | 'incomplete';

export interface Expert {
  name: string;
  qualifications: string;
  method: string;
  attestation_evidence_id: string | null;
}

export interface EssentialDistinction {
  n_all_ha: number | null;
  n_diff_ha: number | null;
  description: string;
  evidence_ids: string[];
}

export interface Practice {
  practice: string;
  region: string;
  adoption_pct: number | null;
  source_type: string | null;
  source_reference: string;
  expert: Expert | null;
  evidence_ids: string[];
  essential_distinction: EssentialDistinction | null;
}

export interface Barrier {
  type: string;
  description: string;
  evidence_ids: string[];
}

export interface RegulatorySurplus {
  statement: string;
  legally_required: boolean | null;
  evidence_ids: string[];
}

export interface PracticeResult {
  practice: string;
  region: string;
  adoption_pct: number | null;
  status: StepStatus;
  passed: boolean;
  step: '3.1' | '3.2';
  problems?: string[];
  message?: string;
  step32: { n_all_ha: number; n_diff_ha: number; f_pct: number; passed: boolean; essential_distinction: string } | null;
}

export interface StepResult {
  code: 'regulatory_surplus' | 'barrier_analysis' | 'common_practice';
  status: StepStatus;
  passed: boolean;
  message: string;
  details: { problems?: string[]; practices?: PracticeResult[] };
}

export interface AssessmentResult {
  additional: boolean;
  complete: boolean;
  steps: StepResult[];
  reasons: string[];
}

export interface Assessment {
  id: string;
  project_id: string;
  version: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'superseded';
  regulatory_surplus: Partial<RegulatorySurplus>;
  barriers: Barrier[];
  common_practice: Practice[];
  result: AssessmentResult | Record<string, never>;
  submitted_by: string | null;
  submitted_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  review_note: string;
  supersedes_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  data_class: string;
}

export interface AdditionalityRules {
  common_practice_threshold_pct: number;
  barrier_types: string[];
  source_types: string[];
  reference: string;
}

export interface UserLite { id: string; full_name: string; email: string; role_label?: string }

export const BARRIER_LABELS: Record<string, { label: string; hint: string }> = {
  investment: { label: 'Investment', hint: 'Up-front cost, lost yield in transition years, or no access to credit.' },
  technological: { label: 'Technological', hint: 'Equipment, seed or know-how the farmers could not get without the project.' },
  institutional: { label: 'Institutional', hint: 'Land tenure, market access, extension support or policy that works against the change.' },
  other: { label: 'Other', hint: 'Any other barrier (social, cultural, ecological) — explain it clearly.' },
};

export const SOURCE_LABELS: Record<string, { label: string; hint: string }> = {
  census: { label: 'Census or government statistics', hint: 'Agricultural census, state department of agriculture, national survey.' },
  peer_reviewed: { label: 'Peer-reviewed literature', hint: 'A published journal article reporting adoption in the region.' },
  research: { label: 'Independent research', hint: 'University or research institute study not commissioned by the project.' },
  industry: { label: 'Industry report', hint: 'Trade body, input supplier or market research report.' },
  expert_attestation: { label: 'Signed attestation of an independent local expert', hint: 'Only when no published data exists. Give the expert’s qualifications and method.' },
};

export const STEP_META = [
  { n: 1, code: 'regulatory_surplus', title: 'Regulatory surplus', short: 'Not required by law', ref: 'VM0042 §7 · VCS Standard', icon: 'gavel' },
  { n: 2, code: 'barrier_analysis', title: 'Barrier analysis', short: 'What stands in the way', ref: 'VT0008 Step 2', icon: 'fence' },
  { n: 3, code: 'common_practice', title: 'Common practice', short: 'Adoption in the region', ref: 'VM0042 §7 · VT0008 Step 4c', icon: 'percent' },
] as const;
