import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { apiMessage } from '../credits/credit-ui';
import { KINDS, Policy, RETENTION, RETENTION_ORDER, RetentionReport, kindIcon, kindLabel } from './doc-types';

/* ------------------------------------------------------------------ retention report */
@Component({
  selector: 'vcx-retention-report',
  imports: [...KIT, FormsModule, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-callout tone="ok" icon="lock" class="imm"><strong>Nothing is ever deleted automatically.</strong> Evidence files are immutable and fingerprinted.
      This report only shows how long each document must be kept; disposing of anything after its date needs a separate, recorded decision.</vc-callout>

    <div class="sum">
      @for (k of order; track k) {
        <button type="button" class="sc" [class]="(rep()?.counts?.[k] ?? 0) ? 't-' + k : ''" [class.on]="status() === k" (click)="status.set(status() === k ? '' : k)" [title]="meta(k).hint">
          <span>{{ meta(k).label }}</span><strong class="num">{{ rep()?.counts?.[k] ?? 0 }}</strong></button>
      }
      <div class="win"><label for="wd" class="small">Expiring window</label>
        <select id="wd" class="input" [ngModel]="within()" (ngModelChange)="within.set(+$event); load()"><option [value]="90">90 days</option><option [value]="365">1 year</option><option [value]="730">2 years</option><option [value]="1825">5 years</option></select></div>
    </div>

    <section class="card">
      @if (loading() && !rep()) { <vc-loading [rows]="5" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load the retention report" [message]="error()!" /></div> }
      @else if (!rows().length) {
        <vc-empty icon="archive" [title]="rep()?.items?.length ? 'No documents with this status' : 'No documents yet'" text="Controlled documents and their retention dates appear here." />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Document</th><th>Kind</th><th>Retention</th><th>Keep until</th><th>How it was worked out</th></tr></thead>
            <tbody>
              @for (i of rows(); track i.document_id) {
                <tr [class.clickable]="clickable" (click)="clickable && open.emit(i.document_id)">
                  <td><div class="dt"><span class="mono small subtle">{{ i.code }}</span><strong>{{ i.title }}</strong></div></td>
                  <td class="nowrap"><vc-icon [name]="icon(i.kind)" [size]="13" class="subtle" /> {{ kl(i.kind) }}</td>
                  <td><vc-badge [status]="meta(i.status).badge">{{ meta(i.status).label }}</vc-badge></td>
                  <td class="nowrap">{{ i.retain_until ? (i.retain_until | day) : '—' }}</td>
                  <td class="small basis">{{ i.basis || i.reason || '—' }}@if (i.policy) { <span class="src">{{ i.policy.source }}</span> }</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="small subtle foot">As of {{ rep()?.as_of | day }}. {{ rep()?.note }}</p>
      }
    </section>
  `,
  styles: [`
    .imm{margin-bottom:14px}
    .sum{display:grid;grid-template-columns:repeat(5,minmax(0,1fr)) 160px;gap:10px;margin-bottom:14px;align-items:stretch}
    @media (max-width:1000px){.sum{grid-template-columns:repeat(3,1fr)}}
    .sc{display:flex;flex-direction:column;align-items:flex-start;padding:10px 14px;border:1px solid var(--border);border-radius:10px;background:var(--surface);font:inherit;cursor:pointer;text-align:left}
    .sc span{font-size:12.5px;color:var(--text-2)} .sc strong{font-size:22px;font-weight:600}
    .sc.on{border-color:var(--forest-400);box-shadow:inset 0 0 0 1px var(--forest-400)}
    .sc.t-expiring strong{color:var(--amber-600)} .sc.t-no_policy strong,.sc.t-undetermined strong{color:var(--red-600)} .sc.t-retain strong{color:var(--forest-700)}
    .win{display:flex;flex-direction:column;gap:4px;justify-content:flex-end}
    .dt{display:flex;flex-direction:column;line-height:1.35}
    .basis{max-width:420px;color:var(--stone-700)} .src{display:block;color:var(--text-3);margin-top:2px}
    .foot{padding:10px 20px;border-top:1px solid var(--border)}
  `],
})
export class RetentionReportTab {
  private api = inject(ApiService);
  open = output<string>();
  clickable = inject(AuthService).profile()?.role !== 'client_viewer';
  order = RETENTION_ORDER;
  rep = signal<RetentionReport | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  status = signal('');
  within = signal(365);
  rows = computed(() => (this.rep()?.items ?? []).filter(i => !this.status() || i.status === this.status()));

  constructor() { this.load(); }
  load() {
    this.loading.set(true);
    this.api.get<RetentionReport>('/documents/retention', { within_days: this.within() }).subscribe({
      next: r => { this.rep.set(r); this.loading.set(false); this.error.set(null); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
  meta(k: string) { return RETENTION[k] ?? { label: k, badge: k, hint: '' }; }
  kl = kindLabel;
  icon = kindIcon;
}

/* ------------------------------------------------------------------ policies */
@Component({
  selector: 'vcx-retention-policies',
  imports: [...KIT, FormsModule, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted">How long each kind of document is kept. The most specific active policy applies: one set on the document, then its kind, then the default for all kinds.
        VM0042 v2.2 §9.3 requires project records to be kept at least <strong>2 years after the end of the last crediting period</strong>.</p>
      <span class="spacer"></span>
      @if (canManage) {
        <button class="btn btn-secondary" [disabled]="busy()" (click)="install()"><vc-icon name="download" />Install default policy</button>
        <button class="btn btn-primary" (click)="openNew()"><vc-icon name="plus" />New policy</button>
      }
    </div>

    <section class="card">
      @if (loading() && !all().length) { <vc-loading [rows]="4" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load retention policies" [message]="error()!" /></div> }
      @else if (!all().length) {
        <vc-empty icon="archive" title="No retention policies" text="Install the default: every document kept until 2 years after the project's crediting period ends (VM0042 §9.3).">
          @if (canManage) { <button class="btn btn-primary" (click)="install()"><vc-icon name="download" />Install default policy</button> }
        </vc-empty>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Applies to</th><th>Rule</th><th>Source</th><th>Status</th><th>Created</th><th></th></tr></thead>
            <tbody>
              @for (p of all(); track p.id) {
                <tr [class.retired]="p.status === 'retired'">
                  <td><strong>{{ kl(p.kind) }}</strong></td>
                  <td>{{ rule(p) }}</td>
                  <td class="small src">{{ p.source }}@if (p.notes) { <span class="subtle">{{ p.notes }}</span> }</td>
                  <td><vc-badge [status]="p.status" /></td>
                  <td class="nowrap subtle">{{ p.created_at | day }}</td>
                  <td class="num nowrap">@if (canManage) {
                    @if (p.status === 'active') { <button class="btn btn-ghost btn-sm" [disabled]="busy()" (click)="setStatus(p, 'retired')">Retire</button> }
                    @else { <button class="btn btn-ghost btn-sm" [disabled]="busy()" (click)="setStatus(p, 'active')">Reactivate</button> } }</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <vc-modal [(open)]="formOpen" title="New retention policy" width="520px" subtitle="Replaces any active policy for the same kind.">
      <div class="form-grid">
        <div class="field span-2"><label for="pk">Applies to</label>
          <select id="pk" class="input" [(ngModel)]="f.kind"><option value="*">All kinds (default)</option>@for (k of kinds; track k.key) { <option [value]="k.key">{{ k.label }}</option> }</select></div>
        <div class="field"><label for="pr">Counted from</label>
          <select id="pr" class="input" [(ngModel)]="f.rule"><option value="after_crediting_end">End of the project's crediting period</option><option value="fixed_years">The document's latest version</option></select></div>
        <div class="field"><label for="py">Years</label><input id="py" type="number" min="0" max="100" class="input num" [(ngModel)]="f.years" />
          @if (f.rule === 'after_crediting_end' && f.years < 2) { <span class="error">At least 2 years after crediting ends (VM0042 §9.3).</span> }</div>
        <div class="field span-2"><label for="ps">Source</label><input id="ps" class="input" [(ngModel)]="f.source" placeholder="e.g. Income Tax Act s.44AA — 8 years" /><span class="hint">The rule, law or contract clause this comes from.</span></div>
        <div class="field span-2"><label for="pn">Notes</label><input id="pn" class="input" [(ngModel)]="f.notes" /></div>
        @if (formError()) { <div class="span-2"><vc-error title="Not saved" [message]="formError()!" /></div> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="formOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || f.source.trim().length < 3 || (f.rule === 'after_crediting_end' && f.years < 2)" (click)="save()">Create policy</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;gap:10px;align-items:flex-start;margin-bottom:14px;flex-wrap:wrap} .bar p{max-width:760px}
    .src{max-width:380px} .src span{display:block;margin-top:2px}
    tr.retired td{color:var(--text-3)}
  `],
})
export class RetentionPoliciesTab {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  ctx = inject(ProjectContext);
  canManage = inject(AuthService).can('programmes.manage');
  changed = output<void>();
  kinds = KINDS;
  all = signal<Policy[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  busy = signal(false);
  formOpen = signal(false);
  formError = signal<string | null>(null);
  f = { kind: '*', rule: 'after_crediting_end', years: 2, source: '', notes: '' };

  constructor() { this.load(); }
  load() {
    this.loading.set(true);
    this.api.get<Policy[]>('/documents/retention-policies').subscribe({
      next: r => { this.all.set([...r].sort((a, b) => Number(a.status !== 'active') - Number(b.status !== 'active'))); this.loading.set(false); this.error.set(null); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
  kl = kindLabel;
  rule(p: Policy) { return p.rule === 'after_crediting_end' ? `${p.years} year${p.years === 1 ? '' : 's'} after crediting ends` : `${p.years} year${p.years === 1 ? '' : 's'} after the latest version`; }
  install() {
    this.busy.set(true);
    this.api.post<{ installed: number }>('/documents/retention-policies/install-defaults').subscribe({
      next: r => { this.busy.set(false); r.installed ? this.toast.success('Default policy installed', 'Crediting end + 2 years, for every kind of document.') : this.toast.info('Already installed', 'An active default policy exists.'); this.load(); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e); },
    });
  }
  openNew() { this.f = { kind: '*', rule: 'after_crediting_end', years: 2, source: '', notes: '' }; this.formError.set(null); this.formOpen.set(true); }
  save() {
    this.busy.set(true);
    this.formError.set(null);
    this.api.post<Policy>('/documents/retention-policies', { ...this.f, years: Number(this.f.years), source: this.f.source.trim() }).subscribe({
      next: () => { this.busy.set(false); this.formOpen.set(false); this.toast.success('Policy created'); this.load(); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.formError.set(apiMessage(e)); },
    });
  }
  setStatus(p: Policy, status: 'active' | 'retired') {
    this.busy.set(true);
    this.api.patch<Policy>(`/documents/retention-policies/${p.id}`, { status }).subscribe({
      next: () => { this.busy.set(false); this.toast.success(status === 'retired' ? 'Policy retired' : 'Policy reactivated'); this.load(); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e); },
    });
  }
}
