import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiError, ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { MapView } from '../../ui/map-view';
import { FieldLite, Remote, esc, fieldsFC, pointsFC } from './shared';

export interface Device {
  id: string; kind: 'soilsync' | 'microclime'; external_id: string; name: string; farm_id: string | null;
  field_id: string | null; latitude: number; longitude: number; elevation_m: number | null; parameters: string[];
  status: 'online' | 'offline' | 'retired'; last_seen_at: string | null; calibrated_on: string | null; created_at: string;
}
interface Health {
  id: string; name: string; external_id: string; kind: string; status: string; last_seen_at: string | null;
  days_since_seen: number | null; stale: boolean; suggest_offline: boolean; suggestion: string | null;
}
interface Farm { id: string; name: string; village: string }

const KIND_LABEL: Record<string, string> = { soilsync: 'SoilSync', microclime: 'MicroClime' };

interface DeviceForm {
  kind: 'soilsync' | 'microclime'; external_id: string; name: string; field_id: string; latitude: string; longitude: string;
  calibrated_on: string; status: 'online' | 'offline' | 'retired';
}

@Component({
  selector: 'vc-devices-tab',
  imports: [...KIT, FormsModule, MapView, AgoPipe, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bar">
      <div class="seg" role="group" aria-label="Status filter">
        @for (s of statusOpts; track s.key) {
          <button type="button" [class.on]="status() === s.key" (click)="status.set(s.key)">{{ s.label }}
            <span class="c num">{{ count(s.key) }}</span></button>
        }
      </div>
      <span class="spacer"></span>
      @if (canWrite()) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />Register device</button> }
    </div>

    @for (h of attention(); track h.id) {
      <vc-callout tone="warn" icon="wifi-off">
        <div class="row wrap" style="--gap:10px">
          <span><strong>{{ h.name }}</strong> <span class="mono small subtle">{{ h.external_id }}</span> — {{ h.suggestion }}</span>
          <span class="spacer"></span>
          @if (canWrite()) { <button class="btn btn-secondary btn-sm" (click)="markOffline(h.id)">Mark offline</button> }
        </div>
      </vc-callout>
    }

    <div class="grid split">
      <section class="card">
        @if (list.loading()) {
          <vc-loading [rows]="6" />
        } @else if (list.error()) {
          <div class="card-body"><vc-error title="Couldn't load devices" [message]="list.error()!.message" /></div>
        } @else if (!rows().length) {
          <vc-empty icon="cpu" [title]="status() ? 'No devices with this status' : 'No devices registered yet'"
            text="Register SoilSync soil sensors and MicroClime weather stations to give fields Tier 1 data — and their neighbours Tier 2.">
            @if (canWrite() && !status()) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />Register device</button> }
          </vc-empty>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Device</th><th>Kind</th><th>Farm / field</th><th>Status</th><th>Last seen</th><th>Calibrated</th><th></th></tr></thead>
              <tbody>
                @for (d of rows(); track d.id) {
                  <tr class="clickable" [class.sel]="selected() === d.id" (click)="selected.set(d.id)">
                    <td><div class="dn"><strong>{{ d.name }}</strong><span class="mono small subtle">{{ d.external_id }}</span></div></td>
                    <td><span class="kind" [class.mc]="d.kind === 'microclime'"><vc-icon [name]="d.kind === 'soilsync' ? 'droplets' : 'rain'" [size]="13" />{{ kindLabel(d.kind) }}</span></td>
                    <td>
                      <div class="dn"><span>{{ farmName(d.farm_id) }}</span><span class="small subtle">{{ fieldCode(d.field_id) }}</span></div>
                    </td>
                    <td><vc-badge [status]="d.status" /></td>
                    <td class="nowrap"><span [title]="d.last_seen_at | day: true" [class.stale]="isStale(d.id)">{{ d.last_seen_at ? (d.last_seen_at | ago) : 'Never' }}</span></td>
                    <td class="nowrap">@if (d.calibrated_on) { {{ d.calibrated_on | day }} } @else { <span class="subtle">Not recorded</span> }</td>
                    <td class="num">
                      @if (canWrite() && d.status !== 'retired') {
                        <button class="btn btn-ghost btn-sm" (click)="openEdit(d); $event.stopPropagation()"><vc-icon name="pencil" [size]="14" />Edit</button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
      <section class="card map-card">
        <div class="card-head"><h3>Where devices are</h3>
          <span class="lg"><i class="on"></i>Online <i class="off"></i>Offline</span>
        </div>
        <vc-map [polygons]="fieldPolys()" [points]="devicePts()" height="380px" (featureClick)="pick($event)" />
      </section>
    </div>

    <vc-modal [(open)]="formOpen" [drawer]="true" width="480px" [title]="editing() ? 'Edit device' : 'Register a device'"
      [subtitle]="editing() ? editing()!.external_id : 'SoilSync soil sensor or MicroClime weather station'">
      <form class="form-grid" (ngSubmit)="save()" id="devForm">
        @if (!editing()) {
          <div class="field span-2">
            <label>Kind</label>
            <div class="kinds">
              <label class="kopt" [class.on]="form.kind === 'soilsync'"><input type="radio" name="kind" value="soilsync" [(ngModel)]="form.kind" />
                <vc-icon name="droplets" /><span><strong>SoilSync</strong><small>Soil moisture, temperature, EC, pH</small></span></label>
              <label class="kopt" [class.on]="form.kind === 'microclime'"><input type="radio" name="kind" value="microclime" [(ngModel)]="form.kind" />
                <vc-icon name="rain" /><span><strong>MicroClime</strong><small>Rainfall, air temperature, humidity, wind</small></span></label>
            </div>
          </div>
          <div class="field">
            <label for="ext">Device ID</label>
            <input id="ext" class="input mono" name="ext" [(ngModel)]="form.external_id" placeholder="SS-2041" [class.invalid]="err('external_id')" />
            @if (err('external_id')) { <span class="error">{{ err('external_id') }}</span> } @else { <span class="hint">Printed on the device label</span> }
          </div>
        }
        <div class="field" [class.span-2]="!!editing()">
          <label for="nm">Name</label>
          <input id="nm" class="input" name="nm" [(ngModel)]="form.name" placeholder="North plot sensor" [class.invalid]="err('name')" />
          @if (err('name')) { <span class="error">{{ err('name') }}</span> }
        </div>
        <div class="field span-2">
          <label for="fld">Field</label>
          <select id="fld" class="input" name="fld" [(ngModel)]="form.field_id">
            <option value="">Not linked to a field</option>
            @for (f of fields(); track f.id) { <option [value]="f.id">{{ f.code }} · {{ f.name }}</option> }
          </select>
          <span class="hint">The farm is taken from the field. Location defaults to the field centre.</span>
        </div>
        <div class="field">
          <label for="lat">Latitude</label>
          <input id="lat" class="input num" name="lat" inputmode="decimal" [(ngModel)]="form.latitude" [placeholder]="form.field_id ? 'Field centre' : '12.9716'" [class.invalid]="err('latitude')" />
          @if (err('latitude')) { <span class="error">{{ err('latitude') }}</span> }
        </div>
        <div class="field">
          <label for="lon">Longitude</label>
          <input id="lon" class="input num" name="lon" inputmode="decimal" [(ngModel)]="form.longitude" [placeholder]="form.field_id ? 'Field centre' : '77.5946'" [class.invalid]="err('longitude')" />
          @if (err('longitude')) { <span class="error">{{ err('longitude') }}</span> }
        </div>
        <div class="field">
          <label for="cal">Last calibrated</label>
          <input id="cal" type="date" class="input" name="cal" [(ngModel)]="form.calibrated_on" [max]="today" />
        </div>
        <div class="field">
          <label for="st">Status</label>
          <select id="st" class="input" name="st" [(ngModel)]="form.status">
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            @if (editing()) { <option value="retired">Retired (permanent)</option> }
          </select>
        </div>
        @if (form.status === 'retired') {
          <div class="span-2"><vc-callout tone="warn" icon="alert">A retired device can't be changed or brought back. Its past readings are kept.</vc-callout></div>
        }
        @if (formError()) { <div class="span-2"><vc-error title="Not saved" [message]="formError()!" /></div> }
      </form>
      <ng-container footer>
        <button class="btn btn-ghost" type="button" (click)="formOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="devForm" [disabled]="saving()">{{ saving() ? 'Saving…' : editing() ? 'Save changes' : 'Register device' }}</button>
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    :host{display:flex;flex-direction:column;gap:14px}
    .bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
    .seg{display:inline-flex;background:var(--surface);border:1px solid var(--border-strong);border-radius:8px;padding:3px;gap:2px}
    .seg button{border:0;background:none;font:500 13px var(--font);padding:6px 12px;border-radius:6px;color:var(--stone-600);cursor:pointer;display:inline-flex;gap:6px;align-items:center}
    .seg button.on{background:var(--forest-50);color:var(--forest-700);box-shadow:inset 0 0 0 1px var(--forest-200)}
    .seg .c{font-size:11px;color:var(--text-3)}
    .split{grid-template-columns:1fr}
    .map-card vc-map{border:0;border-radius:0 0 var(--radius) var(--radius)}
    .dn{display:flex;flex-direction:column;line-height:1.35;min-width:0}
    .kind{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;color:var(--forest-700)}
    .kind.mc{color:var(--sky-600)}
    .stale{color:var(--amber-600);font-weight:500}
    tr.sel td{background:var(--forest-50)}
    .lg{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--text-2)}
    .lg i{width:9px;height:9px;border-radius:50%;display:inline-block;margin-left:6px}
    .lg i.on{background:#2f7249} .lg i.off{background:#b3261e}
    .kinds{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .kopt{display:flex;gap:10px;align-items:flex-start;padding:12px;border:1px solid var(--border-strong);border-radius:8px;cursor:pointer;color:var(--stone-600)}
    .kopt input{display:none}
    .kopt span{display:flex;flex-direction:column;gap:2px} .kopt strong{color:var(--stone-900);font-size:13.5px} .kopt small{font-size:12px;color:var(--text-3);line-height:1.35}
    .kopt.on{border-color:var(--forest-500);background:var(--forest-50);box-shadow:var(--focus);color:var(--forest-600)}
  `],
})
export class DevicesTab {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  fields = input<FieldLite[]>([]);

  list = new Remote<{ devices: Device[]; health: Health[]; farms: Farm[] }>();
  status = signal<string>('');
  selected = signal<string | null>(null);
  formOpen = signal(false);
  editing = signal<Device | null>(null);
  saving = signal(false);
  formError = signal<string | null>(null);
  fieldErrors = signal<Record<string, string>>({});
  form: DeviceForm = this.blank();
  today = new Date().toISOString().slice(0, 10);

  statusOpts = [
    { key: '', label: 'All' }, { key: 'online', label: 'Online' }, { key: 'offline', label: 'Offline' }, { key: 'retired', label: 'Retired' },
  ];
  canWrite = computed(() => this.auth.can('data.sync'));

  private fieldMap = computed(() => new Map(this.fields().map(f => [f.id, f])));
  private farmMap = computed(() => new Map((this.list.data()?.farms ?? []).map(f => [f.id, f])));
  private healthMap = computed(() => new Map((this.list.data()?.health ?? []).map(h => [h.id, h])));
  all = computed(() => this.list.data()?.devices ?? []);
  rows = computed(() => this.all().filter(d => !this.status() || d.status === this.status()));
  attention = computed(() => (this.list.data()?.health ?? []).filter(h => h.suggest_offline).slice(0, 3));

  fieldPolys = computed(() => fieldsFC(this.fields(), f => ({ color: '#9aa29c', label: `<strong>${esc(f.code)}</strong><br>${esc(f.name)}` })));
  devicePts = computed(() => pointsFC(this.all().filter(d => d.status !== 'retired').map(d => ({
    id: d.id, lat: d.latitude, lon: d.longitude, color: d.status === 'online' ? '#2f7249' : '#b3261e',
    label: `<strong>${esc(d.name)}</strong><br><span style="font-family:var(--mono);font-size:11px">${esc(d.external_id)}</span><br>${KIND_LABEL[d.kind]} · ${esc(d.status)}`,
  }))));

  constructor() {
    this.load();
  }

  load() {
    this.list.load(forkJoin({
      devices: this.api.get<Device[]>('/devices'),
      health: this.api.get<Health[]>('/devices/health'),
      farms: this.api.get<Farm[]>('/farms'),
    }), true);
  }

  count(s: string) {
    return this.all().filter(d => !s || d.status === s).length;
  }
  kindLabel(k: string) { return KIND_LABEL[k] ?? k; }
  farmName(id: string | null) {
    const f = id ? this.farmMap().get(id) : null;
    return f ? `${f.name} · ${f.village}` : id ? 'Farm' : 'No farm linked';
  }
  fieldCode(id: string | null) { return id ? this.fieldMap().get(id)?.code ?? 'Field outside this project' : 'No field linked'; }
  isStale(id: string) { return !!this.healthMap().get(id)?.stale; }
  pick(e: { layer: string; id: string }) { if (e.layer === 'point') this.selected.set(e.id); }
  err(k: string) { return this.fieldErrors()[k]; }

  private blank(): DeviceForm {
    return { kind: 'soilsync', external_id: '', name: '', field_id: '', latitude: '', longitude: '', calibrated_on: '', status: 'online' };
  }

  openCreate() {
    this.editing.set(null);
    this.form = this.blank();
    this.formError.set(null);
    this.fieldErrors.set({});
    this.formOpen.set(true);
  }

  openEdit(d: Device) {
    this.editing.set(d);
    this.form = {
      kind: d.kind, external_id: d.external_id, name: d.name, field_id: d.field_id ?? '', latitude: String(d.latitude),
      longitude: String(d.longitude), calibrated_on: d.calibrated_on ?? '', status: d.status,
    };
    this.formError.set(null);
    this.fieldErrors.set({});
    this.formOpen.set(true);
  }

  save() {
    const f = this.form;
    const errs: Record<string, string> = {};
    if (!this.editing() && f.external_id.trim().length < 2) errs['external_id'] = 'Enter the device ID (at least 2 characters).';
    if (f.name.trim().length < 2) errs['name'] = 'Give the device a name (at least 2 characters).';
    const lat = f.latitude === '' ? null : Number(f.latitude);
    const lon = f.longitude === '' ? null : Number(f.longitude);
    if (lat !== null && (Number.isNaN(lat) || lat < -90 || lat > 90)) errs['latitude'] = 'Latitude must be between −90 and 90.';
    if (lon !== null && (Number.isNaN(lon) || lon < -180 || lon > 180)) errs['longitude'] = 'Longitude must be between −180 and 180.';
    if (!this.editing() && !f.field_id && (lat === null || lon === null)) errs['latitude'] = 'Give a location, or link the device to a field.';
    this.fieldErrors.set(errs);
    if (Object.keys(errs).length) return;
    const body: Record<string, unknown> = {
      name: f.name.trim(), field_id: f.field_id || null, calibrated_on: f.calibrated_on || null, status: f.status,
    };
    if (lat !== null && lon !== null) { body['latitude'] = lat; body['longitude'] = lon; }
    const ed = this.editing();
    if (!ed) { body['kind'] = f.kind; body['external_id'] = f.external_id.trim(); }
    else if (ed.field_id === (f.field_id || null)) delete body['field_id'];
    this.saving.set(true);
    this.formError.set(null);
    const req = ed ? this.api.patch<Device>(`/devices/${ed.id}`, body) : this.api.post<Device>('/devices', body);
    req.subscribe({
      next: d => {
        this.saving.set(false);
        this.formOpen.set(false);
        this.toast.success(ed ? 'Device updated' : 'Device registered', `${d.name} · ${d.external_id}`);
        this.load();
      },
      error: (e: ApiError) => {
        this.saving.set(false);
        const fields = (e.details?.['fields'] as { field: string; message: string }[] | undefined) ?? [];
        if (fields.length) this.fieldErrors.set(Object.fromEntries(fields.map(x => [String(x.field).split('.').pop()!, x.message])));
        this.formError.set(e.message);
      },
    });
  }

  markOffline(id: string) {
    this.api.patch<Device>(`/devices/${id}`, { status: 'offline' }).subscribe({
      next: d => { this.toast.success('Marked offline', `${d.name} — its fields now use nearby or external data.`); this.load(); },
      error: e => this.toast.apiError(e, "Couldn't update the device"),
    });
  }
}
