import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { KIT } from '../../ui/kit';
import { CreditBatch, Steps, TYPE_COLOR, TYPE_ICON, TYPE_LABEL, money } from '../credits/credit-ui';
import { BuyerForm } from './buyer-form';
import { NewSale } from './new-sale';
import { Buyer, KIND_LABEL, SALE_STEPS, Sale, SaleActions } from './sale-actions';

@Component({
  selector: 'vc-sales-page',
  imports: [FormsModule, RouterLink, ...KIT, NumPipe, DayPipe, Steps, SaleActions, NewSale, BuyerForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Sales" eyebrow="Credits & sales"
      subtitle="Reserve issued credits for buyers, record contracts, deliver and retire. Each step moves tonnes in the inventory ledger.">
      <button actions class="btn btn-secondary" (click)="load()"><vc-icon name="refresh" />Refresh</button>
      @if (canSell && tab() === 'buyers') {
        <button actions class="btn btn-primary" (click)="editBuyer.set(null); buyerOpen.set(true)"><vc-icon name="plus" />New buyer</button>
      }
      @if (canSell && tab() !== 'buyers') {
        <button actions class="btn btn-primary" (click)="saleOpen.set(true)"><vc-icon name="plus" />New sale</button>
      }
    </vc-page-header>

    <div class="grid grid-4 stats">
      <vc-stat label="Contracted value" [value]="valueOf(['contracted', 'delivered', 'retired'])" icon="banknote" [accent]="true" hint="Contracted, delivered and retired sales" />
      <vc-stat label="Reserved" [value]="qtyOf(['reserved']) | num: 1" unit="tCO₂e" icon="clock" [hint]="countOf(['reserved']) + ' awaiting contract'" />
      <vc-stat label="Delivered" [value]="qtyOf(['delivered', 'retired']) | num: 1" unit="tCO₂e" icon="send" hint="Transferred to buyers" />
      <vc-stat label="Retired" [value]="qtyOf(['retired']) | num: 1" unit="tCO₂e" icon="archive" hint="Claimed permanently" />
    </div>

    <vc-tabs [tabs]="[{ key: 'sales', label: 'Sales', count: sales().length }, { key: 'buyers', label: 'Buyers', count: buyers().length }]"
      [active]="tab()" (activeChange)="tab.set($any($event))" />

    @if (tab() === 'sales') {
      <div class="filters">
        <div class="search"><vc-icon name="search" [size]="15" />
          <input class="input" placeholder="Search sale, buyer or batch…" [ngModel]="q()" (ngModelChange)="q.set($event)" /></div>
        <select class="input" [ngModel]="statusF()" (ngModelChange)="statusF.set($event)">
          <option value="">All statuses</option>
          @for (s of statuses; track s) { <option [value]="s">{{ s.charAt(0).toUpperCase() + s.slice(1) }}</option> }
        </select>
      </div>
      <section class="card">
        @if (loading()) { <vc-loading [rows]="6" /> }
        @else if (error()) { <div class="card-body"><vc-error title="Couldn't load sales" [message]="error()!" /></div> }
        @else if (!filtered().length) {
          <vc-empty icon="handshake" [title]="sales().length ? 'No matching sales' : 'No sales yet'"
            [text]="sales().length ? 'Try a different search or status.' : 'Reserve issued credits for a buyer to start a sale.'">
            @if (canSell && !sales().length) { <button class="btn btn-primary" (click)="saleOpen.set(true)"><vc-icon name="plus" />New sale</button> }
          </vc-empty>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr>
                <th>Sale</th><th>Buyer</th><th>Batch</th><th>Type</th><th class="num">Quantity</th><th class="num">Unit price</th>
                <th class="num">Value</th><th>Progress</th><th></th>
              </tr></thead>
              <tbody>
                @for (s of filtered(); track s.id) {
                  <tr class="clickable" (click)="go(s)">
                    <td class="nowrap"><a class="mono strong" [routerLink]="[s.id]" (click)="$event.stopPropagation()">{{ s.code }}</a>
                      <div class="subtle small">{{ s.created_at | day }}</div></td>
                    <td class="buyer">{{ s.buyer_name }}</td>
                    <td class="nowrap"><span class="mono small">{{ s.batch_code }}</span><div class="subtle small">Vintage {{ s.vintage }}</div></td>
                    <td><span class="tchip"><vc-icon class="tic" [name]="ticon[s.credit_type]" [size]="13" />{{ typeLabel[s.credit_type] }}</span></td>
                    <td class="num">{{ s.quantity | num: 3 }} t</td>
                    <td class="num">{{ fmt(s.unit_price, s.currency) }}</td>
                    <td class="num"><strong>{{ fmt(s.total_amount, s.currency) }}</strong></td>
                    <td><vcx-steps [steps]="steps" [current]="s.status" [compact]="true" /></td>
                    <td class="acts" (click)="$event.stopPropagation()"><vcx-sale-actions [sale]="s" [small]="true" (changed)="replace($event)" /></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    } @else {
      <section class="card">
        @if (loading()) { <vc-loading [rows]="5" /> }
        @else if (!buyers().length) {
          <vc-empty icon="building" title="No buyers yet" text="Add the companies and traders who buy credits from this programme.">
            @if (canSell) { <button class="btn btn-primary" (click)="editBuyer.set(null); buyerOpen.set(true)"><vc-icon name="plus" />New buyer</button> }
          </vc-empty>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Buyer</th><th>Type</th><th>Country</th><th>Contact</th><th>Requirements</th><th class="num">Purchased</th><th>Portal</th><th></th></tr></thead>
              <tbody>
                @for (b of buyers(); track b.id) {
                  <tr>
                    <td><strong>{{ b.name }}</strong></td>
                    <td>{{ kindLabel[b.kind] }}</td>
                    <td>{{ b.country || '—' }}</td>
                    <td>{{ b.contact_name || '—' }}@if (b.contact_email) { <div class="subtle small">{{ b.contact_email }}</div> }</td>
                    <td class="req small">{{ reqText(b) }}</td>
                    <td class="num">{{ bought(b.id) | num: 1 }} t</td>
                    <td>@if (b.user_id) { <vc-badge status="active">Linked</vc-badge> } @else { <span class="subtle small">Not linked</span> }</td>
                    <td class="acts">
                      @if (canSell) {
                        <button class="btn btn-ghost btn-sm" (click)="editBuyer.set(b); buyerOpen.set(true)"><vc-icon name="pencil" [size]="14" />Edit</button>
                        <button class="btn btn-secondary btn-sm" (click)="presetBuyer.set(b.id); saleOpen.set(true)">Sell</button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    }

    <vcx-new-sale [open]="saleOpen()" [buyers]="buyers()" [batches]="batches()" [presetBuyer]="presetBuyer()"
      (closed)="saleOpen.set(false); presetBuyer.set('')" (created)="onCreated($event)" (inventoryChanged)="loadBatches()" />
    <vcx-buyer-form [open]="buyerOpen()" [buyer]="editBuyer()" (closed)="buyerOpen.set(false)" (saved)="onBuyerSaved($event)" />
  `,
  styles: [`
    .tic{color:var(--stone-500);vertical-align:-2px}
    .stats{margin-bottom:24px}
    .filters{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap}
    .search{position:relative;flex:1;min-width:240px;max-width:420px}
    .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)}
    .search .input{padding-left:34px}
    .filters select{width:200px}
    .strong{font-weight:600;color:var(--stone-900)}
    .tchip{display:inline-flex;align-items:center;gap:6px;white-space:nowrap} .tchip i{width:8px;height:8px;border-radius:2px}
    .acts{text-align:right;white-space:nowrap}
    .req{max-width:280px;color:var(--text-2)}
    .buyer{min-width:120px;max-width:180px}
    .table td.acts{padding-left:6px;padding-right:10px}
  `],
})
export class SalesPage {
  private api = inject(ApiService);
  private router = inject(Router);
  canSell = inject(AuthService).can('sales.manage');

  steps = SALE_STEPS;
  statuses = [...SALE_STEPS, 'cancelled'];
  typeLabel = TYPE_LABEL;
  color = TYPE_COLOR;
  ticon = TYPE_ICON;
  kindLabel = KIND_LABEL;

  tab = signal<'sales' | 'buyers'>('sales');
  sales = signal<Sale[]>([]);
  buyers = signal<Buyer[]>([]);
  batches = signal<CreditBatch[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  q = signal('');
  statusF = signal('');
  saleOpen = signal(false);
  buyerOpen = signal(false);
  editBuyer = signal<Buyer | null>(null);
  presetBuyer = signal('');

  filtered = computed(() => {
    const q = this.q().trim().toLowerCase();
    return this.sales().filter(s => (!this.statusF() || s.status === this.statusF()) &&
      (!q || [s.code, s.buyer_name, s.batch_code].some(x => (x ?? '').toLowerCase().includes(q))));
  });

  constructor() { this.load(); }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Sale[]>('/sales').subscribe({
      next: r => { this.sales.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
    this.api.get<Buyer[]>('/buyers').subscribe({ next: r => this.buyers.set(r), error: () => {} });
    this.loadBatches();
  }

  loadBatches() {
    this.api.get<CreditBatch[]>('/credit-batches', { status: 'issued' }).subscribe({ next: r => this.batches.set(r), error: () => {} });
  }

  live(st: string[]) { return this.sales().filter(s => st.includes(s.status)); }
  qtyOf(st: string[]) { return this.live(st).reduce((a, s) => a + s.quantity, 0); }
  countOf(st: string[]) { return this.live(st).length; }
  valueOf(st: string[]) {
    const list = this.live(st);
    const cur = list[0]?.currency ?? 'INR';
    return money(list.filter(s => s.currency === cur).reduce((a, s) => a + Number(s.total_amount), 0), cur);
  }
  bought(buyerId: string) { return this.sales().filter(s => s.buyer_id === buyerId && s.status !== 'cancelled').reduce((a, s) => a + s.quantity, 0); }
  fmt(v: string, c: string) { return money(v, c); }

  reqText(b: Buyer) {
    const r = b.requirements ?? {};
    const parts: string[] = [];
    const t = r['credit_types'] as string[] | undefined;
    if (t?.length === 1) parts.push(`${TYPE_LABEL[t[0]]} only`);
    if (r['min_vintage']) parts.push(`Vintage ${r['min_vintage']}+`);
    if (r['registry']) parts.push(String(r['registry']));
    if (r['notes']) parts.push(String(r['notes']));
    for (const [k, v] of Object.entries(r)) {
      if (!['credit_types', 'min_vintage', 'registry', 'notes'].includes(k) && v !== null && v !== '' && typeof v !== 'object') parts.push(`${k.replace(/_/g, ' ')}: ${v}`);
    }
    return parts.join(' · ') || '—';
  }

  go(s: Sale) { this.router.navigate(['/app/sales', s.id]); }

  replace(s: Sale) {
    this.sales.update(list => list.map(x => (x.id === s.id ? s : x)));
    this.loadBatches();
  }

  onCreated(s: Sale) {
    this.saleOpen.set(false);
    this.presetBuyer.set('');
    this.tab.set('sales');
    this.sales.update(list => [s, ...list]);
    this.loadBatches();
  }

  onBuyerSaved(b: Buyer) {
    this.buyerOpen.set(false);
    this.buyers.update(list => (list.some(x => x.id === b.id) ? list.map(x => (x.id === b.id ? b : x)) : [...list, b].sort((a, c) => a.name.localeCompare(c.name))));
  }
}
