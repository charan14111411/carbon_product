import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiError, ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { Icon } from '../../ui/icon';
import { Badge, Callout, FileDrop, Hash } from '../../ui/kit';
import { LabContext } from './lab-context';
import { CSV_TEMPLATE, ImportReport, analyteLabel } from './types';

/** Bulk upload of results from the lab's own system, with a row-by-row report. */
@Component({
  selector: 'vc-lab-import',
  imports: [FormsModule, Icon, Badge, Callout, FileDrop, Hash],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrap">
      <section class="card">
        <div class="card-head"><h3>Upload a results file</h3></div>
        <div class="card-body stack" style="--gap:16px">
          <p class="muted">Each row is checked on its own: good rows are saved as pending results, rows with a problem are listed with the reason and nothing is saved for them. The file itself is kept as evidence.</p>
          @if (!ctx.scopedLabId()) {
            <div class="field">
              <label for="i-lab">Lab that produced these results</label>
              <select id="i-lab" class="input" [(ngModel)]="labId">
                <option value="">The lab each bag was sent to</option>
                @for (l of ctx.labs(); track l.id) { <option [value]="l.id">{{ l.name }}</option> }
              </select>
            </div>
          }
          <vc-file-drop accept=".csv,text/csv" [(file)]="file" label="Choose a CSV file or drop it here" hint="UTF-8 CSV with the columns shown · up to 25 MB" />
          <div class="row">
            <button class="btn btn-primary" [disabled]="!file() || busy()" (click)="upload()"><vc-icon name="upload" />{{ busy() ? 'Importing…' : 'Import results' }}</button>
            @if (file()) { <button class="btn btn-ghost" (click)="file.set(null)">Clear</button> }
          </div>
          @if (err()) { <vc-callout tone="danger" icon="alert">{{ err() }}</vc-callout> }
        </div>
      </section>

      <section class="card">
        <div class="card-head">
          <h3>File format</h3>
          <button class="btn btn-secondary btn-sm" (click)="download()"><vc-icon name="download" [size]="14" />Download template</button>
        </div>
        <div class="card-body stack" style="--gap:12px">
          <pre class="tpl">{{ template }}</pre>
          <dl class="kv small">
            <dt><code>bag_code</code></dt><dd>The code or label printed on the bag.</dd>
            <dt><code>analyte</code></dt><dd><code>soc_pct</code>, <code>bulk_density_g_cm3</code>, <code>coarse_fraction</code>, <code>fine_soil_mass_g</code>, <code>ph</code>, <code>texture_clay_pct</code>, <code>texture_sand_pct</code> or <code>inorganic_c_pct</code>.</dd>
            <dt><code>unit</code></dt><dd><code>%</code>, <code>g/cm3</code>, <code>fraction</code>, <code>g</code> or <code>pH</code>, matching the analyte.</dd>
            <dt><code>analysed_on</code></dt><dd>Date as YYYY-MM-DD. Not before collection, not in the future.</dd>
            <dt><code>uncertainty</code></dt><dd>Optional, same unit as the value.</dd>
            <dt><code>detection_limit</code></dt><dd>Optional. The lab's limit of detection, same unit; lower values are flagged as below detection.</dd>
            <dt><code>method_justification</code></dt><dd>Required for <code>walkley_black</code> or <code>loss_on_ignition</code> (at least 20 characters). Not recommended by VM0042 §8.2.1.4; only where no other method is available.</dd>
            <dt><code>purpose</code></dt><dd><code>primary</code> (default) or <code>spectroscopy_check</code> for a dry-combustion SOC re-run of a spectroscopy bag.</dd>
          </dl>
        </div>
      </section>
    </div>

    @if (report(); as rep) {
      <section class="card" style="margin-top:16px">
        <div class="card-head">
          <h3>Import report</h3>
          <vc-badge status="accepted">{{ rep.created }} created</vc-badge>
          @if (rep.errors) { <vc-badge status="rejected">{{ rep.errors }} with problems</vc-badge> }
          <vc-hash [value]="rep.sha256" />
        </div>
        <div class="card-head sub">
          <div class="seg">
            <button [class.on]="show() === 'all'" (click)="show.set('all')">All rows</button>
            <button [class.on]="show() === 'error'" (click)="show.set('error')">Problems only</button>
          </div>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th class="num">Row</th><th>Bag</th><th>Analyte</th><th>Outcome</th><th>Message</th></tr></thead>
            <tbody>
              @for (r of rows(); track r.row) {
                <tr [class.bad]="r.status === 'error'">
                  <td class="num">{{ r.row }}</td>
                  <td><code>{{ r.bag_code || '—' }}</code></td>
                  <td>{{ label(r.analyte) }}</td>
                  <td><vc-badge [status]="r.status === 'created' ? 'accepted' : 'error'">{{ r.status === 'created' ? 'Created' : 'Not saved' }}</vc-badge></td>
                  <td [class.muted]="r.status === 'created'">{{ r.message }} @if (r.code) { <code class="subtle small">{{ r.code }}</code> }</td>
                </tr>
              } @empty {
                <tr><td colspan="5" class="muted">No rows with problems.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    }
  `,
  styles: [`
    .wrap{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:start}
    .tpl{margin:0;padding:12px 14px;background:var(--forest-950);color:#d7e6dc;border-radius:var(--radius-sm);font:12px/1.6 var(--mono);overflow-x:auto}
    .kv.small{font-size:12.5px;grid-template-columns:120px 1fr}
    .sub{padding:10px 20px;background:var(--surface-2)}
    .seg{display:flex;background:var(--surface);border:1px solid var(--border-strong);border-radius:var(--radius-sm);padding:3px;gap:2px}
    .seg button{border:0;background:none;font:500 12.5px var(--font);color:var(--stone-600);padding:0 10px;height:26px;border-radius:5px;cursor:pointer}
    .seg button.on{background:var(--forest-600);color:#fff}
    tr.bad td{background:var(--danger-soft)}
    @media (max-width:1100px){.wrap{grid-template-columns:1fr}}
  `],
})
export class LabImport {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  ctx = inject(LabContext);
  template = CSV_TEMPLATE;
  file = signal<File | null>(null);
  busy = signal(false);
  err = signal<string | null>(null);
  report = signal<ImportReport | null>(null);
  show = signal<'all' | 'error'>('all');
  labId = '';

  rows = computed(() => (this.report()?.rows ?? []).filter(r => this.show() === 'all' || r.status === 'error'));

  label(a: string | null) { return a ? analyteLabel(a) : '—'; }

  download() {
    const u = URL.createObjectURL(new Blob([CSV_TEMPLATE + '\n'], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = u;
    a.download = 'lab-results-template.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 5000);
  }

  upload() {
    const f = this.file();
    if (!f) return;
    const form = new FormData();
    form.append('file', new File([f], f.name, { type: 'text/csv' }));
    if (this.labId) form.append('lab_id', this.labId);
    this.busy.set(true);
    this.err.set(null);
    this.api.upload<ImportReport>('/lab-results/import', form).subscribe({
      next: r => {
        this.busy.set(false);
        this.report.set(r);
        this.show.set(r.errors ? 'error' : 'all');
        this.file.set(null);
        r.errors ? this.toast.info(`${r.created} created, ${r.errors} rows need attention`) : this.toast.success(`${r.created} results imported`);
      },
      error: (e: ApiError) => {
        this.busy.set(false);
        const missing = (e.details?.['missing'] as string[] | undefined)?.join(', ');
        this.err.set(missing ? `${e.message} Missing: ${missing}.` : e.message);
      },
    });
  }
}
