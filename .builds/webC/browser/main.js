import {
  Brand
} from "./chunk-PLD4FPAY.js";
import {
  toSignal
} from "./chunk-OZDQGELJ.js";
import {
  ProjectContext
} from "./chunk-YJGD7DJQ.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-WOW2CD4M.js";
import {
  ActivatedRoute,
  AuthService,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  authInterceptor,
  bootstrapApplication,
  bootstrapSession,
  provideRouter,
  signedInGuard,
  withComponentInputBinding,
  withInMemoryScrolling
} from "./chunk-PNIM44LI.js";
import {
  Callout
} from "./chunk-3GJ7OF6Y.js";
import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  Icon,
  Injectable,
  InjectionToken,
  Injector,
  NEVER,
  NgModule,
  NgZone,
  Observable,
  RuntimeError,
  Subject,
  __spreadProps,
  __spreadValues,
  computed,
  filter,
  formatRuntimeError,
  inject,
  isDevMode,
  makeEnvironmentProviders,
  map,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideHttpClient,
  setClassMetadata,
  signal,
  switchMap,
  take,
  withInterceptors,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
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

// node_modules/@angular/service-worker/fesm2022/service-worker.mjs
/**
 * @license Angular v22.2.0
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */
var ERR_SW_NOT_SUPPORTED = "Service workers are disabled or not supported by this browser";
var NgswCommChannel = class {
  serviceWorker;
  worker;
  registration;
  events;
  constructor(serviceWorker, injector) {
    this.serviceWorker = serviceWorker;
    if (!serviceWorker) {
      this.worker = this.events = this.registration = new Observable((subscriber) => subscriber.error(new RuntimeError(5601, (typeof ngDevMode === "undefined" || ngDevMode) && ERR_SW_NOT_SUPPORTED)));
    } else {
      let currentWorker = null;
      const workerSubject = new Subject();
      this.worker = new Observable((subscriber) => {
        if (currentWorker !== null) {
          subscriber.next(currentWorker);
        }
        return workerSubject.subscribe((v) => subscriber.next(v));
      });
      const updateController = () => {
        const {
          controller
        } = serviceWorker;
        if (controller === null) {
          return;
        }
        currentWorker = controller;
        workerSubject.next(currentWorker);
      };
      serviceWorker.addEventListener("controllerchange", updateController);
      updateController();
      this.registration = this.worker.pipe(switchMap(() => serviceWorker.getRegistration().then((registration) => {
        if (!registration) {
          throw new RuntimeError(5601, (typeof ngDevMode === "undefined" || ngDevMode) && ERR_SW_NOT_SUPPORTED);
        }
        return registration;
      })));
      const _events = new Subject();
      this.events = _events.asObservable();
      const messageListener = (event) => {
        const {
          data
        } = event;
        if (data?.type) {
          _events.next(data);
        }
      };
      serviceWorker.addEventListener("message", messageListener);
      const appRef = injector?.get(ApplicationRef, null, {
        optional: true
      });
      appRef?.onDestroy(() => {
        serviceWorker.removeEventListener("controllerchange", updateController);
        serviceWorker.removeEventListener("message", messageListener);
      });
    }
  }
  postMessage(action, payload) {
    return new Promise((resolve) => {
      this.worker.pipe(take(1)).subscribe((sw) => {
        sw.postMessage(__spreadValues({
          action
        }, payload));
        resolve();
      });
    });
  }
  postMessageWithOperation(type, payload, operationNonce) {
    const waitForOperationCompleted = this.waitForOperationCompleted(operationNonce);
    const postMessage = this.postMessage(type, payload);
    return Promise.all([postMessage, waitForOperationCompleted]).then(([, result]) => result);
  }
  generateNonce() {
    return Math.round(Math.random() * 1e7);
  }
  eventsOfType(type) {
    let filterFn;
    if (typeof type === "string") {
      filterFn = (event) => event.type === type;
    } else {
      filterFn = (event) => type.includes(event.type);
    }
    return this.events.pipe(filter(filterFn));
  }
  nextEventOfType(type) {
    return this.eventsOfType(type).pipe(take(1));
  }
  waitForOperationCompleted(nonce) {
    return new Promise((resolve, reject) => {
      this.eventsOfType("OPERATION_COMPLETED").pipe(filter((event) => event.nonce === nonce), take(1), map((event) => {
        if (event.result !== void 0) {
          return event.result;
        }
        throw new Error(event.error);
      })).subscribe({
        next: resolve,
        error: reject
      });
    });
  }
  get isEnabled() {
    return !!this.serviceWorker;
  }
};
var SwPush = class _SwPush {
  sw;
  messages;
  notificationClicks;
  notificationCloses;
  pushSubscriptionChanges;
  subscription;
  get isEnabled() {
    return this.sw.isEnabled;
  }
  pushManager = null;
  subscriptionChanges = new Subject();
  constructor(sw) {
    this.sw = sw;
    if (!sw.isEnabled) {
      this.messages = NEVER;
      this.notificationClicks = NEVER;
      this.notificationCloses = NEVER;
      this.pushSubscriptionChanges = NEVER;
      this.subscription = NEVER;
      return;
    }
    this.messages = this.sw.eventsOfType("PUSH").pipe(map((message) => message.data));
    this.notificationClicks = this.sw.eventsOfType("NOTIFICATION_CLICK").pipe(map((message) => message.data));
    this.notificationCloses = this.sw.eventsOfType("NOTIFICATION_CLOSE").pipe(map((message) => message.data));
    this.pushSubscriptionChanges = this.sw.eventsOfType("PUSH_SUBSCRIPTION_CHANGE").pipe(map((message) => message.data));
    this.pushManager = this.sw.registration.pipe(map((registration) => registration.pushManager));
    const workerDrivenSubscriptions = this.pushManager.pipe(switchMap((pm) => pm.getSubscription()));
    this.subscription = new Observable((subscriber) => {
      const workerDrivenSubscription = workerDrivenSubscriptions.subscribe(subscriber);
      const subscriptionChanges = this.subscriptionChanges.subscribe(subscriber);
      return () => {
        workerDrivenSubscription.unsubscribe();
        subscriptionChanges.unsubscribe();
      };
    });
  }
  requestSubscription(options) {
    if (!this.sw.isEnabled || this.pushManager === null) {
      return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
    }
    const pushOptions = {
      userVisibleOnly: true
    };
    let key = this.decodeBase64(options.serverPublicKey.replace(/_/g, "/").replace(/-/g, "+"));
    let applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
    for (let i = 0; i < key.length; i++) {
      applicationServerKey[i] = key.charCodeAt(i);
    }
    pushOptions.applicationServerKey = applicationServerKey;
    return new Promise((resolve, reject) => {
      this.pushManager.pipe(switchMap((pm) => pm.subscribe(pushOptions)), take(1)).subscribe({
        next: (sub) => {
          this.subscriptionChanges.next(sub);
          resolve(sub);
        },
        error: reject
      });
    });
  }
  unsubscribe() {
    if (!this.sw.isEnabled) {
      return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
    }
    const doUnsubscribe = (sub) => {
      if (sub === null) {
        throw new RuntimeError(5602, (typeof ngDevMode === "undefined" || ngDevMode) && "Not subscribed to push notifications.");
      }
      return sub.unsubscribe().then((success) => {
        if (!success) {
          throw new RuntimeError(5603, (typeof ngDevMode === "undefined" || ngDevMode) && "Unsubscribe failed!");
        }
        this.subscriptionChanges.next(null);
      });
    };
    return new Promise((resolve, reject) => {
      this.subscription.pipe(take(1), switchMap(doUnsubscribe)).subscribe({
        next: resolve,
        error: reject
      });
    });
  }
  decodeBase64(input) {
    return atob(input);
  }
  static \u0275fac = function SwPush_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SwPush)(\u0275\u0275inject(NgswCommChannel));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _SwPush,
    factory: _SwPush.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SwPush, [{
    type: Injectable
  }], () => [{
    type: NgswCommChannel
  }], null);
})();
var SwUpdate = class _SwUpdate {
  sw;
  versionUpdates;
  unrecoverable;
  get isEnabled() {
    return this.sw.isEnabled;
  }
  ongoingCheckForUpdate = null;
  constructor(sw) {
    this.sw = sw;
    if (!sw.isEnabled) {
      this.versionUpdates = NEVER;
      this.unrecoverable = NEVER;
      return;
    }
    this.versionUpdates = this.sw.eventsOfType(["VERSION_DETECTED", "VERSION_INSTALLATION_FAILED", "VERSION_READY", "NO_NEW_VERSION_DETECTED"]);
    this.unrecoverable = this.sw.eventsOfType("UNRECOVERABLE_STATE");
  }
  checkForUpdate() {
    if (!this.sw.isEnabled) {
      return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
    }
    if (this.ongoingCheckForUpdate) {
      return this.ongoingCheckForUpdate;
    }
    const nonce = this.sw.generateNonce();
    this.ongoingCheckForUpdate = this.sw.postMessageWithOperation("CHECK_FOR_UPDATES", {
      nonce
    }, nonce).finally(() => {
      this.ongoingCheckForUpdate = null;
    });
    return this.ongoingCheckForUpdate;
  }
  activateUpdate() {
    if (!this.sw.isEnabled) {
      return Promise.reject(new RuntimeError(5601, (typeof ngDevMode === "undefined" || ngDevMode) && ERR_SW_NOT_SUPPORTED));
    }
    const nonce = this.sw.generateNonce();
    return this.sw.postMessageWithOperation("ACTIVATE_UPDATE", {
      nonce
    }, nonce);
  }
  static \u0275fac = function SwUpdate_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SwUpdate)(\u0275\u0275inject(NgswCommChannel));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _SwUpdate,
    factory: _SwUpdate.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SwUpdate, [{
    type: Injectable
  }], () => [{
    type: NgswCommChannel
  }], null);
})();
var SCRIPT = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "NGSW_REGISTER_SCRIPT" : "");
function ngswAppInitializer() {
  if (false) {
    return;
  }
  const options = inject(SwRegistrationOptions);
  if (!("serviceWorker" in navigator && options.enabled !== false)) {
    return;
  }
  const script = inject(SCRIPT);
  const ngZone = inject(NgZone);
  const appRef = inject(ApplicationRef);
  ngZone.runOutsideAngular(() => {
    const sw = navigator.serviceWorker;
    const onControllerChange = () => sw.controller?.postMessage({
      action: "INITIALIZE"
    });
    sw.addEventListener("controllerchange", onControllerChange);
    appRef.onDestroy(() => {
      sw.removeEventListener("controllerchange", onControllerChange);
    });
  });
  ngZone.runOutsideAngular(() => {
    let readyToRegister;
    const {
      registrationStrategy
    } = options;
    if (typeof registrationStrategy === "function") {
      readyToRegister = new Promise((resolve) => registrationStrategy().subscribe(() => resolve()));
    } else {
      const [strategy, ...args] = (registrationStrategy || "registerWhenStable:30000").split(":");
      switch (strategy) {
        case "registerImmediately":
          readyToRegister = Promise.resolve();
          break;
        case "registerWithDelay":
          readyToRegister = delayWithTimeout(+args[0] || 0);
          break;
        case "registerWhenStable":
          readyToRegister = Promise.race([appRef.whenStable(), delayWithTimeout(+args[0])]);
          break;
        default:
          throw new RuntimeError(5600, (typeof ngDevMode === "undefined" || ngDevMode) && `Unknown ServiceWorker registration strategy: ${options.registrationStrategy}`);
      }
    }
    readyToRegister.then(() => {
      if (appRef.destroyed) {
        return;
      }
      navigator.serviceWorker.register(script, {
        scope: options.scope,
        updateViaCache: options.updateViaCache,
        type: options.type
      }).catch((err) => console.error(formatRuntimeError(5604, (typeof ngDevMode === "undefined" || ngDevMode) && "Service worker registration failed with: " + err)));
    });
  });
}
function delayWithTimeout(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
function ngswCommChannelFactory() {
  const opts = inject(SwRegistrationOptions);
  const injector = inject(Injector);
  const isBrowser = true;
  return new NgswCommChannel(isBrowser && opts.enabled !== false ? navigator.serviceWorker : void 0, injector);
}
var SwRegistrationOptions = class {
  enabled;
  updateViaCache;
  type;
  scope;
  registrationStrategy;
};
function provideServiceWorker(script, options = {}) {
  return makeEnvironmentProviders([SwPush, SwUpdate, {
    provide: SCRIPT,
    useValue: script
  }, {
    provide: SwRegistrationOptions,
    useValue: options
  }, {
    provide: NgswCommChannel,
    useFactory: ngswCommChannelFactory
  }, provideAppInitializer(ngswAppInitializer)]);
}
var ServiceWorkerModule = class _ServiceWorkerModule {
  static register(script, options = {}) {
    return {
      ngModule: _ServiceWorkerModule,
      providers: [provideServiceWorker(script, options)]
    };
  }
  static \u0275fac = function ServiceWorkerModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ServiceWorkerModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _ServiceWorkerModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    providers: [SwPush, SwUpdate]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ServiceWorkerModule, [{
    type: NgModule,
    args: [{
      providers: [SwPush, SwUpdate]
    }]
  }], null, null);
})();

