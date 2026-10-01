import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { Icon } from '../../ui/icon';
import { Callout, Modal } from '../../ui/kit';
import {
  FactorRow, PackDetail, PackRule, RuleDefn, VM0042_DOCUMENT, factorEntries, factorValue, formatRuleValue, hasDefault, humanValue, refParts,
} from './methodology-data';

/** Enter or change one methodology rule. Type-aware input; the source is always required. */
@Component({
  selector: 'vc-rule-editor',
  imports: [FormsModule, Modal, Callout, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [(open)]="open" [drawer]="true" [width]="def()?.kind === 'factors' ? '720px' : '540px'" [title]="def()?.label ?? 'Rule'" [subtitle]="def()?.help ?? ''">
      @if (def(); as d) {
        <div class="stack">
          <div class="meta">
            <code>{{ d.key }}</code>
            <span class="kind">{{ kindLabel(d.kind) }}</span>
            @if (d.required) { <span class="req-tag">Required for approval</span> }
            @else if (d.required_if) { <span class="req-tag soft">Required when {{ labelOf(d.required_if.key) }} is {{ fmtEq(d.required_if.equals) }}</span> }
            @else { <span class="opt-tag">Optional</span> }
          </div>

          @if (d.vm0042_ref || hasDefault(d)) {
            <div class="vm">
              <vc-icon name="book" [size]="15" />
              <div class="vm-t">
                @if (d.vm0042_ref) { <span>VM0042 v2.2 <strong>{{ d.vm0042_ref }}</strong></span> }
                @if (hasDefault(d)) {
                  <span>The methodology fixes this value: <strong>{{ fmt(d.vm0042_default, d.kind, d.unit) }}</strong></span>
                } @else {
                  <span class="subtle">VM0042 doesn't fix a value here — the methodology owner decides and cites the source.</span>
                }
              </div>
              @if (hasDefault(d) && !isDefault()) {
                <button type="button" class="btn btn-secondary btn-sm" (click)="useDefault()">Use VM0042 value</button>
              }
            </div>
          }

          <section class="val">
            <div class="label">Value</div>
            @switch (d.kind) {
              @case ('boolean') {
                <div class="seg">
                  <button type="button" [class.on]="value() === true" (click)="value.set(true)">Yes</button>
                  <button type="button" [class.on]="value() === false" (click)="value.set(false)">No</button>
                </div>
              }
              @case ('choice') {
                <div class="choices">
                  @for (c of d.choices; track c) {
                    <label class="choice" [class.on]="value() === c" [class.warnc]="isWarn(c)">
                      <input type="radio" name="rule-choice" [checked]="value() === c" (change)="value.set(c)" />
                      <span class="dot"></span><span>{{ human(c) }}@if (d.vm0042_default === c) { <em class="pref">VM0042 value</em> }@if (isWarn(c)) { <em class="wtag">Accepted with a warning</em> }</span><code>{{ c }}</code>
                    </label>
                  }
                </div>
                @if (isWarn(value())) {
                  <vc-callout tone="warn" icon="alert">
                    <strong>{{ human(String(value())) }} is allowed, but reported as a conformance warning.</strong>
                    @if (d.key === 'stock_method') {
                      VM0042 prefers equivalent soil mass from at least two depth increments (§8.2.1.3(7)). With fixed-depth sampling the engine applies the
                      Ellert &amp; Bettany single-layer mass correction and flags every run and verification package.
                    } @else { Every calculation and verification package using it will show the warning ({{ d.vm0042_ref }}). }
                  </vc-callout>
                }
              }
              @case ('list') {
                <div class="chips-in">
                  @for (c of listValue(); track c) { <span class="ch">{{ c }}<button type="button" (click)="removeItem(c)" aria-label="Remove"><vc-icon name="x" [size]="11" /></button></span> }
                  <input class="bare" [ngModel]="draft()" (ngModelChange)="draft.set($event)" (keydown.enter)="addItem($event)" (blur)="addItem()" placeholder="Type a value and press Enter" />
                </div>
                <span class="hint">Use the codes the platform records, e.g. <code>dry_combustion</code>, <code>forest</code>.</span>
              }
              @case ('factors') {
                <div class="fac">
                  <div class="fac-h"><span>Factor key</span><span>Value</span><span>Low</span><span>High</span><span>Unit</span><span></span></div>
                  @for (r of factorRows(); track $index; let i = $index) {
                    <div class="fac-r">
                      <input class="input mono" [ngModel]="r.key" (ngModelChange)="setFactor(i, { key: $event })" placeholder="e.g. EF_Ndirect" [attr.aria-label]="'Factor key ' + (i + 1)" />
                      <input class="input num" type="number" min="0" step="any" [ngModel]="r.value" (ngModelChange)="setFactor(i, { value: numOrNull($event) })" [placeholder]="'' + (r.ex?.value ?? '0.010')" [attr.aria-label]="'Value ' + (i + 1)" />
                      <input class="input num" type="number" min="0" step="any" [ngModel]="r.low" (ngModelChange)="setFactor(i, { low: numOrNull($event) })" [placeholder]="'' + (r.ex?.low ?? '—')" [attr.aria-label]="'Low end ' + (i + 1)" />
                      <input class="input num" type="number" min="0" step="any" [ngModel]="r.high" (ngModelChange)="setFactor(i, { high: numOrNull($event) })" [placeholder]="'' + (r.ex?.high ?? '—')" [attr.aria-label]="'High end ' + (i + 1)" />
                      <input class="input" [ngModel]="r.unit" (ngModelChange)="setFactor(i, { unit: $event })" placeholder="t N2O-N / t N" [attr.aria-label]="'Unit ' + (i + 1)" />
                      <button type="button" class="fx" (click)="removeFactor(i)" aria-label="Remove factor"><vc-icon name="trash" [size]="14" /></button>
                    </div>
                  }
                  <div class="fac-a">
                    <button type="button" class="btn btn-secondary btn-sm" (click)="addFactor()"><vc-icon name="plus" [size]="14" />Add factor</button>
                    @if (exampleRows().length) {
                      <button type="button" class="btn btn-ghost btn-sm" (click)="addExamples()"><vc-icon name="clipboard-paste" [size]="14" />Add IPCC 2019 factor keys</button>
                    }
                  </div>
                </div>
                <vc-callout tone="info" icon="info">
                  Enter the uncertainty range (low and high) wherever the source gives one. VM0042 §8.6.3 is conservative: if project emissions fall,
                  the engine uses the <strong>low</strong> end for both scenarios; if they rise, the <strong>high</strong> end. Added keys show the IPCC 2019 aggregated default as a grey placeholder only; type each value from the IPCC 2019 Refinement or a better source.
                </vc-callout>
              }
              @case ('text') {
                <textarea class="input" rows="4" [ngModel]="value() ?? ''" (ngModelChange)="value.set($event)" placeholder="Quote or summarise the methodology text"></textarea>
              }
              @default {
                <div class="unit-wrap">
                  <input type="number" class="input num big" [ngModel]="value()" (ngModelChange)="value.set($event === '' || $event === null ? null : +$event)"
                    [attr.min]="d.min" [attr.max]="d.max" [attr.step]="d.kind === 'integer' ? 1 : 'any'" />
                  @if (d.unit) { <span class="unit">{{ d.unit }}</span> }
                </div>
                <span class="hint">
                  {{ d.kind === 'integer' ? 'Whole number' : 'Number' }}@if (d.min !== null || d.max !== null) { · allowed range {{ d.min ?? '—' }} to {{ d.max ?? '—' }}{{ d.unit ? ' ' + d.unit : '' }} }
                </span>
              }
            }
            @if (valueError()) { <span class="err small">{{ valueError() }}</span> }
          </section>

          <section class="src">
            <div class="label">Source <span class="req">*</span></div>
            <p class="hint">Where in the published methodology this value comes from. Verifiers check it.</p>
            <div class="field"><label for="r-doc">Document</label><input id="r-doc" class="input" [ngModel]="doc()" (ngModelChange)="doc.set($event)" placeholder="e.g. Verra VM0042 v2.2 (21 Oct 2025)" /></div>
            <div class="form-grid">
              <div class="field"><label for="r-sec">Section</label><input id="r-sec" class="input" [ngModel]="section()" (ngModelChange)="section.set($event)" placeholder="e.g. §8.2.1" /></div>
              <div class="field"><label for="r-page">Page</label><input id="r-page" class="input" [ngModel]="page()" (ngModelChange)="page.set($event)" placeholder="e.g. 47" /></div>
            </div>
            <div class="field"><label for="r-notes">Notes <span class="subtle">(optional)</span></label><textarea id="r-notes" class="input" rows="2" [ngModel]="notes()" (ngModelChange)="notes.set($event)"></textarea></div>
          </section>

          @if (rule(); as r) {
            <div class="prev small">
              <vc-icon name="history" [size]="13" />
              Currently <strong>{{ fmt(r.value, d.kind, d.unit) }}</strong> · entered by {{ r.entered_by ?? '—' }}@if (r.last_modified_by && r.last_modified_by !== r.entered_by) {, last changed by {{ r.last_modified_by }}}
            </div>
          }
          @if (error()) { <vc-callout tone="danger" icon="alert">{{ error() }}</vc-callout> }
        </div>
      }
      <div footer class="ft">
        @if (rule()) { <button class="btn btn-ghost danger" [disabled]="saving()" (click)="clear()"><vc-icon name="trash" />Remove value</button> }
        <span class="grow"></span>
        <button class="btn btn-ghost" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!!problem() || saving()" [title]="problem() ?? ''" (click)="save()">{{ saving() ? 'Saving…' : 'Save rule' }}</button>
      </div>
    </vc-modal>
  `,
  styles: [`
    .meta{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .meta code{font-size:12px;padding:2px 6px;border-radius:4px;background:var(--sand-100);color:var(--stone-700)}
    .kind{font-size:12px;color:var(--text-3)}
    .req-tag{font-size:11.5px;padding:2px 8px;border-radius:999px;background:var(--clay-50);color:var(--clay-700);border:1px solid var(--clay-100)}
    .req-tag.soft{background:var(--amber-100);color:var(--amber-600);border-color:#f1dcae}
    .opt-tag{font-size:11.5px;padding:2px 8px;border-radius:999px;background:var(--stone-100);color:var(--stone-600)}
    .vm{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:var(--radius);background:var(--dc-calculated-bg);border:1px solid #cfd9ee;color:var(--dc-calculated)}
    .vm vc-icon{margin-top:2px}
    .vm-t{flex:1;display:flex;flex-direction:column;gap:2px;font-size:13px;color:var(--stone-800)}
    .val,.src{display:flex;flex-direction:column;gap:8px;padding:14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface-2)}
    .src .field{gap:5px}
    .hint{font-size:12px;color:var(--text-3)}
    .req{color:var(--danger)} .err{color:var(--danger)}
    .seg{display:inline-flex;padding:3px;border-radius:8px;background:var(--sand-200);gap:2px;align-self:flex-start}
    .seg button{height:34px;min-width:80px;border:0;border-radius:6px;background:none;font:500 13.5px var(--font);color:var(--stone-600);cursor:pointer}
    .seg button.on{background:var(--surface);color:var(--forest-700);box-shadow:var(--shadow-sm)}
    .choices{display:flex;flex-direction:column;gap:6px}
    .choice{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border-strong);border-radius:var(--radius-sm);background:var(--surface);cursor:pointer}
    .choice input{position:absolute;opacity:0;pointer-events:none}
    .choice.on{border-color:var(--forest-500);box-shadow:0 0 0 1px var(--forest-500) inset;background:var(--forest-50)}
    .choice.on.warnc{border-color:var(--amber-600);box-shadow:0 0 0 1px var(--amber-600) inset;background:var(--warn-soft)}
    .choice .dot{width:16px;height:16px;border-radius:50%;border:2px solid var(--stone-300);flex:none}
    .choice.on .dot{border-color:var(--forest-600);background:var(--forest-600);box-shadow:inset 0 0 0 3px var(--surface)}
    .choice span:nth-of-type(2){flex:1}
    .choice code{font-size:11px;color:var(--text-3)}
    .pref,.wtag{font-style:normal;font-size:11px;font-weight:600;margin-left:8px;padding:1px 7px;border-radius:999px}
    .pref{background:var(--dc-calculated-bg);color:var(--dc-calculated)}
    .wtag{background:var(--amber-100);color:var(--amber-600)}
    .unit-wrap{position:relative}
    .unit-wrap .input{padding-right:64px}
    .big{height:44px;font-size:18px;font-weight:600}
    .unit{position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:13px;color:var(--text-3)}
    .chips-in{display:flex;flex-wrap:wrap;gap:6px;align-items:center;min-height:40px;padding:6px 8px;border:1px solid var(--border-strong);border-radius:var(--radius-sm);background:var(--surface)}
    .chips-in:focus-within{border-color:var(--forest-500);box-shadow:var(--focus)}
    .ch{display:inline-flex;align-items:center;gap:4px;height:26px;padding:0 4px 0 9px;border-radius:6px;background:var(--forest-50);border:1px solid var(--forest-200);color:var(--forest-700);font:500 12.5px var(--mono)}
    .ch button{display:grid;place-items:center;border:0;background:none;color:inherit;cursor:pointer;padding:2px;border-radius:3px}
    .bare{flex:1;min-width:160px;border:0;outline:none;font:inherit;background:none;height:26px}
    .fac{display:flex;flex-direction:column;gap:6px}
    .fac-h,.fac-r{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,.8fr) minmax(0,.7fr) minmax(0,.7fr) minmax(0,1.1fr) 32px;gap:6px;align-items:center}
    .fac-h{font-size:11.5px;color:var(--text-3);padding:0 2px}
    .fac-r .input{padding:0 8px}
    .fx{display:grid;place-items:center;width:32px;height:38px;border:0;border-radius:6px;background:none;color:var(--stone-400);cursor:pointer}
    .fx:hover{color:var(--danger);background:var(--danger-soft)}
    .fac-a{display:flex;gap:8px;flex-wrap:wrap}
    .prev{display:flex;gap:6px;align-items:center;color:var(--text-2)}
    .ft{display:flex;gap:8px;align-items:center;width:100%}
    .grow{flex:1}
    .danger{color:var(--danger)}
  `],
})
export class RuleEditor {
  private api = inject(ApiService);
  open = model(false);
  packId = input<string>('');
  def = input<RuleDefn | null>(null);
  rule = input<PackRule | null>(null);
  allDefs = input<RuleDefn[]>([]);
  /** Suggest the source document used by other rules in the pack. */
  defaultDoc = input<string>('');
  saved = output<PackDetail>();

  value = signal<unknown>(null);
  doc = signal('');
  section = signal('');
  page = signal('');
  notes = signal('');
  draft = signal('');
  saving = signal(false);
  error = signal<string | null>(null);
  String = String;
  hasDefault = hasDefault;

  factorRows = signal<FactorRow[]>([]);
  listValue = computed(() => (Array.isArray(this.value()) ? (this.value() as string[]) : []));
  exampleRows = computed(() => {
    const have = new Set(this.factorRows().map(r => r.key.trim()));
    return factorEntries(this.def()?.example).filter(r => !have.has(r.key))
      .map(r => ({ key: r.key, value: null, low: null, high: null, unit: r.unit, ex: { value: r.value, low: r.low, high: r.high } }));
  });
  isDefault = computed(() => {
    const d = this.def();
    return !!d && hasDefault(d) && JSON.stringify(this.value()) === JSON.stringify(d.vm0042_default);
  });
  valueError = computed(() => {
    const d = this.def();
    const v = this.value();
    if (!d || v === null || v === undefined || v === '') return null;
    if (d.kind === 'number' || d.kind === 'integer') {
      const n = Number(v);
      if (!Number.isFinite(n)) return 'Enter a number.';
      if (d.kind === 'integer' && !Number.isInteger(n)) return 'Enter a whole number.';
      if (d.min !== null && n < d.min) return `Must be at least ${d.min}.`;
      if (d.max !== null && n > d.max) return `Must be at most ${d.max}.`;
    }
    if (d.kind === 'text' && String(v).trim().length < 3) return 'Enter at least 3 characters.';
    if (d.kind === 'factors') {
      const rows = this.factorRows();
      const keys = rows.map(r => r.key.trim());
      if (rows.some(r => !r.key.trim())) return 'Every factor needs a key.';
      if (new Set(keys).size !== keys.length) return 'Each factor key can appear only once.';
      for (const r of rows) {
        if (r.value === null || !(Number(r.value) >= 0)) return `Factor “${r.key}” needs a value of zero or more.`;
        if (r.low !== null && r.low > r.value) return `Factor “${r.key}”: the low end is above the value.`;
        if (r.high !== null && r.high < r.value) return `Factor “${r.key}”: the high end is below the value.`;
        if ((r.low !== null && r.low < 0) || (r.high !== null && r.high < 0)) return `Factor “${r.key}”: range ends can't be negative.`;
      }
    }
    return null;
  });
  problem = computed(() => {
    const v = this.value();
    if (v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length)) return 'Enter a value';
    if (this.valueError()) return this.valueError();
    if (this.doc().trim().length < 3) return 'Enter the source document';
    return null;
  });

  constructor() {
    effect(() => {
      if (!this.open()) return;
      const r = this.rule();
      const d = this.def();
      untracked(() => this.reset(r, d));
    });
  }

  private reset(r: PackRule | null, d: RuleDefn | null) {
    this.error.set(null);
    this.draft.set('');
    this.value.set(r ? (Array.isArray(r.value) ? [...(r.value as string[])] : r.value) : null);
    if (d?.kind === 'factors') {
      const rows = r ? factorEntries(r.value) : [];
      this.factorRows.set(rows.length ? rows : [{ key: '', value: null, low: null, high: null, unit: '' }]);
      this.syncFactors();
    }
    this.doc.set(r?.source_document ?? (d?.vm0042_ref ? VM0042_DOCUMENT : this.defaultDoc()));
    const ref = refParts(d?.vm0042_ref);
    this.section.set(r?.source_section ?? ref.section);
    this.page.set(r?.source_page ?? ref.page);
    this.notes.set(r?.notes ?? '');
  }

  human = humanValue;
  fmt = formatRuleValue;
  kindLabel(k: string) {
    return ({ number: 'Number', integer: 'Whole number', factors: 'Factor table', boolean: 'Yes / No', choice: 'One of a list', list: 'List of values', text: 'Text' } as Record<string, string>)[k] ?? k;
  }
  labelOf(key: string) { return this.allDefs().find(d => d.key === key)?.label ?? key; }
  fmtEq(v: unknown) { return typeof v === 'string' ? humanValue(v) : v === true ? 'Yes' : v === false ? 'No' : String(v); }
  isWarn(v: unknown) { return typeof v === 'string' && (this.def()?.warning_choices ?? []).includes(v); }
  numOrNull(v: unknown): number | null { return v === '' || v === null || v === undefined ? null : Number(v); }

  useDefault() {
    const d = this.def();
    if (!d || !hasDefault(d)) return;
    this.value.set(d.vm0042_default);
    this.doc.set(VM0042_DOCUMENT);
    const ref = refParts(d.vm0042_ref);
    this.section.set(ref.section);
    this.page.set(ref.page);
  }

  addItem(ev?: Event) {
    ev?.preventDefault();
    const v = this.draft().trim();
    if (!v) return;
    if (!this.listValue().includes(v)) this.value.set([...this.listValue(), v]);
    this.draft.set('');
  }
  addFactor() { this.factorRows.update(r => [...r, { key: '', value: null, low: null, high: null, unit: '' }]); this.syncFactors(); }
  addExamples() {
    this.factorRows.update(r => [...r.filter(x => x.key.trim() || x.value !== null), ...this.exampleRows()]);
    this.syncFactors();
  }
  removeFactor(i: number) { this.factorRows.update(r => r.filter((_, k) => k !== i)); this.syncFactors(); }
  setFactor(i: number, p: Partial<FactorRow>) {
    this.factorRows.update(r => r.map((x, k) => (k === i ? { ...x, ...p } : x)));
    this.syncFactors();
  }
  /** Mirror the rows into the value object sent to the API. */
  private syncFactors() {
    const rows = this.factorRows();
    this.value.set(rows.length ? factorValue(rows) : null);
  }
  removeItem(c: string) { this.value.set(this.listValue().filter(x => x !== c)); }

  save() {
    const d = this.def()!;
    let v = this.value();
    if (d.kind === 'number' || d.kind === 'integer') v = Number(v);
    if (d.kind === 'text') v = String(v).trim();
    this.saving.set(true);
    this.error.set(null);
    this.api.put<PackDetail>(`/rule-packs/${this.packId()}/rules/${d.key}`, {
      value: v, source_document: this.doc().trim(), source_section: this.section().trim() || null,
      source_page: this.page().trim() || null, notes: this.notes().trim() || null,
    }).subscribe({
      next: p => { this.saving.set(false); this.open.set(false); this.saved.emit(p); },
      error: (e: ApiError) => { this.saving.set(false); this.error.set(e.message); },
    });
  }

  clear() {
    const d = this.def()!;
    this.saving.set(true);
    this.api.delete<PackDetail>(`/rule-packs/${this.packId()}/rules/${d.key}`).subscribe({
      next: p => { this.saving.set(false); this.open.set(false); this.saved.emit(p); },
      error: (e: ApiError) => { this.saving.set(false); this.error.set(e.message); },
    });
  }
}
