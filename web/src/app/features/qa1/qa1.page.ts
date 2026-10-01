import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError, ApiService } from '../../core/api.service';
import { DayPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { Icon } from '../../ui/icon';
import { Callout, Empty, ErrorBox, Loading, PageHeader, Stat, TabItem, Tabs } from '../../ui/kit';
import { Ref } from '../mrv-shared/ui';
import { Qa1Analyses } from './analyses';
import { Qa1Models } from './model-register';
import { Qa1Imports } from './run-imports';
import { Qa1TrueUpPanel } from './trueup';
import { CampaignLite, POOL_LABEL, POOLS, Qa1Model, Qa1Status } from './qa1.types';

@Component({
  selector: 'vc-qa1-page',
  imports: [RouterLink, Icon, PageHeader, Stat, Tabs, Loading, Empty, ErrorBox, Callout, Ref, Qa1Models, Qa1Imports, Qa1Analyses, Qa1TrueUpPanel, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Process model (QA1)" eyebrow="Carbon · Measure and model"
      subtitle="Quantification Approach 1 uses a validated biogeochemical model, started from measured soil carbon and checked against re-measurements, to estimate soil-carbon change and soil CH₄ and N₂O. Every modelled value is marked as such and needs a second person's approval before it is credited.">
      <button actions class="btn btn-secondary" (click)="load()" [disabled]="loading()"><vc-icon name="refresh" />Refresh</button>
    </vc-page-header>

    @if (!ctx.currentId()) {
      <section class="card"><vc-empty icon="briefcase" title="Choose a project" text="Model runs and analyses are kept per project. Pick one in the top bar." /></section>
    } @else if (loading() && !status()) {
      <section class="card"><vc-loading [rows]="6" /></section>
    } @else if (error()) {
      <vc-error title="Couldn't load QA1" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error>
    } @else {
      <!-- true-up banner -->
      @if (ts(); as s) {
        @if (s.overdue) {
          <div class="banner danger">
            <span class="bi"><vc-icon name="calendar-clock" [size]="20" /></span>
            <div class="bt"><strong>SOC re-measurement (true-up) is overdue</strong>
              <p>SOC was last measured directly on {{ s.last_measured_on | day }}; a true-up was due by {{ s.due_by | day }}. QA1 SOC terms can't be published for periods after that date until a true-up is approved.</p></div>
            <vc-ref>VM0042 §8.6.1.3 p.74</vc-ref>
            <button class="btn btn-secondary btn-sm" (click)="setTab('trueup')">Open true-up</button>
          </div>
        } @else if (s.problems?.length) {
          <div class="banner warn">
            <span class="bi"><vc-icon name="circle-alert" [size]="20" /></span>
            <div class="bt"><strong>Follow-up after the latest true-up</strong>@for (p of s.problems; track p.code) { <p>{{ p.message }}</p> }</div>
            <button class="btn btn-secondary btn-sm" (click)="setTab('trueup')">Open true-up</button>
          </div>
        }
      }

      <!-- approaches -->
      <div class="appr">
        @for (p of pools; track p) {
          @let a = status()?.approaches?.[p];
          <div class="ap" [class.on]="a === 'qa1'">
            <span class="apl">{{ poolLabel[p] }}</span>
            <strong>{{ approachLabel(a) }}</strong>
          </div>
        }
        <div class="ap">
          <span class="apl">Uncertainty method</span>
          <strong>{{ status()?.uncertainty_method === 'monte_carlo' ? 'Monte Carlo (Eq. 65–69)' : status()?.uncertainty_method === 'analytical' ? 'Analytical (Eq. 60–64)' : 'Not set' }}</strong>
        </div>
        <a class="rl" routerLink="/app/methodology"><vc-icon name="scale" [size]="14" />Rules decide these</a>
      </div>

      @if (!usesQa1()) {
        <vc-callout tone="info" icon="info" class="mb">The project's rule pack doesn't quantify any pool with QA1, so analyses will be refused. You can still register and approve models.</vc-callout>
      }

      <div class="grid grid-4 kpis">
        <vc-stat label="Approved models" [value]="approvedModels()" [unit]="'of ' + models().length" icon="cpu" [hint]="draftModels() ? draftModels() + ' draft(s) awaiting approval' : 'Register · approve · use'" />
        <vc-stat label="Model run imports" [value]="status()?.imports?.length ?? 0" icon="file-up" [hint]="pointCount() + ' modelled points'" />
        <vc-stat label="True-ups" [value]="status()?.trueups?.length ?? 0" icon="compare" [hint]="ts()?.due_by ? 'Next due ' + (ts()!.due_by | day) : 'No clock yet'" />
        <vc-stat label="Data class" value="MODELLED" icon="sparkles" hint="Never shown as a measurement" />
      </div>

      <vc-tabs [tabs]="tabs()" [active]="tab()" (activeChange)="setTab($event)" />

      @switch (tab()) {
        @case ('models') { <vc-qa1-models [models]="models()" [trueups]="status()?.trueups ?? []" (changed)="load()" /> }
        @case ('runs') { <vc-qa1-imports [projectId]="ctx.currentId()!" [imports]="status()?.imports ?? []" [models]="models()" [campaigns]="campaigns()" (changed)="load()" /> }
        @case ('analyses') { <vc-qa1-analyses [projectId]="ctx.currentId()!" [imports]="status()?.imports ?? []" [models]="models()" (changed)="load()" /> }
        @case ('trueup') { <vc-qa1-trueup [projectId]="ctx.currentId()!" [state]="ts()" [trueups]="status()?.trueups ?? []" [imports]="status()?.imports ?? []" [models]="models()" [campaigns]="campaigns()" (changed)="load()" /> }
      }
    }
  `,
  styles: [`
    .banner{display:flex;gap:14px;align-items:flex-start;padding:14px 18px;border-radius:var(--radius);border:1px solid;margin-bottom:16px}
    .banner.danger{background:var(--danger-soft);border-color:#f3c7c3} .banner.danger .bi{color:var(--red-600)}
    .banner.warn{background:var(--warn-soft);border-color:#f1dcae} .banner.warn .bi{color:var(--amber-600)}
    .bi{margin-top:1px}
    .bt{flex:1;min-width:0} .bt p{color:var(--stone-700);font-size:13.5px;margin-top:2px}
    .appr{display:flex;flex-wrap:wrap;gap:8px;align-items:stretch;margin-bottom:16px}
    .ap{display:flex;flex-direction:column;gap:1px;padding:8px 14px;border-radius:var(--radius-sm);background:var(--surface);border:1px solid var(--border);min-width:150px}
    .ap.on{border-color:var(--forest-300);background:var(--forest-50)}
    .apl{font-size:11.5px;color:var(--text-3)} .ap strong{font-size:13px;font-weight:600}
    .ap.on strong{color:var(--forest-700)}
    .rl{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;margin-left:auto;align-self:center}
    .mb{display:flex;margin-bottom:16px}
    .kpis{margin-bottom:8px}
  `],
})
export class Qa1Page {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  ctx = inject(ProjectContext);

  pools = POOLS;
  poolLabel = POOL_LABEL;
  loading = signal(false);
  error = signal<string | null>(null);
  status = signal<Qa1Status | null>(null);
  models = signal<Qa1Model[]>([]);
  campaigns = signal<CampaignLite[]>([]);

  private qp = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  tab = computed(() => {
    const t = this.qp().get('tab') ?? 'models';
    return ['models', 'runs', 'analyses', 'trueup'].includes(t) ? t : 'models';
  });
  ts = computed(() => {
    const s = this.status()?.trueup_state;
    return s && !s.error ? s : null;
  });
  approvedModels = computed(() => this.models().filter(m => m.status === 'approved').length);
  draftModels = computed(() => this.models().filter(m => m.status === 'draft').length);
  pointCount = computed(() => new Set((this.status()?.imports ?? []).flatMap(i => i.site_codes)).size);
  usesQa1 = computed(() => Object.values(this.status()?.approaches ?? {}).includes('qa1'));
  tabs = computed<TabItem[]>(() => [
    { key: 'models', label: 'Models', count: this.models().length },
    { key: 'runs', label: 'Model runs', count: this.status()?.imports?.length ?? null },
    { key: 'analyses', label: 'Analyses & terms' },
    { key: 'trueup', label: 'True-up', count: this.status()?.trueups?.length ?? null },
  ]);

  constructor() {
    effect(() => {
      const pid = this.ctx.currentId();
      untracked(() => { if (pid) this.load(); });
    });
  }

  setTab(t: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { tab: t === 'models' ? null : t }, queryParamsHandling: 'merge' });
  }

  approachLabel(a: string | null | undefined) {
    return a === 'qa1' ? 'QA1 · modelled' : a === 'qa2' ? 'QA2 · measured' : a === 'qa3' ? 'QA3 · default factors' : a === 'not_applicable' ? 'Not applicable' : a ? a.toUpperCase() : 'Not set';
  }

  load() {
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      status: this.api.get<Qa1Status>(`/projects/${pid}/qa1/status`),
      models: this.api.get<Qa1Model[]>('/qa1/models'),
      campaigns: this.api.get<CampaignLite[] | { items: CampaignLite[] }>(`/projects/${pid}/campaigns`).pipe(catchError(() => of([] as CampaignLite[]))),
    }).subscribe({
      next: r => {
        this.status.set(r.status);
        this.models.set(r.models);
        this.campaigns.set(Array.isArray(r.campaigns) ? r.campaigns : r.campaigns.items);
        this.loading.set(false);
      },
      error: (e: ApiError) => { this.error.set(e.status === 404 ? 'The QA1 service is not available on this server yet.' : e.message); this.loading.set(false); },
    });
  }
}
