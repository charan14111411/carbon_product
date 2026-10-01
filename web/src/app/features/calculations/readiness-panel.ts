import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../ui/icon';
import { ErrorBox, Loading } from '../../ui/kit';
import { Readiness, ReadinessDim } from './calc.types';
import { NumPipe } from '../../core/format';
import { READINESS_GROUPS, READINESS_LINK } from './vm0042';

/** Project readiness: the 17 VM0042 checks a credible calculation depends on, grouped. */
@Component({
  selector: 'vc-readiness-panel',
  imports: [Icon, Loading, ErrorBox, NumPipe, RouterLink],
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
            <div class="eyebrow">Calculation readiness · {{ d.dimensions.length }} checks</div>
            <h2>{{ headline() }}</h2>
            <p class="muted small">
              {{ counts().ok }} ready · {{ counts().warning }} need attention · {{ counts().blocking }} blocking.
              A calculation refuses to run while any blocking quality issue is open; warnings are allowed but visible to the verifier.
            </p>
          </div>
          <div class="chips">
            @for (g of groups(); track g.key) {
              <span class="gchip" [class]="g.tone" [title]="g.label"><span class="gd"></span>{{ g.label }} <b class="num">{{ g.ok }}/{{ g.items.length }}</b></span>
            }
          </div>
          <button class="btn btn-ghost btn-sm" (click)="manual.set(!open())">
            {{ open() ? 'Hide checklist' : 'Show checklist' }}
            <vc-icon [name]="open() ? 'chevron-down' : 'chevron-right'" [size]="14" />
          </button>
        </div>
        @if (open()) {
          <div class="groups">
            @for (g of groups(); track g.key) {
              @if (g.items.length) {
                <div class="grp">
                  <div class="gh"><span>{{ g.label }}</span><span class="subtle num">{{ g.ok }} of {{ g.items.length }} ready</span></div>
                  <ul class="dims">
                    @for (dm of g.items; track dm.key) {
                      <li [class]="dm.status">
                        <span class="ic"><vc-icon [name]="icon(dm.status)" [size]="14" [stroke]="2" /></span>
                        <div class="txt">
                          <strong>{{ dm.label }}</strong>
                          <span>{{ dm.detail }}</span>
                        </div>
                        @if (dm.status !== 'ok' && link(dm.key); as l) {
                          <a class="go" [routerLink]="l.path" [queryParams]="l.query ?? null">{{ l.label }}<vc-icon name="arrow-right" [size]="12" /></a>
                        } @else {
                          <span class="st">{{ statusLabel(dm.status) }}</span>
                        }
                      </li>
                    }
                  </ul>
                </div>
              }
            }
          </div>
        }
      }
    </section>
  `,
  styles: [`
    .head{display:flex;align-items:center;gap:18px;padding:18px 20px;flex-wrap:wrap}
    .t{flex:1;min-width:260px}
    .eyebrow{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text-3)}
    h2{margin:2px 0 4px}
    .ring{--c:var(--forest-500);flex:none;width:64px;height:64px;border-radius:50%;display:grid;place-items:center;
      background:conic-gradient(var(--c) calc(var(--p) * 1%), var(--sand-200) 0)}
    .ring.warn{--c:var(--amber-600)} .ring.danger{--c:var(--red-600)}
    .ring .num{display:flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:50%;background:var(--surface);font-weight:600;font-size:16px}
    .ring small{font-size:10px;color:var(--text-3);margin-left:1px;margin-top:3px}
    .chips{display:flex;gap:6px;flex-wrap:wrap;max-width:420px}
    .gchip{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border-radius:999px;font-size:12px;border:1px solid var(--border);background:var(--surface-2);color:var(--stone-700)}
    .gchip b{font-weight:600}
    .gd{width:7px;height:7px;border-radius:50%;background:var(--forest-500)}
    .gchip.warning .gd{background:var(--amber-600)} .gchip.blocking .gd{background:var(--red-600)}
    .groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 28px;padding:4px 20px 16px;border-top:1px solid var(--border)}
    @media (max-width: 1000px){.groups{grid-template-columns:1fr}}
    .grp{padding-top:12px}
    .gh{display:flex;justify-content:space-between;font-size:11.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);padding-bottom:4px;border-bottom:1px solid var(--border)}
    .gh .subtle{font-weight:500;letter-spacing:0;text-transform:none}
    .dims{list-style:none;margin:0;padding:0}
    li{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--stone-100)}
    li:last-child{border-bottom:0}
    .ic{display:grid;place-items:center;flex:none;width:22px;height:22px;border-radius:50%;margin-top:1px}
    li.ok .ic{background:var(--ok-soft);color:var(--forest-600)}
    li.warning .ic{background:var(--warn-soft);color:var(--amber-600)}
    li.blocking .ic{background:var(--danger-soft);color:var(--red-600)}
    .txt{flex:1;min-width:0;display:flex;flex-direction:column;gap:1px}
    .txt strong{font-weight:500;font-size:13.5px}
    .txt span{font-size:12.5px;color:var(--text-2)}
    .st{font-size:11.5px;font-weight:500;color:var(--text-3);white-space:nowrap;padding-top:3px}
    .go{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:500;white-space:nowrap;padding:3px 8px;border-radius:6px;border:1px solid var(--border);background:var(--surface)}
    .go:hover{text-decoration:none;border-color:var(--forest-400);background:var(--forest-50)}
    li.blocking .go{border-color:#f3c7c3;color:var(--red-600)}
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
  groups = computed(() => {
    const dims = this.data()?.dimensions ?? [];
    const used = new Set<string>();
    const out = READINESS_GROUPS.map(g => {
      const items = g.keys.map(k => dims.find(d => d.key === k)).filter((d): d is ReadinessDim => !!d);
      items.forEach(i => used.add(i.key));
      return { ...g, items };
    });
    const rest = dims.filter(d => !used.has(d.key));
    if (rest.length) out.push({ key: 'other', label: 'Other', keys: [], items: rest });
    return out.map(g => ({
      ...g, ok: g.items.filter(i => i.status === 'ok').length,
      tone: g.items.some(i => i.status === 'blocking') ? 'blocking' : g.items.some(i => i.status === 'warning') ? 'warning' : 'ok',
    }));
  });
  tone = computed(() => (this.counts().blocking ? 'danger' : this.counts().warning ? 'warn' : 'ok'));
  headline = computed(() => {
    const c = this.counts();
    if (c.blocking) return `${c.blocking} item${c.blocking > 1 ? 's' : ''} must be resolved before credits can be issued`;
    if (c.warning) return 'Ready to calculate, with items to tidy up';
    return 'Everything is in place';
  });

  link(k: string) { return READINESS_LINK[k] ?? null; }
  icon(s: string) { return s === 'ok' ? 'check' : s === 'warning' ? 'alert' : 'x'; }
  statusLabel(s: string) { return s === 'ok' ? 'Ready' : s === 'warning' ? 'Attention' : 'Blocking'; }
}
