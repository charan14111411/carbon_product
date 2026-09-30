import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { BalanceBar, CREDIT_TYPES, CreditBatch, Steps, TYPE_COLOR, TYPE_ICON, TYPE_LABEL } from './credit-ui';
import { IssueDrawer } from './issue-drawer';

interface RunRow {
  id: string;
  period_label: string | null;
  period_start: string;
  period_end: string;
  net_t_co2e: number | null;
  reductions_t_co2e: number;
  removals_t_co2e: number;
  status: string | null;
  engine_version: string;
  created_at: string;
}

@Component({
  selector: 'vc-credits-page',
  imports: [FormsModule, RouterLink, ...KIT, NumPipe, DayPipe, Steps, BalanceBar, IssueDrawer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Credit inventory" eyebrow="Credits & sales"
      subtitle="Credit batches created from approved calculations. Every tonne moves through a ledger — available, reserved, sold, retired — so nothing can be lost or sold twice.">
      <button actions class="btn btn-secondary" (click)="load()"><vc-icon name="refresh" />Refresh</button>
      @if (canManage) {
        <button actions class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />Create batch</button>
      }
    </vc-page-header>

    <div class="grid grid-4 stats">
      <vc-stat label="Credits in inventory" [value]="sum('all') | num: 0" unit="tCO₂e" icon="boxes" [accent]="true"
        [hint]="batches().length + ' batch' + (batches().length === 1 ? '' : 'es')" />
      <vc-stat label="Available to sell" [value]="sum('available') | num: 0" unit="tCO₂e" icon="package" hint="Issued and not yet reserved" />
      <vc-stat label="Reserved or sold" [value]="(sum('reserved') + sum('sold')) | num: 0" unit="tCO₂e" icon="handshake" hint="Committed to buyers" />
      <vc-stat label="Retired" [value]="sum('retired') | num: 0" unit="tCO₂e" icon="archive" hint="Claimed by buyers, permanently" />
    </div>

    <div class="filters">
      <select class="input" [ngModel]="projectF()" (ngModelChange)="projectF.set($event)" aria-label="Project">
        <option value="">All projects</option>
        @for (p of ctx.projects(); track p.id) { <option [value]="p.id">{{ p.code }} · {{ p.name }}</option> }
      </select>
      <div class="seg">
        @for (s of statusOpts; track s.key) {
          <button type="button" [class.on]="statusF() === s.key" (click)="statusF.set(s.key)">{{ s.label }}
            <span class="c">{{ count(s.key) }}</span></button>
        }
      </div>
    </div>

    @if (loading()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load credit batches" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error>
    } @else if (!rows().length) {
      <div class="card">
        <vc-empty icon="boxes" [title]="batches().length ? 'No batches match these filters' : 'No credit batches yet'"
          [text]="batches().length ? 'Try another status or project.' : 'Once a calculation run is approved, create a credit batch from it. The batch starts as provisional until it is verified and issued by a registry.'">
          @if (canManage && !batches().length) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />Create batch</button> }
        </vc-empty>
      </div>
    } @else {
      <div class="cards">
        @for (b of rows(); track b.id) {
          <article class="card batch">
            <header class="bh">
              <div class="bt">
                <a class="code mono" [routerLink]="[b.id]">{{ b.code }}</a>
                <span class="vint">Vintage {{ b.vintage }}</span>
              </div>
              <vc-badge [status]="b.status" />
            </header>
            <div class="proj muted small"><vc-icon name="briefcase" [size]="13" />{{ projectName(b.project_id) }}</div>
            <vcx-steps [steps]="['provisional', 'verified', 'issued']" [current]="b.status" />

            <div class="split">
              @for (t of types; track t) {
                <div class="tq">
                  <span class="k"><vc-icon class="tic" [name]="ticon[t]" [size]="13" />{{ typeLabel[t] }}</span>
                  <span class="v num">{{ (t === 'reduction' ? b.reductions_t : b.removals_t) | num: 2 }} <span class="u">t</span></span>
                </div>
              }
            </div>

            <div class="bars">
              @for (t of types; track t) {
                @if ((t === 'reduction' ? b.reductions_t : b.removals_t) > 0) {
                  <vcx-balance-bar [balances]="b.balances[t]" [label]="typeLabel[t]" [icon]="ticon[t]" [showLegend]="false" />
                }
              }
              <div class="legend small">
                @for (k of legendKeys; track k.key) { <span><i [style.background]="k.color"></i>{{ k.label }} <b class="num">{{ b.totals[k.key] | num: 0 }}</b></span> }
              </div>
            </div>

            @if (b.status === 'issued') {
              <div class="reg small"><vc-icon name="landmark" [size]="13" /><span>{{ b.registry_name }} · {{ b.registry_project_ref }}</span>
                <span class="subtle mono">{{ b.serial_start }} → {{ b.serial_end }}</span></div>
            }

            <footer class="bf">
              <a class="btn btn-ghost btn-sm" [routerLink]="[b.id]"><vc-icon name="list" [size]="14" />Ledger</a>
              <span class="spacer"></span>
              @if (canManage && b.status === 'provisional') {
                <button class="btn btn-secondary btn-sm" (click)="verifyTarget.set(b)"><vc-icon name="shield-check" [size]="14" />Mark verified</button>
              }
              @if (canManage && b.status === 'verified') {
                <button class="btn btn-primary btn-sm" (click)="issueTarget.set(b)"><vc-icon name="verified" [size]="14" />Record issuance</button>
              }
            </footer>
          </article>
        }
      </div>
    }

    <!-- create batch -->
    <vc-modal [(open)]="createOpen" title="Create a credit batch" width="640px"
      subtitle="Choose an approved calculation run. Its reductions and removals enter the inventory as a provisional batch.">
      @if (!ctx.current()) {
        <vc-callout tone="warn" icon="briefcase">Choose a project in the top bar first.</vc-callout>
      } @else if (runsLoading()) {
        <vc-loading [rows]="3" />
      } @else if (runsError()) {
        <vc-error title="Couldn't load calculation runs" [message]="runsError()!" />
      } @else if (!eligibleRuns().length) {
        <vc-empty icon="calculator" title="No approved runs waiting"
          [text]="'Every approved calculation in ' + ctx.current()!.code + ' already has a batch, or none has been approved yet.'" />
      } @else {
        <p class="muted small" style="margin-bottom:12px">Project <strong>{{ ctx.current()!.code }} · {{ ctx.current()!.name }}</strong></p>
        <div class="runs">
          @for (r of eligibleRuns(); track r.id) {
            <label class="run" [class.on]="pickRun() === r.id">
              <input type="radio" name="run" [value]="r.id" [checked]="pickRun() === r.id" (change)="pickRun.set(r.id)" />
              <div class="rb">
                <div class="row"><strong>{{ r.period_label || ((r.period_start | day) + ' – ' + (r.period_end | day)) }}</strong><vc-dc cls="CALCULATED" /></div>
                <div class="small muted">Engine {{ r.engine_version }} · run {{ r.id.slice(0, 8) }} · {{ r.created_at | day }}</div>
              </div>
              <div class="rq num">
                <span><vc-icon class="tic" [name]="ticon['reduction']" [size]="13" />{{ r.reductions_t_co2e | num: 2 }} t</span>
                <span><vc-icon class="tic" [name]="ticon['removal']" [size]="13" />{{ r.removals_t_co2e | num: 2 }} t</span>
                <strong>{{ r.net_t_co2e | num: 2 }} t net</strong>
              </div>
            </label>
          }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!pickRun() || busy()" (click)="create()">Create provisional batch</button>
      </ng-container>
    </vc-modal>

    <!-- verify -->
    <vc-modal [open]="!!verifyTarget()" (closed)="verifyTarget.set(null)" title="Mark batch as verified"
      [subtitle]="verifyTarget()?.code ?? ''" width="500px">
      <p>Confirm that an independent verifier has reviewed the verification package for this batch and accepted the result.</p>
      <p class="muted small" style="margin-top:10px">After this, the batch can be issued on a registry. This step is recorded in the audit log.</p>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="verifyTarget.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="verify()">Mark verified</button>
      </ng-container>
    </vc-modal>

    <vcx-issue-drawer [batch]="issueTarget()" (done)="onIssued($event)" (closed)="issueTarget.set(null)" />
  `,
  styles: [`
    .tic{color:var(--stone-500);vertical-align:-2px}
    .stats{margin-bottom:20px}
    .filters{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;align-items:center}
    .filters select{width:280px}
    .seg{display:inline-flex;border:1px solid var(--border-strong);border-radius:8px;background:var(--surface);padding:3px;gap:2px;flex-wrap:wrap}
    .seg button{height:30px;padding:0 12px;border:0;border-radius:6px;background:none;font:inherit;font-size:13px;font-weight:500;color:var(--text-2);cursor:pointer}
    .seg button.on{background:var(--forest-50);color:var(--forest-700);box-shadow:inset 0 0 0 1px var(--forest-200)}
    .seg .c{margin-left:4px;font-size:11px;color:var(--text-3)}
    .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:16px}
    .batch{display:flex;flex-direction:column;gap:14px;padding:18px 18px 0}
    .bh{display:flex;align-items:flex-start;gap:10px;justify-content:space-between}
    .bt{display:flex;flex-direction:column;gap:2px}
    .code{font-size:15px;font-weight:600;color:var(--stone-900)}
    .vint{font-size:12px;color:var(--text-3)}
    .proj{display:flex;align-items:center;gap:6px;margin-top:-8px}
    .split{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .tq{padding:10px 12px;border-radius:8px;background:var(--surface-2);border:1px solid var(--border);display:flex;flex-direction:column;gap:2px}
    .tq .k{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-2)}
    .sw{width:8px;height:8px;border-radius:2px}
    .tq .v{font-size:18px;font-weight:600} .tq .u{font-size:12px;color:var(--text-3);font-weight:400}
    .bars{display:flex;flex-direction:column;gap:12px}
    .legend{display:flex;flex-wrap:wrap;gap:4px 12px;color:var(--text-2)}
    .legend i{display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:5px}
    .legend b{font-weight:600;color:var(--stone-800)}
    .reg{display:flex;align-items:center;gap:6px;flex-wrap:wrap;color:var(--stone-700)}
    .bf{display:flex;align-items:center;gap:8px;margin:auto -18px 0;padding:10px 12px;border-top:1px solid var(--border);background:var(--surface-2);border-radius:0 0 var(--radius) var(--radius)}
    .runs{display:flex;flex-direction:column;gap:8px}
    .run{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--border);border-radius:10px;cursor:pointer}
    .run:hover{border-color:var(--forest-300)} .run.on{border-color:var(--forest-500);background:var(--forest-50)}
    .run input{accent-color:var(--primary)}
    .rb{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
    .rq{display:flex;flex-direction:column;align-items:flex-end;gap:1px;font-size:12.5px;color:var(--text-2)}
    .rq i{display:inline-block;width:7px;height:7px;border-radius:2px;margin-right:5px}
    .rq strong{color:var(--stone-900)}
    @media (max-width:720px){ .cards{grid-template-columns:1fr} .filters select{width:100%} }
  `],
})
export class CreditsPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  ctx = inject(ProjectContext);
  canManage = inject(AuthService).can('credits.manage');

  types = CREDIT_TYPES;
  typeLabel = TYPE_LABEL;
  color = TYPE_COLOR;
  ticon = TYPE_ICON;
  legendKeys = [
    { key: 'available', label: 'Available', color: 'var(--forest-500)' },
    { key: 'reserved', label: 'Reserved', color: 'var(--sky-600)' },
    { key: 'sold', label: 'Sold', color: 'var(--clay-500)' },
    { key: 'retired', label: 'Retired', color: 'var(--stone-600)' },
    { key: 'buffer', label: 'Buffer', color: 'var(--amber-600)' },
  ];
  statusOpts = [
    { key: '', label: 'All' }, { key: 'provisional', label: 'Provisional' }, { key: 'verified', label: 'Verified' },
    { key: 'issued', label: 'Issued' }, { key: 'cancelled', label: 'Cancelled' },
  ];

  batches = signal<CreditBatch[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  projectF = signal('');
  statusF = signal('');
  busy = signal(false);

  rows = computed(() =>
    this.batches().filter(b => (!this.projectF() || b.project_id === this.projectF()) && (!this.statusF() || b.status === this.statusF())),
  );

  createOpen = signal(false);
  runs = signal<RunRow[]>([]);
  runsLoading = signal(false);
  runsError = signal<string | null>(null);
  pickRun = signal<string | null>(null);
  eligibleRuns = computed(() => {
    const used = new Set(this.batches().map(b => b.run_id));
    return this.runs().filter(r => r.status === 'approved' && !used.has(r.id));
  });

  verifyTarget = signal<CreditBatch | null>(null);
  issueTarget = signal<CreditBatch | null>(null);

  constructor() { this.load(); }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<CreditBatch[]>('/credit-batches').subscribe({
      next: r => { this.batches.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  count(status: string) {
    const list = this.batches().filter(b => !this.projectF() || b.project_id === this.projectF());
    return status ? list.filter(b => b.status === status).length : list.length;
  }

  sum(state: string): number {
    const live = this.rows().filter(b => b.status !== 'cancelled');
    if (state === 'all') return live.reduce((a, b) => a + ['available', 'reserved', 'sold', 'retired', 'buffer'].reduce((x, k) => x + (b.totals[k] ?? 0), 0), 0);
    return live.reduce((a, b) => a + (b.totals[state] ?? 0), 0);
  }

  projectName(id: string) {
    const p = this.ctx.projects().find(x => x.id === id);
    return p ? `${p.code} · ${p.name}` : 'Project ' + id.slice(0, 8);
  }

  openCreate() {
    this.createOpen.set(true);
    this.pickRun.set(null);
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.runsLoading.set(true);
    this.runsError.set(null);
    this.api.get<RunRow[]>(`/projects/${pid}/calculations`).subscribe({
      next: r => { this.runs.set(r); this.runsLoading.set(false); if (this.eligibleRuns().length === 1) this.pickRun.set(this.eligibleRuns()[0].id); },
      error: (e: ApiError) => { this.runsError.set(e.message); this.runsLoading.set(false); },
    });
  }

  create() {
    const id = this.pickRun();
    if (!id) return;
    this.busy.set(true);
    this.api.post<CreditBatch>(`/calculations/${id}/credit-batch`).subscribe({
      next: b => {
        this.busy.set(false);
        this.createOpen.set(false);
        this.toast.success(`Batch ${b.code} created`, 'It is provisional until verified and issued.');
        this.router.navigate(['/app/credits', b.id]);
      },
      error: e => { this.busy.set(false); this.toast.apiError(e, "Couldn't create the batch"); },
    });
  }

  verify() {
    const b = this.verifyTarget();
    if (!b) return;
    this.busy.set(true);
    this.api.post<CreditBatch>(`/credit-batches/${b.id}/verify`).subscribe({
      next: nb => { this.busy.set(false); this.verifyTarget.set(null); this.replace(nb); this.toast.success(`${nb.code} marked verified`); },
      error: e => { this.busy.set(false); this.toast.apiError(e, "Couldn't verify the batch"); },
    });
  }

  onIssued(b: CreditBatch) {
    this.issueTarget.set(null);
    this.replace(b);
  }

  private replace(b: CreditBatch) {
    this.batches.update(list => list.map(x => (x.id === b.id ? { ...x, ...b } : x)));
  }
}
