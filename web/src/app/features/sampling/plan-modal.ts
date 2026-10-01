import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Callout, DataClass, Modal } from '../../ui/kit';
import { PowerResult, SamplePlan, Stratum, sampleSize } from './types';

type UiMethod = 'power' | 'variance_formula' | 'manual';

/** Decide how many cores a zone needs: typed in, or worked out from prior variability. */
@Component({
  selector: 'vc-plan-modal',
  imports: [FormsModule, Modal, Icon, Callout, DataClass, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [(open)]="open" width="740px" [title]="'Sample plan · zone ' + (zone()?.code ?? '')"
      subtitle="How many cores this zone needs in this campaign. Someone else must approve it before points are placed.">
      <div class="stack" style="--gap:18px">
        <div class="seg" role="radiogroup" aria-label="Method">
          <button type="button" role="radio" [attr.aria-checked]="method() === 'power'" [class.on]="method() === 'power'" (click)="method.set('power')">
            <vc-icon name="chart-line" [size]="16" /><span><strong>Power analysis</strong><em>VM0042 Eq. 1–2: detect a change in carbon</em></span>
          </button>
          <button type="button" role="radio" [attr.aria-checked]="method() === 'variance_formula'" [class.on]="method() === 'variance_formula'" (click)="method.set('variance_formula')">
            <vc-icon name="sigma" [size]="16" /><span><strong>Calculate from variability</strong><em>Use a prior mean and spread of soil carbon</em></span>
          </button>
          <button type="button" role="radio" [attr.aria-checked]="method() === 'manual'" [class.on]="method() === 'manual'" (click)="method.set('manual')">
            <vc-icon name="pencil" [size]="16" /><span><strong>Enter a number</strong><em>For example, a count set by the methodology</em></span>
          </button>
        </div>

        @if (method() === 'power') {
          <div class="pa">
            <div class="pa-head">
              <strong>Power analysis (Eq. 1–2)</strong>
              <span class="chipref">VM0042 §8.2.1.2 Eq. 1–2</span>
            </div>
            <p class="muted small">How many cores are needed to detect a real change in soil carbon between baseline and monitoring — or, for a given number of cores, the smallest change that can be detected (the minimum detectable difference, MDD).</p>
            <div class="dir" role="radiogroup" aria-label="Solve for">
              <button type="button" role="radio" [attr.aria-checked]="dir() === 'n'" [class.on]="dir() === 'n'" (click)="setDir('n')">Find n for a target MDD <span class="subtle">Eq. 2</span></button>
              <button type="button" role="radio" [attr.aria-checked]="dir() === 'mdd'" [class.on]="dir() === 'mdd'" (click)="setDir('mdd')">Find the MDD for a given n <span class="subtle">Eq. 1</span></button>
            </div>
            <div class="form-grid">
              <div class="field">
                <label for="pa-s">S · standard deviation of the difference</label>
                <div class="unit-in">
                  <input id="pa-s" type="number" step="0.01" min="0" class="input num" [ngModel]="pS()" (ngModelChange)="pS.set(+$event); pRes.set(null)" />
                  <select class="input" [ngModel]="pUnit()" (ngModelChange)="pUnit.set($event)" aria-label="Unit">
                    <option value="t C/ha">t C/ha</option><option value="% SOC">% SOC</option><option value="t CO₂e/ha">t CO₂e/ha</option>
                  </select>
                </div>
                <span class="hint">Spread of the paired change between cores, from a pilot or earlier campaign.</span>
              </div>
              @if (dir() === 'n') {
                <div class="field">
                  <label for="pa-mdd">MDD · smallest change to detect</label>
                  <div class="unit-in"><input id="pa-mdd" type="number" step="0.01" min="0" class="input num" [ngModel]="pMdd()" (ngModelChange)="pMdd.set(+$event); pRes.set(null)" /><span class="u">{{ pUnit() }}</span></div>
                </div>
              } @else {
                <div class="field">
                  <label for="pa-n">n · number of cores</label>
                  <div class="unit-in"><input id="pa-n" type="number" step="1" min="2" max="10000" class="input num" [ngModel]="pN()" (ngModelChange)="pN.set(+$event); pRes.set(null)" /><span class="u">cores</span></div>
                </div>
              }
              <div class="field">
                <label for="pa-a">α · significance (two-sided)</label>
                <select id="pa-a" class="input" [ngModel]="pAlpha()" (ngModelChange)="pAlpha.set(+$event); pRes.set(null)">
                  <option [ngValue]="0.01">0.01</option><option [ngValue]="0.05">0.05</option><option [ngValue]="0.1">0.10</option>
                </select>
              </div>
              <div class="field">
                <label for="pa-p">Power (1 − β)</label>
                <select id="pa-p" class="input" [ngModel]="pPower()" (ngModelChange)="pPower.set(+$event); pRes.set(null)">
                  <option [ngValue]="0.8">0.80</option><option [ngValue]="0.9">0.90</option><option [ngValue]="0.95">0.95</option>
                </select>
              </div>
            </div>
            <div class="row" style="--gap:10px">
              <button type="button" class="btn btn-secondary" [disabled]="pBusy() || !powerValid()" (click)="runPower()"><vc-icon name="calculator" />{{ pBusy() ? 'Calculating…' : 'Calculate' }}</button>
              @if (pErr()) { <span class="perr small">{{ pErr() }}</span> }
            </div>
            @if (pRes(); as r) {
              <div class="calc">
                <div class="formula">
                  @if (r.solved_for === 'n') {
                    <span class="f">n ≥ (S · (t<sub>α,ν</sub> + t<sub>β,ν</sub>) / MDD)²</span>
                    <span class="sub mono">= ({{ r.s | num: 3 }} × ({{ r.t_alpha | num: 3 }} + {{ r.t_beta | num: 3 }}) / {{ r.mdd | num: 3 }})² = {{ r.n_formula | num: 2 }}</span>
                    <span class="sub">Smallest n that satisfies Eq. 2, with ν = n − 1 = {{ r.df }} degrees of freedom (solved in {{ r.iterations }} steps).</span>
                  } @else {
                    <span class="f">MDD = S / √n · (t<sub>α,ν</sub> + t<sub>β,ν</sub>)</span>
                    <span class="sub mono">= {{ r.s | num: 3 }} / √{{ r.n }} × ({{ r.t_alpha | num: 3 }} + {{ r.t_beta | num: 3 }}) = {{ r.mdd | num: 3 }} {{ pUnit() }}</span>
                    <span class="sub">ν = n − 1 = {{ r.df }}. {{ r.notes }}</span>
                  }
                </div>
                <div class="res">
                  <span class="subtle small">{{ r.solved_for === 'n' ? 'Cores needed' : 'Detectable change' }}</span>
                  @if (r.solved_for === 'n') { <strong class="num">{{ r.n }}</strong> }
                  @else { <strong class="num">{{ r.mdd | num: 2 }}</strong><span class="subtle small">{{ pUnit() }}</span> }
                  <vc-dc [cls]="r.data_class || 'CALCULATED'" />
                </div>
              </div>
              <div class="use">
                @if (chosenN() === r.n) {
                  <span class="ok small"><vc-icon name="circle-check" [size]="15" />This plan will ask for <strong>{{ r.n }}</strong> cores.</span>
                } @else {
                  <button type="button" class="btn btn-primary btn-sm" (click)="useN(r)"><vc-icon name="check" [size]="14" />Use n = {{ r.n }} for this plan</button>
                }
                <span class="subtle small">{{ r.reference }}</span>
              </div>
            }
          </div>
        } @else if (method() === 'variance_formula') {
          <div class="form-grid">
            <div class="field">
              <label for="p-mean">Prior mean soil carbon (%)</label>
              <input id="p-mean" type="number" step="0.01" min="0" class="input num" [ngModel]="mean()" (ngModelChange)="mean.set(+$event)" />
              <span class="hint">From earlier sampling or published data for this soil.</span>
            </div>
            <div class="field">
              <label for="p-sd">Prior standard deviation (%)</label>
              <input id="p-sd" type="number" step="0.01" min="0" class="input num" [ngModel]="sd()" (ngModelChange)="sd.set(+$event)" />
              <span class="hint">How much soil carbon varies between cores.</span>
            </div>
            <div class="field">
              <label for="p-err">Target error (% of the mean)</label>
              <input id="p-err" type="number" step="1" min="1" max="100" class="input num" [ngModel]="err()" (ngModelChange)="err.set(+$event)" />
            </div>
            <div class="field">
              <label for="p-conf">Confidence</label>
              <select id="p-conf" class="input" [ngModel]="conf()" (ngModelChange)="conf.set(+$event)">
                <option [ngValue]="0.8">80%</option><option [ngValue]="0.9">90%</option>
                <option [ngValue]="0.95">95%</option><option [ngValue]="0.99">99%</option>
              </select>
            </div>
          </div>
          <div class="calc">
            <div class="formula">
              <span class="f">n = ⌈(z · sd / (e · mean))²⌉</span>
              @if (calc(); as c) {
                <span class="sub mono">= ⌈({{ c.z | num: 3 }} × {{ sd() | num: 2 }} / ({{ err() / 100 | num: 2 }} × {{ mean() | num: 2 }}))²⌉ = ⌈{{ c.raw | num: 2 }}⌉</span>
              } @else {
                <span class="sub">Enter a mean above zero, a spread, and a target error between 1 and 100.</span>
              }
            </div>
            <div class="res">
              <span class="subtle small">Cores needed</span>
              <strong class="num">{{ calc()?.n ?? '—' }}</strong>
              <vc-dc cls="CALCULATED" />
            </div>
          </div>
          <div class="field">
            <label for="p-min">Minimum to take <span class="subtle">(optional)</span></label>
            <input id="p-min" type="number" min="1" class="input num" style="max-width:180px" [(ngModel)]="minN" placeholder="—" />
            <span class="hint">The plan uses whichever is larger. The methodology's minimum per zone is also applied by the server.</span>
          </div>
        } @else {
          <div class="field">
            <label for="p-n">Cores required</label>
            <input id="p-n" type="number" min="1" max="10000" class="input num" style="max-width:180px" [(ngModel)]="manualN" />
          </div>
        }

        <div class="field">
          <label for="p-just">Justification</label>
          <textarea id="p-just" class="input" rows="3" [(ngModel)]="justification"
            placeholder="Prior values from the 2023 district soil survey for red laterite, 0–30 cm."></textarea>
          <span class="hint">The approver reads this. At least 5 characters.</span>
        </div>
        @if (error()) { <vc-callout tone="danger" icon="alert">{{ error() }}</vc-callout> }
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !valid()" (click)="save()"><vc-icon name="check" />{{ busy() ? 'Saving…' : 'Save draft plan' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .seg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
    .seg button{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border:1.5px solid var(--border-strong);border-radius:var(--radius);background:var(--surface);text-align:left;font:inherit;cursor:pointer;color:var(--stone-700)}
    .seg button.on{border-color:var(--forest-500);background:var(--forest-50);color:var(--forest-700)}
    .seg span{display:flex;flex-direction:column;gap:2px}
    .seg em{font-style:normal;font-size:12px;color:var(--text-3)}
    .calc{display:flex;align-items:stretch;gap:0;border:1px solid var(--forest-200);border-radius:var(--radius);overflow:hidden;background:var(--forest-50)}
    .formula{flex:1;padding:14px 16px;display:flex;flex-direction:column;gap:6px;min-width:0}
    .f{font:600 15px var(--mono);color:var(--forest-800)}
    .sub{font-size:12.5px;color:var(--stone-600);overflow-wrap:anywhere}
    .res{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:10px 22px;background:var(--surface);border-left:1px solid var(--forest-200)}
    .res strong{font-size:30px;font-weight:600;line-height:1;color:var(--forest-700)}
    .pa{display:flex;flex-direction:column;gap:14px}
    .pa-head{display:flex;align-items:center;gap:8px}
    .chipref{margin-left:auto;font:600 10.5px/1 var(--mono);padding:4px 6px;border-radius:4px;background:var(--sand-200);color:var(--stone-700)}
    .dir{display:inline-flex;padding:3px;border-radius:var(--radius-sm);background:var(--sand-100);border:1px solid var(--border);gap:3px;align-self:flex-start;flex-wrap:wrap}
    .dir button{height:32px;padding:0 12px;border:0;border-radius:6px;background:none;font:inherit;font-size:13px;color:var(--stone-700);cursor:pointer}
    .dir button.on{background:var(--surface);color:var(--forest-700);font-weight:500;box-shadow:var(--shadow)}
    .dir .subtle{font-size:11px;margin-left:4px}
    .unit-in{display:flex;gap:6px;align-items:center}
    .unit-in .input.num{flex:1;min-width:0}
    .unit-in select{width:auto;flex:none}
    .u{font-size:13px;color:var(--text-3);white-space:nowrap}
    .perr{color:var(--danger)}
    .use{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
    .use .ok{display:inline-flex;align-items:center;gap:6px;color:var(--forest-700)}
    .res .subtle.small{text-align:center}
    @media (max-width:600px){.seg{grid-template-columns:1fr}.calc{flex-direction:column}.res{border-left:0;border-top:1px solid var(--forest-200)}}
  `],
})
export class PlanModal {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  open = model(false);
  campaignId = input.required<string>();
  zone = input<Stratum | null>(null);
  saved = output<SamplePlan>();

  method = signal<UiMethod>('power');
  dir = signal<'n' | 'mdd'>('n');
  pS = signal(1.5);
  pUnit = signal('t C/ha');
  pMdd = signal(1.0);
  pN = signal(20);
  pAlpha = signal(0.05);
  pPower = signal(0.9);
  pBusy = signal(false);
  pErr = signal<string | null>(null);
  pRes = signal<PowerResult | null>(null);
  chosenN = signal<number | null>(null);
  private chosenRes: PowerResult | null = null;
  mean = signal(1.2);
  sd = signal(0.35);
  err = signal(10);
  conf = signal(0.9);
  busy = signal(false);
  error = signal<string | null>(null);
  manualN: number | null = null;
  minN: number | null = null;
  justification = '';

  calc = computed(() => sampleSize(this.mean(), this.sd(), this.err(), this.conf()));

  constructor() {
    effect(() => {
      if (!this.open()) return;
      this.error.set(null);
      this.justification = '';
      this.manualN = null;
      this.minN = null;
      this.pRes.set(null);
      this.pErr.set(null);
      this.chosenN.set(null);
      this.chosenRes = null;
    });
  }

  setDir(d: 'n' | 'mdd') {
    this.dir.set(d);
    this.pRes.set(null);
    this.pErr.set(null);
  }

  powerValid() {
    const ok = this.pS() > 0 && this.pAlpha() > 0 && this.pPower() > 0;
    return ok && (this.dir() === 'n' ? this.pMdd() > 0 : Number.isInteger(this.pN()) && this.pN() >= 2);
  }

  runPower() {
    this.pBusy.set(true);
    this.pErr.set(null);
    const body = { s: this.pS(), alpha: this.pAlpha(), power: this.pPower(), ...(this.dir() === 'n' ? { mdd: this.pMdd() } : { n: this.pN() }) };
    this.api.post<PowerResult>('/sample-plans/mdd', body).subscribe({
      next: r => { this.pRes.set(r); this.pBusy.set(false); },
      error: (e: ApiError) => { this.pErr.set(e.message); this.pBusy.set(false); },
    });
  }

  useN(r: PowerResult) {
    this.chosenN.set(r.n);
    this.chosenRes = r;
    if (!this.justification.trim()) {
      this.justification = r.solved_for === 'n'
        ? `Power analysis (VM0042 Eq. 2): S ${r.s} ${this.pUnit()}, MDD ${r.mdd} ${this.pUnit()}, α ${r.alpha}, power ${r.power} gives n = ${r.n}.`
        : `Power analysis (VM0042 Eq. 1): n = ${r.n} detects a change of ${Math.round(r.mdd * 100) / 100} ${this.pUnit()} (S ${r.s}, α ${r.alpha}, power ${r.power}).`;
    }
  }

  valid() {
    if (this.justification.trim().length < 5) return false;
    if (this.method() === 'power') return !!this.chosenN();
    return this.method() === 'manual' ? !!this.manualN && this.manualN >= 1 : !!this.calc();
  }

  save() {
    const z = this.zone();
    if (!z) return;
    this.busy.set(true);
    this.error.set(null);
    const formula = this.method() === 'variance_formula';
    const pr = this.method() === 'power' ? this.chosenRes : null;
    // Power analysis is stored as an entered n with its Eq. 1-2 inputs, so the approver sees how it was reached.
    const inputs = formula ? { prior_mean: this.mean(), prior_sd: this.sd(), target_error_pct: this.err(), confidence: this.conf() }
      : pr ? { power_s: pr.s, power_mdd: Math.round(pr.mdd * 1e6) / 1e6, power_alpha: pr.alpha, power_beta_power: pr.power, power_df: pr.df, power_t_alpha: pr.t_alpha, power_t_beta: pr.t_beta }
      : {};
    this.api.post<SamplePlan>(`/campaigns/${this.campaignId()}/sample-plans`, {
      stratum_id: z.id,
      method: formula ? 'variance_formula' : 'manual',
      n_required: formula ? (this.minN ? Number(this.minN) : null) : pr ? pr.n : Number(this.manualN),
      inputs,
      justification: this.justification.trim(),
    }).subscribe({
      next: p => {
        this.busy.set(false);
        this.toast.success(`Draft plan saved: ${p.n_required} cores for ${p.stratum_code}`, p.warnings[0]?.message);
        this.saved.emit(p);
        this.open.set(false);
      },
      error: (e: ApiError) => { this.busy.set(false); this.error.set(e.message); },
    });
  }
}
