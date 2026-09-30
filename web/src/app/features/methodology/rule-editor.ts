import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { Icon } from '../../ui/icon';
import { Callout, Modal } from '../../ui/kit';
import { PackDetail, PackRule, RuleDefn, formatRuleValue, humanValue } from './methodology-data';

/** Enter or change one methodology rule. Type-aware input; the source is always required. */
@Component({
  selector: 'vc-rule-editor',
  imports: [FormsModule, Modal, Callout, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [(open)]="open" [drawer]="true" width="520px" [title]="def()?.label ?? 'Rule'" [subtitle]="def()?.help ?? ''">
      @if (def(); as d) {
        <div class="stack">
          <div class="meta">
            <code>{{ d.key }}</code>
            <span class="kind">{{ kindLabel(d.kind) }}</span>
            @if (d.required) { <span class="req-tag">Required for approval</span> }
            @else if (d.required_if) { <span class="req-tag soft">Required when {{ labelOf(d.required_if.key) }} is {{ fmtEq(d.required_if.equals) }}</span> }
            @else { <span class="opt-tag">Optional</span> }
          </div>

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
                    <label class="choice" [class.on]="value() === c">
                      <input type="radio" name="rule-choice" [checked]="value() === c" (change)="value.set(c)" />
                      <span class="dot"></span><span>{{ human(c) }}</span><code>{{ c }}</code>
                    </label>
                  }
                </div>
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
                  <div class="fac-h"><span>Factor key</span><span>Value (tCO₂e per unit)</span><span></span></div>
                  @for (r of factorRows(); track $index; let i = $index) {
                    <div class="fac-r">
                      <input class="input mono" [ngModel]="r.key" (ngModelChange)="setFactor(i, { key: $event })" placeholder="e.g. synthetic_n_kg" [attr.aria-label]="'Factor key ' + (i + 1)" />
                      <input class="input num" type="number" min="0" step="any" [ngModel]="r.value" (ngModelChange)="setFactor(i, { value: $event === '' || $event === null ? null : +$event })" placeholder="0.00598" [attr.aria-label]="'Factor value ' + (i + 1)" />
                      <button type="button" class="fx" (click)="removeFactor(i)" aria-label="Remove factor"><vc-icon name="trash" [size]="14" /></button>
                    </div>
                  }
                  <button type="button" class="btn btn-secondary btn-sm add-f" (click)="addFactor()"><vc-icon name="plus" [size]="14" />Add factor</button>
                </div>
                <span class="hint">Use the factor keys that practice types reference (the catalogue's emission factor keys). Each value must be a positive number.</span>
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
            <div class="field"><label for="r-doc">Document</label><input id="r-doc" class="input" [ngModel]="doc()" (ngModelChange)="doc.set($event)" placeholder="e.g. VM0042 v2.2 Improved Agricultural Land Management" /></div>
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
    .choice .dot{width:16px;height:16px;border-radius:50%;border:2px solid var(--stone-300);flex:none}
    .choice.on .dot{border-color:var(--forest-600);background:var(--forest-600);box-shadow:inset 0 0 0 3px var(--surface)}
    .choice span:nth-of-type(2){flex:1}
    .choice code{font-size:11px;color:var(--text-3)}
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
    .fac-h,.fac-r{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) 32px;gap:6px;align-items:center}
    .fac-h{font-size:11.5px;color:var(--text-3);padding:0 2px}
    .fx{display:grid;place-items:center;width:32px;height:38px;border:0;border-radius:6px;background:none;color:var(--stone-400);cursor:pointer}
    .fx:hover{color:var(--danger);background:var(--danger-soft)}
    .add-f{align-self:flex-start}
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

  factorRows = signal<{ key: string; value: number | null }[]>([]);
  listValue = computed(() => (Array.isArray(this.value()) ? (this.value() as string[]) : []));
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
      const bad = rows.find(r => r.value === null || !(Number(r.value) > 0));
      if (bad) return `Factor “${bad.key}” must be a positive number.`;
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
    {
      this.error.set(null);
      this.draft.set('');
      this.value.set(r ? (Array.isArray(r.value) ? [...(r.value as string[])] : r.value) : null);
      if (d?.kind === 'factors') {
        const fv = r && r.value && typeof r.value === 'object' && !Array.isArray(r.value) ? (r.value as Record<string, number>) : null;
        this.factorRows.set(fv ? Object.entries(fv).map(([key, value]) => ({ key, value })) : [{ key: '', value: null }]);
        this.syncFactors();
      }
      this.doc.set(r?.source_document ?? this.defaultDoc());
      this.section.set(r?.source_section ?? '');
      this.page.set(r?.source_page ?? '');
      this.notes.set(r?.notes ?? '');
    }
  }

  human = humanValue;
  fmt = formatRuleValue;
  kindLabel(k: string) {
    return ({ number: 'Number', integer: 'Whole number', factors: 'Factor table', boolean: 'Yes / No', choice: 'One of a list', list: 'List of values', text: 'Text' } as Record<string, string>)[k] ?? k;
  }
  labelOf(key: string) { return this.allDefs().find(d => d.key === key)?.label ?? key; }
  fmtEq(v: unknown) { return typeof v === 'string' ? humanValue(v) : v === true ? 'Yes' : v === false ? 'No' : String(v); }

  addItem(ev?: Event) {
    ev?.preventDefault();
    const v = this.draft().trim();
    if (!v) return;
    if (!this.listValue().includes(v)) this.value.set([...this.listValue(), v]);
    this.draft.set('');
  }
  addFactor() { this.factorRows.update(r => [...r, { key: '', value: null }]); this.syncFactors(); }
  removeFactor(i: number) { this.factorRows.update(r => r.filter((_, k) => k !== i)); this.syncFactors(); }
  setFactor(i: number, p: Partial<{ key: string; value: number | null }>) {
    this.factorRows.update(r => r.map((x, k) => (k === i ? { ...x, ...p } : x)));
    this.syncFactors();
  }
  /** Mirror the rows into the value object sent to the API. */
  private syncFactors() {
    const rows = this.factorRows();
    this.value.set(rows.length ? Object.fromEntries(rows.map(r => [r.key.trim(), r.value])) : null);
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
