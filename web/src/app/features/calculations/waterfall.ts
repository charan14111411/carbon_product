import { fmtNum } from '../../core/format';
import { EngineResult } from './calc.types';

export interface Step { key: string; label: string; short: string; delta: number; total: number; kind: 'start' | 'up' | 'down' | 'end'; help: string }

const C = { total: '#2a4d8f', up: '#2f7249', down: '#c76329', neg: '#b3261e' };

export function waterfallSteps(r: EngineResult): Step[] {
  const tv: Record<string, number> = Object.fromEntries((r.terms ?? []).map(t => [t.term, t.value_t_co2e]));
  const steps: Step[] = [];
  let run = r.dsoc_t_co2e;
  steps.push({ key: 'dsoc', label: 'Soil-carbon change', short: 'SOC change', delta: run, total: run, kind: 'start',
    help: 'Measured change in soil organic carbon across all project zones, area-weighted and converted to CO₂ (× 44/12).' });
  const add = (key: string, label: string, short: string, delta: number, help: string) => {
    run += delta;
    steps.push({ key, label, short, delta, total: run, kind: delta >= 0 ? 'up' : 'down', help });
  };
  add('bs', 'Baseline-scenario change', 'Baseline scenario', -(tv['baseline_scenario'] ?? 0), 'What would have happened anyway. Subtracted.');
  add('be', 'Baseline emissions', 'Baseline emissions', tv['baseline_emissions'] ?? 0, 'Emissions the old practice would have caused. Added back.');
  add('pe', 'Project emissions', 'Project emissions', -(tv['project_emissions'] ?? 0), 'Emissions the new practice causes. Subtracted.');
  add('lk', 'Leakage', 'Leakage', -(tv['leakage'] ?? 0), 'Emissions displaced outside the project. Subtracted.');
  add('ud', 'Uncertainty deduction', 'Uncertainty', -r.uncertainty_deduction_t_co2e, 'A conservative deduction so the credited figure is very likely not an over-estimate.');
  add('bf', 'Non-permanence buffer', 'Buffer', -r.buffer_t_co2e, `${fmtNum(r.non_permanence_risk_pct, 1)}% of the result set aside against future reversal.`);
  steps.push({ key: 'net', label: 'Net credits', short: 'Net credits', delta: r.credits_t_co2e, total: r.credits_t_co2e, kind: 'end',
    help: 'Credits that can be issued for this period: reductions plus removals.' });
  return steps;
}

/** ECharts option for a floating-bar waterfall that stays correct when values cross zero. */
export function waterfallOption(steps: Step[]): Record<string, unknown> {
  const basePos: number[] = [], baseNeg: number[] = [], visPos: unknown[] = [], visNeg: unknown[] = [];
  let prev = 0;
  steps.forEach((s, i) => {
    let lo: number, hi: number;
    if (s.kind === 'start' || s.kind === 'end') { lo = Math.min(0, s.total); hi = Math.max(0, s.total); }
    else { lo = Math.min(prev, s.total); hi = Math.max(prev, s.total); }
    prev = s.total;
    const color = s.kind === 'end' ? (s.total < 0 ? C.neg : C.total) : s.kind === 'start' ? (s.total < 0 ? C.neg : C.total) : s.kind === 'up' ? C.up : C.down;
    const bp = lo > 0 ? lo : 0;
    const bn = hi < 0 ? hi : 0;
    const vp = hi > 0 ? hi - bp : 0;
    const vn = lo < 0 ? lo - bn : 0;
    basePos.push(bp);
    baseNeg.push(bn);
    const labelOnPos = hi > 0 || lo >= 0;
    const text = s.kind === 'start' || s.kind === 'end' ? fmtNum(s.total, 1) : (s.delta >= 0 ? '+' : '−') + fmtNum(Math.abs(s.delta), 1);
    visPos.push({ value: vp, itemStyle: { color, borderRadius: [3, 3, 0, 0] }, label: { show: labelOnPos, formatter: text } });
    visNeg.push({ value: vn, itemStyle: { color, borderRadius: [0, 0, 3, 3] }, label: { show: !labelOnPos, formatter: text } });
    void i;
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
        const change = s.kind === 'start' || s.kind === 'end' ? '' : `<div style="margin-top:4px">Change <b>${s.delta >= 0 ? '+' : '−'}${fmtNum(Math.abs(s.delta), 2)} tCO₂e</b></div>`;
        return `<div style="max-width:260px;white-space:normal"><b>${s.label}</b>${change}<div>Running total <b>${fmtNum(s.total, 2)} tCO₂e</b></div><div style="color:#737c76;margin-top:4px">${s.help}</div></div>`;
      },
    },
    xAxis: { type: 'category', data: steps.map(s => s.short), axisLabel: { interval: 0, fontSize: 11, color: '#58625b', width: 80, overflow: 'break' } },
    yAxis: { type: 'value', name: 'tCO₂e', nameTextStyle: { color: '#737c76', fontSize: 11, align: 'right' }, axisLabel: { formatter: (v: number) => fmtNum(v, 0) } },
    series: [
      { ...ghost, data: basePos },
      { ...ghost, data: baseNeg },
      { ...vis, data: visPos, label: { ...vis.label, position: 'top' } },
      { ...vis, data: visNeg, label: { ...vis.label, position: 'bottom' } },
    ],
  };
}
