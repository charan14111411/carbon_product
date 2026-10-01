import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, HumanPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, Empty, ErrorBox, Loading, Modal, Progress, Tabs } from '../../ui/kit';
import { MapView } from '../../ui/map-view';
import { AnnexButtons } from './annex';
import { ConfirmDialog } from './confirm';
import { PlanModal } from './plan-modal';
import { SampleView } from './sample-view';
import { SamplingDesignCard } from './design';
import {
  Campaign, CampaignStatus, Finding, SampleDetail, SamplePlan, SampleSummary, SamplingPoint, STATUS_COLOR, Stratum, UserLite,
} from './types';

const FLOW: CampaignStatus[] = ['planned', 'fieldwork', 'lab', 'complete'];
const STEP_TEXT: Record<CampaignStatus, string> = {
  planned: 'Plans and points', fieldwork: 'Cores collected', lab: 'Bags analysed', complete: 'Closed',
};
const NEXT_TEXT: Record<string, string> = {
  fieldwork: 'Collectors can start recording cores. Points must already be placed.',
  lab: 'Fieldwork ends. Remaining cores can still sync, and bags go to the lab.',
  complete: 'The campaign closes. No more cores are accepted.',
};

@Component({
  selector: 'vc-campaign-page',
  imports: [
    FormsModule, RouterLink, Icon, Badge, Callout, DataClass, Empty, ErrorBox, Loading, Modal, Progress, Tabs, MapView,
    ConfirmDialog, PlanModal, SampleView, AnnexButtons, SamplingDesignCard, DayPipe, NumPipe, HumanPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/app/sampling" class="back"><vc-icon name="arrow-left" [size]="15" />All campaigns</a>

    @if (loading()) {
      <div class="card"><vc-loading [rows]="7" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load this campaign" [message]="error()!" />
    } @else if (c(); as c) {
      <header class="hd">
        <div class="titles">
          <div class="row" style="--gap:10px"><code class="code">{{ c.code }}</code><vc-badge [status]="c.status" /></div>
          <h1>{{ c.name }}</h1>
          <div class="meta">
            <span>{{ c.kind | human }} · {{ c.design | human }} design</span>
            <span>{{ c.planned_start | day }} – {{ c.planned_end | day }}</span>
            <span>Depth {{ c.depth_from_cm | num: 0 }}–{{ c.depth_to_cm | num: 0 }} cm</span>
            <span>Placement seed <code>{{ c.placement_seed }}</code></span>
            @if (c.season) { <span>Season: {{ c.season }}</span> }
          </div>
          @if (c.season_override_reason) {
            <div class="ovr"><vc-icon name="calendar-clock" [size]="14" /><span><strong>Sampled outside the baseline season.</strong> {{ c.season_override_reason }}</span><span class="chipref">VM0042 §8.2.1.2</span></div>
          }
        </div>
        <div class="hd-act"><vc-annex-buttons [projectId]="c.project_id" /></div>
      </header>

      <section class="card stepper">
        <ol>
          @for (s of flow; track s; let i = $index) {
            <li [class.done]="i < stepIndex() || c.status === 'complete'" [class.cur]="i === stepIndex() && c.status !== 'complete'">
              <span class="dot">@if (i < stepIndex() || c.status === 'complete') { <vc-icon name="check" [size]="14" /> } @else { {{ i + 1 }} }</span>
              <span class="lbl"><strong>{{ s | human }}</strong><em>{{ stepText[s] }}</em></span>
            </li>
          }
        </ol>
        @if (c.next_status && auth.can('sampling.plan')) {
          <div class="next">
            <span class="muted small">{{ nextText[c.next_status] }}</span>
            <button class="btn btn-primary" (click)="advanceOpen.set(true)"><vc-icon name="arrow-right" />Move to {{ c.next_status | human }}</button>
          </div>
        }
      </section>

      <div class="kpis">
        @let p = c.progress;
        <div class="kpi"><span>Zones with approved plans</span><strong class="num">{{ approvedCount() }} / {{ zones().length }}</strong></div>
        <div class="kpi"><span>Points</span><strong class="num">{{ p?.points_total ?? 0 }}</strong></div>
        <div class="kpi"><span>Collected</span><strong class="num">{{ p?.points_collected ?? 0 }}</strong>
          <vc-progress [value]="p?.points_collected ?? 0" [max]="p?.points_total || 1" /></div>
        <div class="kpi"><span>Bags with accepted soil carbon</span><strong class="num">{{ p?.layers_with_accepted_soc ?? 0 }} / {{ p?.layers_total ?? 0 }}</strong>
          <vc-progress [value]="p?.layers_with_accepted_soc ?? 0" [max]="p?.layers_total || 1" /></div>
      </div>

      <vc-tabs [tabs]="tabs()" [(active)]="tab" />

      <!-- ------------------------------------------------------------ plans -->
      @if (tab() === 'plans') {
        <section class="card">
          <div class="card-head">
            <h3>Sample plans per zone</h3>
            <span class="subtle small">Created by one person, approved by another.</span>
          </div>
          @if (!zones().length) {
            <vc-empty icon="layers" title="This project has no zones" text="Draw the zones on the Sampling page first — each zone needs its own plan." />
          } @else {
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Zone</th><th class="num">Cores</th><th>Method</th><th>Inputs</th><th>Status</th><th>Created by</th><th></th></tr></thead>
                <tbody>
                  @for (row of planRows(); track row.zone.id) {
                    <tr>
                      <td><code>{{ row.zone.code }}</code>&ngsp;<span class="muted">{{ row.zone.name }}</span></td>
                      @if (row.plan; as pl) {
                        <td class="num"><strong>{{ pl.n_required }}</strong></td>
                        <td>{{ pl.inputs['power_s'] !== undefined ? 'Power analysis (Eq. 1–2)' : pl.method === 'manual' ? 'Entered' : 'Variance formula' }}</td>
                        <td class="small muted">
                          @if (pl.inputs['power_s'] !== undefined) {
                            Power analysis · S {{ pl.inputs['power_s'] }} · MDD {{ pl.inputs['power_mdd'] | num: 2 }} · α {{ pl.inputs['power_alpha'] }} · power {{ pl.inputs['power_beta_power'] }}
                          } @else if (pl.method === 'variance_formula') {
                            mean {{ pl.inputs['prior_mean'] }} · sd {{ pl.inputs['prior_sd'] }} · e {{ pl.inputs['target_error_pct'] }}% · {{ (pl.inputs['confidence'] || 0.9) * 100 }}%
                            @if (pl.inputs['floor_applied']) { <br /><span class="warn">raised to methodology minimum {{ pl.inputs['floor_applied'] }}</span> }
                          } @else { — }
                        </td>
                        <td>
                          <vc-badge [status]="pl.status" />
                          @if (pl.approved_by) { <div class="subtle small">by {{ pl.approved_by }}</div> }
                        </td>
                        <td>{{ pl.created_by || '—' }}</td>
                        <td class="num">
                          <button class="btn btn-ghost btn-sm" (click)="viewPlan.set(pl)">Details</button>
                          @if (pl.status === 'draft' && auth.can('sampling.approve')) {
                            <button class="btn btn-secondary btn-sm" (click)="openApprove(pl)"><vc-icon name="check" [size]="14" />Approve</button>
                          }
                        </td>
                      } @else {
                        <td class="num subtle">—</td><td class="subtle" colspan="4">No plan yet</td>
                        <td class="num">
                          @if (auth.can('sampling.plan') && c.status === 'planned') {
                            <button class="btn btn-secondary btn-sm" (click)="openPlan(row.zone)"><vc-icon name="plus" [size]="14" />Create plan</button>
                          }
                        </td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
      }

      <!-- ------------------------------------------------------------ points -->
      @if (tab() === 'points') {
        @if (!points().length) {
          <section class="card">
            <vc-empty icon="pin" title="No points placed yet"
              [text]="allApproved() ? 'Every zone has an approved plan. Place the points to create the sites collectors will visit.' : 'Every zone needs an approved sample plan before points can be placed.'">
              @if (auth.can('sampling.plan') && c.status === 'planned') {
                <button class="btn btn-primary" [disabled]="!allApproved()" (click)="placeOpen.set(true)"><vc-icon name="shuffle" />Place points</button>
              }
            </vc-empty>
          </section>
        } @else {
          <div class="pgrid">
            <vc-map class="map" height="520px" [polygons]="fieldsFc()" [points]="pointsFc()" (featureClick)="onMapClick($event)">
              <div class="legend-map">
                <span><i style="background:#737c76"></i>Planned</span>
                <span><i style="background:#2f7249"></i>Collected</span>
                <span><i style="background:#c76329"></i>Skipped</span>
              </div>
            </vc-map>
            <section class="card ptable">
              <div class="card-head wrap">
                <select class="input sel" [ngModel]="pStatus()" (ngModelChange)="pStatus.set($event)" aria-label="Status">
                  <option value="">All statuses</option><option value="planned">Planned</option>
                  <option value="collected">Collected</option><option value="skipped">Skipped</option>
                </select>
                <select class="input sel" [ngModel]="pAssignee()" (ngModelChange)="pAssignee.set($event)" aria-label="Assignee">
                  <option value="">Anyone</option><option value="__none">Unassigned</option>
                  @for (a of assignees(); track a) { <option [value]="a">{{ a }}</option> }
                </select>
                <div class="spacer"></div>
                @if (auth.can('sampling.plan')) {
                  <button class="btn btn-primary btn-sm" [disabled]="!selected().size" (click)="openAssign()">
                    <vc-icon name="user-plus" [size]="14" />Assign {{ selected().size || '' }}
                  </button>
                }
              </div>
              <div class="table-wrap scroll">
                <table class="table">
                  <thead><tr>
                    @if (auth.can('sampling.plan')) {
                      <th style="width:36px"><input type="checkbox" class="cb" [checked]="allShownSelected()" (change)="toggleAll()" aria-label="Select all planned" /></th>
                    }
                    <th>Site</th><th>Field</th><th>Assigned to</th><th>Status</th>
                  </tr></thead>
                  <tbody>
                    @for (p of shownPoints(); track p.id) {
                      <tr [class.hl]="p.id === focusPoint()">
                        @if (auth.can('sampling.plan')) {
                          <td><input type="checkbox" class="cb" [disabled]="p.status !== 'planned'" [checked]="selected().has(p.id)" (change)="toggle(p.id)" [attr.aria-label]="'Select ' + p.site_code" /></td>
                        }
                        <td class="nowrap"><code>{{ p.site_code }}</code></td>
                        <td class="nowrap">{{ p.field_code }}</td>
                        <td>{{ p.assigned_to_name || '—' }}</td>
                        <td>
                          <vc-badge [status]="p.status" />
                          @if (p.skip_reason) { <div class="subtle small">{{ p.skip_reason }}</div> }
                        </td>
                      </tr>
                    } @empty {
                      <tr><td colspan="5" class="muted">No points match these filters.</td></tr>
                    }
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        }
      }

      <!-- ------------------------------------------------------------ design (Appendix 6) -->
      @if (tab() === 'design') { <vc-sampling-design [campaign]="c" /> }

      <!-- ------------------------------------------------------------ samples -->
      @if (tab() === 'samples') {
        <section class="card">
          @if (sLoading()) {
            <vc-loading [rows]="6" />
          } @else if (sError()) {
            <div class="card-body"><vc-error title="Couldn't load samples" [message]="sError()!" /></div>
          } @else if (!samples().length) {
            <vc-empty icon="shovel" title="No cores recorded yet" text="Samples appear here as soon as collectors sync them from the field app." />
          } @else {
            <div class="table-wrap">
              <table class="table">
                <thead><tr>
                  <th>Sample</th><th>Site</th><th>Collected</th><th class="num">GPS accuracy</th><th class="num">From site</th>
                  <th class="num">Depth</th><th class="num">Cores</th><th class="num">Photos</th><th class="num">QA findings</th><th>Custody</th>
                </tr></thead>
                <tbody>
                  @for (s of samples(); track s.id) {
                    @let fc = findingCount().get(s.id) ?? 0;
                    <tr class="clickable" (click)="openSample(s)">
                      <td><code>{{ s.code }}</code></td>
                      <td>{{ s.site_code }}</td>
                      <td class="nowrap">{{ s.collected_at | day: true }}</td>
                      <td class="num">{{ s.gps_accuracy_m === null ? '—' : (s.gps_accuracy_m | num: 1) + ' m' }}</td>
                      <td class="num">{{ s.distance_from_site_m | num: 1 }} m</td>
                      <td class="num nowrap">{{ s.depth_reached_cm | num: 0 }} cm @if (s.depth_limit) { <span class="lim" [title]="'Stopped by ' + s.depth_limit">{{ s.depth_limit | human }}</span> }</td>
                      <td class="num">{{ s.cores_composited ?? '—' }}</td>
                      <td class="num">{{ s.photo_ids.length }}</td>
                      <td class="num">@if (fc) { <span class="fcount">{{ fc }}</span> } @else { <span class="subtle">0</span> }</td>
                      <td><vc-badge [status]="s.status === 'none' ? 'pending' : 'active'">{{ s.status | human }}</vc-badge></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
      }

      <!-- ------------------------------------------------------------ dialogs -->
      <vc-plan-modal [(open)]="planOpen" [campaignId]="c.id" [zone]="planZone()" (saved)="reload()" />

      <vc-s-confirm [(open)]="advanceOpen" [title]="'Move campaign to ' + (c.next_status | human) + '?'"
        [message]="nextText[c.next_status ?? ''] ?? ''" [confirmLabel]="'Move to ' + (c.next_status | human)" icon="arrow-right"
        [busy]="busy()" (confirmed)="advance()" />

      <vc-s-confirm [(open)]="placeOpen" title="Place sampling points?" confirmLabel="Place points" icon="shuffle" [busy]="busy()" (confirmed)="place()">
        <p class="muted">
          @if (c.kind === 'monitoring' && c.design === 'paired') {
            This paired campaign re-visits every site of its baseline campaign, in the same order.
          } @else {
            Random points are placed inside each zone's fields, using the approved number of cores per zone.
          }
        </p>
        <vc-callout tone="info" icon="fingerprint">
          Placement uses seed <code>{{ c.placement_seed }}</code>, combined with each zone's code. The same seed and zones always give
          the same points, so an auditor can reproduce them exactly. Points can be placed only once per campaign.
        </vc-callout>
      </vc-s-confirm>

      <vc-s-confirm [(open)]="approveOpen" title="Approve this sample plan?" confirmLabel="Approve plan" icon="check" [busy]="busy()" (confirmed)="approve()">
        @if (approveTarget(); as pl) {
          <dl class="kv">
            <dt>Zone</dt><dd><code>{{ pl.stratum_code }}</code></dd>
            <dt>Cores required</dt><dd><strong>{{ pl.n_required }}</strong> ({{ pl.method === 'manual' ? 'entered' : 'variance formula' }})</dd>
            <dt>Created by</dt><dd>{{ pl.created_by || '—' }}</dd>
            <dt>Justification</dt><dd>{{ pl.justification }}</dd>
          </dl>
          <vc-callout [tone]="isMine(pl) ? 'warn' : 'info'" icon="users">
            @if (isMine(pl)) {
              You created or edited this plan, so you can't approve it. A second person must check it — this "four-eyes" rule stops one person deciding alone how much the zone is sampled.
            } @else {
              Four-eyes rule: the person who created or edited a plan can't approve it. Once approved, the plan can't be changed.
            }
          </vc-callout>
          @if (pl.warnings.length) { <vc-callout tone="warn" icon="alert">{{ pl.warnings[0].message }}</vc-callout> }
        }
      </vc-s-confirm>

      <vc-modal [open]="!!viewPlan()" (closed)="viewPlan.set(null)" [title]="'Plan for zone ' + (viewPlan()?.stratum_code ?? '')" width="520px">
        @if (viewPlan(); as pl) {
          <dl class="kv">
            <dt>Cores required</dt><dd><strong>{{ pl.n_required }}</strong>&ngsp;<vc-dc cls="CALCULATED" /></dd>
            <dt>Method</dt><dd>{{ pl.inputs['power_s'] !== undefined ? 'Power analysis, VM0042 Eq. 1–2' : pl.method === 'manual' ? 'Entered by hand' : 'n = ⌈(z·sd/(e·mean))²⌉' }}</dd>
            @for (k of inputKeys(pl); track k) { <dt>{{ k | human }}</dt><dd class="num">{{ pl.inputs[k] }}</dd> }
            <dt>Justification</dt><dd>{{ pl.justification }}</dd>
            <dt>Created by</dt><dd>{{ pl.created_by || '—' }}</dd>
            <dt>Status</dt><dd><vc-badge [status]="pl.status" /> @if (pl.approved_by) { by {{ pl.approved_by }} on {{ pl.approved_at | day: true }} }</dd>
          </dl>
        }
      </vc-modal>

      <vc-modal [(open)]="assignOpen" title="Assign points to a collector" width="480px"
        [subtitle]="selected().size + ' planned point(s) selected. Collectors see only the points assigned to them.'">
        <div class="stack" style="--gap:14px">
          @if (collectorsError()) { <vc-error title="Couldn't load collectors" [message]="collectorsError()!" /> }
          <div class="field">
            <label for="as-user">Field collector</label>
            <select id="as-user" class="input" [(ngModel)]="assignUser">
              <option value="">Choose a collector…</option>
              @for (u of collectors(); track u.id) { <option [value]="u.id">{{ u.full_name }} · {{ u.email }}</option> }
            </select>
            @if (!collectors().length && !collectorsError()) { <span class="hint">No active field collectors in your organisation yet.</span> }
          </div>
        </div>
        <ng-container footer>
          <button class="btn btn-secondary" (click)="assignOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" [disabled]="!assignUser || busy()" (click)="assign()"><vc-icon name="user-plus" />Assign</button>
        </ng-container>
      </vc-modal>

      <vc-modal [open]="!!sampleOpen()" (closed)="sampleOpen.set(null)" [drawer]="true" width="680px"
        [title]="'Sample ' + (sampleOpen()?.code ?? '')" [subtitle]="'Site ' + (sampleOpen()?.site_code ?? '') + ' · a core as collected; never edited.'">
        @if (detailLoading()) { <vc-loading [rows]="8" /> }
        @else if (detailError()) { <vc-error title="Couldn't load the sample" [message]="detailError()!" /> }
        @else if (detail(); as d) { <vc-sample-view [sample]="d" [findings]="detailFindings()" /> }
      </vc-modal>
    }
  `,
  styles: [`
    .back{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-2);margin-bottom:14px}
    .hd{margin-bottom:18px;display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap}
    .hd .titles{flex:1;min-width:280px}
    .hd-act{padding-top:4px}
    .ovr{display:flex;align-items:flex-start;gap:8px;margin-top:10px;padding:8px 12px;border-radius:var(--radius-sm);background:var(--warn-soft);border:1px solid #f1dcae;font-size:13px;color:var(--stone-800);max-width:760px}
    .ovr vc-icon{color:var(--amber-600);margin-top:2px}
    .chipref{flex:none;font:600 10.5px/1 var(--mono);padding:4px 6px;border-radius:4px;background:var(--surface);border:1px solid var(--border);color:var(--stone-700)}
    .lim{display:inline-block;margin-left:4px;font-size:11px;padding:0 6px;border-radius:999px;background:var(--sand-200);color:var(--stone-700)}
    .titles h1{margin-top:6px}
    .code{font-size:12.5px;color:var(--stone-600)}
    .meta{display:flex;flex-wrap:wrap;gap:4px 18px;margin-top:8px;color:var(--text-2);font-size:13px}
    .stepper{padding:18px 20px;margin-bottom:16px;display:flex;align-items:center;gap:20px;flex-wrap:wrap}
    .stepper ol{list-style:none;margin:0;padding:0;display:flex;flex:1;gap:0;min-width:520px}
    .stepper li{flex:1;display:flex;align-items:center;gap:10px;position:relative;padding-right:14px}
    .stepper li:not(:last-child)::after{content:'';flex:1;height:2px;background:var(--sand-200);margin-left:4px}
    .stepper li.done:not(:last-child)::after{background:var(--forest-400)}
    .dot{flex:none;display:grid;place-items:center;width:28px;height:28px;border-radius:50%;border:2px solid var(--sand-300);background:var(--surface);font-size:12px;font-weight:600;color:var(--stone-500)}
    li.done .dot{background:var(--forest-500);border-color:var(--forest-500);color:#fff}
    li.cur .dot{border-color:var(--forest-600);color:var(--forest-700);box-shadow:0 0 0 4px var(--forest-100)}
    .lbl{display:flex;flex-direction:column;line-height:1.25;white-space:nowrap}
    .lbl strong{font-size:13px} .lbl em{font-style:normal;font-size:11.5px;color:var(--text-3)}
    li.cur .lbl strong{color:var(--forest-700)}
    .next{display:flex;align-items:center;gap:12px;max-width:460px}
    .kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:20px}
    .kpi{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:12px 14px;display:flex;flex-direction:column;gap:6px}
    .kpi span{font-size:12px;color:var(--text-2)} .kpi strong{font-size:20px;font-weight:600}
    .warn{color:var(--amber-600)}
    .pgrid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:16px;align-items:start}
    .ptable{display:flex;flex-direction:column;max-height:520px}
    .card-head.wrap{flex-wrap:wrap;gap:8px}
    .sel{width:auto;min-width:130px;height:32px}
    .scroll{overflow:auto;flex:1}
    .cb{accent-color:var(--primary);width:16px;height:16px}
    tr.hl td{background:var(--forest-50)}
    .legend-map{position:absolute;left:10px;bottom:10px;z-index:2;display:flex;gap:12px;padding:6px 10px;background:var(--surface);border-radius:8px;box-shadow:var(--shadow);font-size:12px}
    .legend-map span{display:inline-flex;gap:6px;align-items:center}
    .legend-map i{width:10px;height:10px;border-radius:50%;border:1.5px solid #fff;box-shadow:0 0 0 1px var(--stone-300)}
    .fcount{display:inline-grid;place-items:center;min-width:22px;height:20px;padding:0 6px;border-radius:10px;background:var(--warn-soft);color:var(--amber-600);font-weight:600;font-size:12px}
    @media (max-width:1100px){.pgrid{grid-template-columns:1fr}.kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.stepper ol{min-width:0;flex-wrap:wrap}}
  `],
})
export class CampaignPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  auth = inject(AuthService);

  id = input.required<string>();
  flow = FLOW;
  stepText = STEP_TEXT;
  nextText = NEXT_TEXT;

  c = signal<Campaign | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  zones = signal<Stratum[]>([]);
  plans = signal<SamplePlan[]>([]);
  points = signal<SamplingPoint[]>([]);
  fields = signal<GeoJSON.FeatureCollection | null>(null);
  samples = signal<SampleSummary[]>([]);
  sLoading = signal(false);
  sError = signal<string | null>(null);
  findings = signal<Finding[]>([]);
  busy = signal(false);

  private route = inject(ActivatedRoute);
  /** ?tab=plans|points|samples and ?sample=<id> deep-link into a tab or a sample drawer. */
  tab = signal(['plans', 'design', 'points', 'samples'].includes(this.route.snapshot.queryParamMap.get('tab') ?? '') ? this.route.snapshot.queryParamMap.get('tab')! : 'plans');
  planOpen = signal(false);
  planZone = signal<Stratum | null>(null);
  advanceOpen = signal(false);
  placeOpen = signal(false);
  approveTarget = signal<SamplePlan | null>(null);
  approveOpen = signal(false);
  viewPlan = signal<SamplePlan | null>(null);
  assignOpen = signal(false);
  collectors = signal<UserLite[]>([]);
  collectorsError = signal<string | null>(null);
  assignUser = '';
  selected = signal<Set<string>>(new Set());
  pStatus = signal('');
  pAssignee = signal('');
  focusPoint = signal<string | null>(null);

  sampleOpen = signal<SampleSummary | null>(null);
  detail = signal<SampleDetail | null>(null);
  detailLoading = signal(false);
  detailError = signal<string | null>(null);

  stepIndex = computed(() => FLOW.indexOf(this.c()?.status ?? 'planned'));
  planRows = computed(() => this.zones().map(z => ({ zone: z, plan: this.plans().find(p => p.stratum_id === z.id) ?? null })));
  approvedCount = computed(() => this.planRows().filter(r => r.plan?.status === 'approved').length);
  allApproved = computed(() => this.zones().length > 0 && this.approvedCount() === this.zones().length);
  tabs = computed(() => [
    { key: 'plans', label: 'Sample plans', count: this.plans().length },
    { key: 'design', label: 'Sampling design' },
    { key: 'points', label: 'Points', count: this.points().length },
    { key: 'samples', label: 'Samples', count: this.c()?.progress?.points_collected ?? null },
  ]);
  assignees = computed(() => [...new Set(this.points().map(p => p.assigned_to_name).filter((x): x is string => !!x))].sort());
  shownPoints = computed(() => this.points().filter(p =>
    (!this.pStatus() || p.status === this.pStatus()) &&
    (!this.pAssignee() || (this.pAssignee() === '__none' ? !p.assigned_to : p.assigned_to_name === this.pAssignee())),
  ));
  allShownSelected = computed(() => {
    const planned = this.shownPoints().filter(p => p.status === 'planned');
    return planned.length > 0 && planned.every(p => this.selected().has(p.id));
  });
  pointsFc = computed<GeoJSON.FeatureCollection>(() => ({
    type: 'FeatureCollection',
    features: this.points().map(p => ({
      type: 'Feature', geometry: { type: 'Point', coordinates: [p.longitude, p.latitude] },
      properties: {
        id: p.id, color: STATUS_COLOR[p.status] ?? '#737c76',
        label: `<strong>${p.site_code}</strong><br>${p.field_code} · ${p.status}${p.assigned_to_name ? '<br>' + p.assigned_to_name : ''}`,
      },
    })),
  }));
  fieldsFc = computed<GeoJSON.FeatureCollection | null>(() => {
    const f = this.fields();
    if (!f) return null;
    const inZone = new Set(this.zones().flatMap(z => z.field_ids));
    return {
      ...f,
      features: f.features.filter(x => inZone.has(String(x.properties?.['id']))).map(x => ({
        ...x, properties: { ...x.properties, color: '#2f7249', label: `<strong>${x.properties?.['code']}</strong><br>${x.properties?.['name'] ?? ''}` },
      })),
    };
  });
  findingCount = computed(() => {
    const m = new Map<string, number>();
    for (const f of this.findings()) if (f.status === 'open' || f.status === 'acknowledged') m.set(f.entity_id, (m.get(f.entity_id) ?? 0) + 1);
    return m;
  });
  detailFindings = computed(() => this.findings().filter(f => f.entity_id === this.detail()?.id && (f.status === 'open' || f.status === 'acknowledged')));

  constructor() {
    effect(() => { this.id(); untracked(() => this.load()); });
    effect(() => { if (this.tab() === 'samples' && this.c()) untracked(() => this.loadSamples()); });
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Campaign>(`/campaigns/${this.id()}`).subscribe({
      next: c => {
        this.c.set(c);
        this.plans.set(c.plans ?? []);
        this.loading.set(false);
        this.loadSide(c);
      },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  reload() {
    this.api.get<Campaign>(`/campaigns/${this.id()}`).subscribe({
      next: c => { this.c.set(c); this.plans.set(c.plans ?? []); this.loadPoints(); },
      error: (e: ApiError) => this.toast.apiError(e, "Couldn't refresh the campaign"),
    });
  }

  private loadSide(c: Campaign) {
    forkJoin({
      zones: this.api.get<Stratum[]>(`/projects/${c.project_id}/strata`).pipe(catchError(() => of([] as Stratum[]))),
      fields: this.api.get<GeoJSON.FeatureCollection>('/fields/geojson', { project_id: c.project_id }).pipe(catchError(() => of(null))),
    }).subscribe(r => { this.zones.set(r.zones); this.fields.set(r.fields); });
    this.loadPoints();
  }

  private loadPoints() {
    this.api.get<SamplingPoint[]>(`/campaigns/${this.id()}/points`).subscribe({
      next: p => this.points.set(p),
      error: () => this.points.set([]),
    });
  }

  loadSamples() {
    const c = this.c();
    if (!c) return;
    this.sLoading.set(true);
    this.sError.set(null);
    this.api.get<SampleSummary[]>('/samples', { campaign_id: c.id }).subscribe({
      next: s => {
        this.samples.set(s);
        this.sLoading.set(false);
        const want = this.route.snapshot.queryParamMap.get('sample');
        const hit = want && !this.sampleOpen() ? s.find(x => x.id === want || x.code === want) : null;
        if (hit) this.openSample(hit);
      },
      error: (e: ApiError) => { this.sError.set(e.message); this.sLoading.set(false); },
    });
    if (this.auth.can('data.read')) {
      this.api.get<Finding[]>(`/projects/${c.project_id}/qa/findings`, { entity_type: 'sample', limit: 2000 }).subscribe({
        next: f => this.findings.set(f),
        error: () => this.findings.set([]),
      });
    }
  }

  openApprove(pl: SamplePlan) {
    this.approveTarget.set(pl);
    this.approveOpen.set(true);
  }

  openPlan(z: Stratum) {
    this.planZone.set(z);
    this.planOpen.set(true);
  }

  isMine(pl: SamplePlan) {
    return !!pl.created_by && pl.created_by === this.auth.profile()?.full_name;
  }

  inputKeys(pl: SamplePlan) {
    return Object.keys(pl.inputs ?? {});
  }

  advance() {
    const c = this.c();
    if (!c?.next_status) return;
    this.busy.set(true);
    this.api.post<Campaign>(`/campaigns/${c.id}/status`, { status: c.next_status }).subscribe({
      next: r => {
        this.busy.set(false);
        this.advanceOpen.set(false);
        this.c.set({ ...r, plans: this.plans() });
        this.toast.success(`Campaign moved to ${r.status}`);
      },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e, "Couldn't change the campaign status"); },
    });
  }

  place() {
    this.busy.set(true);
    this.api.post<{ points_created: number; seed: number }>(`/campaigns/${this.id()}/place-points`).subscribe({
      next: r => {
        this.busy.set(false);
        this.placeOpen.set(false);
        this.toast.success(`${r.points_created} points placed`, `Seed ${r.seed} — anyone can reproduce this placement.`);
        this.reload();
      },
      error: (e: ApiError) => {
        this.busy.set(false);
        const missing = (e.details?.['strata'] as string[] | undefined)?.join(', ');
        this.toast.error("Couldn't place points", missing ? `${e.message} Missing: ${missing}.` : e.message);
      },
    });
  }

  approve() {
    const pl = this.approveTarget();
    if (!pl) return;
    this.busy.set(true);
    this.api.post<SamplePlan>(`/sample-plans/${pl.id}/approve`).subscribe({
      next: r => {
        this.busy.set(false);
        this.approveOpen.set(false);
        this.plans.update(ps => ps.map(p => (p.id === r.id ? r : p)));
        this.toast.success(`Plan for ${r.stratum_code} approved`);
      },
      error: (e: ApiError) => {
        this.busy.set(false);
        if (e.code === 'SELF_APPROVAL_REJECTED') {
          this.toast.error('You can’t approve your own plan', 'Someone who did not create or edit this plan must approve it.');
        } else this.toast.apiError(e, "Couldn't approve the plan");
      },
    });
  }

  toggle(id: string) {
    const s = new Set(this.selected());
    s.has(id) ? s.delete(id) : s.add(id);
    this.selected.set(s);
  }

  toggleAll() {
    const planned = this.shownPoints().filter(p => p.status === 'planned').map(p => p.id);
    const s = new Set(this.selected());
    if (this.allShownSelected()) planned.forEach(id => s.delete(id));
    else planned.forEach(id => s.add(id));
    this.selected.set(s);
  }

  onMapClick(e: { layer: string; id: string }) {
    if (e.layer !== 'point') return;
    this.focusPoint.set(e.id);
  }

  openAssign() {
    this.assignUser = '';
    this.collectorsError.set(null);
    this.assignOpen.set(true);
    this.api.get<UserLite[]>('/users', { role: 'field_collector' }).subscribe({
      next: u => this.collectors.set(u.filter(x => x.role === 'field_collector' && x.is_active)),
      error: (e: ApiError) => this.collectorsError.set(e.message),
    });
  }

  assign() {
    this.busy.set(true);
    this.api.post<{ assigned: number; user_name: string }>(`/campaigns/${this.id()}/assign`, {
      user_id: this.assignUser, point_ids: [...this.selected()],
    }).subscribe({
      next: r => {
        this.busy.set(false);
        this.assignOpen.set(false);
        this.selected.set(new Set());
        this.toast.success(`${r.assigned} point(s) assigned to ${r.user_name}`);
        this.loadPoints();
      },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e, "Couldn't assign the points"); },
    });
  }

  openSample(s: SampleSummary) {
    this.sampleOpen.set(s);
    this.detail.set(null);
    this.detailLoading.set(true);
    this.detailError.set(null);
    this.api.get<SampleDetail>(`/samples/${s.id}`).subscribe({
      next: d => { this.detail.set(d); this.detailLoading.set(false); },
      error: (e: ApiError) => { this.detailError.set(e.message); this.detailLoading.set(false); },
    });
  }
}
