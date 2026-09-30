import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DayPipe, NumPipe } from '../../core/format';
import { KIT } from '../../ui/kit';
import { TYPE_LABEL } from '../credits/credit-ui';

export interface SaleReport {
  report: string;
  sale: { code: string; status: string; credit_type: string; quantity_t_co2e: number; contract_ref: string | null; trade_date: string | null;
    retirement_beneficiary: string | null; retired_at: string | null };
  project: { code: string; name: string; methodology: string };
  batch: { code: string; vintage: number; status: string; reductions_t_co2e: number; removals_t_co2e: number; registry: string | null;
    registry_project_ref: string | null; serial_start: string | null; serial_end: string | null };
  calculation: { period_start: string; period_end: string; net_t_co2e: number; engine_version: string; snapshot_sha256: string };
  verification_package: { version: number; sha256: string } | null;
  footprint: { fields: number; area_ha: number; basis: string };
  data_class: string;
  privacy: string;
}

/** Buyer-ready supply-chain summary of one sale. Aggregated data only — never farmer personal data. */
@Component({
  selector: 'vcx-sale-report',
  imports: [...KIT, NumPipe, DayPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let r = report();
    <article class="rep">
      <header class="rh">
        <div>
          <div class="eyebrow">{{ r.report }}</div>
          <h2>{{ r.sale.quantity_t_co2e | num: 3 }} tCO₂e of soil-carbon {{ typeLabel[r.sale.credit_type]?.toLowerCase() }}</h2>
          <p>{{ r.project.name }} · vintage {{ r.batch.vintage }}</p>
        </div>
        <div class="seal">
          <vc-badge [status]="r.sale.status" />
          <vc-dc [cls]="r.data_class" />
        </div>
      </header>

      <div class="band">
        <div><span>Sale</span><strong class="mono">{{ r.sale.code }}</strong></div>
        <div><span>Contract</span><strong class="mono">{{ r.sale.contract_ref || '—' }}</strong></div>
        <div><span>Trade date</span><strong>{{ r.sale.trade_date | day }}</strong></div>
        <div><span>Retired for</span><strong>{{ r.sale.retirement_beneficiary || 'Not retired yet' }}</strong></div>
      </div>

      <div class="cols">
        <section>
          <h4><vc-icon name="landmark" [size]="15" />Registry</h4>
          <dl class="kv">
            <dt>Registry</dt><dd>{{ r.batch.registry || 'Pending issuance' }}</dd>
            <dt>Project reference</dt><dd class="mono small">{{ r.batch.registry_project_ref || '—' }}</dd>
            <dt>Batch</dt><dd class="mono small">{{ r.batch.code }}</dd>
            <dt>Serials</dt><dd class="mono small">@if (r.batch.serial_start) { {{ r.batch.serial_start }}<br />to {{ r.batch.serial_end }} } @else { — }</dd>
            @if (r.sale.retired_at) { <dt>Retired on</dt><dd>{{ r.sale.retired_at | day }}</dd> }
          </dl>
        </section>
        <section>
          <h4><vc-icon name="sprout" [size]="15" />Origin</h4>
          <dl class="kv">
            <dt>Project</dt><dd>{{ r.project.code }} · {{ r.project.name }}</dd>
            <dt>Methodology</dt><dd>{{ r.project.methodology }}</dd>
            <dt>Farmland</dt><dd class="num">{{ r.footprint.area_ha | num: 1 }} ha across {{ r.footprint.fields }} fields</dd>
            <dt>Monitoring period</dt><dd>{{ r.calculation.period_start | day }} – {{ r.calculation.period_end | day }}</dd>
            <dt>Batch composition</dt><dd class="num">{{ r.batch.removals_t_co2e | num: 1 }} t removals · {{ r.batch.reductions_t_co2e | num: 1 }} t reductions</dd>
          </dl>
        </section>
        <section>
          <h4><vc-icon name="fingerprint" [size]="15" />Evidence trail</h4>
          <dl class="kv">
            <dt>Net result</dt><dd class="num">{{ r.calculation.net_t_co2e | num: 2 }} tCO₂e</dd>
            <dt>Engine</dt><dd class="mono small">{{ r.calculation.engine_version }}</dd>
            <dt>Input snapshot</dt><dd><vc-hash [value]="r.calculation.snapshot_sha256" /></dd>
            <dt>Verification package</dt>
            <dd>@if (r.verification_package; as p) { <span class="small">Version {{ p.version }}</span><br /><vc-hash [value]="p.sha256" /> } @else { <span class="subtle">Not yet issued</span> }</dd>
          </dl>
        </section>
      </div>

      <footer class="rf">
        <vc-icon name="shield" [size]="14" />
        <span>{{ r.privacy }} Footprint basis: {{ r.footprint.basis }}.</span>
      </footer>
    </article>
  `,
  styles: [`
    :host{display:block;container-type:inline-size}
    .rep{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow);overflow:hidden}
    .rh{display:flex;justify-content:space-between;gap:16px;padding:24px 26px 20px;background:linear-gradient(135deg,var(--forest-900),var(--forest-700));color:#fff}
    .eyebrow{font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--forest-300);font-weight:600}
    .rh h2{color:#fff;font-size:22px;margin-top:6px;letter-spacing:-.015em}
    .rh p{margin-top:4px;color:rgba(255,255,255,.72)}
    .seal{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
    .band{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-bottom:1px solid var(--border);background:var(--surface-2)}
    .band div{padding:14px 20px;display:flex;flex-direction:column;gap:2px;border-right:1px solid var(--border);min-width:0}
    .band div:last-child{border-right:0}
    .band span{font-size:12px;color:var(--text-2)} .band strong{font-weight:600;overflow-wrap:anywhere}
    .cols{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}
    .cols section{padding:18px 20px;border-right:1px solid var(--border)} .cols section:last-child{border-right:0}
    h4{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;margin:0 0 12px;color:var(--forest-700)}
    .kv{grid-template-columns:minmax(100px,40%) 1fr;font-size:13px}
    .rf{display:flex;align-items:center;gap:8px;padding:12px 20px;border-top:1px solid var(--border);font-size:12.5px;color:var(--text-2);background:var(--surface-2)}
    @container (max-width: 860px){ .cols{grid-template-columns:1fr 1fr} .cols section:nth-child(2){border-right:0} .cols section:last-child{grid-column:1/-1;border-top:1px solid var(--border)} }
    @container (max-width: 560px){ .cols{grid-template-columns:1fr} .cols section{border-right:0;border-bottom:1px solid var(--border)} .band{grid-template-columns:1fr 1fr} }
    @media (max-width:600px){ .rh{flex-direction:column} .seal{align-items:flex-start;flex-direction:row} .band{grid-template-columns:1fr 1fr} .band div:nth-child(2n){border-right:0} }
    @media print{ .rep{box-shadow:none;border-color:#ccc} .rh{-webkit-print-color-adjust:exact;print-color-adjust:exact} .cols{grid-template-columns:repeat(3,1fr)} }
  `],
})
export class SaleReportCard {
  report = input.required<SaleReport>();
  typeLabel = TYPE_LABEL;
}
