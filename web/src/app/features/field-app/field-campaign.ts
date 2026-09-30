import { ChangeDetectionStrategy, Component, OnDestroy, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AgoPipe } from '../../core/format';
import { bearingDeg, compass, distanceM, humanDistance } from '../../core/geo';
import { Bundle, OfflineStore, QueuedSample } from '../../core/offline';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { MapView } from '../../ui/map-view';
import { FieldData } from './field-data';
import { FIELD_CSS } from './field.styles';
import { FieldGps } from './gps.service';
import { LOCAL_COLOR, LOCAL_LABEL, LOCAL_TONE, LocalStatus, localStatus } from './point-status';

interface Row {
  id: string;
  site: string;
  field: string;
  status: LocalStatus;
  dist: number | null;
  bearing: number | null;
  seq: number;
}

@Component({
  selector: 'vc-field-campaign',
  imports: [RouterLink, Icon, MapView, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!cid()) {
      <div class="fpage">
        <div class="ftitle">Choose a campaign</div>
        @for (b of data.bundles(); track b.campaignId) {
          <a class="fcard pick" [routerLink]="['/field/campaign', b.campaignId]">
            <span><strong>{{ b.campaign.code }}</strong><em>{{ b.campaign.name }}</em></span><vc-icon name="chevron-right" [size]="22" />
          </a>
        } @empty {
          <div class="fcard fempty">
            <div class="ic"><vc-icon name="map" [size]="26" /></div>
            <h3>No campaigns on this phone</h3>
            <p>Download a campaign from Home to see its points on the map, even without signal.</p>
            <a class="fbtn secondary" routerLink="/field">Go to Home</a>
          </div>
        }
      </div>
    } @else if (loading()) {
      <div class="fpage"><div class="fcard fempty"><div class="ic"><vc-icon name="download" [size]="26" /></div><h3>Opening campaign…</h3></div></div>
    } @else if (!bundle()) {
      <div class="fpage">
        <div class="fcard fempty">
          <div class="ic"><vc-icon name="wifi-off" [size]="26" /></div>
          <h3>This campaign isn't on this phone</h3>
          <p>{{ error() || 'Connect to the internet once to download it.' }}</p>
          <a class="fbtn secondary" routerLink="/field">Back to Home</a>
        </div>
      </div>
    } @else {
      @let b = bundle()!;
      <div class="head">
        <a routerLink="/field" class="back" aria-label="Back"><vc-icon name="arrow-left" [size]="22" /></a>
        <div class="ht"><strong>{{ b.campaign.code }}</strong><span>{{ b.campaign.name }}</span></div>
        <span class="gps" [class]="'gps ' + gpsTone()"><vc-icon name="locate" [size]="16" [stroke]="2.2" />{{ gpsText() }}</span>
      </div>
      <vc-map class="map" height="38vh" [polygons]="fieldsFc()" [points]="pointsFc()" (featureClick)="onMap($event)" />
      @if (gps.error()) { <div class="gpserr"><vc-icon name="alert" [size]="16" />{{ gps.error() }}</div> }

      <div class="fpage list">
        <div class="lhead">
          <div class="seg">
            <button [class.on]="filter() === 'todo'" (click)="filter.set('todo')">To do <b>{{ todoCount() }}</b></button>
            <button [class.on]="filter() === 'all'" (click)="filter.set('all')">All <b>{{ rows().length }}</b></button>
          </div>
          <span class="saved">Saved {{ b.savedAt | ago }}</span>
        </div>
        @for (r of shown(); track r.id) {
          <button class="fcard pt" (click)="openPoint(r)">
            <span class="arrow" [style.transform]="'rotate(' + arrowDeg(r) + 'deg)'" [class.none]="r.bearing === null">
              <svg viewBox="0 0 24 24" width="30" height="30"><path d="M12 2 19 20 12 16 5 20Z" fill="currentColor" /></svg>
            </span>
            <span class="pi">
              <strong class="mono">{{ r.site }}</strong>
              <span>Field {{ r.field }}</span>
            </span>
            <span class="pd">
              <strong class="num">{{ r.dist === null ? '—' : human(r.dist) }}</strong>
              <span>{{ r.bearing === null ? 'no GPS' : dir(r.bearing) }}</span>
            </span>
            <span class="chip" [class]="'chip ' + tone[r.status]">{{ label[r.status] }}</span>
          </button>
        } @empty {
          <div class="fcard fempty">
            <div class="ic"><vc-icon name="check-circle" [size]="26" /></div>
            <h3>All your points are done</h3>
            <p>Check the Outbox to make sure everything has uploaded.</p>
            <a class="fbtn secondary" routerLink="/field/outbox">Open Outbox</a>
          </div>
        }
      </div>
    }
  `,
  styles: [FIELD_CSS, `
    .pick{display:flex;align-items:center;gap:12px;padding:16px;text-decoration:none!important;color:var(--stone-900)}
    .pick span{flex:1;display:flex;flex-direction:column} .pick em{font-style:normal;color:var(--stone-600);font-size:14px}
    .head{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#fff;border-bottom:1.5px solid var(--sand-300)}
    .back{display:grid;place-items:center;width:48px;height:48px;border-radius:12px;color:var(--stone-900)}
    .ht{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.25}
    .ht strong{font-size:16px} .ht span{font-size:13.5px;color:var(--stone-600);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .gps{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 10px;border-radius:999px;font-size:13px;font-weight:600;white-space:nowrap}
    .gps.ok{background:var(--forest-100);color:var(--forest-800)} .gps.warn{background:var(--amber-100);color:#7a4d00} .gps.bad{background:var(--red-100);color:var(--red-600)}
    .map{border-radius:0;border-left:0;border-right:0}
    .gpserr{display:flex;gap:8px;align-items:flex-start;padding:10px 16px;background:var(--amber-100);color:#5c3a00;font-size:14px}
    .list{gap:10px}
    .lhead{display:flex;align-items:center;justify-content:space-between;gap:10px}
    .seg{display:flex;background:#fff;border:1.5px solid var(--sand-300);border-radius:12px;padding:4px;gap:4px}
    .seg button{min-height:40px;padding:0 14px;border:0;border-radius:9px;background:none;font:600 15px var(--font);color:var(--stone-700);cursor:pointer}
    .seg button.on{background:var(--forest-700);color:#fff}
    .seg b{margin-left:4px;opacity:.8}
    .saved{font-size:13px;color:var(--stone-600)}
    .pt{display:flex;align-items:center;gap:12px;width:100%;min-height:76px;padding:10px 14px;text-align:left;font:inherit;cursor:pointer;color:var(--stone-900)}
    .arrow{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:var(--forest-100);color:var(--forest-800);flex:none;transition:transform .3s}
    .arrow.none{color:var(--stone-400);background:var(--stone-100)}
    .pi{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
    .pi strong{font-size:16px} .pi span{font-size:14px;color:var(--stone-600)}
    .pd{display:flex;flex-direction:column;align-items:flex-end;gap:2px;min-width:64px}
    .pd strong{font-size:17px} .pd span{font-size:13px;color:var(--stone-600)}
    @media (max-width:380px){.pt .chip{display:none}}
  `],
})
export class FieldCampaign implements OnDestroy {
  private router = inject(Router);
  private toast = inject(ToastService);
  private store = inject(OfflineStore);
  data = inject(FieldData);
  gps = inject(FieldGps);

  cid = input<string>('');
  bundle = signal<Bundle | null>(null);
  samples = signal<QueuedSample[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  filter = signal<'todo' | 'all'>('todo');
  label = LOCAL_LABEL;
  tone = LOCAL_TONE;

  rows = computed<Row[]>(() => {
    const b = this.bundle();
    if (!b) return [];
    const f = this.gps.fix();
    const out = b.points.map(p => ({
      id: p.id, site: p.site_code, field: p.field_code ?? '', status: localStatus(p, this.samples()), seq: p.sequence ?? 0,
      dist: f ? distanceM(f.lat, f.lon, p.latitude, p.longitude) : null,
      bearing: f ? bearingDeg(f.lat, f.lon, p.latitude, p.longitude) : null,
    }));
    return out.sort((a, b2) => (a.dist !== null && b2.dist !== null ? a.dist - b2.dist : a.seq - b2.seq));
  });
  todoCount = computed(() => this.rows().filter(r => r.status === 'planned' || r.status === 'rejected').length);
  shown = computed(() => (this.filter() === 'all' ? this.rows() : this.rows().filter(r => r.status === 'planned' || r.status === 'rejected')));
  gpsTone = computed(() => {
    const f = this.gps.fix();
    if (!f) return 'bad';
    const max = this.bundle()?.thresholds.gps_accuracy_max_m ?? 10;
    return f.accuracy <= max ? 'ok' : 'warn';
  });
  gpsText = computed(() => {
    const f = this.gps.fix();
    return f ? `±${Math.round(f.accuracy)} m` : this.gps.supported ? 'Finding GPS' : 'No GPS';
  });
  fieldsFc = computed(() => {
    const b = this.bundle();
    if (!b) return null;
    return { ...b.fields, features: b.fields.features.map(f => ({ ...f, properties: { ...f.properties, color: '#2f7249', label: `<strong>${f.properties?.['code']}</strong>` } })) };
  });
  pointsFc = computed<GeoJSON.FeatureCollection>(() => {
    const b = this.bundle();
    const f = this.gps.fix();
    const byId = new Map(this.rows().map(r => [r.id, r]));
    const feats: GeoJSON.Feature[] = (b?.points ?? []).map(p => {
      const st = byId.get(p.id)?.status ?? 'planned';
      return {
        type: 'Feature', geometry: { type: 'Point', coordinates: [p.longitude, p.latitude] },
        properties: { id: p.id, color: LOCAL_COLOR[st], label: `<strong>${p.site_code}</strong><br>${LOCAL_LABEL[st]}` },
      };
    });
    if (f) feats.push({ type: 'Feature', geometry: { type: 'Point', coordinates: [f.lon, f.lat] }, properties: { id: '__me', color: '#0b1f15', label: 'You are here' } });
    return { type: 'FeatureCollection', features: feats };
  });

  constructor() {
    this.gps.start();
    effect(() => {
      const id = this.cid();
      if (id) void this.load(id);
    });
    effect(() => {
      this.store.changed();
      const id = this.cid();
      if (id) void this.store.samplesFor(id).then(s => this.samples.set(s));
    });
  }

  async load(id: string) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const b = await this.data.bundle(id);
      this.bundle.set(b ?? null);
      if (b) localStorage.setItem('vc.field.lastCampaign', id);
    } catch (e) {
      this.error.set((e as { message?: string }).message ?? 'Download failed.');
    } finally {
      this.loading.set(false);
    }
  }

  arrowDeg(r: Row) {
    if (r.bearing === null) return 0;
    return r.bearing - (this.gps.heading() ?? 0);
  }

  human(m: number) { return humanDistance(m); }
  dir(b: number) { return compass(b); }

  openPoint(r: Row) {
    if (r.status === 'saved' || r.status === 'uploading' || r.status === 'synced' || r.status === 'collected') {
      this.toast.info(`${r.site} is already ${LOCAL_LABEL[r.status].toLowerCase()}`, 'Open the Outbox to see what was recorded.');
      return;
    }
    if (r.status === 'skipped') {
      this.toast.info(`${r.site} was skipped`, 'Ask your supervisor if it should be sampled after all.');
      return;
    }
    this.router.navigate(['/field/campaign', this.cid(), 'point', r.id]);
  }

  onMap(e: { layer: string; id: string }) {
    if (e.layer !== 'point' || e.id === '__me') return;
    const r = this.rows().find(x => x.id === e.id);
    if (r) this.openPoint(r);
  }

  ngOnDestroy(): void {
    this.gps.stop();
  }
}
