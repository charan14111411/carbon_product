import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { Remote } from '../supporting/shared';
import { DRIFT_LABEL, DRIFT_TONE, DriftReport, ModelVersion } from './types';

interface Review {
  required: boolean; report_id: string; flagged_at: string;
  decision?: 'keep' | 'retire'; note?: string; resolved_by?: string; resolved_at?: string;
}

@Component({
  selector: 'vc-drift-panel',
  imports: [...KIT, FormsModule, NumPipe, DayPipe, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card intro">
      <div class="card-body row wrap" style="--gap:16px">
        <div class="it">
          <h3>Is the model still accurate?</h3>
          <p class="small muted">A drift check predicts SOC for accepted lab results that arrived <strong>after</strong> training and compares them with the lab values.
            A drifting approved model is flagged for review — it is never retired automatically.</p>
          <div class="th small">
            <span><b>Drift</b> if |bias| &gt; 1 residual SD, 90% interval coverage &lt; 80%, or RMSE &gt; 1.5× validation.</span>
            <span><b>Warning</b> at 0.5 SD, 85% or 1.2×.</span>
          </div>
        </div>
        @if (canRun()) {
          <button class="btn btn-primary" (click)="runOpen.set(true)"><vc-icon name="activity" />Run drift check</button>
        }
      </div>
    </section>

    @if (review(); as rv) {
      @if (rv.required) {
        <section class="card review">
          <div class="card-head"><h3><vc-icon name="circle-alert" [size]="16" />Review required</h3><vc-badge status="warning">Open</vc-badge></div>
          <div class="card-body stack" style="--gap:14px">
            <p>A drift check on {{ rv.flagged_at | day }} found this approved model drifting. A reviewer decides whether to keep it in use or retire it.</p>
            <div class="who">
              <div><span class="k">Model trained by</span><strong>{{ name()(model().created_by) }}</strong></div>
              <div><span class="k">Drift check run by</span><strong>{{ name()(flagging()?.created_by ?? null) }}</strong>
                <span class="subtle small">{{ flagging()?.created_at | day: true }}</span></div>
              <div><span class="k">Reviewer</span><strong>{{ isAuthor() ? 'Someone other than you' : 'Any approver except the trainer' }}</strong></div>
            </div>
            @if (!canReview()) {
              <vc-callout tone="info" icon="lock">Only people with model-approval rights can resolve a drift review.</vc-callout>
            } @else if (isAuthor()) {
              <vc-callout tone="info" icon="users">You trained this model, so another person must review it. Four-eyes rule: the model's author can't decide on their own model's drift.</vc-callout>
            } @else {
              <div class="dec">
                <label class="opt" [class.on]="decision === 'keep'"><input type="radio" name="dec" value="keep" [(ngModel)]="decision" />
                  <span><strong>Keep in use</strong><small>The drift is understood or acceptable. The model stays approved.</small></span></label>
                <label class="opt danger" [class.on]="decision === 'retire'"><input type="radio" name="dec" value="retire" [(ngModel)]="decision" />
                  <span><strong>Retire</strong><small>Stop using it for maps and sampling plans. Train a new version.</small></span></label>
              </div>
              <div class="field">
                <label for="rn">Reason <span class="subtle">(required)</span></label>
                <textarea id="rn" class="input" rows="3" [(ngModel)]="note" placeholder="What you checked and why you decided this"></textarea>
                <span class="hint">Recorded in the audit trail with your name.</span>
              </div>
              @if (reviewError()) { <vc-error title="Review not saved" [message]="reviewError()!" /> }
              <div class="row"><span class="spacer"></span>
                <button class="btn" [class.btn-danger]="decision === 'retire'" [class.btn-primary]="decision !== 'retire'"
                  [disabled]="reviewing() || !decision || note.trim().length < 3" (click)="decision === 'retire' ? retireConfirm.set(true) : submitReview()">
                  {{ reviewing() ? 'Saving…' : decision === 'retire' ? 'Retire model…' : 'Keep model' }}</button>
              </div>
            }
          </div>
        </section>
      } @else if (rv.decision) {
        <vc-callout [tone]="rv.decision === 'retire' ? 'warn' : 'ok'" icon="gavel">
          Drift review resolved: <strong>{{ rv.decision === 'retire' ? 'retired' : 'kept in use' }}</strong> by {{ name()(rv.resolved_by ?? null) }}
          on {{ rv.resolved_at | day }}. <span class="muted">“{{ rv.note }}”</span>
        </vc-callout>
      }
    }

    <section class="card">
      <div class="card-head"><h3>Drift reports</h3><span class="subtle small">{{ reports.data()?.length ?? 0 }} checks · newest first</span></div>
      @if (reports.loading()) {
        <vc-loading [rows]="4" />
      } @else if (reports.error()) {
        <div class="card-body"><vc-error title="Couldn't load drift reports" [message]="reports.error()!.message" /></div>
      } @else if (!reports.data()?.length) {
        <vc-empty icon="activity" title="No drift checks yet"
          text="Run a check once new lab results have been accepted since training. At least 3 new results with complete features are needed." />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr>
              <th>Checked</th><th>Result</th><th class="num">New results</th><th class="num">RMSE</th><th class="num">Bias</th>
              <th class="num">Coverage</th><th>Run by</th><th>Action</th><th></th>
            </tr></thead>
            <tbody>
              @for (r of reports.data(); track r.id) {
                <tr class="clickable" [class.sel]="open() === r.id" (click)="open.set(open() === r.id ? null : r.id)">
                  <td class="nowrap small"><span [title]="r.created_at | day: true">{{ r.created_at | ago }}</span></td>
                  <td><vc-badge [status]="tone(r.status)">{{ label(r.status) }}</vc-badge></td>
                  <td class="num">{{ r.n_new }}</td>
                  <td class="num">@if (r.metrics.rmse !== undefined) { {{ r.metrics.rmse | num: 3 }}<span class="u">% SOC</span><div class="subtle small">{{ r.metrics.rmse_ratio | num: 2 }}× validation</div> } @else { — }</td>
                  <td class="num">@if (r.metrics.bias !== undefined) { {{ r.metrics.bias > 0 ? '+' : '' }}{{ r.metrics.bias | num: 3 }}<span class="u">% SOC</span><div class="subtle small">{{ r.metrics.bias_in_residual_sd | num: 2 }} SD</div> } @else { — }</td>
                  <td class="num">@if (r.metrics.coverage !== undefined) { {{ (r.metrics.coverage * 100).toFixed(0) }}% } @else { — }</td>
                  <td class="small">{{ name()(r.created_by) }}</td>
                  <td class="small">@if (r.action === 'review_required') { <span class="warn">Review flagged</span> } @else { <span class="subtle">None</span> }</td>
                  <td class="num"><vc-icon [name]="open() === r.id ? 'chevron-down' : 'chevron-right'" class="subtle" /></td>
                </tr>
                @if (open() === r.id) {
                  <tr class="detail"><td colspan="9">
                    <div class="dd">
                      @if (r.reasons.length) {
                        <ul class="reasons">@for (x of r.reasons; track x) { <li [class.w]="x.startsWith('warning')">{{ x }}</li> }</ul>
                      } @else { <p class="small muted">All checks within thresholds.</p> }
                      @if (r.rows.length) {
                        <table class="table inner">
                          <thead><tr><th>Sample</th><th class="num">Lab SOC <vc-dc cls="MEASURED" /></th><th class="num">Predicted <vc-dc cls="MODELLED" /></th>
                            <th class="num">90% interval</th><th class="num">Residual</th><th>Inside interval</th></tr></thead>
                          <tbody>
                            @for (x of r.rows; track x.sample_code) {
                              <tr>
                                <td class="mono small">{{ x.sample_code }}@if (!x.in_domain) { <span class="ood" title="Feature values outside the training range">outside range</span> }</td>
                                <td class="num">{{ x.lab_soc_pct | num: 3 }}<span class="u">%</span></td>
                                <td class="num">{{ x.predicted_soc_pct | num: 3 }}<span class="u">%</span></td>
                                <td class="num subtle">{{ x.lower | num: 2 }} – {{ x.upper | num: 2 }}</td>
                                <td class="num">{{ x.residual > 0 ? '+' : '' }}{{ x.residual | num: 3 }}</td>
                                <td>@if (x.covered) { <span class="ok">Yes</span> } @else { <span class="warn">No</span> }</td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      }
                      @if (r.metrics.skipped?.length) {
                        <p class="small subtle">{{ r.metrics.skipped!.length }} new result{{ r.metrics.skipped!.length === 1 ? '' : 's' }} skipped for missing features.</p>
                      }
                    </div>
                  </td></tr>
                }
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <vc-modal [(open)]="runOpen" title="Run a drift check" width="480px">
      <div class="stack" style="--gap:12px">
        <p>Compares <strong>{{ model().name }} v{{ model().version }}</strong> with accepted lab results that weren't used to train it, using the standard thresholds above.</p>
        @if (model().status === 'approved') {
          <p class="small muted">If it drifts, the model is flagged for review by someone other than its trainer. It stays approved until then.</p>
        }
        @if (runError()) { <vc-error title="Check didn't run" [message]="runError()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="runOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="running()" (click)="run()">{{ running() ? 'Checking…' : 'Run check' }}</button>
      </ng-container>
    </vc-modal>

    <vc-modal [(open)]="retireConfirm" title="Retire this model?" width="460px">
      <div class="stack" style="--gap:12px">
        <p><strong>{{ model().name }} v{{ model().version }}</strong> will no longer be used for soil-carbon maps or sampling plans. This can't be undone.</p>
        <p class="small muted">Reason recorded: “{{ note.trim() }}”</p>
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="retireConfirm.set(false)">Cancel</button>
        <button class="btn btn-danger" [disabled]="reviewing()" (click)="submitReview()">{{ reviewing() ? 'Retiring…' : 'Retire model' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    :host{display:flex;flex-direction:column;gap:16px}
    .it{flex:1;min-width:280px} .it p{margin-top:4px;max-width:760px}
    .th{display:flex;flex-wrap:wrap;gap:4px 16px;margin-top:8px;color:var(--stone-700)}
    .review{border-color:var(--amber-100)}
    .review h3{display:flex;align-items:center;gap:8px;color:var(--amber-600)}
    .review .card-head{flex:1}
    .who{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border:1px solid var(--border);border-radius:8px}
    .who > div{display:flex;flex-direction:column;gap:2px;padding:10px 14px;border-right:1px solid var(--border)}
    .who > div:last-child{border-right:0}
    @media (max-width:800px){.who{grid-template-columns:1fr}.who > div{border-right:0;border-bottom:1px solid var(--border)}}
    .who .k{font-size:12px;color:var(--text-2);font-weight:500}
    .dec{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    @media (max-width:700px){.dec{grid-template-columns:1fr}}
    .opt{display:flex;gap:10px;align-items:flex-start;padding:12px;border:1px solid var(--border);border-radius:8px;cursor:pointer}
    .opt input{accent-color:var(--primary);margin-top:3px}
    .opt span{display:flex;flex-direction:column} .opt small{font-size:12px;color:var(--text-3)}
    .opt.on{border-color:var(--forest-300);background:var(--forest-50)}
    .opt.danger.on{border-color:var(--red-100);background:var(--danger-soft)}
    .u{font-size:11px;color:var(--text-3);margin-left:3px}
    .warn{color:var(--amber-600);font-weight:500} .ok{color:var(--forest-600);font-weight:500}
    tr.sel td{background:var(--forest-50)}
    tr.detail > td{background:var(--surface-2);padding:0}
    .dd{padding:14px 20px;display:flex;flex-direction:column;gap:10px}
    .reasons{margin:0;padding-left:18px;font-size:13px;color:var(--stone-800)} .reasons li.w{color:var(--stone-600)}
    .inner{background:var(--surface);border:1px solid var(--border);border-radius:8px}
    .ood{margin-left:6px;font:600 10px/1 var(--mono);padding:3px 5px;border-radius:4px;background:var(--amber-100);color:var(--amber-600);text-transform:uppercase}
  `],
})
export class DriftPanel {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  model = input.required<ModelVersion>();
  name = input.required<(id: string | null) => string>();
  changed = output<void>();

  reports = new Remote<DriftReport[]>();
  open = signal<string | null>(null);
  canRun = computed(() => this.auth.can('models.manage'));
  canReview = computed(() => this.auth.can('models.approve'));
  isAuthor = computed(() => this.model().created_by === this.auth.profile()?.id);
  review = computed(() => ((this.model().metrics as unknown as { review?: Review }).review ?? null));
  flagging = computed(() => {
    const id = this.review()?.report_id;
    return (this.reports.data() ?? []).find(r => r.id === id) ?? null;
  });

  runOpen = signal(false);
  running = signal(false);
  runError = signal<string | null>(null);
  decision: 'keep' | 'retire' | '' = '';
  note = '';
  reviewing = signal(false);
  reviewError = signal<string | null>(null);
  retireConfirm = signal(false);

  constructor() {
    effect(() => {
      const id = this.model().id;
      untracked(() => this.reports.load(this.api.get<DriftReport[]>(`/models/${id}/drift`), true));
    });
  }

  tone(s: string) { return DRIFT_TONE[s] ?? s; }
  label(s: string) { return DRIFT_LABEL[s] ?? s; }

  run() {
    this.running.set(true);
    this.runError.set(null);
    this.api.post<DriftReport>(`/models/${this.model().id}/drift-check`, {}).subscribe({
      next: r => {
        this.running.set(false);
        this.runOpen.set(false);
        this.open.set(r.id);
        this.toast.success(`Drift check: ${this.label(r.status).toLowerCase()}`,
          r.action === 'review_required' ? 'The model is flagged for review by another person.' : `${r.n_new} new lab results compared.`);
        this.changed.emit();
      },
      error: (e: ApiError) => { this.running.set(false); this.runError.set(e.message); },
    });
  }

  submitReview() {
    if (!this.decision) return;
    this.reviewing.set(true);
    this.reviewError.set(null);
    this.api.post<ModelVersion>(`/models/${this.model().id}/drift-review`, { decision: this.decision, note: this.note.trim() }).subscribe({
      next: m => {
        this.reviewing.set(false);
        this.retireConfirm.set(false);
        this.toast.success(m.status === 'retired' ? 'Model retired' : 'Model kept in use', 'Your decision is recorded in the audit trail.');
        this.decision = '';
        this.note = '';
        this.changed.emit();
      },
      error: (e: ApiError) => {
        this.reviewing.set(false);
        this.retireConfirm.set(false);
        this.reviewError.set(e.code === 'SELF_APPROVAL_REJECTED'
          ? `${e.message} You trained this model, so another person must review its drift.` : e.message);
      },
    });
  }
}
