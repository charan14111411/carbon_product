import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { tierMeta } from './shared';

/** Compact data-source tier chip: coloured numeral + label. */
@Component({
  selector: 'vc-tier',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="n">{{ meta().tier || '–' }}</span>@if (!compact()) {<span class="l">{{ meta().label }}</span>}`,
  host: {
    '[style.--c]': 'meta().color', '[style.--s]': 'meta().soft', '[style.--t]': 'meta().text',
    '[attr.title]': 'meta().short + " · " + meta().label + " — " + meta().explain',
  },
  styles: [`
    :host{display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 8px 0 3px;border-radius:999px;background:var(--s);
      color:var(--t);font-size:12px;font-weight:500;white-space:nowrap;line-height:1}
    .n{display:grid;place-items:center;width:16px;height:16px;border-radius:50%;background:var(--c);color:#fff;font:600 10px/1 var(--mono)}
    :host(:not(:has(.l))){padding:0 3px}
  `],
})
export class TierChip {
  tier = input<number | null | undefined>(0);
  compact = input(false);
  meta = computed(() => tierMeta(this.tier()));
}

/** A 0–1 quality score as a short bar with its number. */
@Component({
  selector: 'vc-quality',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="track"><span class="fill" [class]="tone()" [style.width.%]="w()"></span></span>
    <span class="v num">{{ value() === null || value() === undefined ? '—' : value()!.toFixed(2) }}</span>
  `,
  host: { '[attr.title]': '"Quality score " + (value() ?? "—") + " (0 = unusable, 1 = best)"' },
  styles: [`
    :host{display:inline-flex;align-items:center;gap:8px;min-width:96px}
    .track{flex:1;height:6px;border-radius:3px;background:var(--sand-200);overflow:hidden;min-width:48px}
    .fill{display:block;height:100%;border-radius:3px;background:var(--forest-500)}
    .fill.mid{background:var(--teal-600)} .fill.low{background:var(--amber-600)}
    .v{font-size:12px;color:var(--stone-700);min-width:30px;text-align:right}
  `],
})
export class QualityBar {
  value = input<number | null | undefined>(null);
  w = computed(() => Math.max(0, Math.min(1, this.value() ?? 0)) * 100);
  tone = computed(() => ((this.value() ?? 0) >= 0.8 ? 'hi' : (this.value() ?? 0) >= 0.55 ? 'mid' : 'low'));
}
