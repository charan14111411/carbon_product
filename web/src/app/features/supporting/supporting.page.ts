import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiError, ApiService, Page } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { KIT, TabItem } from '../../ui/kit';
import { CoverageTab } from './coverage.tab';
import { DevicesTab } from './devices.tab';
import { ExplorerTab } from './explorer.tab';
import { FieldLite, Remote, TIER_ORDER, daysAgo, isoDate, tierMeta } from './shared';

@Component({
  selector: 'vc-supporting-page',
  imports: [...KIT, FormsModule, CoverageTab, DevicesTab, ExplorerTab],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Supporting data" eyebrow="Intelligence"
      subtitle="Weather and soil readings that support measurement — rainfall, temperature, soil moisture and more. For every field and every day, the platform uses the best source available.">
      @if (canSync() && ctx.currentId()) {
        <button actions class="btn btn-primary" (click)="syncOpen.set(true)"><vc-icon name="refresh" />Sync project</button>
      }
    </vc-page-header>

    <section class="tiers card" aria-label="How data sources are chosen">
      @for (t of tierSteps; track t.tier; let last = $last) {
        <div class="step">
          <div class="sh"><span class="badge-n" [style.background]="t.color">{{ t.tier || '–' }}</span>
            <div><div class="st">{{ t.tier ? t.short : 'Fallback' }}</div><strong>{{ t.label }}</strong></div></div>
          <p>{{ t.explain }}</p>
        </div>
        @if (!last) { <div class="arrow" aria-hidden="true"><vc-icon name="arrow-right" [size]="16" /><span>if missing</span></div> }
      }
    </section>

    @if (!ctx.currentId()) {
      <div class="card"><vc-empty icon="briefcase" title="Choose a project" text="Supporting data is shown per project. Pick one in the top bar." /></div>
    } @else {
      <vc-tabs [tabs]="tabs()" [(active)]="tab" />
      @switch (tab()) {
        @case ('coverage') { <vc-coverage-tab [projectId]="ctx.currentId()!" (openField)="openField($event)" /> }
        @case ('devices') { <vc-devices-tab [fields]="fields.data() ?? []" /> }
        @case ('explorer') { <vc-explorer-tab [fields]="fields.data() ?? []" [(fieldId)]="fieldId" /> }
      }
    }

    <vc-modal [(open)]="syncOpen" title="Sync supporting data" [subtitle]="(ctx.current()?.code ?? '') + ' · all enrolled fields'" width="480px">
      <div class="stack" style="--gap:14px">
        <p class="muted">Fetches daily readings for every enrolled field from the best available source, tier by tier. Days already stored are skipped, so it is safe to run again.</p>
        <div class="form-grid">
          <div class="field"><label for="ss">From</label><input id="ss" type="date" class="input" [(ngModel)]="syncStart" [max]="syncEnd" /></div>
          <div class="field"><label for="se">To</label><input id="se" type="date" class="input" [(ngModel)]="syncEnd" [max]="today" /></div>
        </div>
        <span class="small subtle">At most 400 days at a time. Future dates can't be synced.</span>
        @if (syncError()) { <vc-error title="Sync didn't run" [message]="syncError()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="syncOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="syncing()" (click)="syncProject()">{{ syncing() ? 'Syncing…' : 'Start sync' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .tiers{display:flex;align-items:stretch;gap:0;padding:14px 16px;margin-bottom:24px;overflow-x:auto}
    .step{flex:1;min-width:170px;padding:4px 8px}
    .sh{display:flex;align-items:center;gap:10px}
    .badge-n{display:grid;place-items:center;flex:none;width:26px;height:26px;border-radius:8px;color:#fff;font:600 13px/1 var(--mono)}
    .st{font-size:10.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text-3)}
    .sh strong{font-size:13.5px}
    .step p{margin-top:6px;font-size:12.5px;color:var(--text-2);line-height:1.45}
    .arrow{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:0 4px;color:var(--stone-400);flex:none}
    .arrow span{font-size:10.5px;white-space:nowrap}
  `],
})
export class SupportingPage {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  ctx = inject(ProjectContext);

  tab = signal<string>(this.route.snapshot.queryParamMap.get('tab') ?? 'coverage');
  fieldId = signal<string>(this.route.snapshot.queryParamMap.get('field') ?? '');
  fields = new Remote<FieldLite[]>();
  tierSteps = TIER_ORDER.map(tierMeta);
  canSync = computed(() => this.auth.can('data.sync'));
  tabs = computed<TabItem[]>(() => [
    { key: 'coverage', label: 'Project coverage' },
    { key: 'devices', label: 'Devices' },
    { key: 'explorer', label: 'Field data', count: this.fields.data()?.length ?? null },
  ]);
  private coverage = viewChild(CoverageTab);

  syncOpen = signal(false);
  syncing = signal(false);
  syncError = signal<string | null>(null);
  today = isoDate(new Date());
  syncStart = daysAgo(30);
  syncEnd = this.today;

  constructor() {
    effect(() => {
      const pid = this.ctx.currentId();
      untracked(() => {
        if (!pid) return;
        this.fields.load(this.api.get<Page<FieldLite>>('/fields', { project_id: pid, limit: 500 }).pipe(map(r => r.items)));
      });
    });
    effect(() => {
      const t = this.tab();
      const f = this.fieldId();
      untracked(() => this.router.navigate([], {
        queryParams: { tab: t === 'coverage' ? null : t, field: t === 'explorer' && f ? f : null }, replaceUrl: true,
      }));
    });
  }

  openField(id: string) {
    this.fieldId.set(id);
    this.tab.set('explorer');
  }

  syncProject() {
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.syncing.set(true);
    this.syncError.set(null);
    this.api.post<{ fields: number; observations_written: number }>(`/projects/${pid}/supporting/sync`, {
      start: this.syncStart, end: this.syncEnd,
    }).subscribe({
      next: r => {
        this.syncing.set(false);
        this.syncOpen.set(false);
        this.toast.success('Project synced', `${r.fields} fields · ${r.observations_written} new daily readings stored.`);
        this.coverage()?.reload();
      },
      error: (e: ApiError) => { this.syncing.set(false); this.syncError.set(e.message); },
    });
  }
}
