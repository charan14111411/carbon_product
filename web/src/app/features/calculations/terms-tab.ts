import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Badge, Callout, DataClass, Empty, ErrorBox, Loading, Modal } from '../../ui/kit';
import { Icon } from '../../ui/icon';
import { People, TERM_HELP, TERM_LABELS, Term, termLabel } from './calc.types';

interface Group { period: string; rows: { current: Term; older: Term[] }[] }

@Component({
  selector: 'vc-terms-tab',
  imports: [FormsModule, Icon, Badge, DataClass, Empty, ErrorBox, Loading, Modal, Callout, NumPipe, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted small intro">
        Project-level terms are decided outside the soil sampling — from activity data, emission factors or models — and
        entered here with their variance and source. One person records an estimate and a methodology scientist approves it.
        Each change is a new version; the newest approved version is used.
      </p>
      @if (canCreate()) {
        <button class="btn btn-primary" (click)="startNew()"><vc-icon name="plus" />Record estimate</button>
      }
    </div>

    @if (loading()) {
      <section class="card"><vc-loading [rows]="5" /></section>
    } @else if (error()) {
      <vc-error title="Couldn't load decided terms" [message]="error()!" />
    } @else if (!groups().length) {
      <section class="card">
        <vc-empty icon="sigma" title="No term estimates yet"
          text="If the methodology rules require baseline emissions, project emissions or leakage, record the estimates here before running a calculation.">
          @if (canCreate()) { <button class="btn btn-primary" (click)="startNew()"><vc-icon name="plus" />Record estimate</button> }
        </vc-empty>
      </section>
    } @else {
      @for (g of groups(); track g.period) {
        <section class="card grp">
          <div class="card-head"><h3>Period {{ g.period }}</h3><span class="subtle small">{{ g.rows.length }} term(s)</span></div>
          <div class="table-wrap">
            <table class="table">
              <thead><tr>
                <th>Term</th><th>Version</th><th class="num">Value</th><th class="num">Variance</th><th class="num">df</th>
                <th>Source</th><th>Status</th><th>Recorded</th><th>Approved</th><th></th>
              </tr></thead>
              <tbody>
                @for (r of g.rows; track r.current.id) {
                  <tr>
                    <td class="nowrap"><strong class="tn">{{ label(r.current.term) }}</strong><span class="hi" [title]="help(r.current.term)"><vc-icon name="info" [size]="13" /></span></td>
                    <td class="nowrap">
                      v{{ r.current.version }}
                      @if (r.older.length) {
                        <button class="lnk" (click)="toggle(r.current.id)">{{ expanded().has(r.current.id) ? 'hide' : r.older.length + ' earlier' }}</button>
                      }
                    </td>
                    <td class="num nowrap"><strong>{{ r.current.value_t_co2e | num: 2 }}</strong>&nbsp;<span class="u">tCO₂e</span></td>
                    <td class="num nowrap">{{ r.current.variance | num: 3 }} <span class="u">(tCO₂e)²</span></td>
                    <td class="num">{{ r.current.df === null ? '—' : (r.current.df | num: 1) }}</td>
                    <td class="src"><span [title]="r.current.source">{{ r.current.source }}</span></td>
                    <td><vc-badge [status]="r.current.status" /></td>
                    <td class="nowrap small">{{ people.name(r.current.created_by, 'Unknown') }}<div class="subtle">{{ r.current.created_at | day }}</div></td>
                    <td class="nowrap small">
                      @if (r.current.approved_by) { {{ people.name(r.current.approved_by, 'Unknown') }}<div class="subtle">{{ r.current.approved_at | day }}</div> }
                      @else { <span class="subtle">—</span> }
                    </td>
                    <td class="nowrap">
                      @if (r.current.status === 'draft' && canApprove()) {
                        @if (isMine(r.current)) {
                          <span class="own" title="You recorded this estimate, so a colleague must approve it."><vc-icon name="lock" [size]="13" />Needs a colleague</span>
                        } @else {
                          <button class="btn btn-secondary btn-sm" (click)="approving.set(r.current)"><vc-icon name="check" [size]="14" />Approve</button>
                        }
                      }
                    </td>
                  </tr>
                  @if (expanded().has(r.current.id)) {
                    @for (o of r.older; track o.id) {
                      <tr class="old">
                        <td class="subtle small">↳ earlier version</td>
                        <td>v{{ o.version }}</td>
                        <td class="num">{{ o.value_t_co2e | num: 2 }} <span class="u">tCO₂e</span></td>
                        <td class="num">{{ o.variance | num: 3 }}</td>
                        <td class="num">{{ o.df === null ? '—' : (o.df | num: 1) }}</td>
                        <td class="src"><span [title]="o.source">{{ o.source }}</span></td>
                        <td><vc-badge [status]="o.status" /></td>
                        <td class="small">{{ people.name(o.created_by, 'Unknown') }}</td>
                        <td class="small">{{ o.approved_at | day }}</td>
                        <td></td>
                      </tr>
                    }
                  }
                }
              </tbody>
            </table>
          </div>
        </section>
      }
    }

    <!-- record estimate -->
    <vc-modal [(open)]="formOpen" title="Record a term estimate" subtitle="The estimate is saved as a draft and must be approved by a methodology scientist." width="620px">
      <div class="form-grid">
        <div class="field">
          <label>Monitoring period</label>
          <input class="input" [(ngModel)]="f.period_label" placeholder="e.g. 2025-26" maxlength="40" />
          <span class="hint">Must match the period label of the calculation.</span>
        </div>
        <div class="field">
          <label>Term</label>
          <select class="input" [(ngModel)]="f.term">
            @for (t of termKeys; track t) { <option [value]="t">{{ label(t) }}</option> }
          </select>
        </div>
        <div class="span-2"><vc-callout tone="info" icon="info">{{ help(f.term) }}</vc-callout></div>
        <div class="field">
          <label>Value (tCO₂e for the period)</label>
          <input class="input num" type="number" step="any" [(ngModel)]="f.value_t_co2e" />
        </div>
        <div class="field">
          <label>Variance ((tCO₂e)²)</label>
          <input class="input num" type="number" step="any" min="0" [(ngModel)]="f.variance" />
          <span class="hint">Square of the standard error. Use 0 only if the value is exact.</span>
        </div>
        <div class="field">
          <label>Degrees of freedom <span class="subtle">(optional)</span></label>
          <input class="input num" type="number" step="any" min="0" [(ngModel)]="f.df" />
          <span class="hint">Needed if the variance is above zero, for the uncertainty deduction.</span>
        </div>
        <div class="field span-2">
          <label>Source and method</label>
          <textarea class="input" [(ngModel)]="f.source" rows="3" placeholder="e.g. IPCC 2019 Tier 1 N₂O factors applied to farm fertiliser records, 42 farms; see calculation workbook v3"></textarea>
        </div>
        @if (formError()) { <div class="span-2"><vc-error title="Couldn't save" [message]="formError()!" /></div> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="formOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="saving() || !formValid()" (click)="save()">{{ saving() ? 'Saving…' : 'Save as draft' }}</button>
      </ng-container>
    </vc-modal>

    <!-- approve -->
    <vc-modal [open]="!!approving()" (closed)="approving.set(null)" title="Approve term estimate" width="520px">
      @if (approving(); as a) {
        <dl class="kv">
          <dt>Term</dt><dd>{{ label(a.term) }} · v{{ a.version }}</dd>
          <dt>Period</dt><dd>{{ a.period_label }}</dd>
          <dt>Value</dt><dd class="num">{{ a.value_t_co2e | num: 2 }} tCO₂e <vc-dc cls="RECORDED" /></dd>
          <dt>Variance · df</dt><dd class="num">{{ a.variance | num: 3 }} · {{ a.df ?? '—' }}</dd>
          <dt>Source</dt><dd>{{ a.source }}</dd>
          <dt>Recorded by</dt><dd>{{ people.name(a.created_by, 'Unknown') }} on {{ a.created_at | day }}</dd>
        </dl>
        <vc-callout tone="info" icon="users" style="margin-top:16px">
          Four-eyes rule: you can approve this because someone else recorded it. Approving replaces any earlier approved version for this period.
        </vc-callout>
      }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="approving.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="saving()" (click)="approve()"><vc-icon name="check" />Approve estimate</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;gap:16px;align-items:flex-start;margin-bottom:16px}
    .intro{flex:1;max-width:820px}
    .grp{margin-bottom:16px}
    .tn{font-weight:500}
    .hi{display:inline-flex;vertical-align:-2px;margin-left:6px;color:var(--text-3);cursor:help}
    .u{font-size:11.5px;color:var(--text-3);margin-left:3px}
    .src{max-width:260px} .src span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-2);font-size:13px}
    .lnk{border:0;background:none;color:var(--primary);font:inherit;font-size:12px;cursor:pointer;margin-left:6px;padding:0}
    .lnk:hover{text-decoration:underline}
    tr.old td{background:var(--surface-2);color:var(--text-2)}
    .own{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--text-3)}
  `],
})
export class TermsTab {
  projectId = input.required<string>();
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  people = inject(People);

  terms = signal<Term[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  expanded = signal(new Set<string>());
  approving = signal<Term | null>(null);
  formOpen = signal(false);
  saving = signal(false);
  formError = signal<string | null>(null);
  termKeys = Object.keys(TERM_LABELS);
  f = this.blank();

  canCreate = computed(() => this.auth.can('calc.run', 'rules.edit'));
  canApprove = computed(() => this.auth.can('rules.approve'));

  groups = computed<Group[]>(() => {
    const by = new Map<string, Map<string, Term[]>>();
    for (const t of this.terms()) {
      if (!by.has(t.period_label)) by.set(t.period_label, new Map());
      const m = by.get(t.period_label)!;
      if (!m.has(t.term)) m.set(t.term, []);
      m.get(t.term)!.push(t);
    }
    return [...by.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([period, m]) => ({
      period,
      rows: [...m.values()].map(list => {
        const sorted = [...list].sort((a, b) => b.version - a.version);
        return { current: sorted[0], older: sorted.slice(1) };
      }),
    }));
  });

  constructor() {
    this.people.load();
    effect(() => { if (this.projectId()) this.load(); });
  }

  label = termLabel;
  help(t: string) { return TERM_HELP[t] ?? ''; }
  isMine(t: Term) { return t.created_by === this.auth.profile()?.id; }
  toggle(id: string) {
    const s = new Set(this.expanded());
    s.has(id) ? s.delete(id) : s.add(id);
    this.expanded.set(s);
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Term[]>(`/projects/${this.projectId()}/terms`).subscribe({
      next: r => { this.terms.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  private blank() {
    return { period_label: '', term: 'baseline_emissions', value_t_co2e: null as number | null, variance: 0 as number | null, df: null as number | null, source: '' };
  }
  startNew() {
    this.f = this.blank();
    const latest = this.groups()[0]?.period;
    if (latest) this.f.period_label = latest;
    this.formError.set(null);
    this.formOpen.set(true);
  }
  formValid() {
    return this.f.period_label.trim() && this.f.value_t_co2e !== null && this.f.variance !== null && this.f.variance >= 0 && this.f.source.trim().length >= 5;
  }
  save() {
    this.saving.set(true);
    this.formError.set(null);
    const body = { ...this.f, period_label: this.f.period_label.trim(), df: this.f.df || null };
    this.api.post<Term>(`/projects/${this.projectId()}/terms`, body).subscribe({
      next: t => {
        this.saving.set(false);
        this.formOpen.set(false);
        this.terms.update(l => [...l, t]);
        this.toast.success('Estimate saved as draft', `${termLabel(t.term)} v${t.version} is waiting for approval.`);
      },
      error: (e: ApiError) => {
        this.saving.set(false);
        const fields = (e.details?.['fields'] as { field: string; message: string }[] | undefined) ?? [];
        this.formError.set(fields.length ? fields.map(x => `${x.field.replace(/_/g, ' ')}: ${x.message}`).join('. ') : e.message);
      },
    });
  }
  approve() {
    const a = this.approving();
    if (!a) return;
    this.saving.set(true);
    this.api.post<Term>(`/terms/${a.id}/approve`).subscribe({
      next: t => {
        this.saving.set(false);
        this.approving.set(null);
        // The approved version replaces any earlier approved one for the same period and term.
        this.terms.update(l => l.map(x => (x.id === t.id ? t
          : x.period_label === t.period_label && x.term === t.term && x.status === 'approved' ? { ...x, status: 'superseded' } : x)));
        this.toast.success('Estimate approved');
      },
      error: (e: ApiError) => {
        this.saving.set(false);
        this.toast.apiError(e, e.code === 'SELF_APPROVAL_REJECTED' ? 'You recorded this estimate' : "Couldn't approve");
      },
    });
  }
}
