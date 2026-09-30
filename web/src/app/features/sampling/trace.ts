import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { Badge, ErrorBox, Loading, Modal } from '../../ui/kit';
import { SampleView } from './sample-view';
import { Trace } from './types';

/** Drawer answering "where did this sample or bag come from, and where is it now?" */
@Component({
  selector: 'vc-trace-drawer',
  imports: [Modal, Loading, ErrorBox, Badge, SampleView, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [(open)]="open" [drawer]="true" width="680px" [title]="'Trace ' + code()"
      subtitle="From project and zone down to the bag on the lab bench.">
      @if (loading()) {
        <vc-loading [rows]="8" />
      } @else if (error()) {
        <vc-error title="Nothing found" [message]="error()!" />
      } @else if (t(); as t) {
        <div class="stack" style="--gap:20px">
          <ol class="chain">
            <li><span>Project</span><strong>{{ t.project.code }}</strong><em>{{ t.project.name }}</em></li>
            <li><span>Campaign</span><a [routerLink]="['/app/sampling', t.campaign.id]" (click)="open.set(false)"><strong>{{ t.campaign.code }}</strong></a><vc-badge [status]="t.campaign.status" /></li>
            @if (t.stratum) { <li><span>Zone</span><strong>{{ t.stratum.code }}</strong><em>{{ t.stratum.name }}</em></li> }
            <li><span>Field</span><strong>{{ t.field.code }}</strong><em>{{ t.field.name }}</em></li>
            <li><span>Site</span><strong class="mono">{{ t.site.code }}</strong><em>{{ t.point.assigned_to ? 'Assigned to ' + t.point.assigned_to : 'Unassigned' }}</em></li>
            <li><span>Sample</span><strong class="mono">{{ t.sample.code }}</strong></li>
            @if (t.bag) { <li class="hit"><span>Bag</span><strong class="mono">{{ t.bag.code }}</strong><em>label {{ t.bag.label_qr }}</em></li> }
            @for (b of t.lab_batches; track b.id) {
              <li><span>Lab batch</span><strong class="mono">{{ b.code }}</strong><vc-badge [status]="b.status" /><em>{{ b.layer_ids.length }} bag(s) of this sample</em></li>
            }
          </ol>
          <vc-sample-view [sample]="t.sample" />
        </div>
      }
    </vc-modal>
  `,
  styles: [`
    .chain{list-style:none;margin:0;padding:0;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
    .chain li{display:flex;align-items:center;gap:10px;padding:9px 14px;border-bottom:1px solid var(--stone-100);font-size:13.5px;flex-wrap:wrap}
    .chain li:last-child{border-bottom:0}
    .chain li.hit{background:var(--forest-50)}
    .chain span{width:84px;color:var(--text-3);font-size:12px}
    .chain em{font-style:normal;color:var(--text-2);font-size:12.5px}
  `],
})
export class TraceDrawer {
  private api = inject(ApiService);
  open = model(false);
  code = input('');
  t = signal<Trace | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const c = this.code().trim();
      if (!this.open() || !c) return;
      this.loading.set(true);
      this.error.set(null);
      this.t.set(null);
      this.api.get<Trace>(`/samples/by-code/${encodeURIComponent(c)}/trace`).subscribe({
        next: r => { this.t.set(r); this.loading.set(false); },
        error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
      });
    });
  }
}
