import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { DayPipe } from '../../core/format';
import { Callout, Modal } from '../../ui/kit';
import { fieldErrors } from './errors';
import { Campaign } from './types';

/** Platform default for "same season" (sampling/domain.py SEASON_WINDOW_DAYS); a project rule may override it. */
const DEFAULT_SEASON_WINDOW = 45;

function dayOfYear(iso: string): number {
  const d = new Date(iso + 'T00:00:00Z');
  return Math.floor((d.getTime() - Date.UTC(d.getUTCFullYear(), 0, 1)) / 86400_000) + 1;
}

/** Smallest distance in days between two dates' positions in the year (wraps round 31 Dec), as the API does. */
function dayOfYearGap(a: string, b: string): number {
  const d = Math.abs(dayOfYear(a) - dayOfYear(b));
  return Math.min(d, 365 - d);
}

/** Plan a new baseline or monitoring campaign. */
@Component({
  selector: 'vc-campaign-modal',
  imports: [FormsModule, Modal, Icon, Callout, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-modal [(open)]="open" title="Plan a campaign" width="640px"
      subtitle="A campaign is one round of soil sampling. The methodology rules are checked when you save.">
      <div class="stack" style="--gap:16px">
        <div class="form-grid">
          <div class="field">
            <label for="c-code">Campaign code</label>
            <input id="c-code" class="input mono" [(ngModel)]="code" placeholder="BL-2026" />
            @if (fe()['code']; as m) { <span class="error">{{ m }}</span> }
          </div>
          <div class="field">
            <label for="c-name">Name</label>
            <input id="c-name" class="input" [(ngModel)]="name" placeholder="Baseline sampling, post-monsoon 2026" />
            @if (fe()['name']; as m) { <span class="error">{{ m }}</span> }
          </div>
          <div class="field">
            <label for="c-kind">Kind</label>
            <select id="c-kind" class="input" [ngModel]="kind()" (ngModelChange)="kind.set($event)">
              <option value="baseline">Baseline — the starting point</option>
              <option value="monitoring">Monitoring — a later re-measurement</option>
            </select>
          </div>
          <div class="field">
            <label for="c-design">Design</label>
            <select id="c-design" class="input" [ngModel]="design()" (ngModelChange)="design.set($event)">
              <option value="independent">Independent — new random points</option>
              <option value="paired">Paired — re-visit the same sites</option>
            </select>
          </div>
          @if (kind() === 'monitoring') {
            <div class="field span-2">
              <label for="c-rev">Re-visits baseline campaign @if (design() !== 'paired') { <span class="subtle">(optional)</span> }</label>
              <select id="c-rev" class="input" [ngModel]="revisits()" (ngModelChange)="revisits.set($event)">
                <option value="">None</option>
                @for (b of baselines(); track b.id) { <option [value]="b.id">{{ b.code }} · {{ b.name }}</option> }
              </select>
              @if (design() === 'paired') { <span class="hint">Paired designs sample the exact sites of the baseline again.</span> }
            </div>
          }
          <div class="field">
            <label for="c-start">Planned start</label>
            <input id="c-start" type="date" class="input" [ngModel]="start()" (ngModelChange)="start.set($event)" />
          </div>
          <div class="field">
            <label for="c-end">Planned end</label>
            <input id="c-end" type="date" class="input" [(ngModel)]="end" />
            @if (fe()['planned_end']; as m) { <span class="error">{{ m }}</span> }
          </div>
          <div class="field span-2">
            <label for="c-season">Season <span class="subtle">(optional)</span></label>
            <input id="c-season" class="input" [(ngModel)]="season" maxlength="60" placeholder="Post-monsoon (rabi)" />
            <span class="hint">The farming season the cores are taken in. Shown to verifiers next to the dates.</span>
          </div>
          <div class="field">
            <label for="c-df">Depth from (cm)</label>
            <input id="c-df" type="number" min="0" class="input num" [(ngModel)]="depthFrom" />
          </div>
          <div class="field">
            <label for="c-dt">Depth to (cm)</label>
            <input id="c-dt" type="number" min="1" max="300" class="input num" [(ngModel)]="depthTo" />
            @if (fe()['depth_to_cm']; as m) { <span class="error">{{ m }}</span> }
          </div>
          <div class="field span-2">
            <label for="c-seed">Placement seed <span class="subtle">(optional)</span></label>
            <input id="c-seed" type="number" min="0" class="input num" [(ngModel)]="seed" placeholder="Chosen at random if left empty" />
            <span class="hint">The seed makes point placement reproducible: the same seed and zones always give the same points, so a verifier can re-create them.</span>
          </div>
        </div>
        @if (seasonCheck(); as sc) {
          <div class="season" [class.bad]="sc.mismatch">
            <div class="sh">
              <vc-icon [name]="sc.mismatch ? 'calendar-clock' : 'calendar-check'" [size]="18" />
              <strong>{{ sc.mismatch ? 'Different season from the baseline' : 'Same season as the baseline' }}</strong>
              <span class="chipref">VM0042 §8.2.1.2</span>
            </div>
            <p class="small">
              Sampling and re-sampling must happen in the same season, so the change in soil carbon is not confused with seasonal swings.
              This campaign starts <strong class="num">{{ sc.gap }} days</strong> (by time of year) from
              <code>{{ sc.ref.code }}</code>, which started {{ sc.ref.planned_start | day }}. The allowed window is
              <strong class="num">±{{ sc.window }} days</strong>{{ windowFromRule() ? ' (project rule)' : ' (platform standard)' }}.
            </p>
            @if (sc.mismatch) {
              <div class="field">
                <label for="c-ovr">Reason for sampling in a different season</label>
                <textarea id="c-ovr" class="input" rows="3" [(ngModel)]="override"
                  placeholder="Monsoon arrived three weeks early; fields were flooded in the baseline window. Agreed with the verifier on 12 Aug."></textarea>
                @if (fe()['season_override_reason']; as m) { <span class="error">{{ m }}</span> }
                @else { <span class="hint">At least 10 characters, kept with the campaign. Or move the planned start to within ±{{ sc.window }} days of the same time of year as {{ sc.ref.planned_start | day }}.</span> }
              </div>
            }
          </div>
        }
        @if (err()) { <vc-callout tone="danger" icon="alert">{{ err() }}</vc-callout> }
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="open.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !valid()" (click)="save()"><vc-icon name="check" />{{ busy() ? 'Saving…' : 'Create campaign' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .season{display:flex;flex-direction:column;gap:10px;padding:14px;border:1px solid var(--forest-200);border-radius:var(--radius);background:var(--forest-50)}
    .season.bad{border-color:#f1dcae;background:var(--warn-soft)}
    .sh{display:flex;align-items:center;gap:8px;color:var(--forest-700)}
    .season.bad .sh{color:var(--amber-600)}
    .sh strong{color:var(--stone-900)}
    .season p{color:var(--stone-700)}
    .chipref{margin-left:auto;font:600 10.5px/1 var(--mono);padding:4px 6px;border-radius:4px;background:var(--surface);border:1px solid var(--border);color:var(--stone-700)}
  `],
})
export class CampaignModal {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  open = model(false);
  projectId = input.required<string>();
  campaigns = input<Campaign[]>([]);
  saved = output<Campaign>();

  busy = signal(false);
  err = signal<string | null>(null);
  kind = signal<'baseline' | 'monitoring'>('baseline');
  design = signal<'paired' | 'independent'>('independent');
  baselines = computed(() => this.campaigns().filter(c => c.kind === 'baseline'));
  revisits = signal('');
  start = signal('');
  window = signal(DEFAULT_SEASON_WINDOW);
  windowFromRule = signal(false);
  fe = signal<Record<string, string>>({});

  /** Mirrors sampling/service.py _season_check: monitoring only, against the re-visited or first baseline. */
  seasonCheck = computed(() => {
    if (this.kind() !== 'monitoring' || !this.start()) return null;
    const ref = this.baselines().find(b => b.id === this.revisits())
      ?? [...this.baselines()].sort((a, b) => a.planned_start.localeCompare(b.planned_start))[0];
    if (!ref) return null;
    const gap = dayOfYearGap(ref.planned_start, this.start());
    return { ref, gap, window: this.window(), mismatch: gap > this.window() };
  });

  code = '';
  name = '';
  season = '';
  override = '';
  end = '';
  depthFrom = 0;
  depthTo = 30;
  seed: number | null = null;

  constructor() {
    effect(() => {
      if (!this.open()) return;
      this.err.set(null);
      this.code = ''; this.name = ''; this.revisits.set(''); this.seed = null; this.season = ''; this.override = '';
      this.fe.set({});
      this.start.set(new Date().toISOString().slice(0, 10));
      this.loadWindow();
      this.end = new Date(Date.now() + 45 * 86400_000).toISOString().slice(0, 10);
    });
  }

  valid() {
    const sc = this.seasonCheck();
    return this.code.trim().length >= 2 && this.name.trim().length >= 2 && !!this.start() && !!this.end && this.depthTo > this.depthFrom
      && (!sc?.mismatch || this.override.trim().length >= 10);
  }

  /** The project's approved rule pack may set its own same-season window (rule season_window_days). */
  private loadWindow() {
    this.window.set(DEFAULT_SEASON_WINDOW);
    this.windowFromRule.set(false);
    this.api.get<{ rule_pack_id: string | null }>(`/projects/${this.projectId()}`).subscribe({
      next: p => {
        if (!p.rule_pack_id) return;
        this.api.get<{ status: string; rules: { key: string; value: unknown }[] }>(`/rule-packs/${p.rule_pack_id}`).subscribe({
          next: rp => {
            const v = rp.status === 'approved' ? rp.rules.find(r => r.key === 'season_window_days')?.value : null;
            if (typeof v === 'number' && v > 0) { this.window.set(v); this.windowFromRule.set(true); }
          },
          error: () => {},
        });
      },
      error: () => {},
    });
  }

  save() {
    this.busy.set(true);
    this.err.set(null);
    this.fe.set({});
    const sc = this.seasonCheck();
    this.api.post<Campaign>(`/projects/${this.projectId()}/campaigns`, {
      code: this.code.trim(), name: this.name.trim(), kind: this.kind(), design: this.design(),
      revisits_campaign_id: this.kind() === 'monitoring' && this.revisits() ? this.revisits() : null,
      season: this.season.trim() || null,
      season_override_reason: sc?.mismatch && this.override.trim() ? this.override.trim() : null,
      planned_start: this.start(), planned_end: this.end, depth_from_cm: Number(this.depthFrom), depth_to_cm: Number(this.depthTo),
      placement_seed: this.seed === null || (this.seed as unknown) === '' ? null : Number(this.seed),
    }).subscribe({
      next: c => { this.busy.set(false); this.toast.success(`Campaign ${c.code} planned`); this.saved.emit(c); this.open.set(false); },
      error: (e: ApiError) => {
        this.busy.set(false);
        this.fe.set(fieldErrors(e));
        // The server is the judge: adopt its window if it differs, so the override box appears.
        const w = Number(e.details?.['window_days']);
        if (e.code === 'SEASON_MISMATCH' && w > 0) { this.window.set(w); this.windowFromRule.set(w !== DEFAULT_SEASON_WINDOW); }
        this.err.set(e.message);
      },
    });
  }
}
