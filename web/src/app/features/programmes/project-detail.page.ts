import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, debounceTime, of, Subject, switchMap } from 'rxjs';
import { ApiError, ApiService, Page } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, HumanPipe, NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, Empty, ErrorBox, Loading, Modal, PageHeader, Stat } from '../../ui/kit';
import { ConfirmDialog } from './confirm';
import { CHECK_LABELS, EligibilityCheck, Enrolment, FieldLite, Programme, Project, PROJECT_NEXT, RulePackLite } from './types';

type Transition = (typeof PROJECT_NEXT)[string][number];

/** Shows each eligibility check with pass / fail and its message. */
@Component({
  selector: 'vc-checks',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (c of checks(); track c.code) {
      <div class="chk" [class.bad]="!c.passed">
        <span class="ic"><vc-icon [name]="c.passed ? 'check' : 'x'" [size]="13" [stroke]="2.4" /></span>
        <div><strong>{{ label(c.code) }}</strong><p>{{ c.message }}</p></div>
      </div>
    } @empty { <p class="subtle small">No eligibility checks recorded.</p> }
  `,
  styles: [`
    :host{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px}
    .chk{display:flex;gap:10px;padding:10px 12px;border-radius:8px;background:var(--surface);border:1px solid var(--border)}
    .ic{flex:none;display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:var(--forest-100);color:var(--forest-700);margin-top:1px}
    .bad{border-color:#f3c7c3;background:#fffafa} .bad .ic{background:var(--red-100);color:var(--red-600)}
    strong{font-size:13px;font-weight:600} p{font-size:12.5px;color:var(--stone-600);margin-top:2px;line-height:1.45}
  `],
})
export class Checks {
  checks = input<EligibilityCheck[]>([]);
  label(c: string) { return CHECK_LABELS[c] ?? c.replace(/_/g, ' '); }
}

@Component({
  selector: 'vc-project-detail',
  imports: [FormsModule, RouterLink, PageHeader, Loading, ErrorBox, Empty, Badge, Modal, Stat, Icon, Callout, DataClass,
    ConfirmDialog, Checks, NumPipe, DayPipe, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (programme(); as prog) {
      <a class="back" [routerLink]="['/app/programmes', prog.id]"><vc-icon name="arrow-left" [size]="15" />{{ prog.name }}</a>
    } @else { <a class="back" routerLink="/app/programmes"><vc-icon name="arrow-left" [size]="15" />Programmes</a> }

    @if (loading()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load this project" [message]="error()!" />
    } @else if (p(); as p) {
      <vc-page-header [title]="p.name" [eyebrow]="'Project · ' + p.code">
        <div actions class="hacts">
          <vc-badge [status]="p.status" />
          @if (ctx.currentId() !== p.id) {
            <button class="btn btn-secondary" (click)="ctx.select(p.id)"><vc-icon name="target" />Work on this project</button>
          } @else {
            <span class="current"><vc-icon name="check-circle" [size]="15" />Current project</span>
          }
          @if (canStatus) {
            @for (t of transitions(); track t.to) {
              <button class="btn" [class.btn-primary]="t.tone === 'primary'" [class.btn-secondary]="t.tone === 'danger'"
                (click)="askStatus(t)"><vc-icon [name]="t.icon" />{{ t.label }}</button>
            }
          }
        </div>
      </vc-page-header>

      <div class="layout">
        <section class="card facts">
          <div class="card-head"><h3>Key facts</h3></div>
          <div class="card-body">
            <dl class="kv">
              <dt>Programme</dt>
              <dd>@if (programme(); as prog) { <a [routerLink]="['/app/programmes', prog.id]">{{ prog.name }}</a> } @else { — }</dd>
              <dt>Methodology</dt><dd class="mono">{{ p.methodology_code }} v{{ p.methodology_version }}</dd>
              <dt>Rule pack</dt>
              <dd>
                @if (pack(); as rp) {
                  <a routerLink="/app/methodology">{{ rp.title }}</a>
                  <div class="row" style="--gap:6px;margin-top:4px"><span class="small subtle">rev {{ rp.revision }}</span><vc-badge [status]="rp.status" /></div>
                } @else if (p.rule_pack_id) { <a routerLink="/app/methodology">View rule pack</a> }
                @else { <span class="warnText">Not assigned</span> <a class="small" routerLink="/app/methodology">Choose in Methodology</a> }
              </dd>
              <dt>Baseline from</dt><dd>{{ p.baseline_start | day }}</dd>
              <dt>Crediting period</dt><dd>{{ p.crediting_start | day }} – {{ p.crediting_end | day }}</dd>
              <dt>Created</dt><dd>{{ p.created_at | day }}</dd>
            </dl>
          </div>
        </section>
        <div class="grid grid-2 kpis">
          <vc-stat label="Fields enrolled" [value]="counts().enrolled" icon="check-circle" [hint]="(counts().farmers) + ' farmers'" />
          <vc-stat label="Area enrolled" [value]="counts().area | num: 1" unit="ha" icon="layers" />
          <vc-stat label="Awaiting confirmation" [value]="counts().eligible" icon="clock" hint="Passed every check" />
          <vc-stat label="Ineligible" [value]="counts().ineligible" icon="x-circle" hint="At least one check failed" />
        </div>
      </div>

      <section class="card">
        <div class="card-head">
          <h3>Enrolments</h3>
          <div class="seg">
            @for (s of statusTabs; track s) {
              <button type="button" [class.on]="filter() === s" (click)="filter.set(s)">{{ s === 'all' ? 'All' : (s | human) }}</button>
            }
          </div>
          @if (canEnrol && p.status !== 'closed') {
            <button class="btn btn-primary btn-sm" (click)="openEnrol()"><vc-icon name="plus" />Enrol a field</button>
          }
        </div>
        @if (enrolLoading()) {
          <vc-loading [rows]="4" />
        } @else if (enrolError()) {
          <div class="card-body"><vc-error title="Couldn't load enrolments" [message]="enrolError()!" /></div>
        } @else if (!enrolments().length) {
          <vc-empty icon="map" title="No fields enrolled yet"
            text="Enrolling runs every eligibility check — area, crop, land-use history, double enrolment and farmer consent — and records the result.">
            @if (canEnrol && p.status !== 'closed') { <button class="btn btn-primary" (click)="openEnrol()"><vc-icon name="plus" />Enrol a field</button> }
          </vc-empty>
        } @else if (!shown().length) {
          <vc-empty icon="filter" title="Nothing with this status" />
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th style="width:28px"></th><th>Field</th><th>Farmer</th><th class="num">Area</th><th>Checks</th><th>Status</th><th>Enrolled</th><th></th></tr></thead>
              <tbody>
                @for (e of shown(); track e.id) {
                  <tr class="clickable" (click)="toggle(e.id)">
                    <td><vc-icon [name]="open() === e.id ? 'chevron-down' : 'chevron-right'" [size]="15" class="subtle" /></td>
                    <td><a class="mono" [routerLink]="['/app/fields', e.field_id]" (click)="$event.stopPropagation()">{{ e.field_code }}</a></td>
                    <td><a [routerLink]="['/app/farmers', e.farmer_id]" (click)="$event.stopPropagation()">{{ e.farmer_name }}</a></td>
                    <td class="num nowrap">{{ e.field_area_ha | num: 2 }} ha</td>
                    <td>
                      @let c = checkCount(e);
                      <span class="pill" [class.bad]="c.failed > 0">{{ c.passed }}/{{ c.total }} passed</span>
                    </td>
                    <td><vc-badge [status]="e.status" /></td>
                    <td class="nowrap">{{ e.enrolled_on | day }}</td>
                    <td class="num nowrap" (click)="$event.stopPropagation()">
                      @if (canEnrol) {
                        @if (e.status === 'eligible') {
                          <button class="btn btn-primary btn-sm" (click)="askConfirm(e)">Confirm</button>
                        }
                        @if (e.status === 'ineligible' || e.status === 'pending') {
                          <button class="btn btn-secondary btn-sm" (click)="recheck(e)" [disabled]="busy()"><vc-icon name="refresh" [size]="14" />Re-check</button>
                        }
                        @if (e.status === 'enrolled' || e.status === 'eligible') {
                          <button class="btn btn-ghost btn-sm" (click)="askWithdraw(e)">Withdraw</button>
                        }
                      }
                    </td>
                  </tr>
                  @if (open() === e.id) {
                    <tr class="expand"><td></td><td colspan="7">
                      <div class="exp">
                        <div class="exp-h"><span>Eligibility checks</span>
                          @if (e.eligibility.decided_at) { <span class="subtle small">Checked {{ e.eligibility.decided_at | day: true }}</span> }
                          <vc-dc cls="DERIVED" />
                        </div>
                        <vc-checks [checks]="e.eligibility.checks ?? []" />
                        @if (e.eligibility.withdrawal; as w) {
                          <vc-callout tone="info" icon="undo">Withdrawn on {{ w.on | day }}: {{ w.reason }}</vc-callout>
                        }
                      </div>
                    </td></tr>
                  }
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    }

    <!-- status change -->
    <vc-confirm [(open)]="statusOpen" [title]="pendingStatus()?.label ?? ''" [message]="pendingStatus()?.text ?? ''"
      [confirmLabel]="pendingStatus()?.label ?? 'Confirm'" [tone]="pendingStatus()?.tone ?? 'primary'" [icon]="pendingStatus()?.icon ?? ''"
      [reason]="pendingStatus()?.reason ?? 'none'" reasonPlaceholder="Why is the status changing?" [busy]="busy()"
      (confirmed)="applyStatus($event)" />

    <!-- confirm enrolment -->
    <vc-confirm [(open)]="confirmOpen" title="Confirm enrolment" confirmLabel="Confirm enrolment" icon="check" [busy]="busy()"
      [message]="'Every eligibility check is run again before confirming. ' + (target()?.field_code ?? '') + ' (' + (target()?.farmer_name ?? '') + ') will count towards this project from today.'"
      (confirmed)="confirmEnrolment()" />

    <!-- withdraw -->
    <vc-confirm [(open)]="withdrawOpen" title="Withdraw field" confirmLabel="Withdraw" tone="danger" icon="undo" reason="required"
      reasonLabel="Reason for withdrawal" reasonPlaceholder="For example: farmer sold the land, or the crop changed." [busy]="busy()"
      [message]="(target()?.field_code ?? '') + ' will stop counting towards this project. Its history stays on record.'"
      (confirmed)="withdraw($event)" />

    <!-- enrol a field -->
    <vc-modal [(open)]="enrolOpen" title="Enrol a field" [subtitle]="result() ? 'Eligibility result' : 'Pick a field that isn’t in this project yet. Every eligibility check runs straight away.'" width="680px">
      @if (result(); as r) {
        <div class="stack" style="--gap:14px">
          <div class="res" [class.ok]="r.status === 'eligible'">
            <vc-icon [name]="r.status === 'eligible' ? 'check-circle' : 'x-circle'" [size]="22" />
            <div>
              <strong>{{ r.field_code }} is {{ r.status === 'eligible' ? 'eligible' : 'not eligible' }}</strong>
              <p>{{ r.status === 'eligible' ? 'Confirm the enrolment to count it towards this project.' : 'Fix the failed checks, then re-check it from the enrolments table.' }}</p>
            </div>
          </div>
          <vc-checks [checks]="r.eligibility.checks ?? []" />
        </div>
      } @else {
        <div class="search">
          <vc-icon name="search" [size]="15" />
          <input class="input" placeholder="Search by field code or name…" [ngModel]="q()" (ngModelChange)="search($event)" />
        </div>
        <div class="fieldlist">
          @if (fieldsLoading()) { <vc-loading [rows]="4" /> }
          @else if (!candidates().length) {
            <vc-empty icon="map" title="No fields available" text="Every matching field is already in this project, or no fields have been mapped yet. Map fields under Fields & map." />
          } @else {
            @for (f of candidates(); track f.id) {
              <button type="button" class="fopt" [class.on]="pick()?.id === f.id" (click)="pick.set(f)">
                <span class="radio"></span>
                <span class="fl"><strong>{{ f.name }}</strong><span class="mono small subtle">{{ f.code }}</span></span>
                <span class="small muted">{{ f.crop_code ?? 'No crop' }}</span>
                <span class="num small">{{ f.area_ha | num: 2 }} ha</span>
              </button>
            }
          }
        </div>
      }
      <ng-container footer>
        @if (result(); as r) {
          <button class="btn btn-secondary" (click)="enrolOpen.set(false)">Close</button>
          @if (r.status === 'eligible') { <button class="btn btn-primary" (click)="enrolOpen.set(false); askConfirm(r)"><vc-icon name="check" />Confirm enrolment</button> }
        } @else {
          <button class="btn btn-secondary" (click)="enrolOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" [disabled]="!pick() || busy()" (click)="enrol()">{{ busy() ? 'Checking…' : 'Check eligibility' }}</button>
        }
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .hacts{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .back{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-2);margin-bottom:14px}
    .back:hover{color:var(--forest-700);text-decoration:none}
    .current{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 12px;border-radius:6px;background:var(--forest-50);color:var(--forest-700);font-size:13px;font-weight:500}
    .layout{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:16px;margin-bottom:16px}
    @media (max-width:1100px){.layout{grid-template-columns:1fr}}
    .kpis{align-content:start}
    .warnText{color:var(--amber-600);font-weight:500;margin-right:6px}
    .seg{display:inline-flex;padding:2px;gap:2px;background:var(--surface-2);border:1px solid var(--border);border-radius:8px}
    .seg button{height:26px;padding:0 10px;border:0;background:none;border-radius:6px;font:500 12.5px var(--font);color:var(--stone-600);cursor:pointer}
    .seg button.on{background:var(--surface);color:var(--forest-700);box-shadow:var(--shadow-sm)}
    .pill{display:inline-flex;height:22px;align-items:center;padding:0 8px;border-radius:5px;background:var(--forest-50);color:var(--forest-700);font-size:12px;font-variant-numeric:tabular-nums}
    .pill.bad{background:var(--red-100);color:var(--red-600)}
    tr.expand td{background:var(--surface-2);padding-top:4px}
    .exp{display:flex;flex-direction:column;gap:10px;padding:4px 0 8px}
    .exp-h{display:flex;align-items:center;gap:10px;font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--stone-600)}
    td .btn + .btn{margin-left:6px}
    .search{position:relative;margin-bottom:12px}
    .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)}
    .search .input{padding-left:34px}
    .fieldlist{display:flex;flex-direction:column;gap:6px;max-height:48vh;overflow:auto}
    .fopt{display:grid;grid-template-columns:18px 1fr auto 80px;align-items:center;gap:12px;padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:var(--surface);font:inherit;text-align:left;cursor:pointer}
    .fopt:hover{border-color:var(--stone-400)}
    .fopt.on{border-color:var(--forest-500);background:var(--forest-50);box-shadow:inset 0 0 0 1px var(--forest-500)}
    .fopt .num{text-align:right}
    .radio{width:16px;height:16px;border-radius:50%;border:1.5px solid var(--stone-400)}
    .fopt.on .radio{border:5px solid var(--forest-600)}
    .fl{display:flex;flex-direction:column}
    .res{display:flex;gap:12px;align-items:flex-start;padding:14px 16px;border-radius:10px;background:var(--red-100);color:var(--red-600);border:1px solid #f3c7c3}
    .res.ok{background:var(--forest-50);color:var(--forest-600);border-color:var(--forest-200)}
    .res strong{color:var(--stone-900);font-size:15px} .res p{color:var(--stone-700);font-size:13px;margin-top:2px}
  `],
})
export class ProjectDetailPage {
  id = input.required<string>();
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  ctx = inject(ProjectContext);
  canStatus = this.auth.can('programmes.manage');
  canEnrol = this.auth.can('land.manage');

