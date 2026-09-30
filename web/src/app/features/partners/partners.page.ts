import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT, TabItem } from '../../ui/kit';
import { Remote } from '../supporting/shared';

interface ApiKey { id: string; name: string; prefix: string; scopes: string[]; is_active: boolean; last_used_at: string | null; created_at: string }
interface Webhook { id: string; url: string; events: string[]; is_active: boolean; description: string; created_at: string; secret?: string }
interface Delivery { id: string; event_id: string; attempt: number; ok: boolean; status_code: number | null; error: string | null; at: string }
interface DomainEvent { id: string; event: string; entity_type: string; entity_id: string; payload: Record<string, unknown>; at: string }

const SCOPES = [
  { key: 'read', label: 'Read results', hint: 'List projects and approved results with their package fingerprints' },
  { key: 'write_practices', label: 'Record practices', hint: 'Send practice records from a partner system (idempotent by client_ref)' },
];
const EVENT_INFO: Record<string, string> = {
  'result.approved': 'A calculation result was approved',
  'result.superseded': 'An approved result was replaced by a newer one',
  'package.issued': 'A verification package was issued',
  'credits.issued': 'Credits were issued into a batch',
  'sale.created': 'A credit sale was recorded',
  'payout.completed': 'A farmer payout was completed',
  'farmer.enrolled': 'A farmer was enrolled in a project',
  'practice.recorded': 'A practice was recorded',
};
const ENDPOINTS = [
  { m: 'GET', p: '/partner/v1/projects', scope: 'read', d: 'Projects in your organisation' },
  { m: 'GET', p: '/partner/v1/projects/{id}/results', scope: 'read', d: 'Approved results, with the verification package SHA-256' },
  { m: 'POST', p: '/partner/v1/practices', scope: 'write_practices', d: 'Record a practice; repeat calls with the same client_ref are safe' },
];

