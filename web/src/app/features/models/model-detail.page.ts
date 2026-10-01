import { ChangeDetectionStrategy, Component, computed, inject, input, signal, effect, untracked } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT, TabItem } from '../../ui/kit';
import { DriftPanel } from './drift.panel';
import { InformingWall } from './informing-wall';
import { Remote } from '../supporting/shared';
import { ModelVersion, algorithmLabel, featureLabel, validationLabel } from './types';

interface UserLite { id: string; full_name: string; role_label: string }

@Component({
  selector: 'vc-model-detail',
  imports: [...KIT, RouterLink, NumPipe, DayPipe, DriftPanel, InformingWall],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/app/models" class="back"><vc-icon name="arrow-left" [size]="14" />All models</a>
    @if (st.loading()) {
      <div class="card"><vc-loading [rows]="8" /></div>
    } @else if (st.error()) {
      <vc-error title="Couldn't load the model" [message]="st.error()!.message" />
    } @else if (m(); as m) {
      <vc-page-header [title]="m.name + ' · version ' + m.version" [subtitle]="alg(m.algorithm) + ' · ' + m.features.length + ' features · ' + (m.notes ?? '')">
        <div actions class="row" style="--gap:8px">
          <vc-dc cls="MODELLED" />
          <vc-badge [status]="m.status" />
          @if (m.review_required) { <vc-badge status="warning">Drift review needed</vc-badge> }
          @if (m.status === 'candidate' && canApprove()) {
            <button class="btn btn-primary" [disabled]="isAuthor()" [title]="isAuthor() ? 'You trained this model, so someone else must approve it' : ''" (click)="confirmOpen.set(true)">
              <vc-icon name="check-circle" />Approve model</button>
          }
        </div>
      </vc-page-header>

      <vc-informing-wall [reason]="m.credit_eligible === false ? m.credit_eligible_reason : ''" />

      <vc-tabs [tabs]="tabs()" [(active)]="tab" />

      @if (tab() === 'drift') {
        <vc-drift-panel [model]="m" [name]="nameFn" (changed)="load(id(), true)" />
      } @else {
      <div class="who card">
        <div><span class="k">Trained by</span><strong>{{ name(m.created_by) }}</strong><span class="subtle small">{{ m.created_at | day: true }}</span></div>
        <div><span class="k">Approved by</span>
          @if (m.approved_by) { <strong>{{ name(m.approved_by) }}</strong><span class="subtle small">{{ m.approved_at | day: true }}</span> }
          @else { <strong class="muted">Not yet approved</strong><span class="subtle small">A second person must approve</span> }
        </div>
        <div><span class="k">Training data</span><strong class="num">{{ m.training_summary?.rows ?? m.training_rows }} lab results</strong>
          <span class="subtle small num">{{ m.training_summary?.farms }} farms · {{ m.training_summary?.fields }} fields</span></div>
        <div><span class="k">Target</span><strong>Top-layer SOC %</strong><span class="subtle small">Accepted lab results · <vc-dc cls="MEASURED" /></span></div>
      </div>
      @if (m.status === 'candidate' && isAuthor() && canApprove()) {
        <vc-callout tone="info" icon="users">You trained this model, so you can't approve it yourself. Four-eyes review: another person with approval rights must check the validation below and approve it.</vc-callout>
      }

      <div class="metrics">
        <div class="mc"><span class="k">RMSE</span><strong class="num">{{ m.metrics.rmse | num: 3 }}<small>% SOC</small></strong><p>Typical size of an error, with large misses weighted more.</p></div>
        <div class="mc"><span class="k">MAE</span><strong class="num">{{ m.metrics.mae | num: 3 }}<small>% SOC</small></strong><p>Average absolute difference from the lab value.</p></div>
        <div class="mc"><span class="k">Bias</span><strong class="num">{{ m.metrics.bias > 0 ? '+' : '' }}{{ m.metrics.bias | num: 3 }}<small>% SOC</small></strong><p>{{ m.metrics.bias > 0 ? 'Tends to over-predict' : m.metrics.bias < 0 ? 'Tends to under-predict' : 'No systematic lean' }} — closer to zero is better.</p></div>
        <div class="mc"><span class="k">R²</span><strong class="num">{{ m.metrics.r2 | num: 2 }}</strong><p>Share of the variation between samples the model explains (1 = all).</p></div>
        <div class="mc" [class.warn]="m.metrics.coverage_90 < 0.8">
          <span class="k">90% interval coverage</span><strong class="num">{{ (m.metrics.coverage_90 * 100).toFixed(0) }}<small>%</small></strong>
          <p>How often the lab value fell inside the predicted range. The aim is about 90%.</p>
        </div>
      </div>

      <div class="grid split">
        <section class="card">
          <div class="card-head"><h3>How it was validated</h3><span class="hold"><vc-icon name="shield" [size]="14" />{{ val(m.validation, m.metrics.k) }}</span></div>
          <div class="card-body stack" style="--gap:14px">
            <p class="expl">Samples from the same farm are alike, so testing on them would flatter the model. Instead, <strong>whole farms are held out</strong>:
              the farms are split into {{ m.metrics.k }} groups; the model is trained {{ m.metrics.k }} times, each time without one group, and tested on the farms it never saw.
              Every metric above comes from those held-out predictions.</p>
            <div class="folds">
              @for (f of m.metrics.folds ?? []; track f.fold) {
                <div class="fold">
                  <div class="fh"><strong>Fold {{ f.fold + 1 }}</strong><span class="subtle small num">{{ f.farms.length }} farm{{ f.farms.length === 1 ? '' : 's' }} · {{ f.n_test }} samples held out</span></div>
                  <div class="fm num"><span>RMSE {{ f.rmse | num: 3 }}</span><span>MAE {{ f.mae | num: 3 }}</span></div>
                  <div class="fb"><span [style.width.%]="foldW(f.rmse)"></span></div>
                </div>
              }
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head"><h3>What drives the prediction</h3><span class="small subtle">Standardised coefficients</span></div>
          <div class="card-body">
            @for (c of coefs(); track c.key) {
              <div class="co">
                <span class="cl">{{ c.label }}</span>
                <span class="cb"><span class="mid"></span><span class="fill" [class.neg]="c.v < 0" [style.width.%]="c.w / 2" [style.left.%]="c.v < 0 ? 50 - c.w / 2 : 50"></span></span>
                <span class="cv num">{{ c.v > 0 ? '+' : '' }}{{ c.v | num: 3 }}</span>
              </div>
            } @empty { <p class="muted small">Coefficients aren't available for this model.</p> }
            <p class="small subtle" style="margin-top:12px">Positive means higher values of the feature go with higher predicted SOC. Ridge λ = {{ m.params?.lambda }}.</p>
          </div>
        </section>
      </div>

      @if (m.training_summary?.excluded?.length) {
        <section class="card">
          <div class="card-head"><h3>Samples left out of training</h3><span class="subtle small">{{ m.training_summary!.excluded.length }}</span></div>
          <div class="table-wrap">
            <table class="table"><thead><tr><th>Sample</th><th>Missing</th></tr></thead>
              <tbody>@for (e of m.training_summary!.excluded.slice(0, showAllEx() ? 200 : 6); track e.sample_code) {
                <tr><td class="mono small">{{ e.sample_code }}</td><td class="muted small">{{ feats(e.missing_features) }}</td></tr>
              }</tbody></table>
          </div>
          @if (m.training_summary!.excluded.length > 6) {
            <div class="card-foot"><span class="small muted" style="margin-right:auto">These samples had a feature value missing on their collection date, so they couldn't be used.</span>
              <button class="btn btn-ghost btn-sm" (click)="showAllEx.set(!showAllEx())">{{ showAllEx() ? 'Show fewer' : 'Show all ' + m.training_summary!.excluded.length }}</button></div>
          }
        </section>
      }
      }
    }

    <vc-modal [(open)]="confirmOpen" title="Approve this model?" width="480px">
      <div class="stack" style="--gap:12px">
        <p>Approving <strong>{{ m()?.name }} v{{ m()?.version }}</strong> lets it be used for soil-carbon maps and sampling plans. Any previously approved version of this model is retired.</p>
        <p class="muted small">Its predictions stay MODELLED — they never feed a carbon calculation.</p>
        @if (approveError()) { <vc-error title="Not approved" [message]="approveError()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="confirmOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="approving()" (click)="approve()">{{ approving() ? 'Approving…' : 'Approve model' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .back{display:inline-flex;align-items:center;gap:6px;font-size:13px;margin-bottom:12px;color:var(--text-2)}
    .who{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin-bottom:16px}
    .who > div{display:flex;flex-direction:column;gap:2px;padding:14px 18px;border-right:1px solid var(--border)}
    .who > div:last-child{border-right:0}
    .who .k,.mc .k{font-size:12px;color:var(--text-2);font-weight:500}
    @media (max-width:1000px){.who{grid-template-columns:repeat(2,minmax(0,1fr))}}
    vc-callout{margin-bottom:16px}
    .metrics{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-bottom:16px}
    @media (max-width:1200px){.metrics{grid-template-columns:repeat(3,minmax(0,1fr))}}
    .mc{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;box-shadow:var(--shadow-sm)}
    .mc strong{display:block;font-size:24px;font-weight:600;letter-spacing:-.02em;margin:6px 0 4px}
    .mc strong small{font-size:12px;color:var(--text-3);font-weight:500;margin-left:4px;letter-spacing:0}
    .mc p{font-size:12px;color:var(--text-3);line-height:1.4}
    .mc.warn{border-top:3px solid var(--amber-600)}
    .split{grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start;margin-bottom:16px}
    @media (max-width:1100px){.split{grid-template-columns:1fr}}
    .hold{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;color:var(--forest-700);font-weight:500}
    .expl{color:var(--stone-700);font-size:13.5px}
    .folds{display:flex;flex-direction:column;gap:8px}
    .fold{padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:var(--surface-2)}
    .fh{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}
    .fm{display:flex;gap:14px;font-size:12px;color:var(--stone-700);margin-top:4px}
    .fb{height:4px;border-radius:2px;background:var(--sand-200);margin-top:6px;overflow:hidden} .fb span{display:block;height:100%;background:var(--forest-400)}
    .co{display:grid;grid-template-columns:180px 1fr 64px;gap:12px;align-items:center;padding:6px 0}
    .cl{font-size:13px;color:var(--stone-800)}
    .cb{position:relative;height:10px;border-radius:5px;background:var(--sand-100)}
    .cb .mid{position:absolute;left:50%;top:-3px;bottom:-3px;width:1px;background:var(--stone-300)}
    .cb .fill{position:absolute;top:0;bottom:0;border-radius:5px;background:var(--forest-500)}
    .cb .fill.neg{background:var(--clay-500)}
    .cv{text-align:right;font-size:12.5px;color:var(--stone-700)}
  `],
})
export class ModelDetailPage {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  id = input.required<string>();

  st = new Remote<{ model: ModelVersion; users: UserLite[] }>();
  m = computed(() => this.st.data()?.model ?? null);
  private users = computed(() => new Map((this.st.data()?.users ?? []).map(u => [u.id, u])));
  canApprove = computed(() => this.auth.can('models.approve'));
  isAuthor = computed(() => !!this.m() && this.m()!.created_by === this.auth.profile()?.id);
  alg = algorithmLabel;
  val = validationLabel;

  coefs = computed(() => {
    const p = this.m()?.params;
    if (!p?.coefficients_standardised) return [];
    const vals = p.features.map((k, i) => ({ key: k, label: featureLabel(k), v: p.coefficients_standardised[i] }));
    const max = Math.max(...vals.map(v => Math.abs(v.v)), 1e-9);
    return vals.map(v => ({ ...v, w: (Math.abs(v.v) / max) * 100 })).sort((a, b) => Math.abs(b.v) - Math.abs(a.v));
  });
  private maxFold = computed(() => Math.max(...(this.m()?.metrics.folds ?? []).map(f => f.rmse ?? 0), 1e-9));

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  tab = signal(this.route.snapshot.queryParamMap.get('tab') === 'drift' ? 'drift' : 'overview');
  tabs = computed<TabItem[]>(() => [
    { key: 'overview', label: 'Validation' },
    { key: 'drift', label: this.m()?.review_required ? 'Drift · review needed' : 'Drift checks' },
  ]);
  nameFn = (id: string | null) => this.name(id);

  showAllEx = signal(false);
  confirmOpen = signal(false);
  approving = signal(false);
  approveError = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.id();
      untracked(() => this.load(id));
    });
    effect(() => {
      const t = this.tab();
      untracked(() => this.router.navigate([], { queryParams: { tab: t === 'drift' ? 'drift' : null }, replaceUrl: true }));
    });
  }

  load(id = this.id(), keep = false) {
    this.st.load(forkJoin({
      model: this.api.get<ModelVersion>(`/models/${id}`),
      users: this.api.get<UserLite[]>('/users').pipe(catchError(() => of([] as UserLite[]))),
    }), keep);
  }

  name(id: string | null) {
    if (!id) return 'System';
    if (id === this.auth.profile()?.id) return 'You';
    return this.users().get(id)?.full_name ?? 'Another team member';
  }
  foldW(v: number | undefined) { return ((v ?? 0) / this.maxFold()) * 100; }
  feats(f: string[]) { return f.map(featureLabel).join(', '); }

  approve() {
    this.approving.set(true);
    this.approveError.set(null);
    this.api.post<ModelVersion>(`/models/${this.id()}/approve`).subscribe({
      next: m => {
        this.approving.set(false);
        this.confirmOpen.set(false);
        this.toast.success('Model approved', `${m.name} v${m.version} can now be used for soil-carbon maps.`);
        this.load(this.id(), true);
      },
      error: (e: ApiError) => {
        this.approving.set(false);
        this.approveError.set(e.code === 'SELF_APPROVAL_REJECTED'
          ? `${e.message} Four-eyes rule: the person who trained a model can't approve it.` : e.message);
      },
    });
  }
}
