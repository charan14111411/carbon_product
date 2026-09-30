import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Callout, Modal } from '../../ui/kit';
import { Campaign } from './types';

/** Plan a new baseline or monitoring campaign. */
@Component({
  selector: 'vc-campaign-modal',
  imports: [FormsModule, Modal, Icon, Callout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [(open)]="open" title="Plan a campaign" width="640px"
      subtitle="A campaign is one round of soil sampling. The methodology rules are checked when you save.">
      <div class="stack" style="--gap:16px">
        <div class="form-grid">
          <div class="field">
            <label for="c-code">Campaign code</label>
            <input id="c-code" class="input mono" [(ngModel)]="code" placeholder="BL-2026" />
          </div>
          <div class="field">
            <label for="c-name">Name</label>
            <input id="c-name" class="input" [(ngModel)]="name" placeholder="Baseline sampling, post-monsoon 2026" />
          </div>
          <div class="field">
            <label for="c-kind">Kind</label>
            <select id="c-kind" class="input" [ngModel]="kind()" (ngModelChange)="kind.set($event)">
              <option value="baseline">Baseline — the starting point</option>
              <option value="monitoring">Monitoring — a later re-measurement</option>
            </select>
          </div>
          <div class="field">
            <label for="c-design">Design</label>
            <select id="c-design" class="input" [ngModel]="design()" (ngModelChange)="design.set($event)">
              <option value="independent">Independent — new random points</option>
              <option value="paired">Paired — re-visit the same sites</option>
            </select>
          </div>
          @if (kind() === 'monitoring') {
            <div class="field span-2">
              <label for="c-rev">Re-visits baseline campaign @if (design() !== 'paired') { <span class="subtle">(optional)</span> }</label>
              <select id="c-rev" class="input" [(ngModel)]="revisits">
                <option value="">None</option>
                @for (b of baselines(); track b.id) { <option [value]="b.id">{{ b.code }} · {{ b.name }}</option> }
              </select>
              @if (design() === 'paired') { <span class="hint">Paired designs sample the exact sites of the baseline again.</span> }
            </div>
          }
          <div class="field">
            <label for="c-start">Planned start</label>
            <input id="c-start" type="date" class="input" [(ngModel)]="start" />
          </div>
          <div class="field">
            <label for="c-end">Planned end</label>
            <input id="c-end" type="date" class="input" [(ngModel)]="end" />
          </div>
          <div class="field">
            <label for="c-df">Depth from (cm)</label>
            <input id="c-df" type="number" min="0" class="input num" [(ngModel)]="depthFrom" />
          </div>
          <div class="field">
            <label for="c-dt">Depth to (cm)</label>
            <input id="c-dt" type="number" min="1" max="300" class="input num" [(ngModel)]="depthTo" />
          </div>
          <div class="field span-2">
            <label for="c-seed">Placement seed <span class="subtle">(optional)</span></label>
            <input id="c-seed" type="number" min="0" class="input num" [(ngModel)]="seed" placeholder="Chosen at random if left empty" />
            <span class="hint">The seed makes point placement reproducible: the same seed and zones always give the same points, so a verifier can re-create them.</span>
          </div>
        </div>
        @if (err()) { <vc-callout tone="danger" icon="alert">{{ err() }}</vc-callout> }
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !valid()" (click)="save()"><vc-icon name="check" />{{ busy() ? 'Saving…' : 'Create campaign' }}</button>
      </ng-container>
    </vc-modal>
  `,
})
export class CampaignModal {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  open = model(false);
  projectId = input.required<string>();
  campaigns = input<Campaign[]>([]);
  saved = output<Campaign>();

  busy = signal(false);
  err = signal<string | null>(null);
  kind = signal<'baseline' | 'monitoring'>('baseline');
  design = signal<'paired' | 'independent'>('independent');
  baselines = computed(() => this.campaigns().filter(c => c.kind === 'baseline'));

  code = '';
  name = '';
  revisits = '';
  start = '';
  end = '';
  depthFrom = 0;
  depthTo = 30;
  seed: number | null = null;

  constructor() {
    effect(() => {
      if (!this.open()) return;
      this.err.set(null);
      this.code = ''; this.name = ''; this.revisits = ''; this.seed = null;
      this.start = new Date().toISOString().slice(0, 10);
      this.end = new Date(Date.now() + 45 * 86400_000).toISOString().slice(0, 10);
    });
  }

  valid() {
    return this.code.trim().length >= 2 && this.name.trim().length >= 2 && !!this.start && !!this.end && this.depthTo > this.depthFrom;
  }

  save() {
    this.busy.set(true);
    this.err.set(null);
    this.api.post<Campaign>(`/projects/${this.projectId()}/campaigns`, {
      code: this.code.trim(), name: this.name.trim(), kind: this.kind(), design: this.design(),
      revisits_campaign_id: this.kind() === 'monitoring' && this.revisits ? this.revisits : null,
      planned_start: this.start, planned_end: this.end, depth_from_cm: Number(this.depthFrom), depth_to_cm: Number(this.depthTo),
      placement_seed: this.seed === null || (this.seed as unknown) === '' ? null : Number(this.seed),
    }).subscribe({
      next: c => { this.busy.set(false); this.toast.success(`Campaign ${c.code} planned`); this.saved.emit(c); this.open.set(false); },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e.message); },
    });
  }
}
