import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { PeopleDirectory } from '../benefits/benefit-types';
import { apiMessage } from '../credits/credit-ui';
import { openEvidence, selfApprovalMessage, uploadEvidence } from '../households/lookups';
import { Doc, DocVersion, KINDS, Policy, RETENTION, kindIcon, kindLabel } from './doc-types';
import { RetentionPoliciesTab, RetentionReportTab } from './retention.tabs';

type Tab = 'documents' | 'retention' | 'policies';

@Component({
  selector: 'vc-documents-page',
  imports: [...KIT, FormsModule, DayPipe, RetentionReportTab, RetentionPoliciesTab],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Documents & retention" eyebrow="Administration"
      subtitle="Controlled documents — monitoring plans, procedures, contracts and reports — with every version fingerprinted, approved by a second person, and kept for as long as the rules require.">
      @if (canManage && tab() === 'documents') { <button actions class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New document</button> }
    </vc-page-header>

    @if (isClient) {
      <vcx-retention-report />
    } @else {
      <vc-tabs [tabs]="tabs" [active]="tab()" (activeChange)="setTab($any($event))" />
      @switch (tab()) {
        @case ('retention') { <vcx-retention-report (open)="openDoc($event)" /> }
        @case ('policies') { <vcx-retention-policies (changed)="loadPolicies()" /> }
        @default {
          <div class="filters">
            <div class="kinds">
              <button type="button" [class.on]="!kind()" (click)="kind.set('')">All <span class="c num">{{ all().length }}</span></button>
              @for (k of kinds; track k.key) {
                <button type="button" [class.on]="kind() === k.key" (click)="kind.set(k.key)"><vc-icon [name]="k.icon" [size]="13" />{{ k.label }}<span class="c num">{{ countKind(k.key) }}</span></button>
              }
            </div>
            <div class="search"><vc-icon name="search" [size]="15" /><input class="input" placeholder="Search title or code…" [ngModel]="q()" (ngModelChange)="q.set($event)" /></div>
            <label class="checkbox"><input type="checkbox" [ngModel]="showArchived()" (ngModelChange)="showArchived.set($event)" />Show archived</label>
          </div>
          <section class="card">
            @if (loading() && !all().length) { <vc-loading [rows]="6" /> }
            @else if (error()) { <div class="card-body"><vc-error title="Couldn't load documents" [message]="error()!" /></div> }
            @else if (!rows().length) {
              <vc-empty icon="file" [title]="all().length ? 'No matching documents' : 'No controlled documents yet'"
                [text]="all().length ? 'Try another kind or search.' : 'Start with the project monitoring plan: upload it, then ask a colleague to approve it.'">
                @if (!all().length && canManage) { <button class="btn btn-primary" (click)="openCreate('monitoring_plan')"><vc-icon name="plus" />Add monitoring plan</button> }
              </vc-empty>
            } @else {
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Document</th><th>Kind</th><th>Project</th><th>Classification</th><th>Version</th><th>Approval</th><th>Created</th><th></th></tr></thead>
                  <tbody>
                    @for (d of rows(); track d.id) {
                      <tr class="clickable" (click)="openDoc(d.id)">
                        <td><div class="dt"><span class="mono small subtle">{{ d.code }}</span><strong>{{ d.title }}</strong></div></td>
                        <td class="nowrap"><vc-icon [name]="icon(d.kind)" [size]="13" class="subtle" /> {{ kl(d.kind) }}</td>
                        <td class="small">{{ projectCode(d.project_id) }}</td>
                        <td><span class="cls" [class]="'c-' + d.classification">{{ d.classification }}</span></td>
                        <td class="mono">{{ d.current_version ? 'v' + d.current_version : '—' }}</td>
                        <td>@if (!d.current_version) { <span class="subtle small">No file yet</span> }
                          @else if (d.approved_version === d.current_version) { <vc-badge status="approved">Current approved</vc-badge> }
                          @else if (d.approved_version) { <vc-badge status="pending">v{{ d.current_version }} awaiting · v{{ d.approved_version }} approved</vc-badge> }
                          @else { <vc-badge status="pending">Awaiting approval</vc-badge> }
                          @if (d.status === 'archived') { <vc-badge status="archived" style="margin-left:4px" /> }</td>
                        <td class="nowrap subtle">{{ d.created_at | day }}</td>
                        <td class="num"><vc-icon name="chevron-right" class="subtle" /></td>
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

    <!-- detail -->
    <vc-modal [open]="!!sel() || detailLoading()" (closed)="sel.set(null); detailLoading.set(false)" [drawer]="true" width="min(720px, 100vw)"
      [title]="sel()?.title ?? 'Document'" [subtitle]="sel() ? sel()!.code + ' · ' + kl(sel()!.kind) : ''">
      @if (detailLoading() && !sel()) { <vc-loading [rows]="6" /> }
      @if (sel(); as d) {
        <div class="stack">
          @if (d.retention; as r) {
            <div class="ret" [class]="'r-' + r.status">
              <vc-icon name="archive" [size]="18" />
              <div><strong>{{ rmeta(r.status).label }}@if (r.retain_until) { · keep until {{ r.retain_until | day }} }</strong>
                <span class="small">{{ r.basis || r.reason }}@if (r.policy) { — {{ r.policy.source }} }</span></div>
            </div>
          }
          <dl class="kv">
            <dt>Classification</dt><dd><span class="cls" [class]="'c-' + d.classification">{{ d.classification }}</span></dd>
            <dt>Project</dt><dd>{{ projectCode(d.project_id) }}</dd>
            @if (d.entity_type) { <dt>Linked record</dt><dd>{{ d.entity_type }} <span class="mono small">{{ d.entity_id }}</span></dd> }
            <dt>Status</dt><dd><vc-badge [status]="d.status" /></dd>
            @if (d.description) { <dt>Description</dt><dd>{{ d.description }}</dd> }
          </dl>

          <section class="card">
            <div class="card-head"><h3>Versions</h3><span class="small subtle">Every file is kept; nothing is overwritten.</span></div>
            @for (v of versionsDesc(); track v.id) {
              <div class="ver" [class.cur]="v.version === d.current_version">
                <div class="vh">
                  <span class="vn mono">v{{ v.version }}</span>
                  <div class="vb"><strong>{{ v.change_note }}</strong><span class="small subtle">Uploaded by {{ people.name(v.created_by) }} · {{ v.created_at | day: true }}</span></div>
                  @if (v.approval; as a) { <vc-badge [status]="a.decision" /> } @else { <vc-badge status="pending">Awaiting review</vc-badge> }
                </div>
                <div class="vr">
                  <vc-hash [value]="v.sha256" />
                  <button class="btn btn-ghost btn-sm" (click)="openFile(v.evidence_id)"><vc-icon name="external" [size]="13" />Open file</button>
                </div>
                @if (v.approval; as a) { <p class="small muted">{{ a.decision === 'approved' ? 'Approved' : 'Rejected' }} by {{ people.name(a.by) }} on {{ a.at | day }}@if (a.note) { — “{{ a.note }}” }</p> }
                @else if (canApprove) {
                  @if (v.created_by === me) { <p class="small self">You uploaded this version, so a colleague must review it.</p> }
                  @else if (reviewing() === v.version) {
                    <div class="rv"><input class="input" [(ngModel)]="reviewNote" placeholder="Note (required to reject)" />
                      <button class="btn btn-secondary btn-sm" [disabled]="busy() || !reviewNote.trim()" (click)="decide(d, v, 'rejected')">Reject</button>
                      <button class="btn btn-primary btn-sm" [disabled]="busy()" (click)="decide(d, v, 'approved')"><vc-icon name="check" [size]="13" />Approve</button></div>
                  } @else { <div><button class="btn btn-secondary btn-sm" (click)="reviewing.set(v.version); reviewNote = ''">Review this version</button></div> }
                }
              </div>
            } @empty { <vc-empty icon="upload" title="No file uploaded yet" /> }
          </section>

          @if (canManage && d.status === 'active') {
            <section class="card card-pad nv">
              <h3>Upload a new version</h3>
              <vc-file-drop [(file)]="newFile" label="Choose the updated file" hint="PDF, Word, spreadsheet or image · stored with its fingerprint" />
              <div class="field"><label for="cn">What changed</label><input id="cn" class="input" [(ngModel)]="changeNote" placeholder="e.g. Updated sampling density after 2026 stratification" /></div>
              <div class="row"><span class="spacer"></span><button class="btn btn-primary" [disabled]="busy() || !newFile() || changeNote.trim().length < 3" (click)="addVersion(d)"><vc-icon name="upload" [size]="15" />{{ busy() ? 'Uploading…' : 'Add version' }}</button></div>
            </section>
          }
          @if (actionError()) { <vc-error title="Not done" [message]="actionError()!" /> }
        </div>
      }
      <ng-container footer>
        @if (sel(); as d) {
          @if (canManage) { <button class="btn btn-ghost" [disabled]="busy()" (click)="toggleArchive(d)">{{ d.status === 'active' ? 'Archive' : 'Restore' }}</button> }
          <span class="spacer"></span><button class="btn btn-secondary" (click)="sel.set(null)">Close</button>
        }
      </ng-container>
    </vc-modal>

    <!-- create -->
    <vc-modal [(open)]="createOpen" [drawer]="true" width="560px" title="New controlled document" subtitle="The first version needs approval by a colleague.">
      <div class="form-grid">
        <div class="field span-2"><label for="dt">Title</label><input id="dt" class="input" [(ngModel)]="f.title" placeholder="e.g. KRS-P1 monitoring plan" /></div>
        <div class="field"><label for="dk">Kind</label><select id="dk" class="input" [(ngModel)]="f.kind">@for (k of kinds; track k.key) { <option [value]="k.key">{{ k.label }}</option> }</select></div>
        <div class="field"><label for="dc">Classification</label><select id="dc" class="input" [(ngModel)]="f.classification"><option value="internal">Internal</option><option value="confidential">Confidential</option><option value="public">Public</option></select></div>
        <div class="field"><label for="dp">Project</label><select id="dp" class="input" [(ngModel)]="f.project_id"><option value="">Not project-specific</option>@for (p of ctx.projects(); track p.id) { <option [value]="p.id">{{ p.code }} · {{ p.name }}</option> }</select>
          <span class="hint">Needed for “after crediting ends” retention.</span></div>
        <div class="field"><label for="dco">Code <span class="subtle">(optional)</span></label><input id="dco" class="input mono" [(ngModel)]="f.code" placeholder="Generated, e.g. DOC-00012" /></div>
        <div class="field span-2"><label for="dr">Retention policy</label><select id="dr" class="input" [(ngModel)]="f.policy"><option value="">Use the policy for this kind</option>
          @for (p of activePolicies(); track p.id) { <option [value]="p.id">{{ kl(p.kind) }} · {{ p.years }} y {{ p.rule === 'after_crediting_end' ? 'after crediting ends' : 'after latest version' }}</option> }</select></div>
        <div class="field span-2"><label for="dd">Description</label><textarea id="dd" class="input" rows="3" [(ngModel)]="f.description"></textarea></div>
        <div class="field span-2"><label>First version</label><vc-file-drop [(file)]="firstFile" label="Upload the document" hint="Optional now — you can add it later" /></div>
        @if (formError()) { <div class="span-2"><vc-error title="Document not created" [message]="formError()!" /></div> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || f.title.trim().length < 3" (click)="create()">{{ busy() ? 'Saving…' : 'Create document' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .filters{display:flex;gap:12px;margin-bottom:14px;flex-wrap:wrap;align-items:center}
    .kinds{display:inline-flex;flex-wrap:wrap;background:var(--surface);border:1px solid var(--border-strong);border-radius:8px;padding:3px;gap:2px}
    .kinds button{border:0;background:none;font:500 13px var(--font);padding:6px 10px;border-radius:6px;color:var(--stone-600);cursor:pointer;display:inline-flex;gap:6px;align-items:center}
    .kinds button.on{background:var(--forest-50);color:var(--forest-700);box-shadow:inset 0 0 0 1px var(--forest-200)}
    .kinds .c{font-size:11px;color:var(--text-3)}
    .search{position:relative;min-width:220px;flex:1;max-width:320px}
    .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)} .search .input{padding-left:34px}
    .dt{display:flex;flex-direction:column;line-height:1.35}
    .cls{font-size:11.5px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;padding:2px 7px;border-radius:4px;background:var(--stone-100);color:var(--stone-600)}
    .cls.c-confidential{background:var(--red-100);color:var(--red-600)} .cls.c-public{background:var(--sky-100);color:var(--sky-600)}
    .ret{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border-radius:10px;background:var(--forest-50);color:var(--forest-800)}
    .ret div{display:flex;flex-direction:column;gap:2px}
    .ret.r-expiring{background:var(--amber-100);color:var(--amber-600)} .ret.r-expired{background:var(--stone-100);color:var(--stone-700)}
    .ret.r-undetermined,.ret.r-no_policy{background:var(--danger-soft);color:var(--red-600)}
    .ver{padding:12px 20px;border-bottom:1px solid var(--stone-100);display:flex;flex-direction:column;gap:8px}
    .ver.cur{background:var(--forest-50)}
    .vh{display:flex;gap:12px;align-items:flex-start} .vb{flex:1;display:flex;flex-direction:column}
    .vn{font-weight:600;font-size:12.5px;padding:2px 6px;border-radius:4px;background:var(--surface);border:1px solid var(--border)}
    .vr{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .rv{display:grid;grid-template-columns:1fr auto auto;gap:8px}
    .self{color:var(--amber-600)}
    .nv{display:flex;flex-direction:column;gap:12px;background:var(--surface-2)}
  `],
})
export class DocumentsPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  people = inject(PeopleDirectory);
  ctx = inject(ProjectContext);
  isClient = this.auth.profile()?.role === 'client_viewer';
  canManage = this.auth.can('programmes.manage');
  canApprove = this.auth.can('programmes.manage', 'rules.approve');
  me = this.auth.profile()?.id;
  kinds = KINDS;
  tabs = [{ key: 'documents', label: 'Documents' }, { key: 'retention', label: 'Retention report' }, { key: 'policies', label: 'Retention policies' }];
  tab = signal<Tab>((this.route.snapshot.queryParamMap.get('tab') as Tab) || 'documents');
  private report = viewChild(RetentionReportTab);

  all = signal<Doc[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  kind = signal('');
  q = signal('');
  showArchived = signal(false);
  policies = signal<Policy[]>([]);
  activePolicies = computed(() => this.policies().filter(p => p.status === 'active'));
  rows = computed(() => {
    const q = this.q().trim().toLowerCase();
    return this.all().filter(d => (this.showArchived() || d.status === 'active') && (!this.kind() || d.kind === this.kind()) &&
      (!q || `${d.code} ${d.title}`.toLowerCase().includes(q)));
  });
  private projectCodes = computed(() => new Map(this.ctx.projects().map(p => [p.id, p.code])));

  sel = signal<Doc | null>(null);
  detailLoading = signal(false);
  busy = signal(false);
  actionError = signal<string | null>(null);
  reviewing = signal<number | null>(null);
  reviewNote = '';
  newFile = signal<File | null>(null);
  changeNote = '';

  createOpen = signal(false);
  formError = signal<string | null>(null);
  firstFile = signal<File | null>(null);
  f = this.blank();
  versionsDesc = computed(() => [...(this.sel()?.versions ?? [])].sort((a, b) => b.version - a.version));

  constructor() {
    if (!this.isClient) {
      this.people.load();
      this.load();
      this.loadPolicies();
    }
  }
  setTab(t: Tab) { this.tab.set(t); this.router.navigate([], { queryParams: { tab: t }, replaceUrl: true }); }
  load() {
    this.loading.set(true);
    this.api.get<Doc[]>('/documents').subscribe({
      next: r => { this.all.set(r); this.loading.set(false); this.error.set(null); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
  loadPolicies() { this.api.get<Policy[]>('/documents/retention-policies').subscribe({ next: r => this.policies.set(r), error: () => {} }); }
  countKind(k: string) { return this.all().filter(d => d.kind === k && (this.showArchived() || d.status === 'active')).length; }
  kl = kindLabel;
  icon = kindIcon;
  rmeta(k: string) { return RETENTION[k] ?? { label: k, badge: k, hint: '' }; }
  projectCode(id: string | null) { return id ? this.projectCodes().get(id) ?? 'Project' : '—'; }
  openFile(id: string) { openEvidence(this.api, id).catch(e => this.toast.apiError(e, "Couldn't open the file")); }

  openDoc(id: string) {
    this.actionError.set(null);
    this.reviewing.set(null);
    this.newFile.set(null);
    this.changeNote = '';
    this.detailLoading.set(true);
    this.api.get<Doc>(`/documents/${id}`).subscribe({
      next: d => { this.sel.set(d); this.detailLoading.set(false); },
      error: (e: ApiError) => { this.detailLoading.set(false); this.toast.apiError(e, "Couldn't open the document"); },
    });
  }
  private refreshed(d: Doc, msg: string) {
    this.busy.set(false);
    this.sel.set(d);
    this.all.update(xs => xs.map(x => (x.id === d.id ? { ...x, ...d } : x)));
    this.toast.success(msg);
    this.report()?.load();
  }
  decide(d: Doc, v: DocVersion, decision: 'approved' | 'rejected') {
    this.busy.set(true);
    this.actionError.set(null);
    this.api.post<Doc>(`/documents/${d.id}/versions/${v.version}/approve`, { decision, note: this.reviewNote.trim() }).subscribe({
      next: r => { this.reviewing.set(null); this.refreshed(r, `Version ${v.version} ${decision}`); },
      error: (e: ApiError) => { this.busy.set(false); this.actionError.set(selfApprovalMessage(e, 'Approving a document version')); },
    });
  }
  addVersion(d: Doc) {
    const file = this.newFile();
    if (!file) return;
    this.busy.set(true);
    this.actionError.set(null);
    uploadEvidence(this.api, file, 'document', d.id).subscribe({
      next: ev => this.api.post<Doc>(`/documents/${d.id}/versions`, { evidence_id: ev.id, change_note: this.changeNote.trim() }).subscribe({
        next: r => { this.newFile.set(null); this.changeNote = ''; this.refreshed(r, `Version ${r.current_version} added`); },
        error: (e: ApiError) => { this.busy.set(false); this.actionError.set(apiMessage(e)); },
      }),
      error: (e: ApiError) => { this.busy.set(false); this.actionError.set(e.message); },
    });
  }
  toggleArchive(d: Doc) {
    this.busy.set(true);
    this.api.patch<Doc>(`/documents/${d.id}`, { status: d.status === 'active' ? 'archived' : 'active' }).subscribe({
      next: r => this.refreshed(r, r.status === 'archived' ? 'Document archived — its files are kept' : 'Document restored'),
      error: (e: ApiError) => { this.busy.set(false); this.actionError.set(apiMessage(e)); },
    });
  }

  private blank(kind = 'monitoring_plan') {
    return { title: '', kind, classification: 'internal', project_id: this.ctx.currentId() ?? '', code: '', policy: '', description: '' };
  }
  openCreate(kind?: string) { this.f = this.blank(kind ?? (this.kind() || 'monitoring_plan')); this.firstFile.set(null); this.formError.set(null); this.createOpen.set(true); }
  create() {
    this.busy.set(true);
    this.formError.set(null);
    const post = (evidenceId: string | null) => this.api.post<Doc>('/documents', {
      title: this.f.title.trim(), kind: this.f.kind, code: this.f.code.trim() || null, classification: this.f.classification,
      project_id: this.f.project_id || null, retention_policy_id: this.f.policy || null, description: this.f.description.trim(),
      evidence_id: evidenceId, change_note: 'First version',
    }).subscribe({
      next: d => { this.busy.set(false); this.createOpen.set(false); this.toast.success(`${d.code} created`, evidenceId ? 'Ask a colleague to approve the first version.' : 'Upload the first version when it is ready.'); this.load(); this.openDoc(d.id); },
      error: (e: ApiError) => { this.busy.set(false); this.formError.set(apiMessage(e)); },
    });
    const file = this.firstFile();
    if (file) uploadEvidence(this.api, file, 'document').subscribe({ next: ev => post(ev.id), error: (e: ApiError) => { this.busy.set(false); this.formError.set(e.message); } });
    else post(null);
  }
}
