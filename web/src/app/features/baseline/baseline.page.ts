import { ChangeDetectionStrategy, Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { ProjectContext } from '../../core/project-context.service';
import { Icon } from '../../ui/icon';
import { Empty, PageHeader, TabItem, Tabs } from '../../ui/kit';
import { AttestationsTab } from './attestations-tab';
import { FieldLite } from './baseline.types';
import { PracticeTab } from './practice-tab';
import { RecordsTab } from './records-tab';
import { ScheduleTab } from './schedule-tab';

@Component({
  selector: 'vc-baseline-page',
  imports: [PageHeader, Tabs, Empty, Icon, ScheduleTab, RecordsTab, AttestationsTab, PracticeTab],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Baseline & activity data" eyebrow="Land"
      subtitle="VM0042 sets each field’s baseline from how it was farmed before the project: at least three look-back years covering a full crop rotation, recorded year by year with the source of every value. The same activity data, recorded for project years, drives the emission equations.">
      @if (canWrite() && tab() === 'records') {
        <button actions class="btn btn-primary" (click)="records()?.startCreate()"><vc-icon name="plus" />Record activity</button>
      }
      @if (canWrite() && tab() === 'attestations') {
        <button actions class="btn btn-primary" (click)="atts()?.startCreate()"><vc-icon name="pen-line" />New attestation</button>
      }
    </vc-page-header>

    @if (!ctx.currentId()) {
      <section class="card"><vc-empty icon="briefcase" title="Choose a project" text="Pick a project in the top bar to see its baseline and activity data." /></section>
    } @else {
      <vc-tabs [tabs]="tabs" [active]="tab()" (activeChange)="setTab($event)" />
      <div [hidden]="tab() !== 'schedule'"><vc-schedule-tab #schedule [projectId]="ctx.currentId()!" [fields]="fields()" [active]="tab() === 'schedule'" (openRecords)="openRecords($event)" /></div>
      <div [hidden]="tab() !== 'records'"><vc-records-tab #records [projectId]="ctx.currentId()!" [fields]="fields()" [active]="tab() === 'records'" [canWrite]="canWrite()" /></div>
      <div [hidden]="tab() !== 'attestations'"><vc-attestations-tab #atts [projectId]="ctx.currentId()!" [fields]="fields()" [active]="tab() === 'attestations'" [canWrite]="canWrite()" /></div>
      <div [hidden]="tab() !== 'practice'"><vc-practice-tab [projectId]="ctx.currentId()!" [fields]="fields()" [active]="tab() === 'practice'" /></div>
    }
  `,
})
export class BaselinePage {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  records = viewChild<RecordsTab>('records');
  atts = viewChild<AttestationsTab>('atts');

  tab = signal(this.route.snapshot.queryParamMap.get('tab') ?? 'schedule');
  fields = signal<FieldLite[]>([]);
  tabs: TabItem[] = [
    { key: 'schedule', label: 'Schedule' }, { key: 'records', label: 'Activity records' },
    { key: 'attestations', label: 'Attestations' }, { key: 'practice', label: 'Practice change' },
  ];
  canWrite = () => this.auth.can('practice.record', 'land.manage', 'programmes.manage');

  constructor() {
    effect(() => {
      const pid = this.ctx.currentId();
      if (!pid) return;
      untracked(() => this.api.get<{ items: FieldLite[] }>('/fields', { project_id: pid, limit: 500 }).subscribe({
        next: r => this.fields.set([...r.items].sort((a, b) => a.code.localeCompare(b.code))),
        error: () => this.fields.set([]),
      }));
    });
  }

  setTab(t: string) {
    this.tab.set(t);
    this.router.navigate([], { queryParams: { tab: t }, queryParamsHandling: 'merge', replaceUrl: true });
  }

  openRecords(q: { field_id?: string; year?: number; category?: string }) {
    this.setTab('records');
    this.records()?.applyFilter(q);
  }
}
