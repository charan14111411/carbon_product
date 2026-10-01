import { ChangeDetectionStrategy, Component, computed, inject, input, isDevMode, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, Empty, ErrorBox, Hash, Loading, Modal, TabItem, Tabs, Timeline, TimelineItem } from '../../ui/kit';
import { DeviceTierChip, MemberResult, MemberUnavailable } from './member-result';
import {
  Agreement, AgreementTemplate, CHANNELS, Consents, DeviceRefresh, FarmerOverview, formatPhone, initials, LANGUAGES, MEMBER_UNAVAILABLE,
  MemberFarmImport, MemberLookup, PURPOSES,
} from './types';

@Component({
  selector: 'vc-farmer-detail',
  imports: [FormsModule, RouterLink, Loading, ErrorBox, Empty, Badge, Modal, Tabs, Icon, Timeline, Hash, Callout, DataClass,
    MemberResult, MemberUnavailable, DeviceTierChip, NumPipe, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="back" routerLink="/app/farmers"><vc-icon name="arrow-left" [size]="15" />All farmers</a>

    @if (loading()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load this farmer" [message]="error()!" />
    } @else if (ov(); as o) {
      @let f = o.farmer;
      <section class="hero card">
        <div class="id">
          <span class="av">{{ ini(f.full_name) }}</span>
          <div class="nm">
            <div class="row" style="--gap:10px">
              <h1>{{ f.full_name }}</h1>
              @if (f.member_id) { <span class="member" [title]="'Member ID ' + f.member_id"><vc-icon name="verified" [size]="14" />Varsapradaya member</span> }
            </div>
            <div class="meta">
              <span class="mono">{{ f.code }}</span>
              <span><vc-icon name="pin" [size]="13" />{{ f.village || '—' }}{{ f.district ? ', ' + f.district : '' }}</span>
              <span class="num"><vc-icon name="message" [size]="13" />{{ phone(f.phone) }}</span>
              <span><vc-icon name="globe" [size]="13" />{{ lang(f.language) }}</span>
              @if (o.fpo) { <span><vc-icon name="building" [size]="13" />{{ o.fpo.name }}</span> }
            </div>
          </div>
          <div class="acts">
            <vc-badge [status]="f.status" />
            <vc-badge [status]="kycTone(f.kyc_status)">{{ kycLabel(f.kyc_status) }}</vc-badge>
            @if (canManage && !f.member_id) {
              <button class="btn btn-secondary btn-sm" (click)="checkMember()" [disabled]="looking()"><vc-icon name="verified" [size]="14" />{{ looking() ? 'Checking…' : 'Check membership' }}</button>
            } @else if (canManage && f.member_id) {
              <button class="btn btn-secondary btn-sm" (click)="checkMember()" [disabled]="looking()"><vc-icon name="download" [size]="14" />{{ looking() ? 'Checking…' : 'Varsapradaya farms' }}</button>
            }
          </div>
        </div>
        @if (unavailable() !== null) {
          <div class="lk"><vc-member-unavailable [message]="unavailable()!" [busy]="looking()" (retry)="checkMember()" /></div>
        } @else if (lookup(); as r) {
          <div class="lk"><vc-member-result [result]="r" [currentId]="f.id" [importing]="importing()" (importFarms)="importFarms($event)"
            [importable]="canManage && !!f.member_id && r.is_member && r.member_id === f.member_id" /></div>
        }
        <div class="facts">
          <div><span class="v num">{{ o.total_area_ha | num: 2 }}<small>ha</small></span><span class="l">Total field area <vc-dc cls="CALCULATED" /></span></div>
          <div><span class="v num">{{ fieldCount() }}</span><span class="l">Fields on {{ o.farms.length }} farm{{ o.farms.length === 1 ? '' : 's' }}</span></div>
          <div><span class="v num">{{ enrolledCount() }}</span><span class="l">Active enrolments</span></div>
          <div><span class="v num">{{ o.practice_records | num: 0 }}</span><span class="l">Practice records</span></div>
          <div><span class="v num">{{ grantedCount() }}<small>of {{ o.consents.length }}</small></span><span class="l">Consents given</span></div>
        </div>
      </section>

      <vc-tabs [tabs]="tabs()" [(active)]="tab" />

      @switch (tab()) {
        @case ('farms') {
          @if (!o.farms.length) {
            <div class="card"><vc-empty icon="tractor" title="No farms yet" text="Farms and field boundaries are added under Fields & map, or synced from the Varsapradaya member platform.">
              <a class="btn btn-secondary" routerLink="/app/fields"><vc-icon name="map" />Open Fields & map</a></vc-empty></div>
          } @else {
            <div class="stack">
              @for (farm of o.farms; track farm.id) {
                <section class="card">
                  <div class="card-head">
                    <vc-icon name="tractor" [size]="16" class="subtle" />
                    <h3>{{ farm.name }} <span class="subtle small">{{ farm.village }}@if (farm.postal_code) { · PIN {{ farm.postal_code }} }</span></h3>
                    @if (farm.external_farm_id) { <span class="small subtle">Member farm <code>{{ farm.external_farm_id }}</code></span> }
                    @if (farm.external_farm_id && canSync) {
                      <span class="spacer"></span>
                      <button class="btn btn-ghost btn-sm" (click)="refreshDevices(farm.id)" [disabled]="devState()[farm.id]?.busy">
                        <vc-icon name="refresh" [size]="14" />{{ devState()[farm.id]?.busy ? 'Refreshing…' : 'Refresh devices from Varsapradaya' }}</button>
                    }
                  </div>
                  @if (devState()[farm.id]; as d) {
                    @if (d.unavailable !== undefined) {
                      <div class="card-body"><vc-member-unavailable [message]="d.unavailable" [busy]="!!d.busy" (retry)="refreshDevices(farm.id)" /></div>
                    } @else if (d.result; as res) {
                      <div class="card-body devs">
                        <div class="row wrap" style="--gap:8px">
                          <vc-device-tier [tier]="res.tier" />
                          <span class="small">{{ res.devices.length ? res.registered + ' registered, ' + res.updated + ' updated' : 'No devices reported for this farm' }}</span>
                          <a class="small" routerLink="/app/supporting">Open supporting data</a>
                        </div>
                        @for (dv of res.devices; track dv.id) {
                          <div class="dv">
                            <vc-icon [name]="dv.kind === 'soilsync' ? 'droplets' : 'rain'" [size]="14" />
                            <strong>{{ dv.name }}</strong><span class="mono small subtle">{{ dv.external_id }}</span>
                            <vc-badge [status]="dv.status" />
                            <span class="small subtle">{{ dv.last_seen_at ? 'Last reading ' + (dv.last_seen_at | day: true) : 'No reading time' }}</span>
                            <span class="vals">
                              @for (x of dv.readings; track x.parameter) { <span class="val">{{ x.label }} <b class="num">{{ x.value }}</b> {{ x.unit }}</span> }
                              @if (dv.readings.length) { <vc-dc cls="MEASURED" /> }
                            </span>
                          </div>
                        }
                        <p class="small muted">@if (res.readings_kept) { <strong>{{ res.readings_kept }} new reading{{ res.readings_kept === 1 ? '' : 's' }} kept.</strong> } {{ res.history_note }}</p>
                        @for (n of res.notes; track n) { <p class="small subtle">· {{ n }}</p> }
                      </div>
                    }
                  }
                  @if (!farm.fields.length) {
                    <div class="card-body muted small">No fields mapped on this farm yet.</div>
                  } @else {
                    <div class="table-wrap">
                      <table class="table">
                        <thead><tr><th>Field</th><th>Code</th><th>Crop</th><th class="num">Area</th><th>Status</th><th></th></tr></thead>
                        <tbody>
                          @for (fl of farm.fields; track fl.id) {
                            <tr class="clickable" [routerLink]="['/app/fields', fl.id]">
                              <td><strong>{{ fl.name }}</strong></td>
                              <td class="mono small">{{ fl.code }}</td>
                              <td>{{ cropName(fl.crop_code) }}</td>
                              <td class="num">{{ fl.area_ha | num: 2 }} ha</td>
                              <td><vc-badge [status]="fl.status" /></td>
                              <td class="num"><vc-icon name="chevron-right" [size]="15" class="subtle" /></td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  }
                </section>
              }
            </div>
          }
        }
        @case ('consent') {
          <div class="consent-grid">
            <section class="card">
              <div class="card-head"><h3>Current consent</h3><span class="small subtle">One record per purpose. Changes take effect today.</span></div>
              @if (!consents()) { <vc-loading [rows]="5" /> }
              @else {
                <ul class="purposes">
                  @for (c of consents()!.current; track c.purpose) {
                    <li>
                      <span class="st" [class.on]="c.state === 'granted'" [class.off]="c.state === 'withdrawn'">
                        <vc-icon [name]="c.state === 'granted' ? 'check' : c.state === 'withdrawn' ? 'x' : 'minus'" [size]="13" [stroke]="2.4" />
                      </span>
                      <div class="pt">
                        <strong>{{ purpose(c.purpose).label }}</strong>
                        <p>{{ purpose(c.purpose).text }}</p>
                      </div>
                      <div class="pstate">
                        <span class="small" [class.okText]="c.state === 'granted'" [class.muted]="c.state !== 'granted'">
                          {{ c.state === 'granted' ? 'Given' : c.state === 'withdrawn' ? 'Withdrawn' : 'Not given' }}</span>
                        @if (c.effective_on) { <span class="subtle small">since {{ c.effective_on | day }}</span> }
                      </div>
                      @if (canManage) {
                        @if (c.state === 'granted') {
                          <button class="btn btn-ghost btn-sm" (click)="askConsent(c.purpose, false)">Withdraw</button>
                        } @else {
                          <button class="btn btn-secondary btn-sm" (click)="askConsent(c.purpose, true)">Record consent</button>
                        }
                      }
                    </li>
                  }
                </ul>
              }
            </section>
            <section class="card">
              <div class="card-head"><h3>History</h3></div>
              <div class="card-body"><vc-timeline [items]="history()" /></div>
            </section>
          </div>
        }
        @case ('agreements') {
          <section class="card">
            <div class="card-head">
              <h3>Signed agreements</h3>
              @if (canManage) { <button class="btn btn-primary btn-sm" (click)="openSign()"><vc-icon name="pencil" [size]="14" />Sign agreement</button> }
            </div>
            @if (agreements() === null) { <vc-loading [rows]="3" /> }
            @else if (!agreements()!.length) {
              <vc-empty icon="handshake" title="No agreements signed yet"
                text="Signing a published agreement records the farmer’s consent for each purpose it covers, with a fingerprint of the exact text they saw.">
                @if (canManage) { <button class="btn btn-primary" (click)="openSign()"><vc-icon name="pencil" />Sign agreement</button> }
              </vc-empty>
            } @else {
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Agreement</th><th>Version</th><th>Language</th><th>Method</th><th>Signed</th><th>Text fingerprint</th></tr></thead>
                  <tbody>
                    @for (a of agreements(); track a.id) {
                      <tr>
                        <td><strong>{{ tplTitle(a.template_id) }}</strong></td>
                        <td class="num">v{{ a.template_version }}</td>
                        <td>{{ lang(a.language) }}</td>
                        <td>{{ methodLabel(a.method) }}</td>
                        <td class="nowrap">{{ a.signed_at | day: true }}</td>
                        <td><vc-hash [value]="a.signed_text_sha256" /></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </section>
        }
        @case ('enrolments') {
          <section class="card">
            @if (!o.enrolments.length) {
              <vc-empty icon="briefcase" title="Not enrolled in any project" text="Enrol this farmer’s fields from a project page. Each field is checked for eligibility first." >
                <a class="btn btn-secondary" routerLink="/app/programmes">Open programmes</a></vc-empty>
            } @else {
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Project</th><th>Field</th><th>Status</th><th>Enrolled on</th></tr></thead>
                  <tbody>
                    @for (e of o.enrolments; track e.id) {
                      <tr>
                        <td><a class="mono" [routerLink]="['/app/programmes/projects', e.project_id]">{{ e.project_code }}</a></td>
                        <td><a class="mono" [routerLink]="['/app/fields', e.field_id]">{{ e.field_code }}</a></td>
                        <td><vc-badge [status]="e.status" /></td>
                        <td>{{ e.enrolled_on | day }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </section>
        }
      }
    }

    <!-- consent change -->
    <vc-modal [(open)]="consentOpen" width="500px" [title]="cf.granted ? 'Record consent' : 'Withdraw consent'"
      [subtitle]="purpose(cf.purpose).label">
      <div class="stack" style="--gap:14px">
        @if (cf.granted) {
          <p class="muted">Record only what the farmer has agreed to in person or through a verified channel. {{ purpose(cf.purpose).text }}</p>
        } @else {
          <vc-callout tone="warn" icon="alert">Withdrawing stops this use from today. For sampling or data use, the farmer’s fields fail the consent check at their next enrolment decision.</vc-callout>
        }
        <div class="field">
          <label for="cch">How was this given?</label>
          <select id="cch" class="input" [(ngModel)]="cf.channel">
            @for (c of channels; track c[0]) { <option [value]="c[0]">{{ c[1] }}</option> }
          </select>
        </div>
        <div class="field">
          <label for="cnt">Notes <span class="subtle">(optional)</span></label>
          <textarea id="cnt" class="input" rows="3" [(ngModel)]="cf.notes" placeholder="For example: explained in Kannada at the village meeting, 12 Sept."></textarea>
        </div>
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="consentOpen.set(false)">Cancel</button>
        <button class="btn" [class.btn-primary]="cf.granted" [class.btn-danger]="!cf.granted" [disabled]="busy()" (click)="saveConsent()">
          {{ busy() ? 'Saving…' : cf.granted ? 'Record consent' : 'Withdraw consent' }}</button>
      </ng-container>
    </vc-modal>

    <!-- sign agreement -->
    <vc-modal [(open)]="signOpen" width="720px" title="Sign agreement" subtitle="The farmer signs the exact text shown here. A fingerprint of it is stored with the signature.">
      @if (templates() === null) { <vc-loading [rows]="4" /> }
      @else if (!templates()!.length) {
        <vc-empty icon="file" title="No published agreements" text="Publish an agreement template first under Agreements & consent.">
          <a class="btn btn-secondary" routerLink="/app/agreements" (click)="signOpen.set(false)">Open agreements</a></vc-empty>
      } @else {
        <div class="stack" style="--gap:14px">
          <div class="form-grid">
            <div class="field">
              <label for="stp">Agreement</label>
              <select id="stp" class="input" [ngModel]="sf.template_id" (ngModelChange)="pickTemplate($event)">
                @for (t of templates(); track t.id) { <option [value]="t.id">{{ t.title }} · v{{ t.version }}</option> }
              </select>
            </div>
            <div class="field">
              <label for="slg">Language</label>
              <select id="slg" class="input" [(ngModel)]="sf.language">
                @for (l of tplLangs(); track l) { <option [value]="l">{{ lang(l) }}</option> }
              </select>
            </div>
          </div>
          @if (tpl(); as t) {
            <div class="covers">
              <span class="small muted">Signing gives consent for</span>
              @for (p of t.purposes; track p) { <span class="chip">{{ purpose(p).label }}</span> }
            </div>
            <div class="preview" [attr.lang]="sf.language">{{ t.body[sf.language] }}</div>
          }
          <div class="field">
            <label>Signing method</label>
            <div class="methods">
              @for (m of methods; track m.key) {
                <button type="button" class="mopt" [class.on]="sf.method === m.key" (click)="sf.method = m.key">
                  <vc-icon [name]="m.icon" [size]="16" /><span><strong>{{ m.label }}</strong><small>{{ m.text }}</small></span>
                </button>
              }
            </div>
          </div>
          @if (sf.method === 'otp') {
            <div class="field otp">
              <label for="sotp">Code sent to {{ phone(ov()?.farmer?.phone ?? '') }}</label>
              <input id="sotp" class="input code" inputmode="numeric" maxlength="6" [(ngModel)]="sf.otp" placeholder="••••••" />
              @if (dev) { <span class="hint">Development environment: use the demo code <code>123456</code>.</span> }
            </div>
          }
          @if (signError()) { <vc-error title="Couldn't record the signature" [message]="signError()!" /> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-secondary" (click)="signOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !tpl() || (sf.method === 'otp' && sf.otp.length < 6)" (click)="sign()">
          <vc-icon name="pencil" />{{ busy() ? 'Signing…' : 'Record signature' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    .back{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--text-2);margin-bottom:14px}
    .back:hover{color:var(--forest-700);text-decoration:none}
    .hero{margin-bottom:20px;overflow:hidden}
    .id{display:flex;gap:16px;align-items:center;padding:20px 22px;flex-wrap:wrap}
    .av{display:grid;place-items:center;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,var(--forest-600),var(--forest-800));color:#fff;font-size:19px;font-weight:600;flex:none}
    .nm{flex:1;min-width:260px}
    .meta{display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:6px;font-size:13px;color:var(--text-2)}
    .meta span{display:inline-flex;align-items:center;gap:5px}
    .meta vc-icon{color:var(--text-3)}
    .member{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 10px;border-radius:999px;background:var(--forest-600);color:#fff;font-size:12px;font-weight:500}
    .acts{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .lk{padding:0 22px 16px}
    .spacer{flex:1}
    .devs{display:flex;flex-direction:column;gap:8px;border-bottom:1px solid var(--border)}
    .dv{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px}
    .vals{display:flex;flex-wrap:wrap;gap:4px 10px;align-items:center;flex:1;justify-content:flex-end}
    .val{font-size:12px;color:var(--text-2)} .val b{color:var(--stone-900);font-weight:600}
    .facts{display:grid;grid-template-columns:repeat(5,1fr);border-top:1px solid var(--border);background:var(--surface-2)}
    .facts > div{display:flex;flex-direction:column;gap:3px;padding:14px 22px}
    .facts > div + div{border-left:1px solid var(--border)}
    @media (max-width:1100px){.facts{grid-template-columns:repeat(3,1fr)} .facts > div:nth-child(4){border-left:0}}
    .v{font-size:20px;font-weight:600;letter-spacing:-.01em}
    .v small{font-size:12px;font-weight:500;color:var(--text-3);margin-left:4px}
    .l{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-3)}
    .consent-grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:16px;align-items:start}
    @media (max-width:1100px){.consent-grid{grid-template-columns:1fr}}
    .purposes{list-style:none;margin:0;padding:0}
    .purposes li{display:grid;grid-template-columns:24px 1fr 120px 130px;gap:12px;align-items:center;padding:14px 20px;border-bottom:1px solid var(--stone-100)}
    .purposes li:last-child{border-bottom:0}
    .purposes li .btn{justify-self:end}
    .st{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--stone-100);color:var(--stone-500)}
    .st.on{background:var(--forest-100);color:var(--forest-700)} .st.off{background:var(--red-100);color:var(--red-600)}
    .pt strong{font-size:13.5px} .pt p{font-size:12.5px;color:var(--text-2);margin-top:1px}
    .pstate{display:flex;flex-direction:column}
    .okText{color:var(--forest-700);font-weight:500}
    .covers{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
    .chip{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:5px;background:var(--forest-50);border:1px solid var(--forest-100);font-size:12px;color:var(--forest-800)}
    .preview{max-height:240px;overflow:auto;padding:14px 16px;border-radius:8px;border:1px solid var(--border);background:var(--surface-2);white-space:pre-wrap;font-size:13.5px;line-height:1.65;color:var(--stone-800)}
    .methods{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
    @media (max-width:720px){.methods{grid-template-columns:1fr}}
    .mopt{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:var(--surface);font:inherit;text-align:left;cursor:pointer;color:var(--stone-600)}
    .mopt:hover{border-color:var(--stone-400)}
    .mopt.on{border-color:var(--forest-500);background:var(--forest-50);color:var(--forest-700);box-shadow:inset 0 0 0 1px var(--forest-500)}
    .mopt span{display:flex;flex-direction:column} .mopt strong{font-size:13px;color:var(--stone-900)} .mopt small{font-size:12px;color:var(--text-2)}
    .code{font:500 20px var(--mono);letter-spacing:.4em;height:46px;max-width:220px}
  `],
})
export class FarmerDetailPage {
  id = input.required<string>();
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  canManage = this.auth.can('farmers.manage');
  canSync = this.auth.can('data.sync');
  dev = isDevMode();
  ini = initials;
  phone = formatPhone;
  channels = Object.entries(CHANNELS);
  methods: { key: 'otp' | 'assisted' | 'esign'; label: string; text: string; icon: string }[] = [
    { key: 'otp', label: 'SMS code', text: 'Farmer reads back a one-time code', icon: 'message' },
    { key: 'assisted', label: 'Assisted', text: 'Signed in front of you as witness', icon: 'users' },
    { key: 'esign', label: 'e-Sign', text: 'Aadhaar-based electronic signature', icon: 'fingerprint' },
  ];

  ov = signal<FarmerOverview | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  tab = signal('farms');
  consents = signal<Consents | null>(null);
  agreements = signal<Agreement[] | null>(null);
  templates = signal<AgreementTemplate[] | null>(null);
  allTemplates = signal<AgreementTemplate[]>([]);
  crops = signal<{ code: string; name: string }[]>([]);
  looking = signal(false);
  lookup = signal<MemberLookup | null>(null);
  unavailable = signal<string | null>(null);
  importing = signal(false);
  devState = signal<Record<string, { busy?: boolean; result?: DeviceRefresh; unavailable?: string }>>({});
  busy = signal(false);

  fieldCount = computed(() => this.ov()?.farms.reduce((a, f) => a + f.fields.length, 0) ?? 0);
  enrolledCount = computed(() => this.ov()?.enrolments.filter(e => e.status === 'enrolled').length ?? 0);
  grantedCount = computed(() => this.ov()?.consents.filter(c => c.state === 'granted').length ?? 0);
  tabs = computed<TabItem[]>(() => [
    { key: 'farms', label: 'Farms & fields', count: this.fieldCount() },
    { key: 'consent', label: 'Consent' },
    { key: 'agreements', label: 'Agreements', count: this.agreements()?.length ?? null },
    { key: 'enrolments', label: 'Enrolments', count: this.ov()?.enrolments.length ?? null },
  ]);
  history = computed<TimelineItem[]>(() =>
    (this.consents()?.history ?? []).map(h => ({
      title: `${h.granted ? 'Consent given' : 'Consent withdrawn'} · ${this.purpose(h.purpose).label}`,
      at: new Date(h.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      by: `${CHANNELS[h.channel] ?? h.channel}${h.agreement_id ? ' · with signed agreement' : ''}`,
      note: h.notes || null,
      tone: h.granted ? 'ok' : 'danger',
    })),
  );

  cf = { purpose: 'sampling', granted: true, channel: 'field_officer', notes: '' };
  consentOpen = signal(false);

  signOpen = signal(false);
  signError = signal<string | null>(null);
  sf = { template_id: '', language: 'kn', method: 'assisted' as 'otp' | 'assisted' | 'esign', otp: '' };
  tpl = signal<AgreementTemplate | null>(null);
  tplLangs = computed(() => Object.keys(this.tpl()?.body ?? {}));

  ngOnInit() {
    this.load();
    this.loadConsents();
    this.loadAgreements();
    this.api.get<AgreementTemplate[]>('/agreement-templates').pipe(catchError(() => of([]))).subscribe(t => this.allTemplates.set(t));
    this.api.get<{ code: string; name: string }[]>('/catalogue/crops').pipe(catchError(() => of([]))).subscribe(c => this.crops.set(c));
  }

  cropName(c: string | null) { return c ? (this.crops().find(x => x.code === c)?.name ?? c) : '—'; }
  lang(c: string) { return LANGUAGES[c] ?? c.toUpperCase(); }
  purpose(p: string) { return PURPOSES[p] ?? { label: p.replace(/_/g, ' '), text: '' }; }
  kycTone(s: string) { return ({ verified: 'verified', pending: 'pending', failed: 'failed' } as Record<string, string>)[s] ?? 'draft'; }
  kycLabel(s: string) { return ({ verified: 'KYC verified', pending: 'KYC pending', failed: 'KYC failed' } as Record<string, string>)[s] ?? 'KYC not started'; }
  methodLabel(m: string) { return this.methods.find(x => x.key === m)?.label ?? m; }
  tplTitle(id: string) { return this.allTemplates().find(t => t.id === id)?.title ?? 'Agreement'; }

  load() {
    this.api.get<FarmerOverview>(`/farmers/${this.id()}/overview`).subscribe({
      next: o => { this.ov.set(o); this.loading.set(false); },
      error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
    });
  }
  loadConsents() {
    this.api.get<Consents>(`/farmers/${this.id()}/consents`).pipe(catchError(() => of(null))).subscribe(c => this.consents.set(c));
  }
  loadAgreements() {
    this.api.get<Agreement[]>(`/farmers/${this.id()}/agreements`).pipe(catchError(() => of([]))).subscribe(a => this.agreements.set(a));
  }

  private memberError(e: ApiError, title: string) {
    if (e.code === MEMBER_UNAVAILABLE) { this.lookup.set(null); this.unavailable.set(e.message); }
    else this.toast.apiError(e, title);
  }

  checkMember() {
    const f = this.ov()?.farmer;
    if (!f) return;
    this.looking.set(true);
    this.api.post<MemberLookup>('/farmers/member-lookup', { phone: f.phone }).subscribe({
      next: r => {
        this.unavailable.set(null);
        if (!r.is_member || f.member_id) { this.looking.set(false); this.lookup.set(r); return; }
        this.api.post<MemberLookup>('/farmers/member-lookup', { phone: f.phone, farmer_id: f.id }).subscribe({
          next: linked => {
            this.looking.set(false);
            this.lookup.set(linked);
            this.toast.success('Membership linked', `${f.full_name} is Varsapradaya member ${linked.member_id}.`);
            this.load();
          },
          error: (e: ApiError) => { this.looking.set(false); this.lookup.set(r); this.memberError(e, "Couldn't link membership"); },
        });
      },
      error: (e: ApiError) => { this.looking.set(false); this.memberError(e, "Couldn't check membership"); },
    });
  }

  importFarms(ids: string[]) {
    this.importing.set(true);
    this.api.post<MemberFarmImport>(`/farmers/${this.id()}/import-member-farms`, { external_farm_ids: ids }).subscribe({
      next: res => {
        this.importing.set(false);
        const done = new Map<string, string>([...res.created.map(c => [c.external_farm_id, c.id] as [string, string]),
          ...res.skipped.map(s => [s.external_farm_id, s.farm_id] as [string, string])]);
        const r = this.lookup();
        if (r) this.lookup.set({ ...r, farms: r.farms.map(x => done.has(x.external_farm_id) ? { ...x, imported_farm_id: done.get(x.external_farm_id)! } : x) });
        const n = res.created.length;
        this.toast.success(n ? `${n} farm${n === 1 ? '' : 's'} imported` : 'Already imported',
          `${res.skipped.length ? res.skipped.length + ' skipped (already imported). ' : ''}${res.note}`);
        this.load();
      },
      error: (e: ApiError) => { this.importing.set(false); this.memberError(e, "Couldn't import farms"); },
    });
  }

  refreshDevices(farmId: string) {
    this.devState.update(m => ({ ...m, [farmId]: { ...m[farmId], busy: true } }));
    this.api.post<DeviceRefresh>(`/farms/${farmId}/devices/refresh`, {}).subscribe({
      next: res => {
        this.devState.update(m => ({ ...m, [farmId]: { result: res } }));
        this.toast.success('Devices refreshed', `${res.registered} registered, ${res.updated} updated · latest values only.`);
      },
      error: (e: ApiError) => {
        if (e.code === MEMBER_UNAVAILABLE) this.devState.update(m => ({ ...m, [farmId]: { unavailable: e.message } }));
        else { this.devState.update(m => ({ ...m, [farmId]: {} })); this.toast.apiError(e, "Couldn't refresh devices"); }
      },
    });
  }

  askConsent(purpose: string, granted: boolean) {
    this.cf = { purpose, granted, channel: 'field_officer', notes: '' };
    this.consentOpen.set(true);
  }

  saveConsent() {
    this.busy.set(true);
    this.api.post(`/farmers/${this.id()}/consents`, {
      purpose: this.cf.purpose, granted: this.cf.granted, channel: this.cf.channel, notes: this.cf.notes.trim(),
    }).subscribe({
      next: () => {
        this.busy.set(false);
        this.consentOpen.set(false);
        this.toast.success(this.cf.granted ? 'Consent recorded' : 'Consent withdrawn', this.purpose(this.cf.purpose).label);
        this.loadConsents();
        this.load();
      },
      error: (e: ApiError) => { this.busy.set(false); this.toast.apiError(e, "Couldn't save consent"); },
    });
  }

  openSign() {
    this.signError.set(null);
    this.sf = { template_id: '', language: this.ov()?.farmer.language ?? 'kn', method: 'assisted', otp: '' };
    this.tpl.set(null);
    this.templates.set(null);
    this.signOpen.set(true);
    this.api.get<AgreementTemplate[]>('/agreement-templates', { status: 'published' }).pipe(catchError(() => of([]))).subscribe(t => {
      this.templates.set(t);
      if (t.length) this.pickTemplate(t[0].id);
    });
  }

  pickTemplate(id: string) {
    const t = this.templates()?.find(x => x.id === id) ?? null;
    this.sf.template_id = id;
    this.tpl.set(t);
    if (t && !(this.sf.language in t.body)) this.sf.language = Object.keys(t.body)[0];
  }

  sign() {
    this.busy.set(true);
    this.signError.set(null);
    this.api.post<{ agreement: Agreement }>(`/farmers/${this.id()}/agreements`, {
      template_id: this.sf.template_id, language: this.sf.language, method: this.sf.method,
      otp_code: this.sf.method === 'otp' ? this.sf.otp : null,
    }).subscribe({
      next: () => {
        this.busy.set(false);
        this.signOpen.set(false);
        this.toast.success('Agreement signed', `${this.tpl()?.title} · consent recorded for ${this.tpl()?.purposes.length} purposes.`);
        this.loadAgreements();
        this.loadConsents();
        this.load();
      },
      error: (e: ApiError) => { this.busy.set(false); this.signError.set(e.message); },
    });
  }
}
