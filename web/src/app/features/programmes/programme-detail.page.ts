import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, HumanPipe, NumPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Empty, ErrorBox, Loading, Modal, PageHeader, Stat, TabItem, Tabs } from '../../ui/kit';
import { ConfirmDialog } from './confirm';
import { fieldMap, formMessage } from './form-errors';
import { Crop, Programme, PROGRAMME_NEXT, ProgrammeSummary, Project, RulePackLite } from './types';

type Transition = (typeof PROGRAMME_NEXT)[string][number];

@Component({
  selector: 'vc-programme-detail',
  imports: [FormsModule, RouterLink, PageHeader, Loading, ErrorBox, Empty, Badge, Modal, Tabs, Stat, Icon, ConfirmDialog,
    NumPipe, DayPipe, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="back" routerLink="/app/programmes"><vc-icon name="arrow-left" [size]="15" />All programmes</a>

    @if (loading()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load this programme" [message]="error()!" />
    } @else if (p(); as p) {
      <vc-page-header [title]="p.name" [eyebrow]="p.code" [subtitle]="p.description || p.region">
        <div actions class="hacts">
          <vc-badge [status]="p.status" />
          @if (canManage) {
            @for (t of transitions(); track t.to) {
              <button class="btn" [class.btn-primary]="t.tone === 'primary'" [class.btn-secondary]="t.tone === 'danger'"
                (click)="ask(t)"><vc-icon [name]="t.icon" />{{ t.label }}</button>
            }
          }
        </div>
      </vc-page-header>

      <vc-tabs [tabs]="tabs()" [(active)]="tab" />

      @switch (tab()) {
        @case ('overview') {
          <div class="grid grid-4 stats">
            <vc-stat label="Projects" [value]="summary()?.projects ?? '—'" icon="briefcase"
              [hint]="projectsHint()" />
            <vc-stat label="Farmers enrolled" [value]="summary() ? (summary()!.farmers_enrolled | num: 0) : '—'" icon="users" />
            <vc-stat label="Fields enrolled" [value]="summary() ? (summary()!.fields_enrolled | num: 0) : '—'" icon="map" />
            <vc-stat label="Area enrolled" [value]="summary() ? (summary()!.hectares_enrolled | num: 1) : '—'" unit="ha" icon="layers" [accent]="true" />
          </div>
          <div class="grid grid-2">
            <section class="card">
              <div class="card-head"><h3>Programme details</h3></div>
              <div class="card-body">
                <dl class="kv">
                  <dt>Code</dt><dd class="mono">{{ p.code }}</dd>
                  <dt>Region</dt><dd>{{ p.region || '—' }}</dd>
                  <dt>Runs</dt><dd>{{ p.start_date | day }} – {{ p.end_date ? (p.end_date | day) : 'no end date' }}</dd>
                  <dt>Land-use look-back</dt><dd class="num">{{ lookback() }} years</dd>
                  <dt>Area limit</dt><dd>{{ p.boundary ? 'Boundary set — fields outside it are ineligible' : 'No area limit' }}</dd>
                  <dt>Created</dt><dd>{{ p.created_at | day }}</dd>
                </dl>
              </div>
            </section>
            <section class="card">
              <div class="card-head"><h3>Eligible crops</h3></div>
              <div class="card-body">
                @if (p.eligible_crops.length) {
                  <div class="crops">
                    @for (c of p.eligible_crops; track c) {
                      <span class="crop"><vc-icon name="sprout" [size]="14" />{{ cropName(c) }}</span>
                    }
                  </div>
                  <p class="small subtle note">Fields growing any other crop fail the “Eligible crop” check at enrolment.</p>
                } @else {
                  <p class="muted">Every crop is eligible. Add crops to restrict enrolment.</p>
                }
              </div>
            </section>
          </div>
        }
        @case ('projects') {
          <section class="card">
            <div class="card-head">
              <h3>Projects</h3>
              @if (canManage && p.status !== 'closed') {
                <button class="btn btn-primary btn-sm" (click)="openProject()"><vc-icon name="plus" />New project</button>
              }
            </div>
            @if (!projects().length) {
              <vc-empty icon="briefcase" title="No projects yet"
                text="A project follows one methodology and crediting period. Create one to start enrolling fields.">
                @if (canManage && p.status !== 'closed') { <button class="btn btn-primary" (click)="openProject()"><vc-icon name="plus" />New project</button> }
              </vc-empty>
            } @else {
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Project</th><th>Methodology</th><th>Baseline from</th><th>Crediting period</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    @for (pr of projects(); track pr.id) {
                      <tr class="clickable" (click)="openProjectDetail(pr)">
                        <td><div class="pname"><strong>{{ pr.name }}</strong><span class="mono subtle small">{{ pr.code }}</span></div></td>
                        <td><span class="mono small">{{ pr.methodology_code }} v{{ pr.methodology_version }}</span></td>
                        <td class="nowrap">{{ pr.baseline_start | day }}</td>
                        <td class="nowrap">{{ pr.crediting_start | day }} – {{ pr.crediting_end | day }}</td>
                        <td><vc-badge [status]="pr.status" /></td>
                        <td class="num"><vc-icon name="chevron-right" [size]="16" class="subtle" /></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </section>
        }
      }
    }

    <vc-confirm [(open)]="confirmOpen" [title]="pending()?.label + ' programme'" [message]="pending()?.text ?? ''"
      [confirmLabel]="pending()?.label ?? 'Confirm'" [tone]="pending()?.tone ?? 'primary'" [icon]="pending()?.icon ?? ''"
      [reason]="pending()?.reason ?? 'none'" reasonPlaceholder="Why is the status changing?" [busy]="busy()"
      (confirmed)="applyStatus($event)" />

    <vc-modal [(open)]="projectOpen" title="New project" subtitle="The methodology and crediting period decide how credits are calculated." width="620px">
      <form class="form-grid" id="proj-form" (ngSubmit)="createProject()">
        <div class="field">
          <label for="jc">Code</label>
          <input id="jc" class="input mono" name="code" [(ngModel)]="pf.code" placeholder="KA-REGEN-01" [class.invalid]="fe()['code']" />
          @if (fe()['code']) { <span class="error">{{ fe()['code'] }}</span> }
        </div>
        <div class="field">
          <label for="jn">Name</label>
          <input id="jn" class="input" name="name" [(ngModel)]="pf.name" placeholder="Hassan cohort 2026" [class.invalid]="fe()['name']" />
          @if (fe()['name']) { <span class="error">{{ fe()['name'] }}</span> }
        </div>
        <div class="field">
          <label for="jm">Methodology code</label>
          <input id="jm" class="input mono" name="mc" [(ngModel)]="pf.methodology_code" />
          <span class="hint">For example VM0042 (Verra improved agricultural land management).</span>
        </div>
        <div class="field">
          <label for="jv">Methodology version</label>
          <input id="jv" class="input mono" name="mv" [(ngModel)]="pf.methodology_version" />
        </div>
        <div class="field span-2">
          <label for="jr">Rule pack <span class="subtle">(optional)</span></label>
          <select id="jr" class="input" name="rp" [(ngModel)]="pf.rule_pack_id">
            <option value="">Assign later</option>
            @for (r of packs(); track r.id) {
              <option [value]="r.id">{{ r.methodology_code }} v{{ r.methodology_version }} rev {{ r.revision }} · {{ r.title }} ({{ r.status | human }})</option>
            }
          </select>
          <span class="hint">The rule pack holds the approved methodology parameters. Calculations need an approved one.</span>
        </div>
        <div class="field">
          <label for="jb">Baseline start</label>
          <input id="jb" class="input" type="date" name="bs" [(ngModel)]="pf.baseline_start" />
        </div>
        <div class="field"></div>
        <div class="field">
          <label for="jcs">Crediting start</label>
          <input id="jcs" class="input" type="date" name="cs" [(ngModel)]="pf.crediting_start" />
        </div>
        <div class="field">
          <label for="jce">Crediting end</label>
          <input id="jce" class="input" type="date" name="ce" [(ngModel)]="pf.crediting_end"
            [class.invalid]="pf.crediting_start && pf.crediting_end && pf.crediting_end < pf.crediting_start" />
          @if (pf.crediting_start && pf.crediting_end && pf.crediting_end < pf.crediting_start) {
            <span class="error">The crediting period can't end before it starts.</span>
          }
        </div>
        @if (projError()) { <div class="span-2"><vc-error title="Couldn't create the project" [message]="projError()!" /></div> }
      </form>
      <ng-container footer>
        <button class="btn btn-secondary" type="button" (click)="projectOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="proj-form" [disabled]="busy() || !pf.code || !pf.name">
          {{ busy() ? 'Creating…' : 'Create project' }}
        </button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .hacts{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .back{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-2);margin-bottom:14px}
    .back:hover{color:var(--forest-700);text-decoration:none}
    .stats{margin-bottom:16px}
    .crops{display:flex;flex-wrap:wrap;gap:8px}
    .crop{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px;border-radius:7px;background:var(--forest-50);border:1px solid var(--forest-100);color:var(--forest-800);font-size:13px}
    .crop code{font-size:11px;color:var(--forest-500)}
    .note{margin-top:14px}
    .pname{display:flex;flex-direction:column;gap:1px}
  `],
})
export class ProgrammeDetailPage {
  id = input.required<string>();
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private ctx = inject(ProjectContext);
  canManage = inject(AuthService).can('programmes.manage');

  p = signal<Programme | null>(null);
  summary = signal<ProgrammeSummary | null>(null);
  projects = signal<Project[]>([]);
  crops = signal<Crop[]>([]);
  packs = signal<RulePackLite[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  tab = signal('overview');
  tabs = computed<TabItem[]>(() => [
    { key: 'overview', label: 'Overview' },
    { key: 'projects', label: 'Projects', count: this.projects().length },
  ]);
  transitions = computed(() => PROGRAMME_NEXT[this.p()?.status ?? ''] ?? []);
  lookback = computed(() => Number(this.p()?.commercial_terms?.['lookback_years'] ?? 10));
  projectsHint = computed(() => {
    const by = this.summary()?.projects_by_status ?? {};
    return Object.entries(by).map(([k, v]) => `${v} ${k}`).join(' · ');
  });
  private cropMap = computed(() => new Map(this.crops().map(c => [c.code, c.name])));

  confirmOpen = signal(false);
  pending = signal<Transition | null>(null);
  busy = signal(false);

  projectOpen = signal(false);
  projError = signal<string | null>(null);
  fe = signal<Record<string, string>>({});
  pf = this.blankProject();

  ngOnInit() {
    this.load();
    this.api.get<Crop[]>('/catalogue/crops').subscribe({ next: c => this.crops.set(c), error: () => {} });
  }

  cropName(c: string) { return this.cropMap().get(c) ?? c; }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Programme>(`/programmes/${this.id()}`).subscribe({
      next: p => { this.p.set(p); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
    this.api.get<ProgrammeSummary>(`/programmes/${this.id()}/summary`).pipe(catchError(() => of(null))).subscribe(s => this.summary.set(s));
    this.api.get<Project[]>('/projects', { programme_id: this.id() }).pipe(catchError(() => of([]))).subscribe(r => this.projects.set(r));
  }

  ask(t: Transition) {
    this.pending.set(t);
    this.confirmOpen.set(true);
  }

  applyStatus(reason: string) {
    const t = this.pending();
    if (!t) return;
    this.busy.set(true);
    this.api.post<Programme>(`/programmes/${this.id()}/status`, { status: t.to, reason: reason || null }).subscribe({
      next: p => {
        this.busy.set(false);
        this.confirmOpen.set(false);
        this.p.set(p);
        this.toast.success(`Programme ${p.status}`, `${p.code} is now ${p.status}.`);
        this.load();
      },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e, "Couldn't change the status"); },
    });
  }

  private blankProject() {
    return { code: '', name: '', methodology_code: 'VM0042', methodology_version: '2.2', rule_pack_id: '',
      baseline_start: '', crediting_start: '', crediting_end: '' };
  }

  openProject() {
    this.pf = this.blankProject();
    this.projError.set(null);
    this.fe.set({});
    this.projectOpen.set(true);
    if (!this.packs().length) {
      this.api.get<RulePackLite[]>('/rule-packs').pipe(catchError(() => of([])))
        .subscribe(r => this.packs.set(r.filter(x => x.status !== 'retired')));
    }
  }

  openProjectDetail(pr: Project) {
    this.router.navigate(['/app/programmes/projects', pr.id]);
  }

  createProject() {
    const f = this.pf;
    this.busy.set(true);
    this.projError.set(null);
    this.api.post<Project>('/projects', {
      programme_id: this.id(), code: f.code.trim(), name: f.name.trim(), methodology_code: f.methodology_code.trim(),
      methodology_version: f.methodology_version.trim(), rule_pack_id: f.rule_pack_id || null,
      baseline_start: f.baseline_start || null, crediting_start: f.crediting_start || null, crediting_end: f.crediting_end || null,
    }).subscribe({
      next: pr => {
        this.busy.set(false);
        this.projectOpen.set(false);
        this.toast.success('Project created', `${pr.code} is in design. Enrol fields and activate it when ready.`);
        this.ctx.load();
        this.router.navigate(['/app/programmes/projects', pr.id]);
      },
      error: (e: ApiError) => {
        this.busy.set(false);
        const m = fieldMap(e);
        this.fe.set(m);
        this.projError.set(formMessage(e, m));
      },
    });
  }
}