  p = signal<Project | null>(null);
  programme = signal<Programme | null>(null);
  pack = signal<RulePackLite | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  enrolments = signal<Enrolment[]>([]);
  enrolLoading = signal(true);
  enrolError = signal<string | null>(null);
  filter = signal('all');
  statusTabs = ['all', 'enrolled', 'eligible', 'ineligible', 'withdrawn'];
  shown = computed(() => (this.filter() === 'all' ? this.enrolments() : this.enrolments().filter(e => e.status === this.filter())));
  open = signal<string | null>(null);
  transitions = computed(() => PROJECT_NEXT[this.p()?.status ?? ''] ?? []);
  counts = computed(() => {
    const es = this.enrolments();
    const enrolled = es.filter(e => e.status === 'enrolled');
    return {
      enrolled: enrolled.length,
      farmers: new Set(enrolled.map(e => e.farmer_id)).size,
      area: enrolled.reduce((a, e) => a + (e.field_area_ha || 0), 0),
      eligible: es.filter(e => e.status === 'eligible').length,
      ineligible: es.filter(e => e.status === 'ineligible').length,
    };
  });

  busy = signal(false);
  statusOpen = signal(false);
  pendingStatus = signal<Transition | null>(null);
  target = signal<Enrolment | null>(null);
  confirmOpen = signal(false);
  withdrawOpen = signal(false);

