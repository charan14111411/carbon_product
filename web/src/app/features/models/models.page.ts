import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe, NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { KIT, TabItem } from '../../ui/kit';
import { Remote } from '../supporting/shared';
import { EmissionsTab } from './emissions.tab';
import { OptimiserTab } from './optimiser.tab';
import { SocMapTab } from './soc-map.tab';
import { FeatureSetsTab } from './feature-sets.tab';
import { InformingWall } from './informing-wall';
import { FEATURES, FeatureSet, ModelVersion, algorithmLabel, validationLabel } from './types';

interface NotEnough { rows: number; farms: number; min_rows: number; min_farms: number; excluded: { sample_code: string; missing_features: string[] }[] }

@Component({
  selector: 'vc-models-page',
  imports: [...KIT, FormsModule, RouterLink, NumPipe, DayPipe, AgoPipe, SocMapTab, OptimiserTab, EmissionsTab, FeatureSetsTab, InformingWall],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Soil-carbon models" eyebrow="Intelligence"
      subtitle="Models that estimate soil organic carbon from satellite, weather and soil data. They guide where to sample next — credits always come from lab results.">
      @if (tab() === 'models' && canManage()) {
        <button actions class="btn btn-primary" (click)="openTrain()"><vc-icon name="sparkles" />Train a model</button>
      }
    </vc-page-header>

    <vc-informing-wall [reason]="wallReason()" />

    <vc-tabs [tabs]="tabs()" [(active)]="tab" />

    @switch (tab()) {
      @case ('models') {
        <section class="card">
          @if (models.loading()) {
            <vc-loading [rows]="5" />
          } @else if (models.error()) {
            <div class="card-body"><vc-error title="Couldn't load models" [message]="models.error()!.message" /></div>
          } @else if (!models.data()?.length) {
            <vc-empty icon="layers" title="No models trained yet"
              text="Train a model from accepted lab results. It is validated by holding out whole farms, then needs a second person to approve it.">
              @if (canManage()) { <button class="btn btn-primary" (click)="openTrain()"><vc-icon name="sparkles" />Train a model</button> }
            </vc-empty>
          } @else {
            <div class="table-wrap">
              <table class="table">
                <thead><tr>
                  <th>Model</th><th>Status</th><th>Algorithm</th><th>Validation</th><th class="num">Rows</th>
                  <th class="num" title="Root mean squared error on held-out farms">RMSE</th><th class="num">MAE</th><th class="num">Bias</th>
                  <th class="num">R²</th><th class="num" title="Share of held-out results inside the 90% interval">90% interval</th><th>Trained</th>
                </tr></thead>
                <tbody>
                  @for (m of models.data(); track m.id) {
                    <tr class="clickable" [routerLink]="[m.id]">
                      <td><div class="mn"><strong>{{ m.name }}</strong><span class="small subtle">Version {{ m.version }} · {{ m.features.length }} features@if (m.feature_set_id) { · feature set }</span></div></td>
                      <td><div class="st"><vc-badge [status]="m.status" />
                        @if (m.review_required) { <vc-badge status="warning">Review needed</vc-badge> }
                        @else if (m.latest_drift?.status === 'drift') { <vc-badge status="failed">Drift</vc-badge> }
                        @else if (m.latest_drift?.status === 'warning') { <vc-badge status="warning">Drift warning</vc-badge> }
                      </div></td>
                      <td class="small">{{ alg(m.algorithm) }}</td>
                      <td class="small"><span class="hold"><vc-icon name="shield" [size]="13" />{{ val(m.validation, m.metrics.k) }}</span></td>
                      <td class="num">{{ m.training_rows ?? '—' }}</td>
                      <td class="num">{{ m.metrics.rmse | num: 3 }}<span class="u">% SOC</span></td>
                      <td class="num">{{ m.metrics.mae | num: 3 }}</td>
                      <td class="num">{{ m.metrics.bias > 0 ? '+' : '' }}{{ m.metrics.bias | num: 3 }}</td>
                      <td class="num">{{ m.metrics.r2 | num: 2 }}</td>
                      <td class="num"><span [class.warn]="m.metrics.coverage_90 < 0.8">{{ (m.metrics.coverage_90 * 100).toFixed(0) }}%</span></td>
                      <td class="nowrap small"><span [title]="m.created_at | day: true">{{ m.created_at | ago }}</span></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <div class="card-foot left"><span class="small muted">All metrics are measured on farms the model never saw during training. Lower RMSE and MAE are better; bias near zero; interval coverage near 90%.</span></div>
          }
        </section>
      }
      @case ('features') { <vc-feature-sets-tab [projectId]="ctx.currentId()" /> }
      @default {
        @if (ctx.currentId(); as pid) {
          @switch (tab()) {
            @case ('map') { <vc-soc-map-tab [projectId]="pid" [models]="models.data() ?? []" /> }
            @case ('optimiser') { <vc-optimiser-tab [projectId]="pid" /> }
            @case ('emissions') { <vc-emissions-tab [projectId]="pid" /> }
          }
        } @else {
          <div class="card"><vc-empty icon="briefcase" title="Choose a project" text="Maps, sampling plans and estimates are made per project. Pick one in the top bar." /></div>
        }
      }
    }

    <vc-modal [(open)]="trainOpen" [drawer]="true" width="520px" title="Train a soil-carbon model"
      subtitle="Ridge regression on accepted lab results, validated on held-out farms">
      <form class="stack" style="--gap:18px" id="trainForm" (ngSubmit)="train()">
        <div class="field">
          <label for="mn">Model name</label>
          <input id="mn" class="input" name="mn" [(ngModel)]="tName" placeholder="soc-topsoil" />
          <span class="hint">Training again with the same name creates a new version.</span>
        </div>
        <div class="field">
          <label>Features from</label>
          <div class="seg">
            <button type="button" [class.on]="tSource() === 'builtin'" (click)="tSource.set('builtin')">Standard features</button>
            <button type="button" [class.on]="tSource() === 'set'" (click)="tSource.set('set')">A feature set</button>
          </div>
        </div>
        @if (tSource() === 'builtin') {
          <div class="field">
            <label>Features</label>
            <div class="feats">
              @for (f of features; track f.key) {
                <label class="feat" [class.on]="tFeatures[f.key]">
                  <input type="checkbox" [name]="'f_' + f.key" [(ngModel)]="tFeatures[f.key]" />
                  <span><strong>{{ f.label }}</strong><small>{{ f.hint }}</small></span>
                </label>
              }
            </div>
          </div>
        } @else {
          <div class="field">
            <label for="tfs">Feature set</label>
            @if (fsets.loading()) { <vc-loading [rows]="1" /> }
            @else if (fsets.error()) { <vc-error title="Couldn't load feature sets" [message]="fsets.error()!.message" /> }
            @else if (!activeSets().length) {
              <vc-callout tone="info" icon="blocks">No active feature sets yet. Create one on the <strong>Feature sets</strong> tab first.</vc-callout>
            } @else {
              <select id="tfs" class="input" name="tfs" [ngModel]="tSet()" (ngModelChange)="tSet.set($event)">
                @for (f of activeSets(); track f.id) { <option [value]="f.id">{{ f.name }} v{{ f.version }} · {{ f.columns.length }} features</option> }
              </select>
              @if (pickedSet(); as ps) {
                <div class="cols">@for (c of ps.columns; track c) { <code>{{ c }}</code> }</div>
                <span class="hint">Each training sample gets these values as of its own collection date (point-in-time), with a fingerprint kept for audit.</span>
              }
            }
          </div>
        }
        <div class="form-grid">
          <div class="field">
            <label for="sc">Training data</label>
            <select id="sc" class="input" name="sc" [(ngModel)]="tScope">
              <option value="project">This project only</option>
              <option value="all">All projects</option>
            </select>
          </div>
          <div class="field">
            <label for="lam">Regularisation (λ)</label>
            <input id="lam" class="input num" name="lam" type="number" min="0.01" max="1000" step="0.1" [(ngModel)]="tLambda" />
            <span class="hint">Higher is simpler and steadier.</span>
          </div>
        </div>
        @if (notEnough(); as ne) {
          <vc-callout tone="warn" icon="alert">
            <strong>Not enough lab data to train and validate yet.</strong>
            <p class="ne">Validation holds out whole farms, so the model needs at least {{ ne.min_rows }} usable lab results from {{ ne.min_farms }} different farms.</p>
            <div class="ne-grid">
              <div><span>Usable results</span><strong class="num">{{ ne.rows }} <small>of {{ ne.min_rows }}</small></strong></div>
              <div><span>Farms</span><strong class="num">{{ ne.farms }} <small>of {{ ne.min_farms }}</small></strong></div>
            </div>
            @if (ne.excluded.length) {
              <p class="ne small">{{ ne.excluded.length }} sample{{ ne.excluded.length > 1 ? 's were' : ' was' }} left out because a feature was missing, e.g.
                <code>{{ ne.excluded[0].sample_code }}</code> — {{ ne.excluded[0].missing_features.join(', ') }}. Syncing supporting data or satellite passes may help.</p>
            }
          </vc-callout>
        } @else if (trainError()) {
          <vc-error title="Model not trained" [message]="trainError()!" />
        }
      </form>
      <ng-container footer>
        <button class="btn btn-ghost" type="button" (click)="trainOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="trainForm" [disabled]="training() || !canSubmit() || tName.trim().length < 2">
          {{ training() ? 'Training…' : 'Train and validate' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .st{display:flex;gap:6px;flex-wrap:wrap}
    .seg{display:inline-flex;background:var(--sand-100);border-radius:8px;padding:3px;gap:2px;align-self:flex-start}
    .seg button{border:0;background:none;font:500 12.5px var(--font);padding:6px 12px;border-radius:6px;color:var(--stone-600);cursor:pointer}
    .seg button.on{background:var(--surface);color:var(--stone-900);box-shadow:var(--shadow-sm)}
    .cols{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}
    .cols code{font-size:11.5px;padding:2px 6px;border-radius:4px;background:var(--sand-100);color:var(--stone-700)}
    .mn{display:flex;flex-direction:column;line-height:1.35}
    .u{font-size:11px;color:var(--text-3);margin-left:3px}
    .hold{display:inline-flex;align-items:center;gap:5px;color:var(--forest-700)}
    .warn{color:var(--amber-600);font-weight:500}
    .card-foot.left{justify-content:flex-start}
    .feats{display:flex;flex-direction:column;gap:6px}
    .feat{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid var(--border);border-radius:8px;cursor:pointer}
    .feat input{accent-color:var(--primary);width:16px;height:16px;margin-top:2px}
    .feat span{display:flex;flex-direction:column} .feat strong{font-size:13.5px;font-weight:500} .feat small{font-size:12px;color:var(--text-3)}
    .feat.on{border-color:var(--forest-300);background:var(--forest-50)}
    .ne{margin-top:6px}
    .ne-grid{display:flex;gap:28px;margin-top:10px}
    .ne-grid div{display:flex;flex-direction:column} .ne-grid span{font-size:12px;color:var(--text-2)}
    .ne-grid strong{font-size:20px} .ne-grid small{font-size:12px;color:var(--text-3);font-weight:500}
  `],
})
export class ModelsPage {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  ctx = inject(ProjectContext);

  tab = signal(this.route.snapshot.queryParamMap.get('tab') ?? 'models');
  models = new Remote<ModelVersion[]>();
  canManage = computed(() => this.auth.can('models.manage'));
  tabs = computed<TabItem[]>(() => [
    { key: 'models', label: 'Models', count: this.models.data()?.length ?? null },
    { key: 'map', label: 'Soil-carbon map' },
    { key: 'optimiser', label: 'Sampling optimiser' },
    { key: 'emissions', label: 'Emissions estimate' },
    { key: 'features', label: 'Feature sets' },
  ]);
  wallReason = computed(() => this.models.data()?.find(m => m.credit_eligible === false)?.credit_eligible_reason ?? '');
  features = FEATURES;
  alg = algorithmLabel;
  val = validationLabel;

  trainOpen = signal(false);
  training = signal(false);
  trainError = signal<string | null>(null);
  notEnough = signal<NotEnough | null>(null);
  tName = 'soc-topsoil';
  tScope: 'project' | 'all' = 'project';
  tLambda = 1;
  tFeatures: Record<string, boolean> = { ndvi_mean: true, rain_365d: true, elevation_m: true, clay_pct: true };
  chosen = () => FEATURES.filter(f => this.tFeatures[f.key]).map(f => f.key);
  tSource = signal<'builtin' | 'set'>('builtin');
  tSet = signal('');
  fsets = new Remote<FeatureSet[]>();
  activeSets = computed(() => (this.fsets.data() ?? []).filter(f => f.status === 'active'));
  pickedSet = computed(() => this.activeSets().find(f => f.id === this.tSet()) ?? null);
  canSubmit = () => (this.tSource() === 'builtin' ? this.chosen().length > 0 : !!this.pickedSet());

  constructor() {
    this.load();
    effect(() => {
      const act = this.activeSets();
      untracked(() => { if (act.length && !act.some(f => f.id === this.tSet())) this.tSet.set(act[0].id); });
    });
    effect(() => {
      const t = this.tab();
      untracked(() => this.router.navigate([], { queryParams: { tab: t === 'models' ? null : t }, replaceUrl: true }));
    });
  }

  load() {
    this.models.load(this.api.get<ModelVersion[]>('/models'), true);
  }

  openTrain() {
    this.trainError.set(null);
    this.notEnough.set(null);
    this.trainOpen.set(true);
    this.fsets.load(this.api.get<FeatureSet[]>('/feature-sets'), true);
  }

  train() {
    this.training.set(true);
    this.trainError.set(null);
    this.notEnough.set(null);
    this.api.post<ModelVersion>('/models/soc/train', {
      name: this.tName.trim(), ridge_lambda: Number(this.tLambda) || 1,
      ...(this.tSource() === 'set' ? { feature_set_id: this.tSet(), features: [] } : { features: this.chosen() }),
      project_id: this.tScope === 'project' ? this.ctx.currentId() : null,
    }).subscribe({
      next: m => {
        this.training.set(false);
        this.trainOpen.set(false);
        this.toast.success(`${m.name} v${m.version} trained`, `RMSE ${m.metrics.rmse.toFixed(3)} % SOC on held-out farms. It now needs approval.`);
        this.router.navigate(['/app/models', m.id]);
      },
      error: (e: ApiError) => {
        this.training.set(false);
        if (e.code === 'NOT_ENOUGH_DATA') this.notEnough.set(e.details as unknown as NotEnough);
        else this.trainError.set(e.message);
      },
    });
  }
}
