import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { Icon } from '../../ui/icon';
import { ErrorBox, Loading } from '../../ui/kit';
import { Readiness } from './calc.types';
import { NumPipe } from '../../core/format';

/** Project readiness: a checklist of everything a credible calculation depends on. */
@Component({
  selector: 'vc-readiness-panel',
  imports: [Icon, Loading, ErrorBox, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      @if (loading()) {
        <vc-loading [rows]="3" />
      } @else if (error()) {
        <div class="card-body"><vc-error title="Couldn't check readiness" [message]="error()!" /></div>
      } @else if (data(); as d) {
        <div class="head">
          <div class="ring" [style.--p]="d.score_pct" [class]="tone()">
            <span class="num">{{ d.score_pct | num: 0 }}<small>%</small></span>
          </div>
          <div class="t">
            <div class="eyebrow">Calculation readiness</div>
            <h2>{{ headline() }}</h2>
            <p class="muted small">
              {{ counts().ok }} ready · {{ counts().warning }} need attention · {{ counts().blocking }} blocking.
              A calculation refuses to run while any blocking quality issue is open; warnings are allowed but will be visible to the verifier.
            </p>
          </div>
          <button class="btn btn-ghost btn-sm" (click)="manual.set(!open())">
            {{ open() ? 'Hide checklist' : 'Show checklist' }}
            <vc-icon [name]="open() ? 'chevron-down' : 'chevron-right'" [size]="14" />
          </button>
        </div>
        @if (open()) {
          <ul class="dims">
            @for (dm of d.dimensions; track dm.key) {
              <li [class]="dm.status">
                <span class="ic"><vc-icon [name]="icon(dm.status)" [size]="15" [stroke]="2" /></span>
                <div class="txt"><strong>{{ dm.label }}</strong><span>{{ dm.detail }}</span></div>
                <span class="st">{{ statusLabel(dm.status) }}</span>
              </li>
            }
          </ul>
        }
      }
    </section>
  `,
  styles: [`
    .head{display:flex;align-items:center;gap:18px;padding:18px 20px}
    .t{flex:1;min-width:0}
    .eyebrow{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text-3)}
    h2{margin:2px 0 4px}
    .ring{--c:var(--forest-500);flex:none;width:64px;height:64px;border-radius:50%;display:grid;place-items:center;
      background:conic-gradient(var(--c) calc(var(--p) * 1%), var(--sand-200) 0)}
    .ring.warn{--c:var(--amber-600)} .ring.danger{--c:var(--red-600)}
    .ring .num{display:flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:50%;background:var(--surface);font-weight:600;font-size:16px}
    .ring small{font-size:10px;color:var(--text-3);margin-left:1px;margin-top:3px}
    .dims{list-style:none;margin:0;padding:4px 20px 16px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 28px;border-top:1px solid var(--border)}
    @media (max-width: 1000px){.dims{grid-template-columns:1fr}}
    li{display:flex;align-items:flex-start;gap:10px;padding:11px 0;border-bottom:1px solid var(--stone-100)}
    .ic{display:grid;place-items:center;flex:none;width:24px;height:24px;border-radius:50%;margin-top:1px}
    li.ok .ic{background:var(--ok-soft);color:var(--forest-600)}
    li.warning .ic{background:var(--warn-soft);color:var(--amber-600)}
    li.blocking .ic{background:var(--danger-soft);color:var(--red-600)}
    .txt{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}
    .txt strong{font-weight:500;font-size:13.5px}
    .txt span{font-size:12.5px;color:var(--text-2)}
    .st{font-size:11.5px;font-weight:500;color:var(--text-3);white-space:nowrap;padding-top:3px}
    li.blocking .st{color:var(--red-600)} li.warning .st{color:var(--amber-600)}
  `],
})
export class ReadinessPanel {
  data = input<Readiness | null>(null);
  loading = input(false);
  error = input<string | null>(null);
  protected manual = signal<boolean | null>(null);
  open = computed(() => this.manual() ?? (this.counts().blocking + this.counts().warning > 0));

  counts = computed(() => {
    const c = { ok: 0, warning: 0, blocking: 0 };
    for (const d of this.data()?.dimensions ?? []) c[d.status]++;
    return c;
  });
  tone = computed(() => (this.counts().blocking ? 'danger' : this.counts().warning ? 'warn' : 'ok'));
  headline = computed(() => {
    const c = this.counts();
    if (c.blocking) return `${c.blocking} item${c.blocking > 1 ? 's' : ''} must be resolved before credits can be issued`;
    if (c.warning) return 'Ready to calculate, with items to tidy up';
    return 'Everything is in place';
  });

  icon(s: string) { return s === 'ok' ? 'check' : s === 'warning' ? 'alert' : 'x'; }
  statusLabel(s: string) { return s === 'ok' ? 'Ready' : s === 'warning' ? 'Attention' : 'Blocking'; }
}
