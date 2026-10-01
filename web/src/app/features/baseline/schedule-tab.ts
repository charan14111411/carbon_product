import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { ApiError, ApiService } from '../../core/api.service';
import { DayPipe } from '../../core/format';
import { Icon } from '../../ui/icon';
import { Callout, DataClass, Empty, ErrorBox, Loading, Stat } from '../../ui/kit';
import { BaselineSchema } from './baseline-data';
import { FieldLite, Schedule, ScheduleField, TABLE4 } from './baseline.types';

@Component({
  selector: 'vc-schedule-tab',
  imports: [Icon, Stat, Callout, DataClass, Empty, ErrorBox, Loading, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <section class="card"><vc-loading [rows]="6" /></section>
    } @else if (error(); as e) {
      <section class="card"><div class="card-body">
        <vc-error [title]="e.code === 'PROJECT_START_MISSING' ? 'The project has no start date' : 'Couldn\\'t build the schedule'" [message]="e.message" />
      </div></section>
    } @else if (data(); as d) {
      <div class="grid grid-4 stats">
        <vc-stat label="Fields ready" [value]="d.fields_ready + ' / ' + d.fields.length" icon="check-circle" [accent]="d.fields.length > 0 && d.fields_ready === d.fields.length"
          hint="Look-back and Table 4 complete" />
        <vc-stat label="Project start" [value]="d.start_year" icon="calendar" hint="Look-back years are before this" />
        <vc-stat label="Baseline period" [value]="d.baseline_period_years" unit="years" icon="history" hint="Schedule repeats every x years" />
        <vc-stat label="Reassessment due" [value]="d.reassessment.due_on | day" icon="refresh" [hint]="d.reassessment.recommended_on ? 'Recommended from ' + (d.reassessment.recommended_on | day) : 'Set the baseline start date'" />
      </div>

      <vc-callout [tone]="reTone()" [icon]="d.reassessment.status === 'overdue' ? 'alert' : 'calendar'" class="mb">
        <strong>Baseline reassessment.</strong> {{ d.reassessment.message }} VM0042 requires it at least every 10 years (5 recommended), using sub-national production data from the last 5 years.
      </vc-callout>

      <div class="rule small muted"><vc-icon name="info" [size]="13" /><span><strong>How rotations are detected:</strong> {{ d.rotation_rule }} A continuous crop is complete after one year; a rotation is complete once it has been seen to restart.</span></div>

      @if (!d.fields.length) {
        <section class="card"><vc-empty icon="map" title="No fields in this project yet" text="Enrol fields, then record their look-back years under Activity records." /></section>
      }

      @for (f of d.fields; track f.field_id) {
        <section class="card fcard" [class.open]="isOpen(f)">
          <button type="button" class="fh" (click)="toggle(f)" [attr.aria-expanded]="isOpen(f)">
            <span class="st" [class.ok]="f.ready"><vc-icon [name]="f.ready ? 'check' : 'alert'" [size]="14" [stroke]="2.2" /></span>
            <div class="fn"><strong>{{ f.field_code }}</strong><span class="subtle small">{{ fieldName(f.field_id) }}</span></div>
            <span class="chip" [class.good]="f.meets_min_years" [class.bad]="!f.meets_min_years" title="Consecutive look-back years before the project start">
              {{ f.lookback_length }} look-back yr{{ f.lookback_length === 1 ? '' : 's' }}@if (f.lookback_years.length) { · {{ f.lookback_years[0] }}–{{ f.lookback_years[f.lookback_years.length - 1] }} }
            </span>
            <span class="chip" [class.good]="f.rotation.complete" [class.bad]="!f.rotation.complete" [title]="f.rotation.reason">{{ rotationLabel(f) }}</span>
            @if (f.missing_items.length) { <span class="chip bad">{{ f.missing_items.length }} missing</span> } @else if (f.lookback_years.length) { <span class="chip good">Table 4 complete</span> }
            <span class="tiers">
              @for (t of tierKeys; track t) {
                @if ((f.tier_summary[t] ?? 0) > 0) { <span class="tier" [class]="'tier t' + t" [title]="tierLabel(t)">T{{ t }} <b>{{ f.tier_summary[t] }}</b></span> }
              }
            </span>
            <vc-icon [name]="isOpen(f) ? 'chevron-down' : 'chevron-right'" [size]="16" class="chev" />
          </button>

          @if (isOpen(f)) {
            <div class="fb">
              @for (w of f.warnings; track $index) { <vc-callout tone="warn" icon="alert" class="mb">{{ w }}</vc-callout> }

              <div class="sec-h"><h4>Table 4 minimum data per look-back year</h4><vc-dc cls="DERIVED" /><span class="subtle small">Click a gap to record it</span></div>
              @if (!f.completeness.length) {
                <p class="muted small">No consecutive look-back years before {{ d.start_year }} are recorded yet@if (f.years_with_records.length) { (records exist for {{ f.years_with_records.join(', ') }})}.</p>
              } @else {
                <div class="table-wrap">
                  <table class="table matrix">
                    <thead><tr><th>Year</th>@for (c of table4; track c) { <th class="c">{{ label(c) }}</th> }<th class="num">Status</th></tr></thead>
                    <tbody>
                      @for (y of f.completeness; track y.year) {
                        <tr>
                          <td class="nowrap"><strong class="num">{{ y.year }}</strong><span class="subtle small tt">t = {{ y.t }}</span></td>
                          @for (c of table4; track c) {
                            <td class="c">
                              @if (y.missing.includes(c)) {
                                <button type="button" class="gap" (click)="openRecords.emit({ field_id: f.field_id, year: y.year, category: c })" [title]="'Record ' + label(c) + ' for ' + y.year">
                                  <vc-icon name="x" [size]="12" [stroke]="2.4" />Missing
                                </button>
                              } @else { <span class="okc" [title]="label(c) + ' recorded'"><vc-icon name="check" [size]="14" [stroke]="2.4" /></span> }
                            </td>
                          }
                          <td class="num">@if (y.complete) { <span class="done">Complete</span> } @else { <span class="miss">{{ y.missing.length }} gap{{ y.missing.length === 1 ? '' : 's' }}</span> }</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }

              <div class="sec-h"><h4>Derived baseline schedule</h4><vc-dc cls="DERIVED" /><span class="subtle small">The look-back repeats every {{ f.lookback_length || 'x' }} years from t = 1 (§6, footnote 8)</span></div>
              @if (!f.schedule.length) {
                <p class="muted small">The schedule appears once look-back years are recorded.</p>
              } @else {
                <div class="sched">
                  @for (s of f.schedule; track s.t) {
                    <div class="sc">
                      <div class="sy"><span class="num">{{ s.year }}</span><span class="subtle">t = {{ s.t }}</span></div>
                      <div class="src small">as {{ s.source_year }} <span class="subtle">(t = {{ s.source_t }})</span></div>
                      <div class="crops">@for (c of s.crops; track c) { <span class="crop">{{ c }}</span> } @empty { <span class="subtle small">No crop recorded</span> }</div>
                      <div class="cats subtle small">{{ s.categories.length }} categories</div>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </section>
      }
    }
  `,
  styles: [`
    .stats{margin-bottom:12px}
    .mb{display:flex;margin-bottom:12px}
    .rule{display:flex;gap:8px;align-items:flex-start;margin:0 0 16px;max-width:900px}
    .rule vc-icon{margin-top:2px}
    .fcard{margin-bottom:10px;overflow:hidden}
    .fcard.open{box-shadow:var(--shadow)}
    .fh{display:flex;align-items:center;gap:12px;width:100%;padding:14px 18px;border:0;background:none;font:inherit;text-align:left;cursor:pointer;flex-wrap:wrap}
    .fh:hover{background:var(--surface-2)}
    .st{flex:none;display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--warn-soft);color:var(--amber-600)}
    .st.ok{background:var(--ok-soft);color:var(--forest-600)}
    .fn{display:flex;flex-direction:column;min-width:160px;flex:1}
    .chip{font-size:12px;padding:3px 9px;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--stone-700);white-space:nowrap}
    .chip.good{background:var(--ok-soft);border-color:#cfe2d4;color:var(--forest-700)}
    .chip.bad{background:var(--warn-soft);border-color:#f1dcae;color:var(--amber-600)}
    .tiers{display:inline-flex;gap:4px}
    .tier{font-size:11.5px;padding:2px 7px;border-radius:5px;background:var(--sand-100);border:1px solid var(--border);color:var(--stone-600)}
    .tier b{font-weight:600;margin-left:2px}
    .tier.t1{background:var(--forest-50);border-color:var(--forest-200);color:var(--forest-700)}
    .tier.t2{background:var(--sky-100);border-color:#c9dcf0;color:var(--sky-600)}
    .tier.t3{background:var(--amber-100);border-color:#f1dcae;color:var(--amber-600)}
    .tier.t4{background:var(--clay-50);border-color:var(--clay-100);color:var(--clay-700)}
    .chev{color:var(--stone-400)}
    .fb{padding:4px 18px 18px;border-top:1px solid var(--border)}
    .sec-h{display:flex;align-items:center;gap:10px;margin:16px 0 8px}
    .sec-h h4{font-size:13.5px}
    .matrix th.c,.matrix td.c{text-align:center}
    .tt{margin-left:8px}
    .matrix td{padding:9px 10px}
    .okc{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--ok-soft);color:var(--forest-600)}
    .gap{display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 8px;border-radius:999px;border:1px solid #f3c7c3;background:var(--danger-soft);color:var(--red-600);font:500 11.5px var(--font);cursor:pointer}
    .gap:hover{border-color:var(--red-600)}
    .done{font-size:12px;color:var(--forest-600);font-weight:500} .miss{font-size:12px;color:var(--red-600);font-weight:500}
    .sched{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px}
    .sc{flex:none;width:132px;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface-2);display:flex;flex-direction:column;gap:4px}
    .sy{display:flex;justify-content:space-between;align-items:baseline;font-weight:600} .sy .subtle{font-size:11px;font-weight:400}
    .src{color:var(--stone-700)}
    .crops{display:flex;flex-wrap:wrap;gap:4px}
    .crop{font-size:11.5px;padding:1px 7px;border-radius:5px;background:var(--forest-100);color:var(--forest-700);text-transform:capitalize}
  `],
})
export class ScheduleTab {
  private api = inject(ApiService);
  private schema = inject(BaselineSchema);
  projectId = input.required<string>();
  fields = input<FieldLite[]>([]);
  active = input(false);
  openRecords = output<{ field_id?: string; year?: number; category?: string }>();

  data = signal<Schedule | null>(null);
  loading = signal(true);
  error = signal<ApiError | null>(null);
  opened = signal<Set<string>>(new Set());
  table4 = TABLE4;
  tierKeys = ['1', '2', '3', '4'];
  private loadedFor = '';

  reTone = computed(() => ({ overdue: 'danger', recommended: 'warn', not_due: 'info' } as Record<string, 'danger' | 'warn' | 'info'>)[this.data()?.reassessment.status ?? ''] ?? 'info');

  constructor() {
    this.schema.load();
    effect(() => {
      const pid = this.projectId();
      if (this.active() && pid !== this.loadedFor) untracked(() => this.load());
    });
  }

  load() {
    this.loadedFor = this.projectId();
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Schedule>(`/projects/${this.projectId()}/baseline-schedule`).subscribe({
      next: d => {
        this.data.set(d);
        this.loading.set(false);
        const first = d.fields.find(f => !f.ready) ?? d.fields[0];
        if (first && !this.opened().size) this.opened.set(new Set([first.field_id]));
      },
      error: (e: ApiError) => { this.error.set(e); this.loading.set(false); },
    });
  }

  label(c: string) { return this.schema.label(c); }
  fieldName(id: string) { return this.fields().find(f => f.id === id)?.name ?? ''; }
  tierLabel(t: string) { return this.schema.schema()?.data_tiers[t] ?? `Tier ${t}`; }
  isOpen(f: ScheduleField) { return this.opened().has(f.field_id); }
  toggle(f: ScheduleField) {
    const s = new Set(this.opened());
    if (s.has(f.field_id)) s.delete(f.field_id); else s.add(f.field_id);
    this.opened.set(s);
  }
  rotationLabel(f: ScheduleField) {
    const r = f.rotation;
    if (r.pattern === 'continuous') return 'Continuous crop';
    if (r.pattern === 'unknown') return 'Rotation unknown';
    if (!r.length) return 'No repeating pattern';
    return `${r.length}-year rotation${r.complete ? '' : ' · unconfirmed'}`;
  }
}
