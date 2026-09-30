/** Shared look for the field app: large touch targets, high contrast for use in sunlight. */
export const FIELD_CSS = `
  :host{display:block}
  .fpage{padding:16px 16px 24px;display:flex;flex-direction:column;gap:16px}
  .ftitle{font-size:22px;font-weight:600;letter-spacing:-.01em;color:var(--stone-900);line-height:1.2}
  .fsub{font-size:14.5px;color:var(--stone-700)}
  .fcard{background:#fff;border:1.5px solid var(--sand-300);border-radius:14px;box-shadow:0 1px 2px rgba(16,41,28,.06)}
  .fcard-pad{padding:16px}
  .fsec{font-size:12.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--stone-600);margin:4px 2px -6px}
  .fbtn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 20px;border-radius:12px;border:2px solid transparent;
    font:600 16px var(--font);cursor:pointer;user-select:none;text-decoration:none!important;-webkit-tap-highlight-color:transparent}
  .fbtn:active{transform:translateY(1px)}
  .fbtn[disabled]{opacity:.45;cursor:not-allowed}
  .fbtn.primary{background:var(--forest-700);color:#fff}
  .fbtn.primary:hover:not([disabled]){background:var(--forest-800)}
  .fbtn.secondary{background:#fff;color:var(--forest-800);border-color:var(--forest-700)}
  .fbtn.ghost{background:transparent;color:var(--stone-800);border-color:var(--sand-300)}
  .fbtn.danger{background:#fff;color:var(--red-600);border-color:var(--red-600)}
  .fbtn.block{width:100%}
  .fbtn.sm{min-height:44px;padding:0 14px;font-size:15px;border-radius:10px}
  .finput{width:100%;min-height:52px;padding:0 14px;border:2px solid var(--stone-300);border-radius:12px;background:#fff;font:500 17px var(--font);color:var(--stone-900);outline:none}
  textarea.finput{min-height:96px;padding:12px 14px;line-height:1.45}
  select.finput{appearance:none;padding-right:40px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231d2420' stroke-width='2.2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center}
  .finput:focus{border-color:var(--forest-600);box-shadow:0 0 0 3px rgba(47,114,73,.25)}
  .finput.bad{border-color:var(--red-600)}
  .flabel{display:block;font-size:14.5px;font-weight:600;color:var(--stone-800);margin-bottom:6px}
  .fhint{font-size:13.5px;color:var(--stone-600);margin-top:6px}
  .ferr{font-size:14px;color:var(--red-600);margin-top:6px;font-weight:500}
  .chip{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:999px;font-size:13px;font-weight:600;white-space:nowrap}
  .chip.ok{background:var(--forest-100);color:var(--forest-800)}
  .chip.warn{background:var(--amber-100);color:#7a4d00}
  .chip.bad{background:var(--red-100);color:var(--red-600)}
  .chip.info{background:var(--sky-100);color:var(--sky-600)}
  .chip.muted{background:var(--stone-100);color:var(--stone-700)}
  .fempty{display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;padding:28px 16px;color:var(--stone-700)}
  .fempty .ic{display:grid;place-items:center;width:56px;height:56px;border-radius:16px;background:var(--sand-200);color:var(--stone-700);margin-bottom:4px}
  .fempty h3{font-size:17px}
  .num{font-variant-numeric:tabular-nums}
  .mono{font-family:var(--mono)}
`;
