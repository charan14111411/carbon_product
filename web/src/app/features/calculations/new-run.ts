import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, HumanPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Callout, Empty, Loading } from '../../ui/kit';
import { CalcBlocker } from './blocker';
import { Campaign, RunDetail, RunSummary } from './calc.types';

@Component({
  selector: 'vc-new-run',
  imports: [FormsModule, Icon, Callout, Empty, Loading, CalcBlocker, DayPipe, HumanPipe, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!canRun()) {
      <section class="card"><vc-empty icon="lock" title="You can't start calculations"
        text="Carbon analysts run calculations. You can still review runs and their provenance." /></section>
    } @else {
      <div class="wrap">
        <section class="card">
          <div class="card-head"><h3>New calculation run</h3></div>
          <div class="card-body">
            @if (loadingCampaigns()) { <vc-loading [rows]="3" /> }
            <div class="form-grid">
              <div class="field">
                <label for="pl">Monitoring period label</label>
                <input id="pl" class="input" [(ngModel)]="f.period_label" maxlength="40" placeholder="e.g. 2025-26" />
                <span class="hint">Approved term estimates with the same label are used.</span>
              </div>
              <div class="field"></div>
              <div class="field">
                <label for="ps">Period start</label>
                <input id="ps" class="input" type="date" [(ngModel)]="f.period_start" />
              </div>
              <div class="field">
                <label for="pe">Period end</label>
                <input id="pe" class="input" type="date" [(ngModel)]="f.period_end" [class.invalid]="badPeriod()" />
                @if (badPeriod()) { <span class="error">The period must end after it starts.</span> }
              </div>
              <div class="field">
                <label for="bc">Baseline campaign</label>
                <select id="bc" class="input" [(ngModel)]="f.baseline_campaign_id">
                  <option value="">Choose…</option>
                  @for (c of baselines(); track c.id) { <option [value]="c.id">{{ c.code }} · {{ c.name }} ({{ c.design }})</option> }
                </select>
                @if (!loadingCampaigns() && !baselines().length) { <span class="error">This project has no baseline campaign.</span> }
              </div>
              <div class="field">
                <label for="mc">Monitoring campaign</label>
                <select id="mc" class="input" [(ngModel)]="f.monitoring_campaign_id">
                  <option value="">Choose…</option>
                  @for (c of monitorings(); track c.id) { <option [value]="c.id">{{ c.code }} · {{ c.name }} ({{ c.design }})</option> }
                </select>
                @if (!loadingCampaigns() && !monitorings().length) { <span class="hint">No monitoring campaign yet — a re-measurement is needed to calculate a change.</span> }
              </div>
              <div class="field span-2">
                <label for="sr">Replaces an earlier run <span class="subtle">(optional)</span></label>
                <select id="sr" class="input" [(ngModel)]="f.supersedes_run_id">
                  <option value="">No — this is the first run for the period</option>
                  @for (r of supersedable(); track r.id) {
                    <option [value]="r.id">{{ r.period_label }} · {{ r.status | human }} · {{ r.net_t_co2e | num: 1 }} tCO₂e · {{ r.created_at | day }}</option>
                  }
                </select>
                <span class="hint">Only runs for the same period label can be replaced. When approved, the old run is marked superseded and its field claims are released.</span>
              </div>
            </div>
          </div>
          <div class="card-foot">
            <span class="subtle small grow">Quality checks run first. The engine reads only accepted, versioned data and freezes every input.</span>
            <button class="btn btn-primary" [disabled]="!valid() || running()" (click)="run()">
              <vc-icon [name]="running() ? 'refresh' : 'play'" />{{ running() ? 'Calculating…' : 'Run calculation' }}
            </button>
          </div>
        </section>

        <aside class="stack side">
          @if (error()) {
            <vc-calc-blocker [error]="error()" />
          } @else {
            <vc-callout tone="info" icon="info">
              <strong>What happens when you run</strong>
              <ol>
                <li>Project quality checks run. Any open blocking issue stops the run.</li>
                <li>Every sample, layer and accepted lab result for both campaigns is read and frozen.</li>
                <li>The approved methodology rules decide the stock method, uncertainty and buffer.</li>
                <li>The result gets a fingerprint of its inputs, so anyone can check it was not changed.</li>
              </ol>
            </vc-callout>
            <vc-callout tone="warn" icon="users">
              A run you create must be approved by a colleague with approval rights — never by you.
            </vc-callout>
          }
        </aside>
      </div>
    }
  `,
  styles: [`
    .wrap{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(300px,1fr);gap:20px;align-items:start}
    @media (max-width: 1100px){.wrap{grid-template-columns:1fr}}
    .grow{flex:1}
    ol{margin:8px 0 0;padding-left:18px;display:flex;flex-direction:column;gap:4px;color:var(--stone-700)}
    .side{--gap:12px}
  `],
})
export class NewRun {
  projectId = input.required<string>();
  runs = input<RunSummary[]>([]);
  supersedes = input<string | null>(null);
  created = output<RunDetail>();

  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  campaigns = signal<Campaign[]>([]);
  loadingCampaigns = signal(true);
  running = signal(false);
  error = signal<ApiError | null>(null);
  f = { period_label: '', period_start: '', period_end: '', baseline_campaign_id: '', monitoring_campaign_id: '', supersedes_run_id: '' };

  canRun = computed(() => this.auth.can('calc.run'));
  baselines = computed(() => this.campaigns().filter(c => c.kind === 'baseline'));
  monitorings = computed(() => this.campaigns().filter(c => c.kind === 'monitoring'));
  supersedable = computed(() => this.runs().filter(r => ['approved', 'calculated', 'rejected', 'under_review'].includes(r.status)));

  constructor() {
    effect(() => {
      const pid = this.projectId();
      if (!pid) return;
      this.loadingCampaigns.set(true);
      this.api.get<Campaign[]>(`/projects/${pid}/campaigns`).subscribe({
        next: c => {
          this.campaigns.set(c);
          this.loadingCampaigns.set(false);
          const b = c.filter(x => x.kind === 'baseline');
          const m = c.filter(x => x.kind === 'monitoring');
          if (!this.f.baseline_campaign_id && b.length) this.f.baseline_campaign_id = b[b.length - 1].id;
          if (!this.f.monitoring_campaign_id && m.length) {
            const last = m[m.length - 1];
            this.f.monitoring_campaign_id = last.id;
            if (!this.f.period_end && last.planned_end) this.f.period_end = last.planned_end.slice(0, 10);
          }
          this.cdr.markForCheck();
        },
        error: () => this.loadingCampaigns.set(false),
      });
    });
    effect(() => {
      const s = this.supersedes();
      const r = this.runs().find(x => x.id === s);
      if (r) {
        this.f.supersedes_run_id = r.id;
        this.f.period_label = r.period_label;
        this.f.period_start = r.period_start;
        this.f.period_end = r.period_end;
        this.cdr.markForCheck();
      }
    });
  }

  badPeriod() { return !!(this.f.period_start && this.f.period_end && this.f.period_end <= this.f.period_start); }
  valid() {
    const f = this.f;
    return !!(f.period_label.trim() && f.period_start && f.period_end && !this.badPeriod() && f.baseline_campaign_id && f.monitoring_campaign_id);
  }

  run() {
    this.running.set(true);
    this.error.set(null);
    const body = { ...this.f, period_label: this.f.period_label.trim(), supersedes_run_id: this.f.supersedes_run_id || null };
    this.api.post<RunDetail>(`/projects/${this.projectId()}/calculations`, body).subscribe({
      next: r => {
        this.running.set(false);
        this.toast.success('Calculation complete', `Net result ${r.net_t_co2e.toFixed(1)} tCO₂e. Review it, then send it for approval.`);
        this.created.emit(r);
        this.router.navigate(['/app/calculations', r.id]);
      },
      error: (e: ApiError) => { this.running.set(false); this.error.set(e); },
    });
  }
}