@Component({
  selector: 'vc-partners-page',
  imports: [...KIT, FormsModule, RouterLink, DayPipe, AgoPipe, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Partners & API" eyebrow="Administration"
      subtitle="Let partner systems read approved results and send practice records, and push events to them as they happen.">
      <a actions class="btn btn-secondary" routerLink="assistant"><vc-icon name="message" />Results assistant</a>
    </vc-page-header>

    <vc-tabs [tabs]="tabs()" [(active)]="tab" />

    @switch (tab()) {
      <!-- ============================================================== keys -->
      @case ('keys') {
        <div class="bar">
          <p class="muted small">Keys are shown once when created. Only a fingerprint is stored, so a lost key can't be recovered — revoke it and create a new one.</p>
          <span class="spacer"></span>
          <button class="btn btn-primary" (click)="openKey()"><vc-icon name="key" />Create API key</button>
        </div>
        <section class="card">
          @if (keys.loading() && !keys.data()) { <vc-loading [rows]="4" /> }
          @else if (keys.error()) { <div class="card-body"><vc-error title="Couldn't load API keys" [message]="keys.error()!.message" /></div> }
          @else if (!keys.data()?.length) {
            <vc-empty icon="key" title="No API keys yet" text="Create a key for each partner system, with only the scopes it needs.">
              <button class="btn btn-primary" (click)="openKey()"><vc-icon name="key" />Create API key</button></vc-empty>
          } @else {
            <div class="table-wrap"><table class="table">
              <thead><tr><th>Name</th><th>Key</th><th>Scopes</th><th>Last used</th><th>Created</th><th>Status</th><th></th></tr></thead>
              <tbody>@for (k of keys.data(); track k.id) {
                <tr [class.dim]="!k.is_active">
                  <td><strong>{{ k.name }}</strong></td>
                  <td><code class="kp">vcp_{{ k.prefix }}_••••••••</code></td>
                  <td><div class="chips">@for (s of k.scopes; track s) { <span class="scope">{{ scopeLabel(s) }}</span> }</div></td>
                  <td class="nowrap">{{ k.last_used_at ? (k.last_used_at | ago) : 'Never' }}</td>
                  <td class="nowrap small">{{ k.created_at | day }}</td>
                  <td><vc-badge [status]="k.is_active ? 'active' : 'inactive'">{{ k.is_active ? 'Active' : 'Revoked' }}</vc-badge></td>
                  <td class="num">@if (k.is_active) { <button class="btn btn-ghost btn-sm danger-t" (click)="revokeTarget.set(k)"><vc-icon name="ban" [size]="14" />Revoke</button> }</td>
                </tr>
              }</tbody>
            </table></div>
          }
        </section>
      }

      <!-- ============================================================== webhooks -->
      @case ('webhooks') {
        <div class="bar">
          <p class="muted small">Each delivery is signed with HMAC-SHA256 in the <code>X-Signature</code> header. Failed deliveries are retried up to 8 times.</p>
          <span class="spacer"></span>
          <button class="btn btn-secondary" [disabled]="dispatching()" (click)="dispatch()"><vc-icon name="send" />{{ dispatching() ? 'Sending…' : 'Dispatch pending events' }}</button>
          <button class="btn btn-primary" (click)="openHook()"><vc-icon name="plus" />Add webhook</button>
        </div>
        @if (hooks.loading() && !hooks.data()) { <div class="card"><vc-loading [rows]="4" /></div> }
        @else if (hooks.error()) { <vc-error title="Couldn't load webhooks" [message]="hooks.error()!.message" /> }
        @else if (!hooks.data()?.length) {
          <div class="card"><vc-empty icon="webhook" title="No webhooks yet" text="Add an https address to receive events such as approved results and completed payouts.">
            <button class="btn btn-primary" (click)="openHook()"><vc-icon name="plus" />Add webhook</button></vc-empty></div>
        } @else {
          <div class="hooks">
            @for (w of hooks.data(); track w.id) {
              <section class="card hook" [class.dim]="!w.is_active">
                <div class="hh">
                  <span class="hi"><vc-icon name="webhook" [size]="16" /></span>
                  <div class="hm"><code class="url">{{ w.url }}</code>@if (w.description) { <span class="small muted">{{ w.description }}</span> }</div>
                  <label class="toggle" [title]="w.is_active ? 'Disable' : 'Enable'">
                    <input type="checkbox" [checked]="w.is_active" (change)="toggleHook(w, $any($event.target).checked)" />
                    <span class="tr"><span class="th"></span></span><span class="small">{{ w.is_active ? 'Enabled' : 'Disabled' }}</span>
                  </label>
                </div>
                <div class="he">
                  @for (e of w.events; track e) { <span class="ev" [title]="eventInfo(e)"><code>{{ e }}</code></span> }
                  <span class="spacer"></span>
                  <span class="small subtle">Added {{ w.created_at | day }}</span>
                  <button class="btn btn-ghost btn-sm" (click)="openDeliveries(w)"><vc-icon name="history" [size]="14" />Deliveries</button>
                </div>
              </section>
            }
          </div>
        }
      }

      <!-- ============================================================== events -->
      @case ('events') {
        <div class="bar">
          <select class="input evf" [ngModel]="eventFilter()" (ngModelChange)="eventFilter.set($event)" aria-label="Event type">
            <option value="">All events</option>
            @for (e of allowedEvents(); track e) { <option [value]="e">{{ e }}</option> }
          </select>
          <span class="small muted">The outbox: every event raised in your organisation, newest first. Webhooks receive the ones they subscribe to.</span>
          <span class="spacer"></span>
          <button class="btn btn-secondary btn-sm" (click)="loadEvents()"><vc-icon name="refresh" [size]="14" />Refresh</button>
        </div>
        <section class="card">
          @if (events.loading() && !events.data()) { <vc-loading [rows]="6" /> }
          @else if (events.error()) { <div class="card-body"><vc-error title="Couldn't load events" [message]="events.error()!.message" /></div> }
          @else if (!events.data()?.length) { <vc-empty icon="activity" title="No events yet" text="Events appear as results are approved, credits issued, sales made and payouts completed." /> }
          @else {
            <div class="table-wrap"><table class="table">
              <thead><tr><th>When</th><th>Event</th><th>Record</th><th>Payload</th></tr></thead>
              <tbody>@for (e of events.data(); track e.id) {
                <tr>
                  <td class="nowrap"><span [title]="e.at | day: true">{{ e.at | ago }}</span></td>
                  <td><code class="evc">{{ e.event }}</code><div class="small subtle">{{ eventInfo(e.event) }}</div></td>
                  <td class="small"><span class="muted">{{ e.entity_type }}</span> <code class="subtle">{{ e.entity_id.slice(0, 8) }}</code></td>
                  <td><code class="payload" [title]="e.payload | json">{{ preview(e.payload) }}</code></td>
                </tr>
              }</tbody>
            </table></div>
          }
        </section>
      }

      <!-- ============================================================== reference -->
      @case ('reference') {
        <div class="grid ref">
          <section class="card">
            <div class="card-head"><h3>Partner API · v1</h3><span class="small subtle">Base path <code>{{ origin }}/api</code></span></div>
            <div class="table-wrap"><table class="table">
              <thead><tr><th>Method</th><th>Endpoint</th><th>Scope</th><th>What it does</th></tr></thead>
              <tbody>@for (e of endpoints; track e.p) {
                <tr><td><span class="m" [class.post]="e.m === 'POST'">{{ e.m }}</span></td><td><code>{{ e.p }}</code></td><td><span class="scope">{{ scopeLabel(e.scope) }}</span></td><td class="small muted">{{ e.d }}</td></tr>
              }</tbody>
            </table></div>
          </section>
          <section class="card">
            <div class="card-head"><h3>Authenticate with X-API-Key</h3><button class="btn btn-ghost btn-sm" (click)="copy(curl)"><vc-icon name="copy" [size]="14" />Copy</button></div>
            <pre class="code">{{ curl }}</pre>
            <div class="card-foot left"><span class="small muted">Errors use one shape: <code>{{ '{' }}"code", "message", "details"{{ '}' }}</code>. A missing or revoked key answers 401 <code>INVALID_API_KEY</code>; a missing scope answers 403.</span></div>
          </section>
          <section class="card">
            <div class="card-head"><h3>Verify a webhook signature</h3></div>
            <pre class="code">{{ verify }}</pre>
          </section>
        </div>
      }
    }

    <!-- create key -->
    <vc-modal [(open)]="keyOpen" [title]="newKey() ? 'Copy your new key' : 'Create an API key'" width="520px" (closed)="newKey.set(null)">
      @if (newKey(); as nk) {
        <div class="stack" style="--gap:14px">
          <vc-callout tone="warn" icon="alert"><strong>This is the only time the key is shown.</strong> Store it in the partner's secret manager now. If it is lost, revoke it and create a new one.</vc-callout>
          <div class="secret"><code>{{ nk.key }}</code><button class="btn btn-secondary btn-sm" (click)="copy(nk.key)"><vc-icon [name]="copied() ? 'check' : 'copy'" [size]="14" />{{ copied() ? 'Copied' : 'Copy' }}</button></div>
          <dl class="kv"><dt>Name</dt><dd>{{ nk.name }}</dd><dt>Scopes</dt><dd>{{ scopesText(nk.scopes) }}</dd></dl>
        </div>
      } @else {
        <form class="stack" style="--gap:14px" id="keyForm" (ngSubmit)="createKey()">
          <div class="field"><label for="kn">Name</label><input id="kn" class="input" name="kn" [(ngModel)]="keyName" placeholder="e.g. FPO accounting system" /><span class="hint">Who or what will use this key.</span></div>
          <div class="field"><label>Scopes</label>
            @for (s of scopes; track s.key) {
              <label class="scopt" [class.on]="keyScopes[s.key]"><input type="checkbox" [name]="'s_' + s.key" [(ngModel)]="keyScopes[s.key]" /><span><strong>{{ s.label }}</strong><small>{{ s.hint }}</small></span></label>
            }
          </div>
          @if (formError()) { <vc-error title="Key not created" [message]="formError()!" /> }
        </form>
      }
      <ng-container footer>
        @if (newKey()) { <button class="btn btn-primary" (click)="keyOpen.set(false); newKey.set(null)">I've stored the key</button> }
        @else {
          <button class="btn btn-ghost" (click)="keyOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" type="submit" form="keyForm" [disabled]="busy() || keyName.trim().length < 2 || !chosenScopes().length">Create key</button>
        }
      </ng-container>
    </vc-modal>

    <!-- revoke -->
    <vc-modal [open]="!!revokeTarget()" (closed)="revokeTarget.set(null)" title="Revoke this key?" width="440px">
      <p><strong>{{ revokeTarget()?.name }}</strong> (<code>vcp_{{ revokeTarget()?.prefix }}</code>) will stop working immediately. Any system using it gets 401 errors. This can't be undone.</p>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="revokeTarget.set(null)">Cancel</button>
        <button class="btn btn-danger" [disabled]="busy()" (click)="revoke()">Revoke key</button>
      </ng-container>
    </vc-modal>

    <!-- create webhook -->
    <vc-modal [(open)]="hookOpen" [title]="newSecret() ? 'Webhook added' : 'Add a webhook'" width="560px" (closed)="newSecret.set(null)">
      @if (newSecret(); as sec) {
        <div class="stack" style="--gap:14px">
          <vc-callout tone="warn" icon="alert"><strong>Copy the signing secret now — it is shown only once.</strong> The receiver uses it to check the <code>X-Signature</code> header on every delivery.</vc-callout>
          <div class="secret"><code>{{ sec }}</code><button class="btn btn-secondary btn-sm" (click)="copy(sec)"><vc-icon [name]="copied() ? 'check' : 'copy'" [size]="14" />{{ copied() ? 'Copied' : 'Copy' }}</button></div>
        </div>
      } @else {
        <form class="stack" style="--gap:14px" id="hookForm" (ngSubmit)="createHook()">
          <div class="field"><label for="hu">Address</label>
            <input id="hu" class="input mono" name="hu" [(ngModel)]="hookUrl" placeholder="https://partner.example.org/hooks/varsapradaya" [class.invalid]="hookUrl && !urlOk()" />
            @if (hookUrl && !urlOk()) { <span class="error">Use an https:// address.</span> } @else { <span class="hint">Must use https.</span> }</div>
          <div class="field"><label for="hd">Description <span class="subtle">(optional)</span></label><input id="hd" class="input" name="hd" [(ngModel)]="hookDesc" placeholder="What the partner does with these events" /></div>
          <div class="field"><label>Events</label>
            <div class="evgrid">
              @for (e of allowedEvents(); track e) {
                <label class="checkbox evopt"><input type="checkbox" [name]="'e_' + e" [(ngModel)]="hookEvents[e]" /><span><code>{{ e }}</code><small>{{ eventInfo(e) }}</small></span></label>
              }
            </div>
          </div>
          @if (formError()) { <vc-error title="Webhook not added" [message]="formError()!" /> }
        </form>
      }
      <ng-container footer>
        @if (newSecret()) { <button class="btn btn-primary" (click)="hookOpen.set(false); newSecret.set(null)">I've stored the secret</button> }
        @else {
          <button class="btn btn-ghost" (click)="hookOpen.set(false)">Cancel</button>
          <button class="btn btn-primary" type="submit" form="hookForm" [disabled]="busy() || !urlOk() || !chosenEvents().length">Add webhook</button>
        }
      </ng-container>
    </vc-modal>

    <!-- deliveries -->
    <vc-modal [(open)]="delOpen" [drawer]="true" width="560px" title="Deliveries" [subtitle]="delHook()?.url ?? ''">
      @if (deliveries.loading()) { <vc-loading [rows]="5" /> }
      @else if (deliveries.error()) { <vc-error title="Couldn't load deliveries" [message]="deliveries.error()!.message" /> }
      @else if (!deliveries.data()?.length) { <vc-empty icon="send" title="Nothing delivered yet" text="Use 'Dispatch pending events' to send events raised since this webhook was added." /> }
      @else {
        <div class="table-wrap"><table class="table">
          <thead><tr><th>When</th><th>Result</th><th class="num">Attempt</th><th>Event</th></tr></thead>
          <tbody>@for (d of deliveries.data(); track d.id) {
            <tr><td class="nowrap small">{{ d.at | day: true }}</td>
              <td><vc-badge [status]="d.ok ? 'delivered' : 'failed'">{{ d.ok ? 'HTTP ' + d.status_code : (d.status_code ? 'HTTP ' + d.status_code : 'Failed') }}</vc-badge>
                @if (d.error) { <div class="small muted err">{{ d.error }}</div> }</td>
              <td class="num">{{ d.attempt }}</td><td><code class="subtle small">{{ d.event_id.slice(0, 8) }}</code></td></tr>
          }</tbody>
        </table></div>
      }
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap} .bar p{max-width:640px}
    .kp{font-size:12.5px;color:var(--stone-700);background:var(--sand-100);padding:2px 6px;border-radius:4px}
    .chips{display:flex;gap:6px;flex-wrap:wrap}
    .scope{font-size:12px;padding:2px 8px;border-radius:999px;background:var(--forest-50);color:var(--forest-700);border:1px solid var(--forest-100);white-space:nowrap}
    tr.dim td{color:var(--text-3)} .dim{opacity:.7}
    .danger-t{color:var(--red-600)}
    .hooks{display:flex;flex-direction:column;gap:12px}
    .hook{padding:16px 18px;display:flex;flex-direction:column;gap:12px}
    .hh{display:flex;align-items:flex-start;gap:12px}
    .hi{display:grid;place-items:center;width:32px;height:32px;border-radius:8px;background:var(--forest-50);color:var(--forest-600);flex:none}
    .hm{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px} .url{font-size:13px;color:var(--stone-900);overflow-wrap:anywhere}
    .he{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--stone-100)}
    .ev code{font-size:11.5px;padding:3px 7px;border-radius:4px;background:var(--sky-100);color:var(--sky-600)}
    .toggle{display:inline-flex;align-items:center;gap:8px;cursor:pointer;flex:none}
    .toggle input{display:none}
    .tr{width:34px;height:20px;border-radius:10px;background:var(--stone-300);position:relative;transition:background .15s}
    .th{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:var(--shadow-sm);transition:left .15s}
    .toggle input:checked + .tr{background:var(--forest-500)} .toggle input:checked + .tr .th{left:16px}
    .evf{width:220px}
    .evc{font-size:12px;color:var(--sky-600)}
    .payload{display:block;max-width:440px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11.5px;color:var(--stone-600)}
    .ref{grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start}
    .ref > section:first-child{grid-column:1 / -1}
    @media (max-width:1000px){.ref{grid-template-columns:1fr}}
    .m{font:600 11px var(--mono);padding:3px 7px;border-radius:4px;background:var(--forest-100);color:var(--forest-700)} .m.post{background:var(--sky-100);color:var(--sky-600)}
    .code{margin:0;padding:16px 20px;background:var(--forest-950);color:#dfe9e2;font:12.5px/1.6 var(--mono);overflow-x:auto;white-space:pre;border-radius:0 0 var(--radius) var(--radius)}
    .card-foot.left{justify-content:flex-start}
    .secret{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:8px;background:var(--forest-950)}
    .secret code{flex:1;color:#e3eee6;font-size:12.5px;overflow-wrap:anywhere}
    .scopt{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid var(--border);border-radius:8px;cursor:pointer}
    .scopt input{accent-color:var(--primary);width:16px;height:16px;margin-top:2px}
    .scopt span{display:flex;flex-direction:column} .scopt strong{font-weight:500;font-size:13.5px} .scopt small{font-size:12px;color:var(--text-3)}
    .scopt.on{border-color:var(--forest-300);background:var(--forest-50)}
    .evgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .evopt{align-items:flex-start} .evopt span{display:flex;flex-direction:column} .evopt code{font-size:12px} .evopt small{font-size:11.5px;color:var(--text-3)}
    .err{max-width:320px;margin-top:3px}
  `],
})
export class PartnersPage {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  tab = signal(this.route.snapshot.queryParamMap.get('tab') ?? 'keys');
  keys = new Remote<ApiKey[]>();
  hooks = new Remote<Webhook[]>();
  events = new Remote<DomainEvent[]>();
  deliveries = new Remote<Delivery[]>();
  allowedEvents = signal<string[]>(Object.keys(EVENT_INFO));
  eventFilter = signal('');
  tabs = computed<TabItem[]>(() => [
    { key: 'keys', label: 'API keys', count: this.keys.data()?.filter(k => k.is_active).length ?? null },
    { key: 'webhooks', label: 'Webhooks', count: this.hooks.data()?.length ?? null },
    { key: 'events', label: 'Events feed' },
    { key: 'reference', label: 'Partner API reference' },
  ]);
  scopes = SCOPES;
  endpoints = ENDPOINTS;
  origin = location.origin;
  curl = `curl ${location.origin}/api/partner/v1/projects \\\n  -H "X-API-Key: vcp_1a2b3c4d_••••••••••••••••••••"\n\n# Record a practice (safe to retry with the same client_ref)\ncurl -X POST ${location.origin}/api/partner/v1/practices \\\n  -H "X-API-Key: vcp_1a2b3c4d_••••••••" -H "Content-Type: application/json" \\\n  -d '{"field_id": "…", "practice_code": "cover_crop",\n       "performed_on": "2026-06-15", "client_ref": "erp-7781"}'`;
  verify = `# Python — compare against the X-Signature header\nimport hmac, hashlib\n\ndef valid(secret: str, body: bytes, header: str) -> bool:\n    expected = "sha256=" + hmac.new(\n        secret.encode(), body, hashlib.sha256).hexdigest()\n    return hmac.compare_digest(expected, header)`;

  busy = signal(false);
  dispatching = signal(false);
  copied = signal(false);
  formError = signal<string | null>(null);
  keyOpen = signal(false);
  newKey = signal<(ApiKey & { key: string }) | null>(null);
  revokeTarget = signal<ApiKey | null>(null);
  keyName = '';
  keyScopes: Record<string, boolean> = { read: true };
  chosenScopes = () => SCOPES.filter(s => this.keyScopes[s.key]).map(s => s.key);
  hookOpen = signal(false);
  newSecret = signal<string | null>(null);
  hookUrl = '';
  hookDesc = '';
  hookEvents: Record<string, boolean> = {};
  chosenEvents = () => this.allowedEvents().filter(e => this.hookEvents[e]);
  urlOk = () => /^https:\/\/[^\s/]+\.[^\s]+/.test(this.hookUrl.trim()) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(this.hookUrl.trim());
  delOpen = signal(false);
  delHook = signal<Webhook | null>(null);

  constructor() {
    this.keys.load(this.api.get<ApiKey[]>('/partners/api-keys'));
    this.hooks.load(this.api.get<Webhook[]>('/partners/webhooks'));
    this.api.get<string[]>('/partners/webhook-events').subscribe({ next: e => this.allowedEvents.set(e), error: () => {} });
    effect(() => {
      const t = this.tab();
      untracked(() => this.router.navigate([], { queryParams: { tab: t === 'keys' ? null : t }, replaceUrl: true }));
    });
    effect(() => {
      const f = this.eventFilter();
      untracked(() => this.events.load(this.api.get<DomainEvent[]>('/partners/events', { event: f, limit: 200 }), true));
    });
  }

  loadEvents() { this.events.load(this.api.get<DomainEvent[]>('/partners/events', { event: this.eventFilter(), limit: 200 }), true); }
  scopeLabel(s: string) { return SCOPES.find(x => x.key === s)?.label ?? s; }
  scopesText(s: string[]) { return s.map(x => this.scopeLabel(x)).join(', '); }
  eventInfo(e: string) { return EVENT_INFO[e] ?? ''; }
  preview(p: Record<string, unknown>) {
    return Object.entries(p ?? {}).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join(' · ');
  }
  copy(text: string) {
    navigator.clipboard?.writeText(text);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1600);
  }

  openKey() {
    this.keyName = '';
    this.keyScopes = { read: true };
    this.newKey.set(null);
    this.formError.set(null);
    this.keyOpen.set(true);
  }
  createKey() {
    this.busy.set(true);
    this.formError.set(null);
    this.api.post<ApiKey & { key: string }>('/partners/api-keys', { name: this.keyName.trim(), scopes: this.chosenScopes() }).subscribe({
      next: k => { this.busy.set(false); this.newKey.set(k); this.keys.load(this.api.get<ApiKey[]>('/partners/api-keys'), true); },
      error: (e: ApiError) => { this.busy.set(false); this.formError.set(e.message); },
    });
  }
  revoke() {
    const k = this.revokeTarget();
    if (!k) return;
    this.busy.set(true);
    this.api.post<ApiKey>(`/partners/api-keys/${k.id}/revoke`).subscribe({
      next: () => { this.busy.set(false); this.revokeTarget.set(null); this.toast.success('Key revoked', k.name); this.keys.load(this.api.get<ApiKey[]>('/partners/api-keys'), true); },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e, "Couldn't revoke the key"); },
    });
  }

  openHook() {
    this.hookUrl = '';
    this.hookDesc = '';
    this.hookEvents = { 'result.approved': true };
    this.newSecret.set(null);
    this.formError.set(null);
    this.hookOpen.set(true);
  }
  createHook() {
    this.busy.set(true);
    this.formError.set(null);
    this.api.post<Webhook>('/partners/webhooks', { url: this.hookUrl.trim(), events: this.chosenEvents(), description: this.hookDesc.trim() }).subscribe({
      next: w => {
        this.busy.set(false);
        this.hooks.load(this.api.get<Webhook[]>('/partners/webhooks'), true);
        if (w.secret) this.newSecret.set(w.secret);
        else { this.hookOpen.set(false); this.toast.success('Webhook added', w.url); }
      },
      error: (e: ApiError) => { this.busy.set(false); this.formError.set(e.message); },
    });
  }
  toggleHook(w: Webhook, on: boolean) {
    this.api.patch<Webhook>(`/partners/webhooks/${w.id}`, { is_active: on }).subscribe({
      next: () => { this.toast.success(on ? 'Webhook enabled' : 'Webhook disabled', w.url); this.hooks.load(this.api.get<Webhook[]>('/partners/webhooks'), true); },
      error: (e: ApiError) => { this.toast.apiError(e, "Couldn't change the webhook"); this.hooks.load(this.api.get<Webhook[]>('/partners/webhooks'), true); },
    });
  }
  openDeliveries(w: Webhook) {
    this.delHook.set(w);
    this.deliveries.load(this.api.get<Delivery[]>(`/partners/webhooks/${w.id}/deliveries`));
    this.delOpen.set(true);
  }
  dispatch() {
    this.dispatching.set(true);
    this.api.post<{ attempted: number; delivered: number; failed: number; gave_up: number }>('/partners/webhooks/dispatch').subscribe({
      next: s => {
        this.dispatching.set(false);
        if (!s.attempted) this.toast.info('Nothing to send', 'All subscribed events have already been delivered.');
        else if (s.failed) this.toast.error(`${s.delivered} delivered, ${s.failed} failed`, 'Failed deliveries are retried next time. Open a webhook\'s deliveries to see why.');
        else this.toast.success(`${s.delivered} events delivered`);
      },
      error: (e: ApiError) => { this.dispatching.set(false); this.toast.apiError(e, "Couldn't dispatch events"); },
    });
  }
}
