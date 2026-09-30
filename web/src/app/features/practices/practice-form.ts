import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { HumanPipe } from '../../core/format';
import { Icon } from '../../ui/icon';
import { Callout, Modal } from '../../ui/kit';
import { AttrInputs, missingRequired } from '../fields/attr-inputs';
import { Chip } from '../fields/chip';
import { FieldRec, Practice, PracticeType, SOURCE_LABEL, evidenceForm } from '../fields/field-data';

export type FieldLite = Pick<FieldRec, 'id' | 'code' | 'name' | 'crop_code' | 'area_ha' | 'status'>;

/** Record a practice (version 1) or save a correction (a new version with a reason). */
@Component({
  selector: 'vc-practice-form',
  imports: [FormsModule, Modal, Callout, Icon, AttrInputs, Chip, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [(open)]="open" [title]="correcting() ? 'Correct practice record' : 'Record a practice'" width="720px"
      [subtitle]="correcting() ? 'Saves version ' + (record()!.version + 1) + '. The earlier version stays in the history.' : 'Recorded practices feed the baseline and project scenarios in the carbon calculation.'">
      <div class="stack">
        <div class="form-grid">
          <div class="field span-2">
            <label for="p-field">Field</label>
            <div class="picker">
              <input class="input" placeholder="Search by field code or name…" [ngModel]="fieldQ()" (ngModelChange)="fieldQ.set($event)" aria-label="Search fields" />
              <select id="p-field" class="input" [ngModel]="fieldId()" (ngModelChange)="pickField($event)">
                <option value="">Choose a field…</option>
                @for (f of fieldOptions(); track f.id) { <option [value]="f.id">{{ f.code }} · {{ f.name }}{{ f.crop_code ? ' · ' + cropName(f.crop_code) : '' }}</option> }
              </select>
            </div>
            @if (field(); as f) {
              <span class="hint">{{ f.area_ha.toFixed(2) }} ha · crop: {{ f.crop_code ? cropName(f.crop_code) : 'not set — all practice types are shown' }}</span>
            }
          </div>

          <div class="field span-2">
            <label for="p-type">Practice</label>
            <select id="p-type" class="input" [ngModel]="code()" (ngModelChange)="pickType($event)" [disabled]="!fieldId()">
              <option value="">{{ fieldId() ? 'Choose a practice…' : 'Choose a field first' }}</option>
              @for (g of typeGroups(); track g.cat) {
                <optgroup [label]="g.cat | human">
                  @for (t of g.items; track t.code) { <option [value]="t.code">{{ t.name }}</option> }
                </optgroup>
              }
            </select>
            @if (pt()?.description) { <span class="hint">{{ pt()!.description }}</span> }
          </div>

          <div class="field span-2">
            <span class="label">Scenario <span class="req">*</span></span>
            <div class="scen" role="radiogroup" aria-label="Scenario">
              <button type="button" role="radio" [attr.aria-checked]="scenario() === 'baseline'" [class.on]="scenario() === 'baseline'" (click)="scenario.set('baseline')">
                <span class="dot"></span><span><strong>Baseline</strong><small>What was done before the project, or would have happened without it</small></span>
              </button>
              <button type="button" role="radio" [attr.aria-checked]="scenario() === 'project'" [class.on]="scenario() === 'project'" (click)="scenario.set('project')">
                <span class="dot"></span><span><strong>Project</strong><small>A practice carried out as part of this carbon project</small></span>
              </button>
            </div>
            <span class="hint">Never assumed — choose one so the record is counted in the right scenario.</span>
          </div>

          <div class="field"><label for="p-on">Date performed</label><input id="p-on" type="date" class="input" [ngModel]="performedOn()" (ngModelChange)="performedOn.set($event)" [max]="today" /></div>
          <div class="field"><label for="p-end">End date <span class="subtle">(if it ran over several days)</span></label><input id="p-end" type="date" class="input" [ngModel]="endedOn()" (ngModelChange)="endedOn.set($event)" [min]="performedOn()" /></div>

          @if (pt()?.requires_quantity || pt()?.unit) {
            <div class="field">
              <label for="p-q">Quantity @if (pt()!.requires_quantity) { <span class="req">*</span> }</label>
              <div class="unit-wrap"><input id="p-q" type="number" min="0" class="input num" [ngModel]="quantity()" (ngModelChange)="quantity.set($event)" /><span class="unit">{{ pt()!.unit }}</span></div>
            </div>
          }
          <div class="field">
            <label for="p-area">Area covered <span class="subtle">(optional)</span></label>
            <div class="unit-wrap"><input id="p-area" type="number" min="0" class="input num" [ngModel]="area()" (ngModelChange)="area.set($event)" [placeholder]="field() ? field()!.area_ha.toFixed(2) : ''" /><span class="unit">ha</span></div>
            <span class="hint">Leave empty if the whole field was covered.</span>
          </div>
          @if (!correcting()) {
            <div class="field">
              <label for="p-src">Reported via</label>
              <select id="p-src" class="input" [ngModel]="source()" (ngModelChange)="source.set($event)">
                @for (s of sources; track s[0]) { <option [value]="s[0]">{{ s[1] }}</option> }
              </select>
            </div>
          }
        </div>

        @if (pt()?.fields?.length) {
          <div class="extra">
            <div class="label">{{ pt()!.name }} details</div>
            <vc-attr-inputs [defs]="pt()!.fields" [(values)]="extra" />
          </div>
        }

        <div class="field">
          <span class="label">Evidence
            @if (pt()?.required_evidence?.length) { <span class="req-ev">required: @for (e of pt()!.required_evidence; track e) { <vc-chip tone="amber">{{ e | human }}</vc-chip> }</span> }
          </span>
          <div class="files">
            @for (id of keptEvidence(); track id) {
              <div class="file"><vc-icon name="file-check" [size]="15" /><span class="mono small">{{ id.slice(0, 8) }}</span><span class="subtle small">already attached</span>
                <button type="button" class="x" (click)="keptEvidence.set(keptEvidence().filter(k => k !== id))" aria-label="Remove"><vc-icon name="x" [size]="13" /></button></div>
            }
            @for (f of files(); track $index) {
              <div class="file"><vc-icon name="file" [size]="15" /><span class="truncate">{{ f.name }}</span><span class="subtle small">{{ (f.size / 1024).toFixed(0) }} KB</span>
                <button type="button" class="x" (click)="removeFile($index)" aria-label="Remove"><vc-icon name="x" [size]="13" /></button></div>
            }
            <label class="add"><input type="file" multiple hidden (change)="addFiles($event)" accept="image/*,application/pdf" /><vc-icon name="upload" [size]="15" />Add photos or documents</label>
          </div>
          @if (pt()?.required_evidence?.length && !files().length && !keptEvidence().length) {
            <span class="warn-hint"><vc-icon name="alert" [size]="13" />You can save without evidence, but the record will be flagged as missing evidence.</span>
          }
        </div>

        @if (correcting()) {
          <div class="field">
            <label for="p-reason">Reason for the correction <span class="req">*</span></label>
            <textarea id="p-reason" class="input" rows="2" [ngModel]="reason()" (ngModelChange)="reason.set($event)" placeholder="e.g. Quantity was entered in bags instead of kg"></textarea>
          </div>
        }

        @if (error()) { <vc-callout tone="danger" icon="alert">{{ error() }}</vc-callout> }
      </div>

      <div footer class="ft">
        <span class="subtle small grow">{{ problem() ?? '' }}</span>
        <button class="btn btn-ghost" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!!problem() || saving()" (click)="save()">
          <vc-icon name="check" />{{ saving() ? 'Saving…' : correcting() ? 'Save correction' : 'Record practice' }}
        </button>
      </div>
    </vc-modal>
  `,
  styles: [`
    .req{color:var(--danger)}
    .picker{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:8px}
    @media (max-width: 720px){.picker{grid-template-columns:1fr}}
    .scen{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .scen button{display:flex;gap:10px;align-items:flex-start;text-align:left;padding:12px 14px;border:1px solid var(--border-strong);border-radius:var(--radius);background:var(--surface);cursor:pointer;font:inherit;color:var(--stone-800)}
    .scen button:hover{border-color:var(--stone-400)}
    .scen button.on{border-color:var(--forest-500);background:var(--forest-50);box-shadow:0 0 0 1px var(--forest-500) inset}
    .scen .dot{flex:none;width:16px;height:16px;margin-top:2px;border-radius:50%;border:2px solid var(--stone-300);background:var(--surface)}
    .scen button.on .dot{border-color:var(--forest-600);box-shadow:inset 0 0 0 3px var(--surface);background:var(--forest-600)}
    .scen strong{display:block;font-weight:600} .scen small{display:block;font-size:12px;color:var(--text-2);margin-top:2px;line-height:1.4}
    .unit-wrap{position:relative} .unit-wrap .input{padding-right:56px}
    .unit{position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:12px;color:var(--text-3)}
    .extra{padding:14px;border-radius:var(--radius-sm);background:var(--surface-2);border:1px solid var(--border);display:flex;flex-direction:column;gap:10px}
    .req-ev{display:inline-flex;gap:4px;align-items:center;margin-left:8px;font-weight:400;color:var(--text-3)}
    .files{display:flex;flex-direction:column;gap:6px}
    .file{display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface-2)}
    .file .truncate{flex:1;min-width:0}
    .file .mono{flex:1}
    .x{border:0;background:none;color:var(--stone-400);cursor:pointer;display:grid;place-items:center;padding:2px;border-radius:4px}
    .x:hover{color:var(--danger);background:var(--danger-soft)}
    .add{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border:1.5px dashed var(--border-strong);border-radius:var(--radius-sm);color:var(--stone-600);cursor:pointer;font-size:13px}
    .add:hover{border-color:var(--forest-400);background:var(--forest-50);color:var(--forest-700)}
    .warn-hint{display:flex;gap:6px;align-items:center;font-size:12px;color:var(--amber-600)}
    .ft{display:flex;gap:8px;align-items:center;width:100%;justify-content:flex-end}
    .grow{margin-right:auto}
  `],
})
export class PracticeForm {
  private api = inject(ApiService);
  open = model(false);
  fields = input<FieldLite[]>([]);
  cropNames = input<Map<string, string>>(new Map());
  /** When set, the form saves a correction of this record. */
  record = input<Practice | null>(null);
  presetFieldId = input<string | null>(null);
  saved = output<Practice>();

  sources = Object.entries(SOURCE_LABEL);
  today = new Date().toISOString().slice(0, 10);

  fieldQ = signal('');
  fieldId = signal('');
  code = signal('');
  scenario = signal<'baseline' | 'project' | ''>('');
  performedOn = signal('');
  endedOn = signal('');
  quantity = signal<number | null>(null);
  area = signal<number | null>(null);
  source = signal('field_app');
  extra = signal<Record<string, unknown>>({});
  files = signal<File[]>([]);
  keptEvidence = signal<string[]>([]);
  reason = signal('');
  types = signal<PracticeType[]>([]);
  saving = signal(false);
  error = signal<string | null>(null);
  private clientRef = '';

  correcting = computed(() => !!this.record());
  field = computed(() => this.fields().find(f => f.id === this.fieldId()) ?? null);
  pt = computed(() => this.types().find(t => t.code === this.code()) ?? null);
  fieldOptions = computed(() => {
    const q = this.fieldQ().toLowerCase().trim();
    return this.fields().filter(f => f.id === this.fieldId() || !q || `${f.code} ${f.name}`.toLowerCase().includes(q)).slice(0, 300);
  });
  typeGroups = computed(() => {
    const m = new Map<string, PracticeType[]>();
    for (const t of this.types()) {
      if (!t.is_active && t.code !== this.code()) continue;
      m.set(t.category, [...(m.get(t.category) ?? []), t]);
    }
    return [...m.entries()].map(([cat, items]) => ({ cat, items }));
  });
  problem = computed(() => {
    if (!this.fieldId()) return 'Choose a field';
    if (!this.code()) return 'Choose a practice';
    if (!this.scenario()) return 'Choose baseline or project';
    if (!this.performedOn()) return 'Enter the date performed';
    if (this.endedOn() && this.endedOn() < this.performedOn()) return "The end date can't be before the start";
    const q = this.quantity() as unknown;
    if (this.pt()?.requires_quantity && (q === null || q === '' || q === undefined)) return 'Enter the quantity';
    const miss = missingRequired(this.pt()?.fields as never ?? [], this.extra());
    if (miss.length) return `Fill in: ${miss.join(', ')}`;
    if (this.correcting() && this.reason().trim().length < 5) return 'Say why the record is being corrected';
    return null;
  });

  constructor() {
    effect(() => {
      if (!this.open()) return;
      const r = this.record();
      untracked(() => this.reset(r));
    });
  }

  private reset(r: Practice | null) {
    {
      this.error.set(null);
      this.files.set([]);
      this.reason.set('');
      this.clientRef = crypto.randomUUID();
      if (r) {
        this.fieldId.set(r.field_id); this.code.set(r.practice_code); this.scenario.set(r.scenario);
        this.performedOn.set(r.performed_on); this.endedOn.set(r.ended_on ?? ''); this.quantity.set(r.quantity);
        this.area.set(r.area_ha); this.keptEvidence.set([...r.evidence_ids]);
        this.extra.set(Object.fromEntries(Object.entries(r.details ?? {}).filter(([k]) => k !== 'client_ref')));
      } else {
        this.fieldId.set(this.presetFieldId() ?? ''); this.code.set(''); this.scenario.set('');
        this.performedOn.set(''); this.endedOn.set(''); this.quantity.set(null); this.area.set(null);
        this.keptEvidence.set([]); this.extra.set({});
      }
      this.loadTypes();
    }
  }

  cropName(code: string) { return this.cropNames().get(code) ?? code; }

  pickField(id: string) {
    this.fieldId.set(id);
    this.loadTypes();
  }

  pickType(code: string) {
    this.code.set(code);
    this.extra.set({});
    if (!this.pt()?.unit && !this.pt()?.requires_quantity) this.quantity.set(null);
  }

  private loadTypes() {
    const crop = this.field()?.crop_code;
    this.api.get<PracticeType[]>('/catalogue/practice-types', { crop_code: crop ?? undefined }).subscribe({
      next: r => {
        // keep the current type visible when correcting, even if it no longer matches the crop
        const cur = this.code();
        this.types.set(r);
        if (cur && !r.some(t => t.code === cur) && !this.correcting()) this.code.set('');
        if (cur && this.correcting() && !r.some(t => t.code === cur)) {
          this.api.get<PracticeType[]>('/catalogue/practice-types', { include_inactive: true }).subscribe({
            next: all => { const t = all.find(x => x.code === cur); if (t) this.types.set([...r, t]); },
          });
        }
      },
    });
  }

  addFiles(e: Event) {
    const list = Array.from((e.target as HTMLInputElement).files ?? []);
    this.files.update(f => [...f, ...list]);
    (e.target as HTMLInputElement).value = '';
  }
  removeFile(i: number) { this.files.update(f => f.filter((_, k) => k !== i)); }

  async save() {
    if (this.problem()) return;
    this.saving.set(true);
    this.error.set(null);
    try {
      const ids = [...this.keptEvidence()];
      for (const f of this.files()) {
        const ev = await firstValueFrom(this.api.upload<{ id: string }>('/evidence',
          evidenceForm(f, f.type.startsWith('image/') ? 'photo' : 'document', 'practice')));
        ids.push(ev.id);
      }
      this.files.set([]);
      this.keptEvidence.set(ids);
      const num = (v: unknown) => (v === null || v === '' || v === undefined ? null : Number(v));
      const body: Record<string, unknown> = {
        field_id: this.fieldId(), practice_code: this.code(), scenario: this.scenario(),
        performed_on: this.performedOn(), ended_on: this.endedOn() || null,
        quantity: num(this.quantity()), unit: num(this.quantity()) !== null ? this.pt()?.unit ?? null : null,
        area_ha: num(this.area()), extra: this.extra(), evidence_ids: ids,
      };
      let out: Practice;
      if (this.correcting()) {
        out = await firstValueFrom(this.api.post<Practice>(`/practices/${this.record()!.record_id}/versions`, { ...body, reason: this.reason().trim() }));
      } else {
        out = await firstValueFrom(this.api.post<Practice>('/practices', { ...body, source: this.source(), client_ref: this.clientRef },
          { 'Idempotency-Key': this.clientRef }));
      }
      this.saved.emit(out);
      this.open.set(false);
    } catch (e) {
      this.error.set((e as ApiError).message);
    } finally {
      this.saving.set(false);
    }
  }
}
