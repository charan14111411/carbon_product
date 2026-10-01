import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NumPipe, fmtNum } from '../../core/format';
import { Icon } from '../../ui/icon';
import { Callout, DataClass } from '../../ui/kit';
import { EngineResult, EquationRow, LeakageItem, Qa3Source, StratumResult, UncSource, VintageRow } from './calc.types';
import { EF_END_TEXT, EXEMPTION_LABEL, SOURCE_ORDER, eqNumber, eqText, sourceLabel } from './vm0042';

/** Number that stays readable for very small variances. */
export function sci(v: number | null | undefined, digits = 3): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  if (v !== 0 && Math.abs(v) < 0.001) return v.toExponential(2).replace('e', ' × 10^');
  return fmtNum(v, digits);
}

function stage(eq: string): { key: string; label: string } {
  if (/App\. ?6|A6\.\d/.test(eq)) return { key: 'a6', label: 'Multi-stage design' };
  const n = Number(eqNumber(eq) ?? 0);
  if (/§4/.test(eq) || (n >= 44 && n <= 51) || (n >= 1 && n <= 5)) return { key: 'soc', label: 'Soil carbon' };
  if (n >= 60 && n <= 74) return { key: 'unc', label: 'Uncertainty' };
  if ((n >= 6 && n <= 36) || (n >= 52 && n <= 59)) return { key: 'em', label: 'Emissions & leakage' };
  if (n >= 37 && n <= 43) return { key: 'net', label: 'Reductions & removals' };
  if (n >= 75) return { key: 'vcu', label: 'Buffer & VCUs' };
  return { key: 'other', label: 'Other' };
}

function cap(v: string) { return v.charAt(0).toUpperCase() + v.slice(1); }

