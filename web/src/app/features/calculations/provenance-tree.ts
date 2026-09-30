import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { fmtDate, fmtNum } from '../../core/format';
import { Icon } from '../../ui/icon';
import { DataClass, Hash } from '../../ui/kit';
import { EvidenceBrief, Provenance, TERM_STATUS, ruleSource, ruleValue, termLabel } from './calc.types';

export type NodeKind =
  | 'run' | 'group' | 'rule' | 'term' | 'stratum' | 'site' | 'sample' | 'layer' | 'result' | 'certificate' | 'custody' | 'photo';

export interface PNode {
  key: string;
  kind: NodeKind;
  icon: string;
  label: string;
  sub?: string;
  dc?: string;
  count?: number;
  used?: boolean;
  tags?: { text: string; tone: 'ok' | 'warn' | 'danger' | 'info' | 'neutral' }[];
  kv: [string, string][];
  hash?: string;
  file?: EvidenceBrief;
  /** entity reference for questions: type + id */
  ref?: { type: string; id: string };
  children: PNode[];
  parent?: PNode;
  text: string;
}

interface Row { node: PNode; depth: number; open: boolean; hasKids: boolean; parts: [string, string, string] }

const KIND_LABEL: Record<NodeKind, string> = {
  run: 'Calculation run', group: 'Group', rule: 'Methodology rule', term: 'Decided term', stratum: 'Zone (stratum)',
  site: 'Permanent sampling site', sample: 'Soil core', layer: 'Soil layer', result: 'Lab result',
  certificate: 'Lab certificate', custody: 'Custody event', photo: 'Field photo',
};

const FILTERS: { kind: NodeKind; label: string; icon: string }[] = [
  { kind: 'rule', label: 'Rules', icon: 'scale' },
  { kind: 'term', label: 'Terms', icon: 'sigma' },
  { kind: 'stratum', label: 'Zones', icon: 'map' },
  { kind: 'site', label: 'Sites', icon: 'pin' },
  { kind: 'sample', label: 'Samples', icon: 'target' },
  { kind: 'layer', label: 'Layers', icon: 'layers' },
  { kind: 'result', label: 'Lab results', icon: 'flask' },
  { kind: 'certificate', label: 'Certificates', icon: 'file-check' },
  { kind: 'custody', label: 'Custody', icon: 'truck' },
];

const ANALYTE: Record<string, string> = {
  soc_pct: 'Soil organic carbon', bulk_density_g_cm3: 'Bulk density', coarse_fraction: 'Coarse fraction',
};

