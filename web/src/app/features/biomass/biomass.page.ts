import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError, ApiService } from '../../core/api.service';
import { ProjectContext } from '../../core/project-context.service';
import { Icon } from '../../ui/icon';
import { Empty, ErrorBox, Loading, PageHeader, Stat, TabItem, Tabs } from '../../ui/kit';
import { Ref } from '../mrv-shared/ui';
import { AllometryTab } from './allometry';
import { BiomassCompute } from './compute';
import { BiomassMeasurements } from './measurements';
import { BiomassPlots } from './plots';
import { Allometry, AllometryForms, BCampaign, Measurement, Plot, StratumLite } from './biomass.types';

@Component({
  selector: 'vc-biomass-page',
  imports: [Icon, PageHeader, Stat, Tabs, Loading, Empty, ErrorBox, Ref, AllometryTab, BiomassPlots, BiomassMeasurements, BiomassCompute],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Trees & shrubs" eyebrow="Carbon · Woody biomass"
      subtitle="Trees and shrubs on the land store carbon too. Measure permanent plots in repeated campaigns, turn each tree into biomass with an approved allometric equation, and publish the stock change as a term for the calculation (Eq. 44/45).">
      <ng-container actions>
        <vc-ref>VM0042 §8.5.1 · CDM AR-TOOL14</vc-ref>
        <button class="btn btn-secondary" (click)="load()" [disabled]="loading()"><vc-icon name="refresh" />Refresh</button>
      </ng-container>
    </vc-page-header>

    @if (!ctx.currentId()) {
      <section class="card"><vc-empty icon="briefcase" title="Choose a project" text="Plots, campaigns and equations are kept per project." /></section>
    } @else if (loading() && !loaded()) {
      <section class="card"><vc-loading [rows]="6" /></section>
    } @else if (error()) {
      <vc-error title="Couldn't load the tree and shrub inventory" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error>
    } @else {
      <div class="grid grid-4 kpis">
        <vc-stat label="Approved equations" [value]="approvedModels()" [unit]="'of ' + models().length" icon="ruler" [hint]="species() + ' species covered'" />
        <vc-stat label="Permanent plots" [value]="activePlots()" icon="land-plot" [hint]="projectPlots() + ' project · ' + baselinePlots() + ' baseline'" />
        <vc-stat label="Campaigns" [value]="campaigns().length" icon="calendar" [hint]="lastCampaign()" />
        <vc-stat label="Plot measurements" [value]="activeMeasurements()" icon="tree-pine" [hint]="treeTotal() + ' trees recorded'" />
      </div>

      <vc-tabs [tabs]="tabs()" [active]="tab()" (activeChange)="setTab($event)" />

      @switch (tab()) {
        @case ('equations') { <vc-allometry [projectId]="ctx.currentId()!" [models]="models()" [forms]="forms()" (changed)="load()" /> }
        @case ('plots') { <vc-biomass-plots [projectId]="ctx.currentId()!" [plots]="plots()" [campaigns]="campaigns()" [strata]="strata()" [measurements]="measurements()" (changed)="load()" /> }
        @case ('measure') { <vc-biomass-measurements [projectId]="ctx.currentId()!" [plots]="plots()" [campaigns]="campaigns()" [measurements]="measurements()" [models]="models()" (changed)="load()" /> }
        @case ('compute') { <vc-biomass-compute [projectId]="ctx.currentId()!" [campaigns]="campaigns()" [models]="models()" /> }
      }
    }
  `,
  styles: [`.kpis{margin-bottom:8px}`],
})
export class BiomassPage {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  ctx = inject(ProjectContext);

  loading = signal(false);
  loaded = signal(false);
  error = signal<string | null>(null);
  forms = signal<AllometryForms | null>(null);
  models = signal<Allometry[]>([]);
  plots = signal<Plot[]>([]);
  campaigns = signal<BCampaign[]>([]);
  measurements = signal<Measurement[]>([]);
  strata = signal<StratumLite[]>([]);

  private qp = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  tab = computed(() => { const t = this.qp().get('tab') ?? 'equations'; return ['equations', 'plots', 'measure', 'compute'].includes(t) ? t : 'equations'; });
  approvedModels = computed(() => this.models().filter(m => m.status === 'approved').length);
  species = computed(() => new Set(this.models().filter(m => m.status === 'approved').map(m => m.species)).size);
  activePlots = computed(() => this.plots().filter(p => p.status === 'active').length);
  projectPlots = computed(() => this.plots().filter(p => p.scenario === 'project').length);
  baselinePlots = computed(() => this.plots().filter(p => p.scenario === 'baseline').length);
  activeMeasurements = computed(() => this.measurements().filter(m => m.status === 'active').length);
  treeTotal = computed(() => this.measurements().filter(m => m.status === 'active').reduce((a, m) => a + m.trees.reduce((b, t) => b + t.count, 0), 0));
  lastCampaign = computed(() => {
    const c = [...this.campaigns()].sort((a, b) => b.measured_on.localeCompare(a.measured_on))[0];
    return c ? `Latest ${c.code} · ${new Date(c.measured_on + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}` : 'Re-measure at least every 5 years';
  });
  tabs = computed<TabItem[]>(() => [
    { key: 'equations', label: 'Allometric equations', count: this.models().length },
    { key: 'plots', label: 'Plots & campaigns', count: this.plots().length },
    { key: 'measure', label: 'Measurements', count: this.activeMeasurements() },
    { key: 'compute', label: 'Compute & publish' },
  ]);

  constructor() {
    this.api.get<AllometryForms>('/biomass/allometry-forms').subscribe({ next: f => this.forms.set(f), error: () => {} });
    effect(() => { const pid = this.ctx.currentId(); untracked(() => { if (pid) this.load(); }); });
  }

  setTab(t: string) { this.router.navigate([], { relativeTo: this.route, queryParams: { tab: t === 'equations' ? null : t }, queryParamsHandling: 'merge' }); }

  load() {
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      models: this.api.get<Allometry[]>(`/projects/${pid}/allometric-models`),
      plots: this.api.get<Plot[]>(`/projects/${pid}/biomass/plots`),
      campaigns: this.api.get<BCampaign[]>(`/projects/${pid}/biomass/campaigns`),
      measurements: this.api.get<Measurement[]>(`/projects/${pid}/biomass/measurements`, { include_voided: true }),
      strata: this.api.get<StratumLite[]>(`/projects/${pid}/strata`).pipe(catchError(() => of([] as StratumLite[]))),
    }).subscribe({
      next: r => {
        this.models.set(r.models);
        this.plots.set(r.plots);
        this.campaigns.set(r.campaigns);
        this.measurements.set(r.measurements);
        this.strata.set(r.strata);
        this.loading.set(false);
        this.loaded.set(true);
      },
      error: (e: ApiError) => { this.error.set(e.status === 404 ? 'The woody-biomass service is not available on this server yet.' : e.message); this.loading.set(false); },
    });
  }
}
