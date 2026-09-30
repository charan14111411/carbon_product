import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { TYPE_LABEL, apiMessage, money } from '../credits/credit-ui';

export interface Buyer {
  id: string;
  name: string;
  kind: 'corporate' | 'trader' | 'ngo' | 'government';
  country: string;
  contact_name: string | null;
  contact_email: string | null;
  requirements: Record<string, unknown>;
  user_id: string | null;
  created_at: string;
}

export interface Sale {
  id: string;
  code: string;
  buyer_id: string;
  buyer_name: string | null;
  batch_id: string;
  batch_code: string | null;
  vintage: number | null;
  credit_type: 'reduction' | 'removal';
  quantity: number;
  unit_price: string;
  total_amount: string;
  currency: string;
  status: string;
  contract_ref: string | null;
  retirement_beneficiary: string | null;
  trade_date: string | null;
  notes: string;
  created_at: string;
}

export const SALE_STEPS = ['reserved', 'contracted', 'delivered', 'retired'];
export const KIND_LABEL: Record<string, string> = { corporate: 'Corporate', trader: 'Trader', ngo: 'NGO', government: 'Government' };

type Act = 'contract' | 'deliver' | 'retire' | 'cancel' | null;

/** The next-step buttons for a sale, with their confirmation dialogs. */
@Component({
  selector: 'vcx-sale-actions',
  imports: [FormsModule, ...KIT, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (canSell) {
      @switch (sale().status) {
        @case ('reserved') { <button class="btn btn-primary" [class.btn-sm]="small()" (click)="open('contract')"><vc-icon name="file-check" [size]="14" />{{ small() ? 'Contract' : 'Record contract' }}</button> }
        @case ('contracted') { <button class="btn btn-primary" [class.btn-sm]="small()" (click)="open('deliver')"><vc-icon name="send" [size]="14" />Deliver</button> }
        @case ('delivered') { <button class="btn btn-primary" [class.btn-sm]="small()" (click)="open('retire')"><vc-icon name="archive" [size]="14" />Retire</button> }
      }
      @if (sale().status === 'reserved' || sale().status === 'contracted') {
        <button class="btn btn-ghost" [class.btn-sm]="small()" (click)="open('cancel')" title="Cancel sale"><vc-icon name="ban" [size]="14" />@if (!small()) { Cancel sale }</button>
      }
    }

    <vc-modal [open]="act() === 'contract'" (closed)="act.set(null)" title="Record the contract" [subtitle]="sale().code + ' · ' + sale().buyer_name" width="500px">
      <div class="stack">
        <div class="field"><label>Contract reference</label>
          <input class="input mono" [(ngModel)]="contractRef" placeholder="e.g. ERPA-2026-014" maxlength="120" />
          <span class="hint">The buyer's purchase order or emission-reduction purchase agreement number.</span></div>
        <div class="field"><label>Trade date</label><input class="input" type="date" [(ngModel)]="tradeDate" [max]="today" /></div>
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="act.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || contractRef.trim().length < 2" (click)="run('contract', { contract_ref: contractRef.trim(), trade_date: tradeDate || null })">Record contract</button>
      </ng-container>
    </vc-modal>

    <vc-modal [open]="act() === 'deliver'" (closed)="act.set(null)" title="Deliver credits to the buyer?" [subtitle]="sale().code" width="500px">
      <p>{{ sale().quantity | num: 3 }} t of {{ typeLabel[sale().credit_type].toLowerCase() }} from <span class="mono">{{ sale().batch_code }}</span>
        move from <strong>reserved</strong> to <strong>sold</strong> for {{ sale().buyer_name }}.</p>
      <p class="muted small" style="margin-top:10px">Once delivered, the sale can no longer be cancelled, and the farmer benefit pool can be prepared.</p>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="act.set(null)">Not yet</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="run('deliver', {})">Confirm delivery</button>
      </ng-container>
    </vc-modal>

    <vc-modal [open]="act() === 'retire'" (closed)="act.set(null)" title="Retire these credits" [subtitle]="sale().code" width="520px">
      <div class="stack">
        <vc-callout tone="warn" icon="lock">Retirement is permanent. The {{ sale().quantity | num: 3 }} t are claimed on behalf of the beneficiary and can never be sold or transferred again.</vc-callout>
        <div class="field"><label>Retired on behalf of</label>
          <input class="input" [(ngModel)]="beneficiary" [placeholder]="sale().buyer_name ?? 'Beneficiary'" maxlength="200" />
          <span class="hint">Usually the buyer's legal entity. Shown on the retirement record.</span></div>
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="act.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || beneficiary.trim().length < 2" (click)="run('retire', { beneficiary: beneficiary.trim() })">Retire permanently</button>
      </ng-container>
    </vc-modal>

    <vc-modal [open]="act() === 'cancel'" (closed)="act.set(null)" title="Cancel this sale?" [subtitle]="sale().code + ' · ' + sale().buyer_name" width="500px">
      <div class="stack">
        <p>The {{ sale().quantity | num: 3 }} t reserved for this sale go back to <strong>available</strong> in {{ sale().batch_code }}. The sale is kept for the record.</p>
        <div class="field"><label>Reason</label><textarea class="input" [(ngModel)]="reason" placeholder="e.g. Buyer withdrew before contract"></textarea></div>
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="act.set(null)">Keep sale</button>
        <button class="btn btn-danger" [disabled]="busy() || reason.trim().length < 3" (click)="run('cancel', { reason: reason.trim() })">Cancel sale</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [':host{display:inline-flex;gap:6px;align-items:center;justify-content:flex-end}'],
})
export class SaleActions {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  canSell = inject(AuthService).can('sales.manage');
  sale = input.required<Sale>();
  small = input<boolean>(false);
  changed = output<Sale>();

  typeLabel = TYPE_LABEL;
  today = new Date().toISOString().slice(0, 10);
  act = signal<Act>(null);
  busy = signal(false);
  contractRef = '';
  tradeDate = this.today;
  beneficiary = '';
  reason = '';

  open(a: Act) {
    this.contractRef = this.sale().contract_ref ?? '';
    this.tradeDate = this.today;
    this.beneficiary = this.sale().buyer_name ?? '';
    this.reason = '';
    this.act.set(a);
  }

  run(a: Exclude<Act, null>, body: unknown) {
    this.busy.set(true);
    this.api.post<Sale>(`/sales/${this.sale().id}/${a}`, body).subscribe({
      next: s => {
        this.busy.set(false);
        this.act.set(null);
        const msg = { contract: 'Contract recorded', deliver: 'Credits delivered', retire: 'Credits retired', cancel: 'Sale cancelled' }[a];
        this.toast.success(`${s.code}: ${msg}`, a === 'deliver' ? `${money(s.total_amount, s.currency)} ready for benefit sharing.` : undefined);
        this.changed.emit(s);
      },
      error: e => { this.busy.set(false); this.toast.error("That didn't work", apiMessage(e)); },
    });
  }
}
