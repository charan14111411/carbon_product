import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, of, catchError } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe } from '../../core/format';
import { ProjectContext } from '../../core/project-context.service';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Empty, ErrorBox, Loading, PageHeader, Progress, TabItem, Tabs } from '../../ui/kit';
import { Deviations } from './deviations';
import { CreatePack } from './create-pack';
import { PackDetail, PackHead, Readiness } from './methodology-data';

@Component({
  selector: 'vc-packs-page',
  imports: [PageHeader, Loading, ErrorBox, Empty, Badge, Progress, Icon, CreatePack, DayPipe, Tabs, Deviations],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Methodology rules" eyebrow="Measurement · Gate 0"
      subtitle="Nothing is calculated until the methodology's rules are entered with their sources and approved by a second person. Values are never assumed.">
      @if (auth.can('rules.edit')) {
        <button actions class="btn btn-primary" (click)="createOpen.set(true)"><vc-icon name="plus" />New rule pack</button>
      }
    </vc-page-header>

    <vc-tabs [tabs]="tabs" [active]="tab()" (activeChange)="setTab($event)" />

    @if (tab() === 'deviations') {
      <vc-deviations />
    } @else {
    @if (projectPack(); as pp) {
      <div class="assigned card">
        <span class="ic"><vc-icon name="briefcase" [size]="16" /></span>
        <div class="grow">
          <div class="small subtle">Current project · {{ ctx.current()?.code }}</div>
          <div><strong>{{ ctx.current()?.name }}</strong> follows <strong>{{ ctx.current()?.methodology_code }} v{{ ctx.current()?.methodology_version }}</strong></div>
        </div>
        @if (pp.pack) {
          <span class="muted small">Uses</span>
          <button class="btn btn-secondary btn-sm" (click)="open(pp.pack.id)"><vc-icon name="lock" [size]="13" />{{ pp.pack.label }}</button>
        } @else {
          <vc-badge status="warning">No approved pack assigned</vc-badge>
        }
      </div>
    }

    <section class="card">
      @if (loading()) { <vc-loading [rows]="5" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load rule packs" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error></div> }
      @else if (!packs().length) {
        <vc-empty icon="scale" title="No rule packs yet"
          text="Create a rule pack for the methodology your project follows, then enter each value from the published document.">
          @if (auth.can('rules.edit')) { <button class="btn btn-primary" (click)="createOpen.set(true)"><vc-icon name="plus" />New rule pack</button> }
        </vc-empty>
      } @else {
        <ul class="packs">
          @for (p of sorted(); track p.id) {
            <li class="pack" (click)="open(p.id)" tabindex="0" (keydown.enter)="open(p.id)">
              <div class="id">
                <span class="st" [class]="'st ' + p.status"><vc-icon [name]="p.status === 'approved' ? 'lock' : p.status === 'retired' ? 'archive' : 'pencil'" [size]="15" /></span>
                <div>
                  <div class="lbl"><span class="mono">{{ p.methodology_code }}</span> v{{ p.methodology_version }} <span class="rev">rev {{ p.revision }}</span></div>
                  <div class="ttl">{{ p.title }}</div>
                </div>
              </div>
              <div class="prog">
                @if (ready()[p.id]; as r) {
                  <div class="pl"><span class="num"><strong>{{ r.answered }}</strong> / {{ r.total }} answered</span>
                    @if (r.outstanding.length) { <span class="out">{{ r.outstanding.length }} required outstanding</span> } @else { <span class="okk">All required answered</span> }
                  </div>
                  <vc-progress [value]="r.answered" [max]="r.total" [tone]="r.outstanding.length ? 'warn' : 'ok'" />
                } @else { <div class="subtle small">{{ p.outstanding_count ?? '—' }} required outstanding</div> }
              </div>
              <div class="who small">
                <div><span class="subtle">Created by</span> {{ p.created_by ?? '—' }}</div>
                @if (p.approved_by) { <div><span class="subtle">Approved by</span> {{ p.approved_by }} · {{ p.approved_at | day }}</div> }
                @else { <div class="subtle">{{ p.created_at | day }}</div> }
              </div>
              <vc-badge [status]="p.status" />
              <vc-icon name="chevron-right" [size]="16" class="chev" />
            </li>
          }
        </ul>
      }
    </section>
    }

    <vc-create-pack [(open)]="createOpen" [packs]="packs()" (created)="onCreated($event)" />
  `,
  styles: [`
    .assigned{display:flex;align-items:center;gap:12px;padding:12px 16px;margin-bottom:16px}
    .assigned .ic{display:grid;place-items:center;width:34px;height:34px;border-radius:9px;background:var(--forest-50);color:var(--forest-600)}
    .grow{flex:1;min-width:0}
    .packs{list-style:none;margin:0;padding:0}
    .pack{display:grid;grid-template-columns:minmax(260px,1.4fr) minmax(200px,1fr) minmax(170px,.8fr) 90px 20px;gap:20px;align-items:center;padding:16px 20px;border-bottom:1px solid var(--stone-100);cursor:pointer}
    .pack:last-child{border-bottom:0}
    .pack:hover{background:var(--forest-50)}
    .pack:focus-visible{outline:none;box-shadow:inset var(--focus)}
    @media (max-width: 1000px){.pack{grid-template-columns:1fr 1fr;}.who,.chev{display:none}}
    .id{display:flex;gap:12px;align-items:center;min-width:0}
    .st{display:grid;place-items:center;width:36px;height:36px;border-radius:10px;flex:none;background:var(--sand-200);color:var(--stone-600)}
    .st.approved{background:var(--forest-100);color:var(--forest-700)} .st.draft{background:var(--amber-100);color:var(--amber-600)}
    .lbl{font-weight:600} .rev{font-weight:500;color:var(--text-3);font-size:12.5px;margin-left:2px}
    .ttl{font-size:13px;color:var(--text-2);margin-top:1px}
    .prog{display:flex;flex-direction:column;gap:6px}
    .pl{display:flex;justify-content:space-between;gap:8px;font-size:12.5px}
    .out{color:var(--amber-600)} .okk{color:var(--forest-600)}
    .who{display:flex;flex-direction:column;gap:2px;color:var(--stone-700)}
    .chev{color:var(--stone-400)}
  `],
})
export class PacksPage {
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private qp = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  tab = computed(() => (this.qp().get('tab') === 'deviations' ? 'deviations' : 'packs'));
  tabs: TabItem[] = [{ key: 'packs', label: 'Rule packs' }, { key: 'deviations', label: 'Interpretations & deviations' }];
  auth = inject(AuthService);
  ctx = inject(ProjectContext);

  packs = signal<PackHead[]>([]);
  ready = signal<Record<string, Readiness>>({});
  loading = signal(true);
  error = signal<string | null>(null);
  createOpen = signal(false);
  projectRulePackId = signal<string | null | undefined>(undefined);

  sorted = computed(() => {
    const rank: Record<string, number> = { draft: 0, approved: 1, retired: 2 };
    return [...this.packs()].sort((a, b) => (rank[a.status] ?? 3) - (rank[b.status] ?? 3) || b.created_at.localeCompare(a.created_at));
  });
  projectPack = computed(() => {
    const id = this.projectRulePackId();
    if (id === undefined || !this.ctx.current()) return null;
    return { pack: this.packs().find(p => p.id === id) ?? null };
  });

  constructor() {
    this.load();
    const pid = this.ctx.currentId();
    if (pid) {
      this.api.get<{ rule_pack_id: string | null }>(`/projects/${pid}`).subscribe({
        next: p => this.projectRulePackId.set(p.rule_pack_id), error: () => {},
      });
    }
  }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<PackHead[]>('/rule-packs').subscribe({
      next: r => {
        this.packs.set(r);
        this.loading.set(false);
        if (r.length) {
          forkJoin(r.map(p => this.api.get<Readiness>(`/rule-packs/${p.id}/readiness`).pipe(catchError(() => of(null))))).subscribe(list => {
            const m: Record<string, Readiness> = {};
            list.forEach((x, i) => { if (x) m[r[i].id] = x; });
            this.ready.set(m);
          });
        }
      },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  open(id: string) { this.router.navigate(['/app/methodology', id]); }
  setTab(t: string) { this.router.navigate([], { relativeTo: this.route, queryParams: { tab: t === 'packs' ? null : t }, queryParamsHandling: 'merge' }); }

  onCreated(p: PackDetail) {
    this.toast.success(`${p.label} created`, 'Enter each value with its source, then ask a colleague to approve.');
    this.open(p.id);
  }
}
