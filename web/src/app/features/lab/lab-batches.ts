import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, HumanPipe, NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, Empty, ErrorBox, Loading, Modal } from '../../ui/kit';
import { LabContext } from './lab-context';
import { Batch, LabProgress } from './types';

interface CampaignLite { id: string; code: string; name: string; status: string }

@Component({
  selector: 'vc-lab-batches',
  imports: [FormsModule, Icon, Badge, Callout, Empty, ErrorBox, Loading, Modal, DayPipe, NumPipe, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted small">A batch is one shipment of bags to one lab — its manifest travels with the box.</p>
      <div class="spacer"></div>
      @if (canCreate()) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New batch</button> }
    </div>
    <section class="card">
      @if (loading()) {
        <vc-loading [rows]="5" />
      } @else if (error()) {
        <div class="card-body"><vc-error title="Couldn't load batches" [message]="error()!" /></div>
      } @else if (!batches().length) {
        <vc-empty icon="package" title="No batches yet" text="Group collected bags from a campaign into a batch, then dispatch it to the lab." />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Batch</th><th>Campaign</th><th>Lab</th><th class="num">Bags</th><th>Dispatched</th><th>Status</th><th></th></tr></thead>
            <tbody>
              @for (b of batches(); track b.id) {
                <tr class="clickable" (click)="openManifest(b)">
                  <td><code>{{ b.code }}</code></td>
                  <td>{{ b.campaign_code }}</td>
                  <td>{{ b.lab_name }}</td>
                  <td class="num">{{ b.bag_count }}</td>
                  <td>{{ b.dispatched_on ? (b.dispatched_on | day) : '—' }}</td>
                  <td><vc-badge [status]="b.status === 'open' ? 'draft' : b.status">{{ b.status | human }}</vc-badge></td>
                  <td class="num">
                    @if (b.status === 'open' && canCreate()) {
                      <button class="btn btn-secondary btn-sm" (click)="$event.stopPropagation(); dispatchTarget.set(b); dispatchOn = today"><vc-icon name="truck" [size]="14" />Dispatch</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <!-- create -->
    <vc-modal [(open)]="createOpen" title="New lab batch" width="640px" subtitle="Choose the campaign and lab, then the bags going into this box.">
      <div class="stack" style="--gap:14px">
        <div class="form-grid">
          <div class="field">
            <label for="b-camp">Campaign</label>
            <select id="b-camp" class="input" [ngModel]="campId()" (ngModelChange)="pickCampaign($event)">
              <option value="">Choose…</option>
              @for (c of campaigns(); track c.id) { <option [value]="c.id">{{ c.code }} · {{ c.name }}</option> }
            </select>
          </div>
          <div class="field">
            <label for="b-lab">Lab</label>
            <select id="b-lab" class="input" [(ngModel)]="labId">
              <option value="">Choose…</option>
              @for (l of lab.labs(); track l.id) { <option [value]="l.id">{{ l.name }}</option> }
            </select>
          </div>
        </div>
        @if (campId()) {
          <div>
            <div class="row lh">
              <strong>Bags</strong><span class="subtle small">{{ picked().size }} selected</span><div class="spacer"></div>
              <button class="btn btn-ghost btn-sm" (click)="pickAllFree()">Select all not yet batched</button>
            </div>
            <div class="blist">
              @if (layersLoading()) { <vc-loading [rows]="4" /> }
              @else if (!layers().length) { <p class="muted small" style="padding:14px">No bags recorded for this campaign yet.</p> }
              @else {
                @for (l of layers(); track l.layer_id) {
                  @let taken = takenBy().get(l.layer_id);
                  <label class="br" [class.dis]="!!taken">
                    <input type="checkbox" [disabled]="!!taken" [checked]="picked().has(l.layer_id)" (change)="toggle(l.layer_id)" />
                    <code>{{ l.bag_code }}</code><span class="spacer"></span>
                    @if (taken) { <span class="subtle small">in {{ taken }}</span> }
                  </label>
                }
              }
            </div>
          </div>
        }
        @if (createErr()) { <vc-callout tone="danger" icon="alert">{{ createErr() }}</vc-callout> }
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!labId || !picked().size || busy()" (click)="create()"><vc-icon name="package" />Create batch</button>
      </ng-container>
    </vc-modal>

    <!-- dispatch -->
    <vc-modal [open]="!!dispatchTarget()" (closed)="dispatchTarget.set(null)" [title]="'Dispatch ' + (dispatchTarget()?.code ?? '') + '?'" width="460px">
      <div class="stack" style="--gap:14px">
        <p class="muted">{{ dispatchTarget()?.bag_count }} bags go to {{ dispatchTarget()?.lab_name }}. After dispatch the batch can't be changed; the lab records receipt, seal and bag count on arrival.</p>
        <div class="field"><label for="d-on">Dispatched on</label><input id="d-on" type="date" class="input" [(ngModel)]="dispatchOn" [max]="today" /></div>
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="dispatchTarget.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="dispatch()"><vc-icon name="truck" />Dispatch</button>
      </ng-container>
    </vc-modal>

    <!-- manifest -->
    <vc-modal [open]="!!manifest()" (closed)="manifest.set(null)" [drawer]="true" width="620px"
      [title]="'Manifest ' + (manifest()?.code ?? '')" [subtitle]="(manifest()?.lab_name ?? '') + ' · ' + (manifest()?.bag_count ?? 0) + ' bags'">
      @if (manifestLoading()) { <vc-loading [rows]="6" /> }
      @else if (manifest()?.manifest; as rows) {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Bag</th><th>Label</th><th class="num">Depth</th><th>Sample</th><th>Collected</th></tr></thead>
            <tbody>
              @for (m of rows; track m.layer_id) {
                <tr><td><code>{{ m.bag_code }}</code></td><td class="mono small">{{ m.label_qr }}</td>
                  <td class="num">{{ m.depth_from_cm | num: 0 }}–{{ m.depth_to_cm | num: 0 }} cm</td><td>{{ m.sample_code }}</td><td>{{ m.collected_at | day }}</td></tr>
              }
            </tbody>
          </table>
        </div>
      }
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;align-items:center;gap:12px;margin-bottom:14px}
    .lh{margin-bottom:8px}
    .blist{border:1px solid var(--border);border-radius:var(--radius-sm);max-height:280px;overflow:auto}
    .br{display:flex;align-items:center;gap:10px;padding:7px 12px;border-bottom:1px solid var(--stone-100);cursor:pointer;font-size:13px}
    .br:last-child{border-bottom:0}
    .br.dis{opacity:.55;cursor:not-allowed}
    .br input{accent-color:var(--primary);width:16px;height:16px}
  `],
})
export class LabBatches {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  private project = inject(ProjectContext);
  lab = inject(LabContext);

  today = new Date().toISOString().slice(0, 10);
  batches = signal<Batch[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  busy = signal(false);

  createOpen = signal(false);
  createErr = signal<string | null>(null);
  campaigns = signal<CampaignLite[]>([]);
  campId = signal('');
  labId = '';
  layers = signal<LabProgress['matrix']>([]);
  layersLoading = signal(false);
  takenBy = signal<Map<string, string>>(new Map());
  picked = signal<Set<string>>(new Set());

  dispatchTarget = signal<Batch | null>(null);
  dispatchOn = this.today;
  manifest = signal<Batch | null>(null);
  manifestLoading = signal(false);

  canCreate = computed(() => this.auth.can('sampling.plan', 'custody.record') && this.auth.can('data.read'));

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Batch[]>('/lab-batches').subscribe({
      next: b => { this.batches.set([...b].reverse()); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  openCreate() {
    this.createErr.set(null);
    this.campId.set('');
    this.layers.set([]);
    this.picked.set(new Set());
    this.labId = this.lab.labs().length === 1 ? this.lab.labs()[0].id : '';
    this.createOpen.set(true);
    const pid = this.project.currentId();
    if (pid) {
      this.api.get<CampaignLite[]>(`/projects/${pid}/campaigns`).subscribe({ next: c => this.campaigns.set(c), error: () => this.campaigns.set([]) });
    }
  }

  pickCampaign(id: string) {
    this.campId.set(id);
    this.picked.set(new Set());
    if (!id) return;
    this.layersLoading.set(true);
    const existing = this.batches().filter(b => b.campaign_id === id);
    forkJoin({
      prog: this.api.get<LabProgress>(`/campaigns/${id}/lab-progress`),
      details: existing.length ? forkJoin(existing.map(b => this.api.get<Batch>(`/lab-batches/${b.id}`).pipe(catchError(() => of(b))))) : of([] as Batch[]),
    }).subscribe({
      next: ({ prog, details }) => {
        const m = new Map<string, string>();
        for (const b of details) for (const x of b.manifest ?? []) m.set(x.layer_id, b.code);
        this.takenBy.set(m);
        this.layers.set(prog.matrix);
        this.layersLoading.set(false);
      },
      error: (e: ApiError) => { this.layersLoading.set(false); this.createErr.set(e.message); },
    });
  }

  toggle(id: string) {
    const s = new Set(this.picked());
    s.has(id) ? s.delete(id) : s.add(id);
    this.picked.set(s);
  }

  pickAllFree() {
    this.picked.set(new Set(this.layers().filter(l => !this.takenBy().has(l.layer_id)).map(l => l.layer_id)));
  }

  create() {
    this.busy.set(true);
    this.createErr.set(null);
    this.api.post<Batch>('/lab-batches', { lab_id: this.labId, campaign_id: this.campId(), layer_ids: [...this.picked()] }).subscribe({
      next: b => { this.busy.set(false); this.createOpen.set(false); this.toast.success(`Batch ${b.code} created`, `${b.bag_count} bags`); this.load(); },
      error: (e: ApiError) => { this.busy.set(false); this.createErr.set(e.message); },
    });
  }

  dispatch() {
    const b = this.dispatchTarget();
    if (!b) return;
    this.busy.set(true);
    this.api.post<Batch>(`/lab-batches/${b.id}/dispatch`, { dispatched_on: this.dispatchOn || null }).subscribe({
      next: r => { this.busy.set(false); this.dispatchTarget.set(null); this.toast.success(`Batch ${r.code} dispatched`); this.load(); },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e, "Couldn't dispatch the batch"); },
    });
  }

  openManifest(b: Batch) {
    this.manifest.set(b);
    this.manifestLoading.set(true);
    this.api.get<Batch>(`/lab-batches/${b.id}`).subscribe({
      next: r => { this.manifest.set(r); this.manifestLoading.set(false); },
      error: (e: ApiError) => { this.manifestLoading.set(false); this.toast.apiError(e, "Couldn't load the manifest"); },
    });
  }
}
