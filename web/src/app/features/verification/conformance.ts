import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { Icon } from '../../ui/icon';
import { Empty } from '../../ui/kit';
import { ConformanceItem } from './verification.types';

type Filter = 'all' | 'met' | 'not_met' | 'n/a';

/** VM0042 v2.2 conformance checklist: each requirement the package can evidence. */
@Component({
  selector: 'vc-conformance',
  imports: [Icon, Empty],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!items().length) {
      <vc-empty icon="list-checks" title="No conformance checklist in this package"
        text="Packages issued before VM0042 v2.2 support don't carry the checklist. Issue a new package version from the approved calculation." />
    } @else {
      <div class="bar">
        <div class="meter" [attr.aria-label]="counts().met + ' of ' + counts().applicable + ' applicable requirements met'">
          <span class="m" [style.flex-grow]="counts().met"></span>
          <span class="x" [style.flex-grow]="counts().not_met"></span>
          <span class="n" [style.flex-grow]="counts().na"></span>
        </div>
        <div class="sum">
          <strong class="num">{{ counts().met }} of {{ counts().applicable }}</strong> applicable requirements met
          @if (counts().not_met) { · <span class="bad">{{ counts().not_met }} not met</span> }
          · {{ counts().na }} not applicable
        </div>
      </div>
      <div class="filters">
        @for (f of filters; track f.key) {
          <button type="button" [class.on]="filter() === f.key" (click)="filter.set(f.key)">{{ f.label }} <span class="c">{{ countOf(f.key) }}</span></button>
        }
      </div>
      <ul class="list">
        @for (i of shown(); track $index) {
          <li [class]="cls(i.status)">
            <span class="ic"><vc-icon [name]="icon(i.status)" [size]="14" [stroke]="2.2" /></span>
            <div class="t">
              <div class="rq">{{ i.requirement }}</div>
              <div class="ev"><vc-icon name="corner-down-right" [size]="12" />{{ i.evidence || 'No evidence recorded.' }}</div>
            </div>
            <code class="ref">{{ i.ref }}</code>
            <span class="st">{{ label(i.status) }}</span>
            @if (askable()) {
              <button type="button" class="btn btn-ghost btn-sm ask" (click)="ask.emit(i)" title="Raise a question on this requirement"><vc-icon name="question" [size]="14" /></button>
            }
          </li>
        } @empty {
          <li class="none">Nothing in this filter.</li>
        }
      </ul>
    }
  `,
  styles: [`
    .bar{display:flex;align-items:center;gap:16px;padding:16px 20px;border-bottom:1px solid var(--border);flex-wrap:wrap}
    .meter{display:flex;gap:2px;height:10px;flex:1;min-width:200px;max-width:420px;border-radius:5px;overflow:hidden;background:var(--sand-200)}
    .meter span{flex-basis:0;min-width:0}
    .m{background:var(--forest-500)} .x{background:var(--red-600)} .n{background:var(--stone-300)}
    .sum{font-size:13px;color:var(--stone-700)} .bad{color:var(--red-600);font-weight:500}
    .filters{display:flex;gap:6px;padding:12px 20px;border-bottom:1px solid var(--border);flex-wrap:wrap}
    .filters button{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:999px;border:1px solid var(--border);background:var(--surface);font:500 12.5px var(--font);color:var(--stone-700);cursor:pointer}
    .filters button.on{background:var(--stone-800);border-color:var(--stone-800);color:#fff}
    .filters .c{font-size:11px;opacity:.75}
    .list{list-style:none;margin:0;padding:0 20px 8px}
    li{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid var(--stone-100)}
    li:last-child{border-bottom:0}
    .ic{flex:none;display:grid;place-items:center;width:22px;height:22px;border-radius:50%;margin-top:1px}
    li.met .ic{background:var(--ok-soft);color:var(--forest-600)}
    li.not_met .ic{background:var(--danger-soft);color:var(--red-600)}
    li.na .ic{background:var(--stone-100);color:var(--stone-500)}
    .t{flex:1;min-width:0}
    .rq{font-weight:500;font-size:13.5px}
    li.na .rq{color:var(--text-2)}
    .ev{display:flex;gap:6px;align-items:flex-start;font-size:12.5px;color:var(--text-2);margin-top:2px}
    .ev vc-icon{margin-top:3px;color:var(--stone-400)}
    .ref{flex:none;font-size:11px;padding:2px 7px;border-radius:5px;background:var(--sand-100);border:1px solid var(--border);color:var(--stone-600);white-space:nowrap;margin-top:1px}
    .st{flex:none;width:72px;text-align:right;font-size:12px;font-weight:600;margin-top:2px}
    li.met .st{color:var(--forest-600)} li.not_met .st{color:var(--red-600)} li.na .st{color:var(--text-3)}
    .ask{flex:none;width:30px;padding:0}
    .none{color:var(--text-3);font-size:13px}
    @media (max-width: 800px){.ref{display:none}}
  `],
})
export class Conformance {
  items = input<ConformanceItem[]>([]);
  askable = input(false);
  ask = output<ConformanceItem>();
  filter = signal<Filter>('all');
  filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' }, { key: 'not_met', label: 'Not met' }, { key: 'met', label: 'Met' }, { key: 'n/a', label: 'Not applicable' },
  ];
  counts = computed(() => {
    const c = { met: 0, not_met: 0, na: 0, applicable: 0 };
    for (const i of this.items()) {
      if (i.status === 'met') c.met++;
      else if (i.status === 'not_met') c.not_met++;
      else c.na++;
    }
    c.applicable = c.met + c.not_met;
    return c;
  });
  shown = computed(() => {
    const f = this.filter();
    const list = f === 'all' ? this.items() : this.items().filter(i => (f === 'n/a' ? i.status !== 'met' && i.status !== 'not_met' : i.status === f));
    // not met first so problems surface
    const rank = (s: string) => (s === 'not_met' ? 0 : s === 'met' ? 1 : 2);
    return f === 'all' ? [...list].sort((a, b) => rank(a.status) - rank(b.status)) : list;
  });
  countOf(k: Filter) {
    const c = this.counts();
    return k === 'all' ? this.items().length : k === 'met' ? c.met : k === 'not_met' ? c.not_met : c.na;
  }
  cls(s: string) { return s === 'met' ? 'met' : s === 'not_met' ? 'not_met' : 'na'; }
  icon(s: string) { return s === 'met' ? 'check' : s === 'not_met' ? 'x' : 'minus'; }
  label(s: string) { return s === 'met' ? 'Met' : s === 'not_met' ? 'Not met' : 'N/a'; }
}
