import { ChangeDetectionStrategy, Component, Injectable, computed, inject, input, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { Brand } from '../../layout/brand';
import { Chart } from '../../ui/chart';
import { KIT } from '../../ui/kit';
import { Steps, TYPE_COLOR, TYPE_LABEL, money } from '../credits/credit-ui';
import { SALE_STEPS } from '../sales/sale-actions';
import { SaleReport, SaleReportCard } from '../sales/sale-report';

export interface Holding {
  sale_code: string; status: string; credit_type: 'reduction' | 'removal'; quantity: number; unit_price: string; currency: string;
  vintage: number; batch_code: string; project: { code: string; name: string } | null; registry: string | null;
  registry_project_ref: string | null; serial_start: string | null; serial_end: string | null; contract_ref: string | null;
  retirement: { beneficiary: string; quantity: number; retired_at: string | null; certificate_ref: string; registry: string | null; serials: [string | null, string | null] } | null;
  report_url: string;
}
export interface Portfolio { buyer: { id: string; name: string } | null; sales: Holding[]; totals: Record<string, number>; message?: string }

export function saleIdOf(h: Holding): string { return h.report_url.split('/').slice(-2, -1)[0] ?? ''; }

@Injectable({ providedIn: 'root' })
export class PortfolioStore {
  private api = inject(ApiService);
  readonly data = signal<Portfolio | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  load(force = false) {
    if (this.data() && !force) return;
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Portfolio>('/buyer/portfolio').subscribe({
      next: p => { this.data.set(p); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
}

/* ------------------------------------------------------------------ shell */
@Component({
  selector: 'vcb-shell',
  imports: [RouterOutlet, RouterLink, Brand, ...KIT],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="top no-print">
      <a routerLink="/buyer" class="bl"><vc-brand /></a>
      <span class="sep"></span>
      <span class="ctx">Buyer portal@if (store.data()?.buyer; as b) { · <strong>{{ b.name }}</strong> }</span>
      <span class="spacer"></span>
      <span class="who">{{ auth.profile()?.full_name }}</span>
      <button class="btn btn-secondary btn-sm" (click)="auth.logout()"><vc-icon name="logout" [size]="14" />Sign out</button>
    </header>
    <main><router-outlet /></main>
  `,
  styles: [`
    :host{display:block;min-height:100vh;background:var(--sand-100)}
    .top{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:14px;height:64px;padding:0 32px;background:var(--surface);border-bottom:1px solid var(--border)}
    .bl{text-decoration:none!important}
    .sep{width:1px;height:26px;background:var(--border)}
    .ctx{color:var(--text-2);font-size:13.5px} .ctx strong{color:var(--stone-900);font-weight:600}
    .spacer{flex:1} .who{font-size:13px;color:var(--text-2)}
    main{max-width:1280px;margin:0 auto;padding:28px 32px 56px}
    @media (max-width:720px){ .top{padding:0 16px} .who,.sep{display:none} .ctx{display:none} main{padding:20px 16px 40px} }
  `],
})
export class BuyerShell {
  auth = inject(AuthService);
  store = inject(PortfolioStore);
  constructor() { this.store.load(); }
}

/* ------------------------------------------------------------------ portfolio */
@Component({
  selector: 'vcb-portfolio',
  imports: [RouterLink, ...KIT, NumPipe, DayPipe, Chart, Steps],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (store.loading() && !store.data()) {
      <div class="card"><vc-loading [rows]="8" /></div>
    } @else if (store.error()) {
      <vc-error title="Couldn't load your portfolio" [message]="store.error()!"><button class="btn btn-secondary btn-sm" (click)="store.load(true)">Try again</button></vc-error>
    } @else if (store.data(); as p) {
      @if (!p.buyer) {
        <div class="card"><vc-empty icon="link" title="Account not linked yet" [text]="p.message ?? ''" /></div>
      } @else {
        <vc-page-header [title]="'Carbon portfolio'" [eyebrow]="p.buyer.name"
          subtitle="Soil-carbon credits you have bought from smallholder farms, with registry serials and retirement records. Aggregated project data only — no farmer personal data.">
          <button actions class="btn btn-secondary no-print" (click)="store.load(true)"><vc-icon name="refresh" />Refresh</button>
          <button actions class="btn btn-primary no-print" (click)="print()"><vc-icon name="download" />Download summary</button>
        </vc-page-header>

        <div class="grid grid-4 stats">
          <vc-stat label="Total purchased" [value]="purchased() | num: 1" unit="tCO₂e" icon="package" [accent]="true" [hint]="live().length + ' purchases'" />
          <vc-stat label="Delivered to you" [value]="delivered() | num: 1" unit="tCO₂e" icon="send" hint="Transferred on the registry" />
          <vc-stat label="Retired" [value]="(p.totals['retired'] ?? 0) | num: 1" unit="tCO₂e" icon="archive" hint="Claimed permanently for your inventory" />
          <vc-stat label="Order value" [value]="value()" icon="banknote" hint="Reserved, contracted and delivered; excludes cancelled" />
        </div>

        <div class="grid g2">
          <section class="card">
            <div class="card-head"><h3>Holdings by vintage</h3><span class="subtle small">tCO₂e, excluding cancelled</span></div>
            <div class="card-body">
              @if (live().length) { <vc-chart [option]="chart()" height="260px" /> }
              @else { <vc-empty icon="chart" title="No holdings yet" /> }
            </div>
            @if (live().length) {
              <div class="vt table-wrap">
                <table class="table">
                  <thead><tr><th>Vintage</th><th class="num">Removals</th><th class="num">Reductions</th><th class="num">Total</th></tr></thead>
                  <tbody>@for (v of byVintage(); track v.vintage) {
                    <tr><td>{{ v.vintage }}</td><td class="num">{{ v.removal | num: 2 }}</td><td class="num">{{ v.reduction | num: 2 }}</td><td class="num"><strong>{{ v.removal + v.reduction | num: 2 }}</strong></td></tr>
                  }</tbody>
                </table>
              </div>
            }
          </section>

          <section class="card">
            <div class="card-head"><h3>Retirement records</h3><span class="subtle small">{{ retired().length }}</span></div>
            <div class="card-body rets">
              @for (h of retired(); track h.sale_code) {
                <div class="ret">
                  <div class="rt"><vc-icon name="verified" [size]="18" /><strong class="num">{{ h.retirement!.quantity | num: 2 }} tCO₂e</strong>
                    <span class="spacer"></span><span class="subtle small">{{ h.retirement!.retired_at | day }}</span></div>
                  <div class="small">On behalf of <strong>{{ h.retirement!.beneficiary }}</strong></div>
                  <div class="small muted">{{ h.retirement!.registry }} · certificate <span class="mono">{{ h.retirement!.certificate_ref }}</span></div>
                  <div class="small mono subtle">{{ h.retirement!.serials[0] }} → {{ h.retirement!.serials[1] }}</div>
                  <a class="small no-print" [routerLink]="['sales', saleId(h)]">View report <vc-icon name="arrow-right" [size]="12" /></a>
                </div>
              } @empty {
                <vc-empty icon="archive" title="Nothing retired yet" text="When you retire credits against your emissions, the record appears here with its registry serials." />
              }
            </div>
          </section>
        </div>

        <section class="card">
          <div class="card-head"><h3>Purchases & deliveries</h3></div>
          @if (!p.sales.length) {
            <vc-empty icon="handshake" title="No purchases yet" text="Your purchases will appear here once the programme reserves credits for you." />
          } @else {
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Purchase</th><th>Project</th><th>Vintage</th><th>Type</th><th class="num">Quantity</th><th>Batch serial range</th><th>Status</th><th class="no-print"></th></tr></thead>
                <tbody>
                  @for (h of p.sales.slice().reverse(); track h.sale_code) {
                    <tr [class.cancel]="h.status === 'cancelled'">
                      <td><span class="mono strong">{{ h.sale_code }}</span>@if (h.contract_ref) { <div class="subtle small mono">{{ h.contract_ref }}</div> }</td>
                      <td>{{ h.project?.name }}<div class="subtle small">{{ h.project?.code }}</div></td>
                      <td>{{ h.vintage }}</td>
                      <td><span class="tchip"><i [style.background]="color[h.credit_type]"></i>{{ typeLabel[h.credit_type] }}</span></td>
                      <td class="num"><strong>{{ h.quantity | num: 2 }}</strong> t</td>
                      <td class="small">@if (h.serial_start) { <span class="muted">{{ h.registry }}</span><div class="mono ser">{{ h.serial_start }}<br />{{ h.serial_end }}</div> } @else { <span class="subtle">—</span> }</td>
                      <td><vcx-steps [steps]="steps" [current]="h.status" [compact]="true" /></td>
                      <td class="num no-print"><a class="btn btn-ghost btn-sm" [routerLink]="['sales', saleId(h)]">Report</a></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
        <p class="foot small subtle">Figures are calculated by the Varsapradaya Carbon engine from lab-measured soil samples and verified before issuance. Generated {{ now | day: true }}.</p>
      }
    }
  `,
  styles: [`
    .stats{margin-bottom:20px}
    .g2{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);margin-bottom:20px}
    .vt{border-top:1px solid var(--border)}
    .rets{display:flex;flex-direction:column;gap:10px;max-height:460px;overflow:auto}
    .ret{display:flex;flex-direction:column;gap:3px;padding:12px 14px;border:1px solid var(--forest-200);border-radius:10px;background:var(--forest-50)}
    .rt{display:flex;align-items:center;gap:8px;color:var(--forest-700)} .rt strong{color:var(--stone-900)}
    .spacer{flex:1}
    .strong{font-weight:600}
    .tchip{display:inline-flex;align-items:center;gap:6px;white-space:nowrap} .tchip i{width:8px;height:8px;border-radius:2px}
    .ser{font-size:11.5px;color:var(--stone-700)}
    tr.cancel td{opacity:.55}
    .foot{margin-top:16px}
    @media (max-width:1100px){ .g2{grid-template-columns:1fr} }
    @media print{ .g2{grid-template-columns:1fr 1fr} .rets{max-height:none} }
  `],
})
export class BuyerPortfolio {
  store = inject(PortfolioStore);
  steps = SALE_STEPS;
  typeLabel = TYPE_LABEL;
  color = TYPE_COLOR;
  now = new Date().toISOString();

  live = computed(() => (this.store.data()?.sales ?? []).filter(s => s.status !== 'cancelled'));
  retired = computed(() => this.live().filter(s => s.retirement).reverse());
  purchased = computed(() => this.live().reduce((a, s) => a + s.quantity, 0));
  delivered = computed(() => this.live().filter(s => s.status === 'delivered' || s.status === 'retired').reduce((a, s) => a + s.quantity, 0));
  value = computed(() => {
    const l = this.live();
    const cur = l[0]?.currency ?? 'INR';
    return money(l.filter(s => s.currency === cur).reduce((a, s) => a + s.quantity * Number(s.unit_price), 0), cur);
  });
  byVintage = computed(() => {
    const m = new Map<number, { vintage: number; removal: number; reduction: number }>();
    for (const s of this.live()) {
      const v = m.get(s.vintage) ?? { vintage: s.vintage, removal: 0, reduction: 0 };
      v[s.credit_type] += s.quantity;
      m.set(s.vintage, v);
    }
    return [...m.values()].sort((a, b) => a.vintage - b.vintage);
  });
  chart = computed(() => {
    const rows = this.byVintage();
    const series = (['removal', 'reduction'] as const).map((t, i) => ({
      name: TYPE_LABEL[t], type: 'bar', stack: 'v', barMaxWidth: 48, data: rows.map(r => Math.round(r[t] * 100) / 100),
      itemStyle: { color: TYPE_COLOR[t], borderRadius: i === 1 ? [4, 4, 0, 0] : 0, borderColor: '#fff', borderWidth: 1 },
      emphasis: { focus: 'series' },
    }));
    return {
      grid: { top: 36 },
      legend: { data: series.map(s => s.name) },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v: number) => `${v.toLocaleString('en-IN')} tCO₂e` },
      xAxis: { type: 'category', data: rows.map(r => String(r.vintage)) },
      yAxis: { type: 'value', name: 'tCO₂e', nameTextStyle: { color: '#737c76', fontSize: 11, align: 'left' } },
      series,
    };
  });
  saleId = saleIdOf;
  print() { window.print(); }
}

/* ------------------------------------------------------------------ one purchase */
@Component({
  selector: 'vcb-sale',
  imports: [RouterLink, ...KIT, NumPipe, DayPipe, SaleReportCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row no-print top">
      <a routerLink="/buyer" class="back small"><vc-icon name="arrow-left" [size]="14" />Portfolio</a>
      <span class="spacer"></span>
      <button class="btn btn-primary" (click)="print()"><vc-icon name="download" />Download summary</button>
    </div>
    @if (report(); as r) {
      <vcx-sale-report [report]="r" />
    } @else if (loading()) {
      <div class="card"><vc-loading [rows]="8" /></div>
    } @else if (holding(); as h) {
      <!-- report not available to this account: summarise from the portfolio -->
      <article class="card">
        <div class="card-head"><h2>{{ h.quantity | num: 3 }} tCO₂e · {{ typeLabel[h.credit_type].toLowerCase() }}</h2><vc-badge [status]="h.status" /></div>
        <div class="card-body">
          <dl class="kv">
            <dt>Purchase</dt><dd class="mono">{{ h.sale_code }}</dd>
            <dt>Project</dt><dd>{{ h.project?.code }} · {{ h.project?.name }}</dd>
            <dt>Vintage</dt><dd>{{ h.vintage }}</dd>
            <dt>Contract</dt><dd class="mono">{{ h.contract_ref || '—' }}</dd>
            <dt>Registry</dt><dd>{{ h.registry || '—' }} {{ h.registry_project_ref ? '· ' + h.registry_project_ref : '' }}</dd>
            <dt>Serials</dt><dd class="mono small">{{ h.serial_start || '—' }} → {{ h.serial_end || '—' }}</dd>
            @if (h.retirement; as rt) { <dt>Retired</dt><dd>{{ rt.quantity | num: 2 }} t for {{ rt.beneficiary }} · {{ rt.retired_at | day }}</dd> }
          </dl>
          @if (error()) { <p class="subtle small" style="margin-top:14px">The detailed supply-chain report isn't available right now: {{ error() }}</p> }
        </div>
      </article>
    } @else {
      <vc-error title="Couldn't load this purchase" [message]="error() ?? 'Not found.'" />
    }
  `,
  styles: [`
    .top{margin-bottom:18px} .spacer{flex:1}
    .back{display:inline-flex;align-items:center;gap:6px;color:var(--text-2)}
  `],
})
export class BuyerSale {
  id = input.required<string>();
  private api = inject(ApiService);
  private store = inject(PortfolioStore);
  typeLabel = TYPE_LABEL;
  report = signal<SaleReport | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  holding = computed(() => (this.store.data()?.sales ?? []).find(h => saleIdOf(h) === this.id()) ?? null);

  ngOnInit() {
    this.store.load();
    this.api.get<SaleReport>(`/sales/${this.id()}/report`).subscribe({
      next: r => { this.report.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
  print() { window.print(); }
}
