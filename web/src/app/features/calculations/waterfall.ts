import { fmtNum } from '../../core/format';
import { EngineResult } from './calc.types';

export interface Step {
  key: string; label: string; short: string; eq: string; delta: number; total: number;
  kind: 'start' | 'up' | 'down' | 'sub' | 'end'; help: string;
}

const C = { total: '#2a4d8f', sub: '#58625b', up: '#2f7249', down: '#c76329', neg: '#b3261e' };

/**
 * VM0042 v2.2 path from stock changes to VCUs (period totals):
 * ΔCO2_wp (Eq. 45) − ΔCO2_bsl (Eq. 44) + ΣΔE (Eq. 37) = ER + CR (Eq. 37, 40)
 * − leakage (Eq. 39/42) = ERR_NET (Eq. 43) − buffer on stock changes (Eq. 75–76) = VCU (Eq. 79).
 */
export function waterfallSteps(r: EngineResult): Step[] {
  const soc = r.soc;
  const sp = r.split ?? {};
  const steps: Step[] = [];
  const unc = soc ? `× ${fmtNum(soc.multiplier, 4)} uncertainty multiplier (UNC ${fmtNum(soc.unc_co2 * 100, 2)} %)` : '';
  const dwp = soc?.d_wp_t_co2e ?? r.dsoc_t_co2e;
  const dbsl = soc?.d_bsl_t_co2e ?? 0;
  const sumDe = r.emissions?.sum_delta_e_t_co2e ?? sp['sum_delta_e'] ?? 0;
  const lk = r.leakage?.total_t_co2e ?? ((sp['leakage_er'] ?? 0) + (sp['leakage_cr'] ?? 0));
  const bu = (sp['buffer_er'] ?? 0) + (sp['buffer_cr'] ?? 0);
  let run = dwp;
  steps.push({ key: 'wp', label: 'Project soil-carbon change', short: 'Project ΔCO₂', eq: 'Eq. 45', delta: dwp, total: dwp, kind: 'start',
    help: `Soil-carbon change in the project zones over the period, as CO₂ (× 44/12), ${unc}.` });
  const add = (key: string, label: string, short: string, eq: string, delta: number, help: string) => {
    run += delta;
    steps.push({ key, label, short, eq, delta, total: run, kind: delta >= 0 ? 'up' : 'down', help });
  };
  const sub = (key: string, label: string, short: string, eq: string, value: number, help: string) => {
    run = value;
    steps.push({ key, label, short, eq, delta: value, total: value, kind: 'sub', help });
  };
  add('bsl', 'Baseline soil-carbon change', 'Baseline ΔCO₂', 'Eq. 44', -dbsl,
    `What the soil would have done anyway (control sites or modelled baseline), ${unc}. Subtracted.`);
  add('de', 'Emission reductions ΣΔE', 'Emissions ΣΔE', 'Eq. 37', sumDe,
    'Fall in fuel, liming, fertiliser, livestock and burning emissions (baseline minus project). Negative if the project emits more.');
  sub('errg', 'Reductions + removals', 'ER + CR', 'Eq. 37, 40', (sp['er_gross'] ?? 0) + (sp['cr_gross'] ?? 0),
    'Gross emission reductions plus carbon removals before leakage.');
  add('lk', 'Leakage', 'Leakage', 'Eq. 39, 42', -lk,
    'Emissions caused outside the project, e.g. imported manure or compost (Eq. 33). Split between reductions and removals. Subtracted.');
  sub('net', 'Net reductions and removals', 'ERR net', 'Eq. 43', (sp['er_net'] ?? 0) + (sp['cr_net'] ?? 0),
    'ER_NET + CR_NET.');
  add('bu', 'Non-permanence buffer', 'Buffer', 'Eq. 75, 76', -bu,
    `${fmtNum(r.non_permanence_risk_pct, 1)} % of the soil-carbon part only is set aside against future reversal — never charged on emission reductions.`);
  steps.push({ key: 'vcu', label: 'Verified Carbon Units', short: 'VCUs', eq: 'Eq. 79', delta: r.credits_t_co2e, total: r.credits_t_co2e, kind: 'end',
    help: 'VCU_ER + VCU_CR: the credits that can be issued for this period.' });
  return steps;
}