  enrolOpen = signal(false);
  q = signal('');
  fields = signal<FieldLite[]>([]);
  fieldsLoading = signal(false);
  pick = signal<FieldLite | null>(null);
  result = signal<Enrolment | null>(null);
  private search$ = new Subject<string>();
  candidates = computed(() => {
    const taken = new Set(this.enrolments().filter(e => e.status !== 'withdrawn').map(e => e.field_id));
    return this.fields().filter(f => !taken.has(f.id) && f.status === 'active');
  });

  constructor() {
    this.search$.pipe(
      debounceTime(250),
      switchMap(q => {
        this.fieldsLoading.set(true);
        return this.api.get<Page<FieldLite>>('/fields', { q, limit: 100 }).pipe(catchError(() => of({ items: [], total: 0 })));
      }),
    ).subscribe(r => { this.fields.set(r.items); this.fieldsLoading.set(false); });
  }

  ngOnInit() {
    this.load();
    this.loadEnrolments();
  }

  load() {
    this.loading.set(true);
    this.api.get<Project>(`/projects/${this.id()}`).subscribe({
      next: p => {
        this.p.set(p);
        this.loading.set(false);
        this.api.get<Programme>(`/programmes/${p.programme_id}`).pipe(catchError(() => of(null))).subscribe(x => this.programme.set(x));
        if (p.rule_pack_id) {
          this.api.get<RulePackLite>(`/rule-packs/${p.rule_pack_id}`).pipe(catchError(() => of(null))).subscribe(x => this.pack.set(x));
        }
      },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  loadEnrolments() {
    this.enrolError.set(null);
    this.api.get<Enrolment[]>(`/projects/${this.id()}/enrolments`).subscribe({
      next: r => { this.enrolments.set(r); this.enrolLoading.set(false); },
      error: (e: ApiError) => { this.enrolError.set(e.message); this.enrolLoading.set(false); },
    });
  }

  toggle(id: string) { this.open.set(this.open() === id ? null : id); }

  checkCount(e: Enrolment) {
    const c = e.eligibility?.checks ?? [];
    const passed = c.filter(x => x.passed).length;
    return { passed, failed: c.length - passed, total: c.length };
  }

  askStatus(t: Transition) { this.pendingStatus.set(t); this.statusOpen.set(true); }

  applyStatus(reason: string) {
    const t = this.pendingStatus();
    if (!t) return;
    this.busy.set(true);
    this.api.post<Project>(`/projects/${this.id()}/status`, { status: t.to, reason: reason || null }).subscribe({
      next: p => {
        this.busy.set(false);
        this.statusOpen.set(false);
        this.p.set(p);
        this.ctx.load();
        this.toast.success('Project status changed', `${p.code} is now ${p.status}.`);
      },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e, "Couldn't change the status"); },
    });
  }

  private upsert(e: Enrolment) {
    const list = this.enrolments();
    this.enrolments.set(list.some(x => x.id === e.id) ? list.map(x => (x.id === e.id ? e : x)) : [e, ...list]);
  }

  askConfirm(e: Enrolment) { this.target.set(e); this.confirmOpen.set(true); }
  askWithdraw(e: Enrolment) { this.target.set(e); this.withdrawOpen.set(true); }

  confirmEnrolment() {
    const e = this.target();
    if (!e) return;
    this.busy.set(true);
    this.api.post<Enrolment>(`/projects/${this.id()}/enrolments/${e.id}/confirm`).subscribe({
      next: r => { this.busy.set(false); this.confirmOpen.set(false); this.upsert(r); this.toast.success('Field enrolled', `${r.field_code} now counts towards this project.`); },
      error: (err: ApiError) => {
        this.busy.set(false);
        this.confirmOpen.set(false);
        this.toast.apiError(err, "Couldn't confirm the enrolment");
        this.loadEnrolments();
      },
    });
  }

  withdraw(reason: string) {
    const e = this.target();
    if (!e) return;
    this.busy.set(true);
    this.api.post<Enrolment>(`/projects/${this.id()}/enrolments/${e.id}/withdraw`, { reason }).subscribe({
      next: r => { this.busy.set(false); this.withdrawOpen.set(false); this.upsert(r); this.toast.success('Field withdrawn', `${r.field_code} was withdrawn.`); },
      error: (err: ApiError) => { this.busy.set(false); this.toast.apiError(err, "Couldn't withdraw the field"); },
    });
  }

  recheck(e: Enrolment) {
    this.busy.set(true);
    this.api.post<Enrolment>(`/projects/${this.id()}/enrolments`, { field_id: e.field_id }).subscribe({
      next: r => {
        this.busy.set(false);
        this.upsert(r);
        this.open.set(r.id);
        if (r.status === 'eligible') this.toast.success('Now eligible', `${r.field_code} passes every check. Confirm to enrol it.`);
        else this.toast.info('Still not eligible', `${r.field_code} fails at least one check.`);
      },
      error: (err: ApiError) => { this.busy.set(false); this.toast.apiError(err, "Couldn't re-check the field"); },
    });
  }

  openEnrol() {
    this.result.set(null);
    this.pick.set(null);
    this.q.set('');
    this.enrolOpen.set(true);
    this.search$.next('');
  }

  search(q: string) { this.q.set(q); this.search$.next(q.trim()); }

  enrol() {
    const f = this.pick();
    if (!f) return;
    this.busy.set(true);
    this.api.post<Enrolment>(`/projects/${this.id()}/enrolments`, { field_id: f.id }).subscribe({
      next: r => { this.busy.set(false); this.result.set(r); this.upsert(r); },
      error: (err: ApiError) => { this.busy.set(false); this.toast.apiError(err, "Couldn't check this field"); },
    });
  }
}
