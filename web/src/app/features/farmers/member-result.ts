import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../ui/icon';
import { DeviceTier, formatPhone, MemberFarm, MemberLookup } from './types';

const TIER: Record<DeviceTier, { label: string; title: string }> = {
  full: { label: 'Full devices', title: 'Soil sensor and weather station readings both arrived' },
  partial: { label: 'Partial devices', title: 'Readings arrived from a soil sensor or a weather station, not both' },
  none: { label: 'No device data', title: 'No readings arrived. Supporting data comes from nearby stations or external sources' },
};

/** Device tier chip: full / partial / none, decided from readings that actually arrived. */
@Component({
  selector: 'vc-device-tier',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ meta().label }}`,
  host: { '[class]': '"tier " + tier()', '[attr.title]': 'meta().title' },
  styles: [`
    :host{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:999px;font-size:11.5px;font-weight:500;white-space:nowrap;border:1px solid transparent}
    :host(.full){background:var(--ok-soft);color:var(--forest-700);border-color:#cfe2d4}
    :host(.partial){background:var(--info-soft);color:var(--sky-600);border-color:#c9dcf0}
    :host(.none){background:var(--stone-100);color:var(--stone-600);border-color:var(--stone-200)}
  `],
})
export class DeviceTierChip {
  tier = input<DeviceTier>('none');
  meta = computed(() => TIER[this.tier()] ?? TIER.none);
}

/** Shown when the member platform could not be asked. Never the same as "not a member". */
@Component({
  selector: 'vc-member-unavailable',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="box">
      <span class="seal"><vc-icon name="wifi-off" [size]="17" /></span>
      <div class="t">
        <strong>Varsapradaya unavailable</strong>
        <span>{{ message() || 'The member platform could not be reached.' }} We don’t know yet whether this farmer is a member — nothing was saved.</span>
      </div>
      <button type="button" class="btn btn-secondary btn-sm" (click)="retry.emit()" [disabled]="busy()">
        <vc-icon name="refresh" [size]="14" />{{ busy() ? 'Retrying…' : 'Retry' }}</button>
    </div>
  `,
  styles: [`
    .box{display:flex;gap:12px;align-items:center;padding:12px 14px;border-radius:10px;background:var(--warn-soft);border:1px solid #f1dcae}
    .seal{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#fff;color:var(--amber-600);flex:none;border:1px solid #f1dcae}
    .t{display:flex;flex-direction:column;gap:1px;flex:1} .t strong{font-size:14px} .t span{font-size:12.5px;color:var(--stone-700)}
  `],
})
export class MemberUnavailable {
  message = input<string>('');
  busy = input(false);
  retry = output<void>();
}

