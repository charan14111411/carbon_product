import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ApiError, ApiService, Page } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, HumanPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT, TimelineItem } from '../../ui/kit';
import { Remote, addDays, isoDate } from '../supporting/shared';

interface HistoryEntry { at: string; by: string; by_name: string; status: string; note: string; assigned_to?: string }
interface Grievance {
  id: string; code: string; farmer_id: string | null; category: string; subject: string; description: string; channel: string;
  priority: 'low' | 'normal' | 'high'; status: 'open' | 'in_progress' | 'resolved' | 'appealed' | 'closed'; assigned_to: string | null;
  due_on: string; overdue: boolean; resolution: string | null; resolved_at: string | null; history: HistoryEntry[]; created_at: string;
}
interface UserLite { id: string; full_name: string; role_label: string; is_active: boolean }
interface FarmerLite { id: string; code: string; full_name: string; village: string; district: string }

const CATEGORIES = [
  { key: 'payment', label: 'Payment' }, { key: 'enrolment', label: 'Enrolment' }, { key: 'sampling', label: 'Sampling' },
  { key: 'data', label: 'Data & records' }, { key: 'other', label: 'Other' },
];
const CHANNELS = [
  { key: 'app', label: 'Farmer app' }, { key: 'whatsapp', label: 'WhatsApp' }, { key: 'ivr', label: 'IVR call line' },
  { key: 'phone', label: 'Phone call' }, { key: 'paper', label: 'Paper form' }, { key: 'field_officer', label: 'Field officer' }, { key: 'email', label: 'Email' },
];
const DUE_DAYS: Record<string, number> = { high: 3, normal: 7, low: 14 };
const FLOW: Record<string, { to: string; label: string; icon: string; kind: 'primary' | 'secondary' | 'danger' }[]> = {
  open: [{ to: 'in_progress', label: 'Start working on it', icon: 'play', kind: 'primary' }],
  in_progress: [{ to: 'resolved', label: 'Resolve', icon: 'check-circle', kind: 'primary' }],
  resolved: [{ to: 'closed', label: 'Close case', icon: 'lock', kind: 'secondary' }, { to: 'appealed', label: 'Record an appeal', icon: 'undo', kind: 'secondary' }],
  appealed: [{ to: 'in_progress', label: 'Reopen for review', icon: 'play', kind: 'primary' }],
  closed: [],
};

