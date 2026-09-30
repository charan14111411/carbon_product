import {
  ApiService,
  Injectable,
  computed,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-O2E4BMDK.js";

// src/app/core/project-context.service.ts
var KEY = "vc.project";
var ProjectContext = class _ProjectContext {
  api = inject(ApiService);
  projects = signal(
    [],
    ...ngDevMode ? [{ debugName: "projects" }] : (
      /* istanbul ignore next */
      []
    )
  );
  loaded = signal(
    false,
    ...ngDevMode ? [{ debugName: "loaded" }] : (
      /* istanbul ignore next */
      []
    )
  );
  currentId = signal(
    localStorage.getItem(KEY),
    ...ngDevMode ? [{ debugName: "currentId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  current = computed(
    () => this.projects().find((p) => p.id === this.currentId()) ?? null,
    ...ngDevMode ? [{ debugName: "current" }] : (
      /* istanbul ignore next */
      []
    )
  );
  load() {
    this.api.get("/projects").subscribe({
      next: (r) => {
        const list = Array.isArray(r) ? r : r.items;
        this.projects.set(list);
        this.loaded.set(true);
        if (!list.find((p) => p.id === this.currentId()) && list.length)
          this.select(list[0].id);
      },
      error: () => this.loaded.set(true)
    });
  }
  select(id) {
    localStorage.setItem(KEY, id);
    this.currentId.set(id);
  }
  static \u0275fac = function ProjectContext_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProjectContext)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ProjectContext, factory: _ProjectContext.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProjectContext, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  ProjectContext
};
//# debugId=00ad68d3-ac11-5b8e-a6df-99c02a5bb1a3
//# sourceMappingURL=chunk-YJGD7DJQ.js.map
