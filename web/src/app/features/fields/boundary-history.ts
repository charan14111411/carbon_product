import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { ApiError, ApiService } from '../../core/api.service';
import { DayPipe, NumPipe } from '../../core/format';
import { Icon } from '../../ui/icon';
import { Empty, ErrorBox, Loading } from '../../ui/kit';
import { svgPath } from './field-geo';

interface BoundaryVersion {
  id: string;
  field_id: string;
  version: number;
  boundary: GeoJSON.Geometry;
  area_ha: number;
  reason: string;
  created_by: string | null;
  created_at: string;
}

/** Every saved boundary of a field, newest first, with a shape preview and the change in area. */
@Component({
  selector: 'vc-boundary-history',
  imports: [Loading, ErrorBox, Empty, Icon, DayPipe, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) { <vc-loading [rows]="4" /> }
    @else if (error()) { <div class="card-body"><vc-error title="Couldn't load the boundary history" [message]="error()!" /></div> }
    @else if (!items().length) { <vc-empty icon="history" title="No boundary versions" text="The first boundary is recorded when the field is created." /> }
    @else {
      <ol class="versions">
        @for (v of items(); track v.id) {
          <li class="v" [class.current]="$first">
            <svg class="thumb" viewBox="0 0 96 72" aria-hidden="true">
              @if (v.prevPath) { <path [attr.d]="v.prevPath" class="prev" /> }
              <path [attr.d]="v.path" class="cur" />
            </svg>
            <div class="body">
              <div class="h">
                <span class="ver">Version {{ v.version }}</span>
                @if ($first) { <span class="tag">Current</span> }
                <span class="spacer"></span>
                <span class="area num">{{ v.area_ha | num: 2 }} ha</span>
                @if (v.delta !== null) {
                  <span class="delta num" [class.up]="v.delta > 0" [class.down]="v.delta < 0">
                    {{ v.delta > 0 ? '+' : '' }}{{ v.delta | num: 2 }} ha
                  </span>
                }
              </div>
              <p class="reason">{{ v.reason }}</p>
              <div class="meta subtle small"><vc-icon name="clock" [size]="12" />Saved {{ v.created_at | day: true }}</div>
            </div>
          </li>
        }
      </ol>
      <p class="foot subtle small"><vc-icon name="info" [size]="13" />Older versions are kept for the audit trail. Dashed outline = the version before.</p>
    }
  `,
  styles: [`
    .versions{list-style:none;margin:0;padding:8px 0}
    .v{display:flex;gap:16px;padding:14px 20px;border-bottom:1px solid var(--stone-100)}
    .v:last-child{border-bottom:0}
    .thumb{flex:none;width:96px;height:72px;border-radius:8px;background:var(--surface-2);border:1px solid var(--border)}
    .cur{fill:rgba(47,114,73,.18);stroke:var(--forest-600);stroke-width:1.6;stroke-linejoin:round}
    .prev{fill:none;stroke:var(--clay-500);stroke-width:1.2;stroke-dasharray:3 2}
    .v:not(.current) .cur{fill:rgba(115,124,118,.12);stroke:var(--stone-500)}
    .body{flex:1;min-width:0}
    .h{display:flex;align-items:center;gap:8px}
    .ver{font-weight:600}
    .tag{font-size:11px;font-weight:600;padding:2px 7px;border-radius:999px;background:var(--forest-100);color:var(--forest-700)}
    .spacer{flex:1}
    .area{font-weight:600}
    .delta{font-size:12px;padding:2px 6px;border-radius:5px;background:var(--stone-100);color:var(--stone-600)}
    .delta.up{background:var(--forest-50);color:var(--forest-700)} .delta.down{background:var(--clay-50);color:var(--clay-700)}
    .reason{margin-top:4px;color:var(--stone-800)}
    .meta{display:flex;gap:5px;align-items:center;margin-top:6px}
    .foot{display:flex;gap:6px;align-items:center;padding:10px 20px 14px;border-top:1px solid var(--border)}
  `],
})
export class BoundaryHistory {
  private api = inject(ApiService);
  fieldId = input.required<string>();
  /** Bump to reload after a boundary edit. */
  refresh = input(0);

  raw = signal<BoundaryVersion[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  items = computed(() => {
    const list = this.raw();
    return list.map((v, i) => {
      const prev = list[i + 1];
      const [path, prevPath] = svgPath([v.boundary, prev?.boundary], 96, 72, 8);
      return { ...v, path, prevPath: prev ? prevPath : '', delta: prev ? v.area_ha - prev.area_ha : null };
    });
  });

  constructor() {
    effect(() => {
      const id = this.fieldId();
      this.refresh();
      this.loading.set(true);
      this.api.get<BoundaryVersion[]>(`/fields/${id}/history`).subscribe({
        next: r => { this.raw.set(r); this.loading.set(false); },
        error: (e: ApiError) => { this.error.set(e.message); this.loading.set(false); },
      });
    });
  }
}
