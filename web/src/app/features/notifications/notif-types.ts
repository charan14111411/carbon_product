export type Channel = 'sms' | 'whatsapp' | 'ivr' | 'email';

export interface Template {
  id: string; code: string; channel: Channel; language: string; version: number; subject: string | null; body: string;
  placeholders: string[]; status: 'draft' | 'approved' | 'retired'; is_default: boolean; approved_by: string | null;
  approved_at: string | null; notes: string; created_by: string | null; created_at: string;
}

export interface Notification {
  id: string; farmer_id: string | null; user_id: string | null; channel: Channel; address: string | null; language: string | null;
  template_code: string | null; template_version: number | null; trigger: string; event_id: string | null; subject: string | null;
  body: string; status: 'queued' | 'sent' | 'delivered' | 'failed' | 'skipped'; skip_reason: string | null; provider: string | null;
  provider_ref: string | null; attempts: number; last_error: string | null; sent_at: string | null; delivered_at: string | null; created_at: string;
}

export interface Inbound {
  id: string; channel: string; phone: string; farmer_id: string | null; text: string; command: 'PRACTICE' | 'HELP' | null;
  parsed: { practice_code?: string; performed_on?: string; quantity?: number; known_practice?: boolean; suggested_field_id?: string; message?: string };
  status: 'pending_review' | 'accepted' | 'rejected' | 'processed' | 'unrecognised' | 'unmatched'; error: string | null;
  grievance_id: string | null; practice_record_id: string | null; reviewed_by: string | null; review_note: string | null; created_at: string;
}

export const CHANNELS: { key: Channel; label: string; icon: string }[] = [
  { key: 'sms', label: 'SMS', icon: 'message' },
  { key: 'whatsapp', label: 'WhatsApp', icon: 'reply' },
  { key: 'ivr', label: 'Voice call', icon: 'signal' },
  { key: 'email', label: 'Email', icon: 'mail' },
];
export function channelLabel(c: string) { return CHANNELS.find(x => x.key === c)?.label ?? c; }
export function channelIcon(c: string) { return CHANNELS.find(x => x.key === c)?.icon ?? 'message'; }

export const LANGS: Record<string, string> = { en: 'English', kn: 'ಕನ್ನಡ Kannada', hi: 'हिन्दी Hindi', ta: 'தமிழ் Tamil', te: 'తెలుగు Telugu' };

export const TEMPLATE_INFO: Record<string, { title: string; when: string }> = {
  welcome: { title: 'Welcome on enrolment', when: 'Sent when a field is enrolled in a project.' },
  payment_statement: { title: 'Payment confirmation', when: 'Sent to each farmer paid in a payout batch.' },
  practice_thanks: { title: 'Practice recorded', when: 'Sent when a new practice record is saved for the farmer.' },
};

export const SKIP: Record<string, { title: string; text: string }> = {
  NO_CONSENT: { title: 'No consent to contact', text: 'The farmer has not given (or has withdrawn) consent for us to use their data to contact them. Nothing was sent and no message text was stored — this row is the proof.' },
  NO_ADDRESS: { title: 'No phone or email', text: 'There is no phone number or email address on the farmer’s record for this channel.' },
  TEMPLATE_MISSING: { title: 'No approved template', text: 'There is no approved template for this message, channel and language. Approve one on the Templates tab.' },
};

export const TRIGGERS: Record<string, string> = {
  manual: 'Sent by staff', 'payout.completed': 'Payout completed', 'farmer.enrolled': 'Farmer enrolled', 'practice.recorded': 'Practice recorded',
};

/** Split a template body into text and {placeholder} parts for highlighting. */
export function bodyParts(body: string): { t: string; ph: boolean }[] {
  const out: { t: string; ph: boolean }[] = [];
  const re = /\{([A-Za-z_][A-Za-z0-9_]*)\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) {
    if (m.index > last) out.push({ t: body.slice(last, m.index), ph: false });
    out.push({ t: m[1], ph: true });
    last = m.index + m[0].length;
  }
  if (last < body.length) out.push({ t: body.slice(last), ph: false });
  return out;
}

export function placeholdersOf(body: string): string[] {
  return [...new Set(bodyParts(body).filter(p => p.ph).map(p => p.t))];
}

export function render(body: string, ctx: Record<string, string>): string {
  return body.replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (m, k) => (ctx[k] ? ctx[k] : m));
}

export function humanPlaceholder(p: string) { return p.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()); }
