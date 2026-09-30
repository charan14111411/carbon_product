import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, Empty, ErrorBox, Loading, Modal, PageHeader, TabItem, Tabs } from '../../ui/kit';
import { ConfirmDialog } from '../programmes/confirm';
import { fieldMap, formMessage } from '../programmes/form-errors';

interface UserRow {
  id: string; email: string; full_name: string; phone: string | null; role: string; role_label: string;
  language: string; is_active: boolean; mfa_enabled: boolean; scope: Record<string, string>; last_login_at: string | null;
}
interface Role { role: string; label: string; permissions: string[] }

const ROLE_TEXT: Record<string, string> = {
  platform_admin: 'Full access to everything, including organisation settings.',
  programme_admin: 'Runs programmes: farmers, land, sampling plans, credits, sales and approvals of calculations.',
  mrv_analyst: 'Runs quality checks and carbon calculations; plans sampling.',
  methodology_owner: 'Owns the methodology rules and soil-carbon models, and approves sampling designs.',
  field_collector: 'Uses the field app to map fields, collect soil samples and record practices.',
  lab_technician: 'Enters lab results and records sample custody at the lab.',
  lab_manager: 'Reviews and accepts lab results.',
  verifier: 'Independent verifier with read-only access to verification packages.',
  buyer: 'Credit buyer who sees their own portfolio and retirement records.',
  finance_maker: 'Prepares farmer payout batches.',
  finance_checker: 'Approves payout batches prepared by someone else.',
  farmer: 'A farmer using the self-service portal.',
};

const GROUPS: { key: string; label: string; perms: [string, string][] }[] = [
  { key: 'admin', label: 'Organisation & users', perms: [['org.manage', 'Organisation settings'], ['users.manage', 'Users & roles'], ['partners.manage', 'Partners & API keys']] },
  { key: 'prog', label: 'Programmes & land', perms: [['data.read', 'View data'], ['programmes.manage', 'Programmes & projects'], ['farmers.manage', 'Farmers'], ['land.manage', 'Fields & land'], ['catalogue.manage', 'Crop catalogue'], ['practice.record', 'Record practices']] },
  { key: 'method', label: 'Methodology', perms: [['rules.edit', 'Edit rules'], ['rules.approve', 'Approve rules']] },
  { key: 'field', label: 'Field & lab', perms: [['sampling.plan', 'Plan sampling'], ['sampling.approve', 'Approve sample plans'], ['sample.collect', 'Collect samples'], ['custody.record', 'Record custody'], ['lab.submit', 'Enter lab results'], ['lab.review', 'Review lab results']] },
  { key: 'carbon', label: 'Carbon accounting', perms: [['qa.resolve', 'Resolve quality issues'], ['calc.run', 'Run calculations'], ['calc.approve', 'Approve calculations'], ['package.issue', 'Issue verification packages'], ['verify.read', 'Verifier access']] },
  { key: 'intel', label: 'Intelligence', perms: [['models.manage', 'Manage models'], ['models.approve', 'Approve models'], ['data.sync', 'Sync supporting data']] },
  { key: 'money', label: 'Credits & money', perms: [['credits.manage', 'Credits'], ['sales.manage', 'Sales'], ['buyer.read', 'Buyer portfolio'], ['payout.prepare', 'Prepare payouts'], ['payout.approve', 'Approve payouts'], ['risk.manage', 'Risk & permanence'], ['grievance.handle', 'Grievances']] },
  { key: 'self', label: 'Farmer self-service', perms: [['farmer.self', 'Own records']] },
];

