import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError } from '../../core/api.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Brand } from '../../layout/brand';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, Empty, ErrorBox, Hash, Loading, Modal } from '../../ui/kit';
import { Provenance, openBlob, saveBlob } from '../calculations/calc.types';
import { ProvenanceTree } from '../calculations/provenance-tree';
import { Integrity, Package, VerifierAccess, VerifierQuery } from '../verification/verification.types';
import { EvidenceExplorer, FileRef, Subject } from './evidence-explorer';
import { VerifierApi } from './verifier.service';

interface Session { package: Package; verifier: VerifierAccess; status: string; integrity: Integrity }
type Section = 'summary' | 'evidence' | 'provenance' | 'queries' | 'decision';
type Pkg = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const SNIPPET = `import hashlib, json

pkg = json.load(open("package.json", encoding="utf-8"))
meta = {k: v for k, v in pkg["metadata"].items() if k != "sha256"}
doc = {**pkg, "metadata": meta}
text = json.dumps(doc, sort_keys=True, separators=(",", ":"), default=str)
print(hashlib.sha256(text.encode("utf-8")).hexdigest())`;

@Component({
  selector: 'vc-verifier-page',
  imports: [FormsModule, Brand, Icon, Badge, DataClass, Hash, Loading, ErrorBox, Empty, Callout, Modal, ProvenanceTree, EvidenceExplorer, NumPipe, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="top">
      <div class="in">
        <vc-brand />
        <span class="div"></span>
        <div class="ws"><strong>Independent verification workspace</strong><span>Read-only · every action is logged</span></div>
        <span class="spacer"></span>
        @if (session(); as s) {
          <div class="who">
            <span class="av"><vc-icon name="user-check" [size]="16" /></span>
            <div><strong>{{ s.verifier.verifier_name }}</strong><span>{{ s.verifier.organisation || s.verifier.verifier_email }}</span></div>
          </div>
          <div class="exp" [class.soon]="expiresSoon()"><vc-icon name="hourglass" [size]="14" />Access until {{ s.verifier.expires_at | day: true }}</div>
        }
      </div>
      @if (session()) {
        <nav class="tabs in" aria-label="Workspace sections">
          @for (t of nav(); track t.key) {
            <button [class.on]="section() === t.key" (click)="go(t.key)">
              <vc-icon [name]="t.icon" [size]="15" />{{ t.label }}
              @if (t.count) { <span class="c">{{ t.count }}</span> }
            </button>
          }
        </nav>
      }
    </header>

    <main class="in body">
      @if (state() === 'loading') {
        <section class="card"><vc-loading [rows]="6" /></section>
      } @else if (state() === 'error') {
        <section class="card gate">
          <span class="gi" [class]="'gi ' + gate().tone"><vc-icon [name]="gate().icon" [size]="26" /></span>
          <h1>{{ gate().title }}</h1>
          <p>{{ gate().text }}</p>
          @if (errorMsg()) { <p class="small subtle">{{ errorMsg() }}</p> }
          <div class="ga">
            @if (gate().retry) { <button class="btn btn-secondary" (click)="start()"><vc-icon name="refresh" />Try again</button> }
          </div>
          <p class="small subtle foot">Review links are personal, time-limited and can be withdrawn by the project team. Contact the person who sent you the link for a new one.</p>
        </section>
      } @else if (session(); as s) {
        @switch (section()) {
          @case ('summary') {
            <div class="intro">
              <div class="ey">Verification package v{{ s.package.version }} · {{ s.package.summary.project_code }}</div>
              <h1>{{ projectName() }}</h1>
              <p class="muted">Monitoring period <strong>{{ s.package.summary.period_label }}</strong>, {{ s.package.summary.period_start | day }} – {{ s.package.summary.period_end | day }}.
                Issued by {{ s.package.summary.generated_by }} on {{ s.package.created_at | day }}.</p>
            </div>

            @if (s.status !== 'in_review') {
              <vc-callout [tone]="s.status === 'verified' ? 'ok' : 'warn'" [icon]="s.status === 'verified' ? 'verified' : 'flag'" class="mb">
                You concluded this review: <strong>{{ s.status === 'verified' ? 'verified' : 'findings raised' }}</strong>. The workspace stays open, read-only, until the link expires.
              </vc-callout>
            }

            <div class="figs">
              <div class="card fig acc">
                <div class="fl">Net credits claimed <vc-dc cls="CALCULATED" /></div>
                <div class="fv num">{{ s.package.summary.net_credits_t_co2e | num: 1 }}<small>tCO₂e</small></div>
              </div>
              <div class="card fig"><div class="fl">Emission reductions</div><div class="fv num">{{ s.package.summary.reductions_t_co2e | num: 1 }}<small>t</small></div></div>
              <div class="card fig"><div class="fl">Carbon removals</div><div class="fv num">{{ s.package.summary.removals_t_co2e | num: 1 }}<small>t</small></div></div>
              <div class="card fig"><div class="fl">Result before uncertainty</div><div class="fv num">{{ s.package.summary.net_before_uncertainty_t_co2e | num: 1 }}<small>t</small></div></div>
              <div class="card fig"><div class="fl">Uncertainty deduction</div><div class="fv num">{{ s.package.summary.uncertainty_deduction_t_co2e | num: 1 }}<small>t</small></div></div>
              <div class="card fig"><div class="fl">Non-permanence buffer</div><div class="fv num">{{ s.package.summary.buffer_t_co2e | num: 1 }}<small>t</small></div></div>
            </div>

            <div class="grid grid-2 two">
              <section class="card">
                <div class="card-head"><h3>Scope and methodology</h3></div>
                <div class="card-body">
                  @if (pkg(); as p) {
                    <dl class="kv">
                      <dt>Methodology</dt><dd>{{ methodology() }}</dd>
                      <dt>Rules applied</dt><dd class="num">{{ p['methodology']?.rules?.length ?? 0 }}</dd>
                      <dt>Fields · zones</dt><dd class="num">{{ p['fields']?.length ?? 0 }} · {{ p['strata']?.length ?? 0 }}</dd>
                      <dt>Soil cores · layers</dt><dd class="num">{{ p['samples']?.length ?? 0 }} · {{ p['soil_layers']?.length ?? 0 }}</dd>
                      <dt>Lab results</dt><dd class="num">{{ p['lab_results']?.length ?? 0 }} ({{ usedResults() }} used in the calculation)</dd>
                      <dt>Custody events</dt><dd class="num">{{ p['custody_events']?.length ?? 0 }}</dd>
                      <dt>Referenced files</dt><dd class="num">{{ p['document_index']?.length ?? 0 }}</dd>
                      <dt>Quality findings</dt><dd class="num">{{ p['qa_findings']?.length ?? 0 }} recorded</dd>
                      <dt>Engine version</dt><dd>{{ p['metadata']?.engine_version }}</dd>
                    </dl>
                  } @else if (pkgError()) {
                    <vc-error title="Couldn't read the package" [message]="pkgError()!" />
                  } @else { <vc-loading [rows]="5" /> }
                </div>
                <div class="card-foot">
                  <button class="btn btn-secondary btn-sm" (click)="download('json')"><vc-icon name="file-json" [size]="14" />Download package JSON</button>
                  @if (s.package.pdf_file_id) { <button class="btn btn-secondary btn-sm" (click)="download('pdf')"><vc-icon name="download" [size]="14" />PDF report</button> }
                </div>
              </section>

              <section class="card">
                <div class="card-head"><h3>Package fingerprint</h3>
                  @if (s.integrity.intact) { <span class="ok"><vc-icon name="shield-check" [size]="14" />Intact</span> }
                  @else { <span class="bad"><vc-icon name="shield-alert" [size]="14" />Does not match</span> }
                </div>
                <div class="card-body">
                  <vc-hash [value]="s.package.sha256" [full]="true" class="fh" />
                  @if (!s.integrity.intact) {
                    <vc-callout tone="danger" icon="shield-alert" class="mt">The stored package no longer matches the fingerprint recorded at issue. Raise this as a finding.</vc-callout>
                  }
                  <p class="small muted mt">This SHA-256 fingerprint is printed on every page of the PDF. To confirm independently that the JSON you downloaded is the one that was issued:</p>
                  <ol class="how small">
                    <li>Download the package JSON.</li>
                    <li>Remove the single field <code>metadata.sha256</code>.</li>
                    <li>Serialise with sorted keys and no spaces (<code>","</code> and <code>":"</code> separators), UTF-8.</li>
                    <li>Compute SHA-256. It must equal the fingerprint above.</li>
                  </ol>
                  <div class="code">
                    <pre>{{ snippet }}</pre>
                    <button class="btn btn-ghost btn-sm" (click)="copy(snippet)"><vc-icon [name]="copied() ? 'check' : 'copy'" [size]="13" />{{ copied() ? 'Copied' : 'Copy' }}</button>
                  </div>
                </div>
              </section>
            </div>
          }

          @case ('evidence') {
            <div class="intro"><h2>Evidence explorer</h2><p class="muted small">Browse the sealed records. Open certificates and photos, and raise a question on any item.</p></div>
            @if (pkg(); as p) {
              <vc-evidence-explorer [pkg]="p" [askable]="s.status === 'in_review'" (open)="openFile($event)" (ask)="startAsk($event)" />
            } @else if (pkgError()) { <vc-error title="Couldn't read the package" [message]="pkgError()!" /> }
            @else { <section class="card"><vc-loading [rows]="6" /></section> }
          }

          @case ('provenance') {
            <div class="intro"><h2>Provenance</h2><p class="muted small">How the claimed figure was built: every rule, term, zone, site, core, layer, lab result, certificate and custody event behind it.</p></div>
            <section class="card">
              @if (provLoading()) { <vc-loading [rows]="8" /> }
              @else if (provError()) { <div class="card-body"><vc-error title="Couldn't load provenance" [message]="provError()!" /></div> }
              @else if (prov(); as p) {
                <vc-provenance-tree [data]="p" [askable]="s.status === 'in_review'" (openFile)="openFile({ id: $event.id, filename: $event.filename ?? 'file' })" (ask)="startAsk($event)" />
              }
            </section>
          }

          @case ('queries') {
            <div class="intro row">
              <div><h2>Queries</h2><p class="muted small">Questions go to the project team. Their answers appear here.</p></div>
              <span class="spacer"></span>
              @if (s.status === 'in_review') { <button class="btn btn-primary" (click)="startAsk({ type: 'package', id: '', label: 'The package as a whole' })"><vc-icon name="question" />Ask a question</button> }
            </div>
            <section class="card">
              @if (qLoading()) { <vc-loading [rows]="4" /> }
              @else if (qError()) { <div class="card-body"><vc-error title="Couldn't load your queries" [message]="qError()!" /></div> }
              @else if (!questions().length) {
                <vc-empty icon="message" title="No questions raised" text="Use “Raise a question” on any record in the evidence explorer or provenance tree, or ask about the package as a whole." />
              } @else {
                <ul class="qs">
                  @for (q of questions(); track q.id) {
                    <li>
                      <div class="qh"><vc-badge [status]="q.status" /><span class="qsubj">{{ subject(q) }}</span><span class="spacer"></span><span class="subtle small">{{ q.created_at | day: true }}</span></div>
                      <p class="qq">{{ q.question }}</p>
                      @if (q.answer) {
                        <div class="qa"><vc-icon name="reply" [size]="14" /><div><p>{{ q.answer }}</p><span class="subtle small">Project team · {{ q.answered_at | day: true }}</span></div></div>
                      } @else { <p class="small subtle wait"><vc-icon name="clock" [size]="13" />Waiting for the project team</p> }
                    </li>
                  }
                </ul>
              }
            </section>
          }

          @case ('decision') {
            <div class="intro"><h2>Decision</h2><p class="muted small">Record the outcome of your review. This is final for this link and is added to the audit trail.</p></div>
            @if (s.status !== 'in_review') {
              <section class="card concluded">
                <span class="gi" [class]="'gi ' + (s.status === 'verified' ? 'ok' : 'warn')"><vc-icon [name]="s.status === 'verified' ? 'verified' : 'flag'" [size]="24" /></span>
                <h2>{{ s.status === 'verified' ? 'Verified' : 'Findings raised' }}</h2>
                <p class="muted">You concluded this review. The project team has been informed.</p>
              </section>
            } @else {
              <section class="card">
                <div class="card-body dec">
                  <label class="opt" [class.on]="decision === 'verified'">
                    <input type="radio" name="d" value="verified" [(ngModel)]="decision" />
                    <vc-icon name="verified" [size]="20" />
                    <div><strong>Verified</strong><span>The claim is supported by the evidence, within the methodology's requirements.</span></div>
                  </label>
                  <label class="opt" [class.on]="decision === 'findings'">
                    <input type="radio" name="d" value="findings" [(ngModel)]="decision" />
                    <vc-icon name="flag" [size]="20" />
                    <div><strong>Findings</strong><span>Issues must be corrected or clarified before the claim can be verified.</span></div>
                  </label>
                  <div class="field">
                    <label>{{ decision === 'findings' ? 'Describe the findings' : 'Note (optional)' }}</label>
                    <textarea class="input" rows="4" [(ngModel)]="decisionNote" [placeholder]="decision === 'findings' ? 'e.g. Zone Z3: two cores have no lab-received custody event; certificate for layer L-104 is unsigned.' : 'Any remarks for the record'"></textarea>
                  </div>
                  @if (openQuestions() > 0) {
                    <vc-callout tone="warn" icon="alert">{{ openQuestions() }} of your questions {{ openQuestions() === 1 ? 'is' : 'are' }} still unanswered.</vc-callout>
                  }
                </div>
                <div class="card-foot">
                  <button class="btn btn-primary" [disabled]="!decisionValid()" (click)="confirmOpen.set(true)">Record decision</button>
                </div>
              </section>
            }
          }
        }
      }
    </main>

    <footer class="in pf small subtle">
      Varsapradaya Carbon · @if (session(); as s) { verification package {{ s.package.sha256.slice(0, 12) }} · }You are viewing a read-only copy; nothing you do here changes the project's records.
    </footer>

    <!-- ask -->
    <vc-modal [open]="!!asking()" (closed)="asking.set(null)" title="Raise a question" subtitle="The project team is notified and answers here." width="560px">
      @if (asking(); as a) {
        <div class="subj"><vc-icon name="corner-down-right" [size]="14" />{{ a.label }}</div>
        <div class="field"><label>Your question</label>
          <textarea class="input" rows="5" [(ngModel)]="question" placeholder="Be specific: what you checked, what you expected, and what evidence would resolve it."></textarea>
          <span class="hint">At least 5 characters.</span>
        </div>
      }
      <ng-container footer>
        <button class="btn btn-ghost" (click)="asking.set(null)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || question.trim().length < 5" (click)="sendQuestion()"><vc-icon name="send" />{{ busy() ? 'Sending…' : 'Send question' }}</button>
      </ng-container>
    </vc-modal>

    <!-- confirm decision -->
    <vc-modal [(open)]="confirmOpen" title="Confirm your decision" width="500px">
      <p>You are recording <strong>{{ decision === 'verified' ? 'Verified' : 'Findings' }}</strong> for package v{{ session()?.package?.version }}
        (fingerprint <code>{{ session()?.package?.sha256?.slice(0, 12) }}…</code>).</p>
      <p class="small muted mt">After this you can no longer raise questions with this link. The decision is added to the project's audit trail under your name.</p>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="confirmOpen.set(false)">Go back</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="decide()">{{ busy() ? 'Recording…' : 'Confirm decision' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    :host{display:flex;flex-direction:column;min-height:100vh;background:var(--bg)}
    .in{width:100%;max-width:1320px;margin:0 auto;padding-left:32px;padding-right:32px}
    @media (max-width: 800px){.in{padding-left:16px;padding-right:16px}}
    .top{position:sticky;top:0;z-index:40;background:var(--surface);border-top:3px solid var(--forest-600);border-bottom:1px solid var(--border);box-shadow:var(--shadow-sm)}
    .top > .in:first-child{display:flex;align-items:center;gap:16px;height:64px}
    .div{width:1px;height:28px;background:var(--border)}
    .ws{display:flex;flex-direction:column;line-height:1.25}
    .ws strong{font-size:14px;font-weight:600;color:var(--stone-900)} .ws span{font-size:11.5px;color:var(--text-3)}
    .spacer{flex:1}
    .who{display:flex;align-items:center;gap:10px}
    .who div{display:flex;flex-direction:column;line-height:1.25} .who strong{font-size:13px} .who span{font-size:11.5px;color:var(--text-3)}
    .av{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:var(--forest-100);color:var(--forest-700)}
    .exp{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--stone-600);padding:5px 10px;border-radius:999px;background:var(--sand-100);border:1px solid var(--border)}
    .exp.soon{background:var(--warn-soft);color:var(--amber-600);border-color:#f1dcae}
    @media (max-width: 900px){.ws span,.who div,.div{display:none}}
    .tabs{display:flex;gap:4px;overflow-x:auto}
    .tabs button{position:relative;display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 14px;border:0;background:none;font:inherit;font-weight:500;color:var(--text-2);cursor:pointer;white-space:nowrap}
    .tabs button:hover{color:var(--text)}
    .tabs button.on{color:var(--forest-700)}
    .tabs button.on::after{content:'';position:absolute;left:10px;right:10px;bottom:0;height:2px;border-radius:2px;background:var(--forest-600)}
    .tabs .c{display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--amber-100);color:var(--amber-600);font-size:11px}
    .body{flex:1;padding-top:28px;padding-bottom:40px}
    .intro{margin-bottom:20px}
    .intro.row{display:flex;align-items:flex-end}
    .ey{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--forest-500);margin-bottom:6px}
    .intro h1{font-size:26px} .intro p{margin-top:6px}
    .mb{display:flex;margin-bottom:16px}
    .figs{display:grid;grid-template-columns:1.4fr repeat(5,minmax(0,1fr));gap:12px}
    @media (max-width: 1200px){.figs{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media (max-width: 700px){.figs{grid-template-columns:1fr 1fr}}
    .fig{padding:16px 18px}
    .fl{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--text-2);font-weight:500}
    .fv{font-size:24px;font-weight:600;letter-spacing:-.02em;margin-top:6px}
    .fv small{font-size:12px;color:var(--text-3);margin-left:5px;font-weight:500}
    .fig.acc{background:linear-gradient(135deg,var(--forest-800),var(--forest-600));border-color:var(--forest-700)}
    .fig.acc .fl{color:rgba(255,255,255,.78)} .fig.acc .fv{color:#fff;font-size:30px} .fig.acc small{color:rgba(255,255,255,.7)}
    .two{margin-top:16px}
    .ok,.bad{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;font-weight:500;padding:3px 9px;border-radius:999px}
    .ok{background:var(--ok-soft);color:var(--forest-700)} .bad{background:var(--danger-soft);color:var(--red-600)}
    .fh{word-break:break-all}
    .mt{margin-top:12px;display:block}
    .how{margin:8px 0 12px;padding-left:18px;color:var(--stone-700);display:flex;flex-direction:column;gap:3px}
    .code{position:relative;background:var(--forest-950);border-radius:var(--radius-sm);padding:12px 14px}
    .code pre{margin:0;font:12px/1.55 var(--mono);color:#dfe9e2;white-space:pre;overflow-x:auto}
    .code button{position:absolute;top:6px;right:6px;color:#c3dbca}
    .code button:hover{background:rgba(255,255,255,.08)!important}
    .gate{max-width:560px;margin:48px auto;padding:40px 36px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px}
    .gate h1{font-size:22px} .gate p{color:var(--text-2);max-width:440px}
    .gi{display:grid;place-items:center;width:60px;height:60px;border-radius:16px;margin-bottom:6px}
    .gi.danger{background:var(--danger-soft);color:var(--red-600)} .gi.warn{background:var(--warn-soft);color:var(--amber-600)}
    .gi.neutral{background:var(--sand-200);color:var(--stone-600)} .gi.ok{background:var(--ok-soft);color:var(--forest-600)}
    .ga{margin-top:8px}
    .gate .foot{margin-top:18px;padding-top:16px;border-top:1px solid var(--border)}
    .qs{list-style:none;margin:0;padding:0}
    .qs li{padding:16px 20px;border-bottom:1px solid var(--stone-100)}
    .qs li:last-child{border-bottom:0}
    .qh{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .qsubj{font-size:12.5px;color:var(--text-2)}
    .qq{margin-top:8px;white-space:pre-wrap}
    .qa{display:flex;gap:10px;margin-top:10px;padding:10px 12px;border-radius:var(--radius-sm);background:var(--forest-50);border:1px solid var(--forest-200);color:var(--forest-600)}
    .qa p{color:var(--stone-800);white-space:pre-wrap}
    .wait{display:flex;align-items:center;gap:6px;margin-top:8px}
    .dec{display:flex;flex-direction:column;gap:12px;max-width:760px}
    .opt{display:flex;gap:12px;align-items:flex-start;padding:14px 16px;border:1px solid var(--border);border-radius:var(--radius);cursor:pointer}
    .opt:hover{border-color:var(--stone-400)}
    .opt.on{border-color:var(--forest-500);background:var(--forest-50);box-shadow:var(--focus)}
    .opt input{margin-top:3px;accent-color:var(--primary)}
    .opt vc-icon{color:var(--forest-600);margin-top:1px}
    .opt div{display:flex;flex-direction:column} .opt span{font-size:13px;color:var(--text-2)}
    .concluded{padding:40px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px}
    .subj{display:flex;align-items:center;gap:8px;padding:10px 12px;margin-bottom:14px;border-radius:var(--radius-sm);background:var(--sand-100);font-size:13px;color:var(--stone-700)}
    .pf{padding-top:16px;padding-bottom:24px;border-top:1px solid var(--border)}
  `],
})
export class VerifierPage {
  private api = inject(VerifierApi);
  private toast = inject(ToastService);

  state = signal<'loading' | 'ready' | 'error'>('loading');
  errorCode = signal<string>('');
  errorMsg = signal<string>('');
  session = signal<Session | null>(null);
  section = signal<Section>((new URLSearchParams(location.search).get('section') as Section) || 'summary');
  pkg = signal<Pkg | null>(null);
  pkgError = signal<string | null>(null);
  prov = signal<Provenance | null>(null);
  provLoading = signal(false);
  provError = signal<string | null>(null);
  queries = signal<VerifierQuery[]>([]);
  qLoading = signal(true);
  qError = signal<string | null>(null);
  asking = signal<Subject | null>(null);
  question = '';
  busy = signal(false);
  copied = signal(false);
  confirmOpen = signal(false);
  decision: 'verified' | 'findings' = 'verified';
  decisionNote = '';
  snippet = SNIPPET;

  questions = computed(() => this.queries().filter(q => q.subject_type !== 'decision').reverse());
  openQuestions = computed(() => this.questions().filter(q => q.status === 'open').length);
  nav = computed(() => [
    { key: 'summary' as Section, label: 'Summary', icon: 'dashboard', count: 0 },
    { key: 'evidence' as Section, label: 'Evidence', icon: 'file-search', count: 0 },
    { key: 'provenance' as Section, label: 'Provenance', icon: 'network', count: 0 },
    { key: 'queries' as Section, label: 'Queries', icon: 'message', count: this.openQuestions() },
    { key: 'decision' as Section, label: 'Decision', icon: 'stamp', count: 0 },
  ]);
  expiresSoon = computed(() => {
    const e = this.session()?.verifier.expires_at;
    return !!e && new Date(e).getTime() - Date.now() < 3 * 86400000;
  });
  projectName = computed(() => {
    const p = this.pkg();
    return p?.['metadata']?.['project_name'] ?? this.session()?.package.summary.project_code ?? 'Verification package';
  });
  methodology = computed(() => {
    const pk = this.pkg()?.['methodology']?.['pack'];
    return pk ? `${pk['methodology_code']} v${pk['methodology_version']} rev ${pk['revision']}${pk['title'] ? ' — ' + pk['title'] : ''}` : '—';
  });
  usedResults = computed(() => (this.pkg()?.['lab_results'] ?? []).filter((r: Pkg) => r['used_in_calculation']).length);

  gate = computed(() => {
    switch (this.errorCode()) {
      case 'VERIFIER_LINK_EXPIRED':
        return { icon: 'hourglass', tone: 'warn', title: 'This review link has expired', text: 'Access to this package was time-limited and the period has ended. Ask the project team for a new link if your review is still in progress.', retry: false };
      case 'VERIFIER_LINK_REVOKED':
        return { icon: 'ban', tone: 'danger', title: 'Access has been withdrawn', text: 'The project team has revoked this link. Your questions and any decision you recorded remain on the record.', retry: false };
      case 'VERIFIER_TOKEN_REQUIRED':
      case 'NO_TOKEN':
        return { icon: 'key', tone: 'neutral', title: 'Open your review link', text: 'This workspace opens from the personal link the project team sent you. Open that link again in this browser tab.', retry: false };
      case 'VERIFIER_LINK_INVALID':
        return { icon: 'link-off', tone: 'danger', title: "This link isn't valid", text: 'The link may be incomplete or mistyped. Copy the whole link from the message you received and open it again.', retry: false };
      case 'OFFLINE':
        return { icon: 'wifi-off', tone: 'neutral', title: "Can't reach the server", text: 'Check your connection and try again.', retry: true };
      default:
        return { icon: 'alert', tone: 'neutral', title: 'The workspace could not be opened', text: 'Something went wrong on our side. Please try again in a moment.', retry: true };
    }
  });
  decisionValid = () => this.decision === 'verified' || this.decisionNote.trim().length >= 5;

  constructor() {
    this.start();
    effect(() => {
      if (this.section() === 'provenance' && this.session() && !this.prov() && !this.provLoading() && !this.provError()) this.loadProv();
    });
  }

  start() {
    const t = this.api.captureToken();
    if (!t) { this.fail({ status: 401, code: 'NO_TOKEN', message: '', details: {} }); return; }
    this.state.set('loading');
    this.api.get<Session>('/session').subscribe({
      next: s => {
        this.session.set(s);
        this.state.set('ready');
        this.loadPackage();
        this.loadQueries();
      },
      error: (e: ApiError) => this.fail(e),
    });
  }

  private fail(e: ApiError) {
    const code = e.status === 401 && !e.code.startsWith('VERIFIER') && e.code !== 'NO_TOKEN' ? 'VERIFIER_LINK_INVALID' : e.code;
    this.errorCode.set(code);
    this.errorMsg.set(code.startsWith('VERIFIER') || code === 'NO_TOKEN' ? '' : e.message);
    this.session.set(null);
    this.state.set('error');
  }

  /** A 401 mid-session means the link expired or was revoked: show the gate. */
  private handle(e: ApiError, fallback: string, set?: (m: string) => void) {
    if (e.status === 401) { this.fail(e); return; }
    if (set) set(e.message); else this.toast.apiError(e, fallback);
  }

  go(s: Section) { this.section.set(s); window.scrollTo({ top: 0 }); }

  loadPackage() {
    this.pkgError.set(null);
    this.api.get<Pkg>('/package').subscribe({
      next: p => this.pkg.set(p),
      error: (e: ApiError) => this.handle(e, '', m => this.pkgError.set(m)),
    });
  }

  loadQueries() {
    this.qLoading.set(true);
    this.qError.set(null);
    this.api.get<VerifierQuery[]>('/queries').subscribe({
      next: q => { this.queries.set(q); this.qLoading.set(false); },
      error: (e: ApiError) => { this.qLoading.set(false); this.handle(e, '', m => this.qError.set(m)); },
    });
  }

  loadProv() {
    const s = this.session();
    if (!s) return;
    this.provLoading.set(true);
    this.provError.set(null);
    this.api.get<Provenance>(`/provenance/${s.package.run_id}`).subscribe({
      next: p => { this.prov.set(p); this.provLoading.set(false); },
      error: (e: ApiError) => { this.provLoading.set(false); this.handle(e, '', m => this.provError.set(m)); },
    });
  }

  openFile(f: FileRef) {
    this.api.blob(`/files/${f.id}`).subscribe({
      next: b => openBlob(b),
      error: (e: ApiError) => this.handle(e, "Couldn't open the file"),
    });
  }

  download(kind: 'json' | 'pdf') {
    const p = this.session()?.package;
    const id = kind === 'json' ? p?.json_file_id : p?.pdf_file_id;
    if (!p || !id) return;
    this.api.blob(`/files/${id}`).subscribe({
      next: b => saveBlob(b, `${p.summary.project_code}_${p.summary.period_label}_v${p.version}.${kind}`),
      error: (e: ApiError) => this.handle(e, "Couldn't download"),
    });
  }

  copy(t: string) {
    navigator.clipboard?.writeText(t);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }

  startAsk(s: Subject) { this.question = ''; this.asking.set(s); }

  sendQuestion() {
    const a = this.asking();
    if (!a) return;
    this.busy.set(true);
    this.api.post<VerifierQuery>('/queries', { question: this.question.trim(), subject_type: a.type, subject_id: (a.id ?? '').slice(0, 64) }).subscribe({
      next: q => {
        this.busy.set(false);
        this.asking.set(null);
        this.queries.update(l => [...l, q]);
        this.toast.success('Question sent', 'The project team will answer in the Queries section.');
      },
      error: (e: ApiError) => { this.busy.set(false); this.handle(e, "Couldn't send the question"); },
    });
  }

  subject(q: VerifierQuery) {
    if (!q.subject_type || q.subject_type === 'package') return 'The package as a whole';
    return `${q.subject_type.replace(/_/g, ' ')}${q.subject_id ? ' · ' + q.subject_id.slice(0, 12) : ''}`;
  }

  decide() {
    this.busy.set(true);
    this.api.post<VerifierAccess>('/decision', { status: this.decision, note: this.decisionNote.trim() }).subscribe({
      next: acc => {
        this.busy.set(false);
        this.confirmOpen.set(false);
        const s = this.session();
        if (s) this.session.set({ ...s, status: acc.review_status, verifier: acc });
        this.toast.success('Decision recorded', this.decision === 'verified' ? 'The package is marked verified.' : 'Your findings have been sent to the project team.');
      },
      error: (e: ApiError) => { this.busy.set(false); this.handle(e, "Couldn't record the decision"); },
    });
  }
}