/* ================================================================== equation trail */
@Component({
  selector: 'vc-equation-trail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!rows().length) {
      <p class="muted small pad">This run was made before the engine recorded its equation trail. Recalculate it as a replacement to see every step.</p>
    } @else {
      <div class="filters">
        <button type="button" [class.on]="st() === ''" (click)="st.set('')">All steps <span class="c">{{ rows().length }}</span></button>
        @for (s of stages(); track s.key) {
          <button type="button" [class.on]="st() === s.key" (click)="st.set(s.key)">{{ s.label }} <span class="c">{{ s.n }}</span></button>
        }
      </div>
      <ol class="trail">
        @for (r of shown(); track r.i) {
          <li [class.key]="r.key">
            <span class="n num">{{ r.i + 1 }}</span>
            <div class="body">
              <div class="top">
                <code class="eq">{{ r.eq }}</code>
                <span class="lbl">{{ r.label }}</span>
                <span class="val num">
                  @if (r.value === null) { <span class="subtle">—</span> } @else { {{ fmt(r.value, r.unit) }} }
                  @if (r.unit) { <small>{{ r.unit }}</small> }
                </span>
              </div>
              @if (r.text) { <p class="txt">{{ r.text }}</p> }
            </div>
          </li>
        }
      </ol>
    }
  `,
  styles: [`
    .pad{padding:20px}
    .filters{display:flex;gap:6px;flex-wrap:wrap;padding:14px 20px;border-bottom:1px solid var(--border)}
    .filters button{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:999px;border:1px solid var(--border);background:var(--surface);font:500 12.5px var(--font);color:var(--stone-700);cursor:pointer}
    .filters button.on{background:var(--forest-600);border-color:var(--forest-600);color:#fff}
    .filters .c{font-size:11px;opacity:.75}
    .trail{list-style:none;margin:0;padding:6px 20px 12px;counter-reset:s}
    li{display:flex;gap:14px;padding:12px 0;border-bottom:1px solid var(--stone-100);position:relative}
    li:last-child{border-bottom:0}
    .n{flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:var(--sand-100);border:1px solid var(--border);font-size:11.5px;color:var(--stone-600)}
    li.key .n{background:var(--forest-600);border-color:var(--forest-600);color:#fff}
    .body{flex:1;min-width:0}
    .top{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
    .eq{flex:none;font-size:11.5px;padding:2px 7px;border-radius:5px;background:var(--dc-calculated-bg);color:var(--dc-calculated);font-weight:600}
    .lbl{flex:1;min-width:200px;font-weight:500;font-size:13.5px;font-family:var(--mono);font-size:12.5px;color:var(--stone-800)}
    .val{font-weight:600;font-size:14px;white-space:nowrap}
    .val small{font-weight:500;font-size:11.5px;color:var(--text-3);margin-left:4px}
    li.key .val{color:var(--forest-700)}
    .txt{margin-top:3px;font-size:12.5px;color:var(--text-2);max-width:820px}
  `],
})
export class EquationTrail {
  rows = input<EquationRow[]>([]);
  st = signal('');
  private all = computed(() => this.rows().map((r, i) => {
    const s = stage(r.eq);
    return { ...r, i, stage: s.key, stageLabel: s.label, text: eqText(r.eq, r.label), key: /^Eq\. (43|77|78|79)$/.test(r.eq) };
  }));
  stages = computed(() => {
    const m = new Map<string, { key: string; label: string; n: number }>();
    for (const r of this.all()) {
      const e = m.get(r.stage) ?? { key: r.stage, label: r.stageLabel, n: 0 };
      e.n++;
      m.set(r.stage, e);
    }
    return [...m.values()];
  });
  shown = computed(() => this.all().filter(r => !this.st() || r.stage === this.st()));
  fmt(v: number, unit: string) {
    if (unit === '') return fmtNum(v, 0);
    if (unit === '%') return fmtNum(v, 2);
    return sci(v, 3);
  }
}

/* ================================================================== VCU summary + vintages */
@Component({
  selector: 'vc-vcu-summary',
  imports: [NumPipe, DataClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hero">
      <div class="card tot">
        <div class="l">Verified Carbon Units <span class="eqc">Eq. 79</span> <vc-dc cls="CALCULATED" /></div>
        <div class="v num" [class.neg]="r().credits_t_co2e < 0">{{ r().credits_t_co2e | num: 1 }}<span>tCO₂e</span></div>
        <div class="s">VCU_ER + VCU_CR after leakage and a {{ r().non_permanence_risk_pct | num: 1 }} % buffer on soil-carbon changes.</div>
      </div>
      <div class="card part">
        <div class="l">Reduction credits <span class="eqc">VCU_ER · Eq. 77</span></div>
        <div class="pv num" [class.neg]="r().reductions_t_co2e < 0">{{ r().reductions_t_co2e | num: 1 }}<small>tCO₂e</small></div>
        <p>Emissions avoided (fuel, fertiliser, livestock, burning) and soil-carbon losses prevented, net of leakage and buffer.</p>
      </div>
      <div class="card part">
        <div class="l">Removal credits <span class="eqc">VCU_CR · Eq. 78</span></div>
        <div class="pv num" [class.neg]="r().removals_t_co2e < 0">{{ r().removals_t_co2e | num: 1 }}<small>tCO₂e</small></div>
        <p>New carbon stored in the soil beyond the baseline, net of leakage and buffer.</p>
      </div>
    </div>

    @if (vint().length) {
      <section class="card vt">
        <div class="card-head"><h3>Per vintage</h3><span class="subtle small">Results are split by calendar year when the period spans several years (§8.1).</span></div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr>
              <th>Vintage</th><th class="num">Share of period</th><th class="num" title="Indicator I: 1 once cumulative project stock change is positive">I</th>
              <th class="num">ER <span class="thu">Eq. 37</span></th><th class="num">CR <span class="thu">Eq. 40</span></th>
              <th class="num">Leakage <span class="thu">Eq. 39/42</span></th>
              <th class="num">Buffer ER <span class="thu">Eq. 75</span></th><th class="num">Buffer CR <span class="thu">Eq. 76</span></th>
              <th class="num">VCU_ER</th><th class="num">VCU_CR</th><th class="num">VCUs</th>
            </tr></thead>
            <tbody>
              @for (v of vint(); track v.year) {
                <tr>
                  <td><strong>{{ v.year }}</strong>@if (v.weight < 1) { <div class="subtle small">{{ v.weight * 100 | num: 0 }} % of the year</div> }</td>
                  <td class="num">{{ v.share * 100 | num: 1 }} %</td>
                  <td class="num">{{ v.indicator | num: 0 }}</td>
                  <td class="num" [class.neg]="v.er_t_co2e < 0">{{ v.er_t_co2e | num: 2 }}</td>
                  <td class="num">{{ v.cr_t_co2e | num: 2 }}</td>
                  <td class="num">{{ v.leakage_t_co2e ? '−' : '' }}{{ v.leakage_t_co2e | num: 2 }}</td>
                  <td class="num">{{ v.buffer_er_t_co2e ? '−' : '' }}{{ v.buffer_er_t_co2e | num: 2 }}</td>
                  <td class="num">{{ v.buffer_cr_t_co2e ? '−' : '' }}{{ v.buffer_cr_t_co2e | num: 2 }}</td>
                  <td class="num" [class.neg]="v.vcu_er < 0">{{ v.vcu_er | num: 2 }}</td>
                  <td class="num" [class.neg]="v.vcu_cr < 0">{{ v.vcu_cr | num: 2 }}</td>
                  <td class="num"><strong [class.neg]="v.vcu < 0">{{ v.vcu | num: 2 }}</strong></td>
                </tr>
              }
            </tbody>
            @if (vint().length > 1) {
              <tfoot><tr>
                <td><strong>Total</strong></td><td class="num">100 %</td><td></td>
                <td class="num">{{ sum('er_t_co2e') | num: 2 }}</td><td class="num">{{ sum('cr_t_co2e') | num: 2 }}</td>
                <td class="num">{{ sum('leakage_t_co2e') ? '−' : '' }}{{ sum('leakage_t_co2e') | num: 2 }}</td>
                <td class="num">{{ sum('buffer_er_t_co2e') ? '−' : '' }}{{ sum('buffer_er_t_co2e') | num: 2 }}</td>
                <td class="num">{{ sum('buffer_cr_t_co2e') ? '−' : '' }}{{ sum('buffer_cr_t_co2e') | num: 2 }}</td>
                <td class="num">{{ sum('vcu_er') | num: 2 }}</td><td class="num">{{ sum('vcu_cr') | num: 2 }}</td>
                <td class="num"><strong>{{ sum('vcu') | num: 2 }}</strong></td>
              </tr></tfoot>
            }
          </table>
        </div>
        <div class="card-foot small muted ft">All figures in tCO₂e. Losses are reported as measured — never rounded up to zero. The buffer is charged only on soil-carbon stock changes.</div>
      </section>
    }
  `,
  styles: [`
    .hero{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr) minmax(0,1fr);gap:16px;margin-bottom:16px}
    @media (max-width: 1100px){.hero{grid-template-columns:1fr 1fr}.tot{grid-column:1/-1}}
    @media (max-width: 720px){.hero{grid-template-columns:1fr}}
    .tot{padding:20px 22px;background:linear-gradient(135deg,var(--forest-800),var(--forest-600));border-color:var(--forest-700);color:#fff}
    .l{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:var(--text-2);flex-wrap:wrap}
    .tot .l{color:rgba(255,255,255,.8)}
    .eqc{font:600 10.5px var(--mono);padding:2px 6px;border-radius:4px;background:var(--sand-100);color:var(--stone-600)}
    .tot .eqc{background:rgba(255,255,255,.14);color:#fff}
    .v{font-size:40px;font-weight:600;letter-spacing:-.02em;margin-top:6px}
    .v span{font-size:15px;font-weight:500;margin-left:8px;color:rgba(255,255,255,.7)}
    .v.neg{color:#ffd7d3}
    .s{font-size:12.5px;color:rgba(255,255,255,.75);margin-top:4px}
    .part{padding:18px 20px}
    .pv{font-size:28px;font-weight:600;letter-spacing:-.02em;margin-top:6px}
    .pv small{font-size:13px;color:var(--text-3);margin-left:6px;font-weight:500}
    .part p{font-size:12.5px;color:var(--text-2);margin-top:4px}
    .neg{color:var(--red-600)}
    .vt{margin-bottom:16px}
    .thu{font-weight:400;color:var(--text-3);font-family:var(--mono);font-size:10.5px;margin-left:2px}
    tfoot td{padding:10px 14px;background:var(--surface-2);border-top:1px solid var(--border);font-weight:500}
    .ft{justify-content:flex-start}
  `],
})
export class VcuSummary {
  r = input.required<EngineResult>();
  vint = computed<VintageRow[]>(() => this.r().vintages ?? []);
  sum(k: keyof VintageRow) { return this.vint().reduce((a, v) => a + (Number(v[k]) || 0), 0); }
}

/* ================================================================== uncertainty per source */
@Component({
  selector: 'vc-uncertainty-panel',
  imports: [NumPipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (soc(); as s) {
      <div class="grid2">
        <div class="explain">
          <h4>How much the soil result is trusted</h4>
          <p>
            Soil samples vary, so the measured change has a sampling error. VM0042 turns that error into a percentage,
            <strong>UNC</strong>, with <strong>Eq. 74</strong>: the standard error of the mean change divided by the mean change, times the
            one-sided Student t for {{ (s.confidence ?? 0.667) * 100 | num: 1 }} % confidence.
          </p>
          <div class="formula">UNC = √{{ sci(s.s2_mean) }} ÷ |{{ sci(s.mean) }}| × {{ s.t ?? 0 | num: 4 }} = <strong>{{ s.unc_pct ?? 0 | num: 2 }} %</strong></div>
          <p>
            <strong>The sign rule (Eq. 44/45).</strong>
            @if ((s.i_soil ?? 1) >= 0) {
              The project stored at least as much carbon as the baseline, so I<sub>soil</sub> = +1 and both soil changes are multiplied by
              (1 − UNC) = <strong>{{ s.multiplier ?? 1 | num: 4 }}</strong>. This shrinks the credited gain.
            } @else {
              The project did worse than the baseline, so I<sub>soil</sub> = −1 and both soil changes are multiplied by
              (1 + UNC) = <strong>{{ s.multiplier ?? 1 | num: 4 }}</strong>. This makes the reported loss larger.
            }
            Either way, uncertainty can only make the result more conservative — never larger.
          </p>
        </div>
        <dl class="kv">
          <dt>Approach</dt><dd>{{ s.approach === 'qa1' ? 'QA1 — model with true-up' : 'QA2 — measure and re-measure' }}</dd>
          <dt>Variance of mean, s²<sub>mean</sub></dt><dd class="num">{{ sci(s.s2_mean) }} {{ s.approach === 'qa1' ? '(tCO₂e)²' : '(t C/ha)²' }} <span class="eqr">Eq. 70</span></dd>
          <dt>Mean change</dt><dd class="num">{{ sci(s.mean) }} {{ s.approach === 'qa1' ? 'tCO₂e' : 't C/ha' }}</dd>
          <dt>Degrees of freedom</dt><dd class="num">{{ s.df ?? 0 | num: 1 }} (Welch–Satterthwaite)</dd>
          <dt>t value (one-sided)</dt><dd class="num">{{ s.t === null || s.t === undefined ? '—' : (s.t | num: 4) }}</dd>
          <dt>UNC<sub>CO₂</sub></dt><dd class="num"><strong>{{ s.unc_pct ?? 0 | num: 2 }} %</strong> <span class="eqr">Eq. 74</span></dd>
          <dt>I<sub>soil</sub></dt><dd class="num">{{ (s.i_soil ?? 1) > 0 ? '+1' : '−1' }}</dd>
          <dt>Multiplier</dt><dd class="num"><strong>{{ s.multiplier ?? 1 | num: 4 }}</strong> <span class="eqr">Eq. 44/45</span></dd>
        </dl>
      </div>
    }
    <div class="table-wrap others">
      <table class="table">
        <thead><tr><th>Source</th><th>Approach</th><th>How uncertainty is handled</th><th class="num">s²</th><th class="num">t</th><th class="num">UNC</th></tr></thead>
        <tbody>
          <tr class="hl">
            <td><strong>Soil organic carbon</strong></td><td>{{ (soc()?.approach ?? '').toUpperCase() }}</td>
            <td class="small">Eq. 74 → multiplier {{ soc()?.multiplier ?? 1 | num: 4 }} on project and baseline stock change (Eq. 44/45)</td>
            <td class="num">{{ sci(soc()?.s2_mean) }}</td><td class="num">{{ soc()?.t ?? 0 | num: 3 }}</td><td class="num"><strong>{{ soc()?.unc_pct ?? 0 | num: 2 }} %</strong></td>
          </tr>
          @for (o of others(); track o.key) {
            <tr>
              <td>{{ o.label }}</td><td>{{ o.approach }}</td><td class="small">{{ o.how }}</td>
              <td class="num">{{ o.s2 }}</td><td class="num">{{ o.t }}</td><td class="num">{{ o.unc }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
    <p class="note small muted"><vc-icon name="info" [size]="13" />Default-factor sources (QA3) carry no statistical deduction: the conservative end of each emission-factor range is used instead (§8.6.3). Modelled soil CH₄ and N₂O fluxes are multiplied by (1 − UNC) in Eq. 37, or (1 + UNC) if the project emits more.</p>
  `,
  styles: [`
    .grid2{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:28px;padding:20px}
    @media (max-width: 1000px){.grid2{grid-template-columns:1fr}}
    h4{font-size:14px;margin-bottom:8px}
    .explain p{color:var(--stone-700);line-height:1.6;margin-bottom:10px;font-size:13.5px}
    .formula{font:13px var(--mono);padding:10px 12px;border-radius:var(--radius-sm);background:var(--dc-calculated-bg);color:var(--dc-calculated);margin-bottom:12px;overflow-x:auto;white-space:nowrap}
    .eqr{font:600 10.5px var(--mono);color:var(--text-3);margin-left:6px}
    .others{border-top:1px solid var(--border)}
    tr.hl td{background:var(--forest-50)}
    .note{display:flex;gap:6px;align-items:flex-start;padding:12px 20px;border-top:1px solid var(--border)}
    .note vc-icon{margin-top:2px}
  `],
})
export class UncertaintyPanel {
  r = input.required<EngineResult>();
  sci = sci;
  soc = computed(() => (this.r().uncertainty?.['soc'] as UncSource | undefined) ?? null);
  others = computed(() => {
    const u = this.r().uncertainty ?? {};
    const out: { key: string; label: string; approach: string; how: string; s2: string; t: string; unc: string }[] = [];
    for (const k of ['ch4_soil', 'n2o_soil', 'legacy_terms']) {
      const x = u[k] as UncSource | undefined;
      if (!x) continue;
      const modelled = x.approach === 'qa1' || x.approach === 'approved_term';
      out.push({
        key: k, label: modelled || k === 'legacy_terms' ? sourceLabel(k) : sourceLabel(k).replace(' (modelled)', ''),
        approach: x.approach === 'not_applicable' ? 'Not applicable' : x.approach === 'approved_term' ? 'Approved term' : (x.approach ?? '').toUpperCase(),
        how: modelled ? `Eq. 74 on the approved estimate; ${fmtNum(x.value_t_co2e ?? 0, 2)} t → ${fmtNum(x.after_uncertainty ?? x.value_t_co2e ?? 0, 2)} t after uncertainty (Eq. 37)` : cap(x.method ?? 'Not applicable'),
        s2: modelled ? sci(x.variance) : '—', t: modelled && x.t ? fmtNum(x.t, 3) : '—', unc: modelled ? `${fmtNum(x.unc_pct ?? 0, 2)} %` : '—',
      });
    }
    const qa3 = (u['qa3'] ?? {}) as Record<string, UncSource>;
    for (const k of SOURCE_ORDER.filter(s => qa3[s])) {
      out.push({ key: k, label: sourceLabel(k), approach: 'QA3', how: `Conservative emission-factor range (§8.6.3): ${qa3[k].ef_end ?? 'central'} end used`, s2: '—', t: '—', unc: '0 %' });
    }
    return out;
  });
}

/* ================================================================== emissions & leakage */
@Component({
  selector: 'vc-emissions-panel',
  imports: [NumPipe, Callout],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!e()) {
      <div class="card-body"><vc-callout tone="info" icon="info">This run was made before emissions were quantified from activity data. Recalculate as a replacement to see them.</vc-callout></div>
    } @else {
      @if (!e()!.qa3) {
        <div class="card-body"><vc-callout tone="warn" icon="alert">No activity data was supplied for this period, so QA3 emission reductions and organic-amendment leakage are zero. Record baseline and project activity under <strong>Baseline &amp; activity data</strong>.</vc-callout></div>
      }
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Source</th><th>Equations</th><th>Symbol</th><th class="num">Baseline</th><th class="num">Project</th><th class="num">Reduction</th><th>Emission factor end</th></tr></thead>
          <tbody>
            @for (s of rows(); track s.key) {
              <tr [class.excl]="s.excluded">
                <td><strong>{{ s.label }}</strong>@if (s.excluded) { <div class="small warnc">Set to zero as de minimis</div> }</td>
                <td><code class="eq">{{ s.eq }}</code></td>
                <td class="mono small">{{ s.symbol }}</td>
                <td class="num">{{ s.baseline === null ? '—' : (s.baseline | num: 3) }}</td>
                <td class="num">{{ s.project === null ? '—' : (s.project | num: 3) }}</td>
                <td class="num"><strong [class.neg]="s.reduction < 0">{{ s.reduction | num: 3 }}</strong></td>
                <td>@if (s.end) { <span class="end" [class]="'end e-' + s.end" [title]="endText(s.end)">{{ s.end }}</span> } @else { <span class="subtle small">{{ s.note }}</span> }</td>
              </tr>
            } @empty {
              <tr><td colspan="7" class="muted small">No emission sources were practised in the baseline or project.</td></tr>
            }
          </tbody>
          <tfoot><tr>
            <td colspan="5"><strong>ΣΔE emission reductions</strong>&nbsp;&nbsp;<span class="subtle small">after uncertainty on modelled fluxes · Eq. 37</span></td>
            <td class="num"><strong>{{ e()!.sum_delta_e_t_co2e | num: 3 }}</strong></td><td class="small subtle">before uncertainty {{ e()!.sum_delta_e_before_uncertainty_t_co2e | num: 3 }}</td>
          </tr></tfoot>
        </table>
      </div>
      <p class="note small muted">tCO₂e over the period. Reduction = Σ over quantification units of (baseline − project areal mean) × area (Eq. 52–59). The factor end follows the conservative rule of §8.6.3: when project emissions fall the low end is used for both scenarios, when they rise the high end.</p>
    }
  `,
  styles: [`
    .eq{font-size:11.5px;padding:2px 6px;border-radius:4px;background:var(--dc-calculated-bg);color:var(--dc-calculated);white-space:nowrap}
    .neg{color:var(--red-600)}
    tr.excl td{background:var(--warn-soft)}
    .warnc{color:var(--amber-600)}
    .end{display:inline-block;font-size:11.5px;font-weight:600;padding:2px 8px;border-radius:999px;text-transform:capitalize;background:var(--stone-100);color:var(--stone-600)}
    .end.e-low{background:var(--sky-100);color:var(--sky-600)} .end.e-high{background:var(--clay-100);color:var(--clay-700)}
    tfoot td{padding:12px 14px;background:var(--surface-2);border-top:1px solid var(--border)}
    .note{padding:12px 20px;border-top:1px solid var(--border)}
  `],
})
export class EmissionsPanel {
  r = input.required<EngineResult>();
  e = computed(() => this.r().emissions ?? null);
  rows = computed(() => {
    const e = this.e();
    if (!e) return [];
    const src: Record<string, Qa3Source> = e.qa3?.sources ?? {};
    const excl = new Set(e.excluded_de_minimis ?? []);
    const keys = [...SOURCE_ORDER.filter(k => src[k]), ...Object.keys(src).filter(k => !SOURCE_ORDER.includes(k))];
    const out = keys.map(k => ({
      key: k, label: sourceLabel(k), eq: src[k].eq, symbol: src[k].symbol, baseline: src[k].baseline_t_co2e as number | null,
      project: src[k].project_t_co2e as number | null, reduction: src[k].reduction_t_co2e, end: src[k].ef_end, note: '', excluded: excl.has(k),
    }));
    for (const [k, v] of Object.entries(e.components ?? {})) {
      if (src[k]) continue;
      out.push({ key: k, label: sourceLabel(k), eq: k === 'legacy_terms' ? 'Term' : k === 'ch4_soil' ? 'Eq. 10' : 'Eq. 15', symbol: k === 'ch4_soil' ? 'ΔCH4_soil' : k === 'n2o_soil' ? 'ΔN2O_soil' : '—',
        baseline: null, project: null, reduction: v, end: '', note: 'Approved model estimate × (1 − UNC)', excluded: excl.has(k) });
    }
    return out;
  });
  endText(e: string) { return EF_END_TEXT[e] ?? ''; }
}

/* ================================================================== leakage (Eq. 33, 39, 42) */
@Component({
  selector: 'vc-leakage-panel',
  imports: [NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sum">
      <div><span>LE_OA organic amendments <code>Eq. 33</code></span><strong class="num">{{ leOa() | num: 3 }}</strong></div>
      @if (leBr() !== null) { <div><span>LE_BR biomass residues <code>§8.4.4</code></span><strong class="num">{{ leBr() | num: 3 }}</strong></div> }
      @if (lkDisp() !== null) { <div><span>LK_disp displacement <code>§8.4.2–3</code></span><strong class="num">{{ lkDisp() | num: 3 }}</strong></div> }
      @if (other() !== null) { <div><span>Other approved leakage</span><strong class="num">{{ other() | num: 3 }}</strong></div> }
      @if (allocation(); as a) {
        <div class="alloc"><span>Charged to reductions <code>Eq. 39</code></span><strong class="num">{{ a.er | num: 3 }}</strong></div>
        <div class="alloc"><span>Charged to removals <code>Eq. 42</code></span><strong class="num">{{ a.cr | num: 3 }}</strong></div>
      }
    </div>
    <div class="table-wrap">
      <table class="table">
        <thead><tr><th>Field</th><th>Year</th><th>Amendment</th><th class="num">Imported <span class="thu">t</span></th><th class="num">Additional <span class="thu">t</span></th><th class="num">C content</th><th>Exemption</th><th class="num">LE_OA <span class="thu">tCO₂e</span></th></tr></thead>
        <tbody>
          @for (i of items(); track $index) {
            <tr [class.exempt]="!!i.exemption">
              <td>{{ names()[i.field_id] ?? i.field_id.slice(0, 8) }}</td><td class="num">{{ i.year }}</td><td>{{ human(i.type) }}</td>
              <td class="num">{{ i.mass_t | num: 2 }}</td><td class="num">{{ i.additional_t | num: 2 }}</td>
              <td class="num">{{ i.carbon_content === null ? '—' : (i.carbon_content | num: 3) }}</td>
              <td>@if (i.exemption) { <span class="ex">{{ exemption(i.exemption) }}</span> } @else if (!i.additional_t) { <span class="subtle small">Not additional to the look-back</span> } @else { <span class="subtle small">None — counted</span> }</td>
              <td class="num"><strong>{{ i.le_oa_t_co2e | num: 3 }}</strong></td>
            </tr>
          } @empty {
            <tr><td colspan="8" class="muted small">No manure, compost or biosolids were imported into the project area in this period.</td></tr>
          }
        </tbody>
      </table>
    </div>
    <p class="note small muted">Eq. 33: LE_OA = imported mass not applied in the look-back × carbon content × 0.12 retained × 44/12. No leakage arises when the amendment was produced on-site, diverted from an uncovered anaerobic lagoon or pit, or was not previously used as a soil amendment (§8.4.1).</p>
  `,
  styles: [`
    .sum{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1px;background:var(--border);border-bottom:1px solid var(--border)}
    .sum > div{background:var(--surface);padding:12px 16px;display:flex;flex-direction:column;gap:2px}
    .sum span{font-size:12.5px;color:var(--text-2)} .sum strong{font-size:18px;font-weight:600}
    .sum code{font-size:10.5px;color:var(--text-3)}
    .sum .alloc{background:var(--surface-2)}
    .thu{font-weight:400;color:var(--text-3)}
    tr.exempt td{background:var(--forest-50)}
    .ex{font-size:12px;padding:2px 8px;border-radius:999px;background:var(--ok-soft);color:var(--forest-700)}
    .note{padding:12px 20px;border-top:1px solid var(--border)}
  `],
})
export class LeakagePanel {
  items = input<LeakageItem[]>([]);
  leOa = input<number>(0);
  leBr = input<number | null>(null);
  lkDisp = input<number | null>(null);
  other = input<number | null>(null);
  allocation = input<{ er: number; cr: number } | null>(null);
  names = input<Record<string, string>>({});
  human(v: string) { const s = (v ?? '').replace(/_/g, ' '); return s.charAt(0).toUpperCase() + s.slice(1); }
  exemption(v: string) { return EXEMPTION_LABEL[v] ?? v.replace(/_/g, ' '); }
}

/* ================================================================== zones (ESM + Eq. 71) */
@Component({
  selector: 'vc-zones-table',
  imports: [NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr class="grp">
            <th colspan="3"></th><th colspan="4" class="gh">Stock and change <span>t C/ha</span></th><th colspan="6" class="gh">Eq. 71 variance components <span>(t C)², scaled by area²</span></th><th></th>
          </tr>
          <tr>
            <th>Zone</th><th class="num">Area</th><th class="num">ESM reference mass</th>
            <th class="num">Baseline</th><th class="num">Monitoring</th><th class="num">Change</th><th class="num">Per year</th>
            <th class="num">s²<sub>s</sub> start</th><th class="num">s²<sub>f</sub> end</th><th class="num">COV(f,s)</th><th class="num">s²<sub>wp</sub></th><th class="num">s²<sub>bsl</sub></th><th class="num">s²<sub>ΔSOC</sub></th>
            <th class="num">n used</th>
          </tr>
        </thead>
        <tbody>
          @for (s of zones(); track s.code) {
            <tr [class.ctrl]="s.role === 'control'">
              <td class="zc">
                <div class="zh"><strong>{{ s.code }}</strong><span class="role" [class.c]="s.role === 'control'">{{ s.role === 'control' ? 'Control' : 'Project' }}</span></div>
                <div class="subtle small">{{ zoneName()(s.code) }}</div>
                @if (s.control_code) { <div class="subtle small">netted against {{ s.control_code }}</div> }
                @if (s.quantification_unit && s.quantification_unit !== s.code) { <div class="subtle small">QU {{ s.quantification_unit }}</div> }
              </td>
              <td class="num nowrap">{{ s.area_ha | num: 1 }} <span class="u">ha</span></td>
              <td class="num nowrap">{{ s.reference_mass_t_ha === undefined ? '—' : (s.reference_mass_t_ha | num: 0) }} <span class="u">t/ha</span></td>
              <td class="num">{{ s.mean_baseline_t_c_ha | num: 2 }}</td>
              <td class="num">{{ s.mean_monitoring_t_c_ha | num: 2 }}</td>
              <td class="num"><strong [class.neg]="s.delta_t_c_ha < 0">{{ s.delta_t_c_ha >= 0 ? '+' : '' }}{{ s.delta_t_c_ha | num: 3 }}</strong>
                @if (s.control_code) { <div class="subtle small">measured {{ (s.measured_delta_t_c_ha ?? 0) >= 0 ? '+' : '' }}{{ s.measured_delta_t_c_ha ?? 0 | num: 3 }}</div> }</td>
              <td class="num">{{ s.annual_delta_t_c_ha === null || s.annual_delta_t_c_ha === undefined ? '—' : ((s.annual_delta_t_c_ha >= 0 ? '+' : '') + fmt(s.annual_delta_t_c_ha)) }}</td>
              <td class="num">{{ sci(s.s2_s) }}</td>
              <td class="num">{{ sci(s.s2_f) }}</td>
              <td class="num">{{ sci(s.cov_fs) }}</td>
              <td class="num">{{ sci(s.s2_wp) }}</td>
              <td class="num">{{ s.role === 'control' ? '—' : sci(s.s2_bsl) }}</td>
              <td class="num"><strong>{{ s.role === 'control' ? '—' : sci(s.s2_dsoc) }}</strong></td>
              <td class="num">{{ s.n_used }}@if (s.excluded_sites.length) { <div class="exc" [title]="s.excluded_sites.join(', ')">{{ s.excluded_sites.length }} excluded</div> }</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .grp th{background:var(--surface);border-bottom:0;padding-bottom:0}
    .gh{text-align:center!important;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);border-bottom:1px solid var(--border)!important}
    .gh span{text-transform:none;letter-spacing:0;font-weight:400}
    tr.ctrl td{background:var(--surface-2)}
    .zc{min-width:190px}
    .zh{display:flex;align-items:center;gap:8px}
    .role{font-size:11px;font-weight:600;padding:1px 7px;border-radius:999px;background:var(--forest-100);color:var(--forest-700)}
    .role.c{background:var(--sand-200);color:var(--stone-700)}
    .u{font-size:11.5px;color:var(--text-3);margin-left:2px}
    .neg{color:var(--red-600)}
    .exc{font-size:11px;color:var(--amber-600)}
  `],
})
export class ZonesTable {
  zones = input<StratumResult[]>([]);
  zoneName = input<(code: string) => string>(() => '');
  sci = sci;
  fmt(v: number) { return fmtNum(v, 4); }
}

/* ================================================================== notices: warnings & de minimis */
@Component({
  selector: 'vc-run-notices',
  imports: [Callout, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (dm(); as d) {
      @if (d.candidates.length) {
        <vc-callout [tone]="d.excluded.length ? 'warn' : 'info'" icon="scale" class="n">
          <strong>De minimis ({{ d.threshold_pct | num: 0 }} % of the total benefit of {{ d.total_benefit_t_co2e | num: 1 }} tCO₂e).</strong>
          @if (d.excluded.length) { These sources together are below the threshold and were <strong>set to zero</strong> because the rules allow it: }
          @else { These sources together are below the threshold. They are still counted, because the rules don't exclude de minimis sources: }
          <span class="chips">@for (c of d.candidates; track c) { <span class="chip">{{ label(c) }} · {{ d.shares_pct[c] === null ? '—' : (d.shares_pct[c]! | num: 2) }} %</span> }</span>
        </vc-callout>
      }
    }
    @if (warnings().length) {
      <vc-callout tone="warn" icon="alert" class="n">
        <strong>{{ warnings().length === 1 ? 'Warning from the engine' : warnings().length + ' warnings from the engine' }}</strong>
        <ul>@for (w of warnings(); track $index) { <li>{{ w }}</li> }</ul>
      </vc-callout>
    }
  `,
  styles: [`
    .n{display:flex;margin-bottom:12px}
    ul{margin:4px 0 0;padding-left:18px} li{margin-top:2px}
    .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
    .chip{font-size:12px;padding:2px 8px;border-radius:999px;background:rgba(255,255,255,.7);border:1px solid var(--border)}
  `],
})
export class RunNotices {
  r = input.required<EngineResult>();
  dm = computed(() => this.r().de_minimis ?? null);
  warnings = computed(() => this.r().warnings ?? []);
  label = sourceLabel;
}
