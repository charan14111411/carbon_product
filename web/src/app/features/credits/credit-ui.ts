import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { fmtNum } from '../../core/format';
import { Icon } from '../../ui/icon';

/* ------------------------------------------------------------------ shared shapes */
export type CreditType = 'reduction' | 'removal';
export const CREDIT_TYPES: CreditType[] = ['reduction', 'removal'];
export const STATES = ['available', 'reserved', 'sold', 'retired', 'buffer'] as const;
export type LedgerState = (typeof STATES)[number];

export type Balances = { available: number; reserved: number; sold: number; retired: number; buffer: number; cancelled: number } & Record<string, number>;

export interface CreditBatch {
  id: string;
  code: string;
  project_id: string;
  run_id: string;
  vintage: number;
  reductions_t: number;
  removals_t: number;
  status: string;
  registry_name: string | null;
  registry_project_ref: string | null;
  serial_start: string | null;
  serial_end: string | null;
  issued_on: string | null;
  created_at: string;
  balances: Record<CreditType, Balances>;
  totals: Balances;
  issued_total: Record<CreditType, number>;
  moves?: InventoryMove[];
}

export interface InventoryMove {
  id: string;
  at: string;
  credit_type: CreditType;
  from: string;
  to: string;
  quantity: number;
  sale_id: string | null;
  reason: string;
}

export const TYPE_LABEL: Record<string, string> = { reduction: 'Reductions', removal: 'Removals' };
export const TYPE_HINT: Record<string, string> = {
  reduction: 'Emissions avoided compared with the baseline (e.g. less fertiliser, less burning).',
  removal: 'Carbon drawn down from the air and stored in the soil.',
};
/** Chart / swatch colour per credit type (validated pair: colour-blind safe). */
export const TYPE_COLOR: Record<string, string> = { reduction: '#1f5f99', removal: '#c76329' };
/** Icon per credit type, used where ledger-state colours are also on screen (so colour never means two things). */
export const TYPE_ICON: Record<string, string> = { reduction: 'trend-down', removal: 'leaf' };

export const STATE_META: Record<string, { label: string; color: string; hint: string }> = {
  available: { label: 'Available', color: 'var(--forest-500)', hint: 'Free to reserve for a buyer' },
  reserved: { label: 'Reserved', color: 'var(--sky-600)', hint: 'Held for a sale that is not delivered yet' },
  sold: { label: 'Sold', color: 'var(--clay-500)', hint: 'Delivered to a buyer' },
  retired: { label: 'Retired', color: 'var(--stone-600)', hint: 'Used by the buyer; can never be sold again' },
  buffer: { label: 'Buffer', color: 'var(--amber-600)', hint: 'Set aside against reversals (fire, land-use change)' },
  cancelled: { label: 'Cancelled', color: 'var(--stone-300)', hint: 'Withdrawn from the inventory' },
  none: { label: 'Created', color: 'var(--stone-300)', hint: 'Entered the inventory' },
};

export function money(v: string | number | null | undefined, currency = 'INR'): string {
  if (v === null || v === undefined || v === '') return '—';
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(v));
  } catch {
    return `${fmtNum(Number(v), 2)} ${currency}`;
  }
}

