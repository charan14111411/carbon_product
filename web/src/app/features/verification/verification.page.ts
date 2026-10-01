import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe, NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Callout, DataClass, Empty, ErrorBox, Hash, Loading, Modal, PageHeader } from '../../ui/kit';
import { CalcBlocker } from '../calculations/blocker';
import { People, RunSummary, saveBlob } from '../calculations/calc.types';
import { Integrity, Package } from './verification.types';

@Component({
  selector: 'vc-verification-page',
  imports: [RouterLink, PageHeader, Icon, DataClass, Hash, Empty, ErrorBox, Loading, Modal, Callout, CalcBlocker, NumPipe, DayPipe, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Verification" eyebrow="Carbon"
      subtitle="Sealed evidence packages for independent verifiers. Each package is built from an approved calculation and carries a SHA-256 fingerprint that shows if anything was changed.">
      <button actions class="btn btn-secondary" (click)="load()"><vc-icon name="refresh" />Refresh</button>
      @if (auth.can('package.issue')) {
        <button actions class="btn btn-primary" (click)="openIssue()"><vc-icon name="package" />Issue package</button>
      }
    </vc-page-header>

    @if (!ctx.currentId()) {
      <section class="card"><vc-empty icon="briefcase" title="Choose a project" text="Pick a project in the top bar to see its verification packages." /></section>
    } @else {
      <section class="card">
        @if (loading()) {
          <vc-loading [rows]="5" />
        } @else if (error()) {
          <div class="card-body"><vc-error title="Couldn't load packages" [message]="error()!" /></div>
        } @else if (!packages().length) {
          <vc-empty icon="package" title="No packages issued yet"
            text="Once a calculation is approved, issue a sealed package and give the verifier a time-limited, read-only link.">
            @if (auth.can('package.issue')) { <button class="btn btn-primary" (click)="openIssue()"><vc-icon name="package" />Issue package</button> }
            <a class="btn btn-secondary" routerLink="/app/calculations">Go to calculations</a>
          </vc-empty>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr>
                <th>Package</th><th>Period and contents</th><th class="num">VCUs</th><th>Fingerprint</th>
                <th>Issued</th><th>Integrity</th><th class="num">Download</th>
              </tr></thead>
              <tbody>
                @for (p of packages(); track p.id) {
                  <tr class="clickable" (click)="open(p)">
                    <td class="nowrap"><span class="ver">v{{ p.version }}</span><div class="subtle small">{{ p.summary.project_code }}</div></td>
                    <td><strong>{{ p.summary.period_label }}</strong>&nbsp;<span class="subtle small">{{ p.summary.period_start | day }} – {{ p.summary.period_end | day }}</span>
                      <div class="subtle small">{{ p.summary.samples }} samples · {{ p.summary.lab_results }} lab results · {{ p.summary.documents }} files</div></td>
                    <td class="num nowrap">{{ p.summary.net_credits_t_co2e | num: 1 }} <span class="u">tCO₂e</span></td>
                    <td (click)="$event.stopPropagation()"><vc-hash [value]="p.sha256" /></td>
                    <td class="nowrap">{{ p.summary.generated_by || people.name(p.created_by) }}<div class="subtle small" [title]="p.created_at | day: true">{{ p.created_at | ago }}</div></td>
                    <td (click)="$event.stopPropagation()">
                      @switch (checks()[p.id]) {
                        @case ('checking') { <span class="subtle small">Checking…</span> }
                        @case ('intact') { <span class="ok"><vc-icon name="shield-check" [size]="14" />Intact</span> }
                        @case ('tampered') { <span class="bad"><vc-icon name="shield-alert" [size]="14" />Tamper alert</span> }
                        @default { <button class="btn btn-ghost btn-sm" (click)="check(p)"><vc-icon name="shield" [size]="14" />Check</button> }
                      }
                    </td>
                    <td class="num nowrap" (click)="$event.stopPropagation()">
                      <button class="btn btn-ghost btn-sm btn-icon" (click)="download(p, 'json')" title="Download package JSON" aria-label="Download package JSON"><vc-icon name="file-json" [size]="15" /></button>
                      @if (p.pdf_file_id) { <button class="btn btn-ghost btn-sm btn-icon" (click)="download(p, 'pdf')" title="Download PDF report" aria-label="Download PDF report"><vc-icon name="file" [size]="15" /></button> }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
      @if (tampered()) {
        <vc-callout tone="danger" icon="shield-alert" class="mt">
          <strong>A package failed its integrity check.</strong> The stored file no longer matches the fingerprint recorded when it was issued.
          Do not share it; issue a new version and tell the platform administrator.
        </vc-callout>
      }
    }

    <vc-modal [(open)]="issueOpen" title="Issue a verification package" subtitle="Choose an approved calculation. The package is sealed as soon as it is issued." width="640px">
      @if (runsLoading()) { <vc-loading [rows]="3" /> }
      @else if (!approved().length) {
        <vc-empty icon="calculator" title="No approved calculation" text="A package can only be built from an approved calculation run." />
      } @else {
        <div class="runs">
          @for (r of approved(); track r.id) {
            <label class="run" [class.on]="pick() === r.id" [class.dis]="isMine(r)">
              <input type="radio" name="run" [value]="r.id" [checked]="pick() === r.id" [disabled]="isMine(r)" (change)="pick.set(r.id)" />
              <div class="rt">
                <strong>Period {{ r.period_label }}</strong>
                <span class="small muted">{{ r.period_start | day }} – {{ r.period_end | day }} · created by {{ people.name(r.created_by, 'Unknown') }}</span>
                @if (isMine(r)) { <span class="small own"><vc-icon name="lock" [size]="12" />You created this run, so a colleague must package it.</span> }
              </div>
              <div class="rv num"><strong>{{ r.net_t_co2e | num: 1 }}</strong>&nbsp;<span class="u">tCO₂e</span>&nbsp;<vc-dc cls="CALCULATED" /></div>
            </label>
          }
        </div>
        <vc-callout tone="info" icon="users" class="mt">Four-eyes rule: the person who created a calculation can't issue its package. Re-issuing creates a new version; earlier versions stay available.</vc-callout>
      }
      @if (issueError()) { <div class="mt"><vc-calc-blocker [error]="issueError()" /></div> }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="issueOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!pick() || issuing()" (click)="issue()"><vc-icon name="package" />{{ issuing() ? 'Sealing…' : 'Issue package' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .u{font-size:11.5px;color:var(--text-3);margin-left:3px}
    .ver{display:inline-grid;place-items:center;min-width:30px;height:24px;padding:0 6px;border-radius:6px;background:var(--forest-100);color:var(--forest-700);font-weight:600;font-size:12.5px}
    vc-hash{white-space:nowrap}
    .ok,.bad{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;font-weight:500;padding:3px 9px;border-radius:999px}
    .ok{background:var(--ok-soft);color:var(--forest-700)} .bad{background:var(--danger-soft);color:var(--red-600)}
    .mt{margin-top:14px;display:flex}
    .runs{display:flex;flex-direction:column;gap:8px}
    .run{display:flex;gap:12px;align-items:center;padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);cursor:pointer}
    .run:hover{border-color:var(--stone-400)}
    .run.on{border-color:var(--forest-500);background:var(--forest-50);box-shadow:var(--focus)}
    .run.dis{cursor:not-allowed;opacity:.75}
    .run input{accent-color:var(--primary)}
    .rt{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
    .own{display:inline-flex;align-items:center;gap:5px;color:var(--amber-600)}
    .rv{white-space:nowrap;display:flex;align-items:center;gap:6px}
  `],
})
export class VerificationPage {
  private api = inject(ApiService);
  private router = inject(Router);
  private toast = inject(ToastService);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  people = inject(People);

  packages = signal<Package[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  checks = signal<Record<string, 'checking' | 'intact' | 'tampered'>>({});
  tampered = computed(() => Object.values(this.checks()).includes('tampered'));

  issueOpen = signal(false);
  runs = signal<RunSummary[]>([]);
  runsLoading = signal(false);
  pick = signal<string | null>(null);
  issuing = signal(false);
  issueError = signal<ApiError | null>(null);
  approved = computed(() => this.runs().filter(r => r.status === 'approved'));

  constructor() {
    this.people.load();
    effect(() => { if (this.ctx.currentId()) this.load(); });
  }

  isMine(r: RunSummary) { return r.created_by === this.auth.profile()?.id; }
  open(p: Package) { this.router.navigate(['/app/verification', p.id]); }

  load() {
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Package[]>(`/projects/${pid}/packages`).subscribe({
      next: r => { this.packages.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  check(p: Package) {
    this.checks.update(c => ({ ...c, [p.id]: 'checking' }));
    this.api.get<Integrity>(`/packages/${p.id}/verify`).subscribe({
      next: r => this.checks.update(c => ({ ...c, [p.id]: r.intact ? 'intact' : 'tampered' })),
      error: (e: ApiError) => {
        this.checks.update(c => { const n = { ...c }; delete n[p.id]; return n; });
        this.toast.apiError(e, "Couldn't check integrity");
      },
    });
  }

  download(p: Package, kind: 'json' | 'pdf') {
    const id = kind === 'json' ? p.json_file_id : p.pdf_file_id;
    if (!id) return;
    this.api.blob(`/evidence/${id}/content`).subscribe({
      next: b => saveBlob(b, `${p.summary.project_code}_${p.summary.period_label}_v${p.version}.${kind}`),
      error: (e: ApiError) => this.toast.apiError(e, "Couldn't download"),
    });
  }

  openIssue() {
    this.issueError.set(null);
    this.pick.set(null);
    this.issueOpen.set(true);
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.runsLoading.set(true);
    this.api.get<RunSummary[]>(`/projects/${pid}/calculations`).subscribe({
      next: r => {
        this.runs.set(r);
        this.runsLoading.set(false);
        const first = r.find(x => x.status === 'approved' && !this.isMine(x));
        if (first) this.pick.set(first.id);
      },
      error: (e: ApiError) => { this.runsLoading.set(false); this.issueError.set(e); },
    });
  }

  issue() {
    const id = this.pick();
    if (!id) return;
    this.issuing.set(true);
    this.issueError.set(null);
    this.api.post<Package>(`/calculations/${id}/package`).subscribe({
      next: p => {
        this.issuing.set(false);
        this.issueOpen.set(false);
        this.toast.success(`Package v${p.version} issued`, 'It is sealed. Grant a verifier access next.');
        this.router.navigate(['/app/verification', p.id]);
      },
      error: (e: ApiError) => { this.issuing.set(false); this.issueError.set(e); },
    });
  }
}
