import {
  ActivatedRoute,
  ChangeDetectionStrategy,
  Component,
  Empty,
  PageHeader,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵproperty
} from "./chunk-QEUPA6FW.js";

// src/app/features/shared/placeholder.ts
var Placeholder = class _Placeholder {
  title = inject(ActivatedRoute).snapshot.data["title"] ?? "";
  static \u0275fac = function Placeholder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Placeholder)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Placeholder, selectors: [["vc-placeholder"]], decls: 3, vars: 1, consts: [[3, "title"], [1, "card"], ["icon", "sparkles", "title", "Being prepared", "text", "This area is being built."]], template: function Placeholder_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "vc-page-header", 0);
      \u0275\u0275elementStart(1, "div", 1);
      \u0275\u0275element(2, "vc-empty", 2);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("title", ctx.title);
    }
  }, dependencies: [PageHeader, Empty], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Placeholder, [{
    type: Component,
    args: [{
      selector: "vc-placeholder",
      imports: [PageHeader, Empty],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<vc-page-header [title]="title" /><div class="card"><vc-empty icon="sparkles" title="Being prepared" text="This area is being built." /></div>`
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Placeholder, { className: "Placeholder", filePath: "src/app/features/shared/placeholder.ts", lineNumber: 11 });
})();

export {
  Placeholder
};
//# debugId=3c393962-ee10-5fcd-b059-bc10a2551c20
//# sourceMappingURL=chunk-45LZUYZU.js.map
