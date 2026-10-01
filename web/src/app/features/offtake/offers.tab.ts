import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { Steps, TYPE_LABEL, apiMessage, money } from '../credits/credit-ui';
import { isoToday } from '../households/lookups';
import { ConfirmDialog } from '../programmes/confirm';
import { MarketLookups, OFFER_STEPS, Offer } from './offtake-types';

@Component({
  selector: 'vcx-offers-tab',
  imports: [...KIT, FormsModule, DayPipe, NumPipe, Steps, ConfirmDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <div class="seg">
        @for (s of filters; track s.key) { <button type="button" [class.on]="status() === s.key" (click)="status.set(s.key)">{{ s.label }}<span class="c num">{{ count(s.key) }}</span></button> }
      </div>
      <span class="spacer"></span>
      @if (canManage) {
        <button class="btn btn-ghost btn-sm" [disabled]="busy()" (click)="expire()" title="Mark sent offers whose validity has passed as expired"><vc-icon name="hourglass" [size]="14" />Expire overdue offers</button>
        <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New offer</button>
      }
    </div>

    <section class="card">
      @if (loading() && !all().length) { <vc-loading [rows]="5" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load offers" [message]="error()!" /></div> }
      @else if (!rows().length) {
        <vc-empty icon="receipt" [title]="all().length ? 'No offers with this status' : 'No offers yet'"
          [text]="all().length ? 'Try another status.' : 'An offer is a priced proposal to a buyer for credits from one batch. It does not reserve credits — a sale does.'">
          @if (!all().length && canManage) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New offer</button> }
        </vc-empty>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Offer</th><th>Buyer</th><th>Credits</th><th class="num">Quantity</th><th class="num">Unit price</th><th class="num">Value</th><th>Valid until</th><th>Status</th></tr></thead>
            <tbody>
              @for (o of rows(); track o.id) {
                <tr class="clickable" (click)="openDetail(o)">
                  <td class="mono strong">{{ o.code }}</td>
                  <td>{{ o.buyer_name }}</td>
                  <td><span class="mono small">{{ o.batch_code }}</span> <span class="subtle small">· {{ o.vintage }} · {{ tl(o.credit_type) }}</span></td>
                  <td class="num">{{ o.quantity | num: 2 }} <span class="u">t</span></td>
                  <td class="num">{{ m(o.unit_price, o.currency) }}</td>
                  <td class="num"><strong>{{ m(o.value, o.currency) }}</strong></td>
                  <td class="nowrap" [class.late]="o.status === 'sent' && daysLeft(o) <= 7">{{ o.valid_until | day }}@if (o.status === 'sent') { <span class="small subtle"> · {{ left(o) }}</span> }</td>
                  <td><vc-badge [status]="o.status" /></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <!-- detail -->
    <vc-modal [open]="!!sel()" (closed)="sel.set(null)" [drawer]="true" width="520px" [title]="'Offer ' + (sel()?.code ?? '')" [subtitle]="sel()?.buyer_name ?? ''">
      @if (sel(); as o) {
        <div class="stack">
          @if (['rejected', 'expired', 'withdrawn'].includes(o.status)) { <div class="row"><vc-badge [status]="o.status" />@if (o.response_note) { <span class="muted small">{{ o.response_note }}</span> }</div> }
          @else { <vcx-steps [steps]="steps" [current]="o.status" [offPath]="[]" /> }
          <div class="val"><span class="subtle small">Offer value</span><strong class="num">{{ m(o.value, o.currency) }}</strong>
            <span class="small muted">{{ o.quantity | num: 2 }} t × {{ m(o.unit_price, o.currency) }}</span></div>
          <dl class="kv">
            <dt>Seller</dt><dd>{{ o.seller_name }}</dd>
            <dt>Buyer</dt><dd>{{ o.buyer_name }}</dd>
            <dt>Credits</dt><dd>{{ tl(o.credit_type) }} from <span class="mono">{{ o.batch_code }}</span> (vintage {{ o.vintage }})</dd>
            <dt>Valid until</dt><dd>{{ o.valid_until | day }}</dd>
            <dt>Sent</dt><dd>{{ o.sent_at ? (o.sent_at | day: true) : 'Not yet' }}</dd>
            @if (o.responded_at) { <dt>Answered</dt><dd>{{ o.responded_at | day: true }}@if (o.response_note) { — {{ o.response_note }} }</dd> }
          </dl>
          @if (o.terms) { <div class="terms"><strong class="small">Terms</strong><p>{{ o.terms }}</p></div> }
          @if (o.status === 'sent') { <vc-callout tone="info" icon="info">Waiting for the buyer. They can accept in their buyer portal, or you can record their written answer here. Availability is checked again on acceptance.</vc-callout> }
          @if (o.status === 'accepted') { <vc-callout tone="ok" icon="check-circle">Accepted. Turn it into an offtake agreement to set the delivery schedule, then record the sale when credits are delivered.</vc-callout> }
          @if (actionError()) { <vc-error title="Not done" [message]="actionError()!" /> }
        </div>
      }
      <ng-container footer>
        @if (sel(); as o) {
          @if (canManage && (o.status === 'draft' || o.status === 'sent')) { <button class="btn btn-ghost dangerlink" (click)="withdrawOpen.set(true)">Withdraw</button> }
          <span class="spacer"></span>
          @if (canManage && o.status === 'draft') { <button class="btn btn-primary" [disabled]="busy()" (click)="act(o, 'send')"><vc-icon name="send" />Send to buyer</button> }
          @if (canRespond && o.status === 'sent') {
            <button class="btn btn-secondary" [disabled]="busy()" (click)="respond.set({ o, accept: false })">Record rejection</button>
            <button class="btn btn-primary" [disabled]="busy()" (click)="respond.set({ o, accept: true })"><vc-icon name="check" />Record acceptance</button>
          }
          @if (canManage && o.status === 'accepted') { <button class="btn btn-primary" (click)="makeAgreement.emit(o); sel.set(null)"><vc-icon name="handshake" />Create agreement</button> }
        }
      </ng-container>
    </vc-modal>

    <vc-confirm [open]="!!respond()" (openChange)="!$event && respond.set(null)" [title]="respond()?.accept ? 'Record acceptance?' : 'Record rejection?'"
      [confirmLabel]="respond()?.accept ? 'Record acceptance' : 'Record rejection'" [tone]="respond()?.accept ? 'primary' : 'danger'" reason="optional" reasonLabel="Buyer's note or reference"
      [message]="respond()?.accept ? 'Only record this with the buyer’s written confirmation (email or signed offer). Credit availability is checked now.' : 'The offer is closed. You can make a new offer later.'"
      [busy]="busy()" (confirmed)="doRespond($event)" />
    <vc-confirm [(open)]="withdrawOpen" title="Withdraw this offer?" tone="danger" confirmLabel="Withdraw offer" reason="optional" reasonLabel="Reason"
      message="The buyer can no longer accept it. This can't be undone." [busy]="busy()" (confirmed)="withdraw($event)" />

    <!-- create -->
    <vc-modal [(open)]="createOpen" [drawer]="true" width="540px" title="New offer" subtitle="Starts as a draft; send it when it's ready.">
      <div class="form-grid">
        <div class="field span-2"><label for="ob">Buyer</label>
          <select id="ob" class="input" [(ngModel)]="f.buyer_id"><option value="">Choose a buyer…</option>@for (b of lk.buyers(); track b.id) { <option [value]="b.id">{{ b.name }} · {{ b.country }}</option> }</select></div>
        <div class="field span-2"><label for="oba">Credit batch</label>
          <select id="oba" class="input" [ngModel]="f.batch_id" (ngModelChange)="f.batch_id = $event; batchId.set($event)">
            <option value="">Choose a batch…</option>@for (b of lk.batches(); track b.id) { <option [value]="b.id">{{ b.code }} · vintage {{ b.vintage }} · {{ b.status }}</option> }</select></div>
        <div class="field span-2"><label>Credit type</label>
          <div class="types">
            @for (t of ['reduction', 'removal']; track t) {
              <button type="button" [class.on]="f.credit_type === t" (click)="f.credit_type = $any(t); ctype.set(t)"><strong>{{ tl(t) }}</strong>
                <span class="small num">{{ avail(t) | num: 2 }} t available</span></button>
            }
          </div></div>
        <div class="field"><label for="oq">Quantity (tCO₂e)</label><input id="oq" type="number" min="0" step="0.01" class="input num" [(ngModel)]="f.quantity" />
          @if (f.quantity && f.quantity > avail(f.credit_type)) { <span class="error">More than the {{ avail(f.credit_type) | num: 2 }} t available.</span> }</div>
        <div class="field"><label for="op">Unit price</label><div class="unit"><input id="op" type="number" min="0" step="0.01" class="input num" [(ngModel)]="f.unit_price" /><select class="input cur" [(ngModel)]="f.currency" aria-label="Currency"><option>INR</option><option>USD</option><option>EUR</option></select></div></div>
        <div class="field"><label for="ov">Valid until</label><input id="ov" type="date" class="input" [min]="today" [(ngModel)]="f.valid_until" /></div>
        <div class="field"><label for="os">Seller (legal name)</label><input id="os" class="input" [(ngModel)]="f.seller_name" placeholder="Your organisation" /></div>
        <div class="field span-2"><label for="ot">Terms</label><textarea id="ot" class="input" rows="4" [(ngModel)]="f.terms" placeholder="Payment within 30 days of delivery; retirement on the buyer's behalf on request…"></textarea></div>
        @if (f.quantity && f.unit_price) { <div class="span-2 tot"><span>Offer value</span><strong class="num">{{ m(f.quantity * f.unit_price, f.currency) }}</strong></div> }
        @if (formError()) { <div class="span-2"><vc-error title="Offer not created" [message]="formError()!" /></div> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !f.buyer_id || !f.batch_id || !f.quantity || !f.unit_price || !f.valid_until" (click)="create()">Create draft offer</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap}
    .seg{display:inline-flex;flex-wrap:wrap;background:var(--surface);border:1px solid var(--border-strong);border-radius:8px;padding:3px;gap:2px}
    .seg button{border:0;background:none;font:500 13px var(--font);padding:6px 12px;border-radius:6px;color:var(--stone-600);cursor:pointer;display:inline-flex;gap:6px;align-items:center}
    .seg button.on{background:var(--forest-50);color:var(--forest-700);box-shadow:inset 0 0 0 1px var(--forest-200)}
    .seg .c{font-size:11px;color:var(--text-3)}
    .strong{font-weight:600} .u{font-size:11px;color:var(--text-3)} .late{color:var(--amber-600)}
    .val{display:flex;flex-direction:column;padding:14px 16px;border-radius:10px;background:var(--forest-50);border:1px solid var(--forest-100)}
    .val strong{font-size:26px;font-weight:600;color:var(--forest-800);letter-spacing:-.01em}
    .terms{padding:12px;border-radius:8px;background:var(--surface-2);border:1px solid var(--border)} .terms p{margin-top:4px;white-space:pre-wrap;font-size:13.5px}
    .dangerlink{color:var(--red-600)}
    .types{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .types button{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:10px 12px;border:1px solid var(--border-strong);border-radius:8px;background:var(--surface);font:inherit;cursor:pointer;text-align:left}
    .types button.on{border-color:var(--forest-500);background:var(--forest-50);box-shadow:inset 0 0 0 1px var(--forest-500)}
    .types span{color:var(--text-2)}
    .unit{display:flex;gap:6px} .cur{width:90px;flex:none}
    .tot{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-radius:8px;background:var(--sand-100)} .tot strong{font-size:18px}
  `],
})
export class OffersTab {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  lk = inject(MarketLookups);
  canManage = this.auth.can('sales.manage');
  canRespond = this.auth.can('sales.manage');
  makeAgreement = output<Offer>();
  steps = OFFER_STEPS;
  today = isoToday();
  filters = [
    { key: '', label: 'All' }, { key: 'draft', label: 'Draft' }, { key: 'sent', label: 'Sent' }, { key: 'accepted', label: 'Accepted' },
    { key: 'rejected', label: 'Rejected' }, { key: 'expired', label: 'Expired' }, { key: 'withdrawn', label: 'Withdrawn' },
  ];

  all = signal<Offer[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  status = signal('');
  busy = signal(false);
  sel = signal<Offer | null>(null);
  actionError = signal<string | null>(null);
  respond = signal<{ o: Offer; accept: boolean } | null>(null);
  withdrawOpen = signal(false);
  rows = computed(() => this.all().filter(o => !this.status() || o.status === this.status()));

  createOpen = signal(false);
  formError = signal<string | null>(null);
  batchId = signal('');
  ctype = signal('reduction');
  f = this.blank();

  constructor() { this.lk.load(); this.load(); }

  load() {
    this.loading.set(true);
    this.api.get<Offer[]>('/offers').subscribe({
      next: r => { this.all.set(r); this.loading.set(false); this.error.set(null); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
  count(k: string) { return this.all().filter(o => !k || o.status === k).length; }
  m(v: string | number, c = 'INR') { return money(v, c); }
  tl(t: string) { return TYPE_LABEL[t] ?? t; }
  daysLeft(o: Offer) { return Math.ceil((new Date(o.valid_until + 'T23:59:59').getTime() - Date.now()) / 86400000); }
  left(o: Offer) { const d = this.daysLeft(o); return d < 0 ? 'past validity' : d === 0 ? 'last day' : `${d} day${d === 1 ? '' : 's'} left`; }
  avail(t: string) { const b = this.lk.batches().find(x => x.id === this.batchId()); return b ? b.balances[t as 'reduction' | 'removal']?.['available'] ?? 0 : 0; }

  openDetail(o: Offer) { this.actionError.set(null); this.sel.set(o); }
  private update(o: Offer, msg: string) {
    this.busy.set(false);
    this.all.update(xs => xs.map(x => (x.id === o.id ? o : x)));
    if (this.sel()?.id === o.id) this.sel.set(o);
    this.toast.success(msg);
  }
  private fail = (e: ApiError) => { this.busy.set(false); this.actionError.set(apiMessage(e)); };

  act(o: Offer, verb: 'send') {
    this.busy.set(true);
    this.actionError.set(null);
    this.api.post<Offer>(`/offers/${o.id}/${verb}`).subscribe({ next: r => this.update(r, `${r.code} sent to ${r.buyer_name}`), error: this.fail });
  }
  doRespond(note: string) {
    const r = this.respond();
    if (!r) return;
    this.busy.set(true);
    this.api.post<Offer>(`/offers/${r.o.id}/${r.accept ? 'accept' : 'reject'}`, { note }).subscribe({
      next: x => { this.respond.set(null); this.update(x, r.accept ? `${x.code} accepted` : `${x.code} rejected`); },
      error: (e: ApiError) => { this.respond.set(null); this.fail(e); },
    });
  }
  withdraw(note: string) {
    const o = this.sel();
    if (!o) return;
    this.busy.set(true);
    this.api.post<Offer>(`/offers/${o.id}/withdraw`, { note }).subscribe({
      next: x => { this.withdrawOpen.set(false); this.update(x, `${x.code} withdrawn`); },
      error: (e: ApiError) => { this.withdrawOpen.set(false); this.fail(e); },
    });
  }
  expire() {
    this.busy.set(true);
    this.api.post<{ expired: number; codes: string[] }>('/offers/expire-due').subscribe({
      next: r => { this.busy.set(false); r.expired ? this.toast.success(`${r.expired} offer${r.expired === 1 ? '' : 's'} expired`, r.codes.join(', ')) : this.toast.info('No overdue offers'); this.load(); },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e); },
    });
  }

  private blank() {
    const d = new Date(Date.now() + 30 * 86400000);
    return { buyer_id: '', batch_id: '', credit_type: 'reduction' as 'reduction' | 'removal', quantity: null as number | null, unit_price: null as number | null,
      currency: 'INR', valid_until: d.toISOString().slice(0, 10), seller_name: '', terms: '' };
  }
  openCreate() { this.f = this.blank(); this.batchId.set(''); this.formError.set(null); this.createOpen.set(true); }
  create() {
    this.busy.set(true);
    this.formError.set(null);
    this.api.post<Offer>('/offers', { ...this.f, quantity: Number(this.f.quantity), unit_price: Number(this.f.unit_price).toFixed(2), seller_name: this.f.seller_name.trim() || null }).subscribe({
      next: o => { this.busy.set(false); this.createOpen.set(false); this.all.update(xs => [o, ...xs]); this.toast.success(`Offer ${o.code} created`, 'Review it, then send it to the buyer.'); this.openDetail(o); },
      error: (e: ApiError) => { this.busy.set(false); this.formError.set(apiMessage(e)); },
    });
  }
}
