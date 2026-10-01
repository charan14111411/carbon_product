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
  vm0042_ref?: string | null;
  vm0042_default?: unknown;
  matches_vm0042_default?: boolean;
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

export interface PackWarning { key: string; value: string; message: string }

export interface PackDetail extends PackHead {
  rules: PackRule[];
  outstanding: string[];
  warnings?: PackWarning[];
  vm0042_defaults?: { applied: string[]; kept: string[]; left_for_owner: string[] };
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
  vm0042_ref?: string | null;
  vm0042_default?: unknown;
  warning_choices?: string[];
}

export interface Definitions {
  groups: { key: string; label: string; rules: RuleDefn[] }[];
  total: number;
  vm0042_document?: string;
  with_vm0042_default?: number;
}

export const VM0042_DOCUMENT = 'Verra VM0042 v2.2 (21 Oct 2025)';

/** "§8.6.4 Eq. 74 p.82" → { section: "§8.6.4 Eq. 74", page: "82" } (mirrors RuleDef.ref_parts). */
export function refParts(ref: string | null | undefined): { section: string; page: string } {
  if (!ref) return { section: '', page: '' };
  const m = /\bp\.\s*([0-9][0-9–\-, ]*)\s*$/.exec(ref);
  if (!m) return { section: ref.trim(), page: '' };
  return { section: ref.slice(0, m.index).replace(/[\s;,]+$/, ''), page: m[1].trim() };
}

export function hasDefault(d: { vm0042_default?: unknown } | null | undefined): boolean {
  return d?.vm0042_default !== null && d?.vm0042_default !== undefined;
}

/** A factor as the engine reads it: a number, or {value, low, high} for the conservative choice (§8.6.3). */
export interface FactorRow {
  key: string; value: number | null; low: number | null; high: number | null; unit: string;
  /** IPCC example shown as a placeholder only — never saved. */
  ex?: { value: number | null; low: number | null; high: number | null };
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
    return factorEntries(value).map(f => `${f.key} = ${f.value}${f.low !== null || f.high !== null ? ` (${f.low ?? '—'}–${f.high ?? '—'})` : ''}`).join(', ');
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

export function factorEntries(v: unknown): FactorRow[] {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return [];
  return Object.entries(v as Record<string, unknown>).map(([key, raw]) => {
    if (raw && typeof raw === 'object') {
      const o = raw as Record<string, unknown>;
      const n = (x: unknown) => (typeof x === 'number' ? x : x === null || x === undefined || x === '' ? null : Number(x));
      return { key, value: n(o['value']), low: n(o['low']), high: n(o['high']), unit: String(o['unit'] ?? '') };
    }
    return { key, value: typeof raw === 'number' ? raw : Number(raw), low: null, high: null, unit: '' };
  });
}

/** Rows back to the stored shape: a plain number when no range or unit, otherwise {value, low, high, unit}. */
export function factorValue(rows: FactorRow[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const r of rows) {
    const k = r.key.trim();
    if (r.low === null && r.high === null && !r.unit.trim()) { out[k] = r.value; continue; }
    const o: Record<string, unknown> = { value: r.value };
    if (r.low !== null) o['low'] = r.low;
    if (r.high !== null) o['high'] = r.high;
    if (r.unit.trim()) o['unit'] = r.unit.trim();
    out[k] = o;
  }
  return out;
}
