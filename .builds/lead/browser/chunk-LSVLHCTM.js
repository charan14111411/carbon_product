import {
  CHANNELS,
  LANGUAGES,
  PURPOSES,
  formatPhone,
  initials
} from "./chunk-UGCL2JDF.js";
import {
  fieldMap,
  formMessage
} from "./chunk-NPXRRJEC.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  DayPipe,
  HumanPipe,
  NumPipe
} from "./chunk-E5UDMWWN.js";
import {
  ActivatedRoute,
  AuthService,
  Router,
  RouterLink
} from "./chunk-PNIM44LI.js";
import {
  Badge,
  Callout,
  DataClass,
  Empty,
  ErrorBox,
  Hash,
  Loading,
  Modal,
  PageHeader,
  Tabs,
  Timeline
} from "./chunk-PAXTZ3VZ.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  Input,
  Subject,
  catchError,
  computed,
  debounceTime,
  inject,
  input,
  isDevMode,
  of,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdeclareLet,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵreadContextLet,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstoreLet,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/farmers/member-result.ts
var _c0 = (a0) => ["/app/farmers", a0];
var _forTrack0 = ($index, $item) => $item.external_farm_id;
function MemberResult_Conditional_1_Conditional_12_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275element(1, "vc-icon", 9);
    \u0275\u0275elementStart(2, "span", 10);
    \u0275\u0275text(3);
    \u0275\u0275elementStart(4, "code");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "span", 11);
    \u0275\u0275element(7, "vc-icon", 12);
    \u0275\u0275text(8, "SoilSync");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 11);
    \u0275\u0275element(10, "vc-icon", 13);
    \u0275\u0275text(11, "MicroClime");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", f_r1.name, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r1.external_farm_id);
    \u0275\u0275advance();
    \u0275\u0275classProp("on", f_r1.has_soilsync);
    \u0275\u0275property("title", f_r1.has_soilsync ? "SoilSync soil sensor connected" : "No SoilSync sensor");
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("on", f_r1.has_microclime);
    \u0275\u0275property("title", f_r1.has_microclime ? "MicroClime weather station connected" : "No MicroClime station");
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function MemberResult_Conditional_1_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 7);
    \u0275\u0275repeaterCreate(1, MemberResult_Conditional_1_Conditional_12_For_2_Template, 12, 11, "li", null, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const r_r2 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275repeater(r_r2.farms);
  }
}
function MemberResult_Conditional_1_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1, "No farms registered on the member platform yet.");
    \u0275\u0275elementEnd();
  }
}
function MemberResult_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 3)(2, "span", 4);
    \u0275\u0275element(3, "vc-icon", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 6)(5, "strong");
    \u0275\u0275text(6, "Varsapradaya member");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8, "Member ID ");
    \u0275\u0275elementStart(9, "code");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(12, MemberResult_Conditional_1_Conditional_12_Template, 3, 0, "ul", 7)(13, MemberResult_Conditional_1_Conditional_13_Template, 2, 0, "p", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    const r_r2 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(r_r2.member_id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \xB7 ", ctx_r2.phone(r_r2.phone));
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r2.farms.length ? 12 : 13);
  }
}
function MemberResult_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "div", 3)(2, "span", 14);
    \u0275\u0275element(3, "vc-icon", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 6)(5, "strong");
    \u0275\u0275text(6, "Not a Varsapradaya member");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    const r_r2 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r2.phone(r_r2.phone), " isn\u2019t registered on the member platform. You can still add the farmer here.");
  }
}
function MemberResult_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "vc-icon", 16);
    \u0275\u0275text(2, "A farmer with this phone number is already registered. ");
    \u0275\u0275elementStart(3, "a", 17);
    \u0275\u0275text(4, "Open their record");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const r_r2 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(2, _c0, r_r2.existing_farmer_id));
  }
}
var MemberResult = class _MemberResult {
  result = input.required(
    ...ngDevMode ? [{ debugName: "result" }] : (
      /* istanbul ignore next */
      []
    )
  );
  currentId = input(
    null,
    ...ngDevMode ? [{ debugName: "currentId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  phone = formatPhone;
  static \u0275fac = function MemberResult_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MemberResult)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MemberResult, selectors: [["vc-member-result"]], inputs: { result: [1, "result"], currentId: [1, "currentId"] }, decls: 4, vars: 3, consts: [[1, "box", "ok"], [1, "box"], [1, "exists"], [1, "h"], [1, "seal"], ["name", "verified", 3, "size"], [1, "t"], [1, "farms"], [1, "none"], ["name", "tractor", 3, "size"], [1, "fn"], [1, "dev", 3, "title"], ["name", "droplets", 3, "size"], ["name", "thermometer", 3, "size"], [1, "seal", "muted"], ["name", "user", 3, "size"], ["name", "info", 3, "size"], [3, "routerLink"]], template: function MemberResult_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275declareLet(0);
      \u0275\u0275conditionalCreate(1, MemberResult_Conditional_1_Template, 14, 4, "div", 0)(2, MemberResult_Conditional_2_Template, 9, 2, "div", 1);
      \u0275\u0275conditionalCreate(3, MemberResult_Conditional_3_Template, 5, 4, "div", 2);
    }
    if (rf & 2) {
      const r_r4 = \u0275\u0275storeLet(ctx.result());
      \u0275\u0275advance();
      \u0275\u0275conditional(r_r4.is_member ? 1 : 2);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(r_r4.existing_farmer_id && r_r4.existing_farmer_id !== ctx.currentId() ? 3 : -1);
    }
  }, dependencies: [Icon, RouterLink], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.box[_ngcontent-%COMP%] {\n  border: 1px solid var(--%NS%border);\n  border-radius: 10px;\n  background: var(--%NS%surface-2);\n  padding: 12px 14px;\n}\n.box.ok[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      var(--%NS%forest-50),\n      #fff);\n  border-color: var(--%NS%forest-200);\n}\n.h[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n}\n.seal[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  background: var(--%NS%forest-600);\n  color: #fff;\n  flex: none;\n}\n.seal.muted[_ngcontent-%COMP%] {\n  background: var(--%NS%sand-200);\n  color: var(--%NS%stone-600);\n}\n.t[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n}\n.t[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 14px;\n}\n.t[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n}\ncode[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%stone-800);\n}\n.farms[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 12px 0 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.farms[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 10px;\n  background: #fff;\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n  font-size: 13px;\n  color: var(--%NS%stone-600);\n}\n.fn[_ngcontent-%COMP%] {\n  flex: 1;\n  color: var(--%NS%stone-900);\n}\n.fn[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n  font-size: 11px;\n}\n.dev[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  height: 22px;\n  padding: 0 7px;\n  border-radius: 5px;\n  font-size: 11.5px;\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-400);\n}\n.dev.on[_ngcontent-%COMP%] {\n  background: var(--%NS%sky-100);\n  color: var(--%NS%sky-600);\n}\n.none[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  font-size: 12.5px;\n  color: var(--%NS%text-3);\n}\n.exists[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 12px;\n  border-radius: 8px;\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%stone-800);\n  font-size: 13px;\n  border: 1px solid #f1dcae;\n}\n.exists[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%amber-600);\n}\n/*# sourceMappingURL=member-result.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MemberResult, [{
    type: Component,
    args: [{ selector: "vc-member-result", imports: [Icon, RouterLink], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @let r = result();
    @if (r.is_member) {
      <div class="box ok">
        <div class="h">
          <span class="seal"><vc-icon name="verified" [size]="18" /></span>
          <div class="t">
            <strong>Varsapradaya member</strong>
            <span>Member ID <code>{{ r.member_id }}</code> \xB7 {{ phone(r.phone) }}</span>
          </div>
        </div>
        @if (r.farms.length) {
          <ul class="farms">
            @for (f of r.farms; track f.external_farm_id) {
              <li>
                <vc-icon name="tractor" [size]="15" />
                <span class="fn">{{ f.name }} <code>{{ f.external_farm_id }}</code></span>
                <span class="dev" [class.on]="f.has_soilsync" [title]="f.has_soilsync ? 'SoilSync soil sensor connected' : 'No SoilSync sensor'">
                  <vc-icon name="droplets" [size]="13" />SoilSync</span>
                <span class="dev" [class.on]="f.has_microclime" [title]="f.has_microclime ? 'MicroClime weather station connected' : 'No MicroClime station'">
                  <vc-icon name="thermometer" [size]="13" />MicroClime</span>
              </li>
            }
          </ul>
        } @else { <p class="none">No farms registered on the member platform yet.</p> }
      </div>
    } @else {
      <div class="box">
        <div class="h">
          <span class="seal muted"><vc-icon name="user" [size]="18" /></span>
          <div class="t"><strong>Not a Varsapradaya member</strong><span>{{ phone(r.phone) }} isn\u2019t registered on the member platform. You can still add the farmer here.</span></div>
        </div>
      </div>
    }
    @if (r.existing_farmer_id && r.existing_farmer_id !== currentId()) {
      <div class="exists"><vc-icon name="info" [size]="15" />A farmer with this phone number is already registered.
        <a [routerLink]="['/app/farmers', r.existing_farmer_id]">Open their record</a></div>
    }
  `, styles: ["/* angular:styles/component:scss;eb8dc0798e79aba9;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\farmers\\member-result.ts */\n:host {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.box {\n  border: 1px solid var(--border);\n  border-radius: 10px;\n  background: var(--surface-2);\n  padding: 12px 14px;\n}\n.box.ok {\n  background:\n    linear-gradient(\n      180deg,\n      var(--forest-50),\n      #fff);\n  border-color: var(--forest-200);\n}\n.h {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n}\n.seal {\n  display: grid;\n  place-items: center;\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  background: var(--forest-600);\n  color: #fff;\n  flex: none;\n}\n.seal.muted {\n  background: var(--sand-200);\n  color: var(--stone-600);\n}\n.t {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n}\n.t strong {\n  font-size: 14px;\n}\n.t span {\n  font-size: 12.5px;\n  color: var(--text-2);\n}\ncode {\n  font-size: 12px;\n  color: var(--stone-800);\n}\n.farms {\n  list-style: none;\n  margin: 12px 0 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.farms li {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 10px;\n  background: #fff;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  font-size: 13px;\n  color: var(--stone-600);\n}\n.fn {\n  flex: 1;\n  color: var(--stone-900);\n}\n.fn code {\n  color: var(--text-3);\n  font-size: 11px;\n}\n.dev {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  height: 22px;\n  padding: 0 7px;\n  border-radius: 5px;\n  font-size: 11.5px;\n  background: var(--stone-100);\n  color: var(--stone-400);\n}\n.dev.on {\n  background: var(--sky-100);\n  color: var(--sky-600);\n}\n.none {\n  margin-top: 8px;\n  font-size: 12.5px;\n  color: var(--text-3);\n}\n.exists {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 12px;\n  border-radius: 8px;\n  background: var(--warn-soft);\n  color: var(--stone-800);\n  font-size: 13px;\n  border: 1px solid #f1dcae;\n}\n.exists vc-icon {\n  color: var(--amber-600);\n}\n/*# sourceMappingURL=member-result.css.map */\n"] }]
  }], null, { result: [{ type: Input, args: [{ isSignal: true, alias: "result", required: true }] }], currentId: [{ type: Input, args: [{ isSignal: true, alias: "currentId", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MemberResult, { className: "MemberResult", filePath: "src/app/features/farmers/member-result.ts", lineNumber: 69 });
})();

// src/app/features/farmers/farmer-detail.page.ts
var _c02 = (a0) => ["/app/fields", a0];
var _c1 = (a0) => ["/app/programmes/projects", a0];
var _forTrack02 = ($index, $item) => $item[0];
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.purpose;
var _forTrack3 = ($index, $item) => $item.key;
function FarmerDetailPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "vc-loading", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("rows", 6);
  }
}
function FarmerDetailPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 3);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r0.error());
  }
}
function FarmerDetailPage_Conditional_5_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275element(1, "vc-icon", 45);
    \u0275\u0275text(2, "Varsapradaya member");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const f_r3 = \u0275\u0275readContextLet(0);
    \u0275\u0275property("title", "Member ID " + f_r3.member_id);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function FarmerDetailPage_Conditional_5_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275element(1, "vc-icon", 46);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const o_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(o_r4.fpo.name);
  }
}
function FarmerDetailPage_Conditional_5_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 47);
    \u0275\u0275listener("click", function FarmerDetailPage_Conditional_5_Conditional_27_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.checkMember());
    });
    \u0275\u0275element(1, "vc-icon", 45);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r0.looking());
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.looking() ? "Checking\u2026" : "Check membership");
  }
}
function FarmerDetailPage_Conditional_5_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38);
    \u0275\u0275element(1, "vc-member-result", 48);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const f_r3 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275property("result", ctx)("currentId", f_r3.id);
  }
}
function FarmerDetailPage_Conditional_5_Case_63_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "vc-empty", 50)(2, "a", 51);
    \u0275\u0275element(3, "vc-icon", 52);
    \u0275\u0275text(4, "Open Fields & map");
    \u0275\u0275elementEnd()()();
  }
}
function FarmerDetailPage_Conditional_5_Case_63_Conditional_1_For_2_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 56);
    \u0275\u0275text(1, "Member farm ");
    \u0275\u0275elementStart(2, "code");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const farm_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(farm_r6.external_farm_id);
  }
}
function FarmerDetailPage_Conditional_5_Case_63_Conditional_1_For_2_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 57);
    \u0275\u0275text(1, "No fields mapped on this farm yet.");
    \u0275\u0275elementEnd();
  }
}
function FarmerDetailPage_Conditional_5_Case_63_Conditional_1_For_2_Conditional_9_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 60)(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 61);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td", 32);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275element(12, "vc-badge", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 32);
    \u0275\u0275element(14, "vc-icon", 62);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const fl_r7 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(6);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(10, _c02, fl_r7.id));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(fl_r7.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(fl_r7.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.cropName(fl_r7.crop_code));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", \u0275\u0275pipeBind2(10, 7, fl_r7.area_ha, 2), " ha");
    \u0275\u0275advance(3);
    \u0275\u0275property("status", fl_r7.status);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 15);
  }
}
function FarmerDetailPage_Conditional_5_Case_63_Conditional_1_For_2_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58)(1, "table", 59)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Field");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Crop");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th", 32);
    \u0275\u0275text(11, "Area");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "tbody");
    \u0275\u0275repeaterCreate(16, FarmerDetailPage_Conditional_5_Case_63_Conditional_1_For_2_Conditional_9_For_17_Template, 15, 12, "tr", 60, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const farm_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(16);
    \u0275\u0275repeater(farm_r6.fields);
  }
}
function FarmerDetailPage_Conditional_5_Case_63_Conditional_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2)(1, "div", 53);
    \u0275\u0275element(2, "vc-icon", 54);
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4);
    \u0275\u0275elementStart(5, "span", 55);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(7, FarmerDetailPage_Conditional_5_Case_63_Conditional_1_For_2_Conditional_7_Template, 4, 1, "span", 56);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, FarmerDetailPage_Conditional_5_Case_63_Conditional_1_For_2_Conditional_8_Template, 2, 0, "div", 57)(9, FarmerDetailPage_Conditional_5_Case_63_Conditional_1_For_2_Conditional_9_Template, 18, 0, "div", 58);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const farm_r6 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", farm_r6.name, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(farm_r6.village);
    \u0275\u0275advance();
    \u0275\u0275conditional(farm_r6.external_farm_id ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!farm_r6.fields.length ? 8 : 9);
  }
}
function FarmerDetailPage_Conditional_5_Case_63_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49);
    \u0275\u0275repeaterCreate(1, FarmerDetailPage_Conditional_5_Case_63_Conditional_1_For_2_Template, 10, 5, "section", 2, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const o_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(o_r4.farms);
  }
}
function FarmerDetailPage_Conditional_5_Case_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, FarmerDetailPage_Conditional_5_Case_63_Conditional_0_Template, 5, 0, "div", 2)(1, FarmerDetailPage_Conditional_5_Case_63_Conditional_1_Template, 3, 0, "div", 49);
  }
  if (rf & 2) {
    const o_r4 = \u0275\u0275nextContext();
    \u0275\u0275conditional(!o_r4.farms.length ? 0 : 1);
  }
}
function FarmerDetailPage_Conditional_5_Case_64_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 19);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function FarmerDetailPage_Conditional_5_Case_64_Conditional_8_For_2_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 55);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "day");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("since ", \u0275\u0275pipeBind1(2, 1, c_r8.effective_on));
  }
}
function FarmerDetailPage_Conditional_5_Case_64_Conditional_8_For_2_Conditional_12_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 73);
    \u0275\u0275listener("click", function FarmerDetailPage_Conditional_5_Case_64_Conditional_8_For_2_Conditional_12_Conditional_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const c_r8 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.askConsent(c_r8.purpose, false));
    });
    \u0275\u0275text(1, "Withdraw");
    \u0275\u0275elementEnd();
  }
}
function FarmerDetailPage_Conditional_5_Case_64_Conditional_8_For_2_Conditional_12_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 74);
    \u0275\u0275listener("click", function FarmerDetailPage_Conditional_5_Case_64_Conditional_8_For_2_Conditional_12_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const c_r8 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.askConsent(c_r8.purpose, true));
    });
    \u0275\u0275text(1, "Record consent");
    \u0275\u0275elementEnd();
  }
}
function FarmerDetailPage_Conditional_5_Case_64_Conditional_8_For_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, FarmerDetailPage_Conditional_5_Case_64_Conditional_8_For_2_Conditional_12_Conditional_0_Template, 2, 0, "button", 71)(1, FarmerDetailPage_Conditional_5_Case_64_Conditional_8_For_2_Conditional_12_Conditional_1_Template, 2, 0, "button", 72);
  }
  if (rf & 2) {
    const c_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional(c_r8.state === "granted" ? 0 : 1);
  }
}
function FarmerDetailPage_Conditional_5_Case_64_Conditional_8_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li")(1, "span", 66);
    \u0275\u0275element(2, "vc-icon", 67);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 68)(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 69)(9, "span", 70);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(11, FarmerDetailPage_Conditional_5_Case_64_Conditional_8_For_2_Conditional_11_Template, 3, 3, "span", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, FarmerDetailPage_Conditional_5_Case_64_Conditional_8_For_2_Conditional_12_Template, 2, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r8 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275classProp("on", c_r8.state === "granted")("off", c_r8.state === "withdrawn");
    \u0275\u0275advance();
    \u0275\u0275property("name", c_r8.state === "granted" ? "check" : c_r8.state === "withdrawn" ? "x" : "minus")("size", 13)("stroke", 2.4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.purpose(c_r8.purpose).label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.purpose(c_r8.purpose).text);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("okText", c_r8.state === "granted")("muted", c_r8.state !== "granted");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", c_r8.state === "granted" ? "Given" : c_r8.state === "withdrawn" ? "Withdrawn" : "Not given");
    \u0275\u0275advance();
    \u0275\u0275conditional(c_r8.effective_on ? 11 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.canManage ? 12 : -1);
  }
}
function FarmerDetailPage_Conditional_5_Case_64_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 63);
    \u0275\u0275repeaterCreate(1, FarmerDetailPage_Conditional_5_Case_64_Conditional_8_For_2_Template, 13, 16, "li", null, _forTrack2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.consents().current);
  }
}
function FarmerDetailPage_Conditional_5_Case_64_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44)(1, "section", 2)(2, "div", 53)(3, "h3");
    \u0275\u0275text(4, "Current consent");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 56);
    \u0275\u0275text(6, "One record per purpose. Changes take effect today.");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(7, FarmerDetailPage_Conditional_5_Case_64_Conditional_7_Template, 1, 1, "vc-loading", 19)(8, FarmerDetailPage_Conditional_5_Case_64_Conditional_8_Template, 3, 0, "ul", 63);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "section", 2)(10, "div", 53)(11, "h3");
    \u0275\u0275text(12, "History");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 64);
    \u0275\u0275element(14, "vc-timeline", 65);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(7);
    \u0275\u0275conditional(!ctx_r0.consents() ? 7 : 8);
    \u0275\u0275advance(7);
    \u0275\u0275property("items", ctx_r0.history());
  }
}
function FarmerDetailPage_Conditional_5_Case_65_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 77);
    \u0275\u0275listener("click", function FarmerDetailPage_Conditional_5_Case_65_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.openSign());
    });
    \u0275\u0275element(1, "vc-icon", 78);
    \u0275\u0275text(2, "Sign agreement");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function FarmerDetailPage_Conditional_5_Case_65_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 19);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 3);
  }
}
function FarmerDetailPage_Conditional_5_Case_65_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 80);
    \u0275\u0275listener("click", function FarmerDetailPage_Conditional_5_Case_65_Conditional_6_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r0.openSign());
    });
    \u0275\u0275element(1, "vc-icon", 22);
    \u0275\u0275text(2, "Sign agreement");
    \u0275\u0275elementEnd();
  }
}
function FarmerDetailPage_Conditional_5_Case_65_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 76);
    \u0275\u0275conditionalCreate(1, FarmerDetailPage_Conditional_5_Case_65_Conditional_6_Conditional_1_Template, 3, 0, "button", 79);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.canManage ? 1 : -1);
  }
}
function FarmerDetailPage_Conditional_5_Case_65_Conditional_7_For_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 32);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "td", 81);
    \u0275\u0275text(11);
    \u0275\u0275pipe(12, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td");
    \u0275\u0275element(14, "vc-hash", 11);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const a_r13 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.tplTitle(a_r13.template_id));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("v", a_r13.template_version);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.lang(a_r13.language));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.methodLabel(a_r13.method));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(12, 6, a_r13.signed_at, true));
    \u0275\u0275advance(3);
    \u0275\u0275property("value", a_r13.signed_text_sha256);
  }
}
function FarmerDetailPage_Conditional_5_Case_65_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58)(1, "table", 59)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Agreement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Version");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Language");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Method");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Signed");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Text fingerprint");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "tbody");
    \u0275\u0275repeaterCreate(17, FarmerDetailPage_Conditional_5_Case_65_Conditional_7_For_18_Template, 15, 9, "tr", null, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(17);
    \u0275\u0275repeater(ctx_r0.agreements());
  }
}
function FarmerDetailPage_Conditional_5_Case_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2)(1, "div", 53)(2, "h3");
    \u0275\u0275text(3, "Signed agreements");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, FarmerDetailPage_Conditional_5_Case_65_Conditional_4_Template, 3, 1, "button", 75);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, FarmerDetailPage_Conditional_5_Case_65_Conditional_5_Template, 1, 1, "vc-loading", 19)(6, FarmerDetailPage_Conditional_5_Case_65_Conditional_6_Template, 2, 1, "vc-empty", 76)(7, FarmerDetailPage_Conditional_5_Case_65_Conditional_7_Template, 19, 0, "div", 58);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r0.canManage ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.agreements() === null ? 5 : !ctx_r0.agreements().length ? 6 : 7);
  }
}
function FarmerDetailPage_Conditional_5_Case_66_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 82)(1, "a", 83);
    \u0275\u0275text(2, "Open programmes");
    \u0275\u0275elementEnd()();
  }
}
function FarmerDetailPage_Conditional_5_Case_66_Conditional_2_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "a", 84);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td")(5, "a", 84);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "td");
    \u0275\u0275element(8, "vc-badge", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "td");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "day");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const e_r14 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(8, _c1, e_r14.project_id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r14.project_code);
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(10, _c02, e_r14.field_id));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r14.field_code);
    \u0275\u0275advance(2);
    \u0275\u0275property("status", e_r14.status);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(11, 6, e_r14.enrolled_on));
  }
}
function FarmerDetailPage_Conditional_5_Case_66_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 58)(1, "table", 59)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Project");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Field");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Enrolled on");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "tbody");
    \u0275\u0275repeaterCreate(13, FarmerDetailPage_Conditional_5_Case_66_Conditional_2_For_14_Template, 12, 12, "tr", null, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const o_r4 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(13);
    \u0275\u0275repeater(o_r4.enrolments);
  }
}
function FarmerDetailPage_Conditional_5_Case_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 2);
    \u0275\u0275conditionalCreate(1, FarmerDetailPage_Conditional_5_Case_66_Conditional_1_Template, 3, 0, "vc-empty", 82)(2, FarmerDetailPage_Conditional_5_Case_66_Conditional_2_Template, 15, 0, "div", 58);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const o_r4 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(!o_r4.enrolments.length ? 1 : 2);
  }
}
function FarmerDetailPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275declareLet(0);
    \u0275\u0275elementStart(1, "section", 23)(2, "div", 24)(3, "span", 25);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 26)(6, "div", 27)(7, "h1");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, FarmerDetailPage_Conditional_5_Conditional_9_Template, 3, 2, "span", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 29)(11, "span", 30);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span");
    \u0275\u0275element(14, "vc-icon", 31);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 32);
    \u0275\u0275element(17, "vc-icon", 33);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span");
    \u0275\u0275element(20, "vc-icon", 34);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(22, FarmerDetailPage_Conditional_5_Conditional_22_Template, 3, 2, "span");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(23, "div", 35);
    \u0275\u0275element(24, "vc-badge", 36);
    \u0275\u0275elementStart(25, "vc-badge", 36);
    \u0275\u0275text(26);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(27, FarmerDetailPage_Conditional_5_Conditional_27_Template, 3, 3, "button", 37);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(28, FarmerDetailPage_Conditional_5_Conditional_28_Template, 2, 2, "div", 38);
    \u0275\u0275elementStart(29, "div", 39)(30, "div")(31, "span", 40);
    \u0275\u0275text(32);
    \u0275\u0275pipe(33, "num");
    \u0275\u0275elementStart(34, "small");
    \u0275\u0275text(35, "ha");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "span", 41);
    \u0275\u0275text(37, "Total field area ");
    \u0275\u0275element(38, "vc-dc", 42);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(39, "div")(40, "span", 40);
    \u0275\u0275text(41);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "span", 41);
    \u0275\u0275text(43);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(44, "div")(45, "span", 40);
    \u0275\u0275text(46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "span", 41);
    \u0275\u0275text(48, "Active enrolments");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(49, "div")(50, "span", 40);
    \u0275\u0275text(51);
    \u0275\u0275pipe(52, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "span", 41);
    \u0275\u0275text(54, "Practice records");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(55, "div")(56, "span", 40);
    \u0275\u0275text(57);
    \u0275\u0275elementStart(58, "small");
    \u0275\u0275text(59);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(60, "span", 41);
    \u0275\u0275text(61, "Consents given");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(62, "vc-tabs", 43);
    \u0275\u0275twoWayListener("activeChange", function FarmerDetailPage_Conditional_5_Template_vc_tabs_activeChange_62_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.tab, $event) || (ctx_r0.tab = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(63, FarmerDetailPage_Conditional_5_Case_63_Template, 2, 1)(64, FarmerDetailPage_Conditional_5_Case_64_Template, 15, 2, "div", 44)(65, FarmerDetailPage_Conditional_5_Case_65_Template, 8, 2, "section", 2)(66, FarmerDetailPage_Conditional_5_Case_66_Template, 3, 1, "section", 2);
  }
  if (rf & 2) {
    let tmp_18_0;
    let tmp_28_0;
    const o_r4 = ctx;
    const ctx_r0 = \u0275\u0275nextContext();
    const f_r15 = \u0275\u0275storeLet(o_r4.farmer);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.ini(f_r15.full_name));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(f_r15.full_name);
    \u0275\u0275advance();
    \u0275\u0275conditional(f_r15.member_id ? 9 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(f_r15.code);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", f_r15.village || "\u2014", "", f_r15.district ? ", " + f_r15.district : "");
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.phone(f_r15.phone));
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.lang(f_r15.language));
    \u0275\u0275advance();
    \u0275\u0275conditional(o_r4.fpo ? 22 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("status", f_r15.status);
    \u0275\u0275advance();
    \u0275\u0275property("status", ctx_r0.kycTone(f_r15.kyc_status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.kycLabel(f_r15.kyc_status));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.canManage && !f_r15.member_id ? 27 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_18_0 = ctx_r0.lookup()) ? 28 : -1, tmp_18_0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(33, 29, o_r4.total_area_ha, 2));
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r0.fieldCount());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("Fields on ", o_r4.farms.length, " farm", o_r4.farms.length === 1 ? "" : "s");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.enrolledCount());
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(52, 32, o_r4.practice_records, 0));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.grantedCount());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("of ", o_r4.consents.length);
    \u0275\u0275advance(3);
    \u0275\u0275property("tabs", ctx_r0.tabs());
    \u0275\u0275twoWayProperty("active", ctx_r0.tab);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_28_0 = ctx_r0.tab()) === "farms" ? 63 : tmp_28_0 === "consent" ? 64 : tmp_28_0 === "agreements" ? 65 : tmp_28_0 === "enrolments" ? 66 : -1);
  }
}
function FarmerDetailPage_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Record only what the farmer has agreed to in person or through a verified channel. ", ctx_r0.purpose(ctx_r0.cf.purpose).text);
  }
}
function FarmerDetailPage_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 7);
    \u0275\u0275text(1, "Withdrawing stops this use from today. For sampling or data use, the farmer\u2019s fields fail the consent check at their next enrolment decision.");
    \u0275\u0275elementEnd();
  }
}
function FarmerDetailPage_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r16 = ctx.$implicit;
    \u0275\u0275property("value", c_r16[0]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r16[1]);
  }
}
function FarmerDetailPage_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 19);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 4);
  }
}
function FarmerDetailPage_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "vc-empty", 20)(1, "a", 85);
    \u0275\u0275listener("click", function FarmerDetailPage_Conditional_29_Template_a_click_1_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.signOpen.set(false));
    });
    \u0275\u0275text(2, "Open agreements");
    \u0275\u0275elementEnd()();
  }
}
function FarmerDetailPage_Conditional_30_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r19 = ctx.$implicit;
    \u0275\u0275property("value", t_r19.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", t_r19.title, " \xB7 v", t_r19.version);
  }
}
function FarmerDetailPage_Conditional_30_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const l_r20 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("value", l_r20);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.lang(l_r20));
  }
}
function FarmerDetailPage_Conditional_30_Conditional_14_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 97);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r21 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.purpose(p_r21).label);
  }
}
function FarmerDetailPage_Conditional_30_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 95)(1, "span", 96);
    \u0275\u0275text(2, "Signing gives consent for");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, FarmerDetailPage_Conditional_30_Conditional_14_For_4_Template, 2, 1, "span", 97, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 98);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r22 = ctx;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(t_r22.purposes);
    \u0275\u0275advance(2);
    \u0275\u0275attribute("lang", ctx_r0.sf.language);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r22.body[ctx_r0.sf.language]);
  }
}
function FarmerDetailPage_Conditional_30_For_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 99);
    \u0275\u0275listener("click", function FarmerDetailPage_Conditional_30_For_20_Template_button_click_0_listener() {
      const m_r24 = \u0275\u0275restoreView(_r23).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.sf.method = m_r24.key);
    });
    \u0275\u0275element(1, "vc-icon", 100);
    \u0275\u0275elementStart(2, "span")(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const m_r24 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", ctx_r0.sf.method === m_r24.key);
    \u0275\u0275advance();
    \u0275\u0275property("name", m_r24.icon)("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(m_r24.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(m_r24.text);
  }
}
function FarmerDetailPage_Conditional_30_Conditional_21_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 103);
    \u0275\u0275text(1, "Development environment: use the demo code ");
    \u0275\u0275elementStart(2, "code");
    \u0275\u0275text(3, "123456");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, ".");
    \u0275\u0275elementEnd();
  }
}
function FarmerDetailPage_Conditional_30_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 93)(1, "label", 101);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 102);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function FarmerDetailPage_Conditional_30_Conditional_21_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r25);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.sf.otp, $event) || (ctx_r0.sf.otp = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, FarmerDetailPage_Conditional_30_Conditional_21_Conditional_4_Template, 5, 0, "span", 103);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Code sent to ", ctx_r0.phone(ctx_r0.ov()?.farmer?.phone ?? ""));
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.sf.otp);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.dev ? 4 : -1);
  }
}
function FarmerDetailPage_Conditional_30_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 94);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("message", ctx_r0.signError());
  }
}
function FarmerDetailPage_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5)(1, "div", 86)(2, "div", 8)(3, "label", 87);
    \u0275\u0275text(4, "Agreement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "select", 88);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FarmerDetailPage_Conditional_30_Template_select_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.pickTemplate($event));
    });
    \u0275\u0275repeaterCreate(6, FarmerDetailPage_Conditional_30_For_7_Template, 2, 3, "option", 11, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 8)(9, "label", 89);
    \u0275\u0275text(10, "Language");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "select", 90);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function FarmerDetailPage_Conditional_30_Template_select_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r0 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r0.sf.language, $event) || (ctx_r0.sf.language = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(12, FarmerDetailPage_Conditional_30_For_13_Template, 2, 2, "option", 11, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(14, FarmerDetailPage_Conditional_30_Conditional_14_Template, 7, 2);
    \u0275\u0275elementStart(15, "div", 8)(16, "label");
    \u0275\u0275text(17, "Signing method");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 91);
    \u0275\u0275repeaterCreate(19, FarmerDetailPage_Conditional_30_For_20_Template, 7, 6, "button", 92, _forTrack3);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(21, FarmerDetailPage_Conditional_30_Conditional_21_Template, 5, 3, "div", 93);
    \u0275\u0275conditionalCreate(22, FarmerDetailPage_Conditional_30_Conditional_22_Template, 1, 1, "vc-error", 94);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_7_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275property("ngModel", ctx_r0.sf.template_id);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.templates());
    \u0275\u0275advance(5);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.sf.language);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.tplLangs());
    \u0275\u0275advance(2);
    \u0275\u0275conditional((tmp_7_0 = ctx_r0.tpl()) ? 14 : -1, tmp_7_0);
    \u0275\u0275advance(5);
    \u0275\u0275repeater(ctx_r0.methods);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.sf.method === "otp" ? 21 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.signError() ? 22 : -1);
  }
}
var FarmerDetailPage = class _FarmerDetailPage {
  id = input.required(
    ...ngDevMode ? [{ debugName: "id" }] : (
      /* istanbul ignore next */
      []
    )
  );
  api = inject(ApiService);
  toast = inject(ToastService);
  canManage = inject(AuthService).can("farmers.manage");
  dev = isDevMode();
  ini = initials;
  phone = formatPhone;
  channels = Object.entries(CHANNELS);
  methods = [
    { key: "otp", label: "SMS code", text: "Farmer reads back a one-time code", icon: "message" },
    { key: "assisted", label: "Assisted", text: "Signed in front of you as witness", icon: "users" },
    { key: "esign", label: "e-Sign", text: "Aadhaar-based electronic signature", icon: "fingerprint" }
  ];
  ov = signal(
    null,
    ...ngDevMode ? [{ debugName: "ov" }] : (
      /* istanbul ignore next */
      []
    )
  );
  loading = signal(
    true,
    ...ngDevMode ? [{ debugName: "loading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  error = signal(
    null,
    ...ngDevMode ? [{ debugName: "error" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tab = signal(
    "farms",
    ...ngDevMode ? [{ debugName: "tab" }] : (
      /* istanbul ignore next */
      []
    )
  );
  consents = signal(
    null,
    ...ngDevMode ? [{ debugName: "consents" }] : (
      /* istanbul ignore next */
      []
    )
  );
  agreements = signal(
    null,
    ...ngDevMode ? [{ debugName: "agreements" }] : (
      /* istanbul ignore next */
      []
    )
  );
  templates = signal(
    null,
    ...ngDevMode ? [{ debugName: "templates" }] : (
      /* istanbul ignore next */
      []
    )
  );
  allTemplates = signal(
    [],
    ...ngDevMode ? [{ debugName: "allTemplates" }] : (
      /* istanbul ignore next */
      []
    )
  );
  crops = signal(
    [],
    ...ngDevMode ? [{ debugName: "crops" }] : (
      /* istanbul ignore next */
      []
    )
  );
  looking = signal(
    false,
    ...ngDevMode ? [{ debugName: "looking" }] : (
      /* istanbul ignore next */
      []
    )
  );
  lookup = signal(
    null,
    ...ngDevMode ? [{ debugName: "lookup" }] : (
      /* istanbul ignore next */
      []
    )
  );
  busy = signal(
    false,
    ...ngDevMode ? [{ debugName: "busy" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fieldCount = computed(
    () => this.ov()?.farms.reduce((a, f) => a + f.fields.length, 0) ?? 0,
    ...ngDevMode ? [{ debugName: "fieldCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  enrolledCount = computed(
    () => this.ov()?.enrolments.filter((e) => e.status === "enrolled").length ?? 0,
    ...ngDevMode ? [{ debugName: "enrolledCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  grantedCount = computed(
    () => this.ov()?.consents.filter((c) => c.state === "granted").length ?? 0,
    ...ngDevMode ? [{ debugName: "grantedCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tabs = computed(
    () => [
      { key: "farms", label: "Farms & fields", count: this.fieldCount() },
      { key: "consent", label: "Consent" },
      { key: "agreements", label: "Agreements", count: this.agreements()?.length ?? null },
      { key: "enrolments", label: "Enrolments", count: this.ov()?.enrolments.length ?? null }
    ],
    ...ngDevMode ? [{ debugName: "tabs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  history = computed(
    () => (this.consents()?.history ?? []).map((h) => ({
      title: `${h.granted ? "Consent given" : "Consent withdrawn"} \xB7 ${this.purpose(h.purpose).label}`,
      at: new Date(h.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      by: `${CHANNELS[h.channel] ?? h.channel}${h.agreement_id ? " \xB7 with signed agreement" : ""}`,
      note: h.notes || null,
      tone: h.granted ? "ok" : "danger"
    })),
    ...ngDevMode ? [{ debugName: "history" }] : (
      /* istanbul ignore next */
      []
    )
  );
  cf = { purpose: "sampling", granted: true, channel: "field_officer", notes: "" };
  consentOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "consentOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  signOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "signOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  signError = signal(
    null,
    ...ngDevMode ? [{ debugName: "signError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  sf = { template_id: "", language: "kn", method: "assisted", otp: "" };
  tpl = signal(
    null,
    ...ngDevMode ? [{ debugName: "tpl" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tplLangs = computed(
    () => Object.keys(this.tpl()?.body ?? {}),
    ...ngDevMode ? [{ debugName: "tplLangs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  ngOnInit() {
    this.load();
    this.loadConsents();
    this.loadAgreements();
    this.api.get("/agreement-templates").pipe(catchError(() => of([]))).subscribe((t) => this.allTemplates.set(t));
    this.api.get("/catalogue/crops").pipe(catchError(() => of([]))).subscribe((c) => this.crops.set(c));
  }
  cropName(c) {
    return c ? this.crops().find((x) => x.code === c)?.name ?? c : "\u2014";
  }
  lang(c) {
    return LANGUAGES[c] ?? c.toUpperCase();
  }
  purpose(p) {
    return PURPOSES[p] ?? { label: p.replace(/_/g, " "), text: "" };
  }
  kycTone(s) {
    return { verified: "verified", pending: "pending", failed: "failed" }[s] ?? "draft";
  }
  kycLabel(s) {
    return { verified: "KYC verified", pending: "KYC pending", failed: "KYC failed" }[s] ?? "KYC not started";
  }
  methodLabel(m) {
    return this.methods.find((x) => x.key === m)?.label ?? m;
  }
  tplTitle(id) {
    return this.allTemplates().find((t) => t.id === id)?.title ?? "Agreement";
  }
  load() {
    this.api.get(`/farmers/${this.id()}/overview`).subscribe({
      next: (o) => {
        this.ov.set(o);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  loadConsents() {
    this.api.get(`/farmers/${this.id()}/consents`).pipe(catchError(() => of(null))).subscribe((c) => this.consents.set(c));
  }
  loadAgreements() {
    this.api.get(`/farmers/${this.id()}/agreements`).pipe(catchError(() => of([]))).subscribe((a) => this.agreements.set(a));
  }
  checkMember() {
    const f = this.ov()?.farmer;
    if (!f)
      return;
    this.looking.set(true);
    this.api.post("/farmers/member-lookup", { phone: f.phone }).subscribe({
      next: (r) => {
        if (!r.is_member) {
          this.looking.set(false);
          this.lookup.set(r);
          return;
        }
        this.api.post("/farmers/member-lookup", { phone: f.phone, farmer_id: f.id }).subscribe({
          next: (linked) => {
            this.looking.set(false);
            this.lookup.set(linked);
            this.toast.success("Membership linked", `${f.full_name} is Varsapradaya member ${linked.member_id}.`);
            this.load();
          },
          error: (e) => {
            this.looking.set(false);
            this.lookup.set(r);
            this.toast.apiError(e, "Couldn't link membership");
          }
        });
      },
      error: (e) => {
        this.looking.set(false);
        this.toast.apiError(e, "Couldn't check membership");
      }
    });
  }
  askConsent(purpose, granted) {
    this.cf = { purpose, granted, channel: "field_officer", notes: "" };
    this.consentOpen.set(true);
  }
  saveConsent() {
    this.busy.set(true);
    this.api.post(`/farmers/${this.id()}/consents`, {
      purpose: this.cf.purpose,
      granted: this.cf.granted,
      channel: this.cf.channel,
      notes: this.cf.notes.trim()
    }).subscribe({
      next: () => {
        this.busy.set(false);
        this.consentOpen.set(false);
        this.toast.success(this.cf.granted ? "Consent recorded" : "Consent withdrawn", this.purpose(this.cf.purpose).label);
        this.loadConsents();
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.apiError(e, "Couldn't save consent");
      }
    });
  }
  openSign() {
    this.signError.set(null);
    this.sf = { template_id: "", language: this.ov()?.farmer.language ?? "kn", method: "assisted", otp: "" };
    this.tpl.set(null);
    this.templates.set(null);
    this.signOpen.set(true);
    this.api.get("/agreement-templates", { status: "published" }).pipe(catchError(() => of([]))).subscribe((t) => {
      this.templates.set(t);
      if (t.length)
        this.pickTemplate(t[0].id);
    });
  }
  pickTemplate(id) {
    const t = this.templates()?.find((x) => x.id === id) ?? null;
    this.sf.template_id = id;
    this.tpl.set(t);
    if (t && !(this.sf.language in t.body))
      this.sf.language = Object.keys(t.body)[0];
  }
  sign() {
    this.busy.set(true);
    this.signError.set(null);
    this.api.post(`/farmers/${this.id()}/agreements`, {
      template_id: this.sf.template_id,
      language: this.sf.language,
      method: this.sf.method,
      otp_code: this.sf.method === "otp" ? this.sf.otp : null
    }).subscribe({
      next: () => {
        this.busy.set(false);
        this.signOpen.set(false);
        this.toast.success("Agreement signed", `${this.tpl()?.title} \xB7 consent recorded for ${this.tpl()?.purposes.length} purposes.`);
        this.loadAgreements();
        this.loadConsents();
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.signError.set(e.message);
      }
    });
  }
  static \u0275fac = function FarmerDetailPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FarmerDetailPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FarmerDetailPage, selectors: [["vc-farmer-detail"]], inputs: { id: [1, "id"] }, decls: 37, vars: 18, consts: [["routerLink", "/app/farmers", 1, "back"], ["name", "arrow-left", 3, "size"], [1, "card"], ["title", "Couldn't load this farmer", 3, "message"], ["width", "500px", 3, "openChange", "open", "title", "subtitle"], [1, "stack", 2, "--gap", "14px"], [1, "muted"], ["tone", "warn", "icon", "alert"], [1, "field"], ["for", "cch"], ["id", "cch", 1, "input", 3, "ngModelChange", "ngModel"], [3, "value"], ["for", "cnt"], [1, "subtle"], ["id", "cnt", "rows", "3", "placeholder", "For example: explained in Kannada at the village meeting, 12 Sept.", 1, "input", 3, "ngModelChange", "ngModel"], ["footer", ""], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", 3, "click", "disabled"], ["width", "720px", "title", "Sign agreement", "subtitle", "The farmer signs the exact text shown here. A fingerprint of it is stored with the signature.", 3, "openChange", "open"], [3, "rows"], ["icon", "file", "title", "No published agreements", "text", "Publish an agreement template first under Agreements & consent."], [1, "btn", "btn-primary", 3, "click", "disabled"], ["name", "pencil"], [1, "hero", "card"], [1, "id"], [1, "av"], [1, "nm"], [1, "row", 2, "--gap", "10px"], [1, "member", 3, "title"], [1, "meta"], [1, "mono"], ["name", "pin", 3, "size"], [1, "num"], ["name", "message", 3, "size"], ["name", "globe", 3, "size"], [1, "acts"], [3, "status"], [1, "btn", "btn-secondary", "btn-sm", 3, "disabled"], [1, "lk"], [1, "facts"], [1, "v", "num"], [1, "l"], ["cls", "CALCULATED"], [3, "activeChange", "tabs", "active"], [1, "consent-grid"], ["name", "verified", 3, "size"], ["name", "building", 3, "size"], [1, "btn", "btn-secondary", "btn-sm", 3, "click", "disabled"], [3, "result", "currentId"], [1, "stack"], ["icon", "tractor", "title", "No farms yet", "text", "Farms and field boundaries are added under Fields & map, or synced from the Varsapradaya member platform."], ["routerLink", "/app/fields", 1, "btn", "btn-secondary"], ["name", "map"], [1, "card-head"], ["name", "tractor", 1, "subtle", 3, "size"], [1, "subtle", "small"], [1, "small", "subtle"], [1, "card-body", "muted", "small"], [1, "table-wrap"], [1, "table"], [1, "clickable", 3, "routerLink"], [1, "mono", "small"], ["name", "chevron-right", 1, "subtle", 3, "size"], [1, "purposes"], [1, "card-body"], [3, "items"], [1, "st"], [3, "name", "size", "stroke"], [1, "pt"], [1, "pstate"], [1, "small"], [1, "btn", "btn-ghost", "btn-sm"], [1, "btn", "btn-secondary", "btn-sm"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], [1, "btn", "btn-primary", "btn-sm"], ["icon", "handshake", "title", "No agreements signed yet", "text", "Signing a published agreement records the farmer\u2019s consent for each purpose it covers, with a fingerprint of the exact text they saw."], [1, "btn", "btn-primary", "btn-sm", 3, "click"], ["name", "pencil", 3, "size"], [1, "btn", "btn-primary"], [1, "btn", "btn-primary", 3, "click"], [1, "nowrap"], ["icon", "briefcase", "title", "Not enrolled in any project", "text", "Enrol this farmer\u2019s fields from a project page. Each field is checked for eligibility first."], ["routerLink", "/app/programmes", 1, "btn", "btn-secondary"], [1, "mono", 3, "routerLink"], ["routerLink", "/app/agreements", 1, "btn", "btn-secondary", 3, "click"], [1, "form-grid"], ["for", "stp"], ["id", "stp", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "slg"], ["id", "slg", 1, "input", 3, "ngModelChange", "ngModel"], [1, "methods"], ["type", "button", 1, "mopt", 3, "on"], [1, "field", "otp"], ["title", "Couldn't record the signature", 3, "message"], [1, "covers"], [1, "small", "muted"], [1, "chip"], [1, "preview"], ["type", "button", 1, "mopt", 3, "click"], [3, "name", "size"], ["for", "sotp"], ["id", "sotp", "inputmode", "numeric", "maxlength", "6", "placeholder", "\u2022\u2022\u2022\u2022\u2022\u2022", 1, "input", "code", 3, "ngModelChange", "ngModel"], [1, "hint"]], template: function FarmerDetailPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "a", 0);
      \u0275\u0275element(1, "vc-icon", 1);
      \u0275\u0275text(2, "All farmers");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, FarmerDetailPage_Conditional_3_Template, 2, 1, "div", 2)(4, FarmerDetailPage_Conditional_4_Template, 1, 1, "vc-error", 3)(5, FarmerDetailPage_Conditional_5_Template, 67, 35);
      \u0275\u0275elementStart(6, "vc-modal", 4);
      \u0275\u0275twoWayListener("openChange", function FarmerDetailPage_Template_vc_modal_openChange_6_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.consentOpen, $event) || (ctx.consentOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(7, "div", 5);
      \u0275\u0275conditionalCreate(8, FarmerDetailPage_Conditional_8_Template, 2, 1, "p", 6)(9, FarmerDetailPage_Conditional_9_Template, 2, 0, "vc-callout", 7);
      \u0275\u0275elementStart(10, "div", 8)(11, "label", 9);
      \u0275\u0275text(12, "How was this given?");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "select", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FarmerDetailPage_Template_select_ngModelChange_13_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.cf.channel, $event) || (ctx.cf.channel = $event);
        return $event;
      });
      \u0275\u0275repeaterCreate(14, FarmerDetailPage_For_15_Template, 2, 2, "option", 11, _forTrack02);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "div", 8)(17, "label", 12);
      \u0275\u0275text(18, "Notes ");
      \u0275\u0275elementStart(19, "span", 13);
      \u0275\u0275text(20, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "textarea", 14);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FarmerDetailPage_Template_textarea_ngModelChange_21_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.cf.notes, $event) || (ctx.cf.notes = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementContainerStart(22, 15);
      \u0275\u0275elementStart(23, "button", 16);
      \u0275\u0275listener("click", function FarmerDetailPage_Template_button_click_23_listener() {
        return ctx.consentOpen.set(false);
      });
      \u0275\u0275text(24, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "button", 17);
      \u0275\u0275listener("click", function FarmerDetailPage_Template_button_click_25_listener() {
        return ctx.saveConsent();
      });
      \u0275\u0275text(26);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "vc-modal", 18);
      \u0275\u0275twoWayListener("openChange", function FarmerDetailPage_Template_vc_modal_openChange_27_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.signOpen, $event) || (ctx.signOpen = $event);
        return $event;
      });
      \u0275\u0275conditionalCreate(28, FarmerDetailPage_Conditional_28_Template, 1, 1, "vc-loading", 19)(29, FarmerDetailPage_Conditional_29_Template, 3, 0, "vc-empty", 20)(30, FarmerDetailPage_Conditional_30_Template, 23, 5, "div", 5);
      \u0275\u0275elementContainerStart(31, 15);
      \u0275\u0275elementStart(32, "button", 16);
      \u0275\u0275listener("click", function FarmerDetailPage_Template_button_click_32_listener() {
        return ctx.signOpen.set(false);
      });
      \u0275\u0275text(33, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "button", 21);
      \u0275\u0275listener("click", function FarmerDetailPage_Template_button_click_34_listener() {
        return ctx.sign();
      });
      \u0275\u0275element(35, "vc-icon", 22);
      \u0275\u0275text(36);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_1_0;
      \u0275\u0275advance();
      \u0275\u0275property("size", 15);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 3 : ctx.error() ? 4 : (tmp_1_0 = ctx.ov()) ? 5 : -1, tmp_1_0);
      \u0275\u0275advance(3);
      \u0275\u0275twoWayProperty("open", ctx.consentOpen);
      \u0275\u0275property("title", ctx.cf.granted ? "Record consent" : "Withdraw consent")("subtitle", ctx.purpose(ctx.cf.purpose).label);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.cf.granted ? 8 : 9);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.cf.channel);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.channels);
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.cf.notes);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275classProp("btn-primary", ctx.cf.granted)("btn-danger", !ctx.cf.granted);
      \u0275\u0275property("disabled", ctx.busy());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.busy() ? "Saving\u2026" : ctx.cf.granted ? "Record consent" : "Withdraw consent");
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.signOpen);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.templates() === null ? 28 : !ctx.templates().length ? 29 : 30);
      \u0275\u0275advance(6);
      \u0275\u0275property("disabled", ctx.busy() || !ctx.tpl() || ctx.sf.method === "otp" && ctx.sf.otp.length < 6);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.busy() ? "Signing\u2026" : "Record signature");
    }
  }, dependencies: [
    FormsModule,
    NgSelectOption,
    \u0275NgSelectMultipleOption,
    DefaultValueAccessor,
    SelectControlValueAccessor,
    NgControlStatus,
    MaxLengthValidator,
    NgModel,
    RouterLink,
    Loading,
    ErrorBox,
    Empty,
    Badge,
    Modal,
    Tabs,
    Icon,
    Timeline,
    Hash,
    Callout,
    DataClass,
    MemberResult,
    NumPipe,
    DayPipe
  ], styles: ["\n.back[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  color: var(--%NS%text-2);\n  margin-bottom: 14px;\n}\n.back[_ngcontent-%COMP%]:hover {\n  color: var(--%NS%forest-700);\n  text-decoration: none;\n}\n.hero[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n  overflow: hidden;\n}\n.id[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  align-items: center;\n  padding: 20px 22px;\n  flex-wrap: wrap;\n}\n.av[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 56px;\n  height: 56px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      135deg,\n      var(--%NS%forest-600),\n      var(--%NS%forest-800));\n  color: #fff;\n  font-size: 19px;\n  font-weight: 600;\n  flex: none;\n}\n.nm[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 260px;\n}\n.meta[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px 16px;\n  margin-top: 6px;\n  font-size: 13px;\n  color: var(--%NS%text-2);\n}\n.meta[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n}\n.meta[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n}\n.member[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  height: 24px;\n  padding: 0 10px;\n  border-radius: 999px;\n  background: var(--%NS%forest-600);\n  color: #fff;\n  font-size: 12px;\n  font-weight: 500;\n}\n.acts[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.lk[_ngcontent-%COMP%] {\n  padding: 0 22px 16px;\n}\n.facts[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(5, 1fr);\n  border-top: 1px solid var(--%NS%border);\n  background: var(--%NS%surface-2);\n}\n.facts[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  padding: 14px 22px;\n}\n.facts[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]    + div[_ngcontent-%COMP%] {\n  border-left: 1px solid var(--%NS%border);\n}\n@media (max-width: 1100px) {\n  .facts[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(3, 1fr);\n  }\n  .facts[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%]:nth-child(4) {\n    border-left: 0;\n  }\n}\n.v[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n.v[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--%NS%text-3);\n  margin-left: 4px;\n}\n.l[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.consent-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);\n  gap: 16px;\n  align-items: start;\n}\n@media (max-width: 1100px) {\n  .consent-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.purposes[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.purposes[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 24px 1fr 120px 130px;\n  gap: 12px;\n  align-items: center;\n  padding: 14px 20px;\n  border-bottom: 1px solid var(--%NS%stone-100);\n}\n.purposes[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.purposes[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  justify-self: end;\n}\n.st[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-500);\n}\n.st.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-700);\n}\n.st.off[_ngcontent-%COMP%] {\n  background: var(--%NS%red-100);\n  color: var(--%NS%red-600);\n}\n.pt[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n}\n.pt[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n  margin-top: 1px;\n}\n.pstate[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.okText[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-700);\n  font-weight: 500;\n}\n.covers[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  align-items: center;\n}\n.chip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  height: 22px;\n  padding: 0 8px;\n  border-radius: 5px;\n  background: var(--%NS%forest-50);\n  border: 1px solid var(--%NS%forest-100);\n  font-size: 12px;\n  color: var(--%NS%forest-800);\n}\n.preview[_ngcontent-%COMP%] {\n  max-height: 240px;\n  overflow: auto;\n  padding: 14px 16px;\n  border-radius: 8px;\n  border: 1px solid var(--%NS%border);\n  background: var(--%NS%surface-2);\n  white-space: pre-wrap;\n  font-size: 13.5px;\n  line-height: 1.65;\n  color: var(--%NS%stone-800);\n}\n.methods[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n}\n@media (max-width: 720px) {\n  .methods[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.mopt[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 10px 12px;\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n  background: var(--%NS%surface);\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n  color: var(--%NS%stone-600);\n}\n.mopt[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%stone-400);\n}\n.mopt.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n  color: var(--%NS%forest-700);\n  box-shadow: inset 0 0 0 1px var(--%NS%forest-500);\n}\n.mopt[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.mopt[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--%NS%stone-900);\n}\n.mopt[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-2);\n}\n.code[_ngcontent-%COMP%] {\n  font: 500 20px var(--%NS%mono);\n  letter-spacing: 0.4em;\n  height: 46px;\n  max-width: 220px;\n}\n/*# sourceMappingURL=farmer-detail.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FarmerDetailPage, [{
    type: Component,
    args: [{ selector: "vc-farmer-detail", imports: [
      FormsModule,
      RouterLink,
      Loading,
      ErrorBox,
      Empty,
      Badge,
      Modal,
      Tabs,
      Icon,
      Timeline,
      Hash,
      Callout,
      DataClass,
      MemberResult,
      NumPipe,
      DayPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <a class="back" routerLink="/app/farmers"><vc-icon name="arrow-left" [size]="15" />All farmers</a>

    @if (loading()) {
      <div class="card"><vc-loading [rows]="6" /></div>
    } @else if (error()) {
      <vc-error title="Couldn't load this farmer" [message]="error()!" />
    } @else if (ov(); as o) {
      @let f = o.farmer;
      <section class="hero card">
        <div class="id">
          <span class="av">{{ ini(f.full_name) }}</span>
          <div class="nm">
            <div class="row" style="--gap:10px">
              <h1>{{ f.full_name }}</h1>
              @if (f.member_id) { <span class="member" [title]="'Member ID ' + f.member_id"><vc-icon name="verified" [size]="14" />Varsapradaya member</span> }
            </div>
            <div class="meta">
              <span class="mono">{{ f.code }}</span>
              <span><vc-icon name="pin" [size]="13" />{{ f.village || '\u2014' }}{{ f.district ? ', ' + f.district : '' }}</span>
              <span class="num"><vc-icon name="message" [size]="13" />{{ phone(f.phone) }}</span>
              <span><vc-icon name="globe" [size]="13" />{{ lang(f.language) }}</span>
              @if (o.fpo) { <span><vc-icon name="building" [size]="13" />{{ o.fpo.name }}</span> }
            </div>
          </div>
          <div class="acts">
            <vc-badge [status]="f.status" />
            <vc-badge [status]="kycTone(f.kyc_status)">{{ kycLabel(f.kyc_status) }}</vc-badge>
            @if (canManage && !f.member_id) {
              <button class="btn btn-secondary btn-sm" (click)="checkMember()" [disabled]="looking()"><vc-icon name="verified" [size]="14" />{{ looking() ? 'Checking\u2026' : 'Check membership' }}</button>
            }
          </div>
        </div>
        @if (lookup(); as r) { <div class="lk"><vc-member-result [result]="r" [currentId]="f.id" /></div> }
        <div class="facts">
          <div><span class="v num">{{ o.total_area_ha | num: 2 }}<small>ha</small></span><span class="l">Total field area <vc-dc cls="CALCULATED" /></span></div>
          <div><span class="v num">{{ fieldCount() }}</span><span class="l">Fields on {{ o.farms.length }} farm{{ o.farms.length === 1 ? '' : 's' }}</span></div>
          <div><span class="v num">{{ enrolledCount() }}</span><span class="l">Active enrolments</span></div>
          <div><span class="v num">{{ o.practice_records | num: 0 }}</span><span class="l">Practice records</span></div>
          <div><span class="v num">{{ grantedCount() }}<small>of {{ o.consents.length }}</small></span><span class="l">Consents given</span></div>
        </div>
      </section>

      <vc-tabs [tabs]="tabs()" [(active)]="tab" />

      @switch (tab()) {
        @case ('farms') {
          @if (!o.farms.length) {
            <div class="card"><vc-empty icon="tractor" title="No farms yet" text="Farms and field boundaries are added under Fields & map, or synced from the Varsapradaya member platform.">
              <a class="btn btn-secondary" routerLink="/app/fields"><vc-icon name="map" />Open Fields & map</a></vc-empty></div>
          } @else {
            <div class="stack">
              @for (farm of o.farms; track farm.id) {
                <section class="card">
                  <div class="card-head">
                    <vc-icon name="tractor" [size]="16" class="subtle" />
                    <h3>{{ farm.name }} <span class="subtle small">{{ farm.village }}</span></h3>
                    @if (farm.external_farm_id) { <span class="small subtle">Member farm <code>{{ farm.external_farm_id }}</code></span> }
                  </div>
                  @if (!farm.fields.length) {
                    <div class="card-body muted small">No fields mapped on this farm yet.</div>
                  } @else {
                    <div class="table-wrap">
                      <table class="table">
                        <thead><tr><th>Field</th><th>Code</th><th>Crop</th><th class="num">Area</th><th>Status</th><th></th></tr></thead>
                        <tbody>
                          @for (fl of farm.fields; track fl.id) {
                            <tr class="clickable" [routerLink]="['/app/fields', fl.id]">
                              <td><strong>{{ fl.name }}</strong></td>
                              <td class="mono small">{{ fl.code }}</td>
                              <td>{{ cropName(fl.crop_code) }}</td>
                              <td class="num">{{ fl.area_ha | num: 2 }} ha</td>
                              <td><vc-badge [status]="fl.status" /></td>
                              <td class="num"><vc-icon name="chevron-right" [size]="15" class="subtle" /></td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  }
                </section>
              }
            </div>
          }
        }
        @case ('consent') {
          <div class="consent-grid">
            <section class="card">
              <div class="card-head"><h3>Current consent</h3><span class="small subtle">One record per purpose. Changes take effect today.</span></div>
              @if (!consents()) { <vc-loading [rows]="5" /> }
              @else {
                <ul class="purposes">
                  @for (c of consents()!.current; track c.purpose) {
                    <li>
                      <span class="st" [class.on]="c.state === 'granted'" [class.off]="c.state === 'withdrawn'">
                        <vc-icon [name]="c.state === 'granted' ? 'check' : c.state === 'withdrawn' ? 'x' : 'minus'" [size]="13" [stroke]="2.4" />
                      </span>
                      <div class="pt">
                        <strong>{{ purpose(c.purpose).label }}</strong>
                        <p>{{ purpose(c.purpose).text }}</p>
                      </div>
                      <div class="pstate">
                        <span class="small" [class.okText]="c.state === 'granted'" [class.muted]="c.state !== 'granted'">
                          {{ c.state === 'granted' ? 'Given' : c.state === 'withdrawn' ? 'Withdrawn' : 'Not given' }}</span>
                        @if (c.effective_on) { <span class="subtle small">since {{ c.effective_on | day }}</span> }
                      </div>
                      @if (canManage) {
                        @if (c.state === 'granted') {
                          <button class="btn btn-ghost btn-sm" (click)="askConsent(c.purpose, false)">Withdraw</button>
                        } @else {
                          <button class="btn btn-secondary btn-sm" (click)="askConsent(c.purpose, true)">Record consent</button>
                        }
                      }
                    </li>
                  }
                </ul>
              }
            </section>
            <section class="card">
              <div class="card-head"><h3>History</h3></div>
              <div class="card-body"><vc-timeline [items]="history()" /></div>
            </section>
          </div>
        }
        @case ('agreements') {
          <section class="card">
            <div class="card-head">
              <h3>Signed agreements</h3>
              @if (canManage) { <button class="btn btn-primary btn-sm" (click)="openSign()"><vc-icon name="pencil" [size]="14" />Sign agreement</button> }
            </div>
            @if (agreements() === null) { <vc-loading [rows]="3" /> }
            @else if (!agreements()!.length) {
              <vc-empty icon="handshake" title="No agreements signed yet"
                text="Signing a published agreement records the farmer\u2019s consent for each purpose it covers, with a fingerprint of the exact text they saw.">
                @if (canManage) { <button class="btn btn-primary" (click)="openSign()"><vc-icon name="pencil" />Sign agreement</button> }
              </vc-empty>
            } @else {
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Agreement</th><th>Version</th><th>Language</th><th>Method</th><th>Signed</th><th>Text fingerprint</th></tr></thead>
                  <tbody>
                    @for (a of agreements(); track a.id) {
                      <tr>
                        <td><strong>{{ tplTitle(a.template_id) }}</strong></td>
                        <td class="num">v{{ a.template_version }}</td>
                        <td>{{ lang(a.language) }}</td>
                        <td>{{ methodLabel(a.method) }}</td>
                        <td class="nowrap">{{ a.signed_at | day: true }}</td>
                        <td><vc-hash [value]="a.signed_text_sha256" /></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </section>
        }
        @case ('enrolments') {
          <section class="card">
            @if (!o.enrolments.length) {
              <vc-empty icon="briefcase" title="Not enrolled in any project" text="Enrol this farmer\u2019s fields from a project page. Each field is checked for eligibility first." >
                <a class="btn btn-secondary" routerLink="/app/programmes">Open programmes</a></vc-empty>
            } @else {
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Project</th><th>Field</th><th>Status</th><th>Enrolled on</th></tr></thead>
                  <tbody>
                    @for (e of o.enrolments; track e.id) {
                      <tr>
                        <td><a class="mono" [routerLink]="['/app/programmes/projects', e.project_id]">{{ e.project_code }}</a></td>
                        <td><a class="mono" [routerLink]="['/app/fields', e.field_id]">{{ e.field_code }}</a></td>
                        <td><vc-badge [status]="e.status" /></td>
                        <td>{{ e.enrolled_on | day }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </section>
        }
      }
    }

    <!-- consent change -->
    <vc-modal [(open)]="consentOpen" width="500px" [title]="cf.granted ? 'Record consent' : 'Withdraw consent'"
      [subtitle]="purpose(cf.purpose).label">
      <div class="stack" style="--gap:14px">
        @if (cf.granted) {
          <p class="muted">Record only what the farmer has agreed to in person or through a verified channel. {{ purpose(cf.purpose).text }}</p>
        } @else {
          <vc-callout tone="warn" icon="alert">Withdrawing stops this use from today. For sampling or data use, the farmer\u2019s fields fail the consent check at their next enrolment decision.</vc-callout>
        }
        <div class="field">
          <label for="cch">How was this given?</label>
          <select id="cch" class="input" [(ngModel)]="cf.channel">
            @for (c of channels; track c[0]) { <option [value]="c[0]">{{ c[1] }}</option> }
          </select>
        </div>
        <div class="field">
          <label for="cnt">Notes <span class="subtle">(optional)</span></label>
          <textarea id="cnt" class="input" rows="3" [(ngModel)]="cf.notes" placeholder="For example: explained in Kannada at the village meeting, 12 Sept."></textarea>
        </div>
      </div>
      <ng-container footer>
        <button class="btn btn-secondary" (click)="consentOpen.set(false)">Cancel</button>
        <button class="btn" [class.btn-primary]="cf.granted" [class.btn-danger]="!cf.granted" [disabled]="busy()" (click)="saveConsent()">
          {{ busy() ? 'Saving\u2026' : cf.granted ? 'Record consent' : 'Withdraw consent' }}</button>
      </ng-container>
    </vc-modal>

    <!-- sign agreement -->
    <vc-modal [(open)]="signOpen" width="720px" title="Sign agreement" subtitle="The farmer signs the exact text shown here. A fingerprint of it is stored with the signature.">
      @if (templates() === null) { <vc-loading [rows]="4" /> }
      @else if (!templates()!.length) {
        <vc-empty icon="file" title="No published agreements" text="Publish an agreement template first under Agreements & consent.">
          <a class="btn btn-secondary" routerLink="/app/agreements" (click)="signOpen.set(false)">Open agreements</a></vc-empty>
      } @else {
        <div class="stack" style="--gap:14px">
          <div class="form-grid">
            <div class="field">
              <label for="stp">Agreement</label>
              <select id="stp" class="input" [ngModel]="sf.template_id" (ngModelChange)="pickTemplate($event)">
                @for (t of templates(); track t.id) { <option [value]="t.id">{{ t.title }} \xB7 v{{ t.version }}</option> }
              </select>
            </div>
            <div class="field">
              <label for="slg">Language</label>
              <select id="slg" class="input" [(ngModel)]="sf.language">
                @for (l of tplLangs(); track l) { <option [value]="l">{{ lang(l) }}</option> }
              </select>
            </div>
          </div>
          @if (tpl(); as t) {
            <div class="covers">
              <span class="small muted">Signing gives consent for</span>
              @for (p of t.purposes; track p) { <span class="chip">{{ purpose(p).label }}</span> }
            </div>
            <div class="preview" [attr.lang]="sf.language">{{ t.body[sf.language] }}</div>
          }
          <div class="field">
            <label>Signing method</label>
            <div class="methods">
              @for (m of methods; track m.key) {
                <button type="button" class="mopt" [class.on]="sf.method === m.key" (click)="sf.method = m.key">
                  <vc-icon [name]="m.icon" [size]="16" /><span><strong>{{ m.label }}</strong><small>{{ m.text }}</small></span>
                </button>
              }
            </div>
          </div>
          @if (sf.method === 'otp') {
            <div class="field otp">
              <label for="sotp">Code sent to {{ phone(ov()?.farmer?.phone ?? '') }}</label>
              <input id="sotp" class="input code" inputmode="numeric" maxlength="6" [(ngModel)]="sf.otp" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022" />
              @if (dev) { <span class="hint">Development environment: use the demo code <code>123456</code>.</span> }
            </div>
          }
          @if (signError()) { <vc-error title="Couldn't record the signature" [message]="signError()!" /> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-secondary" (click)="signOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy() || !tpl() || (sf.method === 'otp' && sf.otp.length < 6)" (click)="sign()">
          <vc-icon name="pencil" />{{ busy() ? 'Signing\u2026' : 'Record signature' }}</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;726c4c86f18a267e;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\farmers\\farmer-detail.page.ts */\n.back {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 13px;\n  color: var(--text-2);\n  margin-bottom: 14px;\n}\n.back:hover {\n  color: var(--forest-700);\n  text-decoration: none;\n}\n.hero {\n  margin-bottom: 20px;\n  overflow: hidden;\n}\n.id {\n  display: flex;\n  gap: 16px;\n  align-items: center;\n  padding: 20px 22px;\n  flex-wrap: wrap;\n}\n.av {\n  display: grid;\n  place-items: center;\n  width: 56px;\n  height: 56px;\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      135deg,\n      var(--forest-600),\n      var(--forest-800));\n  color: #fff;\n  font-size: 19px;\n  font-weight: 600;\n  flex: none;\n}\n.nm {\n  flex: 1;\n  min-width: 260px;\n}\n.meta {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px 16px;\n  margin-top: 6px;\n  font-size: 13px;\n  color: var(--text-2);\n}\n.meta span {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n}\n.meta vc-icon {\n  color: var(--text-3);\n}\n.member {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  height: 24px;\n  padding: 0 10px;\n  border-radius: 999px;\n  background: var(--forest-600);\n  color: #fff;\n  font-size: 12px;\n  font-weight: 500;\n}\n.acts {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  flex-wrap: wrap;\n}\n.lk {\n  padding: 0 22px 16px;\n}\n.facts {\n  display: grid;\n  grid-template-columns: repeat(5, 1fr);\n  border-top: 1px solid var(--border);\n  background: var(--surface-2);\n}\n.facts > div {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  padding: 14px 22px;\n}\n.facts > div + div {\n  border-left: 1px solid var(--border);\n}\n@media (max-width: 1100px) {\n  .facts {\n    grid-template-columns: repeat(3, 1fr);\n  }\n  .facts > div:nth-child(4) {\n    border-left: 0;\n  }\n}\n.v {\n  font-size: 20px;\n  font-weight: 600;\n  letter-spacing: -0.01em;\n}\n.v small {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--text-3);\n  margin-left: 4px;\n}\n.l {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--text-3);\n}\n.consent-grid {\n  display: grid;\n  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);\n  gap: 16px;\n  align-items: start;\n}\n@media (max-width: 1100px) {\n  .consent-grid {\n    grid-template-columns: 1fr;\n  }\n}\n.purposes {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.purposes li {\n  display: grid;\n  grid-template-columns: 24px 1fr 120px 130px;\n  gap: 12px;\n  align-items: center;\n  padding: 14px 20px;\n  border-bottom: 1px solid var(--stone-100);\n}\n.purposes li:last-child {\n  border-bottom: 0;\n}\n.purposes li .btn {\n  justify-self: end;\n}\n.st {\n  display: grid;\n  place-items: center;\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  background: var(--stone-100);\n  color: var(--stone-500);\n}\n.st.on {\n  background: var(--forest-100);\n  color: var(--forest-700);\n}\n.st.off {\n  background: var(--red-100);\n  color: var(--red-600);\n}\n.pt strong {\n  font-size: 13.5px;\n}\n.pt p {\n  font-size: 12.5px;\n  color: var(--text-2);\n  margin-top: 1px;\n}\n.pstate {\n  display: flex;\n  flex-direction: column;\n}\n.okText {\n  color: var(--forest-700);\n  font-weight: 500;\n}\n.covers {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  align-items: center;\n}\n.chip {\n  display: inline-flex;\n  align-items: center;\n  height: 22px;\n  padding: 0 8px;\n  border-radius: 5px;\n  background: var(--forest-50);\n  border: 1px solid var(--forest-100);\n  font-size: 12px;\n  color: var(--forest-800);\n}\n.preview {\n  max-height: 240px;\n  overflow: auto;\n  padding: 14px 16px;\n  border-radius: 8px;\n  border: 1px solid var(--border);\n  background: var(--surface-2);\n  white-space: pre-wrap;\n  font-size: 13.5px;\n  line-height: 1.65;\n  color: var(--stone-800);\n}\n.methods {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n}\n@media (max-width: 720px) {\n  .methods {\n    grid-template-columns: 1fr;\n  }\n}\n.mopt {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 10px 12px;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  background: var(--surface);\n  font: inherit;\n  text-align: left;\n  cursor: pointer;\n  color: var(--stone-600);\n}\n.mopt:hover {\n  border-color: var(--stone-400);\n}\n.mopt.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n  color: var(--forest-700);\n  box-shadow: inset 0 0 0 1px var(--forest-500);\n}\n.mopt span {\n  display: flex;\n  flex-direction: column;\n}\n.mopt strong {\n  font-size: 13px;\n  color: var(--stone-900);\n}\n.mopt small {\n  font-size: 12px;\n  color: var(--text-2);\n}\n.code {\n  font: 500 20px var(--mono);\n  letter-spacing: 0.4em;\n  height: 46px;\n  max-width: 220px;\n}\n/*# sourceMappingURL=farmer-detail.page.css.map */\n"] }]
  }], null, { id: [{ type: Input, args: [{ isSignal: true, alias: "id", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FarmerDetailPage, { className: "FarmerDetailPage", filePath: "src/app/features/farmers/farmer-detail.page.ts", lineNumber: 331 });
})();

// src/app/features/farmers/farmers.page.ts
var _forTrack03 = ($index, $item) => $item[0];
var _forTrack12 = ($index, $item) => $item.id;
function FarmersPage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 54);
    \u0275\u0275listener("click", function FarmersPage_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openCreate());
    });
    \u0275\u0275element(1, "vc-icon", 55);
    \u0275\u0275text(2, "Add farmer");
    \u0275\u0275elementEnd();
  }
}
function FarmersPage_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 54);
    \u0275\u0275listener("click", function FarmersPage_Conditional_2_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openFpo());
    });
    \u0275\u0275element(1, "vc-icon", 56);
    \u0275\u0275text(2, "Add FPO");
    \u0275\u0275elementEnd();
  }
}
function FarmersPage_Conditional_4_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 27);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r5 = ctx.$implicit;
    \u0275\u0275property("value", f_r5.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r5.name);
  }
}
function FarmersPage_Conditional_4_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 65);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 8);
  }
}
function FarmersPage_Conditional_4_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 66)(1, "vc-error", 67)(2, "button", 68);
    \u0275\u0275listener("click", function FarmersPage_Conditional_4_Conditional_20_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.load());
    });
    \u0275\u0275text(3, "Try again");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function FarmersPage_Conditional_4_Conditional_21_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 69);
  }
}
function FarmersPage_Conditional_4_Conditional_21_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 72);
    \u0275\u0275listener("click", function FarmersPage_Conditional_4_Conditional_21_Conditional_1_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.openCreate());
    });
    \u0275\u0275element(1, "vc-icon", 55);
    \u0275\u0275text(2, "Add farmer");
    \u0275\u0275elementEnd();
  }
}
function FarmersPage_Conditional_4_Conditional_21_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 70);
    \u0275\u0275conditionalCreate(1, FarmersPage_Conditional_4_Conditional_21_Conditional_1_Conditional_1_Template, 3, 0, "button", 71);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canManage ? 1 : -1);
  }
}
function FarmersPage_Conditional_4_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, FarmersPage_Conditional_4_Conditional_21_Conditional_0_Template, 1, 0, "vc-empty", 69)(1, FarmersPage_Conditional_4_Conditional_21_Conditional_1_Template, 2, 1, "vc-empty", 70);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275conditional(ctx_r1.q() || ctx_r1.fpoId() || ctx_r1.status() ? 0 : 1);
  }
}
function FarmersPage_Conditional_4_Conditional_22_For_20_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 89);
    \u0275\u0275element(1, "vc-icon", 92);
    \u0275\u0275text(2, "Varsapradaya member");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
  }
}
function FarmersPage_Conditional_4_Conditional_22_For_20_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 90);
    \u0275\u0275text(1, "\u2014");
    \u0275\u0275elementEnd();
  }
}
function FarmersPage_Conditional_4_Conditional_22_For_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr", 82);
    \u0275\u0275listener("click", function FarmersPage_Conditional_4_Conditional_22_For_20_Template_tr_click_0_listener() {
      const f_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.open(f_r10));
    });
    \u0275\u0275elementStart(1, "td")(2, "div", 83)(3, "span", 84);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 85)(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 86);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(10, "td")(11, "span", 87);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "td");
    \u0275\u0275text(14);
    \u0275\u0275elementStart(15, "span", 30);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "td", 88);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td");
    \u0275\u0275conditionalCreate(20, FarmersPage_Conditional_4_Conditional_22_For_20_Conditional_20_Template, 3, 1, "span", 89)(21, FarmersPage_Conditional_4_Conditional_22_For_20_Conditional_21_Template, 2, 0, "span", 90);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "td")(23, "vc-badge", 91);
    \u0275\u0275text(24);
    \u0275\u0275pipe(25, "human");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "td");
    \u0275\u0275element(27, "vc-badge", 91);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.ini(f_r10.full_name));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(f_r10.full_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.phone(f_r10.phone));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(f_r10.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r10.village || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r10.district ? ", " + f_r10.district : "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.fpoName(f_r10.fpo_id));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(f_r10.member_id ? 20 : 21);
    \u0275\u0275advance(3);
    \u0275\u0275property("status", ctx_r1.kycTone(f_r10.kyc_status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(25, 11, f_r10.kyc_status));
    \u0275\u0275advance(3);
    \u0275\u0275property("status", f_r10.status);
  }
}
function FarmersPage_Conditional_4_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 73)(1, "table", 74)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Farmer");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Village / district");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "FPO");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Membership");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "KYC");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "th");
    \u0275\u0275text(17, "Status");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "tbody");
    \u0275\u0275repeaterCreate(19, FarmersPage_Conditional_4_Conditional_22_For_20_Template, 28, 13, "tr", 75, _forTrack12);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 76)(22, "span", 77);
    \u0275\u0275text(23);
    \u0275\u0275pipe(24, "num");
    \u0275\u0275elementEnd();
    \u0275\u0275element(25, "span", 78);
    \u0275\u0275elementStart(26, "button", 79);
    \u0275\u0275listener("click", function FarmersPage_Conditional_4_Conditional_22_Template_button_click_26_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.page(-1));
    });
    \u0275\u0275element(27, "vc-icon", 80);
    \u0275\u0275text(28, "Previous");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "button", 79);
    \u0275\u0275listener("click", function FarmersPage_Conditional_4_Conditional_22_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.page(1));
    });
    \u0275\u0275text(30, "Next");
    \u0275\u0275element(31, "vc-icon", 81);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(19);
    \u0275\u0275repeater(ctx_r1.rows());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate3("", ctx_r1.offset() + 1, "\u2013", ctx_r1.offset() + ctx_r1.rows().length, " of ", \u0275\u0275pipeBind2(24, 7, ctx_r1.total(), 0));
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.offset() === 0);
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r1.offset() + ctx_r1.rows().length >= ctx_r1.total());
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
  }
}
function FarmersPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 57)(1, "div", 58);
    \u0275\u0275element(2, "vc-icon", 59);
    \u0275\u0275elementStart(3, "input", 60);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FarmersPage_Conditional_4_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSearch($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "select", 61);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FarmersPage_Conditional_4_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.fpoId.set($event);
      return \u0275\u0275resetView(ctx_r1.reload());
    });
    \u0275\u0275elementStart(5, "option", 32);
    \u0275\u0275text(6, "All FPOs");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(7, FarmersPage_Conditional_4_For_8_Template, 2, 2, "option", 27, _forTrack12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "select", 61);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FarmersPage_Conditional_4_Template_select_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.status.set($event);
      return \u0275\u0275resetView(ctx_r1.reload());
    });
    \u0275\u0275elementStart(10, "option", 32);
    \u0275\u0275text(11, "Any status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "option", 62);
    \u0275\u0275text(13, "Active");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "option", 63);
    \u0275\u0275text(15, "Inactive");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "option", 64);
    \u0275\u0275text(17, "Exited");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(18, "section", 3);
    \u0275\u0275conditionalCreate(19, FarmersPage_Conditional_4_Conditional_19_Template, 1, 1, "vc-loading", 65)(20, FarmersPage_Conditional_4_Conditional_20_Template, 4, 1, "div", 66)(21, FarmersPage_Conditional_4_Conditional_21_Template, 2, 1)(22, FarmersPage_Conditional_4_Conditional_22_Template, 32, 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 15);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.q());
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r1.fpoId());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.fpos());
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", ctx_r1.status());
    \u0275\u0275control();
    \u0275\u0275advance(10);
    \u0275\u0275conditional(ctx_r1.loading() ? 19 : ctx_r1.error() ? 20 : !ctx_r1.rows().length ? 21 : 22);
  }
}
function FarmersPage_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 65);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function FarmersPage_Conditional_5_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 66);
    \u0275\u0275element(1, "vc-error", 94);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.fposError());
  }
}
function FarmersPage_Conditional_5_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 72);
    \u0275\u0275listener("click", function FarmersPage_Conditional_5_Conditional_3_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openFpo());
    });
    \u0275\u0275element(1, "vc-icon", 56);
    \u0275\u0275text(2, "Add FPO");
    \u0275\u0275elementEnd();
  }
}
function FarmersPage_Conditional_5_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 93);
    \u0275\u0275conditionalCreate(1, FarmersPage_Conditional_5_Conditional_3_Conditional_1_Template, 3, 0, "button", 71);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canManage ? 1 : -1);
  }
}
function FarmersPage_Conditional_5_Conditional_4_For_17_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 86);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r13 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("\xB7 ", f_r13.contact_phone);
  }
}
function FarmersPage_Conditional_5_Conditional_4_For_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "td", 87);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275text(7);
    \u0275\u0275elementStart(8, "span", 30);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "td");
    \u0275\u0275text(11);
    \u0275\u0275conditionalCreate(12, FarmersPage_Conditional_5_Conditional_4_For_17_Conditional_12_Template, 2, 1, "span", 86);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td", 95);
    \u0275\u0275text(14);
    \u0275\u0275pipe(15, "day");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td", 96)(17, "button", 97);
    \u0275\u0275listener("click", function FarmersPage_Conditional_5_Conditional_4_For_17_Template_button_click_17_listener() {
      const f_r13 = \u0275\u0275restoreView(_r12).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.showFpoFarmers(f_r13));
    });
    \u0275\u0275text(18, "View farmers");
    \u0275\u0275element(19, "vc-icon", 98);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const f_r13 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(f_r13.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r13.registration_no || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r13.district || "\u2014");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(f_r13.state ? ", " + f_r13.state : "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", f_r13.contact_name || "\u2014", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(f_r13.contact_phone ? 12 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(15, 8, f_r13.created_at));
    \u0275\u0275advance(5);
    \u0275\u0275property("size", 14);
  }
}
function FarmersPage_Conditional_5_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 73)(1, "table", 74)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Registration no.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "District / state");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Contact");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Added");
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "tbody");
    \u0275\u0275repeaterCreate(16, FarmersPage_Conditional_5_Conditional_4_For_17_Template, 20, 10, "tr", null, _forTrack12);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(16);
    \u0275\u0275repeater(ctx_r1.fpos());
  }
}
function FarmersPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 3);
    \u0275\u0275conditionalCreate(1, FarmersPage_Conditional_5_Conditional_1_Template, 1, 1, "vc-loading", 65)(2, FarmersPage_Conditional_5_Conditional_2_Template, 2, 1, "div", 66)(3, FarmersPage_Conditional_5_Conditional_3_Template, 2, 1, "vc-empty", 93)(4, FarmersPage_Conditional_5_Conditional_4_Template, 18, 0, "div", 73);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.fposLoading() ? 1 : ctx_r1.fposError() ? 2 : !ctx_r1.fpos().length ? 3 : 4);
  }
}
function FarmersPage_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.fe()["phone"]);
  }
}
function FarmersPage_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 13);
    \u0275\u0275text(1, "Checks the Varsapradaya member platform. Nothing is saved until you add the farmer.");
    \u0275\u0275elementEnd();
  }
}
function FarmersPage_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 14);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.lookupError());
  }
}
function FarmersPage_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-member-result", 15);
  }
  if (rf & 2) {
    \u0275\u0275property("result", ctx);
  }
}
function FarmersPage_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.fe()["full_name"]);
  }
}
function FarmersPage_For_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 27);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const l_r14 = ctx.$implicit;
    \u0275\u0275property("value", l_r14[0]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(l_r14[1]);
  }
}
function FarmersPage_For_53_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 27);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r15 = ctx.$implicit;
    \u0275\u0275property("value", f_r15.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r15.name);
  }
}
function FarmersPage_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 33)(1, "input", 99);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function FarmersPage_Conditional_54_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r16);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.form.link, $event) || (ctx_r1.form.link = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.form.link);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Link to Varsapradaya member ", ctx_r1.lookup()?.member_id);
  }
}
function FarmersPage_Conditional_55_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 34);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.formError());
  }
}
function FarmersPage_Conditional_89_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 52);
    \u0275\u0275element(1, "vc-error", 100);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.fpoError());
  }
}
var PAGE = 25;
var FarmersPage = class _FarmersPage {
  api = inject(ApiService);
  toast = inject(ToastService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  canManage = inject(AuthService).can("farmers.manage");
  langs = Object.entries(LANGUAGES);
  ini = initials;
  phone = formatPhone;
  tab = signal(
    this.route.snapshot.queryParamMap.get("tab") === "fpos" ? "fpos" : "farmers",
    ...ngDevMode ? [{ debugName: "tab" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rows = signal(
    [],
    ...ngDevMode ? [{ debugName: "rows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  total = signal(
    0,
    ...ngDevMode ? [{ debugName: "total" }] : (
      /* istanbul ignore next */
      []
    )
  );
  offset = signal(
    0,
    ...ngDevMode ? [{ debugName: "offset" }] : (
      /* istanbul ignore next */
      []
    )
  );
  loading = signal(
    true,
    ...ngDevMode ? [{ debugName: "loading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  error = signal(
    null,
    ...ngDevMode ? [{ debugName: "error" }] : (
      /* istanbul ignore next */
      []
    )
  );
  q = signal(
    "",
    ...ngDevMode ? [{ debugName: "q" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fpoId = signal(
    this.route.snapshot.queryParamMap.get("fpo") ?? "",
    ...ngDevMode ? [{ debugName: "fpoId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  status = signal(
    "",
    ...ngDevMode ? [{ debugName: "status" }] : (
      /* istanbul ignore next */
      []
    )
  );
  search$ = new Subject();
  fpos = signal(
    [],
    ...ngDevMode ? [{ debugName: "fpos" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fposLoading = signal(
    true,
    ...ngDevMode ? [{ debugName: "fposLoading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fposError = signal(
    null,
    ...ngDevMode ? [{ debugName: "fposError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fpoMap = computed(
    () => new Map(this.fpos().map((f) => [f.id, f.name])),
    ...ngDevMode ? [{ debugName: "fpoMap" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tabs = computed(
    () => [
      { key: "farmers", label: "Farmers", count: this.total() },
      { key: "fpos", label: "FPOs", count: this.fpos().length }
    ],
    ...ngDevMode ? [{ debugName: "tabs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  createOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "createOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  saving = signal(
    false,
    ...ngDevMode ? [{ debugName: "saving" }] : (
      /* istanbul ignore next */
      []
    )
  );
  formError = signal(
    null,
    ...ngDevMode ? [{ debugName: "formError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fe = signal(
    {},
    ...ngDevMode ? [{ debugName: "fe" }] : (
      /* istanbul ignore next */
      []
    )
  );
  looking = signal(
    false,
    ...ngDevMode ? [{ debugName: "looking" }] : (
      /* istanbul ignore next */
      []
    )
  );
  lookup = signal(
    null,
    ...ngDevMode ? [{ debugName: "lookup" }] : (
      /* istanbul ignore next */
      []
    )
  );
  lookupError = signal(
    null,
    ...ngDevMode ? [{ debugName: "lookupError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  form = this.blank();
  fpoOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "fpoOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fpoError = signal(
    null,
    ...ngDevMode ? [{ debugName: "fpoError" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fpoForm = this.blankFpo();
  constructor() {
    this.search$.pipe(debounceTime(250)).subscribe(() => this.reload());
    this.load();
    this.loadFpos();
  }
  setTab(t) {
    this.tab.set(t);
    this.router.navigate([], { queryParams: { tab: t === "fpos" ? "fpos" : null }, replaceUrl: true });
  }
  fpoName(id) {
    return id ? this.fpoMap().get(id) ?? "\u2014" : "\u2014";
  }
  kycTone(s) {
    return { verified: "verified", pending: "pending", failed: "failed" }[s] ?? "draft";
  }
  onSearch(v) {
    this.q.set(v);
    this.search$.next();
  }
  reload() {
    this.offset.set(0);
    this.load();
  }
  page(dir) {
    this.offset.set(Math.max(0, this.offset() + dir * PAGE));
    this.load();
  }
  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get("/farmers", {
      q: this.q().trim(),
      fpo_id: this.fpoId(),
      status: this.status(),
      limit: PAGE,
      offset: this.offset()
    }).subscribe({
      next: (r) => {
        this.rows.set(r.items);
        this.total.set(r.total);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  loadFpos() {
    this.api.get("/fpos").subscribe({
      next: (r) => {
        this.fpos.set(r);
        this.fposLoading.set(false);
      },
      error: (e) => {
        this.fposError.set(e.message);
        this.fposLoading.set(false);
      }
    });
  }
  showFpoFarmers(f) {
    this.fpoId.set(f.id);
    this.setTab("farmers");
    this.reload();
  }
  open(f) {
    this.router.navigate(["/app/farmers", f.id]);
  }
  blank() {
    return { full_name: "", phone: "", village: "", district: "", state: "Karnataka", language: "kn", fpo_id: "", link: true };
  }
  blankFpo() {
    return { name: "", registration_no: "", district: "", state: "Karnataka", contact_name: "", contact_phone: "" };
  }
  openCreate() {
    this.form = this.blank();
    this.lookup.set(null);
    this.lookupError.set(null);
    this.formError.set(null);
    this.fe.set({});
    this.createOpen.set(true);
  }
  checkMember() {
    this.looking.set(true);
    this.lookupError.set(null);
    this.api.post("/farmers/member-lookup", { phone: this.form.phone.trim() }).subscribe({
      next: (r) => {
        this.looking.set(false);
        this.lookup.set(r);
      },
      error: (e) => {
        this.looking.set(false);
        this.lookupError.set(e.message);
      }
    });
  }
  create() {
    const f = this.form;
    this.saving.set(true);
    this.formError.set(null);
    this.fe.set({});
    this.api.post("/farmers", {
      full_name: f.full_name.trim(),
      phone: f.phone.trim(),
      village: f.village.trim(),
      district: f.district.trim(),
      state: f.state.trim(),
      language: f.language,
      fpo_id: f.fpo_id || null
    }).subscribe({
      next: (farmer) => {
        const done = (linked) => {
          this.saving.set(false);
          this.createOpen.set(false);
          this.toast.success("Farmer added", `${farmer.full_name} (${farmer.code})${linked ? " is linked to their Varsapradaya membership." : "."}`);
          this.router.navigate(["/app/farmers", farmer.id]);
        };
        if (f.link && this.lookup()?.is_member) {
          this.api.post("/farmers/member-lookup", { phone: farmer.phone, farmer_id: farmer.id }).pipe(catchError((e) => {
            this.toast.apiError(e, "Added, but couldn't link membership");
            return of(null);
          })).subscribe((r) => done(!!r));
        } else
          done(false);
      },
      error: (e) => {
        this.saving.set(false);
        const m = fieldMap(e);
        this.fe.set(m);
        this.formError.set(formMessage(e, m));
      }
    });
  }
  openFpo() {
    this.fpoForm = this.blankFpo();
    this.fpoError.set(null);
    this.fpoOpen.set(true);
  }
  createFpo() {
    const f = this.fpoForm;
    this.saving.set(true);
    this.api.post("/fpos", {
      name: f.name.trim(),
      registration_no: f.registration_no.trim() || null,
      district: f.district.trim(),
      state: f.state.trim(),
      contact_name: f.contact_name.trim() || null,
      contact_phone: f.contact_phone.trim() || null
    }).subscribe({
      next: (r) => {
        this.saving.set(false);
        this.fpoOpen.set(false);
        this.fpos.set([...this.fpos(), r].sort((a, b) => a.name.localeCompare(b.name)));
        this.toast.success("FPO added", r.name);
      },
      error: (e) => {
        this.saving.set(false);
        this.fpoError.set(formMessage(e, fieldMap(e)) ?? e.message);
      }
    });
  }
  static \u0275fac = function FarmersPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FarmersPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FarmersPage, selectors: [["vc-farmers-page"]], decls: 95, vars: 37, consts: [["title", "Farmers", "eyebrow", "Programmes", "subtitle", "Everyone taking part, their farmer producer organisation and whether they are Varsapradaya members."], ["actions", "", 1, "btn", "btn-primary"], [3, "activeChange", "tabs", "active"], [1, "card"], ["width", "520px", "title", "Add farmer", "subtitle", "Check membership first \u2014 members bring their farms and devices with them.", 3, "openChange", "open", "drawer"], ["id", "farmer-form", 1, "stack", 2, "--gap", "14px", 3, "ngSubmit"], [1, "field"], ["for", "fph"], [1, "row", 2, "--gap", "8px"], ["id", "fph", "name", "phone", "inputmode", "tel", "placeholder", "+91 98450 12345", 1, "input", "num", 3, "ngModelChange", "ngModel"], ["type", "button", 1, "btn", "btn-secondary", 3, "click", "disabled"], ["name", "verified"], [1, "error"], [1, "hint"], ["title", "Couldn't check membership", 3, "message"], [3, "result"], ["for", "fnm"], ["id", "fnm", "name", "name", "placeholder", "As on their ID", 1, "input", 3, "ngModelChange", "ngModel"], [1, "form-grid"], ["for", "fvl"], ["id", "fvl", "name", "village", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "fds"], ["id", "fds", "name", "district", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "fst"], ["id", "fst", "name", "state", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "flg"], ["id", "flg", "name", "language", 1, "input", 3, "ngModelChange", "ngModel"], [3, "value"], [1, "field", "span-2"], ["for", "ffp"], [1, "subtle"], ["id", "ffp", "name", "fpo", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [1, "checkbox"], ["title", "Couldn't add the farmer", 3, "message"], ["footer", ""], ["type", "button", 1, "btn", "btn-secondary", 3, "click"], ["type", "submit", "form", "farmer-form", 1, "btn", "btn-primary", 3, "disabled"], ["title", "Add farmer producer organisation", "width", "560px", 3, "openChange", "open"], ["id", "fpo-form", 1, "form-grid", 3, "ngSubmit"], ["for", "on"], ["id", "on", "name", "name", "placeholder", "Malnad Growers Producer Company", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "or"], ["id", "or", "name", "reg", "placeholder", "U01100KA2019PTC123456", 1, "input", "mono", 3, "ngModelChange", "ngModel"], ["for", "od"], ["id", "od", "name", "district", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "os"], ["id", "os", "name", "state", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "ocn"], ["id", "ocn", "name", "cn", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "ocp"], ["id", "ocp", "name", "cp", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "span-2"], ["type", "submit", "form", "fpo-form", 1, "btn", "btn-primary", 3, "disabled"], ["actions", "", 1, "btn", "btn-primary", 3, "click"], ["name", "user-plus"], ["name", "plus"], [1, "filters"], [1, "search"], ["name", "search", 3, "size"], ["placeholder", "Search name, phone, code or village\u2026", 1, "input", 3, "ngModelChange", "ngModel"], [1, "input", "w", 3, "ngModelChange", "ngModel"], ["value", "active"], ["value", "inactive"], ["value", "exited"], [3, "rows"], [1, "card-body"], ["title", "Couldn't load farmers", 3, "message"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["icon", "search", "title", "No farmers match", "text", "Try a different name, phone number or filter."], ["icon", "users", "title", "No farmers yet", "text", "Add the first farmer. If they are already a Varsapradaya member, their farms and devices are linked automatically."], [1, "btn", "btn-primary"], [1, "btn", "btn-primary", 3, "click"], [1, "table-wrap"], [1, "table"], [1, "clickable"], [1, "card-foot", "pager"], [1, "small", "muted", "num"], [1, "spacer"], [1, "btn", "btn-secondary", "btn-sm", 3, "click", "disabled"], ["name", "chevron-left", 3, "size"], ["name", "chevron-right", 3, "size"], [1, "clickable", 3, "click"], [1, "who"], [1, "av"], [1, "nm"], [1, "subtle", "small", "num"], [1, "mono", "small"], [1, "muted"], [1, "member"], [1, "subtle", "small"], [3, "status"], ["name", "verified", 3, "size"], ["icon", "building", "title", "No farmer producer organisations yet", "text", "FPOs group farmers locally. Add one to organise enrolment and payments by collective."], ["title", "Couldn't load FPOs", 3, "message"], [1, "nowrap"], [1, "num"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["name", "arrow-right", 3, "size"], ["type", "checkbox", "name", "link", 3, "ngModelChange", "ngModel"], ["title", "Couldn't add the FPO", 3, "message"]], template: function FarmersPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0);
      \u0275\u0275conditionalCreate(1, FarmersPage_Conditional_1_Template, 3, 0, "button", 1)(2, FarmersPage_Conditional_2_Template, 3, 0, "button", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "vc-tabs", 2);
      \u0275\u0275listener("activeChange", function FarmersPage_Template_vc_tabs_activeChange_3_listener($event) {
        return ctx.setTab($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, FarmersPage_Conditional_4_Template, 23, 5)(5, FarmersPage_Conditional_5_Template, 5, 1, "section", 3);
      \u0275\u0275elementStart(6, "vc-modal", 4);
      \u0275\u0275twoWayListener("openChange", function FarmersPage_Template_vc_modal_openChange_6_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.createOpen, $event) || (ctx.createOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(7, "form", 5);
      \u0275\u0275listener("ngSubmit", function FarmersPage_Template_form_ngSubmit_7_listener() {
        return ctx.create();
      });
      \u0275\u0275elementStart(8, "div", 6)(9, "label", 7);
      \u0275\u0275text(10, "Mobile number");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div", 8)(12, "input", 9);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FarmersPage_Template_input_ngModelChange_12_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.phone, $event) || (ctx.form.phone = $event);
        return $event;
      });
      \u0275\u0275listener("ngModelChange", function FarmersPage_Template_input_ngModelChange_12_listener() {
        return ctx.lookup.set(null);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "button", 10);
      \u0275\u0275listener("click", function FarmersPage_Template_button_click_13_listener() {
        return ctx.checkMember();
      });
      \u0275\u0275element(14, "vc-icon", 11);
      \u0275\u0275text(15);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(16, FarmersPage_Conditional_16_Template, 2, 1, "span", 12)(17, FarmersPage_Conditional_17_Template, 2, 0, "span", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(18, FarmersPage_Conditional_18_Template, 1, 1, "vc-error", 14);
      \u0275\u0275conditionalCreate(19, FarmersPage_Conditional_19_Template, 1, 1, "vc-member-result", 15);
      \u0275\u0275elementStart(20, "div", 6)(21, "label", 16);
      \u0275\u0275text(22, "Full name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "input", 17);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FarmersPage_Template_input_ngModelChange_23_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.full_name, $event) || (ctx.form.full_name = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(24, FarmersPage_Conditional_24_Template, 2, 1, "span", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "div", 18)(26, "div", 6)(27, "label", 19);
      \u0275\u0275text(28, "Village");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "input", 20);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FarmersPage_Template_input_ngModelChange_29_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.village, $event) || (ctx.form.village = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(30, "div", 6)(31, "label", 21);
      \u0275\u0275text(32, "District");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "input", 22);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FarmersPage_Template_input_ngModelChange_33_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.district, $event) || (ctx.form.district = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(34, "div", 6)(35, "label", 23);
      \u0275\u0275text(36, "State");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "input", 24);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FarmersPage_Template_input_ngModelChange_37_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.state, $event) || (ctx.form.state = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(38, "div", 6)(39, "label", 25);
      \u0275\u0275text(40, "Preferred language");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "select", 26);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FarmersPage_Template_select_ngModelChange_41_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.language, $event) || (ctx.form.language = $event);
        return $event;
      });
      \u0275\u0275repeaterCreate(42, FarmersPage_For_43_Template, 2, 2, "option", 27, _forTrack03);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(44, "div", 28)(45, "label", 29);
      \u0275\u0275text(46, "FPO ");
      \u0275\u0275elementStart(47, "span", 30);
      \u0275\u0275text(48, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(49, "select", 31);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FarmersPage_Template_select_ngModelChange_49_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.form.fpo_id, $event) || (ctx.form.fpo_id = $event);
        return $event;
      });
      \u0275\u0275elementStart(50, "option", 32);
      \u0275\u0275text(51, "Not part of an FPO");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(52, FarmersPage_For_53_Template, 2, 2, "option", 27, _forTrack12);
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(54, FarmersPage_Conditional_54_Template, 3, 2, "label", 33);
      \u0275\u0275conditionalCreate(55, FarmersPage_Conditional_55_Template, 1, 1, "vc-error", 34);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(56, 35);
      \u0275\u0275elementStart(57, "button", 36);
      \u0275\u0275listener("click", function FarmersPage_Template_button_click_57_listener() {
        return ctx.createOpen.set(false);
      });
      \u0275\u0275text(58, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "button", 37);
      \u0275\u0275text(60);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(61, "vc-modal", 38);
      \u0275\u0275twoWayListener("openChange", function FarmersPage_Template_vc_modal_openChange_61_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.fpoOpen, $event) || (ctx.fpoOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(62, "form", 39);
      \u0275\u0275listener("ngSubmit", function FarmersPage_Template_form_ngSubmit_62_listener() {
        return ctx.createFpo();
      });
      \u0275\u0275elementStart(63, "div", 28)(64, "label", 40);
      \u0275\u0275text(65, "Name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(66, "input", 41);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FarmersPage_Template_input_ngModelChange_66_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.fpoForm.name, $event) || (ctx.fpoForm.name = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(67, "div", 28)(68, "label", 42);
      \u0275\u0275text(69, "Registration number ");
      \u0275\u0275elementStart(70, "span", 30);
      \u0275\u0275text(71, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(72, "input", 43);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FarmersPage_Template_input_ngModelChange_72_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.fpoForm.registration_no, $event) || (ctx.fpoForm.registration_no = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(73, "div", 6)(74, "label", 44);
      \u0275\u0275text(75, "District");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(76, "input", 45);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FarmersPage_Template_input_ngModelChange_76_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.fpoForm.district, $event) || (ctx.fpoForm.district = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(77, "div", 6)(78, "label", 46);
      \u0275\u0275text(79, "State");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(80, "input", 47);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FarmersPage_Template_input_ngModelChange_80_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.fpoForm.state, $event) || (ctx.fpoForm.state = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(81, "div", 6)(82, "label", 48);
      \u0275\u0275text(83, "Contact person");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(84, "input", 49);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FarmersPage_Template_input_ngModelChange_84_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.fpoForm.contact_name, $event) || (ctx.fpoForm.contact_name = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(85, "div", 6)(86, "label", 50);
      \u0275\u0275text(87, "Contact phone");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(88, "input", 51);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function FarmersPage_Template_input_ngModelChange_88_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.fpoForm.contact_phone, $event) || (ctx.fpoForm.contact_phone = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(89, FarmersPage_Conditional_89_Template, 2, 1, "div", 52);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(90, 35);
      \u0275\u0275elementStart(91, "button", 36);
      \u0275\u0275listener("click", function FarmersPage_Template_button_click_91_listener() {
        return ctx.fpoOpen.set(false);
      });
      \u0275\u0275text(92, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(93, "button", 53);
      \u0275\u0275text(94);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_13_0;
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.canManage && ctx.tab() === "farmers" ? 1 : ctx.canManage ? 2 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("tabs", ctx.tabs())("active", ctx.tab());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.tab() === "farmers" ? 4 : 5);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("open", ctx.createOpen);
      \u0275\u0275property("drawer", true);
      \u0275\u0275advance(6);
      \u0275\u0275classProp("invalid", ctx.fe()["phone"]);
      \u0275\u0275twoWayProperty("ngModel", ctx.form.phone);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.looking() || ctx.form.phone.trim().length < 6);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("", ctx.looking() ? "Checking\u2026" : "Check membership", " ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.fe()["phone"] ? 16 : 17);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.lookupError() ? 18 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_13_0 = ctx.lookup()) ? 19 : -1, tmp_13_0);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("invalid", ctx.fe()["full_name"]);
      \u0275\u0275twoWayProperty("ngModel", ctx.form.full_name);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.fe()["full_name"] ? 24 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.form.village);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form.district);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form.state);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.form.language);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.langs);
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.form.fpo_id);
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.fpos());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.lookup()?.is_member ? 54 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.formError() ? 55 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.saving() || !ctx.form.full_name.trim() || ctx.form.phone.trim().length < 6);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.saving() ? "Adding\u2026" : "Add farmer", " ");
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.fpoOpen);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.fpoForm.name);
      \u0275\u0275control();
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.fpoForm.registration_no);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.fpoForm.district);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.fpoForm.state);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.fpoForm.contact_name);
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.fpoForm.contact_phone);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.fpoError() ? 89 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.saving() || ctx.fpoForm.name.trim().length < 2);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.saving() ? "Adding\u2026" : "Add FPO");
    }
  }, dependencies: [
    FormsModule,
    \u0275NgNoValidate,
    NgSelectOption,
    \u0275NgSelectMultipleOption,
    DefaultValueAccessor,
    CheckboxControlValueAccessor,
    SelectControlValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    NgModel,
    NgForm,
    PageHeader,
    Loading,
    ErrorBox,
    Empty,
    Badge,
    Modal,
    Tabs,
    Icon,
    MemberResult,
    NumPipe,
    DayPipe,
    HumanPipe
  ], styles: ["\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n}\n.search[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n  max-width: 420px;\n}\n.search[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--%NS%text-3);\n}\n.search[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-left: 34px;\n}\n.w[_ngcontent-%COMP%] {\n  width: 200px;\n}\n.who[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.av[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-700);\n  font-size: 12px;\n  font-weight: 600;\n  flex: none;\n}\n.nm[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.3;\n}\n.member[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  height: 22px;\n  padding: 0 9px;\n  border-radius: 999px;\n  background: var(--%NS%forest-50);\n  border: 1px solid var(--%NS%forest-200);\n  color: var(--%NS%forest-700);\n  font-size: 12px;\n  font-weight: 500;\n  white-space: nowrap;\n}\n.pager[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=farmers.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FarmersPage, [{
    type: Component,
    args: [{ selector: "vc-farmers-page", imports: [
      FormsModule,
      PageHeader,
      Loading,
      ErrorBox,
      Empty,
      Badge,
      Modal,
      Tabs,
      Icon,
      MemberResult,
      NumPipe,
      DayPipe,
      HumanPipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Farmers" eyebrow="Programmes"
      subtitle="Everyone taking part, their farmer producer organisation and whether they are Varsapradaya members.">
      @if (canManage && tab() === 'farmers') {
        <button actions class="btn btn-primary" (click)="openCreate()"><vc-icon name="user-plus" />Add farmer</button>
      } @else if (canManage) {
        <button actions class="btn btn-primary" (click)="openFpo()"><vc-icon name="plus" />Add FPO</button>
      }
    </vc-page-header>

    <vc-tabs [tabs]="tabs()" [active]="tab()" (activeChange)="setTab($event)" />

    @if (tab() === 'farmers') {
      <div class="filters">
        <div class="search">
          <vc-icon name="search" [size]="15" />
          <input class="input" placeholder="Search name, phone, code or village\u2026" [ngModel]="q()" (ngModelChange)="onSearch($event)" />
        </div>
        <select class="input w" [ngModel]="fpoId()" (ngModelChange)="fpoId.set($event); reload()">
          <option value="">All FPOs</option>
          @for (f of fpos(); track f.id) { <option [value]="f.id">{{ f.name }}</option> }
        </select>
        <select class="input w" [ngModel]="status()" (ngModelChange)="status.set($event); reload()">
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="exited">Exited</option>
        </select>
      </div>

      <section class="card">
        @if (loading()) {
          <vc-loading [rows]="8" />
        } @else if (error()) {
          <div class="card-body"><vc-error title="Couldn't load farmers" [message]="error()!"><button class="btn btn-secondary btn-sm" (click)="load()">Try again</button></vc-error></div>
        } @else if (!rows().length) {
          @if (q() || fpoId() || status()) {
            <vc-empty icon="search" title="No farmers match" text="Try a different name, phone number or filter." />
          } @else {
            <vc-empty icon="users" title="No farmers yet"
              text="Add the first farmer. If they are already a Varsapradaya member, their farms and devices are linked automatically.">
              @if (canManage) { <button class="btn btn-primary" (click)="openCreate()"><vc-icon name="user-plus" />Add farmer</button> }
            </vc-empty>
          }
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Farmer</th><th>Code</th><th>Village / district</th><th>FPO</th><th>Membership</th><th>KYC</th><th>Status</th></tr></thead>
              <tbody>
                @for (f of rows(); track f.id) {
                  <tr class="clickable" (click)="open(f)">
                    <td>
                      <div class="who">
                        <span class="av">{{ ini(f.full_name) }}</span>
                        <span class="nm"><strong>{{ f.full_name }}</strong><span class="subtle small num">{{ phone(f.phone) }}</span></span>
                      </div>
                    </td>
                    <td><span class="mono small">{{ f.code }}</span></td>
                    <td>{{ f.village || '\u2014' }}<span class="subtle">{{ f.district ? ', ' + f.district : '' }}</span></td>
                    <td class="muted">{{ fpoName(f.fpo_id) }}</td>
                    <td>
                      @if (f.member_id) { <span class="member"><vc-icon name="verified" [size]="13" />Varsapradaya member</span> }
                      @else { <span class="subtle small">\u2014</span> }
                    </td>
                    <td><vc-badge [status]="kycTone(f.kyc_status)">{{ f.kyc_status | human }}</vc-badge></td>
                    <td><vc-badge [status]="f.status" /></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div class="card-foot pager">
            <span class="small muted num">{{ offset() + 1 }}\u2013{{ offset() + rows().length }} of {{ total() | num: 0 }}</span>
            <span class="spacer"></span>
            <button class="btn btn-secondary btn-sm" [disabled]="offset() === 0" (click)="page(-1)"><vc-icon name="chevron-left" [size]="14" />Previous</button>
            <button class="btn btn-secondary btn-sm" [disabled]="offset() + rows().length >= total()" (click)="page(1)">Next<vc-icon name="chevron-right" [size]="14" /></button>
          </div>
        }
      </section>
    } @else {
      <section class="card">
        @if (fposLoading()) {
          <vc-loading [rows]="5" />
        } @else if (fposError()) {
          <div class="card-body"><vc-error title="Couldn't load FPOs" [message]="fposError()!" /></div>
        } @else if (!fpos().length) {
          <vc-empty icon="building" title="No farmer producer organisations yet"
            text="FPOs group farmers locally. Add one to organise enrolment and payments by collective.">
            @if (canManage) { <button class="btn btn-primary" (click)="openFpo()"><vc-icon name="plus" />Add FPO</button> }
          </vc-empty>
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Name</th><th>Registration no.</th><th>District / state</th><th>Contact</th><th>Added</th><th></th></tr></thead>
              <tbody>
                @for (f of fpos(); track f.id) {
                  <tr>
                    <td><strong>{{ f.name }}</strong></td>
                    <td class="mono small">{{ f.registration_no || '\u2014' }}</td>
                    <td>{{ f.district || '\u2014' }}<span class="subtle">{{ f.state ? ', ' + f.state : '' }}</span></td>
                    <td>{{ f.contact_name || '\u2014' }} @if (f.contact_phone) { <span class="subtle small num">\xB7 {{ f.contact_phone }}</span> }</td>
                    <td class="nowrap">{{ f.created_at | day }}</td>
                    <td class="num"><button class="btn btn-ghost btn-sm" (click)="showFpoFarmers(f)">View farmers<vc-icon name="arrow-right" [size]="14" /></button></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    }

    <!-- add farmer drawer -->
    <vc-modal [(open)]="createOpen" [drawer]="true" width="520px" title="Add farmer"
      subtitle="Check membership first \u2014 members bring their farms and devices with them.">
      <form class="stack" style="--gap:14px" id="farmer-form" (ngSubmit)="create()">
        <div class="field">
          <label for="fph">Mobile number</label>
          <div class="row" style="--gap:8px">
            <input id="fph" class="input num" name="phone" inputmode="tel" [(ngModel)]="form.phone" (ngModelChange)="lookup.set(null)"
              placeholder="+91 98450 12345" [class.invalid]="fe()['phone']" />
            <button type="button" class="btn btn-secondary" (click)="checkMember()" [disabled]="looking() || form.phone.trim().length < 6">
              <vc-icon name="verified" />{{ looking() ? 'Checking\u2026' : 'Check membership' }}
            </button>
          </div>
          @if (fe()['phone']) { <span class="error">{{ fe()['phone'] }}</span> }
          @else { <span class="hint">Checks the Varsapradaya member platform. Nothing is saved until you add the farmer.</span> }
        </div>
        @if (lookupError()) { <vc-error title="Couldn't check membership" [message]="lookupError()!" /> }
        @if (lookup(); as r) { <vc-member-result [result]="r" /> }

        <div class="field">
          <label for="fnm">Full name</label>
          <input id="fnm" class="input" name="name" [(ngModel)]="form.full_name" placeholder="As on their ID" [class.invalid]="fe()['full_name']" />
          @if (fe()['full_name']) { <span class="error">{{ fe()['full_name'] }}</span> }
        </div>
        <div class="form-grid">
          <div class="field"><label for="fvl">Village</label><input id="fvl" class="input" name="village" [(ngModel)]="form.village" /></div>
          <div class="field"><label for="fds">District</label><input id="fds" class="input" name="district" [(ngModel)]="form.district" /></div>
          <div class="field"><label for="fst">State</label><input id="fst" class="input" name="state" [(ngModel)]="form.state" /></div>
          <div class="field">
            <label for="flg">Preferred language</label>
            <select id="flg" class="input" name="language" [(ngModel)]="form.language">
              @for (l of langs; track l[0]) { <option [value]="l[0]">{{ l[1] }}</option> }
            </select>
          </div>
          <div class="field span-2">
            <label for="ffp">FPO <span class="subtle">(optional)</span></label>
            <select id="ffp" class="input" name="fpo" [(ngModel)]="form.fpo_id">
              <option value="">Not part of an FPO</option>
              @for (f of fpos(); track f.id) { <option [value]="f.id">{{ f.name }}</option> }
            </select>
          </div>
        </div>
        @if (lookup()?.is_member) {
          <label class="checkbox"><input type="checkbox" name="link" [(ngModel)]="form.link" />Link to Varsapradaya member {{ lookup()?.member_id }}</label>
        }
        @if (formError()) { <vc-error title="Couldn't add the farmer" [message]="formError()!" /> }
      </form>
      <ng-container footer>
        <button class="btn btn-secondary" type="button" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="farmer-form" [disabled]="saving() || !form.full_name.trim() || form.phone.trim().length < 6">
          {{ saving() ? 'Adding\u2026' : 'Add farmer' }}
        </button>
      </ng-container>
    </vc-modal>

    <!-- add FPO -->
    <vc-modal [(open)]="fpoOpen" title="Add farmer producer organisation" width="560px">
      <form class="form-grid" id="fpo-form" (ngSubmit)="createFpo()">
        <div class="field span-2">
          <label for="on">Name</label>
          <input id="on" class="input" name="name" [(ngModel)]="fpoForm.name" placeholder="Malnad Growers Producer Company" />
        </div>
        <div class="field span-2">
          <label for="or">Registration number <span class="subtle">(optional)</span></label>
          <input id="or" class="input mono" name="reg" [(ngModel)]="fpoForm.registration_no" placeholder="U01100KA2019PTC123456" />
        </div>
        <div class="field"><label for="od">District</label><input id="od" class="input" name="district" [(ngModel)]="fpoForm.district" /></div>
        <div class="field"><label for="os">State</label><input id="os" class="input" name="state" [(ngModel)]="fpoForm.state" /></div>
        <div class="field"><label for="ocn">Contact person</label><input id="ocn" class="input" name="cn" [(ngModel)]="fpoForm.contact_name" /></div>
        <div class="field"><label for="ocp">Contact phone</label><input id="ocp" class="input num" name="cp" [(ngModel)]="fpoForm.contact_phone" /></div>
        @if (fpoError()) { <div class="span-2"><vc-error title="Couldn't add the FPO" [message]="fpoError()!" /></div> }
      </form>
      <ng-container footer>
        <button class="btn btn-secondary" type="button" (click)="fpoOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="fpo-form" [disabled]="saving() || fpoForm.name.trim().length < 2">{{ saving() ? 'Adding\u2026' : 'Add FPO' }}</button>
      </ng-container>
    </vc-modal>
  `, styles: ["/* angular:styles/component:scss;09b6a5c8ba612b6f;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\farmers\\farmers.page.ts */\n.filters {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n}\n.search {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n  max-width: 420px;\n}\n.search vc-icon {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--text-3);\n}\n.search .input {\n  padding-left: 34px;\n}\n.w {\n  width: 200px;\n}\n.who {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.av {\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: var(--forest-100);\n  color: var(--forest-700);\n  font-size: 12px;\n  font-weight: 600;\n  flex: none;\n}\n.nm {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.3;\n}\n.member {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  height: 22px;\n  padding: 0 9px;\n  border-radius: 999px;\n  background: var(--forest-50);\n  border: 1px solid var(--forest-200);\n  color: var(--forest-700);\n  font-size: 12px;\n  font-weight: 500;\n  white-space: nowrap;\n}\n.pager {\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=farmers.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FarmersPage, { className: "FarmersPage", filePath: "src/app/features/farmers/farmers.page.ts", lineNumber: 225 });
})();

// src/app/features/farmers/farmers.routes.ts
var farmers_routes_default = [
  { path: "", component: FarmersPage, title: "Farmers \xB7 Varsapradaya Carbon" },
  { path: ":id", component: FarmerDetailPage, title: "Farmer \xB7 Varsapradaya Carbon" }
];
export {
  farmers_routes_default as default
};
//# debugId=c0ab7f44-9e30-569d-b00d-2c79c47bcf59
//# sourceMappingURL=chunk-LSVLHCTM.js.map
