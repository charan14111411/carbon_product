import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, ErrorBox, Loading, Modal } from '../../ui/kit';
import { CreatePack } from './create-pack';
import {
  Definitions, PackDetail, PackHead, PackRule, Readiness, RuleDefn, factorEntries, formatRuleValue, humanValue, isDemo,
} from './methodology-data';
import { RuleEditor } from './rule-editor';

interface ApproveProblem { code: string; message: string; labels: string[] }

@Component({
  selector: 'vc-pack-detail',
  imports: [FormsModule, RouterLink, Icon, Badge, Callout, DataClass, ErrorBox, Loading, Modal, RuleEditor, CreatePack, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/app/methodology" class="back"><vc-icon name="arrow-left" [size]="14" />All rule packs</a>

    @if (loading()) { <div class="card"><vc-loading [rows]="8" /></div> }
    @else if (error()) { <vc-error title="Couldn't load this rule pack" [message]="error()!" /> }
    @else if (pack(); as p) {
      <header class="hdr">
        <div class="t">
          <div class="eyebrow">Rule pack · revision {{ p.revision }}</div>
          <div class="row-t"><h1><span class="mono">{{ p.methodology_code }}</span> v{{ p.methodology_version }}</h1><vc-badge [status]="p.status" /></div>
          <p class="sub">{{ p.title }}</p>
          <div class="facts small">
            @if (p.source_url) { <a [href]="p.source_url" target="_blank" rel="noopener"><vc-icon name="external-link" [size]="13" />Published methodology</a> }
            @else { <span class="subtle"><vc-icon name="link" [size]="13" />No source link</span> }
            <span><span class="subtle">Created by</span> {{ p.created_by ?? '—' }} · {{ p.created_at | day }}</span>
            @if (p.approved_by) { <span><span class="subtle">Approved by</span> {{ p.approved_by }} · {{ p.approved_at | day: true }}</span> }
          </div>
        </div>
        <div class="actions">
          @if (p.status === 'approved' && canAssign()) {
            <button class="btn btn-secondary" (click)="assignOpen.set(true)"><vc-icon name="briefcase" />Assign to project</button>
          }
          @if (p.status !== 'draft' && auth.can('rules.edit')) {
            <button class="btn btn-secondary" (click)="revisionOpen.set(true)"><vc-icon name="branch" />New revision</button>
          }
          @if (p.status !== 'retired' && auth.can('rules.approve')) {
            <button class="btn btn-ghost" (click)="retireOpen.set(true)"><vc-icon name="archive" />Retire</button>
          }
        </div>
      </header>

      @if (demo()) {
        <vc-callout tone="danger" icon="alert" class="demo">
          <strong>Demonstration values.</strong> Some rules in this pack cite a <em>DEMO</em> source. They are placeholders for trying the platform —
          replace every one with the value from the published methodology, with its section and page, before any real calculation or credit issuance.
        </vc-callout>
      }
      @if (p.status === 'approved') {
        <div class="lock"><vc-icon name="lock" [size]="16" />
          <div><strong>Approved and frozen.</strong> Values can't be changed, so every calculation that used this pack stays reproducible. To change something, create a new revision based on it.</div>
        </div>
      } @else if (p.status === 'retired') {
        <div class="lock retired"><vc-icon name="archive" [size]="16" /><div><strong>Retired.</strong> Kept for the record; it can't be assigned to projects.</div></div>
      }

      <div class="top">
        <section class="card meter">
          <svg viewBox="0 0 120 120" class="ring" aria-hidden="true">
            <circle cx="60" cy="60" r="50" class="bg" />
            <circle cx="60" cy="60" r="50" class="fg" [class.done]="!readiness()?.outstanding?.length"
              [attr.stroke-dasharray]="dash()" transform="rotate(-90 60 60)" />
          </svg>
          <div class="ring-c">
            <div class="pct num">{{ pct() }}<small>%</small></div>
            <div class="small subtle">answered</div>
          </div>
          <div class="m-txt">
            <div class="m-h num"><strong>{{ readiness()?.answered ?? 0 }}</strong> of {{ readiness()?.total ?? 0 }} rules entered</div>
            @if (readiness()?.outstanding?.length) {
              <p class="m-s warn"><vc-icon name="alert" [size]="14" />{{ readiness()!.outstanding.length }} required rule{{ readiness()!.outstanding.length === 1 ? '' : 's' }} still missing</p>
              <div class="miss">
                @for (k of readiness()!.outstanding.slice(0, 6); track k) { <button type="button" class="mk" (click)="editKey(k)">{{ labelOf(k) }}</button> }
                @if (readiness()!.outstanding.length > 6) { <span class="subtle small">+{{ readiness()!.outstanding.length - 6 }} more</span> }
              </div>
            } @else {
              <p class="m-s ok"><vc-icon name="check-circle" [size]="14" />Every required rule is answered</p>
            }
          </div>
        </section>

        <section class="card approve">
          <div class="ap-h"><vc-icon name="shield-check" [size]="18" /><h3>Approval</h3></div>
          @if (p.status === 'approved') {
            <p>Approved by <strong>{{ p.approved_by }}</strong> on {{ p.approved_at | day: true }}. Created by {{ p.created_by }}.</p>
          } @else if (p.status === 'draft') {
            <p class="muted">Four-eyes rule: the person who approves must not have created the pack or entered or changed any of its values. Ask a colleague who wasn't involved to review the sources and approve.</p>
            <dl class="kv small">
              <dt>Created by</dt><dd>{{ p.created_by ?? '—' }}</dd>
              <dt>Values entered by</dt><dd>{{ editors().join(', ') || '—' }}</dd>
            </dl>
            @if (auth.can('rules.approve')) {
              <button class="btn btn-primary full" [disabled]="busy()" (click)="approveOpen.set(true)"><vc-icon name="verified" />Approve pack</button>
            } @else {
              <p class="subtle small">Only methodology owners can approve rule packs.</p>
            }
          } @else { <p class="muted">This pack is retired.</p> }
        </section>
      </div>

      <div class="filters">
        <div class="seg">
          <button type="button" [class.on]="show() === 'all'" (click)="show.set('all')">All rules</button>
          <button type="button" [class.on]="show() === 'missing'" (click)="show.set('missing')">Missing <span class="c">{{ readiness()?.outstanding?.length ?? 0 }}</span></button>
          <button type="button" [class.on]="show() === 'entered'" (click)="show.set('entered')">Entered</button>
        </div>
      </div>

      @for (g of groups(); track g.key) {
        @if (g.rows.length) {
          <section class="card group">
            <div class="card-head"><h3>{{ g.label }}</h3><span class="subtle small num">{{ g.answered }} / {{ g.total }}</span></div>
            <ul class="rules">
              @for (r of g.rows; track r.def.key) {
                <li class="rule" [class.missing]="r.missing" [class.clickable]="editable()" (click)="edit(r.def)">
                  <div class="r-main">
                    <div class="r-l">
                      <span class="r-label">{{ r.def.label }}</span>
                      @if (r.missing) { <span class="need">Required</span> }
                      @else if (!r.def.required && !r.def.required_if && !r.rule) { <span class="optl">Optional</span> }
                    </div>
                    <p class="r-help">{{ r.def.help }}</p>
                    @if (r.rule) {
                      <div class="r-src small">
                        <vc-icon name="book" [size]="12" />
                        <span [class.demo-src]="isDemoSrc(r.rule)">{{ r.rule.source_document }}</span>
                        @if (r.rule.source_section) { <span class="sep">·</span><span>{{ r.rule.source_section }}</span> }
                        @if (r.rule.source_page) { <span class="sep">·</span><span>p. {{ r.rule.source_page }}</span> }
                        <span class="by">entered by {{ r.rule.entered_by ?? '—' }}@if (r.rule.last_modified_by && r.rule.last_modified_by !== r.rule.entered_by) {, changed by {{ r.rule.last_modified_by }}}</span>
                      </div>
                    }
                  </div>
                  <div class="r-val">
                    @if (r.rule) {
                      @switch (r.def.kind) {
                        @case ('boolean') { <span class="bool" [class.yes]="r.rule.value === true">{{ r.rule.value ? 'Yes' : 'No' }}</span> }
                        @case ('list') { <div class="lst">@for (v of asList(r.rule.value); track v) { <span class="li">{{ human(v) }}</span> }</div> }
                        @case ('text') { <span class="txt">{{ r.rule.value }}</span> }
                        @case ('factors') {
                          <div class="facs">@for (f of factors(r.rule.value); track f.key) { <span class="fc"><code>{{ f.key }}</code><span class="num">{{ f.value }}</span></span> }<span class="u">tCO₂e per unit</span></div>
                        }
                        @default { <span class="v num">{{ fmt(r.rule.value, r.def.kind, '') }}</span>@if (r.def.unit) { <span class="u">{{ r.def.unit }}</span> } }
                      }
                      <vc-dc cls="RECORDED" />
                    } @else {
                      <span class="empty">{{ editable() ? 'Enter value' : 'Not entered' }}</span>
                    }
                  </div>
                  @if (editable()) { <vc-icon name="chevron-right" [size]="15" class="chev" /> }
                </li>
              }
            </ul>
          </section>
        }
      }

      <vc-rule-editor [(open)]="editorOpen" [packId]="p.id" [def]="editing()" [rule]="editingRule()" [allDefs]="allDefs()" [defaultDoc]="commonDoc()" (saved)="onSaved($event)" />

      <!-- approve -->
      <vc-modal [(open)]="approveOpen" title="Approve this rule pack?" width="540px">
        <p>Once approved, the pack is frozen: no value can change, and projects can use it for calculations. Please confirm you have checked each value against the published methodology.</p>
        @if (demo()) { <vc-callout tone="warn" icon="alert" class="mt">This pack still cites DEMO sources. Approving it is fine for trying the platform, not for real credits.</vc-callout> }
        @if (approveProblem(); as ap) {
          <vc-callout [tone]="ap.code === 'SELF_APPROVAL_REJECTED' ? 'warn' : 'danger'" [icon]="ap.code === 'SELF_APPROVAL_REJECTED' ? 'users' : 'alert'" class="mt">
            @if (ap.code === 'SELF_APPROVAL_REJECTED') {
              <strong>You can't approve this pack.</strong> You created it or entered or changed at least one of its values. The four-eyes rule needs someone else to check it — ask another methodology owner to approve.
            } @else if (ap.code === 'RULE_MISSING') {
              <strong>{{ ap.message }}</strong>
              <ul class="ml">@for (l of ap.labels; track l) { <li>{{ l }}</li> }</ul>
            } @else { {{ ap.message }} @if (ap.labels.length) { <ul class="ml">@for (l of ap.labels; track l) { <li>{{ l }}</li> }</ul> } }
          </vc-callout>
        }
        <div footer class="ft">
          <button class="btn btn-ghost" (click)="approveOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" [disabled]="busy()" (click)="approve()"><vc-icon name="verified" />{{ busy() ? 'Approving…' : 'Approve and freeze' }}</button>
        </div>
      </vc-modal>

      <!-- retire -->
      <vc-modal [(open)]="retireOpen" title="Retire this rule pack?" width="480px">
        <p>A retired pack is kept for the record but can't be edited or assigned. Projects using it must be moved to another pack first. This can't be undone.</p>
        @if (retireError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ retireError() }}</vc-callout> }
        <div footer class="ft">
          <button class="btn btn-ghost" (click)="retireOpen.set(false)">Cancel</button>
          <button class="btn btn-danger" [disabled]="busy()" (click)="retire()">Retire pack</button>
        </div>
      </vc-modal>

      <!-- assign -->
      <vc-modal [(open)]="assignOpen" title="Assign to a project" width="520px"
        subtitle="The project's calculations, sampling checks and quality rules will use this pack's values.">
        <div class="field">
          <label for="as-p">Project</label>
          <select id="as-p" class="input" [ngModel]="assignTo()" (ngModelChange)="assignTo.set($event)">
            <option value="">Choose a project…</option>
            @for (pr of ctx.projects(); track pr.id) {
              <option [value]="pr.id" [disabled]="pr.methodology_code !== p.methodology_code || pr.methodology_version !== p.methodology_version">
                {{ pr.code }} · {{ pr.name }} ({{ pr.methodology_code }} v{{ pr.methodology_version }})
              </option>
            }
          </select>
          <span class="hint">Only projects following {{ p.methodology_code }} v{{ p.methodology_version }} can use this pack.</span>
        </div>
        @if (assignError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ assignError() }}</vc-callout> }
        <div footer class="ft">
          <button class="btn btn-ghost" (click)="assignOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" [disabled]="!assignTo() || busy()" (click)="assign()">Assign pack</button>
        </div>
      </vc-modal>

      <vc-create-pack [(open)]="revisionOpen" [packs]="[p]" [from]="p" (created)="onRevision($event)" />
    }
  `,
  styles: [`
    .back{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-2);margin-bottom:14px}
    .back:hover{color:var(--forest-700);text-decoration:none}
    .hdr{display:flex;align-items:flex-end;gap:16px;margin-bottom:18px;flex-wrap:wrap}
    .t{flex:1;min-width:280px}
    .eyebrow{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--forest-500);margin-bottom:6px}
    .row-t{display:flex;align-items:center;gap:12px}
    .sub{margin-top:4px;color:var(--text-2)}
    .facts{display:flex;gap:16px;flex-wrap:wrap;margin-top:10px;color:var(--stone-700)}
    .facts a,.facts > span{display:inline-flex;gap:5px;align-items:center}
    .actions{display:flex;gap:8px;flex-wrap:wrap}
    .demo{margin-bottom:14px}
    .lock{display:flex;gap:12px;align-items:flex-start;padding:12px 16px;border-radius:var(--radius);background:var(--forest-800);color:#e6efe9;margin-bottom:16px;font-size:13.5px}
    .lock vc-icon{color:var(--forest-300);margin-top:2px}
    .lock.retired{background:var(--stone-700)}
    .top{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(300px,1fr);gap:16px;margin-bottom:18px}
    @media (max-width: 1000px){.top{grid-template-columns:1fr}}
    .meter{position:relative;display:flex;align-items:center;gap:24px;padding:22px 24px}
    .ring{width:128px;height:128px;flex:none}
    .ring .bg{fill:none;stroke:var(--sand-200);stroke-width:10}
    .ring .fg{fill:none;stroke:var(--amber-600);stroke-width:10;stroke-linecap:round;transition:stroke-dasharray .6s ease}
    .ring .fg.done{stroke:var(--forest-500)}
    .ring-c{position:absolute;left:24px;width:128px;text-align:center}
    .pct{font-size:30px;font-weight:600;letter-spacing:-.02em;line-height:1} .pct small{font-size:14px;color:var(--text-3)}
    .m-txt{flex:1;min-width:0}
    .m-h{font-size:16px}
    .m-s{display:flex;gap:6px;align-items:center;margin-top:6px;font-size:13px}
    .m-s.warn{color:var(--amber-600)} .m-s.ok{color:var(--forest-600)}
    .miss{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
    .mk{height:26px;padding:0 9px;border-radius:6px;border:1px solid #f1dcae;background:var(--warn-soft);color:var(--stone-800);font:inherit;font-size:12px;cursor:pointer}
    .mk:hover{border-color:var(--amber-600)}
    .approve{padding:18px 20px;display:flex;flex-direction:column;gap:10px}
    .ap-h{display:flex;gap:8px;align-items:center;color:var(--forest-600)} .ap-h h3{color:var(--stone-900)}
    .approve .kv{grid-template-columns:auto 1fr}
    .full{width:100%;margin-top:auto}
    .filters{display:flex;gap:12px;margin-bottom:12px}
    .seg{display:inline-flex;padding:3px;border-radius:8px;background:var(--sand-200);gap:2px}
    .seg button{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border:0;border-radius:6px;background:none;font:500 12.5px var(--font);color:var(--stone-600);cursor:pointer}
    .seg button.on{background:var(--surface);color:var(--stone-900);box-shadow:var(--shadow-sm)}
    .seg .c{font-size:11px;padding:0 6px;border-radius:9px;background:var(--amber-100);color:var(--amber-600)}
    .group{margin-bottom:14px;overflow:hidden}
    .rules{list-style:none;margin:0;padding:0}
    .rule{display:flex;gap:20px;align-items:center;padding:14px 20px;border-bottom:1px solid var(--stone-100)}
    .rule:last-child{border-bottom:0}
    .rule.clickable{cursor:pointer} .rule.clickable:hover{background:var(--forest-50)}
    .rule.missing{background:linear-gradient(90deg,var(--warn-soft),transparent 40%)}
    .rule.missing.clickable:hover{background:linear-gradient(90deg,#f7e5bd,var(--forest-50) 40%)}
    .r-main{flex:1;min-width:0}
    .r-l{display:flex;gap:8px;align-items:center}
    .r-label{font-weight:500}
    .need{font-size:11px;font-weight:600;padding:1px 7px;border-radius:999px;background:var(--amber-100);color:var(--amber-600)}
    .optl{font-size:11px;padding:1px 7px;border-radius:999px;background:var(--stone-100);color:var(--stone-500)}
    .r-help{font-size:12.5px;color:var(--text-2);margin-top:2px}
    .r-src{display:flex;gap:5px;align-items:center;flex-wrap:wrap;margin-top:6px;color:var(--stone-600)}
    .r-src .sep{color:var(--stone-300)}
    .r-src .by{color:var(--text-3);margin-left:6px}
    .demo-src{color:var(--red-600);font-weight:500}
    .r-val{display:flex;align-items:center;gap:8px;justify-content:flex-end;min-width:180px;max-width:320px;flex-wrap:wrap}
    .v{font-size:16px;font-weight:600} .u{font-size:12.5px;color:var(--text-3)}
    .bool{font-weight:600;padding:3px 10px;border-radius:6px;background:var(--stone-100);color:var(--stone-700)}
    .bool.yes{background:var(--forest-100);color:var(--forest-700)}
    .lst{display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end}
    .li{font-size:12px;padding:2px 8px;border-radius:5px;background:var(--sand-100);border:1px solid var(--border)}
    .facs{display:flex;flex-direction:column;gap:3px;align-items:flex-end}
    .fc{display:inline-flex;gap:8px;align-items:center;font-size:12px;padding:2px 8px;border-radius:5px;background:var(--sand-100);border:1px solid var(--border)}
    .fc code{font-size:11.5px;color:var(--stone-600)} .fc .num{font-weight:600}
    .txt{font-size:12.5px;color:var(--stone-700);text-align:right}
    .empty{font-size:12.5px;color:var(--text-3);font-style:italic}
    .chev{color:var(--stone-400)}
    .mt{margin-top:14px} .ml{margin:6px 0 0;padding-left:18px}
    .ft{display:flex;gap:8px}
  `],
})
export class PackDetailPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  id = input.required<string>();

  pack = signal<PackDetail | null>(null);
  readiness = signal<Readiness | null>(null);
  defs = signal<Definitions | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  show = signal<'all' | 'missing' | 'entered'>('all');
  busy = signal(false);

  editorOpen = signal(false);
  editing = signal<RuleDefn | null>(null);
  approveOpen = signal(false);
  approveProblem = signal<ApproveProblem | null>(null);
  retireOpen = signal(false);
  retireError = signal<string | null>(null);
  assignOpen = signal(false);
  assignTo = signal('');
  assignError = signal<string | null>(null);
  revisionOpen = signal(false);

  editable = computed(() => this.pack()?.status === 'draft' && this.auth.can('rules.edit'));
  canAssign = computed(() => this.auth.can('rules.edit', 'programmes.manage'));
  demo = computed(() => isDemo(this.pack()));
  allDefs = computed(() => (this.defs()?.groups ?? []).flatMap(g => g.rules));
  editingRule = computed(() => this.pack()?.rules.find(r => r.key === this.editing()?.key) ?? null);
  editors = computed(() => [...new Set((this.pack()?.rules ?? []).flatMap(r => [r.entered_by, r.last_modified_by]).filter((x): x is string => !!x))]);
  commonDoc = computed(() => {
    const counts = new Map<string, number>();
    for (const r of this.pack()?.rules ?? []) counts.set(r.source_document, (counts.get(r.source_document) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
  });
  pct = computed(() => { const r = this.readiness(); return r && r.total ? Math.round((r.answered / r.total) * 100) : 0; });
  dash = computed(() => { const c = 2 * Math.PI * 50; return `${(c * this.pct()) / 100} ${c}`; });
  groups = computed(() => {
    const byKey = new Map((this.pack()?.rules ?? []).map(r => [r.key, r]));
    const out = new Set(this.readiness()?.outstanding ?? []);
    return (this.defs()?.groups ?? []).map(g => {
      const all = g.rules.map(def => ({ def, rule: byKey.get(def.key) ?? null, missing: out.has(def.key) }));
      const rows = all.filter(r => this.show() === 'all' || (this.show() === 'missing' ? r.missing : !!r.rule));
      return { key: g.key, label: g.label, rows, total: all.length, answered: all.filter(r => r.rule).length };
    });
  });

  constructor() {
    this.api.get<Definitions>('/methodology/definitions').subscribe({ next: d => this.defs.set(d), error: (e: ApiError) => this.error.set(e.message) });
    effect(() => { const id = this.id(); untracked(() => this.load(id)); });
  }

  load(id: string) {
    this.loading.set(!this.pack());
    this.api.get<PackDetail>(`/rule-packs/${id}`).subscribe({
      next: p => { this.pack.set(p); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
    this.loadReadiness(id);
  }
  private loadReadiness(id = this.id()) {
    this.api.get<Readiness>(`/rule-packs/${id}/readiness`).subscribe({ next: r => this.readiness.set(r) });
  }

  labelOf(k: string) { return this.allDefs().find(d => d.key === k)?.label ?? k; }
  human = humanValue;
  fmt = formatRuleValue;
  factors = factorEntries;
  asList(v: unknown): string[] { return Array.isArray(v) ? v.map(String) : [String(v)]; }
  isDemoSrc(r: PackRule) { return /demo/i.test(r.source_document ?? ''); }

  edit(d: RuleDefn) {
    if (!this.editable()) return;
    this.editing.set(d);
    this.editorOpen.set(true);
  }
  editKey(k: string) { const d = this.allDefs().find(x => x.key === k); if (d) this.edit(d); }

  onSaved(p: PackDetail) {
    this.pack.set(p);
    this.loadReadiness();
    this.toast.success('Rule saved', this.editing()?.label);
  }

  approve() {
    this.busy.set(true);
    this.approveProblem.set(null);
    this.api.post<PackDetail>(`/rule-packs/${this.id()}/approve`).subscribe({
      next: p => { this.busy.set(false); this.pack.set(p); this.approveOpen.set(false); this.loadReadiness(); this.toast.success(`${p.label} approved`, 'The pack is now frozen and can be assigned to projects.'); },
      error: (e: ApiError) => {
        this.busy.set(false);
        const labels = (e.details['labels'] as string[] | undefined) ??
          Object.entries((e.details['invalid'] as Record<string, string> | undefined) ?? {}).map(([k, m]) => `${this.labelOf(k)}: ${m}`);
        this.approveProblem.set({ code: e.code, message: e.message, labels });
      },
    });
  }

  retire() {
    this.busy.set(true);
    this.retireError.set(null);
    this.api.post<PackDetail>(`/rule-packs/${this.id()}/retire`).subscribe({
      next: p => { this.busy.set(false); this.pack.set(p); this.retireOpen.set(false); this.toast.success(`${p.label} retired`); },
      error: (e: ApiError) => {
        this.busy.set(false);
        const projects = e.details['projects'] as string[] | undefined;
        this.retireError.set(projects?.length ? `${e.message} (${projects.join(', ')})` : e.message);
      },
    });
  }

  assign() {
    this.busy.set(true);
    this.assignError.set(null);
    this.api.post<{ label: string }>(`/projects/${this.assignTo()}/rule-pack`, { pack_id: this.id() }).subscribe({
      next: r => {
        this.busy.set(false); this.assignOpen.set(false);
        const pr = this.ctx.projects().find(x => x.id === this.assignTo());
        this.toast.success('Rule pack assigned', `${pr?.code ?? 'The project'} now uses ${r.label}.`);
      },
      error: (e: ApiError) => { this.busy.set(false); this.assignError.set(e.message); },
    });
  }

  onRevision(p: PackHead) {
    this.toast.success(`${p.label} created`, 'Values were copied. Update what changed, then ask a colleague to approve.');
    this.router.navigate(['/app/methodology', p.id]);
  }
}
