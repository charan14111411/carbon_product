import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, Empty, ErrorBox, Loading, Modal, Timeline, TimelineItem } from '../../ui/kit';
import { openBlob } from '../calculations/calc.types';
import { BaselineSchema } from './baseline-data';
import { ActivityPage, ActivityRecord, FieldLite, human, summarise } from './baseline.types';
import { RecordForm } from './record-form';

const PAGE = 100;

@Component({
  selector: 'vc-records-tab',
  imports: [FormsModule, Icon, Badge, Callout, DataClass, Empty, ErrorBox, Loading, Modal, Timeline, RecordForm, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="filters">
        <select class="input" [ngModel]="fField()" (ngModelChange)="fField.set($event); reload()" aria-label="Field">
          <option value="">All fields</option>
          @for (f of fields(); track f.id) { <option [value]="f.id">{{ f.code }} · {{ f.name }}</option> }
        </select>
        <select class="input" [ngModel]="fScenario()" (ngModelChange)="fScenario.set($event); reload()" aria-label="Scenario">
          <option value="">Baseline and project</option><option value="baseline">Baseline look-back</option><option value="project">Project years</option>
        </select>
        <select class="input" [ngModel]="fCategory()" (ngModelChange)="fCategory.set($event); reload()" aria-label="Category">
          <option value="">All categories</option>
          @for (c of categories(); track c.key) { <option [value]="c.key">{{ c.label }}</option> }
        </select>
        <input class="input num yr" type="number" placeholder="Year" [ngModel]="fYear()" (ngModelChange)="fYear.set($event); reload()" aria-label="Year" />
        <label class="checkbox small"><input type="checkbox" [ngModel]="fVoided()" (ngModelChange)="fVoided.set($event); reload()" />Show voided</label>
        <span class="spacer"></span>
        @if (filtered()) { <button class="btn btn-ghost btn-sm" (click)="clear()">Clear filters</button> }
        <span class="subtle small num">{{ total() }} record{{ total() === 1 ? '' : 's' }}</span>
      </div>
      @if (loading()) { <vc-loading [rows]="6" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load activity records" [message]="error()!" /></div> }
      @else if (!items().length) {
        <vc-empty icon="clipboard" [title]="filtered() ? 'No records match these filters' : 'No activity recorded yet'"
          [text]="filtered() ? 'Try another field, year or category.' : 'Start with the look-back: for each field, at least three years before the project start, with the six Table 4 categories every year.'">
          @if (canWrite()) { <button class="btn btn-primary" (click)="startCreate()"><vc-icon name="plus" />Record activity</button> }
        </vc-empty>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Field</th><th>Scenario</th><th class="num">Year</th><th>Category</th><th>Details</th><th>Source</th><th class="num">Version</th><th>Recorded</th></tr></thead>
            <tbody>
              @for (r of items(); track r.id) {
                <tr class="clickable" [class.void]="r.status === 'voided'" (click)="openDetail(r)">
                  <td><strong>{{ fieldCode(r.field_id) }}</strong></td>
                  <td><span class="scn" [class.b]="r.scenario === 'baseline'">{{ r.scenario === 'baseline' ? 'Baseline' : 'Project' }}</span></td>
                  <td class="num">{{ r.year }}</td>
                  <td>{{ label(r.category) }}</td>
                  <td class="det small">{{ summary(r) }}</td>
                  <td>
                    <span class="tier" [class]="'tier t' + r.data_tier" [title]="r.data_tier_label">Tier {{ r.data_tier }}</span>
                    @if (r.evidence_ids.length) { <span class="ic" title="Evidence attached"><vc-icon name="file" [size]="13" />{{ r.evidence_ids.length }}</span> }
                    @if (r.attestation_id) { <span class="ic" title="Signed attestation"><vc-icon name="pen-line" [size]="13" /></span> }
                  </td>
                  <td class="num">v{{ r.version }}@if (r.status === 'voided') { <div><vc-badge status="voided" /></div> }</td>
                  <td class="nowrap small">{{ r.created_at | day }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        @if (total() > items().length) {
          <div class="card-foot"><span class="subtle small">Showing {{ items().length }} of {{ total() }}</span><button class="btn btn-secondary btn-sm" (click)="more()">Load more</button></div>
        }
      }
    </section>

    <!-- detail -->
    <vc-modal [open]="!!detail()" (closed)="detail.set(null)" [drawer]="true" width="560px"
      [title]="detail() ? label(detail()!.category) + ' · ' + detail()!.year : ''" [subtitle]="detail() ? fieldCode(detail()!.field_id) + ' · ' + (detail()!.scenario === 'baseline' ? 'baseline look-back' : 'project year') : ''">
      @if (detail(); as r) {
        <div class="stack">
          @if (r.status === 'voided') { <vc-callout tone="warn" icon="ban"><strong>Voided.</strong> {{ r.reason }}</vc-callout> }
          <div class="row"><vc-dc [cls]="r.data_class" /><span class="tier" [class]="'tier t' + r.data_tier">Tier {{ r.data_tier }}</span><span class="small muted">{{ r.data_tier_label }}</span></div>
          <dl class="kv">
            @for (a of attrRows(r); track a.k) { <dt>{{ a.k }}</dt><dd [class.num]="a.num">{{ a.v }}</dd> }
          </dl>
          @if (r.source_note) { <div class="note"><div class="label">Source note</div><p>{{ r.source_note }}</p></div> }
          @if (r.evidence_ids.length || r.attestation_id) {
            <div class="files">
              @for (e of r.evidence_ids; track e) { <button type="button" class="btn btn-secondary btn-sm" (click)="openFile(e)"><vc-icon name="file" [size]="14" />Evidence {{ e.slice(0, 8) }}</button> }
              @if (r.attestation_id) { <button type="button" class="btn btn-secondary btn-sm" (click)="openFile(r.attestation_id)"><vc-icon name="pen-line" [size]="14" />Signed attestation</button> }
            </div>
          }
          <div>
            <div class="label">Version history</div>
            @if (versionsLoading()) { <vc-loading [rows]="2" /> } @else { <vc-timeline [items]="timeline()" /> }
          </div>
        </div>
      }
      <ng-container footer>
        @if (detail(); as r) {
          @if (canWrite() && r.status !== 'voided') {
            <button class="btn btn-ghost dang" (click)="voiding.set(r)"><vc-icon name="ban" />Void</button>
            <span class="spacer"></span>
            <button class="btn btn-primary" (click)="startCorrect(r)"><vc-icon name="pencil" />Correct</button>
          } @else { <button class="btn btn-secondary" (click)="detail.set(null)">Close</button> }
        }
      </ng-container>
    </vc-modal>

    <!-- void -->
    <vc-modal [open]="!!voiding()" (closed)="voiding.set(null)" title="Void this activity record?" width="500px">
      @if (voiding(); as r) {
        <p>{{ label(r.category) }} for {{ fieldCode(r.field_id) }}, {{ r.year }}, stops counting towards the baseline schedule and the emission equations. The record and its history stay on file, and the void is audited.</p>
        <div class="field mt"><label for="vd-r">Reason</label>
          <textarea id="vd-r" class="input" rows="3" [(ngModel)]="voidReason" placeholder="e.g. Entered against the wrong field; re-recorded on F-012."></textarea>
          <span class="hint">At least 5 characters.</span></div>
      }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="voiding.set(null)">Cancel</button>
        <button class="btn btn-danger" [disabled]="busy() || voidReason.trim().length < 5" (click)="doVoid()"><vc-icon name="ban" />{{ busy() ? 'Voiding…' : 'Void record' }}</button>
      </ng-container>
    </vc-modal>

    <vc-record-form [(open)]="formOpen" [projectId]="projectId()" [fields]="fields()" [startYear]="startYear()" [record]="editing()" [prefill]="prefill()" (saved)="onSaved($event)" />
  `,
  styles: [`
    .filters{display:flex;gap:8px;align-items:center;padding:12px 16px;border-bottom:1px solid var(--border);flex-wrap:wrap}
    .filters .input{width:auto;min-width:150px;height:34px}
    .filters .yr{min-width:0;width:96px}
    .spacer{flex:1}
    .scn{font-size:11.5px;padding:2px 8px;border-radius:999px;background:var(--forest-100);color:var(--forest-700)}
    .scn.b{background:var(--sand-200);color:var(--stone-700)}
    .det{max-width:340px;color:var(--text-2)}
    .tier{font-size:11.5px;padding:2px 7px;border-radius:5px;background:var(--sand-100);border:1px solid var(--border);color:var(--stone-600);white-space:nowrap}
    .tier.t1{background:var(--forest-50);border-color:var(--forest-200);color:var(--forest-700)}
    .tier.t2{background:var(--sky-100);border-color:#c9dcf0;color:var(--sky-600)}
    .tier.t3{background:var(--amber-100);border-color:#f1dcae;color:var(--amber-600)}
    .tier.t4{background:var(--clay-50);border-color:var(--clay-100);color:var(--clay-700)}
    .ic{display:inline-flex;align-items:center;gap:3px;margin-left:6px;font-size:11.5px;color:var(--text-3)}
    tr.void td{color:var(--text-3);text-decoration-color:var(--stone-300)}
    .note p{margin-top:4px;color:var(--stone-700)}
    .files{display:flex;gap:6px;flex-wrap:wrap}
    .dang{color:var(--red-600)}
    .mt{margin-top:12px}
  `],
})
export class RecordsTab {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private schema = inject(BaselineSchema);
  projectId = input.required<string>();
  fields = input<FieldLite[]>([]);
  active = input(false);
  canWrite = input(false);

  items = signal<ActivityRecord[]>([]);
  total = signal(0);
  loading = signal(true);
  error = signal<string | null>(null);
  fField = signal('');
  fScenario = signal('');
  fCategory = signal('');
  fYear = signal<number | null>(null);
  fVoided = signal(false);
  startYear = signal<number | null>(null);
  detail = signal<ActivityRecord | null>(null);
  versions = signal<ActivityRecord[]>([]);
  versionsLoading = signal(false);
  voiding = signal<ActivityRecord | null>(null);
  voidReason = '';
  busy = signal(false);
  formOpen = signal(false);
  editing = signal<ActivityRecord | null>(null);
  prefill = signal<{ field_id?: string; year?: number; category?: string; scenario?: string } | null>(null);
  private loadedFor = '';

  categories = computed(() => Object.entries(this.schema.schema()?.categories ?? {}).map(([key, c]) => ({ key, label: c.label })));
  filtered = computed(() => !!(this.fField() || this.fScenario() || this.fCategory() || this.fYear() || this.fVoided()));
  timeline = computed<TimelineItem[]>(() => this.versions().map(v => ({
    title: `Version ${v.version}${v.status === 'voided' ? ' · voided' : v.version === 1 ? ' · recorded' : ' · corrected'}`,
    at: new Date(v.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    note: v.version > 1 || v.status === 'voided' ? v.reason : `Tier ${v.data_tier} · ${summarise(v.attributes)}`,
    tone: v.status === 'voided' ? 'danger' : v.version === 1 ? 'ok' : 'warn',
  })));

  constructor() {
    this.schema.load();
    effect(() => {
      const pid = this.projectId();
      if (this.active() && pid !== this.loadedFor) untracked(() => { this.loadedFor = pid; this.loadStart(); this.reload(); });
    });
  }

  private loadStart() {
    this.api.get<{ crediting_start?: string | null; baseline_start?: string | null }>(`/projects/${this.projectId()}`).subscribe({
      next: p => { const d = p.crediting_start || p.baseline_start; this.startYear.set(d ? Number(d.slice(0, 4)) : null); },
      error: () => undefined,
    });
  }

  reload(append = false) {
    this.loading.set(!append);
    this.error.set(null);
    this.api.get<ActivityPage>('/activity-records', {
      project_id: this.projectId(), field_id: this.fField() || null, scenario: this.fScenario() || null, category: this.fCategory() || null,
      year: this.fYear() || null, include_voided: this.fVoided() || null, limit: PAGE, offset: append ? this.items().length : 0,
    }).subscribe({
      next: p => { this.items.set(append ? [...this.items(), ...p.items] : p.items); this.total.set(p.total); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
  more() { this.reload(true); }
  clear() { this.fField.set(''); this.fScenario.set(''); this.fCategory.set(''); this.fYear.set(null); this.fVoided.set(false); this.reload(); }

  applyFilter(q: { field_id?: string; year?: number; category?: string }) {
    this.fField.set(q.field_id ?? '');
    this.fYear.set(q.year ?? null);
    this.fCategory.set(q.category ?? '');
    this.fScenario.set('');
    this.loadedFor = this.projectId();
    this.loadStart();
    this.reload();
    if (q.field_id && q.year && q.category) {
      this.prefill.set({ ...q, scenario: 'baseline' });
      this.editing.set(null);
      this.formOpen.set(true);
    }
  }

  startCreate() {
    this.editing.set(null);
    this.prefill.set(this.fField() ? { field_id: this.fField(), category: this.fCategory() || undefined, year: this.fYear() ?? undefined } : null);
    this.formOpen.set(true);
  }
  startCorrect(r: ActivityRecord) {
    this.detail.set(null);
    this.editing.set(r);
    this.prefill.set(null);
    this.formOpen.set(true);
  }

  onSaved(r: ActivityRecord) {
    this.toast.success(r.version > 1 ? `Correction saved as version ${r.version}` : 'Activity recorded', `${this.label(r.category)} · ${this.fieldCode(r.field_id)} · ${r.year}`);
    this.reload();
  }

  openDetail(r: ActivityRecord) {
    this.detail.set(r);
    this.versions.set([]);
    this.versionsLoading.set(true);
    this.api.get<ActivityRecord[]>(`/activity-records/${r.record_id}/versions`).subscribe({
      next: v => { this.versions.set(v); this.versionsLoading.set(false); },
      error: () => this.versionsLoading.set(false),
    });
  }

  doVoid() {
    const r = this.voiding();
    if (!r) return;
    this.busy.set(true);
    this.api.post<ActivityRecord>(`/activity-records/${r.record_id}/void`, { reason: this.voidReason.trim() }).subscribe({
      next: () => { this.busy.set(false); this.voiding.set(null); this.detail.set(null); this.voidReason = ''; this.toast.success('Record voided'); this.reload(); },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e, "Couldn't void the record"); },
    });
  }

  openFile(id: string) {
    this.api.blob(`/evidence/${id}/content`).subscribe({ next: b => openBlob(b), error: (e: ApiError) => this.toast.apiError(e, "Couldn't open the file") });
  }

  label(c: string) { return this.schema.label(c); }
  fieldCode(id: string) { return this.fields().find(f => f.id === id)?.code ?? id.slice(0, 8); }
  summary(r: ActivityRecord) { return summarise(r.attributes); }
  attrRows(r: ActivityRecord) {
    const units: Record<string, string> = Object.fromEntries((this.schema.schema()?.categories[r.category]?.values ?? []).map(v => [v.key, v.unit]));
    return Object.entries(r.attributes ?? {}).map(([k, v]) => {
      let text: string;
      if (typeof v === 'boolean') text = v ? 'Yes' : 'No';
      else if (Array.isArray(v)) text = v.map(x => (typeof x === 'object' ? Object.entries(x as object).map(([a, b]) => `${human(a)} ${b === true ? 'yes' : b}`).join(', ') : String(x))).join(' · ');
      else text = `${v}${units[k] ? ' ' + units[k] : ''}`;
      return { k: human(k), v: text, num: typeof v === 'number' };
    });
  }
}
