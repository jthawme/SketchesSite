// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/inherits/inherits_browser.js":[function(require,module,exports) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],"../node_modules/node-libs-browser/node_modules/events/events.js":[function(require,module,exports) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';

var R = typeof Reflect === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;

if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}

module.exports = EventEmitter; // Backwards-compat with node 0.10.x

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.

var defaultMaxListeners = 10;
Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function () {
    return defaultMaxListeners;
  },
  set: function (arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }

    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}; // Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.


EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }

  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];

  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);

  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false; // If there is no 'error' event listener then throw.

  if (doError) {
    var er;
    if (args.length > 0) er = args[0];

    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    } // At least give some kind of context to the user


    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];
  if (handler === undefined) return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);

    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = target._events;

  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object

      events = target._events;
    }

    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener]; // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    } // Check for listener leak


    m = $getMaxListeners(target);

    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true; // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax

      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  var args = [];

  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);

  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
}; // Emits a 'removeListener' event if and only if the listener was removed.


EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;

  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }

    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this; // not listening for removeListener, no need to emit

  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }

    return this;
  } // emit removeListener for all listeners on all events


  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;

    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }

    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  listeners = events[type];

  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;

function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);

  for (var i = 0; i < n; ++i) copy[i] = arr[i];

  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];

  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);

  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }

  return ret;
}
},{}],"../node_modules/right-now/browser.js":[function(require,module,exports) {
var global = arguments[3];
module.exports =
  global.performance &&
  global.performance.now ? function now() {
    return performance.now()
  } : Date.now || function now() {
    return +new Date
  }

},{}],"../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/performance-now/lib/performance-now.js":[function(require,module,exports) {
var process = require("process");
// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);



},{"process":"../node_modules/process/browser.js"}],"../node_modules/raf/index.js":[function(require,module,exports) {
var global = arguments[3];
var now = require('performance-now')
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf
  object.cancelAnimationFrame = caf
}

},{"performance-now":"../node_modules/performance-now/lib/performance-now.js"}],"../node_modules/raf-loop/index.js":[function(require,module,exports) {
var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter
var now = require('right-now')
var raf = require('raf')

module.exports = Engine
function Engine(fn) {
    if (!(this instanceof Engine)) 
        return new Engine(fn)
    this.running = false
    this.last = now()
    this._frame = 0
    this._tick = this.tick.bind(this)

    if (fn)
        this.on('tick', fn)
}

inherits(Engine, EventEmitter)

Engine.prototype.start = function() {
    if (this.running) 
        return
    this.running = true
    this.last = now()
    this._frame = raf(this._tick)
    return this
}

Engine.prototype.stop = function() {
    this.running = false
    if (this._frame !== 0)
        raf.cancel(this._frame)
    this._frame = 0
    return this
}

Engine.prototype.tick = function() {
    this._frame = raf(this._tick)
    var time = now()
    var dt = time - this.last
    this.emit('tick', dt)
    this.last = time
}
},{"inherits":"../node_modules/inherits/inherits_browser.js","events":"../node_modules/node-libs-browser/node_modules/events/events.js","right-now":"../node_modules/right-now/browser.js","raf":"../node_modules/raf/index.js"}],"js/utils/engine.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rafLoop = _interopRequireDefault(require("raf-loop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DEFAULTS = {
  debug: false,
  width: 480,
  height: 480,
  pixelRatio: window.devicePixelRatio,
  clickToggleDebug: true,
  pixelate: 1
};

