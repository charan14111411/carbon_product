import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of, switchMap } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, Empty, ErrorBox, FileDrop, Loading, Modal } from '../../ui/kit';
import { LabContext } from './lab-context';
import { Lab, PROFICIENCY, Proficiency, QC_GAP_LABEL } from './types';
import { VmRef } from './vm-ref';

const REF_LAB = 'VM0042 v2.2 §8.2.1.4 p.35-36';

interface LabForm {
  code: string; name: string; city: string; contact_email: string; accreditation: string; accreditation_valid_until: string;
  iso17025: 'yes' | 'no' | ''; proficiency_program: Proficiency | ''; analytical_error_report_id: string | null;
}

@Component({
  selector: 'vc-lab-labs',
  imports: [FormsModule, Icon, Badge, Callout, Empty, ErrorBox, FileDrop, Loading, Modal, DayPipe, VmRef],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <p class="muted small">Laboratories that analyse this organisation's soil, with the quality evidence VM0042 asks each lab to show. <vc-vm-ref [ref]="refLab" /></p>
      <div class="spacer"></div>
      @if (canManage()) { <button class="btn btn-primary" (click)="openNew()"><vc-icon name="plus" />Add lab</button> }
    </div>
    <section class="card">
      @if (!ctx.labsLoaded()) {
        <vc-loading [rows]="4" />
      } @else if (ctx.labsError()) {
        <div class="card-body"><vc-error title="Couldn't load labs" [message]="ctx.labsError()!"><button class="btn btn-secondary btn-sm" (click)="ctx.loadLabs()">Try again</button></vc-error></div>
      } @else if (!ctx.labs().length) {
        <vc-empty icon="flask" title="No labs yet" text="Add the laboratory that will receive your soil bags. VM0042 expects the same lab for the whole project.">
          @if (canManage()) { <button class="btn btn-primary" (click)="openNew()"><vc-icon name="plus" />Add lab</button> }
        </vc-empty>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Lab</th><th>City</th><th>ISO/IEC 17025</th><th>Certificate</th><th>Valid until</th><th>Proficiency</th><th>Error report</th><th>Quality evidence</th><th></th></tr></thead>
            <tbody>
              @for (l of ctx.labs(); track l.id) {
                <tr>
                  <td><strong>{{ l.name }}</strong><div class="subtle small"><code>{{ l.code }}</code>@if (l.contact_email) { · {{ l.contact_email }} }</div></td>
                  <td>{{ l.city || '—' }}</td>
                  <td>
                    @if (l.iso17025 === true) { <span class="yes"><vc-icon name="award" [size]="14" />Accredited</span> }
                    @else if (l.iso17025 === false) { <span class="no">Not accredited</span> }
                    @else { <span class="subtle">Not stated</span> }
                  </td>
                  <td class="small">{{ l.accreditation || '—' }}</td>
                  <td>
                    @if (l.accreditation_valid_until) {
                      <vc-badge [status]="l.accreditation_current ? 'active' : 'failed'">{{ l.accreditation_valid_until | day }}</vc-badge>
                      @if (!l.accreditation_current) { <div class="no small">Expired</div> }
                    } @else { <span class="subtle">—</span> }
                  </td>
                  <td>{{ profLabel(l.proficiency_program) }}</td>
                  <td>
                    @if (l.analytical_error_report_id) {
                      <button class="btn btn-ghost btn-sm" (click)="openEvidence(l.analytical_error_report_id)"><vc-icon name="file-check" [size]="14" />Open</button>
                    } @else { <span class="subtle">—</span> }
                  </td>
                  <td>
                    @if (!l.qc_evidence_missing.length) {
                      <span class="yes"><vc-icon name="circle-check" [size]="14" />Complete</span>
                    } @else {
                      <span class="gap" [title]="gapText(l)"><vc-icon name="circle-alert" [size]="14" />{{ l.qc_evidence_missing.length }} missing</span>
                    }
                  </td>
                  <td class="num">
                    @if (canManage()) { <button class="btn btn-secondary btn-sm" (click)="openEdit(l)"><vc-icon name="pencil" [size]="14" />Edit</button> }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <vc-modal [(open)]="open" [title]="editing() ? 'Edit ' + (editing()!.name) : 'Add a lab'" width="640px"
      subtitle="Quality evidence is optional to save, but open gaps are listed as quality findings until they are shown.">
      <div class="stack" style="--gap:18px">
        <div class="form-grid">
          <div class="field"><label for="l-code">Code</label>
            <input id="l-code" class="input mono" [(ngModel)]="f.code" placeholder="SOILTEST-BLR" [disabled]="!!editing()" />
            @if (!editing()) { <span class="hint">Letters, numbers, dot, dash or underscore. Can't be changed later.</span> }</div>
          <div class="field"><label for="l-name">Name</label><input id="l-name" class="input" [(ngModel)]="f.name" placeholder="Soil Test Laboratory, Bengaluru" /></div>
          <div class="field"><label for="l-city">City</label><input id="l-city" class="input" [(ngModel)]="f.city" /></div>
          <div class="field"><label for="l-mail">Contact email</label><input id="l-mail" type="email" class="input" [(ngModel)]="f.contact_email" /></div>
        </div>

        <fieldset class="grp">
          <legend>Accreditation <vc-vm-ref [ref]="refLab" /></legend>
          <p class="muted small">VM0042 asks for an ISO/IEC 17025 accredited lab where possible.</p>
          <div class="form-grid">
            <div class="field"><label for="l-iso">ISO/IEC 17025</label>
              <select id="l-iso" class="input" [(ngModel)]="f.iso17025">
                <option value="">Not stated</option><option value="yes">Accredited</option><option value="no">Not accredited</option>
              </select></div>
            <div class="field"><label for="l-acc">Certificate number</label><input id="l-acc" class="input mono" [(ngModel)]="f.accreditation" placeholder="NABL TC-1234" /></div>
            <div class="field"><label for="l-until">Valid until</label><input id="l-until" type="date" class="input" [(ngModel)]="f.accreditation_valid_until" />
              @if (f.accreditation_valid_until && f.accreditation_valid_until < today) { <span class="error">This date has passed — the accreditation has expired.</span> }</div>
          </div>
        </fieldset>

        <fieldset class="grp">
          <legend>Proficiency and error reporting</legend>
          <p class="muted small">The lab should take part in a round-robin proficiency programme and report its analytical error and internal quality control.</p>
          <div class="form-grid">
            <div class="field span-2"><label for="l-pt">Proficiency programme</label>
              <select id="l-pt" class="input" [(ngModel)]="f.proficiency_program">
                <option value="">Not stated</option>
                @for (p of profs; track p.key) { <option [value]="p.key">{{ p.label }}</option> }
              </select></div>
            <div class="field span-2"><label>Analytical error report</label>
              @if (f.analytical_error_report_id && !reportFile()) {
                <div class="have"><vc-icon name="file-check" [size]="18" /><span class="grow">Report on file</span>
                  <button class="btn btn-ghost btn-sm" type="button" (click)="openEvidence(f.analytical_error_report_id)">Open</button>
                  <button class="btn btn-ghost btn-sm" type="button" (click)="replace.set(true)">Replace</button></div>
              }
              @if (!f.analytical_error_report_id || replace() || reportFile()) {
                <vc-file-drop [(file)]="reportFile" label="Choose the lab's analytical error / QC report" hint="PDF or spreadsheet · up to 25 MB · stored with a SHA-256 fingerprint" />
              }
            </div>
          </div>
        </fieldset>
      </div>
      @if (err()) { <vc-callout tone="danger" icon="alert" style="margin-top:14px">{{ err() }}</vc-callout> }
      <ng-container footer>
        <button class="btn btn-secondary" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || f.code.length < 2 || f.name.trim().length < 2" (click)="save()">
          <vc-icon name="check" />{{ busy() ? 'Saving…' : editing() ? 'Save changes' : 'Add lab' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .bar{display:flex;align-items:center;gap:12px;margin-bottom:14px}
    .yes{display:inline-flex;align-items:center;gap:5px;color:var(--forest-700);font-weight:500;white-space:nowrap}
    .no{color:var(--red-600)}
    .gap{display:inline-flex;align-items:center;gap:5px;color:var(--amber-600);font-weight:500;white-space:nowrap;cursor:help}
    .grp{border:1px solid var(--border);border-radius:var(--radius);padding:12px 16px 16px;margin:0}
    .grp legend{padding:0 6px;font-weight:600;font-size:13.5px;display:inline-flex;gap:8px;align-items:center}
    .grp p{margin:0 0 12px}
    .have{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--forest-600)}
    .have span{color:var(--text)} .grow{flex:1}
  `],
})
export class LabLabs {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  ctx = inject(LabContext);
  refLab = REF_LAB;
  profs = PROFICIENCY;
  today = new Date().toISOString().slice(0, 10);
  open = signal(false);
  busy = signal(false);
  err = signal<string | null>(null);
  editing = signal<Lab | null>(null);
  reportFile = signal<File | null>(null);
  replace = signal(false);
  f: LabForm = this.blank();
  canManage = computed(() => this.auth.can('sampling.plan', 'programmes.manage'));

  private blank(l?: Lab): LabForm {
    return {
      code: l?.code ?? '', name: l?.name ?? '', city: l?.city ?? '', contact_email: l?.contact_email ?? '',
      accreditation: l?.accreditation ?? '', accreditation_valid_until: l?.accreditation_valid_until ?? '',
      iso17025: l?.iso17025 === true ? 'yes' : l?.iso17025 === false ? 'no' : '',
      proficiency_program: l?.proficiency_program ?? '', analytical_error_report_id: l?.analytical_error_report_id ?? null,
    };
  }

  profLabel(p: string | null) { return p ? (p === 'other' ? 'Other programme' : p === 'none' ? 'None' : p) : '—'; }
  gapText(l: Lab) { return 'Not yet shown: ' + l.qc_evidence_missing.map(g => QC_GAP_LABEL[g] ?? g).join(', '); }

  openNew() { this.start(null); }
  openEdit(l: Lab) { this.start(l); }

  private start(l: Lab | null) {
    this.editing.set(l);
    this.f = this.blank(l ?? undefined);
    this.reportFile.set(null);
    this.replace.set(false);
    this.err.set(null);
    this.open.set(true);
  }

  private uploadReport(): Observable<string | null> {
    const file = this.reportFile();
    if (!file) return of(this.f.analytical_error_report_id);
    const form = new FormData();
    form.append('file', file);
    form.append('kind', 'analytical_error_report');
    form.append('entity_type', 'lab');
    if (this.editing()) form.append('entity_id', this.editing()!.id);
    return this.api.upload<{ id: string }>('/evidence', form).pipe(switchMap(e => of(e.id)));
  }

  save() {
    this.busy.set(true);
    this.err.set(null);
    const f = this.f;
    const ed = this.editing();
    this.uploadReport().pipe(switchMap(reportId => {
      const body = {
        name: f.name.trim(), city: f.city.trim(), contact_email: f.contact_email.trim() || null,
        accreditation: f.accreditation.trim() || null, accreditation_valid_until: f.accreditation_valid_until || null,
        iso17025: f.iso17025 === '' ? null : f.iso17025 === 'yes', proficiency_program: f.proficiency_program || null,
        analytical_error_report_id: reportId,
      };
      return ed ? this.api.put<Lab>(`/labs/${ed.id}`, body) : this.api.post<Lab>('/labs', { code: f.code.trim(), ...body });
    })).subscribe({
      next: l => {
        this.busy.set(false);
        this.open.set(false);
        this.toast.success(ed ? `${l.name} updated` : `${l.name} added`,
          l.qc_evidence_missing.length ? `Still to show: ${l.qc_evidence_missing.map(g => QC_GAP_LABEL[g] ?? g).join(', ')}.` : 'All lab quality evidence is on file.');
        this.ctx.loadLabs();
      },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e.message); },
    });
  }

  openEvidence(id: string | null) {
    if (!id) return;
    const w = window.open('', '_blank');
    this.api.blob(`/evidence/${id}/content`).subscribe({
      next: b => {
        const u = URL.createObjectURL(b);
        if (w) w.location.href = u; else window.open(u, '_blank');
        setTimeout(() => URL.revokeObjectURL(u), 60_000);
      },
      error: (e: ApiError) => { w?.close(); this.toast.apiError(e, "Couldn't open the report"); },
    });
  }
}
