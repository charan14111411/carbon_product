import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { DayPipe, NumPipe } from '../../core/format';
import { KIT } from '../../ui/kit';
import { Steps, TYPE_COLOR, TYPE_ICON, TYPE_LABEL, money } from '../credits/credit-ui';
import { SALE_STEPS, Sale, SaleActions } from './sale-actions';
import { SaleReport, SaleReportCard } from './sale-report';

@Component({
  selector: 'vc-sale-detail',
  imports: [RouterLink, ...KIT, NumPipe, DayPipe, Steps, SaleActions, SaleReportCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/app/sales" class="back small no-print"><vc-icon name="arrow-left" [size]="14" />All sales</a>
    @if (loading()) {
      <div class="card"><vc-loading [rows]="8" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load this sale" [message]="error()!" />
    } @else if (s(); as s) {
      <vc-page-header [title]="s.code" [eyebrow]="'Sale · ' + s.buyer_name" [subtitle]="subtitle(s)">
        <button actions class="btn btn-secondary no-print" (click)="print()"><vc-icon name="download" />Print summary</button>
        <vcx-sale-actions actions class="no-print" [sale]="s" (changed)="s$.set($event); loadReport()" />
      </vc-page-header>

      <section class="card card-pad progress no-print">
        <vcx-steps [steps]="steps" [current]="s.status" />
        <p class="small muted">{{ stepText(s.status) }}</p>
      </section>

      <div class="grid grid-4 facts">
        <vc-stat label="Quantity" [value]="s.quantity | num: 3" unit="tCO₂e" [hint]="typeLabel[s.credit_type] + ' · vintage ' + s.vintage" />
        <vc-stat label="Unit price" [value]="m(s.unit_price, s.currency)" hint="per tonne" />
        <vc-stat label="Sale value" [value]="m(s.total_amount, s.currency)" [accent]="true" hint="Quantity × unit price" />
        <vc-stat label="From batch" [value]="s.batch_code" [hint]="'Created ' + (s.created_at | day)" />
      </div>

      <div class="grid side">
        <div class="stack">
          <h3 class="h">Supply-chain report <span class="subtle small">— what the buyer sees</span></h3>
          @if (reportError()) {
            <vc-error title="Couldn't build the report" [message]="reportError()!" />
          } @else if (report(); as r) {
            <vcx-sale-report [report]="r" />
          } @else { <div class="card"><vc-loading [rows]="5" /></div> }
        </div>
        <section class="card no-print">
          <div class="card-head"><h3>Sale record</h3></div>
          <div class="card-body">
            <dl class="kv">
              <dt>Buyer</dt><dd>{{ s.buyer_name }}</dd>
              <dt>Batch</dt><dd><a [routerLink]="['/app/credits', s.batch_id]" class="mono small">{{ s.batch_code }}</a></dd>
              <dt>Credit type</dt><dd><span class="tchip"><vc-icon class="tic" [name]="ticon[s.credit_type]" [size]="13" />{{ typeLabel[s.credit_type] }}</span></dd>
              <dt>Status</dt><dd><vc-badge [status]="s.status" /></dd>
              <dt>Contract</dt><dd class="mono small">{{ s.contract_ref || '—' }}</dd>
              <dt>Trade date</dt><dd>{{ s.trade_date | day }}</dd>
              <dt>Retired for</dt><dd>{{ s.retirement_beneficiary || '—' }}</dd>
              <dt>Notes</dt><dd class="muted">{{ s.notes || '—' }}</dd>
            </dl>
            @if (s.status === 'delivered' || s.status === 'retired') {
              <vc-callout tone="ok" icon="hand-coins" style="margin-top:16px">
                Delivered revenue can now be shared with farmers. Finance prepares the benefit pool under
                <a routerLink="/app/benefits">Benefits</a>.
              </vc-callout>
            }
          </div>
        </section>
      </div>
    }
  `,
  styles: [`
    .tic{color:var(--stone-500);vertical-align:-2px}
    .back{display:inline-flex;align-items:center;gap:6px;margin-bottom:14px;color:var(--text-2)}
    .progress{display:flex;align-items:center;gap:24px;flex-wrap:wrap;margin-bottom:16px}
    .progress vcx-steps{flex:0 1 520px}
    .facts{margin-bottom:24px}
    .side{grid-template-columns:minmax(0,1fr) 340px;align-items:start}
    .h{font-size:15px}
    .tchip{display:inline-flex;align-items:center;gap:6px} .tchip i{width:8px;height:8px;border-radius:2px}
    @media (max-width:1180px){ .side{grid-template-columns:1fr} }
    @media print{ .facts{display:none} .side{grid-template-columns:1fr} }
  `],
})
export class SaleDetailPage {
  id = input.required<string>();
  private api = inject(ApiService);
  steps = SALE_STEPS;
  typeLabel = TYPE_LABEL;
  color = TYPE_COLOR;
  ticon = TYPE_ICON;

  s$ = signal<Sale | null>(null);
  s = this.s$.asReadonly();
  report = signal<SaleReport | null>(null);
  reportError = signal<string | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.api.get<Sale>(`/sales/${this.id()}`).subscribe({
      next: r => { this.s$.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
    this.loadReport();
  }

  loadReport() {
    this.reportError.set(null);
    this.api.get<SaleReport>(`/sales/${this.id()}/report`).subscribe({
      next: r => this.report.set(r),
      error: (e: ApiError) => this.reportError.set(e.message),
    });
  }

  m(v: string, c: string) { return money(v, c); }
  subtitle(s: Sale) { return `${s.quantity} t of ${TYPE_LABEL[s.credit_type].toLowerCase()} from ${s.batch_code} (vintage ${s.vintage}).`; }
  print() { window.print(); }

  stepText(st: string) {
    return ({
      reserved: 'Reserved: the tonnes are held for this buyer and can no longer be sold to anyone else. Record the contract next.',
      contracted: 'Contracted: the deal is signed. Deliver when the registry transfer to the buyer is complete.',
      delivered: 'Delivered: the credits belong to the buyer. Retire them when the buyer makes their claim.',
      retired: 'Retired: permanently claimed on behalf of the beneficiary. Nothing more to do.',
      cancelled: 'Cancelled: the reserved tonnes went back to the available balance.',
    } as Record<string, string>)[st] ?? '';
  }
}
