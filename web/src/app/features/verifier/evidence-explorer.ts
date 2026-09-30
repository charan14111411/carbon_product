import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DayPipe, HumanPipe, NumPipe } from '../../core/format';
import { Icon } from '../../ui/icon';
import { DataClass, Empty, Hash } from '../../ui/kit';

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
type Section = 'samples' | 'lab_results' | 'custody_events' | 'fields' | 'document_index';

export interface FileRef { id: string; filename: string }
export interface Subject { type: string; id: string; label: string }

const SECTIONS: { key: Section; label: string; icon: string; text: string }[] = [
  { key: 'fields', label: 'Fields', icon: 'map', text: 'Every field in scope, with area, crop and soil type.' },
  { key: 'samples', label: 'Samples', icon: 'target', text: 'Soil cores with GPS, depth reached and field photos.' },
  { key: 'custody_events', label: 'Chain of custody', icon: 'truck', text: 'Every hand-over from field to laboratory.' },
  { key: 'lab_results', label: 'Lab results', icon: 'flask', text: 'All results, with the versions used in the calculation marked.' },
  { key: 'document_index', label: 'Documents', icon: 'file', text: 'Every referenced file and its SHA-256 fingerprint.' },
];

const ANALYTE: Record<string, string> = { soc_pct: 'Soil organic carbon', bulk_density_g_cm3: 'Bulk density', coarse_fraction: 'Coarse fraction' };

