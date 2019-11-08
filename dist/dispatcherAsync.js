/*!
 * dispatcherAsync
 * https://github.com/RobinHerbots/flux-dispatcherasync#readme
 * Copyright (c) 2010 - 2019 
 * Licensed under the MIT license
 * Version: 0.0.4
 */
!function webpackUniversalModuleDefinition(root, factory) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = factory(require("underscore")); else if ("function" == typeof define && define.amd) define([ "underscore" ], factory); else {
        var a = "object" == typeof exports ? factory(require("underscore")) : factory(root.underscore);
        for (var i in a) ("object" == typeof exports ? exports : root)[i] = a[i];
    }
}(window, function(__WEBPACK_EXTERNAL_MODULE__1__) {
    return modules = [ function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), Object.defineProperty(exports, "Dispatcher", {
            enumerable: !0,
            get: function get() {
                return _flux.Dispatcher;
            }
        }), Object.defineProperty(exports, "isPromise", {
            enumerable: !0,
            get: function get() {
                return _isPromise.default;
            }
        });
        var _underscore = _interopRequireDefault(__webpack_require__(1)), _flux = __webpack_require__(2), _isPromise = _interopRequireDefault(__webpack_require__(5));
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        _flux.Dispatcher.prototype._invokeCallback = function(id) {
            this._isPending[id] = !0;
            var resp = this._callbacks[id](this._pendingPayload);
            this._isHandled[id] = !(0, _isPromise.default)(resp) || resp;
        };
        var _waitFor = _flux.Dispatcher.prototype.waitFor;
        _flux.Dispatcher.prototype.waitFor = function(ids) {
            this._pendingPayload.await = ids, _waitFor.call(this, ids);
        }, _flux.Dispatcher.prototype.dispatch = function dispatch(payload) {
            var that = this, cbNdxs = Object.keys(this._callbacks), CallbackLoop = _underscore.default.bind(function(id) {
                var _this = this;
                return new Promise(function(resolve, reject) {
                    if (void 0 === id) return resolve();
                    var pendingPromises = [], awaitToken;
                    if (_this._pendingPayload && _this._pendingPayload.await) for (;awaitToken = _this._pendingPayload.await.pop(); ) (0, 
                    _isPromise.default)(_this._isHandled[awaitToken]) && pendingPromises.push(_this._isHandled[awaitToken]);
                    Promise.all(pendingPromises).then(function() {
                        _this._isPending[id] || _this._invokeCallback(id), CallbackLoop(cbNdxs.shift()).then(resolve, reject);
                    }, reject);
                });
            }, this);
            this._startDispatching(payload), CallbackLoop(cbNdxs.shift()).then(function() {
                that._stopDispatching();
            }, function() {
                that._stopDispatching();
            });
        };
    }, function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE__1__;
    }, function(module, exports, __webpack_require__) {
        module.exports.Dispatcher = __webpack_require__(3);
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        exports.__esModule = !0;
        var invariant = __webpack_require__(4), _prefix = "ID_", Dispatcher = function() {
            function Dispatcher() {
                _classCallCheck(this, Dispatcher), this._callbacks = {}, this._isDispatching = !1, 
                this._isHandled = {}, this._isPending = {}, this._lastID = 1;
            }
            return Dispatcher.prototype.register = function register(callback) {
                var id = "ID_" + this._lastID++;
                return this._callbacks[id] = callback, id;
            }, Dispatcher.prototype.unregister = function unregister(id) {
                this._callbacks[id] || invariant(!1), delete this._callbacks[id];
            }, Dispatcher.prototype.waitFor = function waitFor(ids) {
                this._isDispatching || invariant(!1);
                for (var ii = 0; ii < ids.length; ii++) {
                    var id = ids[ii];
                    this._isPending[id] ? this._isHandled[id] || invariant(!1) : (this._callbacks[id] || invariant(!1), 
                    this._invokeCallback(id));
                }
            }, Dispatcher.prototype.dispatch = function dispatch(payload) {
                this._isDispatching && invariant(!1), this._startDispatching(payload);
                try {
                    for (var id in this._callbacks) this._isPending[id] || this._invokeCallback(id);
                } finally {
                    this._stopDispatching();
                }
            }, Dispatcher.prototype.isDispatching = function isDispatching() {
                return this._isDispatching;
            }, Dispatcher.prototype._invokeCallback = function _invokeCallback(id) {
                this._isPending[id] = !0, this._callbacks[id](this._pendingPayload), this._isHandled[id] = !0;
            }, Dispatcher.prototype._startDispatching = function _startDispatching(payload) {
                for (var id in this._callbacks) this._isPending[id] = !1, this._isHandled[id] = !1;
                this._pendingPayload = payload, this._isDispatching = !0;
            }, Dispatcher.prototype._stopDispatching = function _stopDispatching() {
                delete this._pendingPayload, this._isDispatching = !1;
            }, Dispatcher;
        }();
        module.exports = Dispatcher;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var validateFormat = function validateFormat(format) {};
        function invariant(condition, format, a, b, c, d, e, f) {
            if (!condition) {
                var error;
                if (void 0 === format) error = new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."); else {
                    var args = [ a, b, c, d, e, f ], argIndex = 0;
                    error = new Error(format.replace(/%s/g, function() {
                        return args[argIndex++];
                    })), error.name = "Invariant Violation";
                }
                throw error.framesToPop = 1, error;
            }
        }
        module.exports = invariant;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function _typeof(obj) {
            return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function _typeof(obj) {
                return typeof obj;
            } : function _typeof(obj) {
                return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            }, _typeof(obj);
        }
        function _default(obj) {
            return !!obj && ("object" === _typeof(obj) || "function" == typeof obj) && "function" == typeof obj.then;
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.default = _default;
    } ], installedModules = {}, __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
    __webpack_require__.d = function(exports, name, getter) {
        __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
            enumerable: !0,
            get: getter
        });
    }, __webpack_require__.r = function(exports) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    }, __webpack_require__.t = function(value, mode) {
        if (1 & mode && (value = __webpack_require__(value)), 8 & mode) return value;
        if (4 & mode && "object" == typeof value && value && value.__esModule) return value;
        var ns = Object.create(null);
        if (__webpack_require__.r(ns), Object.defineProperty(ns, "default", {
            enumerable: !0,
            value: value
        }), 2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
            return value[key];
        }.bind(null, key));
        return ns;
    }, __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function getDefault() {
            return module.default;
        } : function getModuleExports() {
            return module;
        };
        return __webpack_require__.d(getter, "a", getter), getter;
    }, __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 0);
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: !1,
            exports: {}
        };
        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
        module.l = !0, module.exports;
    }
    var modules, installedModules;
});