/* Small numeric helpers shared by the QA1, woody-biomass and leakage screens. */
import { fmtNum } from '../../core/format';

/** Inverse standard normal CDF (Acklam's rational approximation, |error| < 1.2e-9). */
export function normInv(p: number): number {
  if (!(p > 0 && p < 1)) return NaN;
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const lo = 0.02425;
  if (p < lo) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > 1 - lo) return -normInv(1 - p);
  const q = p - 0.5;
  const r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

/** One-sided Student-t quantile t(p, df) by the Cornish–Fisher expansion (accurate to ~1e-4 for df ≥ 3). */
export function tQuantile(p: number, df: number | null | undefined): number {
  const z = normInv(p);
  if (!df || !Number.isFinite(df) || df <= 0) return z;
  const z2 = z * z;
  const g1 = (z2 * z + z) / 4;
  const g2 = (5 * z2 * z2 * z + 16 * z2 * z + 3 * z) / 96;
  const g3 = (3 * z2 ** 3 * z + 19 * z2 * z2 * z + 17 * z2 * z - 15 * z) / 384;
  const g4 = (79 * z2 ** 4 * z + 776 * z2 ** 3 * z + 1482 * z2 * z2 * z - 1920 * z2 * z - 945 * z) / 92160;
  return z + g1 / df + g2 / df ** 2 + g3 / df ** 3 + g4 / df ** 4;
}

/** VM0042 Eq. 74 as a percentage: √variance ÷ |total| × t(confidence, df). */
export function uncPct(total: number | null | undefined, variance: number | null | undefined, df: number | null | undefined, confidence = 0.667): number | null {
  if (total === null || total === undefined || variance === null || variance === undefined) return null;
  if (total === 0 || variance <= 0) return 0;
  return (Math.sqrt(variance) / Math.abs(total)) * tQuantile(confidence, df) * 100;
}

/** Readable number for very small or very large variances. */
export function sci(v: number | null | undefined, digits = 3): string {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  if (v !== 0 && Math.abs(v) < 0.001) return v.toExponential(2).replace('e', ' × 10^');
  return fmtNum(v, digits);
}

export function human(v: string | null | undefined): string {
  if (!v) return '—';
  const s = String(v).replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
