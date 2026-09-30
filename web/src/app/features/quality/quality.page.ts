import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe, HumanPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, Empty, ErrorBox, Loading, Modal, PageHeader } from '../../ui/kit';

type Severity = 'blocking' | 'error' | 'warning' | 'info';
interface Finding {
  id: string;
  project_id: string | null;
  entity_type: string;
  entity_id: string;
  rule_code: string;
  severity: Severity;
  message: string;
  details: Record<string, unknown>;
  status: 'open' | 'acknowledged' | 'resolved';
  resolution_note: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string | null;
  blocks_calculation: boolean;
}
interface Summary {
  open_by_severity: Record<Severity, number>;
  open_by_rule: Record<string, number>;
  by_status: Record<string, number>;
  blocking: number;
  can_calculate: boolean;
  rules: { code: string; title: string; severity: Severity; entity_type: string }[];
}
interface RunResult { checked_at: string; counts: Record<Severity, number>; total_open: number; blocking: number }

const SEV: Severity[] = ['blocking', 'error', 'warning', 'info'];
const SEV_META: Record<Severity, { label: string; icon: string; hint: string }> = {
  blocking: { label: 'Blocking', icon: 'ban', hint: 'Stops the calculation' },
  error: { label: 'Errors', icon: 'x-circle', hint: 'Must be reviewed' },
  warning: { label: 'Warnings', icon: 'alert', hint: 'Worth a look' },
  info: { label: 'Info', icon: 'info', hint: 'For the record' },
};
const ENTITY: Record<string, { label: string; route: string; param: string }> = {
  sample: { label: 'Sample', route: '/app/sampling', param: 'sample' },
  soil_layer: { label: 'Soil layer', route: '/app/lab', param: 'layer' },
  lab_result: { label: 'Lab result', route: '/app/lab', param: 'result' },
  sample_plan: { label: 'Sampling plan', route: '/app/sampling', param: 'plan' },
  sampling_point: { label: 'Sampling point', route: '/app/sampling', param: 'point' },
};