/* ------------------------------------------------------------------ status stepper */
@Component({
  selector: 'vcx-steps',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (s of view(); track s.key; let last = $last) {
      <div class="st" [class.done]="s.state === 'done'" [class.cur]="s.state === 'cur'">
        <span class="pt">@if (s.state === 'done') { <vc-icon name="check" [size]="11" [stroke]="2.5" /> }</span>
        <span class="lb">{{ s.label }}</span>
      </div>
      @if (!last) { <span class="ln" [class.done]="s.state === 'done'"></span> }
    }
    @if (stopped()) { <span class="stop">{{ stopped() }}</span> }
  `,
  host: { '[class.compact]': 'compact()', '[class.halted]': '!!stopped()' },
  styles: [`
    :host{display:flex;align-items:center;gap:6px;min-width:0}
    .st{display:flex;align-items:center;gap:6px;color:var(--text-3);font-size:12.5px;white-space:nowrap}
    .pt{display:grid;place-items:center;width:16px;height:16px;border-radius:50%;border:1.5px solid var(--stone-300);background:var(--surface);color:#fff;flex:none}
    .st.done{color:var(--stone-700)} .st.done .pt{background:var(--forest-500);border-color:var(--forest-500)}
    .st.cur{color:var(--forest-700);font-weight:600} .st.cur .pt{border-color:var(--forest-500);box-shadow:inset 0 0 0 3px var(--surface);background:var(--forest-500)}
    .ln{flex:1;min-width:10px;max-width:40px;height:1.5px;background:var(--stone-200)} .ln.done{background:var(--forest-400)}
    :host(.compact) .lb{display:none} :host(.compact) .st.cur .lb{display:inline}
    :host(.halted) .st,:host(.halted) .ln{opacity:.45}
    .stop{margin-left:6px;font-size:12px;font-weight:600;color:var(--stone-600);background:var(--stone-100);border:1px solid var(--stone-200);padding:1px 8px;border-radius:999px}
  `],
})
export class Steps {
  steps = input.required<string[]>();
  current = input<string>('');
  labels = input<Record<string, string>>({});
  compact = input<boolean>(false);
  /** Terminal off-path states (e.g. cancelled) shown as a chip instead of a step. */
  offPath = input<string[]>(['cancelled']);

  stopped = computed(() => (this.offPath().includes(this.current()) ? cap(this.current()) : ''));
  view = computed(() => {
    const idx = this.steps().indexOf(this.current());
    return this.steps().map((k, i) => ({
      key: k, label: this.labels()[k] ?? cap(k),
      state: idx < 0 ? 'todo' : i < idx ? 'done' : i === idx ? (i === this.steps().length - 1 ? 'done' : 'cur') : 'todo',
    }));
  });
}

function cap(s: string) {
  const t = s.replace(/_/g, ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/* ------------------------------------------------------------------ ledger balance bar */
@Component({
  selector: 'vcx-balance-bar',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="head">
      @if (icon()) { <vc-icon class="ti" [name]="icon()" [size]="14" /> }
      <strong>{{ label() }}</strong>
      <span class="spacer"></span>
      <span class="num tot">{{ fmt(total()) }} <span class="u">tCO₂e</span></span>
    </div>
    <div class="bar" role="img" [attr.aria-label]="aria()">
      @for (s of segs(); track s.key) {
        <span class="seg" [style.flex-grow]="s.v" [style.background]="s.color" [title]="s.label + ': ' + fmt(s.v) + ' tCO₂e'"></span>
      }
      @if (!total()) { <span class="seg empty"></span> }
    </div>
    @if (showLegend()) {
      <div class="legend">
        @for (s of legend(); track s.key) {
          <span class="li" [class.zero]="!s.v" [title]="s.hint"><span class="dot" [style.background]="s.color"></span>{{ s.label }} <b class="num">{{ fmt(s.v) }}</b></span>
        }
      </div>
    }
  `,
  styles: [`
    :host{display:block}
    .head{display:flex;align-items:center;gap:8px;font-size:13px;margin-bottom:8px}
    .ti{color:var(--stone-500)} .spacer{flex:1}
    .tot{font-weight:600;color:var(--stone-800)} .u{font-weight:400;color:var(--text-3);font-size:12px}
    .bar{display:flex;gap:2px;height:10px;border-radius:5px;overflow:hidden;background:var(--sand-200)}
    .seg{flex-basis:0;min-width:3px} .seg.empty{flex-grow:1;background:var(--sand-200)}
    .legend{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:10px;font-size:12px;color:var(--text-2)}
    .li{display:inline-flex;align-items:center;gap:6px} .li b{font-weight:600;color:var(--stone-800)} .li.zero{opacity:.55}
    .dot{width:8px;height:8px;border-radius:2px}
  `],
})
export class BalanceBar {
  balances = input.required<Balances>();
  label = input<string>('');
  icon = input<string>('');
  showLegend = input<boolean>(true);

  segs = computed(() => this.legend().filter(s => s.v > 1e-9));
  legend = computed(() => STATES.map(k => ({ key: k, v: Math.max(0, this.balances()?.[k] ?? 0), ...STATE_META[k] })));
  total = computed(() => this.legend().reduce((a, s) => a + s.v, 0));
  aria = computed(() => this.legend().map(s => `${s.label} ${this.fmt(s.v)} t`).join(', '));
  fmt(v: number) { return fmtNum(v, v >= 100 ? 0 : 2); }
}

/* ------------------------------------------------------------------ API validation helpers */
/** Map `details.fields[]` of a validation error to {field: message}; model-level messages go under ''. */
export function apiFieldErrors(e: { details?: Record<string, unknown> } | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of (e?.details?.['fields'] as { field?: string; message?: string }[] | undefined) ?? []) {
    const k = (f.field ?? '').split('.').pop() ?? '';
    const msg = String(f.message ?? 'Check this value.').replace(/^Value error, /, '');
    out[k] = out[k] ? `${out[k]} ${msg}` : msg;
  }
  return out;
}

/** The most useful single message for an API error: model-level validation text or the API message. */
export function apiMessage(e: { message?: string; details?: Record<string, unknown> } | null | undefined): string {
  const fe = apiFieldErrors(e);
  return fe[''] || Object.values(fe)[0] || e?.message || 'Something went wrong.';
}
