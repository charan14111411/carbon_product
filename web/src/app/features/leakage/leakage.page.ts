import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { ProjectContext } from '../../core/project-context.service';
import { Icon } from '../../ui/icon';
import { Empty, ErrorBox, Loading, PageHeader, Stat, TabItem, Tabs } from '../../ui/kit';
import { TermHistory } from '../mrv-shared/term-history';
import { DisplacementTab } from './displacement';
import { Displacement, Residue } from './leakage.types';
import { ResiduesTab } from './residues';

@Component({
  selector: 'vc-leakage-page',
  imports: [RouterLink, Icon, PageHeader, Stat, Tabs, Loading, Empty, ErrorBox, ResiduesTab, DisplacementTab, TermHistory],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Leakage records" eyebrow="Carbon · Leakage"
      subtitle="Emissions the project may push outside its boundary: residues no longer available as fuel, and production or livestock that moves elsewhere. Each is recorded with evidence, computed, and published as a draft term for a colleague to approve.">
      <ng-container actions>
        <a class="btn btn-ghost" routerLink="/app/emissions" [queryParams]="{ tab: 'leakage' }"><vc-icon name="zap" />Emissions & leakage</a>
        <button class="btn btn-secondary" (click)="load()" [disabled]="loading()"><vc-icon name="refresh" />Refresh</button>
      </ng-container>
    </vc-page-header>

    @if (!ctx.currentId()) {
      <section class="card"><vc-empty icon="briefcase" title="Choose a project" text="Leakage records are kept per project." /></section>
    } @else if (loading() && !loaded()) {
      <section class="card"><vc-loading [rows]="6" /></section>
    } @else if (error()) {
      <vc-error title="Couldn't load leakage records" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error>
    } @else {
      <div class="grid grid-4 kpis">
        <vc-stat label="Residue records" [value]="activeResidues()" icon="wheat" [hint]="residuePeriods() + ' period(s) · TOOL16'" />
        <vc-stat label="Residues ruled out" [value]="ruledOut()" icon="shield-check" hint="With evidence" />
        <vc-stat label="Years recorded" [value]="activeYears()" icon="calendar" [hint]="yearSpan()" />
        <vc-stat label="VMD0054 years" [value]="vmdYears()" icon="truck" [hint]="activeYears() - vmdYears() + ' with no production decrease'" />
      </div>

      <vc-tabs [tabs]="tabs()" [active]="tab()" (activeChange)="setTab($event)" />

      @switch (tab()) {
        @case ('residues') { <vc-residues [projectId]="ctx.currentId()!" [records]="residues()" (changed)="load()" (termPublished)="bump()" /> }
        @case ('displacement') { <vc-displacement [projectId]="ctx.currentId()!" [records]="displacement()" (changed)="load()" (termPublished)="bump()" /> }
        @case ('history') { <vc-term-history [projectId]="ctx.currentId()!" [refresh]="refresh()" title="All platform-computed terms" emptyText="Publish a woody-biomass or leakage computation and it appears here with its frozen inputs." /> }
      }
    }
  `,
  styles: [`.kpis{margin-bottom:8px}`],
})
export class LeakagePage {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  ctx = inject(ProjectContext);

  loading = signal(false);
  loaded = signal(false);
  error = signal<string | null>(null);
  residues = signal<Residue[]>([]);
  displacement = signal<Displacement[]>([]);
  refresh = signal(0);

  private qp = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  tab = computed(() => { const t = this.qp().get('tab') ?? 'residues'; return ['residues', 'displacement', 'history'].includes(t) ? t : 'residues'; });
  activeResidues = computed(() => this.residues().filter(r => r.status === 'active').length);
  residuePeriods = computed(() => new Set(this.residues().filter(r => r.status === 'active').map(r => r.period_label)).size);
  ruledOut = computed(() => this.residues().filter(r => r.status === 'active' && r.leakage_ruled_out).length);
  activeYears = computed(() => this.displacement().filter(r => r.status === 'active').length);
  vmdYears = computed(() => this.displacement().filter(r => r.status === 'active' && r.mode === 'vmd0054').length);
  yearSpan = computed(() => {
    const ys = this.displacement().filter(r => r.status === 'active').map(r => r.year);
    return ys.length ? `${Math.min(...ys)}–${Math.max(...ys)}` : 'From the project start';
  });
  tabs = computed<TabItem[]>(() => [
    { key: 'residues', label: 'Biomass residues (TOOL16)', count: this.activeResidues() },
    { key: 'displacement', label: 'Displacement & production (VMD0054)', count: this.activeYears() },
    { key: 'history', label: 'Published computations' },
  ]);

  constructor() {
    effect(() => { const pid = this.ctx.currentId(); untracked(() => { if (pid) this.load(); }); });
  }

  setTab(t: string) { this.router.navigate([], { relativeTo: this.route, queryParams: { tab: t === 'residues' ? null : t }, queryParamsHandling: 'merge' }); }
  bump() { this.refresh.update(n => n + 1); }

  load() {
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      residues: this.api.get<Residue[]>(`/projects/${pid}/leakage/residues`, { include_voided: true }),
      displacement: this.api.get<Displacement[]>(`/projects/${pid}/leakage/displacement`, { include_voided: true }),
    }).subscribe({
      next: r => { this.residues.set(r.residues); this.displacement.set(r.displacement); this.loading.set(false); this.loaded.set(true); },
      error: (e: ApiError) => { this.error.set(e.status === 404 ? 'The leakage service is not available on this server yet.' : e.message); this.loading.set(false); },
    });
  }
}
