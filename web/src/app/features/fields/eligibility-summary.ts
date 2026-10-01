import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { DayPipe } from '../../core/format';
import { ProjectContext, ProjectLite } from '../../core/project-context.service';
import { Icon } from '../../ui/icon';
import { humanize, Badge, Empty, Loading } from '../../ui/kit';
import { Chip } from './chip';
import { CHECK_INFO, EligibilityCheck, Enrolment, Tenure, checkState } from './site-data';

interface EnrolView { e: Enrolment; project: ProjectLite; checks: (EligibilityCheck & { state: 'pass' | 'fail' | 'warn'; title: string; ref?: string })[] }

/**
 * Compact "Eligibility & tenure status" for one field. The API has no per-field enrolment endpoint,
 * so enrolments are read per project (GET /projects/{id}/enrolments) and filtered by field id.
 */
@Component({
  selector: 'vc-eligibility-summary',
  imports: [RouterLink, Icon, Badge, Empty, Loading, Chip, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'card' },
  template: `
    <div class="card-head"><h3>Eligibility &amp; tenure status</h3></div>

    <div class="tenure">
      <span class="t-ic" [class]="'t-' + tenureTone()"><vc-icon name="landmark" [size]="16" /></span>
      <div class="t-c">
        <div class="t-h"><strong>Land tenure</strong><vc-badge [status]="tenureBadge()">{{ tenureLabel() }}</vc-badge></div>
        <div class="small muted">{{ tenureText() }}</div>
      </div>
    </div>

    @if (loading()) { <vc-loading [rows]="4" /> }
    @else if (!views().length) {
      <vc-empty icon="clipboard-check" title="Not in any project yet"
        text="When this field is put forward for a project, each VM0042 eligibility check and its result appears here." />
    } @else {
      @for (v of views(); track v.e.id) {
        <section class="enr">
          <div class="e-h">
            <a [routerLink]="['/app/programmes/projects', v.project.id]" class="e-p">{{ v.project.code }}</a>
            <vc-badge [status]="v.e.status" />
            <span class="spacer"></span>
            @if (v.e.eligibility.decided_at) { <span class="small subtle">Checked {{ v.e.eligibility.decided_at | day }}</span> }
          </div>
          @if (v.e.status === 'withdrawn' && v.e.eligibility.withdrawal) {
            <p class="small muted wd">Withdrawn {{ v.e.withdrawn_on | day }}: {{ v.e.eligibility.withdrawal.reason }}</p>
          }
          <ul class="checks">
            @for (c of v.checks; track c.code) {
              <li [class]="c.state">
                <span class="ci"><vc-icon [name]="c.state === 'pass' ? 'circle-check' : c.state === 'fail' ? 'circle-x' : 'circle-alert'" [size]="15" /></span>
                <div class="cc">
                  <div class="ct">{{ c.title }}@if (c.ref) { <vc-chip tone="outline" class="ref">VM0042 {{ c.ref }}</vc-chip> }@if (c.severity === 'warning') { <span class="wtag">Warning only</span> }</div>
                  <div class="cm">{{ c.message }}</div>
                </div>
              </li>
            }
          </ul>
        </section>
      }
      <p class="foot small subtle">Results are a snapshot from the last check. Re-check or confirm from the project’s enrolment screen.</p>
    }
  `,
  styles: [`
    :host{display:flex;flex-direction:column;min-width:0}
    .tenure{display:flex;gap:12px;align-items:flex-start;padding:14px 18px;border-bottom:1px solid var(--border)}
    .t-ic{display:grid;place-items:center;flex:none;width:32px;height:32px;border-radius:8px;background:var(--stone-100);color:var(--stone-600)}
    .t-ic.t-ok{background:var(--ok-soft);color:var(--forest-700)} .t-ic.t-warn{background:var(--warn-soft);color:var(--amber-600)} .t-ic.t-danger{background:var(--danger-soft);color:var(--red-600)}
    .t-c{flex:1;min-width:0} .t-h{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:2px}
    .enr{padding:12px 18px;border-bottom:1px solid var(--border)}
    .e-h{display:flex;align-items:center;gap:10px;margin-bottom:6px}
    .e-p{font-weight:600;font-family:var(--mono);font-size:13px}
    .wd{margin:0 0 6px}
    .checks{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}
    .checks li{display:flex;gap:9px;padding:7px 0;border-top:1px solid var(--stone-100)}
    .checks li:first-child{border-top:0}
    .ci{flex:none;padding-top:1px}
    li.pass .ci{color:var(--forest-600)} li.fail .ci{color:var(--red-600)} li.warn .ci{color:var(--amber-600)}
    .cc{flex:1;min-width:0}
    .ct{display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:13px;font-weight:500;color:var(--stone-900)}
    li.fail .ct{color:var(--red-600)}
    .ref{height:18px;font-size:10.5px;padding:0 5px}
    .wtag{font-size:10.5px;font-weight:600;color:var(--amber-600);text-transform:uppercase;letter-spacing:.04em}
    .cm{font-size:12.5px;color:var(--text-2);margin-top:1px}
    .foot{padding:10px 18px 14px;margin:0}
  `],
})
export class EligibilitySummary {
  private api = inject(ApiService);
  private ctx = inject(ProjectContext);
  fieldId = input.required<string>();
  tenure = input<Tenure[] | null>(null);
  /** Bump to reload enrolments. */
  refresh = input<number>(0);

