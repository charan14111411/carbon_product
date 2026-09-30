import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  __spreadValues,
  input,
  model,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate3
} from "./chunk-O2E4BMDK.js";

// src/app/features/fields/attr-inputs.ts
var _forTrack0 = ($index, $item) => $item.key;
function AttrInputs_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275text(1, "*");
    \u0275\u0275elementEnd();
  }
}
function AttrInputs_For_2_Case_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r2.unit);
  }
}
function AttrInputs_For_2_Case_4_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r2 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("Between ", d_r2.min ?? "\u2014", " and ", d_r2.max ?? "\u2014", "", d_r2.unit ? " " + d_r2.unit : "");
  }
}
function AttrInputs_For_2_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5)(1, "input", 6);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function AttrInputs_For_2_Case_4_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const d_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.set(d_r2.key, $event === "" || $event === null ? null : +$event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, AttrInputs_For_2_Case_4_Conditional_2_Template, 2, 1, "span", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, AttrInputs_For_2_Case_4_Conditional_3_Template, 2, 3, "span", 8);
  }
  if (rf & 2) {
    const d_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("id", "a-" + d_r2.key)("ngModel", ctx_r2.values()[d_r2.key]);
    \u0275\u0275attribute("min", d_r2.min ?? null)("max", d_r2.max ?? null);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(d_r2.unit ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(d_r2.min !== null && d_r2.min !== void 0 || d_r2.max !== null && d_r2.max !== void 0 ? 3 : -1);
  }
}
function AttrInputs_For_2_Case_5_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r5 = ctx.$implicit;
    \u0275\u0275property("value", c_r5);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r5);
  }
}
function AttrInputs_For_2_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 9);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function AttrInputs_For_2_Case_5_Template_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const d_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.set(d_r2.key, $event || null));
    });
    \u0275\u0275elementStart(1, "option", 10);
    \u0275\u0275text(2, "Choose\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, AttrInputs_For_2_Case_5_For_4_Template, 2, 2, "option", 11, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("id", "a-" + d_r2.key)("ngModel", ctx_r2.values()[d_r2.key] ?? "");
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(d_r2.choices);
  }
}
function AttrInputs_For_2_Case_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 9);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function AttrInputs_For_2_Case_6_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const d_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.set(d_r2.key, $event || null));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const d_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("id", "a-" + d_r2.key)("ngModel", ctx_r2.values()[d_r2.key] ?? "");
    \u0275\u0275control();
  }
}
function AttrInputs_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "label", 2);
    \u0275\u0275text(2);
    \u0275\u0275conditionalCreate(3, AttrInputs_For_2_Conditional_3_Template, 2, 0, "span", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, AttrInputs_For_2_Case_4_Template, 4, 6)(5, AttrInputs_For_2_Case_5_Template, 5, 2, "select", 4)(6, AttrInputs_For_2_Case_6_Template, 1, 2, "input", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_13_0;
    const d_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("for", "a-" + d_r2.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(d_r2.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(d_r2.required ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_13_0 = d_r2.type) === "number" ? 4 : tmp_13_0 === "choice" ? 5 : 6);
  }
}
var AttrInputs = class _AttrInputs {
  defs = input(
    [],
    ...ngDevMode ? [{ debugName: "defs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  values = model(
    {},
    ...ngDevMode ? [{ debugName: "values" }] : (
      /* istanbul ignore next */
      []
    )
  );
  set(key, v) {
    const next = __spreadValues({}, this.values());
    if (v === null || v === void 0 || v === "")
      delete next[key];
    else
      next[key] = v;
    this.values.set(next);
  }
  static \u0275fac = function AttrInputs_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AttrInputs)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AttrInputs, selectors: [["vc-attr-inputs"]], inputs: { defs: [1, "defs"], values: [1, "values"] }, outputs: { values: "valuesChange" }, decls: 3, vars: 0, consts: [[1, "form-grid"], [1, "field"], [3, "for"], [1, "req"], [1, "input", 3, "id", "ngModel"], [1, "unit-wrap"], ["type", "number", 1, "input", "num", 3, "ngModelChange", "id", "ngModel"], [1, "unit"], [1, "hint"], [1, "input", 3, "ngModelChange", "id", "ngModel"], ["value", ""], [3, "value"]], template: function AttrInputs_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275repeaterCreate(1, AttrInputs_For_2_Template, 7, 4, "div", 1, _forTrack0);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.defs());
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, NgModel], styles: ["\n.req[_ngcontent-%COMP%] {\n  color: var(--%NS%danger);\n  margin-left: 2px;\n}\n.unit-wrap[_ngcontent-%COMP%] {\n  position: relative;\n}\n.unit-wrap[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-right: 52px;\n}\n.unit[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 10px;\n  top: 50%;\n  transform: translateY(-50%);\n  font-size: 12px;\n  color: var(--%NS%text-3);\n  pointer-events: none;\n}\n/*# sourceMappingURL=attr-inputs.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AttrInputs, [{
    type: Component,
    args: [{ selector: "vc-attr-inputs", imports: [FormsModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="form-grid">
      @for (d of defs(); track d.key) {
        <div class="field">
          <label [for]="'a-' + d.key">{{ d.label }}@if (d.required) { <span class="req">*</span> }</label>
          @switch (d.type) {
            @case ('number') {
              <div class="unit-wrap">
                <input class="input num" type="number" [id]="'a-' + d.key" [ngModel]="values()[d.key]"
                  (ngModelChange)="set(d.key, $event === '' || $event === null ? null : +$event)"
                  [attr.min]="d.min ?? null" [attr.max]="d.max ?? null" />
                @if (d.unit) { <span class="unit">{{ d.unit }}</span> }
              </div>
              @if (d.min !== null && d.min !== undefined || d.max !== null && d.max !== undefined) {
                <span class="hint">Between {{ d.min ?? '\u2014' }} and {{ d.max ?? '\u2014' }}{{ d.unit ? ' ' + d.unit : '' }}</span>
              }
            }
            @case ('choice') {
              <select class="input" [id]="'a-' + d.key" [ngModel]="values()[d.key] ?? ''" (ngModelChange)="set(d.key, $event || null)">
                <option value="">Choose\u2026</option>
                @for (c of d.choices; track c) { <option [value]="c">{{ c }}</option> }
              </select>
            }
            @default {
              <input class="input" [id]="'a-' + d.key" [ngModel]="values()[d.key] ?? ''" (ngModelChange)="set(d.key, $event || null)" />
            }
          }
        </div>
      }
    </div>
  `, styles: ["/* angular:styles/component:scss;b984d1c7e6ced2fd;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\fields\\attr-inputs.ts */\n.req {\n  color: var(--danger);\n  margin-left: 2px;\n}\n.unit-wrap {\n  position: relative;\n}\n.unit-wrap .input {\n  padding-right: 52px;\n}\n.unit {\n  position: absolute;\n  right: 10px;\n  top: 50%;\n  transform: translateY(-50%);\n  font-size: 12px;\n  color: var(--text-3);\n  pointer-events: none;\n}\n/*# sourceMappingURL=attr-inputs.css.map */\n"] }]
  }], null, { defs: [{ type: Input, args: [{ isSignal: true, alias: "defs", required: false }] }], values: [{ type: Input, args: [{ isSignal: true, alias: "values", required: false }] }, { type: Output, args: ["valuesChange"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AttrInputs, { className: "AttrInputs", filePath: "src/app/features/fields/attr-inputs.ts", lineNumber: 48 });
})();
function missingRequired(defs, values) {
  return defs.filter((d) => d.required && (values[d.key] === void 0 || values[d.key] === null || values[d.key] === "")).map((d) => d.label);
}

export {
  AttrInputs,
  missingRequired
};
//# debugId=7292d02d-43de-58eb-a4e6-345d920d3545
//# sourceMappingURL=chunk-QDNHTXHD.js.map
