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
import { ANALYTES, Calibration, MIN_PEER_REVIEWED_REFS, analyteLabel } from './types';
import { VmRef } from './vm-ref';

const REF_APPX4 = 'VM0042 v2.2 Appendix 4 p.152-157';
const SPLITS = ['Random 70/30 split', 'Random 80/20 split', '10-fold cross-validation', '5-fold cross-validation', 'Kennard-Stone 75/25 split'];
const GAP_LABEL: Record<string, string> = {
  rpiq: 'RPIQ', lin_ccc: "Lin's CCC", split_method: 'Validation split', n_peer_reviewed_refs: 'Peer-reviewed references',
  spectral_range: 'Spectral range', instrument: 'Instrument',
};

type Tone = 'good' | 'fair' | 'poor' | 'none';
interface Metric { tone: Tone; hint: string }

/** Guidance bands commonly used for soil spectroscopy models. VM0042 lists the metrics but sets no thresholds. */
export function rpiqBand(v: number | null | undefined): Metric {
  if (v === null || v === undefined) return { tone: 'none', hint: 'Not reported' };
  if (v >= 2) return { tone: 'good', hint: 'RPIQ ≥ 2 — good predictive ability' };
  if (v >= 1.4) return { tone: 'fair', hint: 'RPIQ 1.4–2 — fair; check the error budget' };
  return { tone: 'poor', hint: 'RPIQ < 1.4 — weak; predictions barely beat the spread of the data' };
}
export function cccBand(v: number | null | undefined): Metric {
  if (v === null || v === undefined) return { tone: 'none', hint: 'Not reported' };
  if (v >= 0.9) return { tone: 'good', hint: 'CCC ≥ 0.90 — strong agreement with dry combustion' };
  if (v >= 0.8) return { tone: 'fair', hint: 'CCC 0.80–0.90 — moderate agreement' };
  return { tone: 'poor', hint: 'CCC < 0.80 — poor agreement with the reference method' };
}
export function r2Band(v: number | null | undefined): Metric {
  if (v === null || v === undefined) return { tone: 'none', hint: 'Not reported' };
  if (v >= 0.8) return { tone: 'good', hint: 'R² ≥ 0.80' };
  if (v >= 0.6) return { tone: 'fair', hint: 'R² 0.60–0.80 — moderate' };
  return { tone: 'poor', hint: 'R² < 0.60 — weak fit' };
}

interface CalForm {
  code: string; analyte: string; reference_method: string; n_samples: number; rmse: number; r2: number; bias: number;
  min: number; max: number; notes: string; rpiq: number | null; lin_ccc: number | null; split_method: string;
  n_peer_reviewed_refs: number | null; spectral_range: string; instrument: string;
}

