export interface Fpo {
  id: string;
  name: string;
  registration_no: string | null;
  district: string;
  state: string;
  contact_name: string | null;
  contact_phone: string | null;
  created_at: string;
}

export interface Farmer {
  id: string;
  code: string;
  full_name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  language: string;
  fpo_id: string | null;
  member_id: string | null;
  status: string;
  kyc_status: string;
  meta: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface FarmerPage { items: Farmer[]; total: number; limit: number; offset: number }

export interface MemberLookup {
  phone: string;
  is_member: boolean;
  member_id: string | null;
  farms: { external_farm_id: string; name: string; has_soilsync: boolean; has_microclime: boolean }[];
  existing_farmer_id: string | null;
  linked_farmer_id: string | null;
}

export interface FarmerOverview {
  farmer: Farmer;
  fpo: Fpo | null;
  farms: {
    id: string; name: string; village: string; external_farm_id: string | null;
    fields: { id: string; code: string; name: string; area_ha: number; crop_code: string | null; status: string }[];
  }[];
  total_area_ha: number;
  enrolments: { id: string; project_id: string; project_code: string; field_id: string; field_code: string; status: string; enrolled_on: string | null }[];
  consents: { purpose: string; state: string; effective_on: string | null }[];
  practice_records: number;
}

export interface ConsentEvent {
  id: string; farmer_id: string; purpose: string; granted: boolean; effective_on: string;
  agreement_id: string | null; channel: string; notes: string; created_by: string | null; created_at: string;
}

export interface Consents {
  farmer_id: string;
  current: { purpose: string; state: string; granted: boolean; effective_on: string | null; event_id: string | null; agreement_id: string | null }[];
  history: ConsentEvent[];
}

export interface AgreementTemplate {
  id: string; programme_id: string | null; code: string; version: number; title: string;
  body: Record<string, string>; purposes: string[]; status: string; created_at: string; updated_at: string;
}

export interface Agreement {
  id: string; farmer_id: string; template_id: string; template_version: number; language: string;
  signed_at: string; method: string; signed_text_sha256: string; witness_user_id: string | null; created_at: string;
}

export const PURPOSES: Record<string, { label: string; text: string }> = {
  sampling: { label: 'Soil sampling', text: 'Field teams may visit and take soil cores from enrolled fields.' },
  data_use: { label: 'Data use', text: 'Farm, practice and soil data may be used to measure carbon.' },
  practice_monitoring: { label: 'Practice monitoring', text: 'Farming practices may be checked by visits, photos and satellite.' },
  share_with_buyers: { label: 'Share with buyers', text: 'Anonymised results may be shared with credit buyers and verifiers.' },
  payments: { label: 'Payments', text: 'Bank or UPI details may be used to pay the farmer’s share.' },
  sensor_installation: { label: 'Sensor installation', text: 'Soil or weather sensors may be installed on the farm.' },
};

export const PURPOSE_KEYS = Object.keys(PURPOSES);

export const LANGUAGES: Record<string, string> = {
  kn: 'Kannada', en: 'English', hi: 'Hindi', te: 'Telugu', ta: 'Tamil', ml: 'Malayalam', mr: 'Marathi',
};

export const CHANNELS: Record<string, string> = {
  field_officer: 'In person, with a field officer', paper: 'Signed paper form', app: 'Farmer app',
  whatsapp: 'WhatsApp', ivr: 'Phone call (IVR)',
};

export function initials(name: string): string {
  return (name || '?').split(/\s+/).filter(Boolean).map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

/** +918594573096 → +91 85945 73096 (Indian mobiles); anything else unchanged. */
export function formatPhone(p: string): string {
  const m = /^\+91(\d{5})(\d{5})$/.exec((p || '').replace(/\s+/g, ''));
  return m ? `+91 ${m[1]} ${m[2]}` : p;
}
