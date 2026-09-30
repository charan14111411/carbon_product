import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { BalanceBar, CREDIT_TYPES, CreditBatch, STATE_META, Steps, TYPE_COLOR, TYPE_ICON, TYPE_HINT, TYPE_LABEL } from './credit-ui';
import { IssueDrawer } from './issue-drawer';

interface SaleLite { id: string; code: string; buyer_name: string | null; status: string }

@Component({
  selector: 'vc-batch-detail',
  imports: [FormsModule, RouterLink, ...KIT, NumPipe, DayPipe, Steps, BalanceBar, IssueDrawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/app/credits" class="back small"><vc-icon name="arrow-left" [size]="14" />All credit batches</a>

    @if (loading()) {
      <div class="card"><vc-loading [rows]="8" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load this batch" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error>
    } @else if (b(); as b) {
      <vc-page-header [title]="b.code" [eyebrow]="'Credit batch · vintage ' + b.vintage" [subtitle]="projectName(b.project_id)">
        @if (canManage && b.status === 'provisional') {
          <button actions class="btn btn-primary" (click)="verifyOpen.set(true)"><vc-icon name="shield-check" />Mark verified</button>
        }
        @if (canManage && b.status === 'verified') {
          <button actions class="btn btn-primary" (click)="issueOpen.set(true)"><vc-icon name="verified" />Record issuance</button>
        }
        @if (canManage && b.status !== 'cancelled' && !committed()) {
          <button actions class="btn btn-secondary" (click)="cancelOpen.set(true)"><vc-icon name="ban" />Cancel batch</button>
        }
      </vc-page-header>

      <section class="card card-pad steps-card">
        <vcx-steps [steps]="['provisional', 'verified', 'issued']" [current]="b.status" />
        <p class="small muted">{{ stepText(b.status) }}</p>
      </section>

      <div class="grid top">
        <section class="card">
          <div class="card-head"><h3>Balances by credit type</h3><vc-dc cls="CALCULATED" /></div>
          <div class="card-body stack">
            @for (t of types; track t) {
              <div class="type">
                <vcx-balance-bar [balances]="b.balances[t]" [label]="typeLabel[t]" [icon]="ticon[t]" />
                <p class="subtle small">{{ typeHint[t] }}</p>
              </div>
            }
          </div>
        </section>

        <section class="card">
          <div class="card-head"><h3>Batch details</h3></div>
          <div class="card-body">
            <dl class="kv">
              <dt>Status</dt><dd><vc-badge [status]="b.status" /></dd>
              <dt>Vintage</dt><dd>{{ b.vintage }}</dd>
              <dt>Reductions</dt><dd class="num">{{ b.reductions_t | num: 3 }} tCO₂e</dd>
              <dt>Removals</dt><dd class="num">{{ b.removals_t | num: 3 }} tCO₂e</dd>
              <dt>Calculation run</dt><dd><a [routerLink]="['/app/calculations', b.run_id]" class="mono small">{{ b.run_id.slice(0, 8) }}</a></dd>
              <dt>Registry</dt><dd>{{ b.registry_name || 'Not issued yet' }}</dd>
              @if (b.registry_project_ref) { <dt>Registry project</dt><dd class="mono small">{{ b.registry_project_ref }}</dd> }
              @if (b.serial_start) { <dt>Serial range</dt><dd class="mono small">{{ b.serial_start }}<br />{{ b.serial_end }}</dd> }
              @if (b.issued_on) { <dt>Issued on</dt><dd>{{ b.issued_on | day }}</dd> }
              <dt>Created</dt><dd>{{ b.created_at | day: true }}</dd>
            </dl>
          </div>
        </section>
      </div>

      <section class="card ledger-card">
        <div class="card-head">
          <h3>Inventory ledger</h3>
          <span class="subtle small">{{ b.moves?.length ?? 0 }} moves</span>
        </div>
        <div class="explain">
          <vc-icon name="scale" [size]="18" />
          <div>
            <strong>Balances are never typed in — they are added up from these moves.</strong>
            <p>Each row moves a quantity from one state to another. A sale can only reserve what is available, and each
              tonne is in exactly one state at a time, so credits can't be lost or sold twice. Moves are append-only.</p>
            <div class="recon">
              @for (t of types; track t) {
                @if (b.issued_total[t] > 0) {
                  <span class="eq" [class.bad]="!balanced(t)">
                    <vc-icon [name]="balanced(t) ? 'check-circle' : 'alert'" [size]="14" />
                    {{ typeLabel[t] }}: {{ b.issued_total[t] | num: 3 }} t created =
                    {{ stateSum(t) | num: 3 }} t across states
                  </span>
                }
              }
            </div>
          </div>
        </div>
        @if (!b.moves?.length) {
          <vc-empty icon="list" title="No moves yet" text="Moves appear when the batch is created, reserved, delivered or retired." />
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>When</th><th>Type</th><th>Movement</th><th class="num">Quantity</th><th>Sale</th><th>Reason</th></tr></thead>
              <tbody>
                @for (m of b.moves; track m.id) {
                  <tr>
                    <td class="nowrap">{{ m.at | day: true }}</td>
                    <td><span class="tchip"><vc-icon class="tic" [name]="ticon[m.credit_type]" [size]="13" />{{ typeLabel[m.credit_type] }}</span></td>
                    <td class="nowrap">
                      <span class="st" [style.--c]="meta(m.from).color">{{ meta(m.from).label }}</span>
                      <vc-icon name="arrow-right" [size]="13" class="subtle" />
                      <span class="st" [style.--c]="meta(m.to).color">{{ meta(m.to).label }}</span>
                    </td>
                    <td class="num"><strong>{{ m.quantity | num: 3 }}</strong> t</td>
                    <td>
                      @if (m.sale_id) {
                        <a [routerLink]="['/app/sales', m.sale_id]" class="mono small">{{ saleCode(m.sale_id) }}</a>
                      } @else { <span class="subtle">—</span> }
                    </td>
                    <td class="muted small reason">{{ m.reason }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>

      <vc-modal [(open)]="verifyOpen" title="Mark batch as verified" [subtitle]="b.code" width="500px">
        <p>Confirm that an independent verifier has reviewed the verification package for this batch and accepted the result.</p>
        <ng-container footer>
          <button class="btn btn-ghost" (click)="verifyOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" [disabled]="busy()" (click)="verify()">Mark verified</button>
        </ng-container>
      </vc-modal>

      <vc-modal [(open)]="cancelOpen" title="Cancel this batch?" [subtitle]="b.code" width="520px">
        <div class="stack">
          <vc-callout tone="warn" icon="alert">All available credits move to <strong>cancelled</strong> and can never be sold. This can't be undone.</vc-callout>
          <div class="field">
            <label>Reason</label>
            <textarea class="input" [(ngModel)]="cancelReason" placeholder="e.g. Calculation superseded after lab re-run"></textarea>
            <span class="hint">Recorded in the ledger and the audit log.</span>
          </div>
        </div>
        <ng-container footer>
          <button class="btn btn-ghost" (click)="cancelOpen.set(false)">Keep batch</button>
          <button class="btn btn-danger" [disabled]="busy() || cancelReason.trim().length < 3" (click)="cancel()">Cancel batch</button>
        </ng-container>
      </vc-modal>

      <vcx-issue-drawer [batch]="issueOpen() ? b : null" (done)="issueOpen.set(false); load()" (closed)="issueOpen.set(false)" />
    }
  `,
  styles: [`
    .tic{color:var(--stone-500);vertical-align:-2px}
    .back{display:inline-flex;align-items:center;gap:6px;margin-bottom:14px;color:var(--text-2)}
    .steps-card{display:flex;align-items:center;gap:24px;flex-wrap:wrap;margin-bottom:16px}
    .steps-card vcx-steps{flex:0 1 420px}
    .top{grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);margin-bottom:16px}
    .type{padding-bottom:14px;border-bottom:1px solid var(--stone-100)} .type:last-child{border:0;padding-bottom:0}
    .type p{margin-top:8px}
    .explain{display:flex;gap:12px;padding:14px 20px;background:var(--forest-50);border-bottom:1px solid var(--border);color:var(--forest-700)}
    .explain strong{color:var(--stone-900);font-weight:600}
    .explain p{margin-top:4px;font-size:13px;color:var(--stone-700);max-width:820px}
    .recon{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
    .eq{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;padding:3px 10px;border-radius:999px;background:var(--surface);border:1px solid var(--forest-200);color:var(--forest-700)}
    .eq.bad{border-color:#f3c7c3;color:var(--red-600)}
    .tchip{display:inline-flex;align-items:center;gap:6px} .tchip i{width:8px;height:8px;border-radius:2px}
    .st{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:500}
    .st::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--c)}
    td vc-icon{margin:0 6px;vertical-align:middle}
    .reason{max-width:360px}
    @media (max-width:1100px){ .top{grid-template-columns:1fr} }
  `],
})
export class BatchDetailPage {
  id = input.required<string>();
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private ctx = inject(ProjectContext);
  canManage = inject(AuthService).can('credits.manage');

  types = CREDIT_TYPES;
  typeLabel = TYPE_LABEL;
  typeHint = TYPE_HINT;
  color = TYPE_COLOR;
  ticon = TYPE_ICON;

  b = signal<CreditBatch | null>(null);
  sales = signal<SaleLite[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  busy = signal(false);
  verifyOpen = signal(false);
  cancelOpen = signal(false);
  issueOpen = signal(false);
  cancelReason = '';

  committed = computed(() => {
    const t = this.b()?.totals;
    return !!t && (t['reserved'] ?? 0) + (t['sold'] ?? 0) + (t['retired'] ?? 0) > 1e-9;
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(!this.b());
    this.error.set(null);
    this.api.get<CreditBatch>(`/credit-batches/${this.id()}`).subscribe({
      next: r => { this.b.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
    this.api.get<SaleLite[]>('/sales', { batch_id: this.id() }).subscribe({ next: s => this.sales.set(s), error: () => {} });
  }

  meta(s: string) { return STATE_META[s] ?? { label: s, color: 'var(--stone-400)', hint: '' }; }
  saleCode(id: string) { return this.sales().find(s => s.id === id)?.code ?? id.slice(0, 8); }
  stateSum(t: string): number {
    const bal = this.b()?.balances[t as 'reduction'];
    return bal ? Object.values(bal as Record<string, number>).reduce((a, v) => a + v, 0) : 0;
  }
  balanced(t: string) { return Math.abs(this.stateSum(t) - (this.b()?.issued_total[t as 'reduction'] ?? 0)) < 1e-6; }

  projectName(id: string) {
    const p = this.ctx.projects().find(x => x.id === id);
    return p ? `${p.code} · ${p.name}` : '';
  }

  stepText(s: string) {
    return ({
      provisional: 'Provisional: created from an approved calculation. Waiting for independent verification before it can be issued.',
      verified: 'Verified: accepted by the verifier. Record the registry issuance to make these credits saleable.',
      issued: 'Issued: listed on the registry with a serial range. Available credits can be reserved for buyers.',
      cancelled: 'Cancelled: withdrawn from the inventory. Nothing in this batch can be sold.',
    } as Record<string, string>)[s] ?? '';
  }

  verify() {
    this.busy.set(true);
    this.api.post<CreditBatch>(`/credit-batches/${this.id()}/verify`).subscribe({
      next: () => { this.busy.set(false); this.verifyOpen.set(false); this.toast.success('Batch marked verified'); this.load(); },
      error: e => { this.busy.set(false); this.toast.apiError(e, "Couldn't verify the batch"); },
    });
  }

  cancel() {
    this.busy.set(true);
    this.api.post<CreditBatch>(`/credit-batches/${this.id()}/cancel`, { reason: this.cancelReason.trim() }).subscribe({
      next: r => { this.busy.set(false); this.cancelOpen.set(false); this.b.set(r); this.toast.success('Batch cancelled'); },
      error: e => { this.busy.set(false); this.toast.apiError(e, "Couldn't cancel the batch"); },
    });
  }
}
