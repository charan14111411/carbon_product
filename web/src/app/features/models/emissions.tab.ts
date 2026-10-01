import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { KIT } from '../../ui/kit';
import { Remote, daysAgo, isoDate } from '../supporting/shared';
import { WallChip } from './informing-wall';

interface Estimate {
  project_id: string; start: string; end: string; factors: Record<string, { value: number; source: string }>;
  by_scenario: Record<string, { records: number; n_kg: number; t_co2e: number }>; records_missing_n: string[];
  data_class: string; note: string; rule_pack: string | null; credit_eligible?: boolean; credit_eligible_reason?: string;
}

@Component({
  selector: 'vc-emissions-tab',
  imports: [...KIT, FormsModule, RouterLink, NumPipe, DayPipe, WallChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card win">
      <div class="wl">
        <h3>Fertiliser nitrous-oxide estimate</h3>
        <p class="small muted">Estimates N₂O emissions from synthetic fertiliser records, using only emission factors from the approved rule pack. Nothing is assumed when a factor is missing.</p>
      </div>
      <div class="field"><label for="es">From</label><input id="es" type="date" class="input" [ngModel]="start()" (ngModelChange)="start.set($event)" /></div>
      <div class="field"><label for="ee">To</label><input id="ee" type="date" class="input" [ngModel]="end()" (ngModelChange)="end.set($event)" /></div>
    </section>

    @if (est.loading()) {
      <div class="card"><vc-loading [rows]="4" /></div>
    } @else if (est.error(); as e) {
      @if (e.code === 'RULE_MISSING') {
        <section class="card missing">
          <div class="mi"><vc-icon name="scale" [size]="22" /></div>
          <div class="mb">
            <h3>Emission factors not configured in the rule pack</h3>
            <p class="muted">{{ e.message }}</p>
            @if (factorKeys(e).length) {
              <div class="keys"><span class="small subtle">Needed</span>@for (k of factorKeys(e); track k) { <code>{{ k }}</code> }</div>
            }
            <ol class="steps small">
              <li>A methodology scientist adds the factor{{ factorKeys(e).length === 1 ? '' : 's' }} with a cited source to the project's rule pack.</li>
              <li>A second reviewer approves the new rule-pack version.</li>
              <li>Come back here — the estimate is worked out from the approved values.</li>
            </ol>
            @if (canRules()) { <a class="btn btn-secondary btn-sm" routerLink="/app/methodology"><vc-icon name="scale" [size]="14" />Open methodology rules</a> }
          </div>
        </section>
      } @else {
        <vc-error title="Couldn't make an estimate" [message]="e.message" />
      }
    } @else if (est.data(); as d) {
      <div class="grid grid-3">
        @for (s of scenarios(); track s.key) {
          <div class="card card-pad sc">
            <div class="row"><span class="label">{{ s.key === 'baseline' ? 'Baseline scenario' : 'Project scenario' }}</span><span class="spacer"></span><vc-dc cls="MODELLED" /></div>
            <div class="big num">{{ s.v.t_co2e | num: 3 }}<span>tCO₂e</span></div>
            <div class="small muted num">{{ s.v.n_kg | num: 1 }} kg N from {{ s.v.records }} record{{ s.v.records === 1 ? '' : 's' }}</div>
          </div>
        } @empty {
          <div class="card card-pad sc"><span class="label">No fertiliser records</span>
            <p class="small muted" style="margin-top:6px">No synthetic fertiliser was recorded between {{ d.start | day }} and {{ d.end | day }}.</p></div>
        }
        @if (d.records_missing_n.length) {
          <div class="card card-pad sc warnc">
            <span class="label">Records left out</span>
            <div class="big num">{{ d.records_missing_n.length }}</div>
            <div class="small muted">These fertiliser records don't state nitrogen (kg N or % N), so they can't be estimated.</div>
          </div>
        }
      </div>
      <section class="card">
        <div class="card-head"><h3>Factors used</h3><span class="small subtle">{{ d.rule_pack }}</span><span class="spacer"></span><vc-wall-chip [data]="d" /></div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Factor</th><th class="num">Value</th><th>Source</th></tr></thead>
            <tbody>
              @for (f of factors(); track f.key) {
                <tr><td><code>{{ f.key }}</code></td><td class="num">{{ f.value }}</td><td class="muted small">{{ f.source || '—' }}</td></tr>
              }
            </tbody>
          </table>
        </div>
        <div class="card-foot left"><span class="small muted">{{ d.note }}</span></div>
      </section>
    }
  `,
  styles: [`
    :host{display:flex;flex-direction:column;gap:16px}
    .win{display:flex;gap:16px;align-items:flex-end;padding:18px 20px;flex-wrap:wrap}
    .wl{flex:1;min-width:280px} .wl p{margin-top:4px;max-width:620px}
    .win .field{width:170px}
    .missing{display:flex;gap:16px;padding:22px 24px;border-left:3px solid var(--amber-600)}
    .mi{display:grid;place-items:center;flex:none;width:44px;height:44px;border-radius:10px;background:var(--amber-100);color:var(--amber-600)}
    .mb{flex:1;display:flex;flex-direction:column;gap:10px;align-items:flex-start}
    .keys{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .keys code{font-size:12px;background:var(--sand-100);padding:2px 6px;border-radius:4px;border:1px solid var(--border)}
    .steps{margin:0;padding-left:18px;color:var(--stone-700)} .steps li + li{margin-top:3px}
    .sc .big{font-size:26px;font-weight:600;margin:8px 0 2px;letter-spacing:-.02em} .sc .big span{font-size:13px;color:var(--text-3);margin-left:5px;font-weight:500}
    .warnc{border-top:3px solid var(--amber-600)}
    .card-foot.left{justify-content:flex-start}
  `],
})
export class EmissionsTab {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  projectId = input.required<string>();
  start = signal(daysAgo(365));
  end = signal(isoDate(new Date()));
  est = new Remote<Estimate>();
  canRules = computed(() => this.auth.can('rules.edit', 'data.read'));
  scenarios = computed(() => Object.entries(this.est.data()?.by_scenario ?? {}).map(([key, v]) => ({ key, v })).sort((a, b) => a.key.localeCompare(b.key)));
  factors = computed(() => Object.entries(this.est.data()?.factors ?? {}).map(([key, f]) => ({ key, ...f })));

  constructor() {
    effect(() => {
      const pid = this.projectId(), s = this.start(), e = this.end();
      untracked(() => { if (s && e) this.est.load(this.api.get<Estimate>(`/projects/${pid}/emissions-estimate`, { start: s, end: e })); });
    });
  }

  factorKeys(e: { details: Record<string, unknown> }): string[] {
    const k = e.details?.['factor_keys'];
    return Array.isArray(k) ? k.map(String) : [];
  }
}
