import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { ApiError, ApiService } from '../../core/api.service';
import { NumPipe } from '../../core/format';
import { Icon } from '../../ui/icon';
import { Callout, DataClass, Empty, ErrorBox, Loading } from '../../ui/kit';
import { Change, FieldLite, PracticeChange, PracticeField, human, keyLabel } from './baseline.types';

@Component({
  selector: 'vc-practice-tab',
  imports: [Icon, Callout, DataClass, Empty, ErrorBox, Loading, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) { <section class="card"><vc-loading [rows]="5" /></section> }
    @else if (error()) { <section class="card"><div class="card-body"><vc-error title="Couldn't check practice change" [message]="error()!" /></div></section> }
    @else if (data(); as d) {
      <div class="head card">
        <div class="ring" [class.full]="d.fields.length && d.fields_qualifying === d.fields.length">
          <strong class="num">{{ d.fields_qualifying }}</strong><span>of {{ d.fields.length }}</span>
        </div>
        <div class="t">
          <h3>Fields with a qualifying practice change</h3>
          <p class="muted small">VM0042 §4 condition 2: each field must change at least one Appendix 1 practice — a new practice, a practice stopped, or a
            quantity that moves by <strong>more than {{ d.threshold_pct | num: 0 }} %</strong> from its look-back average. Project start {{ d.start_year }}.</p>
        </div>
        <vc-dc cls="DERIVED" />
      </div>

      @if (d.fields_productivity_warning) {
        <vc-callout tone="warn" icon="alert" class="mb">
          <strong>{{ d.fields_productivity_warning }} field{{ d.fields_productivity_warning === 1 ? '' : 's' }} with a sustained yield decline of more than {{ d.productivity_threshold_pct | num: 0 }} %.</strong>
          VM0042 §4 condition 6 excludes project activities that cause a sustained drop in productivity. Explain the cause to the verifier, and assess production-decline leakage with VMD0054 (§8.4.3).
        </vc-callout>
      }

      @if (!d.fields.length) {
        <section class="card"><vc-empty icon="sprout" title="No fields to compare yet" text="Record look-back and project-year activity to test the practice change." /></section>
      }

      @for (f of d.fields; track f.field_id) {
        <section class="card fcard">
          <div class="fh">
            <span class="st" [class]="'st ' + f.status"><vc-icon [name]="f.qualifies ? 'check' : f.status === 'insufficient_data' ? 'minus' : 'x'" [size]="15" [stroke]="2.4" /></span>
            <div class="fn"><strong>{{ f.field_code }}</strong><span class="small muted">{{ f.message }}</span></div>
            <span class="yrs small subtle">Look-back {{ range(f.lookback_years) }} · project {{ range(f.project_years) }}</span>
          </div>
          @if (f.categories.length) {
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Category</th><th class="num">Year</th><th>What changed</th><th class="num">Look-back average</th><th class="num">Project</th><th class="num">Change</th><th>Counts?</th></tr></thead>
                <tbody>
                  @for (row of rowsOf(f); track $index) {
                    <tr [class.q]="row.c.qualifying && row.appendix1">
                      <td>@if (row.first) { <strong>{{ row.label }}</strong>@if (!row.appendix1) { <div class="subtle small">Not an Appendix 1 category</div> } }</td>
                      <td class="num">{{ row.year }}</td>
                      <td>{{ row.c.kind === 'qualitative' ? row.c.note : keyLabel(row.c.key) }}</td>
                      <td class="num">@if (row.c.kind === 'quantitative') { {{ row.c.lookback_average | num: 2 }} <span class="u">{{ row.c.unit }}</span> } @else if (row.c.lookback_state !== undefined) { {{ row.c.lookback_state ? 'Yes' : 'No' }} } @else { — }</td>
                      <td class="num">@if (row.c.kind === 'quantitative') { {{ row.c.project_value | num: 2 }} <span class="u">{{ row.c.unit }}</span> } @else if (row.c.project_state !== undefined) { {{ row.c.project_state ? 'Yes' : 'No' }} } @else if (row.c.new_crops) { {{ row.c.new_crops.join(', ') }} } @else { — }</td>
                      <td class="num">
                        @if (row.c.introduced) { <span class="new">New</span> }
                        @else if (row.c.change_pct !== null && row.c.change_pct !== undefined) { <span [class.big]="abs(row.c.change_pct) > d.threshold_pct">{{ row.c.change_pct > 0 ? '+' : '' }}{{ row.c.change_pct | num: 1 }} %</span> }
                        @else { — }
                      </td>
                      <td>
                        @if (row.c.qualifying && row.appendix1) { <span class="yes"><vc-icon name="check" [size]="12" [stroke]="2.4" />Qualifies</span> }
                        @else if (row.c.qualifying) { <span class="subtle small">Change, not Appendix 1</span> }
                        @else { <span class="no">Within {{ d.threshold_pct | num: 0 }} %</span> }
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="7" class="muted small">Project data exists, but nothing changed compared with the look-back.</td></tr>
                  }
                </tbody>
              </table>
            </div>
          }
          @if (f.productivity; as pr) {
            @if (pr.crops.length) {
              <div class="yield small" [class.warn]="pr.status === 'warning'">
                <span class="subtle">Yield vs look-back (§4 cond. 6):</span>
                @for (c of pr.crops; track c.crop) {
                  <span class="yc" [class]="'yc ' + c.status" [title]="c.note ?? ''">
                    {{ human(c.crop) }}
                    @if (c.change_pct !== null && c.change_pct !== undefined) { <b>{{ signedPct(c.change_pct) }}</b> }
                    @else if (c.status === 'not_compared') { <b>new crop</b> }
                  </span>
                }
              </div>
            }
          }
          @if (practices(f).length) {
            <div class="app small"><span class="subtle">Appendix 1 practices in the qualifying categories:</span> {{ practices(f).join(' · ') }}</div>
          }
        </section>
      }
      <vc-callout tone="info" icon="info" class="mt">
        A field whose only changes are below the threshold doesn’t meet the applicability condition and can’t generate credits from those practices. Quantities are compared with the average over the unbroken look-back years; a yes/no practice counts when it differs from what was done in most look-back years.
      </vc-callout>
    }
  `,
  styles: [`
    .head{display:flex;align-items:center;gap:18px;padding:18px 20px;margin-bottom:16px}
    .ring{flex:none;width:72px;height:72px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;border:6px solid var(--amber-100);color:var(--amber-600)}
    .ring.full{border-color:var(--forest-100);color:var(--forest-700)}
    .ring strong{font-size:22px;line-height:1} .ring span{font-size:11px;color:var(--text-3)}
    .t{flex:1} .t p{margin-top:4px;max-width:760px}
    .fcard{margin-bottom:12px;overflow:hidden}
    .fh{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--border);flex-wrap:wrap}
    .st{flex:none;display:grid;place-items:center;width:28px;height:28px;border-radius:50%}
    .st.qualifies{background:var(--ok-soft);color:var(--forest-600)}
    .st.no_qualifying_change{background:var(--danger-soft);color:var(--red-600)}
    .st.insufficient_data{background:var(--stone-100);color:var(--stone-500)}
    .fn{flex:1;min-width:240px;display:flex;flex-direction:column}
    tr.q td{background:var(--forest-50)}
    .u{font-size:11.5px;color:var(--text-3)}
    .new{font-size:11.5px;font-weight:600;padding:2px 8px;border-radius:999px;background:var(--sky-100);color:var(--sky-600)}
    .big{font-weight:600;color:var(--forest-700)}
    .yes{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600;color:var(--forest-700)}
    .no{font-size:12px;color:var(--text-3)}
    .app{padding:10px 18px;border-top:1px solid var(--border);background:var(--surface-2);color:var(--stone-700)}
    .mt{display:flex;margin-top:4px}
    .mb{display:flex;margin-bottom:16px}
    .yield{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:10px 18px;border-top:1px solid var(--border)}
    .yield.warn{background:var(--warn-soft)}
    .yc{display:inline-flex;gap:6px;align-items:center;padding:2px 10px;border-radius:999px;background:var(--stone-100);color:var(--stone-700)}
    .yc b{font-weight:600}
    .yc.ok b{color:var(--forest-700)}
    .yc.watch{background:var(--amber-100);color:var(--amber-600)}
    .yc.decline{background:var(--danger-soft);color:var(--red-600)}
  `],
})
export class PracticeTab {
  private api = inject(ApiService);
  projectId = input.required<string>();
  fields = input<FieldLite[]>([]);
  active = input(false);
  data = signal<PracticeChange | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  human = human;
  keyLabel = keyLabel;
  private loadedFor = '';

  constructor() {
    effect(() => {
      const pid = this.projectId();
      if (this.active() && pid !== this.loadedFor) untracked(() => this.load());
    });
  }

  load() {
    this.loadedFor = this.projectId();
    this.loading.set(true);
    this.error.set(null);
    this.api.get<PracticeChange>(`/projects/${this.projectId()}/practice-change`).subscribe({
      next: d => { this.data.set(d); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  rowsOf(f: PracticeField) {
    const out: { label: string; appendix1: boolean; first: boolean; year: number; c: Change }[] = [];
    for (const cat of f.categories) {
      let first = true;
      for (const y of cat.years) for (const c of y.changes) { out.push({ label: cat.label, appendix1: cat.appendix1, first, year: y.year, c }); first = false; }
    }
    return out;
  }
  practices(f: PracticeField) { return [...new Set(f.categories.filter(c => c.qualifying).flatMap(c => c.appendix1_practices))].slice(0, 6); }
  range(ys: number[]) { return ys.length ? (ys.length === 1 ? String(ys[0]) : `${ys[0]}–${ys[ys.length - 1]}`) : 'none'; }
  abs(v: number) { return Math.abs(v); }
  signedPct(v: number) {
    const r = Math.round(v * 10) / 10;
    return r === 0 ? '0 %' : `${r > 0 ? '+' : '−'}${Math.abs(r).toFixed(1).replace(/\.0$/, '')} %`;
  }
}
