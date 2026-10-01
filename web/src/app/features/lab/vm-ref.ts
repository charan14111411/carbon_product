import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Split a backend reference such as "VM0042 v2.2 §8.6.2.1 Eq. 73 p.78 and Appendix 4 p.152-157" into short chips. */
export function refParts(ref: string | null | undefined): string[] {
  if (!ref) return [];
  return String(ref)
    .split(/\s+and\s+|;\s*/)
    .map(p => p.trim().replace(/\s*v2\.2\b/, ''))
    .filter(Boolean)
    .map(p => (/^VM0042/.test(p) ? p : `VM0042 ${p}`));
}

/** Small methodology reference chip(s), e.g. "VM0042 §8.2.1.4 p.35". */
@Component({
  selector: 'vc-vm-ref',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@for (p of parts(); track p) { <span class="ref" [title]="ref()">{{ p }}</span> }`,
  styles: [`
    :host{display:inline-flex;flex-wrap:wrap;gap:4px;vertical-align:middle}
    .ref{display:inline-flex;align-items:center;height:20px;padding:0 7px;border-radius:5px;border:1px solid var(--border);
      background:var(--surface-2);color:var(--stone-600);font:500 11px var(--mono);white-space:nowrap;letter-spacing:-.01em}
  `],
})
export class VmRef {
  ref = input<string | null | undefined>('');
  parts = computed(() => refParts(this.ref()));
}
