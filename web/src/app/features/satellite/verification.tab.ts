import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { FieldLite, Remote, daysAgo, isoDate } from '../supporting/shared';

interface Detection {
  id: string; field_id: string; practice_record_id: string | null; practice_code: string; season: string; detected: boolean | null;
  confidence: number; outcome: 'confirmed' | 'mismatch' | 'inconclusive'; evidence: Record<string, any>; created_at: string;
  data_class: string; needs_review: boolean;
}

const PRACTICE: Record<string, string> = {
  cover_crop: 'Cover crop', residue_retention: 'Residue retention', awd_irrigation: 'Alternate wetting & drying',
  zero_tillage: 'Zero tillage', reduced_tillage: 'Reduced tillage',
};

function fmtD(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Turn a detection's evidence into short plain-English sentences. */
export function evidenceWords(d: Detection): string[] {
  const e = d.evidence ?? {};
  const out: string[] = [];
  if (e['note']) out.push(String(e['note']));
  else if (e['unreported']) out.push('Not in the practice records — the satellite suggests it happened anyway.');
  if (Array.isArray(e['window'])) {
    out.push(`${e['clear_observations'] ?? 0} clear satellite passes between ${fmtD(e['window'][0])} and ${fmtD(e['window'][1])}.`);
  }
  if (typeof e['min_ndvi'] === 'number') out.push(`Lowest greenness (NDVI) in the window was ${e['min_ndvi'].toFixed(2)}.`);
  if (Array.isArray(e['bare_soil_dips'])) {
    const n = e['bare_soil_dips'].length;
    out.push(n ? `${n} sharp drop${n > 1 ? 's' : ''} to bare soil — typical of ploughing (first on ${fmtD(e['bare_soil_dips'][0].date)}).`
      : 'No sharp drop to bare soil, which is what untilled land looks like.');
  }
  if (typeof e['min_ndmi'] === 'number') out.push(`Lowest surface moisture (NDMI) was ${e['min_ndmi'].toFixed(2)}.`);
  if (typeof e['amplitude'] === 'number') {
    out.push(`Moisture swung by ${e['amplitude'].toFixed(2)} NDMI${typeof e['direction_changes'] === 'number' ? ` with ${e['direction_changes']} wet/dry turns` : ''}.`);
  }
  if (typeof e['median_ndvi'] === 'number') out.push(`Median greenness (NDVI) was ${e['median_ndvi'].toFixed(2)}.`);
  if (e['reason']) out.push(String(e['reason']));
  return out;
}

@Component({
  selector: 'vc-verification-tab',
  imports: [...KIT, FormsModule, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-callout tone="info" icon="shield-check">
      Satellite checks compare what farmers reported with what the imagery shows. They <strong>never change practice records</strong>.
      A mismatch or an inconclusive result is passed to a person to review with the farmer.
    </vc-callout>

    <div class="stats">
      @for (o of outcomes; track o.key) {
        <button type="button" class="st" [class.on]="filter() === o.key" [class]="'t-' + o.key" (click)="filter.set(filter() === o.key ? '' : o.key)">
          <span class="lbl">{{ o.label }}</span><strong class="num">{{ count(o.key) }}</strong><span class="hint">{{ o.hint }}</span>
        </button>
      }
      <div class="st run">
        @if (canRun()) {
          <span class="lbl">Check a season</span>
          <button class="btn btn-primary" (click)="runOpen.set(true)"><vc-icon name="play" />Run checks</button>
        } @else {
          <span class="lbl">Last run</span><strong class="small">{{ lastRun() ? (lastRun()! | ago) : 'Never' }}</strong>
        }
      </div>
    </div>

    <section class="card">
      @if (list.loading()) {
        <vc-loading [rows]="6" />
      } @else if (list.error()) {
        <div class="card-body"><vc-error title="Couldn't load practice checks" [message]="list.error()!.message" /></div>
      } @else if (!rows().length) {
        <vc-empty icon="satellite" [title]="filter() ? 'Nothing with this outcome' : 'No practice checks yet'"
          text="Run checks for a season to compare reported cover crops, tillage, residue retention and water management with satellite imagery.">
          @if (canRun() && !filter()) { <button class="btn btn-primary" (click)="runOpen.set(true)"><vc-icon name="play" />Run checks</button> }
        </vc-empty>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Field</th><th>Practice · season</th><th>Outcome</th><th>Confidence</th><th>What the imagery shows</th></tr></thead>
            <tbody>
              @for (d of rows(); track d.id) {
                <tr [class.review]="d.outcome === 'mismatch'">
                  <td class="nowrap"><strong>{{ fieldCode(d.field_id) }}</strong></td>
                  <td>
                    <div class="pr"><span>{{ practiceName(d.practice_code) }}</span>
                      <span class="small subtle nowrap">{{ d.practice_record_id ? 'Reported' : 'Not reported' }} · {{ season(d.season) }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="oc"><vc-badge [status]="d.outcome" />
                      @if (d.outcome === 'mismatch') { <span class="nr"><vc-icon name="user" [size]="12" />Needs a person to review</span> }
                      @else if (d.outcome === 'inconclusive') { <span class="small subtle">Not enough clear passes</span> }
                    </div>
                  </td>
                  <td>
                    <div class="conf"><vc-progress [value]="d.confidence" [max]="1" [tone]="d.confidence >= 0.75 ? 'ok' : 'warn'" /><span class="num small">{{ (d.confidence * 100).toFixed(0) }}%</span></div>
                  </td>
                  <td class="ev">
                    @for (w of words(d); track $index) { <p>{{ w }}</p> }
                    @if (d.evidence['rule']) { <p class="rule"><span>Test</span><code>{{ d.evidence['rule'] }}</code></p> }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="card-foot left"><vc-dc cls="DERIVED" /><span class="small muted">Worked out from OBSERVED satellite indices. Latest check per field and practice.</span></div>
      }
    </section>

    <vc-modal [(open)]="runOpen" title="Run practice checks" subtitle="Compares every reported practice in the season with the satellite record" width="520px">
      <div class="stack" style="--gap:14px">
        <div class="form-grid">
          <div class="field"><label for="s1">Season starts</label><input id="s1" type="date" class="input" [(ngModel)]="seasonStart" /></div>
          <div class="field"><label for="s2">Season ends</label><input id="s2" type="date" class="input" [(ngModel)]="seasonEnd" /></div>
        </div>
        <label class="checkbox"><input type="checkbox" [(ngModel)]="useFallow" />Also look for unreported cover crops in a fallow window</label>
        @if (useFallow) {
          <div class="form-grid">
            <div class="field"><label for="f1">Fallow starts</label><input id="f1" type="date" class="input" [(ngModel)]="fallowStart" /></div>
            <div class="field"><label for="f2">Fallow ends</label><input id="f2" type="date" class="input" [(ngModel)]="fallowEnd" /></div>
          </div>
        }
        <p class="small muted">Results are added alongside earlier checks. Practice records are not changed.</p>
        @if (runError()) { <vc-error title="Checks didn't run" [message]="runError()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="runOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="running()" (click)="run()">{{ running() ? 'Checking…' : 'Run checks' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    :host{display:flex;flex-direction:column;gap:16px}
    .stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
    @media (max-width:980px){.stats{grid-template-columns:repeat(2,minmax(0,1fr))}}
    .st{display:flex;flex-direction:column;gap:4px;align-items:flex-start;text-align:left;padding:14px 16px;background:var(--surface);border:1px solid var(--border);
      border-radius:var(--radius);box-shadow:var(--shadow-sm);font:inherit;color:inherit;cursor:pointer;border-top:3px solid var(--stone-300)}
    .st.t-confirmed{border-top-color:var(--forest-500)} .st.t-mismatch{border-top-color:var(--red-600)} .st.t-inconclusive{border-top-color:var(--stone-400)}
    .st.on{box-shadow:var(--focus)}
    .st.run{cursor:default;border-top-color:var(--forest-700);justify-content:space-between}
    .lbl{font-size:12.5px;color:var(--text-2);font-weight:500} .st strong{font-size:24px;font-weight:600;letter-spacing:-.02em}
    .hint{font-size:12px;color:var(--text-3)}
    tr.review td{background:#fdf6f5}
    tr.review td:first-child{box-shadow:inset 3px 0 0 var(--red-600)}
    .pr,.oc{display:flex;flex-direction:column;gap:4px;align-items:flex-start}
    .nr{white-space:nowrap;display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:500;color:var(--red-600)}
    .conf{display:flex;align-items:center;gap:8px;min-width:120px} .conf vc-progress{flex:1}
    .ev{min-width:360px;max-width:560px;font-size:12.5px;color:var(--stone-700)} .ev p + p{margin-top:3px}
    .rule{display:flex;gap:6px;align-items:baseline;color:var(--text-3)} .rule span{font-size:11px;text-transform:uppercase;letter-spacing:.06em}
    .rule code{font-size:11.5px}
    .card-foot.left{justify-content:flex-start}
  `],
})
export class VerificationTab {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  projectId = input.required<string>();
  fields = input<FieldLite[]>([]);
  list = new Remote<Detection[]>();
  filter = signal('');
  canRun = computed(() => this.auth.can('data.sync', 'calc.run'));

  outcomes = [
    { key: 'confirmed', label: 'Confirmed', hint: 'Imagery agrees with the record' },
    { key: 'mismatch', label: 'Mismatch', hint: 'Needs a person to review' },
    { key: 'inconclusive', label: 'Inconclusive', hint: 'Too few clear passes' },
  ];
  private fieldMap = computed(() => new Map(this.fields().map(f => [f.id, f.code])));
  rows = computed(() => {
    const order = { mismatch: 0, inconclusive: 1, confirmed: 2 } as Record<string, number>;
    return (this.list.data() ?? []).filter(d => !this.filter() || d.outcome === this.filter())
      .sort((a, b) => order[a.outcome] - order[b.outcome] || this.fieldCode(a.field_id).localeCompare(this.fieldCode(b.field_id)));
  });
  lastRun = computed(() => (this.list.data() ?? []).map(d => d.created_at).sort().at(-1) ?? null);

  runOpen = signal(false);
  running = signal(false);
  runError = signal<string | null>(null);
  seasonStart = daysAgo(180);
  seasonEnd = isoDate(new Date());
  useFallow = false;
  fallowStart = daysAgo(90);
  fallowEnd = daysAgo(30);

  constructor() {
    effect(() => {
      const pid = this.projectId();
      untracked(() => this.list.load(this.api.get<Detection[]>(`/projects/${pid}/practice-detection`)));
    });
  }

  count(o: string) { return (this.list.data() ?? []).filter(d => d.outcome === o).length; }
  fieldCode(id: string) { return this.fieldMap().get(id) ?? id.slice(0, 8); }
  practiceName(c: string) { return PRACTICE[c] ?? c.replace(/_/g, ' '); }
  words = evidenceWords;
  season(s: string) {
    const m = /^(\d{4})(\d{2})(\d{2})-(\d{4})(\d{2})(\d{2})$/.exec(s);
    return m ? `${fmtD(`${m[1]}-${m[2]}-${m[3]}`)} – ${fmtD(`${m[4]}-${m[5]}-${m[6]}`)}` : s;
  }

  run() {
    this.running.set(true);
    this.runError.set(null);
    const body: Record<string, string> = { season_start: this.seasonStart, season_end: this.seasonEnd };
    if (this.useFallow) { body['fallow_start'] = this.fallowStart; body['fallow_end'] = this.fallowEnd; }
    this.api.post<{ detections: number; by_outcome: Record<string, number>; unreported: number }>(
      `/projects/${this.projectId()}/practice-detection/run`, body,
    ).subscribe({
      next: r => {
        this.running.set(false);
        this.runOpen.set(false);
        const mm = r.by_outcome?.['mismatch'] ?? 0;
        this.toast.success(`${r.detections} checks completed`, mm ? `${mm} mismatch${mm > 1 ? 'es' : ''} need a person to review.` : 'No mismatches found.');
        this.list.load(this.api.get<Detection[]>(`/projects/${this.projectId()}/practice-detection`), true);
      },
      error: (e: ApiError) => { this.running.set(false); this.runError.set(e.message); },
    });
  }
}
