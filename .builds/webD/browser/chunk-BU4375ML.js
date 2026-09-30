import {
  ConfirmDialog
} from "./chunk-VLAABCYZ.js";
import {
  LANGUAGES,
  PURPOSES,
  PURPOSE_KEYS
} from "./chunk-UGCL2JDF.js";
import {
  fieldMap,
  formMessage
} from "./chunk-NPXRRJEC.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  DefaultValueAccessor,
  FormsModule,
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
  AgoPipe,
  DayPipe
} from "./chunk-E5UDMWWN.js";
import {
  AuthService
} from "./chunk-G6POHVBO.js";
import {
  Badge,
  Callout,
  Empty,
  ErrorBox,
  Loading,
  Modal,
  PageHeader
} from "./chunk-3GJ7OF6Y.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  __spreadProps,
  __spreadValues,
  catchError,
  computed,
  inject,
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
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/agreements/agreements.page.ts
var _c0 = (a0) => [a0];
var _forTrack0 = ($index, $item) => $item.id;
var _forTrack1 = ($index, $item) => $item.code;
function AgreementsPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 42);
    \u0275\u0275listener("click", function AgreementsPage_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openNew());
    });
    \u0275\u0275element(1, "vc-icon", 43);
    \u0275\u0275text(2, "New agreement");
    \u0275\u0275elementEnd();
  }
}
function AgreementsPage_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 5);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 5);
  }
}
function AgreementsPage_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275element(1, "vc-error", 44);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function AgreementsPage_Conditional_8_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 46);
    \u0275\u0275listener("click", function AgreementsPage_Conditional_8_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openNew());
    });
    \u0275\u0275element(1, "vc-icon", 43);
    \u0275\u0275text(2, "New agreement");
    \u0275\u0275elementEnd();
  }
}
function AgreementsPage_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-empty", 7);
    \u0275\u0275conditionalCreate(1, AgreementsPage_Conditional_8_Conditional_1_Template, 3, 0, "button", 45);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canManage ? 1 : -1);
  }
}
function AgreementsPage_Conditional_9_For_19_For_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49)(1, "strong");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 61);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r5.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r5.code);
  }
}
function AgreementsPage_Conditional_9_For_19_For_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 62);
    \u0275\u0275listener("click", function AgreementsPage_Conditional_9_For_19_For_1_Conditional_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const g_r7 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggle(g_r7.code));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r7 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.expanded() === g_r7.code ? "Hide" : g_r7.versions.length - 1 + " older");
  }
}
function AgreementsPage_Conditional_9_For_19_For_1_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r8 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.purposeLabel(p_r8));
  }
}
function AgreementsPage_Conditional_9_For_19_For_1_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 63);
    \u0275\u0275listener("click", function AgreementsPage_Conditional_9_For_19_For_1_Conditional_23_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const t_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.edit(t_r5));
    });
    \u0275\u0275element(1, "vc-icon", 64);
    \u0275\u0275text(2, "Edit");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 65);
    \u0275\u0275listener("click", function AgreementsPage_Conditional_9_For_19_For_1_Conditional_23_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r9);
      const t_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.askPublish(t_r5));
    });
    \u0275\u0275text(4, "Publish");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function AgreementsPage_Conditional_9_For_19_For_1_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 63);
    \u0275\u0275listener("click", function AgreementsPage_Conditional_9_For_19_For_1_Conditional_24_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const t_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.askVersion(t_r5));
    });
    \u0275\u0275element(1, "vc-icon", 66);
    \u0275\u0275text(2, "New version");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function AgreementsPage_Conditional_9_For_19_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "tr")(1, "td");
    \u0275\u0275conditionalCreate(2, AgreementsPage_Conditional_9_For_19_For_1_Conditional_2_Template, 5, 2, "div", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "td", 50);
    \u0275\u0275text(4);
    \u0275\u0275conditionalCreate(5, AgreementsPage_Conditional_9_For_19_For_1_Conditional_5_Template, 2, 1, "button", 51);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "td");
    \u0275\u0275element(7, "vc-badge", 52);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "td")(9, "div", 53);
    \u0275\u0275repeaterCreate(10, AgreementsPage_Conditional_9_For_19_For_1_For_11_Template, 2, 1, "span", 54, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "td", 55);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "td", 56)(15, "span", 57);
    \u0275\u0275pipe(16, "day");
    \u0275\u0275text(17);
    \u0275\u0275pipe(18, "ago");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "td", 50)(20, "button", 58);
    \u0275\u0275listener("click", function AgreementsPage_Conditional_9_For_19_For_1_Template_button_click_20_listener() {
      const t_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.view(t_r5));
    });
    \u0275\u0275element(21, "vc-icon", 59);
    \u0275\u0275text(22, "View");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(23, AgreementsPage_Conditional_9_For_19_For_1_Conditional_23_Template, 5, 1);
    \u0275\u0275conditionalCreate(24, AgreementsPage_Conditional_9_For_19_For_1_Conditional_24_Template, 3, 1, "button", 60);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r5 = ctx.$implicit;
    const \u0275$index_65_r11 = ctx.$index;
    const g_r7 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("older", !(\u0275$index_65_r11 === 0));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(\u0275$index_65_r11 === 0 ? 2 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" v", t_r5.version, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(\u0275$index_65_r11 === 0 && g_r7.versions.length > 1 ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("status", t_r5.status);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(t_r5.purposes);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.langs(t_r5));
    \u0275\u0275advance(2);
    \u0275\u0275property("title", \u0275\u0275pipeBind2(16, 12, t_r5.updated_at, true));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(18, 15, t_r5.updated_at));
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 14);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.canManage && t_r5.status === "draft" ? 23 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.canManage && \u0275$index_65_r11 === 0 && t_r5.status === "published" && !g_r7.hasDraft ? 24 : -1);
  }
}
function AgreementsPage_Conditional_9_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AgreementsPage_Conditional_9_For_19_For_1_Template, 25, 17, "tr", 48, _forTrack0);
  }
  if (rf & 2) {
    const g_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275repeater(ctx_r1.expanded() === g_r7.code ? g_r7.versions : \u0275\u0275pureFunction1(0, _c0, g_r7.latest));
  }
}
function AgreementsPage_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "table", 47)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Agreement");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Version");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Consent purposes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Languages");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "th");
    \u0275\u0275text(15, "Updated");
    \u0275\u0275elementEnd();
    \u0275\u0275element(16, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "tbody");
    \u0275\u0275repeaterCreate(18, AgreementsPage_Conditional_9_For_19_Template, 2, 2, null, null, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r1.groups());
  }
}
function AgreementsPage_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.fe()["title"]);
  }
}
function AgreementsPage_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.fe()["code"]);
  }
}
function AgreementsPage_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 18);
    \u0275\u0275text(1, "Stays the same across versions.");
    \u0275\u0275elementEnd();
  }
}
function AgreementsPage_For_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 23);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r12 = ctx.$implicit;
    \u0275\u0275property("value", p_r12.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r12.name);
  }
}
function AgreementsPage_For_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 67)(1, "input", 68);
    \u0275\u0275listener("change", function AgreementsPage_For_39_Template_input_change_1_listener() {
      const k_r14 = \u0275\u0275restoreView(_r13).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.togglePurpose(k_r14));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span")(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const k_r14 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r1.f.purposes.includes(k_r14));
    \u0275\u0275advance();
    \u0275\u0275property("checked", ctx_r1.f.purposes.includes(k_r14));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.purposeLabel(k_r14));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.purposeText(k_r14));
  }
}
function AgreementsPage_Conditional_40_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.fe()["purposes"]);
  }
}
function AgreementsPage_Conditional_54_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 32);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.formError());
  }
}
function AgreementsPage_Conditional_63_For_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r15 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.purposeLabel(p_r15));
  }
}
function AgreementsPage_Conditional_63_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "span", 69);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 70);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const l_r16 = ctx.$implicit;
    const t_r17 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.langName(l_r16));
    \u0275\u0275advance();
    \u0275\u0275attribute("lang", l_r16);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r17.body[l_r16]);
  }
}
function AgreementsPage_Conditional_63_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38)(1, "div", 53);
    \u0275\u0275repeaterCreate(2, AgreementsPage_Conditional_63_For_3_Template, 2, 1, "span", 54, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 26);
    \u0275\u0275repeaterCreate(5, AgreementsPage_Conditional_63_For_6_Template, 5, 3, "div", 12, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r17 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275repeater(t_r17.purposes);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.bodyLangs(t_r17));
  }
}
function AgreementsPage_Conditional_68_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 71);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r18 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Only ", ctx_r1.langName(ctx_r1.bodyLangs(t_r18)[0]), " text is written. Farmers who read another language can\u2019t sign this version.");
  }
}
function AgreementsPage_Conditional_68_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, AgreementsPage_Conditional_68_Conditional_0_Template, 2, 1, "vc-callout", 71);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.bodyLangs(ctx).length < 2 ? 0 : -1);
  }
}
var AgreementsPage = class _AgreementsPage {
  api = inject(ApiService);
  toast = inject(ToastService);
  canManage = inject(AuthService).can("programmes.manage");
  purposeKeys = PURPOSE_KEYS;
  all = signal(
    [],
    ...ngDevMode ? [{ debugName: "all" }] : (
      /* istanbul ignore next */
      []
    )
  );
  programmes = signal(
    [],
    ...ngDevMode ? [{ debugName: "programmes" }] : (
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
  expanded = signal(
    null,
    ...ngDevMode ? [{ debugName: "expanded" }] : (
      /* istanbul ignore next */
      []
    )
  );
  groups = computed(
    () => {
      const by = /* @__PURE__ */ new Map();
      for (const t of this.all())
        by.set(t.code, [...by.get(t.code) ?? [], t]);
      return [...by.entries()].map(([code, vs]) => {
        const versions = [...vs].sort((a, b) => b.version - a.version);
        return { code, latest: versions[0], versions, hasDraft: versions.some((v) => v.status === "draft") };
      }).sort((a, b) => a.latest.title.localeCompare(b.latest.title));
    },
    ...ngDevMode ? [{ debugName: "groups" }] : (
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
  editOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "editOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  editing = signal(
    null,
    ...ngDevMode ? [{ debugName: "editing" }] : (
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
  f = this.blank();
  viewOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "viewOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  viewing = signal(
    null,
    ...ngDevMode ? [{ debugName: "viewing" }] : (
      /* istanbul ignore next */
      []
    )
  );
  publishOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "publishOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  versionOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "versionOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  target = signal(
    null,
    ...ngDevMode ? [{ debugName: "target" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.load();
    this.api.get("/programmes").pipe(catchError(() => of([]))).subscribe((p) => this.programmes.set(p));
  }
  purposeLabel(p) {
    return PURPOSES[p]?.label ?? p;
  }
  purposeText(p) {
    return PURPOSES[p]?.text ?? "";
  }
  langName(l) {
    return l ? LANGUAGES[l] ?? l.toUpperCase() : "";
  }
  bodyLangs(t) {
    return Object.keys(t.body).filter((k) => t.body[k]?.trim());
  }
  langs(t) {
    return this.bodyLangs(t).map((l) => this.langName(l)).join(", ") || "\u2014";
  }
  words(s) {
    return s.trim() ? s.trim().split(/\s+/).length : 0;
  }
  toggle(code) {
    this.expanded.set(this.expanded() === code ? null : code);
  }
  load() {
    this.loading.set(true);
    this.error.set(null);
    this.api.get("/agreement-templates").subscribe({
      next: (r) => {
        this.all.set(r);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e.message);
        this.loading.set(false);
      }
    });
  }
  blank() {
    return { title: "", code: "", programme_id: "", purposes: ["sampling", "data_use"], en: "", kn: "" };
  }
  canSave() {
    return this.f.title.trim().length >= 2 && this.f.code.trim().length >= 2 && this.f.purposes.length > 0 && (this.f.en.trim() || this.f.kn.trim());
  }
  togglePurpose(k) {
    const p = this.f.purposes;
    this.f.purposes = p.includes(k) ? p.filter((x) => x !== k) : [...p, k];
  }
  openNew() {
    this.editing.set(null);
    this.f = this.blank();
    this.formError.set(null);
    this.fe.set({});
    this.editOpen.set(true);
  }
  edit(t) {
    this.editing.set(t);
    this.f = {
      title: t.title,
      code: t.code,
      programme_id: t.programme_id ?? "",
      purposes: [...t.purposes],
      en: t.body["en"] ?? "",
      kn: t.body["kn"] ?? ""
    };
    this.formError.set(null);
    this.fe.set({});
    this.editOpen.set(true);
  }
  view(t) {
    this.viewing.set(t);
    this.viewOpen.set(true);
  }
  save() {
    const f = this.f;
    const body = {};
    if (f.en.trim())
      body["en"] = f.en.trim();
    if (f.kn.trim())
      body["kn"] = f.kn.trim();
    const ed = this.editing();
    if (ed) {
      for (const [k, v] of Object.entries(ed.body))
        if (k !== "en" && k !== "kn")
          body[k] = v;
    }
    const payload = { title: f.title.trim(), purposes: f.purposes, body, programme_id: f.programme_id || null };
    this.busy.set(true);
    this.formError.set(null);
    const req = ed ? this.api.patch(`/agreement-templates/${ed.id}`, payload) : this.api.post("/agreement-templates", __spreadProps(__spreadValues({}, payload), { code: f.code.trim() }));
    req.subscribe({
      next: (t) => {
        this.busy.set(false);
        this.editOpen.set(false);
        this.toast.success("Draft saved", `${t.title} \xB7 v${t.version}`);
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        const m = fieldMap(e);
        this.fe.set(m);
        this.formError.set(formMessage(e, m) ?? (m["body"] ? m["body"] : null));
      }
    });
  }
  askPublish(t) {
    this.target.set(t);
    this.publishOpen.set(true);
  }
  askVersion(t) {
    this.target.set(t);
    this.versionOpen.set(true);
  }
  publish() {
    const t = this.target();
    if (!t)
      return;
    this.busy.set(true);
    this.api.post(`/agreement-templates/${t.id}/publish`).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.publishOpen.set(false);
        this.toast.success("Agreement published", `${r.title} v${r.version} can now be signed.`);
        this.load();
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.apiError(e, "Couldn't publish");
      }
    });
  }
  newVersion() {
    const t = this.target();
    if (!t)
      return;
    this.busy.set(true);
    this.api.post(`/agreement-templates/${t.id}/new-version`).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.versionOpen.set(false);
        this.toast.success("New draft created", `v${r.version} is ready to edit.`);
        this.load();
        this.edit(r);
      },
      error: (e) => {
        this.busy.set(false);
        this.toast.apiError(e, "Couldn't create a new version");
      }
    });
  }
  static \u0275fac = function AgreementsPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AgreementsPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AgreementsPage, selectors: [["vc-agreements-page"]], decls: 70, vars: 33, consts: [["title", "Agreements & consent", "eyebrow", "Programmes", "subtitle", "Participation agreements farmers sign, in their own language. Each covers named consent purposes. Published versions are frozen so every signature points to exact text."], ["actions", "", 1, "btn", "btn-secondary", 3, "click"], ["name", "refresh"], ["actions", "", 1, "btn", "btn-primary"], [1, "card"], [3, "rows"], [1, "card-body"], ["icon", "handshake", "title", "No agreements yet", "text", "Write the participation agreement once in English and Kannada, choose the purposes it covers, then publish it so field teams can have farmers sign it."], [1, "table-wrap"], ["width", "1040px", "subtitle", "Drafts can be changed freely. Once published, the text is frozen.", 3, "openChange", "open", "title"], ["id", "tpl-form", 1, "stack", 2, "--gap", "16px", 3, "ngSubmit"], [1, "form-grid", "three"], [1, "field"], ["for", "tt"], ["id", "tt", "name", "title", "placeholder", "Farmer participation agreement", 1, "input", 3, "ngModelChange", "ngModel"], [1, "error"], ["for", "tc"], ["id", "tc", "name", "code", "placeholder", "PARTICIPATION", 1, "input", "mono", 3, "ngModelChange", "ngModel", "disabled"], [1, "hint"], ["for", "tp"], [1, "subtle"], ["id", "tp", "name", "prog", 1, "input", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "purposes"], [1, "pur", 3, "on"], [1, "bodies"], ["for", "ben"], ["id", "ben", "name", "en", "placeholder", "Write the agreement in plain English\u2026", 1, "input", "body", 3, "ngModelChange", "ngModel"], [1, "hint", "num"], ["for", "bkn"], ["id", "bkn", "name", "kn", "lang", "kn", "placeholder", "\u0C92\u0CAA\u0CCD\u0CAA\u0C82\u0CA6\u0CA6 \u0CAA\u0CA0\u0CCD\u0CAF\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0C87\u0CB2\u0CCD\u0CB2\u0CBF \u0CAC\u0CB0\u0CC6\u0CAF\u0CBF\u0CB0\u0CBF\u2026", 1, "input", "body", "kn", 3, "ngModelChange", "ngModel"], ["title", "Couldn't save the agreement", 3, "message"], ["footer", ""], [1, "footnote", "small", "subtle"], ["type", "button", 1, "btn", "btn-secondary", 3, "click"], ["type", "submit", "form", "tpl-form", 1, "btn", "btn-primary", 3, "disabled"], ["width", "1040px", 3, "openChange", "open", "title", "subtitle"], [1, "stack", 2, "--gap", "14px"], [1, "btn", "btn-secondary", 3, "click"], ["title", "Publish agreement", "confirmLabel", "Publish", "icon", "lock", 3, "openChange", "confirmed", "open", "busy", "message"], ["title", "Create a new version", "confirmLabel", "Create draft", "icon", "branch", 3, "openChange", "confirmed", "open", "busy", "message"], ["actions", "", 1, "btn", "btn-primary", 3, "click"], ["name", "plus"], ["title", "Couldn't load agreements", 3, "message"], [1, "btn", "btn-primary"], [1, "btn", "btn-primary", 3, "click"], [1, "table"], [3, "older"], [1, "tt"], [1, "num", "nowrap"], [1, "linkbtn"], [3, "status"], [1, "chips"], [1, "chip"], [1, "small"], [1, "nowrap"], [3, "title"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["name", "eye", 3, "size"], [1, "btn", "btn-secondary", "btn-sm"], [1, "mono", "small", "subtle"], [1, "linkbtn", 3, "click"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["name", "pencil", 3, "size"], [1, "btn", "btn-primary", "btn-sm", 3, "click"], ["name", "branch", 3, "size"], [1, "pur"], ["type", "checkbox", 3, "change", "checked"], [1, "label"], [1, "read"], ["tone", "warn", "icon", "alert"]], template: function AgreementsPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0)(1, "button", 1);
      \u0275\u0275listener("click", function AgreementsPage_Template_button_click_1_listener() {
        return ctx.load();
      });
      \u0275\u0275element(2, "vc-icon", 2);
      \u0275\u0275text(3, "Refresh");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, AgreementsPage_Conditional_4_Template, 3, 0, "button", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "section", 4);
      \u0275\u0275conditionalCreate(6, AgreementsPage_Conditional_6_Template, 1, 1, "vc-loading", 5)(7, AgreementsPage_Conditional_7_Template, 2, 1, "div", 6)(8, AgreementsPage_Conditional_8_Template, 2, 1, "vc-empty", 7)(9, AgreementsPage_Conditional_9_Template, 20, 0, "div", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "vc-modal", 9);
      \u0275\u0275twoWayListener("openChange", function AgreementsPage_Template_vc_modal_openChange_10_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.editOpen, $event) || (ctx.editOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(11, "form", 10);
      \u0275\u0275listener("ngSubmit", function AgreementsPage_Template_form_ngSubmit_11_listener() {
        return ctx.save();
      });
      \u0275\u0275elementStart(12, "div", 11)(13, "div", 12)(14, "label", 13);
      \u0275\u0275text(15, "Title");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "input", 14);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function AgreementsPage_Template_input_ngModelChange_16_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.title, $event) || (ctx.f.title = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(17, AgreementsPage_Conditional_17_Template, 2, 1, "span", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 12)(19, "label", 16);
      \u0275\u0275text(20, "Code");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "input", 17);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function AgreementsPage_Template_input_ngModelChange_21_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.code, $event) || (ctx.f.code = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(22, AgreementsPage_Conditional_22_Template, 2, 1, "span", 15)(23, AgreementsPage_Conditional_23_Template, 2, 0, "span", 18);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "div", 12)(25, "label", 19);
      \u0275\u0275text(26, "Programme ");
      \u0275\u0275elementStart(27, "span", 20);
      \u0275\u0275text(28, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "select", 21);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function AgreementsPage_Template_select_ngModelChange_29_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.programme_id, $event) || (ctx.f.programme_id = $event);
        return $event;
      });
      \u0275\u0275elementStart(30, "option", 22);
      \u0275\u0275text(31, "All programmes");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(32, AgreementsPage_For_33_Template, 2, 2, "option", 23, _forTrack0);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(34, "div", 12)(35, "label");
      \u0275\u0275text(36, "Consent purposes this agreement covers");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "div", 24);
      \u0275\u0275repeaterCreate(38, AgreementsPage_For_39_Template, 7, 5, "label", 25, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(40, AgreementsPage_Conditional_40_Template, 2, 1, "span", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "div", 26)(42, "div", 12)(43, "label", 27);
      \u0275\u0275text(44, "English");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "textarea", 28);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function AgreementsPage_Template_textarea_ngModelChange_45_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.en, $event) || (ctx.f.en = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(46, "span", 29);
      \u0275\u0275text(47);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(48, "div", 12)(49, "label", 30);
      \u0275\u0275text(50, "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1 \xB7 Kannada");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "textarea", 31);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function AgreementsPage_Template_textarea_ngModelChange_51_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.kn, $event) || (ctx.f.kn = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "span", 29);
      \u0275\u0275text(53);
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(54, AgreementsPage_Conditional_54_Template, 1, 1, "vc-error", 32);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(55, 33);
      \u0275\u0275elementStart(56, "span", 34);
      \u0275\u0275text(57, "Farmers can only sign in a language that has text.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "button", 35);
      \u0275\u0275listener("click", function AgreementsPage_Template_button_click_58_listener() {
        return ctx.editOpen.set(false);
      });
      \u0275\u0275text(59, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(60, "button", 36);
      \u0275\u0275text(61);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(62, "vc-modal", 37);
      \u0275\u0275twoWayListener("openChange", function AgreementsPage_Template_vc_modal_openChange_62_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.viewOpen, $event) || (ctx.viewOpen = $event);
        return $event;
      });
      \u0275\u0275conditionalCreate(63, AgreementsPage_Conditional_63_Template, 7, 0, "div", 38);
      \u0275\u0275elementContainerStart(64, 33);
      \u0275\u0275elementStart(65, "button", 39);
      \u0275\u0275listener("click", function AgreementsPage_Template_button_click_65_listener() {
        return ctx.viewOpen.set(false);
      });
      \u0275\u0275text(66, "Close");
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(67, "vc-confirm", 40);
      \u0275\u0275twoWayListener("openChange", function AgreementsPage_Template_vc_confirm_openChange_67_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.publishOpen, $event) || (ctx.publishOpen = $event);
        return $event;
      });
      \u0275\u0275listener("confirmed", function AgreementsPage_Template_vc_confirm_confirmed_67_listener() {
        return ctx.publish();
      });
      \u0275\u0275conditionalCreate(68, AgreementsPage_Conditional_68_Template, 1, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(69, "vc-confirm", 41);
      \u0275\u0275twoWayListener("openChange", function AgreementsPage_Template_vc_confirm_openChange_69_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.versionOpen, $event) || (ctx.versionOpen = $event);
        return $event;
      });
      \u0275\u0275listener("confirmed", function AgreementsPage_Template_vc_confirm_confirmed_69_listener() {
        return ctx.newVersion();
      });
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_30_0;
      let tmp_34_0;
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.canManage ? 4 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 6 : ctx.error() ? 7 : !ctx.groups().length ? 8 : 9);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("open", ctx.editOpen);
      \u0275\u0275property("title", ctx.editing() ? "Edit draft \xB7 v" + ctx.editing().version : "New agreement");
      \u0275\u0275advance(6);
      \u0275\u0275classProp("invalid", ctx.fe()["title"]);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.title);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.fe()["title"] ? 17 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("invalid", ctx.fe()["code"]);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.code);
      \u0275\u0275property("disabled", !!ctx.editing());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.fe()["code"] ? 22 : 23);
      \u0275\u0275advance(7);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.programme_id);
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.programmes());
      \u0275\u0275advance(6);
      \u0275\u0275repeater(ctx.purposeKeys);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.fe()["purposes"] ? 40 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.en);
      \u0275\u0275control();
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("", ctx.words(ctx.f.en), " words");
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.kn);
      \u0275\u0275control();
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1("", ctx.words(ctx.f.kn), " words");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.formError() ? 54 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275property("disabled", ctx.busy() || !ctx.canSave());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.busy() ? "Saving\u2026" : "Save draft");
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.viewOpen);
      \u0275\u0275property("title", (ctx.viewing()?.title ?? "") + " \xB7 v" + (ctx.viewing()?.version ?? ""))("subtitle", ctx.viewing()?.status === "published" ? "Published \u2014 this text is frozen." : "Draft");
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_30_0 = ctx.viewing()) ? 63 : -1, tmp_30_0);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("open", ctx.publishOpen);
      \u0275\u0275property("busy", ctx.busy())("message", "Publishing v" + (ctx.target()?.version ?? "") + " of " + (ctx.target()?.title ?? "") + " makes it available for signing and freezes its text. To change it later you\u2019ll create a new version; farmers who already signed keep the version they signed.");
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_34_0 = ctx.target()) ? 68 : -1, tmp_34_0);
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.versionOpen);
      \u0275\u0275property("busy", ctx.busy())("message", "This copies v" + (ctx.target()?.version ?? "") + " into a new draft you can edit. The published version stays signable until the new one is published.");
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm, PageHeader, Loading, ErrorBox, Empty, Badge, Modal, Icon, Callout, ConfirmDialog, DayPipe, AgoPipe], styles: ['\n.tt[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n}\ntr.older[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background: var(--%NS%surface-2);\n  color: var(--%NS%text-2);\n}\n.linkbtn[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  padding: 0 0 0 6px;\n  font: 500 12px var(--%NS%font);\n  color: var(--%NS%primary);\n  cursor: pointer;\n}\n.linkbtn[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.chips[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px;\n}\n.chip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  height: 22px;\n  padding: 0 8px;\n  border-radius: 5px;\n  background: var(--%NS%forest-50);\n  border: 1px solid var(--%NS%forest-100);\n  font-size: 12px;\n  color: var(--%NS%forest-800);\n  white-space: nowrap;\n}\ntd[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]    + .btn[_ngcontent-%COMP%] {\n  margin-left: 6px;\n}\n.three[_ngcontent-%COMP%] {\n  grid-template-columns: 1.4fr 1fr 1fr;\n}\n@media (max-width: 900px) {\n  .three[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.purposes[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 8px;\n}\n@media (max-width: 900px) {\n  .purposes[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n.pur[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 10px 12px;\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n  cursor: pointer;\n  background: var(--%NS%surface);\n}\n.pur[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%stone-400);\n}\n.pur.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-400);\n  background: var(--%NS%forest-50);\n}\n.pur[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  accent-color: var(--%NS%primary);\n  margin-top: 2px;\n  width: 15px;\n  height: 15px;\n  flex: none;\n}\n.pur[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.pur[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 13px;\n}\n.pur[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-2);\n  line-height: 1.4;\n}\n.bodies[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 16px;\n}\n@media (max-width: 900px) {\n  .bodies[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\ntextarea.body[_ngcontent-%COMP%] {\n  min-height: 300px;\n  font-size: 13.5px;\n  line-height: 1.65;\n}\ntextarea.kn[_ngcontent-%COMP%], \n.read[lang=kn][_ngcontent-%COMP%] {\n  font-family: "Noto Sans Kannada", var(--%NS%font);\n}\n.read[_ngcontent-%COMP%] {\n  max-height: 52vh;\n  overflow: auto;\n  padding: 14px 16px;\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n  background: var(--%NS%surface-2);\n  white-space: pre-wrap;\n  line-height: 1.65;\n  font-size: 13.5px;\n}\n.footnote[_ngcontent-%COMP%] {\n  margin-right: auto;\n}\n/*# sourceMappingURL=agreements.page.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AgreementsPage, [{
    type: Component,
    args: [{ selector: "vc-agreements-page", imports: [FormsModule, PageHeader, Loading, ErrorBox, Empty, Badge, Modal, Icon, Callout, ConfirmDialog, DayPipe, AgoPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Agreements & consent" eyebrow="Programmes"
      subtitle="Participation agreements farmers sign, in their own language. Each covers named consent purposes. Published versions are frozen so every signature points to exact text.">
      <button actions class="btn btn-secondary" (click)="load()"><vc-icon name="refresh" />Refresh</button>
      @if (canManage) { <button actions class="btn btn-primary" (click)="openNew()"><vc-icon name="plus" />New agreement</button> }
    </vc-page-header>

    <section class="card">
      @if (loading()) {
        <vc-loading [rows]="5" />
      } @else if (error()) {
        <div class="card-body"><vc-error title="Couldn't load agreements" [message]="error()!" /></div>
      } @else if (!groups().length) {
        <vc-empty icon="handshake" title="No agreements yet"
          text="Write the participation agreement once in English and Kannada, choose the purposes it covers, then publish it so field teams can have farmers sign it.">
          @if (canManage) { <button class="btn btn-primary" (click)="openNew()"><vc-icon name="plus" />New agreement</button> }
        </vc-empty>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Agreement</th><th>Version</th><th>Status</th><th>Consent purposes</th><th>Languages</th><th>Updated</th><th></th></tr></thead>
            <tbody>
              @for (g of groups(); track g.code) {
                @for (t of expanded() === g.code ? g.versions : [g.latest]; track t.id; let first = $first) {
                  <tr [class.older]="!first">
                    <td>
                      @if (first) {
                        <div class="tt"><strong>{{ t.title }}</strong><span class="mono small subtle">{{ t.code }}</span></div>
                      }
                    </td>
                    <td class="num nowrap">
                      v{{ t.version }}
                      @if (first && g.versions.length > 1) {
                        <button class="linkbtn" (click)="toggle(g.code)">{{ expanded() === g.code ? 'Hide' : g.versions.length - 1 + ' older' }}</button>
                      }
                    </td>
                    <td><vc-badge [status]="t.status" /></td>
                    <td><div class="chips">@for (p of t.purposes; track p) { <span class="chip">{{ purposeLabel(p) }}</span> }</div></td>
                    <td class="small">{{ langs(t) }}</td>
                    <td class="nowrap"><span [title]="t.updated_at | day: true">{{ t.updated_at | ago }}</span></td>
                    <td class="num nowrap">
                      <button class="btn btn-ghost btn-sm" (click)="view(t)"><vc-icon name="eye" [size]="14" />View</button>
                      @if (canManage && t.status === 'draft') {
                        <button class="btn btn-secondary btn-sm" (click)="edit(t)"><vc-icon name="pencil" [size]="14" />Edit</button>
                        <button class="btn btn-primary btn-sm" (click)="askPublish(t)">Publish</button>
                      }
                      @if (canManage && first && t.status === 'published' && !g.hasDraft) {
                        <button class="btn btn-secondary btn-sm" (click)="askVersion(t)"><vc-icon name="branch" [size]="14" />New version</button>
                      }
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    <!-- editor -->
    <vc-modal [(open)]="editOpen" width="1040px" [title]="editing() ? 'Edit draft \xB7 v' + editing()!.version : 'New agreement'"
      subtitle="Drafts can be changed freely. Once published, the text is frozen.">
      <form class="stack" style="--gap:16px" id="tpl-form" (ngSubmit)="save()">
        <div class="form-grid three">
          <div class="field">
            <label for="tt">Title</label>
            <input id="tt" class="input" name="title" [(ngModel)]="f.title" placeholder="Farmer participation agreement" [class.invalid]="fe()['title']" />
            @if (fe()['title']) { <span class="error">{{ fe()['title'] }}</span> }
          </div>
          <div class="field">
            <label for="tc">Code</label>
            <input id="tc" class="input mono" name="code" [(ngModel)]="f.code" [disabled]="!!editing()" placeholder="PARTICIPATION" [class.invalid]="fe()['code']" />
            @if (fe()['code']) { <span class="error">{{ fe()['code'] }}</span> } @else { <span class="hint">Stays the same across versions.</span> }
          </div>
          <div class="field">
            <label for="tp">Programme <span class="subtle">(optional)</span></label>
            <select id="tp" class="input" name="prog" [(ngModel)]="f.programme_id">
              <option value="">All programmes</option>
              @for (p of programmes(); track p.id) { <option [value]="p.id">{{ p.name }}</option> }
            </select>
          </div>
        </div>
        <div class="field">
          <label>Consent purposes this agreement covers</label>
          <div class="purposes">
            @for (k of purposeKeys; track k) {
              <label class="pur" [class.on]="f.purposes.includes(k)">
                <input type="checkbox" [checked]="f.purposes.includes(k)" (change)="togglePurpose(k)" />
                <span><strong>{{ purposeLabel(k) }}</strong><small>{{ purposeText(k) }}</small></span>
              </label>
            }
          </div>
          @if (fe()['purposes']) { <span class="error">{{ fe()['purposes'] }}</span> }
        </div>
        <div class="bodies">
          <div class="field">
            <label for="ben">English</label>
            <textarea id="ben" class="input body" name="en" [(ngModel)]="f.en" placeholder="Write the agreement in plain English\u2026"></textarea>
            <span class="hint num">{{ words(f.en) }} words</span>
          </div>
          <div class="field">
            <label for="bkn">\u0C95\u0CA8\u0CCD\u0CA8\u0CA1 \xB7 Kannada</label>
            <textarea id="bkn" class="input body kn" name="kn" lang="kn" [(ngModel)]="f.kn" placeholder="\u0C92\u0CAA\u0CCD\u0CAA\u0C82\u0CA6\u0CA6 \u0CAA\u0CA0\u0CCD\u0CAF\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0C87\u0CB2\u0CCD\u0CB2\u0CBF \u0CAC\u0CB0\u0CC6\u0CAF\u0CBF\u0CB0\u0CBF\u2026"></textarea>
            <span class="hint num">{{ words(f.kn) }} words</span>
          </div>
        </div>
        @if (formError()) { <vc-error title="Couldn't save the agreement" [message]="formError()!" /> }
      </form>
      <ng-container footer>
        <span class="footnote small subtle">Farmers can only sign in a language that has text.</span>
        <button class="btn btn-secondary" type="button" (click)="editOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="tpl-form" [disabled]="busy() || !canSave()">{{ busy() ? 'Saving\u2026' : 'Save draft' }}</button>
      </ng-container>
    </vc-modal>

    <!-- view -->
    <vc-modal [(open)]="viewOpen" width="1040px" [title]="(viewing()?.title ?? '') + ' \xB7 v' + (viewing()?.version ?? '')"
      [subtitle]="viewing()?.status === 'published' ? 'Published \u2014 this text is frozen.' : 'Draft'">
      @if (viewing(); as t) {
        <div class="stack" style="--gap:14px">
          <div class="chips">@for (p of t.purposes; track p) { <span class="chip">{{ purposeLabel(p) }}</span> }</div>
          <div class="bodies">
            @for (l of bodyLangs(t); track l) {
              <div class="field"><span class="label">{{ langName(l) }}</span><div class="read" [attr.lang]="l">{{ t.body[l] }}</div></div>
            }
          </div>
        </div>
      }
      <ng-container footer><button class="btn btn-secondary" (click)="viewOpen.set(false)">Close</button></ng-container>
    </vc-modal>

    <vc-confirm [(open)]="publishOpen" title="Publish agreement" confirmLabel="Publish" icon="lock" [busy]="busy()"
      [message]="'Publishing v' + (target()?.version ?? '') + ' of ' + (target()?.title ?? '') + ' makes it available for signing and freezes its text. To change it later you\u2019ll create a new version; farmers who already signed keep the version they signed.'"
      (confirmed)="publish()">
      @if (target(); as t) {
        @if (bodyLangs(t).length < 2) {
          <vc-callout tone="warn" icon="alert">Only {{ langName(bodyLangs(t)[0]) }} text is written. Farmers who read another language can\u2019t sign this version.</vc-callout>
        }
      }
    </vc-confirm>

    <vc-confirm [(open)]="versionOpen" title="Create a new version" confirmLabel="Create draft" icon="branch" [busy]="busy()"
      [message]="'This copies v' + (target()?.version ?? '') + ' into a new draft you can edit. The published version stays signable until the new one is published.'"
      (confirmed)="newVersion()" />
  `, styles: ['/* angular:styles/component:scss;148ae9c383695636;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\agreements\\agreements.page.ts */\n.tt {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n}\ntr.older td {\n  background: var(--surface-2);\n  color: var(--text-2);\n}\n.linkbtn {\n  border: 0;\n  background: none;\n  padding: 0 0 0 6px;\n  font: 500 12px var(--font);\n  color: var(--primary);\n  cursor: pointer;\n}\n.linkbtn:hover {\n  text-decoration: underline;\n}\n.chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px;\n}\n.chip {\n  display: inline-flex;\n  align-items: center;\n  height: 22px;\n  padding: 0 8px;\n  border-radius: 5px;\n  background: var(--forest-50);\n  border: 1px solid var(--forest-100);\n  font-size: 12px;\n  color: var(--forest-800);\n  white-space: nowrap;\n}\ntd .btn + .btn {\n  margin-left: 6px;\n}\n.three {\n  grid-template-columns: 1.4fr 1fr 1fr;\n}\n@media (max-width: 900px) {\n  .three {\n    grid-template-columns: 1fr;\n  }\n}\n.purposes {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 8px;\n}\n@media (max-width: 900px) {\n  .purposes {\n    grid-template-columns: 1fr;\n  }\n}\n.pur {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 10px 12px;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  cursor: pointer;\n  background: var(--surface);\n}\n.pur:hover {\n  border-color: var(--stone-400);\n}\n.pur.on {\n  border-color: var(--forest-400);\n  background: var(--forest-50);\n}\n.pur input {\n  accent-color: var(--primary);\n  margin-top: 2px;\n  width: 15px;\n  height: 15px;\n  flex: none;\n}\n.pur span {\n  display: flex;\n  flex-direction: column;\n}\n.pur strong {\n  font-size: 13px;\n}\n.pur small {\n  font-size: 12px;\n  color: var(--text-2);\n  line-height: 1.4;\n}\n.bodies {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 16px;\n}\n@media (max-width: 900px) {\n  .bodies {\n    grid-template-columns: 1fr;\n  }\n}\ntextarea.body {\n  min-height: 300px;\n  font-size: 13.5px;\n  line-height: 1.65;\n}\ntextarea.kn,\n.read[lang=kn] {\n  font-family: "Noto Sans Kannada", var(--font);\n}\n.read {\n  max-height: 52vh;\n  overflow: auto;\n  padding: 14px 16px;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  background: var(--surface-2);\n  white-space: pre-wrap;\n  line-height: 1.65;\n  font-size: 13.5px;\n}\n.footnote {\n  margin-right: auto;\n}\n/*# sourceMappingURL=agreements.page.css.map */\n'] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AgreementsPage, { className: "AgreementsPage", filePath: "src/app/features/agreements/agreements.page.ts", lineNumber: 191 });
})();

// src/app/features/agreements/agreements.routes.ts
var agreements_routes_default = [{ path: "", component: AgreementsPage, title: "Agreements & consent \xB7 Varsapradaya Carbon" }];
export {
  agreements_routes_default as default
};
//# debugId=7224b341-eade-5975-baca-96d3ab81d2ff
//# sourceMappingURL=chunk-BU4375ML.js.map