/** Read-only browser over the sealed package JSON. */
@Component({
  selector: 'vc-evidence-explorer',
  imports: [FormsModule, NgTemplateOutlet, Icon, DataClass, Hash, Empty, DayPipe, NumPipe, HumanPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ex">
      <nav class="secs" aria-label="Evidence sections">
        @for (s of sections; track s.key) {
          <button [class.on]="sec() === s.key" (click)="sec.set(s.key); q.set('')">
            <vc-icon [name]="s.icon" [size]="15" /><span>{{ s.label }}</span><span class="c num">{{ count(s.key) }}</span>
          </button>
        }
      </nav>
      <div class="main card">
        <div class="head">
          <div><h3>{{ meta().label }}</h3><p class="small muted">{{ meta().text }}</p></div>
          <div class="search">
            <vc-icon name="search" [size]="15" />
            <input class="input" [placeholder]="'Search ' + meta().label.toLowerCase() + '…'" [ngModel]="q()" (ngModelChange)="q.set($event)" />
          </div>
        </div>
        <div class="table-wrap tw">
          @if (!rows().length) {
            <vc-empty icon="search" title="Nothing to show" [text]="q() ? 'No records match your search.' : 'This section of the package is empty.'" />
          } @else {
            <table class="table">
              @switch (sec()) {
                @case ('fields') {
                  <thead><tr><th>Field</th><th class="num">Area</th><th>Crop</th><th>Soil type</th><th>Version</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    @for (r of rows(); track r['id']) {
                      <tr>
                        <td><strong>{{ r['code'] }}</strong><div class="subtle small">{{ r['name'] }}</div></td>
                        <td class="num nowrap">{{ r['area_ha'] | num: 2 }} <span class="u">ha</span></td>
                        <td>{{ r['crop_code'] || '—' }}</td><td>{{ r['soil_type'] | human }}</td>
                        <td>v{{ r['version'] }}</td><td>{{ r['status'] | human }}</td>
                        <td class="num"><ng-container *ngTemplateOutlet="askBtn; context: { $implicit: { type: 'field', id: r['id'], label: 'Field ' + r['code'] } }" /></td>
                      </tr>
                    }
                  </tbody>
                }
                @case ('samples') {
                  <thead><tr><th>Core</th><th>Campaign</th><th>Site</th><th>Collected</th><th>GPS</th><th class="num">Accuracy</th><th class="num">Depth</th><th>Photos</th><th></th></tr></thead>
                  <tbody>
                    @for (r of rows(); track r['id']) {
                      <tr>
                        <td><strong class="mono">{{ r['code'] }}</strong>&nbsp;<vc-dc cls="RECORDED" /></td>
                        <td class="nowrap">{{ campaignCode(r['campaign_id']) }}<div class="subtle small">{{ campaignKindOnly(r['campaign_id']) }}</div></td>
                        <td class="mono small nowrap">{{ siteCode(r['site_id']) }}</td>
                        <td class="nowrap">{{ r['collected_at'] | day: true }}</td>
                        <td class="mono small nowrap">{{ gps(r) }}</td>
                        <td class="num nowrap">± {{ r['gps_accuracy_m'] | num: 1 }} <span class="u">m</span></td>
                        <td class="num nowrap">{{ r['depth_reached_cm'] | num: 0 }} <span class="u">cm</span></td>
                        <td><div class="ph">
                          @for (p of r['photos'] ?? []; track p.id; let i = $index) {
                            <button class="btn btn-ghost btn-sm" (click)="open.emit({ id: p.id, filename: r['code'] + '-photo-' + (i + 1) })" [title]="p.sha256"><vc-icon name="image" [size]="14" />{{ i + 1 }}</button>
                          } @empty { <span class="subtle">—</span> }
                        </div></td>
                        <td class="num"><ng-container *ngTemplateOutlet="askBtn; context: { $implicit: { type: 'sample', id: r['id'], label: 'Core ' + r['code'] } }" /></td>
                      </tr>
                    }
                  </tbody>
                }
                @case ('custody_events') {
                  <thead><tr><th>Core</th><th>Event</th><th>When</th><th>Where</th><th>Seal</th><th>Count</th><th>Notes</th><th></th></tr></thead>
                  <tbody>
                    @for (r of rows(); track r['id']) {
                      <tr>
                        <td class="mono">{{ sampleCode(r['sample_id']) }}</td>
                        <td>{{ r['event'] | human }}@if (r['corrects_event_id']) { <span class="tag">correction</span> }</td>
                        <td class="nowrap">{{ r['occurred_at'] | day: true }}</td>
                        <td>{{ r['location'] || '—' }}</td>
                        <td><span [class]="yn(r['seal_intact'])">{{ ynText(r['seal_intact'], 'Intact', 'Broken') }}</span></td>
                        <td><span [class]="yn(r['count_matches'])">{{ ynText(r['count_matches'], 'Matches', 'Mismatch') }}</span></td>
                        <td class="small muted">{{ r['notes'] || '—' }}</td>
                        <td class="num"><ng-container *ngTemplateOutlet="askBtn; context: { $implicit: { type: 'custody_event', id: r['id'], label: 'Custody event for ' + sampleCode(r['sample_id']) } }" /></td>
                      </tr>
                    }
                  </tbody>
                }
                @case ('lab_results') {
                  <thead><tr><th>Layer</th><th>Analyte</th><th class="num">Value</th><th>Method</th><th>Analysed</th><th>Status</th><th>Used</th><th>Certificate</th><th></th></tr></thead>
                  <tbody>
                    @for (r of rows(); track r['id']) {
                      <tr [class.unused]="!r['used_in_calculation']">
                        <td class="mono small nowrap">{{ r['layer_code'] }}</td>
                        <td class="nowrap">{{ analyte(r['analyte']) }} @if (r['version'] > 1) { <span class="tag">v{{ r['version'] }}</span> }</td>
                        <td class="num nowrap"><strong>{{ r['value'] | num: 3 }}</strong>&nbsp;<span class="u">{{ r['unit'] }}</span>&nbsp;<vc-dc cls="MEASURED" /></td>
                        <td class="small">{{ (r['method'] || '—').replace('_', ' ') }}</td>
                        <td class="nowrap">{{ r['analysed_on'] | day }}</td>
                        <td>{{ r['status'] | human }}</td>
                        <td>@if (r['used_in_calculation']) { <span class="yes"><vc-icon name="check" [size]="13" />Used</span> } @else { <span class="subtle small">No</span> }</td>
                        <td>
                          @if (r['certificate_id']; as cid) {
                            <div class="cert">
                              @if (doc(cid)?.sha256; as sh) { <vc-hash [value]="sh" /> }
                              <button class="btn btn-ghost btn-sm" (click)="open.emit({ id: cid, filename: doc(cid)?.filename ?? 'certificate' })"><vc-icon name="external" [size]="13" />Open</button>
                            </div>
                          } @else { <span class="subtle">—</span> }
                        </td>
                        <td class="num"><ng-container *ngTemplateOutlet="askBtn; context: { $implicit: { type: 'lab_result', id: r['id'], label: analyte(r['analyte']) + ' for layer ' + r['layer_code'] } }" /></td>
                      </tr>
                    }
                  </tbody>
                }
                @case ('document_index') {
                  <thead><tr><th>File</th><th>Kind</th><th class="num">Size</th><th>Fingerprint (SHA-256)</th><th>Referenced by</th><th></th></tr></thead>
                  <tbody>
                    @for (r of rows(); track r['id']) {
                      <tr>
                        <td><strong>{{ r['filename'] ?? 'Missing file' }}</strong><div class="subtle small">{{ r['mime_type'] }}</div></td>
                        <td>{{ r['kind'] | human }}</td>
                        <td class="num nowrap">{{ kb(r['size_bytes']) }}</td>
                        <td>@if (r['sha256']) { <vc-hash [value]="r['sha256']" /> } @else { <span class="bad">Missing</span> }</td>
                        <td class="small muted">{{ (r['referenced_by'] ?? []).length }} record(s)</td>
                        <td class="num nowrap">
                          @if (!r['missing']) { <button class="btn btn-ghost btn-sm" (click)="open.emit({ id: r['id'], filename: r['filename'] })"><vc-icon name="external" [size]="13" />Open</button> }
                          <ng-container *ngTemplateOutlet="askBtn; context: { $implicit: { type: 'evidence', id: r['id'], label: 'File ' + (r['filename'] ?? r['id']) } }" />
                        </td>
                      </tr>
                    }
                  </tbody>
                }
              }
            </table>
          }
        </div>
        @if (total() > limit) {
          <div class="card-foot foot small muted">Showing the first {{ limit }} of {{ total() }} records. Refine the search to narrow the list; the downloaded JSON holds every record.</div>
        }
      </div>
    </div>

    <ng-template #askBtn let-s>
      @if (askable()) {
        <button class="btn btn-ghost btn-sm btn-icon ask" (click)="ask.emit(s)" title="Raise a question on this item" aria-label="Raise a question"><vc-icon name="question" [size]="15" /></button>
      }
    </ng-template>
  `,
  styles: [`
    .ex{display:grid;grid-template-columns:220px minmax(0,1fr);gap:16px;align-items:start}
    @media (max-width: 900px){.ex{grid-template-columns:1fr}.secs{flex-direction:row!important;overflow-x:auto}}
    .secs{display:flex;flex-direction:column;gap:2px;position:sticky;top:84px}
    .secs button{display:flex;align-items:center;gap:10px;height:38px;padding:0 12px;border:0;border-radius:8px;background:none;font:inherit;color:var(--stone-700);cursor:pointer;text-align:left;white-space:nowrap}
    .secs button:hover{background:var(--sand-200)}
    .secs button.on{background:var(--surface);box-shadow:var(--shadow-sm);color:var(--forest-700);font-weight:500}
    .secs span:nth-child(2){flex:1}
    .c{font-size:11.5px;color:var(--text-3)}
    .head{display:flex;gap:16px;align-items:flex-start;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border);flex-wrap:wrap}
    .search{position:relative;width:300px;max-width:100%}
    .search vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)}
    .search .input{padding-left:34px}
    .tw{max-height:620px}
    .u{font-size:11.5px;color:var(--text-3);margin-left:3px}
    .tag{font-size:10.5px;padding:1px 6px;border-radius:999px;background:var(--stone-100);color:var(--stone-600);margin-left:4px}
    .y{color:var(--forest-700)} .n{color:var(--red-600);font-weight:500} .na{color:var(--text-3)}
    .yes{display:inline-flex;align-items:center;gap:4px;font-size:12.5px;color:var(--forest-700)}
    tr.unused td{color:var(--text-3)}
    .ph{display:flex;gap:2px;flex-wrap:nowrap}
    .ph .btn{padding:0 6px;gap:4px}
    .cert{display:flex;align-items:center;gap:4px}
    .bad{color:var(--red-600);font-weight:500}
    .ask{color:var(--text-3)} .ask:hover{color:var(--forest-700)}
    .foot{justify-content:flex-start}
  `],
})
export class EvidenceExplorer {
  pkg = input.required<Row>();
  askable = input(true);
  open = output<FileRef>();
  ask = output<Subject>();

  sections = SECTIONS;
  sec = signal<Section>('samples');
  q = signal('');
  limit = 300;

  meta = computed(() => SECTIONS.find(s => s.key === this.sec())!);
  private maps = computed(() => {
    const p = this.pkg();
    return {
      campaigns: new Map<string, Row>((p['campaigns'] ?? []).map((c: Row) => [c['id'], c])),
      sites: new Map<string, Row>((p['sites'] ?? []).map((c: Row) => [c['id'], c])),
      samples: new Map<string, Row>((p['samples'] ?? []).map((c: Row) => [c['id'], c])),
      docs: new Map<string, Row>((p['document_index'] ?? []).map((c: Row) => [c['id'], c])),
    };
  });
  private filtered = computed(() => {
    const list: Row[] = this.pkg()[this.sec()] ?? [];
    const q = this.q().trim().toLowerCase();
    if (!q) return list;
    return list.filter(r => {
      const extra = this.sec() === 'custody_events' ? this.sampleCode(r['sample_id']) : '';
      return (JSON.stringify(r) + extra).toLowerCase().includes(q);
    });
  });
  total = computed(() => this.filtered().length);
  rows = computed(() => this.filtered().slice(0, this.limit));

  count(k: Section) { return (this.pkg()[k] ?? []).length; }
  campaignCode(id: string) { return this.maps().campaigns.get(id)?.['code'] ?? '—'; }
  campaignKindOnly(id: string) { const k = this.maps().campaigns.get(id)?.['kind']; return k ? k.charAt(0).toUpperCase() + k.slice(1) : ''; }
  siteCode(id: string) { return this.maps().sites.get(id)?.['code'] ?? '—'; }
  sampleCode(id: string) { return this.maps().samples.get(id)?.['code'] ?? String(id ?? '').slice(0, 8); }
  doc(id: string) { return this.maps().docs.get(id) as { sha256?: string; filename?: string } | undefined; }
  analyte(a: string) { return ANALYTE[a] ?? a; }
  gps(r: Row) { return r['latitude'] != null && r['longitude'] != null ? `${Number(r['latitude']).toFixed(5)}, ${Number(r['longitude']).toFixed(5)}` : '—'; }
  yn(v: boolean | null) { return v === true ? 'y' : v === false ? 'n' : 'na'; }
  ynText(v: boolean | null, y: string, n: string) { return v === true ? y : v === false ? n : '—'; }
  kb(b: number | null | undefined) { return !b ? '—' : b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`; }
}