/** The result of a Varsapradaya member lookup: member id, farms, device tier, and (optionally) farm import. */
@Component({
  selector: 'vc-member-result',
  imports: [Icon, RouterLink, DeviceTierChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let r = result();
    @if (r.is_member) {
      <div class="box ok">
        <div class="h">
          <span class="seal"><vc-icon name="verified" [size]="18" /></span>
          <div class="t">
            <strong>Varsapradaya member</strong>
            <span>Member ID <code>{{ r.member_id }}</code> · {{ phone(r.phone) }}</span>
          </div>
          <span class="spacer"></span>
          @if (r.source === 'simulated') { <span class="sim" title="The server uses the simulated member platform (VC_MEMBER_DIRECTORY=simulated)">Simulated</span> }
          <vc-device-tier [tier]="r.tier" />
        </div>
        @if (r.farms.length) {
          <ul class="farms">
            @for (f of r.farms; track f.external_farm_id) {
              <li [class.pick]="canPick(f)" [class.on]="isPicked(f)">
                @if (importable()) {
                  @if (f.imported_farm_id) {
                    <span class="imp" title="Already imported"><vc-icon name="check" [size]="13" [stroke]="2.4" /></span>
                  } @else {
                    <input type="checkbox" [checked]="isPicked(f)" (change)="toggle(f)" [attr.aria-label]="'Import ' + f.name" />
                  }
                } @else {
                  <vc-icon name="tractor" [size]="15" />
                }
                <div class="fn">
                  <span class="nm">{{ f.name }} <code>{{ short(f.external_farm_id) }}</code></span>
                  <span class="sub">
                    @if (f.estate_name && f.estate_name !== f.name) { <span>Estate {{ f.estate_name }}</span> }
                    @if (f.postal_code) { <span>PIN {{ f.postal_code }}</span> }
                    @if (f.crops.length) { <span>{{ f.crops.join(', ') }}</span> }
                    @if (f.plants_per_hectare) { <span>{{ f.plants_per_hectare }} plants/ha</span> }
                    @if (!f.subscription_active) { <span class="warn">Subscription inactive</span> }
                    @if (f.imported_farm_id) { <span class="okt">Imported</span> }
                  </span>
                </div>
                <span class="dev" [class.on]="f.has_soilsync" [title]="f.has_soilsync ? 'SoilSync readings arrived' : (f.has_sensor ? 'Platform lists a SoilSync sensor, but no readings arrived' : 'No SoilSync sensor')">
                  <vc-icon name="droplets" [size]="13" />SoilSync</span>
                <span class="dev" [class.on]="f.has_microclime" [title]="f.has_microclime ? 'MicroClime readings arrived' : (f.has_weather ? 'Platform lists a MicroClime station, but no readings arrived' : 'No MicroClime station')">
                  <vc-icon name="thermometer" [size]="13" />MicroClime</span>
                <vc-device-tier [tier]="f.tier" />
              </li>
            }
          </ul>
          @if (importable()) {
            <div class="act">
              <span class="small muted">Imports the farm records only — Varsapradaya holds no boundaries, so map the fields afterwards.</span>
              <span class="spacer"></span>
              @if (pickable().length > 1) {
                <button type="button" class="btn btn-ghost btn-sm" (click)="toggleAll()">{{ picked().size === pickable().length ? 'Clear' : 'Select all' }}</button>
              }
              <button type="button" class="btn btn-primary btn-sm" [disabled]="!picked().size || importing()" (click)="doImport()">
                <vc-icon name="download" [size]="14" />{{ importing() ? 'Importing…' : 'Import farms' + (picked().size ? ' (' + picked().size + ')' : '') }}</button>
            </div>
          }
        } @else { <p class="none">No farms registered on the member platform yet.</p> }
        @for (w of r.warnings; track w) { <p class="wn"><vc-icon name="alert" [size]="13" />{{ w }}</p> }
      </div>
    } @else {
      <div class="box">
        <div class="h">
          <span class="seal muted"><vc-icon name="user" [size]="18" /></span>
          <div class="t"><strong>Not a Varsapradaya customer</strong><span>{{ phone(r.phone) }} isn’t registered on the member platform. You can still add the farmer and their land here.</span></div>
        </div>
      </div>
    }
    @if (r.existing_farmer_id && r.existing_farmer_id !== currentId()) {
      <div class="exists"><vc-icon name="info" [size]="15" />A farmer with this phone number is already registered.
        <a [routerLink]="['/app/farmers', r.existing_farmer_id]">Open their record</a></div>
    }
  `,
  styles: [`
    :host{display:flex;flex-direction:column;gap:8px}
    .box{border:1px solid var(--border);border-radius:10px;background:var(--surface-2);padding:12px 14px}
    .box.ok{background:linear-gradient(180deg,var(--forest-50),#fff);border-color:var(--forest-200)}
    .h{display:flex;gap:12px;align-items:center}
    .spacer{flex:1}
    .seal{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--forest-600);color:#fff;flex:none}
    .seal.muted{background:var(--sand-200);color:var(--stone-600)}
    .t{display:flex;flex-direction:column;gap:1px} .t strong{font-size:14px} .t span{font-size:12.5px;color:var(--text-2)}
    code{font-size:12px;color:var(--stone-800)}
    .sim{font-size:11px;color:var(--text-3);border:1px dashed var(--stone-300);border-radius:5px;padding:2px 6px}
    .farms{list-style:none;margin:12px 0 0;padding:0;display:flex;flex-direction:column;gap:6px}
    .farms li{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#fff;border:1px solid var(--border);border-radius:8px;font-size:13px;color:var(--stone-600);flex-wrap:wrap}
    .farms li.on{border-color:var(--forest-500);box-shadow:inset 0 0 0 1px var(--forest-500)}
    .farms input{width:15px;height:15px;accent-color:var(--forest-600);cursor:pointer}
    .imp{display:grid;place-items:center;width:16px;height:16px;border-radius:50%;background:var(--forest-100);color:var(--forest-700)}
    .fn{flex:1;min-width:180px;display:flex;flex-direction:column;gap:1px}
    .nm{color:var(--stone-900)} .nm code{color:var(--text-3);font-size:11px}
    .sub{display:flex;flex-wrap:wrap;gap:2px 10px;font-size:11.5px;color:var(--text-3)}
    .sub .warn{color:var(--amber-600)} .sub .okt{color:var(--forest-700);font-weight:500}
    .dev{display:inline-flex;align-items:center;gap:4px;height:22px;padding:0 7px;border-radius:5px;font-size:11.5px;background:var(--stone-100);color:var(--stone-400)}
    .dev.on{background:var(--sky-100);color:var(--sky-600)}
    .act{display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap}
    .none{margin-top:8px;font-size:12.5px;color:var(--text-3)}
    .wn{display:flex;gap:6px;align-items:center;margin-top:8px;font-size:12px;color:var(--stone-700)} .wn vc-icon{color:var(--amber-600)}
    .exists{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:8px;background:var(--warn-soft);color:var(--stone-800);font-size:13px;border:1px solid #f1dcae}
    .exists vc-icon{color:var(--amber-600)}
  `],
})
export class MemberResult {
  result = input.required<MemberLookup>();
  currentId = input<string | null>(null);
  /** Show checkboxes and the "Import farms" action (the farmer is linked to this membership). */
  importable = input(false);
  importing = input(false);
  importFarms = output<string[]>();
  phone = formatPhone;

  /** Selected farms; a new lookup result clears the selection. */
  picked = linkedSignal<MemberLookup, Set<string>>({ source: this.result, computation: () => new Set() });
  pickable = computed(() => this.result().farms.filter(f => !f.imported_farm_id));

  short(id: string) { return id.length > 13 ? id.slice(0, 8) + '…' : id; }
  canPick(f: MemberFarm) { return this.importable() && !f.imported_farm_id; }
  isPicked(f: MemberFarm) { return this.picked().has(f.external_farm_id); }
  toggle(f: MemberFarm) {
    const s = new Set(this.picked());
    if (s.has(f.external_farm_id)) s.delete(f.external_farm_id); else s.add(f.external_farm_id);
    this.picked.set(s);
  }
  toggleAll() {
    const all = this.pickable().map(f => f.external_farm_id);
    this.picked.set(this.picked().size === all.length ? new Set() : new Set(all));
  }
  doImport() { if (this.picked().size) this.importFarms.emit([...this.picked()]); }
}
