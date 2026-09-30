import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, HumanPipe, NumPipe, fmtDate } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Chart } from '../../ui/chart';
import { Icon } from '../../ui/icon';
import {
  Badge, Callout, DataClass, ErrorBox, Hash, Loading, Modal, PageHeader, TabItem, Tabs, Timeline, TimelineItem,
} from '../../ui/kit';
import { CalcBlocker } from './blocker';
import { EvidenceBrief, Provenance, RunDetail, StratumResult, TERM_STATUS, openBlob, ruleSource, ruleValue, termLabel } from './calc.types';
import { ProvenanceTree } from './provenance-tree';
import { waterfallOption, waterfallSteps } from './waterfall';

type Action = 'submit' | 'approve' | 'reject' | 'package' | null;

@Component({
  selector: 'vc-run-detail',
  imports: [
    FormsModule, RouterLink, PageHeader, Icon, Badge, DataClass, Hash, Loading, ErrorBox, Callout, Modal, Tabs, Timeline,
    Chart, ProvenanceTree, CalcBlocker, NumPipe, DayPipe, HumanPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/app/calculations" class="back"><vc-icon name="arrow-left" [size]="14" />All calculations</a>

    @if (loading()) {
      <section class="card"><vc-loading [rows]="8" /></section>
    } @else if (error()) {
      <vc-error title="Couldn't load this calculation" [message]="error()!" />
    } @else if (run(); as r) {
      <vc-page-header [title]="'Period ' + r.period_label" eyebrow="Calculation run"
        [subtitle]="(r.period_start | day) + ' – ' + (r.period_end | day) + ' · ' + r.results.design + ' design · ' + stockMethod() + ' · engine v' + r.engine_version">
        <span actions class="hdr-badge"><vc-badge [status]="r.status" /></span>
        @if (canReplace()) {
          <button actions class="btn btn-secondary" (click)="replace()"><vc-icon name="refresh" />Recalculate as replacement</button>
        }
      </vc-page-header>

      <!-- status stepper -->
      <section class="card stepper">
        @for (s of steps(); track s.key; let last = $last) {
          <div class="step" [class]="'step s-' + s.state">
            <span class="dot">@if (s.state === 'done') { <vc-icon name="check" [size]="12" [stroke]="2.5" /> } @else if (s.state === 'bad') { <vc-icon name="x" [size]="12" [stroke]="2.5" /> }</span>
            <div class="st">
              <strong>{{ s.label }}</strong>
              <span>{{ s.meta }}</span>
            </div>
          </div>
          @if (!last) { <span class="bar" [class.done]="s.state === 'done'"></span> }
        }
      </section>

      <!-- action bar -->
      @if (actions().length || fourEyes()) {
        <section class="card actionbar">
          <div class="ab-t">
            <strong>{{ actionTitle() }}</strong>
            <span class="muted small">{{ actionText() }}</span>
          </div>
          @if (fourEyes()) {
            <span class="fe"><vc-icon name="users" [size]="14" />{{ fourEyes() }}</span>
          }
          <div class="ab-a">
            @if (actions().includes('submit')) { <button class="btn btn-primary" (click)="startAction('submit')"><vc-icon name="send" />Send for review</button> }
            @if (actions().includes('reject')) { <button class="btn btn-secondary" [disabled]="mine()" (click)="startAction('reject')"><vc-icon name="x" />Reject</button> }
            @if (actions().includes('approve')) { <button class="btn btn-primary" [disabled]="mine()" (click)="startAction('approve')"><vc-icon name="check" />Approve</button> }
            @if (actions().includes('package')) { <button class="btn btn-accent" [disabled]="mine()" (click)="startAction('package')"><vc-icon name="package" />Issue verification package</button> }
          </div>
        </section>
      }

      <!-- flags -->
      @if (r.results.flags['carbon_lost']) {
        <vc-callout tone="danger" icon="trend-down" class="flag">
          <strong>Soil carbon did not increase over this period.</strong>
          The net result before uncertainty is {{ r.results.net_before_uncertainty_t_co2e | num: 1 }} tCO₂e. It is reported exactly as measured — never
          rounded up to zero — and no credits arise. No uncertainty deduction or buffer is applied to a loss.
        </vc-callout>
      }
      @if (r.results.flags['high_uncertainty']) {
        <vc-callout tone="warn" icon="alert" class="flag">
          <strong>High uncertainty.</strong> The uncertainty deduction is {{ deductionPct() | num: 1 }}% of the result before uncertainty (the review threshold is 15%).
          More sampling sites per zone would narrow it and release more credits.
        </vc-callout>
      }
      @if (r.results.flags['unpaired_sites_excluded']) {
        <vc-callout tone="info" icon="info" class="flag">Some sites were sampled in only one campaign and were excluded from the paired comparison, as the rules require. They are listed per zone below.</vc-callout>
      }
      @if (r.supersedes_run_id) {
        <vc-callout tone="info" icon="history" class="flag">This run replaces <a [routerLink]="['/app/calculations', r.supersedes_run_id]">an earlier run</a> for the same period. When approved, the earlier run is marked superseded.</vc-callout>
      }

      <vc-tabs [tabs]="tabs" [(active)]="tab" />

      @switch (tab()) {
        @case ('result') {
          <div class="hero">
            <div class="net card">
              <div class="nl">Net credits <vc-dc cls="CALCULATED" /></div>
              <div class="nv num" [class.neg]="r.net_t_co2e < 0">{{ r.net_t_co2e | num: 1 }}<span>tCO₂e</span></div>
              <div class="ns">After a {{ r.uncertainty_deduction_t_co2e | num: 1 }} t uncertainty deduction and a {{ r.buffer_t_co2e | num: 1 }} t buffer contribution.</div>
            </div>
            <div class="card split">
              <div class="sh"><span>Reductions vs removals</span><vc-dc cls="CALCULATED" /></div>
              @if (splitTotal() > 0) {
                <div class="sbar">
                  <span class="er" [style.flex-grow]="r.reductions_t_co2e"></span>
                  <span class="cr" [style.flex-grow]="r.removals_t_co2e"></span>
                </div>
              }
              <div class="sg">
                <div><span class="sw er"></span><div><strong class="num">{{ r.reductions_t_co2e | num: 1 }} t</strong><span>Emission reductions</span><small>Avoided emissions and prevented losses</small></div></div>
                <div><span class="sw cr"></span><div><strong class="num">{{ r.removals_t_co2e | num: 1 }} t</strong><span>Carbon removals</span><small>New carbon stored in the soil</small></div></div>
              </div>
            </div>
          </div>

          <section class="card">
            <div class="card-head"><h3>From measured change to credits</h3><vc-dc cls="CALCULATED" /></div>
            <div class="wf">
              <vc-chart [option]="wfOption()" height="320px" />
              <table class="table steps">
                <tbody>
                  @for (s of wfSteps(); track s.key) {
                    <tr [class.tot]="s.kind === 'start' || s.kind === 'end'">
                      <td><span class="sw" [class]="'sw w-' + s.kind"></span>{{ s.label }}</td>
                      <td class="num nowrap">
                        @if (s.kind === 'start' || s.kind === 'end') { <strong>{{ s.total | num: 1 }}</strong> }
                        @else { {{ s.delta >= 0 ? '+' : '−' }}{{ abs(s.delta) | num: 1 }} }
                        <span class="u">t</span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>

          <div class="grid grid-2 two">
            <section class="card">
              <div class="card-head"><h3>How the uncertainty deduction was set</h3></div>
              <div class="card-body unc">
                @if (r.results.t_value !== null) {
                  <p>
                    The measured result carries sampling error. Combining the variance of every zone and every decided term gives a
                    <strong>standard error of {{ r.results.se_t_co2e | num: 1 }} tCO₂e</strong>, with
                    <strong>{{ r.results.df_effective | num: 1 }} effective degrees of freedom</strong>.
                  </p>
                  <p>
                    To be {{ r.results.confidence * 100 | num: 0 }}% confident that credits are not over-stated, the engine uses the one-sided
                    Student-t value for those degrees of freedom, <strong>t = {{ r.results.t_value | num: 3 }}</strong>, and deducts
                    t × SE = <strong>{{ r.results.uncertainty_deduction_t_co2e | num: 1 }} tCO₂e</strong>
                    ({{ deductionPct() | num: 1 }}% of the {{ r.results.net_before_uncertainty_t_co2e | num: 1 }} t result before uncertainty).
                  </p>
                  <dl class="kv">
                    <dt>Total variance</dt><dd class="num">{{ r.results.total_variance | num: 1 }} (tCO₂e)²</dd>
                    <dt>Standard error (SE)</dt><dd class="num">{{ r.results.se_t_co2e | num: 2 }} tCO₂e</dd>
                    <dt>Degrees of freedom</dt><dd class="num">{{ r.results.df_effective | num: 2 }} (Welch–Satterthwaite)</dd>
                    <dt>Confidence</dt><dd class="num">{{ r.results.confidence * 100 | num: 1 }}% one-sided</dd>
                    <dt>t value</dt><dd class="num">{{ r.results.t_value | num: 4 }}</dd>
                    <dt>Deduction</dt><dd class="num"><strong>{{ r.results.uncertainty_deduction_t_co2e | num: 2 }} tCO₂e</strong></dd>
                  </dl>
                } @else {
                  <p>No uncertainty deduction applies: the result is not positive, so there is nothing to over-state. The loss is reported as measured.</p>
                }
              </div>
            </section>
            <section class="card">
              <div class="card-head"><h3>Decided terms used</h3></div>
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Term</th><th class="num">Value</th><th class="num">Variance</th><th>How used</th></tr></thead>
                  <tbody>
                    @for (t of r.results.terms; track t.term) {
                      <tr>
                        <td>{{ termLabel(t.term) }}</td>
                        <td class="num nowrap">{{ t.value_t_co2e | num: 2 }} <span class="u">t</span></td>
                        <td class="num">{{ t.variance | num: 2 }}</td>
                        <td class="small muted">{{ termStatus(t.status) }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <div class="card-body buf small muted">
                Non-permanence buffer: {{ r.results.non_permanence_risk_pct | num: 1 }}% of the result after uncertainty is held back in the pooled buffer
                against future reversal ({{ r.buffer_t_co2e | num: 1 }} tCO₂e).
              </div>
            </section>
          </div>
        }

        @case ('zones') {
          <section class="card">
            <div class="card-head"><h3>Result per zone</h3><vc-dc cls="CALCULATED" /><span class="subtle small">Stocks in t C/ha to the required depth ({{ stockMethod() }})</span></div>
            <div class="table-wrap">
              <table class="table">
                <thead><tr>
                  <th>Zone</th><th>Role</th><th class="num">Area</th><th class="num">n used</th>
                  <th class="num">Baseline <span class="thu">t C/ha</span></th><th class="num">Monitoring <span class="thu">t C/ha</span></th><th class="num">Change <span class="thu">t C/ha</span></th>
                  <th class="num">Variance</th><th class="num">SE</th><th class="num">df</th><th>Excluded sites</th>
                </tr></thead>
                <tbody>
                  @for (s of zones(); track s.code) {
                    <tr>
                      <td><strong>{{ s.code }}</strong><div class="subtle small">{{ zoneName(s.code) }}</div></td>
                      <td>
                        {{ s.role | human }}
                        @if (s.control_code) { <div class="subtle small">netted against {{ s.control_code }}</div> }
                      </td>
                      <td class="num nowrap">{{ s.area_ha | num: 1 }} <span class="u">ha</span></td>
                      <td class="num">{{ s.n_used }}<div class="subtle small">{{ s.n_baseline }} / {{ s.n_monitoring }}</div></td>
                      <td class="num nowrap">{{ s.mean_baseline_t_c_ha | num: 2 }}</td>
                      <td class="num nowrap">{{ s.mean_monitoring_t_c_ha | num: 2 }}</td>
                      <td class="num nowrap"><strong [class.neg]="s.delta_t_c_ha < 0">{{ s.delta_t_c_ha >= 0 ? '+' : '' }}{{ s.delta_t_c_ha | num: 3 }}</strong></td>
                      <td class="num">{{ s.variance | num: 4 }}</td>
                      <td class="num">{{ s.se | num: 3 }}</td>
                      <td class="num">{{ s.df | num: 1 }}</td>
                      <td>@if (s.excluded_sites.length) { <span class="exc" [title]="s.excluded_sites.join(', ')">{{ s.excluded_sites.length }} site(s)</span> } @else { <span class="subtle">None</span> }</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <div class="card-foot foot small muted">
              n used counts paired sites (paired design) or all cores (independent design); the small figures show baseline / monitoring cores.
              Area-weighted total: {{ r.results.dsoc_t_c | num: 1 }} t C = {{ r.results.dsoc_t_co2e | num: 1 }} tCO₂e.
            </div>
          </section>
        }

        @case ('inputs') {
          <section class="card">
            <div class="card-head"><h3>Inputs fingerprint</h3></div>
            <div class="card-body">
              <p class="muted small fp">
                Every input (samples, layers, accepted lab results, zones, terms) and every rule was frozen when this run was created.
                The SHA-256 fingerprint below is computed over that snapshot. Re-running the engine on the same snapshot always gives the same result.
              </p>
              <vc-hash [value]="r.snapshot_sha256" [full]="true" />
              <dl class="kv fpkv">
                <dt>Methodology</dt><dd>{{ r.rules_snapshot.methodology }}</dd>
                <dt>Baseline campaign</dt><dd>{{ r.inputs_snapshot.sources.campaigns.baseline.code }} ({{ r.inputs_snapshot.sources.campaigns.baseline.design }})</dd>
                <dt>Monitoring campaign</dt><dd>{{ r.inputs_snapshot.sources.campaigns.monitoring.code }} ({{ r.inputs_snapshot.sources.campaigns.monitoring.design }})</dd>
                <dt>Samples · layers frozen</dt><dd class="num">{{ count(r.inputs_snapshot.sources.samples) }} · {{ count(r.inputs_snapshot.sources.layers) }}</dd>
                <dt>Engine version</dt><dd>{{ r.engine_version }}</dd>
              </dl>
            </div>
          </section>
          <section class="card rules">
            <div class="card-head">
              <h3>Rules snapshot</h3>
              <span class="subtle small">{{ rules().length }} rules</span>
              <button class="btn btn-ghost btn-sm" (click)="rulesOpen.set(!rulesOpen())">{{ rulesOpen() ? 'Collapse' : 'Show all' }}<vc-icon [name]="rulesOpen() ? 'chevron-down' : 'chevron-right'" [size]="14" /></button>
            </div>
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Rule</th><th>Value</th><th>Source</th></tr></thead>
                <tbody>
                  @for (x of (rulesOpen() ? rules() : rules().slice(0, 6)); track x.key) {
                    <tr><td><code class="rk">{{ x.key }}</code></td><td>{{ x.value }}</td><td class="muted small">{{ x.source }}</td></tr>
                  }
                </tbody>
              </table>
            </div>
            @if (!rulesOpen() && rules().length > 6) {
              <div class="card-foot"><button class="btn btn-ghost btn-sm" (click)="rulesOpen.set(true)">Show {{ rules().length - 6 }} more rules</button></div>
            }
          </section>
        }

        @case ('provenance') {
          <section class="card prov">
            <div class="card-head">
              <h3>Provenance explorer</h3>
              <span class="subtle small">Every number traced back to the rule, sample, lab result and certificate it came from.</span>
            </div>
            @if (provLoading()) { <vc-loading [rows]="8" /> }
            @else if (provError()) { <div class="card-body"><vc-error title="Couldn't load provenance" [message]="provError()!" /></div> }
            @else if (prov(); as p) { <vc-provenance-tree [data]="p" (openFile)="openFile($event)" /> }
          </section>
        }

        @case ('history') {
          <section class="card">
            <div class="card-head"><h3>Status history</h3></div>
            <div class="card-body"><vc-timeline [items]="timeline()" /></div>
          </section>
        }
      }

      <!-- action modal -->
      <vc-modal [open]="!!action()" (closed)="action.set(null)" [title]="modalTitle()" width="560px">
        @if (action() === 'submit') {
          <p>The run will be locked for review. A colleague with approval rights then approves or rejects it.</p>
        }
        @if (action() === 'approve') {
          <p>Approving creates field claims for {{ r.period_start | day }} – {{ r.period_end | day }}, so the same fields can't be credited twice for an overlapping period.</p>
          <div class="field mt"><label>Note <span class="subtle">(optional)</span></label>
            <textarea class="input" [(ngModel)]="note" rows="3" placeholder="e.g. Checked zone Z2 outlier core against the lab re-run; accepted."></textarea></div>
        }
        @if (action() === 'reject') {
          <p>Say what needs to change so the analyst can fix it and recalculate.</p>
          <div class="field mt"><label>Reason</label>
            <textarea class="input" [(ngModel)]="note" rows="3" placeholder="At least 5 characters"></textarea></div>
        }
        @if (action() === 'package') {
          <p>A sealed verification package is built from this approved run: every rule, zone, sample, custody event, lab result, certificate and the full calculation, with a SHA-256 fingerprint on every page.</p>
        }
        <dl class="kv mt small">
          <dt>Run created by</dt><dd>{{ r.created_by_name }} on {{ r.created_at | day: true }}</dd>
          <dt>Net result</dt><dd class="num">{{ r.net_t_co2e | num: 2 }} tCO₂e</dd>
        </dl>
        @if (action() !== 'submit') {
          <vc-callout tone="info" icon="users" class="mt">Four-eyes rule: the person who created a run can't approve it, reject it or package it.</vc-callout>
        }
        @if (actionError()) { <div class="mt"><vc-calc-blocker [error]="actionError()" /></div> }
        <ng-container footer>
          <button class="btn btn-ghost" (click)="action.set(null)">Cancel</button>
          <button class="btn" [class.btn-primary]="action() !== 'reject'" [class.btn-danger]="action() === 'reject'"
            [disabled]="busy() || (action() === 'reject' && note.trim().length < 5)" (click)="confirm()">
            {{ busy() ? 'Working…' : confirmLabel() }}
          </button>
        </ng-container>
      </vc-modal>
    }
  `,
  styles: [`
    .back{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-2);margin-bottom:12px}
    .hdr-badge{display:inline-flex;align-items:center;margin-right:4px}
    .stepper{display:flex;align-items:center;gap:0;padding:16px 20px;margin-bottom:16px}
    .step{display:flex;align-items:center;gap:10px;min-width:0}
    .dot{flex:none;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;border:2px solid var(--stone-300);background:var(--surface);color:#fff}
    .s-done .dot{background:var(--forest-500);border-color:var(--forest-500)}
    .s-current .dot{border-color:var(--sky-600);box-shadow:0 0 0 4px var(--sky-100)}
    .s-bad .dot{background:var(--red-600);border-color:var(--red-600)}
    .s-muted .dot{background:var(--stone-400);border-color:var(--stone-400)}
    .st{display:flex;flex-direction:column;line-height:1.3;min-width:0}
    .st strong{font-size:13.5px;font-weight:600} .st span{font-size:12px;color:var(--text-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .s-pending .st strong{color:var(--text-3);font-weight:500}
    .bar{flex:1;height:2px;min-width:24px;margin:0 14px;background:var(--sand-300);border-radius:1px}
    .bar.done{background:var(--forest-400)}
    .actionbar{display:flex;align-items:center;gap:16px;padding:14px 20px;margin-bottom:16px;flex-wrap:wrap;border-left:3px solid var(--forest-500)}
    .ab-t{flex:1;min-width:240px;display:flex;flex-direction:column}
    .fe{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:var(--amber-600);background:var(--warn-soft);padding:5px 10px;border-radius:6px}
    .ab-a{display:flex;gap:8px;flex-wrap:wrap}
    .flag{margin-bottom:12px;display:flex}
    vc-tabs{margin-top:8px}
    .hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:16px;margin-bottom:16px}
    @media (max-width: 1000px){.hero{grid-template-columns:1fr}}
    .net{padding:20px 22px;background:linear-gradient(135deg,var(--forest-800),var(--forest-600));border-color:var(--forest-700);color:#fff}
    .nl{display:flex;align-items:center;gap:8px;font-size:13px;color:rgba(255,255,255,.78);font-weight:500}
    .nv{font-size:40px;font-weight:600;letter-spacing:-.02em;margin-top:6px}
    .nv span{font-size:15px;font-weight:500;margin-left:8px;color:rgba(255,255,255,.7)}
    .nv.neg{color:#ffd7d3}
    .ns{font-size:12.5px;color:rgba(255,255,255,.72);margin-top:4px}
    .split{padding:18px 20px}
    .sh{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:500;color:var(--text-2)}
    .sbar{display:flex;gap:2px;height:10px;margin:14px 0;border-radius:5px;overflow:hidden;background:var(--sand-200)}
    .sbar span{flex-basis:0;min-width:2px}
    .er{background:var(--sky-600)} .cr{background:var(--forest-500)}
    .sg{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px}
    .sg > div{display:flex;gap:10px;align-items:flex-start}
    .sg > div > div{display:flex;flex-direction:column}
    .sg strong{font-size:20px;font-weight:600} .sg span{font-size:13px;color:var(--stone-700)} .sg small{font-size:12px;color:var(--text-3)}
    .sw{flex:none;display:inline-block;width:10px;height:10px;border-radius:3px;margin-top:6px}
    .wf{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:8px;padding:12px 12px 12px 16px;align-items:center}
    @media (max-width: 1100px){.wf{grid-template-columns:1fr}}
    .steps td{padding:7px 10px;font-size:13px}
    .steps tr.tot td{font-weight:500;background:var(--surface-2)}
    .steps .sw{margin:0 8px 0 0;vertical-align:-1px}
    .w-start,.w-end{background:#2a4d8f} .w-up{background:var(--forest-500)} .w-down{background:var(--clay-500)}
    .two{margin-top:16px}
    .unc p{color:var(--stone-700);margin-bottom:10px;line-height:1.6}
    .unc .kv{margin-top:14px;padding-top:14px;border-top:1px solid var(--border)}
    .buf{border-top:1px solid var(--border)}
    .u{font-size:11.5px;color:var(--text-3);margin-left:3px}
    .neg{color:var(--red-600)}
    .thu{font-weight:400;color:var(--text-3);margin-left:2px}
    .exc{font-size:12px;padding:2px 8px;border-radius:999px;background:var(--warn-soft);color:var(--amber-600)}
    .foot{justify-content:flex-start}
    .fp{max-width:760px;margin-bottom:12px}
    .fpkv{margin-top:18px;max-width:640px}
    .rules{margin-top:16px}
    .rk{font-size:12px;background:var(--sand-100);padding:2px 6px;border-radius:4px}
    .prov .card-head{flex-wrap:wrap}
    .prov .card-head h3{flex:none}
    .mt{margin-top:14px;display:block}
  `],
})
export class RunDetailPage {
  id = input.required<string>();
  private api = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastService);
  auth = inject(AuthService);

  run = signal<RunDetail | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  tab = signal(inject(ActivatedRoute).snapshot.queryParamMap.get('tab') ?? 'result');
  rulesOpen = signal(false);
  prov = signal<Provenance | null>(null);
  provLoading = signal(false);
  provError = signal<string | null>(null);
  action = signal<Action>(null);
  actionError = signal<ApiError | null>(null);
  busy = signal(false);
  note = '';

  tabs: TabItem[] = [
    { key: 'result', label: 'Result' }, { key: 'zones', label: 'Zones' }, { key: 'inputs', label: 'Rules & inputs' },
    { key: 'provenance', label: 'Provenance' }, { key: 'history', label: 'History' },
  ];

  mine = computed(() => !!this.run() && this.run()!.created_by === this.auth.profile()?.id);
  stockMethod = computed(() => (this.run()?.results.stock_method === 'esm' ? 'equivalent soil mass' : 'fixed depth'));
  wfSteps = computed(() => (this.run() ? waterfallSteps(this.run()!.results) : []));
  wfOption = computed(() => waterfallOption(this.wfSteps()));
  splitTotal = computed(() => Math.max(0, this.run()?.reductions_t_co2e ?? 0) + Math.max(0, this.run()?.removals_t_co2e ?? 0));
  deductionPct = computed(() => {
    const r = this.run()?.results;
    return r && r.net_before_uncertainty_t_co2e > 0 ? (100 * r.uncertainty_deduction_t_co2e) / r.net_before_uncertainty_t_co2e : 0;
  });
  zones = computed<StratumResult[]>(() => [...(this.run()?.results.strata ?? []), ...(this.run()?.results.control_strata ?? [])]);
  rules = computed(() => {
    const s = this.run()?.rules_snapshot;
    if (!s) return [];
    return Object.keys(s.values ?? {}).sort().map(k => ({ key: k, value: ruleValue(s.values[k]), source: ruleSource(s.sources?.[k]) }));
  });

  actions = computed<Exclude<Action, null>[]>(() => {
    const r = this.run();
    if (!r) return [];
    const a: Exclude<Action, null>[] = [];
    if (r.status === 'calculated' && this.auth.can('calc.run')) a.push('submit');
    if (r.status === 'under_review' && this.auth.can('calc.approve')) a.push('reject', 'approve');
    if (r.status === 'approved' && this.auth.can('package.issue')) a.push('package');
    return a;
  });
  fourEyes = computed(() => {
    const a = this.actions();
    if (!this.mine() || !(a.includes('approve') || a.includes('package'))) return '';
    return a.includes('package') ? 'You created this run, so a colleague must issue its package' : 'You created this run, so a colleague must approve it';
  });
  actionTitle = computed(() => {
    const s = this.run()?.status;
    return s === 'calculated' ? 'Ready for review' : s === 'under_review' ? 'Waiting for approval' : s === 'approved' ? 'Approved — ready for verification' : '';
  });
  actionText = computed(() => {
    const r = this.run();
    if (!r) return '';
    if (r.status === 'calculated') return 'Check the result, zones and provenance, then send it to a colleague for approval.';
    if (r.status === 'under_review') return `Created by ${r.created_by_name}. An approver checks the figures and either approves or rejects with a reason.`;
    if (r.status === 'approved') return 'Issue a sealed package for the independent verifier.';
    return '';
  });
  canReplace = computed(() => {
    const s = this.run()?.status;
    return this.auth.can('calc.run') && (s === 'approved' || s === 'rejected' || s === 'calculated');
  });

  steps = computed(() => {
    const r = this.run();
    if (!r) return [];
    const last = (st: string) => [...r.status_history].reverse().find(e => e.status === st);
    const meta = (e?: { by: string; at: string }) => (e ? `${e.by} · ${fmtDate(e.at, true)}` : '');
    const calc = last('calculated'), rev = last('under_review'), app = last('approved'), rej = last('rejected'), sup = last('superseded');
    const s = r.status;
    const out = [
      { key: 'calc', label: 'Calculated', state: 'done', meta: meta(calc) },
      { key: 'rev', label: 'Under review', state: s === 'calculated' ? 'pending' : s === 'under_review' ? 'current' : 'done', meta: rev ? meta(rev) : 'Not yet sent' },
    ];
    if (s === 'rejected') out.push({ key: 'fin', label: 'Rejected', state: 'bad', meta: meta(rej) });
    else out.push({ key: 'fin', label: 'Approved', state: s === 'approved' || s === 'superseded' ? 'done' : 'pending', meta: app ? meta(app) : 'Needs a second person' });
    if (s === 'superseded') out.push({ key: 'sup', label: 'Superseded', state: 'muted', meta: meta(sup) });
    return out;
  });

  timeline = computed<TimelineItem[]>(() =>
    [...(this.run()?.status_history ?? [])].reverse().map(e => ({
      title: ({ calculated: 'Calculated', under_review: 'Sent for review', approved: 'Approved', rejected: 'Rejected', superseded: 'Superseded' } as Record<string, string>)[e.status] ?? e.status,
      at: fmtDate(e.at, true), by: e.by, note: e.note || null,
      tone: e.status === 'rejected' ? 'danger' : e.status === 'superseded' ? 'neutral' : e.status === 'under_review' ? 'warn' : 'ok',
    })),
  );

  modalTitle = computed(() => ({ submit: 'Send for review', approve: 'Approve calculation', reject: 'Reject calculation', package: 'Issue verification package' } as Record<string, string>)[this.action() ?? ''] ?? '');
  confirmLabel = computed(() => ({ submit: 'Send for review', approve: 'Approve', reject: 'Reject run', package: 'Issue package' } as Record<string, string>)[this.action() ?? ''] ?? 'Confirm');

  termLabel = termLabel;
  termStatus(s: string) { return TERM_STATUS[s] ?? s; }
  abs(v: number) { return Math.abs(v); }
  count(o: object | null | undefined) { return Object.keys(o ?? {}).length; }
  zoneName(code: string) { return this.run()?.inputs_snapshot.sources.strata.find(s => s.code === code)?.name ?? ''; }

  constructor() {
    effect(() => { if (this.id()) this.load(); });
    effect(() => { if (this.tab() === 'provenance' && !this.prov() && !this.provLoading()) this.loadProv(); });
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.prov.set(null);
    this.api.get<RunDetail>(`/calculations/${this.id()}`).subscribe({
      next: r => { this.run.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  /** Re-read the run (status history) without the loading skeleton. */
  private refresh() {
    this.api.get<RunDetail>(`/calculations/${this.id()}`).subscribe({ next: r => this.run.set(r), error: () => undefined });
  }

  loadProv() {
    this.provLoading.set(true);
    this.provError.set(null);
    this.api.get<Provenance>(`/calculations/${this.id()}/provenance`).subscribe({
      next: p => { this.prov.set(p); this.provLoading.set(false); },
      error: (e: ApiError) => { this.provError.set(e.message); this.provLoading.set(false); },
    });
  }

  openFile(f: EvidenceBrief) {
    this.api.blob(`/evidence/${f.id}/content`).subscribe({
      next: b => openBlob(b),
      error: (e: ApiError) => this.toast.apiError(e, "Couldn't open the file"),
    });
  }

  replace() { this.router.navigate(['/app/calculations'], { queryParams: { tab: 'new', supersedes: this.id() } }); }

  startAction(a: Action) {
    this.note = '';
    this.actionError.set(null);
    this.action.set(a);
  }

  confirm() {
    const a = this.action();
    const id = this.id();
    if (!a) return;
    this.busy.set(true);
    this.actionError.set(null);
    const req = a === 'submit' ? this.api.post(`/calculations/${id}/submit`)
      : a === 'approve' ? this.api.post(`/calculations/${id}/approve`, { note: this.note.trim() })
        : a === 'reject' ? this.api.post(`/calculations/${id}/reject`, { note: this.note.trim() })
          : this.api.post<{ id: string; version: number }>(`/calculations/${id}/package`);
    req.subscribe({
      next: (res: unknown) => {
        this.busy.set(false);
        this.action.set(null);
        if (a === 'package') {
          const p = res as { id: string; version: number };
          this.toast.success(`Package v${p.version} issued`, 'Grant a verifier access from the package page.');
          this.router.navigate(['/app/verification', p.id]);
          return;
        }
        this.toast.success(({ submit: 'Sent for review', approve: 'Calculation approved', reject: 'Calculation rejected' } as Record<string, string>)[a]);
        const st = (res as { status?: string }).status;
        if (st) this.run.update(r => (r ? { ...r, status: st } : r));
        setTimeout(() => this.refresh(), 600);
      },
      error: (e: ApiError) => {
        this.busy.set(false);
        this.actionError.set(e);
      },
    });
  }
}

