import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiError } from '../../core/api.service';
import { NumPipe } from '../../core/format';
import { Icon } from '../../ui/icon';
import { Badge } from '../../ui/kit';

/* Building blocks shared by the QA1, woody-biomass, leakage and sampling-design screens. */

/** A methodology reference shown as a small mono chip, e.g. "VM0042 §8.6.1 p.64". */
@Component({
  selector: 'vc-ref',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: [`
    :host{display:inline-flex;align-items:center;height:20px;padding:0 7px;border-radius:5px;background:var(--sand-100);border:1px solid var(--border);
      font:500 11px/1 var(--mono);color:var(--stone-600);white-space:nowrap;width:max-content;max-width:100%;overflow:hidden;text-overflow:ellipsis}
  `],
})
export class Ref {}

/** An equation / symbol tag in the calculated colour, e.g. "Eq. 62". */
@Component({
  selector: 'vc-eq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: [`
    :host{display:inline-flex;align-items:center;font:600 11px/1 var(--mono);padding:3px 6px;border-radius:4px;background:var(--dc-calculated-bg);
      color:var(--dc-calculated);white-space:nowrap}
  `],
})
export class Eq {}

/** A 422 / 409 explained: message plus any `details.problems`, `details.errors`, `details.fields` or `details.warnings`. */
@Component({
  selector: 'vc-api-problems',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (error(); as e) {
      <div class="box" [class.warn]="tone() === 'warn'">
        <vc-icon [name]="tone() === 'warn' ? 'circle-alert' : 'alert'" [size]="18" />
        <div class="c">
          <strong>{{ title() || e.message }}</strong>
          @if (title() && e.message) { <p>{{ e.message }}</p> }
          @if (items().length) {
            <ul>
              @for (x of shown(); track $index) { <li>{{ x }}</li> }
            </ul>
            @if (items().length > limit() && !all()) { <button type="button" class="more" (click)="all.set(true)">Show all {{ items().length }}</button> }
          }
          @if (e.code && e.code !== 'ERROR') { <code class="code">{{ e.code }}</code> }
        </div>
      </div>
    }
  `,
  styles: [`
    .box{display:flex;gap:10px;padding:12px 14px;border-radius:var(--radius-sm);background:var(--danger-soft);border:1px solid #f3c7c3;color:var(--red-600)}
    .box.warn{background:var(--warn-soft);border-color:#f1dcae;color:var(--amber-600)}
    .c{flex:1;min-width:0;color:var(--stone-800);font-size:13.5px}
    .c p{margin-top:2px;color:var(--stone-700)}
    ul{margin:6px 0 0;padding-left:18px;display:flex;flex-direction:column;gap:3px;font-size:13px}
    .more{margin-top:6px;border:0;background:none;padding:0;color:var(--primary);font:inherit;font-size:12.5px;cursor:pointer}
    .code{display:inline-block;margin-top:8px;font-size:11px;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,.7);color:var(--stone-600)}
  `],
})
export class ApiProblems {
  error = input<ApiError | null>(null);
  title = input('');
  tone = input<'danger' | 'warn'>('danger');
  limit = input(12);
  all = signal(false);
  items = computed(() => problemsOf(this.error()));
  shown = computed(() => (this.all() ? this.items() : this.items().slice(0, this.limit())));
}

/** Every readable line an API error carries in its details. */
export function problemsOf(e: ApiError | null): string[] {
  if (!e) return [];
  const d = e.details ?? {};
  const out: string[] = [];
  const push = (v: unknown) => { if (v !== null && v !== undefined && String(v).trim()) out.push(String(v)); };
  for (const k of ['problems', 'errors', 'warnings']) {
    const v = d[k];
    if (Array.isArray(v)) v.forEach(x => push(typeof x === 'object' && x ? (x as { message?: string }).message ?? JSON.stringify(x) : x));
  }
  const fields = d['fields'];
  if (Array.isArray(fields)) {
    for (const f of fields as { field?: string; message?: string }[]) {
      push(`${String(f.field ?? '').replace(/^body\./, '').replace(/_/g, ' ')}: ${String(f.message ?? '').replace(/^Value error, /, '')}`);
    }
  }
  const lists: [string, string][] = [['missing_columns', 'Missing columns'], ['site_codes', 'Site codes'], ['strata', 'Zones'], ['years', 'Years'], ['plots', 'Plots'], ['unpaired_plots', 'Unpaired plots']];
  for (const [k, label] of lists) {
    const v = d[k];
    if (Array.isArray(v) && v.length) push(`${label}: ${v.join(', ')}`);
    else if (v && typeof v === 'object' && !Array.isArray(v)) push(`${label}: ${Object.entries(v).map(([a, b]) => `${a} (${Array.isArray(b) ? b.join(', ') : b})`).join('; ')}`);
  }
  const pts = d['points'] ?? d['samples'];
  if (Array.isArray(pts)) {
    for (const p of (pts as Record<string, unknown>[]).slice(0, 50)) {
      const head = String(p['site_code'] ?? p['sample'] ?? p['field'] ?? '');
      const tail = Object.entries(p).filter(([k]) => !['site_code', 'sample'].includes(k)).map(([k, v]) => `${k.replace(/_/g, ' ')} ${Array.isArray(v) ? v.join(', ') : v}`).join(' · ');
      push(head ? `${head}: ${tail}` : tail);
    }
  }
  if (typeof d['rule_key'] === 'string' && !out.length) push(`Methodology rule: ${d['rule_key']}`);
  return [...new Set(out)];
}

