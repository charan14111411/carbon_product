import { ChangeDetectionStrategy, Component, computed, input, model, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumPipe } from '../../core/format';
import { Icon } from '../../ui/icon';
import { DrawMap } from './draw-map';
import {
  LngLat, formatLatLonLines, parseLatLonLines, perimeterM, ringAreaHa, selfIntersects,
} from './field-geo';

/** Boundary entry: draw on the map or paste "lat, lon" lines. Shows a live, approximate area. */
@Component({
  selector: 'vc-boundary-editor',
  imports: [FormsModule, Icon, DrawMap, NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modes" role="tablist">
      <button type="button" [class.on]="mode() === 'draw'" (click)="setMode('draw')"><vc-icon name="mouse-click" [size]="15" />Draw on map</button>
      <button type="button" [class.on]="mode() === 'paste'" (click)="setMode('paste')"><vc-icon name="clipboard-paste" [size]="15" />Paste coordinates</button>
    </div>

    <div class="wrap">
      <div class="left">
        @if (mode() === 'draw') {
          <vc-draw-map [(vertices)]="vertices" [context]="context()" [center]="center()" [height]="mapHeight()" />
        } @else {
          <div class="paste">
            <label class="label" for="coords">One corner per line, as <strong>latitude, longitude</strong> (decimal degrees)</label>
            <textarea id="coords" class="input mono" rows="12" [ngModel]="pasteText()" (ngModelChange)="onPaste($event)"
              placeholder="13.340512, 75.771230&#10;13.341180, 75.772904&#10;13.339655, 75.773410&#10;13.339010, 75.771822"></textarea>
            @for (e of pasteErrors(); track e) { <div class="err small">{{ e }}</div> }
            <p class="hint">Tip: copy the corner points from a GPS walk or a spreadsheet. The shape is closed automatically.</p>
          </div>
        }
      </div>

      <aside class="side">
        <div class="measure">
          <div class="m-row">
            <span class="m-lab">Approx. area</span>
            <span class="m-val num">{{ area() | num: 2 }}<small>ha</small></span>
          </div>
          <div class="m-sub">
            <span class="num">{{ vertices().length }}</span> corners · perimeter <span class="num">{{ perimeter() | num: 0 }}</span> m
          </div>
          <p class="note"><vc-icon name="info" [size]="13" />Preview only. The official area is computed by the server from the saved boundary.</p>
        </div>

        @if (crosses()) {
          <div class="warn small"><vc-icon name="alert" [size]="14" />The outline crosses itself. Re-order or move corners so the edges don't intersect.</div>
        }

        <div class="tools">
          <button type="button" class="btn btn-secondary btn-sm" (click)="undo()" [disabled]="!vertices().length"><vc-icon name="undo" [size]="14" />Undo</button>
          <button type="button" class="btn btn-ghost btn-sm" (click)="clear()" [disabled]="!vertices().length"><vc-icon name="eraser" [size]="14" />Clear</button>
          @if (mode() === 'draw') {
            <button type="button" class="btn btn-ghost btn-sm" (click)="map()?.fit()" title="Zoom to drawing"><vc-icon name="crosshair" [size]="14" />Zoom</button>
          }
        </div>

        <div class="verts">
          @for (v of vertices(); track $index) {
            <div class="v">
              <span class="i num">{{ $index + 1 }}</span>
              <span class="c mono">{{ v[1].toFixed(6) }}, {{ v[0].toFixed(6) }}</span>
              <button type="button" class="x" (click)="remove($index)" [attr.aria-label]="'Remove corner ' + ($index + 1)"><vc-icon name="x" [size]="13" /></button>
            </div>
          } @empty {
            <p class="subtle small empty">No corners yet.</p>
          }
        </div>
      </aside>
    </div>
  `,
  styles: [`
    :host{display:block}
    .modes{display:inline-flex;gap:2px;padding:3px;border-radius:8px;background:var(--sand-200);margin-bottom:12px}
    .modes button{display:inline-flex;align-items:center;gap:6px;border:0;background:none;height:30px;padding:0 12px;border-radius:6px;font:500 12.5px var(--font);color:var(--stone-600);cursor:pointer}
    .modes button.on{background:var(--surface);color:var(--stone-900);box-shadow:var(--shadow-sm)}
    .wrap{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:14px}
    @media (max-width: 900px){.wrap{grid-template-columns:1fr}}
    .paste{display:flex;flex-direction:column;gap:8px}
    .paste textarea{min-height:260px;font-size:12.5px}
    .err{color:var(--danger)} .hint{font-size:12px;color:var(--text-3)}
    .side{display:flex;flex-direction:column;gap:12px;min-width:0}
    .measure{padding:14px;border-radius:var(--radius);background:linear-gradient(160deg,var(--forest-800),var(--forest-600));color:#fff}
    .m-row{display:flex;align-items:baseline;justify-content:space-between;gap:8px}
    .m-lab{font-size:12px;color:rgba(255,255,255,.72)}
    .m-val{font-size:26px;font-weight:600;letter-spacing:-.02em} .m-val small{font-size:13px;font-weight:500;margin-left:4px;color:rgba(255,255,255,.72)}
    .m-sub{font-size:12px;color:rgba(255,255,255,.78);margin-top:2px}
    .note{display:flex;gap:6px;align-items:flex-start;margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.16);font-size:11.5px;color:rgba(255,255,255,.78);line-height:1.4}
    .note vc-icon{margin-top:2px}
    .warn{display:flex;gap:8px;align-items:flex-start;padding:10px 12px;border-radius:var(--radius-sm);background:var(--warn-soft);color:var(--stone-800);border:1px solid #f1dcae}
    .warn vc-icon{color:var(--amber-600);margin-top:2px}
    .tools{display:flex;gap:6px;flex-wrap:wrap}
    .verts{border:1px solid var(--border);border-radius:var(--radius-sm);max-height:220px;overflow:auto;background:var(--surface-2)}
    .v{display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid var(--stone-100);font-size:12px}
    .v:last-child{border-bottom:0}
    .i{display:grid;place-items:center;min-width:20px;height:20px;border-radius:5px;background:var(--clay-100);color:var(--clay-700);font-size:11px;font-weight:600}
    .c{flex:1;color:var(--stone-700);font-size:11.5px}
    .x{border:0;background:none;color:var(--stone-400);cursor:pointer;padding:2px;border-radius:4px;display:grid;place-items:center}
    .x:hover{color:var(--danger);background:var(--danger-soft)}
    .empty{padding:10px}
  `],
})
export class BoundaryEditor {
  vertices = model<LngLat[]>([]);
  context = input<GeoJSON.FeatureCollection | null>(null);
  center = input<LngLat | null>(null);
  mapHeight = input<string>('400px');

  mode = signal<'draw' | 'paste'>('draw');
  pasteText = signal('');
  pasteErrors = signal<string[]>([]);
  map = viewChild(DrawMap);

  area = computed(() => ringAreaHa(this.vertices()));
  perimeter = computed(() => perimeterM(this.vertices()));
  crosses = computed(() => selfIntersects(this.vertices()));

  setMode(m: 'draw' | 'paste') {
    if (m === 'paste') this.pasteText.set(formatLatLonLines(this.vertices()));
    this.pasteErrors.set([]);
    this.mode.set(m);
  }

  onPaste(text: string) {
    this.pasteText.set(text);
    const r = parseLatLonLines(text);
    this.pasteErrors.set(r.errors);
    this.vertices.set(r.vertices);
  }

  undo() { this.vertices.update(v => v.slice(0, -1)); this.syncText(); }
  clear() { this.vertices.set([]); this.syncText(); }
  remove(i: number) { this.vertices.update(v => v.filter((_, k) => k !== i)); this.syncText(); }
  private syncText() { if (this.mode() === 'paste') this.pasteText.set(formatLatLonLines(this.vertices())); }
}
