import {
  TERM_STATUS,
  ruleSource,
  ruleValue,
  termLabel
} from "./chunk-5SRO2YLJ.js";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-WOW2CD4M.js";
import {
  fmtDate,
  fmtNum
} from "./chunk-E5UDMWWN.js";
import {
  DataClass,
  Hash
} from "./chunk-PAXTZ3VZ.js";
import {
  ChangeDetectionStrategy,
  Component,
  Icon,
  Input,
  Output,
  ViewChild,
  __spreadProps,
  __spreadValues,
  computed,
  effect,
  input,
  output,
  setClassMetadata,
  signal,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵqueryAdvance,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵviewQuerySignal
} from "./chunk-O2E4BMDK.js";

// src/app/features/calculations/provenance-tree.ts
var _c0 = ["treeEl"];
var _c1 = () => [];
var _forTrack0 = ($index, $item) => $item.kind;
var _forTrack1 = ($index, $item) => $item.node.key;
var _forTrack2 = ($index, $item) => $item.text;
var _forTrack3 = ($index, $item) => $item.key;
var _forTrack4 = ($index, $item) => $item[0];
function ProvenanceTree_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 21);
    \u0275\u0275listener("click", function ProvenanceTree_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.q.set(""));
    });
    \u0275\u0275element(1, "vc-icon", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function ProvenanceTree_For_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 23);
    \u0275\u0275listener("click", function ProvenanceTree_For_17_Template_button_click_0_listener() {
      const f_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.kind.set(ctx_r1.kind() === f_r4.kind ? null : f_r4.kind));
    });
    \u0275\u0275element(1, "vc-icon", 24);
    \u0275\u0275text(2);
    \u0275\u0275elementStart(3, "span", 25);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r1.kind() === f_r4.kind);
    \u0275\u0275advance();
    \u0275\u0275property("name", f_r4.icon)("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r4.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.counts()[f_r4.kind] ?? 0);
  }
}
function ProvenanceTree_Conditional_21_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" in ", ctx_r1.kindLabel(ctx_r1.kind()), " ");
  }
}
function ProvenanceTree_Conditional_21_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275textInterpolate1(" for \u201C", ctx_r1.q(), "\u201D ");
  }
}
function ProvenanceTree_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275element(1, "vc-icon", 26);
    \u0275\u0275text(2);
    \u0275\u0275conditionalCreate(3, ProvenanceTree_Conditional_21_Conditional_3_Template, 1, 1);
    \u0275\u0275conditionalCreate(4, ProvenanceTree_Conditional_21_Conditional_4_Template, 1, 1);
    \u0275\u0275elementStart(5, "button", 27);
    \u0275\u0275listener("click", function ProvenanceTree_Conditional_21_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.clearFilters());
    });
    \u0275\u0275text(6, "Clear");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 13);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2(" ", ctx_r1.matchCount(), " match", ctx_r1.matchCount() === 1 ? "" : "es", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.kind() ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.q() ? 4 : -1);
  }
}
function ProvenanceTree_For_23_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mark");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r7.parts[1]);
  }
}
function ProvenanceTree_For_23_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r7.node.sub);
  }
}
function ProvenanceTree_For_23_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 40);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r8 = ctx.$implicit;
    \u0275\u0275classMap("tag t-" + t_r8.tone);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r8.text);
  }
}
function ProvenanceTree_For_23_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 36);
    \u0275\u0275text(1, "Not used");
    \u0275\u0275elementEnd();
  }
}
function ProvenanceTree_For_23_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-icon", 37);
  }
  if (rf & 2) {
    const r_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("size", 13);
    \u0275\u0275attribute("title", r_r7.node.hash);
  }
}
function ProvenanceTree_For_23_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-dc", 38);
  }
  if (rf & 2) {
    const r_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("cls", r_r7.node.dc);
  }
}
function ProvenanceTree_For_23_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 39);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r7.node.count);
  }
}
function ProvenanceTree_For_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28);
    \u0275\u0275listener("click", function ProvenanceTree_For_23_Template_div_click_0_listener() {
      const r_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.select(r_r7.node));
    })("dblclick", function ProvenanceTree_For_23_Template_div_dblclick_0_listener() {
      const r_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggle(r_r7.node));
    });
    \u0275\u0275element(1, "span", 29);
    \u0275\u0275elementStart(2, "button", 30);
    \u0275\u0275listener("click", function ProvenanceTree_For_23_Template_button_click_2_listener($event) {
      const r_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.toggle(r_r7.node);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(3, "vc-icon", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 32);
    \u0275\u0275element(5, "vc-icon", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 33);
    \u0275\u0275text(7);
    \u0275\u0275conditionalCreate(8, ProvenanceTree_For_23_Conditional_8_Template, 2, 1, "mark");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(10, ProvenanceTree_For_23_Conditional_10_Template, 2, 1, "span", 34);
    \u0275\u0275element(11, "span", 8);
    \u0275\u0275repeaterCreate(12, ProvenanceTree_For_23_For_13_Template, 2, 3, "span", 35, _forTrack2);
    \u0275\u0275conditionalCreate(14, ProvenanceTree_For_23_Conditional_14_Template, 2, 0, "span", 36);
    \u0275\u0275conditionalCreate(15, ProvenanceTree_For_23_Conditional_15_Template, 1, 2, "vc-icon", 37);
    \u0275\u0275conditionalCreate(16, ProvenanceTree_For_23_Conditional_16_Template, 1, 1, "vc-dc", 38);
    \u0275\u0275conditionalCreate(17, ProvenanceTree_For_23_Conditional_17_Template, 2, 1, "span", 39);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("sel", ctx_r1.selected()?.key === r_r7.node.key)("grp", r_r7.node.kind === "group")("unused", r_r7.node.used === false);
    \u0275\u0275attribute("aria-expanded", r_r7.hasKids ? r_r7.open : null)("aria-level", r_r7.depth + 1)("data-key", r_r7.node.key);
    \u0275\u0275advance();
    \u0275\u0275styleProp("width", r_r7.depth * 20, "px");
    \u0275\u0275advance();
    \u0275\u0275classProp("hidden", !r_r7.hasKids);
    \u0275\u0275attribute("aria-label", r_r7.open ? "Collapse" : "Expand");
    \u0275\u0275advance();
    \u0275\u0275classProp("rot", r_r7.open);
    \u0275\u0275property("size", 14)("stroke", 2);
    \u0275\u0275advance();
    \u0275\u0275classMap("k k-" + r_r7.node.kind);
    \u0275\u0275advance();
    \u0275\u0275property("name", r_r7.node.icon)("size", 13);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r7.parts[0]);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r7.parts[1] ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r7.parts[2]);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r7.node.sub ? 10 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(r_r7.node.tags ?? \u0275\u0275pureFunction0(30, _c1));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(r_r7.node.used === false ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r7.node.hash ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r7.node.dc ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(r_r7.node.count !== void 0 ? 17 : -1);
  }
}
function ProvenanceTree_ForEmpty_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275text(1, "Nothing matches. Try a sample code such as a core number, an analyte, or part of a fingerprint.");
    \u0275\u0275elementEnd();
  }
}
function ProvenanceTree_Conditional_26_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r9 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(s_r9.sub);
  }
}
function ProvenanceTree_Conditional_26_Conditional_9_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-dc", 38);
    \u0275\u0275elementStart(1, "span", 53);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r9 = \u0275\u0275nextContext(2);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("cls", s_r9.dc);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.dcText(s_r9.dc));
  }
}
function ProvenanceTree_Conditional_26_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 46);
    \u0275\u0275conditionalCreate(1, ProvenanceTree_Conditional_26_Conditional_9_Conditional_1_Template, 3, 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r9 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(s_r9.dc ? 1 : -1);
  }
}
function ProvenanceTree_Conditional_26_For_12_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-icon", 55);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 11);
  }
}
function ProvenanceTree_Conditional_26_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 54);
    \u0275\u0275listener("click", function ProvenanceTree_Conditional_26_For_12_Template_button_click_0_listener() {
      const c_r11 = \u0275\u0275restoreView(_r10).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.reveal(c_r11));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, ProvenanceTree_Conditional_26_For_12_Conditional_2_Template, 1, 1, "vc-icon", 55);
  }
  if (rf & 2) {
    const c_r11 = ctx.$implicit;
    const \u0275$index_140_r12 = ctx.$index;
    const \u0275$count_140_r13 = ctx.$count;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r11.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(!(\u0275$index_140_r12 === \u0275$count_140_r13 - 1) ? 2 : -1);
  }
}
function ProvenanceTree_Conditional_26_Conditional_13_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dt");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "dd");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const x_r14 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(x_r14[0]);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(x_r14[1]);
  }
}
function ProvenanceTree_Conditional_26_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "dl", 48);
    \u0275\u0275repeaterCreate(1, ProvenanceTree_Conditional_26_Conditional_13_For_2_Template, 4, 2, null, null, _forTrack4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r9 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(s_r9.kv);
  }
}
function ProvenanceTree_Conditional_26_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49)(1, "div", 44);
    \u0275\u0275text(2, "SHA-256 fingerprint");
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "vc-hash", 56);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r9 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("value", s_r9.hash)("full", true);
  }
}
function ProvenanceTree_Conditional_26_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 50);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "button", 27);
    \u0275\u0275listener("click", function ProvenanceTree_Conditional_26_Conditional_15_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r15);
      const s_r9 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggle(s_r9));
    });
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const s_r9 = \u0275\u0275nextContext();
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("Contains ", s_r9.children.length, " item", s_r9.children.length === 1 ? "" : "s", ". ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.expanded().has(s_r9.key) ? "Collapse" : "Expand");
  }
}
function ProvenanceTree_Conditional_26_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 57);
    \u0275\u0275listener("click", function ProvenanceTree_Conditional_26_Conditional_17_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r16);
      const s_r9 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.openFile.emit(s_r9.file));
    });
    \u0275\u0275element(1, "vc-icon", 58);
    \u0275\u0275text(2, "Open file");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function ProvenanceTree_Conditional_26_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 57);
    \u0275\u0275listener("click", function ProvenanceTree_Conditional_26_Conditional_18_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r17);
      const s_r9 = \u0275\u0275nextContext();
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.ask.emit({ type: s_r9.ref.type, id: s_r9.ref.id, label: ctx_r1.kindLabel(s_r9.kind) + ": " + s_r9.label }));
    });
    \u0275\u0275element(1, "vc-icon", 59);
    \u0275\u0275text(2, "Raise a question ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 14);
  }
}
function ProvenanceTree_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41)(1, "span", 42);
    \u0275\u0275element(2, "vc-icon", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 43)(4, "div", 44);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "h3");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, ProvenanceTree_Conditional_26_Conditional_8_Template, 2, 1, "div", 45);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(9, ProvenanceTree_Conditional_26_Conditional_9_Template, 2, 1, "div", 46);
    \u0275\u0275elementStart(10, "nav", 47);
    \u0275\u0275repeaterCreate(11, ProvenanceTree_Conditional_26_For_12_Template, 3, 2, null, null, _forTrack3);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(13, ProvenanceTree_Conditional_26_Conditional_13_Template, 3, 0, "dl", 48);
    \u0275\u0275conditionalCreate(14, ProvenanceTree_Conditional_26_Conditional_14_Template, 4, 2, "div", 49);
    \u0275\u0275conditionalCreate(15, ProvenanceTree_Conditional_26_Conditional_15_Template, 4, 3, "p", 50);
    \u0275\u0275elementStart(16, "div", 51);
    \u0275\u0275conditionalCreate(17, ProvenanceTree_Conditional_26_Conditional_17_Template, 3, 1, "button", 52);
    \u0275\u0275conditionalCreate(18, ProvenanceTree_Conditional_26_Conditional_18_Template, 3, 1, "button", 52);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const s_r9 = ctx;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classMap("k big k-" + s_r9.kind);
    \u0275\u0275advance();
    \u0275\u0275property("name", s_r9.icon)("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.kindLabel(s_r9.kind));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r9.label);
    \u0275\u0275advance();
    \u0275\u0275conditional(s_r9.sub ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(s_r9.dc || s_r9.used !== void 0 ? 9 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.path());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(s_r9.kv.length ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(s_r9.hash ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(s_r9.children.length ? 15 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(s_r9.file ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.askable() && s_r9.ref ? 18 : -1);
  }
}
function ProvenanceTree_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "vc-icon", 60);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Select any item to see exactly what it holds and where it came from.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 61);
    \u0275\u0275text(5, "Use the arrow keys to move through the tree; \u2192 opens, \u2190 closes.");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 22);
  }
}
var KIND_LABEL = {
  run: "Calculation run",
  group: "Group",
  rule: "Methodology rule",
  term: "Decided term",
  stratum: "Zone (stratum)",
  site: "Permanent sampling site",
  sample: "Soil core",
  layer: "Soil layer",
  result: "Lab result",
  certificate: "Lab certificate",
  custody: "Custody event",
  photo: "Field photo"
};
var FILTERS = [
  { kind: "rule", label: "Rules", icon: "scale" },
  { kind: "term", label: "Terms", icon: "sigma" },
  { kind: "stratum", label: "Zones", icon: "map" },
  { kind: "site", label: "Sites", icon: "pin" },
  { kind: "sample", label: "Samples", icon: "target" },
  { kind: "layer", label: "Layers", icon: "layers" },
  { kind: "result", label: "Lab results", icon: "flask" },
  { kind: "certificate", label: "Certificates", icon: "file-check" },
  { kind: "custody", label: "Custody", icon: "truck" }
];
var ANALYTE = {
  soc_pct: "Soil organic carbon",
  bulk_density_g_cm3: "Bulk density",
  coarse_fraction: "Coarse fraction"
};
var h = (s) => {
  if (!s)
    return "\u2014";
  const t = String(s).replace(/_/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
};
var n = (v, d = 2) => typeof v === "number" ? fmtNum(v, d) : v === null || v === void 0 ? "\u2014" : String(v);
function buildTree(p) {
  const mk = (x) => {
    const node = __spreadProps(__spreadValues({}, x), { children: x.children ?? [], text: "" });
    node.text = [node.label, node.sub, ...node.kv.map((k) => k[1]), node.hash ?? "", node.file?.filename ?? ""].join(" ").toLowerCase();
    for (const c of node.children)
      c.parent = node;
    return node;
  };
  const r = p.run;
  const rules = mk({
    key: "g:rules",
    kind: "group",
    icon: "scale",
    label: "Methodology rules",
    sub: "Frozen with the run",
    count: p.rules.length,
    kv: [],
    children: p.rules.map((x) => mk({
      key: `rule:${x.key}`,
      kind: "rule",
      icon: "scale",
      label: x.label,
      sub: ruleValue(x.value),
      dc: "RECORDED",
      ref: { type: "rule", id: x.key },
      kv: [["Rule key", x.key], ["Value", ruleValue(x.value)], ["Source", ruleSource(x.source)]]
    }))
  });
  const supplied = new Map(p.terms.map((t) => [t.term, t]));
  const termNodes = (p.term_results.length ? p.term_results : p.terms.map((t) => __spreadProps(__spreadValues({}, t), { status: "supplied" }))).map((t) => {
    const s = supplied.get(t.term);
    return mk({
      key: `term:${t.term}`,
      kind: "term",
      icon: "sigma",
      label: termLabel(t.term),
      sub: t.status === "supplied" ? `${n(t.value_t_co2e, 2)} tCO\u2082e` : TERM_STATUS[t.status] ?? h(t.status),
      dc: t.status === "supplied" ? "RECORDED" : void 0,
      tags: t.status === "supplied" ? [] : [{ text: TERM_STATUS[t.status] ?? h(t.status), tone: "neutral" }],
      ref: { type: "term", id: s?.id ?? t.term },
      kv: [
        ["Value", `${n(t.value_t_co2e, 3)} tCO\u2082e`],
        ["Variance", `${n(t.variance, 4)} (tCO\u2082e)\xB2`],
        ["Degrees of freedom", n(t.df, 1)],
        ["How it was used", TERM_STATUS[t.status] ?? h(t.status)],
        ...s ? [["Estimate version", `v${s.version}`], ["Source", s.source]] : []
      ]
    });
  });
  const terms = mk({ key: "g:terms", kind: "group", icon: "sigma", label: "Decided terms", sub: "Project-level estimates", count: termNodes.length, kv: [], children: termNodes });
  let nSites = 0, nSamples = 0;
  const strata = p.strata.map((st) => {
    const res = st.result ?? {};
    const sites = st.sites.map((site) => {
      nSites++;
      const samples = site.samples.map((smp) => {
        nSamples++;
        const layers = smp.layers.map((ly) => mk({
          key: `layer:${ly.id}`,
          kind: "layer",
          icon: "layers",
          label: `Layer ${ly.code}`,
          sub: `${n(ly.depth_from_cm, 0)}\u2013${n(ly.depth_to_cm, 0)} cm`,
          used: ly.used_in_calculation,
          count: ly.lab_results.length,
          ref: { type: "layer", id: ly.id },
          kv: [["Depth", `${n(ly.depth_from_cm, 0)}\u2013${n(ly.depth_to_cm, 0)} cm`], ["Used in calculation", ly.used_in_calculation ? "Yes" : "No \u2014 below the required depth or not needed"]],
          children: ly.lab_results.map((lr) => mk({
            key: `result:${lr.id}`,
            kind: "result",
            icon: "flask",
            label: ANALYTE[lr.analyte] ?? h(lr.analyte),
            sub: `${n(lr.value, 3)} ${lr.unit}`,
            dc: lr.data_class || "MEASURED",
            used: lr.used_in_calculation,
            tags: [
              ...lr.status !== "accepted" ? [{ text: h(lr.status), tone: lr.status === "rejected" ? "danger" : "warn" }] : [],
              ...lr.version > 1 ? [{ text: `v${lr.version}`, tone: "neutral" }] : []
            ],
            ref: { type: "lab_result", id: lr.id },
            kv: [
              ["Value", `${n(lr.value, 4)} ${lr.unit}`],
              ["Method", lr.method || "\u2014"],
              ["Status", h(lr.status)],
              ["Version", `v${lr.version}`],
              ["Analysed on", fmtDate(lr.analysed_on)],
              ["Used in calculation", lr.used_in_calculation ? "Yes \u2014 this exact version" : "No"]
            ],
            children: lr.certificate ? [mk({
              key: `cert:${lr.id}:${lr.certificate.id}`,
              kind: "certificate",
              icon: "file-check",
              label: lr.certificate.filename ?? "Lab certificate",
              sub: lr.certificate.missing ? "File missing" : "Signed laboratory certificate",
              hash: lr.certificate.sha256 ?? void 0,
              file: lr.certificate.missing ? void 0 : lr.certificate,
              tags: lr.certificate.missing ? [{ text: "Missing", tone: "danger" }] : [],
              ref: { type: "evidence", id: lr.certificate.id },
              kv: [["File", lr.certificate.filename ?? "\u2014"], ["Type", lr.certificate.mime_type ?? "\u2014"]]
            })] : []
          }))
        }));
        const custody = smp.custody.map((ev) => mk({
          key: `custody:${ev.id}`,
          kind: "custody",
          icon: "truck",
          label: h(ev.event),
          sub: fmtDate(ev.occurred_at, true) + (ev.location ? ` \xB7 ${ev.location}` : ""),
          dc: "RECORDED",
          ref: { type: "custody_event", id: ev.id },
          tags: [
            ...ev.seal_intact === false ? [{ text: "Seal broken", tone: "danger" }] : [],
            ...ev.count_matches === false ? [{ text: "Count mismatch", tone: "danger" }] : []
          ],
          kv: [
            ["When", fmtDate(ev.occurred_at, true)],
            ["Where", ev.location ?? "\u2014"],
            ["Seal intact", ev.seal_intact === null ? "\u2014" : ev.seal_intact ? "Yes" : "No"],
            ["Bag count matches", ev.count_matches === null ? "\u2014" : ev.count_matches ? "Yes" : "No"],
            ["Notes", ev.notes || "\u2014"]
          ]
        }));
        const photos = smp.photos.map((ph) => mk({
          key: `photo:${smp.id}:${ph.id}`,
          kind: "photo",
          icon: "camera",
          label: ph.filename ?? "Field photo",
          sub: ph.missing ? "File missing" : "Taken at collection",
          hash: ph.sha256 ?? void 0,
          file: ph.missing ? void 0 : ph,
          ref: { type: "evidence", id: ph.id },
          kv: [["File", ph.filename ?? "\u2014"]]
        }));
        const kids = [
          mk({ key: `g:layers:${smp.id}`, kind: "group", icon: "layers", label: "Soil layers", count: layers.length, kv: [], children: layers }),
          mk({
            key: `g:custody:${smp.id}`,
            kind: "group",
            icon: "truck",
            label: "Chain of custody",
            count: custody.length,
            kv: [],
            children: custody,
            tags: custody.length ? [] : [{ text: "No events", tone: "warn" }]
          })
        ];
        if (photos.length)
          kids.push(mk({ key: `g:photos:${smp.id}`, kind: "group", icon: "camera", label: "Photos", count: photos.length, kv: [], children: photos }));
        const g = smp.gps;
        return mk({
          key: `sample:${smp.id}`,
          kind: "sample",
          icon: "target",
          label: `Core ${smp.code}`,
          sub: `${h(smp.campaign)} \xB7 ${fmtDate(smp.collected_at)}`,
          dc: "RECORDED",
          ref: { type: "sample", id: smp.id },
          tags: [{ text: h(smp.campaign), tone: smp.campaign === "baseline" ? "neutral" : "info" }],
          kv: [
            ["Campaign", h(smp.campaign)],
            ["Collected", fmtDate(smp.collected_at, true)],
            ["GPS", g.latitude !== null && g.longitude !== null ? `${g.latitude.toFixed(6)}, ${g.longitude.toFixed(6)}` : "\u2014"],
            ["GPS accuracy", g.accuracy_m !== null ? `\xB1 ${n(g.accuracy_m, 1)} m` : "\u2014"],
            ["Distance from site", g.distance_from_site_m !== null ? `${n(g.distance_from_site_m, 1)} m` : "\u2014"],
            ["Depth reached", smp.depth_reached_cm !== null ? `${n(smp.depth_reached_cm, 0)} cm` : "\u2014"]
          ],
          children: kids
        });
      });
      return mk({
        key: `site:${site.id}`,
        kind: "site",
        icon: "pin",
        label: `Site ${site.code ?? site.id.slice(0, 8)}`,
        sub: site.latitude !== null && site.longitude !== null ? `${site.latitude.toFixed(5)}, ${site.longitude.toFixed(5)}` : void 0,
        count: samples.length,
        ref: { type: "site", id: site.id },
        kv: [["Location", site.latitude !== null && site.longitude !== null ? `${site.latitude}, ${site.longitude}` : "\u2014"], ["Cores used", String(samples.length)]],
        children: samples
      });
    });
    const excluded = res["excluded_sites"] ?? [];
    return mk({
      key: `stratum:${st.id}`,
      kind: "stratum",
      icon: "map",
      label: `${st.code} \xB7 ${st.name}`,
      sub: `${h(st.role)} zone \xB7 ${n(st.area_ha, 1)} ha`,
      dc: "CALCULATED",
      count: sites.length,
      ref: { type: "stratum", id: st.id },
      tags: [
        ...st.role === "control" ? [{ text: `Control for ${st.control_for_code}`, tone: "info" }] : [],
        ...excluded.length ? [{ text: `${excluded.length} excluded`, tone: "warn" }] : []
      ],
      kv: [
        ["Role", h(st.role)],
        ["Area", `${n(st.area_ha, 2)} ha`],
        ["Zone version", `v${st.version}`],
        ["Fields", String(st.field_ids.length)],
        ["Sites used (n)", n(res["n_used"], 0)],
        ["Mean baseline stock", `${n(res["mean_baseline_t_c_ha"], 2)} t C/ha`],
        ["Mean monitoring stock", `${n(res["mean_monitoring_t_c_ha"], 2)} t C/ha`],
        ["Change", `${n(res["delta_t_c_ha"], 3)} t C/ha`],
        ["Variance of change", n(res["variance"], 5)],
        ["Standard error", n(res["se"], 4)],
        ["Degrees of freedom", n(res["df"], 1)],
        ["Excluded sites", excluded.length ? excluded.join(", ") : "None"]
      ],
      children: sites
    });
  });
  const strataGroup = mk({ key: "g:strata", kind: "group", icon: "map", label: "Zones, sites and samples", sub: `${nSites} sites \xB7 ${nSamples} cores`, count: strata.length, kv: [], children: strata });
  return mk({
    key: `run:${r.id}`,
    kind: "run",
    icon: "calculator",
    label: `Calculation \xB7 ${r.period_label}`,
    sub: `${fmtDate(r.period_start)} \u2013 ${fmtDate(r.period_end)} \xB7 ${fmtNum(r.net_t_co2e, 1)} tCO\u2082e net`,
    dc: "CALCULATED",
    tags: [{ text: h(r.status), tone: r.status === "approved" ? "ok" : r.status === "rejected" ? "danger" : "info" }],
    hash: r.snapshot_sha256,
    ref: { type: "calculation_run", id: r.id },
    kv: [
      ["Net credits", `${fmtNum(r.net_t_co2e, 2)} tCO\u2082e`],
      ["Reductions", `${fmtNum(r.reductions_t_co2e, 2)} tCO\u2082e`],
      ["Removals", `${fmtNum(r.removals_t_co2e, 2)} tCO\u2082e`],
      ["Gross change", `${fmtNum(r.gross_t_co2e, 2)} tCO\u2082e`],
      ["Uncertainty deduction", `${fmtNum(r.uncertainty_deduction_t_co2e, 2)} tCO\u2082e`],
      ["Buffer", `${fmtNum(r.buffer_t_co2e, 2)} tCO\u2082e`],
      ["Status", h(r.status)],
      ["Engine version", r.engine_version]
    ],
    children: [rules, terms, strataGroup]
  });
}
function walkAll(n2, f) {
  f(n2);
  for (const c of n2.children)
    walkAll(c, f);
}
var ProvenanceTree = class _ProvenanceTree {
  data = input.required(
    ...ngDevMode ? [{ debugName: "data" }] : (
      /* istanbul ignore next */
      []
    )
  );
  askable = input(
    false,
    ...ngDevMode ? [{ debugName: "askable" }] : (
      /* istanbul ignore next */
      []
    )
  );
  openFile = output();
  ask = output();
  filters = FILTERS;
  q = signal(
    "",
    ...ngDevMode ? [{ debugName: "q" }] : (
      /* istanbul ignore next */
      []
    )
  );
  kind = signal(
    null,
    ...ngDevMode ? [{ debugName: "kind" }] : (
      /* istanbul ignore next */
      []
    )
  );
  usedOnly = signal(
    false,
    ...ngDevMode ? [{ debugName: "usedOnly" }] : (
      /* istanbul ignore next */
      []
    )
  );
  expanded = signal(
    /* @__PURE__ */ new Set(),
    ...ngDevMode ? [{ debugName: "expanded" }] : (
      /* istanbul ignore next */
      []
    )
  );
  /** Nodes the user collapsed while a filter is active. */
  closedInFilter = signal(
    /* @__PURE__ */ new Set(),
    ...ngDevMode ? [{ debugName: "closedInFilter" }] : (
      /* istanbul ignore next */
      []
    )
  );
  selected = signal(
    null,
    ...ngDevMode ? [{ debugName: "selected" }] : (
      /* istanbul ignore next */
      []
    )
  );
  treeEl = viewChild(
    "treeEl",
    ...ngDevMode ? [{ debugName: "treeEl" }] : (
      /* istanbul ignore next */
      []
    )
  );
  root = computed(
    () => buildTree(this.data()),
    ...ngDevMode ? [{ debugName: "root" }] : (
      /* istanbul ignore next */
      []
    )
  );
  all = computed(
    () => {
      const out = [];
      walkAll(this.root(), (x) => out.push(x));
      return out;
    },
    ...ngDevMode ? [{ debugName: "all" }] : (
      /* istanbul ignore next */
      []
    )
  );
  counts = computed(
    () => {
      const c = {};
      for (const x of this.all())
        c[x.kind] = (c[x.kind] ?? 0) + 1;
      return c;
    },
    ...ngDevMode ? [{ debugName: "counts" }] : (
      /* istanbul ignore next */
      []
    )
  );
  filtering = computed(
    () => !!this.q().trim() || !!this.kind(),
    ...ngDevMode ? [{ debugName: "filtering" }] : (
      /* istanbul ignore next */
      []
    )
  );
  matches = computed(
    () => {
      const q = this.q().trim().toLowerCase();
      const k = this.kind();
      const m = /* @__PURE__ */ new Set();
      if (!q && !k)
        return m;
      for (const x of this.all()) {
        if (x.kind === "group" && k)
          continue;
        if ((k ? x.kind === k : true) && (!q || x.text.includes(q)))
          m.add(x.key);
      }
      return m;
    },
    ...ngDevMode ? [{ debugName: "matches" }] : (
      /* istanbul ignore next */
      []
    )
  );
  matchCount = computed(
    () => this.matches().size,
    ...ngDevMode ? [{ debugName: "matchCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rows = computed(
    () => {
      const out = [];
      const exp = this.expanded();
      const filtering = this.filtering();
      const matches = this.matches();
      const usedOnly = this.usedOnly();
      const q = this.q().trim().toLowerCase();
      const keep = /* @__PURE__ */ new Set();
      if (filtering) {
        for (const x of this.all())
          if (matches.has(x.key))
            for (let p = x.parent; p; p = p.parent)
              keep.add(p.key);
      }
      const walk = (node, depth, forced) => {
        if (usedOnly && node.used === false)
          return;
        if (filtering && !forced && !keep.has(node.key) && !matches.has(node.key))
          return;
        const kids = usedOnly ? node.children.filter((c) => c.used !== false) : node.children;
        const open = filtering && keep.has(node.key) ? !this.closedInFilter().has(node.key) : exp.has(node.key);
        out.push({ node, depth, open, hasKids: kids.length > 0, parts: split(node.label, q) });
        if (!open)
          return;
        const childForced = forced || filtering && matches.has(node.key);
        for (const c of kids)
          walk(c, depth + 1, childForced);
      };
      walk(this.root(), 0, false);
      return out;
    },
    ...ngDevMode ? [{ debugName: "rows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  path = computed(
    () => {
      const out = [];
      for (let p = this.selected(); p; p = p.parent ?? null)
        out.unshift(p);
      return out;
    },
    ...ngDevMode ? [{ debugName: "path" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      const r = this.root();
      const exp = /* @__PURE__ */ new Set([r.key, "g:terms", "g:strata"]);
      const strata = r.children.find((c) => c.key === "g:strata");
      strata?.children.forEach((c) => exp.add(c.key));
      this.expanded.set(exp);
      this.selected.set(r);
    });
  }
  kindLabel(k) {
    return KIND_LABEL[k];
  }
  dcText(dc) {
    return {
      MEASURED: "Measured by an accredited laboratory",
      RECORDED: "Recorded by a person or system at the time",
      CALCULATED: "Produced by the calculation engine",
      OBSERVED: "Observed by satellite or sensor",
      MODELLED: "A model estimate, never a measurement",
      DERIVED: "Worked out from other data"
    }[dc] ?? "";
  }
  select(n2) {
    this.selected.set(n2);
  }
  toggle(n2) {
    if (this.filtering() && this.isAutoOpen(n2)) {
      const c = new Set(this.closedInFilter());
      c.has(n2.key) ? c.delete(n2.key) : c.add(n2.key);
      this.closedInFilter.set(c);
      return;
    }
    const s = new Set(this.expanded());
    s.has(n2.key) ? s.delete(n2.key) : s.add(n2.key);
    this.expanded.set(s);
  }
  expandAll() {
    this.expanded.set(new Set(this.all().map((x) => x.key)));
  }
  collapseAll() {
    this.expanded.set(/* @__PURE__ */ new Set([this.root().key]));
  }
  clearFilters() {
    this.q.set("");
    this.kind.set(null);
    this.closedInFilter.set(/* @__PURE__ */ new Set());
  }
  /** True when the node is an ancestor of a match (so the filter opens it). */
  isAutoOpen(n2) {
    const m = this.matches();
    const hit = (x) => x.children.some((c) => m.has(c.key) || hit(c));
    return hit(n2);
  }
  /** Clear filters, open every ancestor and scroll the node into view. */
  reveal(n2) {
    this.clearFilters();
    const s = new Set(this.expanded());
    for (let p = n2.parent; p; p = p.parent)
      s.add(p.key);
    this.expanded.set(s);
    this.selected.set(n2);
    this.scrollTo(n2.key);
  }
  scrollTo(key) {
    setTimeout(() => {
      const el = this.treeEl()?.nativeElement.querySelector(`[data-key="${CSS.escape(key)}"]`);
      el?.scrollIntoView({ block: "nearest" });
    });
  }
  key(e) {
    const rows = this.rows();
    if (!rows.length)
      return;
    const i = Math.max(0, rows.findIndex((r) => r.node.key === this.selected()?.key));
    const cur = rows[i];
    let next = null;
    switch (e.key) {
      case "ArrowDown":
        next = rows[Math.min(rows.length - 1, i + 1)].node;
        break;
      case "ArrowUp":
        next = rows[Math.max(0, i - 1)].node;
        break;
      case "ArrowRight":
        if (cur.hasKids && !cur.open)
          this.toggle(cur.node);
        else if (cur.open)
          next = rows[i + 1]?.node ?? null;
        break;
      case "ArrowLeft":
        if (cur.open && cur.hasKids)
          this.toggle(cur.node);
        else
          next = cur.node.parent ?? null;
        break;
      case "Enter":
      case " ":
        if (cur.hasKids)
          this.toggle(cur.node);
        break;
      case "Home":
        next = rows[0].node;
        break;
      case "End":
        next = rows[rows.length - 1].node;
        break;
      default:
        return;
    }
    e.preventDefault();
    if (next) {
      this.selected.set(next);
      this.scrollTo(next.key);
    }
  }
  static \u0275fac = function ProvenanceTree_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProvenanceTree)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProvenanceTree, selectors: [["vc-provenance-tree"]], viewQuery: function ProvenanceTree_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.treeEl, _c0, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance();
    }
  }, inputs: { data: [1, "data"], askable: [1, "askable"] }, outputs: { openFile: "openFile", ask: "ask" }, decls: 28, vars: 9, consts: [["treeEl", ""], [1, "toolbar"], [1, "search"], ["name", "search", 3, "size"], ["placeholder", "Search codes, values, methods, fingerprints\u2026", "aria-label", "Search the provenance tree", 1, "input", 3, "ngModelChange", "ngModel"], ["aria-label", "Clear search", 1, "clr"], [1, "checkbox", "small"], ["type", "checkbox", 3, "ngModelChange", "ngModel"], [1, "spacer"], [1, "btn", "btn-ghost", "btn-sm", 3, "click"], ["name", "chevrons-up-down", 3, "size"], ["name", "collapse", 3, "size"], ["role", "group", "aria-label", "Filter by record type", 1, "chips"], ["type", "button", 1, "chip", 3, "on"], [1, "body"], ["tabindex", "0", "role", "tree", "aria-label", "Provenance", 1, "tree", 3, "keydown"], [1, "fnote"], ["role", "treeitem", 1, "row", 3, "sel", "grp", "unused"], [1, "none"], [1, "insp"], [1, "iempty"], ["aria-label", "Clear search", 1, "clr", 3, "click"], ["name", "x", 3, "size"], ["type", "button", 1, "chip", 3, "click"], [3, "name", "size"], [1, "c"], ["name", "filter", 3, "size"], [1, "lnk", 3, "click"], ["role", "treeitem", 1, "row", 3, "click", "dblclick"], [1, "guides"], ["tabindex", "-1", 1, "tw", 3, "click"], ["name", "chevron-right", 3, "size", "stroke"], [1, "k"], [1, "lbl"], [1, "sub"], [1, "tag", 3, "class"], ["title", "Not used in this calculation", 1, "tag", "t-neutral"], ["name", "fingerprint", 1, "hs", 3, "size"], [3, "cls"], [1, "cnt"], [1, "tag"], [1, "ih"], [1, "k", "big"], [1, "it"], [1, "ik"], [1, "isub"], [1, "irow"], ["aria-label", "Path", 1, "crumbs"], [1, "kv", "ikv"], [1, "ihash"], [1, "small", "subtle", "ichild"], [1, "iact"], [1, "btn", "btn-secondary", "btn-sm"], [1, "small", "muted"], [1, "crumb", 3, "click"], ["name", "chevron-right", 3, "size"], [3, "value", "full"], [1, "btn", "btn-secondary", "btn-sm", 3, "click"], ["name", "external", 3, "size"], ["name", "question", 3, "size"], ["name", "network", 3, "size"], [1, "small", "subtle"]], template: function ProvenanceTree_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 1)(1, "div", 2);
      \u0275\u0275element(2, "vc-icon", 3);
      \u0275\u0275elementStart(3, "input", 4);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function ProvenanceTree_Template_input_ngModelChange_3_listener($event) {
        return ctx.q.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, ProvenanceTree_Conditional_4_Template, 2, 1, "button", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "label", 6)(6, "input", 7);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function ProvenanceTree_Template_input_ngModelChange_6_listener($event) {
        return ctx.usedOnly.set($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275text(7, "Only data used in the calculation");
      \u0275\u0275elementEnd();
      \u0275\u0275element(8, "span", 8);
      \u0275\u0275elementStart(9, "button", 9);
      \u0275\u0275listener("click", function ProvenanceTree_Template_button_click_9_listener() {
        return ctx.expandAll();
      });
      \u0275\u0275element(10, "vc-icon", 10);
      \u0275\u0275text(11, "Expand all");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "button", 9);
      \u0275\u0275listener("click", function ProvenanceTree_Template_button_click_12_listener() {
        return ctx.collapseAll();
      });
      \u0275\u0275element(13, "vc-icon", 11);
      \u0275\u0275text(14, "Collapse");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "div", 12);
      \u0275\u0275repeaterCreate(16, ProvenanceTree_For_17_Template, 5, 6, "button", 13, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 14)(19, "div", 15, 0);
      \u0275\u0275listener("keydown", function ProvenanceTree_Template_div_keydown_19_listener($event) {
        return ctx.key($event);
      });
      \u0275\u0275conditionalCreate(21, ProvenanceTree_Conditional_21_Template, 7, 5, "div", 16);
      \u0275\u0275repeaterCreate(22, ProvenanceTree_For_23_Template, 18, 31, "div", 17, _forTrack1, false, ProvenanceTree_ForEmpty_24_Template, 2, 0, "div", 18);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "aside", 19);
      \u0275\u0275conditionalCreate(26, ProvenanceTree_Conditional_26_Template, 19, 13)(27, ProvenanceTree_Conditional_27_Template, 6, 1, "div", 20);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      let tmp_12_0;
      \u0275\u0275advance(2);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance();
      \u0275\u0275property("ngModel", ctx.q());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.q() ? 4 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngModel", ctx.usedOnly());
      \u0275\u0275control();
      \u0275\u0275advance(4);
      \u0275\u0275property("size", 14);
      \u0275\u0275advance(3);
      \u0275\u0275property("size", 14);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.filters);
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.filtering() ? 21 : -1);
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.rows());
      \u0275\u0275advance(4);
      \u0275\u0275conditional((tmp_12_0 = ctx.selected()) ? 26 : 27, tmp_12_0);
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, CheckboxControlValueAccessor, NgControlStatus, NgModel, Icon, DataClass, Hash], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n}\n.toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  flex-wrap: wrap;\n  padding: 14px 16px;\n  border-bottom: 1px solid var(--%NS%border);\n}\n.search[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n  max-width: 460px;\n}\n.search[_ngcontent-%COMP%]    > vc-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--%NS%text-3);\n}\n.search[_ngcontent-%COMP%]   .input[_ngcontent-%COMP%] {\n  padding-left: 34px;\n  padding-right: 30px;\n}\n.clr[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 6px;\n  top: 7px;\n  width: 24px;\n  height: 24px;\n  display: grid;\n  place-items: center;\n  border: 0;\n  background: none;\n  color: var(--%NS%text-3);\n  cursor: pointer;\n  border-radius: 4px;\n}\n.clr[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%sand-200);\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.chips[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n  padding: 10px 16px;\n  border-bottom: 1px solid var(--%NS%border);\n  background: var(--%NS%surface-2);\n}\n.chip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 28px;\n  padding: 0 10px;\n  border-radius: 999px;\n  border: 1px solid var(--%NS%border);\n  background: var(--%NS%surface);\n  font: inherit;\n  font-size: 12.5px;\n  color: var(--%NS%stone-700);\n  cursor: pointer;\n}\n.chip[_ngcontent-%COMP%]:hover {\n  border-color: var(--%NS%stone-400);\n}\n.chip.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-600);\n  border-color: var(--%NS%forest-600);\n  color: #fff;\n}\n.chip[_ngcontent-%COMP%]   .c[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: var(--%NS%text-3);\n  font-variant-numeric: tabular-nums;\n}\n.chip.on[_ngcontent-%COMP%]   .c[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.8);\n}\n.body[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 360px;\n  min-height: 520px;\n}\n@media (max-width: 1100px) {\n  .body[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .insp[_ngcontent-%COMP%] {\n    border-left: 0;\n    border-top: 1px solid var(--%NS%border);\n  }\n}\n.tree[_ngcontent-%COMP%] {\n  padding: 8px 8px 16px;\n  max-height: 680px;\n  overflow: auto;\n  outline: none;\n}\n.tree[_ngcontent-%COMP%]:focus-visible {\n  box-shadow: inset var(--%NS%focus);\n}\n.fnote[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n  padding: 4px 8px 8px;\n}\n.row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  height: 32px;\n  padding: 0 8px 0 4px;\n  border-radius: 6px;\n  cursor: pointer;\n  white-space: nowrap;\n  min-width: 0;\n}\n.row[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%sand-100);\n}\n.row.sel[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-50);\n  box-shadow: inset 2px 0 0 var(--%NS%forest-500);\n}\n.row.grp[_ngcontent-%COMP%]   .lbl[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: var(--%NS%stone-700);\n}\n.row.unused[_ngcontent-%COMP%]   .lbl[_ngcontent-%COMP%], \n.row.unused[_ngcontent-%COMP%]   .sub[_ngcontent-%COMP%] {\n  opacity: 0.6;\n}\n.guides[_ngcontent-%COMP%] {\n  flex: none;\n  align-self: stretch;\n  background:\n    repeating-linear-gradient(\n      to right,\n      transparent 0 11px,\n      var(--%NS%sand-300) 11px 12px,\n      transparent 12px 20px);\n}\n.tw[_ngcontent-%COMP%] {\n  flex: none;\n  width: 20px;\n  height: 20px;\n  display: grid;\n  place-items: center;\n  border: 0;\n  background: none;\n  color: var(--%NS%text-3);\n  cursor: pointer;\n  border-radius: 4px;\n  padding: 0;\n}\n.tw[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%sand-200);\n  color: var(--%NS%text);\n}\n.tw.hidden[_ngcontent-%COMP%] {\n  visibility: hidden;\n}\n.tw[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  transition: transform 0.12s;\n}\n.tw[_ngcontent-%COMP%]   vc-icon.rot[_ngcontent-%COMP%] {\n  transform: rotate(90deg);\n}\n.k[_ngcontent-%COMP%] {\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 22px;\n  height: 22px;\n  border-radius: 6px;\n  background: var(--%NS%sand-200);\n  color: var(--%NS%stone-600);\n}\n.k.big[_ngcontent-%COMP%] {\n  width: 34px;\n  height: 34px;\n  border-radius: 9px;\n}\n.k-run[_ngcontent-%COMP%] {\n  background: var(--%NS%dc-calculated-bg);\n  color: var(--%NS%dc-calculated);\n}\n.k-rule[_ngcontent-%COMP%], \n.k-term[_ngcontent-%COMP%] {\n  background: var(--%NS%violet-100);\n  color: var(--%NS%violet-600);\n}\n.k-stratum[_ngcontent-%COMP%] {\n  background: var(--%NS%teal-100);\n  color: var(--%NS%teal-600);\n}\n.k-site[_ngcontent-%COMP%], \n.k-sample[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-600);\n}\n.k-layer[_ngcontent-%COMP%] {\n  background: var(--%NS%clay-50);\n  color: var(--%NS%clay-600);\n}\n.k-result[_ngcontent-%COMP%] {\n  background: var(--%NS%dc-measured-bg);\n  color: var(--%NS%dc-measured);\n}\n.k-certificate[_ngcontent-%COMP%], \n.k-photo[_ngcontent-%COMP%] {\n  background: var(--%NS%sky-100);\n  color: var(--%NS%sky-600);\n}\n.k-custody[_ngcontent-%COMP%] {\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-700);\n}\n.k-group[_ngcontent-%COMP%] {\n  background: transparent;\n  color: var(--%NS%stone-500);\n}\n.lbl[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  color: var(--%NS%text);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  min-width: 0;\n}\nmark[_ngcontent-%COMP%] {\n  background: var(--%NS%amber-100);\n  color: inherit;\n  border-radius: 2px;\n  padding: 0 1px;\n}\n.sub[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%text-3);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  min-width: 0;\n  font-variant-numeric: tabular-nums;\n}\n.tag[_ngcontent-%COMP%] {\n  flex: none;\n  font-size: 11px;\n  height: 18px;\n  line-height: 18px;\n  padding: 0 7px;\n  border-radius: 999px;\n  font-weight: 500;\n}\n.t-ok[_ngcontent-%COMP%] {\n  background: var(--%NS%ok-soft);\n  color: var(--%NS%forest-700);\n}\n.t-warn[_ngcontent-%COMP%] {\n  background: var(--%NS%warn-soft);\n  color: var(--%NS%amber-600);\n}\n.t-danger[_ngcontent-%COMP%] {\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n}\n.t-info[_ngcontent-%COMP%] {\n  background: var(--%NS%info-soft);\n  color: var(--%NS%sky-600);\n}\n.t-neutral[_ngcontent-%COMP%] {\n  background: var(--%NS%stone-100);\n  color: var(--%NS%stone-600);\n}\n.hs[_ngcontent-%COMP%] {\n  color: var(--%NS%text-3);\n}\n.cnt[_ngcontent-%COMP%] {\n  flex: none;\n  min-width: 22px;\n  height: 18px;\n  padding: 0 6px;\n  border-radius: 9px;\n  background: var(--%NS%sand-200);\n  color: var(--%NS%stone-600);\n  font-size: 11px;\n  display: grid;\n  place-items: center;\n  font-variant-numeric: tabular-nums;\n}\n.none[_ngcontent-%COMP%] {\n  padding: 40px 16px;\n  text-align: center;\n  color: var(--%NS%text-2);\n}\n.insp[_ngcontent-%COMP%] {\n  border-left: 1px solid var(--%NS%border);\n  background: var(--%NS%surface-2);\n  padding: 18px;\n  position: sticky;\n  top: var(--%NS%topbar-h);\n  align-self: start;\n  max-height: 720px;\n  overflow: auto;\n}\n.ih[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  align-items: flex-start;\n}\n.it[_ngcontent-%COMP%] {\n  min-width: 0;\n}\n.it[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  overflow-wrap: anywhere;\n}\n.ik[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 600;\n  letter-spacing: 0.07em;\n  text-transform: uppercase;\n  color: var(--%NS%text-3);\n}\n.isub[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--%NS%text-2);\n  margin-top: 2px;\n}\n.irow[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-top: 12px;\n}\n.crumbs[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 2px;\n  margin: 14px 0 4px;\n  color: var(--%NS%text-3);\n}\n.crumb[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  font: inherit;\n  font-size: 12px;\n  color: var(--%NS%text-2);\n  cursor: pointer;\n  padding: 2px 4px;\n  border-radius: 4px;\n  max-width: 180px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.crumb[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%sand-200);\n  color: var(--%NS%text);\n}\n.ikv[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  font-size: 13px;\n  grid-template-columns: minmax(110px, 44%) 1fr;\n  padding: 12px;\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: var(--%NS%radius-sm);\n}\n.ikv[_ngcontent-%COMP%]   dd[_ngcontent-%COMP%] {\n  font-variant-numeric: tabular-nums;\n}\n.ihash[_ngcontent-%COMP%] {\n  margin-top: 14px;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.ihash[_ngcontent-%COMP%]   vc-hash[_ngcontent-%COMP%] {\n  word-break: break-all;\n}\n.ichild[_ngcontent-%COMP%] {\n  margin-top: 12px;\n}\n.iact[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin-top: 16px;\n}\n.iempty[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  gap: 8px;\n  padding: 48px 12px;\n  color: var(--%NS%text-2);\n}\n.iempty[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-500);\n}\n.lnk[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  color: var(--%NS%primary);\n  font: inherit;\n  font-size: 12.5px;\n  cursor: pointer;\n  padding: 0 2px;\n}\n.lnk[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n/*# sourceMappingURL=provenance-tree.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProvenanceTree, [{
    type: Component,
    args: [{ selector: "vc-provenance-tree", imports: [FormsModule, Icon, DataClass, Hash], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="toolbar">
      <div class="search">
        <vc-icon name="search" [size]="15" />
        <input class="input" placeholder="Search codes, values, methods, fingerprints\u2026" [ngModel]="q()" (ngModelChange)="q.set($event)" aria-label="Search the provenance tree" />
        @if (q()) { <button class="clr" (click)="q.set('')" aria-label="Clear search"><vc-icon name="x" [size]="14" /></button> }
      </div>
      <label class="checkbox small"><input type="checkbox" [ngModel]="usedOnly()" (ngModelChange)="usedOnly.set($event)" />Only data used in the calculation</label>
      <span class="spacer"></span>
      <button class="btn btn-ghost btn-sm" (click)="expandAll()"><vc-icon name="chevrons-up-down" [size]="14" />Expand all</button>
      <button class="btn btn-ghost btn-sm" (click)="collapseAll()"><vc-icon name="collapse" [size]="14" />Collapse</button>
    </div>

    <div class="chips" role="group" aria-label="Filter by record type">
      @for (f of filters; track f.kind) {
        <button type="button" class="chip" [class.on]="kind() === f.kind" (click)="kind.set(kind() === f.kind ? null : f.kind)">
          <vc-icon [name]="f.icon" [size]="13" />{{ f.label }}<span class="c">{{ counts()[f.kind] ?? 0 }}</span>
        </button>
      }
    </div>

    <div class="body">
      <div class="tree" #treeEl tabindex="0" role="tree" aria-label="Provenance" (keydown)="key($event)">
        @if (filtering()) {
          <div class="fnote">
            <vc-icon name="filter" [size]="13" />
            {{ matchCount() }} match{{ matchCount() === 1 ? '' : 'es' }}
            @if (kind()) { in {{ kindLabel(kind()!) }} }
            @if (q()) { for \u201C{{ q() }}\u201D }
            <button class="lnk" (click)="clearFilters()">Clear</button>
          </div>
        }
        @for (r of rows(); track r.node.key) {
          <div class="row" role="treeitem" [attr.aria-expanded]="r.hasKids ? r.open : null" [attr.aria-level]="r.depth + 1"
            [class.sel]="selected()?.key === r.node.key" [class.grp]="r.node.kind === 'group'" [class.unused]="r.node.used === false"
            [attr.data-key]="r.node.key" (click)="select(r.node)" (dblclick)="toggle(r.node)">
            <span class="guides" [style.width.px]="r.depth * 20"></span>
            <button class="tw" [class.hidden]="!r.hasKids" (click)="toggle(r.node); $event.stopPropagation()" tabindex="-1" [attr.aria-label]="r.open ? 'Collapse' : 'Expand'">
              <vc-icon name="chevron-right" [size]="14" [stroke]="2" [class.rot]="r.open" />
            </button>
            <span class="k" [class]="'k k-' + r.node.kind"><vc-icon [name]="r.node.icon" [size]="13" /></span>
            <span class="lbl">{{ r.parts[0] }}@if (r.parts[1]) {<mark>{{ r.parts[1] }}</mark>}{{ r.parts[2] }}</span>
            @if (r.node.sub) { <span class="sub">{{ r.node.sub }}</span> }
            <span class="spacer"></span>
            @for (t of r.node.tags ?? []; track t.text) { <span class="tag" [class]="'tag t-' + t.tone">{{ t.text }}</span> }
            @if (r.node.used === false) { <span class="tag t-neutral" title="Not used in this calculation">Not used</span> }
            @if (r.node.hash) { <vc-icon class="hs" name="fingerprint" [size]="13" [attr.title]="r.node.hash" /> }
            @if (r.node.dc) { <vc-dc [cls]="r.node.dc" /> }
            @if (r.node.count !== undefined) { <span class="cnt">{{ r.node.count }}</span> }
          </div>
        } @empty {
          <div class="none">Nothing matches. Try a sample code such as a core number, an analyte, or part of a fingerprint.</div>
        }
      </div>

      <aside class="insp">
        @if (selected(); as s) {
          <div class="ih">
            <span class="k big" [class]="'k big k-' + s.kind"><vc-icon [name]="s.icon" [size]="16" /></span>
            <div class="it">
              <div class="ik">{{ kindLabel(s.kind) }}</div>
              <h3>{{ s.label }}</h3>
              @if (s.sub) { <div class="isub">{{ s.sub }}</div> }
            </div>
          </div>
          @if (s.dc || s.used !== undefined) {
            <div class="irow">
              @if (s.dc) { <vc-dc [cls]="s.dc" /> <span class="small muted">{{ dcText(s.dc) }}</span> }
            </div>
          }
          <nav class="crumbs" aria-label="Path">
            @for (c of path(); track c.key; let last = $last) {
              <button class="crumb" (click)="reveal(c)">{{ c.label }}</button>@if (!last) { <vc-icon name="chevron-right" [size]="11" /> }
            }
          </nav>
          @if (s.kv.length) {
            <dl class="kv ikv">
              @for (x of s.kv; track x[0]) { <dt>{{ x[0] }}</dt><dd>{{ x[1] }}</dd> }
            </dl>
          }
          @if (s.hash) {
            <div class="ihash">
              <div class="ik">SHA-256 fingerprint</div>
              <vc-hash [value]="s.hash" [full]="true" />
            </div>
          }
          @if (s.children.length) {
            <p class="small subtle ichild">Contains {{ s.children.length }} item{{ s.children.length === 1 ? '' : 's' }}.
              <button class="lnk" (click)="toggle(s)">{{ expanded().has(s.key) ? 'Collapse' : 'Expand' }}</button></p>
          }
          <div class="iact">
            @if (s.file) {
              <button class="btn btn-secondary btn-sm" (click)="openFile.emit(s.file)"><vc-icon name="external" [size]="14" />Open file</button>
            }
            @if (askable() && s.ref) {
              <button class="btn btn-secondary btn-sm" (click)="ask.emit({ type: s.ref.type, id: s.ref.id, label: kindLabel(s.kind) + ': ' + s.label })">
                <vc-icon name="question" [size]="14" />Raise a question
              </button>
            }
          </div>
        } @else {
          <div class="iempty">
            <vc-icon name="network" [size]="22" />
            <p>Select any item to see exactly what it holds and where it came from.</p>
            <p class="small subtle">Use the arrow keys to move through the tree; \u2192 opens, \u2190 closes.</p>
          </div>
        }
      </aside>
    </div>
  `, styles: ["/* angular:styles/component:scss;b2b0a86fa5ae7f3d;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\calculations\\provenance-tree.ts */\n:host {\n  display: block;\n}\n.toolbar {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  flex-wrap: wrap;\n  padding: 14px 16px;\n  border-bottom: 1px solid var(--border);\n}\n.search {\n  position: relative;\n  flex: 1;\n  min-width: 240px;\n  max-width: 460px;\n}\n.search > vc-icon {\n  position: absolute;\n  left: 12px;\n  top: 11px;\n  color: var(--text-3);\n}\n.search .input {\n  padding-left: 34px;\n  padding-right: 30px;\n}\n.clr {\n  position: absolute;\n  right: 6px;\n  top: 7px;\n  width: 24px;\n  height: 24px;\n  display: grid;\n  place-items: center;\n  border: 0;\n  background: none;\n  color: var(--text-3);\n  cursor: pointer;\n  border-radius: 4px;\n}\n.clr:hover {\n  background: var(--sand-200);\n}\n.spacer {\n  flex: 1;\n}\n.chips {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n  padding: 10px 16px;\n  border-bottom: 1px solid var(--border);\n  background: var(--surface-2);\n}\n.chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 28px;\n  padding: 0 10px;\n  border-radius: 999px;\n  border: 1px solid var(--border);\n  background: var(--surface);\n  font: inherit;\n  font-size: 12.5px;\n  color: var(--stone-700);\n  cursor: pointer;\n}\n.chip:hover {\n  border-color: var(--stone-400);\n}\n.chip.on {\n  background: var(--forest-600);\n  border-color: var(--forest-600);\n  color: #fff;\n}\n.chip .c {\n  font-size: 11px;\n  color: var(--text-3);\n  font-variant-numeric: tabular-nums;\n}\n.chip.on .c {\n  color: rgba(255, 255, 255, 0.8);\n}\n.body {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 360px;\n  min-height: 520px;\n}\n@media (max-width: 1100px) {\n  .body {\n    grid-template-columns: 1fr;\n  }\n  .insp {\n    border-left: 0;\n    border-top: 1px solid var(--border);\n  }\n}\n.tree {\n  padding: 8px 8px 16px;\n  max-height: 680px;\n  overflow: auto;\n  outline: none;\n}\n.tree:focus-visible {\n  box-shadow: inset var(--focus);\n}\n.fnote {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12.5px;\n  color: var(--text-2);\n  padding: 4px 8px 8px;\n}\n.row {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  height: 32px;\n  padding: 0 8px 0 4px;\n  border-radius: 6px;\n  cursor: pointer;\n  white-space: nowrap;\n  min-width: 0;\n}\n.row:hover {\n  background: var(--sand-100);\n}\n.row.sel {\n  background: var(--forest-50);\n  box-shadow: inset 2px 0 0 var(--forest-500);\n}\n.row.grp .lbl {\n  font-weight: 500;\n  color: var(--stone-700);\n}\n.row.unused .lbl,\n.row.unused .sub {\n  opacity: 0.6;\n}\n.guides {\n  flex: none;\n  align-self: stretch;\n  background:\n    repeating-linear-gradient(\n      to right,\n      transparent 0 11px,\n      var(--sand-300) 11px 12px,\n      transparent 12px 20px);\n}\n.tw {\n  flex: none;\n  width: 20px;\n  height: 20px;\n  display: grid;\n  place-items: center;\n  border: 0;\n  background: none;\n  color: var(--text-3);\n  cursor: pointer;\n  border-radius: 4px;\n  padding: 0;\n}\n.tw:hover {\n  background: var(--sand-200);\n  color: var(--text);\n}\n.tw.hidden {\n  visibility: hidden;\n}\n.tw vc-icon {\n  transition: transform 0.12s;\n}\n.tw vc-icon.rot {\n  transform: rotate(90deg);\n}\n.k {\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 22px;\n  height: 22px;\n  border-radius: 6px;\n  background: var(--sand-200);\n  color: var(--stone-600);\n}\n.k.big {\n  width: 34px;\n  height: 34px;\n  border-radius: 9px;\n}\n.k-run {\n  background: var(--dc-calculated-bg);\n  color: var(--dc-calculated);\n}\n.k-rule,\n.k-term {\n  background: var(--violet-100);\n  color: var(--violet-600);\n}\n.k-stratum {\n  background: var(--teal-100);\n  color: var(--teal-600);\n}\n.k-site,\n.k-sample {\n  background: var(--forest-100);\n  color: var(--forest-600);\n}\n.k-layer {\n  background: var(--clay-50);\n  color: var(--clay-600);\n}\n.k-result {\n  background: var(--dc-measured-bg);\n  color: var(--dc-measured);\n}\n.k-certificate,\n.k-photo {\n  background: var(--sky-100);\n  color: var(--sky-600);\n}\n.k-custody {\n  background: var(--stone-100);\n  color: var(--stone-700);\n}\n.k-group {\n  background: transparent;\n  color: var(--stone-500);\n}\n.lbl {\n  font-size: 13.5px;\n  color: var(--text);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  min-width: 0;\n}\nmark {\n  background: var(--amber-100);\n  color: inherit;\n  border-radius: 2px;\n  padding: 0 1px;\n}\n.sub {\n  font-size: 12.5px;\n  color: var(--text-3);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  min-width: 0;\n  font-variant-numeric: tabular-nums;\n}\n.tag {\n  flex: none;\n  font-size: 11px;\n  height: 18px;\n  line-height: 18px;\n  padding: 0 7px;\n  border-radius: 999px;\n  font-weight: 500;\n}\n.t-ok {\n  background: var(--ok-soft);\n  color: var(--forest-700);\n}\n.t-warn {\n  background: var(--warn-soft);\n  color: var(--amber-600);\n}\n.t-danger {\n  background: var(--danger-soft);\n  color: var(--red-600);\n}\n.t-info {\n  background: var(--info-soft);\n  color: var(--sky-600);\n}\n.t-neutral {\n  background: var(--stone-100);\n  color: var(--stone-600);\n}\n.hs {\n  color: var(--text-3);\n}\n.cnt {\n  flex: none;\n  min-width: 22px;\n  height: 18px;\n  padding: 0 6px;\n  border-radius: 9px;\n  background: var(--sand-200);\n  color: var(--stone-600);\n  font-size: 11px;\n  display: grid;\n  place-items: center;\n  font-variant-numeric: tabular-nums;\n}\n.none {\n  padding: 40px 16px;\n  text-align: center;\n  color: var(--text-2);\n}\n.insp {\n  border-left: 1px solid var(--border);\n  background: var(--surface-2);\n  padding: 18px;\n  position: sticky;\n  top: var(--topbar-h);\n  align-self: start;\n  max-height: 720px;\n  overflow: auto;\n}\n.ih {\n  display: flex;\n  gap: 12px;\n  align-items: flex-start;\n}\n.it {\n  min-width: 0;\n}\n.it h3 {\n  overflow-wrap: anywhere;\n}\n.ik {\n  font-size: 11px;\n  font-weight: 600;\n  letter-spacing: 0.07em;\n  text-transform: uppercase;\n  color: var(--text-3);\n}\n.isub {\n  font-size: 13px;\n  color: var(--text-2);\n  margin-top: 2px;\n}\n.irow {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-top: 12px;\n}\n.crumbs {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 2px;\n  margin: 14px 0 4px;\n  color: var(--text-3);\n}\n.crumb {\n  border: 0;\n  background: none;\n  font: inherit;\n  font-size: 12px;\n  color: var(--text-2);\n  cursor: pointer;\n  padding: 2px 4px;\n  border-radius: 4px;\n  max-width: 180px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.crumb:hover {\n  background: var(--sand-200);\n  color: var(--text);\n}\n.ikv {\n  margin-top: 12px;\n  font-size: 13px;\n  grid-template-columns: minmax(110px, 44%) 1fr;\n  padding: 12px;\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius-sm);\n}\n.ikv dd {\n  font-variant-numeric: tabular-nums;\n}\n.ihash {\n  margin-top: 14px;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.ihash vc-hash {\n  word-break: break-all;\n}\n.ichild {\n  margin-top: 12px;\n}\n.iact {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin-top: 16px;\n}\n.iempty {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  gap: 8px;\n  padding: 48px 12px;\n  color: var(--text-2);\n}\n.iempty vc-icon {\n  color: var(--forest-500);\n}\n.lnk {\n  border: 0;\n  background: none;\n  color: var(--primary);\n  font: inherit;\n  font-size: 12.5px;\n  cursor: pointer;\n  padding: 0 2px;\n}\n.lnk:hover {\n  text-decoration: underline;\n}\n/*# sourceMappingURL=provenance-tree.css.map */\n"] }]
  }], () => [], { data: [{ type: Input, args: [{ isSignal: true, alias: "data", required: true }] }], askable: [{ type: Input, args: [{ isSignal: true, alias: "askable", required: false }] }], openFile: [{ type: Output, args: ["openFile"] }], ask: [{ type: Output, args: ["ask"] }], treeEl: [{ type: ViewChild, args: ["treeEl", { isSignal: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProvenanceTree, { className: "ProvenanceTree", filePath: "src/app/features/calculations/provenance-tree.ts", lineNumber: 404 });
})();
function split(label, q) {
  if (!q)
    return [label, "", ""];
  const i = label.toLowerCase().indexOf(q);
  if (i < 0)
    return [label, "", ""];
  return [label.slice(0, i), label.slice(i, i + q.length), label.slice(i + q.length)];
}

export {
  ProvenanceTree
};
//# debugId=2eb7d299-a424-546b-9639-2633d8c2c729
//# sourceMappingURL=chunk-WFSU6S3M.js.map
