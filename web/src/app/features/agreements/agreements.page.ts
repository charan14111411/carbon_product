import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, Empty, ErrorBox, Loading, Modal, PageHeader } from '../../ui/kit';
import { AgreementTemplate, LANGUAGES, PURPOSE_KEYS, PURPOSES } from '../farmers/types';
import { ConfirmDialog } from '../programmes/confirm';
import { fieldMap, formMessage } from '../programmes/form-errors';
import { Programme } from '../programmes/types';

interface Group { code: string; latest: AgreementTemplate; versions: AgreementTemplate[]; hasDraft: boolean }

@Component({
  selector: 'vc-agreements-page',
  imports: [FormsModule, PageHeader, Loading, ErrorBox, Empty, Badge, Modal, Icon, Callout, ConfirmDialog, DayPipe, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Agreements & consent" eyebrow="Programmes"
      subtitle="Participation agreements farmers sign, in their own language. Each covers named consent purposes. Published versions are frozen so every signature points to exact text.">
      <button actions class="btn btn-secondary" (click)="load()"><vc-icon name="refresh" />Refresh</button>
      @if (canManage) { <button actions class="btn btn-primary" (click)="openNew()"><vc-icon name="plus" />New agreement</button> }
    </vc-page-header>

    <section class="card">
      @if (loading()) {
        <vc-loading [rows]="5" />
      } @else if (error()) {
        <div class="card-body"><vc-error title="Couldn't load agreements" [message]="error()!" /></div>
      } @else if (!groups().length) {
        <vc-empty icon="handshake" title="No agreements yet"
          text="Write the participation agreement once in English and Kannada, choose the purposes it covers, then publish it so field teams can have farmers sign it.">
          @if (canManage) { <button class="btn btn-primary" (click)="openNew()"><vc-icon name="plus" />New agreement</button> }
        </vc-empty>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Agreement</th><th>Version</th><th>Status</th><th>Consent purposes</th><th>Languages</th><th>Updated</th><th></th></tr></thead>
            <tbody>
              @for (g of groups(); track g.code) {
                @for (t of expanded() === g.code ? g.versions : [g.latest]; track t.id; let first = $first) {
                  <tr [class.older]="!first">
                    <td>
                      @if (first) {
                        <div class="tt"><strong>{{ t.title }}</strong><span class="mono small subtle">{{ t.code }}</span></div>
                      }
                    </td>
                    <td class="num nowrap">
                      v{{ t.version }}
                      @if (first && g.versions.length > 1) {
                        <button class="linkbtn" (click)="toggle(g.code)">{{ expanded() === g.code ? 'Hide' : g.versions.length - 1 + ' older' }}</button>
                      }
                    </td>
                    <td><vc-badge [status]="t.status" /></td>
                    <td><div class="chips">@for (p of t.purposes; track p) { <span class="chip">{{ purposeLabel(p) }}</span> }</div></td>
                    <td class="small">{{ langs(t) }}</td>
                    <td class="nowrap"><span [title]="t.updated_at | day: true">{{ t.updated_at | ago }}</span></td>
                    <td class="num nowrap">
                      <button class="btn btn-ghost btn-sm" (click)="view(t)"><vc-icon name="eye" [size]="14" />View</button>
                      @if (canManage && t.status === 'draft') {
                        <button class="btn btn-secondary btn-sm" (click)="edit(t)"><vc-icon name="pencil" [size]="14" />Edit</button>
                        <button class="btn btn-primary btn-sm" (click)="askPublish(t)">Publish</button>
                      }
                      @if (canManage && first && t.status === 'published' && !g.hasDraft) {
                        <button class="btn btn-secondary btn-sm" (click)="askVersion(t)"><vc-icon name="branch" [size]="14" />New version</button>
                      }
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <!-- editor -->
    <vc-modal [(open)]="editOpen" width="1040px" [title]="editing() ? 'Edit draft · v' + editing()!.version : 'New agreement'"
      subtitle="Drafts can be changed freely. Once published, the text is frozen.">
      <form class="stack" style="--gap:16px" id="tpl-form" (ngSubmit)="save()">
        <div class="form-grid three">
          <div class="field">
            <label for="tt">Title</label>
            <input id="tt" class="input" name="title" [(ngModel)]="f.title" placeholder="Farmer participation agreement" [class.invalid]="fe()['title']" />
            @if (fe()['title']) { <span class="error">{{ fe()['title'] }}</span> }
          </div>
          <div class="field">
            <label for="tc">Code</label>
            <input id="tc" class="input mono" name="code" [(ngModel)]="f.code" [disabled]="!!editing()" placeholder="PARTICIPATION" [class.invalid]="fe()['code']" />
            @if (fe()['code']) { <span class="error">{{ fe()['code'] }}</span> } @else { <span class="hint">Stays the same across versions.</span> }
          </div>
          <div class="field">
            <label for="tp">Programme <span class="subtle">(optional)</span></label>
            <select id="tp" class="input" name="prog" [(ngModel)]="f.programme_id">
              <option value="">All programmes</option>
              @for (p of programmes(); track p.id) { <option [value]="p.id">{{ p.name }}</option> }
            </select>
          </div>
        </div>
        <div class="field">
          <label>Consent purposes this agreement covers</label>
          <div class="purposes">
            @for (k of purposeKeys; track k) {
              <label class="pur" [class.on]="f.purposes.includes(k)">
                <input type="checkbox" [checked]="f.purposes.includes(k)" (change)="togglePurpose(k)" />
                <span><strong>{{ purposeLabel(k) }}</strong><small>{{ purposeText(k) }}</small></span>
              </label>
            }
          </div>
          @if (fe()['purposes']) { <span class="error">{{ fe()['purposes'] }}</span> }
        </div>
        <div class="bodies">
          <div class="field">
            <label for="ben">English</label>
            <textarea id="ben" class="input body" name="en" [(ngModel)]="f.en" placeholder="Write the agreement in plain English…"></textarea>
            <span class="hint num">{{ words(f.en) }} words</span>
          </div>
          <div class="field">
            <label for="bkn">ಕನ್ನಡ · Kannada</label>
            <textarea id="bkn" class="input body kn" name="kn" lang="kn" [(ngModel)]="f.kn" placeholder="ಒಪ್ಪಂದದ ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ…"></textarea>
            <span class="hint num">{{ words(f.kn) }} words</span>
          </div>
        </div>
        @if (formError()) { <vc-error title="Couldn't save the agreement" [message]="formError()!" /> }
      </form>
      <ng-container footer>
        <span class="footnote small subtle">Farmers can only sign in a language that has text.</span>
        <button class="btn btn-secondary" type="button" (click)="editOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="tpl-form" [disabled]="busy() || !canSave()">{{ busy() ? 'Saving…' : 'Save draft' }}</button>
      </ng-container>
    </vc-modal>

    <!-- view -->
    <vc-modal [(open)]="viewOpen" width="1040px" [title]="(viewing()?.title ?? '') + ' · v' + (viewing()?.version ?? '')"
      [subtitle]="viewing()?.status === 'published' ? 'Published — this text is frozen.' : 'Draft'">
      @if (viewing(); as t) {
        <div class="stack" style="--gap:14px">
          <div class="chips">@for (p of t.purposes; track p) { <span class="chip">{{ purposeLabel(p) }}</span> }</div>
          <div class="bodies">
            @for (l of bodyLangs(t); track l) {
              <div class="field"><span class="label">{{ langName(l) }}</span><div class="read" [attr.lang]="l">{{ t.body[l] }}</div></div>
            }
          </div>
        </div>
      }
      <ng-container footer><button class="btn btn-secondary" (click)="viewOpen.set(false)">Close</button></ng-container>
    </vc-modal>

    <vc-confirm [(open)]="publishOpen" title="Publish agreement" confirmLabel="Publish" icon="lock" [busy]="busy()"
      [message]="'Publishing v' + (target()?.version ?? '') + ' of ' + (target()?.title ?? '') + ' makes it available for signing and freezes its text. To change it later you’ll create a new version; farmers who already signed keep the version they signed.'"
      (confirmed)="publish()">
      @if (target(); as t) {
        @if (bodyLangs(t).length < 2) {
          <vc-callout tone="warn" icon="alert">Only {{ langName(bodyLangs(t)[0]) }} text is written. Farmers who read another language can’t sign this version.</vc-callout>
        }
      }
    </vc-confirm>

    <vc-confirm [(open)]="versionOpen" title="Create a new version" confirmLabel="Create draft" icon="branch" [busy]="busy()"
      [message]="'This copies v' + (target()?.version ?? '') + ' into a new draft you can edit. The published version stays signable until the new one is published.'"
      (confirmed)="newVersion()" />
  `,
  styles: [`
    .tt{display:flex;flex-direction:column;gap:1px}
    tr.older td{background:var(--surface-2);color:var(--text-2)}
    .linkbtn{border:0;background:none;padding:0 0 0 6px;font:500 12px var(--font);color:var(--primary);cursor:pointer}
    .linkbtn:hover{text-decoration:underline}
    .chips{display:flex;flex-wrap:wrap;gap:4px}
    .chip{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:5px;background:var(--forest-50);border:1px solid var(--forest-100);font-size:12px;color:var(--forest-800);white-space:nowrap}
    td .btn + .btn{margin-left:6px}
    .three{grid-template-columns:1.4fr 1fr 1fr}
    @media (max-width:900px){.three{grid-template-columns:1fr}}
    .purposes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
    @media (max-width:900px){.purposes{grid-template-columns:1fr}}
    .pur{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid var(--border);border-radius:8px;cursor:pointer;background:var(--surface)}
    .pur:hover{border-color:var(--stone-400)}
    .pur.on{border-color:var(--forest-400);background:var(--forest-50)}
    .pur input{accent-color:var(--primary);margin-top:2px;width:15px;height:15px;flex:none}
    .pur span{display:flex;flex-direction:column} .pur strong{font-size:13px} .pur small{font-size:12px;color:var(--text-2);line-height:1.4}
    .bodies{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    @media (max-width:900px){.bodies{grid-template-columns:1fr}}
    textarea.body{min-height:300px;font-size:13.5px;line-height:1.65}
    textarea.kn,.read[lang=kn]{font-family:'Noto Sans Kannada',var(--font)}
    .read{max-height:52vh;overflow:auto;padding:14px 16px;border:1px solid var(--border);border-radius:8px;background:var(--surface-2);white-space:pre-wrap;line-height:1.65;font-size:13.5px}
    .footnote{margin-right:auto}
  `],
})
export class AgreementsPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  canManage = inject(AuthService).can('programmes.manage');
  purposeKeys = PURPOSE_KEYS;

  all = signal<AgreementTemplate[]>([]);
  programmes = signal<Programme[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  expanded = signal<string | null>(null);
  groups = computed<Group[]>(() => {
    const by = new Map<string, AgreementTemplate[]>();
    for (const t of this.all()) by.set(t.code, [...(by.get(t.code) ?? []), t]);
    return [...by.entries()].map(([code, vs]) => {
      const versions = [...vs].sort((a, b) => b.version - a.version);
      return { code, latest: versions[0], versions, hasDraft: versions.some(v => v.status === 'draft') };
    }).sort((a, b) => a.latest.title.localeCompare(b.latest.title));
  });

  busy = signal(false);
  editOpen = signal(false);
  editing = signal<AgreementTemplate | null>(null);
  formError = signal<string | null>(null);
  fe = signal<Record<string, string>>({});
  f = this.blank();

  viewOpen = signal(false);
  viewing = signal<AgreementTemplate | null>(null);
  publishOpen = signal(false);
  versionOpen = signal(false);
  target = signal<AgreementTemplate | null>(null);

  constructor() {
    this.load();
    this.api.get<Programme[]>('/programmes').pipe(catchError(() => of([]))).subscribe(p => this.programmes.set(p));
  }

  purposeLabel(p: string) { return PURPOSES[p]?.label ?? p; }
  purposeText(p: string) { return PURPOSES[p]?.text ?? ''; }
  langName(l: string | undefined) { return l ? (LANGUAGES[l] ?? l.toUpperCase()) : ''; }
  bodyLangs(t: AgreementTemplate) { return Object.keys(t.body).filter(k => t.body[k]?.trim()); }
  langs(t: AgreementTemplate) { return this.bodyLangs(t).map(l => this.langName(l)).join(', ') || '—'; }
  words(s: string) { return s.trim() ? s.trim().split(/\s+/).length : 0; }
  toggle(code: string) { this.expanded.set(this.expanded() === code ? null : code); }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<AgreementTemplate[]>('/agreement-templates').subscribe({
      next: r => { this.all.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  private blank() {
    return { title: '', code: '', programme_id: '', purposes: ['sampling', 'data_use'] as string[], en: '', kn: '' };
  }

  canSave() {
    return this.f.title.trim().length >= 2 && this.f.code.trim().length >= 2 && this.f.purposes.length > 0 &&
      (this.f.en.trim() || this.f.kn.trim());
  }

  togglePurpose(k: string) {
    const p = this.f.purposes;
    this.f.purposes = p.includes(k) ? p.filter(x => x !== k) : [...p, k];
  }

  openNew() {
    this.editing.set(null);
    this.f = this.blank();
    this.formError.set(null);
    this.fe.set({});
    this.editOpen.set(true);
  }

  edit(t: AgreementTemplate) {
    this.editing.set(t);
    this.f = { title: t.title, code: t.code, programme_id: t.programme_id ?? '', purposes: [...t.purposes],
      en: t.body['en'] ?? '', kn: t.body['kn'] ?? '' };
    this.formError.set(null);
    this.fe.set({});
    this.editOpen.set(true);
  }

  view(t: AgreementTemplate) { this.viewing.set(t); this.viewOpen.set(true); }

  save() {
    const f = this.f;
    const body: Record<string, string> = {};
    if (f.en.trim()) body['en'] = f.en.trim();
    if (f.kn.trim()) body['kn'] = f.kn.trim();
    const ed = this.editing();
    // Keep languages other than en/kn that an earlier edit may have added.
    if (ed) for (const [k, v] of Object.entries(ed.body)) if (k !== 'en' && k !== 'kn') body[k] = v;
    const payload = { title: f.title.trim(), purposes: f.purposes, body, programme_id: f.programme_id || null };
    this.busy.set(true);
    this.formError.set(null);
    const req = ed
      ? this.api.patch<AgreementTemplate>(`/agreement-templates/${ed.id}`, payload)
      : this.api.post<AgreementTemplate>('/agreement-templates', { ...payload, code: f.code.trim() });
    req.subscribe({
      next: t => {
        this.busy.set(false);
        this.editOpen.set(false);
        this.toast.success('Draft saved', `${t.title} · v${t.version}`);
        this.load();
      },
      error: (e: ApiError) => {
        this.busy.set(false);
        const m = fieldMap(e);
        this.fe.set(m);
        this.formError.set(formMessage(e, m) ?? (m['body'] ? m['body'] : null));
      },
    });
  }

  askPublish(t: AgreementTemplate) { this.target.set(t); this.publishOpen.set(true); }
  askVersion(t: AgreementTemplate) { this.target.set(t); this.versionOpen.set(true); }

  publish() {
    const t = this.target();
    if (!t) return;
    this.busy.set(true);
    this.api.post<AgreementTemplate>(`/agreement-templates/${t.id}/publish`).subscribe({
      next: r => { this.busy.set(false); this.publishOpen.set(false); this.toast.success('Agreement published', `${r.title} v${r.version} can now be signed.`); this.load(); },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e, "Couldn't publish"); },
    });
  }

  newVersion() {
    const t = this.target();
    if (!t) return;
    this.busy.set(true);
    this.api.post<AgreementTemplate>(`/agreement-templates/${t.id}/new-version`).subscribe({
      next: r => { this.busy.set(false); this.versionOpen.set(false); this.toast.success('New draft created', `v${r.version} is ready to edit.`); this.load(); this.edit(r); },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e, "Couldn't create a new version"); },
    });
  }
}
