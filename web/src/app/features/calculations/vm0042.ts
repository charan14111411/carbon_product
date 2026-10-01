/**
 * Plain-English companions to the VM0042 v2.2 equation numbers the engine reports.
 * Shared by the run detail, the verification package and the verifier workspace.
 */

/** A short, jargon-free line per equation number (matched on the leading "Eq. N" of the trail row). */
const EQ_TEXT: Record<string, string> = {
  '3': 'Soil mass of a core from its dry weight, probe size and number of cores, times its organic-carbon content.',
  '6': 'Fossil-fuel CO₂ per hectare: fuel burnt on the unit, divided by its area.',
  '7': 'Litres of each fuel times that fuel’s CO₂ emission factor.',
  '8': 'Liming CO₂ per hectare.',
  '9': 'Limestone × 0.12 plus dolomite × 0.13 tonnes of carbon, converted to CO₂ (× 44/12).',
  '10': 'Soil methane from a validated model (only where soils are flooded).',
  '11': 'Methane from livestock digestion: head count × emission factor.',
  '12': 'Methane from manure: animals × volatile solids × management share × factor.',
  '13': 'Volatile solids excreted per animal per year.',
  '14': 'Methane from burning crop residues: mass burnt × combustion factor × emission factor.',
  '15': 'Soil N₂O from a validated model (QA1).',
  '16': 'Soil N₂O as the sum of fertiliser, manure and nitrogen-fixing sources.',
  '17': 'Fertiliser N₂O: direct plus indirect emissions.',
  '18': 'Direct N₂O from synthetic and organic nitrogen applied.',
  '19': 'Nitrogen in synthetic fertilisers: mass × nitrogen content.',
  '20': 'Nitrogen in organic fertilisers: mass × nitrogen content.',
  '21': 'Indirect N₂O: volatilised plus leached nitrogen.',
  '22': 'N₂O from nitrogen that evaporates as gas and lands elsewhere.',
  '23': 'N₂O from nitrogen washed out of the soil by water.',
  '24': 'N₂O from nitrogen-fixing plants returned to the soil.',
  '25': 'Nitrogen in the nitrogen-fixing biomass.',
  '26': 'Manure deposited by grazing animals: direct and indirect N₂O.',
  '32': 'N₂O from burning crop residues.',
  '33': 'Leakage from new manure or compost brought in from outside: carbon imported × 0.12 retained, as CO₂.',
  '37': 'Emission reductions: the fall in emissions (ΣΔE) plus any soil-carbon losses avoided compared with the baseline.',
  '38': 'Reductions after their share of leakage.',
  '39': 'The part of total leakage charged to reductions, in proportion to reductions vs removals.',
  '40': 'Carbon removals: extra carbon stored in the soil beyond the baseline, once the project has stored carbon overall.',
  '41': 'Removals after their share of leakage.',
  '42': 'The part of total leakage charged to removals.',
  '43': 'Net reductions plus net removals.',
  '44': 'Baseline stock change after the uncertainty multiplier, plus any tree or shrub change.',
  '45': 'Project stock change after the uncertainty multiplier, plus any tree or shrub change.',
  '46': 'Baseline soil-carbon change per year, measured at the control sites, times area.',
  '47': 'Project soil-carbon change per year: change in each zone divided by the years between measurements, times area.',
  '52': 'Fossil-fuel reduction: baseline minus project, per unit area, times area.',
  '70': 'Variance of the mean change: project and control variances added, weighted by zone area.',
  '71': 'Variance of a zone’s change from paired points: start variance + end variance − 2 × their covariance.',
  '74': 'Uncertainty as a share of the result: standard error ÷ mean × one-sided t at 66.7 %.',
  '75': 'Buffer on reductions — only on the soil-carbon part, never on non-CO₂, fuel or liming.',
  '76': 'Buffer on removals, at the non-permanence risk rating.',
  '77': 'Reduction credits: net reductions minus their buffer.',
  '78': 'Removal credits: net removals minus their buffer.',
  '79': 'Total credits: reduction credits plus removal credits.',
};

/** VM0042 v2.2 Appendix 6 (multi-stage sampling), pp. 159–165. */
const A6_TEXT: Record<string, string> = {
  '1': 'QA1: sampling variance summed over the selected landowners (Eq. A6.1).',
  '2': 'QA1: variance of the mean change, sampling plus model error, per hectare (Eq. A6.2).',
  '3': 'QA1 Monte Carlo: model draws for each selected field (Eq. A6.3).',
  '4': 'QA1 Monte Carlo: design-weighted total and mean from the draws (Eq. A6.4).',
  '5': 'QA1 Monte Carlo: variance split into sampling-design and model parts (Eq. A6.5).',
  '6': 'QA1 Monte Carlo: variance of the total (Eq. A6.6).',
  '7': 'QA1 Monte Carlo: variance of the mean per hectare (Eq. A6.7).',
  '8': 'QA2: variance of the soil-carbon change from the selected units — start variance + end variance − 2 × their covariance, summed over units (Eq. A6.8).',
  '9': 'QA2: design-weighted (Hansen–Hurwitz) total change of the project plots between the two campaigns (Eq. A6.9).',
};

export function eqNumber(eq: string): string | null {
  const m = /Eq\.\s*(\d+)/.exec(eq ?? '');
  return m ? m[1] : null;
}