@Component({
  selector: 'vc-grievances-page',
  imports: [...KIT, FormsModule, DayPipe, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Grievances" eyebrow="Care"
      subtitle="Every concern a farmer raises — by app, WhatsApp, phone or in person — tracked to a written resolution within the promised time.">
      @if (canCreate()) { <button actions class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New case</button> }
    </vc-page-header>

    <div class="stats">
      <button type="button" class="st" [class.on]="!status() && !overdueOnly()" (click)="status.set(''); overdueOnly.set(false)"><span>All open work</span><strong class="num">{{ openCount() }}</strong></button>
      <button type="button" class="st danger" [class.on]="overdueOnly()" (click)="overdueOnly.set(!overdueOnly())"><span>Overdue</span><strong class="num">{{ overdueCount() }}</strong></button>
      <button type="button" class="st" [class.on]="mine()" (click)="mine.set(!mine())"><span>Assigned to me</span><strong class="num">{{ mineCount() }}</strong></button>
      <button type="button" class="st" [class.on]="status() === 'appealed'" (click)="status.set(status() === 'appealed' ? '' : 'appealed')"><span>Appealed</span><strong class="num">{{ countBy('appealed') }}</strong></button>
    </div>

    <div class="filters">
      <div class="search"><vc-icon name="search" [size]="15" />
        <input class="input" placeholder="Search by case number, subject or farmer…" [ngModel]="q()" (ngModelChange)="q.set($event)" /></div>
      <select class="input" [ngModel]="status()" (ngModelChange)="status.set($event)" aria-label="Status">
        <option value="">Any status</option>
        @for (s of statuses; track s) { <option [value]="s">{{ s | human }}</option> }
      </select>
      <select class="input" [ngModel]="category()" (ngModelChange)="category.set($event)" aria-label="Category">
        <option value="">Any category</option>
        @for (c of categories; track c.key) { <option [value]="c.key">{{ c.label }}</option> }
      </select>
      <select class="input" [ngModel]="priority()" (ngModelChange)="priority.set($event)" aria-label="Priority">
        <option value="">Any priority</option><option value="high">High</option><option value="normal">Normal</option><option value="low">Low</option>
      </select>
    </div>

    <section class="card">
      @if (list.loading() && !list.data()) {
        <vc-loading [rows]="6" />
      } @else if (list.error()) {
        <div class="card-body"><vc-error title="Couldn't load grievances" [message]="list.error()!.message" /></div>
      } @else if (!rows().length) {
        <vc-empty icon="message" [title]="filtered() ? 'No cases match these filters' : 'No grievances recorded'"
          [text]="filtered() ? 'Try clearing a filter.' : 'When a farmer raises a concern, record it here so it is answered on time and in writing.'" />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Case</th><th>Subject</th><th>Category</th><th>Priority</th><th>Status</th><th>Assigned</th><th>Due</th></tr></thead>
            <tbody>
              @for (g of rows(); track g.id) {
                <tr class="clickable" (click)="openDetail(g)" [class.od]="g.overdue">
                  <td class="mono small nowrap">{{ g.code }}</td>
                  <td><div class="sj"><strong class="truncate">{{ g.subject }}</strong><span class="small subtle">{{ farmerName(g.farmer_id) }} · {{ channelLabel(g.channel) }}</span></div></td>
                  <td>{{ catLabel(g.category) }}</td>
                  <td><span class="pri" [class]="'p-' + g.priority">{{ g.priority | human }}</span></td>
                  <td><vc-badge [status]="g.status" /></td>
                  <td>@if (g.assigned_to) { <span class="as"><span class="av">{{ initials(g.assigned_to) }}</span>{{ userName(g.assigned_to) }}</span> } @else { <span class="subtle">Unassigned</span> }</td>
                  <td class="nowrap">
                    @if (g.overdue) { <span class="ovd"><vc-icon name="clock" [size]="12" />Overdue · {{ g.due_on | day }}</span> }
                    @else if (g.status === 'resolved' || g.status === 'closed') { <span class="subtle">{{ g.due_on | day }}</span> }
                    @else { {{ g.due_on | day }} <span class="small subtle">{{ dueIn(g.due_on) }}</span> }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <!-- detail drawer -->
    <vc-modal [(open)]="detailOpen" [drawer]="true" width="560px" [title]="sel()?.subject ?? ''" [subtitle]="sel() ? sel()!.code + ' · ' + farmerName(sel()!.farmer_id) : ''">
      @if (sel(); as g) {
        <div class="stack" style="--gap:20px">
          <div class="chips">
            <vc-badge [status]="g.status" />
            <span class="pri" [class]="'p-' + g.priority">{{ g.priority | human }} priority</span>
            <span class="chip">{{ catLabel(g.category) }}</span>
            <span class="chip">{{ channelLabel(g.channel) }}</span>
            @if (g.overdue) { <span class="ovd"><vc-icon name="clock" [size]="12" />Overdue since {{ g.due_on | day }}</span> }
            @else { <span class="chip">Due {{ g.due_on | day }}</span> }
          </div>
          <div class="desc">{{ g.description }}</div>
          @if (g.resolution) {
            <vc-callout tone="ok" icon="check-circle"><strong>Resolution</strong> <span class="small subtle">{{ g.resolved_at | day: true }}</span><p style="margin-top:4px">{{ g.resolution }}</p></vc-callout>
          }

          @if (canHandle() && g.status !== 'closed') {
            <section class="act card card-pad">
              <div class="field">
                <label for="as">Assigned to</label>
                <div class="row" style="--gap:8px">
                  <select id="as" class="input" [(ngModel)]="assignee"><option value="">Choose a person…</option>
                    @for (u of activeUsers(); track u.id) { <option [value]="u.id">{{ u.full_name }} · {{ u.role_label }}</option> }</select>
                  <button class="btn btn-secondary" [disabled]="!assignee || assignee === g.assigned_to || busy()" (click)="assign(g)">Assign</button>
                </div>
              </div>
              @if (transitions(g).length) {
                <hr style="margin:4px 0" />
                <div class="field">
                  <label for="nt">Note {{ needsNote(g) ? '' : '(optional)' }}</label>
                  <input id="nt" class="input" [(ngModel)]="note" [placeholder]="g.status === 'resolved' ? 'Required for an appeal: why is the farmer appealing?' : 'Added to the case history'" />
                </div>
                @if (g.status === 'in_progress') {
                  <div class="field"><label for="rs">Resolution</label>
                    <textarea id="rs" class="input" rows="3" [(ngModel)]="resolution" placeholder="Explain what was done, in words the farmer will understand."></textarea>
                    <span class="hint">Required to resolve. The farmer sees this.</span></div>
                }
                @if (actionError()) { <vc-error title="Not changed" [message]="actionError()!" /> }
                <div class="row wrap" style="--gap:8px;justify-content:flex-end">
                  @for (t of transitions(g); track t.to) {
                    <button class="btn" [class]="'btn-' + t.kind" [disabled]="busy() || (t.to === 'resolved' && !resolution.trim()) || (t.to === 'appealed' && !note.trim())"
                      (click)="t.to === 'closed' ? closeConfirm.set(true) : move(g, t.to)"><vc-icon [name]="t.icon" />{{ t.label }}</button>
                  }
                </div>
              }
            </section>
          }

          <section>
            <h3 class="hh">History</h3>
            <vc-timeline [items]="timeline(g)" />
          </section>
        </div>
      }
    </vc-modal>

    <vc-modal [(open)]="closeConfirm" title="Close this case?" width="440px">
      <p>A closed case can't be reopened or reassigned. Close it only when the farmer has accepted the resolution or the appeal period has passed.</p>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="closeConfirm.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="move(sel()!, 'closed'); closeConfirm.set(false)">Close case</button>
      </ng-container>
    </vc-modal>

    <!-- create -->
    <vc-modal [(open)]="createOpen" title="New grievance" subtitle="Record the farmer's concern in their words" width="600px">
      <form class="form-grid" id="gForm" (ngSubmit)="create()">
        <div class="field span-2">
          <label for="fq">Farmer</label>
          @if (pickedFarmer(); as f) {
            <div class="picked"><span class="av">{{ f.full_name.slice(0, 1) }}</span><div><strong>{{ f.full_name }}</strong><span class="small subtle">{{ f.code }} · {{ f.village }}, {{ f.district }}</span></div>
              <span class="spacer"></span><button type="button" class="btn btn-ghost btn-sm" (click)="pickedFarmer.set(null)">Change</button></div>
          } @else {
            <input id="fq" class="input" name="fq" [ngModel]="farmerQ()" (ngModelChange)="farmerQ.set($event)" placeholder="Search by name, code or phone…" autocomplete="off" />
            @if (farmerQ().trim().length >= 2) {
              <ul class="fres">
                @for (f of farmerHits.data() ?? []; track f.id) {
                  <li (click)="pickedFarmer.set(f)"><strong>{{ f.full_name }}</strong><span class="small subtle">{{ f.code }} · {{ f.village }}</span></li>
                } @empty { <li class="muted small">{{ farmerHits.loading() ? 'Searching…' : 'No farmer found.' }}</li> }
              </ul>
            }
            <span class="hint">Leave empty for a concern that isn't about one farmer.</span>
          }
        </div>
        <div class="field"><label for="gc">Category</label>
          <select id="gc" class="input" name="gc" [(ngModel)]="nf.category">@for (c of categories; track c.key) { <option [value]="c.key">{{ c.label }}</option> }</select></div>
        <div class="field"><label for="gch">Received by</label>
          <select id="gch" class="input" name="gch" [(ngModel)]="nf.channel">@for (c of channels; track c.key) { <option [value]="c.key">{{ c.label }}</option> }</select></div>
        <div class="field span-2"><label for="gs">Subject</label><input id="gs" class="input" name="gs" [(ngModel)]="nf.subject" placeholder="e.g. Second payout instalment not received" /></div>
        <div class="field span-2"><label for="gd">Description</label><textarea id="gd" class="input" name="gd" rows="4" [(ngModel)]="nf.description" placeholder="What the farmer said, dates, amounts, who they spoke to."></textarea></div>
        <div class="field span-2">
          <label>Priority</label>
          <div class="prio">
            @for (p of ['high', 'normal', 'low']; track p) {
              <label class="popt" [class.on]="nf.priority === p"><input type="radio" name="gp" [value]="p" [(ngModel)]="nf.priority" />
                <strong>{{ p | human }}</strong><small>Answer within {{ dueDays[p] }} days</small></label>
            }
          </div>
        </div>
        <div class="span-2 due"><vc-icon name="calendar" [size]="15" />Response due by <strong>{{ dueDate() | day }}</strong></div>
        @if (formError()) { <div class="span-2"><vc-error title="Not saved" [message]="formError()!" /></div> }
      </form>
      <ng-container footer>
        <button class="btn btn-ghost" type="button" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="gForm" [disabled]="busy() || nf.subject.trim().length < 3 || nf.description.trim().length < 5">{{ busy() ? 'Saving…' : 'Create case' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:16px}
    @media (max-width:900px){.stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
    .st{display:flex;flex-direction:column;gap:4px;align-items:flex-start;padding:14px 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
      box-shadow:var(--shadow-sm);font:inherit;color:inherit;cursor:pointer;text-align:left}
    .st span{font-size:12.5px;color:var(--text-2);font-weight:500} .st strong{font-size:24px;font-weight:600;letter-spacing:-.02em}
    .st.danger strong{color:var(--red-600)}
    .st.on{border-color:var(--forest-500);box-shadow:var(--focus)}
    .filters{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap}
    .search{position:relative;flex:1;min-width:240px;max-width:420px}
    .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)} .search .input{padding-left:34px}
    .filters select{width:170px}
    .sj{display:flex;flex-direction:column;max-width:380px;min-width:0}
    .pri{display:inline-block;font-size:12px;font-weight:500;padding:2px 8px;border-radius:4px;background:var(--stone-100);color:var(--stone-600)}
    .pri.p-high{background:var(--red-100);color:var(--red-600)} .pri.p-normal{background:var(--sky-100);color:var(--sky-600)}
    .as{display:inline-flex;align-items:center;gap:6px;font-size:13px}
    .av{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--forest-100);color:var(--forest-700);font-size:10px;font-weight:600;flex:none}
    .ovd{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600;color:var(--red-600);background:var(--red-100);padding:2px 8px;border-radius:999px}
    tr.od td:first-child{box-shadow:inset 3px 0 0 var(--red-600)}
    .chips{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
    .chip{font-size:12px;padding:2px 8px;border-radius:999px;background:var(--stone-100);color:var(--stone-600)}
    .desc{white-space:pre-wrap;padding:14px 16px;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;font-size:13.5px;color:var(--stone-800)}
    .act{display:flex;flex-direction:column;gap:12px}
    .hh{margin-bottom:12px}
    .picked{display:flex;align-items:center;gap:10px;padding:8px 10px;border:1px solid var(--forest-200);background:var(--forest-50);border-radius:8px}
    .picked div{display:flex;flex-direction:column}
    .picked .av{width:30px;height:30px;font-size:12px}
    .fres{list-style:none;margin:0;padding:4px;border:1px solid var(--border);border-radius:8px;max-height:180px;overflow:auto;background:var(--surface);box-shadow:var(--shadow)}
    .fres li{display:flex;flex-direction:column;padding:7px 10px;border-radius:6px;cursor:pointer} .fres li:hover{background:var(--forest-50)}
    .prio{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
    .popt{display:flex;flex-direction:column;padding:10px 12px;border:1px solid var(--border-strong);border-radius:8px;cursor:pointer}
    .popt input{display:none} .popt strong{font-size:13.5px;font-weight:500} .popt small{font-size:12px;color:var(--text-3)}
    .popt.on{border-color:var(--forest-500);background:var(--forest-50);box-shadow:var(--focus)}
    .due{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:8px;background:var(--sand-100);font-size:13.5px;color:var(--stone-700)}
  `],
})
export class GrievancesPage {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);

  list = new Remote<Grievance[]>();
  users = new Remote<UserLite[]>();
  farmers = new Remote<FarmerLite[]>();
  farmerHits = new Remote<FarmerLite[]>();
  status = signal(this.route.snapshot.queryParamMap.get('status') ?? '');
  category = signal('');
  priority = signal('');
  overdueOnly = signal(false);
  mine = signal(false);
  q = signal('');
  statuses = ['open', 'in_progress', 'resolved', 'appealed', 'closed'];
  categories = CATEGORIES;
  channels = CHANNELS;
  dueDays = DUE_DAYS;
  canHandle = computed(() => this.auth.can('grievance.handle'));
  canCreate = computed(() => this.auth.can('grievance.handle', 'risk.manage'));

  private userMap = computed(() => new Map((this.users.data() ?? []).map(u => [u.id, u])));
  private farmerMap = computed(() => new Map((this.farmers.data() ?? []).map(f => [f.id, f])));
  activeUsers = computed(() => (this.users.data() ?? []).filter(u => u.is_active));
  all = computed(() => this.list.data() ?? []);
  filtered = computed(() => !!(this.status() || this.category() || this.priority() || this.overdueOnly() || this.mine() || this.q().trim()));
  rows = computed(() => {
    const q = this.q().trim().toLowerCase();
    const me = this.auth.profile()?.id;
    return this.all().filter(g => (!this.overdueOnly() || g.overdue) && (!this.mine() || g.assigned_to === me) &&
      (!q || g.code.toLowerCase().includes(q) || g.subject.toLowerCase().includes(q) || this.farmerName(g.farmer_id).toLowerCase().includes(q)));
  });
  openCount = computed(() => this.all().filter(g => g.status !== 'closed' && g.status !== 'resolved').length);
  overdueCount = computed(() => this.all().filter(g => g.overdue).length);
  mineCount = computed(() => this.all().filter(g => g.assigned_to === this.auth.profile()?.id && g.status !== 'closed').length);

  detailOpen = signal(false);
  closeConfirm = signal(false);
  createOpen = signal(false);
  sel = signal<Grievance | null>(null);
  busy = signal(false);
  actionError = signal<string | null>(null);
  formError = signal<string | null>(null);
  assignee = '';
  note = '';
  resolution = '';
  farmerQ = signal('');
  pickedFarmer = signal<FarmerLite | null>(null);
  nf = this.blank();
  dueDate = () => addDays(isoDate(new Date()), DUE_DAYS[this.nf.priority] ?? 7);
  private searchTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.users.load(this.api.get<UserLite[]>('/users').pipe(catchError(() => of([] as UserLite[]))));
    this.farmers.load(this.api.get<Page<FarmerLite>>('/farmers', { limit: 500 }).pipe(map(r => r.items), catchError(() => of([] as FarmerLite[]))));
    effect(() => {
      const params = { status: this.status(), category: this.category(), priority: this.priority() };
      untracked(() => this.list.load(this.api.get<Grievance[]>('/grievances', params), true));
    });
    effect(() => {
      const q = this.farmerQ().trim();
      untracked(() => {
        clearTimeout(this.searchTimer);
        if (q.length < 2) return;
        this.searchTimer = setTimeout(() => this.farmerHits.load(this.api.get<Page<FarmerLite>>('/farmers', { q, limit: 8 }).pipe(map(r => r.items))), 220);
      });
    });
  }

  private reload() {
    this.list.load(this.api.get<Grievance[]>('/grievances', { status: this.status(), category: this.category(), priority: this.priority() }), true);
  }

  countBy(s: string) { return this.all().filter(g => g.status === s).length; }
  userName(id: string) { return id === this.auth.profile()?.id ? 'You' : this.userMap().get(id)?.full_name ?? 'Team member'; }
  initials(id: string) { return (this.userMap().get(id)?.full_name ?? '?').split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase(); }
  farmerName(id: string | null) { return id ? this.farmerMap().get(id)?.full_name ?? 'Farmer' : 'No farmer linked'; }
  catLabel(k: string) { return CATEGORIES.find(c => c.key === k)?.label ?? k; }
  channelLabel(k: string) { return CHANNELS.find(c => c.key === k)?.label ?? k; }
  transitions(g: Grievance) { return FLOW[g.status] ?? []; }
  needsNote(g: Grievance) { return g.status === 'resolved'; }
  dueIn(d: string) {
    const days = Math.round((new Date(d + 'T00:00:00').getTime() - new Date(isoDate(new Date()) + 'T00:00:00').getTime()) / 86400000);
    return days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`;
  }

  timeline(g: Grievance): TimelineItem[] {
    return [...(g.history ?? [])].reverse().map(h => ({
      title: h.assigned_to ? `Assigned to ${this.userName(h.assigned_to)}` : this.statusTitle(h.status),
      at: new Date(h.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      by: h.by_name, note: h.note || null,
      tone: h.status === 'appealed' ? 'warn' : h.status === 'closed' ? 'neutral' : h.status === 'open' ? 'neutral' : 'ok',
    }));
  }
  private statusTitle(s: string) {
    return ({ open: 'Case opened', in_progress: 'Work started', resolved: 'Resolved', appealed: 'Appealed by farmer', closed: 'Closed' } as Record<string, string>)[s] ?? s;
  }

  openDetail(g: Grievance) {
    this.sel.set(g);
    this.assignee = g.assigned_to ?? '';
    this.note = '';
    this.resolution = '';
    this.actionError.set(null);
    this.detailOpen.set(true);
  }

  private adopt(g: Grievance, msg: string) {
    this.busy.set(false);
    this.sel.set(g);
    this.note = '';
    this.resolution = '';
    this.toast.success(msg, `${g.code} · ${g.subject}`);
    this.reload();
  }

  assign(g: Grievance) {
    this.busy.set(true);
    this.actionError.set(null);
    this.api.post<Grievance>(`/grievances/${g.id}/assign`, { user_id: this.assignee, note: this.note.trim() }).subscribe({
      next: r => this.adopt(r, `Assigned to ${this.userName(this.assignee)}`),
      error: (e: ApiError) => { this.busy.set(false); this.actionError.set(e.message); },
    });
  }

  move(g: Grievance, to: string) {
    this.busy.set(true);
    this.actionError.set(null);
    this.api.post<Grievance>(`/grievances/${g.id}/status`, {
      status: to, note: this.note.trim(), resolution: to === 'resolved' ? this.resolution.trim() : null,
    }).subscribe({
      next: r => this.adopt(r, this.statusTitle(to)),
      error: (e: ApiError) => { this.busy.set(false); this.actionError.set(e.message); },
    });
  }

  private blank() {
    return { category: 'payment', channel: 'phone', subject: '', description: '', priority: 'normal' as 'low' | 'normal' | 'high' };
  }

  openCreate() {
    this.nf = this.blank();
    this.pickedFarmer.set(null);
    this.farmerQ.set('');
    this.formError.set(null);
    this.createOpen.set(true);
  }

  create() {
    this.busy.set(true);
    this.formError.set(null);
    this.api.post<Grievance>('/grievances', {
      ...this.nf, subject: this.nf.subject.trim(), description: this.nf.description.trim(), farmer_id: this.pickedFarmer()?.id ?? null,
    }).subscribe({
      next: g => {
        this.busy.set(false);
        this.createOpen.set(false);
        this.toast.success(`Case ${g.code} created`, `Response due by ${new Date(g.due_on + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}.`);
        this.reload();
        this.openDetail(g);
      },
      error: (e: ApiError) => { this.busy.set(false); this.formError.set(e.message); },
    });
  }
}
