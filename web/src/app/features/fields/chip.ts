import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CATEGORY_TONE } from './field-data';

/** Small squared label for categories, sources and land uses. `tone` or `cat` picks the colour. */
@Component({
  selector: 'vc-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (swatch()) { <span class="sw" [style.background]="swatch()"></span> }<ng-content />`,
  host: { '[class]': '"chip t-" + t()' },
  styles: [`
    :host{display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 8px;border-radius:6px;font-size:12px;font-weight:500;
      white-space:nowrap;line-height:1;border:1px solid var(--stone-200);background:var(--stone-100);color:var(--stone-700)}
    .sw{width:8px;height:8px;border-radius:2px;flex:none}
    :host(.t-forest){background:var(--forest-50);border-color:var(--forest-200);color:var(--forest-700)}
    :host(.t-clay){background:var(--clay-50);border-color:var(--clay-100);color:var(--clay-700)}
    :host(.t-amber){background:var(--amber-100);border-color:#f1dcae;color:var(--amber-600)}
    :host(.t-sky){background:var(--sky-100);border-color:#c9dcf0;color:var(--sky-600)}
    :host(.t-teal){background:var(--teal-100);border-color:#bfe3e6;color:var(--teal-600)}
    :host(.t-violet){background:var(--violet-100);border-color:#d8d0f0;color:var(--violet-600)}
    :host(.t-red){background:var(--red-100);border-color:#f3c7c3;color:var(--red-600)}
    :host(.t-outline){background:var(--surface);border-color:var(--border-strong);color:var(--stone-700)}
  `],
})
export class Chip {
  tone = input<string>('');
  cat = input<string>('');
  swatch = input<string>('');
  t = computed(() => this.tone() || CATEGORY_TONE[this.cat()] || 'neutral');
}