@Component({
  selector: 'vc-users-page',
  imports: [FormsModule, PageHeader, Loading, ErrorBox, Empty, Badge, Modal, Tabs, Icon, Callout, ConfirmDialog, DayPipe, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Users & roles" eyebrow="Administration"
      subtitle="Who can sign in and what each role may do. Roles are fixed in code and reviewed — you choose which role each person has.">
      @if (tab() === 'users' && canManage) {
        <button actions class="btn btn-primary" (click)="openCreate()"><vc-icon name="user-plus" />Invite user</button>
      }
    </vc-page-header>

    <vc-tabs [tabs]="tabs()" [(active)]="tab" />

    @if (tab() === 'users') {
      <div class="filters">
        <div class="search">
          <vc-icon name="search" [size]="15" />
          <input class="input" placeholder="Search name or email…" [ngModel]="q()" (ngModelChange)="q.set($event)" />
        </div>
        <select class="input w" [ngModel]="roleFilter()" (ngModelChange)="roleFilter.set($event)">
          <option value="">All roles</option>
          @for (r of roles(); track r.role) { <option [value]="r.role">{{ r.label }}</option> }
        </select>
        <label class="checkbox"><input type="checkbox" [ngModel]="showInactive()" (ngModelChange)="showInactive.set($event)" />Show deactivated</label>
      </div>
      <section class="card">
        @if (loading()) {
          <vc-loading [rows]="7" />
        } @else if (error()) {
          <div class="card-body"><vc-error title="Couldn't load users" [message]="error()!" /></div>
        } @else if (!rows().length) {
          <vc-empty icon="users" title="No matching users" text="Try another search or role." />
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Name</th><th>Role</th><th>Two-step</th><th>Last sign-in</th><th>Status</th><th></th></tr></thead>
              <tbody>
                @for (u of rows(); track u.id) {
                  <tr [class.dim]="!u.is_active">
                    <td>
                      <div class="who">
                        <span class="av">{{ ini(u.full_name) }}</span>
                        <span class="nm"><strong>{{ u.full_name }} @if (u.id === me) { <span class="you">You</span> }</strong><span class="subtle small">{{ u.email }}</span></span>
                      </div>
                    </td>
                    <td>{{ u.role_label }}</td>
                    <td>
                      @if (u.mfa_enabled) { <span class="mfa on"><vc-icon name="shield-check" [size]="14" />On</span> }
                      @else { <span class="mfa"><vc-icon name="shield" [size]="14" />Off</span> }
                    </td>
                    <td class="nowrap">@if (u.last_login_at) { <span [title]="u.last_login_at | day: true">{{ u.last_login_at | ago }}</span> } @else { <span class="subtle">Never</span> }</td>
                    <td><vc-badge [status]="u.is_active ? 'active' : 'inactive'" /></td>
                    <td class="num">@if (canManage) { <button class="btn btn-ghost btn-sm" (click)="openEdit(u)"><vc-icon name="pencil" [size]="14" />Edit</button> }</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    } @else {
      <div class="matrix card">
        <div class="table-wrap">
          <table class="table mx">
            <thead>
              <tr><th class="stickycol">Permission</th>
                @for (r of roles(); track r.role) { <th class="rh"><span [title]="roleText(r.role)">{{ r.label }}</span></th> }
              </tr>
            </thead>
            <tbody>
              @for (g of groups; track g.key) {
                <tr class="grp"><td class="stickycol" [attr.colspan]="1">{{ g.label }}</td>@for (r of roles(); track r.role) { <td></td> }</tr>
                @for (p of g.perms; track p[0]) {
                  <tr>
                    <td class="stickycol"><span>{{ p[1] }}</span><code>{{ p[0] }}</code></td>
                    @for (r of roles(); track r.role) {
                      <td class="cell">@if (has(r, p[0])) { <span class="yes" [title]="r.label + ': ' + p[1]"><vc-icon name="check" [size]="13" [stroke]="2.6" /></span> } @else { <span class="no"></span> }</td>
                    }
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>
      <div class="roles grid grid-3">
        @for (r of roles(); track r.role) {
          <div class="card rc">
            <div class="row" style="--gap:8px"><strong>{{ r.label }}</strong><span class="spacer"></span><span class="small subtle num">{{ r.permissions.length }} permissions</span></div>
            <p>{{ roleText(r.role) }}</p>
          </div>
        }
      </div>
    }

    <!-- invite / create -->
    <vc-modal [(open)]="createOpen" [drawer]="true" width="520px" title="Invite user" subtitle="They sign in with this email and the temporary password. Share it securely.">
      <form class="stack" style="--gap:14px" id="user-form" (ngSubmit)="create()">
        <div class="field">
          <label for="un">Full name</label>
          <input id="un" class="input" name="name" [(ngModel)]="f.full_name" [class.invalid]="fe()['full_name']" />
          @if (fe()['full_name']) { <span class="error">{{ fe()['full_name'] }}</span> }
        </div>
        <div class="field">
          <label for="ue">Work email</label>
          <input id="ue" class="input" type="email" name="email" [(ngModel)]="f.email" [class.invalid]="fe()['email']" />
          @if (fe()['email']) { <span class="error">{{ fe()['email'] }}</span> }
        </div>
        <div class="field">
          <label for="uph">Mobile <span class="subtle">(optional)</span></label>
          <input id="uph" class="input num" name="phone" [(ngModel)]="f.phone" />
        </div>
        <div class="field">
          <label>Role</label>
          <div class="rolepick">
            @for (r of assignable(); track r.role) {
              <label class="ropt" [class.on]="f.role === r.role">
                <input type="radio" name="role" [value]="r.role" [(ngModel)]="f.role" />
                <span><strong>{{ r.label }}</strong><small>{{ roleText(r.role) }}</small></span>
                <span class="pc num">{{ r.permissions.length }}</span>
              </label>
            }
          </div>
        </div>
        <div class="field">
          <label for="upw">Temporary password</label>
          <div class="row" style="--gap:8px">
            <input id="upw" class="input mono" name="pw" [type]="showPw() ? 'text' : 'password'" [(ngModel)]="f.password" autocomplete="new-password" [class.invalid]="fe()['password']" />
            <button type="button" class="btn btn-ghost btn-sm" (click)="showPw.set(!showPw())">{{ showPw() ? 'Hide' : 'Show' }}</button>
            <button type="button" class="btn btn-secondary btn-sm" (click)="generate()">Generate</button>
          </div>
          <ul class="rules">
            <li [class.ok]="f.password.length >= 10"><vc-icon [name]="f.password.length >= 10 ? 'check' : 'dot'" [size]="12" />At least 10 characters</li>
            <li [class.ok]="mixed()"><vc-icon [name]="mixed() ? 'check' : 'dot'" [size]="12" />Letters and numbers (recommended)</li>
          </ul>
          @if (fe()['password']) { <span class="error">{{ fe()['password'] }}</span> }
        </div>
        @if (formError()) { <vc-error title="Couldn't create the user" [message]="formError()!" /> }
      </form>
      <ng-container footer>
        <button class="btn btn-secondary" type="button" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="user-form" [disabled]="busy() || !f.full_name.trim() || !f.email.trim() || !f.role || f.password.length < 10">
          {{ busy() ? 'Creating…' : 'Create user' }}</button>
      </ng-container>
    </vc-modal>

    <!-- edit -->
    <vc-modal [(open)]="editOpen" width="520px" [title]="editing()?.full_name ?? ''" [subtitle]="editing()?.email ?? ''">
      @if (editing(); as u) {
        <div class="stack" style="--gap:16px">
          <div class="field">
            <label for="erl">Role</label>
            <select id="erl" class="input" [(ngModel)]="edit.role">
              @for (r of assignable(); track r.role) { <option [value]="r.role">{{ r.label }} · {{ r.permissions.length }} permissions</option> }
            </select>
            <span class="hint">{{ roleText(edit.role) }}</span>
          </div>
          <div class="toggle-row">
            <div><strong>Account active</strong><p class="small muted">Deactivated users can’t sign in. Their history stays in the audit log.</p></div>
            <label class="switch" [class.disabled]="u.id === me">
              <input type="checkbox" [(ngModel)]="edit.is_active" [disabled]="u.id === me" />
              <span class="knob"></span>
            </label>
          </div>
          @if (u.id === me) { <vc-callout tone="info" icon="info">You can’t deactivate your own account. Ask another administrator.</vc-callout> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-secondary" (click)="editOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="saveEdit()">{{ busy() ? 'Saving…' : 'Save changes' }}</button>
      </ng-container>
    </vc-modal>

    <vc-confirm [(open)]="deactivateOpen" title="Deactivate user" confirmLabel="Deactivate" tone="danger" icon="ban" [busy]="busy()"
      [message]="(editing()?.full_name ?? '') + ' will be signed out and can’t sign in again until reactivated.'" (confirmed)="commitEdit()" />
  `,
  styles: [`
    .filters{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;align-items:center}
    .search{position:relative;flex:1;min-width:240px;max-width:380px}
    .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)}
    .search .input{padding-left:34px}
    .w{width:220px}
    .who{display:flex;align-items:center;gap:10px}
    .av{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:var(--sand-200);color:var(--stone-700);font-size:12px;font-weight:600;flex:none}
    .nm{display:flex;flex-direction:column;line-height:1.3}
    .you{display:inline-flex;height:18px;align-items:center;padding:0 6px;margin-left:6px;border-radius:4px;background:var(--forest-100);color:var(--forest-700);font-size:11px;font-weight:600;vertical-align:1px}
    tr.dim td{color:var(--text-3)}
    .mfa{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;color:var(--text-3)}
    .mfa.on{color:var(--forest-700)}
    .matrix{margin-bottom:16px}
    .mx th.rh{text-align:center;white-space:normal;min-width:70px;max-width:84px;padding:10px 4px;line-height:1.25;vertical-align:bottom;font-size:11.5px}
    .stickycol{position:sticky;left:0;background:var(--surface);z-index:2;min-width:200px;border-right:1px solid var(--stone-100)}
    th.stickycol{background:var(--surface-2);z-index:3}
    .stickycol span{display:block;font-size:13px} .stickycol code{font-size:11px;color:var(--text-3)}
    tr.grp td{background:var(--surface-2);font-size:11.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--stone-600);padding:8px 14px}
    .mx td{padding:7px 12px}
    .mx td.cell{padding:7px 4px}
    .cell{text-align:center;border-left:1px solid var(--stone-100)}
    .yes{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:5px;background:var(--forest-600);color:#fff}
    .no{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--stone-200)}
    .rc{padding:14px 16px} .rc p{margin-top:4px;font-size:12.5px;color:var(--text-2);line-height:1.45}
    .rolepick{display:flex;flex-direction:column;gap:6px;max-height:320px;overflow:auto;padding-right:2px}
    .ropt{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid var(--border);border-radius:8px;cursor:pointer}
    .ropt:hover{border-color:var(--stone-400)}
    .ropt.on{border-color:var(--forest-500);background:var(--forest-50)}
    .ropt input{accent-color:var(--primary);margin-top:3px}
    .ropt span:not(.pc){flex:1;display:flex;flex-direction:column} .ropt strong{font-size:13px} .ropt small{font-size:12px;color:var(--text-2);line-height:1.4}
    .pc{font-size:11.5px;color:var(--text-3);background:var(--sand-100);border-radius:4px;padding:1px 6px;height:fit-content}
    .rules{list-style:none;margin:4px 0 0;padding:0;display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:var(--text-3)}
    .rules li{display:inline-flex;align-items:center;gap:5px} .rules li.ok{color:var(--forest-700)}
    .toggle-row{display:flex;gap:16px;align-items:center;padding:12px 14px;border:1px solid var(--border);border-radius:8px}
    .toggle-row > div{flex:1}
    .switch{position:relative;width:40px;height:22px;flex:none;cursor:pointer}
    .switch input{opacity:0;width:0;height:0;position:absolute}
    .knob{position:absolute;inset:0;border-radius:11px;background:var(--stone-300);transition:background .15s}
    .knob::after{content:'';position:absolute;left:3px;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:var(--shadow-sm);transition:transform .15s}
    .switch input:checked + .knob{background:var(--forest-600)}
    .switch input:checked + .knob::after{transform:translateX(18px)}
    .switch input:focus-visible + .knob{box-shadow:var(--focus)}
    .switch.disabled{opacity:.5;cursor:not-allowed}
  `],
})
export class UsersPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  canManage = this.auth.can('users.manage');
  me = this.auth.profile()?.id;
  groups = GROUPS;

  tab = signal('users');
  all = signal<UserRow[]>([]);
  roles = signal<Role[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  q = signal('');
  roleFilter = signal('');
  showInactive = signal(true);
  rows = computed(() => {
    const q = this.q().trim().toLowerCase();
    return this.all().filter(u => (this.showInactive() || u.is_active) && (!this.roleFilter() || u.role === this.roleFilter()) &&
      (!q || u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
  });
  tabs = computed<TabItem[]>(() => [
    { key: 'users', label: 'Users', count: this.all().length },
    { key: 'roles', label: 'Roles & permissions', count: this.roles().length },
  ]);
  /** Only a platform administrator can grant the administrator role. */
  assignable = computed(() => this.roles().filter(r => r.role !== 'platform_admin' || this.auth.profile()?.role === 'platform_admin'));

  busy = signal(false);
  createOpen = signal(false);
  showPw = signal(false);
  formError = signal<string | null>(null);
  fe = signal<Record<string, string>>({});
  f = this.blank();

  editOpen = signal(false);
  deactivateOpen = signal(false);
  editing = signal<UserRow | null>(null);
  edit = { role: '', is_active: true };

  constructor() {
    this.load();
    this.api.get<Role[]>('/auth/roles').subscribe({ next: r => this.roles.set(r), error: () => {} });
  }

  ini(n: string) { return n.split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase(); }
  roleText(r: string) { return ROLE_TEXT[r] ?? ''; }
  has(r: Role, p: string) { return r.permissions.includes(p); }
  mixed() { return /[a-z]/i.test(this.f.password) && /\d/.test(this.f.password); }

  load() {
    this.loading.set(true);
    this.api.get<UserRow[]>('/users').subscribe({
      next: r => { this.all.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  private blank() { return { full_name: '', email: '', phone: '', role: '', password: '' }; }

  openCreate() {
    this.f = this.blank();
    this.formError.set(null);
    this.fe.set({});
    this.showPw.set(false);
    this.createOpen.set(true);
  }

  generate() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    const a = new Uint32Array(14);
    crypto.getRandomValues(a);
    let pw = Array.from(a, n => chars[n % chars.length]).join('');
    pw = pw.slice(0, 5) + '-' + pw.slice(5, 10) + '-' + (a[0] % 90 + 10);
    this.f.password = pw;
    this.showPw.set(true);
  }

  create() {
    const f = this.f;
    this.busy.set(true);
    this.formError.set(null);
    this.fe.set({});
    this.api.post<UserRow>('/users', {
      full_name: f.full_name.trim(), email: f.email.trim(), phone: f.phone.trim() || null, role: f.role, password: f.password,
    }).subscribe({
      next: u => {
        this.busy.set(false);
        this.createOpen.set(false);
        this.all.set([...this.all(), u].sort((a, b) => a.full_name.localeCompare(b.full_name)));
        this.toast.success('User created', `${u.full_name} can now sign in as ${u.role_label}.`);
      },
      error: (e: ApiError) => {
        this.busy.set(false);
        const m = fieldMap(e);
        this.fe.set(m);
        this.formError.set(formMessage(e, m));
      },
    });
  }

  openEdit(u: UserRow) {
    this.editing.set(u);
    this.edit = { role: u.role, is_active: u.is_active };
    this.editOpen.set(true);
  }

  saveEdit() {
    const u = this.editing();
    if (!u) return;
    if (u.is_active && !this.edit.is_active) { this.deactivateOpen.set(true); return; }
    this.commitEdit();
  }

  commitEdit() {
    const u = this.editing();
    if (!u) return;
    const body: Record<string, unknown> = {};
    if (this.edit.role !== u.role) body['role'] = this.edit.role;
    if (this.edit.is_active !== u.is_active) body['is_active'] = this.edit.is_active;
    if (!Object.keys(body).length) { this.editOpen.set(false); return; }
    this.busy.set(true);
    this.api.patch<UserRow>(`/users/${u.id}`, body).subscribe({
      next: r => {
        this.busy.set(false);
        this.editOpen.set(false);
        this.deactivateOpen.set(false);
        this.all.set(this.all().map(x => (x.id === r.id ? r : x)));
        this.toast.success('User updated', `${r.full_name} · ${r.role_label}${r.is_active ? '' : ' · deactivated'}`);
      },
      error: (e: ApiError) => { this.busy.set(false); this.deactivateOpen.set(false); this.toast.apiError(e, "Couldn't update the user"); },
    });
  }
}
