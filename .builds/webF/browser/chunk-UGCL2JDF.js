// src/app/features/farmers/types.ts
var PURPOSES = {
  sampling: { label: "Soil sampling", text: "Field teams may visit and take soil cores from enrolled fields." },
  data_use: { label: "Data use", text: "Farm, practice and soil data may be used to measure carbon." },
  practice_monitoring: { label: "Practice monitoring", text: "Farming practices may be checked by visits, photos and satellite." },
  share_with_buyers: { label: "Share with buyers", text: "Anonymised results may be shared with credit buyers and verifiers." },
  payments: { label: "Payments", text: "Bank or UPI details may be used to pay the farmer\u2019s share." },
  sensor_installation: { label: "Sensor installation", text: "Soil or weather sensors may be installed on the farm." }
};
var PURPOSE_KEYS = Object.keys(PURPOSES);
var LANGUAGES = {
  kn: "Kannada",
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
  ml: "Malayalam",
  mr: "Marathi"
};
var CHANNELS = {
  field_officer: "In person, with a field officer",
  paper: "Signed paper form",
  app: "Farmer app",
  whatsapp: "WhatsApp",
  ivr: "Phone call (IVR)"
};
function initials(name) {
  return (name || "?").split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}
function formatPhone(p) {
  const m = /^\+91(\d{5})(\d{5})$/.exec((p || "").replace(/\s+/g, ""));
  return m ? `+91 ${m[1]} ${m[2]}` : p;
}

export {
  PURPOSES,
  PURPOSE_KEYS,
  LANGUAGES,
  CHANNELS,
  initials,
  formatPhone
};
//# debugId=c50bbea7-b75d-511f-9a6c-3ee70f3d2afd
//# sourceMappingURL=chunk-UGCL2JDF.js.map
