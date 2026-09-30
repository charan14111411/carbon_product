import { ChangeDetectionStrategy, Component, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { NumPipe } from '../../core/format';
import { KIT } from '../../ui/kit';
import { Remote } from '../supporting/shared';
import { TierChip } from '../supporting/tier-chip';
import { humanReason } from './types';

interface Rec {
  field_id: string; field_code: string; priority: number; predicted_soc_pct: number | null; supporting_tier: number;
  in_domain: boolean; suggested_samples: number; stratum: string | null; reasons: string[];
}
interface Optimiser {
  project_id: string; budget: number; soc_map_id: string; data_class: string; recommendations: Rec[];
  per_stratum: { stratum: string; fields: number; suggested_samples: number; extra_samples: number }[];
  total_suggested_samples: number;
}

@Component({
  selector: 'vc-optimiser-tab',
  imports: [...KIT, FormsModule, NumPipe, TierChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card budget">
      <div class="bl">
        <label for="bud" class="label">Fields you can sample this round</label>
        <p class="small muted">The optimiser picks the fields where one more lab result would reduce uncertainty the most, using the latest soil-carbon map.</p>
      </div>
      <div class="br">
        <input id="bud" type="range" min="1" max="60" [ngModel]="budget()" (ngModelChange)="setBudget($event)" />
        <input type="number" class="input num bn" min="1" max="10000" [ngModel]="budget()" (ngModelChange)="setBudget($event)" aria-label="Budget" />
      </div>
    </section>

    @if (opt.loading() && !opt.data()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (opt.error(); as e) {
      @if (e.code === 'NO_SOC_MAP') {
        <div class="card"><vc-empty icon="map" title="Generate a soil-carbon map first" [text]="e.message" /></div>
      } @else {
        <vc-error title="Couldn't run the optimiser" [message]="e.message" />
      }
    } @else if (opt.data(); as o) {
      <div class="grid grid-4">
        <vc-stat label="Fields chosen" [value]="o.recommendations.length" [hint]="'of a budget of ' + o.budget" icon="target" />
        <vc-stat label="Samples suggested" [value]="o.total_suggested_samples" hint="Includes extra samples where data is weak" icon="flask" [accent]="true" />
        <vc-stat label="Strata covered" [value]="o.per_stratum.length" icon="layers" />
        <vc-stat label="Outside training data" [value]="outside(o)" hint="Sampling these extends the model" icon="alert" />
      </div>

      <div class="grid split">
        <section class="card">
          <div class="card-head"><h3>Ranked recommendations</h3><vc-dc cls="MODELLED" />@if (opt.loading()) { <span class="small subtle">Updating…</span> }</div>
          @if (!o.recommendations.length) {
            <vc-empty icon="target" title="No fields to recommend" text="The latest map has no fields that belong to this project." />
          } @else {
            <ol class="recs">
              @for (r of o.recommendations; track r.field_id; let i = $index) {
                <li>
                  <span class="rk num">{{ i + 1 }}</span>
                  <div class="rm">
                    <div class="row wrap" style="--gap:8px">
                      <strong>{{ r.field_code }}</strong>
                      @if (r.stratum) { <span class="chip">Stratum {{ r.stratum }}</span> }
                      <vc-tier [tier]="r.supporting_tier" />
                      @if (!r.in_domain) { <span class="chip warn">Outside training data</span> }
                    </div>
                    <ul class="why">@for (w of r.reasons; track $index) { <li>{{ hr(w) }}</li> }</ul>
                  </div>
                  <div class="rs">
                    <strong class="num">{{ r.suggested_samples }}</strong><span>sample{{ r.suggested_samples > 1 ? 's' : '' }}</span>
                    <span class="subtle small num">{{ r.predicted_soc_pct === null ? 'no prediction' : (r.predicted_soc_pct | num: 2) + '% SOC' }}</span>
                  </div>
                </li>
              }
            </ol>
          }
        </section>
        <section class="card">
          <div class="card-head"><h3>By stratum</h3></div>
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Stratum</th><th class="num">Fields</th><th class="num">Samples</th><th class="num">Extra</th></tr></thead>
              <tbody>
                @for (s of o.per_stratum; track s.stratum) {
                  <tr><td>{{ s.stratum === 'unstratified' ? 'Not stratified' : s.stratum }}</td><td class="num">{{ s.fields }}</td>
                    <td class="num">{{ s.suggested_samples }}</td><td class="num">{{ s.extra_samples }}</td></tr>
                } @empty { <tr><td colspan="4" class="muted">Nothing selected.</td></tr> }
              </tbody>
            </table>
          </div>
          <div class="card-foot left"><span class="small muted">"Extra" samples are added where only regional data is available or the field sits outside the model's training range.</span></div>
        </section>
      </div>
    }
  `,
  styles: [`
    :host{display:flex;flex-direction:column;gap:16px}
    .budget{display:flex;gap:24px;align-items:center;padding:18px 20px;flex-wrap:wrap}
    .bl{flex:1;min-width:260px} .bl p{margin-top:4px;max-width:560px}
    .br{display:flex;align-items:center;gap:14px}
    .br input[type=range]{width:260px;accent-color:var(--primary)}
    .bn{width:84px}
    .split{grid-template-columns:minmax(0,2fr) minmax(0,1fr);align-items:start}
    @media (max-width:1100px){.split{grid-template-columns:1fr}}
    .recs{list-style:none;margin:0;padding:0}
    .recs > li{display:flex;gap:14px;padding:14px 20px;border-bottom:1px solid var(--stone-100);align-items:flex-start}
    .recs > li:last-child{border-bottom:0}
    .rk{display:grid;place-items:center;flex:none;width:26px;height:26px;border-radius:7px;background:var(--forest-50);color:var(--forest-700);font-size:12px;font-weight:600}
    .rm{flex:1;min-width:0}
    .why{margin:6px 0 0;padding-left:16px;font-size:12.5px;color:var(--stone-700)} .why li + li{margin-top:2px}
    .rs{display:flex;flex-direction:column;align-items:flex-end;flex:none;min-width:90px}
    .rs strong{font-size:20px;font-weight:600;line-height:1.1} .rs span{font-size:12px;color:var(--text-2)}
    .chip{font-size:11.5px;padding:2px 8px;border-radius:999px;background:var(--stone-100);color:var(--stone-600)}
    .chip.warn{background:var(--amber-100);color:var(--amber-600)}
    .card-foot.left{justify-content:flex-start}
  `],
})
export class OptimiserTab {
  private api = inject(ApiService);
  projectId = input.required<string>();
  budget = signal(10);
  opt = new Remote<Optimiser>();
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      const pid = this.projectId();
      const b = this.budget();
      untracked(() => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.opt.load(this.api.get<Optimiser>(`/projects/${pid}/sampling-optimiser`, { budget: b }), true), 250);
      });
    });
  }

  setBudget(v: number | string) {
    const n = Math.round(Number(v));
    if (Number.isFinite(n) && n >= 1 && n <= 10000) this.budget.set(n);
  }
  hr = humanReason;
  outside(o: Optimiser) { return o.recommendations.filter(r => !r.in_domain).length; }
}
