import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, HumanPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, Empty, ErrorBox, Loading, Modal } from '../../ui/kit';
import { evidenceForm } from './field-data';
import { TENURE_KINDS, TENURE_KIND_HINT, Tenure, UserLite } from './site-data';

/** Land tenure for one field: who controls the land, for which period, with documents and a four-eyes check. */
@Component({
  selector: 'vc-tenure',
  imports: [FormsModule, Icon, Badge, DataClass, Empty, ErrorBox, Loading, Modal, Callout, DayPipe, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="head">
      <p class="muted small">Enrolment needs verified tenure covering the whole crediting period. A colleague who didn’t record the tenure verifies it against the documents.</p>
      @if (auth.can('land.manage')) {
        <button class="btn btn-secondary btn-sm" [disabled]="!farmerId()" (click)="openAdd()"><vc-icon name="plus" [size]="14" />Add tenure record</button>
      }
    </div>

    @if (loading()) { <vc-loading [rows]="3" /> }
    @else if (error()) { <div class="card-body"><vc-error title="Couldn't load land tenure" [message]="error()!" /></div> }
    @else if (!items().length) {
      <vc-empty icon="landmark" title="No tenure recorded"
        text="Record how the farmer holds this land — owned, leased, shared or community rights — with the title, lease or agreement attached." />
    } @else {
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Kind</th><th>Holder</th><th>Valid</th><th>Documents</th><th>Recorded by</th><th>Status</th><th></th></tr></thead>
          <tbody>
            @for (t of items(); track t.id) {
              <tr>
                <td><strong>{{ t.kind | human }}</strong>@if (t.notes) { <div class="small muted note">{{ t.notes }}</div> }</td>
                <td>{{ holderName(t.holder_farmer_id) }}</td>
                <td class="nowrap">{{ t.valid_from | day }} – {{ t.valid_to ? (t.valid_to | day) : 'open-ended' }}</td>
                <td>
                  <div class="docs">
                    @for (d of t.document_evidence_ids; track d; let i = $index) {
                      <button class="btn btn-ghost btn-sm" (click)="viewEvidence(d)"><vc-icon name="file" [size]="13" />Doc {{ i + 1 }}</button>
                    }
                  </div>
                </td>
                <td>
                  <div>{{ userName(t.created_by) }}</div>
                  <div class="small subtle">{{ t.created_at | day }} · <vc-dc cls="RECORDED" /></div>
                </td>
                <td>
                  <vc-badge [status]="t.status" />
                  @if (t.status !== 'pending') {
                    <div class="small subtle rev">{{ t.status === 'verified' ? 'Verified' : 'Rejected' }} by {{ userName(t.verified_by) }}, {{ t.verified_at | day }}</div>
                    @if (t.review_note) { <div class="small muted rev">“{{ t.review_note }}”</div> }
                  }
                </td>
                <td class="num">
                  @if (t.status === 'pending' && auth.can('programmes.manage')) {
                    @if (isMine(t)) {
                      <span class="mine" title="You recorded this, so another person must verify it.">Needs a colleague</span>
                    } @else {
                      <button class="btn btn-secondary btn-sm" (click)="openReview(t)">Review</button>
                    }
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    <!-- add -->
    <vc-modal [(open)]="addOpen" title="Add land tenure" subtitle="The record starts as pending until a colleague verifies it." width="600px">
      <div class="form-grid">
        <div class="field span-2">
          <span class="label">Kind of tenure</span>
          <div class="seg">
            @for (k of kinds; track k) {
              <button type="button" [class.on]="kind() === k" (click)="kind.set(k)">{{ k | human }}</button>
            }
          </div>
          @if (kind()) { <span class="hint">{{ hint(kind()) }}</span> }
        </div>
        <div class="field span-2">
          <span class="label">Holder</span>
          <div class="holder"><vc-icon name="user" [size]="14" />{{ farmerName() || 'The field’s farmer' }}</div>
          <span class="hint">Tenure is checked for the farmer who owns this field’s farm.</span>
        </div>
        <div class="field">
          <label for="tn-from">Valid from</label>
          <input id="tn-from" type="date" class="input" [ngModel]="from()" (ngModelChange)="from.set($event)" />
        </div>
        <div class="field">
          <label for="tn-to">Valid to <span class="subtle">(leave empty if open-ended)</span></label>
          <input id="tn-to" type="date" class="input" [ngModel]="to()" (ngModelChange)="to.set($event)" />
          @if (to() && from() && to() < from()) { <span class="error">The end date can’t be before the start date.</span> }
        </div>
        <div class="field span-2">
          <label for="tn-notes">Notes @if (kind() !== 'other') { <span class="subtle">(optional)</span> } @else { <span class="req">*</span> }</label>
          <textarea id="tn-notes" class="input" rows="2" maxlength="4000" [ngModel]="notes()" (ngModelChange)="notes.set($event)"
            placeholder="e.g. Survey no. 112/3, RTC updated 2023; lease registered at the sub-registrar"></textarea>
          @if (kind() === 'other') { <span class="hint">Describe the arrangement — at least 5 characters.</span> }
        </div>
        <div class="field span-2">
          <span class="label">Documents <span class="req">*</span></span>
          @if (files().length) {
            <ul class="files">
              @for (f of files(); track $index) {
                <li><vc-icon name="file" [size]="14" /><span class="fn">{{ f.name }}</span><span class="subtle small">{{ size(f) }}</span>
                  <button class="btn btn-ghost btn-icon btn-sm" (click)="removeFile($index)" aria-label="Remove file"><vc-icon name="x" [size]="14" /></button></li>
              }
            </ul>
          }
          <input #pick type="file" multiple accept=".pdf,image/*" hidden (change)="picked($event)" />
          <button type="button" class="zone" [class.over]="over()" (click)="pick.click()"
            (dragover)="$event.preventDefault(); over.set(true)" (dragleave)="over.set(false)" (drop)="dropped($event)">
            <vc-icon name="upload" [size]="18" />
            <span class="z-t">{{ files().length ? 'Add another document' : 'Attach a title deed, lease or agreement' }}</span>
            <span class="z-s">PDF, JPG or PNG · several files allowed · stored with a tamper-evident fingerprint</span>
          </button>
        </div>
      </div>
      @if (formError()) { <vc-callout tone="danger" icon="alert" class="mt">{{ formError() }}</vc-callout> }
      <div footer class="ft">
        <span class="subtle small grow">{{ addProblem() ?? 'Ready to save' }}</span>
        <button class="btn btn-ghost" (click)="addOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="!!addProblem() || saving()" (click)="save()">{{ saving() ? progress() : 'Save tenure' }}</button>
      </div>
    </vc-modal>

    <!-- review -->
    <vc-modal [(open)]="reviewOpen" title="Review land tenure" subtitle="Check the documents against the holder, the field and the dates." width="560px">
      @if (reviewing(); as t) {
        <dl class="kv">
          <dt>Kind</dt><dd>{{ t.kind | human }}</dd>
          <dt>Holder</dt><dd>{{ holderName(t.holder_farmer_id) }}</dd>
          <dt>Valid</dt><dd>{{ t.valid_from | day }} – {{ t.valid_to ? (t.valid_to | day) : 'open-ended' }}</dd>
          <dt>Recorded by</dt><dd>{{ userName(t.created_by) }} on {{ t.created_at | day: true }}</dd>
          <dt>Documents</dt>
          <dd><div class="docs">@for (d of t.document_evidence_ids; track d; let i = $index) { <button class="btn btn-ghost btn-sm" (click)="viewEvidence(d)"><vc-icon name="file" [size]="13" />Doc {{ i + 1 }}</button> }</div></dd>
        </dl>
        <vc-callout tone="info" icon="users" class="mt">Four-eyes rule: the person who recorded or edited this tenure can’t verify it. {{ userName(t.created_by) }} recorded it, so you can review it.</vc-callout>
        <div class="field mt">
          <span class="label">Decision</span>
          <div class="seg">
            <button type="button" [class.on]="decision() === 'verified'" (click)="decision.set('verified')"><vc-icon name="check" [size]="14" />Verify</button>
            <button type="button" [class.on]="decision() === 'rejected'" class="rej" (click)="decision.set('rejected')"><vc-icon name="x" [size]="14" />Reject</button>
          </div>
        </div>
        <div class="field mt">
          <label for="tn-rnote">Note @if (decision() === 'rejected') { <span class="req">*</span> } @else { <span class="subtle">(optional)</span> }</label>
          <textarea id="tn-rnote" class="input" rows="2" maxlength="4000" [ngModel]="reviewNote()" (ngModelChange)="reviewNote.set($event)"
            [placeholder]="decision() === 'rejected' ? 'Say what is wrong, e.g. the lease ends before the crediting period' : 'e.g. RTC matches survey number and farmer name'"></textarea>
        </div>
        @if (reviewError()) {
          <vc-callout [tone]="selfApproval() ? 'warn' : 'danger'" icon="alert" class="mt">
            @if (selfApproval()) { <strong>You recorded or edited this tenure, so another person must verify it.</strong> }
            {{ reviewError() }}
          </vc-callout>
        }
      }
      <div footer class="ft">
        <span class="subtle small grow">This decision can’t be undone. A rejected record stays in the history.</span>
        <button class="btn btn-ghost" (click)="reviewOpen.set(false)">Cancel</button>
        <button class="btn" [class.btn-primary]="decision() === 'verified'" [class.btn-danger]="decision() === 'rejected'"
          [disabled]="!!reviewProblem() || saving()" [title]="reviewProblem() ?? ''" (click)="submitReview()">
          {{ saving() ? 'Saving…' : decision() === 'rejected' ? 'Reject tenure' : 'Verify tenure' }}
        </button>
      </div>
    </vc-modal>
  `,
  styles: [`
    .head{display:flex;align-items:center;gap:16px;padding:14px 20px;border-bottom:1px solid var(--border)}
    .head p{flex:1}
    .note{max-width:280px;margin-top:2px;overflow-wrap:anywhere}
    .docs{display:flex;flex-wrap:wrap;gap:2px}
    .rev{margin-top:3px;max-width:240px}
    .mine{font-size:12px;color:var(--text-3);white-space:nowrap}
    .seg{display:flex;gap:6px;flex-wrap:wrap}
    .seg button{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border:1px solid var(--border-strong);border-radius:7px;background:var(--surface);font:inherit;font-size:13px;cursor:pointer;color:var(--stone-800)}
    .seg button.on{border-color:var(--forest-500);background:var(--forest-50);box-shadow:0 0 0 1px var(--forest-500) inset}
    .seg button.rej.on{border-color:var(--red-600);background:var(--danger-soft);box-shadow:0 0 0 1px var(--red-600) inset;color:var(--red-600)}
    .holder{display:flex;align-items:center;gap:8px;height:36px;padding:0 12px;border-radius:var(--radius-sm);background:var(--surface-2);border:1px solid var(--border);color:var(--stone-800)}
    .files{list-style:none;margin:0 0 8px;padding:0;display:flex;flex-direction:column;gap:4px}
    .files li{display:flex;align-items:center;gap:8px;padding:4px 4px 4px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface-2)}
    .fn{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .zone{width:100%;display:flex;flex-direction:column;align-items:center;gap:4px;padding:16px;border:1.5px dashed var(--border-strong);
      border-radius:var(--radius);background:var(--surface-2);color:var(--stone-600);cursor:pointer;font:inherit}
    .zone:hover,.zone.over{border-color:var(--forest-400);background:var(--forest-50);color:var(--forest-700)}
    .z-t{font-weight:500;color:var(--stone-800)} .z-s{font-size:12px;color:var(--text-3)}
    .req{color:var(--danger)}
    .kv{grid-template-columns:120px 1fr}
    .mt{margin-top:14px}
    .ft{display:flex;gap:8px;align-items:center;width:100%;justify-content:flex-end}
    .grow{margin-right:auto}
  `],
})
export class TenurePanel {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  auth = inject(AuthService);
  fieldId = input.required<string>();
  farmerId = input<string | null>(null);
  farmerName = input<string>('');
  users = input<UserLite[]>([]);
  changed = output<Tenure[]>();

  kinds = TENURE_KINDS;
  items = signal<Tenure[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  saving = signal(false);

  // add
  addOpen = signal(false);
  kind = signal<string>('');
  from = signal('');
  to = signal('');
  notes = signal('');
  files = signal<File[]>([]);
  formError = signal<string | null>(null);
  progress = signal('Saving…');
  addProblem = computed(() => {
    if (!this.kind()) return 'Choose the kind of tenure';
    if (!this.from()) return 'Enter the start date';
    if (this.to() && this.to() < this.from()) return 'The end date is before the start date';
    if (this.kind() === 'other' && this.notes().trim().length < 5) return 'Describe the arrangement in the notes';
    if (!this.files().length) return 'Attach at least one document';
    return null;
  });

  // review
  reviewOpen = signal(false);
  reviewing = signal<Tenure | null>(null);
  decision = signal<'verified' | 'rejected'>('verified');
  reviewNote = signal('');
  reviewError = signal<string | null>(null);
  selfApproval = signal(false);
  reviewProblem = computed(() => (this.decision() === 'rejected' && this.reviewNote().trim().length < 5 ? 'Say why it is rejected (at least 5 characters)' : null));

  private names = computed(() => new Map(this.users().map(u => [u.id, u.full_name])));

  constructor() {
    effect(() => { const id = this.fieldId(); untracked(() => this.load(id)); });
  }

  load(id = this.fieldId()) {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Tenure[]>(`/fields/${id}/tenure`).subscribe({
      next: r => { this.items.set(r); this.loading.set(false); this.changed.emit(r); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  hint(k: string) { return TENURE_KIND_HINT[k] ?? ''; }
  userName(id: string | null) {
    if (!id) return 'System';
    if (id === this.auth.profile()?.id) return 'You';
    return this.names().get(id) ?? 'A colleague';
  }
  holderName(id: string) { return id === this.farmerId() && this.farmerName() ? this.farmerName() : 'Another farmer'; }
  isMine(t: Tenure) { return !!t.created_by && t.created_by === this.auth.profile()?.id; }
  size(f: File) { return f.size > 1e6 ? `${(f.size / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(f.size / 1e3))} KB`; }
  over = signal(false);
  picked(e: Event) {
    const inp = e.target as HTMLInputElement;
    this.files.update(l => [...l, ...Array.from(inp.files ?? [])]);
    inp.value = '';
  }
  dropped(e: DragEvent) {
    e.preventDefault();
    this.over.set(false);
    this.files.update(l => [...l, ...Array.from(e.dataTransfer?.files ?? [])]);
  }
  removeFile(i: number) { this.files.update(l => l.filter((_, j) => j !== i)); }

  openAdd() {
    this.kind.set(''); this.from.set(''); this.to.set(''); this.notes.set(''); this.files.set([]);
    this.formError.set(null);
    this.addOpen.set(true);
  }

  async save() {
    this.saving.set(true);
    this.formError.set(null);
    try {
      const ids: string[] = [];
      const files = this.files();
      for (let i = 0; i < files.length; i++) {
        this.progress.set(`Uploading ${i + 1} of ${files.length}…`);
        const ev = await firstValueFrom(this.api.upload<{ id: string }>('/evidence', evidenceForm(files[i], 'document', 'field', this.fieldId())));
        ids.push(ev.id);
      }
      this.progress.set('Saving…');
      await firstValueFrom(this.api.post(`/fields/${this.fieldId()}/tenure`, {
        holder_farmer_id: this.farmerId(), kind: this.kind(), document_evidence_ids: ids,
        valid_from: this.from(), valid_to: this.to() || null, notes: this.notes().trim(),
      }));
      this.toast.success('Tenure recorded', 'Ask a colleague to verify it against the documents.');
      this.addOpen.set(false);
      this.load();
    } catch (e) {
      this.formError.set((e as ApiError).message);
    } finally {
      this.saving.set(false);
    }
  }

  openReview(t: Tenure) {
    this.reviewing.set(t);
    this.decision.set('verified');
    this.reviewNote.set('');
    this.reviewError.set(null);
    this.selfApproval.set(false);
    this.reviewOpen.set(true);
  }

  submitReview() {
    const t = this.reviewing();
    if (!t) return;
    this.saving.set(true);
    this.reviewError.set(null);
    this.api.post<Tenure>(`/tenure/${t.id}/verify`, { decision: this.decision(), note: this.reviewNote().trim() }).subscribe({
      next: r => {
        this.saving.set(false);
        this.reviewOpen.set(false);
        this.toast.success(r.status === 'verified' ? 'Tenure verified' : 'Tenure rejected');
        this.load();
      },
      error: (e: ApiError) => {
        this.saving.set(false);
        this.selfApproval.set(e.code === 'SELF_APPROVAL_REJECTED');
        this.reviewError.set(e.message);
      },
    });
  }

  viewEvidence(id: string) {
    this.api.blob(`/evidence/${id}/content`).subscribe({
      next: b => window.open(URL.createObjectURL(b), '_blank'),
      error: e => this.toast.apiError(e, "Couldn't open the document"),
    });
  }
}
