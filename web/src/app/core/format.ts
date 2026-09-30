import { Pipe, PipeTransform } from '@angular/core';

const nf = (d: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: d, minimumFractionDigits: 0 });

export function fmtNum(v: number | null | undefined, digits = 1): string {
  if (v === null || v === undefined || Number.isNaN(Number(v))) return '—';
  return nf(digits).format(Number(v));
}

export function fmtT(v: number | null | undefined, digits = 1): string {
  return v === null || v === undefined ? '—' : `${fmtNum(v, digits)} tCO₂e`;
}

export function fmtInr(v: number | string | null | undefined): string {
  if (v === null || v === undefined || v === '') return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(v));
}

export function fmtDate(v: string | Date | null | undefined, withTime = false): string {
  if (!v) return '—';
  const d = typeof v === 'string' ? new Date(v.length === 10 ? v + 'T00:00:00' : v) : v;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

export function fmtAgo(v: string | null | undefined): string {
  if (!v) return '—';
  const s = (Date.now() - new Date(v).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)} d ago`;
  return fmtDate(v);
}

@Pipe({ name: 'num' })
export class NumPipe implements PipeTransform {
  transform(v: number | null | undefined, digits = 1) { return fmtNum(v, digits); }
}

@Pipe({ name: 'tco2' })
export class TonnesPipe implements PipeTransform {
  transform(v: number | null | undefined, digits = 1) { return fmtT(v, digits); }
}

@Pipe({ name: 'inr' })
export class InrPipe implements PipeTransform {
  transform(v: number | string | null | undefined) { return fmtInr(v); }
}

@Pipe({ name: 'day' })
export class DayPipe implements PipeTransform {
  transform(v: string | Date | null | undefined, withTime = false) { return fmtDate(v, withTime); }
}

@Pipe({ name: 'ago' })
export class AgoPipe implements PipeTransform {
  transform(v: string | null | undefined) { return fmtAgo(v); }
}

@Pipe({ name: 'human' })
export class HumanPipe implements PipeTransform {
  transform(v: string | null | undefined) {
    if (!v) return '—';
    const s = String(v).replace(/_/g, ' ');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}

export const PIPES = [NumPipe, TonnesPipe, InrPipe, DayPipe, AgoPipe, HumanPipe];
