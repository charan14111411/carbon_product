import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe, HumanPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, Empty, ErrorBox, Hash, Loading, Modal, PageHeader, TabItem, Tabs } from '../../ui/kit';
import { People, saveBlob } from '../calculations/calc.types';
import { Integrity, PACKAGE_SECTIONS, Package, VerifierAccess, VerifierQuery } from './verification.types';

@Component({
  selector: 'vc-package-detail',
  imports: [FormsModule, RouterLink, PageHeader, Icon, Badge, DataClass, Hash, Empty, ErrorBox, Loading, Modal, Callout, Tabs, NumPipe, DayPipe, AgoPipe, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/app/verification" class="back"><vc-icon name="arrow-left" [size]="14" />All packages</a>

    @if (loading()) {
      <section class="card"><vc-loading [rows]="6" /></section>
    } @else if (error()) {
      <vc-error title="Couldn't load this package" [message]="error()!" />
    } @else if (pkg(); as p) {
      <vc-page-header [title]="'Verification package v' + p.version" eyebrow="Verification"
        [subtitle]="p.summary.project_code + ' · period ' + p.summary.period_label + ' · issued by ' + p.summary.generated_by + ' on ' + (p.created_at | day)">
        <button actions class="btn btn-secondary" (click)="download('json')"><vc-icon name="file-json" />Package JSON</button>
        @if (p.pdf_file_id) { <button actions class="btn btn-secondary" (click)="download('pdf')"><vc-icon name="download" />PDF report</button> }
      </vc-page-header>

      <div class="top">
        <section class="card seal">
          <div class="seal-h">
            <span class="si"><vc-icon name="stamp" [size]="20" /></span>
            <div>
              <div class="ey">Package fingerprint (SHA-256)</div>
              <vc-hash [value]="p.sha256" [full]="true" />
            </div>
          </div>
          <div class="seal-b">
            @switch (integrityState()) {
              @case ('intact') {
                <div class="res ok"><vc-icon name="shield-check" [size]="18" /><div><strong>Intact</strong><span>The stored JSON and PDF match the fingerprint recorded at issue. Checked {{ checkedAt() | ago }}.</span></div></div>
              }
              @case ('tampered') {
                <div class="res bad"><vc-icon name="shield-alert" [size]="18" /><div><strong>Tamper alert</strong>
                  <span>The stored package does not match its fingerprint.
                    JSON file {{ integrity()?.json_file_intact ? 'intact' : 'altered' }}@if (integrity()?.pdf_file_intact !== null) {, PDF {{ integrity()?.pdf_file_intact ? 'intact' : 'altered' }}}.
                    Recomputed: <code>{{ (integrity()?.recomputed_sha256 ?? 'unreadable').slice(0, 16) }}…</code></span></div></div>
              }
              @default {
                <p class="muted small">Recompute the fingerprint from the stored files to prove nothing has changed since the package was issued.</p>
              }
            }
            <button class="btn btn-secondary btn-sm" [disabled]="integrityState() === 'checking'" (click)="check()">
              <vc-icon name="shield" [size]="14" />{{ integrityState() === 'checking' ? 'Checking…' : 'Check integrity' }}
            </button>
          </div>
          <div class="seal-f small subtle">
            Content fingerprint <code>{{ p.summary.content_sha256.slice(0, 16) }}…</code> — identical evidence always gives the same content fingerprint, whichever version it is in.
          </div>
        </section>

        <section class="card head">
          <div class="hl"><span>Net credits</span><vc-dc cls="CALCULATED" /></div>
          <div class="hv num">{{ p.summary.net_credits_t_co2e | num: 1 }}<small>tCO₂e</small></div>
          <dl class="kv small">
            <dt>Reductions</dt><dd class="num">{{ p.summary.reductions_t_co2e | num: 1 }} t</dd>
            <dt>Removals</dt><dd class="num">{{ p.summary.removals_t_co2e | num: 1 }} t</dd>
            <dt>Uncertainty deduction</dt><dd class="num">{{ p.summary.uncertainty_deduction_t_co2e | num: 1 }} t</dd>
            <dt>Buffer</dt><dd class="num">{{ p.summary.buffer_t_co2e | num: 1 }} t</dd>
          </dl>
          <a class="small" [routerLink]="['/app/calculations', p.run_id]">Open the calculation run →</a>
        </section>
      </div>

      <vc-tabs [tabs]="tabs()" [(active)]="tab" />

      @switch (tab()) {
        @case ('contents') {
          <section class="card">
            <div class="card-head"><h3>What the package contains</h3>
              <span class="subtle small">{{ p.summary.samples }} samples · {{ p.summary.lab_results }} lab results · {{ p.summary.documents }} referenced files</span>
            </div>
            @if (contentsError()) { <div class="card-body"><vc-error title="Couldn't read the package file" [message]="contentsError()!" /></div> }
            <ol class="secs">
              @for (s of sections; track s.key; let i = $index) {
                <li>
                  <span class="sn num">{{ i + 1 }}</span>
                  <div class="st"><strong>{{ s.label }}</strong><span>{{ s.text }}</span></div>
                  <span class="sc num">
                    @if (sectionCounts(); as c) { {{ c[s.key] ?? '—' }} } @else { <span class="subtle">…</span> }
                  </span>
                </li>
              }
            </ol>
          </section>
        }

        @case ('access') {
          <section class="card">
            <div class="card-head">
              <h3>Verifier access</h3>
              <span class="subtle small">Time-limited, read-only links. No sign-in needed; every opening is logged.</span>
              @if (canIssue()) { <button class="btn btn-primary btn-sm" (click)="startGrant()"><vc-icon name="user-plus" [size]="14" />Give access</button> }
            </div>
            @if (accessLoading()) { <vc-loading [rows]="3" /> }
            @else if (accessError()) { <div class="card-body"><vc-error title="Couldn't load access" [message]="accessError()!" /></div> }
            @else if (!access().length) {
              <vc-empty icon="key" title="No verifier has access yet" text="Create a link for the validation and verification body. You'll see it once, so copy it before closing.">
                @if (canIssue()) { <button class="btn btn-primary" (click)="startGrant()"><vc-icon name="user-plus" />Give access</button> }
              </vc-empty>
            } @else {
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Verifier</th><th>Organisation</th><th>Link</th><th>Expires</th><th>Last opened</th><th>Review</th><th></th></tr></thead>
                  <tbody>
                    @for (a of access(); track a.id) {
                      <tr>
                        <td><strong>{{ a.verifier_name }}</strong><div class="subtle small">{{ a.verifier_email }}</div></td>
                        <td>{{ a.organisation || '—' }}</td>
                        <td><vc-badge [status]="linkTone(a.link_status)">{{ a.link_status | human }}</vc-badge></td>
                        <td class="nowrap">{{ a.expires_at | day: true }}</td>
                        <td class="nowrap">@if (a.last_opened_at) { <span [title]="a.last_opened_at | day: true">{{ a.last_opened_at | ago }}</span> } @else { <span class="subtle">Never</span> }</td>
                        <td><vc-badge [status]="a.review_status" /></td>
                        <td class="num">
                          @if (canIssue() && a.link_status === 'active') {
                            <button class="btn btn-ghost btn-sm dang" (click)="revoking.set(a)"><vc-icon name="ban" [size]="14" />Revoke</button>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </section>
        }

        @case ('queries') {
          @for (d of decisions(); track d.id) {
            <vc-callout [tone]="d.subject_id === 'verified' ? 'ok' : 'warn'" [icon]="d.subject_id === 'verified' ? 'verified' : 'flag'" class="dec">
              <strong>{{ accessName(d.access_id) }} concluded the review: {{ d.subject_id === 'verified' ? 'verified' : 'findings raised' }}</strong>
              <span class="subtle small"> · {{ d.created_at | day: true }}</span>
              @if (d.question && d.question !== d.subject_id) { <p class="dq">“{{ d.question }}”</p> }
            </vc-callout>
          }
          <section class="card">
            <div class="card-head"><h3>Questions from verifiers</h3><span class="subtle small">{{ openCount() }} open</span></div>
            @if (queriesLoading()) { <vc-loading [rows]="4" /> }
            @else if (queriesError()) { <div class="card-body"><vc-error title="Couldn't load questions" [message]="queriesError()!" /></div> }
            @else if (!questions().length) {
              <vc-empty icon="message" title="No questions yet" text="Questions a verifier raises on any item in the package appear here for your team to answer." />
            } @else {
              <ul class="qs">
                @for (q of questions(); track q.id) {
                  <li [class.open]="q.status === 'open'">
                    <div class="qh">
                      <vc-badge [status]="q.status" />
                      <span class="qsubj">{{ subject(q) }}</span>
                      <span class="spacer"></span>
                      <span class="subtle small">{{ accessName(q.access_id) }} · {{ q.created_at | ago }}</span>
                    </div>
                    <p class="qq">{{ q.question }}</p>
                    @if (q.answer) {
                      <div class="qa"><vc-icon name="reply" [size]="14" /><div><p>{{ q.answer }}</p><span class="subtle small">{{ q.answered_by ?? 'Project team' }} · {{ q.answered_at | day: true }}</span></div></div>
                    } @else if (canAnswer()) {
                      <div class="qf">
                        <textarea class="input" rows="2" [ngModel]="drafts()[q.id] ?? ''" (ngModelChange)="setDraft(q.id, $event)" placeholder="Write an answer the verifier will see…"></textarea>
                        <button class="btn btn-primary btn-sm" [disabled]="(drafts()[q.id] ?? '').trim().length < 2 || answering() === q.id" (click)="answer(q)">
                          <vc-icon name="send" [size]="14" />{{ answering() === q.id ? 'Sending…' : 'Send answer' }}
                        </button>
                      </div>
                    }
                  </li>
                }
              </ul>
            }
          </section>
        }
      }

      <!-- grant -->
      <vc-modal [(open)]="grantOpen" [title]="granted() ? 'Share this link now' : 'Give a verifier access'"
        [subtitle]="granted() ? '' : 'The verifier gets a read-only workspace for this package only.'" width="600px" (closed)="afterGrantClose()">
        @if (granted(); as g) {
          <vc-callout tone="warn" icon="alert"><strong>This link is shown only once.</strong> We store only a fingerprint of it, so it can't be recovered. Copy it and send it to {{ g.name }} through a secure channel.</vc-callout>
          <div class="link">
            <code>{{ g.link }}</code>
            <button class="btn btn-primary btn-sm" (click)="copy(g.link)"><vc-icon [name]="copied() ? 'check' : 'copy'" [size]="14" />{{ copied() ? 'Copied' : 'Copy link' }}</button>
          </div>
          <p class="small muted">Valid until {{ g.expires | day: true }}. You can revoke it at any time from this page.</p>
        } @else {
          <div class="form-grid">
            <div class="field"><label>Verifier name</label><input class="input" [(ngModel)]="g.verifier_name" placeholder="Full name" /></div>
            <div class="field"><label>Email</label><input class="input" type="email" [(ngModel)]="g.verifier_email" placeholder="name@vvb.example" /></div>
            <div class="field"><label>Organisation</label><input class="input" [(ngModel)]="g.organisation" placeholder="Validation and verification body" /></div>
            <div class="field"><label>Access for (days)</label><input class="input num" type="number" min="1" max="90" [(ngModel)]="g.days" /><span class="hint">1 to 90 days.</span></div>
            @if (grantError()) { <div class="span-2"><vc-error title="Couldn't create the link" [message]="grantError()!" /></div> }
          </div>
        }
        <ng-container footer>
          @if (granted()) {
            <button class="btn btn-primary" (click)="grantOpen.set(false); afterGrantClose()">Done</button>
          } @else {
            <button class="btn btn-ghost" (click)="grantOpen.set(false)">Cancel</button>
            <button class="btn btn-primary" [disabled]="busy() || !grantValid()" (click)="grant()"><vc-icon name="key" />{{ busy() ? 'Creating…' : 'Create link' }}</button>
          }
        </ng-container>
      </vc-modal>

      <!-- revoke -->
      <vc-modal [open]="!!revoking()" (closed)="revoking.set(null)" title="Revoke verifier access" width="480px">
        @if (revoking(); as a) {
          <p>{{ a.verifier_name }} ({{ a.organisation || a.verifier_email }}) will lose access immediately. Their questions and any decision stay on record.</p>
          <p class="small muted mt">This can't be undone; you can create a new link later if needed.</p>
        }
        <ng-container footer>
          <button class="btn btn-ghost" (click)="revoking.set(null)">Cancel</button>
          <button class="btn btn-danger" [disabled]="busy()" (click)="revoke()"><vc-icon name="ban" />Revoke access</button>
        </ng-container>
      </vc-modal>
    }
  `,
  styles: [`
    .back{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-2);margin-bottom:12px}
    .top{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(280px,1fr);gap:16px;margin-bottom:20px;align-items:start}
    @media (max-width: 1000px){.top{grid-template-columns:1fr}}
    .seal{display:flex;flex-direction:column}
    .seal-h{display:flex;gap:14px;align-items:flex-start;padding:18px 20px}
    .seal-h vc-hash{margin-top:6px;word-break:break-all}
    .si{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:10px;background:var(--forest-100);color:var(--forest-700)}
    .ey{font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--text-3)}
    .seal-b{display:flex;gap:16px;align-items:center;padding:0 20px 16px}
    .seal-b > :first-child{flex:1}
    .res{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border-radius:var(--radius-sm);flex:1}
    .res div{display:flex;flex-direction:column;font-size:13px} .res span{color:var(--stone-700)}
    .res.ok{background:var(--ok-soft);color:var(--forest-700)} .res.bad{background:var(--danger-soft);color:var(--red-600)}
    .seal-f{margin-top:auto;padding:12px 20px;border-top:1px solid var(--border);background:var(--surface-2);border-radius:0 0 var(--radius) var(--radius)}
    .head{padding:18px 20px;display:flex;flex-direction:column;gap:10px}
    .hl{display:flex;align-items:center;justify-content:space-between;font-size:13px;color:var(--text-2);font-weight:500}
    .hv{font-size:30px;font-weight:600;letter-spacing:-.02em}
    .hv small{font-size:13px;color:var(--text-3);margin-left:6px;font-weight:500}
    .secs{list-style:none;margin:0;padding:6px 20px 14px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 28px}
    @media (max-width: 1000px){.secs{grid-template-columns:1fr}}
    .secs li{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--stone-100)}
    .sn{flex:none;width:24px;height:24px;border-radius:6px;background:var(--sand-100);display:grid;place-items:center;font-size:11.5px;color:var(--stone-600)}
    .st{flex:1;min-width:0;display:flex;flex-direction:column} .st strong{font-weight:500} .st span{font-size:12.5px;color:var(--text-2)}
    .sc{font-weight:500;color:var(--stone-700)}
    .dang{color:var(--red-600)}
    .dec{display:flex;margin-bottom:12px} .dq{margin-top:6px;color:var(--stone-700)}
    .qs{list-style:none;margin:0;padding:0}
    .qs li{padding:16px 20px;border-bottom:1px solid var(--stone-100)}
    .qs li:last-child{border-bottom:0}
    .qs li.open{box-shadow:inset 3px 0 0 var(--amber-600)}
    .qh{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .qsubj{font-size:12.5px;color:var(--text-2);font-family:var(--mono)}
    .spacer{flex:1}
    .qq{margin-top:8px;font-size:14px;color:var(--text);white-space:pre-wrap}
    .qa{display:flex;gap:10px;margin-top:10px;padding:10px 12px;border-radius:var(--radius-sm);background:var(--surface-2);border:1px solid var(--border);color:var(--text-3)}
    .qa p{color:var(--stone-800);white-space:pre-wrap}
    .qf{display:flex;gap:10px;align-items:flex-end;margin-top:10px}
    .qf textarea{min-height:60px}
    .link{display:flex;gap:10px;align-items:center;margin:16px 0 10px;padding:10px 12px;border:1px dashed var(--forest-400);border-radius:var(--radius-sm);background:var(--forest-50)}
    .link code{flex:1;word-break:break-all;font-size:12px}
    .mt{margin-top:8px}
  `],
})
export class PackageDetailPage {
  id = input.required<string>();
  private api = inject(ApiService);
  private toast = inject(ToastService);
  auth = inject(AuthService);
  people = inject(People);

  pkg = signal<Package | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  tab = signal('contents');
  sections = PACKAGE_SECTIONS;

  integrity = signal<Integrity | null>(null);
  integrityState = signal<'idle' | 'checking' | 'intact' | 'tampered'>('idle');
  checkedAt = signal<string | null>(null);

  sectionCounts = signal<Record<string, number> | null>(null);
  contentsError = signal<string | null>(null);

  access = signal<VerifierAccess[]>([]);
  accessLoading = signal(true);
  accessError = signal<string | null>(null);
  queries = signal<VerifierQuery[]>([]);
  queriesLoading = signal(true);
  queriesError = signal<string | null>(null);
  drafts = signal<Record<string, string>>({});
  answering = signal<string | null>(null);

  grantOpen = signal(false);
  granted = signal<{ link: string; name: string; expires: string } | null>(null);
  grantError = signal<string | null>(null);
  copied = signal(false);
  busy = signal(false);
  revoking = signal<VerifierAccess | null>(null);
  g = { verifier_name: '', verifier_email: '', organisation: '', days: 30 };

  canIssue = computed(() => this.auth.can('package.issue'));
  canAnswer = computed(() => this.auth.can('package.issue', 'calc.run'));
  questions = computed(() => this.queries().filter(q => q.subject_type !== 'decision'));
  decisions = computed(() => this.queries().filter(q => q.subject_type === 'decision'));
  openCount = computed(() => this.questions().filter(q => q.status === 'open').length);
  tabs = computed<TabItem[]>(() => [
    { key: 'contents', label: 'Contents' },
    { key: 'access', label: 'Verifier access', count: this.accessLoading() ? null : this.access().length },
    { key: 'queries', label: 'Queries', count: this.queriesLoading() ? null : this.openCount() },
  ]);

  constructor() {
    this.people.load();
    effect(() => { if (this.id()) this.load(); });
  }

  load() {
    const id = this.id();
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Package>(`/packages/${id}`).subscribe({
      next: p => { this.pkg.set(p); this.loading.set(false); this.loadContents(p); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
    this.loadAccess();
    this.loadQueries();
  }

  private loadContents(p: Package) {
    this.api.blob(`/evidence/${p.json_file_id}/content`).subscribe({
      next: async b => {
        try {
          const doc = JSON.parse(await b.text()) as Record<string, unknown>;
          const c: Record<string, number> = {};
          for (const s of PACKAGE_SECTIONS) {
            const v = doc[s.key];
            c[s.key] = Array.isArray(v) ? v.length : v && typeof v === 'object' ? Object.keys(v).length : 0;
          }
          const meth = doc['methodology'] as { rules?: unknown[] } | undefined;
          if (meth?.rules) c['methodology'] = meth.rules.length;
          this.sectionCounts.set(c);
        } catch {
          this.contentsError.set('The package file could not be parsed.');
        }
      },
      error: (e: ApiError) => this.contentsError.set(e.message),
    });
  }

  loadAccess() {
    this.accessLoading.set(true);
    this.accessError.set(null);
    this.api.get<VerifierAccess[]>(`/packages/${this.id()}/verifier-access`).subscribe({
      next: a => { this.access.set(a); this.accessLoading.set(false); },
      error: (e: ApiError) => { this.accessError.set(e.message); this.accessLoading.set(false); },
    });
  }

  loadQueries() {
    this.queriesLoading.set(true);
    this.queriesError.set(null);
    this.api.get<VerifierQuery[]>(`/packages/${this.id()}/queries`).subscribe({
      next: q => { this.queries.set([...q].reverse()); this.queriesLoading.set(false); },
      error: (e: ApiError) => { this.queriesError.set(e.message); this.queriesLoading.set(false); },
    });
  }

  check() {
    this.integrityState.set('checking');
    this.api.get<Integrity>(`/packages/${this.id()}/verify`).subscribe({
      next: r => { this.integrity.set(r); this.integrityState.set(r.intact ? 'intact' : 'tampered'); this.checkedAt.set(new Date().toISOString()); },
      error: (e: ApiError) => { this.integrityState.set('idle'); this.toast.apiError(e, "Couldn't check integrity"); },
    });
  }

  download(kind: 'json' | 'pdf') {
    const p = this.pkg();
    const id = kind === 'json' ? p?.json_file_id : p?.pdf_file_id;
    if (!p || !id) return;
    this.api.blob(`/evidence/${id}/content`).subscribe({
      next: b => saveBlob(b, `${p.summary.project_code}_${p.summary.period_label}_v${p.version}.${kind}`),
      error: (e: ApiError) => this.toast.apiError(e, "Couldn't download"),
    });
  }

  /**
   * The shared auth interceptor skips every URL starting with /api/verifier (meant for the token portal),
   * which also matches the team endpoints /api/verifier-access and /api/verifier-queries. Send the
   * session token explicitly for those.
   */
  private bearer(): Record<string, string> {
    const t = this.auth.token;
    return t ? { Authorization: `Bearer ${t}` } : {};
  }

  linkTone(s: string) { return s === 'active' ? 'active' : s === 'revoked' ? 'rejected' : 'closed'; }
  accessName(id: string) {
    const a = this.access().find(x => x.id === id);
    return a ? `${a.verifier_name}${a.organisation ? ' (' + a.organisation + ')' : ''}` : 'Verifier';
  }
  subject(q: VerifierQuery) {
    if (!q.subject_type || q.subject_type === 'package') return 'On the package as a whole';
    const t = q.subject_type.replace(/_/g, ' ');
    return `On ${t}${q.subject_id ? ' · ' + q.subject_id.slice(0, 12) : ''}`;
  }
  setDraft(id: string, v: string) { this.drafts.update(d => ({ ...d, [id]: v })); }

  answer(q: VerifierQuery) {
    const text = (this.drafts()[q.id] ?? '').trim();
    this.answering.set(q.id);
    this.api.post<VerifierQuery>(`/verifier-queries/${q.id}/answer`, { answer: text }, this.bearer()).subscribe({
      next: res => {
        this.answering.set(null);
        this.setDraft(q.id, '');
        this.queries.update(l => l.map(x => (x.id === res.id ? { ...res, answered_by: res.answered_by ?? this.auth.profile()?.full_name ?? null } : x)));
        this.toast.success('Answer sent', 'The verifier sees it next time they open the workspace.');
      },
      error: (e: ApiError) => { this.answering.set(null); this.toast.apiError(e, "Couldn't send the answer"); },
    });
  }

  startGrant() {
    this.g = { verifier_name: '', verifier_email: '', organisation: '', days: 30 };
    this.granted.set(null);
    this.grantError.set(null);
    this.copied.set(false);
    this.grantOpen.set(true);
  }
  grantValid() {
    return this.g.verifier_name.trim().length >= 2 && /.+@.+\..+/.test(this.g.verifier_email) && this.g.days >= 1 && this.g.days <= 90;
  }
  grant() {
    this.busy.set(true);
    this.grantError.set(null);
    this.api.post<{ access: VerifierAccess; token: string }>(`/packages/${this.id()}/verifier-access`, { ...this.g, days: Number(this.g.days) }).subscribe({
      next: r => {
        this.busy.set(false);
        this.granted.set({ link: `${location.origin}/verify#token=${r.token}`, name: r.access.verifier_name, expires: r.access.expires_at });
        this.access.update(l => [...l.filter(x => x.id !== r.access.id), r.access]);
      },
      error: (e: ApiError) => {
        this.busy.set(false);
        const f = (e.details?.['fields'] as { field: string; message: string }[] | undefined) ?? [];
        this.grantError.set(f.length ? f.map(x => `${x.field.replace(/_/g, ' ')}: ${x.message}`).join('. ') : e.message);
      },
    });
  }
  afterGrantClose() {
    if (this.granted()) this.tab.set('access');
    this.granted.set(null);
  }
  copy(text: string) {
    navigator.clipboard?.writeText(text);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1800);
  }
  revoke() {
    const a = this.revoking();
    if (!a) return;
    this.busy.set(true);
    this.api.post<VerifierAccess>(`/verifier-access/${a.id}/revoke`, {}, this.bearer()).subscribe({
      next: res => {
        this.busy.set(false);
        this.revoking.set(null);
        this.access.update(l => l.map(x => (x.id === res.id ? res : x)));
        this.toast.success('Access revoked', `${a.verifier_name}'s link no longer works.`);
      },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e, "Couldn't revoke"); },
    });
  }
}
