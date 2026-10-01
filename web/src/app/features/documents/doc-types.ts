export interface DocVersion {
  id: string; version: number; evidence_id: string; sha256: string; change_note: string; created_by: string | null; created_at: string;
  approval: { decision: 'approved' | 'rejected'; note: string; by: string | null; at: string } | null;
}
export interface Retention {
  status: 'retain' | 'expiring' | 'expired' | 'undetermined' | 'no_policy'; retain_until: string | null;
  policy: { id: string; kind: string; rule: string; years: number; source: string } | null; reason?: string; basis?: string;
}
export interface Doc {
  id: string; code: string; title: string; kind: Kind; classification: 'public' | 'internal' | 'confidential'; entity_type: string | null;
  entity_id: string | null; project_id: string | null; retention_policy_id: string | null; status: 'active' | 'archived'; description: string;
  current_version: number | null; approved_version: number | null; created_at: string; versions?: DocVersion[]; retention?: Retention;
}
export interface Policy { id: string; kind: Kind | '*'; rule: 'fixed_years' | 'after_crediting_end'; years: number; source: string; status: 'active' | 'retired'; notes: string; created_at: string }
export interface RetentionReport {
  as_of: string; within_days: number; counts: Record<string, number>; note: string;
  items: ({ document_id: string; code: string; title: string; kind: Kind; project_id: string | null; versions: number } & Retention)[];
}
export type Kind = 'policy' | 'contract' | 'report' | 'sop' | 'monitoring_plan' | 'other';

export const KINDS: { key: Kind; label: string; icon: string }[] = [
  { key: 'monitoring_plan', label: 'Monitoring plan', icon: 'clipboard-check' },
  { key: 'report', label: 'Report', icon: 'chart' },
  { key: 'contract', label: 'Contract', icon: 'handshake' },
  { key: 'policy', label: 'Policy', icon: 'shield' },
  { key: 'sop', label: 'Standard procedure', icon: 'list-checks' },
  { key: 'other', label: 'Other', icon: 'file' },
];
export function kindLabel(k: string) { return k === '*' ? 'All kinds (default)' : KINDS.find(x => x.key === k)?.label ?? k; }
export function kindIcon(k: string) { return KINDS.find(x => x.key === k)?.icon ?? 'file'; }

export const RETENTION: Record<string, { label: string; badge: string; hint: string }> = {
  retain: { label: 'Keep', badge: 'active', hint: 'Within its retention period' },
  expiring: { label: 'Expiring soon', badge: 'warning', hint: 'Retention period ends within the window' },
  expired: { label: 'Retention ended', badge: 'closed', hint: 'May be reviewed for disposal — never deleted automatically' },
  undetermined: { label: 'Undetermined', badge: 'pending', hint: 'A date is missing, e.g. no crediting end or no project' },
  no_policy: { label: 'No policy', badge: 'failed', hint: 'No retention policy applies' },
};
export const RETENTION_ORDER = ['retain', 'expiring', 'expired', 'undetermined', 'no_policy'];
