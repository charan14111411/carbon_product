import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { DayPipe, HumanPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Callout, DataClass } from '../../ui/kit';
import { BagMatch, LabContext } from './lab-context';
import { ANALYTES, DRY_COMBUSTION, LabResult, NOT_RECOMMENDED_METHODS, NOT_RECOMMENDED_NOTE, PURPOSES, Purpose, SPECTRO_METHODS } from './types';
import { VmRef } from './vm-ref';

/** Type in one result for one bag, with the same checks the server applies. */
@Component({
  selector: 'vc-lab-entry',
  imports: [FormsModule, Icon, Callout, DataClass, DayPipe, HumanPipe, VmRef],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <section class="card">
        <div class="card-head"><h3>1 · Find the bag</h3></div>
        <div class="card-body stack" style="--gap:12px">
          <form class="look" (submit)="$event.preventDefault(); lookup()">
            <div class="field grow">
              <label for="e-bag">Bag code or label</label>
              <input id="e-bag" class="input mono" [(ngModel)]="code" name="code" placeholder="ST-Z1-001-BL-D1" autocomplete="off" />
              <span class="hint">Scan or type the code printed on the bag. A sample code lists all its bags.</span>
            </div>
            <button class="btn btn-secondary" type="submit" [disabled]="!code.trim() || finding()"><vc-icon name="search" />{{ finding() ? 'Looking…' : 'Look up' }}</button>
          </form>
          @if (findError()) { <vc-callout tone="danger" icon="alert">{{ findError() }}</vc-callout> }
          @if (matches().length) {
            <div class="bags">
              @for (m of matches(); track m.layerId) {
                <button type="button" class="bag" [class.on]="bag()?.layerId === m.layerId" (click)="bag.set(m)">
                  <span class="d">{{ m.depth }}</span>
                  <span class="c"><code>{{ m.bagCode }}</code><em>label {{ m.labelQr }} · {{ m.campaignCode }} · collected {{ m.collectedAt | day }}</em></span>
                  @if (bag()?.layerId === m.layerId) { <vc-icon name="check-circle" [size]="18" /> }
                </button>
              }
            </div>
          }
        </div>
      </section>

      <section class="card" [class.dim]="!bag()">
        <div class="card-head"><h3>2 · Enter the result</h3>@if (bag()) { <code class="small">{{ bag()!.bagCode }}</code> }</div>
        <div class="card-body">
          <div class="form-grid">
            <div class="field">
              <label for="e-an">Analyte</label>
              <select id="e-an" class="input" [ngModel]="analyte()" (ngModelChange)="setAnalyte($event)" [disabled]="!bag()">
                @for (a of analytes; track a.key) { <option [value]="a.key">{{ a.label }}</option> }
              </select>
            </div>
            <div class="field">
              <label for="e-val">Value</label>
              <div class="unitbox">
                <input id="e-val" type="number" step="any" class="input num" [class.invalid]="!!valueError()" [ngModel]="value()" (ngModelChange)="value.set($event)" [disabled]="!bag()" />
                <input class="input unit" [ngModel]="unit()" (ngModelChange)="unit.set($event)" aria-label="Unit" [disabled]="!bag()" />
              </div>
              @if (valueError()) { <span class="error">{{ valueError() }}</span> } @else { <span class="hint">Allowed {{ def().min }}–{{ def().max }} {{ def().unit }}</span> }
              @if (unitError()) { <span class="error">{{ unitError() }}</span> }
            </div>
            <div class="field">
              <label for="e-m">Method</label>
              <select id="e-m" class="input" [ngModel]="method()" (ngModelChange)="setMethod($event)" [disabled]="!bag() || purpose() === 'spectroscopy_check'">
                @for (m of def().methods; track m) { <option [value]="m">{{ m | human }}{{ notRec.has(m) ? ' (not recommended)' : '' }}</option> }
              </select>
              @if (purpose() === 'spectroscopy_check') { <span class="hint">A spectroscopy check is always dry combustion.</span> }
            </div>
            <div class="field">
              <label for="e-d">Analysed on</label>
              <input id="e-d" type="date" class="input" [class.invalid]="!!dateError()" [max]="today" [ngModel]="date()" (ngModelChange)="date.set($event)" [disabled]="!bag()" />
              @if (dateError()) { <span class="error">{{ dateError() }}</span> }
            </div>
            <div class="field">
              <label for="e-u">Uncertainty <span class="subtle">(optional, ± {{ unit() }})</span></label>
              <input id="e-u" type="number" step="any" min="0" class="input num" [ngModel]="unc()" (ngModelChange)="unc.set($event)" [disabled]="!bag()" />
            </div>
            <div class="field">
              <label for="e-dl">Detection limit <span class="subtle">(optional, {{ unit() }})</span></label>
              <input id="e-dl" type="number" step="any" min="0" class="input num" [ngModel]="dl()" (ngModelChange)="dl.set($event)" [disabled]="!bag()" />
              @if (belowDl()) { <span class="warn-t"><vc-icon name="circle-alert" [size]="13" />Below the detection limit — it will be flagged for review.</span> }
              @else { <span class="hint">The lab's limit of detection for this method.</span> }
            </div>
            <div class="field">
              <label for="e-p">Purpose</label>
              <select id="e-p" class="input" [ngModel]="purpose()" (ngModelChange)="setPurpose($event)" [disabled]="!bag() || analyte() !== 'soc_pct'">
                @for (p of purposes; track p.key) { <option [value]="p.key">{{ p.label }}</option> }
              </select>
              <span class="hint">{{ purposeHint() }}</span>
            </div>
            @if (!ctx.scopedLabId()) {
              <div class="field">
                <label for="e-lab">Lab</label>
                <select id="e-lab" class="input" [ngModel]="labId()" (ngModelChange)="labId.set($event)" [disabled]="!bag()">
                  <option value="">The lab the bag was sent to</option>
                  @for (l of ctx.labs(); track l.id) { <option [value]="l.id">{{ l.name }}</option> }
                </select>
              </div>
            }
            @if (notRecommended()) {
              <div class="field span-2">
                <vc-callout tone="warn" icon="alert">
                  <strong>{{ method() | human }}</strong> is not recommended by VM0042 §8.2.1.4; only where no other method is available.
                  Dry combustion is the recommended method for SOC. <vc-vm-ref ref="VM0042 §8.2.1.4 p.35" />
                </vc-callout>
                <label for="e-just" style="margin-top:10px">Method justification <span class="req">*</span></label>
                <textarea id="e-just" class="input" rows="3" [class.invalid]="justError()" [ngModel]="just()" (ngModelChange)="just.set($event)"
                  placeholder="The lab's dry-combustion analyser is out of service until December; no other accredited lab in the district offers it."></textarea>
                <span class="hint" [class.error]="justError()">Why no other method is available. At least 20 characters · {{ just().trim().length }} so far.</span>
              </div>
            }
            @if (spectro()) {
              <div class="field span-2">
                <label for="e-cal">Spectral calibration</label>
                <select id="e-cal" class="input" [ngModel]="calId()" (ngModelChange)="calId.set($event)">
                  <option value="">Choose an approved calibration…</option>
                  @for (c of cals(); track c.id) { <option [value]="c.id">{{ c.code }} · valid {{ c.valid_range.min }}–{{ c.valid_range.max }}</option> }
                </select>
                <span class="hint">Spectroscopy results are model estimates, recorded as <vc-dc cls="MODELLED" /> and only valid inside the calibration's range.</span>
              </div>
            }
          </div>
          @if (err()) { <vc-callout tone="danger" icon="alert" style="margin-top:14px">{{ err() }}</vc-callout> }
        </div>
        <div class="card-foot">
          <span class="subtle small">Saved as pending. A lab manager accepts it once the certificate is attached.</span>
          <div class="spacer"></div>
          <button class="btn btn-primary" [disabled]="!valid() || busy()" (click)="save()"><vc-icon name="check" />{{ busy() ? 'Saving…' : 'Save result' }}</button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .wrap{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:16px;align-items:start}
    .look{display:flex;gap:10px;align-items:flex-start}
    .look .btn{margin-top:24px;height:38px}
    .grow{flex:1}
    .bags{display:flex;flex-direction:column;gap:6px}
    .bag{display:flex;align-items:center;gap:12px;padding:10px 12px;border:1.5px solid var(--border);border-radius:var(--radius-sm);background:var(--surface);text-align:left;font:inherit;cursor:pointer}
    .bag:hover{border-color:var(--forest-300)}
    .bag.on{border-color:var(--forest-500);background:var(--forest-50)}
    .bag .d{font-weight:600;min-width:72px}
    .bag .c{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
    .bag em{font-style:normal;font-size:12px;color:var(--text-3)}
    .bag vc-icon{color:var(--forest-600)}
    .dim{opacity:.6}
    .unitbox{display:flex;gap:6px}
    .unit{width:96px;flex:none}
    .warn-t{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--amber-600)}
    .req{color:var(--danger)}
    @media (max-width:1100px){.wrap{grid-template-columns:1fr}}
  `],
})
export class LabEntry {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  ctx = inject(LabContext);
  created = output<LabResult>();

  analytes = ANALYTES;
  purposes = PURPOSES;
  notRec = NOT_RECOMMENDED_METHODS;
  today = new Date().toISOString().slice(0, 10);
  code = '';
  finding = signal(false);
  findError = signal<string | null>(null);
  matches = signal<BagMatch[]>([]);
  bag = signal<BagMatch | null>(null);

  analyte = signal('soc_pct');
  value = signal<number | null>(null);
  unit = signal('%');
  method = signal('dry_combustion');
  date = signal(this.today);
  unc = signal<number | null>(null);
  dl = signal<number | null>(null);
  just = signal('');
  purpose = signal<Purpose>('primary');
  labId = signal('');
  calId = signal('');
  busy = signal(false);
  err = signal<string | null>(null);

  def = computed(() => ANALYTES.find(a => a.key === this.analyte())!);
  cals = computed(() => this.ctx.calibrations().filter(c => c.status === 'approved' && c.analyte === this.analyte()));
  valueError = computed(() => {
    const v = this.value();
    if (v === null || `${v}` === '') return null;
    const d = this.def();
    return v < d.min || v > d.max ? `${d.label} must be between ${d.min} and ${d.max} ${d.unit}.` : null;
  });
  unitError = computed(() => {
    const u = this.unit().trim().toLowerCase();
    const d = this.def();
    return d.units.map(x => x.toLowerCase()).includes(u) ? null : `${d.label} must be reported in ${d.unit}.`;
  });
  spectro = computed(() => SPECTRO_METHODS.has(this.method()));
  notRecommended = computed(() => NOT_RECOMMENDED_METHODS.has(this.method()));
  justError = computed(() => this.notRecommended() && this.just().length > 0 && this.just().trim().length < 20);
  belowDl = computed(() => {
    const v = this.value(), dl = this.dl();
    return v !== null && `${v}` !== '' && dl !== null && `${dl}` !== '' && Number(v) < Number(dl);
  });
  purposeHint = computed(() => this.analyte() !== 'soc_pct' ? 'Spectroscopy checks apply to SOC only.' : PURPOSES.find(p => p.key === this.purpose())!.hint);
  dateError = computed(() => {
    const d = this.date();
    if (!d) return 'Enter the analysis date.';
    if (d > this.today) return 'The analysis date is in the future.';
    const b = this.bag();
    if (b && d < b.collectedAt.slice(0, 10)) return `The bag was collected on ${b.collectedAt.slice(0, 10)}; analysis can't be earlier.`;
    return null;
  });
  valid = computed(() => !!this.bag() && this.value() !== null && `${this.value()}` !== '' && !this.valueError() && !this.unitError() &&
    !this.dateError() && (!this.spectro() || !!this.calId()) && (!this.notRecommended() || this.just().trim().length >= 20));

  setAnalyte(a: string) {
    this.analyte.set(a);
    const d = this.def();
    this.unit.set(d.unit);
    this.method.set(d.methods[0]);
    this.calId.set('');
    if (a !== 'soc_pct') this.purpose.set('primary');
  }

  setMethod(m: string) {
    this.method.set(m);
    if (!SPECTRO_METHODS.has(m)) this.calId.set('');
  }

  setPurpose(p: Purpose) {
    this.purpose.set(p);
    if (p === 'spectroscopy_check') this.setMethod(DRY_COMBUSTION);
  }

  lookup() {
    this.finding.set(true);
    this.findError.set(null);
    this.matches.set([]);
    this.bag.set(null);
    this.ctx.findBag(this.code).subscribe({
      next: m => {
        this.finding.set(false);
        this.matches.set(m);
        if (m.length === 1) this.bag.set(m[0]);
        if (!m.length) this.findError.set('No bag has this code.');
      },
      error: (e: ApiError) => { this.finding.set(false); this.findError.set(e.message); },
    });
  }

  save() {
    const b = this.bag();
    if (!b) return;
    this.busy.set(true);
    this.err.set(null);
    this.api.post<LabResult>('/lab-results', {
      layer_id: b.layerId, analyte: this.analyte(), value: Number(this.value()), unit: this.unit().trim() || '-',
      method: this.method(), analysed_on: this.date(),
      uncertainty: this.unc() === null || `${this.unc()}` === '' ? null : Number(this.unc()),
      detection_limit: this.dl() === null || `${this.dl()}` === '' ? null : Number(this.dl()),
      method_justification: this.notRecommended() ? this.just().trim() : null, purpose: this.purpose(),
      lab_id: this.labId() || null, calibration_id: this.spectro() ? this.calId() || null : null,
    }).subscribe({
      next: r => {
        this.busy.set(false);
        this.toast.success(`Saved ${r.bag_code} · ${this.def().label}`, 'Attach the certificate from the Results tab.');
        this.value.set(null);
        this.unc.set(null);
        if (r.below_detection_limit) this.toast.info('Below the detection limit', `${r.value} ${r.unit} is under the lab's limit of ${r.detection_limit} ${r.unit}; it is flagged for review.`);
        this.created.emit(r);
      },
      error: (e: ApiError) => { this.busy.set(false); this.err.set(e.message); },
    });
  }
}
