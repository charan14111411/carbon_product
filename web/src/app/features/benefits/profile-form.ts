import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { KIT } from '../../ui/kit';
import { apiMessage } from '../credits/credit-ui';
import { PaymentProfile } from './benefit-types';

export const UPI_RE = /^[A-Za-z0-9._-]{2,256}@[A-Za-z][A-Za-z0-9]{1,63}$/;
export const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;

/** UPI or bank details for one farmer. Full account numbers are sent once and never shown again. */
@Component({
  selector: 'vcx-profile-form',
  imports: [FormsModule, ...KIT],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stack" [class.big]="large()">
      <div class="field">
        <label>How should the money be paid?</label>
        <div class="methods">
          <button type="button" [class.on]="method() === 'upi'" (click)="method.set('upi')"><vc-icon name="zap" [size]="16" /><span><strong>UPI</strong><small>Instant, to a UPI ID</small></span></button>
          <button type="button" [class.on]="method() === 'bank'" (click)="method.set('bank')"><vc-icon name="landmark" [size]="16" /><span><strong>Bank account</strong><small>NEFT/IMPS transfer</small></span></button>
        </div>
      </div>
      <div class="field">
        <label>Account holder name</label>
        <input class="input" [ngModel]="name()" (ngModelChange)="name.set($event)" maxlength="200" autocomplete="name" />
        <span class="hint">As it appears with the bank.</span>
      </div>
      @if (method() === 'upi') {
        <div class="field">
          <label>UPI ID</label>
          <input class="input mono" [ngModel]="upi()" (ngModelChange)="upi.set($event.trim())" placeholder="name@okbank" autocomplete="off" inputmode="email" [class.invalid]="!!upiErr()" />
          @if (upiErr()) { <span class="error">{{ upiErr() }}</span> } @else { <span class="hint">Looks like <span class="mono">ramesh@oksbi</span>.</span> }
        </div>
      } @else {
        <div class="field">
          <label>Account number</label>
          <input class="input mono" [ngModel]="acct()" (ngModelChange)="acct.set($event)" inputmode="numeric" autocomplete="off"
            [placeholder]="current()?.account_masked ? 'Re-enter to change (' + current()!.account_masked + ')' : '9 to 18 digits'" [class.invalid]="!!acctErr()" />
          @if (acctErr()) { <span class="error">{{ acctErr() }}</span> } @else { <span class="hint">Only the last 4 digits are kept on screen after saving.</span> }
        </div>
        <div class="field">
          <label>IFSC code</label>
          <input class="input mono" [ngModel]="ifsc()" (ngModelChange)="ifsc.set($event.toUpperCase().trim())" maxlength="11" placeholder="SBIN0001234" autocomplete="off" [class.invalid]="!!ifscErr()" />
          @if (ifscErr()) { <span class="error">{{ ifscErr() }}</span> } @else { <span class="hint">11 characters, printed on the cheque book or passbook.</span> }
        </div>
      }
      @if (current()?.verified) { <vc-callout tone="warn" icon="info">Saving changes removes the verified status until the new details are checked again.</vc-callout> }
      @if (error()) { <vc-error title="Couldn't save payment details" [message]="error()!" /> }
      <div class="row acts">
        <span class="spacer"></span>
        <button type="button" class="btn btn-ghost" [class.btn-lg]="large()" (click)="cancelled.emit()">Cancel</button>
        <button type="button" class="btn btn-primary" [class.btn-lg]="large()" [disabled]="!valid() || busy()" (click)="save()">Save details</button>
      </div>
    </div>
  `,
  styles: [`
    .methods{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .methods button{display:flex;align-items:center;gap:10px;padding:12px 14px;border:1px solid var(--border-strong);border-radius:10px;background:var(--surface);font:inherit;text-align:left;cursor:pointer;color:var(--stone-700)}
    .methods button.on{border-color:var(--forest-500);background:var(--forest-50);color:var(--forest-700);box-shadow:inset 0 0 0 1px var(--forest-500)}
    .methods span{display:flex;flex-direction:column} .methods small{font-size:12px;color:var(--text-3)}
    .big .input{height:46px;font-size:16px}
    .big label{font-size:14px}
  `],
})
export class ProfileForm {
  private api = inject(ApiService);
  farmerId = input.required<string>();
  current = input<PaymentProfile | null>(null);
  large = input<boolean>(false);
  saved = output<PaymentProfile>();
  cancelled = output<void>();

  method = signal<'upi' | 'bank'>('upi');
  name = signal('');
  upi = signal('');
  acct = signal('');
  ifsc = signal('');
  busy = signal(false);
  error = signal<string | null>(null);

  upiErr = computed(() => (this.upi() && !UPI_RE.test(this.upi()) ? 'Enter a UPI ID like name@bank.' : ''));
  acctDigits = computed(() => this.acct().replace(/\s/g, ''));
  acctErr = computed(() => (this.acct() && !/^\d{9,18}$/.test(this.acctDigits()) ? 'The account number must be 9 to 18 digits.' : ''));
  ifscErr = computed(() => (this.ifsc() && !IFSC_RE.test(this.ifsc()) ? 'Enter a valid IFSC code, e.g. SBIN0001234 (5th character is zero).' : ''));
  valid = computed(() => this.name().trim().length >= 2 && (this.method() === 'upi'
    ? UPI_RE.test(this.upi())
    : /^\d{9,18}$/.test(this.acctDigits()) && IFSC_RE.test(this.ifsc())));

  constructor() {
    effect(() => {
      const p = this.current();
      this.method.set(p?.method ?? 'upi');
      this.name.set(p?.account_name ?? '');
      this.upi.set(p?.upi_id ?? '');
      this.ifsc.set(p?.ifsc ?? '');
      this.acct.set('');
    });
  }

  save() {
    const body = this.method() === 'upi'
      ? { method: 'upi', upi_id: this.upi(), account_name: this.name().trim() }
      : { method: 'bank', account_number: this.acctDigits(), ifsc: this.ifsc(), account_name: this.name().trim() };
    this.busy.set(true);
    this.error.set(null);
    this.api.put<PaymentProfile>(`/farmers/${this.farmerId()}/payment-profile`, body).subscribe({
      next: p => { this.busy.set(false); this.acct.set(''); this.saved.emit(p); },
      error: (e: ApiError) => { this.busy.set(false); this.error.set(apiMessage(e)); },
    });
  }
}
