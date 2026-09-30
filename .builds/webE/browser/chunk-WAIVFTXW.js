import {
  Brand
} from "./chunk-PLD4FPAY.js";
import {
  MapView
} from "./chunk-M3VDEKV5.js";
import {
  ToastService
} from "./chunk-KR7EHQN4.js";
import {
  DefaultValueAccessor,
  FormsModule,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgModel,
  NgSelectOption,
  NumberValueAccessor,
  SelectControlValueAccessor,
  ɵNgSelectMultipleOption
} from "./chunk-WOW2CD4M.js";
import {
  AgoPipe,
  DayPipe,
  HumanPipe
} from "./chunk-E5UDMWWN.js";
import {
  AuthService,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from "./chunk-PNIM44LI.js";
import {
  ApiService,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Icon,
  Injectable,
  Input,
  NgZone,
  __commonJS,
  __spreadProps,
  __spreadValues,
  __toESM,
  computed,
  effect,
  firstValueFrom,
  inject,
  input,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontrol,
  ɵɵcontrolCreate,
  ɵɵdeclareLet,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵreadContextLet,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵresolveWindow,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstoreLet,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtextInterpolate4,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-O2E4BMDK.js";

// node_modules/dexie/dist/dexie.js
var require_dexie = __commonJS({
  "node_modules/dexie/dist/dexie.js"(exports, module) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, global2.Dexie = factory());
    })(exports, (function() {
      "use strict";
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      }
      var __assign = function() {
        __assign = Object.assign || function __assign2(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
        };
        return __assign.apply(this, arguments);
      };
      function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
      }
      typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
      };
      var _global = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
      var keys = Object.keys;
      var isArray = Array.isArray;
      if (typeof Promise !== "undefined" && !_global.Promise) {
        _global.Promise = Promise;
      }
      function extend(obj, extension) {
        if (typeof extension !== "object")
          return obj;
        keys(extension).forEach(function(key) {
          obj[key] = extension[key];
        });
        return obj;
      }
      var getProto = Object.getPrototypeOf;
      var _hasOwn = {}.hasOwnProperty;
      function hasOwn(obj, prop) {
        return _hasOwn.call(obj, prop);
      }
      function props(proto, extension) {
        if (typeof extension === "function")
          extension = extension(getProto(proto));
        (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach(function(key) {
          setProp(proto, key, extension[key]);
        });
      }
      var defineProperty = Object.defineProperty;
      function setProp(obj, prop, functionOrGetSet, options) {
        defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === "function" ? {
          get: functionOrGetSet.get,
          set: functionOrGetSet.set,
          configurable: true
        } : { value: functionOrGetSet, configurable: true, writable: true }, options));
      }
      function derive(Child) {
        return {
          from: function(Parent) {
            Child.prototype = Object.create(Parent.prototype);
            setProp(Child.prototype, "constructor", Child);
            return {
              extend: props.bind(null, Child.prototype)
            };
          }
        };
      }
      var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      function getPropertyDescriptor(obj, prop) {
        var pd = getOwnPropertyDescriptor(obj, prop);
        var proto;
        return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
      }
      var _slice = [].slice;
      function slice(args, start, end) {
        return _slice.call(args, start, end);
      }
      function override(origFunc, overridedFactory) {
        return overridedFactory(origFunc);
      }
      function assert(b) {
        if (!b)
          throw new Error("Assertion Failed");
      }
      function asap$1(fn) {
        if (_global.setImmediate)
          setImmediate(fn);
        else
          setTimeout(fn, 0);
      }
      function arrayToObject(array, extractor) {
        return array.reduce(function(result, item, i) {
          var nameAndValue = extractor(item, i);
          if (nameAndValue)
            result[nameAndValue[0]] = nameAndValue[1];
          return result;
        }, {});
      }
      function getByKeyPath(obj, keyPath) {
        if (typeof keyPath === "string" && hasOwn(obj, keyPath))
          return obj[keyPath];
        if (!keyPath)
          return obj;
        if (typeof keyPath !== "string") {
          var rv = [];
          for (var i = 0, l = keyPath.length; i < l; ++i) {
            var val = getByKeyPath(obj, keyPath[i]);
            rv.push(val);
          }
          return rv;
        }
        var period = keyPath.indexOf(".");
        if (period !== -1) {
          var innerObj = obj[keyPath.substr(0, period)];
          return innerObj == null ? void 0 : getByKeyPath(innerObj, keyPath.substr(period + 1));
        }
        return void 0;
      }
      function setByKeyPath(obj, keyPath, value) {
        if (!obj || keyPath === void 0)
          return;
        if ("isFrozen" in Object && Object.isFrozen(obj))
          return;
        if (typeof keyPath !== "string" && "length" in keyPath) {
          assert(typeof value !== "string" && "length" in value);
          for (var i = 0, l = keyPath.length; i < l; ++i) {
            setByKeyPath(obj, keyPath[i], value[i]);
          }
        } else {
          var period = keyPath.indexOf(".");
          if (period !== -1) {
            var currentKeyPath = keyPath.substr(0, period);
            var remainingKeyPath = keyPath.substr(period + 1);
            if (remainingKeyPath === "")
              if (value === void 0) {
                if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
                  obj.splice(currentKeyPath, 1);
                else
                  delete obj[currentKeyPath];
              } else
                obj[currentKeyPath] = value;
            else {
              var innerObj = obj[currentKeyPath];
              if (!innerObj || !hasOwn(obj, currentKeyPath)) {
                if (value === void 0)
                  return;
                innerObj = obj[currentKeyPath] = {};
              }
              setByKeyPath(innerObj, remainingKeyPath, value);
            }
          } else {
            if (value === void 0) {
              if (isArray(obj) && !isNaN(parseInt(keyPath)))
                obj.splice(keyPath, 1);
              else
                delete obj[keyPath];
            } else
              obj[keyPath] = value;
          }
        }
      }
      function delByKeyPath(obj, keyPath) {
        if (typeof keyPath === "string")
          setByKeyPath(obj, keyPath, void 0);
        else if ("length" in keyPath)
          [].map.call(keyPath, function(kp) {
            setByKeyPath(obj, kp, void 0);
          });
      }
      function shallowClone(obj) {
        var rv = {};
        for (var m in obj) {
          if (hasOwn(obj, m))
            rv[m] = obj[m];
        }
        return rv;
      }
      var concat = [].concat;
      function flatten(a) {
        return concat.apply([], a);
      }
      var intrinsicTypeNames = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(flatten([8, 16, 32, 64].map(function(num) {
        return ["Int", "Uint", "Float"].map(function(t) {
          return t + num + "Array";
        });
      }))).filter(function(t) {
        return _global[t];
      });
      var intrinsicTypes = new Set(intrinsicTypeNames.map(function(t) {
        return _global[t];
      }));
      function cloneSimpleObjectTree(o) {
        var rv = {};
        for (var k in o)
          if (hasOwn(o, k)) {
            var v = o[k];
            rv[k] = !v || typeof v !== "object" || intrinsicTypes.has(v.constructor) ? v : cloneSimpleObjectTree(v);
          }
        return rv;
      }
      var circularRefs = null;
      function deepClone(any) {
        circularRefs = /* @__PURE__ */ new WeakMap();
        var rv = innerDeepClone(any);
        circularRefs = null;
        return rv;
      }
      function innerDeepClone(x) {
        if (!x || typeof x !== "object")
          return x;
        var rv = circularRefs.get(x);
        if (rv)
          return rv;
        if (isArray(x)) {
          rv = [];
          circularRefs.set(x, rv);
          for (var i = 0, l = x.length; i < l; ++i) {
            rv.push(innerDeepClone(x[i]));
          }
        } else if (intrinsicTypes.has(x.constructor)) {
          rv = x;
        } else {
          var proto = getProto(x);
          rv = proto === Object.prototype ? {} : Object.create(proto);
          circularRefs.set(x, rv);
          for (var prop in x) {
            if (hasOwn(x, prop)) {
              rv[prop] = innerDeepClone(x[prop]);
            }
          }
        }
        return rv;
      }
      var toString = {}.toString;
      function toStringTag(o) {
        return toString.call(o).slice(8, -1);
      }
      var iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
      var getIteratorOf = typeof iteratorSymbol === "symbol" ? function(x) {
        var i;
        return x != null && (i = x[iteratorSymbol]) && i.apply(x);
      } : function() {
        return null;
      };
      function delArrayItem(a, x) {
        var i = a.indexOf(x);
        if (i >= 0)
          a.splice(i, 1);
        return i >= 0;
      }
      var NO_CHAR_ARRAY = {};
      function getArrayOf(arrayLike) {
        var i, a, x, it;
        if (arguments.length === 1) {
          if (isArray(arrayLike))
            return arrayLike.slice();
          if (this === NO_CHAR_ARRAY && typeof arrayLike === "string")
            return [arrayLike];
          if (it = getIteratorOf(arrayLike)) {
            a = [];
            while (x = it.next(), !x.done)
              a.push(x.value);
            return a;
          }
          if (arrayLike == null)
            return [arrayLike];
          i = arrayLike.length;
          if (typeof i === "number") {
            a = new Array(i);
            while (i--)
              a[i] = arrayLike[i];
            return a;
          }
          return [arrayLike];
        }
        i = arguments.length;
        a = new Array(i);
        while (i--)
          a[i] = arguments[i];
        return a;
      }
      var isAsyncFunction = typeof Symbol !== "undefined" ? function(fn) {
        return fn[Symbol.toStringTag] === "AsyncFunction";
      } : function() {
        return false;
      };
      var dexieErrorNames = [
        "Modify",
        "Bulk",
        "OpenFailed",
        "VersionChange",
        "Schema",
        "Upgrade",
        "InvalidTable",
        "MissingAPI",
        "NoSuchDatabase",
        "InvalidArgument",
        "SubTransaction",
        "Unsupported",
        "Internal",
        "DatabaseClosed",
        "PrematureCommit",
        "ForeignAwait"
      ];
      var idbDomErrorNames = [
        "Unknown",
        "Constraint",
        "Data",
        "TransactionInactive",
        "ReadOnly",
        "Version",
        "NotFound",
        "InvalidState",
        "InvalidAccess",
        "Abort",
        "Timeout",
        "QuotaExceeded",
        "Syntax",
        "DataClone"
      ];
      var errorList = dexieErrorNames.concat(idbDomErrorNames);
      var defaultTexts = {
        VersionChanged: "Database version changed by other database connection",
        DatabaseClosed: "Database has been closed",
        Abort: "Transaction aborted",
        TransactionInactive: "Transaction has already completed or failed",
        MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
      };
      function DexieError(name, msg) {
        this.name = name;
        this.message = msg;
      }
      derive(DexieError).from(Error).extend({
        toString: function() {
          return this.name + ": " + this.message;
        }
      });
      function getMultiErrorMessage(msg, failures) {
        return msg + ". Errors: " + Object.keys(failures).map(function(key) {
          return failures[key].toString();
        }).filter(function(v, i, s) {
          return s.indexOf(v) === i;
        }).join("\n");
      }
      function ModifyError(msg, failures, successCount, failedKeys) {
        this.failures = failures;
        this.failedKeys = failedKeys;
        this.successCount = successCount;
        this.message = getMultiErrorMessage(msg, failures);
      }
      derive(ModifyError).from(DexieError);
      function BulkError(msg, failures) {
        this.name = "BulkError";
        this.failures = Object.keys(failures).map(function(pos) {
          return failures[pos];
        });
        this.failuresByPos = failures;
        this.message = getMultiErrorMessage(msg, this.failures);
      }
      derive(BulkError).from(DexieError);
      var errnames = errorList.reduce(function(obj, name) {
        return obj[name] = name + "Error", obj;
      }, {});
      var BaseException = DexieError;
      var exceptions = errorList.reduce(function(obj, name) {
        var fullName = name + "Error";
        function DexieError2(msgOrInner, inner) {
          this.name = fullName;
          if (!msgOrInner) {
            this.message = defaultTexts[name] || fullName;
            this.inner = null;
          } else if (typeof msgOrInner === "string") {
            this.message = "".concat(msgOrInner).concat(!inner ? "" : "\n " + inner);
            this.inner = inner || null;
          } else if (typeof msgOrInner === "object") {
            this.message = "".concat(msgOrInner.name, " ").concat(msgOrInner.message);
            this.inner = msgOrInner;
          }
        }
        derive(DexieError2).from(BaseException);
        obj[name] = DexieError2;
        return obj;
      }, {});
      exceptions.Syntax = SyntaxError;
      exceptions.Type = TypeError;
      exceptions.Range = RangeError;
      var exceptionMap = idbDomErrorNames.reduce(function(obj, name) {
        obj[name + "Error"] = exceptions[name];
        return obj;
      }, {});
      function mapError(domError, message) {
        if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
          return domError;
        var rv = new exceptionMap[domError.name](message || domError.message, domError);
        if ("stack" in domError) {
          setProp(rv, "stack", {
            get: function() {
              return this.inner.stack;
            }
          });
        }
        return rv;
      }
      var fullNameExceptions = errorList.reduce(function(obj, name) {
        if (["Syntax", "Type", "Range"].indexOf(name) === -1)
          obj[name + "Error"] = exceptions[name];
        return obj;
      }, {});
      fullNameExceptions.ModifyError = ModifyError;
      fullNameExceptions.DexieError = DexieError;
      fullNameExceptions.BulkError = BulkError;
      function nop() {
      }
      function mirror(val) {
        return val;
      }
      function pureFunctionChain(f1, f2) {
        if (f1 == null || f1 === mirror)
          return f2;
        return function(val) {
          return f2(f1(val));
        };
      }
      function callBoth(on1, on2) {
        return function() {
          on1.apply(this, arguments);
          on2.apply(this, arguments);
        };
      }
      function hookCreatingChain(f1, f2) {
        if (f1 === nop)
          return f2;
        return function() {
          var res = f1.apply(this, arguments);
          if (res !== void 0)
            arguments[0] = res;
          var onsuccess = this.onsuccess, onerror = this.onerror;
          this.onsuccess = null;
          this.onerror = null;
          var res2 = f2.apply(this, arguments);
          if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
          if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
          return res2 !== void 0 ? res2 : res;
        };
      }
      function hookDeletingChain(f1, f2) {
        if (f1 === nop)
          return f2;
        return function() {
          f1.apply(this, arguments);
          var onsuccess = this.onsuccess, onerror = this.onerror;
          this.onsuccess = this.onerror = null;
          f2.apply(this, arguments);
          if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
          if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        };
      }
      function hookUpdatingChain(f1, f2) {
        if (f1 === nop)
          return f2;
        return function() {
          var res = f1.apply(this, arguments);
          var modifications = arguments[0];
          extend(modifications, res);
          var onsuccess = this.onsuccess, onerror = this.onerror;
          this.onsuccess = null;
          this.onerror = null;
          var res2 = f2.apply(this, arguments);
          if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
          if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
          return res === void 0 ? res2 === void 0 ? void 0 : res2 : extend(res, res2);
        };
      }
      function reverseStoppableEventChain(f1, f2) {
        if (f1 === nop)
          return f2;
        return function() {
          if (f2.apply(this, arguments) === false)
            return false;
          return f1.apply(this, arguments);
        };
      }
      function promisableChain(f1, f2) {
        if (f1 === nop)
          return f2;
        return function() {
          var res = f1.apply(this, arguments);
          if (res && typeof res.then === "function") {
            var thiz = this, i = arguments.length, args = new Array(i);
            while (i--)
              args[i] = arguments[i];
            return res.then(function() {
              return f2.apply(thiz, args);
            });
          }
          return f2.apply(this, arguments);
        };
      }
      var debug = typeof location !== "undefined" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
      function setDebug(value, filter) {
        debug = value;
      }
      var INTERNAL = {};
      var ZONE_ECHO_LIMIT = 100, _a$1 = typeof Promise === "undefined" ? [] : (function() {
        var globalP = Promise.resolve();
        if (typeof crypto === "undefined" || !crypto.subtle)
          return [globalP, getProto(globalP), globalP];
        var nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
        return [nativeP, getProto(nativeP), globalP];
      })(), resolvedNativePromise = _a$1[0], nativePromiseProto = _a$1[1], resolvedGlobalPromise = _a$1[2], nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
      var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
      var patchGlobalPromise = !!resolvedGlobalPromise;
      function schedulePhysicalTick() {
        queueMicrotask(physicalTick);
      }
      var asap = function(callback, args) {
        microtickQueue.push([callback, args]);
        if (needsNewPhysicalTick) {
          schedulePhysicalTick();
          needsNewPhysicalTick = false;
        }
      };
      var isOutsideMicroTick = true, needsNewPhysicalTick = true, unhandledErrors = [], rejectingErrors = [], rejectionMapper = mirror;
      var globalPSD = {
        id: "global",
        global: true,
        ref: 0,
        unhandleds: [],
        onunhandled: nop,
        pgp: false,
        env: {},
        finalize: nop
      };
      var PSD = globalPSD;
      var microtickQueue = [];
      var numScheduledCalls = 0;
      var tickFinalizers = [];
      function DexiePromise(fn) {
        if (typeof this !== "object")
          throw new TypeError("Promises must be constructed via new");
        this._listeners = [];
        this._lib = false;
        var psd = this._PSD = PSD;
        if (typeof fn !== "function") {
          if (fn !== INTERNAL)
            throw new TypeError("Not a function");
          this._state = arguments[1];
          this._value = arguments[2];
          if (this._state === false)
            handleRejection(this, this._value);
          return;
        }
        this._state = null;
        this._value = null;
        ++psd.ref;
        executePromiseTask(this, fn);
      }
      var thenProp = {
        get: function() {
          var psd = PSD, microTaskId = totalEchoes;
          function then(onFulfilled, onRejected) {
            var _this = this;
            var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
            var cleanup = possibleAwait && !decrementExpectedAwaits();
            var rv = new DexiePromise(function(resolve, reject) {
              propagateToListener(_this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve, reject, psd));
            });
            if (this._consoleTask)
              rv._consoleTask = this._consoleTask;
            return rv;
          }
          then.prototype = INTERNAL;
          return then;
        },
        set: function(value) {
          setProp(this, "then", value && value.prototype === INTERNAL ? thenProp : {
            get: function() {
              return value;
            },
            set: thenProp.set
          });
        }
      };
      props(DexiePromise.prototype, {
        then: thenProp,
        _then: function(onFulfilled, onRejected) {
          propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
        },
        catch: function(onRejected) {
          if (arguments.length === 1)
            return this.then(null, onRejected);
          var type2 = arguments[0], handler = arguments[1];
          return typeof type2 === "function" ? this.then(null, function(err) {
            return err instanceof type2 ? handler(err) : PromiseReject(err);
          }) : this.then(null, function(err) {
            return err && err.name === type2 ? handler(err) : PromiseReject(err);
          });
        },
        finally: function(onFinally) {
          return this.then(function(value) {
            return DexiePromise.resolve(onFinally()).then(function() {
              return value;
            });
          }, function(err) {
            return DexiePromise.resolve(onFinally()).then(function() {
              return PromiseReject(err);
            });
          });
        },
        timeout: function(ms, msg) {
          var _this = this;
          return ms < Infinity ? new DexiePromise(function(resolve, reject) {
            var handle = setTimeout(function() {
              return reject(new exceptions.Timeout(msg));
            }, ms);
            _this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
          }) : this;
        }
      });
      if (typeof Symbol !== "undefined" && Symbol.toStringTag)
        setProp(DexiePromise.prototype, Symbol.toStringTag, "Dexie.Promise");
      globalPSD.env = snapShot();
      function Listener(onFulfilled, onRejected, resolve, reject, zone) {
        this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
        this.onRejected = typeof onRejected === "function" ? onRejected : null;
        this.resolve = resolve;
        this.reject = reject;
        this.psd = zone;
      }
      props(DexiePromise, {
        all: function() {
          var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
          return new DexiePromise(function(resolve, reject) {
            if (values.length === 0)
              resolve([]);
            var remaining = values.length;
            values.forEach(function(a, i) {
              return DexiePromise.resolve(a).then(function(x) {
                values[i] = x;
                if (!--remaining)
                  resolve(values);
              }, reject);
            });
          });
        },
        resolve: function(value) {
          if (value instanceof DexiePromise)
            return value;
          if (value && typeof value.then === "function")
            return new DexiePromise(function(resolve, reject) {
              value.then(resolve, reject);
            });
          var rv = new DexiePromise(INTERNAL, true, value);
          return rv;
        },
        reject: PromiseReject,
        race: function() {
          var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
          return new DexiePromise(function(resolve, reject) {
            values.map(function(value) {
              return DexiePromise.resolve(value).then(resolve, reject);
            });
          });
        },
        PSD: {
          get: function() {
            return PSD;
          },
          set: function(value) {
            return PSD = value;
          }
        },
        totalEchoes: { get: function() {
          return totalEchoes;
        } },
        newPSD: newScope,
        usePSD,
        scheduler: {
          get: function() {
            return asap;
          },
          set: function(value) {
            asap = value;
          }
        },
        rejectionMapper: {
          get: function() {
            return rejectionMapper;
          },
          set: function(value) {
            rejectionMapper = value;
          }
        },
        follow: function(fn, zoneProps) {
          return new DexiePromise(function(resolve, reject) {
            return newScope(function(resolve2, reject2) {
              var psd = PSD;
              psd.unhandleds = [];
              psd.onunhandled = reject2;
              psd.finalize = callBoth(function() {
                var _this = this;
                run_at_end_of_this_or_next_physical_tick(function() {
                  _this.unhandleds.length === 0 ? resolve2() : reject2(_this.unhandleds[0]);
                });
              }, psd.finalize);
              fn();
            }, zoneProps, resolve, reject);
          });
        }
      });
      if (NativePromise) {
        if (NativePromise.allSettled)
          setProp(DexiePromise, "allSettled", function() {
            var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function(resolve) {
              if (possiblePromises.length === 0)
                resolve([]);
              var remaining = possiblePromises.length;
              var results = new Array(remaining);
              possiblePromises.forEach(function(p, i) {
                return DexiePromise.resolve(p).then(function(value) {
                  return results[i] = { status: "fulfilled", value };
                }, function(reason) {
                  return results[i] = { status: "rejected", reason };
                }).then(function() {
                  return --remaining || resolve(results);
                });
              });
            });
          });
        if (NativePromise.any && typeof AggregateError !== "undefined")
          setProp(DexiePromise, "any", function() {
            var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function(resolve, reject) {
              if (possiblePromises.length === 0)
                reject(new AggregateError([]));
              var remaining = possiblePromises.length;
              var failures = new Array(remaining);
              possiblePromises.forEach(function(p, i) {
                return DexiePromise.resolve(p).then(function(value) {
                  return resolve(value);
                }, function(failure) {
                  failures[i] = failure;
                  if (!--remaining)
                    reject(new AggregateError(failures));
                });
              });
            });
          });
        if (NativePromise.withResolvers)
          DexiePromise.withResolvers = NativePromise.withResolvers;
      }
      function executePromiseTask(promise, fn) {
        try {
          fn(function(value) {
            if (promise._state !== null)
              return;
            if (value === promise)
              throw new TypeError("A promise cannot be resolved with itself.");
            var shouldExecuteTick = promise._lib && beginMicroTickScope();
            if (value && typeof value.then === "function") {
              executePromiseTask(promise, function(resolve, reject) {
                value instanceof DexiePromise ? value._then(resolve, reject) : value.then(resolve, reject);
              });
            } else {
              promise._state = true;
              promise._value = value;
              propagateAllListeners(promise);
            }
            if (shouldExecuteTick)
              endMicroTickScope();
          }, handleRejection.bind(null, promise));
        } catch (ex) {
          handleRejection(promise, ex);
        }
      }
      function handleRejection(promise, reason) {
        rejectingErrors.push(reason);
        if (promise._state !== null)
          return;
        var shouldExecuteTick = promise._lib && beginMicroTickScope();
        reason = rejectionMapper(reason);
        promise._state = false;
        promise._value = reason;
        addPossiblyUnhandledError(promise);
        propagateAllListeners(promise);
        if (shouldExecuteTick)
          endMicroTickScope();
      }
      function propagateAllListeners(promise) {
        var listeners = promise._listeners;
        promise._listeners = [];
        for (var i = 0, len = listeners.length; i < len; ++i) {
          propagateToListener(promise, listeners[i]);
        }
        var psd = promise._PSD;
        --psd.ref || psd.finalize();
        if (numScheduledCalls === 0) {
          ++numScheduledCalls;
          asap(function() {
            if (--numScheduledCalls === 0)
              finalizePhysicalTick();
          }, []);
        }
      }
      function propagateToListener(promise, listener) {
        if (promise._state === null) {
          promise._listeners.push(listener);
          return;
        }
        var cb = promise._state ? listener.onFulfilled : listener.onRejected;
        if (cb === null) {
          return (promise._state ? listener.resolve : listener.reject)(promise._value);
        }
        ++listener.psd.ref;
        ++numScheduledCalls;
        asap(callListener, [cb, promise, listener]);
      }
      function callListener(cb, promise, listener) {
        try {
          var ret, value = promise._value;
          if (!promise._state && rejectingErrors.length)
            rejectingErrors = [];
          ret = debug && promise._consoleTask ? promise._consoleTask.run(function() {
            return cb(value);
          }) : cb(value);
          if (!promise._state && rejectingErrors.indexOf(value) === -1) {
            markErrorAsHandled(promise);
          }
          listener.resolve(ret);
        } catch (e) {
          listener.reject(e);
        } finally {
          if (--numScheduledCalls === 0)
            finalizePhysicalTick();
          --listener.psd.ref || listener.psd.finalize();
        }
      }
      function physicalTick() {
        usePSD(globalPSD, function() {
          beginMicroTickScope() && endMicroTickScope();
        });
      }
      function beginMicroTickScope() {
        var wasRootExec = isOutsideMicroTick;
        isOutsideMicroTick = false;
        needsNewPhysicalTick = false;
        return wasRootExec;
      }
      function endMicroTickScope() {
        var callbacks, i, l;
        do {
          while (microtickQueue.length > 0) {
            callbacks = microtickQueue;
            microtickQueue = [];
            l = callbacks.length;
            for (i = 0; i < l; ++i) {
              var item = callbacks[i];
              item[0].apply(null, item[1]);
            }
          }
        } while (microtickQueue.length > 0);
        isOutsideMicroTick = true;
        needsNewPhysicalTick = true;
      }
      function finalizePhysicalTick() {
        var unhandledErrs = unhandledErrors;
        unhandledErrors = [];
        unhandledErrs.forEach(function(p) {
          p._PSD.onunhandled.call(null, p._value, p);
        });
        var finalizers = tickFinalizers.slice(0);
        var i = finalizers.length;
        while (i)
          finalizers[--i]();
      }
      function run_at_end_of_this_or_next_physical_tick(fn) {
        function finalizer() {
          fn();
          tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
        }
        tickFinalizers.push(finalizer);
        ++numScheduledCalls;
        asap(function() {
          if (--numScheduledCalls === 0)
            finalizePhysicalTick();
        }, []);
      }
      function addPossiblyUnhandledError(promise) {
        if (!unhandledErrors.some(function(p) {
          return p._value === promise._value;
        }))
          unhandledErrors.push(promise);
      }
      function markErrorAsHandled(promise) {
        var i = unhandledErrors.length;
        while (i)
          if (unhandledErrors[--i]._value === promise._value) {
            unhandledErrors.splice(i, 1);
            return;
          }
      }
      function PromiseReject(reason) {
        return new DexiePromise(INTERNAL, false, reason);
      }
      function wrap(fn, errorCatcher) {
        var psd = PSD;
        return function() {
          var wasRootExec = beginMicroTickScope(), outerScope = PSD;
          try {
            switchToZone(psd, true);
            return fn.apply(this, arguments);
          } catch (e) {
            errorCatcher && errorCatcher(e);
          } finally {
            switchToZone(outerScope, false);
            if (wasRootExec)
              endMicroTickScope();
          }
        };
      }
      var task = { awaits: 0, echoes: 0, id: 0 };
      var taskCounter = 0;
      var zoneStack = [];
      var zoneEchoes = 0;
      var totalEchoes = 0;
      var zone_id_counter = 0;
      function newScope(fn, props2, a1, a2) {
        var parent = PSD, psd = Object.create(parent);
        psd.parent = parent;
        psd.ref = 0;
        psd.global = false;
        psd.id = ++zone_id_counter;
        globalPSD.env;
        psd.env = patchGlobalPromise ? {
          Promise: DexiePromise,
          PromiseProp: {
            value: DexiePromise,
            configurable: true,
            writable: true
          },
          all: DexiePromise.all,
          race: DexiePromise.race,
          allSettled: DexiePromise.allSettled,
          any: DexiePromise.any,
          resolve: DexiePromise.resolve,
          reject: DexiePromise.reject
        } : {};
        if (props2)
          extend(psd, props2);
        ++parent.ref;
        psd.finalize = function() {
          --this.parent.ref || this.parent.finalize();
        };
        var rv = usePSD(psd, fn, a1, a2);
        if (psd.ref === 0)
          psd.finalize();
        return rv;
      }
      function incrementExpectedAwaits() {
        if (!task.id)
          task.id = ++taskCounter;
        ++task.awaits;
        task.echoes += ZONE_ECHO_LIMIT;
        return task.id;
      }
      function decrementExpectedAwaits() {
        if (!task.awaits)
          return false;
        if (--task.awaits === 0)
          task.id = 0;
        task.echoes = task.awaits * ZONE_ECHO_LIMIT;
        return true;
      }
      if (("" + nativePromiseThen).indexOf("[native code]") === -1) {
        incrementExpectedAwaits = decrementExpectedAwaits = nop;
      }
      function onPossibleParallellAsync(possiblePromise) {
        if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
          incrementExpectedAwaits();
          return possiblePromise.then(function(x) {
            decrementExpectedAwaits();
            return x;
          }, function(e) {
            decrementExpectedAwaits();
            return rejection(e);
          });
        }
        return possiblePromise;
      }
      function zoneEnterEcho(targetZone) {
        ++totalEchoes;
        if (!task.echoes || --task.echoes === 0) {
          task.echoes = task.awaits = task.id = 0;
        }
        zoneStack.push(PSD);
        switchToZone(targetZone, true);
      }
      function zoneLeaveEcho() {
        var zone = zoneStack[zoneStack.length - 1];
        zoneStack.pop();
        switchToZone(zone, false);
      }
      function switchToZone(targetZone, bEnteringZone) {
        var currentZone = PSD;
        if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
          queueMicrotask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
        }
        if (targetZone === PSD)
          return;
        PSD = targetZone;
        if (currentZone === globalPSD)
          globalPSD.env = snapShot();
        if (patchGlobalPromise) {
          var GlobalPromise = globalPSD.env.Promise;
          var targetEnv = targetZone.env;
          if (currentZone.global || targetZone.global) {
            Object.defineProperty(_global, "Promise", targetEnv.PromiseProp);
            GlobalPromise.all = targetEnv.all;
            GlobalPromise.race = targetEnv.race;
            GlobalPromise.resolve = targetEnv.resolve;
            GlobalPromise.reject = targetEnv.reject;
            if (targetEnv.allSettled)
              GlobalPromise.allSettled = targetEnv.allSettled;
            if (targetEnv.any)
              GlobalPromise.any = targetEnv.any;
          }
        }
      }
      function snapShot() {
        var GlobalPromise = _global.Promise;
        return patchGlobalPromise ? {
          Promise: GlobalPromise,
          PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
          all: GlobalPromise.all,
          race: GlobalPromise.race,
          allSettled: GlobalPromise.allSettled,
          any: GlobalPromise.any,
          resolve: GlobalPromise.resolve,
          reject: GlobalPromise.reject
        } : {};
      }
      function usePSD(psd, fn, a1, a2, a3) {
        var outerScope = PSD;
        try {
          switchToZone(psd, true);
          return fn(a1, a2, a3);
        } finally {
          switchToZone(outerScope, false);
        }
      }
      function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
        return typeof fn !== "function" ? fn : function() {
          var outerZone = PSD;
          if (possibleAwait)
            incrementExpectedAwaits();
          switchToZone(zone, true);
          try {
            return fn.apply(this, arguments);
          } finally {
            switchToZone(outerZone, false);
            if (cleanup)
              queueMicrotask(decrementExpectedAwaits);
          }
        };
      }
      function execInGlobalContext(cb) {
        if (Promise === NativePromise && task.echoes === 0) {
          if (zoneEchoes === 0) {
            cb();
          } else {
            enqueueNativeMicroTask(cb);
          }
        } else {
          setTimeout(cb, 0);
        }
      }
      var rejection = DexiePromise.reject;
      function tempTransaction(db, mode, storeNames, fn) {
        if (!db.idbdb || !db._state.openComplete && !PSD.letThrough && !db._vip) {
          if (db._state.openComplete) {
            return rejection(new exceptions.DatabaseClosed(db._state.dbOpenError));
          }
          if (!db._state.isBeingOpened) {
            if (!db._state.autoOpen)
              return rejection(new exceptions.DatabaseClosed());
            db.open().catch(nop);
          }
          return db._state.dbReadyPromise.then(function() {
            return tempTransaction(db, mode, storeNames, fn);
          });
        } else {
          var trans = db._createTransaction(mode, storeNames, db._dbSchema);
          try {
            trans.create();
            db._state.PR1398_maxLoop = 3;
          } catch (ex) {
            if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
              console.warn("Dexie: Need to reopen db");
              db.close({ disableAutoOpen: false });
              return db.open().then(function() {
                return tempTransaction(db, mode, storeNames, fn);
              });
            }
            return rejection(ex);
          }
          return trans._promise(mode, function(resolve, reject) {
            return newScope(function() {
              PSD.trans = trans;
              return fn(resolve, reject, trans);
            });
          }).then(function(result) {
            if (mode === "readwrite")
              try {
                trans.idbtrans.commit();
              } catch (_a2) {
              }
            return mode === "readonly" ? result : trans._completion.then(function() {
              return result;
            });
          });
        }
      }
      var DEXIE_VERSION = "4.4.6";
      var maxString = String.fromCharCode(65535);
      var minKey = -Infinity;
      var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
      var STRING_EXPECTED = "String expected.";
      var DEFAULT_MAX_CONNECTIONS = 1e3;
      var DBNAMES_DB = "__dbnames";
      var READONLY = "readonly";
      var READWRITE = "readwrite";
      function combine(filter1, filter2) {
        return filter1 ? filter2 ? function() {
          return filter1.apply(this, arguments) && filter2.apply(this, arguments);
        } : filter1 : filter2;
      }
      var AnyRange = {
        type: 3,
        lower: -Infinity,
        lowerOpen: false,
        upper: [[]],
        upperOpen: false
      };
      function workaroundForUndefinedPrimKey(keyPath) {
        return typeof keyPath === "string" && !/\./.test(keyPath) ? function(obj) {
          if (obj[keyPath] === void 0 && keyPath in obj) {
            obj = deepClone(obj);
            delete obj[keyPath];
          }
          return obj;
        } : function(obj) {
          return obj;
        };
      }
      function Entity2() {
        throw exceptions.Type("Entity instances must never be new:ed. Instances are generated by the framework bypassing the constructor.");
      }
      function cmp2(a, b) {
        try {
          var ta = type(a);
          var tb = type(b);
          if (ta !== tb) {
            if (ta === "Array")
              return 1;
            if (tb === "Array")
              return -1;
            if (ta === "binary")
              return 1;
            if (tb === "binary")
              return -1;
            if (ta === "string")
              return 1;
            if (tb === "string")
              return -1;
            if (ta === "Date")
              return 1;
            if (tb !== "Date")
              return NaN;
            return -1;
          }
          switch (ta) {
            case "number":
            case "Date":
            case "string":
              return a > b ? 1 : a < b ? -1 : 0;
            case "binary": {
              return compareUint8Arrays(getUint8Array(a), getUint8Array(b));
            }
            case "Array":
              return compareArrays(a, b);
          }
        } catch (_a2) {
        }
        return NaN;
      }
      function compareArrays(a, b) {
        var al = a.length;
        var bl = b.length;
        var l = al < bl ? al : bl;
        for (var i = 0; i < l; ++i) {
          var res = cmp2(a[i], b[i]);
          if (res !== 0)
            return res;
        }
        return al === bl ? 0 : al < bl ? -1 : 1;
      }
      function compareUint8Arrays(a, b) {
        var al = a.length;
        var bl = b.length;
        var l = al < bl ? al : bl;
        for (var i = 0; i < l; ++i) {
          if (a[i] !== b[i])
            return a[i] < b[i] ? -1 : 1;
        }
        return al === bl ? 0 : al < bl ? -1 : 1;
      }
      function type(x) {
        var t = typeof x;
        if (t !== "object")
          return t;
        if (ArrayBuffer.isView(x))
          return "binary";
        var tsTag = toStringTag(x);
        return tsTag === "ArrayBuffer" ? "binary" : tsTag;
      }
      function getUint8Array(a) {
        if (a instanceof Uint8Array)
          return a;
        if (ArrayBuffer.isView(a))
          return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
        return new Uint8Array(a);
      }
      function builtInDeletionTrigger(table, keys2, res) {
        var yProps = table.schema.yProps;
        if (!yProps)
          return res;
        if (keys2 && res.numFailures > 0)
          keys2 = keys2.filter(function(_, i) {
            return !res.failures[i];
          });
        return Promise.all(yProps.map(function(_a2) {
          var updatesTable = _a2.updatesTable;
          return keys2 ? table.db.table(updatesTable).where("k").anyOf(keys2).delete() : table.db.table(updatesTable).clear();
        })).then(function() {
          return res;
        });
      }
      var PropModification2 = (function() {
        function PropModification3(spec) {
          this["@@propmod"] = spec;
        }
        PropModification3.prototype.execute = function(value) {
          var _a2;
          var spec = this["@@propmod"];
          if (spec.add !== void 0) {
            var term = spec.add;
            if (isArray(term)) {
              return __spreadArray(__spreadArray([], isArray(value) ? value : [], true), term, true).sort();
            }
            if (typeof term === "number")
              return (Number(value) || 0) + term;
            if (typeof term === "bigint") {
              try {
                return BigInt(value) + term;
              } catch (_b) {
                return BigInt(0) + term;
              }
            }
            throw new TypeError("Invalid term ".concat(term));
          }
          if (spec.remove !== void 0) {
            var subtrahend_1 = spec.remove;
            if (isArray(subtrahend_1)) {
              return isArray(value) ? value.filter(function(item) {
                return !subtrahend_1.includes(item);
              }).sort() : [];
            }
            if (typeof subtrahend_1 === "number")
              return Number(value) - subtrahend_1;
            if (typeof subtrahend_1 === "bigint") {
              try {
                return BigInt(value) - subtrahend_1;
              } catch (_c) {
                return BigInt(0) - subtrahend_1;
              }
            }
            throw new TypeError("Invalid subtrahend ".concat(subtrahend_1));
          }
          var prefixToReplace = (_a2 = spec.replacePrefix) === null || _a2 === void 0 ? void 0 : _a2[0];
          if (prefixToReplace && typeof value === "string" && value.startsWith(prefixToReplace)) {
            return spec.replacePrefix[1] + value.substring(prefixToReplace.length);
          }
          return value;
        };
        return PropModification3;
      })();
      function applyUpdateSpec(obj, changes) {
        var keyPaths = keys(changes);
        var numKeys = keyPaths.length;
        var anythingModified = false;
        for (var i = 0; i < numKeys; ++i) {
          var keyPath = keyPaths[i];
          var value = changes[keyPath];
          var origValue = getByKeyPath(obj, keyPath);
          if (value instanceof PropModification2) {
            setByKeyPath(obj, keyPath, value.execute(origValue));
            anythingModified = true;
          } else if (origValue !== value) {
            setByKeyPath(obj, keyPath, value);
            anythingModified = true;
          }
        }
        return anythingModified;
      }
      var Table2 = (function() {
        function Table3() {
        }
        Table3.prototype._trans = function(mode, fn, writeLocked) {
          var trans = this._tx || PSD.trans;
          var tableName = this.name;
          var task2 = debug && typeof console !== "undefined" && console.createTask && console.createTask("Dexie: ".concat(mode === "readonly" ? "read" : "write", " ").concat(this.name));
          function checkTableInTransaction(resolve, reject, trans2) {
            if (!trans2.schema[tableName])
              throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
            return fn(trans2.idbtrans, trans2);
          }
          var wasRootExec = beginMicroTickScope();
          try {
            var p = trans && trans.db._novip === this.db._novip ? trans === PSD.trans ? trans._promise(mode, checkTableInTransaction, writeLocked) : newScope(function() {
              return trans._promise(mode, checkTableInTransaction, writeLocked);
            }, { trans, transless: PSD.transless || PSD }) : tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
            if (task2) {
              p._consoleTask = task2;
              p = p.catch(function(err) {
                console.trace(err);
                return rejection(err);
              });
            }
            return p;
          } finally {
            if (wasRootExec)
              endMicroTickScope();
          }
        };
        Table3.prototype.get = function(keyOrCrit, cb) {
          var _this = this;
          if (keyOrCrit && keyOrCrit.constructor === Object)
            return this.where(keyOrCrit).first(cb);
          if (keyOrCrit == null)
            return rejection(new exceptions.Type("Invalid argument to Table.get()"));
          return this._trans("readonly", function(trans) {
            return _this.core.get({ trans, key: keyOrCrit }).then(function(res) {
              return _this.hook.reading.fire(res);
            });
          }).then(cb);
        };
        Table3.prototype.where = function(indexOrCrit) {
          if (typeof indexOrCrit === "string")
            return new this.db.WhereClause(this, indexOrCrit);
          if (isArray(indexOrCrit))
            return new this.db.WhereClause(this, "[".concat(indexOrCrit.join("+"), "]"));
          var keyPaths = keys(indexOrCrit);
          if (keyPaths.length === 1)
            return this.where(keyPaths[0]).equals(indexOrCrit[keyPaths[0]]);
          var compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(function(ix) {
            if (ix.compound && keyPaths.every(function(keyPath) {
              return ix.keyPath.indexOf(keyPath) >= 0;
            })) {
              for (var i = 0; i < keyPaths.length; ++i) {
                if (keyPaths.indexOf(ix.keyPath[i]) === -1)
                  return false;
              }
              return true;
            }
            return false;
          }).sort(function(a, b) {
            return a.keyPath.length - b.keyPath.length;
          })[0];
          if (compoundIndex && this.db._maxKey !== maxString) {
            var keyPathsInValidOrder = compoundIndex.keyPath.slice(0, keyPaths.length);
            return this.where(keyPathsInValidOrder).equals(keyPathsInValidOrder.map(function(kp) {
              return indexOrCrit[kp];
            }));
          }
          if (!compoundIndex && debug)
            console.warn("The query ".concat(JSON.stringify(indexOrCrit), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(keyPaths.join("+"), "]"));
          var idxByName = this.schema.idxByName;
          function equals(a, b) {
            return cmp2(a, b) === 0;
          }
          var _a2 = keyPaths.reduce(function(_a3, keyPath) {
            var prevIndex = _a3[0], prevFilterFn = _a3[1];
            var index = idxByName[keyPath];
            var value = indexOrCrit[keyPath];
            return [
              prevIndex || index,
              prevIndex || !index ? combine(prevFilterFn, index && index.multi ? function(x) {
                var prop = getByKeyPath(x, keyPath);
                return isArray(prop) && prop.some(function(item) {
                  return equals(value, item);
                });
              } : function(x) {
                return equals(value, getByKeyPath(x, keyPath));
              }) : prevFilterFn
            ];
          }, [null, null]), idx = _a2[0], filterFunction = _a2[1];
          return idx ? this.where(idx.name).equals(indexOrCrit[idx.keyPath]).filter(filterFunction) : compoundIndex ? this.filter(filterFunction) : this.where(keyPaths).equals("");
        };
        Table3.prototype.filter = function(filterFunction) {
          return this.toCollection().and(filterFunction);
        };
        Table3.prototype.count = function(thenShortcut) {
          return this.toCollection().count(thenShortcut);
        };
        Table3.prototype.offset = function(offset) {
          return this.toCollection().offset(offset);
        };
        Table3.prototype.limit = function(numRows) {
          return this.toCollection().limit(numRows);
        };
        Table3.prototype.each = function(callback) {
          return this.toCollection().each(callback);
        };
        Table3.prototype.toArray = function(thenShortcut) {
          return this.toCollection().toArray(thenShortcut);
        };
        Table3.prototype.toCollection = function() {
          return new this.db.Collection(new this.db.WhereClause(this));
        };
        Table3.prototype.orderBy = function(index) {
          return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ? "[".concat(index.join("+"), "]") : index));
        };
        Table3.prototype.reverse = function() {
          return this.toCollection().reverse();
        };
        Table3.prototype.mapToClass = function(constructor) {
          var _a2 = this, db = _a2.db, tableName = _a2.name;
          this.schema.mappedClass = constructor;
          if (constructor.prototype instanceof Entity2) {
            constructor = (function(_super) {
              __extends(class_1, _super);
              function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
              }
              Object.defineProperty(class_1.prototype, "db", {
                get: function() {
                  return db;
                },
                enumerable: false,
                configurable: true
              });
              class_1.prototype.table = function() {
                return tableName;
              };
              return class_1;
            })(constructor);
          }
          var inheritedProps = /* @__PURE__ */ new Set();
          for (var proto = constructor.prototype; proto; proto = getProto(proto)) {
            Object.getOwnPropertyNames(proto).forEach(function(propName) {
              return inheritedProps.add(propName);
            });
          }
          var readHook = function(obj) {
            if (!obj)
              return obj;
            var res = Object.create(constructor.prototype);
            for (var m in obj)
              if (!inheritedProps.has(m))
                try {
                  res[m] = obj[m];
                } catch (_) {
                }
            return res;
          };
          if (this.schema.readHook) {
            this.hook.reading.unsubscribe(this.schema.readHook);
          }
          this.schema.readHook = readHook;
          this.hook("reading", readHook);
          return constructor;
        };
        Table3.prototype.defineClass = function() {
          function Class(content) {
            extend(this, content);
          }
          return this.mapToClass(Class);
        };
        Table3.prototype.add = function(obj, key) {
          var _this = this;
          var _a2 = this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
          var objToAdd = obj;
          if (keyPath && auto) {
            objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
          }
          return this._trans("readwrite", function(trans) {
            return _this.core.mutate({
              trans,
              type: "add",
              keys: key != null ? [key] : null,
              values: [objToAdd]
            });
          }).then(function(res) {
            return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult;
          }).then(function(lastResult) {
            if (keyPath) {
              try {
                setByKeyPath(obj, keyPath, lastResult);
              } catch (_) {
              }
            }
            return lastResult;
          });
        };
        Table3.prototype.upsert = function(key, modifications) {
          var _this = this;
          var keyPath = this.schema.primKey.keyPath;
          return this._trans("readwrite", function(trans) {
            return _this.core.get({ trans, key }).then(function(existing) {
              var obj = existing !== null && existing !== void 0 ? existing : {};
              applyUpdateSpec(obj, modifications);
              if (keyPath)
                setByKeyPath(obj, keyPath, key);
              return _this.core.mutate({
                trans,
                type: "put",
                values: [obj],
                keys: [key],
                upsert: true,
                updates: { keys: [key], changeSpecs: [modifications] }
              }).then(function(res) {
                return res.numFailures ? DexiePromise.reject(res.failures[0]) : !!existing;
              });
            });
          });
        };
        Table3.prototype.update = function(keyOrObject, modifications) {
          if (typeof keyOrObject === "object" && !isArray(keyOrObject)) {
            var key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
            if (key === void 0)
              return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
            return this.where(":id").equals(key).modify(modifications);
          } else {
            return this.where(":id").equals(keyOrObject).modify(modifications);
          }
        };
        Table3.prototype.put = function(obj, key) {
          var _this = this;
          var _a2 = this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
          var objToAdd = obj;
          if (keyPath && auto) {
            objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
          }
          return this._trans("readwrite", function(trans) {
            return _this.core.mutate({
              trans,
              type: "put",
              values: [objToAdd],
              keys: key != null ? [key] : null
            });
          }).then(function(res) {
            return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult;
          }).then(function(lastResult) {
            if (keyPath) {
              try {
                setByKeyPath(obj, keyPath, lastResult);
              } catch (_) {
              }
            }
            return lastResult;
          });
        };
        Table3.prototype.delete = function(key) {
          var _this = this;
          return this._trans("readwrite", function(trans) {
            return _this.core.mutate({ trans, type: "delete", keys: [key] }).then(function(res) {
              return builtInDeletionTrigger(_this, [key], res);
            }).then(function(res) {
              return res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0;
            });
          });
        };
        Table3.prototype.clear = function() {
          var _this = this;
          return this._trans("readwrite", function(trans) {
            return _this.core.mutate({ trans, type: "deleteRange", range: AnyRange }).then(function(res) {
              return builtInDeletionTrigger(_this, null, res);
            });
          }).then(function(res) {
            return res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0;
          });
        };
        Table3.prototype.bulkGet = function(keys2) {
          var _this = this;
          return this._trans("readonly", function(trans) {
            return _this.core.getMany({
              keys: keys2,
              trans
            }).then(function(result) {
              return result.map(function(res) {
                return _this.hook.reading.fire(res);
              });
            });
          });
        };
        Table3.prototype.bulkAdd = function(objects, keysOrOptions, options) {
          var _this = this;
          var keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
          options = options || (keys2 ? void 0 : keysOrOptions);
          var wantResults = options ? options.allKeys : void 0;
          return this._trans("readwrite", function(trans) {
            var _a2 = _this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
            if (keyPath && keys2)
              throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
            if (keys2 && keys2.length !== objects.length)
              throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
            var numObjects = objects.length;
            var objectsToAdd = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
            return _this.core.mutate({
              trans,
              type: "add",
              keys: keys2,
              values: objectsToAdd,
              wantResults
            }).then(function(_a3) {
              var numFailures = _a3.numFailures, results = _a3.results, lastResult = _a3.lastResult, failures = _a3.failures;
              var result = wantResults ? results : lastResult;
              if (numFailures === 0)
                return result;
              throw new BulkError("".concat(_this.name, ".bulkAdd(): ").concat(numFailures, " of ").concat(numObjects, " operations failed"), failures);
            });
          });
        };
        Table3.prototype.bulkPut = function(objects, keysOrOptions, options) {
          var _this = this;
          var keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
          options = options || (keys2 ? void 0 : keysOrOptions);
          var wantResults = options ? options.allKeys : void 0;
          return this._trans("readwrite", function(trans) {
            var _a2 = _this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
            if (keyPath && keys2)
              throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
            if (keys2 && keys2.length !== objects.length)
              throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
            var numObjects = objects.length;
            var objectsToPut = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
            return _this.core.mutate({
              trans,
              type: "put",
              keys: keys2,
              values: objectsToPut,
              wantResults
            }).then(function(_a3) {
              var numFailures = _a3.numFailures, results = _a3.results, lastResult = _a3.lastResult, failures = _a3.failures;
              var result = wantResults ? results : lastResult;
              if (numFailures === 0)
                return result;
              throw new BulkError("".concat(_this.name, ".bulkPut(): ").concat(numFailures, " of ").concat(numObjects, " operations failed"), failures);
            });
          });
        };
        Table3.prototype.bulkUpdate = function(keysAndChanges) {
          var _this = this;
          var coreTable = this.core;
          var keys2 = keysAndChanges.map(function(entry) {
            return entry.key;
          });
          var changeSpecs = keysAndChanges.map(function(entry) {
            return entry.changes;
          });
          var offsetMap = [];
          return this._trans("readwrite", function(trans) {
            return coreTable.getMany({ trans, keys: keys2, cache: "clone" }).then(function(objs) {
              var resultKeys = [];
              var resultObjs = [];
              keysAndChanges.forEach(function(_a2, idx) {
                var key = _a2.key, changes = _a2.changes;
                var obj = objs[idx];
                if (obj) {
                  for (var _i = 0, _b = Object.keys(changes); _i < _b.length; _i++) {
                    var keyPath = _b[_i];
                    var value = changes[keyPath];
                    if (keyPath === _this.schema.primKey.keyPath) {
                      if (cmp2(value, key) !== 0) {
                        throw new exceptions.Constraint("Cannot update primary key in bulkUpdate()");
                      }
                    } else {
                      setByKeyPath(obj, keyPath, value);
                    }
                  }
                  offsetMap.push(idx);
                  resultKeys.push(key);
                  resultObjs.push(obj);
                }
              });
              var numEntries = resultKeys.length;
              return coreTable.mutate({
                trans,
                type: "put",
                keys: resultKeys,
                values: resultObjs,
                updates: {
                  keys: keys2,
                  changeSpecs
                }
              }).then(function(_a2) {
                var numFailures = _a2.numFailures, failures = _a2.failures;
                if (numFailures === 0)
                  return numEntries;
                for (var _i = 0, _b = Object.keys(failures); _i < _b.length; _i++) {
                  var offset = _b[_i];
                  var mappedOffset = offsetMap[Number(offset)];
                  if (mappedOffset != null) {
                    var failure = failures[offset];
                    delete failures[offset];
                    failures[mappedOffset] = failure;
                  }
                }
                throw new BulkError("".concat(_this.name, ".bulkUpdate(): ").concat(numFailures, " of ").concat(numEntries, " operations failed"), failures);
              });
            });
          });
        };
        Table3.prototype.bulkDelete = function(keys2) {
          var _this = this;
          var numKeys = keys2.length;
          return this._trans("readwrite", function(trans) {
            return _this.core.mutate({ trans, type: "delete", keys: keys2 }).then(function(res) {
              return builtInDeletionTrigger(_this, keys2, res);
            });
          }).then(function(_a2) {
            var numFailures = _a2.numFailures, lastResult = _a2.lastResult, failures = _a2.failures;
            if (numFailures === 0)
              return lastResult;
            throw new BulkError("".concat(_this.name, ".bulkDelete(): ").concat(numFailures, " of ").concat(numKeys, " operations failed"), failures);
          });
        };
        return Table3;
      })();
      function Events(ctx) {
        var evs = {};
        var rv = function(eventName, subscriber) {
          if (subscriber) {
            var i2 = arguments.length, args = new Array(i2 - 1);
            while (--i2)
              args[i2 - 1] = arguments[i2];
            evs[eventName].subscribe.apply(null, args);
            return ctx;
          } else if (typeof eventName === "string") {
            return evs[eventName];
          }
        };
        rv.addEventType = add3;
        for (var i = 1, l = arguments.length; i < l; ++i) {
          add3(arguments[i]);
        }
        return rv;
        function add3(eventName, chainFunction, defaultFunction) {
          if (typeof eventName === "object")
            return addConfiguredEvents(eventName);
          if (!chainFunction)
            chainFunction = reverseStoppableEventChain;
          if (!defaultFunction)
            defaultFunction = nop;
          var context = {
            subscribers: [],
            fire: defaultFunction,
            subscribe: function(cb) {
              if (context.subscribers.indexOf(cb) === -1) {
                context.subscribers.push(cb);
                context.fire = chainFunction(context.fire, cb);
              }
            },
            unsubscribe: function(cb) {
              context.subscribers = context.subscribers.filter(function(fn) {
                return fn !== cb;
              });
              context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
            }
          };
          evs[eventName] = rv[eventName] = context;
          return context;
        }
        function addConfiguredEvents(cfg) {
          keys(cfg).forEach(function(eventName) {
            var args = cfg[eventName];
            if (isArray(args)) {
              add3(eventName, cfg[eventName][0], cfg[eventName][1]);
            } else if (args === "asap") {
              var context = add3(eventName, mirror, function fire() {
                var i2 = arguments.length, args2 = new Array(i2);
                while (i2--)
                  args2[i2] = arguments[i2];
                context.subscribers.forEach(function(fn) {
                  asap$1(function fireEvent() {
                    fn.apply(null, args2);
                  });
                });
              });
            } else
              throw new exceptions.InvalidArgument("Invalid event config");
          });
        }
      }
      function makeClassConstructor(prototype, constructor) {
        derive(constructor).from({ prototype });
        return constructor;
      }
      function createTableConstructor(db) {
        return makeClassConstructor(Table2.prototype, function Table3(name, tableSchema, trans) {
          this.db = db;
          this._tx = trans;
          this.name = name;
          this.schema = tableSchema;
          this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
            creating: [hookCreatingChain, nop],
            reading: [pureFunctionChain, mirror],
            updating: [hookUpdatingChain, nop],
            deleting: [hookDeletingChain, nop]
          });
        });
      }
      function isPlainKeyRange(ctx, ignoreLimitFilter) {
        return !(ctx.filter || ctx.algorithm || ctx.or) && (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
      }
      function addFilter(ctx, fn) {
        ctx.filter = combine(ctx.filter, fn);
      }
      function addReplayFilter(ctx, factory, isLimitFilter) {
        var curr = ctx.replayFilter;
        ctx.replayFilter = curr ? function() {
          return combine(curr(), factory());
        } : factory;
        ctx.justLimit = isLimitFilter && !curr;
      }
      function addMatchFilter(ctx, fn) {
        ctx.isMatch = combine(ctx.isMatch, fn);
      }
      function getIndexOrStore(ctx, coreSchema) {
        if (ctx.isPrimKey)
          return coreSchema.primaryKey;
        var index = coreSchema.getIndexByKeyPath(ctx.index);
        if (!index)
          throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
        return index;
      }
      function openCursor(ctx, coreTable, trans) {
        var index = getIndexOrStore(ctx, coreTable.schema);
        return coreTable.openCursor({
          trans,
          values: !ctx.keysOnly,
          reverse: ctx.dir === "prev",
          unique: !!ctx.unique,
          query: {
            index,
            range: ctx.range
          }
        });
      }
      function iter(ctx, fn, coreTrans, coreTable) {
        var filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
        if (!ctx.or) {
          return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
        } else {
          var set_1 = {};
          var union = function(item, cursor, advance) {
            if (!filter || filter(cursor, advance, function(result) {
              return cursor.stop(result);
            }, function(err) {
              return cursor.fail(err);
            })) {
              var primaryKey = cursor.primaryKey;
              var key = "" + primaryKey;
              if (key === "[object ArrayBuffer]")
                key = "" + new Uint8Array(primaryKey);
              if (!hasOwn(set_1, key)) {
                set_1[key] = true;
                fn(item, cursor, advance);
              }
            }
          };
          return Promise.all([
            ctx.or._iterate(union, coreTrans),
            iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
          ]);
        }
      }
      function iterate(cursorPromise, filter, fn, valueMapper) {
        var mappedFn = valueMapper ? function(x, c, a) {
          return fn(valueMapper(x), c, a);
        } : fn;
        var wrappedFn = wrap(mappedFn);
        return cursorPromise.then(function(cursor) {
          if (cursor) {
            return cursor.start(function() {
              var c = function() {
                return cursor.continue();
              };
              if (!filter || filter(cursor, function(advancer) {
                return c = advancer;
              }, function(val) {
                cursor.stop(val);
                c = nop;
              }, function(e) {
                cursor.fail(e);
                c = nop;
              }))
                wrappedFn(cursor.value, cursor, function(advancer) {
                  return c = advancer;
                });
              c();
            });
          }
        });
      }
      var Collection = (function() {
        function Collection2() {
        }
        Collection2.prototype._read = function(fn, cb) {
          var ctx = this._ctx;
          return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readonly", fn).then(cb);
        };
        Collection2.prototype._write = function(fn) {
          var ctx = this._ctx;
          return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readwrite", fn, "locked");
        };
        Collection2.prototype._addAlgorithm = function(fn) {
          var ctx = this._ctx;
          ctx.algorithm = combine(ctx.algorithm, fn);
        };
        Collection2.prototype._iterate = function(fn, coreTrans) {
          return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
        };
        Collection2.prototype.clone = function(props2) {
          var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
          if (props2)
            extend(ctx, props2);
          rv._ctx = ctx;
          return rv;
        };
        Collection2.prototype.raw = function() {
          this._ctx.valueMapper = null;
          return this;
        };
        Collection2.prototype.each = function(fn) {
          var ctx = this._ctx;
          return this._read(function(trans) {
            return iter(ctx, fn, trans, ctx.table.core);
          });
        };
        Collection2.prototype.count = function(cb) {
          var _this = this;
          return this._read(function(trans) {
            var ctx = _this._ctx;
            var coreTable = ctx.table.core;
            if (isPlainKeyRange(ctx, true)) {
              return coreTable.count({
                trans,
                query: {
                  index: getIndexOrStore(ctx, coreTable.schema),
                  range: ctx.range
                }
              }).then(function(count2) {
                return Math.min(count2, ctx.limit);
              });
            } else {
              var count = 0;
              return iter(ctx, function() {
                ++count;
                return false;
              }, trans, coreTable).then(function() {
                return count;
              });
            }
          }).then(cb);
        };
        Collection2.prototype.sortBy = function(keyPath, cb) {
          var parts = keyPath.split(".").reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
          function getval(obj, i) {
            if (i)
              return getval(obj[parts[i]], i - 1);
            return obj[lastPart];
          }
          var order = this._ctx.dir === "next" ? 1 : -1;
          function sorter(a, b) {
            var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
            return cmp2(aVal, bVal) * order;
          }
          return this.toArray(function(a) {
            return a.slice().sort(sorter);
          }).then(cb);
        };
        Collection2.prototype.toArray = function(cb) {
          var _this = this;
          return this._read(function(trans) {
            var ctx = _this._ctx;
            if (isPlainKeyRange(ctx, true) && ctx.limit > 0) {
              var valueMapper_1 = ctx.valueMapper;
              var index = getIndexOrStore(ctx, ctx.table.core.schema);
              return ctx.table.core.query({
                trans,
                limit: ctx.limit,
                values: true,
                direction: ctx.dir === "prev" ? "prev" : void 0,
                query: {
                  index,
                  range: ctx.range
                }
              }).then(function(_a2) {
                var result = _a2.result;
                return valueMapper_1 ? result.map(valueMapper_1) : result;
              });
            } else {
              var a_1 = [];
              return iter(ctx, function(item) {
                return a_1.push(item);
              }, trans, ctx.table.core).then(function() {
                return a_1;
              });
            }
          }, cb);
        };
        Collection2.prototype.offset = function(offset) {
          var ctx = this._ctx;
          if (offset <= 0)
            return this;
          ctx.offset += offset;
          if (isPlainKeyRange(ctx)) {
            addReplayFilter(ctx, function() {
              var offsetLeft = offset;
              return function(cursor, advance) {
                if (offsetLeft === 0)
                  return true;
                if (offsetLeft === 1) {
                  --offsetLeft;
                  return false;
                }
                advance(function() {
                  cursor.advance(offsetLeft);
                  offsetLeft = 0;
                });
                return false;
              };
            });
          } else {
            addReplayFilter(ctx, function() {
              var offsetLeft = offset;
              return function() {
                return --offsetLeft < 0;
              };
            });
          }
          return this;
        };
        Collection2.prototype.limit = function(numRows) {
          this._ctx.limit = Math.min(this._ctx.limit, numRows);
          addReplayFilter(this._ctx, function() {
            var rowsLeft = numRows;
            return function(cursor, advance, resolve) {
              if (--rowsLeft <= 0)
                advance(resolve);
              return rowsLeft >= 0;
            };
          }, true);
          return this;
        };
        Collection2.prototype.until = function(filterFunction, bIncludeStopEntry) {
          addFilter(this._ctx, function(cursor, advance, resolve) {
            if (filterFunction(cursor.value)) {
              advance(resolve);
              return bIncludeStopEntry;
            } else {
              return true;
            }
          });
          return this;
        };
        Collection2.prototype.first = function(cb) {
          return this.limit(1).toArray(function(a) {
            return a[0];
          }).then(cb);
        };
        Collection2.prototype.last = function(cb) {
          return this.reverse().first(cb);
        };
        Collection2.prototype.filter = function(filterFunction) {
          addFilter(this._ctx, function(cursor) {
            return filterFunction(cursor.value);
          });
          addMatchFilter(this._ctx, filterFunction);
          return this;
        };
        Collection2.prototype.and = function(filter) {
          return this.filter(filter);
        };
        Collection2.prototype.or = function(indexName) {
          return new this.db.WhereClause(this._ctx.table, indexName, this);
        };
        Collection2.prototype.reverse = function() {
          this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev";
          if (this._ondirectionchange)
            this._ondirectionchange(this._ctx.dir);
          return this;
        };
        Collection2.prototype.desc = function() {
          return this.reverse();
        };
        Collection2.prototype.eachKey = function(cb) {
          var ctx = this._ctx;
          ctx.keysOnly = !ctx.isMatch;
          return this.each(function(val, cursor) {
            cb(cursor.key, cursor);
          });
        };
        Collection2.prototype.eachUniqueKey = function(cb) {
          this._ctx.unique = "unique";
          return this.eachKey(cb);
        };
        Collection2.prototype.eachPrimaryKey = function(cb) {
          var ctx = this._ctx;
          ctx.keysOnly = !ctx.isMatch;
          return this.each(function(val, cursor) {
            cb(cursor.primaryKey, cursor);
          });
        };
        Collection2.prototype.keys = function(cb) {
          var ctx = this._ctx;
          ctx.keysOnly = !ctx.isMatch;
          var a = [];
          return this.each(function(item, cursor) {
            a.push(cursor.key);
          }).then(function() {
            return a;
          }).then(cb);
        };
        Collection2.prototype.primaryKeys = function(cb) {
          var ctx = this._ctx;
          if (isPlainKeyRange(ctx, true) && ctx.limit > 0) {
            return this._read(function(trans) {
              var index = getIndexOrStore(ctx, ctx.table.core.schema);
              return ctx.table.core.query({
                trans,
                values: false,
                limit: ctx.limit,
                direction: ctx.dir === "prev" ? "prev" : void 0,
                query: {
                  index,
                  range: ctx.range
                }
              });
            }).then(function(_a2) {
              var result = _a2.result;
              return result;
            }).then(cb);
          }
          ctx.keysOnly = !ctx.isMatch;
          var a = [];
          return this.each(function(item, cursor) {
            a.push(cursor.primaryKey);
          }).then(function() {
            return a;
          }).then(cb);
        };
        Collection2.prototype.uniqueKeys = function(cb) {
          this._ctx.unique = "unique";
          return this.keys(cb);
        };
        Collection2.prototype.firstKey = function(cb) {
          return this.limit(1).keys(function(a) {
            return a[0];
          }).then(cb);
        };
        Collection2.prototype.lastKey = function(cb) {
          return this.reverse().firstKey(cb);
        };
        Collection2.prototype.distinct = function() {
          var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
          if (!idx || !idx.multi)
            return this;
          var set = {};
          addFilter(this._ctx, function(cursor) {
            var strKey = cursor.primaryKey.toString();
            var found = hasOwn(set, strKey);
            set[strKey] = true;
            return !found;
          });
          return this;
        };
        Collection2.prototype.modify = function(changes) {
          var _this = this;
          var ctx = this._ctx;
          return this._write(function(trans) {
            var modifyer;
            if (typeof changes === "function") {
              modifyer = changes;
            } else {
              modifyer = function(item) {
                return applyUpdateSpec(item, changes);
              };
            }
            var coreTable = ctx.table.core;
            var _a2 = coreTable.schema.primaryKey, outbound = _a2.outbound, extractKey = _a2.extractKey;
            var limit = 200;
            var modifyChunkSize = _this.db._options.modifyChunkSize;
            if (modifyChunkSize) {
              if (typeof modifyChunkSize == "object") {
                limit = modifyChunkSize[coreTable.name] || modifyChunkSize["*"] || 200;
              } else {
                limit = modifyChunkSize;
              }
            }
            var totalFailures = [];
            var successCount = 0;
            var failedKeys = [];
            var applyMutateResult = function(expectedCount, res) {
              var failures = res.failures, numFailures = res.numFailures;
              successCount += expectedCount - numFailures;
              for (var _i = 0, _a3 = keys(failures); _i < _a3.length; _i++) {
                var pos = _a3[_i];
                totalFailures.push(failures[pos]);
              }
            };
            var isUnconditionalDelete = changes === deleteCallback;
            return _this.clone().primaryKeys().then(function(keys2) {
              var criteria = isPlainKeyRange(ctx) && ctx.limit === Infinity && (typeof changes !== "function" || isUnconditionalDelete) && {
                index: ctx.index,
                range: ctx.range
              };
              var nextChunk = function(offset) {
                var count = Math.min(limit, keys2.length - offset);
                var keysInChunk = keys2.slice(offset, offset + count);
                return (isUnconditionalDelete ? Promise.resolve([]) : coreTable.getMany({
                  trans,
                  keys: keysInChunk,
                  cache: "immutable"
                })).then(function(values) {
                  var addValues = [];
                  var putValues = [];
                  var putKeys = outbound ? [] : null;
                  var deleteKeys = isUnconditionalDelete ? keysInChunk : [];
                  if (!isUnconditionalDelete)
                    for (var i = 0; i < count; ++i) {
                      var origValue = values[i];
                      var ctx_1 = {
                        value: deepClone(origValue),
                        primKey: keys2[offset + i]
                      };
                      if (modifyer.call(ctx_1, ctx_1.value, ctx_1) !== false) {
                        if (ctx_1.value == null) {
                          deleteKeys.push(keys2[offset + i]);
                        } else if (!outbound && cmp2(extractKey(origValue), extractKey(ctx_1.value)) !== 0) {
                          deleteKeys.push(keys2[offset + i]);
                          addValues.push(ctx_1.value);
                        } else {
                          putValues.push(ctx_1.value);
                          if (outbound)
                            putKeys.push(keys2[offset + i]);
                        }
                      }
                    }
                  return Promise.resolve(addValues.length > 0 && coreTable.mutate({ trans, type: "add", values: addValues }).then(function(res) {
                    for (var pos in res.failures) {
                      deleteKeys.splice(parseInt(pos), 1);
                    }
                    applyMutateResult(addValues.length, res);
                  })).then(function() {
                    return (putValues.length > 0 || criteria && typeof changes === "object") && coreTable.mutate({
                      trans,
                      type: "put",
                      keys: putKeys,
                      values: putValues,
                      criteria,
                      changeSpec: typeof changes !== "function" && changes,
                      isAdditionalChunk: offset > 0
                    }).then(function(res) {
                      return applyMutateResult(putValues.length, res);
                    });
                  }).then(function() {
                    return (deleteKeys.length > 0 || criteria && isUnconditionalDelete) && coreTable.mutate({
                      trans,
                      type: "delete",
                      keys: deleteKeys,
                      criteria,
                      isAdditionalChunk: offset > 0
                    }).then(function(res) {
                      return builtInDeletionTrigger(ctx.table, deleteKeys, res);
                    }).then(function(res) {
                      return applyMutateResult(deleteKeys.length, res);
                    });
                  }).then(function() {
                    return keys2.length > offset + count && nextChunk(offset + limit);
                  });
                });
              };
              return nextChunk(0).then(function() {
                if (totalFailures.length > 0)
                  throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
                return keys2.length;
              });
            });
          });
        };
        Collection2.prototype.delete = function() {
          var ctx = this._ctx, range = ctx.range;
          if (isPlainKeyRange(ctx) && !ctx.table.schema.yProps && (ctx.isPrimKey || range.type === 3)) {
            return this._write(function(trans) {
              var primaryKey = ctx.table.core.schema.primaryKey;
              var coreRange = range;
              return ctx.table.core.count({ trans, query: { index: primaryKey, range: coreRange } }).then(function(count) {
                return ctx.table.core.mutate({ trans, type: "deleteRange", range: coreRange }).then(function(_a2) {
                  var failures = _a2.failures, numFailures = _a2.numFailures;
                  if (numFailures)
                    throw new ModifyError("Could not delete some values", Object.keys(failures).map(function(pos) {
                      return failures[pos];
                    }), count - numFailures);
                  return count - numFailures;
                });
              });
            });
          }
          return this.modify(deleteCallback);
        };
        return Collection2;
      })();
      var deleteCallback = function(value, ctx) {
        return ctx.value = null;
      };
      function createCollectionConstructor(db) {
        return makeClassConstructor(Collection.prototype, function Collection2(whereClause, keyRangeGenerator) {
          this.db = db;
          var keyRange = AnyRange, error = null;
          if (keyRangeGenerator)
            try {
              keyRange = keyRangeGenerator();
            } catch (ex) {
              error = ex;
            }
          var whereCtx = whereClause._ctx;
          var table = whereCtx.table;
          var readingHook = table.hook.reading.fire;
          this._ctx = {
            table,
            index: whereCtx.index,
            isPrimKey: !whereCtx.index || table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name,
            range: keyRange,
            keysOnly: false,
            dir: "next",
            unique: "",
            algorithm: null,
            filter: null,
            replayFilter: null,
            justLimit: true,
            isMatch: null,
            offset: 0,
            limit: Infinity,
            error,
            or: whereCtx.or,
            valueMapper: readingHook !== mirror ? readingHook : null
          };
        });
      }
      function simpleCompare(a, b) {
        return a < b ? -1 : a === b ? 0 : 1;
      }
      function simpleCompareReverse(a, b) {
        return a > b ? -1 : a === b ? 0 : 1;
      }
      function fail(collectionOrWhereClause, err, T) {
        var collection = collectionOrWhereClause instanceof WhereClause ? new collectionOrWhereClause.Collection(collectionOrWhereClause) : collectionOrWhereClause;
        collection._ctx.error = T ? new T(err) : new TypeError(err);
        return collection;
      }
      function emptyCollection(whereClause) {
        return new whereClause.Collection(whereClause, function() {
          return rangeEqual("");
        }).limit(0);
      }
      function upperFactory(dir) {
        return dir === "next" ? function(s) {
          return s.toUpperCase();
        } : function(s) {
          return s.toLowerCase();
        };
      }
      function lowerFactory(dir) {
        return dir === "next" ? function(s) {
          return s.toLowerCase();
        } : function(s) {
          return s.toUpperCase();
        };
      }
      function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp3, dir) {
        var length = Math.min(key.length, lowerNeedle.length);
        var llp = -1;
        for (var i = 0; i < length; ++i) {
          var lwrKeyChar = lowerKey[i];
          if (lwrKeyChar !== lowerNeedle[i]) {
            if (cmp3(key[i], upperNeedle[i]) < 0)
              return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
            if (cmp3(key[i], lowerNeedle[i]) < 0)
              return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
            if (llp >= 0)
              return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
            return null;
          }
          if (cmp3(key[i], lwrKeyChar) < 0)
            llp = i;
        }
        if (length < lowerNeedle.length && dir === "next")
          return key + upperNeedle.substr(key.length);
        if (length < key.length && dir === "prev")
          return key.substr(0, upperNeedle.length);
        return llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1);
      }
      function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
        var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
        if (!needles.every(function(s) {
          return typeof s === "string";
        })) {
          return fail(whereClause, STRING_EXPECTED);
        }
        function initDirection(dir) {
          upper = upperFactory(dir);
          lower = lowerFactory(dir);
          compare = dir === "next" ? simpleCompare : simpleCompareReverse;
          var needleBounds = needles.map(function(needle) {
            return { lower: lower(needle), upper: upper(needle) };
          }).sort(function(a, b) {
            return compare(a.lower, b.lower);
          });
          upperNeedles = needleBounds.map(function(nb) {
            return nb.upper;
          });
          lowerNeedles = needleBounds.map(function(nb) {
            return nb.lower;
          });
          direction = dir;
          nextKeySuffix = dir === "next" ? "" : suffix;
        }
        initDirection("next");
        var c = new whereClause.Collection(whereClause, function() {
          return createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix);
        });
        c._ondirectionchange = function(direction2) {
          initDirection(direction2);
        };
        var firstPossibleNeedle = 0;
        c._addAlgorithm(function(cursor, advance, resolve) {
          var key = cursor.key;
          if (typeof key !== "string")
            return false;
          var lowerKey = lower(key);
          if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
            return true;
          } else {
            var lowestPossibleCasing = null;
            for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
              var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
              if (casing === null && lowestPossibleCasing === null)
                firstPossibleNeedle = i + 1;
              else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
                lowestPossibleCasing = casing;
              }
            }
            if (lowestPossibleCasing !== null) {
              advance(function() {
                cursor.continue(lowestPossibleCasing + nextKeySuffix);
              });
            } else {
              advance(resolve);
            }
            return false;
          }
        });
        return c;
      }
      function createRange(lower, upper, lowerOpen, upperOpen) {
        return {
          type: 2,
          lower,
          upper,
          lowerOpen,
          upperOpen
        };
      }
      function rangeEqual(value) {
        return {
          type: 1,
          lower: value,
          upper: value
        };
      }
      var WhereClause = (function() {
        function WhereClause2() {
        }
        Object.defineProperty(WhereClause2.prototype, "Collection", {
          get: function() {
            return this._ctx.table.db.Collection;
          },
          enumerable: false,
          configurable: true
        });
        WhereClause2.prototype.between = function(lower, upper, includeLower, includeUpper) {
          includeLower = includeLower !== false;
          includeUpper = includeUpper === true;
          try {
            if (this._cmp(lower, upper) > 0 || this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper))
              return emptyCollection(this);
            return new this.Collection(this, function() {
              return createRange(lower, upper, !includeLower, !includeUpper);
            });
          } catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
          }
        };
        WhereClause2.prototype.equals = function(value) {
          if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
          return new this.Collection(this, function() {
            return rangeEqual(value);
          });
        };
        WhereClause2.prototype.above = function(value) {
          if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
          return new this.Collection(this, function() {
            return createRange(value, void 0, true);
          });
        };
        WhereClause2.prototype.aboveOrEqual = function(value) {
          if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
          return new this.Collection(this, function() {
            return createRange(value, void 0, false);
          });
        };
        WhereClause2.prototype.below = function(value) {
          if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
          return new this.Collection(this, function() {
            return createRange(void 0, value, false, true);
          });
        };
        WhereClause2.prototype.belowOrEqual = function(value) {
          if (value == null)
            return fail(this, INVALID_KEY_ARGUMENT);
          return new this.Collection(this, function() {
            return createRange(void 0, value);
          });
        };
        WhereClause2.prototype.startsWith = function(str) {
          if (typeof str !== "string")
            return fail(this, STRING_EXPECTED);
          return this.between(str, str + maxString, true, true);
        };
        WhereClause2.prototype.startsWithIgnoreCase = function(str) {
          if (str === "")
            return this.startsWith(str);
          return addIgnoreCaseAlgorithm(this, function(x, a) {
            return x.indexOf(a[0]) === 0;
          }, [str], maxString);
        };
        WhereClause2.prototype.equalsIgnoreCase = function(str) {
          return addIgnoreCaseAlgorithm(this, function(x, a) {
            return x === a[0];
          }, [str], "");
        };
        WhereClause2.prototype.anyOfIgnoreCase = function() {
          var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
          if (set.length === 0)
            return emptyCollection(this);
          return addIgnoreCaseAlgorithm(this, function(x, a) {
            return a.indexOf(x) !== -1;
          }, set, "");
        };
        WhereClause2.prototype.startsWithAnyOfIgnoreCase = function() {
          var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
          if (set.length === 0)
            return emptyCollection(this);
          return addIgnoreCaseAlgorithm(this, function(x, a) {
            return a.some(function(n) {
              return x.indexOf(n) === 0;
            });
          }, set, maxString);
        };
        WhereClause2.prototype.anyOf = function() {
          var _this = this;
          var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
          var compare = this._cmp;
          try {
            set.sort(compare);
          } catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
          }
          if (set.length === 0)
            return emptyCollection(this);
          var c = new this.Collection(this, function() {
            return createRange(set[0], set[set.length - 1]);
          });
          c._ondirectionchange = function(direction) {
            compare = direction === "next" ? _this._ascending : _this._descending;
            set.sort(compare);
          };
          var i = 0;
          c._addAlgorithm(function(cursor, advance, resolve) {
            var key = cursor.key;
            while (compare(key, set[i]) > 0) {
              ++i;
              if (i === set.length) {
                advance(resolve);
                return false;
              }
            }
            if (compare(key, set[i]) === 0) {
              return true;
            } else {
              advance(function() {
                cursor.continue(set[i]);
              });
              return false;
            }
          });
          return c;
        };
        WhereClause2.prototype.notEqual = function(value) {
          return this.inAnyRange([
            [minKey, value],
            [value, this.db._maxKey]
          ], { includeLowers: false, includeUppers: false });
        };
        WhereClause2.prototype.noneOf = function() {
          var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
          if (set.length === 0)
            return new this.Collection(this);
          try {
            set.sort(this._ascending);
          } catch (e) {
            return fail(this, INVALID_KEY_ARGUMENT);
          }
          var ranges = set.reduce(function(res, val) {
            return res ? res.concat([[res[res.length - 1][1], val]]) : [[minKey, val]];
          }, null);
          ranges.push([set[set.length - 1], this.db._maxKey]);
          return this.inAnyRange(ranges, {
            includeLowers: false,
            includeUppers: false
          });
        };
        WhereClause2.prototype.inAnyRange = function(ranges, options) {
          var _this = this;
          var cmp3 = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
          if (ranges.length === 0)
            return emptyCollection(this);
          if (!ranges.every(function(range) {
            return range[0] !== void 0 && range[1] !== void 0 && ascending(range[0], range[1]) <= 0;
          })) {
            return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
          }
          var includeLowers = !options || options.includeLowers !== false;
          var includeUppers = options && options.includeUppers === true;
          function addRange2(ranges2, newRange) {
            var i = 0, l = ranges2.length;
            for (; i < l; ++i) {
              var range = ranges2[i];
              if (cmp3(newRange[0], range[1]) < 0 && cmp3(newRange[1], range[0]) > 0) {
                range[0] = min(range[0], newRange[0]);
                range[1] = max(range[1], newRange[1]);
                break;
              }
            }
            if (i === l)
              ranges2.push(newRange);
            return ranges2;
          }
          var sortDirection = ascending;
          function rangeSorter(a, b) {
            return sortDirection(a[0], b[0]);
          }
          var set;
          try {
            set = ranges.reduce(addRange2, []);
            set.sort(rangeSorter);
          } catch (ex) {
            return fail(this, INVALID_KEY_ARGUMENT);
          }
          var rangePos = 0;
          var keyIsBeyondCurrentEntry = includeUppers ? function(key) {
            return ascending(key, set[rangePos][1]) > 0;
          } : function(key) {
            return ascending(key, set[rangePos][1]) >= 0;
          };
          var keyIsBeforeCurrentEntry = includeLowers ? function(key) {
            return descending(key, set[rangePos][0]) > 0;
          } : function(key) {
            return descending(key, set[rangePos][0]) >= 0;
          };
          function keyWithinCurrentRange(key) {
            return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
          }
          var checkKey = keyIsBeyondCurrentEntry;
          var c = new this.Collection(this, function() {
            return createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers);
          });
          c._ondirectionchange = function(direction) {
            if (direction === "next") {
              checkKey = keyIsBeyondCurrentEntry;
              sortDirection = ascending;
            } else {
              checkKey = keyIsBeforeCurrentEntry;
              sortDirection = descending;
            }
            set.sort(rangeSorter);
          };
          c._addAlgorithm(function(cursor, advance, resolve) {
            var key = cursor.key;
            while (checkKey(key)) {
              ++rangePos;
              if (rangePos === set.length) {
                advance(resolve);
                return false;
              }
            }
            if (keyWithinCurrentRange(key)) {
              return true;
            } else if (_this._cmp(key, set[rangePos][1]) === 0 || _this._cmp(key, set[rangePos][0]) === 0) {
              return false;
            } else {
              advance(function() {
                if (sortDirection === ascending)
                  cursor.continue(set[rangePos][0]);
                else
                  cursor.continue(set[rangePos][1]);
              });
              return false;
            }
          });
          return c;
        };
        WhereClause2.prototype.startsWithAnyOf = function() {
          var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
          if (!set.every(function(s) {
            return typeof s === "string";
          })) {
            return fail(this, "startsWithAnyOf() only works with strings");
          }
          if (set.length === 0)
            return emptyCollection(this);
          return this.inAnyRange(set.map(function(str) {
            return [str, str + maxString];
          }));
        };
        return WhereClause2;
      })();
      function createWhereClauseConstructor(db) {
        return makeClassConstructor(WhereClause.prototype, function WhereClause2(table, index, orCollection) {
          this.db = db;
          this._ctx = {
            table,
            index: index === ":id" ? null : index,
            or: orCollection
          };
          this._cmp = this._ascending = cmp2;
          this._descending = function(a, b) {
            return cmp2(b, a);
          };
          this._max = function(a, b) {
            return cmp2(a, b) > 0 ? a : b;
          };
          this._min = function(a, b) {
            return cmp2(a, b) < 0 ? a : b;
          };
          this._IDBKeyRange = db._deps.IDBKeyRange;
          if (!this._IDBKeyRange)
            throw new exceptions.MissingAPI();
        });
      }
      function eventRejectHandler(reject) {
        return wrap(function(event) {
          preventDefault(event);
          reject(event.target.error);
          return false;
        });
      }
      function preventDefault(event) {
        if (event.stopPropagation)
          event.stopPropagation();
        if (event.preventDefault)
          event.preventDefault();
      }
      var DEXIE_STORAGE_MUTATED_EVENT_NAME = "storagemutated";
      var STORAGE_MUTATED_DOM_EVENT_NAME = "x-storagemutated-1";
      var globalEvents = Events(null, DEXIE_STORAGE_MUTATED_EVENT_NAME);
      var Transaction = (function() {
        function Transaction2() {
        }
        Transaction2.prototype._lock = function() {
          assert(!PSD.global);
          ++this._reculock;
          if (this._reculock === 1 && !PSD.global)
            PSD.lockOwnerFor = this;
          return this;
        };
        Transaction2.prototype._unlock = function() {
          assert(!PSD.global);
          if (--this._reculock === 0) {
            if (!PSD.global)
              PSD.lockOwnerFor = null;
            while (this._blockedFuncs.length > 0 && !this._locked()) {
              var fnAndPSD = this._blockedFuncs.shift();
              try {
                usePSD(fnAndPSD[1], fnAndPSD[0]);
              } catch (e) {
              }
            }
          }
          return this;
        };
        Transaction2.prototype._locked = function() {
          return this._reculock && PSD.lockOwnerFor !== this;
        };
        Transaction2.prototype.create = function(idbtrans) {
          var _this = this;
          if (!this.mode)
            return this;
          var idbdb = this.db.idbdb;
          var dbOpenError = this.db._state.dbOpenError;
          assert(!this.idbtrans);
          if (!idbtrans && !idbdb) {
            switch (dbOpenError && dbOpenError.name) {
              case "DatabaseClosedError":
                throw new exceptions.DatabaseClosed(dbOpenError);
              case "MissingAPIError":
                throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
              default:
                throw new exceptions.OpenFailed(dbOpenError);
            }
          }
          if (!this.active)
            throw new exceptions.TransactionInactive();
          assert(this._completion._state === null);
          idbtrans = this.idbtrans = idbtrans || (this.db.core ? this.db.core.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }) : idbdb.transaction(this.storeNames, this.mode, {
            durability: this.chromeTransactionDurability
          }));
          idbtrans.onerror = wrap(function(ev) {
            preventDefault(ev);
            _this._reject(idbtrans.error);
          });
          idbtrans.onabort = wrap(function(ev) {
            preventDefault(ev);
            _this.active && _this._reject(new exceptions.Abort(idbtrans.error));
            _this.active = false;
            _this.on("abort").fire(ev);
          });
          idbtrans.oncomplete = wrap(function() {
            _this.active = false;
            _this._resolve();
            if ("mutatedParts" in idbtrans) {
              globalEvents.storagemutated.fire(idbtrans["mutatedParts"]);
            }
          });
          return this;
        };
        Transaction2.prototype._promise = function(mode, fn, bWriteLock) {
          var _this = this;
          if (mode === "readwrite" && this.mode !== "readwrite")
            return rejection(new exceptions.ReadOnly("Transaction is readonly"));
          if (!this.active)
            return rejection(new exceptions.TransactionInactive());
          if (this._locked()) {
            return new DexiePromise(function(resolve, reject) {
              _this._blockedFuncs.push([
                function() {
                  _this._promise(mode, fn, bWriteLock).then(resolve, reject);
                },
                PSD
              ]);
            });
          } else if (bWriteLock) {
            return newScope(function() {
              var p2 = new DexiePromise(function(resolve, reject) {
                _this._lock();
                var rv = fn(resolve, reject, _this);
                if (rv && rv.then)
                  rv.then(resolve, reject);
              });
              p2.finally(function() {
                return _this._unlock();
              });
              p2._lib = true;
              return p2;
            });
          } else {
            var p = new DexiePromise(function(resolve, reject) {
              var rv = fn(resolve, reject, _this);
              if (rv && rv.then)
                rv.then(resolve, reject);
            });
            p._lib = true;
            return p;
          }
        };
        Transaction2.prototype._root = function() {
          return this.parent ? this.parent._root() : this;
        };
        Transaction2.prototype.waitFor = function(promiseLike) {
          var root = this._root();
          var promise = DexiePromise.resolve(promiseLike);
          if (root._waitingFor) {
            root._waitingFor = root._waitingFor.then(function() {
              return promise;
            });
          } else {
            root._waitingFor = promise;
            root._waitingQueue = [];
            var store = root.idbtrans.objectStore(root.storeNames[0]);
            (function spin() {
              ++root._spinCount;
              while (root._waitingQueue.length)
                root._waitingQueue.shift()();
              if (root._waitingFor)
                store.get(-Infinity).onsuccess = spin;
            })();
          }
          var currentWaitPromise = root._waitingFor;
          return new DexiePromise(function(resolve, reject) {
            promise.then(function(res) {
              return root._waitingQueue.push(wrap(resolve.bind(null, res)));
            }, function(err) {
              return root._waitingQueue.push(wrap(reject.bind(null, err)));
            }).finally(function() {
              if (root._waitingFor === currentWaitPromise) {
                root._waitingFor = null;
              }
            });
          });
        };
        Transaction2.prototype.abort = function() {
          if (this.active) {
            this.active = false;
            if (this.idbtrans)
              this.idbtrans.abort();
            this._reject(new exceptions.Abort());
          }
        };
        Transaction2.prototype.table = function(tableName) {
          var memoizedTables = this._memoizedTables || (this._memoizedTables = {});
          if (hasOwn(memoizedTables, tableName))
            return memoizedTables[tableName];
          var tableSchema = this.schema[tableName];
          if (!tableSchema) {
            throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
          }
          var transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
          transactionBoundTable.core = this.db.core.table(tableName);
          memoizedTables[tableName] = transactionBoundTable;
          return transactionBoundTable;
        };
        return Transaction2;
      })();
      function createTransactionConstructor(db) {
        return makeClassConstructor(Transaction.prototype, function Transaction2(mode, storeNames, dbschema, chromeTransactionDurability, parent) {
          var _this = this;
          if (mode !== "readonly")
            storeNames.forEach(function(storeName) {
              var _a2;
              var yProps = (_a2 = dbschema[storeName]) === null || _a2 === void 0 ? void 0 : _a2.yProps;
              if (yProps)
                storeNames = storeNames.concat(yProps.map(function(p) {
                  return p.updatesTable;
                }));
            });
          this.db = db;
          this.mode = mode;
          this.storeNames = storeNames;
          this.schema = dbschema;
          this.chromeTransactionDurability = chromeTransactionDurability;
          this.idbtrans = null;
          this.on = Events(this, "complete", "error", "abort");
          this.parent = parent || null;
          this.active = true;
          this._reculock = 0;
          this._blockedFuncs = [];
          this._resolve = null;
          this._reject = null;
          this._waitingFor = null;
          this._waitingQueue = null;
          this._spinCount = 0;
          this._completion = new DexiePromise(function(resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
          });
          this._completion.then(function() {
            _this.active = false;
            _this.on.complete.fire();
          }, function(e) {
            var wasActive = _this.active;
            _this.active = false;
            _this.on.error.fire(e);
            _this.parent ? _this.parent._reject(e) : wasActive && _this.idbtrans && _this.idbtrans.abort();
            return rejection(e);
          });
        });
      }
      function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey, type2) {
        return {
          name,
          keyPath,
          unique,
          multi,
          auto,
          compound,
          src: (unique && !isPrimKey ? "&" : "") + (multi ? "*" : "") + (auto ? "++" : "") + nameFromKeyPath(keyPath),
          type: type2
        };
      }
      function nameFromKeyPath(keyPath) {
        return typeof keyPath === "string" ? keyPath : keyPath ? "[" + [].join.call(keyPath, "+") + "]" : "";
      }
      function createTableSchema(name, primKey, indexes) {
        return {
          name,
          primKey,
          indexes,
          mappedClass: null,
          idxByName: arrayToObject(indexes, function(index) {
            return [index.name, index];
          })
        };
      }
      function safariMultiStoreFix(storeNames) {
        return storeNames.length === 1 ? storeNames[0] : storeNames;
      }
      var getMaxKey = function(IdbKeyRange) {
        try {
          IdbKeyRange.only([[]]);
          getMaxKey = function() {
            return [[]];
          };
          return [[]];
        } catch (e) {
          getMaxKey = function() {
            return maxString;
          };
          return maxString;
        }
      };
      function getKeyExtractor(keyPath) {
        if (keyPath == null) {
          return function() {
            return void 0;
          };
        } else if (typeof keyPath === "string") {
          return getSinglePathKeyExtractor(keyPath);
        } else {
          return function(obj) {
            return getByKeyPath(obj, keyPath);
          };
        }
      }
      function getSinglePathKeyExtractor(keyPath) {
        var split = keyPath.split(".");
        if (split.length === 1) {
          return function(obj) {
            return obj[keyPath];
          };
        } else {
          return function(obj) {
            return getByKeyPath(obj, keyPath);
          };
        }
      }
      function arrayify(arrayLike) {
        return [].slice.call(arrayLike);
      }
      var _id_counter = 0;
      function getKeyPathAlias(keyPath) {
        return keyPath == null ? ":id" : typeof keyPath === "string" ? keyPath : "[".concat(keyPath.join("+"), "]");
      }
      function createDBCore(db, IdbKeyRange, tmpTrans) {
        function extractSchema(db2, trans) {
          var tables2 = arrayify(db2.objectStoreNames);
          var tempStore = tables2.length > 0 ? trans.objectStore(tables2[0]) : {};
          return {
            schema: {
              name: db2.name,
              tables: tables2.map(function(table) {
                return trans.objectStore(table);
              }).map(function(store) {
                var keyPath = store.keyPath, autoIncrement = store.autoIncrement;
                var compound = isArray(keyPath);
                var outbound = keyPath == null;
                var indexByKeyPath = {};
                var result = {
                  name: store.name,
                  primaryKey: {
                    name: null,
                    isPrimaryKey: true,
                    outbound,
                    compound,
                    keyPath,
                    autoIncrement,
                    unique: true,
                    extractKey: getKeyExtractor(keyPath)
                  },
                  indexes: arrayify(store.indexNames).map(function(indexName) {
                    return store.index(indexName);
                  }).map(function(index) {
                    var name = index.name, unique = index.unique, multiEntry = index.multiEntry, keyPath2 = index.keyPath;
                    var compound2 = isArray(keyPath2);
                    var result2 = {
                      name,
                      compound: compound2,
                      keyPath: keyPath2,
                      unique,
                      multiEntry,
                      extractKey: getKeyExtractor(keyPath2)
                    };
                    indexByKeyPath[getKeyPathAlias(keyPath2)] = result2;
                    return result2;
                  }),
                  getIndexByKeyPath: function(keyPath2) {
                    return indexByKeyPath[getKeyPathAlias(keyPath2)];
                  }
                };
                indexByKeyPath[":id"] = result.primaryKey;
                if (keyPath != null) {
                  indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
                }
                return result;
              })
            },
            hasGetAll: tables2.length > 0 && "getAll" in tempStore && !(typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604),
            hasIdb3Features: "getAllRecords" in tempStore
          };
        }
        function makeIDBKeyRange(range) {
          if (range.type === 3)
            return null;
          if (range.type === 4)
            throw new Error("Cannot convert never type to IDBKeyRange");
          var lower = range.lower, upper = range.upper, lowerOpen = range.lowerOpen, upperOpen = range.upperOpen;
          var idbRange = lower === void 0 ? upper === void 0 ? null : IdbKeyRange.upperBound(upper, !!upperOpen) : upper === void 0 ? IdbKeyRange.lowerBound(lower, !!lowerOpen) : IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
          return idbRange;
        }
        function createDbCoreTable(tableSchema) {
          var tableName = tableSchema.name;
          function mutate(_a3) {
            var trans = _a3.trans, type2 = _a3.type, keys2 = _a3.keys, values = _a3.values, range = _a3.range;
            return new Promise(function(resolve, reject) {
              resolve = wrap(resolve);
              var store = trans.objectStore(tableName);
              var outbound = store.keyPath == null;
              var isAddOrPut = type2 === "put" || type2 === "add";
              if (!isAddOrPut && type2 !== "delete" && type2 !== "deleteRange")
                throw new Error("Invalid operation type: " + type2);
              var length = (keys2 || values || { length: 1 }).length;
              if (keys2 && values && keys2.length !== values.length) {
                throw new Error("Given keys array must have same length as given values array.");
              }
              if (length === 0)
                return resolve({
                  numFailures: 0,
                  failures: {},
                  results: [],
                  lastResult: void 0
                });
              var req;
              var reqs = [];
              var failures = [];
              var numFailures = 0;
              var errorHandler = function(event) {
                ++numFailures;
                preventDefault(event);
              };
              if (type2 === "deleteRange") {
                if (range.type === 4)
                  return resolve({
                    numFailures,
                    failures,
                    results: [],
                    lastResult: void 0
                  });
                if (range.type === 3)
                  reqs.push(req = store.clear());
                else
                  reqs.push(req = store.delete(makeIDBKeyRange(range)));
              } else {
                var _a4 = isAddOrPut ? outbound ? [values, keys2] : [values, null] : [keys2, null], args1 = _a4[0], args2 = _a4[1];
                if (isAddOrPut) {
                  for (var i = 0; i < length; ++i) {
                    reqs.push(req = args2 && args2[i] !== void 0 ? store[type2](args1[i], args2[i]) : store[type2](args1[i]));
                    req.onerror = errorHandler;
                  }
                } else {
                  for (var i = 0; i < length; ++i) {
                    reqs.push(req = store[type2](args1[i]));
                    req.onerror = errorHandler;
                  }
                }
              }
              var done = function(event) {
                var lastResult = event.target.result;
                reqs.forEach(function(req2, i2) {
                  return req2.error != null && (failures[i2] = req2.error);
                });
                resolve({
                  numFailures,
                  failures,
                  results: type2 === "delete" ? keys2 : reqs.map(function(req2) {
                    return req2.result;
                  }),
                  lastResult
                });
              };
              req.onerror = function(event) {
                errorHandler(event);
                done(event);
              };
              req.onsuccess = done;
            });
          }
          function openCursor2(_a3) {
            var trans = _a3.trans, values = _a3.values, query2 = _a3.query, reverse = _a3.reverse, unique = _a3.unique;
            return new Promise(function(resolve, reject) {
              resolve = wrap(resolve);
              var index = query2.index, range = query2.range;
              var store = trans.objectStore(tableName);
              var source = index.isPrimaryKey ? store : store.index(index.name);
              var direction = reverse ? unique ? "prevunique" : "prev" : unique ? "nextunique" : "next";
              var req = values || !("openKeyCursor" in source) ? source.openCursor(makeIDBKeyRange(range), direction) : source.openKeyCursor(makeIDBKeyRange(range), direction);
              req.onerror = eventRejectHandler(reject);
              req.onsuccess = wrap(function(ev) {
                var cursor = req.result;
                if (!cursor) {
                  resolve(null);
                  return;
                }
                cursor.___id = ++_id_counter;
                cursor.done = false;
                var _cursorContinue = cursor.continue.bind(cursor);
                var _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
                if (_cursorContinuePrimaryKey)
                  _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
                var _cursorAdvance = cursor.advance.bind(cursor);
                var doThrowCursorIsNotStarted = function() {
                  throw new Error("Cursor not started");
                };
                var doThrowCursorIsStopped = function() {
                  throw new Error("Cursor not stopped");
                };
                cursor.trans = trans;
                cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
                cursor.fail = wrap(reject);
                cursor.next = function() {
                  var _this = this;
                  var gotOne = 1;
                  return this.start(function() {
                    return gotOne-- ? _this.continue() : _this.stop();
                  }).then(function() {
                    return _this;
                  });
                };
                cursor.start = function(callback) {
                  var iterationPromise = new Promise(function(resolveIteration, rejectIteration) {
                    resolveIteration = wrap(resolveIteration);
                    req.onerror = eventRejectHandler(rejectIteration);
                    cursor.fail = rejectIteration;
                    cursor.stop = function(value) {
                      cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                      resolveIteration(value);
                    };
                  });
                  var guardedCallback = function() {
                    if (req.result) {
                      try {
                        callback();
                      } catch (err) {
                        cursor.fail(err);
                      }
                    } else {
                      cursor.done = true;
                      cursor.start = function() {
                        throw new Error("Cursor behind last entry");
                      };
                      cursor.stop();
                    }
                  };
                  req.onsuccess = wrap(function(ev2) {
                    req.onsuccess = guardedCallback;
                    guardedCallback();
                  });
                  cursor.continue = _cursorContinue;
                  cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
                  cursor.advance = _cursorAdvance;
                  guardedCallback();
                  return iterationPromise;
                };
                resolve(cursor);
              }, reject);
            });
          }
          function query(hasGetAll2, hasIdb3Features2) {
            return function(request) {
              return new Promise(function(resolve, reject) {
                var _a3;
                resolve = wrap(resolve);
                var trans = request.trans, values = request.values, limit = request.limit, query2 = request.query;
                var direction = (_a3 = request.direction) !== null && _a3 !== void 0 ? _a3 : "next";
                var nonInfinitLimit = limit === Infinity ? void 0 : limit;
                var index = query2.index, range = query2.range;
                var store = trans.objectStore(tableName);
                var source = index.isPrimaryKey ? store : store.index(index.name);
                var idbKeyRange = makeIDBKeyRange(range);
                if (limit === 0)
                  return resolve({ result: [] });
                if (hasIdb3Features2) {
                  var options = {
                    query: idbKeyRange,
                    count: nonInfinitLimit,
                    direction
                  };
                  var req = values ? source.getAll(options) : source.getAllKeys(options);
                  req.onsuccess = function(event) {
                    return resolve({ result: event.target.result });
                  };
                  req.onerror = eventRejectHandler(reject);
                } else if (hasGetAll2 && direction === "next") {
                  var req = values ? source.getAll(idbKeyRange, nonInfinitLimit) : source.getAllKeys(idbKeyRange, nonInfinitLimit);
                  req.onsuccess = function(event) {
                    return resolve({ result: event.target.result });
                  };
                  req.onerror = eventRejectHandler(reject);
                } else {
                  var count_1 = 0;
                  var req_1 = values || !("openKeyCursor" in source) ? source.openCursor(idbKeyRange, direction) : source.openKeyCursor(idbKeyRange, direction);
                  var result_1 = [];
                  req_1.onsuccess = function() {
                    var cursor = req_1.result;
                    if (!cursor)
                      return resolve({ result: result_1 });
                    result_1.push(values ? cursor.value : cursor.primaryKey);
                    if (++count_1 === limit)
                      return resolve({ result: result_1 });
                    cursor.continue();
                  };
                  req_1.onerror = eventRejectHandler(reject);
                }
              });
            };
          }
          return {
            name: tableName,
            schema: tableSchema,
            mutate,
            getMany: function(_a3) {
              var trans = _a3.trans, keys2 = _a3.keys;
              return new Promise(function(resolve, reject) {
                resolve = wrap(resolve);
                var store = trans.objectStore(tableName);
                var length = keys2.length;
                var result = new Array(length);
                var keyCount = 0;
                var callbackCount = 0;
                var req;
                var successHandler = function(event) {
                  var req2 = event.target;
                  if ((result[req2._pos] = req2.result) != null)
                    ;
                  if (++callbackCount === keyCount)
                    resolve(result);
                };
                var errorHandler = eventRejectHandler(reject);
                for (var i = 0; i < length; ++i) {
                  var key = keys2[i];
                  if (key != null) {
                    req = store.get(keys2[i]);
                    req._pos = i;
                    req.onsuccess = successHandler;
                    req.onerror = errorHandler;
                    ++keyCount;
                  }
                }
                if (keyCount === 0)
                  resolve(result);
              });
            },
            get: function(_a3) {
              var trans = _a3.trans, key = _a3.key;
              return new Promise(function(resolve, reject) {
                resolve = wrap(resolve);
                var store = trans.objectStore(tableName);
                var req = store.get(key);
                req.onsuccess = function(event) {
                  return resolve(event.target.result);
                };
                req.onerror = eventRejectHandler(reject);
              });
            },
            query: query(hasGetAll, hasIdb3Features),
            openCursor: openCursor2,
            count: function(_a3) {
              var query2 = _a3.query, trans = _a3.trans;
              var index = query2.index, range = query2.range;
              return new Promise(function(resolve, reject) {
                var store = trans.objectStore(tableName);
                var source = index.isPrimaryKey ? store : store.index(index.name);
                var idbKeyRange = makeIDBKeyRange(range);
                var req = idbKeyRange ? source.count(idbKeyRange) : source.count();
                req.onsuccess = wrap(function(ev) {
                  return resolve(ev.target.result);
                });
                req.onerror = eventRejectHandler(reject);
              });
            }
          };
        }
        var _a2 = extractSchema(db, tmpTrans), schema = _a2.schema, hasGetAll = _a2.hasGetAll, hasIdb3Features = _a2.hasIdb3Features;
        var tables = schema.tables.map(function(tableSchema) {
          return createDbCoreTable(tableSchema);
        });
        var tableMap = {};
        tables.forEach(function(table) {
          return tableMap[table.name] = table;
        });
        return {
          stack: "dbcore",
          transaction: db.transaction.bind(db),
          table: function(name) {
            var result = tableMap[name];
            if (!result)
              throw new Error("Table '".concat(name, "' not found"));
            return tableMap[name];
          },
          MIN_KEY: -Infinity,
          MAX_KEY: getMaxKey(IdbKeyRange),
          schema
        };
      }
      function createMiddlewareStack(stackImpl, middlewares) {
        return middlewares.reduce(function(down, _a2) {
          var create = _a2.create;
          return __assign(__assign({}, down), create(down));
        }, stackImpl);
      }
      function createMiddlewareStacks(middlewares, idbdb, _a2, tmpTrans) {
        var IDBKeyRange = _a2.IDBKeyRange;
        _a2.indexedDB;
        var dbcore = createMiddlewareStack(createDBCore(idbdb, IDBKeyRange, tmpTrans), middlewares.dbcore);
        return {
          dbcore
        };
      }
      function generateMiddlewareStacks(db, tmpTrans) {
        var idbdb = tmpTrans.db;
        var stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
        db.core = stacks.dbcore;
        db.tables.forEach(function(table) {
          var tableName = table.name;
          if (db.core.schema.tables.some(function(tbl) {
            return tbl.name === tableName;
          })) {
            table.core = db.core.table(tableName);
            if (db[tableName] instanceof db.Table) {
              db[tableName].core = table.core;
            }
          }
        });
      }
      function setApiOnPlace(db, objs, tableNames, dbschema) {
        tableNames.forEach(function(tableName) {
          var schema = dbschema[tableName];
          objs.forEach(function(obj) {
            var propDesc = getPropertyDescriptor(obj, tableName);
            if (!propDesc || "value" in propDesc && propDesc.value === void 0) {
              if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
                setProp(obj, tableName, {
                  get: function() {
                    return this.table(tableName);
                  },
                  set: function(value) {
                    defineProperty(this, tableName, {
                      value,
                      writable: true,
                      configurable: true,
                      enumerable: true
                    });
                  }
                });
              } else {
                obj[tableName] = new db.Table(tableName, schema);
              }
            }
          });
        });
      }
      function removeTablesApi(db, objs) {
        objs.forEach(function(obj) {
          for (var key in obj) {
            if (obj[key] instanceof db.Table)
              delete obj[key];
          }
        });
      }
      function lowerVersionFirst(a, b) {
        return a._cfg.version - b._cfg.version;
      }
      function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
        var globalSchema = db._dbSchema;
        if (idbUpgradeTrans.objectStoreNames.contains("$meta") && !globalSchema.$meta) {
          globalSchema.$meta = createTableSchema("$meta", parseIndexSyntax("")[0], []);
          db._storeNames.push("$meta");
        }
        var trans = db._createTransaction("readwrite", db._storeNames, globalSchema);
        trans.create(idbUpgradeTrans);
        trans._completion.catch(reject);
        var rejectTransaction = trans._reject.bind(trans);
        var transless = PSD.transless || PSD;
        newScope(function() {
          PSD.trans = trans;
          PSD.transless = transless;
          if (oldVersion === 0) {
            keys(globalSchema).forEach(function(tableName) {
              createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
            });
            generateMiddlewareStacks(db, idbUpgradeTrans);
            DexiePromise.follow(function() {
              return db.on.populate.fire(trans);
            }).catch(rejectTransaction);
          } else {
            generateMiddlewareStacks(db, idbUpgradeTrans);
            return getExistingVersion(db, trans, oldVersion).then(function(oldVersion2) {
              return updateTablesAndIndexes(db, oldVersion2, trans, idbUpgradeTrans);
            }).catch(rejectTransaction);
          }
        });
      }
      function patchCurrentVersion(db, idbUpgradeTrans) {
        createMissingTables(db._dbSchema, idbUpgradeTrans);
        if (idbUpgradeTrans.db.version % 10 === 0 && !idbUpgradeTrans.objectStoreNames.contains("$meta")) {
          idbUpgradeTrans.db.createObjectStore("$meta").add(Math.ceil(idbUpgradeTrans.db.version / 10 - 1), "version");
        }
        var globalSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
        adjustToExistingIndexNames(db, db._dbSchema, idbUpgradeTrans);
        var diff = getSchemaDiff(globalSchema, db._dbSchema);
        var _loop_1 = function(tableChange2) {
          if (tableChange2.change.length || tableChange2.recreate) {
            console.warn("Unable to patch indexes of table ".concat(tableChange2.name, " because it has changes on the type of index or primary key."));
            return { value: void 0 };
          }
          var store = idbUpgradeTrans.objectStore(tableChange2.name);
          tableChange2.add.forEach(function(idx) {
            if (debug)
              console.debug("Dexie upgrade patch: Creating missing index ".concat(tableChange2.name, ".").concat(idx.src));
            addIndex(store, idx);
          });
        };
        for (var _i = 0, _a2 = diff.change; _i < _a2.length; _i++) {
          var tableChange = _a2[_i];
          var state_1 = _loop_1(tableChange);
          if (typeof state_1 === "object")
            return state_1.value;
        }
      }
      function getExistingVersion(db, trans, oldVersion) {
        if (trans.storeNames.includes("$meta")) {
          return trans.table("$meta").get("version").then(function(metaVersion) {
            return metaVersion != null ? metaVersion : oldVersion;
          });
        } else {
          return DexiePromise.resolve(oldVersion);
        }
      }
      function updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans) {
        var queue = [];
        var versions = db._versions;
        var globalSchema = db._dbSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
        var versToRun = versions.filter(function(v) {
          return v._cfg.version >= oldVersion;
        });
        if (versToRun.length === 0) {
          return DexiePromise.resolve();
        }
        versToRun.forEach(function(version) {
          queue.push(function() {
            var oldSchema = globalSchema;
            var newSchema = version._cfg.dbschema;
            adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
            adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
            globalSchema = db._dbSchema = newSchema;
            var diff = getSchemaDiff(oldSchema, newSchema);
            diff.add.forEach(function(tuple) {
              createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
            });
            diff.change.forEach(function(change) {
              if (change.recreate) {
                throw new exceptions.Upgrade("Not yet support for changing primary key");
              } else {
                var store_1 = idbUpgradeTrans.objectStore(change.name);
                change.add.forEach(function(idx) {
                  return addIndex(store_1, idx);
                });
                change.change.forEach(function(idx) {
                  store_1.deleteIndex(idx.name);
                  addIndex(store_1, idx);
                });
                change.del.forEach(function(idxName) {
                  return store_1.deleteIndex(idxName);
                });
              }
            });
            var contentUpgrade = version._cfg.contentUpgrade;
            if (contentUpgrade && version._cfg.version > oldVersion) {
              generateMiddlewareStacks(db, idbUpgradeTrans);
              trans._memoizedTables = {};
              var upgradeSchema_1 = shallowClone(newSchema);
              diff.del.forEach(function(table) {
                upgradeSchema_1[table] = oldSchema[table];
              });
              removeTablesApi(db, [db.Transaction.prototype]);
              setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema_1), upgradeSchema_1);
              trans.schema = upgradeSchema_1;
              var contentUpgradeIsAsync_1 = isAsyncFunction(contentUpgrade);
              if (contentUpgradeIsAsync_1) {
                incrementExpectedAwaits();
              }
              var returnValue_1;
              var promiseFollowed = DexiePromise.follow(function() {
                returnValue_1 = contentUpgrade(trans);
                if (returnValue_1) {
                  if (contentUpgradeIsAsync_1) {
                    var decrementor = decrementExpectedAwaits.bind(null, null);
                    returnValue_1.then(decrementor, decrementor);
                  }
                }
              });
              return returnValue_1 && typeof returnValue_1.then === "function" ? DexiePromise.resolve(returnValue_1) : promiseFollowed.then(function() {
                return returnValue_1;
              });
            }
          });
          queue.push(function(idbtrans) {
            var newSchema = version._cfg.dbschema;
            deleteRemovedTables(newSchema, idbtrans);
            removeTablesApi(db, [db.Transaction.prototype]);
            setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
            trans.schema = db._dbSchema;
          });
          queue.push(function(idbtrans) {
            if (db.idbdb.objectStoreNames.contains("$meta")) {
              if (Math.ceil(db.idbdb.version / 10) === version._cfg.version) {
                db.idbdb.deleteObjectStore("$meta");
                delete db._dbSchema.$meta;
                db._storeNames = db._storeNames.filter(function(name) {
                  return name !== "$meta";
                });
              } else {
                idbtrans.objectStore("$meta").put(version._cfg.version, "version");
              }
            }
          });
        });
        function runQueue() {
          return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) : DexiePromise.resolve();
        }
        return runQueue().then(function() {
          createMissingTables(globalSchema, idbUpgradeTrans);
        });
      }
      function getSchemaDiff(oldSchema, newSchema) {
        var diff = {
          del: [],
          add: [],
          change: []
        };
        var table;
        for (table in oldSchema) {
          if (!newSchema[table])
            diff.del.push(table);
        }
        for (table in newSchema) {
          var oldDef = oldSchema[table], newDef = newSchema[table];
          if (!oldDef) {
            diff.add.push([table, newDef]);
          } else {
            var change = {
              name: table,
              def: newDef,
              recreate: false,
              del: [],
              add: [],
              change: []
            };
            if ("" + (oldDef.primKey.keyPath || "") !== "" + (newDef.primKey.keyPath || "") || oldDef.primKey.auto !== newDef.primKey.auto) {
              change.recreate = true;
              diff.change.push(change);
            } else {
              var oldIndexes = oldDef.idxByName;
              var newIndexes = newDef.idxByName;
              var idxName = void 0;
              for (idxName in oldIndexes) {
                if (!newIndexes[idxName])
                  change.del.push(idxName);
              }
              for (idxName in newIndexes) {
                var oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
                if (!oldIdx)
                  change.add.push(newIdx);
                else if (oldIdx.src !== newIdx.src)
                  change.change.push(newIdx);
              }
              if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
                diff.change.push(change);
              }
            }
          }
        }
        return diff;
      }
      function createTable(idbtrans, tableName, primKey, indexes) {
        var store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ? { keyPath: primKey.keyPath, autoIncrement: primKey.auto } : { autoIncrement: primKey.auto });
        indexes.forEach(function(idx) {
          return addIndex(store, idx);
        });
        return store;
      }
      function createMissingTables(newSchema, idbtrans) {
        keys(newSchema).forEach(function(tableName) {
          if (!idbtrans.db.objectStoreNames.contains(tableName)) {
            if (debug)
              console.debug("Dexie: Creating missing table", tableName);
            createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
          }
        });
      }
      function deleteRemovedTables(newSchema, idbtrans) {
        [].slice.call(idbtrans.db.objectStoreNames).forEach(function(storeName) {
          return newSchema[storeName] == null && idbtrans.db.deleteObjectStore(storeName);
        });
      }
      function addIndex(store, idx) {
        store.createIndex(idx.name, idx.keyPath, {
          unique: idx.unique,
          multiEntry: idx.multi
        });
      }
      function buildGlobalSchema(db, idbdb, tmpTrans) {
        var globalSchema = {};
        var dbStoreNames = slice(idbdb.objectStoreNames, 0);
        dbStoreNames.forEach(function(storeName) {
          var store = tmpTrans.objectStore(storeName);
          var keyPath = store.keyPath;
          var primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", true, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
          var indexes = [];
          for (var j = 0; j < store.indexNames.length; ++j) {
            var idbindex = store.index(store.indexNames[j]);
            keyPath = idbindex.keyPath;
            var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
            indexes.push(index);
          }
          globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
        });
        return globalSchema;
      }
      function readGlobalSchema(db, idbdb, tmpTrans) {
        db.verno = idbdb.version / 10;
        var globalSchema = db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans);
        db._storeNames = slice(idbdb.objectStoreNames, 0);
        setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
      }
      function verifyInstalledSchema(db, tmpTrans) {
        var installedSchema = buildGlobalSchema(db, db.idbdb, tmpTrans);
        var diff = getSchemaDiff(installedSchema, db._dbSchema);
        return !(diff.add.length || diff.change.some(function(ch) {
          return ch.add.length || ch.change.length;
        }));
      }
      function adjustToExistingIndexNames(db, schema, idbtrans) {
        var storeNames = idbtrans.db.objectStoreNames;
        for (var i = 0; i < storeNames.length; ++i) {
          var storeName = storeNames[i];
          var store = idbtrans.objectStore(storeName);
          db._hasGetAll = "getAll" in store;
          for (var j = 0; j < store.indexNames.length; ++j) {
            var indexName = store.indexNames[j];
            var keyPath = store.index(indexName).keyPath;
            var dexieName = typeof keyPath === "string" ? keyPath : "[" + slice(keyPath).join("+") + "]";
            if (schema[storeName]) {
              var indexSpec = schema[storeName].idxByName[dexieName];
              if (indexSpec) {
                indexSpec.name = indexName;
                delete schema[storeName].idxByName[dexieName];
                schema[storeName].idxByName[indexName] = indexSpec;
              }
            }
          }
        }
        if (typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
          db._hasGetAll = false;
        }
      }
      function parseIndexSyntax(primKeyAndIndexes) {
        return primKeyAndIndexes.split(",").map(function(index, indexNum) {
          var _a2;
          var typeSplit = index.split(":");
          var type2 = (_a2 = typeSplit[1]) === null || _a2 === void 0 ? void 0 : _a2.trim();
          index = typeSplit[0].trim();
          var name = index.replace(/([&*]|\+\+)/g, "");
          var keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split("+") : name;
          return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0, type2);
        });
      }
      var Version = (function() {
        function Version2() {
        }
        Version2.prototype._createTableSchema = function(name, primKey, indexes) {
          return createTableSchema(name, primKey, indexes);
        };
        Version2.prototype._parseIndexSyntax = function(primKeyAndIndexes) {
          return parseIndexSyntax(primKeyAndIndexes);
        };
        Version2.prototype._parseStoresSpec = function(stores, outSchema) {
          var _this = this;
          keys(stores).forEach(function(tableName) {
            if (stores[tableName] !== null) {
              var indexes = _this._parseIndexSyntax(stores[tableName]);
              var primKey = indexes.shift();
              if (!primKey) {
                throw new exceptions.Schema("Invalid schema for table " + tableName + ": " + stores[tableName]);
              }
              primKey.unique = true;
              if (primKey.multi)
                throw new exceptions.Schema("Primary key cannot be multiEntry*");
              indexes.forEach(function(idx) {
                if (idx.auto)
                  throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
                if (!idx.keyPath)
                  throw new exceptions.Schema("Index must have a name and cannot be an empty string");
              });
              var tblSchema = _this._createTableSchema(tableName, primKey, indexes);
              outSchema[tableName] = tblSchema;
            }
          });
        };
        Version2.prototype.stores = function(stores) {
          var db = this.db;
          this._cfg.storesSource = this._cfg.storesSource ? extend(this._cfg.storesSource, stores) : stores;
          var versions = db._versions;
          var storesSpec = {};
          var dbschema = {};
          versions.forEach(function(version) {
            extend(storesSpec, version._cfg.storesSource);
            dbschema = version._cfg.dbschema = {};
            version._parseStoresSpec(storesSpec, dbschema);
          });
          db._dbSchema = dbschema;
          removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
          setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
          db._storeNames = keys(dbschema);
          return this;
        };
        Version2.prototype.upgrade = function(upgradeFunction) {
          this._cfg.contentUpgrade = promisableChain(this._cfg.contentUpgrade || nop, upgradeFunction);
          return this;
        };
        return Version2;
      })();
      function createVersionConstructor(db) {
        return makeClassConstructor(Version.prototype, function Version2(versionNumber) {
          this.db = db;
          this._cfg = {
            version: versionNumber,
            storesSource: null,
            dbschema: {},
            tables: {},
            contentUpgrade: null
          };
        });
      }
      var connections = createConnectionsManager();
      function createConnectionsManager() {
        if (typeof FinalizationRegistry !== "undefined" && typeof WeakRef !== "undefined") {
          var _refs_1 = /* @__PURE__ */ new Set();
          var _registry_1 = new FinalizationRegistry(function(ref) {
            _refs_1.delete(ref);
          });
          var toArray = function() {
            return Array.from(_refs_1).map(function(ref) {
              return ref.deref();
            }).filter(function(db) {
              return db !== void 0;
            });
          };
          var add3 = function(db) {
            var ref = new WeakRef(db._novip);
            _refs_1.add(ref);
            _registry_1.register(db._novip, ref, ref);
            if (_refs_1.size > db._options.maxConnections) {
              var oldestRef = _refs_1.values().next().value;
              _refs_1.delete(oldestRef);
              _registry_1.unregister(oldestRef);
            }
          };
          var remove3 = function(db) {
            if (!db)
              return;
            var iterator = _refs_1.values();
            var result = iterator.next();
            while (!result.done) {
              var ref = result.value;
              if (ref.deref() === db._novip) {
                _refs_1.delete(ref);
                _registry_1.unregister(ref);
                return;
              }
              result = iterator.next();
            }
          };
          return { toArray, add: add3, remove: remove3 };
        } else {
          var connections_1 = [];
          var toArray = function() {
            return connections_1;
          };
          var add3 = function(db) {
            connections_1.push(db._novip);
          };
          var remove3 = function(db) {
            if (!db)
              return;
            var index = connections_1.indexOf(db._novip);
            if (index !== -1) {
              connections_1.splice(index, 1);
            }
          };
          return { toArray, add: add3, remove: remove3 };
        }
      }
      function getDbNamesTable(indexedDB2, IDBKeyRange) {
        var dbNamesDB = indexedDB2["_dbNamesDB"];
        if (!dbNamesDB) {
          dbNamesDB = indexedDB2["_dbNamesDB"] = new Dexie$1(DBNAMES_DB, {
            addons: [],
            indexedDB: indexedDB2,
            IDBKeyRange
          });
          dbNamesDB.version(1).stores({ dbnames: "name" });
        }
        return dbNamesDB.table("dbnames");
      }
      function hasDatabasesNative(indexedDB2) {
        return indexedDB2 && typeof indexedDB2.databases === "function";
      }
      function getDatabaseNames(_a2) {
        var indexedDB2 = _a2.indexedDB, IDBKeyRange = _a2.IDBKeyRange;
        return hasDatabasesNative(indexedDB2) ? Promise.resolve(indexedDB2.databases()).then(function(infos) {
          return infos.map(function(info) {
            return info.name;
          }).filter(function(name) {
            return name !== DBNAMES_DB;
          });
        }) : getDbNamesTable(indexedDB2, IDBKeyRange).toCollection().primaryKeys();
      }
      function _onDatabaseCreated(_a2, name) {
        var indexedDB2 = _a2.indexedDB, IDBKeyRange = _a2.IDBKeyRange;
        !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange).put({ name }).catch(nop);
      }
      function _onDatabaseDeleted(_a2, name) {
        var indexedDB2 = _a2.indexedDB, IDBKeyRange = _a2.IDBKeyRange;
        !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange).delete(name).catch(nop);
      }
      function vip(fn) {
        return newScope(function() {
          PSD.letThrough = true;
          return fn();
        });
      }
      function idbReady() {
        var isSafari = !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent);
        if (!isSafari || !indexedDB.databases)
          return Promise.resolve();
        var intervalId;
        return new Promise(function(resolve) {
          var tryIdb = function() {
            return indexedDB.databases().finally(resolve);
          };
          intervalId = setInterval(tryIdb, 100);
          tryIdb();
        }).finally(function() {
          return clearInterval(intervalId);
        });
      }
      var _a;
      function isEmptyRange(node) {
        return !("from" in node);
      }
      var RangeSet2 = function(fromOrTree, to) {
        if (this) {
          extend(this, arguments.length ? { d: 1, from: fromOrTree, to: arguments.length > 1 ? to : fromOrTree } : { d: 0 });
        } else {
          var rv = new RangeSet2();
          if (fromOrTree && "d" in fromOrTree) {
            extend(rv, fromOrTree);
          }
          return rv;
        }
      };
      props(RangeSet2.prototype, (_a = {
        add: function(rangeSet) {
          mergeRanges2(this, rangeSet);
          return this;
        },
        addKey: function(key) {
          addRange(this, key, key);
          return this;
        },
        addKeys: function(keys2) {
          var _this = this;
          keys2.forEach(function(key) {
            return addRange(_this, key, key);
          });
          return this;
        },
        hasKey: function(key) {
          var node = getRangeSetIterator(this).next(key).value;
          return node && cmp2(node.from, key) <= 0 && cmp2(node.to, key) >= 0;
        }
      }, _a[iteratorSymbol] = function() {
        return getRangeSetIterator(this);
      }, _a));
      function addRange(target, from, to) {
        var diff = cmp2(from, to);
        if (isNaN(diff))
          return;
        if (diff > 0)
          throw RangeError();
        if (isEmptyRange(target))
          return extend(target, { from, to, d: 1 });
        var left = target.l;
        var right = target.r;
        if (cmp2(to, target.from) < 0) {
          left ? addRange(left, from, to) : target.l = { from, to, d: 1, l: null, r: null };
          return rebalance(target);
        }
        if (cmp2(from, target.to) > 0) {
          right ? addRange(right, from, to) : target.r = { from, to, d: 1, l: null, r: null };
          return rebalance(target);
        }
        if (cmp2(from, target.from) < 0) {
          target.from = from;
          target.l = null;
          target.d = right ? right.d + 1 : 1;
        }
        if (cmp2(to, target.to) > 0) {
          target.to = to;
          target.r = null;
          target.d = target.l ? target.l.d + 1 : 1;
        }
        var rightWasCutOff = !target.r;
        if (left && !target.l) {
          mergeRanges2(target, left);
        }
        if (right && rightWasCutOff) {
          mergeRanges2(target, right);
        }
      }
      function mergeRanges2(target, newSet) {
        function _addRangeSet(target2, _a2) {
          var from = _a2.from, to = _a2.to, l = _a2.l, r = _a2.r;
          addRange(target2, from, to);
          if (l)
            _addRangeSet(target2, l);
          if (r)
            _addRangeSet(target2, r);
        }
        if (!isEmptyRange(newSet))
          _addRangeSet(target, newSet);
      }
      function rangesOverlap2(rangeSet1, rangeSet2) {
        var i1 = getRangeSetIterator(rangeSet2);
        var nextResult1 = i1.next();
        if (nextResult1.done)
          return false;
        var a = nextResult1.value;
        var i2 = getRangeSetIterator(rangeSet1);
        var nextResult2 = i2.next(a.from);
        var b = nextResult2.value;
        while (!nextResult1.done && !nextResult2.done) {
          if (cmp2(b.from, a.to) <= 0 && cmp2(b.to, a.from) >= 0)
            return true;
          cmp2(a.from, b.from) < 0 ? a = (nextResult1 = i1.next(b.from)).value : b = (nextResult2 = i2.next(a.from)).value;
        }
        return false;
      }
      function getRangeSetIterator(node) {
        var state = isEmptyRange(node) ? null : { s: 0, n: node };
        return {
          next: function(key) {
            var keyProvided = arguments.length > 0;
            while (state) {
              switch (state.s) {
                case 0:
                  state.s = 1;
                  if (keyProvided) {
                    while (state.n.l && cmp2(key, state.n.from) < 0)
                      state = { up: state, n: state.n.l, s: 1 };
                  } else {
                    while (state.n.l)
                      state = { up: state, n: state.n.l, s: 1 };
                  }
                case 1:
                  state.s = 2;
                  if (!keyProvided || cmp2(key, state.n.to) <= 0)
                    return { value: state.n, done: false };
                case 2:
                  if (state.n.r) {
                    state.s = 3;
                    state = { up: state, n: state.n.r, s: 0 };
                    continue;
                  }
                case 3:
                  state = state.up;
              }
            }
            return { done: true };
          }
        };
      }
      function rebalance(target) {
        var _a2, _b;
        var diff = (((_a2 = target.r) === null || _a2 === void 0 ? void 0 : _a2.d) || 0) - (((_b = target.l) === null || _b === void 0 ? void 0 : _b.d) || 0);
        var r = diff > 1 ? "r" : diff < -1 ? "l" : "";
        if (r) {
          var l = r === "r" ? "l" : "r";
          var rootClone = __assign({}, target);
          var oldRootRight = target[r];
          target.from = oldRootRight.from;
          target.to = oldRootRight.to;
          target[r] = oldRootRight[r];
          rootClone[r] = oldRootRight[l];
          target[l] = rootClone;
          rootClone.d = computeDepth(rootClone);
        }
        target.d = computeDepth(target);
      }
      function computeDepth(_a2) {
        var r = _a2.r, l = _a2.l;
        return (r ? l ? Math.max(r.d, l.d) : r.d : l ? l.d : 0) + 1;
      }
      function extendObservabilitySet(target, newSet) {
        keys(newSet).forEach(function(part) {
          if (target[part])
            mergeRanges2(target[part], newSet[part]);
          else
            target[part] = cloneSimpleObjectTree(newSet[part]);
        });
        return target;
      }
      function obsSetsOverlap(os1, os2) {
        return os1.all || os2.all || Object.keys(os1).some(function(key) {
          return os2[key] && rangesOverlap2(os2[key], os1[key]);
        });
      }
      var cache = {};
      var unsignaledParts = {};
      var isTaskEnqueued = false;
      function signalSubscribersLazily(part, optimistic) {
        extendObservabilitySet(unsignaledParts, part);
        if (!isTaskEnqueued) {
          isTaskEnqueued = true;
          setTimeout(function() {
            isTaskEnqueued = false;
            var parts = unsignaledParts;
            unsignaledParts = {};
            signalSubscribersNow(parts, false);
          }, 0);
        }
      }
      function signalSubscribersNow(updatedParts, deleteAffectedCacheEntries) {
        if (deleteAffectedCacheEntries === void 0) {
          deleteAffectedCacheEntries = false;
        }
        var queriesToSignal = /* @__PURE__ */ new Set();
        if (updatedParts.all) {
          for (var _i = 0, _a2 = Object.values(cache); _i < _a2.length; _i++) {
            var tblCache = _a2[_i];
            collectTableSubscribers(tblCache, updatedParts, queriesToSignal, deleteAffectedCacheEntries);
          }
        } else {
          for (var key in updatedParts) {
            var parts = /^idb\:\/\/(.*)\/(.*)\//.exec(key);
            if (parts) {
              var dbName = parts[1], tableName = parts[2];
              var tblCache = cache["idb://".concat(dbName, "/").concat(tableName)];
              if (tblCache)
                collectTableSubscribers(tblCache, updatedParts, queriesToSignal, deleteAffectedCacheEntries);
            }
          }
        }
        queriesToSignal.forEach(function(requery) {
          return requery();
        });
      }
      function collectTableSubscribers(tblCache, updatedParts, outQueriesToSignal, deleteAffectedCacheEntries) {
        var updatedEntryLists = [];
        for (var _i = 0, _a2 = Object.entries(tblCache.queries.query); _i < _a2.length; _i++) {
          var _b = _a2[_i], indexName = _b[0], entries = _b[1];
          var filteredEntries = [];
          for (var _c = 0, entries_1 = entries; _c < entries_1.length; _c++) {
            var entry = entries_1[_c];
            if (obsSetsOverlap(updatedParts, entry.obsSet)) {
              entry.subscribers.forEach(function(requery) {
                return outQueriesToSignal.add(requery);
              });
            } else if (deleteAffectedCacheEntries) {
              filteredEntries.push(entry);
            }
          }
          if (deleteAffectedCacheEntries)
            updatedEntryLists.push([indexName, filteredEntries]);
        }
        if (deleteAffectedCacheEntries) {
          for (var _d = 0, updatedEntryLists_1 = updatedEntryLists; _d < updatedEntryLists_1.length; _d++) {
            var _e = updatedEntryLists_1[_d], indexName = _e[0], filteredEntries = _e[1];
            tblCache.queries.query[indexName] = filteredEntries;
          }
        }
      }
      function dexieOpen(db) {
        var state = db._state;
        var indexedDB2 = db._deps.indexedDB;
        if (state.isBeingOpened || db.idbdb)
          return state.dbReadyPromise.then(function() {
            return state.dbOpenError ? rejection(state.dbOpenError) : db;
          });
        state.isBeingOpened = true;
        state.dbOpenError = null;
        state.openComplete = false;
        var openCanceller = state.openCanceller;
        var nativeVerToOpen = Math.round(db.verno * 10);
        var schemaPatchMode = false;
        function throwIfCancelled() {
          if (state.openCanceller !== openCanceller)
            throw new exceptions.DatabaseClosed("db.open() was cancelled");
        }
        var resolveDbReady = state.dbReadyResolve, upgradeTransaction = null, wasCreated = false;
        var tryOpenDB = function() {
          return new DexiePromise(function(resolve, reject) {
            throwIfCancelled();
            if (!indexedDB2)
              throw new exceptions.MissingAPI();
            var dbName = db.name;
            var req = state.autoSchema || !nativeVerToOpen ? indexedDB2.open(dbName) : indexedDB2.open(dbName, nativeVerToOpen);
            if (!req)
              throw new exceptions.MissingAPI();
            req.onerror = eventRejectHandler(reject);
            req.onblocked = wrap(db._fireOnBlocked);
            req.onupgradeneeded = wrap(function(e) {
              upgradeTransaction = req.transaction;
              if (state.autoSchema && !db._options.allowEmptyDB) {
                req.onerror = preventDefault;
                upgradeTransaction.abort();
                req.result.close();
                var delreq = indexedDB2.deleteDatabase(dbName);
                delreq.onsuccess = delreq.onerror = wrap(function() {
                  reject(new exceptions.NoSuchDatabase("Database ".concat(dbName, " doesnt exist")));
                });
              } else {
                upgradeTransaction.onerror = eventRejectHandler(reject);
                var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
                wasCreated = oldVer < 1;
                db.idbdb = req.result;
                if (schemaPatchMode) {
                  patchCurrentVersion(db, upgradeTransaction);
                }
                runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
              }
            }, reject);
            req.onsuccess = wrap(function() {
              upgradeTransaction = null;
              var idbdb = db.idbdb = req.result;
              var objectStoreNames = slice(idbdb.objectStoreNames);
              if (objectStoreNames.length > 0)
                try {
                  var tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), "readonly");
                  if (state.autoSchema)
                    readGlobalSchema(db, idbdb, tmpTrans);
                  else {
                    adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
                    if (!verifyInstalledSchema(db, tmpTrans) && !schemaPatchMode) {
                      console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this.");
                      idbdb.close();
                      nativeVerToOpen = idbdb.version + 1;
                      schemaPatchMode = true;
                      return resolve(tryOpenDB());
                    }
                  }
                  generateMiddlewareStacks(db, tmpTrans);
                } catch (e) {
                }
              connections.add(db);
              idbdb.onversionchange = wrap(function(ev) {
                state.vcFired = true;
                db.on("versionchange").fire(ev);
              });
              idbdb.onclose = wrap(function() {
                db.close({ disableAutoOpen: false });
              });
              if (wasCreated)
                _onDatabaseCreated(db._deps, dbName);
              resolve();
            }, reject);
          }).catch(function(err) {
            switch (err === null || err === void 0 ? void 0 : err.name) {
              case "UnknownError":
                if (state.PR1398_maxLoop > 0) {
                  state.PR1398_maxLoop--;
                  console.warn("Dexie: Workaround for Chrome UnknownError on open()");
                  return tryOpenDB();
                }
                break;
              case "VersionError":
                if (nativeVerToOpen > 0) {
                  nativeVerToOpen = 0;
                  return tryOpenDB();
                }
                break;
            }
            return DexiePromise.reject(err);
          });
        };
        return DexiePromise.race([
          openCanceller,
          (typeof navigator === "undefined" ? DexiePromise.resolve() : idbReady()).then(tryOpenDB)
        ]).then(function() {
          throwIfCancelled();
          state.onReadyBeingFired = [];
          return DexiePromise.resolve(vip(function() {
            return db.on.ready.fire(db.vip);
          })).then(function fireRemainders() {
            if (state.onReadyBeingFired.length > 0) {
              var remainders_1 = state.onReadyBeingFired.reduce(promisableChain, nop);
              state.onReadyBeingFired = [];
              return DexiePromise.resolve(vip(function() {
                return remainders_1(db.vip);
              })).then(fireRemainders);
            }
          });
        }).finally(function() {
          if (state.openCanceller === openCanceller) {
            state.onReadyBeingFired = null;
            state.isBeingOpened = false;
          }
        }).catch(function(err) {
          state.dbOpenError = err;
          try {
            upgradeTransaction && upgradeTransaction.abort();
          } catch (_a2) {
          }
          if (openCanceller === state.openCanceller) {
            db._close();
          }
          return rejection(err);
        }).finally(function() {
          state.openComplete = true;
          resolveDbReady();
        }).then(function() {
          if (wasCreated) {
            var everything_1 = {};
            db.tables.forEach(function(table) {
              table.schema.indexes.forEach(function(idx) {
                if (idx.name)
                  everything_1["idb://".concat(db.name, "/").concat(table.name, "/").concat(idx.name)] = new RangeSet2(-Infinity, [[[]]]);
              });
              everything_1["idb://".concat(db.name, "/").concat(table.name, "/")] = everything_1["idb://".concat(db.name, "/").concat(table.name, "/:dels")] = new RangeSet2(-Infinity, [[[]]]);
            });
            globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME).fire(everything_1);
            signalSubscribersNow(everything_1, true);
          }
          return db;
        });
      }
      function awaitIterator(iterator) {
        var callNext = function(result) {
          return iterator.next(result);
        }, doThrow = function(error) {
          return iterator.throw(error);
        }, onSuccess = step(callNext), onError = step(doThrow);
        function step(getNext) {
          return function(val) {
            var next = getNext(val), value = next.value;
            return next.done ? value : !value || typeof value.then !== "function" ? isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) : value.then(onSuccess, onError);
          };
        }
        return step(callNext)();
      }
      function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
        var i = arguments.length;
        if (i < 2)
          throw new exceptions.InvalidArgument("Too few arguments");
        var args = new Array(i - 1);
        while (--i)
          args[i - 1] = arguments[i];
        scopeFunc = args.pop();
        var tables = flatten(args);
        return [mode, tables, scopeFunc];
      }
      function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
        return DexiePromise.resolve().then(function() {
          var transless = PSD.transless || PSD;
          var trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
          trans.explicit = true;
          var zoneProps = {
            trans,
            transless
          };
          if (parentTransaction) {
            trans.idbtrans = parentTransaction.idbtrans;
          } else {
            try {
              trans.create();
              trans.idbtrans._explicit = true;
              db._state.PR1398_maxLoop = 3;
            } catch (ex) {
              if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
                console.warn("Dexie: Need to reopen db");
                db.close({ disableAutoOpen: false });
                return db.open().then(function() {
                  return enterTransactionScope(db, mode, storeNames, null, scopeFunc);
                });
              }
              return rejection(ex);
            }
          }
          var scopeFuncIsAsync = isAsyncFunction(scopeFunc);
          if (scopeFuncIsAsync) {
            incrementExpectedAwaits();
          }
          var returnValue;
          var promiseFollowed = DexiePromise.follow(function() {
            returnValue = scopeFunc.call(trans, trans);
            if (returnValue) {
              if (scopeFuncIsAsync) {
                var decrementor = decrementExpectedAwaits.bind(null, null);
                returnValue.then(decrementor, decrementor);
              } else if (typeof returnValue.next === "function" && typeof returnValue.throw === "function") {
                returnValue = awaitIterator(returnValue);
              }
            }
          }, zoneProps);
          return (returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue).then(function(x) {
            return trans.active ? x : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
          }) : promiseFollowed.then(function() {
            return returnValue;
          })).then(function(x) {
            if (parentTransaction)
              trans._resolve();
            return trans._completion.then(function() {
              return x;
            });
          }).catch(function(e) {
            trans._reject(e);
            return rejection(e);
          });
        });
      }
      function pad(a, value, count) {
        var result = isArray(a) ? a.slice() : [a];
        for (var i = 0; i < count; ++i)
          result.push(value);
        return result;
      }
      function createVirtualIndexMiddleware(down) {
        return __assign(__assign({}, down), { table: function(tableName) {
          var table = down.table(tableName);
          var schema = table.schema;
          var indexLookup = /* @__PURE__ */ Object.create(null);
          var allVirtualIndexes = [];
          function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
            var keyPathAlias = getKeyPathAlias(keyPath);
            var indexList = indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || [];
            var keyLength = keyPath == null ? 0 : typeof keyPath === "string" ? 1 : keyPath.length;
            var isVirtual = keyTail > 0;
            var virtualIndex = __assign(__assign({}, lowLevelIndex), { name: isVirtual ? "".concat(keyPathAlias, "(virtual-from:").concat(lowLevelIndex.name, ")") : lowLevelIndex.name, lowLevelIndex, isVirtual, keyTail, keyLength, extractKey: getKeyExtractor(keyPath), unique: !isVirtual && lowLevelIndex.unique });
            indexList.push(virtualIndex);
            if (!virtualIndex.isPrimaryKey) {
              allVirtualIndexes.push(virtualIndex);
            }
            if (keyLength > 1) {
              var virtualKeyPath = keyLength === 2 ? keyPath[0] : keyPath.slice(0, keyLength - 1);
              addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
            }
            indexList.sort(function(a, b) {
              return a.keyTail - b.keyTail;
            });
            return virtualIndex;
          }
          var primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
          indexLookup[":id"] = [primaryKey];
          for (var _i = 0, _a2 = schema.indexes; _i < _a2.length; _i++) {
            var index = _a2[_i];
            addVirtualIndexes(index.keyPath, 0, index);
          }
          function findBestIndex(keyPath) {
            var result2 = indexLookup[getKeyPathAlias(keyPath)];
            return result2 && result2[0];
          }
          function translateRange(range, keyTail) {
            return {
              type: range.type === 1 ? 2 : range.type,
              lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
              lowerOpen: true,
              upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
              upperOpen: true
            };
          }
          function translateRequest(req) {
            var index2 = req.query.index;
            return index2.isVirtual ? __assign(__assign({}, req), { query: {
              index: index2.lowLevelIndex,
              range: translateRange(req.query.range, index2.keyTail)
            } }) : req;
          }
          var result = __assign(__assign({}, table), { schema: __assign(__assign({}, schema), { primaryKey, indexes: allVirtualIndexes, getIndexByKeyPath: findBestIndex }), count: function(req) {
            return table.count(translateRequest(req));
          }, query: function(req) {
            return table.query(translateRequest(req));
          }, openCursor: function(req) {
            var _a3 = req.query.index, keyTail = _a3.keyTail, isVirtual = _a3.isVirtual, keyLength = _a3.keyLength;
            if (!isVirtual)
              return table.openCursor(req);
            function createVirtualCursor(cursor) {
              function _continue(key) {
                key != null ? cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) : req.unique ? cursor.continue(cursor.key.slice(0, keyLength).concat(req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) : cursor.continue();
              }
              var virtualCursor = Object.create(cursor, {
                continue: { value: _continue },
                continuePrimaryKey: {
                  value: function(key, primaryKey2) {
                    cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey2);
                  }
                },
                primaryKey: {
                  get: function() {
                    return cursor.primaryKey;
                  }
                },
                key: {
                  get: function() {
                    var key = cursor.key;
                    return keyLength === 1 ? key[0] : key.slice(0, keyLength);
                  }
                },
                value: {
                  get: function() {
                    return cursor.value;
                  }
                }
              });
              return virtualCursor;
            }
            return table.openCursor(translateRequest(req)).then(function(cursor) {
              return cursor && createVirtualCursor(cursor);
            });
          } });
          return result;
        } });
      }
      var virtualIndexMiddleware = {
        stack: "dbcore",
        name: "VirtualIndexMiddleware",
        level: 1,
        create: createVirtualIndexMiddleware
      };
      function getObjectDiff(a, b, rv, prfx) {
        rv = rv || {};
        prfx = prfx || "";
        keys(a).forEach(function(prop) {
          if (!hasOwn(b, prop)) {
            rv[prfx + prop] = void 0;
          } else {
            var ap = a[prop], bp = b[prop];
            if (typeof ap === "object" && typeof bp === "object" && ap && bp) {
              var apTypeName = toStringTag(ap);
              var bpTypeName = toStringTag(bp);
              if (apTypeName !== bpTypeName) {
                rv[prfx + prop] = b[prop];
              } else if (apTypeName === "Object") {
                getObjectDiff(ap, bp, rv, prfx + prop + ".");
              } else if (ap !== bp) {
                rv[prfx + prop] = b[prop];
              }
            } else if (ap !== bp)
              rv[prfx + prop] = b[prop];
          }
        });
        keys(b).forEach(function(prop) {
          if (!hasOwn(a, prop)) {
            rv[prfx + prop] = b[prop];
          }
        });
        return rv;
      }
      function getEffectiveKeys(primaryKey, req) {
        if (req.type === "delete")
          return req.keys;
        return req.keys || req.values.map(primaryKey.extractKey);
      }
      var hooksMiddleware = {
        stack: "dbcore",
        name: "HooksMiddleware",
        level: 2,
        create: function(downCore) {
          return __assign(__assign({}, downCore), { table: function(tableName) {
            var downTable = downCore.table(tableName);
            var primaryKey = downTable.schema.primaryKey;
            var tableMiddleware = __assign(__assign({}, downTable), { mutate: function(req) {
              var dxTrans = PSD.trans;
              var _a2 = dxTrans.table(tableName).hook, deleting = _a2.deleting, creating = _a2.creating, updating = _a2.updating;
              switch (req.type) {
                case "add":
                  if (creating.fire === nop)
                    break;
                  return dxTrans._promise("readwrite", function() {
                    return addPutOrDelete(req);
                  }, true);
                case "put":
                  if (creating.fire === nop && updating.fire === nop)
                    break;
                  return dxTrans._promise("readwrite", function() {
                    return addPutOrDelete(req);
                  }, true);
                case "delete":
                  if (deleting.fire === nop)
                    break;
                  return dxTrans._promise("readwrite", function() {
                    return addPutOrDelete(req);
                  }, true);
                case "deleteRange":
                  if (deleting.fire === nop)
                    break;
                  return dxTrans._promise("readwrite", function() {
                    return deleteRange(req);
                  }, true);
              }
              return downTable.mutate(req);
              function addPutOrDelete(req2) {
                var dxTrans2 = PSD.trans;
                var keys2 = req2.keys || getEffectiveKeys(primaryKey, req2);
                if (!keys2)
                  throw new Error("Keys missing");
                req2 = req2.type === "add" || req2.type === "put" ? __assign(__assign({}, req2), { keys: keys2 }) : __assign({}, req2);
                if (req2.type !== "delete")
                  req2.values = __spreadArray([], req2.values, true);
                if (req2.keys)
                  req2.keys = __spreadArray([], req2.keys, true);
                return getExistingValues(downTable, req2, keys2).then(function(existingValues) {
                  var contexts = keys2.map(function(key, i) {
                    var existingValue = existingValues[i];
                    var ctx = { onerror: null, onsuccess: null };
                    if (req2.type === "delete") {
                      deleting.fire.call(ctx, key, existingValue, dxTrans2);
                    } else if (req2.type === "add" || existingValue === void 0) {
                      var generatedPrimaryKey = creating.fire.call(ctx, key, req2.values[i], dxTrans2);
                      if (key == null && generatedPrimaryKey != null) {
                        key = generatedPrimaryKey;
                        req2.keys[i] = key;
                        if (!primaryKey.outbound) {
                          setByKeyPath(req2.values[i], primaryKey.keyPath, key);
                        }
                      }
                    } else {
                      var objectDiff = getObjectDiff(existingValue, req2.values[i]);
                      var additionalChanges_1 = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans2);
                      if (additionalChanges_1) {
                        var requestedValue_1 = req2.values[i];
                        Object.keys(additionalChanges_1).forEach(function(keyPath) {
                          if (hasOwn(requestedValue_1, keyPath)) {
                            requestedValue_1[keyPath] = additionalChanges_1[keyPath];
                          } else {
                            setByKeyPath(requestedValue_1, keyPath, additionalChanges_1[keyPath]);
                          }
                        });
                      }
                    }
                    return ctx;
                  });
                  return downTable.mutate(req2).then(function(_a3) {
                    var failures = _a3.failures, results = _a3.results, numFailures = _a3.numFailures, lastResult = _a3.lastResult;
                    for (var i = 0; i < keys2.length; ++i) {
                      var primKey = results ? results[i] : keys2[i];
                      var ctx = contexts[i];
                      if (primKey == null) {
                        ctx.onerror && ctx.onerror(failures[i]);
                      } else {
                        ctx.onsuccess && ctx.onsuccess(
                          req2.type === "put" && existingValues[i] ? req2.values[i] : primKey
                        );
                      }
                    }
                    return { failures, results, numFailures, lastResult };
                  }).catch(function(error) {
                    contexts.forEach(function(ctx) {
                      return ctx.onerror && ctx.onerror(error);
                    });
                    return Promise.reject(error);
                  });
                });
              }
              function deleteRange(req2) {
                return deleteNextChunk(req2.trans, req2.range, 1e4);
              }
              function deleteNextChunk(trans, range, limit) {
                return downTable.query({
                  trans,
                  values: false,
                  query: { index: primaryKey, range },
                  limit
                }).then(function(_a3) {
                  var result = _a3.result;
                  return addPutOrDelete({
                    type: "delete",
                    keys: result,
                    trans
                  }).then(function(res) {
                    if (res.numFailures > 0)
                      return Promise.reject(res.failures[0]);
                    if (result.length < limit) {
                      return {
                        failures: [],
                        numFailures: 0,
                        lastResult: void 0
                      };
                    } else {
                      return deleteNextChunk(trans, __assign(__assign({}, range), { lower: result[result.length - 1], lowerOpen: true }), limit);
                    }
                  });
                });
              }
            } });
            return tableMiddleware;
          } });
        }
      };
      function getExistingValues(table, req, effectiveKeys) {
        return req.type === "add" ? Promise.resolve([]) : table.getMany({
          trans: req.trans,
          keys: effectiveKeys,
          cache: "immutable"
        });
      }
      function getFromTransactionCache(keys2, cache2, clone) {
        try {
          if (!cache2)
            return null;
          if (cache2.keys.length < keys2.length)
            return null;
          var result = [];
          for (var i = 0, j = 0; i < cache2.keys.length && j < keys2.length; ++i) {
            if (cmp2(cache2.keys[i], keys2[j]) !== 0)
              continue;
            result.push(clone ? deepClone(cache2.values[i]) : cache2.values[i]);
            ++j;
          }
          return result.length === keys2.length ? result : null;
        } catch (_a2) {
          return null;
        }
      }
      var cacheExistingValuesMiddleware = {
        stack: "dbcore",
        level: -1,
        create: function(core) {
          return {
            table: function(tableName) {
              var table = core.table(tableName);
              return __assign(__assign({}, table), { getMany: function(req) {
                if (!req.cache) {
                  return table.getMany(req);
                }
                var cachedResult = getFromTransactionCache(req.keys, req.trans["_cache"], req.cache === "clone");
                if (cachedResult) {
                  return DexiePromise.resolve(cachedResult);
                }
                return table.getMany(req).then(function(res) {
                  req.trans["_cache"] = {
                    keys: req.keys,
                    values: req.cache === "clone" ? deepClone(res) : res
                  };
                  return res;
                });
              }, mutate: function(req) {
                if (req.type !== "add")
                  req.trans["_cache"] = null;
                return table.mutate(req);
              } });
            }
          };
        }
      };
      function isCachableContext(ctx, table) {
        return ctx.trans.mode === "readonly" && !!ctx.subscr && !ctx.trans.explicit && ctx.trans.db._options.cache !== "disabled" && !table.schema.primaryKey.outbound;
      }
      function isCachableRequest(type2, req) {
        switch (type2) {
          case "query":
            return req.values && !req.unique;
          case "get":
            return false;
          case "getMany":
            return false;
          case "count":
            return false;
          case "openCursor":
            return false;
        }
      }
      var observabilityMiddleware = {
        stack: "dbcore",
        level: 0,
        name: "Observability",
        create: function(core) {
          var dbName = core.schema.name;
          var FULL_RANGE = new RangeSet2(core.MIN_KEY, core.MAX_KEY);
          return __assign(__assign({}, core), { transaction: function(stores, mode, options) {
            if (PSD.subscr && mode !== "readonly") {
              throw new exceptions.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(PSD.querier));
            }
            return core.transaction(stores, mode, options);
          }, table: function(tableName) {
            var table = core.table(tableName);
            var schema = table.schema;
            var primaryKey = schema.primaryKey, indexes = schema.indexes;
            var extractKey = primaryKey.extractKey, outbound = primaryKey.outbound;
            var indexesWithAutoIncPK = primaryKey.autoIncrement && indexes.filter(function(index) {
              return index.compound && index.keyPath.includes(primaryKey.keyPath);
            });
            var tableClone = __assign(__assign({}, table), { mutate: function(req) {
              var _a2, _b;
              var trans = req.trans;
              var mutatedParts = req.mutatedParts || (req.mutatedParts = {});
              var getRangeSet = function(indexName) {
                var part = "idb://".concat(dbName, "/").concat(tableName, "/").concat(indexName);
                return mutatedParts[part] || (mutatedParts[part] = new RangeSet2());
              };
              var pkRangeSet = getRangeSet("");
              var delsRangeSet = getRangeSet(":dels");
              var type2 = req.type;
              var _c = req.type === "deleteRange" ? [req.range] : req.type === "delete" ? [req.keys] : req.values.length < 50 ? [
                getEffectiveKeys(primaryKey, req).filter(function(id) {
                  return id;
                }),
                req.values
              ] : [], keys2 = _c[0], newObjs = _c[1];
              var oldCache = req.trans["_cache"];
              if (isArray(keys2)) {
                pkRangeSet.addKeys(keys2);
                var oldObjs = type2 === "delete" || keys2.length === newObjs.length ? getFromTransactionCache(keys2, oldCache) : null;
                if (!oldObjs) {
                  delsRangeSet.addKeys(keys2);
                }
                if (oldObjs || newObjs) {
                  trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
                }
              } else if (keys2) {
                var range = {
                  from: (_a2 = keys2.lower) !== null && _a2 !== void 0 ? _a2 : core.MIN_KEY,
                  to: (_b = keys2.upper) !== null && _b !== void 0 ? _b : core.MAX_KEY
                };
                delsRangeSet.add(range);
                pkRangeSet.add(range);
              } else {
                pkRangeSet.add(FULL_RANGE);
                delsRangeSet.add(FULL_RANGE);
                schema.indexes.forEach(function(idx) {
                  return getRangeSet(idx.name).add(FULL_RANGE);
                });
              }
              return table.mutate(req).then(function(res) {
                if (keys2 && (req.type === "add" || req.type === "put")) {
                  pkRangeSet.addKeys(res.results);
                  if (indexesWithAutoIncPK) {
                    indexesWithAutoIncPK.forEach(function(idx) {
                      var idxVals = req.values.map(function(v) {
                        return idx.extractKey(v);
                      });
                      var pkPos = idx.keyPath.findIndex(function(prop) {
                        return prop === primaryKey.keyPath;
                      });
                      for (var i = 0, len = res.results.length; i < len; ++i) {
                        idxVals[i][pkPos] = res.results[i];
                      }
                      getRangeSet(idx.name).addKeys(idxVals);
                    });
                  }
                }
                trans.mutatedParts = extendObservabilitySet(trans.mutatedParts || {}, mutatedParts);
                return res;
              });
            } });
            var getRange = function(_a2) {
              var _b, _c;
              var _d = _a2.query, index = _d.index, range = _d.range;
              return [
                index,
                new RangeSet2((_b = range.lower) !== null && _b !== void 0 ? _b : core.MIN_KEY, (_c = range.upper) !== null && _c !== void 0 ? _c : core.MAX_KEY)
              ];
            };
            var readSubscribers = {
              get: function(req) {
                return [primaryKey, new RangeSet2(req.key)];
              },
              getMany: function(req) {
                return [primaryKey, new RangeSet2().addKeys(req.keys)];
              },
              count: getRange,
              query: getRange,
              openCursor: getRange
            };
            keys(readSubscribers).forEach(function(method) {
              tableClone[method] = function(req) {
                var subscr = PSD.subscr;
                var isLiveQuery = !!subscr;
                var cachable = isCachableContext(PSD, table) && isCachableRequest(method, req);
                var obsSet = cachable ? req.obsSet = {} : subscr;
                if (isLiveQuery) {
                  var getRangeSet = function(indexName) {
                    var part = "idb://".concat(dbName, "/").concat(tableName, "/").concat(indexName);
                    return obsSet[part] || (obsSet[part] = new RangeSet2());
                  };
                  var pkRangeSet_1 = getRangeSet("");
                  var delsRangeSet_1 = getRangeSet(":dels");
                  var _a2 = readSubscribers[method](req), queriedIndex = _a2[0], queriedRanges = _a2[1];
                  if (method === "query" && queriedIndex.isPrimaryKey && !req.values) {
                    delsRangeSet_1.add(queriedRanges);
                  } else {
                    getRangeSet(queriedIndex.name || "").add(queriedRanges);
                  }
                  if (!queriedIndex.isPrimaryKey) {
                    if (method === "count") {
                      delsRangeSet_1.add(FULL_RANGE);
                    } else {
                      var keysPromise_1 = method === "query" && outbound && req.values && table.query(__assign(__assign({}, req), { values: false }));
                      return table[method].apply(this, arguments).then(function(res) {
                        if (method === "query") {
                          if (outbound && req.values) {
                            return keysPromise_1.then(function(_a3) {
                              var resultingKeys = _a3.result;
                              pkRangeSet_1.addKeys(resultingKeys);
                              return res;
                            });
                          }
                          var pKeys = req.values ? res.result.map(extractKey) : res.result;
                          if (req.values) {
                            pkRangeSet_1.addKeys(pKeys);
                          } else {
                            delsRangeSet_1.addKeys(pKeys);
                          }
                        } else if (method === "openCursor") {
                          var cursor_1 = res;
                          var wantValues_1 = req.values;
                          return cursor_1 && Object.create(cursor_1, {
                            key: {
                              get: function() {
                                delsRangeSet_1.addKey(cursor_1.primaryKey);
                                return cursor_1.key;
                              }
                            },
                            primaryKey: {
                              get: function() {
                                var pkey = cursor_1.primaryKey;
                                delsRangeSet_1.addKey(pkey);
                                return pkey;
                              }
                            },
                            value: {
                              get: function() {
                                wantValues_1 && pkRangeSet_1.addKey(cursor_1.primaryKey);
                                return cursor_1.value;
                              }
                            }
                          });
                        }
                        return res;
                      });
                    }
                  }
                }
                return table[method].apply(this, arguments);
              };
            });
            return tableClone;
          } });
        }
      };
      function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
        function addAffectedIndex(ix) {
          var rangeSet = getRangeSet(ix.name || "");
          function extractKey(obj) {
            return obj != null ? ix.extractKey(obj) : null;
          }
          var addKeyOrKeys = function(key) {
            return ix.multiEntry && isArray(key) ? key.forEach(function(key2) {
              return rangeSet.addKey(key2);
            }) : rangeSet.addKey(key);
          };
          (oldObjs || newObjs).forEach(function(_, i) {
            var oldKey = oldObjs && extractKey(oldObjs[i]);
            var newKey = newObjs && extractKey(newObjs[i]);
            if (cmp2(oldKey, newKey) !== 0) {
              if (oldKey != null)
                addKeyOrKeys(oldKey);
              if (newKey != null)
                addKeyOrKeys(newKey);
            }
          });
        }
        schema.indexes.forEach(addAffectedIndex);
      }
      function adjustOptimisticFromFailures(tblCache, req, res) {
        if (res.numFailures === 0)
          return req;
        if (req.type === "deleteRange") {
          return null;
        }
        var numBulkOps = req.keys ? req.keys.length : "values" in req && req.values ? req.values.length : 1;
        if (res.numFailures === numBulkOps) {
          return null;
        }
        var clone = __assign({}, req);
        if (isArray(clone.keys)) {
          clone.keys = clone.keys.filter(function(_, i) {
            return !(i in res.failures);
          });
        }
        if ("values" in clone && isArray(clone.values)) {
          clone.values = clone.values.filter(function(_, i) {
            return !(i in res.failures);
          });
        }
        return clone;
      }
      function isAboveLower(key, range) {
        return range.lower === void 0 ? true : range.lowerOpen ? cmp2(key, range.lower) > 0 : cmp2(key, range.lower) >= 0;
      }
      function isBelowUpper(key, range) {
        return range.upper === void 0 ? true : range.upperOpen ? cmp2(key, range.upper) < 0 : cmp2(key, range.upper) <= 0;
      }
      function isWithinRange(key, range) {
        return isAboveLower(key, range) && isBelowUpper(key, range);
      }
      function applyOptimisticOps(result, req, ops, table, cacheEntry, immutable) {
        if (!ops || ops.length === 0)
          return result;
        var index = req.query.index;
        var multiEntry = index.multiEntry;
        var queryRange = req.query.range;
        var primaryKey = table.schema.primaryKey;
        var extractPrimKey = primaryKey.extractKey;
        var extractIndex = index.extractKey;
        var extractLowLevelIndex = (index.lowLevelIndex || index).extractKey;
        var finalResult = ops.reduce(function(result2, op) {
          var modifedResult = result2;
          var includedValues = [];
          if (op.type === "add" || op.type === "put") {
            var includedPKs = new RangeSet2();
            for (var i = op.values.length - 1; i >= 0; --i) {
              var value = op.values[i];
              var pk = extractPrimKey(value);
              if (includedPKs.hasKey(pk))
                continue;
              var key = extractIndex(value);
              if (multiEntry && isArray(key) ? key.some(function(k) {
                return isWithinRange(k, queryRange);
              }) : isWithinRange(key, queryRange)) {
                includedPKs.addKey(pk);
                includedValues.push(value);
              }
            }
          }
          switch (op.type) {
            case "add": {
              var existingKeys_1 = new RangeSet2().addKeys(req.values ? result2.map(function(v) {
                return extractPrimKey(v);
              }) : result2);
              modifedResult = result2.concat(req.values ? includedValues.filter(function(v) {
                var key2 = extractPrimKey(v);
                if (existingKeys_1.hasKey(key2))
                  return false;
                existingKeys_1.addKey(key2);
                return true;
              }) : includedValues.map(function(v) {
                return extractPrimKey(v);
              }).filter(function(k) {
                if (existingKeys_1.hasKey(k))
                  return false;
                existingKeys_1.addKey(k);
                return true;
              }));
              break;
            }
            case "put": {
              var keySet_1 = new RangeSet2().addKeys(op.values.map(function(v) {
                return extractPrimKey(v);
              }));
              modifedResult = result2.filter(
                function(item) {
                  return !keySet_1.hasKey(req.values ? extractPrimKey(item) : item);
                }
              ).concat(
                req.values ? includedValues : includedValues.map(function(v) {
                  return extractPrimKey(v);
                })
              );
              break;
            }
            case "delete":
              var keysToDelete_1 = new RangeSet2().addKeys(op.keys);
              modifedResult = result2.filter(function(item) {
                return !keysToDelete_1.hasKey(req.values ? extractPrimKey(item) : item);
              });
              break;
            case "deleteRange":
              var range_1 = op.range;
              modifedResult = result2.filter(function(item) {
                return !isWithinRange(extractPrimKey(item), range_1);
              });
              break;
          }
          return modifedResult;
        }, result);
        if (finalResult === result)
          return result;
        var sorter = function(a, b) {
          return cmp2(extractLowLevelIndex(a), extractLowLevelIndex(b)) || cmp2(extractPrimKey(a), extractPrimKey(b));
        };
        finalResult.sort(req.direction === "prev" || req.direction === "prevunique" ? function(a, b) {
          return sorter(b, a);
        } : sorter);
        if (req.limit && req.limit < Infinity) {
          if (finalResult.length > req.limit) {
            finalResult.length = req.limit;
          } else if (result.length === req.limit && finalResult.length < req.limit) {
            cacheEntry.dirty = true;
          }
        }
        return immutable ? Object.freeze(finalResult) : finalResult;
      }
      function areRangesEqual(r1, r2) {
        return cmp2(r1.lower, r2.lower) === 0 && cmp2(r1.upper, r2.upper) === 0 && !!r1.lowerOpen === !!r2.lowerOpen && !!r1.upperOpen === !!r2.upperOpen;
      }
      function compareLowers(lower1, lower2, lowerOpen1, lowerOpen2) {
        if (lower1 === void 0)
          return lower2 !== void 0 ? -1 : 0;
        if (lower2 === void 0)
          return 1;
        var c = cmp2(lower1, lower2);
        if (c === 0) {
          if (lowerOpen1 && lowerOpen2)
            return 0;
          if (lowerOpen1)
            return 1;
          if (lowerOpen2)
            return -1;
        }
        return c;
      }
      function compareUppers(upper1, upper2, upperOpen1, upperOpen2) {
        if (upper1 === void 0)
          return upper2 !== void 0 ? 1 : 0;
        if (upper2 === void 0)
          return -1;
        var c = cmp2(upper1, upper2);
        if (c === 0) {
          if (upperOpen1 && upperOpen2)
            return 0;
          if (upperOpen1)
            return -1;
          if (upperOpen2)
            return 1;
        }
        return c;
      }
      function isSuperRange(r1, r2) {
        return compareLowers(r1.lower, r2.lower, r1.lowerOpen, r2.lowerOpen) <= 0 && compareUppers(r1.upper, r2.upper, r1.upperOpen, r2.upperOpen) >= 0;
      }
      function findCompatibleQuery(dbName, tableName, type2, req) {
        var _a2;
        var tblCache = cache["idb://".concat(dbName, "/").concat(tableName)];
        if (!tblCache)
          return [];
        var queries = tblCache.queries[type2];
        if (!queries)
          return [null, false, tblCache, null];
        var indexName = req.query ? req.query.index.name : null;
        var entries = queries[indexName || ""];
        if (!entries)
          return [null, false, tblCache, null];
        switch (type2) {
          case "query":
            var reqDirection_1 = (_a2 = req.direction) !== null && _a2 !== void 0 ? _a2 : "next";
            var equalEntry = entries.find(function(entry) {
              var _a3;
              return entry.req.limit === req.limit && entry.req.values === req.values && ((_a3 = entry.req.direction) !== null && _a3 !== void 0 ? _a3 : "next") === reqDirection_1 && areRangesEqual(entry.req.query.range, req.query.range);
            });
            if (equalEntry)
              return [
                equalEntry,
                true,
                tblCache,
                entries
              ];
            var superEntry = entries.find(function(entry) {
              var _a3;
              var limit = "limit" in entry.req ? entry.req.limit : Infinity;
              return limit >= req.limit && ((_a3 = entry.req.direction) !== null && _a3 !== void 0 ? _a3 : "next") === reqDirection_1 && (req.values ? entry.req.values : true) && isSuperRange(entry.req.query.range, req.query.range);
            });
            return [superEntry, false, tblCache, entries];
          case "count":
            var countQuery = entries.find(function(entry) {
              return areRangesEqual(entry.req.query.range, req.query.range);
            });
            return [countQuery, !!countQuery, tblCache, entries];
        }
      }
      function subscribeToCacheEntry(cacheEntry, container, requery, signal2) {
        cacheEntry.subscribers.add(requery);
        signal2.addEventListener("abort", function() {
          cacheEntry.subscribers.delete(requery);
          if (cacheEntry.subscribers.size === 0) {
            enqueForDeletion(cacheEntry, container);
          }
        });
      }
      function enqueForDeletion(cacheEntry, container) {
        setTimeout(function() {
          if (cacheEntry.subscribers.size === 0) {
            delArrayItem(container, cacheEntry);
          }
        }, 3e3);
      }
      var cacheMiddleware = {
        stack: "dbcore",
        level: 0,
        name: "Cache",
        create: function(core) {
          var dbName = core.schema.name;
          var coreMW = __assign(__assign({}, core), { transaction: function(stores, mode, options) {
            var idbtrans = core.transaction(stores, mode, options);
            if (mode === "readwrite") {
              var ac_1 = new AbortController();
              var signal2 = ac_1.signal;
              var endTransaction = function(wasCommitted) {
                return function() {
                  ac_1.abort();
                  if (mode === "readwrite") {
                    var affectedSubscribers_1 = /* @__PURE__ */ new Set();
                    for (var _i = 0, stores_1 = stores; _i < stores_1.length; _i++) {
                      var storeName = stores_1[_i];
                      var tblCache = cache["idb://".concat(dbName, "/").concat(storeName)];
                      if (tblCache) {
                        var table = core.table(storeName);
                        var ops = tblCache.optimisticOps.filter(function(op) {
                          return op.trans === idbtrans;
                        });
                        if (idbtrans._explicit && wasCommitted && idbtrans.mutatedParts) {
                          for (var _a2 = 0, _b = Object.values(tblCache.queries.query); _a2 < _b.length; _a2++) {
                            var entries = _b[_a2];
                            for (var _c = 0, _d = entries.slice(); _c < _d.length; _c++) {
                              var entry = _d[_c];
                              if (obsSetsOverlap(entry.obsSet, idbtrans.mutatedParts)) {
                                delArrayItem(entries, entry);
                                entry.subscribers.forEach(function(requery) {
                                  return affectedSubscribers_1.add(requery);
                                });
                              }
                            }
                          }
                        } else if (ops.length > 0) {
                          tblCache.optimisticOps = tblCache.optimisticOps.filter(function(op) {
                            return op.trans !== idbtrans;
                          });
                          for (var _e = 0, _f = Object.values(tblCache.queries.query); _e < _f.length; _e++) {
                            var entries = _f[_e];
                            for (var _g = 0, _h = entries.slice(); _g < _h.length; _g++) {
                              var entry = _h[_g];
                              if (entry.res != null && idbtrans.mutatedParts) {
                                if (wasCommitted && !entry.dirty) {
                                  var freezeResults = Object.isFrozen(entry.res);
                                  var modRes = applyOptimisticOps(entry.res, entry.req, ops, table, entry, freezeResults);
                                  if (entry.dirty) {
                                    delArrayItem(entries, entry);
                                    entry.subscribers.forEach(function(requery) {
                                      return affectedSubscribers_1.add(requery);
                                    });
                                  } else if (modRes !== entry.res) {
                                    entry.res = modRes;
                                    entry.promise = DexiePromise.resolve({
                                      result: modRes
                                    });
                                  }
                                } else {
                                  if (entry.dirty) {
                                    delArrayItem(entries, entry);
                                  }
                                  entry.subscribers.forEach(function(requery) {
                                    return affectedSubscribers_1.add(requery);
                                  });
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    affectedSubscribers_1.forEach(function(requery) {
                      return requery();
                    });
                  }
                };
              };
              idbtrans.addEventListener("abort", endTransaction(false), {
                signal: signal2
              });
              idbtrans.addEventListener("error", endTransaction(false), {
                signal: signal2
              });
              idbtrans.addEventListener("complete", endTransaction(true), {
                signal: signal2
              });
            }
            return idbtrans;
          }, table: function(tableName) {
            var downTable = core.table(tableName);
            var primKey = downTable.schema.primaryKey;
            var tableMW = __assign(__assign({}, downTable), { mutate: function(req) {
              var trans = PSD.trans;
              if (primKey.outbound || trans.db._options.cache === "disabled" || trans.explicit || trans.idbtrans.mode !== "readwrite") {
                return downTable.mutate(req);
              }
              var tblCache = cache["idb://".concat(dbName, "/").concat(tableName)];
              if (!tblCache)
                return downTable.mutate(req);
              var promise = downTable.mutate(req);
              if ((req.type === "add" || req.type === "put") && (req.values.length >= 50 || getEffectiveKeys(primKey, req).some(function(key) {
                return key == null;
              }))) {
                promise.then(function(res) {
                  var reqWithResolvedKeys = __assign(__assign({}, req), { values: req.values.map(function(value, i) {
                    var _a2;
                    if (res.failures[i])
                      return value;
                    var valueWithKey = ((_a2 = primKey.keyPath) === null || _a2 === void 0 ? void 0 : _a2.includes(".")) ? deepClone(value) : __assign({}, value);
                    setByKeyPath(valueWithKey, primKey.keyPath, res.results[i]);
                    return valueWithKey;
                  }) });
                  var adjustedReq = adjustOptimisticFromFailures(tblCache, reqWithResolvedKeys, res);
                  tblCache.optimisticOps.push(adjustedReq);
                  queueMicrotask(function() {
                    return req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                  });
                });
              } else {
                tblCache.optimisticOps.push(req);
                req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                promise.then(function(res) {
                  if (res.numFailures > 0) {
                    delArrayItem(tblCache.optimisticOps, req);
                    var adjustedReq = adjustOptimisticFromFailures(tblCache, req, res);
                    if (adjustedReq) {
                      tblCache.optimisticOps.push(adjustedReq);
                    }
                    req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                  }
                });
                promise.catch(function() {
                  delArrayItem(tblCache.optimisticOps, req);
                  req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                });
              }
              return promise;
            }, query: function(req) {
              var _a2;
              if (!isCachableContext(PSD, downTable) || !isCachableRequest("query", req))
                return downTable.query(req);
              var freezeResults = ((_a2 = PSD.trans) === null || _a2 === void 0 ? void 0 : _a2.db._options.cache) === "immutable";
              var _b = PSD, requery = _b.requery, signal2 = _b.signal;
              var _c = findCompatibleQuery(dbName, tableName, "query", req), cacheEntry = _c[0], exactMatch = _c[1], tblCache = _c[2], container = _c[3];
              if (cacheEntry && exactMatch) {
                cacheEntry.obsSet = req.obsSet;
              } else {
                var promise = downTable.query(req).then(function(res) {
                  var result = res.result;
                  if (cacheEntry)
                    cacheEntry.res = result;
                  if (freezeResults) {
                    for (var i = 0, l = result.length; i < l; ++i) {
                      Object.freeze(result[i]);
                    }
                    Object.freeze(result);
                  }
                  return res;
                }).catch(function(error) {
                  if (container && cacheEntry)
                    delArrayItem(container, cacheEntry);
                  return Promise.reject(error);
                });
                cacheEntry = {
                  obsSet: req.obsSet,
                  promise,
                  subscribers: /* @__PURE__ */ new Set(),
                  type: "query",
                  req,
                  dirty: false
                };
                if (container) {
                  container.push(cacheEntry);
                } else {
                  container = [cacheEntry];
                  if (!tblCache) {
                    tblCache = cache["idb://".concat(dbName, "/").concat(tableName)] = {
                      queries: {
                        query: {},
                        count: {}
                      },
                      objs: /* @__PURE__ */ new Map(),
                      optimisticOps: [],
                      unsignaledParts: {}
                    };
                  }
                  tblCache.queries.query[req.query.index.name || ""] = container;
                }
              }
              subscribeToCacheEntry(cacheEntry, container, requery, signal2);
              return cacheEntry.promise.then(function(res) {
                var result = applyOptimisticOps(res.result, req, tblCache === null || tblCache === void 0 ? void 0 : tblCache.optimisticOps, downTable, cacheEntry, freezeResults);
                return {
                  result: freezeResults ? result : deepClone(result)
                };
              });
            } });
            return tableMW;
          } });
          return coreMW;
        }
      };
      function vipify(target, vipDb) {
        return new Proxy(target, {
          get: function(target2, prop, receiver) {
            if (prop === "db")
              return vipDb;
            return Reflect.get(target2, prop, receiver);
          }
        });
      }
      var Dexie$1 = (function() {
        function Dexie3(name, options) {
          var _this = this;
          this._middlewares = {};
          this.verno = 0;
          var deps = Dexie3.dependencies;
          this._options = options = __assign({
            addons: Dexie3.addons,
            autoOpen: true,
            indexedDB: deps.indexedDB,
            IDBKeyRange: deps.IDBKeyRange,
            cache: "cloned",
            maxConnections: DEFAULT_MAX_CONNECTIONS
          }, options);
          this._deps = {
            indexedDB: options.indexedDB,
            IDBKeyRange: options.IDBKeyRange
          };
          var addons = options.addons;
          this._dbSchema = {};
          this._versions = [];
          this._storeNames = [];
          this._allTables = {};
          this.idbdb = null;
          this._novip = this;
          var state = {
            dbOpenError: null,
            isBeingOpened: false,
            onReadyBeingFired: null,
            openComplete: false,
            dbReadyResolve: nop,
            dbReadyPromise: null,
            cancelOpen: nop,
            openCanceller: null,
            autoSchema: true,
            PR1398_maxLoop: 3,
            autoOpen: options.autoOpen
          };
          state.dbReadyPromise = new DexiePromise(function(resolve) {
            state.dbReadyResolve = resolve;
          });
          state.openCanceller = new DexiePromise(function(_, reject) {
            state.cancelOpen = reject;
          });
          this._state = state;
          this.name = name;
          this.on = Events(this, "populate", "blocked", "versionchange", "close", {
            ready: [promisableChain, nop]
          });
          this.once = function(event, callback) {
            var fn = function() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
              }
              _this.on(event).unsubscribe(fn);
              callback.apply(_this, args);
            };
            return _this.on(event, fn);
          };
          this.on.ready.subscribe = override(this.on.ready.subscribe, function(subscribe) {
            return function(subscriber, bSticky) {
              Dexie3.vip(function() {
                var state2 = _this._state;
                if (state2.openComplete) {
                  if (!state2.dbOpenError)
                    DexiePromise.resolve().then(subscriber);
                  if (bSticky)
                    subscribe(subscriber);
                } else if (state2.onReadyBeingFired) {
                  state2.onReadyBeingFired.push(subscriber);
                  if (bSticky)
                    subscribe(subscriber);
                } else {
                  subscribe(subscriber);
                  var db_1 = _this;
                  if (!bSticky)
                    subscribe(function unsubscribe() {
                      db_1.on.ready.unsubscribe(subscriber);
                      db_1.on.ready.unsubscribe(unsubscribe);
                    });
                }
              });
            };
          });
          this.Collection = createCollectionConstructor(this);
          this.Table = createTableConstructor(this);
          this.Transaction = createTransactionConstructor(this);
          this.Version = createVersionConstructor(this);
          this.WhereClause = createWhereClauseConstructor(this);
          this.on("versionchange", function(ev) {
            if (ev.newVersion > 0)
              console.warn("Another connection wants to upgrade database '".concat(_this.name, "'. Closing db now to resume the upgrade."));
            else
              console.warn("Another connection wants to delete database '".concat(_this.name, "'. Closing db now to resume the delete request."));
            _this.close({ disableAutoOpen: false });
          });
          this.on("blocked", function(ev) {
            if (!ev.newVersion || ev.newVersion < ev.oldVersion)
              console.warn("Dexie.delete('".concat(_this.name, "') was blocked"));
            else
              console.warn("Upgrade '".concat(_this.name, "' blocked by other connection holding version ").concat(ev.oldVersion / 10));
          });
          this._maxKey = getMaxKey(options.IDBKeyRange);
          this._createTransaction = function(mode, storeNames, dbschema, parentTransaction) {
            return new _this.Transaction(mode, storeNames, dbschema, _this._options.chromeTransactionDurability, parentTransaction);
          };
          this._fireOnBlocked = function(ev) {
            _this.on("blocked").fire(ev);
            connections.toArray().filter(function(c) {
              return c.name === _this.name && c !== _this && !c._state.vcFired;
            }).map(function(c) {
              return c.on("versionchange").fire(ev);
            });
          };
          this.use(cacheExistingValuesMiddleware);
          this.use(cacheMiddleware);
          this.use(observabilityMiddleware);
          this.use(virtualIndexMiddleware);
          this.use(hooksMiddleware);
          var vipDB = new Proxy(this, {
            get: function(_, prop, receiver) {
              if (prop === "_vip")
                return true;
              if (prop === "table")
                return function(tableName) {
                  return vipify(_this.table(tableName), vipDB);
                };
              var rv = Reflect.get(_, prop, receiver);
              if (rv instanceof Table2)
                return vipify(rv, vipDB);
              if (prop === "tables")
                return rv.map(function(t) {
                  return vipify(t, vipDB);
                });
              if (prop === "_createTransaction")
                return function() {
                  var tx = rv.apply(this, arguments);
                  return vipify(tx, vipDB);
                };
              return rv;
            }
          });
          this.vip = vipDB;
          addons.forEach(function(addon) {
            return addon(_this);
          });
        }
        Dexie3.prototype.version = function(versionNumber) {
          if (isNaN(versionNumber) || versionNumber < 0.1)
            throw new exceptions.Type("Given version is not a positive number");
          versionNumber = Math.round(versionNumber * 10) / 10;
          if (this.idbdb || this._state.isBeingOpened)
            throw new exceptions.Schema("Cannot add version when database is open");
          this.verno = Math.max(this.verno, versionNumber);
          var versions = this._versions;
          var versionInstance = versions.filter(function(v) {
            return v._cfg.version === versionNumber;
          })[0];
          if (versionInstance)
            return versionInstance;
          versionInstance = new this.Version(versionNumber);
          versions.push(versionInstance);
          versions.sort(lowerVersionFirst);
          versionInstance.stores({});
          this._state.autoSchema = false;
          return versionInstance;
        };
        Dexie3.prototype._whenReady = function(fn) {
          var _this = this;
          return this.idbdb && (this._state.openComplete || PSD.letThrough || this._vip) ? fn() : new DexiePromise(function(resolve, reject) {
            if (_this._state.openComplete) {
              return reject(new exceptions.DatabaseClosed(_this._state.dbOpenError));
            }
            if (!_this._state.isBeingOpened) {
              if (!_this._state.autoOpen) {
                reject(new exceptions.DatabaseClosed());
                return;
              }
              _this.open().catch(nop);
            }
            _this._state.dbReadyPromise.then(resolve, reject);
          }).then(fn);
        };
        Dexie3.prototype.use = function(_a2) {
          var stack = _a2.stack, create = _a2.create, level = _a2.level, name = _a2.name;
          if (name)
            this.unuse({ stack, name });
          var middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
          middlewares.push({
            stack,
            create,
            level: level == null ? 10 : level,
            name
          });
          middlewares.sort(function(a, b) {
            return a.level - b.level;
          });
          return this;
        };
        Dexie3.prototype.unuse = function(_a2) {
          var stack = _a2.stack, name = _a2.name, create = _a2.create;
          if (stack && this._middlewares[stack]) {
            this._middlewares[stack] = this._middlewares[stack].filter(function(mw) {
              return create ? mw.create !== create : name ? mw.name !== name : false;
            });
          }
          return this;
        };
        Dexie3.prototype.open = function() {
          var _this = this;
          return usePSD(
            globalPSD,
            function() {
              return dexieOpen(_this);
            }
          );
        };
        Dexie3.prototype._close = function() {
          this.on.close.fire(new CustomEvent("close"));
          var state = this._state;
          connections.remove(this);
          if (this.idbdb) {
            try {
              this.idbdb.close();
            } catch (e) {
            }
            this.idbdb = null;
          }
          if (!state.isBeingOpened) {
            state.dbReadyPromise = new DexiePromise(function(resolve) {
              state.dbReadyResolve = resolve;
            });
            state.openCanceller = new DexiePromise(function(_, reject) {
              state.cancelOpen = reject;
            });
          }
        };
        Dexie3.prototype.close = function(_a2) {
          var _b = _a2 === void 0 ? { disableAutoOpen: true } : _a2, disableAutoOpen = _b.disableAutoOpen;
          var state = this._state;
          if (disableAutoOpen) {
            if (state.isBeingOpened) {
              state.cancelOpen(new exceptions.DatabaseClosed());
            }
            this._close();
            state.autoOpen = false;
            state.dbOpenError = new exceptions.DatabaseClosed();
          } else {
            this._close();
            state.autoOpen = this._options.autoOpen || state.isBeingOpened;
            state.openComplete = false;
            state.dbOpenError = null;
          }
        };
        Dexie3.prototype.delete = function(closeOptions) {
          var _this = this;
          if (closeOptions === void 0) {
            closeOptions = { disableAutoOpen: true };
          }
          var hasInvalidArguments = arguments.length > 0 && typeof arguments[0] !== "object";
          var state = this._state;
          return new DexiePromise(function(resolve, reject) {
            var doDelete = function() {
              _this.close(closeOptions);
              var req = _this._deps.indexedDB.deleteDatabase(_this.name);
              req.onsuccess = wrap(function() {
                _onDatabaseDeleted(_this._deps, _this.name);
                resolve();
              });
              req.onerror = eventRejectHandler(reject);
              req.onblocked = _this._fireOnBlocked;
            };
            if (hasInvalidArguments)
              throw new exceptions.InvalidArgument("Invalid closeOptions argument to db.delete()");
            if (state.isBeingOpened) {
              state.dbReadyPromise.then(doDelete);
            } else {
              doDelete();
            }
          });
        };
        Dexie3.prototype.backendDB = function() {
          return this.idbdb;
        };
        Dexie3.prototype.isOpen = function() {
          return this.idbdb !== null;
        };
        Dexie3.prototype.hasBeenClosed = function() {
          var dbOpenError = this._state.dbOpenError;
          return dbOpenError && dbOpenError.name === "DatabaseClosed";
        };
        Dexie3.prototype.hasFailed = function() {
          return this._state.dbOpenError !== null;
        };
        Dexie3.prototype.dynamicallyOpened = function() {
          return this._state.autoSchema;
        };
        Object.defineProperty(Dexie3.prototype, "tables", {
          get: function() {
            var _this = this;
            return keys(this._allTables).map(function(name) {
              return _this._allTables[name];
            });
          },
          enumerable: false,
          configurable: true
        });
        Dexie3.prototype.transaction = function() {
          var args = extractTransactionArgs.apply(this, arguments);
          return this._transaction.apply(this, args);
        };
        Dexie3.prototype._transaction = function(mode, tables, scopeFunc) {
          var _this = this;
          var parentTransaction = PSD.trans;
          if (!parentTransaction || parentTransaction.db !== this || mode.indexOf("!") !== -1)
            parentTransaction = null;
          var onlyIfCompatible = mode.indexOf("?") !== -1;
          mode = mode.replace("!", "").replace("?", "");
          var idbMode, storeNames;
          try {
            storeNames = tables.map(function(table) {
              var storeName = table instanceof _this.Table ? table.name : table;
              if (typeof storeName !== "string")
                throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
              return storeName;
            });
            if (mode == "r" || mode === READONLY)
              idbMode = READONLY;
            else if (mode == "rw" || mode == READWRITE)
              idbMode = READWRITE;
            else
              throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
            if (parentTransaction) {
              if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
                if (onlyIfCompatible) {
                  parentTransaction = null;
                } else
                  throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
              }
              if (parentTransaction) {
                storeNames.forEach(function(storeName) {
                  if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
                    if (onlyIfCompatible) {
                      parentTransaction = null;
                    } else
                      throw new exceptions.SubTransaction("Table " + storeName + " not included in parent transaction.");
                  }
                });
              }
              if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
                parentTransaction = null;
              }
            }
          } catch (e) {
            return parentTransaction ? parentTransaction._promise(null, function(_, reject) {
              reject(e);
            }) : rejection(e);
          }
          var enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
          return parentTransaction ? parentTransaction._promise(idbMode, enterTransaction, "lock") : PSD.trans ? usePSD(PSD.transless, function() {
            return _this._whenReady(enterTransaction);
          }) : this._whenReady(enterTransaction);
        };
        Dexie3.prototype.table = function(tableName) {
          if (!hasOwn(this._allTables, tableName)) {
            throw new exceptions.InvalidTable("Table ".concat(tableName, " does not exist"));
          }
          return this._allTables[tableName];
        };
        return Dexie3;
      })();
      var symbolObservable = typeof Symbol !== "undefined" && "observable" in Symbol ? Symbol.observable : "@@observable";
      var Observable = (function() {
        function Observable2(subscribe) {
          this._subscribe = subscribe;
        }
        Observable2.prototype.subscribe = function(x, error, complete) {
          return this._subscribe(!x || typeof x === "function" ? { next: x, error, complete } : x);
        };
        Observable2.prototype[symbolObservable] = function() {
          return this;
        };
        return Observable2;
      })();
      var domDeps;
      try {
        domDeps = {
          indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
          IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
        };
      } catch (e) {
        domDeps = { indexedDB: null, IDBKeyRange: null };
      }
      function liveQuery2(querier) {
        var hasValue = false;
        var currentValue;
        var observable = new Observable(function(observer) {
          var scopeFuncIsAsync = isAsyncFunction(querier);
          function execute(ctx) {
            var wasRootExec = beginMicroTickScope();
            try {
              if (scopeFuncIsAsync) {
                incrementExpectedAwaits();
              }
              var rv = newScope(querier, ctx);
              if (scopeFuncIsAsync) {
                rv = rv.finally(decrementExpectedAwaits);
              }
              return rv;
            } finally {
              wasRootExec && endMicroTickScope();
            }
          }
          var closed = false;
          var abortController;
          var accumMuts = {};
          var currentObs = {};
          var subscription = {
            get closed() {
              return closed;
            },
            unsubscribe: function() {
              if (closed)
                return;
              closed = true;
              if (abortController)
                abortController.abort();
              if (startedListening)
                globalEvents.storagemutated.unsubscribe(mutationListener);
            }
          };
          observer.start && observer.start(subscription);
          var startedListening = false;
          var doQuery = function() {
            return execInGlobalContext(_doQuery);
          };
          function shouldNotify() {
            return obsSetsOverlap(currentObs, accumMuts);
          }
          var mutationListener = function(parts) {
            extendObservabilitySet(accumMuts, parts);
            if (shouldNotify()) {
              doQuery();
            }
          };
          var _doQuery = function() {
            if (closed || !domDeps.indexedDB) {
              return;
            }
            accumMuts = {};
            var subscr = {};
            if (abortController)
              abortController.abort();
            abortController = new AbortController();
            var ctx = {
              subscr,
              signal: abortController.signal,
              requery: doQuery,
              querier,
              trans: null
            };
            var ret = execute(ctx);
            if (!startedListening) {
              globalEvents.storagemutated.subscribe(mutationListener);
              startedListening = true;
            }
            Promise.resolve(ret).then(function(result) {
              hasValue = true;
              currentValue = result;
              if (closed || ctx.signal.aborted) {
                return;
              }
              if (shouldNotify()) {
                doQuery();
              } else {
                currentObs = subscr;
                if (shouldNotify()) {
                  doQuery();
                } else {
                  accumMuts = {};
                  execInGlobalContext(function() {
                    return !closed && observer.next && observer.next(result);
                  });
                }
              }
            }, function(err) {
              hasValue = false;
              if (!["DatabaseClosedError", "AbortError"].includes(err === null || err === void 0 ? void 0 : err.name)) {
                if (!closed)
                  execInGlobalContext(function() {
                    if (closed)
                      return;
                    observer.error && observer.error(err);
                  });
              }
            });
          };
          setTimeout(doQuery, 0);
          return subscription;
        });
        observable.hasValue = function() {
          return hasValue;
        };
        observable.getValue = function() {
          return currentValue;
        };
        return observable;
      }
      var Dexie2 = Dexie$1;
      props(Dexie2, __assign(__assign({}, fullNameExceptions), {
        delete: function(databaseName) {
          var db = new Dexie2(databaseName, { addons: [] });
          return db.delete();
        },
        exists: function(name) {
          return new Dexie2(name, { addons: [] }).open().then(function(db) {
            db.close();
            return true;
          }).catch("NoSuchDatabaseError", function() {
            return false;
          });
        },
        getDatabaseNames: function(cb) {
          try {
            return getDatabaseNames(Dexie2.dependencies).then(cb);
          } catch (_a2) {
            return rejection(new exceptions.MissingAPI());
          }
        },
        defineClass: function() {
          function Class(content) {
            extend(this, content);
          }
          return Class;
        },
        ignoreTransaction: function(scopeFunc) {
          return PSD.trans ? usePSD(PSD.transless || globalPSD, scopeFunc) : scopeFunc();
        },
        vip,
        async: function(generatorFn) {
          return function() {
            try {
              var rv = awaitIterator(generatorFn.apply(this, arguments));
              if (!rv || typeof rv.then !== "function")
                return DexiePromise.resolve(rv);
              return rv;
            } catch (e) {
              return rejection(e);
            }
          };
        },
        spawn: function(generatorFn, args, thiz) {
          try {
            var rv = awaitIterator(generatorFn.apply(thiz, args || []));
            if (!rv || typeof rv.then !== "function")
              return DexiePromise.resolve(rv);
            return rv;
          } catch (e) {
            return rejection(e);
          }
        },
        currentTransaction: {
          get: function() {
            return PSD.trans || null;
          }
        },
        waitFor: function(promiseOrFunction, optionalTimeout) {
          var promise = DexiePromise.resolve(typeof promiseOrFunction === "function" ? Dexie2.ignoreTransaction(promiseOrFunction) : promiseOrFunction).timeout(optionalTimeout || 6e4);
          return PSD.trans ? PSD.trans.waitFor(promise) : promise;
        },
        Promise: DexiePromise,
        debug: {
          get: function() {
            return debug;
          },
          set: function(value) {
            setDebug(value);
          }
        },
        derive,
        extend,
        props,
        override,
        Events,
        on: globalEvents,
        liveQuery: liveQuery2,
        extendObservabilitySet,
        getByKeyPath,
        setByKeyPath,
        delByKeyPath,
        shallowClone,
        deepClone,
        getObjectDiff,
        cmp: cmp2,
        asap: asap$1,
        minKey,
        addons: [],
        connections: {
          get: connections.toArray
        },
        errnames,
        dependencies: domDeps,
        cache,
        semVer: DEXIE_VERSION,
        version: DEXIE_VERSION.split(".").map(function(n) {
          return parseInt(n);
        }).reduce(function(p, c, i) {
          return p + c / Math.pow(10, i * 2);
        })
      }));
      Dexie2.maxKey = getMaxKey(Dexie2.dependencies.IDBKeyRange);
      if (typeof dispatchEvent !== "undefined" && typeof addEventListener !== "undefined") {
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function(updatedParts) {
          if (!propagatingLocally) {
            var event_1;
            event_1 = new CustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, {
              detail: updatedParts
            });
            propagatingLocally = true;
            dispatchEvent(event_1);
            propagatingLocally = false;
          }
        });
        addEventListener(STORAGE_MUTATED_DOM_EVENT_NAME, function(_a2) {
          var detail = _a2.detail;
          if (!propagatingLocally) {
            propagateLocally(detail);
          }
        });
      }
      function propagateLocally(updateParts) {
        var wasMe = propagatingLocally;
        try {
          propagatingLocally = true;
          globalEvents.storagemutated.fire(updateParts);
          signalSubscribersNow(updateParts, true);
        } finally {
          propagatingLocally = wasMe;
        }
      }
      var propagatingLocally = false;
      var bc;
      var createBC = function() {
      };
      if (typeof BroadcastChannel !== "undefined") {
        createBC = function() {
          bc = new BroadcastChannel(STORAGE_MUTATED_DOM_EVENT_NAME);
          bc.onmessage = function(ev) {
            return ev.data && propagateLocally(ev.data);
          };
        };
        createBC();
        if (typeof bc.unref === "function") {
          bc.unref();
        }
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function(changedParts) {
          if (!propagatingLocally) {
            bc.postMessage(changedParts);
          }
        });
      }
      if (typeof addEventListener !== "undefined") {
        addEventListener("pagehide", function(event) {
          if (!Dexie$1.disableBfCache && event.persisted) {
            if (debug)
              console.debug("Dexie: handling persisted pagehide");
            bc === null || bc === void 0 ? void 0 : bc.close();
            for (var _i = 0, _a2 = connections.toArray(); _i < _a2.length; _i++) {
              var db = _a2[_i];
              db.close({ disableAutoOpen: false });
            }
          }
        });
        addEventListener("pageshow", function(event) {
          if (!Dexie$1.disableBfCache && event.persisted) {
            if (debug)
              console.debug("Dexie: handling persisted pageshow");
            createBC();
            propagateLocally({ all: new RangeSet2(-Infinity, [[]]) });
          }
        });
      }
      function add2(value) {
        return new PropModification2({ add: value });
      }
      function remove2(value) {
        return new PropModification2({ remove: value });
      }
      function replacePrefix2(a, b) {
        return new PropModification2({ replacePrefix: [a, b] });
      }
      DexiePromise.rejectionMapper = mapError;
      setDebug(debug);
      var namedExports = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        DEFAULT_MAX_CONNECTIONS,
        Dexie: Dexie$1,
        Entity: Entity2,
        PropModification: PropModification2,
        RangeSet: RangeSet2,
        add: add2,
        cmp: cmp2,
        default: Dexie$1,
        liveQuery: liveQuery2,
        mergeRanges: mergeRanges2,
        rangesOverlap: rangesOverlap2,
        remove: remove2,
        replacePrefix: replacePrefix2
      });
      __assign(Dexie$1, namedExports, { default: Dexie$1 });
      return Dexie$1;
    }));
  }
});

// src/app/core/geo.ts
var R = 63710088e-1;
var rad = (d) => d * Math.PI / 180;
function distanceM(lat1, lon1, lat2, lon2) {
  const dp = rad(lat2 - lat1), dl = rad(lon2 - lon1);
  const h = Math.sin(dp / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function bearingDeg(lat1, lon1, lat2, lon2) {
  const y = Math.sin(rad(lon2 - lon1)) * Math.cos(rad(lat2));
  const x = Math.cos(rad(lat1)) * Math.sin(rad(lat2)) - Math.sin(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(rad(lon2 - lon1));
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}
function compass(deg) {
  return ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(deg / 45) % 8];
}
function humanDistance(m) {
  return m < 1e3 ? `${Math.round(m)} m` : `${(m / 1e3).toFixed(m < 1e4 ? 1 : 0)} km`;
}
function inRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function polygonContains(geom, lat, lon) {
  if (!geom) return false;
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.type === "MultiPolygon" ? geom.coordinates : [];
  return polys.some((p) => inRing(lon, lat, p[0]) && !p.slice(1).some((h) => inRing(lon, lat, h)));
}

// node_modules/dexie/import-wrapper.mjs
var import_dexie = __toESM(require_dexie(), 1);
var DexieSymbol = /* @__PURE__ */ Symbol.for("Dexie");
var Dexie = globalThis[DexieSymbol] || (globalThis[DexieSymbol] = import_dexie.default);
if (import_dexie.default.semVer !== Dexie.semVer) {
  throw new Error(`Two different versions of Dexie loaded in the same app: ${import_dexie.default.semVer} and ${Dexie.semVer}`);
}
var {
  liveQuery,
  mergeRanges,
  rangesOverlap,
  RangeSet,
  cmp,
  Entity,
  PropModification,
  replacePrefix,
  add,
  remove,
  DexieYProvider
} = Dexie;
var import_wrapper_default = Dexie;

// src/app/core/offline.ts
var FieldDb = class extends import_wrapper_default {
  bundles;
  samples;
  practices;
  constructor() {
    super("vc-field");
    this.version(1).stores({
      bundles: "campaignId, savedAt",
      samples: "localId, campaignId, pointId, state, createdAt",
      practices: "localId, state, createdAt"
    });
  }
};
function permanent(e) {
  return e.status >= 400 && e.status < 500 && ![401, 408, 425, 429].includes(e.status);
}
function deviceId() {
  const k = "vc.device";
  let v = localStorage.getItem(k);
  if (!v) {
    v = `web-${crypto.randomUUID().slice(0, 8)}`;
    localStorage.setItem(k, v);
  }
  return v;
}
var OfflineStore = class _OfflineStore {
  api = inject(ApiService);
  zone = inject(NgZone);
  db = new FieldDb();
  online = signal(
    navigator.onLine,
    ...ngDevMode ? [{ debugName: "online" }] : (
      /* istanbul ignore next */
      []
    )
  );
  syncing = signal(
    false,
    ...ngDevMode ? [{ debugName: "syncing" }] : (
      /* istanbul ignore next */
      []
    )
  );
  queued = signal(
    0,
    ...ngDevMode ? [{ debugName: "queued" }] : (
      /* istanbul ignore next */
      []
    )
  );
  rejected = signal(
    0,
    ...ngDevMode ? [{ debugName: "rejected" }] : (
      /* istanbul ignore next */
      []
    )
  );
  lastSync = signal(
    localStorage.getItem("vc.lastSync"),
    ...ngDevMode ? [{ debugName: "lastSync" }] : (
      /* istanbul ignore next */
      []
    )
  );
  /** Bumped whenever the local queue changes, so screens can re-read it. */
  changed = signal(
    0,
    ...ngDevMode ? [{ debugName: "changed" }] : (
      /* istanbul ignore next */
      []
    )
  );
  status = computed(
    () => !this.online() ? "offline" : this.syncing() ? "syncing" : this.queued() ? "pending" : "ok",
    ...ngDevMode ? [{ debugName: "status" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    window.addEventListener("online", () => this.zone.run(() => {
      this.online.set(true);
      void this.sync();
    }));
    window.addEventListener("offline", () => this.zone.run(() => this.online.set(false)));
    void this.recover().then(() => this.refreshCounts());
  }
  /* ---------------------------------------------------------------- bundles */
  async saveBundle(b) {
    await this.db.bundles.put(__spreadProps(__spreadValues({}, b), { savedAt: (/* @__PURE__ */ new Date()).toISOString() }));
  }
  bundle(campaignId) {
    return this.db.bundles.get(campaignId);
  }
  bundles() {
    return this.db.bundles.toArray();
  }
  async removeBundle(campaignId) {
    await this.db.bundles.delete(campaignId);
  }
  /* ---------------------------------------------------------------- samples */
  async queueSample(s) {
    await this.db.samples.put(__spreadProps(__spreadValues({}, s), { state: "queued", attempts: 0, createdAt: (/* @__PURE__ */ new Date()).toISOString() }));
    await this.refreshCounts();
    if (this.online())
      void this.sync();
  }
  samplesFor(campaignId) {
    return this.db.samples.where("campaignId").equals(campaignId).toArray();
  }
  allSamples() {
    return this.db.samples.orderBy("createdAt").reverse().toArray();
  }
  async discardSample(localId) {
    await this.db.samples.delete(localId);
    await this.refreshCounts();
  }
  /* ---------------------------------------------------------------- practices */
  async queuePractice(p) {
    await this.db.practices.put(__spreadProps(__spreadValues({}, p), { state: "queued", attempts: 0, createdAt: (/* @__PURE__ */ new Date()).toISOString() }));
    await this.refreshCounts();
    if (this.online())
      void this.sync();
  }
  allPractices() {
    return this.db.practices.orderBy("createdAt").reverse().toArray();
  }
  async discardPractice(localId) {
    await this.db.practices.delete(localId);
    await this.refreshCounts();
  }
  /* ---------------------------------------------------------------- sync */
  async sync() {
    if (this.syncing() || !navigator.onLine)
      return;
    this.syncing.set(true);
    try {
      for (const s of await this.db.samples.where("state").equals("queued").sortBy("createdAt")) {
        await this.pushSample(s);
        await this.refreshCounts();
      }
      for (const p of await this.db.practices.where("state").equals("queued").sortBy("createdAt")) {
        await this.pushPractice(p);
        await this.refreshCounts();
      }
      const now = (/* @__PURE__ */ new Date()).toISOString();
      localStorage.setItem("vc.lastSync", now);
      this.lastSync.set(now);
    } finally {
      this.syncing.set(false);
      await this.refreshCounts();
    }
  }
  async uploadPhotos(photos, entity, save) {
    const out = [];
    for (const [i, ph] of photos.entries()) {
      if (ph.serverId) {
        out.push(ph);
        continue;
      }
      const form = new FormData();
      form.append("file", new File([ph.blob], ph.name, { type: ph.type }));
      form.append("kind", "photo");
      form.append("entity_type", entity);
      if (ph.lat !== null)
        form.append("latitude", String(ph.lat));
      if (ph.lon !== null)
        form.append("longitude", String(ph.lon));
      const r = await firstValueFrom(this.api.upload("/evidence", form));
      out.push(__spreadProps(__spreadValues({}, ph), { serverId: r.id }));
      await save([...out, ...photos.slice(i + 1)]);
    }
    return out;
  }
  async pushSample(s) {
    await this.db.samples.update(s.localId, { state: "syncing" });
    try {
      const photos = await this.uploadPhotos(s.photos, "sample", (ph) => this.db.samples.update(s.localId, { photos: ph }));
      await this.db.samples.update(s.localId, { photos });
      const res = await firstValueFrom(
        // POST /samples answers { replayed, sample: {id, code, …}, findings } (200 when replayed).
        this.api.post("/samples", __spreadProps(__spreadValues({}, s.payload), {
          client_ref: s.localId,
          point_id: s.pointId,
          photo_ids: photos.map((p) => p.serverId)
        }), { "Idempotency-Key": s.localId })
      );
      await this.db.samples.update(s.localId, {
        state: "synced",
        serverId: res.sample?.id,
        serverCode: res.sample?.code,
        findings: res.findings ?? [],
        error: void 0
      });
    } catch (err) {
      const e = err;
      await this.db.samples.update(s.localId, {
        state: permanent(e) ? "rejected" : "queued",
        attempts: s.attempts + 1,
        error: e.message
      });
    }
  }
  async pushPractice(p) {
    await this.db.practices.update(p.localId, { state: "syncing" });
    try {
      const photos = await this.uploadPhotos(p.photos, "practice", (ph) => this.db.practices.update(p.localId, { photos: ph }));
      await this.db.practices.update(p.localId, { photos });
      const res = await firstValueFrom(this.api.post("/practices", __spreadProps(__spreadValues({}, p.payload), {
        client_ref: p.localId,
        evidence_ids: photos.map((ph) => ph.serverId)
      }), { "Idempotency-Key": p.localId }));
      await this.db.practices.update(p.localId, { state: "synced", serverId: res.record_id ?? res.id, error: void 0 });
    } catch (err) {
      const e = err;
      await this.db.practices.update(p.localId, {
        state: permanent(e) ? "rejected" : "queued",
        attempts: p.attempts + 1,
        error: e.message
      });
    }
  }
  /** A tab closed mid-upload leaves records in 'syncing'; put them back in the queue. */
  async recover() {
    await this.db.samples.where("state").equals("syncing").modify({ state: "queued" });
    await this.db.practices.where("state").equals("syncing").modify({ state: "queued" });
  }
  async requeue(localId, kind) {
    const t = kind === "sample" ? this.db.samples : this.db.practices;
    await t.update(localId, { state: "queued", error: void 0 });
    await this.refreshCounts();
    void this.sync();
  }
  async refreshCounts() {
    const [q1, q2, r1, r2] = await Promise.all([
      this.db.samples.where("state").anyOf("queued", "syncing").count(),
      this.db.practices.where("state").anyOf("queued", "syncing").count(),
      this.db.samples.where("state").equals("rejected").count(),
      this.db.practices.where("state").equals("rejected").count()
    ]);
    this.zone.run(() => {
      this.queued.set(q1 + q2);
      this.rejected.set(r1 + r2);
      this.changed.update((v) => v + 1);
    });
  }
  /** Remove synced records older than 30 days (photos included) to free space. */
  async prune(days = 30) {
    const cutoff = new Date(Date.now() - days * 864e5).toISOString();
    await this.db.samples.where("state").equals("synced").and((s) => s.createdAt < cutoff).delete();
    await this.db.practices.where("state").equals("synced").and((p) => p.createdAt < cutoff).delete();
  }
  static \u0275fac = function OfflineStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OfflineStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _OfflineStore, factory: _OfflineStore.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OfflineStore, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [], null);
})();

// src/app/features/field-app/field-data.ts
var A_KEY = "vc.field.assignments";
var PT_KEY = "vc.field.practiceTypes";
var F_KEY = "vc.field.fields";
function readJson(k, fallback) {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
var FieldData = class _FieldData {
  api = inject(ApiService);
  store = inject(OfflineStore);
  assignments = signal(
    readJson(A_KEY, []),
    ...ngDevMode ? [{ debugName: "assignments" }] : (
      /* istanbul ignore next */
      []
    )
  );
  assignmentsAt = signal(
    localStorage.getItem(A_KEY + ".at"),
    ...ngDevMode ? [{ debugName: "assignmentsAt" }] : (
      /* istanbul ignore next */
      []
    )
  );
  bundles = signal(
    [],
    ...ngDevMode ? [{ debugName: "bundles" }] : (
      /* istanbul ignore next */
      []
    )
  );
  async refreshBundles() {
    this.bundles.set(await this.store.bundles());
  }
  async loadAssignments() {
    const r = await firstValueFrom(this.api.get("/me/assignments"));
    const now = (/* @__PURE__ */ new Date()).toISOString();
    localStorage.setItem(A_KEY, JSON.stringify(r));
    localStorage.setItem(A_KEY + ".at", now);
    this.assignments.set(r);
    this.assignmentsAt.set(now);
  }
  /** Download everything needed to work a campaign offline. */
  async download(campaignId) {
    const b = await firstValueFrom(this.api.get(`/campaigns/${campaignId}/bundle`));
    const bundle = {
      campaignId: b.campaign.id,
      campaign: {
        id: b.campaign.id,
        code: b.campaign.code,
        name: b.campaign.name,
        kind: b.campaign.kind,
        design: b.campaign.design,
        depth_from_cm: b.campaign.depth_from_cm,
        depth_to_cm: b.campaign.depth_to_cm
      },
      thresholds: {
        gps_accuracy_max_m: b.rules.gps_accuracy_max_m,
        max_distance_from_site_m: b.rules.max_distance_from_site_m,
        required_photos: b.rules.required_photos
      },
      points: b.points.map((p) => ({
        id: p.id,
        site_code: p.site_code,
        latitude: p.latitude,
        longitude: p.longitude,
        field_code: p.field_code,
        field_id: p.field_id,
        status: p.status,
        sequence: p.sequence
      })),
      fields: b.fields,
      project: b.project,
      rulesApproved: b.rules.approved,
      shallowSoilAllowed: b.rules.shallow_soil_allowed
    };
    await this.store.saveBundle(bundle);
    await this.refreshBundles();
    this.rememberFields(b.fields);
    return await this.store.bundle(campaignId);
  }
  async bundle(campaignId, allowDownload = true) {
    const b = await this.store.bundle(campaignId);
    if (b || !allowDownload || !navigator.onLine)
      return b;
    return this.download(campaignId);
  }
  /* ---------------------------------------------------------------- practice form data */
  practiceTypes() {
    return readJson(PT_KEY, []);
  }
  async loadPracticeTypes() {
    const r = await firstValueFrom(this.api.get("/catalogue/practice-types"));
    const active = r.filter((t) => t.is_active);
    localStorage.setItem(PT_KEY, JSON.stringify(active));
    return active;
  }
  fields() {
    const byId = /* @__PURE__ */ new Map();
    for (const f of readJson(F_KEY, []))
      byId.set(f.id, f);
    for (const b of this.bundles()) {
      for (const ft of b.fields.features) {
        const p = ft.properties ?? {};
        byId.set(String(p["id"]), { id: String(p["id"]), code: String(p["code"] ?? ""), name: String(p["name"] ?? "") });
      }
    }
    return [...byId.values()].sort((a, b) => a.code.localeCompare(b.code));
  }
  async loadFields() {
    try {
      const r = await firstValueFrom(this.api.get("/fields", { limit: 500 }));
      localStorage.setItem(F_KEY, JSON.stringify(r.items.map((f) => ({ id: f.id, code: f.code, name: f.name }))));
    } catch (e) {
      if (e.status !== 403)
        throw e;
    }
  }
  rememberFields(fc) {
    const list = readJson(F_KEY, []);
    const byId = new Map(list.map((f) => [f.id, f]));
    for (const ft of fc.features) {
      const p = ft.properties ?? {};
      byId.set(String(p["id"]), { id: String(p["id"]), code: String(p["code"] ?? ""), name: String(p["name"] ?? "") });
    }
    localStorage.setItem(F_KEY, JSON.stringify([...byId.values()]));
  }
  static \u0275fac = function FieldData_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FieldData)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FieldData, factory: _FieldData.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldData, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/features/field-app/gps.service.ts
var FieldGps = class _FieldGps {
  zone = inject(NgZone);
  watchId = null;
  users = 0;
  fix = signal(
    null,
    ...ngDevMode ? [{ debugName: "fix" }] : (
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
  /** Compass heading of the phone (degrees from north) when the device reports it. */
  heading = signal(
    null,
    ...ngDevMode ? [{ debugName: "heading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  supported = typeof navigator !== "undefined" && "geolocation" in navigator;
  state = computed(
    () => !this.supported ? "unsupported" : this.error() && !this.fix() ? "error" : this.fix() ? "ok" : "waiting",
    ...ngDevMode ? [{ debugName: "state" }] : (
      /* istanbul ignore next */
      []
    )
  );
  onOrient = (e) => {
    const ev = e;
    const h = typeof ev.webkitCompassHeading === "number" ? ev.webkitCompassHeading : e.absolute && typeof e.alpha === "number" ? (360 - e.alpha) % 360 : null;
    if (h !== null)
      this.zone.run(() => this.heading.set(h));
  };
  start() {
    this.users++;
    if (this.watchId !== null || !this.supported)
      return;
    this.watchId = navigator.geolocation.watchPosition((p) => this.zone.run(() => {
      this.error.set(null);
      this.fix.set({ lat: p.coords.latitude, lon: p.coords.longitude, accuracy: p.coords.accuracy, at: new Date(p.timestamp).toISOString() });
    }), (e) => this.zone.run(() => this.error.set(e.code === e.PERMISSION_DENIED ? "Location permission is off. Allow location for this site in your browser settings." : e.code === e.TIMEOUT ? "Still searching for a GPS signal. Move into the open, away from trees and buildings." : "The phone could not work out its position.")), { enableHighAccuracy: true, maximumAge: 2e3, timeout: 3e4 });
    window.addEventListener("deviceorientationabsolute", this.onOrient);
    window.addEventListener("deviceorientation", this.onOrient);
  }
  stop() {
    this.users = Math.max(0, this.users - 1);
    if (this.users > 0 || this.watchId === null)
      return;
    navigator.geolocation.clearWatch(this.watchId);
    this.watchId = null;
    window.removeEventListener("deviceorientationabsolute", this.onOrient);
    window.removeEventListener("deviceorientation", this.onOrient);
  }
  static \u0275fac = function FieldGps_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FieldGps)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FieldGps, factory: _FieldGps.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldGps, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/features/field-app/point-status.ts
var LOCAL_LABEL = {
  planned: "To do",
  saved: "Saved on phone",
  uploading: "Uploading",
  synced: "Uploaded",
  rejected: "Rejected",
  collected: "Collected",
  skipped: "Skipped"
};
var LOCAL_TONE = {
  planned: "info",
  saved: "warn",
  uploading: "warn",
  synced: "ok",
  rejected: "bad",
  collected: "ok",
  skipped: "muted"
};
var LOCAL_COLOR = {
  planned: "#1f5f99",
  saved: "#e0a225",
  uploading: "#e0a225",
  synced: "#2f7249",
  rejected: "#b3261e",
  collected: "#2f7249",
  skipped: "#9aa29c"
};
function localStatus(p, samples) {
  const s = samples.filter((x) => x.pointId === p.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  if (s) {
    if (s.state === "queued") return "saved";
    if (s.state === "syncing") return "uploading";
    if (s.state === "synced") return "synced";
    if (s.state === "rejected") return p.status === "planned" ? "rejected" : p.status;
  }
  return p.status === "collected" ? "collected" : p.status === "skipped" ? "skipped" : "planned";
}

// src/app/features/field-app/field-campaign.ts
var _c0 = (a0) => ["/field/campaign", a0];
var _forTrack0 = ($index, $item) => $item.campaignId;
var _forTrack1 = ($index, $item) => $item.id;
function FieldCampaign_Conditional_0_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 2)(1, "span")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "em");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(6, "vc-icon", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const b_r1 = ctx.$implicit;
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(4, _c0, b_r1.campaignId));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(b_r1.campaign.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r1.campaign.name);
    \u0275\u0275advance();
    \u0275\u0275property("size", 22);
  }
}
function FieldCampaign_Conditional_0_ForEmpty_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "div", 5);
    \u0275\u0275element(2, "vc-icon", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4, "No campaigns on this phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "Download a campaign from Home to see its points on the map, even without signal.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "a", 7);
    \u0275\u0275text(8, "Go to Home");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 26);
  }
}
function FieldCampaign_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
    \u0275\u0275text(2, "Choose a campaign");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, FieldCampaign_Conditional_0_For_4_Template, 7, 6, "a", 2, _forTrack0, false, FieldCampaign_Conditional_0_ForEmpty_5_Template, 9, 1, "div", 3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.data.bundles());
  }
}
function FieldCampaign_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 3)(2, "div", 5);
    \u0275\u0275element(3, "vc-icon", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h3");
    \u0275\u0275text(5, "Opening campaign\u2026");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 26);
  }
}
function FieldCampaign_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 3)(2, "div", 5);
    \u0275\u0275element(3, "vc-icon", 9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h3");
    \u0275\u0275text(5, "This campaign isn't on this phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "a", 7);
    \u0275\u0275text(9, "Back to Home");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 26);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.error() || "Connect to the internet once to download it.");
  }
}
function FieldCampaign_Conditional_3_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275element(1, "vc-icon", 24);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.gps.error());
  }
}
function FieldCampaign_Conditional_3_For_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 25);
    \u0275\u0275listener("click", function FieldCampaign_Conditional_3_For_28_Template_button_click_0_listener() {
      const r_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.openPoint(r_r5));
    });
    \u0275\u0275elementStart(1, "span", 26);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(2, "svg", 27);
    \u0275\u0275element(3, "path", 28);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(4, "span", 29)(5, "strong", 30);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "span", 31)(10, "strong", 32);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "span", 33);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const r_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275styleProp("transform", "rotate(" + ctx_r1.arrowDeg(r_r5) + "deg)");
    \u0275\u0275classProp("none", r_r5.bearing === null);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(r_r5.site);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Field ", r_r5.field);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(r_r5.dist === null ? "\u2014" : ctx_r1.human(r_r5.dist));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(r_r5.bearing === null ? "no GPS" : ctx_r1.dir(r_r5.bearing));
    \u0275\u0275advance();
    \u0275\u0275classMap("chip " + ctx_r1.tone[r_r5.status]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.label[r_r5.status]);
  }
}
function FieldCampaign_Conditional_3_ForEmpty_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "div", 5);
    \u0275\u0275element(2, "vc-icon", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4, "All your points are done");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "Check the Outbox to make sure everything has uploaded.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "a", 35);
    \u0275\u0275text(8, "Open Outbox");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 26);
  }
}
function FieldCampaign_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "a", 11);
    \u0275\u0275element(2, "vc-icon", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 13)(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "span", 14);
    \u0275\u0275element(9, "vc-icon", 15);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "vc-map", 16);
    \u0275\u0275listener("featureClick", function FieldCampaign_Conditional_3_Template_vc_map_featureClick_11_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onMap($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, FieldCampaign_Conditional_3_Conditional_12_Template, 3, 2, "div", 17);
    \u0275\u0275elementStart(13, "div", 18)(14, "div", 19)(15, "div", 20)(16, "button", 21);
    \u0275\u0275listener("click", function FieldCampaign_Conditional_3_Template_button_click_16_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.filter.set("todo"));
    });
    \u0275\u0275text(17, "To do ");
    \u0275\u0275elementStart(18, "b");
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(20, "button", 21);
    \u0275\u0275listener("click", function FieldCampaign_Conditional_3_Template_button_click_20_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.filter.set("all"));
    });
    \u0275\u0275text(21, "All ");
    \u0275\u0275elementStart(22, "b");
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "span", 22);
    \u0275\u0275text(25);
    \u0275\u0275pipe(26, "ago");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(27, FieldCampaign_Conditional_3_For_28_Template, 16, 11, "button", 23, _forTrack1, false, FieldCampaign_Conditional_3_ForEmpty_29_Template, 9, 1, "div", 3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    const b_r6 = ctx_r1.bundle();
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 22);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(b_r6.campaign.code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(b_r6.campaign.name);
    \u0275\u0275advance();
    \u0275\u0275classMap("gps " + ctx_r1.gpsTone());
    \u0275\u0275advance();
    \u0275\u0275property("size", 16)("stroke", 2.2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.gpsText());
    \u0275\u0275advance();
    \u0275\u0275property("polygons", ctx_r1.fieldsFc())("points", ctx_r1.pointsFc());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.gps.error() ? 12 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("on", ctx_r1.filter() === "todo");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.todoCount());
    \u0275\u0275advance();
    \u0275\u0275classProp("on", ctx_r1.filter() === "all");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.rows().length);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Saved ", \u0275\u0275pipeBind1(26, 19, b_r6.savedAt));
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.shown());
  }
}
var FieldCampaign = class _FieldCampaign {
  router = inject(Router);
  toast = inject(ToastService);
  store = inject(OfflineStore);
  data = inject(FieldData);
  gps = inject(FieldGps);
  cid = input(
    "",
    ...ngDevMode ? [{ debugName: "cid" }] : (
      /* istanbul ignore next */
      []
    )
  );
  bundle = signal(
    null,
    ...ngDevMode ? [{ debugName: "bundle" }] : (
      /* istanbul ignore next */
      []
    )
  );
  samples = signal(
    [],
    ...ngDevMode ? [{ debugName: "samples" }] : (
      /* istanbul ignore next */
      []
    )
  );
  loading = signal(
    false,
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
  filter = signal(
    "todo",
    ...ngDevMode ? [{ debugName: "filter" }] : (
      /* istanbul ignore next */
      []
    )
  );
  label = LOCAL_LABEL;
  tone = LOCAL_TONE;
  rows = computed(
    () => {
      const b = this.bundle();
      if (!b)
        return [];
      const f = this.gps.fix();
      const out = b.points.map((p) => ({
        id: p.id,
        site: p.site_code,
        field: p.field_code ?? "",
        status: localStatus(p, this.samples()),
        seq: p.sequence ?? 0,
        dist: f ? distanceM(f.lat, f.lon, p.latitude, p.longitude) : null,
        bearing: f ? bearingDeg(f.lat, f.lon, p.latitude, p.longitude) : null
      }));
      return out.sort((a, b2) => a.dist !== null && b2.dist !== null ? a.dist - b2.dist : a.seq - b2.seq);
    },
    ...ngDevMode ? [{ debugName: "rows" }] : (
      /* istanbul ignore next */
      []
    )
  );
  todoCount = computed(
    () => this.rows().filter((r) => r.status === "planned" || r.status === "rejected").length,
    ...ngDevMode ? [{ debugName: "todoCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  shown = computed(
    () => this.filter() === "all" ? this.rows() : this.rows().filter((r) => r.status === "planned" || r.status === "rejected"),
    ...ngDevMode ? [{ debugName: "shown" }] : (
      /* istanbul ignore next */
      []
    )
  );
  gpsTone = computed(
    () => {
      const f = this.gps.fix();
      if (!f)
        return "bad";
      const max = this.bundle()?.thresholds.gps_accuracy_max_m ?? 10;
      return f.accuracy <= max ? "ok" : "warn";
    },
    ...ngDevMode ? [{ debugName: "gpsTone" }] : (
      /* istanbul ignore next */
      []
    )
  );
  gpsText = computed(
    () => {
      const f = this.gps.fix();
      return f ? `\xB1${Math.round(f.accuracy)} m` : this.gps.supported ? "Finding GPS" : "No GPS";
    },
    ...ngDevMode ? [{ debugName: "gpsText" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fieldsFc = computed(
    () => {
      const b = this.bundle();
      if (!b)
        return null;
      return __spreadProps(__spreadValues({}, b.fields), { features: b.fields.features.map((f) => __spreadProps(__spreadValues({}, f), { properties: __spreadProps(__spreadValues({}, f.properties), { color: "#2f7249", label: `<strong>${f.properties?.["code"]}</strong>` }) })) });
    },
    ...ngDevMode ? [{ debugName: "fieldsFc" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pointsFc = computed(
    () => {
      const b = this.bundle();
      const f = this.gps.fix();
      const byId = new Map(this.rows().map((r) => [r.id, r]));
      const feats = (b?.points ?? []).map((p) => {
        const st = byId.get(p.id)?.status ?? "planned";
        return {
          type: "Feature",
          geometry: { type: "Point", coordinates: [p.longitude, p.latitude] },
          properties: { id: p.id, color: LOCAL_COLOR[st], label: `<strong>${p.site_code}</strong><br>${LOCAL_LABEL[st]}` }
        };
      });
      if (f)
        feats.push({ type: "Feature", geometry: { type: "Point", coordinates: [f.lon, f.lat] }, properties: { id: "__me", color: "#0b1f15", label: "You are here" } });
      return { type: "FeatureCollection", features: feats };
    },
    ...ngDevMode ? [{ debugName: "pointsFc" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.gps.start();
    effect(() => {
      const id = this.cid();
      if (id)
        void this.load(id);
    });
    effect(() => {
      this.store.changed();
      const id = this.cid();
      if (id)
        void this.store.samplesFor(id).then((s) => this.samples.set(s));
    });
  }
  async load(id) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const b = await this.data.bundle(id);
      this.bundle.set(b ?? null);
      if (b)
        localStorage.setItem("vc.field.lastCampaign", id);
    } catch (e) {
      this.error.set(e.message ?? "Download failed.");
    } finally {
      this.loading.set(false);
    }
  }
  arrowDeg(r) {
    if (r.bearing === null)
      return 0;
    return r.bearing - (this.gps.heading() ?? 0);
  }
  human(m) {
    return humanDistance(m);
  }
  dir(b) {
    return compass(b);
  }
  openPoint(r) {
    if (r.status === "saved" || r.status === "uploading" || r.status === "synced" || r.status === "collected") {
      this.toast.info(`${r.site} is already ${LOCAL_LABEL[r.status].toLowerCase()}`, "Open the Outbox to see what was recorded.");
      return;
    }
    if (r.status === "skipped") {
      this.toast.info(`${r.site} was skipped`, "Ask your supervisor if it should be sampled after all.");
      return;
    }
    this.router.navigate(["/field/campaign", this.cid(), "point", r.id]);
  }
  onMap(e) {
    if (e.layer !== "point" || e.id === "__me")
      return;
    const r = this.rows().find((x) => x.id === e.id);
    if (r)
      this.openPoint(r);
  }
  ngOnDestroy() {
    this.gps.stop();
  }
  static \u0275fac = function FieldCampaign_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FieldCampaign)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FieldCampaign, selectors: [["vc-field-campaign"]], inputs: { cid: [1, "cid"] }, decls: 4, vars: 1, consts: [[1, "fpage"], [1, "ftitle"], [1, "fcard", "pick", 3, "routerLink"], [1, "fcard", "fempty"], ["name", "chevron-right", 3, "size"], [1, "ic"], ["name", "map", 3, "size"], ["routerLink", "/field", 1, "fbtn", "secondary"], ["name", "download", 3, "size"], ["name", "wifi-off", 3, "size"], [1, "head"], ["routerLink", "/field", "aria-label", "Back", 1, "back"], ["name", "arrow-left", 3, "size"], [1, "ht"], [1, "gps"], ["name", "locate", 3, "size", "stroke"], ["height", "38vh", 1, "map", 3, "featureClick", "polygons", "points"], [1, "gpserr"], [1, "fpage", "list"], [1, "lhead"], [1, "seg"], [3, "click"], [1, "saved"], [1, "fcard", "pt"], ["name", "alert", 3, "size"], [1, "fcard", "pt", 3, "click"], [1, "arrow"], ["viewBox", "0 0 24 24", "width", "30", "height", "30"], ["d", "M12 2 19 20 12 16 5 20Z", "fill", "currentColor"], [1, "pi"], [1, "mono"], [1, "pd"], [1, "num"], [1, "chip"], ["name", "check-circle", 3, "size"], ["routerLink", "/field/outbox", 1, "fbtn", "secondary"]], template: function FieldCampaign_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, FieldCampaign_Conditional_0_Template, 6, 1, "div", 0)(1, FieldCampaign_Conditional_1_Template, 6, 1, "div", 0)(2, FieldCampaign_Conditional_2_Template, 10, 2, "div", 0)(3, FieldCampaign_Conditional_3_Template, 30, 21);
    }
    if (rf & 2) {
      \u0275\u0275conditional(!ctx.cid() ? 0 : ctx.loading() ? 1 : !ctx.bundle() ? 2 : 3);
    }
  }, dependencies: [RouterLink, Icon, MapView, AgoPipe], styles: [`
[_nghost-%COMP%] {
  display: block;
}
.fpage[_ngcontent-%COMP%] {
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ftitle[_ngcontent-%COMP%] {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--%NS%stone-900);
  line-height: 1.2;
}
.fsub[_ngcontent-%COMP%] {
  font-size: 14.5px;
  color: var(--%NS%stone-700);
}
.fcard[_ngcontent-%COMP%] {
  background: #fff;
  border: 1.5px solid var(--%NS%sand-300);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(16, 41, 28, 0.06);
}
.fcard-pad[_ngcontent-%COMP%] {
  padding: 16px;
}
.fsec[_ngcontent-%COMP%] {
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--%NS%stone-600);
  margin: 4px 2px -6px;
}
.fbtn[_ngcontent-%COMP%] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 20px;
  border-radius: 12px;
  border: 2px solid transparent;
  font: 600 16px var(--%NS%font);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  text-decoration: none !important;
  -webkit-tap-highlight-color: transparent;
}
.fbtn[_ngcontent-%COMP%]:active {
  transform: translateY(1px);
}
.fbtn[disabled][_ngcontent-%COMP%] {
  opacity: 0.45;
  cursor: not-allowed;
}
.fbtn.primary[_ngcontent-%COMP%] {
  background: var(--%NS%forest-700);
  color: #fff;
}
.fbtn.primary[_ngcontent-%COMP%]:hover:not([disabled]) {
  background: var(--%NS%forest-800);
}
.fbtn.secondary[_ngcontent-%COMP%] {
  background: #fff;
  color: var(--%NS%forest-800);
  border-color: var(--%NS%forest-700);
}
.fbtn.ghost[_ngcontent-%COMP%] {
  background: transparent;
  color: var(--%NS%stone-800);
  border-color: var(--%NS%sand-300);
}
.fbtn.danger[_ngcontent-%COMP%] {
  background: #fff;
  color: var(--%NS%red-600);
  border-color: var(--%NS%red-600);
}
.fbtn.block[_ngcontent-%COMP%] {
  width: 100%;
}
.fbtn.sm[_ngcontent-%COMP%] {
  min-height: 44px;
  padding: 0 14px;
  font-size: 15px;
  border-radius: 10px;
}
.finput[_ngcontent-%COMP%] {
  width: 100%;
  min-height: 52px;
  padding: 0 14px;
  border: 2px solid var(--%NS%stone-300);
  border-radius: 12px;
  background: #fff;
  font: 500 17px var(--%NS%font);
  color: var(--%NS%stone-900);
  outline: none;
}
textarea.finput[_ngcontent-%COMP%] {
  min-height: 96px;
  padding: 12px 14px;
  line-height: 1.45;
}
select.finput[_ngcontent-%COMP%] {
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231d2420' stroke-width='2.2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}
.finput[_ngcontent-%COMP%]:focus {
  border-color: var(--%NS%forest-600);
  box-shadow: 0 0 0 3px rgba(47, 114, 73, 0.25);
}
.finput.bad[_ngcontent-%COMP%] {
  border-color: var(--%NS%red-600);
}
.flabel[_ngcontent-%COMP%] {
  display: block;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--%NS%stone-800);
  margin-bottom: 6px;
}
.fhint[_ngcontent-%COMP%] {
  font-size: 13.5px;
  color: var(--%NS%stone-600);
  margin-top: 6px;
}
.ferr[_ngcontent-%COMP%] {
  font-size: 14px;
  color: var(--%NS%red-600);
  margin-top: 6px;
  font-weight: 500;
}
.chip[_ngcontent-%COMP%] {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.chip.ok[_ngcontent-%COMP%] {
  background: var(--%NS%forest-100);
  color: var(--%NS%forest-800);
}
.chip.warn[_ngcontent-%COMP%] {
  background: var(--%NS%amber-100);
  color: #7a4d00;
}
.chip.bad[_ngcontent-%COMP%] {
  background: var(--%NS%red-100);
  color: var(--%NS%red-600);
}
.chip.info[_ngcontent-%COMP%] {
  background: var(--%NS%sky-100);
  color: var(--%NS%sky-600);
}
.chip.muted[_ngcontent-%COMP%] {
  background: var(--%NS%stone-100);
  color: var(--%NS%stone-700);
}
.fempty[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 28px 16px;
  color: var(--%NS%stone-700);
}
.fempty[_ngcontent-%COMP%]   .ic[_ngcontent-%COMP%] {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--%NS%sand-200);
  color: var(--%NS%stone-700);
  margin-bottom: 4px;
}
.fempty[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
  font-size: 17px;
}
.num[_ngcontent-%COMP%] {
  font-variant-numeric: tabular-nums;
}
.mono[_ngcontent-%COMP%] {
  font-family: var(--%NS%mono);
}
/*# sourceMappingURL=field-campaign.css.map */`, "\n.pick[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 16px;\n  text-decoration: none !important;\n  color: var(--%NS%stone-900);\n}\n.pick[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n}\n.pick[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-style: normal;\n  color: var(--%NS%stone-600);\n  font-size: 14px;\n}\n.head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 12px;\n  background: #fff;\n  border-bottom: 1.5px solid var(--%NS%sand-300);\n}\n.back[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  color: var(--%NS%stone-900);\n}\n.ht[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  line-height: 1.25;\n}\n.ht[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n.ht[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  color: var(--%NS%stone-600);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.gps[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 34px;\n  padding: 0 10px;\n  border-radius: 999px;\n  font-size: 13px;\n  font-weight: 600;\n  white-space: nowrap;\n}\n.gps.ok[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-800);\n}\n.gps.warn[_ngcontent-%COMP%] {\n  background: var(--%NS%amber-100);\n  color: #7a4d00;\n}\n.gps.bad[_ngcontent-%COMP%] {\n  background: var(--%NS%red-100);\n  color: var(--%NS%red-600);\n}\n.map[_ngcontent-%COMP%] {\n  border-radius: 0;\n  border-left: 0;\n  border-right: 0;\n}\n.gpserr[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: flex-start;\n  padding: 10px 16px;\n  background: var(--%NS%amber-100);\n  color: #5c3a00;\n  font-size: 14px;\n}\n.list[_ngcontent-%COMP%] {\n  gap: 10px;\n}\n.lhead[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n.seg[_ngcontent-%COMP%] {\n  display: flex;\n  background: #fff;\n  border: 1.5px solid var(--%NS%sand-300);\n  border-radius: 12px;\n  padding: 4px;\n  gap: 4px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  min-height: 40px;\n  padding: 0 14px;\n  border: 0;\n  border-radius: 9px;\n  background: none;\n  font: 600 15px var(--%NS%font);\n  color: var(--%NS%stone-700);\n  cursor: pointer;\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-700);\n  color: #fff;\n}\n.seg[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  margin-left: 4px;\n  opacity: 0.8;\n}\n.saved[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--%NS%stone-600);\n}\n.pt[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  width: 100%;\n  min-height: 76px;\n  padding: 10px 14px;\n  text-align: left;\n  font: inherit;\n  cursor: pointer;\n  color: var(--%NS%stone-900);\n}\n.arrow[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 46px;\n  height: 46px;\n  border-radius: 50%;\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-800);\n  flex: none;\n  transition: transform 0.3s;\n}\n.arrow.none[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-400);\n  background: var(--%NS%stone-100);\n}\n.pi[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.pi[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n.pi[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: var(--%NS%stone-600);\n}\n.pd[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 2px;\n  min-width: 64px;\n}\n.pd[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 17px;\n}\n.pd[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--%NS%stone-600);\n}\n@media (max-width: 380px) {\n  .pt[_ngcontent-%COMP%]   .chip[_ngcontent-%COMP%] {\n    display: none;\n  }\n}\n/*# sourceMappingURL=field-campaign.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldCampaign, [{
    type: Component,
    args: [{ selector: "vc-field-campaign", imports: [RouterLink, Icon, MapView, AgoPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @if (!cid()) {
      <div class="fpage">
        <div class="ftitle">Choose a campaign</div>
        @for (b of data.bundles(); track b.campaignId) {
          <a class="fcard pick" [routerLink]="['/field/campaign', b.campaignId]">
            <span><strong>{{ b.campaign.code }}</strong><em>{{ b.campaign.name }}</em></span><vc-icon name="chevron-right" [size]="22" />
          </a>
        } @empty {
          <div class="fcard fempty">
            <div class="ic"><vc-icon name="map" [size]="26" /></div>
            <h3>No campaigns on this phone</h3>
            <p>Download a campaign from Home to see its points on the map, even without signal.</p>
            <a class="fbtn secondary" routerLink="/field">Go to Home</a>
          </div>
        }
      </div>
    } @else if (loading()) {
      <div class="fpage"><div class="fcard fempty"><div class="ic"><vc-icon name="download" [size]="26" /></div><h3>Opening campaign\u2026</h3></div></div>
    } @else if (!bundle()) {
      <div class="fpage">
        <div class="fcard fempty">
          <div class="ic"><vc-icon name="wifi-off" [size]="26" /></div>
          <h3>This campaign isn't on this phone</h3>
          <p>{{ error() || 'Connect to the internet once to download it.' }}</p>
          <a class="fbtn secondary" routerLink="/field">Back to Home</a>
        </div>
      </div>
    } @else {
      @let b = bundle()!;
      <div class="head">
        <a routerLink="/field" class="back" aria-label="Back"><vc-icon name="arrow-left" [size]="22" /></a>
        <div class="ht"><strong>{{ b.campaign.code }}</strong><span>{{ b.campaign.name }}</span></div>
        <span class="gps" [class]="'gps ' + gpsTone()"><vc-icon name="locate" [size]="16" [stroke]="2.2" />{{ gpsText() }}</span>
      </div>
      <vc-map class="map" height="38vh" [polygons]="fieldsFc()" [points]="pointsFc()" (featureClick)="onMap($event)" />
      @if (gps.error()) { <div class="gpserr"><vc-icon name="alert" [size]="16" />{{ gps.error() }}</div> }

      <div class="fpage list">
        <div class="lhead">
          <div class="seg">
            <button [class.on]="filter() === 'todo'" (click)="filter.set('todo')">To do <b>{{ todoCount() }}</b></button>
            <button [class.on]="filter() === 'all'" (click)="filter.set('all')">All <b>{{ rows().length }}</b></button>
          </div>
          <span class="saved">Saved {{ b.savedAt | ago }}</span>
        </div>
        @for (r of shown(); track r.id) {
          <button class="fcard pt" (click)="openPoint(r)">
            <span class="arrow" [style.transform]="'rotate(' + arrowDeg(r) + 'deg)'" [class.none]="r.bearing === null">
              <svg viewBox="0 0 24 24" width="30" height="30"><path d="M12 2 19 20 12 16 5 20Z" fill="currentColor" /></svg>
            </span>
            <span class="pi">
              <strong class="mono">{{ r.site }}</strong>
              <span>Field {{ r.field }}</span>
            </span>
            <span class="pd">
              <strong class="num">{{ r.dist === null ? '\u2014' : human(r.dist) }}</strong>
              <span>{{ r.bearing === null ? 'no GPS' : dir(r.bearing) }}</span>
            </span>
            <span class="chip" [class]="'chip ' + tone[r.status]">{{ label[r.status] }}</span>
          </button>
        } @empty {
          <div class="fcard fempty">
            <div class="ic"><vc-icon name="check-circle" [size]="26" /></div>
            <h3>All your points are done</h3>
            <p>Check the Outbox to make sure everything has uploaded.</p>
            <a class="fbtn secondary" routerLink="/field/outbox">Open Outbox</a>
          </div>
        }
      </div>
    }
  `, styles: [`/* angular:styles/component:scss;8145719d236d938b;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\field-app\\field-campaign.ts */
:host {
  display: block;
}
.fpage {
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ftitle {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--stone-900);
  line-height: 1.2;
}
.fsub {
  font-size: 14.5px;
  color: var(--stone-700);
}
.fcard {
  background: #fff;
  border: 1.5px solid var(--sand-300);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(16, 41, 28, 0.06);
}
.fcard-pad {
  padding: 16px;
}
.fsec {
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--stone-600);
  margin: 4px 2px -6px;
}
.fbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 20px;
  border-radius: 12px;
  border: 2px solid transparent;
  font: 600 16px var(--font);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  text-decoration: none !important;
  -webkit-tap-highlight-color: transparent;
}
.fbtn:active {
  transform: translateY(1px);
}
.fbtn[disabled] {
  opacity: 0.45;
  cursor: not-allowed;
}
.fbtn.primary {
  background: var(--forest-700);
  color: #fff;
}
.fbtn.primary:hover:not([disabled]) {
  background: var(--forest-800);
}
.fbtn.secondary {
  background: #fff;
  color: var(--forest-800);
  border-color: var(--forest-700);
}
.fbtn.ghost {
  background: transparent;
  color: var(--stone-800);
  border-color: var(--sand-300);
}
.fbtn.danger {
  background: #fff;
  color: var(--red-600);
  border-color: var(--red-600);
}
.fbtn.block {
  width: 100%;
}
.fbtn.sm {
  min-height: 44px;
  padding: 0 14px;
  font-size: 15px;
  border-radius: 10px;
}
.finput {
  width: 100%;
  min-height: 52px;
  padding: 0 14px;
  border: 2px solid var(--stone-300);
  border-radius: 12px;
  background: #fff;
  font: 500 17px var(--font);
  color: var(--stone-900);
  outline: none;
}
textarea.finput {
  min-height: 96px;
  padding: 12px 14px;
  line-height: 1.45;
}
select.finput {
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231d2420' stroke-width='2.2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}
.finput:focus {
  border-color: var(--forest-600);
  box-shadow: 0 0 0 3px rgba(47, 114, 73, 0.25);
}
.finput.bad {
  border-color: var(--red-600);
}
.flabel {
  display: block;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--stone-800);
  margin-bottom: 6px;
}
.fhint {
  font-size: 13.5px;
  color: var(--stone-600);
  margin-top: 6px;
}
.ferr {
  font-size: 14px;
  color: var(--red-600);
  margin-top: 6px;
  font-weight: 500;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.chip.ok {
  background: var(--forest-100);
  color: var(--forest-800);
}
.chip.warn {
  background: var(--amber-100);
  color: #7a4d00;
}
.chip.bad {
  background: var(--red-100);
  color: var(--red-600);
}
.chip.info {
  background: var(--sky-100);
  color: var(--sky-600);
}
.chip.muted {
  background: var(--stone-100);
  color: var(--stone-700);
}
.fempty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 28px 16px;
  color: var(--stone-700);
}
.fempty .ic {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--sand-200);
  color: var(--stone-700);
  margin-bottom: 4px;
}
.fempty h3 {
  font-size: 17px;
}
.num {
  font-variant-numeric: tabular-nums;
}
.mono {
  font-family: var(--mono);
}
/*# sourceMappingURL=field-campaign.css.map */
`, "/* angular:styles/component:scss;e73b5bd436f3ec65;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\field-app\\field-campaign.ts */\n.pick {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 16px;\n  text-decoration: none !important;\n  color: var(--stone-900);\n}\n.pick span {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n}\n.pick em {\n  font-style: normal;\n  color: var(--stone-600);\n  font-size: 14px;\n}\n.head {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 12px;\n  background: #fff;\n  border-bottom: 1.5px solid var(--sand-300);\n}\n.back {\n  display: grid;\n  place-items: center;\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  color: var(--stone-900);\n}\n.ht {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  line-height: 1.25;\n}\n.ht strong {\n  font-size: 16px;\n}\n.ht span {\n  font-size: 13.5px;\n  color: var(--stone-600);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.gps {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  height: 34px;\n  padding: 0 10px;\n  border-radius: 999px;\n  font-size: 13px;\n  font-weight: 600;\n  white-space: nowrap;\n}\n.gps.ok {\n  background: var(--forest-100);\n  color: var(--forest-800);\n}\n.gps.warn {\n  background: var(--amber-100);\n  color: #7a4d00;\n}\n.gps.bad {\n  background: var(--red-100);\n  color: var(--red-600);\n}\n.map {\n  border-radius: 0;\n  border-left: 0;\n  border-right: 0;\n}\n.gpserr {\n  display: flex;\n  gap: 8px;\n  align-items: flex-start;\n  padding: 10px 16px;\n  background: var(--amber-100);\n  color: #5c3a00;\n  font-size: 14px;\n}\n.list {\n  gap: 10px;\n}\n.lhead {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n.seg {\n  display: flex;\n  background: #fff;\n  border: 1.5px solid var(--sand-300);\n  border-radius: 12px;\n  padding: 4px;\n  gap: 4px;\n}\n.seg button {\n  min-height: 40px;\n  padding: 0 14px;\n  border: 0;\n  border-radius: 9px;\n  background: none;\n  font: 600 15px var(--font);\n  color: var(--stone-700);\n  cursor: pointer;\n}\n.seg button.on {\n  background: var(--forest-700);\n  color: #fff;\n}\n.seg b {\n  margin-left: 4px;\n  opacity: 0.8;\n}\n.saved {\n  font-size: 13px;\n  color: var(--stone-600);\n}\n.pt {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  width: 100%;\n  min-height: 76px;\n  padding: 10px 14px;\n  text-align: left;\n  font: inherit;\n  cursor: pointer;\n  color: var(--stone-900);\n}\n.arrow {\n  display: grid;\n  place-items: center;\n  width: 46px;\n  height: 46px;\n  border-radius: 50%;\n  background: var(--forest-100);\n  color: var(--forest-800);\n  flex: none;\n  transition: transform 0.3s;\n}\n.arrow.none {\n  color: var(--stone-400);\n  background: var(--stone-100);\n}\n.pi {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.pi strong {\n  font-size: 16px;\n}\n.pi span {\n  font-size: 14px;\n  color: var(--stone-600);\n}\n.pd {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 2px;\n  min-width: 64px;\n}\n.pd strong {\n  font-size: 17px;\n}\n.pd span {\n  font-size: 13px;\n  color: var(--stone-600);\n}\n@media (max-width: 380px) {\n  .pt .chip {\n    display: none;\n  }\n}\n/*# sourceMappingURL=field-campaign.css.map */\n"] }]
  }], () => [], { cid: [{ type: Input, args: [{ isSignal: true, alias: "cid", required: false }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FieldCampaign, { className: "FieldCampaign", filePath: "src/app/features/field-app/field-campaign.ts", lineNumber: 128 });
})();

// src/app/features/field-app/photo.ts
async function stampPhoto(file, stamp) {
  const img = await loadImage(file);
  const max = 1600;
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, w, h);
  const lines = [
    stamp.title,
    stamp.at.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    stamp.lat !== null && stamp.lon !== null ? `${stamp.lat.toFixed(6)}, ${stamp.lon.toFixed(6)}${stamp.acc ? `  \xB1${Math.round(stamp.acc)} m` : ""}` : "No GPS fix"
  ];
  const fs = Math.max(14, Math.round(w / 48));
  const pad = Math.round(fs * 0.7);
  const bandH = lines.length * fs * 1.35 + pad * 2;
  ctx.fillStyle = "rgba(11,31,21,0.72)";
  ctx.fillRect(0, h - bandH, w, bandH);
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "top";
  lines.forEach((l, i) => {
    ctx.font = `${i === 0 ? 600 : 400} ${fs}px "IBM Plex Sans", system-ui, sans-serif`;
    ctx.fillText(l, pad, h - bandH + pad + i * fs * 1.35);
  });
  const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.85));
  return blob ?? file;
}
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This file could not be read as a photo."));
    };
    img.src = url;
  });
}
function barcodeSupported() {
  return typeof window !== "undefined" && "BarcodeDetector" in window;
}
async function readCode(file) {
  if (!barcodeSupported()) return null;
  const Ctor = window.BarcodeDetector;
  const det = new Ctor({ formats: ["qr_code", "code_128", "code_39", "data_matrix", "ean_13"] });
  const bmp = await createImageBitmap(file);
  const found = await det.detect(bmp);
  return found[0]?.rawValue?.trim() || null;
}

// src/app/features/field-app/field-capture.ts
var _c02 = (a0) => ["/field/campaign", a0];
var _forTrack02 = ($index, $item) => $item.key;
var _forTrack12 = ($index, $item) => $item.kind;
function FieldCapture_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h3");
    \u0275\u0275text(3, "Opening point\u2026");
    \u0275\u0275elementEnd()()();
  }
}
function FieldCapture_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2);
    \u0275\u0275element(3, "vc-icon", 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h3");
    \u0275\u0275text(5, "This point isn't on this phone");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7, "Download the campaign again from Home.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "a", 4);
    \u0275\u0275text(9, "Back to Home");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 26);
  }
}
function FieldCapture_Conditional_2_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "li")(1, "button", 12);
    \u0275\u0275listener("click", function FieldCapture_Conditional_2_For_12_Template_button_click_1_listener() {
      const s_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.go(s_r2.key));
    });
    \u0275\u0275elementStart(2, "span", 13);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 14);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const s_r2 = ctx.$implicit;
    const \u0275$index_46_r4 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", s_r2.key === ctx_r2.step())("done", \u0275$index_46_r4 < ctx_r2.stepIndex());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", \u0275$index_46_r4 > ctx_r2.maxReached());
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_46_r4 < ctx_r2.stepIndex() ? "\u2713" : \u0275$index_46_r4 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(s_r2.label);
  }
}
function FieldCapture_Conditional_2_Case_14_Conditional_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29);
    \u0275\u0275text(1, "Arrow points relative to north. Hold the phone with the top facing north.");
    \u0275\u0275elementEnd();
  }
}
function FieldCapture_Conditional_2_Case_14_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 25);
    \u0275\u0275element(2, "path", 26);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(3, "div", 27);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 28);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(7, FieldCapture_Conditional_2_Case_14_Conditional_1_Conditional_7_Template, 2, 0, "div", 29);
    \u0275\u0275elementStart(8, "div", 30)(9, "div")(10, "span");
    \u0275\u0275text(11, "GPS accuracy");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "strong", 31);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "em");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div")(17, "span");
    \u0275\u0275text(18, "Allowed distance");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "strong", 31);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "em");
    \u0275\u0275text(22, "from the planned site");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275styleProp("transform", "rotate(" + ctx_r2.arrow() + "deg)");
    \u0275\u0275classProp("here", ctx_r2.closeEnough());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r2.human(ctx_r2.distance()));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.closeEnough() ? "You are at the site" : "towards " + ctx_r2.dirText());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.gps.heading() === null ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classMap("nf " + ctx_r2.accTone());
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("\xB1", ctx_r2.round(ctx.accuracy), " m");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("limit ", ctx_r2.accMax() ?? "\u2014", " m");
    \u0275\u0275advance();
    \u0275\u0275classMap("nf " + (ctx_r2.closeEnough() ? "ok" : "warn"));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", ctx_r2.distMax() ?? "\u2014", " m");
  }
}
function FieldCapture_Conditional_2_Case_14_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16);
    \u0275\u0275element(1, "vc-icon", 32);
    \u0275\u0275elementStart(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("size", 44);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.gps.supported ? "Finding your position\u2026" : "This phone has no GPS");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.gps.error() || "Stand in the open. This can take up to a minute the first time.");
  }
}
function FieldCapture_Conditional_2_Case_14_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 20);
    \u0275\u0275text(1, "You can start further away, but the sample will be flagged for the office to review.");
    \u0275\u0275elementEnd();
  }
}
function FieldCapture_Conditional_2_Case_14_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 20);
    \u0275\u0275text(1, "Skipping a point needs a connection so your supervisor sees it straight away.");
    \u0275\u0275elementEnd();
  }
}
function FieldCapture_Conditional_2_Case_14_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 23)(1, "label", 33);
    \u0275\u0275text(2, "Why can't this point be sampled?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "textarea", 34);
    \u0275\u0275controlCreate();
    \u0275\u0275twoWayListener("ngModelChange", function FieldCapture_Conditional_2_Case_14_Conditional_13_Template_textarea_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext(3);
      \u0275\u0275twoWayBindingSet(ctx_r2.skipReason, $event) || (ctx_r2.skipReason = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 35)(5, "button", 36);
    \u0275\u0275listener("click", function FieldCapture_Conditional_2_Case_14_Conditional_13_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.skipOpen.set(false));
    });
    \u0275\u0275text(6, "Cancel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 37);
    \u0275\u0275listener("click", function FieldCapture_Conditional_2_Case_14_Conditional_13_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.skip());
    });
    \u0275\u0275text(8, "Skip point");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r2.skipReason);
    \u0275\u0275control();
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r2.skipReason.trim().length < 5 || ctx_r2.busy());
  }
}
function FieldCapture_Conditional_2_Case_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 15);
    \u0275\u0275conditionalCreate(1, FieldCapture_Conditional_2_Case_14_Conditional_1_Template, 23, 14)(2, FieldCapture_Conditional_2_Case_14_Conditional_2_Template, 6, 3, "div", 16);
    \u0275\u0275elementStart(3, "div", 17);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "button", 18);
    \u0275\u0275listener("click", function FieldCapture_Conditional_2_Case_14_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.arrived());
    });
    \u0275\u0275element(6, "vc-icon", 19);
    \u0275\u0275text(7, "I'm at the site \u2014 start");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, FieldCapture_Conditional_2_Case_14_Conditional_8_Template, 2, 0, "p", 20);
    \u0275\u0275elementStart(9, "button", 21);
    \u0275\u0275listener("click", function FieldCapture_Conditional_2_Case_14_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.skipOpen.set(true));
    });
    \u0275\u0275element(10, "vc-icon", 22);
    \u0275\u0275text(11, "Can't sample here");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, FieldCapture_Conditional_2_Case_14_Conditional_12_Template, 2, 0, "p", 20);
    \u0275\u0275conditionalCreate(13, FieldCapture_Conditional_2_Case_14_Conditional_13_Template, 9, 2, "section", 23);
  }
  if (rf & 2) {
    let tmp_4_0;
    \u0275\u0275nextContext();
    const p_r7 = \u0275\u0275readContextLet(0);
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_4_0 = ctx_r2.fix()) ? 1 : 2, tmp_4_0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("Site ", p_r7.latitude.toFixed(6), ", ", p_r7.longitude.toFixed(6));
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r2.fix());
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.fix() && !ctx_r2.closeEnough() ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r2.store.online());
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r2.store.online() ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.skipOpen() ? 13 : -1);
  }
}
function FieldCapture_Conditional_2_Case_15_Conditional_7_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 51);
    \u0275\u0275text(1, "A reason is required for a shallow core.");
    \u0275\u0275elementEnd();
  }
}
function FieldCapture_Conditional_2_Case_15_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "label", 49);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "textarea", 50);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FieldCapture_Conditional_2_Case_15_Conditional_7_Template_textarea_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.deviation.set($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, FieldCapture_Conditional_2_Case_15_Conditional_7_Conditional_4_Template, 2, 0, "div", 51);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const b_r10 = \u0275\u0275readContextLet(1);
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Why didn't the core reach ", b_r10.campaign.depth_to_cm, " cm?");
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", ctx_r2.deviation());
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r2.deviation().trim() ? 4 : -1);
  }
}
function FieldCapture_Conditional_2_Case_15_For_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 42)(1, "span", 52);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "input", 53);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FieldCapture_Conditional_2_Case_15_For_12_Template_input_ngModelChange_3_listener($event) {
      const \u0275$index_181_r12 = \u0275\u0275restoreView(_r11).$index;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.setLayer(\u0275$index_181_r12, "from", $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 54);
    \u0275\u0275text(5, "to");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "input", 53);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FieldCapture_Conditional_2_Case_15_For_12_Template_input_ngModelChange_6_listener($event) {
      const \u0275$index_181_r12 = \u0275\u0275restoreView(_r11).$index;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.setLayer(\u0275$index_181_r12, "to", $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 55);
    \u0275\u0275text(8, "cm");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 56);
    \u0275\u0275listener("click", function FieldCapture_Conditional_2_Case_15_For_12_Template_button_click_9_listener() {
      const \u0275$index_181_r12 = \u0275\u0275restoreView(_r11).$index;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.removeLayer(\u0275$index_181_r12));
    });
    \u0275\u0275element(10, "vc-icon", 57);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const l_r13 = ctx.$implicit;
    const \u0275$index_181_r12 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275$index_181_r12 + 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngModel", l_r13.from);
    \u0275\u0275attribute("aria-label", "Layer " + (\u0275$index_181_r12 + 1) + " from");
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275property("ngModel", l_r13.to);
    \u0275\u0275attribute("aria-label", "Layer " + (\u0275$index_181_r12 + 1) + " to");
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r2.layers().length === 1);
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
  }
}
function FieldCapture_Conditional_2_Case_15_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 36);
    \u0275\u0275listener("click", function FieldCapture_Conditional_2_Case_15_Conditional_17_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.fitLayers());
    });
    \u0275\u0275element(1, "vc-icon", 58);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Fit to ", ctx_r2.reached(), " cm");
  }
}
function FieldCapture_Conditional_2_Case_15_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47);
    \u0275\u0275element(1, "vc-icon", 3);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r15 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r15);
  }
}
function FieldCapture_Conditional_2_Case_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 23)(1, "div")(2, "label", 38);
    \u0275\u0275text(3, "Depth the core reached (cm)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 39);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FieldCapture_Conditional_2_Case_15_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.reached.set($event === "" || $event === null ? null : +$event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 29);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(7, FieldCapture_Conditional_2_Case_15_Conditional_7_Template, 5, 3, "div");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 40);
    \u0275\u0275text(9, "Layers (one bag each)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "section", 41);
    \u0275\u0275repeaterCreate(11, FieldCapture_Conditional_2_Case_15_For_12_Template, 11, 7, "div", 42, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementStart(13, "div", 43)(14, "button", 36);
    \u0275\u0275listener("click", function FieldCapture_Conditional_2_Case_15_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.addLayer());
    });
    \u0275\u0275element(15, "vc-icon", 44);
    \u0275\u0275text(16, "Add layer");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(17, FieldCapture_Conditional_2_Case_15_Conditional_17_Template, 3, 2, "button", 45);
    \u0275\u0275elementStart(18, "button", 36);
    \u0275\u0275listener("click", function FieldCapture_Conditional_2_Case_15_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.resetLayers());
    });
    \u0275\u0275element(19, "vc-icon", 46);
    \u0275\u0275text(20, "Reset");
    \u0275\u0275elementEnd()()();
    \u0275\u0275repeaterCreate(21, FieldCapture_Conditional_2_Case_15_For_22_Template, 3, 2, "div", 47, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementStart(23, "button", 18);
    \u0275\u0275listener("click", function FieldCapture_Conditional_2_Case_15_Template_button_click_23_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.next());
    });
    \u0275\u0275text(24, "Next: photos");
    \u0275\u0275element(25, "vc-icon", 48);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const b_r10 = \u0275\u0275readContextLet(1);
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngModel", ctx_r2.reached());
    \u0275\u0275control();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("The campaign needs ", b_r10.campaign.depth_from_cm, "\u2013", b_r10.campaign.depth_to_cm, " cm.");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.shallow() ? 7 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r2.layers());
    \u0275\u0275advance(4);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.shallow() && ctx_r2.reached() ? 17 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.layerErrors());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r2.coreOk());
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
  }
}
function FieldCapture_Conditional_2_Case_16_For_3_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 64);
  }
  if (rf & 2) {
    const k_r18 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275property("src", ctx_r2.thumbs()[k_r18.kind], \u0275\u0275sanitizeUrl)("alt", k_r18.label);
  }
}
function FieldCapture_Conditional_2_Case_16_For_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 65);
    \u0275\u0275element(1, "vc-icon", 68);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 34);
  }
}
function FieldCapture_Conditional_2_Case_16_For_3_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "vc-icon", 67);
  }
  if (rf & 2) {
    \u0275\u0275property("size", 18)("stroke", 2.4);
  }
}
function FieldCapture_Conditional_2_Case_16_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 61)(1, "label", 62)(2, "input", 63);
    \u0275\u0275listener("change", function FieldCapture_Conditional_2_Case_16_For_3_Template_input_change_2_listener($event) {
      const k_r18 = \u0275\u0275restoreView(_r17).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.takePhoto(k_r18.kind, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, FieldCapture_Conditional_2_Case_16_For_3_Conditional_3_Template, 1, 2, "img", 64)(4, FieldCapture_Conditional_2_Case_16_For_3_Conditional_4_Template, 2, 1, "span", 65);
    \u0275\u0275elementStart(5, "span", 66)(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275conditionalCreate(8, FieldCapture_Conditional_2_Case_16_For_3_Conditional_8_Template, 1, 2, "vc-icon", 67);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "em");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const k_r18 = ctx.$implicit;
    const ph_r19 = \u0275\u0275nextContext(3).photoOf(k_r18.kind);
    \u0275\u0275classProp("have", !!ph_r19);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ph_r19 ? 3 : 4);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("", k_r18.label, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ph_r19 ? 8 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ph_r19 ? "Tap to retake" : k_r18.hint);
  }
}
function FieldCapture_Conditional_2_Case_16_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 20);
    \u0275\u0275text(1, "Preparing photo\u2026");
    \u0275\u0275elementEnd();
  }
}
function FieldCapture_Conditional_2_Case_16_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r2.requiredPhotos() - ctx_r2.photoCount(), " more photo(s) needed.");
  }
}
function FieldCapture_Conditional_2_Case_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 59);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(2, FieldCapture_Conditional_2_Case_16_For_3_Template, 11, 6, "section", 60, _forTrack12);
    \u0275\u0275conditionalCreate(4, FieldCapture_Conditional_2_Case_16_Conditional_4_Template, 2, 0, "p", 20);
    \u0275\u0275elementStart(5, "button", 18);
    \u0275\u0275listener("click", function FieldCapture_Conditional_2_Case_16_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.next());
    });
    \u0275\u0275text(6, "Next: labels");
    \u0275\u0275element(7, "vc-icon", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, FieldCapture_Conditional_2_Case_16_Conditional_8_Template, 2, 1, "p", 20);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Take ", ctx_r2.requiredPhotos(), " photos. Each is stamped with the time and your position.");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.kinds);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.processing() ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r2.photoCount() < ctx_r2.requiredPhotos());
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.photoCount() < ctx_r2.requiredPhotos() ? 8 : -1);
  }
}
function FieldCapture_Conditional_2_Case_17_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Tap ");
    \u0275\u0275elementStart(1, "b");
    \u0275\u0275text(2, "Scan");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " to read the QR code with the camera. ");
  }
}
function FieldCapture_Conditional_2_Case_17_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Type the code printed under the QR. ");
  }
}
function FieldCapture_Conditional_2_Case_17_For_5_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 73)(1, "input", 63);
    \u0275\u0275listener("change", function FieldCapture_Conditional_2_Case_17_For_5_Conditional_8_Template_input_change_1_listener($event) {
      \u0275\u0275restoreView(_r23);
      const \u0275$index_286_r22 = \u0275\u0275nextContext().$index;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.scan(\u0275$index_286_r22, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "vc-icon", 74);
    \u0275\u0275text(3, "Scan ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
  }
}
function FieldCapture_Conditional_2_Case_17_For_5_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 51);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const \u0275$index_286_r22 = \u0275\u0275nextContext().$index;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.labelError(\u0275$index_286_r22));
  }
}
function FieldCapture_Conditional_2_Case_17_For_5_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29);
    \u0275\u0275text(1, "Scan or type the label on this bag.");
    \u0275\u0275elementEnd();
  }
}
function FieldCapture_Conditional_2_Case_17_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 69)(1, "div", 70)(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 31);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 71)(7, "input", 72);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FieldCapture_Conditional_2_Case_17_For_5_Template_input_ngModelChange_7_listener($event) {
      const \u0275$index_286_r22 = \u0275\u0275restoreView(_r21).$index;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.setLabel(\u0275$index_286_r22, $event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, FieldCapture_Conditional_2_Case_17_For_5_Conditional_8_Template, 4, 1, "label", 73);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, FieldCapture_Conditional_2_Case_17_For_5_Conditional_9_Template, 2, 1, "div", 51)(10, FieldCapture_Conditional_2_Case_17_For_5_Conditional_10_Template, 2, 0, "div", 29);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const l_r24 = ctx.$implicit;
    const \u0275$index_286_r22 = ctx.$index;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Layer ", \u0275$index_286_r22 + 1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", l_r24.from, "\u2013", l_r24.to, " cm");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("bad", !!ctx_r2.labelError(\u0275$index_286_r22));
    \u0275\u0275property("ngModel", l_r24.label);
    \u0275\u0275attribute("aria-label", "Label for layer " + (\u0275$index_286_r22 + 1));
    \u0275\u0275control();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.canScan ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.labelError(\u0275$index_286_r22) ? 9 : !l_r24.label ? 10 : -1);
  }
}
function FieldCapture_Conditional_2_Case_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p", 59);
    \u0275\u0275text(1, "Put each layer in its own bag and record the label on the bag. ");
    \u0275\u0275conditionalCreate(2, FieldCapture_Conditional_2_Case_17_Conditional_2_Template, 4, 0)(3, FieldCapture_Conditional_2_Case_17_Conditional_3_Template, 1, 0);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(4, FieldCapture_Conditional_2_Case_17_For_5_Template, 11, 9, "section", 69, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementStart(6, "button", 18);
    \u0275\u0275listener("click", function FieldCapture_Conditional_2_Case_17_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r20);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.next());
    });
    \u0275\u0275text(7, "Next: review");
    \u0275\u0275element(8, "vc-icon", 48);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.canScan ? 2 : 3);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.layers());
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r2.labelsOk());
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
  }
}
function FieldCapture_Conditional_2_Case_18_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 81)(1, "span", 82);
    \u0275\u0275element(2, "vc-icon", 83);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 84)(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "em");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const c_r26 = ctx.$implicit;
    \u0275\u0275classMap("ck " + c_r26.tone);
    \u0275\u0275advance(2);
    \u0275\u0275property("name", c_r26.tone === "ok" ? "check-circle" : c_r26.tone === "warn" ? "alert" : "x-circle")("size", 22)("stroke", 2.2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r26.label);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(c_r26.detail);
  }
}
function FieldCapture_Conditional_2_Case_18_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 77);
    \u0275\u0275element(1, "vc-icon", 3);
    \u0275\u0275text(2, "You can still save. The office will see these warnings as quality findings on this sample.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
  }
}
function FieldCapture_Conditional_2_Case_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "section", 75);
    \u0275\u0275repeaterCreate(1, FieldCapture_Conditional_2_Case_18_For_2_Template, 8, 7, "div", 76, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, FieldCapture_Conditional_2_Case_18_Conditional_3_Template, 3, 1, "div", 77);
    \u0275\u0275elementStart(4, "section", 78)(5, "div")(6, "span");
    \u0275\u0275text(7, "Position");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "strong", 9);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div")(11, "span");
    \u0275\u0275text(12, "Recorded at");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "strong");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "button", 79);
    \u0275\u0275listener("click", function FieldCapture_Conditional_2_Case_18_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r25);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.relock());
    });
    \u0275\u0275element(16, "vc-icon", 32);
    \u0275\u0275text(17, "Use current position");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "button", 18);
    \u0275\u0275listener("click", function FieldCapture_Conditional_2_Case_18_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r25);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.save());
    });
    \u0275\u0275element(19, "vc-icon", 80);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "p", 20);
    \u0275\u0275text(22, "Saved on this phone first. It uploads automatically when there is signal.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r2.checks());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.hasWarnings() && !ctx_r2.blocked() ? 3 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate2("", ctx_r2.locked()?.lat?.toFixed(6), ", ", ctx_r2.locked()?.lon?.toFixed(6));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r2.lockedAt());
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r2.fix());
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.blocked() || ctx_r2.busy());
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.busy() ? "Saving\u2026" : "Save sample");
  }
}
function FieldCapture_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275declareLet(0)(1);
    \u0275\u0275elementStart(2, "div", 5)(3, "a", 6);
    \u0275\u0275element(4, "vc-icon", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 8)(6, "strong", 9);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "ol", 10);
    \u0275\u0275repeaterCreate(11, FieldCapture_Conditional_2_For_12_Template, 6, 7, "li", 11, _forTrack02);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 0);
    \u0275\u0275conditionalCreate(14, FieldCapture_Conditional_2_Case_14_Template, 14, 10)(15, FieldCapture_Conditional_2_Case_15_Template, 26, 9)(16, FieldCapture_Conditional_2_Case_16_Template, 9, 5)(17, FieldCapture_Conditional_2_Case_17_Template, 9, 3)(18, FieldCapture_Conditional_2_Case_18_Template, 23, 9);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_8_0;
    const ctx_r2 = \u0275\u0275nextContext();
    const p_r27 = \u0275\u0275storeLet(ctx_r2.point());
    \u0275\u0275advance();
    const b_r28 = \u0275\u0275storeLet(ctx_r2.bundle());
    \u0275\u0275advance(2);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(8, _c02, ctx_r2.cid()));
    \u0275\u0275advance();
    \u0275\u0275property("size", 22);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(p_r27.site_code);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("Field ", p_r27.field_code, " \xB7 ", b_r28.campaign.code);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.steps);
    \u0275\u0275advance(3);
    \u0275\u0275conditional((tmp_8_0 = ctx_r2.step()) === "navigate" ? 14 : tmp_8_0 === "core" ? 15 : tmp_8_0 === "photos" ? 16 : tmp_8_0 === "labels" ? 17 : tmp_8_0 === "review" ? 18 : -1);
  }
}
var STEPS = [
  { key: "navigate", label: "Navigate" },
  { key: "core", label: "Core" },
  { key: "photos", label: "Photos" },
  { key: "labels", label: "Labels" },
  { key: "review", label: "Review" }
];
var PHOTO_KINDS = [
  { kind: "hole", label: "The hole", hint: "Looking straight down into the hole, with the depth visible." },
  { kind: "core", label: "The core", hint: "The whole core laid out next to a tape measure." },
  { kind: "surroundings", label: "Surroundings", hint: "Step back and show the spot in its field." }
];
function defaultLayers(from, to) {
  const span = to - from;
  if (span > 0 && span % 10 === 0 && span / 10 <= 6) {
    return Array.from({ length: span / 10 }, (_, i) => ({ from: from + i * 10, to: from + (i + 1) * 10, label: "" }));
  }
  return [{ from, to, label: "" }];
}
function layerProblems(layers, start, reached) {
  const out = [];
  if (!layers.length)
    return ["At least one soil layer is needed."];
  const o = [...layers].sort((a, b) => a.from - b.from);
  for (const l of o)
    if (!(l.to > l.from))
      out.push(`The layer ${l.from}\u2013${l.to} cm must end deeper than it starts.`);
  if (Math.abs(o[0].from - start) > 1e-6)
    out.push(`The first layer must start at ${start} cm (it starts at ${o[0].from} cm).`);
  for (let i = 1; i < o.length; i++) {
    if (o[i].from > o[i - 1].to + 1e-6)
      out.push(`There is a gap between ${o[i - 1].to} cm and ${o[i].from} cm.`);
    else if (o[i].from < o[i - 1].to - 1e-6)
      out.push(`The layers ${o[i - 1].from}\u2013${o[i - 1].to} cm and ${o[i].from} cm onwards overlap.`);
  }
  if (reached !== null && Math.max(...o.map((l) => l.to)) > reached + 1e-6)
    out.push("A layer goes deeper than the core reached.");
  return out;
}
var FieldCapture = class _FieldCapture {
  router = inject(Router);
  api = inject(ApiService);
  toast = inject(ToastService);
  data = inject(FieldData);
  store = inject(OfflineStore);
  gps = inject(FieldGps);
  cid = input.required(
    ...ngDevMode ? [{ debugName: "cid" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pid = input.required(
    ...ngDevMode ? [{ debugName: "pid" }] : (
      /* istanbul ignore next */
      []
    )
  );
  steps = STEPS;
  kinds = PHOTO_KINDS;
  canScan = barcodeSupported();
  loading = signal(
    true,
    ...ngDevMode ? [{ debugName: "loading" }] : (
      /* istanbul ignore next */
      []
    )
  );
  bundle = signal(
    null,
    ...ngDevMode ? [{ debugName: "bundle" }] : (
      /* istanbul ignore next */
      []
    )
  );
  point = signal(
    null,
    ...ngDevMode ? [{ debugName: "point" }] : (
      /* istanbul ignore next */
      []
    )
  );
  step = signal(
    "navigate",
    ...ngDevMode ? [{ debugName: "step" }] : (
      /* istanbul ignore next */
      []
    )
  );
  maxReached = signal(
    0,
    ...ngDevMode ? [{ debugName: "maxReached" }] : (
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
  processing = signal(
    false,
    ...ngDevMode ? [{ debugName: "processing" }] : (
      /* istanbul ignore next */
      []
    )
  );
  skipOpen = signal(
    false,
    ...ngDevMode ? [{ debugName: "skipOpen" }] : (
      /* istanbul ignore next */
      []
    )
  );
  skipReason = "";
  locked = signal(
    null,
    ...ngDevMode ? [{ debugName: "locked" }] : (
      /* istanbul ignore next */
      []
    )
  );
  reached = signal(
    null,
    ...ngDevMode ? [{ debugName: "reached" }] : (
      /* istanbul ignore next */
      []
    )
  );
  deviation = signal(
    "",
    ...ngDevMode ? [{ debugName: "deviation" }] : (
      /* istanbul ignore next */
      []
    )
  );
  layers = signal(
    [],
    ...ngDevMode ? [{ debugName: "layers" }] : (
      /* istanbul ignore next */
      []
    )
  );
  photos = signal(
    [],
    ...ngDevMode ? [{ debugName: "photos" }] : (
      /* istanbul ignore next */
      []
    )
  );
  thumbs = signal(
    {},
    ...ngDevMode ? [{ debugName: "thumbs" }] : (
      /* istanbul ignore next */
      []
    )
  );
  usedLabels = signal(
    /* @__PURE__ */ new Set(),
    ...ngDevMode ? [{ debugName: "usedLabels" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fix = computed(
    () => this.gps.fix(),
    ...ngDevMode ? [{ debugName: "fix" }] : (
      /* istanbul ignore next */
      []
    )
  );
  stepIndex = computed(
    () => STEPS.findIndex((s) => s.key === this.step()),
    ...ngDevMode ? [{ debugName: "stepIndex" }] : (
      /* istanbul ignore next */
      []
    )
  );
  accMax = computed(
    () => this.bundle()?.thresholds.gps_accuracy_max_m ?? null,
    ...ngDevMode ? [{ debugName: "accMax" }] : (
      /* istanbul ignore next */
      []
    )
  );
  distMax = computed(
    () => this.bundle()?.thresholds.max_distance_from_site_m ?? null,
    ...ngDevMode ? [{ debugName: "distMax" }] : (
      /* istanbul ignore next */
      []
    )
  );
  requiredPhotos = computed(
    () => this.bundle()?.thresholds.required_photos ?? 3,
    ...ngDevMode ? [{ debugName: "requiredPhotos" }] : (
      /* istanbul ignore next */
      []
    )
  );
  distance = computed(
    () => {
      const f = this.fix(), p = this.point();
      return f && p ? distanceM(f.lat, f.lon, p.latitude, p.longitude) : null;
    },
    ...ngDevMode ? [{ debugName: "distance" }] : (
      /* istanbul ignore next */
      []
    )
  );
  bearing = computed(
    () => {
      const f = this.fix(), p = this.point();
      return f && p ? bearingDeg(f.lat, f.lon, p.latitude, p.longitude) : 0;
    },
    ...ngDevMode ? [{ debugName: "bearing" }] : (
      /* istanbul ignore next */
      []
    )
  );
  arrow = computed(
    () => this.bearing() - (this.gps.heading() ?? 0),
    ...ngDevMode ? [{ debugName: "arrow" }] : (
      /* istanbul ignore next */
      []
    )
  );
  dirText = computed(
    () => `${compass(this.bearing())} (${Math.round(this.bearing())}\xB0)`,
    ...ngDevMode ? [{ debugName: "dirText" }] : (
      /* istanbul ignore next */
      []
    )
  );
  closeEnough = computed(
    () => {
      const d = this.distance();
      return d !== null && d <= (this.distMax() ?? 10);
    },
    ...ngDevMode ? [{ debugName: "closeEnough" }] : (
      /* istanbul ignore next */
      []
    )
  );
  accTone = computed(
    () => {
      const f = this.fix();
      if (!f)
        return "bad";
      return f.accuracy <= (this.accMax() ?? 10) ? "ok" : "warn";
    },
    ...ngDevMode ? [{ debugName: "accTone" }] : (
      /* istanbul ignore next */
      []
    )
  );
  shallow = computed(
    () => {
      const r = this.reached(), b = this.bundle();
      return r !== null && !!b && r < b.campaign.depth_to_cm - 1e-6;
    },
    ...ngDevMode ? [{ debugName: "shallow" }] : (
      /* istanbul ignore next */
      []
    )
  );
  layerErrors = computed(
    () => {
      const b = this.bundle();
      return b ? layerProblems(this.layers(), b.campaign.depth_from_cm, this.reached()) : [];
    },
    ...ngDevMode ? [{ debugName: "layerErrors" }] : (
      /* istanbul ignore next */
      []
    )
  );
  coreOk = computed(
    () => this.reached() !== null && this.reached() > 0 && !this.layerErrors().length && (!this.shallow() || !!this.deviation().trim()),
    ...ngDevMode ? [{ debugName: "coreOk" }] : (
      /* istanbul ignore next */
      []
    )
  );
  photoCount = computed(
    () => this.photos().filter((p) => p.kind !== "extra").length,
    ...ngDevMode ? [{ debugName: "photoCount" }] : (
      /* istanbul ignore next */
      []
    )
  );
  labelsOk = computed(
    () => this.layers().every((l, i) => !!l.label && !this.labelError(i)),
    ...ngDevMode ? [{ debugName: "labelsOk" }] : (
      /* istanbul ignore next */
      []
    )
  );
  lockedAt = computed(
    () => {
      const l = this.locked();
      return l ? new Date(l.at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "\u2014";
    },
    ...ngDevMode ? [{ debugName: "lockedAt" }] : (
      /* istanbul ignore next */
      []
    )
  );
  checks = computed(
    () => {
      const b = this.bundle(), p = this.point(), l = this.locked();
      if (!b || !p)
        return [];
      const out = [];
      const field = b.fields.features.find((f) => String(f.properties?.["id"]) === p.field_id);
      if (!l) {
        out.push({ key: "pos", label: "Position recorded", detail: "No GPS position yet.", tone: "bad", blocking: true });
      } else {
        const inside = field ? polygonContains(field.geometry, l.lat, l.lon) : null;
        out.push(inside === null ? { key: "field", label: "Inside the field", detail: "The field boundary is not on this phone, so this could not be checked.", tone: "warn", blocking: false } : inside ? { key: "field", label: "Inside the field", detail: `Your position is inside field ${p.field_code}.`, tone: "ok", blocking: false } : { key: "field", label: "Outside the field", detail: `Your position is outside field ${p.field_code}. The sample will be blocked from calculations until reviewed.`, tone: "bad", blocking: false });
        const am = this.accMax();
        out.push(am === null ? { key: "acc", label: "GPS accuracy", detail: `\xB1${Math.round(l.accuracy)} m. No limit set by the methodology.`, tone: "ok", blocking: false } : l.accuracy <= am ? { key: "acc", label: "GPS accuracy", detail: `\xB1${Math.round(l.accuracy)} m, within the ${am} m limit.`, tone: "ok", blocking: false } : { key: "acc", label: "GPS accuracy is low", detail: `\xB1${Math.round(l.accuracy)} m; the limit is ${am} m. Wait for a better fix if you can.`, tone: "warn", blocking: false });
        const d = distanceM(l.lat, l.lon, p.latitude, p.longitude);
        const dm = this.distMax();
        out.push(dm === null ? { key: "dist", label: "Distance from site", detail: `${humanDistance(d)}. No limit set by the methodology.`, tone: "ok", blocking: false } : d <= dm ? { key: "dist", label: "Distance from site", detail: `${humanDistance(d)}, within ${dm} m.`, tone: "ok", blocking: false } : { key: "dist", label: "Too far from the site", detail: `${humanDistance(d)} away; the limit is ${dm} m.`, tone: "warn", blocking: false });
      }
      const need = this.requiredPhotos();
      out.push(this.photoCount() >= need ? { key: "photos", label: "Photos", detail: `${this.photoCount()} of ${need} taken.`, tone: "ok", blocking: false } : { key: "photos", label: "Photos missing", detail: `${this.photoCount()} of ${need} taken.`, tone: "bad", blocking: false });
      const r = this.reached() ?? 0;
      out.push(!this.shallow() ? { key: "depth", label: "Depth reached", detail: `${r} cm of ${b.campaign.depth_to_cm} cm.`, tone: "ok", blocking: false } : this.deviation().trim() ? { key: "depth", label: "Shallow core", detail: `${r} of ${b.campaign.depth_to_cm} cm. Reason: ${this.deviation().trim()}`, tone: "warn", blocking: false } : { key: "depth", label: "Shallow core without a reason", detail: "Go back to Core and say why.", tone: "bad", blocking: true });
      const le = this.layerErrors();
      out.push(le.length ? { key: "layers", label: "Layers don't fit together", detail: le[0], tone: "bad", blocking: true } : { key: "layers", label: "Layers", detail: `${this.layers().length} contiguous layer(s), ${this.layers().map((x) => `${x.from}\u2013${x.to}`).join(", ")} cm.`, tone: "ok", blocking: false });
      out.push(this.labelsOk() ? { key: "labels", label: "Bag labels", detail: "Every bag has its own label.", tone: "ok", blocking: false } : { key: "labels", label: "Bag labels incomplete", detail: "Go back to Labels.", tone: "bad", blocking: true });
      return out;
    },
    ...ngDevMode ? [{ debugName: "checks" }] : (
      /* istanbul ignore next */
      []
    )
  );
  blocked = computed(
    () => this.checks().some((c) => c.blocking),
    ...ngDevMode ? [{ debugName: "blocked" }] : (
      /* istanbul ignore next */
      []
    )
  );
  hasWarnings = computed(
    () => this.checks().some((c) => c.tone !== "ok"),
    ...ngDevMode ? [{ debugName: "hasWarnings" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.gps.start();
    effect(() => {
      const cid = this.cid(), pid = this.pid();
      void this.load(cid, pid);
    });
  }
  async load(cid, pid) {
    this.loading.set(true);
    const b = await this.data.bundle(cid).catch(() => void 0) ?? null;
    this.bundle.set(b);
    const p = b?.points.find((x) => x.id === pid) ?? null;
    this.point.set(p);
    if (b)
      this.layers.set(defaultLayers(b.campaign.depth_from_cm, b.campaign.depth_to_cm));
    if (b)
      this.reached.set(b.campaign.depth_to_cm);
    const all = await this.store.allSamples();
    this.usedLabels.set(new Set(all.filter((s) => s.state !== "rejected").flatMap((s) => s.payload.layers.map((l) => l.label_qr.toUpperCase()))));
    this.loading.set(false);
  }
  go(s) {
    const i = STEPS.findIndex((x) => x.key === s);
    if (i <= this.maxReached())
      this.step.set(s);
  }
  next() {
    const i = this.stepIndex() + 1;
    if (i >= STEPS.length)
      return;
    this.maxReached.update((m) => Math.max(m, i));
    this.step.set(STEPS[i].key);
    window.scrollTo({ top: 0 });
  }
  arrived() {
    this.locked.set(this.fix());
    this.next();
  }
  relock() {
    const f = this.fix();
    if (f)
      this.locked.set(f);
  }
  round(v) {
    return Math.round(v);
  }
  human(m) {
    return humanDistance(m);
  }
  /* ------------------------------------------------------------ layers */
  setLayer(i, k, v) {
    const n = v === "" || v === null ? NaN : Number(v);
    this.layers.update((ls) => ls.map((l, j) => j === i ? __spreadProps(__spreadValues({}, l), { [k]: n }) : l));
  }
  addLayer() {
    const ls = this.layers();
    const last = ls[ls.length - 1];
    const from = last ? last.to : this.bundle().campaign.depth_from_cm;
    this.layers.set([...ls, { from, to: from + 10, label: "" }]);
  }
  removeLayer(i) {
    this.layers.update((ls) => ls.filter((_, j) => j !== i));
  }
  resetLayers() {
    const b = this.bundle();
    this.layers.set(defaultLayers(b.campaign.depth_from_cm, b.campaign.depth_to_cm));
  }
  fitLayers() {
    const r = this.reached();
    if (r === null)
      return;
    const kept = this.layers().filter((l) => l.from < r).map((l) => __spreadProps(__spreadValues({}, l), { to: Math.min(l.to, r) }));
    this.layers.set(kept.length ? kept : [{ from: this.bundle().campaign.depth_from_cm, to: r, label: "" }]);
  }
  /* ------------------------------------------------------------ photos */
  photoOf(kind) {
    return this.photos().find((p) => p.kind === kind) ?? null;
  }
  async takePhoto(kind, ev) {
    const inp = ev.target;
    const file = inp.files?.[0];
    inp.value = "";
    if (!file)
      return;
    this.processing.set(true);
    const f = this.fix();
    const at = /* @__PURE__ */ new Date();
    try {
      const label = PHOTO_KINDS.find((k) => k.kind === kind)?.label ?? kind;
      const blob = await stampPhoto(file, { title: `${this.point().site_code} \xB7 ${label}`, at, lat: f?.lat ?? null, lon: f?.lon ?? null, acc: f?.accuracy });
      const ph = {
        kind,
        blob,
        name: `${this.point().site_code}-${kind}.jpg`,
        type: "image/jpeg",
        takenAt: at.toISOString(),
        lat: f?.lat ?? null,
        lon: f?.lon ?? null
      };
      const old = this.thumbs()[kind];
      if (old)
        URL.revokeObjectURL(old);
      this.thumbs.update((t) => __spreadProps(__spreadValues({}, t), { [kind]: URL.createObjectURL(blob) }));
      this.photos.update((ps) => [...ps.filter((p) => p.kind !== kind), ph]);
    } catch (e) {
      this.toast.error("Couldn't use that photo", e.message);
    } finally {
      this.processing.set(false);
    }
  }
  /* ------------------------------------------------------------ labels */
  setLabel(i, v) {
    this.layers.update((ls) => ls.map((l, j) => j === i ? __spreadProps(__spreadValues({}, l), { label: (v ?? "").trim().toUpperCase() }) : l));
  }
  labelError(i) {
    const ls = this.layers();
    const v = ls[i]?.label ?? "";
    if (!v)
      return null;
    if (v.length < 3)
      return "A label has at least 3 characters.";
    if (ls.some((l, j) => j !== i && l.label === v))
      return "Each bag needs its own label \u2014 this one is used twice.";
    if (this.usedLabels().has(v))
      return "This label was already used for another core on this phone.";
    return null;
  }
  async scan(i, ev) {
    const inp = ev.target;
    const file = inp.files?.[0];
    inp.value = "";
    if (!file)
      return;
    try {
      const code = await readCode(file);
      if (code) {
        this.setLabel(i, code);
        this.toast.success(`Label ${code.toUpperCase()} read`);
      } else
        this.toast.error("No code found", "Hold the phone closer, keep the label flat, or type the code.");
    } catch {
      this.toast.error("Scanning is not available", "Type the code printed under the QR instead.");
    }
  }
  /* ------------------------------------------------------------ skip & save */
  async skip() {
    this.busy.set(true);
    try {
      await firstValueFrom(this.api.post(`/points/${this.pid()}/skip`, { reason: this.skipReason.trim() }));
      const b = this.bundle();
      await this.store.saveBundle(__spreadProps(__spreadValues({}, b), { points: b.points.map((p) => p.id === this.pid() ? __spreadProps(__spreadValues({}, p), { status: "skipped" }) : p) }));
      await this.data.refreshBundles();
      this.toast.success(`${this.point().site_code} skipped`, "Your supervisor can see the reason.");
      this.router.navigate(["/field/campaign", this.cid()]);
    } catch (e) {
      this.toast.apiError(e, "Couldn't skip the point");
    } finally {
      this.busy.set(false);
    }
  }
  async save() {
    const b = this.bundle(), p = this.point(), l = this.locked();
    if (!b || !p || !l || this.blocked())
      return;
    this.busy.set(true);
    const localId = `smp-${crypto.randomUUID()}`;
    try {
      await this.store.queueSample({
        localId,
        campaignId: b.campaignId,
        pointId: p.id,
        siteCode: p.site_code,
        payload: {
          collected_at: l.at,
          latitude: l.lat,
          longitude: l.lon,
          gps_accuracy_m: Math.round(l.accuracy * 10) / 10,
          depth_reached_cm: Number(this.reached()),
          layers: [...this.layers()].sort((a, c) => a.from - c.from).map((x) => ({ depth_from_cm: x.from, depth_to_cm: x.to, label_qr: x.label })),
          deviation_reason: this.shallow() ? this.deviation().trim() : null,
          device_id: deviceId()
        },
        photos: this.photos()
      });
      this.toast.success(`${p.site_code} saved`, this.store.online() ? "Uploading now." : "It will upload when you have signal.");
      this.router.navigate(["/field/campaign", this.cid()]);
    } catch (e) {
      this.toast.error("Couldn't save on this phone", e.message);
    } finally {
      this.busy.set(false);
    }
  }
  ngOnDestroy() {
    this.gps.stop();
    Object.values(this.thumbs()).forEach((u) => URL.revokeObjectURL(u));
  }
  static \u0275fac = function FieldCapture_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FieldCapture)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FieldCapture, selectors: [["vc-field-capture"]], inputs: { cid: [1, "cid"], pid: [1, "pid"] }, decls: 3, vars: 1, consts: [[1, "fpage"], [1, "fcard", "fempty"], [1, "ic"], ["name", "alert", 3, "size"], ["routerLink", "/field", 1, "fbtn", "secondary"], [1, "head"], ["aria-label", "Back to the list", 1, "back", 3, "routerLink"], ["name", "x", 3, "size"], [1, "ht"], [1, "mono"], [1, "steps"], [3, "on", "done"], [3, "click", "disabled"], [1, "n"], [1, "l"], [1, "fcard", "nav"], [1, "nogps"], [1, "coords", "mono"], [1, "fbtn", "primary", "block", 3, "click", "disabled"], ["name", "pin", 3, "size"], [1, "fhint", "center"], [1, "fbtn", "ghost", "block", 3, "click", "disabled"], ["name", "ban", 3, "size"], [1, "fcard", "fcard-pad", "stackf"], [1, "big-arrow"], ["viewBox", "0 0 24 24", "width", "120", "height", "120"], ["d", "M12 1.5 20.5 21 12 16.2 3.5 21Z", "fill", "currentColor"], [1, "dist", "num"], [1, "dir"], [1, "fhint"], [1, "navfacts"], [1, "num"], ["name", "locate", 3, "size"], ["for", "skip", 1, "flabel"], ["id", "skip", "placeholder", "Standing crop \u2014 farmer asked us not to enter until harvest.", 1, "finput", 3, "ngModelChange", "ngModel"], [1, "rowf"], [1, "fbtn", "ghost", "sm", 3, "click"], [1, "fbtn", "danger", "sm", 3, "click", "disabled"], ["for", "depth", 1, "flabel"], ["id", "depth", "type", "number", "inputmode", "decimal", "min", "1", "max", "300", 1, "finput", "num", "big", 3, "ngModelChange", "ngModel"], [1, "fsec"], [1, "fcard", "layers"], [1, "lrow"], [1, "lact"], ["name", "plus", 3, "size"], [1, "fbtn", "ghost", "sm"], ["name", "rotate-ccw", 3, "size"], [1, "bad-line"], ["name", "arrow-right", 3, "size"], ["for", "dev", 1, "flabel"], ["id", "dev", "placeholder", "Hit laterite rock at 22 cm; tried twice within 1 m.", 1, "finput", 3, "ngModelChange", "ngModel"], [1, "ferr"], [1, "li"], ["type", "number", "inputmode", "decimal", 1, "finput", "num", 3, "ngModelChange", "ngModel"], [1, "to"], [1, "cm"], ["aria-label", "Remove layer", 1, "rm", 3, "click", "disabled"], ["name", "trash", 3, "size"], ["name", "ruler", 3, "size"], [1, "fsub"], [1, "fcard", "photo", 3, "have"], [1, "fcard", "photo"], [1, "shot"], ["type", "file", "accept", "image/*", "capture", "environment", "hidden", "", 3, "change"], [3, "src", "alt"], [1, "cam"], [1, "pt"], ["name", "check-circle", 3, "size", "stroke"], ["name", "camera", 3, "size"], [1, "fcard", "fcard-pad", "lab"], [1, "lt"], [1, "lin"], ["placeholder", "Bag label", "autocapitalize", "characters", "autocomplete", "off", 1, "finput", "mono", 3, "ngModelChange", "ngModel"], [1, "fbtn", "secondary", "sm", "scan"], ["name", "scan-qr", 3, "size"], [1, "fcard", "checks"], [1, "ck", 3, "class"], [1, "warnbox"], [1, "fcard", "fcard-pad", "sum"], [1, "fbtn", "ghost", "sm", 3, "click", "disabled"], ["name", "check", 3, "size"], [1, "ck"], [1, "ci"], [3, "name", "size", "stroke"], [1, "ct"]], template: function FieldCapture_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, FieldCapture_Conditional_0_Template, 4, 0, "div", 0)(1, FieldCapture_Conditional_1_Template, 10, 1, "div", 0)(2, FieldCapture_Conditional_2_Template, 19, 10);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.loading() ? 0 : !ctx.point() || !ctx.bundle() ? 1 : 2);
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, MinValidator, MaxValidator, NgModel, RouterLink, Icon], styles: [`
[_nghost-%COMP%] {
  display: block;
}
.fpage[_ngcontent-%COMP%] {
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ftitle[_ngcontent-%COMP%] {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--%NS%stone-900);
  line-height: 1.2;
}
.fsub[_ngcontent-%COMP%] {
  font-size: 14.5px;
  color: var(--%NS%stone-700);
}
.fcard[_ngcontent-%COMP%] {
  background: #fff;
  border: 1.5px solid var(--%NS%sand-300);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(16, 41, 28, 0.06);
}
.fcard-pad[_ngcontent-%COMP%] {
  padding: 16px;
}
.fsec[_ngcontent-%COMP%] {
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--%NS%stone-600);
  margin: 4px 2px -6px;
}
.fbtn[_ngcontent-%COMP%] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 20px;
  border-radius: 12px;
  border: 2px solid transparent;
  font: 600 16px var(--%NS%font);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  text-decoration: none !important;
  -webkit-tap-highlight-color: transparent;
}
.fbtn[_ngcontent-%COMP%]:active {
  transform: translateY(1px);
}
.fbtn[disabled][_ngcontent-%COMP%] {
  opacity: 0.45;
  cursor: not-allowed;
}
.fbtn.primary[_ngcontent-%COMP%] {
  background: var(--%NS%forest-700);
  color: #fff;
}
.fbtn.primary[_ngcontent-%COMP%]:hover:not([disabled]) {
  background: var(--%NS%forest-800);
}
.fbtn.secondary[_ngcontent-%COMP%] {
  background: #fff;
  color: var(--%NS%forest-800);
  border-color: var(--%NS%forest-700);
}
.fbtn.ghost[_ngcontent-%COMP%] {
  background: transparent;
  color: var(--%NS%stone-800);
  border-color: var(--%NS%sand-300);
}
.fbtn.danger[_ngcontent-%COMP%] {
  background: #fff;
  color: var(--%NS%red-600);
  border-color: var(--%NS%red-600);
}
.fbtn.block[_ngcontent-%COMP%] {
  width: 100%;
}
.fbtn.sm[_ngcontent-%COMP%] {
  min-height: 44px;
  padding: 0 14px;
  font-size: 15px;
  border-radius: 10px;
}
.finput[_ngcontent-%COMP%] {
  width: 100%;
  min-height: 52px;
  padding: 0 14px;
  border: 2px solid var(--%NS%stone-300);
  border-radius: 12px;
  background: #fff;
  font: 500 17px var(--%NS%font);
  color: var(--%NS%stone-900);
  outline: none;
}
textarea.finput[_ngcontent-%COMP%] {
  min-height: 96px;
  padding: 12px 14px;
  line-height: 1.45;
}
select.finput[_ngcontent-%COMP%] {
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231d2420' stroke-width='2.2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}
.finput[_ngcontent-%COMP%]:focus {
  border-color: var(--%NS%forest-600);
  box-shadow: 0 0 0 3px rgba(47, 114, 73, 0.25);
}
.finput.bad[_ngcontent-%COMP%] {
  border-color: var(--%NS%red-600);
}
.flabel[_ngcontent-%COMP%] {
  display: block;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--%NS%stone-800);
  margin-bottom: 6px;
}
.fhint[_ngcontent-%COMP%] {
  font-size: 13.5px;
  color: var(--%NS%stone-600);
  margin-top: 6px;
}
.ferr[_ngcontent-%COMP%] {
  font-size: 14px;
  color: var(--%NS%red-600);
  margin-top: 6px;
  font-weight: 500;
}
.chip[_ngcontent-%COMP%] {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.chip.ok[_ngcontent-%COMP%] {
  background: var(--%NS%forest-100);
  color: var(--%NS%forest-800);
}
.chip.warn[_ngcontent-%COMP%] {
  background: var(--%NS%amber-100);
  color: #7a4d00;
}
.chip.bad[_ngcontent-%COMP%] {
  background: var(--%NS%red-100);
  color: var(--%NS%red-600);
}
.chip.info[_ngcontent-%COMP%] {
  background: var(--%NS%sky-100);
  color: var(--%NS%sky-600);
}
.chip.muted[_ngcontent-%COMP%] {
  background: var(--%NS%stone-100);
  color: var(--%NS%stone-700);
}
.fempty[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 28px 16px;
  color: var(--%NS%stone-700);
}
.fempty[_ngcontent-%COMP%]   .ic[_ngcontent-%COMP%] {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--%NS%sand-200);
  color: var(--%NS%stone-700);
  margin-bottom: 4px;
}
.fempty[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
  font-size: 17px;
}
.num[_ngcontent-%COMP%] {
  font-variant-numeric: tabular-nums;
}
.mono[_ngcontent-%COMP%] {
  font-family: var(--%NS%mono);
}
/*# sourceMappingURL=field-capture.css.map */`, "\n.head[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 12px;\n  background: #fff;\n  border-bottom: 1.5px solid var(--%NS%sand-300);\n}\n.back[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  color: var(--%NS%stone-900);\n}\n.ht[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.25;\n}\n.ht[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 17px;\n}\n.ht[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  color: var(--%NS%stone-600);\n}\n.steps[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 8px 8px;\n  display: grid;\n  grid-template-columns: repeat(5, 1fr);\n  gap: 4px;\n  background: #fff;\n  border-bottom: 1.5px solid var(--%NS%sand-300);\n  position: sticky;\n  top: 60px;\n  z-index: 5;\n}\n.steps[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 3px;\n  padding: 6px 0;\n  border: 0;\n  background: none;\n  cursor: pointer;\n  font: inherit;\n  color: var(--%NS%stone-500);\n  border-radius: 10px;\n}\n.steps[_ngcontent-%COMP%]   button[disabled][_ngcontent-%COMP%] {\n  cursor: default;\n}\n.steps[_ngcontent-%COMP%]   .n[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  border: 2px solid var(--%NS%stone-300);\n  font-size: 13px;\n  font-weight: 700;\n  background: #fff;\n}\n.steps[_ngcontent-%COMP%]   .l[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n}\n.steps[_ngcontent-%COMP%]   li.done[_ngcontent-%COMP%]   .n[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-600);\n  border-color: var(--%NS%forest-600);\n  color: #fff;\n}\n.steps[_ngcontent-%COMP%]   li.done[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-700);\n}\n.steps[_ngcontent-%COMP%]   li.on[_ngcontent-%COMP%]   .n[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-800);\n  color: var(--%NS%forest-800);\n  box-shadow: 0 0 0 3px var(--%NS%forest-100);\n}\n.steps[_ngcontent-%COMP%]   li.on[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-800);\n  background: var(--%NS%forest-50);\n}\n.center[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.nav[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 22px 16px 16px;\n  gap: 4px;\n}\n.big-arrow[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-700);\n  transition: transform 0.35s ease;\n  margin-bottom: 6px;\n}\n.big-arrow.here[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-500);\n}\n.dist[_ngcontent-%COMP%] {\n  font-size: 46px;\n  font-weight: 700;\n  letter-spacing: -0.02em;\n  line-height: 1;\n  color: var(--%NS%stone-900);\n}\n.dir[_ngcontent-%COMP%] {\n  font-size: 17px;\n  font-weight: 600;\n  color: var(--%NS%stone-700);\n}\n.navfacts[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n  width: 100%;\n  margin-top: 14px;\n}\n.nf[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  padding: 10px 12px;\n  border-radius: 12px;\n  border: 1.5px solid var(--%NS%sand-300);\n}\n.nf[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  font-weight: 600;\n  color: var(--%NS%stone-600);\n}\n.nf[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 20px;\n}\n.nf[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-style: normal;\n  font-size: 12.5px;\n  color: var(--%NS%stone-600);\n}\n.nf.ok[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-300);\n  background: var(--%NS%forest-50);\n}\n.nf.warn[_ngcontent-%COMP%] {\n  border-color: #e9c77e;\n  background: var(--%NS%amber-100);\n}\n.nf.bad[_ngcontent-%COMP%] {\n  border-color: #f0aaa4;\n  background: var(--%NS%red-100);\n}\n.nogps[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  gap: 8px;\n  padding: 12px 0;\n  color: var(--%NS%stone-700);\n}\n.coords[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  font-size: 12.5px;\n  color: var(--%NS%stone-600);\n}\n.stackf[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n.rowf[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n  justify-content: flex-end;\n}\n.big[_ngcontent-%COMP%] {\n  font-size: 26px;\n  min-height: 60px;\n  font-weight: 600;\n}\n.layers[_ngcontent-%COMP%] {\n  padding: 8px 12px;\n}\n.lrow[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 0;\n  border-bottom: 1px solid var(--%NS%sand-200);\n}\n.lrow[_ngcontent-%COMP%]   .finput[_ngcontent-%COMP%] {\n  min-width: 0;\n  flex: 1;\n  text-align: center;\n  padding: 0 6px;\n}\n.li[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  background: var(--%NS%sand-200);\n  font-weight: 700;\n  font-size: 14px;\n  flex: none;\n}\n.to[_ngcontent-%COMP%], \n.cm[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: var(--%NS%stone-600);\n  font-weight: 500;\n}\n.rm[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 48px;\n  height: 48px;\n  border: 0;\n  border-radius: 12px;\n  background: none;\n  color: var(--%NS%red-600);\n  cursor: pointer;\n  flex: none;\n}\n.rm[disabled][_ngcontent-%COMP%] {\n  color: var(--%NS%stone-300);\n}\n.lact[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  padding: 10px 0 4px;\n}\n.bad-line[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: flex-start;\n  color: var(--%NS%red-600);\n  font-weight: 500;\n  font-size: 14.5px;\n}\n.photo[_ngcontent-%COMP%] {\n  overflow: hidden;\n}\n.photo.have[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-400);\n}\n.shot[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 12px;\n  cursor: pointer;\n  min-height: 96px;\n}\n.shot[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 96px;\n  height: 72px;\n  object-fit: cover;\n  border-radius: 10px;\n  flex: none;\n  background: var(--%NS%sand-200);\n}\n.cam[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 96px;\n  height: 72px;\n  border-radius: 10px;\n  background: var(--%NS%forest-800);\n  color: #fff;\n  flex: none;\n}\n.pt[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.pt[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 17px;\n  color: var(--%NS%stone-900);\n}\n.pt[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]   vc-icon[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-600);\n}\n.pt[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-style: normal;\n  font-size: 14px;\n  color: var(--%NS%stone-600);\n}\n.lab[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.lt[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  font-size: 16px;\n}\n.lt[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-600);\n  font-weight: 600;\n}\n.lin[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n}\n.lin[_ngcontent-%COMP%]   .finput[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  text-transform: uppercase;\n}\n.scan[_ngcontent-%COMP%] {\n  cursor: pointer;\n  flex: none;\n}\n.checks[_ngcontent-%COMP%] {\n  overflow: hidden;\n}\n.ck[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 12px;\n  padding: 14px 16px;\n  border-bottom: 1px solid var(--%NS%sand-200);\n}\n.ck[_ngcontent-%COMP%]:last-child {\n  border-bottom: 0;\n}\n.ci[_ngcontent-%COMP%] {\n  flex: none;\n  margin-top: 1px;\n}\n.ck.ok[_ngcontent-%COMP%]   .ci[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-600);\n}\n.ck.warn[_ngcontent-%COMP%]   .ci[_ngcontent-%COMP%] {\n  color: #b07500;\n}\n.ck.bad[_ngcontent-%COMP%]   .ci[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n}\n.ck.bad[_ngcontent-%COMP%] {\n  background: var(--%NS%red-100);\n}\n.ct[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.ct[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n.ct[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-style: normal;\n  font-size: 14px;\n  color: var(--%NS%stone-700);\n}\n.warnbox[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  align-items: flex-start;\n  padding: 12px 14px;\n  border-radius: 12px;\n  background: var(--%NS%amber-100);\n  color: #5c3a00;\n  font-size: 14.5px;\n}\n.sum[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.sum[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 10px;\n  font-size: 14.5px;\n}\n.sum[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-600);\n}\n/*# sourceMappingURL=field-capture.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldCapture, [{
    type: Component,
    args: [{ selector: "vc-field-capture", imports: [FormsModule, RouterLink, Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    @if (loading()) {
      <div class="fpage"><div class="fcard fempty"><h3>Opening point\u2026</h3></div></div>
    } @else if (!point() || !bundle()) {
      <div class="fpage"><div class="fcard fempty">
        <div class="ic"><vc-icon name="alert" [size]="26" /></div><h3>This point isn't on this phone</h3>
        <p>Download the campaign again from Home.</p><a class="fbtn secondary" routerLink="/field">Back to Home</a>
      </div></div>
    } @else {
      @let p = point()!;
      @let b = bundle()!;
      <div class="head">
        <a [routerLink]="['/field/campaign', cid()]" class="back" aria-label="Back to the list"><vc-icon name="x" [size]="22" /></a>
        <div class="ht"><strong class="mono">{{ p.site_code }}</strong><span>Field {{ p.field_code }} \xB7 {{ b.campaign.code }}</span></div>
      </div>
      <ol class="steps">
        @for (s of steps; track s.key; let i = $index) {
          <li [class.on]="s.key === step()" [class.done]="i < stepIndex()">
            <button (click)="go(s.key)" [disabled]="i > maxReached()"><span class="n">{{ i < stepIndex() ? '\u2713' : i + 1 }}</span><span class="l">{{ s.label }}</span></button>
          </li>
        }
      </ol>

      <div class="fpage">
        @switch (step()) {
          <!-- ---------------------------------------------------- navigate -->
          @case ('navigate') {
            <section class="fcard nav">
              @if (fix(); as f) {
                <div class="big-arrow" [style.transform]="'rotate(' + arrow() + 'deg)'" [class.here]="closeEnough()">
                  <svg viewBox="0 0 24 24" width="120" height="120"><path d="M12 1.5 20.5 21 12 16.2 3.5 21Z" fill="currentColor" /></svg>
                </div>
                <div class="dist num">{{ human(distance()!) }}</div>
                <div class="dir">{{ closeEnough() ? 'You are at the site' : 'towards ' + dirText() }}</div>
                @if (gps.heading() === null) { <div class="fhint">Arrow points relative to north. Hold the phone with the top facing north.</div> }
                <div class="navfacts">
                  <div [class]="'nf ' + accTone()"><span>GPS accuracy</span><strong class="num">\xB1{{ round(f.accuracy) }} m</strong><em>limit {{ accMax() ?? '\u2014' }} m</em></div>
                  <div [class]="'nf ' + (closeEnough() ? 'ok' : 'warn')"><span>Allowed distance</span><strong class="num">{{ distMax() ?? '\u2014' }} m</strong><em>from the planned site</em></div>
                </div>
              } @else {
                <div class="nogps">
                  <vc-icon name="locate" [size]="44" />
                  <h3>{{ gps.supported ? 'Finding your position\u2026' : 'This phone has no GPS' }}</h3>
                  <p>{{ gps.error() || 'Stand in the open. This can take up to a minute the first time.' }}</p>
                </div>
              }
              <div class="coords mono">Site {{ p.latitude.toFixed(6) }}, {{ p.longitude.toFixed(6) }}</div>
            </section>
            <button class="fbtn primary block" [disabled]="!fix()" (click)="arrived()"><vc-icon name="pin" [size]="20" />I'm at the site \u2014 start</button>
            @if (fix() && !closeEnough()) { <p class="fhint center">You can start further away, but the sample will be flagged for the office to review.</p> }
            <button class="fbtn ghost block" (click)="skipOpen.set(true)" [disabled]="!store.online()"><vc-icon name="ban" [size]="20" />Can't sample here</button>
            @if (!store.online()) { <p class="fhint center">Skipping a point needs a connection so your supervisor sees it straight away.</p> }
            @if (skipOpen()) {
              <section class="fcard fcard-pad stackf">
                <label class="flabel" for="skip">Why can't this point be sampled?</label>
                <textarea id="skip" class="finput" [(ngModel)]="skipReason" placeholder="Standing crop \u2014 farmer asked us not to enter until harvest."></textarea>
                <div class="rowf">
                  <button class="fbtn ghost sm" (click)="skipOpen.set(false)">Cancel</button>
                  <button class="fbtn danger sm" [disabled]="skipReason.trim().length < 5 || busy()" (click)="skip()">Skip point</button>
                </div>
              </section>
            }
          }

          <!-- ---------------------------------------------------- core -->
          @case ('core') {
            <section class="fcard fcard-pad stackf">
              <div>
                <label class="flabel" for="depth">Depth the core reached (cm)</label>
                <input id="depth" class="finput num big" type="number" inputmode="decimal" min="1" max="300" [ngModel]="reached()" (ngModelChange)="reached.set($event === '' || $event === null ? null : +$event)" />
                <div class="fhint">The campaign needs {{ b.campaign.depth_from_cm }}\u2013{{ b.campaign.depth_to_cm }} cm.</div>
              </div>
              @if (shallow()) {
                <div>
                  <label class="flabel" for="dev">Why didn't the core reach {{ b.campaign.depth_to_cm }} cm?</label>
                  <textarea id="dev" class="finput" [ngModel]="deviation()" (ngModelChange)="deviation.set($event)" placeholder="Hit laterite rock at 22 cm; tried twice within 1 m."></textarea>
                  @if (!deviation().trim()) { <div class="ferr">A reason is required for a shallow core.</div> }
                </div>
              }
            </section>

            <div class="fsec">Layers (one bag each)</div>
            <section class="fcard layers">
              @for (l of layers(); track $index; let i = $index) {
                <div class="lrow">
                  <span class="li">{{ i + 1 }}</span>
                  <input class="finput num" type="number" inputmode="decimal" [ngModel]="l.from" (ngModelChange)="setLayer(i, 'from', $event)" [attr.aria-label]="'Layer ' + (i + 1) + ' from'" />
                  <span class="to">to</span>
                  <input class="finput num" type="number" inputmode="decimal" [ngModel]="l.to" (ngModelChange)="setLayer(i, 'to', $event)" [attr.aria-label]="'Layer ' + (i + 1) + ' to'" />
                  <span class="cm">cm</span>
                  <button class="rm" (click)="removeLayer(i)" [disabled]="layers().length === 1" aria-label="Remove layer"><vc-icon name="trash" [size]="20" /></button>
                </div>
              }
              <div class="lact">
                <button class="fbtn ghost sm" (click)="addLayer()"><vc-icon name="plus" [size]="18" />Add layer</button>
                @if (shallow() && reached()) { <button class="fbtn ghost sm" (click)="fitLayers()"><vc-icon name="ruler" [size]="18" />Fit to {{ reached() }} cm</button> }
                <button class="fbtn ghost sm" (click)="resetLayers()"><vc-icon name="rotate-ccw" [size]="18" />Reset</button>
              </div>
            </section>
            @for (e of layerErrors(); track e) { <div class="bad-line"><vc-icon name="alert" [size]="18" />{{ e }}</div> }
            <button class="fbtn primary block" [disabled]="!coreOk()" (click)="next()">Next: photos<vc-icon name="arrow-right" [size]="20" /></button>
          }

          <!-- ---------------------------------------------------- photos -->
          @case ('photos') {
            <p class="fsub">Take {{ requiredPhotos() }} photos. Each is stamped with the time and your position.</p>
            @for (k of kinds; track k.kind) {
              @let ph = photoOf(k.kind);
              <section class="fcard photo" [class.have]="!!ph">
                <label class="shot">
                  <input type="file" accept="image/*" capture="environment" (change)="takePhoto(k.kind, $event)" hidden />
                  @if (ph) {
                    <img [src]="thumbs()[k.kind]" [alt]="k.label" />
                  } @else {
                    <span class="cam"><vc-icon name="camera" [size]="34" /></span>
                  }
                  <span class="pt">
                    <strong>{{ k.label }} @if (ph) { <vc-icon name="check-circle" [size]="18" [stroke]="2.4" /> }</strong>
                    <em>{{ ph ? 'Tap to retake' : k.hint }}</em>
                  </span>
                </label>
              </section>
            }
            @if (processing()) { <p class="fhint center">Preparing photo\u2026</p> }
            <button class="fbtn primary block" [disabled]="photoCount() < requiredPhotos()" (click)="next()">Next: labels<vc-icon name="arrow-right" [size]="20" /></button>
            @if (photoCount() < requiredPhotos()) { <p class="fhint center">{{ requiredPhotos() - photoCount() }} more photo(s) needed.</p> }
          }

          <!-- ---------------------------------------------------- labels -->
          @case ('labels') {
            <p class="fsub">Put each layer in its own bag and record the label on the bag.
              @if (canScan) { Tap <b>Scan</b> to read the QR code with the camera. } @else { Type the code printed under the QR. }</p>
            @for (l of layers(); track $index; let i = $index) {
              <section class="fcard fcard-pad lab">
                <div class="lt"><strong>Layer {{ i + 1 }}</strong><span class="num">{{ l.from }}\u2013{{ l.to }} cm</span></div>
                <div class="lin">
                  <input class="finput mono" [class.bad]="!!labelError(i)" [ngModel]="l.label" (ngModelChange)="setLabel(i, $event)" placeholder="Bag label" autocapitalize="characters" autocomplete="off" [attr.aria-label]="'Label for layer ' + (i + 1)" />
                  @if (canScan) {
                    <label class="fbtn secondary sm scan">
                      <input type="file" accept="image/*" capture="environment" (change)="scan(i, $event)" hidden />
                      <vc-icon name="scan-qr" [size]="20" />Scan
                    </label>
                  }
                </div>
                @if (labelError(i)) { <div class="ferr">{{ labelError(i) }}</div> } @else if (!l.label) { <div class="fhint">Scan or type the label on this bag.</div> }
              </section>
            }
            <button class="fbtn primary block" [disabled]="!labelsOk()" (click)="next()">Next: review<vc-icon name="arrow-right" [size]="20" /></button>
          }

          <!-- ---------------------------------------------------- review -->
          @case ('review') {
            <section class="fcard checks">
              @for (c of checks(); track c.key) {
                <div class="ck" [class]="'ck ' + c.tone">
                  <span class="ci"><vc-icon [name]="c.tone === 'ok' ? 'check-circle' : c.tone === 'warn' ? 'alert' : 'x-circle'" [size]="22" [stroke]="2.2" /></span>
                  <span class="ct"><strong>{{ c.label }}</strong><em>{{ c.detail }}</em></span>
                </div>
              }
            </section>
            @if (hasWarnings() && !blocked()) {
              <div class="warnbox"><vc-icon name="alert" [size]="18" />You can still save. The office will see these warnings as quality findings on this sample.</div>
            }
            <section class="fcard fcard-pad sum">
              <div><span>Position</span><strong class="mono">{{ locked()?.lat?.toFixed(6) }}, {{ locked()?.lon?.toFixed(6) }}</strong></div>
              <div><span>Recorded at</span><strong>{{ lockedAt() }}</strong></div>
              <button class="fbtn ghost sm" [disabled]="!fix()" (click)="relock()"><vc-icon name="locate" [size]="18" />Use current position</button>
            </section>
            <button class="fbtn primary block" [disabled]="blocked() || busy()" (click)="save()"><vc-icon name="check" [size]="20" />{{ busy() ? 'Saving\u2026' : 'Save sample' }}</button>
            <p class="fhint center">Saved on this phone first. It uploads automatically when there is signal.</p>
          }
        }
      </div>
    }
  `, styles: [`/* angular:styles/component:scss;8145719d236d938b;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\field-app\\field-capture.ts */
:host {
  display: block;
}
.fpage {
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ftitle {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--stone-900);
  line-height: 1.2;
}
.fsub {
  font-size: 14.5px;
  color: var(--stone-700);
}
.fcard {
  background: #fff;
  border: 1.5px solid var(--sand-300);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(16, 41, 28, 0.06);
}
.fcard-pad {
  padding: 16px;
}
.fsec {
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--stone-600);
  margin: 4px 2px -6px;
}
.fbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 20px;
  border-radius: 12px;
  border: 2px solid transparent;
  font: 600 16px var(--font);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  text-decoration: none !important;
  -webkit-tap-highlight-color: transparent;
}
.fbtn:active {
  transform: translateY(1px);
}
.fbtn[disabled] {
  opacity: 0.45;
  cursor: not-allowed;
}
.fbtn.primary {
  background: var(--forest-700);
  color: #fff;
}
.fbtn.primary:hover:not([disabled]) {
  background: var(--forest-800);
}
.fbtn.secondary {
  background: #fff;
  color: var(--forest-800);
  border-color: var(--forest-700);
}
.fbtn.ghost {
  background: transparent;
  color: var(--stone-800);
  border-color: var(--sand-300);
}
.fbtn.danger {
  background: #fff;
  color: var(--red-600);
  border-color: var(--red-600);
}
.fbtn.block {
  width: 100%;
}
.fbtn.sm {
  min-height: 44px;
  padding: 0 14px;
  font-size: 15px;
  border-radius: 10px;
}
.finput {
  width: 100%;
  min-height: 52px;
  padding: 0 14px;
  border: 2px solid var(--stone-300);
  border-radius: 12px;
  background: #fff;
  font: 500 17px var(--font);
  color: var(--stone-900);
  outline: none;
}
textarea.finput {
  min-height: 96px;
  padding: 12px 14px;
  line-height: 1.45;
}
select.finput {
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231d2420' stroke-width='2.2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}
.finput:focus {
  border-color: var(--forest-600);
  box-shadow: 0 0 0 3px rgba(47, 114, 73, 0.25);
}
.finput.bad {
  border-color: var(--red-600);
}
.flabel {
  display: block;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--stone-800);
  margin-bottom: 6px;
}
.fhint {
  font-size: 13.5px;
  color: var(--stone-600);
  margin-top: 6px;
}
.ferr {
  font-size: 14px;
  color: var(--red-600);
  margin-top: 6px;
  font-weight: 500;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.chip.ok {
  background: var(--forest-100);
  color: var(--forest-800);
}
.chip.warn {
  background: var(--amber-100);
  color: #7a4d00;
}
.chip.bad {
  background: var(--red-100);
  color: var(--red-600);
}
.chip.info {
  background: var(--sky-100);
  color: var(--sky-600);
}
.chip.muted {
  background: var(--stone-100);
  color: var(--stone-700);
}
.fempty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 28px 16px;
  color: var(--stone-700);
}
.fempty .ic {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--sand-200);
  color: var(--stone-700);
  margin-bottom: 4px;
}
.fempty h3 {
  font-size: 17px;
}
.num {
  font-variant-numeric: tabular-nums;
}
.mono {
  font-family: var(--mono);
}
/*# sourceMappingURL=field-capture.css.map */
`, "/* angular:styles/component:scss;89e497ffc0492df5;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\field-app\\field-capture.ts */\n.head {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 12px;\n  background: #fff;\n  border-bottom: 1.5px solid var(--sand-300);\n}\n.back {\n  display: grid;\n  place-items: center;\n  width: 48px;\n  height: 48px;\n  border-radius: 12px;\n  color: var(--stone-900);\n}\n.ht {\n  display: flex;\n  flex-direction: column;\n  line-height: 1.25;\n}\n.ht strong {\n  font-size: 17px;\n}\n.ht span {\n  font-size: 13.5px;\n  color: var(--stone-600);\n}\n.steps {\n  list-style: none;\n  margin: 0;\n  padding: 8px 8px;\n  display: grid;\n  grid-template-columns: repeat(5, 1fr);\n  gap: 4px;\n  background: #fff;\n  border-bottom: 1.5px solid var(--sand-300);\n  position: sticky;\n  top: 60px;\n  z-index: 5;\n}\n.steps button {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 3px;\n  padding: 6px 0;\n  border: 0;\n  background: none;\n  cursor: pointer;\n  font: inherit;\n  color: var(--stone-500);\n  border-radius: 10px;\n}\n.steps button[disabled] {\n  cursor: default;\n}\n.steps .n {\n  display: grid;\n  place-items: center;\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  border: 2px solid var(--stone-300);\n  font-size: 13px;\n  font-weight: 700;\n  background: #fff;\n}\n.steps .l {\n  font-size: 12px;\n  font-weight: 600;\n}\n.steps li.done .n {\n  background: var(--forest-600);\n  border-color: var(--forest-600);\n  color: #fff;\n}\n.steps li.done button {\n  color: var(--forest-700);\n}\n.steps li.on .n {\n  border-color: var(--forest-800);\n  color: var(--forest-800);\n  box-shadow: 0 0 0 3px var(--forest-100);\n}\n.steps li.on button {\n  color: var(--forest-800);\n  background: var(--forest-50);\n}\n.center {\n  text-align: center;\n}\n.nav {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 22px 16px 16px;\n  gap: 4px;\n}\n.big-arrow {\n  color: var(--forest-700);\n  transition: transform 0.35s ease;\n  margin-bottom: 6px;\n}\n.big-arrow.here {\n  color: var(--forest-500);\n}\n.dist {\n  font-size: 46px;\n  font-weight: 700;\n  letter-spacing: -0.02em;\n  line-height: 1;\n  color: var(--stone-900);\n}\n.dir {\n  font-size: 17px;\n  font-weight: 600;\n  color: var(--stone-700);\n}\n.navfacts {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n  width: 100%;\n  margin-top: 14px;\n}\n.nf {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  padding: 10px 12px;\n  border-radius: 12px;\n  border: 1.5px solid var(--sand-300);\n}\n.nf span {\n  font-size: 12.5px;\n  font-weight: 600;\n  color: var(--stone-600);\n}\n.nf strong {\n  font-size: 20px;\n}\n.nf em {\n  font-style: normal;\n  font-size: 12.5px;\n  color: var(--stone-600);\n}\n.nf.ok {\n  border-color: var(--forest-300);\n  background: var(--forest-50);\n}\n.nf.warn {\n  border-color: #e9c77e;\n  background: var(--amber-100);\n}\n.nf.bad {\n  border-color: #f0aaa4;\n  background: var(--red-100);\n}\n.nogps {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  gap: 8px;\n  padding: 12px 0;\n  color: var(--stone-700);\n}\n.coords {\n  margin-top: 12px;\n  font-size: 12.5px;\n  color: var(--stone-600);\n}\n.stackf {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n.rowf {\n  display: flex;\n  gap: 10px;\n  justify-content: flex-end;\n}\n.big {\n  font-size: 26px;\n  min-height: 60px;\n  font-weight: 600;\n}\n.layers {\n  padding: 8px 12px;\n}\n.lrow {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 0;\n  border-bottom: 1px solid var(--sand-200);\n}\n.lrow .finput {\n  min-width: 0;\n  flex: 1;\n  text-align: center;\n  padding: 0 6px;\n}\n.li {\n  display: grid;\n  place-items: center;\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  background: var(--sand-200);\n  font-weight: 700;\n  font-size: 14px;\n  flex: none;\n}\n.to,\n.cm {\n  font-size: 14px;\n  color: var(--stone-600);\n  font-weight: 500;\n}\n.rm {\n  display: grid;\n  place-items: center;\n  width: 48px;\n  height: 48px;\n  border: 0;\n  border-radius: 12px;\n  background: none;\n  color: var(--red-600);\n  cursor: pointer;\n  flex: none;\n}\n.rm[disabled] {\n  color: var(--stone-300);\n}\n.lact {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  padding: 10px 0 4px;\n}\n.bad-line {\n  display: flex;\n  gap: 8px;\n  align-items: flex-start;\n  color: var(--red-600);\n  font-weight: 500;\n  font-size: 14.5px;\n}\n.photo {\n  overflow: hidden;\n}\n.photo.have {\n  border-color: var(--forest-400);\n}\n.shot {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 12px;\n  cursor: pointer;\n  min-height: 96px;\n}\n.shot img {\n  width: 96px;\n  height: 72px;\n  object-fit: cover;\n  border-radius: 10px;\n  flex: none;\n  background: var(--sand-200);\n}\n.cam {\n  display: grid;\n  place-items: center;\n  width: 96px;\n  height: 72px;\n  border-radius: 10px;\n  background: var(--forest-800);\n  color: #fff;\n  flex: none;\n}\n.pt {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.pt strong {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 17px;\n  color: var(--stone-900);\n}\n.pt strong vc-icon {\n  color: var(--forest-600);\n}\n.pt em {\n  font-style: normal;\n  font-size: 14px;\n  color: var(--stone-600);\n}\n.lab {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.lt {\n  display: flex;\n  justify-content: space-between;\n  font-size: 16px;\n}\n.lt span {\n  color: var(--stone-600);\n  font-weight: 600;\n}\n.lin {\n  display: flex;\n  gap: 8px;\n}\n.lin .finput {\n  flex: 1;\n  min-width: 0;\n  text-transform: uppercase;\n}\n.scan {\n  cursor: pointer;\n  flex: none;\n}\n.checks {\n  overflow: hidden;\n}\n.ck {\n  display: flex;\n  align-items: flex-start;\n  gap: 12px;\n  padding: 14px 16px;\n  border-bottom: 1px solid var(--sand-200);\n}\n.ck:last-child {\n  border-bottom: 0;\n}\n.ci {\n  flex: none;\n  margin-top: 1px;\n}\n.ck.ok .ci {\n  color: var(--forest-600);\n}\n.ck.warn .ci {\n  color: #b07500;\n}\n.ck.bad .ci {\n  color: var(--red-600);\n}\n.ck.bad {\n  background: var(--red-100);\n}\n.ct {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.ct strong {\n  font-size: 16px;\n}\n.ct em {\n  font-style: normal;\n  font-size: 14px;\n  color: var(--stone-700);\n}\n.warnbox {\n  display: flex;\n  gap: 8px;\n  align-items: flex-start;\n  padding: 12px 14px;\n  border-radius: 12px;\n  background: var(--amber-100);\n  color: #5c3a00;\n  font-size: 14.5px;\n}\n.sum {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.sum div {\n  display: flex;\n  justify-content: space-between;\n  gap: 10px;\n  font-size: 14.5px;\n}\n.sum span {\n  color: var(--stone-600);\n}\n/*# sourceMappingURL=field-capture.css.map */\n"] }]
  }], () => [], { cid: [{ type: Input, args: [{ isSignal: true, alias: "cid", required: true }] }], pid: [{ type: Input, args: [{ isSignal: true, alias: "pid", required: true }] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FieldCapture, { className: "FieldCapture", filePath: "src/app/features/field-app/field-capture.ts", lineNumber: 298 });
})();

// src/app/features/field-app/field-home.ts
var _forTrack03 = ($index, $item) => $item.id;
function FieldHome_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Uploading your records\u2026 ");
  }
}
function FieldHome_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1(" ", ctx_r0.store.queued(), " record(s) waiting to upload ");
  }
}
function FieldHome_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, " Everything on this phone is uploaded ");
  }
}
function FieldHome_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 13);
    \u0275\u0275element(1, "vc-icon", 17);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Review ", ctx_r0.store.rejected(), " rejected");
  }
}
function FieldHome_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275element(1, "span")(2, "span")(3, "span");
    \u0275\u0275elementEnd();
  }
}
function FieldHome_Conditional_42_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 16)(1, "div", 18);
    \u0275\u0275element(2, "vc-icon", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4, "Couldn't load your campaigns");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 20);
    \u0275\u0275listener("click", function FieldHome_Conditional_42_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.load());
    });
    \u0275\u0275text(8, "Try again");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 26);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.error());
  }
}
function FieldHome_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "div", 18);
    \u0275\u0275element(2, "vc-icon", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4, "No points assigned to you");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "When your supervisor assigns sampling points, the campaign appears here. You can still record practices.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "a", 22);
    \u0275\u0275element(8, "vc-icon", 23);
    \u0275\u0275text(9, "Record a practice");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 26);
    \u0275\u0275advance(6);
    \u0275\u0275property("size", 20);
  }
}
function FieldHome_Conditional_44_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 24);
    \u0275\u0275element(1, "vc-icon", 26);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "ago");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("Showing the list saved ", \u0275\u0275pipeBind1(3, 3, ctx_r0.data.assignmentsAt()), ". ", ctx_r0.error());
  }
}
function FieldHome_Conditional_44_For_2_Conditional_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 38);
    \u0275\u0275element(1, "vc-icon", 39);
    \u0275\u0275text(2, "Finished \xB7 no more cores accepted");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
  }
}
function FieldHome_Conditional_44_For_2_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 40);
    \u0275\u0275element(1, "vc-icon", 41);
    \u0275\u0275text(2);
    \u0275\u0275pipe(3, "ago");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "button", 42);
    \u0275\u0275listener("click", function FieldHome_Conditional_44_For_2_Conditional_29_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r5);
      const c_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.download(c_r4));
    });
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r4 = \u0275\u0275nextContext().$implicit;
    const b_r6 = \u0275\u0275readContextLet(0);
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("size", 18)("stroke", 2.2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Ready offline \xB7 saved ", \u0275\u0275pipeBind1(3, 5, b_r6.savedAt));
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r0.store.online() || ctx_r0.busy() === c_r4.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.busy() === c_r4.id ? "Updating\u2026" : "Update");
  }
}
function FieldHome_Conditional_44_For_2_Conditional_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 38);
    \u0275\u0275element(1, "vc-icon", 43);
    \u0275\u0275text(2, "Not downloaded");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 44);
    \u0275\u0275listener("click", function FieldHome_Conditional_44_For_2_Conditional_30_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r7);
      const c_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.download(c_r4));
    });
    \u0275\u0275element(4, "vc-icon", 43);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r0.store.online() || ctx_r0.busy() === c_r4.id);
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r0.busy() === c_r4.id ? "Downloading\u2026" : "Download for offline", " ");
  }
}
function FieldHome_Conditional_44_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275declareLet(0);
    \u0275\u0275elementStart(1, "article", 25)(2, "button", 27);
    \u0275\u0275listener("click", function FieldHome_Conditional_44_For_2_Template_button_click_2_listener() {
      const c_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.open(c_r4));
    });
    \u0275\u0275elementStart(3, "div", 28)(4, "div", 29)(5, "span", 30);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 31);
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "human");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "h3");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 32);
    \u0275\u0275text(13);
    \u0275\u0275pipe(14, "human");
    \u0275\u0275pipe(15, "day");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(16, "vc-icon", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 34)(18, "div", 35)(19, "span")(20, "b", 9);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275text(22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "span");
    \u0275\u0275text(24);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "div", 36);
    \u0275\u0275element(26, "i");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 37);
    \u0275\u0275conditionalCreate(28, FieldHome_Conditional_44_For_2_Conditional_28_Template, 3, 1, "span", 38)(29, FieldHome_Conditional_44_For_2_Conditional_29_Template, 6, 7)(30, FieldHome_Conditional_44_For_2_Conditional_30_Template, 6, 4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const c_r4 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    const b_r8 = \u0275\u0275storeLet(ctx_r0.bundleOf(c_r4.id));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(c_r4.code);
    \u0275\u0275advance();
    \u0275\u0275classMap("chip " + ctx_r0.tone(c_r4.status));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(9, 17, c_r4.status));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(c_r4.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate4("", \u0275\u0275pipeBind1(14, 19, c_r4.kind), " \xB7 depth ", c_r4.depth_from_cm, "\u2013", c_r4.depth_to_cm, " cm \xB7 until ", \u0275\u0275pipeBind1(15, 21, c_r4.planned_end));
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 24);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.done(c_r4));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" of ", c_r4.points.length, " points done");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", c_r4.remaining, " to go");
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("width", c_r4.points.length ? 100 * ctx_r0.done(c_r4) / c_r4.points.length : 0, "%");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(c_r4.status === "complete" ? 28 : b_r8 ? 29 : 30);
  }
}
function FieldHome_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, FieldHome_Conditional_44_Conditional_0_Template, 4, 5, "p", 24);
    \u0275\u0275repeaterCreate(1, FieldHome_Conditional_44_For_2_Template, 31, 23, "article", 25, _forTrack03);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.error() ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.list());
  }
}
var FieldHome = class _FieldHome {
  auth = inject(AuthService);
  router = inject(Router);
  toast = inject(ToastService);
  store = inject(OfflineStore);
  data = inject(FieldData);
  loading = signal(
    false,
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
  busy = signal(
    null,
    ...ngDevMode ? [{ debugName: "busy" }] : (
      /* istanbul ignore next */
      []
    )
  );
  today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  /** Active work first; finished campaigns last. */
  list = computed(
    () => {
      const order = { fieldwork: 0, planned: 1, lab: 2, complete: 3 };
      return [...this.data.assignments()].sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9) || a.planned_start.localeCompare(b.planned_start));
    },
    ...ngDevMode ? [{ debugName: "list" }] : (
      /* istanbul ignore next */
      []
    )
  );
  firstName = computed(
    () => (this.auth.profile()?.full_name ?? "").split(" ")[0],
    ...ngDevMode ? [{ debugName: "firstName" }] : (
      /* istanbul ignore next */
      []
    )
  );
  greeting = computed(
    () => {
      const h = (/* @__PURE__ */ new Date()).getHours();
      return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
    },
    ...ngDevMode ? [{ debugName: "greeting" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.load();
  }
  async load() {
    if (!navigator.onLine) {
      this.error.set("You're offline.");
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.data.loadAssignments();
    } catch (e) {
      this.error.set(e.message);
    } finally {
      this.loading.set(false);
    }
  }
  bundleOf(id) {
    return this.data.bundles().find((b) => b.campaignId === id) ?? null;
  }
  done(c) {
    return c.points.filter((p) => p.status !== "planned").length;
  }
  tone(s) {
    return s === "fieldwork" ? "ok" : s === "planned" ? "info" : "muted";
  }
  async sync() {
    await this.store.sync();
    if (navigator.onLine)
      void this.load();
  }
  async download(c) {
    this.busy.set(c.id);
    try {
      const b = await this.data.download(c.id);
      this.toast.success(`${c.code} is ready offline`, `${b.points.length} points and ${b.fields.features.length} field boundaries saved on this phone.`);
    } catch (e) {
      this.toast.apiError(e, "Couldn't download the campaign");
    } finally {
      this.busy.set(null);
    }
  }
  open(c) {
    this.router.navigate(["/field/campaign", c.id]);
  }
  static \u0275fac = function FieldHome_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FieldHome)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FieldHome, selectors: [["vc-field-home"]], decls: 45, vars: 22, consts: [[1, "fpage"], [1, "ftitle"], [1, "fsub"], [1, "fcard", "status"], [1, "srow"], [1, "sic"], [3, "name", "size", "stroke"], [1, "st"], [1, "counts"], [1, "num"], [1, "sact"], [1, "fbtn", "primary", "block", 3, "click", "disabled"], ["name", "refresh", 3, "size"], ["routerLink", "/field/outbox", 1, "fbtn", "danger", "block"], [1, "fsec"], [1, "fcard", "fcard-pad", "skel"], [1, "fcard", "fempty"], ["name", "alert", 3, "size"], [1, "ic"], ["name", "wifi-off", 3, "size"], [1, "fbtn", "secondary", 3, "click"], ["name", "clipboard", 3, "size"], ["routerLink", "/field/practice", 1, "fbtn", "secondary"], ["name", "sprout", 3, "size"], [1, "stale"], [1, "fcard", "camp"], ["name", "info", 3, "size"], [1, "ctop", 3, "click"], [1, "cinfo"], [1, "cl"], [1, "code", "mono"], [1, "chip"], [1, "cm"], ["name", "chevron-right", 3, "size"], [1, "cprog"], [1, "pl"], [1, "bar"], [1, "cfoot"], [1, "dl"], ["name", "lock", 3, "size"], [1, "dl", "ok"], ["name", "check-circle", 3, "size", "stroke"], [1, "fbtn", "ghost", "sm", 3, "click", "disabled"], ["name", "download", 3, "size"], [1, "fbtn", "secondary", "sm", 3, "click", "disabled"]], template: function FieldHome_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "div", 1);
      \u0275\u0275text(3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 2);
      \u0275\u0275text(5);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "section", 3)(7, "div", 4)(8, "span", 5);
      \u0275\u0275element(9, "vc-icon", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "div", 7)(11, "strong");
      \u0275\u0275text(12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "span");
      \u0275\u0275conditionalCreate(14, FieldHome_Conditional_14_Template, 1, 0)(15, FieldHome_Conditional_15_Template, 1, 1)(16, FieldHome_Conditional_16_Template, 1, 0);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(17, "div", 8)(18, "div")(19, "b", 9);
      \u0275\u0275text(20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "span");
      \u0275\u0275text(22, "Waiting");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "div")(24, "b", 9);
      \u0275\u0275text(25);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "span");
      \u0275\u0275text(27, "Need attention");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "div")(29, "b");
      \u0275\u0275text(30);
      \u0275\u0275pipe(31, "ago");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "span");
      \u0275\u0275text(33, "Last sync");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(34, "div", 10)(35, "button", 11);
      \u0275\u0275listener("click", function FieldHome_Template_button_click_35_listener() {
        return ctx.sync();
      });
      \u0275\u0275element(36, "vc-icon", 12);
      \u0275\u0275text(37);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(38, FieldHome_Conditional_38_Template, 3, 2, "a", 13);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(39, "div", 14);
      \u0275\u0275text(40, "My campaigns");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(41, FieldHome_Conditional_41_Template, 4, 0, "div", 15)(42, FieldHome_Conditional_42_Template, 9, 2, "div", 16)(43, FieldHome_Conditional_43_Template, 10, 2, "div", 16)(44, FieldHome_Conditional_44_Template, 3, 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate2("", ctx.greeting(), ", ", ctx.firstName());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.today);
      \u0275\u0275advance();
      \u0275\u0275classMap("fcard status s-" + ctx.store.status());
      \u0275\u0275advance(3);
      \u0275\u0275property("name", ctx.store.online() ? "wifi" : "wifi-off")("size", 22)("stroke", 2.2);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.store.online() ? "Online" : "Offline");
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.store.syncing() ? 14 : ctx.store.queued() ? 15 : 16);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.store.queued());
      \u0275\u0275advance(3);
      \u0275\u0275classProp("bad", ctx.store.rejected());
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.store.rejected());
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.store.lastSync() ? \u0275\u0275pipeBind1(31, 20, ctx.store.lastSync()) : "Never");
      \u0275\u0275advance(5);
      \u0275\u0275property("disabled", !ctx.store.online() || ctx.store.syncing());
      \u0275\u0275advance();
      \u0275\u0275property("size", 20);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1("", ctx.store.syncing() ? "Syncing\u2026" : "Sync now", " ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.store.rejected() ? 38 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.loading() && !ctx.list().length ? 41 : ctx.error() && !ctx.list().length ? 42 : !ctx.list().length ? 43 : 44);
    }
  }, dependencies: [RouterLink, Icon, AgoPipe, DayPipe, HumanPipe], styles: [`
[_nghost-%COMP%] {
  display: block;
}
.fpage[_ngcontent-%COMP%] {
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ftitle[_ngcontent-%COMP%] {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--%NS%stone-900);
  line-height: 1.2;
}
.fsub[_ngcontent-%COMP%] {
  font-size: 14.5px;
  color: var(--%NS%stone-700);
}
.fcard[_ngcontent-%COMP%] {
  background: #fff;
  border: 1.5px solid var(--%NS%sand-300);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(16, 41, 28, 0.06);
}
.fcard-pad[_ngcontent-%COMP%] {
  padding: 16px;
}
.fsec[_ngcontent-%COMP%] {
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--%NS%stone-600);
  margin: 4px 2px -6px;
}
.fbtn[_ngcontent-%COMP%] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 20px;
  border-radius: 12px;
  border: 2px solid transparent;
  font: 600 16px var(--%NS%font);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  text-decoration: none !important;
  -webkit-tap-highlight-color: transparent;
}
.fbtn[_ngcontent-%COMP%]:active {
  transform: translateY(1px);
}
.fbtn[disabled][_ngcontent-%COMP%] {
  opacity: 0.45;
  cursor: not-allowed;
}
.fbtn.primary[_ngcontent-%COMP%] {
  background: var(--%NS%forest-700);
  color: #fff;
}
.fbtn.primary[_ngcontent-%COMP%]:hover:not([disabled]) {
  background: var(--%NS%forest-800);
}
.fbtn.secondary[_ngcontent-%COMP%] {
  background: #fff;
  color: var(--%NS%forest-800);
  border-color: var(--%NS%forest-700);
}
.fbtn.ghost[_ngcontent-%COMP%] {
  background: transparent;
  color: var(--%NS%stone-800);
  border-color: var(--%NS%sand-300);
}
.fbtn.danger[_ngcontent-%COMP%] {
  background: #fff;
  color: var(--%NS%red-600);
  border-color: var(--%NS%red-600);
}
.fbtn.block[_ngcontent-%COMP%] {
  width: 100%;
}
.fbtn.sm[_ngcontent-%COMP%] {
  min-height: 44px;
  padding: 0 14px;
  font-size: 15px;
  border-radius: 10px;
}
.finput[_ngcontent-%COMP%] {
  width: 100%;
  min-height: 52px;
  padding: 0 14px;
  border: 2px solid var(--%NS%stone-300);
  border-radius: 12px;
  background: #fff;
  font: 500 17px var(--%NS%font);
  color: var(--%NS%stone-900);
  outline: none;
}
textarea.finput[_ngcontent-%COMP%] {
  min-height: 96px;
  padding: 12px 14px;
  line-height: 1.45;
}
select.finput[_ngcontent-%COMP%] {
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231d2420' stroke-width='2.2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}
.finput[_ngcontent-%COMP%]:focus {
  border-color: var(--%NS%forest-600);
  box-shadow: 0 0 0 3px rgba(47, 114, 73, 0.25);
}
.finput.bad[_ngcontent-%COMP%] {
  border-color: var(--%NS%red-600);
}
.flabel[_ngcontent-%COMP%] {
  display: block;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--%NS%stone-800);
  margin-bottom: 6px;
}
.fhint[_ngcontent-%COMP%] {
  font-size: 13.5px;
  color: var(--%NS%stone-600);
  margin-top: 6px;
}
.ferr[_ngcontent-%COMP%] {
  font-size: 14px;
  color: var(--%NS%red-600);
  margin-top: 6px;
  font-weight: 500;
}
.chip[_ngcontent-%COMP%] {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.chip.ok[_ngcontent-%COMP%] {
  background: var(--%NS%forest-100);
  color: var(--%NS%forest-800);
}
.chip.warn[_ngcontent-%COMP%] {
  background: var(--%NS%amber-100);
  color: #7a4d00;
}
.chip.bad[_ngcontent-%COMP%] {
  background: var(--%NS%red-100);
  color: var(--%NS%red-600);
}
.chip.info[_ngcontent-%COMP%] {
  background: var(--%NS%sky-100);
  color: var(--%NS%sky-600);
}
.chip.muted[_ngcontent-%COMP%] {
  background: var(--%NS%stone-100);
  color: var(--%NS%stone-700);
}
.fempty[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 28px 16px;
  color: var(--%NS%stone-700);
}
.fempty[_ngcontent-%COMP%]   .ic[_ngcontent-%COMP%] {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--%NS%sand-200);
  color: var(--%NS%stone-700);
  margin-bottom: 4px;
}
.fempty[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
  font-size: 17px;
}
.num[_ngcontent-%COMP%] {
  font-variant-numeric: tabular-nums;
}
.mono[_ngcontent-%COMP%] {
  font-family: var(--%NS%mono);
}
/*# sourceMappingURL=field-home.css.map */`, "\n.status[_ngcontent-%COMP%] {\n  padding: 16px;\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n.srow[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.sic[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 46px;\n  height: 46px;\n  border-radius: 14px;\n  background: var(--%NS%forest-100);\n  color: var(--%NS%forest-800);\n}\n.s-offline[_ngcontent-%COMP%]   .sic[_ngcontent-%COMP%] {\n  background: var(--%NS%stone-900);\n  color: #fff;\n}\n.s-pending[_ngcontent-%COMP%]   .sic[_ngcontent-%COMP%] {\n  background: var(--%NS%amber-100);\n  color: #7a4d00;\n}\n.st[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.st[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 18px;\n}\n.st[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 14.5px;\n  color: var(--%NS%stone-700);\n}\n.counts[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1px;\n  background: var(--%NS%sand-300);\n  border-radius: 12px;\n  overflow: hidden;\n  border: 1.5px solid var(--%NS%sand-300);\n}\n.counts[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  background: var(--%NS%sand-50);\n  padding: 10px 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.counts[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  font-size: 18px;\n  color: var(--%NS%stone-900);\n}\n.counts[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12.5px;\n  color: var(--%NS%stone-600);\n  font-weight: 500;\n}\n.counts[_ngcontent-%COMP%]   .bad[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n}\n.sact[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.stale[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  font-size: 13.5px;\n  color: var(--%NS%stone-700);\n}\n.camp[_ngcontent-%COMP%] {\n  overflow: hidden;\n}\n.ctop[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  padding: 16px;\n  border: 0;\n  background: none;\n  text-align: left;\n  font: inherit;\n  cursor: pointer;\n  color: var(--%NS%stone-700);\n}\n.cinfo[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.cl[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.code[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  font-weight: 600;\n  color: var(--%NS%stone-700);\n}\n.camp[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 18px;\n  color: var(--%NS%stone-900);\n  line-height: 1.25;\n}\n.cm[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: var(--%NS%stone-600);\n}\n.cprog[_ngcontent-%COMP%] {\n  padding: 0 16px 14px;\n}\n.pl[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  font-size: 14px;\n  color: var(--%NS%stone-700);\n  margin-bottom: 6px;\n}\n.pl[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  color: var(--%NS%stone-900);\n}\n.bar[_ngcontent-%COMP%] {\n  height: 10px;\n  border-radius: 5px;\n  background: var(--%NS%sand-200);\n  overflow: hidden;\n}\n.bar[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n  background: var(--%NS%forest-600);\n  border-radius: 5px;\n}\n.cfoot[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 16px;\n  border-top: 1.5px solid var(--%NS%sand-200);\n  background: var(--%NS%sand-50);\n}\n.dl[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--%NS%stone-700);\n}\n.dl.ok[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-700);\n}\n.skel[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.skel[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  height: 14px;\n  border-radius: 7px;\n  background: var(--%NS%sand-200);\n}\n.skel[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(2) {\n  width: 70%;\n}\n.skel[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(3) {\n  width: 40%;\n}\n/*# sourceMappingURL=field-home.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldHome, [{
    type: Component,
    args: [{ selector: "vc-field-home", imports: [RouterLink, Icon, AgoPipe, DayPipe, HumanPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="fpage">
      <div>
        <div class="ftitle">{{ greeting() }}, {{ firstName() }}</div>
        <div class="fsub">{{ today }}</div>
      </div>

      <section class="fcard status" [class]="'fcard status s-' + store.status()">
        <div class="srow">
          <span class="sic"><vc-icon [name]="store.online() ? 'wifi' : 'wifi-off'" [size]="22" [stroke]="2.2" /></span>
          <div class="st">
            <strong>{{ store.online() ? 'Online' : 'Offline' }}</strong>
            <span>
              @if (store.syncing()) { Uploading your records\u2026 }
              @else if (store.queued()) { {{ store.queued() }} record(s) waiting to upload }
              @else { Everything on this phone is uploaded }
            </span>
          </div>
        </div>
        <div class="counts">
          <div><b class="num">{{ store.queued() }}</b><span>Waiting</span></div>
          <div [class.bad]="store.rejected()"><b class="num">{{ store.rejected() }}</b><span>Need attention</span></div>
          <div><b>{{ store.lastSync() ? (store.lastSync() | ago) : 'Never' }}</b><span>Last sync</span></div>
        </div>
        <div class="sact">
          <button class="fbtn primary block" [disabled]="!store.online() || store.syncing()" (click)="sync()">
            <vc-icon name="refresh" [size]="20" />{{ store.syncing() ? 'Syncing\u2026' : 'Sync now' }}
          </button>
          @if (store.rejected()) {
            <a class="fbtn danger block" routerLink="/field/outbox"><vc-icon name="alert" [size]="20" />Review {{ store.rejected() }} rejected</a>
          }
        </div>
      </section>

      <div class="fsec">My campaigns</div>

      @if (loading() && !list().length) {
        <div class="fcard fcard-pad skel"><span></span><span></span><span></span></div>
      } @else if (error() && !list().length) {
        <div class="fcard fempty">
          <div class="ic"><vc-icon name="wifi-off" [size]="26" /></div>
          <h3>Couldn't load your campaigns</h3>
          <p>{{ error() }}</p>
          <button class="fbtn secondary" (click)="load()">Try again</button>
        </div>
      } @else if (!list().length) {
        <div class="fcard fempty">
          <div class="ic"><vc-icon name="clipboard" [size]="26" /></div>
          <h3>No points assigned to you</h3>
          <p>When your supervisor assigns sampling points, the campaign appears here. You can still record practices.</p>
          <a class="fbtn secondary" routerLink="/field/practice"><vc-icon name="sprout" [size]="20" />Record a practice</a>
        </div>
      } @else {
        @if (error()) { <p class="stale"><vc-icon name="info" [size]="15" />Showing the list saved {{ data.assignmentsAt() | ago }}. {{ error() }}</p> }
        @for (c of list(); track c.id) {
          @let b = bundleOf(c.id);
          <article class="fcard camp">
            <button class="ctop" (click)="open(c)">
              <div class="cinfo">
                <div class="cl"><span class="code mono">{{ c.code }}</span><span class="chip" [class]="'chip ' + tone(c.status)">{{ c.status | human }}</span></div>
                <h3>{{ c.name }}</h3>
                <div class="cm">{{ c.kind | human }} \xB7 depth {{ c.depth_from_cm }}\u2013{{ c.depth_to_cm }} cm \xB7 until {{ c.planned_end | day }}</div>
              </div>
              <vc-icon name="chevron-right" [size]="24" />
            </button>
            <div class="cprog">
              <div class="pl"><span><b class="num">{{ done(c) }}</b> of {{ c.points.length }} points done</span><span>{{ c.remaining }} to go</span></div>
              <div class="bar"><i [style.width.%]="c.points.length ? 100 * done(c) / c.points.length : 0"></i></div>
            </div>
            <div class="cfoot">
              @if (c.status === 'complete') {
                <span class="dl"><vc-icon name="lock" [size]="18" />Finished \xB7 no more cores accepted</span>
              } @else if (b) {
                <span class="dl ok"><vc-icon name="check-circle" [size]="18" [stroke]="2.2" />Ready offline \xB7 saved {{ b.savedAt | ago }}</span>
                <button class="fbtn ghost sm" [disabled]="!store.online() || busy() === c.id" (click)="download(c)">{{ busy() === c.id ? 'Updating\u2026' : 'Update' }}</button>
              } @else {
                <span class="dl"><vc-icon name="download" [size]="18" />Not downloaded</span>
                <button class="fbtn secondary sm" [disabled]="!store.online() || busy() === c.id" (click)="download(c)">
                  <vc-icon name="download" [size]="18" />{{ busy() === c.id ? 'Downloading\u2026' : 'Download for offline' }}
                </button>
              }
            </div>
          </article>
        }
      }
    </div>
  `, styles: [`/* angular:styles/component:scss;8145719d236d938b;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\field-app\\field-home.ts */
:host {
  display: block;
}
.fpage {
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ftitle {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--stone-900);
  line-height: 1.2;
}
.fsub {
  font-size: 14.5px;
  color: var(--stone-700);
}
.fcard {
  background: #fff;
  border: 1.5px solid var(--sand-300);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(16, 41, 28, 0.06);
}
.fcard-pad {
  padding: 16px;
}
.fsec {
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--stone-600);
  margin: 4px 2px -6px;
}
.fbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 20px;
  border-radius: 12px;
  border: 2px solid transparent;
  font: 600 16px var(--font);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  text-decoration: none !important;
  -webkit-tap-highlight-color: transparent;
}
.fbtn:active {
  transform: translateY(1px);
}
.fbtn[disabled] {
  opacity: 0.45;
  cursor: not-allowed;
}
.fbtn.primary {
  background: var(--forest-700);
  color: #fff;
}
.fbtn.primary:hover:not([disabled]) {
  background: var(--forest-800);
}
.fbtn.secondary {
  background: #fff;
  color: var(--forest-800);
  border-color: var(--forest-700);
}
.fbtn.ghost {
  background: transparent;
  color: var(--stone-800);
  border-color: var(--sand-300);
}
.fbtn.danger {
  background: #fff;
  color: var(--red-600);
  border-color: var(--red-600);
}
.fbtn.block {
  width: 100%;
}
.fbtn.sm {
  min-height: 44px;
  padding: 0 14px;
  font-size: 15px;
  border-radius: 10px;
}
.finput {
  width: 100%;
  min-height: 52px;
  padding: 0 14px;
  border: 2px solid var(--stone-300);
  border-radius: 12px;
  background: #fff;
  font: 500 17px var(--font);
  color: var(--stone-900);
  outline: none;
}
textarea.finput {
  min-height: 96px;
  padding: 12px 14px;
  line-height: 1.45;
}
select.finput {
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231d2420' stroke-width='2.2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}
.finput:focus {
  border-color: var(--forest-600);
  box-shadow: 0 0 0 3px rgba(47, 114, 73, 0.25);
}
.finput.bad {
  border-color: var(--red-600);
}
.flabel {
  display: block;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--stone-800);
  margin-bottom: 6px;
}
.fhint {
  font-size: 13.5px;
  color: var(--stone-600);
  margin-top: 6px;
}
.ferr {
  font-size: 14px;
  color: var(--red-600);
  margin-top: 6px;
  font-weight: 500;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.chip.ok {
  background: var(--forest-100);
  color: var(--forest-800);
}
.chip.warn {
  background: var(--amber-100);
  color: #7a4d00;
}
.chip.bad {
  background: var(--red-100);
  color: var(--red-600);
}
.chip.info {
  background: var(--sky-100);
  color: var(--sky-600);
}
.chip.muted {
  background: var(--stone-100);
  color: var(--stone-700);
}
.fempty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 28px 16px;
  color: var(--stone-700);
}
.fempty .ic {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--sand-200);
  color: var(--stone-700);
  margin-bottom: 4px;
}
.fempty h3 {
  font-size: 17px;
}
.num {
  font-variant-numeric: tabular-nums;
}
.mono {
  font-family: var(--mono);
}
/*# sourceMappingURL=field-home.css.map */
`, "/* angular:styles/component:scss;2842c63f887ba8eb;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\field-app\\field-home.ts */\n.status {\n  padding: 16px;\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n.srow {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.sic {\n  display: grid;\n  place-items: center;\n  width: 46px;\n  height: 46px;\n  border-radius: 14px;\n  background: var(--forest-100);\n  color: var(--forest-800);\n}\n.s-offline .sic {\n  background: var(--stone-900);\n  color: #fff;\n}\n.s-pending .sic {\n  background: var(--amber-100);\n  color: #7a4d00;\n}\n.st {\n  display: flex;\n  flex-direction: column;\n}\n.st strong {\n  font-size: 18px;\n}\n.st span {\n  font-size: 14.5px;\n  color: var(--stone-700);\n}\n.counts {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1px;\n  background: var(--sand-300);\n  border-radius: 12px;\n  overflow: hidden;\n  border: 1.5px solid var(--sand-300);\n}\n.counts div {\n  background: var(--sand-50);\n  padding: 10px 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.counts b {\n  font-size: 18px;\n  color: var(--stone-900);\n}\n.counts span {\n  font-size: 12.5px;\n  color: var(--stone-600);\n  font-weight: 500;\n}\n.counts .bad b {\n  color: var(--red-600);\n}\n.sact {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.stale {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  font-size: 13.5px;\n  color: var(--stone-700);\n}\n.camp {\n  overflow: hidden;\n}\n.ctop {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  padding: 16px;\n  border: 0;\n  background: none;\n  text-align: left;\n  font: inherit;\n  cursor: pointer;\n  color: var(--stone-700);\n}\n.cinfo {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n.cl {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.code {\n  font-size: 13.5px;\n  font-weight: 600;\n  color: var(--stone-700);\n}\n.camp h3 {\n  font-size: 18px;\n  color: var(--stone-900);\n  line-height: 1.25;\n}\n.cm {\n  font-size: 14px;\n  color: var(--stone-600);\n}\n.cprog {\n  padding: 0 16px 14px;\n}\n.pl {\n  display: flex;\n  justify-content: space-between;\n  font-size: 14px;\n  color: var(--stone-700);\n  margin-bottom: 6px;\n}\n.pl b {\n  color: var(--stone-900);\n}\n.bar {\n  height: 10px;\n  border-radius: 5px;\n  background: var(--sand-200);\n  overflow: hidden;\n}\n.bar i {\n  display: block;\n  height: 100%;\n  background: var(--forest-600);\n  border-radius: 5px;\n}\n.cfoot {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 16px;\n  border-top: 1.5px solid var(--sand-200);\n  background: var(--sand-50);\n}\n.dl {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--stone-700);\n}\n.dl.ok {\n  color: var(--forest-700);\n}\n.skel {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.skel span {\n  height: 14px;\n  border-radius: 7px;\n  background: var(--sand-200);\n}\n.skel span:nth-child(2) {\n  width: 70%;\n}\n.skel span:nth-child(3) {\n  width: 40%;\n}\n/*# sourceMappingURL=field-home.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FieldHome, { className: "FieldHome", filePath: "src/app/features/field-app/field-home.ts", lineNumber: 137 });
})();

// src/app/features/field-app/field-outbox.ts
var _forTrack04 = ($index, $item) => $item.key;
var _forTrack13 = ($index, $item) => $item.id;
function FieldOutbox_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1, "You're offline. Records upload automatically when the phone has signal.");
    \u0275\u0275elementEnd();
  }
}
function FieldOutbox_For_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 11);
    \u0275\u0275listener("click", function FieldOutbox_For_13_Template_button_click_0_listener() {
      const f_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.filter.set(f_r2.key));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "b");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const f_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classProp("on", ctx_r2.filter() === f_r2.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", f_r2.label, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.count(f_r2.key));
  }
}
function FieldOutbox_For_15_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275element(1, "vc-icon", 23);
    \u0275\u0275text(2, "Server code ");
    \u0275\u0275elementStart(3, "b", 24);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const it_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(it_r4.code);
  }
}
function FieldOutbox_For_15_Conditional_13_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275element(1, "vc-icon", 26);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r5 = ctx.$implicit;
    \u0275\u0275classProp("block", f_r5.severity === "blocking");
    \u0275\u0275advance();
    \u0275\u0275property("size", 15);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(f_r5.message);
  }
}
function FieldOutbox_For_15_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 19);
    \u0275\u0275repeaterCreate(1, FieldOutbox_For_15_Conditional_13_For_2_Template, 3, 4, "li", 25, \u0275\u0275repeaterTrackByIndex);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const it_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(it_r4.findings);
  }
}
function FieldOutbox_For_15_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "vc-icon", 27);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const it_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Last try failed: ", it_r4.error, " It will be tried again.");
  }
}
function FieldOutbox_For_15_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "strong");
    \u0275\u0275text(2, "The server refused this record");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 29)(6, "button", 30);
    \u0275\u0275listener("click", function FieldOutbox_For_15_Conditional_15_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r6);
      const it_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.retry(it_r4));
    });
    \u0275\u0275element(7, "vc-icon", 5);
    \u0275\u0275text(8, "Retry");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "button", 31);
    \u0275\u0275listener("click", function FieldOutbox_For_15_Conditional_15_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r6);
      const it_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.askDiscard(it_r4));
    });
    \u0275\u0275element(10, "vc-icon", 32);
    \u0275\u0275text(11, "Discard");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const it_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(it_r4.error || "No reason given.");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r2.store.online());
    \u0275\u0275advance();
    \u0275\u0275property("size", 18);
    \u0275\u0275advance(3);
    \u0275\u0275property("size", 18);
  }
}
function FieldOutbox_For_15_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 21)(1, "button", 33);
    \u0275\u0275listener("click", function FieldOutbox_For_15_Conditional_16_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r7);
      const it_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.askDiscard(it_r4));
    });
    \u0275\u0275text(2, "Delete from phone");
    \u0275\u0275elementEnd()();
  }
}
function FieldOutbox_For_15_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "p");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 29)(4, "button", 34);
    \u0275\u0275listener("click", function FieldOutbox_For_15_Conditional_17_Template_button_click_4_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.confirmId.set(null));
    });
    \u0275\u0275text(5, "Keep");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "button", 31);
    \u0275\u0275listener("click", function FieldOutbox_For_15_Conditional_17_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r8);
      const it_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.discard(it_r4));
    });
    \u0275\u0275text(7, "Delete");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const it_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate3("Delete this ", it_r4.kind, " and its ", it_r4.photos, " photo(s) from the phone? ", it_r4.state === "queued" ? "It has not been uploaded \u2014 the fieldwork will be lost." : "This cannot be undone.");
  }
}
function FieldOutbox_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article", 12)(1, "div", 13)(2, "span", 14);
    \u0275\u0275element(3, "vc-icon", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 16)(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275pipe(9, "ago");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "span", 17);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(12, FieldOutbox_For_15_Conditional_12_Template, 5, 2, "div", 18);
    \u0275\u0275conditionalCreate(13, FieldOutbox_For_15_Conditional_13_Template, 3, 0, "ul", 19);
    \u0275\u0275conditionalCreate(14, FieldOutbox_For_15_Conditional_14_Template, 3, 2, "div", 20);
    \u0275\u0275conditionalCreate(15, FieldOutbox_For_15_Conditional_15_Template, 12, 4);
    \u0275\u0275conditionalCreate(16, FieldOutbox_For_15_Conditional_16_Template, 3, 0, "div", 21);
    \u0275\u0275conditionalCreate(17, FieldOutbox_For_15_Conditional_17_Template, 8, 3, "div", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const it_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classMap("fcard item s-" + it_r4.state);
    \u0275\u0275advance(3);
    \u0275\u0275property("name", it_r4.kind === "sample" ? "shovel" : "sprout")("size", 20);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(it_r4.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", it_r4.sub, " \xB7 ", \u0275\u0275pipeBind1(9, 16, it_r4.createdAt));
    \u0275\u0275advance(2);
    \u0275\u0275classMap("chip " + ctx_r2.tone[it_r4.state]);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.label[it_r4.state]);
    \u0275\u0275advance();
    \u0275\u0275conditional(it_r4.state === "synced" && it_r4.code ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(it_r4.findings.length ? 13 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(it_r4.state === "queued" && it_r4.error ? 14 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(it_r4.state === "rejected" ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(it_r4.state === "queued" ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r2.confirmId() === it_r4.id ? 17 : -1);
  }
}
function FieldOutbox_ForEmpty_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 35);
    \u0275\u0275element(2, "vc-icon", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6, "Samples and practices you save appear here until they are uploaded.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "a", 37);
    \u0275\u0275text(8, "Go to Home");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 26);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.filter() === "rejected" ? "Nothing rejected" : ctx_r2.filter() === "waiting" ? "Nothing waiting" : "Nothing recorded yet");
  }
}
var STATE_LABEL = { queued: "Waiting to upload", syncing: "Uploading\u2026", synced: "Uploaded", rejected: "Rejected" };
var STATE_TONE = { queued: "warn", syncing: "info", synced: "ok", rejected: "bad" };
var FieldOutbox = class _FieldOutbox {
  toast = inject(ToastService);
  store = inject(OfflineStore);
  label = STATE_LABEL;
  tone = STATE_TONE;
  filters = [
    { key: "all", label: "All" },
    { key: "waiting", label: "Waiting" },
    { key: "rejected", label: "Rejected" },
    { key: "synced", label: "Done" }
  ];
  samples = signal(
    [],
    ...ngDevMode ? [{ debugName: "samples" }] : (
      /* istanbul ignore next */
      []
    )
  );
  practices = signal(
    [],
    ...ngDevMode ? [{ debugName: "practices" }] : (
      /* istanbul ignore next */
      []
    )
  );
  filter = signal(
    "all",
    ...ngDevMode ? [{ debugName: "filter" }] : (
      /* istanbul ignore next */
      []
    )
  );
  confirmId = signal(
    null,
    ...ngDevMode ? [{ debugName: "confirmId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  items = computed(
    () => [
      ...this.samples().map((s) => ({
        kind: "sample",
        id: s.localId,
        title: `Core at ${s.siteCode}`,
        sub: `${s.payload.layers.length} bag(s) \xB7 ${s.photos.length} photo(s)`,
        createdAt: s.createdAt,
        state: s.state,
        error: s.error,
        attempts: s.attempts,
        code: s.serverCode,
        photos: s.photos.length,
        findings: s.findings ?? []
      })),
      ...this.practices().map((p) => ({
        kind: "practice",
        id: p.localId,
        title: p.label,
        sub: `Practice \xB7 ${p.photos.length} photo(s)`,
        createdAt: p.createdAt,
        state: p.state,
        error: p.error,
        attempts: p.attempts,
        photos: p.photos.length,
        findings: []
      }))
    ].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    ...ngDevMode ? [{ debugName: "items" }] : (
      /* istanbul ignore next */
      []
    )
  );
  shown = computed(
    () => this.items().filter((i) => this.match(i, this.filter())),
    ...ngDevMode ? [{ debugName: "shown" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    effect(() => {
      this.store.changed();
      void this.reload();
    });
  }
  match(i, f) {
    return f === "all" || f === "waiting" && (i.state === "queued" || i.state === "syncing") || i.state === f;
  }
  count(f) {
    return this.items().filter((i) => this.match(i, f)).length;
  }
  async reload() {
    const [s, p] = await Promise.all([this.store.allSamples(), this.store.allPractices()]);
    this.samples.set(s);
    this.practices.set(p);
  }
  async retry(it) {
    await this.store.requeue(it.id, it.kind);
    this.toast.info("Trying again", "If the server refuses it again, the reason is shown here.");
  }
  askDiscard(it) {
    this.confirmId.set(it.id);
  }
  async discard(it) {
    if (it.kind === "sample")
      await this.store.discardSample(it.id);
    else
      await this.store.discardPractice(it.id);
    this.confirmId.set(null);
    this.toast.success("Deleted from this phone");
  }
  static \u0275fac = function FieldOutbox_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FieldOutbox)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FieldOutbox, selectors: [["vc-field-outbox"]], decls: 17, vars: 5, consts: [[1, "fpage"], [1, "top"], [1, "ftitle"], [1, "fsub"], [1, "fbtn", "primary", "block", 3, "click", "disabled"], ["name", "refresh", 3, "size"], [1, "fhint"], [1, "seg"], [3, "on"], [1, "fcard", "item", 3, "class"], [1, "fcard", "fempty"], [3, "click"], [1, "fcard", "item"], [1, "ih"], [1, "kic"], [3, "name", "size"], [1, "it"], [1, "chip"], [1, "ok-line"], [1, "finds"], [1, "retry-line"], [1, "acts", "end"], [1, "confirm"], ["name", "check-circle", 3, "size"], [1, "mono"], [3, "block"], ["name", "alert", 3, "size"], ["name", "clock", 3, "size"], [1, "rej"], [1, "acts"], [1, "fbtn", "secondary", "sm", 3, "click", "disabled"], [1, "fbtn", "danger", "sm", 3, "click"], ["name", "trash", 3, "size"], [1, "linkbtn", 3, "click"], [1, "fbtn", "ghost", "sm", 3, "click"], [1, "ic"], ["name", "inbox", 3, "size"], ["routerLink", "/field", 1, "fbtn", "secondary"]], template: function FieldOutbox_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div")(3, "div", 2);
      \u0275\u0275text(4, "Outbox");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 3);
      \u0275\u0275text(6, "Everything recorded on this phone and whether it has reached the server.");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(7, "button", 4);
      \u0275\u0275listener("click", function FieldOutbox_Template_button_click_7_listener() {
        return ctx.store.sync();
      });
      \u0275\u0275element(8, "vc-icon", 5);
      \u0275\u0275text(9);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(10, FieldOutbox_Conditional_10_Template, 2, 0, "p", 6);
      \u0275\u0275elementStart(11, "div", 7);
      \u0275\u0275repeaterCreate(12, FieldOutbox_For_13_Template, 4, 4, "button", 8, _forTrack04);
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(14, FieldOutbox_For_15_Template, 18, 18, "article", 9, _forTrack13, false, FieldOutbox_ForEmpty_16_Template, 9, 2, "div", 10);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275property("disabled", !ctx.store.online() || ctx.store.syncing() || !ctx.store.queued());
      \u0275\u0275advance();
      \u0275\u0275property("size", 20);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1("", ctx.store.syncing() ? "Uploading\u2026" : ctx.store.queued() ? "Upload " + ctx.store.queued() + " now" : "Nothing waiting", " ");
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.store.online() && ctx.store.queued() ? 10 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.filters);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.shown());
    }
  }, dependencies: [RouterLink, Icon, AgoPipe], styles: [`
[_nghost-%COMP%] {
  display: block;
}
.fpage[_ngcontent-%COMP%] {
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ftitle[_ngcontent-%COMP%] {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--%NS%stone-900);
  line-height: 1.2;
}
.fsub[_ngcontent-%COMP%] {
  font-size: 14.5px;
  color: var(--%NS%stone-700);
}
.fcard[_ngcontent-%COMP%] {
  background: #fff;
  border: 1.5px solid var(--%NS%sand-300);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(16, 41, 28, 0.06);
}
.fcard-pad[_ngcontent-%COMP%] {
  padding: 16px;
}
.fsec[_ngcontent-%COMP%] {
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--%NS%stone-600);
  margin: 4px 2px -6px;
}
.fbtn[_ngcontent-%COMP%] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 20px;
  border-radius: 12px;
  border: 2px solid transparent;
  font: 600 16px var(--%NS%font);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  text-decoration: none !important;
  -webkit-tap-highlight-color: transparent;
}
.fbtn[_ngcontent-%COMP%]:active {
  transform: translateY(1px);
}
.fbtn[disabled][_ngcontent-%COMP%] {
  opacity: 0.45;
  cursor: not-allowed;
}
.fbtn.primary[_ngcontent-%COMP%] {
  background: var(--%NS%forest-700);
  color: #fff;
}
.fbtn.primary[_ngcontent-%COMP%]:hover:not([disabled]) {
  background: var(--%NS%forest-800);
}
.fbtn.secondary[_ngcontent-%COMP%] {
  background: #fff;
  color: var(--%NS%forest-800);
  border-color: var(--%NS%forest-700);
}
.fbtn.ghost[_ngcontent-%COMP%] {
  background: transparent;
  color: var(--%NS%stone-800);
  border-color: var(--%NS%sand-300);
}
.fbtn.danger[_ngcontent-%COMP%] {
  background: #fff;
  color: var(--%NS%red-600);
  border-color: var(--%NS%red-600);
}
.fbtn.block[_ngcontent-%COMP%] {
  width: 100%;
}
.fbtn.sm[_ngcontent-%COMP%] {
  min-height: 44px;
  padding: 0 14px;
  font-size: 15px;
  border-radius: 10px;
}
.finput[_ngcontent-%COMP%] {
  width: 100%;
  min-height: 52px;
  padding: 0 14px;
  border: 2px solid var(--%NS%stone-300);
  border-radius: 12px;
  background: #fff;
  font: 500 17px var(--%NS%font);
  color: var(--%NS%stone-900);
  outline: none;
}
textarea.finput[_ngcontent-%COMP%] {
  min-height: 96px;
  padding: 12px 14px;
  line-height: 1.45;
}
select.finput[_ngcontent-%COMP%] {
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231d2420' stroke-width='2.2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}
.finput[_ngcontent-%COMP%]:focus {
  border-color: var(--%NS%forest-600);
  box-shadow: 0 0 0 3px rgba(47, 114, 73, 0.25);
}
.finput.bad[_ngcontent-%COMP%] {
  border-color: var(--%NS%red-600);
}
.flabel[_ngcontent-%COMP%] {
  display: block;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--%NS%stone-800);
  margin-bottom: 6px;
}
.fhint[_ngcontent-%COMP%] {
  font-size: 13.5px;
  color: var(--%NS%stone-600);
  margin-top: 6px;
}
.ferr[_ngcontent-%COMP%] {
  font-size: 14px;
  color: var(--%NS%red-600);
  margin-top: 6px;
  font-weight: 500;
}
.chip[_ngcontent-%COMP%] {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.chip.ok[_ngcontent-%COMP%] {
  background: var(--%NS%forest-100);
  color: var(--%NS%forest-800);
}
.chip.warn[_ngcontent-%COMP%] {
  background: var(--%NS%amber-100);
  color: #7a4d00;
}
.chip.bad[_ngcontent-%COMP%] {
  background: var(--%NS%red-100);
  color: var(--%NS%red-600);
}
.chip.info[_ngcontent-%COMP%] {
  background: var(--%NS%sky-100);
  color: var(--%NS%sky-600);
}
.chip.muted[_ngcontent-%COMP%] {
  background: var(--%NS%stone-100);
  color: var(--%NS%stone-700);
}
.fempty[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 28px 16px;
  color: var(--%NS%stone-700);
}
.fempty[_ngcontent-%COMP%]   .ic[_ngcontent-%COMP%] {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--%NS%sand-200);
  color: var(--%NS%stone-700);
  margin-bottom: 4px;
}
.fempty[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
  font-size: 17px;
}
.num[_ngcontent-%COMP%] {
  font-variant-numeric: tabular-nums;
}
.mono[_ngcontent-%COMP%] {
  font-family: var(--%NS%mono);
}
/*# sourceMappingURL=field-outbox.css.map */`, "\n.seg[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  background: #fff;\n  border: 1.5px solid var(--%NS%sand-300);\n  border-radius: 12px;\n  padding: 4px;\n  gap: 4px;\n}\n.seg[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  min-height: 42px;\n  padding: 0 4px;\n  border: 0;\n  border-radius: 9px;\n  background: none;\n  font: 600 14px var(--%NS%font);\n  color: var(--%NS%stone-700);\n  cursor: pointer;\n}\n.seg[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  background: var(--%NS%forest-700);\n  color: #fff;\n}\n.seg[_ngcontent-%COMP%]   b[_ngcontent-%COMP%] {\n  opacity: 0.8;\n  margin-left: 2px;\n}\n.item[_ngcontent-%COMP%] {\n  padding: 14px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.item.s-rejected[_ngcontent-%COMP%] {\n  border-color: #eba59f;\n}\n.ih[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.kic[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 42px;\n  height: 42px;\n  border-radius: 12px;\n  background: var(--%NS%sand-200);\n  color: var(--%NS%stone-800);\n  flex: none;\n}\n.it[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n}\n.it[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n.it[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 13.5px;\n  color: var(--%NS%stone-600);\n}\n.ok-line[_ngcontent-%COMP%], \n.retry-line[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  font-size: 14px;\n  color: var(--%NS%forest-700);\n}\n.retry-line[_ngcontent-%COMP%] {\n  color: #7a4d00;\n  align-items: flex-start;\n}\n.finds[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.finds[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 6px;\n  align-items: flex-start;\n  font-size: 13.5px;\n  color: #7a4d00;\n}\n.finds[_ngcontent-%COMP%]   li.block[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n}\n.rej[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  padding: 10px 12px;\n  border-radius: 10px;\n  background: var(--%NS%red-100);\n  color: #7c1a13;\n  font-size: 14px;\n}\n.acts[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 10px;\n}\n.acts[_ngcontent-%COMP%]   .fbtn[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.acts.end[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n}\n.linkbtn[_ngcontent-%COMP%] {\n  border: 0;\n  background: none;\n  color: var(--%NS%stone-600);\n  font: 500 14px var(--%NS%font);\n  text-decoration: underline;\n  cursor: pointer;\n  padding: 6px;\n}\n.confirm[_ngcontent-%COMP%] {\n  padding: 12px;\n  border-radius: 12px;\n  background: var(--%NS%sand-100);\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  font-size: 14.5px;\n}\n/*# sourceMappingURL=field-outbox.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldOutbox, [{
    type: Component,
    args: [{ selector: "vc-field-outbox", imports: [RouterLink, Icon, AgoPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="fpage">
      <div class="top">
        <div>
          <div class="ftitle">Outbox</div>
          <div class="fsub">Everything recorded on this phone and whether it has reached the server.</div>
        </div>
      </div>
      <button class="fbtn primary block" [disabled]="!store.online() || store.syncing() || !store.queued()" (click)="store.sync()">
        <vc-icon name="refresh" [size]="20" />{{ store.syncing() ? 'Uploading\u2026' : store.queued() ? 'Upload ' + store.queued() + ' now' : 'Nothing waiting' }}
      </button>
      @if (!store.online() && store.queued()) { <p class="fhint">You're offline. Records upload automatically when the phone has signal.</p> }

      <div class="seg">
        @for (f of filters; track f.key) {
          <button [class.on]="filter() === f.key" (click)="filter.set(f.key)">{{ f.label }} <b>{{ count(f.key) }}</b></button>
        }
      </div>

      @for (it of shown(); track it.id) {
        <article class="fcard item" [class]="'fcard item s-' + it.state">
          <div class="ih">
            <span class="kic"><vc-icon [name]="it.kind === 'sample' ? 'shovel' : 'sprout'" [size]="20" /></span>
            <div class="it">
              <strong>{{ it.title }}</strong>
              <span>{{ it.sub }} \xB7 {{ it.createdAt | ago }}</span>
            </div>
            <span class="chip" [class]="'chip ' + tone[it.state]">{{ label[it.state] }}</span>
          </div>
          @if (it.state === 'synced' && it.code) { <div class="ok-line"><vc-icon name="check-circle" [size]="16" />Server code <b class="mono">{{ it.code }}</b></div> }
          @if (it.findings.length) {
            <ul class="finds">
              @for (f of it.findings; track $index) { <li [class.block]="f.severity === 'blocking'"><vc-icon name="alert" [size]="15" />{{ f.message }}</li> }
            </ul>
          }
          @if (it.state === 'queued' && it.error) { <div class="retry-line"><vc-icon name="clock" [size]="16" />Last try failed: {{ it.error }} It will be tried again.</div> }
          @if (it.state === 'rejected') {
            <div class="rej"><strong>The server refused this record</strong><span>{{ it.error || 'No reason given.' }}</span></div>
            <div class="acts">
              <button class="fbtn secondary sm" [disabled]="!store.online()" (click)="retry(it)"><vc-icon name="refresh" [size]="18" />Retry</button>
              <button class="fbtn danger sm" (click)="askDiscard(it)"><vc-icon name="trash" [size]="18" />Discard</button>
            </div>
          }
          @if (it.state === 'queued') {
            <div class="acts end"><button class="linkbtn" (click)="askDiscard(it)">Delete from phone</button></div>
          }
          @if (confirmId() === it.id) {
            <div class="confirm">
              <p>Delete this {{ it.kind }} and its {{ it.photos }} photo(s) from the phone? {{ it.state === 'queued' ? 'It has not been uploaded \u2014 the fieldwork will be lost.' : 'This cannot be undone.' }}</p>
              <div class="acts">
                <button class="fbtn ghost sm" (click)="confirmId.set(null)">Keep</button>
                <button class="fbtn danger sm" (click)="discard(it)">Delete</button>
              </div>
            </div>
          }
        </article>
      } @empty {
        <div class="fcard fempty">
          <div class="ic"><vc-icon name="inbox" [size]="26" /></div>
          <h3>{{ filter() === 'rejected' ? 'Nothing rejected' : filter() === 'waiting' ? 'Nothing waiting' : 'Nothing recorded yet' }}</h3>
          <p>Samples and practices you save appear here until they are uploaded.</p>
          <a class="fbtn secondary" routerLink="/field">Go to Home</a>
        </div>
      }
    </div>
  `, styles: [`/* angular:styles/component:scss;8145719d236d938b;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\field-app\\field-outbox.ts */
:host {
  display: block;
}
.fpage {
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ftitle {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--stone-900);
  line-height: 1.2;
}
.fsub {
  font-size: 14.5px;
  color: var(--stone-700);
}
.fcard {
  background: #fff;
  border: 1.5px solid var(--sand-300);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(16, 41, 28, 0.06);
}
.fcard-pad {
  padding: 16px;
}
.fsec {
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--stone-600);
  margin: 4px 2px -6px;
}
.fbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 20px;
  border-radius: 12px;
  border: 2px solid transparent;
  font: 600 16px var(--font);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  text-decoration: none !important;
  -webkit-tap-highlight-color: transparent;
}
.fbtn:active {
  transform: translateY(1px);
}
.fbtn[disabled] {
  opacity: 0.45;
  cursor: not-allowed;
}
.fbtn.primary {
  background: var(--forest-700);
  color: #fff;
}
.fbtn.primary:hover:not([disabled]) {
  background: var(--forest-800);
}
.fbtn.secondary {
  background: #fff;
  color: var(--forest-800);
  border-color: var(--forest-700);
}
.fbtn.ghost {
  background: transparent;
  color: var(--stone-800);
  border-color: var(--sand-300);
}
.fbtn.danger {
  background: #fff;
  color: var(--red-600);
  border-color: var(--red-600);
}
.fbtn.block {
  width: 100%;
}
.fbtn.sm {
  min-height: 44px;
  padding: 0 14px;
  font-size: 15px;
  border-radius: 10px;
}
.finput {
  width: 100%;
  min-height: 52px;
  padding: 0 14px;
  border: 2px solid var(--stone-300);
  border-radius: 12px;
  background: #fff;
  font: 500 17px var(--font);
  color: var(--stone-900);
  outline: none;
}
textarea.finput {
  min-height: 96px;
  padding: 12px 14px;
  line-height: 1.45;
}
select.finput {
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231d2420' stroke-width='2.2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}
.finput:focus {
  border-color: var(--forest-600);
  box-shadow: 0 0 0 3px rgba(47, 114, 73, 0.25);
}
.finput.bad {
  border-color: var(--red-600);
}
.flabel {
  display: block;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--stone-800);
  margin-bottom: 6px;
}
.fhint {
  font-size: 13.5px;
  color: var(--stone-600);
  margin-top: 6px;
}
.ferr {
  font-size: 14px;
  color: var(--red-600);
  margin-top: 6px;
  font-weight: 500;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.chip.ok {
  background: var(--forest-100);
  color: var(--forest-800);
}
.chip.warn {
  background: var(--amber-100);
  color: #7a4d00;
}
.chip.bad {
  background: var(--red-100);
  color: var(--red-600);
}
.chip.info {
  background: var(--sky-100);
  color: var(--sky-600);
}
.chip.muted {
  background: var(--stone-100);
  color: var(--stone-700);
}
.fempty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 28px 16px;
  color: var(--stone-700);
}
.fempty .ic {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--sand-200);
  color: var(--stone-700);
  margin-bottom: 4px;
}
.fempty h3 {
  font-size: 17px;
}
.num {
  font-variant-numeric: tabular-nums;
}
.mono {
  font-family: var(--mono);
}
/*# sourceMappingURL=field-outbox.css.map */
`, "/* angular:styles/component:scss;6942181be7b3d7bc;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\field-app\\field-outbox.ts */\n.seg {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  background: #fff;\n  border: 1.5px solid var(--sand-300);\n  border-radius: 12px;\n  padding: 4px;\n  gap: 4px;\n}\n.seg button {\n  min-height: 42px;\n  padding: 0 4px;\n  border: 0;\n  border-radius: 9px;\n  background: none;\n  font: 600 14px var(--font);\n  color: var(--stone-700);\n  cursor: pointer;\n}\n.seg button.on {\n  background: var(--forest-700);\n  color: #fff;\n}\n.seg b {\n  opacity: 0.8;\n  margin-left: 2px;\n}\n.item {\n  padding: 14px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.item.s-rejected {\n  border-color: #eba59f;\n}\n.ih {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n}\n.kic {\n  display: grid;\n  place-items: center;\n  width: 42px;\n  height: 42px;\n  border-radius: 12px;\n  background: var(--sand-200);\n  color: var(--stone-800);\n  flex: none;\n}\n.it {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n}\n.it strong {\n  font-size: 16px;\n}\n.it span {\n  font-size: 13.5px;\n  color: var(--stone-600);\n}\n.ok-line,\n.retry-line {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n  font-size: 14px;\n  color: var(--forest-700);\n}\n.retry-line {\n  color: #7a4d00;\n  align-items: flex-start;\n}\n.finds {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.finds li {\n  display: flex;\n  gap: 6px;\n  align-items: flex-start;\n  font-size: 13.5px;\n  color: #7a4d00;\n}\n.finds li.block {\n  color: var(--red-600);\n}\n.rej {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  padding: 10px 12px;\n  border-radius: 10px;\n  background: var(--red-100);\n  color: #7c1a13;\n  font-size: 14px;\n}\n.acts {\n  display: flex;\n  gap: 10px;\n}\n.acts .fbtn {\n  flex: 1;\n}\n.acts.end {\n  justify-content: flex-end;\n}\n.linkbtn {\n  border: 0;\n  background: none;\n  color: var(--stone-600);\n  font: 500 14px var(--font);\n  text-decoration: underline;\n  cursor: pointer;\n  padding: 6px;\n}\n.confirm {\n  padding: 12px;\n  border-radius: 12px;\n  background: var(--sand-100);\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  font-size: 14.5px;\n}\n/*# sourceMappingURL=field-outbox.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FieldOutbox, { className: "FieldOutbox", filePath: "src/app/features/field-app/field-outbox.ts", lineNumber: 120 });
})();

// src/app/features/field-app/field-practice.ts
var _forTrack05 = ($index, $item) => $item.id;
var _forTrack14 = ($index, $item) => $item.code;
var _forTrack2 = ($index, $item) => $item.key;
function FieldPractice_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const f_r1 = ctx.$implicit;
    \u0275\u0275property("value", f_r1.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", f_r1.code, "", f_r1.name ? " \xB7 " + f_r1.name : "");
  }
}
function FieldPractice_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1, "No fields on this phone yet. Download a campaign from Home, or connect once to load your fields.");
    \u0275\u0275elementEnd();
  }
}
function FieldPractice_For_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const t_r2 = ctx.$implicit;
    \u0275\u0275property("value", t_r2.code);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(t_r2.name);
  }
}
function FieldPractice_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r2.typesNote());
  }
}
function FieldPractice_Conditional_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1, "Required \u2014 this is never assumed.");
    \u0275\u0275elementEnd();
  }
}
function FieldPractice_Conditional_44_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 17);
    \u0275\u0275text(1, "(optional)");
    \u0275\u0275elementEnd();
  }
}
function FieldPractice_Conditional_44_For_9_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 17);
    \u0275\u0275text(1, "(optional)");
    \u0275\u0275elementEnd();
  }
}
function FieldPractice_Conditional_44_For_9_Conditional_4_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r7 = ctx.$implicit;
    \u0275\u0275property("value", c_r7);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r7);
  }
}
function FieldPractice_Conditional_44_For_9_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "select", 31);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FieldPractice_Conditional_44_For_9_Conditional_4_Template_select_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const a_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.setExtra(a_r6.key, $event));
    });
    \u0275\u0275elementStart(1, "option", 6);
    \u0275\u0275text(2, "Choose\u2026");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, FieldPractice_Conditional_44_For_9_Conditional_4_For_4_Template, 2, 2, "option", 7, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", "x-" + a_r6.key)("ngModel", ctx_r2.extra()[a_r6.key] ?? "");
    \u0275\u0275control();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(a_r6.choices);
  }
}
function FieldPractice_Conditional_44_For_9_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "input", 32);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FieldPractice_Conditional_44_For_9_Conditional_5_Template_input_ngModelChange_0_listener($event) {
      \u0275\u0275restoreView(_r8);
      const a_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.setExtra(a_r6.key, $event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", "x-" + a_r6.key)("type", a_r6.type === "number" ? "number" : "text")("ngModel", ctx_r2.extra()[a_r6.key] ?? "");
    \u0275\u0275control();
  }
}
function FieldPractice_Conditional_44_For_9_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("In ", a_r6.unit);
  }
}
function FieldPractice_Conditional_44_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "label", 28);
    \u0275\u0275text(2);
    \u0275\u0275conditionalCreate(3, FieldPractice_Conditional_44_For_9_Conditional_3_Template, 2, 0, "span", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, FieldPractice_Conditional_44_For_9_Conditional_4_Template, 5, 2, "select", 29)(5, FieldPractice_Conditional_44_For_9_Conditional_5_Template, 1, 3, "input", 30);
    \u0275\u0275conditionalCreate(6, FieldPractice_Conditional_44_For_9_Conditional_6_Template, 2, 1, "div", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const a_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("for", "x-" + a_r6.key);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", a_r6.label, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(!a_r6.required ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(a_r6.type === "choice" ? 4 : 5);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(a_r6.unit ? 6 : -1);
  }
}
function FieldPractice_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div")(1, "label", 24);
    \u0275\u0275text(2, "Quantity ");
    \u0275\u0275conditionalCreate(3, FieldPractice_Conditional_44_Conditional_3_Template, 2, 0, "span", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 25)(5, "input", 26);
    \u0275\u0275controlCreate();
    \u0275\u0275listener("ngModelChange", function FieldPractice_Conditional_44_Template_input_ngModelChange_5_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.qty.set($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 27);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
    \u0275\u0275repeaterCreate(8, FieldPractice_Conditional_44_For_9_Template, 7, 5, "div", null, _forTrack2);
  }
  if (rf & 2) {
    const t_r9 = ctx;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275conditional(!t_r9.requires_quantity ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngModel", ctx_r2.qty());
    \u0275\u0275control();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(t_r9.unit || "units");
    \u0275\u0275advance();
    \u0275\u0275repeater(t_r9.fields);
  }
}
function FieldPractice_Conditional_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 17);
    \u0275\u0275text(1, "(optional)");
    \u0275\u0275elementEnd();
  }
}
function FieldPractice_Conditional_51_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 20);
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275property("src", ctx_r2.thumb(), \u0275\u0275sanitizeUrl);
  }
}
function FieldPractice_Conditional_52_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 21);
    \u0275\u0275element(1, "vc-icon", 33);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 30);
  }
}
function FieldPractice_Conditional_58_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 8);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Still needed: ", ctx_r2.missing().join(", "), ".");
  }
}
var FieldPractice = class _FieldPractice {
  router = inject(Router);
  toast = inject(ToastService);
  store = inject(OfflineStore);
  data = inject(FieldData);
  gps = inject(FieldGps);
  today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  types = signal(
    this.data.practiceTypes(),
    ...ngDevMode ? [{ debugName: "types" }] : (
      /* istanbul ignore next */
      []
    )
  );
  typesNote = signal(
    null,
    ...ngDevMode ? [{ debugName: "typesNote" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fields = signal(
    this.data.fields(),
    ...ngDevMode ? [{ debugName: "fields" }] : (
      /* istanbul ignore next */
      []
    )
  );
  fieldId = signal(
    "",
    ...ngDevMode ? [{ debugName: "fieldId" }] : (
      /* istanbul ignore next */
      []
    )
  );
  typeCode = signal(
    "",
    ...ngDevMode ? [{ debugName: "typeCode" }] : (
      /* istanbul ignore next */
      []
    )
  );
  scenario = signal(
    "",
    ...ngDevMode ? [{ debugName: "scenario" }] : (
      /* istanbul ignore next */
      []
    )
  );
  date = signal(
    this.today,
    ...ngDevMode ? [{ debugName: "date" }] : (
      /* istanbul ignore next */
      []
    )
  );
  qty = signal(
    null,
    ...ngDevMode ? [{ debugName: "qty" }] : (
      /* istanbul ignore next */
      []
    )
  );
  extra = signal(
    {},
    ...ngDevMode ? [{ debugName: "extra" }] : (
      /* istanbul ignore next */
      []
    )
  );
  photo = signal(
    null,
    ...ngDevMode ? [{ debugName: "photo" }] : (
      /* istanbul ignore next */
      []
    )
  );
  thumb = signal(
    null,
    ...ngDevMode ? [{ debugName: "thumb" }] : (
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
  type = computed(
    () => this.types().find((t) => t.code === this.typeCode()) ?? null,
    ...ngDevMode ? [{ debugName: "type" }] : (
      /* istanbul ignore next */
      []
    )
  );
  photoRequired = computed(
    () => (this.type()?.required_evidence ?? []).some((e) => /photo/i.test(e)),
    ...ngDevMode ? [{ debugName: "photoRequired" }] : (
      /* istanbul ignore next */
      []
    )
  );
  missing = computed(
    () => {
      const m = [];
      if (!this.fieldId())
        m.push("field");
      if (!this.typeCode())
        m.push("practice");
      if (!this.scenario())
        m.push("usual or new");
      if (!this.date())
        m.push("date");
      const t = this.type();
      if (t?.requires_quantity && (this.qty() === null || `${this.qty()}` === ""))
        m.push("quantity");
      for (const a of t?.fields ?? [])
        if (a.required && !`${this.extra()[a.key] ?? ""}`.trim())
          m.push(a.label.toLowerCase());
      if (this.photoRequired() && !this.photo())
        m.push("photo");
      return m;
    },
    ...ngDevMode ? [{ debugName: "missing" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    this.gps.start();
    void this.data.refreshBundles().then(() => this.fields.set(this.data.fields()));
    if (navigator.onLine) {
      this.data.loadPracticeTypes().then((t) => this.types.set(t)).catch(() => this.typesNote.set("Showing the practice list saved on this phone."));
      this.data.loadFields().then(() => this.fields.set(this.data.fields())).catch(() => {
      });
    } else if (this.types().length) {
      this.typesNote.set("Offline \u2014 showing the practice list saved on this phone.");
    } else {
      this.typesNote.set("Connect once to load the list of practices.");
    }
  }
  setType(code) {
    this.typeCode.set(code);
    this.extra.set({});
    this.qty.set(null);
  }
  setExtra(k, v) {
    this.extra.update((e) => __spreadProps(__spreadValues({}, e), { [k]: v }));
  }
  async takePhoto(ev) {
    const inp = ev.target;
    const file = inp.files?.[0];
    inp.value = "";
    if (!file)
      return;
    const f = this.gps.fix();
    const at = /* @__PURE__ */ new Date();
    try {
      const blob = await stampPhoto(file, { title: this.type()?.name ?? "Practice", at, lat: f?.lat ?? null, lon: f?.lon ?? null, acc: f?.accuracy });
      if (this.thumb())
        URL.revokeObjectURL(this.thumb());
      this.thumb.set(URL.createObjectURL(blob));
      this.photo.set({ kind: "extra", blob, name: `practice-${at.getTime()}.jpg`, type: "image/jpeg", takenAt: at.toISOString(), lat: f?.lat ?? null, lon: f?.lon ?? null });
    } catch (e) {
      this.toast.error("Couldn't use that photo", e.message);
    }
  }
  async save() {
    const t = this.type();
    const field = this.fields().find((f) => f.id === this.fieldId());
    if (!t || !field)
      return;
    this.busy.set(true);
    const extra = {};
    for (const a of t.fields) {
      const v = this.extra()[a.key];
      if (v !== void 0 && `${v}`.trim() !== "")
        extra[a.key] = a.type === "number" ? Number(v) : v;
    }
    try {
      await this.store.queuePractice({
        localId: `prc-${crypto.randomUUID()}`,
        label: `${t.name} \xB7 ${field.code}`,
        payload: {
          field_id: field.id,
          practice_code: t.code,
          scenario: this.scenario(),
          performed_on: this.date(),
          quantity: this.qty() === null || `${this.qty()}` === "" ? null : Number(this.qty()),
          unit: t.unit,
          extra,
          source: "field_app"
        },
        photos: this.photo() ? [this.photo()] : []
      });
      this.toast.success("Practice saved", this.store.online() ? "Uploading now." : "It will upload when you have signal.");
      this.router.navigate(["/field/outbox"]);
    } catch (e) {
      this.toast.error("Couldn't save on this phone", e.message);
    } finally {
      this.busy.set(false);
    }
  }
  ngOnDestroy() {
    this.gps.stop();
    if (this.thumb())
      URL.revokeObjectURL(this.thumb());
  }
  static \u0275fac = function FieldPractice_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FieldPractice)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FieldPractice, selectors: [["vc-field-practice"]], decls: 62, vars: 21, consts: [[1, "fpage"], [1, "ftitle"], [1, "fsub"], [1, "fcard", "fcard-pad", "form"], ["for", "p-field", 1, "flabel"], ["id", "p-field", 1, "finput", 3, "ngModelChange", "ngModel"], ["value", ""], [3, "value"], [1, "fhint"], ["for", "p-type", 1, "flabel"], ["id", "p-type", 1, "finput", 3, "ngModelChange", "ngModel"], ["id", "p-scn", 1, "flabel"], ["role", "radiogroup", "aria-labelledby", "p-scn", 1, "scn"], ["type", "button", "role", "radio", 3, "click"], ["for", "p-date", 1, "flabel"], ["id", "p-date", "type", "date", 1, "finput", 3, "ngModelChange", "max", "ngModel"], [1, "flabel"], [1, "opt"], [1, "shot"], ["type", "file", "accept", "image/*", "capture", "environment", "hidden", "", 3, "change"], ["alt", "Practice photo", 3, "src"], [1, "cam"], [1, "fbtn", "primary", "block", 3, "click", "disabled"], ["name", "check", 3, "size"], ["for", "p-qty", 1, "flabel"], [1, "qty"], ["id", "p-qty", "type", "number", "inputmode", "decimal", "min", "0", 1, "finput", "num", 3, "ngModelChange", "ngModel"], [1, "unit"], [1, "flabel", 3, "for"], [1, "finput", 3, "id", "ngModel"], [1, "finput", 3, "id", "type", "ngModel"], [1, "finput", 3, "ngModelChange", "id", "ngModel"], [1, "finput", 3, "ngModelChange", "id", "type", "ngModel"], ["name", "camera", 3, "size"]], template: function FieldPractice_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div")(2, "div", 1);
      \u0275\u0275text(3, "Record a practice");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 2);
      \u0275\u0275text(5, "What the farmer did on a field \u2014 for example mulching, cover crop or compost. Works offline.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "section", 3)(7, "div")(8, "label", 4);
      \u0275\u0275text(9, "Field");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "select", 5);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function FieldPractice_Template_select_ngModelChange_10_listener($event) {
        return ctx.fieldId.set($event);
      });
      \u0275\u0275elementStart(11, "option", 6);
      \u0275\u0275text(12, "Choose a field\u2026");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(13, FieldPractice_For_14_Template, 2, 3, "option", 7, _forTrack05);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(15, FieldPractice_Conditional_15_Template, 2, 0, "div", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "div")(17, "label", 9);
      \u0275\u0275text(18, "Practice");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "select", 10);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function FieldPractice_Template_select_ngModelChange_19_listener($event) {
        return ctx.setType($event);
      });
      \u0275\u0275elementStart(20, "option", 6);
      \u0275\u0275text(21, "Choose a practice\u2026");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(22, FieldPractice_For_23_Template, 2, 2, "option", 7, _forTrack14);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(24, FieldPractice_Conditional_24_Template, 2, 1, "div", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "div")(26, "span", 11);
      \u0275\u0275text(27, "Is this the usual practice, or a new one for the project?");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "div", 12)(29, "button", 13);
      \u0275\u0275listener("click", function FieldPractice_Template_button_click_29_listener() {
        return ctx.scenario.set("baseline");
      });
      \u0275\u0275elementStart(30, "strong");
      \u0275\u0275text(31, "Usual (baseline)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "em");
      \u0275\u0275text(33, "What the farm did before the project");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(34, "button", 13);
      \u0275\u0275listener("click", function FieldPractice_Template_button_click_34_listener() {
        return ctx.scenario.set("project");
      });
      \u0275\u0275elementStart(35, "strong");
      \u0275\u0275text(36, "New (project)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(37, "em");
      \u0275\u0275text(38, "A change made because of the project");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(39, FieldPractice_Conditional_39_Template, 2, 0, "div", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "div")(41, "label", 14);
      \u0275\u0275text(42, "Date done");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "input", 15);
      \u0275\u0275controlCreate();
      \u0275\u0275listener("ngModelChange", function FieldPractice_Template_input_ngModelChange_43_listener($event) {
        return ctx.date.set($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(44, FieldPractice_Conditional_44_Template, 10, 3);
      \u0275\u0275elementStart(45, "div")(46, "span", 16);
      \u0275\u0275text(47, "Photo ");
      \u0275\u0275conditionalCreate(48, FieldPractice_Conditional_48_Template, 2, 0, "span", 17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(49, "label", 18)(50, "input", 19);
      \u0275\u0275listener("change", function FieldPractice_Template_input_change_50_listener($event) {
        return ctx.takePhoto($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(51, FieldPractice_Conditional_51_Template, 1, 1, "img", 20)(52, FieldPractice_Conditional_52_Template, 2, 1, "span", 21);
      \u0275\u0275elementStart(53, "span")(54, "strong");
      \u0275\u0275text(55);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "em");
      \u0275\u0275text(57, "Stamped with time and position");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275conditionalCreate(58, FieldPractice_Conditional_58_Template, 2, 1, "p", 8);
      \u0275\u0275elementStart(59, "button", 22);
      \u0275\u0275listener("click", function FieldPractice_Template_button_click_59_listener() {
        return ctx.save();
      });
      \u0275\u0275element(60, "vc-icon", 23);
      \u0275\u0275text(61);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      let tmp_16_0;
      \u0275\u0275advance(10);
      \u0275\u0275property("ngModel", ctx.fieldId());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.fields());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.fields().length ? 15 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("ngModel", ctx.typeCode());
      \u0275\u0275control();
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.types());
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.typesNote() ? 24 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275classProp("on", ctx.scenario() === "baseline");
      \u0275\u0275attribute("aria-checked", ctx.scenario() === "baseline");
      \u0275\u0275advance(5);
      \u0275\u0275classProp("on", ctx.scenario() === "project");
      \u0275\u0275attribute("aria-checked", ctx.scenario() === "project");
      \u0275\u0275advance(5);
      \u0275\u0275conditional(!ctx.scenario() ? 39 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("max", ctx.today)("ngModel", ctx.date());
      \u0275\u0275control();
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_16_0 = ctx.type()) ? 44 : -1, tmp_16_0);
      \u0275\u0275advance(4);
      \u0275\u0275conditional(!ctx.photoRequired() ? 48 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.thumb() ? 51 : 52);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.thumb() ? "Retake photo" : "Take a photo");
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.missing().length ? 58 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", !!ctx.missing().length || ctx.busy());
      \u0275\u0275advance();
      \u0275\u0275property("size", 20);
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.busy() ? "Saving\u2026" : "Save practice");
    }
  }, dependencies: [FormsModule, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, SelectControlValueAccessor, NgControlStatus, MinValidator, NgModel, Icon], styles: [`
[_nghost-%COMP%] {
  display: block;
}
.fpage[_ngcontent-%COMP%] {
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ftitle[_ngcontent-%COMP%] {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--%NS%stone-900);
  line-height: 1.2;
}
.fsub[_ngcontent-%COMP%] {
  font-size: 14.5px;
  color: var(--%NS%stone-700);
}
.fcard[_ngcontent-%COMP%] {
  background: #fff;
  border: 1.5px solid var(--%NS%sand-300);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(16, 41, 28, 0.06);
}
.fcard-pad[_ngcontent-%COMP%] {
  padding: 16px;
}
.fsec[_ngcontent-%COMP%] {
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--%NS%stone-600);
  margin: 4px 2px -6px;
}
.fbtn[_ngcontent-%COMP%] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 20px;
  border-radius: 12px;
  border: 2px solid transparent;
  font: 600 16px var(--%NS%font);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  text-decoration: none !important;
  -webkit-tap-highlight-color: transparent;
}
.fbtn[_ngcontent-%COMP%]:active {
  transform: translateY(1px);
}
.fbtn[disabled][_ngcontent-%COMP%] {
  opacity: 0.45;
  cursor: not-allowed;
}
.fbtn.primary[_ngcontent-%COMP%] {
  background: var(--%NS%forest-700);
  color: #fff;
}
.fbtn.primary[_ngcontent-%COMP%]:hover:not([disabled]) {
  background: var(--%NS%forest-800);
}
.fbtn.secondary[_ngcontent-%COMP%] {
  background: #fff;
  color: var(--%NS%forest-800);
  border-color: var(--%NS%forest-700);
}
.fbtn.ghost[_ngcontent-%COMP%] {
  background: transparent;
  color: var(--%NS%stone-800);
  border-color: var(--%NS%sand-300);
}
.fbtn.danger[_ngcontent-%COMP%] {
  background: #fff;
  color: var(--%NS%red-600);
  border-color: var(--%NS%red-600);
}
.fbtn.block[_ngcontent-%COMP%] {
  width: 100%;
}
.fbtn.sm[_ngcontent-%COMP%] {
  min-height: 44px;
  padding: 0 14px;
  font-size: 15px;
  border-radius: 10px;
}
.finput[_ngcontent-%COMP%] {
  width: 100%;
  min-height: 52px;
  padding: 0 14px;
  border: 2px solid var(--%NS%stone-300);
  border-radius: 12px;
  background: #fff;
  font: 500 17px var(--%NS%font);
  color: var(--%NS%stone-900);
  outline: none;
}
textarea.finput[_ngcontent-%COMP%] {
  min-height: 96px;
  padding: 12px 14px;
  line-height: 1.45;
}
select.finput[_ngcontent-%COMP%] {
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231d2420' stroke-width='2.2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}
.finput[_ngcontent-%COMP%]:focus {
  border-color: var(--%NS%forest-600);
  box-shadow: 0 0 0 3px rgba(47, 114, 73, 0.25);
}
.finput.bad[_ngcontent-%COMP%] {
  border-color: var(--%NS%red-600);
}
.flabel[_ngcontent-%COMP%] {
  display: block;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--%NS%stone-800);
  margin-bottom: 6px;
}
.fhint[_ngcontent-%COMP%] {
  font-size: 13.5px;
  color: var(--%NS%stone-600);
  margin-top: 6px;
}
.ferr[_ngcontent-%COMP%] {
  font-size: 14px;
  color: var(--%NS%red-600);
  margin-top: 6px;
  font-weight: 500;
}
.chip[_ngcontent-%COMP%] {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.chip.ok[_ngcontent-%COMP%] {
  background: var(--%NS%forest-100);
  color: var(--%NS%forest-800);
}
.chip.warn[_ngcontent-%COMP%] {
  background: var(--%NS%amber-100);
  color: #7a4d00;
}
.chip.bad[_ngcontent-%COMP%] {
  background: var(--%NS%red-100);
  color: var(--%NS%red-600);
}
.chip.info[_ngcontent-%COMP%] {
  background: var(--%NS%sky-100);
  color: var(--%NS%sky-600);
}
.chip.muted[_ngcontent-%COMP%] {
  background: var(--%NS%stone-100);
  color: var(--%NS%stone-700);
}
.fempty[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 28px 16px;
  color: var(--%NS%stone-700);
}
.fempty[_ngcontent-%COMP%]   .ic[_ngcontent-%COMP%] {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--%NS%sand-200);
  color: var(--%NS%stone-700);
  margin-bottom: 4px;
}
.fempty[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {
  font-size: 17px;
}
.num[_ngcontent-%COMP%] {
  font-variant-numeric: tabular-nums;
}
.mono[_ngcontent-%COMP%] {
  font-family: var(--%NS%mono);
}
/*# sourceMappingURL=field-practice.css.map */`, "\n.form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 18px;\n}\n.opt[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: var(--%NS%stone-500);\n}\n.scn[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.scn[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  align-items: flex-start;\n  text-align: left;\n  min-height: 76px;\n  padding: 12px;\n  border: 2px solid var(--%NS%stone-300);\n  border-radius: 12px;\n  background: #fff;\n  font: inherit;\n  cursor: pointer;\n  color: var(--%NS%stone-900);\n}\n.scn[_ngcontent-%COMP%]   button.on[_ngcontent-%COMP%] {\n  border-color: var(--%NS%forest-700);\n  background: var(--%NS%forest-50);\n  box-shadow: inset 0 0 0 1px var(--%NS%forest-700);\n}\n.scn[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 15.5px;\n}\n.scn[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-style: normal;\n  font-size: 13px;\n  color: var(--%NS%stone-600);\n}\n.qty[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.unit[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--%NS%stone-700);\n  min-width: 60px;\n}\n.shot[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 10px;\n  border: 2px dashed var(--%NS%stone-300);\n  border-radius: 12px;\n  cursor: pointer;\n}\n.shot[_ngcontent-%COMP%]   img[_ngcontent-%COMP%], \n.cam[_ngcontent-%COMP%] {\n  width: 88px;\n  height: 66px;\n  border-radius: 10px;\n  object-fit: cover;\n  flex: none;\n}\n.cam[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  background: var(--%NS%forest-800);\n  color: #fff;\n}\n.shot[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.shot[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n.shot[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-style: normal;\n  font-size: 13.5px;\n  color: var(--%NS%stone-600);\n}\n@media (max-width: 380px) {\n  .scn[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=field-practice.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldPractice, [{
    type: Component,
    args: [{ selector: "vc-field-practice", imports: [FormsModule, Icon], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="fpage">
      <div>
        <div class="ftitle">Record a practice</div>
        <div class="fsub">What the farmer did on a field \u2014 for example mulching, cover crop or compost. Works offline.</div>
      </div>

      <section class="fcard fcard-pad form">
        <div>
          <label class="flabel" for="p-field">Field</label>
          <select id="p-field" class="finput" [ngModel]="fieldId()" (ngModelChange)="fieldId.set($event)">
            <option value="">Choose a field\u2026</option>
            @for (f of fields(); track f.id) { <option [value]="f.id">{{ f.code }}{{ f.name ? ' \xB7 ' + f.name : '' }}</option> }
          </select>
          @if (!fields().length) { <div class="fhint">No fields on this phone yet. Download a campaign from Home, or connect once to load your fields.</div> }
        </div>

        <div>
          <label class="flabel" for="p-type">Practice</label>
          <select id="p-type" class="finput" [ngModel]="typeCode()" (ngModelChange)="setType($event)">
            <option value="">Choose a practice\u2026</option>
            @for (t of types(); track t.code) { <option [value]="t.code">{{ t.name }}</option> }
          </select>
          @if (typesNote()) { <div class="fhint">{{ typesNote() }}</div> }
        </div>

        <div>
          <span class="flabel" id="p-scn">Is this the usual practice, or a new one for the project?</span>
          <div class="scn" role="radiogroup" aria-labelledby="p-scn">
            <button type="button" [class.on]="scenario() === 'baseline'" (click)="scenario.set('baseline')" role="radio" [attr.aria-checked]="scenario() === 'baseline'">
              <strong>Usual (baseline)</strong><em>What the farm did before the project</em>
            </button>
            <button type="button" [class.on]="scenario() === 'project'" (click)="scenario.set('project')" role="radio" [attr.aria-checked]="scenario() === 'project'">
              <strong>New (project)</strong><em>A change made because of the project</em>
            </button>
          </div>
          @if (!scenario()) { <div class="fhint">Required \u2014 this is never assumed.</div> }
        </div>

        <div>
          <label class="flabel" for="p-date">Date done</label>
          <input id="p-date" type="date" class="finput" [max]="today" [ngModel]="date()" (ngModelChange)="date.set($event)" />
        </div>

        @if (type(); as t) {
          <div>
            <label class="flabel" for="p-qty">Quantity @if (!t.requires_quantity) { <span class="opt">(optional)</span> }</label>
            <div class="qty">
              <input id="p-qty" type="number" inputmode="decimal" min="0" class="finput num" [ngModel]="qty()" (ngModelChange)="qty.set($event)" />
              <span class="unit">{{ t.unit || 'units' }}</span>
            </div>
          </div>
          @for (a of t.fields; track a.key) {
            <div>
              <label class="flabel" [for]="'x-' + a.key">{{ a.label }} @if (!a.required) { <span class="opt">(optional)</span> }</label>
              @if (a.type === 'choice') {
                <select class="finput" [id]="'x-' + a.key" [ngModel]="extra()[a.key] ?? ''" (ngModelChange)="setExtra(a.key, $event)">
                  <option value="">Choose\u2026</option>
                  @for (c of a.choices; track c) { <option [value]="c">{{ c }}</option> }
                </select>
              } @else {
                <input class="finput" [id]="'x-' + a.key" [type]="a.type === 'number' ? 'number' : 'text'" [ngModel]="extra()[a.key] ?? ''" (ngModelChange)="setExtra(a.key, $event)" />
              }
              @if (a.unit) { <div class="fhint">In {{ a.unit }}</div> }
            </div>
          }
        }

        <div>
          <span class="flabel">Photo @if (!photoRequired()) { <span class="opt">(optional)</span> }</span>
          <label class="shot">
            <input type="file" accept="image/*" capture="environment" (change)="takePhoto($event)" hidden />
            @if (thumb()) { <img [src]="thumb()" alt="Practice photo" /> } @else { <span class="cam"><vc-icon name="camera" [size]="30" /></span> }
            <span><strong>{{ thumb() ? 'Retake photo' : 'Take a photo' }}</strong><em>Stamped with time and position</em></span>
          </label>
        </div>
      </section>

      @if (missing().length) { <p class="fhint">Still needed: {{ missing().join(', ') }}.</p> }
      <button class="fbtn primary block" [disabled]="!!missing().length || busy()" (click)="save()"><vc-icon name="check" [size]="20" />{{ busy() ? 'Saving\u2026' : 'Save practice' }}</button>
    </div>
  `, styles: [`/* angular:styles/component:scss;8145719d236d938b;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\field-app\\field-practice.ts */
:host {
  display: block;
}
.fpage {
  padding: 16px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ftitle {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--stone-900);
  line-height: 1.2;
}
.fsub {
  font-size: 14.5px;
  color: var(--stone-700);
}
.fcard {
  background: #fff;
  border: 1.5px solid var(--sand-300);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgba(16, 41, 28, 0.06);
}
.fcard-pad {
  padding: 16px;
}
.fsec {
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--stone-600);
  margin: 4px 2px -6px;
}
.fbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 20px;
  border-radius: 12px;
  border: 2px solid transparent;
  font: 600 16px var(--font);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  text-decoration: none !important;
  -webkit-tap-highlight-color: transparent;
}
.fbtn:active {
  transform: translateY(1px);
}
.fbtn[disabled] {
  opacity: 0.45;
  cursor: not-allowed;
}
.fbtn.primary {
  background: var(--forest-700);
  color: #fff;
}
.fbtn.primary:hover:not([disabled]) {
  background: var(--forest-800);
}
.fbtn.secondary {
  background: #fff;
  color: var(--forest-800);
  border-color: var(--forest-700);
}
.fbtn.ghost {
  background: transparent;
  color: var(--stone-800);
  border-color: var(--sand-300);
}
.fbtn.danger {
  background: #fff;
  color: var(--red-600);
  border-color: var(--red-600);
}
.fbtn.block {
  width: 100%;
}
.fbtn.sm {
  min-height: 44px;
  padding: 0 14px;
  font-size: 15px;
  border-radius: 10px;
}
.finput {
  width: 100%;
  min-height: 52px;
  padding: 0 14px;
  border: 2px solid var(--stone-300);
  border-radius: 12px;
  background: #fff;
  font: 500 17px var(--font);
  color: var(--stone-900);
  outline: none;
}
textarea.finput {
  min-height: 96px;
  padding: 12px 14px;
  line-height: 1.45;
}
select.finput {
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231d2420' stroke-width='2.2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}
.finput:focus {
  border-color: var(--forest-600);
  box-shadow: 0 0 0 3px rgba(47, 114, 73, 0.25);
}
.finput.bad {
  border-color: var(--red-600);
}
.flabel {
  display: block;
  font-size: 14.5px;
  font-weight: 600;
  color: var(--stone-800);
  margin-bottom: 6px;
}
.fhint {
  font-size: 13.5px;
  color: var(--stone-600);
  margin-top: 6px;
}
.ferr {
  font-size: 14px;
  color: var(--red-600);
  margin-top: 6px;
  font-weight: 500;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.chip.ok {
  background: var(--forest-100);
  color: var(--forest-800);
}
.chip.warn {
  background: var(--amber-100);
  color: #7a4d00;
}
.chip.bad {
  background: var(--red-100);
  color: var(--red-600);
}
.chip.info {
  background: var(--sky-100);
  color: var(--sky-600);
}
.chip.muted {
  background: var(--stone-100);
  color: var(--stone-700);
}
.fempty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 28px 16px;
  color: var(--stone-700);
}
.fempty .ic {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--sand-200);
  color: var(--stone-700);
  margin-bottom: 4px;
}
.fempty h3 {
  font-size: 17px;
}
.num {
  font-variant-numeric: tabular-nums;
}
.mono {
  font-family: var(--mono);
}
/*# sourceMappingURL=field-practice.css.map */
`, "/* angular:styles/component:scss;1c1472250251b9fc;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\field-app\\field-practice.ts */\n.form {\n  display: flex;\n  flex-direction: column;\n  gap: 18px;\n}\n.opt {\n  font-weight: 500;\n  color: var(--stone-500);\n}\n.scn {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.scn button {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  align-items: flex-start;\n  text-align: left;\n  min-height: 76px;\n  padding: 12px;\n  border: 2px solid var(--stone-300);\n  border-radius: 12px;\n  background: #fff;\n  font: inherit;\n  cursor: pointer;\n  color: var(--stone-900);\n}\n.scn button.on {\n  border-color: var(--forest-700);\n  background: var(--forest-50);\n  box-shadow: inset 0 0 0 1px var(--forest-700);\n}\n.scn strong {\n  font-size: 15.5px;\n}\n.scn em {\n  font-style: normal;\n  font-size: 13px;\n  color: var(--stone-600);\n}\n.qty {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.unit {\n  font-weight: 600;\n  color: var(--stone-700);\n  min-width: 60px;\n}\n.shot {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 10px;\n  border: 2px dashed var(--stone-300);\n  border-radius: 12px;\n  cursor: pointer;\n}\n.shot img,\n.cam {\n  width: 88px;\n  height: 66px;\n  border-radius: 10px;\n  object-fit: cover;\n  flex: none;\n}\n.cam {\n  display: grid;\n  place-items: center;\n  background: var(--forest-800);\n  color: #fff;\n}\n.shot span {\n  display: flex;\n  flex-direction: column;\n}\n.shot strong {\n  font-size: 16px;\n}\n.shot em {\n  font-style: normal;\n  font-size: 13.5px;\n  color: var(--stone-600);\n}\n@media (max-width: 380px) {\n  .scn {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=field-practice.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FieldPractice, { className: "FieldPractice", filePath: "src/app/features/field-app/field-practice.ts", lineNumber: 115 });
})();

// src/app/features/field-app/field-shell.ts
var _c03 = () => ({ exact: true });
function FieldShell_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "vc-icon", 22);
    \u0275\u0275text(2, "You're offline. Everything you record is saved on this phone.");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 16);
  }
}
function FieldShell_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "b", 18);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.store.rejected());
  }
}
function FieldShell_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "b", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.store.queued());
  }
}
function FieldShell_Conditional_33_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 34);
    \u0275\u0275listener("click", function FieldShell_Conditional_33_Conditional_21_Template_a_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.menu.set(false));
    });
    \u0275\u0275element(1, "vc-icon", 35);
    \u0275\u0275text(2, "Open the full platform");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
  }
}
function FieldShell_Conditional_33_Conditional_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 33);
    \u0275\u0275text(1);
    \u0275\u0275elementStart(2, "button", 31);
    \u0275\u0275listener("click", function FieldShell_Conditional_33_Conditional_25_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.auth.logout());
    });
    \u0275\u0275text(3, "Sign out anyway");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.store.queued(), " record(s) have not uploaded yet. They stay on this phone and upload after the next sign-in. ");
  }
}
function FieldShell_Conditional_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275listener("click", function FieldShell_Conditional_33_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.menu.set(false));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(1, "div", 24)(2, "div", 25)(3, "span", 26);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span")(6, "strong");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "em");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 27)(11, "span");
    \u0275\u0275text(12, "Device ");
    \u0275\u0275elementStart(13, "code");
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "span");
    \u0275\u0275text(16);
    \u0275\u0275pipe(17, "ago");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "button", 28);
    \u0275\u0275listener("click", function FieldShell_Conditional_33_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      ctx_r0.syncNow();
      return \u0275\u0275resetView(ctx_r0.menu.set(false));
    });
    \u0275\u0275element(19, "vc-icon", 29);
    \u0275\u0275text(20, "Sync now");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(21, FieldShell_Conditional_33_Conditional_21_Template, 3, 1, "a", 30);
    \u0275\u0275elementStart(22, "button", 31);
    \u0275\u0275listener("click", function FieldShell_Conditional_33_Template_button_click_22_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.signOut());
    });
    \u0275\u0275element(23, "vc-icon", 32);
    \u0275\u0275text(24, "Sign out");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(25, FieldShell_Conditional_33_Conditional_25_Template, 4, 1, "div", 33);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.auth.initials());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.auth.profile()?.full_name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r0.auth.profile()?.role_label, " \xB7 ", ctx_r0.auth.profile()?.organization?.name);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.device);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Last sync ", ctx_r0.store.lastSync() ? \u0275\u0275pipeBind1(17, 11, ctx_r0.store.lastSync()) : "never");
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r0.store.online());
    \u0275\u0275advance();
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.auth.can("data.read") ? 21 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("size", 20);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.confirmOut() ? 25 : -1);
  }
}
var FieldShell = class _FieldShell {
  auth = inject(AuthService);
  store = inject(OfflineStore);
  data = inject(FieldData);
  menu = signal(
    false,
    ...ngDevMode ? [{ debugName: "menu" }] : (
      /* istanbul ignore next */
      []
    )
  );
  confirmOut = signal(
    false,
    ...ngDevMode ? [{ debugName: "confirmOut" }] : (
      /* istanbul ignore next */
      []
    )
  );
  device = deviceId();
  pillTone = computed(
    () => this.store.rejected() && this.store.online() && !this.store.syncing() ? "rejected" : this.store.status(),
    ...ngDevMode ? [{ debugName: "pillTone" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pillIcon = computed(
    () => ({ offline: "wifi-off", syncing: "refresh", pending: "cloud-upload", ok: "check-circle", rejected: "alert" })[this.pillTone()],
    ...ngDevMode ? [{ debugName: "pillIcon" }] : (
      /* istanbul ignore next */
      []
    )
  );
  pillText = computed(
    () => {
      const q = this.store.queued();
      switch (this.pillTone()) {
        case "offline":
          return q ? `Offline \xB7 ${q} waiting` : "Offline";
        case "syncing":
          return "Uploading\u2026";
        case "pending":
          return `${q} to upload`;
        case "rejected":
          return `${this.store.rejected()} need attention`;
        default:
          return "All synced";
      }
    },
    ...ngDevMode ? [{ debugName: "pillText" }] : (
      /* istanbul ignore next */
      []
    )
  );
  mapLink = computed(
    () => {
      const last = localStorage.getItem("vc.field.lastCampaign");
      return last ? ["/field/campaign", last] : ["/field/map"];
    },
    ...ngDevMode ? [{ debugName: "mapLink" }] : (
      /* istanbul ignore next */
      []
    )
  );
  constructor() {
    void this.data.refreshBundles();
    if (navigator.onLine)
      void this.store.sync();
  }
  esc() {
    this.menu.set(false);
  }
  syncNow() {
    if (this.store.online())
      void this.store.sync();
  }
  signOut() {
    if (this.store.queued() && !this.confirmOut()) {
      this.confirmOut.set(true);
      return;
    }
    this.auth.logout();
  }
  static \u0275fac = function FieldShell_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FieldShell)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FieldShell, selectors: [["vc-field-shell"]], hostBindings: function FieldShell_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function FieldShell_keydown_escape_HostBindingHandler() {
        return ctx.esc();
      }, \u0275\u0275resolveWindow);
    }
  }, decls: 34, vars: 21, consts: [[1, "app"], [1, "top"], [1, "brand", 3, "light"], [1, "spacer"], [1, "pill", 3, "click"], [3, "name", "size", "stroke"], ["aria-label", "Menu", 1, "menu-btn", 3, "click"], ["name", "menu", 3, "size"], [1, "offline-bar"], [1, "body"], [1, "tabs"], ["routerLink", "/field", "routerLinkActive", "on", 3, "routerLinkActiveOptions"], ["name", "home", 3, "size"], ["routerLinkActive", "on", 3, "routerLink"], ["name", "map", 3, "size"], ["routerLink", "/field/outbox", "routerLinkActive", "on"], [1, "ico"], ["name", "cloud-upload", 3, "size"], [1, "dot", "bad"], [1, "dot"], ["routerLink", "/field/practice", "routerLinkActive", "on"], ["name", "sprout", 3, "size"], ["name", "wifi-off", 3, "size"], [1, "scrim", 3, "click"], ["role", "menu", 1, "sheet"], [1, "who"], [1, "av"], [1, "meta"], [1, "item", 3, "click", "disabled"], ["name", "refresh", 3, "size"], ["routerLink", "/app/overview", 1, "item"], [1, "item", "danger", 3, "click"], ["name", "logout", 3, "size"], [1, "warnbox"], ["routerLink", "/app/overview", 1, "item", 3, "click"], ["name", "dashboard", 3, "size"]], template: function FieldShell_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "header", 1);
      \u0275\u0275element(2, "vc-brand", 2)(3, "div", 3);
      \u0275\u0275elementStart(4, "button", 4);
      \u0275\u0275listener("click", function FieldShell_Template_button_click_4_listener() {
        return ctx.syncNow();
      });
      \u0275\u0275element(5, "vc-icon", 5);
      \u0275\u0275elementStart(6, "span");
      \u0275\u0275text(7);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "button", 6);
      \u0275\u0275listener("click", function FieldShell_Template_button_click_8_listener() {
        return ctx.menu.set(!ctx.menu());
      });
      \u0275\u0275element(9, "vc-icon", 7);
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(10, FieldShell_Conditional_10_Template, 3, 1, "div", 8);
      \u0275\u0275elementStart(11, "main", 9);
      \u0275\u0275element(12, "router-outlet");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "nav", 10)(14, "a", 11);
      \u0275\u0275element(15, "vc-icon", 12);
      \u0275\u0275elementStart(16, "span");
      \u0275\u0275text(17, "Home");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "a", 13);
      \u0275\u0275element(19, "vc-icon", 14);
      \u0275\u0275elementStart(20, "span");
      \u0275\u0275text(21, "Map");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(22, "a", 15)(23, "span", 16);
      \u0275\u0275element(24, "vc-icon", 17);
      \u0275\u0275conditionalCreate(25, FieldShell_Conditional_25_Template, 2, 1, "b", 18)(26, FieldShell_Conditional_26_Template, 2, 1, "b", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(27, "span");
      \u0275\u0275text(28, "Outbox");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(29, "a", 20);
      \u0275\u0275element(30, "vc-icon", 21);
      \u0275\u0275elementStart(31, "span");
      \u0275\u0275text(32, "Practice");
      \u0275\u0275elementEnd()()();
      \u0275\u0275conditionalCreate(33, FieldShell_Conditional_33_Template, 26, 13);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275property("light", true);
      \u0275\u0275advance(2);
      \u0275\u0275classMap("pill " + ctx.pillTone());
      \u0275\u0275attribute("aria-label", ctx.pillText());
      \u0275\u0275advance();
      \u0275\u0275classProp("spin", ctx.store.syncing());
      \u0275\u0275property("name", ctx.pillIcon())("size", 16)("stroke", 2.2);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.pillText());
      \u0275\u0275advance(2);
      \u0275\u0275property("size", 22);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.store.online() ? 10 : -1);
      \u0275\u0275advance(4);
      \u0275\u0275property("routerLinkActiveOptions", \u0275\u0275pureFunction0(20, _c03));
      \u0275\u0275advance();
      \u0275\u0275property("size", 24);
      \u0275\u0275advance(3);
      \u0275\u0275property("routerLink", ctx.mapLink());
      \u0275\u0275advance();
      \u0275\u0275property("size", 24);
      \u0275\u0275advance(5);
      \u0275\u0275property("size", 24);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.store.rejected() ? 25 : ctx.store.queued() ? 26 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275property("size", 24);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.menu() ? 33 : -1);
    }
  }, dependencies: [RouterOutlet, RouterLink, RouterLinkActive, Icon, Brand, AgoPipe], styles: ["\n[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  background: #efece4;\n}\n.app[_ngcontent-%COMP%] {\n  max-width: 600px;\n  margin: 0 auto;\n  min-height: 100vh;\n  background: var(--%NS%sand-100);\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  box-shadow: 0 0 0 1px var(--%NS%sand-300);\n}\n.top[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 30;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  height: 60px;\n  padding: 0 10px 0 16px;\n  background: var(--%NS%forest-900);\n  color: #fff;\n}\n.brand[_ngcontent-%COMP%] {\n  transform: scale(0.92);\n  transform-origin: left center;\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.pill[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  height: 36px;\n  padding: 0 12px;\n  border-radius: 999px;\n  border: 0;\n  font: 600 13.5px var(--%NS%font);\n  cursor: pointer;\n  white-space: nowrap;\n}\n.pill.ok[_ngcontent-%COMP%] {\n  background: rgba(134, 183, 151, 0.22);\n  color: #d9eee0;\n}\n.pill.pending[_ngcontent-%COMP%] {\n  background: #f1c46a;\n  color: #3d2800;\n}\n.pill.syncing[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.16);\n  color: #fff;\n}\n.pill.offline[_ngcontent-%COMP%] {\n  background: #fff;\n  color: var(--%NS%red-600);\n}\n.pill.rejected[_ngcontent-%COMP%] {\n  background: #ffd9d4;\n  color: #8a1c14;\n}\n.spin[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.menu-btn[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 48px;\n  height: 48px;\n  border: 0;\n  border-radius: 12px;\n  background: none;\n  color: #fff;\n  cursor: pointer;\n}\n.offline-bar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 16px;\n  background: var(--%NS%stone-900);\n  color: #fff;\n  font-size: 14px;\n  font-weight: 500;\n}\n.body[_ngcontent-%COMP%] {\n  flex: 1;\n  padding-bottom: 88px;\n}\n.tabs[_ngcontent-%COMP%] {\n  position: fixed;\n  bottom: 0;\n  left: 50%;\n  transform: translateX(-50%);\n  width: 100%;\n  max-width: 600px;\n  z-index: 30;\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  background: #fff;\n  border-top: 1.5px solid var(--%NS%sand-300);\n  padding: 6px 6px calc(6px + env(safe-area-inset-bottom));\n}\n.tabs[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 3px;\n  min-height: 60px;\n  border-radius: 12px;\n  color: var(--%NS%stone-600);\n  font-size: 13px;\n  font-weight: 600;\n  text-decoration: none !important;\n  -webkit-tap-highlight-color: transparent;\n}\n.tabs[_ngcontent-%COMP%]   a.on[_ngcontent-%COMP%] {\n  color: var(--%NS%forest-800);\n  background: var(--%NS%forest-100);\n}\n.ico[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n}\n.dot[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -6px;\n  right: -12px;\n  min-width: 20px;\n  height: 20px;\n  padding: 0 5px;\n  border-radius: 10px;\n  background: #e0a225;\n  color: #2b1c00;\n  font-size: 11.5px;\n  display: grid;\n  place-items: center;\n  border: 2px solid #fff;\n}\n.dot.bad[_ngcontent-%COMP%] {\n  background: var(--%NS%red-600);\n  color: #fff;\n}\n.scrim[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.35);\n  z-index: 40;\n}\n.sheet[_ngcontent-%COMP%] {\n  position: fixed;\n  left: 50%;\n  transform: translateX(-50%);\n  bottom: 0;\n  width: 100%;\n  max-width: 600px;\n  z-index: 41;\n  background: #fff;\n  border-radius: 20px 20px 0 0;\n  padding: 18px 16px calc(18px + env(safe-area-inset-bottom));\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  animation: _ngcontent-%COMP%_up 0.18s ease-out;\n}\n@keyframes _ngcontent-%COMP%_up {\n  from {\n    transform: translate(-50%, 20px);\n    opacity: 0;\n  }\n}\n.who[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 4px 4px 12px;\n  border-bottom: 1px solid var(--%NS%sand-200);\n}\n.who[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child {\n  display: flex;\n  flex-direction: column;\n}\n.who[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 16px;\n}\n.who[_ngcontent-%COMP%]   em[_ngcontent-%COMP%] {\n  font-style: normal;\n  font-size: 13.5px;\n  color: var(--%NS%stone-600);\n}\n.av[_ngcontent-%COMP%] {\n  display: grid;\n  place-items: center;\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  background: var(--%NS%forest-700);\n  color: #fff;\n  font-weight: 600;\n}\n.meta[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  padding: 8px 4px 10px;\n  font-size: 13px;\n  color: var(--%NS%stone-600);\n}\n.item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  min-height: 54px;\n  padding: 0 12px;\n  border: 0;\n  border-radius: 12px;\n  background: none;\n  font: 600 16px var(--%NS%font);\n  color: var(--%NS%stone-900);\n  cursor: pointer;\n  text-decoration: none !important;\n  width: 100%;\n}\n.item[_ngcontent-%COMP%]:hover {\n  background: var(--%NS%sand-100);\n}\n.item[disabled][_ngcontent-%COMP%] {\n  opacity: 0.45;\n}\n.item.danger[_ngcontent-%COMP%] {\n  color: var(--%NS%red-600);\n}\n.warnbox[_ngcontent-%COMP%] {\n  margin-top: 6px;\n  padding: 12px;\n  border-radius: 12px;\n  background: var(--%NS%amber-100);\n  color: #5c3a00;\n  font-size: 14px;\n  line-height: 1.45;\n}\n/*# sourceMappingURL=field-shell.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FieldShell, [{
    type: Component,
    args: [{ selector: "vc-field-shell", imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon, Brand, AgoPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
    <div class="app">
      <header class="top">
        <vc-brand [light]="true" class="brand" />
        <div class="spacer"></div>
        <button class="pill" [class]="'pill ' + pillTone()" (click)="syncNow()" [attr.aria-label]="pillText()">
          <vc-icon [name]="pillIcon()" [size]="16" [stroke]="2.2" [class.spin]="store.syncing()" />
          <span>{{ pillText() }}</span>
        </button>
        <button class="menu-btn" (click)="menu.set(!menu())" aria-label="Menu"><vc-icon name="menu" [size]="22" /></button>
      </header>

      @if (!store.online()) {
        <div class="offline-bar"><vc-icon name="wifi-off" [size]="16" />You're offline. Everything you record is saved on this phone.</div>
      }

      <main class="body"><router-outlet /></main>

      <nav class="tabs">
        <a routerLink="/field" [routerLinkActiveOptions]="{ exact: true }" routerLinkActive="on"><vc-icon name="home" [size]="24" /><span>Home</span></a>
        <a [routerLink]="mapLink()" routerLinkActive="on"><vc-icon name="map" [size]="24" /><span>Map</span></a>
        <a routerLink="/field/outbox" routerLinkActive="on">
          <span class="ico"><vc-icon name="cloud-upload" [size]="24" />
            @if (store.rejected()) { <b class="dot bad">{{ store.rejected() }}</b> } @else if (store.queued()) { <b class="dot">{{ store.queued() }}</b> }
          </span><span>Outbox</span>
        </a>
        <a routerLink="/field/practice" routerLinkActive="on"><vc-icon name="sprout" [size]="24" /><span>Practice</span></a>
      </nav>

      @if (menu()) {
        <div class="scrim" (click)="menu.set(false)"></div>
        <div class="sheet" role="menu">
          <div class="who">
            <span class="av">{{ auth.initials() }}</span>
            <span><strong>{{ auth.profile()?.full_name }}</strong><em>{{ auth.profile()?.role_label }} \xB7 {{ auth.profile()?.organization?.name }}</em></span>
          </div>
          <div class="meta">
            <span>Device <code>{{ device }}</code></span>
            <span>Last sync {{ store.lastSync() ? (store.lastSync() | ago) : 'never' }}</span>
          </div>
          <button class="item" (click)="syncNow(); menu.set(false)" [disabled]="!store.online()"><vc-icon name="refresh" [size]="20" />Sync now</button>
          @if (auth.can('data.read')) {
            <a class="item" routerLink="/app/overview" (click)="menu.set(false)"><vc-icon name="dashboard" [size]="20" />Open the full platform</a>
          }
          <button class="item danger" (click)="signOut()"><vc-icon name="logout" [size]="20" />Sign out</button>
          @if (confirmOut()) {
            <div class="warnbox">
              {{ store.queued() }} record(s) have not uploaded yet. They stay on this phone and upload after the next sign-in.
              <button class="item danger" (click)="auth.logout()">Sign out anyway</button>
            </div>
          }
        </div>
      }
    </div>
  `, styles: ["/* angular:styles/component:scss;0a1a4b9ad57ecf41;D:\\Desktop\\organic carbon\\carbon-platform\\web\\src\\app\\features\\field-app\\field-shell.ts */\n:host {\n  display: block;\n  min-height: 100vh;\n  background: #efece4;\n}\n.app {\n  max-width: 600px;\n  margin: 0 auto;\n  min-height: 100vh;\n  background: var(--sand-100);\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  box-shadow: 0 0 0 1px var(--sand-300);\n}\n.top {\n  position: sticky;\n  top: 0;\n  z-index: 30;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  height: 60px;\n  padding: 0 10px 0 16px;\n  background: var(--forest-900);\n  color: #fff;\n}\n.brand {\n  transform: scale(0.92);\n  transform-origin: left center;\n}\n.spacer {\n  flex: 1;\n}\n.pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  height: 36px;\n  padding: 0 12px;\n  border-radius: 999px;\n  border: 0;\n  font: 600 13.5px var(--font);\n  cursor: pointer;\n  white-space: nowrap;\n}\n.pill.ok {\n  background: rgba(134, 183, 151, 0.22);\n  color: #d9eee0;\n}\n.pill.pending {\n  background: #f1c46a;\n  color: #3d2800;\n}\n.pill.syncing {\n  background: rgba(255, 255, 255, 0.16);\n  color: #fff;\n}\n.pill.offline {\n  background: #fff;\n  color: var(--red-600);\n}\n.pill.rejected {\n  background: #ffd9d4;\n  color: #8a1c14;\n}\n.spin {\n  animation: spin 1s linear infinite;\n}\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n.menu-btn {\n  display: grid;\n  place-items: center;\n  width: 48px;\n  height: 48px;\n  border: 0;\n  border-radius: 12px;\n  background: none;\n  color: #fff;\n  cursor: pointer;\n}\n.offline-bar {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 16px;\n  background: var(--stone-900);\n  color: #fff;\n  font-size: 14px;\n  font-weight: 500;\n}\n.body {\n  flex: 1;\n  padding-bottom: 88px;\n}\n.tabs {\n  position: fixed;\n  bottom: 0;\n  left: 50%;\n  transform: translateX(-50%);\n  width: 100%;\n  max-width: 600px;\n  z-index: 30;\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  background: #fff;\n  border-top: 1.5px solid var(--sand-300);\n  padding: 6px 6px calc(6px + env(safe-area-inset-bottom));\n}\n.tabs a {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 3px;\n  min-height: 60px;\n  border-radius: 12px;\n  color: var(--stone-600);\n  font-size: 13px;\n  font-weight: 600;\n  text-decoration: none !important;\n  -webkit-tap-highlight-color: transparent;\n}\n.tabs a.on {\n  color: var(--forest-800);\n  background: var(--forest-100);\n}\n.ico {\n  position: relative;\n  display: inline-flex;\n}\n.dot {\n  position: absolute;\n  top: -6px;\n  right: -12px;\n  min-width: 20px;\n  height: 20px;\n  padding: 0 5px;\n  border-radius: 10px;\n  background: #e0a225;\n  color: #2b1c00;\n  font-size: 11.5px;\n  display: grid;\n  place-items: center;\n  border: 2px solid #fff;\n}\n.dot.bad {\n  background: var(--red-600);\n  color: #fff;\n}\n.scrim {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.35);\n  z-index: 40;\n}\n.sheet {\n  position: fixed;\n  left: 50%;\n  transform: translateX(-50%);\n  bottom: 0;\n  width: 100%;\n  max-width: 600px;\n  z-index: 41;\n  background: #fff;\n  border-radius: 20px 20px 0 0;\n  padding: 18px 16px calc(18px + env(safe-area-inset-bottom));\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  animation: up 0.18s ease-out;\n}\n@keyframes up {\n  from {\n    transform: translate(-50%, 20px);\n    opacity: 0;\n  }\n}\n.who {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 4px 4px 12px;\n  border-bottom: 1px solid var(--sand-200);\n}\n.who span:last-child {\n  display: flex;\n  flex-direction: column;\n}\n.who strong {\n  font-size: 16px;\n}\n.who em {\n  font-style: normal;\n  font-size: 13.5px;\n  color: var(--stone-600);\n}\n.av {\n  display: grid;\n  place-items: center;\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  background: var(--forest-700);\n  color: #fff;\n  font-weight: 600;\n}\n.meta {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  padding: 8px 4px 10px;\n  font-size: 13px;\n  color: var(--stone-600);\n}\n.item {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  min-height: 54px;\n  padding: 0 12px;\n  border: 0;\n  border-radius: 12px;\n  background: none;\n  font: 600 16px var(--font);\n  color: var(--stone-900);\n  cursor: pointer;\n  text-decoration: none !important;\n  width: 100%;\n}\n.item:hover {\n  background: var(--sand-100);\n}\n.item[disabled] {\n  opacity: 0.45;\n}\n.item.danger {\n  color: var(--red-600);\n}\n.warnbox {\n  margin-top: 6px;\n  padding: 12px;\n  border-radius: 12px;\n  background: var(--amber-100);\n  color: #5c3a00;\n  font-size: 14px;\n  line-height: 1.45;\n}\n/*# sourceMappingURL=field-shell.css.map */\n"] }]
  }], () => [], { esc: [{
    type: HostListener,
    args: ["window:keydown.escape"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FieldShell, { className: "FieldShell", filePath: "src/app/features/field-app/field-shell.ts", lineNumber: 111 });
})();

// src/app/features/field-app/field-app.routes.ts
var field_app_routes_default = [
  {
    path: "",
    component: FieldShell,
    children: [
      { path: "", component: FieldHome, title: "Field app \xB7 Varsapradaya Carbon" },
      { path: "map", component: FieldCampaign, title: "Map \xB7 Field app" },
      { path: "campaign/:cid", component: FieldCampaign, title: "Campaign \xB7 Field app" },
      { path: "campaign/:cid/point/:pid", component: FieldCapture, title: "Record a core \xB7 Field app" },
      { path: "outbox", component: FieldOutbox, title: "Outbox \xB7 Field app" },
      { path: "practice", component: FieldPractice, title: "Record a practice \xB7 Field app" }
    ]
  }
];
export {
  field_app_routes_default as default
};
//# debugId=271e6143-7b35-5103-9175-4df92545e8f9
//# sourceMappingURL=chunk-WAIVFTXW.js.map
