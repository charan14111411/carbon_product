import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { apiMessage } from '../credits/credit-ui';
import { ConfirmDialog } from '../programmes/confirm';
import { Household, HouseholdMember, RELATIONS, relationKn, relationLabel } from './household-types';
import { FarmerPicker } from './lookups';

@Component({
  selector: 'vc-household-detail',
  imports: [...KIT, FormsModule, RouterLink, DayPipe, FarmerPicker, ConfirmDialog],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/app/households" class="back"><vc-icon name="arrow-left" [size]="15" />All households</a>
    @if (loading() && !h()) { <div class="card"><vc-loading [rows]="6" /></div> }
    @else if (error()) { <vc-error title="Couldn't load the household" [message]="error()!" /> }
    @else if (h(); as h) {
      <vc-page-header [title]="h.name || ('Household of ' + (h.head?.name ?? ''))" [eyebrow]="h.code"
        [subtitle]="loc(h)">
        @if (canManage) {
          <button actions class="btn btn-secondary" (click)="openEdit(h)"><vc-icon name="pencil" />Edit household</button>
        }
      </vc-page-header>

      <div class="layout">
        <section class="card">
          <div class="card-head"><h3>Members</h3><span class="subtle small">{{ h.member_count }} {{ h.member_count === 1 ? 'person' : 'people' }}</span></div>
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Name</th><th>Relation to head</th><th>Registered farmer</th><th>Village</th><th></th></tr></thead>
              <tbody>
                @for (m of ordered(); track m.id) {
                  <tr>
                    <td><div class="who"><span class="av" [class.head]="m.relation === 'head'">{{ ini(m.name) }}</span><strong>{{ m.name }}</strong></div></td>
                    <td>@if (m.relation === 'head') { <span class="headb"><vc-icon name="home" [size]="12" />Head of household</span> } @else { {{ rel(m.relation) }} }
                      <span class="kn small" lang="kn">{{ relKn(m.relation) }}</span></td>
                    <td>@if (m.farmer; as f) { <a [routerLink]="['/app/farmers', f.id]" class="mono small">{{ f.code }}</a> <vc-badge [status]="f.status" style="margin-left:6px" /> }
                      @else { <span class="subtle small">Not registered</span> }</td>
                    <td>{{ m.farmer?.village || '—' }}</td>
                    <td class="num">
                      @if (canManage && m.relation !== 'head' && h.status === 'active') {
                        <button class="btn btn-ghost btn-sm" (click)="removing.set(m)"><vc-icon name="trash" [size]="13" />Remove</button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          @if (canManage && h.status === 'active') {
            <div class="card-foot addf">
              <div class="kind">
                <button type="button" [class.on]="add.kind === 'farmer'" (click)="add.kind = 'farmer'; add.name = ''">Registered farmer</button>
                <button type="button" [class.on]="add.kind === 'name'" (click)="add.kind = 'name'; add.farmer_id = null">Not registered</button>
              </div>
              <div class="addrow">
                @if (add.kind === 'farmer') { <vcx-farmer-picker [(value)]="add.farmer_id" [exclude]="memberIds()" placeholder="Find a registered farmer…" /> }
                @else { <input class="input" [(ngModel)]="add.name" placeholder="Full name of the family member" /> }
                <select class="input" [(ngModel)]="add.relation" aria-label="Relation">@for (r of relations; track r.key) { <option [value]="r.key">{{ r.label }}</option> }</select>
                <button class="btn btn-primary" [disabled]="busy() || (add.kind === 'farmer' ? !add.farmer_id : add.name.trim().length < 2)" (click)="addMember(h)"><vc-icon name="user-plus" [size]="15" />Add</button>
              </div>
              @if (addError()) { <vc-error title="Member not added" [message]="addError()!" /> }
            </div>
          }
        </section>

        <aside class="stack">
          <section class="card card-pad">
            <h3 style="margin-bottom:12px">Details</h3>
            <dl class="kv">
              <dt>Status</dt><dd><vc-badge [status]="h.status" /></dd>
              <dt>Head</dt><dd>{{ h.head?.name }} <span class="mono small subtle">{{ h.head?.code }}</span></dd>
              <dt>Village</dt><dd>{{ h.village || '—' }}</dd>
              <dt>District</dt><dd>{{ h.district || '—' }}</dd>
              <dt>State</dt><dd>{{ h.state || '—' }}</dd>
              <dt>Created</dt><dd>{{ h.created_at | day }}</dd>
            </dl>
            @if (h.notes) { <p class="notes">{{ h.notes }}</p> }
          </section>
          <vc-callout tone="info" icon="info">A registered farmer can belong to only one active household. To move someone, remove them here first.</vc-callout>
          @if (h.status === 'inactive') { <vc-callout tone="warn" icon="alert">This household is inactive. Reactivate it to add members or change the head.</vc-callout> }
        </aside>
      </div>
    }

    <vc-modal [(open)]="editOpen" [drawer]="true" width="480px" title="Edit household" [subtitle]="h()?.code ?? ''">
      <form class="form-grid" id="hhEdit" (ngSubmit)="saveEdit()">
        <div class="field span-2"><label for="en">Household name</label><input id="en" class="input" name="en" [(ngModel)]="e.name" /></div>
        <div class="field span-2"><label for="eh">Head of household</label>
          <select id="eh" class="input" name="eh" [(ngModel)]="e.head" [disabled]="e.status !== 'active'">
            @for (m of registered(); track m.id) { <option [value]="m.farmer_id">{{ m.name }} · {{ rel(m.relation) }}</option> }
          </select>
          <span class="hint">Only registered farmers in this household can head it. The previous head stays as a member.</span></div>
        <div class="field"><label for="ev">Village</label><input id="ev" class="input" name="ev" [(ngModel)]="e.village" /></div>
        <div class="field"><label for="ed">District</label><input id="ed" class="input" name="ed" [(ngModel)]="e.district" /></div>
        <div class="field"><label for="es">State</label><input id="es" class="input" name="es" [(ngModel)]="e.state" /></div>
        <div class="field"><label for="est">Status</label>
          <select id="est" class="input" name="est" [(ngModel)]="e.status"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        <div class="field span-2"><label for="eno">Notes</label><textarea id="eno" class="input" name="eno" rows="3" [(ngModel)]="e.notes"></textarea></div>
        @if (editError()) { <div class="span-2"><vc-error title="Not saved" [message]="editError()!" /></div> }
      </form>
      <ng-container footer>
        <button class="btn btn-ghost" type="button" (click)="editOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="hhEdit" [disabled]="busy()">{{ busy() ? 'Saving…' : 'Save changes' }}</button>
      </ng-container>
    </vc-modal>

    <vc-confirm [open]="!!removing()" (openChange)="!$event && removing.set(null)" title="Remove from household?" tone="danger" confirmLabel="Remove member"
      [message]="(removing()?.name ?? '') + ' will no longer be listed in this household. The history is kept in the audit log, and a registered farmer can then join another household.'"
      [busy]="busy()" (confirmed)="remove()" />
  `,
  styles: [`
    .back{display:inline-flex;align-items:center;gap:6px;font-size:13px;margin-bottom:14px;color:var(--text-2)}
    .layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:16px;align-items:start}
    @media (max-width:1100px){.layout{grid-template-columns:1fr}}
    .who{display:flex;align-items:center;gap:10px}
    .av{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--sand-200);color:var(--stone-700);font-size:11px;font-weight:600;flex:none}
    .av.head{background:var(--forest-600);color:#fff}
    .headb{display:inline-flex;align-items:center;gap:5px;font-weight:500;color:var(--forest-700)}
    .kn{display:block;color:var(--clay-600)}
    .addf{flex-direction:column;align-items:stretch;gap:10px}
    .addrow{display:grid;grid-template-columns:1fr 180px auto;gap:8px}
    @media (max-width:720px){.addrow{grid-template-columns:1fr}}
    .kind{display:inline-flex;gap:4px} .kind button{border:1px solid var(--border-strong);background:var(--surface);border-radius:6px;padding:4px 10px;font:500 12.5px var(--font);color:var(--stone-600);cursor:pointer}
    .kind button.on{border-color:var(--forest-400);background:var(--forest-50);color:var(--forest-700)}
    .notes{margin-top:14px;padding-top:12px;border-top:1px solid var(--border);color:var(--stone-700);white-space:pre-wrap}
  `],
})
export class HouseholdDetailPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  private id = inject(ActivatedRoute).snapshot.paramMap.get('id')!;
  canManage = this.auth.can('farmers.manage');
  relations = RELATIONS;
  rel = relationLabel;
  relKn = relationKn;

  h = signal<Household | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  busy = signal(false);
  addError = signal<string | null>(null);
  removing = signal<HouseholdMember | null>(null);
  add = { kind: 'farmer' as 'farmer' | 'name', farmer_id: null as string | null, name: '', relation: 'spouse' };

  editOpen = signal(false);
  editError = signal<string | null>(null);
  e = { name: '', head: '', village: '', district: '', state: '', status: 'active', notes: '' };

  ordered = computed(() => [...(this.h()?.members ?? [])].sort((a, b) => (a.relation === 'head' ? -1 : b.relation === 'head' ? 1 : 0)));
  registered = computed(() => (this.h()?.members ?? []).filter(m => !!m.farmer_id));
  memberIds = computed(() => (this.h()?.members ?? []).map(m => m.farmer_id).filter((x): x is string => !!x));

  constructor() { this.load(); }

  load() {
    this.loading.set(true);
    this.api.get<Household>(`/households/${this.id}`).subscribe({
      next: h => { this.h.set(h); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
  loc(h: Household) { return [h.village, h.district, h.state].filter(x => !!x).join(', '); }
  ini(n: string) { return (n || '?').split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase(); }

  addMember(h: Household) {
    this.busy.set(true);
    this.addError.set(null);
    const body = this.add.kind === 'farmer' ? { farmer_id: this.add.farmer_id, relation: this.add.relation } : { name: this.add.name.trim(), relation: this.add.relation };
    this.api.post<Household>(`/households/${h.id}/members`, body).subscribe({
      next: r => { this.busy.set(false); this.h.set(r); this.add = { kind: this.add.kind, farmer_id: null, name: '', relation: 'spouse' }; this.toast.success('Member added'); },
      error: (e: ApiError) => { this.busy.set(false); this.addError.set(apiMessage(e)); },
    });
  }
  remove() {
    const m = this.removing();
    const h = this.h();
    if (!m || !h) return;
    this.busy.set(true);
    this.api.delete<Household>(`/households/${h.id}/members/${m.id}`).subscribe({
      next: r => { this.busy.set(false); this.removing.set(null); this.h.set(r); this.toast.success(`${m.name} removed from the household`); },
      error: (e: ApiError) => { this.busy.set(false); this.removing.set(null); this.toast.apiError(e, 'Member not removed'); },
    });
  }
  openEdit(h: Household) {
    this.e = { name: h.name, head: h.head_farmer_id, village: h.village ?? '', district: h.district ?? '', state: h.state ?? '', status: h.status, notes: h.notes };
    this.editError.set(null);
    this.editOpen.set(true);
  }
  saveEdit() {
    const h = this.h();
    if (!h) return;
    this.busy.set(true);
    this.editError.set(null);
    const body: Record<string, unknown> = { name: this.e.name.trim(), village: this.e.village.trim(), district: this.e.district.trim(), state: this.e.state.trim(), status: this.e.status, notes: this.e.notes };
    if (this.e.head && this.e.head !== h.head_farmer_id) body['head_farmer_id'] = this.e.head;
    this.api.patch<Household>(`/households/${h.id}`, body).subscribe({
      next: r => { this.busy.set(false); this.editOpen.set(false); this.h.set(r); this.toast.success('Household updated'); },
      error: (e: ApiError) => { this.busy.set(false); this.editError.set(apiMessage(e)); },
    });
  }
}
