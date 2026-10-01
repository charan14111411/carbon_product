import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, forkJoin, map, of, shareReplay } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { Steps, apiMessage } from '../credits/credit-ui';
import { Remote } from '../supporting/shared';
import { CommitmentsEditor, blankCommitment, commitmentsPayload } from './commitments-editor';
import {
  COMPLIANCE, COMPLIANCE_ORDER, Commitment, Plan, PlanCompliance, PLAN_STEPS, PLAN_STEP_LABELS, PracticeCatalogue,
  ProjectCompliance, YearStatus,
} from './plan-types';

interface Enrolment { id: string; field_id: string; field_code: string; field_area_ha: number; farmer_id: string; farmer_name: string; status: string }
interface Cell { met: number; partially: number; not_met: number; upcoming: number; total: number }

@Component({
  selector: 'vc-interventions-page',
  imports: [...KIT, FormsModule, DayPipe, Steps, CommitmentsEditor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Intervention plans" eyebrow="Programmes"
      subtitle="What each farmer commits to do on each enrolled field, their agreement, and how recorded practices compare with the plan year by year.">
      @if (canWrite && ctx.currentId()) { <ng-container actions>
        <button class="btn btn-secondary" [disabled]="detecting()" (click)="detect()"><vc-icon name="radar" />{{ detecting() ? 'Checking…' : 'Detect deviations' }}</button>
        <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New plan</button>
      </ng-container> }
    </vc-page-header>

    @if (!ctx.currentId()) {
      <div class="card"><vc-empty icon="briefcase" title="Choose a project" text="Intervention plans belong to a project. Pick one in the top bar." /></div>
    } @else {
      @if (comp.error()) {
        <vc-error title="Couldn't load compliance" [message]="comp.error()!.message" style="margin-bottom:16px" />
      } @else if (comp.data(); as c) {
        <div class="grid grid-4 kpis">
          <vc-stat label="Active plans" [value]="c.plans_by_status['active'] ?? 0" icon="clipboard-check" [hint]="(c.plans_by_status['agreed'] ?? 0) + ' agreed, waiting to activate · ' + (c.plans_by_status['draft'] ?? 0) + ' draft'" />
          <vc-stat label="Commitments met" [value]="metPct(c)" unit="%" icon="check-circle" [hint]="evaluated(c) + ' commitments with a past year to judge'" />
          <vc-stat label="Plans with a missed year" [value]="c.plans_with_not_met" icon="alert" hint="At least one commitment not done at all in a finished year" />
          <vc-stat label="Open deviations" [value]="c.open_deviations" icon="flag" hint="Waiting to be acknowledged or closed" />
        </div>

        <section class="card matrix">
          <div class="card-head">
            <h3>Compliance by practice and year</h3>
            <vc-dc cls="DERIVED" />
            <div class="legend">@for (s of order; track s) { <span><i [style.background]="meta(s).color"></i>{{ meta(s).label }}</span> }</div>
          </div>
          @if (matrix.loading() && !matrix.data()) { <vc-loading [rows]="4" /> }
          @else if (!matrixRows().length) {
            <vc-empty icon="list-checks" title="Nothing to compare yet" text="Compliance appears once a plan is agreed or active. Each year is judged against the practice records on the plan's field." />
          } @else {
            <div class="table-wrap">
              <table class="table mx">
                <thead><tr><th>Practice</th>@for (y of years(); track y) { <th class="yc">{{ y }}</th> }</tr></thead>
                <tbody>
                  @for (r of matrixRows(); track r.code) {
                    <tr>
                      <td><strong>{{ cat.name(r.code) }}</strong><span class="subtle small"> · {{ r.plans }} plan{{ r.plans === 1 ? '' : 's' }}</span></td>
                      @for (y of years(); track y) {
                        <td class="yc">
                          @if (r.cells[y]; as cell) {
                            <div class="stack-bar" [title]="cellTitle(cell, y)">
                              @for (s of order; track s) { @if (cell[s]) { <span [style.flex-grow]="cell[s]" [style.background]="meta(s).color"></span> } }
                            </div>
                            <span class="small cv num">@if (cell.total - cell.upcoming) { {{ cell.met }}/{{ cell.total - cell.upcoming }} met } @else { {{ cell.upcoming }} to come }</span>
                          } @else { <span class="subtle small">—</span> }
                        </td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <p class="basis small subtle">Each cell counts plans with that practice in that year; the figure is how many met it out of those that can be judged. The current year only turns red at year end — nothing recorded yet is shown as upcoming.
              @if (capped()) { Showing the first {{ cap }} plans. }</p>
          }
        </section>
      }

      <div class="filters">
        <div class="search"><vc-icon name="search" [size]="15" />
          <input class="input" placeholder="Search by plan code, farmer or field…" [ngModel]="q()" (ngModelChange)="q.set($event)" /></div>
        <div class="seg">
          @for (f of statusFilters; track f.key) {
            <button type="button" [class.on]="status() === f.key" (click)="status.set(f.key)">{{ f.label }}<span class="c num">{{ countStatus(f.key) }}</span></button>
          }
        </div>
        <label class="checkbox"><input type="checkbox" [ngModel]="showOld()" (ngModelChange)="showOld.set($event)" />Show earlier versions</label>
      </div>

      <section class="card">
        @if (plans.loading() && !plans.data()) { <vc-loading [rows]="6" /> }
        @else if (plans.error()) { <div class="card-body"><vc-error title="Couldn't load plans" [message]="plans.error()!.message" /></div> }
        @else if (!rows().length) {
          <vc-empty icon="clipboard-check" [title]="(plans.data() ?? []).length ? 'No matching plans' : 'No intervention plans yet'"
            [text]="(plans.data() ?? []).length ? 'Try a different search or status.' : 'Create a plan for an enrolled field: pick the practices the farmer commits to, then record their agreement.'">
            @if (!(plans.data() ?? []).length && canWrite) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New plan</button> }
          </vc-empty>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Plan</th><th>Farmer</th><th>Field</th><th>Progress</th><th>Compliance</th><th>Agreement</th><th>Created</th><th></th></tr></thead>
              <tbody>
                @for (p of rows(); track p.id) {
                  <tr class="clickable" (click)="router.navigate(['/app/interventions', p.id])">
                    <td><span class="mono strong">{{ p.code }}</span> <span class="ver">v{{ p.version }}</span></td>
                    <td>{{ p.farmer?.name ?? '—' }} <span class="mono subtle small">{{ p.farmer?.code }}</span></td>
                    <td class="mono">{{ p.field_code ?? '—' }}</td>
                    <td>@if (['withdrawn', 'superseded'].includes(p.status)) { <vc-badge [status]="p.status" /> }
                      @else { <vcx-steps [steps]="steps" [labels]="stepLabels" [current]="p.status" [compact]="true" [offPath]="[]" /> }</td>
                    <td>@if (overall(p.id); as o) { <span class="cp" [style.background]="meta(o).soft" [style.color]="meta(o).text">{{ meta(o).label }}</span> } @else { <span class="subtle small">—</span> }</td>
                    <td class="small">@if (p.agreed_method) { {{ p.agreed_method === 'otp' ? 'SMS code' : 'Assisted, witnessed' }} · {{ p.agreed_at | day }} } @else { <span class="subtle">Not yet</span> }</td>
                    <td class="nowrap subtle">{{ p.created_at | day }}</td>
                    <td class="num"><vc-icon name="chevron-right" class="subtle" /></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    }

    <vc-modal [(open)]="createOpen" [drawer]="true" width="640px" title="New intervention plan" [subtitle]="ctx.current()?.name ?? ''">
      <form class="stack" id="planCreate" (ngSubmit)="create()">
        <div class="field"><label for="pe">Enrolled field</label>
          <select id="pe" class="input" name="pe" [ngModel]="cEnrol()" (ngModelChange)="cEnrol.set($event)">
            <option value="">Choose a field…</option>
            @for (e of freeEnrolments(); track e.id) { <option [value]="e.id">{{ e.field_code }} · {{ e.farmer_name }} · {{ e.field_area_ha.toFixed(2) }} ha{{ e.status === 'eligible' ? ' (eligible, not yet enrolled)' : '' }}</option> }
          </select>
          <span class="hint">@if (enrolments.loading()) { Loading enrolments… } @else { Fields that are eligible or enrolled and don't already have an open plan. {{ takenCount() }} already have one. }</span></div>
        @if (chosen(); as e) {
          <div class="who"><vc-icon name="user" [size]="15" /><span><strong>{{ e.farmer_name }}</strong> will be asked to agree to this plan.</span>
            @if (cropOf(e.field_id); as crop) { <span class="spacer"></span><span class="tag">Crop: {{ crop }}</span> }</div>
        }
        <div class="field"><label>What the farmer commits to</label>
          <vcx-commitments-editor [(rows)]="cRows" [cropCode]="chosen() ? cropOf(chosen()!.field_id) : null" /></div>
        <div class="field"><label for="pn">Notes <span class="subtle">(optional)</span></label>
          <textarea id="pn" class="input" name="pn" rows="3" [(ngModel)]="cNotes" placeholder="Context for the farmer and field officer, e.g. support offered."></textarea></div>
        <vc-callout tone="info" icon="info">The plan starts as a draft. Next, the farmer agrees — by SMS code or in person with a staff witness — and then a second staff member activates it.</vc-callout>
        @if (formError()) { <vc-error title="Plan not created" [message]="formError()!" /> }
      </form>
      <ng-container footer>
        <button class="btn btn-ghost" type="button" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="planCreate" [disabled]="saving() || !cEnrol() || !validRows()">{{ saving() ? 'Creating…' : 'Create draft plan' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .kpis{margin-bottom:16px} .kpis vc-stat{box-shadow:none}
    .matrix{margin-bottom:20px}
    .legend{display:flex;gap:12px;font-size:12px;color:var(--text-2);flex-wrap:wrap}
    .legend span{display:inline-flex;align-items:center;gap:5px} .legend i{width:10px;height:10px;border-radius:2px}
    .mx td,.mx th{padding:10px 12px} .yc{text-align:center;min-width:92px}
    .stack-bar{display:flex;gap:2px;height:10px;border-radius:5px;overflow:hidden;background:var(--sand-100);width:72px;margin:0 auto}
    .stack-bar span{flex-basis:0;min-width:3px}
    .cv{display:block;margin-top:4px;color:var(--text-2)}
    .basis{padding:10px 20px 14px;border-top:1px solid var(--border)}
    .filters{display:flex;gap:12px;margin-bottom:14px;flex-wrap:wrap;align-items:center}
    .search{position:relative;flex:1;min-width:220px;max-width:380px}
    .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)} .search .input{padding-left:34px}
    .seg{display:inline-flex;background:var(--surface);border:1px solid var(--border-strong);border-radius:8px;padding:3px;gap:2px;flex-wrap:wrap}
    .seg button{border:0;background:none;font:500 13px var(--font);padding:6px 12px;border-radius:6px;color:var(--stone-600);cursor:pointer;display:inline-flex;gap:6px;align-items:center}
    .seg button.on{background:var(--forest-50);color:var(--forest-700);box-shadow:inset 0 0 0 1px var(--forest-200)}
    .seg .c{font-size:11px;color:var(--text-3)}
    .strong{font-weight:600} .ver{font:600 11px var(--mono);color:var(--text-3);background:var(--sand-100);padding:1px 5px;border-radius:4px}
    .cp{display:inline-block;font-size:12px;font-weight:500;padding:2px 9px;border-radius:999px}
    .who{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:8px;background:var(--forest-50);color:var(--forest-800);font-size:13.5px}
    .tag{font-size:12px;padding:2px 8px;border-radius:4px;background:var(--surface);border:1px solid var(--forest-200)}
  `],
})
export class InterventionsPage {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  cat = inject(PracticeCatalogue);
  ctx = inject(ProjectContext);
  router = inject(Router);
  canWrite = this.auth.can('farmers.manage', 'practice.record');
  steps = PLAN_STEPS;
  stepLabels = PLAN_STEP_LABELS;
  order = COMPLIANCE_ORDER;
  cap = 80;

  comp = new Remote<ProjectCompliance>();
  plans = new Remote<Plan[]>();
  matrix = new Remote<PlanCompliance[]>();
  enrolments = new Remote<Enrolment[]>();
  crops = signal<Map<string, string | null>>(new Map());

  q = signal('');
  status = signal('');
  showOld = signal(false);
  detecting = signal(false);
  statusFilters = [
    { key: '', label: 'All' }, { key: 'draft', label: 'Draft' }, { key: 'agreed', label: 'Agreed' },
    { key: 'active', label: 'Active' }, { key: 'completed', label: 'Completed' }, { key: 'withdrawn', label: 'Withdrawn' },
  ];

  private latestOnly = computed(() => {
    const all = this.plans.data() ?? [];
    if (this.showOld()) return all;
    const last = new Map<string, Plan>();
    for (const p of all) if (!last.has(p.plan_id) || p.version > last.get(p.plan_id)!.version) last.set(p.plan_id, p);
    return all.filter(p => last.get(p.plan_id)?.id === p.id);
  });
  rows = computed(() => {
    const q = this.q().trim().toLowerCase();
    return this.latestOnly().filter(p => (!this.status() || p.status === this.status()) &&
      (!q || `${p.code} ${p.farmer?.name ?? ''} ${p.farmer?.code ?? ''} ${p.field_code ?? ''}`.toLowerCase().includes(q)));
  });
  private overallMap = computed(() => new Map((this.comp.data()?.plans ?? []).map(r => [r.plan_row_id, r.overall])));
  capped = computed(() => (this.comp.data()?.plans.length ?? 0) > this.cap);

  years = computed(() => {
    const ys = new Set<number>();
    for (const pc of this.matrix.data() ?? []) for (const c of pc.commitments) for (const y of c.years) ys.add(y.year);
    return [...ys].sort().slice(-8);
  });
  matrixRows = computed(() => {
    const by = new Map<string, { code: string; plans: Set<string>; cells: Record<number, Cell> }>();
    for (const pc of this.matrix.data() ?? []) {
      for (const c of pc.commitments) {
        const code = c.commitment.practice_code;
        const r = by.get(code) ?? { code, plans: new Set<string>(), cells: {} };
        r.plans.add(pc.plan_row_id);
        for (const y of c.years) {
          const cell = r.cells[y.year] ?? { met: 0, partially: 0, not_met: 0, upcoming: 0, total: 0 };
          cell[y.status]++;
          cell.total++;
          r.cells[y.year] = cell;
        }
        by.set(code, r);
      }
    }
    return [...by.values()].map(r => ({ code: r.code, plans: r.plans.size, cells: r.cells })).sort((a, b) => b.plans - a.plans);
  });

  // create
  createOpen = signal(false);
  saving = signal(false);
  formError = signal<string | null>(null);
  cEnrol = signal('');
  cRows: Commitment[] = [blankCommitment()];
  cNotes = '';
  private openFields = computed(() => new Set((this.plans.data() ?? []).filter(p => ['draft', 'agreed', 'active'].includes(p.status)).map(p => p.field_id)));
  freeEnrolments = computed(() => (this.enrolments.data() ?? []).filter(e => ['eligible', 'enrolled'].includes(e.status) && !this.openFields().has(e.field_id)));
  takenCount = computed(() => (this.enrolments.data() ?? []).filter(e => this.openFields().has(e.field_id)).length);
  chosen = computed(() => this.freeEnrolments().find(e => e.id === this.cEnrol()) ?? null);

  constructor() {
    this.cat.load();
    effect(() => {
      const pid = this.ctx.currentId();
      untracked(() => { if (pid) this.load(pid); });
    });
  }

  load(pid = this.ctx.currentId()!, keep = false) {
    this.plans.load(this.api.get<Plan[]>('/intervention-plans', { project_id: pid }), keep);
    const c$ = this.api.get<ProjectCompliance>(`/projects/${pid}/interventions/compliance`).pipe(shareReplay(1));
    this.comp.load(c$, keep);
    c$.subscribe({
      next: c => {
        const ids = c.plans.slice(0, this.cap).map(p => p.plan_row_id);
        this.matrix.load(ids.length ? forkJoin(ids.map(id => this.api.get<PlanCompliance>(`/intervention-plans/${id}/compliance`).pipe(catchError(() => of(null)))))
          .pipe(map(r => r.filter((x): x is PlanCompliance => !!x))) : of([]), keep);
      },
      error: () => this.matrix.load(of([])),
    });
  }

  meta(s: YearStatus) { return COMPLIANCE[s]; }
  overall(id: string) { return this.overallMap().get(id) ?? null; }
  evaluated(c: ProjectCompliance) { return (c.commitments_by_status['met'] ?? 0) + (c.commitments_by_status['partially'] ?? 0) + (c.commitments_by_status['not_met'] ?? 0); }
  metPct(c: ProjectCompliance) { const e = this.evaluated(c); return e ? Math.round(((c.commitments_by_status['met'] ?? 0) / e) * 100) : '—'; }
  cellTitle(c: Cell, y: number) { return `${y}: ${c.met} met, ${c.partially} partly, ${c.not_met} not met, ${c.upcoming} upcoming`; }
  countStatus(k: string) { return this.latestOnly().filter(p => !k || p.status === k).length; }
  cropOf(fieldId: string) { return this.crops().get(fieldId) ?? null; }
  validRows() { return this.cRows.some(c => c.practice_code) && this.cRows.every(c => !c.practice_code || c.end_year === null || (c.end_year as unknown) === '' || Number(c.end_year) >= Number(c.start_year)); }

  detect() {
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.detecting.set(true);
    this.api.post<{ created: number }>(`/projects/${pid}/interventions/detect-deviations`).subscribe({
      next: r => {
        this.detecting.set(false);
        if (r.created) this.toast.success(`${r.created} new deviation${r.created === 1 ? '' : 's'} recorded`, 'Open the plans with a missed year to acknowledge them.');
        else this.toast.info('No new deviations', 'Every finished year either met its commitments or already has a deviation on record.');
        this.load(pid, true);
      },
      error: (e: ApiError) => { this.detecting.set(false); this.toast.apiError(e, "Couldn't check for deviations"); },
    });
  }

  openCreate() {
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.cEnrol.set('');
    this.cRows = [blankCommitment()];
    this.cNotes = '';
    this.formError.set(null);
    this.enrolments.load(this.api.get<Enrolment[]>(`/projects/${pid}/enrolments`));
    this.api.get<{ items: { id: string; crop_code: string | null }[] }>('/fields', { project_id: pid, limit: 500 }).subscribe({
      next: r => this.crops.set(new Map(r.items.map(f => [f.id, f.crop_code]))), error: () => {},
    });
    this.createOpen.set(true);
  }

  create() {
    const pid = this.ctx.currentId();
    const e = this.chosen();
    if (!pid || !e) return;
    this.saving.set(true);
    this.formError.set(null);
    this.api.post<Plan>('/intervention-plans', { project_id: pid, field_id: e.field_id, notes: this.cNotes.trim(), commitments: commitmentsPayload(this.cRows) }).subscribe({
      next: p => { this.saving.set(false); this.createOpen.set(false); this.toast.success(`Plan ${p.code} created`, 'Next: record the farmer\'s agreement.'); this.router.navigate(['/app/interventions', p.id]); },
      error: (err: ApiError) => { this.saving.set(false); this.formError.set(apiMessage(err)); },
    });
  }
}
