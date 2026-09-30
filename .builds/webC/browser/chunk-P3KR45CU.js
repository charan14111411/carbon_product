import {
  ConfirmDialog
} from "./chunk-VLAABCYZ.js";
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
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  RadioControlValueAccessor,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  AgoPipe,
  DayPipe
} from "./chunk-E5UDMWWN.js";
import {
  AuthService,
  permissionGuard
} from "./chunk-PNIM44LI.js";
import {
  Badge,
  Callout,
  Empty,
  ErrorBox,
  Loading,
  Modal,
  PageHeader,
  Tabs
} from "./chunk-3GJ7OF6Y.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  Icon,
  computed,
  inject,
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
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// src/app/features/users/users.page.ts
var _forTrack0 = ($index, $item) => $item.role;
var _forTrack1 = ($index, $item) => $item.id;
var _forTrack2 = ($index, $item) => $item.key;
var _forTrack3 = ($index, $item) => $item[0];
function UsersPage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 32);
    \u0275\u0275listener("click", function UsersPage_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openCreate());
    });
    \u0275\u0275element(1, "vc-icon", 33);
    \u0275\u0275text(2, "Invite user");
    \u0275\u0275elementEnd();
  }
}
function UsersPage_Conditional_3_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r4 = ctx.$implicit;
    \u0275\u0275property("value", r_r4.role);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r4.label);
  }
}
function UsersPage_Conditional_3_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-loading", 44);
  }
  if (rf & 2) {
    \u0275\u0275property("rows", 7);
  }
}
function UsersPage_Conditional_3_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275element(1, "vc-error", 48);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r1.error());
  }
}
function UsersPage_Conditional_3_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-empty", 46);
  }
}
function UsersPage_Conditional_3_Conditional_16_For_17_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 54);
    \u0275\u0275text(1, "You");
    \u0275\u0275elementEnd();
  }
}
function UsersPage_Conditional_3_Conditional_16_For_17_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 56);
    \u0275\u0275element(1, "vc-icon", 63);
    \u0275\u0275text(2, "On");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function UsersPage_Conditional_3_Conditional_16_For_17_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 57);
    \u0275\u0275element(1, "vc-icon", 64);
    \u0275\u0275text(2, "Off");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function UsersPage_Conditional_3_Conditional_16_For_17_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 59);
    \u0275\u0275pipe(1, "day");
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "ago");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const u_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("title", \u0275\u0275pipeBind2(1, 2, u_r5.last_login_at, true));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 5, u_r5.last_login_at));
  }
}
function UsersPage_Conditional_3_Conditional_16_For_17_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275text(1, "Never");
    \u0275\u0275elementEnd();
  }
}
function UsersPage_Conditional_3_Conditional_16_For_17_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 65);
    \u0275\u0275listener("click", function UsersPage_Conditional_3_Conditional_16_For_17_Conditional_22_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const u_r5 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.openEdit(u_r5));
    });
    \u0275\u0275element(1, "vc-icon", 66);
    \u0275\u0275text(2, "Edit");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function UsersPage_Conditional_3_Conditional_16_For_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td")(2, "div", 51)(3, "span", 52);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 53)(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275conditionalCreate(8, UsersPage_Conditional_3_Conditional_16_For_17_Conditional_8_Template, 2, 0, "span", 54);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 55);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(11, "td");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "td");
    \u0275\u0275conditionalCreate(14, UsersPage_Conditional_3_Conditional_16_For_17_Conditional_14_Template, 3, 1, "span", 56)(15, UsersPage_Conditional_3_Conditional_16_For_17_Conditional_15_Template, 3, 1, "span", 57);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "td", 58);
    \u0275\u0275conditionalCreate(17, UsersPage_Conditional_3_Conditional_16_For_17_Conditional_17_Template, 4, 7, "span", 59)(18, UsersPage_Conditional_3_Conditional_16_For_17_Conditional_18_Template, 2, 0, "span", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "td");
    \u0275\u0275element(20, "vc-badge", 60);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "td", 61);
    \u0275\u0275conditionalCreate(22, UsersPage_Conditional_3_Conditional_16_For_17_Conditional_22_Template, 3, 1, "button", 62);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const u_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("dim", !u_r5.is_active);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.ini(u_r5.full_name));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", u_r5.full_name, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(u_r5.id === ctx_r1.me ? 8 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r5.email);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r5.role_label);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(u_r5.mfa_enabled ? 14 : 15);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(u_r5.last_login_at ? 17 : 18);
    \u0275\u0275advance(3);
    \u0275\u0275property("status", u_r5.is_active ? "active" : "inactive");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.canManage ? 22 : -1);
  }
}
function UsersPage_Conditional_3_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47)(1, "table", 49)(2, "thead")(3, "tr")(4, "th");
    \u0275\u0275text(5, "Name");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "th");
    \u0275\u0275text(7, "Role");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "th");
    \u0275\u0275text(9, "Two-step");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "th");
    \u0275\u0275text(11, "Last sign-in");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "th");
    \u0275\u0275text(13, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275element(14, "th");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "tbody");
    \u0275\u0275repeaterCreate(16, UsersPage_Conditional_3_Conditional_16_For_17_Template, 23, 11, "tr", 50, _forTrack1);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(16);
    \u0275\u0275repeater(ctx_r1.rows());
  }
}
function UsersPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 34)(1, "div", 35);
    \u0275\u0275element(2, "vc-icon", 36);
    \u0275\u0275elementStart(3, "input", 37);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function UsersPage_Conditional_3_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.q.set($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "select", 38);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function UsersPage_Conditional_3_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.roleFilter.set($event));
    });
    \u0275\u0275elementStart(5, "option", 39);
    \u0275\u0275text(6, "All roles");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(7, UsersPage_Conditional_3_For_8_Template, 2, 2, "option", 40, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "label", 41)(10, "input", 42);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function UsersPage_Conditional_3_Template_input_ngModelChange_10_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showInactive.set($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275text(11, "Show deactivated");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "section", 43);
    \u0275\u0275conditionalCreate(13, UsersPage_Conditional_3_Conditional_13_Template, 1, 1, "vc-loading", 44)(14, UsersPage_Conditional_3_Conditional_14_Template, 2, 1, "div", 45)(15, UsersPage_Conditional_3_Conditional_15_Template, 1, 0, "vc-empty", 46)(16, UsersPage_Conditional_3_Conditional_16_Template, 18, 0, "div", 47);
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
    \u0275\u0275property("ngModel", ctx_r1.roleFilter());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.roles());
    \u0275\u0275advance(3);
    \u0275\u0275property("ngModel", ctx_r1.showInactive());
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.loading() ? 13 : ctx_r1.error() ? 14 : !ctx_r1.rows().length ? 15 : 16);
  }
}
function UsersPage_Conditional_4_For_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 70)(1, "span", 59);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("title", ctx_r1.roleText(r_r7.role));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r7.label);
  }
}
function UsersPage_Conditional_4_For_11_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "td");
  }
}
function UsersPage_Conditional_4_For_11_For_6_For_7_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 75);
    \u0275\u0275element(1, "vc-icon", 77);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r8 = \u0275\u0275nextContext().$implicit;
    const p_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("title", r_r8.label + ": " + p_r9[1]);
    \u0275\u0275advance();
    \u0275\u0275property("size", 13)("stroke", 2.6);
  }
}
function UsersPage_Conditional_4_For_11_For_6_For_7_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 76);
  }
}
function UsersPage_Conditional_4_For_11_For_6_For_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 74);
    \u0275\u0275conditionalCreate(1, UsersPage_Conditional_4_For_11_For_6_For_7_Conditional_1_Template, 2, 3, "span", 75)(2, UsersPage_Conditional_4_For_11_For_6_For_7_Conditional_2_Template, 1, 0, "span", 76);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r8 = ctx.$implicit;
    const p_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.has(r_r8, p_r9[0]) ? 1 : 2);
  }
}
function UsersPage_Conditional_4_For_11_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr")(1, "td", 69)(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "code");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(6, UsersPage_Conditional_4_For_11_For_6_For_7_Template, 3, 1, "td", 74, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r9[1]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(p_r9[0]);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.roles());
  }
}
function UsersPage_Conditional_4_For_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "tr", 73)(1, "td", 69);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, UsersPage_Conditional_4_For_11_For_4_Template, 1, 0, "td", null, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(5, UsersPage_Conditional_4_For_11_For_6_Template, 8, 2, "tr", null, _forTrack3);
  }
  if (rf & 2) {
    const g_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275attribute("colspan", 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(g_r10.label);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.roles());
    \u0275\u0275advance(2);
    \u0275\u0275repeater(g_r10.perms);
  }
}
function UsersPage_Conditional_4_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 72)(1, "div", 17)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "span", 78);
    \u0275\u0275elementStart(5, "span", 79);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r11 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r11.label);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", r_r11.permissions.length, " permissions");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.roleText(r_r11.role));
  }
}
function UsersPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 67)(1, "div", 47)(2, "table", 68)(3, "thead")(4, "tr")(5, "th", 69);
    \u0275\u0275text(6, "Permission");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(7, UsersPage_Conditional_4_For_8_Template, 3, 2, "th", 70, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "tbody");
    \u0275\u0275repeaterCreate(10, UsersPage_Conditional_4_For_11_Template, 7, 2, null, null, _forTrack2);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(12, "div", 71);
    \u0275\u0275repeaterCreate(13, UsersPage_Conditional_4_For_14_Template, 9, 3, "div", 72, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r1.roles());
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.groups);
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.roles());
  }
}
function UsersPage_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.fe()["full_name"]);
  }
}
function UsersPage_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.fe()["email"]);
  }
}
function UsersPage_For_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 80)(1, "input", 81);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function UsersPage_For_28_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.f.role, $event) || (ctx_r1.f.role = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span")(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "small");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "span", 82);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r13 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r1.f.role === r_r13.role);
    \u0275\u0275advance();
    \u0275\u0275property("value", r_r13.role);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.f.role);
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r13.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.roleText(r_r13.role));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r13.permissions.length);
  }
}
function UsersPage_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.fe()["password"]);
  }
}
function UsersPage_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-error", 23);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("message", ctx_r1.formError());
  }
}
function UsersPage_Conditional_53_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r15 = ctx.$implicit;
    \u0275\u0275property("value", r_r15.role);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", r_r15.label, " \xB7 ", r_r15.permissions.length, " permissions");
  }
}
function UsersPage_Conditional_53_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 91);
    \u0275\u0275text(1, "You can\u2019t deactivate your own account. Ask another administrator.");
    \u0275\u0275elementEnd();
  }
}
function UsersPage_Conditional_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "div", 5)(2, "label", 83);
    \u0275\u0275text(3, "Role");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "select", 84);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function UsersPage_Conditional_53_Template_select_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.edit.role, $event) || (ctx_r1.edit.role = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275repeaterCreate(5, UsersPage_Conditional_53_For_6_Template, 2, 3, "option", 40, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 85);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 86)(10, "div")(11, "strong");
    \u0275\u0275text(12, "Account active");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p", 87);
    \u0275\u0275text(14, "Deactivated users can\u2019t sign in. Their history stays in the audit log.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "label", 88)(16, "input", 89);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function UsersPage_Conditional_53_Template_input_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.edit.is_active, $event) || (ctx_r1.edit.is_active = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(17, "span", 90);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(18, UsersPage_Conditional_53_Conditional_18_Template, 2, 0, "vc-callout", 91);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const u_r16 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.edit.role);
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.assignable());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.roleText(ctx_r1.edit.role));
    \u0275\u0275advance(7);
    \u0275\u0275classProp("disabled", u_r16.id === ctx_r1.me);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.edit.is_active);
    \u0275\u0275property("disabled", u_r16.id === ctx_r1.me);
    \u0275\u0275control();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(u_r16.id === ctx_r1.me ? 18 : -1);
  }
}
var ROLE_TEXT = {
  platform_admin: "Full access to everything, including organisation settings.",
  programme_admin: "Runs programmes: farmers, land, sampling plans, credits, sales and approvals of calculations.",
  mrv_analyst: "Runs quality checks and carbon calculations; plans sampling.",
  methodology_owner: "Owns the methodology rules and soil-carbon models, and approves sampling designs.",
  field_collector: "Uses the field app to map fields, collect soil samples and record practices.",
  lab_technician: "Enters lab results and records sample custody at the lab.",
  lab_manager: "Reviews and accepts lab results.",
  verifier: "Independent verifier with read-only access to verification packages.",
  buyer: "Credit buyer who sees their own portfolio and retirement records.",
  finance_maker: "Prepares farmer payout batches.",
  finance_checker: "Approves payout batches prepared by someone else.",
  farmer: "A farmer using the self-service portal."
};
var GROUPS = [
  { key: "admin", label: "Organisation & users", perms: [["org.manage", "Organisation settings"], ["users.manage", "Users & roles"], ["partners.manage", "Partners & API keys"]] },
  { key: "prog", label: "Programmes & land", perms: [["data.read", "View data"], ["programmes.manage", "Programmes & projects"], ["farmers.manage", "Farmers"], ["land.manage", "Fields & land"], ["catalogue.manage", "Crop catalogue"], ["practice.record", "Record practices"]] },
  { key: "method", label: "Methodology", perms: [["rules.edit", "Edit rules"], ["rules.approve", "Approve rules"]] },
  { key: "field", label: "Field & lab", perms: [["sampling.plan", "Plan sampling"], ["sampling.approve", "Approve sample plans"], ["sample.collect", "Collect samples"], ["custody.record", "Record custody"], ["lab.submit", "Enter lab results"], ["lab.review", "Review lab results"]] },
  { key: "carbon", label: "Carbon accounting", perms: [["qa.resolve", "Resolve quality issues"], ["calc.run", "Run calculations"], ["calc.approve", "Approve calculations"], ["package.issue", "Issue verification packages"], ["verify.read", "Verifier access"]] },
  { key: "intel", label: "Intelligence", perms: [["models.manage", "Manage models"], ["models.approve", "Approve models"], ["data.sync", "Sync supporting data"]] },
  { key: "money", label: "Credits & money", perms: [["credits.manage", "Credits"], ["sales.manage", "Sales"], ["buyer.read", "Buyer portfolio"], ["payout.prepare", "Prepare payouts"], ["payout.approve", "Approve payouts"], ["risk.manage", "Risk & permanence"], ["grievance.handle", "Grievances"]] },
  { key: "self", label: "Farmer self-service", perms: [["farmer.self", "Own records"]] }
];
var UsersPage = class _UsersPage {
  api = inject(ApiService);
  toast = inject(ToastService);
  auth = inject(AuthService);
  canManage = this.auth.can("users.manage");
  me = this.auth.profile()?.id;
  groups = GROUPS;
  tab = signal(
    "users",
    ...ngDevMode ? [{ debugName: "tab" }] : (
      /* istanbul ignore next */
      []
    )
  );
  all = signal(
    [],
    ...ngDevMode ? [{ debugName: "all" }] : (
      /* istanbul ignore next */
      []
    )
  );
  roles = signal(
    [],
    ...ngDevMode ? [{ debugName: "roles" }] : (
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
  roleFilter = signal(
    "",
    ...ngDevMode ? [{ debugName: "roleFilter" }] : (
      /* istanbul ignore next */
      []
    )
  );
  showInactive = signal(
    true,
    ...ngDevMode ? [{ debugName: "showInactive" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rows = computed(
    () => {
      const q = this.q().trim().toLowerCase();
      return this.all().filter((u) => (this.showInactive() || u.is_active) && (!this.roleFilter() || u.role === this.roleFilter()) && (!q || u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
    },
    ...ngDevMode ? [{ debugName: "rows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  tabs = computed(
    () => [
      { key: "users", label: "Users", count: this.all().length },
      { key: "roles", label: "Roles & permissions", count: this.roles().length }
    ],
    ...ngDevMode ? [{ debugName: "tabs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  /** Only a platform administrator can grant the administrator role. */
  assignable = computed(
    () => this.roles().filter((r) => r.role !== "platform_admin" || this.auth.profile()?.role === "platform_admin"),
    ...ngDevMode ? [{ debugName: "assignable" }] : (
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
  createOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "createOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  showPw = signal(
    false,
    ...ngDevMode ? [{ debugName: "showPw" }] : (
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
  editOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "editOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  deactivateOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "deactivateOpen" }] : (
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
  edit = { role: "", is_active: true };
  constructor() {
    this.load();
    this.api.get("/auth/roles").subscribe({ next: (r) => this.roles.set(r), error: () => {
    } });
  }
  ini(n) {
    return n.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  }
  roleText(r) {
    return ROLE_TEXT[r] ?? "";
  }
  has(r, p) {
    return r.permissions.includes(p);
  }
  mixed() {
    return /[a-z]/i.test(this.f.password) && /\d/.test(this.f.password);
  }
  load() {
    this.loading.set(true);
    this.api.get("/users").subscribe({
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
    return { full_name: "", email: "", phone: "", role: "", password: "" };
  }
  openCreate() {
    this.f = this.blank();
    this.formError.set(null);
    this.fe.set({});
    this.showPw.set(false);
    this.createOpen.set(true);
  }
  generate() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    const a = new Uint32Array(14);
    crypto.getRandomValues(a);
    let pw = Array.from(a, (n) => chars[n % chars.length]).join("");
    pw = pw.slice(0, 5) + "-" + pw.slice(5, 10) + "-" + (a[0] % 90 + 10);
    this.f.password = pw;
    this.showPw.set(true);
  }
  create() {
    const f = this.f;
    this.busy.set(true);
    this.formError.set(null);
    this.fe.set({});
    this.api.post("/users", {
      full_name: f.full_name.trim(),
      email: f.email.trim(),
      phone: f.phone.trim() || null,
      role: f.role,
      password: f.password
    }).subscribe({
      next: (u) => {
        this.busy.set(false);
        this.createOpen.set(false);
        this.all.set([...this.all(), u].sort((a, b) => a.full_name.localeCompare(b.full_name)));
        this.toast.success("User created", `${u.full_name} can now sign in as ${u.role_label}.`);
      },
      error: (e) => {
        this.busy.set(false);
        const m = fieldMap(e);
        this.fe.set(m);
        this.formError.set(formMessage(e, m));
      }
    });
  }
  openEdit(u) {
    this.editing.set(u);
    this.edit = { role: u.role, is_active: u.is_active };
    this.editOpen.set(true);
  }
  saveEdit() {
    const u = this.editing();
    if (!u)
      return;
    if (u.is_active && !this.edit.is_active) {
      this.deactivateOpen.set(true);
      return;
    }
    this.commitEdit();
  }
  commitEdit() {
    const u = this.editing();
    if (!u)
      return;
    const body = {};
    if (this.edit.role !== u.role)
      body["role"] = this.edit.role;
    if (this.edit.is_active !== u.is_active)
      body["is_active"] = this.edit.is_active;
    if (!Object.keys(body).length) {
      this.editOpen.set(false);
      return;
    }
    this.busy.set(true);
    this.api.patch(`/users/${u.id}`, body).subscribe({
      next: (r) => {
        this.busy.set(false);
        this.editOpen.set(false);
        this.deactivateOpen.set(false);
        this.all.set(this.all().map((x) => x.id === r.id ? r : x));
        this.toast.success("User updated", `${r.full_name} \xB7 ${r.role_label}${r.is_active ? "" : " \xB7 deactivated"}`);
      },
      error: (e) => {
        this.busy.set(false);
        this.deactivateOpen.set(false);
        this.toast.apiError(e, "Couldn't update the user");
      }
    });
  }
  static \u0275fac = function UsersPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UsersPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UsersPage, selectors: [["vc-users-page"]], decls: 60, vars: 41, consts: [["title", "Users & roles", "eyebrow", "Administration", "subtitle", "Who can sign in and what each role may do. Roles are fixed in code and reviewed \u2014 you choose which role each person has."], ["actions", "", 1, "btn", "btn-primary"], [3, "activeChange", "tabs", "active"], ["width", "520px", "title", "Invite user", "subtitle", "They sign in with this email and the temporary password. Share it securely.", 3, "openChange", "open", "drawer"], ["id", "user-form", 1, "stack", 2, "--gap", "14px", 3, "ngSubmit"], [1, "field"], ["for", "un"], ["id", "un", "name", "name", 1, "input", 3, "ngModelChange", "ngModel"], [1, "error"], ["for", "ue"], ["id", "ue", "type", "email", "name", "email", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "uph"], [1, "subtle"], ["id", "uph", "name", "phone", 1, "input", "num", 3, "ngModelChange", "ngModel"], [1, "rolepick"], [1, "ropt", 3, "on"], ["for", "upw"], [1, "row", 2, "--gap", "8px"], ["id", "upw", "name", "pw", "autocomplete", "new-password", 1, "input", "mono", 3, "ngModelChange", "type", "ngModel"], ["type", "button", 1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["type", "button", 1, "btn", "btn-secondary", "btn-sm", 3, "click"], [1, "rules"], [3, "name", "size"], ["title", "Couldn't create the user", 3, "message"], ["footer", ""], ["type", "button", 1, "btn", "btn-secondary", 3, "click"], ["type", "submit", "form", "user-form", 1, "btn", "btn-primary", 3, "disabled"], ["width", "520px", 3, "openChange", "open", "title", "subtitle"], [1, "stack", 2, "--gap", "16px"], [1, "btn", "btn-secondary", 3, "click"], [1, "btn", "btn-primary", 3, "click", "disabled"], ["title", "Deactivate user", "confirmLabel", "Deactivate", "tone", "danger", "icon", "ban", 3, "openChange", "confirmed", "open", "busy", "message"], ["actions", "", 1, "btn", "btn-primary", 3, "click"], ["name", "user-plus"], [1, "filters"], [1, "search"], ["name", "search", 3, "size"], ["placeholder", "Search name or email\u2026", 1, "input", 3, "ngModelChange", "ngModel"], [1, "input", "w", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "checkbox"], ["type", "checkbox", 3, "ngModelChange", "ngModel"], [1, "card"], [3, "rows"], [1, "card-body"], ["icon", "users", "title", "No matching users", "text", "Try another search or role."], [1, "table-wrap"], ["title", "Couldn't load users", 3, "message"], [1, "table"], [3, "dim"], [1, "who"], [1, "av"], [1, "nm"], [1, "you"], [1, "subtle", "small"], [1, "mfa", "on"], [1, "mfa"], [1, "nowrap"], [3, "title"], [3, "status"], [1, "num"], [1, "btn", "btn-ghost", "btn-sm"], ["name", "shield-check", 3, "size"], ["name", "shield", 3, "size"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["name", "pencil", 3, "size"], [1, "matrix", "card"], [1, "table", "mx"], [1, "stickycol"], [1, "rh"], [1, "roles", "grid", "grid-3"], [1, "card", "rc"], [1, "grp"], [1, "cell"], [1, "yes", 3, "title"], [1, "no"], ["name", "check", 3, "size", "stroke"], [1, "spacer"], [1, "small", "subtle", "num"], [1, "ropt"], ["type", "radio", "name", "role", 3, "ngModelChange", "value", "ngModel"], [1, "pc", "num"], ["for", "erl"], ["id", "erl", 1, "input", 3, "ngModelChange", "ngModel"], [1, "hint"], [1, "toggle-row"], [1, "small", "muted"], [1, "switch"], ["type", "checkbox", 3, "ngModelChange", "ngModel", "disabled"], [1, "knob"], ["tone", "info", "icon", "info"]], template: function UsersPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "vc-page-header", 0);
      \u0275\u0275conditionalCreate(1, UsersPage_Conditional_1_Template, 3, 0, "button", 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(2, "vc-tabs", 2);
      \u0275\u0275twoWayListener("activeChange", function UsersPage_Template_vc_tabs_activeChange_2_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.tab, $event) || (ctx.tab = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, UsersPage_Conditional_3_Template, 17, 5)(4, UsersPage_Conditional_4_Template, 15, 0);
      \u0275\u0275elementStart(5, "vc-modal", 3);
      \u0275\u0275twoWayListener("openChange", function UsersPage_Template_vc_modal_openChange_5_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.createOpen, $event) || (ctx.createOpen = $event);
        return $event;
      });
      \u0275\u0275elementStart(6, "form", 4);
      \u0275\u0275listener("ngSubmit", function UsersPage_Template_form_ngSubmit_6_listener() {
        return ctx.create();
      });
      \u0275\u0275elementStart(7, "div", 5)(8, "label", 6);
      \u0275\u0275text(9, "Full name");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "input", 7);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function UsersPage_Template_input_ngModelChange_10_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.full_name, $event) || (ctx.f.full_name = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(11, UsersPage_Conditional_11_Template, 2, 1, "span", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "div", 5)(13, "label", 9);
      \u0275\u0275text(14, "Work email");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "input", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function UsersPage_Template_input_ngModelChange_15_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.email, $event) || (ctx.f.email = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(16, UsersPage_Conditional_16_Template, 2, 1, "span", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "div", 5)(18, "label", 11);
      \u0275\u0275text(19, "Mobile ");
      \u0275\u0275elementStart(20, "span", 12);
      \u0275\u0275text(21, "(optional)");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "input", 13);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function UsersPage_Template_input_ngModelChange_22_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.phone, $event) || (ctx.f.phone = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "div", 5)(24, "label");
      \u0275\u0275text(25, "Role");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "div", 14);
      \u0275\u0275repeaterCreate(27, UsersPage_For_28_Template, 9, 7, "label", 15, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "div", 5)(30, "label", 16);
      \u0275\u0275text(31, "Temporary password");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "div", 17)(33, "input", 18);
      \u0275\u0275controlCreate();
      \u0275\u0275twoWayListener("ngModelChange", function UsersPage_Template_input_ngModelChange_33_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.f.password, $event) || (ctx.f.password = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "button", 19);
      \u0275\u0275listener("click", function UsersPage_Template_button_click_34_listener() {
        return ctx.showPw.set(!ctx.showPw());
      });
      \u0275\u0275text(35);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "button", 20);
      \u0275\u0275listener("click", function UsersPage_Template_button_click_36_listener() {
        return ctx.generate();
      });
      \u0275\u0275text(37, "Generate");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(38, "ul", 21)(39, "li");
      \u0275\u0275element(40, "vc-icon", 22);
      \u0275\u0275text(41, "At least 10 characters");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(42, "li");
      \u0275\u0275element(43, "vc-icon", 22);
      \u0275\u0275text(44, "Letters and numbers (recommended)");
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(45, UsersPage_Conditional_45_Template, 2, 1, "span", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(46, UsersPage_Conditional_46_Template, 1, 1, "vc-error", 23);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerStart(47, 24);
      \u0275\u0275elementStart(48, "button", 25);
      \u0275\u0275listener("click", function UsersPage_Template_button_click_48_listener() {
        return ctx.createOpen.set(false);
      });
      \u0275\u0275text(49, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(50, "button", 26);
      \u0275\u0275text(51);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(52, "vc-modal", 27);
      \u0275\u0275twoWayListener("openChange", function UsersPage_Template_vc_modal_openChange_52_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.editOpen, $event) || (ctx.editOpen = $event);
        return $event;
      });
      \u0275\u0275conditionalCreate(53, UsersPage_Conditional_53_Template, 19, 7, "div", 28);
      \u0275\u0275elementContainerStart(54, 24);
      \u0275\u0275elementStart(55, "button", 29);
      \u0275\u0275listener("click", function UsersPage_Template_button_click_55_listener() {
        return ctx.editOpen.set(false);
      });
      \u0275\u0275text(56, "Cancel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(57, "button", 30);
      \u0275\u0275listener("click", function UsersPage_Template_button_click_57_listener() {
        return ctx.saveEdit();
      });
      \u0275\u0275text(58);
      \u0275\u0275elementEnd();
      \u0275\u0275elementContainerEnd();
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "vc-confirm", 31);
      \u0275\u0275twoWayListener("openChange", function UsersPage_Template_vc_confirm_openChange_59_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.deactivateOpen, $event) || (ctx.deactivateOpen = $event);
        return $event;
      });
      \u0275\u0275listener("confirmed", function UsersPage_Template_vc_confirm_confirmed_59_listener() {
        return ctx.commitEdit();
      });
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_35_0;
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.tab() === "users" && ctx.canManage ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("tabs", ctx.tabs());
      \u0275\u0275twoWayProperty("active", ctx.tab);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.tab() === "users" ? 3 : 4);
      \u0275\u0275advance(2);
      \u0275\u0275twoWayProperty("open", ctx.createOpen);
      \u0275\u0275property("drawer", true);
      \u0275\u0275advance(5);
      \u0275\u0275classProp("invalid", ctx.fe()["full_name"]);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.full_name);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.fe()["full_name"] ? 11 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("invalid", ctx.fe()["email"]);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.email);
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.fe()["email"] ? 16 : -1);
      \u0275\u0275advance(6);
      \u0275\u0275twoWayProperty("ngModel", ctx.f.phone);
      \u0275\u0275control();
      \u0275\u0275advance(5);
      \u0275\u0275repeater(ctx.assignable());
      \u0275\u0275advance(6);
      \u0275\u0275classProp("invalid", ctx.fe()["password"]);
      \u0275\u0275property("type", ctx.showPw() ? "text" : "password");
      \u0275\u0275twoWayProperty("ngModel", ctx.f.password);
      \u0275\u0275control();
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.showPw() ? "Hide" : "Show");
      \u0275\u0275advance(4);
      \u0275\u0275classProp("ok", ctx.f.password.length >= 10);
      \u0275\u0275advance();
      \u0275\u0275property("name", ctx.f.password.length >= 10 ? "check" : "dot")("size", 12);
      \u0275\u0275advance(2);
      \u0275\u0275classProp("ok", ctx.mixed());
      \u0275\u0275advance();
      \u0275\u0275property("name", ctx.mixed() ? "check" : "dot")("size", 12);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.fe()["password"] ? 45 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.formError() ? 46 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy() || !ctx.f.full_name.trim() || !ctx.f.email.trim() || !ctx.f.role || ctx.f.password.length < 10);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.busy() ? "Creating\u2026" : "Create user");
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.editOpen);
      \u0275\u0275property("title", ctx.editing()?.full_name ?? "")("subtitle", ctx.editing()?.email ?? "");
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_35_0 = ctx.editing()) ? 53 : -1, tmp_35_0);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.busy());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.busy() ? "Saving\u2026" : "Save changes");
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("open", ctx.deactivateOpen);
      \u0275\u0275property("busy", ctx.busy())("message", (ctx.editing()?.full_name ?? "") + " will be signed out and can\u2019t sign in again until reactivated.");
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm, PageHeader, Loading, ErrorBox, Empty, Badge, Modal, Tabs, Icon, Callout, ConfirmDialog, DayPipe, AgoPipe], styles: ['\n.filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.search[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n  max-width: 380px;\n}\n.search[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--%NS%text-3);\n}\n.search[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-left: 34px;\n}\n.w[_ngcontent-%COMP%] {\n  width: 220px;\n}\n.who[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.av[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: var(--%NS%sand-200);\n  color: var(--%NS%stone-700);\n  font-size: 12px;\n  font-weight: 600;\n  flex: none;\n}\n.nm[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.3;\n}\n.you[_ngcontent-%COMP%] {\n  display: inline-flex;\n  height: 18px;\n  align-items: center;\n  padding: 0 6px;\n  margin-left: 6px;\n  border-radius: 4px;\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-700);\n  font-size: 11px;\n  font-weight: 600;\n  vertical-align: 1px;\n}\ntr.dim[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n}\n.mfa[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 12.5px;\n  color: var(--%NS%text-3);\n}\n.mfa.on[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-700);\n}\n.matrix[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n.mx[_ngcontent-%COMP%]   th.rh[_ngcontent-%COMP%] {\n  text-align: center;\n  white-space: normal;\n  min-width: 70px;\n  max-width: 84px;\n  padding: 10px 4px;\n  line-height: 1.25;\n  vertical-align: bottom;\n  font-size: 11.5px;\n}\n.stickycol[_ngcontent-%COMP%] {\n  position: sticky;\n  left: 0;\n  background: var(--%NS%surface);\n  z-index: 2;\n  min-width: 200px;\n  border-right: 1px solid var(--%NS%stone-100);\n}\nth.stickycol[_ngcontent-%COMP%] {\n  background: var(--%NS%surface-2);\n  z-index: 3;\n}\n.stickycol[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 13px;\n}\n.stickycol[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: var(--%NS%text-3);\n}\ntr.grp[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  background: var(--%NS%surface-2);\n  font-size: 11.5px;\n  font-weight: 600;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--%NS%stone-600);\n  padding: 8px 14px;\n}\n.mx[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {\n  padding: 7px 12px;\n}\n.mx[_ngcontent-%COMP%]   td.cell[_ngcontent-%COMP%] {\n  padding: 7px 4px;\n}\n.cell[_ngcontent-%COMP%] {\n  text-align: center;\n  border-left: 1px solid var(--%NS%stone-100);\n}\n.yes[_ngcontent-%COMP%] {\n  display: inline-grid;\n  place-items: center;\n  width: 20px;\n  height: 20px;\n  border-radius: 5px;\n  background: var(--%NS%forest-600);\n  color: #fff;\n}\n.no[_ngcontent-%COMP%] {\n  display: inline-block;\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: var(--%NS%stone-200);\n}\n.rc[_ngcontent-%COMP%] {\n  padding: 14px 16px;\n}\n.rc[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n  line-height: 1.45;\n}\n.rolepick[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  max-height: 320px;\n  overflow: auto;\n  padding-right: 2px;\n}\n.ropt[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 10px 12px;\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n  cursor: pointer;\n}\n.ropt[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%stone-400);\n}\n.ropt.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-500);\n  background: var(--%NS%forest-50);\n}\n.ropt[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  accent-color: var(--%NS%primary);\n  margin-top: 3px;\n}\n.ropt[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:not(.pc) {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n}\n.ropt[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 13px;\n}\n.ropt[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-2);\n  line-height: 1.4;\n}\n.pc[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n  background: var(--%NS%sand-100);\n  border-radius: 4px;\n  padding: 1px 6px;\n  height: fit-content;\n}\n.rules[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 4px 0 0;\n  padding: 0;\n  display: flex;\n  gap: 14px;\n  flex-wrap: wrap;\n  font-size: 12px;\n  color: var(--%NS%text-3);\n}\n.rules[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n}\n.rules[_ngcontent-%COMP%]   li.ok[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-700);\n}\n.toggle-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  align-items: center;\n  padding: 12px 14px;\n  border: 1px solid var(--%NS%border);\n  border-radius: 8px;\n}\n.toggle-row[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.switch[_ngcontent-%COMP%] {\n  position: relative;\n  width: 40px;\n  height: 22px;\n  flex: none;\n  cursor: pointer;\n}\n.switch[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  opacity: 0;\n  width: 0;\n  height: 0;\n  position: absolute;\n}\n.knob[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  border-radius: 11px;\n  background: var(--%NS%stone-300);\n  transition: background 0.15s;\n}\n.knob[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  left: 3px;\n  top: 3px;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: var(--%NS%shadow-sm);\n  transition: transform 0.15s;\n}\n.switch[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:checked    + .knob[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-600);\n}\n.switch[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:checked    + .knob[_ngcontent-%COMP%]::after {\n  transform: translateX(18px);\n}\n.switch[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus-visible    + .knob[_ngcontent-%COMP%] {\n  box-shadow: var(--%NS%focus);\n}\n.switch.disabled[_ngcontent-%COMP%] {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n/*# sourceMappingURL=users.page.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UsersPage, [{
    type: Component,
    args: [{ selector: "vc-users-page", imports: [FormsModule, PageHeader, Loading, ErrorBox, Empty, Badge, Modal, Tabs, Icon, Callout, ConfirmDialog, DayPipe, AgoPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <vc-page-header title="Users & roles" eyebrow="Administration"
      subtitle="Who can sign in and what each role may do. Roles are fixed in code and reviewed \u2014 you choose which role each person has.">
      @if (tab() === 'users' && canManage) {
        <button actions class="btn btn-primary" (click)="openCreate()"><vc-icon name="user-plus" />Invite user</button>
      }
    </vc-page-header>

    <vc-tabs [tabs]="tabs()" [(active)]="tab" />

    @if (tab() === 'users') {
      <div class="filters">
        <div class="search">
          <vc-icon name="search" [size]="15" />
          <input class="input" placeholder="Search name or email\u2026" [ngModel]="q()" (ngModelChange)="q.set($event)" />
        </div>
        <select class="input w" [ngModel]="roleFilter()" (ngModelChange)="roleFilter.set($event)">
          <option value="">All roles</option>
          @for (r of roles(); track r.role) { <option [value]="r.role">{{ r.label }}</option> }
        </select>
        <label class="checkbox"><input type="checkbox" [ngModel]="showInactive()" (ngModelChange)="showInactive.set($event)" />Show deactivated</label>
      </div>
      <section class="card">
        @if (loading()) {
          <vc-loading [rows]="7" />
        } @else if (error()) {
          <div class="card-body"><vc-error title="Couldn't load users" [message]="error()!" /></div>
        } @else if (!rows().length) {
          <vc-empty icon="users" title="No matching users" text="Try another search or role." />
        } @else {
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Name</th><th>Role</th><th>Two-step</th><th>Last sign-in</th><th>Status</th><th></th></tr></thead>
              <tbody>
                @for (u of rows(); track u.id) {
                  <tr [class.dim]="!u.is_active">
                    <td>
                      <div class="who">
                        <span class="av">{{ ini(u.full_name) }}</span>
                        <span class="nm"><strong>{{ u.full_name }} @if (u.id === me) { <span class="you">You</span> }</strong><span class="subtle small">{{ u.email }}</span></span>
                      </div>
                    </td>
                    <td>{{ u.role_label }}</td>
                    <td>
                      @if (u.mfa_enabled) { <span class="mfa on"><vc-icon name="shield-check" [size]="14" />On</span> }
                      @else { <span class="mfa"><vc-icon name="shield" [size]="14" />Off</span> }
                    </td>
                    <td class="nowrap">@if (u.last_login_at) { <span [title]="u.last_login_at | day: true">{{ u.last_login_at | ago }}</span> } @else { <span class="subtle">Never</span> }</td>
                    <td><vc-badge [status]="u.is_active ? 'active' : 'inactive'" /></td>
                    <td class="num">@if (canManage) { <button class="btn btn-ghost btn-sm" (click)="openEdit(u)"><vc-icon name="pencil" [size]="14" />Edit</button> }</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>
    } @else {
      <div class="matrix card">
        <div class="table-wrap">
          <table class="table mx">
            <thead>
              <tr><th class="stickycol">Permission</th>
                @for (r of roles(); track r.role) { <th class="rh"><span [title]="roleText(r.role)">{{ r.label }}</span></th> }
              </tr>
            </thead>
            <tbody>
              @for (g of groups; track g.key) {
                <tr class="grp"><td class="stickycol" [attr.colspan]="1">{{ g.label }}</td>@for (r of roles(); track r.role) { <td></td> }</tr>
                @for (p of g.perms; track p[0]) {
                  <tr>
                    <td class="stickycol"><span>{{ p[1] }}</span><code>{{ p[0] }}</code></td>
                    @for (r of roles(); track r.role) {
                      <td class="cell">@if (has(r, p[0])) { <span class="yes" [title]="r.label + ': ' + p[1]"><vc-icon name="check" [size]="13" [stroke]="2.6" /></span> } @else { <span class="no"></span> }</td>
                    }
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>
      <div class="roles grid grid-3">
        @for (r of roles(); track r.role) {
          <div class="card rc">
            <div class="row" style="--gap:8px"><strong>{{ r.label }}</strong><span class="spacer"></span><span class="small subtle num">{{ r.permissions.length }} permissions</span></div>
            <p>{{ roleText(r.role) }}</p>
          </div>
        }
      </div>
    }

    <!-- invite / create -->
    <vc-modal [(open)]="createOpen" [drawer]="true" width="520px" title="Invite user" subtitle="They sign in with this email and the temporary password. Share it securely.">
      <form class="stack" style="--gap:14px" id="user-form" (ngSubmit)="create()">
        <div class="field">
          <label for="un">Full name</label>
          <input id="un" class="input" name="name" [(ngModel)]="f.full_name" [class.invalid]="fe()['full_name']" />
          @if (fe()['full_name']) { <span class="error">{{ fe()['full_name'] }}</span> }
        </div>
        <div class="field">
          <label for="ue">Work email</label>
          <input id="ue" class="input" type="email" name="email" [(ngModel)]="f.email" [class.invalid]="fe()['email']" />
          @if (fe()['email']) { <span class="error">{{ fe()['email'] }}</span> }
        </div>
        <div class="field">
          <label for="uph">Mobile <span class="subtle">(optional)</span></label>
          <input id="uph" class="input num" name="phone" [(ngModel)]="f.phone" />
        </div>
        <div class="field">
          <label>Role</label>
          <div class="rolepick">
            @for (r of assignable(); track r.role) {
              <label class="ropt" [class.on]="f.role === r.role">
                <input type="radio" name="role" [value]="r.role" [(ngModel)]="f.role" />
                <span><strong>{{ r.label }}</strong><small>{{ roleText(r.role) }}</small></span>
                <span class="pc num">{{ r.permissions.length }}</span>
              </label>
            }
          </div>
        </div>
        <div class="field">
          <label for="upw">Temporary password</label>
          <div class="row" style="--gap:8px">
            <input id="upw" class="input mono" name="pw" [type]="showPw() ? 'text' : 'password'" [(ngModel)]="f.password" autocomplete="new-password" [class.invalid]="fe()['password']" />
            <button type="button" class="btn btn-ghost btn-sm" (click)="showPw.set(!showPw())">{{ showPw() ? 'Hide' : 'Show' }}</button>
            <button type="button" class="btn btn-secondary btn-sm" (click)="generate()">Generate</button>
          </div>
          <ul class="rules">
            <li [class.ok]="f.password.length >= 10"><vc-icon [name]="f.password.length >= 10 ? 'check' : 'dot'" [size]="12" />At least 10 characters</li>
            <li [class.ok]="mixed()"><vc-icon [name]="mixed() ? 'check' : 'dot'" [size]="12" />Letters and numbers (recommended)</li>
          </ul>
          @if (fe()['password']) { <span class="error">{{ fe()['password'] }}</span> }
        </div>
        @if (formError()) { <vc-error title="Couldn't create the user" [message]="formError()!" /> }
      </form>
      <ng-container footer>
        <button class="btn btn-secondary" type="button" (click)="createOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" type="submit" form="user-form" [disabled]="busy() || !f.full_name.trim() || !f.email.trim() || !f.role || f.password.length < 10">
          {{ busy() ? 'Creating\u2026' : 'Create user' }}</button>
      </ng-container>
    </vc-modal>

    <!-- edit -->
    <vc-modal [(open)]="editOpen" width="520px" [title]="editing()?.full_name ?? ''" [subtitle]="editing()?.email ?? ''">
      @if (editing(); as u) {
        <div class="stack" style="--gap:16px">
          <div class="field">
            <label for="erl">Role</label>
            <select id="erl" class="input" [(ngModel)]="edit.role">
              @for (r of assignable(); track r.role) { <option [value]="r.role">{{ r.label }} \xB7 {{ r.permissions.length }} permissions</option> }
            </select>
            <span class="hint">{{ roleText(edit.role) }}</span>
          </div>
          <div class="toggle-row">
            <div><strong>Account active</strong><p class="small muted">Deactivated users can\u2019t sign in. Their history stays in the audit log.</p></div>
            <label class="switch" [class.disabled]="u.id === me">
              <input type="checkbox" [(ngModel)]="edit.is_active" [disabled]="u.id === me" />
              <span class="knob"></span>
            </label>
          </div>
          @if (u.id === me) { <vc-callout tone="info" icon="info">You can\u2019t deactivate your own account. Ask another administrator.</vc-callout> }
        </div>
      }
      <ng-container footer>
        <button class="btn btn-secondary" (click)="editOpen.set(false)">Cancel</button>
        <button class="btn btn-primary" [disabled]="busy()" (click)="saveEdit()">{{ busy() ? 'Saving\u2026' : 'Save changes' }}</button>
      </ng-container>
    </vc-modal>

    <vc-confirm [(open)]="deactivateOpen" title="Deactivate user" confirmLabel="Deactivate" tone="danger" icon="ban" [busy]="busy()"
      [message]="(editing()?.full_name ?? '') + ' will be signed out and can\u2019t sign in again until reactivated.'" (confirmed)="commitEdit()" />
  `, styles: ['/* angular:styles/component:scss;64259a93c86ea02d;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\users\\users.page.ts */\n.filters {\n  display: flex;\n  gap: 12px;\n  margin-bottom: 16px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n.search {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n  max-width: 380px;\n}\n.search vc-icon {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--text-3);\n}\n.search .input {\n  padding-left: 34px;\n}\n.w {\n  width: 220px;\n}\n.who {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.av {\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: var(--sand-200);\n  color: var(--stone-700);\n  font-size: 12px;\n  font-weight: 600;\n  flex: none;\n}\n.nm {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.3;\n}\n.you {\n  display: inline-flex;\n  height: 18px;\n  align-items: center;\n  padding: 0 6px;\n  margin-left: 6px;\n  border-radius: 4px;\n  background: var(--forest-100);\n  color: var(--forest-700);\n  font-size: 11px;\n  font-weight: 600;\n  vertical-align: 1px;\n}\ntr.dim td {\n  color: var(--text-3);\n}\n.mfa {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  font-size: 12.5px;\n  color: var(--text-3);\n}\n.mfa.on {\n  color: var(--forest-700);\n}\n.matrix {\n  margin-bottom: 16px;\n}\n.mx th.rh {\n  text-align: center;\n  white-space: normal;\n  min-width: 70px;\n  max-width: 84px;\n  padding: 10px 4px;\n  line-height: 1.25;\n  vertical-align: bottom;\n  font-size: 11.5px;\n}\n.stickycol {\n  position: sticky;\n  left: 0;\n  background: var(--surface);\n  z-index: 2;\n  min-width: 200px;\n  border-right: 1px solid var(--stone-100);\n}\nth.stickycol {\n  background: var(--surface-2);\n  z-index: 3;\n}\n.stickycol span {\n  display: block;\n  font-size: 13px;\n}\n.stickycol code {\n  font-size: 11px;\n  color: var(--text-3);\n}\ntr.grp td {\n  background: var(--surface-2);\n  font-size: 11.5px;\n  font-weight: 600;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--stone-600);\n  padding: 8px 14px;\n}\n.mx td {\n  padding: 7px 12px;\n}\n.mx td.cell {\n  padding: 7px 4px;\n}\n.cell {\n  text-align: center;\n  border-left: 1px solid var(--stone-100);\n}\n.yes {\n  display: inline-grid;\n  place-items: center;\n  width: 20px;\n  height: 20px;\n  border-radius: 5px;\n  background: var(--forest-600);\n  color: #fff;\n}\n.no {\n  display: inline-block;\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: var(--stone-200);\n}\n.rc {\n  padding: 14px 16px;\n}\n.rc p {\n  margin-top: 4px;\n  font-size: 12.5px;\n  color: var(--text-2);\n  line-height: 1.45;\n}\n.rolepick {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  max-height: 320px;\n  overflow: auto;\n  padding-right: 2px;\n}\n.ropt {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 10px 12px;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  cursor: pointer;\n}\n.ropt:hover {\n  border-color: var(--stone-400);\n}\n.ropt.on {\n  border-color: var(--forest-500);\n  background: var(--forest-50);\n}\n.ropt input {\n  accent-color: var(--primary);\n  margin-top: 3px;\n}\n.ropt span:not(.pc) {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n}\n.ropt strong {\n  font-size: 13px;\n}\n.ropt small {\n  font-size: 12px;\n  color: var(--text-2);\n  line-height: 1.4;\n}\n.pc {\n  font-size: 11.5px;\n  color: var(--text-3);\n  background: var(--sand-100);\n  border-radius: 4px;\n  padding: 1px 6px;\n  height: fit-content;\n}\n.rules {\n  list-style: none;\n  margin: 4px 0 0;\n  padding: 0;\n  display: flex;\n  gap: 14px;\n  flex-wrap: wrap;\n  font-size: 12px;\n  color: var(--text-3);\n}\n.rules li {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n}\n.rules li.ok {\n  color: var(--forest-700);\n}\n.toggle-row {\n  display: flex;\n  gap: 16px;\n  align-items: center;\n  padding: 12px 14px;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n}\n.toggle-row > div {\n  flex: 1;\n}\n.switch {\n  position: relative;\n  width: 40px;\n  height: 22px;\n  flex: none;\n  cursor: pointer;\n}\n.switch input {\n  opacity: 0;\n  width: 0;\n  height: 0;\n  position: absolute;\n}\n.knob {\n  position: absolute;\n  inset: 0;\n  border-radius: 11px;\n  background: var(--stone-300);\n  transition: background 0.15s;\n}\n.knob::after {\n  content: "";\n  position: absolute;\n  left: 3px;\n  top: 3px;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: var(--shadow-sm);\n  transition: transform 0.15s;\n}\n.switch input:checked + .knob {\n  background: var(--forest-600);\n}\n.switch input:checked + .knob::after {\n  transform: translateX(18px);\n}\n.switch input:focus-visible + .knob {\n  box-shadow: var(--focus);\n}\n.switch.disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n/*# sourceMappingURL=users.page.css.map */\n'] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UsersPage, { className: "UsersPage", filePath: "src/app/features/users/users.page.ts", lineNumber: 267 });
})();

// src/app/features/users/users.routes.ts
var users_routes_default = [
  { path: "", component: UsersPage, canActivate: [permissionGuard("users.manage")], title: "Users & roles \xB7 Varsapradaya Carbon" }
];
export {
  users_routes_default as default
};
//# debugId=d12b37af-1e08-5684-abc0-0c0fe30d9355
//# sourceMappingURL=chunk-P3KR45CU.js.map
