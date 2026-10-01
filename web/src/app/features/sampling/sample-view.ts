import { ChangeDetectionStrategy, Component, OnDestroy, computed, effect, inject, input, signal } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { DayPipe, HumanPipe, NumPipe } from '../../core/format';
import { Icon } from '../../ui/icon';
import { Badge, Callout, DataClass, Hash, Timeline, TimelineItem } from '../../ui/kit';
import { distanceM } from '../../core/geo';
import { ANALYTE_LABEL, CUSTODY_LABEL, ContextBlock, DEPTH_LIMIT_LABEL, Finding, STORAGE_LABEL, SampleDetail } from './types';
import { fmtDate } from '../../core/format';

/** Everything recorded about one soil core: photos, layers, lab results, custody and context. */
@Component({
  selector: 'vc-sample-view',
  imports: [Icon, Badge, DataClass, Hash, Timeline, Callout, DayPipe, NumPipe, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let s = sample();
    <div class="stack" style="--gap:22px">
      <div class="facts">
        <div><span>Collected</span><strong>{{ s.collected_at | day: true }}</strong></div>
        <div><span>By</span><strong>{{ s.collected_by || '—' }}</strong></div>
        <div><span>GPS accuracy</span><strong class="num">{{ s.gps_accuracy_m === null ? '—' : (s.gps_accuracy_m | num: 1) + ' m' }}</strong></div>
        <div><span>From site</span><strong class="num">{{ s.distance_from_site_m | num: 1 }} m</strong></div>
        <div><span>Depth reached</span><strong class="num">{{ s.depth_reached_cm | num: 0 }} cm</strong>
          @if (s.depth_limit) { <em class="lim">Stopped by {{ limitLabel(s.depth_limit) }}</em> }</div>
        <div><span>Probe inner diameter</span><strong class="num">{{ s.probe_diameter_mm == null ? '—' : (s.probe_diameter_mm | num: 1) + ' mm' }}</strong></div>
        <div><span>Cores composited</span><strong class="num">{{ s.cores_composited == null ? '—' : s.cores_composited + (s.cores_composited === 1 ? ' core' : ' cores') }}</strong></div>
        <div><span>Custody</span><vc-badge [status]="s.status === 'none' ? 'pending' : 'active'">{{ s.status | human }}</vc-badge></div>
      </div>

      <section>
        <h3 class="sh">Where it was taken <span class="chipref">VM0042 §8.2.1.2</span></h3>
        <div class="table-wrap geo">
          <table class="table">
            <thead><tr><th></th><th class="num">Latitude</th><th class="num">Longitude</th><th></th></tr></thead>
            <tbody>
              <tr>
                <td><span class="gk"><i class="pin-int"></i>Intended</span><div class="subtle small">Planned site {{ s.site_code }}</div></td>
                <td class="num mono">{{ intended().lat == null ? '—' : (intended().lat | num: 6) }}</td>
                <td class="num mono">{{ intended().lon == null ? '—' : (intended().lon | num: 6) }}</td>
                <td><vc-dc cls="DERIVED" /></td>
              </tr>
              <tr>
                <td><span class="gk"><i class="pin-act"></i>Actual</span><div class="subtle small">GPS at the hole, ±{{ s.gps_accuracy_m == null ? '—' : (s.gps_accuracy_m | num: 1) }} m</div></td>
                <td class="num mono">{{ actual().lat | num: 6 }}</td>
                <td class="num mono">{{ actual().lon | num: 6 }}</td>
                <td><vc-dc cls="MEASURED" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="gap-line">
          <vc-icon name="arrow-left-right" [size]="15" />
          <span>Distance between them</span>
          <strong class="num">{{ s.distance_from_site_m | num: 1 }} m</strong>
          <vc-dc cls="CALCULATED" />
          @if (bearingText(); as b) { <span class="subtle small">the actual position is {{ b }} of the planned site</span> }
        </div>
      </section>

      @if (s.depth_limit) {
        <vc-callout tone="info" icon="pickaxe">
          <strong>Depth limit: {{ limitLabel(s.depth_limit) }}.</strong> The core stopped at {{ s.depth_reached_cm | num: 0 }} cm.
          A shallower core counts towards reporting depth only when bedrock or a hardpan stopped it (VM0042 §8.2.1.3(7b)).
        </vc-callout>
      }
      @if (s.deviation_reason) {
        <vc-callout tone="warn" icon="alert"><strong>Deviation recorded:</strong> {{ s.deviation_reason }}</vc-callout>
      }
      @if (findings().length) {
        <div class="stack" style="--gap:8px">
          @for (f of findings(); track f.id) {
            <vc-callout [tone]="f.severity === 'blocking' ? 'danger' : 'warn'" icon="shield">
              <strong>{{ f.rule_code }}</strong> · {{ f.message }}
            </vc-callout>
          }
        </div>
      }

      <section>
        <h3 class="sh">Photos <span class="subtle">{{ s.photos.length }}</span></h3>
        @if (!s.photos.length) {
          <p class="muted small">No photos were attached to this core.</p>
        } @else {
          <div class="photos">
            @for (p of s.photos; track p.id) {
              <a class="ph" [href]="urls()[p.id] || null" target="_blank" rel="noopener">
                @if (urls()[p.id]) { <img [src]="urls()[p.id]" [alt]="p.filename" /> } @else { <span class="ph-load"><vc-icon name="image" [size]="20" /></span> }
                <span class="cap">
                  <span class="truncate">{{ p.filename }}</span>
                  @if (p.latitude !== null) { <span class="mono subtle">{{ p.latitude | num: 5 }}, {{ p.longitude | num: 5 }}</span> }
                </span>
              </a>
            }
          </div>
        }
      </section>

      <section>
        <h3 class="sh">Layers and lab results</h3>
        <div class="layers">
          @for (l of s.layers; track l.id) {
            <div class="layer">
              <div class="lh">
                <span class="depth num">{{ l.depth_from_cm | num: 0 }}–{{ l.depth_to_cm | num: 0 }} cm</span>
                <code>{{ l.code }}</code>
                <span class="spacer"></span>
                <span class="subtle small"><vc-icon name="qr" [size]="13" /> {{ l.label_qr }}</span>
              </div>
              @if (!l.lab_results.length) {
                <p class="subtle small lr-empty">No lab results yet.</p>
              } @else {
                <table class="table lr">
                  <tbody>
                    @for (r of l.lab_results; track r.id) {
                      <tr [class.old]="r.status === 'voided' || r.status === 'rejected'">
                        <td>{{ analyte(r.analyte) }} @if (r.version > 1) { <span class="subtle small">v{{ r.version }}</span> }</td>
                        <td class="num"><strong>{{ r.value | num: 3 }}</strong>&ngsp;<span class="subtle">{{ r.unit }}</span></td>
                        <td><vc-dc [cls]="r.data_class" /></td>
                        <td class="muted small">{{ r.method | human }}</td>
                        <td><vc-badge [status]="r.status" /></td>
                      </tr>
                    }
                  </tbody>
                </table>
              }
            </div>
          }
        </div>
      </section>

      <section>
        <h3 class="sh">Chain of custody</h3>
        <vc-timeline [items]="custody()" />
      </section>

      <section>
        <h3 class="sh">Conditions at collection</h3>
        <p class="subtle small" style="margin-bottom:10px">A snapshot taken when the core was recorded. Missing sources are stated, never guessed.</p>
        <div class="ctx">
          @for (c of contextRows(); track c.key) {
            <div class="ctx-row">
              <span class="ck"><vc-icon [name]="c.icon" [size]="15" />{{ c.label }}</span>
              @if (c.block?.status === 'available') {
                <div class="cv">
                  @for (v of c.block!.values ?? []; track $index) {
                    <span class="chip">{{ v['parameter'] || v['index'] }} <strong class="num">{{ $any(v['value']) | num: 2 }}</strong> {{ v['unit'] || '' }}</span>
                  }
                  <vc-dc [cls]="$any(c.block!.values?.[0]?.['data_class']) || 'OBSERVED'" />
                </div>
              } @else {
                <span class="na">Not available · {{ c.block?.reason || 'not recorded' }}</span>
              }
            </div>
          }
        </div>
      </section>

      <section>
        <h3 class="sh">Record</h3>
        <dl class="kv">
          <dt>Sample code</dt><dd><code>{{ s.code }}</code></dd>
          <dt>Layers</dt><dd>{{ s.layers.length }} depth increment(s)@if (s.context.core_depths_reached_cm?.length) { · core depths {{ s.context.core_depths_reached_cm!.join(', ') }} cm }</dd>
          <dt>Device</dt><dd class="mono">{{ s.device_id || '—' }}</dd>
          <dt>Sync reference</dt><dd class="mono small">{{ s.client_ref }}</dd>
          @if (s.photos[0]) { <dt>First photo fingerprint</dt><dd><vc-hash [value]="s.photos[0].sha256" /></dd> }
        </dl>
      </section>
    </div>
  `,
  styles: [`
    .facts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:var(--border);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
    .facts>div{background:var(--surface);padding:10px 12px;display:flex;flex-direction:column;gap:3px;align-items:flex-start}
    .facts span{font-size:11.5px;color:var(--text-3)} .facts strong{font-weight:600;font-size:14px}
    .facts .lim{font-style:normal;font-size:11.5px;color:var(--amber-600)}
    .chipref{font:600 10.5px/1 var(--mono);padding:4px 6px;border-radius:4px;background:var(--sand-200);color:var(--stone-700);margin-left:auto}
    .geo{border:1px solid var(--border);border-radius:var(--radius-sm)}
    .geo td{padding:8px 12px;vertical-align:top}
    .gk{display:inline-flex;align-items:center;gap:7px;font-weight:600}
    .gk i{width:10px;height:10px;border-radius:50%;display:inline-block}
    .pin-int{border:2px solid var(--stone-500);background:var(--surface)}
    .pin-act{background:var(--forest-600)}
    .gap-line{display:flex;align-items:center;gap:8px;margin-top:8px;padding:8px 12px;border-radius:var(--radius-sm);background:var(--surface-2);border:1px solid var(--border);font-size:13px;flex-wrap:wrap}
    .gap-line vc-icon{color:var(--text-3)}
    .sh{margin-bottom:10px;display:flex;gap:6px;align-items:baseline}
    .photos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
    .ph{display:flex;flex-direction:column;border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;text-decoration:none!important;color:inherit;background:var(--surface-2)}
    .ph img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;background:var(--sand-200)}
    .ph-load{display:grid;place-items:center;aspect-ratio:4/3;color:var(--stone-400);background:var(--sand-200)}
    .cap{display:flex;flex-direction:column;padding:6px 8px;font-size:11.5px;min-width:0}
    .layers{display:flex;flex-direction:column;gap:10px}
    .layer{border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden}
    .lh{display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--surface-2);border-bottom:1px solid var(--border)}
    .lh code{font-size:12px}
    .lh .subtle{display:inline-flex;align-items:center;gap:4px}
    .depth{font-weight:600;min-width:74px}
    .lr td{padding:8px 12px}
    .lr tr.old td{opacity:.55}
    .lr-empty{padding:10px 12px}
    .ctx{display:flex;flex-direction:column;border:1px solid var(--border);border-radius:var(--radius-sm)}
    .ctx-row{display:flex;gap:12px;padding:10px 12px;border-bottom:1px solid var(--stone-100);align-items:center;flex-wrap:wrap}
    .ctx-row:last-child{border-bottom:0}
    .ck{display:inline-flex;gap:8px;align-items:center;min-width:130px;font-weight:500;color:var(--stone-700)}
    .cv{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
    .chip{font-size:12px;background:var(--sand-100);border:1px solid var(--border);border-radius:999px;padding:2px 8px}
    .na{font-size:12.5px;color:var(--text-3);font-style:italic}
    @media (max-width:640px){.facts,.photos{grid-template-columns:repeat(2,minmax(0,1fr))}}
  `],
})
export class SampleView implements OnDestroy {
  private api = inject(ApiService);
  sample = input.required<SampleDetail>();
  findings = input<Finding[]>([]);
  urls = signal<Record<string, string>>({});
  private made: string[] = [];
  private asked = new Set<string>();

  custody = computed<TimelineItem[]>(() =>
    this.sample().custody.map(e => ({
      title: CUSTODY_LABEL[e.event] ?? e.event,
      at: fmtDate(e.occurred_at, true),
      by: [e.recorded_by, e.location].filter(Boolean).join(' · '),
      note: [
        e.seal_intact === false ? 'Seal was broken' : e.seal_intact ? 'Seal intact' : '',
        e.count_matches === false ? 'bag count did not match' : e.count_matches ? 'bag count matched' : '',
        e.storage ? `Stored: ${STORAGE_LABEL[e.storage.condition] ?? e.storage.condition}` : '',
        e.notes || (e.event === 'prepared' ? 'Drying, 2 mm sieving and grinding (VM0042 §8.2.1.3(3))' : ''),
      ].filter(Boolean).join(' · ') || null,
      tone: e.event === 'correction' || e.seal_intact === false || e.count_matches === false ? 'warn' : 'ok',
    })),
  );

  contextRows = computed(() => {
    const c = this.sample().context ?? {};
    return [
      { key: 'weather', label: 'Weather', icon: 'rain', block: c.weather as ContextBlock | undefined },
      { key: 'sensor', label: 'Soil sensor', icon: 'thermometer', block: c.sensor as ContextBlock | undefined },
      { key: 'satellite', label: 'Satellite', icon: 'satellite', block: c.satellite as ContextBlock | undefined },
    ];
  });

  constructor() {
    effect(() => {
      const s = this.sample();
      for (const p of s.photos) {
        if (this.asked.has(p.id)) continue;
        this.asked.add(p.id);
        this.api.blob(`/evidence/${p.id}/content`).subscribe({
          next: b => {
            const u = URL.createObjectURL(b);
            this.made.push(u);
            this.urls.update(m => ({ ...m, [p.id]: u }));
          },
          error: () => {},
        });
      }
    });
  }

  intended = computed(() => ({ lat: this.sample().intended_latitude ?? null, lon: this.sample().intended_longitude ?? null }));
  actual = computed(() => ({ lat: this.sample().actual_latitude ?? this.sample().latitude, lon: this.sample().actual_longitude ?? this.sample().longitude }));
  bearingText = computed(() => {
    const i = this.intended(), a = this.actual();
    if (i.lat == null || i.lon == null || distanceM(i.lat, i.lon, a.lat, a.lon) < 0.5) return null;
    const dy = a.lat - i.lat, dx = (a.lon - i.lon) * Math.cos((i.lat * Math.PI) / 180);
    const deg = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;
    return ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'][Math.round(deg / 45) % 8];
  });

  limitLabel(k: string) { return DEPTH_LIMIT_LABEL[k as keyof typeof DEPTH_LIMIT_LABEL] ?? k; }
  analyte(a: string) { return ANALYTE_LABEL[a] ?? a; }

  ngOnDestroy(): void {
    this.made.forEach(u => URL.revokeObjectURL(u));
  }
}
