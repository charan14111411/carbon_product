import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, effect, input, viewChild } from '@angular/core';
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts';
import {
  DatasetComponent, GridComponent, LegendComponent, MarkLineComponent, TooltipComponent, MarkAreaComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart, LineChart, PieChart, ScatterChart, GridComponent, TooltipComponent, LegendComponent, DatasetComponent,
  MarkLineComponent, MarkAreaComponent, CanvasRenderer,
]);

export const PALETTE = ['#2f7249', '#c76329', '#1f5f99', '#9a6200', '#5b47a8', '#0e7280', '#86b797', '#e7a57b'];

const BASE: echarts.EChartsCoreOption = {
  color: PALETTE,
  textStyle: { fontFamily: 'IBM Plex Sans, system-ui, sans-serif', color: '#414b45' },
  grid: { left: 8, right: 16, top: 28, bottom: 8, containLabel: true },
  tooltip: {
    trigger: 'axis', backgroundColor: '#ffffff', borderColor: '#e3dfd6', borderWidth: 1, padding: [8, 10],
    textStyle: { color: '#1d2420', fontSize: 12 }, extraCssText: 'box-shadow:0 8px 24px rgba(16,41,28,.12);border-radius:8px;',
  },
  legend: { top: 0, right: 0, icon: 'roundRect', itemWidth: 10, itemHeight: 10, textStyle: { fontSize: 12, color: '#58625b' } },
  xAxis: { axisLine: { lineStyle: { color: '#dcd6c9' } }, axisTick: { show: false }, axisLabel: { color: '#737c76', fontSize: 11 } },
  yAxis: { splitLine: { lineStyle: { color: '#eeece6' } }, axisLabel: { color: '#737c76', fontSize: 11 } },
};

function merge(a: any, b: any): any {
  if (Array.isArray(b) || typeof b !== 'object' || b === null) return b;
  const out: any = { ...a };
  for (const k of Object.keys(b)) {
    const bv = b[k];
    if (Array.isArray(bv) && a?.[k] && !Array.isArray(a[k]) && typeof a[k] === 'object') out[k] = bv.map((x: any) => merge(a[k], x));
    else out[k] = k in (a ?? {}) ? merge(a[k], bv) : bv;
  }
  return out;
}

/** ECharts with the product's visual defaults. Pass a normal ECharts option. */
@Component({
  selector: 'vc-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #el class="c"></div>`,
  styles: [':host{display:block} .c{width:100%;height:100%}'],
  host: { '[style.height]': 'height()' },
})
export class Chart implements AfterViewInit, OnDestroy {
  option = input.required<echarts.EChartsCoreOption>();
  height = input<string>('260px');
  private el = viewChild.required<ElementRef<HTMLDivElement>>('el');
  private chart?: echarts.ECharts;
  private ro?: ResizeObserver;

  constructor() {
    effect(() => {
      const opt = this.option();
      this.chart?.setOption(merge(BASE, opt), true);
    });
  }

  ngAfterViewInit(): void {
    this.chart = echarts.init(this.el().nativeElement, undefined, { renderer: 'canvas' });
    this.chart.setOption(merge(BASE, this.option()), true);
    this.ro = new ResizeObserver(() => this.chart?.resize());
    this.ro.observe(this.el().nativeElement);
  }

  ngOnDestroy(): void {
    this.ro?.disconnect();
    this.chart?.dispose();
  }
}
