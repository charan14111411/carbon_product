import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Icon } from '../../ui/icon';

/** Anything an intelligence endpoint returns carries these labels (intelligence/domain.py `wall`). */
export interface Walled { credit_eligible?: boolean; credit_eligible_reason?: string; data_class?: string }

export const WALL_TEXT = 'Informing only — model outputs never enter credit calculations';
const DEFAULT_REASON = 'Credited soil carbon comes only from accepted lab results. Remote-sensing SOC could only be credited via VT0014 digital soil mapping, which this platform does not use.';

/**
 * The informing wall, stated once per screen: a calm banner explaining that intelligence outputs
 * (predictions, maps, plans, estimates, features) are never used in a credit calculation.
 */
@Component({
  selector: 'vc-informing-wall',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="ic"><vc-icon name="lock" [size]="16" /></span>
    <div class="tx">
      <div class="t"><strong>{{ text }}</strong><code>credit_eligible: false</code></div>
      <p>{{ fallback }}<ng-content /></p>
    </div>
    <span class="ref" [attr.title]="reason() || null">VM0042 §8.2.1.4 · App. 4 fn. 59</span>
  `,
  styles: [`
    :host{display:flex;align-items:flex-start;gap:12px;padding:12px 16px;border:1px solid var(--border);border-radius:var(--radius);
      background:var(--surface);box-shadow:var(--shadow-sm);margin-bottom:20px}
    .ic{display:grid;place-items:center;flex:none;width:30px;height:30px;border-radius:8px;background:var(--dc-modelled-bg);color:var(--dc-modelled)}
    .tx{flex:1;min-width:0}
    .t{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;font-size:13.5px}
    code{font:500 11.5px/1 var(--mono);padding:4px 6px;border-radius:4px;background:var(--sand-100);color:var(--stone-700)}
    p{margin-top:3px;font-size:12.5px;color:var(--text-2);line-height:1.45}
    .ref{flex:none;font:500 11px/1 var(--mono);padding:5px 8px;border-radius:999px;background:var(--sand-100);color:var(--stone-600);white-space:nowrap}
    @media (max-width:900px){.ref{display:none}}
  `],
})
export class InformingWall {
  reason = input<string | null | undefined>('');
  text = WALL_TEXT;
  fallback = DEFAULT_REASON;
}

/** A quiet inline reminder, for a card whose response says credit_eligible: false. Renders nothing otherwise. */
@Component({
  selector: 'vc-wall-chip',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (show()) {
      <span class="chip" [attr.title]="title()"><vc-icon name="lock" [size]="12" />Informing only</span>
    }
  `,
  host: { style: 'display:inline-flex' },
  styles: [`
    .chip{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 8px;border-radius:999px;border:1px solid var(--border);
      background:var(--surface-2);color:var(--stone-600);font-size:11.5px;font-weight:500;white-space:nowrap;cursor:help}
  `],
})
export class WallChip {
  data = input<Walled | null | undefined>(null);
  show = computed(() => this.data()?.credit_eligible === false);
  title = computed(() => `${WALL_TEXT} (credit_eligible: false). ${this.data()?.credit_eligible_reason ?? DEFAULT_REASON}`);
}