  enrolments = signal<{ e: Enrolment; project: ProjectLite }[]>([]);
  loading = signal(true);

  views = computed<EnrolView[]>(() => this.enrolments().map(({ e, project }) => ({
    e, project,
    checks: (e.eligibility.checks ?? []).map(c => ({ ...c, state: checkState(c), title: CHECK_INFO[c.code]?.title ?? humanize(c.code), ref: CHECK_INFO[c.code]?.ref }))
      .sort((a, b) => this.rank(a.state) - this.rank(b.state)),
  })));

  private today = new Date().toISOString().slice(0, 10);
  private current = computed(() => (this.tenure() ?? []).filter(t => t.valid_from <= this.today && (!t.valid_to || t.valid_to >= this.today)));
  tenureTone = computed(() => {
    const all = this.tenure();
    if (all === null) return 'neutral';
    if (this.current().some(t => t.status === 'verified')) return 'ok';
    if (all.some(t => t.status === 'pending')) return 'warn';
    return all.length ? 'danger' : 'warn';
  });
  tenureBadge = computed(() => ({ ok: 'verified', warn: 'pending', danger: 'rejected', neutral: 'draft' } as Record<string, string>)[this.tenureTone()]);
  tenureLabel = computed(() => {
    const all = this.tenure();
    if (all === null) return 'Loading';
    if (this.tenureTone() === 'ok') return 'Verified';
    if (all.some(t => t.status === 'pending')) return 'Waiting for verification';
    if (!all.length) return 'Not recorded';
    return all.some(t => t.status === 'verified') ? 'Not current' : 'Rejected';
  });
  tenureText = computed(() => {
    const all = this.tenure();
    if (all === null) return '';
    const v = this.current().find(t => t.status === 'verified');
    const pend = all.filter(t => t.status === 'pending').length;
    if (v) return `${humanize(v.kind)} from ${this.d(v.valid_from)}${v.valid_to ? ' to ' + this.d(v.valid_to) : ', open-ended'}.${pend ? ` ${pend} more waiting for verification.` : ''}`;
    if (pend) return `${pend} record${pend === 1 ? '' : 's'} waiting for a colleague to verify. Enrolment needs verified tenure.`;
    if (!all.length) return 'Add the ownership or lease documents in the Land tenure tab.';
    return 'No verified tenure covers today. Add a current record in the Land tenure tab.';
  });

  constructor() {
    effect(() => {
      const id = this.fieldId(); this.refresh();
      const projects = this.ctx.projects();
      const loaded = this.ctx.loaded();
      untracked(() => this.load(id, projects, loaded));
    });
  }

  private rank(s: string) { return s === 'fail' ? 0 : s === 'warn' ? 1 : 2; }
  private d(v: string) { return new Date(v + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }

  private load(fieldId: string, projects: ProjectLite[], loaded: boolean) {
    if (!loaded && !projects.length) { this.ctx.load(); return; }
    if (!projects.length) { this.enrolments.set([]); this.loading.set(false); return; }
    this.loading.set(true);
    forkJoin(projects.map(p => this.api.get<Enrolment[]>(`/projects/${p.id}/enrolments`).pipe(
      map(list => list.filter(e => e.field_id === fieldId).map(e => ({ e, project: p }))),
      catchError(() => of([] as { e: Enrolment; project: ProjectLite }[])),
    ))).subscribe(groups => {
      const order: Record<string, number> = { enrolled: 0, eligible: 1, ineligible: 2, withdrawn: 3 };
      this.enrolments.set(groups.flat().sort((a, b) => (order[a.e.status] ?? 9) - (order[b.e.status] ?? 9)));
      this.loading.set(false);
    });
  }
}