// src/app/features/auth/dev-login.ts
var DevLogin = class _DevLogin {
  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  msg = signal(
    "Signing in\u2026",
    ...ngDevMode ? [{ debugName: "msg" }] : (
      /* istanbul ignore next */
      []
    )
  );
  ngOnInit() {
    if (!isDevMode()) {
      this.router.navigate(["/login"]);
      return;
    }
    const q = this.route.snapshot.queryParamMap;
    const email = q.get("email") ?? "admin@example.com";
    const next = q.get("next") ?? "";
    this.auth.login(email, q.get("password") ?? "Demo-Pass-2026!").subscribe({
      next: (r) => r.status === "ok" ? this.router.navigateByUrl(next || this.auth.home()) : this.msg.set("MFA required"),
      error: (e) => this.msg.set(e.message)
    });
  }
  static \u0275fac = function DevLogin_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DevLogin)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DevLogin, selectors: [["vc-dev-login"]], decls: 2, vars: 1, consts: [[2, "padding", "24px", "font-family", "var(--mono)"]], template: function DevLogin_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "p", 0);
      \u0275\u0275text(1);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.msg());
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DevLogin, [{
    type: Component,
    args: [{
      selector: "vc-dev-login",
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<p style="padding:24px;font-family:var(--mono)">{{ msg() }}</p>`
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DevLogin, { className: "DevLogin", filePath: "src/app/features/auth/dev-login.ts", lineNumber: 11 });
})();

// src/app/features/auth/login.ts
function Login_Case_36_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "vc-callout", 18);
    \u0275\u0275text(1, "Your session ended. Please sign in again.");
    \u0275\u0275elementEnd();
  }
}
function Login_Case_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Sign in");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 17);
    \u0275\u0275text(3, "Use the account your programme administrator created for you.");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, Login_Case_36_Conditional_4_Template, 2, 0, "vc-callout", 18);
    \u0275\u0275elementStart(5, "div", 19)(6, "label", 20);
    \u0275\u0275text(7, "Work email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "input", 21);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function Login_Case_36_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.email, $event) || (ctx_r1.email = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 19)(10, "label", 22);
    \u0275\u0275text(11, "Password");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 23)(13, "input", 24);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function Login_Case_36_Template_input_ngModelChange_13_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.password, $event) || (ctx_r1.password = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "button", 25);
    \u0275\u0275listener("click", function Login_Case_36_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.show.set(!ctx_r1.show()));
    });
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275conditional(ctx_r1.expired ? 4 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.email);
    \u0275\u0275control();
    \u0275\u0275advance(5);
    \u0275\u0275property("type", ctx_r1.show() ? "text" : "password");
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.password);
    \u0275\u0275control();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.show() ? "Hide" : "Show");
  }
}
function Login_Case_37_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Set up two-step verification");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 17);
    \u0275\u0275text(3, "Your role needs a second factor. Add this key to Google Authenticator, Microsoft Authenticator or a similar app, then enter the 6-digit code.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 26)(5, "code");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 19)(8, "label", 27);
    \u0275\u0275text(9, "6-digit code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "input", 28);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function Login_Case_37_Template_input_ngModelChange_10_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.code, $event) || (ctx_r1.code = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.secret());
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.code);
    \u0275\u0275control();
  }
}
function Login_Case_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "h2");
    \u0275\u0275text(1, "Enter your code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p", 17);
    \u0275\u0275text(3, "Open your authenticator app and enter the 6-digit code for Varsapradaya Carbon.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 19)(5, "label", 29);
    \u0275\u0275text(6, "6-digit code");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 30);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function Login_Case_38_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.code, $event) || (ctx_r1.code = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.code);
    \u0275\u0275control();
  }
}
function Login_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275element(1, "vc-icon", 31);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function Login_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Signing in\u2026 ");
  }
}
function Login_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
    \u0275\u0275element(1, "vc-icon", 32);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1(" ", ctx_r1.step() === "password" ? "Sign in" : "Verify", " ");
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
var Login = class _Login {
  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  email = "";
  password = "";
  code = "";
  expired = this.route.snapshot.queryParamMap.has("expired");
  step = signal(
    "password",
    ...ngDevMode ? [{ debugName: "step" }] : (
      /* istanbul ignore next */
      []
    )
  );
  secret = signal(
    "",
    ...ngDevMode ? [{ debugName: "secret" }] : (
      /* istanbul ignore next */
      []
    )
  );
  challenge = "";
  busy = signal(
    false,
    ...ngDevMode ? [{ debugName: "busy" }] : (
      /* istanbul ignore next */
      []
    )
  );
  error = signal(
    "",
    ...ngDevMode ? [{ debugName: "error" }] : (
      /* istanbul ignore next */
      []
    )
  );
  show = signal(
    false,
    ...ngDevMode ? [{ debugName: "show" }] : (
      /* istanbul ignore next */
      []
    )
  );
  submit() {
    this.error.set("");
    this.busy.set(true);
    const done = () => this.busy.set(false);
    if (this.step() === "password") {
      this.auth.login(this.email.trim(), this.password).subscribe({
        next: (r) => {
          done();
          if (r.status === "ok")
            return this.go();
          this.challenge = r.challenge ?? "";
          if (r.status === "mfa_required")
            this.step.set("mfa");
          else
            this.auth.mfaSetup(this.challenge).subscribe((s) => {
              this.secret.set(s.secret);
              this.step.set("setup");
            });
        },
        error: (e) => {
          done();
          this.error.set(e.message);
        }
      });
    } else {
      this.auth.mfaVerify(this.challenge, this.code).subscribe({
        next: () => {
          done();
          this.go();
        },
        error: (e) => {
          done();
          this.error.set(e.message);
        }
      });
    }
  }
  go() {
    const next = this.route.snapshot.queryParamMap.get("next");
    this.router.navigateByUrl(next && next.startsWith("/") ? next : this.auth.home());
  }
  static \u0275fac = function Login_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Login)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Login, selectors: [["vc-login"]], decls: 45, vars: 8, consts: [[1, "art"], [3, "light"], [1, "pitch"], ["aria-hidden", "true", 1, "profile"], [1, "layer", "l1"], [1, "layer", "l2"], [1, "layer", "l3"], [1, "sprout"], [1, "points"], ["name", "flask", 3, "size"], ["name", "fingerprint", 3, "size"], ["name", "hand-coins", 3, "size"], [1, "panel"], [1, "box", 3, "ngSubmit"], [1, "err"], ["type", "submit", 1, "btn", "btn-primary", "btn-lg", 3, "disabled"], [1, "legal"], [1, "muted"], ["tone", "warn", "icon", "clock"], [1, "field"], ["for", "email"], ["id", "email", "name", "email", "type", "email", "autocomplete", "username", "required", "", "autofocus", "", 1, "input", 3, "ngModelChange", "ngModel"], ["for", "pw"], [1, "pw"], ["id", "pw", "name", "password", "autocomplete", "current-password", "required", "", 1, "input", 3, "ngModelChange", "type", "ngModel"], ["type", "button", 1, "btn", "btn-ghost", "btn-sm", 3, "click"], [1, "secret"], ["for", "code"], ["id", "code", "name", "code", "inputmode", "numeric", "maxlength", "6", "autofocus", "", 1, "input", "code", 3, "ngModelChange", "ngModel"], ["for", "code2"], ["id", "code2", "name", "code", "inputmode", "numeric", "maxlength", "6", "autofocus", "", 1, "input", "code", 3, "ngModelChange", "ngModel"], ["name", "alert", 3, "size"], ["name", "arrow-right", 3, "size"]], template: function Login_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0);
      \u0275\u0275element(1, "vc-brand", 1);
      \u0275\u0275elementStart(2, "div", 2)(3, "h1");
      \u0275\u0275text(4, "Soil carbon you can prove.");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p");
      \u0275\u0275text(6, "Measure, verify and pay for regenerative farming \u2014 every tonne traced from the payment back to the soil it came from.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 3)(8, "div", 4)(9, "span");
      \u0275\u0275text(10, "0\u201310 cm");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "em");
      \u0275\u0275text(12, "1.82% SOC");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(13, "div", 5)(14, "span");
      \u0275\u0275text(15, "10\u201320 cm");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "em");
      \u0275\u0275text(17, "1.41% SOC");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "div", 6)(19, "span");
      \u0275\u0275text(20, "20\u201330 cm");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "em");
      \u0275\u0275text(22, "1.07% SOC");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(23, "div", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(24, "ul", 8)(25, "li");
      \u0275\u0275element(26, "vc-icon", 9);
      \u0275\u0275text(27, "Lab-measured carbon, never estimates");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "li");
      \u0275\u0275element(29, "vc-icon", 10);
      \u0275\u0275text(30, "Tamper-evident evidence, end to end");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(31, "li");
      \u0275\u0275element(32, "vc-icon", 11);
      \u0275\u0275text(33, "Transparent payouts for every farmer");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(34, "section", 12)(35, "form", 13);
      \u0275\u0275listener("ngSubmit", function Login_Template_form_ngSubmit_35_listener() {
        return ctx.submit();
      });
      \u0275\u0275conditionalCreate(36, Login_Case_36_Template, 16, 5)(37, Login_Case_37_Template, 11, 2)(38, Login_Case_38_Template, 8, 1);
      \u0275\u0275conditionalCreate(39, Login_Conditional_39_Template, 3, 2, "div", 14);
      \u0275\u0275elementStart(40, "button", 15);
      \u0275\u0275conditionalCreate(41, Login_Conditional_41_Template, 1, 0)(42, Login_Conditional_42_Template, 2, 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "p", 16);
      \u0275\u0275text(44, "Protected workspace. Activity is recorded in the audit log.");
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      let tmp_4_0;
      \u0275\u0275advance();
      \u0275\u0275property("light", true);
      \u0275\u0275advance(25);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance(3);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance(3);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance(4);
      \u0275\u0275conditional((tmp_4_0 = ctx.step()) === "password" ? 36 : tmp_4_0 === "setup" ? 37 : tmp_4_0 === "mfa" ? 38 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.error() ? 39 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.busy());
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.busy() ? 41 : 42);
    }
  }, dependencies: [FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MaxLengthValidator, NgModel, NgForm, Brand, Icon, Callout], styles: ["\n[_nghost-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);\n  min-height: 100vh;\n  background: var(--%NS%surface);\n}\n.art[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  padding: 40px 48px;\n  color: #fff;\n  overflow: hidden;\n  background:\n    radial-gradient(\n      120% 90% at 0% 0%,\n      #275e3f 0%,\n      #10291c 55%,\n      #0b1f15 100%);\n}\n.pitch[_ngcontent-%COMP%] {\n  margin-top: auto;\n  max-width: 460px;\n  position: relative;\n  z-index: 2;\n}\n.pitch[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  color: #fff;\n  font-size: 38px;\n  line-height: 1.1;\n  letter-spacing: -0.02em;\n}\n.pitch[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 14px;\n  font-size: 16px;\n  color: rgba(255, 255, 255, 0.74);\n  line-height: 1.55;\n}\n.profile[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 56px;\n  top: 13%;\n  width: 270px;\n  border-radius: 18px;\n  overflow: hidden;\n  transform: rotate(-4deg);\n  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);\n  opacity: 0.95;\n}\n.layer[_ngcontent-%COMP%] {\n  height: 84px;\n  display: flex;\n  align-items: flex-end;\n  justify-content: space-between;\n  padding: 10px 16px;\n  font: 500 12px var(--%NS%mono);\n}\n.layer[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.75);\n}\n.layer[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-style: normal;\n  color: #fff;\n  background: rgba(0, 0, 0, 0.18);\n  padding: 3px 7px;\n  border-radius: 5px;\n}\n.l1[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #5a3a22,\n      #6b4428);\n}\n.l2[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #7b4f2c,\n      #8a5a33);\n}\n.l3[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      180deg,\n      #9a6a3c,\n      #a9794a);\n}\n.sprout[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -2px;\n  left: 40px;\n  width: 120px;\n  height: 10px;\n  background:\n    linear-gradient(\n      90deg,\n      #86b797,\n      #4f9168);\n  border-radius: 0 0 6px 6px;\n}\n.points[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  margin: 28px 0 0;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  position: relative;\n  z-index: 2;\n}\n.points[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  color: rgba(255, 255, 255, 0.82);\n  font-size: 14px;\n}\n.points[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-300);\n}\n.panel[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  padding: 40px 24px;\n  background: var(--%NS%sand-50);\n}\n.box[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 380px;\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.box[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 24px;\n}\n.pw[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n}\n.secret[_ngcontent-%COMP%] {\n  padding: 12px;\n  border-radius: 8px;\n  background: var(--%NS%sand-100);\n  border: 1px dashed var(--%NS%border-strong);\n  text-align: center;\n}\n.secret[_ngcontent-%COMP%]   code[_ngcontent-%COMP%] {\n  font-size: 15px;\n  letter-spacing: 0.12em;\n  word-break: break-all;\n}\n.code[_ngcontent-%COMP%] {\n  font: 500 20px var(--%NS%mono);\n  letter-spacing: 0.4em;\n  text-align: center;\n  height: 48px;\n}\n.err[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  padding: 10px 12px;\n  border-radius: 8px;\n  background: var(--%NS%danger-soft);\n  color: var(--%NS%red-600);\n  font-size: 13px;\n}\n.legal[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--%NS%text-3);\n  text-align: center;\n}\n@media (max-width: 880px) {\n  [_nghost-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .art[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=login.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Login, [{
    type: Component,
    args: [{ selector: "vc-login", imports: [FormsModule, Brand, Icon, Callout], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <section class="art">
      <vc-brand [light]="true" />
      <div class="pitch">
        <h1>Soil carbon you can prove.</h1>
        <p>Measure, verify and pay for regenerative farming \u2014 every tonne traced from the payment back to the soil it came from.</p>
      </div>
      <div class="profile" aria-hidden="true">
        <div class="layer l1"><span>0\u201310 cm</span><em>1.82% SOC</em></div>
        <div class="layer l2"><span>10\u201320 cm</span><em>1.41% SOC</em></div>
        <div class="layer l3"><span>20\u201330 cm</span><em>1.07% SOC</em></div>
        <div class="sprout"></div>
      </div>
      <ul class="points">
        <li><vc-icon name="flask" [size]="15" />Lab-measured carbon, never estimates</li>
        <li><vc-icon name="fingerprint" [size]="15" />Tamper-evident evidence, end to end</li>
        <li><vc-icon name="hand-coins" [size]="15" />Transparent payouts for every farmer</li>
      </ul>
    </section>

    <section class="panel">
      <form class="box" (ngSubmit)="submit()">
        @switch (step()) {
          @case ('password') {
            <h2>Sign in</h2>
            <p class="muted">Use the account your programme administrator created for you.</p>
            @if (expired) { <vc-callout tone="warn" icon="clock">Your session ended. Please sign in again.</vc-callout> }
            <div class="field">
              <label for="email">Work email</label>
              <input id="email" class="input" name="email" type="email" autocomplete="username" [(ngModel)]="email" required autofocus />
            </div>
            <div class="field">
              <label for="pw">Password</label>
              <div class="pw">
                <input id="pw" class="input" name="password" [type]="show() ? 'text' : 'password'" autocomplete="current-password" [(ngModel)]="password" required />
                <button type="button" class="btn btn-ghost btn-sm" (click)="show.set(!show())">{{ show() ? 'Hide' : 'Show' }}</button>
              </div>
            </div>
          }
          @case ('setup') {
            <h2>Set up two-step verification</h2>
            <p class="muted">Your role needs a second factor. Add this key to Google Authenticator, Microsoft Authenticator or a similar app, then enter the 6-digit code.</p>
            <div class="secret"><code>{{ secret() }}</code></div>
            <div class="field"><label for="code">6-digit code</label>
              <input id="code" class="input code" name="code" inputmode="numeric" maxlength="6" [(ngModel)]="code" autofocus /></div>
          }
          @case ('mfa') {
            <h2>Enter your code</h2>
            <p class="muted">Open your authenticator app and enter the 6-digit code for Varsapradaya Carbon.</p>
            <div class="field"><label for="code2">6-digit code</label>
              <input id="code2" class="input code" name="code" inputmode="numeric" maxlength="6" [(ngModel)]="code" autofocus /></div>
          }
        }
        @if (error()) { <div class="err"><vc-icon name="alert" [size]="15" />{{ error() }}</div> }
        <button class="btn btn-primary btn-lg" type="submit" [disabled]="busy()">
          @if (busy()) { Signing in\u2026 } @else { {{ step() === 'password' ? 'Sign in' : 'Verify' }} <vc-icon name="arrow-right" [size]="16" /> }
        </button>
        <p class="legal">Protected workspace. Activity is recorded in the audit log.</p>
      </form>
    </section>
  `, styles: ["/* angular:styles/component:scss;625ed34051a80814;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\auth\\login.ts */\n:host {\n  display: grid;\n  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);\n  min-height: 100vh;\n  background: var(--surface);\n}\n.art {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  padding: 40px 48px;\n  color: #fff;\n  overflow: hidden;\n  background:\n    radial-gradient(\n      120% 90% at 0% 0%,\n      #275e3f 0%,\n      #10291c 55%,\n      #0b1f15 100%);\n}\n.pitch {\n  margin-top: auto;\n  max-width: 460px;\n  position: relative;\n  z-index: 2;\n}\n.pitch h1 {\n  color: #fff;\n  font-size: 38px;\n  line-height: 1.1;\n  letter-spacing: -0.02em;\n}\n.pitch p {\n  margin-top: 14px;\n  font-size: 16px;\n  color: rgba(255, 255, 255, 0.74);\n  line-height: 1.55;\n}\n.profile {\n  position: absolute;\n  right: 56px;\n  top: 13%;\n  width: 270px;\n  border-radius: 18px;\n  overflow: hidden;\n  transform: rotate(-4deg);\n  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);\n  opacity: 0.95;\n}\n.layer {\n  height: 84px;\n  display: flex;\n  align-items: flex-end;\n  justify-content: space-between;\n  padding: 10px 16px;\n  font: 500 12px var(--mono);\n}\n.layer span {\n  color: rgba(255, 255, 255, 0.75);\n}\n.layer em {\n  font-style: normal;\n  color: #fff;\n  background: rgba(0, 0, 0, 0.18);\n  padding: 3px 7px;\n  border-radius: 5px;\n}\n.l1 {\n  background:\n    linear-gradient(\n      180deg,\n      #5a3a22,\n      #6b4428);\n}\n.l2 {\n  background:\n    linear-gradient(\n      180deg,\n      #7b4f2c,\n      #8a5a33);\n}\n.l3 {\n  background:\n    linear-gradient(\n      180deg,\n      #9a6a3c,\n      #a9794a);\n}\n.sprout {\n  position: absolute;\n  top: -2px;\n  left: 40px;\n  width: 120px;\n  height: 10px;\n  background:\n    linear-gradient(\n      90deg,\n      #86b797,\n      #4f9168);\n  border-radius: 0 0 6px 6px;\n}\n.points {\n  list-style: none;\n  padding: 0;\n  margin: 28px 0 0;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  position: relative;\n  z-index: 2;\n}\n.points li {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  color: rgba(255, 255, 255, 0.82);\n  font-size: 14px;\n}\n.points vc-icon {\n  color: var(--forest-300);\n}\n.panel {\n  display: grid;\n  place-items: center;\n  padding: 40px 24px;\n  background: var(--sand-50);\n}\n.box {\n  width: 100%;\n  max-width: 380px;\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.box h2 {\n  font-size: 24px;\n}\n.pw {\n  display: flex;\n  gap: 6px;\n}\n.secret {\n  padding: 12px;\n  border-radius: 8px;\n  background: var(--sand-100);\n  border: 1px dashed var(--border-strong);\n  text-align: center;\n}\n.secret code {\n  font-size: 15px;\n  letter-spacing: 0.12em;\n  word-break: break-all;\n}\n.code {\n  font: 500 20px var(--mono);\n  letter-spacing: 0.4em;\n  text-align: center;\n  height: 48px;\n}\n.err {\n  display: flex;\n  gap: 8px;\n  align-items: center;\n  padding: 10px 12px;\n  border-radius: 8px;\n  background: var(--danger-soft);\n  color: var(--red-600);\n  font-size: 13px;\n}\n.legal {\n  font-size: 12px;\n  color: var(--text-3);\n  text-align: center;\n}\n@media (max-width: 880px) {\n  :host {\n    grid-template-columns: 1fr;\n  }\n  .art {\n    display: none;\n  }\n}\n/*# sourceMappingURL=login.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Login, { className: "Login", filePath: "src/app/features/auth/login.ts", lineNumber: 103 });
})();

// src/app/layout/nav.ts
var READ = "data.read";
var NAV = [
  {
    label: "",
    items: [{ label: "Overview", path: "/app/overview", icon: "dashboard", perms: [READ] }]
  },
  {
    label: "Programmes",
    items: [
      { label: "Programmes & projects", path: "/app/programmes", icon: "briefcase", perms: [READ] },
      { label: "Farmers", path: "/app/farmers", icon: "users", perms: [READ, "farmers.manage"] },
      { label: "Agreements & consent", path: "/app/agreements", icon: "handshake", perms: ["farmers.manage"] }
    ]
  },
  {
    label: "Land",
    items: [
      { label: "Fields & map", path: "/app/fields", icon: "map", perms: [READ, "land.manage"] },
      { label: "Practices", path: "/app/practices", icon: "sprout", perms: [READ, "practice.record"] },
      { label: "Crops & practices catalogue", path: "/app/catalogue", icon: "book", perms: [READ, "catalogue.manage"] }
    ]
  },
  {
    label: "Measurement",
    items: [
      { label: "Methodology rules", path: "/app/methodology", icon: "scale", perms: [READ, "rules.edit"] },
      { label: "Sampling", path: "/app/sampling", icon: "target", perms: [READ, "sampling.plan"] },
      { label: "Laboratory", path: "/app/lab", icon: "flask", perms: [READ, "lab.submit", "lab.review"] },
      { label: "Quality checks", path: "/app/quality", icon: "shield-check", perms: [READ, "qa.resolve"] }
    ]
  },
  {
    label: "Carbon",
    items: [
      { label: "Calculations", path: "/app/calculations", icon: "calculator", perms: [READ, "calc.run"] },
      { label: "Verification", path: "/app/verification", icon: "file-check", perms: [READ, "package.issue"] }
    ]
  },
  {
    label: "Intelligence",
    items: [
      { label: "Supporting data", path: "/app/supporting", icon: "rain", perms: [READ, "data.sync"] },
      { label: "Satellite & practices", path: "/app/satellite", icon: "satellite", perms: [READ] },
      { label: "Soil-carbon models", path: "/app/models", icon: "layers", perms: [READ, "models.manage"] }
    ]
  },
  {
    label: "Market",
    items: [
      { label: "Credits", path: "/app/credits", icon: "coins", perms: [READ, "credits.manage"] },
      { label: "Buyers & sales", path: "/app/sales", icon: "receipt", perms: [READ, "sales.manage"] },
      { label: "Farmer benefits", path: "/app/benefits", icon: "hand-coins", perms: [READ, "payout.prepare", "payout.approve"] }
    ]
  },
  {
    label: "Care",
    items: [
      { label: "Risk & permanence", path: "/app/risk", icon: "radar", perms: [READ, "risk.manage"] },
      { label: "Grievances", path: "/app/grievances", icon: "message", perms: [READ, "grievance.handle"] }
    ]
  },
  {
    label: "Administration",
    items: [
      { label: "Users & roles", path: "/app/users", icon: "user-plus", perms: ["users.manage"] },
      { label: "Partners & API", path: "/app/partners", icon: "webhook", perms: ["partners.manage"] },
      { label: "Audit log", path: "/app/audit", icon: "history", perms: [READ] }
    ]
  }
];

// src/app/layout/shell.ts
var _forTrack0 = ($index, $item) => $item.label;
var _forTrack1 = ($index, $item) => $item.path;
var _forTrack2 = ($index, $item) => $item.id;
function Shell_For_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const g_r1 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(g_r1.label);
  }
}
function Shell_For_5_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 23);
    \u0275\u0275listener("click", function Shell_For_5_For_2_Template_a_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.menuOpen.set(false));
    });
    \u0275\u0275element(1, "vc-icon", 24);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const i_r4 = ctx.$implicit;
    \u0275\u0275property("routerLink", i_r4.path);
    \u0275\u0275advance();
    \u0275\u0275property("name", i_r4.icon)("size", 17);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(i_r4.label);
  }
}
function Shell_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, Shell_For_5_Conditional_0_Template, 2, 1, "div", 21);
    \u0275\u0275repeaterCreate(1, Shell_For_5_For_2_Template, 4, 4, "a", 22, _forTrack1);
  }
  if (rf & 2) {
    const g_r1 = ctx.$implicit;
    \u0275\u0275conditional(g_r1.label ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(g_r1.items);
  }
}
function Shell_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275listener("click", function Shell_Conditional_11_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.menuOpen.set(false));
    });
    \u0275\u0275elementEnd();
  }
}
function Shell_Conditional_19_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r7 = ctx.$implicit;
    \u0275\u0275property("value", p_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", p_r7.code, " \xB7 ", p_r7.name);
  }
}
function Shell_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 14);
    \u0275\u0275element(1, "vc-icon", 26);
    \u0275\u0275elementStart(2, "select", 27);
    \u0275\u0275listener("change", function Shell_Conditional_19_Template_select_change_2_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.ctx.select($event.target.value));
    });
    \u0275\u0275repeaterCreate(3, Shell_Conditional_19_For_4_Template, 2, 3, "option", 28, _forTrack2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "vc-icon", 29);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r2.ctx.currentId() ?? "");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.ctx.projects());
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
  }
}
function Shell_Conditional_29_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 35);
    \u0275\u0275listener("click", function Shell_Conditional_29_Conditional_4_Template_a_click_0_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.userOpen.set(false));
    });
    \u0275\u0275element(1, "vc-icon", 36);
    \u0275\u0275text(2, "Open field app");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
  }
}
function Shell_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275listener("click", function Shell_Conditional_29_Template_div_click_0_listener($event) {
      return $event.stopPropagation();
    });
    \u0275\u0275elementStart(1, "div", 31)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(4, Shell_Conditional_29_Conditional_4_Template, 3, 1, "a", 32);
    \u0275\u0275elementStart(5, "button", 33);
    \u0275\u0275listener("click", function Shell_Conditional_29_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.auth.logout());
    });
    \u0275\u0275element(6, "vc-icon", 34);
    \u0275\u0275text(7, "Sign out");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r2.auth.profile()?.email);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.auth.can("sample.collect") ? 4 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 15);
  }
}
var Shell = class _Shell {
  auth = inject(AuthService);
  ctx = inject(ProjectContext);
  router = inject(Router);
  menuOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "menuOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  userOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "userOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  groups = computed(
    () => NAV.map((g) => __spreadProps(__spreadValues({}, g), { items: g.items.filter((i) => this.auth.can(...i.perms)) })).filter((g) => g.items.length),
    ...ngDevMode ? [{ debugName: "groups" }] : (
      /* istanbul ignore next */
      []
    )
  );
  url = toSignal(this.router.events.pipe(filter((e) => e instanceof NavigationEnd), map(() => this.router.url)), {
    initialValue: this.router.url
  });
  section = computed(
    () => {
      const u = this.url();
      for (const g of NAV)
        for (const i of g.items)
          if (u.startsWith(i.path))
            return i.label;
      return "";
    },
    ...ngDevMode ? [{ debugName: "section" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.ctx.load();
  }
  static \u0275fac = function Shell_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Shell)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Shell, selectors: [["vc-shell"]], decls: 32, vars: 14, consts: [[1, "side"], [1, "brand-row"], [3, "light"], [1, "side-foot"], [1, "org"], ["name", "building", 3, "size"], [1, "truncate"], [1, "scrim"], [1, "main"], [1, "top"], ["aria-label", "Menu", 1, "btn", "btn-ghost", "btn-icon", "burger", 3, "click"], ["name", "menu", 3, "size"], [1, "crumb"], [1, "spacer"], [1, "proj"], [1, "user", 3, "click"], [1, "avatar"], [1, "who"], ["name", "chevron-down", 3, "size"], [1, "menu"], [1, "content"], [1, "glabel"], ["routerLinkActive", "on", 3, "routerLink"], ["routerLinkActive", "on", 3, "click", "routerLink"], [3, "name", "size"], [1, "scrim", 3, "click"], ["name", "briefcase", 3, "size"], ["aria-label", "Current project", 3, "change", "value"], [3, "value"], ["name", "chevrons-up-down", 3, "size"], [1, "menu", 3, "click"], [1, "menu-h"], ["routerLink", "/field"], [3, "click"], ["name", "logout", 3, "size"], ["routerLink", "/field", 3, "click"], ["name", "tractor", 3, "size"]], template: function Shell_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "aside", 0)(1, "div", 1);
      \u0275\u0275element(2, "vc-brand", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "nav");
      \u0275\u0275repeaterCreate(4, Shell_For_5_Template, 3, 1, null, null, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "div", 3)(7, "div", 4);
      \u0275\u0275element(8, "vc-icon", 5);
      \u0275\u0275elementStart(9, "span", 6);
      \u0275\u0275text(10);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275conditionalCreate(11, Shell_Conditional_11_Template, 1, 0, "div", 7);
      \u0275\u0275elementStart(12, "div", 8)(13, "header", 9)(14, "button", 10);
      \u0275\u0275listener("click", function Shell_Template_button_click_14_listener() {
        return ctx.menuOpen.set(true);
      });
      \u0275\u0275element(15, "vc-icon", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "div", 12);
      \u0275\u0275text(17);
      \u0275\u0275elementEnd();
      \u0275\u0275element(18, "div", 13);
      \u0275\u0275conditionalCreate(19, Shell_Conditional_19_Template, 6, 3, "label", 14);
      \u0275\u0275elementStart(20, "div", 15);
      \u0275\u0275listener("click", function Shell_Template_div_click_20_listener() {
        return ctx.userOpen.set(!ctx.userOpen());
      });
      \u0275\u0275elementStart(21, "span", 16);
      \u0275\u0275text(22);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(23, "span", 17)(24, "strong");
      \u0275\u0275text(25);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "span");
      \u0275\u0275text(27);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(28, "vc-icon", 18);
      \u0275\u0275conditionalCreate(29, Shell_Conditional_29_Template, 8, 3, "div", 19);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(30, "main", 20);
      \u0275\u0275element(31, "router-outlet");
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("open", ctx.menuOpen());
      \u0275\u0275advance(2);
      \u0275\u0275property("light", true);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.groups());
      \u0275\u0275advance(4);
      \u0275\u0275property("size", 15);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.auth.profile()?.organization?.name);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.menuOpen() ? 11 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("size", 18);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.section());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.ctx.projects().length ? 19 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.auth.initials());
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.auth.profile()?.full_name);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.auth.profile()?.role_label);
      \u0275\u0275advance();
      \u0275\u0275property("size", 14);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.userOpen() ? 29 : -1);
    }
  }, dependencies: [RouterOutlet, RouterLink, RouterLinkActive, Icon, Brand], styles: ["\n[_nghost-%COMP%] {\n  display: flex;\n  min-height: 100vh;\n}\n.side[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0 auto 0 0;\n  width: var(--%NS%sidebar-w);\n  display: flex;\n  flex-direction: column;\n  background: var(--%NS%forest-900);\n  color: #dfe9e2;\n  z-index: 50;\n  border-right: 1px solid rgba(255, 255, 255, 0.04);\n}\n.brand-row[_ngcontent-%COMP%] {\n  height: var(--%NS%topbar-h);\n  display: flex;\n  align-items: center;\n  padding: 0 18px;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.06);\n}\nnav[_ngcontent-%COMP%] {\n  flex: 1;\n  overflow-y: auto;\n  padding: 10px 10px 16px;\n}\n.glabel[_ngcontent-%COMP%] {\n  margin: 16px 10px 6px;\n  font-size: 10.5px;\n  font-weight: 600;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  color: rgba(223, 233, 226, 0.45);\n}\nnav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  height: 34px;\n  padding: 0 10px;\n  border-radius: 7px;\n  color: rgba(231, 239, 233, 0.82);\n  font-size: 13.5px;\n  text-decoration: none !important;\n  transition: background 0.12s, color 0.12s;\n}\nnav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.06);\n  color: #fff;\n}\nnav[_ngcontent-%COMP%]   a.on[_ngcontent-%COMP%] {\n  background: rgba(134, 183, 151, 0.16);\n  color: #fff;\n}\nnav[_ngcontent-%COMP%]   a.on[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-300);\n}\n.side-foot[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  border-top: 1px solid rgba(255, 255, 255, 0.06);\n}\n.org[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 12.5px;\n  color: rgba(223, 233, 226, 0.7);\n}\n.main[_ngcontent-%COMP%] {\n  flex: 1;\n  margin-left: var(--%NS%sidebar-w);\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n}\n.top[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 40;\n  height: var(--%NS%topbar-h);\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 0 24px;\n  background: rgba(245, 243, 238, 0.86);\n  -webkit-backdrop-filter: saturate(1.4) blur(8px);\n  backdrop-filter: saturate(1.4) blur(8px);\n  border-bottom: 1px solid var(--%NS%border);\n}\n.burger[_ngcontent-%COMP%] {\n  display: none;\n}\n.crumb[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--%NS%stone-800);\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.proj[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  height: 36px;\n  padding: 0 10px;\n  border: 1px solid var(--%NS%border-strong);\n  border-radius: 8px;\n  background: var(--%NS%surface);\n  color: var(--%NS%stone-600);\n  cursor: pointer;\n  max-width: 340px;\n}\n.proj[_ngcontent-%COMP%]   select[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  font: 500 13px var(--%NS%font);\n  color: var(--%NS%stone-800);\n  outline: none;\n  appearance: none;\n  cursor: pointer;\n  min-width: 0;\n  max-width: 260px;\n  text-overflow: ellipsis;\n}\n.user[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 4px 8px 4px 4px;\n  border-radius: 10px;\n  cursor: pointer;\n}\n.user[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%sand-200);\n}\n.avatar[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: var(--%NS%forest-600);\n  color: #fff;\n  font-size: 12px;\n  font-weight: 600;\n}\n.who[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.2;\n}\n.who[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 600;\n}\n.who[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 11.5px;\n  color: var(--%NS%text-3);\n}\n.menu[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 0;\n  top: 46px;\n  min-width: 240px;\n  background: var(--%NS%surface);\n  border: 1px solid var(--%NS%border);\n  border-radius: 10px;\n  box-shadow: var(--%NS%shadow-lg);\n  padding: 6px;\n  z-index: 60;\n}\n.menu-h[_ngcontent-%COMP%] {\n  padding: 8px 10px 10px;\n  border-bottom: 1px solid var(--%NS%border);\n  margin-bottom: 4px;\n  font-size: 12.5px;\n  color: var(--%NS%text-2);\n}\n.menu[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], \n.menu[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  height: 34px;\n  padding: 0 10px;\n  border: 0;\n  border-radius: 6px;\n  background: none;\n  font: inherit;\n  color: var(--%NS%stone-800);\n  cursor: pointer;\n  text-decoration: none !important;\n}\n.menu[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, \n.menu[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%sand-100);\n}\n.content[_ngcontent-%COMP%] {\n  flex: 1;\n  padding: 28px 32px 48px;\n  max-width: 1440px;\n  width: 100%;\n}\n.scrim[_ngcontent-%COMP%] {\n  display: none;\n}\n@media (max-width: 960px) {\n  .side[_ngcontent-%COMP%] {\n    transform: translateX(-100%);\n    transition: transform 0.2s;\n  }\n  .side.open[_ngcontent-%COMP%] {\n    transform: none;\n    box-shadow: var(--%NS%shadow-lg);\n  }\n  .scrim[_ngcontent-%COMP%] {\n    display: block;\n    position: fixed;\n    inset: 0;\n    background: rgba(0, 0, 0, 0.3);\n    z-index: 45;\n  }\n  .main[_ngcontent-%COMP%] {\n    margin-left: 0;\n  }\n  .burger[_ngcontent-%COMP%] {\n    display: inline-flex;\n  }\n  .who[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .content[_ngcontent-%COMP%] {\n    padding: 20px 16px 40px;\n  }\n}\n/*# sourceMappingURL=shell.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Shell, [{
    type: Component,
    args: [{ selector: "vc-shell", imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon, Brand], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <aside class="side" [class.open]="menuOpen()">
      <div class="brand-row"><vc-brand [light]="true" /></div>
      <nav>
        @for (g of groups(); track g.label) {
          @if (g.label) { <div class="glabel">{{ g.label }}</div> }
          @for (i of g.items; track i.path) {
            <a [routerLink]="i.path" routerLinkActive="on" (click)="menuOpen.set(false)">
              <vc-icon [name]="i.icon" [size]="17" /><span>{{ i.label }}</span>
            </a>
          }
        }
      </nav>
      <div class="side-foot">
        <div class="org"><vc-icon name="building" [size]="15" /><span class="truncate">{{ auth.profile()?.organization?.name }}</span></div>
      </div>
    </aside>
    @if (menuOpen()) { <div class="scrim" (click)="menuOpen.set(false)"></div> }

    <div class="main">
      <header class="top">
        <button class="btn btn-ghost btn-icon burger" (click)="menuOpen.set(true)" aria-label="Menu"><vc-icon name="menu" [size]="18" /></button>
        <div class="crumb">{{ section() }}</div>
        <div class="spacer"></div>

        @if (ctx.projects().length) {
          <label class="proj">
            <vc-icon name="briefcase" [size]="15" />
            <select [value]="ctx.currentId() ?? ''" (change)="ctx.select($any($event.target).value)" aria-label="Current project">
              @for (p of ctx.projects(); track p.id) { <option [value]="p.id">{{ p.code }} \xB7 {{ p.name }}</option> }
            </select>
            <vc-icon name="chevrons-up-down" [size]="14" />
          </label>
        }

        <div class="user" (click)="userOpen.set(!userOpen())">
          <span class="avatar">{{ auth.initials() }}</span>
          <span class="who"><strong>{{ auth.profile()?.full_name }}</strong><span>{{ auth.profile()?.role_label }}</span></span>
          <vc-icon name="chevron-down" [size]="14" />
          @if (userOpen()) {
            <div class="menu" (click)="$event.stopPropagation()">
              <div class="menu-h"><strong>{{ auth.profile()?.email }}</strong></div>
              @if (auth.can('sample.collect')) { <a routerLink="/field" (click)="userOpen.set(false)"><vc-icon name="tractor" [size]="15" />Open field app</a> }
              <button (click)="auth.logout()"><vc-icon name="logout" [size]="15" />Sign out</button>
            </div>
          }
        </div>
      </header>
      <main class="content"><router-outlet /></main>
    </div>
  `, styles: ["/* angular:styles/component:scss;3881cff3509d42bc;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\layout\\shell.ts */\n:host {\n  display: flex;\n  min-height: 100vh;\n}\n.side {\n  position: fixed;\n  inset: 0 auto 0 0;\n  width: var(--sidebar-w);\n  display: flex;\n  flex-direction: column;\n  background: var(--forest-900);\n  color: #dfe9e2;\n  z-index: 50;\n  border-right: 1px solid rgba(255, 255, 255, 0.04);\n}\n.brand-row {\n  height: var(--topbar-h);\n  display: flex;\n  align-items: center;\n  padding: 0 18px;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.06);\n}\nnav {\n  flex: 1;\n  overflow-y: auto;\n  padding: 10px 10px 16px;\n}\n.glabel {\n  margin: 16px 10px 6px;\n  font-size: 10.5px;\n  font-weight: 600;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n  color: rgba(223, 233, 226, 0.45);\n}\nnav a {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  height: 34px;\n  padding: 0 10px;\n  border-radius: 7px;\n  color: rgba(231, 239, 233, 0.82);\n  font-size: 13.5px;\n  text-decoration: none !important;\n  transition: background 0.12s, color 0.12s;\n}\nnav a:hover {\n  background: rgba(255, 255, 255, 0.06);\n  color: #fff;\n}\nnav a.on {\n  background: rgba(134, 183, 151, 0.16);\n  color: #fff;\n}\nnav a.on vc-icon {\n  color: var(--forest-300);\n}\n.side-foot {\n  padding: 12px 16px;\n  border-top: 1px solid rgba(255, 255, 255, 0.06);\n}\n.org {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 12.5px;\n  color: rgba(223, 233, 226, 0.7);\n}\n.main {\n  flex: 1;\n  margin-left: var(--sidebar-w);\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n}\n.top {\n  position: sticky;\n  top: 0;\n  z-index: 40;\n  height: var(--topbar-h);\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 0 24px;\n  background: rgba(245, 243, 238, 0.86);\n  -webkit-backdrop-filter: saturate(1.4) blur(8px);\n  backdrop-filter: saturate(1.4) blur(8px);\n  border-bottom: 1px solid var(--border);\n}\n.burger {\n  display: none;\n}\n.crumb {\n  font-weight: 600;\n  color: var(--stone-800);\n}\n.spacer {\n  flex: 1;\n}\n.proj {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  height: 36px;\n  padding: 0 10px;\n  border: 1px solid var(--border-strong);\n  border-radius: 8px;\n  background: var(--surface);\n  color: var(--stone-600);\n  cursor: pointer;\n  max-width: 340px;\n}\n.proj select {\n  border: 0;\n  background: none;\n  font: 500 13px var(--font);\n  color: var(--stone-800);\n  outline: none;\n  appearance: none;\n  cursor: pointer;\n  min-width: 0;\n  max-width: 260px;\n  text-overflow: ellipsis;\n}\n.user {\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 4px 8px 4px 4px;\n  border-radius: 10px;\n  cursor: pointer;\n}\n.user:hover {\n  background: var(--sand-200);\n}\n.avatar {\n  display: grid;\n  place-items: center;\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: var(--forest-600);\n  color: #fff;\n  font-size: 12px;\n  font-weight: 600;\n}\n.who {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.2;\n}\n.who strong {\n  font-size: 13px;\n  font-weight: 600;\n}\n.who span {\n  font-size: 11.5px;\n  color: var(--text-3);\n}\n.menu {\n  position: absolute;\n  right: 0;\n  top: 46px;\n  min-width: 240px;\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 10px;\n  box-shadow: var(--shadow-lg);\n  padding: 6px;\n  z-index: 60;\n}\n.menu-h {\n  padding: 8px 10px 10px;\n  border-bottom: 1px solid var(--border);\n  margin-bottom: 4px;\n  font-size: 12.5px;\n  color: var(--text-2);\n}\n.menu a,\n.menu button {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n  height: 34px;\n  padding: 0 10px;\n  border: 0;\n  border-radius: 6px;\n  background: none;\n  font: inherit;\n  color: var(--stone-800);\n  cursor: pointer;\n  text-decoration: none !important;\n}\n.menu a:hover,\n.menu button:hover {\n  background: var(--sand-100);\n}\n.content {\n  flex: 1;\n  padding: 28px 32px 48px;\n  max-width: 1440px;\n  width: 100%;\n}\n.scrim {\n  display: none;\n}\n@media (max-width: 960px) {\n  .side {\n    transform: translateX(-100%);\n    transition: transform 0.2s;\n  }\n  .side.open {\n    transform: none;\n    box-shadow: var(--shadow-lg);\n  }\n  .scrim {\n    display: block;\n    position: fixed;\n    inset: 0;\n    background: rgba(0, 0, 0, 0.3);\n    z-index: 45;\n  }\n  .main {\n    margin-left: 0;\n  }\n  .burger {\n    display: inline-flex;\n  }\n  .who {\n    display: none;\n  }\n  .content {\n    padding: 20px 16px 40px;\n  }\n}\n/*# sourceMappingURL=shell.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Shell, { className: "Shell", filePath: "src/app/layout/shell.ts", lineNumber: 107 });
})();

// src/app/app.routes.ts
var routes = [
  { path: "login", component: Login, title: "Sign in \xB7 Varsapradaya Carbon" },
  { path: "dev-login", component: DevLogin },
  {
    path: "app",
    component: Shell,
    canActivate: [signedInGuard],
    children: [
      { path: "", pathMatch: "full", redirectTo: "overview" },
      { path: "overview", loadChildren: () => import("./chunk-6MVNIE5I.js") },
      { path: "programmes", loadChildren: () => import("./chunk-OXLJF7OL.js") },
      { path: "farmers", loadChildren: () => import("./chunk-YDGNAGDK.js") },
      { path: "agreements", loadChildren: () => import("./chunk-VCRFHF74.js") },
      { path: "fields", loadChildren: () => import("./chunk-K2C5IORU.js") },
      { path: "practices", loadChildren: () => import("./chunk-WUCIC23G.js") },
      { path: "catalogue", loadChildren: () => import("./chunk-QPN5UAOH.js") },
      { path: "methodology", loadChildren: () => import("./chunk-2QHQ7ABG.js") },
      { path: "sampling", loadChildren: () => import("./chunk-XKKQISDW.js") },
      { path: "lab", loadChildren: () => import("./chunk-2NFXQFHH.js") },
      { path: "quality", loadChildren: () => import("./chunk-3RK3FS5C.js") },
      { path: "calculations", loadChildren: () => import("./chunk-G6DE5POO.js") },
      { path: "verification", loadChildren: () => import("./chunk-W44VXKZL.js") },
      { path: "supporting", loadChildren: () => import("./chunk-5JRY7XZT.js") },
      { path: "satellite", loadChildren: () => import("./chunk-CTABYE2M.js") },
      { path: "models", loadChildren: () => import("./chunk-QM747MNL.js") },
      { path: "credits", loadChildren: () => import("./chunk-4TQJBLAV.js") },
      { path: "sales", loadChildren: () => import("./chunk-ZXEUIT3C.js") },
      { path: "benefits", loadChildren: () => import("./chunk-MVWCAR2V.js") },
      { path: "risk", loadChildren: () => import("./chunk-A5QI4UUN.js") },
      { path: "grievances", loadChildren: () => import("./chunk-L2VDPA3N.js") },
      { path: "users", loadChildren: () => import("./chunk-P3KR45CU.js") },
      { path: "partners", loadChildren: () => import("./chunk-53LY7AV2.js") },
      { path: "audit", loadChildren: () => import("./chunk-G43B7XYT.js") }
    ]
  },
  { path: "field", canActivate: [signedInGuard], loadChildren: () => import("./chunk-WAIVFTXW.js") },
  { path: "farmer", canActivate: [signedInGuard], loadChildren: () => import("./chunk-5PI7XIMG.js") },
  { path: "buyer", canActivate: [signedInGuard], loadChildren: () => import("./chunk-OWEKULVH.js") },
  { path: "verify", loadChildren: () => import("./chunk-25D3QIIA.js") },
  { path: "", pathMatch: "full", redirectTo: "app/overview" },
  { path: "**", redirectTo: "app/overview" }
];

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: "top" })),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(() => bootstrapSession(inject(AuthService))),
    provideServiceWorker("ngsw-worker.js", { enabled: !isDevMode(), registrationStrategy: "registerWhenStable:30000" })
  ]
};

// src/app/ui/toasts.ts
var _forTrack02 = ($index, $item) => $item.id;
function Toasts_For_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r2.body);
  }
}
function Toasts_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275element(1, "vc-icon", 2);
    \u0275\u0275elementStart(2, "div", 3)(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, Toasts_For_1_Conditional_5_Template, 2, 1, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 4);
    \u0275\u0275listener("click", function Toasts_For_1_Template_button_click_6_listener() {
      const t_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.toast.dismiss(t_r2.id));
    });
    \u0275\u0275element(7, "vc-icon", 5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const t_r2 = ctx.$implicit;
    \u0275\u0275classMap(t_r2.kind);
    \u0275\u0275advance();
    \u0275\u0275property("name", t_r2.kind === "success" ? "check-circle" : t_r2.kind === "error" ? "alert" : "info")("size", 18);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(t_r2.title);
    \u0275\u0275advance();
    \u0275\u0275conditional(t_r2.body ? 5 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 14);
  }
}
var Toasts = class _Toasts {
  toast = inject(ToastService);
  static \u0275fac = function Toasts_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Toasts)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Toasts, selectors: [["vc-toasts"]], decls: 2, vars: 0, consts: [["role", "status", 1, "t", 3, "class"], ["role", "status", 1, "t"], [3, "name", "size"], [1, "c"], ["aria-label", "Dismiss", 3, "click"], ["name", "x", 3, "size"]], template: function Toasts_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275repeaterCreate(0, Toasts_For_1_Template, 8, 7, "div", 0, _forTrack02);
    }
    if (rf & 2) {
      \u0275\u0275repeater(ctx.toast.toasts());
    }
  }, dependencies: [Icon], styles: ["\n[_nghost-%COMP%] {\n  position: fixed;\n  right: 20px;\n  bottom: 20px;\n  z-index: 200;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  width: min(380px, 100vw - 40px);\n}\n.t[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 12px 12px 12px 14px;\n  border-radius: 10px;\n  background: var(--%NS%stone-900);\n  color: #fff;\n  box-shadow: var(--%NS%shadow-lg);\n  animation: _ngcontent-%COMP%_in 0.2s ease-out;\n}\n.t.success[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%]:first-child {\n  color: var(--%NS%forest-300);\n}\n.t.error[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%]:first-child {\n  color: #f4a39c;\n}\n.t.info[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%]:first-child {\n  color: #9cc3ea;\n}\n.c[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  font-size: 13px;\n}\n.c[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.75);\n}\nbutton[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  color: rgba(255, 255, 255, 0.6);\n  cursor: pointer;\n  padding: 2px;\n}\n@keyframes _ngcontent-%COMP%_in {\n  from {\n    opacity: 0;\n    transform: translateY(8px);\n  }\n}\n/*# sourceMappingURL=toasts.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Toasts, [{
    type: Component,
    args: [{ selector: "vc-toasts", imports: [Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @for (t of toast.toasts(); track t.id) {
      <div class="t" [class]="t.kind" role="status">
        <vc-icon [name]="t.kind === 'success' ? 'check-circle' : t.kind === 'error' ? 'alert' : 'info'" [size]="18" />
        <div class="c"><strong>{{ t.title }}</strong>@if (t.body) { <span>{{ t.body }}</span> }</div>
        <button (click)="toast.dismiss(t.id)" aria-label="Dismiss"><vc-icon name="x" [size]="14" /></button>
      </div>
    }
  `, styles: ["/* angular:styles/component:scss;8945c2bcda425e08;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\ui\\toasts.ts */\n:host {\n  position: fixed;\n  right: 20px;\n  bottom: 20px;\n  z-index: 200;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  width: min(380px, 100vw - 40px);\n}\n.t {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 12px 12px 12px 14px;\n  border-radius: 10px;\n  background: var(--stone-900);\n  color: #fff;\n  box-shadow: var(--shadow-lg);\n  animation: in 0.2s ease-out;\n}\n.t.success vc-icon:first-child {\n  color: var(--forest-300);\n}\n.t.error vc-icon:first-child {\n  color: #f4a39c;\n}\n.t.info vc-icon:first-child {\n  color: #9cc3ea;\n}\n.c {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  font-size: 13px;\n}\n.c span {\n  color: rgba(255, 255, 255, 0.75);\n}\nbutton {\n  border: 0;\n  background: none;\n  color: rgba(255, 255, 255, 0.6);\n  cursor: pointer;\n  padding: 2px;\n}\n@keyframes in {\n  from {\n    opacity: 0;\n    transform: translateY(8px);\n  }\n}\n/*# sourceMappingURL=toasts.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Toasts, { className: "Toasts", filePath: "src/app/ui/toasts.ts", lineNumber: 28 });
})();

// src/app/app.ts
var App = class _App {
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _App, selectors: [["app-root"]], decls: 2, vars: 0, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275element(0, "router-outlet")(1, "vc-toasts");
    }
  }, dependencies: [RouterOutlet, Toasts], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(App, [{
    type: Component,
    args: [{
      selector: "app-root",
      imports: [RouterOutlet, Toasts],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<router-outlet /><vc-toasts />`
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 11 });
})();

// src/main.ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
//# debugId=ef586a1c-8203-5711-8c34-903d62329a49
//# sourceMappingURL=main.js.map
