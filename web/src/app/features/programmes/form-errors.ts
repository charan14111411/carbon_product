import { ApiError } from '../../core/api.service';

function tidy(msg: string): string {
  let m = msg.replace(/^Value error,\s*/i, '');
  if (/should match pattern/i.test(m)) m = 'Use letters, numbers, - or _ (2–40 characters, no spaces).';
  if (/at least (\d+) characters?/i.test(m)) m = m.replace(/^String should have/i, 'Enter');
  if (/valid email/i.test(m)) m = 'Enter a valid email address.';
  return m.charAt(0).toUpperCase() + m.slice(1);
}

/**
 * Map a validation error's `details.fields[]` to {field: message}.
 * Messages that don't belong to one field land under `_`.
 */
export function fieldMap(e: ApiError): Record<string, string> {
  const out: Record<string, string> = {};
  const fields = (e.details?.['fields'] as { field?: string; message?: string }[]) ?? [];
  for (const f of fields) {
    const key = (f.field ?? '').split('.').pop() || '_';
    const msg = tidy(f.message ?? 'Check this value.');
    out[key] = out[key] && key === '_' ? `${out[key]} ${msg}` : msg;
  }
  return out;
}

/** The message to show above a form: the unkeyed validation message or the API message. */
export function formMessage(e: ApiError, map: Record<string, string>): string | null {
  if (map['_']) return map['_'];
  return Object.keys(map).length ? null : e.message;
}
