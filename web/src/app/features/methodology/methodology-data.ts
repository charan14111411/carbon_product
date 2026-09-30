export interface PackHead {
  id: string;
  methodology_code: string;
  methodology_version: string;
  revision: number;
  title: string;
  source_url: string | null;
  status: 'draft' | 'approved' | 'retired' | string;
  based_on_id: string | null;
  created_by: string | null;
  created_at: string;
  approved_by: string | null;
  approved_at: string | null;
  label: string;
  outstanding_count?: number;
}

export interface PackRule {
  key: string;
  label: string;
  kind: string;
  group: string | null;
  unit: string;
  value: unknown;
  source_document: string;
  source_section: string | null;
  source_page: string | null;
  source: string;
  notes: string;
  entered_by: string | null;
  last_modified_by: string | null;
  updated_at: string | null;
  data_class: string;
}

export interface PackDetail extends PackHead {
  rules: PackRule[];
  outstanding: string[];
}

export interface Readiness {
  outstanding: string[];
  outstanding_labels: string[];
  answered: number;
  total: number;
  can_approve: boolean;
}

export interface RuleDefn {
  key: string;
  label: string;
  kind: 'number' | 'integer' | 'boolean' | 'choice' | 'list' | 'text' | 'factors' | string;
  help: string;
  required: boolean;
  required_if: { key: string; equals: unknown } | null;
  choices: string[];
  unit: string;
  min: number | null;
  max: number | null;
  example: unknown;
}

export interface Definitions {
  groups: { key: string; label: string; rules: RuleDefn[] }[];
  total: number;
}

export function humanValue(v: string): string {
  const s = v.split('_').map(w => (/\d/.test(w) ? w.toUpperCase() : w)).join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Format a rule value for display according to its kind. */
export function formatRuleValue(value: unknown, kind: string, unit = ''): string {
  if (value === null || value === undefined) return '';
  if (kind === 'boolean') return value ? 'Yes' : 'No';
  if (kind === 'choice') return humanValue(String(value));
  if (kind === 'factors' && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value as Record<string, number>).map(([k, v]) => `${k} = ${v}`).join(', ');
  }
  if (kind === 'list') return Array.isArray(value) ? value.map(v => humanValue(String(v))).join(', ') : String(value);
  if (kind === 'number' || kind === 'integer') {
    const n = Number(value);
    const s = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 4 }).format(n);
    return unit ? `${s} ${unit}` : s;
  }
  return String(value);
}

export function isDemo(p: { rules?: PackRule[]; title?: string; source_url?: string | null } | null): boolean {
  if (!p) return false;
  return (p.rules ?? []).some(r => /demo/i.test(r.source_document ?? ''));
}

export function factorEntries(v: unknown): { key: string; value: number }[] {
  return v && typeof v === 'object' && !Array.isArray(v)
    ? Object.entries(v as Record<string, number>).map(([key, value]) => ({ key, value }))
    : [];
}
