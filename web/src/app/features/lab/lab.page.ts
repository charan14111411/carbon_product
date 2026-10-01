import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Icon } from '../../ui/icon';
import { Callout, PageHeader, Tabs } from '../../ui/kit';
import { LabBatches } from './lab-batches';
import { LabCalibrations } from './lab-calibrations';
import { LabCampaigns } from './lab-campaigns';
import { LabChanges } from './lab-changes';
import { LabContext } from './lab-context';
import { LabEntry } from './lab-entry';
import { LabImport } from './lab-import';
import { LabLabs } from './lab-labs';
import { LabResults } from './lab-results';

@Component({
  selector: 'vc-lab-page',
  imports: [PageHeader, Tabs, Icon, Callout, LabResults, LabEntry, LabImport, LabBatches, LabLabs, LabCalibrations, LabCampaigns, LabChanges],
  providers: [LabContext],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Laboratory" eyebrow="Measurement"
      subtitle="Results for every bag, with the lab's certificate. A reviewed result is frozen; a correction is a new version that supersedes it.">
      @if (lab.myLab(); as l) {
        <div actions class="mylab">
          <vc-icon name="flask" [size]="16" />
          <span><strong>{{ l.name }}</strong><em>{{ l.accreditation || 'Your lab' }}{{ l.city ? ' · ' + l.city : '' }}</em></span>
        </div>
      }
    </vc-page-header>

    @if (lab.unscopedTech()) {
      <vc-callout tone="warn" icon="alert" style="margin-bottom:16px">
        Your account is not linked to a lab yet, so no batches or results are shown. Ask an administrator to set your lab.
      </vc-callout>
    }

    <vc-tabs [tabs]="tabs()" [(active)]="tab" />

    @switch (tab()) {
      @case ('results') { <vc-lab-results /> }
      @case ('enter') { <vc-lab-entry /> }
      @case ('import') { <vc-lab-import /> }
      @case ('batches') { <vc-lab-batches /> }
      @case ('campaigns') { <vc-lab-campaigns /> }
      @case ('changes') { <vc-lab-changes /> }
      @case ('labs') { <vc-lab-labs /> }
      @case ('calibrations') { <vc-lab-calibrations /> }
    }
  `,
  styles: [`
    .mylab{display:flex;align-items:center;gap:10px;padding:8px 14px;border:1px solid var(--forest-200);background:var(--forest-50);border-radius:var(--radius);color:var(--forest-700)}
    .mylab span{display:flex;flex-direction:column;line-height:1.25}
    .mylab strong{font-size:13.5px;color:var(--stone-900)} .mylab em{font-style:normal;font-size:12px;color:var(--text-2)}
  `],
})
export class LabPage {
  private auth = inject(AuthService);
  lab = inject(LabContext);
  private route = inject(ActivatedRoute);
  tab = signal(this.route.snapshot.queryParamMap.get('tab') ?? 'results');

  tabs = computed(() => {
    const t = [{ key: 'results', label: 'Results' }];
    if (this.auth.can('lab.submit')) t.push({ key: 'enter', label: 'Enter results' }, { key: 'import', label: 'Import CSV' });
    t.push({ key: 'batches', label: 'Batches' });
    if (this.auth.can('data.read')) t.push({ key: 'campaigns', label: 'Campaign progress' });
    t.push({ key: 'labs', label: 'Labs' });
    if (this.auth.can('data.read')) t.push({ key: 'changes', label: 'Lab changes' });
    t.push({ key: 'calibrations', label: 'Calibrations' });
    return t;
  });

  constructor() {
    this.lab.loadLabs();
    this.lab.loadCalibrations();
  }
}
