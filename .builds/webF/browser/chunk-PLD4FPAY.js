import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵstyleProp,
  ɵɵtext
} from "./chunk-O2E4BMDK.js";

// src/app/layout/brand.ts
var Brand = class _Brand {
  light = input(
    false,
    ...ngDevMode ? [{ debugName: "light" }] : (
      /* istanbul ignore next */
      []
    )
  );
  static \u0275fac = function Brand_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Brand)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Brand, selectors: [["vc-brand"]], hostVars: 4, hostBindings: function Brand_HostBindings(rf, ctx) {
    if (rf & 2) {
      \u0275\u0275styleProp("color", ctx.light() ? "#fff" : "var(--forest-900)");
      \u0275\u0275classProp("dark", !ctx.light());
    }
  }, inputs: { light: [1, "light"] }, decls: 11, vars: 4, consts: [["width", "30", "height", "30", "viewBox", "0 0 32 32", "aria-hidden", "true"], ["x", "1", "y", "1", "width", "30", "height", "30", "rx", "8", "opacity", ".18"], ["x", "10", "y", "15", "width", "12", "height", "12", "rx", "2.5"], ["d", "M10 19.5h12M10 23.5h12", "stroke", "#fff", "stroke-opacity", ".55", "stroke-width", "1.2"], ["d", "M16 15c0-4 2.2-7.3 6.6-8.2.3 4.6-2.3 7.8-6.6 8.2z"], ["d", "M16 15c0-3-1.6-5.4-4.9-6.1-.2 3.4 1.7 5.8 4.9 6.1z"], [1, "wm"]], template: function Brand_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275namespaceSVG();
      \u0275\u0275domElementStart(0, "svg", 0);
      \u0275\u0275domElement(1, "rect", 1)(2, "rect", 2)(3, "path", 3)(4, "path", 4)(5, "path", 5);
      \u0275\u0275domElementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275domElementStart(6, "span", 6)(7, "strong");
      \u0275\u0275text(8, "Varsapradaya");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(9, "span");
      \u0275\u0275text(10, "Carbon");
      \u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275attribute("fill", ctx.light() ? "#86b797" : "#275e3f");
      \u0275\u0275advance();
      \u0275\u0275attribute("fill", ctx.light() ? "#e7a57b" : "#c76329");
      \u0275\u0275advance(2);
      \u0275\u0275attribute("fill", ctx.light() ? "#c3dbca" : "#2f7249");
      \u0275\u0275advance();
      \u0275\u0275attribute("fill", ctx.light() ? "#86b797" : "#4f9168");
    }
  }, styles: ["\n[_nghost-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n}\n.wm[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.05;\n}\nstrong[_ngcontent-%COMP%] {\n  font-size: 15px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n.wm[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 500;\n  letter-spacing: 0.14em;\n  text-transform: uppercase;\n  opacity: 0.7;\n  margin-top: 2px;\n}\n.dark[_nghost-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-900);\n}\n/*# sourceMappingURL=brand.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Brand, [{
    type: Component,
    args: [{ selector: "vc-brand", changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" rx="8" [attr.fill]="light() ? '#86b797' : '#275e3f'" opacity=".18"/>
      <rect x="10" y="15" width="12" height="12" rx="2.5" [attr.fill]="light() ? '#e7a57b' : '#c76329'"/>
      <path d="M10 19.5h12M10 23.5h12" stroke="#fff" stroke-opacity=".55" stroke-width="1.2"/>
      <path d="M16 15c0-4 2.2-7.3 6.6-8.2.3 4.6-2.3 7.8-6.6 8.2z" [attr.fill]="light() ? '#c3dbca' : '#2f7249'"/>
      <path d="M16 15c0-3-1.6-5.4-4.9-6.1-.2 3.4 1.7 5.8 4.9 6.1z" [attr.fill]="light() ? '#86b797' : '#4f9168'"/>
    </svg>
    <span class="wm"><strong>Varsapradaya</strong><span>Carbon</span></span>
  `, host: { "[class.dark]": "!light()", "[style.color]": 'light() ? "#fff" : "var(--forest-900)"' }, styles: ["/* angular:styles/component:scss;9ca7f75b69c037ae;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\layout\\brand.ts */\n:host {\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n}\n.wm {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.05;\n}\nstrong {\n  font-size: 15px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n.wm span {\n  font-size: 11px;\n  font-weight: 500;\n  letter-spacing: 0.14em;\n  text-transform: uppercase;\n  opacity: 0.7;\n  margin-top: 2px;\n}\n:host(.dark) strong {\n  color: var(--forest-900);\n}\n/*# sourceMappingURL=brand.css.map */\n"] }]
  }], null, { light: [{ type: Input, args: [{ isSignal: true, alias: "light", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Brand, { className: "Brand", filePath: "src/app/layout/brand.ts", lineNumber: 26 });
})();

export {
  Brand
};
//# debugId=e68768cf-b0cf-52a1-9616-d8a9b3f16fb1
//# sourceMappingURL=chunk-PLD4FPAY.js.map
