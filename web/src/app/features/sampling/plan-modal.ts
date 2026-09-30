import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Callout, DataClass, Modal } from '../../ui/kit';
import { SamplePlan, Stratum, sampleSize } from './types';

/** Decide how many cores a zone needs: typed in, or worked out from prior variability. */
@Component({
  selector: 'vc-plan-modal',
  imports: [FormsModule, Modal, Icon, Callout, DataClass, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [(open)]="open" width="640px" [title]="'Sample plan · zone ' + (zone()?.code ?? '')"
      subtitle="How many cores this zone needs in this campaign. Someone else must approve it before points are placed.">
      <div class="stack" style="--gap:18px">
        <div class="seg" role="radiogroup" aria-label="Method">
          <button type="button" [class.on]="method() === 'variance_formula'" (click)="method.set('variance_formula')">
            <vc-icon name="sigma" [size]="16" /><span><strong>Calculate from variability</strong><em>Use a prior mean and spread of soil carbon</em></span>
          </button>
          <button type="button" [class.on]="method() === 'manual'" (click)="method.set('manual')">
            <vc-icon name="pencil" [size]="16" /><span><strong>Enter a number</strong><em>For example, a count set by the methodology</em></span>
          </button>
        </div>

        @if (method() === 'variance_formula') {
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
    .seg{display:grid;grid-template-columns:1fr 1fr;gap:10px}
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

  method = signal<'manual' | 'variance_formula'>('variance_formula');
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
    });
  }

  valid() {
    if (this.justification.trim().length < 5) return false;
    return this.method() === 'manual' ? !!this.manualN && this.manualN >= 1 : !!this.calc();
  }

  save() {
    const z = this.zone();
    if (!z) return;
    this.busy.set(true);
    this.error.set(null);
    const formula = this.method() === 'variance_formula';
    this.api.post<SamplePlan>(`/campaigns/${this.campaignId()}/sample-plans`, {
      stratum_id: z.id,
      method: this.method(),
      n_required: formula ? (this.minN ? Number(this.minN) : null) : Number(this.manualN),
      inputs: formula ? { prior_mean: this.mean(), prior_sd: this.sd(), target_error_pct: this.err(), confidence: this.conf() } : {},
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
