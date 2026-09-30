import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { apiFieldErrors } from '../credits/credit-ui';
import { Buyer, KIND_LABEL } from './sale-actions';

interface BuyerUser { id: string; full_name: string; email: string; role: string }

/** Create / edit a buyer, including their purchasing requirements. */
@Component({
  selector: 'vcx-buyer-form',
  imports: [FormsModule, ...KIT],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [open]="open()" (closed)="closed.emit()" [drawer]="true" width="520px"
      [title]="buyer() ? 'Edit buyer' : 'New buyer'" [subtitle]="buyer()?.name ?? 'An organisation that buys credits from this programme.'">
      <div class="stack">
        <div class="field"><label>Organisation name</label>
          <input class="input" [(ngModel)]="f.name" maxlength="200" placeholder="e.g. Tata Consumer Products" [class.invalid]="!!fe()['name']" />
          @if (fe()['name']) { <span class="error">{{ fe()['name'] }}</span> }</div>
        <div class="form-grid">
          <div class="field"><label>Type</label>
            <select class="input" [(ngModel)]="f.kind">
              @for (k of kinds; track k) { <option [value]="k">{{ kindLabel[k] }}</option> }
            </select></div>
          <div class="field"><label>Country</label><input class="input" [(ngModel)]="f.country" maxlength="80" placeholder="India" /></div>
          <div class="field"><label>Contact person</label><input class="input" [(ngModel)]="f.contact_name" maxlength="200" /></div>
          <div class="field"><label>Contact email</label>
            <input class="input" type="email" [(ngModel)]="f.contact_email" [class.invalid]="!!fe()['contact_email']" />
            @if (fe()['contact_email']) { <span class="error">{{ fe()['contact_email'] }}</span> }</div>
        </div>

        <h3 class="sec">Purchasing requirements</h3>
        <div class="field"><label>Credit types accepted</label>
          <div class="row">
            <label class="checkbox"><input type="checkbox" [(ngModel)]="f.removal" />Removals</label>
            <label class="checkbox"><input type="checkbox" [(ngModel)]="f.reduction" />Reductions</label>
          </div></div>
        <div class="form-grid">
          <div class="field"><label>Earliest vintage</label><input class="input num" type="number" min="2000" max="2100" [(ngModel)]="f.min_vintage" placeholder="e.g. 2024" /></div>
          <div class="field"><label>Registry preference</label>
            <select class="input" [(ngModel)]="f.registry">
              <option value="">Any registry</option><option>Verra</option><option>Gold Standard</option>
            </select></div>
          <div class="field span-2"><label>Other requirements</label>
            <textarea class="input" [(ngModel)]="f.notes" placeholder="e.g. Needs Scope 3 insetting report; smallholder co-benefits; delivery by March"></textarea></div>
        </div>

        <div class="field"><label>Buyer portal access</label>
          <select class="input" [(ngModel)]="f.user_id">
            <option value="">No portal login linked</option>
            @for (u of users(); track u.id) { <option [value]="u.id">{{ u.full_name }} · {{ u.email }}</option> }
          </select>
          <span class="hint">Link a user with the Buyer role so they can see this buyer's portfolio and retirement records.</span>
          @if (fe()['user_id']) { <span class="error">{{ fe()['user_id'] }}</span> }
        </div>
        @if (error()) { <vc-error title="Couldn't save the buyer" [message]="error()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="closed.emit()">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || f.name.trim().length < 2" (click)="save()">{{ buyer() ? 'Save changes' : 'Create buyer' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: ['.sec{margin-top:6px;padding-top:14px;border-top:1px solid var(--border);font-size:14px}'],
})
export class BuyerForm {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  open = input<boolean>(false);
  buyer = input<Buyer | null>(null);
  saved = output<Buyer>();
  closed = output<void>();

  kinds = ['corporate', 'trader', 'ngo', 'government'];
  kindLabel = KIND_LABEL;
  users = signal<BuyerUser[]>([]);
  busy = signal(false);
  error = signal<string | null>(null);
  fe = signal<Record<string, string>>({});
  f = this.blank();

  constructor() {
    this.api.get<BuyerUser[]>('/users').subscribe({ next: u => this.users.set(u.filter(x => x.role === 'buyer')), error: () => {} });
    effect(() => {
      if (!this.open()) return;
      const b = this.buyer();
      this.error.set(null); this.fe.set({});
      if (!b) { this.f = this.blank(); return; }
      const r = b.requirements ?? {};
      const types = (r['credit_types'] as string[] | undefined) ?? ['removal', 'reduction'];
      this.f = {
        name: b.name, kind: b.kind, country: b.country ?? '', contact_name: b.contact_name ?? '', contact_email: b.contact_email ?? '',
        removal: types.includes('removal'), reduction: types.includes('reduction'),
        min_vintage: (r['min_vintage'] as number | undefined) ?? null, registry: (r['registry'] as string | undefined) ?? '',
        notes: (r['notes'] as string | undefined) ?? '', user_id: b.user_id ?? '',
      };
    });
  }

  private blank() {
    return { name: '', kind: 'corporate' as Buyer['kind'], country: 'India', contact_name: '', contact_email: '', removal: true, reduction: true,
      min_vintage: null as number | null, registry: '', notes: '', user_id: '' };
  }

  save() {
    const f = this.f;
    const requirements: Record<string, unknown> = {
      ...(this.buyer()?.requirements ?? {}),
      credit_types: [f.removal && 'removal', f.reduction && 'reduction'].filter(Boolean),
      min_vintage: f.min_vintage ? Number(f.min_vintage) : null, registry: f.registry || null, notes: f.notes.trim(),
    };
    const body = {
      name: f.name.trim(), kind: f.kind, country: f.country.trim(), contact_name: f.contact_name.trim() || null,
      contact_email: f.contact_email.trim() || null, requirements, user_id: f.user_id || null,
    };
    this.busy.set(true);
    this.error.set(null);
    const b = this.buyer();
    const req = b ? this.api.patch<Buyer>(`/buyers/${b.id}`, body) : this.api.post<Buyer>('/buyers', body);
    req.subscribe({
      next: r => { this.busy.set(false); this.toast.success(b ? 'Buyer updated' : 'Buyer created', r.name); this.saved.emit(r); },
      error: (e: ApiError) => { this.busy.set(false); this.fe.set(apiFieldErrors(e)); this.error.set(e.message); },
    });
  }
}
