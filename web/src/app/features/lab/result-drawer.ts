import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, HumanPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, FileDrop, Hash, Modal } from '../../ui/kit';
import { LabContext } from './lab-context';
import { ANALYTES, LabResult, NOT_RECOMMENDED_METHODS, NOT_RECOMMENDED_NOTE, PURPOSES, SPECTRO_METHODS, analyteLabel } from './types';
import { VmRef } from './vm-ref';

type Action = 'accept' | 'reject' | 'void' | 'supersede' | null;

/** One lab result: certificate, review decision, and corrections by supersession. */
@Component({
  selector: 'vc-result-drawer',
  imports: [FormsModule, Modal, Icon, Badge, Callout, DataClass, FileDrop, Hash, DayPipe, NumPipe, HumanPipe, VmRef],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [open]="!!result()" (closed)="result.set(null)" [drawer]="true" width="560px"
      [title]="(r()?.bag_code ?? 'Result') + ' · ' + analyte()" [subtitle]="'Version ' + (r()?.version ?? 1) + (r()?.supersedes_id ? ' — supersedes an earlier value' : '')">
      @if (r(); as r) {
        <div class="stack" style="--gap:20px">
          <div class="hero">
            <div class="val"><strong class="num">{{ r.value | num: 3 }}</strong><span>{{ r.unit }}</span></div>
            <div class="tags">
              <vc-dc [cls]="r.data_class" />
              <vc-badge [status]="r.status" />
              @if (frozen()) { <span class="lock"><vc-icon name="lock" [size]="13" />Frozen</span> }
            </div>
          </div>

          @if (r.below_detection_limit) {
            <vc-callout tone="warn" icon="circle-alert">
              <strong>Below the detection limit.</strong> {{ r.value | num: 3 }} {{ r.unit }} is under the lab's limit of detection
              ({{ r.detection_limit | num: 3 }} {{ r.unit }}), so the value is uncertain. It is flagged in the quality checks. <vc-vm-ref ref="VM0042 §8.2.1.4 p.35-36" />
            </vc-callout>
          }
          @if (!r.method_recommended) {
            <vc-callout tone="warn" icon="alert">
              <strong>{{ r.method | human }}</strong> — {{ notRecNote }} <vc-vm-ref ref="VM0042 §8.2.1.4 p.35" />
              @if (r.method_justification) { <div class="note">Justification: “{{ r.method_justification }}”</div> }
            </vc-callout>
          }

          @if (frozen()) {
            <vc-callout tone="info" icon="lock">
              {{ r.status | human }} by {{ r.reviewed_by || 'a reviewer' }} on {{ r.reviewed_at | day: true }}. Its values can no longer change —
              a correction is recorded as a new version that supersedes this one.
              @if (r.review_note) { <div class="note">“{{ r.review_note }}”</div> }
            </vc-callout>
          }

          <dl class="kv">
            <dt>Bag</dt><dd><code>{{ r.bag_code }}</code>&ngsp;<span class="subtle small">label {{ r.label_qr }}</span></dd>
            <dt>Lab</dt><dd>{{ ctx.labName(r.lab_id) }}</dd>
            <dt>Method</dt><dd>{{ r.method | human }}</dd>
            <dt>Analysed on</dt><dd>{{ r.analysed_on | day }}</dd>
            <dt>Purpose</dt><dd>{{ purposeLabel() }}</dd>
            <dt>Uncertainty</dt><dd class="num">{{ r.uncertainty === null ? '—' : '± ' + (r.uncertainty | num: 3) + ' ' + r.unit }}</dd>
            <dt>Detection limit</dt><dd class="num">{{ r.detection_limit === null ? '—' : (r.detection_limit | num: 3) + ' ' + r.unit }}@if (r.below_detection_limit) { &ngsp;<span class="bdl">below</span> }</dd>
            @if (r.calibration_id) { <dt>Calibration</dt><dd>{{ calibrationCode() }}</dd> }
            <dt>Entered by</dt><dd>{{ r.entered_by || '—' }}</dd>
          </dl>

          <section>
            <h3 class="sh">Lab certificate</h3>
            @if (r.certificate_id) {
              <div class="cert">
                <vc-icon name="file-check" [size]="20" />
                <div class="ci">
                  <strong>{{ certName() || 'Certificate (PDF)' }}</strong>
                  @if (certSha()) { <vc-hash [value]="certSha()!" /> }
                </div>
                <button class="btn btn-secondary btn-sm" (click)="openCert()"><vc-icon name="eye" [size]="14" />Open</button>
              </div>
            } @else {
              <vc-callout tone="warn" icon="alert">No certificate yet. A result can't be accepted without the signed lab certificate.</vc-callout>
            }
            @if (r.status === 'pending' && auth.can('lab.submit', 'lab.review')) {
              <div class="up">
                <vc-file-drop accept="application/pdf" [(file)]="certFile" [label]="r.certificate_id ? 'Replace with another PDF' : 'Choose the certificate PDF'" hint="PDF only · up to 25 MB" />
                @if (certFile()) {
                  <button class="btn btn-primary" [disabled]="busy()" (click)="uploadCert()"><vc-icon name="upload" />{{ busy() ? 'Uploading…' : 'Attach certificate' }}</button>
                }
              </div>
            }
          </section>

          @if (actions().length) {
            <section>
              <h3 class="sh">Decision</h3>
              <div class="acts">
                @for (a of actions(); track a.key) {
                  <button class="btn" [class.btn-primary]="a.key === 'accept'" [class.btn-secondary]="a.key === 'supersede'"
                    [class.btn-danger]="a.key === 'reject' || a.key === 'void'" (click)="startAction(a.key)"><vc-icon [name]="a.icon" />{{ a.label }}</button>
                }
              </div>
            </section>
          }
        </div>
      }
    </vc-modal>

    <vc-modal [open]="!!action()" (closed)="action.set(null)" width="520px" [title]="actionTitle()">
      @if (r(); as r) {
        <div class="stack" style="--gap:14px">
          @switch (action()) {
            @case ('accept') {
              <p class="muted">Accepting freezes this value. It becomes the measured value used in carbon calculations.</p>
              <vc-callout [tone]="mine() ? 'warn' : 'info'" icon="users">
                @if (mine()) {
                  You entered or edited this result, so you can't accept it. A second person must review it — the four-eyes rule.
                } @else {
                  Four-eyes rule: the person who entered or edited a result ({{ r.entered_by || 'unknown' }}) can't accept it.
                }
              </vc-callout>
              @if (!r.certificate_id) { <vc-callout tone="danger" icon="alert">Attach the certificate first — acceptance is refused without it.</vc-callout> }
              <div class="field"><label for="a-note">Review note <span class="subtle">(optional)</span></label>
                <textarea id="a-note" class="input" rows="2" [(ngModel)]="note" placeholder="Checked against the signed certificate."></textarea></div>
            }
            @case ('reject') {
              <p class="muted">A rejected result stays on record but is not used. The lab can submit a corrected value as a new version.</p>
              <div class="field"><label for="r-note">Why is it rejected?</label>
                <textarea id="r-note" class="input" rows="3" [(ngModel)]="note" placeholder="Value does not match the certificate."></textarea>
                <span class="hint">At least 5 characters. Kept in the audit log.</span></div>
            }
            @case ('void') {
              <p class="muted">Voiding withdraws an accepted value from calculations. Use Supersede instead if you have the correct value.</p>
              <div class="field"><label for="v-note">Reason</label>
                <textarea id="v-note" class="input" rows="3" [(ngModel)]="note"></textarea>
                <span class="hint">At least 5 characters. Kept in the audit log.</span></div>
            }
            @case ('supersede') {
              <p class="muted">The current value (v{{ r.version }}) is voided and a new pending version is created. It needs its own certificate and review.</p>
              <div class="form-grid">
                <div class="field"><label for="s-val">Correct value</label>
                  <input id="s-val" type="number" step="any" class="input num" [(ngModel)]="sValue" /></div>
                <div class="field"><label for="s-unit">Unit</label>
                  <input id="s-unit" class="input" [(ngModel)]="sUnit" /></div>
                <div class="field"><label for="s-method">Method</label>
                  <input id="s-method" class="input" [(ngModel)]="sMethod" list="s-methods" />
                  <datalist id="s-methods">@for (m of methods(); track m) { <option [value]="m"></option> }</datalist></div>
                <div class="field"><label for="s-date">Analysed on</label>
                  <input id="s-date" type="date" class="input" [(ngModel)]="sDate" [max]="today" /></div>
                <div class="field"><label for="s-unc">Uncertainty <span class="subtle">(optional)</span></label>
                  <input id="s-unc" type="number" step="any" min="0" class="input num" [(ngModel)]="sUnc" /></div>
                <div class="field"><label for="s-dl">Detection limit <span class="subtle">(optional)</span></label>
                  <input id="s-dl" type="number" step="any" min="0" class="input num" [(ngModel)]="sDl" /></div>
                @if (isNotRec(sMethod)) {
                  <div class="field span-2"><label for="s-just">Method justification <span class="req">*</span></label>
                    <textarea id="s-just" class="input" rows="2" [(ngModel)]="sJust" placeholder="Why no other method is available."></textarea>
                    <span class="hint">{{ notRecNote }} At least 20 characters.</span></div>
                }
                @if (isSpectro(sMethod)) {
                  <div class="field"><label for="s-cal">Calibration</label>
                    <select id="s-cal" class="input" [(ngModel)]="sCal">
                      <option value="">Choose…</option>
                      @for (c of approvedCals(); track c.id) { <option [value]="c.id">{{ c.code }}</option> }
                    </select></div>
                }
                <div class="field span-2"><label for="s-reason">Reason for the correction</label>
                  <textarea id="s-reason" class="input" rows="2" [(ngModel)]="note" placeholder="Transcription error — certificate shows 1.24."></textarea></div>
              </div>
            }
          }
          @if (err()) { <vc-callout tone="danger" icon="alert">{{ err() }}</vc-callout> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-secondary" (click)="action.set(null)">Cancel</button>
        <button class="btn" [class.btn-primary]="action() === 'accept' || action() === 'supersede'" [class.btn-danger]="action() === 'reject' || action() === 'void'"
          [disabled]="busy() || !actionValid()" (click)="submit()">{{ busy() ? 'Working…' : actionTitle() }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .hero{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding:16px 18px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface-2)}
    .val strong{font-size:32px;font-weight:600;letter-spacing:-.02em;line-height:1}
    .val span{margin-left:6px;color:var(--text-2);font-size:15px}
    .tags{display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end}
    .lock{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:500;color:var(--stone-600);background:var(--stone-100);border:1px solid var(--stone-200);border-radius:999px;padding:2px 8px}
    .note{margin-top:6px;color:var(--stone-700);font-style:italic}
    .sh{margin-bottom:10px}
    .cert{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--forest-600)}
    .ci{flex:1;display:flex;flex-direction:column;gap:4px;min-width:0;color:var(--text)}
    .up{display:flex;flex-direction:column;gap:10px;margin-top:10px;align-items:flex-start}
    .up vc-file-drop{width:100%}
    .acts{display:flex;gap:8px;flex-wrap:wrap}
    .bdl{display:inline-flex;height:18px;align-items:center;padding:0 6px;border-radius:4px;background:var(--amber-100);color:var(--amber-600);font-size:11px;font-weight:500}
    .req{color:var(--danger)}
  `],
})
export class ResultDrawer {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  auth = inject(AuthService);
  ctx = inject(LabContext);

  result = model<LabResult | null>(null);
  changed = output<LabResult>();

  r = computed(() => this.result());
  action = signal<Action>(null);
  busy = signal(false);
  err = signal<string | null>(null);
  certFile = signal<File | null>(null);
  certSha = signal<string | null>(null);
  certName = signal<string | null>(null);
  notRecNote = NOT_RECOMMENDED_NOTE;
  today = new Date().toISOString().slice(0, 10);
  note = '';
  sValue: number | null = null;
  sUnit = '';
  sMethod = '';
  sDate = '';
  sUnc: number | null = null;
  sCal = '';
  sDl: number | null = null;
  sJust = '';

  purposeLabel = computed(() => PURPOSES.find(p => p.key === this.r()?.purpose)?.label ?? 'Primary result');
  isSpectro(m: string) { return SPECTRO_METHODS.has(m.trim()); }
  isNotRec(m: string) { return NOT_RECOMMENDED_METHODS.has(m.trim()); }
  frozen = computed(() => !!this.r() && this.r()!.status !== 'pending');
  analyte = computed(() => analyteLabel(this.r()?.analyte ?? ''));
  methods = computed(() => ANALYTES.find(a => a.key === this.r()?.analyte)?.methods ?? []);
  approvedCals = computed(() => this.ctx.calibrations().filter(c => c.status === 'approved' && c.analyte === this.r()?.analyte));
  calibrationCode = computed(() => this.ctx.calibrations().find(c => c.id === this.r()?.calibration_id)?.code ?? 'Linked calibration');
  mine = computed(() => !!this.r()?.entered_by && this.r()!.entered_by === this.auth.profile()?.full_name);
  actions = computed(() => {
    const r = this.r();
    if (!r) return [];
    const review = this.auth.can('lab.review');
    const out: { key: Exclude<Action, null>; label: string; icon: string }[] = [];
    if (r.status === 'pending' && review) out.push({ key: 'accept', label: 'Accept', icon: 'check' }, { key: 'reject', label: 'Reject', icon: 'x' });
    if (r.status === 'accepted' && review) out.push({ key: 'void', label: 'Void', icon: 'ban' });
    if ((r.status === 'pending' && this.auth.can('lab.submit')) || ((r.status === 'accepted' || r.status === 'rejected') && review)) {
      out.push({ key: 'supersede', label: 'Supersede with correct value', icon: 'undo' });
    }
    return out;
  });
  actionTitle = computed(() => ({ accept: 'Accept result', reject: 'Reject result', void: 'Void result', supersede: 'Create corrected version' } as Record<string, string>)[this.action() ?? ''] ?? '');

  constructor() {
    effect(() => {
      const r = this.r();
      this.certFile.set(null);
      this.certSha.set(null);
      this.certName.set(null);
      if (r?.certificate_id) {
        this.api.get<{ sha256: string; filename: string }>(`/evidence/${r.certificate_id}`).subscribe({
          next: e => { this.certSha.set(e.sha256); this.certName.set(e.filename); },
          error: () => {},
        });
      }
    });
  }

  startAction(a: Action) {
    const r = this.r()!;
    this.err.set(null);
    this.note = '';
    if (a === 'supersede') {
      this.sValue = r.value; this.sUnit = r.unit; this.sMethod = r.method; this.sDate = r.analysed_on;
      this.sUnc = r.uncertainty; this.sCal = r.calibration_id ?? '';
      this.sDl = r.detection_limit; this.sJust = r.method_justification ?? '';
    }
    this.action.set(a);
  }

  actionValid() {
    const a = this.action();
    if (a === 'accept') return true;
    if (a === 'supersede') {
      return this.sValue !== null && `${this.sValue}` !== '' && this.sMethod.trim().length >= 2 && !!this.sDate && this.note.trim().length >= 5 &&
        (!this.isNotRec(this.sMethod) || this.sJust.trim().length >= 20) && (!this.isSpectro(this.sMethod) || !!this.sCal);
    }
    return this.note.trim().length >= 5;
  }

  submit() {
    const r = this.r()!;
    const a = this.action();
    this.busy.set(true);
    this.err.set(null);
    const req = a === 'accept' ? this.api.post<LabResult>(`/lab-results/${r.id}/accept`, { note: this.note.trim() || null })
      : a === 'reject' ? this.api.post<LabResult>(`/lab-results/${r.id}/reject`, { note: this.note.trim() })
      : a === 'void' ? this.api.post<LabResult>(`/lab-results/${r.id}/void`, { note: this.note.trim() })
      : this.api.post<LabResult>(`/lab-results/${r.id}/supersede`, {
          value: Number(this.sValue), method: this.sMethod.trim(), analysed_on: this.sDate, reason: this.note.trim(),
          unit: this.sUnit.trim() || null, uncertainty: this.sUnc === null || `${this.sUnc}` === '' ? null : Number(this.sUnc),
          detection_limit: this.sDl === null || `${this.sDl}` === '' ? null : Number(this.sDl),
          method_justification: this.isNotRec(this.sMethod) ? this.sJust.trim() : null,
          calibration_id: this.isSpectro(this.sMethod) && this.sCal ? this.sCal : null,
        });
    req.subscribe({
      next: res => {
        this.busy.set(false);
        this.action.set(null);
        this.toast.success(a === 'supersede' ? `Version ${res.version} created — it needs a certificate and review` : `Result ${res.status}`);
        this.result.set(res);
        this.changed.emit(res);
      },
      error: (e: ApiError) => {
        this.busy.set(false);
        this.err.set(e.code === 'SELF_APPROVAL_REJECTED'
          ? 'You entered or edited this result, so you can’t accept it. Another lab manager must review it.' : e.message);
      },
    });
  }

  uploadCert() {
    const f = this.certFile();
    const r = this.r();
    if (!f || !r) return;
    const form = new FormData();
    form.append('file', f);
    this.busy.set(true);
    this.api.upload<LabResult>(`/lab-results/${r.id}/certificate`, form).subscribe({
      next: res => {
        this.busy.set(false);
        this.toast.success('Certificate attached');
        this.result.set(res);
        this.changed.emit(res);
      },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e, "Couldn't attach the certificate"); },
    });
  }

  openCert() {
    const id = this.r()?.certificate_id;
    if (!id) return;
    const w = window.open('', '_blank');
    this.api.blob(`/evidence/${id}/content`).subscribe({
      next: b => {
        const u = URL.createObjectURL(b);
        if (w) w.location.href = u; else window.open(u, '_blank');
        setTimeout(() => URL.revokeObjectURL(u), 60_000);
      },
      error: (e: ApiError) => { w?.close(); this.toast.apiError(e, "Couldn't open the certificate"); },
    });
  }
}
