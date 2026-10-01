import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, map, of } from 'rxjs';
import { ApiError, ApiService, Page } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { AgoPipe, DayPipe, NumPipe } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { KIT } from '../../ui/kit';
import { FieldLite, Remote, isoDate } from '../supporting/shared';
import { CatalogueItem, FeatureSet, FeatureSetItem, FieldFeatures, Materialized } from './types';

interface UserLite { id: string; full_name: string }
interface Pick { on: boolean; window: number | null; wet: number | null }

const GROUP_LABEL: Record<string, string> = {
  sensor: 'Soil sensors', weather: 'Weather', satellite: 'Satellite', terrain: 'Terrain', site: 'Site record',
  soil: 'Soil map', management: 'Management',
};
const GROUP_ORDER = ['sensor', 'weather', 'satellite', 'terrain', 'site', 'soil', 'management'];
const DEFAULT_WINDOW: Record<string, number> = { sensor: 90, weather: 365, satellite: 365, management: 365 };

@Component({
  selector: 'vc-feature-sets-tab',
  imports: [...KIT, FormsModule, NumPipe, DayPipe, AgoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card">
      <div class="card-head">
        <div class="ct">
          <h3>Feature sets</h3>
          <span class="small muted">Versioned recipes of model inputs. Each value is computed only from data observed on or before its as-of date, so training never sees the future.</span>
        </div>
        @if (canManage()) { <button class="btn btn-primary btn-sm" (click)="openCreate()"><vc-icon name="plus" [size]="14" />New feature set</button> }
      </div>
      @if (sets.loading()) {
        <vc-loading [rows]="4" />
      } @else if (sets.error()) {
        <div class="card-body"><vc-error title="Couldn't load feature sets" [message]="sets.error()!.message" /></div>
      } @else if (!sets.data()?.length) {
        <vc-empty icon="blocks" title="No feature sets yet"
          text="Pick features from the catalogue — soil moisture, weather, satellite, terrain — with the window each one covers. Models can then be trained on a fixed, reproducible set.">
          @if (canManage()) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="plus" />New feature set</button> }
        </vc-empty>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Feature set</th><th>Status</th><th>Features</th><th>Definition</th><th>Created</th><th></th></tr></thead>
            <tbody>
              @for (f of sets.data(); track f.id) {
                <tr [class.sel]="f.id === viewSet()">
                  <td><div class="mn"><strong>{{ f.name }}</strong><span class="small subtle">Version {{ f.version }}@if (f.description) { · {{ f.description }} }</span></div></td>
                  <td><vc-badge [status]="f.status" /></td>
                  <td>
                    <div class="cols">
                      @for (c of f.columns.slice(0, 4); track c) { <code>{{ c }}</code> }
                      @if (f.columns.length > 4) { <span class="small subtle">+{{ f.columns.length - 4 }} more</span> }
                    </div>
                  </td>
                  <td class="nowrap"><vc-hash [value]="f.definition_sha256" /></td>
                  <td class="small nowrap"><span [title]="f.created_at | day: true">{{ f.created_at | ago }}</span><div class="subtle">{{ name(f.created_by) }}</div></td>
                  <td class="acts">
                    <button class="btn btn-ghost btn-sm" (click)="view(f)"><vc-icon name="eye" [size]="14" />Field values</button>
                    @if (f.status === 'active' && canMaterialize()) {
                      <button class="btn btn-secondary btn-sm" (click)="openMat(f)"><vc-icon name="play" [size]="14" />Materialise</button>
                    }
                    @if (f.status === 'active' && canManage()) {
                      <button class="btn btn-ghost btn-sm btn-icon" title="Retire" aria-label="Retire" (click)="retireTarget.set(f)"><vc-icon name="archive" [size]="15" /></button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <!-- field values viewer -->
    <section class="card">
      <div class="card-head wrap">
        <div class="ct">
          <h3>Field values <vc-dc cls="DERIVED" /></h3>
          <span class="small muted">The latest materialised values for one field, on or before the as-of date.</span>
        </div>
      </div>
      <div class="card-body filters">
        <div class="field"><label for="vs">Feature set</label>
          <select id="vs" class="input" [ngModel]="viewSet()" (ngModelChange)="viewSet.set($event)">
            <option value="" disabled>Choose…</option>
            @for (f of sets.data() ?? []; track f.id) { <option [value]="f.id">{{ f.name }} v{{ f.version }}{{ f.status === 'retired' ? ' (retired)' : '' }}</option> }
          </select></div>
        <div class="field"><label for="vf">Field</label>
          <select id="vf" class="input" [ngModel]="viewField()" (ngModelChange)="viewField.set($event)">
            <option value="" disabled>{{ fields.loading() ? 'Loading fields…' : 'Choose…' }}</option>
            @for (f of fields.data() ?? []; track f.id) { <option [value]="f.id">{{ f.code }} · {{ f.name }}</option> }
          </select></div>
        <div class="field"><label for="va">As of</label>
          <input id="va" type="date" class="input" [max]="today" [ngModel]="viewAsOf()" (ngModelChange)="viewAsOf.set($event)" />
          <span class="hint">Leave empty for the latest.</span></div>
      </div>
      @if (!projectId()) {
        <vc-empty icon="briefcase" title="Choose a project" text="Field values are shown for fields in the current project." />
      } @else if (!viewSet() || !viewField()) {
        <vc-empty icon="list-filter" title="Pick a feature set and a field" text="Values appear once the feature set has been materialised for the field's project." />
      } @else if (ff.loading()) {
        <vc-loading [rows]="5" />
      } @else if (ff.error(); as e) {
        @if (e.status === 404) {
          <vc-empty icon="calendar-clock" title="Nothing materialised yet" [text]="e.message + (canMaterialize() ? ' Use Materialise to compute values as of a date.' : '')" />
        } @else {
          <div class="card-body"><vc-error title="Couldn't load field values" [message]="e.message" /></div>
        }
      } @else if (ff.data(); as v) {
        <div class="pit small">
          <vc-icon name="calendar-check" [size]="14" /><span>As of <strong>{{ v.as_of_date | day }}</strong> · {{ v.point_in_time }}</span>
          <span class="spacer"></span><span class="subtle">Fingerprint</span><vc-hash [value]="v.input_fingerprint" />
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Column</th><th>Feature</th><th>Data class</th><th class="num">Value</th><th>Window</th></tr></thead>
            <tbody>
              @for (r of ffRows(); track r.column) {
                <tr>
                  <td><code>{{ r.column }}</code></td>
                  <td class="small">{{ r.description }}</td>
                  <td>@if (r.cls) { <vc-dc [cls]="r.cls" /> }</td>
                  <td class="num">@if (r.value === null) { <span class="subtle" title="Not enough input data for this window">—</span> } @else { {{ r.value | num: 3 }} }<span class="u">{{ r.unit }}</span></td>
                  <td class="small muted">{{ r.window ? r.window + ' days to ' + (v.as_of_date | day) : 'Static' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <!-- create -->
    <vc-modal [(open)]="createOpen" [drawer]="true" width="600px" title="New feature set"
      subtitle="Choose features from the catalogue. Saving with an existing name creates the next version.">
      <form class="stack" style="--gap:18px" id="fsForm" (ngSubmit)="create()">
        <div class="form-grid">
          <div class="field"><label for="fn">Name</label><input id="fn" name="fn" class="input" [(ngModel)]="cName" placeholder="soc-context" />
            <span class="hint">Letters, numbers, spaces, dots, dashes.</span></div>
          <div class="field"><label for="fd">Description</label><input id="fd" name="fd" class="input" [(ngModel)]="cDesc" placeholder="What it's for" /></div>
        </div>
        @if (cat.loading()) { <vc-loading [rows]="6" /> }
        @else if (cat.error()) { <vc-error title="Couldn't load the catalogue" [message]="cat.error()!.message" /> }
        @else {
          @for (g of groups(); track g.key) {
            <div class="grp">
              <div class="gh">{{ g.label }}</div>
              @for (c of g.items; track c.feature) {
                <div class="feat" [class.on]="picks()[c.feature].on">
                  <label class="fl">
                    <input type="checkbox" [name]="'p_' + c.feature" [ngModel]="picks()[c.feature].on" (ngModelChange)="setPick(c.feature, { on: $event })" />
                    <span><strong>{{ c.description }}</strong><small><code>{{ c.feature }}</code>@if (c.unit) { · {{ c.unit }} }</small></span>
                  </label>
                  <vc-dc [cls]="c.data_class" />
                  @if (picks()[c.feature].on && (c.window_required || c.feature === 'practice_count')) {
                    <div class="win">
                      <input type="number" class="input num" min="1" max="400" [name]="'w_' + c.feature" [attr.aria-label]="'Window for ' + c.feature"
                        [ngModel]="picks()[c.feature].window" (ngModelChange)="setPick(c.feature, { window: $event })" />
                      <span class="small subtle">days</span>
                    </div>
                  }
                  @if (picks()[c.feature].on && c.feature === 'wetness_days') {
                    <div class="win">
                      <input type="number" class="input num" min="1" max="100" step="0.5" name="wet" aria-label="Wetness threshold" placeholder="auto"
                        [ngModel]="picks()[c.feature].wet" (ngModelChange)="setPick(c.feature, { wet: $event })" />
                      <span class="small subtle">% vol</span>
                    </div>
                  }
                </div>
              }
            </div>
          }
        }
        @if (createError()) { <vc-error title="Feature set not saved" [message]="createError()!" /> }
      </form>
      <ng-container footer>
        <span class="small muted" style="margin-right:auto">{{ chosen().length }} feature{{ chosen().length === 1 ? '' : 's' }} chosen</span>
        <button class="btn btn-ghost" type="button" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="fsForm" [disabled]="saving() || !chosen().length || cName.trim().length < 2">{{ saving() ? 'Saving…' : 'Save feature set' }}</button>
      </ng-container>
    </vc-modal>

    <!-- retire -->
    <vc-modal [open]="!!retireTarget()" (closed)="retireTarget.set(null)" title="Retire this feature set?" width="460px">
      <div class="stack" style="--gap:12px">
        <p><strong>{{ retireTarget()?.name }} v{{ retireTarget()?.version }}</strong> will no longer be available for training new models or materialising values.</p>
        <p class="small muted">Models already trained on it keep working, and stored values stay for audit. This can't be undone — create a new version instead.</p>
        @if (retireError()) { <vc-error title="Not retired" [message]="retireError()!" /> }
      </div>
      <ng-container footer>
        <button class="btn btn-ghost" (click)="retireTarget.set(null)">Cancel</button>
        <button class="btn btn-danger" [disabled]="retiring()" (click)="retire()">{{ retiring() ? 'Retiring…' : 'Retire feature set' }}</button>
      </ng-container>
    </vc-modal>

    <!-- materialise -->
    <vc-modal [open]="!!matTarget()" (closed)="closeMat()" title="Materialise feature values"
      [subtitle]="(matTarget()?.name ?? '') + ' v' + (matTarget()?.version ?? '') + ' · every enrolled field in this project'" width="520px">
      <div class="stack" style="--gap:14px">
        @if (!projectId()) {
          <vc-callout tone="warn" icon="briefcase">Choose a project in the top bar first.</vc-callout>
        } @else if (matResult(); as r) {
          <div class="mres">
            <div><span>Fields</span><strong class="num">{{ r.fields }}</strong></div>
            <div><span>New or recomputed</span><strong class="num">{{ r.written }}</strong></div>
            <div><span>Unchanged</span><strong class="num">{{ r.unchanged }}</strong></div>
          </div>
          <p class="small muted">Values as of {{ r.as_of_date | day }}. Fields whose inputs hadn't changed kept their existing values (same fingerprint).</p>
        } @else {
          <div class="field"><label for="ma">As-of date</label>
            <input id="ma" type="date" class="input" [max]="today" [(ngModel)]="matAsOf" />
            <span class="hint">Only data observed on or before this date is used. Future dates aren't allowed.</span></div>
          @if (matError()) { <vc-error title="Not materialised" [message]="matError()!" /> }
        }
      </div>
      <ng-container footer>
        @if (matResult()) {
          <button class="btn btn-primary" (click)="closeMat()">Done</button>
        } @else {
          <button class="btn btn-ghost" (click)="closeMat()">Cancel</button>
          <button class="btn btn-primary" [disabled]="materialising() || !projectId() || !matAsOf" (click)="materialise()">{{ materialising() ? 'Computing…' : 'Materialise' }}</button>
        }
      </ng-container>
    </vc-modal>
  `,
  styles: [`
    :host{display:flex;flex-direction:column;gap:16px}
    .ct{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
    .ct h3{display:flex;align-items:center;gap:8px}
    .card-head.wrap{flex-wrap:wrap}
    .mn{display:flex;flex-direction:column;line-height:1.35}
    .cols{display:flex;flex-wrap:wrap;gap:4px;align-items:center;max-width:360px}
    .cols code{font-size:11.5px;padding:2px 6px;border-radius:4px;background:var(--sand-100);color:var(--stone-700)}
    tr.sel td{background:var(--forest-50)}
    .acts{white-space:nowrap;text-align:right}
    .filters{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;border-bottom:1px solid var(--border)}
    @media (max-width:800px){.filters{grid-template-columns:1fr}}
    .pit{display:flex;align-items:center;gap:8px;padding:10px 20px;border-bottom:1px solid var(--stone-100);color:var(--stone-700);flex-wrap:wrap}
    .u{font-size:11px;color:var(--text-3);margin-left:4px}
    .grp + .grp{margin-top:4px}
    .gh{font-size:11.5px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--text-3);margin:4px 0 6px}
    .feat{display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid var(--border);border-radius:8px;margin-bottom:6px;flex-wrap:wrap}
    .feat.on{border-color:var(--forest-300);background:var(--forest-50)}
    .fl{display:flex;gap:10px;align-items:flex-start;flex:1;min-width:220px;cursor:pointer}
    .fl input{accent-color:var(--primary);width:16px;height:16px;margin-top:2px}
    .fl span{display:flex;flex-direction:column} .fl strong{font-size:13px;font-weight:500} .fl small{font-size:11.5px;color:var(--text-3)}
    .win{display:flex;align-items:center;gap:6px} .win .input{width:84px;height:30px}
    .mres{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
    .mres div{display:flex;flex-direction:column;padding:12px;border:1px solid var(--border);border-radius:8px;background:var(--surface-2)}
    .mres span{font-size:12px;color:var(--text-2)} .mres strong{font-size:22px;font-weight:600}
  `],
})
export class FeatureSetsTab {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  projectId = input<string | null>(null);

  canManage = computed(() => this.auth.can('models.manage'));
  canMaterialize = computed(() => this.auth.can('models.manage') && this.auth.can('data.sync'));
  today = isoDate(new Date());

  sets = new Remote<FeatureSet[]>();
  cat = new Remote<CatalogueItem[]>();
  fields = new Remote<FieldLite[]>();
  ff = new Remote<FieldFeatures>();
  private users = signal<Map<string, UserLite>>(new Map());
  private catMap = computed(() => new Map((this.cat.data() ?? []).map(c => [c.feature, c])));

  viewSet = signal('');
  viewField = signal('');
  viewAsOf = signal('');

  constructor() {
    this.reload();
    this.cat.load(this.api.get<CatalogueItem[]>('/feature-sets/catalogue'));
    this.api.get<UserLite[]>('/users').pipe(catchError(() => of([] as UserLite[])))
      .subscribe(us => this.users.set(new Map(us.map(u => [u.id, u]))));
    effect(() => {
      const pid = this.projectId();
      untracked(() => {
        this.viewField.set('');
        if (pid) this.fields.load(this.api.get<Page<FieldLite>>('/fields', { project_id: pid, limit: 500 }).pipe(map(r => r.items)));
        else this.fields.reset();
      });
    });
    // default the viewer to the first active set and first field
    effect(() => {
      const s = this.sets.data();
      untracked(() => { if (!this.viewSet() && s?.length) this.viewSet.set((s.find(x => x.status === 'active') ?? s[0]).id); });
    });
    effect(() => {
      const f = this.fields.data();
      untracked(() => { if (!this.viewField() && f?.length) this.viewField.set(f[0].id); });
    });
    effect(() => {
      const s = this.viewSet(), f = this.viewField(), a = this.viewAsOf();
      untracked(() => {
        if (!s || !f) { this.ff.reset(); return; }
        this.ff.load(this.api.get<FieldFeatures>(`/fields/${f}/features`, { feature_set: s, as_of: a || null }));
      });
    });
  }

  reload() { this.sets.load(this.api.get<FeatureSet[]>('/feature-sets'), true); }

  name(id: string | null) {
    if (!id) return 'System';
    if (id === this.auth.profile()?.id) return 'You';
    return this.users().get(id)?.full_name ?? 'Another team member';
  }

  ffRows = computed(() => {
    const v = this.ff.data();
    if (!v) return [];
    const set = (this.sets.data() ?? []).find(s => s.id === v.feature_set_id);
    const items: FeatureSetItem[] = set?.definition.features ?? Object.keys(v.values).map(c => ({ feature: c, column: c }));
    return items.map(it => {
      const c = this.catMap().get(it.feature);
      return { column: it.column, description: c?.description ?? it.feature, unit: c?.unit ?? '', window: it.window_days ?? null,
        cls: v.data_classes?.[it.column] ?? c?.data_class ?? '', value: v.values[it.column] ?? null };
    });
  });

  view(f: FeatureSet) {
    this.viewSet.set(f.id);
  }

  /* ---------------- create */
  createOpen = signal(false);
  saving = signal(false);
  createError = signal<string | null>(null);
  cName = 'soc-context';
  cDesc = '';
  picks = signal<Record<string, Pick>>({});
  groups = computed(() => {
    const byG = new Map<string, CatalogueItem[]>();
    for (const c of this.cat.data() ?? []) byG.set(c.group, [...(byG.get(c.group) ?? []), c]);
    return [...byG].sort((a, b) => GROUP_ORDER.indexOf(a[0]) - GROUP_ORDER.indexOf(b[0]))
      .map(([key, items]) => ({ key, label: GROUP_LABEL[key] ?? key, items }));
  });
  chosen = computed(() => Object.entries(this.picks()).filter(([, p]) => p.on).map(([k]) => k));

  openCreate() {
    const p: Record<string, Pick> = {};
    for (const c of this.cat.data() ?? []) p[c.feature] = { on: false, window: c.window_required ? DEFAULT_WINDOW[c.group] ?? 90 : null, wet: null };
    this.picks.set(p);
    this.createError.set(null);
    this.createOpen.set(true);
  }

  setPick(k: string, patch: Partial<Pick>) {
    this.picks.update(p => ({ ...p, [k]: { ...p[k], ...patch } }));
  }

  create() {
    const features = this.chosen().map(k => {
      const p = this.picks()[k];
      const it: Record<string, unknown> = { feature: k };
      if (p.window) it['window_days'] = Math.round(Number(p.window));
      if (k === 'wetness_days' && p.wet) it['wet_threshold_pct'] = Number(p.wet);
      return it;
    });
    this.saving.set(true);
    this.createError.set(null);
    this.api.post<FeatureSet>('/feature-sets', { name: this.cName.trim(), description: this.cDesc.trim(), definition: { features } }).subscribe({
      next: fs => {
        this.saving.set(false);
        this.createOpen.set(false);
        this.toast.success(`${fs.name} v${fs.version} saved`, `${fs.columns.length} features. Materialise it to compute field values.`);
        this.reload();
        this.viewSet.set(fs.id);
      },
      error: (e: ApiError) => {
        this.saving.set(false);
        const errs = (e.details?.['errors'] as string[] | undefined) ?? [];
        this.createError.set(errs.length ? `${e.message.split(':')[0]}: ${errs.join('; ')}.` : e.message);
      },
    });
  }

  /* ---------------- retire */
  retireTarget = signal<FeatureSet | null>(null);
  retiring = signal(false);
  retireError = signal<string | null>(null);
  retire() {
    const f = this.retireTarget();
    if (!f) return;
    this.retiring.set(true);
    this.retireError.set(null);
    this.api.post<FeatureSet>(`/feature-sets/${f.id}/retire`).subscribe({
      next: r => { this.retiring.set(false); this.retireTarget.set(null); this.toast.success('Feature set retired', `${r.name} v${r.version}`); this.reload(); },
      error: (e: ApiError) => { this.retiring.set(false); this.retireError.set(e.message); },
    });
  }

  /* ---------------- materialise */
  matTarget = signal<FeatureSet | null>(null);
  matAsOf = isoDate(new Date());
  materialising = signal(false);
  matError = signal<string | null>(null);
  matResult = signal<Materialized | null>(null);
  openMat(f: FeatureSet) { this.matResult.set(null); this.matError.set(null); this.matTarget.set(f); }
  closeMat() { this.matTarget.set(null); this.matResult.set(null); }
  materialise() {
    const f = this.matTarget(), pid = this.projectId();
    if (!f || !pid) return;
    this.materialising.set(true);
    this.matError.set(null);
    this.api.post<Materialized>(`/feature-sets/${f.id}/materialize`, { project_id: pid, as_of_date: this.matAsOf }).subscribe({
      next: r => {
        this.materialising.set(false);
        this.matResult.set(r);
        if (this.viewSet() !== f.id) this.viewSet.set(f.id); // the viewer effect reloads
        else if (this.viewField()) {
          this.ff.load(this.api.get<FieldFeatures>(`/fields/${this.viewField()}/features`, { feature_set: f.id, as_of: this.viewAsOf() || null }));
        }
      },
      error: (e: ApiError) => { this.materialising.set(false); this.matError.set(e.message); },
    });
  }
}
