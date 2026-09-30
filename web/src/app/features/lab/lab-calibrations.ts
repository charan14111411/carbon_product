import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { HumanPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, Empty, Modal } from '../../ui/kit';
import { ConfirmDialog } from '../sampling/confirm';
import { LabContext } from './lab-context';
import { ANALYTES, Calibration, analyteLabel } from './types';

/** Calibrations that let infrared spectroscopy stand in for a reference lab method. */
@Component({
  selector: 'vc-lab-calibrations',
  imports: [FormsModule, Icon, Badge, Callout, DataClass, Empty, Modal, ConfirmDialog, NumPipe, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-callout tone="info" icon="info" style="margin-bottom:14px">
      Infrared (MIR) results are predictions from a calibration, so they carry the <vc-dc cls="MODELLED" /> badge, never MEASURED.
      Only approved calibrations can be used, and only for values inside their valid range.
    </vc-callout>
    @if (canCreate()) {
      <div class="bar"><div class="spacer"></div><button class="btn btn-primary" (click)="openNew()"><vc-icon name="plus" />New calibration</button></div>
    }
    <section class="card">
      @if (!ctx.calibrations().length) {
        <vc-empty icon="microscope" title="No calibrations" text="A calibration links infrared spectra to a reference method, fitted on at least 10 samples." />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Code</th><th>Analyte</th><th>Reference method</th><th class="num">Samples</th><th class="num">RMSE</th><th class="num">R²</th><th class="num">Bias</th><th>Valid range</th><th>Status</th><th>Created / approved</th><th></th></tr></thead>
            <tbody>
              @for (c of ctx.calibrations(); track c.id) {
                <tr>
                  <td><code>{{ c.code }}</code></td>
                  <td>{{ label(c.analyte) }}</td>
                  <td>{{ c.reference_method | human }}</td>
                  <td class="num">{{ c.n_samples }}</td>
                  <td class="num">{{ c.rmse | num: 3 }}</td>
                  <td class="num">{{ c.r2 | num: 3 }}</td>
                  <td class="num">{{ c.bias | num: 3 }}</td>
                  <td class="num nowrap">{{ c.valid_range.min }}–{{ c.valid_range.max }}</td>
                  <td><vc-badge [status]="c.status" /></td>
                  <td class="small">{{ c.created_by || '—' }}@if (c.approved_by) { <span class="subtle"> · approved by {{ c.approved_by }}</span> }</td>
                  <td class="num nowrap">
                    @if (c.status === 'draft' && auth.can('lab.review')) {
                      <button class="btn btn-secondary btn-sm" (click)="target.set(c); approveOpen.set(true)"><vc-icon name="check" [size]="14" />Approve</button>
                    }
                    @if (c.status !== 'retired' && auth.can('lab.review')) {
                      <button class="btn btn-ghost btn-sm" (click)="target.set(c); retireOpen.set(true)">Retire</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <vc-modal [(open)]="open" title="New spectral calibration" width="600px" subtitle="Saved as a draft. Someone else approves it.">
      <div class="form-grid">
        <div class="field"><label for="k-code">Code</label><input id="k-code" class="input mono" [(ngModel)]="f.code" placeholder="MIR-SOC-2026" /></div>
        <div class="field"><label for="k-an">Analyte</label>
          <select id="k-an" class="input" [(ngModel)]="f.analyte">@for (a of analytes; track a.key) { <option [value]="a.key">{{ a.label }}</option> }</select></div>
        <div class="field"><label for="k-ref">Reference method</label><input id="k-ref" class="input" [(ngModel)]="f.reference_method" placeholder="dry_combustion" /></div>
        <div class="field"><label for="k-n">Calibration samples</label><input id="k-n" type="number" min="10" class="input num" [(ngModel)]="f.n_samples" />
          <span class="hint">At least 10.</span></div>
        <div class="field"><label for="k-rmse">RMSE</label><input id="k-rmse" type="number" step="any" min="0" class="input num" [(ngModel)]="f.rmse" /></div>
        <div class="field"><label for="k-r2">R²</label><input id="k-r2" type="number" step="any" min="0" max="1" class="input num" [(ngModel)]="f.r2" /></div>
        <div class="field"><label for="k-bias">Bias</label><input id="k-bias" type="number" step="any" class="input num" [(ngModel)]="f.bias" /></div>
        <div class="field"><label>Valid range</label>
          <div class="row" style="--gap:6px"><input type="number" step="any" class="input num" [(ngModel)]="f.min" aria-label="Minimum" /><span class="subtle">to</span><input type="number" step="any" class="input num" [(ngModel)]="f.max" aria-label="Maximum" /></div></div>
        <div class="field span-2"><label for="k-notes">Notes</label><textarea id="k-notes" class="input" rows="2" [(ngModel)]="f.notes"></textarea></div>
      </div>
      @if (err()) { <vc-callout tone="danger" icon="alert" style="margin-top:14px">{{ err() }}</vc-callout> }
      <ng-container footer>
        <button class="btn btn-secondary" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !valid()" (click)="save()"><vc-icon name="check" />Save draft</button>
      </ng-container>
    </vc-modal>

    <vc-s-confirm [(open)]="approveOpen" [title]="'Approve ' + (target()?.code ?? '') + '?'" confirmLabel="Approve" icon="check" [busy]="busy()" (confirmed)="act('approve')">
      <vc-callout [tone]="mine() ? 'warn' : 'info'" icon="users">
        @if (mine()) { You created this calibration, so you can't approve it. A second reviewer must check the fit statistics — the four-eyes rule. }
        @else { Created by {{ target()?.created_by || 'someone else' }}. Four-eyes rule: the author can't approve their own calibration. Once approved, it can't be edited, only retired. }
      </vc-callout>
    </vc-s-confirm>
    <vc-s-confirm [(open)]="retireOpen" [title]="'Retire ' + (target()?.code ?? '') + '?'" tone="danger" confirmLabel="Retire"
      message="New infrared results can no longer use this calibration. Results already recorded keep their link to it." [busy]="busy()" (confirmed)="act('retire')" />
  `,
  styles: [`.bar{display:flex;align-items:center;gap:12px;margin-bottom:14px}`],
})
export class LabCalibrations {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  auth = inject(AuthService);
  ctx = inject(LabContext);
  analytes = ANALYTES;
  open = signal(false);
  approveOpen = signal(false);
  retireOpen = signal(false);
  target = signal<Calibration | null>(null);
  busy = signal(false);
  err = signal<string | null>(null);
  f = this.blank();
  canCreate = computed(() => this.auth.can('lab.review', 'models.manage'));
  mine = computed(() => !!this.target()?.created_by && this.target()!.created_by === this.auth.profile()?.full_name);

  private blank() {
    return { code: '', analyte: 'soc_pct', reference_method: 'dry_combustion', n_samples: 60, rmse: 0.18, r2: 0.86, bias: 0, min: 0.2, max: 4.5, notes: '' };
  }

  label(a: string) { return analyteLabel(a); }

  valid() {
    const f = this.f;
    return f.code.trim().length >= 2 && f.reference_method.trim().length >= 2 && f.n_samples >= 10 && f.r2 >= 0 && f.r2 <= 1 && f.min < f.max;
  }

  openNew() {
    this.f = this.blank();
    this.err.set(null);
    this.open.set(true);
  }

  save() {
    const f = this.f;
    this.busy.set(true);
    this.err.set(null);
    this.api.post<Calibration>('/spectral-calibrations', {
      code: f.code.trim(), analyte: f.analyte, reference_method: f.reference_method.trim(), n_samples: Number(f.n_samples),
      rmse: Number(f.rmse), r2: Number(f.r2), bias: Number(f.bias), valid_range: { min: Number(f.min), max: Number(f.max) }, notes: f.notes,
    }).subscribe({
      next: c => { this.busy.set(false); this.open.set(false); this.toast.success(`Calibration ${c.code} saved as draft`); this.ctx.loadCalibrations(); },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e.message); },
    });
  }

  act(kind: 'approve' | 'retire') {
    const c = this.target();
    if (!c) return;
    this.busy.set(true);
    this.api.post<Calibration>(`/spectral-calibrations/${c.id}/${kind}`).subscribe({
      next: r => {
        this.busy.set(false);
        this.approveOpen.set(false);
        this.retireOpen.set(false);
        this.toast.success(`Calibration ${r.code} ${r.status}`);
        this.ctx.loadCalibrations();
      },
      error: (e: ApiError) => {
        this.busy.set(false);
        this.toast.error(e.code === 'SELF_APPROVAL_REJECTED' ? 'You can’t approve your own calibration' : "That didn't work", e.message);
      },
    });
  }
}
