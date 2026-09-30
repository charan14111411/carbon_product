import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { CREDIT_TYPES, CreditBatch, CreditType, TYPE_COLOR, TYPE_ICON, TYPE_LABEL, apiFieldErrors, money } from '../credits/credit-ui';
import { Buyer, Sale } from './sale-actions';

/** Reserve credits for a buyer. Shows the live available balance and handles INVENTORY_INSUFFICIENT. */
@Component({
  selector: 'vcx-new-sale',
  imports: [FormsModule, ...KIT, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [open]="open()" (closed)="closed.emit()" title="New sale" width="640px"
      subtitle="Reserving credits takes them out of the available balance straight away, so two sales can never claim the same tonnes.">
      @if (!issued().length) {
        <vc-empty icon="boxes" title="No issued batches" text="Credits can only be sold after a batch is issued on a registry." />
      } @else if (!buyers().length) {
        <vc-empty icon="building" title="Add a buyer first" text="Create the buyer on the Buyers tab, then come back to reserve credits." />
      } @else {
        <div class="form-grid">
          <div class="field span-2">
            <label>Buyer</label>
            <select class="input" [(ngModel)]="buyerId">
              <option value="" disabled>Choose a buyer…</option>
              @for (b of buyers(); track b.id) { <option [value]="b.id">{{ b.name }}{{ b.country ? ' · ' + b.country : '' }}</option> }
            </select>
          </div>
          <div class="field span-2">
            <label>Credit batch</label>
            <select class="input" [ngModel]="batchId()" (ngModelChange)="batchId.set($event); conflict.set(null)">
              <option value="" disabled>Choose an issued batch…</option>
              @for (b of issued(); track b.id) {
                <option [value]="b.id">{{ b.code }} · vintage {{ b.vintage }} · {{ (b.balances.reduction.available + b.balances.removal.available) | num: 1 }} t available</option>
              }
            </select>
          </div>
          <div class="field span-2">
            <label>Credit type</label>
            <div class="types">
              @for (t of types; track t) {
                <button type="button" class="type" [class.on]="ctype() === t" [disabled]="!batch()" (click)="ctype.set(t); conflict.set(null)">
                  <span class="k"><vc-icon class="tic" [name]="ticon[t]" [size]="13" />{{ typeLabel[t] }}</span>
                  <span class="v num">{{ avail(t) | num: 3 }} <small>t available</small></span>
                </button>
              }
            </div>
          </div>
          <div class="field">
            <label>Quantity (tCO₂e)</label>
            <div class="with-btn">
              <input class="input num" type="number" min="0" step="0.001" [ngModel]="qty()" (ngModelChange)="qty.set($event); conflict.set(null)" [class.invalid]="over()" />
              <button type="button" class="btn btn-ghost btn-sm" [disabled]="!available()" (click)="qty.set(available())">Max</button>
            </div>
            @if (over()) { <span class="error">Only {{ available() | num: 3 }} t available.</span> }
            @else if (fe()['quantity']) { <span class="error">{{ fe()['quantity'] }}</span> }
          </div>
          <div class="field">
            <label>Unit price ({{ currency }} per tonne)</label>
            <input class="input num" type="number" min="0" step="0.01" [ngModel]="price()" (ngModelChange)="price.set($event)" />
            @if (fe()['unit_price']) { <span class="error">{{ fe()['unit_price'] }}</span> }
          </div>

          @if (batch()) {
            <div class="span-2 meter">
              <div class="mh"><span>After this sale</span><strong class="num">{{ remaining() | num: 3 }} t {{ typeLabel[ctype()].toLowerCase() }} left in {{ batch()!.code }}</strong></div>
              <div class="track"><span class="use" [style.width.%]="usePct()" [class.bad]="over()"></span></div>
            </div>
          }

          <div class="field span-2">
            <label>Notes <span class="subtle">(optional)</span></label>
            <textarea class="input" [(ngModel)]="notes" maxlength="2000" placeholder="Delivery schedule, co-benefit claims agreed, etc."></textarea>
          </div>
        </div>

        @if (conflict(); as c) {
          <vc-callout tone="danger" icon="alert" style="margin-top:14px">
            <strong>Not enough credits.</strong> {{ c.message }}
            <div class="row" style="margin-top:8px">
              <button class="btn btn-secondary btn-sm" (click)="useAvailable(c.available)">Reserve {{ c.available | num: 3 }} t instead</button>
            </div>
          </vc-callout>
        } @else if (error()) {
          <vc-error title="Couldn't create the sale" [message]="error()!" style="margin-top:14px" />
        }
      }
      <ng-container footer>
        <div class="value">
          <span class="subtle small">Sale value</span>
          <strong class="num">{{ value() }}</strong>
        </div>
        <span class="spacer"></span>
        <button class="btn btn-ghost" (click)="closed.emit()">Cancel</button>
        <button class="btn btn-primary" [disabled]="!valid() || busy()" (click)="submit()">Reserve credits</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .tic{color:var(--stone-500);vertical-align:-2px}
    .types{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .type{display:flex;flex-direction:column;align-items:flex-start;gap:4px;padding:12px 14px;border:1px solid var(--border-strong);border-radius:10px;background:var(--surface);cursor:pointer;font:inherit;text-align:left}
    .type:hover:not([disabled]){border-color:var(--forest-300)}
    .type.on{border-color:var(--forest-500);background:var(--forest-50);box-shadow:inset 0 0 0 1px var(--forest-500)}
    .type[disabled]{opacity:.55;cursor:not-allowed}
    .type .k{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:var(--stone-800)}
    .type i{width:8px;height:8px;border-radius:2px}
    .type .v{font-size:18px;font-weight:600} .type small{font-size:12px;color:var(--text-3);font-weight:400}
    .with-btn{display:flex;gap:6px;align-items:center}
    .meter{padding:12px 14px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border)}
    .mh{display:flex;justify-content:space-between;gap:8px;font-size:12.5px;color:var(--text-2);margin-bottom:8px;flex-wrap:wrap}
    .mh strong{color:var(--stone-800);font-weight:600}
    .track{height:8px;border-radius:4px;background:var(--forest-100);overflow:hidden}
    .use{display:block;height:100%;background:var(--sky-600);border-radius:4px;transition:width .2s}
    .use.bad{background:var(--red-600)}
    .value{display:flex;flex-direction:column;line-height:1.2} .value strong{font-size:16px}
    .spacer{flex:1}
  `],
})
export class NewSale {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  open = input<boolean>(false);
  buyers = input<Buyer[]>([]);
  batches = input<CreditBatch[]>([]);
  presetBuyer = input<string>('');
  created = output<Sale>();
  closed = output<void>();
  inventoryChanged = output<void>();

  types = CREDIT_TYPES;
  typeLabel = TYPE_LABEL;
  color = TYPE_COLOR;
  ticon = TYPE_ICON;
  currency = 'INR';

  buyerId = '';
  batchId = signal('');
  ctype = signal<CreditType>('removal');
  qty = signal<number | null>(null);
  price = signal<number | null>(null);
  notes = '';
  busy = signal(false);
  error = signal<string | null>(null);
  conflict = signal<{ message: string; available: number } | null>(null);
  fe = signal<Record<string, string>>({});

  issued = computed(() => this.batches().filter(b => b.status === 'issued'));
  batch = computed(() => this.issued().find(b => b.id === this.batchId()) ?? null);
  available = computed(() => this.avail(this.ctype()));
  over = computed(() => (this.qty() ?? 0) > this.available() + 1e-9);
  remaining = computed(() => Math.max(0, this.available() - (Number(this.qty()) || 0)));
  usePct = computed(() => (this.available() > 0 ? Math.min(100, ((Number(this.qty()) || 0) / this.available()) * 100) : 0));
  value = computed(() => {
    const q = Number(this.qty()) || 0, p = Number(this.price()) || 0;
    return q && p ? money(Math.round(q * p * 100) / 100, this.currency) : '—';
  });
  valid = computed(() => !!this.batch() && (Number(this.qty()) || 0) > 0 && !this.over() && (Number(this.price()) || 0) > 0);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.buyerId = this.presetBuyer() || '';
        this.error.set(null); this.conflict.set(null); this.fe.set({});
        this.qty.set(null); this.notes = '';
        const first = this.issued().find(b => b.balances.removal.available + b.balances.reduction.available > 0);
        if (!this.batchId() && first) {
          this.batchId.set(first.id);
          this.ctype.set(first.balances.removal.available > 0 ? 'removal' : 'reduction');
        }
      }
    });
  }

  avail(t: CreditType): number { return this.batch()?.balances[t]?.available ?? 0; }

  useAvailable(v: number) {
    this.qty.set(v);
    this.conflict.set(null);
  }

  submit() {
    if (!this.buyerId) { this.error.set('Choose a buyer.'); return; }
    this.busy.set(true);
    this.error.set(null); this.conflict.set(null); this.fe.set({});
    this.api.post<Sale>('/sales', {
      buyer_id: this.buyerId, batch_id: this.batchId(), credit_type: this.ctype(), quantity: Number(this.qty()),
      unit_price: Number(this.price()).toFixed(2), currency: this.currency, notes: this.notes.trim(),
    }).subscribe({
      next: s => { this.busy.set(false); this.toast.success(`Sale ${s.code} reserved`, `${s.quantity} t for ${s.buyer_name}.`); this.created.emit(s); },
      error: (e: ApiError) => {
        this.busy.set(false);
        if (e.code === 'INVENTORY_INSUFFICIENT') {
          this.conflict.set({ message: e.message, available: Number(e.details?.['available'] ?? 0) });
          this.inventoryChanged.emit(); // someone else sold in the meantime — refresh balances
        } else {
          this.fe.set(apiFieldErrors(e));
          this.error.set(e.message);
        }
      },
    });
  }
}