/** Text chips with an input: Enter or comma adds, × removes. Optional suggestions via a datalist. */
@Component({
  selector: 'vc-chips',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap" (click)="inp.focus()" [class.dis]="disabled()">
      @for (v of value(); track v) {
        <span class="chip">{{ v }}@if (!disabled()) { <button type="button" (click)="remove(v); $event.stopPropagation()" [attr.aria-label]="'Remove ' + v"><vc-icon name="x" [size]="11" /></button> }</span>
      }
      <input #inp [attr.list]="listId" [placeholder]="value().length ? '' : placeholder()" [disabled]="disabled()"
        (keydown.enter)="add(inp); $event.preventDefault()" (keydown)="key($event, inp)" (blur)="add(inp)" [attr.aria-label]="placeholder()" />
      @if (suggestions().length) {
        <datalist [id]="listId">@for (s of suggestions(); track s) { <option [value]="s"></option> }</datalist>
      }
    </div>
  `,
  styles: [`
    .wrap{display:flex;flex-wrap:wrap;gap:6px;align-items:center;min-height:38px;padding:5px 8px;border:1px solid var(--border-strong);border-radius:var(--radius-sm);background:var(--surface);cursor:text}
    .wrap:focus-within{border-color:var(--forest-500);box-shadow:var(--focus)}
    .wrap.dis{background:var(--surface-2)}
    .chip{display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 4px 0 9px;border-radius:5px;background:var(--forest-50);border:1px solid var(--forest-200);font-size:12.5px;color:var(--forest-700)}
    .chip button{display:grid;place-items:center;width:18px;height:18px;border:0;border-radius:4px;background:none;color:var(--forest-600);cursor:pointer}
    .chip button:hover{background:var(--forest-100)}
    input{flex:1;min-width:120px;border:0;outline:none;font:inherit;font-size:13.5px;background:none;height:26px}
  `],
})
export class ChipsInput {
  private static seq = 0;
  value = model<string[]>([]);
  placeholder = input('Type and press Enter');
  suggestions = input<string[]>([]);
  disabled = input(false);
  listId = `vc-chips-${++ChipsInput.seq}`;

  add(el: HTMLInputElement) {
    const parts = el.value.split(',').map(s => s.trim()).filter(Boolean);
    if (!parts.length) return;
    const cur = this.value();
    this.value.set([...cur, ...parts.filter(p => !cur.includes(p))]);
    el.value = '';
  }
  key(e: KeyboardEvent, el: HTMLInputElement) {
    if (e.key === ',') { e.preventDefault(); this.add(el); }
    else if (e.key === 'Backspace' && !el.value && this.value().length) this.value.set(this.value().slice(0, -1));
  }
  remove(v: string) { this.value.set(this.value().filter(x => x !== v)); }
}

export interface DraftTerm { id: string; term: string; period_label: string; value_t_co2e: number; variance: number; df: number | null; version: number; status: string }

/** After publishing: the draft term(s), the four-eyes rule and a link to where they are approved. */
@Component({
  selector: 'vc-published-terms',
  imports: [Icon, Badge, RouterLink, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pub">
      <div class="h"><vc-icon name="check-circle" [size]="18" /><strong>{{ terms().length === 1 ? 'Draft term created' : terms().length + ' draft terms created' }}</strong></div>
      <ul>
        @for (t of terms(); track t.id) {
          <li><span class="tn">{{ label(t.term) }}</span><span class="subtle small">period {{ t.period_label }} · v{{ t.version }}</span>
            <span class="v num">{{ t.value_t_co2e | num: 3 }} <small>tCO₂e</small></span><vc-badge [status]="t.status" /></li>
        }
      </ul>
      <p class="small">A colleague with methodology approval rights must approve {{ terms().length === 1 ? 'it' : 'them' }} before the calculation engine uses {{ terms().length === 1 ? 'it' : 'them' }}. You created {{ terms().length === 1 ? 'this' : 'these' }}, so another person must approve.</p>
      <a class="btn btn-secondary btn-sm" routerLink="/app/calculations" [queryParams]="{ tab: 'terms' }">Open decided terms<vc-icon name="arrow-right" [size]="14" /></a>
    </div>
  `,
  styles: [`
    .pub{padding:14px 16px;border-radius:var(--radius);border:1px solid #cfe2d4;background:var(--ok-soft)}
    .h{display:flex;align-items:center;gap:8px;color:var(--forest-700)} .h strong{color:var(--stone-900)}
    ul{list-style:none;margin:10px 0;padding:0;display:flex;flex-direction:column;gap:6px}
    li{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:8px 10px;border-radius:var(--radius-sm);background:var(--surface);border:1px solid var(--border)}
    .tn{font-weight:500} .v{margin-left:auto;font-weight:600} .v small{font-weight:500;color:var(--text-3)}
    p{color:var(--stone-700);margin-bottom:10px}
  `],
})
export class PublishedTerms {
  terms = input<DraftTerm[]>([]);
  label(t: string) { return TERM_NAMES[t] ?? t.replace(/_/g, ' '); }
}

export const TERM_NAMES: Record<string, string> = {
  baseline_scenario: 'Baseline-scenario change',
  baseline_emissions: 'Baseline emissions',
  project_emissions: 'Project emissions',
  leakage: 'Leakage',
  soc_project_modelled: 'Project SOC change (modelled, QA1)',
  ch4_soil: 'Soil CH₄ reduction (modelled, QA1)',
  n2o_soil: 'Soil N₂O reduction (modelled, QA1)',
  leakage_biomass_residues: 'Leakage: biomass residues diverted (LE_BR)',
  leakage_displacement: 'Leakage: displacement / production (LK_disp)',
  woody_biomass_project: 'Trees & shrubs, project (ΔC_TREE + ΔC_SHRUB)',
  woody_biomass_baseline: 'Trees & shrubs, baseline (ΔC_TREE + ΔC_SHRUB)',
};
