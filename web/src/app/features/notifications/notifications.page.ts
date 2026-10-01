import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { apiMessage } from '../credits/credit-ui';
import { FarmerDirectory, FarmerPicker } from '../households/lookups';
import { InboundTab } from './inbound.tab';
import { CHANNELS, Channel, LANGS, TEMPLATE_INFO, Template, Notification, humanPlaceholder, placeholdersOf, render } from './notif-types';
import { OutboxTab } from './outbox.tab';
import { TemplatesTab } from './templates.tab';

type Tab = 'outbox' | 'templates' | 'inbound';
const AUTO = new Set(['farmer_name', 'farmer_code']);

@Component({
  selector: 'vc-notifications-page',
  imports: [...KIT, FormsModule, OutboxTab, TemplatesTab, InboundTab, FarmerPicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Notifications" eyebrow="Care"
      subtitle="SMS, WhatsApp and voice messages to farmers in their own language — only to farmers who have agreed to be contacted — and the messages they send back.">
      <ng-container actions>
        @if (canDispatch) { <button class="btn btn-secondary" [disabled]="dispatching()" (click)="dispatch()"><vc-icon name="zap" />{{ dispatching() ? 'Dispatching…' : 'Dispatch pending events' }}</button> }
        @if (canSend) { <button class="btn btn-primary" (click)="openSend()"><vc-icon name="send" />Send message</button> }
      </ng-container>
    </vc-page-header>

    <vc-tabs [tabs]="tabs()" [active]="tab()" (activeChange)="setTab($any($event))" />
    @switch (tab()) {
      @case ('outbox') { <vcx-outbox-tab [reload]="bump()" /> }
      @case ('templates') { <vcx-templates-tab (changed)="loadTemplates()" /> }
      @case ('inbound') { <vcx-inbound-tab /> }
    }

    <vc-modal [(open)]="sendOpen" [drawer]="true" width="560px" title="Send a message" subtitle="Uses an approved template in the farmer's language, or your own text.">
      <div class="stack">
        <div class="field"><label>Farmer</label><vcx-farmer-picker [(value)]="farmerId" (valueChange)="farmerChanged()" /></div>
        @if (farmer(); as f) {
          @if (consent() === 'loading') { <p class="small subtle">Checking consent…</p> }
          @else if (consent() === 'no') {
            <vc-callout tone="warn" icon="shield"><strong>{{ f.full_name }} hasn't agreed to be contacted.</strong> Messages need their “use of my farm data” consent. Record consent on the farmer's page first.</vc-callout>
          }
        }
        <div class="form-grid">
          <div class="field"><label for="sc">Channel</label>
            <select id="sc" class="input" [ngModel]="channel()" (ngModelChange)="channel.set($event)">@for (c of channelOpts; track c.key) { <option [value]="c.key">{{ c.label }}</option> }</select></div>
          <div class="field"><label>Message</label>
            <div class="mode"><button type="button" [class.on]="mode() === 'template'" (click)="mode.set('template')">Template</button><button type="button" [class.on]="mode() === 'custom'" (click)="mode.set('custom')">Own text</button></div></div>
          @if (mode() === 'template') {
            <div class="field span-2"><label for="st">Template</label>
              <select id="st" class="input" [ngModel]="code()" (ngModelChange)="code.set($event)">
                <option value="">Choose a template…</option>
                @for (c of codesForChannel(); track c) { <option [value]="c">{{ tinfo(c) }}</option> }
              </select>
              @if (!codesForChannel().length) { <span class="hint">No approved templates for this channel yet — see the Templates tab.</span> }</div>
          } @else {
            <div class="field span-2"><label for="sb">Text</label>
              <textarea id="sb" class="input" rows="4" [ngModel]="custom()" (ngModelChange)="custom.set($event)" placeholder="Namaste {farmer_name}, …"></textarea>
              <span class="hint">You can use placeholders such as {{ '{' }}farmer_name{{ '}' }}.</span></div>
          }
          @for (p of extraPlaceholders(); track p) {
            <div class="field"><label>{{ hp(p) }}</label><input class="input" [ngModel]="ctxVals()[p] ?? ''" (ngModelChange)="setCtx(p, $event)" /></div>
          }
        </div>
        @if (previewText(); as pv) {
          <div class="preview">
            <div class="ph"><span class="small subtle">Preview</span>@if (tpl(); as t) { <span class="small subtle">· {{ lang(t.language) }} · v{{ t.version }}</span>
              @if (farmer() && t.language !== farmer()!.language) { <span class="small warn">· no {{ lang(farmer()!.language) }} text, English used</span> } }</div>
            <div class="bubble" [attr.lang]="tpl()?.language ?? 'en'">{{ pv }}</div>
            @if (missing().length) { <p class="small warn">Fill in: {{ missing().map(hp).join(', ') }}</p> }
            @else if (channel() === 'sms') { <p class="small subtle">{{ pv.length }} characters · {{ smsParts(pv) }} SMS</p> }
          </div>
        }
        @if (sendError()) { <vc-error title="Not sent" [message]="sendError()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="sendOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="sending() || !canSubmit()" (click)="send()"><vc-icon name="send" />{{ sending() ? 'Sending…' : 'Send now' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .mode{display:inline-flex;gap:4px;height:38px;align-items:center}
    .mode button{border:1px solid var(--border-strong);background:var(--surface);border-radius:6px;padding:7px 12px;font:500 13px var(--font);color:var(--stone-600);cursor:pointer}
    .mode button.on{border-color:var(--forest-400);background:var(--forest-50);color:var(--forest-700)}
    .preview{display:flex;flex-direction:column;gap:6px;padding:14px;border-radius:12px;background:var(--sand-100)}
    .ph{display:flex;gap:4px;flex-wrap:wrap}
    .bubble{align-self:flex-start;max-width:92%;padding:10px 14px;border-radius:14px 14px 14px 4px;background:var(--surface);border:1px solid var(--border);white-space:pre-wrap;line-height:1.55;box-shadow:var(--shadow-sm)}
    .warn{color:var(--amber-600)}
  `],
})
export class NotificationsPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dir = inject(FarmerDirectory);
  canSend = this.auth.can('farmers.manage');
  canDispatch = this.auth.can('farmers.manage', 'programmes.manage');
  canInbound = this.auth.can('farmers.manage', 'practice.record', 'grievance.handle');
  channelOpts = CHANNELS;

  tab = signal<Tab>((this.route.snapshot.queryParamMap.get('tab') as Tab) || 'outbox');
  bump = signal(0);
  dispatching = signal(false);
  templates = signal<Template[]>([]);
  tabs = computed(() => [
    { key: 'outbox', label: 'Outbox' }, { key: 'templates', label: 'Templates' },
    ...(this.canInbound ? [{ key: 'inbound', label: 'Inbound' }] : []),
  ]);

  // send
  sendOpen = signal(false);
  sending = signal(false);
  sendError = signal<string | null>(null);
  farmerId: string | null = null;
  private fid = signal<string | null>(null);
  consent = signal<'loading' | 'yes' | 'no' | 'unknown'>('unknown');
  channel = signal<Channel>('sms');
  mode = signal<'template' | 'custom'>('template');
  code = signal('');
  custom = signal('');
  ctxVals = signal<Record<string, string>>({});
  farmer = computed(() => (this.fid() ? this.dir.byId().get(this.fid()!) ?? null : null));
  codesForChannel = computed(() => [...new Set(this.templates().filter(t => t.status === 'approved' && t.channel === this.channel()).map(t => t.code))].sort());
  tpl = computed(() => {
    if (this.mode() !== 'template' || !this.code()) return null;
    const ts = this.templates().filter(t => t.status === 'approved' && t.channel === this.channel() && t.code === this.code()).sort((a, b) => b.version - a.version);
    const lang = this.farmer()?.language;
    return ts.find(t => t.language === lang) ?? ts.find(t => t.language === 'en') ?? ts[0] ?? null;
  });
  private body = computed(() => (this.mode() === 'template' ? this.tpl()?.body ?? '' : this.custom()));
  extraPlaceholders = computed(() => placeholdersOf(this.body()).filter(p => !AUTO.has(p)));
  private fullCtx = computed<Record<string, string>>(() => ({ ...this.ctxVals(), ...(this.farmer() ? { farmer_name: this.farmer()!.full_name, farmer_code: this.farmer()!.code } : {}) }));
  missing = computed(() => placeholdersOf(this.body()).filter(p => !this.fullCtx()[p]));
  previewText = computed(() => (this.body() ? render(this.body(), this.fullCtx()) : ''));
  canSubmit = computed(() => !!this.fid() && this.consent() !== 'no' && !!this.body().trim() && !this.missing().length);

  constructor() {
    this.loadTemplates();
    effect(() => { this.channel(); untracked(() => { if (!this.codesForChannel().includes(this.code())) this.code.set(''); }); });
  }

  setTab(t: Tab) {
    this.tab.set(t);
    this.router.navigate([], { queryParams: { tab: t }, replaceUrl: true });
  }
  loadTemplates() {
    this.api.get<Template[]>('/notifications/templates').subscribe({ next: r => this.templates.set(r), error: () => {} });
  }
  tinfo(c: string) { return TEMPLATE_INFO[c]?.title ?? c; }
  hp = humanPlaceholder;
  lang(l: string) { return LANGS[l] ?? l; }
  smsParts(t: string) { return t.length <= 160 ? 1 : Math.ceil(t.length / 153); }
  setCtx(k: string, v: string) { this.ctxVals.update(c => ({ ...c, [k]: v })); }

  dispatch() {
    this.dispatching.set(true);
    this.api.post<{ events_processed: number; notifications: number; by_status: Record<string, number> }>('/notifications/dispatch-events').subscribe({
      next: r => {
        this.dispatching.set(false);
        const parts = Object.entries(r.by_status).map(([k, n]) => `${n} ${k === 'skipped' ? 'not sent' : k}`).join(', ');
        r.events_processed
          ? this.toast.success(`${r.events_processed} event${r.events_processed === 1 ? '' : 's'} handled`, `${r.notifications} message${r.notifications === 1 ? '' : 's'}${parts ? ': ' + parts : ''}. Running it again never sends twice.`)
          : this.toast.info('Nothing pending', 'Every enrolment, payment and practice event has already been handled.');
        this.bump.update(v => v + 1);
      },
      error: (e: ApiError) => { this.dispatching.set(false); this.toast.apiError(e, "Couldn't dispatch events"); },
    });
  }

  openSend() {
    this.farmerId = null;
    this.fid.set(null);
    this.consent.set('unknown');
    this.code.set('');
    this.custom.set('');
    this.ctxVals.set({});
    this.sendError.set(null);
    this.loadTemplates();
    this.sendOpen.set(true);
  }
  farmerChanged() {
    this.fid.set(this.farmerId);
    this.consent.set('unknown');
    if (!this.farmerId) return;
    this.consent.set('loading');
    this.api.get<{ current: { purpose: string; state: string }[] }>(`/farmers/${this.farmerId}/consents`).subscribe({
      next: r => this.consent.set(r.current.find(c => c.purpose === 'data_use')?.state === 'granted' ? 'yes' : 'no'),
      error: () => this.consent.set('unknown'),
    });
  }
  send() {
    this.sending.set(true);
    this.sendError.set(null);
    const t = this.tpl();
    this.api.post<Notification>('/notifications/send', {
      farmer_id: this.fid(), channel: this.channel(),
      template_code: this.mode() === 'template' ? this.code() : null, language: t?.language ?? null,
      body: this.mode() === 'custom' ? this.custom().trim() : null, context: this.ctxVals(),
    }).subscribe({
      next: n => {
        this.sending.set(false);
        this.sendOpen.set(false);
        n.status === 'failed' ? this.toast.error('The provider did not accept the message', n.last_error ?? 'You can retry it from the outbox.') : this.toast.success('Message sent', `To ${this.farmer()?.full_name ?? 'the farmer'} by ${CHANNELS.find(c => c.key === n.channel)?.label}.`);
        this.setTab('outbox');
        this.bump.update(v => v + 1);
      },
      error: (e: ApiError) => { this.sending.set(false); this.sendError.set(apiMessage(e)); },
    });
  }
}
