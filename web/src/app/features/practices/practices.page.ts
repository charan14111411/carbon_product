import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiError, ApiService, Page } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, HumanPipe, NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Empty, ErrorBox, Loading, PageHeader } from '../../ui/kit';
import { Chip } from '../fields/chip';
import { Crop, FieldRec, Practice, PracticeType, SOURCE_LABEL } from '../fields/field-data';
import { PracticeDrawer } from './practice-drawer';
import { FieldLite, PracticeForm } from './practice-form';

@Component({
  selector: 'vc-practices-page',
  imports: [
    FormsModule, PageHeader, Loading, ErrorBox, Empty, Badge, Icon, Chip, PracticeForm, PracticeDrawer,
    DayPipe, HumanPipe, NumPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Practices" eyebrow="Land"
      subtitle="The practice ledger: what was done on each field, when, and in which scenario. Corrections create a new version — nothing is overwritten.">
      @if (auth.can('practice.record')) {
        <button actions class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />Record a practice</button>
      }
    </vc-page-header>

    <div class="summary">
      <div class="s"><span class="l">Records</span><span class="v num">{{ total() }}</span></div>
      <div class="s"><span class="l">Project scenario</span><span class="v num">{{ countBy('project') }}</span></div>
      <div class="s"><span class="l">Baseline scenario</span><span class="v num">{{ countBy('baseline') }}</span></div>
      <button type="button" class="s warn" [class.on]="missingOnly()" (click)="missingOnly.set(!missingOnly())" [disabled]="!missingCount()">
        <span class="l"><vc-icon name="file-warning" [size]="13" />Missing evidence</span><span class="v num">{{ missingCount() }}</span>
      </button>
    </div>

    <div class="filters">
      <label class="scope">
        <input type="checkbox" [ngModel]="projectOnly()" (ngModelChange)="projectOnly.set($event)" />
        Only fields enrolled in {{ ctx.current()?.code ?? 'this project' }}
      </label>
      <select class="input" [ngModel]="fieldId()" (ngModelChange)="fieldId.set($event)" aria-label="Field">
        <option value="">All fields</option>
        @for (f of fields(); track f.id) { <option [value]="f.id">{{ f.code }} · {{ f.name }}</option> }
      </select>
      <select class="input" [ngModel]="code()" (ngModelChange)="code.set($event)" aria-label="Practice">
        <option value="">All practices</option>
        @for (t of types(); track t.code) { <option [value]="t.code">{{ t.name }}</option> }
      </select>
      <select class="input sm" [ngModel]="scenario()" (ngModelChange)="scenario.set($event)" aria-label="Scenario">
        <option value="">Both scenarios</option><option value="baseline">Baseline</option><option value="project">Project</option>
      </select>
      <div class="dates">
        <input type="date" class="input" [ngModel]="from()" (ngModelChange)="from.set($event)" aria-label="From date" />
        <span class="subtle">to</span>
        <input type="date" class="input" [ngModel]="to()" (ngModelChange)="to.set($event)" aria-label="To date" />
      </div>
      <label class="scope"><input type="checkbox" [ngModel]="voided()" (ngModelChange)="voided.set($event)" />Show voided</label>
      @if (hasFilters()) { <button class="btn btn-ghost btn-sm" (click)="clear()"><vc-icon name="x" [size]="14" />Clear</button> }
    </div>

    <section class="card">
      @if (loading()) {
        <vc-loading [rows]="8" />
      } @else if (error()) {
        <div class="card-body"><vc-error title="Couldn't load practices" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error></div>
      } @else if (!rows().length) {
        @if (hasFilters() || missingOnly()) {
          <vc-empty icon="filter" title="No records match these filters" text="Try widening the date range or clearing the filters."><button class="btn btn-secondary" (click)="clear()">Clear filters</button></vc-empty>
        } @else {
          <vc-empty icon="sprout" title="No practices recorded yet"
            text="Practices come in from the field app, farmer app, WhatsApp and partners — or record one here.">
            @if (auth.can('practice.record')) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />Record a practice</button> }
          </vc-empty>
        }
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr>
              <th>Date</th><th>Field</th><th>Practice</th><th>Scenario</th><th class="num">Quantity</th><th>Source</th><th>Evidence</th><th>Version</th>
            </tr></thead>
            <tbody>
              @for (p of rows(); track p.id) {
                <tr class="clickable" [class.voided]="p.status === 'voided'" (click)="openRecord(p.record_id)">
                  <td class="nowrap">{{ p.performed_on | day }}@if (p.ended_on && p.ended_on !== p.performed_on) { <span class="subtle small"> – {{ p.ended_on | day }}</span> }</td>
                  <td>@if (fieldOf(p.field_id); as f) { <span class="mono code">{{ f.code }}</span><div class="subtle small truncate nm">{{ f.name }}</div> } @else { <span class="subtle mono small">{{ p.field_id.slice(0, 8) }}</span> }</td>
                  <td><div class="pn">{{ typeOf(p.practice_code)?.name ?? p.practice_code }}</div>@if (typeOf(p.practice_code); as t) { <vc-chip [cat]="t.category">{{ t.category | human }}</vc-chip> }</td>
                  <td><vc-chip [tone]="p.scenario === 'baseline' ? 'outline' : 'forest'">{{ p.scenario | human }}</vc-chip></td>
                  <td class="num nowrap">{{ p.quantity !== null ? (p.quantity | num: 2) : '—' }} @if (p.quantity !== null) { <span class="subtle">{{ p.unit }}</span> }</td>
                  <td><vc-chip [tone]="p.source === 'partner' ? 'violet' : p.source === 'import' ? 'sky' : 'outline'">{{ src(p.source) }}</vc-chip></td>
                  <td>
                    @if (p.missing_evidence) { <vc-badge status="warning">Missing</vc-badge> }
                    @else if (p.evidence_ids.length) { <span class="ev"><vc-icon name="file-check" [size]="14" />{{ p.evidence_ids.length }}</span> }
                    @else { <span class="subtle">—</span> }
                  </td>
                  <td>
                    @if (p.status === 'voided') { <vc-badge status="voided" /> }
                    @else if (p.version > 1) { <span class="ver" title="Corrected">v{{ p.version }} · corrected</span> }
                    @else { <span class="subtle small">v1</span> }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        @if (total() > rows().length && !missingOnly()) {
          <div class="card-foot"><span class="subtle small grow">Showing {{ rows().length }} of {{ total() }}</span><button class="btn btn-secondary btn-sm" (click)="more()">Load more</button></div>
        }
      }
    </section>

    <vc-practice-form [(open)]="formOpen" [fields]="allFields()" [cropNames]="cropNames()" [record]="correcting()" [presetFieldId]="presetField()" (saved)="onSaved($event)" />
    <vc-practice-drawer [(open)]="drawerOpen" [recordId]="recordId()" [fields]="allFields()" [types]="types()" [refresh]="refreshN()"
      (correct)="startCorrect($event)" (changed)="load()" />
  `,
  styles: [`
    .summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:16px}
    @media (max-width: 900px){.summary{grid-template-columns:repeat(2,minmax(0,1fr))}}
    .s{display:flex;flex-direction:column;gap:4px;padding:14px 16px;border-radius:var(--radius);background:var(--surface);border:1px solid var(--border);box-shadow:var(--shadow-sm);text-align:left;font:inherit}
    .s .l{display:flex;gap:6px;align-items:center;font-size:12.5px;color:var(--text-2)} .s .v{font-size:22px;font-weight:600;letter-spacing:-.01em}
    button.s{cursor:pointer} button.s:disabled{cursor:default}
    .s.warn .v{color:var(--amber-600)} .s.warn .l{color:var(--amber-600)}
    .s.warn.on{background:var(--warn-soft);border-color:#f1dcae;box-shadow:0 0 0 1px #e6c47c inset}
    .filters{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;align-items:center}
    .filters select{width:200px} .filters select.sm{width:150px}
    .dates{display:flex;gap:6px;align-items:center} .dates .input{width:150px}
    .scope{display:inline-flex;align-items:center;gap:7px;font-size:13px;color:var(--stone-700);cursor:pointer;white-space:nowrap}
    .scope input{accent-color:var(--primary);width:15px;height:15px}
    .code{font-size:12px;font-weight:600} .nm{max-width:160px}
    .pn{font-weight:500;margin-bottom:3px}
    .ev{display:inline-flex;gap:4px;align-items:center;color:var(--forest-600);font-size:12.5px}
    .ver{font-size:12px;color:var(--sky-600);white-space:nowrap}
    tr.voided td{color:var(--text-3)} tr.voided .pn{text-decoration:line-through}
    .grow{margin-right:auto}
  `],
})
export class PracticesPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);

  items = signal<Practice[]>([]);
  total = signal(0);
  loading = signal(true);
  error = signal<string | null>(null);
  allFields = signal<FieldLite[]>([]);
  projectFieldIds = signal<Set<string> | null>(null);
  types = signal<PracticeType[]>([]);
  crops = signal<Crop[]>([]);

  projectOnly = signal(true);
  fieldId = signal('');
  code = signal('');
  scenario = signal('');
  from = signal('');
  to = signal('');
  voided = signal(false);
  missingOnly = signal(false);
  limit = signal(200);

  formOpen = signal(false);
  correcting = signal<Practice | null>(null);
  presetField = signal<string | null>(null);
  drawerOpen = signal(false);
  recordId = signal<string | null>(null);
  refreshN = signal(0);

  cropNames = computed(() => new Map(this.crops().map(c => [c.code, c.name])));
  fields = computed(() => {
    const ids = this.projectFieldIds();
    return this.projectOnly() && ids ? this.allFields().filter(f => ids.has(f.id)) : this.allFields();
  });
  rows = computed(() => (this.missingOnly() ? this.items().filter(p => p.missing_evidence) : this.items()));
  missingCount = computed(() => this.items().filter(p => p.missing_evidence).length);
  hasFilters = computed(() => !!(this.fieldId() || this.code() || this.scenario() || this.from() || this.to() || this.voided()));

  constructor() {
    this.api.get<Page<FieldRec>>('/fields', { limit: 500 }).subscribe({ next: r => this.allFields.set(r.items) });
    this.api.get<PracticeType[]>('/catalogue/practice-types', { include_inactive: true }).subscribe({ next: r => this.types.set(r) });
    this.api.get<Crop[]>('/catalogue/crops', { include_inactive: true }).subscribe({ next: r => this.crops.set(r) });

    const qp = this.route.snapshot.queryParamMap;
    if (qp.get('field_id')) { this.fieldId.set(qp.get('field_id')!); this.projectOnly.set(false); }
    if (qp.get('record_id')) this.openRecord(qp.get('record_id')!);
    if (qp.get('record')) { this.presetField.set(qp.get('field_id')); this.formOpen.set(true); }

    effect(() => {
      if (this.drawerOpen()) return;
      untracked(() => {
        if (this.route.snapshot.queryParamMap.has('record_id')) {
          this.router.navigate([], { queryParams: { record_id: null }, queryParamsHandling: 'merge', replaceUrl: true });
        }
      });
    });
    effect(() => {
      const pid = this.ctx.currentId();
      if (!pid) return;
      this.api.get<Page<FieldRec>>('/fields', { project_id: pid, limit: 500 }).subscribe({
        next: r => this.projectFieldIds.set(new Set(r.items.map(f => f.id))),
      });
    });
    effect(() => {
      this.projectOnly(); this.fieldId(); this.code(); this.scenario(); this.from(); this.to(); this.voided(); this.limit();
      this.ctx.currentId();
      this.load();
    });
  }

  load() {
    const pid = this.projectOnly() ? this.ctx.currentId() : null;
    if (this.projectOnly() && !pid && !this.ctx.loaded()) return;
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Page<Practice>>('/practices', {
      project_id: pid, field_id: this.fieldId(), practice_code: this.code(), scenario: this.scenario(),
      date_from: this.from(), date_to: this.to(), include_voided: this.voided() || undefined, limit: this.limit(),
    }).subscribe({
      next: r => { this.items.set(r.items); this.total.set(r.total); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  more() { this.limit.set(Math.min(500, this.limit() + 200)); }
  countBy(s: string) { return this.items().filter(p => p.scenario === s && p.status !== 'voided').length; }
  fieldOf(id: string) { return this.allFields().find(f => f.id === id) ?? null; }
  typeOf(code: string) { return this.types().find(t => t.code === code) ?? null; }
  src(s: string) { return SOURCE_LABEL[s] ?? s; }

  clear() {
    this.fieldId.set(''); this.code.set(''); this.scenario.set(''); this.from.set(''); this.to.set('');
    this.voided.set(false); this.missingOnly.set(false);
  }

  openCreate() {
    this.correcting.set(null);
    this.presetField.set(this.fieldId() || null);
    this.formOpen.set(true);
  }

  openRecord(id: string) {
    this.recordId.set(id);
    this.drawerOpen.set(true);
    this.router.navigate([], { queryParams: { record_id: id }, queryParamsHandling: 'merge', replaceUrl: true });
  }

  startCorrect(p: Practice) {
    this.correcting.set(p);
    this.drawerOpen.set(false);
    this.formOpen.set(true);
  }

  onSaved(p: Practice) {
    const corr = !!this.correcting();
    this.toast.success(corr ? `Correction saved as version ${p.version}` : 'Practice recorded',
      p.missing_evidence ? 'Flagged: required evidence is missing.' : undefined);
    this.correcting.set(null);
    this.load();
    this.refreshN.update(n => n + 1);
    this.openRecord(p.record_id);
  }
}
