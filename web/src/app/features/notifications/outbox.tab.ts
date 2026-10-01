import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { PeopleDirectory } from '../benefits/benefit-types';
import { FarmerDirectory } from '../households/lookups';
import { CHANNELS, Notification, SKIP, TRIGGERS, channelIcon, channelLabel } from './notif-types';

@Component({
  selector: 'vcx-outbox-tab',
  imports: [...KIT, FormsModule, DayPipe, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sum">
      @for (s of statusCards; track s.key) {
        <button type="button" class="sc" [class.on]="status() === s.key" [class]="count(s.key) ? 't-' + s.tone : ''" (click)="status.set(status() === s.key ? '' : s.key)">
          <span class="l">{{ s.label }}</span><strong class="num">{{ count(s.key) }}</strong>
        </button>
      }
    </div>
    <div class="filters">
      <select class="input" [ngModel]="channel()" (ngModelChange)="channel.set($event)" aria-label="Channel">
        <option value="">All channels</option>@for (c of channels; track c.key) { <option [value]="c.key">{{ c.label }}</option> }</select>
      <select class="input" [ngModel]="status()" (ngModelChange)="status.set($event)" aria-label="Status">
        <option value="">All statuses</option>@for (s of statusCards; track s.key) { <option [value]="s.key">{{ s.label }}</option> }</select>
      <div class="search"><vc-icon name="search" [size]="15" /><input class="input" placeholder="Search recipient or message…" [ngModel]="q()" (ngModelChange)="q.set($event)" /></div>
      <span class="spacer"></span>
      <button class="btn btn-ghost btn-sm" (click)="load()"><vc-icon name="refresh" [size]="14" />Refresh</button>
    </div>

    <section class="card">
      @if (loading() && !all().length) { <vc-loading [rows]="6" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load the outbox" [message]="error()!" /></div> }
      @else if (!rows().length) {
        <vc-empty icon="send" [title]="all().length ? 'No matching messages' : 'No messages yet'"
          [text]="all().length ? 'Try a different channel or status.' : 'Messages appear here when you send one, or when pending events (enrolments, payments, practices) are dispatched.'" />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>When</th><th>Recipient</th><th>Channel</th><th>Message</th><th>Trigger</th><th>Status</th><th class="num">Tries</th><th></th></tr></thead>
            <tbody>
              @for (n of rows().slice(0, shown()); track n.id) {
                <tr class="clickable" (click)="sel.set(n)">
                  <td class="nowrap"><span [title]="n.created_at | day: true">{{ n.created_at | ago }}</span></td>
                  <td><div class="rc"><strong>{{ recipient(n) }}</strong><span class="mono small subtle">{{ n.address || '—' }}</span></div></td>
                  <td class="nowrap"><span class="ch"><vc-icon [name]="icon(n.channel)" [size]="13" />{{ ch(n.channel) }}</span></td>
                  <td class="msg">
                    @if (n.status === 'skipped') { <span class="skip"><vc-icon name="ban" [size]="13" />{{ skip(n).title }}</span> }
                    @else { <span class="truncate b">{{ n.body || '—' }}</span> }
                    @if (n.template_code) { <span class="tc mono">{{ n.template_code }} v{{ n.template_version ?? '?' }}</span> }
                  </td>
                  <td class="small">{{ trig(n.trigger) }}</td>
                  <td><vc-badge [status]="n.status" /></td>
                  <td class="num">{{ n.attempts }}</td>
                  <td class="num">@if (n.status === 'failed' && canSend && n.body) { <button class="btn btn-secondary btn-sm" [disabled]="busy() === n.id" (click)="retry(n, $event)"><vc-icon name="refresh" [size]="13" />Retry</button> }</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="foot row"><span class="small subtle">Showing {{ Math.min(shown(), rows().length) }} of {{ rows().length }}@if (all().length >= limit) { (latest {{ limit }} messages) }</span><span class="spacer"></span>
          @if (rows().length > shown()) { <button class="btn btn-secondary btn-sm" (click)="shown.set(shown() + 50)">Show 50 more</button> }</div>
      }
    </section>

    <vc-modal [open]="!!sel()" (closed)="sel.set(null)" [drawer]="true" width="480px" [title]="sel() ? recipient(sel()!) : ''" [subtitle]="sel() ? ch(sel()!.channel) + ' · ' + (sel()!.created_at | day: true) : ''">
      @if (sel(); as n) {
        <div class="stack">
          <div class="row"><vc-badge [status]="n.status" />@if (n.template_code) { <span class="tc mono">{{ n.template_code }} · v{{ n.template_version }} · {{ n.language }}</span> }</div>
          @if (n.status === 'skipped') {
            <vc-callout tone="warn" icon="ban"><strong>{{ skip(n).title }}</strong><p style="margin-top:4px">{{ skip(n).text }}</p></vc-callout>
          } @else {
            <div class="bubble">@if (n.subject) { <strong>{{ n.subject }}</strong><br /> }{{ n.body }}</div>
          }
          @if (n.last_error) { <vc-error title="Provider error" [message]="n.last_error" /> }
          <dl class="kv">
            <dt>Recipient</dt><dd>{{ recipient(n) }}</dd>
            <dt>Address</dt><dd class="mono">{{ n.address || '—' }}</dd>
            <dt>Trigger</dt><dd>{{ trig(n.trigger) }}</dd>
            <dt>Provider</dt><dd>{{ n.provider || '—' }} @if (n.provider_ref) { <span class="mono small">· {{ n.provider_ref }}</span> }</dd>
            <dt>Sent</dt><dd>{{ n.sent_at ? (n.sent_at | day: true) : '—' }}</dd>
            <dt>Delivered</dt><dd>{{ n.delivered_at ? (n.delivered_at | day: true) : '—' }}</dd>
            <dt>Attempts</dt><dd class="num">{{ n.attempts }}</dd>
          </dl>
          <p class="small subtle">Phone numbers are partly hidden. Every hand-over to the messaging provider is logged; sending is idempotent, so a retry never duplicates a delivered message.</p>
        </div>
      }
      <ng-container footer>
        @if (sel()?.status === 'failed' && canSend && sel()?.body) { <button class="btn btn-primary" [disabled]="!!busy()" (click)="retry(sel()!)"><vc-icon name="refresh" />Retry sending</button> }
        <button class="btn btn-ghost" (click)="sel.set(null)">Close</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .sum{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-bottom:14px}
    @media (max-width:900px){.sum{grid-template-columns:repeat(3,1fr)}}
    .sc{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:10px 14px;border:1px solid var(--border);border-radius:10px;background:var(--surface);font:inherit;cursor:pointer;text-align:left}
    .sc .l{font-size:12.5px;color:var(--text-2)} .sc strong{font-size:22px;font-weight:600}
    .sc.on{border-color:var(--forest-400);box-shadow:inset 0 0 0 1px var(--forest-400)}
    .sc.t-danger strong{color:var(--red-600)} .sc.t-warn strong{color:var(--amber-600)} .sc.t-ok strong{color:var(--forest-700)}
    .filters{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;align-items:center}
    .filters select{width:170px}
    .search{position:relative;min-width:220px;flex:1;max-width:340px}
    .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)} .search .input{padding-left:34px}
    .rc{display:flex;flex-direction:column;line-height:1.35}
    .ch{display:inline-flex;align-items:center;gap:5px;color:var(--stone-700)}
    .msg{max-width:360px} .b{display:block;max-width:340px;color:var(--stone-700)}
    .skip{display:inline-flex;align-items:center;gap:5px;color:var(--amber-600);font-weight:500}
    .tc{display:inline-block;margin-top:2px;font-size:11px;color:var(--text-3)}
    .foot{padding:10px 20px;border-top:1px solid var(--border)}
    .bubble{padding:12px 14px;border-radius:12px 12px 12px 4px;background:var(--forest-50);border:1px solid var(--forest-100);white-space:pre-wrap;line-height:1.55;color:var(--stone-800)}
  `],
})
export class OutboxTab {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private farmers = inject(FarmerDirectory);
  private people = inject(PeopleDirectory);
  canSend = inject(AuthService).can('farmers.manage');
  /** Bump to reload from the page (after send / dispatch). */
  reload = input(0);
  limit = 300;
  channels = CHANNELS;
  statusCards = [
    { key: 'delivered', label: 'Delivered', tone: 'ok' }, { key: 'sent', label: 'Sent', tone: 'ok' },
    { key: 'queued', label: 'Queued', tone: 'neutral' }, { key: 'failed', label: 'Failed', tone: 'danger' },
    { key: 'skipped', label: 'Not sent', tone: 'warn' },
  ];

  all = signal<Notification[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  channel = signal('');
  status = signal('');
  q = signal('');
  busy = signal<string | null>(null);
  sel = signal<Notification | null>(null);
  shown = signal(50);
  Math = Math;
  rows = computed(() => {
    const q = this.q().trim().toLowerCase();
    return this.all().filter(n => (!this.channel() || n.channel === this.channel()) && (!this.status() || n.status === this.status()) &&
      (!q || `${this.recipient(n)} ${n.body} ${n.template_code ?? ''}`.toLowerCase().includes(q)));
  });

  constructor() {
    this.farmers.load();
    this.people.load();
    effect(() => { this.reload(); untracked(() => this.load()); });
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Notification[]>('/notifications', { limit: this.limit }).subscribe({
      next: r => { this.all.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
  count(s: string) { return this.all().filter(n => n.status === s).length; }
  ch = channelLabel;
  icon = channelIcon;
  trig(t: string) { return TRIGGERS[t] ?? t; }
  skip(n: Notification) { return SKIP[n.skip_reason ?? ''] ?? { title: 'Not sent', text: n.skip_reason ?? '' }; }
  recipient(n: Notification) { return n.farmer_id ? this.farmers.name(n.farmer_id) : n.user_id ? this.people.name(n.user_id) : '—'; }

  retry(n: Notification, ev?: Event) {
    ev?.stopPropagation();
    this.busy.set(n.id);
    this.api.post<Notification>(`/notifications/${n.id}/retry`).subscribe({
      next: r => {
        this.busy.set(null);
        this.all.update(xs => xs.map(x => (x.id === r.id ? r : x)));
        if (this.sel()?.id === r.id) this.sel.set(r);
        r.status === 'failed' ? this.toast.error('Still not delivered', r.last_error ?? '') : this.toast.success('Message sent');
      },
      error: (e: ApiError) => { this.busy.set(null); this.toast.apiError(e, 'Retry failed'); },
    });
  }
}
