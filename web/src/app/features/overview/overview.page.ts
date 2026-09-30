import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { fmtNum, HumanPipe, NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { Chart, PALETTE } from '../../ui/chart';
import { Icon } from '../../ui/icon';
import { Badge, DataClass, Empty, Loading } from '../../ui/kit';
import { MapView } from '../../ui/map-view';
import { Crop, Enrolment, Programme, ProgrammeSummary, RulePackLite } from '../programmes/types';

interface Dim { key: string; label: string; status: 'ok' | 'warning' | 'blocking'; detail: string }
interface Readiness { project_id: string; dimensions: Dim[]; score_pct: number; ready: boolean }
interface Run {
  id: string; period_label: string; period_start: string; period_end: string; status: string;
  net_t_co2e: number | null; gross_t_co2e: number | null; created_at: string; created_by: string | null;
}
interface RunDetail extends Run {
  created_by_name?: string;
  results?: { strata?: { code: string; area_ha: number; delta_t_c_ha: number; se: number; n_used: number }[] };
}
interface QaSummary { blocking: number; open_by_severity: Record<string, number>; can_calculate: boolean }
interface Campaign { id: string; code: string; kind: string; status: string; progress?: { points_total: number; points_collected: number } }
interface CreditBatch { id: string; code: string; status: string; issued_total?: number }
interface Sale { id: string; batch_id: string; status: string }
interface PayoutBatch { id: string; code: string; status: string; created_by: string | null; total_amount: string }

type StepState = 'done' | 'progress' | 'next' | 'todo';
interface Step { key: string; label: string; icon: string; link: string; state: StepState; detail: string }
interface Attention { tone: 'danger' | 'warn' | 'info'; icon: string; title: string; text: string; link: string; action: string }

const JOURNEY: { key: string; label: string; icon: string; link: string; dims: string[] }[] = [
  { key: 'enrol', label: 'Enrol', icon: 'users', link: 'project', dims: ['fields_enrolled'] },
  { key: 'plan', label: 'Plan', icon: 'target', link: '/app/sampling', dims: ['rules_approved', 'strata_defined', 'sample_plans_approved'] },
  { key: 'sample', label: 'Sample', icon: 'pin', link: '/app/sampling', dims: ['baseline_samples_collected', 'custody_complete', 'monitoring_campaign'] },
  { key: 'lab', label: 'Lab', icon: 'flask', link: '/app/lab', dims: ['lab_results_accepted', 'certificates_attached'] },
  { key: 'calc', label: 'Calculate', icon: 'calculator', link: '/app/calculations', dims: ['open_blocking_qa', 'terms_approved', 'calculation_approved'] },
  { key: 'verify', label: 'Verify', icon: 'file-check', link: '/app/verification', dims: ['package_issued'] },
  { key: 'sell', label: 'Sell', icon: 'receipt', link: '/app/sales', dims: [] },
  { key: 'pay', label: 'Pay', icon: 'hand-coins', link: '/app/benefits', dims: [] },
];

const DIM_LINK: Record<string, string> = {
  rules_approved: '/app/methodology', fields_enrolled: 'project', strata_defined: '/app/sampling',
  sample_plans_approved: '/app/sampling', baseline_samples_collected: '/app/sampling', lab_results_accepted: '/app/lab',
  certificates_attached: '/app/lab', custody_complete: '/app/sampling', open_blocking_qa: '/app/quality',
  monitoring_campaign: '/app/sampling', terms_approved: '/app/calculations', calculation_approved: '/app/calculations',
  package_issued: '/app/verification',
};

const safe = <T>(o: Observable<T>, fallback: T) => o.pipe(catchError(() => of(fallback)));

@Component({
  selector: 'vc-overview-page',
  imports: [RouterLink, Icon, Badge, DataClass, Empty, Loading, Chart, MapView, NumPipe, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!ctx.loaded()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (!ctx.projects().length) {
      <section class="welcome card">
        <div class="wtext">
          <span class="eyebrow">Welcome, {{ firstName() }}</span>
          <h1>Start by creating a programme</h1>
          <p>A programme sets the region, eligible crops and commercial terms. Inside it, a project follows one methodology — from enrolling fields to paying farmers.</p>
          <div class="row" style="margin-top:18px">
            @if (auth.can('programmes.manage')) { <a class="btn btn-primary btn-lg" routerLink="/app/programmes"><vc-icon name="plus" />Create a programme</a> }
            @else { <a class="btn btn-secondary btn-lg" routerLink="/app/programmes">View programmes</a> }
          </div>
        </div>
        <ol class="wsteps">
          @for (s of journeyDef; track s.key; let i = $index) {
            <li><span class="n num">{{ i + 1 }}</span><vc-icon [name]="s.icon" [size]="16" />{{ s.label }}</li>
          }
        </ol>
      </section>
    } @else if (project(); as p) {
      <!-- hero -->
      <section class="hero">
        <div class="hl">
          <div class="crumbs">
            @if (programme(); as prog) { <a [routerLink]="['/app/programmes', prog.id]">{{ prog.name }}</a><vc-icon name="chevron-right" [size]="13" /> }
            <span class="mono">{{ p.code }}</span>
          </div>
          <h1>{{ p.name }}</h1>
          <div class="facts">
            <vc-badge [status]="p.status" />
            <span><vc-icon name="scale" [size]="14" />{{ p.methodology_code }} v{{ p.methodology_version }}</span>
            @if (programme()?.region) { <span><vc-icon name="pin" [size]="14" />{{ programme()!.region }}</span> }
            <a [routerLink]="['/app/programmes/projects', p.id]" class="open">Project details<vc-icon name="arrow-up-right" [size]="13" /></a>
          </div>
        </div>
        <div class="ready">
          @if (readiness(); as r) {
            <div class="ring" [attr.aria-label]="'Readiness ' + r.score_pct + '%'">
              <svg viewBox="0 0 64 64" width="84" height="84">
                <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="6" />
                <circle cx="32" cy="32" r="27" fill="none" [attr.stroke]="r.ready ? '#86b797' : '#e7a57b'" stroke-width="6" stroke-linecap="round"
                  [attr.stroke-dasharray]="ringDash(r.score_pct)" transform="rotate(-90 32 32)" />
              </svg>
              <span class="pct num">{{ r.score_pct | num: 0 }}<small>%</small></span>
            </div>
            <div class="rt">
              <span class="rl">Verification readiness</span>
              @if (nextBlocker(); as b) {
                <strong>Next: {{ b.label }}</strong>
                <span class="rd">{{ b.detail }}</span>
                <a [routerLink]="dimLink(b.key)" class="rgo">Resolve<vc-icon name="arrow-right" [size]="13" /></a>
              } @else {
                <strong>Ready for verification</strong>
                <span class="rd">No blocking items. {{ okCount() }} of {{ r.dimensions.length }} checks fully complete.</span>
              }
            </div>
          } @else if (readinessFailed()) {
            <div class="rt"><span class="rl">Verification readiness</span><span class="rd">Not available for your role.</span></div>
          } @else {
            <div class="rt"><span class="rl">Verification readiness</span><span class="rd">Working it out…</span></div>
          }
        </div>
      </section>

      <!-- stats -->
      <div class="tiles">
        <a class="tile" [routerLink]="['/app/programmes/projects', p.id]">
          <span class="tl">Farmers enrolled</span>
          <span class="tv num">{{ enrolStats().farmers | num: 0 }}</span>
          <span class="th">{{ enrolStats().fields | num: 0 }} fields · {{ enrolStats().pending }} awaiting decision</span>
        </a>
        <a class="tile" [routerLink]="['/app/programmes/projects', p.id]">
          <span class="tl">Area enrolled</span>
          <span class="tv num">{{ enrolStats().area | num: 1 }}<small>ha</small></span>
          <span class="th">Programme-wide {{ summary() ? (summary()!.hectares_enrolled | num: 1) + ' ha' : '—' }}</span>
        </a>
        <a class="tile" routerLink="/app/sampling">
          <span class="tl">Soil cores collected</span>
          <span class="tv num">{{ sampling().collected | num: 0 }}<small>of {{ sampling().planned | num: 0 }}</small></span>
          <span class="th">{{ sampling().campaigns }} campaign{{ sampling().campaigns === 1 ? '' : 's' }}</span>
        </a>
        <a class="tile accent" routerLink="/app/calculations">
          <span class="tl">Net credits <vc-dc cls="CALCULATED" /></span>
          @if (latestApproved(); as run) {
            <span class="tv num">{{ run.net_t_co2e | num: 1 }}<small>tCO₂e</small></span>
            <span class="th">Approved · {{ run.period_label }}</span>
          } @else {
            <span class="tv num">—</span>
            <span class="th">{{ runs().length ? 'No approved calculation yet' : 'No calculation run yet' }}</span>
          }
        </a>
        <a class="tile" routerLink="/app/quality" [class.alarm]="(qa()?.blocking ?? 0) > 0">
          <span class="tl">Open blocking issues</span>
          <span class="tv num">{{ qa() ? qa()!.blocking : '—' }}</span>
          <span class="th">{{ qaHint() }}</span>
        </a>
      </div>

      <!-- journey -->
      <section class="card journey">
        <div class="card-head"><h3>Journey</h3><span class="small subtle">From enrolment to farmer payment. Each step reflects this project’s live readiness checks.</span></div>
        <ol class="steps">
          @for (s of steps(); track s.key; let i = $index; let last = $last) {
            <li [class]="s.state">
              <a [routerLink]="s.link === 'project' ? ['/app/programmes/projects', p.id] : s.link">
                <span class="dotw"><span class="dot">
                  @switch (s.state) {
                    @case ('done') { <vc-icon name="check" [size]="15" [stroke]="2.4" /> }
                    @default { <vc-icon [name]="s.icon" [size]="15" /> }
                  }
                </span></span>
                <span class="sl">{{ s.label }}</span>
                <span class="ss">{{ stateLabel(s.state) }}</span>
                <span class="sd">{{ s.detail }}</span>
              </a>
              @if (!last) { <span class="bar" [class.full]="s.state === 'done'"></span> }
            </li>
          }
        </ol>
      </section>

      <div class="split">
        <!-- map -->
        <section class="card">
          <div class="card-head">
            <h3>Enrolled fields</h3>
            <a class="small" routerLink="/app/fields">Open map<vc-icon name="arrow-up-right" [size]="12" /></a>
          </div>
          @if (fields() === null) {
            <vc-loading [rows]="5" />
          } @else if (!fields()!.features.length) {
            <vc-empty icon="map" title="No fields in this project yet" text="Enrol mapped fields from the project page to see them here, coloured by crop.">
              <a class="btn btn-secondary" [routerLink]="['/app/programmes/projects', p.id]">Enrol fields</a>
            </vc-empty>
          } @else {
            <div class="mapwrap">
              <vc-map [polygons]="coloured()" [points]="centroids()" height="360px" (featureClick)="openField($event.id)" />
              <div class="legend">
                @for (l of cropLegend(); track l.code) {
                  <span><i [style.background]="l.color"></i>{{ l.name }} <b class="num">{{ l.count }}</b></span>
                }
              </div>
            </div>
          }
        </section>

        <!-- chart -->
        <section class="card">
          <div class="card-head">
            <h3>{{ chartMode() === 'strata' ? 'Soil-carbon change by zone' : 'Net credits by period' }}</h3>
            @if (strataOption() && periodOption()) {
              <div class="seg">
                <button [class.on]="chartMode() === 'strata'" (click)="chartMode.set('strata')">By zone</button>
                <button [class.on]="chartMode() === 'period'" (click)="chartMode.set('period')">By period</button>
              </div>
            }
            <vc-dc cls="CALCULATED" />
          </div>
          @if (chartOption(); as opt) {
            <div class="card-body chartbody">
              <vc-chart [option]="opt" height="300px" />
              @if (chartMode() === 'strata' && latestDetail(); as d) {
                <p class="small subtle cap">Change in soil organic carbon, tonnes of carbon per hectare, from run {{ d.period_label }} ({{ d.status | human }}). Whiskers show ±1 standard error.</p>
              } @else {
                <p class="small subtle cap">Net credits after uncertainty and buffer deductions, latest run per period.</p>
              }
            </div>
          } @else {
            <vc-empty icon="chart" title="No results yet" text="Once a calculation has run, the measured change in soil carbon per zone appears here." >
              <a class="btn btn-secondary" routerLink="/app/calculations">Go to calculations</a>
            </vc-empty>
          }
        </section>
      </div>

      <!-- attention -->
      <section class="card">
        <div class="card-head"><h3>Needs attention</h3>@if (attention().length) { <span class="count num">{{ attention().length }}</span> }</div>
        @if (!attention().length) {
          <div class="allclear"><vc-icon name="check-circle" [size]="18" />Nothing needs your attention right now.</div>
        } @else {
          <ul class="att">
            @for (a of attention(); track a.title) {
              <li [class]="a.tone">
                <span class="ai"><vc-icon [name]="a.icon" [size]="16" /></span>
                <div class="at"><strong>{{ a.title }}</strong><span>{{ a.text }}</span></div>
                <a class="btn btn-secondary btn-sm" [routerLink]="a.link === 'project' ? ['/app/programmes/projects', p.id] : a.link">{{ a.action }}</a>
              </li>
            }
          </ul>
        }
      </section>
    }
  `,
  styles: [`
    :host{display:flex;flex-direction:column;gap:16px}
    .welcome{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:24px;padding:36px 40px;
      background:radial-gradient(120% 140% at 0% 0%,var(--forest-50),#fff 60%)}
    @media (max-width:900px){.welcome{grid-template-columns:1fr}}
    .eyebrow{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--forest-500)}
    .welcome h1{font-size:28px;margin-top:8px}
    .welcome p{margin-top:10px;color:var(--text-2);max-width:520px;font-size:15px;line-height:1.6}
    .wsteps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:8px;align-content:center}
    .wsteps li{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#fff;border:1px solid var(--border);border-radius:8px;color:var(--stone-700);font-weight:500}
    .wsteps .n{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--sand-200);font-size:11.5px;color:var(--stone-600)}
    .wsteps vc-icon{color:var(--forest-500)}

    .hero{display:flex;gap:24px;align-items:stretch;padding:24px 28px;border-radius:var(--radius-lg);color:#fff;
      background:radial-gradient(120% 160% at 0% 0%,var(--forest-600) 0%,var(--forest-800) 55%,var(--forest-900) 100%);box-shadow:var(--shadow)}
    .hl{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center}
    .crumbs{display:flex;align-items:center;gap:6px;font-size:12.5px;color:rgba(255,255,255,.66)}
    .crumbs a{color:rgba(255,255,255,.8)} .crumbs a:hover{color:#fff}
    .hero h1{color:#fff;font-size:26px;margin-top:6px}
    .facts{display:flex;flex-wrap:wrap;align-items:center;gap:8px 18px;margin-top:12px;font-size:13px;color:rgba(255,255,255,.8)}
    .facts span{display:inline-flex;align-items:center;gap:6px}
    .facts vc-icon{opacity:.75}
    .open{display:inline-flex;align-items:center;gap:4px;color:var(--forest-200)!important}
    .ready{display:flex;gap:18px;align-items:center;padding:16px 20px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);min-width:380px;max-width:460px}
    .ring{position:relative;flex:none;width:84px;height:84px}
    .ring circle{transition:stroke-dasharray .6s ease}
    .pct{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:600}
    .pct small{font-size:12px;opacity:.7;margin-left:1px}
    .rt{display:flex;flex-direction:column;gap:3px;min-width:0}
    .rl{font-size:11.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.6)}
    .rt strong{font-size:15px;color:#fff}
    .rd{font-size:12.5px;color:rgba(255,255,255,.74);line-height:1.45}
    .rgo{display:inline-flex;align-items:center;gap:4px;margin-top:4px;font-size:12.5px;font-weight:500;color:var(--clay-300)!important}
    @media (max-width:1100px){.hero{flex-direction:column}.ready{max-width:none;min-width:0}}

    .tiles{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
    @media (max-width:1200px){.tiles{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media (max-width:760px){.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}}
    .tile{display:flex;flex-direction:column;gap:4px;padding:16px 18px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
      box-shadow:var(--shadow-sm);color:inherit;text-decoration:none!important;transition:border-color .12s,box-shadow .12s}
    .tile:hover{border-color:var(--forest-300);box-shadow:var(--shadow)}
    .tl{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:500;color:var(--text-2)}
    .tv{font-size:26px;font-weight:600;letter-spacing:-.02em;color:var(--stone-900);margin-top:2px}
    .tv small{font-size:12.5px;font-weight:500;color:var(--text-3);margin-left:5px;letter-spacing:0}
    .th{font-size:12px;color:var(--text-3)}
    .tile.accent{background:linear-gradient(135deg,var(--sand-50),var(--forest-50));border-color:var(--forest-200)}
    .tile.accent .tv{color:var(--forest-800)}
    .tile.alarm{border-color:#f3c7c3;background:linear-gradient(180deg,#fff,var(--red-100))}
    .tile.alarm .tv{color:var(--red-600)}

    .steps{list-style:none;margin:0;padding:22px 20px 20px;display:grid;grid-template-columns:repeat(8,minmax(0,1fr))}
    @media (max-width:1000px){.steps{grid-template-columns:repeat(4,minmax(0,1fr));row-gap:22px}}
    .steps li{position:relative}
    .steps a{display:flex;flex-direction:column;align-items:center;text-align:center;gap:3px;padding:0 6px;color:inherit;text-decoration:none!important}
    .dotw{position:relative;z-index:1;padding:0 6px;background:var(--surface)}
    .dot{display:grid;place-items:center;width:36px;height:36px;border-radius:50%;border:2px solid var(--stone-200);background:var(--surface);color:var(--stone-400);transition:transform .12s}
    .steps a:hover .dot{transform:scale(1.06)}
    .bar{position:absolute;top:18px;left:calc(50% + 24px);right:calc(-50% + 24px);height:2px;background:var(--stone-200);border-radius:1px}
    .bar.full{background:var(--forest-400)}
    @media (max-width:1000px){.steps li:nth-child(4) .bar{display:none}}
    .sl{margin-top:6px;font-weight:600;font-size:13.5px;color:var(--stone-800)}
    .ss{font-size:11.5px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3)}
    .sd{font-size:12px;color:var(--text-3);line-height:1.35;max-width:150px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    li.done .dot{background:var(--forest-600);border-color:var(--forest-600);color:#fff}
    li.done .ss{color:var(--forest-600)}
    li.progress .dot{border-color:var(--amber-600);color:var(--amber-600);background:var(--amber-100)}
    li.progress .ss{color:var(--amber-600)}
    li.next .dot{border-color:var(--clay-500);color:var(--clay-600);background:var(--clay-50);box-shadow:0 0 0 4px var(--clay-100)}
    li.next .ss{color:var(--clay-600)}

    .split{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:16px}
    @media (max-width:1100px){.split{grid-template-columns:1fr}}
    .card-head a{display:inline-flex;align-items:center;gap:4px}
    .mapwrap{position:relative;padding:12px}
    .legend{display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:10px;font-size:12.5px;color:var(--stone-700)}
    .legend span{display:inline-flex;align-items:center;gap:6px}
    .legend i{width:10px;height:10px;border-radius:3px}
    .legend b{font-weight:500;color:var(--text-3)}
    .chartbody{padding-top:12px}
    .cap{margin-top:6px}
    .seg{display:inline-flex;padding:2px;gap:2px;background:var(--surface-2);border:1px solid var(--border);border-radius:8px}
    .seg button{height:26px;padding:0 10px;border:0;background:none;border-radius:6px;font:500 12.5px var(--font);color:var(--stone-600);cursor:pointer}
    .seg button.on{background:var(--surface);color:var(--forest-700);box-shadow:var(--shadow-sm)}

    .count{display:inline-grid;place-items:center;min-width:22px;height:20px;padding:0 6px;border-radius:10px;background:var(--clay-100);color:var(--clay-700);font-size:12px;font-weight:600}
    .allclear{display:flex;align-items:center;gap:10px;padding:18px 20px;color:var(--forest-700)}
    .att{list-style:none;margin:0;padding:0}
    .att li{display:flex;align-items:center;gap:14px;padding:12px 20px;border-bottom:1px solid var(--stone-100)}
    .att li:last-child{border-bottom:0}
    .ai{display:grid;place-items:center;width:32px;height:32px;border-radius:8px;flex:none}
    .danger .ai{background:var(--red-100);color:var(--red-600)}
    .warn .ai{background:var(--amber-100);color:var(--amber-600)}
    .info .ai{background:var(--sky-100);color:var(--sky-600)}
    .at{flex:1;display:flex;flex-direction:column;gap:1px;min-width:0}
    .at strong{font-size:13.5px} .at span{font-size:12.5px;color:var(--text-2)}
  `],
})
export class OverviewPage {
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  private api = inject(ApiService);
  private router = inject(Router);
  journeyDef = JOURNEY;

  project = this.ctx.current;
  programme = signal<Programme | null>(null);
  summary = signal<ProgrammeSummary | null>(null);
  readiness = signal<Readiness | null>(null);
  readinessFailed = signal(false);
  runs = signal<Run[]>([]);
  latestDetail = signal<RunDetail | null>(null);
  qa = signal<QaSummary | null>(null);
  enrolments = signal<Enrolment[]>([]);
  campaigns = signal<Campaign[]>([]);
  batches = signal<CreditBatch[]>([]);
  sales = signal<Sale[]>([]);
  payouts = signal<PayoutBatch[]>([]);
  packs = signal<RulePackLite[]>([]);
  crops = signal<Crop[]>([]);
  fields = signal<GeoJSON.FeatureCollection | null>(null);
  chartMode = signal<'strata' | 'period'>('strata');

  firstName = computed(() => (this.auth.profile()?.full_name ?? '').split(' ')[0]);

  constructor() {
    this.api.get<Crop[]>('/catalogue/crops').pipe(catchError(() => of([]))).subscribe(c => this.crops.set(c));
    let last: string | null = null;
    effect(() => {
      const p = this.project();
      if (p && p.id !== last) { last = p.id; this.load(p.id, p.programme_id); }
    });
  }

  private load(pid: string, progId: string) {
    this.readiness.set(null);
    this.readinessFailed.set(false);
    this.latestDetail.set(null);
    this.fields.set(null);
    this.programme.set(null);
    this.summary.set(null);
    const can = (p: string) => this.auth.can(p);
    safe(this.api.get<Programme>(`/programmes/${progId}`), null).subscribe(x => this.programme.set(x));
    safe(this.api.get<ProgrammeSummary>(`/programmes/${progId}/summary`), null).subscribe(x => this.summary.set(x));
    this.api.get<Readiness>(`/projects/${pid}/readiness`).subscribe({
      next: r => this.readiness.set(r), error: () => this.readinessFailed.set(true),
    });
    safe(this.api.get<QaSummary>(`/projects/${pid}/qa/summary`), null).subscribe(x => this.qa.set(x));
    safe(this.api.get<Enrolment[]>(`/projects/${pid}/enrolments`), []).subscribe(x => this.enrolments.set(x));
    safe(this.api.get<Campaign[]>(`/projects/${pid}/campaigns`), []).subscribe(x => this.campaigns.set(Array.isArray(x) ? x : []));
    safe(this.api.get<GeoJSON.FeatureCollection>('/fields/geojson', { project_id: pid }), { type: 'FeatureCollection', features: [] } as GeoJSON.FeatureCollection)
      .subscribe(fc => this.fields.set({ ...fc, features: fc.features.filter(f => f.properties?.['enrolment_status'] && f.properties['enrolment_status'] !== 'withdrawn') }));
    safe(this.api.get<Run[]>(`/projects/${pid}/calculations`), []).subscribe(runs => {
      this.runs.set(runs);
      const pick = runs.find(r => r.status === 'approved') ?? runs[0];
      if (pick) safe(this.api.get<RunDetail>(`/calculations/${pick.id}`), null).subscribe(d => this.latestDetail.set(d));
    });
    forkJoin({
      batches: safe(this.api.get<CreditBatch[]>('/credit-batches', { project_id: pid }), []),
      sales: can('sales.manage') || can('data.read') ? safe(this.api.get<Sale[]>('/sales'), []) : of([] as Sale[]),
      payouts: safe(this.api.get<PayoutBatch[]>('/payout-batches'), []),
      packs: can('rules.approve') ? safe(this.api.get<RulePackLite[]>('/rule-packs', { status: 'draft' }), []) : of([] as RulePackLite[]),
    }).subscribe(r => {
      this.batches.set(r.batches);
      const ids = new Set(r.batches.map(b => b.id));
      this.sales.set(r.sales.filter(s => ids.has(s.batch_id)));
      this.payouts.set(r.payouts);
      this.packs.set(r.packs);
    });
  }

  /* ------------------------------------------------------------ derived */
  enrolStats = computed(() => {
    const es = this.enrolments();
    const on = es.filter(e => e.status === 'enrolled');
    return {
      farmers: new Set(on.map(e => e.farmer_id)).size, fields: on.length,
      area: on.reduce((a, e) => a + (e.field_area_ha || 0), 0),
      pending: es.filter(e => e.status === 'eligible' || e.status === 'pending').length,
    };
  });

  sampling = computed(() => {
    const cs = this.campaigns();
    return {
      campaigns: cs.length,
      planned: cs.reduce((a, c) => a + (c.progress?.points_total ?? 0), 0),
      collected: cs.reduce((a, c) => a + (c.progress?.points_collected ?? 0), 0),
    };
  });

  latestApproved = computed(() => this.runs().find(r => r.status === 'approved') ?? null);

  qaHint = computed(() => {
    const q = this.qa();
    if (!q) return 'Quality checks';
    const w = q.open_by_severity?.['warning'] ?? 0;
    return q.blocking ? 'Calculations are blocked until resolved' : w ? `${w} open warning${w === 1 ? '' : 's'}` : 'All clear';
  });

  nextBlocker = computed(() => this.readiness()?.dimensions.find(d => d.status === 'blocking') ?? null);
  okCount = computed(() => this.readiness()?.dimensions.filter(d => d.status === 'ok').length ?? 0);

  steps = computed<Step[]>(() => {
    const dims = new Map((this.readiness()?.dimensions ?? []).map(d => [d.key, d]));
    const raw = JOURNEY.map(j => {
      let status: 'ok' | 'warning' | 'blocking' | 'none' = 'none';
      let detail = '';
      if (j.dims.length) {
        const ds = j.dims.map(k => dims.get(k)).filter((d): d is Dim => !!d);
        if (ds.length) {
          const worst = ds.find(d => d.status === 'blocking') ?? ds.find(d => d.status === 'warning');
          status = worst ? worst.status : 'ok';
          detail = (worst ?? ds[0]).detail;
        }
      } else if (j.key === 'sell') {
        const sold = this.sales().length, b = this.batches().length;
        status = sold ? 'ok' : b ? 'warning' : 'blocking';
        detail = sold ? `${sold} sale${sold === 1 ? '' : 's'} recorded` : b ? `${b} credit batch${b === 1 ? '' : 'es'}, none sold` : 'No credits issued yet';
      } else if (j.key === 'pay') {
        const done = this.payouts().filter(p => p.status === 'completed').length, any = this.payouts().length;
        status = done ? 'ok' : any ? 'warning' : 'blocking';
        detail = done ? `${done} payout batch${done === 1 ? '' : 'es'} paid` : any ? `${any} batch${any === 1 ? '' : 'es'} in progress` : 'No payouts yet';
      }
      return { ...j, status, detail };
    });
    let nextGiven = false;
    return raw.map(r => {
      let state: StepState = r.status === 'ok' ? 'done' : r.status === 'warning' ? 'progress' : 'todo';
      if (state !== 'done' && !nextGiven) { if (state === 'todo') state = 'next'; nextGiven = true; }
      return { key: r.key, label: r.label, icon: r.icon, link: r.link, state, detail: r.detail || 'Waiting on earlier steps' };
    });
  });

  cropColors = computed(() => {
    const codes = [...new Set((this.fields()?.features ?? []).map(f => (f.properties?.['crop_code'] as string) ?? ''))].sort();
    return new Map(codes.map((c, i) => [c, c ? PALETTE[i % PALETTE.length] : '#9aa29c']));
  });

  coloured = computed(() => {
    const fc = this.fields();
    if (!fc) return null;
    const colors = this.cropColors();
    const names = new Map(this.crops().map(c => [c.code, c.name]));
    return {
      ...fc,
      features: fc.features.map(f => {
        const p = f.properties ?? {};
        const crop = (p['crop_code'] as string) ?? '';
        return {
          ...f,
          properties: {
            ...p, color: colors.get(crop),
            label: `<strong>${esc(String(p['name'] ?? ''))}</strong><br><span style="color:#58625b">${esc(String(p['code'] ?? ''))} · ${esc(names.get(crop) ?? (crop || 'No crop'))} · ${fmtNum(Number(p['area_ha']), 2)} ha</span>`,
          },
        };
      }),
    } as GeoJSON.FeatureCollection;
  });

  /** Field centres, so small fields stay visible at district zoom. */
  centroids = computed<GeoJSON.FeatureCollection | null>(() => {
    const fc = this.coloured();
    if (!fc) return null;
    return {
      type: 'FeatureCollection',
      features: fc.features.map(f => {
        const g = f.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
        const ring = (g.type === 'Polygon' ? g.coordinates[0] : g.coordinates[0]?.[0]) ?? [];
        const pts = ring.slice(0, Math.max(1, ring.length - 1));
        const x = pts.reduce((a, c) => a + c[0], 0) / (pts.length || 1);
        const y = pts.reduce((a, c) => a + c[1], 0) / (pts.length || 1);
        return { type: 'Feature', id: f.id, geometry: { type: 'Point', coordinates: [x, y] }, properties: f.properties } as GeoJSON.Feature;
      }),
    };
  });

  cropLegend = computed(() => {
    const names = new Map(this.crops().map(c => [c.code, c.name]));
    const counts = new Map<string, number>();
    for (const f of this.fields()?.features ?? []) {
      const c = (f.properties?.['crop_code'] as string) ?? '';
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    return [...this.cropColors().entries()].map(([code, color]) => ({
      code, color, name: names.get(code) ?? (code || 'No crop recorded'), count: counts.get(code) ?? 0,
    }));
  });

  strataOption = computed(() => {
    const st = this.latestDetail()?.results?.strata ?? [];
    if (!st.length) return null;
    const cats = st.map(s => s.code);
    return {
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: (ps: { dataIndex: number }[]) => {
          const s = st[ps[0].dataIndex];
          return `<strong>${esc(s.code)}</strong><br>ΔSOC ${fmtNum(s.delta_t_c_ha, 2)} t C/ha ± ${fmtNum(s.se, 2)}<br>${fmtNum(s.area_ha, 1)} ha · ${s.n_used} sites`;
        },
      },
      grid: { left: 8, right: 16, top: 32, bottom: 8, containLabel: true },
      xAxis: { type: 'category', data: cats },
      yAxis: { type: 'value', name: 't C/ha', nameTextStyle: { color: '#737c76', fontSize: 11, align: 'left' } },
      series: [
        { type: 'bar', barMaxWidth: 36, data: st.map(s => ({ value: round(s.delta_t_c_ha), itemStyle: { color: s.delta_t_c_ha >= 0 ? PALETTE[0] : PALETTE[1], borderRadius: s.delta_t_c_ha >= 0 ? [4, 4, 0, 0] : [0, 0, 4, 4] } })),
          label: { show: st.length <= 8, position: 'insideBottom', distance: 8, fontSize: 11, fontWeight: 600, color: '#ffffff', formatter: (p: { value: number }) => fmtNum(p.value, 2) } },
        {
          type: 'line', silent: true, symbol: 'none', lineStyle: { width: 0 }, tooltip: { show: false }, data: [],
          markLine: {
            silent: true, symbol: 'none', lineStyle: { color: '#58625b', width: 1.2, type: 'solid' }, label: { show: false },
            data: st.map((s, i) => [{ coord: [i, round(s.delta_t_c_ha - s.se)] }, { coord: [i, round(s.delta_t_c_ha + s.se)] }]),
          },
        },
      ],
    };
  });

  periodOption = computed(() => {
    const by = new Map<string, Run>();
    for (const r of [...this.runs()].reverse()) {
      const cur = by.get(r.period_label);
      if (!cur || r.status === 'approved' || cur.status !== 'approved') by.set(r.period_label, r);
    }
    const rows = [...by.values()].filter(r => r.net_t_co2e !== null).sort((a, b) => a.period_start.localeCompare(b.period_start));
    if (!rows.length) return null;
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: (ps: { dataIndex: number }[]) => { const r = rows[ps[0].dataIndex]; return `<strong>${esc(r.period_label)}</strong><br>${fmtNum(r.net_t_co2e, 1)} tCO₂e · ${esc(r.status.replace(/_/g, ' '))}`; } },
      grid: { left: 8, right: 16, top: 32, bottom: 8, containLabel: true },
      xAxis: { type: 'category', data: rows.map(r => r.period_label) },
      yAxis: { type: 'value', name: 'tCO₂e', nameTextStyle: { color: '#737c76', fontSize: 11, align: 'left' } },
      series: [{ type: 'bar', barMaxWidth: 40,
        data: rows.map(r => ({ value: round(r.net_t_co2e ?? 0), itemStyle: { color: r.status === 'approved' ? PALETTE[0] : '#86b797', borderRadius: [4, 4, 0, 0] } })),
        label: { show: rows.length <= 8, position: 'top', fontSize: 11, color: '#414b45', formatter: (p: { value: number }) => fmtNum(p.value, 1) } }],
    };
  });

  chartOption = computed(() => {
    const s = this.strataOption(), p = this.periodOption();
    if (this.chartMode() === 'period' && p) return p;
    return s ?? p;
  });

  attention = computed<Attention[]>(() => {
    const out: Attention[] = [];
    const me = this.auth.profile()?.id;
    const q = this.qa();
    if (q?.blocking) {
      out.push({ tone: 'danger', icon: 'shield', title: `${q.blocking} blocking quality issue${q.blocking === 1 ? '' : 's'}`,
        text: 'Calculations can’t run until these are resolved or acknowledged with a reason.', link: '/app/quality', action: 'Review issues' });
    }
    if (this.auth.can('calc.approve')) {
      for (const r of this.runs().filter(r => r.status === 'submitted')) {
        const own = r.created_by === me;
        out.push({ tone: own ? 'info' : 'warn', icon: 'calculator', title: `Calculation ${r.period_label} awaiting approval`,
          text: own ? 'You ran this calculation, so someone else must approve it.' : `${fmtNum(r.net_t_co2e, 1)} tCO₂e net · submitted for approval.`,
          link: '/app/calculations', action: own ? 'View' : 'Review' });
      }
    }
    const waiting = this.enrolments().filter(e => e.status === 'eligible').length;
    if (waiting && this.auth.can('land.manage')) {
      out.push({ tone: 'warn', icon: 'users', title: `${waiting} eligible field${waiting === 1 ? '' : 's'} awaiting confirmation`,
        text: 'They passed every eligibility check. Confirm them to count towards the project.', link: 'project', action: 'Confirm' });
    }
    if (this.auth.can('rules.approve')) {
      for (const p of this.packs().filter(p => (p.outstanding_count ?? 0) === 0)) {
        out.push({ tone: 'warn', icon: 'scale', title: `Rule pack ready to approve: ${p.title}`,
          text: `${p.methodology_code} v${p.methodology_version} rev ${p.revision}${p.created_by ? ' · drafted by ' + p.created_by : ''}.`,
          link: '/app/methodology', action: 'Review' });
      }
    }
    if (this.auth.can('payout.approve')) {
      for (const b of this.payouts().filter(b => b.status === 'submitted')) {
        const own = b.created_by === me;
        out.push({ tone: own ? 'info' : 'warn', icon: 'hand-coins', title: `Payout batch ${b.code} awaiting approval`,
          text: own ? 'You prepared this batch, so a different person must approve it.' : 'Check the farmer lines, then approve.',
          link: '/app/benefits', action: own ? 'View' : 'Review' });
      }
    }
    for (const d of (this.readiness()?.dimensions ?? []).filter(d => d.status === 'blocking' && d.key !== 'open_blocking_qa').slice(0, 3)) {
      out.push({ tone: 'info', icon: 'alert', title: d.label, text: d.detail, link: DIM_LINK[d.key] ?? '/app/overview', action: 'Open' });
    }
    return out;
  });

  ringDash(pct: number) {
    const c = 2 * Math.PI * 27;
    return `${(Math.max(0, Math.min(100, pct)) / 100) * c} ${c}`;
  }
  stateLabel(s: StepState) { return { done: 'Done', progress: 'In progress', next: 'Up next', todo: 'Not started' }[s]; }
  dimLink(key: string) {
    const l = DIM_LINK[key] ?? '/app/overview';
    return l === 'project' ? ['/app/programmes/projects', this.project()?.id] : l;
  }
  openField(id: string) { this.router.navigate(['/app/fields', id]); }
}

function round(v: number) { return Math.round(v * 1000) / 1000; }
function esc(s: string) { return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!); }