/** Calibrations that let proximal sensing (spectroscopy) stand in for a reference lab method. */
@Component({
  selector: 'vc-lab-calibrations',
  imports: [FormsModule, Icon, Badge, Callout, DataClass, Empty, Modal, ConfirmDialog, NumPipe, HumanPipe, VmRef],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-callout tone="info" icon="info" style="margin-bottom:14px">
      Spectroscopy (MIR, NIR, Vis-NIR, LIBS, INS) results are predictions from a calibration, so they carry the <vc-dc cls="MODELLED" /> badge, never MEASURED.
      A calibration is approved only when its Appendix 4 details are complete — RMSE, R², RPIQ, bias, Lin's CCC, a randomised validation split,
      the instrument and spectral range, and at least {{ minRefs }} peer-reviewed articles proving the technology. <vc-vm-ref [ref]="refAppx4" />
    </vc-callout>
    @if (canCreate()) {
      <div class="bar"><div class="spacer"></div><button class="btn btn-primary" (click)="openNew()"><vc-icon name="plus" />New calibration</button></div>
    }
    <section class="card">
      @if (!ctx.calibrations().length) {
        <vc-empty icon="microscope" title="No calibrations" text="A calibration links spectra to dry combustion, fitted on at least 10 samples and validated on a held-out set." />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Code</th><th>Analyte</th><th>Instrument</th><th class="num">Samples</th><th class="num">RMSE</th><th class="num">R²</th><th class="num">RPIQ</th><th class="num">Lin's CCC</th><th class="num">Bias</th><th>Split</th><th class="num">Refs</th><th>Valid range</th><th>Status</th><th></th></tr></thead>
            <tbody>
              @for (c of ctx.calibrations(); track c.id) {
                <tr class="clickable" (click)="detail.set(c)">
                  <td><code>{{ c.code }}</code></td>
                  <td>{{ label(c.analyte) }}<div class="subtle small">vs {{ c.reference_method | human }}</div></td>
                  <td class="small">{{ c.instrument || '—' }}@if (c.spectral_range) { <div class="subtle">{{ c.spectral_range }}</div> }</td>
                  <td class="num">{{ c.n_samples }}</td>
                  <td class="num">{{ c.rmse | num: 3 }}</td>
                  <td class="num"><span [class]="'m m-' + r2(c.r2).tone" [title]="r2(c.r2).hint">{{ c.r2 | num: 2 }}</span></td>
                  <td class="num"><span [class]="'m m-' + rpiq(c.rpiq).tone" [title]="rpiq(c.rpiq).hint">{{ c.rpiq === null ? '—' : (c.rpiq | num: 2) }}</span></td>
                  <td class="num"><span [class]="'m m-' + ccc(c.lin_ccc).tone" [title]="ccc(c.lin_ccc).hint">{{ c.lin_ccc === null ? '—' : (c.lin_ccc | num: 2) }}</span></td>
                  <td class="num">{{ c.bias | num: 3 }}</td>
                  <td class="small nowrap">{{ c.split_method || '—' }}</td>
                  <td class="num"><span [class.m-poor]="c.n_peer_reviewed_refs !== null && c.n_peer_reviewed_refs < minRefs" class="m">{{ c.n_peer_reviewed_refs ?? '—' }}</span></td>
                  <td class="num nowrap">{{ c.valid_range.min }}–{{ c.valid_range.max }} {{ unitOf(c.analyte) }}</td>
                  <td>
                    <vc-badge [status]="c.status" />
                    @if (c.status === 'draft' && c.approval_gaps.length) { <div class="gapt small" [title]="gapText(c)">{{ c.approval_gaps.length }} detail{{ c.approval_gaps.length === 1 ? '' : 's' }} missing</div> }
                  </td>
                  <td class="num nowrap" (click)="$event.stopPropagation()">
                    @if (c.status === 'draft' && canCreate()) {
                      <button class="btn btn-ghost btn-sm" (click)="openEdit(c)"><vc-icon name="pencil" [size]="14" />Edit</button>
                    }
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
        <div class="card-foot"><span class="subtle small">Colour bands are common guidance for soil spectroscopy (RPIQ ≥ 2, Lin's CCC ≥ 0.90, R² ≥ 0.80); VM0042 asks for the metrics but sets no thresholds. Hover a value for its reading.</span></div>
      }
    </section>

    <!-- detail -->
    <vc-modal [open]="!!detail()" (closed)="detail.set(null)" [drawer]="true" width="540px" [title]="detail()?.code ?? ''"
      [subtitle]="detail() ? label(detail()!.analyte) + ' · calibrated against ' + (detail()!.reference_method | human) : ''">
      @if (detail(); as c) {
        <div class="stack" style="--gap:18px">
          <div class="row wrap" style="--gap:8px"><vc-badge [status]="c.status" /><vc-dc cls="MODELLED" /><vc-vm-ref [ref]="refAppx4" /></div>
          @if (c.status === 'draft' && c.approval_gaps.length) {
            <vc-callout tone="warn" icon="circle-alert">
              <strong>Can't be approved yet.</strong> Missing: {{ gapText(c) }}.
            </vc-callout>
          }
          <div class="metrics">
            @for (m of metricsOf(c); track m.k) {
              <div class="mt" [class]="'mt m-' + m.tone">
                <span class="mk">{{ m.k }}</span><strong class="num">{{ m.v }}</strong><span class="mh">{{ m.hint }}</span>
              </div>
            }
          </div>
          <dl class="kv">
            <dt>Instrument</dt><dd>{{ c.instrument || '—' }}</dd>
            <dt>Spectral range</dt><dd>{{ c.spectral_range || '—' }}</dd>
            <dt>Validation split</dt><dd>{{ c.split_method || '—' }}</dd>
            <dt>Calibration samples</dt><dd class="num">{{ c.n_samples }}</dd>
            <dt>Peer-reviewed articles</dt><dd>{{ c.n_peer_reviewed_refs ?? '—' }} <span class="subtle small">(at least {{ minRefs }} required)</span></dd>
            <dt>Valid range</dt><dd class="num">{{ c.valid_range.min }}–{{ c.valid_range.max }} {{ unitOf(c.analyte) }}</dd>
            <dt>Created by</dt><dd>{{ c.created_by || '—' }}</dd>
            <dt>Approved by</dt><dd>{{ c.approved_by || '—' }}</dd>
            @if (c.notes) { <dt>Notes</dt><dd>{{ c.notes }}</dd> }
          </dl>
        </div>
      }
    </vc-modal>

    <vc-modal [(open)]="open" [title]="editing() ? 'Complete ' + editing()!.code : 'New spectral calibration'" width="680px"
      subtitle="Saved as a draft. Someone other than the author approves it.">
      <div class="stack" style="--gap:18px">
        <div class="form-grid">
          <div class="field"><label for="k-code">Code</label><input id="k-code" class="input mono" [(ngModel)]="f.code" placeholder="MIR-SOC-2026" [disabled]="!!editing()" /></div>
          <div class="field"><label for="k-an">Analyte</label>
            <select id="k-an" class="input" [(ngModel)]="f.analyte" [disabled]="!!editing()">@for (a of analytes; track a.key) { <option [value]="a.key">{{ a.label }}</option> }</select></div>
          <div class="field"><label for="k-ref">Reference method</label><input id="k-ref" class="input" [(ngModel)]="f.reference_method" placeholder="dry_combustion" />
            <span class="hint">For SOC, calibrate against dry combustion.</span></div>
          <div class="field"><label for="k-n">Calibration samples</label><input id="k-n" type="number" min="10" class="input num" [(ngModel)]="f.n_samples" />
            <span class="hint" [class.error]="f.n_samples < 10">At least 10.</span></div>
          <div class="field"><label>Valid range ({{ unitOf(f.analyte) }})</label>
            <div class="row" style="--gap:6px"><input type="number" step="any" class="input num" [(ngModel)]="f.min" aria-label="Minimum" /><span class="subtle">to</span><input type="number" step="any" class="input num" [(ngModel)]="f.max" aria-label="Maximum" /></div>
            @if (f.min >= f.max) { <span class="error">The minimum must be below the maximum.</span> }</div>
        </div>

        <fieldset class="grp">
          <legend>Validation metrics <vc-vm-ref [ref]="refAppx4" /></legend>
          <div class="form-grid g3">
            <div class="field"><label for="k-rmse">RMSE ({{ unitOf(f.analyte) }})</label><input id="k-rmse" type="number" step="any" min="0" class="input num" [(ngModel)]="f.rmse" /></div>
            <div class="field"><label for="k-r2">R²</label><input id="k-r2" type="number" step="any" min="0" max="1" class="input num" [(ngModel)]="f.r2" />
              <span [class]="'hint b-' + r2(num(f.r2)).tone">{{ r2(num(f.r2)).hint }}</span></div>
            <div class="field"><label for="k-bias">Bias ({{ unitOf(f.analyte) }})</label><input id="k-bias" type="number" step="any" class="input num" [(ngModel)]="f.bias" /></div>
            <div class="field"><label for="k-rpiq">RPIQ</label><input id="k-rpiq" type="number" step="any" min="0" class="input num" [(ngModel)]="f.rpiq" />
              <span [class]="'hint b-' + rpiq(num(f.rpiq)).tone">{{ f.rpiq !== null && num(f.rpiq)! <= 0 ? 'Must be above 0.' : rpiq(num(f.rpiq)).hint }}</span></div>
            <div class="field"><label for="k-ccc">Lin's CCC</label><input id="k-ccc" type="number" step="any" min="-1" max="1" class="input num" [(ngModel)]="f.lin_ccc" />
              <span [class]="'hint b-' + ccc(num(f.lin_ccc)).tone">{{ cccOut() ? 'Between −1 and 1.' : ccc(num(f.lin_ccc)).hint }}</span></div>
            <div class="field"><label for="k-split">Validation split</label>
              <input id="k-split" class="input" [(ngModel)]="f.split_method" list="k-splits" placeholder="Random 70/30 split" />
              <datalist id="k-splits">@for (s of splits; track s) { <option [value]="s"></option> }</datalist>
              <span class="hint">Randomised, e.g. 70/30 or k-fold.</span></div>
          </div>
        </fieldset>

        <fieldset class="grp">
          <legend>Technology and instrument</legend>
          <div class="form-grid">
            <div class="field"><label for="k-inst">Instrument</label><input id="k-inst" class="input" [(ngModel)]="f.instrument" placeholder="Bruker Alpha II FT-IR, DRIFT module" /></div>
            <div class="field"><label for="k-range">Spectral range</label><input id="k-range" class="input" [(ngModel)]="f.spectral_range" placeholder="4000–600 cm⁻¹" /></div>
            <div class="field"><label for="k-refs">Peer-reviewed articles</label><input id="k-refs" type="number" min="0" step="1" class="input num" [(ngModel)]="f.n_peer_reviewed_refs" />
              <span class="hint" [class.error]="f.n_peer_reviewed_refs !== null && num(f.n_peer_reviewed_refs)! < minRefs">At least {{ minRefs }} articles proving the technology are required for approval.</span></div>
            <div class="field span-2"><label for="k-notes">Notes</label><textarea id="k-notes" class="input" rows="2" [(ngModel)]="f.notes" placeholder="Preprocessing (e.g. SNV + first derivative), model type (PLSR, 12 components), spectral library used."></textarea></div>
          </div>
        </fieldset>
      </div>
      @if (err()) { <vc-callout tone="danger" icon="alert" style="margin-top:14px">{{ err() }}</vc-callout> }
      <ng-container footer>
        <button class="btn btn-secondary" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !valid()" (click)="save()"><vc-icon name="check" />{{ busy() ? 'Saving…' : 'Save draft' }}</button>
      </ng-container>
    </vc-modal>

    <vc-s-confirm [(open)]="approveOpen" [title]="'Approve ' + (target()?.code ?? '') + '?'" confirmLabel="Approve" icon="check" [busy]="busy()" (confirmed)="act('approve')">
      @if (target()?.approval_gaps?.length) {
        <vc-callout tone="warn" icon="circle-alert">Approval will be refused until these are complete: {{ gapText(target()!) }}.</vc-callout>
      }
      <vc-callout [tone]="mine() ? 'warn' : 'info'" icon="users">
        @if (mine()) { You created this calibration, so you can't approve it. A second reviewer must check the fit statistics — the four-eyes rule. }
        @else { Created by {{ target()?.created_by || 'someone else' }}. Four-eyes rule: the author can't approve their own calibration. Once approved, it can't be edited, only retired. }
      </vc-callout>
    </vc-s-confirm>
    <vc-s-confirm [(open)]="retireOpen" [title]="'Retire ' + (target()?.code ?? '') + '?'" tone="danger" confirmLabel="Retire"
      message="New spectroscopy results can no longer use this calibration. Results already recorded keep their link to it." [busy]="busy()" (confirmed)="act('retire')" />
  `,
  styles: [`
    .bar{display:flex;align-items:center;gap:12px;margin-bottom:14px}
    .m{font-weight:500}
    .m-good{color:var(--forest-700)} .m-fair{color:var(--amber-600)} .m-poor{color:var(--red-600)} .m-none{color:var(--text-3)}
    .gapt{color:var(--amber-600);margin-top:3px;white-space:nowrap;cursor:help}
    .grp{border:1px solid var(--border);border-radius:var(--radius);padding:12px 16px 16px;margin:0}
    .grp legend{padding:0 6px;font-weight:600;font-size:13.5px;display:inline-flex;gap:8px;align-items:center}
    .g3{grid-template-columns:repeat(3,minmax(0,1fr))}
    @media (max-width:800px){.g3{grid-template-columns:1fr 1fr}}
    .hint.b-good{color:var(--forest-700)} .hint.b-fair{color:var(--amber-600)} .hint.b-poor{color:var(--red-600)}
    .metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
    .mt{display:flex;flex-direction:column;gap:2px;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface-2)}
    .mt strong{font-size:18px;color:var(--stone-900)}
    .mk{font-size:11.5px;font-weight:600;color:var(--text-3);text-transform:uppercase;letter-spacing:.04em}
    .mh{font-size:11.5px;line-height:1.35}
    .mt.m-good .mh{color:var(--forest-700)} .mt.m-fair .mh{color:var(--amber-600)} .mt.m-poor .mh{color:var(--red-600)} .mt.m-none .mh{color:var(--text-3)}
  `],
})
export class LabCalibrations {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  auth = inject(AuthService);
  ctx = inject(LabContext);
  analytes = ANALYTES;
  splits = SPLITS;
  minRefs = MIN_PEER_REVIEWED_REFS;
  refAppx4 = REF_APPX4;
  rpiq = rpiqBand;
  ccc = cccBand;
  r2 = r2Band;
  open = signal(false);
  approveOpen = signal(false);
  retireOpen = signal(false);
  target = signal<Calibration | null>(null);
  detail = signal<Calibration | null>(null);
  editing = signal<Calibration | null>(null);
  busy = signal(false);
  err = signal<string | null>(null);
  f: CalForm = this.blank();
  canCreate = computed(() => this.auth.can('lab.review', 'models.manage'));
  mine = computed(() => !!this.target()?.created_by && this.target()!.created_by === this.auth.profile()?.full_name);

  private blank(c?: Calibration): CalForm {
    return {
      code: c?.code ?? '', analyte: c?.analyte ?? 'soc_pct', reference_method: c?.reference_method ?? 'dry_combustion',
      n_samples: c?.n_samples ?? 60, rmse: c?.rmse ?? 0.18, r2: c?.r2 ?? 0.86, bias: c?.bias ?? 0,
      min: c?.valid_range.min ?? 0.2, max: c?.valid_range.max ?? 4.5, notes: c?.notes ?? '',
      rpiq: c?.rpiq ?? null, lin_ccc: c?.lin_ccc ?? null, split_method: c?.split_method ?? '',
      n_peer_reviewed_refs: c?.n_peer_reviewed_refs ?? null, spectral_range: c?.spectral_range ?? '', instrument: c?.instrument ?? '',
    };
  }

  label(a: string) { return analyteLabel(a); }
  unitOf(a: string) { return ANALYTES.find(x => x.key === a)?.unit ?? ''; }
  num(v: unknown): number | null { return v === null || v === undefined || `${v}` === '' ? null : Number(v); }
  gapText(c: Calibration) {
    return c.approval_gaps.map(g => GAP_LABEL[g] ?? (g.startsWith('n_peer_reviewed_refs') ? `at least ${MIN_PEER_REVIEWED_REFS} peer-reviewed articles` : g)).join(', ');
  }
  cccOut() { const v = this.num(this.f.lin_ccc); return v !== null && (v < -1 || v > 1); }

  metricsOf(c: Calibration) {
    const u = this.unitOf(c.analyte);
    return [
      { k: 'RMSE', v: `${c.rmse.toFixed(3)} ${u}`, tone: 'none' as Tone, hint: 'Typical prediction error' },
      { k: 'R²', v: c.r2.toFixed(2), ...r2Band(c.r2) },
      { k: 'Bias', v: `${c.bias.toFixed(3)} ${u}`, tone: 'none' as Tone, hint: 'Mean over- or under-prediction' },
      { k: 'RPIQ', v: c.rpiq === null ? '—' : c.rpiq.toFixed(2), ...rpiqBand(c.rpiq) },
      { k: "Lin's CCC", v: c.lin_ccc === null ? '—' : c.lin_ccc.toFixed(2), ...cccBand(c.lin_ccc) },
      { k: 'Samples', v: String(c.n_samples), tone: 'none' as Tone, hint: 'Used to fit the model' },
    ];
  }

  valid() {
    const f = this.f;
    const rpiq = this.num(f.rpiq), refs = this.num(f.n_peer_reviewed_refs);
    const optText = (s: string, n: number) => !s.trim() || s.trim().length >= n;
    return f.code.trim().length >= 2 && f.reference_method.trim().length >= 2 && f.n_samples >= 10 && f.r2 >= 0 && f.r2 <= 1 &&
      Number(f.min) < Number(f.max) && (rpiq === null || rpiq > 0) && !this.cccOut() && (refs === null || refs >= 0) &&
      optText(f.split_method, 3) && optText(f.spectral_range, 2) && optText(f.instrument, 2);
  }

  openNew() { this.editing.set(null); this.f = this.blank(); this.err.set(null); this.open.set(true); }
  openEdit(c: Calibration) { this.editing.set(c); this.f = this.blank(c); this.err.set(null); this.open.set(true); }

  save() {
    const f = this.f;
    const ed = this.editing();
    this.busy.set(true);
    this.err.set(null);
    const body = {
      reference_method: f.reference_method.trim(), n_samples: Number(f.n_samples), rmse: Number(f.rmse), r2: Number(f.r2),
      bias: Number(f.bias), valid_range: { min: Number(f.min), max: Number(f.max) }, notes: f.notes,
      rpiq: this.num(f.rpiq), lin_ccc: this.num(f.lin_ccc), split_method: f.split_method.trim() || null,
      n_peer_reviewed_refs: this.num(f.n_peer_reviewed_refs) === null ? null : Math.round(this.num(f.n_peer_reviewed_refs)!),
      spectral_range: f.spectral_range.trim() || null, instrument: f.instrument.trim() || null,
    };
    const req = ed ? this.api.put<Calibration>(`/spectral-calibrations/${ed.id}`, body)
      : this.api.post<Calibration>('/spectral-calibrations', { code: f.code.trim(), analyte: f.analyte, ...body });
    req.subscribe({
      next: c => {
        this.busy.set(false);
        this.open.set(false);
        this.toast.success(`Calibration ${c.code} saved as draft`, c.approval_gaps.length ? `Before approval, add: ${this.gapText(c)}.` : 'Ready for a second reviewer to approve.');
        this.ctx.loadCalibrations();
      },
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
        this.toast.error(e.code === 'SELF_APPROVAL_REJECTED' ? 'You can’t approve your own calibration' : e.code === 'CALIBRATION_INCOMPLETE' ? 'Appendix 4 details missing' : "That didn't work",
          e.code === 'SELF_APPROVAL_REJECTED' ? 'You created or edited this calibration, so another person must approve it.' : e.message);
      },
    });
  }
}
