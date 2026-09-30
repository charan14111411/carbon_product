import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe, NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { Icon } from '../../ui/icon';
import { Badge, DataClass, Empty, ErrorBox, Loading, PageHeader, TabItem, Tabs } from '../../ui/kit';
import { NewRun } from './new-run';
import { People, Readiness, RunSummary } from './calc.types';
import { ReadinessPanel } from './readiness-panel';
import { TermsTab } from './terms-tab';

@Component({
  selector: 'vc-calculations-page',
  imports: [PageHeader, Tabs, Icon, Badge, DataClass, Empty, ErrorBox, Loading, ReadinessPanel, TermsTab, NewRun, NumPipe, DayPipe, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Calculations" eyebrow="Carbon"
      [subtitle]="'Soil-carbon change, deductions and credits for ' + (ctx.current()?.name ?? 'the current project') + '. Every run freezes its inputs and rules, and needs a second person to approve it.'">
      <button actions class="btn btn-secondary" (click)="reload()"><vc-icon name="refresh" />Refresh</button>
      @if (auth.can('calc.run')) {
        <button actions class="btn btn-primary" (click)="setTab('new')"><vc-icon name="play" />New calculation</button>
      }
    </vc-page-header>

    @if (!ctx.currentId()) {
      <section class="card"><vc-empty icon="briefcase" title="Choose a project" text="Pick a project in the top bar to see its calculations." /></section>
    } @else {
      <vc-readiness-panel [data]="readiness()" [loading]="rLoading()" [error]="rError()" />

      <div class="tabs"><vc-tabs [tabs]="tabs()" [active]="tab()" (activeChange)="setTab($event)" /></div>

      @switch (tab()) {
        @case ('runs') {
          <section class="card">
            @if (loading()) {
              <vc-loading [rows]="6" />
            } @else if (error()) {
              <div class="card-body"><vc-error title="Couldn't load calculation runs" [message]="error()!" /></div>
            } @else if (!runs().length) {
              <vc-empty icon="calculator" title="No calculations yet"
                text="When baseline and monitoring samples have accepted lab results, run the first calculation for a monitoring period.">
                @if (auth.can('calc.run')) { <button class="btn btn-primary" (click)="setTab('new')"><vc-icon name="play" />New calculation</button> }
              </vc-empty>
            } @else {
              <div class="table-wrap">
                <table class="table">
                  <thead><tr>
                    <th>Period</th><th>Status</th>
                    <th class="num">Net credits</th><th class="num">Reductions</th><th class="num">Removals</th>
                    <th class="num">Uncertainty deduction</th><th class="num">Buffer</th>
                    <th>Created by</th><th>Created</th><th></th>
                  </tr></thead>
                  <tbody>
                    @for (r of runs(); track r.id) {
                      <tr class="clickable" (click)="open(r)">
                        <td>
                          <strong>{{ r.period_label }}</strong>
                          <div class="subtle small nowrap">{{ r.period_start | day }} – {{ r.period_end | day }}</div>
                        </td>
                        <td>
                          <vc-badge [status]="r.status" />
                          @if (r.flags['carbon_lost']) { <span class="flag danger" title="Soil carbon did not increase"><vc-icon name="trend-down" [size]="13" /></span> }
                          @if (r.flags['high_uncertainty']) { <span class="flag warn" title="High uncertainty"><vc-icon name="alert" [size]="13" /></span> }
                        </td>
                        <td class="num nowrap"><strong [class.neg]="r.net_t_co2e < 0">{{ r.net_t_co2e | num: 1 }}</strong>&nbsp;<span class="u">tCO₂e</span></td>
                        <td class="num nowrap">{{ r.reductions_t_co2e | num: 1 }} <span class="u">t</span></td>
                        <td class="num nowrap">{{ r.removals_t_co2e | num: 1 }} <span class="u">t</span></td>
                        <td class="num nowrap">{{ r.uncertainty_deduction_t_co2e | num: 1 }} <span class="u">t</span></td>
                        <td class="num nowrap">{{ r.buffer_t_co2e | num: 1 }} <span class="u">t</span></td>
                        <td class="nowrap">{{ people.name(r.created_by, 'System') }}</td>
                        <td class="nowrap"><span [title]="r.created_at | day: true">{{ r.created_at | ago }}</span></td>
                        <td class="go"><vc-icon name="chevron-right" [size]="16" /></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div class="card-foot foot">
                <vc-dc cls="CALCULATED" /><span class="subtle small">All figures are produced by the calculation engine (v{{ runs()[0].engine_version }}) from frozen inputs. Negative results are shown as measured, never floored.</span>
              </div>
            }
          </section>
        }
        @case ('terms') { <vc-terms-tab [projectId]="ctx.currentId()!" /> }
        @case ('new') { <vc-new-run [projectId]="ctx.currentId()!" [runs]="runs()" [supersedes]="supersedes()" /> }
      }
    }
  `,
  styles: [`
    .tabs{margin-top:24px}
    .u{font-size:11.5px;color:var(--text-3);margin-left:3px}
    .neg{color:var(--red-600)}
    .flag{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;margin-left:4px;vertical-align:middle}
    .flag.danger{background:var(--danger-soft);color:var(--red-600)} .flag.warn{background:var(--warn-soft);color:var(--amber-600)}
    .go{color:var(--text-3);width:32px}
    .foot{justify-content:flex-start}
  `],
})
export class CalculationsPage {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  people = inject(People);

  runs = signal<RunSummary[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  readiness = signal<Readiness | null>(null);
  rLoading = signal(true);
  rError = signal<string | null>(null);

  private qp = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  tab = computed(() => this.qp().get('tab') ?? 'runs');
  supersedes = computed(() => this.qp().get('supersedes'));

  tabs = computed<TabItem[]>(() => [
    { key: 'runs', label: 'Runs', count: this.loading() ? null : this.runs().length },
    { key: 'terms', label: 'Decided terms' },
    ...(this.auth.can('calc.run') ? [{ key: 'new', label: 'New calculation' }] : []),
  ]);

  constructor() {
    this.people.load();
    effect(() => {
      if (this.ctx.currentId()) this.reload();
    });
  }

  setTab(t: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { tab: t === 'runs' ? null : t, supersedes: null }, queryParamsHandling: 'merge' });
  }

  open(r: RunSummary) { this.router.navigate(['/app/calculations', r.id]); }

  reload() {
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.loading.set(true);
    this.error.set(null);
    this.api.get<RunSummary[]>(`/projects/${pid}/calculations`).subscribe({
      next: r => { this.runs.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
    this.rLoading.set(true);
    this.rError.set(null);
    this.api.get<Readiness>(`/projects/${pid}/readiness`).subscribe({
      next: r => { this.readiness.set(r); this.rLoading.set(false); },
      error: (e: ApiError) => { this.rError.set(e.message); this.rLoading.set(false); },
    });
  }
}
