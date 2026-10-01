import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe, fmtNum } from '../../core/format';
import { KIT } from '../../ui/kit';
import { BalanceBar, Balances, money } from '../credits/credit-ui';

interface Credits { issued: number; pending_issuance: number; available: number; reserved: number; sold: number; retired: number; buffer: number }
interface ProjectSummary {
  id: string; code: string; name: string; status: string; methodology: string; crediting_period: [string | null, string | null];
  farmers_enrolled: number; fields_enrolled: number; area_ha: number; samples: number;
  latest_approved_result: { run_id: string; period: [string, string]; net_t_co2e: number; reductions_t_co2e: number; removals_t_co2e: number; buffer_t_co2e: number } | null;
  credits: Credits; open_risk_events: number; open_grievances: number; payouts?: { paid_amount: string; by_status: Record<string, { count: number; amount: string }> };
}
interface Overview {
  programmes: { id: string; code: string; name: string; status: string; region: string; projects: ProjectSummary[] }[];
  totals: Record<string, number | string>; pii_masked: boolean;
}
interface ProjectDetail {
  programme: { id: string; code: string; name: string } | null; project: ProjectSummary;
  credit_batches: { code: string; vintage: number; status: string; registry: string | null; serial_start: string | null; serial_end: string | null }[];
  participants: { farmer: { code: string; name: string; village: string; district: string; masked: boolean } | null; fields: { code: string; area_ha: number; crop_code: string | null; enrolled_on: string | null }[]; area_ha: number }[];
  pii_masked: boolean;
}
interface Compliance { plans_by_status: Record<string, number>; commitments_by_status: Record<string, number>; plans_with_not_met: number; open_deviations: number }

const STAGES = ['design', 'active', 'monitoring', 'closed'];
const STAGE_LABEL: Record<string, string> = { design: 'Design', active: 'Enrolling & sampling', monitoring: 'Monitoring', closed: 'Closed' };
const BATCH_LABEL: Record<string, string> = { provisional: 'Provisional', verified: 'Verified', issued: 'Issued on registry', cancelled: 'Cancelled' };