const h = (s: string | null | undefined) => {
  if (!s) return '—';
  const t = String(s).replace(/_/g, ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
};
const n = (v: unknown, d = 2) => (typeof v === 'number' ? fmtNum(v, d) : v === null || v === undefined ? '—' : String(v));

/** Build the display tree from the provenance payload. */
export function buildTree(p: Provenance): PNode {
  const mk = (x: Omit<PNode, 'children' | 'text'> & { children?: PNode[] }): PNode => {
    const node: PNode = { ...x, children: x.children ?? [], text: '' };
    node.text = [node.label, node.sub, ...node.kv.map(k => k[1]), node.hash ?? '', node.file?.filename ?? ''].join(' ').toLowerCase();
    for (const c of node.children) c.parent = node;
    return node;
  };
  const r = p.run;

  const rules = mk({
    key: 'g:rules', kind: 'group', icon: 'scale', label: 'Methodology rules', sub: 'Frozen with the run', count: p.rules.length, kv: [],
    children: p.rules.map(x => mk({
      key: `rule:${x.key}`, kind: 'rule', icon: 'scale', label: x.label, sub: ruleValue(x.value), dc: 'RECORDED',
      ref: { type: 'rule', id: x.key },
      kv: [['Rule key', x.key], ['Value', ruleValue(x.value)], ['Source', ruleSource(x.source)]],
    })),
  });

  const supplied = new Map(p.terms.map(t => [t.term, t]));
  const termNodes = (p.term_results.length ? p.term_results : p.terms.map(t => ({ ...t, status: 'supplied' }))).map(t => {
    const s = supplied.get(t.term);
    return mk({
      key: `term:${t.term}`, kind: 'term', icon: 'sigma', label: termLabel(t.term),
      sub: t.status === 'supplied' ? `${n(t.value_t_co2e, 2)} tCO₂e` : TERM_STATUS[t.status] ?? h(t.status),
      dc: t.status === 'supplied' ? 'RECORDED' : undefined,
      tags: t.status === 'supplied' ? [] : [{ text: TERM_STATUS[t.status] ?? h(t.status), tone: 'neutral' }],
      ref: { type: 'term', id: s?.id ?? t.term },
      kv: [
        ['Value', `${n(t.value_t_co2e, 3)} tCO₂e`], ['Variance', `${n(t.variance, 4)} (tCO₂e)²`], ['Degrees of freedom', n(t.df, 1)],
        ['How it was used', TERM_STATUS[t.status] ?? h(t.status)],
        ...(s ? ([['Estimate version', `v${s.version}`], ['Source', s.source]] as [string, string][]) : []),
      ],
    });
  });
  const terms = mk({ key: 'g:terms', kind: 'group', icon: 'sigma', label: 'Decided terms', sub: 'Project-level estimates', count: termNodes.length, kv: [], children: termNodes });

  let nSites = 0, nSamples = 0;
  const strata = p.strata.map(st => {
    const res = st.result ?? {};
    const sites = st.sites.map(site => {
      nSites++;
      const samples = site.samples.map(smp => {
        nSamples++;
        const layers = smp.layers.map(ly => mk({
          key: `layer:${ly.id}`, kind: 'layer', icon: 'layers', label: `Layer ${ly.code}`, sub: `${n(ly.depth_from_cm, 0)}–${n(ly.depth_to_cm, 0)} cm`,
          used: ly.used_in_calculation, count: ly.lab_results.length, ref: { type: 'layer', id: ly.id },
          kv: [['Depth', `${n(ly.depth_from_cm, 0)}–${n(ly.depth_to_cm, 0)} cm`], ['Used in calculation', ly.used_in_calculation ? 'Yes' : 'No — below the required depth or not needed']],
          children: ly.lab_results.map(lr => mk({
            key: `result:${lr.id}`, kind: 'result', icon: 'flask', label: ANALYTE[lr.analyte] ?? h(lr.analyte),
            sub: `${n(lr.value, 3)} ${lr.unit}`, dc: lr.data_class || 'MEASURED', used: lr.used_in_calculation,
            tags: [
              ...(lr.status !== 'accepted' ? [{ text: h(lr.status), tone: lr.status === 'rejected' ? 'danger' : 'warn' } as const] : []),
              ...(lr.version > 1 ? [{ text: `v${lr.version}`, tone: 'neutral' } as const] : []),
            ],
            ref: { type: 'lab_result', id: lr.id },
            kv: [
              ['Value', `${n(lr.value, 4)} ${lr.unit}`], ['Method', lr.method || '—'], ['Status', h(lr.status)],
              ['Version', `v${lr.version}`], ['Analysed on', fmtDate(lr.analysed_on)],
              ['Used in calculation', lr.used_in_calculation ? 'Yes — this exact version' : 'No'],
            ],
            children: lr.certificate ? [mk({
              key: `cert:${lr.id}:${lr.certificate.id}`, kind: 'certificate', icon: 'file-check',
              label: lr.certificate.filename ?? 'Lab certificate', sub: lr.certificate.missing ? 'File missing' : 'Signed laboratory certificate',
              hash: lr.certificate.sha256 ?? undefined, file: lr.certificate.missing ? undefined : lr.certificate,
              tags: lr.certificate.missing ? [{ text: 'Missing', tone: 'danger' }] : [],
              ref: { type: 'evidence', id: lr.certificate.id },
              kv: [['File', lr.certificate.filename ?? '—'], ['Type', lr.certificate.mime_type ?? '—']],
            })] : [],
          })),
        }));
        const custody = smp.custody.map(ev => mk({
          key: `custody:${ev.id}`, kind: 'custody', icon: 'truck', label: h(ev.event), sub: fmtDate(ev.occurred_at, true) + (ev.location ? ` · ${ev.location}` : ''),
          dc: 'RECORDED', ref: { type: 'custody_event', id: ev.id },
          tags: [
            ...(ev.seal_intact === false ? [{ text: 'Seal broken', tone: 'danger' } as const] : []),
            ...(ev.count_matches === false ? [{ text: 'Count mismatch', tone: 'danger' } as const] : []),
          ],
          kv: [
            ['When', fmtDate(ev.occurred_at, true)], ['Where', ev.location ?? '—'],
            ['Seal intact', ev.seal_intact === null ? '—' : ev.seal_intact ? 'Yes' : 'No'],
            ['Bag count matches', ev.count_matches === null ? '—' : ev.count_matches ? 'Yes' : 'No'], ['Notes', ev.notes || '—'],
          ],
        }));
        const photos = smp.photos.map(ph => mk({
          key: `photo:${smp.id}:${ph.id}`, kind: 'photo', icon: 'camera', label: ph.filename ?? 'Field photo', sub: ph.missing ? 'File missing' : 'Taken at collection',
          hash: ph.sha256 ?? undefined, file: ph.missing ? undefined : ph, ref: { type: 'evidence', id: ph.id }, kv: [['File', ph.filename ?? '—']],
        }));
        const kids: PNode[] = [
          mk({ key: `g:layers:${smp.id}`, kind: 'group', icon: 'layers', label: 'Soil layers', count: layers.length, kv: [], children: layers }),
          mk({ key: `g:custody:${smp.id}`, kind: 'group', icon: 'truck', label: 'Chain of custody', count: custody.length, kv: [], children: custody,
            tags: custody.length ? [] : [{ text: 'No events', tone: 'warn' }] }),
        ];
        if (photos.length) kids.push(mk({ key: `g:photos:${smp.id}`, kind: 'group', icon: 'camera', label: 'Photos', count: photos.length, kv: [], children: photos }));
        const g = smp.gps;
        return mk({
          key: `sample:${smp.id}`, kind: 'sample', icon: 'target', label: `Core ${smp.code}`,
          sub: `${h(smp.campaign)} · ${fmtDate(smp.collected_at)}`, dc: 'RECORDED', ref: { type: 'sample', id: smp.id },
          tags: [{ text: h(smp.campaign), tone: smp.campaign === 'baseline' ? 'neutral' : 'info' }],
          kv: [
            ['Campaign', h(smp.campaign)], ['Collected', fmtDate(smp.collected_at, true)],
            ['GPS', g.latitude !== null && g.longitude !== null ? `${g.latitude.toFixed(6)}, ${g.longitude.toFixed(6)}` : '—'],
            ['GPS accuracy', g.accuracy_m !== null ? `± ${n(g.accuracy_m, 1)} m` : '—'],
            ['Distance from site', g.distance_from_site_m !== null ? `${n(g.distance_from_site_m, 1)} m` : '—'],
            ['Depth reached', smp.depth_reached_cm !== null ? `${n(smp.depth_reached_cm, 0)} cm` : '—'],
          ],
          children: kids,
        });
      });
      return mk({
        key: `site:${site.id}`, kind: 'site', icon: 'pin', label: `Site ${site.code ?? site.id.slice(0, 8)}`,
        sub: site.latitude !== null && site.longitude !== null ? `${site.latitude.toFixed(5)}, ${site.longitude.toFixed(5)}` : undefined,
        count: samples.length, ref: { type: 'site', id: site.id },
        kv: [['Location', site.latitude !== null && site.longitude !== null ? `${site.latitude}, ${site.longitude}` : '—'], ['Cores used', String(samples.length)]],
        children: samples,
      });
    });
    const excluded = (res['excluded_sites'] as string[] | undefined) ?? [];
    return mk({
      key: `stratum:${st.id}`, kind: 'stratum', icon: 'map', label: `${st.code} · ${st.name}`,
      sub: `${h(st.role)} zone · ${n(st.area_ha, 1)} ha`, dc: 'CALCULATED', count: sites.length, ref: { type: 'stratum', id: st.id },
      tags: [
        ...(st.role === 'control' ? [{ text: `Control for ${st.control_for_code}`, tone: 'info' } as const] : []),
        ...(excluded.length ? [{ text: `${excluded.length} excluded`, tone: 'warn' } as const] : []),
      ],
      kv: [
        ['Role', h(st.role)], ['Area', `${n(st.area_ha, 2)} ha`], ['Zone version', `v${st.version}`], ['Fields', String(st.field_ids.length)],
        ['Sites used (n)', n(res['n_used'], 0)], ['Mean baseline stock', `${n(res['mean_baseline_t_c_ha'], 2)} t C/ha`],
        ['Mean monitoring stock', `${n(res['mean_monitoring_t_c_ha'], 2)} t C/ha`], ['Change', `${n(res['delta_t_c_ha'], 3)} t C/ha`],
        ['Variance of change', n(res['variance'], 5)], ['Standard error', n(res['se'], 4)], ['Degrees of freedom', n(res['df'], 1)],
        ['Excluded sites', excluded.length ? excluded.join(', ') : 'None'],
      ],
      children: sites,
    });
  });
  const strataGroup = mk({ key: 'g:strata', kind: 'group', icon: 'map', label: 'Zones, sites and samples', sub: `${nSites} sites · ${nSamples} cores`, count: strata.length, kv: [], children: strata });

  return mk({
    key: `run:${r.id}`, kind: 'run', icon: 'calculator', label: `Calculation · ${r.period_label}`,
    sub: `${fmtDate(r.period_start)} – ${fmtDate(r.period_end)} · ${fmtNum(r.net_t_co2e, 1)} tCO₂e net`, dc: 'CALCULATED',
    tags: [{ text: h(r.status), tone: r.status === 'approved' ? 'ok' : r.status === 'rejected' ? 'danger' : 'info' }],
    hash: r.snapshot_sha256, ref: { type: 'calculation_run', id: r.id },
    kv: [
      ['Net credits', `${fmtNum(r.net_t_co2e, 2)} tCO₂e`], ['Reductions', `${fmtNum(r.reductions_t_co2e, 2)} tCO₂e`],
      ['Removals', `${fmtNum(r.removals_t_co2e, 2)} tCO₂e`], ['Gross change', `${fmtNum(r.gross_t_co2e, 2)} tCO₂e`],
      ['Uncertainty deduction', `${fmtNum(r.uncertainty_deduction_t_co2e, 2)} tCO₂e`], ['Buffer', `${fmtNum(r.buffer_t_co2e, 2)} tCO₂e`],
      ['Status', h(r.status)], ['Engine version', r.engine_version],
    ],
    children: [rules, terms, strataGroup],
  });
}

function walkAll(n: PNode, f: (x: PNode) => void) { f(n); for (const c of n.children) walkAll(c, f); }

@Component({
  selector: 'vc-provenance-tree',
  imports: [FormsModule, Icon, DataClass, Hash],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toolbar">
      <div class="search">
        <vc-icon name="search" [size]="15" />
        <input class="input" placeholder="Search codes, values, methods, fingerprints…" [ngModel]="q()" (ngModelChange)="q.set($event)" aria-label="Search the provenance tree" />
        @if (q()) { <button class="clr" (click)="q.set('')" aria-label="Clear search"><vc-icon name="x" [size]="14" /></button> }
      </div>
      <label class="checkbox small"><input type="checkbox" [ngModel]="usedOnly()" (ngModelChange)="usedOnly.set($event)" />Only data used in the calculation</label>
      <span class="spacer"></span>
      <button class="btn btn-ghost btn-sm" (click)="expandAll()"><vc-icon name="chevrons-up-down" [size]="14" />Expand all</button>
      <button class="btn btn-ghost btn-sm" (click)="collapseAll()"><vc-icon name="collapse" [size]="14" />Collapse</button>
    </div>

    <div class="chips" role="group" aria-label="Filter by record type">
      @for (f of filters; track f.kind) {
        <button type="button" class="chip" [class.on]="kind() === f.kind" (click)="kind.set(kind() === f.kind ? null : f.kind)">
          <vc-icon [name]="f.icon" [size]="13" />{{ f.label }}<span class="c">{{ counts()[f.kind] ?? 0 }}</span>
        </button>
      }
    </div>

    <div class="body">
      <div class="tree" #treeEl tabindex="0" role="tree" aria-label="Provenance" (keydown)="key($event)">
        @if (filtering()) {
          <div class="fnote">
            <vc-icon name="filter" [size]="13" />
            {{ matchCount() }} match{{ matchCount() === 1 ? '' : 'es' }}
            @if (kind()) { in {{ kindLabel(kind()!) }} }
            @if (q()) { for “{{ q() }}” }
            <button class="lnk" (click)="clearFilters()">Clear</button>
          </div>
        }
        @for (r of rows(); track r.node.key) {
          <div class="row" role="treeitem" [attr.aria-expanded]="r.hasKids ? r.open : null" [attr.aria-level]="r.depth + 1"
            [class.sel]="selected()?.key === r.node.key" [class.grp]="r.node.kind === 'group'" [class.unused]="r.node.used === false"
            [attr.data-key]="r.node.key" (click)="select(r.node)" (dblclick)="toggle(r.node)">
            <span class="guides" [style.width.px]="r.depth * 20"></span>
            <button class="tw" [class.hidden]="!r.hasKids" (click)="toggle(r.node); $event.stopPropagation()" tabindex="-1" [attr.aria-label]="r.open ? 'Collapse' : 'Expand'">
              <vc-icon name="chevron-right" [size]="14" [stroke]="2" [class.rot]="r.open" />
            </button>
            <span class="k" [class]="'k k-' + r.node.kind"><vc-icon [name]="r.node.icon" [size]="13" /></span>
            <span class="lbl">{{ r.parts[0] }}@if (r.parts[1]) {<mark>{{ r.parts[1] }}</mark>}{{ r.parts[2] }}</span>
            @if (r.node.sub) { <span class="sub">{{ r.node.sub }}</span> }
            <span class="spacer"></span>
            @for (t of r.node.tags ?? []; track t.text) { <span class="tag" [class]="'tag t-' + t.tone">{{ t.text }}</span> }
            @if (r.node.used === false) { <span class="tag t-neutral" title="Not used in this calculation">Not used</span> }
            @if (r.node.hash) { <vc-icon class="hs" name="fingerprint" [size]="13" [attr.title]="r.node.hash" /> }
            @if (r.node.dc) { <vc-dc [cls]="r.node.dc" /> }
            @if (r.node.count !== undefined) { <span class="cnt">{{ r.node.count }}</span> }
          </div>
        } @empty {
          <div class="none">Nothing matches. Try a sample code such as a core number, an analyte, or part of a fingerprint.</div>
        }
      </div>

      <aside class="insp">
        @if (selected(); as s) {
          <div class="ih">
            <span class="k big" [class]="'k big k-' + s.kind"><vc-icon [name]="s.icon" [size]="16" /></span>
            <div class="it">
              <div class="ik">{{ kindLabel(s.kind) }}</div>
              <h3>{{ s.label }}</h3>
              @if (s.sub) { <div class="isub">{{ s.sub }}</div> }
            </div>
          </div>
          @if (s.dc || s.used !== undefined) {
            <div class="irow">
              @if (s.dc) { <vc-dc [cls]="s.dc" /> <span class="small muted">{{ dcText(s.dc) }}</span> }
            </div>
          }
          <nav class="crumbs" aria-label="Path">
            @for (c of path(); track c.key; let last = $last) {
              <button class="crumb" (click)="reveal(c)">{{ c.label }}</button>@if (!last) { <vc-icon name="chevron-right" [size]="11" /> }
            }
          </nav>
          @if (s.kv.length) {
            <dl class="kv ikv">
              @for (x of s.kv; track x[0]) { <dt>{{ x[0] }}</dt><dd>{{ x[1] }}</dd> }
            </dl>
          }
          @if (s.hash) {
            <div class="ihash">
              <div class="ik">SHA-256 fingerprint</div>
              <vc-hash [value]="s.hash" [full]="true" />
            </div>
          }
          @if (s.children.length) {
            <p class="small subtle ichild">Contains {{ s.children.length }} item{{ s.children.length === 1 ? '' : 's' }}.
              <button class="lnk" (click)="toggle(s)">{{ expanded().has(s.key) ? 'Collapse' : 'Expand' }}</button></p>
          }
          <div class="iact">
            @if (s.file) {
              <button class="btn btn-secondary btn-sm" (click)="openFile.emit(s.file)"><vc-icon name="external" [size]="14" />Open file</button>
            }
            @if (askable() && s.ref) {
              <button class="btn btn-secondary btn-sm" (click)="ask.emit({ type: s.ref.type, id: s.ref.id, label: kindLabel(s.kind) + ': ' + s.label })">
                <vc-icon name="question" [size]="14" />Raise a question
              </button>
            }
          </div>
        } @else {
          <div class="iempty">
            <vc-icon name="network" [size]="22" />
            <p>Select any item to see exactly what it holds and where it came from.</p>
            <p class="small subtle">Use the arrow keys to move through the tree; → opens, ← closes.</p>
          </div>
        }
      </aside>
    </div>
  `,
  styles: [`
    :host{display:block}
    .toolbar{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:14px 16px;border-bottom:1px solid var(--border)}
    .search{position:relative;flex:1;min-width:240px;max-width:460px}
    .search > vc-icon{position:absolute;left:12px;top:11px;color:var(--text-3)}
    .search .input{padding-left:34px;padding-right:30px}
    .clr{position:absolute;right:6px;top:7px;width:24px;height:24px;display:grid;place-items:center;border:0;background:none;color:var(--text-3);cursor:pointer;border-radius:4px}
    .clr:hover{background:var(--sand-200)}
    .spacer{flex:1}
    .chips{display:flex;gap:6px;flex-wrap:wrap;padding:10px 16px;border-bottom:1px solid var(--border);background:var(--surface-2)}
    .chip{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:999px;border:1px solid var(--border);background:var(--surface);
      font:inherit;font-size:12.5px;color:var(--stone-700);cursor:pointer}
    .chip:hover{border-color:var(--stone-400)}
    .chip.on{background:var(--forest-600);border-color:var(--forest-600);color:#fff}
    .chip .c{font-size:11px;color:var(--text-3);font-variant-numeric:tabular-nums}
    .chip.on .c{color:rgba(255,255,255,.8)}
    .body{display:grid;grid-template-columns:minmax(0,1fr) 360px;min-height:520px}
    @media (max-width: 1100px){.body{grid-template-columns:1fr}.insp{border-left:0;border-top:1px solid var(--border)}}
    .tree{padding:8px 8px 16px;max-height:680px;overflow:auto;outline:none}
    .tree:focus-visible{box-shadow:inset var(--focus)}
    .fnote{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--text-2);padding:4px 8px 8px}
    .row{display:flex;align-items:center;gap:6px;height:32px;padding:0 8px 0 4px;border-radius:6px;cursor:pointer;white-space:nowrap;min-width:0}
    .row:hover{background:var(--sand-100)}
    .row.sel{background:var(--forest-50);box-shadow:inset 2px 0 0 var(--forest-500)}
    .row.grp .lbl{font-weight:500;color:var(--stone-700)}
    .row.unused .lbl,.row.unused .sub{opacity:.6}
    .guides{flex:none;align-self:stretch;background:repeating-linear-gradient(to right,transparent 0 11px,var(--sand-300) 11px 12px,transparent 12px 20px)}
    .tw{flex:none;width:20px;height:20px;display:grid;place-items:center;border:0;background:none;color:var(--text-3);cursor:pointer;border-radius:4px;padding:0}
    .tw:hover{background:var(--sand-200);color:var(--text)}
    .tw.hidden{visibility:hidden}
    .tw vc-icon{transition:transform .12s}
    .tw vc-icon.rot{transform:rotate(90deg)}
    .k{flex:none;display:grid;place-items:center;width:22px;height:22px;border-radius:6px;background:var(--sand-200);color:var(--stone-600)}
    .k.big{width:34px;height:34px;border-radius:9px}
    .k-run{background:var(--dc-calculated-bg);color:var(--dc-calculated)}
    .k-rule,.k-term{background:var(--violet-100);color:var(--violet-600)}
    .k-stratum{background:var(--teal-100);color:var(--teal-600)}
    .k-site,.k-sample{background:var(--forest-100);color:var(--forest-600)}
    .k-layer{background:var(--clay-50);color:var(--clay-600)}
    .k-result{background:var(--dc-measured-bg);color:var(--dc-measured)}
    .k-certificate,.k-photo{background:var(--sky-100);color:var(--sky-600)}
    .k-custody{background:var(--stone-100);color:var(--stone-700)}
    .k-group{background:transparent;color:var(--stone-500)}
    .lbl{font-size:13.5px;color:var(--text);overflow:hidden;text-overflow:ellipsis;min-width:0}
    mark{background:var(--amber-100);color:inherit;border-radius:2px;padding:0 1px}
    .sub{font-size:12.5px;color:var(--text-3);overflow:hidden;text-overflow:ellipsis;min-width:0;font-variant-numeric:tabular-nums}
    .tag{flex:none;font-size:11px;height:18px;line-height:18px;padding:0 7px;border-radius:999px;font-weight:500}
    .t-ok{background:var(--ok-soft);color:var(--forest-700)} .t-warn{background:var(--warn-soft);color:var(--amber-600)}
    .t-danger{background:var(--danger-soft);color:var(--red-600)} .t-info{background:var(--info-soft);color:var(--sky-600)}
    .t-neutral{background:var(--stone-100);color:var(--stone-600)}
    .hs{color:var(--text-3)}
    .cnt{flex:none;min-width:22px;height:18px;padding:0 6px;border-radius:9px;background:var(--sand-200);color:var(--stone-600);font-size:11px;display:grid;place-items:center;font-variant-numeric:tabular-nums}
    .none{padding:40px 16px;text-align:center;color:var(--text-2)}
    .insp{border-left:1px solid var(--border);background:var(--surface-2);padding:18px;position:sticky;top:var(--topbar-h);align-self:start;max-height:720px;overflow:auto}
    .ih{display:flex;gap:12px;align-items:flex-start}
    .it{min-width:0} .it h3{overflow-wrap:anywhere}
    .ik{font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--text-3)}
    .isub{font-size:13px;color:var(--text-2);margin-top:2px}
    .irow{display:flex;align-items:center;gap:8px;margin-top:12px}
    .crumbs{display:flex;flex-wrap:wrap;align-items:center;gap:2px;margin:14px 0 4px;color:var(--text-3)}
    .crumb{border:0;background:none;font:inherit;font-size:12px;color:var(--text-2);cursor:pointer;padding:2px 4px;border-radius:4px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .crumb:hover{background:var(--sand-200);color:var(--text)}
    .ikv{margin-top:12px;font-size:13px;grid-template-columns:minmax(110px,44%) 1fr;padding:12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm)}
    .ikv dd{font-variant-numeric:tabular-nums}
    .ihash{margin-top:14px;display:flex;flex-direction:column;gap:6px}
    .ihash vc-hash{word-break:break-all}
    .ichild{margin-top:12px}
    .iact{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
    .iempty{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;padding:48px 12px;color:var(--text-2)}
    .iempty vc-icon{color:var(--forest-500)}
    .lnk{border:0;background:none;color:var(--primary);font:inherit;font-size:12.5px;cursor:pointer;padding:0 2px}
    .lnk:hover{text-decoration:underline}
  `],
})
export class ProvenanceTree {
  data = input.required<Provenance>();
  askable = input(false);
  openFile = output<EvidenceBrief>();
  ask = output<{ type: string; id: string; label: string }>();

  filters = FILTERS;
  q = signal('');
  kind = signal<NodeKind | null>(null);
  usedOnly = signal(false);
  expanded = signal(new Set<string>());
  /** Nodes the user collapsed while a filter is active. */
  closedInFilter = signal(new Set<string>());
  selected = signal<PNode | null>(null);
  private treeEl = viewChild<ElementRef<HTMLDivElement>>('treeEl');

  root = computed(() => buildTree(this.data()));
  private all = computed(() => {
    const out: PNode[] = [];
    walkAll(this.root(), x => out.push(x));
    return out;
  });
  counts = computed(() => {
    const c: Partial<Record<NodeKind, number>> = {};
    for (const x of this.all()) c[x.kind] = (c[x.kind] ?? 0) + 1;
    return c;
  });
  filtering = computed(() => !!this.q().trim() || !!this.kind());

  private matches = computed(() => {
    const q = this.q().trim().toLowerCase();
    const k = this.kind();
    const m = new Set<string>();
    if (!q && !k) return m;
    for (const x of this.all()) {
      if (x.kind === 'group' && k) continue;
      if ((k ? x.kind === k : true) && (!q || x.text.includes(q))) m.add(x.key);
    }
    return m;
  });
  matchCount = computed(() => this.matches().size);

  rows = computed<Row[]>(() => {
    const out: Row[] = [];
    const exp = this.expanded();
    const filtering = this.filtering();
    const matches = this.matches();
    const usedOnly = this.usedOnly();
    const q = this.q().trim().toLowerCase();
    const keep = new Set<string>();
    if (filtering) {
      for (const x of this.all()) if (matches.has(x.key)) for (let p = x.parent; p; p = p.parent) keep.add(p.key);
    }
    const walk = (node: PNode, depth: number, forced: boolean) => {
      if (usedOnly && node.used === false) return;
      if (filtering && !forced && !keep.has(node.key) && !matches.has(node.key)) return;
      const kids = usedOnly ? node.children.filter(c => c.used !== false) : node.children;
      // While filtering, ancestors of matches open automatically (unless the user closed them).
      const open = filtering && keep.has(node.key) ? !this.closedInFilter().has(node.key) : exp.has(node.key);
      out.push({ node, depth, open, hasKids: kids.length > 0, parts: split(node.label, q) });
      if (!open) return;
      const childForced = forced || (filtering && matches.has(node.key));
      for (const c of kids) walk(c, depth + 1, childForced);
    };
    walk(this.root(), 0, false);
    return out;
  });

  path = computed(() => {
    const out: PNode[] = [];
    for (let p = this.selected(); p; p = p.parent ?? null) out.unshift(p);
    return out;
  });

  constructor() {
    effect(() => {
      const r = this.root();
      const exp = new Set<string>([r.key, 'g:terms', 'g:strata']);
      const strata = r.children.find(c => c.key === 'g:strata');
      strata?.children.forEach(c => exp.add(c.key));
      this.expanded.set(exp);
      this.selected.set(r);
    });
  }

  kindLabel(k: NodeKind) { return KIND_LABEL[k]; }
  dcText(dc: string) {
    return ({
      MEASURED: 'Measured by an accredited laboratory', RECORDED: 'Recorded by a person or system at the time',
      CALCULATED: 'Produced by the calculation engine', OBSERVED: 'Observed by satellite or sensor',
      MODELLED: 'A model estimate, never a measurement', DERIVED: 'Worked out from other data',
    } as Record<string, string>)[dc] ?? '';
  }

  select(n: PNode) { this.selected.set(n); }
  toggle(n: PNode) {
    if (this.filtering() && this.isAutoOpen(n)) {
      const c = new Set(this.closedInFilter());
      c.has(n.key) ? c.delete(n.key) : c.add(n.key);
      this.closedInFilter.set(c);
      return;
    }
    const s = new Set(this.expanded());
    s.has(n.key) ? s.delete(n.key) : s.add(n.key);
    this.expanded.set(s);
  }
  expandAll() { this.expanded.set(new Set(this.all().map(x => x.key))); }
  collapseAll() { this.expanded.set(new Set([this.root().key])); }
  clearFilters() { this.q.set(''); this.kind.set(null); this.closedInFilter.set(new Set()); }

  /** True when the node is an ancestor of a match (so the filter opens it). */
  private isAutoOpen(n: PNode): boolean {
    const m = this.matches();
    const hit = (x: PNode): boolean => x.children.some(c => m.has(c.key) || hit(c));
    return hit(n);
  }

  /** Clear filters, open every ancestor and scroll the node into view. */
  reveal(n: PNode) {
    this.clearFilters();
    const s = new Set(this.expanded());
    for (let p = n.parent; p; p = p.parent) s.add(p.key);
    this.expanded.set(s);
    this.selected.set(n);
    this.scrollTo(n.key);
  }

  private scrollTo(key: string) {
    setTimeout(() => {
      const el = this.treeEl()?.nativeElement.querySelector(`[data-key="${CSS.escape(key)}"]`);
      el?.scrollIntoView({ block: 'nearest' });
    });
  }

  key(e: KeyboardEvent) {
    const rows = this.rows();
    if (!rows.length) return;
    const i = Math.max(0, rows.findIndex(r => r.node.key === this.selected()?.key));
    const cur = rows[i];
    let next: PNode | null = null;
    switch (e.key) {
      case 'ArrowDown': next = rows[Math.min(rows.length - 1, i + 1)].node; break;
      case 'ArrowUp': next = rows[Math.max(0, i - 1)].node; break;
      case 'ArrowRight':
        if (cur.hasKids && !cur.open) this.toggle(cur.node);
        else if (cur.open) next = rows[i + 1]?.node ?? null;
        break;
      case 'ArrowLeft':
        if (cur.open && cur.hasKids) this.toggle(cur.node);
        else next = cur.node.parent ?? null;
        break;
      case 'Enter': case ' ': if (cur.hasKids) this.toggle(cur.node); break;
      case 'Home': next = rows[0].node; break;
      case 'End': next = rows[rows.length - 1].node; break;
      default: return;
    }
    e.preventDefault();
    if (next) { this.selected.set(next); this.scrollTo(next.key); }
  }
}

function split(label: string, q: string): [string, string, string] {
  if (!q) return [label, '', ''];
  const i = label.toLowerCase().indexOf(q);
  if (i < 0) return [label, '', ''];
  return [label.slice(0, i), label.slice(i, i + q.length), label.slice(i + q.length)];
}
