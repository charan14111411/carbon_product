import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, map, of } from 'rxjs';
import { ApiError, ApiService, Page } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { PaymentProfile } from './benefit-types';
import { ProfileForm } from './profile-form';

interface FarmerLite { id: string; code: string; full_name: string; village: string; district: string; status: string }
interface Row { farmer: FarmerLite; profile: PaymentProfile | null }

@Component({
  selector: 'vcx-profiles-tab',
  imports: [FormsModule, ...KIT, DayPipe, ProfileForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted">Where each farmer is paid. Details must be verified with the payment provider before money can be sent; unverified farmers are put on hold, not skipped.</p>
    </div>
    <div class="filters">
      <div class="search"><vc-icon name="search" [size]="15" />
        <input class="input" placeholder="Search farmer or village…" [ngModel]="q()" (ngModelChange)="q.set($event)" /></div>
      <div class="seg">
        @for (o of opts; track o.k) { <button type="button" [class.on]="f() === o.k" (click)="f.set(o.k)">{{ o.label }} <span class="c">{{ count(o.k) }}</span></button> }
      </div>
    </div>
    <section class="card">
      @if (loading()) { <vc-loading [rows]="6" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load farmers" [message]="error()!" /></div> }
      @else if (!filtered().length) {
        <vc-empty icon="wallet" [title]="rows().length ? 'No farmers match' : 'No farmers yet'" [text]="rows().length ? 'Try another filter.' : 'Farmers appear here once they are registered.'" />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Farmer</th><th>Method</th><th>Account</th><th>Name on account</th><th>Status</th><th></th></tr></thead>
            <tbody>
              @for (r of filtered(); track r.farmer.id) {
                <tr>
                  <td><strong>{{ r.farmer.full_name }}</strong><div class="subtle small">{{ r.farmer.code }} · {{ r.farmer.village || r.farmer.district }}</div></td>
                  @if (r.profile; as p) {
                    <td><span class="meth"><vc-icon [name]="p.method === 'upi' ? 'zap' : 'landmark'" [size]="14" />{{ p.method === 'upi' ? 'UPI' : 'Bank' }}</span></td>
                    <td class="mono small">{{ p.method === 'upi' ? p.upi_id : p.account_masked + ' · ' + p.ifsc }}</td>
                    <td>{{ p.account_name }}</td>
                    <td>@if (p.verified) { <vc-badge status="verified">Verified {{ p.verified_on | day }}</vc-badge> } @else { <vc-badge status="pending">Not verified</vc-badge> }</td>
                  } @else {
                    <td colspan="3" class="subtle">No payment details yet</td>
                    <td><vc-badge status="on_hold">Missing</vc-badge></td>
                  }
                  <td class="acts">
                    @if (canPrepare) {
                      @if (r.profile && !r.profile.verified) {
                        <button class="btn btn-secondary btn-sm" [disabled]="busyId() === r.farmer.id" (click)="verify(r)"><vc-icon name="shield-check" [size]="14" />Verify</button>
                      }
                      <button class="btn btn-ghost btn-sm" (click)="editing.set(r)"><vc-icon [name]="r.profile ? 'pencil' : 'plus'" [size]="14" />{{ r.profile ? 'Edit' : 'Add' }}</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <vc-modal [open]="!!editing()" (closed)="editing.set(null)" [drawer]="true" width="480px" title="Payment details" [subtitle]="editing()?.farmer?.full_name ?? ''">
      @if (editing(); as r) {
        <vcx-profile-form [farmerId]="r.farmer.id" [current]="r.profile" (saved)="onSaved(r, $event)" (cancelled)="editing.set(null)" />
      }
    </vc-modal>
  `,
  styles: [`
    .bar{margin-bottom:14px} .bar p{max-width:760px}
    .filters{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap}
    .search{position:relative;flex:1;min-width:240px;max-width:380px}
    .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)} .search .input{padding-left:34px}
    .seg{display:inline-flex;border:1px solid var(--border-strong);border-radius:8px;background:var(--surface);padding:3px;gap:2px}
    .seg button{height:30px;padding:0 12px;border:0;border-radius:6px;background:none;font:inherit;font-size:13px;font-weight:500;color:var(--text-2);cursor:pointer}
    .seg button.on{background:var(--forest-50);color:var(--forest-700);box-shadow:inset 0 0 0 1px var(--forest-200)}
    .seg .c{margin-left:4px;font-size:11px;color:var(--text-3)}
    .meth{display:inline-flex;align-items:center;gap:6px}
    .acts{text-align:right;white-space:nowrap}
  `],
})
export class ProfilesTab {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  canPrepare = inject(AuthService).can('payout.prepare');

  opts = [{ k: 'all', label: 'All' }, { k: 'unverified', label: 'Needs verification' }, { k: 'missing', label: 'Missing' }, { k: 'verified', label: 'Verified' }];
  rows = signal<Row[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  q = signal('');
  f = signal('all');
  busyId = signal<string | null>(null);
  editing = signal<Row | null>(null);

  filtered = computed(() => {
    const q = this.q().trim().toLowerCase();
    return this.rows().filter(r => this.match(r, this.f()) &&
      (!q || [r.farmer.full_name, r.farmer.village, r.farmer.code].some(x => (x ?? '').toLowerCase().includes(q))));
  });

  constructor() { this.load(); }

  match(r: Row, k: string) {
    return k === 'all' || (k === 'missing' && !r.profile) || (k === 'verified' && !!r.profile?.verified) || (k === 'unverified' && !!r.profile && !r.profile.verified);
  }
  count(k: string) { return this.rows().filter(r => this.match(r, k)).length; }

  load() {
    this.loading.set(true);
    this.api.get<Page<FarmerLite>>('/farmers', { limit: 200 }).subscribe({
      next: page => {
        if (!page.items.length) { this.rows.set([]); this.loading.set(false); return; }
        forkJoin(page.items.map(fm => this.api.get<PaymentProfile>(`/farmers/${fm.id}/payment-profile`).pipe(
          map(p => ({ farmer: fm, profile: p })), catchError(() => of({ farmer: fm, profile: null })),
        ))).subscribe(rows => { this.rows.set(rows); this.loading.set(false); });
      },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  verify(r: Row) {
    this.busyId.set(r.farmer.id);
    this.api.post<PaymentProfile>(`/farmers/${r.farmer.id}/payment-profile/verify`).subscribe({
      next: p => { this.busyId.set(null); this.patch(r.farmer.id, p); this.toast.success('Payment details verified', r.farmer.full_name); },
      error: (e: ApiError) => { this.busyId.set(null); this.toast.error("Couldn't verify", e.message); },
    });
  }

  onSaved(r: Row, p: PaymentProfile) {
    this.editing.set(null);
    this.patch(r.farmer.id, p);
    this.toast.success('Payment details saved', 'Verify them before the next payout.');
  }

  private patch(fid: string, p: PaymentProfile) {
    this.rows.update(rs => rs.map(x => (x.farmer.id === fid ? { ...x, profile: p } : x)));
  }
}
