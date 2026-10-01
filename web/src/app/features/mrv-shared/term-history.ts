import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AgoPipe, DayPipe, NumPipe } from '../../core/format';
import { Icon } from '../../ui/icon';
import { Badge, Empty, ErrorBox, Hash, Loading, Modal } from '../../ui/kit';
import { People } from '../calculations/calc.types';
import { DraftTerm, TERM_NAMES } from './ui';

export interface TermComputation {
  id: string; project_id: string; term: string; period_label: string; method: string;
  inputs: Record<string, unknown>; results: Record<string, unknown>; rule_pack_id: string | null;
  term_estimate_id: string; snapshot_sha256: string; created_by: string | null; created_at: string;
}

/** Frozen platform computations behind published terms (GET /projects/{pid}/term-computations), with the term's status. */
@Component({
  selector: 'vc-term-history',
  imports: [Icon, Badge, Empty, ErrorBox, Loading, Modal, Hash, RouterLink, NumPipe, DayPipe, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="card-head">
        <h3>{{ title() }}</h3>
        <span class="subtle small">Each publish freezes its inputs and results with a fingerprint</span>
        <button class="btn btn-ghost btn-sm" (click)="load()" [disabled]="loading()" aria-label="Refresh"><vc-icon name="refresh" [size]="14" /></button>
      </div>
      @if (loading()) {
        <vc-loading [rows]="3" />
      } @else if (error()) {
        <div class="card-body"><vc-error title="Couldn't load published computations" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error></div>
      } @else if (!rows().length) {
        <vc-empty icon="history" title="Nothing published yet" [text]="emptyText()" />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Term</th><th>Period</th><th>Method</th><th class="num">Value</th><th>Term status</th><th>Published</th><th></th></tr></thead>
            <tbody>
              @for (r of rows(); track r.c.id) {
                <tr class="clickable" (click)="open.set(r.c)">
                  <td><strong class="tn">{{ name(r.c.term) }}</strong></td>
                  <td class="nowrap">{{ r.c.period_label }}</td>
                  <td class="small muted meth">{{ r.c.method }}</td>
                  <td class="num nowrap">@if (r.t) { <strong>{{ r.t.value_t_co2e | num: 3 }}</strong> <span class="u">tCO₂e</span> } @else { — }</td>
                  <td>@if (r.t) { <vc-badge [status]="r.t.status" /> <span class="subtle small">v{{ r.t.version }}</span> } @else { <span class="subtle small">—</span> }</td>
                  <td class="nowrap small">{{ people.name(r.c.created_by, 'Unknown') }}<div class="subtle" [title]="r.c.created_at | day: true">{{ r.c.created_at | ago }}</div></td>
                  <td class="go"><vc-icon name="chevron-right" [size]="15" /></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="card-foot foot">
          <span class="subtle small">Draft terms are approved by a second person under Calculations → Decided terms.</span>
          <span class="spacer"></span>
          <a class="btn btn-ghost btn-sm" routerLink="/app/calculations" [queryParams]="{ tab: 'terms' }">Decided terms<vc-icon name="arrow-right" [size]="14" /></a>
        </div>
      }
    </section>

    <vc-modal [open]="!!open()" (closed)="open.set(null)" [drawer]="true" width="620px" [title]="open() ? name(open()!.term) : ''" [subtitle]="open() ? 'Period ' + open()!.period_label + ' · ' + open()!.method : ''">
      @if (open(); as c) {
        <div class="stack" style="--gap:16px">
          <dl class="kv">
            <dt>Computation</dt><dd class="mono small">{{ c.id }}</dd>
            <dt>Snapshot</dt><dd><vc-hash [value]="c.snapshot_sha256" /></dd>
            <dt>Term estimate</dt><dd class="mono small">{{ c.term_estimate_id }}</dd>
            <dt>Rule pack</dt><dd class="mono small">{{ c.rule_pack_id ?? '—' }}</dd>
            <dt>Published</dt><dd>{{ people.name(c.created_by, 'Unknown') }} · {{ c.created_at | day: true }}</dd>
          </dl>
          <div>
            <div class="lbl">Results</div>
            <pre class="json">{{ json(c.results) }}</pre>
          </div>
          <div>
            <div class="lbl">Inputs</div>
            <pre class="json">{{ json(c.inputs) }}</pre>
          </div>
        </div>
      }
    </vc-modal>
  `,
  styles: [`
    .tn{font-weight:500}
    .meth{max-width:260px}
    .u{font-size:11.5px;color:var(--text-3)}
    .go{color:var(--text-3);width:28px}
    .foot{justify-content:flex-start}
    .lbl{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);margin-bottom:6px}
    .json{margin:0;max-height:320px;overflow:auto;padding:12px;border-radius:var(--radius-sm);background:var(--sand-50);border:1px solid var(--border);font:12px/1.5 var(--mono);color:var(--stone-800);white-space:pre-wrap;word-break:break-word}
  `],
})
export class TermHistory {
  private api = inject(ApiService);
  people = inject(People);
  projectId = input.required<string>();
  terms = input<string[]>([]);
  title = input('Published computations');
  emptyText = input('Compute a preview, then publish it as a draft term for a colleague to approve.');
  /** Bump to reload after a publish. */
  refresh = input(0);

  loading = signal(true);
  error = signal<string | null>(null);
  comps = signal<TermComputation[]>([]);
  estimates = signal<DraftTerm[]>([]);
  open = signal<TermComputation | null>(null);

  rows = computed(() => {
    const byId = new Map(this.estimates().map(t => [t.id, t]));
    const keep = new Set(this.terms());
    return this.comps().filter(c => !keep.size || keep.has(c.term)).slice().reverse().map(c => ({ c, t: byId.get(c.term_estimate_id) ?? null }));
  });

  constructor() {
    this.people.load();
    effect(() => {
      this.projectId();
      this.refresh();
      untracked(() => this.load());
    });
  }

  load() {
    const pid = this.projectId();
    if (!pid) return;
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      comps: this.api.get<TermComputation[]>(`/projects/${pid}/term-computations`),
      terms: this.api.get<DraftTerm[]>(`/projects/${pid}/terms`),
    }).subscribe({
      next: r => { this.comps.set(r.comps); this.estimates.set(r.terms); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  name(t: string) { return TERM_NAMES[t] ?? t.replace(/_/g, ' '); }
  json(v: unknown) { return JSON.stringify(v, null, 2); }
}
