import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, debounceTime, of, Subject } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, HumanPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Empty, ErrorBox, Loading, Modal, PageHeader, TabItem, Tabs } from '../../ui/kit';
import { fieldMap, formMessage } from '../programmes/form-errors';
import { MemberResult } from './member-result';
import { Farmer, FarmerPage, formatPhone, Fpo, initials, LANGUAGES, MemberLookup } from './types';

const PAGE = 25;

@Component({
  selector: 'vc-farmers-page',
  imports: [FormsModule, PageHeader, Loading, ErrorBox, Empty, Badge, Modal, Tabs, Icon, MemberResult,
    NumPipe, DayPipe, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <vc-page-header title="Farmers" eyebrow="Programmes"
      subtitle="Everyone taking part, their farmer producer organisation and whether they are Varsapradaya members.">
      @if (canManage && tab() === 'farmers') {
        <button actions class="btn btn-primary" (click)="openCreate()"><vc-icon name="user-plus" />Add farmer</button>
      } @else if (canManage) {
        <button actions class="btn btn-primary" (click)="openFpo()"><vc-icon name="plus" />Add FPO</button>
      }
    </vc-page-header>

    <vc-tabs [tabs]="tabs()" [active]="tab()" (activeChange)="setTab($event)" />

    @if (tab() === 'farmers') {
      <div class="filters">
        <div class="search">
          <vc-icon name="search" [size]="15" />
          <input class="input" placeholder="Search name, phone, code or village…" [ngModel]="q()" (ngModelChange)="onSearch($event)" />
        </div>
        <select class="input w" [ngModel]="fpoId()" (ngModelChange)="fpoId.set($event); reload()">
          <option value="">All FPOs</option>
          @for (f of fpos(); track f.id) { <option [value]="f.id">{{ f.name }}</option> }
        </select>
        <select class="input w" [ngModel]="status()" (ngModelChange)="status.set($event); reload()">
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="exited">Exited</option>
        </select>
      </div>

      <section class="card">
        @if (loading()) {
          <vc-loading [rows]="8" />
        } @else if (error()) {
          <div class="card-body"><vc-error title="Couldn't load farmers" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error></div>
        } @else if (!rows().length) {
          @if (q() || fpoId() || status()) {
            <vc-empty icon="search" title="No farmers match" text="Try a different name, phone number or filter." />
          } @else {
            <vc-empty icon="users" title="No farmers yet"
              text="Add the first farmer. If they are already a Varsapradaya member, their farms and devices are linked automatically.">
              @if (canManage) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="user-plus" />Add farmer</button> }
            </vc-empty>
          }
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Farmer</th><th>Code</th><th>Village / district</th><th>FPO</th><th>Membership</th><th>KYC</th><th>Status</th></tr></thead>
              <tbody>
                @for (f of rows(); track f.id) {
                  <tr class="clickable" (click)="open(f)">
                    <td>
                      <div class="who">
                        <span class="av">{{ ini(f.full_name) }}</span>
                        <span class="nm"><strong>{{ f.full_name }}</strong><span class="subtle small num">{{ phone(f.phone) }}</span></span>
                      </div>
                    </td>
                    <td><span class="mono small">{{ f.code }}</span></td>
                    <td>{{ f.village || '—' }}<span class="subtle">{{ f.district ? ', ' + f.district : '' }}</span></td>
                    <td class="muted">{{ fpoName(f.fpo_id) }}</td>
                    <td>
                      @if (f.member_id) { <span class="member"><vc-icon name="verified" [size]="13" />Varsapradaya member</span> }
                      @else { <span class="subtle small">—</span> }
                    </td>
                    <td><vc-badge [status]="kycTone(f.kyc_status)">{{ f.kyc_status | human }}</vc-badge></td>
                    <td><vc-badge [status]="f.status" /></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div class="card-foot pager">
            <span class="small muted num">{{ offset() + 1 }}–{{ offset() + rows().length }} of {{ total() | num: 0 }}</span>
            <span class="spacer"></span>
            <button class="btn btn-secondary btn-sm" [disabled]="offset() === 0" (click)="page(-1)"><vc-icon name="chevron-left" [size]="14" />Previous</button>
            <button class="btn btn-secondary btn-sm" [disabled]="offset() + rows().length >= total()" (click)="page(1)">Next<vc-icon name="chevron-right" [size]="14" /></button>
          </div>
        }
      </section>
    } @else {
      <section class="card">
        @if (fposLoading()) {
          <vc-loading [rows]="5" />
        } @else if (fposError()) {
          <div class="card-body"><vc-error title="Couldn't load FPOs" [message]="fposError()!" /></div>
        } @else if (!fpos().length) {
          <vc-empty icon="building" title="No farmer producer organisations yet"
            text="FPOs group farmers locally. Add one to organise enrolment and payments by collective.">
            @if (canManage) { <button class="btn btn-primary" (click)="openFpo()"><vc-icon name="plus" />Add FPO</button> }
          </vc-empty>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Name</th><th>Registration no.</th><th>District / state</th><th>Contact</th><th>Added</th><th></th></tr></thead>
              <tbody>
                @for (f of fpos(); track f.id) {
                  <tr>
                    <td><strong>{{ f.name }}</strong></td>
                    <td class="mono small">{{ f.registration_no || '—' }}</td>
                    <td>{{ f.district || '—' }}<span class="subtle">{{ f.state ? ', ' + f.state : '' }}</span></td>
                    <td>{{ f.contact_name || '—' }} @if (f.contact_phone) { <span class="subtle small num">· {{ f.contact_phone }}</span> }</td>
                    <td class="nowrap">{{ f.created_at | day }}</td>
                    <td class="num"><button class="btn btn-ghost btn-sm" (click)="showFpoFarmers(f)">View farmers<vc-icon name="arrow-right" [size]="14" /></button></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    }

    <!-- add farmer drawer -->
    <vc-modal [(open)]="createOpen" [drawer]="true" width="520px" title="Add farmer"
      subtitle="Check membership first — members bring their farms and devices with them.">
      <form class="stack" style="--gap:14px" id="farmer-form" (ngSubmit)="create()">
        <div class="field">
          <label for="fph">Mobile number</label>
          <div class="row" style="--gap:8px">
            <input id="fph" class="input num" name="phone" inputmode="tel" [(ngModel)]="form.phone" (ngModelChange)="lookup.set(null)"
              placeholder="+91 98450 12345" [class.invalid]="fe()['phone']" />
            <button type="button" class="btn btn-secondary" (click)="checkMember()" [disabled]="looking() || form.phone.trim().length < 6">
              <vc-icon name="verified" />{{ looking() ? 'Checking…' : 'Check membership' }}
            </button>
          </div>
          @if (fe()['phone']) { <span class="error">{{ fe()['phone'] }}</span> }
          @else { <span class="hint">Checks the Varsapradaya member platform. Nothing is saved until you add the farmer.</span> }
        </div>
        @if (lookupError()) { <vc-error title="Couldn't check membership" [message]="lookupError()!" /> }
        @if (lookup(); as r) { <vc-member-result [result]="r" /> }

        <div class="field">
          <label for="fnm">Full name</label>
          <input id="fnm" class="input" name="name" [(ngModel)]="form.full_name" placeholder="As on their ID" [class.invalid]="fe()['full_name']" />
          @if (fe()['full_name']) { <span class="error">{{ fe()['full_name'] }}</span> }
        </div>
        <div class="form-grid">
          <div class="field"><label for="fvl">Village</label><input id="fvl" class="input" name="village" [(ngModel)]="form.village" /></div>
          <div class="field"><label for="fds">District</label><input id="fds" class="input" name="district" [(ngModel)]="form.district" /></div>
          <div class="field"><label for="fst">State</label><input id="fst" class="input" name="state" [(ngModel)]="form.state" /></div>
          <div class="field">
            <label for="flg">Preferred language</label>
            <select id="flg" class="input" name="language" [(ngModel)]="form.language">
              @for (l of langs; track l[0]) { <option [value]="l[0]">{{ l[1] }}</option> }
            </select>
          </div>
          <div class="field span-2">
            <label for="ffp">FPO <span class="subtle">(optional)</span></label>
            <select id="ffp" class="input" name="fpo" [(ngModel)]="form.fpo_id">
              <option value="">Not part of an FPO</option>
              @for (f of fpos(); track f.id) { <option [value]="f.id">{{ f.name }}</option> }
            </select>
          </div>
        </div>
        @if (lookup()?.is_member) {
          <label class="checkbox"><input type="checkbox" name="link" [(ngModel)]="form.link" />Link to Varsapradaya member {{ lookup()?.member_id }}</label>
        }
        @if (formError()) { <vc-error title="Couldn't add the farmer" [message]="formError()!" /> }
      </form>
      <ng-container footer>
        <button class="btn btn-secondary" type="button" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="farmer-form" [disabled]="saving() || !form.full_name.trim() || form.phone.trim().length < 6">
          {{ saving() ? 'Adding…' : 'Add farmer' }}
        </button>
      </ng-container>
    </vc-modal>

    <!-- add FPO -->
    <vc-modal [(open)]="fpoOpen" title="Add farmer producer organisation" width="560px">
      <form class="form-grid" id="fpo-form" (ngSubmit)="createFpo()">
        <div class="field span-2">
          <label for="on">Name</label>
          <input id="on" class="input" name="name" [(ngModel)]="fpoForm.name" placeholder="Malnad Growers Producer Company" />
        </div>
        <div class="field span-2">
          <label for="or">Registration number <span class="subtle">(optional)</span></label>
          <input id="or" class="input mono" name="reg" [(ngModel)]="fpoForm.registration_no" placeholder="U01100KA2019PTC123456" />
        </div>
        <div class="field"><label for="od">District</label><input id="od" class="input" name="district" [(ngModel)]="fpoForm.district" /></div>
        <div class="field"><label for="os">State</label><input id="os" class="input" name="state" [(ngModel)]="fpoForm.state" /></div>
        <div class="field"><label for="ocn">Contact person</label><input id="ocn" class="input" name="cn" [(ngModel)]="fpoForm.contact_name" /></div>
        <div class="field"><label for="ocp">Contact phone</label><input id="ocp" class="input num" name="cp" [(ngModel)]="fpoForm.contact_phone" /></div>
        @if (fpoError()) { <div class="span-2"><vc-error title="Couldn't add the FPO" [message]="fpoError()!" /></div> }
      </form>
      <ng-container footer>
        <button class="btn btn-secondary" type="button" (click)="fpoOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="fpo-form" [disabled]="saving() || fpoForm.name.trim().length < 2">{{ saving() ? 'Adding…' : 'Add FPO' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .filters{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap}
    .search{position:relative;flex:1;min-width:240px;max-width:420px}
    .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)}
    .search .input{padding-left:34px}
    .w{width:200px}
    .who{display:flex;align-items:center;gap:10px}
    .av{display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:var(--forest-100);color:var(--forest-700);font-size:12px;font-weight:600;flex:none}
    .nm{display:flex;flex-direction:column;line-height:1.3}
    .member{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 9px;border-radius:999px;background:var(--forest-50);border:1px solid var(--forest-200);color:var(--forest-700);font-size:12px;font-weight:500;white-space:nowrap}
    .pager{justify-content:flex-start}
  `],
})
export class FarmersPage {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  canManage = inject(AuthService).can('farmers.manage');
  langs = Object.entries(LANGUAGES);
  ini = initials;
  phone = formatPhone;

  tab = signal(this.route.snapshot.queryParamMap.get('tab') === 'fpos' ? 'fpos' : 'farmers');
  rows = signal<Farmer[]>([]);
  total = signal(0);
  offset = signal(0);
  loading = signal(true);
  error = signal<string | null>(null);
  q = signal('');
  fpoId = signal(this.route.snapshot.queryParamMap.get('fpo') ?? '');
  status = signal('');
  private search$ = new Subject<void>();

  fpos = signal<Fpo[]>([]);
  fposLoading = signal(true);
  fposError = signal<string | null>(null);
  private fpoMap = computed(() => new Map(this.fpos().map(f => [f.id, f.name])));
  tabs = computed<TabItem[]>(() => [
    { key: 'farmers', label: 'Farmers', count: this.total() },
    { key: 'fpos', label: 'FPOs', count: this.fpos().length },
  ]);

  createOpen = signal(false);
  saving = signal(false);
  formError = signal<string | null>(null);
  fe = signal<Record<string, string>>({});
  looking = signal(false);
  lookup = signal<MemberLookup | null>(null);
  lookupError = signal<string | null>(null);
  form = this.blank();

  fpoOpen = signal(false);
  fpoError = signal<string | null>(null);
  fpoForm = this.blankFpo();

  constructor() {
    this.search$.pipe(debounceTime(250)).subscribe(() => this.reload());
    this.load();
    this.loadFpos();
  }

  setTab(t: string) {
    this.tab.set(t);
    this.router.navigate([], { queryParams: { tab: t === 'fpos' ? 'fpos' : null }, replaceUrl: true });
  }

  fpoName(id: string | null) { return id ? (this.fpoMap().get(id) ?? '—') : '—'; }
  kycTone(s: string) { return ({ verified: 'verified', pending: 'pending', failed: 'failed' } as Record<string, string>)[s] ?? 'draft'; }

  onSearch(v: string) { this.q.set(v); this.search$.next(); }
  reload() { this.offset.set(0); this.load(); }
  page(dir: number) { this.offset.set(Math.max(0, this.offset() + dir * PAGE)); this.load(); }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get<FarmerPage>('/farmers', {
      q: this.q().trim(), fpo_id: this.fpoId(), status: this.status(), limit: PAGE, offset: this.offset(),
    }).subscribe({
      next: r => { this.rows.set(r.items); this.total.set(r.total); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }

  loadFpos() {
    this.api.get<Fpo[]>('/fpos').subscribe({
      next: r => { this.fpos.set(r); this.fposLoading.set(false); },
      error: (e: ApiError) => { this.fposError.set(e.message); this.fposLoading.set(false); },
    });
  }

  showFpoFarmers(f: Fpo) {
    this.fpoId.set(f.id);
    this.setTab('farmers');
    this.reload();
  }

  open(f: Farmer) { this.router.navigate(['/app/farmers', f.id]); }

  private blank() {
    return { full_name: '', phone: '', village: '', district: '', state: 'Karnataka', language: 'kn', fpo_id: '', link: true };
  }
  private blankFpo() {
    return { name: '', registration_no: '', district: '', state: 'Karnataka', contact_name: '', contact_phone: '' };
  }

  openCreate() {
    this.form = this.blank();
    this.lookup.set(null);
    this.lookupError.set(null);
    this.formError.set(null);
    this.fe.set({});
    this.createOpen.set(true);
  }

  checkMember() {
    this.looking.set(true);
    this.lookupError.set(null);
    this.api.post<MemberLookup>('/farmers/member-lookup', { phone: this.form.phone.trim() }).subscribe({
      next: r => { this.looking.set(false); this.lookup.set(r); },
      error: (e: ApiError) => { this.looking.set(false); this.lookupError.set(e.message); },
    });
  }

  create() {
    const f = this.form;
    this.saving.set(true);
    this.formError.set(null);
    this.fe.set({});
    this.api.post<Farmer>('/farmers', {
      full_name: f.full_name.trim(), phone: f.phone.trim(), village: f.village.trim(), district: f.district.trim(),
      state: f.state.trim(), language: f.language, fpo_id: f.fpo_id || null,
    }).subscribe({
      next: farmer => {
        const done = (linked: boolean) => {
          this.saving.set(false);
          this.createOpen.set(false);
          this.toast.success('Farmer added', `${farmer.full_name} (${farmer.code})${linked ? ' is linked to their Varsapradaya membership.' : '.'}`);
          this.router.navigate(['/app/farmers', farmer.id]);
        };
        if (f.link && this.lookup()?.is_member) {
          this.api.post<MemberLookup>('/farmers/member-lookup', { phone: farmer.phone, farmer_id: farmer.id })
            .pipe(catchError((e: ApiError) => { this.toast.apiError(e, "Added, but couldn't link membership"); return of(null); }))
            .subscribe(r => done(!!r));
        } else done(false);
      },
      error: (e: ApiError) => {
        this.saving.set(false);
        const m = fieldMap(e);
        this.fe.set(m);
        this.formError.set(formMessage(e, m));
      },
    });
  }

  openFpo() {
    this.fpoForm = this.blankFpo();
    this.fpoError.set(null);
    this.fpoOpen.set(true);
  }

  createFpo() {
    const f = this.fpoForm;
    this.saving.set(true);
    this.api.post<Fpo>('/fpos', {
      name: f.name.trim(), registration_no: f.registration_no.trim() || null, district: f.district.trim(), state: f.state.trim(),
      contact_name: f.contact_name.trim() || null, contact_phone: f.contact_phone.trim() || null,
    }).subscribe({
      next: r => {
        this.saving.set(false);
        this.fpoOpen.set(false);
        this.fpos.set([...this.fpos(), r].sort((a, b) => a.name.localeCompare(b.name)));
        this.toast.success('FPO added', r.name);
      },
      error: (e: ApiError) => { this.saving.set(false); this.fpoError.set(formMessage(e, fieldMap(e)) ?? e.message); },
    });
  }
}