var SketchEngine =
/*#__PURE__*/
function () {
  function SketchEngine(canvasEl) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, SketchEngine);

    this.options = _objectSpread({}, DEFAULTS, {}, opts);
    this.canvasEl = canvasEl;
    this.canvasCtx = this.canvasEl.getContext('2d');
    window.ctx = this.canvasCtx;
    this.frame = 0;
    this.loop = (0, _rafLoop.default)(this.update.bind(this));

    this._renderer = function () {};

    this._addEventListeners();

    this.updateDimensions(this.options.width, this.options.height, this.options.pixelate, this.options.pixelRatio);
  }

  _createClass(SketchEngine, [{
    key: "_addEventListeners",
    value: function _addEventListeners() {
      var _this = this;

      this.canvasEl.addEventListener('click', function () {
        _this.options.debug = !_this.options.debug;
        document.body.classList.toggle('debug', _this.options.debug);
      }, false);
    }
  }, {
    key: "updateDimensions",
    value: function updateDimensions(width, height, pixelate, pixelRatio) {
      this.canvasEl.width = width * pixelRatio;
      this.canvasEl.height = height * pixelRatio;
      this.canvasEl.width = width * pixelRatio;
      this.canvasEl.height = height * pixelRatio;
      this.canvasEl.style.width = "".concat(width * pixelate, "px");
      this.canvasEl.style.height = "".concat(height * pixelate, "px");
      this.canvasCtx.scale(pixelRatio, pixelRatio);
    }
  }, {
    key: "onRender",
    value: function onRender() {
      var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      this._renderer = fn;
    }
  }, {
    key: "start",
    value: function start() {
      this.loop.start();
    }
  }, {
    key: "update",
    value: function update(dt) {
      this._renderer({
        debug: this.options.debug,
        frame: this.frame,
        deltaTime: dt,
        width: this.options.width,
        height: this.options.height
      });

      this.frame++;
    }
  }, {
    key: "stop",
    value: function stop() {
      this.loop.stop();
    }
  }]);

  return SketchEngine;
}();

