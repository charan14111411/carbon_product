import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Callout, Empty, ErrorBox, Loading, Modal } from '../../ui/kit';
import { People, openBlob } from '../calculations/calc.types';
import { BaselineSchema } from './baseline-data';
import { ActivityPage, Attestation, FieldLite } from './baseline.types';

const LANGS: { code: string; label: string }[] = [
  { code: 'en', label: 'English' }, { code: 'kn', label: 'Kannada' }, { code: 'hi', label: 'Hindi' }, { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' }, { code: 'mr', label: 'Marathi' }, { code: 'ml', label: 'Malayalam' },
];
const METHODS: { key: 'otp' | 'esign' | 'assisted'; label: string; text: string }[] = [
  { key: 'otp', label: 'SMS code', text: 'The farmer reads back the one-time code sent to their registered phone.' },
  { key: 'esign', label: 'E-sign', text: 'The farmer signs electronically on this device.' },
  { key: 'assisted', label: 'Assisted', text: 'You read the statement to the farmer and sign as witness.' },
];

@Component({
  selector: 'vc-attestations-tab',
  imports: [FormsModule, Icon, Callout, Empty, ErrorBox, Loading, Modal, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-callout tone="info" icon="info" class="mb">
      VM0042 Box 1: qualitative baseline information — and any value taken from the farmer’s memory (tier 3) or a regional census (tier 4) — needs the farmer’s
      <strong>signed attestation</strong>. The PDF lists every look-back record for the chosen years, so record the values first, then sign.
    </vc-callout>
    <section class="card">
      @if (loading()) { <vc-loading [rows]="5" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load attestations" [message]="error()!" /></div> }
      @else if (!rows().length) {
        <vc-empty icon="pen-line" title="No attestations signed yet" text="When a field's look-back years are recorded, the farmer signs a statement that they are a true account.">
          @if (canWrite()) { <button class="btn btn-primary" (click)="startCreate()"><vc-icon name="pen-line" />New attestation</button> }
        </vc-empty>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Field</th><th>Years attested</th><th>Signed by</th><th>Language</th><th class="num">Records</th><th class="num">Declarations</th><th>Signed</th><th></th></tr></thead>
            <tbody>
              @for (a of rows(); track a.id) {
                <tr>
                  <td><strong>{{ fieldCode(a.field_id) }}</strong><div class="subtle small">{{ fieldName(a.field_id) }}</div></td>
                  <td><span class="yrs">@for (y of a.years; track y) { <span class="y num">{{ y }}</span> }</span></td>
                  <td><span class="m">{{ methodLabel(a.method) }}</span>@if (a.witness_user_id) { <div class="subtle small">witness {{ people.name(a.witness_user_id) }}</div> }</td>
                  <td>{{ langLabel(a.statement_lang) }}</td>
                  <td class="num">{{ a.records.length }}</td>
                  <td class="num">{{ a.declarations.length }}</td>
                  <td class="nowrap small">{{ a.created_at | day: true }}<div class="subtle">{{ people.name(a.created_by) }}</div></td>
                  <td class="num"><button class="btn btn-secondary btn-sm" (click)="openPdf(a)"><vc-icon name="file" [size]="14" />Open PDF</button></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <vc-modal [(open)]="formOpen" title="New farmer attestation" subtitle="The farmer confirms the look-back management of one field for the chosen years." width="600px">
      <div class="stack">
        <div class="field">
          <label for="at-f">Field</label>
          <select id="at-f" class="input" [ngModel]="fieldId()" (ngModelChange)="pickField($event)">
            <option value="">Choose a field…</option>
            @for (f of fields(); track f.id) { <option [value]="f.id">{{ f.code }} · {{ f.name }}</option> }
          </select>
        </div>
        @if (fieldId()) {
          <div class="field">
            <label>Look-back years</label>
            @if (yearsLoading()) { <vc-loading [rows]="1" /> }
            @else if (!yearOptions().length) {
              <p class="hint">This field has no baseline look-back records yet. Record them under Activity records first so they appear in the signed statement.</p>
            } @else {
              <div class="ychips">
                @for (y of yearOptions(); track y.year) {
                  <button type="button" class="yc" [class.on]="years().includes(y.year)" (click)="toggleYear(y.year)">
                    <strong class="num">{{ y.year }}</strong><span>{{ y.n }} record{{ y.n === 1 ? '' : 's' }}</span>
                  </button>
                }
              </div>
              <span class="hint">{{ years().length }} selected · covers {{ recordsCovered() }} record{{ recordsCovered() === 1 ? '' : 's' }}.</span>
            }
          </div>
          <div class="form-grid">
            <div class="field">
              <label for="at-l">Statement read in</label>
              <select id="at-l" class="input" [(ngModel)]="lang">@for (l of langs; track l.code) { <option [value]="l.code">{{ l.label }}</option> }</select>
            </div>
          </div>
          <div class="field">
            <label>How the farmer signs</label>
            <div class="methods">
              @for (m of methods; track m.key) {
                <button type="button" class="mt" [class.on]="method() === m.key" (click)="method.set(m.key)"><strong>{{ m.label }}</strong><span>{{ m.text }}</span></button>
              }
            </div>
          </div>
          @if (method() === 'otp') {
            <div class="field otp">
              <label for="at-o">Code from the farmer’s SMS</label>
              <input id="at-o" class="input num" inputmode="numeric" maxlength="6" [(ngModel)]="otp" placeholder="6 digits" />
              <span class="hint">Demo environment: SMS isn’t connected, so the code is always <code>123456</code>.</span>
            </div>
          }
          @if (method() === 'assisted') { <vc-callout tone="warn" icon="user-check">You will be recorded as the witness. Read the statement to the farmer in {{ langLabel(lang) }} before signing.</vc-callout> }
          <div class="stmt small">
            <div class="label">Statement</div>
            “I confirm that the land-management activities listed below are a true and complete account of how this field was managed in the years stated,
            to the best of my knowledge. I understand that this statement will be used to set the baseline for a soil-carbon project under Verra VM0042
            and may be checked by an independent verifier against other evidence.”
          </div>
        }
        @if (formError()) { <vc-callout tone="danger" icon="alert">{{ formError() }}</vc-callout> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="formOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!valid() || busy()" (click)="sign()"><vc-icon name="pen-line" />{{ busy() ? 'Signing…' : 'Sign attestation' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .mb{display:flex;margin-bottom:16px}
    .yrs{display:inline-flex;gap:4px;flex-wrap:wrap}
    .y{font-size:12px;padding:1px 7px;border-radius:5px;background:var(--sand-100);border:1px solid var(--border)}
    .m{font-weight:500}
    .ychips{display:flex;gap:6px;flex-wrap:wrap}
    .yc{display:flex;flex-direction:column;align-items:flex-start;padding:8px 12px;border:1px solid var(--border-strong);border-radius:var(--radius-sm);background:var(--surface);font:inherit;cursor:pointer;min-width:88px}
    .yc span{font-size:11.5px;color:var(--text-3)}
    .yc.on{border-color:var(--forest-500);box-shadow:0 0 0 1px var(--forest-500) inset;background:var(--forest-50)}
    .methods{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
    @media (max-width: 640px){.methods{grid-template-columns:1fr}}
    .mt{display:flex;flex-direction:column;gap:3px;text-align:left;padding:10px 12px;border:1px solid var(--border-strong);border-radius:var(--radius-sm);background:var(--surface);font:inherit;cursor:pointer}
    .mt span{font-size:12px;color:var(--text-2);line-height:1.4}
    .mt.on{border-color:var(--forest-500);box-shadow:0 0 0 1px var(--forest-500) inset;background:var(--forest-50)}
    .otp .input{max-width:160px;font-size:18px;letter-spacing:.2em}
    .stmt{padding:12px 14px;border-radius:var(--radius-sm);background:var(--surface-2);border:1px solid var(--border);color:var(--stone-700);line-height:1.55}
  `],
})
export class AttestationsTab {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private schema = inject(BaselineSchema);
  people = inject(People);
  projectId = input.required<string>();
  fields = input<FieldLite[]>([]);
  active = input(false);
  canWrite = input(false);

  rows = signal<Attestation[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  formOpen = signal(false);
  formError = signal<string | null>(null);
  busy = signal(false);
  fieldId = signal('');
  years = signal<number[]>([]);
  method = signal<'otp' | 'esign' | 'assisted'>('otp');
  yearOptions = signal<{ year: number; n: number }[]>([]);
  yearsLoading = signal(false);
  lang = 'en';
  otp = '';
  langs = LANGS;
  methods = METHODS;
  private loadedKey = '';

  recordsCovered = computed(() => this.yearOptions().filter(y => this.years().includes(y.year)).reduce((a, y) => a + y.n, 0));
  valid = () => !!this.fieldId() && this.years().length > 0 && (this.method() !== 'otp' || /^\d{6}$/.test(this.otp.trim()));

  constructor() {
    this.schema.load();
    this.people.load();
    effect(() => {
      const key = this.projectId() + ':' + this.fields().map(f => f.id).join(',');
      if (this.active() && key !== this.loadedKey) untracked(() => { this.loadedKey = key; this.load(); });
    });
  }

  load() {
    const fs = this.fields();
    this.loading.set(true);
    this.error.set(null);
    if (!fs.length) { this.rows.set([]); this.loading.set(false); return; }
    forkJoin(fs.map(f => this.api.get<Attestation[]>(`/projects/${this.projectId()}/fields/${f.id}/attestations`).pipe(catchError(() => of([] as Attestation[]))))).subscribe({
      next: lists => { this.rows.set(lists.flat().sort((a, b) => b.created_at.localeCompare(a.created_at))); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  startCreate() {
    this.formError.set(null);
    this.fieldId.set('');
    this.years.set([]);
    this.yearOptions.set([]);
    this.method.set('otp');
    this.otp = '';
    this.lang = 'en';
    this.formOpen.set(true);
  }

  pickField(id: string) {
    this.fieldId.set(id);
    this.years.set([]);
    this.yearOptions.set([]);
    if (!id) return;
    this.yearsLoading.set(true);
    this.api.get<ActivityPage>('/activity-records', { project_id: this.projectId(), field_id: id, scenario: 'baseline', limit: 1000 }).subscribe({
      next: p => {
        const m = new Map<number, number>();
        for (const r of p.items) m.set(r.year, (m.get(r.year) ?? 0) + 1);
        const opts = [...m.entries()].sort((a, b) => a[0] - b[0]).map(([year, n]) => ({ year, n }));
        this.yearOptions.set(opts);
        this.years.set(opts.map(o => o.year));
        this.yearsLoading.set(false);
      },
      error: () => this.yearsLoading.set(false),
    });
  }

  toggleYear(y: number) { this.years.update(ys => (ys.includes(y) ? ys.filter(x => x !== y) : [...ys, y].sort())); }

  sign() {
    this.busy.set(true);
    this.formError.set(null);
    this.api.post<Attestation>(`/projects/${this.projectId()}/fields/${this.fieldId()}/attestations`, {
      years: this.years(), statement_lang: this.lang, method: this.method(), otp_code: this.method() === 'otp' ? this.otp.trim() : null, declarations: [],
    }).subscribe({
      next: a => {
        this.busy.set(false);
        this.formOpen.set(false);
        this.rows.update(r => [a, ...r]);
        this.toast.success('Attestation signed', `${this.fieldCode(a.field_id)} · ${a.years.join(', ')}. Link it to tier 3 or 4 records.`);
      },
      error: (e: ApiError) => { this.busy.set(false); this.formError.set(e.message); },
    });
  }

  openPdf(a: Attestation) {
    this.api.blob(`/evidence/${a.evidence_id}/content`).subscribe({ next: b => openBlob(b), error: (e: ApiError) => this.toast.apiError(e, "Couldn't open the PDF") });
  }

  fieldCode(id: string) { return this.fields().find(f => f.id === id)?.code ?? id.slice(0, 8); }
  fieldName(id: string) { return this.fields().find(f => f.id === id)?.name ?? ''; }
  langLabel(c: string) { return LANGS.find(l => l.code === c)?.label ?? c; }
  methodLabel(m: string) { return METHODS.find(x => x.key === m)?.label ?? m; }
}
