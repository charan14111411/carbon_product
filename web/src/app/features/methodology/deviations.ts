import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Icon } from '../../ui/icon';

/**
 * Read-only register of where the platform does not apply a VM0042 v2.2 equation literally.
 * KEEP IN SYNC with docs/METHODOLOGY_DEVIATIONS.md (same ids, wording and effect).
 */
interface Deviation { id: string; ref: string; literal: string; does: string; why: string; effect: string; kind: 'conservative' | 'interpretation' | 'stricter' | 'review' | 'literal' | 'neutral' }

const DEVIATIONS: Deviation[] = [
  { id: 'D1', ref: 'Eq. 75–77 (p.84–85)', literal: 'Bu_ER and Bu_CR have no floor; VCU_ER = ER_NET − Bu_ER',
    does: 'The buffer is floored at 0. The raw Eq. 75/76 values are still reported (buffer_*_eq75/76)', why: 'A negative buffer would add credits in a loss year', effect: 'Conservative', kind: 'conservative' },
  { id: 'D2', ref: 'Eq. 39/42 (p.56–57)', literal: 'LK_ER = LK × ER/(ER+CR) and LK_CR = LK × CR/(ER+CR)',
    does: 'When ER or CR is negative, or ER+CR ≤ 0, leakage is split using the positive parts. When both are positive the split is literal', why: 'The literal shares are undefined or negative in these cases', effect: 'Total unchanged; only the ER/CR labels differ', kind: 'neutral' },
  { id: 'D3', ref: 'Eq. 39/42', literal: 'Only LE_OA + LE_BR enter the allocation',
    does: 'LK_disp (VMD0054 Eq. 36) and any approved "other leakage" are also deducted through Eq. 39/42', why: '§8.4.2–8.4.3 require displacement and production leakage to be accounted for, but no equation routes them', effect: 'Conservative', kind: 'conservative' },
  { id: 'D4', ref: 'Eq. 37 (p.54)', literal: 'ΔCH4_soil × (1 − UNC) and ΔN2O_soil × (1 − UNC)',
    does: '(1 + UNC) is used when the reduction is negative', why: 'Mirrors the I_soil logic of Eq. 44/45, so uncertainty never shrinks a loss', effect: 'Conservative', kind: 'conservative' },
  { id: 'D5', ref: 'Eq. 74 (p.82)', literal: 't at 66.7 % "≈ 0.4307"',
    does: 't(0.667, df) is computed exactly (0.4316 at large df)', why: '0.4307 is t(2/3); the rule value 0.667 is what the PDF states', effect: 'About 0.2 % larger deduction (conservative)', kind: 'conservative' },
  { id: 'D6', ref: '§8.2.1.2 (p.30)', literal: '3–5 composites per stratum "should"',
    does: 'The run blocks below the rule-pack floor (default 3)', why: 'Platform policy; the floor is a rule value the methodology owner can raise', effect: 'Stricter', kind: 'stricter' },
  { id: 'D7', ref: '§6 (p.14) rotation', literal: 'At least one complete crop rotation',
    does: 'Auto-detection needs the cycle to be seen restarting (p + 1 years). A rotation length stated on an attested crop record is accepted with p years', why: 'Without a stated length, a third crop could follow', effect: 'Stricter unless the length is attested', kind: 'stricter' },
  { id: 'D8', ref: '§8.6.3 (p.81)', literal: "Use the low/high end of each factor's uncertainty range",
    does: 'When the rule pack gives only a central value, it is used and flagged (range_missing, plus a warning in the result)', why: 'Some IPCC defaults publish no range', effect: 'Visible to the verifier', kind: 'interpretation' },
  { id: 'D9', ref: '§8.4.3 / VMD0054', literal: 'VMD0054 Eq. 6 and 8–10 (not reproduced in VM0042)',
    does: "INL and the per-hectare emission factor are entered from the proponent's VMD0054 worksheet, with evidence. LK_t = Σ AL_y × EF_y", why: 'VM0042 does not give these equations', effect: 'Needs expert review against the VMD0054 version in force', kind: 'review' },
  { id: 'D10', ref: 'Eq. 48–51 / AR-TOOL14', literal: 'Tree and shrub carbon by the CDM A/R tools',
    does: 'Per-tree allometry from an approved model, root:shoot and carbon fraction from the rule pack. Plot pairs give a stratum mean with sampling variance', why: "The tool's own uncertainty discount is not applied in the engine; the variance is published with the term", effect: 'Review against AR-TOOL14', kind: 'review' },
  { id: 'D11', ref: 'Eq. 33 (p.52)', literal: 'Amendments "new or additional" compared with the look-back period',
    does: 'Compared with the schedule year mapped to each project year', why: 'Gives the same or a larger leakage', effect: 'Conservative', kind: 'conservative' },
  { id: 'D12', ref: 'Box 1 tier 4 (p.16)', literal: 'Census within 20 years or the 10 most recent iterations, whichever is more recent',
    does: "Needs the dataset's release interval; the window starts at max(start − 20, start − 10 × interval)", why: '—', effect: 'Literal', kind: 'literal' },
];

