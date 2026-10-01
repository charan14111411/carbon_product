import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal, untracked } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { DayPipe } from '../../core/format';
import { Icon } from '../../ui/icon';
import { Callout, FileDrop, Modal } from '../../ui/kit';
import { BaselineSchema } from './baseline-data';
import {
  ActivityRecord, Attestation, CategorySchema, EXTRA_VALUES, FLAG_HELP, FieldLite, ITEM_LISTS, ItemList, SchemaValue, TIER_HINT, VALUE_HELP, human, keyLabel,
} from './baseline.types';

type Row = Record<string, string | boolean | null>;

/** Create or correct one activity record. The form is generated from GET /activity-records/schema. */
@Component({
  selector: 'vc-record-form',
  imports: [FormsModule, NgTemplateOutlet, Modal, Callout, Icon, FileDrop, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [(open)]="open" [drawer]="true" width="680px" [title]="record() ? 'Correct activity record' : 'Record activity'"
      [subtitle]="record() ? 'Saved as a new version; the earlier one stays in the history.' : 'One category of activity for one field and year. Every value records where it came from (VM0042 Box 1).'">
      <div class="stack">
        <section class="blk">
          <div class="form-grid">
            <div class="field">
              <label for="rf-f">Field</label>
              <select id="rf-f" class="input" [ngModel]="fieldId()" (ngModelChange)="fieldId.set($event)" [disabled]="!!record()">
                <option value="">Choose a field…</option>
                @for (f of fields(); track f.id) { <option [value]="f.id">{{ f.code }} · {{ f.name }} ({{ f.area_ha.toFixed(2) }} ha)</option> }
              </select>
            </div>
            <div class="field">
              <label>Scenario</label>
              <div class="seg">
                <button type="button" [class.on]="scenario() === 'baseline'" [disabled]="!!record()" (click)="scenario.set('baseline')">Baseline look-back</button>
                <button type="button" [class.on]="scenario() === 'project'" [disabled]="!!record()" (click)="scenario.set('project')">Project year</button>
              </div>
            </div>
            <div class="field">
              <label for="rf-y">Year</label>
              <input id="rf-y" class="input num" type="number" [ngModel]="year()" (ngModelChange)="year.set(+$event)" [attr.min]="1950" [attr.max]="maxYear" />
              @if (startYear()) { <span class="hint" [class.error]="yearProblem()">{{ yearProblem() || (scenario() === 'baseline' ? 'Before ' + startYear() + ' (the project start).' : startYear() + ' or later.') }}</span> }
            </div>
            <div class="field">
              <label for="rf-c">Category</label>
              <select id="rf-c" class="input" [ngModel]="category()" (ngModelChange)="setCategory($event)" [disabled]="!!record()">
                <option value="">Choose…</option>
                @for (c of categories(); track c.key) { <option [value]="c.key">{{ c.label }}{{ c.table4 ? ' · Table 4' : '' }}</option> }
              </select>
            </div>
          </div>
        </section>

        @if (spec(); as sp) {
          <section class="blk">
            <div class="bh"><h4>{{ sp.label }}</h4>
              @if (sp.table4) { <span class="tag">Table 4 minimum</span> }
              @if (sp.appendix1) { <span class="tag soft">Appendix 1 practice</span> }
            </div>

            @for (fl of sp.flags; track fl.key) {
              <div class="flag">
                <div class="fl-h">
                  <span class="fl-l">{{ fl.label }}@if (fl.required) { <span class="req">*</span> }</span>
                  <div class="seg sm">
                    <button type="button" [class.on]="attrs()[fl.key] === true" (click)="setAttr(fl.key, true)">Yes</button>
                    <button type="button" [class.on]="attrs()[fl.key] === false" (click)="setAttr(fl.key, false)">No</button>
                  </div>
                </div>
                @if (flagHelp[fl.key]) { <p class="hint fh">{{ flagHelp[fl.key] }} <span class="ref">§8.4.2 b</span></p> }
                @if (attrs()[fl.key] === true && fl.requires_when_yes.length) {
                  <div class="dep">
                    @if (fl.requires_when_yes.length > 1) { <p class="hint">Record {{ alternatives(fl.requires_when_yes) }}.</p> }
                    <div class="form-grid">
                      @for (k of depKeys(fl.requires_when_yes); track k) {
                        @if (valueSpec(k); as q) {
                          @if (q.kind !== 'list') { <ng-container *ngTemplateOutlet="valueTpl; context: { q }" /> }
                        }
                      }
                    </div>
                    @for (k of depKeys(fl.requires_when_yes); track k) {
                      @if (valueSpec(k)?.kind === 'list') { <ng-container *ngTemplateOutlet="listTpl; context: { l: listFor(k) }" /> }
                    }
                  </div>
                }
              </div>
            }

            @if (freeValues().length) {
              <div class="form-grid free">
                @for (q of freeValues(); track q.key) { <ng-container *ngTemplateOutlet="valueTpl; context: { q }" /> }
              </div>
            }

            @if (extraLists().length || extraValues().length) {
              <div class="qa3">
                <div class="qa3-h"><vc-icon name="sigma" [size]="14" /><strong>Inputs the emission equations use</strong><span class="subtle small">QA3, Eq. 6–33 — whole-field amounts for the year</span></div>
                @if (extraValues().length) {
                  <div class="form-grid">@for (q of extraValues(); track q.key) { <ng-container *ngTemplateOutlet="valueTpl; context: { q }" /> }</div>
                  @if (category() === 'liming') { <p class="hint">Left empty, tonnes are worked out from the t/ha rates and the field area.</p> }
                }
                @for (l of extraLists(); track l.key) { <ng-container *ngTemplateOutlet="listTpl; context: { l }" /> }
              </div>
            }
          </section>

          <section class="blk">
            <div class="bh"><h4>Where the values come from</h4><span class="subtle small">VM0042 §6 Box 1 — best available source first</span></div>
            <div class="tiers">
              @for (t of [1, 2, 3, 4]; track t) {
                <button type="button" class="tier" [class.on]="tier() === t" (click)="tier.set(t)">
                  <span class="tn">Tier {{ t }}</span><strong>{{ tierHint(t).short }}</strong>
                  <span class="td">{{ tierLabel(t) }}</span>
                </button>
              }
            </div>
            @if (tier(); as t) {
              <vc-callout [tone]="tierOk() ? 'ok' : 'info'" [icon]="tierOk() ? 'check-circle' : 'info'">{{ tierHint(t).needs }}</vc-callout>
              @if (t <= 2) {
                <div class="ev">
                  @for (e of evidence(); track e.id) {
                    <div class="evr"><vc-icon name="file" [size]="14" /><span class="grow">{{ e.name }}</span><code>{{ e.id.slice(0, 8) }}</code>
                      <button type="button" class="btn btn-ghost btn-sm" (click)="removeEvidence(e.id)" aria-label="Remove"><vc-icon name="x" [size]="13" /></button></div>
                  }
                  <vc-file-drop [(file)]="file" label="Add an evidence file" hint="Logbook, receipt, equipment export, management plan · PDF, JPG, PNG or CSV" />
                  @if (file()) { <button type="button" class="btn btn-secondary btn-sm up" [disabled]="uploading()" (click)="upload()"><vc-icon name="upload" [size]="14" />{{ uploading() ? 'Uploading…' : 'Attach file' }}</button> }
                </div>
              } @else {
                <div class="field">
                  <label for="rf-a">Signed attestation</label>
                  <select id="rf-a" class="input" [ngModel]="attestationId()" (ngModelChange)="attestationId.set($event)">
                    <option value="">Choose an attestation…</option>
                    @for (a of attestationsFor(); track a.id) { <option [value]="a.evidence_id">Signed {{ a.created_at | day }} · {{ a.years.join(', ') }} · {{ a.method.toUpperCase() }}</option> }
                  </select>
                  @if (!attestationsFor().length) { <span class="hint">No attestation for this field{{ scenario() === 'baseline' ? ' covers ' + year() : '' }} yet. Create one under the Attestations tab — record the look-back values first so they appear in the signed PDF.</span> }
                </div>
                @if (t === 4) {
                  <div class="field">
                    <label for="rf-ci">Census release interval (years) <span class="req">*</span></label>
                    <div class="uw ci"><input id="rf-ci" type="number" min="0.1" max="50" step="any" class="input num" [ngModel]="censusInterval()" (ngModelChange)="censusInterval.set($event === '' || $event === null ? null : +$event)" placeholder="e.g. 5" /><span class="unit">years</span></div>
                    <span class="hint">VM0042 Box 1: census within 20 years or the 10 most recent releases, whichever is more recent. 5 for a five-yearly census, 1 for an annual survey.@if (censusWindow(); as w) { This census must be from <strong>{{ w }}</strong> or later. }</span>
                  </div>
                }
              }
            }
            <div class="field">
              <label for="rf-n">Source note @if (tier() === 4) { <span class="req">*</span> } @else { <span class="subtle">(optional)</span> }</label>
              <textarea id="rf-n" class="input" rows="2" [ngModel]="note()" (ngModelChange)="note.set($event)"
                [placeholder]="tier() === 4 ? 'e.g. Agricultural Census 2015-16, Karnataka, Mandya district' : 'e.g. Fertiliser receipts from the cooperative, kharif and rabi'"></textarea>
            </div>
          </section>

          @if (record()) {
            <section class="blk">
              <div class="field"><label for="rf-r">Why is this being corrected? <span class="req">*</span></label>
                <textarea id="rf-r" class="input" rows="2" [ngModel]="reason()" (ngModelChange)="reason.set($event)" placeholder="e.g. Yield was entered in quintals; corrected to t/ha from the mandi receipt."></textarea></div>
            </section>
          }
        }

        @if (errors().length) {
          <vc-callout tone="danger" icon="alert"><strong>{{ errorTitle() }}</strong><ul class="errs">@for (e of errors(); track $index) { <li>{{ e }}</li> }</ul></vc-callout>
        }
      </div>

      <ng-template #valueTpl let-q="q">
        <div class="field">
          <label [attr.for]="'rf-v-' + q.key">{{ keyLabel(q.key) }}@if (isRequired(q.key)) { <span class="req">*</span> }</label>
          @switch (q.kind) {
            @case ('date') { <input [id]="'rf-v-' + q.key" type="date" class="input" [ngModel]="attrs()[q.key] ?? ''" (ngModelChange)="setAttr(q.key, $event || null)" /> }
            @case ('text') { <input [id]="'rf-v-' + q.key" class="input" [ngModel]="attrs()[q.key] ?? ''" (ngModelChange)="setAttr(q.key, $event || null)" /> }
            @default {
              <div class="uw">
                <input [id]="'rf-v-' + q.key" type="number" min="0" step="any" class="input num" [attr.max]="q.max" [ngModel]="attrs()[q.key] ?? null" (ngModelChange)="setAttr(q.key, $event === '' || $event === null ? null : +$event)" />
                @if (q.unit) { <span class="unit">{{ q.unit }}</span> }
              </div>
            }
          }
          @if (valueHelp[q.key]?.hint) { <span class="hint">{{ valueHelp[q.key].hint }}</span> }
        </div>
      </ng-template>

      <ng-template #listTpl let-l="l">
        <div class="list">
          <div class="lh"><strong>{{ l.label }}</strong><span class="hint">{{ l.help }}</span></div>
          @for (row of rows(l.key); track $index; let i = $index) {
            <div class="lr">
              @for (f of l.fields; track f.key) {
                @if (f.kind === 'bool') {
                  <label class="checkbox small"><input type="checkbox" [ngModel]="row[f.key] === true" (ngModelChange)="setRow(l.key, i, f.key, $event)" />{{ f.label }}</label>
                } @else {
                  <div class="lf">
                    <span class="ll">{{ f.label }}@if (f.required) { <span class="req">*</span> }@if (f.unit) { <span class="subtle"> {{ f.unit }}</span> }</span>
                    <input class="input" [class.num]="f.kind === 'number'" [type]="f.kind === 'number' ? 'number' : 'text'" [attr.step]="f.kind === 'number' ? 'any' : null" min="0"
                      [placeholder]="f.placeholder ?? ''" [ngModel]="row[f.key] ?? ''" (ngModelChange)="setRow(l.key, i, f.key, $event)" />
                  </div>
                }
              }
              <button type="button" class="rm" (click)="removeRow(l.key, i)" aria-label="Remove entry"><vc-icon name="trash" [size]="14" /></button>
            </div>
          }
          <button type="button" class="btn btn-ghost btn-sm" (click)="addRow(l.key)"><vc-icon name="plus" [size]="14" />Add entry</button>
        </div>
      </ng-template>

      <div footer class="ft">
        <span class="grow small subtle">{{ problem() }}</span>
        <button class="btn btn-ghost" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!!problem() || saving()" (click)="save()">{{ saving() ? 'Saving…' : record() ? 'Save correction' : 'Save record' }}</button>
      </div>
    </vc-modal>
  `,
  styles: [`
    .blk{display:flex;flex-direction:column;gap:12px;padding:14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface-2)}
    .bh{display:flex;align-items:center;gap:8px;flex-wrap:wrap} .bh h4{font-size:14px;flex:1}
    .tag{font-size:11px;font-weight:600;padding:2px 8px;border-radius:999px;background:var(--forest-100);color:var(--forest-700)}
    .tag.soft{background:var(--sky-100);color:var(--sky-600)}
    .seg{display:inline-flex;padding:3px;border-radius:8px;background:var(--sand-200);gap:2px;align-self:flex-start}
    .seg button{height:32px;padding:0 12px;border:0;border-radius:6px;background:none;font:500 13px var(--font);color:var(--stone-600);cursor:pointer}
    .seg button.on{background:var(--surface);color:var(--forest-700);box-shadow:var(--shadow-sm)}
    .seg button[disabled]{cursor:not-allowed;opacity:.7}
    .seg.sm button{height:28px;min-width:52px}
    .flag{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface)}
    .fl-h{display:flex;align-items:center;gap:12px}
    .fl-l{flex:1;font-weight:500;font-size:13.5px}
    .dep{margin-top:10px;padding-top:10px;border-top:1px dashed var(--border);display:flex;flex-direction:column;gap:10px}
    .req{color:var(--danger);margin-left:2px}
    .hint{font-size:12px;color:var(--text-3)} .hint.error{color:var(--danger)}
    .uw{position:relative} .uw .input{padding-right:70px}
    .unit{position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:12px;color:var(--text-3)}
    .qa3{padding:12px;border-radius:var(--radius-sm);background:var(--dc-calculated-bg);border:1px solid #cfd9ee;display:flex;flex-direction:column;gap:10px}
    .qa3-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;color:var(--dc-calculated)} .qa3-h strong{color:var(--stone-900)}
    .list{display:flex;flex-direction:column;gap:6px;padding:10px;border-radius:var(--radius-sm);background:var(--surface);border:1px solid var(--border)}
    .lh{display:flex;flex-direction:column}
    .lr{display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;padding:8px 0;border-bottom:1px solid var(--stone-100)}
    .lf{display:flex;flex-direction:column;gap:3px;flex:1;min-width:110px}
    .ll{font-size:11.5px;color:var(--stone-700)}
    .lr .input{height:34px}
    .rm{display:grid;place-items:center;width:32px;height:34px;border:0;border-radius:6px;background:none;color:var(--stone-400);cursor:pointer}
    .rm:hover{color:var(--danger);background:var(--danger-soft)}
    .tiers{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
    @media (max-width: 700px){.tiers{grid-template-columns:1fr 1fr}}
    .tier{display:flex;flex-direction:column;gap:3px;text-align:left;padding:10px 12px;border:1px solid var(--border-strong);border-radius:var(--radius-sm);background:var(--surface);font:inherit;cursor:pointer}
    .tier.on{border-color:var(--forest-500);box-shadow:0 0 0 1px var(--forest-500) inset;background:var(--forest-50)}
    .tn{font:600 10.5px var(--mono);letter-spacing:.05em;text-transform:uppercase;color:var(--text-3)}
    .tier strong{font-size:13px;font-weight:600}
    .td{font-size:11.5px;color:var(--text-2);line-height:1.35}
    .ev{display:flex;flex-direction:column;gap:6px}
    .evr{display:flex;align-items:center;gap:8px;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface);font-size:13px}
    .evr code{font-size:11px;color:var(--text-3)}
    .up{align-self:flex-start}
    .grow{flex:1}
    .errs{margin:4px 0 0;padding-left:18px}
    .ft{display:flex;gap:8px;align-items:center;width:100%}
    .fh{margin-top:6px}
    .ref{font:500 10.5px var(--mono);padding:1px 5px;border-radius:4px;background:var(--sand-100);border:1px solid var(--border);color:var(--stone-600)}
    .ci{max-width:220px}
  `],
})
export class RecordForm {
  private api = inject(ApiService);
  private schemaSvc = inject(BaselineSchema);
  open = model(false);
  projectId = input.required<string>();
  fields = input<FieldLite[]>([]);
  startYear = input<number | null>(null);
  record = input<ActivityRecord | null>(null);
  prefill = input<{ field_id?: string; year?: number; category?: string; scenario?: string } | null>(null);
  saved = output<ActivityRecord>();

  maxYear = new Date().getFullYear();
  fieldId = signal('');
  scenario = signal<'baseline' | 'project'>('baseline');
  year = signal(new Date().getFullYear() - 1);
  category = signal('');
  attrs = signal<Record<string, unknown>>({});
  lists = signal<Record<string, Row[]>>({});
  tier = signal<number | null>(null);
  note = signal('');
  censusInterval = signal<number | null>(null);
  reason = signal('');
  evidence = signal<{ id: string; name: string }[]>([]);
  attestationId = signal('');
  attestations = signal<Attestation[]>([]);
  file = signal<File | null>(null);
  uploading = signal(false);
  saving = signal(false);
  errors = signal<string[]>([]);
  errorTitle = signal('');
  human = human;
  keyLabel = keyLabel;
  flagHelp = FLAG_HELP;
  valueHelp = VALUE_HELP;

  categories = computed(() => Object.entries(this.schemaSvc.schema()?.categories ?? {}).map(([key, c]) => ({ key, label: c.label, table4: c.table4 })));
  spec = computed<CategorySchema | null>(() => this.schemaSvc.schema()?.categories[this.category()] ?? null);
  private flagKeys = computed(() => new Set((this.spec()?.flags ?? []).flatMap(f => f.requires_when_yes.flat())));
  freeValues = computed(() => (this.spec()?.values ?? []).filter(v => !this.flagKeys().has(v.key) && v.kind !== 'list'));
  extraLists = computed<ItemList[]>(() => (ITEM_LISTS[this.category()] ?? []).filter(l => !(this.spec()?.values ?? []).some(v => v.key === l.key)));
  extraValues = computed<SchemaValue[]>(() => (EXTRA_VALUES[this.category()] ?? []).filter(x => !(this.spec()?.values ?? []).some(v => v.key === x.key)));
  field = computed(() => this.fields().find(f => f.id === this.fieldId()) ?? null);
  attestationsFor = computed(() => this.attestations().filter(a => this.scenario() !== 'baseline' || a.years.includes(this.year())));
  yearProblem = computed(() => {
    const sy = this.startYear();
    if (!sy || !this.year()) return '';
    if (this.year() > this.maxYear) return "Activity data can't be recorded for a future year.";
    if (this.scenario() === 'baseline' && this.year() >= sy) return `Baseline look-back years must be before ${sy}.`;
    if (this.scenario() === 'project' && this.year() < sy) return `Project years start in ${sy}; earlier years are the baseline look-back.`;
    return '';
  });
  tierOk = computed(() => {
    const t = this.tier();
    if (!t) return false;
    if (t <= 2) return this.evidence().length > 0;
    const att = !!this.attestationId();
    return t === 3 ? att : att && this.note().trim().length >= 10 && /\b(19|20)\d{2}\b/.test(this.note()) && (this.censusInterval() ?? 0) > 0;
  });
  problem = computed(() => {
    if (!this.fieldId()) return 'Choose a field';
    if (!this.category()) return 'Choose a category';
    if (this.yearProblem()) return this.yearProblem();
    const missingFlag = (this.spec()?.flags ?? []).find(f => f.required && typeof this.attrs()[f.key] !== 'boolean');
    if (missingFlag) return `Answer “${missingFlag.label}”`;
    if (!this.tier()) return 'Choose the data tier';
    if (!this.tierOk()) return this.tier()! <= 2 ? 'Attach an evidence file' : this.tier() === 3 ? 'Link a signed attestation' : 'Link an attestation, name the census and year, and give its release interval';
    if (this.record() && this.reason().trim().length < 5) return 'Say why it is being corrected';
    return '';
  });

  constructor() {
    this.schemaSvc.load();
    effect(() => {
      if (!this.open()) return;
      const r = this.record();
      const p = this.prefill();
      untracked(() => this.reset(r, p));
    });
    effect(() => {
      const fid = this.fieldId();
      const pid = this.projectId();
      if (!fid || !this.open()) return;
      untracked(() => this.api.get<Attestation[]>(`/projects/${pid}/fields/${fid}/attestations`).subscribe({
        next: a => this.attestations.set(a), error: () => this.attestations.set([]),
      }));
    });
  }

  private reset(r: ActivityRecord | null, p: { field_id?: string; year?: number; category?: string; scenario?: string } | null) {
    this.errors.set([]);
    this.file.set(null);
    this.reason.set('');
    if (r) {
      this.fieldId.set(r.field_id);
      this.scenario.set(r.scenario === 'project' ? 'project' : 'baseline');
      this.year.set(r.year);
      this.category.set(r.category);
      const flat: Record<string, unknown> = {};
      const lists: Record<string, Row[]> = {};
      for (const [k, v] of Object.entries(r.attributes ?? {})) {
        if (Array.isArray(v)) lists[k] = v.map(x => Object.fromEntries(Object.entries(x as object).map(([a, b]) => [a, typeof b === 'boolean' ? b : b === null ? null : String(b)])));
        else flat[k] = v;
      }
      this.attrs.set(flat);
      this.lists.set(lists);
      this.tier.set(r.data_tier);
      this.note.set(r.source_note ?? '');
      this.censusInterval.set(r.census_release_interval_years ?? null);
      this.evidence.set(r.evidence_ids.map(id => ({ id, name: 'Attached evidence' })));
      this.attestationId.set(r.attestation_id ?? '');
    } else {
      this.fieldId.set(p?.field_id ?? '');
      const sy = this.startYear();
      this.scenario.set(p?.scenario === 'project' ? 'project' : 'baseline');
      this.year.set(p?.year ?? (sy ? sy - 1 : new Date().getFullYear() - 1));
      this.category.set(p?.category ?? '');
      this.attrs.set({});
      this.lists.set({});
      this.tier.set(null);
      this.note.set('');
      this.censusInterval.set(null);
      this.evidence.set([]);
      this.attestationId.set('');
    }
  }

  setCategory(c: string) { this.category.set(c); this.attrs.set({}); this.lists.set({}); }
  setAttr(k: string, v: unknown) { this.attrs.update(a => ({ ...a, [k]: v })); }
  valueSpec(k: string) { return this.spec()?.values.find(v => v.key === k) ?? null; }
  depKeys(alts: string[][]) { return [...new Set(alts.flat())]; }
  alternatives(alts: string[][]) { return alts.map(a => a.map(human).join(' + ')).join(' or '); }
  listFor(k: string): ItemList {
    return (ITEM_LISTS[this.category()] ?? []).find(l => l.key === k) ?? {
      key: k, label: human(k), help: 'Each entry needs its mass and nitrogen content.',
      fields: [{ key: 'type', label: 'Product', unit: '', kind: 'text' }, { key: 'mass_t', label: 'Mass', unit: 't', kind: 'number', required: true },
        { key: 'n_content', label: 'N content', unit: 'fraction', kind: 'number', required: true }],
    };
  }
  isRequired(k: string) {
    const sp = this.spec();
    if (!sp) return false;
    if (sp.always.includes(k)) return true;
    return sp.flags.some(f => this.attrs()[f.key] === true && f.requires_when_yes.length === 1 && f.requires_when_yes[0].includes(k));
  }
  rows(k: string): Row[] { return this.lists()[k] ?? []; }
  addRow(k: string) { this.lists.update(l => ({ ...l, [k]: [...(l[k] ?? []), {}] })); }
  removeRow(k: string, i: number) { this.lists.update(l => ({ ...l, [k]: (l[k] ?? []).filter((_, j) => j !== i) })); }
  setRow(k: string, i: number, f: string, v: string | boolean) {
    this.lists.update(l => ({ ...l, [k]: (l[k] ?? []).map((r, j) => (j === i ? { ...r, [f]: v === '' ? null : v } : r)) }));
  }
  tierHint(t: number) { return TIER_HINT[t]; }
  /** Oldest census year allowed: max(start − 20, start − 10 × interval) (VM0042 Box 1). */
  censusWindow() {
    const sy = this.startYear(), iv = this.censusInterval();
    if (!sy || !iv || iv <= 0) return null;
    return Math.max(sy - 20, sy - Math.ceil(10 * iv));
  }
  tierLabel(t: number) { return this.schemaSvc.schema()?.data_tiers[String(t)] ?? ''; }
  removeEvidence(id: string) { this.evidence.update(e => e.filter(x => x.id !== id)); }

  upload() {
    const f = this.file();
    if (!f) return;
    const fd = new FormData();
    fd.append('file', f);
    fd.append('kind', 'document');
    fd.append('entity_type', 'field');
    if (this.fieldId()) fd.append('entity_id', this.fieldId());
    this.uploading.set(true);
    this.api.upload<{ id: string; filename: string }>('/evidence', fd).subscribe({
      next: e => { this.uploading.set(false); this.file.set(null); this.evidence.update(x => [...x, { id: e.id, name: e.filename }]); },
      error: (e: ApiError) => { this.uploading.set(false); this.errorTitle.set("The file couldn't be attached"); this.errors.set([e.message]); },
    });
  }

  /** Attributes in the exact shape the API validates and the emission equations read. */
  private buildAttributes(): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    const sp = this.spec();
    const numeric = new Set([...(sp?.values ?? []), ...this.extraValues()].filter(v => v.kind === 'number').map(v => v.key));
    for (const [k, v] of Object.entries(this.attrs())) {
      if (v === null || v === undefined || v === '') continue;
      out[k] = numeric.has(k) ? Number(v) : v;
    }
    // "No" answers: drop their dependent values so stale entries aren't submitted
    for (const f of sp?.flags ?? []) {
      if (out[f.key] === false) for (const k of f.requires_when_yes.flat()) delete out[k];
    }
    const listKeys = new Set([...(sp?.values ?? []).filter(v => v.kind === 'list').map(v => v.key), ...this.extraLists().map(l => l.key)]);
    for (const k of listKeys) {
      const def = this.listFor(k);
      const items = this.rows(k).map(r => {
        const o: Record<string, unknown> = {};
        for (const f of def.fields) {
          const v = r[f.key];
          if (v === null || v === undefined || v === '' || v === false) continue;
          o[f.key] = f.kind === 'number' ? Number(v) : f.kind === 'bool' ? true : String(v).trim();
        }
        return o;
      }).filter(o => Object.keys(o).length);
      if (items.length) out[k] = items;
    }
    this.derive(out);
    return out;
  }

  /** Fill the Table 4 summary values from the itemised entries when left empty (same data, other unit). */
  private derive(a: Record<string, unknown>) {
    const area = this.field()?.area_ha ?? 0;
    const sum = (xs: unknown, k: string) => ((xs as Record<string, number>[] | undefined) ?? []).reduce((s, x) => s + (Number(x[k]) || 0), 0);
    const names = (xs: unknown, k: string) => [...new Set(((xs as Record<string, string>[] | undefined) ?? []).map(x => x[k]).filter(Boolean))].join(', ');
    const setIf = (k: string, v: unknown) => { if ((a[k] === undefined || a[k] === '') && v !== '' && v !== 0 && v !== undefined) a[k] = v; };
    switch (this.category()) {
      case 'liming':
        if (area > 0) {
          if (a['limestone'] === true && a['limestone_t_ha'] !== undefined) setIf('limestone_t', Number(a['limestone_t_ha']) * area);
          if (a['dolomite'] === true && a['dolomite_t_ha'] !== undefined) setIf('dolomite_t', Number(a['dolomite_t_ha']) * area);
        }
        break;
      case 'livestock':
        if (a['animals']) { setIf('animal_type', names(a['animals'], 'type')); setIf('population_head', sum(a['animals'], 'population')); }
        break;
      case 'n_fixing':
        if (a['species']) { setIf('species', names(a['species'], 'name') || 'recorded'); if (area > 0) setIf('dry_matter_t_ha', sum(a['species'], 'dry_matter_t') / area); }
        break;
      case 'biomass_burning':
        if (a['burns']) { setIf('residue_type', names(a['burns'], 'residue')); setIf('mass_burned_t', sum(a['burns'], 'mass_t')); }
        break;
      case 'organic_amendment_import':
        if (a['amendments']) {
          setIf('amendment_type', names(a['amendments'], 'type'));
          setIf('mass_t', sum(a['amendments'], 'mass_t'));
          const cc = ((a['amendments'] as Record<string, number>[])[0] ?? {})['carbon_content'];
          if (cc !== undefined) setIf('carbon_content', cc);
        }
        break;
    }
  }

  save() {
    this.saving.set(true);
    this.errors.set([]);
    const tier = this.tier()!;
    const body = {
      attributes: this.buildAttributes(), data_tier: tier, source_note: this.note().trim(),
      census_release_interval_years: tier === 4 ? this.censusInterval() : null,
      evidence_ids: tier <= 2 ? this.evidence().map(e => e.id) : [], attestation_id: tier >= 3 ? this.attestationId() || null : null,
    };
    const r = this.record();
    const req = r
      ? this.api.post<ActivityRecord>(`/activity-records/${r.record_id}/versions`, { ...body, year: this.year(), reason: this.reason().trim() })
      : this.api.post<ActivityRecord>('/activity-records', { ...body, project_id: this.projectId(), field_id: this.fieldId(), scenario: this.scenario(), year: this.year(), category: this.category() });
    req.subscribe({
      next: rec => { this.saving.set(false); this.open.set(false); this.saved.emit(rec); },
      error: (e: ApiError) => {
        this.saving.set(false);
        const list = (e.details?.['errors'] as string[] | undefined) ?? ((e.details?.['fields'] as { field: string; message: string }[] | undefined) ?? []).map(f => `${human(f.field)}: ${f.message}`);
        this.errorTitle.set(e.code === 'INVALID_DATA_TIER' ? 'The data source needs attention' : e.code === 'INVALID_ATTRIBUTES' ? 'Some values need attention' : e.message);
        this.errors.set(list.length ? list : [e.message]);
      },
    });
  }
}
