import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NumPipe } from '../../core/format';
import { DataClass } from '../../ui/kit';
import { MultistageSummary } from './calc.types';
import { sci } from './vm0042-panels';

const SEL: Record<string, string> = { census: 'census', pps_wr: 'PPS with replacement', equal_wr: 'equal probability with replacement' };
const UNIT: Record<string, string> = { landowner: 'Landowners', farm: 'Farms', field: 'Fields' };

/** Appendix 6 design summary and per-unit estimates for a run whose campaign used a multi-stage design. */
@Component({
  selector: 'vc-multistage-panel',
  imports: [NumPipe, DataClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="card-head">
        <h3>Multi-stage sampling design</h3><span class="ref">VM0042 App. 6 · Eq. A6.8–A6.9</span><vc-dc cls="CALCULATED" />
        <span class="spacer"></span><span class="subtle small">design v{{ m().version }}</span>
      </div>
      <div class="sum">
        <div><span>Stage 1</span><strong>{{ unit() }}</strong><em>{{ sel(m().stage1_selection) }}</em></div>
        <div><span>Population</span><strong class="num">{{ m().population_area_ha | num: 1 }}</strong><em>ha</em></div>
        <div><span>Project-plot change</span><strong class="num">{{ m().delta_t_c | num: 2 }}</strong><em>t C · {{ m().total_start_t_c | num: 1 }} → {{ m().total_final_t_c | num: 1 }}</em></div>
        <div><span>Variance (project · control)</span><strong class="num">{{ sci(m().variance_project_t_c2) }}</strong><em>· {{ sci(m().variance_control_t_c2) }} (t C)²</em></div>
        <div><span>df (Welch)</span><strong class="num">{{ m().df === null ? '—' : (m().df | num: 1) }}</strong><em>&nbsp;</em></div>
      </div>
      <p class="desc small muted">{{ m().description }}</p>
      <div class="table-wrap">
        <table class="table">
          <thead><tr>
            <th>Unit</th><th>Fields</th><th class="num">k</th><th class="num">p</th><th class="num">Draws</th>
            <th class="num">Start <span class="u">t C</span></th><th class="num">End <span class="u">t C</span></th>
            <th class="num">s²<sub>x</sub></th><th class="num">s²<sub>s</sub></th><th class="num">COV</th><th class="num">s²<sub>Δ</sub></th><th>Eq.</th>
          </tr></thead>
          <tbody>
            @for (u of m().units; track u.key) {
              <tr>
                <td><strong>{{ u.label || u.key }}</strong></td><td class="small">{{ sel(u.field_selection) }}</td>
                <td class="num">{{ u.k }}</td><td class="num">{{ u.probability | num: 4 }}</td><td class="num">{{ u.draws }}</td>
                <td class="num">{{ u.total_start_t_c | num: 2 }}</td><td class="num">{{ u.total_final_t_c | num: 2 }}</td>
                <td class="num">{{ sci(u.s2_start) }}</td><td class="num">{{ sci(u.s2_final) }}</td><td class="num">{{ sci(u.cov) }}</td>
                <td class="num"><strong>{{ sci(u.s2_change) }}</strong></td><td><code class="eq">{{ u.eq }}</code></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <div class="card-foot foot small subtle">Project plots use the design-weighted (Hansen–Hurwitz) estimator instead of the stratified Eq. 70–71 totals; control plots keep their stratified estimator. Variances in (t C)².</div>
    </section>
  `,
  styles: [`
    .ref{font:500 11px/1 var(--mono);padding:4px 7px;border-radius:5px;background:var(--sand-100);border:1px solid var(--border);color:var(--stone-600)}
    .sum{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));border-bottom:1px solid var(--border)}
    .sum > div{display:flex;flex-direction:column;gap:1px;padding:14px 18px;border-right:1px solid var(--stone-100)} .sum > div:last-child{border-right:0}
    .sum span{font-size:11.5px;color:var(--text-3)} .sum strong{font-size:16px} .sum em{font-style:normal;font-size:12px;color:var(--text-2)}
    .desc{padding:10px 20px;border-bottom:1px solid var(--border)}
    .u{font-size:11px;color:var(--text-3);font-weight:400}
    .eq{font-size:11px;padding:2px 6px;border-radius:4px;background:var(--dc-calculated-bg);color:var(--dc-calculated);white-space:nowrap}
    .foot{justify-content:flex-start}
    @media (max-width: 1000px){ .sum{grid-template-columns:repeat(2,minmax(0,1fr))} .sum > div{border-bottom:1px solid var(--stone-100)} }
  `],
})
export class MultistagePanel {
  m = input.required<MultistageSummary>();
  sci = sci;
  unit = computed(() => UNIT[this.m().stage1_unit] ?? this.m().stage1_unit);
  sel(s: string) { return SEL[s] ?? s; }
}