@Component({
  selector: 'vc-quality-page',
  imports: [FormsModule, RouterLink, PageHeader, Loading, ErrorBox, Empty, Badge, Callout, Modal, Icon, DayPipe, AgoPipe, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Quality checks" eyebrow="Measurement"
      [subtitle]="'Automatic checks on samples, lab results and sampling plans for ' + (ctx.current()?.name ?? 'the current project') + '. Blocking findings stop the carbon calculation until the data is fixed.'">
      @if (canRun()) {
        <button actions class="btn btn-primary" [disabled]="running() || !ctx.currentId()" (click)="run()">
          <vc-icon [name]="running() ? 'refresh' : 'play'" [class.spin]="running()" />{{ running() ? 'Running checks…' : 'Run checks now' }}
        </button>
      }
    </vc-page-header>

    @if (!ctx.currentId() && ctx.loaded()) {
      <div class="card"><vc-empty icon="briefcase" title="Choose a project" text="Quality checks are run per project. Pick one from the project menu at the top." /></div>
    } @else {
      @if (summary(); as s) {
        <div class="gate" [class.ok]="s.can_calculate">
          <vc-icon [name]="s.can_calculate ? 'check-circle' : 'ban'" [size]="20" />
          <div class="g-t">
            @if (s.can_calculate) {
              <strong>No blocking findings — the calculation can proceed.</strong>
              <span>Warnings and errors should still be reviewed before the results are submitted for verification.</span>
            } @else {
              <strong>{{ s.blocking }} blocking finding{{ s.blocking === 1 ? '' : 's' }} stop the calculation.</strong>
              <span>Fix the underlying data (for example re-take a sample or correct a lab entry) and run the checks again.</span>
            }
          </div>
          @if (lastRun()) { <span class="g-last small">Last run {{ lastRun() | ago }}</span> }
        </div>

        <div class="tiles">
          @for (k of sevs; track k) {
            <button type="button" class="tile" [class]="'tile s-' + k" [class.on]="sev() === k" (click)="sev.set(sev() === k ? '' : k)">
              <div class="t-top"><span class="t-ic"><vc-icon [name]="meta[k].icon" [size]="15" /></span><span class="t-l">{{ meta[k].label }}</span></div>
              <div class="t-v num">{{ s.open_by_severity[k] ?? 0 }}</div>
              <div class="t-h">open · {{ meta[k].hint }}</div>
            </button>
          }
        </div>
      }

      <div class="filters">
        <div class="search"><vc-icon name="search" [size]="15" /><input class="input" placeholder="Search messages…" [ngModel]="q()" (ngModelChange)="q.set($event)" /></div>
        <select class="input" [ngModel]="status()" (ngModelChange)="status.set($event)" aria-label="Status">
          <option value="active">Open & acknowledged</option><option value="open">Open</option><option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option><option value="all">All statuses</option>
        </select>
        <select class="input" [ngModel]="rule()" (ngModelChange)="rule.set($event)" aria-label="Check">
          <option value="">All checks</option>
          @for (r of summary()?.rules ?? []; track r.code) { <option [value]="r.code">{{ r.title }}</option> }
        </select>
        <select class="input sm" [ngModel]="entity()" (ngModelChange)="entity.set($event)" aria-label="Record type">
          <option value="">All records</option>
          @for (e of entityTypes(); track e) { <option [value]="e">{{ entityLabel(e) }}</option> }
        </select>
        <span class="spacer"></span>
        <div class="seg">
          <button type="button" [class.on]="sort() === 'severity'" (click)="sort.set('severity')">By severity</button>
          <button type="button" [class.on]="sort() === 'newest'" (click)="sort.set('newest')">Newest</button>
        </div>
      </div>

      <section class="card">
        @if (loading()) { <vc-loading [rows]="8" /> }
        @else if (error()) { <div class="card-body"><vc-error title="Couldn't load quality findings" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error></div> }
        @else if (!all().length) {
          <vc-empty icon="shield-check" [title]="lastRun() ? 'Every check passes' : 'No findings yet'" [text]="lastRun() ? 'The latest run found nothing to review for this project.' : 'Checks run automatically when samples and lab results arrive. You can also run them now.'">
            @if (canRun()) { <button class="btn btn-primary" (click)="run()"><vc-icon name="play" />Run checks now</button> }
          </vc-empty>
        } @else if (!rows().length) {
          <vc-empty icon="check-circle" title="Nothing matches" [text]="status() === 'active' ? 'No open findings for these filters.' : 'Try different filters.'">
            <button class="btn btn-secondary" (click)="clear()">Clear filters</button>
          </vc-empty>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th class="sev-col"></th><th>Check</th><th>Finding</th><th>Record</th><th>Status</th><th>Found</th><th></th></tr></thead>
              @for (g of grouped(); track g.key) {
                <tbody>
                  @if (sort() === 'severity') {
                    <tr class="grp"><td colspan="7"><span [class]="'gl s-' + g.key"><vc-icon [name]="meta[g.key].icon" [size]="13" />{{ meta[g.key].label }}</span><span class="subtle small">{{ g.items.length }}</span></td></tr>
                  }
                  @for (f of g.items; track f.id) {
                    <tr class="clickable" (click)="openFinding(f)">
                      <td class="sev-col"><span [class]="'bar s-' + f.severity"></span></td>
                      <td><div class="rt">{{ ruleTitle(f.rule_code) }}</div><code class="rc">{{ f.rule_code }}</code></td>
                      <td class="msg">{{ f.message }}</td>
                      <td class="nowrap">
                        <a [routerLink]="entityRoute(f)" [queryParams]="entityParams(f)" (click)="$event.stopPropagation()" class="ent">
                          {{ entityLabel(f.entity_type) }} <span class="mono">{{ f.entity_id.slice(0, 8) }}</span>
                        </a>
                      </td>
                      <td>
                        <vc-badge [status]="f.status" />
                        @if (f.blocks_calculation && f.status === 'acknowledged') { <div class="still small">still blocking</div> }
                      </td>
                      <td class="nowrap subtle small" [title]="f.created_at | day: true">{{ f.created_at | ago }}</td>
                      <td class="num nowrap">
                        @if (canResolve() && f.status !== 'resolved') {
                          @if (f.status === 'open') { <button class="btn btn-ghost btn-sm" (click)="ask('acknowledge', f); $event.stopPropagation()">Acknowledge</button> }
                          @if (f.severity !== 'blocking') { <button class="btn btn-secondary btn-sm" (click)="ask('resolve', f); $event.stopPropagation()">Resolve</button> }
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              }
            </table>
          </div>
          <div class="card-foot"><span class="subtle small grow">{{ rows().length }} finding{{ rows().length === 1 ? '' : 's' }}</span></div>
        }
      </section>
    }

    <!-- detail drawer -->
    <vc-modal [(open)]="detailOpen" [drawer]="true" width="520px" [title]="current() ? ruleTitle(current()!.rule_code) : ''" [subtitle]="current()?.rule_code ?? ''">
      @if (current(); as f) {
        <div class="stack">
          <div class="row wrap">
            <span [class]="'sevpill s-' + f.severity"><vc-icon [name]="meta[f.severity].icon" [size]="13" />{{ sevOne(f.severity) }}</span>
            <vc-badge [status]="f.status" />
            @if (f.blocks_calculation) { <span class="blk small"><vc-icon name="lock" [size]="12" />Blocks calculation</span> }
          </div>
          <p class="big-msg">{{ f.message }}</p>
          <dl class="kv">
            <dt>Record</dt><dd><a [routerLink]="entityRoute(f)" [queryParams]="entityParams(f)">{{ entityLabel(f.entity_type) }} <span class="mono small">{{ f.entity_id.slice(0, 8) }}</span></a></dd>
            <dt>Found</dt><dd>{{ f.created_at | day: true }}</dd>
            @for (d of detailRows(f); track d.k) { <dt>{{ d.k | human }}</dt><dd class="num">{{ d.v }}</dd> }
            @if (f.resolution_note) { <dt>{{ f.status === 'resolved' ? 'Resolution' : 'Note' }}</dt><dd>“{{ f.resolution_note }}”@if (f.resolved_by) { <div class="subtle small">{{ f.resolved_by }} · {{ f.resolved_at | day: true }}</div> }</dd> }
          </dl>
          @if (f.severity === 'blocking' && f.status !== 'resolved') {
            <vc-callout tone="danger" icon="ban">
              <strong>Blocking findings can't be resolved by hand.</strong> Fix the data it points to and run the checks again — it resolves itself once the check passes.
              Acknowledging it records that you've seen it, but it keeps blocking the calculation.
            </vc-callout>
          }
        </div>
      }
      @if (current() && canResolve() && current()!.status !== 'resolved') {
        <div footer class="ft">
          @if (current()!.status === 'open') { <button class="btn btn-secondary" (click)="ask('acknowledge', current()!)">Acknowledge</button> }
          @if (current()!.severity !== 'blocking') { <button class="btn btn-primary" (click)="ask('resolve', current()!)"><vc-icon name="check" />Resolve</button> }
        </div>
      }
    </vc-modal>

    <!-- resolve / acknowledge -->
    <vc-modal [(open)]="actOpen" [title]="act() === 'resolve' ? 'Resolve finding' : 'Acknowledge finding'" width="520px"
      [subtitle]="target()?.message ?? ''">
      @if (act() === 'resolve') {
        <p class="muted">Explain why this is acceptable or what was done. The note is kept in the audit trail and shown to verifiers.</p>
      } @else {
        <p class="muted">Acknowledging records that someone has reviewed the finding. @if (target()?.severity === 'blocking') { <strong>It stays blocking</strong> until the data is fixed and the checks pass. } @else { It stays visible until it is resolved. }</p>
      }
      <div class="field mt">
        <label for="q-note">Note <span class="req">*</span></label>
        <textarea id="q-note" class="input" rows="3" [ngModel]="note()" (ngModelChange)="note.set($event)"
          [placeholder]="act() === 'resolve' ? 'e.g. GPS accuracy was 6 m under tree canopy; position confirmed against the site photo' : 'e.g. Re-sampling scheduled with the field team for next week'"></textarea>
        <span class="hint">At least 5 characters.</span>
      </div>
      @if (actError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ actError() }}</vc-callout> }
      <div footer class="ft">
        <button class="btn btn-ghost" (click)="actOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="note().trim().length < 5 || busy()" (click)="doAct()">{{ busy() ? 'Saving…' : act() === 'resolve' ? 'Resolve' : 'Acknowledge' }}</button>
      </div>
    </vc-modal>
  `,
  styles: [`
    .spin{animation:spin 1s linear infinite} @keyframes spin{to{transform:rotate(360deg)}}
    .gate{display:flex;gap:12px;align-items:flex-start;padding:14px 18px;border-radius:var(--radius);margin-bottom:16px;background:var(--danger-soft);border:1px solid #f3c7c3;color:var(--red-600)}
    .gate.ok{background:var(--ok-soft);border-color:#cfe2d4;color:var(--forest-600)}
    .g-t{flex:1;display:flex;flex-direction:column;gap:2px} .g-t strong{color:var(--stone-900)} .g-t span{color:var(--stone-700);font-size:13px}
    .g-last{color:var(--text-3);white-space:nowrap}
    .tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:16px}
    @media (max-width: 900px){.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}}
    .tile{position:relative;text-align:left;padding:14px 16px;border-radius:var(--radius);border:1px solid var(--border);background:var(--surface);box-shadow:var(--shadow-sm);cursor:pointer;font:inherit;overflow:hidden;transition:border-color .12s,box-shadow .12s}
    .tile::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--c)}
    .tile:hover{border-color:var(--stone-300)}
    .tile.on{border-color:var(--c);box-shadow:0 0 0 1px var(--c) inset}
    .t-top{display:flex;gap:8px;align-items:center}
    .t-ic{display:grid;place-items:center;width:26px;height:26px;border-radius:7px;background:var(--cs);color:var(--c)}
    .t-l{font-size:12.5px;font-weight:500;color:var(--stone-700)}
    .t-v{font-size:28px;font-weight:600;letter-spacing:-.02em;margin-top:8px;color:var(--stone-900)}
    .t-h{font-size:12px;color:var(--text-3)}
    .s-blocking{--c:var(--red-600);--cs:var(--red-100)} .s-error{--c:var(--clay-600);--cs:var(--clay-100)}
    .s-warning{--c:var(--amber-600);--cs:var(--amber-100)} .s-info{--c:var(--sky-600);--cs:var(--sky-100)}
    .filters{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;align-items:center}
    .search{position:relative;flex:0 1 280px;min-width:200px}
    .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)} .search .input{padding-left:34px}
    .filters select{width:200px} .filters select.sm{width:160px}
    .seg{display:inline-flex;padding:3px;border-radius:8px;background:var(--sand-200);gap:2px}
    .seg button{height:30px;padding:0 12px;border:0;border-radius:6px;background:none;font:500 12.5px var(--font);color:var(--stone-600);cursor:pointer}
    .seg button.on{background:var(--surface);color:var(--stone-900);box-shadow:var(--shadow-sm)}
    .sev-col{width:6px;padding:0 0 0 10px !important}
    .bar{display:block;width:4px;height:30px;border-radius:2px;background:var(--c)}
    .grp td{background:var(--surface-2);padding:8px 14px;border-bottom:1px solid var(--border)}
    .gl{display:inline-flex;gap:6px;align-items:center;font-size:12px;font-weight:600;color:var(--c);margin-right:8px;text-transform:uppercase;letter-spacing:.05em}
    .rt{font-weight:500;white-space:nowrap} .rc{font-size:11px;color:var(--text-3)}
    .msg{max-width:460px;color:var(--stone-800)}
    .ent{font-size:12.5px} .ent .mono{color:var(--text-3)}
    .still{color:var(--red-600);margin-top:3px}
    .grow{margin-right:auto}
    .sevpill{display:inline-flex;gap:5px;align-items:center;height:24px;padding:0 9px;border-radius:999px;background:var(--cs);color:var(--c);font-size:12px;font-weight:600}
    .blk{display:inline-flex;gap:4px;align-items:center;color:var(--red-600)}
    .big-msg{font-size:15px;line-height:1.5;color:var(--stone-900)}
    .req{color:var(--danger)} .mt{margin-top:12px}
    .ft{display:flex;gap:8px}
  `],
})
export class QualityPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);

  sevs = SEV;
  meta = SEV_META;
  all = signal<Finding[]>([]);
  summary = signal<Summary | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  running = signal(false);
  lastRun = signal<string | null>(null);

  sev = signal<Severity | ''>('');
  status = signal('active');
  rule = signal('');
  entity = signal('');
  q = signal('');
  sort = signal<'severity' | 'newest'>('severity');

  detailOpen = signal(false);
  current = signal<Finding | null>(null);
  actOpen = signal(false);
  act = signal<'resolve' | 'acknowledge'>('resolve');
  target = signal<Finding | null>(null);
  note = signal('');
  actError = signal<string | null>(null);
  busy = signal(false);

  canRun = computed(() => this.auth.can('qa.resolve', 'calc.run', 'sampling.plan'));
  canResolve = computed(() => this.auth.can('qa.resolve'));
  entityTypes = computed(() => [...new Set(this.all().map(f => f.entity_type))].sort());
  rows = computed(() => {
    const q = this.q().toLowerCase().trim();
    const st = this.status();
    return this.all().filter(f =>
      (!this.sev() || f.severity === this.sev()) &&
      (st === 'all' || (st === 'active' ? f.status !== 'resolved' : f.status === st)) &&
      (!this.rule() || f.rule_code === this.rule()) &&
      (!this.entity() || f.entity_type === this.entity()) &&
      (!q || f.message.toLowerCase().includes(q) || f.rule_code.toLowerCase().includes(q)));
  });
  grouped = computed(() => {
    const rows = this.rows();
    if (this.sort() === 'newest') {
      return [{ key: 'info' as Severity, items: [...rows].sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? '')) }];
    }
    return SEV.map(k => ({ key: k, items: rows.filter(f => f.severity === k) })).filter(g => g.items.length);
  });

  constructor() {
    effect(() => {
      const pid = this.ctx.currentId();
      if (pid) this.load(pid);
    });
  }

  load(pid = this.ctx.currentId()) {
    if (!pid) return;
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      f: this.api.get<Finding[]>(`/projects/${pid}/qa/findings`, { limit: 2000 }),
      s: this.api.get<Summary>(`/projects/${pid}/qa/summary`),
    }).subscribe({
      next: ({ f, s }) => {
        this.all.set(f); this.summary.set(s); this.loading.set(false);
        const cur = this.current();
        if (cur) this.current.set(f.find(x => x.id === cur.id) ?? cur);
      },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  run() {
    const pid = this.ctx.currentId();
    if (!pid) return;
    this.running.set(true);
    this.api.post<RunResult>(`/projects/${pid}/qa/run`).subscribe({
      next: r => {
        this.running.set(false);
        this.lastRun.set(r.checked_at);
        const parts = SEV.filter(s => r.counts[s]).map(s => `${r.counts[s]} ${SEV_META[s].label.toLowerCase()}`);
        this.toast.success('Checks complete', r.total_open ? `${r.total_open} open: ${parts.join(', ')}.` : 'Everything passes — no open findings.');
        this.load(pid);
      },
      error: (e: ApiError) => { this.running.set(false); this.toast.apiError(e, "Couldn't run the checks"); },
    });
  }

  clear() { this.sev.set(''); this.status.set('active'); this.rule.set(''); this.entity.set(''); this.q.set(''); }
  ruleTitle(code: string) { return this.summary()?.rules.find(r => r.code === code)?.title ?? code.replace(/_/g, ' ').toLowerCase().replace(/^./, c => c.toUpperCase()); }
  entityLabel(t: string) { return ENTITY[t]?.label ?? t.replace(/_/g, ' '); }
  entityRoute(f: Finding) { return ENTITY[f.entity_type]?.route ?? '/app/sampling'; }
  entityParams(f: Finding) { return { [ENTITY[f.entity_type]?.param ?? 'id']: f.entity_id }; }
  detailRows(f: Finding) {
    return Object.entries(f.details ?? {}).filter(([, v]) => v !== null && typeof v !== 'object').map(([k, v]) => ({ k, v: String(v) }));
  }

  sevOne(s: Severity) { return ({ blocking: 'Blocking', error: 'Error', warning: 'Warning', info: 'Info' } as const)[s]; }
  openFinding(f: Finding) { this.current.set(f); this.detailOpen.set(true); }
  ask(a: 'resolve' | 'acknowledge', f: Finding) {
    this.act.set(a); this.target.set(f); this.note.set(''); this.actError.set(null); this.actOpen.set(true);
  }
  doAct() {
    const f = this.target()!;
    this.busy.set(true);
    this.actError.set(null);
    this.api.post<Finding>(`/qa/findings/${f.id}/${this.act()}`, { note: this.note().trim() }).subscribe({
      next: r => {
        this.busy.set(false); this.actOpen.set(false);
        this.all.update(list => list.map(x => (x.id === r.id ? r : x)));
        if (this.current()?.id === r.id) this.current.set(r);
        this.toast.success(this.act() === 'resolve' ? 'Finding resolved' : 'Finding acknowledged', r.blocks_calculation ? 'It still blocks the calculation until the data is fixed.' : undefined);
        this.load();
      },
      error: (e: ApiError) => { this.busy.set(false); this.actError.set(e.message); },
    });
  }
}
