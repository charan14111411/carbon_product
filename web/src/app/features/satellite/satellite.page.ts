import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ApiService, Page } from '../../core/api.service';
import { ProjectContext } from '../../core/project-context.service';
import { KIT, TabItem } from '../../ui/kit';
import { FieldLite, Remote } from '../supporting/shared';
import { IndicesTab } from './indices.tab';
import { VerificationTab } from './verification.tab';

@Component({
  selector: 'vc-satellite-page',
  imports: [...KIT, IndicesTab, VerificationTab],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Satellite & practices" eyebrow="Intelligence"
      subtitle="Vegetation and moisture indices from satellite passes, alerts when a field changes suddenly, and independent checks of reported practices." />

    @if (!ctx.currentId()) {
      <div class="card"><vc-empty icon="briefcase" title="Choose a project" text="Satellite data is shown per project. Pick one in the top bar." /></div>
    } @else {
      <vc-tabs [tabs]="tabs" [(active)]="tab" />
      @switch (tab()) {
        @case ('indices') { <vc-indices-tab [projectId]="ctx.currentId()!" [fields]="fields.data() ?? []" [(fieldId)]="fieldId" /> }
        @case ('practices') { <vc-verification-tab [projectId]="ctx.currentId()!" [fields]="fields.data() ?? []" /> }
      }
    }
  `,
})
export class SatellitePage {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  ctx = inject(ProjectContext);
  tab = signal(this.route.snapshot.queryParamMap.get('tab') ?? 'indices');
  fieldId = signal(this.route.snapshot.queryParamMap.get('field') ?? '');
  fields = new Remote<FieldLite[]>();
  tabs: TabItem[] = [
    { key: 'indices', label: 'Alerts & indices' },
    { key: 'practices', label: 'Practice verification' },
  ];

  constructor() {
    effect(() => {
      const pid = this.ctx.currentId();
      untracked(() => {
        if (pid) this.fields.load(this.api.get<Page<FieldLite>>('/fields', { project_id: pid, limit: 500 }).pipe(map(r => r.items)));
      });
    });
    effect(() => {
      const t = this.tab();
      const f = this.fieldId();
      untracked(() => this.router.navigate([], { queryParams: { tab: t === 'indices' ? null : t, field: t === 'indices' && f ? f : null }, replaceUrl: true }));
    });
  }
}
