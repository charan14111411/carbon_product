import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Chart } from '../../ui/chart';
import { KIT } from '../../ui/kit';
import { money } from '../credits/credit-ui';
import { Sale } from '../sales/sale-actions';
import { BenefitPool, PayoutBatch, WEIGHT_LABEL } from './benefit-types';

@Component({
  selector: 'vcx-pools-tab',
  imports: [...KIT, NumPipe, DayPipe, Chart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted">A benefit pool sets aside the farmers' share of one delivered sale and splits it between enrolled farmers using the approved rule. Amounts are exact to the paisa.</p>
      <span class="spacer"></span>
      @if (canPrepare) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New pool from a sale</button> }
    </div>

    <section class="card">
      @if (loading()) { <vc-loading [rows]="5" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load benefit pools" [message]="error()!" /></div> }
      @else if (!pools().length) {
        <vc-empty icon="hand-coins" title="No benefit pools yet" text="When credits are delivered to a buyer, create a pool from that sale to work out each farmer's share.">
          @if (canPrepare) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New pool from a sale</button> }
        </vc-empty>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Sale</th><th class="num">Gross</th><th class="num">Deductions</th><th class="num">Farmer pool</th><th class="num">Farmers</th><th>Rule</th><th>Status</th><th>Created</th></tr></thead>
            <tbody>
              @for (p of pools(); track p.id) {
                <tr class="clickable" (click)="openPool(p.id)">
                  <td class="mono strong">{{ p.breakdown.sale_code }}</td>
                  <td class="num">{{ m(p.gross_amount, p.currency) }}</td>
                  <td class="num muted">− {{ m(p.deductions_amount, p.currency) }}</td>
                  <td class="num"><strong>{{ m(p.farmer_pool_amount, p.currency) }}</strong></td>
                  <td class="num">{{ p.breakdown.farmers }}</td>
                  <td>v{{ p.breakdown.rule_version }} · {{ p.breakdown.farmer_share_pct }}%</td>
                  <td><vc-badge [status]="p.status" /></td>
                  <td class="subtle">{{ p.created_at | day }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <!-- create -->
    <vc-modal [(open)]="createOpen" title="New benefit pool" subtitle="Choose a delivered sale. The current approved rule for its programme is applied." width="600px">
      @if (salesLoading()) { <vc-loading [rows]="3" /> }
      @else if (!eligible().length) {
        <vc-empty icon="send" title="No delivered sales waiting" text="Every delivered sale already has a pool, or no sale has been delivered yet." />
      } @else {
        <div class="opts">
          @for (s of eligible(); track s.id) {
            <label class="opt" [class.on]="pick() === s.id">
              <input type="radio" name="sale" [checked]="pick() === s.id" (change)="pick.set(s.id)" />
              <div class="ob"><strong class="mono">{{ s.code }}</strong><span class="small muted">{{ s.buyer_name }} · {{ s.quantity | num: 2 }} t · vintage {{ s.vintage }}</span></div>
              <strong class="num">{{ m(s.total_amount, s.currency) }}</strong>
            </label>
          }
        </div>
      }
      @if (createError()) { <vc-error title="Couldn't create the pool" [message]="createError()!" style="margin-top:12px" /> }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!pick() || busy()" (click)="create()">Calculate pool</button>
      </ng-container>
    </vc-modal>

    <!-- detail -->
    <vc-modal [open]="!!detail() || detailLoading()" (closed)="detail.set(null); detailLoading.set(false)" [drawer]="true" width="min(920px, 100vw)"
      [title]="detail() ? 'Benefit pool · ' + detail()!.breakdown.sale_code : 'Benefit pool'"
      [subtitle]="detail() ? 'Rule version ' + detail()!.breakdown.rule_version + ' · period ' + period(detail()!) : ''">
      @if (detailLoading() && !detail()) { <vc-loading [rows]="8" /> }
      @if (detail(); as p) {
        <div class="stack">
          <div class="row wrap">
            <vc-badge [status]="p.status" /><vc-dc [cls]="p.data_class" />
            <span class="subtle small">{{ p.breakdown.quantity_t | num: 3 }} t × {{ m(p.breakdown.unit_price ?? '0', p.currency) }} per tonne</span>
          </div>

          <section class="card">
            <div class="card-head"><h3>From sale value to farmer pool</h3></div>
            <div class="card-body"><vc-chart [option]="waterfall()" height="260px" /></div>
            <div class="wf-table">
              <div class="wl"><span>Gross sale value</span><span class="num">{{ m(p.gross_amount, p.currency) }}</span></div>
              @for (d of p.breakdown.deductions ?? []; track $index) {
                <div class="wl sub"><span>− {{ d.name }} ({{ d.pct }}%)</span><span class="num">− {{ m(d.amount, p.currency) }}</span></div>
              }
              <div class="wl"><span>Net after deductions</span><span class="num">{{ m(p.breakdown.net_after_deductions ?? '0', p.currency) }}</span></div>
              <div class="wl sub"><span>Retained by the programme ({{ 100 - (p.breakdown.farmer_share_pct ?? 0) }}%)</span><span class="num">− {{ m(retained(p), p.currency) }}</span></div>
              <div class="wl tot"><span>Farmer pool ({{ p.breakdown.farmer_share_pct }}%)</span><span class="num">{{ m(p.farmer_pool_amount, p.currency) }}</span></div>
            </div>
          </section>

          <section class="card">
            <div class="card-head"><h3>Entitlements</h3><span class="subtle small">{{ p.entitlements?.length }} farmers · weights {{ weightsText(p) }}</span></div>
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Farmer</th><th>Fields</th><th class="num">Area</th><th class="num">Practices</th><th class="num">Share</th><th class="num">Amount</th></tr></thead>
                <tbody>
                  @for (e of p.entitlements ?? []; track e.id) {
                    <tr>
                      <td>{{ e.farmer_name }}</td>
                      <td class="small mono">{{ (e.inputs.fields ?? []).join(', ') }}</td>
                      <td class="num">{{ e.inputs.area_ha | num: 2 }} ha</td>
                      <td class="num">{{ e.inputs.practices ?? 0 }}</td>
                      <td class="num">{{ ((e.inputs.share ?? 0) * 100) | num: 2 }}%</td>
                      <td class="num"><strong>{{ m(e.amount, p.currency) }}</strong></td>
                    </tr>
                  }
                </tbody>
                <tfoot><tr><td colspan="5"><strong>Total</strong> <span class="subtle small">— {{ p.breakdown.rounding }}</span></td>
                  <td class="num"><strong>{{ m(entSum(p), p.currency) }}</strong></td></tr></tfoot>
              </table>
            </div>
          </section>
          @if (actionError()) { <vc-error title="Not done" [message]="actionError()!" /> }
        </div>
      }
      <ng-container footer>
        @if (detail(); as p) {
          @if (p.status === 'calculated') {
            <span class="subtle small grow">Four-eyes rule: the person who calculated the pool can't approve it.</span>
            @if (canApprove) { <button class="btn btn-primary" [disabled]="busy()" (click)="approve(p)"><vc-icon name="check" [size]="15" />Approve pool</button> }
          } @else if (batchFor(p); as pb) {
            <span class="subtle small grow">Payout batch {{ pb.code }} was prepared from this pool.</span>
            <button class="btn btn-secondary" (click)="detail.set(null); batchCreated.emit(pb)"><vc-icon name="wallet" [size]="15" />Open {{ pb.code }}</button>
          } @else if (p.status === 'approved' && canPrepare) {
            <span class="subtle small grow">Approved. Prepare the payout batch to pay each farmer.</span>
            <button class="btn btn-primary" [disabled]="busy()" (click)="makeBatch(p)"><vc-icon name="wallet" [size]="15" />Create payout batch</button>
          } @else {
            <button class="btn btn-ghost" (click)="detail.set(null)">Close</button>
          }
        }
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;align-items:flex-start;gap:16px;margin-bottom:18px} .bar p{max-width:720px} .spacer{flex:1}
    .strong{font-weight:600}
    .opts{display:flex;flex-direction:column;gap:8px}
    .opt{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--border);border-radius:10px;cursor:pointer}
    .opt.on{border-color:var(--forest-500);background:var(--forest-50)} .opt input{accent-color:var(--primary)}
    .ob{flex:1;display:flex;flex-direction:column}
    .wf-table{border-top:1px solid var(--border);padding:8px 20px 14px}
    .wl{display:flex;justify-content:space-between;padding:6px 0;font-size:13.5px}
    .wl.sub{color:var(--text-2);padding-left:14px;font-size:13px}
    .wl.tot{border-top:1px solid var(--border);margin-top:4px;padding-top:10px;font-weight:600;color:var(--forest-700);font-size:15px}
    tfoot td{padding:12px 14px;border-top:1px solid var(--border);background:var(--surface-2)}
    .grow{flex:1}
  `],
})
export class PoolsTab {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  canPrepare = this.auth.can('payout.prepare');
  canApprove = this.auth.can('payout.approve');
  batchCreated = output<PayoutBatch>();
  openId = input<string | null>(null);

  pools = signal<BenefitPool[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  busy = signal(false);

  createOpen = signal(false);
  sales = signal<Sale[]>([]);
  salesLoading = signal(false);
  pick = signal<string | null>(null);
  createError = signal<string | null>(null);
  eligible = computed(() => {
    const used = new Set(this.pools().map(p => p.sale_id));
    return this.sales().filter(s => (s.status === 'delivered' || s.status === 'retired') && !used.has(s.id));
  });

  detail = signal<BenefitPool | null>(null);
  detailLoading = signal(false);
  actionError = signal<string | null>(null);

  waterfall = computed(() => {
    const p = this.detail();
    if (!p) return {};
    const gross = Number(p.gross_amount);
    const steps: { name: string; value: number; kind: 'total' | 'minus' }[] = [{ name: 'Gross sale', value: gross, kind: 'total' }];
    let run = gross;
    for (const d of p.breakdown.deductions ?? []) { steps.push({ name: d.name, value: Number(d.amount), kind: 'minus' }); run -= Number(d.amount); }
    steps.push({ name: 'Net', value: run, kind: 'total' });
    const retained = run - Number(p.farmer_pool_amount);
    steps.push({ name: 'Programme share', value: retained, kind: 'minus' });
    steps.push({ name: 'Farmer pool', value: Number(p.farmer_pool_amount), kind: 'total' });
    const base: number[] = [];
    let level = gross;
    for (const s of steps) {
      if (s.kind === 'total') { base.push(0); level = s.value; } else { level -= s.value; base.push(level); }
    }
    const fmt = (v: number) => money(v, p.currency).replace(/\.00$/, '');
    return {
      grid: { left: 8, right: 8, top: 24, bottom: 8, containLabel: true },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: (ps: { dataIndex: number }[]) => `${steps[ps[0].dataIndex].name}<br/><b>${steps[ps[0].dataIndex].kind === 'minus' ? '− ' : ''}${fmt(steps[ps[0].dataIndex].value)}</b>` },
      xAxis: { type: 'category', data: steps.map(s => s.name), axisLabel: { interval: 0, fontSize: 11, width: 90, overflow: 'break' } },
      yAxis: { type: 'value', axisLabel: { formatter: (v: number) => (v >= 1e5 ? `${(v / 1e5).toFixed(1)}L` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}k` : `${v}`) } },
      series: [
        { type: 'bar', stack: 'w', data: base, itemStyle: { color: 'transparent' }, emphasis: { disabled: true }, tooltip: { show: false } },
        { type: 'bar', stack: 'w', barMaxWidth: 56,
          data: steps.map((s, i) => ({ value: s.value, itemStyle: {
            color: i === steps.length - 1 ? '#275e3f' : s.kind === 'minus' ? '#c76329' : '#86b797', borderRadius: [4, 4, 0, 0] } })),
          label: { show: true, position: 'top', fontSize: 11, color: '#414b45', formatter: (x: { dataIndex: number }) => (steps[x.dataIndex].kind === 'minus' ? '− ' : '') + fmt(steps[x.dataIndex].value) } },
      ],
    };
  });

  constructor() { this.load(); }
  ngOnInit() { const id = this.openId(); if (id) this.openPool(id); }

  payoutBatches = signal<PayoutBatch[]>([]);
  batchFor(p: BenefitPool) { return this.payoutBatches().find(b => b.pool_id === p.id) ?? null; }

  load() {
    this.loading.set(true);
    this.api.get<PayoutBatch[]>('/payout-batches').subscribe({ next: b => this.payoutBatches.set(b), error: () => {} });
    this.api.get<BenefitPool[]>('/benefit-pools').subscribe({
      next: r => { this.pools.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  m(v: string | number, c: string) { return money(v, c); }
  period(p: BenefitPool) { const x = p.breakdown.period; return x ? `${x[0]} – ${x[1]}` : '—'; }
  retained(p: BenefitPool) { return Number(p.breakdown.net_after_deductions ?? 0) - Number(p.farmer_pool_amount); }
  entSum(p: BenefitPool) { return (p.entitlements ?? []).reduce((a, e) => a + Number(e.amount), 0); }
  weightsText(p: BenefitPool) {
    const w = p.breakdown.weights_used ?? p.breakdown.weights ?? {};
    return Object.entries(w).map(([k, v]) => `${(WEIGHT_LABEL[k] ?? k).toLowerCase()} ${(v * 100).toFixed(0)}%`).join(', ');
  }

  openCreate() {
    this.createOpen.set(true);
    this.pick.set(null);
    this.createError.set(null);
    this.salesLoading.set(true);
    this.api.get<Sale[]>('/sales').subscribe({
      next: s => { this.sales.set(s); this.salesLoading.set(false); },
      error: () => this.salesLoading.set(false),
    });
  }

  create() {
    this.busy.set(true);
    this.createError.set(null);
    this.api.post<BenefitPool>(`/sales/${this.pick()}/benefit-pool`).subscribe({
      next: p => {
        this.busy.set(false);
        this.createOpen.set(false);
        this.toast.success('Benefit pool calculated', `${money(p.farmer_pool_amount, p.currency)} shared between ${p.breakdown.farmers} farmers.`);
        this.load();
        this.detail.set(p);
      },
      error: (e: ApiError) => { this.busy.set(false); this.createError.set(e.message); },
    });
  }

  openPool(id: string) {
    this.actionError.set(null);
    this.detail.set(null);
    this.detailLoading.set(true);
    this.api.get<BenefitPool>(`/benefit-pools/${id}`).subscribe({
      next: p => { this.detail.set(p); this.detailLoading.set(false); },
      error: e => { this.detailLoading.set(false); this.toast.apiError(e, "Couldn't open the pool"); },
    });
  }

  approve(p: BenefitPool) {
    this.busy.set(true);
    this.actionError.set(null);
    this.api.post<BenefitPool>(`/benefit-pools/${p.id}/approve`).subscribe({
      next: np => { this.busy.set(false); this.detail.set(np); this.toast.success('Pool approved'); this.load(); },
      error: (e: ApiError) => { this.busy.set(false); this.actionError.set(e.code === 'SELF_APPROVAL_REJECTED' ? `${e.message} A second finance approver must sign off every pool.` : e.message); },
    });
  }

  makeBatch(p: BenefitPool) {
    this.busy.set(true);
    this.actionError.set(null);
    this.api.post<PayoutBatch>(`/benefit-pools/${p.id}/payout-batch`).subscribe({
      next: b => { this.busy.set(false); this.detail.set(null); this.toast.success(`Payout batch ${b.code} prepared`, 'It needs approval before it can be sent.'); this.batchCreated.emit(b); },
      error: (e: ApiError) => { this.busy.set(false); this.actionError.set(e.message); },
    });
  }
}
