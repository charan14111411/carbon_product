import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, map, of } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Callout, Empty, ErrorBox, FileDrop, Loading, Modal } from '../../ui/kit';
import { LabContext } from './lab-context';
import { LabChange } from './types';
import { VmRef } from './vm-ref';

const REF_LAB = 'VM0042 v2.2 §8.2.1.4 p.35-36';
const MIN_TEXT = 20;

/** Justified changes of laboratory for the current project (VM0042 §8.2.1.4). */
@Component({
  selector: 'vc-lab-changes',
  imports: [FormsModule, Icon, Callout, Empty, ErrorBox, FileDrop, Loading, Modal, DayPipe, VmRef],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-callout tone="info" icon="arrow-left-right" style="margin-bottom:14px">
      <strong>Same lab for the project lifetime.</strong> VM0042 expects every campaign of a project to be analysed by the same laboratory,
      so that baseline and re-measurement values are comparable. If the lab has to change, record why, and show that the new lab follows
      a consistent standard operating procedure (same method, preparation and QC). Campaigns using another lab without a recorded change
      raise a blocking quality finding. <vc-vm-ref [ref]="refLab" />
    </vc-callout>

    <div class="bar">
      <p class="muted small">Lab changes for <strong>{{ project.current()?.name ?? 'the current project' }}</strong>. Records are permanent and shown to the verifier.</p>
      <div class="spacer"></div>
      @if (canRecord() && project.currentId()) { <button class="btn btn-primary" (click)="openNew()"><vc-icon name="plus" />Record a lab change</button> }
    </div>

    <section class="card">
      @if (!project.currentId()) {
        <vc-empty icon="briefcase" title="Choose a project" text="Lab changes are recorded per project. Pick one from the project menu at the top." />
      } @else if (loading()) {
        <vc-loading [rows]="4" />
      } @else if (error()) {
        <div class="card-body"><vc-error title="Couldn't load lab changes" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error></div>
      } @else if (!rows().length) {
        <vc-empty icon="circle-check" title="No lab changes" text="This project has used one laboratory so far, as VM0042 expects. Record a change here only if the lab must be replaced." />
      } @else {
        <ol class="list">
          @for (c of rows(); track c.id) {
            <li class="it">
              <div class="head">
                <span class="labs"><code>{{ c.from_lab_code ?? ctx.labName(c.from_lab_id) }}</code><vc-icon name="arrow-right" [size]="14" /><code>{{ c.to_lab_code ?? ctx.labName(c.to_lab_id) }}</code></span>
                @if (c.effective_from) { <span class="subtle small">from {{ c.effective_from | day }}</span> }
                <span class="spacer"></span>
                <span class="who small">Recorded by <strong>{{ c.recorded_by || 'unknown' }}</strong> · {{ c.recorded_at | day: true }}</span>
              </div>
              <div class="grid-2 body">
                <div><div class="lbl">Justification</div><p>{{ c.justification }}</p></div>
                <div><div class="lbl">SOP consistency</div><p>{{ c.sop_consistency_statement }}</p></div>
              </div>
              <div class="foot">
                @if (c.evidence_ids.length) {
                  @for (id of c.evidence_ids; track id; let i = $index) {
                    <button class="btn btn-ghost btn-sm" (click)="openEvidence(id)"><vc-icon name="file-check" [size]="14" />{{ names()[id] || 'Evidence ' + (i + 1) }}</button>
                  }
                } @else { <span class="subtle small">No supporting files</span> }
                <span class="spacer"></span>
                <vc-vm-ref [ref]="c.reference" />
              </div>
            </li>
          }
        </ol>
      }
    </section>

    <vc-modal [(open)]="open" [title]="review() ? 'Check and record the lab change' : 'Record a lab change'" width="640px"
      [subtitle]="project.current()?.name ?? ''">
      @if (!review()) {
        <div class="form-grid">
          <div class="field"><label for="c-from">Previous lab</label>
            <select id="c-from" class="input" [(ngModel)]="f.from_lab_id">
              <option value="">Choose…</option>
              @for (l of ctx.labs(); track l.id) { <option [value]="l.id">{{ l.name }} ({{ l.code }})</option> }
            </select></div>
          <div class="field"><label for="c-to">New lab</label>
            <select id="c-to" class="input" [(ngModel)]="f.to_lab_id" [class.invalid]="sameLab()">
              <option value="">Choose…</option>
              @for (l of ctx.labs(); track l.id) { <option [value]="l.id">{{ l.name }} ({{ l.code }})</option> }
            </select>
            @if (sameLab()) { <span class="error">The new lab must be different from the previous lab.</span> }</div>
          <div class="field"><label for="c-eff">Effective from <span class="subtle">(optional)</span></label>
            <input id="c-eff" type="date" class="input" [(ngModel)]="f.effective_from" /></div>
          <div class="field span-2"><label for="c-j">Justification</label>
            <textarea id="c-j" class="input" rows="3" [(ngModel)]="f.justification"
              placeholder="The previous lab closed its soil section in March 2026 and can no longer take samples."></textarea>
            <span class="hint" [class.error]="f.justification.length > 0 && f.justification.trim().length < min">Why the lab must change. At least {{ min }} characters · {{ f.justification.trim().length }} so far.</span></div>
          <div class="field span-2"><label for="c-sop">SOP consistency statement</label>
            <textarea id="c-sop" class="input" rows="3" [(ngModel)]="f.sop_consistency_statement"
              placeholder="The new lab uses dry combustion (Dumas) on air-dried, 2 mm sieved soil, with the same reference material and duplicate rate."></textarea>
            <span class="hint" [class.error]="f.sop_consistency_statement.length > 0 && f.sop_consistency_statement.trim().length < min">How the new lab's standard operating procedure keeps results comparable. At least {{ min }} characters.</span></div>
          <div class="field span-2"><label>Supporting evidence <span class="subtle">(optional, up to 20 files)</span></label>
            <vc-file-drop [(file)]="nextFile" label="Add a file — e.g. the new lab's SOP, an inter-lab comparison" hint="PDF, spreadsheet or image · up to 25 MB each" />
            @if (files().length) {
              <ul class="files">
                @for (x of files(); track $index; let i = $index) {
                  <li><vc-icon name="file" [size]="14" /><span class="grow">{{ x.name }}</span><button class="btn btn-ghost btn-sm" type="button" (click)="removeFile(i)" aria-label="Remove file"><vc-icon name="x" [size]="14" /></button></li>
                }
              </ul>
            }
          </div>
        </div>
      } @else {
        <div class="stack" style="--gap:12px">
          <dl class="kv">
            <dt>Change</dt><dd>{{ ctx.labName(f.from_lab_id) }} → {{ ctx.labName(f.to_lab_id) }}</dd>
            <dt>Effective from</dt><dd>{{ f.effective_from ? (f.effective_from | day) : '—' }}</dd>
            <dt>Justification</dt><dd>{{ f.justification.trim() }}</dd>
            <dt>SOP consistency</dt><dd>{{ f.sop_consistency_statement.trim() }}</dd>
            <dt>Evidence</dt><dd>{{ files().length ? files().length + ' file(s)' : 'None' }}</dd>
          </dl>
          <vc-callout tone="warn" icon="lock">This record can't be edited or deleted afterwards. It is kept in the audit trail and shown to the verifier.</vc-callout>
        </div>
      }
      @if (err()) { <vc-callout tone="danger" icon="alert" style="margin-top:14px">{{ err() }}</vc-callout> }
      <ng-container footer>
        @if (!review()) {
          <button class="btn btn-secondary" (click)="open.set(false)">Cancel</button>
          <button class="btn btn-primary" [disabled]="!valid()" (click)="review.set(true)">Review<vc-icon name="arrow-right" /></button>
        } @else {
          <button class="btn btn-secondary" [disabled]="busy()" (click)="review.set(false)"><vc-icon name="arrow-left" />Back</button>
          <button class="btn btn-primary" [disabled]="busy()" (click)="save()"><vc-icon name="check" />{{ busy() ? 'Recording…' : 'Record lab change' }}</button>
        }
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;align-items:center;gap:12px;margin-bottom:14px}
    .list{list-style:none;margin:0;padding:0}
    .it{padding:16px 18px;border-bottom:1px solid var(--border)} .it:last-child{border-bottom:0}
    .head{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
    .labs{display:inline-flex;align-items:center;gap:8px;font-weight:600;color:var(--stone-700)}
    .who{color:var(--text-2)}
    .body{margin-top:12px;gap:16px}
    .body p{margin:4px 0 0;color:var(--stone-800);line-height:1.5;white-space:pre-line}
    .lbl{font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--text-3)}
    .foot{display:flex;align-items:center;gap:6px;margin-top:12px;flex-wrap:wrap}
    .files{list-style:none;margin:8px 0 0;padding:0;border:1px solid var(--border);border-radius:var(--radius-sm)}
    .files li{display:flex;align-items:center;gap:8px;padding:4px 6px 4px 12px;border-bottom:1px solid var(--stone-100);font-size:13px}
    .files li:last-child{border-bottom:0} .grow{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  `],
})
export class LabChanges {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  project = inject(ProjectContext);
  ctx = inject(LabContext);
  refLab = REF_LAB;
  min = MIN_TEXT;

  rows = signal<LabChange[]>([]);
  names = signal<Record<string, string>>({});
  loading = signal(true);
  error = signal<string | null>(null);
  open = signal(false);
  review = signal(false);
  busy = signal(false);
  err = signal<string | null>(null);
  files = signal<File[]>([]);
  nextFile = signal<File | null>(null);
  f = this.blank();
  canRecord = computed(() => this.auth.can('sampling.plan', 'programmes.manage'));

  constructor() {
    effect(() => {
      const pid = this.project.currentId();
      if (pid) this.load(pid);
    });
    effect(() => {
      const file = this.nextFile();
      if (!file) return;
      untracked(() => { if (this.files().length < 20) this.files.update(l => [...l, file]); });
      this.nextFile.set(null);
    });
  }

  private blank() {
    return { from_lab_id: '', to_lab_id: '', effective_from: '', justification: '', sop_consistency_statement: '' };
  }

  sameLab() { return !!this.f.from_lab_id && this.f.from_lab_id === this.f.to_lab_id; }
  valid() {
    const f = this.f;
    return !!f.from_lab_id && !!f.to_lab_id && !this.sameLab() && f.justification.trim().length >= MIN_TEXT &&
      f.sop_consistency_statement.trim().length >= MIN_TEXT;
  }

  load(pid = this.project.currentId()) {
    if (!pid) return;
    this.loading.set(true);
    this.error.set(null);
    this.api.get<LabChange[]>(`/projects/${pid}/lab-changes`).subscribe({
      next: r => { this.rows.set([...r].reverse()); this.loading.set(false); this.fetchNames(r); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  private fetchNames(rows: LabChange[]) {
    const known = this.names();
    for (const id of new Set(rows.flatMap(r => r.evidence_ids).filter(id => !known[id]))) {
      this.api.get<{ filename: string }>(`/evidence/${id}`).subscribe({
        next: e => this.names.update(m => ({ ...m, [id]: e.filename })),
        error: () => {},
      });
    }
  }

  openNew() {
    this.f = this.blank();
    const labs = this.ctx.labs();
    if (labs.length === 2) { this.f.from_lab_id = labs[0].id; this.f.to_lab_id = labs[1].id; }
    this.files.set([]);
    this.review.set(false);
    this.err.set(null);
    this.open.set(true);
  }

  removeFile(i: number) { this.files.update(l => l.filter((_, j) => j !== i)); }

  save() {
    const pid = this.project.currentId();
    if (!pid) return;
    this.busy.set(true);
    this.err.set(null);
    const uploads = this.files().map(file => {
      const form = new FormData();
      form.append('file', file);
      form.append('kind', 'lab_change_evidence');
      form.append('entity_type', 'project');
      form.append('entity_id', pid);
      return this.api.upload<{ id: string }>('/evidence', form).pipe(map(e => e.id));
    });
    (uploads.length ? forkJoin(uploads) : of([] as string[])).subscribe({
      next: ids => {
        const f = this.f;
        this.api.post<LabChange>(`/projects/${pid}/lab-changes`, {
          from_lab_id: f.from_lab_id, to_lab_id: f.to_lab_id, justification: f.justification.trim(),
          sop_consistency_statement: f.sop_consistency_statement.trim(), evidence_ids: ids, effective_from: f.effective_from || null,
        }).subscribe({
          next: c => {
            this.busy.set(false);
            this.open.set(false);
            this.toast.success(`Lab change recorded: ${c.from_lab_code} → ${c.to_lab_code}`, 'Run the quality checks to clear any lab-change finding.');
            this.load(pid);
          },
          error: (e: ApiError) => { this.busy.set(false); this.err.set(e.message); },
        });
      },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(`Couldn't upload the evidence: ${e.message}`); },
    });
  }

  openEvidence(id: string) {
    const w = window.open('', '_blank');
    this.api.blob(`/evidence/${id}/content`).subscribe({
      next: b => {
        const u = URL.createObjectURL(b);
        if (w) w.location.href = u; else window.open(u, '_blank');
        setTimeout(() => URL.revokeObjectURL(u), 60_000);
      },
      error: (e: ApiError) => { w?.close(); this.toast.apiError(e, "Couldn't open the file"); },
    });
  }
}
