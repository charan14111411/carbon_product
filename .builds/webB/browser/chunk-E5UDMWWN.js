import {
  Pipe,
  __spreadValues,
  setClassMetadata,
  ɵɵdefinePipe
} from "./chunk-O2E4BMDK.js";

// src/app/core/format.ts
var nf = (d) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: d, minimumFractionDigits: 0 });
function fmtNum(v, digits = 1) {
  if (v === null || v === void 0 || Number.isNaN(Number(v)))
    return "\u2014";
  return nf(digits).format(Number(v));
}
function fmtT(v, digits = 1) {
  return v === null || v === void 0 ? "\u2014" : `${fmtNum(v, digits)} tCO\u2082e`;
}
function fmtInr(v) {
  if (v === null || v === void 0 || v === "")
    return "\u2014";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(v));
}
function fmtDate(v, withTime = false) {
  if (!v)
    return "\u2014";
  const d = typeof v === "string" ? new Date(v.length === 10 ? v + "T00:00:00" : v) : v;
  if (Number.isNaN(d.getTime()))
    return "\u2014";
  return d.toLocaleDateString("en-IN", __spreadValues({
    day: "numeric",
    month: "short",
    year: "numeric"
  }, withTime ? { hour: "2-digit", minute: "2-digit" } : {}));
}
function fmtAgo(v) {
  if (!v)
    return "\u2014";
  const s = (Date.now() - new Date(v).getTime()) / 1e3;
  if (s < 60)
    return "just now";
  if (s < 3600)
    return `${Math.floor(s / 60)} min ago`;
  if (s < 86400)
    return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 30)
    return `${Math.floor(s / 86400)} d ago`;
  return fmtDate(v);
}
var NumPipe = class _NumPipe {
  transform(v, digits = 1) {
    return fmtNum(v, digits);
  }
  static \u0275fac = function NumPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NumPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "num", type: _NumPipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NumPipe, [{
    type: Pipe,
    args: [{ name: "num" }]
  }], null, null);
})();
var TonnesPipe = class _TonnesPipe {
  transform(v, digits = 1) {
    return fmtT(v, digits);
  }
  static \u0275fac = function TonnesPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TonnesPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "tco2", type: _TonnesPipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TonnesPipe, [{
    type: Pipe,
    args: [{ name: "tco2" }]
  }], null, null);
})();
var InrPipe = class _InrPipe {
  transform(v) {
    return fmtInr(v);
  }
  static \u0275fac = function InrPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InrPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "inr", type: _InrPipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InrPipe, [{
    type: Pipe,
    args: [{ name: "inr" }]
  }], null, null);
})();
var DayPipe = class _DayPipe {
  transform(v, withTime = false) {
    return fmtDate(v, withTime);
  }
  static \u0275fac = function DayPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DayPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "day", type: _DayPipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DayPipe, [{
    type: Pipe,
    args: [{ name: "day" }]
  }], null, null);
})();
var AgoPipe = class _AgoPipe {
  transform(v) {
    return fmtAgo(v);
  }
  static \u0275fac = function AgoPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AgoPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "ago", type: _AgoPipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AgoPipe, [{
    type: Pipe,
    args: [{ name: "ago" }]
  }], null, null);
})();
var HumanPipe = class _HumanPipe {
  transform(v) {
    if (!v)
      return "\u2014";
    const s = String(v).replace(/_/g, " ");
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  static \u0275fac = function HumanPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HumanPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "human", type: _HumanPipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HumanPipe, [{
    type: Pipe,
    args: [{ name: "human" }]
  }], null, null);
})();

export {
  fmtNum,
  fmtDate,
  NumPipe,
  InrPipe,
  DayPipe,
  AgoPipe,
  HumanPipe
};
//# debugId=f3ff0159-ec38-5302-a262-470853a8c924
//# sourceMappingURL=chunk-E5UDMWWN.js.map