var _default = SketchEngine;
exports.default = _default;
},{"raf-loop":"../node_modules/raf-loop/index.js"}],"js/utils/vector.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Vector =
/*#__PURE__*/
function () {
  function Vector() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$x = _ref.x,
        x = _ref$x === void 0 ? 0 : _ref$x,
        _ref$y = _ref.y,
        y = _ref$y === void 0 ? 0 : _ref$y,
        _ref$magnitude = _ref.magnitude,
        magnitude = _ref$magnitude === void 0 ? 1 : _ref$magnitude;

    _classCallCheck(this, Vector);

    this.x = x;
    this.y = y;
    this.magnitude = magnitude;
    return this;
  }
  /**
   * Sets the x and y position at the same time
   *
   * @param {Number} x
   * @param {Number} y
   */


  _createClass(Vector, [{
    key: "set",
    value: function set(x, y) {
      this.x = x;
      this.y = y;
      return this;
    }
    /**
     * Sets the magnitude of the vector.
     * This is like how 'far' the vector moves
     * each frame
     *
     * @param {Number} magnitude
     */

  }, {
    key: "setMag",
    value: function setMag(magnitude) {
      this.normalize();
      this.magnitude = magnitude;
      return this.mult(this.magnitude);
    }
    /**
     * Sets the angle of the vector.
     * This works out the x/y combo to
     * move in a certain direction
     *
     * @param {Number} angle in radians
     */

  }, {
    key: "setAngle",
    value: function setAngle(angle) {
      this.x = Math.cos(angle);
      this.y = Math.sin(angle);
      return this.mult(this.magnitude);
    }
    /**
     * Gets the current angle of the vector
     */

  }, {
    key: "getAngle",
    value: function getAngle() {
      return Math.atan2(this.y, this.x);
    }
    /**
     * Gets the angle of a vector like object
     * from this vector
     *
     * @param {object} Vector
     */

  }, {
    key: "getAngleOf",
    value: function getAngleOf(_ref2) {
      var x = _ref2.x,
          y = _ref2.y;
      return Math.atan2(y - this.y, x - this.x);
    }
    /**
     * Rotates the vector by an angle
     *
     * @param {Number} angle in radians
     */

  }, {
    key: "rotate",
    value: function rotate(angle) {
      var _angle = this.getAngle() + angle;

      return this.setAngle(_angle % (Math.PI * 2));
    }
    /**
     * Returns the vector to a unit of 1
     */

  }, {
    key: "normalize",
    value: function normalize() {
      return this.mult(1 / this.magnitude);
    }
    /**
     * Multiplies the vector uniformly
     * by a number
     *
     * @param {Number} num
     */

  }, {
    key: "mult",
    value: function mult(num) {
      this.x *= num;
      this.y *= num;
      return this;
    }
    /**
     * Divides the vector uniformly
     * by a number
     *
     * @param {Number} num
     */

  }, {
    key: "div",
    value: function div(num) {
      this.x /= num;
      this.y /= num;
      return this;
    }
    /**
     * Subtracts a vector like object
     *
     * @param {object} Vector
     */

  }, {
    key: "sub",
    value: function sub(_ref3) {
      var x = _ref3.x,
          y = _ref3.y;
      this.x -= x;
      this.y -= y;
      return this;
    }
    /**
     * Adds a vector like object
     *
     * @param {object} Vector
     */

  }, {
    key: "add",
    value: function add(_ref4) {
      var x = _ref4.x,
          y = _ref4.y;
      this.x += x;
      this.y += y;
      return this;
    }
    /**
     * Gets distnace between 2 vectors
     *
     * @param {object} Vector
     */

  }, {
    key: "getDistance",
    value: function getDistance(_ref5) {
      var x = _ref5.x,
          y = _ref5.y;
      var a = this.x - x;
      var b = this.y - y;
      return Math.sqrt(a * a + b * b);
    }
    /**
     * Sets a random angle for the vector
     */

  }, {
    key: "randomAngle",
    value: function randomAngle() {
      return this.setAngle(Math.PI * 2 * Math.random());
    }
    /**
     * Returns a new vector from current
     * settings
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Vector({
        x: this.x,
        y: this.y,
        magnitude: this.magnitude
      });
    }
  }]);

  return Vector;
}();

exports.default = Vector;
},{}],"js/utils/paths.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPointOnArc = exports.arcPath = exports.circlePath = exports.rectPath = exports.cubicBezierPath = exports.getPointOnCubicBezier = exports.quadraticBezierPath = exports.getPointOnQuadraticBezier = void 0;

var getPointOnQuadraticBezier = function getPointOnQuadraticBezier(t, p0, p1, p2) {
  var invT = 1 - t;
  return {
    x: invT * invT * p0.x + 2 * invT * t * p1.x + t * t * p2.x,
    y: invT * invT * p0.y + 2 * invT * t * p1.y + t * t * p2.y
  };
};

exports.getPointOnQuadraticBezier = getPointOnQuadraticBezier;

var quadraticBezierPath = function quadraticBezierPath(p1x, p1y, cp1x, cp1y, p2x, p2y) {
  var segments = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 50;
  var angleSegment = 1 / segments;
  var line = [];

  for (var i = 0; i <= segments; i++) {
    var t = angleSegment * i;
    line.push(getPointOnQuadraticBezier(t, {
      x: p1x,
      y: p1y
    }, {
      x: cp1x,
      y: cp1y
    }, {
      x: p2x,
      y: p2y
    }));
  }

  return line;
};

exports.quadraticBezierPath = quadraticBezierPath;

var getPointOnCubicBezier = function getPointOnCubicBezier(t, p0, p1, p2, p3) {
  return {
    x: Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x,
    y: Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y
  };
};

exports.getPointOnCubicBezier = getPointOnCubicBezier;

var cubicBezierPath = function cubicBezierPath(p1x, p1y, cp1x, cp1y, cp2x, cp2y, p2x, p2y) {
  var segments = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 50;
  var angleSegment = 1 / segments;
  var line = [];

  for (var i = 0; i <= segments; i++) {
    var t = angleSegment * i;
    line.push(getPointOnCubicBezier(t, {
      x: p1x,
      y: p1y
    }, {
      x: cp1x,
      y: cp1y
    }, {
      x: cp2x,
      y: cp2y
    }, {
      x: p2x,
      y: p2y
    }));
  }

  return line;
};

exports.cubicBezierPath = cubicBezierPath;

var rectPath = function rectPath(tlx, tly, width, height) {
  return [{
    x: tlx,
    y: tly
  }, {
    x: tlx + width,
    y: tly
  }, {
    x: tlx + width,
    y: tly + height
  }, {
    x: tlx,
    y: tly + height
  }];
};

exports.rectPath = rectPath;

var circlePath = function circlePath(cx, cy, radius) {
  var segments = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 50;
  var startingAngle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  return arcPath(cx, cy, radius, Math.PI * 2, segments, startingAngle);
};

exports.circlePath = circlePath;

var arcPath = function arcPath(cx, cy, radius, angle) {
  var segments = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 50;
  var startingAngle = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  var angleSegment = angle / segments;
  var angleOffset = startingAngle;
  var path = [];

  for (var i = 0; i <= segments; i++) {
    path.push(getPointOnArc(cx, cy, angleOffset + angleSegment * i, radius));
  }

  return path;
};

exports.arcPath = arcPath;

var getPointOnArc = function getPointOnArc(cx, cy, angle, radius) {
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius
  };
};

exports.getPointOnArc = getPointOnArc;
},{}],"js/script.js":[function(require,module,exports) {
"use strict";

var _engine = _interopRequireDefault(require("./utils/engine"));

var _vector = _interopRequireDefault(require("./utils/vector"));

var _paths = require("./utils/paths");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WIDTH = 480;
var HEIGHT = 480;
var el = document.getElementById('canvas'); // const el = document.getElementById('container');

var app = new _engine.default(el, {
  debug: false,
  width: WIDTH,
  height: HEIGHT
});

var Dot =
/*#__PURE__*/
function () {
  function Dot(x, y) {
    var magSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;

    _classCallCheck(this, Dot);

    this.position = new _vector.default({
      x: x,
      y: y
    });
    this.angle = new _vector.default().randomAngle();
    this.parallel = this._calculateParallel(magSize);
  }

  _createClass(Dot, [{
    key: "_calculateParallel",
    value: function _calculateParallel(magSize) {
      var parallel = new _vector.default({
        x: this.angle.y,
        y: -this.angle.x
      }).setMag(magSize);
      var parallel2 = parallel.clone().rotate(Math.PI);
      return [this.position.clone().add(parallel), this.position.clone().add(parallel2)];
    }
  }, {
    key: "render",
    value: function render() {
      ctx.save();
      ctx.beginPath();
      ctx.fillRect(this.position.x, this.position.y, 5, 5);
      ctx.fillStyle = 'red';
      ctx.fillRect(this.parallel[0].x, this.parallel[0].y, 5, 5);
      ctx.fillRect(this.parallel[1].x, this.parallel[1].y, 5, 5);
      ctx.restore();
    }
  }]);

  return Dot;
}();

function createLine(width) {
  var total = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 9;
  return new Array(total).fill(1).map(function (v, idx) {
    return new Dot(width / (total - 1) * idx, 0);
  });
}

var paths = createPaths(createLine(WIDTH * 0.8, 10));

function createPaths(_line) {
  var path = [];
  path.push({
    x: _line[0].position.x,
    y: _line[0].position.y
  });

  for (var i = 1; i < _line.length; i++) {
    path = path.concat((0, _paths.cubicBezierPath)(_line[i - 1].position.x, _line[i - 1].position.y, _line[i - 1].parallel[1].x, _line[i - 1].parallel[1].y, _line[i].parallel[0].x, _line[i].parallel[0].y, _line[i].position.x, _line[i].position.y, 25)); // _ctx.bezierCurveTo(
    //   _line[i - 1].parallel[1].x, _line[i - 1].parallel[1].y + yOffset,
    //   _line[i].parallel[0].x, _line[i].parallel[0].y + yOffset,
    //   _line[i].position.x, _line[i].position.y + yOffset,
    // );
  }

  return path;
}

function drawCurve(_ctx, _line) {
  var moveTo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var yOffset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  if (moveTo) {
    _ctx.moveTo(_line[0].position.x, _line[0].position.y + yOffset);
  }

  for (var i = 1; i < _line.length; i++) {
    _ctx.bezierCurveTo(_line[i - 1].parallel[1].x, _line[i - 1].parallel[1].y + yOffset, _line[i].parallel[0].x, _line[i].parallel[0].y + yOffset, _line[i].position.x, _line[i].position.y + yOffset);
  }
}

var colours = ['blue', 'white', 'red'];

function drawFlagLine() {
  ctx.moveTo(paths[0].x, paths[1].y);
  var flagIndex = -1;
  var start = Math.floor(Math.random() * paths.length);
  var end = Math.floor(Math.random() * (paths.length - start));

  for (var i = start; i < start + end; i++) {
    var currFlagIndex = Math.floor(i / (paths.length / 3));

    if (flagIndex !== currFlagIndex) {
      flagIndex = currFlagIndex;
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = colours[flagIndex];
    }

    ctx.lineTo(paths[i].x, paths[i].y);
  }

  ctx.stroke();
}

app.onRender(function (_ref) {
  var frame = _ref.frame,
      width = _ref.width,
      height = _ref.height,
      debug = _ref.debug;

  if (frame % 120 == 0) {
    paths = createPaths(createLine(WIDTH * 0.8, 10));
  }

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width * 0.1, height * 0.25);

  for (var i = 0; i < height * 0.5; i++) {
    ctx.translate(0, 1);
    drawFlagLine();
  }

  ctx.restore();
});
app.start();
},{"./utils/engine":"js/utils/engine.js","./utils/vector":"js/utils/vector.js","./utils/paths":"js/utils/paths.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62506" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/script.js"], null)
//# sourceMappingURL=/script.d573be0b.js.map