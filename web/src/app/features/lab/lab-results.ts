import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, HumanPipe, NumPipe } from '../../core/format';
import { Icon } from '../../ui/icon';
import { Badge, DataClass, Empty, ErrorBox, Hash, Loading } from '../../ui/kit';
import { LabContext } from './lab-context';
import { ResultDrawer } from './result-drawer';
import { ANALYTES, LabResult, ResultPage, analyteLabel } from './types';

const PAGE = 100;

@Component({
  selector: 'vc-lab-results',
  imports: [FormsModule, Icon, Badge, DataClass, Empty, ErrorBox, Hash, Loading, ResultDrawer, DayPipe, NumPipe, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters">
      <div class="seg">
        @for (s of statuses; track s.key) {
          <button type="button" [class.on]="status() === s.key" (click)="setStatus(s.key)">{{ s.label }}</button>
        }
      </div>
      <select class="input" [ngModel]="analyte()" (ngModelChange)="analyte.set($event); page.set(1)" aria-label="Analyte">
        <option value="">All analytes</option>
        @for (a of analytes; track a.key) { <option [value]="a.key">{{ a.label }}</option> }
      </select>
      @if (!ctx.scopedLabId() && ctx.labs().length > 1) {
        <select class="input" [ngModel]="labId()" (ngModelChange)="labId.set($event); page.set(1)" aria-label="Lab">
          <option value="">All labs</option>
          @for (l of ctx.labs(); track l.id) { <option [value]="l.id">{{ l.name }}</option> }
        </select>
      }
      <div class="search">
        <vc-icon name="search" [size]="15" />
        <input class="input" placeholder="Filter this page by bag code…" [ngModel]="q()" (ngModelChange)="q.set($event)" />
      </div>
      <div class="spacer"></div>
      <button class="btn btn-secondary" (click)="load()"><vc-icon name="refresh" />Refresh</button>
    </div>

    <section class="card">
      @if (loading()) {
        <vc-loading [rows]="8" />
      } @else if (error()) {
        <div class="card-body"><vc-error title="Couldn't load lab results" [message]="error()!" /></div>
      } @else if (!rows().length) {
        <vc-empty icon="flask" [title]="status() === 'pending' ? 'Nothing awaiting review' : 'No results match'"
          [text]="status() === 'pending' ? 'Every submitted result has been reviewed.' : 'Results appear here as the lab enters or imports them.'" />
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr>
              <th>Bag</th><th>Analyte</th><th class="num">Value</th><th>Method</th><th>Analysed</th><th>Certificate</th><th>Status</th>
            </tr></thead>
            <tbody>
              @for (r of rows(); track r.id) {
                <tr class="clickable" (click)="open.set(r)">
                  <td class="nowrap"><code>{{ r.bag_code }}</code></td>
                  <td class="nowrap">{{ label(r.analyte) }} @if (r.version > 1) { <span class="subtle small">v{{ r.version }}</span> }</td>
                  <td class="num nowrap"><strong>{{ r.value | num: 3 }}</strong>&ngsp;<span class="subtle">{{ r.unit }}</span>&ngsp;<vc-dc [cls]="r.data_class" /></td>
                  <td class="muted nowrap">{{ r.method | human }}</td>
                  <td class="nowrap">{{ r.analysed_on | day }}</td>
                  <td>
                    @if (r.certificate_id) {
                      @if (shas()[r.certificate_id]; as sha) { <vc-hash [value]="sha" /> } @else { <span class="subtle small"><vc-icon name="file-check" [size]="14" /> Attached</span> }
                    } @else { <span class="missing"><vc-icon name="alert" [size]="13" />Missing</span> }
                  </td>
                  <td class="nowrap">
                    <vc-badge [status]="r.status">{{ r.status === 'pending' ? 'Awaiting review' : (r.status | human) }}</vc-badge>
                    @if (r.status !== 'pending') { <vc-icon class="lk" name="lock" [size]="13" [attr.title]="'Frozen'" /> }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div class="card-foot pager">
          <span class="subtle small">{{ (page() - 1) * pageSize + 1 }}–{{ (page() - 1) * pageSize + all().length }} of {{ total() }}</span>
          <div class="spacer"></div>
          <button class="btn btn-secondary btn-sm" [disabled]="page() === 1" (click)="page.set(page() - 1)"><vc-icon name="chevron-left" [size]="14" />Previous</button>
          <button class="btn btn-secondary btn-sm" [disabled]="page() * pageSize >= total()" (click)="page.set(page() + 1)">Next<vc-icon name="chevron-right" [size]="14" /></button>
        </div>
      }
    </section>

    <vc-result-drawer [(result)]="open" (changed)="onChanged($event)" />
  `,
  styles: [`
    .filters{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center}
    .filters select{width:190px}
    .seg{display:flex;background:var(--surface);border:1px solid var(--border-strong);border-radius:var(--radius-sm);padding:3px;gap:2px}
    .seg button{border:0;background:none;font:500 13px var(--font);color:var(--stone-600);padding:0 12px;height:30px;border-radius:5px;cursor:pointer;white-space:nowrap}
    .seg button.on{background:var(--forest-600);color:#fff}
    .search{position:relative;min-width:220px}
    .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)}
    .search .input{padding-left:34px}
    vc-hash{white-space:nowrap}
    .missing{display:inline-flex;align-items:center;gap:4px;font-size:12.5px;color:var(--amber-600)}
    .lk{color:var(--stone-500);margin-left:6px;vertical-align:middle}
    td .subtle.small{display:inline-flex;align-items:center;gap:4px}
    .pager{justify-content:flex-start}
  `],
})
export class LabResults {
  private api = inject(ApiService);
  auth = inject(AuthService);
  ctx = inject(LabContext);
  analytes = ANALYTES;
  pageSize = PAGE;
  statuses = [
    { key: 'pending', label: 'Awaiting review' }, { key: '', label: 'All' }, { key: 'accepted', label: 'Accepted' },
    { key: 'rejected', label: 'Rejected' }, { key: 'voided', label: 'Voided' },
  ];

  status = signal(this.auth.can('lab.review') ? 'pending' : '');
  analyte = signal('');
  labId = signal('');
  q = signal('');
  page = signal(1);
  all = signal<LabResult[]>([]);
  total = signal(0);
  loading = signal(true);
  error = signal<string | null>(null);
  shas = signal<Record<string, string>>({});
  open = signal<LabResult | null>(null);

  rows = computed(() => {
    const q = this.q().trim().toLowerCase();
    return this.all().filter(r => !q || (r.bag_code ?? '').toLowerCase().includes(q) || (r.label_qr ?? '').toLowerCase().includes(q));
  });

  constructor() {
    effect(() => {
      this.status(); this.analyte(); this.labId(); this.page();
      this.load();
    });
  }

  setStatus(s: string) {
    this.status.set(s);
    this.page.set(1);
  }

  label(a: string) { return analyteLabel(a); }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<ResultPage>('/lab-results', {
      status: this.status(), analyte: this.analyte(), lab_id: this.labId(), page: this.page(), page_size: PAGE,
    }).subscribe({
      next: r => { this.all.set(r.items); this.total.set(r.total); this.loading.set(false); this.fetchShas(r.items); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  private fetchShas(items: LabResult[]) {
    const known = this.shas();
    const ids = [...new Set(items.map(i => i.certificate_id).filter((x): x is string => !!x && !known[x]))].slice(0, 60);
    for (const id of ids) {
      this.api.get<{ sha256: string }>(`/evidence/${id}`).subscribe({
        next: e => this.shas.update(m => ({ ...m, [id]: e.sha256 })),
        error: () => {},
      });
    }
  }

  onChanged(r: LabResult) {
    if (r.certificate_id) this.fetchShas([r]);
    this.load();
  }
}
