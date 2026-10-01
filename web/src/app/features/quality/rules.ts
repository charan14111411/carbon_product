/**
 * Plain-English names for the QA rule codes in api/app/modules/qa/engine.py (and the post-run findings of the
 * calculation service). `ref` is only a fallback: a finding's own details.reference always wins.
 */
export interface RuleMeta { title: string; why: string; ref?: string }

const R = {
  stratification: 'VM0042 v2.2 §8.2.1.2 p.29-30',
  composites: 'VM0042 v2.2 §8.2.1.2 p.30',
  season: 'VM0042 v2.2 §8.2.1.2 p.29',
  georeference: 'VM0042 v2.2 §8.2.1.2 p.29',
  shipping: 'VM0042 v2.2 §8.2.1.3(5) p.32',
  storage: 'VM0042 v2.2 §8.2.1.3(5) p.32',
  depth: 'VM0042 v2.2 §8.2.1.3(7b) p.32',
  increments: 'VM0042 v2.2 §8.2.1.3(7) p.32',
  esm: 'VM0042 v2.2 §8.2.1.3 Eq. 3 p.33',
  methods: 'VM0042 v2.2 §8.2.1.4 p.35',
  lab: 'VM0042 v2.2 §8.2.1.4 p.35-36',
  remeasure: 'VM0042 v2.2 §8.1 p.20 and §9.2',
  spectroscopy: 'VM0042 v2.2 §8.6.2.1 Eq. 73 p.78 and Appendix 4 p.152-157',
};