const KIND_LABEL: Record<Deviation['kind'], string> = {
  conservative: 'Conservative', interpretation: 'Interpretation', stricter: 'Stricter', review: 'Needs review', literal: 'Literal', neutral: 'Neutral',
};

@Component({
  selector: 'vc-deviations',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="intro card">
      <span class="ic"><vc-icon name="book-check" [size]="18" /></span>
      <div>
        <h3>Methodology interpretations and deviations · VM0042 v2.2</h3>
        <p>Every place where the platform does not apply a VM0042 v2.2 equation literally. Each entry is either <strong>conservative</strong> (it never increases credits)
          or an <strong>interpretation</strong> of a gap in the text. Declare these in the monitoring report and give them to the verifier with the verification package.</p>
        <p class="subtle small">Most entries come from the 1 October 2026 audit against the PDF. QA1 (VMD0053 models) and Appendix 6 keep their own notes alongside the engine.</p>
      </div>
    </div>

    <div class="filters">
      <button type="button" [class.on]="kind() === ''" (click)="kind.set('')">All <span class="c">{{ all.length }}</span></button>
      @for (k of kinds(); track k.key) { <button type="button" [class.on]="kind() === k.key" (click)="kind.set(k.key)">{{ k.label }} <span class="c">{{ k.n }}</span></button> }
    </div>

    <div class="list">
      @for (d of shown(); track d.id) {
        <article class="card dv">
          <header>
            <span class="id">{{ d.id }}</span>
            <span class="ref">VM0042 {{ d.ref }}</span>
            <span class="spacer"></span>
            <span class="k" [class]="'k k-' + d.kind">{{ kindLabel[d.kind] }}</span>
          </header>
          <div class="grid3">
            <div><div class="lbl">Literal text</div><p class="lit">{{ d.literal }}</p></div>
            <div><div class="lbl">What the platform does</div><p>{{ d.does }}</p></div>
            <div><div class="lbl">Why</div><p>{{ d.why }}</p></div>
          </div>
          <footer><span class="lbl">Effect</span><span>{{ d.effect }}</span></footer>
        </article>
      }
    </div>
    <p class="src small subtle">Source: docs/METHODOLOGY_DEVIATIONS.md · read-only.</p>
  `,
  styles: [`
    .intro{display:flex;gap:14px;padding:18px 20px;margin-bottom:16px}
    .intro .ic{display:grid;place-items:center;flex:none;width:38px;height:38px;border-radius:10px;background:var(--forest-50);color:var(--forest-600)}
    .intro p{margin-top:6px;color:var(--stone-700);max-width:900px}
    .filters{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
    .filters button{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:999px;border:1px solid var(--border);background:var(--surface);font:500 12.5px var(--font);color:var(--stone-700);cursor:pointer}
    .filters button.on{background:var(--forest-600);border-color:var(--forest-600);color:#fff}
    .filters .c{font-size:11px;opacity:.75}
    .list{display:flex;flex-direction:column;gap:12px}
    .dv header{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--border)}
    .id{display:grid;place-items:center;min-width:34px;height:24px;padding:0 6px;border-radius:6px;background:var(--stone-900);color:#fff;font:600 12px var(--mono)}
    .ref{font:500 12px var(--mono);color:var(--stone-700)}
    .k{font-size:11.5px;font-weight:600;padding:2px 9px;border-radius:999px;border:1px solid transparent}
    .k-conservative{background:var(--ok-soft);color:var(--forest-700);border-color:#cfe2d4}
    .k-stricter{background:var(--info-soft);color:var(--sky-600);border-color:#c9dcf0}
    .k-interpretation{background:var(--violet-100);color:var(--violet-600)}
    .k-review{background:var(--warn-soft);color:var(--amber-600);border-color:#f1dcae}
    .k-literal,.k-neutral{background:var(--stone-100);color:var(--stone-600);border-color:var(--stone-200)}
    .grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0}
    .grid3 > div{padding:14px 18px;border-right:1px solid var(--stone-100)} .grid3 > div:last-child{border-right:0}
    .grid3 p{font-size:13px;color:var(--stone-800)}
    .lit{font-family:var(--mono);font-size:12px!important;color:var(--stone-600)!important}
    .lbl{font-size:11px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--text-3);margin-bottom:5px}
    .dv footer{display:flex;align-items:baseline;gap:10px;padding:10px 18px;border-top:1px solid var(--border);background:var(--surface-2);border-radius:0 0 var(--radius) var(--radius);font-size:13px;font-weight:500}
    .dv footer .lbl{margin:0}
    .src{margin-top:14px}
    @media (max-width: 900px){ .grid3{grid-template-columns:minmax(0,1fr)} .grid3 > div{border-right:0;border-bottom:1px solid var(--stone-100)} }
  `],
})
export class Deviations {
  all = DEVIATIONS;
  kindLabel = KIND_LABEL;
  kind = signal<string>('');
  kinds = computed(() => {
    const m = new Map<string, number>();
    for (const d of this.all) m.set(d.kind, (m.get(d.kind) ?? 0) + 1);
    return [...m.entries()].map(([key, n]) => ({ key, n, label: KIND_LABEL[key as Deviation['kind']] }));
  });
  shown = computed(() => this.all.filter(d => !this.kind() || d.kind === this.kind()));
}
