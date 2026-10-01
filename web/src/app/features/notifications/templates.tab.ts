import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { PeopleDirectory } from '../benefits/benefit-types';
import { apiMessage } from '../credits/credit-ui';
import { selfApprovalMessage } from '../households/lookups';
import { CHANNELS, Channel, LANGS, TEMPLATE_INFO, Template, bodyParts, channelIcon, channelLabel, humanPlaceholder, placeholdersOf } from './notif-types';

interface Cell { lang: string; current: Template | null; draft: Template | null; history: Template[] }
interface Group { code: string; channels: { channel: Channel; cells: Cell[] }[]; placeholders: string[] }

@Component({
  selector: 'vcx-templates-tab',
  imports: [...KIT, FormsModule, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted">Message text for each purpose, channel and language. Only approved versions are sent; approving needs a second person, and approved text is never edited — a change is a new version.</p>
      <span class="spacer"></span>
      @if (canEdit) {
        <button class="btn btn-secondary" [disabled]="busy()" (click)="installDefaults()"><vc-icon name="download" />Install default texts</button>
        <button class="btn btn-primary" (click)="openNew()"><vc-icon name="plus" />New template</button>
      }
    </div>

    @if (loading() && !all().length) { <div class="card"><vc-loading [rows]="6" /></div> }
    @else if (error()) { <vc-error title="Couldn't load templates" [message]="error()!" /> }
    @else if (!groups().length) {
      <div class="card"><vc-empty icon="file" title="No message templates yet" text="Install the default English and Kannada texts for welcome, payment and practice messages, then review the wording.">
        @if (canEdit) { <button class="btn btn-primary" (click)="installDefaults()"><vc-icon name="download" />Install default texts</button> }
      </vc-empty></div>
    } @else {
      <div class="stack">
        @for (g of groups(); track g.code) {
          <section class="card">
            <div class="card-head">
              <div class="gt"><h3>{{ info(g.code).title }}</h3><span class="small muted">{{ info(g.code).when }} <code class="subtle">{{ g.code }}</code></span></div>
              <div class="phs">@for (p of g.placeholders; track p) { <span class="ph">{{ hp(p) }}</span> }</div>
            </div>
            @for (c of g.channels; track c.channel) {
              <div class="chan">
                <div class="chh"><vc-icon [name]="icon(c.channel)" [size]="14" />{{ ch(c.channel) }}</div>
                <div class="langs">
                  @for (cell of c.cells; track cell.lang) {
                    <div class="cell">
                      <div class="lh"><strong [attr.lang]="cell.lang">{{ lang(cell.lang) }}</strong>
                        @if (cell.current) { <vc-badge status="approved">v{{ cell.current.version }} approved</vc-badge> } @else { <vc-badge status="pending">None approved</vc-badge> }</div>
                      @if (cell.current; as t) {
                        <p class="body" [attr.lang]="cell.lang">@for (p of parts(t.body); track $index) {@if (p.ph) {<span class="pv">{{ hp(p.t) }}</span>} @else {<ng-container>{{ p.t }}</ng-container>}}</p>
                        <span class="meta small subtle">@if (t.is_default) { Platform default · } Approved {{ t.approved_at | day }} @if (t.approved_by) { by {{ people.name(t.approved_by) }} }</span>
                      }
                      @if (cell.draft; as d) {
                        <div class="draft">
                          <div class="row"><vc-badge status="draft">Draft v{{ d.version }}</vc-badge><span class="small subtle">by {{ people.name(d.created_by) }} · {{ d.created_at | day }}</span></div>
                          <p class="body" [attr.lang]="cell.lang">@for (p of parts(d.body); track $index) {@if (p.ph) {<span class="pv">{{ hp(p.t) }}</span>} @else {<ng-container>{{ p.t }}</ng-container>}}</p>
                          @if (canEdit) {
                            <div class="row">
                              <button class="btn btn-secondary btn-sm" (click)="openEdit(d)"><vc-icon name="pencil" [size]="13" />Edit</button>
                              @if (d.created_by === me) { <span class="small self">You wrote this — a colleague must approve it.</span> }
                              @else { <button class="btn btn-primary btn-sm" [disabled]="busy()" (click)="approve(d)"><vc-icon name="check" [size]="13" />Approve</button> }
                            </div>
                          }
                        </div>
                      } @else if (canEdit) {
                        <button class="btn btn-ghost btn-sm nv" (click)="openVersion(g.code, c.channel, cell.lang, cell.current)"><vc-icon name="branch" [size]="13" />{{ cell.current ? 'New version' : 'Write this text' }}</button>
                      }
                      @if (cell.history.length) {
                        <details class="hist"><summary class="small">{{ cell.history.length }} earlier version{{ cell.history.length === 1 ? '' : 's' }}</summary>
                          @for (h of cell.history; track h.id) { <div class="hv small"><span class="mono">v{{ h.version }}</span> <vc-badge [status]="h.status" /> <span class="muted">{{ h.body }}</span></div> }
                        </details>
                      }
                    </div>
                  }
                </div>
              </div>
            }
          </section>
        }
      </div>
    }

    <vc-modal [(open)]="editOpen" [drawer]="true" width="560px" [title]="editing() ? 'Edit draft v' + editing()!.version : 'New template text'" [subtitle]="editing() ? info(editing()!.code).title + ' · ' + ch(editing()!.channel) + ' · ' + lang(editing()!.language) : 'Creates a draft that a colleague approves.'">
      <div class="form-grid">
        @if (!editing()) {
          <div class="field span-2"><label for="tc">Template code</label><input id="tc" class="input mono" [(ngModel)]="f.code" placeholder="e.g. sampling_visit" [disabled]="lockKey()" />
            <span class="hint">Lower-case letters, numbers, dots, dashes or underscores. Use an existing code to add a language or channel.</span></div>
          <div class="field"><label for="tch">Channel</label><select id="tch" class="input" [(ngModel)]="f.channel" [disabled]="lockKey()">@for (c of channels; track c.key) { <option [value]="c.key">{{ c.label }}</option> }</select></div>
          <div class="field"><label for="tl">Language</label><select id="tl" class="input" [(ngModel)]="f.language" [disabled]="lockKey()">@for (l of langKeys; track l) { <option [value]="l">{{ lang(l) }}</option> }</select></div>
        }
        @if ((editing()?.channel ?? f.channel) === 'email') { <div class="field span-2"><label for="ts">Subject</label><input id="ts" class="input" [(ngModel)]="f.subject" /></div> }
        <div class="field span-2"><label for="tb">Message</label>
          <textarea id="tb" class="input" rows="6" [(ngModel)]="f.body" [attr.lang]="editing()?.language ?? f.language"></textarea>
          <span class="hint">Use {{ '{' }}farmer_name{{ '}' }} style placeholders; they're filled in when the message is sent. {{ f.body.length }} characters@if ((editing()?.channel ?? f.channel) === 'sms' && f.body.length > 160) { · longer than one SMS ({{ smsParts() }} parts) }.</span></div>
        @if (placeholders().length) { <div class="span-2 phs">@for (p of placeholders(); track p) { <span class="ph">{{ hp(p) }}</span> }</div> }
        <div class="field span-2"><label for="tn">Notes for the approver <span class="subtle">(optional)</span></label><input id="tn" class="input" [(ngModel)]="f.notes" placeholder="e.g. Simplified wording after field feedback" /></div>
        @if (formError()) { <div class="span-2"><vc-error title="Not saved" [message]="formError()!" /></div> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="editOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !f.body.trim() || (!editing() && f.code.trim().length < 2)" (click)="save()">{{ editing() ? 'Save draft' : 'Create draft' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;gap:10px;align-items:flex-start;margin-bottom:16px;flex-wrap:wrap} .bar p{max-width:720px}
    .gt{flex:1;display:flex;flex-direction:column;gap:2px}
    .phs{display:flex;gap:4px;flex-wrap:wrap}
    .ph{font:500 11.5px var(--mono);padding:2px 7px;border-radius:4px;background:var(--sky-100);color:var(--sky-600)}
    .chan{padding:14px 20px;border-bottom:1px solid var(--stone-100)} .chan:last-child{border-bottom:0}
    .chh{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-2);margin-bottom:10px}
    .langs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    @media (max-width:900px){.langs{grid-template-columns:1fr}}
    .cell{display:flex;flex-direction:column;gap:8px;padding:12px 14px;border:1px solid var(--border);border-radius:10px;background:var(--surface-2)}
    .lh{display:flex;justify-content:space-between;align-items:center;gap:8px}
    .body{line-height:1.6;color:var(--stone-800);font-size:14px;white-space:pre-wrap}
    .body[lang=kn]{font-size:14.5px}
    .pv{display:inline-block;padding:0 5px;margin:0 1px;border-radius:4px;background:var(--sky-100);color:var(--sky-600);font-size:12.5px;font-weight:500}
    .draft{display:flex;flex-direction:column;gap:8px;padding:10px 12px;border:1px dashed var(--amber-600);border-radius:8px;background:var(--surface)}
    .self{color:var(--amber-600)}
    .nv{align-self:flex-start}
    .hist summary{cursor:pointer;color:var(--text-2)} .hv{display:flex;gap:6px;align-items:center;padding:4px 0} .hv .muted{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  `],
})
export class TemplatesTab {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  people = inject(PeopleDirectory);
  private auth = inject(AuthService);
  canEdit = this.auth.can('programmes.manage');
  me = this.auth.profile()?.id;
  changed = output<void>();
  channels = CHANNELS;
  langKeys = Object.keys(LANGS);

  all = signal<Template[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  busy = signal(false);
  editOpen = signal(false);
  editing = signal<Template | null>(null);
  lockKey = signal(false);
  formError = signal<string | null>(null);
  f = { code: '', channel: 'sms' as Channel, language: 'en', subject: '', body: '', notes: '' };

  groups = computed<Group[]>(() => {
    const by = new Map<string, Template[]>();
    for (const t of this.all()) by.set(t.code, [...(by.get(t.code) ?? []), t]);
    return [...by.entries()].map(([code, ts]) => {
      const chans = CHANNELS.map(c => c.key).filter(c => ts.some(t => t.channel === c));
      return {
        code,
        placeholders: [...new Set(ts.flatMap(t => t.placeholders))],
        channels: chans.map(channel => {
          const langs = [...new Set(['en', 'kn', ...ts.filter(t => t.channel === channel).map(t => t.language)])];
          return {
            channel,
            cells: langs.map(lang => {
              const vs = ts.filter(t => t.channel === channel && t.language === lang).sort((a, b) => b.version - a.version);
              const current = vs.find(v => v.status === 'approved') ?? null;
              const draft = vs.find(v => v.status === 'draft') ?? null;
              return { lang, current, draft, history: vs.filter(v => v !== current && v !== draft) };
            }),
          };
        }),
      };
    }).sort((a, b) => a.code.localeCompare(b.code));
  });
  placeholders = computed(() => placeholdersOf(this.f.body));

  constructor() { this.people.load(); this.load(); }

  load() {
    this.loading.set(true);
    this.api.get<Template[]>('/notifications/templates').subscribe({
      next: r => { this.all.set(r); this.loading.set(false); this.error.set(null); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
  info(code: string) { return TEMPLATE_INFO[code] ?? { title: code.replace(/[_.-]/g, ' ').replace(/^./, c => c.toUpperCase()), when: 'Sent manually by staff.' }; }
  ch = channelLabel;
  icon = channelIcon;
  hp = humanPlaceholder;
  parts = bodyParts;
  lang(l: string) { return LANGS[l] ?? l; }
  smsParts() { return Math.ceil(this.f.body.length / 153); }

  installDefaults() {
    this.busy.set(true);
    this.api.post<{ installed: number }>('/notifications/templates/install-defaults').subscribe({
      next: r => { this.busy.set(false); r.installed ? this.toast.success(`${r.installed} default texts installed`, 'They are approved and in use. Review the Kannada wording with your field team.') : this.toast.info('Nothing to install', 'Every default text already exists.'); this.load(); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e, "Couldn't install defaults"); },
    });
  }
  approve(t: Template) {
    this.busy.set(true);
    this.api.post<Template>(`/notifications/templates/${t.id}/approve`).subscribe({
      next: r => { this.busy.set(false); this.toast.success(`Version ${r.version} approved`, 'Earlier approved text for this channel and language is retired.'); this.load(); this.changed.emit(); },
      error: (e: ApiError) => { this.busy.set(false); this.toast.error('Not approved', selfApprovalMessage(e, 'Approving message text')); },
    });
  }
  openNew() {
    this.editing.set(null);
    this.lockKey.set(false);
    this.f = { code: '', channel: 'sms', language: 'en', subject: '', body: '', notes: '' };
    this.formError.set(null);
    this.editOpen.set(true);
  }
  openVersion(code: string, channel: Channel, language: string, cur: Template | null) {
    this.editing.set(null);
    this.lockKey.set(true);
    this.f = { code, channel, language, subject: cur?.subject ?? '', body: cur?.body ?? '', notes: '' };
    this.formError.set(null);
    this.editOpen.set(true);
  }
  openEdit(t: Template) {
    this.editing.set(t);
    this.f = { code: t.code, channel: t.channel, language: t.language, subject: t.subject ?? '', body: t.body, notes: t.notes };
    this.formError.set(null);
    this.editOpen.set(true);
  }
  save() {
    this.busy.set(true);
    this.formError.set(null);
    const t = this.editing();
    const req = t
      ? this.api.patch<Template>(`/notifications/templates/${t.id}`, { body: this.f.body, subject: this.f.subject || null, notes: this.f.notes })
      : this.api.post<Template>('/notifications/templates', { code: this.f.code.trim(), channel: this.f.channel, language: this.f.language, body: this.f.body, subject: this.f.subject || null, notes: this.f.notes });
    req.subscribe({
      next: r => { this.busy.set(false); this.editOpen.set(false); this.toast.success(t ? 'Draft saved' : `Draft v${r.version} created`, 'A colleague must approve it before it is used.'); this.load(); },
      error: (e: ApiError) => { this.busy.set(false); this.formError.set(apiMessage(e)); },
    });
  }
}