export const RULES: Record<string, RuleMeta> = {
  // samples
  SAMPLE_OUTSIDE_FIELD: { title: 'Sample taken outside its field', why: 'A core only counts for the field it was taken in. A point outside the boundary may belong to a neighbouring plot.', ref: R.georeference },
  GPS_ACCURACY_LOW: { title: 'GPS position not precise enough', why: 'Re-sampling must return to the same spot, so each core needs an accurate position.', ref: R.georeference },
  TOO_FAR_FROM_SITE: { title: 'Sample far from its planned site', why: 'Cores should be taken where the sampling plan placed them, so the design stays random and unbiased.' },
  MISSING_PHOTOS: { title: 'Photos missing for a core', why: 'Photos of the site and the core are evidence the verifier checks.' },
  SHALLOW_CORE: { title: 'Core not deep enough', why: 'The core must reach the campaign depth so the soil carbon stock covers the whole layer.', ref: R.depth },
  DEPTH_GAP: { title: 'Gaps or overlaps between depth layers', why: 'Depth layers must join without gaps or overlaps, or the stock would be over- or under-counted.' },
  CUSTODY_GAP: { title: 'Lab never recorded receiving the sample', why: 'Chain of custody: every bag with a result must have a recorded receipt at the lab.' },
  SHIPPED_LATE: { title: 'Samples shipped to the lab too late', why: 'VM0042 limits the time between collection and dispatch so samples do not change before analysis.', ref: R.shipping },
  STORAGE_TOO_LONG: { title: 'Samples stored too long before analysis', why: 'Refrigerated samples should be analysed within the allowed number of days.', ref: R.storage },
  FROZEN_STORAGE: { title: 'Samples were frozen', why: 'Samples should be refrigerated or dried, not frozen, which can change soil structure and carbon measurements.', ref: R.storage },
  RESAMPLE_INCREMENTS: { title: 'Too few depth increments at re-sampling', why: 'Re-sampled cores need enough depth increments to apply the equivalent soil mass method.', ref: R.increments },
  REPORTING_DEPTH_SHALLOW: { title: 'SOC not reported deep enough', why: 'VM0042 requires SOC to be reported to at least the minimum depth, unless bedrock or a hard layer stops the core.', ref: R.depth },
  DUPLICATE_GPS: { title: 'Two samples at the same location', why: 'Distinct sample points should not collapse onto one spot; it may be a duplicated record or a GPS error.', ref: R.georeference },
  MONITORING_BEFORE_BASELINE: { title: 'Monitoring sample taken before the baseline', why: 'A site must have its baseline measurement before it is re-measured.', ref: R.remeasure },
  STALE_REMEASUREMENT: { title: 'Too long between measurements', why: 'SOC must be re-measured within the maximum interval set by the methodology.', ref: R.remeasure },
  // lab results
  ANALYSIS_BEFORE_COLLECTION: { title: 'Analysed before the sample was collected', why: 'An analysis date earlier than the collection date is a data-entry error.' },
  MISSING_CERTIFICATE: { title: 'Accepted result has no lab certificate', why: 'Each accepted value needs the signed lab certificate as evidence for the verifier.' },
  METHOD_NOT_PERMITTED: { title: 'Lab method not allowed by the rule pack', why: 'The project rule pack lists which lab methods may be used for each analyte.', ref: R.methods },
  IMPLAUSIBLE_VALUE: { title: 'Unusual lab value', why: 'The value is outside the range normally seen for this soil property. Check it against the certificate.' },
  UNIT_MISMATCH: { title: 'Result in a unit that can’t be converted', why: 'Every result is converted to one canonical unit before the calculation.', ref: R.esm },
  METHOD_NOT_RECOMMENDED: { title: 'SOC method not recommended (Walkley-Black or LOI)', why: 'VM0042 recommends dry combustion. Walkley-Black and loss on ignition may be used only where no other method is available, with a justification.', ref: R.methods },
  BELOW_DETECTION_LIMIT: { title: 'Result below the lab’s detection limit', why: 'A value under the detection limit is uncertain. Review how it is used in the calculation.', ref: R.lab },
  // soil layers
  MISSING_SOC: { title: 'Soil organic carbon result missing', why: 'Every depth layer needs an accepted SOC result before the stock can be calculated.' },
  MISSING_BULK_DENSITY: { title: 'Bulk density result missing', why: 'Bulk density converts SOC concentration into a stock per hectare.' },
  MISSING_COARSE_FRACTION: { title: 'Stone fraction result missing', why: 'Where the rule pack corrects for coarse fragments, each layer needs its stone fraction.' },
  MISSING_SOIL_MASS_INPUTS: { title: 'Soil mass inputs missing (Eq. 3)', why: 'Without fine-soil mass and core volume, the equivalent soil mass is derived from bulk density with a correction instead of Eq. 3.', ref: R.esm },
  // plans, points, zones, campaigns
  TOO_FEW_SAMPLES: { title: 'Too few samples in a zone', why: 'Each zone needs the planned number of samples for the result to meet its precision target.', ref: R.stratification },
  TOO_FEW_COMPOSITES: { title: 'Too few composite samples in a zone', why: 'VM0042 sets a minimum number of composite samples per zone.', ref: R.composites },
  UNPAIRED_SITE: { title: 'Site not re-visited', why: 'Paired designs re-measure the same sites; an unpaired site weakens the comparison with the baseline.' },
  STRATIFICATION_FACTORS_MISSING: { title: 'Zone stratification factors missing', why: 'Zones must be defined by the factors VM0042 lists, such as climate, soil type, land use and management.', ref: R.stratification },
  SEASON_MISMATCH: { title: 'Re-sampling in a different season', why: 'Re-sampling must take place in the same season as the baseline, so seasonal swings in soil carbon are not counted as change.', ref: R.season },
  LAB_CHANGE_UNJUSTIFIED: { title: 'Lab changed without a recorded justification', why: 'VM0042 expects the same lab for the project lifetime. A change needs a recorded justification and an SOP consistency statement (Laboratory → Lab changes).', ref: R.lab },
  SPECTROSCOPY_CHECK_LOW: { title: 'Too few spectroscopy samples checked by dry combustion', why: 'When SOC is measured by spectroscopy, 10–15 % of samples are re-run by dry combustion to estimate the model error (Eq. 73).', ref: R.spectroscopy },
  LAB_QC_EVIDENCE_MISSING: { title: 'Lab quality evidence missing', why: 'The lab should show ISO/IEC 17025 accreditation, take part in a proficiency programme (such as NAPT or GLOSOLAN) and report its analytical error.', ref: R.lab },
  // calculation run
  NET_RESULT_NOT_POSITIVE: { title: 'No net greenhouse-gas benefit', why: 'The carbon stock did not increase over the period, so no credits arise from this run.' },
  HIGH_UNCERTAINTY: { title: 'High uncertainty in the result', why: 'A large uncertainty increases the deduction taken from the credits.' },
  ESM_MASS_CORRECTION: { title: 'Equivalent soil mass correction applied', why: 'Some layers used a mass correction because soil mass inputs were incomplete.', ref: R.esm },
  DE_MINIMIS_SOURCES: { title: 'Small emission sources left out', why: 'Emission sources below the de minimis threshold were excluded from the calculation.' },
};

export function humanizeCode(code: string): string {
  const s = (code ?? '').replace(/_/g, ' ').toLowerCase().trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Check';
}
