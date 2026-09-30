export interface Programme {
  id: string;
  code: string;
  name: string;
  description: string | null;
  region: string;
  boundary: unknown | null;
  eligible_crops: string[];
  start_date: string | null;
  end_date: string | null;
  status: string;
  commercial_terms: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ProgrammeSummary {
  programme_id: string;
  status: string;
  projects: number;
  projects_by_status: Record<string, number>;
  farmers_enrolled: number;
  fields_enrolled: number;
  hectares_enrolled: number;
}

export interface Project {
  id: string;
  programme_id: string;
  code: string;
  name: string;
  methodology_code: string;
  methodology_version: string;
  rule_pack_id: string | null;
  baseline_start: string | null;
  crediting_start: string | null;
  crediting_end: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface EligibilityCheck {
  code: string;
  passed: boolean;
  message: string;
  details?: Record<string, unknown>;
}

export interface Enrolment {
  id: string;
  project_id: string;
  field_id: string;
  field_code: string;
  field_area_ha: number;
  farmer_id: string;
  farmer_name: string;
  status: string;
  eligibility: { checks?: EligibilityCheck[]; decided_at?: string; withdrawal?: { reason: string; on: string } };
  enrolled_on: string | null;
  withdrawn_on: string | null;
  created_at: string;
  updated_at: string;
}

export interface Crop {
  id: string;
  code: string;
  name: string;
  local_name: string | null;
  category: string;
  is_active: boolean;
}

export interface FieldLite {
  id: string;
  code: string;
  name: string;
  area_ha: number;
  crop_code: string | null;
  status: string;
  farm_id: string;
}

export interface RulePackLite {
  id: string;
  methodology_code: string;
  methodology_version: string;
  revision: number;
  title: string;
  status: string;
  created_by: string | null;
  outstanding_count?: number;
}

export const PROGRAMME_NEXT: Record<string, { to: string; label: string; icon: string; tone: 'primary' | 'danger'; reason: 'none' | 'optional' | 'required'; text: string }[]> = {
  draft: [{ to: 'active', label: 'Activate', icon: 'play', tone: 'primary', reason: 'optional',
    text: 'Activating opens the programme for projects and farmer enrolment.' }],
  active: [
    { to: 'suspended', label: 'Suspend', icon: 'ban', tone: 'danger', reason: 'required',
      text: 'Suspending pauses new enrolments and field activity until the programme is reactivated.' },
    { to: 'closed', label: 'Close', icon: 'archive', tone: 'danger', reason: 'required',
      text: 'Closing is permanent. A closed programme can’t be reopened; its records stay available for audit.' },
  ],
  suspended: [
    { to: 'active', label: 'Reactivate', icon: 'play', tone: 'primary', reason: 'optional',
      text: 'Reactivating resumes enrolment and field activity.' },
    { to: 'closed', label: 'Close', icon: 'archive', tone: 'danger', reason: 'required',
      text: 'Closing is permanent. A closed programme can’t be reopened; its records stay available for audit.' },
  ],
  closed: [],
};

export const PROJECT_NEXT: Record<string, { to: string; label: string; icon: string; tone: 'primary' | 'danger'; reason: 'none' | 'optional' | 'required'; text: string }[]> = {
  design: [{ to: 'active', label: 'Activate project', icon: 'play', tone: 'primary', reason: 'optional',
    text: 'An active project accepts enrolments, sampling campaigns and calculations.' }],
  active: [
    { to: 'monitoring', label: 'Move to monitoring', icon: 'activity', tone: 'primary', reason: 'optional',
      text: 'Monitoring marks the start of the re-measurement phase for this crediting period.' },
    { to: 'closed', label: 'Close project', icon: 'archive', tone: 'danger', reason: 'required',
      text: 'Closing is permanent. No further enrolments or calculations can be added.' },
  ],
  monitoring: [{ to: 'closed', label: 'Close project', icon: 'archive', tone: 'danger', reason: 'required',
    text: 'Closing is permanent. No further enrolments or calculations can be added.' }],
  closed: [],
};

export const CHECK_LABELS: Record<string, string> = {
  inside_programme_boundary: 'Inside programme area',
  crop_eligible: 'Eligible crop',
  land_use_history: 'Land-use history',
  not_double_enrolled: 'Not enrolled elsewhere',
  farmer_consent: 'Farmer consent',
};