/** ECharts option for a floating-bar waterfall that stays correct when values cross zero. */
export function waterfallOption(steps: Step[]): Record<string, unknown> {
  const basePos: number[] = [], baseNeg: number[] = [], visPos: unknown[] = [], visNeg: unknown[] = [];
  let prev = 0;
  const absolute = (s: Step) => s.kind === 'start' || s.kind === 'end' || s.kind === 'sub';
  steps.forEach(s => {
    let lo: number, hi: number;
    if (absolute(s)) { lo = Math.min(0, s.total); hi = Math.max(0, s.total); }
    else { lo = Math.min(prev, s.total); hi = Math.max(prev, s.total); }
    prev = s.total;
    const color = absolute(s) ? (s.total < 0 ? C.neg : s.kind === 'sub' ? C.sub : C.total) : s.kind === 'up' ? C.up : C.down;
    const bp = lo > 0 ? lo : 0;
    const bn = hi < 0 ? hi : 0;
    const vp = hi > 0 ? hi - bp : 0;
    const vn = lo < 0 ? lo - bn : 0;
    basePos.push(bp);
    baseNeg.push(bn);
    const labelOnPos = hi > 0 || lo >= 0;
    const text = absolute(s) ? fmtNum(s.total, 1) : (s.delta >= 0 ? '+' : '−') + fmtNum(Math.abs(s.delta), 1);
    visPos.push({ value: vp, itemStyle: { color, borderRadius: [3, 3, 0, 0] }, label: { show: labelOnPos, formatter: text } });
    visNeg.push({ value: vn, itemStyle: { color, borderRadius: [0, 0, 3, 3] }, label: { show: !labelOnPos, formatter: text } });
  });
  const ghost = { type: 'bar', stack: 'w', silent: true, itemStyle: { color: 'transparent' }, emphasis: { disabled: true }, tooltip: { show: false } };
  const vis = { type: 'bar', stack: 'w', barMaxWidth: 46, label: { fontSize: 11.5, color: '#414b45', fontWeight: 500 } };
  return {
    grid: { left: 8, right: 16, top: 30, bottom: 8, containLabel: true },
    legend: { show: false },
    tooltip: {
      trigger: 'axis', axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(47,114,73,.06)' } },
      formatter: (ps: { dataIndex: number }[]) => {
        const s = steps[ps[0]?.dataIndex ?? 0];
        const change = absolute(s) ? '' : `<div style="margin-top:4px">Change <b>${s.delta >= 0 ? '+' : '−'}${fmtNum(Math.abs(s.delta), 2)} tCO₂e</b></div>`;
        return `<div style="max-width:280px;white-space:normal"><b>${s.label}</b> <span style="color:#737c76">${s.eq}</span>${change}<div>Running total <b>${fmtNum(s.total, 2)} tCO₂e</b></div><div style="color:#737c76;margin-top:4px">${s.help}</div></div>`;
      },
    },
    xAxis: {
      type: 'category', data: steps.map(s => s.short),
      axisLabel: {
        interval: 0, fontSize: 11, color: '#414b45', lineHeight: 15,
        formatter: (v: string, i: number) => `${v}\n{eq|${steps[i]?.eq ?? ''}}`,
        rich: { eq: { fontSize: 10, color: '#737c76', fontFamily: 'IBM Plex Mono, monospace', lineHeight: 15 } },
      },
    },
    yAxis: { type: 'value', name: 'tCO₂e', nameTextStyle: { color: '#737c76', fontSize: 11, align: 'right' }, axisLabel: { formatter: (v: number) => fmtNum(v, 0) } },
    series: [
      { ...ghost, data: basePos },
      { ...ghost, data: baseNeg },
      { ...vis, data: visPos, label: { ...vis.label, position: 'top' } },
      { ...vis, data: visNeg, label: { ...vis.label, position: 'bottom' } },
    ],
  };
}