export function eqText(eq: string, label = ''): string {
  if (/before uncertainty/.test(label)) return 'Soil-carbon stock change over the credited years, before the uncertainty multiplier.';
  if (/^I_soil$/.test(label.trim())) return '+1 when the project stores at least as much carbon as the baseline, otherwise −1 (flips the uncertainty multiplier so it is always conservative).';
  if (/§4 cond\. 7/.test(eq)) return 'Carbon in any biochar applied is not credited as soil carbon, so it is subtracted.';
  const a6 = /A6\.(\d)/.exec(eq ?? '');
  if (a6) return A6_TEXT[a6[1]] ?? 'Appendix 6 multi-stage estimator.';
  if (/App\. ?6/.test(eq ?? '')) return 'The campaign used a multi-stage design: units were selected with known probabilities, then sampled inside (VM0042 Appendix 6).';
  const n = eqNumber(eq);
  if (!n) return '';
  const k = Number(n);
  if (EQ_TEXT[n]) return EQ_TEXT[n];
  if (k >= 27 && k <= 31) return EQ_TEXT['26'];
  if (k >= 53 && k <= 59) return 'Reduction for this source: baseline minus project, per unit area, times area.';
  if (k >= 48 && k <= 51) return 'Tree and shrub biomass change (CDM A/R tools).';
  if (k >= 60 && k <= 69) return 'Model prediction and sampling error (QA1).';
  return '';
}

/** Emission sources (QA3), in reporting order, with plain labels. */
export const SOURCE_ORDER = [
  'co2_fossil_fuel', 'co2_liming', 'n2o_fertilizer', 'n2o_n_fixing', 'n2o_manure', 'ch4_manure', 'ch4_enteric',
  'ch4_biomass_burning', 'n2o_biomass_burning',
];

export const SOURCE_LABEL: Record<string, string> = {
  co2_fossil_fuel: 'Fossil fuel CO₂', co2_liming: 'Liming CO₂', n2o_fertilizer: 'Fertiliser N₂O (direct + indirect)',
  n2o_n_fixing: 'N-fixing species N₂O', n2o_manure: 'Manure deposition N₂O', ch4_manure: 'Manure CH₄',
  ch4_enteric: 'Enteric fermentation CH₄', ch4_biomass_burning: 'Biomass burning CH₄', n2o_biomass_burning: 'Biomass burning N₂O',
  ch4_soil: 'Soil methanogenesis CH₄ (modelled)', n2o_soil: 'Soil N₂O (modelled)', legacy_terms: 'Approved emission terms (legacy)',
  le_oa: 'Organic-amendment leakage', leakage_biomass_residues: 'Biomass residues diverted (leakage)',
  leakage_displacement: 'Livestock / production displacement (leakage)', leakage: 'Other leakage',
};

export function sourceLabel(k: string): string {
  return SOURCE_LABEL[k] ?? k.replace(/_/g, ' ');
}

export const EXEMPTION_LABEL: Record<string, string> = {
  produced_on_site: 'Produced on-site in the project area',
  diverted_from_anaerobic_storage: 'Diverted from an uncovered anaerobic lagoon or pit',
  not_previously_used_as_amendment: 'Not previously used as a soil amendment',
};

export const EF_END_TEXT: Record<string, string> = {
  low: 'Low end of the range — project emissions fell, so the smallest factor is used for both scenarios (§8.6.3).',
  high: 'High end of the range — project emissions rose, so the largest factor is used for both scenarios (§8.6.3).',
  central: 'Central value — baseline and project emissions are equal, so no range end applies.',
  value: 'Single value — no uncertainty range was entered for this factor.',
  fixed: 'Fixed by VM0042 (constant in the rule pack).',
};

/** The 17 readiness dimensions, grouped for display, with where to fix each one. */
export const READINESS_GROUPS: { key: string; label: string; keys: string[] }[] = [
  { key: 'method', label: 'Methodology & eligibility', keys: ['rules_approved', 'fields_enrolled', 'additionality', 'control_sites', 'strata_defined'] },
  { key: 'data', label: 'Data', keys: ['activity_data_complete', 'sample_plans_approved', 'baseline_samples_collected', 'monitoring_campaign', 'lab_results_accepted'] },
  { key: 'quality', label: 'Quality', keys: ['certificates_attached', 'custody_complete', 'open_blocking_qa', 'terms_approved', 'monitoring_plan'] },
  { key: 'approval', label: 'Approval', keys: ['calculation_approved', 'package_issued'] },
];

export const READINESS_LINK: Record<string, { label: string; path: string; query?: Record<string, string> }> = {
  rules_approved: { label: 'Methodology rules', path: '/app/methodology' },
  fields_enrolled: { label: 'Fields', path: '/app/fields' },
  additionality: { label: 'Additionality', path: '/app/additionality' },
  control_sites: { label: 'Control sites', path: '/app/control-sites' },
  strata_defined: { label: 'Sampling', path: '/app/sampling' },
  activity_data_complete: { label: 'Activity data', path: '/app/baseline' },
  sample_plans_approved: { label: 'Sampling', path: '/app/sampling' },
  baseline_samples_collected: { label: 'Sampling', path: '/app/sampling' },
  monitoring_campaign: { label: 'Sampling', path: '/app/sampling' },
  lab_results_accepted: { label: 'Laboratory', path: '/app/lab' },
  certificates_attached: { label: 'Laboratory', path: '/app/lab' },
  custody_complete: { label: 'Sampling', path: '/app/sampling' },
  open_blocking_qa: { label: 'Quality checks', path: '/app/quality' },
  terms_approved: { label: 'Decided terms', path: '/app/calculations', query: { tab: 'terms' } },
  monitoring_plan: { label: 'Documents', path: '/app/documents' },
  calculation_approved: { label: 'Calculations', path: '/app/calculations' },
  package_issued: { label: 'Verification', path: '/app/verification' },
};
