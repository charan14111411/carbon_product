import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiError } from '../../core/api.service';
import { Icon } from '../../ui/icon';

interface Item { title: string; sub?: string; chips?: string[] }
interface View { tone: 'danger' | 'warn'; title: string; lead: string; what: string; items: Item[]; link?: { label: string; path: string; query?: Record<string, string> } }

const ANALYTE: Record<string, string> = {
  soc_pct: 'Soil organic carbon (%)', bulk_density_g_cm3: 'Bulk density', coarse_fraction: 'Stone (coarse) fraction',
};

/** Explains why the engine refused to calculate, item by item. */
@Component({
  selector: 'vc-calc-blocker',
  imports: [Icon, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (view(); as v) {
      <div class="box" [class]="v.tone" role="alert">
        <div class="top">
          <span class="ic"><vc-icon [name]="v.tone === 'danger' ? 'octagon' : 'alert'" [size]="18" /></span>
          <div class="t">
            <strong>{{ v.title }}</strong>
            <p>{{ v.lead }}</p>
          </div>
          <code class="code">{{ error()!.code }}</code>
        </div>
        @if (v.items.length) {
          <div class="list">
            <div class="lh">{{ v.what }} <span class="n">{{ v.items.length }}</span></div>
            <ul>
              @for (i of v.items.slice(0, 40); track $index) {
                <li>
                  <vc-icon name="corner-down-right" [size]="14" />
                  <div class="it">
                    <span class="it-t">{{ i.title }}</span>
                    @if (i.sub) { <span class="it-s">{{ i.sub }}</span> }
                  </div>
                  @for (c of i.chips ?? []; track c) { <span class="chip">{{ c }}</span> }
                </li>
              }
            </ul>
            @if (v.items.length > 40) { <p class="more">and {{ v.items.length - 40 }} more…</p> }
          </div>
        }
        @if (v.link) {
          <div class="foot"><a class="btn btn-secondary btn-sm" [routerLink]="v.link.path" [queryParams]="v.link.query ?? null">{{ v.link.label }}<vc-icon name="arrow-right" [size]="14" /></a></div>
        }
      </div>
    }
  `,
  styles: [`
    .box{border:1px solid;border-radius:var(--radius);overflow:hidden}
    .box.danger{border-color:#f3c7c3;background:var(--surface)} .box.warn{border-color:#f1dcae;background:var(--surface)}
    .top{display:flex;gap:12px;padding:14px 16px;align-items:flex-start}
    .danger .top{background:var(--danger-soft)} .warn .top{background:var(--warn-soft)}
    .ic{flex:none;color:var(--red-600);margin-top:1px} .warn .ic{color:var(--amber-600)}
    .t{flex:1;min-width:0} .t strong{display:block;font-weight:600} .t p{color:var(--stone-700);font-size:13.5px;margin-top:2px}
    .code{font-size:11px;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,.7);color:var(--stone-600);white-space:nowrap}
    .list{padding:10px 16px 12px}
    .lh{font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3);margin-bottom:4px}
    .n{display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--sand-200);color:var(--stone-700);font-size:11px;margin-left:4px}
    ul{list-style:none;margin:0;padding:0;max-height:280px;overflow:auto}
    li{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--stone-100);color:var(--text-3)}
    li:last-child{border-bottom:0}
    .it{flex:1;min-width:0;display:flex;flex-direction:column}
    .it-t{color:var(--text);font-size:13.5px;font-weight:500} .it-s{font-size:12.5px;color:var(--text-2)}
    .chip{font-size:11.5px;padding:2px 8px;border-radius:999px;background:var(--sand-100);border:1px solid var(--border);color:var(--stone-700);white-space:nowrap}
    .more{font-size:12.5px;color:var(--text-3);margin-top:6px}
    .foot{padding:0 16px 14px}
  `],
})
export class CalcBlocker {
  error = input<ApiError | null>(null);

  view = computed<View | null>(() => {
    const e = this.error();
    if (!e) return null;
    const d = e.details ?? {};
    switch (e.code) {
      case 'QA_BLOCKING': {
        const f = (d['findings'] as { rule_code: string; entity_type: string; entity_id: string; message: string }[]) ?? [];
        return {
          tone: 'danger', title: 'Blocking quality issues must be resolved first', lead: e.message,
          what: 'Open blocking issues',
          items: f.map(x => ({ title: x.message, sub: `${humanize(x.entity_type)} · ${x.entity_id.slice(0, 8)}`, chips: [x.rule_code] })),
          link: { label: 'Go to quality checks', path: '/app/quality' },
        };
      }
      case 'MISSING_LAB_RESULT': {
        const l = (d['layers'] as { layer: string; analytes: string[] }[]) ?? [];
        return {
          tone: 'danger', title: 'Some soil layers have no accepted lab results', lead: e.message,
          what: 'Layers waiting for results',
          items: l.map(x => ({ title: `Layer ${x.layer}`, chips: x.analytes.map(a => ANALYTE[a] ?? a) })),
          link: { label: 'Go to laboratory', path: '/app/lab' },
        };
      }
      case 'RULE_MISSING': {
        const items: Item[] = [];
        if (d['term']) items.push({ title: humanize(String(d['term'])), sub: 'No approved estimate exists for this period label' });
        else if (d['rule_key']) items.push({ title: humanize(String(d['rule_key'])), sub: 'Missing rule or input' });
        for (const k of ['layer', 'stratum']) if (d[k]) items.push({ title: `${humanize(k)} ${String(d[k])}` });
        return {
          tone: 'danger', title: 'A required rule or approved input is missing', lead: e.message + ' Nothing is assumed in its place.',
          what: 'What is missing', items,
          link: d['term'] ? { label: 'Go to decided terms', path: '/app/calculations', query: { tab: 'terms' } }
            : { label: 'Review methodology rules', path: '/app/methodology' },
        };
      }
      case 'VALIDATION_ERROR': {
        const f = (d['fields'] as { field: string; message: string }[]) ?? [];
        return { tone: 'warn', title: 'Some fields need attention', lead: e.message, what: 'Fields', items: f.map(x => ({ title: humanize(x.field), sub: x.message })) };
      }
      default: {
        const items: Item[] = [];
        for (const [k, v] of Object.entries(d)) {
          if (Array.isArray(v)) v.forEach(x => items.push({ title: typeof x === 'object' ? Object.values(x as object).join(' · ') : String(x), sub: humanize(k) }));
          else items.push({ title: humanize(k), sub: typeof v === 'object' ? JSON.stringify(v) : String(v) });
        }
        return { tone: e.status >= 500 ? 'danger' : 'warn', title: 'The calculation could not run', lead: e.message, what: 'Details', items };
      }
    }
  });
}

function humanize(s: string): string {
  const t = s.replace(/_/g, ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
}