@Component({
  selector: 'vc-portfolio-page',
  imports: [...KIT, NumPipe, DayPipe, BalanceBar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Client portfolio" [eyebrow]="auth.profile()?.organization?.name ?? 'Portfolio'"
      subtitle="Progress and results across every programme and project: land and farmers enrolled, soil samples, verified results and credits.">
      @if (ov()?.pii_masked) { <span actions class="mask"><vc-icon name="lock" [size]="14" />Farmer identities are masked</span> }
    </vc-page-header>

    @if (loading()) { <div class="grid grid-4">@for (i of [1, 2, 3, 4]; track i) { <div class="card"><vc-loading [rows]="2" /></div> }</div> }
    @else if (error()) {
      <vc-error [title]="forbidden() ? 'This view isn’t available for your account' : 'Couldn’t load the portfolio'" [message]="error()!" />
    } @else if (ov(); as o) {
      @if (!projects().length) {
        <div class="card"><vc-empty icon="briefcase" title="No projects yet" text="Once a programme has projects, their progress and results appear here." /></div>
      } @else {
        <div class="kpis">
          <vc-stat label="Credits issued" [value]="t('credits_issued')" unit="tCO₂e" icon="coins" [accent]="true" [hint]="t('credits_pending_issuance') + ' t awaiting registry issuance'" />
          <vc-stat label="Area enrolled" [value]="t('area_ha', 1)" unit="ha" icon="map" [hint]="t('fields_enrolled', 0) + ' fields'" />
          <vc-stat label="Farmers enrolled" [value]="t('farmers_enrolled', 0)" icon="users" [hint]="o.pii_masked ? 'Count only — identities masked' : 'Across all projects'" />
          <vc-stat label="Soil samples" [value]="t('samples', 0)" icon="flask" hint="Collected for lab measurement" />
          <vc-stat label="Sold and retired" [value]="soldRetired()" unit="tCO₂e" icon="receipt" [hint]="t('credits_retired') + ' t retired by buyers'" />
          @if (o.totals['payouts_paid'] !== undefined) {
            <vc-stat label="Paid to farmers" [value]="mRound(o.totals['payouts_paid'])" icon="hand-coins" hint="Share of credit revenue, paid out" />
          } @else {
            <vc-stat label="Open risk events" [value]="t('open_risk_events', 0)" icon="radar" hint="Being assessed or mitigated" />
          }
        </div>

        <section class="card card-pad credits">
          <div class="ch"><h3>Credit inventory</h3><vc-dc cls="CALCULATED" /><span class="spacer"></span>
            <span class="small subtle">The non-permanence buffer is deducted before issuance and held in the registry’s pooled buffer account, so it is not part of this inventory.</span></div>
          <vcx-balance-bar [balances]="totalBalances()" label="All projects" icon="coins" />
        </section>

        @for (g of o.programmes; track g.id) {
          @if (g.projects.length) {
            <section class="prog">
              <div class="ph"><div><span class="mono small subtle">{{ g.code }}</span><h2>{{ g.name }}</h2></div>
                <span class="small muted">{{ g.region }}</span><vc-badge [status]="g.status" /></div>
              <div class="projects">
                @for (p of g.projects; track p.id) {
                  <article class="card proj" [class.on]="selId() === p.id">
                    <header>
                      <div class="pt"><span class="mono small subtle">{{ p.code }} · {{ p.methodology }}</span><h3>{{ p.name }}</h3></div>
                      <vc-badge [status]="p.status">{{ stage(p.status) }}</vc-badge>
                    </header>
                    <div class="stages">@for (s of stages; track s) { <span [class.done]="stageIdx(p.status) >= $index" [title]="stage(s)"></span> }</div>
                    <div class="pbody"><div class="pcol">
                    <div class="period">
                      <div class="row small"><span class="muted">Crediting period</span><span class="spacer"></span>
                        <span>{{ p.crediting_period[0] ? (p.crediting_period[0] | day) : 'Not set' }} – {{ p.crediting_period[1] ? (p.crediting_period[1] | day) : 'Not set' }}</span></div>
                      <vc-progress [value]="elapsed(p)" [max]="100" />
                      <span class="small subtle">{{ elapsedLabel(p) }}</span>
                    </div>
                    <div class="metrics">
                      <div><strong class="num">{{ p.area_ha | num: 1 }}</strong><span>ha</span></div>
                      <div><strong class="num">{{ p.farmers_enrolled }}</strong><span>farmers</span></div>
                      <div><strong class="num">{{ p.fields_enrolled }}</strong><span>fields</span></div>
                      <div><strong class="num">{{ p.samples }}</strong><span>samples</span></div>
                    </div>
                    </div><div class="pcol">
                    <div class="res">
                      @if (p.latest_approved_result; as r) {
                        <div class="rv"><span class="small muted">Latest approved result <vc-dc cls="CALCULATED" /></span>
                          <strong class="num">{{ r.net_t_co2e | num: 1 }} <small>tCO₂e net</small></strong>
                          <span class="small subtle">{{ r.period[0] | day }} – {{ r.period[1] | day }} · buffer {{ r.buffer_t_co2e | num: 1 }} t</span></div>
                      } @else { <div class="rv none"><span class="small muted">No approved result yet</span><span class="small subtle">Results appear after lab data is calculated and approved.</span></div> }
                    </div>
                    <vcx-balance-bar [balances]="bal(p.credits)" label="Credits" [showLegend]="false" />
                    <div class="ver">
                      @if (pkg(p.id); as k) { <vc-icon name="file-check" [size]="15" /><span>Verification package v{{ k.version }} issued {{ k.created_at | day }}</span><vc-hash [value]="k.sha256" /> }
                      @else { <vc-icon name="clock" [size]="15" /><span class="subtle">No verification package issued yet</span> }
                    </div>
                    </div></div>
                    <footer>
                      <span class="flag" [class.warn]="p.open_risk_events > 0"><vc-icon name="radar" [size]="13" />{{ p.open_risk_events }} open risk{{ p.open_risk_events === 1 ? '' : 's' }}</span>
                      <span class="flag" [class.warn]="p.open_grievances > 0"><vc-icon name="message" [size]="13" />{{ p.open_grievances }} open grievance{{ p.open_grievances === 1 ? '' : 's' }}</span>
                      @if (p.payouts) { <span class="flag"><vc-icon name="hand-coins" [size]="13" />{{ m(p.payouts.paid_amount) }} paid</span> }
                      <span class="spacer"></span>
                      <button class="btn btn-secondary btn-sm" (click)="select(p.id)">{{ selId() === p.id ? 'Showing details' : 'Details' }}<vc-icon name="chevron-down" [size]="13" /></button>
                    </footer>
                  </article>
                }
              </div>
            </section>
          }
        }

        @if (selId()) {
          <section class="detail" id="pdetail">
            @if (detailLoading()) { <div class="card"><vc-loading [rows]="6" /></div> }
            @else if (detailError()) { <vc-error title="Couldn't load project details" [message]="detailError()!" /> }
            @else if (detail(); as d) {
              <div class="dh"><div><span class="mono small subtle">{{ d.programme?.code }} / {{ d.project.code }}</span><h2>{{ d.project.name }}</h2></div>
                <button class="btn btn-ghost btn-sm" (click)="select(null)"><vc-icon name="x" [size]="14" />Close</button></div>
              <div class="dgrid">
                <section class="card">
                  <div class="card-head"><h3>Verification & credits</h3></div>
                  <div class="card-body stack">
                    @if (d.project.latest_approved_result; as r) {
                      <div class="waterfall">
                        <div><span>Removals</span><strong class="num">{{ r.removals_t_co2e | num: 1 }}</strong></div>
                        <div><span>Reductions</span><strong class="num">{{ r.reductions_t_co2e | num: 1 }}</strong></div>
                        <div><span>Buffer held back</span><strong class="num">−{{ r.buffer_t_co2e | num: 1 }}</strong></div>
                        <div class="net"><span>Net result</span><strong class="num">{{ r.net_t_co2e | num: 1 }} t</strong></div>
                      </div>
                    } @else { <p class="muted small">No calculation has been approved for this project yet.</p> }
                    <vcx-balance-bar [balances]="bal(d.project.credits)" label="Credit inventory" icon="coins" />
                  </div>
                  @if (d.credit_batches.length) {
                    <div class="table-wrap">
                      <table class="table">
                        <thead><tr><th>Batch</th><th class="num">Vintage</th><th>Status</th><th>Registry</th><th>Serials</th></tr></thead>
                        <tbody>@for (b of d.credit_batches; track b.code) {
                          <tr><td class="mono nowrap">{{ b.code }}</td><td class="num">{{ b.vintage }}</td><td><vc-badge [status]="b.status">{{ batchLabel(b.status) }}</vc-badge></td>
                            <td>{{ b.registry || '—' }}</td><td class="mono small">{{ b.serial_start ? b.serial_start + ' – ' + b.serial_end : '—' }}</td></tr>
                        }</tbody>
                      </table>
                    </div>
                  } @else { <vc-empty icon="coins" title="No credit batches yet" text="Batches are created from approved results, then verified and issued on the registry." /> }
                </section>

                <section class="card">
                  <div class="card-head"><h3>Participants</h3><span class="small subtle">{{ d.participants.length }} farmer{{ d.participants.length === 1 ? '' : 's' }}@if (d.pii_masked) { · masked }</span></div>
                  @if (compliance(); as c) {
                    <div class="comp">
                      <span class="small muted">Practice commitments <vc-dc cls="DERIVED" /></span>
                      <div class="cb">
                        @for (k of compKeys; track k.k) { @if (c.commitments_by_status[k.k]) { <span [style.flex-grow]="c.commitments_by_status[k.k]" [style.background]="k.c" [title]="k.label + ': ' + c.commitments_by_status[k.k]"></span> } }
                      </div>
                      <div class="cl small">@for (k of compKeys; track k.k) { <span><i [style.background]="k.c"></i>{{ k.label }} {{ c.commitments_by_status[k.k] ?? 0 }}</span> }</div>
                    </div>
                  }
                  @if (!d.participants.length) { <vc-empty icon="users" title="No enrolled farmers yet" /> }
                  @else {
                    <div class="table-wrap parts">
                      <table class="table">
                        <thead><tr><th>Farmer</th><th>Village</th><th class="num">Fields</th><th class="num">Area</th><th>Crops</th></tr></thead>
                        <tbody>@for (x of d.participants; track $index) {
                          <tr><td class="nowrap">@if (x.farmer?.masked) { <vc-icon name="lock" [size]="12" class="subtle" /> } {{ x.farmer?.name ?? 'Farmer' }}</td>
                            <td class="small">{{ place(x.farmer) }}</td>
                            <td class="num">{{ x.fields.length }}</td><td class="num nowrap">{{ x.area_ha | num: 2 }} ha</td>
                            <td class="small">{{ crops(x.fields) }}</td></tr>
                        }</tbody>
                      </table>
                    </div>
                  }
                </section>
              </div>
            }
          </section>
        }
      }
    }
  `,
  styles: [`
    .mask{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;background:var(--surface);border:1px solid var(--border);font-size:12.5px;color:var(--stone-700)}
    .kpis{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;margin-bottom:16px}
    @media (max-width:1280px){.kpis{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media (max-width:720px){.kpis{grid-template-columns:1fr 1fr}}
    .credits{margin-bottom:24px} .ch{display:flex;align-items:center;gap:8px;margin-bottom:12px}
    .prog{margin-bottom:24px}
    .ph{display:flex;align-items:flex-end;gap:12px;margin-bottom:12px} .ph > div{flex:1}
    .projects{display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:16px}
    @media (max-width:800px){.projects{grid-template-columns:1fr}}
    .proj{padding:18px;display:flex;flex-direction:column;gap:14px;transition:border-color .15s,box-shadow .15s}
    .proj.on{border-color:var(--forest-400);box-shadow:0 0 0 3px rgba(47,114,73,.12)}
    .proj header{display:flex;gap:10px;align-items:flex-start} .pt{flex:1}
    .stages{display:grid;grid-template-columns:repeat(4,1fr);gap:4px} .stages span{height:4px;border-radius:2px;background:var(--sand-200)} .stages span.done{background:var(--forest-500)}
    .period{display:flex;flex-direction:column;gap:6px}
    .pbody{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px 28px}
    .pcol{display:flex;flex-direction:column;gap:14px;min-width:0}
    .ver{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--stone-700);flex-wrap:wrap} .ver vc-icon{color:var(--forest-600)}
    .metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:12px 0;border-top:1px solid var(--stone-100);border-bottom:1px solid var(--stone-100)}
    .metrics div{display:flex;flex-direction:column} .metrics strong{font-size:19px;font-weight:600;color:var(--stone-900)} .metrics span{font-size:12px;color:var(--text-2)}
    .rv{display:flex;flex-direction:column;gap:2px} .rv strong{font-size:22px;font-weight:600;color:var(--forest-800)} .rv small{font-size:12px;font-weight:500;color:var(--text-3)}
    .rv span{display:flex;gap:6px;align-items:center}
    footer{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
    .flag{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;color:var(--text-2)} .flag.warn{color:var(--amber-600)}
    .detail{margin-top:8px;scroll-margin-top:80px}
    .dh{display:flex;align-items:flex-end;gap:12px;margin-bottom:12px} .dh > div{flex:1}
    .dgrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:start}
    @media (max-width:1100px){.dgrid{grid-template-columns:1fr}}
    .waterfall{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
    .waterfall div{display:flex;flex-direction:column;padding:10px 12px;border-radius:8px;background:var(--surface-2);border:1px solid var(--border)}
    .waterfall span{font-size:12px;color:var(--text-2)} .waterfall strong{font-size:17px;font-weight:600}
    .waterfall .net{background:var(--forest-50);border-color:var(--forest-200)} .waterfall .net strong{color:var(--forest-800)}
    @media (max-width:560px){.waterfall{grid-template-columns:1fr 1fr}}
    .comp{padding:14px 20px;border-bottom:1px solid var(--border);display:flex;flex-direction:column;gap:6px}
    .comp > span{display:flex;gap:6px;align-items:center}
    .cb{display:flex;gap:2px;height:10px;border-radius:5px;overflow:hidden;background:var(--sand-200)} .cb span{flex-basis:0;min-width:3px}
    .cl{display:flex;gap:12px;flex-wrap:wrap;color:var(--text-2)} .cl span{display:inline-flex;align-items:center;gap:5px} .cl i{width:8px;height:8px;border-radius:2px}
    .parts{max-height:460px;overflow:auto}
  `],
})
export class PortfolioPage {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  auth = inject(AuthService);
  stages = STAGES;
  compKeys = [
    { k: 'met', label: 'Met', c: 'var(--forest-500)' }, { k: 'partially', label: 'Partly met', c: 'var(--amber-600)' },
    { k: 'not_met', label: 'Not met', c: 'var(--red-600)' }, { k: 'upcoming', label: 'Upcoming', c: 'var(--stone-300)' },
  ];

  ov = signal<Overview | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  forbidden = signal(false);
  selId = signal<string | null>(this.route.snapshot.queryParamMap.get('project'));
  detail = signal<ProjectDetail | null>(null);
  detailLoading = signal(false);
  detailError = signal<string | null>(null);
  compliance = signal<Compliance | null>(null);
  private pkgs = signal<Record<string, { version: number; created_at: string; sha256: string } | null>>({});

  projects = computed(() => (this.ov()?.programmes ?? []).flatMap(g => g.projects));
  totalBalances = computed(() => {
    const t = this.ov()?.totals ?? {};
    const n = (k: string) => Number(t[`credits_${k}`] ?? 0);
    return { available: n('available'), reserved: n('reserved'), sold: n('sold'), retired: n('retired'), buffer: n('buffer'), cancelled: 0 } as Balances;
  });
  soldRetired = computed(() => fmtNum(this.totalBalances().sold + this.totalBalances().retired, 1));

  constructor() {
    this.api.get<Overview>('/portfolio/overview').subscribe({
      next: o => {
        this.ov.set(o);
        this.loading.set(false);
        const id = this.selId();
        if (id) this.loadDetail(id);
        for (const p of o.programmes.flatMap(g => g.projects)) {
          this.api.get<{ version: number; created_at: string; sha256: string }[]>(`/projects/${p.id}/packages`).pipe(catchError(() => of([])))
            .subscribe(r => this.pkgs.update(m => ({ ...m, [p.id]: r[0] ?? null })));
        }
      },
      error: (e: ApiError) => { this.loading.set(false); this.forbidden.set(e.status === 403); this.error.set(e.message); },
    });
  }

  place(f: { village: string; district: string } | null) { return f ? [f.village, f.district].filter(Boolean).join(', ') : '—'; }
  mRound(v: string | number | undefined) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(v ?? 0)); }
  pkg(id: string) { return this.pkgs()[id] ?? null; }
  t(k: string, digits = 1) { const v = this.ov()?.totals[k]; return v === undefined ? '—' : fmtNum(Number(v), digits); }
  m(v: string | number | undefined) { return money(v ?? 0); }
  bal(c: Credits): Balances { return { available: c.available, reserved: c.reserved, sold: c.sold, retired: c.retired, buffer: c.buffer, cancelled: 0 } as Balances; }
  stage(s: string) { return STAGE_LABEL[s] ?? s; }
  stageIdx(s: string) { return STAGES.indexOf(s); }
  batchLabel(s: string) { return BATCH_LABEL[s] ?? s; }
  crops(fs: { crop_code: string | null }[]) { return [...new Set(fs.map(f => f.crop_code).filter(Boolean))].join(', ') || '—'; }
  elapsed(p: ProjectSummary) {
    const [a, b] = p.crediting_period;
    if (!a || !b) return 0;
    const s = new Date(a).getTime(), e = new Date(b).getTime();
    return Math.max(0, Math.min(100, ((Date.now() - s) / (e - s)) * 100));
  }
  elapsedLabel(p: ProjectSummary) {
    const [a, b] = p.crediting_period;
    if (!a || !b) return 'Crediting period not set yet';
    const left = (new Date(b).getTime() - Date.now()) / (365.25 * 86400000);
    if (Date.now() < new Date(a).getTime()) return 'Not started';
    return left <= 0 ? 'Crediting period ended' : `${Math.round(this.elapsed(p))}% elapsed · ${left.toFixed(1)} years remaining`;
  }

  select(id: string | null) {
    this.selId.set(id);
    this.router.navigate([], { queryParams: { project: id }, replaceUrl: true });
    if (id) {
      this.loadDetail(id);
      setTimeout(() => document.getElementById('pdetail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    }
  }
  private loadDetail(id: string) {
    this.detailLoading.set(true);
    this.detailError.set(null);
    this.compliance.set(null);
    this.api.get<ProjectDetail>(`/portfolio/projects/${id}`).subscribe({
      next: d => { this.detail.set(d); this.detailLoading.set(false); },
      error: (e: ApiError) => { this.detailLoading.set(false); this.detailError.set(e.message); },
    });
    // Allowed for clients; the section is simply hidden if the API refuses or has no plans.
    this.api.get<Compliance>(`/projects/${id}/interventions/compliance`).pipe(catchError(() => of(null))).subscribe(c => {
      const any = c && Object.values(c.commitments_by_status ?? {}).some(n => n > 0);
      this.compliance.set(any ? c : null);
    });
  }
}
