import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../ui/icon';
import { formatPhone, MemberLookup } from './types';

/** The result of a Varsapradaya member lookup: member id, farms and connected devices. */
@Component({
  selector: 'vc-member-result',
  imports: [Icon, RouterLink],
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
        </div>
        @if (r.farms.length) {
          <ul class="farms">
            @for (f of r.farms; track f.external_farm_id) {
              <li>
                <vc-icon name="tractor" [size]="15" />
                <span class="fn">{{ f.name }} <code>{{ f.external_farm_id }}</code></span>
                <span class="dev" [class.on]="f.has_soilsync" [title]="f.has_soilsync ? 'SoilSync soil sensor connected' : 'No SoilSync sensor'">
                  <vc-icon name="droplets" [size]="13" />SoilSync</span>
                <span class="dev" [class.on]="f.has_microclime" [title]="f.has_microclime ? 'MicroClime weather station connected' : 'No MicroClime station'">
                  <vc-icon name="thermometer" [size]="13" />MicroClime</span>
              </li>
            }
          </ul>
        } @else { <p class="none">No farms registered on the member platform yet.</p> }
      </div>
    } @else {
      <div class="box">
        <div class="h">
          <span class="seal muted"><vc-icon name="user" [size]="18" /></span>
          <div class="t"><strong>Not a Varsapradaya member</strong><span>{{ phone(r.phone) }} isn’t registered on the member platform. You can still add the farmer here.</span></div>
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
    .seal{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--forest-600);color:#fff;flex:none}
    .seal.muted{background:var(--sand-200);color:var(--stone-600)}
    .t{display:flex;flex-direction:column;gap:1px} .t strong{font-size:14px} .t span{font-size:12.5px;color:var(--text-2)}
    code{font-size:12px;color:var(--stone-800)}
    .farms{list-style:none;margin:12px 0 0;padding:0;display:flex;flex-direction:column;gap:6px}
    .farms li{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#fff;border:1px solid var(--border);border-radius:8px;font-size:13px;color:var(--stone-600)}
    .fn{flex:1;color:var(--stone-900)} .fn code{color:var(--text-3);font-size:11px}
    .dev{display:inline-flex;align-items:center;gap:4px;height:22px;padding:0 7px;border-radius:5px;font-size:11.5px;background:var(--stone-100);color:var(--stone-400)}
    .dev.on{background:var(--sky-100);color:var(--sky-600)}
    .none{margin-top:8px;font-size:12.5px;color:var(--text-3)}
    .exists{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:8px;background:var(--warn-soft);color:var(--stone-800);font-size:13px;border:1px solid #f1dcae}
    .exists vc-icon{color:var(--amber-600)}
  `],
})
export class MemberResult {
  result = input.required<MemberLookup>();
  currentId = input<string | null>(null);
  phone = formatPhone;
}
