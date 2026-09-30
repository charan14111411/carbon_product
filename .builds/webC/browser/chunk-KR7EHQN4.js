import {
  Injectable,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-O2E4BMDK.js";

// src/app/core/toast.service.ts
var ToastService = class _ToastService {
  toasts = signal(
    [],
    ...ngDevMode ? [{ debugName: "toasts" }] : (
      /* istanbul ignore next */
      []
    )
  );
  seq = 0;
  success(title, body) {
    this.push("success", title, body);
  }
  info(title, body) {
    this.push("info", title, body);
  }
  error(title, body) {
    this.push("error", title, body, 7e3);
  }
  /** Show an API error in plain language. */
  apiError(err, fallback = "That didn't work") {
    const e = err;
    this.error(fallback, e?.message ?? String(err));
  }
  dismiss(id) {
    this.toasts.update((ts) => ts.filter((t) => t.id !== id));
  }
  push(kind, title, body, ms = 4200) {
    const id = ++this.seq;
    this.toasts.update((ts) => [...ts.slice(-3), { id, kind, title, body }]);
    setTimeout(() => this.dismiss(id), ms);
  }
  static \u0275fac = function ToastService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToastService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ToastService, factory: _ToastService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  ToastService
};
//# debugId=eba025d6-1f4d-5929-933d-cc3a913b6d8a
//# sourceMappingURL=chunk-KR7EHQN4.js.map
