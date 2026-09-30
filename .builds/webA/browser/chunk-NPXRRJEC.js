// src/app/features/programmes/form-errors.ts
function tidy(msg) {
  let m = msg.replace(/^Value error,\s*/i, "");
  if (/should match pattern/i.test(m)) m = "Use letters, numbers, - or _ (2\u201340 characters, no spaces).";
  if (/at least (\d+) characters?/i.test(m)) m = m.replace(/^String should have/i, "Enter");
  if (/valid email/i.test(m)) m = "Enter a valid email address.";
  return m.charAt(0).toUpperCase() + m.slice(1);
}
function fieldMap(e) {
  const out = {};
  const fields = e.details?.["fields"] ?? [];
  for (const f of fields) {
    const key = (f.field ?? "").split(".").pop() || "_";
    const msg = tidy(f.message ?? "Check this value.");
    out[key] = out[key] && key === "_" ? `${out[key]} ${msg}` : msg;
  }
  return out;
}
function formMessage(e, map) {
  if (map["_"]) return map["_"];
  return Object.keys(map).length ? null : e.message;
}

export {
  fieldMap,
  formMessage
};
//# debugId=95d0d509-8f4c-5dd2-bd25-4b8d2cde667d
//# sourceMappingURL=chunk-NPXRRJEC.js.map
