import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { apiMessage } from '../credits/credit-ui';
import { Household, RELATIONS } from './household-types';
import { FarmerDirectory, FarmerPicker } from './lookups';

interface DraftMember { kind: 'farmer' | 'name'; farmer_id: string | null; name: string; relation: string }

@Component({
  selector: 'vc-households-page',
  imports: [...KIT, FormsModule, DayPipe, FarmerPicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Households" eyebrow="Programmes"
      subtitle="Farming families as one unit: who heads the household, who else belongs to it and where they live. A registered farmer belongs to one active household at a time.">
      @if (canManage) { <button actions class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New household</button> }
    </vc-page-header>

    <div class="filters">
      <div class="search">
        <vc-icon name="search" [size]="15" />
        <input class="input" placeholder="Search by household, head of household or code…" [ngModel]="q()" (ngModelChange)="q.set($event)" />
      </div>
      <select class="input vf" [ngModel]="village()" (ngModelChange)="village.set($event)" aria-label="Village">
        <option value="">All villages</option>
        @for (v of villages(); track v) { <option [value]="v">{{ v }}</option> }
      </select>
      <div class="seg">
        @for (s of statuses; track s.key) {
          <button type="button" [class.on]="status() === s.key" (click)="status.set(s.key)">{{ s.label }}<span class="c num">{{ count(s.key) }}</span></button>
        }
      </div>
    </div>

    <section class="card">
      @if (loading()) { <vc-loading [rows]="6" /> }
      @else if (error()) { <div class="card-body"><vc-error title="Couldn't load households" [message]="error()!" /></div> }
      @else if (!rows().length) {
        <vc-empty icon="home" [title]="all().length ? 'No matching households' : 'No households yet'"
          [text]="all().length ? 'Try a different search or filter.' : 'Group farmers into households to see who farms together and to avoid enrolling the same family twice.'">
          @if (!all().length && canManage) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New household</button> }
        </vc-empty>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Household</th><th>Head of household</th><th>Village</th><th class="num">Members</th><th>People</th><th>Status</th><th>Created</th><th></th></tr></thead>
            <tbody>
              @for (h of rows(); track h.id) {
                <tr class="clickable" (click)="router.navigate(['/app/households', h.id])">
                  <td><div class="hh"><span class="mono small subtle">{{ h.code }}</span><strong>{{ h.name || (h.head?.name ?? 'Household') }}</strong></div></td>
                  <td>{{ h.head?.name ?? '—' }} <span class="subtle small mono">{{ h.head?.code }}</span></td>
                  <td>{{ h.village || '—' }}<span class="subtle small">@if (h.district) { · {{ h.district }} }</span></td>
                  <td class="num">{{ h.member_count }}</td>
                  <td><div class="av">@for (m of h.members.slice(0, 5); track m.id) { <span [title]="m.name" [class.reg]="!!m.farmer_id">{{ ini(m.name) }}</span> }
                    @if (h.members.length > 5) { <span class="more">+{{ h.members.length - 5 }}</span> }</div></td>
                  <td><vc-badge [status]="h.status" /></td>
                  <td class="nowrap subtle">{{ h.created_at | day }}</td>
                  <td class="num"><vc-icon name="chevron-right" class="subtle" /></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <vc-modal [(open)]="createOpen" [drawer]="true" width="560px" title="New household" subtitle="Start with the head of household; add the rest of the family now or later.">
      <form class="form-grid" id="hhCreate" (ngSubmit)="create()">
        <div class="field span-2"><label>Head of household</label>
          <vcx-farmer-picker [(value)]="f.head" [exclude]="memberFarmerIds()" (valueChange)="headChanged()" />
          <span class="hint">Must be a registered farmer who isn't already in another active household.</span></div>
        <div class="field span-2"><label for="hn">Household name <span class="subtle">(optional)</span></label>
          <input id="hn" class="input" name="hn" [(ngModel)]="f.name" placeholder="e.g. Gowda family, Hosahalli" /></div>
        <div class="field"><label for="hv">Village</label><input id="hv" class="input" name="hv" [(ngModel)]="f.village" /></div>
        <div class="field"><label for="hd">District</label><input id="hd" class="input" name="hd" [(ngModel)]="f.district" /></div>
        <div class="field span-2"><label for="hs">State</label><input id="hs" class="input" name="hs" [(ngModel)]="f.state" />
          <span class="hint">Taken from the head of household's record; change it only if the family lives elsewhere.</span></div>

        <div class="span-2 mh"><h3>Other members</h3><span class="spacer"></span>
          <button type="button" class="btn btn-secondary btn-sm" (click)="addMember()"><vc-icon name="plus" [size]="14" />Add member</button></div>
        @for (m of f.members; track $index; let i = $index) {
          <div class="span-2 mrow">
            <div class="kind">
              <button type="button" [class.on]="m.kind === 'farmer'" (click)="m.kind = 'farmer'; m.name = ''">Registered farmer</button>
              <button type="button" [class.on]="m.kind === 'name'" (click)="m.kind = 'name'; m.farmer_id = null">Not registered</button>
            </div>
            <div class="mfields">
              @if (m.kind === 'farmer') { <vcx-farmer-picker [(value)]="m.farmer_id" [exclude]="memberFarmerIds()" /> }
              @else { <input class="input" [name]="'mn' + i" [(ngModel)]="m.name" placeholder="Full name" /> }
              <select class="input" [name]="'mr' + i" [(ngModel)]="m.relation" aria-label="Relation to head">
                @for (r of relations; track r.key) { <option [value]="r.key">{{ r.label }}</option> }
              </select>
              <button type="button" class="btn btn-ghost btn-icon" (click)="f.members.splice(i, 1)" aria-label="Remove member"><vc-icon name="trash" [size]="15" /></button>
            </div>
          </div>
        } @empty { <p class="span-2 muted small">No other members yet. You can add them from the household page later.</p> }
        <div class="field span-2"><label for="hno">Notes <span class="subtle">(optional)</span></label><textarea id="hno" class="input" name="hno" rows="3" [(ngModel)]="f.notes"></textarea></div>
        @if (formError()) { <div class="span-2"><vc-error title="Household not created" [message]="formError()!" /></div> }
      </form>
      <ng-container footer>
        <button class="btn btn-ghost" type="button" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="hhCreate" [disabled]="saving() || !f.head">{{ saving() ? 'Creating…' : 'Create household' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .filters{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;align-items:center}
    .search{position:relative;flex:1;min-width:240px;max-width:420px}
    .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)} .search .input{padding-left:34px}
    .vf{width:200px}
    .seg{display:inline-flex;background:var(--surface);border:1px solid var(--border-strong);border-radius:8px;padding:3px;gap:2px}
    .seg button{border:0;background:none;font:500 13px var(--font);padding:6px 12px;border-radius:6px;color:var(--stone-600);cursor:pointer;display:inline-flex;gap:6px;align-items:center}
    .seg button.on{background:var(--forest-50);color:var(--forest-700);box-shadow:inset 0 0 0 1px var(--forest-200)}
    .seg .c{font-size:11px;color:var(--text-3)}
    .hh{display:flex;flex-direction:column;line-height:1.35}
    .av{display:flex} .av span{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;margin-left:-6px;border:2px solid var(--surface);background:var(--sand-200);color:var(--stone-700);font-size:10px;font-weight:600}
    .av span:first-child{margin-left:0} .av span.reg{background:var(--forest-100);color:var(--forest-700)} .av .more{background:var(--stone-100)}
    .mh{display:flex;align-items:center;gap:8px;margin-top:8px;padding-top:14px;border-top:1px solid var(--border)}
    .mrow{display:flex;flex-direction:column;gap:8px;padding:12px;border:1px solid var(--border);border-radius:8px;background:var(--surface-2)}
    .kind{display:inline-flex;gap:4px} .kind button{border:1px solid var(--border-strong);background:var(--surface);border-radius:6px;padding:4px 10px;font:500 12.5px var(--font);color:var(--stone-600);cursor:pointer}
    .kind button.on{border-color:var(--forest-400);background:var(--forest-50);color:var(--forest-700)}
    .mfields{display:grid;grid-template-columns:1fr 170px 36px;gap:8px;align-items:start}
    @media (max-width:720px){.mfields{grid-template-columns:1fr}}
  `],
})
export class HouseholdsPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  private dir = inject(FarmerDirectory);
  router = inject(Router);
  canManage = this.auth.can('farmers.manage');
  relations = RELATIONS;
  statuses = [{ key: 'active', label: 'Active' }, { key: 'inactive', label: 'Inactive' }, { key: '', label: 'All' }];

  all = signal<Household[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  q = signal('');
  village = signal('');
  status = signal('active');
  villages = computed(() => [...new Set(this.all().map(h => h.village).filter((v): v is string => !!v))].sort());
  rows = computed(() => {
    const q = this.q().trim().toLowerCase();
    return this.all().filter(h => (!this.status() || h.status === this.status()) && (!this.village() || h.village === this.village()) &&
      (!q || `${h.code} ${h.name} ${h.head?.name ?? ''} ${h.head?.code ?? ''}`.toLowerCase().includes(q)));
  });

  createOpen = signal(false);
  saving = signal(false);
  formError = signal<string | null>(null);
  f = this.blank();

  constructor() { this.load(); }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<Household[]>('/households').subscribe({
      next: r => { this.all.set(r); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
  count(s: string) { return this.all().filter(h => !s || h.status === s).length; }
  ini(n: string) { return (n || '?').split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase(); }

  private blank() {
    return { head: null as string | null, name: '', village: '', district: '', state: '', notes: '', members: [] as DraftMember[] };
  }
  memberFarmerIds() { return [this.f.head, ...this.f.members.map(m => m.farmer_id)].filter((x): x is string => !!x); }
  openCreate() { this.f = this.blank(); this.formError.set(null); this.createOpen.set(true); }
  headChanged() {
    const h = this.f.head ? this.dir.byId().get(this.f.head) : null;
    if (h) { this.f.village = h.village; this.f.district = h.district; this.f.state = h.state; }
  }
  addMember() { this.f.members.push({ kind: 'farmer', farmer_id: null, name: '', relation: 'spouse' }); }

  create() {
    if (!this.f.head) return;
    this.saving.set(true);
    this.formError.set(null);
    const members = this.f.members.filter(m => (m.kind === 'farmer' ? m.farmer_id : m.name.trim()))
      .map(m => (m.kind === 'farmer' ? { farmer_id: m.farmer_id, relation: m.relation } : { name: m.name.trim(), relation: m.relation }));
    this.api.post<Household>('/households', {
      head_farmer_id: this.f.head, name: this.f.name.trim(), village: this.f.village.trim() || null,
      district: this.f.district.trim() || null, state: this.f.state.trim() || null, notes: this.f.notes.trim(), members,
    }).subscribe({
      next: h => { this.saving.set(false); this.createOpen.set(false); this.toast.success(`Household ${h.code} created`); this.router.navigate(['/app/households', h.id]); },
      error: (e: ApiError) => { this.saving.set(false); this.formError.set(apiMessage(e)); },
    });
  }
}
