import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AgoPipe, DayPipe, HumanPipe } from '../../core/format';
import { Icon } from '../../ui/icon';
import { Empty, ErrorBox, Loading, PageHeader } from '../../ui/kit';

interface AuditRow {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  by: string;
  at: string;
  reason: string | null;
}

/**
 * Reference pattern for list screens: page header with actions, a filter bar,
 * a card holding the table, and explicit loading / error / empty states.
 */
@Component({
  selector: 'vc-audit-page',
  imports: [FormsModule, PageHeader, Loading, ErrorBox, Empty, Icon, DayPipe, AgoPipe, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Audit log" eyebrow="Administration"
      subtitle="Every create, change and approval in your organisation — who did it and when. Entries can never be edited or deleted.">
      <button actions class="btn btn-secondary" (click)="load()"><vc-icon name="refresh" />Refresh</button>
    </vc-page-header>

    <div class="filters">
      <div class="search">
        <vc-icon name="search" [size]="15" />
        <input class="input" placeholder="Filter by action or person…" [ngModel]="q()" (ngModelChange)="q.set($event)" />
      </div>
      <select class="input" [ngModel]="type()" (ngModelChange)="type.set($event)">
        <option value="">All record types</option>
        @for (t of types(); track t) { <option [value]="t">{{ t }}</option> }
      </select>
    </div>

    <section class="card">
      @if (loading()) {
        <vc-loading [rows]="6" />
      } @else if (error()) {
        <div class="card-body"><vc-error title="Couldn't load the audit log" [message]="error()!" /></div>
      } @else if (!rows().length) {
        <vc-empty icon="history" title="No matching entries" text="Try a different filter." />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>When</th><th>Action</th><th>Record</th><th>By</th><th>Reason</th></tr></thead>
            <tbody>
              @for (r of rows(); track r.id) {
                <tr>
                  <td class="nowrap"><span [title]="r.at | day: true">{{ r.at | ago }}</span></td>
                  <td><code class="act">{{ r.action }}</code></td>
                  <td><span class="muted">{{ r.entity_type | human }}</span> <code class="subtle small">{{ r.entity_id.slice(0, 8) }}</code></td>
                  <td>{{ r.by }}</td>
                  <td class="muted">{{ r.reason || '—' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `,
  styles: [`
    .filters{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap}
    .search{position:relative;flex:1;min-width:240px;max-width:420px}
    .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)}
    .search .input{padding-left:34px}
    .filters select{width:220px}
    .act{font-size:12px;background:var(--sand-100);padding:2px 6px;border-radius:4px;color:var(--stone-800)}
  `],
})
export class AuditPage {
  private api = inject(ApiService);
  all = signal<AuditRow[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  q = signal('');
  type = signal('');

  types = computed(() => [...new Set(this.all().map(r => r.entity_type))].sort());
  rows = computed(() => {
    const q = this.q().toLowerCase().trim();
    return this.all().filter(
      r => (!this.type() || r.entity_type === this.type()) &&
        (!q || r.action.toLowerCase().includes(q) || r.by.toLowerCase().includes(q)),
    );
  });

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<AuditRow[]>('/audit', { limit: 500 }).subscribe({
      next: r => { this.all.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
}
